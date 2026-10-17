import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { inventoryAccess } from "./index.ts";
import { assertMenuEligible } from "./menu-boundary.ts";

function harness({ role = "admin", retailTarget = false, catalogRows = [] as object[] } = {}) {
  const calls: { sql: string; values: unknown[] }[] = [];
  const db = {
    query: async (sql: string, values: unknown[] = []) => {
      calls.push({ sql, values });
      const q = sql.replace(/\s+/g, " ");
      let rows: object[] = [];
      if (q.includes('SELECT v.id') && q.includes("to_jsonb")) rows = retailTarget ? [{ id: "retail" }] : [];
      else if (q.includes('FROM organization')) rows = [{ id: "org" }];
      else if (q.includes('FROM "user"')) rows = [{ role: role === "admin" ? "admin" : "user" }];
      else if (q.includes('FROM member m')) rows = [{ memberId: "member", role: "member" }];
      else if (q.includes('FROM "inventoryAssignment"')) rows = [{ enabled: true, role }];
      else if (q.includes('FROM "inventoryItem" i')) rows = catalogRows;
      else if (q.includes('FROM "inventoryItemVariant"')) rows = [{ id: "menu" }];
      else if (q.includes('FROM "inventoryItem"') && q.includes('ANY')) rows = [{ id: "source", name: "Source" }, { id: "target", name: "Target" }];
      else if (q.includes('FROM "inventoryItem"')) rows = [{ id: "item" }];
      return { rows, rowCount: rows.length };
    },
    release() {},
    async connect() { return db; },
  };
  const pool = db as unknown as Pool;
  const endpoints = inventoryAccess({ pool }).endpoints!;
  const context = { session: { user: { id: "user" }, session: {} } };
  return { calls, pool, endpoints, context };
}

test("legacy catalog defaults to menu scope and distinguishes missing assignments", async () => {
  const h = harness({ catalogRows: [{ itemId: "item", variantId: "variant", menuEligible: true, organizationVariantId: null, categoryId: null, priceOverrideCents: null, variantDefaultPriceCents: 500 }] });
  const result = await h.endpoints.listInventoryCatalog({ query: { organizationId: "org" }, context: h.context }) as { items: { menuEligible: boolean; inventoryOrganizationVariantId: string | null; organization: { assigned: boolean; enabled: boolean }; effectivePriceCents: number }[] };
  assert.equal(result.items[0].menuEligible, true);
  assert.equal(result.items[0].inventoryOrganizationVariantId, null);
  assert.equal(result.items[0].organization.assigned, false);
  assert.equal(result.items[0].organization.enabled, false);
  assert.equal(result.items[0].effectivePriceCents, 500);
  assert.deepEqual(h.calls.at(-1)!.values, ["org", false]);
});

test("shared discovery is allowed for Inventory admins", async () => {
  const h = harness();
  await h.endpoints.listInventoryCatalog({ query: { organizationId: "org", scope: "shared" }, context: h.context });
  assert.deepEqual(h.calls.at(-1)!.values, ["org", true]);
});

test("a viewer cannot request shared discovery", async () => {
  const h = harness({ role: "viewer" });
  const result = await h.endpoints.listInventoryCatalog({ query: { organizationId: "org", scope: "shared" }, context: h.context });
  assert.deepEqual(result, { error: "Forbidden" });
  assert.equal(h.calls.some(c => c.sql.includes('FROM "inventoryItem" i')), false);
});

test("disabled assignments remain distinct from missing assignments and zero prices survive", async () => {
  const h = harness({ catalogRows: [{ itemId: "item", variantId: "variant", menuEligible: true, organizationVariantId: "assigned", organizationEnabled: false, categoryId: null, priceOverrideCents: 0, variantDefaultPriceCents: 500 }] });
  const result = await h.endpoints.listInventoryCatalog({ query: { organizationId: "org" }, context: h.context }) as { items: { organization: { assigned: boolean; enabled: boolean }; effectivePriceCents: number }[] };
  assert.equal(result.items[0].organization.assigned, true);
  assert.equal(result.items[0].organization.enabled, false);
  assert.equal(result.items[0].effectivePriceCents, 0);
});

test("menu variant updates retain the existing write path", async () => {
  const h = harness();
  const result = await h.endpoints.updateInventoryOrganizationVariant({ body: { organizationId: "org", variantId: "menu", enabled: true }, context: h.context });
  assert.deepEqual(result, { updated: true });
  assert.equal(h.calls.filter(c => c.sql.includes('INSERT INTO "inventoryOrganizationVariant"')).length, 1);
});

test("viewer mutation is denied before eligibility checks or writes", async () => {
  const h = harness({ role: "viewer" });
  const result = await h.endpoints.updateInventoryOrganizationVariant({ body: { organizationId: "org", variantId: "menu", enabled: true }, context: h.context });
  assert.deepEqual(result, { error: "Forbidden" });
  assert.equal(h.calls.some(c => c.sql.includes("to_jsonb") || /INSERT|UPDATE|DELETE/.test(c.sql)), false);
});

const mutations = [
  ["updateInventoryOrganizationVariant", { variantId: "retail", enabled: true }],
  ["updateInventoryOrganizationVariants", { variantIds: ["menu", "retail"], enabled: true }],
  ["updateInventorySourceMapping", { variantId: "retail", sourceType: "toast-template", sourceKey: "source" }],
  ["updateInventoryItemCategory", { itemId: "item", categoryId: "category" }],
  ["addInventoryOrganizationVariant", { itemId: "item", toastCategory: "Retail", toastDestination: "Retail" }],
  ["mergeInventoryItems", { sourceItemId: "source", targetItemId: "target" }],
  ["persistInventoryImport", { sourceType: "toast-template", sourceName: "test", items: [{ id: "source", name: "Tee", toastCategory: "Retail", toastDestination: "Retail", basePriceCents: 1000, happyHourPriceCents: null, status: "ready", exportIncluded: true, targetVariantId: "retail" }] }],
] as const;
for (const [endpoint, body] of mutations) {
  test(endpoint + " rejects Retail-only targets without committing writes", async () => {
    const h = harness({ retailTarget: true });
    await assert.rejects(() => h.endpoints[endpoint]({ body: { organizationId: "org", ...body }, context: h.context }), (error: unknown) => {
      assert.equal((error as { statusCode: number }).statusCode, 409);
      return true;
    });
    assert.equal(h.calls.some(c => /^\s*(INSERT|UPDATE|DELETE|COMMIT)\b/.test(c.sql)), false);
    if (h.calls.some(c => c.sql === "BEGIN")) assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  });
}

test("empty targets do not query; menu targets pass without mutations", async () => {
  const h = harness();
  await assertMenuEligible(h.pool, {});
  assert.equal(h.calls.length, 0);
  await assertMenuEligible(h.pool, { variantIds: ["menu", "menu"] });
  assert.deepEqual(h.calls[0].values, [["menu"], [], false]);
});
