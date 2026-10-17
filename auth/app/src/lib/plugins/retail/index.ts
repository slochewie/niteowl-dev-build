import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import type { RetailCatalog } from "../inventory/retail-catalog.ts";
import { variationAttributes } from "../inventory/variation-identity.ts";
import { resolveRetailAccess, type RetailDatabase } from "./access.ts";
import type { RetailCapability } from "./permissions.ts";
import { retailAssignmentEndpoints, retailAssignmentSchema } from "./assignments.ts";
import { retailIdentifierEndpoints, retailIdentifierSchema } from "./identifiers.ts";
import { retailLocationEndpoints, retailLocationSchema } from "./locations.ts";
import { retailStockEndpoints, retailStockSchema } from "./stock.ts";

type RetailOptions = {
  pool: Pool;
  catalog: RetailCatalog;
  /** Keep false until schema deployment and Retail-aware merges are reviewed. */
  enabled?: boolean;
};
const organizationQuery = z.object({ organizationId: z.string().min(1) }).strict();
const enrollmentBody = organizationQuery.extend({
  inventoryItemVariantId: z.string().min(1),
});
const disableBody = organizationQuery.extend({
  retailOrganizationVariantId: z.string().min(1),
});
export const retail = ({ pool, catalog, enabled = false }: RetailOptions): BetterAuthPlugin => {
  async function access(db: RetailDatabase, organizationId: string, userId: string) {
    return resolveRetailAccess(db, enabled, organizationId, userId);
  }
  async function requireAccess(db: RetailDatabase, organizationId: string, userId: string, capability: RetailCapability) {
    const authority = await access(db, organizationId, userId);
    if (!authority.capabilities.includes(capability)) {
      throw new APIError("FORBIDDEN", { message: "Retail capability is unavailable or not authorized" });
    }
    return authority;
  }
  async function transaction<T>(organizationId: string, run: (db: PoolClient) => Promise<T>) {
    const db = await pool.connect();
    try {
      await db.query("BEGIN");
      // Serialize Retail writes with grant changes; recheck authority after acquiring the lock.
      await db.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", ["retail:authorization:" + organizationId]);
      const result = await run(db);
      await db.query("COMMIT");
      return result;
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    } finally {
      db.release();
    }
  }

  return {
    id: "retail",
    schema: {
      ...retailAssignmentSchema,
      retailOrganizationConfig: {
        fields: {
          organizationId: {
            type: "string", required: true, unique: true,
            references: { model: "organization", field: "id", onDelete: "cascade" },
          },
          enabled: { type: "boolean", required: true, defaultValue: false },
          createdAt: { type: "date", required: true, defaultValue: () => new Date() },
          updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
        },
      },
      retailOrganizationVariant: {
        fields: {
          inventoryOrganizationVariantId: {
            type: "string", required: true, unique: true,
            references: { model: "inventoryOrganizationVariant", field: "id", onDelete: "restrict" },
          },
          enabled: { type: "boolean", required: true, defaultValue: true },
          createdAt: { type: "date", required: true, defaultValue: () => new Date() },
          updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
        },
      },
      // Migration planner emits CREATE TABLE in declaration order for plugin models.
      // Enrollment must exist before identifiers can reference it.
      ...retailIdentifierSchema,
      ...retailLocationSchema,
      ...retailStockSchema,
    },
    endpoints: {
      ...retailAssignmentEndpoints({ pool, requireAccess, transaction }),
      ...retailIdentifierEndpoints({ pool, requireAccess, transaction }),
      ...retailLocationEndpoints({ pool, requireAccess, resolveAccess: access, transaction }),
      ...retailStockEndpoints({ pool, requireAccess, transaction }),
      getRetailAccess: createAuthEndpoint("/retail/access", {
        method: "GET", use: [sessionMiddleware], query: organizationQuery,
      }, async (ctx) => {
        const authority = await access(pool, ctx.query.organizationId, ctx.context.session.user.id);
        return ctx.json({ allowed: authority.capabilities.length > 0, capabilities: authority.capabilities });
      }),
      listRetailCatalog: createAuthEndpoint("/retail/catalog", {
        method: "GET", use: [sessionMiddleware], query: organizationQuery,
      }, async (ctx) => {
        const organizationId = ctx.query.organizationId;
        await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:read");
        const result = await pool.query(
          `SELECT r.id AS "retailOrganizationVariantId", r.enabled,
            ov.id AS "inventoryOrganizationVariantId", ov."organizationId",
            v.id AS "inventoryItemVariantId", i.id AS "inventoryItemId",
            i.name, v.name AS "variantName", i.active AS "itemActive",
            v.active AS "variantActive",
            COALESCE((to_jsonb(v)->>'menuEligible')::boolean, true) AS "menuEligible",
            to_jsonb(v)->>'variationKey' AS "variationKey",
            COALESCE(ov."priceOverrideCents", v."defaultPriceCents") AS "effectivePriceCents",
            (SELECT s.sku FROM "retailSku" s WHERE s."retailOrganizationVariantId" = r.id
              AND s."organizationId" = ov."organizationId") AS sku,
            COALESCE((SELECT json_agg(json_build_object('id', b.id, 'barcode', b.barcode, 'symbology', b.symbology) ORDER BY b.barcode)
              FROM "retailBarcode" b WHERE b."retailOrganizationVariantId" = r.id
              AND b."organizationId" = ov."organizationId"), '[]'::json) AS barcodes
           FROM "retailOrganizationVariant" r
           JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
           JOIN "inventoryItemVariant" v ON v.id = ov."inventoryItemVariantId"
           JOIN "inventoryItem" i ON i.id = v."inventoryItemId"
           WHERE ov."organizationId" = $1
           ORDER BY LOWER(i.name), v.id, r.id`,
          [organizationId],
        );
        return ctx.json({ organizationId, items: result.rows.map(({ variationKey, ...row }) => ({
          ...row, attributes: variationAttributes(variationKey),
        })) });
      }),
      createRetailVariant: createAuthEndpoint("/retail/variant", {
        method: "POST", use: [sessionMiddleware],
        body: organizationQuery.extend({
          inventoryItemId: z.string().min(1),
          attributes: z.record(z.string(), z.string()),
        }),
      }, async (ctx) => {
        const { organizationId, inventoryItemId, attributes } = ctx.body;
        const userId = ctx.context.session.user.id;
        await requireAccess(pool, organizationId, userId, "retail:item:write");
        const result = await transaction(organizationId, async (db) => {
          await requireAccess(db, organizationId, userId, "retail:item:write");
          const variant = await catalog.createRetailVariant(db, inventoryItemId, attributes);
          const organizationVariantId = await catalog.ensureOrganizationVariant(db, organizationId, variant.inventoryItemVariantId);
          await db.query(
            `INSERT INTO "retailOrganizationVariant" (
              id, "inventoryOrganizationVariantId", enabled, "createdAt", "updatedAt"
             ) VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT ("inventoryOrganizationVariantId") DO NOTHING`,
            [randomUUID(), organizationVariantId],
          );
          const enrollment = await db.query(
            `SELECT r.id AS "retailOrganizationVariantId", r.enabled
             FROM "retailOrganizationVariant" r
             JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
             WHERE ov.id = $1 AND ov."organizationId" = $2`,
            [organizationVariantId, organizationId],
          );
          if (!enrollment.rows[0]) throw new Error("Retail enrollment was not created");
          return { ...variant, ...enrollment.rows[0] };
        });
        return ctx.json({ organizationId, inventoryItemId, ...result });
      }),
      enrollRetailVariant: createAuthEndpoint("/retail/organization-variant", {
        method: "POST", use: [sessionMiddleware], body: enrollmentBody,
      }, async (ctx) => {
        const { organizationId, inventoryItemVariantId } = ctx.body;
        const userId = ctx.context.session.user.id;
        // Deny before opening a transaction when the rollout gate is closed.
        await requireAccess(pool, organizationId, userId, "retail:item:write");
        const enrollment = await transaction(organizationId, async (db) => {
          await requireAccess(db, organizationId, userId, "retail:item:write");
          const organizationVariantId = await catalog.ensureOrganizationVariant(db, organizationId, inventoryItemVariantId);
          await db.query(
            `INSERT INTO "retailOrganizationVariant" (
              id, "inventoryOrganizationVariantId", enabled, "createdAt", "updatedAt"
             ) VALUES ($1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT ("inventoryOrganizationVariantId") DO NOTHING`,
            [randomUUID(), organizationVariantId],
          );
          const result = await db.query(
            `SELECT r.id AS "retailOrganizationVariantId", r.enabled
             FROM "retailOrganizationVariant" r
             JOIN "inventoryOrganizationVariant" ov ON ov.id = r."inventoryOrganizationVariantId"
             WHERE ov.id = $1 AND ov."organizationId" = $2`,
            [organizationVariantId, organizationId],
          );
          if (!result.rows[0]) throw new Error("Retail enrollment was not created");
          return result.rows[0];
        });
        return ctx.json({ organizationId, inventoryItemVariantId, ...enrollment });
      }),
      disableRetailVariant: createAuthEndpoint("/retail/organization-variant/disable", {
        method: "POST", use: [sessionMiddleware], body: disableBody,
      }, async (ctx) => {
        const { organizationId, retailOrganizationVariantId } = ctx.body;
        const userId = ctx.context.session.user.id;
        await requireAccess(pool, organizationId, userId, "retail:item:write");
        const enrollment = await transaction(organizationId, async (db) => {
          await requireAccess(db, organizationId, userId, "retail:item:write");
          const result = await db.query(
            `UPDATE "retailOrganizationVariant" r SET enabled = false, "updatedAt" = CURRENT_TIMESTAMP
             FROM "inventoryOrganizationVariant" ov
             WHERE r.id = $1 AND ov.id = r."inventoryOrganizationVariantId"
               AND ov."organizationId" = $2
             RETURNING r.id AS "retailOrganizationVariantId", r.enabled`,
            [retailOrganizationVariantId, organizationId],
          );
          if (!result.rows[0]) throw new APIError("NOT_FOUND", { message: "Retail enrollment not found" });
          return result.rows[0];
        });
        return ctx.json(enrollment);
      }),
    },
  };
};
