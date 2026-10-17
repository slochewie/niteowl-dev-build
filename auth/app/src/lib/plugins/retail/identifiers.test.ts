import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { retail } from "./index.ts";
import { normalizeSku, normalizeBarcode } from "./identifiers.ts";

type Options = {
  write?: boolean; enabled?: boolean; parentFound?: boolean; active?: boolean;
  sku?: { id: string; sku: string } | null; skuConflict?: boolean;
  barcode?: { id: string; retailOrganizationVariantId: string; symbology: string } | null;
  auditFails?: boolean; uniqueFailure?: boolean; mappingFound?: boolean;
};
function harness(options: Options = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ");
      if (q.includes('SELECT u.role AS "systemRole"')) return { rows: [{ systemRole: "user", memberRole: "member", memberId: "member" }], rowCount: 1 };
      if (q.includes("to_regclass")) return { rows: [{ ready: true }], rowCount: 1 };
      if (q.includes('SELECT enabled FROM "retailOrganizationConfig"')) return { rows: [{ enabled: true }], rowCount: 1 };
      if (q.includes('SELECT c.capability')) {
        const rows = [{ capability: "retail:read" }, ...(options.write === false ? [] : [{ capability: "retail:item:write" }])];
        return { rows, rowCount: rows.length };
      }
      if (q.includes('SELECT r.id FROM "retailOrganizationVariant"')) {
        const found = options.parentFound !== false && !(args[2] === true && options.active === false);
        return { rows: found ? [{ id: "retail" }] : [], rowCount: found ? 1 : 0 };
      }
      if (q.includes('SELECT id, sku FROM "retailSku"')) return { rows: options.sku ? [options.sku] : [], rowCount: options.sku ? 1 : 0 };
      if (q.includes('SELECT id FROM "retailSku"')) return { rows: options.skuConflict ? [{ id: "other" }] : [], rowCount: options.skuConflict ? 1 : 0 };
      if (q.includes('SELECT id, "retailOrganizationVariantId", symbology')) return { rows: options.barcode ? [options.barcode] : [], rowCount: options.barcode ? 1 : 0 };
      if (q.includes('SELECT id, barcode, symbology')) return { rows: [{ id: "b1", barcode: "000123", symbology: "unspecified" }, { id: "b2", barcode: "Case-Sensitive", symbology: "code-128" }], rowCount: 2 };
      if (q.includes('SELECT b.id, b."retailOrganizationVariantId"')) return { rows: options.mappingFound === false ? [] : [{ id: "barcode", retailOrganizationVariantId: "retail", barcode: "000123", symbology: "unspecified" }], rowCount: options.mappingFound === false ? 0 : 1 };
      if (q.includes('SELECT b.id AS "barcodeId"')) return { rows: options.mappingFound === false ? [] : [{ barcodeId: "barcode", barcode: "000123", retailOrganizationVariantId: "retail" }], rowCount: options.mappingFound === false ? 0 : 1 };
      if (q.includes('INSERT INTO "retailSku"') || q.includes('INSERT INTO "retailBarcode"') || q.includes('UPDATE "retailSku"')) {
        if (options.uniqueFailure) throw Object.assign(new Error("duplicate"), { code: "23505" });
      }
      if (q.includes('INSERT INTO "revisionHistory"')) {
        if (options.auditFails) throw new Error("audit failed");
        return { rows: [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    },
    async connect() { return db; },
    release() {},
  };
  const catalog = {
    async createRetailVariant() { return { inventoryItemVariantId: "variant", attributes: { size: "m" }, created: true }; },
    async ensureOrganizationVariant() { return "ov"; },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog, enabled: options.enabled ?? true });
  const endpoints = plugin.endpoints!;
  const context = { session: { user: { id: "user" }, session: {} } };
  const setSku = (sku: string | null) => endpoints.setRetailSku({ body: { organizationId: "org", retailOrganizationVariantId: "retail", sku }, context });
  const addBarcode = (barcode = "000123", symbology = "unspecified") => endpoints.addRetailBarcode({ body: { organizationId: "org", retailOrganizationVariantId: "retail", barcode, symbology }, context });
  const removeBarcode = () => endpoints.removeRetailBarcode({ body: { organizationId: "org", barcodeId: "barcode" }, context });
  return { calls, plugin, endpoints, context, setSku, addBarcode, removeBarcode };
}

test("SKU canonicalization is organization-comparable; barcode normalization preserves leading zeros and case", () => {
  assert.equal(normalizeSku(" tee-m/red "), "TEE-M/RED");
  assert.equal(normalizeSku("ＴＥＥ"), "TEE");
  assert.equal(normalizeBarcode(" 000123 "), "000123");
  assert.equal(normalizeBarcode("Case-Sensitive"), "Case-Sensitive");
  assert.throws(() => normalizeSku("two words"));
  assert.throws(() => normalizeSku(""));
  assert.throws(() => normalizeBarcode("two words"));
  assert.throws(() => normalizeBarcode("é"));
  assert.throws(() => normalizeBarcode("x".repeat(129)));
});

test("SKU creation is scoped, audited and changes no Inventory fields", async () => {
  const h = harness();
  const result = await h.setSku(" tee-m ") as { sku: string };
  assert.equal(result.sku, "TEE-M");
  const insert = h.calls.find(c => c.sql.includes('INSERT INTO "retailSku"'))!;
  assert.deepEqual(insert.args.slice(1), ["org", "retail", "TEE-M"]);
  assert.equal(h.calls.some(c => /UPDATE "inventory|INSERT INTO "inventory/.test(c.sql)), false);
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO "revisionHistory"')), true);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
});

test("SKU replacement retains the mapping ID", async () => {
  const h = harness({ sku: { id: "sku", sku: "OLD" } });
  const result = await h.setSku("new") as { id: string; sku: string };
  assert.deepEqual(result, { retailOrganizationVariantId: "retail", id: "sku", sku: "NEW" });
  assert.deepEqual(h.calls.find(c => c.sql.includes('UPDATE "retailSku"'))!.args, ["NEW", "sku", "org"]);
});

test("SKU retry is a no-op and organization collisions return 409", async () => {
  const same = harness({ sku: { id: "sku", sku: "SAME" } });
  await same.setSku("same");
  assert.equal(same.calls.some(c => /INSERT INTO|UPDATE "retailSku"/.test(c.sql)), false);
  const duplicate = harness({ skuConflict: true });
  await assert.rejects(() => duplicate.setSku("same"), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
  assert.equal(duplicate.calls.at(-1)!.sql, "ROLLBACK");
});

test("SKU can be cleared from a disabled enrollment without deleting the product", async () => {
  const h = harness({ active: false, sku: { id: "sku", sku: "OLD" } });
  assert.deepEqual(await h.setSku(null), { retailOrganizationVariantId: "retail", sku: null });
  assert.deepEqual(h.calls.find(c => c.sql.includes('DELETE FROM "retailSku"'))!.args, ["sku", "org"]);
  assert.equal(h.calls.some(c => c.sql.includes('DELETE FROM "retailOrganizationVariant"')), false);
});

test("multiple barcodes may attach to the same enrollment", async () => {
  const h = harness();
  await h.addBarcode("000123");
  await h.addBarcode("Alternate-Code", "code-128");
  const inserts = h.calls.filter(c => c.sql.includes('INSERT INTO "retailBarcode"'));
  assert.equal(inserts.length, 2);
  assert.deepEqual(inserts.map(c => c.args.slice(1)), [
    ["org", "retail", "000123", "unspecified"],
    ["org", "retail", "Alternate-Code", "code-128"],
  ]);
});

test("identical barcode retry preserves its ID without another write or audit", async () => {
  const h = harness({ barcode: { id: "existing", retailOrganizationVariantId: "retail", symbology: "unspecified" } });
  const result = await h.addBarcode() as { id: string };
  assert.equal(result.id, "existing");
  assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO')), false);
});

for (const barcode of [
  { id: "other", retailOrganizationVariantId: "other-retail", symbology: "unspecified" },
  { id: "other", retailOrganizationVariantId: "retail", symbology: "code-128" },
]) {
  test("conflicting barcode ownership or symbology returns 409: " + JSON.stringify(barcode), async () => {
    const h = harness({ barcode });
    await assert.rejects(() => h.addBarcode(), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
    assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  });
}

test("disabled and foreign enrollments cannot receive identifiers", async () => {
  for (const options of [{ active: false }, { parentFound: false }]) {
    const h = harness(options);
    await assert.rejects(() => h.addBarcode(), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
    await assert.rejects(() => h.setSku("NEW"), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
    assert.equal(h.calls.some(c => c.sql.includes('INSERT INTO')), false);
  }
});

test("barcode removal scopes both stored and derived organization ownership and audits deletion", async () => {
  const h = harness({ active: false });
  await h.removeBarcode();
  const lookup = h.calls.find(c => c.sql.includes('SELECT b.id, b."retailOrganizationVariantId"'))!;
  assert.match(lookup.sql, /b."organizationId" = \$2 AND ov."organizationId" = \$2/);
  assert.deepEqual(h.calls.find(c => c.sql.includes('DELETE FROM "retailBarcode"'))!.args, ["barcode", "org"]);
  const audit = h.calls.find(c => c.sql.includes('INSERT INTO "revisionHistory"'))!;
  assert.equal(audit.args[3], "delete");
  assert.equal(JSON.parse(audit.args[5] as string).barcode, "000123");
});

test("missing/foreign barcode removal returns 404 without a deletion", async () => {
  const h = harness({ mappingFound: false });
  await assert.rejects(h.removeBarcode, (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  assert.equal(h.calls.some(c => c.sql.includes("DELETE")), false);
});

test("viewer may list and look up identifiers but cannot mutate them", async () => {
  const h = harness({ write: false, sku: { id: "sku", sku: "TEE" } });
  const listed = await h.endpoints.listRetailIdentifiers({ query: { organizationId: "org", retailOrganizationVariantId: "retail" }, context: h.context }) as { barcodes: object[] };
  assert.equal(listed.barcodes.length, 2);
  await h.endpoints.lookupRetailBarcode({ query: { organizationId: "org", barcode: "000123" }, context: h.context });
  for (const run of [() => h.setSku("NEW"), () => h.addBarcode(), h.removeBarcode]) {
    await assert.rejects(run, (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  }
  assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
});

test("scanner lookup requires active product and organization-scoped mapping", async () => {
  const h = harness({ mappingFound: false });
  await assert.rejects(() => h.endpoints.lookupRetailBarcode({ query: { organizationId: "org", barcode: "000123" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  const lookup = h.calls.at(-1)!;
  assert.match(lookup.sql, /b."organizationId" = \$1 AND ov."organizationId" = \$1/);
  assert.match(lookup.sql, /r.enabled AND v.active AND i.active/);
  assert.deepEqual(lookup.args, ["org", "000123"]);
});

test("database uniqueness races become conflicts and roll back", async () => {
  for (const run of ["sku", "barcode"]) {
    const h = harness({ uniqueFailure: true });
    await assert.rejects(() => run === "sku" ? h.setSku("NEW") : h.addBarcode(), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
    assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
    assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
  }
});

test("audit failures roll back identifier mutations", async () => {
  const h = harness({ auditFails: true });
  await assert.rejects(() => h.addBarcode(), /audit failed/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
});

test("closed rollout gate rejects identifier changes before any SQL", async () => {
  const h = harness({ enabled: false });
  await assert.rejects(() => h.addBarcode(), (e: unknown) => (e as { statusCode: number }).statusCode === 403);
  assert.equal(h.calls.length, 0);
});

test("identifier listing rejects foreign enrollment IDs before reading mappings", async () => {
  const h = harness({ parentFound: false });
  await assert.rejects(() => h.endpoints.listRetailIdentifiers({ query: { organizationId: "org", retailOrganizationVariantId: "foreign" }, context: h.context }), (e: unknown) => (e as { statusCode: number }).statusCode === 404);
  assert.equal(h.calls.some(c => c.sql.includes('FROM "retailSku"') || c.sql.includes('FROM "retailBarcode"')), false);
});

test("identifier requests reject numeric barcodes and unrelated menu fields", async () => {
  const h = harness();
  await assert.rejects(() => h.endpoints.addRetailBarcode({ body: { organizationId: "org", retailOrganizationVariantId: "retail", barcode: 123 }, context: h.context }));
  await assert.rejects(() => h.endpoints.setRetailSku({ body: { organizationId: "org", retailOrganizationVariantId: "retail", sku: "TEE", exportToToast: true }, context: h.context }));
  assert.equal(h.calls.length, 0);
});

test("identifier schemas enforce one SKU per enrollment and organization-unique values", () => {
  const h = harness();
  const schema = h.plugin.schema!;
  assert.equal(schema.retailSku.fields.retailOrganizationVariantId.unique, true);
  assert.equal(schema.retailBarcode.fields.retailOrganizationVariantId.unique, undefined);
  assert.ok(schema.retailSku.indexes!.some(index => index.unique && JSON.stringify(index.fields) === '["organizationId","sku"]'));
  assert.ok(schema.retailBarcode.indexes!.some(index => index.unique && JSON.stringify(index.fields) === '["organizationId","barcode"]'));
  assert.equal(schema.retailBarcode.fields.retailOrganizationVariantId.references!.onDelete, "restrict");
});
