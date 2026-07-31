// admin/app/src/lib/db.ts

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

export const drizzleDb = drizzle(pool)
