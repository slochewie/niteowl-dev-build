import assert from "node:assert/strict";
import test from "node:test";
import { APIError } from "better-auth/api";
import type { Pool } from "pg";
import { inventoryAccess } from "./index.ts";
import type { CatalogMergeParticipant } from "./merge-participants.ts";

function harness({ duplicateVariant = true, duplicateOrganization = true, failParticipant = false } = {}) {
  const calls: { sql: string; args: unknown[] }[] = [];
  let released = false;
  let participantCalls = 0;
  const source = {
    id: "source-ov", organizationId: "org", enabled: true, exportToToast: false,
    priceOverrideCents: 100, happyHourPriceCents: 50, doublePriceCents: 175,
    toastNameOverride: "Name", toastCategoryOverride: "Beer",
    toastDestinationOverride: "Bottles", toastSlot: "slot",
  };
  const db = {
    async query(sql: string, args: unknown[] = []) {
      calls.push({ sql, args });
      const q = sql.replace(/\s+/g, " ");
      let rows: object[] = [];
      if (q.includes("SELECT v.id") && q.includes("to_jsonb")) rows = [];
      else if (q.includes("FROM organization")) rows = [{ id: "org" }];
      else if (q.includes('FROM "user"')) rows = [{ role: "admin" }];
      else if (q.includes('FROM "inventoryItem"') && q.includes("ANY")) rows = [{ id: "source", name: "Source" }, { id: "target", name: "Target" }];
      else if (q.includes('FROM "inventoryItemVariant"') && q.includes('ORDER BY "createdAt"')) rows = [{ id: "source-v", kind: "standard", sizeOz: null, packageType: null, name: null }];
      else if (q.includes('FROM "inventoryItemVariant"') && q.includes("LIMIT 1")) rows = duplicateVariant ? [{ id: "target-v" }] : [];
      else if (q.includes('SELECT * FROM "inventoryOrganizationVariant"')) rows = [source];
      else if (q.includes('SELECT id FROM "inventoryOrganizationVariant"')) rows = duplicateOrganization ? [{ id: "target-ov" }] : [];
      return { rows, rowCount: rows.length };
    },
    async connect() { return db; },
    release() { released = true; },
  };
  const participant: CatalogMergeParticipant = {
    async beforeOrganizationVariantDelete(client, merge) {
      participantCalls++;
      assert.equal(client, db);
      assert.deepEqual(merge, { organizationId: "org", sourceOrganizationVariantId: "source-ov", targetOrganizationVariantId: "target-ov" });
      assert.equal(calls.some(c => c.sql.includes('DELETE FROM "inventoryOrganizationVariant"')), false);
      if (failParticipant) throw new APIError("CONFLICT", { message: "Retail conflict" });
    },
  };
  const endpoint = inventoryAccess({ pool: db as unknown as Pool, mergeParticipants: [participant] }).endpoints!.mergeInventoryItems;
  const run = () => endpoint({ body: { organizationId: "org", sourceItemId: "source", targetItemId: "target" }, context: { session: { user: { id: "admin" }, session: {} } } });
  return { calls, run, released: () => released, participantCalls: () => participantCalls };
}

test("duplicate parents notify participants before deletion and commit ID mappings", async () => {
  const h = harness();
  const result = await h.run() as { merged: boolean; organizationVariantMappings: object[] };
  assert.equal(result.merged, true);
  assert.equal(h.participantCalls(), 1);
  assert.deepEqual(result.organizationVariantMappings, [{ organizationId: "org", sourceOrganizationVariantId: "source-ov", targetOrganizationVariantId: "target-ov" }]);
  assert.equal(h.calls.at(-1)!.sql, "COMMIT");
  assert.equal(h.released(), true);
  const update = h.calls.find(c => c.sql.includes('enabled = enabled OR $1'))!;
  const placeholders = [...update.sql.matchAll(/\$(\d+)/g)].map(m => Number(m[1]));
  assert.equal(Math.max(...placeholders), update.args.length);
  assert.equal(update.args.length, 11);
  assert.deepEqual(update.args.slice(0, 9), [true, false, 100, 50, 175, "Name", "Beer", "Bottles", "slot"]);
  assert.equal(update.args[10], "target-ov");
});

test("participant conflict rolls back before parent deletion or commit", async () => {
  const h = harness({ failParticipant: true });
  await assert.rejects(h.run, (e: unknown) => (e as { statusCode: number }).statusCode === 409);
  assert.equal(h.calls.at(-1)!.sql, "ROLLBACK");
  assert.equal(h.calls.some(c => c.sql.includes('DELETE FROM "inventoryOrganizationVariant"') || c.sql === "COMMIT"), false);
  assert.equal(h.released(), true);
});

test("organization parent retained during variant consolidation needs no rebind", async () => {
  const h = harness({ duplicateOrganization: false });
  const result = await h.run() as { mergedVariants: number; organizationVariantMappings: object[] };
  assert.equal(result.mergedVariants, 1);
  assert.equal(h.participantCalls(), 0);
  assert.deepEqual(result.organizationVariantMappings, []);
  assert.equal(h.calls.some(c => c.sql.includes('DELETE FROM "inventoryOrganizationVariant"')), false);
});

test("moving a shared variant preserves its organization and Retail identities", async () => {
  const h = harness({ duplicateVariant: false });
  const result = await h.run() as { movedVariants: number; mergedVariants: number };
  assert.equal(result.movedVariants, 1);
  assert.equal(result.mergedVariants, 0);
  assert.equal(h.participantCalls(), 0);
  assert.equal(h.calls.some(c => c.sql.includes('DELETE FROM "inventoryItemVariant"')), false);
});
