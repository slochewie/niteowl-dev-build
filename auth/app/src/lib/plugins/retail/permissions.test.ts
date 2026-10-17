import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { retail } from "./index.ts";
import { RETAIL_CAPABILITIES, retailCapabilities } from "./permissions.ts";

type Settings = {
  systemRole?: string; memberRole?: string; grants?: string[];
  principalExists?: boolean; ready?: boolean; organizationEnabled?: boolean;
  targetExists?: boolean; targetRole?: string; targetSystemRole?: string;
  previous?: string[]; auditFails?: boolean; revokedDuringTransaction?: boolean; locationScoped?: boolean;
};
function harness(settings: Settings = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  let principalReads = 0;
  let released = false;
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ");
      if (q.includes('SELECT u.role AS "systemRole"')) {
        principalReads++;
        const allowed = settings.principalExists !== false && !(settings.revokedDuringTransaction && principalReads > 1);
        return { rows: allowed ? [{ systemRole: settings.systemRole ?? "user", memberRole: settings.memberRole ?? "member", memberId: "actor-member" }] : [], rowCount: allowed ? 1 : 0 };
      }
      if (q.includes("to_regclass")) return { rows: [{ ready: settings.ready !== false }], rowCount: 1 };
      if (q.includes('SELECT enabled FROM "retailOrganizationConfig"')) return { rows: [{ enabled: settings.organizationEnabled !== false }], rowCount: 1 };
      if (q.includes('SELECT c.capability FROM "retailAssignment"')) return { rows: (settings.grants ?? []).map(capability => ({ capability })), rowCount: settings.grants?.length ?? 0 };
      if (q.includes('SELECT m.id AS "memberId"') && q.includes("FOR UPDATE OF m, u")) {
        const rows = settings.targetExists === false ? [] : [{ memberId: "target-member", memberRole: settings.targetRole ?? "member", systemRole: settings.targetSystemRole ?? "user" }];
        return { rows, rowCount: rows.length };
      }
      if (q.includes('SELECT a.id, c.capability')) {
        const rows = settings.previous?.length ? settings.previous.map(capability => ({ id: "assignment", capability, locationScoped: settings.locationScoped === true })) : [];
        return { rows, rowCount: rows.length };
      }
      if (q.includes('SELECT r.id AS "retailOrganizationVariantId"')) return { rows: [{ retailOrganizationVariantId: "retail", enabled: true }], rowCount: 1 };
      if (q.includes('INSERT INTO "retailAssignment"')) return { rows: [{ id: "assignment" }], rowCount: 1 };
      if (q.includes('INSERT INTO "revisionHistory"')) {
        if (settings.auditFails) throw new Error("audit failed");
        return { rows: [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const catalog = {
    async createRetailVariant() { return { inventoryItemVariantId: "variant", attributes: { size: "m" }, created: true }; },
    async ensureOrganizationVariant() { return "ov"; },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog, enabled: true });
  const context = { session: { user: { id: "actor" }, session: {} } };
  const endpoints = plugin.endpoints!;
  const access = () => endpoints.getRetailAccess({ query: { organizationId: "org" }, context });
  const update = (capabilities: string[] = ["retail:read"], userId = "target", enabled = true) => endpoints.updateRetailAssignment({
    body: { organizationId: "org", userId, enabled, capabilities }, context,
  });
  return { calls, plugin, endpoints, context, access, update, released: () => released };
}

test("capability normalization ignores unknown grants and adds no implied capabilities", () => {
  assert.deepEqual(retailCapabilities(["unknown", "retail:manage", "retail:manage"]), ["retail:manage"]);
  assert.deepEqual(retailCapabilities(["retail:read"]), ["retail:read"]);
});

test("ordinary membership without an explicit enabled grant has no Retail access", async () => {
  const h = harness();
  assert.deepEqual(await h.access(), { allowed: false, capabilities: [] });
});

test("viewer can read catalog but cannot enroll or disable products", async () => {
  const h = harness({ grants: ["retail:read", "unknown"] });
  assert.deepEqual(await h.access(), { allowed: true, capabilities: ["retail:read"] });
  await h.endpoints.listRetailCatalog({ query: { organizationId: "org" }, context: h.context });
  for (const [name, body] of [
    ["enrollRetailVariant", { inventoryItemVariantId: "variant" }],
    ["disableRetailVariant", { retailOrganizationVariantId: "retail" }],
    ["createRetailVariant", { inventoryItemId: "item", attributes: { size: "m" } }],
  ] as const) {
    await assert.rejects(() => h.endpoints[name]({ body: { organizationId: "org", ...body }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  }
  assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
});

test("an explicitly assigned item editor can enroll without administrator status", async () => {
  const h = harness({ grants: ["retail:item:write"] });
  const result = await h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context }) as { retailOrganizationVariantId: string };
  assert.equal(result.retailOrganizationVariantId, "retail");
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});

test("item-write and manage capabilities do not implicitly grant catalog reads", async () => {
  for (const capability of ["retail:item:write", "retail:manage"]) {
    const h = harness({ grants: [capability] });
    await assert.rejects(() => h.endpoints.listRetailCatalog({ query: { organizationId: "org" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  }
});

for (const settings of [{ systemRole: "admin" }, { memberRole: "owner" }, { memberRole: "admin" }]) {
  test("protected administrator receives all capabilities: " + JSON.stringify(settings), async () => {
    const h = harness(settings);
    assert.deepEqual(await h.access(), { allowed: true, capabilities: [...RETAIL_CAPABILITIES] });
    assert.equal(h.calls.some(c => c.sql.includes('SELECT c.capability')), false);
  });
}

for (const settings of [{ principalExists: false }, { ready: false }, { organizationEnabled: false }]) {
  test("feature/membership gating rejects grants: " + JSON.stringify(settings), async () => {
    const h = harness({ grants: [...RETAIL_CAPABILITIES], ...settings });
    assert.deepEqual(await h.access(), { allowed: false, capabilities: [] });
  });
}

test("global admin-viewer gains no automatic Retail privileges", async () => {
  const h = harness({ systemRole: "admin-viewer" });
  assert.deepEqual(await h.access(), { allowed: false, capabilities: [] });
});

test("organization admin can replace a member assignment and audit the change", async () => {
  const h = harness({ memberRole: "owner" });
  const result = await h.update(["retail:read", "retail:manage"]) as { assignment: { capabilities: string[] } };
  assert.deepEqual(result.assignment.capabilities, ["retail:read", "retail:manage"]);
  const saved = h.calls.find(c => c.sql.includes('INSERT INTO "retailAssignment"'))!;
  assert.deepEqual(saved.args.slice(1), ["target-member", true]);
  assert.equal(h.calls.filter(c => c.sql.includes('INSERT INTO "retailAssignmentCapability"')).length, 2);
  const audit = h.calls.find(c => c.sql.includes('INSERT INTO "revisionHistory"'))!;
  assert.equal(audit.args[2], "org");
  assert.equal(audit.args[4], "actor");
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
  assert.equal(h.released(), true);
});

test("disabling a member and clearing capabilities is an audited atomic replacement", async () => {
  const h = harness({ memberRole: "owner", previous: ["retail:read"] });
  await h.update([], "target", false);
  const saved = h.calls.find(c => c.sql.includes('INSERT INTO "retailAssignment"'))!;
  assert.equal(saved.args[2], false);
  assert.equal(h.calls.filter(c => c.sql.includes('DELETE FROM "retailAssignmentCapability"')).length, 1);
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "retailAssignmentCapability"')), false);
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "revisionHistory"')), true);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});

test("delegated manager may grant capabilities within its authority", async () => {
  const h = harness({ grants: ["retail:read", "retail:item:write", "retail:manage"], previous: ["retail:read"] });
  await h.update(["retail:read", "retail:item:write"]);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});

for (const [settings, requested] of [
  [{ grants: ["retail:manage", "retail:read"] }, ["retail:manage"]],
  [{ grants: ["retail:manage", "retail:read"] }, ["retail:purchase"]],
  [{ grants: ["retail:manage", "retail:read"], previous: ["retail:manage"] }, ["retail:read"]],
  [{ grants: ["retail:manage", "retail:read"], previous: ["retail:purchase"] }, ["retail:read"]],
] as [Settings, string[]][]) {
  test("delegated privilege escalation or out-of-scope edit is denied: " + JSON.stringify([settings, requested]), async () => {
    const h = harness(settings);
    await assert.rejects(() => h.update(requested), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
    assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "retailAssignment"')), false);
    assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  });
}

test("self-management is denied before a transaction begins", async () => {
  const h = harness({ grants: ["retail:manage", "retail:read"] });
  await assert.rejects(() => h.update(["retail:read"], "actor"), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
});

for (const settings of [{ targetRole: "owner" }, { targetRole: "admin" }, { targetSystemRole: "admin" }]) {
  test("protected target cannot receive a mutable assignment: " + JSON.stringify(settings), async () => {
    const h = harness({ memberRole: "owner", ...settings });
    await assert.rejects(() => h.update(), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
    assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "retailAssignment"')), false);
  });
}

test("foreign, expired or missing target membership returns 404", async () => {
  const h = harness({ memberRole: "owner", targetExists: false });
  await assert.rejects(() => h.update(), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  const target = h.calls.find(c => c.sql.includes("FOR UPDATE OF m, u"))!;
  assert.deepEqual(target.args, ["org", "target"]);
});

test("assignment write serialization precedes the transaction's authorization recheck", async () => {
  const h = harness({ memberRole: "owner" });
  await h.update();
  const lock = h.calls.findIndex(c => c.sql.includes("retail:authorization") || c.args.includes("retail:authorization:org"));
  const authReads = h.calls.map((c, i) => c.sql.includes('SELECT u.role AS "systemRole"') ? i : -1).filter(i => i >= 0);
  assert.ok(lock > h.calls.findIndex(c => c.sql === "BEGIN"));
  assert.ok(lock < authReads[1]);
});

test("revocation before the transaction lock is acquired prevents the write", async () => {
  const h = harness({ memberRole: "owner", revokedDuringTransaction: true });
  await assert.rejects(() => h.update(), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "retailAssignment"')), false);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
});

test("audit failure rolls back assignment and capability replacement", async () => {
  const h = harness({ memberRole: "owner", auditFails: true });
  await assert.rejects(() => h.update(), /audit failed/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
});

test("assignment listing requires management capability and scopes memberships", async () => {
  const denied = harness({ grants: ["retail:read"] });
  await assert.rejects(() => denied.endpoints.listRetailAssignments({ query: { organizationId: "org" }, context: denied.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  const h = harness({ grants: ["retail:manage"] });
  await h.endpoints.listRetailAssignments({ query: { organizationId: "org" }, context: h.context });
  assert.deepEqual(h.calls.at(-1)!.args, ["org"]);
  assert.match(h.calls.at(-1)!.sql, /m."organizationId" = \$1/);
});

test("unknown capabilities in assignment requests are rejected before database access", async () => {
  const h = harness({ memberRole: "owner" });
  await assert.rejects(() => h.update(["retail:invented"]));
  assert.equal(h.calls.length, 0);
});

test("assignment ownership follows membership and cascades on membership deletion", () => {
  const h = harness();
  const schema = h.plugin.schema!;
  assert.deepEqual(schema.retailAssignment.fields.memberId.references, { model: "member", field: "id", onDelete: "cascade" });
  assert.equal(schema.retailAssignment.fields.memberId.unique, true);
  assert.equal(schema.retailAssignment.fields.enabled.defaultValue, false);
  assert.equal("organizationId" in schema.retailAssignment.fields, false);
  assert.deepEqual(schema.retailAssignmentCapability.fields.assignmentId.references, { model: "retailAssignment", field: "id", onDelete: "cascade" });
});


test("delegated manager cannot reactivate or edit an assignment carrying location scopes", async () => {
  const h = harness({ grants: ["retail:manage", "retail:read"], previous: ["retail:read"], locationScoped: true });
  await assert.rejects(() => h.update(["retail:read"]), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "retailAssignment"')), false);
});

test("assignment replacement retains capability IDs and scope instead of recreating retained rows", async () => {
  const h = harness({ memberRole: "owner", previous: ["retail:read"], locationScoped: true });
  await h.update(["retail:read"]);
  const removal = h.calls.find(c => c.sql.includes('DELETE FROM "retailAssignmentCapability"'))!;
  assert.match(removal.sql, /NOT \(capability = ANY/);
  assert.deepEqual(removal.args, ["assignment", ["retail:read"]]);
  const insertion = h.calls.find(c => c.sql.includes('INSERT INTO "retailAssignmentCapability"'))!;
  assert.match(insertion.sql, /ON CONFLICT \("assignmentId", capability\) DO NOTHING/);
  assert.match(insertion.sql, /capability, "allLocations", "createdAt"/);
  assert.match(insertion.sql, /VALUES \(\$1, \$2, \$3, false, CURRENT_TIMESTAMP\)/);
  assert.equal(h.calls.some(c => c.sql.includes('UPDATE "retailAssignmentCapability"')), false);
});
