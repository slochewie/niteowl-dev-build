# 7shifts Schedules Better Auth plugin

Synchronizes published 7shifts schedule data into local PostgreSQL rows so NiteOwl applications can read stable organization/week schedules without calling 7shifts on every request.

The plugin uses the existing encrypted 7shifts API source configuration and organization/location mappings.

## Registration

```ts
sevenShiftsSchedules({
  pool,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

`sevenShiftsScheduledShift` persists one upstream 7shifts shift and includes:

- source and NiteOwl organization IDs;
- 7shifts shift/location/user/department/role IDs;
- optional linked Better Auth user ID;
- station metadata;
- location timezone and schedule date;
- scheduled start/end;
- closing/business-decline flags;
- notes/draft/notified/open/unassigned state;
- publish/attendance/late metadata;
- serialized break data;
- upstream deleted/soft-delete timestamps;
- upstream created/updated timestamps;
- local last-seen/created/updated timestamps.

`sevenShiftsShiftId` is unique.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/seven-shifts-schedules/preview` | Global-admin preview of upstream shifts for a source/date range. Limited to 31 days. |
| `GET` | `/seven-shifts-schedules/organizations` | List organizations available to the caller for schedule use. |
| `GET` | `/seven-shifts-schedules/week` | Read a locally persisted organization schedule week. |
| `GET` | `/seven-shifts-schedules/sync-controls` | Return schedule sync state/control metadata. |
| `POST` | `/seven-shifts-schedules/check-updates` | Check upstream schedule update state. |
| `POST` | `/seven-shifts-schedules/sync-organization` | Synchronize one organization's mapped location. |
| `POST` | `/seven-shifts-schedules/sync` | Run broader schedule synchronization. |

## Mapping behavior

Schedule data is routed to a NiteOwl organization through `sevenShiftsApiOrganizationSource`, which maps a 7shifts source/location to an organization.

When possible, an upstream 7shifts user is linked to the corresponding Better Auth user through the normalized 7shifts workforce records. Open/unassigned shifts may not have a linked user.

## Consumers

The Auth console's Schedules page and Tip Calculator schedule import depend on this local schedule model.
