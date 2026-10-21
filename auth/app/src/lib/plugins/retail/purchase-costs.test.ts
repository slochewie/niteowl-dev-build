import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { getAuthTables } from "@better-auth/core/db";
import { retail } from "./index.ts";

type Cost = { id: string; supplierItemId: string; idempotencyKey: string; requestFingerprint: string; packCostMinor: number; currency: string; unitsPerPackSnapshot: number; effectiveAt: string; reason: string; actorUserId: string; createdAt: string };
type Options = { caps?: string[]; missing?: boolean; archived?: boolean; units?: number; auditFails?: boolean; revoked?: boolean; ready?: boolean; enabled?: boolean };
function harness(options: Options = {}) {
  let state = { costs: [] as Cost[], audits: 0 }, snapshot = structuredClone(state), reads = 0, released = false;
  const calls: { sql: string; args: unknown[] }[] = [];
  const visible = ({ idempotencyKey, requestFingerprint, ...cost }: Cost) => cost;
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });const q = sql.replace(/\s+/g, " ").trim();let rows: unknown[] = [];
      if (q === "BEGIN") snapshot = structuredClone(state);
      else if (q === "ROLLBACK") state = snapshot;
      else if (q.includes('SELECT u.role AS "systemRole"')) { reads++;rows = options.revoked && reads > 1 ? [] : [{ systemRole: "user", memberRole: "member", memberId: "member" }]; }
      else if (q.includes("to_regclass")) rows = [{ ready: options.ready !== false }];
      else if (q.startsWith('SELECT enabled FROM "retailOrganizationConfig"')) rows = [{ enabled: true }];
      else if (q.startsWith('SELECT c.capability FROM "retailAssignment"')) rows = (options.caps ?? ["retail:purchase", "retail:cost:read"]).map(capability => ({ capability }));
      else if (q.startsWith('SELECT si.id, si."unitsPerPack"')) rows = options.missing || args[0] !== "mapping" || args[1] !== "org" ? [] : [{ id: "mapping", unitsPerPack: options.units ?? 12, active: !options.archived, supplierActive: true, enrollmentEnabled: true, variantActive: true, itemActive: true }];
      else if (q.startsWith('SELECT c.id') && q.includes('c."requestFingerprint"')) rows = state.costs.filter(c => c.supplierItemId === args[0] && c.idempotencyKey === args[1]).map(c => ({ ...visible(c), requestFingerprint: c.requestFingerprint }));
      else if (q.startsWith('INSERT INTO "retailPurchaseCost"')) {
        const row: Cost = { id: String(args[0]), supplierItemId: String(args[1]), idempotencyKey: String(args[2]), requestFingerprint: String(args[3]), packCostMinor: Number(args[4]), currency: String(args[5]), unitsPerPackSnapshot: Number(args[6]), effectiveAt: String(args[7]), reason: String(args[8]), actorUserId: String(args[9]), createdAt: "2026-10-21T12:00:00." + String(state.costs.length + 1).padStart(6, "0") + "Z" };state.costs.push(row);rows = [visible(row)];
      } else if (q.includes('INSERT INTO "revisionHistory"')) {
        if (options.auditFails) throw new Error("audit failed");state.audits++;rows = [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }];
      } else if (q.startsWith('SELECT c.id') && q.includes('COALESCE($4::timestamptz')) rows = state.costs.filter(c => c.supplierItemId === args[0] && args[1] === "org" && c.currency === args[2] && c.effectiveAt <= String(args[3] ?? "2026-10-21T12:00:00.000Z")).sort((a, b) => b.effectiveAt.localeCompare(a.effectiveAt) || b.createdAt.localeCompare(a.createdAt)).slice(0, 1).map(visible);
      else if (q.startsWith('SELECT c.id')) rows = state.costs.filter(c => c.supplierItemId === args[0] && args[1] === "org" && (args[2] == null || c.currency === args[2]) && (args[3] == null || c.createdAt < String(args[3]) || (c.createdAt === args[3] && c.id < String(args[4])))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, Number(args[5])).map(visible);
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },release() { released = true; },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog: {} as never, enabled: options.enabled !== false });
  const endpoints = plugin.endpoints!, context = { session: { user: { id: "actor" }, session: {} } };
  const create = (body = {}) => endpoints.createRetailPurchaseCost({ body: { organizationId: "org", supplierItemId: "mapping", idempotencyKey: "cost-1", packCostMinor: 2500, currency: " usd ", unitsPerPack: 12, effectiveAt: "2026-10-21T08:00:00-04:00", reason: " Supplier quote ", ...body }, context });
  const list = (query = {}) => endpoints.listRetailPurchaseCosts({ query: { organizationId: "org", supplierItemId: "mapping", ...query }, context });
  const current = (query = {}) => endpoints.getRetailCurrentPurchaseCost({ query: { organizationId: "org", supplierItemId: "mapping", currency: "USD", ...query }, context });
  return { options, calls, plugin, create, list, current, state: () => state, released: () => released };
}
const status = (code: number) => (error: unknown) => (error as { statusCode: number }).statusCode === code;

test("cost creation snapshots pack conversion, normalizes currency/time and audits atomically", async () => {
  const h = harness();const result = await h.create() as { created: boolean; cost: Cost };
  assert.equal(result.created, true);assert.equal(result.cost.packCostMinor, 2500);assert.equal(result.cost.unitsPerPackSnapshot, 12);assert.equal(result.cost.currency, "USD");assert.equal(result.cost.effectiveAt, "2026-10-21T12:00:00.000Z");assert.equal(result.cost.reason, "Supplier quote");assert.equal(h.state().audits, 1);assert.equal(h.calls.at(-1)!.sql, "COMMIT");assert.equal(h.released(), true);
  assert.equal("requestFingerprint" in result.cost, false);assert.equal("idempotencyKey" in result.cost, false);
});
test("zero pack cost is valid; no unit-cost rounding or menu/stock writes occur", async () => {
  const h = harness();await h.create({ packCostMinor: 0 });assert.equal(h.state().costs[0].packCostMinor, 0);
  assert.equal(h.calls.some(c => /(?:UPDATE|INSERT INTO) "(?:inventory|retailStock|retailSupplier)/.test(c.sql)), false);
});
for (const caps of [["retail:purchase"], ["retail:cost:read"], ["retail:read"], ["retail:manage"], ["retail:item:write"]]) {
  test("writing cost requires independent purchase and cost-read capabilities: " + caps, async () => {
    const h = harness({ caps });await assert.rejects(() => h.create(), status(403));assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
  });
}
test("cost reader can view history without purchasing or supplier contacts", async () => {
  const h = harness({ caps: ["retail:cost:read"] });assert.deepEqual((await h.list() as { costs: Cost[] }).costs, []);assert.equal((await h.current() as { cost: Cost | null }).cost, null);
  assert.equal(h.calls.some(c => c.sql.includes('s.email') || c.sql.includes('s.phone')), false);
});
test("purchase-only permission cannot read cost history or current cost", async () => {
  const h = harness({ caps: ["retail:purchase"] });await assert.rejects(() => h.list(), status(403));await assert.rejects(() => h.current(), status(403));
});
test("retry returns immutable original snapshot after mapping conversion or archive changes", async () => {
  const h = harness();const first = await h.create() as { cost: Cost };h.options.units = 6;h.options.archived = true;
  const retry = await h.create({ currency: "USD", effectiveAt: "2026-10-21T12:00:00Z" }) as { created: boolean; cost: Cost };
  assert.equal(retry.created, false);assert.equal(retry.cost.id, first.cost.id);assert.equal(retry.cost.unitsPerPackSnapshot, 12);assert.equal(h.state().costs.length, 1);assert.equal(h.state().audits, 1);
});
for (const body of [{ packCostMinor: 2600 }, { currency: "EUR" }, { unitsPerPack: 6 }, { effectiveAt: "2026-10-22T00:00:00Z" }, { reason: "Changed" }]) {
  test("same key with changed cost request conflicts: " + JSON.stringify(body), async () => {
    const h = harness();await h.create();const before = structuredClone(h.state());await assert.rejects(() => h.create(body), status(409));assert.deepEqual(h.state(), before);
  });
}
test("new costs reject stale conversion and inactive parents without a cost row", async () => {
  for (const options of [{ units: 6 }, { archived: true }]) { const h = harness(options);await assert.rejects(() => h.create(), status(409));assert.equal(h.state().costs.length, 0); }
});
test("foreign or inconsistent supplier ownership fails before idempotency lookup", async () => {
  const h = harness();await assert.rejects(() => h.create({ supplierItemId: "foreign" }), status(404));await assert.rejects(() => h.list({ organizationId: "other" }), status(404));assert.equal(h.state().costs.length, 0);
});
test("audit failure rolls back immutable cost creation and releases connection", async () => {
  const h = harness({ auditFails: true });await assert.rejects(() => h.create(), /audit failed/);assert.equal(h.state().costs.length, 0);assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");assert.equal(h.released(), true);
});
test("revocation before transaction authorization check prevents cost writes", async () => {
  const h = harness({ revoked: true });await assert.rejects(() => h.create(), status(403));assert.equal(h.state().costs.length, 0);assert.equal(h.calls.some(c => c.sql.startsWith('INSERT INTO "retailPurchaseCost"')), false);
});
test("current cost selects effective currency-specific entries without treating future quotes as current", async () => {
  const h = harness();await h.create();await h.create({ idempotencyKey: "future", packCostMinor: 3000, effectiveAt: "2026-10-23T00:00:00Z" });await h.create({ idempotencyKey: "eur", currency: "EUR", packCostMinor: 2000 });
  assert.equal((await h.current() as { cost: Cost }).cost.packCostMinor, 2500);assert.equal((await h.current({ asOf: "2026-10-24T00:00:00Z" }) as { cost: Cost }).cost.packCostMinor, 3000);assert.equal((await h.current({ currency: "EUR" }) as { cost: Cost }).cost.packCostMinor, 2000);
});
test("history remains readable after mapping archive and preserves earlier conversions", async () => {
  const h = harness();await h.create();h.options.units = 6;await h.create({ idempotencyKey: "six", unitsPerPack: 6, packCostMinor: 1500 });h.options.archived = true;
  const history = await h.list() as { costs: Cost[] };assert.deepEqual(history.costs.map(c => c.unitsPerPackSnapshot), [6, 12]);assert.equal(h.state().costs.length, 2);
});
test("history pagination preserves recorded microseconds and currency filtering", async () => {
  const h = harness();await h.create();await h.create({ idempotencyKey: "two", packCostMinor: 2600 });
  const first = await h.list({ limit: 1, currency: "usd" }) as { costs: Cost[]; next: { before: string; beforeId: string } };
  assert.equal(first.next.before, "2026-10-21T12:00:00.000002Z");const second = await h.list({ limit: 1, ...first.next }) as { costs: Cost[]; next: null };assert.equal(second.costs[0].packCostMinor, 2500);assert.equal(second.next, null);
});
for (const body of [{ packCostMinor: -1 }, { packCostMinor: 0.5 }, { packCostMinor: 2_147_483_648 }, { currency: "US" }, { unitsPerPack: 0 }, { unitsPerPack: 1.5 }, { effectiveAt: "yesterday" }, { effectiveAt: "2026-10-21T00:00:00.123456Z" }, { reason: " " }, { idempotencyKey: "bad key" }, { priceOverrideCents: 100 }]) {
  test("invalid cost payload is rejected before a transaction: " + JSON.stringify(body), async () => {
    const h = harness();await assert.rejects(() => h.create(body), status(400));assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
  });
}
test("history cursor requires both timestamp and ID", async () => {
  const h = harness();await assert.rejects(() => h.list({ before: "2026-10-21T00:00:00Z" }), status(400));assert.equal(h.calls.length, 0);
});
test("disabled rollout and missing cost schema fail closed", async () => {
  for (const options of [{ enabled: false }, { ready: false }]) { const h = harness(options);await assert.rejects(() => h.create(), status(403));assert.equal(h.state().costs.length, 0); }
});
test("cost schema validates portable indexes and preserves required historical references", () => {
  const h = harness();assert.doesNotThrow(() => getAuthTables({ plugins: [h.plugin] }));const schema = h.plugin.schema!.retailPurchaseCost;
  assert.equal(schema.fields.supplierItemId.references?.model, "retailSupplierItem");assert.equal(schema.fields.supplierItemId.references?.onDelete, "restrict");assert.equal(schema.fields.actorUserId.references?.onDelete, "restrict");assert.equal("organizationId" in schema.fields, false);assert.equal("inventoryItemId" in schema.fields, false);
});
