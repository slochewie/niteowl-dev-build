import {
  viewPaths
} from "@better-auth-ui/core"
import {
  createFileRoute,
  notFound
} from "@tanstack/react-router"

import {
  Settings
} from "@/components/auth/settings/settings"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {
  organizationPlugin
} from "@/lib/auth/organization-plugin"

const validSettingsPaths = [
  ...Object.values(
    viewPaths.settings
  ),
  ...Object.values(
    organizationPlugin()
      .viewPaths.settings
  )
]

export const Route =
  createFileRoute(
    "/_app/settings/$path"
  )({
    beforeLoad({
      params: {
        path
      }
    }) {
      if (
        !validSettingsPaths.includes(
          path
        )
      ) {
        throw notFound()
      }
    },

    component:
      SettingsPage
  })

function settingsTitle(
  path: string
) {
  switch (path) {
    case "account":
      return "Account"

    case "security":
      return "Security"

    case "organizations":
      return "Organizations"

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

function SettingsPage() {
  const {
    path
  } =
    Route.useParams()

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              Settings
            </BreadcrumbPage>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {settingsTitle(
                path
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Settings
        path={path}
        hideNav
      />
    </div>
  )
}
