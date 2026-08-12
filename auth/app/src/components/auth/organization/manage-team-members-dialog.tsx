import type { Member, User } from "better-auth/client"
import {
  Loader2,
  UserMinus,
  UserPlus,
  Users
} from "lucide-react"

import { Button } from "#/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "#/components/ui/dialog.tsx"
import { UserView } from "../user/user-view"
import type {
  OrganizationTeam,
  TeamMembership
} from "./organization-team-types"

export type OrganizationMember = Member & {
  user: Partial<User>
}

export type ManageTeamMembersDialogProps = {
  team: OrganizationTeam | null
  members: OrganizationMember[]
  memberships: TeamMembership[]
  isPending: boolean
  actionUserId: string | null
  error: string | null
  canAddMembers: boolean
  canRemoveMembers: boolean
  onOpenChange: (team: OrganizationTeam | null) => void
  onAddMember: (userId: string) => Promise<void>
  onRemoveMember: (userId: string) => Promise<void>
}

export function ManageTeamMembersDialog({
  team,
  members,
  memberships,
  isPending,
  actionUserId,
  error,
  canAddMembers,
  canRemoveMembers,
  onOpenChange,
  onAddMember,
  onRemoveMember
}: ManageTeamMembersDialogProps) {
  const teamMemberUserIds = new Set(
    memberships.map((membership) => membership.userId)
  )

  return (
    <Dialog
      open={!!team}
      onOpenChange={(open) => {
        if (!open && !actionUserId) {
          onOpenChange(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{team?.name}</DialogTitle>

          <DialogDescription>
            Add or remove organization members from this team.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isPending ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading members…
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-8 text-center">
            <Users className="mx-auto mb-3 size-8 text-muted-foreground" />

            <div className="font-medium">
              No organization members
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Add members to the organization before assigning them to teams.
            </p>
          </div>
        ) : (
          <div className="max-h-[55vh] space-y-2 overflow-y-auto">
            {members.map((member) => {
              const isTeamMember =
                teamMemberUserIds.has(member.userId)

              const isUpdating =
                actionUserId === member.userId

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg border px-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <UserView user={member.user} />
                  </div>

                  {isTeamMember ? (
                    canRemoveMembers ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0 text-destructive"
                        disabled={!!actionUserId}
                        onClick={() =>
                          void onRemoveMember(member.userId)
                        }
                      >
                        {isUpdating ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <UserMinus />
                        )}

                        Remove
                      </Button>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        Member
                      </span>
                    )
                  ) : canAddMembers ? (
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0"
                      disabled={!!actionUserId}
                      onClick={() =>
                        void onAddMember(member.userId)
                      }
                    >
                      {isUpdating ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <UserPlus />
                      )}

                      Add
                    </Button>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!!actionUserId}
            onClick={() => onOpenChange(null)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
