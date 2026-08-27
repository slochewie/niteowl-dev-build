import type { BetterAuthPlugin } from "better-auth"
import {
  APIError,
  createAuthEndpoint,
  createAuthMiddleware,
  sessionMiddleware
} from "better-auth/api"
import type { Pool } from "pg"
import * as z from "zod"

type OrganizationStatusOptions = {
  pool: Pool
}

type UserRoleRow = {
  role: string | null
}

type OrganizationStatusRow = {
  organizationId: string
  enabled: boolean
}

const setOrganizationStatusBodySchema =
  z.object({
    organizationId:
      z.string().min(1),
    enabled: z.boolean()
  })

async function isGlobalAdmin(
  pool: Pool,
  userId: string
) {
  const result =
    await pool.query<UserRoleRow>(
      `
        SELECT role
        FROM "user"
        WHERE id = $1
        LIMIT 1
      `,
      [userId]
    )

  return (
    result.rows[0]?.role ===
    "admin"
  )
}

async function getOrganizationStatus(
  pool: Pool,
  organizationId: string
) {
  const result =
    await pool.query<OrganizationStatusRow>(
      `
        SELECT
          "organizationId",
          enabled
        FROM "organizationStatus"
        WHERE "organizationId" = $1
        LIMIT 1
      `,
      [organizationId]
    )

  return result.rows[0] ?? null
}

async function resolveOrganizationId(
  pool: Pool,
  body: unknown
) {
  if (
    !body ||
    typeof body !== "object"
  ) {
    return null
  }

  const value =
    body as Record<string, unknown>

  if (
    typeof value.organizationId ===
    "string"
  ) {
    return value.organizationId
  }

  if (
    typeof value.organizationSlug ===
    "string"
  ) {
    const result =
      await pool.query<{
        id: string
      }>(
        `
          SELECT id
          FROM organization
          WHERE slug = $1
          LIMIT 1
        `,
        [value.organizationSlug]
      )

    return result.rows[0]?.id ?? null
  }

  return null
}

export const organizationStatus = ({
  pool
}: OrganizationStatusOptions) =>
  ({
    id: "organization-status",

    hooks: {
      before: [
        {
          matcher: (ctx) =>
            ctx.path ===
            "/organization/set-active",

          handler:
            createAuthMiddleware(
              async (ctx) => {
                const organizationId =
                  await resolveOrganizationId(
                    pool,
                    ctx.body
                  )

                if (!organizationId) {
                  return
                }

                const status =
                  await getOrganizationStatus(
                    pool,
                    organizationId
                  )

                if (
                  status &&
                  !status.enabled
                ) {
                  throw new APIError(
                    "FORBIDDEN",
                    {
                      message:
                        "This organization is disabled"
                    }
                  )
                }
              }
            )
        }
      ]
    },

    endpoints: {
      setOrganizationStatus:
        createAuthEndpoint(
          "/organization-status/set",
          {
            method: "POST",
            use: [sessionMiddleware],
            body:
              setOrganizationStatusBodySchema
          },
          async (ctx) => {
            if (
              !(await isGlobalAdmin(
                pool,
                ctx.context.session.user.id
              ))
            ) {
              return ctx.json(
                {
                  error: "Forbidden"
                },
                {
                  status: 403
                }
              )
            }

            const organization =
              await pool.query<{
                id: string
              }>(
                `
                  SELECT id
                  FROM organization
                  WHERE id = $1
                  LIMIT 1
                `,
                [ctx.body.organizationId]
              )

            if (
              organization.rowCount !== 1
            ) {
              return ctx.json(
                {
                  error:
                    "Organization not found"
                },
                {
                  status: 404
                }
              )
            }

            const result =
              await pool.query<OrganizationStatusRow>(
                `
                  INSERT INTO
                    "organizationStatus" (
                      id,
                      "organizationId",
                      enabled,
                      "createdAt",
                      "updatedAt"
                    )
                  VALUES (
                    gen_random_uuid()::text,
                    $1,
                    $2,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                  )
                  ON CONFLICT (
                    "organizationId"
                  )
                  DO UPDATE SET
                    enabled =
                      EXCLUDED.enabled,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  RETURNING
                    "organizationId",
                    enabled
                `,
                [
                  ctx.body.organizationId,
                  ctx.body.enabled
                ]
              )

            if (!ctx.body.enabled) {
              await pool.query(
                `
                  UPDATE session
                  SET
                    "activeOrganizationId" =
                      NULL,
                    "updatedAt" =
                      CURRENT_TIMESTAMP
                  WHERE
                    "activeOrganizationId" =
                      $1
                `,
                [ctx.body.organizationId]
              )
            }

            return ctx.json({
              organizationId:
                result.rows[0]
                  ?.organizationId ??
                ctx.body.organizationId,
              enabled:
                result.rows[0]
                  ?.enabled ??
                ctx.body.enabled
            })
          }
        )
    },

    schema: {
      organizationStatus: {
        modelName:
          "organizationStatus",

        fields: {
          organizationId: {
            type: "string",
            required: true,
            unique: true,
            references: {
              model: "organization",
              field: "id",
              onDelete: "cascade"
            }
          },

          enabled: {
            type: "boolean",
            required: true,
            defaultValue: () => true
          },

          createdAt: {
            type: "date",
            required: true,
            defaultValue: () =>
              new Date()
          },

          updatedAt: {
            type: "date",
            required: true,
            defaultValue: () =>
              new Date()
          }
        }
      }
    }
  }) satisfies BetterAuthPlugin
