import { Loader2 } from "lucide-react"
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
import { Input } from "#/components/ui/input.tsx"
import { Label } from "#/components/ui/label.tsx"

export type CreateTeamDialogProps = {
  open: boolean
  organizationName?: string
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => Promise<boolean>
}

export function CreateTeamDialog({
  open,
  organizationName,
  onOpenChange,
  onCreate
}: CreateTeamDialogProps) {
  const [name, setName] = useState("")
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    setCreating(true)

    const success = await onCreate(trimmedName)

    setCreating(false)

    if (success) {
      setName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!creating) {
          if (!nextOpen) {
            setName("")
          }

          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>

          <DialogDescription>
            Create a new team in {organizationName ?? "this organization"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="team-name">Team name</Label>

          <Input
            id="team-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Management"
            maxLength={64}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter" && !creating) {
                event.preventDefault()
                void handleCreate()
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={creating}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={creating || !name.trim()}
            onClick={() => void handleCreate()}
          >
            {creating && <Loader2 className="animate-spin" />}
            Create team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
