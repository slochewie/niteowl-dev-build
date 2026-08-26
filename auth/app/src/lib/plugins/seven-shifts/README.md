# 7shifts core Better Auth plugin

Defines the normalized 7shifts workforce model shared by the CSV and API ingestion plugins. It also maps 7shifts roles to NiteOwl application permissions.

## Registration

```ts
import { sevenShifts } from "./src/lib/plugins/seven-shifts/index.js";

const plugins = [sevenShifts({ pool })];
```

Register this plugin whenever either 7shifts ingestion plugin is enabled, because those plugins write to its normalized tables.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/seven-shifts/access` | Return the signed-in user's location-scoped NiteOwl permissions. |
| `GET` | `/seven-shifts/member-status?organizationId=...` | Return member/employee status for an organization the caller belongs to. |

## Data model

The plugin declares models for employees, locations, departments, roles, and employee/location/role assignments. Records retain upstream identifiers and source timestamps so API and CSV imports can converge on the same representation.

## Permission mapping

`permissions.ts` maps exact 7shifts role names to application capabilities. Current application IDs are `counter` and `unifi`. Unknown roles grant no application access.

`access.ts` exposes helpers to list a user's active location permissions and test a specific application/organization permission. When adding a role, update the mapping deliberately and test both allowed and denied cases.

## Security

Location access is derived from active employees, locations, roles, and organization assignments. Do not treat an upstream role name alone as authorization without the organization and location checks performed by this plugin.

