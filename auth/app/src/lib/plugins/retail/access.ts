import type { Pool } from "pg";
import { RETAIL_CAPABILITIES, retailCapabilities, type RetailCapability } from "./permissions.ts";

export type RetailDatabase = Pick<Pool, "query">;
export type RetailAccess = {
  capabilities: RetailCapability[];
  canManageAdministrators: boolean;
};

export async function resolveRetailAccess(
  db: RetailDatabase,
  enabled: boolean,
  organizationId: string,
  userId: string,
): Promise<RetailAccess> {
  const denied: RetailAccess = { capabilities: [], canManageAdministrators: false };
  if (!enabled) return denied;
  const principal = await db.query<{ systemRole: string; memberRole: string | null; memberId: string | null }>(
    `SELECT u.role AS "systemRole", m.role AS "memberRole", m.id AS "memberId"
     FROM organization o
     JOIN "user" u ON u.id = $2
     LEFT JOIN "organizationStatus" os ON os."organizationId" = o.id
     LEFT JOIN member m ON m."organizationId" = o.id AND m."userId" = u.id
     LEFT JOIN "organizationMemberStatus" oms ON oms."memberId" = m.id
     WHERE o.id = $1 AND COALESCE(os.enabled, true)
       AND NOT COALESCE(u.banned, false)
       AND (u.role = 'admin' OR (
         m.id IS NOT NULL AND COALESCE(oms.active, true)
         AND (oms."accessExpiresAt" IS NULL OR oms."accessExpiresAt" > CURRENT_TIMESTAMP)
       ))
     LIMIT 1`,
    [organizationId, userId],
  );
  const actor = principal.rows[0];
  if (!actor) return denied;
  const schema = await db.query<{ ready: boolean }>(
    `SELECT to_regclass('public."retailOrganizationConfig"') IS NOT NULL
      AND to_regclass('public."retailOrganizationVariant"') IS NOT NULL
      AND to_regclass('public."retailAssignment"') IS NOT NULL
      AND to_regclass('public."retailAssignmentCapability"') IS NOT NULL
      AND to_regclass('public."retailSku"') IS NOT NULL
      AND to_regclass('public."retailBarcode"') IS NOT NULL
      AND to_regclass('public."retailLocation"') IS NOT NULL
      AND to_regclass('public."retailLocationGrant"') IS NOT NULL
      AND to_regclass('public."retailStockOperation"') IS NOT NULL
      AND to_regclass('public."retailStockBalance"') IS NOT NULL
      AND to_regclass('public."retailStockMovement"') IS NOT NULL
      AND to_regclass('public."retailSupplier"') IS NOT NULL
      AND to_regclass('public."retailSupplierItem"') IS NOT NULL
      AND to_regclass('public."retailPurchaseCost"') IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'retailAssignmentCapability'
          AND column_name = 'allLocations'
      )
      AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventoryItemVariant'
          AND column_name = 'menuEligible'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'inventoryItemVariant'
          AND column_name = 'variationKey'
      ) AS ready`,
  );
  if (!schema.rows[0]?.ready) return denied;
  const config = await db.query<{ enabled: boolean }>(
    'SELECT enabled FROM "retailOrganizationConfig" WHERE "organizationId" = $1',
    [organizationId],
  );
  if (config.rows[0]?.enabled !== true) return denied;
  if (actor.systemRole === "admin" || actor.memberRole === "owner" || actor.memberRole === "admin") {
    return { capabilities: [...RETAIL_CAPABILITIES], canManageAdministrators: true };
  }
  if (!actor.memberId) return denied;
  const grants = await db.query<{ capability: string }>(
    `SELECT c.capability FROM "retailAssignment" a
     JOIN "retailAssignmentCapability" c ON c."assignmentId" = a.id
     WHERE a."memberId" = $1 AND a.enabled = true`,
    [actor.memberId],
  );
  return { capabilities: retailCapabilities(grants.rows.map(row => row.capability)), canManageAdministrators: false };
}
