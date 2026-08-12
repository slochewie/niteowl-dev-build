import { randomBytes } from "node:crypto";
import Database from "better-sqlite3";

import { pool } from "../lib/auth.js";

const sqlitePath = "/app/legacy_db/auth.db";

const sqlite = new Database(sqlitePath, {
  readonly: true,
  fileMustExist: true,
});

type LegacyAssignment = {
  id: number;
  user_id: number;
  location: string;
  role: string;
};

function newId(): string {
  return randomBytes(24).toString("base64url");
}

async function main() {
  const assignments = sqlite
    .prepare(`
      SELECT
        ua.id,
        ua.user_id,
        ua.location,
        ua.role
      FROM user_assignments ua
      JOIN users u
        ON u.id = ua.user_id
      WHERE u.email IS NOT NULL
        AND trim(u.email) <> ''
      ORDER BY ua.id
    `)
    .all() as LegacyAssignment[];

  console.log(`Importable legacy assignments: ${assignments.length}`);
  console.log("");

  if (assignments.length !== 412) {
    throw new Error(
      `Expected 412 importable assignments, found ${assignments.length}`,
    );
  }

  const client = await pool.connect();

  let createdAssignments = 0;
  let reusedAssignments = 0;
  let createdMemberships = 0;
  let reusedMemberships = 0;

  try {
    await client.query("BEGIN");

    for (const assignment of assignments) {
      /*
       * Resolve the migrated employee.
       */
      const employeeResult = await client.query<{
        employeeId: string;
        userId: string;
      }>(
        `
          SELECT
            id AS "employeeId",
            "userId"
          FROM "sevenShiftsEmployee"
          WHERE "legacyUserId" = $1
        `,
        [assignment.user_id],
      );

      if (employeeResult.rowCount !== 1) {
        throw new Error(
          `No migrated employee for legacy user ${assignment.user_id}`,
        );
      }

      const {
        employeeId,
        userId,
      } = employeeResult.rows[0];

      /*
       * Resolve 7shifts location by exact name.
       */
      const locationResult = await client.query<{
        locationId: string;
        organizationId: string | null;
      }>(
        `
          SELECT
            id AS "locationId",
            "organizationId"
          FROM "sevenShiftsLocation"
          WHERE name = $1
        `,
        [assignment.location],
      );

      if (locationResult.rowCount !== 1) {
        throw new Error(
          `Expected one sevenShiftsLocation named "${assignment.location}", found ${locationResult.rowCount ?? 0}`,
        );
      }

      const {
        locationId,
        organizationId,
      } = locationResult.rows[0];

      if (!organizationId) {
        throw new Error(
          `sevenShiftsLocation "${assignment.location}" has no organizationId`,
        );
      }

      /*
       * Resolve role within this location.
       *
       * Role names repeat across locations, so name alone is not enough.
       */
      const roleResult = await client.query<{
        roleId: string;
      }>(
        `
          SELECT
            r.id AS "roleId"
          FROM "sevenShiftsRole" r
          WHERE r."locationId" = $1
            AND r.name = $2
        `,
        [locationId, assignment.role],
      );

      if (roleResult.rowCount !== 1) {
        throw new Error(
          [
            `Expected one sevenShiftsRole for:`,
            `location="${assignment.location}"`,
            `role="${assignment.role}"`,
            `found=${roleResult.rowCount ?? 0}`,
          ].join(" "),
        );
      }

      const roleId = roleResult.rows[0].roleId;

      /*
       * Insert the normalized 7shifts assignment.
       *
       * legacyAssignmentId gives us idempotency.
       */
      const existingAssignment = await client.query<{ id: string }>(
        `
          SELECT id
          FROM "sevenShiftsAssignment"
          WHERE "legacyAssignmentId" = $1
        `,
        [assignment.id],
      );

      if (existingAssignment.rowCount === 1) {
        await client.query(
          `
            UPDATE "sevenShiftsAssignment"
            SET
              "employeeId" = $1,
              "locationId" = $2,
              "roleId" = $3
            WHERE "legacyAssignmentId" = $4
          `,
          [
            employeeId,
            locationId,
            roleId,
            assignment.id,
          ],
        );

        reusedAssignments++;
      } else {
        await client.query(
          `
            INSERT INTO "sevenShiftsAssignment" (
              id,
              "employeeId",
              "locationId",
              "roleId",
              "legacyAssignmentId"
            )
            VALUES (
              $1, $2, $3, $4, $5
            )
          `,
          [
            newId(),
            employeeId,
            locationId,
            roleId,
            assignment.id,
          ],
        );

        createdAssignments++;
      }

      /*
       * Ensure Better Auth organization membership.
       *
       * Multiple role assignments at one location must still produce
       * only one member row.
       */
      const existingMembership = await client.query<{ id: string }>(
        `
          SELECT id
          FROM member
          WHERE "organizationId" = $1
            AND "userId" = $2
        `,
        [
          organizationId,
          userId,
        ],
      );

      if (existingMembership.rowCount === 0) {
        await client.query(
          `
            INSERT INTO member (
              id,
              "organizationId",
              "userId",
              role,
              "createdAt"
            )
            VALUES (
              $1, $2, $3, 'member', CURRENT_TIMESTAMP
            )
          `,
          [
            newId(),
            organizationId,
            userId,
          ],
        );

        createdMemberships++;
      } else {
        reusedMemberships++;
      }
    }

    /*
     * Validate normalized assignment count.
     */
    const assignmentCountResult = await client.query<{
      count: number;
    }>(`
      SELECT COUNT(*)::int AS count
      FROM "sevenShiftsAssignment"
    `);

    const assignmentCount =
      assignmentCountResult.rows[0].count;

    if (assignmentCount !== 412) {
      throw new Error(
        `Expected 412 sevenShiftsAssignment rows, found ${assignmentCount}`,
      );
    }

    /*
     * Count distinct user/location relationships from SQLite.
     * That should equal the number of Better Auth memberships generated
     * by this migrated data, ignoring any pre-existing unrelated members.
     */
    const expectedMemberships = sqlite
      .prepare(`
        SELECT COUNT(*) AS count
        FROM (
          SELECT DISTINCT
            ua.user_id,
            ua.location
          FROM user_assignments ua
          JOIN users u
            ON u.id = ua.user_id
          WHERE u.email IS NOT NULL
            AND trim(u.email) <> ''
        )
      `)
      .get() as { count: number };

    console.log("");
    console.log(
      `Expected distinct employee/location memberships: ${expectedMemberships.count}`,
    );

    await client.query("COMMIT");

    console.log("");
    console.log("Assignment migration completed.");
    console.log(
      `sevenShiftsAssignment created: ${createdAssignments}`,
    );
    console.log(
      `sevenShiftsAssignment reused:  ${reusedAssignments}`,
    );
    console.log(
      `organization members created: ${createdMemberships}`,
    );
    console.log(
      `organization members reused:  ${reusedMemberships}`,
    );
    console.log(
      `sevenShiftsAssignment total:   ${assignmentCount}`,
    );
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
  console.error("ASSIGNMENT MIGRATION FAILED");
  console.error(error);
  process.exitCode = 1;
});
