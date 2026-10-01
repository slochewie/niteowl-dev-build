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

type RowsPerPage = 10 | 25 | 50;

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

	const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);

	const [currentPage, setCurrentPage] = useState(1);

	const pageCount = Math.max(1, Math.ceil(organizations.length / rowsPerPage));

	const safePage = Math.min(currentPage, pageCount);

	const startIndex = (safePage - 1) * rowsPerPage;

	const visibleOrganizations = organizations.slice(
		startIndex,
		startIndex + rowsPerPage,
	);

	const showingFrom = organizations.length === 0 ? 0 : startIndex + 1;

	const showingTo = Math.min(startIndex + rowsPerPage, organizations.length);

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
						<div className="space-y-3">
							<div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
								<div>
									Showing {showingFrom}
									{"-"}
									{showingTo} of {organizations.length}{" "}
									{organizations.length === 1
										? "organization membership"
										: "organization memberships"}
								</div>

								<div className="flex items-center gap-2">
									<span>Rows per page</span>

									<Select
										value={String(rowsPerPage)}
										onValueChange={(value) => {
											setRowsPerPage(Number(value) as RowsPerPage);
											setCurrentPage(1);
										}}
									>
										<SelectTrigger className="h-8 w-20">
											<SelectValue />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value="10">10</SelectItem>
											<SelectItem value="25">25</SelectItem>
											<SelectItem value="50">50</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="overflow-x-auto rounded-md border">
								<div className="min-w-[820px]">
									<div className="grid grid-cols-[minmax(240px,1.3fr)_minmax(180px,0.9fr)_130px_260px] gap-4 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
										<div>Organization</div>
										<div>Membership Type</div>
										<div>Role</div>
										<div className="text-right">Actions</div>
									</div>

									<div className="divide-y">
										{visibleOrganizations.map((organization) => (
											<div
												key={organization.id}
												className="grid grid-cols-[minmax(240px,1.3fr)_minmax(180px,0.9fr)_130px_260px] items-center gap-4 px-4 py-4"
											>
												<div className="flex min-w-0 items-center gap-3">
													<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
														<Building2 className="size-5 text-muted-foreground" />
													</div>

													<div className="min-w-0">
														<div className="truncate font-medium">
															{organization.name}
														</div>

														<div className="truncate text-sm text-muted-foreground">
															{organization.slug}
														</div>

														<div className="truncate text-xs text-muted-foreground">
															Joined {formatDate(organization.joinedAt)}
														</div>
													</div>
												</div>

												<div className="min-w-0 space-y-1">
													<div className="flex flex-wrap items-center gap-2">
														<Badge variant="outline">
															{PERSON_TYPE_LABELS[organization.personType]}
														</Badge>

														{!organization.active && (
															<Badge variant="destructive">Inactive</Badge>
														)}
													</div>

													{membershipSummary(organization) && (
														<div className="truncate text-xs text-muted-foreground">
															{membershipSummary(organization)}
														</div>
													)}
												</div>

												<div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="outline"
																size="sm"
																disabled={pending}
																className="w-full justify-between"
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
												</div>

												<div className="flex items-center justify-end gap-2">
													<Button
														variant="outline"
														size="sm"
														disabled={pending}
														onClick={() => openMembershipEditor(organization)}
													>
														<Pencil />
														Membership
													</Button>

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
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{pageCount > 1 && (
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="text-sm text-muted-foreground">
										Page {safePage} of {pageCount}
									</div>

									<div className="flex items-center justify-end gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={safePage <= 1}
											onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
										>
											Previous
										</Button>

										<Button
											variant="outline"
											size="sm"
											disabled={safePage >= pageCount}
											onClick={() =>
												setCurrentPage(Math.min(pageCount, safePage + 1))
											}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</div>
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
