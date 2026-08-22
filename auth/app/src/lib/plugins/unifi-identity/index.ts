import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

import type { Pool } from "pg";
import type { BetterAuthPlugin } from "better-auth";
import {
  createAuthEndpoint,
  sessionMiddleware,
} from "better-auth/api";
import * as z from "zod";

import { unifiRequest } from "./client.js";

type UnifiIdentityPluginOptions = {
  pool: Pool;
  encryptionKey: string;
};

type OrganizationRole = {
  role: string;
};

type UserRole = {
  role: string | null;
};

type UnifiConfigRow = {
  id: string;
  organizationId: string;
  enabled: boolean;
  consoleUrl: string;
  apiToken: string;
  verifyTls: boolean;
  lastTestedAt: Date | null;
  lastSyncAt: Date | null;
};

type UnifiIdentityResource = {
  id: string;
  name: string;
  deleted?: boolean;
};

type UnifiIdentityResourcesResponse = {
  code: string;
  msg: string;
  data?: {
    wifi?: UnifiIdentityResource[];
    vpn?: UnifiIdentityResource[];
    camera?: UnifiIdentityResource[];
    ev_station?: UnifiIdentityResource[];
  };
};

type UnifiUserAccessRow = {
  id: string;
  organizationId: string;
  userId: string;
  wifiEnabled: boolean;
};

type BetterAuthProvisionUser = {
  id: string;
  name: string;
  email: string;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
};

type UnifiUser = {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  user_email?: string;
  employee_number?: string;
  status?: string;
};

type UnifiUserSearchResponse = {
  code: string;
  msg: string;
  data?: UnifiUser[];
};

type UnifiCreateUserResponse = {
  code: string;
  msg: string;
  data?: UnifiUser;
};

type UnifiSuccessResponse = {
  code: string;
  msg: string;
  data?: unknown;
};

type UnifiOrganizationUserRow = {
  id: string;
  organizationId: string;
  userId: string;
  unifiUserId: string;
  identityInvitedAt: Date | null;
  unifiStatus: string | null;
  syncState: string;
  lastSyncedAt: Date | null;
  lastError: string | null;
};

type CachedUnifiResource = {
  id: string;
  unifiResourceId: string;
  resourceType: string;
  name: string;
  lastSeenAt: Date | null;
};

type UnifiGroup = {
  id: string;
  name: string;
  full_name?: string;
};

type UnifiGroupsResponse = {
  code: string;
  msg: string;
  data?: UnifiGroup[];
};

type UnifiGroupUser = {
  id: string;
  user_email?: string;
  employee_number?: string;
  status?: string;
};

type UnifiGroupUsersResponse = {
  code: string;
  msg: string;
  data?: UnifiGroupUser[];
};

type CachedUnifiGroup = {
  id: string;
  organizationId: string;
  unifiGroupId: string;
  name: string;
  fullName: string | null;
  lastSeenAt: Date | null;
};

type UnifiGroupEntitlementRuleRow = {
  id: string;
  organizationId: string;
  groupId: string;
  subjectType: string;
  subjectId: string | null;
  capability: string | null;
  enabled: boolean;
  unifiGroupId: string;
  groupName: string;
  groupFullName: string | null;
};


type UnifiEntitlementRuleRow = {
  id: string;
  organizationId: string;
  resourceId: string;
  subjectType: string;
  subjectId: string | null;
  enabled: boolean;
  unifiResourceId: string;
  resourceType: string;
  resourceName: string;
};

const configBodySchema = z.object({
  organizationId: z.string().min(1),
  enabled: z.boolean(),
  consoleUrl: z.string().url(),
  apiToken: z.string().min(1).optional(),
  verifyTls: z.boolean(),
});

const testBodySchema = z.object({
  organizationId: z.string().min(1),
});

const resourcesBodySchema = z.object({
  organizationId: z.string().min(1),
});

const provisionUserBodySchema = z.object({
  organizationId: z.string().min(1),
  userId: z.string().min(1),
});

const userAccessBodySchema = z.object({
  organizationId: z.string().min(1),
  userId: z.string().min(1),
  wifiEnabled: z.boolean(),
});

function getKey(key: string) {
  const buffer = Buffer.from(key, "hex");

  if (buffer.length !== 32) {
    throw new Error(
      "INTEGRATION_ENCRYPTION_KEY must be 32 bytes encoded as 64 hexadecimal characters",
    );
  }

  return buffer;
}

function encryptSecret(
  plaintext: string,
  encryptionKey: string,
) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    getKey(encryptionKey),
    iv,
  );

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

function decryptSecret(
  value: string,
  encryptionKey: string,
) {
  const [version, ivValue, tagValue, ciphertextValue] =
    value.split(".");

  if (
    version !== "v1" ||
    !ivValue ||
    !tagValue ||
    !ciphertextValue
  ) {
    throw new Error("Invalid encrypted secret format");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(encryptionKey),
    Buffer.from(ivValue, "base64url"),
  );

  decipher.setAuthTag(
    Buffer.from(tagValue, "base64url"),
  );

  const plaintext = Buffer.concat([
    decipher.update(
      Buffer.from(ciphertextValue, "base64url"),
    ),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

async function canManageOrganization(
  pool: Pool,
  userId: string,
  organizationId: string,
) {
  const globalUser = await pool.query<UserRole>(
    `
      SELECT role
      FROM "user"
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  if (globalUser.rows[0]?.role === "admin") {
    return true;
  }

  const membership = await pool.query<OrganizationRole>(
    `
      SELECT role
      FROM member
      WHERE "organizationId" = $1
        AND "userId" = $2
      LIMIT 1
    `,
    [organizationId, userId],
  );

  const role = membership.rows[0]?.role;

  return role === "owner" || role === "admin";
}

async function isOrganizationMember(
  pool: Pool,
  userId: string,
  organizationId: string,
) {
  const membership = await pool.query(
    `
      SELECT id
      FROM member
      WHERE "organizationId" = $1
        AND "userId" = $2
      LIMIT 1
    `,
    [organizationId, userId],
  );

  return membership.rowCount === 1;
}

async function getUnifiConfig(
  pool: Pool,
  organizationId: string,
) {
  const result = await pool.query<UnifiConfigRow>(
    `
      SELECT
        id,
        "organizationId",
        enabled,
        "consoleUrl",
        "apiToken",
        "verifyTls",
        "lastTestedAt",
        "lastSyncAt"
      FROM "unifiOrganizationConfig"
      WHERE "organizationId" = $1
      LIMIT 1
    `,
    [organizationId],
  );

  return result.rows[0] ?? null;
}

async function getProvisionUser(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const result =
    await pool.query<BetterAuthProvisionUser>(
      `
        SELECT
          u.id,
          u.name,
          u.email,
          se."employeeId",
          se."firstName",
          se."lastName"
        FROM member m
        JOIN "user" u
          ON u.id = m."userId"
        LEFT JOIN "sevenShiftsEmployee" se
          ON se."userId" = u.id
        WHERE m."organizationId" = $1
          AND u.id = $2
        LIMIT 1
      `,
      [
        organizationId,
        userId,
      ],
    );

  return result.rows[0] ?? null;
}

async function getOrganizationUserMapping(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const result =
    await pool.query<UnifiOrganizationUserRow>(
      `
        SELECT
          id,
          "organizationId",
          "userId",
          "unifiUserId",
          "identityInvitedAt",
          "unifiStatus",
          "syncState",
          "lastSyncedAt",
          "lastError"
        FROM "unifiOrganizationUser"
        WHERE "organizationId" = $1
          AND "userId" = $2
        LIMIT 1
      `,
      [
        organizationId,
        userId,
      ],
    );

  return result.rows[0] ?? null;
}

async function getUserWifiAccess(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const result =
    await pool.query<UnifiUserAccessRow>(
      `
        SELECT
          id,
          "organizationId",
          "userId",
          "wifiEnabled"
        FROM "unifiUserAccess"
        WHERE "organizationId" = $1
          AND "userId" = $2
        LIMIT 1
      `,
      [
        organizationId,
        userId,
      ],
    );

  return result.rows[0] ?? {
    id: "",
    organizationId,
    userId,
    wifiEnabled: true,
  };
}

async function getOrganizationWifiResources(
  pool: Pool,
  organizationId: string,
) {
  const result =
    await pool.query<CachedUnifiResource>(
      `
        SELECT
          id,
          "unifiResourceId",
          "resourceType",
          name,
          "lastSeenAt"
        FROM "unifiResource"
        WHERE "organizationId" = $1
          AND "resourceType" = 'wifi'
        ORDER BY name
      `,
      [organizationId],
    );

  return result.rows;
}

async function getDesiredEntitlementResources(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const rules =
    await pool.query<UnifiEntitlementRuleRow>(
      `
        SELECT
          r.id,
          r."organizationId",
          r."resourceId",
          r."subjectType",
          r."subjectId",
          r.enabled,
          ur."unifiResourceId",
          ur."resourceType",
          ur.name AS "resourceName"
        FROM "unifiEntitlementRule" r
        JOIN "unifiResource" ur
          ON ur.id = r."resourceId"
        WHERE r."organizationId" = $1
          AND r.enabled = true
        ORDER BY
          ur."resourceType",
          ur.name
      `,
      [organizationId],
    );

  const memberResult = await pool.query<{
    role: string;
  }>(
    `
      SELECT role
      FROM member
      WHERE "organizationId" = $1
        AND "userId" = $2
      LIMIT 1
    `,
    [
      organizationId,
      userId,
    ],
  );

  const member = memberResult.rows[0];

  if (!member) {
    return [];
  }

  const roles = new Set(
    member.role
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean),
  );

  const teamResult = await pool.query<{
    teamId: string;
  }>(
    `
      SELECT tm."teamId"
      FROM "teamMember" tm
      JOIN team t
        ON t.id = tm."teamId"
      WHERE tm."userId" = $1
        AND t."organizationId" = $2
    `,
    [
      userId,
      organizationId,
    ],
  );

  const teamIds = new Set(
    teamResult.rows.map(
      (row) => row.teamId,
    ),
  );

  return rules.rows.filter((rule) => {
    if (
      rule.subjectType === "member"
    ) {
      return true;
    }

    if (
      rule.subjectType === "role"
    ) {
      return Boolean(
        rule.subjectId &&
          roles.has(rule.subjectId),
      );
    }

    if (
      rule.subjectType === "team"
    ) {
      return Boolean(
        rule.subjectId &&
          teamIds.has(rule.subjectId),
      );
    }

    return false;
  });
}

async function refreshUnifiGroups(
  pool: Pool,
  organizationId: string,
  config: UnifiConfigRow,
  token: string,
) {
  const response =
    await unifiRequest<UnifiGroupsResponse>({
      baseUrl:
        config.consoleUrl,
      apiToken: token,
      verifyTls:
        config.verifyTls,
      path:
        "/api/v1/developer/user_groups",
    });

  if (
    !response.ok ||
    !response.data ||
    typeof response.data !== "object" ||
    !("code" in response.data) ||
    response.data.code !== "SUCCESS"
  ) {
    throw new Error(
      `Unable to fetch UniFi groups: ${JSON.stringify(
        response.data,
      )}`,
    );
  }

  const groups =
    response.data.data ?? [];

  const client =
    await pool.connect();

  try {
    await client.query("BEGIN");

    for (const group of groups) {
      await client.query(
        `
          INSERT INTO "unifiGroup" (
            id,
            "organizationId",
            "unifiGroupId",
            name,
            "fullName",
            "lastSeenAt"
          )
          VALUES (
            gen_random_uuid()::text,
            $1,
            $2,
            $3,
            $4,
            NOW()
          )
          ON CONFLICT (
            "organizationId",
            "unifiGroupId"
          )
          DO UPDATE SET
            name =
              EXCLUDED.name,
            "fullName" =
              EXCLUDED."fullName",
            "lastSeenAt" =
              NOW()
        `,
        [
          organizationId,
          group.id,
          group.name,
          group.full_name ?? null,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return groups;
}

async function getUserWifiEnabled(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const result = await pool.query<{
    wifiEnabled: boolean;
  }>(
    `
      SELECT "wifiEnabled"
      FROM "unifiUserAccess"
      WHERE "organizationId" = $1
        AND "userId" = $2
      LIMIT 1
    `,
    [
      organizationId,
      userId,
    ],
  );

  return result.rows[0]?.wifiEnabled ?? true;
}

async function getDesiredGroups(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const rules =
    await pool.query<UnifiGroupEntitlementRuleRow>(
      `
        SELECT
          r.id,
          r."organizationId",
          r."groupId",
          r."subjectType",
          r."subjectId",
          r.capability,
          r.enabled,
          g."unifiGroupId",
          g.name AS "groupName",
          g."fullName" AS "groupFullName"
        FROM "unifiGroupEntitlementRule" r
        JOIN "unifiGroup" g
          ON g.id = r."groupId"
        WHERE r."organizationId" = $1
          AND r.enabled = true
        ORDER BY g.name
      `,
      [organizationId],
    );

  const memberResult =
    await pool.query<{
      role: string;
    }>(
      `
        SELECT role
        FROM member
        WHERE "organizationId" = $1
          AND "userId" = $2
        LIMIT 1
      `,
      [
        organizationId,
        userId,
      ],
    );

  const member =
    memberResult.rows[0];

  if (!member) {
    return [];
  }

  const roles =
    new Set(
      member.role
        .split(",")
        .map(
          (role) =>
            role.trim(),
        )
        .filter(Boolean),
    );

  const teamResult =
    await pool.query<{
      teamId: string;
    }>(
      `
        SELECT tm."teamId"
        FROM "teamMember" tm
        JOIN team t
          ON t.id =
            tm."teamId"
        WHERE tm."userId" = $1
          AND t."organizationId" = $2
      `,
      [
        userId,
        organizationId,
      ],
    );

  const teamIds =
    new Set(
      teamResult.rows.map(
        (row) =>
          row.teamId,
      ),
    );

  const wifiEnabled =
    await getUserWifiEnabled(
      pool,
      organizationId,
      userId,
    );

  return rules.rows.filter(
    (rule) => {
      if (
        rule.capability === "wifi" &&
        !wifiEnabled
      ) {
        return false;
      }

      if (
        rule.subjectType ===
        "member"
      ) {
        return true;
      }

      if (
        rule.subjectType ===
        "role"
      ) {
        return Boolean(
          rule.subjectId &&
            roles.has(
              rule.subjectId,
            ),
        );
      }

      if (
        rule.subjectType ===
        "team"
      ) {
        return Boolean(
          rule.subjectId &&
            teamIds.has(
              rule.subjectId,
            ),
        );
      }

      return false;
    },
  );
}


async function userHasWifiEntitlement(
  pool: Pool,
  organizationId: string,
  userId: string,
) {
  const desiredGroups =
    await getDesiredGroups(
      pool,
      organizationId,
      userId,
    );

  return desiredGroups.some(
    (group) =>
      group.capability === "wifi",
  );
}


async function fetchGroupUsers(
  config: UnifiConfigRow,
  token: string,
  unifiGroupId: string,
) {
  const response =
    await unifiRequest<UnifiGroupUsersResponse>({
      baseUrl:
        config.consoleUrl,
      apiToken: token,
      verifyTls:
        config.verifyTls,
      path:
        `/api/v1/developer/user_groups/${encodeURIComponent(
          unifiGroupId,
        )}/users`,
    });

  if (
    !response.ok ||
    !response.data ||
    typeof response.data !== "object" ||
    !("code" in response.data) ||
    response.data.code !== "SUCCESS"
  ) {
    throw new Error(
      `Unable to fetch UniFi group users: ${JSON.stringify(
        response.data,
      )}`,
    );
  }

  return response.data.data ?? [];
}

async function removeUserFromGroup(
  config: UnifiConfigRow,
  token: string,
  groupId: string,
  userId: string,
) {
  return unifiRequest<UnifiSuccessResponse>({
    baseUrl: config.consoleUrl,
    apiToken: token,
    verifyTls: config.verifyTls,
    method: "DELETE",
    path:
      `/api/v1/developer/user_groups/${encodeURIComponent(
        groupId,
      )}/users/${encodeURIComponent(
        userId,
      )}`,
  });
}

async function setMappingError(
  pool: Pool,
  organizationId: string,
  userId: string,
  error: string,
) {
  await pool.query(
    `
      UPDATE "unifiOrganizationUser"
      SET
        "syncState" = 'error',
        "lastError" = $3,
        "lastSyncedAt" = NOW()
      WHERE "organizationId" = $1
        AND "userId" = $2
    `,
    [
      organizationId,
      userId,
      error,
    ],
  );
}

function splitName(name: string) {
  const normalized = name
    .trim()
    .replace(/\s+/g, " ");

  if (!normalized) {
    return {
      firstName: "Unknown",
      lastName: "User",
    };
  }

  const parts = normalized.split(" ");

  if (parts.length === 1) {
    return {
      firstName: parts[0]!,
      lastName: "User",
    };
  }

  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
  };
}

function publicConfig(config: UnifiConfigRow) {
  return {
    organizationId: config.organizationId,
    enabled: config.enabled,
    consoleUrl: config.consoleUrl,
    verifyTls: config.verifyTls,
    hasApiToken: Boolean(config.apiToken),
    lastTestedAt: config.lastTestedAt,
    lastSyncAt: config.lastSyncAt,
  };
}

function isSuccessResponse(
  value: unknown,
): value is UnifiSuccessResponse {
  return Boolean(
    value &&
      typeof value === "object" &&
      "code" in value &&
      value.code === "SUCCESS",
  );
}

async function reconcileUnifiUserById(
  pool: Pool,
  encryptionKey: string,
  organizationId: string,
  userId: string,
) {
  const mapping =
    await getOrganizationUserMapping(
      pool,
      organizationId,
      userId,
    );

  if (!mapping) {
    return {
      ok: false,
      skipped: true,
      reason:
        "No UniFi mapping exists",
    };
  }

  const config =
    await getUnifiConfig(
      pool,
      organizationId,
    );

  if (!config) {
    return {
      ok: true,
      skipped: true,
      reason:
        "UniFi not configured",
      changes: [],
    };
  }

  if (!config.enabled) {
    return {
      ok: true,
      skipped: true,
      reason:
        "UniFi disabled for organization",
      changes: [],
    };
  }

  const token =
    decryptSecret(
      config.apiToken,
      encryptionKey,
    );

  const desiredGroups =
    await getDesiredGroups(
      pool,
      organizationId,
      userId,
    );

  const governedGroups =
    await pool.query<{
      unifiGroupId: string;
      name: string;
    }>(
      `
        SELECT
          g."unifiGroupId",
          g.name
        FROM "unifiGroupEntitlementRule" r
        JOIN "unifiGroup" g
          ON g.id = r."groupId"
        WHERE r."organizationId" = $1
          AND r.enabled = true
      `,
      [
        organizationId,
      ],
    );

  const desiredIds =
    new Set(
      desiredGroups.map(
        (group) =>
          group.unifiGroupId,
      ),
    );

  const changes = [];

  for (
    const group of governedGroups.rows
  ) {
    const users =
      await fetchGroupUsers(
        config,
        token,
        group.unifiGroupId,
      );

    const alreadyMember =
      users.some(
        (user) =>
          user.id === mapping.unifiUserId,
      );

    const shouldHave =
      desiredIds.has(
        group.unifiGroupId,
      );

    if (
      shouldHave &&
      !alreadyMember
    ) {
      await unifiRequest<UnifiSuccessResponse>({
        baseUrl:
          config.consoleUrl,
        apiToken:
          token,
        verifyTls:
          config.verifyTls,
        method:
          "POST",
        path:
          `/api/v1/developer/user_groups/${encodeURIComponent(
            group.unifiGroupId,
          )}/users`,
        body:[
          mapping.unifiUserId,
        ],
      });

      changes.push({
        group:
          group.name,
        action:
          "added",
      });
    }

    if (
      !shouldHave &&
      alreadyMember
    ) {
      await removeUserFromGroup(
        config,
        token,
        group.unifiGroupId,
        mapping.unifiUserId,
      );

      changes.push({
        group:
          group.name,
        action:
          "removed",
      });
    }
  }

  await pool.query(
    `
      UPDATE "unifiOrganizationUser"
      SET
        "syncState" = 'synced',
        "lastSyncedAt" = NOW(),
        "lastError" = NULL
      WHERE "organizationId" = $1
        AND "userId" = $2
    `,
    [
      organizationId,
      userId,
    ],
  );

  return {
    ok: true,
    changes,
  };
}

export const unifiIdentity = ({
  pool,
  encryptionKey,
}: UnifiIdentityPluginOptions) =>
  ({
    id: "unifi-identity",

    endpoints: {
      unifiIdentityConfig: createAuthEndpoint(
        "/unifi-identity/config",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const session = ctx.context.session;
          const requestUrl = ctx.request?.url;

          if (!requestUrl) {
            return ctx.json(
              {
                error:
                  "Unable to determine request URL",
              },
              {
                status: 400,
              },
            );
          }

          const organizationId =
            new URL(
              requestUrl,
            ).searchParams.get(
              "organizationId",
            );

          if (!organizationId) {
            return ctx.json(
              {
                error:
                  "organizationId is required",
              },
              {
                status: 400,
              },
            );
          }

          const member =
            await isOrganizationMember(
              pool,
              session.user.id,
              organizationId,
            );

          const manager =
            await canManageOrganization(
              pool,
              session.user.id,
              organizationId,
            );

          if (!member && !manager) {
            return ctx.json(
              {
                error: "Forbidden",
              },
              {
                status: 403,
              },
            );
          }

          const config =
            await getUnifiConfig(
              pool,
              organizationId,
            );

          if (!config) {
            return ctx.json({
              organizationId,
              configured: false,
            });
          }

          return ctx.json({
            configured: true,
            ...publicConfig(config),
          });
        },
      ),

      updateUnifiIdentityConfig:
        createAuthEndpoint(
          "/unifi-identity/config",
          {
            method: "PUT",
            use: [sessionMiddleware],
            body: configBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const body = ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const current =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            if (
              !current &&
              !body.apiToken
            ) {
              return ctx.json(
                {
                  error:
                    "apiToken is required when creating UniFi configuration",
                },
                {
                  status: 400,
                },
              );
            }

            const encryptedToken =
              body.apiToken
                ? encryptSecret(
                    body.apiToken,
                    encryptionKey,
                  )
                : current!.apiToken;

            const result =
              await pool.query<UnifiConfigRow>(
                `
                  INSERT INTO "unifiOrganizationConfig" (
                    id,
                    "organizationId",
                    enabled,
                    "consoleUrl",
                    "apiToken",
                    "verifyTls"
                  )
                  VALUES (
                    gen_random_uuid()::text,
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                  )
                  ON CONFLICT ("organizationId")
                  DO UPDATE SET
                    enabled =
                      EXCLUDED.enabled,
                    "consoleUrl" =
                      EXCLUDED."consoleUrl",
                    "apiToken" =
                      EXCLUDED."apiToken",
                    "verifyTls" =
                      EXCLUDED."verifyTls"
                  RETURNING
                    id,
                    "organizationId",
                    enabled,
                    "consoleUrl",
                    "apiToken",
                    "verifyTls",
                    "lastTestedAt",
                    "lastSyncAt"
                `,
                [
                  body.organizationId,
                  body.enabled,
                  body.consoleUrl,
                  encryptedToken,
                  body.verifyTls,
                ],
              );

            return ctx.json({
              configured: true,
              ...publicConfig(
                result.rows[0]!,
              ),
            });
          },
        ),

      testUnifiIdentityConnection:
        createAuthEndpoint(
          "/unifi-identity/test",
          {
            method: "POST",
            use: [sessionMiddleware],
            body: testBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const body = ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const config =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            if (!config) {
              return ctx.json(
                {
                  error:
                    "UniFi Identity is not configured for this organization",
                },
                {
                  status: 404,
                },
              );
            }

            const token =
              decryptSecret(
                config.apiToken,
                encryptionKey,
              );

            let response;

            try {
              response =
                await unifiRequest<UnifiIdentityResourcesResponse>({
                  baseUrl:
                    config.consoleUrl,
                  apiToken: token,
                  verifyTls:
                    config.verifyTls,
                  path:
                    "/api/v1/developer/users/identity/assignments?resource_type=wifi,vpn",
                });
            } catch (error) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    error instanceof
                    Error
                      ? error.message
                      : "Unable to connect to UniFi console",
                },
                {
                  status: 502,
                },
              );
            }

            if (!response.ok) {
              return ctx.json(
                {
                  ok: false,
                  status:
                    response.status,
                  response:
                    response.data,
                },
                {
                  status: 502,
                },
              );
            }

            if (
              !isSuccessResponse(
                response.data,
              )
            ) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    "Unexpected response from UniFi Identity",
                  response:
                    response.data,
                },
                {
                  status: 502,
                },
              );
            }

            await pool.query(
              `
                UPDATE "unifiOrganizationConfig"
                SET "lastTestedAt" =
                  NOW()
                WHERE "organizationId" =
                  $1
              `,
              [body.organizationId],
            );

            return ctx.json({
              ok: true,
              status:
                response.status,
              response:
                response.data,
            });
          },
        ),

      refreshUnifiIdentityResources:
        createAuthEndpoint(
          "/unifi-identity/resources/refresh",
          {
            method: "POST",
            use: [sessionMiddleware],
            body: resourcesBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const body = ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const config =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            if (!config) {
              return ctx.json(
                {
                  error:
                    "UniFi Identity is not configured for this organization",
                },
                {
                  status: 404,
                },
              );
            }

            const token =
              decryptSecret(
                config.apiToken,
                encryptionKey,
              );

            let response;

            try {
              response =
                await unifiRequest<UnifiIdentityResourcesResponse>({
                  baseUrl:
                    config.consoleUrl,
                  apiToken: token,
                  verifyTls:
                    config.verifyTls,
                  path:
                    "/api/v1/developer/users/identity/assignments?resource_type=wifi,vpn",
                });
            } catch (error) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    error instanceof
                    Error
                      ? error.message
                      : "Unable to connect to UniFi console",
                },
                {
                  status: 502,
                },
              );
            }

            if (!response.ok) {
              return ctx.json(
                {
                  ok: false,
                  status:
                    response.status,
                  response:
                    response.data,
                },
                {
                  status: 502,
                },
              );
            }

            const payload =
              response.data;

            if (
              !payload ||
              typeof payload !==
                "object" ||
              !("code" in payload) ||
              payload.code !==
                "SUCCESS"
            ) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    "Unexpected response from UniFi Identity",
                  response: payload,
                },
                {
                  status: 502,
                },
              );
            }

            const resources = [
              ...(payload.data
                ?.wifi ?? []
              ).map(
                (resource) => ({
                  ...resource,
                  resourceType:
                    "wifi",
                }),
              ),
              ...(payload.data
                ?.vpn ?? []
              ).map(
                (resource) => ({
                  ...resource,
                  resourceType:
                    "vpn",
                }),
              ),
            ];

            const activeResources =
              resources.filter(
                (resource) =>
                  !resource.deleted,
              );

            const client =
              await pool.connect();

            try {
              await client.query(
                "BEGIN",
              );

              for (
                const resource of
                activeResources
              ) {
                await client.query(
                  `
                    INSERT INTO "unifiResource" (
                      id,
                      "organizationId",
                      "unifiResourceId",
                      "resourceType",
                      name,
                      "lastSeenAt"
                    )
                    VALUES (
                      gen_random_uuid()::text,
                      $1,
                      $2,
                      $3,
                      $4,
                      NOW()
                    )
                    ON CONFLICT (
                      "organizationId",
                      "unifiResourceId"
                    )
                    DO UPDATE SET
                      "resourceType" =
                        EXCLUDED."resourceType",
                      name =
                        EXCLUDED.name,
                      "lastSeenAt" =
                        NOW()
                  `,
                  [
                    body.organizationId,
                    resource.id,
                    resource.resourceType,
                    resource.name,
                  ],
                );
              }

              await client.query(
                `
                  UPDATE "unifiOrganizationConfig"
                  SET "lastSyncAt" =
                    NOW()
                  WHERE "organizationId" =
                    $1
                `,
                [
                  body.organizationId,
                ],
              );

              await client.query(
                "COMMIT",
              );
            } catch (error) {
              await client.query(
                "ROLLBACK",
              );
              throw error;
            } finally {
              client.release();
            }

            return ctx.json({
              ok: true,
              organizationId:
                body.organizationId,
              resources:
                activeResources.map(
                  (resource) => ({
                    unifiResourceId:
                      resource.id,
                    resourceType:
                      resource.resourceType,
                    name:
                      resource.name,
                  }),
                ),
            });
          },
        ),

      refreshUnifiGroupsEndpoint:
        createAuthEndpoint(
          "/unifi-identity/groups/refresh",
          {
            method: "POST",
            use: [sessionMiddleware],
            body:
              resourcesBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const body =
              ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
              );

            if (!allowed) {
              return ctx.json(
                {
                  error:
                    "Forbidden",
                },
                {
                  status: 403,
                },
              );
            }

            const config =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            if (!config) {
              return ctx.json(
                {
                  error:
                    "UniFi Identity is not configured for this organization",
                },
                {
                  status: 404,
                },
              );
            }

            const token =
              decryptSecret(
                config.apiToken,
                encryptionKey,
              );

            try {
              const groups =
                await refreshUnifiGroups(
                  pool,
                  body.organizationId,
                  config,
                  token,
                );

              return ctx.json({
                ok: true,
                organizationId:
                  body.organizationId,
                groups:
                  groups.map(
                    (group) => ({
                      unifiGroupId:
                        group.id,
                      name:
                        group.name,
                      fullName:
                        group.full_name ??
                        null,
                    }),
                  ),
              });
            } catch (error) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Unable to refresh UniFi groups",
                },
                {
                  status: 502,
                },
              );
            }
          },
        ),

      listUnifiIdentityResources:
        createAuthEndpoint(
          "/unifi-identity/resources",
          {
            method: "GET",
            use: [sessionMiddleware],
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const requestUrl =
              ctx.request?.url;

            if (!requestUrl) {
              return ctx.json(
                {
                  error:
                    "Unable to determine request URL",
                },
                {
                  status: 400,
                },
              );
            }

            const organizationId =
              new URL(
                requestUrl,
              ).searchParams.get(
                "organizationId",
              );

            if (!organizationId) {
              return ctx.json(
                {
                  error:
                    "organizationId is required",
                },
                {
                  status: 400,
                },
              );
            }

            const member =
              await isOrganizationMember(
                pool,
                session.user.id,
                organizationId,
              );

            const manager =
              await canManageOrganization(
                pool,
                session.user.id,
                organizationId,
              );

            if (!member && !manager) {
              return ctx.json(
                {
                  error: "Forbidden",
                },
                {
                  status: 403,
                },
              );
            }

            const result =
              await pool.query<CachedUnifiResource>(
                `
                  SELECT
                    id,
                    "unifiResourceId",
                    "resourceType",
                    name,
                    "lastSeenAt"
                  FROM "unifiResource"
                  WHERE "organizationId" =
                    $1
                  ORDER BY
                    "resourceType",
                    name
                `,
                [organizationId],
              );

            return ctx.json({
              organizationId,
              resources:
                result.rows,
            });
          },
        ),

      getUnifiIdentityUserAccess:
        createAuthEndpoint(
          "/unifi-identity/user-access",
          {
            method: "GET",
            use: [sessionMiddleware],
          },
          async (ctx) => {
            const session =
              ctx.context.session;

            const requestUrl =
              ctx.request?.url;

            if (!requestUrl) {
              return ctx.json(
                {
                  error:
                    "Unable to determine request URL",
                },
                {
                  status: 400,
                },
              );
            }

            const url =
              new URL(requestUrl);

            const organizationId =
              url.searchParams.get(
                "organizationId",
              );

            const userId =
              url.searchParams.get(
                "userId",
              );

            if (
              !organizationId ||
              !userId
            ) {
              return ctx.json(
                {
                  error:
                    "organizationId and userId are required",
                },
                {
                  status: 400,
                },
              );
            }

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
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

            const config =
              await getUnifiConfig(
                pool,
                organizationId,
              );

            const access =
              await pool.query<{
                wifiEnabled: boolean;
              }>(
                `
                  SELECT
                    "wifiEnabled"
                  FROM "unifiUserAccess"
                  WHERE "organizationId" = $1
                    AND "userId" = $2
                  LIMIT 1
                `,
                [
                  organizationId,
                  userId,
                ],
              );

            const mapping =
              await getOrganizationUserMapping(
                pool,
                organizationId,
                userId,
              );

            const hasWifiEntitlement =
              await userHasWifiEntitlement(
                pool,
                organizationId,
                userId,
              );

            let actuallyHasWifi = false;

            if (
              config?.enabled &&
              mapping &&
              hasWifiEntitlement
            ) {
              const token =
                decryptSecret(
                  config.apiToken,
                  encryptionKey,
                );

              const desiredGroups =
                await getDesiredGroups(
                  pool,
                  organizationId,
                  userId,
                );

              const wifiGroup =
                desiredGroups.find(
                  (group) =>
                    group.capability === "wifi",
                );

              if (wifiGroup) {
                const users =
                  await fetchGroupUsers(
                    config,
                    token,
                    wifiGroup.unifiGroupId,
                  );

                actuallyHasWifi =
                  users.some(
                    (user) =>
                      user.id ===
                      mapping.unifiUserId,
                  );
              }
            }

            return ctx.json({
              organizationId,
              userId,

              organizationUniFiEnabled:
                config?.enabled ?? false,

              wifiEnabled:
                hasWifiEntitlement &&
                actuallyHasWifi &&
                (
                  access.rows[0]
                    ?.wifiEnabled ??
                  true
                ),

              hasWifiEntitlement,

              actuallyHasWifi,

              explicitOverride:
                access.rowCount === 1,

              provisioned:
                Boolean(mapping),

              unifiUserId:
                mapping?.unifiUserId ??
                null,

              syncState:
                mapping?.syncState ??
                null,

              lastSyncedAt:
                mapping?.lastSyncedAt ??
                null,

              lastError:
                mapping?.lastError ??
                null,
            });
          },
        ),

      updateUnifiIdentityUserAccess:
        createAuthEndpoint(
          "/unifi-identity/user-access",
          {
            method: "PUT",
            use: [sessionMiddleware],
            body:
              userAccessBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;

            const body =
              ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const member =
              await isOrganizationMember(
                pool,
                body.userId,
                body.organizationId,
              );

            if (!member) {
              return ctx.json(
                {
                  error:
                    "Target user is not a member of this organization",
                },
                {
                  status: 404,
                },
              );
            }

            await pool.query(
              `
                INSERT INTO "unifiUserAccess" (
                  id,
                  "organizationId",
                  "userId",
                  "wifiEnabled"
                )
                VALUES (
                  gen_random_uuid()::text,
                  $1,
                  $2,
                  $3
                )
                ON CONFLICT (
                  "organizationId",
                  "userId"
                )
                DO UPDATE SET
                  "wifiEnabled" =
                    EXCLUDED."wifiEnabled"
              `,
              [
                body.organizationId,
                body.userId,
                body.wifiEnabled,
              ],
            );

            const config =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            const mapping =
              await getOrganizationUserMapping(
                pool,
                body.organizationId,
                body.userId,
              );

            let reconciliation:
              | Awaited<
                  ReturnType<
                    typeof reconcileUnifiUserById
                  >
                >
              | null = null;

            if (
              config?.enabled
            ) {
              if (mapping) {
                reconciliation =
                  await reconcileUnifiUserById(
                    pool,
                    encryptionKey,
                    body.organizationId,
                    body.userId,
                  );
              }
            }

            return ctx.json({
              ok: true,
              organizationId:
                body.organizationId,
              userId:
                body.userId,
              wifiEnabled:
                body.wifiEnabled,
              organizationUniFiEnabled:
                config?.enabled ??
                false,
              provisioned:
                Boolean(mapping),
              needsProvisioning:
                Boolean(
                  config?.enabled &&
                  body.wifiEnabled &&
                  !mapping,
                ),
              reconciliation,
            });
          },
        ),

      reconcileUnifiIdentityUser:
        createAuthEndpoint(
          "/unifi-identity/users/reconcile",
          {
            method: "POST",
            use: [sessionMiddleware],
            body: provisionUserBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;

            const body =
              ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const result =
              await reconcileUnifiUserById(
                pool,
                encryptionKey,
                body.organizationId,
                body.userId,
              );

            return ctx.json({
              userId:
                body.userId,
              ...result,
            });
          },
        ),

      provisionUnifiIdentityUser:
        createAuthEndpoint(
          "/unifi-identity/users/provision",
          {
            method: "POST",
            use: [sessionMiddleware],
            body:
              provisionUserBodySchema,
          },
          async (ctx) => {
            const session =
              ctx.context.session;
            const body = ctx.body;

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                body.organizationId,
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

            const targetUser =
              await getProvisionUser(
                pool,
                body.organizationId,
                body.userId,
              );

            if (!targetUser) {
              return ctx.json(
                {
                  error:
                    "Target user is not a member of this organization",
                },
                {
                  status: 404,
                },
              );
            }

            const config =
              await getUnifiConfig(
                pool,
                body.organizationId,
              );

            if (!config) {
              return ctx.json(
                {
                  error:
                    "UniFi Identity is not configured for this organization",
                },
                {
                  status: 404,
                },
              );
            }

            if (!config.enabled) {
              return ctx.json(
                {
                  error:
                    "UniFi Identity is disabled for this organization",
                },
                {
                  status: 409,
                },
              );
            }

            const token =
              decryptSecret(
                config.apiToken,
                encryptionKey,
              );

            let mapping =
              await getOrganizationUserMapping(
                pool,
                body.organizationId,
                body.userId,
              );

            let matchedUser:
              | UnifiUser
              | null = null;

            let matchedBy:
              | "existing-mapping"
              | "employee-number"
              | "email"
              | "created";

            if (mapping) {
              matchedBy =
                "existing-mapping";

              matchedUser = {
                id:
                  mapping.unifiUserId,
                status:
                  mapping.unifiStatus ??
                  undefined,
              };
            } else {
              matchedBy = "created";

              if (
                targetUser.employeeId
              ) {
                const searchResponse =
                  await unifiRequest<UnifiUserSearchResponse>({
                    baseUrl:
                      config.consoleUrl,
                    apiToken: token,
                    verifyTls:
                      config.verifyTls,
                    path:
                      `/api/v1/developer/users/search?keyword=${encodeURIComponent(
                        targetUser.employeeId,
                      )}`,
                  });

                if (
                  !searchResponse.ok
                ) {
                  return ctx.json(
                    {
                      ok: false,
                      stage:
                        "search-employee-number",
                      status:
                        searchResponse.status,
                      response:
                        searchResponse.data,
                    },
                    {
                      status: 502,
                    },
                  );
                }

                const payload =
                  searchResponse.data;

                if (
                  payload &&
                  typeof payload ===
                    "object" &&
                  "code" in payload &&
                  payload.code ===
                    "SUCCESS"
                ) {
                  matchedUser =
                    payload.data?.find(
                      (user) =>
                        user.employee_number ===
                        targetUser.employeeId,
                    ) ?? null;

                  if (matchedUser) {
                    matchedBy =
                      "employee-number";
                  }
                }
              }

              if (
                !matchedUser &&
                targetUser.email
              ) {
                const searchResponse =
                  await unifiRequest<UnifiUserSearchResponse>({
                    baseUrl:
                      config.consoleUrl,
                    apiToken: token,
                    verifyTls:
                      config.verifyTls,
                    path:
                      `/api/v1/developer/users/search?keyword=${encodeURIComponent(
                        targetUser.email,
                      )}`,
                  });

                if (
                  !searchResponse.ok
                ) {
                  return ctx.json(
                    {
                      ok: false,
                      stage:
                        "search-email",
                      status:
                        searchResponse.status,
                      response:
                        searchResponse.data,
                    },
                    {
                      status: 502,
                    },
                  );
                }

                const payload =
                  searchResponse.data;

                if (
                  payload &&
                  typeof payload ===
                    "object" &&
                  "code" in payload &&
                  payload.code ===
                    "SUCCESS"
                ) {
                  matchedUser =
                    payload.data?.find(
                      (user) =>
                        user.user_email
                          ?.trim()
                          .toLowerCase() ===
                        targetUser.email
                          .trim()
                          .toLowerCase(),
                    ) ?? null;

                  if (matchedUser) {
                    matchedBy =
                      "email";
                  }
                }
              }

              if (!matchedUser) {
                const fallbackName =
                  splitName(
                    targetUser.name,
                  );

                const firstName =
                  targetUser.firstName?.trim() ||
                  fallbackName.firstName;

                const lastName =
                  targetUser.lastName?.trim() ||
                  fallbackName.lastName;

                const createResponse =
                  await unifiRequest<UnifiCreateUserResponse>({
                    baseUrl:
                      config.consoleUrl,
                    apiToken: token,
                    verifyTls:
                      config.verifyTls,
                    method: "POST",
                    path:
                      "/api/v1/developer/users",
                    body: {
                      first_name:
                        firstName,
                      last_name:
                        lastName,
                      user_email:
                        targetUser.email,
                      ...(targetUser.employeeId
                        ? {
                            employee_number:
                              targetUser.employeeId,
                          }
                        : {}),
                    },
                  });

                if (
                  !createResponse.ok
                ) {
                  return ctx.json(
                    {
                      ok: false,
                      stage:
                        "create-user",
                      status:
                        createResponse.status,
                      response:
                        createResponse.data,
                    },
                    {
                      status: 502,
                    },
                  );
                }

                const payload =
                  createResponse.data;

                if (
                  !payload ||
                  typeof payload !==
                    "object" ||
                  !(
                    "code" in
                    payload
                  ) ||
                  payload.code !==
                    "SUCCESS" ||
                  !payload.data?.id
                ) {
                  return ctx.json(
                    {
                      ok: false,
                      stage:
                        "create-user",
                      error:
                        "Unexpected response while creating UniFi user",
                      response:
                        payload,
                    },
                    {
                      status: 502,
                    },
                  );
                }

                matchedUser =
                  payload.data;
                matchedBy =
                  "created";
              }

              if (!matchedUser?.id) {
                return ctx.json(
                  {
                    ok: false,
                    error:
                      "Unable to resolve UniFi user",
                  },
                  {
                    status: 502,
                  },
                );
              }

              const mappingResult =
                await pool.query<UnifiOrganizationUserRow>(
                  `
                    INSERT INTO "unifiOrganizationUser" (
                      id,
                      "organizationId",
                      "userId",
                      "unifiUserId",
                      "unifiStatus",
                      "syncState",
                      "lastSyncedAt"
                    )
                    VALUES (
                      gen_random_uuid()::text,
                      $1,
                      $2,
                      $3,
                      $4,
                      'linked',
                      NOW()
                    )
                    ON CONFLICT (
                      "organizationId",
                      "userId"
                    )
                    DO UPDATE SET
                      "unifiUserId" =
                        EXCLUDED."unifiUserId",
                      "unifiStatus" =
                        EXCLUDED."unifiStatus",
                      "syncState" =
                        'linked',
                      "lastSyncedAt" =
                        NOW(),
                      "lastError" =
                        NULL
                    RETURNING
                      id,
                      "organizationId",
                      "userId",
                      "unifiUserId",
                      "identityInvitedAt",
                      "unifiStatus",
                      "syncState",
                      "lastSyncedAt",
                      "lastError"
                  `,
                  [
                    body.organizationId,
                    body.userId,
                    matchedUser.id,
                    matchedUser.status ??
                      null,
                  ],
                );

              mapping =
                mappingResult.rows[0]!;
            }

            if (!mapping) {
              return ctx.json(
                {
                  ok: false,
                  error:
                    "Unable to establish UniFi user mapping",
                },
                {
                  status: 500,
                },
              );
            }

            /*
             * Identity invitations are ONLY automatic
             * when this provisioning operation created
             * a brand-new UniFi user.
             *
             * Existing users found by employee number,
             * email, or an existing mapping are never
             * automatically re-invited.
             *
             * identityInvitedAt means only that this
             * plugin actually sent an invitation.
             */
            let invitationSent =
              false;

            const desiredGroups =
              await getDesiredGroups(
                pool,
                body.organizationId,
                body.userId,
              );

            if (
              !mapping.identityInvitedAt &&
              desiredGroups.length > 0
            ) {
              const invitationResponse =
                await unifiRequest<UnifiSuccessResponse>({
                  baseUrl:
                    config.consoleUrl,
                  apiToken: token,
                  verifyTls:
                    config.verifyTls,
                  method: "POST",
                  path:
                    "/api/v1/developer/users/identity/invitations",
                  body: [
                    {
                      user_id:
                        mapping.unifiUserId,
                      email:
                        targetUser.email,
                    },
                  ],
                });

              if (
                !invitationResponse.ok ||
                !isSuccessResponse(
                  invitationResponse.data,
                )
              ) {
                const message =
                  `UniFi Identity invitation failed: ${JSON.stringify(
                    invitationResponse.data,
                  )}`;

                await setMappingError(
                  pool,
                  body.organizationId,
                  body.userId,
                  message,
                );

                return ctx.json(
                  {
                    ok: false,
                    stage:
                      "identity-invitation",
                    status:
                      invitationResponse.status,
                    response:
                      invitationResponse.data,
                  },
                  {
                    status: 502,
                  },
                );
              }

              const invitationResult =
                await pool.query<UnifiOrganizationUserRow>(
                  `
                    UPDATE "unifiOrganizationUser"
                    SET
                      "identityInvitedAt" =
                        NOW(),
                      "syncState" =
                        'invited',
                      "lastSyncedAt" =
                        NOW(),
                      "lastError" =
                        NULL
                    WHERE "organizationId" =
                      $1
                      AND "userId" =
                        $2
                    RETURNING
                      id,
                      "organizationId",
                      "userId",
                      "unifiUserId",
                      "identityInvitedAt",
                      "unifiStatus",
                      "syncState",
                      "lastSyncedAt",
                      "lastError"
                  `,
                  [
                    body.organizationId,
                    body.userId,
                  ],
                );

              mapping =
                invitationResult.rows[0] ??
                mapping;

              invitationSent =
                true;
            }

            /*
             * Resolve desired UniFi USER GROUPS from
             * Better Auth organization/team/role state.
             *
             * Identity resources now live on UniFi
             * groups, not directly on individual users.
             */
            const groupAssignments = [];

            for (
              const group of
                desiredGroups
            ) {
              let users;

              try {
                users =
                  await fetchGroupUsers(
                    config,
                    token,
                    group.unifiGroupId,
                  );
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Unable to fetch UniFi group membership";

                await setMappingError(
                  pool,
                  body.organizationId,
                  body.userId,
                  message,
                );

                return ctx.json(
                  {
                    ok: false,
                    stage:
                      "group-membership-fetch",
                    group: {
                      id:
                        group.groupId,
                      unifiGroupId:
                        group.unifiGroupId,
                      name:
                        group.groupName,
                    },
                    error:
                      message,
                  },
                  {
                    status: 502,
                  },
                );
              }

              const alreadyMember =
                users.some(
                  (user) =>
                    user.id ===
                    mapping.unifiUserId,
                );

              let assignedNow =
                false;

              if (!alreadyMember) {
                const response =
                  await unifiRequest<UnifiSuccessResponse>({
                    baseUrl:
                      config.consoleUrl,
                    apiToken: token,
                    verifyTls:
                      config.verifyTls,
                    method: "POST",
                    path:
                      `/api/v1/developer/user_groups/${encodeURIComponent(
                        group.unifiGroupId,
                      )}/users`,
                    body: [
                      mapping.unifiUserId,
                    ],
                  });

                if (
                  !response.ok ||
                  !isSuccessResponse(
                    response.data,
                  )
                ) {
                  const message =
                    `Unable to assign UniFi group ${group.groupName}: ${JSON.stringify(
                      response.data,
                    )}`;

                  await setMappingError(
                    pool,
                    body.organizationId,
                    body.userId,
                    message,
                  );

                  return ctx.json(
                    {
                      ok: false,
                      stage:
                        "group-membership-assignment",
                      group: {
                        id:
                          group.groupId,
                        unifiGroupId:
                          group.unifiGroupId,
                        name:
                          group.groupName,
                      },
                      status:
                        response.status,
                      response:
                        response.data,
                    },
                    {
                      status: 502,
                    },
                  );
                }

                assignedNow = true;
              }

              groupAssignments.push({
                groupId:
                  group.groupId,
                unifiGroupId:
                  group.unifiGroupId,
                name:
                  group.groupName,
                subjectType:
                  group.subjectType,
                subjectId:
                  group.subjectId,
                alreadyMember,
                assignedNow,
              });
            }

            const finalResult =
              await pool.query<UnifiOrganizationUserRow>(
                `
                  UPDATE "unifiOrganizationUser"
                  SET
                    "syncState" =
                      'synced',
                    "lastSyncedAt" =
                      NOW(),
                    "lastError" =
                      NULL
                  WHERE "organizationId" =
                    $1
                    AND "userId" =
                      $2
                  RETURNING
                    id,
                    "organizationId",
                    "userId",
                    "unifiUserId",
                    "identityInvitedAt",
                    "unifiStatus",
                    "syncState",
                    "lastSyncedAt",
                    "lastError"
                `,
                [
                  body.organizationId,
                  body.userId,
                ],
              );

            return ctx.json({
              ok: true,
              created:
                matchedBy ===
                "created",
              matchedBy,
              organizationId:
                body.organizationId,
              userId:
                body.userId,
              unifiUserId:
                mapping.unifiUserId,
              identity: {
                invitationSent,
                invitationPolicy:
                  matchedBy ===
                  "created"
                    ? "new-unifi-user"
                    : "existing-unifi-user",
                invitedAt:
                  finalResult.rows[0]
                    ?.identityInvitedAt ??
                  mapping.identityInvitedAt,
              },
              groups: {
                desired:
                  desiredGroups.map(
                    (group) => ({
                      ruleId:
                        group.id,
                      groupId:
                        group.groupId,
                      unifiGroupId:
                        group.unifiGroupId,
                      name:
                        group.groupName,
                      fullName:
                        group.groupFullName,
                      subjectType:
                        group.subjectType,
                      subjectId:
                        group.subjectId,
                    }),
                  ),
                assignments:
                  groupAssignments,
              },
              mapping:
                finalResult.rows[0],
            });
          },
        ),
    },

    schema: {
      unifiOrganizationConfig: {
        modelName:
          "unifiOrganizationConfig",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            unique: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          enabled: {
            type: "boolean",
            required: true,
          },

          consoleUrl: {
            type: "string",
            required: true,
          },

          apiToken: {
            type: "string",
            required: true,
          },

          verifyTls: {
            type: "boolean",
            required: true,
          },

          lastTestedAt: {
            type: "date",
            required: false,
          },

          lastSyncAt: {
            type: "date",
            required: false,
          },
        },
      },

      unifiOrganizationUser: {
        modelName:
          "unifiOrganizationUser",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          userId: {
            type: "string",
            required: true,
            references: {
              model: "user",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          unifiUserId: {
            type: "string",
            required: true,
          },

          identityInvitedAt: {
            type: "date",
            required: false,
          },

          unifiStatus: {
            type: "string",
            required: false,
          },

          syncState: {
            type: "string",
            required: true,
          },

          lastSyncedAt: {
            type: "date",
            required: false,
          },

          lastError: {
            type: "string",
            required: false,
          },
        },
      },

      unifiResource: {
        modelName:
          "unifiResource",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          unifiResourceId: {
            type: "string",
            required: true,
          },

          resourceType: {
            type: "string",
            required: true,
          },

          name: {
            type: "string",
            required: true,
          },

          lastSeenAt: {
            type: "date",
            required: false,
          },
        },
      },

      unifiGroup: {
        modelName:
          "unifiGroup",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          unifiGroupId: {
            type: "string",
            required: true,
          },

          name: {
            type: "string",
            required: true,
          },

          fullName: {
            type: "string",
            required: false,
          },

          lastSeenAt: {
            type: "date",
            required: false,
          },
        },
      },

      unifiUserAccess: {
        modelName:
          "unifiUserAccess",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          userId: {
            type: "string",
            required: true,
            references: {
              model: "user",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          wifiEnabled: {
            type: "boolean",
            required: true,
          },
        },
      },

      unifiGroupEntitlementRule: {
        modelName:
          "unifiGroupEntitlementRule",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          groupId: {
            type: "string",
            required: true,
            references: {
              model:
                "unifiGroup",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          subjectType: {
            type: "string",
            required: true,
          },

          subjectId: {
            type: "string",
            required: false,
          },

          capability: {
            type: "string",
            required: false,
          },

          enabled: {
            type: "boolean",
            required: true,
          },
        },
      },

      unifiEntitlementRule: {
        modelName:
          "unifiEntitlementRule",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          resourceId: {
            type: "string",
            required: true,
            references: {
              model:
                "unifiResource",
              field: "id",
              onDelete:
                "cascade",
            },
          },

          subjectType: {
            type: "string",
            required: true,
          },

          subjectId: {
            type: "string",
            required: false,
          },

          enabled: {
            type: "boolean",
            required: true,
          },
        },
      },
    },
  }) satisfies BetterAuthPlugin;
