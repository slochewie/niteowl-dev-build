"use client";

import {
	ArrowDownAZ,
	ArrowDownUp,
	Check,
	Copy,
	Eye,
	Filter,
	MoreHorizontal,
	Search,
	ShieldBan,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAdminAccess } from "@/components/auth/admin/admin-access-context";
import { AddUserDialog } from "@/components/auth/admin/add-user-dialog";
import { NiteOwlUserView } from "@/components/niteowl/user-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { AdminUserListItem } from "@/lib/admin/users";

type UsersTableProps = {
	users: AdminUserListItem[];
};

type SortMode = "created-desc" | "created-asc" | "name-asc" | "name-desc";

type StatusFilter = "all" | "active" | "banned";

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function UsersTable({ users }: UsersTableProps) {
	const navigate = useNavigate();

	const { readOnly } = useAdminAccess();

	const [search, setSearch] = useState("");

	const [sortMode, setSortMode] = useState<SortMode>("name-asc");

	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const [organizationFilter, setOrganizationFilter] = useState("all");

	const [pageSize, setPageSize] = useState<PageSize>(25);

	const [currentPage, setCurrentPage] = useState(1);

	const organizations = useMemo(() => {
		const organizationMap = new Map<
			string,
			{
				id: string;
				name: string;
			}
		>();

		for (const user of users) {
			for (const organization of user.organizations) {
				organizationMap.set(organization.id, {
					id: organization.id,
					name: organization.name,
				});
			}
		}

		return Array.from(organizationMap.values()).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
	}, [users]);

	const filteredUsers = useMemo(() => {
		const searchValue = search.trim().toLowerCase();

		const result = users.filter((user) => {
			const matchesSearch =
				searchValue.length === 0 ||
				user.name.toLowerCase().includes(searchValue) ||
				user.email.toLowerCase().includes(searchValue) ||
				user.id.toLowerCase().includes(searchValue);

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && !user.banned) ||
				(statusFilter === "banned" && user.banned);

			const matchesOrganization =
				organizationFilter === "all" ||
				user.organizations.some(
					(organization) => organization.id === organizationFilter,
				);

			return matchesSearch && matchesStatus && matchesOrganization;
		});

		return result.sort((a, b) => {
			switch (sortMode) {
				case "created-asc":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);

				case "name-asc":
					return (a.name || a.email).localeCompare(b.name || b.email);

				case "name-desc":
					return (b.name || b.email).localeCompare(a.name || a.email);

				case "created-desc":
				default:
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
			}
		});
	}, [users, search, statusFilter, organizationFilter, sortMode]);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, statusFilter, organizationFilter, sortMode, pageSize]);

	const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

	const page = Math.min(currentPage, pageCount);

	const pageStart = filteredUsers.length === 0 ? 0 : (page - 1) * pageSize + 1;

	const pageEnd = Math.min(page * pageSize, filteredUsers.length);

	const paginatedUsers = filteredUsers.slice(
		(page - 1) * pageSize,
		page * pageSize,
	);

	const activeFilterCount =
		(statusFilter !== "all" ? 1 : 0) + (organizationFilter !== "all" ? 1 : 0);

	const sortLabel = sortMode.startsWith("created") ? "Created" : "Name";

	const paginationLabel =
		filteredUsers.length === 0
			? `Showing 0 of ${users.length} users`
			: `Showing ${pageStart}-${pageEnd} of ${filteredUsers.length} users${
					filteredUsers.length === users.length ? "" : ` (${users.length} total)`
				}`;

	return (
		<div className="flex flex-col gap-5">
			<div className="text-sm text-muted-foreground">{paginationLabel}</div>

			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
					<div className="relative min-w-0 flex-1 sm:max-w-md">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="pl-9"
							placeholder="Search users..."
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="justify-start">
								<ArrowDownAZ />

								{sortLabel}
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="start" className="w-56">
							<DropdownMenuItem onClick={() => setSortMode("created-desc")}>
								{sortMode === "created-desc" && <Check />}
								Created (Newest)
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => setSortMode("created-asc")}>
								{sortMode === "created-asc" && <Check />}
								Created (Oldest)
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuItem onClick={() => setSortMode("name-asc")}>
								{sortMode === "name-asc" && <Check />}
								Name (A–Z)
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => setSortMode("name-desc")}>
								{sortMode === "name-desc" && <Check />}
								Name (Z–A)
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<Filter />
								Filter
								{activeFilterCount > 0 && (
									<Badge variant="secondary" className="ml-1 px-1.5 py-0">
										{activeFilterCount}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" className="w-64">
							<DropdownMenuLabel>Status</DropdownMenuLabel>

							<DropdownMenuItem onClick={() => setStatusFilter("all")}>
								{statusFilter === "all" && <Check />}
								All users
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => setStatusFilter("active")}>
								{statusFilter === "active" && <Check />}
								Active
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => setStatusFilter("banned")}>
								{statusFilter === "banned" && <Check />}
								Banned
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<DropdownMenuLabel>Organization</DropdownMenuLabel>

							<DropdownMenuItem onClick={() => setOrganizationFilter("all")}>
								{organizationFilter === "all" && <Check />}
								All organizations
							</DropdownMenuItem>

							{organizations.map((organization) => (
								<DropdownMenuItem
									key={organization.id}
									onClick={() => setOrganizationFilter(organization.id)}
								>
									{organizationFilter === organization.id && <Check />}

									{organization.name}
								</DropdownMenuItem>
							))}

							{activeFilterCount > 0 && (
								<>
									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={() => {
											setStatusFilter("all");
											setOrganizationFilter("all");
										}}
									>
										<ArrowDownUp />
										Reset filters
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<AddUserDialog disabled={readOnly} />
				</div>
			</div>

			<div className="max-w-full overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>

							<TableHead>Status</TableHead>

							<TableHead>Organizations</TableHead>

							<TableHead>Date Joined</TableHead>

							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-32 text-center text-muted-foreground"
								>
									No users found.
								</TableCell>
							</TableRow>
						) : (
							paginatedUsers.map((user) => (
								<TableRow
									key={user.id}
									className="cursor-pointer"
									onClick={() =>
										void navigate({
											to: "/users/$userId",
											params: {
												userId: user.id,
											},
										})
									}
								>
									<TableCell>
										<NiteOwlUserView
											user={{
												id: user.id,
												name: user.name,
												email: user.email,
												image: user.image ?? undefined,
												emailVerified: user.emailVerified,
												createdAt: user.createdAt,
												updatedAt: user.updatedAt,
											}}
										/>
									</TableCell>

									<TableCell>
										{user.banned ? (
											<Badge variant="destructive">
												<ShieldBan />
												Banned
											</Badge>
										) : (
											<Badge variant="secondary">Active</Badge>
										)}
									</TableCell>

									<TableCell>
										{user.organizations.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{user.organizations.map((organization) => (
													<Badge key={organization.id} variant="outline">
														{organization.name}
													</Badge>
												))}
											</div>
										) : (
											<span className="text-sm text-muted-foreground">—</span>
										)}
									</TableCell>

									<TableCell className="whitespace-nowrap">
										{new Intl.DateTimeFormat(undefined, {
											dateStyle: "medium",
											timeStyle: "short",
										}).format(new Date(user.createdAt))}
									</TableCell>

									<TableCell onClick={(event) => event.stopPropagation()}>
										<UserActions user={user} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{filteredUsers.length > 0 && (
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>Rows per page</span>
						<Select
							value={String(pageSize)}
							onValueChange={(value) => setPageSize(Number(value) as PageSize)}
						>
							<SelectTrigger size="sm" className="w-[4.5rem]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent align="start">
								{PAGE_SIZE_OPTIONS.map((option) => (
									<SelectItem key={option} value={String(option)}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<div className="text-sm text-muted-foreground">
							Page {page} of {pageCount}
						</div>

						<Button
							variant="outline"
							size="sm"
							disabled={page <= 1}
							onClick={() => setCurrentPage(Math.max(1, page - 1))}
						>
							Previous
						</Button>

						<Button
							variant="outline"
							size="sm"
							disabled={page >= pageCount}
							onClick={() => setCurrentPage(Math.min(pageCount, page + 1))}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function UserActions({ user }: { user: AdminUserListItem }) {
	const navigate = useNavigate();

	const { readOnly } = useAdminAccess();

	async function copy(value: string) {
		await navigator.clipboard.writeText(value);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal />

					<span className="sr-only">User actions</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuItem onClick={() => void copy(user.email)}>
					<Copy />
					Copy Email
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => void copy(user.id)}>
					<Copy />
					Copy User ID
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() =>
						void navigate({
							to: "/users/$userId",
							params: {
								userId: user.id,
							},
						})
					}
				>
					<Eye />
					View Profile
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					disabled={readOnly}
					className="text-destructive focus:text-destructive"
				>
					<ShieldBan />

					{user.banned ? "Unban User" : "Ban User"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
