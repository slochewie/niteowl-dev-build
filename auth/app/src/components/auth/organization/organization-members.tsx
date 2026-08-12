import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationMembers,
  useSession
} from "@better-auth-ui/react"
import type { Member } from "better-auth/client"
import { ChevronUp, Filter, Search, X } from "lucide-react"
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState
} from "react"

import { Badge } from "#/components/ui/badge.tsx"
import { Button, buttonVariants } from "#/components/ui/button.tsx"
import { Card } from "#/components/ui/card.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "#/components/ui/dropdown-menu.tsx"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "#/components/ui/input-group.tsx"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "#/components/ui/table.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { cn } from "#/lib/utils.ts"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationMemberRow } from "./organization-member-row"
import { OrganizationMemberRowSkeleton } from "./organization-member-row-skeleton"

type SortDirection = "ascending" | "descending"

type SortDescriptor = {
  column: string
  direction: SortDirection
}

type MemberStatus = {
  banned: boolean
  banReason: string | null
}

type StatusFilter = "all" | "active" | "banned"

/** Props for the `OrganizationMembers` component. */
export type OrganizationMembersProps = {
  className?: string
}

/**
 * Organization members table with filtering, sorting, status,
 * and permission-aware management controls.
 *
 * Users without member:update permission:
 * - only see active members
 * - do not see status filtering controls
 * - cannot invite members
 */
export function OrganizationMembers({
  className,
  ...props
}: OrganizationMembersProps & ComponentProps<"div">) {
  const { authClient } = useAuth()

  const {
    localization: organizationLocalization,
    roles
  } = useAuthPlugin(organizationPlugin)

  const organizationAuthClient =
    authClient as OrganizationAuthClient

  const { data: session } = useSession(authClient)

  const {
    data: activeOrganization,
    isPending: activeOrganizationPending
  } = useActiveOrganization(organizationAuthClient)

  const {
    data: membersData,
    isPending: membersPending
  } = useListOrganizationMembers(
    organizationAuthClient
  )

  const {
    data: updatePermission,
    isPending: updatePermissionPending
  } = useHasPermission(
    organizationAuthClient,
    {
      permissions: {
        member: ["update"]
      }
    }
  )

  const {
    isPending: deletePermissionPending
  } = useHasPermission(
    organizationAuthClient,
    {
      permissions: {
        member: ["delete"]
      }
    }
  )

  const canManageMembers =
    updatePermission?.success === true

  const [memberStatus, setMemberStatus] =
    useState<Record<string, MemberStatus>>({})

  const [statusPending, setStatusPending] =
    useState(false)

  const [sortDescriptor, setSortDescriptor] =
    useState<SortDescriptor>()

  const [roleFilter, setRoleFilter] =
    useState("all")

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all")

  const [search, setSearch] =
    useState("")

  const [inviteOpen, setInviteOpen] =
    useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMemberStatus() {
      if (!activeOrganization?.id) {
        setMemberStatus({})
        setStatusPending(false)
        return
      }

      setStatusPending(true)

      try {
        const response = await fetch(
          `/api/auth/seven-shifts/member-status?organizationId=${encodeURIComponent(
            activeOrganization.id
          )}`,
          {
            credentials: "include"
          }
        )

        if (!response.ok) {
          throw new Error(
            `Unable to load member status: HTTP ${response.status}`
          )
        }

        const data =
          (await response.json()) as {
            users?: Record<
              string,
              MemberStatus
            >
          }

        if (!cancelled) {
          setMemberStatus(
            data.users ?? {}
          )
        }
      } catch (error) {
        console.error(error)

        if (!cancelled) {
          setMemberStatus({})
        }
      } finally {
        if (!cancelled) {
          setStatusPending(false)
        }
      }
    }

    void loadMemberStatus()

    return () => {
      cancelled = true
    }
  }, [activeOrganization?.id])

  const isPending =
    activeOrganizationPending ||
    membersPending ||
    updatePermissionPending ||
    deletePermissionPending ||
    statusPending

  const filteredMembers = useMemo(() => {
    return membersData?.members.filter(
      (member) => {
        const status =
          memberStatus[member.userId]

        const banned =
          status?.banned === true

        /*
         * Users without member:update permission
         * never see banned/deactivated members.
         */
        if (
          !canManageMembers &&
          banned
        ) {
          return false
        }

        const matchesRole =
          roleFilter === "all" ||
          member.role === roleFilter

        /*
         * Status filtering is only available to
         * users who can manage members.
         */
        const matchesStatus =
          !canManageMembers ||
          statusFilter === "all" ||
          (statusFilter === "active" &&
            !banned) ||
          (statusFilter === "banned" &&
            banned)

        const searchValue =
          search.toLowerCase()

        const matchesSearch =
          member.user.name
            .toLowerCase()
            .includes(searchValue) ||
          member.user.email
            .toLowerCase()
            .includes(searchValue)

        return (
          matchesRole &&
          matchesStatus &&
          matchesSearch
        )
      }
    )
  }, [
    search,
    membersData?.members,
    roleFilter,
    statusFilter,
    memberStatus,
    canManageMembers
  ])

  const sortedMembers = useMemo(() => {
    if (
      !sortDescriptor ||
      !filteredMembers
    ) {
      return filteredMembers
    }

    return [...filteredMembers].sort(
      (a, b) => {
        let first: string
        let second: string

        if (
          sortDescriptor.column ===
          "user"
        ) {
          first =
            a.user.name || a.user.email

          second =
            b.user.name || b.user.email
        } else if (
          sortDescriptor.column ===
          "status"
        ) {
          first =
            memberStatus[a.userId]
              ?.banned === true
              ? "banned"
              : "active"

          second =
            memberStatus[b.userId]
              ?.banned === true
              ? "banned"
              : "active"
        } else {
          const col =
            sortDescriptor.column as keyof Member

          first = String(a[col])
          second = String(b[col])
        }

        let cmp =
          first.localeCompare(second)

        if (
          sortDescriptor.direction ===
          "descending"
        ) {
          cmp *= -1
        }

        return cmp
      }
    )
  }, [
    sortDescriptor,
    filteredMembers,
    memberStatus
  ])

  const isOwner =
    membersData?.members.some(
      (member) =>
        member.role === "owner" &&
        member.userId ===
          session?.user.id
    )

  function toggleSort(column: string) {
    setSortDescriptor((current) => {
      if (
        current?.column !== column
      ) {
        return {
          column,
          direction: "ascending"
        }
      }

      if (
        current.direction ===
        "ascending"
      ) {
        return {
          column,
          direction: "descending"
        }
      }

      return undefined
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        className
      )}
      {...props}
    >
      <div className="flex items-end justify-between gap-3">
        <h3 className="truncate text-sm font-semibold">
          {
            organizationLocalization.members
          }
        </h3>

        {canManageMembers && (
          <Button
            className="shrink-0"
            size="sm"
            disabled={isPending}
            onClick={() =>
              setInviteOpen(true)
            }
          >
            {
              organizationLocalization.inviteMember
            }
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="min-w-0 sm:w-[220px]">
            <InputGroupInput
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              aria-label={
                organizationLocalization.search
              }
              placeholder={
                organizationLocalization.search
              }
              disabled={isPending}
            />

            <InputGroupAddon>
              <Search className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "outline"
                })
              )}
              disabled={isPending}
            >
              <Filter />

              {
                organizationLocalization.role
              }
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={roleFilter}
                onValueChange={
                  setRoleFilter
                }
              >
                <DropdownMenuRadioItem value="all">
                  {
                    organizationLocalization.all
                  }
                </DropdownMenuRadioItem>

                {Object.entries(
                  roles
                ).map(
                  ([role, label]) => (
                    <DropdownMenuRadioItem
                      key={role}
                      value={role}
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  )
                )}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {canManageMembers && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "outline"
                  })
                )}
                disabled={isPending}
              >
                <Filter />
                Status
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(
                    value
                  ) =>
                    setStatusFilter(
                      value as StatusFilter
                    )
                  }
                >
                  <DropdownMenuRadioItem value="all">
                    All
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="active">
                    Active
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="banned">
                    Banned
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {roleFilter !== "all" && (
            <Badge
              variant="secondary"
              className="w-fit gap-1"
            >
              {
                organizationLocalization.role
              }
              :{" "}
              <span className="capitalize">
                {roles?.[
                  roleFilter
                ] ?? roleFilter}
              </span>

              <Button
                aria-label={
                  organizationLocalization.clear
                }
                className="size-4 rounded-sm text-muted-foreground"
                onClick={() =>
                  setRoleFilter(
                    "all"
                  )
                }
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}

          {canManageMembers &&
            statusFilter !== "all" && (
              <Badge
                variant="secondary"
                className="w-fit gap-1"
              >
                Status:{" "}

                <span className="capitalize">
                  {statusFilter}
                </span>

                <Button
                  aria-label="Clear status filter"
                  className="size-4 rounded-sm text-muted-foreground"
                  onClick={() =>
                    setStatusFilter(
                      "all"
                    )
                  }
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}
        </div>

        <Card className="p-0">
          <Table
            aria-label={
              organizationLocalization.members
            }
          >
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  sortDirection={
                    sortDescriptor?.column ===
                    "user"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort("user")
                  }
                >
                  {
                    organizationLocalization.member
                  }
                </SortableTableHead>

                <SortableTableHead
                  sortDirection={
                    sortDescriptor?.column ===
                    "role"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort("role")
                  }
                >
                  {
                    organizationLocalization.role
                  }
                </SortableTableHead>

                <SortableTableHead
                  sortDirection={
                    sortDescriptor?.column ===
                    "status"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort(
                      "status"
                    )
                  }
                >
                  Status
                </SortableTableHead>

                <TableHead className="text-end">
                  {
                    organizationLocalization.actions
                  }
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ? (
                <OrganizationMemberRowSkeleton />
              ) : (
                !!activeOrganization &&
                sortedMembers?.map(
                  (member) => {
                    const status =
                      memberStatus[
                        member.userId
                      ]

                    return (
                      <OrganizationMemberRow
                        key={
                          member.id
                        }
                        member={
                          member
                        }
                        isOwner={
                          isOwner
                        }
                        organization={
                          activeOrganization
                        }
                        banned={
                          status?.banned ===
                          true
                        }
                        banReason={
                          status?.banReason ??
                          null
                        }
                      />
                    )
                  }
                )
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {canManageMembers && (
        <InviteMemberDialog
          open={inviteOpen}
          onOpenChange={
            setInviteOpen
          }
        />
      )}
    </div>
  )
}

function SortableTableHead({
  children,
  sortDirection,
  onClick
}: {
  children: ReactNode
  sortDirection?: SortDirection
  onClick: () => void
}) {
  return (
    <TableHead
      aria-sort={
        sortDirection ?? "none"
      }
    >
      <Button
        className="h-auto w-full justify-start p-0 font-medium hover:bg-transparent"
        onClick={onClick}
        size="sm"
        type="button"
        variant="ghost"
      >
        {children}

        {!!sortDirection && (
          <ChevronUp
            className={cn(
              "size-3 transition-transform duration-100 ease-out",
              sortDirection ===
                "descending"
                ? "rotate-180"
                : ""
            )}
          />
        )}
      </Button>
    </TableHead>
  )
}
