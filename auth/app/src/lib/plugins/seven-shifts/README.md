# 7shifts core Better Auth plugin

Defines the normalized 7shifts workforce model shared by the CSV importer, API synchronizer, schedule integration, and NiteOwl application-permission mapping.

## Registration

```ts
sevenShifts({ pool })
```

Register this plugin whenever the 7shifts ingestion/schedule features are enabled because those features depend on its normalized workforce rows.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/seven-shifts/access` | Return signed-in user's location-scoped NiteOwl application permissions. |
| `GET` | `/seven-shifts/member-status?organizationId=...` | Return member/employee status for an organization available to the caller. |

## Data model

- `sevenShiftsEmployee`
- `sevenShiftsLocation`
- `sevenShiftsDepartment`
- `sevenShiftsRole`
- `sevenShiftsAssignment`

Records retain upstream IDs and timestamps so CSV and API imports can converge on the same normalized representation.

## Current role-to-app permission mapping

`permissions.ts` currently recognizes these NiteOwl app IDs:

```text
counter
unifi
schedules
```

Current role mapping:

| 7shifts role | NiteOwl app permissions |
| --- | --- |
| `Manager` | Counter, UniFi, Schedules |
| `Door` | Counter |
| `Counter Viewer` | Counter |
| `Cover Charge` | Counter |

Unknown role names grant no application permissions.

Application-specific Better Auth plugins may impose additional authorization requirements. A 7shifts role mapping should not be treated as a substitute for organization/application access checks unless the consuming path explicitly combines them.
