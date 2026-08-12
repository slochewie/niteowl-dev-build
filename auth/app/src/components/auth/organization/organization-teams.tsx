import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useHasPermission,
  useListOrganizationMembers
} from "@better-auth-ui/react"
import { Loader2, Plus, UsersRound } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "#/components/ui/button.tsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "#/components/ui/card.tsx"
import { authClient as configuredAuthClient } from "#/lib/auth-client.ts"
import { CreateTeamDialog } from "./create-team-dialog"
import { DeleteTeamDialog } from "./delete-team-dialog"
import { EditTeamDialog } from "./edit-team-dialog"
import {
  ManageTeamMembersDialog,
  type OrganizationMember
} from "./manage-team-members-dialog"
import type {
  OrganizationTeam,
  TeamMembership
} from "./organization-team-types"
import { TeamRow } from "./team-row"

export function OrganizationTeams() {
  const { authClient } = useAuth()

  const organizationAuthClient = authClient as OrganizationAuthClient &
    typeof configuredAuthClient

  const { data: activeOrganization, isPending: organizationPending } =
    useActiveOrganization(organizationAuthClient)

  const { data: membersData, isPending: membersPending } =
    useListOrganizationMembers(organizationAuthClient)

  const {
    data: createPermission,
    isPending: createPermissionPending
  } = useHasPermission(organizationAuthClient, {
    permissions: {
      team: ["create"]
    }
  })

  const {
    data: updatePermission,
    isPending: updatePermissionPending
  } = useHasPermission(organizationAuthClient, {
    permissions: {
      team: ["update"]
    }
  })

  const {
    data: deletePermission,
    isPending: deletePermissionPending
  } = useHasPermission(organizationAuthClient, {
    permissions: {
      team: ["delete"]
    }
  })

  const {
    data: addMemberPermission,
    isPending: addMemberPermissionPending
  } = useHasPermission(organizationAuthClient, {
    permissions: {
      member: ["update"]
    }
  })

  const {
    data: removeMemberPermission,
    isPending: removeMemberPermissionPending
  } = useHasPermission(organizationAuthClient, {
    permissions: {
      member: ["delete"]
    }
  })

  const [teams, setTeams] = useState<OrganizationTeam[]>([])
  const [teamsPending, setTeamsPending] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editTeam, setEditTeam] = useState<OrganizationTeam | null>(null)
  const [deleteTeam, setDeleteTeam] = useState<OrganizationTeam | null>(null)
  const [manageTeam, setManageTeam] = useState<OrganizationTeam | null>(null)

  const [teamMemberships, setTeamMemberships] = useState<TeamMembership[]>([])
  const [teamMembersPending, setTeamMembersPending] = useState(false)
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null)
  const [membershipActionUserId, setMembershipActionUserId] =
    useState<string | null>(null)

  const canCreateTeam = !!createPermission?.success
  const canUpdateTeam = !!updatePermission?.success
  const canDeleteTeam = !!deletePermission?.success
  const canAddTeamMember = !!addMemberPermission?.success
  const canRemoveTeamMember = !!removeMemberPermission?.success

  const canManageTeamMembers = canAddTeamMember || canRemoveTeamMember

  const permissionsPending =
    createPermissionPending ||
    updatePermissionPending ||
    deletePermissionPending ||
    addMemberPermissionPending ||
    removeMemberPermissionPending

  const organizationMembers = useMemo(
    () => (membersData?.members ?? []) as OrganizationMember[],
    [membersData?.members]
  )

  const loadTeams = useCallback(async () => {
    if (!activeOrganization?.id) {
      setTeams([])
      setTeamsPending(false)
      return
    }

    setTeamsPending(true)
    setError(null)

    const result = await organizationAuthClient.organization.listTeams({
      query: {
        organizationId: activeOrganization.id
      }
    })

    if (result.error) {
      setError(result.error.message || "Unable to load teams.")
      setTeams([])
    } else {
      setTeams((result.data ?? []) as OrganizationTeam[])
    }

    setTeamsPending(false)
  }, [authClient, activeOrganization?.id])

  const loadTeamMembers = useCallback(async () => {
    if (!manageTeam) {
      setTeamMemberships([])
      return
    }

    setTeamMembersPending(true)
    setTeamMembersError(null)

    const result = await organizationAuthClient.organization.listTeamMembers({
      query: {
        teamId: manageTeam.id
      }
    })

    if (result.error) {
      setTeamMembersError(
        result.error.message || "Unable to load team members."
      )
      setTeamMemberships([])
    } else {
      setTeamMemberships((result.data ?? []) as TeamMembership[])
    }

    setTeamMembersPending(false)
  }, [authClient, manageTeam])

  useEffect(() => {
    void loadTeams()
  }, [loadTeams])

  useEffect(() => {
    if (manageTeam) {
      void loadTeamMembers()
    }
  }, [manageTeam, loadTeamMembers])

  async function createTeam(name: string) {
    if (!activeOrganization?.id || !canCreateTeam) {
      return false
    }

    setError(null)

    const result = await organizationAuthClient.organization.createTeam({
      name,
      organizationId: activeOrganization.id
    })

    if (result.error) {
      setError(result.error.message || "Unable to create team.")
      return false
    }

    await loadTeams()
    return true
  }

  async function updateTeam(team: OrganizationTeam, name: string) {
    if (!activeOrganization?.id || !canUpdateTeam) {
      return false
    }

    setError(null)

    const result = await organizationAuthClient.organization.updateTeam({
      teamId: team.id,
      data: {
        name,
        organizationId: activeOrganization.id
      }
    })

    if (result.error) {
      setError(result.error.message || "Unable to update team.")
      return false
    }

    await loadTeams()
    return true
  }

  async function removeTeam(team: OrganizationTeam) {
    if (!activeOrganization?.id || !canDeleteTeam) {
      return false
    }

    setError(null)

    const result = await organizationAuthClient.organization.removeTeam({
      teamId: team.id,
      organizationId: activeOrganization.id
    })

    if (result.error) {
      setError(result.error.message || "Unable to delete team.")
      return false
    }

    await loadTeams()
    return true
  }

  async function addMemberToTeam(userId: string) {
    if (
      !manageTeam ||
      !activeOrganization?.id ||
      !canAddTeamMember
    ) {
      return
    }

    setMembershipActionUserId(userId)
    setTeamMembersError(null)

    const result = await organizationAuthClient.organization.addTeamMember({
      teamId: manageTeam.id,
      userId,
      organizationId: activeOrganization.id
    })

    if (result.error) {
      setTeamMembersError(
        result.error.message || "Unable to add member to team."
      )
      setMembershipActionUserId(null)
      return
    }

    await loadTeamMembers()
    setMembershipActionUserId(null)
  }

  async function removeMemberFromTeam(userId: string) {
    if (
      !manageTeam ||
      !activeOrganization?.id ||
      !canRemoveTeamMember
    ) {
      return
    }

    setMembershipActionUserId(userId)
    setTeamMembersError(null)

    const result = await organizationAuthClient.organization.removeTeamMember({
      teamId: manageTeam.id,
      userId,
      organizationId: activeOrganization.id
    })

    if (result.error) {
      setTeamMembersError(
        result.error.message || "Unable to remove member from team."
      )
      setMembershipActionUserId(null)
      return
    }

    await loadTeamMembers()
    setMembershipActionUserId(null)
  }

  function openManageMembers(team: OrganizationTeam) {
    if (!canManageTeamMembers) {
      return
    }

    setTeamMembersError(null)
    setManageTeam(team)
  }

  const isPending =
    organizationPending ||
    teamsPending ||
    permissionsPending

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Teams</CardTitle>

            <CardDescription>
              Organize members into teams within{" "}
              {activeOrganization?.name ?? "this organization"}.
            </CardDescription>
          </div>

          {canCreateTeam && (
            <Button
              type="button"
              onClick={() => setCreateOpen(true)}
              disabled={!activeOrganization?.id || isPending}
            >
              <Plus />
              Create team
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isPending ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading teams…
            </div>
          ) : teams.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center">
              <UsersRound className="mx-auto mb-3 size-8 text-muted-foreground" />

              <div className="font-medium">
                No teams yet
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {canCreateTeam
                  ? "Create the first team for this organization."
                  : "This organization does not have any teams."}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {teams.map((team) => (
                <TeamRow
                  key={team.id}
                  team={team}
                  canManageMembers={canManageTeamMembers}
                  canEdit={canUpdateTeam}
                  canDelete={canDeleteTeam}
                  onManageMembers={openManageMembers}
                  onEdit={setEditTeam}
                  onDelete={(selectedTeam) => {
                    setError(null)
                    setDeleteTeam(selectedTeam)
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {canCreateTeam && (
        <CreateTeamDialog
          open={createOpen}
          organizationName={activeOrganization?.name}
          onOpenChange={setCreateOpen}
          onCreate={createTeam}
        />
      )}

      {canUpdateTeam && (
        <EditTeamDialog
          team={editTeam}
          onOpenChange={setEditTeam}
          onUpdate={updateTeam}
        />
      )}

      {canDeleteTeam && (
        <DeleteTeamDialog
          team={deleteTeam}
          onOpenChange={setDeleteTeam}
          onDelete={removeTeam}
        />
      )}

      {canManageTeamMembers && (
        <ManageTeamMembersDialog
          team={manageTeam}
          members={organizationMembers}
          memberships={teamMemberships}
          isPending={teamMembersPending || membersPending}
          actionUserId={membershipActionUserId}
          error={teamMembersError}
          canAddMembers={canAddTeamMember}
          canRemoveMembers={canRemoveTeamMember}
          onOpenChange={(team) => {
            setManageTeam(team)

            if (!team) {
              setTeamMemberships([])
              setTeamMembersError(null)
            }
          }}
          onAddMember={addMemberToTeam}
          onRemoveMember={removeMemberFromTeam}
        />
      )}
    </>
  )
}
