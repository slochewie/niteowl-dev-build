import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	randomUUID,
} from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import { getUserProfile, upsertUserProfile } from "../user-profile/index.js";

import {
	listSevenShiftsCompanies,
	listSevenShiftsDepartments,
	listSevenShiftsRoles,
	listSevenShiftsUsers,
	listSevenShiftsUserRoleAssignments,
	listSevenShiftsLocations,
	SEVEN_SHIFTS_API_VERSION,
	SevenShiftsApiError,
	updateSevenShiftsUser,
} from "./client.js";

type SevenShiftsApiOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

type ApiSourceRow = {
	id: string;
	name: string;
	accessToken: string;
	companyId: number | null;
	companyName: string | null;
	apiVersion: string;
	lastTestedAt: Date | null;
	lastSyncAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

const createSourceBodySchema = z.object({
	name: z.string().trim().min(1).max(100),

	accessToken: z.string().trim().min(1),

	apiVersion: z.string().trim().min(1).default(SEVEN_SHIFTS_API_VERSION),
});

const updateSourceBodySchema = z.object({
	sourceId: z.string().min(1),

	name: z.string().trim().min(1).max(100),

	accessToken: z.string().trim().min(1).optional(),

	apiVersion: z.string().trim().min(1).optional(),
});

const sourceBodySchema = z.object({
	sourceId: z.string().min(1),
});

const assignLocationBodySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),

	sevenShiftsLocationId: z.number().int().positive(),
});

const unassignLocationBodySchema = z.object({
	sourceId: z.string().min(1),

	sevenShiftsLocationId: z.number().int().positive(),
});

async function isGlobalAdmin(
	pool: Pool,
	userId: string,
	allowReadOnly = false,
) {
	const result = await pool.query<UserRoleRow>(
		`
        SELECT role
        FROM "user"
        WHERE id = $1
        LIMIT 1
      `,
		[userId],
	);

	const role = result.rows[0]?.role;

	return role === "admin" || (allowReadOnly && role === "admin-viewer");
}
async function getSource(pool: Pool, sourceId: string) {
	const result = await pool.query<ApiSourceRow>(
		`
        SELECT
          id,
          name,
          "accessToken",
          "companyId",
          "companyName",
          "apiVersion",
          "lastTestedAt",
          "lastSyncAt",
          "createdAt",
          "updatedAt"
        FROM
          "sevenShiftsApiSource"
        WHERE
          id = $1
        LIMIT 1
      `,
		[sourceId],
	);

	return result.rows[0] ?? null;
}

function apiErrorMessage(error: unknown) {
	if (error instanceof SevenShiftsApiError) {
		return `7shifts API returned HTTP ${error.status}`;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Unable to communicate with 7shifts";
}

function canonicalEmail(value: string) {
	const email = value.trim().toLocaleLowerCase();

	const atIndex = email.lastIndexOf("@");

	if (atIndex <= 0) {
		return email;
	}

	let local = email.slice(0, atIndex);

	let domain = email.slice(atIndex + 1);

	if (domain === "gmail.com" || domain === "googlemail.com") {
		domain = "gmail.com";

		local = local.split("+")[0].replaceAll(".", "");
	}

	return `${local}@${domain}`;
}

function nullableText(value: string | null | undefined) {
	const trimmed = value?.trim() ?? "";

	return trimmed ? trimmed : null;
}

function parseApiDate(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? null : date;
}

function generateTemporaryPassword() {
	return randomBytes(18).toString("base64url");
}

function usernameBaseFromEmail(email: string) {
	const local = email
		.split("@")[0]
		?.toLowerCase()
		.replace(/[^a-z0-9._]/g, "")
		.replace(/^[._]+|[._]+$/g, "")
		.slice(0, 24);

	return local || "user";
}

async function uniqueUsername(pool: Pool, email: string) {
	const base = usernameBaseFromEmail(email);

	let candidate = base;

	let suffix = 1;

	while (true) {
		const result = await pool.query<{
			id: string;
		}>(
			`
          SELECT id
          FROM "user"
          WHERE lower(username) =
            lower($1)
          LIMIT 1
        `,
			[candidate],
		);

		if (result.rowCount === 0) {
			return candidate;
		}

		suffix++;

		candidate = `${base.slice(
			0,
			Math.max(1, 29 - String(suffix).length),
		)}${suffix}`;
	}
}

async function ensureMember({
	pool,
	organizationId,
	userId,
}: {
	pool: Pool;
	organizationId: string;
	userId: string;
}) {
	const existing = await pool.query<{
		id: string;
	}>(
		`
        SELECT id
        FROM member
        WHERE
          "organizationId" = $1
          AND
          "userId" = $2
        LIMIT 1
      `,
		[organizationId, userId],
	);

	if (existing.rowCount === 1) {
		return false;
	}

	await pool.query(
		`
      INSERT INTO member (
        id,
        "organizationId",
        "userId",
        role,
        "createdAt"
      )
      VALUES (
        $1,
        $2,
        $3,
        'member',
        CURRENT_TIMESTAMP
      )
    `,
		[randomUUID(), organizationId, userId],
	);

	return true;
}

async function mapWithConcurrency<Input, Output>({
	items,
	concurrency,
	mapper,
}: {
	items: Input[];
	concurrency: number;
	mapper: (item: Input, index: number) => Promise<Output>;
}) {
	const results = new Array<Output>(items.length);

	let nextIndex = 0;

	async function worker() {
		while (true) {
			const index = nextIndex++;

			if (index >= items.length) {
				return;
			}

			results[index] = await mapper(items[index], index);
		}
	}

	await Promise.all(
		Array.from(
			{
				length: Math.min(concurrency, items.length),
			},
			() => worker(),
		),
	);

	return results;
}

function normalizeProfileText(value: string | null | undefined) {
	const normalized = value?.trim() ?? "";

	return normalized || null;
}

function normalizeProfilePhone(value: string | null | undefined) {
	const normalized = normalizeProfileText(value);

	if (!normalized) {
		return null;
	}

	const leadingPlus = normalized.startsWith("+");

	const digits = normalized.replace(/\D/g, "");

	if (!digits) {
		return null;
	}

	return leadingPlus ? "+" + digits : digits;
}

function profileDateValue(value: Date | string | null | undefined) {
	if (!value) {
		return null;
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date.toISOString().slice(0, 10);
}

type SevenShiftsApiSyncReport = {
	mappedOrganizations: number;
	mappedLocations: number;
	departmentsSynced: number;
	rolesSynced: number;
	usersSeen: number;
	usersManaged: number;
	usersCreated: number;
	usersUpdated: number;
	usersPushedToSevenShifts: number;
	usersDisabled: number;
	skippedWithoutEmail: number;
	membershipsCreated: number;
	assignmentsCreated: number;
	assignmentsRemoved: number;
	generatedCredentials: Array<{
		name: string;
		email: string;
		username: string;
		password: string;
	}>;
	completedAt: string;
};

export const sevenShiftsApi = ({
	pool,
	encryptionKey,
}: SevenShiftsApiOptions) =>
	({
		id: "seven-shifts-api",

		endpoints: {
			listSevenShiftsApiSources: createAuthEndpoint(
				"/seven-shifts-api/sources",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const allowed = await isGlobalAdmin(
						pool,
						ctx.context.session.user.id,
						true,
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

					const result = await pool.query<{
						id: string;
						name: string;
						companyId: number | null;
						companyName: string | null;
						apiVersion: string;
						organizationCount: number;
						lastTestedAt: Date | null;
						lastSyncAt: Date | null;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
                  SELECT
                    s.id,
                    s.name,
                    s."companyId",
                    s."companyName",
                    s."apiVersion",
                    COUNT(
                      os.id
                    )::int AS
                      "organizationCount",
                    s."lastTestedAt",
                    s."lastSyncAt",
                    s."createdAt",
                    s."updatedAt"
                  FROM
                    "sevenShiftsApiSource" s

                  LEFT JOIN
                    "sevenShiftsApiOrganizationSource" os
                    ON
                      os."sourceId" =
                        s.id

                  GROUP BY
                    s.id,
                    s.name,
                    s."companyId",
                    s."companyName",
                    s."apiVersion",
                    s."lastTestedAt",
                    s."lastSyncAt",
                    s."createdAt",
                    s."updatedAt"

                  ORDER BY
                    s.name ASC
                `,
					);

					return ctx.json({
						sources: result.rows.map((source) => ({
							...source,
							hasAccessToken: true,
						})),
					});
				},
			),

			createSevenShiftsApiSource: createAuthEndpoint(
				"/seven-shifts-api/sources/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createSourceBodySchema,
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

					const name = ctx.body.name.trim();

					const accessToken = encryptSecret(
						ctx.body.accessToken.trim(),
						encryptionKey,
					);

					try {
						const result = await pool.query<{
							id: string;
							name: string;
							companyId: number | null;
							companyName: string | null;
							apiVersion: string;
							createdAt: Date;
							updatedAt: Date;
						}>(
							`
                    INSERT INTO
                      "sevenShiftsApiSource" (
                        id,
                        name,
                        "accessToken",
                        "companyId",
                        "companyName",
                        "apiVersion",
                        "createdAt",
                        "updatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      NULL,
                      NULL,
                      $4,
                      CURRENT_TIMESTAMP,
                      CURRENT_TIMESTAMP
                    )
                    RETURNING
                      id,
                      name,
                      "companyId",
                      "companyName",
                      "apiVersion",
                      "createdAt",
                      "updatedAt"
                  `,
							[randomUUID(), name, accessToken, ctx.body.apiVersion],
						);

						return ctx.json({
							source: {
								...result.rows[0],
								hasAccessToken: true,
							},
						});
					} catch (error) {
						if (
							error &&
							typeof error === "object" &&
							"code" in error &&
							error.code === "23505"
						) {
							return ctx.json(
								{
									error: `A 7shifts API Source named "${name}" already exists`,
								},
								{
									status: 409,
								},
							);
						}

						throw error;
					}
				},
			),

			updateSevenShiftsApiSource: createAuthEndpoint(
				"/seven-shifts-api/sources/update",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: updateSourceBodySchema,
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

					const existing = await getSource(pool, ctx.body.sourceId);

					if (!existing) {
						return ctx.json(
							{
								error: "7shifts API Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const nextToken = ctx.body.accessToken
						? encryptSecret(ctx.body.accessToken.trim(), encryptionKey)
						: existing.accessToken;

					const nextApiVersion = ctx.body.apiVersion ?? existing.apiVersion;

					const result = await pool.query<{
						id: string;
						name: string;
						companyId: number | null;
						companyName: string | null;
						apiVersion: string;
						lastTestedAt: Date | null;
						lastSyncAt: Date | null;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
                  UPDATE
                    "sevenShiftsApiSource"
                  SET
                    name = $1,
                    "accessToken" = $2,
                    "apiVersion" = $3,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE
                    id = $4
                  RETURNING
                    id,
                    name,
                    "companyId",
                    "companyName",
                    "apiVersion",
                    "lastTestedAt",
                    "lastSyncAt",
                    "createdAt",
                    "updatedAt"
                `,
						[
							ctx.body.name.trim(),
							nextToken,
							nextApiVersion,
							ctx.body.sourceId,
						],
					);

					return ctx.json({
						source: {
							...result.rows[0],
							hasAccessToken: true,
						},
					});
				},
			),

			testSevenShiftsApiSource: createAuthEndpoint(
				"/seven-shifts-api/sources/test",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source) {
						return ctx.json(
							{
								error: "7shifts API Source not found",
							},
							{
								status: 404,
							},
						);
					}

					try {
						const accessToken = decryptSecret(
							source.accessToken,
							encryptionKey,
						);

						const companies = await listSevenShiftsCompanies({
							accessToken,
							apiVersion: source.apiVersion,
						});

						if (companies.length !== 1) {
							return ctx.json(
								{
									error: `Expected exactly one 7shifts company, found ${companies.length}`,
								},
								{
									status: 400,
								},
							);
						}

						const company = companies[0];

						const locations = await listSevenShiftsLocations({
							accessToken,
							companyId: company.id,
							apiVersion: source.apiVersion,
						});

						await pool.query(
							`
                  UPDATE
                    "sevenShiftsApiSource"
                  SET
                    "companyId" = $1,
                    "companyName" = $2,
                    "lastTestedAt" =
                      CURRENT_TIMESTAMP,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE
                    id = $3
                `,
							[company.id, company.name, source.id],
						);

						return ctx.json({
							success: true,
							company,
							locations,
							apiVersion: source.apiVersion,
						});
					} catch (error) {
						return ctx.json(
							{
								error: apiErrorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			listSevenShiftsApiLocations: createAuthEndpoint(
				"/seven-shifts-api/sources/locations",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source || source.companyId === null) {
						return ctx.json(
							{
								error: "Test this API Source before loading locations",
							},
							{
								status: 400,
							},
						);
					}

					try {
						const accessToken = decryptSecret(
							source.accessToken,
							encryptionKey,
						);

						const locations = await listSevenShiftsLocations({
							accessToken,
							companyId: source.companyId,
							apiVersion: source.apiVersion,
						});

						const mappings = await pool.query<{
							organizationId: string;
							organizationName: string;
							sevenShiftsLocationId: number;
							sevenShiftsLocationName: string;
						}>(
							`
                    SELECT
                      os."organizationId",
                      o.name AS
                        "organizationName",
                      os."sevenShiftsLocationId",
                      os."sevenShiftsLocationName"
                    FROM
                      "sevenShiftsApiOrganizationSource" os

                    INNER JOIN
                      organization o
                      ON
                        o.id =
                          os."organizationId"

                    WHERE
                      os."sourceId" =
                        $1

                    ORDER BY
                      o.name ASC
                  `,
							[source.id],
						);

						return ctx.json({
							locations,
							mappings: mappings.rows,
						});
					} catch (error) {
						return ctx.json(
							{
								error: apiErrorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			previewSevenShiftsApiSync: createAuthEndpoint(
				"/seven-shifts-api/sources/sync-preview",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source || source.companyId === null) {
						return ctx.json(
							{
								error: "Test this API Source before previewing synchronization",
							},
							{
								status: 400,
							},
						);
					}

					const mappings = await pool.query<{
						organizationId: string;
						organizationName: string;
						sevenShiftsLocationId: number;
						sevenShiftsLocationName: string;
					}>(
						`
                SELECT
                  os."organizationId",
                  o.name AS
                    "organizationName",
                  os."sevenShiftsLocationId",
                  os."sevenShiftsLocationName"
                FROM
                  "sevenShiftsApiOrganizationSource" os

                INNER JOIN
                  organization o
                  ON
                    o.id =
                      os."organizationId"

                INNER JOIN
                  "organizationIntegration" oi
                  ON
                    oi."organizationId" =
                      os."organizationId"
                    AND
                    oi."pluginId" =
                      'seven-shifts-api'

                WHERE
                  os."sourceId" =
                    $1
                  AND
                  oi.enabled = true

                ORDER BY
                  o.name ASC
              `,
						[source.id],
					);

					const mappedLocationIds = new Set(
						mappings.rows.map((mapping) => mapping.sevenShiftsLocationId),
					);

					try {
						const accessToken = decryptSecret(
							source.accessToken,
							encryptionKey,
						);

						const [locations, departments, roles, users] = await Promise.all([
							listSevenShiftsLocations({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsDepartments({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsRoles({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsUsers({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
						]);

						const mappedLocations = locations.filter((location) =>
							mappedLocationIds.has(location.id),
						);

						const mappedDepartments = departments.filter((department) =>
							mappedLocationIds.has(department.location_id),
						);

						const mappedRoles = roles.filter((role) =>
							mappedLocationIds.has(role.location_id),
						);

						const activeUsers = users.filter((user) => user.active);

						return ctx.json({
							source: {
								id: source.id,
								name: source.name,
								companyId: source.companyId,
								companyName: source.companyName,
								apiVersion: source.apiVersion,
							},

							mappings: mappings.rows,

							counts: {
								mappedOrganizations: mappings.rows.length,
								companyLocations: locations.length,
								mappedLocations: mappedLocations.length,
								companyDepartments: departments.length,
								mappedDepartments: mappedDepartments.length,
								companyRoles: roles.length,
								mappedRoles: mappedRoles.length,
								companyUsers: users.length,
								activeCompanyUsers: activeUsers.length,
								inactiveCompanyUsers: users.length - activeUsers.length,
							},

							locations: mappedLocations,

							departments: mappedDepartments,

							roles: mappedRoles,

							userSample: users.slice(0, 10),
						});
					} catch (error) {
						return ctx.json(
							{
								error: apiErrorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			syncSevenShiftsApiSource: createAuthEndpoint(
				"/seven-shifts-api/sources/sync",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source || source.companyId === null) {
						return ctx.json(
							{
								error: "Test this API Source before synchronizing",
							},
							{
								status: 400,
							},
						);
					}

					const mappings = await pool.query<{
						organizationId: string;
						organizationName: string;
						sevenShiftsLocationId: number;
						sevenShiftsLocationName: string;
						syncDirection:
							| "to-better-auth"
							| "from-better-auth"
							| "bidirectional";
					}>(
						`
                SELECT
                  os."organizationId",
                  o.name AS
                    "organizationName",
                  os."sevenShiftsLocationId",
                  os."sevenShiftsLocationName",
                  COALESCE(
                    oi."syncDirection",
                    'to-better-auth'
                  ) AS "syncDirection"
                FROM
                  "sevenShiftsApiOrganizationSource" os

                INNER JOIN
                  organization o
                  ON
                    o.id =
                      os."organizationId"

                INNER JOIN
                  "organizationIntegration" oi
                  ON
                    oi."organizationId" =
                      os."organizationId"
                    AND
                    oi."pluginId" =
                      'seven-shifts-api'

                WHERE
                  os."sourceId" =
                    $1
                  AND
                  oi.enabled = true

                ORDER BY
                  o.name ASC
              `,
						[source.id],
					);

					if (mappings.rows.length === 0) {
						return ctx.json(
							{
								error: "No enabled organizations are mapped to this API Source",
							},
							{
								status: 400,
							},
						);
					}

					try {
						const accessToken = decryptSecret(
							source.accessToken,
							encryptionKey,
						);

						const [locations, departments, roles, users] = await Promise.all([
							listSevenShiftsLocations({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsDepartments({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsRoles({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
							listSevenShiftsUsers({
								accessToken,
								companyId: source.companyId,
								apiVersion: source.apiVersion,
							}),
						]);

						const mappingByLocationId = new Map(
							mappings.rows.map((mapping) => [
								mapping.sevenShiftsLocationId,
								mapping,
							]),
						);

						const mappedLocationIds = new Set(mappingByLocationId.keys());

						const mappedLocations = locations.filter((location) =>
							mappedLocationIds.has(location.id),
						);

						if (mappedLocations.length !== mappings.rows.length) {
							throw new Error(
								"One or more mapped 7shifts locations are no longer returned by the API",
							);
						}

						const assignmentsByUserId = await mapWithConcurrency({
							items: users,
							concurrency: 5,
							mapper: async (user) => ({
								user,
								assignments: await listSevenShiftsUserRoleAssignments({
									accessToken,
									companyId: source.companyId!,
									userId: user.id,
									apiVersion: source.apiVersion,
								}),
							}),
						});

						const assignmentsBySevenShiftsUserId = new Map(
							assignmentsByUserId.map(({ user, assignments }) => [
								user.id,
								assignments,
							]),
						);

						const internalLocationBySevenShiftsId = new Map<
							number,
							{
								id: string;
								organizationId: string;
								name: string;
							}
						>();

						for (const location of mappedLocations) {
							const mapping = mappingByLocationId.get(location.id);

							if (!mapping) {
								continue;
							}

							const result = await pool.query<{
								id: string;
								organizationId: string;
								name: string;
							}>(
								`
                    INSERT INTO
                      "sevenShiftsLocation" (
                        id,
                        "sevenShiftsLocationId",
                        "organizationId",
                        guid,
                        name,
                        active,
                        source,
                        "sourceCreatedAt",
                        "sourceUpdatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      NULL,
                      $4,
                      $5,
                      'seven-shifts-api',
                      NULL,
                      CURRENT_TIMESTAMP
                    )

                    ON CONFLICT (
                      "sevenShiftsLocationId"
                    )

                    DO UPDATE SET
                      "organizationId" =
                        EXCLUDED."organizationId",
                      name =
                        EXCLUDED.name,
                      active =
                        EXCLUDED.active,
                      source =
                        EXCLUDED.source,
                      "sourceUpdatedAt" =
                        CURRENT_TIMESTAMP

                    RETURNING
                      id,
                      "organizationId",
                      name
                  `,
								[
									randomUUID(),
									location.id,
									mapping.organizationId,
									location.name,
									location.active !== false,
								],
							);

							internalLocationBySevenShiftsId.set(location.id, result.rows[0]);
						}

						const mappedDepartments = departments.filter((department) =>
							mappedLocationIds.has(department.location_id),
						);

						const internalDepartmentBySevenShiftsId = new Map<number, string>();

						for (const department of mappedDepartments) {
							const location = internalLocationBySevenShiftsId.get(
								department.location_id,
							);

							if (!location) {
								throw new Error(
									`Department ${department.id} references unmapped location ${department.location_id}`,
								);
							}

							const result = await pool.query<{
								id: string;
							}>(
								`
                    INSERT INTO
                      "sevenShiftsDepartment" (
                        id,
                        "sevenShiftsDepartmentId",
                        "companyId",
                        "locationId",
                        name,
                        active,
                        source,
                        "sourceCreatedAt",
                        "sourceUpdatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5,
                      $6,
                      'seven-shifts-api',
                      $7,
                      $8
                    )

                    ON CONFLICT (
                      "sevenShiftsDepartmentId"
                    )

                    DO UPDATE SET
                      "companyId" =
                        EXCLUDED."companyId",
                      "locationId" =
                        EXCLUDED."locationId",
                      name =
                        EXCLUDED.name,
                      active =
                        EXCLUDED.active,
                      source =
                        EXCLUDED.source,
                      "sourceCreatedAt" =
                        EXCLUDED."sourceCreatedAt",
                      "sourceUpdatedAt" =
                        EXCLUDED."sourceUpdatedAt"

                    RETURNING id
                  `,
								[
									randomUUID(),
									department.id,
									department.company_id,
									location.id,
									department.name,
									!department.deleted,
									parseApiDate(department.created),
									parseApiDate(department.modified),
								],
							);

							internalDepartmentBySevenShiftsId.set(
								department.id,
								result.rows[0].id,
							);
						}

						const mappedRoles = roles.filter((role) =>
							mappedLocationIds.has(role.location_id),
						);

						const internalRoleBySevenShiftsId = new Map<
							number,
							{
								id: string;
								locationId: string;
							}
						>();

						for (const role of mappedRoles) {
							const location = internalLocationBySevenShiftsId.get(
								role.location_id,
							);

							if (!location) {
								throw new Error(
									`Role ${role.id} references unmapped location ${role.location_id}`,
								);
							}

							const departmentId =
								internalDepartmentBySevenShiftsId.get(role.department_id) ??
								null;

							const result = await pool.query<{
								id: string;
								locationId: string;
							}>(
								`
                    INSERT INTO
                      "sevenShiftsRole" (
                        id,
                        "sevenShiftsRoleId",
                        "companyId",
                        "locationId",
                        "departmentId",
                        name,
                        active,
                        source,
                        "sourceCreatedAt",
                        "sourceUpdatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5,
                      $6,
                      true,
                      'seven-shifts-api',
                      $7,
                      $8
                    )

                    ON CONFLICT (
                      "sevenShiftsRoleId"
                    )

                    DO UPDATE SET
                      "companyId" =
                        EXCLUDED."companyId",
                      "locationId" =
                        EXCLUDED."locationId",
                      "departmentId" =
                        EXCLUDED."departmentId",
                      name =
                        EXCLUDED.name,
                      active =
                        true,
                      source =
                        EXCLUDED.source,
                      "sourceCreatedAt" =
                        EXCLUDED."sourceCreatedAt",
                      "sourceUpdatedAt" =
                        EXCLUDED."sourceUpdatedAt"

                    RETURNING
                      id,
                      "locationId"
                  `,
								[
									randomUUID(),
									role.id,
									role.company_id,
									location.id,
									departmentId,
									role.name,
									parseApiDate(role.created),
									parseApiDate(role.modified),
								],
							);

							internalRoleBySevenShiftsId.set(role.id, result.rows[0]);
						}

						const currentlyMappedUserIds = new Set<number>();

						for (const { user, assignments } of assignmentsByUserId) {
							if (
								assignments.some((assignment) =>
									mappedLocationIds.has(assignment.location_id),
								)
							) {
								currentlyMappedUserIds.add(user.id);
							}
						}

						const targetInternalLocationIds = [
							...internalLocationBySevenShiftsId.values(),
						].map((location) => location.id);

						const previouslyManaged = await pool.query<{
							sevenShiftsUserId: number | null;
						}>(
							`
                  SELECT DISTINCT
                    se."sevenShiftsUserId"
                  FROM
                    "sevenShiftsEmployee" se

                  INNER JOIN
                    "sevenShiftsAssignment" sa
                    ON
                      sa."employeeId" =
                        se.id

                  WHERE
                    sa."locationId" =
                      ANY(
                        $1::text[]
                      )
                `,
							[targetInternalLocationIds],
						);

						const managedUserIds = new Set(currentlyMappedUserIds);

						for (const row of previouslyManaged.rows) {
							if (row.sevenShiftsUserId !== null) {
								managedUserIds.add(row.sevenShiftsUserId);
							}
						}

						const userBySevenShiftsId = new Map(
							users.map((user) => [user.id, user]),
						);

						let usersCreated = 0;

						let usersUpdated = 0;

						let usersPushedToSevenShifts = 0;

						let usersDisabled = 0;

						let skippedWithoutEmail = 0;

						let membershipsCreated = 0;

						let assignmentsCreated = 0;

						let assignmentsRemoved = 0;

						const generatedCredentials: SevenShiftsApiSyncReport["generatedCredentials"] =
							[];

						const resolvedEmployees = new Map<
							number,
							{
								employeeRecordId: string;
								userId: string;
							}
						>();

						for (const sevenShiftsUserId of managedUserIds) {
							const user = userBySevenShiftsId.get(sevenShiftsUserId);

							if (!user) {
								continue;
							}

							const email = (user.email ?? "").trim().toLowerCase();

							const canonical = canonicalEmail(email);

							const profileFirstName = nullableText(user.first_name);

							const profileLastName = nullableText(user.last_name);

							const preferredFirstName = nullableText(
								user.preferred_first_name,
							);

							const preferredLastName = nullableText(user.preferred_last_name);

							const firstName = preferredFirstName ?? profileFirstName ?? "";

							const lastName = preferredLastName ?? profileLastName ?? "";

							const name =
								`${firstName} ${lastName}`.trim() ||
								email ||
								`7shifts User ${user.id}`;

							const existingEmployeeBySevenShiftsId = await pool.query<{
								id: string;
								userId: string;
								mustChangePassword: boolean;
							}>(
								`
                    SELECT
                      id,
                      "userId",
                      "mustChangePassword"
                    FROM
                      "sevenShiftsEmployee"
                    WHERE
                      "sevenShiftsUserId" =
                        $1
                    LIMIT 1
                  `,
								[user.id],
							);

							let userId: string;

							let employeeRecordId: string;

							let created = false;

							if (existingEmployeeBySevenShiftsId.rowCount === 1) {
								employeeRecordId = existingEmployeeBySevenShiftsId.rows[0].id;

								userId = existingEmployeeBySevenShiftsId.rows[0].userId;
							} else {
								if (!email) {
									skippedWithoutEmail++;

									continue;
								}

								const existingUser = await pool.query<{
									id: string;
								}>(
									`
                      SELECT id
                      FROM "user"
                      WHERE
                        lower(email) =
                          lower($1)
                        OR
                        lower(email) =
                          lower($2)
                      LIMIT 1
                    `,
									[email, canonical],
								);

								if (existingUser.rowCount === 1) {
									userId = existingUser.rows[0].id;

									const existingEmployeeByUser = await pool.query<{
										id: string;
									}>(
										`
                        SELECT id
                        FROM
                          "sevenShiftsEmployee"
                        WHERE
                          "userId" =
                            $1
                        LIMIT 1
                      `,
										[userId],
									);

									if (existingEmployeeByUser.rowCount === 1) {
										employeeRecordId = existingEmployeeByUser.rows[0].id;
									} else {
										employeeRecordId = randomUUID();

										await pool.query(
											`
                    INSERT INTO
                      "sevenShiftsEmployee" (
                        id,
                        "userId",
                        "employeeId",
                        "sevenShiftsUserId",
                        status,
                        enabled,
                        "mustChangePassword",
                        "sourceCreatedAt",
                        "sourceUpdatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5,
                      $6,
                      false,
                      CURRENT_TIMESTAMP,
                      CURRENT_TIMESTAMP
                    )
                  `,
											[
												employeeRecordId,
												userId,
												nullableText(user.employee_id),
												user.id,
												user.active ? "active" : "inactive",
												user.active,
											],
										);
									}
								} else {
									const username = await uniqueUsername(pool, email);

									const password = generateTemporaryPassword();

									const createdUser =
										await ctx.context.internalAdapter.createUser({
											email,
											name,
											role: "user",
										});

									if (!createdUser?.id) {
										throw new Error(
											`Unable to create Better Auth user ${email}`,
										);
									}

									userId = createdUser.id;

									await pool.query(
										`
                      UPDATE
                        "user"
                      SET
                        username = $1,
                        banned = $2,
                        "banReason" =
                          CASE
                            WHEN $2
                            THEN
                              'Disabled in 7shifts'
                            ELSE
                              NULL
                          END,
                        "banExpires" =
                          NULL,
                        "updatedAt" =
                          CURRENT_TIMESTAMP
                      WHERE
                        id = $3
                    `,
										[username, !user.active, userId],
									);

									const hashedPassword =
										await ctx.context.password.hash(password);

									await ctx.context.internalAdapter.linkAccount({
										accountId: userId,
										providerId: "credential",
										password: hashedPassword,
										userId,
									});

									employeeRecordId = randomUUID();

									await pool.query(
										`
                  INSERT INTO
                    "sevenShiftsEmployee" (
                      id,
                      "userId",
                      "employeeId",
                      "sevenShiftsUserId",
                      status,
                      enabled,
                      "mustChangePassword",
                      "sourceCreatedAt",
                      "sourceUpdatedAt"
                    )
                  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    true,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                  )
                `,
										[
											employeeRecordId,
											userId,
											nullableText(user.employee_id),
											user.id,
											user.active ? "active" : "inactive",
											user.active,
										],
									);

									generatedCredentials.push({
										name,
										email,
										username,
										password,
									});

									created = true;

									usersCreated++;
								}
							}

							const userAssignments =
								assignmentsBySevenShiftsUserId.get(user.id) ?? [];

							const applicableMappings = userAssignments
								.map((assignment) =>
									mappingByLocationId.get(assignment.location_id),
								)
								.filter(
									(mapping): mapping is NonNullable<typeof mapping> =>
										mapping !== undefined,
								);

							const profile = await getUserProfile(pool, userId);

							const hasFromBetterAuth = applicableMappings.some(
								(mapping) => mapping.syncDirection === "from-better-auth",
							);

							const hasBidirectional = applicableMappings.some(
								(mapping) => mapping.syncDirection === "bidirectional",
							);

							const profileChangedSinceLastSync =
								profile !== null &&
								(source.lastSyncAt === null ||
									new Date(profile.updatedAt).getTime() >
										new Date(source.lastSyncAt).getTime());

							const shouldPushProfileToSevenShifts =
								profile !== null &&
								(hasFromBetterAuth ||
									(hasBidirectional && profileChangedSinceLastSync));

							if (shouldPushProfileToSevenShifts && profile) {
								const update: {
									first_name?: string;
									last_name?: string;
									preferred_first_name?: string;
									preferred_last_name?: string;
									mobile_number?: string;
									home_number?: string;
									address?: string;
									city?: string;
									prov_state?: string;
									postal_zip?: string;
									birth_date?: string;
									pronouns?: string;
								} = {};

								const outboundFirstName = normalizeProfileText(
									profile.firstName,
								);

								if (
									outboundFirstName !== null &&
									outboundFirstName !== normalizeProfileText(user.first_name)
								) {
									update.first_name = outboundFirstName;
								}

								const outboundLastName = normalizeProfileText(profile.lastName);

								if (
									outboundLastName !== null &&
									outboundLastName !== normalizeProfileText(user.last_name)
								) {
									update.last_name = outboundLastName;
								}

								const outboundPreferredFirstName = normalizeProfileText(
									profile.preferredFirstName,
								);

								if (
									outboundPreferredFirstName !== null &&
									outboundPreferredFirstName !==
										normalizeProfileText(user.preferred_first_name)
								) {
									update.preferred_first_name = outboundPreferredFirstName;
								}

								const outboundPreferredLastName = normalizeProfileText(
									profile.preferredLastName,
								);

								if (
									outboundPreferredLastName !== null &&
									outboundPreferredLastName !==
										normalizeProfileText(user.preferred_last_name)
								) {
									update.preferred_last_name = outboundPreferredLastName;
								}

								const outboundMobilePhone = normalizeProfilePhone(
									profile.mobilePhone,
								);

								if (
									outboundMobilePhone !== null &&
									outboundMobilePhone !==
										normalizeProfilePhone(user.mobile_number)
								) {
									update.mobile_number = outboundMobilePhone;
								}

								const outboundHomePhone = normalizeProfilePhone(
									profile.homePhone,
								);

								if (
									outboundHomePhone !== null &&
									outboundHomePhone !== normalizeProfilePhone(user.home_number)
								) {
									update.home_number = outboundHomePhone;
								}

								const outboundAddress = normalizeProfileText(profile.address);

								if (
									outboundAddress !== null &&
									outboundAddress !== normalizeProfileText(user.address)
								) {
									update.address = outboundAddress;
								}

								const outboundCity = normalizeProfileText(profile.city);

								if (
									outboundCity !== null &&
									outboundCity !== normalizeProfileText(user.city)
								) {
									update.city = outboundCity;
								}

								const outboundStateProvince = normalizeProfileText(
									profile.stateProvince,
								);

								if (
									outboundStateProvince !== null &&
									outboundStateProvince !==
										normalizeProfileText(user.prov_state)
								) {
									update.prov_state = outboundStateProvince;
								}

								const outboundPostalCode = normalizeProfileText(
									profile.postalCode,
								);

								if (
									outboundPostalCode !== null &&
									outboundPostalCode !== normalizeProfileText(user.postal_zip)
								) {
									update.postal_zip = outboundPostalCode;
								}

								const outboundBirthdate = profileDateValue(profile.birthdate);

								if (
									outboundBirthdate !== null &&
									outboundBirthdate !== profileDateValue(user.birth_date)
								) {
									update.birth_date = outboundBirthdate;
								}

								const outboundPronouns = normalizeProfileText(profile.pronouns);

								if (
									outboundPronouns !== null &&
									outboundPronouns !== normalizeProfileText(user.pronouns)
								) {
									update.pronouns = outboundPronouns;
								}

								if (Object.keys(update).length > 0) {
									await updateSevenShiftsUser({
										accessToken,
										companyId: source.companyId!,
										userId: user.id,
										update,
										apiVersion: source.apiVersion,
									});

									usersPushedToSevenShifts++;

									Object.assign(user, update);
								}
							}

							const allowInboundProfileSync =
								applicableMappings.length > 0 &&
								!hasFromBetterAuth &&
								!shouldPushProfileToSevenShifts;

							if (allowInboundProfileSync) {
								await upsertUserProfile(pool, userId, {
									firstName: profileFirstName,
									lastName: profileLastName,
									preferredFirstName,
									preferredLastName,
									pronouns: nullableText(user.pronouns),
									birthdate: parseApiDate(user.birth_date),
									mobilePhone: nullableText(user.mobile_number),
									homePhone: nullableText(user.home_number),
									address: nullableText(user.address),
									city: nullableText(user.city),
									stateProvince: nullableText(user.prov_state),
									postalCode: nullableText(user.postal_zip),
								});
							}

							if (!created) {
								const currentUser = await pool.query<{
									name: string;
									username: string | null;
									banned: boolean;
									banReason: string | null;
									banExpires: Date | null;
								}>(
									`
                      SELECT
                        name,
                        username,
                        banned,
                        "banReason",
                        "banExpires"
                      FROM
                        "user"
                      WHERE
                        id = $1
                      LIMIT 1
                    `,
									[userId],
								);

								if (currentUser.rowCount !== 1) {
									throw new Error(`Better Auth user ${userId} was not found`);
								}

								const current = currentUser.rows[0];

								const username =
									current.username ??
									(email ? await uniqueUsername(pool, email) : null);

								const desiredBanned = !user.active;

								const desiredBanReason = desiredBanned
									? "Disabled in 7shifts"
									: null;

								const userChanged =
									current.name !== name ||
									(username !== null && current.username !== username) ||
									current.banned !== desiredBanned ||
									current.banReason !== desiredBanReason ||
									current.banExpires !== null;

								if (userChanged) {
									await pool.query(
										`
                      UPDATE
                        "user"
                      SET
                        name = $1,
                        username =
                          COALESCE(
                            $2,
                            username
                          ),
                        banned = $3,
                        "banReason" = $4,
                        "banExpires" =
                          NULL,
                        "updatedAt" =
                          CURRENT_TIMESTAMP
                      WHERE
                        id = $5
                    `,
										[name, username, desiredBanned, desiredBanReason, userId],
									);
								}

								const currentEmployee = await pool.query<{
									employeeId: string | null;
									sevenShiftsUserId: number | null;
									status: string | null;
									enabled: boolean;
								}>(
									`
                  SELECT
                    "employeeId",
                    "sevenShiftsUserId",
                    status,
                    enabled
                  FROM
                    "sevenShiftsEmployee"
                  WHERE
                    id = $1
                  LIMIT 1
                `,
									[employeeRecordId],
								);

								if (currentEmployee.rowCount !== 1) {
									throw new Error(
										`7shifts employee record ${employeeRecordId} was not found`,
									);
								}

								const employee = currentEmployee.rows[0];

								const desiredEmployeeId = nullableText(user.employee_id);

								const desiredStatus = user.active ? "active" : "inactive";

								const employeeChanged =
									employee.employeeId !== desiredEmployeeId ||
									employee.sevenShiftsUserId !== user.id ||
									employee.status !== desiredStatus ||
									employee.enabled !== user.active;

								if (employeeChanged) {
									await pool.query(
										`
                  UPDATE
                    "sevenShiftsEmployee"
                  SET
                    "employeeId" = $1,
                    "sevenShiftsUserId" = $2,
                    status = $3,
                    enabled = $4,
                    "sourceUpdatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE
                    id = $5
                `,
										[
											desiredEmployeeId,
											user.id,
											desiredStatus,
											user.active,
											employeeRecordId,
										],
									);
								}

								if (userChanged || employeeChanged) {
									usersUpdated++;
								}
							}

							if (!user.active) {
								usersDisabled++;
							}

							resolvedEmployees.set(user.id, {
								employeeRecordId,
								userId,
							});
						}

						const desiredAssignments = new Map<
							string,
							{
								employeeId: string;
								locationId: string;
								roleId: string;
							}
						>();

						const membershipKeys = new Set<string>();

						for (const { user, assignments } of assignmentsByUserId) {
							const employee = resolvedEmployees.get(user.id);

							if (!employee) {
								continue;
							}

							for (const assignment of assignments) {
								if (!mappedLocationIds.has(assignment.location_id)) {
									continue;
								}

								const location = internalLocationBySevenShiftsId.get(
									assignment.location_id,
								);

								const role = internalRoleBySevenShiftsId.get(
									assignment.role_id,
								);

								if (!location || !role) {
									throw new Error(
										`Unable to resolve role assignment for 7shifts user ${user.id}`,
									);
								}

								const membershipKey = `${location.organizationId}\u0000${employee.userId}`;

								if (!membershipKeys.has(membershipKey)) {
									membershipKeys.add(membershipKey);

									if (
										await ensureMember({
											pool,
											organizationId: location.organizationId,
											userId: employee.userId,
										})
									) {
										membershipsCreated++;
									}
								}

								const key = `${employee.employeeRecordId}\u0000${location.id}\u0000${role.id}`;

								desiredAssignments.set(key, {
									employeeId: employee.employeeRecordId,
									locationId: location.id,
									roleId: role.id,
								});
							}
						}

						type ExistingAssignment = {
							id: string;
							employeeId: string;
							locationId: string;
							roleId: string;
						};

						const existingResult = await pool.query<ExistingAssignment>(
							`
                  SELECT
                    id,
                    "employeeId",
                    "locationId",
                    "roleId"
                  FROM
                    "sevenShiftsAssignment"
                  WHERE
                    "locationId" =
                      ANY(
                        $1::text[]
                      )
                `,
							[targetInternalLocationIds],
						);

						const existingByKey = new Map<string, ExistingAssignment>();

						const assignmentIdsToRemove: string[] = [];

						for (const assignment of existingResult.rows) {
							const key = `${assignment.employeeId}\u0000${assignment.locationId}\u0000${assignment.roleId}`;

							if (existingByKey.has(key)) {
								assignmentIdsToRemove.push(assignment.id);

								continue;
							}

							existingByKey.set(key, assignment);
						}

						for (const [key, assignment] of existingByKey) {
							if (!desiredAssignments.has(key)) {
								assignmentIdsToRemove.push(assignment.id);
							}
						}

						if (assignmentIdsToRemove.length > 0) {
							const removed = await pool.query(
								`
                    DELETE FROM
                      "sevenShiftsAssignment"
                    WHERE
                      id =
                        ANY(
                          $1::text[]
                        )
                  `,
								[assignmentIdsToRemove],
							);

							assignmentsRemoved = removed.rowCount ?? 0;
						}

						for (const [key, assignment] of desiredAssignments) {
							if (existingByKey.has(key)) {
								continue;
							}

							await pool.query(
								`
                  INSERT INTO
                    "sevenShiftsAssignment" (
                      id,
                      "employeeId",
                      "locationId",
                      "roleId"
                    )
                  VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                  )
                `,
								[
									randomUUID(),
									assignment.employeeId,
									assignment.locationId,
									assignment.roleId,
								],
							);

							assignmentsCreated++;
						}

						await pool.query(
							`
                UPDATE
                  "sevenShiftsApiSource"
                SET
                  "lastSyncAt" =
                    CURRENT_TIMESTAMP,
                  "updatedAt" =
                    CURRENT_TIMESTAMP
                WHERE
                  id = $1
              `,
							[source.id],
						);

						const report: SevenShiftsApiSyncReport = {
							mappedOrganizations: mappings.rows.length,

							mappedLocations: mappedLocations.length,

							departmentsSynced: mappedDepartments.length,

							rolesSynced: mappedRoles.length,

							usersSeen: users.length,

							usersManaged: resolvedEmployees.size,

							usersCreated,

							usersUpdated,

							usersPushedToSevenShifts,

							usersDisabled,

							skippedWithoutEmail,

							membershipsCreated,

							assignmentsCreated,

							assignmentsRemoved,

							generatedCredentials,

							completedAt: new Date().toISOString(),
						};

						return ctx.json({
							report,
						});
					} catch (error) {
						return ctx.json(
							{
								error: apiErrorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			deleteSevenShiftsApiSource: createAuthEndpoint(
				"/seven-shifts-api/sources/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
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

					const source = await pool.query<{
						id: string;
						name: string;
						organizationCount: number;
					}>(
						`
                SELECT
                  s.id,
                  s.name,
                  COUNT(
                    os.id
                  )::int AS
                    "organizationCount"
                FROM
                  "sevenShiftsApiSource" s

                LEFT JOIN
                  "sevenShiftsApiOrganizationSource" os
                  ON
                    os."sourceId" =
                      s.id

                WHERE
                  s.id = $1

                GROUP BY
                  s.id,
                  s.name
              `,
						[ctx.body.sourceId],
					);

					if (source.rowCount !== 1) {
						return ctx.json(
							{
								error: "7shifts API Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const currentSource = source.rows[0];

					if (currentSource.organizationCount > 0) {
						return ctx.json(
							{
								error: `7shifts API Source "${currentSource.name}" is assigned to ${currentSource.organizationCount} organization${currentSource.organizationCount === 1 ? "" : "s"}. Unassign all locations before deleting this source.`,
							},
							{
								status: 409,
							},
						);
					}

					/*
					 * Repeat the mapping check in the destructive
					 * statement to protect against a mapping being
					 * created after the preflight query.
					 */
					const deleted = await pool.query<{
						id: string;
						name: string;
					}>(
						`
                DELETE FROM
                  "sevenShiftsApiSource" s

                WHERE
                  s.id = $1

                  AND NOT EXISTS (
                    SELECT
                      1
                    FROM
                      "sevenShiftsApiOrganizationSource" os
                    WHERE
                      os."sourceId" =
                        s.id
                  )

                RETURNING
                  s.id,
                  s.name
              `,
						[ctx.body.sourceId],
					);

					if (deleted.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"7shifts API Source is currently assigned to an organization. Unassign all locations before deleting this source.",
							},
							{
								status: 409,
							},
						);
					}

					return ctx.json({
						source: deleted.rows[0],
					});
				},
			),

			unassignSevenShiftsApiLocation: createAuthEndpoint(
				"/seven-shifts-api/sources/unassign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: unassignLocationBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source) {
						return ctx.json(
							{
								error: "7shifts API Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const deleted = await pool.query<{
						organizationId: string;
						sourceId: string;
						sevenShiftsLocationId: number;
						sevenShiftsLocationName: string;
					}>(
						`
                DELETE FROM
                  "sevenShiftsApiOrganizationSource"

                WHERE
                  "sourceId" = $1
                  AND
                  "sevenShiftsLocationId" =
                    $2

                RETURNING
                  "organizationId",
                  "sourceId",
                  "sevenShiftsLocationId",
                  "sevenShiftsLocationName"
              `,
						[source.id, ctx.body.sevenShiftsLocationId],
					);

					if (deleted.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"This 7shifts location is not assigned to the selected API Source",
							},
							{
								status: 404,
							},
						);
					}

					return ctx.json({
						mapping: deleted.rows[0],
					});
				},
			),

			assignSevenShiftsApiLocation: createAuthEndpoint(
				"/seven-shifts-api/sources/assign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: assignLocationBodySchema,
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

					const source = await getSource(pool, ctx.body.sourceId);

					if (!source || source.companyId === null) {
						return ctx.json(
							{
								error: "Test this API Source before assigning locations",
							},
							{
								status: 400,
							},
						);
					}

					const organization = await pool.query<{
						id: string;
					}>(
						`
                  SELECT id
                  FROM organization
                  WHERE id = $1
                  LIMIT 1
                `,
						[ctx.body.organizationId],
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

					try {
						const accessToken = decryptSecret(
							source.accessToken,
							encryptionKey,
						);

						const locations = await listSevenShiftsLocations({
							accessToken,
							companyId: source.companyId,
							apiVersion: source.apiVersion,
						});

						const location = locations.find(
							(item) => item.id === ctx.body.sevenShiftsLocationId,
						);

						if (!location) {
							return ctx.json(
								{
									error: "7shifts location was not found in this API Source",
								},
								{
									status: 400,
								},
							);
						}

						const result = await pool.query(
							`
                    INSERT INTO
                      "sevenShiftsApiOrganizationSource" (
                        id,
                        "organizationId",
                        "sourceId",
                        "sevenShiftsLocationId",
                        "sevenShiftsLocationName",
                        "createdAt",
                        "updatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5,
                      CURRENT_TIMESTAMP,
                      CURRENT_TIMESTAMP
                    )

                    ON CONFLICT (
                      "organizationId"
                    )

                    DO UPDATE SET
                      "sourceId" =
                        EXCLUDED."sourceId",
                      "sevenShiftsLocationId" =
                        EXCLUDED."sevenShiftsLocationId",
                      "sevenShiftsLocationName" =
                        EXCLUDED."sevenShiftsLocationName",
                      "updatedAt" =
                        CURRENT_TIMESTAMP

                    RETURNING
                      "organizationId",
                      "sourceId",
                      "sevenShiftsLocationId",
                      "sevenShiftsLocationName"
                  `,
							[
								randomUUID(),
								ctx.body.organizationId,
								source.id,
								location.id,
								location.name,
							],
						);

						return ctx.json({
							mapping: result.rows[0],
						});
					} catch (error) {
						return ctx.json(
							{
								error: apiErrorMessage(error),
							},
							{
								status: 400,
							},
						);
					}
				},
			),
		},

		schema: {
			sevenShiftsApiSource: {
				modelName: "sevenShiftsApiSource",

				fields: {
					name: {
						type: "string",
						required: true,
						unique: true,
					},

					accessToken: {
						type: "string",
						required: true,
					},

					companyId: {
						type: "number",
						required: false,
					},

					companyName: {
						type: "string",
						required: false,
					},

					apiVersion: {
						type: "string",
						required: true,
						defaultValue: () => SEVEN_SHIFTS_API_VERSION,
					},

					lastTestedAt: {
						type: "date",
						required: false,
					},

					lastSyncAt: {
						type: "date",
						required: false,
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
			},

			sevenShiftsApiOrganizationSource: {
				modelName: "sevenShiftsApiOrganizationSource",

				fields: {
					organizationId: {
						type: "string",
						required: true,
						unique: true,
						references: {
							model: "organization",
							field: "id",
							onDelete: "cascade",
						},
					},

					sourceId: {
						type: "string",
						required: true,
						index: true,
						references: {
							model: "sevenShiftsApiSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					sevenShiftsLocationId: {
						type: "number",
						required: true,
						unique: true,
					},

					sevenShiftsLocationName: {
						type: "string",
						required: true,
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
			},
		},
	}) satisfies BetterAuthPlugin;
