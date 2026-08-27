"use client"

import {
  Building2
} from "lucide-react"
import {
  useState
} from "react"
import {
  useRouter
} from "@tanstack/react-router"
import { toast } from "sonner"

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
  Switch
} from "@/components/ui/switch"

import {
  setAdminOrganizationPluginEnabled,
  setAdminSevenShiftsCsvOrganizationSource,
  type AdminPluginDetail
} from "@/lib/admin/plugins"

const UNASSIGNED_SOURCE_VALUE =
  "__unassigned__"

export function PluginOrganizations({
  detail
}: {
  detail:
    AdminPluginDetail
}) {
  const router =
    useRouter()

  const [
    pendingOrganizationId,
    setPendingOrganizationId
  ] = useState<
    string | null
  >(null)

  const showsCsvSource =
    detail.plugin.id ===
    "seven-shifts-csv"

  async function setEnabled(
    organizationId: string,
    enabled: boolean
  ) {
    setPendingOrganizationId(
      organizationId
    )

    try {
      await setAdminOrganizationPluginEnabled({
        data: {
          pluginId:
            detail.plugin.id,
          organizationId,
          enabled
        }
      })

      toast.success(
        enabled
          ? `${detail.plugin.name} enabled`
          : `${detail.plugin.name} disabled`
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update plugin"
      )
    } finally {
      setPendingOrganizationId(
        null
      )
    }
  }

  async function setCsvSource(
    organizationId: string,
    value: string
  ) {
    setPendingOrganizationId(
      organizationId
    )

    try {
      const sourceId =
        value ===
        UNASSIGNED_SOURCE_VALUE
          ? null
          : value

      await setAdminSevenShiftsCsvOrganizationSource({
        data: {
          organizationId,
          sourceId
        }
      })

      const source =
        sourceId === null
          ? null
          : detail.csvSources.find(
              (item) =>
                item.id ===
                sourceId
            )

      toast.success(
        source
          ? `Using ${source.name}`
          : "CSV Source unassigned"
      )

      await router.invalidate()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update CSV Source"
      )
    } finally {
      setPendingOrganizationId(
        null
      )
    }
  }

  const enabledCount =
    detail.organizations.filter(
      (organization) =>
        organization.enabled
    ).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Organizations
        </CardTitle>

        <CardDescription>
          {showsCsvSource
            ? "Enable 7shifts CSV for individual organizations and choose the CSV Source each organization uses."
            : "Enable this integration for individual organizations."}
        </CardDescription>

        <p className="text-sm text-muted-foreground">
          Enabled for{" "}
          {enabledCount} of{" "}
          {
            detail.organizations
              .length
          } organizations
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {detail.organizations.length ===
        0 ? (
          <div className="px-6 pb-6 text-sm text-muted-foreground">
            No organizations
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div
              className={
                showsCsvSource
                  ? "min-w-[760px]"
                  : "min-w-[480px]"
              }
            >
              <div
                className={
                  showsCsvSource
                    ? "grid grid-cols-[minmax(240px,1fr)_140px_minmax(260px,320px)] items-center gap-4 border-y px-6 py-3 text-sm font-medium text-muted-foreground"
                    : "grid grid-cols-[minmax(240px,1fr)_140px] items-center gap-4 border-y px-6 py-3 text-sm font-medium text-muted-foreground"
                }
              >
                <div>
                  Organization
                </div>

                <div>
                  Enabled
                </div>

                {showsCsvSource && (
                  <div>
                    CSV Source
                  </div>
                )}
              </div>

              {detail.organizations.map(
                (
                  organization,
                  index
                ) => {
                  const pending =
                    pendingOrganizationId !==
                    null

                  const csvSourceValue =
                    organization.csvSourceId ??
                    UNASSIGNED_SOURCE_VALUE

                  return (
                    <div
                      key={
                        organization.id
                      }
                      className={
                        [
                          showsCsvSource
                            ? "grid grid-cols-[minmax(240px,1fr)_140px_minmax(260px,320px)]"
                            : "grid grid-cols-[minmax(240px,1fr)_140px]",
                          "items-center gap-4 px-6 py-4",
                          index > 0
                            ? "border-t"
                            : ""
                        ].join(" ")
                      }
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                          {organization.logo ? (
                            <img
                              src={
                                organization.logo
                              }
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Building2 className="size-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {
                              organization.name
                            }
                          </div>

                          <div className="truncate text-sm text-muted-foreground">
                            /
                            {
                              organization.slug
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={
                            organization.enabled
                          }
                          disabled={
                            pending
                          }
                          onCheckedChange={(
                            enabled
                          ) =>
                            void setEnabled(
                              organization.id,
                              enabled
                            )
                          }
                          aria-label={`Enable ${detail.plugin.name} for ${organization.name}`}
                        />

                        <span className="text-sm text-muted-foreground">
                          {organization.enabled
                            ? "On"
                            : "Off"}
                        </span>
                      </div>

                      {showsCsvSource && (
                        <Select
                          value={
                            csvSourceValue
                          }
                          disabled={
                            pending ||
                            !organization.enabled
                          }
                          onValueChange={(
                            value
                          ) =>
                            void setCsvSource(
                              organization.id,
                              value
                            )
                          }
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-label={`CSV Source for ${organization.name}`}
                          >
                            <SelectValue placeholder="Select CSV Source" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem
                              value={
                                UNASSIGNED_SOURCE_VALUE
                              }
                            >
                              Unassigned
                            </SelectItem>

                            {detail.csvSources.map(
                              (
                                source
                              ) => (
                                <SelectItem
                                  key={
                                    source.id
                                  }
                                  value={
                                    source.id
                                  }
                                >
                                  {source.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )
                }
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
