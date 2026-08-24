"use client"

import {
  Braces,
  Calculator,
  FileUp,
  Network,
  RadioTower,
  ServerCog,
  Utensils,
  WalletCards,
  Wifi
} from "lucide-react"
import {
  useNavigate
} from "@tanstack/react-router"

import {
  IntegrationLogo
} from "@/components/admin/plugins/integration-logo"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import type {
  AdminPluginCatalogItem
} from "@/lib/admin/plugins"
import type {
  CatalogIntegrationId
} from "@/lib/plugins/integration-manager/registry"

export function PluginCard({
  plugin
}: {
  plugin:
    AdminPluginCatalogItem
}) {
  const navigate =
    useNavigate()

  const Icon =
    getPluginIcon(
      plugin.id
    )

  const hasBrandLogo =
    hasIntegrationLogo(
      plugin.id
    )

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-muted/40"
      onClick={() =>
        void navigate({
          to:
            "/plugins/$pluginId",
          params: {
            pluginId:
              plugin.id
          }
        })
      }
    >
      <CardHeader>
        <div className="flex min-h-10 items-start justify-between gap-4">
          {hasBrandLogo ? (
            <IntegrationLogo
              pluginId={
                plugin.id
              }
              name={
                plugin.name
              }
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-5" />
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Badge variant="outline">
              {
                plugin.category
              }
            </Badge>

            {plugin.status ===
              "planned" && (
              <Badge variant="secondary">
                Planned
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-2">
          <CardTitle>
            {plugin.name}
          </CardTitle>

          <CardDescription className="mt-2">
            {
              plugin.description
            }
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            Status
          </span>

          <span className="font-medium">
            {plugin.status ===
            "planned"
              ? "Coming Soon"
              : "Available"}
          </span>
        </div>

        {plugin.status ===
          "available" && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Enabled Organizations
            </span>

            <span className="font-medium tabular-nums">
              {
                plugin.enabledOrganizationCount
              }
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            Configuration
          </span>

          <span className="text-right">
            {
              plugin.configurationLabel
            }
          </span>
        </div>
      </CardContent>
    </Card>
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

    case "glauth":
    case "wifi":
    case "mqtt":
      return false
  }
}

export function getPluginIcon(
  pluginId:
    CatalogIntegrationId
) {
  switch (pluginId) {
    case "seven-shifts-csv":
      return FileUp

    case "seven-shifts-api":
      return Braces

    case "unifi-api":
      return Network

    case "glauth":
      return ServerCog

    case "unifi-ldap":
      return Network

    case "toast-api":
      return Utensils

    case "paychex-api":
      return WalletCards

    case "wifi":
      return Wifi

    case "mqtt":
      return RadioTower

    case "counter":
      return Calculator
  }
}
