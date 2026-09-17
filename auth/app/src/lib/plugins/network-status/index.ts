import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

type NetworkStatusOptions = {
	pool: Pool;
	internalSecret?: string;
};

type UserRoleRow = {
	role: string | null;
};

type OrganizationStatusRow = {
	enabled: boolean;
};

type MembershipRow = {
	memberId: string;
	role: string;
};

type AssignmentRow = {
	memberId: string;
	userId: string;
	name: string;
	email: string;
	systemAdmin: boolean;
	accessEnabled: boolean | null;
	assignmentManagerEnabled: boolean | null;
};

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const internalAccessQuerySchema = organizationQuerySchema.extend({
	userId: z.string().min(1),
});

const updateFlagBodySchema = z.object({
	organizationId: z.string().min(1),
	userId: z.string().min(1),
	enabled: z.boolean(),
});

async function isGlobalAdmin(pool: Pool, userId: string) {
	const result = await pool.query<UserRoleRow>(
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

async function organizationIsEnabled(pool: Pool, organizationId: string) {
	const organization = await pool.query<{ id: string }>(
		`
			SELECT id
			FROM organization
			WHERE id = $1
			LIMIT 1
		`,
		[organizationId],
	);

	if (organization.rowCount !== 1) return false;

	const status = await pool.query<OrganizationStatusRow>(
		`
			SELECT enabled
			FROM "organizationStatus"
			WHERE "organizationId" = $1
			LIMIT 1
		`,
		[organizationId],
	);

	return status.rows[0]?.enabled !== false;
}

async function getActiveMembership(
	pool: Pool,
	organizationId: string,
	userId: string,
) {
	const result = await pool.query<MembershipRow>(
		`
			SELECT
				m.id AS "memberId",
				m.role
			FROM member m
			INNER JOIN "user" u
				ON u.id = m."userId"
			LEFT JOIN "organizationMemberStatus" oms
				ON oms."memberId" = m.id
			WHERE
				m."organizationId" = $1
				AND m."userId" = $2
				AND COALESCE(u.banned, false) = false
				AND COALESCE(oms.active, true) = true
			LIMIT 1
		`,
		[organizationId, userId],
	);

	return result.rows[0] ?? null;
}

async function getManagementContext(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (!(await organizationIsEnabled(pool, organizationId))) {
		return {
			allowed: false,
			isGlobalAdmin: false,
			isOrganizationManager: false,
			isNetworkStatusManager: false,
		};
	}

	if (await isGlobalAdmin(pool, userId)) {
		return {
			allowed: true,
			isGlobalAdmin: true,
			isOrganizationManager: false,
			isNetworkStatusManager: false,
		};
	}

	const membership = await getActiveMembership(pool, organizationId, userId);

	if (!membership) {
		return {
			allowed: false,
			isGlobalAdmin: false,
			isOrganizationManager: false,
			isNetworkStatusManager: false,
		};
	}

	const assignment = await pool.query<{
		assignmentManagerEnabled: boolean;
	}>(
		`
			SELECT "assignmentManagerEnabled"
			FROM "networkStatusAssignment"
			WHERE
				"organizationId" = $1
				AND "userId" = $2
				AND "assignmentManagerEnabled" = true
			LIMIT 1
		`,
		[organizationId, userId],
	);

	const isOrganizationManager =
		membership.role === "owner" || membership.role === "admin";
	const isNetworkStatusManager = assignment.rowCount === 1;

	return {
		allowed: isOrganizationManager || isNetworkStatusManager,
		isGlobalAdmin: false,
		isOrganizationManager,
		isNetworkStatusManager,
	};
}

async function hasNetworkStatusAccess(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (!(await organizationIsEnabled(pool, organizationId))) return false;

	if (await isGlobalAdmin(pool, userId)) return true;

	const membership = await getActiveMembership(pool, organizationId, userId);
	if (!membership) return false;

	const result = await pool.query(
		`
			SELECT 1
			FROM "networkStatusAssignment"
			WHERE
				"organizationId" = $1
				AND "userId" = $2
				AND "accessEnabled" = true
			LIMIT 1
		`,
		[organizationId, userId],
	);

	return result.rowCount === 1;
}

async function getAssignment(
	pool: Pool,
	organizationId: string,
	userId: string,
) {
	const result = await pool.query<AssignmentRow>(
		`
			SELECT
				m.id AS "memberId",
				u.id AS "userId",
				u.name,
				u.email,
				(u.role = 'admin') AS "systemAdmin",
				a."accessEnabled",
				a."assignmentManagerEnabled"
			FROM member m
			INNER JOIN "user" u
				ON u.id = m."userId"
			LEFT JOIN "organizationMemberStatus" oms
				ON oms."memberId" = m.id
			LEFT JOIN "networkStatusAssignment" a
				ON a."organizationId" = m."organizationId"
				AND a."userId" = m."userId"
			WHERE
				m."organizationId" = $1
				AND m."userId" = $2
				AND COALESCE(u.banned, false) = false
				AND COALESCE(oms.active, true) = true
			LIMIT 1
		`,
		[organizationId, userId],
	);

	return result.rows[0] ?? null;
}

function serializeAssignment(
	row: AssignmentRow,
	canUpdateAccess: boolean,
	canUpdateManager: boolean,
) {
	return {
		memberId: row.memberId,
		userId: row.userId,
		name: row.name,
		email: row.email,
		systemAdmin: row.systemAdmin,
		accessEnabled: row.systemAdmin || (row.accessEnabled ?? false),
		assignmentManagerEnabled:
			row.systemAdmin || (row.assignmentManagerEnabled ?? false),
		canUpdateAccess: !row.systemAdmin && canUpdateAccess,
		canUpdateManager: !row.systemAdmin && canUpdateManager,
	};
}

export const networkStatus = ({
	pool,
	internalSecret,
}: NetworkStatusOptions): BetterAuthPlugin => ({
	id: "network-status",

	schema: {
		networkStatusAssignment: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
				},
				userId: {
					type: "string",
					required: true,
				},
				accessEnabled: {
					type: "boolean",
					required: true,
					defaultValue: false,
				},
				assignmentManagerEnabled: {
					type: "boolean",
					required: true,
					defaultValue: false,
				},
				createdAt: {
					type: "date",
					required: true,
					defaultValue: () => new Date(),
				},
				updatedAt: {
					type: "date",
					required: true,
					defaultValue: () => new Date(),
				},
			},
			indexes: [
				{
					fields: ["organizationId", "userId"],
					unique: true,
				},
			],
		},
	},

	endpoints: {
		listNetworkStatusAssignments: createAuthEndpoint(
			"/network-status/assignments",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;
				const management = await getManagementContext(
					pool,
					ctx.context.session.user.id,
					organizationId,
				);

				if (!management.allowed) {
					return ctx.json({ error: "Forbidden" }, { status: 403 });
				}

				const canUpdateManager =
					management.isGlobalAdmin || management.isOrganizationManager;

				const result = await pool.query<AssignmentRow>(
					`
						SELECT
							m.id AS "memberId",
							u.id AS "userId",
							u.name,
							u.email,
							(u.role = 'admin') AS "systemAdmin",
							a."accessEnabled",
							a."assignmentManagerEnabled"
						FROM member m
						INNER JOIN "user" u
							ON u.id = m."userId"
						LEFT JOIN "organizationMemberStatus" oms
							ON oms."memberId" = m.id
						LEFT JOIN "networkStatusAssignment" a
							ON a."organizationId" = m."organizationId"
							AND a."userId" = m."userId"
						WHERE
							m."organizationId" = $1
							AND COALESCE(u.banned, false) = false
							AND COALESCE(oms.active, true) = true
						ORDER BY LOWER(u.name), LOWER(u.email)
					`,
					[organizationId],
				);

				return ctx.json({
					assignments: result.rows.map((row) =>
						serializeAssignment(row, true, canUpdateManager),
					),
				});
			},
		),

		getNetworkStatusAccess: createAuthEndpoint(
			"/network-status/access",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const allowed = await hasNetworkStatusAccess(
					pool,
					ctx.context.session.user.id,
					ctx.query.organizationId,
				);

				return ctx.json({ allowed });
			},
		),

		updateNetworkStatusAccess: createAuthEndpoint(
			"/network-status/access",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: updateFlagBodySchema,
			},
			async (ctx) => {
				const { organizationId, userId, enabled } = ctx.body;
				const management = await getManagementContext(
					pool,
					ctx.context.session.user.id,
					organizationId,
				);

				if (!management.allowed) {
					return ctx.json({ error: "Forbidden" }, { status: 403 });
				}

				const target = await getAssignment(pool, organizationId, userId);
				if (!target) {
					return ctx.json(
						{ error: "Active organization member not found" },
						{ status: 404 },
					);
				}

				if (target.systemAdmin) {
					return ctx.json(
						{ error: "System administrator access cannot be changed" },
						{ status: 403 },
					);
				}

				const delegatedNetworkStatusManager =
					management.isNetworkStatusManager &&
					!management.isOrganizationManager &&
					!management.isGlobalAdmin;

				if (delegatedNetworkStatusManager) {
					if (ctx.context.session.user.id === userId) {
						return ctx.json(
							{
								error:
									"Network Status Managers cannot modify their own Network Status access",
							},
							{ status: 403 },
						);
					}

					if (target.assignmentManagerEnabled === true) {
						return ctx.json(
							{
								error:
									"Network Status Managers cannot modify another Network Status Manager's access",
							},
							{ status: 403 },
						);
					}
				}

				await pool.query(
					`
						INSERT INTO "networkStatusAssignment" (
							id,
							"organizationId",
							"userId",
							"accessEnabled",
							"assignmentManagerEnabled",
							"createdAt",
							"updatedAt"
						)
						VALUES (
							gen_random_uuid()::text,
							$1,
							$2,
							$3,
							false,
							CURRENT_TIMESTAMP,
							CURRENT_TIMESTAMP
						)
						ON CONFLICT ("organizationId", "userId")
						DO UPDATE SET
							"accessEnabled" = EXCLUDED."accessEnabled",
							"updatedAt" = CURRENT_TIMESTAMP
					`,
					[organizationId, userId, enabled],
				);

				const updated = await getAssignment(pool, organizationId, userId);
				return ctx.json({
					assignment: serializeAssignment(
						updated!,
						true,
						management.isGlobalAdmin || management.isOrganizationManager,
					),
				});
			},
		),

		updateNetworkStatusManager: createAuthEndpoint(
			"/network-status/manager",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: updateFlagBodySchema,
			},
			async (ctx) => {
				const { organizationId, userId, enabled } = ctx.body;
				const management = await getManagementContext(
					pool,
					ctx.context.session.user.id,
					organizationId,
				);

				if (!(management.isGlobalAdmin || management.isOrganizationManager)) {
					return ctx.json({ error: "Forbidden" }, { status: 403 });
				}

				const target = await getAssignment(pool, organizationId, userId);
				if (!target) {
					return ctx.json(
						{ error: "Active organization member not found" },
						{ status: 404 },
					);
				}

				if (target.systemAdmin) {
					return ctx.json(
						{ error: "System administrator manager access cannot be changed" },
						{ status: 403 },
					);
				}

				await pool.query(
					`
						INSERT INTO "networkStatusAssignment" (
							id,
							"organizationId",
							"userId",
							"accessEnabled",
							"assignmentManagerEnabled",
							"createdAt",
							"updatedAt"
						)
						VALUES (
							gen_random_uuid()::text,
							$1,
							$2,
							false,
							$3,
							CURRENT_TIMESTAMP,
							CURRENT_TIMESTAMP
						)
						ON CONFLICT ("organizationId", "userId")
						DO UPDATE SET
							"assignmentManagerEnabled" =
								EXCLUDED."assignmentManagerEnabled",
							"updatedAt" = CURRENT_TIMESTAMP
					`,
					[organizationId, userId, enabled],
				);

				const updated = await getAssignment(pool, organizationId, userId);
				return ctx.json({
					assignment: serializeAssignment(updated!, true, true),
				});
			},
		),

		getNetworkStatusAccessInternal: createAuthEndpoint(
			"/network-status/access/internal",
			{
				method: "GET",
				query: internalAccessQuerySchema,
			},
			async (ctx) => {
				if (
					!internalSecret ||
					ctx.headers.get("x-network-status-internal-secret") !==
						internalSecret
				) {
					return ctx.json(
						{ error: "Unauthorized" },
						{ status: 401 },
					);
				}

				const allowed = await hasNetworkStatusAccess(
					pool,
					ctx.query.userId,
					ctx.query.organizationId,
				);

				const organizationResult = await pool.query(
					"SELECT name FROM organization WHERE id = $1 LIMIT 1",
					[ctx.query.organizationId],
				);
				const organizationName =
					organizationResult.rows[0]?.name ?? null;

				return ctx.json({ allowed, organizationName });
			},
		),

		getNetworkStatusManagementAccess: createAuthEndpoint(
			"/network-status/management-access",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const management = await getManagementContext(
					pool,
					ctx.context.session.user.id,
					ctx.query.organizationId,
				);

				return ctx.json({
					allowed: management.allowed,
					canManageManagers:
						management.isGlobalAdmin || management.isOrganizationManager,
				});
			},
		),
	},
});
