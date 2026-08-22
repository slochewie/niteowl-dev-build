import {
  createServerFn
} from "@tanstack/react-start"
import {
  getRequest
} from "@tanstack/react-start/server"

import { auth } from "@/lib/auth"
import {
  getIntegration,
  INTEGRATIONS,
  isAvailableIntegrationId,
  type IntegrationDefinition,
  type IntegrationId
} from "@/lib/plugins/integration-manager/registry"

export type AdminPluginOrganization = {
  id: string
  name: string
  slug: string
  logo: string | null
  enabled: boolean
  useGlobalConfiguration: boolean
  csvSourceId: string | null
  csvSourceName: string | null
}

export type AdminSevenShiftsCsvSource = {
  id: string
  name: string
  organizationCount: number
  createdAt: Date
  updatedAt: Date
}

export type AdminPluginCatalogItem =
  IntegrationDefinition & {
    enabledOrganizationCount: number
  }

export type AdminPluginDetail = {
  plugin: IntegrationDefinition
  organizations:
    AdminPluginOrganization[]
  csvSources:
    AdminSevenShiftsCsvSource[]
}

async function requireGlobalAdmin() {
  const request =
    getRequest()

  const session =
    await auth.api.getSession({
      headers: request.headers
    })

  if (!session) {
    throw new Error(
      "Unauthorized"
    )
  }

  if (
    session.user.role !==
    "admin"
  ) {
    throw new Error(
      "Forbidden"
    )
  }

  return {
    request,
    session
  }
}

async function getOrganizationsForPlugin(
  pluginId: IntegrationId
) {
  const {
    request
  } = await requireGlobalAdmin()

  const result =
    await auth.api.listIntegrationOrganizations({
      query: {
        pluginId
      },
      headers:
        request.headers
    })

  return result.organizations
}

export const getAdminPluginCatalog =
  createServerFn({
    method: "GET"
  }).handler(
    async (): Promise<
      AdminPluginCatalogItem[]
    > => {
      await requireGlobalAdmin()

      return Promise.all(
        INTEGRATIONS.map(
          async (
            plugin
          ) => {
            if (
              plugin.status ===
                "planned" ||
              !isAvailableIntegrationId(
                plugin.id
              )
            ) {
              return {
                ...plugin,
                enabledOrganizationCount:
                  0
              }
            }

            const organizations =
              await getOrganizationsForPlugin(
                plugin.id
              )

            return {
              ...plugin,

              enabledOrganizationCount:
                organizations.filter(
                  (
                    organization
                  ) =>
                    organization.enabled
                ).length
            }
          }
        )
      )
    }
  )

export const getAdminPlugin =
  createServerFn({
    method: "GET"
  })
    .validator(
      (data: {
        pluginId: string
      }) => data
    )
    .handler(
      async ({
        data
      }): Promise<
        AdminPluginDetail
      > => {
        await requireGlobalAdmin()

        const plugin =
          getIntegration(
            data.pluginId
          )

        if (!plugin) {
          throw new Error(
            "Plugin not found"
          )
        }

        if (
          plugin.status ===
            "planned" ||
          !isAvailableIntegrationId(
            plugin.id
          )
        ) {
          return {
            plugin,
            organizations: [],
            csvSources: []
          }
        }

        const organizations =
          await getOrganizationsForPlugin(
            plugin.id
          )

        let csvSources:
          AdminSevenShiftsCsvSource[] =
            []

        if (
          plugin.id ===
          "seven-shifts-csv"
        ) {
          const {
            request
          } =
            await requireGlobalAdmin()

          const result =
            await auth.api
              .listSevenShiftsCsvSources({
                headers:
                  request.headers
              })

          csvSources =
            result.sources
        }

        return {
          plugin,
          organizations,
          csvSources
        }
      }
    )

export const setAdminOrganizationPluginEnabled =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        pluginId:
          IntegrationId
        organizationId:
          string
        enabled: boolean
      }) => data
    )
    .handler(
      async ({
        data
      }) => {
        const {
          request
        } = await requireGlobalAdmin()

        return auth.api
          .setOrganizationIntegrationEnabled({
            body: {
              pluginId:
                data.pluginId,
              organizationId:
                data.organizationId,
              enabled:
                data.enabled
            },
            headers:
              request.headers
          })
      }
    )

export const setAdminSevenShiftsCsvOrganizationSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId:
          string
        sourceId:
          string
      }) => data
    )
    .handler(
      async ({
        data
      }) => {
        const {
          request
        } =
          await requireGlobalAdmin()

        return auth.api
          .setSevenShiftsCsvOrganizationSource({
            body: {
              organizationId:
                data.organizationId,
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )

export const setAdminOrganizationPluginConfigurationSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        pluginId:
          IntegrationId
        organizationId:
          string
        useGlobalConfiguration:
          boolean
      }) => data
    )
    .handler(
      async ({
        data
      }) => {
        const {
          request
        } = await requireGlobalAdmin()

        return auth.api
          .setOrganizationIntegrationConfigurationSource({
            body: {
              pluginId:
                data.pluginId,
              organizationId:
                data.organizationId,
              useGlobalConfiguration:
                data.useGlobalConfiguration
            },
            headers:
              request.headers
          })
      }
    )

export type AdminOrganizationIntegration = {
  pluginId: IntegrationId
  enabled: boolean
  useGlobalConfiguration: boolean
  csvSourceId: string | null
  csvSourceName: string | null
}

export const getAdminOrganizationIntegrations =
  createServerFn({
    method: "GET"
  })
    .validator(
      (data: {
        organizationId: string
      }) => data
    )
    .handler(
      async ({
        data
      }): Promise<
        AdminOrganizationIntegration[]
      > => {
        const {
          request
        } = await requireGlobalAdmin()

        const result =
          await auth.api.getOrganizationIntegrations({
            query: {
              organizationId:
                data.organizationId
            },
            headers:
              request.headers
          })

        return result.integrations
          .filter(
            (integration) =>
              isAvailableIntegrationId(
                integration.pluginId
              )
          )
          .map(
            (integration) => ({
              pluginId:
                integration.pluginId as IntegrationId,

              enabled:
                integration.enabled,

              useGlobalConfiguration:
                integration.useGlobalConfiguration ??
                true,

              csvSourceId:
                integration.csvSourceId ??
                null,

              csvSourceName:
                integration.csvSourceName ??
                null
            })
          )
      }
    )

export const createAdminSevenShiftsCsvSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        name: string
      }) => data
    )
    .handler(
      async ({
        data
      }) => {
        const {
          request
        } =
          await requireGlobalAdmin()

        return auth.api
          .createSevenShiftsCsvSource({
            body: {
              name:
                data.name
            },
            headers:
              request.headers
          })
      }
    )

export const renameAdminSevenShiftsCsvSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
        name: string
      }) => data
    )
    .handler(
      async ({
        data
      }) => {
        const {
          request
        } =
          await requireGlobalAdmin()

        return auth.api
          .renameSevenShiftsCsvSource({
            body: {
              sourceId:
                data.sourceId,
              name:
                data.name
            },
            headers:
              request.headers
          })
      }
    )
