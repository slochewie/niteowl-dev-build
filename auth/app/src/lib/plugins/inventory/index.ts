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
