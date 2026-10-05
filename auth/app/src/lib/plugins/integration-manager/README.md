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
mqtt
wifi
counter
```

Planned catalog entries currently include:

```text
toast-api
paychex-api
```

MQTT, WiFi, and Counter are now implemented integrations with their own Better Auth plugins and administration UI.

## Catalog enabled-organization counts

The Plugins & APIs catalog does not assume every integration's real configuration state is represented by `organizationIntegration.enabled`.

Where an integration has a more authoritative configuration model, the catalog derives its enabled-organization count from that model:

- **GLAuth** — distinct organizations attached to enabled GLAuth sources;
- **WiFi** — distinct organizations with at least one enabled `wifiNetwork`;
- **MQTT** — distinct organizations with an enabled MQTT assignment to an enabled broker source;
- **Counter** — organizations with at least one enabled Counter definition.

Other available integrations continue to use their Integration Manager organization state where that is the appropriate source of truth.

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

That table remains the policy store for integrations that use generic Integration Manager state. It is not automatically the source of truth for integration-specific resource counts.

## Adding a new catalog integration

1. Add a stable ID and catalog metadata in `registry.ts`.
2. Move it into `INTEGRATION_IDS` only when the implementation is actually available.
3. Implement the integration-specific Better Auth plugin/schema.
4. Add admin configuration UI.
5. Enforce enablement and sync direction in every synchronization path where those policies apply.
6. If the integration has its own authoritative configuration resources, derive catalog counts from those resources instead of duplicating state in `organizationIntegration`.
