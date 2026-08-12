import type { OrganizationView } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthenticate,
  useAuthPlugin,
  useHasPermission
} from "@better-auth-ui/react"
import {
  Settings as SettingsIcon,
  User2 as UserIcon,
  UsersRound as TeamsIcon
} from "lucide-react"
import { useEffect, useMemo } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { cn } from "#/lib/utils.ts"
import { OrganizationPeople } from "./organization-people"
import { OrganizationSettings } from "./organization-settings"
import { OrganizationTeams } from "./organization-teams"

type LocalOrganizationView = OrganizationView | "teams"

export type OrganizationProps = {
  className?: string
  hideNav?: boolean
  path?: string
  view?: LocalOrganizationView
}

/**
 * Organization shell.
 *
 * Members can view People and Teams.
 * Organization Settings is only available to users with
 * organization:update permission.
 */
export function Organization({
  className,
  hideNav,
  path,
  view
}: OrganizationProps) {
  if (!view && !path) {
    throw new Error(
      "[Better Auth UI] Either `view` or `path` must be provided"
    )
  }

  const {
    authClient,
    basePaths,
    localization,
    navigate
  } = useAuth()

  useAuthenticate(authClient)

  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths,
    slug,
    slugPrefix
  } = useAuthPlugin(organizationPlugin)

  const {
    data: activeOrganization,
    isPending: activeOrganizationPending
  } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  const {
    data: updatePermission,
    isPending: updatePermissionPending
  } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      permissions: {
        organization: ["update"]
      }
    }
  )

  const canManageOrganization =
    updatePermission?.success === true

  const currentView =
    useMemo<LocalOrganizationView | undefined>(
      () => {
        if (view) return view

        if (path === "teams") {
          return "teams"
        }

        const match = Object.entries(
          organizationViewPaths.organization
        ).find(([, segment]) => segment === path)

        return match?.[0] as
          | OrganizationView
          | undefined
      },
      [
        view,
        path,
        organizationViewPaths.organization
      ]
    )

  const organizationBasePath = slug
    ? `${basePaths.organization}/${slugPrefix}${slug}`
    : basePaths.organization

  useEffect(() => {
    if (
      !activeOrganizationPending &&
      !activeOrganization
    ) {
      navigate({
        to: `${basePaths.settings}/${organizationViewPaths.settings?.organizations}`,
        replace: true
      })
    }
  }, [
    activeOrganization,
    activeOrganizationPending,
    basePaths.settings,
    navigate,
    organizationViewPaths.settings?.organizations
  ])

  useEffect(() => {
    if (
      activeOrganizationPending ||
      updatePermissionPending ||
      !activeOrganization
    ) {
      return
    }

    if (
      currentView === "settings" &&
      !canManageOrganization
    ) {
      navigate({
        to: `${organizationBasePath}/${organizationViewPaths.organization.people}`,
        replace: true
      })
    }
  }, [
    activeOrganization,
    activeOrganizationPending,
    canManageOrganization,
    currentView,
    navigate,
    organizationBasePath,
    organizationViewPaths.organization.people,
    updatePermissionPending
  ])

  if (!currentView) {
    const validPaths = [
      ...Object.values(
        organizationViewPaths.organization
      ),
      "teams"
    ].join(", ")

    throw new Error(
      `[Better Auth UI] Unknown organization path "${path}". Valid paths are: ${validPaths}`
    )
  }

  if (
    activeOrganizationPending ||
    updatePermissionPending
  ) {
    return null
  }

  if (!activeOrganization) {
    return null
  }

  if (
    currentView === "settings" &&
    !canManageOrganization
  ) {
    return null
  }

  return (
    <Tabs
      value={currentView}
      className={cn(
        "w-full gap-4 md:gap-6",
        className
      )}
    >
      <div className={cn(hideNav && "hidden")}>
        <TabsList
          aria-label={
            localization.settings.settings
          }
        >
          {canManageOrganization && (
            <TabsTrigger
              value="settings"
              className="gap-1"
              onClick={() =>
                navigate({
                  to: `${organizationBasePath}/${organizationViewPaths.organization.settings}`
                })
              }
            >
              <SettingsIcon className="text-muted-foreground" />

              {localization.settings.settings}
            </TabsTrigger>
          )}

          <TabsTrigger
            value="people"
            className="gap-1"
            onClick={() =>
              navigate({
                to: `${organizationBasePath}/${organizationViewPaths.organization.people}`
              })
            }
          >
            <UserIcon className="text-muted-foreground" />

            {organizationLocalization.people}
          </TabsTrigger>

          <TabsTrigger
            value="teams"
            className="gap-1"
            onClick={() =>
              navigate({
                to: `${organizationBasePath}/teams`
              })
            }
          >
            <TeamsIcon className="text-muted-foreground" />

            Teams
          </TabsTrigger>
        </TabsList>
      </div>

      {canManageOrganization && (
        <TabsContent
          value="settings"
          tabIndex={-1}
        >
          <OrganizationSettings />
        </TabsContent>
      )}

      <TabsContent
        value="people"
        tabIndex={-1}
      >
        <OrganizationPeople />
      </TabsContent>

      <TabsContent
        value="teams"
        tabIndex={-1}
      >
        <OrganizationTeams />
      </TabsContent>
    </Tabs>
  )
}
