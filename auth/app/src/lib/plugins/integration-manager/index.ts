import type { Pool } from "pg"
import type { BetterAuthPlugin } from "better-auth"
import {
  createAuthEndpoint,
  sessionMiddleware
} from "better-auth/api"
import * as z from "zod"

import {
  INTEGRATION_IDS
} from "./registry.js"

type IntegrationManagerOptions = {
  pool: Pool
}

type UserRoleRow = {
  role: string | null
}

type OrganizationRoleRow = {
  role: string
}

type OrganizationIntegrationRow = {
  id: string
  organizationId: string
  pluginId: string
  enabled: boolean
  useGlobalConfiguration:
    boolean
}

const pluginIdSchema =
  z.enum(INTEGRATION_IDS)

const listOrganizationsQuerySchema =
  z.object({
    pluginId: pluginIdSchema
  })

const organizationIntegrationsQuerySchema =
  z.object({
    organizationId:
      z.string().min(1)
  })

const setEnabledBodySchema =
  z.object({
    pluginId: pluginIdSchema,
    organizationId:
      z.string().min(1),
    enabled: z.boolean()
  })

const setConfigurationSourceBodySchema =
  z.object({
    pluginId: pluginIdSchema,
    organizationId:
      z.string().min(1),
    useGlobalConfiguration:
      z.boolean()
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

async function canManageOrganization(
  pool: Pool,
  userId: string,
  organizationId: string
) {
  if (
    await isGlobalAdmin(
      pool,
      userId
    )
  ) {
    return true
  }

  const result =
    await pool.query<OrganizationRoleRow>(
      `
        SELECT role
        FROM member
        WHERE
          "organizationId" = $1
          AND "userId" = $2
        LIMIT 1
      `,
      [
        organizationId,
        userId
      ]
    )

  const role =
    result.rows[0]?.role

  return (
    role === "owner" ||
    role === "admin"
  )
}

async function assertOrganizationExists(
  pool: Pool,
  organizationId: string
) {
  const result =
    await pool.query<{
      id: string
    }>(
      `
        SELECT id
        FROM organization
        WHERE id = $1
        LIMIT 1
      `,
      [organizationId]
    )

  return result.rowCount === 1
}

async function setIntegrationEnabled({
  pool,
  organizationId,
  pluginId,
  enabled
}: {
  pool: Pool
  organizationId: string
  pluginId:
    (typeof INTEGRATION_IDS)[number]
  enabled: boolean
}) {
  const client =
    await pool.connect()

  try {
    await client.query(
      "BEGIN"
    )

    /*
     * Better Auth 1.6.x does not support declaring
     * a composite unique index in a custom plugin
     * schema.
     *
     * Serialize writes to this small configuration
     * table so update-then-insert cannot create
     * duplicate organization/plugin rows.
     */
    await client.query(`
      LOCK TABLE
        "organizationIntegration"
      IN SHARE ROW EXCLUSIVE MODE
    `)

    const updated =
      await client.query<OrganizationIntegrationRow>(
        `
          UPDATE
            "organizationIntegration"
          SET
            enabled = $3
          WHERE
            "organizationId" = $1
            AND "pluginId" = $2
          RETURNING
            id,
            "organizationId",
            "pluginId",
            enabled,
            COALESCE(
              "useGlobalConfiguration",
              false
            ) AS "useGlobalConfiguration"
        `,
        [
          organizationId,
          pluginId,
          enabled
        ]
      )

    if (
      updated.rowCount ===
      1
    ) {
      await client.query(
        "COMMIT"
      )

      return updated.rows[0]!
    }

    const inserted =
      await client.query<OrganizationIntegrationRow>(
        `
          INSERT INTO
            "organizationIntegration" (
              id,
              "organizationId",
              "pluginId",
              enabled,
              "useGlobalConfiguration"
            )
          VALUES (
            gen_random_uuid()::text,
            $1,
            $2,
            $3,
            false
          )
          RETURNING
            id,
            "organizationId",
            "pluginId",
            enabled,
            COALESCE(
              "useGlobalConfiguration",
              false
            ) AS "useGlobalConfiguration"
        `,
        [
          organizationId,
          pluginId,
          enabled
        ]
      )

    await client.query(
      "COMMIT"
    )

    return inserted.rows[0]!
  } catch (error) {
    await client.query(
      "ROLLBACK"
    )

    throw error
  } finally {
    client.release()
  }
}

async function setIntegrationConfigurationSource({
  pool,
  organizationId,
  pluginId,
  useGlobalConfiguration
}: {
  pool: Pool
  organizationId: string
  pluginId:
    (typeof INTEGRATION_IDS)[number]
  useGlobalConfiguration: boolean
}) {
  const client =
    await pool.connect()

  try {
    await client.query(
      "BEGIN"
    )

    await client.query(`
      LOCK TABLE
        "organizationIntegration"
      IN SHARE ROW EXCLUSIVE MODE
    `)

    const updated =
      await client.query<OrganizationIntegrationRow>(
        `
          UPDATE
            "organizationIntegration"
          SET
            "useGlobalConfiguration" =
              $3
          WHERE
            "organizationId" = $1
            AND "pluginId" = $2
          RETURNING
            id,
            "organizationId",
            "pluginId",
            enabled,
            COALESCE(
              "useGlobalConfiguration",
              false
            ) AS "useGlobalConfiguration"
        `,
        [
          organizationId,
          pluginId,
          useGlobalConfiguration
        ]
      )

    if (
      updated.rowCount ===
      1
    ) {
      await client.query(
        "COMMIT"
      )

      return updated.rows[0]!
    }

    const inserted =
      await client.query<OrganizationIntegrationRow>(
        `
          INSERT INTO
            "organizationIntegration" (
              id,
              "organizationId",
              "pluginId",
              enabled,
              "useGlobalConfiguration"
            )
          VALUES (
            gen_random_uuid()::text,
            $1,
            $2,
            false,
            $3
          )
          RETURNING
            id,
            "organizationId",
            "pluginId",
            enabled,
            COALESCE(
              "useGlobalConfiguration",
              false
            ) AS "useGlobalConfiguration"
        `,
        [
          organizationId,
          pluginId,
          useGlobalConfiguration
        ]
      )

    await client.query(
      "COMMIT"
    )

    return inserted.rows[0]!
  } catch (error) {
    await client.query(
      "ROLLBACK"
    )

    throw error
  } finally {
    client.release()
  }
}

export const integrationManager = ({
  pool
}: IntegrationManagerOptions) =>
  ({
    id: "integration-manager",

    endpoints: {
      listIntegrationOrganizations:
        createAuthEndpoint(
          "/integration-manager/organizations",
          {
            method: "GET",
            use: [
              sessionMiddleware
            ],
            query:
              listOrganizationsQuerySchema
          },
          async (ctx) => {
            const session =
              ctx.context.session

            const allowed =
              await isGlobalAdmin(
                pool,
                session.user.id
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

            const result =
              await pool.query<{
                id: string
                name: string
                slug: string
                logo:
                  | string
                  | null
                enabled: boolean
                useGlobalConfiguration:
                  boolean
                csvSourceId:
                  string | null
                csvSourceName:
                  string | null
              }>(
                `
                  SELECT
                    o.id,
                    o.name,
                    o.slug,
                    o.logo,
                    COALESCE(
                      oi.enabled,
                      false
                    ) AS enabled,
                    COALESCE(
                      oi."useGlobalConfiguration",
                      false
                    ) AS "useGlobalConfiguration",
                    csvos."sourceId" AS
                      "csvSourceId",
                    csvs.name AS
                      "csvSourceName"
                  FROM organization o
                  LEFT JOIN
                    "organizationIntegration" oi
                    ON
                      oi."organizationId" =
                        o.id
                      AND
                      oi."pluginId" =
                        $1
                  LEFT JOIN
                    "sevenShiftsCsvOrganizationSource" csvos
                    ON
                      $1 =
                        'seven-shifts-csv'
                      AND
                      csvos."organizationId" =
                        o.id
                  LEFT JOIN
                    "sevenShiftsCsvSource" csvs
                    ON
                      csvs.id =
                        csvos."sourceId"
                  ORDER BY
                    o.name ASC
                `,
                [
                  ctx.query.pluginId
                ]
              )

            return ctx.json({
              pluginId:
                ctx.query.pluginId,
              organizations:
                result.rows
            })
          }
        ),

      getOrganizationIntegrations:
        createAuthEndpoint(
          "/integration-manager/organization",
          {
            method: "GET",
            use: [
              sessionMiddleware
            ],
            query:
              organizationIntegrationsQuerySchema
          },
          async (ctx) => {
            const session =
              ctx.context.session

            const {
              organizationId
            } = ctx.query

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                organizationId
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

            const result =
              await pool.query<{
                pluginId: string
                enabled: boolean
                useGlobalConfiguration:
                  boolean
                csvSourceId:
                  string | null
                csvSourceName:
                  string | null
              }>(
                `
                  SELECT
                    oi."pluginId",
                    oi.enabled,
                    COALESCE(
                      oi."useGlobalConfiguration",
                      false
                    ) AS "useGlobalConfiguration",
                    csvos."sourceId" AS
                      "csvSourceId",
                    csvs.name AS
                      "csvSourceName"
                  FROM
                    "organizationIntegration" oi
                  LEFT JOIN
                    "sevenShiftsCsvOrganizationSource" csvos
                    ON
                      oi."pluginId" =
                        'seven-shifts-csv'
                      AND
                      csvos."organizationId" =
                        oi."organizationId"
                  LEFT JOIN
                    "sevenShiftsCsvSource" csvs
                    ON
                      csvs.id =
                        csvos."sourceId"
                  WHERE
                    oi."organizationId" =
                      $1
                  ORDER BY
                    oi."pluginId" ASC
                `,
                [
                  organizationId
                ]
              )

            return ctx.json({
              organizationId,
              integrations:
                result.rows
            })
          }
        ),

      setOrganizationIntegrationEnabled:
        createAuthEndpoint(
          "/integration-manager/set-enabled",
          {
            method: "POST",
            use: [
              sessionMiddleware
            ],
            body:
              setEnabledBodySchema
          },
          async (ctx) => {
            const session =
              ctx.context.session

            const {
              pluginId,
              organizationId,
              enabled
            } = ctx.body

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                organizationId
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

            const exists =
              await assertOrganizationExists(
                pool,
                organizationId
              )

            if (!exists) {
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

            const integration =
              await setIntegrationEnabled({
                pool,
                organizationId,
                pluginId,
                enabled
              })

            return ctx.json({
              integration
            })
          }
        ),

      setOrganizationIntegrationConfigurationSource:
        createAuthEndpoint(
          "/integration-manager/set-configuration-source",
          {
            method: "POST",
            use: [
              sessionMiddleware
            ],
            body:
              setConfigurationSourceBodySchema
          },
          async (ctx) => {
            const session =
              ctx.context.session

            const {
              pluginId,
              organizationId,
              useGlobalConfiguration
            } = ctx.body

            const allowed =
              await canManageOrganization(
                pool,
                session.user.id,
                organizationId
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

            const exists =
              await assertOrganizationExists(
                pool,
                organizationId
              )

            if (!exists) {
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

            const integration =
              await setIntegrationConfigurationSource({
                pool,
                organizationId,
                pluginId,
                useGlobalConfiguration
              })

            return ctx.json({
              integration
            })
          }
        )
    },

    schema: {
      organizationIntegration: {
        modelName:
          "organizationIntegration",

        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model:
                "organization",
              field: "id",
              onDelete:
                "cascade"
            }
          },

          pluginId: {
            type: "string",
            required: true
          },

          enabled: {
            type: "boolean",
            required: true,
            defaultValue: false
          },

          useGlobalConfiguration: {
            type: "boolean",
            required: false,
            defaultValue: false
          }
        }
      }
    }
  }) satisfies BetterAuthPlugin
