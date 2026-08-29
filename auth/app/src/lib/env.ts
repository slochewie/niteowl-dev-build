const requiredNames = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_ALLOWED_HOSTS",
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
  "REDIS_HOST",
  "REDIS_PORT",
  "REDIS_PASSWORD",
  "INTEGRATION_ENCRYPTION_KEY",
] as const;

for (const name of requiredNames) {
  if (!process.env[name]) {
    throw new Error(
      `${name} is required`,
    );
  }
}

export const env = {
  port: Number(
    process.env.PORT ??
      3000,
  ),

  secret:
    process.env.BETTER_AUTH_SECRET!,

  authAllowedHosts: process.env
    .BETTER_AUTH_ALLOWED_HOSTS!
    .split(",")
    .map((value) =>
      value.trim(),
    )
    .filter(Boolean),

  trustedOrigins: (
    process.env
      .BETTER_AUTH_TRUSTED_ORIGINS ??
    ""
  )
    .split(",")
    .map((value) =>
      value.trim(),
    )
    .filter(Boolean),

  redis: {
    host:
      process.env.REDIS_HOST!,

    port: Number(
      process.env.REDIS_PORT!,
    ),

    password:
      process.env.REDIS_PASSWORD!,
  },

  integrationEncryptionKey:
    process.env
      .INTEGRATION_ENCRYPTION_KEY!,

  sevenShiftsCsvStorageRoot:
    process.env
      .SEVEN_SHIFTS_CSV_STORAGE_ROOT ??
    "/app/.data/integrations/7shifts-csv",
};
