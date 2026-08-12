import { randomBytes } from "node:crypto";
import { chmodSync, writeFileSync } from "node:fs";
import Database from "better-sqlite3";

import { auth, pool } from "../lib/auth.js";

const sqlitePath = "/app/legacy_db/auth.db";
const passwordOutputPath =
  "/app/legacy_db/migrated-user-passwords.csv";

const sqlite = new Database(sqlitePath, {
  readonly: true,
  fileMustExist: true,
});

type LegacyUser = {
  id: number;
  employee_id: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  username: string;
  email: string | null;
  mobile_phone: string | null;
  birthdate: string | null;
  status: string | null;
  enabled: number;
  created_at: string;
  updated_at: string;
  sevenshifts_user_id: number | null;
};

function temporaryPassword(): string {
  return randomBytes(18).toString("base64url");
}

function newId(): string {
  return randomBytes(24).toString("base64url");
}

function nullableText(value: string | null): string | null {
  if (value == null) return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sqliteTimestamp(value: string | null): Date | null {
  if (!value) return null;
  return new Date(`${value.replace(" ", "T")}Z`);
}

function parseBirthdate(value: string | null): Date | null {
  if (!value?.trim()) return null;
  return new Date(`${value.trim()}T00:00:00Z`);
}

function csv(value: string | number | null): string {
  if (value == null) return "";

  const text = String(value);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function normalizeUsername(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 30);
}

async function main() {
  const legacyUsers = sqlite
    .prepare(`
      SELECT
        id,
        employee_id,
        first_name,
        last_name,
        name,
        username,
        email,
        mobile_phone,
        birthdate,
        status,
        enabled,
        created_at,
        updated_at,
        sevenshifts_user_id
      FROM users
      WHERE email IS NOT NULL
        AND trim(email) <> ''
      ORDER BY id
    `)
    .all() as LegacyUser[];

  const skipped = sqlite
    .prepare(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE email IS NULL
         OR trim(email) = ''
    `)
    .get() as { count: number };

  console.log(`Legacy users with email: ${legacyUsers.length}`);
  console.log(`Skipped without email:   ${skipped.count}`);
  console.log("");

  if (legacyUsers.length !== 133) {
    throw new Error(
      `Expected 133 importable users, found ${legacyUsers.length}`,
    );
  }

  if (skipped.count !== 6) {
    throw new Error(
      `Expected 6 skipped users, found ${skipped.count}`,
    );
  }

  /*
   * Validate normalized usernames before changing anything.
   */
  const normalizedUsernameOwners = new Map<string, LegacyUser>();

  for (const legacy of legacyUsers) {
    const displayUsername = legacy.username.trim();
    const username = normalizeUsername(displayUsername);

    if (username.length < 3) {
      throw new Error(
        `Cannot normalize username for legacy user ${legacy.id}: "${displayUsername}"`,
      );
    }

    const existing = normalizedUsernameOwners.get(username);

    if (existing && existing.id !== legacy.id) {
      throw new Error(
        [
          `Normalized username collision: "${username}"`,
          `legacy ${existing.id}: "${existing.username}"`,
          `legacy ${legacy.id}: "${legacy.username}"`,
        ].join("\n"),
      );
    }

    normalizedUsernameOwners.set(username, legacy);
  }

  console.log("Username normalization validated.");
  console.log("");

  const passwordRows: Array<Array<string | number | null>> = [
    [
      "legacy_user_id",
      "name",
      "username",
      "display_username",
      "email",
      "temporary_password",
    ],
  ];

  let created = 0;
  let reused = 0;
  let disabled = 0;

  for (const legacy of legacyUsers) {
    const email = legacy.email!.trim().toLowerCase();
    const displayUsername = legacy.username.trim();
    const username = normalizeUsername(displayUsername);

    /*
     * Already migrated in a previous partial run.
     */
    const existingEmployee = await pool.query<{
      userId: string;
    }>(
      `
        SELECT "userId"
        FROM "sevenShiftsEmployee"
        WHERE "legacyUserId" = $1
      `,
      [legacy.id],
    );

    if (existingEmployee.rowCount === 1) {
      const userId = existingEmployee.rows[0].userId;

      /*
       * Normalize/update the Better Auth user.
       */
      await pool.query(
        `
          UPDATE "user"
          SET
            username = $1,
            "displayUsername" = $2,
            "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = $3
        `,
        [username, displayUsername, userId],
      );

      /*
       * Refresh plugin-side employee metadata.
       */
      await pool.query(
        `
          UPDATE "sevenShiftsEmployee"
          SET
            "employeeId" = $1,
            "sevenShiftsUserId" = $2,
            "firstName" = $3,
            "lastName" = $4,
            "mobilePhone" = $5,
            birthdate = $6,
            status = $7,
            enabled = $8,
            "mustChangePassword" = true,
            "sourceCreatedAt" = $9,
            "sourceUpdatedAt" = $10
          WHERE "legacyUserId" = $11
        `,
        [
          nullableText(legacy.employee_id),
          legacy.sevenshifts_user_id,
          nullableText(legacy.first_name),
          nullableText(legacy.last_name),
          nullableText(legacy.mobile_phone),
          parseBirthdate(legacy.birthdate),
          nullableText(legacy.status),
          Boolean(legacy.enabled),
          sqliteTimestamp(legacy.created_at),
          sqliteTimestamp(legacy.updated_at),
          legacy.id,
        ],
      );

      if (!legacy.enabled) {
        await pool.query(
          `
            UPDATE "user"
            SET
              banned = true,
              "banReason" = 'Disabled in 7shifts'
            WHERE id = $1
          `,
          [userId],
        );

        disabled++;
      } else {
        await pool.query(
          `
            UPDATE "user"
            SET
              banned = false,
              "banReason" = NULL,
              "banExpires" = NULL
            WHERE id = $1
          `,
          [userId],
        );
      }

      reused++;

      console.log(
        `reused: ${legacy.id} ${legacy.name} <${email}>${
          legacy.enabled ? "" : " [DISABLED]"
        }`,
      );

      continue;
    }

    /*
     * Refuse ambiguous collisions.
     */
    const collision = await pool.query<{
      id: string;
      name: string;
      email: string;
      username: string | null;
    }>(
      `
        SELECT id, name, email, username
        FROM "user"
        WHERE lower(email) = lower($1)
           OR lower(username) = lower($2)
      `,
      [email, username],
    );

    if ((collision.rowCount ?? 0) > 0) {
      console.error("");
      console.error(
        `COLLISION: legacy user ${legacy.id} ${legacy.name}`,
      );
      console.table(collision.rows);

      throw new Error(
        `Existing Better Auth user conflicts with ${email} / ${username}`,
      );
    }

    const password = temporaryPassword();

    /*
     * New users can still be created through Better Auth's Admin API.
     * createUser does not require an existing admin session when called
     * internally from the server configuration.
     */
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name: legacy.name,
        role: "user",
        data: {
          username,
          displayUsername,
        },
      },
    });

    if (!newUser?.user?.id) {
      throw new Error(
        `Better Auth did not return a user id for legacy user ${legacy.id}`,
      );
    }

    const userId = newUser.user.id;

    await pool.query(
      `
        INSERT INTO "sevenShiftsEmployee" (
          id,
          "userId",
          "legacyUserId",
          "employeeId",
          "sevenShiftsUserId",
          "firstName",
          "lastName",
          "mobilePhone",
          birthdate,
          status,
          enabled,
          "mustChangePassword",
          "sourceCreatedAt",
          "sourceUpdatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, true, $12, $13
        )
      `,
      [
        newId(),
        userId,
        legacy.id,
        nullableText(legacy.employee_id),
        legacy.sevenshifts_user_id,
        nullableText(legacy.first_name),
        nullableText(legacy.last_name),
        nullableText(legacy.mobile_phone),
        parseBirthdate(legacy.birthdate),
        nullableText(legacy.status),
        Boolean(legacy.enabled),
        sqliteTimestamp(legacy.created_at),
        sqliteTimestamp(legacy.updated_at),
      ],
    );

    if (!legacy.enabled) {
      await pool.query(
        `
          UPDATE "user"
          SET
            banned = true,
            "banReason" = 'Disabled in 7shifts'
          WHERE id = $1
        `,
        [userId],
      );

      disabled++;
    }

    passwordRows.push([
      legacy.id,
      legacy.name,
      username,
      displayUsername,
      email,
      password,
    ]);

    created++;

    console.log(
      `created: ${legacy.id} ${legacy.name} <${email}>${
        legacy.enabled ? "" : " [DISABLED]"
      }`,
    );
  }

  /*
   * Contains temporary passwords only for users created during THIS run.
   * Previously-created partial-run users are intentionally omitted.
   */
  const output =
    passwordRows
      .map((row) => row.map(csv).join(","))
      .join("\n") + "\n";

  writeFileSync(passwordOutputPath, output, {
    encoding: "utf8",
    mode: 0o600,
  });

  chmodSync(passwordOutputPath, 0o600);

  const validation = await pool.query<{
    count: number;
  }>(`
    SELECT COUNT(*)::int AS count
    FROM "sevenShiftsEmployee"
  `);

  console.log("");
  console.log("User migration completed.");
  console.log(`created this run:           ${created}`);
  console.log(`reused from partial run:    ${reused}`);
  console.log(`disabled:                   ${disabled}`);
  console.log(
    `sevenShiftsEmployee rows:  ${validation.rows[0].count}`,
  );

  console.log("");
  console.log(
    `Passwords for users created this run: ${passwordOutputPath}`,
  );
}

main()
  .catch((error) => {
    console.error("");
    console.error("USER MIGRATION FAILED");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await pool.end();
  });
