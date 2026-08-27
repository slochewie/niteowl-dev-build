import { getRequest } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";
import { canManageAdmin, canViewAdmin } from "@/lib/admin/permissions";

async function getAdminContext() {
	const request = getRequest();

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	return {
		request,
		session,
	};
}

export async function requireAdminRead() {
	const context = await getAdminContext();

	if (!canViewAdmin(context.session.user.role)) {
		throw new Error("Forbidden");
	}

	return {
		...context,
		readOnly: !canManageAdmin(context.session.user.role),
	};
}

export async function requireAdminWrite() {
	const context = await getAdminContext();

	if (!canManageAdmin(context.session.user.role)) {
		throw new Error("Forbidden");
	}

	return context;
}
