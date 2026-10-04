# Network Status Better Auth plugin

Stores organization-scoped Network Status access and delegated-management permissions.

## Registration

```ts
networkStatus({
  pool,
  internalSecret: process.env.NETWORK_STATUS_INTERNAL_SECRET,
})
```

## Data model

`networkStatusAssignment` is unique by organization/user and stores:

- `accessEnabled`;
- `assignmentManagerEnabled`;
- `fabricOverviewEnabled`;
- created/updated timestamps.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/network-status/assignments` | List active organization members and Network Status assignment state. |
| `GET` | `/network-status/access` | Test signed-in user's access. |
| `PATCH` | `/network-status/access` | Enable/disable a user's access. |
| `PATCH` | `/network-status/manager` | Enable/disable delegated Network Status Manager status. |
| `PATCH` | `/network-status/fabric-overview` | Enable/disable Fabric Overview access. |
| `GET` | `/network-status/access/internal` | Internal-secret access check for a specified user. |
| `GET` | `/network-status/management-access` | Return assignment/manager administration capability. |

## Authorization

Global admins have Network Status access. Non-global users must belong to an enabled organization with an active membership and an enabled assignment.

Organization owners/admins may manage delegated Network Status Managers. Delegated managers can manage ordinary assignments but cannot use that delegated role to rewrite protected manager/system-admin state.

The internal access response also returns organization name and Fabric Overview access for the requesting application.
