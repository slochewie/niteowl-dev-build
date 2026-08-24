import type {
  BetterAuthPlugin
} from "better-auth"
import {
  createAuthEndpoint,
  sessionMiddleware
} from "better-auth/api"
import type {
  Pool
} from "pg"
import * as z from "zod"

type GlauthOptions = {
  pool: Pool
}

type UserRoleRow = {
  role: string | null
}

const createTenantBodySchema =
  z.object({
    name:
      z.string()
        .trim()
        .min(1)
        .max(100),

    slug:
      z.string()
        .trim()
        .min(1)
        .max(100)
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        )
  })

const assignOrganizationBodySchema =
  z.object({
    organizationId:
      z.string().min(1),

    tenantId:
      z.string()
        .min(1)
        .nullable()
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

function tenantBaseDn(
  slug: string
) {
  return (
    `ou=${slug},ou=tenants,dc=niteowl,dc=dev`
  )
}

export const glauth = ({
  pool
}: GlauthOptions) =>
  ({
    id: "glauth",

    endpoints: {
      listGlauthTenants:
        createAuthEndpoint(
          "/glauth/tenants",
          {
            method: "GET",
            use: [
              sessionMiddleware
            ]
          },
          async (ctx) => {
            const allowed =
              await isGlobalAdmin(
                pool,
                ctx.context
                  .session
                  .user
                  .id
              )

            if (!allowed) {
              return ctx.json(
                {
                  error:
                    "Forbidden"
                },
                {
                  status: 403
                }
              )
            }

            const tenants =
              await pool.query<{
                id: string
                name: string
                slug: string
                baseDn: string
                enabled: boolean
                createdAt: Date
                updatedAt: Date
              }>(
                `
                  SELECT
                    id,
                    name,
                    slug,
                    "baseDn",
                    enabled,
                    "createdAt",
                    "updatedAt"
                  FROM "glauthTenant"
                  ORDER BY name
                `
              )

            const assignments =
              await pool.query<{
                tenantId: string
                organizationId: string
              }>(
                `
                  SELECT
                    "tenantId",
                    "organizationId"
                  FROM
                    "glauthTenantOrganization"
                `
              )

            return ctx.json({
              tenants:
                tenants.rows.map(
                  (tenant) => ({
                    ...tenant,

                    organizationIds:
                      assignments.rows
                        .filter(
                          (assignment) =>
                            assignment.tenantId ===
                            tenant.id
                        )
                        .map(
                          (assignment) =>
                            assignment.organizationId
                        )
                  })
                )
            })
          }
        ),

      createGlauthTenant:
        createAuthEndpoint(
          "/glauth/tenants/create",
          {
            method: "POST",
            use: [
              sessionMiddleware
            ],
            body:
              createTenantBodySchema
          },
          async (ctx) => {
            const allowed =
              await isGlobalAdmin(
                pool,
                ctx.context
                  .session
                  .user
                  .id
              )

            if (!allowed) {
              return ctx.json(
                {
                  error:
                    "Forbidden"
                },
                {
                  status: 403
                }
              )
            }

            const {
              name,
              slug
            } = ctx.body

            const result =
              await pool.query(
                `
                  INSERT INTO
                    "glauthTenant" (
                      id,
                      name,
                      slug,
                      "baseDn",
                      enabled,
                      "createdAt",
                      "updatedAt"
                    )
                  VALUES (
                    gen_random_uuid()::text,
                    $1,
                    $2,
                    $3,
                    true,
                    NOW(),
                    NOW()
                  )
                  RETURNING *
                `,
                [
                  name,
                  slug,
                  tenantBaseDn(
                    slug
                  )
                ]
              )

            return ctx.json({
              tenant:
                result.rows[0]
            })
          }
        ),

      setGlauthOrganizationTenant:
        createAuthEndpoint(
          "/glauth/tenants/organization",
          {
            method: "POST",
            use: [
              sessionMiddleware
            ],
            body:
              assignOrganizationBodySchema
          },
          async (ctx) => {
            const allowed =
              await isGlobalAdmin(
                pool,
                ctx.context
                  .session
                  .user
                  .id
              )

            if (!allowed) {
              return ctx.json(
                {
                  error:
                    "Forbidden"
                },
                {
                  status: 403
                }
              )
            }

            const {
              organizationId,
              tenantId
            } = ctx.body

            const client =
              await pool.connect()

            try {
              await client.query(
                "BEGIN"
              )

              await client.query(
                `
                  DELETE FROM
                    "glauthTenantOrganization"
                  WHERE
                    "organizationId" = $1
                `,
                [
                  organizationId
                ]
              )

              if (tenantId) {
                await client.query(
                  `
                    INSERT INTO
                      "glauthTenantOrganization" (
                        id,
                        "tenantId",
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
                  [
                    tenantId,
                    organizationId
                  ]
                )
              }

              await client.query(
                "COMMIT"
              )
            } catch (error) {
              await client.query(
                "ROLLBACK"
              )

              throw error
            } finally {
              client.release()
            }

            return ctx.json({
              organizationId,
              tenantId
            })
          }
        )
    },

    schema: {
      glauthTenant: {
        modelName:
          "glauthTenant",

        fields: {
          name: {
            type: "string",
            required: true
          },

          slug: {
            type: "string",
            required: true,
            unique: true
          },

          baseDn: {
            type: "string",
            required: true,
            unique: true
          },

          enabled: {
            type: "boolean",
            required: true,
            defaultValue: true
          },

          createdAt: {
            type: "date",
            required: true,
            defaultValue:
              () => new Date()
          },

          updatedAt: {
            type: "date",
            required: true,
            defaultValue:
              () => new Date()
          }
        }
      },

      glauthTenantOrganization: {
        modelName:
          "glauthTenantOrganization",

        fields: {
          tenantId: {
            type: "string",
            required: true,
            references: {
              model:
                "glauthTenant",
              field: "id",
              onDelete:
                "cascade"
            }
          },

          organizationId: {
            type: "string",
            required: true,
            unique: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade"
            }
          },

          createdAt: {
            type: "date",
            required: true,
            defaultValue:
              () => new Date()
          }
        }
      }
    }
  }) satisfies BetterAuthPlugin
