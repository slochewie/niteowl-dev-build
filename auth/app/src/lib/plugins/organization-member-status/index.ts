import type { BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	createAuthMiddleware,
	sessionMiddleware,
} from "better-auth/api";
import type { Pool } from "pg";
import * as z from "zod";

import {
	canAccessOrganization,
	canManageOrganization,
	getOrganizationMembership,
	isGlobalAdmin,
} from "./access.js";

type OrganizationMemberStatusOptions = {
	pool: Pool;
};

type OrganizationMemberStatusRow = {
	memberId: string;
	active: boolean;
	source: string | null;
	reason: string | null;
	deactivatedAt: Date | null;
	reactivatedAt: Date | null;
};

const setMemberStatusBodySchema = z.object({
	organizationId: z.string().min(1),
	userId: z.string().min(1),
	active: z.boolean(),
	source: z.string().trim().min(1).nullable().optional(),
	reason: z.string().trim().min(1).nullable().optional(),
});

const organizationQuerySchema = z.object({
	organizationId: z.string().min(1),
});

export async function setOrganizationMemberStatus({
	pool,
	memberId,
	userId,
	organizationId,
	active,
	source,
	reason,
}: {
	pool: Pool;
	memberId: string;
	userId: string;
	organizationId: string;
	active: boolean;
	source?: string | null;
	reason?: string | null;
}) {
	const result = await pool.query<OrganizationMemberStatusRow>(
		`
        INSERT INTO
          "organizationMemberStatus" (
            id,
            "memberId",
            active,
            source,
            reason,
            "deactivatedAt",
            "reactivatedAt",
            "createdAt",
            "updatedAt"
          )
        VALUES (
          gen_random_uuid()::text,
          $1,
          $2,
          $3,
          $4,

          CASE
            WHEN $2 = false
            THEN CURRENT_TIMESTAMP
            ELSE NULL
          END,

          CASE
            WHEN $2 = true
            THEN CURRENT_TIMESTAMP
            ELSE NULL
          END,

          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )

        ON CONFLICT (
          "memberId"
        )

        DO UPDATE SET
          active =
            EXCLUDED.active,

          source =
            EXCLUDED.source,

          reason =
            EXCLUDED.reason,

          "deactivatedAt" =
            CASE
              WHEN
                "organizationMemberStatus".active = true
                AND EXCLUDED.active = false
              THEN
                CURRENT_TIMESTAMP
              ELSE
                "organizationMemberStatus"."deactivatedAt"
            END,

          "reactivatedAt" =
            CASE
              WHEN
                "organizationMemberStatus".active = false
                AND EXCLUDED.active = true
              THEN
                CURRENT_TIMESTAMP
              ELSE
                "organizationMemberStatus"."reactivatedAt"
            END,

          "updatedAt" =
            CURRENT_TIMESTAMP

        RETURNING
          "memberId",
          active,
          source,
          reason,
          "deactivatedAt",
          "reactivatedAt"
      `,
		[memberId, active, source ?? null, reason ?? null],
	);

	if (!active) {
		await pool.query(
			`
        UPDATE session
        SET
          "activeOrganizationId" =
            NULL,
          "updatedAt" =
            CURRENT_TIMESTAMP
        WHERE
          "userId" = $1
          AND
          "activeOrganizationId" = $2
      `,
			[userId, organizationId],
		);
	}

	return result.rows[0];
}

export const organizationMemberStatus = ({
	pool,
}: OrganizationMemberStatusOptions) =>
	({
		id: "organization-member-status",

		hooks: {
			before: [
				{
					matcher: (ctx) => ctx.path === "/organization/set-active",

					handler: createAuthMiddleware(async (ctx) => {
						const userId = ctx.context.session?.user.id;

						if (!userId) {
							return;
						}

						if (await isGlobalAdmin(pool, userId)) {
							return;
						}

						if (!ctx.body || typeof ctx.body !== "object") {
							return;
						}

						const body = ctx.body as Record<string, unknown>;

						let organizationId: string | null = null;

						if (typeof body.organizationId === "string") {
							organizationId = body.organizationId;
						} else if (typeof body.organizationSlug === "string") {
							const result = await pool.query<{
								id: string;
							}>(
								`
												SELECT id
												FROM organization
												WHERE slug = $1
												LIMIT 1
											`,
								[body.organizationSlug],
							);

							organizationId = result.rows[0]?.id ?? null;
						}

						if (!organizationId) {
							return;
						}

						const membership = await getOrganizationMembership(
							pool,
							organizationId,
							userId,
						);

						if (!membership) {
							return;
						}

						if (!membership.active) {
							throw new APIError("FORBIDDEN", {
								message: "Your membership in this organization is inactive",
							});
						}
					}),
				},
			],
		},

		endpoints: {
			listEligibleOrganizationMembers: createAuthEndpoint(
				"/organization-member-status/eligible",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: organizationQuerySchema,
				},
				async (ctx) => {
					const organizationId = ctx.query.organizationId;

					if (
						!(await canAccessOrganization(
							pool,
							ctx.context.session.user.id,
							organizationId,
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
						memberId: string;
						userId: string;
						name: string;
						email: string;
						role: string;
					}>(
						`
                  SELECT
                    m.id AS "memberId",
                    u.id AS "userId",
                    u.name,
                    u.email,
                    m.role
                  FROM member m

                  INNER JOIN "user" u
                    ON u.id =
                      m."userId"

                  LEFT JOIN
                    "organizationMemberStatus" oms
                    ON oms."memberId" =
                      m.id

                  WHERE
                    m."organizationId" =
                      $1

                    AND COALESCE(
                      u.banned,
                      false
                    ) = false

                    AND COALESCE(
                      oms.active,
                      true
                    ) = true

                  ORDER BY
                    lower(u.name),
                    lower(u.email)
                `,
						[organizationId],
					);

					return ctx.json({
						members: result.rows,
					});
				},
			),

			listOrganizationMemberStatuses: createAuthEndpoint(
				"/organization-member-status/list",
				{
					method: "GET",
					use: [sessionMiddleware],
					query: organizationQuerySchema,
				},
				async (ctx) => {
					const organizationId = ctx.query.organizationId;

					if (
						!(await canAccessOrganization(
							pool,
							ctx.context.session.user.id,
							organizationId,
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
						memberId: string;
						userId: string;
						name: string;
						email: string;
						role: string;
						active: boolean;
						globallyBanned: boolean;
						source: string | null;
						reason: string | null;
						deactivatedAt: Date | null;
						reactivatedAt: Date | null;
					}>(
						`
                  SELECT
                    m.id AS "memberId",
                    u.id AS "userId",
                    u.name,
                    u.email,
                    m.role,

                    COALESCE(
                      oms.active,
                      true
                    ) AS active,

                    COALESCE(
                      u.banned,
                      false
                    ) AS "globallyBanned",

                    oms.source,
                    oms.reason,
                    oms."deactivatedAt",
                    oms."reactivatedAt"

                  FROM member m

                  INNER JOIN "user" u
                    ON u.id =
                      m."userId"

                  LEFT JOIN
                    "organizationMemberStatus" oms
                    ON oms."memberId" =
                      m.id

                  WHERE
                    m."organizationId" =
                      $1

                  ORDER BY
                    lower(u.name),
                    lower(u.email)
                `,
						[organizationId],
					);

					return ctx.json({
						members: result.rows,
					});
				},
			),

			setOrganizationMemberStatus: createAuthEndpoint(
				"/organization-member-status/set",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: setMemberStatusBodySchema,
				},
				async (ctx) => {
					if (
						!(await canManageOrganization(
							pool,
							ctx.context.session.user.id,
							ctx.body.organizationId,
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

					const membership = await getOrganizationMembership(
						pool,
						ctx.body.organizationId,
						ctx.body.userId,
					);

					if (!membership) {
						return ctx.json(
							{
								error: "Organization member not found",
							},
							{
								status: 404,
							},
						);
					}

					const status = await setOrganizationMemberStatus({
						pool,
						memberId: membership.memberId,
						userId: ctx.body.userId,
						organizationId: ctx.body.organizationId,
						active: ctx.body.active,
						source: ctx.body.source,
						reason: ctx.body.reason,
					});

					return ctx.json(status);
				},
			),
		},

		schema: {
			organizationMemberStatus: {
				modelName: "organizationMemberStatus",

				fields: {
					memberId: {
						type: "string",
						required: true,
						unique: true,
						references: {
							model: "member",
							field: "id",
							onDelete: "cascade",
						},
					},

					active: {
						type: "boolean",
						required: true,
						defaultValue: () => true,
					},

					source: {
						type: "string",
						required: false,
					},

					reason: {
						type: "string",
						required: false,
					},

					deactivatedAt: {
						type: "date",
						required: false,
					},

					reactivatedAt: {
						type: "date",
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
		},
	}) satisfies BetterAuthPlugin;
