import { Loader2, UsersRound } from "lucide-react"
import { useState } from "react"

import { Button } from "#/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "#/components/ui/dialog.tsx"
import type { OrganizationTeam } from "./organization-team-types"

export type DeleteTeamDialogProps = {
  team: OrganizationTeam | null
  onOpenChange: (team: OrganizationTeam | null) => void
  onDelete: (team: OrganizationTeam) => Promise<boolean>
}

export function DeleteTeamDialog({
  team,
  onOpenChange,
  onDelete
}: DeleteTeamDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!team) {
      return
    }

    setDeleting(true)

    const success = await onDelete(team)

    setDeleting(false)

    if (success) {
      onOpenChange(null)
    }
  }

  return (
    <Dialog
      open={!!team}
      onOpenChange={(open) => {
        if (!open && !deleting) {
          onOpenChange(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete team</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete {team?.name}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        {team && (
          <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <UsersRound className="size-5 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {team.name}
              </div>

              <div className="text-xs text-muted-foreground">
                Team
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onClick={() => onOpenChange(null)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting && <Loader2 className="animate-spin" />}
            Delete team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
