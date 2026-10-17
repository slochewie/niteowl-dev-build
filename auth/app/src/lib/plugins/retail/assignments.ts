import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { Pool, PoolClient } from "pg";
import * as z from "zod";
import { appendRevisionInTransaction } from "../revision-history/index.ts";
import type { RetailAccess, RetailDatabase } from "./access.ts";
import { RETAIL_CAPABILITIES, retailCapabilities, type RetailCapability } from "./permissions.ts";

export const retailAssignmentSchema: NonNullable<BetterAuthPlugin["schema"]> = {
  retailAssignment: {
    fields: {
      memberId: {
        type: "string", required: true, unique: true,
        references: { model: "member", field: "id", onDelete: "cascade" },
      },
      enabled: { type: "boolean", required: true, defaultValue: false },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
      updatedAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
  },
  retailAssignmentCapability: {
    fields: {
      assignmentId: {
        type: "string", required: true,
        references: { model: "retailAssignment", field: "id", onDelete: "cascade" },
      },
      capability: { type: "string", required: true },
      allLocations: { type: "boolean", required: true, defaultValue: false },
      createdAt: { type: "date", required: true, defaultValue: () => new Date() },
    },
    indexes: [{ fields: ["assignmentId", "capability"], unique: true }],
  },
};

export type RetailTransaction = <T>(organizationId: string, run: (db: PoolClient) => Promise<T>) => Promise<T>;
export type RequireRetailAccess = (
  db: RetailDatabase, organizationId: string, userId: string, capability: RetailCapability,
) => Promise<RetailAccess>;

export function retailAssignmentEndpoints({
  pool, requireAccess, transaction,
}: { pool: Pool; requireAccess: RequireRetailAccess; transaction: RetailTransaction }) {
  const organizationQuery = z.object({ organizationId: z.string().min(1) }).strict();
  return {
    listRetailAssignments: createAuthEndpoint("/retail/assignments", {
      method: "GET", use: [sessionMiddleware], query: organizationQuery,
    }, async (ctx) => {
      const organizationId = ctx.query.organizationId;
      await requireAccess(pool, organizationId, ctx.context.session.user.id, "retail:manage");
      const result = await pool.query(
        `SELECT m.id AS "memberId", u.id AS "userId", u.name, u.email,
          m.role AS "membershipRole", u.role AS "systemRole",
          a.id AS "assignmentId", COALESCE(a.enabled, false) AS enabled,
          COALESCE(array_agg(c.capability ORDER BY c.capability)
            FILTER (WHERE c.capability IS NOT NULL), ARRAY[]::text[]) AS capabilities
         FROM member m
         JOIN "user" u ON u.id = m."userId"
         LEFT JOIN "organizationMemberStatus" oms ON oms."memberId" = m.id
         LEFT JOIN "retailAssignment" a ON a."memberId" = m.id
         LEFT JOIN "retailAssignmentCapability" c ON c."assignmentId" = a.id
         WHERE m."organizationId" = $1 AND NOT COALESCE(u.banned, false)
           AND COALESCE(oms.active, true)
           AND (oms."accessExpiresAt" IS NULL OR oms."accessExpiresAt" > CURRENT_TIMESTAMP)
         GROUP BY m.id, m.role, u.id, u.name, u.email, u.role, a.id, a.enabled
         ORDER BY LOWER(u.name), u.id`,
        [organizationId],
      );
      return ctx.json({ organizationId, assignments: result.rows.map(({ systemRole, capabilities, ...row }) => {
        const protectedAdministrator = systemRole === "admin" || row.membershipRole === "owner" || row.membershipRole === "admin";
        return { ...row, enabled: protectedAdministrator || row.enabled,
          capabilities: protectedAdministrator ? [...RETAIL_CAPABILITIES] : retailCapabilities(capabilities),
          protectedAdministrator };
      }) });
    }),
    updateRetailAssignment: createAuthEndpoint("/retail/assignment", {
      method: "PATCH", use: [sessionMiddleware],
      body: organizationQuery.extend({
        userId: z.string().min(1),
        enabled: z.boolean(),
        capabilities: z.array(z.enum(RETAIL_CAPABILITIES)).max(RETAIL_CAPABILITIES.length),
      }),
    }, async (ctx) => {
      const body = ctx.body;
      const actorUserId = ctx.context.session.user.id;
      await requireAccess(pool, body.organizationId, actorUserId, "retail:manage");
      if (body.userId === actorUserId) throw new APIError("FORBIDDEN", { message: "Cannot change your own Retail assignment" });
      const capabilities = retailCapabilities(body.capabilities);
      const assignment = await transaction(body.organizationId, async (db) => {
        const authority = await requireAccess(db, body.organizationId, actorUserId, "retail:manage");
        const target = await db.query<{ memberId: string; memberRole: string; systemRole: string }>(
          `SELECT m.id AS "memberId", m.role AS "memberRole", u.role AS "systemRole"
           FROM member m JOIN "user" u ON u.id = m."userId"
           LEFT JOIN "organizationMemberStatus" oms ON oms."memberId" = m.id
           WHERE m."organizationId" = $1 AND m."userId" = $2
             AND NOT COALESCE(u.banned, false) AND COALESCE(oms.active, true)
             AND (oms."accessExpiresAt" IS NULL OR oms."accessExpiresAt" > CURRENT_TIMESTAMP)
           FOR UPDATE OF m, u`,
          [body.organizationId, body.userId],
        );
        const member = target.rows[0];
        if (!member) throw new APIError("NOT_FOUND", { message: "Active organization member not found" });
        if (member.systemRole === "admin" || member.memberRole === "owner" || member.memberRole === "admin") {
          throw new APIError("FORBIDDEN", { message: "Protected administrators receive implicit Retail access" });
        }
        const current = await db.query<{ id: string; capability: string | null; locationScoped: boolean }>(
          `SELECT a.id, c.capability,
             (COALESCE(c."allLocations", false) OR EXISTS (
               SELECT 1 FROM "retailLocationGrant" g WHERE g."assignmentCapabilityId" = c.id
             )) AS "locationScoped"
           FROM "retailAssignment" a
           LEFT JOIN "retailAssignmentCapability" c ON c."assignmentId" = a.id
           WHERE a."memberId" = $1 FOR UPDATE OF a`,
          [member.memberId],
        );
        const previous = current.rows.flatMap(row => row.capability ? [row.capability] : []);
        if (!authority.canManageAdministrators && (
          current.rows.some(row => row.locationScoped) ||
          capabilities.includes("retail:manage") || previous.includes("retail:manage") ||
          [...capabilities, ...previous].some(capability => !authority.capabilities.includes(capability as RetailCapability))
        )) {
          throw new APIError("FORBIDDEN", { message: "Only organization/system admins can manage Retail managers or location-scoped assignments; delegated grants cannot exceed caller capabilities" });
        }
        const saved = await db.query<{ id: string }>(
          `INSERT INTO "retailAssignment" (id, "memberId", enabled, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           ON CONFLICT ("memberId") DO UPDATE SET enabled = EXCLUDED.enabled, "updatedAt" = CURRENT_TIMESTAMP
           RETURNING id`,
          [randomUUID(), member.memberId, body.enabled],
        );
        const id = saved.rows[0]?.id;
        if (!id) throw new Error("Retail assignment was not saved");
        // Preserve retained capability IDs and their location scopes.
        await db.query(
          'DELETE FROM "retailAssignmentCapability" WHERE "assignmentId" = $1 AND NOT (capability = ANY($2::text[]))',
          [id, capabilities],
        );
        for (const capability of capabilities) {
          await db.query(
            `INSERT INTO "retailAssignmentCapability" (id, "assignmentId", capability, "allLocations", "createdAt")
             VALUES ($1, $2, $3, false, CURRENT_TIMESTAMP)
             ON CONFLICT ("assignmentId", capability) DO NOTHING`,
            [randomUUID(), id, capability],
          );
        }
        const snapshot = { id, memberId: member.memberId, userId: body.userId, enabled: body.enabled, capabilities };
        await appendRevisionInTransaction(db, {
          resourceType: "retailAssignment", resourceId: id, organizationId: body.organizationId,
          actorUserId, operation: current.rows.length ? "update" : "create", snapshot,
        });
        return snapshot;
      });
      return ctx.json({ organizationId: body.organizationId, assignment });
    }),
  };
}
