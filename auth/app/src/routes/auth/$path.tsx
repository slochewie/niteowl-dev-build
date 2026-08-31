import { viewPaths } from "@better-auth-ui/core"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { Auth } from "@/components/auth/auth"
import { ResetPassword } from "@/components/auth/reset-password"
import { emailOtpPlugin } from "@/lib/auth/email-otp-plugin"
import { magicLinkPlugin } from "@/lib/auth/magic-link-plugin"
import { twoFactorPlugin } from "@/lib/auth/two-factor-plugin"
import { oauthProviderPlugin } from "@/lib/auth/oauth-provider-plugin"

const validAuthPathSegments = new Set([
  "set-password",
  ...Object.values(viewPaths.auth),
  ...Object.values(oauthProviderPlugin().viewPaths.auth),
  magicLinkPlugin().viewPaths.auth.magicLink,
  emailOtpPlugin().viewPaths.auth.emailOtp,
  twoFactorPlugin().viewPaths.auth.twoFactor
])

export const Route = createFileRoute("/auth/$path")({
  beforeLoad({ params: { path } }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" })
    }
  },
  component: AuthPage
})

function AuthPage() {
  const { path } = Route.useParams()

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      {path === "set-password" ? <ResetPassword setup /> : <Auth path={path} />}
    </div>
  )
}
