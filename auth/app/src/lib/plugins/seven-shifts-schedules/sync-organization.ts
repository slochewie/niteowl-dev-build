import { randomUUID } from "node:crypto";

import {
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	listSevenShiftsLocations,
	listSevenShiftsShifts,
	SevenShiftsApiError,
} from "../seven-shifts-api/client.js";
import { getSevenShiftsApiConnection } from "../seven-shifts-api/source.js";
import {
	addDays,
	isSunday,
	localDate,
	localMidnightToUtc,
	optionalApiDate,
	requiredApiDate,
	validateTimezone,
} from "./schedule-time.js";
import { canManageScheduleSync } from "./sync-controls.js";

type SyncOrganizationEndpointOptions = {
	pool: Pool;
	encryptionKey: string;
};

const syncOrganizationBodySchema = z.object({
	organizationId: z.string().min(1),
	weekStart: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
});

function errorMessage(error: unknown) {
	if (error instanceof SevenShiftsApiError) {
		return (
			"7shifts API returned HTTP " +
			error.status
		);
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Unable to sync schedule from 7shifts";
}

export const createSyncSevenShiftsOrganizationEndpoint = ({
	pool,
	encryptionKey,
}: SyncOrganizationEndpointOptions) =>
	createAuthEndpoint(
		"/seven-shifts-schedules/sync-organization",
		{
			method: "POST",
			use: [sessionMiddleware],
			body: syncOrganizationBodySchema,
		},
		async (ctx) => {
			const organizationId =
				ctx.body.organizationId;

			const userId =
				ctx.context.session.user.id;

			const allowed =
				await canManageScheduleSync(
					pool,
					userId,
					organizationId,
				);

			if (!allowed) {
				return ctx.json(
					{
						error: "Forbidden",
					},
					{
						status: 403,
					},
				);
			}

			if (!isSunday(ctx.body.weekStart)) {
				return ctx.json(
					{
						error:
							"weekStart must be a valid Sunday in YYYY-MM-DD format",
					},
					{
						status: 400,
					},
				);
			}

			const weekStart =
				ctx.body.weekStart;

			const weekEnd =
				addDays(
					weekStart,
					7,
				);

			try {
				const mappingResult =
					await pool.query<{
						organizationId: string;
						organizationName: string;
						sourceId: string;
						sevenShiftsLocationId: number;
						sevenShiftsLocationName: string;
					}>(
						'SELECT o.id AS "organizationId", o.name AS "organizationName", os."sourceId", os."sevenShiftsLocationId", os."sevenShiftsLocationName" FROM organization AS o JOIN "sevenShiftsApiOrganizationSource" AS os ON os."organizationId" = o.id WHERE o.id = $1 LIMIT 1',
						[organizationId],
					);

				if (mappingResult.rowCount !== 1) {
					return ctx.json(
						{
							error:
								"Organization is not mapped to a 7shifts location",
						},
						{
							status: 400,
						},
					);
				}

				const mapping =
					mappingResult.rows[0];

				const connection =
					await getSevenShiftsApiConnection({
						pool,
						sourceId:
							mapping.sourceId,
						encryptionKey,
					});

				const locations =
					await listSevenShiftsLocations({
						accessToken:
							connection.accessToken,
						companyId:
							connection.companyId,
						apiVersion:
							connection.apiVersion,
					});

				const location =
					locations.find(
						(item) =>
							item.id ===
							mapping.sevenShiftsLocationId,
					);

				if (!location) {
					throw new Error(
						"Mapped 7shifts location " +
							mapping.sevenShiftsLocationId +
							" was not returned by the API",
					);
				}

				if (!location.timezone) {
					throw new Error(
						"7shifts location " +
							location.name +
							" has no timezone",
					);
				}

				validateTimezone(
					location.timezone,
				);

				const queryStart =
					localMidnightToUtc(
						weekStart,
						location.timezone,
					);

				const queryEnd =
					localMidnightToUtc(
						weekEnd,
						location.timezone,
					);

				const shifts =
					await listSevenShiftsShifts({
						accessToken:
							connection.accessToken,
						companyId:
							connection.companyId,
						locationId:
							mapping.sevenShiftsLocationId,
						start:
							queryStart.toISOString(),
						end:
							queryEnd.toISOString(),
						includeDeleted: true,
						includeDraft: false,
						apiVersion:
							connection.apiVersion,
					});

				const imported = shifts
					.filter(
						(shift) =>
							shift.location_id ===
							mapping.sevenShiftsLocationId,
					)
					.map((shift) => {
						const scheduledStartAt =
							requiredApiDate(
								shift.start,
								"start",
								shift.id,
							);

						return {
							shift,
							scheduledStartAt,
							scheduleDate:
								localDate(
									scheduledStartAt,
									location.timezone,
								),
						};
					})
					.filter(
						(item) =>
							item.scheduleDate >=
								weekStart &&
							item.scheduleDate <
								weekEnd,
					);

				const employeeRows =
					await pool.query<{
						sevenShiftsUserId: number;
						userId: string;
					}>(
						`
							SELECT
								"sevenShiftsUserId",
								"userId"
							FROM
								"sevenShiftsEmployee"
							WHERE
								"sevenShiftsUserId" IS NOT NULL
						`,
					);

				const userIdBySevenShiftsId =
					new Map(
						employeeRows.rows.map(
							(employee) => [
								employee.sevenShiftsUserId,
								employee.userId,
							],
						),
					);

				const database =
					await pool.connect();

				let inserted = 0;
				let updated = 0;

				try {
					await database.query(
						"BEGIN",
					);

					const shiftIds =
						imported.map(
							(item) =>
								item.shift.id,
						);

					const existingIds =
						shiftIds.length === 0
							? new Set<number>()
							: new Set(
									(
										await database.query<{
											sevenShiftsShiftId:
												number;
										}>(
											`
												SELECT
													"sevenShiftsShiftId"
												FROM
													"sevenShiftsScheduledShift"
												WHERE
													"organizationId" = $1
													AND "sevenShiftsShiftId" =
														ANY($2::integer[])
											`,
											[
												organizationId,
												shiftIds,
											],
										)
									).rows.map(
										(row) =>
											row.sevenShiftsShiftId,
									),
								);

					for (const item of imported) {
						const shift =
							item.shift;

						const linkedUserId =
							shift.user_id === null ||
							shift.user_id === undefined
								? null
								: userIdBySevenShiftsId.get(
										shift.user_id,
									) ?? null;

						await database.query(
							`
								INSERT INTO
									"sevenShiftsScheduledShift" (
										id,
										"sourceId",
										"organizationId",
										"sevenShiftsShiftId",
										"sevenShiftsLocationId",
										"sevenShiftsUserId",
										"userId",
										"sevenShiftsDepartmentId",
										"sevenShiftsRoleId",
										"stationNumber",
										"stationId",
										"stationName",
										"locationTimezone",
										"scheduleDate",
										"scheduledStartAt",
										"scheduledEndAt",
										"closesLocation",
										"endsAtBusinessDecline",
										notes,
										draft,
										notified,
										open,
										unassigned,
										"unassignedSkillLevel",
										"openOfferType",
										"publishStatus",
										"attendanceStatus",
										"lateMinutes",
										"breaksJson",
										deleted,
										"softDeletedAt",
										"sourceCreatedAt",
										"sourceUpdatedAt",
										"lastSeenAt",
										"createdAt",
										"updatedAt"
									)
								VALUES (
									$1, $2, $3, $4, $5, $6,
									$7, $8, $9, $10, $11, $12,
									$13, $14, $15, $16, $17, $18,
									$19, $20, $21, $22, $23, $24,
									$25, $26, $27, $28, $29, $30,
									$31, $32, $33,
									CURRENT_TIMESTAMP,
									CURRENT_TIMESTAMP,
									CURRENT_TIMESTAMP
								)
								ON CONFLICT ("sevenShiftsShiftId")
								DO UPDATE SET
									"sourceId" = EXCLUDED."sourceId",
									"organizationId" = EXCLUDED."organizationId",
									"sevenShiftsLocationId" = EXCLUDED."sevenShiftsLocationId",
									"sevenShiftsUserId" = EXCLUDED."sevenShiftsUserId",
									"userId" = EXCLUDED."userId",
									"sevenShiftsDepartmentId" = EXCLUDED."sevenShiftsDepartmentId",
									"sevenShiftsRoleId" = EXCLUDED."sevenShiftsRoleId",
									"stationNumber" = EXCLUDED."stationNumber",
									"stationId" = EXCLUDED."stationId",
									"stationName" = EXCLUDED."stationName",
									"locationTimezone" = EXCLUDED."locationTimezone",
									"scheduleDate" = EXCLUDED."scheduleDate",
									"scheduledStartAt" = EXCLUDED."scheduledStartAt",
									"scheduledEndAt" = EXCLUDED."scheduledEndAt",
									"closesLocation" = EXCLUDED."closesLocation",
									"endsAtBusinessDecline" = EXCLUDED."endsAtBusinessDecline",
									notes = EXCLUDED.notes,
									draft = EXCLUDED.draft,
									notified = EXCLUDED.notified,
									open = EXCLUDED.open,
									unassigned = EXCLUDED.unassigned,
									"unassignedSkillLevel" = EXCLUDED."unassignedSkillLevel",
									"openOfferType" = EXCLUDED."openOfferType",
									"publishStatus" = EXCLUDED."publishStatus",
									"attendanceStatus" = EXCLUDED."attendanceStatus",
									"lateMinutes" = EXCLUDED."lateMinutes",
									"breaksJson" = EXCLUDED."breaksJson",
									deleted = EXCLUDED.deleted,
									"softDeletedAt" = EXCLUDED."softDeletedAt",
									"sourceCreatedAt" = EXCLUDED."sourceCreatedAt",
									"sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt",
									"lastSeenAt" = CURRENT_TIMESTAMP,
									"updatedAt" = CURRENT_TIMESTAMP
							`,
							[
								randomUUID(),
								connection.source.id,
								organizationId,
								shift.id,
								shift.location_id,
								shift.user_id ?? null,
								linkedUserId,
								shift.department_id ?? null,
								shift.role_id ?? null,
								shift.station ?? null,
								shift.station_id ?? null,
								shift.station_name ?? null,
								location.timezone,
								item.scheduleDate,
								item.scheduledStartAt,
								optionalApiDate(
									shift.end,
									"end",
									shift.id,
								),
								shift.close === true,
								shift.business_decline === true,
								shift.notes ?? null,
								shift.draft === true,
								shift.notified === true,
								shift.open === true,
								shift.unassigned === true,
								shift.unassigned_skill_level ??
									null,
								shift.open_offer_type === null ||
								shift.open_offer_type ===
									undefined
									? null
									: String(
											shift.open_offer_type,
										),
								shift.publish_status ?? null,
								shift.attendance_status ?? null,
								shift.late_minutes ?? null,
								shift.breaks === undefined
									? null
									: JSON.stringify(
											shift.breaks,
										),
								shift.deleted === true,
								optionalApiDate(
									shift.soft_deleted,
									"soft_deleted",
									shift.id,
								),
								optionalApiDate(
									shift.created,
									"created",
									shift.id,
								),
								optionalApiDate(
									shift.modified,
									"modified",
									shift.id,
								),
							],
						);

						if (
							existingIds.has(
								shift.id,
							)
						) {
							updated++;
						} else {
							inserted++;
						}
					}

					await database.query(
						"COMMIT",
					);
				} catch (error) {
					await database.query(
						"ROLLBACK",
					);

					throw error;
				} finally {
					database.release();
				}

				return ctx.json({
					organization: {
						id:
							mapping.organizationId,
						name:
							mapping.organizationName,
					},
					location: {
						id:
							mapping.sevenShiftsLocationId,
						name:
							mapping.sevenShiftsLocationName,
						timezone:
							location.timezone,
					},
					week: {
						start:
							weekStart,
						end:
							addDays(
								weekStart,
								6,
							),
					},
					summary: {
						fetchedShifts:
							shifts.length,
						importedShifts:
							imported.length,
						inserted,
						updated,
						linkedShifts:
							imported.filter(
								(item) =>
									item.shift.user_id !==
										null &&
									item.shift.user_id !==
										undefined &&
									userIdBySevenShiftsId.has(
										item.shift.user_id,
									),
							).length,
						deletedShifts:
							imported.filter(
								(item) =>
									item.shift.deleted ===
									true,
							).length,
					},
				});
			} catch (error) {
				return ctx.json(
					{
						error:
							errorMessage(
								error,
							),
					},
					{
						status: 400,
					},
				);
			}
		},
	);
