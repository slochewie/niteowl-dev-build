import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RequireRetailAccess, RetailTransaction } from "./assignments.ts";

export function normalizeSku(value: string): string {
  const sku = value.normalize("NFKC").trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9._/-]{0,79}$/.test(sku)) {
    throw new APIError("BAD_REQUEST", { message: "SKU must be 1–80 letters, digits, dots, slashes, underscores or hyphens" });
  }
  return sku;
}
export function normalizeBarcode(value: string): string {
  const barcode = value.trim();
  if (!/^[\x21-\x7e]{1,128}$/.test(barcode)) {
    throw new APIError("BAD_REQUEST", { message: "Barcode must be 1–128 printable ASCII characters without spaces" });
  }
  return barcode;
}
const symbologies = ["unspecified", "upc-a", "ean-13", "ean-8", "code-128", "code-39", "qr"] as const;
const organization = z.object({ organizationId: z.string().min(1) }).strict();
const enrollment = organization.extend({ retailOrganizationVariantId: z.string().min(1) });

export const retailIdentifierSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailSku: {
    fields: {
      organizationId: { type: "string", required: true, references: { model: "organization", field: "id", onDelete: "cascade" } },
      retailOrganizationVariantId: { type: "string", required: true, unique: true, references: { model: "retailOrganizationVariant", field: "id", onDelete: "restrict" } },
      sku: { type: "string", required: true },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["organizationId", "sku"], unique: true }],
  },
  retailBarcode: {
    fields: {
      organizationId: { type: "string", required: true, references: { model: "organization", field: "id", onDelete: "cascade" } },
      retailOrganizationVariantId: { type: "string", required: true, references: { model: "retailOrganizationVariant", field: "id", onDelete: "restrict" } },
      barcode: { type: "string", required: true },
      symbology: { type: "string", required: true, defaultValue: "unspecified" },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [
      { fields: ["organizationId", "barcode"], unique: true },
      { fields: ["retailOrganizationVariantId"] },
    ],
  },
};

async function requireEnrollment(db: Pool | PoolClient, organizationId: string, id: string, active: boolean) {
  const result = await db.query(
    `SELECT r.id FROM "retailOrganizationVariant" r
     JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
     JOIN "inventoryItemVariant" v ON v.id = ov."inventoryItemVariantId"
     JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
     WHERE r.id = $1 AND ov."organizationId" = $2
       AND (NOT $3::boolean OR (r.enabled AND v.active AND i.active))
     FOR UPDATE OF r`,
    [id, organizationId, active],
  );
  if (result.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Retail enrollment not found or inactive" });
}

async function auditIdentifier(db: PoolClient, actorUserId: string, organizationId: string,
  kind: "sku" | "barcode", operation: "create" | "update" | "delete", snapshot: { id: string; [key: string]: unknown }) {
  await appendRevisionInTransaction(db, {
    resourceType: kind === "sku" ? "retailSku" : "retailBarcode", resourceId: snapshot.id,
    organizationId, actorUserId, operation, snapshot,
  });
}

async function uniqueWrite<T>(run: () => Promise<T>) {
  try { return await run(); }
  catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      throw new APIError("CONFLICT", { message: "Identifier is already assigned within this organization" });
    }
    throw error;
  }
}

export function retailIdentifierEndpoints({
  pool, requireAccess, transaction,
}: { pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction }) {
  return {
    listRetailIdentifiers: createAuthEndpoint("/retail/identifiers", {
      method: "GET", use: [sessionMiddleware], query: enrollment,
    }, async (ctx) => {
      const { organizationId, retailOrganizationVariantId } = ctx.query;
      await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:read");
      const parent = await pool.query(
        `SELECT r.id FROM "retailOrganizationVariant" r
         JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
         WHERE r.id = $1 AND ov."organizationId" = $2`,
        [retailOrganizationVariantId, organizationId],
      );
      if (parent.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Retail enrollment not found" });
      const sku = await pool.query(
        'SELECT id, sku FROM "retailSku" WHERE "retailOrganizationVariantId" = $1 AND "organizationId" = $2',
        [retailOrganizationVariantId, organizationId],
      );
      const barcodes = await pool.query(
        'SELECT id, barcode, symbology FROM "retailBarcode" WHERE "retailOrganizationVariantId" = $1 AND "organizationId" = $2 ORDER BY barcode',
        [retailOrganizationVariantId, organizationId],
      );
      return ctx.json({ retailOrganizationVariantId, sku: sku.rows[0] ?? null, barcodes: barcodes.rows });
    }),
    setRetailSku: createAuthEndpoint("/retail/sku", {
      method: "PATCH", use: [sessionMiddleware],
      body: enrollment.extend({ sku: z.string().max(160).nullable() }),
    }, async (ctx) => {
      const { organizationId, retailOrganizationVariantId } = ctx.body;
      const sku = ctx.body.sku === null ? null : normalizeSku(ctx.body.sku);
      const userId = ctx.context.session.user.id;
      await requireAccess(pool, organizationId, userId, "retail:item:write");
      const result = await transaction(organizationId, async (db) => {
        await requireAccess(db, organizationId, userId, "retail:item:write");
        await requireEnrollment(db, organizationId, retailOrganizationVariantId, sku !== null);
        const current = await db.query<{ id: string; sku: string }>(
          'SELECT id, sku FROM "retailSku" WHERE "retailOrganizationVariantId" = $1 AND "organizationId" = $2 FOR UPDATE',
          [retailOrganizationVariantId, organizationId],
        );
        const existing = current.rows[0];
        if (sku === null) {
          if (existing) {
            await db.query('DELETE FROM "retailSku" WHERE id = $1 AND "organizationId" = $2', [existing.id, organizationId]);
            await auditIdentifier(db, userId, organizationId, "sku", "delete", { ...existing, retailOrganizationVariantId });
          }
          return { sku: null };
        }
        if (existing?.sku === sku) return existing;
        const duplicate = await db.query(
          'SELECT id FROM "retailSku" WHERE "organizationId" = $1 AND sku = $2 AND "retailOrganizationVariantId" <> $3',
          [organizationId, sku, retailOrganizationVariantId],
        );
        if (duplicate.rowCount) throw new APIError("CONFLICT", { message: "SKU is already assigned within this organization" });
        const id = existing?.id ?? randomUUID();
        await uniqueWrite(() => existing
          ? db.query('UPDATE "retailSku" SET sku = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 AND "organizationId" = $3', [sku, id, organizationId])
          : db.query(
              `INSERT INTO "retailSku" (id, "organizationId", "retailOrganizationVariantId", sku, "createdAt", "updatedAt")
               VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
              [id, organizationId, retailOrganizationVariantId, sku],
            ));
        const snapshot = { id, retailOrganizationVariantId, sku };
        await auditIdentifier(db, userId, organizationId, "sku", existing ? "update" : "create", snapshot);
        return { id, sku };
      });
      return ctx.json({ retailOrganizationVariantId, ...result });
    }),
    addRetailBarcode: createAuthEndpoint("/retail/barcode", {
      method: "POST", use: [sessionMiddleware],
      body: enrollment.extend({ barcode: z.string().max(256), symbology: z.enum(symbologies).default("unspecified") }),
    }, async (ctx) => {
      const { organizationId, retailOrganizationVariantId, symbology } = ctx.body;
      const barcode = normalizeBarcode(ctx.body.barcode);
      const userId = ctx.context.session.user.id;
      await requireAccess(pool, organizationId, userId, "retail:item:write");
      const result = await transaction(organizationId, async (db) => {
        await requireAccess(db, organizationId, userId, "retail:item:write");
        await requireEnrollment(db, organizationId, retailOrganizationVariantId, true);
        const duplicate = await db.query<{ id: string; retailOrganizationVariantId: string; symbology: string }>(
          'SELECT id, "retailOrganizationVariantId", symbology FROM "retailBarcode" WHERE "organizationId" = $1 AND barcode = $2 FOR UPDATE',
          [organizationId, barcode],
        );
        const existing = duplicate.rows[0];
        if (existing) {
          if (existing.retailOrganizationVariantId !== retailOrganizationVariantId || existing.symbology !== symbology) {
            throw new APIError("CONFLICT", { message: "Barcode already has a different mapping or symbology" });
          }
          return { id: existing.id, barcode, symbology };
        }
        const id = randomUUID();
        await uniqueWrite(() => db.query(
          `INSERT INTO "retailBarcode" (id, "organizationId", "retailOrganizationVariantId", barcode, symbology, "createdAt")
           VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [id, organizationId, retailOrganizationVariantId, barcode, symbology],
        ));
        await auditIdentifier(db, userId, organizationId, "barcode", "create", { id, retailOrganizationVariantId, barcode, symbology });
        return { id, barcode, symbology };
      });
      return ctx.json({ retailOrganizationVariantId, ...result });
    }),
    removeRetailBarcode: createAuthEndpoint("/retail/barcode/remove", {
      method: "POST", use: [sessionMiddleware],
      body: organization.extend({ barcodeId: z.string().min(1) }),
    }, async (ctx) => {
      const { organizationId, barcodeId } = ctx.body;
      const userId = ctx.context.session.user.id;
      await requireAccess(pool, organizationId, userId, "retail:item:write");
      await transaction(organizationId, async (db) => {
        await requireAccess(db, organizationId, userId, "retail:item:write");
        const mapped = await db.query<{ id: string; retailOrganizationVariantId: string; barcode: string; symbology: string }>(
          `SELECT b.id, b."retailOrganizationVariantId", b.barcode, b.symbology
           FROM "retailBarcode" b
           JOIN "retailOrganizationVariant" r ON r.id = b."retailOrganizationVariantId"
           JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
           WHERE b.id = $1 AND b."organizationId" = $2 AND ov."organizationId" = $2`,
          [barcodeId, organizationId],
        );
        const row = mapped.rows[0];
        if (!row) throw new APIError("NOT_FOUND", { message: "Barcode mapping not found" });
        await requireEnrollment(db, organizationId, row.retailOrganizationVariantId, false);
        await db.query('DELETE FROM "retailBarcode" WHERE id = $1 AND "organizationId" = $2', [barcodeId, organizationId]);
        await auditIdentifier(db, userId, organizationId, "barcode", "delete", row);
      });
      return ctx.json({ removed: true, barcodeId });
    }),
    lookupRetailBarcode: createAuthEndpoint("/retail/barcode/lookup", {
      method: "GET", use: [sessionMiddleware],
      query: organization.extend({ barcode: z.string().max(256) }),
    }, async (ctx) => {
      const { organizationId } = ctx.query;
      const barcode = normalizeBarcode(ctx.query.barcode);
      await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:read");
      const result = await pool.query(
        `SELECT b.id AS "barcodeId", b.barcode, b.symbology,
          r.id AS "retailOrganizationVariantId", v.id AS "inventoryItemVariantId",
          i.id AS "inventoryItemId", i.name, v.name AS "variantName",
          COALESCE(ov."priceOverrideCents", v."defaultPriceCents") AS "effectivePriceCents"
         FROM "retailBarcode" b
         JOIN "retailOrganizationVariant" r ON r.id = b."retailOrganizationVariantId"
         JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
         JOIN "inventoryItemVariant" v ON v.id = ov."inventoryItemVariantId"
         JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
         WHERE b."organizationId" = $1 AND ov."organizationId" = $1 AND b.barcode = $2
           AND r.enabled AND v.active AND i.active`,
        [organizationId, barcode],
      );
      if (!result.rows[0]) throw new APIError("NOT_FOUND", { message: "Active barcode mapping not found" });
      return ctx.json(result.rows[0]);
    }),
  };
}
