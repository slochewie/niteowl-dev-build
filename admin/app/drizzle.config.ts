 import { defineConfig } from "drizzle-kit"

const {
  PGHOST,
  PGPORT = "5432",
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
} = process.env

for (const [name, value] of Object.entries({
  PGHOST,
  PGPORT,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
})) {
  if (!value) {
    throw new Error(`${name} is required`)
  }
}

const databaseURL =
  `postgresql://${encodeURIComponent(PGUSER!)}` +
  `:${encodeURIComponent(PGPASSWORD!)}` +
  `@${PGHOST}:${PGPORT}/${encodeURIComponent(PGDATABASE!)}`

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseURL,
  },
})
