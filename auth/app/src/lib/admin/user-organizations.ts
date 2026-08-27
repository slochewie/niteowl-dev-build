import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { requireAdminRead, requireAdminWrite } from "@/lib/admin/access";
import { auth, pool } from "@/lib/auth";

export type AdminOrganizationOption = {
	id: string;
	name: string;
	slug: string;
	logo: string | null;
};

export const getAllOrganizations = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminOrganizationOption[]> => {
	await requireAdminRead();

	const result = await pool.query<AdminOrganizationOption>(
		`
          SELECT
            id,
            name,
            slug,
            logo
          FROM organization
          ORDER BY name ASC
        `,
	);

	return result.rows;
});

export const addUserToOrganization = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			userId: string;
			organizationId: string;
			role: "member" | "admin" | "owner";
		}) => data,
	)
	.handler(async ({ data }) => {
		await requireAdminWrite();

		await auth.api.addMember({
			body: {
				userId: data.userId,
				organizationId: data.organizationId,
				role: data.role,
			},
		});

		return {
			ok: true,
		};
	});

export const updateUserOrganizationRole = createServerFn({
	method: "POST",
})
	.validator(
		(data: {
			memberId: string;
			organizationId: string;
			role: "member" | "admin" | "owner";
		}) => data,
	)
	.handler(async ({ data }) => {
		await requireAdminWrite();

		const request = getRequest();

		await auth.api.updateMemberRole({
			body: {
				memberId: data.memberId,
				organizationId: data.organizationId,
				role: data.role,
			},
			headers: request.headers,
		});

		return {
			ok: true,
		};
	});

export const removeUserFromOrganization = createServerFn({
	method: "POST",
})
	.validator((data: { memberId: string; organizationId: string }) => data)
	.handler(async ({ data }) => {
		await requireAdminWrite();

		const request = getRequest();

		await auth.api.removeMember({
			body: {
				memberIdOrEmail: data.memberId,
				organizationId: data.organizationId,
			},
			headers: request.headers,
		});

		return {
			ok: true,
		};
	});
