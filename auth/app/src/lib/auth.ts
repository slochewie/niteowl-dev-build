import { apiKey } from "@better-auth/api-key";
import { dash, sentinel } from "@better-auth/infra";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import {
  admin,
  emailOTP,
  jwt,
  magicLink,
  multiSession,
  openAPI,
  organization,
  username,
} from "better-auth/plugins";
import { oauthProvider } from "@better-auth/oauth-provider";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Redis } from "ioredis";
import { Pool } from "pg";
import { Resend } from "resend";

import { env } from "./env.js";
import { integrationManager } from "./plugins/integration-manager/index.js";
import { glauth } from "./plugins/glauth/index.js";
import { organizationStatus } from "./plugins/organization-status/index.js";
import { userProfile } from "./plugins/user-profile/index.js";
import { sevenShifts } from "./plugins/seven-shifts/index.js";
import { sevenShiftsCsv } from "./plugins/seven-shifts-csv/index.js";
import { sevenShiftsApi } from "./plugins/seven-shifts-api/index.js";
import { unifiIdentity } from "./plugins/unifi-identity/index.js";
import { unifiAccess } from "./plugins/unifi-access/index.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailFrom =
  "NiteOwl Notifications <onboarding@notifications.niteowl.dev>";

export const pool = new Pool();

export const redis = new Redis({
  ...env.redis,
  maxRetriesPerRequest: 3,
});

export const auth = betterAuth({
  appName: "NiteOwl Authentication",

  logger: {
    disabled: false,
    disableColors: false,
    level: "debug",
    log: (level, message, ...args) => {
      console.log(`[${level}] ${message}`, ...args);
    },
  },

  baseURL: env.baseURL,
  secret: env.secret,
  trustedOrigins: env.trustedOrigins,

  onAPIError: {
    errorURL: "/auth/error",
  },

  database: pool,

  secondaryStorage: redisStorage({
    client: redis,
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    storeSessionInDatabase: true,
  },

  verification: {
    storeInDatabase: true,
  },

  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: emailFrom,
        to: user.email,
        subject: "Reset your password",
        html: `Click <a href="${url}">here</a> to reset your password.`,
      });

      if (error) {
        throw new Error(
          `Failed to send password reset email: ${error.message}`,
        );
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: emailFrom,
        to: user.email,
        subject: "Verify your email address",
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });

      if (error) {
        throw new Error(
          `Failed to send verification email: ${error.message}`,
        );
      }
    },
  },

  socialProviders: {
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  },


  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-real-ip"],
    },
    silenceWarnings: {
      oauthAuthServerConfig: true,
    },
  },

  experimental: {
    joins: true, // Enable database joins for better performance
  },

  plugins: [
    username(),

    admin(),

    organization({
      teams: {
        enabled: true,
        allowRemovingAllTeams: true,
      },

      allowUserToCreateOrganization: async (user) => {
        return user.role === "admin";
      },
    }),

    organizationStatus({
      pool,
    }),

    multiSession(),

    openAPI(),

    apiKey(),

    jwt(),

    oauthProvider({ 
      loginPage: "/auth/sign-in", 
      consentPage: "/auth/oauth-consent",
      signup: {
        page: "/auth/oauth-sign-up"
      },
      selectAccount: {
        page: "/auth/select-account",
        shouldRedirect: async () => true
      },
      // ...other options
    }),

    emailOTP({
      storeOTP: "hashed",
      sendVerificationOTP: async ({
        email,
        otp,
        type,
      }) => {
        const { error } = await resend.emails.send({
          from: emailFrom,
          to: email,
          subject:
            type === "sign-in"
              ? "Your sign-in code"
              : "Your verification code",
          html: `Your code is <strong>${otp}</strong>.`,
        });

        if (error) {
          throw new Error(
            `Failed to send verification OTP: ${error.message}`,
          );
        }
      },
    }),

    magicLink({
      storeToken: "hashed",
      sendMagicLink: async ({ email, url }) => {
        const { error } = await resend.emails.send({
          from: emailFrom,
          to: email,
          subject: "Sign in to NiteOwl Dev",
          html: `Click <a href="${url}">here</a> to sign in.`,
        });

        if (error) {
          throw new Error(
            `Failed to send magic link: ${error.message}`,
          );
        }
      },
    }),

    dash(),

    sentinel(),

    integrationManager({
      pool,
    }),

    glauth({
      pool,
    }),

    userProfile({
      pool,
    }),

    sevenShifts({
      pool,
    }),

    sevenShiftsCsv({
      pool,
      storageRoot:
        env.sevenShiftsCsvStorageRoot,
    }),

    sevenShiftsApi({
      pool,
      encryptionKey:
        env.integrationEncryptionKey,
    }),

    unifiIdentity({
      pool,
      encryptionKey: env.integrationEncryptionKey,
    }),

    unifiAccess({
      pool,
      encryptionKey:
        env.integrationEncryptionKey,
    }),

    tanstackStartCookies(),
  ],
});
