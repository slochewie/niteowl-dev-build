import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { getAuthTables } from "@better-auth/core/db";
import { retail } from "./index.ts";
import { stockFingerprint, stockQuantityAfter } from "./stock.ts";

type Options = { admin?: boolean; caps?: string[]; allowedLocations?: string[]; inactiveItem?: boolean;
  missingItem?: boolean; archived?: string; auditFails?: boolean; failMovement?: number; revoked?: boolean; enabled?: boolean };
type Balance = { id: string; quantity: number };
type Operation = { id: string; organizationId: string; idempotencyKey: string; requestFingerprint: string };
type Movement = { id: string; operationId: string; retailOrganizationVariantId: string; locationId: string; quantityDelta: number; quantityAfter: number; createdAt: Date };
function harness(options: Options = {}, quantities: Record<string, number> = { a: 10, b: 2 }) {
  let state = { balances: Object.fromEntries(Object.entries(quantities).map(([key, quantity]) => [key, { id: "balance-" + key, quantity }])) as Record<string, Balance>, operations: [] as Operation[], movements: [] as Movement[], audits: 0 };
  let snapshot = structuredClone(state), reads = 0, inserts = 0, released = false;
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ").trim();
      let rows: unknown[] = [];
      if (q === "BEGIN") snapshot = structuredClone(state);
      else if (q === "ROLLBACK") state = snapshot;
      else if (q.includes('SELECT u.role AS "systemRole"')) {
        reads++;
        rows = options.revoked && reads > 1 ? [] : [{ systemRole: "user", memberRole: options.admin === false ? "member" : "owner", memberId: "actor-member" }];
      } else if (q.includes("to_regclass")) rows = [{ ready: true }];
      else if (q.startsWith('SELECT enabled FROM "retailOrganizationConfig"')) rows = [{ enabled: true }];
      else if (q.startsWith('SELECT c.capability FROM "retailAssignment"')) rows = (options.caps ?? ["retail:stock:adjust", "retail:stock:transfer", "retail:read"]).map(capability => ({ capability }));
      else if (q.startsWith('SELECT active FROM "retailLocation"')) rows = args[1] === "org" && ["a", "b"].includes(String(args[0])) ? [{ active: options.archived !== args[0] }] : [];
      else if (q.startsWith('SELECT c.capability FROM "retailAssignmentCapability"')) rows = options.allowedLocations?.includes(String(args[2])) ? (options.caps ?? []).map(capability => ({ capability })) : [];
      else if (q.startsWith('SELECT id, "requestFingerprint"')) rows = state.operations.filter(o => o.organizationId === args[0] && o.idempotencyKey === args[1]);
      else if (q.startsWith('SELECT r.id FROM "inventoryItem"')) rows = options.inactiveItem || options.missingItem || args[0] !== "retail" || args[1] !== "org" ? [] : [{ id: "retail" }];
      else if (q.startsWith('INSERT INTO "retailStockBalance"')) {
        const locationId = String(args[2]);
        state.balances[locationId] ??= { id: String(args[0]), quantity: 0 };
      } else if (q.startsWith('SELECT id, quantity FROM "retailStockBalance"')) rows = state.balances[String(args[1])] ? [state.balances[String(args[1])]] : [];
      else if (q.startsWith('INSERT INTO "retailStockOperation"')) state.operations.push({ id: String(args[0]), organizationId: String(args[1]), idempotencyKey: String(args[2]), requestFingerprint: String(args[3]) });
      else if (q.startsWith('UPDATE "retailStockBalance"')) state.balances[String(args[1])].quantity = Number(args[2]);
      else if (q.startsWith('INSERT INTO "retailStockMovement"')) {
        inserts++;
        if (options.failMovement === inserts) throw new Error("movement failed");
        state.movements.push({ id: String(args[0]), operationId: String(args[1]), retailOrganizationVariantId: String(args[2]), locationId: String(args[3]), quantityDelta: Number(args[4]), quantityAfter: Number(args[5]), createdAt: new Date("2026-10-17T00:00:00Z") });
      } else if (q.startsWith('SELECT m.id, m."locationId"')) rows = state.movements.filter(m => m.operationId === args[0]).map(({ operationId, createdAt, ...movement }) => movement);
      else if (q.includes('INSERT INTO "revisionHistory"')) {
        if (options.auditFails) throw new Error("audit failed");
        state.audits++;rows = [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }];
      } else if (q.startsWith('SELECT b.id,')) rows = Object.entries(state.balances).filter(([key, row]) => key === args[1] && (args[2] == null || row.id > String(args[2]))).map(([locationId, row]) => ({ ...row, locationId, retailOrganizationVariantId: "retail" }));
      else if (q.startsWith('SELECT m.id, m."operationId"')) rows = state.movements.filter(m => m.locationId === args[1]);
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const plugin = retail({ pool: db as unknown as Pool, catalog: {} as never, enabled: options.enabled !== false });
  const context = { session: { user: { id: "actor" }, session: {} } }, endpoints = plugin.endpoints!;
  const adjust = (body = {}) => endpoints.adjustRetailStock({ body: { organizationId: "org", retailOrganizationVariantId: "retail", idempotencyKey: "request-1", locationId: "a", quantityDelta: 3, reason: "Physical count", ...body }, context });
  const transfer = (body = {}) => endpoints.transferRetailStock({ body: { organizationId: "org", retailOrganizationVariantId: "retail", idempotencyKey: "request-1", sourceLocationId: "a", destinationLocationId: "b", quantity: 4, reason: "Move to shop", ...body }, context });
  return { adjust, transfer, plugin, calls, endpoints, context, state: () => state, released: () => released };
}
const status = (code: number) => (error: unknown) => (error as { statusCode: number }).statusCode === code;

test("adjustments update a balance, append history and audit in one transaction", async () => {
  const h = harness();
  const result = await h.adjust() as { replayed: boolean; movements: Movement[] };
  assert.equal(result.replayed, false);assert.equal(h.state().balances.a.quantity, 13);
  assert.equal(h.state().movements.length, 1);assert.equal(h.state().operations.length, 1);assert.equal(h.state().audits, 1);
  assert.equal(result.movements[0].quantityAfter, 13);assert.equal(h.calls.at(-1)!.sql, "COMMIT");assert.equal(h.released(), true);
});
test("negative adjustment is allowed while balance remains nonnegative", async () => {
  const h = harness();await h.adjust({ quantityDelta: -10 });assert.equal(h.state().balances.a.quantity, 0);
});
test("missing balance starts at zero only as part of a successful adjustment", async () => {
  const h = harness({}, {});await h.adjust();assert.equal(h.state().balances.a.quantity, 3);
  const denied = harness({}, {});await assert.rejects(() => denied.adjust({ quantityDelta: -1 }), status(409));assert.deepEqual(denied.state().balances, {});
});
test("transfer conserves total stock and records both sides under one operation", async () => {
  const h = harness();const result = await h.transfer() as { operationId: string };
  assert.equal(h.state().balances.a.quantity, 6);assert.equal(h.state().balances.b.quantity, 6);
  assert.equal(h.state().movements.reduce((sum, m) => sum + m.quantityDelta, 0), 0);
  assert.equal(h.state().movements.length, 2);assert.ok(h.state().movements.every(m => m.operationId === result.operationId));assert.equal(h.state().audits, 1);
});
test("reverse-direction transfers still lock balances in deterministic order", async () => {
  const h = harness();await h.transfer({ sourceLocationId: "b", destinationLocationId: "a", quantity: 1 });
  const locks = h.calls.filter(c => c.sql.startsWith('SELECT id, quantity FROM "retailStockBalance"'));
  assert.deepEqual(locks.map(c => c.args[1]), ["a", "b"]);
});
for (const action of ["adjust", "transfer"] as const) {
  test(action + " retry returns original receipt without moving stock or duplicating audit", async () => {
    const h = harness();const original = await h[action]() as { operationId: string; movements: Movement[] };
    const after = structuredClone(h.state());const retry = await h[action]() as { operationId: string; replayed: boolean; movements: Movement[] };
    assert.equal(retry.operationId, original.operationId);assert.equal(retry.replayed, true);assert.deepEqual(retry.movements, original.movements);assert.deepEqual(h.state(), after);
  });
}
test("idempotency keys cannot be reused for different quantities, reasons or operation kinds", async () => {
  const h = harness();await h.adjust();const after = structuredClone(h.state());
  await assert.rejects(() => h.adjust({ quantityDelta: 4 }), status(409));
  await assert.rejects(() => h.adjust({ reason: "Different reason" }), status(409));
  await assert.rejects(() => h.transfer(), status(409));assert.deepEqual(h.state(), after);
});
for (const options of [{ auditFails: true }, { failMovement: 2 }]) {
  test("transfer rolls back balances, operation and both movements on failure: " + JSON.stringify(options), async () => {
    const h = harness(options);const before = structuredClone(h.state());
    await assert.rejects(() => h.transfer(), /failed/);assert.deepEqual(h.state(), before);assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  });
}
test("insufficient source stock and destination overflow leave every balance unchanged", async () => {
  for (const quantities of [{ a: 1, b: 2 }, { a: 10, b: 2_147_483_647 }]) {
    const h = harness({}, quantities);const before = structuredClone(h.state());
    await assert.rejects(() => h.transfer(), status(409));assert.deepEqual(h.state(), before);
  }
});
for (const [options, body, code] of [
  [{ admin: false, caps: ["retail:read"] }, {}, 403],
  [{ admin: false, caps: ["retail:stock:transfer"], allowedLocations: ["a"] }, {}, 403],
  [{ admin: false, caps: ["retail:stock:transfer"], allowedLocations: ["b"] }, {}, 403],
  [{ archived: "b" }, {}, 403], [{ revoked: true }, {}, 403],
  [{}, { destinationLocationId: "foreign" }, 404],
  [{ inactiveItem: true }, {}, 404], [{ missingItem: true }, {}, 404],
] as [Options, Record<string, unknown>, number][]) {
  test("transfer rejects unauthorized location, enrollment or revocation: " + JSON.stringify([options, body]), async () => {
    const h = harness(options);const before = structuredClone(h.state());
    await assert.rejects(() => h.transfer(body), status(code));assert.deepEqual(h.state(), before);
    assert.equal(h.calls.some(c => c.sql.startsWith('INSERT INTO "retailStockOperation"')), false);
  });
}
test("transfer with explicit grants at both locations succeeds without administrator privilege", async () => {
  const h = harness({ admin: false, caps: ["retail:stock:transfer"], allowedLocations: ["a", "b"] });await h.transfer();assert.equal(h.state().movements.length, 2);
});
test("both transfer location checks precede every write and follow organization serialization", async () => {
  const h = harness();await h.transfer();
  const lock = h.calls.findIndex(c => c.args.includes("retail:authorization:org"));
  const checks = h.calls.map((c, i) => c.sql.startsWith('SELECT active FROM "retailLocation"') ? i : -1).filter(i => i >= 0);
  const write = h.calls.findIndex(c => c.sql.startsWith("INSERT"));
  assert.equal(checks.length, 2);assert.ok(checks.every(i => i > lock && i < write));
});
for (const body of [{ quantityDelta: 0 }, { quantityDelta: 1.5 }, { quantityDelta: 2_147_483_648 }, { reason: " " }, { idempotencyKey: "bad key" }]) {
  test("invalid adjustment is rejected before SQL: " + JSON.stringify(body), async () => {
    const h = harness();await assert.rejects(() => h.adjust(body), status(400));assert.equal(h.calls.length, 0);
  });
}
test("self-transfer and fractional transfer are rejected before SQL", async () => {
  const h = harness();await assert.rejects(() => h.transfer({ destinationLocationId: "a" }), status(400));await assert.rejects(() => h.transfer({ quantity: 0.5 }), status(400));assert.equal(h.calls.length, 0);
});
test("stock reads require location read access independently of adjustment permission", async () => {
  const denied = harness({ admin: false, caps: ["retail:stock:adjust"], allowedLocations: ["a"] });
  await assert.rejects(() => denied.endpoints.listRetailStockBalances({ query: { organizationId: "org", locationId: "a" }, context: denied.context }), status(403));
  const h = harness();await h.adjust();
  const result = await h.endpoints.listRetailStockBalances({ query: { organizationId: "org", locationId: "a" }, context: h.context }) as { balances: Balance[] };
  assert.equal(result.balances[0].quantity, 13);
  await h.endpoints.listRetailStockMovements({ query: { organizationId: "org", locationId: "a" }, context: h.context });
  assert.equal(h.calls.at(-1)!.args[0], "org");assert.equal(h.calls.at(-1)!.args[1], "a");
});
test("stock history pagination requires a complete time/id cursor", async () => {
  const h = harness();await assert.rejects(() => h.endpoints.listRetailStockMovements({ query: { organizationId: "org", locationId: "a", before: "2026-10-17T00:00:00Z" }, context: h.context }), status(400));assert.equal(h.calls.length, 0);
});
test("registration disabled blocks stock without database queries", async () => {
  const h = harness({ enabled: false });await assert.rejects(() => h.adjust(), status(403));assert.equal(h.calls.length, 0);
});
test("stock arithmetic rejects corrupt and out-of-range balances", () => {
  for (const [current, delta] of [[-1, 1], [0, -1], [1, 0], [1, 0.5], [2_147_483_647, 1]]) assert.throws(() => stockQuantityAfter(current, delta), status(409));
  assert.equal(stockQuantityAfter(1, -1), 0);
});
test("fingerprint ignores object property order and changes with direction", () => {
  const a = { organizationId: "org", idempotencyKey: "one", retailOrganizationVariantId: "retail", reason: "Move", kind: "transfer" as const, quantity: 1, sourceLocationId: "a", destinationLocationId: "b" };
  assert.equal(stockFingerprint(a), stockFingerprint({ ...a, idempotencyKey: "two" }));
  assert.notEqual(stockFingerprint(a), stockFingerprint({ ...a, sourceLocationId: "b", destinationLocationId: "a" }));
});
test("stock schemas pass the real Better Auth validator and retain ledger references", () => {
  const h = harness();assert.doesNotThrow(() => getAuthTables({ plugins: [h.plugin] }));
  const schema = h.plugin.schema!;assert.equal(schema.retailStockMovement.fields.operationId.references?.onDelete, "restrict");
  assert.equal(schema.retailStockBalance.fields.retailOrganizationVariantId.references?.model, "retailOrganizationVariant");
  assert.equal(schema.retailStockOperation.fields.actorUserId.references?.onDelete, "restrict");
});
