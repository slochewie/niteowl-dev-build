import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RetailAccess, RetailDatabase } from "./access.ts";
import type { RequireRetailAccess, RetailTransaction } from "./assignments.ts";

export const LOCATION_CAPABILITIES = ["retail:read", "retail:stock:adjust", "retail:stock:transfer", "retail:receive", "retail:purchase", "retail:cost:read"] as const;
export type LocationCapability = (typeof LOCATION_CAPABILITIES)[number];
export const retailLocationSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailLocation: {
    fields: {
      organizationId: { type: "string", required: true, references: { model: "organization", field: "id", onDelete: "restrict" } },
      code: { type: "string", required: true },
      name: { type: "string", required: true },
      active: { type: "boolean", required: true, defaultValue: true },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["organizationId", "code"], unique: true }, { fields: ["organizationId", "active"] }],
  },
  retailLocationGrant: {
    fields: {
      assignmentCapabilityId: { type: "string", required: true, references: { model: "retailAssignmentCapability", field: "id", onDelete: "cascade" } },
      locationId: { type: "string", required: true, references: { model: "retailLocation", field: "id", onDelete: "restrict" } },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["assignmentCapabilityId", "locationId"], unique: true }, { fields: ["locationId"] }],
  },
};
export function normalizeLocationCode(value: string): string {
  const code = value.normalize("NFKC").trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9_-]{0,39}$/.test(code)) throw new APIError("BAD_REQUEST", { message: "Invalid location code" });
  return code;
}
export function normalizeLocationName(value: string): string {
  const name = value.normalize("NFKC").trim();
  if (!name || name.length > 120 || /[\x00-\x1f\x7f]/.test(name)) throw new APIError("BAD_REQUEST", { message: "Invalid location name" });
  return name;
}

/** Intersect trusted organization authority with explicit location scopes. */
export async function effectiveLocationCapabilities(db: RetailDatabase, authority: RetailAccess, organizationId: string, userId: string, locationId: string): Promise<LocationCapability[]> {
  const location = await db.query<{ active: boolean }>('SELECT active FROM "retailLocation" WHERE id = $1 AND "organizationId" = $2', [locationId, organizationId]);
  if (!location.rows[0]) throw new APIError("NOT_FOUND", { message: "Location not found" });
  if (!location.rows[0].active) return [];
  const allowed = LOCATION_CAPABILITIES.filter(capability => authority.capabilities.includes(capability));
  if (authority.canManageAdministrators || !allowed.length) return allowed;
  const scopes = await db.query<{ capability: string }>(
    `SELECT c.capability FROM "retailAssignmentCapability" c
     JOIN "retailAssignment" a ON a.id = c."assignmentId" AND a.enabled = true
     JOIN member m ON m.id = a."memberId"
     WHERE m."organizationId" = $1 AND m."userId" = $2
       AND (c."allLocations" = true OR EXISTS (
         SELECT 1 FROM "retailLocationGrant" g JOIN "retailLocation" l ON l.id = g."locationId"
         WHERE g."assignmentCapabilityId" = c.id AND l.id = $3
           AND l."organizationId" = m."organizationId" AND l.active = true
       ))`, [organizationId, userId, locationId]);
  return allowed.filter(capability => scopes.rows.some(row => row.capability === capability));
}
/** Future stock mutations must call this after acquiring the organization write lock. */
export async function requireRetailLocationAccess(db: RetailDatabase, requireAccess: RequireRetailAccess, organizationId: string, userId: string, locationId: string, capability: LocationCapability): Promise<void> {
  if (!LOCATION_CAPABILITIES.includes(capability)) throw new APIError("FORBIDDEN", { message: "Unsupported location capability" });
  const authority = await requireAccess(db, organizationId, userId, capability);
  const allowed = await effectiveLocationCapabilities(db, authority, organizationId, userId, locationId);
  if (!allowed.includes(capability)) throw new APIError("FORBIDDEN", { message: "Location capability is not authorized" });
}

export function retailLocationEndpoints({ pool, requireAccess, resolveAccess, transaction }: {
  pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction;
  resolveAccess: (db: RetailDatabase, organizationId: string, userId: string) => Promise<RetailAccess>;
}) {
  const orgQuery = z.object({ organizationId: z.string().min(1) }).strict();
  const targetQuery = orgQuery.extend({ userId: z.string().min(1) });
  async function administrator(db: RetailDatabase, organizationId: string, userId: string) {
    const authority = await requireAccess(db, organizationId, userId, "retail:manage");
    if (!authority.canManageAdministrators) throw new APIError("FORBIDDEN", { message: "Organization/system administrator required" });
  }
  async function target(db: RetailDatabase, organizationId: string, userId: string, lock = false) {
    const result = await db.query<{ memberId: string; memberRole: string; systemRole: string }>(
      `SELECT m.id AS "memberId", m.role AS "memberRole", u.role AS "systemRole"
       FROM member m JOIN "user" u ON u.id = m."userId"
       LEFT JOIN "organizationMemberStatus" oms ON oms."memberId" = m.id
       WHERE m."organizationId" = $1 AND m."userId" = $2
         AND NOT COALESCE(u.banned, false) AND COALESCE(oms.active, true)
         AND (oms."accessExpiresAt" IS NULL OR oms."accessExpiresAt" > CURRENT_TIMESTAMP)
       ${lock ? "FOR UPDATE OF m, u" : ""}`, [organizationId, userId]);
    const member = result.rows[0];
    if (!member) throw new APIError("NOT_FOUND", { message: "Active organization member not found" });
    if (member.systemRole === "admin" || member.memberRole === "owner" || member.memberRole === "admin") throw new APIError("FORBIDDEN", { message: "Protected administrators have implicit location access" });
    return member;
  }
  async function audit(db: PoolClient, organizationId: string, actorUserId: string, resourceType: string, resourceId: string, operation: "create" | "update", snapshot: unknown) {
    await appendRevisionInTransaction(db, { organizationId, actorUserId, resourceType, resourceId, operation, snapshot });
  }
  return {
    listRetailLocations: createAuthEndpoint("/retail/locations", { method: "GET", use: [sessionMiddleware], query: orgQuery }, async ctx => {
      const organizationId = ctx.query.organizationId, userId = ctx.context.session.user.id;
      const authority = await requireAccess(pool, organizationId, userId, "retail:read");
      const result = await pool.query(
        `SELECT l.id, l.code, l.name, l.active FROM "retailLocation" l
         WHERE l."organizationId" = $1 AND l.active = true AND ($3::boolean OR EXISTS (
           SELECT 1 FROM "retailAssignmentCapability" c
           JOIN "retailAssignment" a ON a.id = c."assignmentId" AND a.enabled = true
           JOIN member m ON m.id = a."memberId"
           WHERE m."organizationId" = l."organizationId" AND m."userId" = $2
             AND c.capability = 'retail:read' AND (c."allLocations" = true OR EXISTS (
               SELECT 1 FROM "retailLocationGrant" g WHERE g."assignmentCapabilityId" = c.id AND g."locationId" = l.id
             ))
         )) ORDER BY l.code, l.id`, [organizationId, userId, authority.canManageAdministrators]);
      return ctx.json({ organizationId, locations: result.rows });
    }),
    listRetailLocationsForManagement: createAuthEndpoint("/retail/locations/manage", { method: "GET", use: [sessionMiddleware], query: orgQuery }, async ctx => {
      const organizationId = ctx.query.organizationId;
      await administrator(pool, organizationId, ctx.context.session.user.id);
      const result = await pool.query('SELECT id, code, name, active FROM "retailLocation" WHERE "organizationId" = $1 ORDER BY code, id', [organizationId]);
      return ctx.json({ organizationId, locations: result.rows });
    }),
    createRetailLocation: createAuthEndpoint("/retail/location", {
      method: "POST", use: [sessionMiddleware], body: orgQuery.extend({ code: z.string().min(1).max(200), name: z.string().min(1).max(500) }),
    }, async ctx => {
      const { organizationId } = ctx.body, actorUserId = ctx.context.session.user.id;
      await administrator(pool, organizationId, actorUserId);
      const code = normalizeLocationCode(ctx.body.code), name = normalizeLocationName(ctx.body.name);
      try {
        const location = await transaction(organizationId, async db => {
          await administrator(db, organizationId, actorUserId);
          const saved = await db.query(
            `INSERT INTO "retailLocation" (id, "organizationId", code, name, active, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, code, name, active`, [randomUUID(), organizationId, code, name]);
          const row = saved.rows[0];
          if (!row) throw new Error("Location was not saved");
          await audit(db, organizationId, actorUserId, "retailLocation", row.id, "create", row);
          return row;
        });
        return ctx.json({ organizationId, location });
      } catch (error) {
        if ((error as { code?: string }).code === "23505") throw new APIError("CONFLICT", { message: "Location code already exists" });
        throw error;
      }
    }),
    updateRetailLocation: createAuthEndpoint("/retail/location", {
      method: "PATCH", use: [sessionMiddleware], body: orgQuery.extend({ locationId: z.string().min(1), name: z.string().min(1).max(500), active: z.boolean() }),
    }, async ctx => {
      const { organizationId, locationId, active } = ctx.body, actorUserId = ctx.context.session.user.id;
      await administrator(pool, organizationId, actorUserId);
      const name = normalizeLocationName(ctx.body.name);
      const location = await transaction(organizationId, async db => {
        await administrator(db, organizationId, actorUserId);
        const saved = await db.query(
          `UPDATE "retailLocation" SET name = $3, active = $4, "updatedAt" = CURRENT_TIMESTAMP
           WHERE id = $1 AND "organizationId" = $2 RETURNING id, code, name, active`, [locationId, organizationId, name, active]);
        const row = saved.rows[0];
        if (!row) throw new APIError("NOT_FOUND", { message: "Location not found" });
        await audit(db, organizationId, actorUserId, "retailLocation", row.id, "update", row);
        return row;
      });
      return ctx.json({ organizationId, location });
    }),
    getRetailLocationAccess: createAuthEndpoint("/retail/location-access", { method: "GET", use: [sessionMiddleware], query: orgQuery.extend({ locationId: z.string().min(1) }) }, async ctx => {
      const { organizationId, locationId } = ctx.query, userId = ctx.context.session.user.id;
      const authority = await resolveAccess(pool, organizationId, userId);
      if (!authority.capabilities.some(capability => LOCATION_CAPABILITIES.includes(capability as LocationCapability))) {
        throw new APIError("FORBIDDEN", { message: "Retail location access unavailable" });
      }
      const capabilities = await effectiveLocationCapabilities(pool, authority, organizationId, userId, locationId);
      if (!capabilities.length) throw new APIError("FORBIDDEN", { message: "Location capability is not authorized" });
      return ctx.json({ organizationId, locationId, capabilities });
    }),
    listRetailLocationGrants: createAuthEndpoint("/retail/location-grants", { method: "GET", use: [sessionMiddleware], query: targetQuery }, async ctx => {
      const { organizationId, userId } = ctx.query;
      await administrator(pool, organizationId, ctx.context.session.user.id);
      const member = await target(pool, organizationId, userId);
      const result = await pool.query(
        `SELECT c.id AS "assignmentCapabilityId", c.capability, c."allLocations", a.enabled,
          COALESCE(array_agg(l.id ORDER BY l.id) FILTER (WHERE l.id IS NOT NULL), ARRAY[]::text[]) AS "locationIds"
         FROM "retailAssignmentCapability" c JOIN "retailAssignment" a ON a.id = c."assignmentId"
         JOIN member m ON m.id = a."memberId" AND m."organizationId" = $2
         LEFT JOIN "retailLocationGrant" g ON g."assignmentCapabilityId" = c.id
         LEFT JOIN "retailLocation" l ON l.id = g."locationId" AND l."organizationId" = m."organizationId"
         WHERE a."memberId" = $1 AND c.capability = ANY($3::text[])
         GROUP BY c.id, c.capability, c."allLocations", a.enabled ORDER BY c.capability`, [member.memberId, organizationId, [...LOCATION_CAPABILITIES]]);
      return ctx.json({ organizationId, userId, scopes: result.rows });
    }),
    updateRetailLocationGrant: createAuthEndpoint("/retail/location-grant", {
      method: "PATCH", use: [sessionMiddleware], body: targetQuery.extend({ capability: z.enum(LOCATION_CAPABILITIES), allLocations: z.boolean(), locationIds: z.array(z.string().min(1)).max(200) }),
    }, async ctx => {
      const { organizationId, userId, capability, allLocations, locationIds } = ctx.body, actorUserId = ctx.context.session.user.id;
      await administrator(pool, organizationId, actorUserId);
      if (actorUserId === userId) throw new APIError("FORBIDDEN", { message: "Cannot change your own location grants" });
      if (new Set(locationIds).size !== locationIds.length || (allLocations && locationIds.length)) throw new APIError("BAD_REQUEST", { message: "Use distinct location IDs or explicit all-locations scope" });
      const scope = await transaction(organizationId, async db => {
        await administrator(db, organizationId, actorUserId);
        const member = await target(db, organizationId, userId, true);
        const current = await db.query<{ id: string; allLocations: boolean }>(
          `SELECT c.id, c."allLocations" FROM "retailAssignmentCapability" c
           JOIN "retailAssignment" a ON a.id = c."assignmentId" AND a.enabled = true
           WHERE a."memberId" = $1 AND c.capability = $2 FOR UPDATE OF a, c`, [member.memberId, capability]);
        const row = current.rows[0];
        if (!row) throw new APIError("NOT_FOUND", { message: "Enabled assignment capability not found" });
        const locations = await db.query<{ id: string }>('SELECT id FROM "retailLocation" WHERE "organizationId" = $1 AND active = true AND id = ANY($2::text[]) ORDER BY id FOR SHARE', [organizationId, locationIds]);
        if (locations.rows.length !== locationIds.length) throw new APIError("NOT_FOUND", { message: "Active organization location not found" });
        const previous = await db.query<{ locationId: string }>('SELECT "locationId" FROM "retailLocationGrant" WHERE "assignmentCapabilityId" = $1 ORDER BY "locationId"', [row.id]);
        await db.query('UPDATE "retailAssignmentCapability" SET "allLocations" = $2 WHERE id = $1', [row.id, allLocations]);
        await db.query('DELETE FROM "retailLocationGrant" WHERE "assignmentCapabilityId" = $1', [row.id]);
        for (const locationId of [...locationIds].sort()) {
          await db.query('INSERT INTO "retailLocationGrant" (id, "assignmentCapabilityId", "locationId", "createdAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [randomUUID(), row.id, locationId]);
        }
        const snapshot = { assignmentCapabilityId: row.id, userId, capability, allLocations, locationIds: [...locationIds].sort() };
        await audit(db, organizationId, actorUserId, "retailLocationScope", row.id, "update", { before: { allLocations: row.allLocations, locationIds: previous.rows.map(value => value.locationId) }, after: snapshot });
        return snapshot;
      });
      return ctx.json({ organizationId, scope });
    }),
  };
}
