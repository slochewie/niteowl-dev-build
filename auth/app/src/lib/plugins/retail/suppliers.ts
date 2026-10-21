import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RequireRetailAccess, RetailTransaction } from "./assignments.ts";

export const retailSupplierSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailSupplier: {
    fields: {
      organizationId: { type: "string", required: true, references: { model: "organization", field: "id", onDelete: "restrict" } },
      code: { type: "string", required: true },
      name: { type: "string", required: true },
      contactName: { type: "string", required: false },
      email: { type: "string", required: false },
      phone: { type: "string", required: false },
      active: { type: "boolean", required: true, defaultValue: true },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["organizationId", "code"], unique: true }],
  },
  retailSupplierItem: {
    fields: {
      supplierId: { type: "string", required: true, references: { model: "retailSupplier", field: "id", onDelete: "restrict" } },
      retailOrganizationVariantId: { type: "string", required: true, references: { model: "retailOrganizationVariant", field: "id", onDelete: "restrict" } },
      supplierSku: { type: "string", required: true },
      unitsPerPack: { type: "number", required: true, defaultValue: 1 },
      active: { type: "boolean", required: true, defaultValue: true },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["supplierId", "supplierSku"], unique: true }, { fields: ["retailOrganizationVariantId"] }],
  },
};

export function normalizeSupplierCode(value: string): string {
  const code = value.normalize("NFKC").trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9_-]{0,63}$/.test(code)) throw new APIError("BAD_REQUEST", { message: "Invalid supplier code" });
  return code;
}
export function normalizeSupplierSku(value: string): string {
  const sku = value.normalize("NFKC").trim();
  if (!/^[\x21-\x7e]{1,128}$/.test(sku)) throw new APIError("BAD_REQUEST", { message: "Supplier SKU must be 1–128 printable ASCII characters without spaces" });
  return sku;
}
function cleanText(maximum: number) {
  return z.string().normalize("NFKC").trim().min(1).max(maximum)
    .refine(value => !/[\x00-\x1f\x7f-\x9f]/.test(value), "Control characters are not allowed");
}
type Supplier = { id: string; organizationId: string; code: string; name: string; contactName: string | null; email: string | null; phone: string | null; active: boolean };
type SupplierItem = { id: string; supplierId: string; retailOrganizationVariantId: string; supplierSku: string; unitsPerPack: number; active: boolean };

export function retailSupplierEndpoints({ pool, requireAccess, transaction }: { pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction }) {
  const org = z.object({ organizationId: z.string().min(1) }).strict();
  const contactFields = { name: cleanText(160), contactName: cleanText(160).nullable(), email: z.string().trim().email().max(254).nullable(), phone: cleanText(80).nullable() };
  const listing = org.extend({ includeInactive: z.enum(["true", "false"]).default("false"), afterId: z.string().min(1).optional(), limit: z.coerce.number().int().min(1).max(200).default(100) });
  const packUnits = z.number().int().min(1).max(1_000_000);
  async function authority(db: Pool | PoolClient, organizationId: string, userId: string) {
    await requireAccess(db, organizationId, userId, "retail:purchase");
  }
  async function supplier(db: PoolClient, organizationId: string, supplierId: string) {
    const result = await db.query<Supplier>(
      'SELECT id, "organizationId", code, name, "contactName", email, phone, active FROM "retailSupplier" WHERE id = $1 AND "organizationId" = $2 FOR UPDATE',
      [supplierId, organizationId]);
    if (!result.rows[0]) throw new APIError("NOT_FOUND", { message: "Organization supplier not found" });
    return result.rows[0];
  }
  async function enrollment(db: PoolClient, organizationId: string, enrollmentId: string) {
    const result = await db.query(
      `SELECT r.id FROM "inventoryItem" i
       JOIN "inventoryItemVariant" v ON v."inventoryItemId" = i.id
       JOIN "inventoryOrganizationVariant" ov ON ov."inventoryItemVariantId" = v.id
       JOIN "retailOrganizationVariant" r ON r."inventoryOrganizationVariantId" = ov.id
       WHERE r.id = $1 AND ov."organizationId" = $2 AND r.enabled AND v.active AND i.active
       FOR SHARE OF i, v, ov, r`, [enrollmentId, organizationId]);
    if (result.rowCount !== 1) throw new APIError("NOT_FOUND", { message: "Active organization Retail enrollment not found" });
  }
  async function audit(db: PoolClient, organizationId: string, actorUserId: string, resourceType: string, snapshot: { id: string }, previous?: unknown) {
    await appendRevisionInTransaction(db, { organizationId, actorUserId, resourceType, resourceId: snapshot.id,
      operation: previous ? "update" : "create", snapshot, metadata: previous ? { previous } : undefined });
  }
  async function uniqueWrite<T>(run: () => Promise<T>): Promise<T> {
    try { return await run(); }
    catch (error) {
      if ((error as { code?: string })?.code === "23505") throw new APIError("CONFLICT", { message: "Supplier code or supplier SKU is already reserved" });
      throw error;
    }
  }
  function page<T extends { id: string }>(rows: T[], limit: number) {
    return { rows: rows.slice(0, limit), nextAfterId: rows.length > limit ? rows[limit - 1].id : null };
  }
  return {
    listRetailSuppliers: createAuthEndpoint("/retail/suppliers", { method: "GET", use: [sessionMiddleware], query: listing }, async ctx => {
      const { organizationId, includeInactive, afterId, limit } = ctx.query;
      await authority(pool, organizationId, ctx.context.session.user.id);
      const result = await pool.query<Supplier>(
        `SELECT id, code, name, "contactName", email, phone, active FROM "retailSupplier"
         WHERE "organizationId" = $1 AND ($2::boolean OR active)
           AND ($3::text IS NULL OR id > $3) ORDER BY id LIMIT $4`,
        [organizationId, includeInactive === "true", afterId ?? null, limit + 1]);
      const resultPage = page(result.rows, limit);
      return ctx.json({ organizationId, suppliers: resultPage.rows, nextAfterId: resultPage.nextAfterId });
    }),
    createRetailSupplier: createAuthEndpoint("/retail/supplier", {
      method: "POST", use: [sessionMiddleware],
      body: org.extend({ code: z.string().min(1).max(256), ...contactFields,
        contactName: contactFields.contactName.default(null), email: contactFields.email.default(null), phone: contactFields.phone.default(null) }),
    }, async ctx => {
      const { organizationId, name, contactName, email, phone } = ctx.body, actorUserId = ctx.context.session.user.id;
      await authority(pool, organizationId, actorUserId);
      const code = normalizeSupplierCode(ctx.body.code);
      const saved = await uniqueWrite(() => transaction(organizationId, async db => {
        await authority(db, organizationId, actorUserId);
        const result = await db.query<Supplier>(
          `INSERT INTO "retailSupplier" (id, "organizationId", code, name, "contactName", email, phone, active, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING id, "organizationId", code, name, "contactName", email, phone, active`,
          [randomUUID(), organizationId, code, name, contactName, email, phone]);
        if (!result.rows[0]) throw new Error("Supplier was not saved");
        await audit(db, organizationId, actorUserId, "retailSupplier", result.rows[0]);
        return result.rows[0];
      }));
      return ctx.json({ organizationId, supplier: saved });
    }),
    updateRetailSupplier: createAuthEndpoint("/retail/supplier", {
      method: "PATCH", use: [sessionMiddleware], body: org.extend({ supplierId: z.string().min(1), ...contactFields, active: z.boolean() }),
    }, async ctx => {
      const { organizationId, supplierId, name, contactName, email, phone, active } = ctx.body, actorUserId = ctx.context.session.user.id;
      await authority(pool, organizationId, actorUserId);
      const saved = await transaction(organizationId, async db => {
        await authority(db, organizationId, actorUserId);
        const previous = await supplier(db, organizationId, supplierId);
        const result = await db.query<Supplier>(
          `UPDATE "retailSupplier" SET name = $3, "contactName" = $4, email = $5, phone = $6, active = $7, "updatedAt" = CURRENT_TIMESTAMP
           WHERE id = $1 AND "organizationId" = $2 RETURNING id, "organizationId", code, name, "contactName", email, phone, active`,
          [supplierId, organizationId, name, contactName, email, phone, active]);
        if (!result.rows[0]) throw new Error("Supplier disappeared while locked");
        await audit(db, organizationId, actorUserId, "retailSupplier", result.rows[0], previous);
        return result.rows[0];
      });
      return ctx.json({ organizationId, supplier: saved });
    }),
    listRetailSupplierItems: createAuthEndpoint("/retail/supplier-items", {
      method: "GET", use: [sessionMiddleware], query: listing.extend({ supplierId: z.string().min(1).optional(), retailOrganizationVariantId: z.string().min(1).optional() }),
    }, async ctx => {
      const { organizationId, includeInactive, afterId, limit, supplierId, retailOrganizationVariantId } = ctx.query;
      await authority(pool, organizationId, ctx.context.session.user.id);
      const result = await pool.query<SupplierItem>(
        `SELECT si.id, si."supplierId", si."retailOrganizationVariantId", si."supplierSku", si."unitsPerPack", si.active,
          s.code AS "supplierCode", s.name AS "supplierName", s.active AS "supplierActive", r.enabled AS "enrollmentEnabled", v.active AS "variantActive", i.active AS "itemActive"
         FROM "retailSupplierItem" si JOIN "retailSupplier" s ON s.id = si."supplierId"
         JOIN "retailOrganizationVariant" r ON r.id = si."retailOrganizationVariantId"
         JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
         JOIN "inventoryItemVariant" v ON v.id = ov."inventoryItemVariantId"
         JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
         WHERE s."organizationId" = $1 AND ov."organizationId" = $1
           AND ($2::boolean OR (si.active AND s.active AND r.enabled AND v.active AND i.active))
           AND ($3::text IS NULL OR si."supplierId" = $3) AND ($4::text IS NULL OR si."retailOrganizationVariantId" = $4)
           AND ($5::text IS NULL OR si.id > $5) ORDER BY si.id LIMIT $6`,
        [organizationId, includeInactive === "true", supplierId ?? null, retailOrganizationVariantId ?? null, afterId ?? null, limit + 1]);
      const resultPage = page(result.rows, limit);
      return ctx.json({ organizationId, supplierItems: resultPage.rows, nextAfterId: resultPage.nextAfterId });
    }),
    createRetailSupplierItem: createAuthEndpoint("/retail/supplier-item", {
      method: "POST", use: [sessionMiddleware], body: org.extend({ supplierId: z.string().min(1), retailOrganizationVariantId: z.string().min(1), supplierSku: z.string().min(1).max(512), unitsPerPack: packUnits.default(1) }),
    }, async ctx => {
      const { organizationId, supplierId, retailOrganizationVariantId, unitsPerPack } = ctx.body, actorUserId = ctx.context.session.user.id;
      await authority(pool, organizationId, actorUserId);
      const supplierSku = normalizeSupplierSku(ctx.body.supplierSku);
      const saved = await uniqueWrite(() => transaction(organizationId, async db => {
        await authority(db, organizationId, actorUserId);
        const parent = await supplier(db, organizationId, supplierId);
        if (!parent.active) throw new APIError("CONFLICT", { message: "Supplier is archived" });
        await enrollment(db, organizationId, retailOrganizationVariantId);
        const existing = await db.query<SupplierItem>(
          'SELECT id, "supplierId", "retailOrganizationVariantId", "supplierSku", "unitsPerPack", active FROM "retailSupplierItem" WHERE "supplierId" = $1 AND "supplierSku" = $2 FOR UPDATE',
          [supplierId, supplierSku]);
        if (existing.rows[0]) {
          const row = existing.rows[0];
          if (row.retailOrganizationVariantId !== retailOrganizationVariantId || row.unitsPerPack !== unitsPerPack) throw new APIError("CONFLICT", { message: "Supplier SKU is reserved with different item or pack metadata" });
          return { created: false, supplierItem: row };
        }
        const result = await db.query<SupplierItem>(
          `INSERT INTO "retailSupplierItem" (id, "supplierId", "retailOrganizationVariantId", "supplierSku", "unitsPerPack", active, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING id, "supplierId", "retailOrganizationVariantId", "supplierSku", "unitsPerPack", active`,
          [randomUUID(), supplierId, retailOrganizationVariantId, supplierSku, unitsPerPack]);
        if (!result.rows[0]) throw new Error("Supplier item was not saved");
        await audit(db, organizationId, actorUserId, "retailSupplierItem", result.rows[0]);
        return { created: true, supplierItem: result.rows[0] };
      }));
      return ctx.json({ organizationId, ...saved });
    }),
    updateRetailSupplierItem: createAuthEndpoint("/retail/supplier-item", {
      method: "PATCH", use: [sessionMiddleware], body: org.extend({ supplierItemId: z.string().min(1), unitsPerPack: packUnits, active: z.boolean() }),
    }, async ctx => {
      const { organizationId, supplierItemId, unitsPerPack, active } = ctx.body, actorUserId = ctx.context.session.user.id;
      await authority(pool, organizationId, actorUserId);
      const saved = await transaction(organizationId, async db => {
        await authority(db, organizationId, actorUserId);
        const current = await db.query<SupplierItem>(
          `SELECT si.id, si."supplierId", si."retailOrganizationVariantId", si."supplierSku", si."unitsPerPack", si.active
           FROM "retailSupplierItem" si JOIN "retailSupplier" s ON s.id = si."supplierId"
           JOIN "retailOrganizationVariant" r ON r.id = si."retailOrganizationVariantId"
           JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
           WHERE si.id = $1 AND s."organizationId" = $2 AND ov."organizationId" = $2 FOR UPDATE OF si`,
          [supplierItemId, organizationId]);
        const previous = current.rows[0];
        if (!previous) throw new APIError("NOT_FOUND", { message: "Organization supplier item not found" });
        if (active) {
          if (!(await supplier(db, organizationId, previous.supplierId)).active) throw new APIError("CONFLICT", { message: "Supplier is archived" });
          await enrollment(db, organizationId, previous.retailOrganizationVariantId);
        }
        const result = await db.query<SupplierItem>(
          `UPDATE "retailSupplierItem" SET "unitsPerPack" = $2, active = $3, "updatedAt" = CURRENT_TIMESTAMP
           WHERE id = $1 RETURNING id, "supplierId", "retailOrganizationVariantId", "supplierSku", "unitsPerPack", active`,
          [supplierItemId, unitsPerPack, active]);
        if (!result.rows[0]) throw new Error("Supplier item disappeared while locked");
        await audit(db, organizationId, actorUserId, "retailSupplierItem", result.rows[0], previous);
        return result.rows[0];
      });
      return ctx.json({ organizationId, supplierItem: saved });
    }),
  };
}
