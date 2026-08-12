import { createAuthPlugin } from "@better-auth-ui/core"
import {
  oauthProviderPlugin as coreOAuthProviderPlugin,
  type OAuthProviderPluginOptions
} from "@better-auth-ui/core/plugins"

import { AuthorizedApplications } from "#/components/auth/oauth-provider/authorized-applications.tsx"
import { OAuthConsent } from "#/components/auth/oauth-provider/oauth-consent.tsx"
import { OAuthSelectAccount } from "#/components/auth/oauth-provider/oauth-select-account.tsx"
import { OAuthSignUp } from "#/components/auth/oauth-provider/oauth-sign-up.tsx"

export const oauthProviderPlugin = createAuthPlugin(
  coreOAuthProviderPlugin.id,
  (options: OAuthProviderPluginOptions = {}) => {
    const core = coreOAuthProviderPlugin(options)

    return {
      ...core,
      views: {
        auth: {
          oauthConsent: OAuthConsent,
          // A route of its own rather than an override of the built-in
          // `signUp` view — ordinary sign-up stays untouched.
          oauthSignUp: OAuthSignUp,
          oauthSelectAccount: OAuthSelectAccount
        }
      },
      ...(core.showConnectedApplications
        ? { securityCards: [AuthorizedApplications] }
        : {})
    }
  }
)
