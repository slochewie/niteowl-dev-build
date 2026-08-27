import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

type GlauthOptions = {
	pool: Pool;
};

type UserRoleRow = {
	role: string | null;
};

const createSourceBodySchema = z.object({
	name: z.string().trim().min(1).max(100),

	slug: z
		.string()
		.trim()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

const deleteSourceBodySchema = z.object({
	sourceId: z.string().min(1),
});

const updateSourceBodySchema = z.object({
	sourceId: z.string().min(1),

	name: z.string().trim().min(1).max(100),

	uidStart: z.number().int().positive(),

	gidNumber: z.number().int().positive(),

	userGroupName: z.string().trim().min(1).max(100),

	enabled: z.boolean(),
});

const assignOrganizationBodySchema = z.object({
	organizationId: z.string().min(1),

	sourceId: z.string().min(1).nullable(),
});

const reconcileSourceBodySchema = z.object({
	sourceId: z.string().min(1),
});

function ldapUsername(username: string | null, email: string) {
	const value = (username || email.split("@")[0] || "user")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]/g, "")
		.replace(/^[._-]+|[._-]+$/g, "");

	return value || "user";
}

function splitDisplayName(name: string | null) {
	const parts = (name?.trim() || "User").split(/\s+/).filter(Boolean);

	return {
		firstName: parts[0] || "User",

		lastName: parts.slice(1).join(" ") || "User",
	};
}

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
async function provisionRuntimeSchema(
	client: {
		query: (text: string, values?: unknown[]) => Promise<unknown>;
	},
	runtimeSchema: string,
) {
	if (!/^[a-z0-9_]+$/.test(runtimeSchema)) {
		throw new Error("Invalid GLAuth runtime schema");
	}

	await client.query(`CREATE SCHEMA IF NOT EXISTS "${runtimeSchema}"`);

	await client.query(`
    CREATE TABLE IF NOT EXISTS "${runtimeSchema}".users (
      id text PRIMARY KEY,
      "sourceId" text NOT NULL,
      name text NOT NULL UNIQUE,
      uidnumber integer NOT NULL UNIQUE,
      primarygroup integer NOT NULL,
      othergroups text NOT NULL DEFAULT '',
      givenname text NOT NULL DEFAULT '',
      sn text NOT NULL DEFAULT '',
      mail text NOT NULL DEFAULT '',
      loginshell text NOT NULL DEFAULT '',
      homedirectory text NOT NULL DEFAULT '',
      disabled integer NOT NULL DEFAULT 0,
      passsha256 text NOT NULL DEFAULT '',
      passbcrypt text NOT NULL DEFAULT '',
      otpsecret text NOT NULL DEFAULT '',
      yubikey text NOT NULL DEFAULT '',
      sshkeys text NOT NULL DEFAULT '',
      custattr text NOT NULL DEFAULT '{}'
    )
  `);

	await client.query(`
    CREATE TABLE IF NOT EXISTS "${runtimeSchema}".ldapgroups (
      id text PRIMARY KEY,
      "sourceId" text NOT NULL,
      name text NOT NULL UNIQUE,
      gidnumber integer NOT NULL UNIQUE
    )
  `);

	await client.query(`
    CREATE TABLE IF NOT EXISTS "${runtimeSchema}".includegroups (
      id text PRIMARY KEY,
      "sourceId" text NOT NULL,
      parentgroupid integer NOT NULL,
      includegroupid integer NOT NULL
    )
  `);

	await client.query(`
    CREATE TABLE IF NOT EXISTS "${runtimeSchema}".capabilities (
      id text PRIMARY KEY,
      "sourceId" text NOT NULL,
      userid integer NOT NULL,
      action text NOT NULL,
      object text NOT NULL
    )
  `);
}

export const glauth = ({ pool }: GlauthOptions) =>
	({
		id: "glauth",

		endpoints: {
			listGlauthSources: createAuthEndpoint(
				"/glauth/sources",
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

					const sources = await pool.query<{
						id: string;
						name: string;
						slug: string;
						baseDn: string;
						backendName: string | null;
						runtimeSchema: string | null;
						runtimePort: number | null;
						runtimeStatus: string;
						uidStart: number;
						gidNumber: number;
						userGroupName: string;
						enabled: boolean;
						projectedUsers: number;
						activeUsers: number;
						disabledUsers: number;
						createdAt: Date;
						updatedAt: Date;
						lastReconciledAt: Date | null;
					}>(
						`
                SELECT
                  s.id,
                  s.name,
                  s.slug,
                  s."baseDn",
                  s."backendName",
                  s."runtimeSchema",
                  s."runtimePort",
                  s."runtimeStatus",
                  s."uidStart",
                  s."gidNumber",
                  s."userGroupName",
                  s.enabled,
                  COUNT(gu.id)::int AS "projectedUsers",
                  COUNT(gu.id) FILTER (
                    WHERE gu.disabled = false
                  )::int AS "activeUsers",
                  COUNT(gu.id) FILTER (
                    WHERE gu.disabled = true
                  )::int AS "disabledUsers",
                  s."createdAt",
                  s."updatedAt",
                  s."lastReconciledAt"
                FROM "glauthSource" s

                LEFT JOIN "glauthUser" gu
                  ON gu."sourceId" = s.id

                GROUP BY
                  s.id,
                  s.name,
                  s.slug,
                  s."baseDn",
                  s."backendName",
                  s."runtimeSchema",
                  s."runtimePort",
                  s."runtimeStatus",
                  s."uidStart",
                  s."gidNumber",
                  s."userGroupName",
                  s.enabled,
                  s."createdAt",
                  s."updatedAt",
                  s."lastReconciledAt"

                ORDER BY s.name
              `,
					);

					const assignments = await pool.query<{
						sourceId: string;
						organizationId: string;
					}>(
						`
                  SELECT
                    "sourceId",
                    "organizationId"
                  FROM
                    "glauthOrganizationSource"
                `,
					);

					return ctx.json({
						sources: sources.rows.map((source) => ({
							...source,

							organizationIds: assignments.rows
								.filter((assignment) => assignment.sourceId === source.id)
								.map((assignment) => assignment.organizationId),
						})),
					});
				},
			),

			createGlauthSource: createAuthEndpoint(
				"/glauth/sources/create",
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

					const { name, slug } = ctx.body;

					const runtimeSchema = sourceRuntimeSchema(slug);

					const client = await pool.connect();

					try {
						await client.query("BEGIN");

						await client.query(
							`LOCK TABLE "glauthSource"
                  IN SHARE ROW EXCLUSIVE MODE`,
						);

						const portResult = await client.query<{
							runtimePort: number;
						}>(`
                  SELECT
                    COALESCE(
                      MAX("runtimePort"),
                      389
                    ) + 1 AS "runtimePort"
                  FROM "glauthSource"
                `);

						const runtimePort = portResult.rows[0]?.runtimePort;

						if (!runtimePort) {
							throw new Error("Unable to allocate GLAuth runtime port");
						}

						await provisionRuntimeSchema(client, runtimeSchema);

						const result = await client.query(
							`
                    INSERT INTO
                      "glauthSource" (
                        id,
                        name,
                        slug,
                        "baseDn",
                        "backendName",
                        "runtimeSchema",
                        "runtimePort",
                        "runtimeStatus",
                        enabled,
                        "createdAt",
                        "updatedAt"
                      )
                    VALUES (
                      gen_random_uuid()::text,
                      $1,
                      $2,
                      $3,
                      $2,
                      $4,
                      $5,
                      'provisioned',
                      true,
                      NOW(),
                      NOW()
                    )
                    RETURNING *
                  `,
							[name, slug, sourceBaseDn(slug), runtimeSchema, runtimePort],
						);

						await client.query("COMMIT");

						return ctx.json({
							source: result.rows[0],
						});
					} catch (error) {
						await client.query("ROLLBACK");

						throw error;
					} finally {
						client.release();
					}
				},
			),

			deleteGlauthSource: createAuthEndpoint(
				"/glauth/sources/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: deleteSourceBodySchema,
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

					const { sourceId } = ctx.body;

					const client = await pool.connect();

					try {
						await client.query("BEGIN");

						const sourceResult = await client.query<{
							id: string;
							name: string;
							slug: string;
							runtimeSchema: string | null;
						}>(
							`
                  SELECT
                    id,
                    name,
                    slug,
                    "runtimeSchema"
                  FROM "glauthSource"
                  WHERE id = $1
                  LIMIT 1
                  FOR UPDATE
                `,
							[sourceId],
						);

						const source = sourceResult.rows[0];

						if (!source) {
							await client.query("ROLLBACK");

							return ctx.json(
								{
									error: "GLAuth source not found",
								},
								{
									status: 404,
								},
							);
						}

						const runtimeSchema = source.runtimeSchema;

						if (runtimeSchema && !/^[a-z0-9_]+$/.test(runtimeSchema)) {
							throw new Error("GLAuth source runtime schema is invalid");
						}

						await client.query(
							`
                DELETE FROM "glauthSource"
                WHERE id = $1
              `,
							[sourceId],
						);

						if (runtimeSchema) {
							await client.query(
								`DROP SCHEMA IF EXISTS "${runtimeSchema}" CASCADE`,
							);
						}

						await client.query("COMMIT");

						return ctx.json({
							sourceId: source.id,
							sourceName: source.name,
							slug: source.slug,
						});
					} catch (error) {
						await client.query("ROLLBACK");

						throw error;
					} finally {
						client.release();
					}
				},
			),

			updateGlauthSource: createAuthEndpoint(
				"/glauth/sources/update",
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

					const {
						sourceId,
						name,
						uidStart,
						gidNumber,
						userGroupName,
						enabled,
					} = ctx.body;

					const result = await pool.query(
						`
                  UPDATE "glauthSource"
                  SET
                    name = $2,
                    "uidStart" = $3,
                    "gidNumber" = $4,
                    "userGroupName" = $5,
                    enabled = $6,
                    "updatedAt" = NOW()
                  WHERE id = $1
                  RETURNING *
                `,
						[sourceId, name, uidStart, gidNumber, userGroupName, enabled],
					);

					if (result.rowCount !== 1) {
						return ctx.json(
							{
								error: "GLAuth source not found",
							},
							{
								status: 404,
							},
						);
					}

					return ctx.json({
						source: result.rows[0],
					});
				},
			),

			setGlauthOrganizationSource: createAuthEndpoint(
				"/glauth/sources/organization",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: assignOrganizationBodySchema,
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

					const { organizationId, sourceId } = ctx.body;

					const client = await pool.connect();

					try {
						await client.query("BEGIN");

						await client.query(
							`
                  DELETE FROM
                    "glauthOrganizationSource"
                  WHERE
                    "organizationId" = $1
                `,
							[organizationId],
						);

						if (sourceId) {
							await client.query(
								`
                    INSERT INTO
                      "glauthOrganizationSource" (
                        id,
                        "sourceId",
                        "organizationId",
                        "createdAt"
                      )
                    VALUES (
                      gen_random_uuid()::text,
                      $1,
                      $2,
                      NOW()
                    )
                  `,
								[sourceId, organizationId],
							);
						}

						await client.query("COMMIT");
					} catch (error) {
						await client.query("ROLLBACK");

						throw error;
					} finally {
						client.release();
					}

					return ctx.json({
						organizationId,
						sourceId,
					});
				},
			),

			reconcileGlauthSource: createAuthEndpoint(
				"/glauth/sources/reconcile",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: reconcileSourceBodySchema,
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

					const { sourceId } = ctx.body;

					const sourceResult = await pool.query<{
						id: string;
						name: string;
						runtimeSchema: string | null;
						uidStart: number;
						gidNumber: number;
						userGroupName: string;
						enabled: boolean;
					}>(
						`
                  SELECT
                    id,
                    name,
                    "runtimeSchema",
                    "uidStart",
                    "gidNumber",
                    "userGroupName",
                    enabled
                  FROM "glauthSource"
                  WHERE id = $1
                  LIMIT 1
                `,
						[sourceId],
					);

					const source = sourceResult.rows[0];

					if (!source) {
						return ctx.json(
							{
								error: "GLAuth source not found",
							},
							{
								status: 404,
							},
						);
					}

					const runtimeSchema = source.runtimeSchema;

					if (!runtimeSchema || !/^[a-z0-9_]+$/.test(runtimeSchema)) {
						return ctx.json(
							{
								error: "GLAuth source runtime schema is invalid",
							},
							{
								status: 400,
							},
						);
					}

					const organizationResult = await pool.query<{
						organizationId: string;
					}>(
						`
                  SELECT
                    "organizationId"
                  FROM
                    "glauthOrganizationSource"
                  WHERE
                    "sourceId" = $1
                `,
						[sourceId],
					);

					const organizationIds = organizationResult.rows.map(
						(row) => row.organizationId,
					);

					const client = await pool.connect();

					try {
						await client.query("BEGIN");

						let groupResult = await client.query<{
							id: string;
							gidNumber: number;
						}>(
							`
                    SELECT
                      id,
                      "gidNumber"
                    FROM "glauthGroup"
                    WHERE
                      "sourceId" = $1
                    ORDER BY
                      "createdAt"
                    LIMIT 1
                  `,
							[sourceId],
						);

						let group = groupResult.rows[0];

						if (group) {
							groupResult = await client.query(
								`
                      UPDATE
                        "glauthGroup"
                      SET
                        name = $2,
                        "gidNumber" = $3,
                        "updatedAt" = NOW()
                      WHERE id = $1
                      RETURNING
                        id,
                        "gidNumber"
                    `,
								[group.id, source.userGroupName, source.gidNumber],
							);

							group = groupResult.rows[0];
						} else {
							groupResult = await client.query(
								`
                      INSERT INTO
                        "glauthGroup" (
                          id,
                          "sourceId",
                          name,
                          "gidNumber",
                          "createdAt",
                          "updatedAt"
                        )
                      VALUES (
                        gen_random_uuid()::text,
                        $1,
                        $2,
                        $3,
                        NOW(),
                        NOW()
                      )
                      RETURNING
                        id,
                        "gidNumber"
                    `,
								[sourceId, source.userGroupName, source.gidNumber],
							);

							group = groupResult.rows[0];
						}

						let users: Array<{
							id: string;
							name: string | null;
							username: string | null;
							email: string;
							banned: boolean;
							firstName: string | null;
							lastName: string | null;
						}> = [];

						if (organizationIds.length > 0) {
							const userResult = await client.query<{
								id: string;
								name: string | null;
								username: string | null;
								email: string;
								banned: boolean;
								firstName: string | null;
								lastName: string | null;
							}>(
								`
                      SELECT DISTINCT
                        u.id,
                        u.name,
                        u.username,
                        u.email,
                        COALESCE(
                          u.banned,
                          false
                        ) AS banned,
                        p."firstName",
                        p."lastName"
                      FROM "user" u

                      INNER JOIN member m
                        ON
                          m."userId" =
                            u.id

                      LEFT JOIN
                        "userProfile" p
                        ON
                          p."userId" =
                            u.id

                      WHERE
                        m."organizationId" =
                          ANY(
                            $1::text[]
                          )
                        AND
                        u.email IS NOT NULL

                      ORDER BY
                        u.email
                    `,
								[organizationIds],
							);

							users = userResult.rows;
						}

						const existingResult = await client.query<{
							id: string;
							userId: string;
							name: string;
							uidNumber: number;
						}>(
							`
                    SELECT
                      id,
                      "userId",
                      name,
                      "uidNumber"
                    FROM "glauthUser"
                    WHERE
                      "sourceId" = $1
                  `,
							[sourceId],
						);

						const existingByUserId = new Map(
							existingResult.rows.map((row) => [row.userId, row]),
						);

						const usedNames = new Set<string>();

						const desiredUserIds = new Set<string>();

						let created = 0;
						let updated = 0;

						for (const user of users) {
							desiredUserIds.add(user.id);

							const existing = existingByUserId.get(user.id);

							const splitName = splitDisplayName(user.name);

							const givenName = user.firstName?.trim() || splitName.firstName;

							const sn = user.lastName?.trim() || splitName.lastName;

							let name =
								existing?.name || ldapUsername(user.username, user.email);

							if (!existing) {
								const base = name;

								let suffix = 1;

								while (usedNames.has(name)) {
									suffix++;

									name = `${base}${suffix}`;
								}
							}

							usedNames.add(name);

							if (existing) {
								await client.query(
									`
                      UPDATE
                        "glauthUser"
                      SET
                        name = $3,
                        "primaryGroup" = $4,
                        "givenName" = $5,
                        sn = $6,
                        mail = $7,
                        "loginShell" =
                          '/bin/bash',
                        "homeDirectory" =
                          $8,
                        disabled = $9,
                        "updatedAt" =
                          NOW()
                      WHERE
                        id = $1
                        AND
                        "sourceId" = $2
                    `,
									[
										existing.id,
										sourceId,
										name,
										group.gidNumber,
										givenName,
										sn,
										user.email,
										`/home/${name}`,
										user.banned,
									],
								);

								updated++;
							} else {
								const uidResult = await client.query<{
									nextUid: number;
								}>(
									`
                        SELECT
                          GREATEST(
                            COALESCE(
                              MAX(
                                "uidNumber"
                              ),
                              5999
                            ) + 1,
                            6000
                          )::int AS
                            "nextUid"
                        FROM
                          "glauthUser"
                      `,
								);

								await client.query(
									`
                      INSERT INTO
                        "glauthUser" (
                          id,
                          "sourceId",
                          "userId",
                          name,
                          "uidNumber",
                          "primaryGroup",
                          "givenName",
                          sn,
                          mail,
                          "loginShell",
                          "homeDirectory",
                          disabled,
                          "customAttributes",
                          "createdAt",
                          "updatedAt"
                        )
                      VALUES (
                        gen_random_uuid()::text,
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        '/bin/bash',
                        $9,
                        $10,
                        '{}',
                        NOW(),
                        NOW()
                      )
                    `,
									[
										sourceId,
										user.id,
										name,
										uidResult.rows[0].nextUid,
										group.gidNumber,
										givenName,
										sn,
										user.email,
										`/home/${name}`,
										user.banned,
									],
								);

								created++;
							}
						}

						let removed = 0;

						for (const existing of existingResult.rows) {
							if (desiredUserIds.has(existing.userId)) {
								continue;
							}

							await client.query(
								`
                    DELETE FROM
                      "glauthUser"
                    WHERE id = $1
                  `,
								[existing.id],
							);

							removed++;
						}

						await client.query(
							`
                  DELETE FROM
                    "${runtimeSchema}".users
                  WHERE
                    "sourceId" = $1
                `,
							[sourceId],
						);

						await client.query(
							`
                  DELETE FROM
                    "${runtimeSchema}".ldapgroups
                  WHERE
                    "sourceId" = $1
                `,
							[sourceId],
						);

						await client.query(
							`
                  INSERT INTO
                    "${runtimeSchema}".ldapgroups (
                      id,
                      "sourceId",
                      name,
                      gidnumber
                    )
                  SELECT
                    gen_random_uuid()::text,
                    gg."sourceId",
                    gg.name,
                    gg."gidNumber"
                  FROM
                    "glauthGroup" gg
                  WHERE
                    gg."sourceId" = $1
                `,
							[sourceId],
						);

						await client.query(
							`
                  INSERT INTO
                    "${runtimeSchema}".users (
                      id,
                      "sourceId",
                      name,
                      uidnumber,
                      primarygroup,
                      othergroups,
                      givenname,
                      sn,
                      mail,
                      loginshell,
                      homedirectory,
                      disabled,
                      passsha256,
                      passbcrypt,
                      otpsecret,
                      yubikey,
                      sshkeys,
                      custattr
                    )
                  SELECT
                    gen_random_uuid()::text,
                    gu."sourceId",
                    gu.name,
                    gu."uidNumber",
                    gu."primaryGroup",
                    COALESCE(
                      gu."otherGroups",
                      ''
                    ),
                    COALESCE(
                      gu."givenName",
                      ''
                    ),
                    COALESCE(
                      gu.sn,
                      ''
                    ),
                    gu.mail,
                    COALESCE(
                      gu."loginShell",
                      ''
                    ),
                    COALESCE(
                      gu."homeDirectory",
                      ''
                    ),
                    CASE
                      WHEN gu.disabled
                        THEN 1
                      ELSE 0
                    END,
                    COALESCE(
                      gu."passSha256",
                      ''
                    ),
                    COALESCE(
                      gu."passBcrypt",
                      ''
                    ),
                    '',
                    '',
                    '',
                    COALESCE(
                      gu."customAttributes",
                      '{}'
                    )
                  FROM
                    "glauthUser" gu
                  WHERE
                    gu."sourceId" = $1
                `,
							[sourceId],
						);

						await client.query(
							`
                  DELETE FROM
                    "${runtimeSchema}".capabilities
                  WHERE
                    "sourceId" = $1
                `,
							[sourceId],
						);

						await client.query(
							`
                  INSERT INTO
                    "${runtimeSchema}".ldapgroups (
                      id,
                      "sourceId",
                      name,
                      gidnumber
                    )
                  SELECT
                    gen_random_uuid()::text,
                    $1,
                    'svc',
                    sa."gidNumber"
                  FROM
                    "glauthServiceAccount" sa
                  WHERE
                    sa."sourceId" = $1
                    AND sa.enabled = true
                    AND NOT EXISTS (
                      SELECT 1
                      FROM "${runtimeSchema}".ldapgroups lg
                      WHERE
                        lg.name = 'svc'
                        OR lg.gidnumber =
                          sa."gidNumber"
                    )
                  LIMIT 1
                `,
							[sourceId],
						);

						await client.query(
							`
                  INSERT INTO
                    "${runtimeSchema}".users (
                      id,
                      "sourceId",
                      name,
                      uidnumber,
                      primarygroup,
                      othergroups,
                      givenname,
                      sn,
                      mail,
                      loginshell,
                      homedirectory,
                      disabled,
                      passsha256,
                      passbcrypt,
                      otpsecret,
                      yubikey,
                      sshkeys,
                      custattr
                    )
                  SELECT
                    gen_random_uuid()::text,
                    sa."sourceId",
                    sa.name,
                    sa."uidNumber",
                    sa."gidNumber",
                    '',
                    sa."givenName",
                    sa.sn,
                    sa.mail,
                    '/bin/bash',
                    '/home/' ||
                      sa.name,
                    CASE
                      WHEN sa.enabled
                        THEN 0
                      ELSE 1
                    END,
                    sa."passSha256",
                    '',
                    '',
                    '',
                    '',
                    '{}'
                  FROM
                    "glauthServiceAccount" sa
                  WHERE
                    sa."sourceId" = $1
                    AND sa.enabled = true
                `,
							[sourceId],
						);

						await client.query(
							`
                  INSERT INTO
                    "${runtimeSchema}".capabilities (
                      id,
                      "sourceId",
                      userid,
                      action,
                      object
                    )
                  SELECT
                    gen_random_uuid()::text,
                    sa."sourceId",
                    sa."uidNumber",
                    'search',
                    capability.object
                  FROM
                    "glauthServiceAccount" sa
                  CROSS JOIN LATERAL (
                    VALUES
                      (
                        sa."searchBaseDn"
                      ),
                      (
                        sa."groupSearchBaseDn"
                      )
                  ) AS capability(object)
                  WHERE
                    sa."sourceId" = $1
                    AND sa.enabled = true
                    AND capability.object
                      IS NOT NULL
                    AND capability.object
                      <> ''
                `,
							[sourceId],
						);

						await client.query(
							`
                  UPDATE "glauthSource"
                  SET
                    "runtimeStatus" =
                      'provisioned',
                    "lastReconciledAt" =
                      NOW(),
                    "updatedAt" =
                      NOW()
                  WHERE id = $1
                `,
							[sourceId],
						);

						await client.query("COMMIT");

						return ctx.json({
							sourceId,
							sourceName: source.name,
							organizations: organizationIds.length,
							users: users.length,
							created,
							updated,
							removed,
							disabled: users.filter((user) => user.banned).length,
						});
					} catch (error) {
						await client.query("ROLLBACK");

						throw error;
					} finally {
						client.release();
					}
				},
			),
		},

		schema: {
			glauthSource: {
				modelName: "glauthSource",

				fields: {
					name: {
						type: "string",
						required: true,
					},

					slug: {
						type: "string",
						required: true,
						unique: true,
					},

					baseDn: {
						type: "string",
						required: true,
						unique: true,
					},

					backendName: {
						type: "string",
						required: false,
					},

					runtimeSchema: {
						type: "string",
						required: false,
						unique: true,
					},

					runtimePort: {
						type: "number",
						required: false,
					},

					runtimeStatus: {
						type: "string",
						required: true,
						defaultValue: "pending",
					},

					uidStart: {
						type: "number",
						required: true,
						defaultValue: 6000,
					},

					gidNumber: {
						type: "number",
						required: true,
						defaultValue: 5501,
					},

					userGroupName: {
						type: "string",
						required: true,
						defaultValue: "ldapusers",
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: true,
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

					lastReconciledAt: {
						type: "date",
						required: false,
					},
				},
			},

			glauthOrganizationSource: {
				modelName: "glauthOrganizationSource",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

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

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},
			},

			glauthUser: {
				modelName: "glauthUser",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					userId: {
						type: "string",
						required: true,
						references: {
							model: "user",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
					},

					uidNumber: {
						type: "number",
						required: true,
						unique: true,
					},

					primaryGroup: {
						type: "number",
						required: true,
					},

					otherGroups: {
						type: "string",
						required: false,
					},

					givenName: {
						type: "string",
						required: false,
					},

					sn: {
						type: "string",
						required: false,
					},

					mail: {
						type: "string",
						required: true,
					},

					loginShell: {
						type: "string",
						required: false,
					},

					homeDirectory: {
						type: "string",
						required: false,
					},

					disabled: {
						type: "boolean",
						required: true,
						defaultValue: false,
					},

					passSha256: {
						type: "string",
						required: false,
					},

					passBcrypt: {
						type: "string",
						required: false,
					},

					customAttributes: {
						type: "string",
						required: true,
						defaultValue: "{}",
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

			glauthGroup: {
				modelName: "glauthGroup",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
					},

					gidNumber: {
						type: "number",
						required: true,
						unique: true,
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

			glauthUserGroup: {
				modelName: "glauthUserGroup",

				fields: {
					glauthUserId: {
						type: "string",
						required: true,
						references: {
							model: "glauthUser",
							field: "id",
							onDelete: "cascade",
						},
					},

					glauthGroupId: {
						type: "string",
						required: true,
						references: {
							model: "glauthGroup",
							field: "id",
							onDelete: "cascade",
						},
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},
			},

			glauthServiceAccount: {
				modelName: "glauthServiceAccount",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
					},

					uidNumber: {
						type: "number",
						required: true,
						unique: true,
					},

					gidNumber: {
						type: "number",
						required: true,
					},

					givenName: {
						type: "string",
						required: true,
					},

					sn: {
						type: "string",
						required: true,
					},

					mail: {
						type: "string",
						required: true,
					},

					passSha256: {
						type: "string",
						required: true,
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: true,
					},

					searchBaseDn: {
						type: "string",
						required: true,
					},

					groupSearchBaseDn: {
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
				},
			},

			glauthRuntimeUser: {
				modelName: "users",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
						unique: true,
					},

					uidnumber: {
						type: "number",
						required: true,
						unique: true,
					},

					primarygroup: {
						type: "number",
						required: true,
					},

					othergroups: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					givenname: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					sn: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					mail: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					loginshell: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					homedirectory: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					disabled: {
						type: "number",
						required: true,
						defaultValue: 0,
					},

					passsha256: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					passbcrypt: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					otpsecret: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					yubikey: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					sshkeys: {
						type: "string",
						required: true,
						defaultValue: "",
					},

					custattr: {
						type: "string",
						required: true,
						defaultValue: "{}",
					},
				},
			},

			glauthRuntimeGroup: {
				modelName: "ldapgroups",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
						unique: true,
					},

					gidnumber: {
						type: "number",
						required: true,
						unique: true,
					},
				},
			},

			glauthRuntimeIncludeGroup: {
				modelName: "includegroups",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					parentgroupid: {
						type: "number",
						required: true,
					},

					includegroupid: {
						type: "number",
						required: true,
					},
				},
			},

			glauthRuntimeCapability: {
				modelName: "capabilities",

				fields: {
					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "glauthSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					userid: {
						type: "number",
						required: true,
					},

					action: {
						type: "string",
						required: true,
					},

					object: {
						type: "string",
						required: true,
					},
				},
			},
		},
	}) satisfies BetterAuthPlugin;
