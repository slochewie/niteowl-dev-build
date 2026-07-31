import { defineClientPlugin, createRoute } from "@btst/stack/plugins/client";
import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { ComposedRoute } from "@btst/stack/client/components";
import { usePluginOverrides } from "@btst/stack/context";
import { D as Drawer$1 } from "./vaul.mjs";
import { r as re } from "./hcaptcha__react-hcaptcha.mjs";
import { R as RecaptchaWrapper } from "./react-google-recaptcha.mjs";
import { u } from "./hookform__resolvers.mjs";
import { F as FormProvider, C as Controller, u as useFormContext, a as useFormState, b as useForm } from "./react-hook-form.mjs";
import { R as Root3, T as Trigger$1, P as Portal, C as Content2$1, A as Arrow2, a as Provider } from "./radix-ui__react-tooltip.mjs";
import { B as Bowser } from "./bowser.mjs";
import { B as Building, U as UserRound, K as KeyRound, L as LoaderCircle, C as Check, a as Copy, b as ChevronDown, X, c as ChevronUp, E as Eye, d as EyeOff, M as Menu, e as CloudUpload, T as Trash2, f as Users, g as Ellipsis, S as Settings, h as LogOut, R as Repeat, i as UserRoundX, F as FingerprintPattern, j as Smartphone, k as Laptop, A as ArrowLeft, l as Lock, m as Mail, n as Send, Q as QrCode, o as Minus, p as SquarePen, q as Archive, r as UserCog, s as UserX } from "./lucide-react.mjs";
import { s as string, o as object, p as preprocess, n as number, a as number$1, b as boolean, u as unknown, c as boolean$1 } from "./zod.mjs";
import { R as Root$1 } from "./radix-ui__react-separator.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "./radix-ui__react-checkbox.mjs";
import { R as ReCaptchaProvider, u as useReCaptcha } from "./wojtekmaj__react-recaptcha-v3.mjs";
import { C as CaptchaFox } from "./captchafox__react.mjs";
import { S } from "./marsidev__react-turnstile.mjs";
import { Q as QRCode } from "./react-qr-code.mjs";
import { L as Lt, j as jt } from "./input-otp.mjs";
import { c as clsx } from "./clsx.mjs";
import { t as twMerge } from "./tailwind-merge.mjs";
import { t as toast } from "./sonner.mjs";
import { S as Slot } from "./radix-ui__react-slot.mjs";
import { c as cva } from "./class-variance-authority.mjs";
import { A as Avatar$1, a as AvatarImage$1, b as AvatarFallback$1 } from "./radix-ui__react-avatar.mjs";
import { b as bytesToHex, s as sha256 } from "./noble__hashes.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2 } from "./radix-ui__react-dropdown-menu.mjs";
import { R as Root } from "./radix-ui__react-label.mjs";
import { D as Dialog$1, a as DialogContent$1, b as DialogClose, c as DialogTitle$1, d as DialogDescription$1, e as DialogPortal$1, f as DialogOverlay$1 } from "./radix-ui__react-dialog.mjs";
import { S as Select$1, a as SelectTrigger$1, b as SelectIcon, c as SelectValue$1, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1 } from "./radix-ui__react-select.mjs";
var authViewPaths = {
  /** @default "callback" */
  CALLBACK: "callback",
  /** @default "email-otp" */
  EMAIL_OTP: "email-otp",
  /** @default "email-verification" */
  EMAIL_VERIFICATION: "email-verification",
  /** @default "forgot-password" */
  FORGOT_PASSWORD: "forgot-password",
  /** @default "magic-link" */
  MAGIC_LINK: "magic-link",
  /** @default "recover-account" */
  RECOVER_ACCOUNT: "recover-account",
  /** @default "reset-password" */
  RESET_PASSWORD: "reset-password",
  /** @default "sign-in" */
  SIGN_IN: "sign-in",
  /** @default "sign-out" */
  SIGN_OUT: "sign-out",
  /** @default "sign-up" */
  SIGN_UP: "sign-up",
  /** @default "two-factor" */
  TWO_FACTOR: "two-factor",
  /** @default "accept-invitation" */
  ACCEPT_INVITATION: "accept-invitation"
};
var accountViewPaths = {
  /** @default "settings" */
  SETTINGS: "settings",
  /** @default "security" */
  SECURITY: "security",
  /** @default "teams" */
  TEAMS: "teams",
  /** @default "api-keys" */
  API_KEYS: "api-keys",
  /** @default "organizations" */
  ORGANIZATIONS: "organizations"
};
var organizationViewPaths = {
  /** @default "settings" */
  SETTINGS: "settings",
  /** @default "members" */
  MEMBERS: "members",
  /** @default "teams" */
  TEAMS: "teams",
  /** @default "api-keys" */
  API_KEYS: "api-keys"
};
function definePlugin(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var accountClientPlugin = (config) => definePlugin({
  name: "account",
  routes: () => ({
    // Account views
    accountSettings: createRoute(
      `/account/${accountViewPaths.SETTINGS}`,
      () => {
        const AccountSettingsPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return accountSettingsPageTQ7GKK73;
          }).then((m) => ({
            default: m.AccountSettingsPage
          }))
        );
        return {
          PageComponent: AccountSettingsPage2,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.SETTINGS}`,
            "Account Settings",
            "Manage your account settings"
          )
        };
      }
    ),
    accountSecurity: createRoute(
      `/account/${accountViewPaths.SECURITY}`,
      () => {
        const AccountSecurityPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return accountSecurityPageVXPA2HTK;
          }).then((m) => ({
            default: m.AccountSecurityPage
          }))
        );
        return {
          PageComponent: AccountSecurityPage2,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.SECURITY}`,
            "Security",
            "Manage your security settings"
          )
        };
      }
    ),
    accountApiKeys: createRoute(
      `/account/${accountViewPaths.API_KEYS}`,
      () => {
        const AccountApiKeysPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return accountApiKeysPageML6QV7K4;
          }).then((m) => ({
            default: m.AccountApiKeysPage
          }))
        );
        return {
          PageComponent: AccountApiKeysPage2,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.API_KEYS}`,
            "API Keys",
            "Manage your API keys"
          )
        };
      }
    ),
    accountOrganizations: createRoute(
      `/account/${accountViewPaths.ORGANIZATIONS}`,
      () => {
        const AccountOrganizationsPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return accountOrganizationsPageLO4AWXYO;
          }).then((m) => ({
            default: m.AccountOrganizationsPage
          }))
        );
        return {
          PageComponent: AccountOrganizationsPage2,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.ORGANIZATIONS}`,
            "Organizations",
            "Manage your organizations"
          )
        };
      }
    ),
    accountTeams: createRoute(
      `/account/${accountViewPaths.TEAMS}`,
      () => {
        const AccountTeamsPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return accountTeamsPageYXHGA6DU;
          }).then((m) => ({
            default: m.AccountTeamsPage
          }))
        );
        return {
          PageComponent: AccountTeamsPage2,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.TEAMS}`,
            "Teams",
            "Manage your team memberships"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [];
  }
});
function definePlugin2(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta2(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var authClientPlugin = (config) => definePlugin2({
  name: "auth",
  routes: () => ({
    signIn: createRoute(`/auth/${authViewPaths.SIGN_IN}`, () => {
      const SignInPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return signInPage5LRHUH6V;
        }).then(
          (m) => ({
            default: m.SignInPage
          })
        )
      );
      return {
        PageComponent: SignInPage2,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.SIGN_IN}`,
          "Sign In",
          "Sign in to your account"
        )
      };
    }),
    signUp: createRoute(`/auth/${authViewPaths.SIGN_UP}`, () => {
      const SignUpPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return signUpPage5PRZNHPF;
        }).then(
          (m) => ({
            default: m.SignUpPage
          })
        )
      );
      return {
        PageComponent: SignUpPage2,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.SIGN_UP}`,
          "Sign Up",
          "Create a new account"
        )
      };
    }),
    forgotPassword: createRoute(
      `/auth/${authViewPaths.FORGOT_PASSWORD}`,
      () => {
        const ForgotPasswordPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return forgotPasswordPageQW45562I;
          }).then((m) => ({
            default: m.ForgotPasswordPage
          }))
        );
        return {
          PageComponent: ForgotPasswordPage2,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.FORGOT_PASSWORD}`,
            "Forgot Password",
            "Reset your password"
          )
        };
      }
    ),
    resetPassword: createRoute(
      `/auth/${authViewPaths.RESET_PASSWORD}`,
      () => {
        const ResetPasswordPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return resetPasswordPageLCLD4DOW;
          }).then((m) => ({
            default: m.ResetPasswordPage
          }))
        );
        return {
          PageComponent: ResetPasswordPage2,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.RESET_PASSWORD}`,
            "Reset Password",
            "Enter your new password"
          )
        };
      }
    ),
    magicLink: createRoute(`/auth/${authViewPaths.MAGIC_LINK}`, () => {
      const MagicLinkPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return magicLinkPage5AKSRKRN;
        }).then(
          (m) => ({
            default: m.MagicLinkPage
          })
        )
      );
      return {
        PageComponent: MagicLinkPage2,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.MAGIC_LINK}`,
          "Magic Link",
          "Sign in with magic link"
        )
      };
    }),
    emailOtp: createRoute(`/auth/${authViewPaths.EMAIL_OTP}`, () => {
      const EmailOtpPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return emailOtpPageC6PVS4I7;
        }).then(
          (m) => ({
            default: m.EmailOtpPage
          })
        )
      );
      return {
        PageComponent: EmailOtpPage2,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.EMAIL_OTP}`,
          "Email Code",
          "Sign in with email code"
        )
      };
    }),
    twoFactor: createRoute(`/auth/${authViewPaths.TWO_FACTOR}`, () => {
      const TwoFactorPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return twoFactorPageG7UY27TG;
        }).then(
          (m) => ({
            default: m.TwoFactorPage
          })
        )
      );
      return {
        PageComponent: TwoFactorPage2,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.TWO_FACTOR}`,
          "Two-Factor Authentication",
          "Enter your verification code"
        )
      };
    }),
    recoverAccount: createRoute(
      `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
      () => {
        const RecoverAccountPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return recoverAccountPageYTEGVO7U;
          }).then((m) => ({
            default: m.RecoverAccountPage
          }))
        );
        return {
          PageComponent: RecoverAccountPage2,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
            "Recover Account",
            "Recover your account with a backup code"
          )
        };
      }
    ),
    callback: createRoute(`/auth/${authViewPaths.CALLBACK}`, () => {
      const CallbackPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return callbackPageTF3J2VMN;
        }).then(
          (m) => ({
            default: m.CallbackPage
          })
        )
      );
      return {
        PageComponent: CallbackPage2
      };
    }),
    signOut: createRoute(`/auth/${authViewPaths.SIGN_OUT}`, () => {
      const SignOutPage2 = reactExports.lazy(
        () => Promise.resolve().then(function() {
          return signOutPageYWHTKNFE;
        }).then(
          (m) => ({
            default: m.SignOutPage
          })
        )
      );
      return {
        PageComponent: SignOutPage2
      };
    }),
    acceptInvitation: createRoute(
      `/auth/${authViewPaths.ACCEPT_INVITATION}`,
      () => {
        const AcceptInvitationPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return acceptInvitationPageGMSN3A3H;
          }).then((m) => ({
            default: m.AcceptInvitationPage
          }))
        );
        return {
          PageComponent: AcceptInvitationPage2
        };
      }
    ),
    emailVerification: createRoute(
      `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
      () => {
        const EmailVerificationPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return emailVerificationPageDSGCQ3FU;
          }).then((m) => ({
            default: m.EmailVerificationPage
          }))
        );
        return {
          PageComponent: EmailVerificationPage2,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
            "Email Verification",
            "Verify your email address"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.SIGN_IN}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.8
      },
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.SIGN_UP}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.8
      },
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.FORGOT_PASSWORD}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.5
      }
    ];
  }
});
function definePlugin3(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta3(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var organizationClientPlugin = (config) => definePlugin3({
  name: "organization",
  routes: () => ({
    organizationSettings: createRoute(
      `/organization/${organizationViewPaths.SETTINGS}`,
      () => {
        const OrganizationSettingsPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return organizationSettingsPageDOCNYJET;
          }).then((m) => ({
            default: m.OrganizationSettingsPage
          }))
        );
        return {
          PageComponent: OrganizationSettingsPage2,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.SETTINGS}`,
            "Organization Settings",
            "Manage your organization settings"
          )
        };
      }
    ),
    organizationMembers: createRoute(
      `/organization/${organizationViewPaths.MEMBERS}`,
      () => {
        const OrganizationMembersPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return organizationMembersPage2ZYAVV45;
          }).then((m) => ({
            default: m.OrganizationMembersPage
          }))
        );
        return {
          PageComponent: OrganizationMembersPage2,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.MEMBERS}`,
            "Organization Members",
            "Manage organization members"
          )
        };
      }
    ),
    organizationApiKeys: createRoute(
      `/organization/${organizationViewPaths.API_KEYS}`,
      () => {
        const OrganizationApiKeysPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return organizationApiKeysPage4MEQXR25;
          }).then((m) => ({
            default: m.OrganizationApiKeysPage
          }))
        );
        return {
          PageComponent: OrganizationApiKeysPage2,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.API_KEYS}`,
            "Organization API Keys",
            "Manage organization API keys"
          )
        };
      }
    ),
    organizationTeams: createRoute(
      `/organization/${organizationViewPaths.TEAMS}`,
      () => {
        const OrganizationTeamsPage2 = reactExports.lazy(
          () => Promise.resolve().then(function() {
            return organizationTeamsPageB3PZGE5L;
          }).then((m) => ({
            default: m.OrganizationTeamsPage
          }))
        );
        return {
          PageComponent: OrganizationTeamsPage2,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.TEAMS}`,
            "Organization Teams",
            "Manage organization teams"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [];
  }
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function getLocalizedError({
  error,
  localization,
  localizeErrors = true
}) {
  var _a;
  const DEFAULT_ERROR_MESSAGE = "Request failed";
  if (!localizeErrors) {
    if (error == null ? void 0 : error.message) return error.message;
    if ((_a = error == null ? void 0 : error.error) == null ? void 0 : _a.message) return error.error.message;
    return DEFAULT_ERROR_MESSAGE;
  }
  if (typeof error === "string") {
    if (localization == null ? void 0 : localization[error])
      return localization[error];
  }
  if (error == null ? void 0 : error.error) {
    if (error.error.code) {
      const errorCode = error.error.code;
      if (localization == null ? void 0 : localization[errorCode]) return localization[errorCode];
    }
    return error.error.message || error.error.code || error.error.statusText || (localization == null ? void 0 : localization.REQUEST_FAILED);
  }
  return (error == null ? void 0 : error.message) || (localization == null ? void 0 : localization.REQUEST_FAILED) || DEFAULT_ERROR_MESSAGE;
}
function getSearchParam(paramName) {
  return typeof window !== "undefined" ? new URLSearchParams(window.location.search).get(paramName) : null;
}
function getViewByPath(viewPaths, path) {
  for (const key in viewPaths) {
    if (viewPaths[key] === path) {
      return key;
    }
  }
}
function getPasswordSchema(passwordValidation, localization) {
  let schema = string().min(1, {
    message: localization == null ? void 0 : localization.PASSWORD_REQUIRED
  });
  if (passwordValidation == null ? void 0 : passwordValidation.minLength) {
    schema = schema.min(passwordValidation.minLength, {
      message: localization == null ? void 0 : localization.PASSWORD_TOO_SHORT
    });
  }
  if (passwordValidation == null ? void 0 : passwordValidation.maxLength) {
    schema = schema.max(passwordValidation.maxLength, {
      message: localization == null ? void 0 : localization.PASSWORD_TOO_LONG
    });
  }
  if (passwordValidation == null ? void 0 : passwordValidation.regex) {
    schema = schema.regex(passwordValidation.regex, {
      message: localization == null ? void 0 : localization.INVALID_PASSWORD
    });
  }
  return schema;
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function DefaultError({ error, reset }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Something went wrong!" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: error.message || "An unexpected error occurred" }),
      error.digest && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs", children: [
        "Error ID: ",
        error.digest
      ] }),
      reset && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: reset, className: "w-full", children: "Try again" })
    ] })
  ] }) });
}
function NotFoundPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "404 - Page Not Found" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "The page you're looking for doesn't exist." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => {
            window.location.href = "/";
          },
          className: "w-full",
          children: "Go Home"
        }
      )
    ] })
  ] }) });
}
function PageLoading() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
    ] })
  ] }) });
}
var AccountSettingsPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return accountSettingsPage_internalJCXCAIIM;
  }).then((m) => ({
    default: m.AccountSettingsPageInternal
  }))
);
function AccountSettingsPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.SETTINGS}`,
      PageComponent: AccountSettingsPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountSettings", error, {
            path: `/account/${accountViewPaths.SETTINGS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const accountSettingsPageTQ7GKK73 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountSettingsPage
});
var AccountSecurityPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return accountSecurityPage_internalOLX2SDWX;
  }).then((m) => ({
    default: m.AccountSecurityPageInternal
  }))
);
function AccountSecurityPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.SECURITY}`,
      PageComponent: AccountSecurityPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountSecurity", error, {
            path: `/account/${accountViewPaths.SECURITY}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const accountSecurityPageVXPA2HTK = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountSecurityPage
});
var AccountApiKeysPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return accountApiKeysPage_internalYQO3GVRR;
  }).then((m) => ({
    default: m.AccountApiKeysPageInternal
  }))
);
function AccountApiKeysPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.API_KEYS}`,
      PageComponent: AccountApiKeysPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountApiKeys", error, {
            path: `/account/${accountViewPaths.API_KEYS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const accountApiKeysPageML6QV7K4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountApiKeysPage
});
var AccountOrganizationsPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return accountOrganizationsPage_internalFMIBVMJQ;
  }).then((m) => ({
    default: m.AccountOrganizationsPageInternal
  }))
);
function AccountOrganizationsPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.ORGANIZATIONS}`,
      PageComponent: AccountOrganizationsPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountOrganizations", error, {
            path: `/account/${accountViewPaths.ORGANIZATIONS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const accountOrganizationsPageLO4AWXYO = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountOrganizationsPage
});
var AccountTeamsPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return accountTeamsPage_internalJE7SQLVP;
  }).then((m) => ({
    default: m.AccountTeamsPageInternal
  }))
);
function AccountTeamsPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.TEAMS}`,
      PageComponent: AccountTeamsPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountTeams", error, {
            path: `/account/${accountViewPaths.TEAMS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const accountTeamsPageYXHGA6DU = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountTeamsPage
});
var SignInPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return signInPage_internalHHDVE5SC;
  }).then((m) => ({
    default: m.SignInPageInternal
  }))
);
function SignInPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.SIGN_IN}`,
      PageComponent: SignInPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("signIn", error, {
            path: `/auth/${authViewPaths.SIGN_IN}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const signInPage5LRHUH6V = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignInPage
});
var SignUpPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return signUpPage_internalRSSBE43R;
  }).then((m) => ({
    default: m.SignUpPageInternal
  }))
);
function SignUpPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.SIGN_UP}`,
      PageComponent: SignUpPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("signUp", error, {
            path: `/auth/${authViewPaths.SIGN_UP}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const signUpPage5PRZNHPF = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignUpPage
});
var ForgotPasswordPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return forgotPasswordPage_internalETDVCAUC;
  }).then((m) => ({
    default: m.ForgotPasswordPageInternal
  }))
);
function ForgotPasswordPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.FORGOT_PASSWORD}`,
      PageComponent: ForgotPasswordPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("forgotPassword", error, {
            path: `/auth/${authViewPaths.FORGOT_PASSWORD}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const forgotPasswordPageQW45562I = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ForgotPasswordPage
});
var ResetPasswordPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return resetPasswordPage_internalGOVT5BCU;
  }).then((m) => ({
    default: m.ResetPasswordPageInternal
  }))
);
function ResetPasswordPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.RESET_PASSWORD}`,
      PageComponent: ResetPasswordPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("resetPassword", error, {
            path: `/auth/${authViewPaths.RESET_PASSWORD}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const resetPasswordPageLCLD4DOW = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ResetPasswordPage
});
var MagicLinkPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return magicLinkPage_internalCIV4B5FS;
  }).then((m) => ({
    default: m.MagicLinkPageInternal
  }))
);
function MagicLinkPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.MAGIC_LINK}`,
      PageComponent: MagicLinkPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("magicLink", error, {
            path: `/auth/${authViewPaths.MAGIC_LINK}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const magicLinkPage5AKSRKRN = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  MagicLinkPage
});
var EmailOtpPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return emailOtpPage_internalFPZRJQUL;
  }).then((m) => ({
    default: m.EmailOtpPageInternal
  }))
);
function EmailOtpPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.EMAIL_OTP}`,
      PageComponent: EmailOtpPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("emailOtp", error, {
            path: `/auth/${authViewPaths.EMAIL_OTP}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const emailOtpPageC6PVS4I7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  EmailOtpPage
});
var TwoFactorPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return twoFactorPage_internalSEG5Q42X;
  }).then((m) => ({
    default: m.TwoFactorPageInternal
  }))
);
function TwoFactorPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.TWO_FACTOR}`,
      PageComponent: TwoFactorPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("twoFactor", error, {
            path: `/auth/${authViewPaths.TWO_FACTOR}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const twoFactorPageG7UY27TG = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  TwoFactorPage
});
var RecoverAccountPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return recoverAccountPage_internalSZ6YMTCT;
  }).then((m) => ({
    default: m.RecoverAccountPageInternal
  }))
);
function RecoverAccountPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
      PageComponent: RecoverAccountPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("recoverAccount", error, {
            path: `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const recoverAccountPageYTEGVO7U = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  RecoverAccountPage
});
var CallbackPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return callbackPage_internalI5U7VSTZ;
  }).then((m) => ({
    default: m.CallbackPageInternal
  }))
);
function CallbackPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.CALLBACK}`,
      PageComponent: CallbackPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("callback", error, {
            path: `/auth/${authViewPaths.CALLBACK}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const callbackPageTF3J2VMN = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CallbackPage
});
var SignOutPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return signOutPage_internal4E5FNQKY;
  }).then((m) => ({
    default: m.SignOutPageInternal
  }))
);
function SignOutPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.SIGN_OUT}`,
      PageComponent: SignOutPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("signOut", error, {
            path: `/auth/${authViewPaths.SIGN_OUT}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const signOutPageYWHTKNFE = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignOutPage
});
var AcceptInvitationPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return acceptInvitationPage_internal5RS4QNQO;
  }).then((m) => ({
    default: m.AcceptInvitationPageInternal
  }))
);
function AcceptInvitationPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.ACCEPT_INVITATION}`,
      PageComponent: AcceptInvitationPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("acceptInvitation", error, {
            path: `/auth/${authViewPaths.ACCEPT_INVITATION}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const acceptInvitationPageGMSN3A3H = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AcceptInvitationPage
});
var EmailVerificationPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return emailVerificationPage_internalE7EMM4LT;
  }).then((m) => ({
    default: m.EmailVerificationPageInternal
  }))
);
function EmailVerificationPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
      PageComponent: EmailVerificationPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("emailVerification", error, {
            path: `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const emailVerificationPageDSGCQ3FU = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  EmailVerificationPage
});
var OrganizationSettingsPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return organizationSettingsPage_internalXJOITES4;
  }).then((m) => ({
    default: m.OrganizationSettingsPageInternal
  }))
);
function OrganizationSettingsPage() {
  const { onRouteError } = usePluginOverrides("organization");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/organization/${organizationViewPaths.SETTINGS}`,
      PageComponent: OrganizationSettingsPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("organizationSettings", error, {
            path: `/organization/${organizationViewPaths.SETTINGS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const organizationSettingsPageDOCNYJET = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationSettingsPage
});
var OrganizationMembersPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return organizationMembersPage_internalQ3Y3KR6W;
  }).then((m) => ({
    default: m.OrganizationMembersPageInternal
  }))
);
function OrganizationMembersPage() {
  const { onRouteError } = usePluginOverrides("organization");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/organization/${organizationViewPaths.MEMBERS}`,
      PageComponent: OrganizationMembersPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("organizationMembers", error, {
            path: `/organization/${organizationViewPaths.MEMBERS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const organizationMembersPage2ZYAVV45 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationMembersPage
});
var OrganizationApiKeysPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return organizationApiKeysPage_internalA7TOBTOI;
  }).then((m) => ({
    default: m.OrganizationApiKeysPageInternal
  }))
);
function OrganizationApiKeysPage() {
  const { onRouteError } = usePluginOverrides("organization");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/organization/${organizationViewPaths.API_KEYS}`,
      PageComponent: OrganizationApiKeysPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("organizationApiKeys", error, {
            path: `/organization/${organizationViewPaths.API_KEYS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const organizationApiKeysPage4MEQXR25 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationApiKeysPage
});
var OrganizationTeamsPageInternal$1 = reactExports.lazy(
  () => Promise.resolve().then(function() {
    return organizationTeamsPage_internalAZY6L43Z;
  }).then((m) => ({
    default: m.OrganizationTeamsPageInternal
  }))
);
function OrganizationTeamsPage() {
  const { onRouteError } = usePluginOverrides("organization");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ComposedRoute,
    {
      path: `/organization/${organizationViewPaths.TEAMS}`,
      PageComponent: OrganizationTeamsPageInternal$1,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("organizationTeams", error, {
            path: `/organization/${organizationViewPaths.TEAMS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const organizationTeamsPageB3PZGE5L = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationTeamsPage
});
var ADMIN_ERROR_CODES = {
  FAILED_TO_CREATE_USER: "Failed to create user",
  USER_ALREADY_EXISTS: "User already exists",
  YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself",
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users",
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users",
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions",
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users",
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users",
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users",
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password",
  BANNED_USER: "You have been banned from this application"
};
var ANONYMOUS_ERROR_CODES = {
  FAILED_TO_CREATE_USER: "Failed to create user",
  COULD_NOT_CREATE_SESSION: "Could not create session",
  ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: "Anonymous users cannot sign in again anonymously"
};
var API_KEY_ERROR_CODES = {
  INVALID_METADATA_TYPE: "metadata must be an object or undefined",
  REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
  REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
  USER_BANNED: "User is banned",
  UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
  KEY_NOT_FOUND: "API Key not found",
  KEY_DISABLED: "API Key is disabled",
  KEY_EXPIRED: "API Key has expired",
  USAGE_EXCEEDED: "API Key has reached its usage limit",
  KEY_NOT_RECOVERABLE: "API Key is not recoverable",
  EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
  EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
  INVALID_REMAINING: "The remaining count is either too large or too small.",
  INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
  INVALID_NAME_LENGTH: "The name length is either too large or too small.",
  METADATA_DISABLED: "Metadata is disabled.",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
  NO_VALUES_TO_UPDATE: "No values to update.",
  KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
  INVALID_API_KEY: "Invalid API key.",
  INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
  INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
  SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only."
};
var BASE_ERROR_CODES = {
  USER_NOT_FOUND: "User not found",
  FAILED_TO_CREATE_USER: "Failed to create user",
  FAILED_TO_CREATE_SESSION: "Failed to create session",
  FAILED_TO_UPDATE_USER: "Failed to update user",
  FAILED_TO_GET_SESSION: "Failed to get session",
  INVALID_PASSWORD: "Invalid password",
  INVALID_EMAIL: "Invalid email",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
  PROVIDER_NOT_FOUND: "Provider not found",
  INVALID_TOKEN: "Invalid token",
  ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
  FAILED_TO_GET_USER_INFO: "Failed to get user info",
  USER_EMAIL_NOT_FOUND: "User email not found",
  EMAIL_NOT_VERIFIED: "Email not verified",
  PASSWORD_TOO_SHORT: "Password too short",
  PASSWORD_TOO_LONG: "Password too long",
  USER_ALREADY_EXISTS: "User already exists",
  EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
  SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: "Account not found",
  USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account."
};
var EXTERNAL_ERROR_CODES = {
  VERIFICATION_FAILED: "Captcha verification failed",
  MISSING_RESPONSE: "Missing CAPTCHA response",
  UNKNOWN_ERROR: "Something went wrong"
};
var INTERNAL_ERROR_CODES = {
  MISSING_SECRET_KEY: "Missing secret key",
  SERVICE_UNAVAILABLE: "CAPTCHA service unavailable"
};
var CAPTCHA_ERROR_CODES = {
  ...EXTERNAL_ERROR_CODES,
  ...INTERNAL_ERROR_CODES
};
var EMAIL_OTP_ERROR_CODES = {
  OTP_EXPIRED: "otp expired",
  INVALID_OTP: "Invalid OTP",
  INVALID_EMAIL: "Invalid email",
  USER_NOT_FOUND: "User not found",
  TOO_MANY_ATTEMPTS: "Too many attempts"
};
var GENERIC_OAUTH_ERROR_CODES = {
  INVALID_OAUTH_CONFIGURATION: "Invalid OAuth configuration"
};
var HAVEIBEENPWNED_ERROR_CODES = {
  PASSWORD_COMPROMISED: "The password you entered has been compromised. Please choose a different password."
};
var MULTI_SESSION_ERROR_CODES = {
  INVALID_SESSION_TOKEN: "Invalid session token"
};
var ORGANIZATION_ERROR_CODES = {
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
  ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
  ORGANIZATION_NOT_FOUND: "Organization not found",
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
  NO_ACTIVE_ORGANIZATION: "No active organization",
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
  MEMBER_NOT_FOUND: "Member not found",
  ROLE_NOT_FOUND: "Role not found",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
  TEAM_ALREADY_EXISTS: "Team already exists",
  TEAM_NOT_FOUND: "Team not found",
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
  INVITATION_NOT_FOUND: "Invitation not found",
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "you are not allowed to invite user with this role",
  FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
  UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
  ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
  INVITATION_LIMIT_REACHED: "Invitation limit reached"
};
var PASSKEY_ERROR_CODES = {
  CHALLENGE_NOT_FOUND: "Challenge not found",
  YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey",
  FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration",
  PASSKEY_NOT_FOUND: "Passkey not found",
  AUTHENTICATION_FAILED: "Authentication failed",
  UNABLE_TO_CREATE_SESSION: "Unable to create session",
  FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey"
};
var PHONE_NUMBER_ERROR_CODES = {
  INVALID_PHONE_NUMBER: "Invalid phone number",
  PHONE_NUMBER_EXIST: "Phone number already exists",
  INVALID_PHONE_NUMBER_OR_PASSWORD: "Invalid phone number or password",
  UNEXPECTED_ERROR: "Unexpected error",
  OTP_NOT_FOUND: "OTP not found",
  OTP_EXPIRED: "OTP expired",
  INVALID_OTP: "Invalid OTP",
  PHONE_NUMBER_NOT_VERIFIED: "Phone number not verified"
};
var STRIPE_ERROR_CODES = {
  SUBSCRIPTION_NOT_FOUND: "Subscription not found",
  SUBSCRIPTION_PLAN_NOT_FOUND: "Subscription plan not found",
  ALREADY_SUBSCRIBED_PLAN: "You're already subscribed to this plan",
  UNABLE_TO_CREATE_CUSTOMER: "Unable to create customer",
  FAILED_TO_FETCH_PLANS: "Failed to fetch plans",
  EMAIL_VERIFICATION_REQUIRED: "Email verification is required before you can subscribe to a plan",
  SUBSCRIPTION_NOT_ACTIVE: "Subscription is not active",
  SUBSCRIPTION_NOT_SCHEDULED_FOR_CANCELLATION: "Subscription is not scheduled for cancellation"
};
var TEAM_ERROR_CODES = {
  TEAM_LIMIT_REACHED: "Team limit reached for this organization",
  TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached for this team",
  TEAM_NOT_FOUND: "Team not found",
  TEAM_MEMBER_NOT_FOUND: "Team member not found",
  TEAM_NAME_TOO_LONG: "Team name is too long",
  CANNOT_REMOVE_LAST_TEAM: "Cannot remove the last team",
  NOT_ORGANIZATION_MEMBER: "User is not a member of the organization",
  ALREADY_TEAM_MEMBER: "User is already a member of this team",
  INSUFFICIENT_TEAM_PERMISSIONS: "Insufficient permissions to perform this action on team"
};
var TWO_FACTOR_ERROR_CODES = {
  OTP_NOT_ENABLED: "OTP not enabled",
  OTP_HAS_EXPIRED: "OTP has expired",
  TOTP_NOT_ENABLED: "TOTP not enabled",
  TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled",
  BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled",
  INVALID_BACKUP_CODE: "Invalid backup code",
  INVALID_CODE: "Invalid code",
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.",
  INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie"
};
var USERNAME_ERROR_CODES = {
  INVALID_USERNAME_OR_PASSWORD: "invalid username or password",
  EMAIL_NOT_VERIFIED: "email not verified",
  UNEXPECTED_ERROR: "unexpected error",
  USERNAME_IS_ALREADY_TAKEN: "username is already taken. please try another.",
  USERNAME_TOO_SHORT: "username is too short",
  USERNAME_TOO_LONG: "username is too long",
  INVALID_USERNAME: "username is invalid"
};
var authLocalization = {
  /** @default "App" */
  APP: "App",
  /** @default "Account" */
  ACCOUNT: "Account",
  /** @default "Accounts" */
  ACCOUNTS: "Accounts",
  /** @default "Manage your currently signed in accounts." */
  ACCOUNTS_DESCRIPTION: "Switch between your currently signed in accounts.",
  /** @default "Sign in to an additional account." */
  ACCOUNTS_INSTRUCTIONS: "Sign in to an additional account.",
  /** @default "Add Account" */
  ADD_ACCOUNT: "Add Account",
  /** @default "Add Passkey" */
  ADD_PASSKEY: "Add Passkey",
  /** @default "Already have an account?" */
  ALREADY_HAVE_AN_ACCOUNT: "Already have an account?",
  /** @default "Avatar" */
  AVATAR: "Avatar",
  /** @default "Click on the avatar to upload a custom one from your files." */
  AVATAR_DESCRIPTION: "Click on the avatar to upload a custom one from your files.",
  /** @default "An avatar is optional but strongly recommended." */
  AVATAR_INSTRUCTIONS: "An avatar is optional but strongly recommended.",
  /** @default "Backup code is required" */
  BACKUP_CODE_REQUIRED: "Backup code is required",
  /** @default "Backup Codes" */
  BACKUP_CODES: "Backup Codes",
  /** @default "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method." */
  BACKUP_CODES_DESCRIPTION: "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method.",
  /** @default "Backup Code." */
  BACKUP_CODE_PLACEHOLDER: "Backup Code",
  /** @default "Backup Code" */
  BACKUP_CODE: "Backup Code",
  /** @default "Cancel" */
  CANCEL: "Cancel",
  /** @default "Change Password" */
  CHANGE_PASSWORD: "Change Password",
  /** @default "Enter your current password and a new password." */
  CHANGE_PASSWORD_DESCRIPTION: "Enter your current password and a new password.",
  /** @default "Please use 8 characters at minimum." */
  CHANGE_PASSWORD_INSTRUCTIONS: "Please use 8 characters at minimum.",
  /** @default "Your password has been changed." */
  CHANGE_PASSWORD_SUCCESS: "Your password has been changed.",
  /** @default "Confirm Password" */
  CONFIRM_PASSWORD: "Confirm Password",
  /** @default "Confirm Password" */
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",
  /** @default "Confirm password is required" */
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  /** @default "Continue with Authenticator" */
  CONTINUE_WITH_AUTHENTICATOR: "Continue with Authenticator",
  /** @default "Copied to clipboard" */
  COPIED_TO_CLIPBOARD: "Copied to clipboard",
  /** @default "Copy to clipboard" */
  COPY_TO_CLIPBOARD: "Copy to clipboard",
  /** @default "Copy all codes" */
  COPY_ALL_CODES: "Copy all codes",
  /** @default "Continue" */
  CONTINUE: "Continue",
  /** @default "Current Password" */
  CURRENT_PASSWORD: "Current Password",
  /** @default "Current Password" */
  CURRENT_PASSWORD_PLACEHOLDER: "Current Password",
  /** @default "Current Session" */
  CURRENT_SESSION: "Current Session",
  /** @default "Update" */
  UPDATE: "Update",
  /** @default "Delete" */
  DELETE: "Delete",
  /** @default "Delete Avatar" */
  DELETE_AVATAR: "Delete Avatar",
  /** @default "Delete Account" */
  DELETE_ACCOUNT: "Delete Account",
  /** @default "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution." */
  DELETE_ACCOUNT_DESCRIPTION: "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution.",
  /** @default "Please confirm the deletion of your account. This action is not reversible, so please continue with caution." */
  DELETE_ACCOUNT_INSTRUCTIONS: "Please confirm the deletion of your account. This action is not reversible, so please continue with caution.",
  /** @default "Please check your email to verify the deletion of your account." */
  DELETE_ACCOUNT_VERIFY: "Please check your email to verify the deletion of your account.",
  /** @default "Your account has been deleted." */
  DELETE_ACCOUNT_SUCCESS: "Your account has been deleted.",
  /** @default "Disable Two-Factor" */
  DISABLE_TWO_FACTOR: "Disable Two-Factor",
  /** @default "Choose a provider to login to your account" */
  DISABLED_CREDENTIALS_DESCRIPTION: "Choose a provider to login to your account",
  /** @default "Don't have an account?" */
  DONT_HAVE_AN_ACCOUNT: "Don't have an account?",
  /** @default "Done" */
  DONE: "Done",
  /** @default "Email" */
  EMAIL: "Email",
  /** @default "Enter the email address you want to use to log in." */
  EMAIL_DESCRIPTION: "Enter the email address you want to use to log in.",
  /** @default "Please enter a valid email address." */
  EMAIL_INSTRUCTIONS: "Please enter a valid email address.",
  /** @default "Email is the same" */
  EMAIL_IS_THE_SAME: "Email is the same",
  /** @default "m@example.com" */
  EMAIL_PLACEHOLDER: "m@example.com",
  /** @default "Email address is required" */
  EMAIL_REQUIRED: "Email address is required",
  /** @default "Please check your email to verify the change." */
  EMAIL_VERIFY_CHANGE: "Please check your email to verify the change.",
  /** @default "Email Verification" */
  EMAIL_VERIFICATION: "Email Verification",
  /** @default "Please check your email for the verification code to complete your registration." */
  EMAIL_VERIFICATION_DESCRIPTION: "Please check your email for the verification code to complete your registration.",
  /** @default "Email verification successful." */
  EMAIL_VERIFICATION_SUCCESS: "Email verification successful.",
  /** @default "Enable Two-Factor" */
  ENABLE_TWO_FACTOR: "Enable Two-Factor",
  /** @default "is invalid" */
  IS_INVALID: "is invalid",
  /** @default "is required" */
  IS_REQUIRED: "is required",
  /** @default "is the same" */
  IS_THE_SAME: "is the same",
  /** @default "Forgot authenticator?" */
  FORGOT_AUTHENTICATOR: "Forgot authenticator?",
  /** @default "Forgot Password" */
  FORGOT_PASSWORD: "Forgot Password",
  /** @default "Send reset link" */
  FORGOT_PASSWORD_ACTION: "Send reset link",
  /** @default "Enter your email to reset your password" */
  FORGOT_PASSWORD_DESCRIPTION: "Enter your email to reset your password",
  /** @default "Check your email for the password reset link." */
  FORGOT_PASSWORD_EMAIL: "Check your email for the password reset link.",
  /** @default "Forgot your password?" */
  FORGOT_PASSWORD_LINK: "Forgot your password?",
  /** @default "Link" */
  LINK: "Link",
  /** @default "Magic Link" */
  MAGIC_LINK: "Magic Link",
  /** @default "Send magic link" */
  MAGIC_LINK_ACTION: "Send magic link",
  /** @default "Enter your email to receive a magic link" */
  MAGIC_LINK_DESCRIPTION: "Enter your email to receive a magic link",
  /** @default "Check your email for the magic link" */
  MAGIC_LINK_EMAIL: "Check your email for the magic link",
  /** @default "Email Code" */
  EMAIL_OTP: "Email Code",
  /** @default "Send code" */
  EMAIL_OTP_SEND_ACTION: "Send code",
  /** @default "Verify code" */
  EMAIL_OTP_VERIFY_ACTION: "Verify code",
  /** @default "Enter your email to receive a code" */
  EMAIL_OTP_DESCRIPTION: "Enter your email to receive a code",
  /** @default "Please check your email for the verification code." */
  EMAIL_OTP_VERIFICATION_SENT: "Please check your email for the verification code.",
  /** @default "Name" */
  NAME: "Name",
  /** @default "Please enter your full name, or a display name." */
  NAME_DESCRIPTION: "Please enter your full name, or a display name.",
  /** @default "Please use 32 characters at maximum." */
  NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Name" */
  NAME_PLACEHOLDER: "Name",
  /** @default "New Password" */
  NEW_PASSWORD: "New Password",
  /** @default "New Password" */
  NEW_PASSWORD_PLACEHOLDER: "New Password",
  /** @default "New password is required" */
  NEW_PASSWORD_REQUIRED: "New password is required",
  /** @default "One-Time Password" */
  ONE_TIME_PASSWORD: "One-Time Password",
  /** @default "Or continue with" */
  OR_CONTINUE_WITH: "Or continue with",
  /** @default "Passkey" */
  PASSKEY: "Passkey",
  /** @default "Passkeys" */
  PASSKEYS: "Passkeys",
  /** @default "Manage your passkeys for secure access." */
  PASSKEYS_DESCRIPTION: "Manage your passkeys for secure access.",
  /** @default "Securely access your account without a password." */
  PASSKEYS_INSTRUCTIONS: "Securely access your account without a password.",
  /** @default "Personal Account" */
  PERSONAL_ACCOUNT: "Personal Account",
  /** @default "API Keys" */
  API_KEYS: "API Keys",
  /** @default "Manage your API keys for secure access." */
  API_KEYS_DESCRIPTION: "Manage your API keys for secure access.",
  /** @default "Generate API keys to access your account programmatically." */
  API_KEYS_INSTRUCTIONS: "Generate API keys to access your account programmatically.",
  /** @default "Create API Key" */
  CREATE_API_KEY: "Create API Key",
  /** @default "Enter a unique name for your API key to differentiate it from other keys." */
  CREATE_API_KEY_DESCRIPTION: "Enter a unique name for your API key to differentiate it from other keys.",
  /** @default "New API Key" */
  API_KEY_NAME_PLACEHOLDER: "New API Key",
  /** @default "API Key Created" */
  API_KEY_CREATED: "API Key Created",
  /** @default "Please copy your API key and store it in a safe place. For security reasons we cannot show it again." */
  CREATE_API_KEY_SUCCESS: "Please copy your API key and store it in a safe place. For security reasons we cannot show it again.",
  /** @default "Never Expires" */
  NEVER_EXPIRES: "Never Expires",
  /** @default "Expires" */
  EXPIRES: "Expires",
  /** @default "No Expiration" */
  NO_EXPIRATION: "No Expiration",
  /** @default "Create Organization" */
  CREATE_ORGANIZATION: "Create Organization",
  /** @default "Organization" */
  ORGANIZATION: "Organization",
  /** @default "Name" */
  ORGANIZATION_NAME: "Name",
  /** @default "Acme Inc." */
  ORGANIZATION_NAME_PLACEHOLDER: "Acme Inc.",
  /** @default "This is your organization's visible name." */
  ORGANIZATION_NAME_DESCRIPTION: "This is your organization's visible name.",
  /** @default "Please use 32 characters at maximum." */
  ORGANIZATION_NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Slug URL" */
  ORGANIZATION_SLUG: "Slug URL",
  /** @default "This is your organization's URL namespace." */
  ORGANIZATION_SLUG_DESCRIPTION: "This is your organization's URL namespace.",
  /** @default "Please use 48 characters at maximum." */
  ORGANIZATION_SLUG_INSTRUCTIONS: "Please use 48 characters at maximum.",
  /** @default "acme-inc" */
  ORGANIZATION_SLUG_PLACEHOLDER: "acme-inc",
  /** @default "Organization created successfully" */
  CREATE_ORGANIZATION_SUCCESS: "Organization created successfully",
  /** @default "Password" */
  PASSWORD: "Password",
  /** @default "Password" */
  PASSWORD_PLACEHOLDER: "Password",
  /** @default "Password is required" */
  PASSWORD_REQUIRED: "Password is required",
  /** @default "Passwords do not match" */
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  /** @default "Providers" */
  PROVIDERS: "Providers",
  /** @default "Connect your account with a third-party service." */
  PROVIDERS_DESCRIPTION: "Connect your account with a third-party service.",
  /** @default "Recover Account" */
  RECOVER_ACCOUNT: "Recover Account",
  /** @default "Recover account" */
  RECOVER_ACCOUNT_ACTION: "Recover account",
  /** @default "Please enter a backup code to access your account" */
  RECOVER_ACCOUNT_DESCRIPTION: "Please enter a backup code to access your account",
  /** @default "Remember me" */
  REMEMBER_ME: "Remember me",
  /** @default "Resend code" */
  RESEND_CODE: "Resend code",
  /** @default "Resend verification email" */
  RESEND_VERIFICATION_EMAIL: "Resend Verification Email",
  /** @default "Reset Password" */
  RESET_PASSWORD: "Reset Password",
  /** @default "Save new password" */
  RESET_PASSWORD_ACTION: "Save new password",
  /** @default "Enter your new password below" */
  RESET_PASSWORD_DESCRIPTION: "Enter your new password below",
  /** @default "Password reset successfully" */
  RESET_PASSWORD_SUCCESS: "Password reset successfully",
  /** @default "Request failed" */
  REQUEST_FAILED: "Request failed",
  /** @default "Revoke" */
  REVOKE: "Revoke",
  /** @default "Delete API Key" */
  DELETE_API_KEY: "Delete API Key",
  /** @default "Are you sure you want to delete this API key?" */
  DELETE_API_KEY_CONFIRM: "Are you sure you want to delete this API key?",
  /** @default "API Key" */
  API_KEY: "API Key",
  /** @default "Sign In" */
  SIGN_IN: "Sign In",
  /** @default "Login" */
  SIGN_IN_ACTION: "Login",
  /** @default "Enter your email below to login to your account" */
  SIGN_IN_DESCRIPTION: "Enter your email below to login to your account",
  /** @default "Enter your username or email below to login to your account" */
  SIGN_IN_USERNAME_DESCRIPTION: "Enter your username or email to login to your account",
  /** @default "Sign in with" */
  SIGN_IN_WITH: "Sign in with",
  /** @default "Sign Out" */
  SIGN_OUT: "Sign Out",
  /** @default "Sign Up" */
  SIGN_UP: "Sign Up",
  /** @default "Create an account" */
  SIGN_UP_ACTION: "Create an account",
  /** @default "Enter your information to create an account" */
  SIGN_UP_DESCRIPTION: "Enter your information to create an account",
  /** @default "Check your email for the verification link." */
  SIGN_UP_EMAIL: "Check your email for the verification link.",
  /** @default "Sessions" */
  SESSIONS: "Sessions",
  /** @default "Manage your active sessions and revoke access." */
  SESSIONS_DESCRIPTION: "Manage your active sessions and revoke access.",
  /** @default "Set Password" */
  SET_PASSWORD: "Set Password",
  /** @default "Click the button below to receive an email to set up a password for your account." */
  SET_PASSWORD_DESCRIPTION: "Click the button below to receive an email to set up a password for your account.",
  /** @default "Settings" */
  SETTINGS: "Settings",
  /** @default "Save" */
  SAVE: "Save",
  /** @default "Security" */
  SECURITY: "Security",
  /** @default "Switch Account" */
  SWITCH_ACCOUNT: "Switch Account",
  /** @default "Trust this device" */
  TRUST_DEVICE: "Trust this device",
  /** @default "Two-Factor" */
  TWO_FACTOR: "Two-Factor",
  /** @default "Verify code" */
  TWO_FACTOR_ACTION: "Verify code",
  /** @default "Please enter your one-time password to continue" */
  TWO_FACTOR_DESCRIPTION: "Please enter your one-time password to continue",
  /** @default "Add an extra layer of security to your account." */
  TWO_FACTOR_CARD_DESCRIPTION: "Add an extra layer of security to your account.",
  /** @default "Please enter your password to disable 2FA." */
  TWO_FACTOR_DISABLE_INSTRUCTIONS: "Please enter your password to disable 2FA.",
  /** @default "Please enter your password to enable 2FA" */
  TWO_FACTOR_ENABLE_INSTRUCTIONS: "Please enter your password to enable 2FA.",
  /** @default "Two-factor authentication has been enabled" */
  TWO_FACTOR_ENABLED: "Two-factor authentication has been enabled",
  /** @default "Two-Factor Authentication has been disabled" */
  TWO_FACTOR_DISABLED: "Two-Factor Authentication has been disabled",
  /** @default "Two-Factor Authentication" */
  TWO_FACTOR_PROMPT: "Two-Factor Authentication",
  /** @default "Scan the QR Code with your Authenticator" */
  TWO_FACTOR_TOTP_LABEL: "Scan the QR Code with your Authenticator",
  /** @default "Send verification code" */
  SEND_VERIFICATION_CODE: "Send verification code",
  /** @default "Unlink" */
  UNLINK: "Unlink",
  /** @default "Updated successfully" */
  UPDATED_SUCCESSFULLY: "updated successfully",
  /** @default "Username" */
  USERNAME: "Username",
  /** @default "Enter the username you want to use to log in." */
  USERNAME_DESCRIPTION: "Enter the username you want to use to log in.",
  /** @default "Please use 32 characters at maximum." */
  USERNAME_INSTRUCTIONS: "Please use 32 characters at maximum.",
  /** @default "Username" */
  USERNAME_PLACEHOLDER: "Username",
  /** @default "(Optional)" */
  OPTIONAL_BRACKETS: "(Optional)",
  /** @default "Username or email" */
  SIGN_IN_USERNAME_PLACEHOLDER: "Username or email",
  /** @default "Verify Your Email" */
  VERIFY_YOUR_EMAIL: "Verify Your Email",
  /** @default "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend." */
  VERIFY_YOUR_EMAIL_DESCRIPTION: "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend.",
  /** @default "Go back" */
  GO_BACK: "Go back",
  /** @default "Your session is not fresh. Please sign in again." */
  SESSION_NOT_FRESH: "Your session is not fresh. Please sign in again.",
  /** @default "Upload Avatar" */
  UPLOAD_AVATAR: "Upload Avatar",
  /** @default "Logo" */
  LOGO: "Logo",
  /** @default "Click on the logo to upload a custom one from your files." */
  LOGO_DESCRIPTION: "Click on the logo to upload a custom one from your files.",
  /** @default "A logo is optional but strongly recommended." */
  LOGO_INSTRUCTIONS: "A logo is optional but strongly recommended.",
  /** @default "Upload" */
  UPLOAD: "Upload",
  /** @default "Upload Logo" */
  UPLOAD_LOGO: "Upload Logo",
  /** @default "Delete Logo" */
  DELETE_LOGO: "Delete Logo",
  /** @default "Privacy Policy" */
  PRIVACY_POLICY: "Privacy Policy",
  /** @default "Terms of Service" */
  TERMS_OF_SERVICE: "Terms of Service",
  /** @default "This site is protected by reCAPTCHA." */
  PROTECTED_BY_RECAPTCHA: "This site is protected by reCAPTCHA.",
  /** @default "By continuing, you agree to the" */
  BY_CONTINUING_YOU_AGREE: "By continuing, you agree to the",
  /** @default "User" */
  USER: "User",
  /** @default "Organizations" */
  ORGANIZATIONS: "Organizations",
  /** @default "Manage your organizations and memberships." */
  ORGANIZATIONS_DESCRIPTION: "Manage your organizations and memberships.",
  /** @default "Create an organization to collaborate with other users." */
  ORGANIZATIONS_INSTRUCTIONS: "Create an organization to collaborate with other users.",
  /** @default "Leave Organization" */
  LEAVE_ORGANIZATION: "Leave Organization",
  /** @default "Are you sure you want to leave this organization?" */
  LEAVE_ORGANIZATION_CONFIRM: "Are you sure you want to leave this organization?",
  /** @default "You have successfully left the organization." */
  LEAVE_ORGANIZATION_SUCCESS: "You have successfully left the organization.",
  /** @default "Manage Organization" */
  MANAGE_ORGANIZATION: "Manage Organization",
  /** @default "Remove Member" */
  REMOVE_MEMBER: "Remove Member",
  /** @default "Are you sure you want to remove this member from the organization?" */
  REMOVE_MEMBER_CONFIRM: "Are you sure you want to remove this member from the organization?",
  /** @default "Member removed successfully" */
  REMOVE_MEMBER_SUCCESS: "Member removed successfully",
  /** @default "Invite Member" */
  INVITE_MEMBER: "Invite Member",
  /** @default "Members" */
  MEMBERS: "Members",
  /** @default "Add or remove members and manage their roles." */
  MEMBERS_DESCRIPTION: "Add or remove members and manage their roles.",
  /** @default "Invite new members to your organization." */
  MEMBERS_INSTRUCTIONS: "Invite new members to your organization.",
  /** @default "Send an invitation to add a new member to your organization." */
  INVITE_MEMBER_DESCRIPTION: "Send an invitation to add a new member to your organization.",
  /** @default "Role" */
  ROLE: "Role",
  /** @default "Select a role" */
  SELECT_ROLE: "Select a role",
  /** @default "Admin" */
  ADMIN: "Admin",
  /** @default "Member" */
  MEMBER: "Member",
  /** @default "Guest" */
  GUEST: "Guest",
  /** @default "Owner" */
  OWNER: "Owner",
  /** @default "Update the role for this member" */
  UPDATE_ROLE_DESCRIPTION: "Update the role for this member",
  /** @default "Update Role" */
  UPDATE_ROLE: "Update Role",
  /** @default "Member role updated successfully" */
  MEMBER_ROLE_UPDATED: "Member role updated successfully",
  /** @default "Send Invitation" */
  SEND_INVITATION: "Send Invitation",
  /** @default "Invitation sent successfully" */
  SEND_INVITATION_SUCCESS: "Invitation sent successfully",
  /** @default "Pending Invitations" */
  PENDING_INVITATIONS: "Pending Invitations",
  /** @default "Manage pending invitations to your organization." */
  PENDING_INVITATIONS_DESCRIPTION: "Manage pending invitations to your organization.",
  /** @default "Invitations you've received from organizations." */
  PENDING_USER_INVITATIONS_DESCRIPTION: "Invitations you've received from organizations.",
  /** @default "Cancel Invitation" */
  CANCEL_INVITATION: "Cancel Invitation",
  /** @default "Invitation cancelled successfully" */
  INVITATION_CANCELLED: "Invitation cancelled successfully",
  /** @default "Accept Invitation" */
  ACCEPT_INVITATION: "Accept Invitation",
  /** @default "You have been invited to join an organization." */
  ACCEPT_INVITATION_DESCRIPTION: "You have been invited to join an organization.",
  /** @default "Invitation accepted successfully" */
  INVITATION_ACCEPTED: "Invitation accepted successfully",
  /** @default "Invitation rejected successfully" */
  INVITATION_REJECTED: "Invitation rejected successfully",
  /** @default "Accept" */
  ACCEPT: "Accept",
  /** @default "Reject" */
  REJECT: "Reject",
  /** @default "This invitation has expired" */
  INVITATION_EXPIRED: "This invitation has expired",
  /** @default "Delete Organization" */
  DELETE_ORGANIZATION: "Delete Organization",
  /** @default "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution." */
  DELETE_ORGANIZATION_DESCRIPTION: "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution.",
  /** @default "Organization deleted successfully" */
  DELETE_ORGANIZATION_SUCCESS: "Organization deleted successfully",
  /** @default "Enter the organization slug to continue:" */
  DELETE_ORGANIZATION_INSTRUCTIONS: "Enter the organization slug to continue:",
  /** @default "Organization slug is required" */
  SLUG_REQUIRED: "Organization slug is required",
  /** @default "The slug does not match" */
  SLUG_DOES_NOT_MATCH: "The slug does not match",
  // Teams
  /** @default "Team" */
  TEAM: "Team",
  /** @default "Teams" */
  TEAMS: "Teams",
  /** @default "Active" */
  TEAM_ACTIVE: "Active",
  /** @default "Set Active" */
  TEAM_SET_ACTIVE: "Set Active",
  /** @default "Create Team" */
  CREATE_TEAM: "Create Team",
  /** @default "Team created successfully" */
  CREATE_TEAM_SUCCESS: "Team created successfully",
  /** @default "Update Team" */
  UPDATE_TEAM: "Update Team",
  /** @default "Update Teams" */
  UPDATE_TEAMS: "Update Teams",
  /** @default "Select teams" */
  SELECT_TEAMS: "Select teams",
  /** @default "Add" */
  ADD: "Add",
  /** @default "Remove" */
  REMOVE: "Remove",
  /** @default "Update the name for this team" */
  UPDATE_TEAM_DESCRIPTION: "Update the name for this team",
  /** @default "Add or remove teams for this member" */
  UPDATE_TEAMS_DESCRIPTION: "Add or remove teams for this member",
  /** @default "Are you sure you want to remove this team from the organization?" */
  REMOVE_TEAM_CONFIRM: "Are you sure you want to remove this team from the organization?",
  /** @default "Add new team to your organization." */
  CREATE_TEAM_INSTRUCTIONS: "Add new team to your organization.",
  /** @default "Team Name" */
  TEAM_NAME: "Team Name",
  /** @default "Engineering Team" */
  TEAM_NAME_PLACEHOLDER: "Engineering Team",
  /** @default "This is your team's visible name." */
  TEAM_NAME_DESCRIPTION: "This is your team's visible name.",
  /** @default "Please use 64 characters at maximum." */
  TEAM_NAME_INSTRUCTIONS: "Please use 64 characters at maximum.",
  /** @default "Manage your teams within your organization." */
  TEAMS_DESCRIPTION: "Manage your teams within your organization.",
  /** @default "You are a member of the following teams." */
  USER_TEAMS_DESCRIPTION: "You are a member of the following teams.",
  /** @default "Delete Team" */
  DELETE_TEAM: "Delete Team",
  /** @default "Permanently remove this team and all of its contents." */
  DELETE_TEAM_DESCRIPTION: "Permanently remove this team and all of its contents.",
  /** @default "Team deleted successfully" */
  DELETE_TEAM_SUCCESS: "Team deleted successfully",
  /** @default "Enter the team name to continue:" */
  DELETE_TEAM_INSTRUCTIONS: "Enter the team name to continue:",
  /** @default "Team name is required" */
  TEAM_NAME_REQUIRED: "Team name is required",
  /** @default "The team name does not match" */
  TEAM_NAME_DOES_NOT_MATCH: "The team name does not match",
  /** @default "Team Members" */
  TEAM_MEMBERS: "Team Members",
  /** @default "Manage your team members and their roles." */
  TEAM_MEMBERS_DESCRIPTION: "Manage your team members and their roles.",
  /** @default "Add Team Member" */
  ADD_TEAM_MEMBER: "Add Team Member",
  /** @default "Remove Team Member" */
  REMOVE_TEAM_MEMBER: "Remove Team Member",
  /** @default "Are you sure you want to remove this member from the team?" */
  REMOVE_TEAM_MEMBER_CONFIRM: "Are you sure you want to remove this member from the team?",
  /** @default "Team member removed successfully" */
  REMOVE_TEAM_MEMBER_SUCCESS: "Team member removed successfully",
  /** @default "Team member added successfully" */
  ADD_TEAM_MEMBER_SUCCESS: "Team member added successfully",
  /** @default "Team updated successfully" */
  UPDATE_TEAM_SUCCESS: "Team updated successfully",
  /** @default "Manage Team Members" */
  MANAGE_TEAM_MEMBERS: "Manage Team Members",
  /** @default "Search and add organization members to this team." */
  MANAGE_TEAM_MEMBERS_DESCRIPTION: "Search and add organization members to this team.",
  /** @default "No teams found" */
  NO_TEAMS_FOUND: "No teams found",
  /** @default "member" */
  MEMBER_SINGULAR: "member",
  /** @default "members" */
  MEMBER_PLURAL: "members",
  /** @default "Unknown" */
  UNKNOWN: "Unknown",
  ...BASE_ERROR_CODES,
  ...ADMIN_ERROR_CODES,
  ...ANONYMOUS_ERROR_CODES,
  ...API_KEY_ERROR_CODES,
  ...CAPTCHA_ERROR_CODES,
  ...EMAIL_OTP_ERROR_CODES,
  ...GENERIC_OAUTH_ERROR_CODES,
  ...HAVEIBEENPWNED_ERROR_CODES,
  ...MULTI_SESSION_ERROR_CODES,
  ...ORGANIZATION_ERROR_CODES,
  ...PASSKEY_ERROR_CODES,
  ...PHONE_NUMBER_ERROR_CODES,
  ...STRIPE_ERROR_CODES,
  ...TEAM_ERROR_CODES,
  ...TWO_FACTOR_ERROR_CODES,
  ...USERNAME_ERROR_CODES
};
var AuthDataCache = class {
  cache = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Map();
  inFlightRequests = /* @__PURE__ */ new Map();
  get(key) {
    return this.cache.get(key);
  }
  set(key, data) {
    const entry = {
      data,
      timestamp: Date.now(),
      isRefetching: false
    };
    this.cache.set(key, entry);
    this.notify(key);
  }
  setRefetching(key, isRefetching) {
    const entry = this.cache.get(key);
    if (entry) {
      entry.isRefetching = isRefetching;
      this.notify(key);
    }
  }
  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.inFlightRequests.delete(key);
      this.notify(key);
    } else {
      this.cache.clear();
      this.inFlightRequests.clear();
      const keys = Array.from(this.listeners.keys());
      for (const key2 of keys) {
        this.notify(key2);
      }
    }
  }
  getInFlightRequest(key) {
    return this.inFlightRequests.get(key);
  }
  setInFlightRequest(key, promise) {
    this.inFlightRequests.set(key, promise);
  }
  removeInFlightRequest(key) {
    this.inFlightRequests.delete(key);
  }
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, /* @__PURE__ */ new Set());
    }
    this.listeners.get(key).add(callback);
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }
  notify(key) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      const callbackArray = Array.from(callbacks);
      for (const callback of callbackArray) {
        callback();
      }
    }
  }
};
var authDataCache = new AuthDataCache();
function subscribe() {
  return () => {
  };
}
function useIsHydrated() {
  return reactExports.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
function useLang() {
  const [lang, setLang] = reactExports.useState();
  reactExports.useEffect(() => {
    const checkLang = () => {
      const currentLang = document.documentElement.getAttribute("lang");
      setLang(currentLang ?? void 0);
    };
    checkLang();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "lang") {
          checkLang();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);
  return { lang };
}
function useTheme() {
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const checkTheme = () => {
      var _a;
      const isDark = document.documentElement.classList.contains("dark") || ((_a = document.documentElement.getAttribute("style")) == null ? void 0 : _a.includes("color-scheme: dark"));
      setTheme(isDark ? "dark" : "light");
    };
    checkTheme();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "style" || mutation.attributeName === "class") {
          checkTheme();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, []);
  return { theme };
}
function RecaptchaV3({ children }) {
  const isHydrated = useIsHydrated();
  const { captcha } = reactExports.useContext(AuthUIContext);
  if ((captcha == null ? void 0 : captcha.provider) !== "google-recaptcha-v3") return children;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ReCaptchaProvider,
    {
      reCaptchaKey: captcha.siteKey,
      useEnterprise: captcha.enterprise,
      useRecaptchaNet: captcha.recaptchaNet,
      children: [
        isHydrated && /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                    .grecaptcha-badge {
                        visibility: hidden;
                        border-radius: var(--radius) !important;
                        --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, #0000000d);
                        box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) !important;
                        border-style: var(--tw-border-style) !important;
                        border-width: 1px;
                    }

                    .dark .grecaptcha-badge {
                        border-color: var(--input) !important;
                    }
                ` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecaptchaV3Style, {}),
        children
      ]
    }
  );
}
function RecaptchaV3Style() {
  const { executeRecaptcha } = useReCaptcha();
  const { theme } = useTheme();
  const { lang } = useLang();
  reactExports.useEffect(() => {
    if (!executeRecaptcha) return;
    const updateRecaptcha = async () => {
      const iframe = document.querySelector(
        "iframe[title='reCAPTCHA']"
      );
      if (iframe) {
        const iframeSrcUrl = new URL(iframe.src);
        iframeSrcUrl.searchParams.set("theme", theme);
        if (lang) iframeSrcUrl.searchParams.set("hl", lang);
        iframe.src = iframeSrcUrl.toString();
      }
    };
    updateRecaptcha();
  }, [executeRecaptcha, theme, lang]);
  return null;
}
function useCurrentOrganization({
  slug: slugProp
} = {}) {
  const {
    organization: organizationOptions,
    hooks: { useActiveOrganization, useListOrganizations }
  } = reactExports.useContext(AuthUIContext);
  const { pathMode, slug: contextSlug } = organizationOptions || {};
  let data;
  let isPending;
  let isRefetching;
  let refetch;
  const {
    data: organizations,
    isPending: organizationsPending,
    isRefetching: organizationsRefetching
  } = useListOrganizations();
  if (pathMode === "slug") {
    const slug = slugProp || contextSlug;
    data = organizations == null ? void 0 : organizations.find((organization) => organization.slug === slug);
    isPending = organizationsPending;
    isRefetching = organizationsRefetching;
  } else {
    const {
      data: activeOrganization,
      isPending: organizationPending,
      isRefetching: organizationRefetching,
      refetch: refetchOrganization
    } = useActiveOrganization();
    refetch = refetchOrganization;
    data = activeOrganization;
    isPending = organizationPending;
    isRefetching = organizationRefetching;
  }
  return reactExports.useMemo(
    () => ({
      data,
      isPending,
      isRefetching,
      refetch
    }),
    [data, isPending, isRefetching, refetch]
  );
}
var OrganizationRefetcher = () => {
  const {
    hooks: { useListOrganizations, useSession },
    organization: organizationOptions,
    navigate,
    redirectTo
  } = reactExports.useContext(AuthUIContext);
  const { slug, pathMode, personalPath } = organizationOptions || {};
  const { data: sessionData } = useSession();
  const {
    data: organization,
    isPending: organizationPending,
    isRefetching: organizationRefetching,
    refetch: refetchOrganization
  } = useCurrentOrganization();
  const { refetch: refetchListOrganizations } = useListOrganizations();
  const { data: organizations } = useListOrganizations();
  reactExports.useEffect(() => {
    if (!(sessionData == null ? void 0 : sessionData.user.id)) return;
    if (organization || organizations) {
      refetchOrganization == null ? void 0 : refetchOrganization();
      refetchListOrganizations == null ? void 0 : refetchListOrganizations();
    }
  }, [sessionData == null ? void 0 : sessionData.user.id]);
  reactExports.useEffect(() => {
    if (organizationRefetching || organizationPending) return;
    if (slug && pathMode === "slug" && !organization) {
      navigate(personalPath || redirectTo);
    }
  }, [
    organization,
    organizationRefetching,
    organizationPending,
    slug,
    pathMode,
    personalPath,
    navigate,
    redirectTo
  ]);
  return null;
};
var AuthUIContext = reactExports.createContext(
  {}
);
function useAuthData({
  queryFn,
  cacheKey,
  staleTime = 1e4
  // Default 10 seconds
}) {
  var _a;
  const {
    hooks: { useSession },
    toast: toast2,
    localization,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const { data: sessionData, isPending: sessionPending } = useSession();
  const queryFnRef = reactExports.useRef(queryFn);
  queryFnRef.current = queryFn;
  const stableCacheKey = cacheKey || queryFn.toString();
  const cacheEntry = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (callback) => authDataCache.subscribe(stableCacheKey, callback),
      [stableCacheKey]
    ),
    reactExports.useCallback(
      () => authDataCache.get(stableCacheKey),
      [stableCacheKey]
    ),
    reactExports.useCallback(
      () => authDataCache.get(stableCacheKey),
      [stableCacheKey]
    )
  );
  const initialized = reactExports.useRef(false);
  const previousUserId = reactExports.useRef(void 0);
  const [error, setError] = reactExports.useState(null);
  const refetch = reactExports.useCallback(async () => {
    const existingRequest = authDataCache.getInFlightRequest(stableCacheKey);
    if (existingRequest) {
      try {
        const result = await existingRequest;
        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
        }
      } catch (err) {
        setError(err);
      }
      return;
    }
    if ((cacheEntry == null ? void 0 : cacheEntry.data) !== void 0) {
      authDataCache.setRefetching(stableCacheKey, true);
    }
    const fetchPromise = queryFnRef.current();
    authDataCache.setInFlightRequest(stableCacheKey, fetchPromise);
    try {
      const { data, error: error2 } = await fetchPromise;
      if (error2) {
        setError(error2);
        toast2({
          variant: "error",
          message: getLocalizedError({
            error: error2,
            localization,
            localizeErrors
          })
        });
      } else {
        setError(null);
      }
      authDataCache.set(stableCacheKey, data);
    } catch (err) {
      const error2 = err;
      setError(error2);
      toast2({
        variant: "error",
        message: getLocalizedError({
          error: error2,
          localization,
          localizeErrors
        })
      });
    } finally {
      authDataCache.setRefetching(stableCacheKey, false);
      authDataCache.removeInFlightRequest(stableCacheKey);
    }
  }, [stableCacheKey, toast2, localization, localizeErrors, cacheEntry]);
  reactExports.useEffect(() => {
    var _a2;
    const currentUserId = (_a2 = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a2.id;
    if (!sessionData) {
      authDataCache.setRefetching(stableCacheKey, false);
      authDataCache.clear(stableCacheKey);
      initialized.current = false;
      previousUserId.current = void 0;
      return;
    }
    const userIdChanged = previousUserId.current !== void 0 && previousUserId.current !== currentUserId;
    if (userIdChanged) {
      authDataCache.clear(stableCacheKey);
    }
    const hasCachedData = (cacheEntry == null ? void 0 : cacheEntry.data) !== void 0;
    const isStale = !cacheEntry || Date.now() - cacheEntry.timestamp > staleTime;
    if (!initialized.current || !hasCachedData || userIdChanged || hasCachedData && isStale) {
      if (!hasCachedData || isStale) {
        initialized.current = true;
        refetch();
      }
    }
    previousUserId.current = currentUserId;
  }, [
    sessionData,
    (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.id,
    stableCacheKey,
    refetch,
    cacheEntry,
    staleTime
  ]);
  const isPending = sessionPending || (cacheEntry == null ? void 0 : cacheEntry.data) === void 0 && !error;
  return {
    data: (cacheEntry == null ? void 0 : cacheEntry.data) ?? null,
    isPending,
    isRefetching: (cacheEntry == null ? void 0 : cacheEntry.isRefetching) ?? false,
    error,
    refetch
  };
}
var DefaultLink = ({ href, className, children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className, href, children });
var defaultNavigate = (href) => {
  window.location.href = href;
};
var defaultReplace = (href) => {
  window.location.replace(href);
};
var defaultToast = ({ variant = "default", message }) => {
  if (variant === "default") {
    toast(message);
  } else {
    toast[variant](message);
  }
};
function BetterAuthPluginProvider({
  children
}) {
  var _a;
  const authOverrides = usePluginOverrides("auth", {
    localization: authLocalization,
    basePath: "/auth",
    redirectTo: "/",
    freshAge: 60 * 60 * 24,
    changeEmail: true,
    nameRequired: true,
    Link: DefaultLink,
    navigate: defaultNavigate,
    replace: defaultReplace,
    toast: defaultToast
  });
  const accountOverrides = usePluginOverrides("account", {});
  const organizationOverrides = usePluginOverrides("organization", {});
  const authClient = authOverrides.authClient;
  const avatar = reactExports.useMemo(() => {
    if (!authOverrides.avatar) return;
    if (authOverrides.avatar === true) {
      return {
        extension: "png",
        size: 128
      };
    }
    return {
      upload: authOverrides.avatar.upload,
      delete: authOverrides.avatar.delete,
      extension: authOverrides.avatar.extension || "png",
      size: authOverrides.avatar.size || (authOverrides.avatar.upload ? 256 : 128),
      Image: authOverrides.avatar.Image
    };
  }, [authOverrides.avatar]);
  const account = reactExports.useMemo(() => {
    const accountProp = accountOverrides == null ? void 0 : accountOverrides.account;
    if (!accountProp) return void 0;
    if (accountProp === true) {
      const basePathRaw2 = (accountOverrides == null ? void 0 : accountOverrides.basePath) ?? "/account";
      const basePath3 = basePathRaw2.endsWith("/") ? basePathRaw2.slice(0, -1) : basePathRaw2;
      return {
        basePath: basePath3,
        fields: ["image", "name"],
        viewPaths: accountViewPaths
      };
    }
    const basePathRaw = accountProp.basePath ?? (accountOverrides == null ? void 0 : accountOverrides.basePath) ?? "/account";
    const basePath2 = basePathRaw.endsWith("/") ? basePathRaw.slice(0, -1) : basePathRaw;
    return {
      basePath: basePath2,
      fields: accountProp.fields || ["image", "name"],
      viewPaths: { ...accountViewPaths, ...accountProp.viewPaths }
    };
  }, [accountOverrides == null ? void 0 : accountOverrides.account, accountOverrides == null ? void 0 : accountOverrides.basePath]);
  const deleteUser = reactExports.useMemo(() => {
    if (!(accountOverrides == null ? void 0 : accountOverrides.deleteUser)) return;
    if (accountOverrides.deleteUser === true) {
      return {};
    }
    return accountOverrides.deleteUser;
  }, [accountOverrides == null ? void 0 : accountOverrides.deleteUser]);
  const social = reactExports.useMemo(() => {
    return authOverrides.social;
  }, [authOverrides.social]);
  const genericOAuth = reactExports.useMemo(() => {
    return authOverrides.genericOAuth;
  }, [authOverrides.genericOAuth]);
  const credentials = reactExports.useMemo(() => {
    var _a2, _b;
    if (authOverrides.credentials === false) return;
    if (authOverrides.credentials === true) {
      return {
        forgotPassword: true,
        usernameRequired: true
      };
    }
    return {
      ...authOverrides.credentials,
      forgotPassword: ((_a2 = authOverrides.credentials) == null ? void 0 : _a2.forgotPassword) ?? true,
      usernameRequired: ((_b = authOverrides.credentials) == null ? void 0 : _b.usernameRequired) ?? true
    };
  }, [authOverrides.credentials]);
  const signUp = reactExports.useMemo(() => {
    if (authOverrides.signUp === false) return;
    if (authOverrides.signUp === true || authOverrides.signUp === void 0) {
      return {
        fields: ["name"]
      };
    }
    return {
      fields: authOverrides.signUp.fields || ["name"]
    };
  }, [authOverrides.signUp]);
  const organization = reactExports.useMemo(() => {
    const organizationProp = organizationOverrides == null ? void 0 : organizationOverrides.organization;
    if (!organizationProp) return void 0;
    if (organizationProp === true) {
      const basePathRaw2 = (organizationOverrides == null ? void 0 : organizationOverrides.basePath) ?? "/organization";
      const basePath3 = basePathRaw2.endsWith("/") ? basePathRaw2.slice(0, -1) : basePathRaw2;
      return {
        basePath: basePath3,
        viewPaths: organizationViewPaths,
        customRoles: []
      };
    }
    let logo;
    if (organizationProp.logo === true) {
      logo = {
        extension: "png",
        size: 128
      };
    } else if (organizationProp.logo) {
      logo = {
        upload: organizationProp.logo.upload,
        delete: organizationProp.logo.delete,
        extension: organizationProp.logo.extension || "png",
        size: organizationProp.logo.size || (organizationProp.logo.upload ? 256 : 128)
      };
    }
    const basePathRaw = organizationProp.basePath ?? (organizationOverrides == null ? void 0 : organizationOverrides.basePath) ?? "/organization";
    const basePath2 = basePathRaw.endsWith("/") ? basePathRaw.slice(0, -1) : basePathRaw;
    return {
      ...organizationProp,
      logo,
      basePath: basePath2,
      customRoles: organizationProp.customRoles || [],
      viewPaths: {
        ...organizationViewPaths,
        ...organizationProp.viewPaths
      }
    };
  }, [organizationOverrides == null ? void 0 : organizationOverrides.organization, organizationOverrides == null ? void 0 : organizationOverrides.basePath]);
  const teams = reactExports.useMemo(() => {
    var _a2, _b;
    const teamsProp = (organizationOverrides == null ? void 0 : organizationOverrides.teams) ?? (accountOverrides == null ? void 0 : accountOverrides.teams);
    if (!teamsProp || !organization) return;
    if (teamsProp === true) {
      return {
        enabled: true,
        customRoles: [],
        colors: {
          count: 5,
          prefix: "team"
        }
      };
    }
    return {
      enabled: teamsProp.enabled ?? true,
      customRoles: teamsProp.customRoles || [],
      colors: {
        count: ((_a2 = teamsProp.colors) == null ? void 0 : _a2.count) ?? 5,
        prefix: ((_b = teamsProp.colors) == null ? void 0 : _b.prefix) ?? "team"
      }
    };
  }, [organizationOverrides == null ? void 0 : organizationOverrides.teams, accountOverrides == null ? void 0 : accountOverrides.teams, organization]);
  const defaultMutators = reactExports.useMemo(() => {
    return {
      deleteApiKey: (params) => authClient.apiKey.delete({
        ...params,
        fetchOptions: { throw: true }
      }),
      deletePasskey: (params) => authClient.passkey.deletePasskey({
        ...params,
        fetchOptions: { throw: true }
      }),
      revokeDeviceSession: (params) => authClient.multiSession.revoke({
        ...params,
        fetchOptions: { throw: true }
      }),
      revokeSession: (params) => authClient.revokeSession({
        ...params,
        fetchOptions: { throw: true }
      }),
      setActiveSession: (params) => authClient.multiSession.setActive({
        ...params,
        fetchOptions: { throw: true }
      }),
      updateOrganization: (params) => authClient.organization.update({
        ...params,
        fetchOptions: { throw: true }
      }),
      updateTeam: (params) => authClient.$fetch("/organization/update-team", {
        method: "POST",
        body: params,
        throw: true
      }),
      updateUser: (params) => authClient.updateUser({
        ...params,
        fetchOptions: { throw: true }
      }),
      unlinkAccount: (params) => authClient.unlinkAccount({
        ...params,
        fetchOptions: { throw: true }
      })
    };
  }, [authClient]);
  const defaultHooks = reactExports.useMemo(() => {
    return {
      useSession: authClient.useSession,
      useListAccounts: () => useAuthData({
        queryFn: authClient.listAccounts,
        cacheKey: "listAccounts"
      }),
      useAccountInfo: (params) => useAuthData({
        queryFn: () => authClient.accountInfo(params),
        cacheKey: `accountInfo:${JSON.stringify(params)}`
      }),
      useListDeviceSessions: () => useAuthData({
        queryFn: authClient.multiSession.listDeviceSessions,
        cacheKey: "listDeviceSessions"
      }),
      useListSessions: () => useAuthData({
        queryFn: authClient.listSessions,
        cacheKey: "listSessions"
      }),
      useListPasskeys: authClient.useListPasskeys,
      useListApiKeys: () => useAuthData({
        queryFn: authClient.apiKey.list,
        cacheKey: "listApiKeys"
      }),
      useActiveOrganization: authClient.useActiveOrganization,
      useListOrganizations: authClient.useListOrganizations,
      useHasPermission: (params) => useAuthData({
        queryFn: () => authClient.$fetch("/organization/has-permission", {
          method: "POST",
          body: params
        }),
        cacheKey: `hasPermission:${JSON.stringify(params)}`
      }),
      useInvitation: (params) => useAuthData({
        queryFn: () => authClient.organization.getInvitation(params),
        cacheKey: `invitation:${JSON.stringify(params)}`
      }),
      useListInvitations: (params) => useAuthData({
        queryFn: () => {
          var _a2;
          return authClient.$fetch(
            `/organization/list-invitations?organizationId=${((_a2 = params == null ? void 0 : params.query) == null ? void 0 : _a2.organizationId) || ""}`
          );
        },
        cacheKey: `listInvitations:${JSON.stringify(params)}`
      }),
      useListUserInvitations: () => useAuthData({
        queryFn: () => authClient.$fetch(
          "/organization/list-user-invitations"
        ),
        cacheKey: `listUserInvitations`
      }),
      useListMembers: (params) => useAuthData({
        queryFn: () => {
          var _a2;
          return authClient.$fetch(
            `/organization/list-members?organizationId=${((_a2 = params == null ? void 0 : params.query) == null ? void 0 : _a2.organizationId) || ""}`
          );
        },
        cacheKey: `listMembers:${JSON.stringify(params)}`
      }),
      useListTeams: (params) => useAuthData({
        queryFn: () => authClient.$fetch(
          `/organization/list-teams?organizationId=${(params == null ? void 0 : params.organizationId) || ""}`
        ),
        cacheKey: `listTeams:${JSON.stringify(params)}`
      }),
      useListTeamMembers: (params) => useAuthData({
        queryFn: () => authClient.$fetch("/organization/list-team-members", {
          method: "POST",
          body: (params == null ? void 0 : params.teamId) ? { query: { teamId: params.teamId } } : void 0
        }),
        cacheKey: `listTeamMembers:${JSON.stringify(params)}`
      }),
      useListUserTeams: () => useAuthData({
        queryFn: () => authClient.$fetch("/organization/list-user-teams"),
        cacheKey: "listUserTeams"
      })
    };
  }, [authClient]);
  const viewPaths = reactExports.useMemo(() => {
    return { ...authViewPaths, ...authOverrides.viewPaths };
  }, [authOverrides.viewPaths]);
  const localization = reactExports.useMemo(() => {
    return { ...authLocalization, ...authOverrides.localization };
  }, [authOverrides.localization]);
  const hooks = reactExports.useMemo(() => {
    return { ...defaultHooks, ...authOverrides.hooks };
  }, [defaultHooks, authOverrides.hooks]);
  const mutators = reactExports.useMemo(() => {
    return { ...defaultMutators, ...authOverrides.mutators };
  }, [defaultMutators, authOverrides.mutators]);
  const baseURL = authOverrides.baseURL ? authOverrides.baseURL.endsWith("/") ? authOverrides.baseURL.slice(0, -1) : authOverrides.baseURL : "";
  const basePath = authOverrides.basePath ? authOverrides.basePath.endsWith("/") ? authOverrides.basePath.slice(0, -1) : authOverrides.basePath : "/auth";
  const emailVerification = reactExports.useMemo(() => {
    const ev = authOverrides.emailVerification;
    if (!ev) return void 0;
    if (ev === true) return { otp: false };
    return { otp: ev.otp ?? false };
  }, [authOverrides.emailVerification]);
  const { data: sessionData } = hooks.useSession();
  const contextValue = {
    authClient,
    avatar,
    basePath: basePath === "/" ? "" : basePath,
    baseURL,
    // Auth-specific feature flags — always read from authOverrides, never from the
    // merged blob, so account/org overrides can't silently overwrite them.
    captcha: authOverrides.captcha,
    redirectTo: authOverrides.redirectTo || "/",
    changeEmail: authOverrides.changeEmail ?? true,
    credentials,
    deleteUser,
    freshAge: authOverrides.freshAge ?? 60 * 60 * 24,
    genericOAuth,
    hooks,
    mutators,
    localization,
    nameRequired: authOverrides.nameRequired ?? true,
    organization,
    teams,
    account,
    signUp,
    social,
    // Shared navigation — account/org can legitimately override these via ...authConfig
    toast: authOverrides.toast || defaultToast,
    navigate: authOverrides.navigate || defaultNavigate,
    replace: authOverrides.replace || authOverrides.navigate || defaultReplace,
    viewPaths,
    Link: authOverrides.Link || DefaultLink,
    apiKey: authOverrides.apiKey,
    gravatar: authOverrides.gravatar,
    additionalFields: authOverrides.additionalFields,
    magicLink: authOverrides.magicLink,
    emailOTP: authOverrides.emailOTP,
    passkey: authOverrides.passkey,
    oneTap: authOverrides.oneTap,
    twoFactor: authOverrides.twoFactor,
    multiSession: authOverrides.multiSession,
    emailVerification,
    localizeErrors: authOverrides.localizeErrors ?? true,
    persistClient: authOverrides.persistClient,
    optimistic: authOverrides.optimistic,
    onSessionChange: authOverrides.onSessionChange
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthUIContext.Provider, { value: contextValue, children: [
    sessionData && organization && /* @__PURE__ */ jsxRuntimeExports.jsx(OrganizationRefetcher, {}),
    ((_a = authOverrides.captcha) == null ? void 0 : _a.provider) === "google-recaptcha-v3" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RecaptchaV3, { children }) : children
  ] });
}
function useAuthenticate(options) {
  const { authView = "SIGN_IN", enabled = true } = {};
  const {
    hooks: { useSession },
    basePath,
    viewPaths,
    replace
  } = reactExports.useContext(AuthUIContext);
  const { data, isPending, error, refetch } = useSession();
  const sessionData = data;
  reactExports.useEffect(() => {
    if (!enabled || isPending || sessionData) return;
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get("redirectTo") || window.location.pathname + window.location.search;
    replace(
      `${basePath}/${viewPaths[authView]}?redirectTo=${encodeURIComponent(redirectTo)}`
    );
  }, [
    isPending,
    sessionData,
    basePath,
    viewPaths,
    replace,
    authView,
    enabled
  ]);
  return {
    data: sessionData,
    user: sessionData == null ? void 0 : sessionData.user,
    isPending,
    error,
    refetch
  };
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Avatar$1,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AvatarImage$1,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AvatarFallback$1,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function OrganizationLogo({
  className,
  classNames,
  isPending,
  size,
  organization,
  localization: propLocalization,
  ...props
}) {
  const { localization: contextLocalization, avatar } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  const name = organization == null ? void 0 : organization.name;
  const src = organization == null ? void 0 : organization.logo;
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: cn(
          "shrink-0 rounded-full",
          size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
          className,
          classNames == null ? void 0 : classNames.base,
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Avatar,
    {
      className: cn(
        "bg-muted",
        size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        (avatar == null ? void 0 : avatar.Image) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          avatar.Image,
          {
            alt: name || (localization == null ? void 0 : localization.ORGANIZATION),
            className: classNames == null ? void 0 : classNames.image,
            src: src || ""
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarImage,
          {
            alt: name || (localization == null ? void 0 : localization.ORGANIZATION),
            className: classNames == null ? void 0 : classNames.image,
            src: src || void 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarFallback,
          {
            className: cn("text-foreground", classNames == null ? void 0 : classNames.fallback),
            delayMs: src ? 600 : void 0,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Building,
              {
                className: cn("size-[50%]", classNames == null ? void 0 : classNames.fallbackIcon)
              }
            )
          }
        )
      ]
    }
  );
}
function OrganizationCellView({
  className,
  classNames,
  isPending,
  size,
  organization,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...propLocalization };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 truncate",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationLogo,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            localization,
            organization,
            size
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex flex-col truncate text-left leading-tight",
              classNames == null ? void 0 : classNames.content
            ),
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "max-w-full",
                    size === "lg" ? "h-4.5 w-32" : "h-3.5 w-24",
                    classNames == null ? void 0 : classNames.title,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "mt-1.5 max-w-full",
                    size === "lg" ? "h-3.5 w-24" : "h-3 w-16",
                    classNames == null ? void 0 : classNames.subtitle,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate font-semibold",
                    size === "lg" ? "text-base" : "text-sm",
                    classNames == null ? void 0 : classNames.title
                  ),
                  children: (organization == null ? void 0 : organization.name) || (localization == null ? void 0 : localization.ORGANIZATION)
                }
              ),
              size !== "sm" && (organization == null ? void 0 : organization.slug) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: organization.slug
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function getGravatarUrl(email, options) {
  if (!email) return null;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const encoder = new TextEncoder();
    const emailBytes = encoder.encode(normalizedEmail);
    const hash = bytesToHex(sha256(emailBytes));
    const extension = (options == null ? void 0 : options.jpg) ? ".jpg" : "";
    let url = `https://gravatar.com/avatar/${hash}${extension}`;
    const params = new URLSearchParams();
    if (options == null ? void 0 : options.size) {
      params.append(
        "s",
        Math.min(Math.max(options.size, 1), 2048).toString()
      );
    }
    if (options == null ? void 0 : options.d) {
      params.append("d", options.d);
    }
    if (options == null ? void 0 : options.forceDefault) {
      params.append("f", "y");
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return url;
  } catch (error) {
    console.error("Error generating Gravatar URL:", error);
    return null;
  }
}
function UserAvatar({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization,
  ...props
}) {
  const {
    localization: contextLocalization,
    gravatar,
    avatar
  } = reactExports.useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...propLocalization };
  const name = (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email);
  const userImage = (user == null ? void 0 : user.image) || (user == null ? void 0 : user.avatar) || (user == null ? void 0 : user.avatarUrl);
  const gravatarUrl = gravatar && (user == null ? void 0 : user.email) ? getGravatarUrl(
    user.email,
    gravatar === true ? void 0 : gravatar
  ) : null;
  const src = gravatar ? gravatarUrl : userImage;
  if (isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: cn(
          "shrink-0 rounded-full",
          size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
          className,
          classNames == null ? void 0 : classNames.base,
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Avatar,
    {
      className: cn(
        "bg-muted",
        size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        (avatar == null ? void 0 : avatar.Image) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          avatar.Image,
          {
            alt: name || (localization == null ? void 0 : localization.USER),
            className: classNames == null ? void 0 : classNames.image,
            src: src || ""
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarImage,
          {
            alt: name || (localization == null ? void 0 : localization.USER),
            className: classNames == null ? void 0 : classNames.image,
            src: src || void 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarFallback,
          {
            className: cn(
              "text-foreground uppercase",
              classNames == null ? void 0 : classNames.fallback
            ),
            delayMs: src ? 600 : void 0,
            children: firstTwoCharacters(name) || /* @__PURE__ */ jsxRuntimeExports.jsx(
              UserRound,
              {
                className: cn("size-[50%]", classNames == null ? void 0 : classNames.fallbackIcon)
              }
            )
          }
        )
      ]
    }
  );
}
var firstTwoCharacters = (name) => name == null ? void 0 : name.slice(0, 2);
async function resizeAndCropImage(file, name, size, extension) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const minEdge = Math.min(image.width, image.height);
  const sx = (image.width - minEdge) / 2;
  const sy = (image.height - minEdge) / 2;
  const sWidth = minEdge;
  const sHeight = minEdge;
  ctx == null ? void 0 : ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, size, size);
  const resizedImageBlob = await new Promise(
    (resolve) => canvas.toBlob(resolve, `image/${extension}`)
  );
  return new File([resizedImageBlob], `${name}.${extension}`, {
    type: `image/${extension}`
  });
}
async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      image.src = (_a = e.target) == null ? void 0 : _a.result;
    };
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Label2({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
var Form = FormProvider;
var FormFieldContext = reactExports.createContext(
  {}
);
var FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { ...props }) });
};
var useFormField = () => {
  const fieldContext = reactExports.useContext(FormFieldContext);
  const itemContext = reactExports.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
var FormItemContext = reactExports.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label2,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Slot,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String((error == null ? void 0 : error.message) ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function SettingsActionButton({
  classNames,
  actionLabel,
  disabled,
  isSubmitting,
  variant,
  onClick,
  ...props
}) {
  if (!onClick) {
    const formState = useFormState();
    isSubmitting = formState.isSubmitting;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: cn(
        "md:ms-auto",
        classNames == null ? void 0 : classNames.button,
        variant === "default" && (classNames == null ? void 0 : classNames.primaryButton),
        variant === "destructive" && (classNames == null ? void 0 : classNames.destructiveButton)
      ),
      disabled: isSubmitting || disabled,
      size: "sm",
      type: onClick ? "button" : "submit",
      variant,
      onClick,
      ...props,
      children: [
        isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
        actionLabel
      ]
    }
  );
}
function SettingsCardFooter({
  className,
  classNames,
  actionLabel,
  disabled,
  instructions,
  isPending,
  isSubmitting,
  variant,
  action
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CardFooter,
    {
      className: cn(
        "flex flex-col justify-between gap-4 rounded-b-xl md:flex-row",
        (actionLabel || instructions) && "!py-4 border-t",
        variant === "destructive" ? "border-destructive/30 bg-destructive/15" : "bg-sidebar",
        className,
        classNames == null ? void 0 : classNames.footer
      ),
      children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        instructions && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn(
              "my-0.5 h-3 w-48 max-w-full md:h-4 md:w-56",
              classNames == null ? void 0 : classNames.skeleton
            )
          }
        ),
        actionLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn(
              "h-8 w-14 md:ms-auto",
              classNames == null ? void 0 : classNames.skeleton
            )
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        instructions && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardDescription,
          {
            className: cn(
              "text-center text-muted-foreground text-xs md:text-start md:text-sm",
              classNames == null ? void 0 : classNames.instructions
            ),
            children: instructions
          }
        ),
        actionLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsActionButton,
          {
            classNames,
            actionLabel,
            disabled,
            isSubmitting,
            variant,
            onClick: action
          }
        )
      ] })
    }
  );
}
function SettingsCardHeader({
  className,
  classNames,
  description,
  isPending,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: cn(classNames == null ? void 0 : classNames.header, className), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: cn(
          "my-0.5 h-5 w-1/3 md:h-5.5",
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    ),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: cn(
          "mt-1.5 mb-0.5 h-3 w-2/3 md:h-3.5",
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    )
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardTitle,
      {
        className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
        children: title
      }
    ),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardDescription,
      {
        className: cn(
          "text-xs md:text-sm",
          classNames == null ? void 0 : classNames.description
        ),
        children: description
      }
    )
  ] }) });
}
function SettingsCard({
  children,
  className,
  classNames,
  title,
  description,
  instructions,
  actionLabel,
  disabled,
  isPending,
  isSubmitting,
  optimistic,
  variant,
  action,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "w-full pb-0 text-start",
        variant === "destructive" && "border-destructive/40",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCardHeader,
          {
            classNames,
            description,
            isPending,
            title
          }
        ),
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCardFooter,
          {
            classNames,
            actionLabel,
            disabled,
            isPending,
            isSubmitting,
            instructions,
            optimistic,
            variant,
            action
          }
        )
      ]
    }
  );
}
function SettingsCellSkeleton({
  classNames
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn("size-5 rounded-full", classNames == null ? void 0 : classNames.skeleton)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn("h-4 w-24", classNames == null ? void 0 : classNames.skeleton)
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn("ms-auto size-8 w-12", classNames == null ? void 0 : classNames.skeleton)
          }
        )
      ]
    }
  );
}
function UserView({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserAvatar,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            size,
            user,
            localization
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "grid flex-1 text-start leading-tight",
              classNames == null ? void 0 : classNames.content
            ),
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "max-w-full",
                    size === "lg" ? "h-4.5 w-32" : "h-3.5 w-24",
                    classNames == null ? void 0 : classNames.title,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "mt-1.5 max-w-full",
                    size === "lg" ? "h-3.5 w-40" : "h-3 w-32",
                    classNames == null ? void 0 : classNames.subtitle,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate font-semibold",
                    size === "lg" ? "text-base" : "text-sm",
                    classNames == null ? void 0 : classNames.title
                  ),
                  children: (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email) || (localization == null ? void 0 : localization.USER)
                }
              ),
              !(user == null ? void 0 : user.isAnonymous) && size !== "sm" && ((user == null ? void 0 : user.name) || (user == null ? void 0 : user.username)) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: user == null ? void 0 : user.email
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog$1, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal$1, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogOverlay$1,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent$1,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogClose,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle$1,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription$1,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function ApiKeyDeleteDialog({
  classNames,
  apiKey,
  localization,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    localization: contextLocalization,
    mutators: { deleteApiKey },
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteApiKey({ keyId: apiKey.id });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization.NEVER_EXPIRES;
    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(
      lang ?? "en",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    )}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: [
                localization.DELETE,
                " ",
                localization.API_KEY
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.DELETE_API_KEY_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: cn(
              "my-2 flex-row items-center gap-3 px-4 py-3",
              classNames == null ? void 0 : classNames.cell
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: apiKey.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-sm", children: [
                    apiKey.start,
                    "******"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: formatExpiration() })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "secondary",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              disabled: isLoading,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: handleDelete,
              disabled: isLoading,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              children: [
                isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function ApiKeyCell({
  className,
  classNames,
  apiKey,
  localization,
  refetch
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization.NEVER_EXPIRES;
    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(
      lang ?? "en",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    )}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center gap-3 truncate px-4 py-3",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KeyRound,
            {
              className: cn("size-4 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: apiKey.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 truncate text-muted-foreground text-sm", children: [
                apiKey.start,
                "******"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: formatExpiration() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              size: "sm",
              variant: "outline",
              onClick: () => setShowDeleteDialog(true),
              children: localization.DELETE
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApiKeyDeleteDialog,
      {
        classNames,
        apiKey,
        localization,
        open: showDeleteDialog,
        onOpenChange: setShowDeleteDialog,
        refetch
      }
    )
  ] });
}
function ApiKeyDisplayDialog({
  classNames,
  apiKey,
  localization,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.API_KEY_CREATED
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.CREATE_API_KEY_SUCCESS
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-all rounded-md bg-muted p-4 font-mono text-sm", children: apiKey }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleCopy,
              disabled: copied,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPIED_TO_CLIPBOARD
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPY_TO_CLIPBOARD
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "default",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: localization.DONE
            }
          )
        ] })
      ]
    }
  ) });
}
function PersonalAccountView({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserAvatar,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            localization,
            size,
            user
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "grid flex-1 text-left leading-tight",
              classNames == null ? void 0 : classNames.content
            ),
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "max-w-full",
                    size === "lg" ? "h-4.5 w-32" : "h-3.5 w-24",
                    classNames == null ? void 0 : classNames.title,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: cn(
                    "mt-1.5 max-w-full",
                    size === "lg" ? "h-3.5 w-40" : "h-3 w-32",
                    classNames == null ? void 0 : classNames.subtitle,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate font-semibold",
                    size === "lg" ? "text-base" : "text-sm",
                    classNames == null ? void 0 : classNames.title
                  ),
                  children: (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email) || (localization == null ? void 0 : localization.USER)
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: localization == null ? void 0 : localization.PERSONAL_ACCOUNT
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Select$1, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue$1, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectTrigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectContent$1,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectViewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectItem$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollUpButton$1,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollDownButton$1,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
    }
  );
}
function CreateApiKeyDialog({
  classNames,
  localization,
  onSuccess,
  refetch,
  organizationId,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    apiKey,
    hooks: { useListOrganizations, useSession },
    localization: contextLocalization,
    organization: contextOrganization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  let organizations;
  if (contextOrganization) {
    const { data } = useListOrganizations();
    organizations = data;
  }
  const { data: sessionData } = useSession();
  const user = sessionData == null ? void 0 : sessionData.user;
  const showOrganizationSelect = contextOrganization == null ? void 0 : contextOrganization.apiKey;
  const formSchema = object({
    name: string().min(1, `${localization.NAME} ${localization.IS_REQUIRED}`),
    expiresInDays: string().optional(),
    organizationId: showOrganizationSelect ? string().min(
      1,
      `${localization.ORGANIZATION} ${localization.IS_REQUIRED}`
    ) : string().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    values: {
      name: "",
      expiresInDays: "none",
      organizationId: organizationId ?? "personal"
    }
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (values) => {
    try {
      const expiresIn = values.expiresInDays && values.expiresInDays !== "none" ? Number.parseInt(values.expiresInDays) * 60 * 60 * 24 : void 0;
      const selectedOrgId = values.organizationId === "personal" ? void 0 : values.organizationId;
      const metadata = {
        ...typeof apiKey === "object" ? apiKey.metadata : {},
        ...contextOrganization && selectedOrgId ? { organizationId: selectedOrgId } : {}
      };
      const result = await authClient.apiKey.create({
        name: values.name,
        expiresIn,
        prefix: typeof apiKey === "object" ? apiKey.prefix : void 0,
        metadata: Object.keys(metadata).length > 0 ? metadata : void 0,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      onSuccess(result.key);
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  const rtf = new Intl.RelativeTimeFormat(lang ?? "en");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.CREATE_API_KEY
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.CREATE_API_KEY_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            method: "POST",
            onSubmit: form.handleSubmit(onSubmit),
            className: "space-y-6",
            children: [
              showOrganizationSelect && /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "organizationId",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "w-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FormLabel,
                      {
                        className: classNames == null ? void 0 : classNames.label,
                        children: localization.ORGANIZATION
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        onValueChange: field.onChange,
                        value: field.value,
                        disabled: isSubmitting,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectTrigger,
                            {
                              className: cn(
                                "w-full p-2",
                                classNames == null ? void 0 : classNames.input
                              ),
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectValue,
                                {
                                  placeholder: localization.ORGANIZATION
                                }
                              )
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "w-[--radix-select-trigger-width]", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectItem,
                              {
                                value: "personal",
                                className: "p-2",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  PersonalAccountView,
                                  {
                                    user,
                                    localization,
                                    size: "sm"
                                  }
                                )
                              }
                            ),
                            organizations == null ? void 0 : organizations.map((org) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectItem,
                              {
                                value: org.id,
                                className: "p-2",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  OrganizationCellView,
                                  {
                                    organization: org,
                                    localization,
                                    size: "sm"
                                  }
                                )
                              },
                              org.id
                            ))
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "name",
                    render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.NAME
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          className: classNames == null ? void 0 : classNames.input,
                          placeholder: localization.API_KEY_NAME_PLACEHOLDER,
                          autoFocus: true,
                          disabled: isSubmitting,
                          ...field
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "expiresInDays",
                    render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.EXPIRES
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          onValueChange: field.onChange,
                          defaultValue: field.value,
                          disabled: isSubmitting,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                className: classNames == null ? void 0 : classNames.input,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectValue,
                                  {
                                    placeholder: localization.NO_EXPIRATION
                                  }
                                )
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: localization.NO_EXPIRATION }),
                              [
                                1,
                                7,
                                30,
                                60,
                                90,
                                180,
                                365
                              ].map((days) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectItem,
                                {
                                  value: days.toString(),
                                  children: days === 365 ? rtf.format(
                                    1,
                                    "year"
                                  ) : rtf.format(
                                    days,
                                    "day"
                                  )
                                },
                                days
                              ))
                            ] })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                    ] })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.outlineButton
                    ),
                    disabled: isSubmitting,
                    children: localization.CANCEL
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    variant: "default",
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.primaryButton
                    ),
                    disabled: isSubmitting,
                    children: [
                      isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                      localization.CREATE_API_KEY
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  ) });
}
function ApiKeysCard({
  className,
  classNames,
  localization,
  organizationId,
  ...props
}) {
  const {
    hooks: { useListApiKeys },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: apiKeysRes, isPending, refetch } = useListApiKeys();
  const filteredApiKeys = reactExports.useMemo(() => {
    var _a;
    return (_a = apiKeysRes == null ? void 0 : apiKeysRes.apiKeys) == null ? void 0 : _a.filter(
      (apiKey) => {
        var _a2;
        return organizationId === ((_a2 = apiKey.metadata) == null ? void 0 : _a2.organizationId);
      }
    );
  }, [apiKeysRes, organizationId]);
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  const [displayDialogOpen, setDisplayDialogOpen] = reactExports.useState(false);
  const [createdApiKey, setCreatedApiKey] = reactExports.useState("");
  const handleCreateApiKey = (apiKey) => {
    setCreatedApiKey(apiKey);
    setDisplayDialogOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.CREATE_API_KEY,
        description: localization.API_KEYS_DESCRIPTION,
        instructions: localization.API_KEYS_INSTRUCTIONS,
        isPending,
        title: localization.API_KEYS,
        action: () => setCreateDialogOpen(true),
        ...props,
        children: filteredApiKeys && filteredApiKeys.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardContent,
          {
            className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
            children: filteredApiKeys == null ? void 0 : filteredApiKeys.map((apiKey) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ApiKeyCell,
              {
                classNames,
                apiKey,
                localization,
                refetch
              },
              apiKey.id
            ))
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateApiKeyDialog,
      {
        classNames,
        localization,
        open: createDialogOpen,
        onOpenChange: setCreateDialogOpen,
        onSuccess: handleCreateApiKey,
        refetch,
        organizationId
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApiKeyDisplayDialog,
      {
        classNames,
        apiKey: createdApiKey,
        localization,
        open: displayDialogOpen,
        onOpenChange: setDisplayDialogOpen
      }
    )
  ] });
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      ),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function LeaveOrganizationDialog({
  organization,
  className,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    hooks: { useListOrganizations },
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganizations } = useListOrganizations();
  const [isLeaving, setIsLeaving] = reactExports.useState(false);
  const handleLeaveOrganization = async () => {
    setIsLeaving(true);
    try {
      await authClient.organization.leave({
        organizationId: organization.id,
        fetchOptions: { throw: true }
      });
      await (refetchOrganizations == null ? void 0 : refetchOrganizations());
      toast2({
        variant: "success",
        message: localization.LEAVE_ORGANIZATION_SUCCESS
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLeaving(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.LEAVE_ORGANIZATION
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.LEAVE_ORGANIZATION_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: cn(
              "my-2 flex-row p-4",
              className,
              classNames == null ? void 0 : classNames.cell
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrganizationCellView,
              {
                organization,
                localization
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isLeaving,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: handleLeaveOrganization,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isLeaving,
              children: [
                isLeaving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.LEAVE_ORGANIZATION
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
var AppleIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 32 32",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M9.438 31.401a7 7 0 0 1-1.656-1.536a20 20 0 0 1-1.422-1.938a18.9 18.9 0 0 1-2.375-4.849c-.667-2-.99-3.917-.99-5.792c0-2.094.453-3.922 1.339-5.458a7.7 7.7 0 0 1 2.797-2.906a7.45 7.45 0 0 1 3.786-1.12q.705.002 1.51.198c.385.109.854.281 1.427.495c.729.281 1.13.453 1.266.495c.427.156.786.224 1.068.224c.214 0 .516-.068.859-.172c.193-.068.557-.188 1.078-.411c.516-.188.922-.349 1.245-.469c.495-.146.974-.281 1.401-.349a6.7 6.7 0 0 1 1.531-.063a9 9 0 0 1 2.589.557c1.359.547 2.458 1.401 3.276 2.615a6.4 6.4 0 0 0-.969.734a8.2 8.2 0 0 0-1.641 2.005a6.8 6.8 0 0 0-.859 3.359c.021 1.443.391 2.714 1.12 3.813a7.2 7.2 0 0 0 2.047 2.047c.417.281.776.474 1.12.604c-.161.5-.333.984-.536 1.464a19 19 0 0 1-1.667 3.083c-.578.839-1.031 1.464-1.375 1.88c-.536.635-1.052 1.12-1.573 1.458c-.573.38-1.25.583-1.938.583a4.4 4.4 0 0 1-1.38-.167c-.385-.13-.766-.271-1.141-.432a9 9 0 0 0-1.203-.453a6.3 6.3 0 0 0-3.099-.005c-.417.12-.818.26-1.214.432c-.557.234-.927.391-1.141.458c-.427.125-.87.203-1.318.229c-.693 0-1.339-.198-1.979-.599zm9.14-24.615c-.906.453-1.771.646-2.63.583c-.135-.865 0-1.75.359-2.719a7.3 7.3 0 0 1 1.333-2.24A7.1 7.1 0 0 1 19.812.733q1.319-.68 2.521-.734c.104.906 0 1.797-.333 2.76a8 8 0 0 1-1.333 2.344a6.8 6.8 0 0 1-2.115 1.682z",
        fill: "currentColor"
      }
    )
  }
);
var DiscordIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 256 199",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M216.856 16.597A208.5 208.5 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046q-29.538-4.442-58.533 0c-1.832-4.4-4.55-9.933-6.846-14.046a207.8 207.8 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161 161 0 0 0 79.735 175.3a136.4 136.4 0 0 1-21.846-10.632a109 109 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a132 132 0 0 0 5.355 4.237a136 136 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848c21.142-6.58 42.646-16.637 64.815-33.213c5.316-56.288-9.08-105.09-38.056-148.36M85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2s23.236 11.804 23.015 26.2c.02 14.375-10.148 26.18-23.015 26.18m85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2c0 14.375-10.148 26.18-23.015 26.18",
        fill: "#5865f2"
      }
    )
  }
);
var DropboxIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 256 218",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M63.995 0L0 40.771l63.995 40.772L128 40.771zM192 0l-64 40.775l64 40.775l64.001-40.775zM0 122.321l63.995 40.772L128 122.321L63.995 81.55zM192 81.55l-64 40.775l64 40.774l64-40.774zM64 176.771l64.005 40.772L192 176.771L128.005 136z",
        fill: "#0061ff"
      }
    )
  }
);
var FacebookIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 256",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445",
          fill: "#1877f2"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z",
          fill: "#fff"
        }
      )
    ]
  }
);
var GitHubIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
        fill: "currentColor"
      }
    )
  }
);
var GitLabIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 236",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m128.075 236.075l47.104-144.97H80.97z", fill: "#e24329" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M128.075 236.074L80.97 91.104H14.956z", fill: "#fc6d26" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M14.956 91.104L.642 135.16a9.75 9.75 0 0 0 3.542 10.903l123.891 90.012z",
          fill: "#fca326"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M14.956 91.105H80.97L52.601 3.79c-1.46-4.493-7.816-4.492-9.275 0z",
          fill: "#e24329"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m128.075 236.074l47.104-144.97h66.015z", fill: "#fc6d26" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "m241.194 91.104l14.314 44.056a9.75 9.75 0 0 1-3.543 10.903l-123.89 90.012z",
          fill: "#fca326"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M241.194 91.105h-66.015l28.37-87.315c1.46-4.493 7.816-4.492 9.275 0z",
          fill: "#e24329"
        }
      )
    ]
  }
);
var GoogleIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 262",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027",
          fill: "#4285f4"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1",
          fill: "#34a853"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z",
          fill: "#fbbc05"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251",
          fill: "#eb4335"
        }
      )
    ]
  }
);
var HuggingFaceIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "currentColor",
        d: "M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378c0 1.112.178 2.181.503 3.185c.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284c.278.173.48.408.71.694c.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542c.01.026.653 1.552 1.657 2.54c.616.605 1.01 1.223 1.082 1.912c.055.537-.096 1.059-.38 1.572c.637.121 1.294.187 1.967.187c.657 0 1.298-.063 1.921-.178c-.287-.517-.44-1.041-.384-1.581c.07-.69.465-1.307 1.081-1.913c1.004-.987 1.647-2.513 1.657-2.539c.021-.074.083-.285.233-.542c.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952c.23-.286.432-.52.71-.694c.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174a1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094c-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71c-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013a1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921a.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164c1.607-.007 2.984-1.155 3.572-1.164c.196-.003.305.12.305.454c0 .886-.424 2.328-1.563 3.202c-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026l-.01.008l-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116a1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243a1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444c-.034-.016-.104-.008-.2.022q-.094.03-.216.087q-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096a3 3 0 0 0-.26.219a2 2 0 0 0-.12.121a2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203c0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194c-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858s-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64c-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647s2.822 2.813 2.562 3.244s-1.176-.506-1.176-.506s-2.866-2.567-3.49-1.898s.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405c-.238.839-2.71-1.587-3.216-.642c-.506.946 3.49 2.056 3.522 2.064c1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194c1.13-1.112 1.789-2.738 1.789-2.738s.246-.945.806-.858s.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64c.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647s-2.822 2.813-2.562 3.244s1.176-.506 1.176-.506s2.866-2.567 3.49-1.898s-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405c.238.839 2.71-1.587 3.216-.642c.506.946-3.49 2.056-3.522 2.064c-1.29.33-4.568 1.028-5.713-.624"
      }
    )
  }
);
var KickIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "currentColor",
        d: "M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z"
      }
    )
  }
);
var LinearIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "currentColor",
        d: "M2.886 4.18A11.98 11.98 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556q-.787.496-1.65.866L.951 7.277q.371-.863.866-1.65ZM.322 9.163l14.515 14.515q-1.066.26-2.195.322L0 11.358a12 12 0 0 1 .322-2.195m-.17 4.862l9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"
      }
    )
  }
);
var LinkedInIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 128 128",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3",
          fill: "#0076b2"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z",
          fill: "#fff"
        }
      )
    ]
  }
);
var MicrosoftIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 256",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M121.666 121.666H0V0h121.666z", fill: "#f1511b" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M256 121.666H134.335V0H256z", fill: "#80cc28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M121.663 256.002H0V134.336h121.663z", fill: "#00adef" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M256 256.002H134.335V134.336H256z", fill: "#fbbc09" })
    ]
  }
);
var NotionIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "currentColor",
        d: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514c-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233l4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632"
      }
    )
  }
);
var RedditIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 256",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "128", cy: "128", fill: "#ff4500", r: "128" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M213.15 129.22c0-10.376-8.391-18.617-18.617-18.617a18.74 18.74 0 0 0-12.97 5.189c-12.818-9.157-30.368-15.107-49.9-15.87l8.544-39.981l27.773 5.95c.307 7.02 6.104 12.667 13.278 12.667c7.324 0 13.275-5.95 13.275-13.278c0-7.324-5.95-13.275-13.275-13.275c-5.188 0-9.768 3.052-11.904 7.478l-30.976-6.562c-.916-.154-1.832 0-2.443.458c-.763.458-1.22 1.22-1.371 2.136l-9.464 44.558c-19.837.612-37.692 6.562-50.662 15.872a18.74 18.74 0 0 0-12.971-5.188c-10.377 0-18.617 8.391-18.617 18.617c0 7.629 4.577 14.037 10.988 16.939a33.6 33.6 0 0 0-.458 5.646c0 28.686 33.42 52.036 74.621 52.036c41.202 0 74.622-23.196 74.622-52.036a35 35 0 0 0-.458-5.646c6.408-2.902 10.985-9.464 10.985-17.093M85.272 142.495c0-7.324 5.95-13.275 13.278-13.275c7.324 0 13.275 5.95 13.275 13.275s-5.95 13.278-13.275 13.278c-7.327.15-13.278-5.953-13.278-13.278m74.317 35.251c-9.156 9.157-26.553 9.768-31.588 9.768c-5.188 0-22.584-.765-31.59-9.768c-1.371-1.373-1.371-3.51 0-4.883c1.374-1.371 3.51-1.371 4.884 0c5.8 5.8 18.008 7.782 26.706 7.782s21.058-1.983 26.704-7.782c1.374-1.371 3.51-1.371 4.884 0c1.22 1.373 1.22 3.51 0 4.883m-2.443-21.822c-7.325 0-13.275-5.95-13.275-13.275s5.95-13.275 13.275-13.275c7.327 0 13.277 5.95 13.277 13.275c0 7.17-5.95 13.275-13.277 13.275",
          fill: "#fff"
        }
      )
    ]
  }
);
var RobloxIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M18.926 23.998L0 18.892L5.075.002L24 5.108ZM15.348 10.09l-5.282-1.453l-1.414 5.273l5.282 1.453z",
        fill: "currentColor"
      }
    )
  }
);
var SlackIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "currentColor",
        d: "M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2zm2-8a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2zm8 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2a2 2 0 0 1 2 2zm-2 8a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2z"
      }
    )
  }
);
var SpotifyIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 256 256",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z",
        fill: "#1ed760"
      }
    )
  }
);
var TikTokIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    viewBox: "0 0 256 290",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M189.72 104.421c18.678 13.345 41.56 21.197 66.273 21.197v-47.53a67 67 0 0 1-13.918-1.456v37.413c-24.711 0-47.59-7.851-66.272-21.195v96.996c0 48.523-39.356 87.855-87.9 87.855c-18.113 0-34.949-5.473-48.934-14.86c15.962 16.313 38.222 26.432 62.848 26.432c48.548 0 87.905-39.332 87.905-87.857v-96.995zm17.17-47.952c-9.546-10.423-15.814-23.893-17.17-38.785v-6.113h-13.189c3.32 18.927 14.644 35.097 30.358 44.898M69.673 225.607a40 40 0 0 1-8.203-24.33c0-22.192 18.001-40.186 40.21-40.186a40.3 40.3 0 0 1 12.197 1.883v-48.593c-4.61-.631-9.262-.9-13.912-.801v37.822a40.3 40.3 0 0 0-12.203-1.882c-22.208 0-40.208 17.992-40.208 40.187c0 15.694 8.997 29.281 22.119 35.9",
          fill: "#ff004f"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M175.803 92.849c18.683 13.344 41.56 21.195 66.272 21.195V76.631c-13.794-2.937-26.005-10.141-35.186-20.162c-15.715-9.802-27.038-25.972-30.358-44.898h-34.643v189.843c-.079 22.132-18.049 40.052-40.21 40.052c-13.058 0-24.66-6.221-32.007-15.86c-13.12-6.618-22.118-20.206-22.118-35.898c0-22.193 18-40.187 40.208-40.187c4.255 0 8.356.662 12.203 1.882v-37.822c-47.692.985-86.047 39.933-86.047 87.834c0 23.912 9.551 45.589 25.053 61.428c13.985 9.385 30.82 14.86 48.934 14.86c48.545 0 87.9-39.335 87.9-87.857z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M242.075 76.63V66.516a66.3 66.3 0 0 1-35.186-10.047a66.47 66.47 0 0 0 35.186 20.163M176.53 11.57a68 68 0 0 1-.728-5.457V0h-47.834v189.845c-.076 22.13-18.046 40.05-40.208 40.05a40.06 40.06 0 0 1-18.09-4.287c7.347 9.637 18.949 15.857 32.007 15.857c22.16 0 40.132-17.918 40.21-40.05V11.571zM99.966 113.58v-10.769a89 89 0 0 0-12.061-.818C39.355 101.993 0 141.327 0 189.845c0 30.419 15.467 57.227 38.971 72.996c-15.502-15.838-25.053-37.516-25.053-61.427c0-47.9 38.354-86.848 86.048-87.833",
          fill: "#00f2ea"
        }
      )
    ]
  }
);
var TwitchIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "svg",
  {
    className,
    version: "1.1",
    viewBox: "0 0 2400 2800",
    x: "0px",
    xmlSpace: "preserve",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    y: "0px",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { type: "text/css", children: `
                .st0{fill:#FFFFFF}
                .st1{fill:#9146FF}
            ` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Asset 2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            className: "st0",
            points: "2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              className: "st1",
              d: "M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600V1300z"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              className: "st1",
              height: "600",
              width: "200",
              x: "1700",
              y: "550"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              className: "st1",
              height: "600",
              width: "200",
              x: "1150",
              y: "550"
            }
          )
        ] }) })
      ] })
    ]
  }
);
var VercelIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    "data-testid": "geist-icon",
    height: "16",
    "stroke-linejoin": "round",
    viewBox: "0 0 16 16",
    width: "16",
    className,
    style: { color: "currentcolor" },
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M8 1L16 15H0L8 1Z",
        fill: "currentColor"
      }
    )
  }
);
var VKIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 576 512",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7c0 0-30 73.1-72.4 120.5c-13.7 13.7-20 18.1-27.5 18.1c-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5c0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5c-20 0-68.6-73.4-97.4-157.4c-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7c0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9c0-66.8-3.4-73.1 15.4-73.1c8.7 0 23.7 4.4 58.7 38.1c40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25c-11.2-34.9-86.9-106.7-90.3-111.5c-8.7-11.2-6.2-16.2 0-26.2c.1-.1 72-101.3 79.4-135.6",
        fill: "currentColor"
      }
    )
  }
);
var XIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z",
        fill: "currentColor"
      }
    )
  }
);
var ZoomIcon = ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    className,
    xmlns: "http://www.w3.org/2000/svg",
    width: 512,
    height: 117,
    viewBox: "0 0 512 117",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "#0b5cff",
        d: "M107.472 114.706H16.348c-5.968 0-11.791-3.203-14.557-8.589C-1.41 99.858-.247 92.434 4.702 87.63L68.17 24.164H22.607C10.088 24.164.044 13.974.044 1.6h83.992c5.968 0 11.79 3.203 14.556 8.589c3.203 6.259 2.038 13.683-2.911 18.486L32.214 92.143h52.55c12.518 0 22.708 10.19 22.708 22.563M468.183 0c-13.1 0-24.746 5.677-32.898 14.702C427.134 5.677 415.488 0 402.388 0c-24.164 0-43.961 20.67-43.961 44.834v69.872c12.518 0 22.562-10.19 22.562-22.563V44.689c0-11.646 9.025-21.544 20.67-21.98c12.228-.437 22.272 9.315 22.272 21.397v48.037c0 12.519 10.19 22.563 22.563 22.563V44.543c0-11.645 9.025-21.544 20.67-21.98c12.228-.437 22.272 9.316 22.272 21.398v48.036c0 12.52 10.19 22.563 22.563 22.563V44.69C512.144 20.67 492.347 0 468.183 0M221.595 58.226c0 32.17-26.056 58.226-58.226 58.226s-58.226-26.056-58.226-58.226S131.199 0 163.369 0s58.226 26.056 58.226 58.226m-22.563 0c0-19.651-16.012-35.663-35.663-35.663s-35.664 16.012-35.664 35.663c0 19.652 16.013 35.664 35.664 35.664s35.663-16.012 35.663-35.664m148.04 0c0 32.17-26.056 58.226-58.226 58.226S230.62 90.396 230.62 58.226S256.676 0 288.846 0s58.227 26.056 58.227 58.226m-22.562 0c0-19.651-16.012-35.663-35.664-35.663c-19.65 0-35.663 16.012-35.663 35.663c0 19.652 16.012 35.664 35.663 35.664c19.652 0 35.664-16.012 35.664-35.664"
      }
    )
  }
);
var socialProviders = [
  {
    provider: "apple",
    name: "Apple",
    icon: AppleIcon
  },
  {
    provider: "discord",
    name: "Discord",
    icon: DiscordIcon
  },
  {
    provider: "dropbox",
    name: "Dropbox",
    icon: DropboxIcon
  },
  {
    provider: "facebook",
    name: "Facebook",
    icon: FacebookIcon
  },
  {
    provider: "github",
    name: "GitHub",
    icon: GitHubIcon
  },
  {
    provider: "gitlab",
    name: "GitLab",
    icon: GitLabIcon
  },
  {
    provider: "google",
    name: "Google",
    icon: GoogleIcon
  },
  {
    provider: "huggingface",
    name: "Hugging Face",
    icon: HuggingFaceIcon
  },
  {
    provider: "kick",
    name: "Kick",
    icon: KickIcon
  },
  {
    provider: "linear",
    name: "Linear",
    icon: LinearIcon
  },
  {
    provider: "linkedin",
    name: "LinkedIn",
    icon: LinkedInIcon
  },
  {
    provider: "microsoft",
    name: "Microsoft",
    icon: MicrosoftIcon
  },
  {
    provider: "notion",
    name: "Notion",
    icon: NotionIcon
  },
  {
    provider: "reddit",
    name: "Reddit",
    icon: RedditIcon
  },
  {
    provider: "roblox",
    name: "Roblox",
    icon: RobloxIcon
  },
  {
    provider: "slack",
    name: "Slack",
    icon: SlackIcon
  },
  {
    provider: "spotify",
    name: "Spotify",
    icon: SpotifyIcon
  },
  {
    provider: "tiktok",
    name: "TikTok",
    icon: TikTokIcon
  },
  {
    provider: "twitch",
    name: "Twitch",
    icon: TwitchIcon
  },
  {
    provider: "vercel",
    name: "Vercel",
    icon: VercelIcon
  },
  {
    provider: "vk",
    name: "VK",
    icon: VKIcon
  },
  {
    provider: "twitter",
    name: "X",
    icon: XIcon
  },
  {
    provider: "zoom",
    name: "Zoom",
    icon: ZoomIcon
  }
];
function PasswordInput({
  className,
  enableToggle,
  onChange,
  ...props
}) {
  const [disabled, setDisabled] = reactExports.useState(true);
  const [isVisible, setIsVisible] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        className: cn(enableToggle && "pr-10", className),
        ...props,
        type: isVisible && enableToggle ? "text" : "password",
        onChange: (event) => {
          setDisabled(!event.target.value);
          onChange == null ? void 0 : onChange(event);
        }
      }
    ),
    enableToggle && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "!bg-transparent absolute top-0 right-0",
          disabled,
          size: "icon",
          type: "button",
          variant: "ghost",
          onClick: () => setIsVisible(!isVisible),
          children: isVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, {})
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                        .hide-password-toggle::-ms-reveal,
                        .hide-password-toggle::-ms-clear {
                            visibility: hidden;
                            pointer-events: none;
                            display: none;
                        }
                    ` })
    ] })
  ] });
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
var DEFAULT_CAPTCHA_ENDPOINTS = [
  "/sign-up/email",
  "/sign-in/email",
  "/forget-password"
];
var sanitizeActionName = (action) => {
  let result = action.startsWith("/") ? action.substring(1) : action;
  result = result.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/\/([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/\//g, "").replace(/[^A-Za-z0-9_]/g, "");
  return result;
};
function useCaptcha({
  localization
}) {
  const { captcha, localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const captchaRef = reactExports.useRef(null);
  const { executeRecaptcha } = useReCaptcha();
  const executeCaptcha = async (action) => {
    if (!captcha) throw new Error(localization.MISSING_RESPONSE);
    let response;
    switch (captcha.provider) {
      case "google-recaptcha-v3": {
        const sanitizedAction = sanitizeActionName(action);
        response = await (executeRecaptcha == null ? void 0 : executeRecaptcha(sanitizedAction));
        break;
      }
      case "google-recaptcha-v2-checkbox": {
        const recaptchaRef = captchaRef;
        response = recaptchaRef.current.getValue();
        break;
      }
      case "google-recaptcha-v2-invisible": {
        const recaptchaRef = captchaRef;
        response = await recaptchaRef.current.executeAsync();
        break;
      }
      case "cloudflare-turnstile": {
        const turnstileRef = captchaRef;
        response = turnstileRef.current.getResponse();
        break;
      }
      case "hcaptcha": {
        const hcaptchaRef = captchaRef;
        response = hcaptchaRef.current.getResponse();
        break;
      }
      case "captchafox": {
        const captchafoxRef = captchaRef;
        response = captchafoxRef.current.getResponse();
        break;
      }
    }
    if (!response) {
      throw new Error(localization.MISSING_RESPONSE);
    }
    return response;
  };
  const getCaptchaHeaders = async (action) => {
    if (!captcha) return void 0;
    const endpoints = captcha.endpoints || DEFAULT_CAPTCHA_ENDPOINTS;
    if (endpoints.includes(action)) {
      return { "x-captcha-response": await executeCaptcha(action) };
    }
    return void 0;
  };
  const resetCaptcha = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!captcha) return;
    switch (captcha.provider) {
      case "google-recaptcha-v3": {
        break;
      }
      case "google-recaptcha-v2-checkbox":
      case "google-recaptcha-v2-invisible": {
        const recaptchaRef = captchaRef;
        (_b = (_a = recaptchaRef.current) == null ? void 0 : _a.reset) == null ? void 0 : _b.call(_a);
        break;
      }
      case "cloudflare-turnstile": {
        const turnstileRef = captchaRef;
        (_d = (_c = turnstileRef.current) == null ? void 0 : _c.reset) == null ? void 0 : _d.call(_c);
        break;
      }
      case "hcaptcha": {
        const hcaptchaRef = captchaRef;
        (_f = (_e = hcaptchaRef.current) == null ? void 0 : _e.resetCaptcha) == null ? void 0 : _f.call(_e);
        break;
      }
      case "captchafox": {
        const captchafoxRef = captchaRef;
        (_h = (_g = captchafoxRef.current) == null ? void 0 : _g.reset) == null ? void 0 : _h.call(_g);
        break;
      }
    }
  };
  return {
    captchaRef,
    getCaptchaHeaders,
    resetCaptcha
  };
}
function RecaptchaBadge({
  className,
  localization: propLocalization
}) {
  const isHydrated = useIsHydrated();
  const { captcha, localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...propLocalization };
  if (!captcha) return null;
  if (!captcha.hideBadge) {
    return isHydrated ? /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .grecaptcha-badge { visibility: visible !important; }
            ` }) : null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .grecaptcha-badge { visibility: hidden; }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("text-muted-foreground text-xs", className), children: [
      localization.PROTECTED_BY_RECAPTCHA,
      " ",
      localization.BY_CONTINUING_YOU_AGREE,
      " Google",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          className: "text-foreground hover:underline",
          href: "https://policies.google.com/privacy",
          target: "_blank",
          rel: "noreferrer",
          children: localization.PRIVACY_POLICY
        }
      ),
      " ",
      "&",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          className: "text-foreground hover:underline",
          href: "https://policies.google.com/terms",
          target: "_blank",
          rel: "noreferrer",
          children: localization.TERMS_OF_SERVICE
        }
      ),
      "."
    ] })
  ] });
}
function RecaptchaV2({ ref }) {
  const { captcha } = reactExports.useContext(AuthUIContext);
  const { theme } = useTheme();
  const { lang } = useLang();
  reactExports.useEffect(() => {
    window.recaptchaOptions = {
      useRecaptchaNet: captcha == null ? void 0 : captcha.recaptchaNet,
      enterprise: captcha == null ? void 0 : captcha.enterprise
    };
  }, [captcha]);
  if (!captcha) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                .grecaptcha-badge {
                    border-radius: var(--radius) !important;
                    --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, #0000000d);
                    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) !important;
                    border-style: var(--tw-border-style) !important;
                    border-width: 1px;
                }

                .dark .grecaptcha-badge {
                    border-color: var(--input) !important;
                }
            ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecaptchaWrapper,
      {
        ref,
        sitekey: captcha.siteKey,
        theme,
        hl: lang,
        size: captcha.provider === "google-recaptcha-v2-invisible" ? "invisible" : "normal",
        className: cn(
          captcha.provider === "google-recaptcha-v2-invisible" ? "absolute" : "mx-auto h-[76px] w-[302px] overflow-hidden rounded bg-muted"
        )
      },
      `${theme}-${lang}-${captcha.provider}`
    )
  ] });
}
var DEFAULT_CAPTCHA_ENDPOINTS2 = [
  "/sign-up/email",
  "/sign-in/email",
  "/forget-password"
];
function Captcha({ ref, localization, action }) {
  const { captcha } = reactExports.useContext(AuthUIContext);
  if (!captcha) return null;
  if (action) {
    const endpoints = captcha.endpoints || DEFAULT_CAPTCHA_ENDPOINTS2;
    if (!endpoints.includes(action)) {
      return null;
    }
  }
  const { theme } = useTheme();
  const showRecaptchaV2 = captcha.provider === "google-recaptcha-v2-checkbox" || captcha.provider === "google-recaptcha-v2-invisible";
  const showRecaptchaBadge = captcha.provider === "google-recaptcha-v3" || captcha.provider === "google-recaptcha-v2-invisible";
  const showTurnstile = captcha.provider === "cloudflare-turnstile";
  const showHCaptcha = captcha.provider === "hcaptcha";
  const showCaptchaFox = captcha.provider === "captchafox";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showRecaptchaV2 && /* @__PURE__ */ jsxRuntimeExports.jsx(RecaptchaV2, { ref }),
    showRecaptchaBadge && /* @__PURE__ */ jsxRuntimeExports.jsx(RecaptchaBadge, { localization }),
    showTurnstile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      S,
      {
        className: "mx-auto",
        ref,
        siteKey: captcha.siteKey,
        options: {
          theme,
          size: "flexible"
        }
      }
    ),
    showHCaptcha && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      re,
      {
        ref,
        sitekey: captcha.siteKey,
        theme
      }
    ) }),
    showCaptchaFox && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CaptchaFox,
      {
        ref,
        sitekey: captcha.siteKey,
        theme
      }
    ) })
  ] });
}
function CreateOrganizationDialog({
  className,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    organization: organizationOptions,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const [logo, setLogo] = reactExports.useState(null);
  const [logoPending, setLogoPending] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const openFileDialog = () => {
    var _a2;
    return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  };
  const formSchema = object({
    logo: string().optional(),
    name: string().min(1, {
      message: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`
    }),
    slug: string().min(1, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`
    }).regex(/^[a-z0-9-]+$/, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      logo: "",
      name: "",
      slug: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  const handleLogoChange = async (file) => {
    if (!(organizationOptions == null ? void 0 : organizationOptions.logo)) return;
    setLogoPending(true);
    try {
      const resizedFile = await resizeAndCropImage(
        file,
        crypto.randomUUID(),
        organizationOptions.logo.size,
        organizationOptions.logo.extension
      );
      let image;
      if (organizationOptions == null ? void 0 : organizationOptions.logo.upload) {
        image = await organizationOptions.logo.upload(resizedFile);
      } else {
        image = await fileToBase64(resizedFile);
      }
      setLogo(image || null);
      form.setValue("logo", image || "");
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLogoPending(false);
  };
  const deleteLogo = async () => {
    var _a2;
    setLogoPending(true);
    const currentUrl = logo || void 0;
    if (currentUrl && ((_a2 = organizationOptions == null ? void 0 : organizationOptions.logo) == null ? void 0 : _a2.delete)) {
      await organizationOptions.logo.delete(currentUrl);
    }
    setLogo(null);
    form.setValue("logo", "");
    setLogoPending(false);
  };
  async function onSubmit({ name, slug, logo: logo2 }) {
    try {
      const organization = await authClient.organization.create({
        name,
        slug,
        logo: logo2,
        fetchOptions: { throw: true }
      });
      if ((organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug") {
        navigate(`${organizationOptions.basePath}/${organization.slug}`);
        return;
      }
      await authClient.organization.setActive({
        organizationId: organization.id
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      setLogo(null);
      toast2({
        variant: "success",
        message: localization.CREATE_ORGANIZATION_SUCCESS
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogTitle,
        {
          className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
          children: localization.CREATE_ORGANIZATION
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.ORGANIZATIONS_INSTRUCTIONS
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        method: "POST",
        onSubmit: form.handleSubmit(onSubmit),
        className: "space-y-6",
        children: [
          (organizationOptions == null ? void 0 : organizationOptions.logo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "logo",
              render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    accept: "image/*",
                    disabled: logoPending,
                    hidden: true,
                    type: "file",
                    onChange: (e) => {
                      var _a2;
                      const file = (_a2 = e.target.files) == null ? void 0 : _a2.item(0);
                      if (file) handleLogoChange(file);
                      e.target.value = "";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.LOGO }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        className: "size-fit rounded-full",
                        size: "icon",
                        type: "button",
                        variant: "ghost",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          OrganizationLogo,
                          {
                            className: "size-16",
                            isPending: logoPending,
                            localization,
                            organization: {
                              name: form.watch(
                                "name"
                              ),
                              logo
                            }
                          }
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuContent,
                      {
                        align: "start",
                        onCloseAutoFocus: (e) => e.preventDefault(),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: openFileDialog,
                              disabled: logoPending,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, {}),
                                localization.UPLOAD_LOGO
                              ]
                            }
                          ),
                          logo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: deleteLogo,
                              disabled: logoPending,
                              variant: "destructive",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {}),
                                localization.DELETE_LOGO
                              ]
                            }
                          )
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      disabled: logoPending,
                      variant: "outline",
                      onClick: openFileDialog,
                      type: "button",
                      children: [
                        logoPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                        localization.UPLOAD
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.ORGANIZATION_NAME }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: localization.ORGANIZATION_NAME_PLACEHOLDER,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.ORGANIZATION_SLUG }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: localization.ORGANIZATION_SLUG_PLACEHOLDER,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                children: localization.CANCEL
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                disabled: isSubmitting,
                children: [
                  isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                  localization.CREATE_ORGANIZATION
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function OrganizationCell({
  className,
  classNames,
  organization,
  localization: localizationProp
}) {
  var _a;
  const {
    authClient,
    localization: contextLocalization,
    organization: organizationOptions,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { pathMode } = organizationOptions || {};
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = reactExports.useState(false);
  const [isManagingOrganization, setIsManagingOrganization] = reactExports.useState(false);
  const handleManageOrganization = reactExports.useCallback(async () => {
    var _a2;
    setIsManagingOrganization(true);
    if (pathMode === "slug") {
      navigate(
        `${organizationOptions == null ? void 0 : organizationOptions.basePath}/${organization.slug}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths.SETTINGS}`
      );
      return;
    }
    try {
      await authClient.organization.setActive({
        organizationId: organization.id,
        fetchOptions: {
          throw: true
        }
      });
      navigate(
        `${organizationOptions == null ? void 0 : organizationOptions.basePath}/${(_a2 = organizationOptions == null ? void 0 : organizationOptions.viewPaths) == null ? void 0 : _a2.SETTINGS}`
      );
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsManagingOrganization(false);
    }
  }, [
    authClient,
    organization.id,
    organizationOptions == null ? void 0 : organizationOptions.basePath,
    (_a = organizationOptions == null ? void 0 : organizationOptions.viewPaths) == null ? void 0 : _a.SETTINGS,
    organization.slug,
    pathMode,
    navigate,
    toast2,
    localization,
    localizeErrors
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex-row p-4", className, classNames == null ? void 0 : classNames.cell), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OrganizationCellView,
        {
          organization,
          localization
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isManagingOrganization,
            size: "icon",
            type: "button",
            variant: "outline",
            children: isManagingOrganization ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: handleManageOrganization,
              disabled: isManagingOrganization,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: classNames == null ? void 0 : classNames.icon }),
                localization.MANAGE_ORGANIZATION
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: () => setIsLeaveDialogOpen(true),
              variant: "destructive",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: classNames == null ? void 0 : classNames.icon }),
                localization.LEAVE_ORGANIZATION
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LeaveOrganizationDialog,
      {
        open: isLeaveDialogOpen,
        onOpenChange: setIsLeaveDialogOpen,
        organization,
        localization
      }
    )
  ] });
}
function OrganizationsCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useListOrganizations },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const isHydrated = useIsHydrated();
  const { data: organizations, isPending: organizationsPending } = useListOrganizations();
  const isPending = !isHydrated || organizationsPending;
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.ORGANIZATIONS,
        description: localization.ORGANIZATIONS_DESCRIPTION,
        instructions: localization.ORGANIZATIONS_INSTRUCTIONS,
        actionLabel: localization.CREATE_ORGANIZATION,
        action: () => setCreateDialogOpen(true),
        isPending,
        ...props,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: [
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsCellSkeleton, {}),
          organizations == null ? void 0 : organizations.map((organization) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrganizationCell,
            {
              classNames,
              organization,
              localization
            },
            organization.id
          ))
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateOrganizationDialog,
      {
        classNames,
        localization,
        open: createDialogOpen,
        onOpenChange: setCreateDialogOpen
      }
    )
  ] });
}
function UserInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}) {
  const {
    hooks: { useListUserInvitations, useListOrganizations },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: invitations, refetch: refetchInvitations } = useListUserInvitations();
  const { refetch: refetchOrganizations } = useListOrganizations();
  const handleRefresh = async () => {
    await (refetchInvitations == null ? void 0 : refetchInvitations());
    await (refetchOrganizations == null ? void 0 : refetchOrganizations());
  };
  const pendingInvitations = invitations == null ? void 0 : invitations.filter(
    (invitation) => invitation.status === "pending"
  );
  if (!(pendingInvitations == null ? void 0 : pendingInvitations.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PENDING_INVITATIONS,
      description: localization.PENDING_USER_INVITATIONS_DESCRIPTION || localization.PENDING_INVITATIONS_DESCRIPTION,
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: pendingInvitations.map((invitation) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserInvitationRow,
        {
          classNames,
          invitation: {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            expiresAt: invitation.expiresAt
          },
          onChanged: handleRefresh
        },
        invitation.id
      )) })
    }
  );
}
function UserInvitationRow({
  classNames,
  invitation,
  onChanged
}) {
  const {
    authClient,
    organization: organizationOptions,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = contextLocalization;
  const { lang } = useLang();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === invitation.role);
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (onChanged == null ? void 0 : onChanged());
      toast2({
        variant: "success",
        message: localization.INVITATION_ACCEPTED
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  const handleReject = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (onChanged == null ? void 0 : onChanged());
      toast2({
        variant: "success",
        message: localization.INVITATION_REJECTED
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex-row items-center p-4", classNames == null ? void 0 : classNames.cell), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserAvatar,
        {
          className: "my-0.5",
          user: { email: invitation.email },
          localization
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 text-left leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: invitation.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate text-muted-foreground text-xs", children: [
          localization.EXPIRES,
          " ",
          invitation.expiresAt.toLocaleDateString(lang ?? "en")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm opacity-70", children: role == null ? void 0 : role.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: cn(
            "relative ms-auto",
            classNames == null ? void 0 : classNames.button,
            classNames == null ? void 0 : classNames.outlineButton
          ),
          disabled: isLoading,
          size: "icon",
          type: "button",
          variant: "outline",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DropdownMenuContent,
        {
          onCloseAutoFocus: (e) => e.preventDefault(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                onClick: handleAccept,
                disabled: isLoading,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: classNames == null ? void 0 : classNames.icon }),
                  localization.ACCEPT
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuItem,
              {
                onClick: handleReject,
                disabled: isLoading,
                variant: "destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: classNames == null ? void 0 : classNames.icon }),
                  localization.REJECT
                ]
              }
            )
          ]
        }
      )
    ] }) })
  ] });
}
function AccountCell({
  className,
  classNames,
  deviceSession,
  localization,
  refetch
}) {
  const {
    basePath,
    localization: contextLocalization,
    hooks: { useSession },
    mutators: { revokeDeviceSession, setActiveSession },
    toast: toast2,
    viewPaths,
    navigate,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      await revokeDeviceSession({
        sessionToken: deviceSession.session.token
      });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      setIsLoading(false);
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  const handleSetActiveSession = async () => {
    setIsLoading(true);
    try {
      await setActiveSession({
        sessionToken: deviceSession.session.token
      });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  const isCurrentSession = deviceSession.session.id === (sessionData == null ? void 0 : sessionData.session.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex-row p-4", className, classNames == null ? void 0 : classNames.cell), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UserView, { user: deviceSession.user, localization }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: cn(
            "relative ms-auto",
            classNames == null ? void 0 : classNames.button,
            classNames == null ? void 0 : classNames.outlineButton
          ),
          disabled: isLoading,
          size: "icon",
          type: "button",
          variant: "outline",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { children: [
        !isCurrentSession && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: handleSetActiveSession, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: classNames == null ? void 0 : classNames.icon }),
          localization.SWITCH_ACCOUNT
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            onClick: () => {
              if (isCurrentSession) {
                navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
                return;
              }
              handleRevoke();
            },
            variant: "destructive",
            children: [
              isCurrentSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: classNames == null ? void 0 : classNames.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserRoundX, { className: classNames == null ? void 0 : classNames.icon }),
              isCurrentSession ? localization.SIGN_OUT : localization.REVOKE
            ]
          }
        )
      ] })
    ] })
  ] });
}
function AccountsCard({
  className,
  classNames,
  localization
}) {
  const {
    basePath,
    hooks: { useListDeviceSessions, useSession },
    localization: contextLocalization,
    viewPaths,
    navigate
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: deviceSessions, isPending, refetch } = useListDeviceSessions();
  const { data: sessionData } = useSession();
  const otherDeviceSessions = (deviceSessions || []).filter(
    (ds) => ds.session.id !== (sessionData == null ? void 0 : sessionData.session.id)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.ACCOUNTS,
      description: localization.ACCOUNTS_DESCRIPTION,
      actionLabel: localization.ADD_ACCOUNT,
      instructions: localization.ACCOUNTS_INSTRUCTIONS,
      isPending,
      action: () => navigate(`${basePath}/${viewPaths.SIGN_IN}`),
      children: (deviceSessions == null ? void 0 : deviceSessions.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: [
        sessionData && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AccountCell,
          {
            classNames,
            deviceSession: sessionData,
            localization,
            refetch
          }
        ),
        otherDeviceSessions.map((deviceSession) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          AccountCell,
          {
            classNames,
            deviceSession,
            localization,
            refetch
          },
          deviceSession.session.id
        ))
      ] }) : null
    }
  );
}
function UpdateAvatarCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useSession },
    mutators: { updateUser },
    localization: authLocalization2,
    optimistic,
    avatar,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...authLocalization2, ...localization };
  const { data: sessionData, isPending, refetch } = useSession();
  const fileInputRef = reactExports.useRef(null);
  const [loading, setLoading] = reactExports.useState(false);
  const handleAvatarChange = async (file) => {
    if (!sessionData || !avatar) return;
    setLoading(true);
    const resizedFile = await resizeAndCropImage(
      file,
      crypto.randomUUID(),
      avatar.size,
      avatar.extension
    );
    let image;
    if (avatar.upload) {
      image = await avatar.upload(resizedFile);
    } else {
      image = await fileToBase64(resizedFile);
    }
    if (!image) {
      setLoading(false);
      return;
    }
    if (optimistic && !avatar.upload) setLoading(false);
    try {
      await updateUser({ image });
      await (refetch == null ? void 0 : refetch());
      if (avatar.upload && avatar.delete && sessionData.user.image) {
        try {
          await avatar.delete(sessionData.user.image);
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
        }
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const handleDeleteAvatar = async () => {
    if (!sessionData) return;
    setLoading(true);
    try {
      if (sessionData.user.image && (avatar == null ? void 0 : avatar.delete)) {
        await avatar.delete(sessionData.user.image);
      }
      await updateUser({ image: null });
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const openFileDialog = () => {
    var _a;
    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "w-full pb-0 text-start",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            accept: "image/*",
            disabled: loading,
            hidden: true,
            type: "file",
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a.item(0);
              if (file) handleAvatarChange(file);
              e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingsCardHeader,
            {
              className: "grow self-start",
              title: localization.AVATAR,
              description: localization.AVATAR_DESCRIPTION,
              isPending,
              classNames
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UserAvatar,
                  {
                    isPending: isPending || loading,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    user: sessionData == null ? void 0 : sessionData.user,
                    localization
                  },
                  sessionData == null ? void 0 : sessionData.user.image
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuContent,
              {
                align: "end",
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: openFileDialog,
                      disabled: loading,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, {}),
                        localization.UPLOAD_AVATAR
                      ]
                    }
                  ),
                  (sessionData == null ? void 0 : sessionData.user.image) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: handleDeleteAvatar,
                      disabled: loading,
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {}),
                        localization.DELETE_AVATAR
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCardFooter,
          {
            className: "!py-5",
            instructions: localization.AVATAR_INSTRUCTIONS,
            classNames,
            isPending,
            isSubmitting: loading
          }
        )
      ]
    }
  );
}
function UpdateFieldCard({
  className,
  classNames,
  description,
  instructions,
  localization: localizationProp,
  name,
  placeholder,
  required,
  label,
  type,
  multiline,
  value,
  validate,
  errorMessage,
  options,
  onUpdateComplete
}) {
  const {
    hooks: { useSession },
    mutators: { updateUser },
    localization: contextLocalization,
    optimistic,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { isPending } = useSession();
  let fieldSchema = unknown();
  if (type === "number") {
    fieldSchema = required ? preprocess(
      (val) => !val ? void 0 : Number(val),
      number({
        message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
      })
    ) : number$1({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    }).optional();
  } else if (type === "boolean") {
    fieldSchema = required ? boolean({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    }).refine((val) => val === true, {
      message: (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    }) : boolean({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    });
  } else if (type === "select") {
    fieldSchema = required ? string().min(
      1,
      (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    ) : string().optional();
  } else {
    fieldSchema = required ? string().min(
      1,
      (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    ) : string().optional();
  }
  const form = useForm({
    resolver: u(object({ [name]: fieldSchema })),
    values: { [name]: value || "" }
  });
  const { isSubmitting } = form.formState;
  const updateField = async (values) => {
    await new Promise((resolve) => setTimeout(resolve));
    const newValue = values[name];
    if (value === newValue) {
      toast2({
        variant: "error",
        message: `${label} ${localization.IS_THE_SAME}`
      });
      return;
    }
    if (validate && typeof newValue === "string" && !await validate(newValue)) {
      form.setError(name, {
        message: (errorMessage == null ? void 0 : errorMessage.validate) ?? (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
      });
      return;
    }
    try {
      await updateUser({ [name]: newValue });
      toast2({
        variant: "success",
        message: `${label} ${localization.UPDATED_SUCCESSFULLY}`
      });
      onUpdateComplete == null ? void 0 : onUpdateComplete();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { method: "POST", onSubmit: form.handleSubmit(updateField), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      description,
      instructions,
      isPending,
      title: label,
      actionLabel: localization.SAVE,
      optimistic,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: type === "boolean" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name,
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: field.value,
                onCheckedChange: field.onChange,
                disabled: isSubmitting,
                className: classNames == null ? void 0 : classNames.checkbox
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormLabel,
              {
                className: classNames == null ? void 0 : classNames.label,
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormMessage,
              {
                className: classNames == null ? void 0 : classNames.error
              }
            )
          ] })
        }
      ) : isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Skeleton,
        {
          className: cn(
            "h-9 w-full",
            classNames == null ? void 0 : classNames.skeleton
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name,
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: type === "select" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                onValueChange: field.onChange,
                value: field.value,
                disabled: isSubmitting,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: cn(
                        "w-full",
                        classNames == null ? void 0 : classNames.input
                      ),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectValue,
                        {
                          placeholder: placeholder || (typeof label === "string" ? label : "Select an option")
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: options == null ? void 0 : options.map(
                    (option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: option.value,
                        children: option.label
                      },
                      option.value
                    )
                  ) })
                ]
              }
            ) : type === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: classNames == null ? void 0 : classNames.input,
                type: "number",
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
              }
            ) : multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                className: classNames == null ? void 0 : classNames.input,
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: classNames == null ? void 0 : classNames.input,
                type: "text",
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormMessage,
              {
                className: classNames == null ? void 0 : classNames.error
              }
            )
          ] })
        }
      ) })
    }
  ) }) });
}
function UpdateNameCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useSession },
    localization: contextLocalization,
    nameRequired
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UpdateFieldCard,
    {
      className,
      classNames,
      value: sessionData == null ? void 0 : sessionData.user.name,
      description: localization.NAME_DESCRIPTION,
      name: "name",
      instructions: localization.NAME_INSTRUCTIONS,
      label: localization.NAME,
      localization,
      placeholder: localization.NAME_PLACEHOLDER,
      required: nameRequired,
      ...props
    }
  );
}
function UpdateUsernameCard({
  className,
  classNames,
  localization,
  ...props
}) {
  var _a, _b;
  const {
    hooks: { useSession },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const value = ((_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.displayUsername) || ((_b = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _b.username);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    UpdateFieldCard,
    {
      className,
      classNames,
      value,
      description: localization.USERNAME_DESCRIPTION,
      name: "username",
      instructions: localization.USERNAME_INSTRUCTIONS,
      label: localization.USERNAME,
      localization,
      placeholder: localization.USERNAME_PLACEHOLDER,
      required: true,
      ...props
    }
  );
}
function ChangeEmailCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    authClient,
    emailVerification,
    hooks: { useSession },
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, isPending, refetch } = useSession();
  const [resendDisabled, setResendDisabled] = reactExports.useState(false);
  const formSchema = object({
    email: string().email({ message: localization.INVALID_EMAIL })
  });
  const form = useForm({
    resolver: u(formSchema),
    values: {
      email: (sessionData == null ? void 0 : sessionData.user.email) || ""
    }
  });
  const resendForm = useForm();
  const { isSubmitting } = form.formState;
  const changeEmail = async ({ email }) => {
    if (email === (sessionData == null ? void 0 : sessionData.user.email)) {
      await new Promise((resolve) => setTimeout(resolve));
      toast2({
        variant: "error",
        message: localization.EMAIL_IS_THE_SAME
      });
      return;
    }
    try {
      await authClient.changeEmail({
        newEmail: email,
        callbackURL: window.location.pathname,
        fetchOptions: { throw: true }
      });
      if (sessionData == null ? void 0 : sessionData.user.emailVerified) {
        toast2({
          variant: "success",
          message: localization.EMAIL_VERIFY_CHANGE
        });
      } else {
        await (refetch == null ? void 0 : refetch());
        toast2({
          variant: "success",
          message: `${localization.EMAIL} ${localization.UPDATED_SUCCESSFULLY}`
        });
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  const resendVerification = async () => {
    if (!sessionData) return;
    const email = sessionData.user.email;
    setResendDisabled(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.EMAIL_VERIFY_CHANGE
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setResendDisabled(false);
      throw error;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "form",
      {
        method: "POST",
        noValidate: true,
        onSubmit: form.handleSubmit(changeEmail),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCard,
          {
            className,
            classNames,
            description: localization.EMAIL_DESCRIPTION,
            instructions: localization.EMAIL_INSTRUCTIONS,
            isPending,
            title: localization.EMAIL,
            actionLabel: localization.SAVE,
            ...props,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: cn(
                  "h-9 w-full",
                  classNames == null ? void 0 : classNames.skeleton
                )
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "email",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      placeholder: localization.EMAIL_PLACEHOLDER,
                      type: "email",
                      disabled: isSubmitting,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormMessage,
                    {
                      className: classNames == null ? void 0 : classNames.error
                    }
                  )
                ] })
              }
            ) })
          }
        )
      }
    ) }),
    emailVerification && (sessionData == null ? void 0 : sessionData.user) && !(sessionData == null ? void 0 : sessionData.user.emailVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...resendForm, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "form",
      {
        method: "POST",
        onSubmit: resendForm.handleSubmit(
          resendVerification
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCard,
          {
            className,
            classNames,
            title: localization.VERIFY_YOUR_EMAIL,
            description: localization.VERIFY_YOUR_EMAIL_DESCRIPTION,
            actionLabel: localization.RESEND_VERIFICATION_EMAIL,
            disabled: resendDisabled,
            ...props
          }
        )
      }
    ) })
  ] });
}
function AccountSettingsCards({
  className,
  classNames,
  localization
}) {
  var _a, _b, _c;
  const {
    additionalFields,
    avatar,
    changeEmail,
    credentials,
    hooks: { useSession },
    multiSession,
    account: accountOptions
  } = reactExports.useContext(AuthUIContext);
  const { data: sessionData } = useSession();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        ((_a = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _a.includes("image")) && avatar && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UpdateAvatarCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        (credentials == null ? void 0 : credentials.username) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UpdateUsernameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        ((_b = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _b.includes("name")) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UpdateNameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        changeEmail && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChangeEmailCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        (_c = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _c.map((field) => {
          if (field === "image") return null;
          if (field === "name") return null;
          const additionalField = additionalFields == null ? void 0 : additionalFields[field];
          if (!additionalField) return null;
          const {
            label,
            description,
            instructions,
            placeholder,
            required,
            type,
            multiline,
            validate,
            errorMessage
          } = additionalField;
          const defaultValue = sessionData == null ? void 0 : sessionData.user[field];
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            UpdateFieldCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              value: defaultValue,
              description,
              name: field,
              instructions,
              label,
              localization,
              placeholder,
              required,
              type,
              multiline,
              validate,
              errorMessage
            },
            field
          );
        }),
        multiSession && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AccountsCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        )
      ]
    }
  );
}
function DeleteAccountDialog({
  classNames,
  accounts,
  localization,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    basePath,
    baseURL,
    deleteUser,
    freshAge,
    hooks: { useSession },
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const user = sessionData == null ? void 0 : sessionData.user;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  const formSchema = object({
    password: credentialsLinked ? string().min(1, { message: localization.PASSWORD_REQUIRED }) : string().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      password: ""
    }
  });
  const { isSubmitting } = form.formState;
  const deleteAccount = async ({ password }) => {
    const params = {};
    if (credentialsLinked) {
      params.password = password;
    } else if (!isFresh) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }
    if (deleteUser == null ? void 0 : deleteUser.verification) {
      params.callbackURL = `${baseURL}${basePath}/${viewPaths.SIGN_OUT}`;
    }
    try {
      await authClient.deleteUser({
        ...params,
        fetchOptions: {
          throw: true
        }
      });
      if (deleteUser == null ? void 0 : deleteUser.verification) {
        toast2({
          variant: "success",
          message: localization.DELETE_ACCOUNT_VERIFY
        });
      } else {
        toast2({
          variant: "success",
          message: localization.DELETE_ACCOUNT_SUCCESS
        });
        navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    onOpenChange == null ? void 0 : onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: cn("sm:max-w-md", (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization == null ? void 0 : localization.DELETE_ACCOUNT
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: isFresh ? localization == null ? void 0 : localization.DELETE_ACCOUNT_INSTRUCTIONS : localization == null ? void 0 : localization.SESSION_NOT_FRESH
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn("my-2 flex-row p-4", classNames == null ? void 0 : classNames.cell), children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserView, { user, localization }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            method: "POST",
            onSubmit: form.handleSubmit(deleteAccount),
            className: "grid gap-6",
            children: [
              credentialsLinked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "password",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FormLabel,
                      {
                        className: classNames == null ? void 0 : classNames.label,
                        children: localization == null ? void 0 : localization.PASSWORD
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        autoComplete: "current-password",
                        placeholder: localization == null ? void 0 : localization.PASSWORD_PLACEHOLDER,
                        type: "password",
                        className: classNames == null ? void 0 : classNames.input,
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FormMessage,
                      {
                        className: classNames == null ? void 0 : classNames.error
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "secondary",
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.secondaryButton
                    ),
                    onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                    children: localization.CANCEL
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.destructiveButton
                    ),
                    disabled: isSubmitting,
                    variant: "destructive",
                    type: "submit",
                    children: [
                      isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                      isFresh ? localization == null ? void 0 : localization.DELETE_ACCOUNT : localization == null ? void 0 : localization.SIGN_OUT
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  ) });
}
function DeleteAccountCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook
}) {
  const {
    hooks: { useListAccounts },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [showDialog, setShowDialog] = reactExports.useState(false);
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ACCOUNT,
        description: localization == null ? void 0 : localization.DELETE_ACCOUNT_DESCRIPTION,
        isPending,
        title: localization == null ? void 0 : localization.DELETE_ACCOUNT,
        variant: "destructive",
        action: () => setShowDialog(true)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteAccountDialog,
      {
        classNames,
        accounts,
        localization,
        open: showDialog,
        onOpenChange: setShowDialog
      }
    )
  ] });
}
function SessionFreshnessDialog({
  classNames,
  localization,
  title,
  description,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    basePath,
    localization: contextLocalization,
    viewPaths,
    navigate
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const handleSignOut = () => {
    navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
    onOpenChange == null ? void 0 : onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: cn("sm:max-w-md", (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: title || (localization == null ? void 0 : localization.SESSION_EXPIRED) || "Session Expired"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: description || (localization == null ? void 0 : localization.SESSION_NOT_FRESH)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              variant: "default",
              onClick: handleSignOut,
              children: localization == null ? void 0 : localization.SIGN_OUT
            }
          )
        ] })
      ]
    }
  ) });
}
function PasskeyCell({
  className,
  classNames,
  localization,
  passkey
}) {
  const {
    freshAge,
    hooks: { useSession, useListPasskeys },
    localization: contextLocalization,
    mutators: { deletePasskey },
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { refetch } = useListPasskeys();
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const [showFreshnessDialog, setShowFreshnessDialog] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleDeletePasskey = async () => {
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }
    setIsLoading(true);
    try {
      await deletePasskey({ id: passkey.id });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      setIsLoading(false);
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SessionFreshnessDialog,
      {
        open: showFreshnessDialog,
        onOpenChange: setShowFreshnessDialog,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center p-4",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FingerprintPattern,
              {
                className: cn("size-4", classNames == null ? void 0 : classNames.icon)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: new Date(passkey.createdAt).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isLoading,
              size: "sm",
              variant: "outline",
              onClick: handleDeletePasskey,
              children: [
                isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ]
      }
    )
  ] });
}
function PasskeysCard({
  className,
  classNames,
  localization
}) {
  const {
    authClient,
    freshAge,
    hooks: { useListPasskeys, useSession },
    localization: authLocalization2,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...authLocalization2, ...localization };
  const { data: passkeys, isPending, refetch } = useListPasskeys();
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const [showFreshnessDialog, setShowFreshnessDialog] = reactExports.useState(false);
  const addPasskey = async () => {
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }
    try {
      await authClient.passkey.addPasskey({
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  const form = useForm();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SessionFreshnessDialog,
      {
        open: showFreshnessDialog,
        onOpenChange: setShowFreshnessDialog,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { method: "POST", onSubmit: form.handleSubmit(addPasskey), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.ADD_PASSKEY,
        description: localization.PASSKEYS_DESCRIPTION,
        instructions: localization.PASSKEYS_INSTRUCTIONS,
        isPending,
        title: localization.PASSKEYS,
        children: passkeys && passkeys.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardContent,
          {
            className: cn(
              "grid gap-4",
              classNames == null ? void 0 : classNames.content
            ),
            children: passkeys == null ? void 0 : passkeys.map((passkey) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              PasskeyCell,
              {
                classNames,
                localization,
                passkey
              },
              passkey.id
            ))
          }
        )
      }
    ) }) })
  ] });
}
function useIsOverflow() {
  const [isOverflow, setIsOverflow] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const triggerRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsOverflow(false);
      return;
    }
    const currentTrigger = element.textContent;
    if (triggerRef.current !== currentTrigger) {
      triggerRef.current = currentTrigger;
      setIsOverflow(false);
    }
    const checkOverflow = () => {
      setIsOverflow(element.offsetWidth < element.scrollWidth);
    };
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  });
  return { ref, isOverflow };
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger$1, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2$1,
    {
      className: cn(
        "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-foreground px-3 py-1.5 text-background text-xs data-[state=closed]:animate-out",
        className
      ),
      "data-slot": "tooltip-content",
      sideOffset,
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}
function ProviderCell({
  className,
  classNames,
  account,
  localization,
  other,
  provider,
  refetch
}) {
  const {
    authClient,
    basePath,
    baseURL,
    localization: contextLocalization,
    mutators: { unlinkAccount },
    viewPaths,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleLink = async () => {
    setIsLoading(true);
    const callbackURL = `${baseURL}${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(window.location.pathname)}`;
    try {
      if (other) {
        await authClient.oauth2.link({
          providerId: provider.provider,
          callbackURL,
          fetchOptions: { throw: true }
        });
      } else {
        await authClient.linkSocial({
          provider: provider.provider,
          callbackURL,
          fetchOptions: { throw: true }
        });
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsLoading(false);
    }
  };
  const handleUnlink = async () => {
    setIsLoading(true);
    try {
      await unlinkAccount({
        accountId: account == null ? void 0 : account.accountId,
        providerId: provider.provider
      });
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "min-w-0 flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProviderCellContent,
          {
            account,
            provider,
            classNames
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: cn("relative ms-auto shrink-0", classNames == null ? void 0 : classNames.button),
            disabled: isLoading,
            size: "sm",
            type: "button",
            variant: account ? "outline" : "default",
            onClick: account ? handleUnlink : handleLink,
            children: [
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
              account ? localization.UNLINK : localization.LINK
            ]
          }
        )
      ]
    }
  );
}
function ProviderCellContent({
  account,
  classNames,
  provider
}) {
  if (account) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConnectedProviderContent,
      {
        account,
        classNames,
        provider
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderContent, { classNames, provider }) });
}
function ConnectedProviderContent({
  account,
  classNames,
  provider
}) {
  const {
    hooks: { useAccountInfo }
  } = reactExports.useContext(AuthUIContext);
  const { data: accountInfo, isPending } = useAccountInfo({
    query: { accountId: account.accountId }
  });
  const email = accountInfo == null ? void 0 : accountInfo.user.email;
  const { ref: emailRef, isOverflow } = useIsOverflow();
  const emailElement = isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "my-0.5 h-3 w-28" }) : email ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref: emailRef, className: "truncate text-muted-foreground text-xs", children: email }) : null;
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx(
    ProviderContent,
    {
      accountInfo: emailElement,
      classNames,
      provider
    }
  );
  const wrapperClassName = "flex min-w-0 flex-1 items-center gap-3";
  if (email && isOverflow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(wrapperClassName, "cursor-default"), children: content }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: email }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: wrapperClassName, children: content });
}
function ProviderContent({
  accountInfo,
  classNames,
  provider
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    provider.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
      provider.icon,
      {
        className: cn("size-4 shrink-0", classNames == null ? void 0 : classNames.icon)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: provider.name }),
      accountInfo
    ] })
  ] });
}
function ProvidersCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
  refetch
}) {
  var _a, _b, _c;
  const {
    hooks: { useListAccounts },
    localization: contextLocalization,
    social,
    genericOAuth
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
    refetch = result.refetch;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PROVIDERS,
      description: localization.PROVIDERS_DESCRIPTION,
      isPending,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? (_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        provider
      )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        accounts == null ? void 0 : accounts.map((account) => {
          var _a2;
          const socialProvider = socialProviders.find(
            (sp) => sp.provider === account.providerId
          );
          const genericOAuthProvider = (_a2 = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _a2.find(
            (gp) => gp.provider === account.providerId
          );
          const provider = socialProvider || genericOAuthProvider;
          if (!provider) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProviderCell,
            {
              classNames,
              account,
              provider,
              refetch,
              other: !socialProvider
            },
            account.providerId
          );
        }),
        (_b = social == null ? void 0 : social.providers) == null ? void 0 : _b.map((provider) => {
          const socialProvider = socialProviders.find(
            (socialProvider2) => socialProvider2.provider === provider
          );
          if (!socialProvider) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProviderCell,
            {
              classNames,
              provider: socialProvider,
              refetch
            },
            provider
          );
        }),
        (_c = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _c.map((provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProviderCell,
          {
            classNames,
            account: accounts == null ? void 0 : accounts.find(
              (acc) => acc.providerId === provider.provider
            ),
            provider,
            refetch,
            other: true
          },
          provider.provider
        ))
      ] }) })
    }
  );
}
function InputFieldSkeleton({
  classNames
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: cn("h-4 w-32", classNames == null ? void 0 : classNames.skeleton) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton) })
  ] });
}
function ChangePasswordCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
  passwordValidation
}) {
  const {
    authClient,
    basePath,
    baseURL,
    credentials,
    hooks: { useSession, useListAccounts },
    localization: contextLocalization,
    navigate,
    viewPaths,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const { data: sessionData } = useSession();
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }
  const formSchema = object({
    currentPassword: getPasswordSchema(
      passwordValidation,
      localization
    ),
    newPassword: getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.NEW_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }),
    confirmPassword: confirmPasswordEnabled ? getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }) : string().optional()
  }).refine(
    (data) => !confirmPasswordEnabled || data.newPassword === data.confirmPassword,
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const setPasswordForm = useForm();
  const { isSubmitting } = form.formState;
  const setPassword = async () => {
    if (!sessionData) return;
    const email = sessionData == null ? void 0 : sessionData.user.email;
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions: {
          throw: true,
          headers: await getCaptchaHeaders("/forget-password")
        }
      });
      toast2({
        variant: "success",
        message: localization.FORGOT_PASSWORD_EMAIL
      });
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      resetCaptcha();
    }
  };
  const changePassword = async ({
    currentPassword,
    newPassword
  }) => {
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.CHANGE_PASSWORD_SUCCESS
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    form.reset();
  };
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  if (!isPending && !credentialsLinked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...setPasswordForm, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "form",
      {
        method: "POST",
        onSubmit: setPasswordForm.handleSubmit(setPassword),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCard,
          {
            title: localization.SET_PASSWORD,
            description: localization.SET_PASSWORD_DESCRIPTION,
            actionLabel: localization.SET_PASSWORD,
            isPending,
            className,
            classNames,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Captcha,
              {
                ref: captchaRef,
                localization,
                action: "/forget-password"
              }
            ) })
          }
        )
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { method: "POST", onSubmit: form.handleSubmit(changePassword), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      actionLabel: localization.SAVE,
      description: localization.CHANGE_PASSWORD_DESCRIPTION,
      instructions: localization.CHANGE_PASSWORD_INSTRUCTIONS,
      isPending,
      title: localization.CHANGE_PASSWORD,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardContent,
        {
          className: cn("grid gap-6", classNames == null ? void 0 : classNames.content),
          children: isPending || !accounts ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputFieldSkeleton, { classNames }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(InputFieldSkeleton, { classNames }),
            confirmPasswordEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
              InputFieldSkeleton,
              {
                classNames
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "currentPassword",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.CURRENT_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "current-password",
                      placeholder: localization.CURRENT_PASSWORD_PLACEHOLDER,
                      disabled: isSubmitting,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormMessage,
                    {
                      className: classNames == null ? void 0 : classNames.error
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "newPassword",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.NEW_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "new-password",
                      disabled: isSubmitting,
                      placeholder: localization.NEW_PASSWORD_PLACEHOLDER,
                      enableToggle: true,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormMessage,
                    {
                      className: classNames == null ? void 0 : classNames.error
                    }
                  )
                ] })
              }
            ),
            confirmPasswordEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "confirmPassword",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.CONFIRM_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "new-password",
                      placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                      disabled: isSubmitting,
                      enableToggle: true,
                      ...field
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormMessage,
                    {
                      className: classNames == null ? void 0 : classNames.error
                    }
                  )
                ] })
              }
            )
          ] })
        }
      )
    }
  ) }) });
}
function SessionCell({
  className,
  classNames,
  localization,
  session,
  refetch
}) {
  var _a, _b;
  const {
    basePath,
    hooks: { useSession },
    localization: contextLocalization,
    mutators: { revokeSession },
    viewPaths,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const isCurrentSession = session.id === ((_a = sessionData == null ? void 0 : sessionData.session) == null ? void 0 : _a.id);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleRevoke = async () => {
    setIsLoading(true);
    if (isCurrentSession) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }
    try {
      await revokeSession({ token: session.token });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsLoading(false);
    }
  };
  const parsed = session.userAgent ? Bowser.parse(session.userAgent) : null;
  const isMobile = (parsed == null ? void 0 : parsed.platform.type) === "mobile";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        isMobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: isCurrentSession ? localization.CURRENT_SESSION : session == null ? void 0 : session.ipAddress }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: ((_b = session.userAgent) == null ? void 0 : _b.includes("tauri-plugin-http")) ? localization.APP : (parsed == null ? void 0 : parsed.os.name) && (parsed == null ? void 0 : parsed.browser.name) ? `${parsed.os.name}, ${parsed.browser.name}` : (parsed == null ? void 0 : parsed.os.name) || (parsed == null ? void 0 : parsed.browser.name) || session.userAgent || localization.UNKNOWN })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isLoading,
            size: "sm",
            variant: "outline",
            onClick: handleRevoke,
            children: [
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
              isCurrentSession ? localization.SIGN_OUT : localization.REVOKE
            ]
          }
        )
      ]
    }
  );
}
function SessionsCard({
  className,
  classNames,
  localization
}) {
  const {
    hooks: { useListSessions },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessions, isPending, refetch } = useListSessions();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      description: localization.SESSIONS_DESCRIPTION,
      isPending,
      title: localization.SESSIONS,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        "skeleton"
      ) : sessions == null ? void 0 : sessions.map((session) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        SessionCell,
        {
          classNames,
          localization,
          session,
          refetch
        },
        session.id
      )) })
    }
  );
}
function BackupCodesDialog({
  classNames,
  backupCodes,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const { localization } = reactExports.useContext(AuthUIContext);
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = () => {
    const codeText = backupCodes.join("\n");
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.BACKUP_CODES
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.BACKUP_CODES_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: backupCodes.map((code, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-md bg-muted p-2 text-center font-mono text-sm",
            children: code
          },
          index
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleCopy,
              disabled: copied,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPIED_TO_CLIPBOARD
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPY_ALL_CODES
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "default",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: localization.CONTINUE
            }
          )
        ] })
      ]
    }
  ) });
}
function TwoFactorPasswordDialog({
  classNames,
  onOpenChange,
  isTwoFactorEnabled,
  ...props
}) {
  var _a, _b;
  const {
    localization,
    authClient,
    basePath,
    viewPaths,
    navigate,
    toast: toast2,
    twoFactor,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = reactExports.useState(false);
  const [backupCodes, setBackupCodes] = reactExports.useState([]);
  const [totpURI, setTotpURI] = reactExports.useState(null);
  const formSchema = object({
    password: string().min(1, { message: localization.PASSWORD_REQUIRED })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      password: ""
    }
  });
  const { isSubmitting } = form.formState;
  async function enableTwoFactor({ password }) {
    try {
      const response = await authClient.twoFactor.enable({
        password,
        fetchOptions: { throw: true }
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
      setBackupCodes(response.backupCodes);
      if (twoFactor == null ? void 0 : twoFactor.includes("totp")) {
        setTotpURI(response.totpURI);
      }
      setTimeout(() => {
        setShowBackupCodesDialog(true);
      }, 250);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  async function disableTwoFactor({ password }) {
    try {
      await authClient.twoFactor.disable({
        password,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.TWO_FACTOR_DISABLED
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: cn("sm:max-w-md", classNames == null ? void 0 : classNames.dialog),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.header, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: classNames == null ? void 0 : classNames.title, children: localization.TWO_FACTOR }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: classNames == null ? void 0 : classNames.description, children: isTwoFactorEnabled ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              method: "POST",
              onSubmit: form.handleSubmit(
                isTwoFactorEnabled ? disableTwoFactor : enableTwoFactor
              ),
              className: "grid gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "password",
                    render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.PASSWORD
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        PasswordInput,
                        {
                          className: classNames == null ? void 0 : classNames.input,
                          placeholder: localization.PASSWORD_PLACEHOLDER,
                          autoComplete: "current-password",
                          ...field
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormMessage,
                        {
                          className: classNames == null ? void 0 : classNames.error
                        }
                      )
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  DialogFooter,
                  {
                    className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.footer,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "secondary",
                          onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                          className: cn(
                            classNames == null ? void 0 : classNames.button,
                            classNames == null ? void 0 : classNames.secondaryButton
                          ),
                          children: localization.CANCEL
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "submit",
                          disabled: isSubmitting,
                          className: cn(
                            classNames == null ? void 0 : classNames.button,
                            classNames == null ? void 0 : classNames.primaryButton
                          ),
                          children: [
                            isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                            isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR
                          ]
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BackupCodesDialog,
      {
        classNames,
        open: showBackupCodesDialog,
        onOpenChange: (open) => {
          setShowBackupCodesDialog(open);
          if (!open) {
            const url = `${basePath}/${viewPaths.TWO_FACTOR}`;
            navigate(
              (twoFactor == null ? void 0 : twoFactor.includes("totp")) && totpURI ? `${url}?totpURI=${totpURI}` : url
            );
          }
        },
        backupCodes
      }
    )
  ] });
}
function TwoFactorCard({
  className,
  classNames,
  localization
}) {
  var _a;
  const {
    localization: contextLocalization,
    hooks: { useSession }
  } = reactExports.useContext(AuthUIContext);
  const [showPasswordDialog, setShowPasswordDialog] = reactExports.useState(false);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, isPending } = useSession();
  const isTwoFactorEnabled = (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.twoFactorEnabled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR,
        description: localization.TWO_FACTOR_CARD_DESCRIPTION,
        instructions: isTwoFactorEnabled ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS,
        isPending,
        title: localization.TWO_FACTOR,
        action: () => setShowPasswordDialog(true)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TwoFactorPasswordDialog,
      {
        classNames,
        open: showPasswordDialog,
        onOpenChange: setShowPasswordDialog,
        isTwoFactorEnabled: !!isTwoFactorEnabled
      }
    )
  ] });
}
function SecuritySettingsCards({
  className,
  classNames,
  localization
}) {
  var _a, _b;
  const {
    credentials,
    deleteUser,
    hooks,
    localization: contextLocalization,
    passkey,
    social,
    genericOAuth,
    twoFactor
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { useListAccounts } = hooks;
  const {
    data: accounts,
    isPending: accountsPending,
    refetch: refetchAccounts
  } = useListAccounts();
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        credentials && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChangePasswordCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            skipHook: true
          }
        ),
        (((_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.length) || ((_b = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _b.length)) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProvidersCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            refetch: refetchAccounts,
            skipHook: true
          }
        ),
        twoFactor && credentialsLinked && /* @__PURE__ */ jsxRuntimeExports.jsx(
          TwoFactorCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        passkey && /* @__PURE__ */ jsxRuntimeExports.jsx(
          PasskeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SessionsCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        deleteUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteAccountCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            skipHook: true
          }
        )
      ]
    }
  );
}
function UserTeamCell({
  className,
  classNames,
  team,
  localization,
  refetch
}) {
  var _a;
  const {
    authClient,
    hooks: { useSession },
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, refetch: refetchSession } = useSession();
  const isCurrentTeam = team.id === ((_a = sessionData == null ? void 0 : sessionData.session) == null ? void 0 : _a.activeTeamId);
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const handleSetActiveTeam = async () => {
    try {
      setIsUpdating(true);
      await authClient.organization.setActiveTeam({
        teamId: team.id,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.UPDATE_TEAM_SUCCESS
      });
      await (refetchSession == null ? void 0 : refetchSession());
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Users,
          {
            className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isCurrentTeam || isUpdating,
            size: "sm",
            variant: "outline",
            onClick: handleSetActiveTeam,
            children: [
              isUpdating && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
              isCurrentTeam ? localization.TEAM_ACTIVE : localization.TEAM_SET_ACTIVE
            ]
          }
        )
      ]
    }
  );
}
function UserTeamsCard({
  className,
  classNames,
  localization
}) {
  const {
    hooks: { useListUserTeams },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: teams, isPending, refetch } = useListUserTeams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      description: localization.USER_TEAMS_DESCRIPTION,
      isPending,
      title: localization.TEAMS,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        "skeleton"
      ) : teams && teams.length > 0 ? teams.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ).map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserTeamCell,
        {
          classNames,
          localization,
          refetch,
          team
        },
        team.id
      )) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND }) })
    }
  );
}
function AccountView({
  className,
  classNames,
  localization: localizationProp,
  path: pathProp,
  pathname,
  view: viewProp,
  hideNav,
  showTeams
}) {
  var _a, _b;
  const {
    apiKey,
    teams: teamOptions,
    localization: contextLocalization,
    organization,
    account: accountOptions,
    Link
  } = reactExports.useContext(AuthUIContext);
  if (!accountOptions) {
    return null;
  }
  const { enabled: teamsEnabled } = teamOptions || {};
  useAuthenticate();
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(accountOptions.viewPaths, path) || "SETTINGS";
  const navItems = [
    { view: "SETTINGS", label: localization.ACCOUNT },
    { view: "SECURITY", label: localization.SECURITY }
  ];
  if (teamsEnabled && showTeams) {
    navItems.push({
      view: "TEAMS",
      label: localization.TEAMS
    });
  }
  if (apiKey) {
    navItems.push({
      view: "API_KEYS",
      label: localization.API_KEYS
    });
  }
  if (organization) {
    navItems.push({
      view: "ORGANIZATIONS",
      label: localization.ORGANIZATIONS
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex w-full grow flex-col gap-4 md:flex-row md:gap-12",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2 md:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label2, { className: "font-semibold text-base", children: (_a = navItems.find((i) => i.view === view)) == null ? void 0 : _a.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Drawer, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTitle, { className: "hidden", children: localization.SETTINGS }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col px-4 pb-4", children: navItems.map((item) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    href: `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths[item.view]}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "lg",
                        className: cn(
                          "w-full justify-start px-4 transition-none",
                          (_a2 = classNames == null ? void 0 : classNames.drawer) == null ? void 0 : _a2.menuItem,
                          view === item.view ? "font-semibold" : "text-foreground/70"
                        ),
                        variant: "ghost",
                        children: item.label
                      }
                    )
                  },
                  item.view
                );
              }) })
            ] })
          ] })
        ] }),
        !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex w-48 flex-col gap-1 lg:w-60",
              (_b = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _b.base
            ),
            children: navItems.map((item) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  href: `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths[item.view]}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      className: cn(
                        "w-full justify-start px-4 transition-none",
                        (_a2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _a2.button,
                        view === item.view ? "font-semibold" : "text-foreground/70",
                        view === item.view && ((_b2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _b2.buttonActive)
                      ),
                      variant: "ghost",
                      children: item.label
                    }
                  )
                },
                item.view
              );
            })
          }
        ) }),
        view === "SETTINGS" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AccountSettingsCards,
          {
            classNames,
            localization
          }
        ),
        view === "SECURITY" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SecuritySettingsCards,
          {
            classNames,
            localization
          }
        ),
        view === "TEAMS" && teamsEnabled && showTeams && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserTeamsCard,
          {
            classNames,
            localization
          }
        ),
        view === "API_KEYS" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ApiKeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        view === "ORGANIZATIONS" && organization && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full gap-4 md:gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrganizationsCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              localization
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UserInvitationsCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              localization
            }
          )
        ] })
      ]
    }
  );
}
function AccountSettingsPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountSettings) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccountView,
    {
      path: accountViewPaths.SETTINGS,
      ...rest,
      localization
    }
  ) });
}
const accountSettingsPage_internalJCXCAIIM = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountSettingsPageInternal
});
function AccountSecurityPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountSecurity) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccountView,
    {
      path: accountViewPaths.SECURITY,
      ...rest,
      localization
    }
  ) });
}
const accountSecurityPage_internalOLX2SDWX = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountSecurityPageInternal
});
function AccountApiKeysPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountApiKeys) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccountView,
    {
      path: accountViewPaths.API_KEYS,
      ...rest,
      localization
    }
  ) });
}
const accountApiKeysPage_internalYQO3GVRR = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountApiKeysPageInternal
});
function AccountOrganizationsPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountOrganizations) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccountView,
    {
      path: accountViewPaths.ORGANIZATIONS,
      ...rest,
      localization
    }
  ) });
}
const accountOrganizationsPage_internalFMIBVMJQ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountOrganizationsPageInternal
});
function AccountTeamsPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountTeams) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccountView,
    {
      path: accountViewPaths.TEAMS,
      ...rest,
      localization
    }
  ) });
}
const accountTeamsPage_internalJE7SQLVP = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AccountTeamsPageInternal
});
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function useOnSuccessTransition({
  redirectTo: redirectToProp
}) {
  const { redirectTo: contextRedirectTo } = reactExports.useContext(AuthUIContext);
  const [isPending, setIsPending] = reactExports.useState(false);
  const {
    navigate,
    hooks: { useSession },
    onSessionChange
  } = reactExports.useContext(AuthUIContext);
  const { refetch: refetchSession } = useSession();
  const onSuccess = reactExports.useCallback(async () => {
    setIsPending(true);
    await (refetchSession == null ? void 0 : refetchSession());
    if (onSessionChange) await onSessionChange();
    setIsPending(false);
    const redirectTo = redirectToProp || getSearchParam("redirectTo") || contextRedirectTo;
    navigate(redirectTo);
  }, [
    refetchSession,
    onSessionChange,
    navigate,
    redirectToProp,
    contextRedirectTo
  ]);
  return { onSuccess, isPending };
}
function AuthCallback({ redirectTo }) {
  const {
    hooks: { useIsRestoring },
    persistClient
  } = reactExports.useContext(AuthUIContext);
  const isRestoring = useIsRestoring == null ? void 0 : useIsRestoring();
  const isRedirecting = reactExports.useRef(false);
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  reactExports.useEffect(() => {
    if (isRedirecting.current) return;
    if (!persistClient) {
      isRedirecting.current = true;
      onSuccess();
      return;
    }
    if (isRestoring) return;
    isRedirecting.current = true;
    onSuccess();
  }, [isRestoring, persistClient, onSuccess]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" });
}
function SignOut({ redirectTo }) {
  const signingOut = reactExports.useRef(false);
  const { authClient, basePath, viewPaths } = reactExports.useContext(AuthUIContext);
  const { onSuccess } = useOnSuccessTransition({
    redirectTo: redirectTo || `${basePath}/${viewPaths.SIGN_IN}`
  });
  reactExports.useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;
    authClient.signOut().finally(onSuccess);
  }, [authClient, onSuccess]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" });
}
function AcceptInvitationCard({
  className,
  classNames,
  localization: localizationProp
}) {
  const {
    localization: contextLocalization,
    redirectTo,
    replace,
    toast: toast2
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: sessionData } = useAuthenticate();
  const [invitationId, setInvitationId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const invitationIdParam = getSearchParam("invitationId");
    if (!invitationIdParam) {
      toast2({
        variant: "error",
        message: localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
      return;
    }
    setInvitationId(invitationIdParam);
  }, [localization.INVITATION_NOT_FOUND, toast2, replace, redirectTo]);
  if (!sessionData || !invitationId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AcceptInvitationSkeleton,
      {
        className,
        classNames
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AcceptInvitationContent,
    {
      className,
      classNames,
      localization,
      invitationId
    }
  );
}
function AcceptInvitationContent({
  className,
  classNames,
  localization: localizationProp,
  invitationId
}) {
  var _a;
  const {
    authClient,
    hooks: { useInvitation },
    localization: contextLocalization,
    organization,
    redirectTo,
    replace,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const [isRejecting, setIsRejecting] = reactExports.useState(false);
  const [isAccepting, setIsAccepting] = reactExports.useState(false);
  const isProcessing = isRejecting || isAccepting;
  const { data: invitation, isPending } = useInvitation({
    query: {
      id: invitationId
    }
  });
  const getRedirectTo = reactExports.useCallback(
    () => getSearchParam("redirectTo") || redirectTo,
    [redirectTo]
  );
  reactExports.useEffect(() => {
    if (isPending || !invitationId) return;
    if (!invitation) {
      toast2({
        variant: "error",
        message: localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
      return;
    }
    if (invitation.status !== "pending" || new Date(invitation.expiresAt) < /* @__PURE__ */ new Date()) {
      toast2({
        variant: "error",
        message: new Date(invitation.expiresAt) < /* @__PURE__ */ new Date() ? localization.INVITATION_EXPIRED : localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
    }
  }, [
    invitation,
    isPending,
    invitationId,
    localization,
    toast2,
    replace,
    redirectTo
  ]);
  const acceptInvitation = async () => {
    setIsAccepting(true);
    try {
      await authClient.organization.acceptInvitation({
        invitationId,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.INVITATION_ACCEPTED || "Invitation accepted"
      });
      replace(getRedirectTo());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsAccepting(false);
    }
  };
  const rejectInvitation = async () => {
    setIsRejecting(true);
    try {
      await authClient.organization.rejectInvitation({
        invitationId,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.INVITATION_REJECTED
      });
      replace(redirectTo);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsRejecting(false);
    }
  };
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organization == null ? void 0 : organization.customRoles) || []];
  const roleLabel = ((_a = roles.find((r) => r.role === (invitation == null ? void 0 : invitation.role))) == null ? void 0 : _a.label) || (invitation == null ? void 0 : invitation.role);
  if (!invitation)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AcceptInvitationSkeleton,
      {
        className,
        classNames
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardHeader,
      {
        className: cn(
          "justify-items-center text-center",
          classNames == null ? void 0 : classNames.header
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.ACCEPT_INVITATION
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.ACCEPT_INVITATION_DESCRIPTION
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardContent,
      {
        className: cn(
          "flex flex-col gap-6 truncate",
          classNames == null ? void 0 : classNames.content
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex-row items-center p-4"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrganizationCellView,
              {
                organization: {
                  id: invitation.organizationId,
                  name: invitation.organizationName,
                  slug: invitation.organizationSlug,
                  logo: invitation.organizationLogo,
                  createdAt: /* @__PURE__ */ new Date()
                },
                localization
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ml-auto text-muted-foreground text-sm", children: roleLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                onClick: rejectInvitation,
                disabled: isProcessing,
                children: [
                  isRejecting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                  localization.REJECT
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                onClick: acceptInvitation,
                disabled: isProcessing,
                children: [
                  isAccepting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, {}),
                  localization.ACCEPT
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
var AcceptInvitationSkeleton = ({
  className,
  classNames,
  localization
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardHeader,
      {
        className: cn("justify-items-center", classNames == null ? void 0 : classNames.header),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn(
                "my-1 h-5 w-full max-w-32 md:h-5.5 md:w-40",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn(
                "my-0.5 h-3 w-full max-w-56 md:h-3.5 md:w-64",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardContent,
      {
        className: cn(
          "flex flex-col gap-6 truncate",
          classNames == null ? void 0 : classNames.content
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("flex-row items-center p-4"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrganizationCellView,
              {
                isPending: true,
                localization
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-0.5 ml-auto h-4 w-full max-w-14 shrink-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full" })
          ] })
        ]
      }
    )
  ] });
};
function ForgotPasswordForm({
  className,
  classNames,
  isSubmitting,
  localization,
  setIsSubmitting
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    baseURL,
    localization: contextLocalization,
    navigate,
    toast: toast2,
    viewPaths,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const formSchema = object({
    email: string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }).min(1, {
      message: `${localization.EMAIL} ${localization.IS_REQUIRED}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function forgotPassword({ email }) {
    try {
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/forget-password")
      };
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions
      });
      toast2({
        variant: "success",
        message: localization.FORGOT_PASSWORD_EMAIL
      });
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      resetCaptcha();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(forgotPassword),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/forget-password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.FORGOT_PASSWORD_ACTION
          }
        )
      ]
    }
  ) });
}
function MagicLinkForm({
  className,
  classNames,
  callbackURL: callbackURLProp,
  isSubmitting,
  localization,
  redirectTo: redirectToProp,
  setIsSubmitting
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    baseURL,
    persistClient,
    localization: contextLocalization,
    redirectTo: contextRedirectTo,
    viewPaths,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const getRedirectTo = reactExports.useCallback(
    () => redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectToProp, contextRedirectTo]
  );
  const getCallbackURL = reactExports.useCallback(
    () => `${baseURL}${callbackURLProp || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURLProp,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const formSchema = object({
    email: string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function sendMagicLink({ email }) {
    try {
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/sign-in/magic-link")
      };
      await authClient.signIn.magicLink({
        email,
        callbackURL: getCallbackURL(),
        fetchOptions
      });
      toast2({
        variant: "success",
        message: localization.MAGIC_LINK_EMAIL
      });
      form.reset();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      resetCaptcha();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(sendMagicLink),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-in/magic-link"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.MAGIC_LINK_ACTION
          }
        )
      ]
    }
  ) });
}
function RecoverAccountForm({
  className,
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = object({
    code: string().min(1, { message: localization.BACKUP_CODE_REQUIRED })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function verifyBackupCode({ code }) {
    try {
      await authClient.twoFactor.verifyBackupCode({
        code,
        fetchOptions: { throw: true }
      });
      await onSuccess();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyBackupCode),
      className: cn("grid gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.BACKUP_CODE }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: localization.BACKUP_CODE_PLACEHOLDER,
                  autoComplete: "off",
                  className: classNames == null ? void 0 : classNames.input,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.RECOVER_ACCOUNT_ACTION
          }
        )
      ]
    }
  ) });
}
function ResetPasswordForm({
  className,
  classNames,
  localization,
  passwordValidation
}) {
  const tokenChecked = reactExports.useRef(false);
  const {
    authClient,
    basePath,
    credentials,
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const formSchema = object({
    newPassword: getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.NEW_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }),
    confirmPassword: confirmPasswordEnabled ? getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }) : string().optional()
  }).refine(
    (data) => !confirmPasswordEnabled || data.newPassword === data.confirmPassword,
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  reactExports.useEffect(() => {
    if (tokenChecked.current) return;
    tokenChecked.current = true;
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    if (!token || token === "INVALID_TOKEN") {
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
      toast2({ variant: "error", message: localization.INVALID_TOKEN });
    }
  }, [basePath, navigate, toast2, viewPaths, localization]);
  async function resetPassword({ newPassword }) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      await authClient.resetPassword({
        newPassword,
        token,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.RESET_PASSWORD_SUCCESS
      });
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(resetPassword),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "newPassword",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.NEW_PASSWORD }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.NEW_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        confirmPasswordEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "confirmPassword",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.CONFIRM_PASSWORD }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.RESET_PASSWORD_ACTION
          }
        )
      ]
    }
  ) });
}
function SignInForm({
  className,
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting,
  passwordValidation,
  callbackURL
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    credentials,
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast: toast2,
    Link,
    localizeErrors,
    emailVerification
  } = reactExports.useContext(AuthUIContext);
  const rememberMeEnabled = credentials == null ? void 0 : credentials.rememberMe;
  const usernameEnabled = credentials == null ? void 0 : credentials.username;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = object({
    email: usernameEnabled ? string().min(1, {
      message: `${localization.USERNAME} ${localization.IS_REQUIRED}`
    }) : string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }),
    password: getPasswordSchema(passwordValidation, localization),
    rememberMe: boolean$1().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: !rememberMeEnabled
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function signIn({
    email,
    password,
    rememberMe
  }) {
    var _a;
    try {
      let response = {};
      if (usernameEnabled && !isValidEmail(email)) {
        const fetchOptions = {
          throw: true,
          headers: await getCaptchaHeaders("/sign-in/username")
        };
        response = await authClient.signIn.username({
          username: email,
          password,
          rememberMe,
          fetchOptions,
          callbackURL
        });
      } else {
        const fetchOptions = {
          throw: true,
          headers: await getCaptchaHeaders("/sign-in/email")
        };
        response = await authClient.signIn.email({
          email,
          password,
          rememberMe,
          fetchOptions,
          callbackURL
        });
      }
      if (response.twoFactorRedirect) {
        navigate(
          `${basePath}/${viewPaths.TWO_FACTOR}${window.location.search}`
        );
      } else {
        await onSuccess();
      }
    } catch (error) {
      form.resetField("password");
      resetCaptcha();
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      if ((emailVerification == null ? void 0 : emailVerification.otp) && ((_a = error == null ? void 0 : error.error) == null ? void 0 : _a.code) === "EMAIL_NOT_VERIFIED") {
        navigate(
          `${basePath}/${viewPaths.EMAIL_VERIFICATION}?email=${encodeURIComponent(email)}`
        );
      }
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(signIn),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: usernameEnabled ? localization.USERNAME : localization.EMAIL }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  autoComplete: usernameEnabled ? "username" : "email",
                  className: classNames == null ? void 0 : classNames.input,
                  type: usernameEnabled ? "text" : "email",
                  placeholder: usernameEnabled ? localization.SIGN_IN_USERNAME_PLACEHOLDER : localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.PASSWORD }),
                (credentials == null ? void 0 : credentials.forgotPassword) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    className: cn(
                      "text-sm hover:underline",
                      classNames == null ? void 0 : classNames.forgotPasswordLink
                    ),
                    href: `${basePath}/${viewPaths.FORGOT_PASSWORD}${isHydrated ? window.location.search : ""}`,
                    children: localization.FORGOT_PASSWORD_LINK
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PasswordInput,
                {
                  autoComplete: "current-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        rememberMeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "rememberMe",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: field.value,
                  onCheckedChange: field.onChange,
                  disabled: isSubmitting
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.REMEMBER_ME })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-in/email"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.SIGN_IN_ACTION
          }
        )
      ]
    }
  ) });
}
function SignUpForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting,
  passwordValidation
}) {
  var _a, _b, _c, _d, _e, _f;
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    additionalFields,
    authClient,
    basePath,
    baseURL,
    credentials,
    localization: contextLocalization,
    nameRequired,
    persistClient,
    redirectTo: contextRedirectTo,
    signUp: signUpOptions,
    viewPaths,
    navigate,
    toast: toast2,
    avatar,
    localizeErrors,
    emailVerification
  } = reactExports.useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const usernameEnabled = credentials == null ? void 0 : credentials.username;
  const usernameRequired = (credentials == null ? void 0 : credentials.usernameRequired) ?? true;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  const signUpFields = signUpOptions == null ? void 0 : signUpOptions.fields;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const fileInputRef = reactExports.useRef(null);
  const [avatarImage, setAvatarImage] = reactExports.useState(null);
  const [uploadingAvatar, setUploadingAvatar] = reactExports.useState(false);
  const getRedirectTo = reactExports.useCallback(
    () => redirectTo || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectTo, contextRedirectTo]
  );
  const getCallbackURL = reactExports.useCallback(
    () => `${baseURL}${callbackURL || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURL,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const defaultFields = {
    email: string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }),
    password: getPasswordSchema(passwordValidation, localization),
    name: (signUpFields == null ? void 0 : signUpFields.includes("name")) && nameRequired ? string().min(1, {
      message: `${localization.NAME} ${localization.IS_REQUIRED}`
    }) : string().optional(),
    image: string().optional(),
    username: usernameEnabled ? usernameRequired ? string().min(1, {
      message: `${localization.USERNAME} ${localization.IS_REQUIRED}`
    }) : string().optional() : string().optional(),
    confirmPassword: confirmPasswordEnabled ? getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }) : string().optional()
  };
  const schemaFields = {};
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === "name") continue;
      if (field === "image") continue;
      const additionalField = additionalFields == null ? void 0 : additionalFields[field];
      if (!additionalField) continue;
      let fieldSchema;
      if (additionalField.type === "number") {
        fieldSchema = additionalField.required ? preprocess(
          (val) => !val ? void 0 : Number(val),
          number({
            message: ((_a = additionalField.errorMessage) == null ? void 0 : _a.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
          })
        ) : number$1({
          message: ((_b = additionalField.errorMessage) == null ? void 0 : _b.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).optional();
      } else if (additionalField.type === "boolean") {
        fieldSchema = additionalField.required ? boolean({
          message: ((_c = additionalField.errorMessage) == null ? void 0 : _c.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).refine((val) => val === true, {
          message: ((_d = additionalField.errorMessage) == null ? void 0 : _d.required) ?? `${additionalField.label} ${localization.IS_REQUIRED}`
        }) : boolean({
          message: ((_e = additionalField.errorMessage) == null ? void 0 : _e.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).optional();
      } else {
        fieldSchema = additionalField.required ? string().min(
          1,
          ((_f = additionalField.errorMessage) == null ? void 0 : _f.required) ?? `${additionalField.label} ${localization.IS_REQUIRED}`
        ) : string().optional();
      }
      schemaFields[field] = fieldSchema;
    }
  }
  const formSchema = object(defaultFields).extend(schemaFields).refine(
    (data) => {
      if (!confirmPasswordEnabled) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const defaultValues = {
    email: "",
    password: "",
    ...confirmPasswordEnabled && { confirmPassword: "" },
    ...(signUpFields == null ? void 0 : signUpFields.includes("name")) ? { name: "" } : {},
    ...usernameEnabled ? { username: "" } : {},
    ...(signUpFields == null ? void 0 : signUpFields.includes("image")) && avatar ? { image: "" } : {}
  };
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === "name") continue;
      if (field === "image") continue;
      const additionalField = additionalFields == null ? void 0 : additionalFields[field];
      if (!additionalField) continue;
      defaultValues[field] = additionalField.type === "boolean" ? false : "";
    }
  }
  const form = useForm({
    resolver: u(formSchema),
    defaultValues
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  const handleAvatarChange = async (file) => {
    if (!avatar) return;
    setUploadingAvatar(true);
    try {
      const resizedFile = await resizeAndCropImage(
        file,
        crypto.randomUUID(),
        avatar.size,
        avatar.extension
      );
      let image;
      if (avatar.upload) {
        image = await avatar.upload(resizedFile);
      } else {
        image = await fileToBase64(resizedFile);
      }
      if (image) {
        setAvatarImage(image);
        form.setValue("image", image);
      } else {
        setAvatarImage(null);
        form.setValue("image", "");
      }
    } catch (error) {
      console.error(error);
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setUploadingAvatar(false);
  };
  const handleDeleteAvatar = () => {
    setAvatarImage(null);
    form.setValue("image", "");
  };
  const openFileDialog = () => {
    var _a2;
    return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  };
  async function signUp({
    email,
    password,
    name,
    username,
    confirmPassword,
    image,
    ...additionalFieldValues
  }) {
    var _a2, _b2;
    try {
      for (const [field, value] of Object.entries(
        additionalFieldValues
      )) {
        const additionalField = additionalFields == null ? void 0 : additionalFields[field];
        if (!(additionalField == null ? void 0 : additionalField.validate)) continue;
        if (typeof value === "string" && !await additionalField.validate(value)) {
          form.setError(field, {
            message: ((_a2 = additionalField.errorMessage) == null ? void 0 : _a2.validate) ?? ((_b2 = additionalField.errorMessage) == null ? void 0 : _b2.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
          });
          return;
        }
      }
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/sign-up/email")
      };
      const additionalParams = {};
      if (username !== void 0) {
        if (!usernameRequired && (username === null || username === "" || typeof username === "string" && username.trim() === "")) {
        } else {
          additionalParams.username = username;
        }
      }
      if (image !== void 0) {
        additionalParams.image = image;
      }
      const data = await authClient.signUp.email({
        email,
        password,
        name: name || "",
        ...additionalParams,
        ...additionalFieldValues,
        callbackURL: getCallbackURL(),
        fetchOptions
      });
      if ("token" in data && data.token) {
        await onSuccess();
      } else if (emailVerification == null ? void 0 : emailVerification.otp) {
        navigate(
          `${basePath}/${viewPaths.EMAIL_VERIFICATION}?email=${encodeURIComponent(email)}`
        );
      } else {
        navigate(
          `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
        );
        toast2({
          variant: "success",
          message: localization.SIGN_UP_EMAIL
        });
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.resetField("password");
      form.resetField("confirmPassword");
      resetCaptcha();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(signUp),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        (signUpFields == null ? void 0 : signUpFields.includes("image")) && avatar && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              accept: "image/*",
              disabled: uploadingAvatar,
              hidden: true,
              type: "file",
              onChange: (e) => {
                var _a2;
                const file = (_a2 = e.target.files) == null ? void 0 : _a2.item(0);
                if (file) handleAvatarChange(file);
                e.target.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "image",
              render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.AVATAR }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        className: "size-fit rounded-full",
                        size: "icon",
                        variant: "ghost",
                        type: "button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          UserAvatar,
                          {
                            isPending: uploadingAvatar,
                            className: "size-16",
                            user: avatarImage ? {
                              name: form.watch(
                                "name"
                              ),
                              email: form.watch(
                                "email"
                              ),
                              image: avatarImage
                            } : null,
                            localization
                          }
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuContent,
                      {
                        align: "start",
                        onCloseAutoFocus: (e) => e.preventDefault(),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: openFileDialog,
                              disabled: uploadingAvatar,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, {}),
                                localization.UPLOAD_AVATAR
                              ]
                            }
                          ),
                          avatarImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            DropdownMenuItem,
                            {
                              onClick: handleDeleteAvatar,
                              disabled: uploadingAvatar,
                              variant: "destructive",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {}),
                                localization.DELETE_AVATAR
                              ]
                            }
                          )
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: openFileDialog,
                      disabled: uploadingAvatar,
                      children: [
                        uploadingAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                        localization.UPLOAD
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        (signUpFields == null ? void 0 : signUpFields.includes("name")) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                localization.NAME,
                !nameRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground", children: localization.OPTIONAL_BRACKETS })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  autoComplete: "name",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.NAME_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        usernameEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "username",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                localization.USERNAME,
                !usernameRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground", children: localization.OPTIONAL_BRACKETS })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  autoComplete: "username",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.USERNAME_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  autoComplete: "email",
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.PASSWORD }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  enableToggle: true,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        confirmPasswordEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "confirmPassword",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.CONFIRM_PASSWORD }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  enableToggle: true,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        signUpFields == null ? void 0 : signUpFields.filter((field) => field !== "name" && field !== "image").map((field) => {
          const additionalField = additionalFields == null ? void 0 : additionalFields[field];
          if (!additionalField) {
            console.error(`Additional field ${field} not found`);
            return null;
          }
          return additionalField.type === "boolean" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: field,
              render: ({ field: formField }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: formField.value,
                    onCheckedChange: formField.onChange,
                    disabled: isSubmitting
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormLabel,
                  {
                    className: classNames == null ? void 0 : classNames.label,
                    children: additionalField.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            },
            field
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: field,
              render: ({ field: formField }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormLabel,
                  {
                    className: classNames == null ? void 0 : classNames.label,
                    children: additionalField.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: additionalField.type === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    type: "number",
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) : additionalField.multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    type: "text",
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            },
            field
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-up/email"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.SIGN_UP_ACTION
          }
        )
      ]
    }
  ) });
}
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Lt,
    {
      "data-slot": "input-otp",
      containerClassName: cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      ),
      className: cn("disabled:cursor-not-allowed", className),
      ...props
    }
  );
}
function InputOTPGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "input-otp-group",
      className: cn("flex items-center", className),
      ...props
    }
  );
}
function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = reactExports.useContext(jt);
  const { char, hasFakeCaret, isActive } = (inputOTPContext == null ? void 0 : inputOTPContext.slots[index]) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-slot": "input-otp-slot",
      "data-active": isActive,
      className: cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-caret-blink bg-foreground h-4 w-px duration-1000" }) })
      ]
    }
  );
}
function InputOTPSeparator({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "input-otp-separator", role: "separator", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {}) });
}
function OTPInputGroup({
  otpSeparators = 0
}) {
  if (otpSeparators === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
    ] });
  }
  if (otpSeparators === 1) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 1 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSeparator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 3 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSeparator, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 4 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: 5 })
    ] })
  ] });
}
function TwoFactorForm({
  className,
  classNames,
  isSubmitting,
  localization,
  otpSeparators = 0,
  redirectTo,
  setIsSubmitting
}) {
  var _a;
  const isHydrated = useIsHydrated();
  const totpURI = isHydrated ? getSearchParam("totpURI") : null;
  const initialSendRef = reactExports.useRef(false);
  const {
    authClient,
    basePath,
    hooks: { useSession },
    localization: contextLocalization,
    twoFactor,
    viewPaths,
    toast: toast2,
    Link,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const { data: sessionData } = useSession();
  const isTwoFactorEnabled = (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.twoFactorEnabled;
  const [method, setMethod] = reactExports.useState(
    (twoFactor == null ? void 0 : twoFactor.length) === 1 ? twoFactor[0] : null
  );
  const [isSendingOtp, setIsSendingOtp] = reactExports.useState(false);
  const [cooldownSeconds, setCooldownSeconds] = reactExports.useState(0);
  const formSchema = object({
    code: string().min(1, {
      message: `${localization.ONE_TIME_PASSWORD} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.ONE_TIME_PASSWORD} ${localization.IS_INVALID}`
    }),
    trustDevice: boolean$1().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  reactExports.useEffect(() => {
    if (method === "otp" && cooldownSeconds <= 0 && !initialSendRef.current) {
      initialSendRef.current = true;
      sendOtp();
    }
  }, [method]);
  reactExports.useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);
  const sendOtp = async () => {
    if (isSendingOtp || cooldownSeconds > 0) return;
    try {
      setIsSendingOtp(true);
      await authClient.twoFactor.sendOtp({
        fetchOptions: { throw: true }
      });
      setCooldownSeconds(60);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      if (error.error.code === "INVALID_TWO_FACTOR_COOKIE") {
        history.back();
      }
    }
    initialSendRef.current = false;
    setIsSendingOtp(false);
  };
  async function verifyCode({
    code,
    trustDevice
  }) {
    try {
      const verifyMethod = method === "totp" ? authClient.twoFactor.verifyTotp : authClient.twoFactor.verifyOtp;
      await verifyMethod({
        code,
        trustDevice,
        fetchOptions: { throw: true }
      });
      await onSuccess();
      if (sessionData && !isTwoFactorEnabled) {
        toast2({
          variant: "success",
          message: localization == null ? void 0 : localization.TWO_FACTOR_ENABLED
        });
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        (twoFactor == null ? void 0 : twoFactor.includes("totp")) && totpURI && method === "totp" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label2, { className: classNames == null ? void 0 : classNames.label, children: localization.TWO_FACTOR_TOTP_LABEL }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            QRCode,
            {
              className: cn(
                "border shadow-xs",
                classNames == null ? void 0 : classNames.qrCode
              ),
              value: totpURI
            }
          )
        ] }),
        method !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "code",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.ONE_TIME_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      className: cn(
                        "text-sm hover:underline",
                        classNames == null ? void 0 : classNames.forgotPasswordLink
                      ),
                      href: `${basePath}/${viewPaths.RECOVER_ACCOUNT}${isHydrated ? window.location.search : ""}`,
                      children: localization.FORGOT_AUTHENTICATOR
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  InputOTP,
                  {
                    ...field,
                    maxLength: 6,
                    onChange: (value) => {
                      field.onChange(value);
                      if (value.length === 6) {
                        form.handleSubmit(
                          verifyCode
                        )();
                      }
                    },
                    containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                    className: classNames == null ? void 0 : classNames.otpInput,
                    disabled: isSubmitting,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OTPInputGroup,
                      {
                        otpSeparators
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "trustDevice",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    checked: field.value,
                    onCheckedChange: field.onChange,
                    disabled: isSubmitting,
                    className: classNames == null ? void 0 : classNames.checkbox
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.TRUST_DEVICE })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          method !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: isSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: [
                isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.TWO_FACTOR_ACTION
              ]
            }
          ),
          method === "otp" && (twoFactor == null ? void 0 : twoFactor.includes("otp")) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: sendOtp,
              disabled: cooldownSeconds > 0 || isSendingOtp || isSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              children: [
                isSendingOtp ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: classNames == null ? void 0 : classNames.icon }),
                localization.RESEND_CODE,
                cooldownSeconds > 0 && ` (${cooldownSeconds})`
              ]
            }
          ),
          method !== "otp" && (twoFactor == null ? void 0 : twoFactor.includes("otp")) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              onClick: () => setMethod("otp"),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: classNames == null ? void 0 : classNames.icon }),
                localization.SEND_VERIFICATION_CODE
              ]
            }
          ),
          method !== "totp" && (twoFactor == null ? void 0 : twoFactor.includes("totp")) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              onClick: () => setMethod("totp"),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: classNames == null ? void 0 : classNames.icon }),
                localization.CONTINUE_WITH_AUTHENTICATOR
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function EmailOTPForm(props) {
  const [email, setEmail] = reactExports.useState();
  if (!email) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmailForm, { ...props, setEmail });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OTPForm, { ...props, email });
}
function EmailForm({
  className,
  classNames,
  isSubmitting,
  localization,
  setIsSubmitting,
  setEmail
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders } = useCaptcha({ localization });
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const formSchema = object({
    email: string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function sendEmailOTP({ email }) {
    const fetchOptions = {
      throw: true,
      headers: await getCaptchaHeaders("/email-otp/send-verification-otp")
    };
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions
      });
      toast2({
        variant: "success",
        message: localization.EMAIL_OTP_VERIFICATION_SENT
      });
      setEmail(email);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(sendEmailOTP),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/email-otp/send-verification-otp"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : localization.EMAIL_OTP_SEND_ACTION
          }
        )
      ]
    }
  ) });
}
function OTPForm({
  className,
  classNames,
  isSubmitting,
  localization,
  otpSeparators = 0,
  redirectTo,
  setIsSubmitting,
  email
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = object({
    code: string().min(1, {
      message: `${localization.EMAIL_OTP} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.EMAIL_OTP} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function verifyCode({ code }) {
    try {
      await authClient.signIn.emailOtp({
        email,
        otp: code,
        fetchOptions: { throw: true }
      });
      await onSuccess();
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL_OTP }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                InputOTP,
                {
                  ...field,
                  maxLength: 6,
                  onChange: (value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(verifyCode)();
                    }
                  },
                  containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                  className: classNames == null ? void 0 : classNames.otpInput,
                  disabled: isSubmitting,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    OTPInputGroup,
                    {
                      otpSeparators
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: [
              isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
              localization.EMAIL_OTP_VERIFY_ACTION
            ]
          }
        ) })
      ]
    }
  ) });
}
function EmailVerificationForm({
  onCancel,
  localization,
  className,
  classNames,
  otpSeparators,
  callbackURL,
  isSubmitting,
  redirectTo,
  setIsSubmitting
}) {
  const [resendDisabled, setResendDisabled] = reactExports.useState(true);
  const [countdown, setCountdown] = reactExports.useState(30);
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors,
    navigate,
    basePath,
    viewPaths
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const email = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("email") || "" : "";
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = object({
    code: string().min(1, {
      message: `${localization.EMAIL_OTP} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.EMAIL_OTP} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      code: ""
    }
  });
  const currentIsSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  reactExports.useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  reactExports.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1e3);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);
  async function verifyCode({ code }) {
    try {
      const data = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
        fetchOptions: { throw: true }
      });
      if ("token" in data && data.token) {
        await onSuccess();
      } else {
        navigate(
          `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
        );
        toast2({
          variant: "success",
          message: localization.EMAIL_VERIFICATION_SUCCESS
        });
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  async function resendCode() {
    if (resendDisabled) return;
    setResendDisabled(true);
    setCountdown(30);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.EMAIL_OTP_VERIFICATION_SENT
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setResendDisabled(false);
      setCountdown(0);
    }
  }
  if (!email) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid w-full gap-6", className), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-destructive text-lg", children: "Invalid Request" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: localization.EMAIL_REQUIRED || "Email address is required" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL_OTP }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                InputOTP,
                {
                  ...field,
                  maxLength: 6,
                  onChange: (value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(verifyCode)();
                    }
                  },
                  containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                  className: classNames == null ? void 0 : classNames.otpInput,
                  disabled: currentIsSubmitting,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    OTPInputGroup,
                    {
                      otpSeparators
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: currentIsSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: [
                currentIsSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.EMAIL_OTP_VERIFY_ACTION
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: resendCode,
              disabled: resendDisabled || currentIsSubmitting,
              className: cn("w-full", classNames == null ? void 0 : classNames.button),
              children: resendDisabled ? `${localization.RESEND_VERIFICATION_EMAIL} (${countdown}s)` : localization.RESEND_VERIFICATION_EMAIL
            }
          ),
          onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onCancel,
              disabled: currentIsSubmitting,
              className: "w-full",
              children: localization.CANCEL
            }
          )
        ] })
      ]
    }
  ) });
}
function AuthForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization,
  pathname,
  redirectTo,
  view,
  otpSeparators = 0,
  setIsSubmitting
}) {
  const {
    basePath,
    credentials,
    localization: contextLocalization,
    magicLink,
    emailOTP,
    signUp,
    twoFactor: twoFactorEnabled,
    viewPaths,
    replace
  } = reactExports.useContext(AuthUIContext);
  const signUpEnabled = !!signUp;
  localization = { ...contextLocalization, ...localization };
  reactExports.useEffect(() => {
    if (pathname && !getViewByPath(viewPaths, pathname)) {
      console.error(`Invalid auth view: ${pathname}`);
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [pathname, viewPaths, basePath, replace]);
  view = view || getViewByPath(viewPaths, pathname) || "SIGN_IN";
  reactExports.useEffect(() => {
    let isInvalidView = false;
    if (view === "MAGIC_LINK" && (!magicLink || !credentials && !emailOTP)) {
      isInvalidView = true;
    }
    if (view === "EMAIL_OTP" && (!emailOTP || !credentials && !magicLink)) {
      isInvalidView = true;
    }
    if (view === "SIGN_UP" && !signUpEnabled) {
      isInvalidView = true;
    }
    if (!credentials && [
      "SIGN_UP",
      "FORGOT_PASSWORD",
      "RESET_PASSWORD",
      "TWO_FACTOR",
      "RECOVER_ACCOUNT"
    ].includes(view)) {
      isInvalidView = true;
    }
    if (["TWO_FACTOR", "RECOVER_ACCOUNT"].includes(view) && !twoFactorEnabled) {
      isInvalidView = true;
    }
    if (isInvalidView) {
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [
    basePath,
    view,
    viewPaths,
    credentials,
    replace,
    emailOTP,
    signUpEnabled,
    magicLink,
    twoFactorEnabled
  ]);
  if (view === "SIGN_OUT") return /* @__PURE__ */ jsxRuntimeExports.jsx(SignOut, { redirectTo });
  if (view === "CALLBACK") return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCallback, { redirectTo });
  if (view === "SIGN_IN") {
    return credentials ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      SignInForm,
      {
        className,
        classNames,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting,
        callbackURL
      }
    ) : magicLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      MagicLinkForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    ) : emailOTP ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmailOTPForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    ) : null;
  }
  if (view === "TWO_FACTOR") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TwoFactorForm,
      {
        className,
        classNames,
        localization,
        otpSeparators,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "RECOVER_ACCOUNT") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecoverAccountForm,
      {
        className,
        classNames,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "MAGIC_LINK") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MagicLinkForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "EMAIL_OTP") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmailOTPForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "EMAIL_VERIFICATION") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmailVerificationForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        otpSeparators,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "FORGOT_PASSWORD") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ForgotPasswordForm,
      {
        className,
        classNames,
        localization,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "RESET_PASSWORD") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResetPasswordForm,
      {
        className,
        classNames,
        localization
      }
    );
  }
  if (view === "SIGN_UP") {
    return signUpEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SignUpForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
}
function EmailOTPButton({
  classNames,
  isSubmitting,
  localization,
  view
}) {
  var _a, _b, _c, _d;
  const { viewPaths, navigate, basePath } = reactExports.useContext(AuthUIContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      type: "button",
      variant: "secondary",
      onClick: () => navigate(
        `${basePath}/${view === "EMAIL_OTP" ? viewPaths.SIGN_IN : viewPaths.EMAIL_OTP}${window.location.search}`
      ),
      children: [
        view === "EMAIL_OTP" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        localization.SIGN_IN_WITH,
        " ",
        view === "EMAIL_OTP" ? localization.PASSWORD : localization.EMAIL_OTP
      ]
    }
  );
}
function MagicLinkButton({
  classNames,
  isSubmitting,
  localization,
  view
}) {
  var _a, _b, _c, _d;
  const { viewPaths, navigate, basePath, credentials } = reactExports.useContext(AuthUIContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      type: "button",
      variant: "secondary",
      onClick: () => navigate(
        `${basePath}/${view === "MAGIC_LINK" || !credentials ? viewPaths.SIGN_IN : viewPaths.MAGIC_LINK}${window.location.search}`
      ),
      children: [
        view === "MAGIC_LINK" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.icon }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        localization.SIGN_IN_WITH,
        " ",
        view === "MAGIC_LINK" ? localization.PASSWORD : localization.MAGIC_LINK
      ]
    }
  );
}
function OneTap({ localization, redirectTo }) {
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const oneTapFetched = reactExports.useRef(false);
  localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  reactExports.useEffect(() => {
    if (oneTapFetched.current) return;
    oneTapFetched.current = true;
    try {
      authClient.oneTap({
        fetchOptions: {
          throw: true,
          onSuccess
        }
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }, [authClient, localization, localizeErrors, onSuccess, toast2]);
  return null;
}
function PasskeyButton({
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting
}) {
  var _a, _b;
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  const signInPassKey = async () => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(true);
    try {
      const response = await authClient.signIn.passkey({
        fetchOptions: { throw: true }
      });
      if (response == null ? void 0 : response.error) {
        toast2({
          variant: "error",
          message: getLocalizedError({
            error: response.error,
            localization,
            localizeErrors
          })
        });
        setIsSubmitting == null ? void 0 : setIsSubmitting(false);
      } else {
        onSuccess();
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsSubmitting == null ? void 0 : setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      formNoValidate: true,
      name: "passkey",
      value: "true",
      variant: "secondary",
      onClick: signInPassKey,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, {}),
        localization.SIGN_IN_WITH,
        " ",
        localization.PASSKEY
      ]
    }
  );
}
function ProviderButton({
  className,
  classNames,
  callbackURL: callbackURLProp,
  isSubmitting,
  localization,
  other,
  provider,
  redirectTo: redirectToProp,
  socialLayout,
  setIsSubmitting
}) {
  var _a, _b, _c, _d;
  const {
    authClient,
    basePath,
    baseURL,
    persistClient,
    redirectTo: contextRedirectTo,
    viewPaths,
    social,
    genericOAuth,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const getRedirectTo = reactExports.useCallback(
    () => redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectToProp, contextRedirectTo]
  );
  const getCallbackURL = reactExports.useCallback(
    () => `${baseURL}${callbackURLProp || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURLProp,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const doSignInSocial = async () => {
    setIsSubmitting(true);
    try {
      if (other) {
        const oauth2Params = {
          providerId: provider.provider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true }
        };
        if (genericOAuth == null ? void 0 : genericOAuth.signIn) {
          await genericOAuth.signIn(oauth2Params);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 1e4);
        } else {
          await authClient.signIn.oauth2(oauth2Params);
        }
      } else {
        const socialParams = {
          provider: provider.provider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true }
        };
        if (social == null ? void 0 : social.signIn) {
          await social.signIn(socialParams);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 1e4);
        } else {
          await authClient.signIn.social(socialParams);
        }
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      className: cn(
        socialLayout === "vertical" ? "w-full" : "grow",
        className,
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.outlineButton,
        (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.providerButton
      ),
      disabled: isSubmitting,
      variant: "outline",
      onClick: doSignInSocial,
      children: [
        provider.icon && /* @__PURE__ */ jsxRuntimeExports.jsx(provider.icon, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        socialLayout === "grid" && provider.name,
        socialLayout === "vertical" && `${localization.SIGN_IN_WITH} ${provider.name}`
      ]
    }
  );
}
function AuthView({
  className,
  classNames,
  callbackURL,
  cardHeader,
  cardFooter,
  localization,
  path: pathProp,
  pathname,
  redirectTo,
  socialLayout: socialLayoutProp = "auto",
  view: viewProp,
  otpSeparators = 0
}) {
  var _a, _b, _c, _d, _e, _f;
  const isHydrated = useIsHydrated();
  const {
    basePath,
    credentials,
    localization: contextLocalization,
    magicLink,
    emailOTP,
    oneTap,
    passkey,
    signUp,
    social,
    genericOAuth,
    viewPaths,
    Link
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  let socialLayout = socialLayoutProp;
  if (socialLayout === "auto") {
    socialLayout = !credentials ? "vertical" : (social == null ? void 0 : social.providers) && social.providers.length > 2 ? "horizontal" : "vertical";
  }
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(viewPaths, path) || "SIGN_IN";
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handlePageHide = () => setIsSubmitting(false);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      setIsSubmitting(false);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
  if (view === "CALLBACK") return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCallback, { redirectTo });
  if (view === "SIGN_OUT") return /* @__PURE__ */ jsxRuntimeExports.jsx(SignOut, { redirectTo });
  if (view === "ACCEPT_INVITATION")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AcceptInvitationCard,
      {
        className,
        classNames
      }
    );
  const description = !credentials && !magicLink && !emailOTP ? localization.DISABLED_CREDENTIALS_DESCRIPTION : localization[`${view}_DESCRIPTION`];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: classNames == null ? void 0 : classNames.header, children: cardHeader ? cardHeader : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardTitle,
        {
          className: cn(
            "text-lg md:text-xl",
            classNames == null ? void 0 : classNames.title
          ),
          children: localization[view]
        }
      ),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: description
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: cn("grid gap-6", classNames == null ? void 0 : classNames.content), children: [
      oneTap && ["SIGN_IN", "SIGN_UP", "MAGIC_LINK", "EMAIL_OTP"].includes(
        view
      ) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        OneTap,
        {
          localization,
          redirectTo
        }
      ),
      (credentials || magicLink || emailOTP) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AuthForm,
          {
            classNames: classNames == null ? void 0 : classNames.form,
            callbackURL,
            isSubmitting,
            localization,
            otpSeparators,
            view,
            redirectTo,
            setIsSubmitting
          }
        ),
        magicLink && (credentials && [
          "FORGOT_PASSWORD",
          "SIGN_UP",
          "SIGN_IN",
          "MAGIC_LINK",
          "EMAIL_OTP"
        ].includes(view) || emailOTP && view === "EMAIL_OTP") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MagicLinkButton,
          {
            classNames,
            localization,
            view,
            isSubmitting
          }
        ),
        emailOTP && (credentials && [
          "FORGOT_PASSWORD",
          "SIGN_UP",
          "SIGN_IN",
          "MAGIC_LINK",
          "EMAIL_OTP"
        ].includes(view) || magicLink && ["SIGN_IN", "MAGIC_LINK"].includes(
          view
        )) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmailOTPButton,
          {
            classNames,
            localization,
            view,
            isSubmitting
          }
        )
      ] }),
      view !== "RESET_PASSWORD" && view !== "EMAIL_VERIFICATION" && (((_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.length) || ((_b = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _b.length) || view === "SIGN_IN" && passkey) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        (credentials || magicLink || emailOTP) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-2",
              classNames == null ? void 0 : classNames.continueWith
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Separator,
                {
                  className: cn(
                    "!w-auto grow",
                    classNames == null ? void 0 : classNames.separator
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-muted-foreground text-sm", children: localization.OR_CONTINUE_WITH }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Separator,
                {
                  className: cn(
                    "!w-auto grow",
                    classNames == null ? void 0 : classNames.separator
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          (((_c = social == null ? void 0 : social.providers) == null ? void 0 : _c.length) || ((_d = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _d.length)) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex w-full items-center justify-between gap-4",
                socialLayout === "horizontal" && "flex-wrap",
                socialLayout === "vertical" && "flex-col",
                socialLayout === "grid" && "grid grid-cols-2"
              ),
              children: [
                (_e = social == null ? void 0 : social.providers) == null ? void 0 : _e.map((provider) => {
                  const socialProvider = socialProviders.find(
                    (socialProvider2) => socialProvider2.provider === provider
                  );
                  if (!socialProvider) return null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ProviderButton,
                    {
                      classNames,
                      callbackURL,
                      isSubmitting,
                      localization,
                      provider: socialProvider,
                      redirectTo,
                      setIsSubmitting,
                      socialLayout
                    },
                    provider
                  );
                }),
                (_f = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _f.map(
                  (provider) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ProviderButton,
                    {
                      classNames,
                      callbackURL,
                      isSubmitting,
                      localization,
                      provider,
                      redirectTo,
                      setIsSubmitting,
                      socialLayout,
                      other: true
                    },
                    provider.provider
                  )
                )
              ]
            }
          ),
          passkey && [
            "SIGN_IN",
            "MAGIC_LINK",
            "EMAIL_OTP",
            "RECOVER_ACCOUNT",
            "TWO_FACTOR",
            "FORGOT_PASSWORD"
          ].includes(view) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            PasskeyButton,
            {
              classNames,
              isSubmitting,
              localization,
              redirectTo,
              setIsSubmitting
            }
          )
        ] })
      ] })
    ] }),
    cardFooter && /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: classNames == null ? void 0 : classNames.footer, children: cardFooter }),
    credentials && signUp && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardFooter,
      {
        className: cn(
          "justify-center gap-1.5 text-muted-foreground text-sm",
          classNames == null ? void 0 : classNames.footer
        ),
        children: [
          view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? localization.DONT_HAVE_AN_ACCOUNT : view === "SIGN_UP" ? localization.ALREADY_HAVE_AN_ACCOUNT : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3" }),
          view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" || view === "SIGN_UP" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              className: cn(
                "text-foreground underline",
                classNames == null ? void 0 : classNames.footerLink
              ),
              href: `${basePath}/${viewPaths[view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? "SIGN_UP" : "SIGN_IN"]}${isHydrated ? window.location.search : ""}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "link",
                  size: "sm",
                  className: cn(
                    "px-0 text-foreground underline",
                    classNames == null ? void 0 : classNames.footerLink
                  ),
                  children: view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? localization.SIGN_UP : localization.SIGN_IN
                }
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "link",
              size: "sm",
              className: cn(
                "px-0 text-foreground underline",
                classNames == null ? void 0 : classNames.footerLink
              ),
              onClick: () => window.history.back(),
              children: localization.GO_BACK
            }
          )
        ]
      }
    )
  ] });
}
function SignInPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.signIn) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.SIGN_IN,
      ...rest,
      localization
    }
  ) });
}
const signInPage_internalHHDVE5SC = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignInPageInternal
});
function SignUpPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.signUp) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.SIGN_UP,
      ...rest,
      localization
    }
  ) });
}
const signUpPage_internalRSSBE43R = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignUpPageInternal
});
function ForgotPasswordPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.forgotPassword) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.FORGOT_PASSWORD,
      ...rest,
      localization
    }
  ) });
}
const forgotPasswordPage_internalETDVCAUC = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ForgotPasswordPageInternal
});
function ResetPasswordPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.resetPassword) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.RESET_PASSWORD,
      ...rest,
      localization
    }
  ) });
}
const resetPasswordPage_internalGOVT5BCU = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ResetPasswordPageInternal
});
function MagicLinkPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.magicLink) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.MAGIC_LINK,
      ...rest,
      localization
    }
  ) });
}
const magicLinkPage_internalCIV4B5FS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  MagicLinkPageInternal
});
function EmailOtpPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.emailOtp) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.EMAIL_OTP,
      ...rest,
      localization
    }
  ) });
}
const emailOtpPage_internalFPZRJQUL = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  EmailOtpPageInternal
});
function TwoFactorPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.twoFactor) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.TWO_FACTOR,
      ...rest,
      localization
    }
  ) });
}
const twoFactorPage_internalSEG5Q42X = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  TwoFactorPageInternal
});
function RecoverAccountPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.recoverAccount) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.RECOVER_ACCOUNT,
      ...rest,
      localization
    }
  ) });
}
const recoverAccountPage_internalSZ6YMTCT = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  RecoverAccountPageInternal
});
function CallbackPageInternal() {
  var _a;
  const { pageProps } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCallback, { redirectTo: (_a = pageProps == null ? void 0 : pageProps.callback) == null ? void 0 : _a.redirectTo }) });
}
const callbackPage_internalI5U7VSTZ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CallbackPageInternal
});
function SignOutPageInternal() {
  var _a;
  const { pageProps } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SignOut, { redirectTo: (_a = pageProps == null ? void 0 : pageProps.signOut) == null ? void 0 : _a.redirectTo }) });
}
const signOutPage_internal4E5FNQKY = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  SignOutPageInternal
});
function AcceptInvitationPageInternal() {
  var _a;
  const { pageProps } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AcceptInvitationCard,
    {
      className: (_a = pageProps == null ? void 0 : pageProps.acceptInvitation) == null ? void 0 : _a.className
    }
  ) });
}
const acceptInvitationPage_internal5RS4QNQO = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  AcceptInvitationPageInternal
});
function EmailVerificationPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.emailVerification) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthView,
    {
      path: authViewPaths.EMAIL_VERIFICATION,
      ...rest,
      localization
    }
  ) });
}
const emailVerificationPage_internalE7EMM4LT = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  EmailVerificationPageInternal
});
function CreateTeamDialog({
  classNames,
  localization: localizationProp,
  refetch,
  organizationId,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    localizeErrors,
    toast: toast2
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const formSchema = object({
    name: string().min(1, {
      message: `${localization.TEAM_NAME} ${localization.IS_REQUIRED}`
    }).max(64, {
      message: localization.TEAM_NAME_INSTRUCTIONS
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      name: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  async function onSubmit({ name }) {
    if (!organizationId) return;
    try {
      await authClient.organization.createTeam({
        name,
        organizationId,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      toast2({
        variant: "success",
        message: localization.CREATE_TEAM_SUCCESS
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogTitle,
        {
          className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
          children: localization.CREATE_TEAM
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.TEAM_NAME_DESCRIPTION
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        method: "POST",
        onSubmit: form.handleSubmit(onSubmit),
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: localization.TEAM_NAME }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: localization.TEAM_NAME_PLACEHOLDER,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                children: localization.CANCEL
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                disabled: isSubmitting || !organizationId,
                children: [
                  isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                  localization.CREATE_TEAM
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function DeleteOrganizationDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  organization,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    account: accountOptions,
    hooks: { useListOrganizations },
    localization: contextLocalization,
    navigate,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganizations } = useListOrganizations();
  const formSchema = object({
    slug: string().min(1, { message: localization.SLUG_REQUIRED }).refine((val) => val === organization.slug, {
      message: localization.SLUG_DOES_NOT_MATCH
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      slug: ""
    }
  });
  const { isSubmitting } = form.formState;
  const deleteOrganization = async () => {
    try {
      await authClient.organization.delete({
        organizationId: organization.id,
        fetchOptions: { throw: true }
      });
      await (refetchOrganizations == null ? void 0 : refetchOrganizations());
      toast2({
        variant: "success",
        message: localization.DELETE_ORGANIZATION_SUCCESS
      });
      navigate(
        `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths.ORGANIZATIONS}`
      );
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: cn("sm:max-w-md", (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization == null ? void 0 : localization.DELETE_ORGANIZATION
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn("my-2 flex-row p-4", classNames == null ? void 0 : classNames.cell), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationCellView,
          {
            organization,
            localization
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            method: "POST",
            onSubmit: form.handleSubmit(deleteOrganization),
            className: "grid gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "slug",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                      localization == null ? void 0 : localization.DELETE_ORGANIZATION_INSTRUCTIONS,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: organization.slug })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: organization.slug,
                        className: classNames == null ? void 0 : classNames.input,
                        autoComplete: "off",
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FormMessage,
                      {
                        className: classNames == null ? void 0 : classNames.error
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "secondary",
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.secondaryButton
                    ),
                    onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                    children: localization.CANCEL
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.destructiveButton
                    ),
                    disabled: isSubmitting,
                    variant: "destructive",
                    type: "submit",
                    children: [
                      isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                      localization == null ? void 0 : localization.DELETE_ORGANIZATION
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  ) });
}
function DeleteOrganizationCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        description: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION,
        isPending: true,
        title: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        variant: "destructive"
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DeleteOrganizationForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function DeleteOrganizationForm({
  className,
  classNames,
  localization: localizationProp,
  organization
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission }
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: hasPermission, isPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["delete"]
    }
  });
  const [showDialog, setShowDialog] = reactExports.useState(false);
  if (!(hasPermission == null ? void 0 : hasPermission.success)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        description: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION,
        isPending,
        title: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        variant: "destructive",
        action: () => setShowDialog(true)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteOrganizationDialog,
      {
        classNames,
        localization,
        open: showDialog,
        onOpenChange: setShowDialog,
        organization
      }
    )
  ] });
}
function DeleteTeamDialog({
  classNames,
  team,
  localization: localizationProp,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({
      ...contextLocalization,
      ...localizationProp
    }),
    [contextLocalization, localizationProp]
  );
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await authClient.organization.removeTeam({
        teamId: team.id,
        organizationId: team.organizationId,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.DELETE_TEAM_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.DELETE_TEAM
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.REMOVE_TEAM_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: cn(
              "my-2 flex-row items-center gap-3 px-4 py-3",
              classNames == null ? void 0 : classNames.cell
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Users,
                {
                  className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              disabled: isDeleting,
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              type: "button",
              variant: "secondary",
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isDeleting,
              onClick: handleDelete,
              type: "button",
              variant: "destructive",
              children: [
                isDeleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function InvitationCell({
  className,
  classNames,
  invitation,
  localization: localizationProp,
  organization
}) {
  const {
    authClient,
    hooks: { useListInvitations },
    organization: organizationOptions,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { lang } = useLang();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === invitation.role);
  const { refetch } = useListInvitations({
    query: { organizationId: organization == null ? void 0 : organization.id }
  });
  const handleCancelInvitation = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      toast2({
        variant: "success",
        message: localization.INVITATION_CANCELLED
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center p-4",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UserAvatar,
            {
              className: "my-0.5",
              user: invitation,
              localization
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 text-left leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: invitation.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate text-muted-foreground text-xs", children: [
              localization.EXPIRES,
              " ",
              invitation.expiresAt.toLocaleDateString(lang ?? "en")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm opacity-70", children: role == null ? void 0 : role.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isLoading,
              size: "icon",
              type: "button",
              variant: "outline",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DropdownMenuContent,
            {
              onCloseAutoFocus: (e) => e.preventDefault(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DropdownMenuItem,
                {
                  onClick: handleCancelInvitation,
                  disabled: isLoading,
                  variant: "destructive",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: classNames == null ? void 0 : classNames.icon }),
                    localization.CANCEL_INVITATION
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function OrganizationInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  emptyState,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationInvitationsContent,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationInvitationsContent({
  className,
  classNames,
  localization: localizationProp,
  organization,
  emptyState,
  ...props
}) {
  const {
    hooks: { useListInvitations },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: invitations } = useListInvitations({
    query: { organizationId: organization.id }
  });
  const pendingInvitations = invitations == null ? void 0 : invitations.filter(
    (invitation) => invitation.status === "pending"
  );
  if (!(pendingInvitations == null ? void 0 : pendingInvitations.length)) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: emptyState });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PENDING_INVITATIONS,
      description: localization.PENDING_INVITATIONS_DESCRIPTION,
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: pendingInvitations.map((invitation) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        InvitationCell,
        {
          classNames,
          invitation,
          localization,
          organization
        },
        invitation.id
      )) })
    }
  );
}
function OrganizationLogoCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: cn(
          "w-full pb-0 text-start",
          className,
          classNames == null ? void 0 : classNames.base
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingsCardHeader,
              {
                className: "grow self-start",
                title: localization.LOGO,
                description: localization.LOGO_DESCRIPTION,
                isPending: true,
                classNames
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                disabled: true,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OrganizationLogo,
                  {
                    isPending: true,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    localization
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingsCardFooter,
            {
              className: "!py-5",
              instructions: localization.LOGO_INSTRUCTIONS,
              classNames,
              isPending: true
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationLogoForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationLogoForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    hooks: { useHasPermission },
    localization: authLocalization2,
    organization: organizationOptions,
    mutators: { updateOrganization },
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...authLocalization2, ...localizationProp }),
    [authLocalization2, localizationProp]
  );
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const isPending = permissionPending;
  const fileInputRef = reactExports.useRef(null);
  const [loading, setLoading] = reactExports.useState(false);
  const handleLogoChange = async (file) => {
    if (!(organizationOptions == null ? void 0 : organizationOptions.logo) || !(hasPermission == null ? void 0 : hasPermission.success)) return;
    setLoading(true);
    const resizedFile = await resizeAndCropImage(
      file,
      crypto.randomUUID(),
      organizationOptions.logo.size,
      organizationOptions.logo.extension
    );
    let image;
    if (organizationOptions.logo.upload) {
      image = await organizationOptions.logo.upload(resizedFile);
    } else {
      image = await fileToBase64(resizedFile);
    }
    if (!image) {
      setLoading(false);
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { logo: image }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const handleDeleteLogo = async () => {
    var _a, _b;
    if (!(hasPermission == null ? void 0 : hasPermission.success)) return;
    setLoading(true);
    try {
      if (organization.logo) {
        await ((_b = (_a = organizationOptions == null ? void 0 : organizationOptions.logo) == null ? void 0 : _a.delete) == null ? void 0 : _b.call(_a, organization.logo));
      }
      await updateOrganization({
        organizationId: organization.id,
        data: { logo: "" }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const openFileDialog = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "w-full pb-0 text-start",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            accept: "image/*",
            disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
            hidden: true,
            type: "file",
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a.item(0);
              if (file) handleLogoChange(file);
              e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingsCardHeader,
            {
              className: "grow self-start",
              title: localization.LOGO,
              description: localization.LOGO_DESCRIPTION,
              isPending,
              classNames
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                disabled: !(hasPermission == null ? void 0 : hasPermission.success),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OrganizationLogo,
                  {
                    isPending: isPending || loading,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    organization,
                    localization
                  },
                  organization.logo
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuContent,
              {
                align: "end",
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: openFileDialog,
                      disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, {}),
                        localization.UPLOAD_LOGO
                      ]
                    }
                  ),
                  organization.logo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: handleDeleteLogo,
                      disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {}),
                        localization.DELETE_LOGO
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsCardFooter,
          {
            className: "!py-5",
            instructions: localization.LOGO_INSTRUCTIONS,
            classNames,
            isPending,
            isSubmitting: loading
          }
        )
      ]
    }
  );
}
function InviteMemberDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  organization,
  ...props
}) {
  var _a, _b, _c;
  const {
    teams: teamOptions,
    authClient,
    hooks: { useListInvitations, useListMembers, useSession, useListTeams },
    localization: contextLocalization,
    toast: toast2,
    organization: organizationOptions,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const { enabled: teamsEnabled } = teamOptions || {};
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data } = useListMembers({
    query: { organizationId: organization.id }
  });
  const { refetch } = useListInvitations({
    query: { organizationId: organization.id }
  });
  const members = data == null ? void 0 : data.members;
  const { data: sessionData } = useSession();
  const membership = members == null ? void 0 : members.find((m) => m.userId === (sessionData == null ? void 0 : sessionData.user.id));
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const availableRoles = roles.filter(
    (role) => (membership == null ? void 0 : membership.role) === "owner" || role.role !== "owner"
  );
  const { data: teams } = teamsEnabled ? useListTeams({
    organizationId: organization.id
  }) : { data: void 0 };
  const formSchema = object({
    email: string().min(1, { message: localization.EMAIL_REQUIRED }).email({
      message: localization.INVALID_EMAIL
    }),
    role: string().min(1, {
      message: `${localization.ROLE} ${localization.IS_REQUIRED}`
    }),
    teamId: string().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      email: "",
      role: "member",
      teamId: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  async function onSubmit({
    email,
    role,
    teamId
  }) {
    try {
      await authClient.organization.inviteMember({
        email,
        role,
        organizationId: organization.id,
        fetchOptions: { throw: true },
        ...teamsEnabled && { teamId }
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      toast2({
        variant: "success",
        message: localization.SEND_INVITATION_SUCCESS || "Invitation sent successfully"
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogTitle,
        {
          className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
          children: localization.INVITE_MEMBER
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.INVITE_MEMBER_DESCRIPTION
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        method: "POST",
        onSubmit: form.handleSubmit(onSubmit),
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: localization.EMAIL_PLACEHOLDER,
                    type: "email",
                    ...field,
                    className: classNames == null ? void 0 : classNames.input
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "role",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.ROLE
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      onValueChange: field.onChange,
                      defaultValue: field.value,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: availableRoles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectItem,
                          {
                            value: role.role,
                            children: role.label
                          },
                          role.role
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            ),
            teamsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "teamId",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.TEAM
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      onValueChange: field.onChange,
                      defaultValue: field.value,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectValue,
                          {
                            placeholder: localization.SELECT_TEAMS
                          }
                        ) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: teams == null ? void 0 : teams.map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectItem,
                          {
                            value: team.id,
                            children: team.name
                          },
                          team.id
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                children: localization.CANCEL
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                disabled: isSubmitting,
                children: [
                  isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                  localization.SEND_INVITATION
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function RemoveMemberDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    hooks: { useListMembers },
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const [isRemoving, setIsRemoving] = reactExports.useState(false);
  const removeMember = async () => {
    setIsRemoving(true);
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
        organizationId: member.organizationId,
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.REMOVE_MEMBER_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsRemoving(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.REMOVE_MEMBER
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.REMOVE_MEMBER_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MemberCell,
          {
            className: classNames == null ? void 0 : classNames.cell,
            member,
            localization,
            hideActions: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isRemoving,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: removeMember,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isRemoving,
              children: [
                isRemoving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.REMOVE_MEMBER
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function UpdateMemberRoleDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c, _d;
  const {
    authClient,
    hooks: { useSession, useListMembers },
    localization: contextLocalization,
    organization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data, refetch } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const members = data == null ? void 0 : data.members;
  const { data: sessionData } = useSession();
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [selectedRole, setSelectedRole] = reactExports.useState(member.role);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organization == null ? void 0 : organization.customRoles) || []];
  const currentUserRole = (_a = members == null ? void 0 : members.find(
    (m) => {
      var _a2;
      return ((_a2 = m.user) == null ? void 0 : _a2.id) === (sessionData == null ? void 0 : sessionData.user.id);
    }
  )) == null ? void 0 : _a.role;
  const availableRoles = roles.filter((role) => {
    if (role.role === "owner") {
      return currentUserRole === "owner";
    }
    if (role.role === "admin") {
      return currentUserRole === "owner" || currentUserRole === "admin";
    }
    return true;
  });
  const updateMemberRole = async () => {
    if (selectedRole === member.role) {
      toast2({
        variant: "error",
        message: `${localization.ROLE} ${localization.IS_THE_SAME}`
      });
      return;
    }
    setIsUpdating(true);
    try {
      await authClient.organization.updateMemberRole({
        memberId: member.id,
        role: selectedRole,
        organizationId: member.organizationId,
        fetchOptions: {
          throw: true
        }
      });
      toast2({
        variant: "success",
        message: localization.MEMBER_ROLE_UPDATED
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsUpdating(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_ROLE
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_ROLE_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MemberCell,
            {
              className: classNames == null ? void 0 : classNames.cell,
              member,
              localization,
              hideActions: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedRole,
              onValueChange: setSelectedRole,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectValue,
                  {
                    placeholder: localization.SELECT_ROLE
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: availableRoles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: role.role, children: role.label }, role.role)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_d = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _d.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isUpdating,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: updateMemberRole,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              disabled: isUpdating,
              children: [
                isUpdating && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.UPDATE_ROLE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function UpdateMemberTeamCell({
  className,
  classNames,
  userId,
  team,
  added,
  localization,
  refetch
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const handleAddRemoveTeam = async () => {
    try {
      setIsUpdating(true);
      if (added) {
        await authClient.organization.removeTeamMember({
          teamId: team.id,
          userId,
          fetchOptions: { throw: true }
        });
        toast2({
          variant: "success",
          message: localization.REMOVE_TEAM_MEMBER_SUCCESS
        });
      } else {
        await authClient.organization.addTeamMember({
          teamId: team.id,
          userId,
          fetchOptions: { throw: true }
        });
        toast2({
          variant: "success",
          message: localization.ADD_TEAM_MEMBER_SUCCESS
        });
      }
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Users,
          {
            className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isUpdating,
            size: "sm",
            variant: "outline",
            onClick: handleAddRemoveTeam,
            children: [
              isUpdating && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
              added ? localization.REMOVE : localization.ADD
            ]
          }
        )
      ]
    }
  );
}
function UpdateMemberTeamsDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    hooks: { useListTeams, useListUserTeams },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const {
    data: memberTeams,
    isPending: memberTeamsPending,
    refetch
  } = useListUserTeams();
  function isAdded(teamId) {
    return (memberTeams == null ? void 0 : memberTeams.some((mt) => mt.id === teamId)) ?? false;
  }
  const { data: orgTeams, isPending: orgTeamsPending } = useListTeams({
    organizationId: member.organizationId
  });
  const isPending = memberTeamsPending || orgTeamsPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_TEAMS
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_TEAMS_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MemberCell,
            {
              className: classNames == null ? void 0 : classNames.cell,
              member,
              localization,
              hideActions: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: localization.TEAMS }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CardContent,
              {
                className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SettingsCellSkeleton,
                  {
                    classNames
                  },
                  "skeleton"
                ) : orgTeams && orgTeams.length > 0 ? orgTeams.sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ).map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  UpdateMemberTeamCell,
                  {
                    classNames,
                    added: isAdded(team.id),
                    userId: member.userId,
                    localization,
                    refetch,
                    team
                  },
                  team.id
                )) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            disabled: isPending,
            children: localization.DONE
          }
        ) })
      ]
    }
  ) });
}
function MemberCell({
  className,
  classNames,
  member,
  localization: localizationProp,
  hideActions
}) {
  var _a;
  const {
    teams: teamOptions,
    organization: organizationOptions,
    hooks: {
      useListMembers,
      useSession,
      useListOrganizations,
      useHasPermission
    },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  const { enabled: teamsEnabled } = teamOptions || {};
  const localization = { ...contextLocalization, ...localizationProp };
  const { data: sessionData } = useSession();
  const [removeDialogOpen, setRemoveDialogOpen] = reactExports.useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = reactExports.useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = reactExports.useState(false);
  const [updateTeamsDialogOpen, setUpdateTeamsDialogOpen] = reactExports.useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const { data } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const members = data == null ? void 0 : data.members;
  const myRole = (_a = members == null ? void 0 : members.find(
    (m) => {
      var _a2;
      return ((_a2 = m.user) == null ? void 0 : _a2.id) === (sessionData == null ? void 0 : sessionData.user.id);
    }
  )) == null ? void 0 : _a.role;
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === member.role);
  const isSelf = (sessionData == null ? void 0 : sessionData.user.id) === (member == null ? void 0 : member.userId);
  const { data: organizations } = useListOrganizations();
  const organization = organizations == null ? void 0 : organizations.find(
    (org) => org.id === member.organizationId
  );
  const { data: hasPermissionToUpdateMember } = useHasPermission({
    organizationId: member.organizationId,
    permissions: { member: ["update"] }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center p-4",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UserView,
            {
              user: member.user,
              localization,
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-70", children: role == null ? void 0 : role.label }),
          !hideActions && (isSelf || member.role !== "owner" || myRole === "owner") && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: cn(
                  "relative ms-auto",
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                size: "icon",
                type: "button",
                variant: "outline",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ellipsis,
                  {
                    className: classNames == null ? void 0 : classNames.icon
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuContent,
              {
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  (hasPermissionToUpdateMember == null ? void 0 : hasPermissionToUpdateMember.success) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => setUpdateRoleDialogOpen(true),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            UserCog,
                            {
                              className: classNames == null ? void 0 : classNames.icon
                            }
                          ),
                          localization == null ? void 0 : localization.UPDATE_ROLE
                        ]
                      }
                    ),
                    teamsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => setUpdateTeamsDialogOpen(
                          true
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Users,
                            {
                              className: classNames == null ? void 0 : classNames.icon
                            }
                          ),
                          localization == null ? void 0 : localization.UPDATE_TEAMS
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      onClick: () => isSelf ? setLeaveDialogOpen(true) : setRemoveDialogOpen(true),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: classNames == null ? void 0 : classNames.icon }),
                        isSelf ? localization == null ? void 0 : localization.LEAVE_ORGANIZATION : localization == null ? void 0 : localization.REMOVE_MEMBER
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RemoveMemberDialog,
      {
        open: removeDialogOpen,
        onOpenChange: setRemoveDialogOpen,
        member,
        classNames,
        localization
      }
    ),
    organization && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LeaveOrganizationDialog,
      {
        open: leaveDialogOpen,
        onOpenChange: setLeaveDialogOpen,
        organization,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateMemberRoleDialog,
      {
        open: updateRoleDialogOpen,
        onOpenChange: setUpdateRoleDialogOpen,
        member,
        classNames,
        localization
      }
    ),
    teamsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateMemberTeamsDialog,
      {
        open: updateTeamsDialogOpen,
        onOpenChange: setUpdateTeamsDialogOpen,
        member,
        classNames,
        localization
      }
    )
  ] });
}
function OrganizationMembersCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.MEMBERS,
        description: localization.MEMBERS_DESCRIPTION,
        instructions: localization.MEMBERS_INSTRUCTIONS,
        actionLabel: localization.INVITE_MEMBER,
        isPending: true,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationMembersContent,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationMembersContent({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    hooks: { useHasPermission, useListMembers },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: hasPermissionInvite, isPending: isPendingInvite } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      invitation: ["create"]
    }
  });
  const {
    data: hasPermissionUpdateMember,
    isPending: isPendingUpdateMember
  } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      member: ["update"]
    }
  });
  const isPending = isPendingInvite || isPendingUpdateMember;
  const { data } = useListMembers({
    query: { organizationId: organization.id }
  });
  const members = data == null ? void 0 : data.members;
  const [inviteDialogOpen, setInviteDialogOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.MEMBERS,
        description: localization.MEMBERS_DESCRIPTION,
        instructions: localization.MEMBERS_INSTRUCTIONS,
        actionLabel: localization.INVITE_MEMBER,
        action: () => setInviteDialogOpen(true),
        isPending,
        disabled: !(hasPermissionInvite == null ? void 0 : hasPermissionInvite.success),
        ...props,
        children: !isPending && members && members.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardContent,
          {
            className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
            children: members.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ).map((member) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MemberCell,
              {
                classNames,
                member,
                localization,
                hideActions: !(hasPermissionUpdateMember == null ? void 0 : hasPermissionUpdateMember.success)
              },
              member.id
            ))
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InviteMemberDialog,
      {
        open: inviteDialogOpen,
        onOpenChange: setInviteDialogOpen,
        classNames,
        localization,
        organization
      }
    )
  ] });
}
function OrganizationNameCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.SAVE,
        description: localization.ORGANIZATION_NAME_DESCRIPTION,
        instructions: localization.ORGANIZATION_NAME_INSTRUCTIONS,
        isPending: true,
        title: localization.ORGANIZATION_NAME,
        ...props,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton)
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationNameForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationNameForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission },
    mutators: { updateOrganization },
    optimistic,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...localizationProp };
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const isPending = permissionPending;
  const formSchema = object({
    name: string().min(1, {
      message: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    values: { name: organization.name || "" }
  });
  const { isSubmitting } = form.formState;
  const updateOrganizationName = async ({
    name
  }) => {
    if (organization.name === name) {
      toast2({
        variant: "error",
        message: `${localization.ORGANIZATION_NAME} ${localization.IS_THE_SAME}`
      });
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { name }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
      toast2({
        variant: "success",
        message: `${localization.ORGANIZATION_NAME} ${localization.UPDATED_SUCCESSFULLY}`
      });
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(updateOrganizationName),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsCard,
        {
          className,
          classNames,
          description: localization.ORGANIZATION_NAME_DESCRIPTION,
          instructions: localization.ORGANIZATION_NAME_INSTRUCTIONS,
          isPending,
          title: localization.ORGANIZATION_NAME,
          actionLabel: localization.SAVE,
          optimistic,
          disabled: !(hasPermission == null ? void 0 : hasPermission.success),
          ...props,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn(
                "h-9 w-full",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: localization.ORGANIZATION_NAME_PLACEHOLDER,
                    disabled: isSubmitting || !(hasPermission == null ? void 0 : hasPermission.success),
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            }
          ) })
        }
      )
    }
  ) });
}
function OrganizationSlugCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        className,
        classNames,
        description: localization.ORGANIZATION_SLUG_DESCRIPTION,
        instructions: localization.ORGANIZATION_SLUG_INSTRUCTIONS,
        isPending: true,
        title: localization.ORGANIZATION_SLUG,
        actionLabel: localization.SAVE,
        ...props,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton)
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationSlugForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationSlugForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission },
    mutators: { updateOrganization },
    optimistic,
    toast: toast2,
    organization: organizationOptions,
    replace,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const { data: hasPermission, isPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const formSchema = object({
    slug: string().min(1, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`
    }).regex(/^[a-z0-9-]+$/, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    values: { slug: organization.slug || "" }
  });
  const { isSubmitting } = form.formState;
  const updateOrganizationSlug = async ({
    slug
  }) => {
    if (organization.slug === slug) {
      toast2({
        variant: "error",
        message: `${localization.ORGANIZATION_SLUG} ${localization.IS_THE_SAME}`
      });
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { slug }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
      toast2({
        variant: "success",
        message: `${localization.ORGANIZATION_SLUG} ${localization.UPDATED_SUCCESSFULLY}`
      });
      if ((organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug") {
        const basePath = organizationOptions.basePath;
        const settingsPath = organizationOptions.viewPaths.SETTINGS;
        replace(`${basePath}/${slug}/${settingsPath}`);
      }
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(updateOrganizationSlug),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingsCard,
        {
          className,
          classNames,
          description: localization.ORGANIZATION_SLUG_DESCRIPTION,
          instructions: localization.ORGANIZATION_SLUG_INSTRUCTIONS,
          isPending,
          title: localization.ORGANIZATION_SLUG,
          actionLabel: localization.SAVE,
          optimistic,
          disabled: !(hasPermission == null ? void 0 : hasPermission.success),
          ...props,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: cn(
                "h-9 w-full",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: localization.ORGANIZATION_SLUG_PLACEHOLDER,
                    disabled: isSubmitting || !(hasPermission == null ? void 0 : hasPermission.success),
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            }
          ) })
        }
      )
    }
  ) });
}
function OrganizationSettingsCards({
  className,
  classNames,
  localization,
  slug
}) {
  const { organization: organizationOptions } = reactExports.useContext(AuthUIContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        (organizationOptions == null ? void 0 : organizationOptions.logo) && /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationLogoCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationNameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationSlugCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteOrganizationCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        )
      ]
    }
  );
}
var fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "group",
      "data-slot": "field",
      "data-orientation": orientation,
      className: cn(fieldVariants({ orientation }), className),
      ...props
    }
  );
}
function FieldLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label2,
    {
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      ...props
    }
  );
}
function UpdateTeamDialog({
  classNames,
  team,
  localization: localizationProp,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    toast: toast2,
    localizeErrors
  } = reactExports.useContext(AuthUIContext);
  const localization = reactExports.useMemo(
    () => ({
      ...contextLocalization,
      ...localizationProp
    }),
    [contextLocalization, localizationProp]
  );
  const [isUpdating, setIsUpdating] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(team.name);
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await authClient.organization.updateTeam({
        teamId: team.id,
        data: { name },
        fetchOptions: { throw: true }
      });
      toast2({
        variant: "success",
        message: localization.UPDATE_TEAM_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast2({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_TEAM
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_TEAM_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: cn(
              "my-2 flex-row items-center gap-3 px-4 py-3",
              classNames == null ? void 0 : classNames.cell
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Users,
                {
                  className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: "name", children: localization.TEAM_NAME }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              onChange: (e) => setName(e.target.value),
              placeholder: localization.TEAM_NAME_PLACEHOLDER,
              required: true,
              value: name
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              disabled: isUpdating,
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              type: "button",
              variant: "secondary",
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              disabled: isUpdating || name.trim().length === 0,
              onClick: handleUpdate,
              type: "button",
              children: [
                isUpdating && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
                localization.UPDATE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function TeamCell({
  className,
  classNames,
  team,
  localization,
  canDelete,
  canUpdate,
  refetch
}) {
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center gap-3 truncate px-4 py-3",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Users,
            {
              className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: cn(
                  "relative ms-auto",
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                size: "icon",
                type: "button",
                variant: "outline",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DropdownMenuContent,
              {
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      disabled: !canUpdate,
                      onSelect: () => setShowUpdateDialog(true),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: classNames == null ? void 0 : classNames.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          " ",
                          localization == null ? void 0 : localization.UPDATE_TEAM
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    DropdownMenuItem,
                    {
                      disabled: !canDelete,
                      onClick: () => setShowDeleteDialog(true),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: classNames == null ? void 0 : classNames.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: localization == null ? void 0 : localization.DELETE_TEAM })
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setShowUpdateDialog,
        open: showUpdateDialog,
        refetch,
        team
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setShowDeleteDialog,
        open: showDeleteDialog,
        refetch,
        team
      }
    )
  ] });
}
function TeamsCard({
  className,
  classNames,
  localization,
  organizationId,
  ...props
}) {
  const {
    hooks: { useHasPermission, useListTeams },
    localization: contextLocalization
  } = reactExports.useContext(AuthUIContext);
  localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const isHydrated = useIsHydrated();
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  const { data: hasPermissionCreate, isPending: permissionCreatePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["create"]
    }
  });
  const { data: hasPermissionUpdate, isPending: permissionUpdatePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["update"]
    }
  });
  const { data: hasPermissionDelete, isPending: permissionDeletePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["delete"]
    }
  });
  const {
    data: teams,
    isPending: teamsPending,
    refetch
  } = useListTeams({
    organizationId
  });
  const isPending = !isHydrated || permissionCreatePending || permissionUpdatePending || permissionDeletePending || teamsPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingsCard,
      {
        action: () => setCreateDialogOpen(true),
        actionLabel: localization.CREATE_TEAM,
        className,
        classNames,
        description: localization.TEAMS_DESCRIPTION,
        disabled: !(hasPermissionCreate == null ? void 0 : hasPermissionCreate.success),
        instructions: localization.CREATE_TEAM_INSTRUCTIONS,
        isPending,
        title: localization.TEAMS,
        ...props,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsCellSkeleton, {}) : teams && teams.length > 0 ? teams.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ).map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TeamCell,
          {
            canDelete: !!(hasPermissionDelete == null ? void 0 : hasPermissionDelete.success),
            canUpdate: !!(hasPermissionUpdate == null ? void 0 : hasPermissionUpdate.success),
            classNames,
            localization,
            refetch,
            team
          },
          team.id
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setCreateDialogOpen,
        open: createDialogOpen,
        organizationId,
        refetch
      }
    )
  ] });
}
function OrganizationView({
  className,
  classNames,
  localization: localizationProp,
  path: pathProp,
  pathname,
  view: viewProp,
  hideNav,
  slug: slugProp
}) {
  var _a, _b, _c;
  const {
    teams: teamOptions,
    organization: organizationOptions,
    localization: contextLocalization,
    account: accountOptions,
    Link,
    replace
  } = reactExports.useContext(AuthUIContext);
  const { slug: contextSlug, viewPaths, apiKey } = organizationOptions || {};
  const { enabled: teamsEnabled } = teamOptions || {};
  useAuthenticate();
  const localization = reactExports.useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(viewPaths, path) || "SETTINGS";
  const slug = slugProp || contextSlug;
  const {
    data: organization,
    isPending: organizationPending,
    isRefetching: organizationRefetching
  } = useCurrentOrganization({ slug });
  const navItems = [
    { view: "SETTINGS", label: localization.SETTINGS },
    { view: "MEMBERS", label: localization.MEMBERS }
  ];
  if (teamsEnabled) {
    navItems.push({
      view: "TEAMS",
      label: localization.TEAMS
    });
  }
  if (apiKey) {
    navItems.push({
      view: "API_KEYS",
      label: localization.API_KEYS
    });
  }
  reactExports.useEffect(() => {
    var _a2;
    if (organization || organizationPending || organizationRefetching)
      return;
    replace(
      `${accountOptions == null ? void 0 : accountOptions.basePath}/${(_a2 = accountOptions == null ? void 0 : accountOptions.viewPaths) == null ? void 0 : _a2.ORGANIZATIONS}`
    );
  }, [
    organization,
    organizationPending,
    organizationRefetching,
    accountOptions == null ? void 0 : accountOptions.basePath,
    (_a = accountOptions == null ? void 0 : accountOptions.viewPaths) == null ? void 0 : _a.ORGANIZATIONS,
    replace
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex w-full grow flex-col gap-4 md:flex-row md:gap-12",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2 md:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label2, { className: "font-semibold text-base", children: (_b = navItems.find((i) => i.view === view)) == null ? void 0 : _b.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Drawer, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerTitle, { className: "hidden", children: localization.ORGANIZATION }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col px-4 pb-4", children: navItems.map((item) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    href: `${organizationOptions == null ? void 0 : organizationOptions.basePath}${(organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug" ? `/${slug}` : ""}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths[item.view]}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "lg",
                        className: cn(
                          "w-full justify-start px-4 transition-none",
                          (_a2 = classNames == null ? void 0 : classNames.drawer) == null ? void 0 : _a2.menuItem,
                          view === item.view ? "font-semibold" : "text-foreground/70"
                        ),
                        variant: "ghost",
                        children: item.label
                      }
                    )
                  },
                  item.view
                );
              }) })
            ] })
          ] })
        ] }),
        !hideNav && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex w-48 flex-col gap-1 lg:w-60",
              (_c = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _c.base
            ),
            children: navItems.map((item) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  href: `${organizationOptions == null ? void 0 : organizationOptions.basePath}${(organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug" ? `/${slug}` : ""}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths[item.view]}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "lg",
                      className: cn(
                        "w-full justify-start px-4 transition-none",
                        (_a2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _a2.button,
                        view === item.view ? "font-semibold" : "text-foreground/70",
                        view === item.view && ((_b2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _b2.buttonActive)
                      ),
                      variant: "ghost",
                      children: item.label
                    }
                  )
                },
                item.view
              );
            })
          }
        ) }),
        view === "MEMBERS" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex w-full flex-col gap-4 md:gap-6",
              className,
              classNames == null ? void 0 : classNames.cards
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                OrganizationMembersCard,
                {
                  classNames: classNames == null ? void 0 : classNames.card,
                  localization,
                  slug
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                OrganizationInvitationsCard,
                {
                  classNames: classNames == null ? void 0 : classNames.card,
                  localization,
                  slug
                }
              )
            ]
          }
        ),
        view === "TEAMS" && (organization == null ? void 0 : organization.id) && teamsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          TeamsCard,
          {
            classNames,
            localization,
            organizationId: organization.id
          }
        ),
        view === "API_KEYS" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ApiKeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            isPending: organizationPending,
            organizationId: organization == null ? void 0 : organization.id
          }
        ),
        view === "SETTINGS" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrganizationSettingsCards,
          {
            classNames,
            localization,
            slug
          }
        )
      ]
    }
  );
}
function OrganizationSettingsPageInternal() {
  const { pageProps } = usePluginOverrides("organization");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.organizationSettings) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationView,
    {
      path: organizationViewPaths.SETTINGS,
      ...rest,
      localization
    }
  ) });
}
const organizationSettingsPage_internalXJOITES4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationSettingsPageInternal
});
function OrganizationMembersPageInternal() {
  const { pageProps } = usePluginOverrides("organization");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.organizationMembers) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationView,
    {
      path: organizationViewPaths.MEMBERS,
      ...rest,
      localization
    }
  ) });
}
const organizationMembersPage_internalQ3Y3KR6W = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationMembersPageInternal
});
function OrganizationApiKeysPageInternal() {
  const { pageProps } = usePluginOverrides("organization");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.organizationApiKeys) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationView,
    {
      path: organizationViewPaths.API_KEYS,
      ...rest,
      localization
    }
  ) });
}
const organizationApiKeysPage_internalA7TOBTOI = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationApiKeysPageInternal
});
function OrganizationTeamsPageInternal() {
  const { pageProps } = usePluginOverrides("organization");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.organizationTeams) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    OrganizationView,
    {
      path: organizationViewPaths.TEAMS,
      ...rest,
      localization
    }
  ) });
}
const organizationTeamsPage_internalAZY6L43Z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  OrganizationTeamsPageInternal
});
export {
  accountClientPlugin as a,
  authClientPlugin as b,
  organizationClientPlugin as o
};
