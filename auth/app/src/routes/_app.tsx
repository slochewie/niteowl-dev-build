import { ensureSession as ensureSessionClient } from "@better-auth-ui/react";
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server";
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { appDefinitionsById } from "@niteowl/app-config";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { AppSidebar } from "@/components/app-sidebar";
import { AdminAccessProvider } from "@/components/auth/admin/admin-access-context";
import { OrganizationHeaderSelector } from "@/components/niteowl/organization-header-selector";
import { NiteOwlUserButton } from "@/components/niteowl/user-button";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_app")({
	async beforeLoad({ context: { queryClient }, location }) {
		const ensureSession = createIsomorphicFn()
			.server(() =>
				ensureSessionServer(queryClient, auth, {
					headers: getRequestHeaders(),
				}),
			)
			.client(() => ensureSessionClient(queryClient, authClient));

		const session = await ensureSession();

		if (!session) {
			throw redirect({
				to: "/auth/$path",
				params: {
					path: "sign-in",
				},
				search: {
					redirectTo: location.href,
				},
			});
		}

		return {
			session,
		};
	},

	component: AppLayout,
});

function AppLayout() {
	const { session } = Route.useRouteContext();

	return (
		<AdminAccessProvider role={session.user.role}>
			<SidebarProvider>
				<AppSidebar />

				<SidebarInset>
					<header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
						<SidebarTrigger className="-ml-1" />

						<Link to="/" className="min-w-0 truncate text-sm font-semibold">
							{appDefinitionsById.console.label}
						</Link>

						<div className="ml-auto flex min-w-0 items-center gap-2">
							<OrganizationHeaderSelector />
							<NiteOwlUserButton size="icon" align="end" />
						</div>
					</header>

					<main className="flex min-h-0 flex-1 flex-col">
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</AdminAccessProvider>
	);
}
