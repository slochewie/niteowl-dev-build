import { randomUUID } from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	encryptApiSecret,
} from "../api-source/secret.js";

type WifiOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

type OrganizationRoleRow = {
	role: string;
};

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const createNetworkBodySchema = z.object({
	organizationId: z.string().min(1),
	name: z.string().trim().min(1).max(100),
	ssid: z.string().trim().min(1).max(255),
	password: z.string().max(4096).optional(),
	hidden: z.boolean().default(false),
	enabled: z.boolean().default(true),
});

const updateNetworkBodySchema = z.object({
	networkId: z.string().min(1),
	organizationId: z.string().min(1),
	name: z.string().trim().min(1).max(100),
	ssid: z.string().trim().min(1).max(255),
	password: z.string().max(4096).optional(),
	clearPassword: z.boolean().default(false),
	hidden: z.boolean(),
	enabled: z.boolean(),
});

const deleteNetworkBodySchema = z.object({
	networkId: z.string().min(1),
	organizationId: z.string().min(1),
});

async function isGlobalAdmin(
	pool: Pool,
	userId: string,
	allowReadOnly = false,
) {
	const result = await pool.query<UserRoleRow>(
		`
			SELECT role
			FROM "user"
			WHERE id = $1
			LIMIT 1
		`,
		[userId],
	);

	const role = result.rows[0]?.role;

	return role === "admin" ||
		(allowReadOnly && role === "admin-viewer");
}

async function canManageOrganization(
	pool: Pool,
	userId: string,
	organizationId: string,
	allowReadOnly = false,
) {
	if (
		await isGlobalAdmin(
			pool,
			userId,
			allowReadOnly,
		)
	) {
		return true;
	}

	const result =
		await pool.query<OrganizationRoleRow>(
			`
				SELECT role
				FROM member
				WHERE
					"organizationId" = $1
					AND "userId" = $2
				LIMIT 1
			`,
			[
				organizationId,
				userId,
			],
		);

	const role = result.rows[0]?.role;

	return role === "owner" ||
		role === "admin";
}

async function organizationExists(
	pool: Pool,
	organizationId: string,
) {
	const result = await pool.query(
		`
			SELECT 1
			FROM organization
			WHERE id = $1
			LIMIT 1
		`,
		[organizationId],
	);

	return result.rowCount === 1;
}

async function duplicateSsidExists({
	pool,
	organizationId,
	ssid,
	excludeNetworkId,
}: {
	pool: Pool;
	organizationId: string;
	ssid: string;
	excludeNetworkId?: string;
}) {
	const result = await pool.query(
		`
			SELECT 1
			FROM "wifiNetwork"
			WHERE
				"organizationId" = $1
				AND lower(ssid) = lower($2)
				AND (
					$3::text IS NULL
					OR id <> $3
				)
			LIMIT 1
		`,
		[
			organizationId,
			ssid,
			excludeNetworkId ?? null,
		],
	);

	return result.rowCount === 1;
}

export const wifiIntegration = ({
	pool,
	encryptionKey,
}: WifiOptions) =>
	({
		id: "wifi",

		endpoints: {
			listWifiNetworks: createAuthEndpoint(
				"/wifi/networks",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
							true,
						))
					) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result = await pool.query<{
						id: string;
						organizationId: string;
						organizationName: string;
						name: string;
						ssid: string;
						hidden: boolean;
						enabled: boolean;
						hasPassword: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							SELECT
								n.id,
								n."organizationId",
								o.name AS "organizationName",
								n.name,
								n.ssid,
								n.hidden,
								n.enabled,
								(n.password IS NOT NULL) AS "hasPassword",
								n."createdAt",
								n."updatedAt"
							FROM
								"wifiNetwork" n
							INNER JOIN
								organization o
								ON o.id = n."organizationId"
							ORDER BY
								o.name ASC,
								n.name ASC
						`,
					);

					return ctx.json({
						networks: result.rows,
					});
				},
			),

			listWifiOrganizationNetworks: createAuthEndpoint(
				"/wifi/organization-networks",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: organizationQuerySchema,
				},
				async (ctx) => {
					const allowed =
						await canManageOrganization(
							pool,
							ctx.context.session.user.id,
							ctx.query.organizationId,
							true,
						);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result = await pool.query<{
						id: string;
						organizationId: string;
						organizationName: string;
						name: string;
						ssid: string;
						hidden: boolean;
						enabled: boolean;
						hasPassword: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							SELECT
								n.id,
								n."organizationId",
								o.name AS "organizationName",
								n.name,
								n.ssid,
								n.hidden,
								n.enabled,
								(n.password IS NOT NULL) AS "hasPassword",
								n."createdAt",
								n."updatedAt"
							FROM
								"wifiNetwork" n
							INNER JOIN
								organization o
								ON o.id = n."organizationId"
							WHERE
								n."organizationId" = $1
							ORDER BY
								n.name ASC
						`,
						[
							ctx.query.organizationId,
						],
					);

					return ctx.json({
						networks: result.rows,
					});
				},
			),

			createWifiNetwork: createAuthEndpoint(
				"/wifi/networks/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createNetworkBodySchema,
				},
				async (ctx) => {
					const allowed =
						await canManageOrganization(
							pool,
							ctx.context.session.user.id,
							ctx.body.organizationId,
						);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					if (
						!(await organizationExists(
							pool,
							ctx.body.organizationId,
						))
					) {
						return ctx.json(
							{
								error: "Organization not found",
							},
							{
								status: 404,
							},
						);
					}

					const ssid =
						ctx.body.ssid.trim();

					if (
						await duplicateSsidExists({
							pool,
							organizationId:
								ctx.body.organizationId,
							ssid,
						})
					) {
						return ctx.json(
							{
								error:
									"This organization already has a WiFi network with that SSID",
							},
							{
								status: 409,
							},
						);
					}

					const password =
						ctx.body.password
							? encryptApiSecret(
									ctx.body.password,
									encryptionKey,
								)
							: null;

					const result = await pool.query<{
						id: string;
						organizationId: string;
						name: string;
						ssid: string;
						hidden: boolean;
						enabled: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							INSERT INTO
								"wifiNetwork" (
									id,
									"organizationId",
									name,
									ssid,
									password,
									hidden,
									enabled,
									"createdAt",
									"updatedAt"
								)
							VALUES (
								$1,
								$2,
								$3,
								$4,
								$5,
								$6,
								$7,
								CURRENT_TIMESTAMP,
								CURRENT_TIMESTAMP
							)
							RETURNING
								id,
								"organizationId",
								name,
								ssid,
								hidden,
								enabled,
								"createdAt",
								"updatedAt"
						`,
						[
							randomUUID(),
							ctx.body.organizationId,
							ctx.body.name.trim(),
							ssid,
							password,
							ctx.body.hidden,
							ctx.body.enabled,
						],
					);

					return ctx.json({
						network: {
							...result.rows[0],
							hasPassword:
								Boolean(password),
						},
					});
				},
			),

			updateWifiNetwork: createAuthEndpoint(
				"/wifi/networks/update",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: updateNetworkBodySchema,
				},
				async (ctx) => {
					const allowed =
						await canManageOrganization(
							pool,
							ctx.context.session.user.id,
							ctx.body.organizationId,
						);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const existing =
						await pool.query<{
							password: string | null;
						}>(
							`
								SELECT password
								FROM "wifiNetwork"
								WHERE
									id = $1
									AND "organizationId" = $2
								LIMIT 1
							`,
							[
								ctx.body.networkId,
								ctx.body.organizationId,
							],
						);

					if (existing.rowCount !== 1) {
						return ctx.json(
							{
								error: "WiFi network not found",
							},
							{
								status: 404,
							},
						);
					}

					const ssid =
						ctx.body.ssid.trim();

					if (
						await duplicateSsidExists({
							pool,
							organizationId:
								ctx.body.organizationId,
							ssid,
							excludeNetworkId:
								ctx.body.networkId,
						})
					) {
						return ctx.json(
							{
								error:
									"This organization already has a WiFi network with that SSID",
							},
							{
								status: 409,
							},
						);
					}

					const password =
						ctx.body.clearPassword
							? null
							: ctx.body.password
								? encryptApiSecret(
										ctx.body.password,
										encryptionKey,
									)
								: existing.rows[0]
										.password;

					const result = await pool.query<{
						id: string;
						organizationId: string;
						name: string;
						ssid: string;
						hidden: boolean;
						enabled: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							UPDATE
								"wifiNetwork"
							SET
								name = $1,
								ssid = $2,
								password = $3,
								hidden = $4,
								enabled = $5,
								"updatedAt" =
									CURRENT_TIMESTAMP
							WHERE
								id = $6
								AND "organizationId" = $7
							RETURNING
								id,
								"organizationId",
								name,
								ssid,
								hidden,
								enabled,
								"createdAt",
								"updatedAt"
						`,
						[
							ctx.body.name.trim(),
							ssid,
							password,
							ctx.body.hidden,
							ctx.body.enabled,
							ctx.body.networkId,
							ctx.body.organizationId,
						],
					);

					return ctx.json({
						network: {
							...result.rows[0],
							hasPassword:
								Boolean(password),
						},
					});
				},
			),

			deleteWifiNetwork: createAuthEndpoint(
				"/wifi/networks/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: deleteNetworkBodySchema,
				},
				async (ctx) => {
					const allowed =
						await canManageOrganization(
							pool,
							ctx.context.session.user.id,
							ctx.body.organizationId,
						);

					if (!allowed) {
						return ctx.json(
							{
								error: "Forbidden",
							},
							{
								status: 403,
							},
						);
					}

					const result =
						await pool.query<{
							id: string;
							name: string;
						}>(
							`
								DELETE FROM
									"wifiNetwork"
								WHERE
									id = $1
									AND "organizationId" = $2
								RETURNING
									id,
									name
							`,
							[
								ctx.body.networkId,
								ctx.body.organizationId,
							],
						);

					if (result.rowCount !== 1) {
						return ctx.json(
							{
								error: "WiFi network not found",
							},
							{
								status: 404,
							},
						);
					}

					return ctx.json({
						deleted: true,
						network:
							result.rows[0],
					});
				},
			),
		},

		schema: {
			wifiNetwork: {
				modelName: "wifiNetwork",

				fields: {
					organizationId: {
						type: "string",
						required: true,
						references: {
							model: "organization",
							field: "id",
							onDelete: "cascade",
						},
					},

					name: {
						type: "string",
						required: true,
					},

					ssid: {
						type: "string",
						required: true,
					},

					password: {
						type: "string",
						required: false,
					},

					hidden: {
						type: "boolean",
						required: true,
						defaultValue: false,
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: true,
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () =>
							new Date(),
					},

					updatedAt: {
						type: "date",
						required: true,
						defaultValue: () =>
							new Date(),
					},
				},

				indexes: [
					{
						fields: [
							"organizationId",
							"ssid",
						],
						unique: true,
					},
				],
			},
		},
	}) satisfies BetterAuthPlugin;
