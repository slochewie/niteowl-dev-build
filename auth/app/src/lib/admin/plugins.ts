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
import type { SyncDirection } from "@/lib/plugins/integration-manager/index"

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

export type AdminSevenShiftsApiSource = {
  id: string
  name: string
  companyId: number | null
  companyName: string | null
  apiVersion: string
  organizationCount: number
  hasAccessToken: boolean
  lastTestedAt: Date | null
  lastSyncAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type AdminSevenShiftsApiLocation = {
  id: number
  company_id: number
  name: string
  active?: boolean
  city?: string | null
  state?: string | null
  country?: string | null
  timezone?: string | null
}

export type AdminSevenShiftsApiLocationMapping = {
  organizationId: string
  organizationName: string
  sevenShiftsLocationId: number
  sevenShiftsLocationName: string
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
  apiSources:
    AdminSevenShiftsApiSource[]
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
            csvSources: [],
            apiSources: []
          }
        }

        const organizations =
          await getOrganizationsForPlugin(
            plugin.id
          )

        let csvSources:
          AdminSevenShiftsCsvSource[] =
            []

        let apiSources:
          AdminSevenShiftsApiSource[] =
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

        if (
          plugin.id ===
          "seven-shifts-api"
        ) {
          const {
            request
          } =
            await requireGlobalAdmin()

          const result =
            await auth.api
              .listSevenShiftsApiSources({
                headers:
                  request.headers
              })

          apiSources =
            result.sources
        }

        return {
          plugin,
          organizations,
          csvSources,
          apiSources
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

export const setAdminOrganizationPluginSyncDirection =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        pluginId:
          IntegrationId
        organizationId:
          string
        syncDirection:
          SyncDirection
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
          .setOrganizationIntegrationSyncDirection({
            body: {
              pluginId:
                data.pluginId,
              organizationId:
                data.organizationId,
              syncDirection:
                data.syncDirection
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
  syncDirection: SyncDirection
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

            syncDirection:
              (integration.syncDirection ??
                "to-better-auth") as SyncDirection,

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

export const createAdminSevenShiftsApiSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        name: string
        accessToken: string
        apiVersion?: string
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
          .createSevenShiftsApiSource({
            body: {
              name:
                data.name,
              accessToken:
                data.accessToken,
              ...(data.apiVersion
                ? {
                    apiVersion:
                      data.apiVersion
                  }
                : {})
            },
            headers:
              request.headers
          })
      }
    )

export const updateAdminSevenShiftsApiSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
        name: string
        accessToken?: string
        apiVersion?: string
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
          .updateSevenShiftsApiSource({
            body: {
              sourceId:
                data.sourceId,
              name:
                data.name,
              ...(data.accessToken
                ? {
                    accessToken:
                      data.accessToken
                  }
                : {}),
              ...(data.apiVersion
                ? {
                    apiVersion:
                      data.apiVersion
                  }
                : {})
            },
            headers:
              request.headers
          })
      }
    )

export const testAdminSevenShiftsApiSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
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
          .testSevenShiftsApiSource({
            body: {
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )

export const getAdminSevenShiftsApiLocations =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
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
          .listSevenShiftsApiLocations({
            body: {
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )

export const assignAdminSevenShiftsApiLocation =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
        organizationId: string
        sevenShiftsLocationId: number
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
          .assignSevenShiftsApiLocation({
            body: {
              sourceId:
                data.sourceId,
              organizationId:
                data.organizationId,
              sevenShiftsLocationId:
                data.sevenShiftsLocationId
            },
            headers:
              request.headers
          })
      }
    )

export const previewAdminSevenShiftsApiSync =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
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
          .previewSevenShiftsApiSync({
            body: {
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )

export const syncAdminSevenShiftsApiSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
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
          .syncSevenShiftsApiSource({
            body: {
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )



export type AdminGlauthSource = {
  id: string
  name: string
  slug: string
  baseDn: string
  backendName: string | null
  runtimeSchema: string | null
  runtimePort: number | null
  runtimeStatus: string
  uidStart: number
  gidNumber: number
  userGroupName: string
  enabled: boolean
  projectedUsers: number
  activeUsers: number
  disabledUsers: number
  lastReconciledAt: Date | string | null
  organizationIds: string[]
}

export const getAdminGlauthSources =
  createServerFn({
    method: "GET"
  }).handler(
    async (): Promise<
      AdminGlauthSource[]
    > => {
      const {
        request
      } =
        await requireGlobalAdmin()

      const result =
        await auth.api
          .listGlauthSources({
            headers:
              request.headers
          })

      return result.sources
    }
  )

export const createAdminGlauthSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        name: string
        slug: string
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
          .createGlauthSource({
            body: data,
            headers:
              request.headers
          })
      }
    )

export const updateAdminGlauthSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
        name: string
        uidStart: number
        gidNumber: number
        userGroupName: string
        enabled: boolean
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
          .updateGlauthSource({
            body: data,
            headers:
              request.headers
          })
      }
    )

export const setAdminGlauthOrganizationSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        sourceId:
          string | null
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
          .setGlauthOrganizationSource({
            body: data,
            headers:
              request.headers
          })
      }
    )

export type AdminGlauthReconcileResult = {
  sourceId: string
  sourceName: string
  organizations: number
  users: number
  created: number
  updated: number
  removed: number
  disabled: number
}

export const reconcileAdminGlauthSource =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        sourceId: string
      }) => data
    )
    .handler(
      async ({
        data
      }): Promise<
        AdminGlauthReconcileResult
      > => {
        const {
          request
        } =
          await requireGlobalAdmin()

        return auth.api
          .reconcileGlauthSource({
            body: {
              sourceId:
                data.sourceId
            },
            headers:
              request.headers
          })
      }
    )
