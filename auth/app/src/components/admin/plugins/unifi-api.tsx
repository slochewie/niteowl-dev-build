"use client"

import {
  Camera,
  Network,
  ShieldCheck
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

import {
  type AdminPluginOrganization,
  type AdminUnifiAccessSource
} from "@/lib/admin/plugins"

import {
  UnifiAccessSources
} from "./unifi-access-sources"

export function UnifiApi({
  accessSources,
  organizations
}: {
  accessSources:
    AdminUnifiAccessSource[]
  organizations:
    AdminPluginOrganization[]
}) {
  return (
    <Tabs
      defaultValue="access"
      className="space-y-4"
    >
      <TabsList
        variant="line"
        className="w-full justify-start overflow-x-auto"
      >
        <TabsTrigger
          value="access"
          className="flex-none"
        >
          <ShieldCheck />
          Access API
        </TabsTrigger>

        <TabsTrigger
          value="network"
          className="flex-none"
        >
          <Network />
          Network API
        </TabsTrigger>

        <TabsTrigger
          value="protect"
          className="flex-none"
        >
          <Camera />
          Protect API
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="access"
        className="space-y-6"
      >
        <UnifiAccessSources
          sources={
            accessSources
          }
          organizations={
            organizations
          }
        />
      </TabsContent>

      <TabsContent
        value="network"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              UniFi Network API
            </CardTitle>

            <CardDescription>
              Network API source management will use the same source and organization-assignment model as Access.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              Network API configuration is the next implementation phase.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="protect"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              UniFi Protect API
            </CardTitle>

            <CardDescription>
              Protect will remain a placeholder while Access and Network integrations are completed.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              UniFi Protect API configuration is not implemented yet.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
