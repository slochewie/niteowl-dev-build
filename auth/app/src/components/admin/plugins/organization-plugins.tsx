"use client"

import {
  Settings2
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  setAdminOrganizationPluginSyncDirection,
  type AdminOrganizationIntegration
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
  const router =
    useRouter()

  const [
    pendingPluginId,
    setPendingPluginId
  ] = useState<
    string | null
  >(null)

  async function setSyncDirection(
    integration:
      AdminOrganizationIntegration,
    syncDirection:
      AdminOrganizationIntegration["syncDirection"]
  ) {
    setPendingPluginId(
      integration.pluginId
    )

    try {
      await setAdminOrganizationPluginSyncDirection({
        data: {
          pluginId:
            integration.pluginId,
          organizationId:
            organization.id,
          syncDirection
        }
      })

      toast.success(
        "Sync direction updated"
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update sync direction"
      )
    } finally {
      setPendingPluginId(
        null
      )
    }
  }


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
              {integration.pluginId ===
                "seven-shifts-api" && (
                <div className="mb-4 space-y-2">
                  <div className="text-sm font-medium">
                    Sync Direction
                  </div>

                  <Select
                    value={
                      integration.syncDirection
                    }
                    disabled={
                      pendingPluginId ===
                      integration.pluginId
                    }
                    onValueChange={(value) =>
                      setSyncDirection(
                        integration,
                        value as AdminOrganizationIntegration["syncDirection"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[320px]">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="to-better-auth">
                        7shifts → Better Auth
                      </SelectItem>

                      <SelectItem value="from-better-auth">
                        Better Auth → 7shifts
                      </SelectItem>

                      <SelectItem value="bidirectional">
                        Bidirectional
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-muted-foreground">
                    Controls which system supplies shared user data for this organization.
                  </p>
                </div>
              )}


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
