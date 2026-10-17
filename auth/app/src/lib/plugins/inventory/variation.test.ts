import assert from "node:assert/strict";
import test from "node:test";
import { getAuthTables } from "@better-auth/core/db";
import type { PoolClient } from "pg";
import { canonicalVariation, variationAttributes } from "./variation-identity.ts";
import { inventoryRetailCatalog } from "./retail-catalog.ts";
import { inventoryAccess } from "./index.ts";

test("combination identity ignores order, case, surrounding space and compatibility Unicode", () => {
  const a = canonicalVariation({ Size: " M ", color: "ＲＥＤ" });
  const b = canonicalVariation({ color: "red", size: "m" });
  assert.deepEqual(a, b);
  assert.equal(a.key, '{"color":"red","size":"m"}');
  assert.deepEqual(variationAttributes(a.key), { color: "red", size: "m" });
});

test("distinct attribute values produce distinct sellable identities", () => {
  assert.notEqual(canonicalVariation({ size: "s" }).key, canonicalVariation({ size: "m" }).key);
});

for (const attributes of [{}, { size: "" }, { size: "m", Size: "m" }, { "bad key": "x" }, { sizeOz: "12" }, { packageType: "can" }, { size: "x".repeat(81) }, Object.fromEntries(Array.from({ length: 9 }, (_, i) => ["attribute" + i, "x"]))]) {
  test("invalid variation attributes are rejected: " + JSON.stringify(attributes).slice(0, 70), () => {
    assert.throws(() => canonicalVariation(attributes), (e: unknown) => (e as { statusCode: number }).statusCode === 400);
  });
}

test("legacy variants expose empty attributes; corrupt/noncanonical identities fail", () => {
  assert.deepEqual(variationAttributes(null), {});
  assert.deepEqual(variationAttributes(undefined), {});
  assert.throws(() => variationAttributes('{"size":"M"}'));
  assert.throws(() => variationAttributes('["red"]'));
  assert.throws(() => variationAttributes('{"size":5}'));
});

function database(existing: { id: string; active: boolean } | null = null, master = true) {
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    async query(sql: string, args: unknown[]) {
      calls.push({ sql, args });
      if (sql.includes('FROM "inventoryItem"')) return { rows: master ? [{ id: "item" }] : [], rowCount: master ? 1 : 0 };
      if (sql.includes("SELECT id, active")) return { rows: existing ? [existing] : [], rowCount: existing ? 1 : 0 };
      return { rows: [], rowCount: 0 };
    },
  } as unknown as PoolClient;
  return { calls, db };
}

test("new Retail variation reuses its master and explicitly remains outside menus", async () => {
  const h = database();
  const result = await inventoryRetailCatalog.createRetailVariant(h.db, "item", { size: "M", color: "Red" });
  assert.equal(result.created, true);
  assert.deepEqual(result.attributes, { color: "red", size: "m" });
  assert.match(h.calls[0].sql, /FOR UPDATE/);
  const insert = h.calls.at(-1)!;
  assert.match(insert.sql, /INSERT INTO "inventoryItemVariant"/);
  assert.match(insert.sql, /VALUES \(\$1, \$2, false, \$3/);
  assert.equal(insert.args[0], result.inventoryItemVariantId);
  assert.equal(insert.args[1], "item");
  assert.equal(insert.args[2], '{"color":"red","size":"m"}');
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "inventoryItem" (')), false);
});

test("an existing attribute combination is reused without changing price or eligibility", async () => {
  const h = database({ id: "existing", active: true });
  const result = await inventoryRetailCatalog.createRetailVariant(h.db, "item", { size: "m" });
  assert.equal(result.inventoryItemVariantId, "existing");
  assert.equal(result.created, false);
  assert.equal(h.calls.some(c => /INSERT|UPDATE "/.test(c.sql)), false);
});

test("inactive combination returns conflict instead of creating a duplicate", async () => {
  const h = database({ id: "existing", active: false });
  await assert.rejects(() => inventoryRetailCatalog.createRetailVariant(h.db, "item", { size: "m" }), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
  assert.equal(h.calls.some(c => c.sql.includes("INSERT")), false);
});

test("inactive master blocks variation creation", async () => {
  const h = database(null, false);
  await assert.rejects(() => inventoryRetailCatalog.createRetailVariant(h.db, "item", { size: "m" }), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  assert.equal(h.calls.length, 1);
});

test("schema keeps nullable legacy keys and a migration-compatible combination lookup index", () => {
  const plugin = inventoryAccess({ pool: {} as never });
  assert.doesNotThrow(() => getAuthTables({ plugins: [plugin] }));
  const variant = plugin.schema!.inventoryItemVariant;
  assert.equal(variant.fields.variationKey.required, false);
  assert.ok(variant.indexes!.some(index => !index.unique && JSON.stringify(index.fields) === JSON.stringify(["inventoryItemId", "variationKey"])));
});
