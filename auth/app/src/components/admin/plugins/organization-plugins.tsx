import {
  Settings2
} from "lucide-react"

import {
  IntegrationLogo
} from "@/components/admin/plugins/integration-logo"
import {
  Badge
} from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import type {
  AdminOrganizationIntegration
} from "@/lib/admin/plugins"
import {
  getIntegration
} from "@/lib/plugins/integration-manager/registry"

type OrganizationPluginsProps = {
  organization: {
    id: string
    name: string
  }

  integrations:
    AdminOrganizationIntegration[]
}

export function OrganizationPlugins({
  organization,
  integrations
}: OrganizationPluginsProps) {
  const enabledIntegrations =
    integrations.filter(
      (integration) =>
        integration.enabled
    )

  if (
    enabledIntegrations.length ===
    0
  ) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No plugins are enabled for this organization.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {enabledIntegrations.map(
        (integration) => {
          const plugin =
            getIntegration(
              integration.pluginId
            )

          if (!plugin) {
            return null
          }

          const configurationSource =
            integration.useGlobalConfiguration
              ? "Global Configuration"
              : "Organization Configuration"

          if (
            integration.pluginId ===
            "seven-shifts-csv"
          ) {
            return (
              <div
                key={
                  integration.pluginId
                }
                className="space-y-3"
              >
                <PluginHeader
                  integration={
                    integration
                  }
                  configurationSource={
                    integration.csvSourceName
                      ? `CSV Source: ${integration.csvSourceName}`
                      : "CSV Source not assigned"
                  }
                />

                <Card>
                  <CardContent className="space-y-4 py-6">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        CSV Source
                      </div>

                      <div className="mt-1 font-medium">
                        {
                          integration.csvSourceName ??
                          "Not assigned"
                        }
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {integration.csvSourceName
                        ? `Workforce data for ${organization.name} is managed by the ${integration.csvSourceName} CSV Source. Uploads and imports are managed from Plugins & APIs.`
                        : `No CSV Source is assigned to ${organization.name}. Assign one from Plugins & APIs to provide 7shifts CSV workforce data.`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          }

          return (
            <Card
              key={
                integration.pluginId
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <IntegrationLogo
                      pluginId={
                        integration.pluginId
                      }
                      name={
                        plugin.name
                      }
                    />

                    <div className="min-w-0">
                      <CardTitle>
                        {
                          plugin.name
                        }
                      </CardTitle>

                      <CardDescription className="mt-1">
                        {
                          plugin.description
                        }
                      </CardDescription>
                    </div>
                  </div>

                  <Badge variant="secondary">
                    Enabled
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {integration.useGlobalConfiguration ? (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <Settings2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                      <div>
                        <div className="font-medium">
                          Global Configuration
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {organization.name} uses the global {plugin.name} configuration managed from the Plugins & APIs page.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4">
                    <div className="flex items-start gap-3">
                      <Settings2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

                      <div>
                        <div className="font-medium">
                          Organization Configuration
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {organization.name} uses its own {plugin.name} configuration.
                          Organization-specific settings will appear here as this integration is implemented.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        }
      )}
    </div>
  )
}

function PluginHeader({
  integration,
  configurationSource
}: {
  integration:
    AdminOrganizationIntegration

  configurationSource:
    string
}) {
  const plugin =
    getIntegration(
      integration.pluginId
    )

  if (!plugin) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <IntegrationLogo
        pluginId={
          integration.pluginId
        }
        name={
          plugin.name
        }
      />

      <div className="min-w-0">
        <div className="font-medium">
          {plugin.name}
        </div>

        <div className="text-sm text-muted-foreground">
          {configurationSource}
        </div>
      </div>

      <Badge
        variant="secondary"
        className="ml-auto"
      >
        Enabled
      </Badge>
    </div>
  )
}
