# Integration Manager Better Auth plugin

Stores organization-level enablement and synchronization policy for integrations shown in the Auth administration catalog.

Integration Manager is a control plane. Integration-specific plugins remain responsible for credentials, external API calls, persistence, and synchronization behavior.

## Registration

```ts
integrationManager({ pool })
```

## Available catalog integrations

`registry.ts` currently marks these IDs as available:

```text
seven-shifts-csv
seven-shifts-api
unifi-api
glauth
unifi-ldap
```

Planned catalog entries currently include:

```text
toast-api
paychex-api
wifi
mqtt
counter
```

The planned `counter` catalog entry refers to future Integration Manager configuration for Counter infrastructure/settings. It is separate from the already-active `counter` Better Auth application-access plugin.

## Synchronization directions

Supported policy values are:

```text
to-better-auth
from-better-auth
bidirectional
```

An integration implementation must still enforce the selected direction; storing a direction in Integration Manager does not automatically constrain unrelated code.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/integration-manager/organizations` | List organizations and their state for an integration. |
| `GET` | `/integration-manager/organization` | Return all integration settings for an organization. |
| `POST` | `/integration-manager/set-enabled` | Enable/disable an integration for an organization. |
| `POST` | `/integration-manager/set-configuration-source` | Choose global vs organization-specific configuration. |
| `POST` | `/integration-manager/set-sync-direction` | Set allowed synchronization direction. |

All routes require a session and enforce global/organization management checks.

## Data model

`organizationIntegration` links an organization to a registered integration ID and stores:

- `enabled`;
- `useGlobalConfiguration`;
- `syncDirection`.

## Adding a new catalog integration

1. Add a stable ID and catalog metadata in `registry.ts`.
2. Move it into `INTEGRATION_IDS` only when the implementation is actually available.
3. Implement the integration-specific Better Auth plugin/schema.
4. Add admin configuration UI.
5. Enforce enablement and sync direction in every synchronization path.
