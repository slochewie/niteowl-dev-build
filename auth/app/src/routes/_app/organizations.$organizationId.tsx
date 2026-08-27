import {
	createFileRoute,
	Link,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import {
	Building2,
	Copy,
	Mail,
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
	UserRound,
	UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { OrganizationPlugins } from "@/components/admin/plugins/organization-plugins";
import { AdminWriteBoundary } from "@/components/auth/admin/admin-access-context";
import { UserAvatar } from "@/components/auth/user/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@/components/ui/item";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminOrganizationIntegrations } from "@/lib/admin/plugins";

import {
	addAdminOrganizationMember,
	addAdminOrganizationTeamMember,
	createAdminOrganizationTeam,
	deleteAdminOrganization,
	deleteAdminOrganizationTeam,
	getAdminOrganization,
	getAdminOrganizationUserOptions,
	inviteAdminOrganizationMember,
	removeAdminOrganizationMember,
	removeAdminOrganizationTeamMember,
	updateAdminOrganization,
	updateAdminOrganizationMemberRole,
	updateAdminOrganizationTeam,
	type AdminOrganizationDetail,
	type AdminOrganizationMember,
	type AdminOrganizationTeam,
	type OrganizationRole,
} from "@/lib/admin/organizations";

export const Route = createFileRoute("/_app/organizations/$organizationId")({
	loader: async ({ params }) => {
		const [organization, users, integrations] = await Promise.all([
			getAdminOrganization({
				data: {
					organizationId: params.organizationId,
				},
			}),

			getAdminOrganizationUserOptions(),

			getAdminOrganizationIntegrations({
				data: {
					organizationId: params.organizationId,
				},
			}),
		]);

		return {
			organization,
			users,
			integrations,
		};
	},

	component: OrganizationPage,
});

function OrganizationPage() {
	const { organization, users, integrations } = Route.useLoaderData();

	const hasEnabledPlugins = integrations.some(
		(integration) => integration.enabled,
	);

	const router = useRouter();

	async function refresh() {
		await router.invalidate();
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="border-b px-4 py-4 md:px-6">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link to="/organizations" className="hover:text-foreground">
						Organizations
					</Link>

					<span>/</span>

					<span className="text-foreground">{organization.name}</span>
				</div>
			</div>

			<div className="grid flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<AdminWriteBoundary>
					<OrganizationSidebar
						organization={organization}
						users={users}
						onRefresh={refresh}
					/>
				</AdminWriteBoundary>

				<div className="min-w-0">
					<Tabs defaultValue="overview" className="w-full">
						<div className="w-full overflow-x-auto">
							<TabsList className="h-auto min-w-max justify-start rounded-none border-b bg-transparent p-0">
								{[
									["overview", "Overview"],
									["members", "Members"],
									["invitations", "Invitations"],
									["teams", "Teams"],

									...(hasEnabledPlugins ? [["plugins", "Plugins"]] : []),

									["activity", "Activity"],
								].map(([value, label]) => (
									<TabsTrigger
										key={value}
										value={value}
										className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
									>
										{label}
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<TabsContent value="overview" className="mt-6 space-y-6">
							<Overview organization={organization} />
						</TabsContent>

						<TabsContent value="members" className="mt-6">
							<AdminWriteBoundary>
								<MembersCard organization={organization} onRefresh={refresh} />
							</AdminWriteBoundary>
						</TabsContent>

						<TabsContent value="invitations" className="mt-6">
							<InvitationsCard organization={organization} />
						</TabsContent>

						<TabsContent value="teams" className="mt-6">
							<AdminWriteBoundary>
								<TeamsCard organization={organization} onRefresh={refresh} />
							</AdminWriteBoundary>
						</TabsContent>

						{hasEnabledPlugins && (
							<TabsContent value="plugins" className="mt-6">
								<AdminWriteBoundary>
									<OrganizationPlugins
										organization={{
											id: organization.id,
											name: organization.name,
										}}
										integrations={integrations}
									/>
								</AdminWriteBoundary>
							</TabsContent>
						)}

						<TabsContent value="activity" className="mt-6">
							<Card>
								<CardHeader>
									<CardTitle>Activity</CardTitle>
								</CardHeader>

								<CardContent className="py-12 text-center text-sm text-muted-foreground">
									Organization activity will be wired to Better Auth Infra next.
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

function OrganizationSidebar({
	organization,
	users,
	onRefresh,
}: {
	organization: AdminOrganizationDetail;

	users: Array<{
		id: string;
		name: string;
		email: string;
		image: string | null;
	}>;

	onRefresh: () => Promise<void>;
}) {
	const navigate = useNavigate();

	const [addMemberOpen, setAddMemberOpen] = useState(false);

	const [inviteOpen, setInviteOpen] = useState(false);

	const [editOpen, setEditOpen] = useState(false);

	const [deleteOpen, setDeleteOpen] = useState(false);

	const [pending, setPending] = useState(false);

	const [userId, setUserId] = useState("");

	const [role, setRole] = useState<OrganizationRole>("member");

	const [inviteEmail, setInviteEmail] = useState("");

	const [inviteRole, setInviteRole] = useState<OrganizationRole>("member");

	const [name, setName] = useState(organization.name);

	const [slug, setSlug] = useState(organization.slug);

	const availableUsers = useMemo(() => {
		const memberIds = new Set(
			organization.members.map((member) => member.userId),
		);

		return users.filter((user) => !memberIds.has(user.id));
	}, [organization.members, users]);

	async function addMember() {
		if (!userId) {
			return;
		}

		setPending(true);

		try {
			await addAdminOrganizationMember({
				data: {
					organizationId: organization.id,
					userId,
					role,
				},
			});

			toast.success("Member added");

			setAddMemberOpen(false);
			setUserId("");
			setRole("member");

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to add member"));
		} finally {
			setPending(false);
		}
	}

	async function inviteMember() {
		const email = inviteEmail.trim();

		if (!email) {
			return;
		}

		setPending(true);

		try {
			await inviteAdminOrganizationMember({
				data: {
					organizationId: organization.id,
					email,
					role: inviteRole,
				},
			});

			toast.success("Invitation sent");

			setInviteOpen(false);
			setInviteEmail("");
			setInviteRole("member");

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to invite member"));
		} finally {
			setPending(false);
		}
	}

	async function saveOrganization() {
		const nextName = name.trim();

		const nextSlug = slug.trim();

		if (!nextName || !nextSlug) {
			return;
		}

		setPending(true);

		try {
			await updateAdminOrganization({
				data: {
					organizationId: organization.id,
					name: nextName,
					slug: nextSlug,
				},
			});

			toast.success("Organization updated");

			setEditOpen(false);

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to update organization"));
		} finally {
			setPending(false);
		}
	}

	async function deleteOrganization() {
		setPending(true);

		try {
			await deleteAdminOrganization({
				data: {
					organizationId: organization.id,
				},
			});

			toast.success("Organization deleted");

			await navigate({
				to: "/organizations",
			});
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to delete organization"));

			setPending(false);
		}
	}

	return (
		<>
			<aside className="space-y-6">
				<div className="space-y-4">
					<div className="flex size-32 items-center justify-center overflow-hidden rounded-md bg-muted">
						{organization.logo ? (
							<img
								src={organization.logo}
								alt={organization.name}
								className="size-full object-cover"
							/>
						) : (
							<Building2 className="size-12 text-muted-foreground" />
						)}
					</div>

					<div>
						<h1 className="text-2xl font-semibold">{organization.name}</h1>

						<p className="text-sm text-muted-foreground">
							/{organization.slug}
						</p>

						<p className="mt-3 text-sm text-muted-foreground">
							Created {formatDateOnly(organization.createdAt)}
						</p>
					</div>

					<div className="font-medium">
						{organization.memberCount}{" "}
						{organization.memberCount === 1 ? "member" : "members"}
					</div>
				</div>

				<div>
					<DividerLabel>Actions</DividerLabel>

					<div className="space-y-2">
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => setAddMemberOpen(true)}
						>
							<Plus />
							Add Member
						</Button>

						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => setInviteOpen(true)}
						>
							<Mail />
							Invite Member
						</Button>

						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => {
								setName(organization.name);

								setSlug(organization.slug);

								setEditOpen(true);
							}}
						>
							<Pencil />
							Edit Organization
						</Button>
					</div>
				</div>

				<div>
					<DividerLabel>Destructive Actions</DividerLabel>

					<Button
						variant="destructive"
						className="w-full justify-start"
						onClick={() => setDeleteOpen(true)}
					>
						<Trash2 />
						Delete Organization
					</Button>
				</div>
			</aside>

			<Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Member</DialogTitle>

						<DialogDescription>
							Add an existing user directly to {organization.name}.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<label className="text-sm font-medium">User</label>

							<Select value={userId} onValueChange={setUserId}>
								<SelectTrigger>
									<SelectValue placeholder="Select user" />
								</SelectTrigger>

								<SelectContent>
									{availableUsers.map((user) => (
										<SelectItem key={user.id} value={user.id}>
											{user.name} · {user.email}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<RoleSelect value={role} onValueChange={setRole} />
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setAddMemberOpen(false)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || !userId}
							onClick={() => void addMember()}
						>
							Add Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite Member</DialogTitle>

						<DialogDescription>
							Send an organization invitation.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<label className="text-sm font-medium">Email</label>

							<Input
								type="email"
								value={inviteEmail}
								onChange={(event) => setInviteEmail(event.target.value)}
								placeholder="name@example.com"
							/>
						</div>

						<RoleSelect value={inviteRole} onValueChange={setInviteRole} />
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setInviteOpen(false)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || !inviteEmail.trim()}
							onClick={() => void inviteMember()}
						>
							Invite Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Organization</DialogTitle>

						<DialogDescription>Update organization details.</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<label className="text-sm font-medium">Name</label>

							<Input
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</div>

						<div className="grid gap-2">
							<label className="text-sm font-medium">Slug</label>

							<Input
								value={slug}
								onChange={(event) => setSlug(event.target.value)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setEditOpen(false)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || !name.trim() || !slug.trim()}
							onClick={() => void saveOrganization()}
						>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Organization</DialogTitle>

						<DialogDescription>
							Permanently delete {organization.name}. This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setDeleteOpen(false)}
						>
							Cancel
						</Button>

						<Button
							variant="destructive"
							disabled={pending}
							onClick={() => void deleteOrganization()}
						>
							Delete Organization
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function Overview({ organization }: { organization: AdminOrganizationDetail }) {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="size-5" />
						Organization Information
					</CardTitle>

					<p className="text-sm text-muted-foreground">
						Basic details and configuration
					</p>
				</CardHeader>

				<CardContent className="grid gap-x-12 gap-y-6 md:grid-cols-2">
					<InfoField label="Name" value={organization.name} />

					<InfoField label="Slug" value={`/${organization.slug}`} />

					<InfoField
						label="Created"
						value={formatDateOnly(organization.createdAt)}
					/>

					<InfoField label="Organization ID" value={organization.id} />
				</CardContent>
			</Card>

			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					icon={<UsersRound />}
					label="Members"
					value={organization.memberCount}
				/>

				<StatCard
					icon={<Mail />}
					label="Pending Invites"
					value={organization.pendingInvitationCount}
				/>

				<StatCard
					icon={<Building2 />}
					label="Teams"
					value={organization.teamCount}
				/>
			</div>

			<div className="grid gap-6 xl:grid-cols-2">
				<MembersCard organization={organization} compact />

				<InvitationsCard organization={organization} compact />
			</div>
		</>
	);
}

function MembersCard({
	organization,
	compact = false,
	onRefresh,
}: {
	organization: AdminOrganizationDetail;
	compact?: boolean;
	onRefresh?: () => Promise<void>;
}) {
	const members = compact
		? organization.members.slice(0, 6)
		: organization.members;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Members</CardTitle>

				<p className="text-sm text-muted-foreground">
					{organization.memberCount}{" "}
					{organization.memberCount === 1 ? "member" : "members"} in this
					organization
				</p>
			</CardHeader>

			<CardContent>
				{members.length === 0 ? (
					<div className="py-10 text-center text-sm text-muted-foreground">
						No members
					</div>
				) : (
					<ItemGroup className="gap-0">
						{members.map((member, index) => (
							<div key={member.memberId}>
								{index > 0 && <ItemSeparator />}

								<MemberRow
									organizationId={organization.id}
									member={member}
									compact={compact}
									onRefresh={onRefresh}
								/>
							</div>
						))}
					</ItemGroup>
				)}
			</CardContent>
		</Card>
	);
}

function MemberRow({
	organizationId,
	member,
	compact,
	onRefresh,
}: {
	organizationId: string;
	member: AdminOrganizationMember;
	compact: boolean;
	onRefresh?: () => Promise<void>;
}) {
	const navigate = useNavigate();

	const [removeOpen, setRemoveOpen] = useState(false);

	const [pending, setPending] = useState(false);

	async function setRole(role: OrganizationRole) {
		if (!onRefresh) {
			return;
		}

		setPending(true);

		try {
			await updateAdminOrganizationMemberRole({
				data: {
					organizationId,
					memberId: member.memberId,
					role,
				},
			});

			toast.success("Member role updated");

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to update member role"));
		} finally {
			setPending(false);
		}
	}

	async function removeMember() {
		if (!onRefresh) {
			return;
		}

		setPending(true);

		try {
			await removeAdminOrganizationMember({
				data: {
					organizationId,
					memberId: member.memberId,
				},
			});

			toast.success("Member removed");

			setRemoveOpen(false);

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to remove member"));
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<Item>
				<ItemMedia>
					<UserAvatar
						user={{
							id: member.userId,
							name: member.name,
							email: member.email,
							image: member.image ?? undefined,
							emailVerified: false,
							createdAt: member.joinedAt,
							updatedAt: member.joinedAt,
						}}
					/>
				</ItemMedia>

				<ItemContent>
					<ItemTitle className="flex flex-wrap items-center gap-2">
						{member.name}

						<Badge variant="outline">{member.role}</Badge>

						{member.banned && <Badge variant="destructive">Banned</Badge>}
					</ItemTitle>

					<ItemDescription>{member.email}</ItemDescription>
				</ItemContent>

				{!compact && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" disabled={pending}>
								<MoreHorizontal />

								<span className="sr-only">Member actions</span>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" className="w-52">
							<DropdownMenuItem
								onClick={() =>
									void navigate({
										to: "/users/$userId",
										params: {
											userId: member.userId,
										},
									})
								}
							>
								<UserRound />
								View Profile
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => void navigator.clipboard.writeText(member.email)}
							>
								<Copy />
								Copy Email
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel>Change Role</DropdownMenuLabel>

							{(["member", "admin", "owner"] as OrganizationRole[]).map(
								(role) => (
									<DropdownMenuItem
										key={role}
										disabled={member.role === role}
										onClick={() => void setRole(role)}
									>
										<span className="capitalize">{role}</span>
									</DropdownMenuItem>
								),
							)}

							<DropdownMenuSeparator />

							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => setRemoveOpen(true)}
							>
								<Trash2 />
								Remove
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</Item>

			<Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Member</DialogTitle>

						<DialogDescription>
							Remove {member.name} from this organization?
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setRemoveOpen(false)}
						>
							Cancel
						</Button>

						<Button
							variant="destructive"
							disabled={pending}
							onClick={() => void removeMember()}
						>
							Remove Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function InvitationsCard({
	organization,
	compact = false,
}: {
	organization: AdminOrganizationDetail;
	compact?: boolean;
}) {
	const invitations = compact
		? organization.invitations.slice(0, 6)
		: organization.invitations;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invitations</CardTitle>

				<p className="text-sm text-muted-foreground">
					{organization.pendingInvitationCount} pending invites
				</p>
			</CardHeader>

			<CardContent>
				{invitations.length === 0 ? (
					<div className="py-10 text-center text-sm text-muted-foreground">
						No invitations
					</div>
				) : (
					<ItemGroup className="gap-0">
						{invitations.map((invitation, index) => (
							<div key={invitation.id}>
								{index > 0 && <ItemSeparator />}

								<Item>
									<ItemMedia variant="icon">
										<Mail />
									</ItemMedia>

									<ItemContent>
										<ItemTitle>{invitation.email}</ItemTitle>

										<ItemDescription>
											{invitation.role ?? "member"}
											{" · "}
											{invitation.status}
											{" · "}
											{formatDateOnly(invitation.createdAt)}
										</ItemDescription>
									</ItemContent>
								</Item>
							</div>
						))}
					</ItemGroup>
				)}
			</CardContent>
		</Card>
	);
}

function TeamsCard({
	organization,
	onRefresh,
}: {
	organization: AdminOrganizationDetail;
	onRefresh: () => Promise<void>;
}) {
	const [createOpen, setCreateOpen] = useState(false);

	const [editTeam, setEditTeam] = useState<AdminOrganizationTeam | null>(null);

	const [deleteTeam, setDeleteTeam] = useState<AdminOrganizationTeam | null>(
		null,
	);

	const [manageTeam, setManageTeam] = useState<AdminOrganizationTeam | null>(
		null,
	);

	const [name, setName] = useState("");

	const [pending, setPending] = useState(false);

	async function createTeam() {
		const value = name.trim();

		if (!value) {
			return;
		}

		setPending(true);

		try {
			await createAdminOrganizationTeam({
				data: {
					organizationId: organization.id,
					name: value,
				},
			});

			toast.success("Team created");

			setCreateOpen(false);
			setName("");

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to create team"));
		} finally {
			setPending(false);
		}
	}

	async function renameTeam() {
		if (!editTeam) {
			return;
		}

		const value = name.trim();

		if (!value) {
			return;
		}

		setPending(true);

		try {
			await updateAdminOrganizationTeam({
				data: {
					organizationId: organization.id,
					teamId: editTeam.id,
					name: value,
				},
			});

			toast.success("Team updated");

			setEditTeam(null);
			setName("");

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to update team"));
		} finally {
			setPending(false);
		}
	}

	async function removeTeam() {
		if (!deleteTeam) {
			return;
		}

		setPending(true);

		try {
			await deleteAdminOrganizationTeam({
				data: {
					organizationId: organization.id,
					teamId: deleteTeam.id,
				},
			});

			toast.success("Team deleted");

			setDeleteTeam(null);

			await onRefresh();
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to delete team"));
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-start justify-between gap-4">
					<div>
						<CardTitle>Teams</CardTitle>

						<p className="mt-1 text-sm text-muted-foreground">
							{organization.teamCount}{" "}
							{organization.teamCount === 1 ? "team" : "teams"} in this
							organization
						</p>
					</div>

					<Button
						size="sm"
						onClick={() => {
							setName("");
							setCreateOpen(true);
						}}
					>
						<Plus />
						New Team
					</Button>
				</CardHeader>

				<CardContent>
					{organization.teams.length === 0 ? (
						<div className="py-10 text-center text-sm text-muted-foreground">
							No teams
						</div>
					) : (
						<ItemGroup className="gap-0">
							{organization.teams.map((team, index) => (
								<div key={team.id}>
									{index > 0 && <ItemSeparator />}

									<Item>
										<ItemMedia variant="icon">
											<UsersRound />
										</ItemMedia>

										<ItemContent>
											<ItemTitle>{team.name}</ItemTitle>

											<ItemDescription>
												{team.memberCount}{" "}
												{team.memberCount === 1 ? "member" : "members"}
												{" · Created "}
												{formatDateOnly(team.createdAt)}
											</ItemDescription>
										</ItemContent>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal />

													<span className="sr-only">Team actions</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => {
														setName(team.name);
														setEditTeam(team);
													}}
												>
													<Pencil />
													Edit
												</DropdownMenuItem>

												<DropdownMenuItem onClick={() => setManageTeam(team)}>
													<UsersRound />
													Manage Members
												</DropdownMenuItem>

												<DropdownMenuSeparator />

												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => setDeleteTeam(team)}
												>
													<Trash2 />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</Item>
								</div>
							))}
						</ItemGroup>
					)}
				</CardContent>
			</Card>

			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>New Team</DialogTitle>

						<DialogDescription>
							Create a team in {organization.name}.
						</DialogDescription>
					</DialogHeader>

					<TeamNameInput value={name} onChange={setName} />

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setCreateOpen(false)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || !name.trim()}
							onClick={() => void createTeam()}
						>
							Create Team
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!editTeam}
				onOpenChange={(open) => {
					if (!open) {
						setEditTeam(null);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Team</DialogTitle>

						<DialogDescription>Rename this team.</DialogDescription>
					</DialogHeader>

					<TeamNameInput value={name} onChange={setName} />

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setEditTeam(null)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || !name.trim()}
							onClick={() => void renameTeam()}
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!deleteTeam}
				onOpenChange={(open) => {
					if (!open) {
						setDeleteTeam(null);
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Team</DialogTitle>

						<DialogDescription>
							Delete {deleteTeam?.name}? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setDeleteTeam(null)}
						>
							Cancel
						</Button>

						<Button
							variant="destructive"
							disabled={pending}
							onClick={() => void removeTeam()}
						>
							Delete Team
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ManageTeamMembersDialog
				organization={organization}
				team={manageTeam}
				onOpenChange={setManageTeam}
				onRefresh={onRefresh}
			/>
		</>
	);
}

function ManageTeamMembersDialog({
	organization,
	team,
	onOpenChange,
	onRefresh,
}: {
	organization: AdminOrganizationDetail;

	team: AdminOrganizationTeam | null;

	onOpenChange: (team: AdminOrganizationTeam | null) => void;

	onRefresh: () => Promise<void>;
}) {
	const [pendingUserId, setPendingUserId] = useState<string | null>(null);

	async function toggleMember(
		member: AdminOrganizationMember,
		isMember: boolean,
	) {
		if (!team) {
			return;
		}

		setPendingUserId(member.userId);

		try {
			if (isMember) {
				await removeAdminOrganizationTeamMember({
					data: {
						teamId: team.id,
						userId: member.userId,
					},
				});

				toast.success("Member removed from team");
			} else {
				await addAdminOrganizationTeamMember({
					data: {
						teamId: team.id,
						userId: member.userId,
					},
				});

				toast.success("Member added to team");
			}

			await onRefresh();

			onOpenChange({
				...team,
				memberUserIds: isMember
					? team.memberUserIds.filter((id) => id !== member.userId)
					: [...team.memberUserIds, member.userId],

				memberCount: isMember
					? Math.max(0, team.memberCount - 1)
					: team.memberCount + 1,
			});
		} catch (error) {
			toast.error(getErrorMessage(error, "Unable to update team membership"));
		} finally {
			setPendingUserId(null);
		}
	}

	return (
		<Dialog
			open={!!team}
			onOpenChange={(open) => {
				if (!open) {
					onOpenChange(null);
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

				<div className="max-h-[55vh] overflow-y-auto">
					<ItemGroup className="gap-0">
						{organization.members.map((member, index) => {
							const isMember =
								team?.memberUserIds.includes(member.userId) ?? false;

							return (
								<div key={member.memberId}>
									{index > 0 && <ItemSeparator />}

									<Item>
										<ItemMedia>
											<UserAvatar
												user={{
													id: member.userId,
													name: member.name,
													email: member.email,
													image: member.image ?? undefined,
													emailVerified: false,
													createdAt: member.joinedAt,
													updatedAt: member.joinedAt,
												}}
											/>
										</ItemMedia>

										<ItemContent>
											<ItemTitle>{member.name}</ItemTitle>

											<ItemDescription>{member.email}</ItemDescription>
										</ItemContent>

										<Button
											size="sm"
											variant={isMember ? "outline" : "default"}
											className={isMember ? "text-destructive" : ""}
											disabled={pendingUserId !== null}
											onClick={() => void toggleMember(member, isMember)}
										>
											{isMember ? "Remove" : "Add"}
										</Button>
									</Item>
								</div>
							);
						})}
					</ItemGroup>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						disabled={pendingUserId !== null}
						onClick={() => onOpenChange(null)}
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function RoleSelect({
	value,
	onValueChange,
}: {
	value: OrganizationRole;
	onValueChange: (value: OrganizationRole) => void;
}) {
	return (
		<div className="grid gap-2">
			<label className="text-sm font-medium">Role</label>

			<Select
				value={value}
				onValueChange={(value) => onValueChange(value as OrganizationRole)}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>

				<SelectContent>
					<SelectItem value="member">Member</SelectItem>

					<SelectItem value="admin">Admin</SelectItem>

					<SelectItem value="owner">Owner</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function TeamNameInput({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="grid gap-2 py-2">
			<label className="text-sm font-medium">Team Name</label>

			<Input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				autoFocus
			/>
		</div>
	);
}

function DividerLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
			<div className="h-px flex-1 bg-border" />

			{children}

			<div className="h-px flex-1 bg-border" />
		</div>
	);
}

function StatCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
}) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="[&>svg]:size-4">{icon}</span>

					{label}
				</div>

				<div className="mt-2 text-3xl font-semibold">{value}</div>
			</CardContent>
		</Card>
	);
}

function InfoField({ label, value }: { label: string; value: string }) {
	return (
		<div className="space-y-1">
			<div className="text-sm text-muted-foreground">{label}</div>

			<div className="break-all text-sm">{value}</div>
		</div>
	);
}

function formatDateOnly(value: Date) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
	}).format(new Date(value));
}

function getErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}
