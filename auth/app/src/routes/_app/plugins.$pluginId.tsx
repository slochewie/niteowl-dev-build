import {
  createFileRoute,
  Link
} from "@tanstack/react-router"

import {
  IntegrationLogo
} from "@/components/admin/plugins/integration-logo"
import {
  PluginOrganizations
} from "@/components/admin/plugins/plugin-organizations"
import {
  getPluginIcon
} from "@/components/admin/plugins/plugin-card"
import {
  PluginPlaceholderConfig
} from "@/components/admin/plugins/plugin-placeholder-config"
import {
  SevenShiftsCsvSources
} from "@/components/admin/plugins/seven-shifts-csv-sources"
import {
  SevenShiftsApiSources
} from "@/components/admin/plugins/seven-shifts-api-sources"
import {
  Badge
} from "@/components/ui/badge"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import {
  getAdminPlugin
} from "@/lib/admin/plugins"
import type {
  CatalogIntegrationId,
  PlannedIntegrationId
} from "@/lib/plugins/integration-manager/registry"

export const Route =
  createFileRoute(
    "/_app/plugins/$pluginId"
  )({
    loader: async ({
      params
    }) => {
      const detail =
        await getAdminPlugin({
          data: {
            pluginId:
              params.pluginId
          }
        })

      return {
        detail
      }
    },

    component:
      PluginPage
  })

function PluginPage() {
  const {
    detail
  } = Route.useLoaderData()

  const Icon =
    getPluginIcon(
      detail.plugin.id
    )

  const planned =
    detail.plugin.status ===
    "planned"

  const hasBrandLogo =
    hasIntegrationLogo(
      detail.plugin.id
    )

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-4 md:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/plugins"
            className="hover:text-foreground"
          >
            Plugins & APIs
          </Link>

          <span>/</span>

          <span className="text-foreground">
            {
              detail.plugin.name
            }
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-start">
            {hasBrandLogo ? (
              <div className="flex h-12 min-w-12 shrink-0 items-center">
                <IntegrationLogo
                  pluginId={
                    detail.plugin.id
                  }
                  name={
                    detail.plugin.name
                  }
                />
              </div>
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-6" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold">
                  {
                    detail.plugin.name
                  }
                </h1>

                <Badge variant="outline">
                  {
                    detail.plugin.category
                  }
                </Badge>

                {planned && (
                  <Badge variant="secondary">
                    Planned
                  </Badge>
                )}
              </div>

              <p className="mt-2 text-muted-foreground">
                {
                  detail.plugin.description
                }
              </p>

              <div className="mt-4 text-sm">
                <span className="text-muted-foreground">
                  Configuration:{" "}
                </span>

                {
                  detail.plugin.configurationLabel
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {planned ? (
          <PluginPlaceholderConfig
            pluginId={
              detail.plugin.id as PlannedIntegrationId
            }
          />
        ) : (
          <>
            {detail.plugin.id ===
              "seven-shifts-csv" && (
              <SevenShiftsCsvSources
                sources={
                  detail.csvSources
                }
              />
            )}

          {detail.plugin.id ===
            "seven-shifts-api" && (
            <SevenShiftsApiSources
              sources={
                detail.apiSources
              }
              organizations={
                detail.organizations
              }
            />
          )}

            <PluginOrganizations
              detail={detail}
            />
          </>
        )}
      </div>
    </div>
  )
}

function hasIntegrationLogo(
  pluginId:
    CatalogIntegrationId
) {
  switch (pluginId) {
    case "seven-shifts-csv":
    case "seven-shifts-api":
    case "unifi-api":
    case "unifi-ldap":
    case "toast-api":
    case "paychex-api":
    case "counter":
      return true

    case "wifi":
    case "mqtt":
      return false
  }
}
