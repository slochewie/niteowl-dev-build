import { APIError } from "better-auth/api";
import type { PoolClient } from "pg";
import { appendRevisionInTransaction } from "../revision-history/index.ts";

/** Caller owns the transaction. Promotion is global and never enables menu sales/export. */
export async function promoteVariantForMenu(
  db: PoolClient,
  input: { inventoryItemVariantId: string; actorUserId: string; reason: string },
) {
  const actor = await db.query(
    `SELECT id FROM "user" WHERE id = $1 AND role = 'admin'
     AND NOT COALESCE(banned, false) FOR SHARE`,
    [input.actorUserId],
  );
  if (actor.rowCount !== 1) throw new APIError("FORBIDDEN", { message: "System administrator access required" });
  const schema = await db.query<{ ready: boolean }>(
    `SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'inventoryItemVariant'
        AND column_name = 'menuEligible'
    ) AS ready`,
  );
  if (!schema.rows[0]?.ready) throw new APIError("SERVICE_UNAVAILABLE", { message: "Catalog eligibility schema is not deployed" });

  const identity = await db.query<{ inventoryItemId: string }>(
    'SELECT "inventoryItemId" FROM "inventoryItemVariant" WHERE id = $1',
    [input.inventoryItemVariantId],
  );
  if (!identity.rows[0]) throw new APIError("NOT_FOUND", { message: "Catalog variant not found" });
  const itemId = identity.rows[0].inventoryItemId;
  const master = await db.query(
    'SELECT id FROM "inventoryItem" WHERE id = $1 AND active = true FOR UPDATE',
    [itemId],
  );
  if (master.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Active catalog master not found" });
  const variant = await db.query(
    `SELECT * FROM "inventoryItemVariant"
     WHERE id = $1 AND "inventoryItemId" = $2 AND active = true FOR UPDATE`,
    [input.inventoryItemVariantId, itemId],
  );
  const current = variant.rows[0];
  if (!current) throw new APIError("CONFLICT", { message: "Catalog variant changed; refresh and retry" });
  if (current.menuEligible === true) return { inventoryItemVariantId: current.id, menuEligible: true, changed: false };
  const updated = await db.query(
    `UPDATE "inventoryItemVariant" SET "menuEligible" = true, "updatedAt" = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [input.inventoryItemVariantId],
  );
  if (!updated.rows[0]) throw new Error("Catalog promotion did not return a variant");
  await appendRevisionInTransaction(db, {
    resourceType: "inventoryItemVariant",
    resourceId: input.inventoryItemVariantId,
    actorUserId: input.actorUserId,
    operation: "update",
    snapshot: updated.rows[0],
    metadata: { action: "promote-to-menu", previousMenuEligible: current.menuEligible, reason: input.reason },
  });
  return { inventoryItemVariantId: input.inventoryItemVariantId, menuEligible: true, changed: true };
}
