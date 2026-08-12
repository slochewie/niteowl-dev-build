import { createAuthPlugin } from "@better-auth-ui/core"
import {
  emailOtpPlugin as coreEmailOtpPlugin,
  type EmailOtpPluginOptions
} from "@better-auth-ui/core/plugins"

import { ChangeEmailOtp } from "#/components/auth/email-otp/change-email-otp.tsx"
import { EmailOtp } from "#/components/auth/email-otp/email-otp.tsx"
import { EmailOtpButton } from "#/components/auth/email-otp/email-otp-button.tsx"
import { ForgotPasswordOtp } from "#/components/auth/email-otp/forgot-password-otp.tsx"
import { ResetPasswordOtp } from "#/components/auth/email-otp/reset-password-otp.tsx"
import { VerifyEmailOtp } from "#/components/auth/email-otp/verify-email-otp.tsx"

export const emailOtpPlugin = createAuthPlugin(
  coreEmailOtpPlugin.id,
  (options: EmailOtpPluginOptions = {}) => {
    const plugin = coreEmailOtpPlugin(options)

    return {
      ...plugin,
      authButtons: plugin.signIn ? [EmailOtpButton] : [],
      // Each flow is opt-in because it replaces a link-based view outright.
      // Turning one on without the matching server option would leave the
      // user waiting for a code that never arrives.
      views: {
        auth: {
          ...(plugin.signIn && { emailOtp: EmailOtp }),
          ...(plugin.emailVerification && { verifyEmail: VerifyEmailOtp }),
          ...(plugin.passwordReset && {
            forgotPassword: ForgotPasswordOtp,
            resetPassword: ResetPasswordOtp
          })
        }
      },
      // Conditional, not an override: when `emailAndPassword.enabled === false`
      // the `<Auth>` router renders this at `/auth/sign-in` instead of the
      // disabled password form.
      ...(plugin.signIn && {
        fallbackViews: { auth: { signIn: EmailOtp } }
      }),
      ...(plugin.changeEmail && {
        cardOverrides: { account: { changeEmail: ChangeEmailOtp } }
      })
    }
  }
)
