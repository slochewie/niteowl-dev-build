import assert from "node:assert/strict";
import test from "node:test";
import type { Pool, PoolClient } from "pg";
import { inventoryRetailCatalog } from "../inventory/retail-catalog.ts";
import { retail } from "./index.ts";

test("neutral enrollment preserves an existing organization's menu settings", async () => {
  const original = { id: "ov", enabled: true, exportToToast: true, priceOverrideCents: 750, toastDestinationOverride: "Beer" };
  const before = structuredClone(original);
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    async query(sql: string, args: unknown[]) {
      calls.push({ sql, args });
      if (sql.includes('JOIN "inventoryItem"')) return { rows: [{ id: "variant" }], rowCount: 1 };
      if (sql.includes('SELECT id FROM "inventoryOrganizationVariant"')) return { rows: [original], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    },
  } as unknown as PoolClient;
  assert.equal(await inventoryRetailCatalog.ensureOrganizationVariant(db, "org", "variant"), "ov");
  assert.deepEqual(original, before);
  const insert = calls.find(c => c.sql.includes("INSERT"))!;
  assert.match(insert.sql, /false, false/);
  assert.match(insert.sql, /ON CONFLICT[\s\S]*DO NOTHING/);
  assert.equal(calls.some(c => /UPDATE "/.test(c.sql)), false);
  assert.deepEqual(calls.at(-1)!.args, ["org", "variant"]);
});

test("missing or inactive catalog variant prevents neutral parent creation", async () => {
  const calls: string[] = [];
  const db = { query: async (sql: string) => { calls.push(sql); return { rows: [], rowCount: 0 }; } } as unknown as PoolClient;
  await assert.rejects(
    () => inventoryRetailCatalog.ensureOrganizationVariant(db, "org", "inactive"),
    (error: unknown) => (error as { statusCode: number }).statusCode === 404,
  );
  assert.equal(calls.length, 1);
  assert.match(calls[0], /v.active = true AND i.active = true/);
});

type Settings = {
  enabled?: boolean;
  authorized?: boolean;
  ready?: boolean;
  organizationEnabled?: boolean;
  failInsert?: boolean;
  enrollmentExists?: boolean;
  enrollmentEnabled?: boolean;
};
function harness(settings: Settings = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  let released = false;
  let catalogCalls = 0;
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      if (sql.includes('u.role AS "systemRole"')) return { rows: settings.authorized === false ? [] : [{ systemRole: "admin", memberRole: null, memberId: null }], rowCount: settings.authorized === false ? 0 : 1 };
      if (sql.includes("to_regclass")) return { rows: [{ ready: settings.ready !== false }], rowCount: 1 };
      if (sql.includes('SELECT enabled FROM "retailOrganizationConfig"')) return { rows: [{ enabled: settings.organizationEnabled !== false }], rowCount: 1 };
      if (sql.includes('INSERT INTO "retailOrganizationVariant"') && settings.failInsert) throw new Error("simulated insert failure");
      if (sql.includes('SELECT r.id') || sql.startsWith('UPDATE "retailOrganizationVariant"')) {
        return { rows: settings.enrollmentExists === false ? [] : [{ retailOrganizationVariantId: "retail", enabled: settings.enrollmentEnabled ?? true }], rowCount: settings.enrollmentExists === false ? 0 : 1 };
      }
      return { rows: [], rowCount: 0 };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const catalog = {
    async createRetailVariant() { return { inventoryItemVariantId: "variant", attributes: { size: "m" }, created: true }; },
    async ensureOrganizationVariant(client: PoolClient, org: string, variant: string) {
      assert.equal(client, db);
      assert.equal(org, "org");
      assert.equal(variant, "variant");
      catalogCalls++;
      return "ov";
    },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog, enabled: settings.enabled });
  const context = { session: { user: { id: "user" }, session: {} } };
  return { plugin, endpoints: plugin.endpoints!, context, calls, released: () => released, catalogCalls: () => catalogCalls };
}

test("default registration denies access without querying undeployed Retail tables", async () => {
  const h = harness();
  assert.deepEqual(await h.endpoints.getRetailAccess({ query: { organizationId: "org" }, context: h.context }), { allowed: false, capabilities: [] });
  assert.equal(h.calls.length, 0);
  await assert.rejects(() => h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.length, 0);
});

for (const settings of [{ authorized: false }, { ready: false }, { organizationEnabled: false }]) {
  test("enrollment fails closed: " + JSON.stringify(settings), async () => {
    const h = harness({ enabled: true, ...settings });
    await assert.rejects(() => h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
    assert.equal(h.catalogCalls(), 0);
    assert.equal(h.calls.some(c => c.sql === "BEGIN" || c.sql.includes("INSERT")), false);
  });
}

test("enrollment and neutral parent creation use one transaction", async () => {
  const h = harness({ enabled: true });
  const result = await h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context });
  assert.deepEqual(result, { organizationId: "org", inventoryItemVariantId: "variant", retailOrganizationVariantId: "retail", enabled: true });
  assert.equal(h.catalogCalls(), 1);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
  assert.equal(h.released(), true);
  assert.equal(h.calls.filter(c => c.sql.includes('u.role AS "systemRole"')).length, 2);
  assert.match(h.calls.find(c => c.sql.includes("INSERT"))!.sql, /DO NOTHING/);
});

test("Retail variation creation enrolls under the same transaction", async () => {
  const h = harness({ enabled: true });
  const result = await h.endpoints.createRetailVariant({ body: { organizationId: "org", inventoryItemId: "item", attributes: { size: "m" } }, context: h.context }) as { inventoryItemVariantId: string; retailOrganizationVariantId: string; created: boolean };
  assert.equal(result.inventoryItemVariantId, "variant");
  assert.equal(result.retailOrganizationVariantId, "retail");
  assert.equal(result.created, true);
  assert.equal(h.catalogCalls(), 1);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});

test("Retail variation creation rolls back when enrollment fails", async () => {
  const h = harness({ enabled: true, failInsert: true });
  await assert.rejects(() => h.endpoints.createRetailVariant({ body: { organizationId: "org", inventoryItemId: "item", attributes: { size: "m" } }, context: h.context }), /simulated insert failure/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
});

test("Retail creation remains unavailable with the registration gate closed", async () => {
  const h = harness();
  await assert.rejects(() => h.endpoints.createRetailVariant({ body: { organizationId: "org", inventoryItemId: "item", attributes: { size: "m" } }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.length, 0);
});

test("Retail creation rejects attempts to set menu flags", async () => {
  const h = harness({ enabled: true });
  await assert.rejects(() => h.endpoints.createRetailVariant({ body: { organizationId: "org", inventoryItemId: "item", attributes: { size: "m" }, menuEligible: true }, context: h.context }));
  assert.equal(h.calls.length, 0);
});

test("retrying a disabled enrollment does not reactivate it", async () => {
  const h = harness({ enabled: true, enrollmentEnabled: false });
  const result = await h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context }) as { enabled: boolean };
  assert.equal(result.enabled, false);
  assert.equal(h.calls.some(c => c.sql.startsWith("UPDATE")), false);
});

test("enrollment failure rolls back and releases the transaction", async () => {
  const h = harness({ enabled: true, failInsert: true });
  await assert.rejects(() => h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant" }, context: h.context }), /simulated insert failure/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
  assert.equal(h.released(), true);
});

test("disable scopes its update to the requested organization and retains the record", async () => {
  const h = harness({ enabled: true, enrollmentEnabled: false });
  await h.endpoints.disableRetailVariant({ body: { organizationId: "org", retailOrganizationVariantId: "retail" }, context: h.context });
  const update = h.calls.find(c => c.sql.startsWith("UPDATE"))!;
  assert.deepEqual(update.args, ["retail", "org"]);
  assert.match(update.sql, /ov."organizationId" = \$2/);
  assert.equal(h.calls.some(c => /DELETE|UPDATE "inventory/.test(c.sql)), false);
});

test("cross-organization or missing enrollment returns 404 and rolls back", async () => {
  const h = harness({ enabled: true, enrollmentExists: false });
  await assert.rejects(() => h.endpoints.disableRetailVariant({ body: { organizationId: "org", retailOrganizationVariantId: "foreign" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
});

test("Retail catalog always joins explicit organization enrollment", async () => {
  const h = harness({ enabled: true });
  await h.endpoints.listRetailCatalog({ query: { organizationId: "org" }, context: h.context });
  const query = h.calls.at(-1)!;
  assert.match(query.sql, /FROM "retailOrganizationVariant" r/);
  assert.match(query.sql, /WHERE ov."organizationId" = \$1/);
  assert.deepEqual(query.args, ["org"]);
});

test("Retail enrollment rejects menu pricing/export fields", async () => {
  const h = harness({ enabled: true });
  await assert.rejects(() => h.endpoints.enrollRetailVariant({ body: { organizationId: "org", inventoryItemVariantId: "variant", exportToToast: true }, context: h.context }));
  assert.equal(h.calls.length, 0);
});

test("schema uses one restrictive organization-variant owner and disabled organization defaults", () => {
  const h = harness();
  const schema = h.plugin.schema!;
  assert.equal(schema.retailOrganizationConfig.fields.enabled.defaultValue, false);
  const owner = schema.retailOrganizationVariant.fields.inventoryOrganizationVariantId;
  assert.equal(owner.unique, true);
  assert.deepEqual(owner.references, { model: "inventoryOrganizationVariant", field: "id", onDelete: "restrict" });
  assert.equal("organizationId" in schema.retailOrganizationVariant.fields, false);
});


test("Retail table declaration order creates every local FK parent before its children", () => {
  const pool = {} as Pool;
  const catalog = {
    async createRetailVariant(): Promise<never> { throw new Error("unused"); },
    async ensureOrganizationVariant(): Promise<never> { throw new Error("unused"); },
  };
  const schema = retail({ pool, catalog }).schema!;
  const seen = new Set<string>();
  for (const [name, table] of Object.entries(schema)) {
    for (const field of Object.values(table.fields)) {
      const parent = field.references?.model;
      if (parent && parent in schema) assert.ok(seen.has(parent), name + " declared before FK parent " + parent);
    }
    seen.add(name);
  }
});
