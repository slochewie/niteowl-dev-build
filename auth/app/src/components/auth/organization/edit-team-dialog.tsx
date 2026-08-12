import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "#/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "#/components/ui/dialog.tsx"
import { Input } from "#/components/ui/input.tsx"
import { Label } from "#/components/ui/label.tsx"
import type { OrganizationTeam } from "./organization-team-types"

export type EditTeamDialogProps = {
  team: OrganizationTeam | null
  onOpenChange: (team: OrganizationTeam | null) => void
  onUpdate: (team: OrganizationTeam, name: string) => Promise<boolean>
}

export function EditTeamDialog({
  team,
  onOpenChange,
  onUpdate
}: EditTeamDialogProps) {
  const [name, setName] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setName(team?.name ?? "")
  }, [team])

  async function handleUpdate() {
    const trimmedName = name.trim()

    if (!team || !trimmedName) {
      return
    }

    setUpdating(true)

    const success = await onUpdate(team, trimmedName)

    setUpdating(false)

    if (success) {
      onOpenChange(null)
    }
  }

  return (
    <Dialog
      open={!!team}
      onOpenChange={(open) => {
        if (!open && !updating) {
          onOpenChange(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename team</DialogTitle>

          <DialogDescription>
            Change the name of {team?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="edit-team-name">Team name</Label>

          <Input
            id="edit-team-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={64}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter" && !updating) {
                event.preventDefault()
                void handleUpdate()
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={updating}
            onClick={() => onOpenChange(null)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              updating ||
              !name.trim() ||
              name.trim() === team?.name
            }
            onClick={() => void handleUpdate()}
          >
            {updating && <Loader2 className="animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
