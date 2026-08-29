import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { ThemeProvider, useTheme } from "next-themes"
import type { ReactNode } from "react"
import { apiKeyPlugin } from "@/lib/auth/api-key-plugin"
import { adminPlugin } from "@/lib/auth/admin-plugin"
import { oauthProviderPlugin } from "@/lib/auth/oauth-provider-plugin"
import { deleteUserPlugin } from "@/lib/auth/delete-user-plugin"
import { emailOtpPlugin } from "@/lib/auth/email-otp-plugin"
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin"
import { multiSessionPlugin } from "@/lib/auth/multi-session-plugin"
import { organizationPlugin } from "@/lib/auth/organization-plugin"
import { passkeyPlugin } from "@/lib/auth/passkey-plugin"
import { themePlugin } from "@/lib/auth/theme-plugin"
import { twoFactorPlugin } from "@/lib/auth/two-factor-plugin"
import { usernamePlugin } from "@/lib/auth/username-plugin"
import { unifiIdentityPlugin } from "@/lib/auth/unifi-identity-plugin"
import { authClient } from "@/lib/auth-client"
import { AuthProvider } from "./auth/auth-provider"
import { Toaster } from "./ui/sonner"

export function Providers({ children }: { children: ReactNode }) {
  const routerNavigate = useNavigate()
  const { slug } = useParams({ strict: false })

  const navigate = ({
    to,
    ...options
  }: Parameters<typeof routerNavigate>[0]) => {
    if (
      typeof to === "string" &&
      /^https?:\/\//i.test(to)
    ) {
      window.location.assign(to)
      return
    }

    return routerNavigate({
      to,
      ...options
    })
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        socialProviders={["github"]}
        emailAndPassword={{ requireEmailVerification: false }}
        navigate={navigate}
        plugins={[
          adminPlugin(),
          usernamePlugin({
            usernamePrefix: "@",
            localization: { usernamePlaceholder: "username" }
          }),
          oauthProviderPlugin(),
          magicLinkPlugin(),
          emailOtpPlugin({
            emailVerification: true,
            passwordReset: true,
            changeEmail: true
          }),
          twoFactorPlugin(),
          passkeyPlugin(),
          apiKeyPlugin({ organization: true }),
          unifiIdentityPlugin(),
          adminPlugin(),
          themePlugin({ useTheme }),
          multiSessionPlugin(),
          deleteUserPlugin(),
          organizationPlugin({ slug: slug ?? null }),
        ]}
        Link={({ href, ...props }) => <Link to={href} {...props} />}
      >
        {children}

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
