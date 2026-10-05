"use client";

import { useRouter } from "@tanstack/react-router";
import {
	Plus,
	Save,
	Trash2,
	Wifi,
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
	type AdminPluginOrganization,
	type AdminWifiNetwork,
	createAdminWifiNetwork,
	deleteAdminWifiNetwork,
	updateAdminWifiNetwork,
} from "@/lib/admin/plugins";

export function WifiNetworks({
	mode,
	networks,
	organizations = [],
	organization,
}: {
	mode: PluginComponentMode;
	networks: AdminWifiNetwork[];
	organizations?: AdminPluginOrganization[];
	organization?: {
		id: string;
		name: string;
	};
}) {
	const router = useRouter();

	const adminMode = mode === "admin";

	const [selectedOrganizationId, setSelectedOrganizationId] = useState(
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
					(item) => item.id === activeOrganizationId,
				) ?? null
			: organization ?? null;

	const organizationNetworks = useMemo(
		() =>
			networks.filter(
				(network) =>
					network.organizationId ===
					activeOrganizationId,
			),
		[networks, activeOrganizationId],
	);

	const [selectedNetworkId, setSelectedNetworkId] =
		useState("");

	const selectedNetwork = useMemo(
		() =>
			organizationNetworks.find(
				(network) =>
					network.id === selectedNetworkId,
			) ?? null,
		[
			organizationNetworks,
			selectedNetworkId,
		],
	);

	const [name, setName] = useState("");
	const [ssid, setSsid] = useState("");
	const [password, setPassword] = useState("");
	const [clearPassword, setClearPassword] =
		useState(false);
	const [hidden, setHidden] = useState(false);
	const [enabled, setEnabled] = useState(true);

	const [newName, setNewName] = useState("");
	const [newSsid, setNewSsid] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newHidden, setNewHidden] = useState(false);
	const [newEnabled, setNewEnabled] = useState(true);

	const [saving, setSaving] = useState(false);
	const [creating, setCreating] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (
			selectedNetworkId &&
			organizationNetworks.some(
				(network) =>
					network.id === selectedNetworkId,
			)
		) {
			return;
		}

		setSelectedNetworkId(
			organizationNetworks[0]?.id ?? "",
		);
	}, [
		organizationNetworks,
		selectedNetworkId,
	]);

	useEffect(() => {
		if (!selectedNetwork) {
			setName("");
			setSsid("");
			setPassword("");
			setClearPassword(false);
			setHidden(false);
			setEnabled(true);
			return;
		}

		setName(selectedNetwork.name);
		setSsid(selectedNetwork.ssid);
		setPassword("");
		setClearPassword(false);
		setHidden(selectedNetwork.hidden);
		setEnabled(selectedNetwork.enabled);
	}, [selectedNetwork]);

	useEffect(() => {
		setSelectedNetworkId("");
		setNewName("");
		setNewSsid("");
		setNewPassword("");
		setNewHidden(false);
		setNewEnabled(true);
	}, [activeOrganizationId]);

	async function createNetwork() {
		if (!activeOrganizationId) {
			toast.error("Select an organization");
			return;
		}

		const nextName = newName.trim();
		const nextSsid = newSsid.trim();

		if (!nextName) {
			toast.error("Network name is required");
			return;
		}

		if (!nextSsid) {
			toast.error("SSID is required");
			return;
		}

		setCreating(true);

		try {
			await createAdminWifiNetwork({
				data: {
					organizationId:
						activeOrganizationId,
					name: nextName,
					ssid: nextSsid,
					password:
						newPassword || undefined,
					hidden: newHidden,
					enabled: newEnabled,
				},
			});

			toast.success("WiFi network created");

			setNewName("");
			setNewSsid("");
			setNewPassword("");
			setNewHidden(false);
			setNewEnabled(true);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to create WiFi network",
			);
		} finally {
			setCreating(false);
		}
	}

	async function saveNetwork() {
		if (
			!selectedNetwork ||
			!activeOrganizationId
		) {
			return;
		}

		const nextName = name.trim();
		const nextSsid = ssid.trim();

		if (!nextName) {
			toast.error("Network name is required");
			return;
		}

		if (!nextSsid) {
			toast.error("SSID is required");
			return;
		}

		setSaving(true);

		try {
			await updateAdminWifiNetwork({
				data: {
					networkId:
						selectedNetwork.id,
					organizationId:
						activeOrganizationId,
					name: nextName,
					ssid: nextSsid,
					password:
						clearPassword
							? undefined
							: password || undefined,
					clearPassword,
					hidden,
					enabled,
				},
			});

			toast.success("WiFi network updated");

			setPassword("");
			setClearPassword(false);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update WiFi network",
			);
		} finally {
			setSaving(false);
		}
	}

	async function deleteNetwork() {
		if (
			!selectedNetwork ||
			!activeOrganizationId
		) {
			return;
		}

		setDeleting(true);

		try {
			await deleteAdminWifiNetwork({
				data: {
					networkId:
						selectedNetwork.id,
					organizationId:
						activeOrganizationId,
				},
			});

			toast.success("WiFi network deleted");

			setSelectedNetworkId("");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to delete WiFi network",
			);
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">
					WiFi Networks
				</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					{adminMode
						? "Manage organization WiFi credentials used for managed-device provisioning."
						: `Manage saved WiFi networks for ${organization?.name ?? "this organization"}.`}
				</p>
			</div>

			{adminMode && (
				<Card>
					<CardHeader>
						<CardTitle>Organization</CardTitle>
						<CardDescription>
							Choose the organization whose saved networks you want to manage.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Select
							value={selectedOrganizationId}
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
						Select an organization to manage its WiFi networks.
					</CardContent>
				</Card>
			) : (
				<>
					<Card>
						<CardHeader>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<CardTitle>
										Saved Networks
									</CardTitle>

									<CardDescription>
										{activeOrganization
											? `${activeOrganization.name} has ${organizationNetworks.length} saved network${organizationNetworks.length === 1 ? "" : "s"}.`
											: "Saved organization networks."}
									</CardDescription>
								</div>

								<Badge variant="secondary">
									{organizationNetworks.length}
								</Badge>
							</div>
						</CardHeader>

						<CardContent>
							{organizationNetworks.length === 0 ? (
								<div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
									No WiFi networks have been saved for this organization.
								</div>
							) : (
								<Select
									value={
										selectedNetwork?.id ??
										""
									}
									onValueChange={
										setSelectedNetworkId
									}
								>
									<SelectTrigger className="max-w-md">
										<SelectValue placeholder="Select network" />
									</SelectTrigger>

									<SelectContent>
										{organizationNetworks.map(
											(network) => (
												<SelectItem
													key={
														network.id
													}
													value={
														network.id
													}
												>
													{network.name} —{" "}
													{network.ssid}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							)}
						</CardContent>
					</Card>

					{selectedNetwork && (
						<Card>
							<CardHeader>
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Wifi className="size-5" />
											{selectedNetwork.name}
										</CardTitle>

										<CardDescription>
											Edit the saved network. The existing password is never displayed.
										</CardDescription>
									</div>

									<div className="flex flex-wrap gap-2">
										<Badge
											variant={
												selectedNetwork.enabled
													? "secondary"
													: "outline"
											}
										>
											{selectedNetwork.enabled
												? "Enabled"
												: "Disabled"}
										</Badge>

										{selectedNetwork.hidden && (
											<Badge variant="outline">
												Hidden
											</Badge>
										)}

										{selectedNetwork.hasPassword && (
											<Badge variant="outline">
												Password saved
											</Badge>
										)}
									</div>
								</div>
							</CardHeader>

							<CardContent className="grid gap-5">
								<div className="grid gap-4 md:grid-cols-2">
									<Field label="Network Name">
										<Input
											value={name}
											onChange={(event) =>
												setName(
													event.target.value,
												)
											}
										/>
									</Field>

									<Field label="SSID">
										<Input
											value={ssid}
											onChange={(event) =>
												setSsid(
													event.target.value,
												)
											}
										/>
									</Field>
								</div>

								<Field label="Password">
									<Input
										type="password"
										value={password}
										disabled={clearPassword}
										onChange={(event) =>
											setPassword(
												event.target.value,
											)
										}
										placeholder={
											selectedNetwork.hasPassword
												? "Leave blank to keep saved password"
												: "Optional"
										}
									/>
								</Field>

								{selectedNetwork.hasPassword && (
									<div className="flex items-center justify-between rounded-md border p-3">
										<div>
											<div className="text-sm font-medium">
												Clear saved password
											</div>

											<div className="text-xs text-muted-foreground">
												Convert this saved network to one without a password.
											</div>
										</div>

										<Switch
											checked={
												clearPassword
											}
											onCheckedChange={
												setClearPassword
											}
										/>
									</div>
								)}

								<div className="grid gap-3 md:grid-cols-2">
									<ToggleRow
										title="Hidden network"
										description="Devices must explicitly connect to this SSID."
										checked={hidden}
										onCheckedChange={
											setHidden
										}
									/>

									<ToggleRow
										title="Network enabled"
										description="Allow this network to be used for device provisioning."
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
											void saveNetwork()
										}
									>
										<Save />
										Save Network
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
													Delete WiFi network?
												</AlertDialogTitle>

												<AlertDialogDescription>
													This removes the saved SSID and encrypted credential from the organization.
												</AlertDialogDescription>
											</AlertDialogHeader>

											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>

												<AlertDialogAction
													onClick={() =>
														void deleteNetwork()
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
								Add WiFi Network
							</CardTitle>

							<CardDescription>
								Save another organization network for managed-device provisioning.
							</CardDescription>
						</CardHeader>

						<CardContent className="grid gap-5">
							<div className="grid gap-4 md:grid-cols-2">
								<Field label="Network Name">
									<Input
										value={newName}
										onChange={(event) =>
											setNewName(
												event.target.value,
											)
										}
										placeholder="Primary Network"
									/>
								</Field>

								<Field label="SSID">
									<Input
										value={newSsid}
										onChange={(event) =>
											setNewSsid(
												event.target.value,
											)
										}
										placeholder="Organization WiFi"
									/>
								</Field>
							</div>

							<Field label="Password">
								<Input
									type="password"
									value={newPassword}
									onChange={(event) =>
										setNewPassword(
											event.target.value,
										)
									}
									placeholder="Optional"
								/>
							</Field>

							<div className="grid gap-3 md:grid-cols-2">
								<ToggleRow
									title="Hidden network"
									description="Devices must explicitly connect to this SSID."
									checked={newHidden}
									onCheckedChange={
										setNewHidden
									}
								/>

								<ToggleRow
									title="Network enabled"
									description="Allow this network to be used for device provisioning."
									checked={newEnabled}
									onCheckedChange={
										setNewEnabled
									}
								/>
							</div>

							<Button
								className="w-fit"
								disabled={creating}
								onClick={() =>
									void createNetwork()
								}
							>
								<Plus />
								Add Network
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
