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

type CheckUpdatesEndpointOptions = {
	pool: Pool;
	encryptionKey: string;
};

const checkUpdatesBodySchema = z.object({
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

	return "Unable to check 7shifts schedule updates";
}

function sameInstant(
	left: Date | string | null,
	right: Date | null,
) {
	if (left === null && right === null) {
		return true;
	}

	if (left === null || right === null) {
		return false;
	}

	return (
		new Date(left).getTime() ===
		right.getTime()
	);
}

export const createCheckSevenShiftsScheduleUpdatesEndpoint = ({
	pool,
	encryptionKey,
}: CheckUpdatesEndpointOptions) =>
	createAuthEndpoint(
		"/seven-shifts-schedules/check-updates",
		{
			method: "POST",
			use: [sessionMiddleware],
			body: checkUpdatesBodySchema,
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
						sourceId: mapping.sourceId,
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

				const weekStart =
					ctx.body.weekStart;

				const weekEnd =
					addDays(
						weekStart,
						7,
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

				const remote = shifts
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

						const scheduleDate =
							localDate(
								scheduledStartAt,
								location.timezone,
							);

						return {
							shift,
							scheduleDate,
							sourceUpdatedAt:
								optionalApiDate(
									shift.modified,
									"modified",
									shift.id,
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

				const local =
					await pool.query<{
						sevenShiftsShiftId: number;
						sourceUpdatedAt:
							Date | null;
					}>(
						'SELECT "sevenShiftsShiftId", "sourceUpdatedAt" FROM "sevenShiftsScheduledShift" WHERE "organizationId" = $1 AND "scheduleDate" >= $2 AND "scheduleDate" < $3',
						[
							organizationId,
							weekStart,
							weekEnd,
						],
					);

				const localByShiftId =
					new Map(
						local.rows.map((row) => [
							row.sevenShiftsShiftId,
							row,
						]),
					);

				let updatesAvailable =
					remote.length !==
					local.rows.length;

				if (!updatesAvailable) {
					for (const item of remote) {
						const localShift =
							localByShiftId.get(
								item.shift.id,
							);

						if (
							!localShift ||
							!sameInstant(
								localShift.sourceUpdatedAt,
								item.sourceUpdatedAt,
							)
						) {
							updatesAvailable =
								true;

							break;
						}
					}
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
					updatesAvailable,
					remoteShiftCount:
						remote.length,
					localShiftCount:
						local.rows.length,
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
