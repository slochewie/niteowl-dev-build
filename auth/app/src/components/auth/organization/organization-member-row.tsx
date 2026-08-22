"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useSession,
  useUpdateMemberRole
} from "@better-auth-ui/react"
import {
  useNavigate
} from "@tanstack/react-router"
import type {
  Member,
  Organization,
  User
} from "better-auth/client"
import {
  Ban,
  Check,
  CircleCheck,
  Copy,
  Ellipsis,
  Eye,
  LogOut,
  Trash2,
  UserCog
} from "lucide-react"
import {
  useEffect,
  useState
} from "react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "#/components/ui/dropdown-menu.tsx"
import { Spinner } from "#/components/ui/spinner.tsx"
import {
  TableCell,
  TableRow
} from "#/components/ui/table.tsx"
import { Switch } from "#/components/ui/switch.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { UserView } from "../user/user-view"
import { LeaveOrganizationDialog } from "./leave-organization-dialog"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"
import { RemoveMemberDialog } from "./remove-member-dialog"

export type OrganizationMemberRowProps = {
  member: Member & {
    user: Partial<User>
  }
  isOwner?: boolean
  organization: Organization
  banned?: boolean
  banReason?: string | null
}

export function OrganizationMemberRow({
  member,
  isOwner,
  organization,
  banned = false,
  banReason = null
}: OrganizationMemberRowProps) {
  const { authClient } = useAuth()
  const navigate = useNavigate()

  const {
    localization: organizationLocalization,
    roles
  } = useAuthPlugin(organizationPlugin)

  const { data: session } =
    useSession(authClient)

  const {
    data: hasUpdatePermission,
    isPending: updatePermissionPending
  } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: {
        member: ["update"]
      }
    }
  )

  const {
    data: hasDeletePermission,
    isPending: deletePermissionPending
  } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: {
        member: ["delete"]
      }
    }
  )

  const isPending =
    updatePermissionPending ||
    deletePermissionPending

  const {
    mutate: updateMemberRole,
    isPending: isUpdatingRole
  } = useUpdateMemberRole(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () =>
        toast.success(
          organizationLocalization.memberRoleUpdated
        )
    }
  )

  const roleLabel =
    roles?.[member.role] ?? member.role

  const assignableRoles =
    Object.entries(roles).filter(
      ([key]) =>
        isOwner || key !== "owner"
    )

  const isCurrentUser =
    session?.user.id === member.userId

  const isGlobalAdmin =
    session?.user.role === "admin"

  const [removeOpen, setRemoveOpen] =
    useState(false)

  const [leaveOpen, setLeaveOpen] =
    useState(false)

  const [wifiEnabled, setWifiEnabled] =
    useState(false)

  const [
    hasWifiEntitlement,
    setHasWifiEntitlement
  ] = useState(false)

  const [wifiLoading, setWifiLoading] =
    useState(false)

  const [
    organizationUniFiEnabled,
    setOrganizationUniFiEnabled
  ] = useState(false)

  useEffect(() => {
    fetch(
      `/api/auth/unifi-identity/user-access?organizationId=${organization.id}&userId=${member.userId}`
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {
        setOrganizationUniFiEnabled(
          data.organizationUniFiEnabled ??
            false
        )

        setHasWifiEntitlement(
          data.hasWifiEntitlement ??
            false
        )

        setWifiEnabled(
          Boolean(
            data.organizationUniFiEnabled &&
              data.hasWifiEntitlement &&
              data.wifiEnabled
          )
        )
      })
      .catch(() => {})
  }, [
    organization.id,
    member.userId
  ])

  async function updateWifi(
    enabled: boolean
  ) {
    setWifiLoading(true)

    try {
      const accessResponse =
        await fetch(
          "/api/auth/unifi-identity/user-access",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              organizationId:
                organization.id,
              userId:
                member.userId,
              wifiEnabled:
                enabled
            })
          }
        )

      const accessData =
        await accessResponse.json()

      if (
        !accessResponse.ok ||
        accessData.ok === false
      ) {
        throw new Error(
          accessData.error ??
            accessData.message ??
            "Unable to update WiFi access"
        )
      }

      if (enabled) {
        const provisionResponse =
          await fetch(
            "/api/auth/unifi-identity/users/provision",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                organizationId:
                  organization.id,
                userId:
                  member.userId
              })
            }
          )

        const provisionData =
          await provisionResponse.json()

        if (
          !provisionResponse.ok ||
          provisionData.ok !== true
        ) {
          throw new Error(
            provisionData.error ??
              provisionData.message ??
              (
                provisionData.stage
                  ? `UniFi provisioning failed at ${provisionData.stage}`
                  : "Unable to provision UniFi WiFi access"
              )
          )
        }
      }

      const verifyResponse =
        await fetch(
          `/api/auth/unifi-identity/user-access?organizationId=${encodeURIComponent(
            organization.id
          )}&userId=${encodeURIComponent(
            member.userId
          )}`
        )

      const verifyData =
        await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(
          verifyData.error ??
            verifyData.message ??
            "Unable to verify WiFi access"
        )
      }

      if (
        enabled &&
        verifyData.actuallyHasWifi !==
          true
      ) {
        setWifiEnabled(false)

        throw new Error(
          "UniFi provisioning completed but the user was not added to One-Click WiFi"
        )
      }

      if (
        !enabled &&
        verifyData.actuallyHasWifi ===
          true
      ) {
        setWifiEnabled(true)

        throw new Error(
          "UniFi still reports the user in One-Click WiFi"
        )
      }

      setWifiEnabled(enabled)

      toast.success(
        enabled
          ? "WiFi access enabled"
          : "WiFi access disabled"
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update WiFi access"
      )
    } finally {
      setWifiLoading(false)
    }
  }

  async function copyEmail() {
    const email =
      member.user.email

    if (!email) {
      return
    }

    await navigator.clipboard.writeText(
      email
    )

    toast.success("Email copied")
  }

  if (isPending) {
    return (
      <OrganizationMemberRowSkeleton />
    )
  }

  const canChangeRole =
    hasUpdatePermission?.success === true

  const canRemoveMember =
    hasDeletePermission?.success === true

  return (
    <>
      <TableRow>
        <TableCell>
          <UserView
            user={member.user}
          />
        </TableCell>

        <TableCell>
          {roleLabel}
        </TableCell>

        <TableCell>
          {banned ? (
            <div
              className="flex items-center gap-2 text-destructive"
              title={
                banReason ??
                "This user is banned"
              }
            >
              <Ban className="size-4" />
              <span>Banned</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4" />
              <span>Active</span>
            </div>
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center justify-end gap-2">
            {organizationUniFiEnabled && (
              <Switch
                checked={wifiEnabled}
                disabled={
                  wifiLoading ||
                  banned ||
                  !hasWifiEntitlement
                }
                onCheckedChange={
                  updateWifi
                }
                aria-label="WiFi access"
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={
                    isUpdatingRole
                  }
                >
                  {isUpdatingRole ? (
                    <Spinner />
                  ) : (
                    <Ellipsis />
                  )}

                  <span className="sr-only">
                    Actions for{" "}
                    {member.user.name ??
                      member.user.email ??
                      "member"}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48"
              >
                {isGlobalAdmin && (
                  <DropdownMenuItem
                    onSelect={() =>
                      void navigate({
                        to: "/users/$userId",
                        params: {
                          userId:
                            member.userId
                        }
                      })
                    }
                  >
                    <Eye />
                    View profile
                  </DropdownMenuItem>
                )}

                {member.user.email && (
                  <DropdownMenuItem
                    onSelect={() =>
                      void copyEmail()
                    }
                  >
                    <Copy />
                    Copy email
                  </DropdownMenuItem>
                )}

                {(isGlobalAdmin ||
                  member.user.email) && (
                  <DropdownMenuSeparator />
                )}

                {canChangeRole && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserCog />
                      Change role
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>
                        Role
                      </DropdownMenuLabel>

                      {assignableRoles.map(
                        ([
                          role,
                          label
                        ]) => (
                          <DropdownMenuItem
                            key={role}
                            disabled={
                              member.role ===
                                role ||
                              isUpdatingRole
                            }
                            onSelect={() =>
                              updateMemberRole({
                                memberId:
                                  member.id,
                                role
                              })
                            }
                          >
                            {member.role ===
                              role && (
                              <Check />
                            )}

                            {label}
                          </DropdownMenuItem>
                        )
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                {(canChangeRole ||
                  isCurrentUser ||
                  canRemoveMember) && (
                  <DropdownMenuSeparator />
                )}

                {isCurrentUser ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() =>
                      setLeaveOpen(true)
                    }
                  >
                    <LogOut />
                    Leave organization
                  </DropdownMenuItem>
                ) : (
                  canRemoveMember && (
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() =>
                        setRemoveOpen(
                          true
                        )
                      }
                    >
                      <Trash2 />
                      Remove
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {isCurrentUser ? (
        <LeaveOrganizationDialog
          open={leaveOpen}
          onOpenChange={
            setLeaveOpen
          }
          organization={
            organization
          }
        />
      ) : (
        canRemoveMember && (
          <RemoveMemberDialog
            open={removeOpen}
            onOpenChange={
              setRemoveOpen
            }
            member={member}
          />
        )
      )}
    </>
  )
}
