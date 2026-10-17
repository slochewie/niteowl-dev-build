import { APIError } from "better-auth/api";
import type { Pool } from "pg";

/** Missing columns during the additive rollout retain legacy menu eligibility. */
export async function assertMenuEligible(
  db: Pick<Pool, "query">,
  targets: { variantIds?: string[]; itemIds?: string[]; allVariants?: boolean },
) {
  const variantIds = [...new Set(targets.variantIds ?? [])];
  const itemIds = [...new Set(targets.itemIds ?? [])];
  if (variantIds.length === 0 && itemIds.length === 0) return;

  const result = await db.query<{ id: string }>(
    `SELECT v.id
     FROM "inventoryItemVariant" v
     WHERE (v.id = ANY($1::text[]) OR (v."inventoryItemId" = ANY($2::text[])
       AND ($3::boolean OR NOT EXISTS (
         SELECT 1 FROM "inventoryItemVariant" sibling
         WHERE sibling."inventoryItemId" = v."inventoryItemId"
           AND COALESCE((to_jsonb(sibling)->>'menuEligible')::boolean, true)
       ))))
       AND COALESCE((to_jsonb(v)->>'menuEligible')::boolean, true) = false
     LIMIT 1`,
    [variantIds, itemIds, targets.allVariants ?? false],
  );
  if (result.rows.length > 0) {
    throw new APIError("CONFLICT", {
      message: "Retail-only variants cannot be changed through menu workflows. Explicit catalog promotion is required.",
    });
  }
}
