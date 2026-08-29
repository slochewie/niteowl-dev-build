import { createServerFn } from "@tanstack/react-start";
import { requireAdminRead, requireAdminWrite } from "@/lib/admin/access";
import { auth } from "@/lib/auth";
import type { SyncDirection } from "@/lib/plugins/integration-manager/index";
import {
	getIntegration,
	INTEGRATIONS,
	type IntegrationDefinition,
	type IntegrationId,
	isAvailableIntegrationId,
} from "@/lib/plugins/integration-manager/registry";

export type AdminPluginOrganization = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
	enabled: boolean;
	useGlobalConfiguration: boolean;
	csvSourceId: string | null;
	csvSourceName: string | null;
};

export type AdminSevenShiftsCsvSource = {
	id: string;
	name: string;
	organizationCount: number;
	createdAt: Date;
	updatedAt: Date;
};

export type AdminSevenShiftsApiSource = {
	id: string;
	name: string;
	companyId: number | null;
	companyName: string | null;
	apiVersion: string;
	organizationCount: number;
	hasAccessToken: boolean;
	lastTestedAt: Date | null;
	lastSyncAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type AdminUnifiAccessAssignment = {
	id: string;
	organizationId: string;
	organizationName: string;
	sourceId: string;
	enabled: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type AdminUnifiAccessSource = {
	id: string;
	name: string;
	url: string;
	port: number;
	verifyTls: boolean;
	enabled: boolean;
	organizationCount: number;
	hasApiToken: boolean;
	lastTestedAt: Date | null;
	lastError: string | null;
	createdAt: Date;
	updatedAt: Date;
	assignments: AdminUnifiAccessAssignment[];
};

export type AdminSevenShiftsApiLocation = {
	id: number;
	company_id: number;
	name: string;
	active?: boolean;
	city?: string | null;
	state?: string | null;
	country?: string | null;
	timezone?: string | null;
};

export type AdminSevenShiftsApiLocationMapping = {
	organizationId: string;
	organizationName: string;
	sevenShiftsLocationId: number;
	sevenShiftsLocationName: string;
};

export type AdminPluginCatalogItem = IntegrationDefinition & {
	enabledOrganizationCount: number;
};

export type AdminPluginDetail = {
	plugin: IntegrationDefinition;
	organizations: AdminPluginOrganization[];
	csvSources: AdminSevenShiftsCsvSource[];
	apiSources: AdminSevenShiftsApiSource[];
	unifiAccessSources: AdminUnifiAccessSource[];
};

async function getOrganizationsForPlugin(pluginId: IntegrationId) {
	const { request } = await requireAdminRead();

	const result = await auth.api.listIntegrationOrganizations({
		query: {
			pluginId,
		},
		headers: request.headers,
	});

	if ("error" in result) {
		throw new Error(result.error);
	}

	return result.organizations;
}

export const getAdminPluginCatalog = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminPluginCatalogItem[]> => {
	const { request } = await requireAdminRead();

	return Promise.all(
		INTEGRATIONS.map(async (plugin) => {
			if (plugin.status === "planned" || !isAvailableIntegrationId(plugin.id)) {
				return {
					...plugin,
					enabledOrganizationCount: 0,
				};
			}

			if (plugin.id === "glauth") {
				const result = await auth.api.listGlauthSources({
					headers: request.headers,
				});

				const organizationIds = new Set(
					result.sources
						.filter((source) => source.enabled)
						.flatMap((source) => source.organizationIds),
				);

				return {
					...plugin,

					enabledOrganizationCount: organizationIds.size,
				};
			}

			const organizations = await getOrganizationsForPlugin(plugin.id);

			return {
				...plugin,

				enabledOrganizationCount: organizations.filter(
					(organization) => organization.enabled,
				).length,
			};
		}),
	);
});

export const getAdminPlugin = createServerFn({
	method: "GET",
})
	.validator((data: { pluginId: string }) => data)
	.handler(async ({ data }): Promise<AdminPluginDetail> => {
		await requireAdminRead();

		const plugin = getIntegration(data.pluginId);

		if (!plugin) {
			throw new Error("Plugin not found");
		}

		if (plugin.status === "planned" || !isAvailableIntegrationId(plugin.id)) {
			return {
				plugin,
				organizations: [],
				csvSources: [],
				apiSources: [],
				unifiAccessSources: [],
			};
		}

		const organizations = await getOrganizationsForPlugin(plugin.id);

		let csvSources: AdminSevenShiftsCsvSource[] = [];

		let apiSources: AdminSevenShiftsApiSource[] = [];

		let unifiAccessSources: AdminUnifiAccessSource[] = [];

		if (plugin.id === "seven-shifts-csv") {
			const { request } = await requireAdminRead();

			const result = await auth.api.listSevenShiftsCsvSources({
				headers: request.headers,
			});

			csvSources = result.sources;
		}

		if (plugin.id === "seven-shifts-api") {
			const { request } = await requireAdminRead();

			const result = await auth.api.listSevenShiftsApiSources({
				headers: request.headers,
			});

			apiSources = result.sources;
		}

		if (plugin.id === "unifi-api") {
			const { request } = await requireAdminRead();

			const result = await auth.api.listUnifiAccessSources({
				headers: request.headers,
			});

			unifiAccessSources = result.sources;
		}

		return {
			plugin,
			organizations,
			csvSources,
			apiSources,
			unifiAccessSources,
		};
	});

export const setAdminOrganizationPluginEnabled = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			pluginId: IntegrationId;
			organizationId: string;
			enabled: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setOrganizationIntegrationEnabled({
			body: {
				pluginId: data.pluginId,
				organizationId: data.organizationId,
				enabled: data.enabled,
			},
			headers: request.headers,
		});
	});

export const setAdminSevenShiftsCsvOrganizationSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: { organizationId: string; sourceId: string | null }) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setSevenShiftsCsvOrganizationSource({
			body: {
				organizationId: data.organizationId,
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const setAdminOrganizationPluginConfigurationSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			pluginId: IntegrationId;
			organizationId: string;
			useGlobalConfiguration: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setOrganizationIntegrationConfigurationSource({
			body: {
				pluginId: data.pluginId,
				organizationId: data.organizationId,
				useGlobalConfiguration: data.useGlobalConfiguration,
			},
			headers: request.headers,
		});
	});

export const setAdminOrganizationPluginSyncDirection = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			pluginId: IntegrationId;
			organizationId: string;
			syncDirection: SyncDirection;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setOrganizationIntegrationSyncDirection({
			body: {
				pluginId: data.pluginId,
				organizationId: data.organizationId,
				syncDirection: data.syncDirection,
			},
			headers: request.headers,
		});
	});

export type AdminOrganizationIntegration = {
	pluginId: IntegrationId;
	enabled: boolean;
	useGlobalConfiguration: boolean;
	csvSourceId: string | null;
	csvSourceName: string | null;
	syncDirection: SyncDirection;
};

export const getAdminOrganizationIntegrations = createServerFn({
	method: "GET",
})
	.validator((data: { organizationId: string }) => data)
	.handler(async ({ data }): Promise<AdminOrganizationIntegration[]> => {
		const { request } = await requireAdminRead();

		const result = await auth.api.getOrganizationIntegrations({
			query: {
				organizationId: data.organizationId,
			},
			headers: request.headers,
		});

		return result.integrations
			.filter((integration) => isAvailableIntegrationId(integration.pluginId))
			.map((integration) => ({
				pluginId: integration.pluginId as IntegrationId,

				enabled: integration.enabled,

				useGlobalConfiguration: integration.useGlobalConfiguration ?? true,

				syncDirection: (integration.syncDirection ??
					"to-better-auth") as SyncDirection,

				csvSourceId: integration.csvSourceId ?? null,

				csvSourceName: integration.csvSourceName ?? null,
			}));
	});

export const createAdminSevenShiftsCsvSource = createServerFn({
	method: "POST",
})
	.validator((data: { name: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.createSevenShiftsCsvSource({
			body: {
				name: data.name,
			},
			headers: request.headers,
		});
	});

export const renameAdminSevenShiftsCsvSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string; name: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.renameSevenShiftsCsvSource({
			body: {
				sourceId: data.sourceId,
				name: data.name,
			},
			headers: request.headers,
		});
	});

export const deleteAdminSevenShiftsCsvSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.deleteSevenShiftsCsvSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const createAdminSevenShiftsApiSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: { name: string; accessToken: string; apiVersion?: string }) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.createSevenShiftsApiSource({
			body: {
				name: data.name,
				accessToken: data.accessToken,
				...(data.apiVersion
					? {
							apiVersion: data.apiVersion,
						}
					: {}),
			},
			headers: request.headers,
		});
	});

export const updateAdminSevenShiftsApiSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			sourceId: string;
			name: string;
			accessToken?: string;
			apiVersion?: string;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.updateSevenShiftsApiSource({
			body: {
				sourceId: data.sourceId,
				name: data.name,
				...(data.accessToken
					? {
							accessToken: data.accessToken,
						}
					: {}),
				...(data.apiVersion
					? {
							apiVersion: data.apiVersion,
						}
					: {}),
			},
			headers: request.headers,
		});
	});

export const testAdminSevenShiftsApiSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		const response = await auth.api.testSevenShiftsApiSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
			asResponse: true,
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(
				typeof result?.error === "string"
					? result.error
					: "7shifts connection test failed",
			);
		}

		return result;
	});

export const getAdminSevenShiftsApiLocations = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.listSevenShiftsApiLocations({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const assignAdminSevenShiftsApiLocation = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			sourceId: string;
			organizationId: string;
			sevenShiftsLocationId: number;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.assignSevenShiftsApiLocation({
			body: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
				sevenShiftsLocationId: data.sevenShiftsLocationId,
			},
			headers: request.headers,
		});
	});

export const deleteAdminSevenShiftsApiSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.deleteSevenShiftsApiSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const unassignAdminSevenShiftsApiLocation = createServerFn({
	method: "POST",
})
	.validator(
		(data: { sourceId: string; sevenShiftsLocationId: number }) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.unassignSevenShiftsApiLocation({
			body: {
				sourceId: data.sourceId,
				sevenShiftsLocationId: data.sevenShiftsLocationId,
			},
			headers: request.headers,
		});
	});

export const createAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			name: string;
			url: string;
			port: number;
			apiToken: string;
			verifyTls: boolean;
			enabled: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.createUnifiAccessSource({
			body: {
				name: data.name,
				url: data.url,
				port: data.port,
				apiToken: data.apiToken,
				verifyTls: data.verifyTls,
				enabled: data.enabled,
			},
			headers: request.headers,
		});
	});

export const updateAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			sourceId: string;
			name: string;
			url: string;
			port: number;
			apiToken?: string;
			verifyTls: boolean;
			enabled: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.updateUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
				name: data.name,
				url: data.url,
				port: data.port,
				verifyTls: data.verifyTls,
				enabled: data.enabled,
				...(data.apiToken
					? {
							apiToken: data.apiToken,
						}
					: {}),
			},
			headers: request.headers,
		});
	});

export const testAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.testUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const assignAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: { sourceId: string; organizationId: string; enabled: boolean }) =>
			data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.assignUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
				enabled: data.enabled,
			},
			headers: request.headers,
		});
	});

export const unassignAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string; organizationId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.unassignUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
			},
			headers: request.headers,
		});
	});

export const deleteAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.deleteUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const previewAdminSevenShiftsApiSync = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		const response = await auth.api.previewSevenShiftsApiSync({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
			asResponse: true,
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(
				typeof result?.error === "string"
					? result.error
					: "Unable to preview 7shifts synchronization",
			);
		}

		return result;
	});

export const syncAdminSevenShiftsApiSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		const response = await auth.api.syncSevenShiftsApiSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
			asResponse: true,
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(
				typeof result?.error === "string"
					? result.error
					: "7shifts synchronization failed",
			);
		}

		return result;
	});

export type AdminGlauthSource = {
	id: string;
	name: string;
	slug: string;
	baseDn: string;
	backendName: string | null;
	runtimeSchema: string | null;
	runtimePort: number | null;
	runtimeStatus: string;
	uidStart: number;
	gidNumber: number;
	userGroupName: string;
	enabled: boolean;
	projectedUsers: number;
	activeUsers: number;
	disabledUsers: number;
	lastReconciledAt: Date | string | null;
	organizationIds: string[];
};

export const getAdminGlauthSources = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminGlauthSource[]> => {
	const { request } = await requireAdminRead();

	const result = await auth.api.listGlauthSources({
		headers: request.headers,
	});

	return result.sources;
});

export const createAdminGlauthSource = createServerFn({
	method: "POST",
})
	.validator((data: { name: string; slug: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.createGlauthSource({
			body: data,
			headers: request.headers,
		});
	});

export const updateAdminGlauthSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			sourceId: string;
			name: string;
			uidStart: number;
			gidNumber: number;
			userGroupName: string;
			enabled: boolean;
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.updateGlauthSource({
			body: data,
			headers: request.headers,
		});
	});

export const deleteAdminGlauthSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.deleteGlauthSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const setAdminGlauthOrganizationSource = createServerFn({
	method: "POST",
})
	.validator(
		(data: { organizationId: string; sourceId: string | null }) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setGlauthOrganizationSource({
			body: data,
			headers: request.headers,
		});
	});

export type AdminGlauthReconcileResult = {
	sourceId: string;
	sourceName: string;
	organizations: number;
	users: number;
	created: number;
	updated: number;
	removed: number;
	disabled: number;
};

export const reconcileAdminGlauthSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }): Promise<AdminGlauthReconcileResult> => {
		const { request } = await requireAdminWrite();

		return auth.api.reconcileGlauthSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export const discoverAdminUnifiAccessSource = createServerFn({
	method: "POST",
})
	.validator((data: { sourceId: string }) => data)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.discoverUnifiAccessSource({
			body: {
				sourceId: data.sourceId,
			},
			headers: request.headers,
		});
	});

export type AdminUnifiAccessUser = {
	id: string;
	unifiUserId: string;
	firstName: string | null;
	lastName: string | null;
	fullName: string | null;
	alias: string | null;
	userEmail: string | null;
	emailStatus: string | null;
	phone: string | null;
	employeeNumber: string | null;
	onboardTime: number | null;
	status: string | null;
	lastSeenAt: Date;
};

export type AdminUnifiAccessUsersPage = {
	source: {
		id: string;
		name: string;
	};
	users: AdminUnifiAccessUser[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

export const getAdminUnifiAccessUsers = createServerFn({
	method: "GET",
})
	.validator(
		(data: {
			sourceId: string;
			page?: number;
			pageSize?: number;
			sortBy?: "name" | "email" | "employeeNumber" | "status";
			sortDirection?: "asc" | "desc";
			status?: "all" | "active" | "deactivated";
		}) => data,
	)
	.handler(async ({ data }): Promise<AdminUnifiAccessUsersPage> => {
		const { request } = await requireAdminRead();

		return auth.api.listUnifiAccessCachedUsers({
			query: {
				sourceId: data.sourceId,
				page: data.page ?? 1,
				pageSize: data.pageSize ?? 10,
				sortBy: data.sortBy ?? "name",
				sortDirection: data.sortDirection ?? "asc",
				status: data.status ?? "all",
			},
			headers: request.headers,
		});
	});

export const provisionAdminUnifiAccessUser = createServerFn({
	method: "POST",
})
	.validator(
		(data: { sourceId: string; organizationId: string; userId: string }) =>
			data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.provisionUnifiAccessUser({
			body: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
				userId: data.userId,
			},
			headers: request.headers,
		});
	});

export const setAdminUnifiAccessUserStatus = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			sourceId: string;
			organizationId: string;
			userId: string;
			status: "ACTIVE" | "DEACTIVATED";
		}) => data,
	)
	.handler(async ({ data }) => {
		const { request } = await requireAdminWrite();

		return auth.api.setUnifiAccessUserStatus({
			body: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
				userId: data.userId,
				status: data.status,
			},
			headers: request.headers,
		});
	});

export type AdminUnifiAccessReconciliationStatus =
	| "in-sync"
	| "disabled-in-sync"
	| "missing-in-unifi"
	| "disabled-better-auth-only"
	| "should-activate"
	| "should-deactivate"
	| "unifi-only";

export type AdminUnifiAccessReconciliationRow = {
	betterAuthUserId: string | null;
	betterAuthName: string | null;
	betterAuthEmail: string | null;
	betterAuthRole: string | null;
	betterAuthBanned: boolean | null;
	banReason: string | null;
	banExpires: Date | null;
	employeeId: string | null;

	cachedUnifiUserId: string | null;
	unifiUserId: string | null;
	unifiFullName: string | null;
	unifiFirstName: string | null;
	unifiLastName: string | null;
	unifiEmail: string | null;
	unifiEmployeeNumber: string | null;
	unifiStatus: string | null;

	reconciliationStatus: AdminUnifiAccessReconciliationStatus;
};

export type AdminUnifiAccessReconciliation = {
	source: {
		id: string;
		name: string;
	};

	organization: {
		id: string;
		name: string;
	};

	assignmentEnabled: boolean;

	summary: {
		total: number;
		inSync: number;
		disabledInSync: number;
		missingInUnifi: number;
		disabledBetterAuthOnly: number;
		shouldActivate: number;
		shouldDeactivate: number;
		unifiOnly: number;
	};

	rows: AdminUnifiAccessReconciliationRow[];
};

export const getAdminUnifiAccessReconciliation = createServerFn({
	method: "GET",
})
	.validator((data: { sourceId: string; organizationId: string }) => data)
	.handler(async ({ data }): Promise<AdminUnifiAccessReconciliation> => {
		const { request } = await requireAdminRead();

		return auth.api.reconcileUnifiAccessSource({
			query: {
				sourceId: data.sourceId,
				organizationId: data.organizationId,
			},
			headers: request.headers,
		});
	});
