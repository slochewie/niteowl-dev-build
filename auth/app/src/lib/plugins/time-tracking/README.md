# Time Tracking plugin

The Time Tracking plugin provides persistent, organization-scoped time entries
for the separate Time Tracking frontend. It uses Better Auth sessions and
organization memberships; it has no dependency on 7shifts.

## Authorization

Every endpoint requires `sessionMiddleware`. The plugin always derives the user
ID from the authenticated session and requires an active membership in an
enabled organization. Banned users and inactive memberships are rejected.

Users can list, create, update, and delete only their own entries. Update and
delete queries include the entry ID, organization ID, and authenticated user ID
so cross-organization and cross-user records are returned as not found.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/time-tracking/entries?organizationId=...` | List the current user's entries in an organization. |
| `POST` | `/time-tracking/entries/create` | Create an entry for the current user. |
| `POST` | `/time-tracking/entries/update` | Update one of the current user's entries. |
| `POST` | `/time-tracking/entries/delete` | Delete one of the current user's entries. |

Create bodies contain `organizationId`, `workDate`, `startTime`, `endTime`,
`endsNextDay`, and optional `notes`. Update bodies additionally contain
`entryId`. Delete bodies contain `organizationId` and `entryId`.

Dates use `YYYY-MM-DD` and times use 24-hour `HH:mm`. The server validates the
calendar date and times and calculates `durationMinutes`. Entries must have a
positive duration and cannot exceed 24 hours.

## Persistence and migration

The Better Auth plugin schema declares `timeEntry`, including cascading
references to `organization` and `user` and an index on organization, user, and
work date. Apply the schema with the repository's normal interactive Better
Auth CLI migration workflow and review the generated SQL before accepting it.

## Tests

Run the focused domain and authorization tests with:

```bash
npm test
```
