"use client";

import { useRouter } from "@tanstack/react-router";
import {
	Building2,
	Plus,
	RadioTower,
	Save,
	Trash2,
	Unlink,
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
	type AdminMqttSource,
	type AdminPluginOrganization,
	assignAdminMqttBrokerSource,
	createAdminMqttBrokerSource,
	deleteAdminMqttBrokerSource,
	unassignAdminMqttBrokerSource,
	updateAdminMqttBrokerSource,
} from "@/lib/admin/plugins";

const DEFAULT_MQTT_PORT = 1883;

export function MqttSources({
	mode,
	sources,
	organizations = [],
	organization,
}: {
	mode: PluginComponentMode;
	sources: AdminMqttSource[];
	organizations?: AdminPluginOrganization[];
	organization?: {
		id: string;
		name: string;
	};
}) {
	const router = useRouter();

	const adminMode = mode === "admin";

	const [selectedSourceId, setSelectedSourceId] = useState(
		sources[0]?.id ?? "",
	);

	const selectedSource = useMemo(
		() => sources.find((source) => source.id === selectedSourceId) ?? null,
		[sources, selectedSourceId],
	);

	const assignment =
		selectedSource?.assignments.find(
			(item) =>
				organization
					? item.organizationId === organization.id
					: false,
		) ?? null;

	const [sourceName, setSourceName] = useState("");
	const [sourceHost, setSourceHost] = useState("");
	const [sourcePort, setSourcePort] = useState(String(DEFAULT_MQTT_PORT));
	const [sourceProtocol, setSourceProtocol] = useState<"mqtt" | "mqtts">(
		"mqtt",
	);
	const [sourceWebsocketHost, setSourceWebsocketHost] = useState("");
	const [sourceWebsocketPort, setSourceWebsocketPort] = useState("443");
	const [sourceWebsocketProtocol, setSourceWebsocketProtocol] = useState<
		"ws" | "wss"
	>("wss");
	const [sourceUsername, setSourceUsername] = useState("");
	const [sourcePassword, setSourcePassword] = useState("");
	const [sourceEnabled, setSourceEnabled] = useState(true);

	const [newSourceName, setNewSourceName] = useState("");
	const [newSourceHost, setNewSourceHost] = useState("");
	const [newSourcePort, setNewSourcePort] = useState(
		String(DEFAULT_MQTT_PORT),
	);
	const [newSourceProtocol, setNewSourceProtocol] = useState<
		"mqtt" | "mqtts"
	>("mqtt");
	const [newSourceWebsocketHost, setNewSourceWebsocketHost] = useState("");
	const [newSourceWebsocketPort, setNewSourceWebsocketPort] = useState("443");
	const [newSourceWebsocketProtocol, setNewSourceWebsocketProtocol] = useState<
		"ws" | "wss"
	>("wss");
	const [newSourceUsername, setNewSourceUsername] = useState("");
	const [newSourcePassword, setNewSourcePassword] = useState("");
	const [newSourceEnabled, setNewSourceEnabled] = useState(true);

	const [organizationId, setOrganizationId] = useState("");
	const [topicPrefix, setTopicPrefix] = useState("");
	const [assignmentEnabled, setAssignmentEnabled] = useState(true);

	const [creating, setCreating] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [assigning, setAssigning] = useState(false);

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
		if (!selectedSource) {
			setSourceName("");
			setSourceHost("");
			setSourcePort(String(DEFAULT_MQTT_PORT));
			setSourceProtocol("mqtt");
			setSourceWebsocketHost("");
			setSourceWebsocketPort("443");
			setSourceWebsocketProtocol("wss");
			setSourceUsername("");
			setSourcePassword("");
			setSourceEnabled(true);
			return;
		}

		setSourceName(selectedSource.name);
		setSourceHost(selectedSource.host);
		setSourcePort(String(selectedSource.port));
		setSourceProtocol(selectedSource.protocol);
		setSourceWebsocketHost(selectedSource.websocketHost ?? "");
		setSourceWebsocketPort(
			selectedSource.websocketPort
				? String(selectedSource.websocketPort)
				: "443",
		);
		setSourceWebsocketProtocol(
			selectedSource.websocketProtocol ?? "wss",
		);
		setSourceUsername(selectedSource.username ?? "");
		setSourcePassword("");
		setSourceEnabled(selectedSource.enabled);
	}, [selectedSource]);

	useEffect(() => {
		if (!organization) {
			return;
		}

		setTopicPrefix(assignment?.topicPrefix ?? "");
		setAssignmentEnabled(assignment?.enabled ?? true);
	}, [assignment, organization]);

	function parsePort(value: string) {
		const port = Number(value);

		if (!Number.isInteger(port) || port < 1 || port > 65535) {
			throw new Error("Port must be between 1 and 65535");
		}

		return port;
	}

	async function createSource() {
		const name = newSourceName.trim();
		const host = newSourceHost.trim();

		if (!name || !host) {
			toast.error("Source name and broker host are required");
			return;
		}

		setCreating(true);

		try {
			await createAdminMqttBrokerSource({
				data: {
					name,
					host,
					port: parsePort(newSourcePort),
					protocol: newSourceProtocol,
					websocketHost:
						newSourceWebsocketHost.trim() || undefined,
					websocketPort: newSourceWebsocketHost.trim()
						? parsePort(newSourceWebsocketPort)
						: null,
					websocketProtocol: newSourceWebsocketHost.trim()
						? newSourceWebsocketProtocol
						: null,
					username: newSourceUsername.trim() || undefined,
					password: newSourcePassword || undefined,
					enabled: newSourceEnabled,
				},
			});

			toast.success("MQTT broker source created");

			setNewSourceName("");
			setNewSourceHost("");
			setNewSourcePort(String(DEFAULT_MQTT_PORT));
			setNewSourceProtocol("mqtt");
			setNewSourceWebsocketHost("");
			setNewSourceWebsocketPort("443");
			setNewSourceWebsocketProtocol("wss");
			setNewSourceUsername("");
			setNewSourcePassword("");
			setNewSourceEnabled(true);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to create MQTT broker source",
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
		const host = sourceHost.trim();

		if (!name || !host) {
			toast.error("Source name and broker host are required");
			return;
		}

		setSaving(true);

		try {
			await updateAdminMqttBrokerSource({
				data: {
					sourceId: selectedSource.id,
					name,
					host,
					port: parsePort(sourcePort),
					protocol: sourceProtocol,
					websocketHost:
						sourceWebsocketHost.trim() || undefined,
					websocketPort: sourceWebsocketHost.trim()
						? parsePort(sourceWebsocketPort)
						: null,
					websocketProtocol: sourceWebsocketHost.trim()
						? sourceWebsocketProtocol
						: null,
					username: sourceUsername.trim() || undefined,
					password: sourcePassword || undefined,
					enabled: sourceEnabled,
				},
			});

			toast.success("MQTT broker source updated");
			setSourcePassword("");
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update MQTT broker source",
			);
		} finally {
			setSaving(false);
		}
	}

	async function deleteSource() {
		if (!selectedSource) {
			return;
		}

		setDeleting(true);

		try {
			await deleteAdminMqttBrokerSource({
				data: {
					sourceId: selectedSource.id,
				},
			});

			toast.success("MQTT broker source deleted");
			setSelectedSourceId("");
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to delete MQTT broker source",
			);
		} finally {
			setDeleting(false);
		}
	}

	async function saveAssignment(
		nextOrganizationId: string,
		nextTopicPrefix: string,
		nextEnabled: boolean,
	) {
		if (!selectedSource) {
			return;
		}

		const prefix = nextTopicPrefix.trim();

		setAssigning(true);

		try {
			await assignAdminMqttBrokerSource({
				data: {
					sourceId: selectedSource.id,
					organizationId: nextOrganizationId,
					topicPrefix: prefix || undefined,
					enabled: nextEnabled,
				},
			});

			toast.success("MQTT organization assignment updated");
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update MQTT organization assignment",
			);
		} finally {
			setAssigning(false);
		}
	}

	async function unassign(organizationId: string) {
		if (!selectedSource) {
			return;
		}

		setAssigning(true);

		try {
			await unassignAdminMqttBrokerSource({
				data: {
					sourceId: selectedSource.id,
					organizationId,
				},
			});

			toast.success("MQTT broker source unassigned");
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to unassign MQTT broker source",
			);
		} finally {
			setAssigning(false);
		}
	}

	if (!selectedSource) {
		return (
			<div className="space-y-6">
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						{adminMode
							? "No MQTT broker sources have been created yet."
							: "No MQTT broker source is assigned to this organization."}
					</CardContent>
				</Card>

				{adminMode && (
					<CreateSourceCard
						name={newSourceName}
						setName={setNewSourceName}
						host={newSourceHost}
						setHost={setNewSourceHost}
						port={newSourcePort}
						setPort={setNewSourcePort}
						protocol={newSourceProtocol}
						setProtocol={setNewSourceProtocol}
						websocketHost={newSourceWebsocketHost}
						setWebsocketHost={setNewSourceWebsocketHost}
						websocketPort={newSourceWebsocketPort}
						setWebsocketPort={setNewSourceWebsocketPort}
						websocketProtocol={newSourceWebsocketProtocol}
						setWebsocketProtocol={setNewSourceWebsocketProtocol}
						username={newSourceUsername}
						setUsername={setNewSourceUsername}
						password={newSourcePassword}
						setPassword={setNewSourcePassword}
						enabled={newSourceEnabled}
						setEnabled={setNewSourceEnabled}
						pending={creating}
						onCreate={() => void createSource()}
					/>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">
					{adminMode ? "MQTT Broker Sources" : "MQTT Broker"}
				</h2>

				<p className="mt-1 text-sm text-muted-foreground">
					{adminMode
						? "Manage reusable MQTT broker connections and assign organizations."
						: "View the assigned broker and configure this organization's MQTT topic namespace."}
				</p>
			</div>

			{adminMode ? (
				<Select
					value={selectedSource.id}
					onValueChange={setSelectedSourceId}
				>
					<SelectTrigger className="max-w-md">
						<SelectValue placeholder="Select MQTT source" />
					</SelectTrigger>

					<SelectContent>
						{sources.map((source) => (
							<SelectItem key={source.id} value={source.id}>
								{source.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			) : (
				<Card>
					<CardHeader>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div>
								<CardTitle>{selectedSource.name}</CardTitle>
								<CardDescription className="mt-1">
									{selectedSource.protocol}://{selectedSource.host}:
									{selectedSource.port}
								</CardDescription>
							</div>

							<div className="flex flex-wrap gap-2">
								<Badge
									variant={selectedSource.enabled ? "secondary" : "outline"}
								>
									{selectedSource.enabled ? "Source enabled" : "Source disabled"}
								</Badge>

								<Badge
									variant={assignment?.enabled ? "secondary" : "outline"}
								>
									{assignment?.enabled
										? "Organization enabled"
										: "Organization disabled"}
								</Badge>
							</div>
						</div>
					</CardHeader>
				</Card>
			)}

			{adminMode && (
				<Card>
					<CardHeader>
						<CardTitle>Broker Connection</CardTitle>
						<CardDescription>
							Global connection settings. Passwords are encrypted at rest and
							are never returned to the browser.
						</CardDescription>
					</CardHeader>

					<CardContent className="grid gap-5">
						<div className="grid gap-4 md:grid-cols-2">
							<Field label="Source Name">
								<Input
									value={sourceName}
									onChange={(event) => setSourceName(event.target.value)}
								/>
							</Field>

							<Field label="Broker Host">
								<Input
									value={sourceHost}
									onChange={(event) => setSourceHost(event.target.value)}
								/>
							</Field>

							<Field label="Port">
								<Input
									inputMode="numeric"
									value={sourcePort}
									onChange={(event) => setSourcePort(event.target.value)}
								/>
							</Field>

							<Field label="Protocol">
								<Select
									value={sourceProtocol}
									onValueChange={(value) =>
										setSourceProtocol(value as "mqtt" | "mqtts")
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="mqtt">MQTT</SelectItem>
										<SelectItem value="mqtts">MQTTS</SelectItem>
									</SelectContent>
								</Select>
							</Field>

							<Field label="WebSocket Host">
								<Input
									value={sourceWebsocketHost}
									onChange={(event) =>
										setSourceWebsocketHost(event.target.value)
									}
									placeholder="mqtt.niteowl.dev"
								/>
							</Field>

							<Field label="WebSocket Port">
								<Input
									inputMode="numeric"
									value={sourceWebsocketPort}
									onChange={(event) =>
										setSourceWebsocketPort(event.target.value)
									}
								/>
							</Field>

							<Field label="WebSocket Protocol">
								<Select
									value={sourceWebsocketProtocol}
									onValueChange={(value) =>
										setSourceWebsocketProtocol(
											value as "ws" | "wss",
										)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="ws">WS</SelectItem>
										<SelectItem value="wss">WSS</SelectItem>
									</SelectContent>
								</Select>
							</Field>

							<Field label="Username">
								<Input
									value={sourceUsername}
									onChange={(event) => setSourceUsername(event.target.value)}
									placeholder="Optional"
								/>
							</Field>

							<Field label="Password">
								<Input
									type="password"
									value={sourcePassword}
									onChange={(event) => setSourcePassword(event.target.value)}
									placeholder={
										selectedSource.hasPassword
											? "Leave blank to keep saved password"
											: "Optional"
									}
								/>
							</Field>
						</div>

						<div className="flex items-center justify-between rounded-md border p-3">
							<div>
								<div className="text-sm font-medium">Source enabled</div>
								<div className="text-xs text-muted-foreground">
									Allow organizations to use this broker source.
								</div>
							</div>

							<Switch
								checked={sourceEnabled}
								onCheckedChange={setSourceEnabled}
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button disabled={saving} onClick={() => void saveSource()}>
								<Save />
								Save Broker
							</Button>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" disabled={deleting}>
										<Trash2 />
										Delete
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete MQTT broker source?</AlertDialogTitle>
										<AlertDialogDescription>
											The source can only be deleted after all organizations
											have been unassigned.
										</AlertDialogDescription>
									</AlertDialogHeader>

									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => void deleteSource()}
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

			{adminMode ? (
				<Card>
					<CardHeader>
						<CardTitle>Organizations</CardTitle>
						<CardDescription>
							Assign organizations to this broker and configure their topic
							prefixes.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">
						<div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
							<Select
								value={organizationId}
								onValueChange={setOrganizationId}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select organization" />
								</SelectTrigger>

								<SelectContent>
									{organizations.map((item) => (
										<SelectItem key={item.id} value={item.id}>
											{item.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Input
								value={topicPrefix}
								onChange={(event) => setTopicPrefix(event.target.value)}
								placeholder="organizations/{organizationId}/"
							/>

							<Button
								disabled={!organizationId || assigning}
								onClick={() =>
									void saveAssignment(
										organizationId,
										topicPrefix,
										assignmentEnabled,
									)
								}
							>
								<Plus />
								Assign
							</Button>
						</div>

						{selectedSource.assignments.length === 0 ? (
							<div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
								No organizations assigned to this broker.
							</div>
						) : (
							<div className="space-y-3">
								{selectedSource.assignments.map((item) => (
									<div
										key={item.id}
										className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center"
									>
										<Building2 className="size-4 shrink-0 text-muted-foreground" />

										<div className="min-w-0 flex-1">
											<div className="font-medium">
												{item.organizationName}
											</div>
											<div className="break-all text-sm text-muted-foreground">
												{item.topicPrefix}
											</div>
										</div>

										<Badge variant={item.enabled ? "secondary" : "outline"}>
											{item.enabled ? "Enabled" : "Disabled"}
										</Badge>

										<Button
											variant="outline"
											size="sm"
											disabled={assigning}
											onClick={() => {
												setOrganizationId(item.organizationId);
												setTopicPrefix(item.topicPrefix);
												setAssignmentEnabled(item.enabled);
											}}
										>
											Edit
										</Button>

										<Button
											variant="ghost"
											size="sm"
											disabled={assigning}
											onClick={() => void unassign(item.organizationId)}
										>
											<Unlink />
											Unassign
										</Button>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Organization MQTT Settings</CardTitle>
						<CardDescription>
							Settings used by MQTT-backed applications for {organization?.name}.
						</CardDescription>
					</CardHeader>

					<CardContent className="grid gap-5">
						<Field label="Topic Prefix">
							<Input
								value={topicPrefix}
								onChange={(event) => setTopicPrefix(event.target.value)}
								placeholder={
									organization
										? `organizations/${organization.id}/`
										: "organizations/{organizationId}/"
								}
							/>
						</Field>

						<div className="flex items-center justify-between rounded-md border p-3">
							<div>
								<div className="text-sm font-medium">
									Organization MQTT enabled
								</div>
								<div className="text-xs text-muted-foreground">
									Allow this organization to use its assigned broker.
								</div>
							</div>

							<Switch
								checked={assignmentEnabled}
								onCheckedChange={setAssignmentEnabled}
							/>
						</div>

						<Button
							className="w-fit"
							disabled={!organization || assigning}
							onClick={() =>
								organization
									? void saveAssignment(
											organization.id,
											topicPrefix,
											assignmentEnabled,
										)
									: undefined
							}
						>
							<Save />
							Save Organization Settings
						</Button>
					</CardContent>
				</Card>
			)}

			{adminMode && (
				<CreateSourceCard
					name={newSourceName}
					setName={setNewSourceName}
					host={newSourceHost}
					setHost={setNewSourceHost}
					port={newSourcePort}
					setPort={setNewSourcePort}
					protocol={newSourceProtocol}
					setProtocol={setNewSourceProtocol}
					websocketHost={newSourceWebsocketHost}
					setWebsocketHost={setNewSourceWebsocketHost}
					websocketPort={newSourceWebsocketPort}
					setWebsocketPort={setNewSourceWebsocketPort}
					websocketProtocol={newSourceWebsocketProtocol}
					setWebsocketProtocol={setNewSourceWebsocketProtocol}
					username={newSourceUsername}
					setUsername={setNewSourceUsername}
					password={newSourcePassword}
					setPassword={setNewSourcePassword}
					enabled={newSourceEnabled}
					setEnabled={setNewSourceEnabled}
					pending={creating}
					onCreate={() => void createSource()}
				/>
			)}
		</div>
	);
}

function CreateSourceCard({
	name,
	setName,
	host,
	setHost,
	port,
	setPort,
	protocol,
	setProtocol,
	websocketHost,
	setWebsocketHost,
	websocketPort,
	setWebsocketPort,
	websocketProtocol,
	setWebsocketProtocol,
	username,
	setUsername,
	password,
	setPassword,
	enabled,
	setEnabled,
	pending,
	onCreate,
}: {
	name: string;
	setName: (value: string) => void;
	host: string;
	setHost: (value: string) => void;
	port: string;
	setPort: (value: string) => void;
	protocol: "mqtt" | "mqtts";
	setProtocol: (value: "mqtt" | "mqtts") => void;
	websocketHost: string;
	setWebsocketHost: (value: string) => void;
	websocketPort: string;
	setWebsocketPort: (value: string) => void;
	websocketProtocol: "ws" | "wss";
	setWebsocketProtocol: (value: "ws" | "wss") => void;
	username: string;
	setUsername: (value: string) => void;
	password: string;
	setPassword: (value: string) => void;
	enabled: boolean;
	setEnabled: (value: boolean) => void;
	pending: boolean;
	onCreate: () => void;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<RadioTower className="size-5" />
					New MQTT Broker Source
				</CardTitle>
				<CardDescription>
					Create a reusable broker connection. Assign organizations after the
					source is created.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid gap-5">
				<div className="grid gap-4 md:grid-cols-2">
					<Field label="Source Name">
						<Input
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Primary MQTT"
						/>
					</Field>

					<Field label="Broker Host">
						<Input
							value={host}
							onChange={(event) => setHost(event.target.value)}
							placeholder="mqtt.example.com"
						/>
					</Field>

					<Field label="Port">
						<Input
							inputMode="numeric"
							value={port}
							onChange={(event) => setPort(event.target.value)}
						/>
					</Field>

					<Field label="Protocol">
						<Select
							value={protocol}
							onValueChange={(value) =>
								setProtocol(value as "mqtt" | "mqtts")
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="mqtt">MQTT</SelectItem>
								<SelectItem value="mqtts">MQTTS</SelectItem>
							</SelectContent>
						</Select>
					</Field>

					<Field label="WebSocket Host">
						<Input
							value={websocketHost}
							onChange={(event) =>
								setWebsocketHost(event.target.value)
							}
							placeholder="mqtt.niteowl.dev"
						/>
					</Field>

					<Field label="WebSocket Port">
						<Input
							inputMode="numeric"
							value={websocketPort}
							onChange={(event) =>
								setWebsocketPort(event.target.value)
							}
						/>
					</Field>

					<Field label="WebSocket Protocol">
						<Select
							value={websocketProtocol}
							onValueChange={(value) =>
								setWebsocketProtocol(value as "ws" | "wss")
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="ws">WS</SelectItem>
								<SelectItem value="wss">WSS</SelectItem>
							</SelectContent>
						</Select>
					</Field>

					<Field label="Username">
						<Input
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							placeholder="Optional"
						/>
					</Field>

					<Field label="Password">
						<Input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Optional"
						/>
					</Field>
				</div>

				<div className="flex items-center justify-between rounded-md border p-3">
					<div>
						<div className="text-sm font-medium">Source enabled</div>
						<div className="text-xs text-muted-foreground">
							Allow organization assignments to use this source.
						</div>
					</div>

					<Switch checked={enabled} onCheckedChange={setEnabled} />
				</div>

				<Button
					className="w-fit"
					disabled={pending}
					onClick={onCreate}
				>
					<Plus />
					Create Broker
				</Button>
			</CardContent>
		</Card>
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
