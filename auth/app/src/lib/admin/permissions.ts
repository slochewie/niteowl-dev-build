import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
	...defaultStatements,
} as const;

export const adminAccessControl = createAccessControl(statements);

export const adminRole = adminAccessControl.newRole({
	...adminAc.statements,
});

export const adminViewerRole = adminAccessControl.newRole({
	user: ["list", "get"],
	session: ["list"],
});

export const userRole = adminAccessControl.newRole({});

export const ADMIN_ROLE = "admin";

export const ADMIN_VIEWER_ROLE = "admin-viewer";

function getRoleNames(role: unknown) {
	if (Array.isArray(role)) {
		return role.filter((value): value is string => typeof value === "string");
	}

	if (typeof role !== "string") {
		return [];
	}

	return role
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean);
}

export function canManageAdmin(role: unknown) {
	return getRoleNames(role).includes(ADMIN_ROLE);
}

export function canViewAdmin(role: unknown) {
	const roles = getRoleNames(role);

	return roles.includes(ADMIN_ROLE) || roles.includes(ADMIN_VIEWER_ROLE);
}
