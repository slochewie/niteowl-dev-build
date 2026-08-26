# Integration Manager Better Auth plugin

Stores organization-level enablement and synchronization policy for NiteOwl integrations. It is the control plane used by the admin plugin catalog; integration-specific plugins remain responsible for their own credentials and synchronization logic.

## Registration

```ts
import { integrationManager } from "./src/lib/plugins/integration-manager/index.js";

const plugins = [integrationManager({ pool })];
```

## Integration registry

`registry.ts` is the canonical catalog. Currently available IDs are `seven-shifts-csv`, `seven-shifts-api`, `unifi-api`, `glauth`, and `unifi-ldap`. Planned entries are visible in the catalog but are rejected by configuration endpoints until moved into `INTEGRATION_IDS`.

Supported synchronization directions are:

- `to-better-auth`
- `from-better-auth`
- `bidirectional`

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/integration-manager/organizations` | List organizations and their state for an integration. |
| `GET` | `/integration-manager/organization` | Return all integration settings for an organization. |
| `POST` | `/integration-manager/set-enabled` | Enable or disable an integration for an organization. |
| `POST` | `/integration-manager/set-configuration-source` | Choose global or organization-specific configuration. |
| `POST` | `/integration-manager/set-sync-direction` | Set the permitted synchronization direction. |

All routes require a session and apply global- or organization-admin authorization checks.

## Data model

`organizationIntegration` links a Better Auth organization to a registered plugin ID and stores `enabled`, `useGlobalConfiguration`, and `syncDirection`.

## Adding an integration

1. Add its stable ID and catalog metadata to `registry.ts`.
2. Implement the integration-specific Better Auth plugin and schema.
3. Add admin configuration UI for global and/or organization-scoped settings.
4. Enforce the stored enablement and sync direction in every synchronization path.

