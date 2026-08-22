"use client"

import Bowser from "bowser"
import {
  Clock,
  Globe2,
  Laptop,
  LogOut,
  Monitor,
  Smartphone
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import type {
  AdminUserSession
} from "@/lib/admin/users"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
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

type UserSessionsProps = {
  userId: string
  sessions: AdminUserSession[]
  compact?: boolean
}

export function UserSessions({
  userId,
  sessions,
  compact = false
}: UserSessionsProps) {
  const navigate = useNavigate()

  const [pendingToken, setPendingToken] =
    useState<string | null>(null)

  const [revokingAll, setRevokingAll] =
    useState(false)

  const visibleSessions =
    compact
      ? sessions.slice(0, 5)
      : sessions

  async function refresh() {
    await navigate({
      to: "/users/$userId",
      params: {
        userId
      },
      replace: true
    })
  }

  async function revokeSession(
    sessionToken: string
  ) {
    setPendingToken(sessionToken)

    try {
      const { error } =
        await authClient.admin.revokeUserSession({
          sessionToken
        })

      if (error) {
        throw new Error(
          error.message ??
            "Unable to revoke session"
        )
      }

      toast.success(
        "Session revoked"
      )

      await refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to revoke session"
      )
    } finally {
      setPendingToken(null)
    }
  }

  async function revokeAllSessions() {
    setRevokingAll(true)

    try {
      const { error } =
        await authClient.admin.revokeUserSessions({
          userId
        })

      if (error) {
        throw new Error(
          error.message ??
            "Unable to revoke sessions"
        )
      }

      toast.success(
        "All sessions revoked"
      )

      await refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to revoke sessions"
      )
    } finally {
      setRevokingAll(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>
            {compact
              ? "Recent Sessions"
              : "Sessions"}
          </CardTitle>

          {!compact && (
            <p className="mt-1 text-sm text-muted-foreground">
              Manage active login sessions across all devices
            </p>
          )}
        </div>

        {!compact &&
          sessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              disabled={revokingAll}
              onClick={() =>
                void revokeAllSessions()
              }
            >
              <LogOut />
              Revoke All
            </Button>
          )}
      </CardHeader>

      <CardContent>
        {visibleSessions.length ===
        0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No active sessions
          </div>
        ) : (
          <ItemGroup className="gap-0">
            {visibleSessions.map(
              (session, index) => {
                const device =
                  parseDevice(
                    session.userAgent
                  )

                const expired =
                  new Date(
                    session.expiresAt
                  ).getTime() <
                  Date.now()

                return (
                  <div
                    key={
                      session.id
                    }
                  >
                    {index > 0 && (
                      <ItemSeparator />
                    )}

                    <Item>
                      <ItemMedia variant="icon">
                        <DeviceIcon
                          type={
                            device.type
                          }
                        />
                      </ItemMedia>

                      <ItemContent>
                        <ItemTitle className="flex flex-wrap items-center gap-2">
                          <span>
                            {
                              device.label
                            }
                          </span>

                          {expired && (
                            <Badge variant="secondary">
                              Expired
                            </Badge>
                          )}

                          {session.impersonatedBy && (
                            <Badge variant="outline">
                              Impersonated
                            </Badge>
                          )}
                        </ItemTitle>

                        <ItemDescription className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1">
                            <Globe2 className="size-3" />

                            {session.ipAddress ||
                              "Unknown IP"}
                          </span>

                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />

                            Created{" "}
                            {formatDate(
                              session.createdAt
                            )}
                          </span>

                          <span>
                            Expires{" "}
                            {formatDate(
                              session.expiresAt
                            )}
                          </span>
                        </ItemDescription>
                      </ItemContent>

                      {!compact && (
                        <ItemActions>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              pendingToken ===
                              session.token
                            }
                            onClick={() =>
                              void revokeSession(
                                session.token
                              )
                            }
                          >
                            <LogOut />
                            Revoke
                          </Button>
                        </ItemActions>
                      )}
                    </Item>
                  </div>
                )
              }
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function DeviceIcon({
  type
}: {
  type:
    | "mobile"
    | "desktop"
    | "unknown"
}) {
  if (type === "mobile") {
    return <Smartphone />
  }

  if (type === "desktop") {
    return <Laptop />
  }

  return <Monitor />
}

function parseDevice(
  userAgent: string | null
) {
  if (!userAgent) {
    return {
      type: "unknown" as const,
      label: "Unknown Device"
    }
  }

  const ua =
    Bowser.parse(userAgent)

  const platformType =
    ua.platform.type

  const type =
    platformType === "mobile" ||
    platformType === "tablet"
      ? ("mobile" as const)
      : ("desktop" as const)

  const browser =
    ua.browser.name ||
    "Unknown Browser"

  const os =
    ua.os.name

  return {
    type,
    label: os
      ? `${browser}, ${os}`
      : browser
  }
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
