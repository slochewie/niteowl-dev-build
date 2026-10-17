import assert from "node:assert/strict";
import test from "node:test";
import type { PoolClient } from "pg";
import { retailMergeParticipant } from "./merge-participant.ts";

const merge = { organizationId: "org", sourceOrganizationVariantId: "source", targetOrganizationVariantId: "target" };
function harness({ deployed = true, parentCount = 2, source = true, target = false, updated = true } = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      if (sql.includes("to_regclass")) return { rows: [{ ready: deployed }], rowCount: 1 };
      if (sql.includes('FROM "inventoryOrganizationVariant"')) return { rows: Array.from({ length: parentCount }, (_, i) => ({ id: i === 0 ? "source" : "target" })), rowCount: parentCount };
      if (sql.includes('FROM "retailOrganizationVariant"')) {
        const rows = [
          ...(source ? [{ id: "source-retail", inventoryOrganizationVariantId: "source" }] : []),
          ...(target ? [{ id: "target-retail", inventoryOrganizationVariantId: "target" }] : []),
        ];
        return { rows, rowCount: rows.length };
      }
      return { rows: updated ? [{ id: "source-retail" }] : [], rowCount: updated ? 1 : 0 };
    },
  } as unknown as PoolClient;
  return { calls, db };
}

test("pre-migration Inventory merges do not query absent Retail tables", async () => {
  const h = harness({ deployed: false });
  await retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge);
  assert.equal(h.calls.length, 1);
});

test("source-only enrollment retains its ID and enabled state while rebinding", async () => {
  const h = harness();
  await retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge);
  const update = h.calls.at(-1)!;
  assert.deepEqual(update.args, ["source-retail", "source", "target"]);
  assert.match(update.sql, /RETURNING id/);
  assert.doesNotMatch(update.sql, /enabled|DELETE|INSERT/);
  assert.deepEqual(h.calls[1].args, [["source", "target"], "org"]);
  assert.match(h.calls[1].sql, /FOR UPDATE/);
  assert.match(h.calls[2].sql, /FOR UPDATE/);
});

test("target-only enrollment needs no modification", async () => {
  const h = harness({ source: false, target: true });
  await retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge);
  assert.equal(h.calls.some(c => /UPDATE|DELETE|INSERT/.test(c.sql.replace(/FOR UPDATE/g, ""))), false);
});

test("duplicate enrollments report a conflict without erasing either identity", async () => {
  const h = harness({ source: true, target: true });
  await assert.rejects(() => retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
  assert.equal(h.calls.some(c => c.sql.startsWith("UPDATE") || c.sql.startsWith("DELETE")), false);
});

test("missing or foreign-organization parent fails closed", async () => {
  const h = harness({ parentCount: 1 });
  await assert.rejects(() => retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
  assert.equal(h.calls.length, 2);
});

test("failed enrollment rebind aborts the merge", async () => {
  const h = harness({ updated: false });
  await assert.rejects(() => retailMergeParticipant.beforeOrganizationVariantDelete(h.db, merge), (e: unknown) => (e as { statusCode: number }).statusCode === 409);
});

test("identical parent IDs are a no-op", async () => {
  const h = harness();
  await retailMergeParticipant.beforeOrganizationVariantDelete(h.db, { ...merge, targetOrganizationVariantId: "source" });
  assert.equal(h.calls.length, 0);
});
