import {
  type OrganizationAuthClient,
  useAuth,
  useHasPermission
} from "@better-auth-ui/react"
import type { ComponentProps } from "react"

import { cn } from "#/lib/utils.ts"
import { OrganizationDangerZone } from "./organization-danger-zone"
import { OrganizationProfile } from "./organization-profile"

export type OrganizationSettingsProps = {
  className?: string
}

/**
 * Organization settings UI.
 *
 * Only users with organization:update permission may render
 * organization profile, plugin-contributed settings cards,
 * and the danger zone.
 */
export function OrganizationSettings({
  className,
  ...props
}: OrganizationSettingsProps & ComponentProps<"div">) {
  const {
    authClient,
    plugins
  } = useAuth()

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

  if (
    updatePermissionPending ||
    !canManageOrganization
  ) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-6",
        className
      )}
      {...props}
    >
      <OrganizationProfile />

      {plugins.flatMap((plugin) =>
        plugin.organizationCards?.map(
          (Card, index) => (
            <Card
              key={`${plugin.id}-${index.toString()}`}
            />
          )
        ) ?? []
      )}

      <OrganizationDangerZone />
    </div>
  )
}
