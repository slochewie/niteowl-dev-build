"use client"

import {
  Ban,
  Building2,
  CircleUserRound,
  Clock,
  KeyRound,
  Link2,
  LogIn,
  LogOut,
  MapPin,
  Monitor,
  ShieldCheck,
  UserCog,
  UserPlus
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@/components/ui/item"

import type {
  AdminUserActivityEvent,
  AdminUserActivityResult
} from "@/lib/admin/user-activity"

type UserActivityProps = {
  activity: AdminUserActivityResult
}

export function UserActivity({
  activity
}: UserActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Activity
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Authentication, account, and organization activity for this user
        </p>
      </CardHeader>

      <CardContent>
        {activity.error ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium">
              Activity unavailable
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {activity.error}
            </p>
          </div>
        ) : activity.events.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No activity found
          </div>
        ) : (
          <ItemGroup className="gap-0">
            {activity.events.map(
              (event, index) => (
                <div
                  key={
                    event.eventKey ||
                    `${event.eventType}-${event.createdAt}-${index}`
                  }
                >
                  {index > 0 && (
                    <ItemSeparator />
                  )}

                  <ActivityRow
                    event={event}
                  />
                </div>
              )
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityRow({
  event
}: {
  event: AdminUserActivityEvent
}) {
  const details =
    getEventDetails(event)

  return (
    <Item className="items-start">
      <ItemMedia variant="icon">
        <ActivityIcon
          eventType={
            event.eventType
          }
        />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="flex flex-wrap items-center gap-2">
          {formatEventType(
            event.eventType
          )}

          <Badge variant="outline">
            {event.eventType}
          </Badge>
        </ItemTitle>

        {details.length > 0 && (
          <ItemDescription>
            {details.join(" · ")}
          </ItemDescription>
        )}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />

            {formatDate(
              event.createdAt
            )}
          </span>

          {event.location
            ?.ipAddress && (
            <span className="inline-flex items-center gap-1">
              <Monitor className="size-3" />

              {
                event.location
                  .ipAddress
              }
            </span>
          )}

          {formatLocation(
            event.location
          ) && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />

              {formatLocation(
                event.location
              )}
            </span>
          )}
        </div>
      </ItemContent>
    </Item>
  )
}

function ActivityIcon({
  eventType
}: {
  eventType: string
}) {
  switch (eventType) {
    case "user_signed_in":
      return <LogIn />

    case "user_signed_out":
      return <LogOut />

    case "session_created":
    case "session_revoked":
    case "sessions_revoked_all":
      return <Monitor />

    case "password_changed":
    case "password_reset_requested":
    case "password_reset_completed":
      return <KeyRound />

    case "account_linked":
    case "account_unlinked":
      return <Link2 />

    case "user_banned":
    case "user_unbanned":
      return <Ban />

    case "user_impersonated":
    case "user_impersonation_stopped":
      return <UserCog />

    case "organization_member_added":
    case "organization_member_removed":
    case "organization_member_role_updated":
    case "organization_member_invited":
    case "organization_member_invite_accepted":
    case "organization_member_invite_rejected":
    case "organization_member_invite_canceled":
      return <Building2 />

    case "user_signed_up":
    case "user_created":
      return <UserPlus />

    case "user_email_verified":
    case "email_verified":
      return <ShieldCheck />

    default:
      return <CircleUserRound />
  }
}

function getEventDetails(
  event: AdminUserActivityEvent
) {
  const data =
    event.eventData ?? {}

  const values: string[] = []

  addDetail(
    values,
    "Organization",
    data.organizationName ??
      data.organizationSlug
  )

  addDetail(
    values,
    "Role",
    data.role ??
      data.newRole
  )

  addDetail(
    values,
    "Provider",
    data.providerId ??
      data.provider
  )

  addDetail(
    values,
    "Reason",
    data.banReason ??
      data.reason
  )

  addDetail(
    values,
    "Identifier",
    data.identifier
  )

  addDetail(
    values,
    "Email",
    data.email
  )

  return values
}

function addDetail(
  output: string[],
  label: string,
  value: unknown
) {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    return
  }

  output.push(
    `${label}: ${value}`
  )
}

function formatEventType(
  eventType: string
) {
  const labels:
    Record<string, string> = {
      user_signed_up:
        "User signed up",

      user_created:
        "User created",

      user_profile_updated:
        "Profile updated",

      profile_updated:
        "Profile updated",

      user_profile_image_updated:
        "Profile image updated",

      user_email_verified:
        "Email verified",

      email_verified:
        "Email verified",

      user_banned:
        "User banned",

      user_unbanned:
        "User unbanned",

      user_signed_in:
        "Signed in",

      user_signed_out:
        "Signed out",

      user_sign_in_failed:
        "Sign-in failed",

      session_created:
        "Session created",

      session_revoked:
        "Session revoked",

      sessions_revoked_all:
        "All sessions revoked",

      user_impersonated:
        "User impersonated",

      user_impersonation_stopped:
        "Impersonation stopped",

      account_linked:
        "Account linked",

      account_unlinked:
        "Account unlinked",

      password_changed:
        "Password changed",

      password_reset_requested:
        "Password reset requested",

      password_reset_completed:
        "Password reset completed",

      email_verification_sent:
        "Verification email sent",

      organization_member_added:
        "Added to organization",

      organization_member_removed:
        "Removed from organization",

      organization_member_role_updated:
        "Organization role changed",

      organization_member_invited:
        "Organization invitation sent",

      organization_member_invite_accepted:
        "Organization invitation accepted",

      organization_member_invite_rejected:
        "Organization invitation rejected",

      organization_member_invite_canceled:
        "Organization invitation canceled",

      organization_created:
        "Organization created",

      organization_updated:
        "Organization updated",

      organization_team_created:
        "Team created",

      organization_team_updated:
        "Team updated",

      organization_team_deleted:
        "Team deleted",

      organization_team_member_added:
        "Added to team",

      organization_team_member_removed:
        "Removed from team"
    }

  return (
    labels[eventType] ??
    eventType
      .split("_")
      .map(
        (part) =>
          part.charAt(0)
            .toUpperCase() +
          part.slice(1)
      )
      .join(" ")
  )
}

function formatLocation(
  location:
    | AdminUserActivityEvent["location"]
    | undefined
) {
  if (!location) {
    return null
  }

  const parts = [
    location.city,
    location.country
  ].filter(
    (
      value
    ): value is string =>
      Boolean(value)
  )

  return parts.length > 0
    ? parts.join(", ")
    : null
}

function formatDate(
  value: string
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
