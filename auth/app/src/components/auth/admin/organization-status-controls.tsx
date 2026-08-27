"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  setAdminOrganizationEnabled,
  type AdminOrganizationListItem
} from "@/lib/admin/organizations"

export function OrganizationStatusControls({
  organizations,
  onChanged
}: {
  organizations:
    AdminOrganizationListItem[]
  onChanged: () => Promise<void>
}) {
  const [pendingId, setPendingId] =
    useState<string | null>(null)

  async function setEnabled(
    organization: AdminOrganizationListItem,
    enabled: boolean
  ) {
    setPendingId(organization.id)

    try {
      await setAdminOrganizationEnabled({
        data: {
          organizationId:
            organization.id,
          enabled
        }
      })

      toast.success(
        enabled
          ? `${organization.name} enabled`
          : `${organization.name} disabled`
      )

      await onChanged()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update organization status"
      )
    } finally {
      setPendingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Organization access
        </CardTitle>

        <CardDescription>
          Disabled organizations cannot be selected as an active organization. Disabling one also clears it from existing active sessions.
        </CardDescription>
      </CardHeader>

      <CardContent className="divide-y p-0">
        {organizations.map(
          (organization) => (
            <div
              key={organization.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="truncate font-medium">
                    {organization.name}
                  </div>

                  <Badge
                    variant={
                      organization.enabled
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {organization.enabled
                      ? "Active"
                      : "Disabled"}
                  </Badge>
                </div>

                <div className="truncate text-sm text-muted-foreground">
                  {organization.slug}
                </div>
              </div>

              <Switch
                checked={organization.enabled}
                disabled={
                  pendingId ===
                  organization.id
                }
                aria-label={`Toggle ${organization.name}`}
                onCheckedChange={(enabled) =>
                  void setEnabled(
                    organization,
                    enabled
                  )
                }
              />
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
