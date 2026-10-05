# Counter Better Auth plugin

Provides organization-scoped authorization and configuration for the Counter application.

The plugin stores Counter definitions, per-counter user assignments, delegated Counter Managers, and exposes both session-authenticated administration endpoints and internal service authorization endpoints.

## Registration

```ts
counterAccess({
  pool,
  internalSecret: process.env.COUNTER_AUTH_INTERNAL_SECRET,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

- `counter` — named Counter instances belonging to an organization.
- `counterAssignment` — per-user/per-counter enabled assignment.
- `counterManager` — delegated organization-level Counter Manager flag.

Application checks also respect organization enabled state, banned users, and active organization memberships.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/counter/list` | List Counter definitions for an organization. |
| `POST` | `/counter/create` | Create a Counter. |
| `PATCH` | `/counter/update` | Rename or enable/disable a Counter. |
| `DELETE` | `/counter/delete` | Delete a Counter and its assignments. |
| `GET` | `/counter/assignments` | List active per-counter assignments. |
| `PATCH` | `/counter/assignments` | Enable/disable one user's access to one Counter. |
| `GET` | `/counter/management-access` | Return whether the caller can manage Counter assignments/managers. |
| `GET` | `/counter/manager-list` | List Counter Managers and global admins in the organization. |
| `PATCH` | `/counter/manager` | Enable/disable delegated Counter Manager status. |
| `GET` | `/counter/access` | Test the signed-in user's access to one Counter. |
| `GET` | `/counter/access/internal` | Internal-secret access check for a specified user and Counter. |
| `GET` | `/counter/available` | List signed-in user's available organizations/Counters. |
| `GET` | `/counter/available/internal` | Internal-secret organization/Counter availability for a user. |
| `GET` | `/counter/provisioning/internal` | Return trusted Counter, MQTT, and WiFi provisioning configuration. |

## Authorization

Global admins have application access without an explicit Counter assignment.

For non-global users, access requires:

- enabled organization;
- active Better Auth organization membership;
- non-banned user;
- enabled Counter;
- enabled `counterAssignment` for that Counter.

Organization owners/admins can manage Counter definitions and Counter Managers. Delegated Counter Managers can manage ordinary user assignments but are intentionally restricted from modifying their own assignment, other Counter Managers, or global administrators.

## Internal access

Internal routes require `COUNTER_AUTH_INTERNAL_SECRET` and are designed for trusted Counter backend calls. Never expose the shared secret to browser clients.

`/counter/provisioning/internal` requires `organizationId` and `counterId`. It returns the enabled Counter definition, the organization's enabled MQTT assignment, and enabled WiFi networks. MQTT and WiFi passwords are decrypted only for this trusted internal response and must never be forwarded to an untrusted browser client.
