import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";

type TipClaimOptions = {
	pool: Pool;
};

type UserRoleRow = {
	role: string | null;
};

type MembershipRow = {
	memberId: string;
};

type OrganizationStatusRow = {
	enabled: boolean;
};

const roleSchema = z.enum(["bartender", "manager", "barback", "door"]);

const registerSchema = z.object({
	registerKey: z.string().min(1),
	name: z.string().trim().min(1),
	salesCents: z.number().int().min(0),
});

const staffSchema = z.object({
	userId: z.string().min(1),
	name: z.string().trim().min(1),
	email: z.string().email(),
	role: roleSchema,
	registerKey: z.string().min(1).nullable().optional(),
	weight: z.number().int().min(0),
	claimCents: z.number().int().min(0),
});

const saveShiftBodySchema = z.object({
	organizationId: z.string().min(1),
	claimPercent: z.number().min(0).max(100),
	totalSalesCents: z.number().int().min(0),
	requiredClaimCents: z.number().int().min(0),
	totalWeightUnits: z.number().int().min(0),
	weights: z.object({
		bartender: z.number().int().min(0),
		manager: z.number().int().min(0),
		barback: z.number().int().min(0),
		door: z.number().int().min(0),
	}),
	completedAt: z.coerce.date(),
	registers: z.array(registerSchema).min(1),
	staff: z.array(staffSchema).min(1),
});

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

const deleteShiftBodySchema = z.object({
	organizationId: z.string().min(1),
	shiftId: z.string().min(1),
});

const updateAssignmentBodySchema = z.object({
	organizationId: z.string().min(1),
	userId: z.string().min(1),
	role: roleSchema,
	enabled: z.boolean(),
});

async function isGlobalAdmin(pool: Pool, userId: string) {
	const result = await pool.query<UserRoleRow>(
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

async function organizationIsEnabled(pool: Pool, organizationId: string) {
	const organization = await pool.query<{
		id: string;
	}>(
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

	const status = await pool.query<OrganizationStatusRow>(
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

async function canSaveShift(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (!(await organizationIsEnabled(pool, organizationId))) {
		return false;
	}

	if (await isGlobalAdmin(pool, userId)) {
		return true;
	}

	const result = await pool.query<MembershipRow>(
		`
			SELECT
				m.id AS "memberId"
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

	return result.rowCount === 1;
}

async function getEligibleOrganizationUserIds(
	client: PoolClient,
	organizationId: string,
) {
	const result = await client.query<{
		userId: string;
	}>(
		`
			SELECT m."userId"
			FROM member m
			INNER JOIN "user" u
				ON u.id = m."userId"
			LEFT JOIN "organizationMemberStatus" oms
				ON oms."memberId" = m.id
			WHERE
				m."organizationId" = $1
				AND COALESCE(u.banned, false) = false
				AND COALESCE(oms.active, true) = true
		`,
		[organizationId],
	);

	return new Set(result.rows.map((row) => row.userId));
}

export const tipClaim = ({ pool }: TipClaimOptions): BetterAuthPlugin => ({
	id: "tip-claim",

	schema: {
		tipClaimShift: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
				},
				savedByUserId: {
					type: "string",
					required: true,
				},
				claimPercent: {
					type: "number",
					required: true,
				},
				totalSalesCents: {
					type: "number",
					required: true,
				},
				requiredClaimCents: {
					type: "number",
					required: true,
				},
				totalWeightUnits: {
					type: "number",
					required: true,
				},
				bartenderWeight: {
					type: "number",
					required: true,
				},
				managerWeight: {
					type: "number",
					required: true,
				},
				barbackWeight: {
					type: "number",
					required: true,
				},
				doorWeight: {
					type: "number",
					required: true,
				},
				completedAt: {
					type: "date",
					required: true,
				},
				createdAt: {
					type: "date",
					required: true,
					defaultValue: () => new Date(),
				},
			},
		},

		tipClaimRegister: {
			fields: {
				shiftId: {
					type: "string",
					required: true,
					references: {
						model: "tipClaimShift",
						field: "id",
						onDelete: "cascade",
					},
				},
				registerKey: {
					type: "string",
					required: true,
				},
				name: {
					type: "string",
					required: true,
				},
				salesCents: {
					type: "number",
					required: true,
				},
				createdAt: {
					type: "date",
					required: true,
					defaultValue: () => new Date(),
				},
			},
		},

		tipClaimEmployeeAssignment: {
			fields: {
				organizationId: {
					type: "string",
					required: true,
				},
				userId: {
					type: "string",
					required: true,
				},
				bartenderEnabled: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				managerEnabled: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				barbackEnabled: {
					type: "boolean",
					required: true,
					defaultValue: true,
				},
				doorEnabled: {
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
					fields: ["organizationId", "userId"],
					unique: true,
				},
			],
		},

		tipClaimStaff: {
			fields: {
				shiftId: {
					type: "string",
					required: true,
					references: {
						model: "tipClaimShift",
						field: "id",
						onDelete: "cascade",
					},
				},
				userId: {
					type: "string",
					required: true,
				},
				name: {
					type: "string",
					required: true,
				},
				email: {
					type: "string",
					required: true,
				},
				role: {
					type: "string",
					required: true,
				},
				registerKey: {
					type: "string",
					required: false,
				},
				weight: {
					type: "number",
					required: true,
				},
				claimCents: {
					type: "number",
					required: true,
				},
				createdAt: {
					type: "date",
					required: true,
					defaultValue: () => new Date(),
				},
			},
		},
	},

	endpoints: {
		listTipClaimAssignments: createAuthEndpoint(
			"/tip-claim/assignments",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const userId = ctx.context.session.user.id;
				const { organizationId } = ctx.query;

				if (!(await canSaveShift(pool, userId, organizationId))) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const result = await pool.query<{
					memberId: string;
					userId: string;
					name: string;
					email: string;
					bartenderEnabled: boolean | null;
					managerEnabled: boolean | null;
					barbackEnabled: boolean | null;
					doorEnabled: boolean | null;
				}>(
					`
						SELECT
							m.id AS "memberId",
							m."userId",
							u.name,
							u.email,
							a."bartenderEnabled",
							a."managerEnabled",
							a."barbackEnabled",
							a."doorEnabled"
						FROM member m
						INNER JOIN "user" u
							ON u.id = m."userId"
						LEFT JOIN "organizationMemberStatus" oms
							ON oms."memberId" = m.id
						LEFT JOIN "tipClaimEmployeeAssignment" a
							ON a."organizationId" = m."organizationId"
							AND a."userId" = m."userId"
						WHERE
							m."organizationId" = $1
							AND COALESCE(u.banned, false) = false
							AND COALESCE(oms.active, true) = true
						ORDER BY LOWER(u.name), LOWER(u.email)
					`,
					[organizationId],
				);

				return ctx.json({
					assignments: result.rows.map((row) => ({
						memberId: row.memberId,
						userId: row.userId,
						name: row.name,
						email: row.email,
						bartenderEnabled: row.bartenderEnabled ?? true,
						managerEnabled: row.managerEnabled ?? true,
						barbackEnabled: row.barbackEnabled ?? true,
						doorEnabled: row.doorEnabled ?? true,
					})),
				});
			},
		),

		updateTipClaimAssignment: createAuthEndpoint(
			"/tip-claim/assignments",
			{
				method: "PATCH",
				use: [sessionMiddleware],
				body: updateAssignmentBodySchema,
			},
			async (ctx) => {
				const sessionUserId = ctx.context.session.user.id;
				const { organizationId, userId, role, enabled } = ctx.body;

				if (!(await canSaveShift(pool, sessionUserId, organizationId))) {
					return ctx.json(
						{ error: "Forbidden" },
						{ status: 403 },
					);
				}

				const memberResult = await pool.query<{
					memberId: string;
					name: string;
					email: string;
				}>(
					`
						SELECT
							m.id AS "memberId",
							u.name,
							u.email
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

				const member = memberResult.rows[0];

				if (!member) {
					return ctx.json(
						{ error: "Employee is not an active organization member" },
						{ status: 404 },
					);
				}

				const columnByRole = {
					bartender: "bartenderEnabled",
					manager: "managerEnabled",
					barback: "barbackEnabled",
					door: "doorEnabled",
				} as const;

				const column = columnByRole[role];

				await pool.query(
					`
						INSERT INTO "tipClaimEmployeeAssignment" (
							id,
							"organizationId",
							"userId",
							"bartenderEnabled",
							"managerEnabled",
							"barbackEnabled",
							"doorEnabled",
							"createdAt",
							"updatedAt"
						)
						VALUES (
							gen_random_uuid()::text,
							$1,
							$2,
							true,
							true,
							true,
							true,
							CURRENT_TIMESTAMP,
							CURRENT_TIMESTAMP
						)
						ON CONFLICT ("organizationId", "userId")
						DO NOTHING
					`,
					[organizationId, userId],
				);

				await pool.query(
					`
						UPDATE "tipClaimEmployeeAssignment"
						SET "${column}" = $3,
							"updatedAt" = CURRENT_TIMESTAMP
						WHERE "organizationId" = $1
							AND "userId" = $2
					`,
					[organizationId, userId, enabled],
				);

				const assignmentResult = await pool.query<{
					bartenderEnabled: boolean;
					managerEnabled: boolean;
					barbackEnabled: boolean;
					doorEnabled: boolean;
				}>(
					`
						SELECT
							"bartenderEnabled",
							"managerEnabled",
							"barbackEnabled",
							"doorEnabled"
						FROM "tipClaimEmployeeAssignment"
						WHERE "organizationId" = $1
							AND "userId" = $2
						LIMIT 1
					`,
					[organizationId, userId],
				);

				const assignment = assignmentResult.rows[0];

				if (!assignment) {
					throw new Error("Failed to update tip claim employee assignment");
				}

				return ctx.json({
					assignment: {
						memberId: member.memberId,
						userId,
						name: member.name,
						email: member.email,
						...assignment,
					},
				});
			},
		),

		saveTipClaimShift: createAuthEndpoint(
			"/tip-claim/shifts",
			{
				method: "POST",
				use: [sessionMiddleware],
				body: saveShiftBodySchema,
			},
			async (ctx) => {
				const userId = ctx.context.session.user.id;
				const body = ctx.body;

				if (!(await canSaveShift(pool, userId, body.organizationId))) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const registerKeys = new Set<string>();

				for (const register of body.registers) {
					if (registerKeys.has(register.registerKey)) {
						return ctx.json(
							{
								error: `Duplicate register key: ${register.registerKey}`,
							},
							{
								status: 400,
							},
						);
					}

					registerKeys.add(register.registerKey);
				}

				const calculatedSalesCents = body.registers.reduce(
					(sum, register) => sum + register.salesCents,
					0,
				);

				if (calculatedSalesCents !== body.totalSalesCents) {
					return ctx.json(
						{
							error: "Register sales do not match total sales",
						},
						{
							status: 400,
						},
					);
				}

				const calculatedClaimCents = body.staff.reduce(
					(sum, staffMember) => sum + staffMember.claimCents,
					0,
				);

				if (calculatedClaimCents !== body.requiredClaimCents) {
					return ctx.json(
						{
							error: "Staff claims do not match required claim",
						},
						{
							status: 400,
						},
					);
				}

				const staffUserIds = new Set<string>();
				const assignedRegisterKeys = new Set<string>();

				for (const staffMember of body.staff) {
					if (staffUserIds.has(staffMember.userId)) {
						return ctx.json(
							{
								error: `Duplicate staff user: ${staffMember.userId}`,
							},
							{
								status: 400,
							},
						);
					}

					staffUserIds.add(staffMember.userId);

					if (
						staffMember.role !== "bartender" &&
						staffMember.role !== "manager" &&
						staffMember.registerKey != null
					) {
						return ctx.json(
							{
								error: "Only bartenders and managers may be assigned a register",
							},
							{
								status: 400,
							},
						);
					}

					if (staffMember.registerKey == null) {
						continue;
					}

					if (!registerKeys.has(staffMember.registerKey)) {
						return ctx.json(
							{
								error: `Unknown register: ${staffMember.registerKey}`,
							},
							{
								status: 400,
							},
						);
					}

					if (assignedRegisterKeys.has(staffMember.registerKey)) {
						return ctx.json(
							{
								error: `Register ${staffMember.registerKey} is assigned more than once`,
							},
							{
								status: 400,
							},
						);
					}

					assignedRegisterKeys.add(staffMember.registerKey);
				}

				const client = await pool.connect();

				try {
					await client.query("BEGIN");

					const eligibleUserIds = await getEligibleOrganizationUserIds(
						client,
						body.organizationId,
					);

					for (const staffMember of body.staff) {
						if (!eligibleUserIds.has(staffMember.userId)) {
							await client.query("ROLLBACK");

							return ctx.json(
								{
									error: `${staffMember.name} is not an active organization member`,
								},
								{
									status: 400,
								},
							);
						}
					}

					const shiftResult = await client.query<{
						id: string;
					}>(
						`
							INSERT INTO "tipClaimShift" (
								id,
								"organizationId",
								"savedByUserId",
								"claimPercent",
								"totalSalesCents",
								"requiredClaimCents",
								"totalWeightUnits",
								"bartenderWeight",
								"managerWeight",
								"barbackWeight",
								"doorWeight",
								"completedAt",
								"createdAt"
							)
							VALUES (
								gen_random_uuid()::text,
								$1,
								$2,
								$3,
								$4,
								$5,
								$6,
								$7,
								$8,
								$9,
								$10,
								$11,
								CURRENT_TIMESTAMP
							)
							RETURNING id
						`,
						[
							body.organizationId,
							userId,
							body.claimPercent,
							body.totalSalesCents,
							body.requiredClaimCents,
							body.totalWeightUnits,
							body.weights.bartender,
							body.weights.manager,
							body.weights.barback,
							body.weights.door,
							body.completedAt,
						],
					);

					const shiftId = shiftResult.rows[0]?.id;

					if (!shiftId) {
						throw new Error("Failed to create tip claim shift");
					}

					for (const register of body.registers) {
						await client.query(
							`
								INSERT INTO "tipClaimRegister" (
									id,
									"shiftId",
									"registerKey",
									name,
									"salesCents",
									"createdAt"
								)
								VALUES (
									gen_random_uuid()::text,
									$1,
									$2,
									$3,
									$4,
									CURRENT_TIMESTAMP
								)
							`,
							[
								shiftId,
								register.registerKey,
								register.name,
								register.salesCents,
							],
						);
					}

					for (const staffMember of body.staff) {
						await client.query(
							`
								INSERT INTO "tipClaimStaff" (
									id,
									"shiftId",
									"userId",
									name,
									email,
									role,
									"registerKey",
									weight,
									"claimCents",
									"createdAt"
								)
								VALUES (
									gen_random_uuid()::text,
									$1,
									$2,
									$3,
									$4,
									$5,
									$6,
									$7,
									$8,
									CURRENT_TIMESTAMP
								)
							`,
							[
								shiftId,
								staffMember.userId,
								staffMember.name,
								staffMember.email,
								staffMember.role,
								staffMember.registerKey ?? null,
								staffMember.weight,
								staffMember.claimCents,
							],
						);
					}

					await client.query("COMMIT");

					return ctx.json({
						shiftId,
					});
				} catch (error) {
					await client.query("ROLLBACK");
					throw error;
				} finally {
					client.release();
				}
			},
		),

		deleteTipClaimShift: createAuthEndpoint(
			"/tip-claim/shifts",
			{
				method: "DELETE",
				use: [sessionMiddleware],
				body: deleteShiftBodySchema,
			},
			async (ctx) => {
				const userId = ctx.context.session.user.id;
				const { organizationId, shiftId } = ctx.body;

				if (!(await canSaveShift(pool, userId, organizationId))) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const result = await pool.query<{ id: string }>(
					`
						DELETE FROM "tipClaimShift"
						WHERE
							id = $1
							AND "organizationId" = $2
						RETURNING id
					`,
					[shiftId, organizationId],
				);

				if (result.rowCount !== 1) {
					return ctx.json(
						{
							error: "Shift not found",
						},
						{
							status: 404,
						},
					);
				}

				return ctx.json({
					shiftId,
				});
			},
		),

		listTipClaimShifts: createAuthEndpoint(
			"/tip-claim/shifts",
			{
				method: "GET",
				use: [sessionMiddleware],
				query: organizationQuerySchema,
			},
			async (ctx) => {
				const organizationId = ctx.query.organizationId;
				const userId = ctx.context.session.user.id;

				if (!(await canSaveShift(pool, userId, organizationId))) {
					return ctx.json(
						{
							error: "Forbidden",
						},
						{
							status: 403,
						},
					);
				}

				const shiftResult = await pool.query<{
					id: string;
					organizationId: string;
					savedByUserId: string;
					claimPercent: number;
					totalSalesCents: number;
					requiredClaimCents: number;
					totalWeightUnits: number;
					bartenderWeight: number;
					managerWeight: number;
					barbackWeight: number;
					doorWeight: number;
					completedAt: Date;
					createdAt: Date;
				}>(
					`
						SELECT
							id,
							"organizationId",
							"savedByUserId",
							"claimPercent",
							"totalSalesCents",
							"requiredClaimCents",
							"totalWeightUnits",
							"bartenderWeight",
							"managerWeight",
							"barbackWeight",
							"doorWeight",
							"completedAt",
							"createdAt"
						FROM "tipClaimShift"
						WHERE "organizationId" = $1
						ORDER BY "completedAt" DESC, "createdAt" DESC
					`,
					[organizationId],
				);

				if (shiftResult.rows.length === 0) {
					return ctx.json({
						shifts: [],
					});
				}

				const shiftIds = shiftResult.rows.map((shift) => shift.id);

				const registerResult = await pool.query<{
					id: string;
					shiftId: string;
					registerKey: string;
					name: string;
					salesCents: number;
					createdAt: Date;
				}>(
					`
						SELECT
							id,
							"shiftId",
							"registerKey",
							name,
							"salesCents",
							"createdAt"
						FROM "tipClaimRegister"
						WHERE "shiftId" = ANY($1::text[])
						ORDER BY "createdAt", id
					`,
					[shiftIds],
				);

				const staffResult = await pool.query<{
					id: string;
					shiftId: string;
					userId: string;
					name: string;
					email: string;
					role: string;
					registerKey: string | null;
					weight: number;
					claimCents: number;
					createdAt: Date;
				}>(
					`
						SELECT
							id,
							"shiftId",
							"userId",
							name,
							email,
							role,
							"registerKey",
							weight,
							"claimCents",
							"createdAt"
						FROM "tipClaimStaff"
						WHERE "shiftId" = ANY($1::text[])
						ORDER BY "createdAt", id
					`,
					[shiftIds],
				);

				const registersByShift = new Map<string, typeof registerResult.rows>();
				const staffByShift = new Map<string, typeof staffResult.rows>();

				for (const register of registerResult.rows) {
					const current = registersByShift.get(register.shiftId) ?? [];
					current.push(register);
					registersByShift.set(register.shiftId, current);
				}

				for (const staffMember of staffResult.rows) {
					const current = staffByShift.get(staffMember.shiftId) ?? [];
					current.push(staffMember);
					staffByShift.set(staffMember.shiftId, current);
				}

				return ctx.json({
					shifts: shiftResult.rows.map((shift) => ({
						...shift,
						registers: registersByShift.get(shift.id) ?? [],
						staff: staffByShift.get(shift.id) ?? [],
					})),
				});
			},
		),
	},
});
