import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useCancelInvitation,
  useHasPermission
} from "@better-auth-ui/react"
import type { Invitation } from "better-auth/client"
import { X } from "lucide-react"

import { Badge } from "#/components/ui/badge.tsx"
import { Button } from "#/components/ui/button.tsx"
import { Spinner } from "#/components/ui/spinner.tsx"
import { TableCell, TableRow } from "#/components/ui/table.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { cn } from "#/lib/utils.ts"
import { OrganizationInvitationRowSkeleton } from "./organization-invitation-row-skeleton"

export type OrganizationInvitationRowProps = {
  invitation: Invitation
}

const statusBadgeClasses: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
  canceled: "bg-muted text-muted-foreground"
}

export function OrganizationInvitationRow({
  invitation
}: OrganizationInvitationRowProps) {
  const { authClient } = useAuth()
  const { localization: organizationLocalization, roles } =
    useAuthPlugin(organizationPlugin)

  const {
    data: cancelInvitationPermission,
    isPending: cancelPermissionPending
  } = useHasPermission(authClient as OrganizationAuthClient, {
    permissions: { invitation: ["cancel"] }
  })

  const { mutate: cancelInvitation, isPending: cancelPending } =
    useCancelInvitation(authClient as OrganizationAuthClient)

  const roleLabel = roles?.[invitation.role] ?? invitation.role

  const statusLabel =
    organizationLocalization[
      invitation.status as keyof typeof organizationLocalization
    ] ?? invitation.status

  const invitedAt = new Date(invitation.createdAt)

  if (cancelPermissionPending) {
    return <OrganizationInvitationRowSkeleton />
  }

  return (
    <TableRow>
      <TableCell className="max-w-0 overflow-hidden text-sm font-medium">
        <div className="truncate" title={invitation.email}>
          {invitation.email}
        </div>
      </TableCell>

      <TableCell className="text-xs tabular-nums text-muted-foreground">
        <div className="whitespace-nowrap">
          {invitedAt.toLocaleDateString(undefined, {
            dateStyle: "short"
          })}
        </div>

        <div className="whitespace-nowrap">
          {invitedAt.toLocaleTimeString(undefined, {
            timeStyle: "short"
          })}
        </div>
      </TableCell>

      <TableCell className="overflow-hidden text-sm">
        <div className="truncate">
          {roleLabel}
        </div>
      </TableCell>

      <TableCell className="overflow-hidden text-sm">
        <Badge
          variant="secondary"
          className={cn(
            "whitespace-nowrap",
            statusBadgeClasses[invitation.status]
          )}
        >
          {String(statusLabel)}
        </Badge>
      </TableCell>

      <TableCell className="p-1 text-end sm:p-2">
        {cancelInvitationPermission?.success &&
          invitation.status === "pending" && (
            <Button
              size="icon"
              variant="outline"
              className="size-8 text-destructive"
              disabled={cancelPending}
              onClick={() =>
                cancelInvitation({
                  invitationId: invitation.id
                })
              }
              aria-label={organizationLocalization.cancelInvitation}
            >
              {cancelPending ? <Spinner /> : <X />}
            </Button>
          )}
      </TableCell>
    </TableRow>
  )
}
