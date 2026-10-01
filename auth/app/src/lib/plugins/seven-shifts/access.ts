import type { Pool } from "pg";

import {
  appsForSevenShiftsRole,
  type NiteOwlApp,
} from "./permissions.js";

export type LocationPermission = {
  app: NiteOwlApp;
  locationId: number;
  locationName: string;
  organizationId: string;
  sourceRole: string;
};

export async function getUserLocationPermissions(
  pool: Pool,
  userId: string,
): Promise<LocationPermission[]> {
  const result = await pool.query<{
    sevenShiftsLocationId: number;
    locationName: string;
    organizationId: string | null;
    roleName: string;
  }>(
    `
      SELECT DISTINCT
        sl."sevenShiftsLocationId",
        sl.name AS "locationName",
        sl."organizationId",
        sr.name AS "roleName"
      FROM "sevenShiftsAssignment" sa
      JOIN "sevenShiftsEmployee" se
        ON se.id = sa."employeeId"
      JOIN "sevenShiftsLocation" sl
        ON sl.id = sa."locationId"
      JOIN "sevenShiftsRole" sr
        ON sr.id = sa."roleId"
      WHERE se."userId" = $1
        AND se.enabled = true
        AND sl.active = true
        AND sr.active = true
      ORDER BY sl.name, sr.name
    `,
    [userId],
  );

  const permissions = new Map<string, LocationPermission>();

  for (const row of result.rows) {
    if (!row.organizationId) {
      continue;
    }

    for (const app of appsForSevenShiftsRole(row.roleName)) {
      const key =
        `${app}:${row.sevenShiftsLocationId}:${row.roleName}`;

      permissions.set(key, {
        app,
        locationId: row.sevenShiftsLocationId,
        locationName: row.locationName,
        organizationId: row.organizationId,
        sourceRole: row.roleName,
      });
    }
  }

  return [...permissions.values()];
}

export async function userHasLocationPermission(
  pool: Pool,
  userId: string,
  app: NiteOwlApp,
  organizationId: string,
): Promise<boolean> {
  const permissions =
    await getUserLocationPermissions(pool, userId);

  return permissions.some(
    (permission) =>
      permission.app === app &&
      permission.organizationId === organizationId,
  );
}


export async function userHasTipCalculatorScheduleAccess(
  pool: Pool,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      SELECT 1
      FROM "tipClaimEmployeeAssignment" assignment
      INNER JOIN "sevenShiftsApiOrganizationSource" mapping
        ON mapping."organizationId" = assignment."organizationId"
      WHERE
        assignment."organizationId" = $1
        AND assignment."userId" = $2
        AND assignment."accessEnabled" = true
        AND assignment."sevenShiftsEnabled" = true
      LIMIT 1
    `,
    [organizationId, userId],
  );

  return result.rowCount === 1;
}

export async function userHasScheduleAccess(
  pool: Pool,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  if (
    await userHasLocationPermission(
      pool,
      userId,
      "schedules",
      organizationId,
    )
  ) {
    return true;
  }

  return userHasTipCalculatorScheduleAccess(
    pool,
    userId,
    organizationId,
  );
}
