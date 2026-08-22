"use client"

import {
  ArrowDownNarrowWide,
  Building2,
  CalendarDays,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Search,
  UserPlus
} from "lucide-react"
import type {
  DateRange
} from "react-day-picker"
import {
  useMemo,
  useState
} from "react"
import {
  useNavigate
} from "@tanstack/react-router"

import { UserAvatar } from "@/components/auth/user/user-avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type {
  AdminOrganizationListItem
} from "@/lib/admin/organizations"

type SortMode =
  | "created-desc"
  | "created-asc"
  | "name-desc"
  | "name-asc"
  | "members-desc"
  | "members-asc"

type CreatedFilter =
  | "all"
  | "24h"
  | "7d"
  | "30d"
  | "90d"

type MemberFilter =
  | "all"
  | "zero"
  | "one"
  | "more-than-one"
  | "more-than-five"
  | "more-than-ten"

type RowsPerPage =
  | 20
  | 50
  | 100

export function OrganizationsTable({
  organizations
}: {
  organizations:
    AdminOrganizationListItem[]
}) {
  const navigate = useNavigate()

  const [search, setSearch] =
    useState("")

  const [sortMode, setSortMode] =
    useState<SortMode>(
      "created-desc"
    )

  const [
    createdFilter,
    setCreatedFilter
  ] = useState<CreatedFilter>(
    "all"
  )

  const [
    memberFilter,
    setMemberFilter
  ] = useState<MemberFilter>(
    "all"
  )

  const [
    dateRange,
    setDateRange
  ] = useState<
    DateRange | undefined
  >()

  const [
    rowsPerPage,
    setRowsPerPage
  ] = useState<RowsPerPage>(
    20
  )

  const [
    currentPage,
    setCurrentPage
  ] = useState(1)

  const activeFilterCount =
    Number(
      createdFilter !== "all"
    ) +
    Number(
      memberFilter !== "all"
    ) +
    Number(
      Boolean(
        dateRange?.from ||
        dateRange?.to
      )
    )

  const filteredOrganizations =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      const now =
        Date.now()

      const result =
        organizations.filter(
          (organization) => {
            const matchesSearch =
              query.length === 0 ||
              organization.name
                .toLowerCase()
                .includes(query) ||
              organization.slug
                .toLowerCase()
                .includes(query) ||
              organization.id
                .toLowerCase()
                .includes(query)

            const createdAt =
              new Date(
                organization.createdAt
              ).getTime()

            let matchesCreated =
              true

            switch (
              createdFilter
            ) {
              case "24h":
                matchesCreated =
                  createdAt >=
                  now -
                    24 *
                      60 *
                      60 *
                      1000
                break

              case "7d":
                matchesCreated =
                  createdAt >=
                  now -
                    7 *
                      24 *
                      60 *
                      60 *
                      1000
                break

              case "30d":
                matchesCreated =
                  createdAt >=
                  now -
                    30 *
                      24 *
                      60 *
                      60 *
                      1000
                break

              case "90d":
                matchesCreated =
                  createdAt >=
                  now -
                    90 *
                      24 *
                      60 *
                      60 *
                      1000
                break
            }

            let matchesDateRange =
              true

            if (dateRange?.from) {
              const from =
                new Date(
                  dateRange.from
                )

              from.setHours(
                0,
                0,
                0,
                0
              )

              matchesDateRange =
                matchesDateRange &&
                createdAt >=
                  from.getTime()
            }

            if (dateRange?.to) {
              const to =
                new Date(
                  dateRange.to
                )

              to.setHours(
                23,
                59,
                59,
                999
              )

              matchesDateRange =
                matchesDateRange &&
                createdAt <=
                  to.getTime()
            }

            let matchesMembers =
              true

            switch (
              memberFilter
            ) {
              case "zero":
                matchesMembers =
                  organization.memberCount ===
                  0
                break

              case "one":
                matchesMembers =
                  organization.memberCount ===
                  1
                break

              case "more-than-one":
                matchesMembers =
                  organization.memberCount >
                  1
                break

              case "more-than-five":
                matchesMembers =
                  organization.memberCount >
                  5
                break

              case "more-than-ten":
                matchesMembers =
                  organization.memberCount >
                  10
                break
            }

            return (
              matchesSearch &&
              matchesCreated &&
              matchesDateRange &&
              matchesMembers
            )
          }
        )

      return [...result].sort(
        (a, b) => {
          switch (sortMode) {
            case "created-asc":
              return (
                new Date(
                  a.createdAt
                ).getTime() -
                new Date(
                  b.createdAt
                ).getTime()
              )

            case "name-desc":
              return b.name.localeCompare(
                a.name
              )

            case "name-asc":
              return a.name.localeCompare(
                b.name
              )

            case "members-desc":
              return (
                b.memberCount -
                a.memberCount
              )

            case "members-asc":
              return (
                a.memberCount -
                b.memberCount
              )

            case "created-desc":
            default:
              return (
                new Date(
                  b.createdAt
                ).getTime() -
                new Date(
                  a.createdAt
                ).getTime()
              )
          }
        }
      )
    }, [
      organizations,
      search,
      sortMode,
      createdFilter,
      memberFilter,
      dateRange
    ])

  const pageCount =
    Math.max(
      1,
      Math.ceil(
        filteredOrganizations.length /
          rowsPerPage
      )
    )

  const safePage =
    Math.min(
      currentPage,
      pageCount
    )

  const startIndex =
    (safePage - 1) *
    rowsPerPage

  const visibleOrganizations =
    filteredOrganizations.slice(
      startIndex,
      startIndex +
        rowsPerPage
    )

  const showingFrom =
    filteredOrganizations.length ===
    0
      ? 0
      : startIndex + 1

  const showingTo =
    Math.min(
      startIndex +
        rowsPerPage,
      filteredOrganizations.length
    )

  function resetPage() {
    setCurrentPage(1)
  }

  function resetFilters() {
    setCreatedFilter("all")
    setMemberFilter("all")
    setDateRange(undefined)
    setCurrentPage(1)
  }

  function updateDateRange(
    value: DateRange | undefined
  ) {
    setDateRange(value)
    resetPage()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        {showingFrom}
        {"-"}
        {showingTo} of{" "}
        {filteredOrganizations.length}{" "}
        {filteredOrganizations.length ===
        1
          ? "organization"
          : "organizations"}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                )

                resetPage()
              }}
              className="pl-9"
              placeholder="Search organizations..."
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
            >
              <Button
                variant="outline"
                className="justify-start"
              >
                <ArrowDownNarrowWide />

                Sort By:{" "}
                {sortMode.startsWith(
                  "created"
                )
                  ? "Created"
                  : sortMode.startsWith(
                        "name"
                      )
                    ? "Name"
                    : "Members"}

                <ChevronDown className="ml-1 size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
            >
              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "created-desc"
                  )
                }
              >
                Created (Newest)
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "created-asc"
                  )
                }
              >
                Created (Oldest)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "name-desc"
                  )
                }
              >
                Name (Z–A)
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "name-asc"
                  )
                }
              >
                Name (A–Z)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "members-desc"
                  )
                }
              >
                Members (Most)
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  setSortMode(
                    "members-asc"
                  )
                }
              >
                Members (Fewest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger
              asChild
            >
              <Button variant="outline">
                <Filter />

                Filter

                {activeFilterCount >
                  0 && (
                  <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums">
                    {
                      activeFilterCount
                    }
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-[280px] p-0"
            >
              <div className="px-4 py-3 font-medium">
                Filter Organizations
              </div>

              <div className="border-t" />

              <div className="space-y-3 p-4">
                <div className="text-sm font-medium">
                  Created
                </div>

                <Select
                  value={
                    createdFilter
                  }
                  onValueChange={(
                    value
                  ) => {
                    setCreatedFilter(
                      value as CreatedFilter
                    )

                    resetPage()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Time
                    </SelectItem>

                    <SelectItem value="24h">
                      Last 24 Hours
                    </SelectItem>

                    <SelectItem value="7d">
                      Last 7 Days
                    </SelectItem>

                    <SelectItem value="30d">
                      Last 30 Days
                    </SelectItem>

                    <SelectItem value="90d">
                      Last 90 Days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t" />

              <div className="space-y-3 p-4">
                <div className="text-sm font-medium">
                  Date Range
                </div>

                <Popover>
                  <PopoverTrigger
                    asChild
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      <CalendarDays />

                      <span
                        className={
                          dateRange?.from
                            ? ""
                            : "text-muted-foreground"
                        }
                      >
                        {formatDateRange(
                          dateRange
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="w-auto p-0"
                  >
                    <Calendar
                      mode="range"
                      selected={
                        dateRange
                      }
                      onSelect={
                        updateDateRange
                      }
                      defaultMonth={
                        dateRange?.from
                      }
                      numberOfMonths={
                        1
                      }
                    />

                    {dateRange?.from && (
                      <div className="flex items-center justify-between gap-3 border-t p-3">
                        <span className="text-xs text-muted-foreground">
                          {dateRange.to
                            ? "Date range selected"
                            : "Select an end date"}
                        </span>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateDateRange(
                              undefined
                            )
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="border-t" />

              <div className="space-y-3 p-4">
                <div className="text-sm font-medium">
                  Members
                </div>

                <Select
                  value={
                    memberFilter
                  }
                  onValueChange={(
                    value
                  ) => {
                    setMemberFilter(
                      value as MemberFilter
                    )

                    resetPage()
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      Any number
                    </SelectItem>

                    <SelectItem value="zero">
                      0 members (Abandoned)
                    </SelectItem>

                    <SelectItem value="one">
                      1 member
                    </SelectItem>

                    <SelectItem value="more-than-one">
                      More than 1 member
                    </SelectItem>

                    <SelectItem value="more-than-five">
                      More than 5 members
                    </SelectItem>

                    <SelectItem value="more-than-ten">
                      More than 10 members
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t" />

              <div className="space-y-3 p-4">
                <div className="text-sm font-medium">
                  Display
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm">
                    Rows per page
                  </span>

                  <Select
                    value={String(
                      rowsPerPage
                    )}
                    onValueChange={(
                      value
                    ) => {
                      setRowsPerPage(
                        Number(
                          value
                        ) as RowsPerPage
                      )

                      setCurrentPage(
                        1
                      )
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="20">
                        20
                      </SelectItem>

                      <SelectItem value="50">
                        50
                      </SelectItem>

                      <SelectItem value="100">
                        100
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t" />

              <div className="flex items-center justify-between gap-4 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 font-medium"
                  disabled={
                    activeFilterCount ===
                    0
                  }
                  onClick={
                    resetFilters
                  }
                >
                  Reset All
                </Button>

                <span className="text-sm text-muted-foreground">
                  {
                    activeFilterCount
                  }{" "}
                  {activeFilterCount ===
                  1
                    ? "filter"
                    : "filters"}{" "}
                  active
                </span>
              </div>
            </PopoverContent>
          </Popover>

          <Button>
            <UserPlus />
            Add Organization
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>
                Organization
              </TableHead>

              <TableHead>
                Created
              </TableHead>

              <TableHead>
                Members
              </TableHead>

              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleOrganizations.length ===
            0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No organizations found.
                </TableCell>
              </TableRow>
            ) : (
              visibleOrganizations.map(
                (organization) => (
                  <TableRow
                    key={
                      organization.id
                    }
                    className="cursor-pointer"
                    onClick={() =>
                      void navigate({
                        to: "/organizations/$organizationId",
                        params: {
                          organizationId:
                            organization.id
                        }
                      })
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                          {organization.logo ? (
                            <img
                              src={
                                organization.logo
                              }
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <Building2 className="size-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {
                              organization.name
                            }
                          </div>

                          <div className="truncate text-sm text-muted-foreground">
                            {
                              organization.slug
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div>
                        {formatDate(
                          organization.createdAt
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {timeAgo(
                          organization.createdAt
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">
                          {
                            organization.memberCount
                          }
                        </span>

                        <div className="flex -space-x-2">
                          {organization.members
                            .slice(0, 5)
                            .map(
                              (member) => (
                                <UserAvatar
                                  key={
                                    member.id
                                  }
                                  user={{
                                    id:
                                      member.id,
                                    name:
                                      member.name,
                                    email:
                                      member.email,
                                    image:
                                      member.image ??
                                      undefined,
                                    emailVerified:
                                      false,
                                    createdAt:
                                      new Date(),
                                    updatedAt:
                                      new Date()
                                  }}
                                  className="size-7 border-2 border-background"
                                />
                              )
                            )}

                          {organization.memberCount >
                            5 && (
                            <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] text-muted-foreground">
                              +
                              {organization.memberCount -
                                5}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreHorizontal />

                        <span className="sr-only">
                          Organization actions
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={
              safePage <= 1
            }
            onClick={() =>
              setCurrentPage(
                Math.max(
                  1,
                  safePage - 1
                )
              )
            }
          >
            Previous
          </Button>

          <span className="px-2 text-sm text-muted-foreground">
            Page{" "}
            {safePage} of{" "}
            {pageCount}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={
              safePage >=
              pageCount
            }
            onClick={() =>
              setCurrentPage(
                Math.min(
                  pageCount,
                  safePage + 1
                )
              )
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

function formatDateRange(
  range:
    | DateRange
    | undefined
) {
  if (!range?.from) {
    return "Select date range"
  }

  const formatter =
    new Intl.DateTimeFormat(
      undefined,
      {
        month: "short",
        day: "numeric"
      }
    )

  if (!range.to) {
    return formatter.format(
      range.from
    )
  }

  return `${formatter.format(
    range.from
  )} – ${formatter.format(
    range.to
  )}`
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

function timeAgo(
  value: Date
) {
  const then =
    new Date(value).getTime()

  const seconds =
    Math.max(
      0,
      Math.floor(
        (Date.now() - then) /
          1000
      )
    )

  const units:
    Array<
      [
        Intl.RelativeTimeFormatUnit,
        number
      ]
    > = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60]
    ]

  const formatter =
    new Intl.RelativeTimeFormat(
      undefined,
      {
        numeric: "auto"
      }
    )

  for (
    const [unit, amount]
    of units
  ) {
    if (seconds >= amount) {
      return formatter.format(
        -Math.floor(
          seconds / amount
        ),
        unit
      )
    }
  }

  return "just now"
}
