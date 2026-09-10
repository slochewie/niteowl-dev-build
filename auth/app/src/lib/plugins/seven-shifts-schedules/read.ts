import {
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	getOrganizationMembership,
	isGlobalAdmin,
} from "../organization-member-status/access.js";
import { userHasLocationPermission } from "../seven-shifts/access.js";
import {
	addDays,
	isSunday,
} from "./schedule-time.js";

type ReadEndpointOptions = {
	pool: Pool;
};

type ScheduleRow = {
	sevenShiftsShiftId: number;
	sevenShiftsLocationId: number;
	sevenShiftsUserId: number | null;
	userId: string | null;
	userName: string | null;
	sevenShiftsDepartmentId: number | null;
	departmentName: string | null;
	sevenShiftsRoleId: number | null;
	roleName: string | null;
	stationNumber: number | null;
	stationId: number | null;
	stationName: string | null;
	locationTimezone: string;
	scheduleDate: string;
	scheduledStartAt: Date;
	scheduledEndAt: Date | null;
	closesLocation: boolean;
	endsAtBusinessDecline: boolean;
	notes: string | null;
	draft: boolean;
	notified: boolean;
	open: boolean;
	unassigned: boolean;
	unassignedSkillLevel: number | null;
	openOfferType: string | null;
	publishStatus: string | null;
	attendanceStatus: string | null;
	lateMinutes: number | null;
	breaksJson: string | null;
	deleted: boolean;
};

const weekQuerySchema = z.object({
	organizationId: z.string().min(1),
	weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	includeDeleted: z.enum(["true", "false"]).optional(),
});

async function canReadFullSchedule(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (
		await isGlobalAdmin(
			pool,
			userId,
			true,
		)
	) {
		return true;
	}

	const membership =
		await getOrganizationMembership(
			pool,
			organizationId,
			userId,
		);

	if (!membership?.active) {
		return false;
	}

	if (
		membership.role === "owner" ||
		membership.role === "admin"
	) {
		return true;
	}

	return userHasLocationPermission(
		pool,
		userId,
		"schedules",
		organizationId,
	);
}

function parseBreaks(
	value: string | null,
) {
	if (value === null) {
		return null;
	}

	try {
		return JSON.parse(value) as unknown;
	} catch {
		return null;
	}
}

export const createReadSevenShiftsScheduleWeekEndpoint = ({
	pool,
}: ReadEndpointOptions) =>
	createAuthEndpoint(
		"/seven-shifts-schedules/week",
		{
			method: "GET",
			use: [sessionMiddleware],
			query: weekQuerySchema,
		},
		async (ctx) => {
			const organizationId =
				ctx.query.organizationId;

			const weekStart =
				ctx.query.weekStart;

			if (!isSunday(weekStart)) {
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

			const allowed =
				await canReadFullSchedule(
					pool,
					ctx.context.session.user.id,
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

			const organization =
				await pool.query<{
					id: string;
					name: string;
					sevenShiftsLocationId: number | null;
					sevenShiftsLocationName: string | null;
					timezone: string | null;
				}>(
					`
						SELECT
							o.id,
							o.name,
							os."sevenShiftsLocationId",
							os."sevenShiftsLocationName",
							(
								SELECT
									s."locationTimezone"
								FROM
									"sevenShiftsScheduledShift" AS s
								WHERE
									s."organizationId" = o.id
								ORDER BY
									s."updatedAt" DESC
								LIMIT 1
							) AS timezone
						FROM organization AS o
						LEFT JOIN
							"sevenShiftsApiOrganizationSource" AS os
							ON os."organizationId" = o.id
						WHERE
							o.id = $1
						LIMIT 1
					`,
					[organizationId],
				);

			if (organization.rowCount !== 1) {
				return ctx.json(
					{
						error: "Organization not found",
					},
					{
						status: 404,
					},
				);
			}

			const weekEnd =
				addDays(
					weekStart,
					7,
				);

			const includeDeleted =
				ctx.query.includeDeleted === "true";

			const result =
				await pool.query<ScheduleRow>(
					`
						SELECT
							s."sevenShiftsShiftId",
							s."sevenShiftsLocationId",
							s."sevenShiftsUserId",
							s."userId",
							u.name AS "userName",
							s."sevenShiftsDepartmentId",
							d.name AS "departmentName",
							s."sevenShiftsRoleId",
							r.name AS "roleName",
							s."stationNumber",
							s."stationId",
							s."stationName",
							s."locationTimezone",
							s."scheduleDate",
							s."scheduledStartAt",
							s."scheduledEndAt",
							s."closesLocation",
							s."endsAtBusinessDecline",
							s.notes,
							s.draft,
							s.notified,
							s.open,
							s.unassigned,
							s."unassignedSkillLevel",
							s."openOfferType",
							s."publishStatus",
							s."attendanceStatus",
							s."lateMinutes",
							s."breaksJson",
							s.deleted
						FROM
							"sevenShiftsScheduledShift" AS s
						LEFT JOIN "user" AS u
							ON u.id = s."userId"
						LEFT JOIN "sevenShiftsDepartment" AS d
							ON d."sevenShiftsDepartmentId" =
								s."sevenShiftsDepartmentId"
						LEFT JOIN "sevenShiftsRole" AS r
							ON r."sevenShiftsRoleId" =
								s."sevenShiftsRoleId"
						WHERE
							s."organizationId" = $1
							AND s."scheduleDate" >= $2
							AND s."scheduleDate" < $3
							AND (
								$4::boolean = true
								OR s.deleted = false
							)
						ORDER BY
							s."scheduleDate",
							s."scheduledStartAt",
							s."sevenShiftsShiftId"
					`,
					[
						organizationId,
						weekStart,
						weekEnd,
						includeDeleted,
					],
				);

			const shifts =
				result.rows.map((row) => ({
					sevenShiftsShiftId:
						row.sevenShiftsShiftId,
					sevenShiftsLocationId:
						row.sevenShiftsLocationId,
					sevenShiftsUserId:
						row.sevenShiftsUserId,
					user:
						row.userId === null
							? null
							: {
									id: row.userId,
									name: row.userName,
								},
					department:
						row.sevenShiftsDepartmentId === null
							? null
							: {
									id:
										row.sevenShiftsDepartmentId,
									name:
										row.departmentName,
								},
					role:
						row.sevenShiftsRoleId === null
							? null
							: {
									id:
										row.sevenShiftsRoleId,
									name:
										row.roleName,
								},
					station: {
						number: row.stationNumber,
						id: row.stationId,
						name: row.stationName,
					},
					timezone:
						row.locationTimezone,
					scheduleDate:
						row.scheduleDate,
					start:
						row.scheduledStartAt.toISOString(),
					end:
						row.scheduledEndAt?.toISOString() ??
						null,
					closesLocation:
						row.closesLocation,
					endsAtBusinessDecline:
						row.endsAtBusinessDecline,
					notes: row.notes,
					draft: row.draft,
					notified: row.notified,
					open: row.open,
					unassigned: row.unassigned,
					unassignedSkillLevel:
						row.unassignedSkillLevel,
					openOfferType:
						row.openOfferType,
					publishStatus:
						row.publishStatus,
					attendanceStatus:
						row.attendanceStatus,
					lateMinutes:
						row.lateMinutes,
					breaks:
						parseBreaks(row.breaksJson),
					deleted: row.deleted,
				}));

			const organizationRow =
				organization.rows[0];

			return ctx.json({
				organization: {
					id: organizationRow.id,
					name: organizationRow.name,
					sevenShiftsLocationId:
						organizationRow.sevenShiftsLocationId,
					sevenShiftsLocationName:
						organizationRow.sevenShiftsLocationName,
					timezone:
						organizationRow.timezone,
				},
				week: {
					start: weekStart,
					end: addDays(weekStart, 6),
				},
				includeDeleted,
				summary: {
					shifts: shifts.length,
					assignedShifts:
						shifts.filter(
							(shift) =>
								shift.user !== null,
						).length,
					openShifts:
						shifts.filter(
							(shift) =>
								shift.open,
						).length,
					deletedShifts:
						shifts.filter(
							(shift) =>
								shift.deleted,
						).length,
				},
				shifts,
			});
		},
	);
