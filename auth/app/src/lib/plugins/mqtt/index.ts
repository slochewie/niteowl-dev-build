import { randomUUID } from "node:crypto";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	encryptApiSecret,
} from "../api-source/secret.js";

type MqttOptions = {
	pool: Pool;
	encryptionKey: string;
};

type UserRoleRow = {
	role: string | null;
};

const protocolSchema = z.enum(["mqtt", "mqtts"]);

const createSourceBodySchema = z.object({
	name: z.string().trim().min(1).max(100),
	host: z.string().trim().min(1).max(255),
	port: z.number().int().min(1).max(65535),
	protocol: protocolSchema,
	username: z.string().trim().max(255).optional(),
	password: z.string().max(4096).optional(),
	enabled: z.boolean().default(true),
});

const updateSourceBodySchema = z.object({
	sourceId: z.string().min(1),
	name: z.string().trim().min(1).max(100),
	host: z.string().trim().min(1).max(255),
	port: z.number().int().min(1).max(65535),
	protocol: protocolSchema,
	username: z.string().trim().max(255).optional(),
	password: z.string().max(4096).optional(),
	enabled: z.boolean(),
});

const sourceBodySchema = z.object({
	sourceId: z.string().min(1),
});

const organizationSourcesQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const assignOrganizationBodySchema = z.object({
	sourceId: z.string().min(1),
	organizationId: z.string().min(1),
	topicPrefix: z.string().trim().min(1).max(500).optional(),
	enabled: z.boolean().default(true),
});

const unassignOrganizationBodySchema = z.object({
	sourceId: z.string().min(1),
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

	return role === "admin" || (allowReadOnly && role === "admin-viewer");
}

function normalizeTopicPrefix(value: string) {
	const trimmed = value.trim();

	return trimmed.endsWith("/") ? trimmed : trimmed + "/";
}

function defaultTopicPrefix(organizationId: string) {
	return `organizations/${organizationId}/`;
}

export const mqttIntegration = ({
	pool,
	encryptionKey,
}: MqttOptions) =>
	({
		id: "mqtt",

		endpoints: {
			listMqttBrokerSources: createAuthEndpoint(
				"/mqtt/sources",
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
						name: string;
						host: string;
						port: number;
						protocol: "mqtt" | "mqtts";
						username: string | null;
						enabled: boolean;
						hasPassword: boolean;
						organizationCount: number;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							SELECT
								s.id,
								s.name,
								s.host,
								s.port,
								s.protocol,
								s.username,
								s.enabled,
								(s.password IS NOT NULL) AS "hasPassword",
								COUNT(a.id)::int AS "organizationCount",
								s."createdAt",
								s."updatedAt"
							FROM
								"mqttBrokerSource" s
							LEFT JOIN
								"mqttOrganizationSource" a
								ON a."sourceId" = s.id
							GROUP BY
								s.id,
								s.name,
								s.host,
								s.port,
								s.protocol,
								s.username,
								s.enabled,
								s.password,
								s."createdAt",
								s."updatedAt"
							ORDER BY
								s.name ASC
						`,
					);

					const assignments = await pool.query<{
						id: string;
						sourceId: string;
						organizationId: string;
						organizationName: string;
						topicPrefix: string;
						enabled: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>(
						`
							SELECT
								a.id,
								a."sourceId",
								a."organizationId",
								o.name AS "organizationName",
								a."topicPrefix",
								a.enabled,
								a."createdAt",
								a."updatedAt"
							FROM
								"mqttOrganizationSource" a
							INNER JOIN
								organization o
								ON o.id = a."organizationId"
							ORDER BY
								o.name ASC
						`,
					);

					return ctx.json({
						sources: result.rows.map((source) => ({
							...source,
							assignments: assignments.rows.filter(
								(assignment) =>
									assignment.sourceId === source.id,
							),
						})),
					});
				},
			),

			listMqttOrganizationSources: createAuthEndpoint(
				"/mqtt/organization-sources",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: organizationSourcesQuerySchema,
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
						name: string;
						host: string;
						port: number;
						protocol: "mqtt" | "mqtts";
						username: string | null;
						enabled: boolean;
						hasPassword: boolean;
						assignmentId: string;
						topicPrefix: string;
						assignmentEnabled: boolean;
						organizationName: string;
						createdAt: Date;
						updatedAt: Date;
						assignmentCreatedAt: Date;
						assignmentUpdatedAt: Date;
					}>(
						`
							SELECT
								s.id,
								s.name,
								s.host,
								s.port,
								s.protocol,
								s.username,
								s.enabled,
								(s.password IS NOT NULL) AS "hasPassword",
								a.id AS "assignmentId",
								a."topicPrefix",
								a.enabled AS "assignmentEnabled",
								o.name AS "organizationName",
								s."createdAt",
								s."updatedAt",
								a."createdAt" AS "assignmentCreatedAt",
								a."updatedAt" AS "assignmentUpdatedAt"
							FROM
								"mqttBrokerSource" s
							INNER JOIN
								"mqttOrganizationSource" a
								ON a."sourceId" = s.id
							INNER JOIN
								organization o
								ON o.id = a."organizationId"
							WHERE
								a."organizationId" = $1
							ORDER BY
								s.name ASC
						`,
						[ctx.query.organizationId],
					);

					return ctx.json({
						sources: result.rows.map((source) => ({
							id: source.id,
							name: source.name,
							host: source.host,
							port: source.port,
							protocol: source.protocol,
							username: source.username,
							enabled: source.enabled,
							hasPassword: source.hasPassword,
							organizationCount: 1,
							createdAt: source.createdAt,
							updatedAt: source.updatedAt,
							assignments: [
								{
									id: source.assignmentId,
									sourceId: source.id,
									organizationId: ctx.query.organizationId,
									organizationName: source.organizationName,
									topicPrefix: source.topicPrefix,
									enabled: source.assignmentEnabled,
									createdAt: source.assignmentCreatedAt,
									updatedAt: source.assignmentUpdatedAt,
								},
							],
						})),
					});
				},
			),

			createMqttBrokerSource: createAuthEndpoint(
				"/mqtt/sources/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: createSourceBodySchema,
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
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

					const password = ctx.body.password
						? encryptApiSecret(
								ctx.body.password,
								encryptionKey,
							)
						: null;

					const result = await pool.query(
						`
							INSERT INTO
								"mqttBrokerSource" (
									id,
									name,
									host,
									port,
									protocol,
									username,
									password,
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
								$8,
								CURRENT_TIMESTAMP,
								CURRENT_TIMESTAMP
							)
							RETURNING
								id,
								name,
								host,
								port,
								protocol,
								username,
								enabled,
								"createdAt",
								"updatedAt"
						`,
						[
							randomUUID(),
							ctx.body.name.trim(),
							ctx.body.host.trim(),
							ctx.body.port,
							ctx.body.protocol,
							ctx.body.username?.trim() || null,
							password,
							ctx.body.enabled,
						],
					);

					return ctx.json({
						source: {
							...result.rows[0],
							hasPassword: Boolean(password),
							organizationCount: 0,
							assignments: [],
						},
					});
				},
			),

			updateMqttBrokerSource: createAuthEndpoint(
				"/mqtt/sources/update",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: updateSourceBodySchema,
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
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

					const existing = await pool.query<{
						password: string | null;
					}>(
						`
							SELECT password
							FROM "mqttBrokerSource"
							WHERE id = $1
							LIMIT 1
						`,
						[ctx.body.sourceId],
					);

					if (existing.rowCount !== 1) {
						return ctx.json(
							{
								error: "MQTT Broker Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const password = ctx.body.password
						? encryptApiSecret(
								ctx.body.password,
								encryptionKey,
							)
						: existing.rows[0].password;

					const result = await pool.query(
						`
							UPDATE
								"mqttBrokerSource"
							SET
								name = $1,
								host = $2,
								port = $3,
								protocol = $4,
								username = $5,
								password = $6,
								enabled = $7,
								"updatedAt" = CURRENT_TIMESTAMP
							WHERE
								id = $8
							RETURNING
								id,
								name,
								host,
								port,
								protocol,
								username,
								enabled,
								"createdAt",
								"updatedAt"
						`,
						[
							ctx.body.name.trim(),
							ctx.body.host.trim(),
							ctx.body.port,
							ctx.body.protocol,
							ctx.body.username?.trim() || null,
							password,
							ctx.body.enabled,
							ctx.body.sourceId,
						],
					);

					return ctx.json({
						source: {
							...result.rows[0],
							hasPassword: Boolean(password),
						},
					});
				},
			),

			assignMqttBrokerSource: createAuthEndpoint(
				"/mqtt/sources/assign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: assignOrganizationBodySchema,
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
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

					const source = await pool.query(
						`
							SELECT id
							FROM "mqttBrokerSource"
							WHERE id = $1
							LIMIT 1
						`,
						[ctx.body.sourceId],
					);

					if (source.rowCount !== 1) {
						return ctx.json(
							{
								error: "MQTT Broker Source not found",
							},
							{
								status: 404,
							},
						);
					}

					const organization = await pool.query(
						`
							SELECT id
							FROM organization
							WHERE id = $1
							LIMIT 1
						`,
						[ctx.body.organizationId],
					);

					if (organization.rowCount !== 1) {
						return ctx.json(
							{
								error: "Organization not found",
							},
							{
								status: 404,
							},
						);
					}

					const topicPrefix = normalizeTopicPrefix(
						ctx.body.topicPrefix ??
							defaultTopicPrefix(ctx.body.organizationId),
					);

					const result = await pool.query(
						`
							INSERT INTO
								"mqttOrganizationSource" (
									id,
									"organizationId",
									"sourceId",
									"topicPrefix",
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
								CURRENT_TIMESTAMP,
								CURRENT_TIMESTAMP
							)
							ON CONFLICT (
								"organizationId"
							)
							DO UPDATE SET
								"sourceId" = EXCLUDED."sourceId",
								"topicPrefix" = EXCLUDED."topicPrefix",
								enabled = EXCLUDED.enabled,
								"updatedAt" = CURRENT_TIMESTAMP
							RETURNING
								id,
								"organizationId",
								"sourceId",
								"topicPrefix",
								enabled,
								"createdAt",
								"updatedAt"
						`,
						[
							randomUUID(),
							ctx.body.organizationId,
							ctx.body.sourceId,
							topicPrefix,
							ctx.body.enabled,
						],
					);

					return ctx.json({
						assignment: result.rows[0],
					});
				},
			),

			unassignMqttBrokerSource: createAuthEndpoint(
				"/mqtt/sources/unassign",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: unassignOrganizationBodySchema,
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
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

					await pool.query(
						`
							DELETE FROM
								"mqttOrganizationSource"
							WHERE
								"organizationId" = $1
								AND "sourceId" = $2
						`,
						[
							ctx.body.organizationId,
							ctx.body.sourceId,
						],
					);

					return ctx.json({
						unassigned: true,
					});
				},
			),

			deleteMqttBrokerSource: createAuthEndpoint(
				"/mqtt/sources/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: sourceBodySchema,
				},
				async (ctx) => {
					if (
						!(await isGlobalAdmin(
							pool,
							ctx.context.session.user.id,
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
						name: string;
					}>(
						`
							DELETE FROM
								"mqttBrokerSource" s
							WHERE
								s.id = $1
								AND NOT EXISTS (
									SELECT 1
									FROM "mqttOrganizationSource" a
									WHERE a."sourceId" = s.id
								)
							RETURNING
								s.id,
								s.name
						`,
						[ctx.body.sourceId],
					);

					if (result.rowCount !== 1) {
						return ctx.json(
							{
								error:
									"MQTT Broker Source is assigned to an organization or does not exist",
							},
							{
								status: 409,
							},
						);
					}

					return ctx.json({
						deleted: true,
						source: result.rows[0],
					});
				},
			),
		},

		schema: {
			mqttBrokerSource: {
				modelName: "mqttBrokerSource",

				fields: {
					name: {
						type: "string",
						required: true,
					},

					host: {
						type: "string",
						required: true,
					},

					port: {
						type: "number",
						required: true,
						defaultValue: 1883,
					},

					protocol: {
						type: "string",
						required: true,
						defaultValue: "mqtt",
					},

					username: {
						type: "string",
						required: false,
					},

					password: {
						type: "string",
						required: false,
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: true,
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},

					updatedAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},

				indexes: [
					{
						fields: ["name"],
						unique: true,
					},
				],
			},

			mqttOrganizationSource: {
				modelName: "mqttOrganizationSource",

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

					sourceId: {
						type: "string",
						required: true,
						references: {
							model: "mqttBrokerSource",
							field: "id",
							onDelete: "cascade",
						},
					},

					topicPrefix: {
						type: "string",
						required: true,
					},

					enabled: {
						type: "boolean",
						required: true,
						defaultValue: true,
					},

					createdAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},

					updatedAt: {
						type: "date",
						required: true,
						defaultValue: () => new Date(),
					},
				},

				indexes: [
					{
						fields: ["organizationId"],
						unique: true,
					},

					{
						fields: ["sourceId"],
					},
				],
			},
		},
	}) satisfies BetterAuthPlugin;
