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

type SyncControlsEndpointOptions = {
	pool: Pool;
};

const syncControlsQuerySchema = z.object({
	organizationId: z.string().min(1),
});

async function canReadSchedule(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (await isGlobalAdmin(pool, userId, true)) {
		return true;
	}

	const membership = await getOrganizationMembership(
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

async function canManageScheduleSync(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (await isGlobalAdmin(pool, userId)) {
		return true;
	}

	const membership = await getOrganizationMembership(
		pool,
		organizationId,
		userId,
	);

	if (!membership?.active) {
		return false;
	}

	const result = await pool.query<{
		assignmentManagerEnabled: boolean;
	}>(
		'SELECT "assignmentManagerEnabled" FROM "tipClaimEmployeeAssignment" WHERE "organizationId" = $1 AND "userId" = $2 LIMIT 1',
		[organizationId, userId],
	);

	return result.rows[0]?.assignmentManagerEnabled === true;
}

export const createSevenShiftsScheduleSyncControlsEndpoint = ({
	pool,
}: SyncControlsEndpointOptions) =>
	createAuthEndpoint(
		"/seven-shifts-schedules/sync-controls",
		{
			method: "GET",
			use: [sessionMiddleware],
			query: syncControlsQuerySchema,
		},
		async (ctx) => {
			const organizationId =
				ctx.query.organizationId;

			const userId =
				ctx.context.session.user.id;

			const readable = await canReadSchedule(
				pool,
				userId,
				organizationId,
			);

			if (!readable) {
				return ctx.json(
					{
						error: "Forbidden",
					},
					{
						status: 403,
					},
				);
			}

			const organization = await pool.query<{
				id: string;
				sourceId: string | null;
				sevenShiftsLocationId: number | null;
				sevenShiftsLocationName: string | null;
			}>(
				'SELECT o.id, os."sourceId", os."sevenShiftsLocationId", os."sevenShiftsLocationName" FROM organization AS o LEFT JOIN "sevenShiftsApiOrganizationSource" AS os ON os."organizationId" = o.id WHERE o.id = $1 LIMIT 1',
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

			const mapping = organization.rows[0];

			const syncState = await pool.query<{
				lastSyncedAt: Date | null;
			}>(
				'SELECT MAX("lastSeenAt") AS "lastSyncedAt" FROM "sevenShiftsScheduledShift" WHERE "organizationId" = $1',
				[organizationId],
			);

			const canManage =
				await canManageScheduleSync(
					pool,
					userId,
					organizationId,
				);

			return ctx.json({
				canManage,
				configured:
					mapping.sourceId !== null &&
					mapping.sevenShiftsLocationId !== null,
				lastSyncedAt:
					syncState.rows[0]?.lastSyncedAt ??
					null,
				location: {
					id:
						mapping.sevenShiftsLocationId,
					name:
						mapping.sevenShiftsLocationName,
				},
			});
		},
	);
