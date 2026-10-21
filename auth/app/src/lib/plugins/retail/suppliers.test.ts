import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { getAuthTables } from "@better-auth/core/db";
import { retail } from "./index.ts";
import { normalizeSupplierCode, normalizeSupplierSku } from "./suppliers.ts";

type Supplier = { id: string; organizationId: string; code: string; name: string; contactName: string | null; email: string | null; phone: string | null; active: boolean };
type Item = { id: string; supplierId: string; retailOrganizationVariantId: string; supplierSku: string; unitsPerPack: number; active: boolean };
type Options = { caps?: string[]; admin?: boolean; revoked?: boolean; auditFails?: boolean; duplicateCode?: boolean; duplicateItem?: boolean; enabled?: boolean; ready?: boolean; inactiveEnrollment?: boolean };
function harness(options: Options = {}) {
  let state = { suppliers: [
    { id: "supplier", organizationId: "org", code: "VENDOR", name: "Vendor", contactName: null, email: null, phone: null, active: true },
    { id: "second", organizationId: "org", code: "OTHER", name: "Other", contactName: null, email: null, phone: null, active: true },
    { id: "foreign", organizationId: "other", code: "VENDOR", name: "Foreign", contactName: null, email: null, phone: null, active: true },
  ] as Supplier[], items: [] as Item[], audits: 0 };
  let snapshot = structuredClone(state), reads = 0, released = false;
  const calls: { sql: string; args: unknown[] }[] = [];
  const enrollmentOrg = (id: string) => id === "retail" || id === "retail-2" ? "org" : "other";
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });const q = sql.replace(/\s+/g, " ").trim();let rows: unknown[] = [];
      if (q === "BEGIN") snapshot = structuredClone(state);
      else if (q === "ROLLBACK") state = snapshot;
      else if (q.includes('SELECT u.role AS "systemRole"')) { reads++;rows = options.revoked && reads > 1 ? [] : [{ systemRole: "user", memberRole: options.admin ? "owner" : "member", memberId: "member" }]; }
      else if (q.includes("to_regclass")) rows = [{ ready: options.ready !== false }];
      else if (q.startsWith('SELECT enabled FROM "retailOrganizationConfig"')) rows = [{ enabled: true }];
      else if (q.startsWith('SELECT c.capability FROM "retailAssignment"')) rows = (options.caps ?? ["retail:purchase"]).map(capability => ({ capability }));
      else if (q.startsWith('SELECT id, "organizationId", code')) rows = state.suppliers.filter(s => s.id === args[0] && s.organizationId === args[1]);
      else if (q.startsWith('INSERT INTO "retailSupplier"')) {
        if (options.duplicateCode || state.suppliers.some(s => s.organizationId === args[1] && s.code === args[2])) throw Object.assign(new Error("duplicate"), { code: "23505" });
        const row: Supplier = { id: String(args[0]), organizationId: String(args[1]), code: String(args[2]), name: String(args[3]), contactName: args[4] as string | null, email: args[5] as string | null, phone: args[6] as string | null, active: true };
        state.suppliers.push(row);rows = [row];
      } else if (q.startsWith('UPDATE "retailSupplier"')) {
        const row = state.suppliers.find(s => s.id === args[0] && s.organizationId === args[1]);
        if (row) { const saved = { ...row, name: String(args[2]), contactName: args[3] as string | null, email: args[4] as string | null, phone: args[5] as string | null, active: args[6] as boolean };state.suppliers[state.suppliers.indexOf(row)] = saved;rows = [saved]; }
      } else if (q.startsWith('SELECT r.id FROM "inventoryItem"')) rows = !options.inactiveEnrollment && enrollmentOrg(String(args[0])) === args[1] ? [{ id: args[0] }] : [];
      else if (q.startsWith('SELECT id, "supplierId",')) rows = state.items.filter(i => i.supplierId === args[0] && i.supplierSku === args[1]);
      else if (q.startsWith('INSERT INTO "retailSupplierItem"')) {
        if (options.duplicateItem) throw Object.assign(new Error("duplicate"), { code: "23505" });
        const row: Item = { id: String(args[0]), supplierId: String(args[1]), retailOrganizationVariantId: String(args[2]), supplierSku: String(args[3]), unitsPerPack: Number(args[4]), active: true };state.items.push(row);rows = [row];
      } else if (q.startsWith('SELECT si.id,') && q.includes('FOR UPDATE OF si')) rows = state.items.filter(i => i.id === args[0] && state.suppliers.some(s => s.id === i.supplierId && s.organizationId === args[1]) && enrollmentOrg(i.retailOrganizationVariantId) === args[1]);
      else if (q.startsWith('UPDATE "retailSupplierItem"')) {
        const row = state.items.find(i => i.id === args[0]);
        if (row) { const saved = { ...row, unitsPerPack: Number(args[1]), active: Boolean(args[2]) };state.items[state.items.indexOf(row)] = saved;rows = [saved]; }
      } else if (q.includes('INSERT INTO "revisionHistory"')) {
        if (options.auditFails) throw new Error("audit failed");state.audits++;rows = [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }];
      } else if (q.startsWith('SELECT id, code, name')) rows = state.suppliers.filter(s => s.organizationId === args[0] && (args[1] || s.active) && (args[2] == null || s.id > String(args[2]))).sort((a, b) => a.id.localeCompare(b.id)).slice(0, Number(args[3]));
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },release() { released = true; },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog: {} as never, enabled: options.enabled !== false });
  const endpoints = plugin.endpoints!, context = { session: { user: { id: "actor" }, session: {} } };
  const create = (body = {}) => endpoints.createRetailSupplier({ body: { organizationId: "org", code: " new-1 ", name: " New supplier ", ...body }, context });
  const update = (body = {}) => endpoints.updateRetailSupplier({ body: { organizationId: "org", supplierId: "supplier", name: "Updated", contactName: null, email: null, phone: null, active: false, ...body }, context });
  const map = (body = {}) => endpoints.createRetailSupplierItem({ body: { organizationId: "org", supplierId: "supplier", retailOrganizationVariantId: "retail", supplierSku: " 001-Ab ", unitsPerPack: 12, ...body }, context });
  const updateMap = (supplierItemId: string, body = {}) => endpoints.updateRetailSupplierItem({ body: { organizationId: "org", supplierItemId, unitsPerPack: 6, active: true, ...body }, context });
  return { options, calls, plugin, endpoints, context, create, update, map, updateMap, state: () => state, released: () => released };
}
const status = (code: number) => (error: unknown) => (error as { statusCode: number }).statusCode === code;

test("supplier codes normalize; supplier SKUs preserve case and leading zeros", () => {
  assert.equal(normalizeSupplierCode(" ｖendor-1 "), "VENDOR-1");assert.equal(normalizeSupplierSku(" 001-aB "), "001-aB");
  for (const value of [" ", "bad code", "x".repeat(65)]) assert.throws(() => normalizeSupplierCode(value), status(400));
  for (const value of ["", "bad code", "a\nb", "x".repeat(129)]) assert.throws(() => normalizeSupplierSku(value), status(400));
});
test("purchaser can create supplier with normalized metadata and atomic audit without general read", async () => {
  const h = harness();const result = await h.create() as { supplier: Supplier };
  assert.equal(result.supplier.code, "NEW-1");assert.equal(result.supplier.name, "New supplier");assert.equal(result.supplier.contactName, null);assert.equal(result.supplier.active, true);
  assert.equal(h.state().audits, 1);assert.equal(h.calls.at(-1)!.sql, "COMMIT");assert.equal(h.released(), true);
});
for (const cap of ["retail:read", "retail:item:write", "retail:manage", "retail:receive", "retail:cost:read"]) {
  test(cap + " alone cannot read supplier contacts or manage procurement mappings", async () => {
    const h = harness({ caps: [cap] });await assert.rejects(() => h.create(), status(403));await assert.rejects(() => h.map(), status(403));
    await assert.rejects(() => h.endpoints.listRetailSuppliers({ query: { organizationId: "org" }, context: h.context }), status(403));
    assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
  });
}
test("archive preserves supplier identity, reserved code and existing mappings", async () => {
  const h = harness();await h.map();await h.update();
  assert.equal(h.state().suppliers.find(s => s.id === "supplier")!.active, false);assert.equal(h.state().items.length, 1);
  await assert.rejects(() => h.create({ code: "vendor" }), status(409));
  await h.update({ active: true });assert.equal(h.state().suppliers.find(s => s.id === "supplier")!.code, "VENDOR");assert.equal(h.calls.some(c => c.sql.startsWith("DELETE")), false);
});
test("foreign supplier update fails before any mutation", async () => {
  const h = harness();const before = structuredClone(h.state());await assert.rejects(() => h.update({ supplierId: "foreign" }), status(404));assert.deepEqual(h.state(), before);
});
test("new supplier SKU maps to an existing enrollment without catalog, menu or stock changes", async () => {
  const h = harness();const result = await h.map() as { created: boolean; supplierItem: Item };
  assert.equal(result.created, true);assert.equal(result.supplierItem.supplierSku, "001-Ab");assert.equal(result.supplierItem.unitsPerPack, 12);
  assert.equal(result.supplierItem.retailOrganizationVariantId, "retail");assert.equal(h.state().audits, 1);
  assert.equal(h.calls.some(c => /(?:INSERT INTO|UPDATE) "(?:inventory|retailStock)/.test(c.sql)), false);
});
test("multiple supplier SKUs and suppliers may map to the same enrollment", async () => {
  const h = harness();await h.map();await h.map({ supplierSku: "case-24", unitsPerPack: 24 });await h.map({ supplierId: "second" });assert.equal(h.state().items.length, 3);
});
test("identical mapping retry preserves ID and archived state without additional audit", async () => {
  const h = harness();const first = await h.map() as { supplierItem: Item };
  await h.updateMap(first.supplierItem.id, { active: false, unitsPerPack: 12 });const audits = h.state().audits;
  const retry = await h.map() as { created: boolean; supplierItem: Item };
  assert.equal(retry.created, false);assert.equal(retry.supplierItem.id, first.supplierItem.id);assert.equal(retry.supplierItem.active, false);assert.equal(h.state().audits, audits);
});
test("reserved supplier SKU cannot silently retarget a variant or change pack conversion", async () => {
  const h = harness();await h.map();const before = structuredClone(h.state());
  await assert.rejects(() => h.map({ retailOrganizationVariantId: "retail-2" }), status(409));await assert.rejects(() => h.map({ unitsPerPack: 24 }), status(409));assert.deepEqual(h.state(), before);
});
for (const body of [{ supplierId: "foreign" }, { retailOrganizationVariantId: "foreign-retail" }]) {
  test("supplier mapping rejects foreign ownership: " + JSON.stringify(body), async () => {
    const h = harness();await assert.rejects(() => h.map(body), status(404));assert.equal(h.state().items.length, 0);
  });
}
test("archived supplier and inactive enrollment reject new or reactivated mappings", async () => {
  const h = harness();const first = await h.map() as { supplierItem: Item };await h.update();await assert.rejects(() => h.map({ supplierSku: "new" }), status(409));await assert.rejects(() => h.updateMap(first.supplierItem.id), status(409));
  const inactive = harness({ inactiveEnrollment: true });await assert.rejects(() => inactive.map(), status(404));
});
test("mapping can be disabled after its supplier or enrollment is inactive", async () => {
  const h = harness();const first = await h.map() as { supplierItem: Item };await h.update();h.options.inactiveEnrollment = true;
  await h.updateMap(first.supplierItem.id, { active: false });assert.equal(h.state().items[0].active, false);
});
test("pack conversion update preserves supplier SKU and enrollment identity and audits prior values", async () => {
  const h = harness();const first = await h.map() as { supplierItem: Item };await h.updateMap(first.supplierItem.id);
  const row = h.state().items[0];assert.equal(row.id, first.supplierItem.id);assert.equal(row.unitsPerPack, 6);assert.equal(row.supplierSku, "001-Ab");assert.equal(row.retailOrganizationVariantId, "retail");
  const audit = h.calls.filter(c => c.sql.includes('INSERT INTO "revisionHistory"')).at(-1)!;assert.match(String(audit.args[6]), /"unitsPerPack":12/);
});
test("foreign or inconsistent mapping update fails without changing metadata", async () => {
  const h = harness();h.state().items.push({ id: "bad", supplierId: "supplier", retailOrganizationVariantId: "foreign-retail", supplierSku: "foreign", unitsPerPack: 1, active: true });
  const before = structuredClone(h.state());await assert.rejects(() => h.updateMap("bad", { active: false }), status(404));assert.deepEqual(h.state(), before);
});
for (const action of ["create", "map"] as const) {
  test(action + " audit failure rolls back supplier data and releases connection", async () => {
    const h = harness({ auditFails: true });const before = structuredClone(h.state());await assert.rejects(() => h[action](), /audit failed/);assert.deepEqual(h.state(), before);assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");assert.equal(h.released(), true);
  });
}
test("uniqueness conflicts roll back supplier and mapping writes", async () => {
  for (const [options, action] of [[{ duplicateCode: true }, "create"], [{ duplicateItem: true }, "map"]] as [Options, "create" | "map"][]) {
    const h = harness(options);await assert.rejects(() => h[action](), status(409));assert.equal(h.state().audits, 0);assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  }
});
test("transaction permission recheck prevents revoked purchaser writes", async () => {
  const h = harness({ revoked: true });await assert.rejects(() => h.map(), status(403));assert.equal(h.state().items.length, 0);assert.equal(h.calls.some(c => c.sql.startsWith("INSERT")), false);
});
test("organization lock precedes recheck and supplier/variant locks", async () => {
  const h = harness();await h.map();const lock = h.calls.findIndex(c => c.args.includes("retail:authorization:org"));
  const recheck = h.calls.findIndex((c, i) => i > lock && c.sql.includes('SELECT u.role AS "systemRole"'));const supplier = h.calls.findIndex(c => c.sql.startsWith('SELECT id, "organizationId", code'));
  assert.ok(lock > 0 && recheck > lock && supplier > recheck);
});
for (const body of [{ name: " " }, { name: "a\nb" }, { email: "bad" }, { contactName: " " }, { code: "has spaces" }]) {
  test("invalid supplier metadata fails without a write: " + JSON.stringify(body), async () => {
    const h = harness();await assert.rejects(() => h.create(body), status(400));assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
  });
}
for (const body of [{ unitsPerPack: 0 }, { unitsPerPack: 0.5 }, { unitsPerPack: 1_000_001 }, { supplierSku: "bad sku" }, { priceOverrideCents: 100 }, { purchaseCostCents: 100 }]) {
  test("invalid pack metadata and unrelated price/cost fields are rejected: " + JSON.stringify(body), async () => {
    const h = harness();await assert.rejects(() => h.map(body), status(400));assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
  });
}
test("mapping update cannot rewrite supplier, SKU or enrollment identity", async () => {
  const h = harness();await assert.rejects(() => h.updateMap("any", { supplierSku: "new" }), status(400));assert.equal(h.calls.length, 0);
});
test("supplier lists are organization-scoped, paginated and explicitly include archives", async () => {
  const h = harness();await h.update();
  const first = await h.endpoints.listRetailSuppliers({ query: { organizationId: "org", limit: 1 }, context: h.context }) as { suppliers: Supplier[]; nextAfterId: string | null };
  assert.deepEqual(first.suppliers.map(s => s.id), ["second"]);assert.equal(first.nextAfterId, null);
  const all = await h.endpoints.listRetailSuppliers({ query: { organizationId: "org", includeInactive: "true", limit: 1 }, context: h.context }) as { suppliers: Supplier[]; nextAfterId: string };
  assert.equal(all.nextAfterId, "second");assert.equal(h.calls.at(-1)!.args[0], "org");
});
test("mapping listing scopes supplier and enrollment ownership and keeps filtering optional", async () => {
  const h = harness();await h.endpoints.listRetailSupplierItems({ query: { organizationId: "org", supplierId: "supplier", retailOrganizationVariantId: "retail", includeInactive: "false" }, context: h.context });
  assert.deepEqual(h.calls.at(-1)!.args, ["org", false, "supplier", "retail", null, 101]);
});
test("closed registration and undeployed supplier schema fail before supplier writes", async () => {
  for (const options of [{ enabled: false }, { ready: false }]) { const h = harness(options);await assert.rejects(() => h.create(), status(403));assert.equal(h.calls.some(c => c.sql === "BEGIN"), false); }
});
test("supplier schemas pass real index validation and contain no duplicate item or cost fields", () => {
  const h = harness();assert.doesNotThrow(() => getAuthTables({ plugins: [h.plugin] }));const schema = h.plugin.schema!;
  assert.equal(schema.retailSupplier.fields.organizationId.references?.onDelete, "restrict");assert.equal(schema.retailSupplierItem.fields.supplierId.references?.onDelete, "restrict");
  assert.equal(schema.retailSupplierItem.fields.retailOrganizationVariantId.references?.model, "retailOrganizationVariant");assert.equal("organizationId" in schema.retailSupplierItem.fields, false);assert.equal("cost" in schema.retailSupplierItem.fields, false);
});
