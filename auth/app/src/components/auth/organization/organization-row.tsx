import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useHasPermission,
  useSetActiveOrganization
} from "@better-auth-ui/react"
import type { Organization } from "better-auth/client"
import { Settings as SettingsIcon } from "lucide-react"

import { Button } from "#/components/ui/button.tsx"
import { Item, ItemActions } from "#/components/ui/item.tsx"
import { Spinner } from "#/components/ui/spinner.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { OrganizationView } from "./organization-view"

export type OrganizationRowProps = {
  organization: Organization
}

/**
 * Single organization row.
 *
 * All members can see organizations they belong to.
 * The Manage action is only shown to users with
 * organization:update permission for that organization.
 */
export function OrganizationRow({
  organization
}: OrganizationRowProps) {
  const {
    authClient,
    basePaths,
    navigate
  } = useAuth()

  const {
    localization: organizationLocalization,
    viewPaths: organizationViewPaths,
    slug,
    slugPrefix
  } = useAuthPlugin(organizationPlugin)

  const {
    data: updatePermission,
    isPending: updatePermissionPending
  } = useHasPermission(
    authClient as OrganizationAuthClient,
    {
      organizationId: organization.id,
      permissions: {
        organization: ["update"]
      }
    }
  )

  const canManageOrganization =
    updatePermission?.success === true

  const {
    mutate: setActiveOrganization,
    isPending: setActivePending
  } = useSetActiveOrganization(
    authClient as OrganizationAuthClient,
    {
      onSuccess: () => {
        navigate({
          to: `${basePaths.organization}/${organizationViewPaths.organization.settings}`
        })
      }
    }
  )

  function manageOrganization() {
    if (slug !== undefined) {
      navigate({
        to: `${basePaths.organization}/${slugPrefix}${organization.slug}/${organizationViewPaths.organization.settings}`
      })
    } else {
      setActiveOrganization({
        organizationId: organization.id
      })
    }
  }

  return (
    <Item>
      <OrganizationView
        organization={organization}
      />

      {canManageOrganization && (
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            disabled={
              setActivePending ||
              updatePermissionPending
            }
            onClick={manageOrganization}
            aria-label={
              organizationLocalization.manage
            }
          >
            {setActivePending ? (
              <Spinner />
            ) : (
              <SettingsIcon />
            )}

            {organizationLocalization.manage}
          </Button>
        </ItemActions>
      )}
    </Item>
  )
}
