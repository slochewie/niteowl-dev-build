import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { retail } from "./index.ts";
import { requireRetailLocationAccess, normalizeLocationCode, normalizeLocationName } from "./locations.ts";
import { RETAIL_CAPABILITIES } from "./permissions.ts";

type Options = {
  admin?: boolean; caps?: string[]; scopes?: string[]; active?: boolean; missing?: boolean;
  targetMissing?: boolean; targetRole?: string; assignmentMissing?: boolean;
  foreignLocation?: boolean; auditFails?: boolean; duplicateCode?: boolean;
  revoked?: boolean; enabled?: boolean;
};
function harness(options: Options = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  let reads = 0, released = false;
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ");
      let rows: unknown[] = [];
      if (q.includes('SELECT u.role AS "systemRole"')) {
        reads++;
        rows = options.revoked && reads > 1 ? [] : [{ systemRole: "user", memberRole: options.admin === false ? "member" : "owner", memberId: "actor-member" }];
      } else if (q.includes("to_regclass")) rows = [{ ready: true }];
      else if (q.includes('SELECT enabled FROM "retailOrganizationConfig"')) rows = [{ enabled: true }];
      else if (q.includes('SELECT c.capability FROM "retailAssignment"')) rows = (options.caps ?? ["retail:read"]).map(capability => ({ capability }));
      else if (q.startsWith('SELECT active FROM "retailLocation"')) rows = options.missing ? [] : [{ active: options.active !== false }];
      else if (q.startsWith('SELECT c.capability FROM "retailAssignmentCapability"')) rows = (options.scopes ?? []).map(capability => ({ capability }));
      else if (q.startsWith('SELECT m.id AS "memberId"')) rows = options.targetMissing ? [] : [{ memberId: "target-member", memberRole: options.targetRole ?? "member", systemRole: "user" }];
      else if (q.startsWith('SELECT c.id, c."allLocations"')) rows = options.assignmentMissing ? [] : [{ id: "cap-id", allLocations: false }];
      else if (q.startsWith('SELECT id FROM "retailLocation"')) rows = options.foreignLocation ? [] : (args[1] as string[]).map(id => ({ id }));
      else if (q.startsWith('SELECT "locationId" FROM')) rows = [{ locationId: "old-location" }];
      else if (q.startsWith('INSERT INTO "retailLocation"')) {
        if (options.duplicateCode) throw Object.assign(new Error("duplicate"), { code: "23505" });
        rows = [{ id: "location", code: args[2], name: args[3], active: true }];
      } else if (q.startsWith('UPDATE "retailLocation"')) rows = options.missing ? [] : [{ id: "location", code: "STORE", name: args[2], active: args[3] }];
      else if (q.includes('INSERT INTO "revisionHistory"')) {
        if (options.auditFails) throw new Error("audit failed");
        rows = [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }];
      }
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const pool = db as unknown as Pool;
  const catalog = {
    async createRetailVariant() { throw new Error("Unexpected catalog mutation"); },
    async ensureOrganizationVariant() { throw new Error("Unexpected catalog mutation"); },
  };
  const plugin = retail({ pool, catalog, enabled: options.enabled !== false });
  const endpoints = plugin.endpoints!;
  const context = { session: { user: { id: "actor" }, session: {} } };
  const create = (body = {}) => endpoints.createRetailLocation({ body: { organizationId: "org", code: " shop-1 ", name: " Store ", ...body }, context });
  const grant = (body = {}) => endpoints.updateRetailLocationGrant({ body: { organizationId: "org", userId: "target", capability: "retail:read", allLocations: false, locationIds: ["location"], ...body }, context });
  const access = () => endpoints.getRetailLocationAccess({ query: { organizationId: "org", locationId: "location" }, context });
  return { calls, pool, plugin, endpoints, context, create, grant, access, released: () => released };
}
const status = (code: number) => (error: unknown) => (error as { statusCode: number }).statusCode === code;

test("location codes normalize without changing stable identity", () => {
  assert.equal(normalizeLocationCode(" ｓhop-1 "), "SHOP-1");
  assert.equal(normalizeLocationName(" Store "), "Store");
  for (const value of ["", "a b", "../", "x".repeat(41)]) assert.throws(() => normalizeLocationCode(value), status(400));
  for (const value of [" ", "a\nb", "x".repeat(121)]) assert.throws(() => normalizeLocationName(value), status(400));
});
test("location creation normalizes and commits with audit after lock and permission recheck", async () => {
  const h = harness();
  const result = await h.create() as { location: { code: string; name: string } };
  assert.equal(result.location.code, "SHOP-1");
  assert.equal(result.location.name, "Store");
  const lock = h.calls.findIndex(c => c.args.includes("retail:authorization:org"));
  const recheck = h.calls.findIndex((c, i) => i > lock && c.sql.includes('SELECT u.role AS "systemRole"'));
  assert.ok(lock > 0 && recheck > lock);
  assert.ok(h.calls.findIndex(c => c.sql.includes('INSERT INTO "retailLocation"')) > recheck);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
  assert.equal(h.released(), true);
});
for (const [options, code] of [[{ admin: false, caps: ["retail:manage"] }, 403], [{ revoked: true }, 403], [{ duplicateCode: true }, 409]] as [Options, number][]) {
  test("unauthorized, revoked or duplicate location creation fails: " + JSON.stringify(options), async () => {
    const h = harness(options);
    await assert.rejects(() => h.create(), status(code));
    assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
  });
}
test("creation audit failure rolls back location and releases connection", async () => {
  const h = harness({ auditFails: true });
  await assert.rejects(() => h.create(), /audit failed/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.released(), true);
});
test("archive retains location identity and scopes", async () => {
  const h = harness();
  await h.endpoints.updateRetailLocation({ body: { organizationId: "org", locationId: "location", name: "Old store", active: false }, context: h.context });
  const update = h.calls.find(c => c.sql.startsWith('UPDATE "retailLocation"'))!;
  assert.deepEqual(update.args, ["location", "org", "Old store", false]);
  assert.equal(h.calls.some(c => c.sql.startsWith("DELETE")), false);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});
test("updating a foreign or missing location returns 404 without audit", async () => {
  const h = harness({ missing: true });
  await assert.rejects(() => h.endpoints.updateRetailLocation({ body: { organizationId: "org", locationId: "foreign", name: "Other", active: false }, context: h.context }), status(404));
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "revisionHistory"')), false);
});
for (const options of [{ admin: false }, { active: false }, { admin: false, caps: ["retail:manage"] }]) {
  test("no location scope or archive denies access: " + JSON.stringify(options), async () => {
    const h = harness(options);
    await assert.rejects(() => h.access(), status(403));
  });
}
test("organization and location capabilities intersect; cost access is independent", async () => {
  const h = harness({ admin: false, caps: ["retail:receive"], scopes: ["retail:receive", "retail:cost:read", "unknown"] });
  assert.deepEqual(await h.access(), { organizationId: "org", locationId: "location", capabilities: ["retail:receive"] });
  const scoped = h.calls.find(c => c.sql.includes('SELECT c.capability FROM "retailAssignmentCapability"'))!;
  assert.deepEqual(scoped.args, ["org", "actor", "location"]);
});
test("protected admin receives all operational location capabilities without explicit grants", async () => {
  const h = harness();
  const result = await h.access() as { capabilities: string[] };
  assert.equal(result.capabilities.includes("retail:receive"), true);
  assert.equal(result.capabilities.includes("retail:manage"), false);
  assert.equal(h.calls.some(c => c.sql.includes('SELECT c.capability FROM "retailAssignmentCapability"')), false);
});
test("foreign location fails before scope lookup", async () => {
  const h = harness({ missing: true });
  await assert.rejects(() => h.access(), status(404));
  const query = h.calls.find(c => c.sql.startsWith("SELECT active"))!;
  assert.deepEqual(query.args, ["location", "org"]);
});
test("future stock guard rejects missing location authority", async () => {
  const h = harness();
  await assert.rejects(() => requireRetailLocationAccess(h.pool, async () => ({ capabilities: ["retail:stock:adjust"], canManageAdministrators: false }), "org", "actor", "location", "retail:stock:adjust"), status(403));
});
test("grant replacement scopes existing capability and audits previous state", async () => {
  const h = harness();
  const result = await h.grant() as { scope: { assignmentCapabilityId: string; locationIds: string[] } };
  assert.equal(result.scope.assignmentCapabilityId, "cap-id");
  assert.deepEqual(result.scope.locationIds, ["location"]);
  const insertion = h.calls.find(c => c.sql.startsWith('INSERT INTO "retailLocationGrant"'))!;
  assert.deepEqual(insertion.args.slice(1), ["cap-id", "location"]);
  const audit = h.calls.find(c => c.sql.includes('INSERT INTO "revisionHistory"'))!;
  assert.match(String(audit.args[5]), /old-location/);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});
for (const [options, body, code] of [
  [{ admin: false, caps: ["retail:manage"] }, {}, 403],
  [{}, { userId: "actor" }, 403],
  [{ targetMissing: true }, {}, 404],
  [{ targetRole: "owner" }, {}, 403],
  [{ assignmentMissing: true }, {}, 404],
  [{ foreignLocation: true }, {}, 404],
  [{}, { locationIds: ["location", "location"] }, 400],
  [{}, { allLocations: true }, 400],
  [{}, { capability: "retail:item:write" }, 400],
] as [Options, Record<string, unknown>, number][]) {
  test("invalid or unauthorized scope replacement preserves old grants: " + JSON.stringify([options, body]), async () => {
    const h = harness(options);
    await assert.rejects(() => h.grant(body), status(code));
    assert.equal(h.calls.some(c => c.sql.startsWith('DELETE FROM "retailLocationGrant"')), false);
    assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
  });
}
test("explicit all-locations and empty scope revocation retain organization capability", async () => {
  for (const allLocations of [true, false]) {
    const h = harness();
    await h.grant({ allLocations, locationIds: [] });
    const update = h.calls.find(c => c.sql.startsWith('UPDATE "retailAssignmentCapability"'))!;
    assert.deepEqual(update.args, ["cap-id", allLocations]);
    assert.equal(h.calls.some(c => c.sql.startsWith('INSERT INTO "retailLocationGrant"')), false);
    assert.equal(h.calls.some(c => c.sql.startsWith('DELETE FROM "retailAssignmentCapability"')), false);
  }
});
test("scope audit failure rolls back the entire replacement", async () => {
  const h = harness({ auditFails: true });
  await assert.rejects(() => h.grant(), /audit failed/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
});
test("ordinary location listing uses read scope; administrative listing is protected", async () => {
  const h = harness({ admin: false, caps: ["retail:read", "retail:manage"] });
  await h.endpoints.listRetailLocations({ query: { organizationId: "org" }, context: h.context });
  assert.deepEqual(h.calls.at(-1)!.args, ["org", "actor", false]);
  await assert.rejects(() => h.endpoints.listRetailLocationsForManagement({ query: { organizationId: "org" }, context: h.context }), status(403));
});
test("disabled registration blocks all location writes without querying schema", async () => {
  const h = harness({ enabled: false });
  await assert.rejects(() => h.create(), status(403));
  assert.equal(h.calls.length, 0);
});
test("location schema preserves ownership and scopes cascade only through removed capabilities", () => {
  const schema = harness().plugin.schema!;
  assert.equal(schema.retailAssignmentCapability.fields.allLocations.defaultValue, false);
  assert.deepEqual(schema.retailLocation.fields.organizationId.references, { model: "organization", field: "id", onDelete: "restrict" });
  assert.deepEqual(schema.retailLocationGrant.fields.assignmentCapabilityId.references, { model: "retailAssignmentCapability", field: "id", onDelete: "cascade" });
  assert.equal("organizationId" in schema.retailLocationGrant.fields, false);
  assert.equal(RETAIL_CAPABILITIES.includes("retail:manage"), true);
});
