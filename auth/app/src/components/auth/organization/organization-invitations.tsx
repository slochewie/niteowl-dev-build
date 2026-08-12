"use client"

import type { OrganizationLocalization } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useListOrganizationInvitations
} from "@better-auth-ui/react"
import { ChevronUp, Filter, Search, X } from "lucide-react"
import { type ComponentProps, type ReactNode, useMemo, useState } from "react"

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "#/components/ui/table.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { cn } from "#/lib/utils.ts"
import { InviteMemberDialog } from "./invite-member-dialog"
import { OrganizationInvitationRow } from "./organization-invitation-row"
import { OrganizationInvitationRowSkeleton } from "./organization-invitation-row-skeleton"
import { OrganizationInvitationsEmpty } from "./organization-invitations-empty"

type SortDirection = "ascending" | "descending"

type SortDescriptor = {
  column: string
  direction: SortDirection
}

/** Props for the `OrganizationInvitations` component. */
export type OrganizationInvitationsProps = {
  className?: string
}

/**
 * Organization invitations table with status filtering and per-row actions.
 */
export function OrganizationInvitations({
  className,
  ...props
}: OrganizationInvitationsProps & ComponentProps<"div">) {
  const { authClient, localization } = useAuth()
  const { localization: organizationLocalization } =
    useAuthPlugin(organizationPlugin)

  const { data: invitations, isPending: invitationsPending } =
    useListOrganizationInvitations(authClient as OrganizationAuthClient)

  const { isPending: invitationPermissionPending } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: { invitation: ["cancel"] }
    }
  )

  const isPending =
    invitationsPending ||
    invitationPermissionPending

  const [sortDescriptor, setSortDescriptor] =
    useState<SortDescriptor>()

  const [statusFilter, setStatusFilter] =
    useState("all")

  const [search, setSearch] =
    useState("")

  const [inviteOpen, setInviteOpen] =
    useState(false)

  const filteredInvitations = useMemo(() => {
    return invitations?.filter(
      (invitation) =>
        (statusFilter === "all" ||
          invitation.status === statusFilter) &&
        invitation.email
          .toLowerCase()
          .includes(search.toLowerCase())
    )
  }, [
    search,
    invitations,
    statusFilter
  ])

  const sortedInvitations = useMemo(() => {
    if (!sortDescriptor) {
      return filteredInvitations
    }

    if (!filteredInvitations) {
      return filteredInvitations
    }

    return [...filteredInvitations].sort(
      (a, b) => {
        const col =
          sortDescriptor.column as keyof typeof a

        let cmp = 0

        if (col === "createdAt") {
          cmp =
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        } else {
          cmp = String(a[col]).localeCompare(
            String(b[col])
          )
        }

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
    filteredInvitations
  ])

  function toggleSort(column: string) {
    setSortDescriptor((current) => {
      if (current?.column !== column) {
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
      <h3 className="truncate text-sm font-semibold">
        {organizationLocalization.invitations}
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <InputGroup className="min-w-0 sm:w-[220px]">
            <InputGroupInput
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
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
              {organizationLocalization.status}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <DropdownMenuRadioItem value="all">
                  {organizationLocalization.all}
                </DropdownMenuRadioItem>

                {([
                  "pending",
                  "accepted",
                  "rejected",
                  "canceled"
                ] as const).map((status) => (
                  <DropdownMenuRadioItem
                    key={status}
                    value={status}
                  >
                    {organizationLocalization[
                      status as keyof OrganizationLocalization
                    ] ?? status}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {statusFilter !== "all" && (
          <Badge
            variant="secondary"
            className="w-fit gap-1"
          >
            {organizationLocalization.status}:{" "}
            {organizationLocalization[
              statusFilter as keyof OrganizationLocalization
            ] ?? statusFilter}

            <Button
              aria-label={
                organizationLocalization.clear
              }
              className="size-4 rounded-sm text-muted-foreground"
              onClick={() =>
                setStatusFilter("all")
              }
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <X className="size-3" />
            </Button>
          </Badge>
        )}

        <Card className="p-0">
          <Table
            className="table-fixed"
            aria-label={
              organizationLocalization.invitations
            }
          >
            <colgroup>
              <col className="w-[38%] sm:w-[30%]" />
              <col className="w-[19%] sm:w-[20%]" />
              <col className="w-[14%] sm:w-[16%]" />
              <col className="w-[24%] sm:w-[24%]" />
              <col className="w-[5%] sm:w-[10%]" />
            </colgroup>

            <TableHeader>
              <TableRow>
                <SortableTableHead
                  className="w-[30%]"
                  sortDirection={
                    sortDescriptor?.column ===
                    "email"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort("email")
                  }
                >
                  {localization.auth.email}
                </SortableTableHead>

                <SortableTableHead
                  className="w-[20%]"
                  sortDirection={
                    sortDescriptor?.column ===
                    "createdAt"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort("createdAt")
                  }
                >
                  {organizationLocalization.invitedAt}
                </SortableTableHead>

                <SortableTableHead
                  className="w-[16%]"
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
                  {organizationLocalization.role}
                </SortableTableHead>

                <SortableTableHead
                  className="w-[24%]"
                  sortDirection={
                    sortDescriptor?.column ===
                    "status"
                      ? sortDescriptor.direction
                      : undefined
                  }
                  onClick={() =>
                    toggleSort("status")
                  }
                >
                  {organizationLocalization.status}
                </SortableTableHead>

                <TableHead className="w-[5%] text-end sm:w-[10%]">
                  <span className="sr-only sm:not-sr-only">
                    {organizationLocalization.actions}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ? (
                <OrganizationInvitationRowSkeleton />
              ) : !sortedInvitations?.length ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <OrganizationInvitationsEmpty
                      onInvitePress={() =>
                        setInviteOpen(true)
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                sortedInvitations.map(
                  (invitation) => (
                    <OrganizationInvitationRow
                      key={invitation.id}
                      invitation={invitation}
                    />
                  )
                )
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  )
}

function SortableTableHead({
  children,
  sortDirection,
  onClick,
  className
}: {
  children: ReactNode
  sortDirection?: SortDirection
  onClick: () => void
  className?: string
}) {
  return (
    <TableHead
      className={className}
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
              sortDirection === "descending"
                ? "rotate-180"
                : ""
            )}
          />
        )}
      </Button>
    </TableHead>
  )
}
