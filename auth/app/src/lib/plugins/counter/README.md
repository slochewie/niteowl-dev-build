# Counter Better Auth plugin

Provides organization-scoped authorization, Counter definitions, assignments, and trusted runtime provisioning for the Counter application.

The plugin stores Counter definitions, per-counter user assignments, delegated Counter Managers, and exposes both session-authenticated administration endpoints and internal service authorization/provisioning endpoints.

## Registration

```ts
counterAccess({
  pool,
  internalSecret: process.env.COUNTER_AUTH_INTERNAL_SECRET,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

- `counter` — named Counter instances belonging to an organization, including capacity behavior such as `maxCapacity` and `allowNegative`.
- `counterAssignment` — per-user/per-counter enabled assignment.
- `counterManager` — delegated organization-level Counter Manager flag.

Application checks also respect organization enabled state, banned users, and active organization memberships.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/counter/list` | List Counter definitions for an organization. |
| `POST` | `/counter/create` | Create a Counter. |
| `PATCH` | `/counter/update` | Rename, configure, or enable/disable a Counter. |
| `DELETE` | `/counter/delete` | Delete a Counter and its assignments. |
| `GET` | `/counter/assignments` | List active per-counter assignments. |
| `PATCH` | `/counter/assignments` | Enable/disable one user's access to one Counter. |
| `GET` | `/counter/management-access` | Return whether the caller can manage Counter assignments/managers. |
| `GET` | `/counter/manager-list` | List Counter Managers and global admins in the organization. |
| `PATCH` | `/counter/manager` | Enable/disable delegated Counter Manager status. |
| `GET` | `/counter/access` | Test the signed-in user's access to one Counter. |
| `GET` | `/counter/access/internal` | Internal-secret access check for a specified user and Counter. |
| `GET` | `/counter/available` | List the signed-in user's available organizations/Counters. |
| `GET` | `/counter/available/internal` | Internal-secret organization/Counter availability for a user. |
| `GET` | `/counter/provisioning/internal` | Return trusted Counter runtime provisioning. |

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

`/counter/provisioning/internal` requires `organizationId` and `counterId`. It validates that the Counter and organization are enabled, then returns:

- organization identity;
- Counter identity and capacity settings;
- the organization's enabled MQTT assignment and broker connection;
- zero or more enabled WiFi networks.

### Required MQTT configuration

Counter runtime provisioning requires an enabled `mqttOrganizationSource` whose broker source is also enabled. If no enabled MQTT configuration exists, provisioning fails with HTTP `409`.

The MQTT response includes:

- native MQTT `host`, `port`, and `protocol`;
- optional `websocketHost`, `websocketPort`, and `websocketProtocol`;
- username and decrypted password for trusted backend use;
- the organization `topicPrefix`.

The Counter backend can therefore use WSS (for example through a TLS reverse proxy) without putting broker credentials in browser code.

### Optional WiFi configuration

WiFi is deliberately optional. Provisioning returns `wifiNetworks: []` when an organization has no enabled saved networks.

Counter App and MQTT do not depend on WiFi. WiFi data exists for managed hardware/device provisioning and may be used later by physical Counter devices such as M5Stack/M5 Stopwatch hardware.

Saved WiFi passwords are decrypted only for this trusted internal response. They must never be forwarded to an untrusted browser client.

## MQTT topic compatibility

Organization-scoped MQTT assignments normally use a prefix such as:

```text
organizations/<organizationId>/
```

Counter App also retains compatibility with historical counters that predate organization-scoped topics. Legacy compatibility is handled by the Counter backend; Auth continues to provision the organization's configured MQTT assignment and Counter identity.

## Plugin catalog count

The Plugins & APIs catalog counts an organization as Counter-enabled when it has at least one enabled Counter definition. The count is derived from Counter configuration rather than `organizationIntegration.enabled`.
