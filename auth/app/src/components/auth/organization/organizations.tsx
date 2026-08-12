"use client"

import {
  type OrganizationAuthClient,
  useAuth,
  useAuthPlugin,
  useListOrganizations,
  useSession
} from "@better-auth-ui/react"
import { Fragment, useState } from "react"

import { Button } from "#/components/ui/button.tsx"
import {
  Card,
  CardContent
} from "#/components/ui/card.tsx"
import {
  Item,
  ItemGroup,
  ItemSeparator
} from "#/components/ui/item.tsx"
import { organizationPlugin } from "#/lib/auth/organization-plugin.tsx"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { OrganizationRow } from "./organization-row"
import { OrganizationViewSkeleton } from "./organization-view-skeleton"
import { OrganizationsEmpty } from "./organizations-empty"

export type OrganizationsProps = {
  className?: string
}

/**
 * Lists organizations the current user belongs to.
 *
 * Only global Better Auth admins may create organizations.
 * Organization management controls are permission-gated
 * by OrganizationRow.
 */
export function Organizations({
  className
}: OrganizationsProps) {
  const { authClient } = useAuth()

  const {
    localization: organizationLocalization
  } = useAuthPlugin(organizationPlugin)

  const {
    data: session,
    isPending: sessionPending
  } = useSession(authClient)

  const [
    createOpen,
    setCreateOpen
  ] = useState(false)

  const {
    data: organizations,
    isPending: organizationsPending
  } = useListOrganizations(
    authClient as OrganizationAuthClient
  )

  const canCreateOrganization =
    session?.user.role === "admin"

  const isPending =
    organizationsPending ||
    sessionPending

  return (
    <>
      <div className={className}>
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="truncate text-sm font-semibold">
              {
                organizationLocalization.organizations
              }
            </h2>

            {canCreateOrganization && (
              <Button
                className="shrink-0"
                size="sm"
                disabled={isPending}
                onClick={() =>
                  setCreateOpen(true)
                }
              >
                {
                  organizationLocalization.createOrganization
                }
              </Button>
            )}
          </div>

          <Card className="p-0">
            <CardContent className="p-0">
              {isPending ? (
                <ItemGroup>
                  <Item>
                    <OrganizationViewSkeleton />
                  </Item>
                </ItemGroup>
              ) : !organizations?.length ? (
                canCreateOrganization ? (
                  <OrganizationsEmpty
                    onCreatePress={() =>
                      setCreateOpen(true)
                    }
                  />
                ) : (
                  <ItemGroup>
                    <Item>
                      No organizations
                    </Item>
                  </ItemGroup>
                )
              ) : (
                <ItemGroup className="gap-0">
                  {organizations.map(
                    (
                      organization,
                      index
                    ) => (
                      <Fragment
                        key={
                          organization.id
                        }
                      >
                        {index > 0 && (
                          <ItemSeparator />
                        )}

                        <OrganizationRow
                          organization={
                            organization
                          }
                        />
                      </Fragment>
                    )
                  )}
                </ItemGroup>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {canCreateOrganization && (
        <CreateOrganizationDialog
          open={createOpen}
          onOpenChange={
            setCreateOpen
          }
        />
      )}
    </>
  )
}
