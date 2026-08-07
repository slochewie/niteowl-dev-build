import { betterAuth } from "better-auth";
import { username, admin, organization, openAPI, jwt } from "better-auth/plugins";
import { apiKey } from "@better-auth/api-key";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";
import { Pool } from "pg";
import { env } from "./env.js";

export const pool = new Pool();
export const redis = new Redis({
  ...env.redis,
  maxRetriesPerRequest: 3,
});

export const auth = betterAuth({
  advanced: {
    database: {
      joins: true,
    },
  },
  baseURL: env.baseURL,
  secret: env.secret,
  trustedOrigins: env.trustedOrigins,
  emailAndPassword: { enabled: true },
  database: pool,
  secondaryStorage: redisStorage({ client: redis }),
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-real-ip"],
    },
  },
  plugins: [
      username(),
      admin(),
      organization(),
      openAPI(),
      apiKey(),
      jwt(),
      tanstackStartCookies(),
  ],
});
