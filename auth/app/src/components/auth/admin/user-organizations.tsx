"use client"

import {
  Building2,
  ChevronDown,
  Plus,
  Trash2
} from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldLabel
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@/components/ui/item"

import type {
  AdminUserOrganization
} from "@/lib/admin/users"
import type {
  AdminOrganizationOption
} from "@/lib/admin/user-organizations"
import {
  addUserToOrganization,
  removeUserFromOrganization,
  updateUserOrganizationRole
} from "@/lib/admin/user-organizations"

type OrganizationRole =
  | "member"
  | "admin"
  | "owner"

type UserOrganizationsProps = {
  userId: string
  organizations:
    AdminUserOrganization[]
  allOrganizations:
    AdminOrganizationOption[]
}

export function UserOrganizations({
  userId,
  organizations,
  allOrganizations
}: UserOrganizationsProps) {
  const navigate = useNavigate()

  const [addOpen, setAddOpen] =
    useState(false)

  const [selectedOrganizationId,
    setSelectedOrganizationId] =
    useState("")

  const [
    selectedRole,
    setSelectedRole
  ] = useState<OrganizationRole>(
    "member"
  )

  const [pending, setPending] =
    useState(false)

  const availableOrganizations =
    useMemo(() => {
      const currentIds =
        new Set(
          organizations.map(
            (organization) =>
              organization.id
          )
        )

      return allOrganizations.filter(
        (organization) =>
          !currentIds.has(
            organization.id
          )
      )
    }, [
      organizations,
      allOrganizations
    ])

  async function refresh() {
    await navigate({
      to: "/users/$userId",
      params: {
        userId
      },
      replace: true
    })
  }

  async function addMembership() {
    if (!selectedOrganizationId) {
      return
    }

    setPending(true)

    try {
      await addUserToOrganization({
        data: {
          userId,
          organizationId:
            selectedOrganizationId,
          role: selectedRole
        }
      })

      toast.success(
        "User added to organization"
      )

      setAddOpen(false)
      setSelectedOrganizationId("")
      setSelectedRole("member")

      await refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add user to organization"
      )
    } finally {
      setPending(false)
    }
  }

  async function updateRole(
    organization:
      AdminUserOrganization,
    role: OrganizationRole
  ) {
    setPending(true)

    try {
      await updateUserOrganizationRole({
        data: {
          memberId:
            organization.memberId,
          organizationId:
            organization.id,
          role
        }
      })

      toast.success(
        "Organization role updated"
      )

      await refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update role"
      )
    } finally {
      setPending(false)
    }
  }

  async function removeMembership(
    organization:
      AdminUserOrganization
  ) {
    setPending(true)

    try {
      await removeUserFromOrganization({
        data: {
          memberId:
            organization.memberId,
          organizationId:
            organization.id
        }
      })

      toast.success(
        "User removed from organization"
      )

      await refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove user from organization"
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>
              Organizations
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage this user's organization memberships and roles
            </p>
          </div>

          <Button
            size="sm"
            disabled={
              availableOrganizations.length ===
              0
            }
            onClick={() =>
              setAddOpen(true)
            }
          >
            <Plus />
            Add to Organization
          </Button>
        </CardHeader>

        <CardContent>
          {organizations.length ===
          0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Not a member of any organizations
            </div>
          ) : (
            <ItemGroup className="gap-0">
              {organizations.map(
                (
                  organization,
                  index
                ) => (
                  <div
                    key={
                      organization.id
                    }
                  >
                    {index > 0 && (
                      <ItemSeparator />
                    )}

                    <Item>
                      <ItemMedia variant="icon">
                        <Building2 />
                      </ItemMedia>

                      <ItemContent>
                        <ItemTitle className="flex flex-wrap items-center gap-2">
                          {
                            organization.name
                          }

                          <Badge variant="outline">
                            {
                              organization.role
                            }
                          </Badge>
                        </ItemTitle>

                        <ItemDescription>
                          {
                            organization.slug
                          }
                          {" · Joined "}
                          {formatDate(
                            organization.joinedAt
                          )}
                        </ItemDescription>
                      </ItemContent>

                      <ItemActions className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                pending
                              }
                            >
                              {
                                organization.role
                              }

                              <ChevronDown />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                          >
                            <DropdownMenuItem
                              disabled={
                                organization.role ===
                                "member"
                              }
                              onClick={() =>
                                void updateRole(
                                  organization,
                                  "member"
                                )
                              }
                            >
                              Member
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={
                                organization.role ===
                                "admin"
                              }
                              onClick={() =>
                                void updateRole(
                                  organization,
                                  "admin"
                                )
                              }
                            >
                              Admin
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={
                                organization.role ===
                                "owner"
                              }
                              onClick={() =>
                                void updateRole(
                                  organization,
                                  "owner"
                                )
                              }
                            >
                              Owner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          disabled={pending}
                          onClick={() =>
                            void removeMembership(
                              organization
                            )
                          }
                          aria-label={`Remove from ${organization.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </ItemActions>
                    </Item>
                  </div>
                )
              )}
            </ItemGroup>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={addOpen}
        onOpenChange={setAddOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add to Organization
            </DialogTitle>

            <DialogDescription>
              Add this user directly to an existing organization.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <Field>
              <FieldLabel>
                Organization
              </FieldLabel>

              <Select
                value={
                  selectedOrganizationId
                }
                onValueChange={
                  setSelectedOrganizationId
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>

                <SelectContent>
                  {availableOrganizations.map(
                    (organization) => (
                      <SelectItem
                        key={
                          organization.id
                        }
                        value={
                          organization.id
                        }
                      >
                        {
                          organization.name
                        }
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>
                Role
              </FieldLabel>

              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(
                    value as OrganizationRole
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="member">
                    Member
                  </SelectItem>

                  <SelectItem value="admin">
                    Admin
                  </SelectItem>

                  <SelectItem value="owner">
                    Owner
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setAddOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              disabled={
                pending ||
                !selectedOrganizationId
              }
              onClick={() =>
                void addMembership()
              }
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(
    new Date(value)
  )
}
