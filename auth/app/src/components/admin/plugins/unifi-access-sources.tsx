"use client";

import { useRouter } from "@tanstack/react-router";
import {
	Building2,
	KeyRound,
	Plus,
	Save,
	TestTube2,
	Trash2,
	Unlink,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
	type AdminUnifiAccessSource,
	assignAdminUnifiAccessSource,
	createAdminUnifiAccessSource,
	deleteAdminUnifiAccessSource,
	discoverAdminUnifiAccessSource,
	testAdminUnifiAccessSource,
	unassignAdminUnifiAccessSource,
	updateAdminUnifiAccessSource,
} from "@/lib/admin/plugins";

type UnifiAccessDiscoveryResult = {
	success: boolean;
	counts: {
		users: number;
		groups: number;
		wifiResources: number;
		vpnResources: number;
		evStationResources: number;
	};
};

import { UnifiAccessReconciliation } from "@/components/admin/plugins/unifi-access-reconciliation";
import { UnifiAccessUsers } from "@/components/admin/plugins/unifi-access-users";

const DEFAULT_ACCESS_PORT = 12445;

export function UnifiAccessSources({
	sources,
	organizations,
}: {
	sources: AdminUnifiAccessSource[];
	organizations: AdminPluginOrganization[];
}) {
	const router = useRouter();

	const [selectedSourceId, setSelectedSourceId] = useState(
		sources[0]?.id ?? "",
	);

	const selectedSource = useMemo(
		() => sources.find((source) => source.id === selectedSourceId) ?? null,
		[sources, selectedSourceId],
	);

	const [sourceName, setSourceName] = useState("");

	const [sourceUrl, setSourceUrl] = useState("");

	const [sourcePort, setSourcePort] = useState(String(DEFAULT_ACCESS_PORT));

	const [sourceToken, setSourceToken] = useState("");

	const [sourceVerifyTls, setSourceVerifyTls] = useState(true);

	const [sourceEnabled, setSourceEnabled] = useState(true);

	const [newSourceName, setNewSourceName] = useState("");

	const [newSourceUrl, setNewSourceUrl] = useState("");

	const [newSourcePort, setNewSourcePort] = useState(
		String(DEFAULT_ACCESS_PORT),
	);

	const [newSourceToken, setNewSourceToken] = useState("");

	const [newSourceVerifyTls, setNewSourceVerifyTls] = useState(false);

	const [newSourceEnabled, setNewSourceEnabled] = useState(false);

	const [creating, setCreating] = useState(false);

	const [saving, setSaving] = useState(false);

	const [testing, setTesting] = useState(false);

	const [discovering, setDiscovering] = useState(false);

	const [discovery, setDiscovery] = useState<UnifiAccessDiscoveryResult | null>(
		null,
	);

	const [deleting, setDeleting] = useState(false);

	const [pendingOrganizationId, setPendingOrganizationId] = useState<
		string | null
	>(null);

	const [usersRefreshKey, setUsersRefreshKey] = useState(0);

	useEffect(() => {
		if (
			selectedSourceId &&
			sources.some((source) => source.id === selectedSourceId)
		) {
			return;
		}

		setSelectedSourceId(sources[0]?.id ?? "");
	}, [sources, selectedSourceId]);

	useEffect(() => {
		setDiscovery(null);

		if (!selectedSource) {
			setSourceName("");
			setSourceUrl("");
			setSourcePort(String(DEFAULT_ACCESS_PORT));
			setSourceToken("");
			setSourceVerifyTls(true);
			setSourceEnabled(true);
			return;
		}

		setSourceName(selectedSource.name);

		setSourceUrl(selectedSource.url);

		setSourcePort(String(selectedSource.port));

		setSourceToken("");

		setSourceVerifyTls(selectedSource.verifyTls);

		setSourceEnabled(selectedSource.enabled);
	}, [selectedSource]);

	function parsePort(value: string) {
		const port = Number(value);

		if (!Number.isInteger(port) || port < 1 || port > 65535) {
			throw new Error("Port must be between 1 and 65535");
		}

		return port;
	}

	async function createSource() {
		const name = newSourceName.trim();

		const url = newSourceUrl.trim();

		const token = newSourceToken.trim();

		if (!name) {
			toast.error("Source name is required");
			return;
		}

		if (!url) {
			toast.error("URL is required");
			return;
		}

		if (!token) {
			toast.error("API token is required");
			return;
		}

		setCreating(true);

		try {
			const result = await createAdminUnifiAccessSource({
				data: {
					name,
					url,
					port: parsePort(newSourcePort),
					apiToken: token,
					verifyTls: newSourceVerifyTls,
					enabled: newSourceEnabled,
				},
			});

			toast.success("UniFi Access Source created");

			setNewSourceName("");
			setNewSourceUrl("");
			setNewSourcePort(String(DEFAULT_ACCESS_PORT));
			setNewSourceToken("");
			setNewSourceVerifyTls(false);
			setNewSourceEnabled(false);

			if (result.source?.id) {
				setSelectedSourceId(result.source.id);
			}

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to create UniFi Access Source",
			);
		} finally {
			setCreating(false);
		}
	}

	async function saveSource() {
		if (!selectedSource) {
			return;
		}

		const name = sourceName.trim();

		const url = sourceUrl.trim();

		if (!name) {
			toast.error("Source name is required");
			return;
		}

		if (!url) {
			toast.error("URL is required");
			return;
		}

		setSaving(true);

		try {
			await updateAdminUnifiAccessSource({
				data: {
					sourceId: selectedSource.id,
					name,
					url,
					port: parsePort(sourcePort),
					verifyTls: sourceVerifyTls,
					enabled: sourceEnabled,
					...(sourceToken.trim()
						? {
								apiToken: sourceToken.trim(),
							}
						: {}),
				},
			});

			setSourceToken("");

			toast.success("UniFi Access Source saved");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to save UniFi Access Source",
			);
		} finally {
			setSaving(false);
		}
	}

	async function testSource() {
		if (!selectedSource) {
			return;
		}

		setTesting(true);

		try {
			await testAdminUnifiAccessSource({
				data: {
					sourceId: selectedSource.id,
				},
			});

			toast.success("UniFi Access connection successful");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "UniFi Access connection failed",
			);

			await router.invalidate();
		} finally {
			setTesting(false);
		}
	}

	async function discoverSource() {
		if (!selectedSource) {
			return;
		}

		setDiscovering(true);

		try {
			const result = await discoverAdminUnifiAccessSource({
				data: {
					sourceId: selectedSource.id,
				},
			});

			setDiscovery(result as UnifiAccessDiscoveryResult);

			setUsersRefreshKey((value) => value + 1);

			toast.success("UniFi Access discovery completed");
		} catch (error) {
			setDiscovery(null);

			toast.error(
				error instanceof Error
					? error.message
					: "Unable to discover UniFi Access data",
			);
		} finally {
			setDiscovering(false);
		}
	}

	async function deleteSource() {
		if (!selectedSource) {
			return;
		}

		setDeleting(true);

		try {
			await deleteAdminUnifiAccessSource({
				data: {
					sourceId: selectedSource.id,
				},
			});

			toast.success("UniFi Access Source deleted");

			setSelectedSourceId("");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to delete UniFi Access Source",
			);
		} finally {
			setDeleting(false);
		}
	}

	async function assignOrganization(organizationId: string) {
		if (!selectedSource) {
			return;
		}

		setPendingOrganizationId(organizationId);

		try {
			await assignAdminUnifiAccessSource({
				data: {
					sourceId: selectedSource.id,
					organizationId,
					enabled: true,
				},
			});

			toast.success("Organization assigned");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to assign organization",
			);
		} finally {
			setPendingOrganizationId(null);
		}
	}

	async function setAssignmentEnabled(
		sourceId: string,
		organizationId: string,
		enabled: boolean,
	) {
		setPendingOrganizationId(organizationId);

		try {
			await assignAdminUnifiAccessSource({
				data: {
					sourceId,
					organizationId,
					enabled,
				},
			});

			toast.success(
				enabled
					? "Organization connection enabled"
					: "Organization connection disabled",
			);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update organization connection",
			);
		} finally {
			setPendingOrganizationId(null);
		}
	}

	async function unassignOrganization(
		sourceId: string,
		organizationId: string,
	) {
		setPendingOrganizationId(organizationId);

		try {
			await unassignAdminUnifiAccessSource({
				data: {
					sourceId,
					organizationId,
				},
			});

			toast.success("Organization unassigned");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to unassign organization",
			);
		} finally {
			setPendingOrganizationId(null);
		}
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Access API Sources</CardTitle>

					<CardDescription>
						Create reusable UniFi Access API connections and assign
						organizations to them.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{sources.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No UniFi Access API Sources have been created.
						</p>
					) : (
						<div className="space-y-2">
							<Label>API Source</Label>

							<Select
								value={selectedSourceId}
								onValueChange={setSelectedSourceId}
							>
								<SelectTrigger className="w-full sm:max-w-md">
									<SelectValue placeholder="Select Access API Source" />
								</SelectTrigger>

								<SelectContent>
									{sources.map((source) => (
										<SelectItem key={source.id} value={source.id}>
											{source.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{selectedSource && (
				<>
					<UnifiAccessUsers
						sourceId={selectedSource.id}
						sourceName={selectedSource.name}
						refreshKey={usersRefreshKey}
					/>

					<UnifiAccessReconciliation
						sourceId={selectedSource.id}
						sourceName={selectedSource.name}
						organizations={organizations.filter((organization) =>
							selectedSource.assignments.some(
								(assignment) => assignment.organizationId === organization.id,
							),
						)}
						refreshKey={usersRefreshKey}
						onChanged={() => setUsersRefreshKey((value) => value + 1)}
					/>

					<Card>
						<CardHeader>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<CardTitle>{selectedSource.name}</CardTitle>

									<CardDescription>
										UniFi Access API connection settings.
									</CardDescription>
								</div>

								<div className="flex flex-wrap gap-2">
									<Badge
										variant={selectedSource.enabled ? "default" : "secondary"}
									>
										{selectedSource.enabled ? "Enabled" : "Disabled"}
									</Badge>

									<Badge variant="outline">
										{selectedSource.organizationCount} organization
										{selectedSource.organizationCount === 1 ? "" : "s"}
									</Badge>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-5">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="unifi-access-source-name">Name</Label>

									<Input
										id="unifi-access-source-name"
										value={sourceName}
										onChange={(event) => setSourceName(event.target.value)}
									/>
								</div>

								<div className="flex items-end">
									<div className="flex w-full items-center justify-between rounded-md border px-4 py-3">
										<div>
											<Label>Enabled</Label>

											<p className="text-xs text-muted-foreground">
												Allow this API Source to be used.
											</p>
										</div>

										<Switch
											checked={sourceEnabled}
											onCheckedChange={setSourceEnabled}
										/>
									</div>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
								<div className="space-y-2">
									<Label htmlFor="unifi-access-source-url">URL</Label>

									<Input
										id="unifi-access-source-url"
										value={sourceUrl}
										onChange={(event) => setSourceUrl(event.target.value)}
										placeholder="https://192.168.101.6"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="unifi-access-source-port">Port</Label>

									<Input
										id="unifi-access-source-port"
										inputMode="numeric"
										value={sourcePort}
										onChange={(event) => setSourcePort(event.target.value)}
										placeholder="12445"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="unifi-access-source-token">API Token</Label>

								<Input
									id="unifi-access-source-token"
									type="password"
									value={sourceToken}
									onChange={(event) => setSourceToken(event.target.value)}
									placeholder="Leave blank to keep the current API token"
								/>

								<p className="text-xs text-muted-foreground">
									The existing encrypted token is preserved when this field is
									left blank.
								</p>
							</div>

							<div className="flex items-center justify-between rounded-md border px-4 py-3">
								<div>
									<Label>Verify TLS</Label>

									<p className="text-xs text-muted-foreground">
										Verify the UniFi console’s TLS certificate and hostname.
										Disable this for private-IP consoles using self-signed or
										otherwise untrusted certificates.
									</p>
								</div>

								<Switch
									checked={sourceVerifyTls}
									onCheckedChange={setSourceVerifyTls}
								/>
							</div>

							{selectedSource.lastTestedAt && (
								<p className="text-sm text-muted-foreground">
									Last successful test:{" "}
									{new Date(selectedSource.lastTestedAt).toLocaleString()}
								</p>
							)}

							{selectedSource.lastError && (
								<div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
									{selectedSource.lastError}
								</div>
							)}

							<div className="flex flex-wrap gap-2">
								<Button
									onClick={() => void saveSource()}
									disabled={saving || testing || deleting}
								>
									<Save />
									{saving ? "Saving…" : "Save"}
								</Button>

								<Button
									variant="outline"
									onClick={() => void testSource()}
									disabled={saving || testing || deleting}
								>
									<TestTube2 />
									{testing ? "Testing…" : "Test Connection"}
								</Button>

								<Button
									variant="outline"
									onClick={() => void discoverSource()}
									disabled={saving || testing || discovering || deleting}
								>
									{discovering ? "Discovering…" : "Discover"}
								</Button>

								{discovery && (
									<div className="flex flex-wrap items-center gap-2">
										<Badge variant="outline">
											Users {discovery.counts.users}
										</Badge>

										<Badge variant="outline">
											Groups {discovery.counts.groups}
										</Badge>

										<Badge variant="outline">
											WiFi {discovery.counts.wifiResources}
										</Badge>

										<Badge variant="outline">
											VPN {discovery.counts.vpnResources}
										</Badge>

										<Badge variant="outline">
											EV Station {discovery.counts.evStationResources}
										</Badge>
									</div>
								)}

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="destructive"
											disabled={
												saving ||
												testing ||
												discovering ||
												deleting ||
												selectedSource.organizationCount > 0
											}
										>
											<Trash2 />
											Delete
										</Button>
									</AlertDialogTrigger>

									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Delete UniFi Access Source?
											</AlertDialogTitle>

											<AlertDialogDescription>
												This permanently deletes the API Source and its stored
												API token. Organizations must be unassigned first.
											</AlertDialogDescription>
										</AlertDialogHeader>

										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>

											<AlertDialogAction onClick={() => void deleteSource()}>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Organizations</CardTitle>

							<CardDescription>
								Assign organizations to this UniFi Access API Source.
							</CardDescription>
						</CardHeader>

						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<div className="min-w-[760px]">
									<div className="grid grid-cols-[minmax(260px,1fr)_minmax(220px,300px)_140px] items-center gap-4 border-y px-6 py-3 text-sm font-medium text-muted-foreground">
										<div>Organization</div>

										<div>API Source</div>

										<div>Actions</div>
									</div>

									{organizations.map((organization, index) => {
										const currentSource =
											sources.find((source) =>
												source.assignments.some(
													(assignment) =>
														assignment.organizationId === organization.id,
												),
											) ?? null;

										const assignment =
											currentSource?.assignments.find(
												(item) => item.organizationId === organization.id,
											) ?? null;

										const pending = pendingOrganizationId === organization.id;

										return (
											<div
												key={organization.id}
												className={[
													"grid grid-cols-[minmax(260px,1fr)_minmax(220px,300px)_140px] items-center gap-4 px-6 py-4",
													index > 0 ? "border-t" : "",
												].join(" ")}
											>
												<div className="flex min-w-0 items-center gap-3">
													<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
														{organization.logo ? (
															<img
																src={organization.logo}
																alt=""
																className="size-full object-cover"
															/>
														) : (
															<Building2 className="size-5 text-muted-foreground" />
														)}
													</div>

													<div className="min-w-0">
														<div className="truncate font-medium">
															{organization.name}
														</div>

														<div className="truncate text-sm text-muted-foreground">
															/{organization.slug}
														</div>
													</div>
												</div>

												<div>
													{currentSource && assignment ? (
														<div className="flex items-center gap-3">
															<Switch
																checked={assignment.enabled}
																disabled={pending}
																onCheckedChange={(enabled) =>
																	void setAssignmentEnabled(
																		currentSource.id,
																		organization.id,
																		enabled,
																	)
																}
															/>

															<div>
																<div className="text-sm font-medium">
																	{currentSource.name}
																</div>

																<div className="text-xs text-muted-foreground">
																	{assignment.enabled ? "Enabled" : "Disabled"}
																</div>
															</div>
														</div>
													) : (
														<span className="text-sm text-muted-foreground">
															Unassigned
														</span>
													)}
												</div>

												<div className="flex items-center justify-end gap-2">
													{currentSource && assignment ? (
														currentSource.id === selectedSource.id ? (
															<Button
																size="sm"
																variant="outline"
																disabled={pending}
																onClick={() =>
																	void unassignOrganization(
																		currentSource.id,
																		organization.id,
																	)
																}
															>
																<Unlink />
																Unassign
															</Button>
														) : (
															<Button
																size="sm"
																variant="outline"
																disabled={pending}
																onClick={() =>
																	void assignOrganization(organization.id)
																}
															>
																<Plus />
																Reassign
															</Button>
														)
													) : (
														<Button
															size="sm"
															variant="outline"
															disabled={pending}
															onClick={() =>
																void assignOrganization(organization.id)
															}
														>
															<Plus />
															Assign
														</Button>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}

			<Card>
				<CardHeader>
					<div className="flex items-start gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
							<KeyRound className="size-5" />
						</div>

						<div>
							<CardTitle>Create Access API Source</CardTitle>

							<CardDescription>
								Add another UniFi Access console connection.
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-5">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="unifi-access-new-name">Name</Label>

							<Input
								id="unifi-access-new-name"
								value={newSourceName}
								onChange={(event) => setNewSourceName(event.target.value)}
								placeholder="McCarthy’s Access"
							/>
						</div>

						<div className="flex items-end">
							<div className="flex w-full items-center justify-between rounded-md border px-4 py-3">
								<div>
									<Label>Enabled</Label>

									<p className="text-xs text-muted-foreground">
										Enable this source when it is ready for use.
									</p>
								</div>

								<Switch
									checked={newSourceEnabled}
									onCheckedChange={setNewSourceEnabled}
								/>
							</div>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
						<div className="space-y-2">
							<Label htmlFor="unifi-access-new-url">URL</Label>

							<Input
								id="unifi-access-new-url"
								value={newSourceUrl}
								onChange={(event) => setNewSourceUrl(event.target.value)}
								placeholder="https://192.168.101.6"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="unifi-access-new-port">Port</Label>

							<Input
								id="unifi-access-new-port"
								inputMode="numeric"
								value={newSourcePort}
								onChange={(event) => setNewSourcePort(event.target.value)}
								placeholder="12445"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="unifi-access-new-token">API Token</Label>

						<Input
							id="unifi-access-new-token"
							type="password"
							value={newSourceToken}
							onChange={(event) => setNewSourceToken(event.target.value)}
							placeholder="UniFi Access API token"
						/>
					</div>

					<div className="flex items-center justify-between rounded-md border px-4 py-3">
						<div>
							<Label>Verify TLS</Label>

							<p className="text-xs text-muted-foreground">
								Verify the UniFi console’s TLS certificate and hostname. Disable
								this for private-IP consoles using self-signed or otherwise
								untrusted certificates.
							</p>
						</div>

						<Switch
							checked={newSourceVerifyTls}
							onCheckedChange={setNewSourceVerifyTls}
						/>
					</div>

					<Button onClick={() => void createSource()} disabled={creating}>
						<Plus />
						{creating ? "Creating…" : "Create Access API Source"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
