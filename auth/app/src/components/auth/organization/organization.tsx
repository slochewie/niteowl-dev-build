import type { OrganizationView } from "@better-auth-ui/core/plugins"
import {
  type OrganizationAuthClient,
  useActiveOrganization,
  useAuth,
  useAuthenticate,
  useAuthPlugin
} from "@better-auth-ui/react"
import { OrganizationTeams } from "./organization-teams"
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

type LocalOrganizationView = OrganizationView | "teams"

export type OrganizationProps = {
  className?: string
  hideNav?: boolean
  path?: string
  view?: LocalOrganizationView
}

/**
 * Organization management shell: tabs for profile / danger zone,
 * people (members / invitations), and teams.
 */
export function Organization({
  className,
  hideNav,
  path,
  view
}: OrganizationProps) {
  if (!view && !path) {
    throw new Error("[Better Auth UI] Either `view` or `path` must be provided")
  }

  const { authClient, basePaths, localization, navigate } = useAuth()
  useAuthenticate(authClient)

  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths,
    slug,
    slugPrefix
  } = useAuthPlugin(organizationPlugin)

  const { data: activeOrganization, isPending } = useActiveOrganization(
    authClient as OrganizationAuthClient
  )

  useEffect(() => {
    if (!isPending && !activeOrganization) {
      navigate({
        to: `${basePaths.settings}/${organizationViewPaths.settings?.organizations}`,
        replace: true
      })
    }
  }, [
    basePaths.settings,
    isPending,
    navigate,
    organizationViewPaths.settings?.organizations,
    activeOrganization
  ])

  const currentView = useMemo<LocalOrganizationView | undefined>(() => {
    if (view) return view

    if (path === "teams") {
      return "teams"
    }

    const match = Object.entries(organizationViewPaths.organization).find(
      ([, segment]) => segment === path
    )

    return match?.[0] as OrganizationView | undefined
  }, [view, path, organizationViewPaths.organization])

  if (!currentView) {
    const validPaths = [
      ...Object.values(organizationViewPaths.organization),
      "teams"
    ].join(", ")

    throw new Error(
      `[Better Auth UI] Unknown organization path "${path}". Valid paths are: ${validPaths}`
    )
  }

  if (!isPending && !activeOrganization) {
    return null
  }

  return (
    <Tabs
      value={currentView}
      className={cn("w-full gap-4 md:gap-6", className)}
    >
      <div className={cn(hideNav && "hidden")}>
        <TabsList aria-label={localization.settings.settings}>
          <TabsTrigger
            value="settings"
            className="gap-1"
            onClick={() =>
              navigate({
                to: slug
                  ? `${basePaths.organization}/${slugPrefix}${slug}/${organizationViewPaths.organization.settings}`
                  : `${basePaths.organization}/${organizationViewPaths.organization.settings}`
              })
            }
          >
            <SettingsIcon className="text-muted-foreground" />
            {localization.settings.settings}
          </TabsTrigger>

          <TabsTrigger
            value="people"
            className="gap-1"
            onClick={() =>
              navigate({
                to: slug
                  ? `${basePaths.organization}/${slugPrefix}${slug}/${organizationViewPaths.organization.people}`
                  : `${basePaths.organization}/${organizationViewPaths.organization.people}`
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
                to: slug
                  ? `${basePaths.organization}/${slugPrefix}${slug}/teams`
                  : `${basePaths.organization}/teams`
              })
            }
          >
            <TeamsIcon className="text-muted-foreground" />
            Teams
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="settings" tabIndex={-1}>
        <OrganizationSettings />
      </TabsContent>

      <TabsContent value="people" tabIndex={-1}>
        <OrganizationPeople />
      </TabsContent>

      <TabsContent value="teams" tabIndex={-1}>
        <OrganizationTeams />
      </TabsContent>

    </Tabs>
  )
}
