import { randomBytes } from "node:crypto";
import Database from "better-sqlite3";
import { Pool, type PoolClient } from "pg";

const sqlitePath = "/app/legacy_db/auth.db";

const sqlite = new Database(sqlitePath, {
  readonly: true,
  fileMustExist: true,
});

const pool = new Pool();

type LegacyLocation = {
  id: number;
  guid: string | null;
  name: string;
  active: number;
  source: string;
  created_at: string;
  updated_at: string;
};

type LegacyDepartment = {
  id: number;
  company_id: number;
  location_id: number;
  name: string;
  active: number;
  source: string;
  created_at: string;
  updated_at: string;
};

type LegacyRole = {
  id: number;
  company_id: number;
  location_id: number;
  department_id: number | null;
  name: string;
  active: number;
  source: string;
  created_at: string;
  updated_at: string;
};

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

  // SQLite CURRENT_TIMESTAMP values are UTC but don't contain a timezone.
  return new Date(`${value.replace(" ", "T")}Z`);
}

async function requireOrganization(
  client: PoolClient,
  name: string,
): Promise<string> {
  const result = await client.query<{ id: string }>(
    `
      SELECT id
      FROM organization
      WHERE name = $1
    `,
    [name],
  );

  if (result.rowCount !== 1) {
    throw new Error(
      `Expected exactly one Better Auth organization named "${name}", found ${result.rowCount ?? 0}`,
    );
  }

  return result.rows[0].id;
}

async function importLocations(
  client: PoolClient,
  locations: LegacyLocation[],
): Promise<Map<number, string>> {
  const locationIds = new Map<number, string>();

  for (const location of locations) {
    const organizationId = await requireOrganization(
      client,
      location.name,
    );

    const result = await client.query<{ id: string }>(
      `
        INSERT INTO "sevenShiftsLocation" (
          id,
          "sevenShiftsLocationId",
          "organizationId",
          guid,
          name,
          active,
          source,
          "sourceCreatedAt",
          "sourceUpdatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        ON CONFLICT ("sevenShiftsLocationId")
        DO UPDATE SET
          "organizationId" = EXCLUDED."organizationId",
          guid = EXCLUDED.guid,
          name = EXCLUDED.name,
          active = EXCLUDED.active,
          source = EXCLUDED.source,
          "sourceCreatedAt" = EXCLUDED."sourceCreatedAt",
          "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt"
        RETURNING id
      `,
      [
        newId(),
        location.id,
        organizationId,
        nullableText(location.guid),
        location.name,
        Boolean(location.active),
        location.source,
        sqliteTimestamp(location.created_at),
        sqliteTimestamp(location.updated_at),
      ],
    );

    locationIds.set(location.id, result.rows[0].id);

    console.log(
      `location: ${location.id} ${location.name} -> ${result.rows[0].id}`,
    );
  }

  return locationIds;
}

async function importDepartments(
  client: PoolClient,
  departments: LegacyDepartment[],
  locationIds: Map<number, string>,
): Promise<Map<number, string>> {
  const departmentIds = new Map<number, string>();

  for (const department of departments) {
    const locationId = locationIds.get(department.location_id);

    if (!locationId) {
      throw new Error(
        `Department ${department.id} references unknown 7shifts location ${department.location_id}`,
      );
    }

    const result = await client.query<{ id: string }>(
      `
        INSERT INTO "sevenShiftsDepartment" (
          id,
          "sevenShiftsDepartmentId",
          "companyId",
          "locationId",
          name,
          active,
          source,
          "sourceCreatedAt",
          "sourceUpdatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        ON CONFLICT ("sevenShiftsDepartmentId")
        DO UPDATE SET
          "companyId" = EXCLUDED."companyId",
          "locationId" = EXCLUDED."locationId",
          name = EXCLUDED.name,
          active = EXCLUDED.active,
          source = EXCLUDED.source,
          "sourceCreatedAt" = EXCLUDED."sourceCreatedAt",
          "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt"
        RETURNING id
      `,
      [
        newId(),
        department.id,
        department.company_id,
        locationId,
        department.name,
        Boolean(department.active),
        department.source,
        sqliteTimestamp(department.created_at),
        sqliteTimestamp(department.updated_at),
      ],
    );

    departmentIds.set(department.id, result.rows[0].id);

    console.log(
      `department: ${department.id} ${department.name} -> ${result.rows[0].id}`,
    );
  }

  return departmentIds;
}

async function importRoles(
  client: PoolClient,
  roles: LegacyRole[],
  locationIds: Map<number, string>,
  departmentIds: Map<number, string>,
): Promise<void> {
  for (const role of roles) {
    const locationId = locationIds.get(role.location_id);

    if (!locationId) {
      throw new Error(
        `Role ${role.id} references unknown 7shifts location ${role.location_id}`,
      );
    }

    let departmentId: string | null = null;

    if (role.department_id != null) {
      departmentId = departmentIds.get(role.department_id) ?? null;

      if (!departmentId) {
        throw new Error(
          `Role ${role.id} references unknown 7shifts department ${role.department_id}`,
        );
      }
    }

    const result = await client.query<{ id: string }>(
      `
        INSERT INTO "sevenShiftsRole" (
          id,
          "sevenShiftsRoleId",
          "companyId",
          "locationId",
          "departmentId",
          name,
          active,
          source,
          "sourceCreatedAt",
          "sourceUpdatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        ON CONFLICT ("sevenShiftsRoleId")
        DO UPDATE SET
          "companyId" = EXCLUDED."companyId",
          "locationId" = EXCLUDED."locationId",
          "departmentId" = EXCLUDED."departmentId",
          name = EXCLUDED.name,
          active = EXCLUDED.active,
          source = EXCLUDED.source,
          "sourceCreatedAt" = EXCLUDED."sourceCreatedAt",
          "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt"
        RETURNING id
      `,
      [
        newId(),
        role.id,
        role.company_id,
        locationId,
        departmentId,
        role.name,
        Boolean(role.active),
        role.source,
        sqliteTimestamp(role.created_at),
        sqliteTimestamp(role.updated_at),
      ],
    );

    console.log(
      `role: ${role.id} ${role.name} -> ${result.rows[0].id}`,
    );
  }
}

async function main() {
  console.log(`Legacy SQLite database: ${sqlitePath}`);
  console.log("");

  const locations = sqlite
    .prepare("SELECT * FROM locations ORDER BY id")
    .all() as LegacyLocation[];

  const departments = sqlite
    .prepare("SELECT * FROM departments ORDER BY id")
    .all() as LegacyDepartment[];

  const roles = sqlite
    .prepare("SELECT * FROM roles ORDER BY id")
    .all() as LegacyRole[];

  console.log(`locations:   ${locations.length}`);
  console.log(`departments: ${departments.length}`);
  console.log(`roles:       ${roles.length}`);
  console.log("");

  if (locations.length !== 5) {
    throw new Error(
      `Expected 5 locations, found ${locations.length}`,
    );
  }

  if (departments.length !== 5) {
    throw new Error(
      `Expected 5 departments, found ${departments.length}`,
    );
  }

  if (roles.length !== 46) {
    throw new Error(
      `Expected 46 roles, found ${roles.length}`,
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Importing locations...");
    const locationIds = await importLocations(
      client,
      locations,
    );

    console.log("");
    console.log("Importing departments...");
    const departmentIds = await importDepartments(
      client,
      departments,
      locationIds,
    );

    console.log("");
    console.log("Importing roles...");
    await importRoles(
      client,
      roles,
      locationIds,
      departmentIds,
    );

    const validation = await client.query<{
      locations: number;
      departments: number;
      roles: number;
    }>(`
      SELECT
        (SELECT COUNT(*)::int FROM "sevenShiftsLocation") AS locations,
        (SELECT COUNT(*)::int FROM "sevenShiftsDepartment") AS departments,
        (SELECT COUNT(*)::int FROM "sevenShiftsRole") AS roles
    `);

    const counts = validation.rows[0];

    if (
      counts.locations !== locations.length ||
      counts.departments !== departments.length ||
      counts.roles !== roles.length
    ) {
      throw new Error(
        `Postgres validation failed: locations=${counts.locations}, departments=${counts.departments}, roles=${counts.roles}`,
      );
    }

    await client.query("COMMIT");

    console.log("");
    console.log("Reference-data migration completed successfully.");
    console.log(`locations:   ${counts.locations}`);
    console.log(`departments: ${counts.departments}`);
    console.log(`roles:       ${counts.roles}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    sqlite.close();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Migration failed:");
  console.error(error);
  process.exitCode = 1;
});
