import assert from "node:assert/strict";
import test from "node:test";
import type { Pool } from "pg";
import { inventoryAccess } from "./index.ts";

function harness({ systemAdmin = true, banned = false, ready = true, alreadyEligible = false, auditFails = false } = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  let released = false;
  const current = { id: "variant", inventoryItemId: "item", active: true, menuEligible: alreadyEligible, variationKey: '{"size":"m"}' };
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ");
      let rows: object[] = [];
      if (q.includes("FROM organization")) rows = [{ id: "org" }];
      else if (q.includes('SELECT role FROM "user"')) rows = [{ role: systemAdmin ? "admin" : "user" }];
      else if (q.includes('SELECT id FROM "user"')) rows = banned ? [] : [{ id: "user" }];
      else if (q.includes("FROM member m")) rows = [{ memberId: "member", role: "owner" }];
      else if (q.includes("information_schema")) rows = [{ ready }];
      else if (q.includes('SELECT "inventoryItemId"')) rows = [{ inventoryItemId: "item" }];
      else if (q.includes('SELECT id FROM "inventoryItem"')) rows = [{ id: "item" }];
      else if (q.includes('SELECT * FROM "inventoryItemVariant"')) rows = [current];
      else if (q.includes('UPDATE "inventoryItemVariant"')) rows = [{ ...current, menuEligible: true }];
      else if (q.includes('INSERT INTO "revisionHistory"')) {
        if (auditFails) throw new Error("audit failed");
        rows = [{ id: "revision", revision: 1, snapshot: args[5], metadata: args[6] }];
      }
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const endpoint = inventoryAccess({ pool: db as unknown as Pool }).endpoints!.promoteInventoryVariantForMenu;
  const run = () => endpoint({ body: { organizationId: "org", inventoryItemVariantId: "variant", reason: "Approved menu use" }, context: { session: { user: { id: "user" }, session: {} } } });
  return { run, calls, released: () => released };
}

test("system-admin promotion is audited and leaves organization menu settings untouched", async () => {
  const h = harness();
  assert.deepEqual(await h.run(), { inventoryItemVariantId: "variant", menuEligible: true, changed: true });
  const update = h.calls.find(c => c.sql.includes('UPDATE "inventoryItemVariant"'))!;
  assert.match(update.sql, /"menuEligible" = true/);
  assert.equal(h.calls.some(c => c.sql.includes('UPDATE "inventoryOrganizationVariant"') || c.sql.includes('INSERT INTO "inventoryOrganizationVariant"')), false);
  const audit = h.calls.find(c => c.sql.includes('INSERT INTO "revisionHistory"'))!;
  assert.equal(audit.args[4], "user");
  assert.deepEqual(JSON.parse(audit.args[6] as string), { action: "promote-to-menu", previousMenuEligible: false, reason: "Approved menu use" });
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
  assert.equal(h.released(), true);
});

test("organization owners cannot promote globally shared variants", async () => {
  const h = harness({ systemAdmin: false });
  assert.deepEqual(await h.run(), { error: "Forbidden" });
  assert.equal(h.calls.some(c => c.sql === "BEGIN"), false);
});

for (const [settings, status] of [[{ banned: true }, 403], [{ ready: false }, 503]] as const) {
  test("promotion rejects " + JSON.stringify(settings) + " without writes", async () => {
    const h = harness(settings);
    await assert.rejects(h.run, (e: unknown) => (e as { statusCode: number }).statusCode === status);
    assert.equal(h.calls.some(c => /UPDATE "|INSERT INTO/.test(c.sql)), false);
    assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  });
}

test("repeat promotion does not create duplicate audit revisions", async () => {
  const h = harness({ alreadyEligible: true });
  assert.deepEqual(await h.run(), { inventoryItemVariantId: "variant", menuEligible: true, changed: false });
  assert.equal(h.calls.some(c => /UPDATE "|INSERT INTO/.test(c.sql)), false);
});

test("audit failure rolls back promotion and releases the transaction", async () => {
  const h = harness({ auditFails: true });
  await assert.rejects(h.run, /audit failed/);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql === "COMMIT"), false);
  assert.equal(h.released(), true);
});
