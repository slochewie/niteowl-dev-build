import { createServerFn } from "@tanstack/react-start";
import { requireAdminRead, requireAdminWrite } from "@/lib/admin/access";
import { auth, pool, redis } from "@/lib/auth";
import {
	getUserProfile,
	upsertUserProfile,
	type UserProfileFields,
} from "@/lib/plugins/user-profile/index";

export type AdminUserOrganization = {
	id: string;
	memberId: string;
	name: string;
	slug: string;
	logo: string | null;
	role: string;
	joinedAt: Date;
};

export type AdminUserListItem = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	username: string | null;
	displayUsername: string | null;
	role: string | null;
	banned: boolean;
	banReason: string | null;
	banExpires: Date | null;
	createdAt: Date;
	updatedAt: Date;
	organizations: AdminUserOrganization[];
};

export type AdminUserAccount = {
	id: string;
	accountId: string;
	providerId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type AdminUserSession = {
	id: string;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	expiresAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
	impersonatedBy: string | null;
	activeOrganizationId: string | null;
	activeTeamId: string | null;
};

export type AdminUserDetail = Omit<AdminUserListItem, "organizations"> & {
	accounts: AdminUserAccount[];
	sessions: AdminUserSession[];
	organizations: AdminUserOrganization[];
};

export const getAdminUsers = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminUserListItem[]> => {
	await requireAdminRead();

	const result = await pool.query<{
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image: string | null;
		username: string | null;
		displayUsername: string | null;
		role: string | null;
		banned: boolean | null;
		banReason: string | null;
		banExpires: Date | null;
		createdAt: Date;
		updatedAt: Date;
		organizations: AdminUserOrganization[];
	}>(`
    SELECT
      u.id,
      u.name,
      u.email,
      u."emailVerified",
      u.image,
      u.username,
      u."displayUsername",
      u.role,
      COALESCE(u.banned, false) AS banned,
      u."banReason",
      u."banExpires",
      u."createdAt",
      u."updatedAt",
      COALESCE(
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'id', o.id,
            'memberId', m.id,
            'name', o.name,
            'slug', o.slug,
            'logo', o.logo,
            'role', m.role,
            'joinedAt', m."createdAt"
          )
        ) FILTER (
          WHERE o.id IS NOT NULL
        ),
        '[]'::jsonb
      ) AS organizations
    FROM "user" u
    LEFT JOIN member m
      ON m."userId" = u.id
    LEFT JOIN organization o
      ON o.id = m."organizationId"
    GROUP BY
      u.id
    ORDER BY
      u."createdAt" DESC
  `);

	return result.rows.map((row) => ({
		...row,
		banned: row.banned === true,
		organizations: row.organizations ?? [],
	}));
});

export const getAdminUser = createServerFn({
	method: "GET",
})
	.validator((data: { userId: string }) => data)
	.handler(async ({ data }): Promise<AdminUserDetail> => {
		await requireAdminRead();

		const userResult = await pool.query<{
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image: string | null;
			username: string | null;
			displayUsername: string | null;
			role: string | null;
			banned: boolean | null;
			banReason: string | null;
			banExpires: Date | null;
			createdAt: Date;
			updatedAt: Date;
		}>(
			`
        SELECT
          id,
          name,
          email,
          "emailVerified",
          image,
          username,
          "displayUsername",
          role,
          COALESCE(banned, false) AS banned,
          "banReason",
          "banExpires",
          "createdAt",
          "updatedAt"
        FROM "user"
        WHERE id = $1
        LIMIT 1
      `,
			[data.userId],
		);

		const user = userResult.rows[0];

		if (!user) {
			throw new Error("User not found");
		}

		const accountsResult = await pool.query<AdminUserAccount>(
			`
          SELECT
            id,
            "accountId",
            "providerId",
            "createdAt",
            "updatedAt"
          FROM account
          WHERE "userId" = $1
          ORDER BY "createdAt" ASC
        `,
			[data.userId],
		);

		const sessionsResult = await pool.query<AdminUserSession>(
			`
          SELECT
            id,
            token,
            "createdAt",
            "updatedAt",
            "expiresAt",
            "ipAddress",
            "userAgent",
            "impersonatedBy",
            "activeOrganizationId",
            "activeTeamId"
          FROM session
          WHERE "userId" = $1
          ORDER BY "createdAt" DESC
        `,
			[data.userId],
		);

		const organizationsResult = await pool.query<AdminUserOrganization>(
			`
          SELECT
            o.id,
            m.id AS "memberId",
            o.name,
            o.slug,
            o.logo,
            m.role,
            m."createdAt" AS "joinedAt"
          FROM member m
          INNER JOIN organization o
            ON o.id = m."organizationId"
          WHERE m."userId" = $1
          ORDER BY o.name ASC
        `,
			[data.userId],
		);

		return {
			...user,
			banned: user.banned === true,
			accounts: accountsResult.rows,
			sessions: sessionsResult.rows,
			organizations: organizationsResult.rows,
		};
	});

export const getAdminUserProfile = createServerFn({
	method: "GET",
})
	.validator((data: { userId: string }) => data)
	.handler(async ({ data }) => {
		await requireAdminRead();

		return getUserProfile(pool, data.userId);
	});

export const updateAdminUserProfile = createServerFn({
	method: "POST",
})
	.validator((data: { userId: string; fields: UserProfileFields }) => data)
	.handler(async ({ data }) => {
		await requireAdminWrite();

		return upsertUserProfile(pool, data.userId, data.fields);
	});

export const sendAdminSetupEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (
      !data ||
      typeof data !== "object" ||
      !("userId" in data) ||
      typeof data.userId !== "string" ||
      !data.userId.trim() ||
      data.userId.length > 256
    ) {
      throw new Error("Invalid user ID");
    }

    return { userId: data.userId.trim() };
  })
  .handler(async ({ data }) => {
    const { request } = await requireAdminWrite();

    const result = await pool.query<{
      email: string;
      banned: boolean | null;
    }>(
      'SELECT email, banned FROM "user" WHERE id = $1 LIMIT 1',
      [data.userId],
    );

    const user = result.rows[0];

    if (!user) throw new Error("User not found");

    if (user.banned) {
      throw new Error("Unban this user before sending a setup email");
    }

    const allowed = await redis.set(
      "onboarding:send:" + data.userId,
      "1",
      "EX",
      60,
      "NX",
    );

    if (!allowed) {
      throw new Error(
        "Please wait one minute before sending another setup email",
      );
    }

    await auth.api.requestPasswordReset({
      headers: request.headers,
      body: {
        email: user.email,
        redirectTo: "/auth/set-password",
      },
    });

    return { success: true };
  });
