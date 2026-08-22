import { createAuthPlugin } from "@better-auth-ui/core"

import { OrganizationUnifiIdentity } from "#/components/auth/organization/organization-unifi-identity.tsx"

export const unifiIdentityPlugin = createAuthPlugin(
  "unifi-identity",
  () => {
    return {
      id: "unifi-identity",
      organizationCards: [
        OrganizationUnifiIdentity,
      ],
    }
  }
)
