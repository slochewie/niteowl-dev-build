import { createFileRoute, useRouter } from "@tanstack/react-router";

import { AdminWriteBoundary } from "@/components/auth/admin/admin-access-context";
import { OrganizationStatusControls } from "@/components/auth/admin/organization-status-controls";
import { OrganizationsTable } from "@/components/auth/admin/organizations-table";
import { getAdminOrganizations } from "@/lib/admin/organizations";

export const Route = createFileRoute("/_app/organizations/")({
	loader: async () => {
		const organizations = await getAdminOrganizations();

		return {
			organizations,
		};
	},

	component: OrganizationsPage,
});

function OrganizationsPage() {
	const { organizations } = Route.useLoaderData();

	const router = useRouter();

	async function refresh() {
		await router.invalidate();
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="border-b px-4 py-6 md:px-6">
				<h1 className="text-3xl font-semibold tracking-tight">Organizations</h1>

				<p className="mt-1 text-muted-foreground">Manage your organizations</p>
			</div>

			<div className="flex-1 space-y-6 p-4 md:p-6">
				<AdminWriteBoundary>
					<OrganizationStatusControls
						organizations={organizations}
						onChanged={refresh}
					/>
				</AdminWriteBoundary>

				<OrganizationsTable organizations={organizations} />
			</div>
		</div>
	);
}
