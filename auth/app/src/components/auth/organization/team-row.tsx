import {
  Edit,
  Ellipsis,
  Trash2,
  Users,
  UsersRound
} from "lucide-react"

import { Button } from "#/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "#/components/ui/dropdown-menu.tsx"
import type { OrganizationTeam } from "./organization-team-types"

export type TeamRowProps = {
  team: OrganizationTeam
  canManageMembers: boolean
  canEdit: boolean
  canDelete: boolean
  onManageMembers: (team: OrganizationTeam) => void
  onEdit: (team: OrganizationTeam) => void
  onDelete: (team: OrganizationTeam) => void
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
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <UsersRound className="size-5 shrink-0 text-muted-foreground" />

      {canManageMembers ? (
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => onManageMembers(team)}
        >
          <div className="truncate text-sm font-medium">
            {team.name}
          </div>

          <div className="truncate text-xs text-muted-foreground">
            Manage members
          </div>
        </button>
      ) : (
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {team.name}
          </div>

          <div className="truncate text-xs text-muted-foreground">
            Team
          </div>
        </div>
      )}

      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-auto shrink-0"
            >
              <Ellipsis />

              <span className="sr-only">
                Actions for {team.name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {canManageMembers && (
              <DropdownMenuItem
                onSelect={() => onManageMembers(team)}
              >
                <Users />
                Manage members
              </DropdownMenuItem>
            )}

            {canEdit && (
              <DropdownMenuItem
                onSelect={() => onEdit(team)}
              >
                <Edit />
                Rename team
              </DropdownMenuItem>
            )}

            {canDelete && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDelete(team)}
              >
                <Trash2 />
                Delete team
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
