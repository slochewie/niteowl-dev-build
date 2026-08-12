import { ensureSession as ensureSessionClient } from "@better-auth-ui/react"
import { ensureSession as ensureSessionServer } from "@better-auth-ui/react/server"
import { createFileRoute, notFound, redirect } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { Organization } from "@/components/auth/organization/organization"
import { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"
import { organizationPlugin } from "@/lib/auth/organization-plugin"

const validOrganizationPaths = [
  ...Object.values(organizationPlugin().viewPaths.organization),
  "teams"
]

export const Route = createFileRoute("/organization/$slug/$path")({
  async beforeLoad({ params: { path }, context: { queryClient }, location }) {
    if (!validOrganizationPaths.includes(path)) {
      throw notFound()
    }

    const ensureSession = createIsomorphicFn()
      .server(() =>
        ensureSessionServer(queryClient, auth, { headers: getRequestHeaders() })
      )
      .client(() => ensureSessionClient(queryClient, authClient))

    const session = await ensureSession()

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href }
      })
    }

    return { session }
  },
  component: OrganizationPage
})

function OrganizationPage() {
  const { path } = Route.useParams()
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <Organization path={path} />
    </div>
  )
}
