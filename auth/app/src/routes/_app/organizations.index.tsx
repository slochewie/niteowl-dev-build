import {
  createFileRoute
} from "@tanstack/react-router"

import {
  OrganizationsTable
} from "@/components/auth/admin/organizations-table"
import {
  getAdminOrganizations
} from "@/lib/admin/organizations"

export const Route =
  createFileRoute(
    "/_app/organizations/"
  )({
    loader: async () => {
      const organizations =
        await getAdminOrganizations()

      return {
        organizations
      }
    },

    component: OrganizationsPage
  })

function OrganizationsPage() {
  const {
    organizations
  } = Route.useLoaderData()

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-6 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Organizations
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your organizations
        </p>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <OrganizationsTable
          organizations={
            organizations
          }
        />
      </div>
    </div>
  )
}
