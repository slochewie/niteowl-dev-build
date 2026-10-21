import { createHash, randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RequireRetailAccess, RetailTransaction } from "./assignments.ts";

export const retailPurchaseCostSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailPurchaseCost: {
    fields: {
      supplierItemId: { type: "string", required: true, references: { model: "retailSupplierItem", field: "id", onDelete: "restrict" } },
      idempotencyKey: { type: "string", required: true },
      requestFingerprint: { type: "string", required: true },
      packCostMinor: { type: "number", required: true },
      currency: { type: "string", required: true },
      unitsPerPackSnapshot: { type: "number", required: true },
      effectiveAt: { type: "date", required: true },
      reason: { type: "string", required: true },
      actorUserId: { type: "string", required: true, references: { model: "user", field: "id", onDelete: "restrict" } },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [
      { fields: ["supplierItemId", "idempotencyKey"], unique: true },
      { fields: ["supplierItemId", "currency", "effectiveAt", "createdAt"] },
      { fields: ["supplierItemId", "createdAt"] },
      { fields: ["actorUserId"] },
    ],
  },
};

type CostRequest = { supplierItemId: string; packCostMinor: number; currency: string; unitsPerPack: number; effectiveAt: string; reason: string };
export function purchaseCostFingerprint(request: CostRequest): string {
  return createHash("sha256").update(JSON.stringify([
    request.supplierItemId, request.packCostMinor, request.currency,
    request.unitsPerPack, request.effectiveAt, request.reason,
  ])).digest("hex");
}
type Cost = { id: string; supplierItemId: string; packCostMinor: number; currency: string; unitsPerPackSnapshot: number; effectiveAt: Date | string; reason: string; actorUserId: string; createdAt: string };
type Parent = { id: string; unitsPerPack: number; active: boolean; supplierActive: boolean; enrollmentEnabled: boolean; variantActive: boolean; itemActive: boolean };
const projection = `c.id, c."supplierItemId", c."packCostMinor", c.currency, c."unitsPerPackSnapshot", c."effectiveAt", c.reason, c."actorUserId",
  to_char(c."createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "createdAt"`;
const ownedCost = `FROM "retailPurchaseCost" c JOIN "retailSupplierItem" si ON si.id = c."supplierItemId"
  JOIN "retailSupplier" s ON s.id = si."supplierId"
  JOIN "retailOrganizationVariant" r ON r.id = si."retailOrganizationVariantId"
  JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
  WHERE si.id = $1 AND s."organizationId" = $2 AND ov."organizationId" = $2`;

export function retailPurchaseCostEndpoints({ pool, requireAccess, transaction }: { pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction }) {
  const itemQuery = z.object({ organizationId: z.string().min(1), supplierItemId: z.string().min(1) }).strict();
  const currency = z.string().trim().regex(/^[A-Za-z]{3}$/).transform(value => value.toUpperCase());
  const effectiveTime = z.string().datetime({ offset: true })
    .refine(value => !/\.\d{4}/.test(value), "Effective time supports at most millisecond precision")
    .transform(value => new Date(value).toISOString());
  async function writeAuthority(db: Pool | PoolClient, organizationId: string, actorUserId: string) {
    const access = await requireAccess(db, organizationId, actorUserId, "retail:purchase");
    if (!access.capabilities.includes("retail:cost:read")) throw new APIError("FORBIDDEN", { message: "Purchase-cost writes also require cost visibility" });
  }
  async function parent(db: Pool | PoolClient, organizationId: string, supplierItemId: string, lock = false) {
    const result = await db.query<Parent>(
      `SELECT si.id, si."unitsPerPack", si.active, s.active AS "supplierActive", r.enabled AS "enrollmentEnabled", v.active AS "variantActive", i.active AS "itemActive"
       FROM "retailSupplierItem" si JOIN "retailSupplier" s ON s.id = si."supplierId"
       JOIN "retailOrganizationVariant" r ON r.id = si."retailOrganizationVariantId"
       JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
       JOIN "inventoryItemVariant" v ON v.id = ov."inventoryItemVariantId"
       JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
       WHERE si.id = $1 AND s."organizationId" = $2 AND ov."organizationId" = $2
       ${lock ? "FOR UPDATE OF si FOR SHARE OF s, r, ov, v, i" : ""}`, [supplierItemId, organizationId]);
    if (!result.rows[0]) throw new APIError("NOT_FOUND", { message: "Organization supplier item not found" });
    return result.rows[0];
  }
  return {
    createRetailPurchaseCost: createAuthEndpoint("/retail/purchase-cost", {
      method: "POST", use: [sessionMiddleware],
      body: itemQuery.extend({
        idempotencyKey: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/),
        packCostMinor: z.number().int().min(0).max(2_147_483_647), currency,
        unitsPerPack: z.number().int().min(1).max(1_000_000), effectiveAt: effectiveTime,
        reason: z.string().normalize("NFKC").trim().min(3).max(500).refine(value => !/[\x00-\x1f\x7f-\x9f]/.test(value)),
      }),
    }, async ctx => {
      const body = ctx.body, actorUserId = ctx.context.session.user.id;
      await writeAuthority(pool, body.organizationId, actorUserId);
      const fingerprint = purchaseCostFingerprint(body);
      const result = await transaction(body.organizationId, async db => {
        await writeAuthority(db, body.organizationId, actorUserId);
        const item = await parent(db, body.organizationId, body.supplierItemId, true);
        const prior = await db.query<Cost & { requestFingerprint: string }>(
          `SELECT ${projection}, c."requestFingerprint" FROM "retailPurchaseCost" c
           WHERE c."supplierItemId" = $1 AND c."idempotencyKey" = $2 FOR UPDATE OF c`, [body.supplierItemId, body.idempotencyKey]);
        if (prior.rows[0]) {
          const { requestFingerprint, ...cost } = prior.rows[0];
          if (requestFingerprint !== fingerprint) throw new APIError("CONFLICT", { message: "Idempotency key already used for another purchase cost" });
          return { created: false, cost };
        }
        if (!(item.active && item.supplierActive && item.enrollmentEnabled && item.variantActive && item.itemActive)) {
          throw new APIError("CONFLICT", { message: "New costs require an active supplier item and sellable parents" });
        }
        if (item.unitsPerPack !== body.unitsPerPack) throw new APIError("CONFLICT", { message: "Supplier pack conversion changed; refresh before recording cost" });
        const saved = await db.query<Cost>(
          `INSERT INTO "retailPurchaseCost" AS c (id, "supplierItemId", "idempotencyKey", "requestFingerprint", "packCostMinor", currency, "unitsPerPackSnapshot", "effectiveAt", reason, "actorUserId", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
           RETURNING ${projection}`,
          [randomUUID(), body.supplierItemId, body.idempotencyKey, fingerprint, body.packCostMinor, body.currency, body.unitsPerPack, body.effectiveAt, body.reason, actorUserId]);
        const cost = saved.rows[0];
        if (!cost) throw new Error("Purchase cost was not saved");
        await appendRevisionInTransaction(db, { resourceType: "retailPurchaseCost", resourceId: cost.id, organizationId: body.organizationId,
          actorUserId, operation: "create", snapshot: cost });
        return { created: true, cost };
      });
      return ctx.json({ organizationId: body.organizationId, ...result });
    }),
    listRetailPurchaseCosts: createAuthEndpoint("/retail/purchase-costs", {
      method: "GET", use: [sessionMiddleware],
      query: itemQuery.extend({ currency: currency.optional(), limit: z.coerce.number().int().min(1).max(200).default(100), before: z.string().datetime({ offset: true }).optional(), beforeId: z.string().min(1).optional() })
        .refine(value => Boolean(value.before) === Boolean(value.beforeId), "Supply both before and beforeId"),
    }, async ctx => {
      const { organizationId, supplierItemId, currency, limit, before, beforeId } = ctx.query;
      await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:cost:read");
      await parent(pool, organizationId, supplierItemId);
      const rows = (await pool.query<Cost>(
        `SELECT ${projection} ${ownedCost}
         AND ($3::text IS NULL OR c.currency = $3)
         AND ($4::timestamptz IS NULL OR (c."createdAt", c.id) < ($4::timestamptz, $5::text))
         ORDER BY c."createdAt" DESC, c.id DESC LIMIT $6`, [supplierItemId, organizationId, currency ?? null, before ?? null, beforeId ?? null, limit + 1])).rows;
      const page = rows.slice(0, limit), last = page.at(-1);
      return ctx.json({ organizationId, supplierItemId, costs: page, next: rows.length > limit ? { before: last!.createdAt, beforeId: last!.id } : null });
    }),
    getRetailCurrentPurchaseCost: createAuthEndpoint("/retail/purchase-cost/current", {
      method: "GET", use: [sessionMiddleware], query: itemQuery.extend({ currency, asOf: effectiveTime.optional() }),
    }, async ctx => {
      const { organizationId, supplierItemId, currency, asOf } = ctx.query;
      await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:cost:read");
      await parent(pool, organizationId, supplierItemId);
      const result = await pool.query<Cost>(
        `SELECT ${projection} ${ownedCost} AND c.currency = $3
         AND c."effectiveAt" <= COALESCE($4::timestamptz, CURRENT_TIMESTAMP)
         ORDER BY c."effectiveAt" DESC, c."createdAt" DESC, c.id DESC LIMIT 1`, [supplierItemId, organizationId, currency, asOf ?? null]);
      return ctx.json({ organizationId, supplierItemId, currency, cost: result.rows[0] ?? null });
    }),
  };
}
