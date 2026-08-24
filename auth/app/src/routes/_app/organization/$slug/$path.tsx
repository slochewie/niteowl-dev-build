import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth
} from "@better-auth-ui/react"
import {
  createFileRoute,
  Link,
  notFound
} from "@tanstack/react-router"

import {
  Organization
} from "@/components/auth/organization/organization"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {
  organizationPlugin
} from "@/lib/auth/organization-plugin"

const validOrganizationPaths = [
  ...Object.values(
    organizationPlugin()
      .viewPaths.organization
  ),
  "teams"
]

export const Route =
  createFileRoute(
    "/_app/organization/$slug/$path"
  )({
    beforeLoad({
      params: {
        path
      }
    }) {
      if (
        !validOrganizationPaths.includes(
          path
        )
      ) {
        throw notFound()
      }
    },

    component:
      OrganizationPage
  })

function organizationPageTitle(
  path: string
) {
  switch (path) {
    case "settings":
      return "Settings"

    case "people":
      return "People"

    case "teams":
      return "Teams"

    default:
      return path
        .split("-")
        .map(
          (part) =>
            part.charAt(0)
              .toUpperCase() +
            part.slice(1)
        )
        .join(" ")
  }
}

function OrganizationPage() {
  const {
    path
  } =
    Route.useParams()

  const {
    authClient
  } =
    useAuth()

  const {
    data:
      activeOrganization
  } =
    useActiveOrganization(
      authClient as
        OrganizationAuthClient
    )

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/settings/organizations"
              >
                Organizations
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {activeOrganization?.name ??
                "Organization"}
            </BreadcrumbPage>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {organizationPageTitle(
                path
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Organization
        path={path}
        hideNav
      />
    </div>
  )
}
