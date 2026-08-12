import { apiKeyClient } from "@better-auth/api-key/client"
import { createAuthClient } from "better-auth/react"
import {
  adminClient,
  emailOTPClient,
  jwtClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    usernameClient(),
    multiSessionClient(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
    jwtClient(),
    magicLinkClient(),
    emailOTPClient(),
    apiKeyClient(),
  ],
})
