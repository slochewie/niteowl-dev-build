import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

type CounterOptions = {
	pool: Pool;
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

type CounterAssignmentRow = {
	userId: string;
	counterId: string;
};

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const accessQuerySchema = z.object({
	organizationId: z.string().min(1),
	counterId: z.string().min(1),
});

const updateAssignmentBodySchema = z.object({
	organizationId: z.string().min(1),
	userId: z.string().min(1),
	counterId: z.string().min(1),
	enabled: z.boolean(),
});

const updateManagerBodySchema = z.object({
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
	const organization = await pool.query<{
		id: string;
	}>(
		`
				SELECT id
				FROM organization
				WHERE id = $1
				LIMIT 1
			`,
		[organizationId],
	);

	if (organization.rowCount !== 1) {
		return false;
	}

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
					AND COALESCE(
						u.banned,
						false
					) = false
					AND COALESCE(
						oms.active,
						true
					) = true
				LIMIT 1
			`,
		[organizationId, userId],
	);

	return result.rows[0] ?? null;
}

async function getAssignmentManagementContext(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (!(await organizationIsEnabled(pool, organizationId))) {
		return {
			allowed: false,
			isGlobalAdmin: false,
			isOrganizationManager: false,
			isCounterManager: false,
		};
	}

	const globalAdmin = await isGlobalAdmin(pool, userId);

	if (globalAdmin) {
		return {
			allowed: true,
			isGlobalAdmin: true,
			isOrganizationManager: false,
			isCounterManager: false,
		};
	}

	const membership = await getActiveMembership(pool, organizationId, userId);

	if (!membership) {
		return {
			allowed: false,
			isGlobalAdmin: false,
			isOrganizationManager: false,
			isCounterManager: false,
		};
	}

	const managerResult = await pool.query<{
		enabled: boolean;
	}>(
		`
				SELECT enabled
				FROM "counterManager"
				WHERE
					"organizationId" = $1
					AND "userId" = $2
					AND enabled = true
				LIMIT 1
			`,
		[organizationId, userId],
	);

	const organizationManager =
		membership.role === "owner" || membership.role === "admin";

	const counterManager = managerResult.rowCount === 1;

	return {
		allowed: organizationManager || counterManager,
		isGlobalAdmin: false,
		isOrganizationManager: organizationManager,
		isCounterManager: counterManager,
	};
}

async function canManageAssignments(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	const context = await getAssignmentManagementContext(
		pool,
		userId,
		organizationId,
	);

	return context.allowed;
}

async function canManageManagers(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	const context = await getAssignmentManagementContext(
		pool,
		userId,
		organizationId,
	);

	return context.isGlobalAdmin || context.isOrganizationManager;
}

async function userHasCounterAccess(
	pool: Pool,
	userId: string,
	organizationId: string,
	counterId: string,
) {
	if (!(await organizationIsEnabled(pool, organizationId))) {
		return false;
	}

	if (await isGlobalAdmin(pool, userId)) {
		return true;
	}

	const membership = await getActiveMembership(pool, organizationId, userId);

	if (!membership) {
		return false;
	}

	const result = await pool.query<{
		enabled: boolean;
	}>(
		`
				SELECT enabled
				FROM "counterAssignment"
				WHERE
					"organizationId" = $1
					AND "userId" = $2
					AND "counterId" = $3
					AND enabled = true
				LIMIT 1
			`,
		[organizationId, userId, counterId],
	);

	return result.rowCount === 1;
}

export const counterAccess = ({ pool }: CounterOptions): BetterAuthPlugin => ({
	id: "counter",

	schema: {
		counterAssignment: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
				},
				userId: {
					type: "string",
					required: true,
				},
				counterId: {
					type: "string",
					required: true,
				},
				enabled: {
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
					fields: ["organizationId", "userId", "counterId"],
					unique: true,
				},
			],
		},
		counterManager: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
				},
				userId: {
					type: "string",
					required: true,
				},
				enabled: {
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
		listCounterAssignments: createAuthEndpoint(
			"/counter/assignments",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;

				if (
					!(await canManageAssignments(
						pool,
						ctx.context.session.user.id,
						organizationId,
					))
				) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const result = await pool.query<CounterAssignmentRow>(
					`
								SELECT
									ca."userId",
									ca."counterId"
								FROM "counterAssignment" ca
								INNER JOIN member m
									ON m."organizationId" =
										ca."organizationId"
									AND m."userId" =
										ca."userId"
								INNER JOIN "user" u
									ON u.id =
										ca."userId"
								LEFT JOIN
									"organizationMemberStatus" oms
									ON oms."memberId" =
										m.id
								WHERE
									ca."organizationId" = $1
									AND ca.enabled = true
									AND COALESCE(
										u.banned,
										false
									) = false
									AND COALESCE(
										oms.active,
										true
									) = true
								ORDER BY
									ca."userId",
									ca."counterId"
							`,
					[organizationId],
				);

				const assignments = new Map<string, string[]>();

				for (const row of result.rows) {
					const counterIds = assignments.get(row.userId) ?? [];

					counterIds.push(row.counterId);

					assignments.set(row.userId, counterIds);
				}

				return ctx.json({
					assignments: Array.from(assignments.entries()).map(
						([userId, counterIds]) => ({
							userId,
							counterIds,
						}),
					),
				});
			},
		),

		updateCounterAssignment: createAuthEndpoint(
			"/counter/assignments",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: updateAssignmentBodySchema,
			},
			async (ctx) => {
				const { organizationId, userId, counterId, enabled } = ctx.body;

				if (
					!(await canManageAssignments(
						pool,
						ctx.context.session.user.id,
						organizationId,
					))
				) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const targetMembership = await getActiveMembership(
					pool,
					organizationId,
					userId,
				);

				if (!targetMembership) {
					return ctx.json(
						{
							error: "Active organization member not found",
						},
						{
							status: 404,
						},
					);
				}

				const managementContext = await getAssignmentManagementContext(
					pool,
					ctx.context.session.user.id,
					organizationId,
				);

				const delegatedCounterManager =
					managementContext.isCounterManager &&
					!managementContext.isOrganizationManager &&
					!managementContext.isGlobalAdmin;

				if (delegatedCounterManager) {
					if (ctx.context.session.user.id === userId) {
						return ctx.json(
							{
								error:
									"Counter Managers cannot modify their own Counter assignment",
							},
							{
								status: 403,
							},
						);
					}

					const targetManager = await pool.query(
						`
							SELECT 1
							FROM "counterManager"
							WHERE
								"organizationId" = $1
								AND "userId" = $2
								AND enabled = true
							LIMIT 1
						`,
						[organizationId, userId],
					);

					if (targetManager.rowCount === 1) {
						return ctx.json(
							{
								error:
									"Counter Managers cannot modify another Counter Manager's assignment",
							},
							{
								status: 403,
							},
						);
					}

					if (await isGlobalAdmin(pool, userId)) {
						return ctx.json(
							{
								error:
									"Counter Managers cannot modify a global administrator's assignment",
							},
							{
								status: 403,
							},
						);
					}
				}

				await pool.query(
					`
							INSERT INTO
								"counterAssignment" (
									id,
									"organizationId",
									"userId",
									"counterId",
									enabled,
									"createdAt",
									"updatedAt"
								)
							VALUES (
								gen_random_uuid()::text,
								$1,
								$2,
								$3,
								$4,
								CURRENT_TIMESTAMP,
								CURRENT_TIMESTAMP
							)
							ON CONFLICT (
								"organizationId",
								"userId",
								"counterId"
							)
							DO UPDATE SET
								enabled =
									EXCLUDED.enabled,
								"updatedAt" =
									CURRENT_TIMESTAMP
						`,
					[organizationId, userId, counterId, enabled],
				);

				return ctx.json({
					assignment: {
						userId,
						counterId,
						enabled,
					},
				});
			},
		),

		getCounterManagementAccess: createAuthEndpoint(
			"/counter/management-access",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const context = await getAssignmentManagementContext(
					pool,
					ctx.context.session.user.id,
					ctx.query.organizationId,
				);

				return ctx.json({
					allowed: context.allowed,
					canManageManagers:
						context.isGlobalAdmin || context.isOrganizationManager,
				});
			},
		),

		listCounterManagers: createAuthEndpoint(
			"/counter/manager-list",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;

				const context = await getAssignmentManagementContext(
					pool,
					ctx.context.session.user.id,
					organizationId,
				);

				if (!context.allowed) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const result = await pool.query<{
					userId: string;
				}>(
					`
								SELECT cm."userId"
								FROM "counterManager" cm
								INNER JOIN member m
									ON m."organizationId" =
										cm."organizationId"
									AND m."userId" =
										cm."userId"
								INNER JOIN "user" u
									ON u.id =
										cm."userId"
								LEFT JOIN
									"organizationMemberStatus" oms
									ON oms."memberId" =
										m.id
								WHERE
									cm."organizationId" = $1
									AND cm.enabled = true
									AND COALESCE(
										u.banned,
										false
									) = false
									AND COALESCE(
										oms.active,
										true
									) = true
								ORDER BY cm."userId"
							`,
					[organizationId],
				);

				const globalAdminResult = await pool.query<{
					userId: string;
				}>(
					`
						SELECT u.id AS "userId"
						FROM member m
						INNER JOIN "user" u
							ON u.id = m."userId"
						LEFT JOIN "organizationMemberStatus" oms
							ON oms."memberId" = m.id
						WHERE
							m."organizationId" = $1
							AND u.role = 'admin'
							AND COALESCE(u.banned, false) = false
							AND COALESCE(oms.active, true) = true
						ORDER BY u.id
					`,
					[organizationId],
				);

				return ctx.json({
					managerUserIds: result.rows.map((row) => row.userId),
					globalAdminUserIds: globalAdminResult.rows.map((row) => row.userId),
					canManageManagers:
						context.isGlobalAdmin || context.isOrganizationManager,
				});
			},
		),

		updateCounterManager: createAuthEndpoint(
			"/counter/manager",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: updateManagerBodySchema,
			},
			async (ctx) => {
				const { organizationId, userId, enabled } = ctx.body;

				if (
					!(await canManageManagers(
						pool,
						ctx.context.session.user.id,
						organizationId,
					))
				) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const targetMembership = await getActiveMembership(
					pool,
					organizationId,
					userId,
				);

				if (!targetMembership) {
					return ctx.json(
						{
							error: "Active organization member not found",
						},
						{
							status: 404,
						},
					);
				}

				if (await isGlobalAdmin(pool, userId)) {
					return ctx.json(
						{
							error:
								"Global administrators do not require Counter Manager assignment",
						},
						{
							status: 400,
						},
					);
				}

				await pool.query(
					`
							INSERT INTO
								"counterManager" (
									id,
									"organizationId",
									"userId",
									enabled,
									"createdAt",
									"updatedAt"
								)
							VALUES (
								gen_random_uuid()::text,
								$1,
								$2,
								$3,
								CURRENT_TIMESTAMP,
								CURRENT_TIMESTAMP
							)
							ON CONFLICT (
								"organizationId",
								"userId"
							)
							DO UPDATE SET
								enabled =
									EXCLUDED.enabled,
								"updatedAt" =
									CURRENT_TIMESTAMP
						`,
					[organizationId, userId, enabled],
				);

				return ctx.json({
					manager: {
						userId,
						enabled,
					},
				});
			},
		),

		getCounterAccess: createAuthEndpoint(
			"/counter/access",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: accessQuerySchema,
			},
			async (ctx) => {
				const allowed = await userHasCounterAccess(
					pool,
					ctx.context.session.user.id,
					ctx.query.organizationId,
					ctx.query.counterId,
				);

				return ctx.json({
					allowed,
				});
			},
		),
	},
});
