import { randomUUID } from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import { decryptApiSecret, encryptApiSecret } from "../api-source/secret.js";
import { unifiRequest } from "../unifi-identity/client.js";

import {
	createUnifiAccessUser,
	listUnifiAccessIdentityResources,
	listUnifiAccessUserGroups,
	listUnifiAccessUsers,
	updateUnifiAccessUser,
} from "./client.js";

type UnifiAccessOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

type AccessSourceRow = {
	id: string;
	name: string;
	url: string;
	port: number;
	apiToken: string;
	verifyTls: boolean;
	enabled: boolean;
	lastTestedAt: Date | null;
	lastError: string | null;
	createdAt: Date;
	updatedAt: Date;
};

type UnifiResponse = {
	code: string;
	msg: string;
	data?: unknown;
};

const createSourceBodySchema = z.object({
	name: z.string().trim().min(1).max(100),

	url: z.string().trim().url(),

	port: z.number().int().min(1).max(65535).default(12445),

	apiToken: z.string().trim().min(1),

	verifyTls: z.boolean().default(false),

	enabled: z.boolean().default(false),
});

const updateSourceBodySchema = z.object({
	sourceId: z.string().min(1),

	name: z.string().trim().min(1).max(100),

	url: z.string().trim().url(),

	port: z.number().int().min(1).max(65535),

	apiToken: z.string().trim().min(1).optional(),

	verifyTls: z.boolean(),

	enabled: z.boolean(),
});

const sourceBodySchema = z.object({
	sourceId: z.string().min(1),
});

const cachedUsersQuerySchema = z.object({
	sourceId: z.string().min(1),

	page: z.coerce.number().int().min(1).default(1),

	pageSize: z.coerce.number().int().min(1).max(100).default(10),

	sortBy: z.enum(["name", "email", "employeeNumber", "status"]).default("name"),

	sortDirection: z.enum(["asc", "desc"]).default("asc"),

	status: z.enum(["all", "active", "deactivated"]).default("all"),
});

const assignBodySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),

	enabled: z.boolean().default(true),
});

const unassignBodySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),
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
	const result = await pool.query<AccessSourceRow>(
		`
        SELECT
          id,
          name,
          url,
          port,
          "apiToken",
          "verifyTls",
          enabled,
          "lastTestedAt",
          "lastError",
          "createdAt",
          "updatedAt"
        FROM "unifiAccessSource"
        WHERE id = $1
        LIMIT 1
      `,
		[sourceId],
	);

	return result.rows[0] ?? null;
}

function getBaseUrl(source: { url: string; port: number }) {
	const url = new URL(source.url);

	url.port = String(source.port);

	url.pathname = "";
	url.search = "";
	url.hash = "";

	return url.toString().replace(/\/$/, "");
}

async function persistUnifiAccessDiscovery({
	pool,
	sourceId,
	users,
	groups,
	resources,
}: {
	pool: Pool;
	sourceId: string;
	users: Awaited<ReturnType<typeof listUnifiAccessUsers>>;
	groups: Awaited<ReturnType<typeof listUnifiAccessUserGroups>>;
	resources: Awaited<ReturnType<typeof listUnifiAccessIdentityResources>>;
}) {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		for (const user of users) {
			await client.query(
				`
          INSERT INTO
            "unifiAccessUser" (
              id,
              "sourceId",
              "externalKey",
              "unifiUserId",
              "firstName",
              "lastName",
              "fullName",
              alias,
              "userEmail",
              "emailStatus",
              phone,
              "employeeNumber",
              "onboardTime",
              status,
              "lastSeenAt",
              "createdAt",
              "updatedAt"
            )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (
            "externalKey"
          )
          DO UPDATE SET
            "unifiUserId" =
              EXCLUDED."unifiUserId",
            "firstName" =
              EXCLUDED."firstName",
            "lastName" =
              EXCLUDED."lastName",
            "fullName" =
              EXCLUDED."fullName",
            alias =
              EXCLUDED.alias,
            "userEmail" =
              EXCLUDED."userEmail",
            "emailStatus" =
              EXCLUDED."emailStatus",
            phone =
              EXCLUDED.phone,
            "employeeNumber" =
              EXCLUDED."employeeNumber",
            "onboardTime" =
              EXCLUDED."onboardTime",
            status =
              EXCLUDED.status,
            "lastSeenAt" =
              CURRENT_TIMESTAMP,
            "updatedAt" =
              CURRENT_TIMESTAMP
        `,
				[
					randomUUID(),
					sourceId,
					`${sourceId}:${user.id}`,
					user.id,
					user.first_name ?? null,
					user.last_name ?? null,
					user.full_name ?? null,
					user.alias ?? null,
					user.user_email ?? null,
					user.email_status ?? null,
					user.phone ?? null,
					user.employee_number ?? null,
					user.onboard_time ?? null,
					user.status ?? null,
				],
			);
		}

		for (const group of groups) {
			await client.query(
				`
          INSERT INTO
            "unifiAccessGroup" (
              id,
              "sourceId",
              "externalKey",
              "unifiGroupId",
              name,
              "fullName",
              "parentId",
              "parentIds",
              "lastSeenAt",
              "createdAt",
              "updatedAt"
            )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (
            "externalKey"
          )
          DO UPDATE SET
            "unifiGroupId" =
              EXCLUDED."unifiGroupId",
            name =
              EXCLUDED.name,
            "fullName" =
              EXCLUDED."fullName",
            "parentId" =
              EXCLUDED."parentId",
            "parentIds" =
              EXCLUDED."parentIds",
            "lastSeenAt" =
              CURRENT_TIMESTAMP,
            "updatedAt" =
              CURRENT_TIMESTAMP
        `,
				[
					randomUUID(),
					sourceId,
					`${sourceId}:${group.id}`,
					group.id,
					group.name,
					group.full_name ?? null,
					group.up_id ?? null,
					group.up_ids ? JSON.stringify(group.up_ids) : null,
				],
			);
		}

		for (const [resourceType, items] of Object.entries(resources)) {
			if (!items) {
				continue;
			}

			for (const resource of items) {
				await client.query(
					`
            INSERT INTO
              "unifiAccessResource" (
                id,
                "sourceId",
                "externalKey",
                "unifiResourceId",
                "resourceType",
                name,
                "shortName",
                deleted,
                metadata,
                "lastSeenAt",
                "createdAt",
                "updatedAt"
              )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (
              "externalKey"
            )
            DO UPDATE SET
              "unifiResourceId" =
                EXCLUDED."unifiResourceId",
              "resourceType" =
                EXCLUDED."resourceType",
              name =
                EXCLUDED.name,
              "shortName" =
                EXCLUDED."shortName",
              deleted =
                EXCLUDED.deleted,
              metadata =
                EXCLUDED.metadata,
              "lastSeenAt" =
                CURRENT_TIMESTAMP,
              "updatedAt" =
                CURRENT_TIMESTAMP
          `,
					[
						randomUUID(),
						sourceId,
						`${sourceId}:${resourceType}:${resource.id}`,
						resource.id,
						resourceType,
						resource.name,
						resource.short_name ?? null,
						resource.deleted ?? false,
						resource.metadata === undefined
							? null
							: JSON.stringify(resource.metadata),
					],
				);
			}
		}

		await client.query(
			`
        UPDATE
          "unifiAccessSource"
        SET
          "lastDiscoveryAt" =
            CURRENT_TIMESTAMP,
          "updatedAt" =
            CURRENT_TIMESTAMP
        WHERE id = $1
      `,
			[sourceId],
		);

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");

		throw error;
	} finally {
		client.release();
	}
}

const provisionUnifiAccessUserBodySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),

	userId: z.string().min(1),
});

const setUnifiAccessUserStatusBodySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),

	userId: z.string().min(1),

	status: z.enum(["ACTIVE", "DEACTIVATED"]),
});

const reconciliationQuerySchema = z.object({
	sourceId: z.string().min(1),

	organizationId: z.string().min(1),
});

export const unifiAccess = ({ pool, encryptionKey }: UnifiAccessOptions) =>
	({
		id: "unifi-access",

		endpoints: {
			listUnifiAccessSources: createAuthEndpoint(
				"/unifi-access/sources",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id, true))) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result = await pool.query(
						`
                  SELECT
                    s.id,
                    s.name,
                    s.url,
                    s.port,
                    s."verifyTls",
                    s.enabled,
                    s."lastTestedAt",
                    s."lastError",
                    s."createdAt",
                    s."updatedAt",
                    COUNT(
                      aos.id
                    )::int AS
                      "organizationCount"
                  FROM "unifiAccessSource" s
                  LEFT JOIN
                    "unifiAccessOrganizationSource" aos
                    ON aos."sourceId" =
                      s.id
                  GROUP BY
                    s.id,
                    s.name,
                    s.url,
                    s.port,
                    s."verifyTls",
                    s.enabled,
                    s."lastTestedAt",
                    s."lastError",
                    s."createdAt",
                    s."updatedAt"
                  ORDER BY
                    s.name
                `,
					);

					const assignments = await pool.query(
						`
                  SELECT
                    aos.id,
                    aos."organizationId",
                    o.name AS
                      "organizationName",
                    aos."sourceId",
                    aos.enabled,
                    aos."createdAt",
                    aos."updatedAt"
                  FROM
                    "unifiAccessOrganizationSource" aos
                  JOIN organization o
                    ON o.id =
                      aos."organizationId"
                  ORDER BY
                    o.name
                `,
					);

					return ctx.json({
						sources: result.rows.map((source) => ({
							...source,
							hasApiToken: true,

							assignments: assignments.rows.filter(
								(assignment) => assignment.sourceId === source.id,
							),
						})),
					});
				},
			),

			createUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createSourceBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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

					const apiToken = encryptApiSecret(
						ctx.body.apiToken.trim(),
						encryptionKey,
					);

					try {
						const result = await pool.query(
							`
                    INSERT INTO
                      "unifiAccessSource" (
                        id,
                        name,
                        url,
                        port,
                        "apiToken",
                        "verifyTls",
                        enabled,
                        "createdAt",
                        "updatedAt"
                      )
                    VALUES (
                      $1,
                      $2,
                      $3,
                      $4,
                      $5,
                      $6,
                      $7,
                      CURRENT_TIMESTAMP,
                      CURRENT_TIMESTAMP
                    )
                    RETURNING
                      id,
                      name,
                      url,
                      port,
                      "verifyTls",
                      enabled,
                      "lastTestedAt",
                      "lastError",
                      "createdAt",
                      "updatedAt"
                  `,
							[
								randomUUID(),
								name,
								ctx.body.url.trim(),
								ctx.body.port,
								apiToken,
								ctx.body.verifyTls,
								ctx.body.enabled,
							],
						);

						return ctx.json({
							source: {
								...result.rows[0],
								hasApiToken: true,
								organizationCount: 0,
								assignments: [],
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
									error: `A UniFi Access Source named "${name}" already exists`,
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

			updateUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/update",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: updateSourceBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const apiToken = ctx.body.apiToken
						? encryptApiSecret(ctx.body.apiToken.trim(), encryptionKey)
						: existing.apiToken;

					const result = await pool.query(
						`
                  UPDATE "unifiAccessSource"
                  SET
                    name = $1,
                    url = $2,
                    port = $3,
                    "apiToken" = $4,
                    "verifyTls" = $5,
                    enabled = $6,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE id = $7
                  RETURNING
                    id,
                    name,
                    url,
                    port,
                    "verifyTls",
                    enabled,
                    "lastTestedAt",
                    "lastError",
                    "createdAt",
                    "updatedAt"
                `,
						[
							ctx.body.name.trim(),
							ctx.body.url.trim(),
							ctx.body.port,
							apiToken,
							ctx.body.verifyTls,
							ctx.body.enabled,
							ctx.body.sourceId,
						],
					);

					return ctx.json({
						source: {
							...result.rows[0],
							hasApiToken: true,
						},
					});
				},
			),

			discoverUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/discover",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					try {
						const apiToken = decryptApiSecret(source.apiToken, encryptionKey);

						const connection = {
							baseUrl: getBaseUrl(source),
							apiToken,
							verifyTls: source.verifyTls,
						};

						const [users, groups, resources] = await Promise.all([
							listUnifiAccessUsers(connection),
							listUnifiAccessUserGroups(connection),
							listUnifiAccessIdentityResources(connection),
						]);

						await persistUnifiAccessDiscovery({
							pool,
							sourceId: source.id,
							users,
							groups,
							resources,
						});

						return ctx.json({
							success: true,

							source: {
								id: source.id,
								name: source.name,
							},

							counts: {
								users: users.length,

								groups: groups.length,

								wifiResources: resources.wifi?.length ?? 0,

								vpnResources: resources.vpn?.length ?? 0,

								evStationResources: resources.ev_station?.length ?? 0,
							},

							users,
							groups,
							resources,
						});
					} catch (error) {
						return ctx.json(
							{
								error:
									error instanceof Error
										? error.message
										: "Unable to inspect UniFi Access Source",
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			testUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/test",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					try {
						const token = decryptApiSecret(source.apiToken, encryptionKey);

						const response = await unifiRequest<UnifiResponse>({
							baseUrl: getBaseUrl(source),
							apiToken: token,
							verifyTls: source.verifyTls,
							path: "/api/v1/developer/user_groups",
						});

						if (
							!response.ok ||
							!response.data ||
							typeof response.data !== "object" ||
							!("code" in response.data) ||
							response.data.code !== "SUCCESS"
						) {
							const message = `UniFi Access returned HTTP ${response.status}: ${JSON.stringify(
								response.data,
							)}`;

							await pool.query(
								`
                    UPDATE
                      "unifiAccessSource"
                    SET
                      "lastError" = $1,
                      "updatedAt" =
                        CURRENT_TIMESTAMP
                    WHERE id = $2
                  `,
								[message, source.id],
							);

							return ctx.json(
								{
									error: message,
								},
								{
									status: 400,
								},
							);
						}

						await pool.query(
							`
                  UPDATE
                    "unifiAccessSource"
                  SET
                    "lastTestedAt" =
                      CURRENT_TIMESTAMP,
                    "lastError" =
                      NULL,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE id = $1
                `,
							[source.id],
						);

						return ctx.json({
							success: true,
							status: response.status,
						});
					} catch (error) {
						const message =
							error instanceof Error
								? error.message
								: "Unable to communicate with UniFi Access";

						await pool.query(
							`
                  UPDATE
                    "unifiAccessSource"
                  SET
                    "lastError" = $1,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE id = $2
                `,
							[message, source.id],
						);

						return ctx.json(
							{
								error: message,
							},
							{
								status: 400,
							},
						);
					}
				},
			),

			listUnifiAccessCachedUsers: createAuthEndpoint(
				"/unifi-access/sources/users",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: cachedUsersQuerySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id, true))) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const source = await getSource(pool, ctx.query.sourceId);

					if (!source) {
						return ctx.json(
							{
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const page = ctx.query.page;

					const pageSize = ctx.query.pageSize;

					const status = ctx.query.status;

					const sortBy = ctx.query.sortBy;

					const sortDirection = ctx.query.sortDirection;

					const statusClause =
						status === "active"
							? `AND UPPER(COALESCE(status, '')) = 'ACTIVE'`
							: status === "deactivated"
								? `AND UPPER(COALESCE(status, '')) = 'DEACTIVATED'`
								: "";

					const sortExpression =
						sortBy === "email"
							? `COALESCE(NULLIF("userEmail", ''), '')`
							: sortBy === "employeeNumber"
								? `COALESCE(NULLIF("employeeNumber", ''), '')`
								: sortBy === "status"
									? `COALESCE(NULLIF(status, ''), '')`
									: `COALESCE(
                      NULLIF("fullName", ''),
                      NULLIF("userEmail", ''),
                      "unifiUserId"
                    )`;

					const direction = sortDirection === "desc" ? "DESC" : "ASC";

					const countResult = await pool.query<{
						total: number;
					}>(
						`
                SELECT
                  COUNT(*)::int AS total
                FROM
                  "unifiAccessUser"
                WHERE
                  "sourceId" = $1
                  ${statusClause}
              `,
						[source.id],
					);

					const total = countResult.rows[0]?.total ?? 0;

					const totalPages = Math.max(1, Math.ceil(total / pageSize));

					const effectivePage = Math.min(page, totalPages);

					const effectiveOffset = (effectivePage - 1) * pageSize;

					const result = await pool.query<{
						id: string;
						unifiUserId: string;
						firstName: string | null;
						lastName: string | null;
						fullName: string | null;
						alias: string | null;
						userEmail: string | null;
						emailStatus: string | null;
						phone: string | null;
						employeeNumber: string | null;
						onboardTime: number | null;
						status: string | null;
						lastSeenAt: Date;
					}>(
						`
                SELECT
                  id,
                  "unifiUserId",
                  "firstName",
                  "lastName",
                  "fullName",
                  alias,
                  "userEmail",
                  "emailStatus",
                  phone,
                  "employeeNumber",
                  "onboardTime",
                  status,
                  "lastSeenAt"
                FROM
                  "unifiAccessUser"
                WHERE
                  "sourceId" = $1
                  ${statusClause}
                ORDER BY
                  ${sortExpression}
                  ${direction},
                  "unifiUserId" ASC
                LIMIT $2
                OFFSET $3
              `,
						[source.id, pageSize, effectiveOffset],
					);

					return ctx.json({
						source: {
							id: source.id,
							name: source.name,
						},

						users: result.rows,

						pagination: {
							page: effectivePage,
							pageSize,
							total,
							totalPages,
						},
					});
				},
			),

			reconcileUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/reconcile",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: reconciliationQuerySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id, true))) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const source = await getSource(pool, ctx.query.sourceId);

					if (!source) {
						return ctx.json(
							{
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					/*
					 * Reconciliation must reflect the live UniFi console rather than
					 * relying on the last manually refreshed discovery cache.
					 *
					 * These calls are read-only UniFi API requests. They do not
					 * provision users or assign Identity resources.
					 */
					const apiToken = decryptApiSecret(source.apiToken, encryptionKey);

					const connection = {
						baseUrl: getBaseUrl(source),
						apiToken,
						verifyTls: source.verifyTls,
					};

					const [users, groups, resources] = await Promise.all([
						listUnifiAccessUsers(connection),
						listUnifiAccessUserGroups(connection),
						listUnifiAccessIdentityResources(connection),
					]);

					await persistUnifiAccessDiscovery({
						pool,
						sourceId: source.id,
						users,
						groups,
						resources,
					});

					const assignment = await pool.query<{
						organizationId: string;
						organizationName: string;
						enabled: boolean;
					}>(
						`
                SELECT
                  aos."organizationId",
                  o.name AS
                    "organizationName",
                  aos.enabled
                FROM
                  "unifiAccessOrganizationSource" aos
                JOIN organization o
                  ON o.id =
                    aos."organizationId"
                WHERE
                  aos."sourceId" = $1
                  AND
                  aos."organizationId" = $2
                LIMIT 1
              `,
						[source.id, ctx.query.organizationId],
					);

					if (assignment.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"Organization is not assigned to this UniFi Access Source",
							},
							{
								status: 404,
							},
						);
					}

					const organization = assignment.rows[0];

					if (!organization) {
						return ctx.json(
							{
								error: "Organization assignment was not found",
							},
							{
								status: 404,
							},
						);
					}

					const result = await pool.query<{
						betterAuthUserId: string | null;
						betterAuthName: string | null;
						betterAuthEmail: string | null;
						betterAuthRole: string | null;
						betterAuthBanned: boolean | null;
						banReason: string | null;
						banExpires: Date | null;
						employeeId: string | null;

						cachedUnifiUserId: string | null;
						unifiUserId: string | null;
						unifiFullName: string | null;
						unifiFirstName: string | null;
						unifiLastName: string | null;
						unifiEmail: string | null;
						unifiEmployeeNumber: string | null;
						unifiStatus: string | null;

						reconciliationStatus:
							| "in-sync"
							| "disabled-in-sync"
							| "missing-in-unifi"
							| "disabled-better-auth-only"
							| "should-activate"
							| "should-deactivate"
							| "unifi-only";
					}>(
						`
                WITH better_auth_users AS (
                  SELECT
                    u.id AS
                      "betterAuthUserId",

                    u.name AS
                      "betterAuthName",

                    u.email AS
                      "betterAuthEmail",

                    m.role AS
                      "betterAuthRole",

                    CASE
                      WHEN
                        COALESCE(
                          u.banned,
                          false
                        ) = true
                        AND (
                          u."banExpires"
                            IS NULL
                          OR
                          u."banExpires" >
                            CURRENT_TIMESTAMP
                        )
                      THEN true
                      ELSE false
                    END AS
                      "betterAuthBanned",

                    u."banReason" AS
                      "banReason",

                    u."banExpires" AS
                      "banExpires",

                    employee."employeeId" AS
                      "employeeId"

                  FROM member m

                  JOIN "user" u
                    ON
                      u.id =
                        m."userId"

                  LEFT JOIN LATERAL (
                    SELECT
                      se."employeeId"
                    FROM
                      "sevenShiftsEmployee" se
                    WHERE
                      se."userId" =
                        u.id
                    LIMIT 1
                  ) employee
                    ON true

                  WHERE
                    m."organizationId" =
                      $1
                ),

                unifi_users AS (
                  SELECT
                    id AS
                      "cachedUnifiUserId",

                    "unifiUserId",

                    "fullName" AS
                      "unifiFullName",

                    "firstName" AS
                      "unifiFirstName",

                    "lastName" AS
                      "unifiLastName",

                    "userEmail" AS
                      "unifiEmail",

                    "employeeNumber" AS
                      "unifiEmployeeNumber",

                    status AS
                      "unifiStatus"

                  FROM
                    "unifiAccessUser"

                  WHERE
                    "sourceId" =
                      $2
                )

                SELECT
                  ba."betterAuthUserId",
                  ba."betterAuthName",
                  ba."betterAuthEmail",
                  ba."betterAuthRole",
                  ba."betterAuthBanned",
                  ba."banReason",
                  ba."banExpires",
                  ba."employeeId",

                  uu."cachedUnifiUserId",
                  uu."unifiUserId",
                  uu."unifiFullName",
                  uu."unifiFirstName",
                  uu."unifiLastName",
                  uu."unifiEmail",
                  uu."unifiEmployeeNumber",
                  uu."unifiStatus",

                  CASE
                    WHEN
                      ba."betterAuthUserId"
                        IS NULL
                    THEN
                      'unifi-only'

                    WHEN
                      uu."unifiUserId"
                        IS NULL
                      AND
                      ba."betterAuthBanned" =
                        true
                    THEN
                      'disabled-better-auth-only'

                    WHEN
                      uu."unifiUserId"
                        IS NULL
                    THEN
                      'missing-in-unifi'

                    WHEN
                      ba."betterAuthBanned" =
                        true
                      AND
                      UPPER(
                        COALESCE(
                          uu."unifiStatus",
                          ''
                        )
                      ) =
                        'DEACTIVATED'
                    THEN
                      'disabled-in-sync'

                    WHEN
                      ba."betterAuthBanned" =
                        true
                    THEN
                      'should-deactivate'

                    WHEN
                      UPPER(
                        COALESCE(
                          uu."unifiStatus",
                          ''
                        )
                      ) =
                        'ACTIVE'
                    THEN
                      'in-sync'

                    ELSE
                      'should-activate'
                  END AS
                    "reconciliationStatus"

                FROM
                  better_auth_users ba

                FULL OUTER JOIN
                  unifi_users uu
                  ON
                    LOWER(
                      TRIM(
                        ba."betterAuthEmail"
                      )
                    ) =
                    LOWER(
                      TRIM(
                        uu."unifiEmail"
                      )
                    )

                ORDER BY
                  LOWER(
                    COALESCE(
                      NULLIF(
                        ba."betterAuthName",
                        ''
                      ),
                      NULLIF(
                        uu."unifiFullName",
                        ''
                      ),
                      NULLIF(
                        ba."betterAuthEmail",
                        ''
                      ),
                      NULLIF(
                        uu."unifiEmail",
                        ''
                      ),
                      uu."unifiUserId",
                      ba."betterAuthUserId"
                    )
                  )
                  ASC
              `,
						[organization.organizationId, source.id],
					);

					const summary = {
						total: result.rows.length,

						inSync: 0,

						disabledInSync: 0,

						missingInUnifi: 0,

						disabledBetterAuthOnly: 0,

						shouldActivate: 0,

						shouldDeactivate: 0,

						unifiOnly: 0,
					};

					for (const row of result.rows) {
						switch (row.reconciliationStatus) {
							case "in-sync":
								summary.inSync++;
								break;

							case "disabled-in-sync":
								summary.disabledInSync++;
								break;

							case "missing-in-unifi":
								summary.missingInUnifi++;
								break;

							case "disabled-better-auth-only":
								summary.disabledBetterAuthOnly++;
								break;

							case "should-activate":
								summary.shouldActivate++;
								break;

							case "should-deactivate":
								summary.shouldDeactivate++;
								break;

							case "unifi-only":
								summary.unifiOnly++;
								break;
						}
					}

					return ctx.json({
						source: {
							id: source.id,
							name: source.name,
						},

						organization: {
							id: organization.organizationId,
							name: organization.organizationName,
						},

						assignmentEnabled: organization.enabled,

						summary,

						rows: result.rows,
					});
				},
			),

			provisionUnifiAccessUser: createAuthEndpoint(
				"/unifi-access/sources/users/provision",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: provisionUnifiAccessUserBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					if (!source.enabled) {
						return ctx.json(
							{
								error: "UniFi Access Source is disabled",
							},
							{
								status: 400,
							},
						);
					}

					const assignment = await pool.query<{
						enabled: boolean;
					}>(
						`
                SELECT
                  enabled
                FROM
                  "unifiAccessOrganizationSource"
                WHERE
                  "sourceId" = $1
                  AND
                  "organizationId" = $2
                LIMIT 1
              `,
						[source.id, ctx.body.organizationId],
					);

					if (assignment.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"Organization is not assigned to this UniFi Access Source",
							},
							{
								status: 404,
							},
						);
					}

					if (!assignment.rows[0]?.enabled) {
						return ctx.json(
							{
								error: "UniFi Access organization assignment is disabled",
							},
							{
								status: 400,
							},
						);
					}

					const userResult = await pool.query<{
						id: string;
						name: string;
						email: string;
						banned: boolean;
						banExpires: Date | null;
						employeeId: string | null;
					}>(
						`
                SELECT
                  u.id,
                  u.name,
                  u.email,
                  COALESCE(
                    u.banned,
                    false
                  ) AS banned,
                  u."banExpires",
                  employee."employeeId" AS
                    "employeeId"
                FROM member m
                JOIN "user" u
                  ON
                    u.id =
                      m."userId"
                LEFT JOIN LATERAL (
                  SELECT
                    se."employeeId"
                  FROM
                    "sevenShiftsEmployee" se
                  WHERE
                    se."userId" =
                      u.id
                  LIMIT 1
                ) employee
                  ON true
                WHERE
                  m."organizationId" = $1
                  AND
                  u.id = $2
                LIMIT 1
              `,
						[ctx.body.organizationId, ctx.body.userId],
					);

					if (userResult.rowCount !== 1) {
						return ctx.json(
							{
								error: "Better Auth user is not a member of this organization",
							},
							{
								status: 404,
							},
						);
					}

					const user = userResult.rows[0];

					if (!user) {
						return ctx.json(
							{
								error: "Better Auth user was not found",
							},
							{
								status: 404,
							},
						);
					}

					const currentlyBanned =
						user.banned &&
						(user.banExpires === null || user.banExpires > new Date());

					if (currentlyBanned) {
						return ctx.json(
							{
								error:
									"Banned Better Auth users cannot be provisioned as active UniFi users",
							},
							{
								status: 400,
							},
						);
					}

					const email = user.email.trim().toLowerCase();

					if (!email) {
						return ctx.json(
							{
								error: "Better Auth user does not have an email address",
							},
							{
								status: 400,
							},
						);
					}

					const nameParts = user.name.trim().split(/\s+/).filter(Boolean);

					if (nameParts.length < 2) {
						return ctx.json(
							{
								error: "UniFi Access requires both a first name and last name",
							},
							{
								status: 400,
							},
						);
					}

					const firstName = nameParts[0];

					if (!firstName) {
						return ctx.json(
							{
								error: "UniFi Access requires both a first name and last name",
							},
							{
								status: 400,
							},
						);
					}

					const lastName = nameParts.slice(1).join(" ");

					const token = decryptApiSecret(source.apiToken, encryptionKey);

					const connection = {
						baseUrl: getBaseUrl(source),
						apiToken: token,
						verifyTls: source.verifyTls,
					};

					/*
					 * Check the live UniFi console, not just the cache,
					 * immediately before creating anything.
					 */
					const liveUsers = await listUnifiAccessUsers(connection);

					const existing = liveUsers.find(
						(candidate) => candidate.user_email?.trim().toLowerCase() === email,
					);

					if (existing) {
						return ctx.json(
							{
								error: "A UniFi Access user with this email already exists",
								existingUser: {
									id: existing.id,
									status: existing.status ?? null,
								},
							},
							{
								status: 409,
							},
						);
					}

					const createdUser = await createUnifiAccessUser(connection, {
						first_name: firstName,
						last_name: lastName,
						user_email: email,
						...(user.employeeId
							? {
									employee_number: user.employeeId,
								}
							: {}),
					});

					/*
					 * Refresh the cache after the successful write.
					 */
					const [users, groups, resources] = await Promise.all([
						listUnifiAccessUsers(connection),
						listUnifiAccessUserGroups(connection),
						listUnifiAccessIdentityResources(connection),
					]);

					await persistUnifiAccessDiscovery({
						pool,
						sourceId: source.id,
						users,
						groups,
						resources,
					});

					return ctx.json({
						success: true,

						user: {
							id: createdUser.id,
							firstName: createdUser.first_name ?? firstName,
							lastName: createdUser.last_name ?? lastName,
							email: createdUser.user_email ?? email,
							employeeNumber: createdUser.employee_number ?? user.employeeId,
						},
					});
				},
			),

			setUnifiAccessUserStatus: createAuthEndpoint(
				"/unifi-access/sources/users/status",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: setUnifiAccessUserStatusBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					if (!source.enabled) {
						return ctx.json(
							{
								error: "UniFi Access Source is disabled",
							},
							{
								status: 400,
							},
						);
					}

					const assignment = await pool.query<{
						enabled: boolean;
					}>(
						`
              SELECT
                enabled
              FROM
                "unifiAccessOrganizationSource"
              WHERE
                "sourceId" = $1
                AND
                "organizationId" = $2
              LIMIT 1
            `,
						[source.id, ctx.body.organizationId],
					);

					if (assignment.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"Organization is not assigned to this UniFi Access Source",
							},
							{
								status: 404,
							},
						);
					}

					if (!assignment.rows[0]?.enabled) {
						return ctx.json(
							{
								error: "UniFi Access organization assignment is disabled",
							},
							{
								status: 400,
							},
						);
					}

					const userResult = await pool.query<{
						id: string;
						email: string;
						banned: boolean;
						banExpires: Date | null;
					}>(
						`
              SELECT
                u.id,
                u.email,
                COALESCE(
                  u.banned,
                  false
                ) AS banned,
                u."banExpires"
              FROM member m
              JOIN "user" u
                ON
                  u.id =
                    m."userId"
              WHERE
                m."organizationId" = $1
                AND
                u.id = $2
              LIMIT 1
            `,
						[ctx.body.organizationId, ctx.body.userId],
					);

					if (userResult.rowCount !== 1) {
						return ctx.json(
							{
								error: "Better Auth user is not a member of this organization",
							},
							{
								status: 404,
							},
						);
					}

					const user = userResult.rows[0];

					if (!user) {
						return ctx.json(
							{
								error: "Better Auth user was not found",
							},
							{
								status: 404,
							},
						);
					}

					const currentlyBanned =
						user.banned &&
						(user.banExpires === null || user.banExpires > new Date());

					const expectedStatus = currentlyBanned ? "DEACTIVATED" : "ACTIVE";

					if (ctx.body.status !== expectedStatus) {
						return ctx.json(
							{
								error:
									"Requested UniFi status does not match the Better Auth user status",
							},
							{
								status: 409,
							},
						);
					}

					const email = user.email.trim().toLowerCase();

					const cachedUser = await pool.query<{
						unifiUserId: string;
					}>(
						`
              SELECT
                "unifiUserId"
              FROM
                "unifiAccessUser"
              WHERE
                "sourceId" = $1
                AND
                LOWER(
                  TRIM(
                    COALESCE(
                      "userEmail",
                      ''
                    )
                  )
                ) = $2
              LIMIT 1
            `,
						[source.id, email],
					);

					if (cachedUser.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"Matching UniFi Access user was not found in the discovery cache",
							},
							{
								status: 404,
							},
						);
					}

					const token = decryptApiSecret(source.apiToken, encryptionKey);

					const connection = {
						baseUrl: getBaseUrl(source),
						apiToken: token,
						verifyTls: source.verifyTls,
					};

					const cachedUnifiUser = cachedUser.rows[0];

					if (!cachedUnifiUser) {
						return ctx.json(
							{
								error:
									"Matching UniFi Access user was not found in the discovery cache",
							},
							{
								status: 404,
							},
						);
					}

					const unifiUserId = cachedUnifiUser.unifiUserId;

					await updateUnifiAccessUser(connection, unifiUserId, {
						status: ctx.body.status,
					});

					const [users, groups, resources] = await Promise.all([
						listUnifiAccessUsers(connection),
						listUnifiAccessUserGroups(connection),
						listUnifiAccessIdentityResources(connection),
					]);

					await persistUnifiAccessDiscovery({
						pool,
						sourceId: source.id,
						users,
						groups,
						resources,
					});

					return ctx.json({
						success: true,
						userId: unifiUserId,
						status: ctx.body.status,
					});
				},
			),

			assignUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/assign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: assignBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const organization = await pool.query(
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

					const result = await pool.query(
						`
                  INSERT INTO
                    "unifiAccessOrganizationSource" (
                      id,
                      "organizationId",
                      "sourceId",
                      enabled,
                      "createdAt",
                      "updatedAt"
                    )
                  VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                  )
                  ON CONFLICT (
                    "organizationId"
                  )
                  DO UPDATE SET
                    "sourceId" =
                      EXCLUDED."sourceId",
                    enabled =
                      EXCLUDED.enabled,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  RETURNING
                    id,
                    "organizationId",
                    "sourceId",
                    enabled,
                    "createdAt",
                    "updatedAt"
                `,
						[
							randomUUID(),
							ctx.body.organizationId,
							source.id,
							ctx.body.enabled,
						],
					);

					return ctx.json({
						mapping: result.rows[0],
					});
				},
			),

			unassignUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/unassign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: unassignBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result = await pool.query(
						`
                  DELETE FROM
                    "unifiAccessOrganizationSource"
                  WHERE
                    "sourceId" = $1
                    AND
                    "organizationId" = $2
                  RETURNING
                    id,
                    "organizationId",
                    "sourceId",
                    enabled
                `,
						[ctx.body.sourceId, ctx.body.organizationId],
					);

					if (result.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"Organization is not assigned to this UniFi Access Source",
							},
							{
								status: 404,
							},
						);
					}

					return ctx.json({
						mapping: result.rows[0],
					});
				},
			),

			deleteUnifiAccessSource: createAuthEndpoint(
				"/unifi-access/sources/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
				},
				async (ctx) => {
					if (!(await isGlobalAdmin(pool, ctx.context.session.user.id))) {
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
                      aos.id
                    )::int AS
                      "organizationCount"
                  FROM
                    "unifiAccessSource" s
                  LEFT JOIN
                    "unifiAccessOrganizationSource" aos
                    ON aos."sourceId" =
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
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const current = source.rows[0];

					if (!current) {
						return ctx.json(
							{
								error: "UniFi Access Source not found",
							},
							{
								status: 404,
							},
						);
					}

					if (current.organizationCount > 0) {
						return ctx.json(
							{
								error: `UniFi Access Source "${current.name}" is assigned to ${current.organizationCount} organization${current.organizationCount === 1 ? "" : "s"}. Unassign all organizations before deleting it.`,
							},
							{
								status: 409,
							},
						);
					}

					const deleted = await pool.query(
						`
                  DELETE FROM
                    "unifiAccessSource"
                  WHERE id = $1
                  RETURNING
                    id,
                    name
                `,
						[current.id],
					);

					return ctx.json({
						source: deleted.rows[0],
					});
				},
			),
		},

		schema: {
			unifiAccessSource: {
				modelName: "unifiAccessSource",

				fields: {
					name: {
						type: "string",
						required: true,
						unique: true,
					},

					url: {
						type: "string",
						required: true,
					},

					port: {
						type: "number",
						required: true,
						defaultValue: () => 12445,
					},

					apiToken: {
						type: "string",
						required: true,
					},

					verifyTls: {
						type: "boolean",
						required: true,
						defaultValue: () => false,
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: () => false,
					},

					lastTestedAt: {
						type: "date",
						required: false,
					},

					lastError: {
						type: "string",
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

					lastDiscoveryAt: {
						type: "date",
						required: false,
					},
				},
			},

			unifiAccessOrganizationSource: {
				modelName: "unifiAccessOrganizationSource",

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
							model: "unifiAccessSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: () => true,
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

			unifiAccessUser: {
				modelName: "unifiAccessUser",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						index: true,
						references: {
							model: "unifiAccessSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					externalKey: {
						type: "string",
						required: true,
						unique: true,
					},

					unifiUserId: {
						type: "string",
						required: true,
						index: true,
					},

					firstName: {
						type: "string",
						required: false,
					},

					lastName: {
						type: "string",
						required: false,
					},

					fullName: {
						type: "string",
						required: false,
					},

					alias: {
						type: "string",
						required: false,
					},

					userEmail: {
						type: "string",
						required: false,
						index: true,
					},

					emailStatus: {
						type: "string",
						required: false,
					},

					phone: {
						type: "string",
						required: false,
					},

					employeeNumber: {
						type: "string",
						required: false,
						index: true,
					},

					onboardTime: {
						type: "number",
						required: false,
					},

					status: {
						type: "string",
						required: false,
					},

					lastSeenAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
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

			unifiAccessGroup: {
				modelName: "unifiAccessGroup",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						index: true,
						references: {
							model: "unifiAccessSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					externalKey: {
						type: "string",
						required: true,
						unique: true,
					},

					unifiGroupId: {
						type: "string",
						required: true,
						index: true,
					},

					name: {
						type: "string",
						required: true,
					},

					fullName: {
						type: "string",
						required: false,
					},

					parentId: {
						type: "string",
						required: false,
					},

					parentIds: {
						type: "string",
						required: false,
					},

					lastSeenAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
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

			unifiAccessResource: {
				modelName: "unifiAccessResource",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						index: true,
						references: {
							model: "unifiAccessSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					externalKey: {
						type: "string",
						required: true,
						unique: true,
					},

					unifiResourceId: {
						type: "string",
						required: true,
						index: true,
					},

					resourceType: {
						type: "string",
						required: true,
						index: true,
					},

					name: {
						type: "string",
						required: true,
					},

					shortName: {
						type: "string",
						required: false,
					},

					deleted: {
						type: "boolean",
						required: true,
						defaultValue: () => false,
					},

					metadata: {
						type: "string",
						required: false,
					},

					lastSeenAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
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
