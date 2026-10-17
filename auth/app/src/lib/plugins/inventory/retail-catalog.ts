import { randomUUID } from "node:crypto";
import { APIError } from "better-auth/api";
import type { PoolClient } from "pg";

import { canonicalVariation } from "./variation-identity.ts";

export type RetailCatalog = {
  createRetailVariant(
    db: PoolClient, inventoryItemId: string, attributes: Record<string, string>,
  ): Promise<{ inventoryItemVariantId: string; attributes: Record<string, string>; created: boolean }>;
  ensureOrganizationVariant(
    db: PoolClient,
    organizationId: string,
    inventoryItemVariantId: string,
  ): Promise<string>;
};

/** Caller owns the transaction. Existing menu fields must never be updated here. */
export const inventoryRetailCatalog: RetailCatalog = {
  async createRetailVariant(db, inventoryItemId, attributes) {
    const canonical = canonicalVariation(attributes);
    // Serialize combination creation against other creation and master merge operations.
    const master = await db.query(
      'SELECT id FROM "inventoryItem" WHERE id = $1 AND active = true FOR UPDATE',
      [inventoryItemId],
    );
    if (master.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Active catalog master not found" });
    const existing = await db.query<{ id: string; active: boolean }>(
      `SELECT id, active FROM "inventoryItemVariant"
       WHERE "inventoryItemId" = $1 AND "variationKey" = $2 FOR UPDATE`,
      [inventoryItemId, canonical.key],
    );
    if (existing.rows[0]) {
      if (!existing.rows[0].active) throw new APIError("CONFLICT", { message: "This variation already exists but is inactive" });
      return { inventoryItemVariantId: existing.rows[0].id, attributes: canonical.attributes, created: false };
    }
    const id = randomUUID();
    await db.query(
      `INSERT INTO "inventoryItemVariant" (
        id, "inventoryItemId", "menuEligible", "variationKey", kind, name,
        active, "createdAt", "updatedAt"
      ) VALUES ($1, $2, false, $3, 'standard', $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [id, inventoryItemId, canonical.key, Object.entries(canonical.attributes).map(([name, value]) => name + ": " + value).join(" / ")],
    );
    return { inventoryItemVariantId: id, attributes: canonical.attributes, created: true };
  },

  async ensureOrganizationVariant(db, organizationId, inventoryItemVariantId) {
    const variant = await db.query(
      `SELECT v.id
       FROM "inventoryItemVariant" v
       JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
       WHERE v.id = $1 AND v.active = true AND i.active = true
       FOR SHARE OF i, v`,
      [inventoryItemVariantId],
    );
    if (variant.rowCount !== 1) {
      throw new APIError("NOT_FOUND", { message: "Active catalog variant not found" });
    }

    await db.query(
      `INSERT INTO "inventoryOrganizationVariant" (
        id, "organizationId", "inventoryItemVariantId", enabled, "exportToToast",
        "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("organizationId", "inventoryItemVariantId") DO NOTHING`,
      [randomUUID(), organizationId, inventoryItemVariantId],
    );
    const existing = await db.query<{ id: string }>(
      `SELECT id FROM "inventoryOrganizationVariant"
       WHERE "organizationId" = $1 AND "inventoryItemVariantId" = $2
       FOR UPDATE`,
      [organizationId, inventoryItemVariantId],
    );
    if (!existing.rows[0]) throw new Error("Organization variant was not created");
    return existing.rows[0].id;
  },
};
