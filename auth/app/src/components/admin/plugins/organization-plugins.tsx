"use client";

import { Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { GlauthSources } from "@/components/admin/plugins/glauth-sources";
import { IntegrationLogo } from "@/components/admin/plugins/integration-logo";
import { SevenShiftsApiSources } from "@/components/admin/plugins/seven-shifts-api-sources";
import { SevenShiftsCsvSources } from "@/components/admin/plugins/seven-shifts-csv-sources";
import { UnifiApi } from "@/components/admin/plugins/unifi-api";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	setAdminOrganizationPluginEnabled,
	setAdminOrganizationPluginSyncDirection,
	type AdminGlauthSource,
	type AdminOrganizationIntegration,
	type AdminPluginDetail,
} from "@/lib/admin/plugins";
import {
	getIntegration,
	INTEGRATION_IDS,
	type IntegrationId,
} from "@/lib/plugins/integration-manager/registry";

const AVAILABLE_PLUGINS = INTEGRATION_IDS.map((pluginId) => {
	const plugin = getIntegration(pluginId);

	if (!plugin) {
		throw new Error("Missing integration definition for " + pluginId);
	}

	return {
		...plugin,
		id: pluginId,
	};
});

type OrganizationPluginsProps = {
	organization: {
		id: string;
		name: string;
	};

	integrations: AdminOrganizationIntegration[];
	pluginDetails: AdminPluginDetail[];
	glauthSources: AdminGlauthSource[];
};

export function OrganizationPlugins({
	organization,
	integrations,
	pluginDetails,
	glauthSources,
}: OrganizationPluginsProps) {
	const router = useRouter();

	const [pendingPluginId, setPendingPluginId] = useState<string | null>(null);

	const integrationById = useMemo(
		() =>
			new Map(
				integrations.map((integration) => [
					integration.pluginId,
					integration,
				]),
			),
		[integrations],
	);

	const detailById = useMemo(
		() =>
			new Map(
				pluginDetails.map((detail) => [
					detail.plugin.id,
					detail,
				]),
			),
		[pluginDetails],
	);

	const enabledIntegrations = AVAILABLE_PLUGINS.map((plugin) =>
		integrationById.get(plugin.id),
	).filter(
		(integration): integration is AdminOrganizationIntegration =>
			Boolean(integration?.enabled),
	);

	async function setPluginEnabled(pluginId: IntegrationId, enabled: boolean) {
		setPendingPluginId(pluginId);

		try {
			await setAdminOrganizationPluginEnabled({
				data: {
					pluginId,
					organizationId: organization.id,
					enabled,
				},
			});

			const plugin = getIntegration(pluginId);

			toast.success(
				plugin
					? plugin.name + (enabled ? " enabled" : " disabled")
					: "Plugin updated",
			);

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update plugin",
			);
		} finally {
			setPendingPluginId(null);
		}
	}

	async function setSyncDirection(
		integration: AdminOrganizationIntegration,
		syncDirection: AdminOrganizationIntegration["syncDirection"],
	) {
		setPendingPluginId(integration.pluginId);

		try {
			await setAdminOrganizationPluginSyncDirection({
				data: {
					pluginId: integration.pluginId,
					organizationId: organization.id,
					syncDirection,
				},
			});

			toast.success("Sync direction updated");

			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to update sync direction",
			);
		} finally {
			setPendingPluginId(null);
		}
	}

	return (
		<div className="space-y-6">
			<details className="rounded-lg border bg-card">
				<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
					<div>
						<div className="font-semibold">Available Plugins</div>

						<p className="mt-1 text-sm text-muted-foreground">
							Enable or disable developed plugins for {organization.name}.
						</p>
					</div>

					<Badge variant="secondary">
						{enabledIntegrations.length} of {AVAILABLE_PLUGINS.length} enabled
					</Badge>
				</summary>

				<div className="grid gap-3 border-t p-4 md:grid-cols-2">
					{AVAILABLE_PLUGINS.map((plugin) => {
						const integration = integrationById.get(plugin.id);

						const enabled = integration?.enabled ?? false;

						return (
							<div
								key={plugin.id}
								className="flex items-start justify-between gap-4 rounded-lg border p-4"
							>
								<div className="flex min-w-0 gap-3">
									<IntegrationLogo pluginId={plugin.id} name={plugin.name} />

									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<div className="font-medium">{plugin.name}</div>

											<Badge variant="outline">{plugin.category}</Badge>
										</div>

										<p className="mt-1 text-sm text-muted-foreground">
											{plugin.description}
										</p>
									</div>
								</div>

								<Switch
									checked={enabled}
									disabled={pendingPluginId === plugin.id}
									aria-label={"Toggle " + plugin.name}
									onCheckedChange={(nextEnabled) =>
										void setPluginEnabled(plugin.id, nextEnabled)
									}
								/>
							</div>
						);
					})}
				</div>
			</details>

			{enabledIntegrations.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-sm text-muted-foreground">
						Enable a plugin above to show its organization configuration tab.
					</CardContent>
				</Card>
			) : (
				<Tabs defaultValue={enabledIntegrations[0].pluginId} className="w-full">
					<div className="w-full overflow-x-auto">
						<TabsList className="h-auto min-w-max justify-start rounded-none border-b bg-transparent p-0">
							{enabledIntegrations.map((integration) => {
								const plugin = getIntegration(integration.pluginId);

								return (
									<TabsTrigger
										key={integration.pluginId}
										value={integration.pluginId}
										className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
									>
										{plugin?.name ?? integration.pluginId}
									</TabsTrigger>
								);
							})}
						</TabsList>
					</div>

					{enabledIntegrations.map((integration) => (
						<TabsContent
							key={integration.pluginId}
							value={integration.pluginId}
							className="mt-6"
						>
							<PluginTabPanel
								integration={integration}
								organization={organization}
								detailById={detailById}
								glauthSources={glauthSources}
								apiIntegrationEnabled={
									integrationById.get("seven-shifts-api")?.enabled ?? false
								}
								pendingPluginId={pendingPluginId}
								onSetSyncDirection={setSyncDirection}
							/>
						</TabsContent>
					))}
				</Tabs>
			)}
		</div>
	);
}

function PluginTabPanel({
	integration,
	organization,
	detailById,
	glauthSources,
	apiIntegrationEnabled,
	pendingPluginId,
	onSetSyncDirection,
}: {
	integration: AdminOrganizationIntegration;
	organization: {
		id: string;
		name: string;
	};
	detailById: Map<string, AdminPluginDetail>;
	glauthSources: AdminGlauthSource[];
	apiIntegrationEnabled: boolean;
	pendingPluginId: string | null;
	onSetSyncDirection: (
		integration: AdminOrganizationIntegration,
		syncDirection: AdminOrganizationIntegration["syncDirection"],
	) => Promise<void>;
}) {
	const plugin = getIntegration(integration.pluginId);

	if (!plugin) {
		return null;
	}

	if (integration.pluginId === "seven-shifts-csv") {
		const csvDetail = detailById.get("seven-shifts-csv");

		const apiDetail = detailById.get("seven-shifts-api");

		return (
			<div className="space-y-6">
				<SevenShiftsCsvSources sources={csvDetail?.csvSources ?? []} />

				{!apiIntegrationEnabled && (
					<div className="space-y-3">
						<div>
							<h3 className="text-lg font-semibold">
								Shared 7shifts locations
							</h3>

							<p className="text-sm text-muted-foreground">
								CSV imports can still use 7shifts locations. Manage the
								shared API source and location mappings here when the API plugin
								tab is not enabled.
							</p>
						</div>

						<SevenShiftsApiSources
							sources={apiDetail?.apiSources ?? []}
							organizations={apiDetail?.organizations ?? []}
						/>
					</div>
				)}
			</div>
		);
	}

	if (integration.pluginId === "seven-shifts-api") {
		const detail = detailById.get("seven-shifts-api");

		return (
			<div className="space-y-6">
				<SevenShiftsApiSources
					sources={detail?.apiSources ?? []}
					organizations={detail?.organizations ?? []}
				/>

				<SyncDirectionCard
					integration={integration}
					pendingPluginId={pendingPluginId}
					onSetSyncDirection={onSetSyncDirection}
				/>
			</div>
		);
	}

	if (integration.pluginId === "unifi-api") {
		const detail = detailById.get("unifi-api");

		return (
			<UnifiApi
				accessSources={detail?.unifiAccessSources ?? []}
				organizations={detail?.organizations ?? []}
			/>
		);
	}

	if (integration.pluginId === "glauth") {
		return (
			<GlauthSources
				mode="organization"
				sources={glauthSources}
				organization={organization}
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-3">
						<IntegrationLogo pluginId={integration.pluginId} name={plugin.name} />

						<div className="min-w-0">
							<CardTitle>{plugin.name}</CardTitle>

							<CardDescription className="mt-1">
								{plugin.description}
							</CardDescription>
						</div>
					</div>

					<Badge variant="secondary">Enabled</Badge>
				</div>
			</CardHeader>

			<CardContent>
				<div className="rounded-lg border bg-muted/30 p-4">
					<div className="flex items-start gap-3">
						<Settings2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

						<div>
							<div className="font-medium">Organization Configuration</div>

							<p className="mt-1 text-sm text-muted-foreground">
								{organization.name} has {plugin.name} enabled. Organization
								settings for this plugin will appear here as the integration is
								implemented.
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function SyncDirectionCard({
	integration,
	pendingPluginId,
	onSetSyncDirection,
}: {
	integration: AdminOrganizationIntegration;
	pendingPluginId: string | null;
	onSetSyncDirection: (
		integration: AdminOrganizationIntegration,
		syncDirection: AdminOrganizationIntegration["syncDirection"],
	) => Promise<void>;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Organization sync direction</CardTitle>

				<CardDescription>
					Controls which system supplies shared user data for this organization.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Select
					value={integration.syncDirection}
					disabled={pendingPluginId === integration.pluginId}
					onValueChange={(value) =>
						void onSetSyncDirection(
							integration,
							value as AdminOrganizationIntegration["syncDirection"],
						)
					}
				>
					<SelectTrigger className="w-full sm:w-[320px]">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="to-better-auth">
							7shifts → Better Auth
						</SelectItem>

						<SelectItem value="from-better-auth">
							Better Auth → 7shifts
						</SelectItem>

						<SelectItem value="bidirectional">Bidirectional</SelectItem>
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
}
