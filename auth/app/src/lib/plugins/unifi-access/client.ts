import {
	type UnifiApiResponse,
	unifiRequest,
} from "../unifi-identity/client.js";

export type UnifiAccessConnection = {
	baseUrl: string;
	apiToken: string;
	verifyTls: boolean;
};

export type UnifiAccessUser = {
	id: string;
	first_name?: string;
	last_name?: string;
	full_name?: string;
	alias?: string;
	user_email?: string;
	email_status?: string;
	phone?: string;
	employee_number?: string;
	onboard_time?: number;
	status?: "ACTIVE" | "PENDING" | "DEACTIVATED" | string;
};

export type UnifiAccessUserGroup = {
	id: string;
	name: string;
	full_name?: string;
	up_id?: string;
	up_ids?: string[];
};

export type UnifiAccessIdentityResource = {
	id: string;
	name: string;
	short_name?: string;
	deleted?: boolean;
	metadata?: unknown;
};

export type UnifiAccessIdentityResources = {
	wifi?: UnifiAccessIdentityResource[];
	vpn?: UnifiAccessIdentityResource[];
	camera?: UnifiAccessIdentityResource[];
	ev_station?: UnifiAccessIdentityResource[];
};

type Pagination = {
	page_num: number;
	page_size: number;
	total: number;
};

type SuccessResponse<T> = {
	code: string;
	msg: string;
	data?: T;
	pagination?: Pagination;
};

function requireSuccess<T>(
	response: UnifiApiResponse<SuccessResponse<T>>,
	description: string,
) {
	if (
		!response.ok ||
		!response.data ||
		typeof response.data !== "object" ||
		response.data.code !== "SUCCESS"
	) {
		throw new Error(
			`${description}: HTTP ${response.status}: ${JSON.stringify(
				response.data,
			)}`,
		);
	}

	return response.data;
}

export async function listUnifiAccessUsers(connection: UnifiAccessConnection) {
	const pageSize = 100;

	const users: UnifiAccessUser[] = [];

	let pageNum = 1;

	while (true) {
		const response = await unifiRequest<SuccessResponse<UnifiAccessUser[]>>({
			...connection,
			path: `/api/v1/developer/users?page_num=${pageNum}&page_size=${pageSize}`,
		});

		const result = requireSuccess(
			response,
			"Unable to fetch UniFi Access users",
		);

		const pageUsers = result.data ?? [];

		users.push(...pageUsers);

		const pagination = result.pagination;

		/*
		 * Prefer UniFi's pagination metadata when present.
		 */
		if (pagination) {
			if (users.length >= pagination.total) {
				break;
			}

			if (pageUsers.length === 0) {
				break;
			}

			pageNum++;
			continue;
		}

		/*
		 * Defensive fallback for older API responses that
		 * omit pagination metadata.
		 */
		if (pageUsers.length < pageSize) {
			break;
		}

		pageNum++;
	}

	return users;
}

export async function listUnifiAccessUserGroups(
	connection: UnifiAccessConnection,
) {
	const response = await unifiRequest<SuccessResponse<UnifiAccessUserGroup[]>>({
		...connection,
		path: "/api/v1/developer/user_groups",
	});

	return (
		requireSuccess(response, "Unable to fetch UniFi Access user groups").data ??
		[]
	);
}

export async function listUnifiAccessIdentityResources(
	connection: UnifiAccessConnection,
) {
	const response = await unifiRequest<
		SuccessResponse<UnifiAccessIdentityResources>
	>({
		...connection,
		path: "/api/v1/developer/users/identity/assignments?resource_type=ev_station,wifi,vpn",
	});

	return (
		requireSuccess(response, "Unable to fetch UniFi Identity resources").data ??
		{}
	);
}

export type UpdateUnifiAccessUserInput = {
	status: "ACTIVE" | "DEACTIVATED";
};

export async function updateUnifiAccessUser(
	connection: UnifiAccessConnection,
	userId: string,
	input: UpdateUnifiAccessUserInput,
) {
	const response = await unifiRequest<SuccessResponse<UnifiAccessUser>>({
		...connection,
		method: "PUT",
		path: `/api/v1/developer/users/${encodeURIComponent(userId)}`,
		body: input,
	});

	return (
		requireSuccess(response, "Unable to update UniFi Access user").data ?? null
	);
}

export type CreateUnifiAccessUserInput = {
	first_name: string;
	last_name: string;
	user_email?: string;
	employee_number?: string;
	onboard_time?: number;
};

export async function createUnifiAccessUser(
	connection: UnifiAccessConnection,
	input: CreateUnifiAccessUserInput,
) {
	const response = await unifiRequest<SuccessResponse<UnifiAccessUser>>({
		...connection,
		method: "POST",
		path: "/api/v1/developer/users",
		body: input,
	});

	const result = requireSuccess(response, "Unable to create UniFi Access user");

	if (!result.data?.id) {
		throw new Error(
			"UniFi Access created the user but did not return a user ID",
		);
	}

	return result.data;
}
