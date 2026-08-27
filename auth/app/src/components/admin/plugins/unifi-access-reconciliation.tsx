"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
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

import {
	type AdminPluginOrganization,
	type AdminUnifiAccessReconciliation,
	type AdminUnifiAccessReconciliationRow,
	type AdminUnifiAccessReconciliationStatus,
	getAdminUnifiAccessReconciliation,
	provisionAdminUnifiAccessUser,
	setAdminUnifiAccessUserStatus,
} from "@/lib/admin/plugins";

const PAGE_SIZE = 10;

type SortBy =
	| "name"
	| "email"
	| "employeeId"
	| "betterAuthStatus"
	| "unifiStatus"
	| "reconciliationStatus";

type SortDirection = "asc" | "desc";

type StatusFilter = "all" | AdminUnifiAccessReconciliationStatus;

export function UnifiAccessReconciliation({
	sourceId,
	sourceName,
	organizations,
	refreshKey,
	onChanged,
}: {
	sourceId: string;
	sourceName: string;
	organizations: AdminPluginOrganization[];
	refreshKey: number;
	onChanged?: () => void;
}) {
	const [organizationId, setOrganizationId] = useState("");

	const [result, setResult] = useState<AdminUnifiAccessReconciliation | null>(
		null,
	);

	const [page, setPage] = useState(1);

	const [sortBy, setSortBy] = useState<SortBy>("name");

	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const [loading, setLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const [provisioningUserId, setProvisioningUserId] = useState<string | null>(
		null,
	);

	const [updatingStatusUserId, setUpdatingStatusUserId] = useState<
		string | null
	>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: sourceId intentionally resets reconciliation state when the Access source changes.
	useEffect(() => {
		setOrganizationId("");
		setResult(null);
		setPage(1);
		setStatusFilter("all");
		setError(null);
	}, [sourceId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey intentionally triggers reconciliation reloads after cached UniFi data changes.
	useEffect(() => {
		if (!organizationId) {
			setResult(null);
			return;
		}

		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);

			try {
				const response = await getAdminUnifiAccessReconciliation({
					data: {
						sourceId,
						organizationId,
					},
				});

				if (cancelled) {
					return;
				}

				setResult(response);
			} catch (loadError) {
				if (cancelled) {
					return;
				}

				setResult(null);

				setError(
					loadError instanceof Error
						? loadError.message
						: "Unable to load UniFi Access reconciliation",
				);
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		void load();

		return () => {
			cancelled = true;
		};
	}, [sourceId, organizationId, refreshKey]);

	async function provisionUser(row: AdminUnifiAccessReconciliationRow) {
		if (
			!organizationId ||
			!row.betterAuthUserId ||
			row.reconciliationStatus !== "missing-in-unifi"
		) {
			return;
		}

		setProvisioningUserId(row.betterAuthUserId);

		setError(null);

		try {
			await provisionAdminUnifiAccessUser({
				data: {
					sourceId,
					organizationId,
					userId: row.betterAuthUserId,
				},
			});

			const refreshed = await getAdminUnifiAccessReconciliation({
				data: {
					sourceId,
					organizationId,
				},
			});

			setResult(refreshed);

			onChanged?.();
		} catch (provisionError) {
			setError(
				provisionError instanceof Error
					? provisionError.message
					: "Unable to provision UniFi Access user",
			);
		} finally {
			setProvisioningUserId(null);
		}
	}

	async function updateUserStatus(
		row: AdminUnifiAccessReconciliationRow,
		status: "ACTIVE" | "DEACTIVATED",
	) {
		if (!organizationId || !row.betterAuthUserId || !row.unifiUserId) {
			return;
		}

		setUpdatingStatusUserId(row.betterAuthUserId);

		setError(null);

		try {
			await setAdminUnifiAccessUserStatus({
				data: {
					sourceId,
					organizationId,
					userId: row.betterAuthUserId,
					status,
				},
			});

			const refreshed = await getAdminUnifiAccessReconciliation({
				data: {
					sourceId,
					organizationId,
				},
			});

			setResult(refreshed);

			onChanged?.();
		} catch (statusError) {
			setError(
				statusError instanceof Error
					? statusError.message
					: "Unable to update UniFi Access user status",
			);
		} finally {
			setUpdatingStatusUserId(null);
		}
	}

	function selectOrganization(value: string) {
		setOrganizationId(value);

		setPage(1);

		setStatusFilter("all");
	}

	function toggleSort(column: SortBy) {
		setPage(1);

		if (sortBy === column) {
			setSortDirection((current) => (current === "asc" ? "desc" : "asc"));

			return;
		}

		setSortBy(column);

		setSortDirection("asc");
	}

	function changeFilter(value: string) {
		setPage(1);

		setStatusFilter(value as StatusFilter);
	}

	const filteredRows = useMemo(() => {
		if (!result) {
			return [];
		}

		const rows =
			statusFilter === "all"
				? [...result.rows]
				: result.rows.filter(
						(row) => row.reconciliationStatus === statusFilter,
					);

		rows.sort((left, right) => {
			const leftValue = sortValue(left, sortBy);

			const rightValue = sortValue(right, sortBy);

			const comparison = leftValue.localeCompare(rightValue, undefined, {
				numeric: true,
				sensitivity: "base",
			});

			return sortDirection === "asc" ? comparison : -comparison;
		});

		return rows;
	}, [result, sortBy, sortDirection, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

	const effectivePage = Math.min(page, totalPages);

	const pageRows = filteredRows.slice(
		(effectivePage - 1) * PAGE_SIZE,
		effectivePage * PAGE_SIZE,
	);

	const pageItems = useMemo(
		() => getPageItems(effectivePage, totalPages),
		[effectivePage, totalPages],
	);

	useEffect(() => {
		if (page !== effectivePage) {
			setPage(effectivePage);
		}
	}, [page, effectivePage]);

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
					<div>
						<CardTitle>Better Auth ↔ UniFi Reconciliation</CardTitle>

						<CardDescription>
							Read-only comparison between a Better Auth organization and cached
							users from {sourceName}.
						</CardDescription>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Select value={organizationId} onValueChange={selectOrganization}>
							<SelectTrigger
								className="w-[240px]"
								aria-label="Select organization to reconcile"
							>
								<SelectValue placeholder="Select organization" />
							</SelectTrigger>

							<SelectContent>
								{organizations.map((organization) => (
									<SelectItem key={organization.id} value={organization.id}>
										{organization.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={statusFilter}
							onValueChange={changeFilter}
							disabled={!result}
						>
							<SelectTrigger
								className="w-[220px]"
								aria-label="Filter reconciliation status"
							>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="all">All reconciliation states</SelectItem>

								<SelectItem value="in-sync">In sync</SelectItem>

								<SelectItem value="disabled-in-sync">
									Disabled in sync
								</SelectItem>

								<SelectItem value="missing-in-unifi">
									Missing in UniFi
								</SelectItem>

								<SelectItem value="disabled-better-auth-only">
									Disabled Better Auth only
								</SelectItem>

								<SelectItem value="should-activate">Should activate</SelectItem>

								<SelectItem value="should-deactivate">
									Should deactivate
								</SelectItem>

								<SelectItem value="unifi-only">UniFi only</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{result ? (
					<div className="flex flex-wrap gap-2 pt-2">
						<SummaryBadge label="In sync" value={result.summary.inSync} />

						<SummaryBadge
							label="Disabled in sync"
							value={result.summary.disabledInSync}
						/>

						<SummaryBadge
							label="Missing in UniFi"
							value={result.summary.missingInUnifi}
						/>

						<SummaryBadge
							label="Should activate"
							value={result.summary.shouldActivate}
						/>

						<SummaryBadge
							label="Should deactivate"
							value={result.summary.shouldDeactivate}
						/>

						<SummaryBadge
							label="Disabled BA only"
							value={result.summary.disabledBetterAuthOnly}
						/>

						<SummaryBadge label="UniFi only" value={result.summary.unifiOnly} />
					</div>
				) : null}
			</CardHeader>

			<CardContent className="space-y-4 p-0 pb-6">
				{error ? (
					<div className="mx-6 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
						{error}
					</div>
				) : null}

				{!organizationId ? (
					<div className="px-6 pb-6 text-sm text-muted-foreground">
						Select an assigned organization to compare Better Auth membership
						with this UniFi Access source.
					</div>
				) : loading && !result ? (
					<div className="px-6 pb-6 text-sm text-muted-foreground">
						Loading reconciliation…
					</div>
				) : result ? (
					<>
						<Table>
							<TableHeader>
								<TableRow>
									<SortableTableHead
										label="Name"
										column="name"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
										className="pl-4"
									/>

									<SortableTableHead
										label="Email"
										column="email"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
									/>

									<SortableTableHead
										label="Employee ID"
										column="employeeId"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
									/>

									<SortableTableHead
										label="Better Auth"
										column="betterAuthStatus"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
									/>

									<SortableTableHead
										label="UniFi"
										column="unifiStatus"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
									/>

									<SortableTableHead
										label="Reconciliation"
										column="reconciliationStatus"
										activeColumn={sortBy}
										direction={sortDirection}
										onSort={toggleSort}
										className="pr-4"
									/>
									<TableHead className="pr-6 text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{pageRows.length ? (
									pageRows.map((row, index) => (
										<TableRow
											key={
												row.betterAuthUserId ??
												row.cachedUnifiUserId ??
												`${row.unifiUserId}-${index}`
											}
										>
											<TableCell className="pl-6 font-medium">
												{displayName(row)}
											</TableCell>

											<TableCell>
												{row.betterAuthEmail ?? row.unifiEmail ?? "—"}
											</TableCell>

											<TableCell>
												<EmployeeIdValue row={row} />
											</TableCell>

											<TableCell>
												<BetterAuthBadge row={row} />
											</TableCell>

											<TableCell>
												<UniFiStatusBadge status={row.unifiStatus} />
											</TableCell>

											<TableCell className="pr-6">
												<ReconciliationBadge
													status={row.reconciliationStatus}
												/>
											</TableCell>

											<TableCell className="pr-6 text-right">
												{row.reconciliationStatus === "missing-in-unifi" &&
												row.betterAuthUserId ? (
													<Button
														type="button"
														variant="outline"
														size="sm"
														disabled={
															provisioningUserId === row.betterAuthUserId
														}
														onClick={() => void provisionUser(row)}
													>
														{provisioningUserId === row.betterAuthUserId
															? "Provisioning…"
															: "Provision"}
													</Button>
												) : row.reconciliationStatus === "should-activate" &&
													row.betterAuthUserId &&
													row.unifiUserId ? (
													<Button
														type="button"
														variant="outline"
														size="sm"
														disabled={
															updatingStatusUserId === row.betterAuthUserId
														}
														onClick={() => void updateUserStatus(row, "ACTIVE")}
													>
														{updatingStatusUserId === row.betterAuthUserId
															? "Activating…"
															: "Activate"}
													</Button>
												) : row.reconciliationStatus === "should-deactivate" &&
													row.betterAuthUserId &&
													row.unifiUserId ? (
													<Button
														type="button"
														variant="outline"
														size="sm"
														disabled={
															updatingStatusUserId === row.betterAuthUserId
														}
														onClick={() =>
															void updateUserStatus(row, "DEACTIVATED")
														}
													>
														{updatingStatusUserId === row.betterAuthUserId
															? "Deactivating…"
															: "Deactivate"}
													</Button>
												) : null}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={7}
											className="h-24 text-center text-muted-foreground"
										>
											No reconciliation rows match this filter.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{totalPages > 1 ? (
							<div className="px-6">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href="#"
												aria-disabled={effectivePage <= 1}
												className={
													effectivePage <= 1
														? "pointer-events-none opacity-50"
														: undefined
												}
												onClick={(event) => {
													event.preventDefault();

													if (effectivePage > 1) {
														setPage(effectivePage - 1);
													}
												}}
											/>
										</PaginationItem>

										{pageItems.map((item) =>
											typeof item === "string" ? (
												<PaginationItem key={item}>
													<PaginationEllipsis />
												</PaginationItem>
											) : (
												<PaginationItem key={item}>
													<PaginationLink
														href="#"
														isActive={item === effectivePage}
														onClick={(event) => {
															event.preventDefault();

															setPage(item);
														}}
													>
														{item}
													</PaginationLink>
												</PaginationItem>
											),
										)}

										<PaginationItem>
											<PaginationNext
												href="#"
												aria-disabled={effectivePage >= totalPages}
												className={
													effectivePage >= totalPages
														? "pointer-events-none opacity-50"
														: undefined
												}
												onClick={(event) => {
													event.preventDefault();

													if (effectivePage < totalPages) {
														setPage(effectivePage + 1);
													}
												}}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						) : null}
					</>
				) : null}
			</CardContent>
		</Card>
	);
}

function SummaryBadge({ label, value }: { label: string; value: number }) {
	return (
		<Badge variant="outline">
			{label} {value}
		</Badge>
	);
}

function SortableTableHead({
	label,
	column,
	activeColumn,
	direction,
	onSort,
	className,
}: {
	label: string;
	column: SortBy;
	activeColumn: SortBy;
	direction: SortDirection;
	onSort: (column: SortBy) => void;
	className?: string;
}) {
	const active = column === activeColumn;

	return (
		<TableHead
			className={className}
			aria-sort={
				active ? (direction === "asc" ? "ascending" : "descending") : "none"
			}
		>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 gap-2 px-3 font-medium"
				onClick={() => onSort(column)}
			>
				{label}

				{active ? (
					direction === "asc" ? (
						<ArrowUp className="size-4" />
					) : (
						<ArrowDown className="size-4" />
					)
				) : (
					<ArrowUpDown className="size-4 opacity-50" />
				)}
			</Button>
		</TableHead>
	);
}

function displayName(row: AdminUnifiAccessReconciliationRow) {
	return (
		row.betterAuthName ||
		row.unifiFullName ||
		[
			row.unifiFirstName,

			row.unifiLastName,
		]
			.filter(Boolean)
			.join(" ")
			.trim() ||
		row.betterAuthEmail ||
		row.unifiEmail ||
		row.unifiUserId ||
		"Unknown"
	);
}

function sortValue(row: AdminUnifiAccessReconciliationRow, sortBy: SortBy) {
	switch (sortBy) {
		case "email":
			return row.betterAuthEmail ?? row.unifiEmail ?? "";

		case "employeeId":
			return row.employeeId ?? row.unifiEmployeeNumber ?? "";

		case "betterAuthStatus":
			return row.betterAuthUserId
				? row.betterAuthBanned
					? "banned"
					: "active"
				: "missing";

		case "unifiStatus":
			return row.unifiStatus ?? "";

		case "reconciliationStatus":
			return row.reconciliationStatus;

		default:
			return displayName(row);
	}
}

function EmployeeIdValue({ row }: { row: AdminUnifiAccessReconciliationRow }) {
	const betterAuthId = row.employeeId?.trim() || null;

	const unifiId = row.unifiEmployeeNumber?.trim() || null;

	if (betterAuthId && unifiId && betterAuthId !== unifiId) {
		return (
			<div className="space-y-1">
				<div>BA: {betterAuthId}</div>

				<div className="text-xs text-muted-foreground">UniFi: {unifiId}</div>

				<Badge variant="secondary">Mismatch</Badge>
			</div>
		);
	}

	return betterAuthId ?? unifiId ?? "—";
}

function BetterAuthBadge({ row }: { row: AdminUnifiAccessReconciliationRow }) {
	if (!row.betterAuthUserId) {
		return <Badge variant="secondary">Not a member</Badge>;
	}

	if (row.betterAuthBanned) {
		return <Badge variant="secondary">Banned</Badge>;
	}

	return <Badge variant="outline">Active</Badge>;
}

function UniFiStatusBadge({ status }: { status: string | null }) {
	switch (status?.toUpperCase()) {
		case "ACTIVE":
			return <Badge variant="outline">Active</Badge>;

		case "DEACTIVATED":
			return <Badge variant="secondary">Deactivated</Badge>;

		case "PENDING":
			return <Badge variant="secondary">Pending</Badge>;

		default:
			return <Badge variant="secondary">{status || "Missing"}</Badge>;
	}
}

function ReconciliationBadge({
	status,
}: {
	status: AdminUnifiAccessReconciliationStatus;
}) {
	const label = {
		"in-sync": "In sync",

		"disabled-in-sync": "Disabled in sync",

		"missing-in-unifi": "Missing in UniFi",

		"disabled-better-auth-only": "Disabled BA only",

		"should-activate": "Should activate",

		"should-deactivate": "Should deactivate",

		"unifi-only": "UniFi only",
	}[status];

	return (
		<Badge
			variant={
				status === "in-sync" || status === "disabled-in-sync"
					? "outline"
					: "secondary"
			}
		>
			{label}
		</Badge>
	);
}

function getPageItems(
	currentPage: number,
	totalPages: number,
): Array<number | "ellipsis-left" | "ellipsis-right"> {
	if (totalPages <= 7) {
		return Array.from(
			{
				length: totalPages,
			},
			(_, index) => index + 1,
		);
	}

	if (currentPage <= 4) {
		return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
	}

	if (currentPage >= totalPages - 3) {
		return [
			1,
			"ellipsis-left",
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		];
	}

	return [
		1,
		"ellipsis-left",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"ellipsis-right",
		totalPages,
	];
}
