"use client"

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown
} from "lucide-react"
import {
  useEffect,
  useMemo,
  useState
} from "react"

import {
  Badge
} from "@/components/ui/badge"
import {
  Button
} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
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

import {
  getAdminUnifiAccessUsers,
  type AdminUnifiAccessUser
} from "@/lib/admin/plugins"

const PAGE_SIZE =
  10

type SortBy =
  | "name"
  | "email"
  | "employeeNumber"
  | "status"

type SortDirection =
  | "asc"
  | "desc"

type StatusFilter =
  | "all"
  | "active"
  | "deactivated"

type UsersPage = {
  users:
    AdminUnifiAccessUser[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export function UnifiAccessUsers({
  sourceId,
  sourceName,
  refreshKey
}: {
  sourceId: string
  sourceName: string
  refreshKey: number
}) {
  const [
    page,
    setPage
  ] = useState(1)

  const [
    sortBy,
    setSortBy
  ] = useState<SortBy>(
    "name"
  )

  const [
    sortDirection,
    setSortDirection
  ] = useState<SortDirection>(
    "asc"
  )

  const [
    statusFilter,
    setStatusFilter
  ] = useState<StatusFilter>(
    "all"
  )

  const [
    result,
    setResult
  ] = useState<
    UsersPage | null
  >(null)

  const [
    loading,
    setLoading
  ] = useState(false)

  const [
    error,
    setError
  ] = useState<
    string | null
  >(null)

  useEffect(() => {
    setPage(1)
    setResult(null)
    setError(null)
  }, [
    sourceId
  ])

  useEffect(() => {
    let cancelled =
      false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const response =
          await getAdminUnifiAccessUsers({
            data: {
              sourceId,
              page,
              pageSize:
                PAGE_SIZE,
              sortBy,
              sortDirection,
              status:
                statusFilter
            }
          })

        if (cancelled) {
          return
        }

        setResult({
          users:
            response.users,
          pagination:
            response.pagination
        })

        if (
          response.pagination.page !==
          page
        ) {
          setPage(
            response.pagination.page
          )
        }
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load cached UniFi Access users"
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [
    sourceId,
    page,
    sortBy,
    sortDirection,
    statusFilter,
    refreshKey
  ])

  function toggleSort(
    column: SortBy
  ) {
    setPage(1)

    if (
      sortBy ===
      column
    ) {
      setSortDirection(
        (
          current
        ) =>
          current ===
          "asc"
            ? "desc"
            : "asc"
      )

      return
    }

    setSortBy(
      column
    )

    setSortDirection(
      "asc"
    )
  }

  function changeStatusFilter(
    value: string
  ) {
    setPage(1)

    setStatusFilter(
      value as StatusFilter
    )
  }

  const pageItems =
    useMemo(
      () =>
        getPageItems(
          result?.pagination
            .page ?? 1,
          result?.pagination
            .totalPages ?? 1
        ),
      [
        result?.pagination.page,
        result?.pagination.totalPages
      ]
    )

  const total =
    result?.pagination.total ??
    0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>
              Access Users
            </CardTitle>

            <CardDescription>
              Cached users discovered from{" "}
              {sourceName}.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={
                statusFilter
              }
              onValueChange={
                changeStatusFilter
              }
              disabled={
                loading
              }
            >
              <SelectTrigger
                className="w-[170px]"
                aria-label="Filter UniFi users by status"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="all"
                >
                  All users
                </SelectItem>

                <SelectItem
                  value="active"
                >
                  Active users
                </SelectItem>

                <SelectItem
                  value="deactivated"
                >
                  Deactivated users
                </SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline">
              {total}{" "}
              {total === 1
                ? "user"
                : "users"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0 pb-6">
        {error ? (
          <div className="mx-6 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="Name"
                column="name"
                activeColumn={
                  sortBy
                }
                direction={
                  sortDirection
                }
                onSort={
                  toggleSort
                }
                className="pl-4"
              />

              <SortableTableHead
                label="Email"
                column="email"
                activeColumn={
                  sortBy
                }
                direction={
                  sortDirection
                }
                onSort={
                  toggleSort
                }
              />

              <SortableTableHead
                label="Employee ID"
                column="employeeNumber"
                activeColumn={
                  sortBy
                }
                direction={
                  sortDirection
                }
                onSort={
                  toggleSort
                }
              />

              <SortableTableHead
                label="UniFi Status"
                column="status"
                activeColumn={
                  sortBy
                }
                direction={
                  sortDirection
                }
                onSort={
                  toggleSort
                }
                className="pr-4"
              />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
            !result ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading users…
                </TableCell>
              </TableRow>
            ) : result?.users.length ? (
              result.users.map(
                (user) => (
                  <TableRow
                    key={
                      user.id
                    }
                  >
                    <TableCell className="pl-6 font-medium">
                      {displayName(
                        user
                      )}
                    </TableCell>

                    <TableCell>
                      {user.userEmail ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      {user.employeeNumber ??
                        "—"}
                    </TableCell>

                    <TableCell className="pr-6">
                      <StatusBadge
                        status={
                          user.status
                        }
                      />
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  {statusFilter ===
                  "all"
                    ? "No cached Access users. Run Discover to populate this source."
                    : `No ${statusFilter} users found.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {result &&
        result.pagination.totalPages >
          1 ? (
          <div className="px-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={
                      page <= 1
                    }
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(
                      event
                    ) => {
                      event.preventDefault()

                      if (
                        page >
                        1
                      ) {
                        setPage(
                          page - 1
                        )
                      }
                    }}
                  />
                </PaginationItem>

                {pageItems.map(
                  (
                    item,
                    index
                  ) =>
                    item ===
                    "ellipsis" ? (
                      <PaginationItem
                        key={
                          `ellipsis-${index}`
                        }
                      >
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem
                        key={
                          item
                        }
                      >
                        <PaginationLink
                          href="#"
                          isActive={
                            item ===
                            page
                          }
                          onClick={(
                            event
                          ) => {
                            event.preventDefault()

                            setPage(
                              item
                            )
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={
                      page >=
                      result.pagination.totalPages
                    }
                    className={
                      page >=
                      result.pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={(
                      event
                    ) => {
                      event.preventDefault()

                      if (
                        page <
                        result.pagination.totalPages
                      ) {
                        setPage(
                          page + 1
                        )
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function SortableTableHead({
  label,
  column,
  activeColumn,
  direction,
  onSort,
  className
}: {
  label: string
  column: SortBy
  activeColumn: SortBy
  direction: SortDirection
  onSort: (
    column: SortBy
  ) => void
  className?: string
}) {
  const active =
    activeColumn ===
    column

  const ariaSort =
    active
      ? direction ===
        "asc"
        ? "ascending"
        : "descending"
      : "none"

  return (
    <TableHead
      className={
        className
      }
      aria-sort={
        ariaSort
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-2 px-3 font-medium"
        onClick={() =>
          onSort(
            column
          )
        }
      >
        {label}

        {active ? (
          direction ===
          "asc" ? (
            <ArrowUp className="size-4" />
          ) : (
            <ArrowDown className="size-4" />
          )
        ) : (
          <ArrowUpDown className="size-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  )
}

function displayName(
  user:
    AdminUnifiAccessUser
) {
  if (
    user.fullName?.trim()
  ) {
    return user.fullName
  }

  const name =
    [
      user.firstName,
      user.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim()

  return (
    name ||
    user.alias ||
    user.userEmail ||
    user.unifiUserId
  )
}

function StatusBadge({
  status
}: {
  status:
    string | null
}) {
  switch (
    status?.toUpperCase()
  ) {
    case "ACTIVE":
      return (
        <Badge variant="outline">
          Active
        </Badge>
      )

    case "PENDING":
      return (
        <Badge variant="secondary">
          Pending
        </Badge>
      )

    case "DEACTIVATED":
      return (
        <Badge variant="secondary">
          Deactivated
        </Badge>
      )

    default:
      return (
        <Badge variant="outline">
          {status || "Unknown"}
        </Badge>
      )
  }
}

function getPageItems(
  currentPage: number,
  totalPages: number
): Array<
  number | "ellipsis"
> {
  if (
    totalPages <=
    7
  ) {
    return Array.from(
      {
        length:
          totalPages
      },
      (
        _,
        index
      ) =>
        index + 1
    )
  }

  if (
    currentPage <=
    4
  ) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      totalPages
    ]
  }

  if (
    currentPage >=
    totalPages - 3
  ) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ]
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages
  ]
}
