import {
  Ellipsis,
  Pencil,
  Trash2,
  UserPlus,
  UsersRound
} from "lucide-react"

import { Button } from "#/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "#/components/ui/dropdown-menu.tsx"
import type {
  OrganizationTeam
} from "./organization-team-types"

export type TeamRowProps = {
  team: OrganizationTeam
  canManageMembers: boolean
  canEdit: boolean
  canDelete: boolean
  onManageMembers: (
    team: OrganizationTeam
  ) => void
  onEdit: (
    team: OrganizationTeam
  ) => void
  onDelete: (
    team: OrganizationTeam
  ) => void
}

export function TeamRow({
  team,
  canManageMembers,
  canEdit,
  canDelete,
  onManageMembers,
  onEdit,
  onDelete
}: TeamRowProps) {
  const hasActions =
    canManageMembers ||
    canEdit ||
    canDelete

  return (
    <div className="flex min-h-16 items-center gap-4 border-b px-3 py-3 last:border-b-0">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <UsersRound className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {team.name}
        </div>

        <div className="mt-0.5 truncate text-xs text-muted-foreground">
          Team
        </div>
      </div>

      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto size-8 shrink-0"
            >
              <Ellipsis />

              <span className="sr-only">
                Actions for{" "}
                {team.name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44"
          >
            {canEdit && (
              <DropdownMenuItem
                onSelect={() =>
                  onEdit(team)
                }
              >
                <Pencil />
                Edit
              </DropdownMenuItem>
            )}

            {canManageMembers && (
              <DropdownMenuItem
                onSelect={() =>
                  onManageMembers(
                    team
                  )
                }
              >
                <UserPlus />
                Add member
              </DropdownMenuItem>
            )}

            {canDelete &&
              (canEdit ||
                canManageMembers) && (
                <DropdownMenuSeparator />
              )}

            {canDelete && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() =>
                  onDelete(team)
                }
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
