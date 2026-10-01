"use client";

import {
	Building2,
	ChevronDown,
	Pencil,
	Plus,
	Trash2,
	UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
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

import {
	updateAdminOrganizationMemberProfile,
	type OrganizationPersonType,
} from "@/lib/admin/organizations";
import type { AdminOrganizationOption } from "@/lib/admin/user-organizations";
import {
	addUserToOrganization,
	removeUserFromOrganization,
	updateUserOrganizationRole,
} from "@/lib/admin/user-organizations";
import type { AdminUserOrganization } from "@/lib/admin/users";

type OrganizationRole = "member" | "admin" | "owner";

type MembershipFormValues = {
	personType: OrganizationPersonType;
	vendorCompany: string;
	accessExpiresAt: string;
	notes: string;
};

type UserOrganizationsProps = {
	userId: string;
	organizations: AdminUserOrganization[];
	allOrganizations: AdminOrganizationOption[];
};

const PERSON_TYPE_OPTIONS: Array<{
	value: OrganizationPersonType;
	label: string;
}> = [
	{ value: "employee", label: "Employee" },
	{ value: "vendor", label: "Vendor" },
	{ value: "contractor", label: "Contractor" },
	{ value: "it_support", label: "IT Support" },
	{ value: "accountant", label: "Accountant" },
	{ value: "owner", label: "Owner" },
	{ value: "service_account", label: "Service Account" },
	{ value: "other", label: "Other" },
];

const PERSON_TYPE_LABELS = Object.fromEntries(
	PERSON_TYPE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<OrganizationPersonType, string>;

const EMPTY_MEMBERSHIP_VALUES: MembershipFormValues = {
	personType: "employee",
	vendorCompany: "",
	accessExpiresAt: "",
	notes: "",
};

export function UserOrganizations({
	userId,
	organizations,
	allOrganizations,
}: UserOrganizationsProps) {
	const navigate = useNavigate();

	const [addOpen, setAddOpen] = useState(false);

	const [selectedOrganizationId, setSelectedOrganizationId] = useState("");

	const [selectedRole, setSelectedRole] =
		useState<OrganizationRole>("member");

	const [pending, setPending] = useState(false);

	const [editOrganization, setEditOrganization] =
		useState<AdminUserOrganization | null>(null);

	const [bulkOpen, setBulkOpen] = useState(false);

	const [membershipValues, setMembershipValues] = useState<MembershipFormValues>(
		EMPTY_MEMBERSHIP_VALUES,
	);

	const availableOrganizations = useMemo(() => {
		const currentIds = new Set(
			organizations.map((organization) => organization.id),
		);

		return allOrganizations.filter(
			(organization) => !currentIds.has(organization.id),
		);
	}, [organizations, allOrganizations]);

	async function refresh() {
		await navigate({
			to: "/users/$userId",
			params: {
				userId,
			},
			replace: true,
		});
	}

	function setMembershipField<Key extends keyof MembershipFormValues>(
		key: Key,
		value: MembershipFormValues[Key],
	) {
		setMembershipValues((current) => ({
			...current,
			[key]: value,
		}));
	}

	function formValuesFromOrganization(
		organization: AdminUserOrganization,
	): MembershipFormValues {
		return {
			personType: organization.personType,
			vendorCompany: organization.vendorCompany ?? "",
			accessExpiresAt: formatDateInput(organization.accessExpiresAt),
			notes: organization.notes ?? "",
		};
	}

	function openMembershipEditor(organization: AdminUserOrganization) {
		setMembershipValues(formValuesFromOrganization(organization));
		setEditOrganization(organization);
	}

	function openBulkEditor() {
		setMembershipValues(EMPTY_MEMBERSHIP_VALUES);
		setBulkOpen(true);
	}

	async function addMembership() {
		if (!selectedOrganizationId) {
			return;
		}

		setPending(true);

		try {
			await addUserToOrganization({
				data: {
					userId,
					organizationId: selectedOrganizationId,
					role: selectedRole,
				},
			});

			toast.success("User added to organization");

			setAddOpen(false);
			setSelectedOrganizationId("");
			setSelectedRole("member");

			await refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to add user to organization",
			);
		} finally {
			setPending(false);
		}
	}

	async function updateRole(
		organization: AdminUserOrganization,
		role: OrganizationRole,
	) {
		setPending(true);

		try {
			await updateUserOrganizationRole({
				data: {
					memberId: organization.memberId,
					organizationId: organization.id,
					role,
				},
			});

			toast.success("Organization role updated");

			await refresh();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to update role");
		} finally {
			setPending(false);
		}
	}

	async function saveMembership() {
		if (!editOrganization) {
			return;
		}

		setPending(true);

		try {
			await updateAdminOrganizationMemberProfile({
				data: {
					organizationId: editOrganization.id,
					userId,
					active: editOrganization.active,
					personType: membershipValues.personType,
					vendorCompany: membershipValues.vendorCompany,
					sponsorUserId: editOrganization.sponsorUserId,
					accessExpiresAt: toIsoDateOrNull(membershipValues.accessExpiresAt),
					notes: membershipValues.notes,
				},
			});

			toast.success("Membership updated");

			setEditOrganization(null);

			await refresh();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update membership",
			);
		} finally {
			setPending(false);
		}
	}

	async function saveBulkMemberships() {
		if (organizations.length === 0) {
			return;
		}

		setPending(true);

		try {
			await Promise.all(
				organizations.map((organization) =>
					updateAdminOrganizationMemberProfile({
						data: {
							organizationId: organization.id,
							userId,
							active: organization.active,
							personType: membershipValues.personType,
							vendorCompany: membershipValues.vendorCompany,
							sponsorUserId: organization.sponsorUserId,
							accessExpiresAt: toIsoDateOrNull(
								membershipValues.accessExpiresAt,
							),
							notes: membershipValues.notes,
						},
					}),
				),
			);

			toast.success("Memberships updated");

			setBulkOpen(false);

			await refresh();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update memberships",
			);
		} finally {
			setPending(false);
		}
	}

	async function removeMembership(organization: AdminUserOrganization) {
		setPending(true);

		try {
			await removeUserFromOrganization({
				data: {
					memberId: organization.memberId,
					organizationId: organization.id,
				},
			});

			toast.success("User removed from organization");

			await refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to remove user from organization",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between gap-4">
					<div>
						<CardTitle>Organizations</CardTitle>

						<p className="mt-1 text-sm text-muted-foreground">
							Manage this user's organization memberships, roles, and membership
							type
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-end gap-2">
						<Button
							size="sm"
							variant="outline"
							disabled={pending || organizations.length === 0}
							onClick={openBulkEditor}
						>
							<UsersRound />
							Update All Memberships
						</Button>

						<Button
							size="sm"
							disabled={availableOrganizations.length === 0}
							onClick={() => setAddOpen(true)}
						>
							<Plus />
							Add to Organization
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					{organizations.length === 0 ? (
						<div className="py-12 text-center text-sm text-muted-foreground">
							Not a member of any organizations
						</div>
					) : (
						<ItemGroup className="gap-0">
							{organizations.map((organization, index) => (
								<div key={organization.id}>
									{index > 0 && <ItemSeparator />}

									<Item>
										<ItemMedia variant="icon">
											<Building2 />
										</ItemMedia>

										<ItemContent>
											<ItemTitle className="flex flex-wrap items-center gap-2">
												{organization.name}

												<Badge variant="outline">{organization.role}</Badge>

												{organization.personType !== "employee" && (
													<Badge variant="outline">
														{PERSON_TYPE_LABELS[organization.personType]}
													</Badge>
												)}

												{!organization.active && (
													<Badge variant="destructive">Inactive</Badge>
												)}
											</ItemTitle>

											<ItemDescription>
												<div>
													{organization.slug}
													{" · Joined "}
													{formatDate(organization.joinedAt)}
												</div>

												<div>{membershipSummary(organization)}</div>
											</ItemDescription>
										</ItemContent>

										<ItemActions className="flex flex-wrap gap-2">
											<Button
												variant="outline"
												size="sm"
												disabled={pending}
												onClick={() => openMembershipEditor(organization)}
											>
												<Pencil />
												Membership
											</Button>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														disabled={pending}
													>
														{organization.role}

														<ChevronDown />
													</Button>
												</DropdownMenuTrigger>

												<DropdownMenuContent align="end">
													<DropdownMenuItem
														disabled={organization.role === "member"}
														onClick={() =>
															void updateRole(organization, "member")
														}
													>
														Member
													</DropdownMenuItem>

													<DropdownMenuItem
														disabled={organization.role === "admin"}
														onClick={() =>
															void updateRole(organization, "admin")
														}
													>
														Admin
													</DropdownMenuItem>

													<DropdownMenuItem
														disabled={organization.role === "owner"}
														onClick={() =>
															void updateRole(organization, "owner")
														}
													>
														Owner
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>

											<Button
												variant="outline"
												size="icon"
												className="text-destructive"
												disabled={pending}
												onClick={() => void removeMembership(organization)}
												aria-label={"Remove from " + organization.name}
											>
												<Trash2 />
											</Button>
										</ItemActions>
									</Item>
								</div>
							))}
						</ItemGroup>
					)}
				</CardContent>
			</Card>

			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add to Organization</DialogTitle>

						<DialogDescription>
							Add this user directly to an existing organization.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-5 py-4">
						<Field>
							<FieldLabel>Organization</FieldLabel>

							<Select
								value={selectedOrganizationId}
								onValueChange={setSelectedOrganizationId}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select organization" />
								</SelectTrigger>

								<SelectContent>
									{availableOrganizations.map((organization) => (
										<SelectItem key={organization.id} value={organization.id}>
											{organization.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Field>
							<FieldLabel>Role</FieldLabel>

							<Select
								value={selectedRole}
								onValueChange={(value) =>
									setSelectedRole(value as OrganizationRole)
								}
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
						</Field>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setAddOpen(false)}>
							Cancel
						</Button>

						<Button
							disabled={pending || !selectedOrganizationId}
							onClick={() => void addMembership()}
						>
							Add Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={editOrganization !== null}
				onOpenChange={(open) => {
					if (!open) {
						setEditOrganization(null);
					}
				}}
			>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Edit Membership</DialogTitle>

						<DialogDescription>
							Update this user's membership type for {editOrganization?.name}.
						</DialogDescription>
					</DialogHeader>

					<MembershipFields
						values={membershipValues}
						onChange={setMembershipField}
					/>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setEditOrganization(null)}
						>
							Cancel
						</Button>

						<Button disabled={pending} onClick={() => void saveMembership()}>
							Save Membership
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Update All Memberships</DialogTitle>

						<DialogDescription>
							Apply the same membership type, company, expiration, and notes to
							all assigned organizations for this user.
						</DialogDescription>
					</DialogHeader>

					<MembershipFields
						values={membershipValues}
						onChange={setMembershipField}
					/>

					<DialogFooter>
						<Button
							variant="outline"
							disabled={pending}
							onClick={() => setBulkOpen(false)}
						>
							Cancel
						</Button>

						<Button
							disabled={pending || organizations.length === 0}
							onClick={() => void saveBulkMemberships()}
						>
							Update All
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function MembershipFields({
	values,
	onChange,
}: {
	values: MembershipFormValues;
	onChange: <Key extends keyof MembershipFormValues>(
		key: Key,
		value: MembershipFormValues[Key],
	) => void;
}) {
	return (
		<div className="grid gap-5 py-4">
			<Field>
				<FieldLabel>Membership Type</FieldLabel>

				<Select
					value={values.personType}
					onValueChange={(value) =>
						onChange("personType", value as OrganizationPersonType)
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						{PERSON_TYPE_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Field>
				<FieldLabel>Vendor / Company</FieldLabel>

				<Input
					value={values.vendorCompany}
					onChange={(event) => onChange("vendorCompany", event.target.value)}
					placeholder="Optional"
				/>
			</Field>

			<Field>
				<FieldLabel>Access Expires</FieldLabel>

				<Input
					type="date"
					value={values.accessExpiresAt}
					onChange={(event) => onChange("accessExpiresAt", event.target.value)}
				/>
			</Field>

			<Field>
				<FieldLabel>Notes</FieldLabel>

				<Input
					value={values.notes}
					onChange={(event) => onChange("notes", event.target.value)}
					placeholder="Optional"
				/>
			</Field>
		</div>
	);
}

function membershipSummary(organization: AdminUserOrganization) {
	const parts = [
		PERSON_TYPE_LABELS[organization.personType],
		organization.vendorCompany,
		organization.accessExpiresAt
			? "Expires: " + formatDateOnly(organization.accessExpiresAt)
			: null,
	].filter(Boolean);

	return parts.join(" · ");
}

function toIsoDateOrNull(value: string) {
	if (!value) {
		return null;
	}

	return new Date(value + "T00:00:00.000Z").toISOString();
}

function formatDateInput(value: Date | string | null) {
	if (!value) {
		return "";
	}

	return new Date(value).toISOString().slice(0, 10);
}

function formatDateOnly(value: Date | string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
	}).format(new Date(value));
}

function formatDate(value: Date) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}
