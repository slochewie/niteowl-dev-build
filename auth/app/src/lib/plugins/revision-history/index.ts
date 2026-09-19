import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import type { Pool, PoolClient } from "pg";

type RevisionHistoryOptions = {
  pool: Pool;
};

export type RevisionOperation =
  | "create"
  | "update"
  | "delete"
  | "restore";

export type AppendRevisionInput = {
  resourceType: string;
  resourceId: string;
  organizationId?: string | null;
  actorUserId: string;
  operation: RevisionOperation;
  snapshot: unknown;
  metadata?: unknown;
};

export type RevisionHistoryRow = {
  id: string;
  resourceType: string;
  resourceId: string;
  organizationId: string | null;
  revision: number;
  operation: RevisionOperation;
  actorUserId: string | null;
  snapshot: unknown;
  metadata: unknown;
  createdAt: Date;
};

type Queryable = Pick<Pool, "query">;

function serialize(value: unknown) {
  return JSON.stringify(value ?? null);
}

function parseJson(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function mapRevisionRow(row: RevisionHistoryRow): RevisionHistoryRow {
  return {
    ...row,
    revision: Number(row.revision),
    snapshot: parseJson(row.snapshot),
    metadata: parseJson(row.metadata),
  };
}

export async function appendRevisionInTransaction(
  client: PoolClient,
  input: AppendRevisionInput,
): Promise<RevisionHistoryRow> {
  await client.query(
    [
      "SELECT pg_advisory_xact_lock(",
      "  hashtextextended($1, 0)",
      ")",
    ].join("\n"),
    [input.resourceType + ":" + input.resourceId],
  );

  const result = await client.query<RevisionHistoryRow>(
    [
      'INSERT INTO "revisionHistory" (',
      "  id,",
      '  "resourceType",',
      '  "resourceId",',
      '  "organizationId",',
      "  revision,",
      "  operation,",
      '  "actorUserId",',
      "  snapshot,",
      "  metadata,",
      '  "createdAt"',
      ")",
      "SELECT",
      "  $8,",
      "  $1,",
      "  $2,",
      "  $3,",
      "  COALESCE(MAX(revision), 0) + 1,",
      "  $4,",
      "  $5,",
      "  $6::jsonb,",
      "  $7::jsonb,",
      "  CURRENT_TIMESTAMP",
      'FROM "revisionHistory"',
      'WHERE "resourceType" = $1',
      '  AND "resourceId" = $2',
      "RETURNING",
      "  id,",
      '  "resourceType",',
      '  "resourceId",',
      '  "organizationId",',
      "  revision,",
      "  operation,",
      '  "actorUserId",',
      "  snapshot,",
      "  metadata,",
      '  "createdAt"',
    ].join("\n"),
    [
      input.resourceType,
      input.resourceId,
      input.organizationId ?? null,
      input.operation,
      input.actorUserId,
      serialize(input.snapshot),
      serialize(input.metadata),
      randomUUID(),
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Failed to append revision");
  }

  return mapRevisionRow(row);
}

export async function appendRevision(
  db: Pool,
  input: AppendRevisionInput,
): Promise<RevisionHistoryRow> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const row = await appendRevisionInTransaction(
      client,
      input,
    );

    await client.query("COMMIT");
    return row;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
export async function listRevisions(
  db: Queryable,
  resourceType: string,
  resourceId: string,
): Promise<RevisionHistoryRow[]> {
  const result = await db.query<RevisionHistoryRow>(
    [
      'SELECT',
      '  id,',
      '  "resourceType",',
      '  "resourceId",',
      '  "organizationId",',
      '  revision,',
      '  operation,',
      '  "actorUserId",',
      '  snapshot,',
      '  metadata,',
      '  "createdAt"',
      'FROM "revisionHistory"',
      'WHERE "resourceType" = $1',
      '  AND "resourceId" = $2',
      'ORDER BY revision ASC',
    ].join("\n"),
    [resourceType, resourceId],
  );

  return result.rows.map(mapRevisionRow);
}

export async function getRevision(
  db: Queryable,
  resourceType: string,
  resourceId: string,
  revision: number,
): Promise<RevisionHistoryRow | null> {
  const result = await db.query<RevisionHistoryRow>(
    [
      'SELECT',
      '  id,',
      '  "resourceType",',
      '  "resourceId",',
      '  "organizationId",',
      '  revision,',
      '  operation,',
      '  "actorUserId",',
      '  snapshot,',
      '  metadata,',
      '  "createdAt"',
      'FROM "revisionHistory"',
      'WHERE "resourceType" = $1',
      '  AND "resourceId" = $2',
      '  AND revision = $3',
      'LIMIT 1',
    ].join("\n"),
    [resourceType, resourceId, revision],
  );

  const row = result.rows[0];
  return row ? mapRevisionRow(row) : null;
}

export const revisionHistory = ({
  pool: _pool,
}: RevisionHistoryOptions) =>
  ({
    id: "revision-history",

    schema: {
      revisionHistory: {
        modelName: "revisionHistory",

        fields: {
          resourceType: {
            type: "string",
            required: true,
            index: true,
          },

          resourceId: {
            type: "string",
            required: true,
            index: true,
          },

          organizationId: {
            type: "string",
            required: false,
            index: true,
            references: {
              model: "organization",
              field: "id",
              onDelete: "set null",
            },
          },

          revision: {
            type: "number",
            required: true,
          },

          operation: {
            type: "string",
            required: true,
          },

          actorUserId: {
            type: "string",
            required: false,
            index: true,
            references: {
              model: "user",
              field: "id",
              onDelete: "set null",
            },
          },

          snapshot: {
            type: "json",
            required: true,
          },

          metadata: {
            type: "json",
            required: false,
          },

          createdAt: {
            type: "date",
            required: true,
            defaultValue: () => new Date(),
          },
        },

        indexes: [
          {
            fields: ["resourceType", "resourceId", "revision"],
            unique: true,
          },
          {
            fields: ["resourceType", "resourceId"],
          },
          {
            fields: ["organizationId", "createdAt"],
          },
        ],
      },
    },
  }) satisfies BetterAuthPlugin;
