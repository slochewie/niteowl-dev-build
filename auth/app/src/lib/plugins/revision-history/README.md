# Revision History Better Auth plugin

Provides a reusable revision table and helper functions for features that need immutable resource snapshots.

This plugin is schema/helper infrastructure. It does not expose Better Auth HTTP endpoints by itself.

## Data model

`revisionHistory` stores:

- `resourceType`;
- `resourceId`;
- optional `organizationId`;
- monotonically increasing `revision` per resource;
- operation (`create`, `update`, `delete`, or `restore`);
- optional `actorUserId`;
- JSON snapshot;
- optional JSON metadata;
- creation timestamp.

A unique index covers `(resourceType, resourceId, revision)`.

## Exported helpers

- `appendRevisionInTransaction(client, input)` — append a revision within an existing PostgreSQL transaction.
- `appendRevision(pool, input)` — append a revision using its own transaction.
- `listRevisions(db, resourceType, resourceId)` — list all revisions in ascending revision order.
- `getRevision(db, resourceType, resourceId, revision)` — fetch one revision.

`appendRevisionInTransaction` uses a PostgreSQL advisory transaction lock on the logical resource key so concurrent writers cannot allocate the same next revision number.

## Usage guidance

When a resource mutation and its revision must be atomic, use `appendRevisionInTransaction` with the same transaction that changes the primary resource.

Snapshots should contain enough information to audit or restore the resource without depending on later mutable rows.
