"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";

import { canManageAdmin, canViewAdmin } from "@/lib/admin/permissions";

type AdminAccessContextValue = {
	canView: boolean;
	canManage: boolean;
	readOnly: boolean;
};

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

export function AdminAccessProvider({
	children,
	role,
}: {
	children: ReactNode;
	role: unknown;
}) {
	const value = useMemo(() => {
		const canView = canViewAdmin(role);

		const canManage = canManageAdmin(role);

		return {
			canView,
			canManage,
			readOnly: canView && !canManage,
		};
	}, [role]);

	return (
		<AdminAccessContext.Provider value={value}>
			{children}
		</AdminAccessContext.Provider>
	);
}

export function AdminWriteBoundary({
	children,
	className = "min-w-0 border-0 p-0",
}: {
	children: ReactNode;
	className?: string;
}) {
	const { readOnly } = useAdminAccess();

	return (
		<fieldset
			disabled={readOnly}
			aria-disabled={readOnly}
			className={className}
		>
			{children}
		</fieldset>
	);
}

export function useAdminAccess() {
	const context = useContext(AdminAccessContext);

	if (!context) {
		throw new Error("useAdminAccess must be used inside AdminAccessProvider");
	}

	return context;
}
