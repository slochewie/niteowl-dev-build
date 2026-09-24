import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import {
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

type InventoryOptions = {
	pool: Pool;
	internalSecret?: string;
};

type InventoryRole =
	| "viewer"
	| "staff"
	| "manager"
	| "admin";

type MembershipRow = {
	memberId: string;
	role: string;
};

type AssignmentRow = {
	memberId: string;
	userId: string;
	name: string;
	email: string;
	systemAdmin: boolean;
	membershipRole: string;
	enabled: boolean | null;
	role: string | null;
};

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const internalAccessQuerySchema =
	organizationQuerySchema.extend({
		userId: z.string().min(1),
	});


const inventoryOrganizationVariantBodySchema = z.object({
	organizationId: z.string().min(1),
	variantId: z.string().min(1),
	enabled: z.boolean().optional(),
	exportToToast: z.boolean().optional(),
	priceOverrideCents: z.number().int().nullable().optional(),
	happyHourPriceCents: z.number().int().nullable().optional(),
	toastNameOverride: z.string().nullable().optional(),
	toastCategoryOverride: z.string().nullable().optional(),
	toastDestinationOverride: z.string().nullable().optional(),
});

const inventoryOrganizationVariantsBodySchema = z.object({
	organizationId: z.string().min(1),
	variantIds: z.array(z.string().min(1)).min(1).max(500),
	enabled: z.boolean().optional(),
	exportToToast: z.boolean().optional(),
	priceOverrideCents: z.number().int().nullable().optional(),
	happyHourPriceCents: z.number().int().nullable().optional(),
	toastCategoryOverride: z.string().nullable().optional(),
	toastDestinationOverride: z.string().nullable().optional(),
});

const inventoryImportBodySchema = z.object({
	organizationId: z.string().min(1),
	sourceType: z.enum(["aloha-csv", "toast-template"]),
	sourceName: z.string().min(1),
	items: z.array(
		z.object({
			id: z.string().min(1),
			sourceItemNumber: z.string().optional(),
			name: z.string().min(1),
			category: z.string().optional(),
			toastCategory: z.string().min(1),
			toastDestination: z.string(),
			basePriceCents: z.number().int().nullable(),
			happyHourPriceCents: z.number().int().nullable(),
			status: z.enum(["ready", "review", "ignored"]),
			exportIncluded: z.boolean(),
		}),
	),
});

function normalizeInventoryRole(
	role: string | null | undefined,
): InventoryRole {
	if (
		role === "viewer" ||
		role === "staff" ||
		role === "manager" ||
		role === "admin"
	) {
		return role;
	}

	return "viewer";
}

async function isGlobalAdmin(
	pool: Pool,
	userId: string,
) {
	const result = await pool.query<{ role: string | null }>(
		`
			SELECT role
			FROM "user"
			WHERE id = $1
			LIMIT 1
		`,
		[userId],
	);

	return result.rows[0]?.role === "admin";
}

async function organizationIsEnabled(
	pool: Pool,
	organizationId: string,
) {
	const organization = await pool.query(
		`
			SELECT id
			FROM organization
			WHERE id = $1
			LIMIT 1
		`,
		[organizationId],
	);

	if (organization.rowCount !== 1) {
		return false;
	}

	const status = await pool.query<{ enabled: boolean }>(
		`
			SELECT enabled
			FROM "organizationStatus"
			WHERE "organizationId" = $1
			LIMIT 1
		`,
		[organizationId],
	);

	return status.rows[0]?.enabled !== false;
}

async function inventoryIsEnabled(
	pool: Pool,
	organizationId: string,
) {
	const result = await pool.query<{ enabled: boolean }>(
		`
			SELECT enabled
			FROM "inventoryOrganizationConfig"
			WHERE "organizationId" = $1
			LIMIT 1
		`,
		[organizationId],
	);

	return result.rows[0]?.enabled !== false;
}

async function getActiveMembership(
	pool: Pool,
	organizationId: string,
	userId: string,
) {
	const result = await pool.query<MembershipRow>(
		`
			SELECT
				m.id AS "memberId",
				m.role
			FROM member m
			INNER JOIN "user" u
				ON u.id = m."userId"
			LEFT JOIN "organizationMemberStatus" oms
				ON oms."memberId" = m.id
			WHERE
				m."organizationId" = $1
				AND m."userId" = $2
				AND COALESCE(u.banned, false) = false
				AND COALESCE(oms.active, true) = true
			LIMIT 1
		`,
		[organizationId, userId],
	);

	return result.rows[0] ?? null;
}

async function resolveInventoryAccess(
	pool: Pool,
	organizationId: string,
	userId: string,
) {
	if (
		!(await organizationIsEnabled(
			pool,
			organizationId,
		))
	) {
		return {
			allowed: false,
			role: null as InventoryRole | null,
			systemAdmin: false,
			organizationManager: false,
		};
	}

	if (
		!(await inventoryIsEnabled(
			pool,
			organizationId,
		))
	) {
		return {
			allowed: false,
			role: null as InventoryRole | null,
			systemAdmin: false,
			organizationManager: false,
		};
	}

	if (await isGlobalAdmin(pool, userId)) {
		return {
			allowed: true,
			role: "admin" as InventoryRole,
			systemAdmin: true,
			organizationManager: false,
		};
	}

	const membership = await getActiveMembership(
		pool,
		organizationId,
		userId,
	);

	if (!membership) {
		return {
			allowed: false,
			role: null as InventoryRole | null,
			systemAdmin: false,
			organizationManager: false,
		};
	}

	const organizationManager =
		membership.role === "owner" ||
		membership.role === "admin";

	if (organizationManager) {
		return {
			allowed: true,
			role: "admin" as InventoryRole,
			systemAdmin: false,
			organizationManager: true,
		};
	}

	const assignment = await pool.query<{
		enabled: boolean;
		role: string;
	}>(
		`
			SELECT
				enabled,
				role
			FROM "inventoryAssignment"
			WHERE
				"organizationId" = $1
				AND "userId" = $2
			LIMIT 1
		`,
		[organizationId, userId],
	);

	const row = assignment.rows[0];

	if (!row?.enabled) {
		return {
			allowed: false,
			role: null as InventoryRole | null,
			systemAdmin: false,
			organizationManager: false,
		};
	}

	return {
		allowed: true,
		role: normalizeInventoryRole(row.role),
		systemAdmin: false,
		organizationManager: false,
	};
}

function normalizeInventoryName(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

function getCanonicalItemName(
	name: string,
	toastCategory: string,
	toastDestination: string,
) {
	if (toastCategory.toLowerCase() !== "beer") {
		return name.trim();
	}

	const destination = toastDestination.toLowerCase();
	let normalized = name
		.replace(/\b(10\s*oz|10oz|16\s*oz|16oz|20\s*oz|20oz|24\s*oz|24oz)\b/gi, "")
		.replace(/\b(draft|pint|imperial|imp|reg|regular|can|bottle|btl|tall)\b/gi, "")
		.replace(/[\s_-]+/g, " ")
		.trim();

	if (!normalized && destination.includes("draft beer 10oz")) {
		normalized = name.replace(/10\s*oz/gi, "").trim();
	}

	return normalized || name.trim();
}

function getVariantIdentity(
	toastCategory: string,
	toastDestination: string,
) {
	const category = toastCategory.toLowerCase();
	const destination = toastDestination.toLowerCase();

	if (category === "beer") {
		if (destination.includes("draft beer 10oz")) {
			return {
				kind: "draft",
				sizeOz: 10,
				packageType: null,
				name: "10oz draft",
			};
		}

		if (destination.includes("draft beer 16oz")) {
			return {
				kind: "draft",
				sizeOz: 16,
				packageType: null,
				name: "16oz draft",
			};
		}

		if (destination.includes("24oz can")) {
			return {
				kind: "can",
				sizeOz: 24,
				packageType: "can",
				name: "24oz can",
			};
		}

		if (destination.includes("bottle")) {
			return {
				kind: "bottle",
				sizeOz: null,
				packageType: "bottle",
				name: "bottle",
			};
		}

		if (destination.includes("can")) {
			return {
				kind: "can",
				sizeOz: null,
				packageType: "can",
				name: "can",
			};
		}
	}

	return {
		kind: "standard",
		sizeOz: null,
		packageType: null,
		name: null,
	};
}

async function getOrganizationName(
	pool: Pool,
	organizationId: string,
) {
	const result = await pool.query<{ name: string }>(
		`
			SELECT name
			FROM organization
			WHERE id = $1
			LIMIT 1
		`,
		[organizationId],
	);

	return result.rows[0]?.name ?? null;
}

export const inventoryAccess = ({
	pool,
	internalSecret,
}: InventoryOptions): BetterAuthPlugin => ({
	id: "inventory",

	schema: {
		inventoryAssignment: {
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
				userId: {
					type: "string",
					required: true,
					references: {
						model: "user",
						field: "id",
						onDelete: "cascade",
					},
				},
				enabled: {
					type: "boolean",
					required: true,
					defaultValue: false,
				},
				role: {
					type: "string",
					required: true,
					defaultValue: "viewer",
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
					fields: [
						"organizationId",
						"userId",
					],
					unique: true,
				},
			],
		},

		inventoryOrganizationConfig: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
					unique: true,
					references: {
						model: "organization",
						field: "id",
						onDelete: "cascade",
					},
				},
				enabled: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				happyHourEnabled: {
					type: "boolean",
					required: true,
					defaultValue: false,
				},
				happyHourStart: {
					type: "string",
					required: false,
				},
				happyHourEnd: {
					type: "string",
					required: false,
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
		},

		inventoryCategory: {
			fields: {
				name: {
					type: "string",
					required: true,
				},
				normalizedName: {
					type: "string",
					required: true,
				},
				toastCategory: {
					type: "string",
					required: true,
				},
				sortOrder: {
					type: "number",
					required: true,
					defaultValue: 0,
				},
				active: {
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
					fields: ["normalizedName"],
					unique: true,
				},
			],
		},

		inventoryItem: {
			fields: {
				categoryId: {
					type: "string",
					required: false,
					references: {
						model: "inventoryCategory",
						field: "id",
						onDelete: "set null",
					},
				},
				name: {
					type: "string",
					required: true,
				},
				normalizedName: {
					type: "string",
					required: true,
				},
				active: {
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
					fields: ["normalizedName"],
					unique: true,
				},
				{
					fields: ["categoryId"],
				},
			],
		},

		inventoryItemAlias: {
			fields: {
				inventoryItemId: {
					type: "string",
					required: true,
					references: {
						model: "inventoryItem",
						field: "id",
						onDelete: "cascade",
					},
				},
				alias: {
					type: "string",
					required: true,
				},
				normalizedAlias: {
					type: "string",
					required: true,
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
					fields: [
						"inventoryItemId",
						"normalizedAlias",
					],
					unique: true,
				},
				{
					fields: ["normalizedAlias"],
				},
			],
		},

		inventoryItemVariant: {
			fields: {
				inventoryItemId: {
					type: "string",
					required: true,
					references: {
						model: "inventoryItem",
						field: "id",
						onDelete: "cascade",
					},
				},
				kind: {
					type: "string",
					required: true,
					defaultValue: "standard",
				},
				sizeOz: {
					type: "number",
					required: false,
				},
				packageType: {
					type: "string",
					required: false,
				},
				name: {
					type: "string",
					required: false,
				},
				defaultPriceCents: {
					type: "number",
					required: false,
				},
				active: {
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
					fields: ["inventoryItemId"],
				},
			],
		},

		inventoryOrganizationVariant: {
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
				inventoryItemVariantId: {
					type: "string",
					required: true,
					references: {
						model: "inventoryItemVariant",
						field: "id",
						onDelete: "cascade",
					},
				},
				enabled: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				exportToToast: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				priceOverrideCents: {
					type: "number",
					required: false,
				},
				happyHourPriceCents: {
					type: "number",
					required: false,
				},
				toastNameOverride: {
					type: "string",
					required: false,
				},
				toastCategoryOverride: {
					type: "string",
					required: false,
				},
				toastDestinationOverride: {
					type: "string",
					required: false,
				},
				toastSlot: {
					type: "string",
					required: false,
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
					fields: [
						"organizationId",
						"inventoryItemVariantId",
					],
					unique: true,
				},
			],
		},

		inventoryImport: {
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
				sourceType: {
					type: "string",
					required: true,
				},
				sourceName: {
					type: "string",
					required: true,
				},
				importedByUserId: {
					type: "string",
					required: false,
					references: {
						model: "user",
						field: "id",
						onDelete: "set null",
					},
				},
				status: {
					type: "string",
					required: true,
					defaultValue: "pending",
				},
				metadataJson: {
					type: "string",
					required: false,
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
				},
			],
		},

		inventorySourceItem: {
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
				sourceType: {
					type: "string",
					required: true,
				},
				sourceKey: {
					type: "string",
					required: true,
				},
				sourceItemId: {
					type: "string",
					required: false,
				},
				sourceName: {
					type: "string",
					required: true,
				},
				normalizedSourceName: {
					type: "string",
					required: true,
				},
				inventoryItemId: {
					type: "string",
					required: false,
					references: {
						model: "inventoryItem",
						field: "id",
						onDelete: "set null",
					},
				},
				inventoryItemVariantId: {
					type: "string",
					required: false,
					references: {
						model: "inventoryItemVariant",
						field: "id",
						onDelete: "set null",
					},
				},
				lastImportId: {
					type: "string",
					required: false,
					references: {
						model: "inventoryImport",
						field: "id",
						onDelete: "set null",
					},
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
					fields: [
						"organizationId",
						"sourceType",
						"sourceKey",
					],
					unique: true,
				},
				{
					fields: ["normalizedSourceName"],
				},
			],
		},
	},

	endpoints: {
		persistInventoryImport: createAuthEndpoint(
			"/inventory/import",
			{
				method: "POST",
				use: [sessionMiddleware],
				body: inventoryImportBodySchema,
			},
			async (ctx) => {
				const body = ctx.body;
				const userId = ctx.context.session.user.id;

				const access = await resolveInventoryAccess(
					pool,
					body.organizationId,
					userId,
				);

				if (
					!access.allowed ||
					access.role === "viewer"
				) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const client = await pool.connect();

				try {
					await client.query("BEGIN");

					const now = new Date();
					const importId = randomUUID();

					await client.query(
						`
							INSERT INTO "inventoryImport" (
								id,
								"organizationId",
								"sourceType",
								"sourceName",
								"importedByUserId",
								status,
								"metadataJson",
								"createdAt",
								"updatedAt"
							)
							VALUES (
								$1, $2, $3, $4, $5,
								'pending', NULL, $6, $6
							)
						`,
						[
							importId,
							body.organizationId,
							body.sourceType,
							body.sourceName,
							userId,
							now,
						],
					);

					await client.query(
						`
							INSERT INTO "inventoryOrganizationConfig" (
								id,
								"organizationId",
								enabled,
								"happyHourEnabled",
								"createdAt",
								"updatedAt"
							)
							VALUES ($1, $2, true, false, $3, $3)
							ON CONFLICT ("organizationId")
							DO NOTHING
						`,
						[randomUUID(), body.organizationId, now],
					);

					const itemIds = new Set();
					const variantIds = new Set();
					const seenVariantIds = new Set();
					const importConflicts = [];

					for (const item of body.items) {
						if (item.status === "ignored") continue;

						const categoryName =
							item.category?.trim() ||
							item.toastCategory.trim() ||
							"Uncategorized";

						const normalizedCategory =
							normalizeInventoryName(categoryName);

						let categoryId;

						const categoryResult = await client.query(
							`
								SELECT id
								FROM "inventoryCategory"
								WHERE "normalizedName" = $1
								LIMIT 1
							`,
							[normalizedCategory],
						);

						if (categoryResult.rows[0]?.id) {
							categoryId = categoryResult.rows[0].id;
						} else {
							categoryId = randomUUID();

							await client.query(
								`
									INSERT INTO "inventoryCategory" (
										id,
										name,
										"normalizedName",
										"toastCategory",
										"sortOrder",
										active,
										"createdAt",
										"updatedAt"
									)
									VALUES (
										$1, $2, $3, $4,
										0, true, $5, $5
									)
								`,
								[
									categoryId,
									categoryName,
									normalizedCategory,
									item.toastCategory,
									now,
								],
							);
						}

						const canonicalName = getCanonicalItemName(
							item.name,
							item.toastCategory,
							item.toastDestination,
						);

						const normalizedItemName =
							normalizeInventoryName(canonicalName);

						let inventoryItemId;

						const existingItem = await client.query(
							`
								SELECT id
								FROM "inventoryItem"
								WHERE "normalizedName" = $1
								LIMIT 1
							`,
							[normalizedItemName],
						);

						if (existingItem.rows[0]?.id) {
							inventoryItemId =
								existingItem.rows[0].id;
						} else {
							inventoryItemId = randomUUID();

							await client.query(
								`
									INSERT INTO "inventoryItem" (
										id,
										"categoryId",
										name,
										"normalizedName",
										active,
										"createdAt",
										"updatedAt"
									)
									VALUES (
										$1, $2, $3, $4,
										true, $5, $5
									)
								`,
								[
									inventoryItemId,
									categoryId,
									canonicalName,
									normalizedItemName,
									now,
								],
							);
						}

						itemIds.add(inventoryItemId);

						const normalizedAlias =
							normalizeInventoryName(item.name);

						if (
							normalizedAlias &&
							normalizedAlias !== normalizedItemName
						) {
							await client.query(
								`
									INSERT INTO "inventoryItemAlias" (
										id,
										"inventoryItemId",
										alias,
										"normalizedAlias",
										"createdAt",
										"updatedAt"
									)
									VALUES ($1, $2, $3, $4, $5, $5)
									ON CONFLICT (
										"inventoryItemId",
										"normalizedAlias"
									)
									DO NOTHING
								`,
								[
									randomUUID(),
									inventoryItemId,
									item.name,
									normalizedAlias,
									now,
								],
							);
						}

						const variant = getVariantIdentity(
							item.toastCategory,
							item.toastDestination,
						);

						let variantId;
						let defaultPriceCents = null;

						const existingVariant = await client.query(
							`
								SELECT
									id,
									"defaultPriceCents"
								FROM "inventoryItemVariant"
								WHERE
									"inventoryItemId" = $1
									AND kind = $2
									AND "sizeOz"
										IS NOT DISTINCT FROM $3
									AND "packageType"
										IS NOT DISTINCT FROM $4
									AND name
										IS NOT DISTINCT FROM $5
								LIMIT 1
							`,
							[
								inventoryItemId,
								variant.kind,
								variant.sizeOz,
								variant.packageType,
								variant.name,
							],
						);

						if (existingVariant.rows[0]?.id) {
							variantId =
								existingVariant.rows[0].id;

							defaultPriceCents =
								existingVariant.rows[0]
									.defaultPriceCents ?? null;

							if (
								defaultPriceCents === null &&
								item.basePriceCents !== null
							) {
								defaultPriceCents =
									item.basePriceCents;

								await client.query(
									`
										UPDATE "inventoryItemVariant"
										SET
											"defaultPriceCents" = $1,
											"updatedAt" = $2
										WHERE id = $3
									`,
									[
										defaultPriceCents,
										now,
										variantId,
									],
								);
							}
						} else {
							variantId = randomUUID();
							defaultPriceCents =
								item.basePriceCents;

							await client.query(
								`
									INSERT INTO "inventoryItemVariant" (
										id,
										"inventoryItemId",
										kind,
										"sizeOz",
										"packageType",
										name,
										"defaultPriceCents",
										active,
										"createdAt",
										"updatedAt"
									)
									VALUES (
										$1, $2, $3, $4, $5,
										$6, $7, true, $8, $8
									)
								`,
								[
									variantId,
									inventoryItemId,
									variant.kind,
									variant.sizeOz,
									variant.packageType,
									variant.name,
									defaultPriceCents,
									now,
								],
							);
						}

						variantIds.add(variantId);

						const duplicateVariantInImport =
							seenVariantIds.has(variantId);

						if (duplicateVariantInImport) {
							const existingOrganizationVariant =
								await client.query(
									`
										SELECT
											"priceOverrideCents",
											"happyHourPriceCents",
											"toastCategoryOverride",
											"toastDestinationOverride"
										FROM "inventoryOrganizationVariant"
										WHERE
											"organizationId" = $1
											AND "inventoryItemVariantId" = $2
										LIMIT 1
									`,
									[
										body.organizationId,
										variantId,
									],
								);

							const existingOverride =
								existingOrganizationVariant.rows[0]
									?.priceOverrideCents ?? null;

							const existingEffectivePrice =
								existingOverride ??
								defaultPriceCents;

							if (
								item.basePriceCents !==
								existingEffectivePrice
							) {
								importConflicts.push({
									type: "duplicate-variant-price",
									sourceKey:
										item.sourceItemNumber?.trim() ||
										item.id,
									sourceName: item.name,
									variantId,
									existingPriceCents:
										existingEffectivePrice,
									incomingPriceCents:
										item.basePriceCents,
									category:
										item.category ?? null,
								});
							}

							const existingCategory =
								existingOrganizationVariant.rows[0]
									?.toastCategoryOverride ?? null;

							if (
								existingCategory &&
								existingCategory !==
									item.toastCategory
							) {
								importConflicts.push({
									type: "duplicate-variant-category",
									sourceKey:
										item.sourceItemNumber?.trim() ||
										item.id,
									sourceName: item.name,
									variantId,
									existingCategory,
									incomingCategory:
										item.toastCategory,
								});
							}
						} else {
							const priceOverrideCents =
								item.basePriceCents !==
								defaultPriceCents
									? item.basePriceCents
									: null;

							await client.query(
							`
								INSERT INTO "inventoryOrganizationVariant" (
									id,
									"organizationId",
									"inventoryItemVariantId",
									enabled,
									"exportToToast",
									"priceOverrideCents",
									"happyHourPriceCents",
									"toastNameOverride",
									"toastCategoryOverride",
									"toastDestinationOverride",
									"toastSlot",
									"createdAt",
									"updatedAt"
								)
								VALUES (
									$1, $2, $3, true, $4,
									$5, $6, NULL, $7, $8,
									NULL, $9, $9
								)
								ON CONFLICT (
									"organizationId",
									"inventoryItemVariantId"
								)
								DO UPDATE SET
									enabled = true,
									"exportToToast" =
										EXCLUDED."exportToToast",
									"priceOverrideCents" =
										EXCLUDED."priceOverrideCents",
									"happyHourPriceCents" =
										EXCLUDED."happyHourPriceCents",
									"toastCategoryOverride" =
										EXCLUDED."toastCategoryOverride",
									"toastDestinationOverride" =
										EXCLUDED."toastDestinationOverride",
									"updatedAt" =
										EXCLUDED."updatedAt"
							`,
							[
								randomUUID(),
								body.organizationId,
								variantId,
								item.exportIncluded,
								priceOverrideCents,
								item.happyHourPriceCents,
								item.toastCategory,
								item.toastDestination,
								now,
							],
						);
						}

						seenVariantIds.add(variantId);

						const sourceKey =
							item.sourceItemNumber?.trim() ||
							item.id;

						await client.query(
							`
								INSERT INTO "inventorySourceItem" (
									id,
									"organizationId",
									"sourceType",
									"sourceKey",
									"sourceItemId",
									"sourceName",
									"normalizedSourceName",
									"inventoryItemId",
									"inventoryItemVariantId",
									"lastImportId",
									"createdAt",
									"updatedAt"
								)
								VALUES (
									$1, $2, $3, $4, $5, $6,
									$7, $8, $9, $10, $11, $11
								)
								ON CONFLICT (
									"organizationId",
									"sourceType",
									"sourceKey"
								)
								DO UPDATE SET
									"sourceItemId" =
										EXCLUDED."sourceItemId",
									"sourceName" =
										EXCLUDED."sourceName",
									"normalizedSourceName" =
										EXCLUDED."normalizedSourceName",
									"inventoryItemId" =
										EXCLUDED."inventoryItemId",
									"inventoryItemVariantId" =
										EXCLUDED."inventoryItemVariantId",
									"lastImportId" =
										EXCLUDED."lastImportId",
									"updatedAt" =
										EXCLUDED."updatedAt"
							`,
							[
								randomUUID(),
								body.organizationId,
								body.sourceType,
								sourceKey,
								item.sourceItemNumber ?? null,
								item.name,
								normalizedAlias,
								inventoryItemId,
								variantId,
								importId,
								now,
							],
						);
					}

					await client.query(
						`
							UPDATE "inventoryImport"
							SET
								status = 'completed',
								"metadataJson" = $1,
								"updatedAt" = $2
							WHERE id = $3
						`,
						[
							JSON.stringify({
								itemCount: itemIds.size,
								variantCount: variantIds.size,
								conflictCount: importConflicts.length,
								conflicts: importConflicts,
							}),
							now,
							importId,
						],
					);

					await client.query("COMMIT");

					return ctx.json({
						importId,
						importedItems: itemIds.size,
						importedVariants: variantIds.size,
					});
				} catch (error) {
					await client.query("ROLLBACK");
					throw error;
				} finally {
					client.release();
				}
			},
		),

		updateInventoryOrganizationVariants: createAuthEndpoint(
			"/inventory/organization-variants",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: inventoryOrganizationVariantsBodySchema,
			},
			async (ctx) => {
				const body = ctx.body;
				const userId = ctx.context.session.user.id;

				const access = await resolveInventoryAccess(
					pool,
					body.organizationId,
					userId,
				);

				if (
					!access.allowed ||
					(access.role !== "manager" &&
						access.role !== "admin")
				) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const uniqueVariantIds = [
					...new Set(body.variantIds),
				];

				const existingVariants = await pool.query<{
					id: string;
				}>(
					`
						SELECT id
						FROM "inventoryItemVariant"
						WHERE id = ANY($1::text[])
					`,
					[uniqueVariantIds],
				);

				if (
					existingVariants.rowCount !==
					uniqueVariantIds.length
				) {
					return ctx.json(
						{
							error:
								"One or more Inventory variants were not found",
						},
						{ status: 404 },
					);
				}

				const client = await pool.connect();

				try {
					await client.query("BEGIN");

					for (const variantId of uniqueVariantIds) {
						await client.query(
							`
								INSERT INTO "inventoryOrganizationVariant" (
									id,
									"organizationId",
									"inventoryItemVariantId",
									enabled,
									"exportToToast",
									"priceOverrideCents",
									"happyHourPriceCents",
									"toastNameOverride",
									"toastCategoryOverride",
									"toastDestinationOverride",
									"toastSlot",
									"createdAt",
									"updatedAt"
								)
								VALUES (
									$1, $2, $3,
									COALESCE($4, true),
									COALESCE($5, true),
									$6, $7,
									NULL, $8, $9,
									NULL, $10, $10
								)
								ON CONFLICT (
									"organizationId",
									"inventoryItemVariantId"
								)
								DO UPDATE SET
									enabled = COALESCE(
										$4,
										"inventoryOrganizationVariant".enabled
									),
									"exportToToast" = COALESCE(
										$5,
										"inventoryOrganizationVariant"."exportToToast"
									),
									"priceOverrideCents" =
										CASE WHEN $11
											THEN $6
											ELSE "inventoryOrganizationVariant"."priceOverrideCents"
										END,
									"happyHourPriceCents" =
										CASE WHEN $12
											THEN $7
											ELSE "inventoryOrganizationVariant"."happyHourPriceCents"
										END,
									"toastCategoryOverride" =
										CASE WHEN $13
											THEN $8
											ELSE "inventoryOrganizationVariant"."toastCategoryOverride"
										END,
									"toastDestinationOverride" =
										CASE WHEN $14
											THEN $9
											ELSE "inventoryOrganizationVariant"."toastDestinationOverride"
										END,
									"updatedAt" = $10
							`,
							[
								randomUUID(),
								body.organizationId,
								variantId,
								body.enabled ?? null,
								body.exportToToast ?? null,
								body.priceOverrideCents ?? null,
								body.happyHourPriceCents ?? null,
								body.toastCategoryOverride ?? null,
								body.toastDestinationOverride ?? null,
								new Date(),
								Object.hasOwn(
									body,
									"priceOverrideCents",
								),
								Object.hasOwn(
									body,
									"happyHourPriceCents",
								),
								Object.hasOwn(
									body,
									"toastCategoryOverride",
								),
								Object.hasOwn(
									body,
									"toastDestinationOverride",
								),
							],
						);
					}

					await client.query("COMMIT");

					return ctx.json({
						updated: uniqueVariantIds.length,
					});
				} catch (error) {
					await client.query("ROLLBACK");
					throw error;
				} finally {
					client.release();
				}
			},
		),

		updateInventoryOrganizationVariant: createAuthEndpoint(
			"/inventory/organization-variant",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: inventoryOrganizationVariantBodySchema,
			},
			async (ctx) => {
				const body = ctx.body;
				const userId = ctx.context.session.user.id;

				const access = await resolveInventoryAccess(
					pool,
					body.organizationId,
					userId,
				);

				if (
					!access.allowed ||
					(access.role !== "manager" &&
						access.role !== "admin")
				) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const variant = await pool.query(
					`
						SELECT id
						FROM "inventoryItemVariant"
						WHERE id = $1
						LIMIT 1
					`,
					[body.variantId],
				);

				if (variant.rowCount !== 1) {
					return ctx.json(
						{ error: "Inventory variant not found" },
						{ status: 404 },
					);
				}

				await pool.query(
					`
						INSERT INTO "inventoryOrganizationVariant" (
							id,
							"organizationId",
							"inventoryItemVariantId",
							enabled,
							"exportToToast",
							"priceOverrideCents",
							"happyHourPriceCents",
							"toastNameOverride",
							"toastCategoryOverride",
							"toastDestinationOverride",
							"toastSlot",
							"createdAt",
							"updatedAt"
						)
						VALUES (
							$1, $2, $3,
							COALESCE($4, true),
							COALESCE($5, true),
							$6, $7, $8, $9, $10,
							NULL, $11, $11
						)
						ON CONFLICT (
							"organizationId",
							"inventoryItemVariantId"
						)
						DO UPDATE SET
							enabled = COALESCE($4,
								"inventoryOrganizationVariant".enabled),
							"exportToToast" = COALESCE($5,
								"inventoryOrganizationVariant"."exportToToast"),
							"priceOverrideCents" =
								CASE WHEN $12
									THEN $6
									ELSE "inventoryOrganizationVariant"."priceOverrideCents"
								END,
							"happyHourPriceCents" =
								CASE WHEN $13
									THEN $7
									ELSE "inventoryOrganizationVariant"."happyHourPriceCents"
								END,
							"toastNameOverride" =
								CASE WHEN $14
									THEN $8
									ELSE "inventoryOrganizationVariant"."toastNameOverride"
								END,
							"toastCategoryOverride" =
								CASE WHEN $15
									THEN $9
									ELSE "inventoryOrganizationVariant"."toastCategoryOverride"
								END,
							"toastDestinationOverride" =
								CASE WHEN $16
									THEN $10
									ELSE "inventoryOrganizationVariant"."toastDestinationOverride"
								END,
							"updatedAt" = $11
					`,
					[
						randomUUID(),
						body.organizationId,
						body.variantId,
						body.enabled ?? null,
						body.exportToToast ?? null,
						body.priceOverrideCents ?? null,
						body.happyHourPriceCents ?? null,
						body.toastNameOverride ?? null,
						body.toastCategoryOverride ?? null,
						body.toastDestinationOverride ?? null,
						new Date(),
						Object.hasOwn(body, "priceOverrideCents"),
						Object.hasOwn(body, "happyHourPriceCents"),
						Object.hasOwn(body, "toastNameOverride"),
						Object.hasOwn(body, "toastCategoryOverride"),
						Object.hasOwn(body, "toastDestinationOverride"),
					],
				);

				return ctx.json({ updated: true });
			},
		),

		listInventoryImports: createAuthEndpoint(
			"/inventory/imports",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;
				const userId = ctx.context.session.user.id;

				const access = await resolveInventoryAccess(
					pool,
					organizationId,
					userId,
				);

				if (!access.allowed) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const result = await pool.query<{
					id: string;
					sourceType: string;
					sourceName: string;
					importedByUserId: string | null;
					importedByName: string | null;
					importedByEmail: string | null;
					status: string;
					metadataJson: string | null;
					createdAt: Date;
					updatedAt: Date;
				}>(
					`
						SELECT
							ii.id,
							ii."sourceType",
							ii."sourceName",
							ii."importedByUserId",
							u.name AS "importedByName",
							u.email AS "importedByEmail",
							ii.status,
							ii."metadataJson",
							ii."createdAt",
							ii."updatedAt"
						FROM "inventoryImport" ii
						LEFT JOIN "user" u
							ON u.id = ii."importedByUserId"
						WHERE ii."organizationId" = $1
						ORDER BY ii."createdAt" DESC
						LIMIT 100
					`,
					[organizationId],
				);

				const imports = result.rows.map((row) => {
					let metadata: {
						itemCount?: number;
						variantCount?: number;
						conflictCount?: number;
						conflicts?: unknown[];
					} = {};

					if (row.metadataJson) {
						try {
							const parsed = JSON.parse(row.metadataJson);

							if (
								parsed &&
								typeof parsed === "object"
							) {
								metadata = parsed;
							}
						} catch {
							metadata = {};
						}
					}

					return {
						id: row.id,
						sourceType: row.sourceType,
						sourceName: row.sourceName,
						importedByUserId:
							row.importedByUserId ?? "",
						importedByName:
							row.importedByName,
						importedByEmail:
							row.importedByEmail,
						status: row.status,
						createdAt:
							row.createdAt.toISOString(),
						updatedAt:
							row.updatedAt.toISOString(),
						itemCount:
							typeof metadata.itemCount === "number"
								? metadata.itemCount
								: 0,
						variantCount:
							typeof metadata.variantCount === "number"
								? metadata.variantCount
								: 0,
						conflictCount:
							typeof metadata.conflictCount === "number"
								? metadata.conflictCount
								: 0,
						conflicts: Array.isArray(metadata.conflicts)
							? metadata.conflicts
							: [],
					};
				});

				return ctx.json({ imports });
			},
		),

		listInventoryCatalog: createAuthEndpoint(
			"/inventory/catalog",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;
				const userId = ctx.context.session.user.id;

				const access = await resolveInventoryAccess(
					pool,
					organizationId,
					userId,
				);

				if (!access.allowed) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const result = await pool.query<{
					itemId: string;
					itemName: string;
					itemNormalizedName: string;
					itemActive: boolean;
					categoryId: string | null;
					categoryName: string | null;
					toastCategory: string | null;
					variantId: string;
					variantKind: string;
					variantSizeOz: number | null;
					variantPackageType: string | null;
					variantName: string | null;
					variantDefaultPriceCents: number | null;
					variantActive: boolean;
					organizationEnabled: boolean | null;
					exportToToast: boolean | null;
					priceOverrideCents: number | null;
					happyHourPriceCents: number | null;
					toastNameOverride: string | null;
					toastCategoryOverride: string | null;
					toastDestinationOverride: string | null;
					toastSlot: string | null;
				}>(
					`
						SELECT
							i.id AS "itemId",
							i.name AS "itemName",
							i."normalizedName" AS "itemNormalizedName",
							i.active AS "itemActive",
							c.id AS "categoryId",
							c.name AS "categoryName",
							c."toastCategory" AS "toastCategory",
							v.id AS "variantId",
							v.kind AS "variantKind",
							v."sizeOz" AS "variantSizeOz",
							v."packageType" AS "variantPackageType",
							v.name AS "variantName",
							v."defaultPriceCents" AS "variantDefaultPriceCents",
							v.active AS "variantActive",
							ov.enabled AS "organizationEnabled",
							ov."exportToToast",
							ov."priceOverrideCents",
							ov."happyHourPriceCents",
							ov."toastNameOverride",
							ov."toastCategoryOverride",
							ov."toastDestinationOverride",
							ov."toastSlot"
						FROM "inventoryItem" i
						INNER JOIN "inventoryItemVariant" v
							ON v."inventoryItemId" = i.id
						LEFT JOIN "inventoryCategory" c
							ON c.id = i."categoryId"
						LEFT JOIN "inventoryOrganizationVariant" ov
							ON ov."inventoryItemVariantId" = v.id
							AND ov."organizationId" = $1
						ORDER BY
							COALESCE(c."sortOrder", 999999),
							LOWER(COALESCE(c.name, '')),
							LOWER(i.name),
							v."sizeOz" NULLS FIRST,
							LOWER(COALESCE(v.name, ''))
					`,
					[organizationId],
				);

				return ctx.json({
					organizationId,
					role: access.role,
					items: result.rows.map((row) => ({
						id: row.itemId,
						name: row.itemName,
						normalizedName: row.itemNormalizedName,
						active: row.itemActive,
						category: row.categoryId
							? {
								id: row.categoryId,
								name: row.categoryName,
								toastCategory: row.toastCategory,
							}
							: null,
						variant: {
							id: row.variantId,
							kind: row.variantKind,
							sizeOz: row.variantSizeOz,
							packageType: row.variantPackageType,
							name: row.variantName,
							defaultPriceCents:
								row.variantDefaultPriceCents,
							active: row.variantActive,
						},
						organization: {
							enabled: row.organizationEnabled === true,
							exportToToast: row.exportToToast ?? true,
							priceOverrideCents: row.priceOverrideCents,
							happyHourPriceCents: row.happyHourPriceCents,
							toastNameOverride: row.toastNameOverride,
							toastCategoryOverride:
								row.toastCategoryOverride,
							toastDestinationOverride:
								row.toastDestinationOverride,
							toastSlot: row.toastSlot,
						},
						effectivePriceCents:
							row.priceOverrideCents ??
							row.variantDefaultPriceCents,
					})),
				});
			},
		),

		getInventoryAccess: createAuthEndpoint(
			"/inventory/access",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const access =
					await resolveInventoryAccess(
						pool,
						ctx.query.organizationId,
						ctx.context.session.user.id,
					);

				return ctx.json({
					allowed: access.allowed,
					role: access.role,
					organizationName:
						await getOrganizationName(
							pool,
							ctx.query.organizationId,
						),
				});
			},
		),

		listInventoryAssignments:
			createAuthEndpoint(
				"/inventory/assignments",
				{
					method: "GET",
					use: [sessionMiddleware],
					query:
						organizationQuerySchema,
				},
				async (ctx) => {
					const access =
						await resolveInventoryAccess(
							pool,
							ctx.query
								.organizationId,
							ctx.context.session
								.user.id,
						);

					if (
						!access.allowed ||
						access.role !== "admin"
					) {
						return ctx.json(
							{
								error:
									"Forbidden",
							},
							{ status: 403 },
						);
					}

					const result =
						await pool.query<AssignmentRow>(
							`
								SELECT
									m.id AS "memberId",
									u.id AS "userId",
									u.name,
									u.email,
									(u.role = 'admin')
										AS "systemAdmin",
									m.role
										AS "membershipRole",
									a.enabled,
									a.role
								FROM member m
								INNER JOIN "user" u
									ON u.id =
										m."userId"
								LEFT JOIN
									"organizationMemberStatus" oms
									ON oms."memberId" =
										m.id
								LEFT JOIN
									"inventoryAssignment" a
									ON a."organizationId" =
										m."organizationId"
									AND a."userId" =
										m."userId"
								WHERE
									m."organizationId" = $1
									AND COALESCE(
										u.banned,
										false
									) = false
									AND COALESCE(
										oms.active,
										true
									) = true
								ORDER BY
									LOWER(u.name),
									LOWER(u.email)
							`,
							[
								ctx.query
									.organizationId,
							],
						);

					return ctx.json({
						assignments:
							result.rows.map(
								(row) => {
									const protectedUser =
										row.systemAdmin ||
										row.membershipRole ===
											"owner" ||
										row.membershipRole ===
											"admin";

									return {
										memberId:
											row.memberId,
										userId:
											row.userId,
										name: row.name,
										email: row.email,
										systemAdmin:
											row.systemAdmin,
										enabled:
											protectedUser ||
											(row.enabled ??
												false),
										role: protectedUser
											? "admin"
											: normalizeInventoryRole(
													row.role,
												),
										canUpdateAccess:
											!protectedUser,
										canUpdateRole:
											!protectedUser,
									};
								},
							),
					});
				},
			),

		getInventoryManagementAccess:
			createAuthEndpoint(
				"/inventory/management-access",
				{
					method: "GET",
					use: [sessionMiddleware],
					query:
						organizationQuerySchema,
				},
				async (ctx) => {
					const access =
						await resolveInventoryAccess(
							pool,
							ctx.query
								.organizationId,
							ctx.context.session
								.user.id,
						);

					return ctx.json({
						allowed:
							access.allowed &&
							access.role ===
								"admin",
						canManageAdmins:
							access.systemAdmin ||
							access
								.organizationManager,
					});
				},
			),

		getInventoryAccessInternal:
			createAuthEndpoint(
				"/inventory/access/internal",
				{
					method: "GET",
					query:
						internalAccessQuerySchema,
				},
				async (ctx) => {
					if (
						!internalSecret ||
						ctx.headers.get(
							"x-inventory-internal-secret",
						) !== internalSecret
					) {
						return ctx.json(
							{
								error:
									"Unauthorized",
							},
							{ status: 401 },
						);
					}

					const access =
						await resolveInventoryAccess(
							pool,
							ctx.query
								.organizationId,
							ctx.query.userId,
						);

					return ctx.json({
						allowed:
							access.allowed,
						role: access.role,
						organizationName:
							await getOrganizationName(
								pool,
								ctx.query
									.organizationId,
							),
					});
				},
			),
	},
});
