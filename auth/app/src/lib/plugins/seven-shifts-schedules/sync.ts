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
	type SevenShiftsShift,
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

type SyncEndpointOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

const syncBodySchema = z.object({
	sourceId: z.string().min(1),
	weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

async function isGlobalAdmin(
	pool: Pool,
	userId: string,
) {
	const result =
		await pool.query<UserRoleRow>(
			`
				SELECT role
				FROM "user"
				WHERE id = $1
				LIMIT 1
			`,
			[userId],
		);

	return result.rows[0]?.role === "admin";
}

function errorMessage(
	error: unknown,
) {
	if (
		error instanceof
		SevenShiftsApiError
	) {
		return (
			"7shifts API returned HTTP " +
			error.status
		);
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Unable to sync schedules from 7shifts";
}

export const createSyncSevenShiftsSchedulesEndpoint = ({
	pool,
	encryptionKey,
}: SyncEndpointOptions) =>
	createAuthEndpoint(
				"/seven-shifts-schedules/sync",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: syncBodySchema,
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
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
						const connection =
							await getSevenShiftsApiConnection({
								pool,
								sourceId: ctx.body.sourceId,
								encryptionKey,
							});

						const mappings =
							await pool.query<{
								organizationId: string;
								organizationName: string;
								sevenShiftsLocationId: number;
								sevenShiftsLocationName: string;
							}>(
								`
									SELECT
										os."organizationId",
										o.name AS "organizationName",
										os."sevenShiftsLocationId",
										os."sevenShiftsLocationName"
									FROM
										"sevenShiftsApiOrganizationSource" AS os
									JOIN organization AS o
										ON o.id = os."organizationId"
									WHERE
										os."sourceId" = $1
									ORDER BY
										o.name
								`,
								[connection.source.id],
							);

						if (mappings.rows.length === 0) {
							throw new Error(
								"No organizations are mapped to this 7shifts API Source",
							);
						}

						const locations =
							await listSevenShiftsLocations({
								accessToken: connection.accessToken,
								companyId: connection.companyId,
								apiVersion: connection.apiVersion,
							});

						const locationById =
							new Map(
								locations.map((location) => [
									location.id,
									location,
								]),
							);

						const mappedLocations =
							mappings.rows.map((mapping) => {
								const location =
									locationById.get(
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

								return {
									...mapping,
									timezone: location.timezone,
								};
							});

						const queryStarts =
							mappedLocations.map((mapping) =>
								localMidnightToUtc(
									weekStart,
									mapping.timezone,
								),
							);

						const queryEnds =
							mappedLocations.map((mapping) =>
								localMidnightToUtc(
									weekEnd,
									mapping.timezone,
								),
							);

						const queryStart =
							new Date(
								Math.min(
									...queryStarts.map((date) =>
										date.getTime(),
									),
								),
							);

						const queryEnd =
							new Date(
								Math.max(
									...queryEnds.map((date) =>
										date.getTime(),
									),
								),
							);

						const shifts =
							await listSevenShiftsShifts({
								accessToken: connection.accessToken,
								companyId: connection.companyId,
								start: queryStart.toISOString(),
								end: queryEnd.toISOString(),
								includeDeleted: true,
								includeDraft: false,
								apiVersion: connection.apiVersion,
							});

						const mappingByLocation =
							new Map(
								mappedLocations.map((mapping) => [
									mapping.sevenShiftsLocationId,
									mapping,
								]),
							);

						const imported: Array<{
							shift: SevenShiftsShift;
							organizationId: string;
							organizationName: string;
							timezone: string;
							scheduleDate: string;
							scheduledStartAt: Date;
						}> = [];

						let unmappedShifts = 0;
						let outsideWeek = 0;

						for (const shift of shifts) {
							const mapping =
								mappingByLocation.get(
									shift.location_id,
								);

							if (!mapping) {
								unmappedShifts++;

								continue;
							}

							const scheduledStartAt =
								requiredApiDate(
									shift.start,
									"start",
									shift.id,
								);

							const scheduleDate =
								localDate(
									scheduledStartAt,
									mapping.timezone,
								);

							if (
								scheduleDate < weekStart ||
								scheduleDate >= weekEnd
							) {
								outsideWeek++;

								continue;
							}

							imported.push({
								shift,
								organizationId:
									mapping.organizationId,
								organizationName:
									mapping.organizationName,
								timezone:
									mapping.timezone,
								scheduleDate,
								scheduledStartAt,
							});
						}

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
								employeeRows.rows.map((employee) => [
									employee.sevenShiftsUserId,
									employee.userId,
								]),
							);

						const database =
							await pool.connect();

						let inserted = 0;
						let updated = 0;

						try {
							await database.query("BEGIN");

							const shiftIds =
								imported.map(
									(item) => item.shift.id,
								);

							const existingIds =
								shiftIds.length === 0
									? new Set<number>()
									: new Set(
										(
											await database.query<{
												sevenShiftsShiftId: number;
											}>(
												`
													SELECT
														"sevenShiftsShiftId"
													FROM
														"sevenShiftsScheduledShift"
													WHERE
														"sevenShiftsShiftId" =
															ANY($1::integer[])
												`,
												[shiftIds],
											)
										).rows.map(
											(row) =>
												row.sevenShiftsShiftId,
										),
									);

							for (const item of imported) {
								const shift = item.shift;

								const userId =
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
										item.organizationId,
										shift.id,
										shift.location_id,
										shift.user_id ?? null,
										userId,
										shift.department_id ?? null,
										shift.role_id ?? null,
										shift.station ?? null,
										shift.station_id ?? null,
										shift.station_name ?? null,
										item.timezone,
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
										shift.unassigned_skill_level ?? null,
										shift.open_offer_type === null ||
										shift.open_offer_type === undefined
											? null
											: String(shift.open_offer_type),
										shift.publish_status ?? null,
										shift.attendance_status ?? null,
										shift.late_minutes ?? null,
										shift.breaks === undefined
											? null
											: JSON.stringify(shift.breaks),
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

								if (existingIds.has(shift.id)) {
									updated++;
								} else {
									inserted++;
								}
							}

							await database.query("COMMIT");
						} catch (error) {
							await database.query("ROLLBACK");

							throw error;
						} finally {
							database.release();
						}

						const organizations =
							mappedLocations.map((mapping) => {
								const organizationShifts =
									imported.filter(
										(item) =>
											item.organizationId ===
											mapping.organizationId,
									);

								return {
									organizationId:
										mapping.organizationId,
									organizationName:
										mapping.organizationName,
									sevenShiftsLocationId:
										mapping.sevenShiftsLocationId,
									timezone:
										mapping.timezone,
									shifts:
										organizationShifts.length,
									overnightShifts:
										organizationShifts.filter((item) => {
											const end = optionalApiDate(
												item.shift.end,
												"end",
												item.shift.id,
											);

											return (
												end !== null &&
												localDate(
													end,
													item.timezone,
												) !== item.scheduleDate
											);
										}).length,
									deletedShifts:
										organizationShifts.filter(
											(item) =>
												item.shift.deleted === true,
										).length,
								};
							});

						return ctx.json({
							source: {
								id: connection.source.id,
								name: connection.source.name,
								companyId: connection.companyId,
								companyName:
									connection.source.companyName,
							},
							week: {
								start: weekStart,
								end: addDays(weekStart, 6),
							},
							queryRange: {
								start: queryStart.toISOString(),
								end: queryEnd.toISOString(),
							},
							summary: {
								fetchedShifts: shifts.length,
								importedShifts: imported.length,
								inserted,
								updated,
								linkedShifts:
									imported.filter(
										(item) =>
											item.shift.user_id !== null &&
											item.shift.user_id !== undefined &&
											userIdBySevenShiftsId.has(
												item.shift.user_id,
											),
									).length,
								unmappedShifts,
								outsideWeek,
							},
							organizations,
						});
					} catch (error) {
						return ctx.json(
							{
								error: errorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			);
