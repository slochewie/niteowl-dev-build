import { createHash, randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RequireRetailAccess, RetailTransaction } from "./assignments.ts";
import { requireRetailLocationAccess } from "./locations.ts";

const MAX_QUANTITY = 2_147_483_647;
export const retailStockSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailStockOperation: {
    fields: {
      organizationId: { type: "string", required: true, references: { model: "organization", field: "id", onDelete: "restrict" } },
      idempotencyKey: { type: "string", required: true },
      requestFingerprint: { type: "string", required: true },
      kind: { type: "string", required: true },
      reason: { type: "string", required: true },
      actorUserId: { type: "string", required: true, references: { model: "user", field: "id", onDelete: "restrict" } },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["organizationId", "idempotencyKey"], unique: true }, { fields: ["actorUserId"] }],
  },
  retailStockBalance: {
    fields: {
      retailOrganizationVariantId: { type: "string", required: true, references: { model: "retailOrganizationVariant", field: "id", onDelete: "restrict" } },
      locationId: { type: "string", required: true, references: { model: "retailLocation", field: "id", onDelete: "restrict" } },
      quantity: { type: "number", required: true },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["retailOrganizationVariantId", "locationId"], unique: true }, { fields: ["locationId"] }],
  },
  retailStockMovement: {
    fields: {
      operationId: { type: "string", required: true, references: { model: "retailStockOperation", field: "id", onDelete: "restrict" } },
      retailOrganizationVariantId: { type: "string", required: true, references: { model: "retailOrganizationVariant", field: "id", onDelete: "restrict" } },
      locationId: { type: "string", required: true, references: { model: "retailLocation", field: "id", onDelete: "restrict" } },
      quantityDelta: { type: "number", required: true },
      quantityAfter: { type: "number", required: true },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [
      { fields: ["operationId", "locationId", "retailOrganizationVariantId"], unique: true },
      { fields: ["locationId", "createdAt"] },
      { fields: ["retailOrganizationVariantId"] },
    ],
  },
};

type StockRequest = {
  organizationId: string; idempotencyKey: string; retailOrganizationVariantId: string;
  reason: string; kind: "adjustment" | "transfer"; quantity: number;
  sourceLocationId: string | null; destinationLocationId: string | null;
};
type Movement = { id: string; locationId: string; retailOrganizationVariantId: string; quantityDelta: number; quantityAfter: number };

export function stockFingerprint(request: StockRequest): string {
  return createHash("sha256").update(JSON.stringify([
    request.kind, request.retailOrganizationVariantId, request.sourceLocationId,
    request.destinationLocationId, request.quantity, request.reason,
  ])).digest("hex");
}
export function stockQuantityAfter(current: number, delta: number): number {
  if (!Number.isInteger(current) || current < 0 || current > MAX_QUANTITY || !Number.isInteger(delta) || delta === 0 || Math.abs(delta) > MAX_QUANTITY) {
    throw new APIError("CONFLICT", { message: "Invalid stock quantity" });
  }
  const next = current + delta;
  if (next < 0) throw new APIError("CONFLICT", { message: "Insufficient stock" });
  if (next > MAX_QUANTITY) throw new APIError("CONFLICT", { message: "Stock quantity exceeds supported range" });
  return next;
}

export function retailStockEndpoints({ pool, requireAccess, transaction }: {
  pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction;
}) {
  const org = z.object({ organizationId: z.string().min(1) }).strict();
  const base = org.extend({
    idempotencyKey: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/),
    retailOrganizationVariantId: z.string().min(1),
    reason: z.string().trim().min(3).max(500).refine(value => !/[\x00-\x1f\x7f]/.test(value), "Reason contains control characters"),
  });
  const units = z.number().int().min(1).max(MAX_QUANTITY);
  const locationQuery = org.extend({ locationId: z.string().min(1), limit: z.coerce.number().int().min(1).max(200).default(100) });

  async function enrollment(db: PoolClient, request: StockRequest) {
    const result = await db.query(
      `SELECT r.id FROM "inventoryItem" i
       JOIN "inventoryItemVariant" v ON v."inventoryItemId" = i.id
       JOIN "inventoryOrganizationVariant" ov ON ov."inventoryItemVariantId" = v.id
       JOIN "retailOrganizationVariant" r ON r."inventoryOrganizationVariantId" = ov.id
       WHERE r.id = $1 AND ov."organizationId" = $2 AND r.enabled AND v.active AND i.active
       FOR SHARE OF i, v, ov, r`, [request.retailOrganizationVariantId, request.organizationId]);
    if (result.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Active Retail enrollment not found" });
  }
  async function receipt(db: PoolClient, operationId: string, organizationId: string) {
    return (await db.query<Movement>(
      `SELECT m.id, m."locationId", m."retailOrganizationVariantId", m."quantityDelta", m."quantityAfter"
       FROM "retailStockMovement" m JOIN "retailStockOperation" o ON o.id = m."operationId"
       JOIN "retailLocation" l ON l.id = m."locationId" AND l."organizationId" = o."organizationId"
       JOIN "retailOrganizationVariant" r ON r.id = m."retailOrganizationVariantId"
       JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId" AND ov."organizationId" = o."organizationId"
       WHERE o.id = $1 AND o."organizationId" = $2 ORDER BY m."locationId"`, [operationId, organizationId])).rows;
  }
  async function mutate(request: StockRequest, actorUserId: string) {
    const capability = request.kind === "adjustment" ? "retail:stock:adjust" : "retail:stock:transfer";
    await requireAccess(pool, request.organizationId, actorUserId, capability);
    const fingerprint = stockFingerprint(request);
    const changes = request.kind === "adjustment"
      ? [{ locationId: request.destinationLocationId!, delta: request.quantity }]
      : [{ locationId: request.sourceLocationId!, delta: -request.quantity }, { locationId: request.destinationLocationId!, delta: request.quantity }];
    changes.sort((a, b) => a.locationId < b.locationId ? -1 : a.locationId > b.locationId ? 1 : 0);
    return transaction(request.organizationId, async db => {
      // Both transfer permissions are checked after the organization lock and before any writes.
      for (const change of changes) await requireRetailLocationAccess(db, requireAccess, request.organizationId, actorUserId, change.locationId, capability);
      const prior = await db.query<{ id: string; requestFingerprint: string }>(
        'SELECT id, "requestFingerprint" FROM "retailStockOperation" WHERE "organizationId" = $1 AND "idempotencyKey" = $2 FOR UPDATE',
        [request.organizationId, request.idempotencyKey]);
      if (prior.rows[0]) {
        if (prior.rows[0].requestFingerprint !== fingerprint) throw new APIError("CONFLICT", { message: "Idempotency key already used for another stock request" });
        const movements = await receipt(db, prior.rows[0].id, request.organizationId);
        if (movements.length !== changes.length) throw new APIError("CONFLICT", { message: "Stored stock receipt is incomplete" });
        return { operationId: prior.rows[0].id, replayed: true, movements };
      }
      await enrollment(db, request);
      const movements: Movement[] = [];
      // Create/lock balance rows in stable location order. Missing balances start at zero.
      for (const change of changes) {
        await db.query(
          `INSERT INTO "retailStockBalance" (id, "retailOrganizationVariantId", "locationId", quantity, "updatedAt")
           VALUES ($1, $2, $3, 0, CURRENT_TIMESTAMP)
           ON CONFLICT ("retailOrganizationVariantId", "locationId") DO NOTHING`,
          [randomUUID(), request.retailOrganizationVariantId, change.locationId]);
        const balance = await db.query<{ id: string; quantity: number }>(
          'SELECT id, quantity FROM "retailStockBalance" WHERE "retailOrganizationVariantId" = $1 AND "locationId" = $2 FOR UPDATE',
          [request.retailOrganizationVariantId, change.locationId]);
        if (!balance.rows[0]) throw new Error("Stock balance missing after initialization");
        const quantityAfter = stockQuantityAfter(balance.rows[0].quantity, change.delta);
        movements.push({ id: randomUUID(), locationId: change.locationId, retailOrganizationVariantId: request.retailOrganizationVariantId, quantityDelta: change.delta, quantityAfter });
      }
      const operationId = randomUUID();
      await db.query(
        `INSERT INTO "retailStockOperation" (id, "organizationId", "idempotencyKey", "requestFingerprint", kind, reason, "actorUserId", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [operationId, request.organizationId, request.idempotencyKey, fingerprint, request.kind, request.reason, actorUserId]);
      for (const movement of movements) {
        await db.query(
          `UPDATE "retailStockBalance" SET quantity = $3, "updatedAt" = CURRENT_TIMESTAMP
           WHERE "retailOrganizationVariantId" = $1 AND "locationId" = $2`,
          [movement.retailOrganizationVariantId, movement.locationId, movement.quantityAfter]);
        await db.query(
          `INSERT INTO "retailStockMovement" (id, "operationId", "retailOrganizationVariantId", "locationId", "quantityDelta", "quantityAfter", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
          [movement.id, operationId, movement.retailOrganizationVariantId, movement.locationId, movement.quantityDelta, movement.quantityAfter]);
      }
      await appendRevisionInTransaction(db, {
        resourceType: "retailStockOperation", resourceId: operationId, organizationId: request.organizationId,
        actorUserId, operation: "create", snapshot: { kind: request.kind, reason: request.reason, movements },
      });
      return { operationId, replayed: false, movements };
    });
  }
  return {
    adjustRetailStock: createAuthEndpoint("/retail/stock/adjust", {
      method: "POST", use: [sessionMiddleware],
      body: base.extend({ locationId: z.string().min(1), quantityDelta: z.number().int().min(-MAX_QUANTITY).max(MAX_QUANTITY).refine(value => value !== 0) }),
    }, async ctx => {
      const body = ctx.body;
      return ctx.json(await mutate({ ...body, kind: "adjustment", quantity: body.quantityDelta, sourceLocationId: null, destinationLocationId: body.locationId }, ctx.context.session.user.id));
    }),
    transferRetailStock: createAuthEndpoint("/retail/stock/transfer", {
      method: "POST", use: [sessionMiddleware],
      body: base.extend({ sourceLocationId: z.string().min(1), destinationLocationId: z.string().min(1), quantity: units })
        .refine(value => value.sourceLocationId !== value.destinationLocationId, "Transfer requires different locations"),
    }, async ctx => ctx.json(await mutate({ ...ctx.body, kind: "transfer" }, ctx.context.session.user.id))),
    listRetailStockBalances: createAuthEndpoint("/retail/stock/balances", {
      method: "GET", use: [sessionMiddleware], query: locationQuery.extend({ afterId: z.string().min(1).optional() }),
    }, async ctx => {
      const { organizationId, locationId, limit, afterId } = ctx.query;
      await requireRetailLocationAccess(pool, requireAccess, organizationId, ctx.context.session.user.id, locationId, "retail:read");
      const rows = (await pool.query(
        `SELECT b.id, b."retailOrganizationVariantId", b."locationId", b.quantity, b."updatedAt"
         FROM "retailStockBalance" b JOIN "retailLocation" l ON l.id = b."locationId"
         JOIN "retailOrganizationVariant" r ON r.id = b."retailOrganizationVariantId"
         JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
         WHERE l."organizationId" = $1 AND ov."organizationId" = $1 AND b."locationId" = $2
           AND ($3::text IS NULL OR b.id > $3) ORDER BY b.id LIMIT $4`,
        [organizationId, locationId, afterId ?? null, limit + 1])).rows;
      return ctx.json({ organizationId, locationId, balances: rows.slice(0, limit), nextAfterId: rows.length > limit ? rows[limit - 1].id : null });
    }),
    listRetailStockMovements: createAuthEndpoint("/retail/stock/movements", {
      method: "GET", use: [sessionMiddleware],
      query: locationQuery.extend({ before: z.string().datetime({ offset: true }).optional(), beforeId: z.string().min(1).optional() })
        .refine(value => Boolean(value.before) === Boolean(value.beforeId), "Supply both before and beforeId"),
    }, async ctx => {
      const { organizationId, locationId, limit, before, beforeId } = ctx.query;
      await requireRetailLocationAccess(pool, requireAccess, organizationId, ctx.context.session.user.id, locationId, "retail:read");
      const rows = (await pool.query(
        `SELECT m.id, m."operationId", m."retailOrganizationVariantId", m."locationId", m."quantityDelta", m."quantityAfter",
          to_char(m."createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "createdAt", o.kind, o.reason
         FROM "retailStockMovement" m JOIN "retailStockOperation" o ON o.id = m."operationId"
         JOIN "retailLocation" l ON l.id = m."locationId"
         JOIN "retailOrganizationVariant" r ON r.id = m."retailOrganizationVariantId"
         JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
         WHERE o."organizationId" = $1 AND l."organizationId" = $1 AND ov."organizationId" = $1 AND m."locationId" = $2
           AND ($3::timestamptz IS NULL OR (m."createdAt", m.id) < ($3::timestamptz, $4::text))
         ORDER BY m."createdAt" DESC, m.id DESC LIMIT $5`, [organizationId, locationId, before ?? null, beforeId ?? null, limit + 1])).rows;
      const page = rows.slice(0, limit), last = page.at(-1);
      return ctx.json({ organizationId, locationId, movements: page, next: rows.length > limit ? { before: last!.createdAt, beforeId: last!.id } : null });
    }),
  };
}
