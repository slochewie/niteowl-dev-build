import { APIError } from "better-auth/api";
import type { CatalogMergeParticipant } from "../inventory/merge-participants.ts";

/** Remap the enrollment itself so its stable ID and dependent history survive. */
export const retailMergeParticipant: CatalogMergeParticipant = {
  async beforeOrganizationVariantDelete(db, merge) {
    if (merge.sourceOrganizationVariantId === merge.targetOrganizationVariantId) return;
    // Inventory continues working before the additive Retail schema is deployed.
    const schema = await db.query<{ ready: boolean }>(
      `SELECT to_regclass('public."retailOrganizationVariant"') IS NOT NULL AS ready`,
    );
    if (!schema.rows[0]?.ready) return;

    const ids = [merge.sourceOrganizationVariantId, merge.targetOrganizationVariantId];
    const parents = await db.query(
      `SELECT id FROM "inventoryOrganizationVariant"
       WHERE id = ANY($1::text[]) AND "organizationId" = $2
       ORDER BY id FOR UPDATE`,
      [ids, merge.organizationId],
    );
    if (parents.rowCount !== 2) {
      throw new APIError("CONFLICT", { message: "Catalog merge parents must belong to the same organization" });
    }
    const enrollments = await db.query<{ id: string; inventoryOrganizationVariantId: string }>(
      `SELECT id, "inventoryOrganizationVariantId" FROM "retailOrganizationVariant"
       WHERE "inventoryOrganizationVariantId" = ANY($1::text[])
       ORDER BY id FOR UPDATE`,
      [ids],
    );
    const source = enrollments.rows.find(row => row.inventoryOrganizationVariantId === merge.sourceOrganizationVariantId);
    if (!source) return;
    const target = enrollments.rows.find(row => row.inventoryOrganizationVariantId === merge.targetOrganizationVariantId);
    if (target) {
      // Never delete an enrollment ID that may acquire stock, barcode or purchasing history.
      throw new APIError("CONFLICT", {
        message: "Both catalog variants have Retail enrollments. Resolve the Retail conflict before merging.",
      });
    }
    const updated = await db.query(
      `UPDATE "retailOrganizationVariant"
       SET "inventoryOrganizationVariantId" = $3, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $1 AND "inventoryOrganizationVariantId" = $2
       RETURNING id`,
      [source.id, merge.sourceOrganizationVariantId, merge.targetOrganizationVariantId],
    );
    if (updated.rowCount !== 1) {
      throw new APIError("CONFLICT", { message: "Retail enrollment changed during catalog merge" });
    }
  },
};
