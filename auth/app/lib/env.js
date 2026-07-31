const requiredNames = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
//  "BETTER_AUTH_PORT",
  "PORT",
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
  "REDIS_HOST",
  "REDIS_PORT",
  "REDIS_PASSWORD",
];

for (const name of requiredNames) {
  if (!process.env[name]) {
    throw new Error(`${name} is required`);
  }
}

export const env = {
  port: Number(process.env.PORT),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};
