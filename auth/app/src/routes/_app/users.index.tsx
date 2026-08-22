import {
  createFileRoute
} from "@tanstack/react-router"

import { UsersTable } from "@/components/auth/admin/users-table"
import { getAdminUsers } from "@/lib/admin/users"

export const Route =
  createFileRoute("/_app/users/")({
    loader: async () => {
      const users =
        await getAdminUsers()

      return {
        users
      }
    },

    component: UsersPage
  })

function UsersPage() {
  const { users } =
    Route.useLoaderData()

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-6 py-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Users
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage users and create new ones
        </p>
      </div>

      <div className="flex-1 p-6">
        <UsersTable users={users} />
      </div>
    </div>
  )
}
