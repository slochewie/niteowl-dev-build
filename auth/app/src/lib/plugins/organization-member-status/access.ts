import type { Pool } from "pg";

type GlobalRoleRow = {
	role: string | null;
};

export type OrganizationMembership = {
	memberId: string;
	organizationId: string;
	userId: string;
	role: string;
	active: boolean;
};

export async function isGlobalAdmin(
	pool: Pool,
	userId: string,
	allowReadOnly = false,
) {
	const result = await pool.query<GlobalRoleRow>(
		`
			SELECT role
			FROM "user"
			WHERE id = $1
			LIMIT 1
		`,
		[userId],
	);

	const role = result.rows[0]?.role;

	return (
		role === "admin" ||
		(allowReadOnly && role === "admin-viewer")
	);
}

export async function getOrganizationMembership(
	pool: Pool,
	organizationId: string,
	userId: string,
) {
	const result =
		await pool.query<OrganizationMembership>(
			`
				SELECT
					m.id AS "memberId",
					m."organizationId",
					m."userId",
					m.role,
					COALESCE(oms.active, true) AS active
				FROM member AS m
				LEFT JOIN "organizationMemberStatus" AS oms
					ON oms."memberId" = m.id
				WHERE
					m."organizationId" = $1
					AND m."userId" = $2
				LIMIT 1
			`,
			[organizationId, userId],
		);

	return result.rows[0] ?? null;
}

export async function canAccessOrganization(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (
		await isGlobalAdmin(
			pool,
			userId,
			true,
		)
	) {
		return true;
	}

	const membership =
		await getOrganizationMembership(
			pool,
			organizationId,
			userId,
		);

	return membership?.active === true;
}

export async function canManageOrganization(
	pool: Pool,
	userId: string,
	organizationId: string,
) {
	if (
		await isGlobalAdmin(
			pool,
			userId,
		)
	) {
		return true;
	}

	const membership =
		await getOrganizationMembership(
			pool,
			organizationId,
			userId,
		);

	return (
		membership?.active === true &&
		(
			membership.role === "owner" ||
			membership.role === "admin"
		)
	);
}
