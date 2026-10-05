"use client";

import { useRouter } from "@tanstack/react-router";
import {
	Calculator,
	Plus,
	Save,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { PluginComponentMode } from "@/components/admin/plugins/plugin-component-mode";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
	type AdminCounterDefinition,
	type AdminPluginOrganization,
	createAdminCounterDefinition,
	deleteAdminCounterDefinition,
	updateAdminCounterDefinition,
} from "@/lib/admin/plugins";

export function CounterDefinitions({
	mode,
	counters,
	organizations = [],
	organization,
}: {
	mode: PluginComponentMode;
	counters: AdminCounterDefinition[];
	organizations?: AdminPluginOrganization[];
	organization?: {
		id: string;
		name: string;
	};
}) {
	const router = useRouter();
	const adminMode = mode === "admin";

	const [selectedOrganizationId, setSelectedOrganizationId] =
		useState(
			adminMode
				? organizations[0]?.id ?? ""
				: organization?.id ?? "",
		);

	const activeOrganizationId =
		adminMode
			? selectedOrganizationId
			: organization?.id ?? "";

	const activeOrganization =
		adminMode
			? organizations.find(
					(item) =>
						item.id === activeOrganizationId,
				) ?? null
			: organization ?? null;

	const organizationCounters = useMemo(
		() =>
			counters.filter(
				(counter) =>
					counter.organizationId ===
					activeOrganizationId,
			),
		[counters, activeOrganizationId],
	);

	const [selectedCounterId, setSelectedCounterId] =
		useState("");

	const selectedCounter = useMemo(
		() =>
			organizationCounters.find(
				(counter) =>
					counter.id === selectedCounterId,
			) ?? null,
		[
			organizationCounters,
			selectedCounterId,
		],
	);

	const [name, setName] = useState("");
	const [maxCapacity, setMaxCapacity] = useState("");
	const [allowNegative, setAllowNegative] =
		useState(false);
	const [enabled, setEnabled] = useState(true);

	const [newName, setNewName] = useState("");
	const [newMaxCapacity, setNewMaxCapacity] =
		useState("");
	const [newAllowNegative, setNewAllowNegative] =
		useState(false);

	const [saving, setSaving] = useState(false);
	const [creating, setCreating] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (
			selectedCounterId &&
			organizationCounters.some(
				(counter) =>
					counter.id === selectedCounterId,
			)
		) {
			return;
		}

		setSelectedCounterId(
			organizationCounters[0]?.id ?? "",
		);
	}, [
		organizationCounters,
		selectedCounterId,
	]);

	useEffect(() => {
		if (!selectedCounter) {
			setName("");
			setMaxCapacity("");
			setAllowNegative(false);
			setEnabled(true);
			return;
		}

		setName(selectedCounter.name);
		setMaxCapacity(
			selectedCounter.maxCapacity === null
				? ""
				: String(
						selectedCounter.maxCapacity,
					),
		);
		setAllowNegative(
			selectedCounter.allowNegative,
		);
		setEnabled(selectedCounter.enabled);
	}, [selectedCounter]);

	useEffect(() => {
		setSelectedCounterId("");
		setNewName("");
		setNewMaxCapacity("");
		setNewAllowNegative(false);
	}, [activeOrganizationId]);

	function parseCapacity(
		value: string,
	): number | null {
		const trimmed = value.trim();

		if (!trimmed) {
			return null;
		}

		const parsed = Number(trimmed);

		if (
			!Number.isInteger(parsed) ||
			parsed < 0
		) {
			throw new Error(
				"Maximum capacity must be a whole number of 0 or greater",
			);
		}

		return parsed;
	}

	async function createCounter() {
		if (!activeOrganizationId) {
			toast.error("Select an organization");
			return;
		}

		const nextName = newName.trim();

		if (!nextName) {
			toast.error("Counter name is required");
			return;
		}

		setCreating(true);

		try {
			await createAdminCounterDefinition({
				data: {
					organizationId:
						activeOrganizationId,
					name: nextName,
					maxCapacity:
						parseCapacity(
							newMaxCapacity,
						),
					allowNegative:
						newAllowNegative,
				},
			});

			toast.success("Counter created");

			setNewName("");
			setNewMaxCapacity("");
			setNewAllowNegative(false);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to create Counter",
			);
		} finally {
			setCreating(false);
		}
	}

	async function saveCounter() {
		if (
			!selectedCounter ||
			!activeOrganizationId
		) {
			return;
		}

		const nextName = name.trim();

		if (!nextName) {
			toast.error("Counter name is required");
			return;
		}

		setSaving(true);

		try {
			await updateAdminCounterDefinition({
				data: {
					organizationId:
						activeOrganizationId,
					counterId:
						selectedCounter.id,
					name: nextName,
					enabled,
					maxCapacity:
						parseCapacity(
							maxCapacity,
						),
					allowNegative,
				},
			});

			toast.success("Counter updated");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update Counter",
			);
		} finally {
			setSaving(false);
		}
	}

	async function deleteCounter() {
		if (
			!selectedCounter ||
			!activeOrganizationId
		) {
			return;
		}

		setDeleting(true);

		try {
			await deleteAdminCounterDefinition({
				data: {
					organizationId:
						activeOrganizationId,
					counterId:
						selectedCounter.id,
				},
			});

			toast.success("Counter deleted");

			setSelectedCounterId("");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to delete Counter",
			);
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">
					Counters
				</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					{adminMode
						? "Manage organization Counter definitions and operating limits."
						: `Manage Counters for ${organization?.name ?? "this organization"}.`}
				</p>
			</div>

			{adminMode && (
				<Card>
					<CardHeader>
						<CardTitle>
							Organization
						</CardTitle>

						<CardDescription>
							Choose the organization whose Counters you want to manage.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Select
							value={
								selectedOrganizationId
							}
							onValueChange={
								setSelectedOrganizationId
							}
						>
							<SelectTrigger className="max-w-md">
								<SelectValue placeholder="Select organization" />
							</SelectTrigger>

							<SelectContent>
								{organizations.map(
									(item) => (
										<SelectItem
											key={item.id}
											value={item.id}
										>
											{item.name}
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			)}

			{!activeOrganizationId ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						Select an organization to manage its Counters.
					</CardContent>
				</Card>
			) : (
				<>
					<Card>
						<CardHeader>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<CardTitle>
										Counter Definitions
									</CardTitle>

									<CardDescription>
										{activeOrganization
											? `${activeOrganization.name} has ${organizationCounters.length} Counter${organizationCounters.length === 1 ? "" : "s"}.`
											: "Organization Counters."}
									</CardDescription>
								</div>

								<Badge variant="secondary">
									{
										organizationCounters.length
									}
								</Badge>
							</div>
						</CardHeader>

						<CardContent>
							{organizationCounters.length ===
							0 ? (
								<div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
									No Counters have been created for this organization.
								</div>
							) : (
								<Select
									value={
										selectedCounter?.id ??
										""
									}
									onValueChange={
										setSelectedCounterId
									}
								>
									<SelectTrigger className="max-w-md">
										<SelectValue placeholder="Select Counter" />
									</SelectTrigger>

									<SelectContent>
										{organizationCounters.map(
											(counter) => (
												<SelectItem
													key={
														counter.id
													}
													value={
														counter.id
													}
												>
													{
														counter.name
													}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							)}
						</CardContent>
					</Card>

					{selectedCounter && (
						<Card>
							<CardHeader>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Calculator className="size-5" />
											{
												selectedCounter.name
											}
										</CardTitle>

										<CardDescription>
											Configure this Counter's operating limits.
										</CardDescription>
									</div>

									<div className="flex flex-wrap gap-2">
										<Badge
											variant={
												selectedCounter.enabled
													? "secondary"
													: "outline"
											}
										>
											{selectedCounter.enabled
												? "Enabled"
												: "Disabled"}
										</Badge>

										{selectedCounter.maxCapacity !==
											null && (
											<Badge variant="outline">
												Capacity{" "}
												{
													selectedCounter.maxCapacity
												}
											</Badge>
										)}

										{selectedCounter.allowNegative && (
											<Badge variant="outline">
												Negative allowed
											</Badge>
										)}
									</div>
								</div>
							</CardHeader>

							<CardContent className="grid gap-5">
								<div className="grid gap-4 md:grid-cols-2">
									<Field label="Counter Name">
										<Input
											value={name}
											onChange={(event) =>
												setName(
													event.target.value,
												)
											}
										/>
									</Field>

									<Field label="Maximum Capacity">
										<Input
											inputMode="numeric"
											value={
												maxCapacity
											}
											onChange={(event) =>
												setMaxCapacity(
													event.target.value,
												)
											}
											placeholder="No maximum"
										/>
									</Field>
								</div>

								<div className="grid gap-3 md:grid-cols-2">
									<ToggleRow
										title="Allow negative counts"
										description="Permit the Counter value to go below zero."
										checked={
											allowNegative
										}
										onCheckedChange={
											setAllowNegative
										}
									/>

									<ToggleRow
										title="Counter enabled"
										description="Allow this Counter to be used by assigned users."
										checked={enabled}
										onCheckedChange={
											setEnabled
										}
									/>
								</div>

								<div className="flex flex-wrap gap-2">
									<Button
										disabled={saving}
										onClick={() =>
											void saveCounter()
										}
									>
										<Save />
										Save Counter
									</Button>

									<AlertDialog>
										<AlertDialogTrigger
											asChild
										>
											<Button
												variant="destructive"
												disabled={
													deleting
												}
											>
												<Trash2 />
												Delete
											</Button>
										</AlertDialogTrigger>

										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Delete Counter?
												</AlertDialogTitle>

												<AlertDialogDescription>
													This deletes the Counter and its existing per-user Counter assignments.
												</AlertDialogDescription>
											</AlertDialogHeader>

											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>

												<AlertDialogAction
													onClick={() =>
														void deleteCounter()
													}
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Plus className="size-5" />
								Add Counter
							</CardTitle>

							<CardDescription>
								Create another Counter for this organization.
							</CardDescription>
						</CardHeader>

						<CardContent className="grid gap-5">
							<div className="grid gap-4 md:grid-cols-2">
								<Field label="Counter Name">
									<Input
										value={newName}
										onChange={(event) =>
											setNewName(
												event.target.value,
											)
										}
										placeholder="Front Door"
									/>
								</Field>

								<Field label="Maximum Capacity">
									<Input
										inputMode="numeric"
										value={
											newMaxCapacity
										}
										onChange={(event) =>
											setNewMaxCapacity(
												event.target.value,
											)
										}
										placeholder="No maximum"
									/>
								</Field>
							</div>

							<ToggleRow
								title="Allow negative counts"
								description="Permit the Counter value to go below zero."
								checked={
									newAllowNegative
								}
								onCheckedChange={
									setNewAllowNegative
								}
							/>

							<Button
								className="w-fit"
								disabled={creating}
								onClick={() =>
									void createCounter()
								}
							>
								<Plus />
								Add Counter
							</Button>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-2">
			<Label>{label}</Label>
			{children}
		</div>
	);
}

function ToggleRow({
	title,
	description,
	checked,
	onCheckedChange,
}: {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-md border p-3">
			<div>
				<div className="text-sm font-medium">
					{title}
				</div>

				<div className="text-xs text-muted-foreground">
					{description}
				</div>
			</div>

			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
			/>
		</div>
	);
}
