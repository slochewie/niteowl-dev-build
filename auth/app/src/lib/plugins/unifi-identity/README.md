# UniFi Identity Better Auth plugin

Connects Better Auth organizations and users to UniFi Identity. It stores encrypted organization credentials, discovers UniFi resources and groups, manages per-user access, and provisions or reconciles UniFi users.

## Registration

```ts
import { unifiIdentity } from "./src/lib/plugins/unifi-identity/index.js";

const plugins = [unifiIdentity({ pool, encryptionKey })];
```

`encryptionKey` encrypts stored UniFi API tokens and must be stable across restarts and deployments.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/unifi-identity/config` | Read an organization's connection settings without exposing its token. |
| `PUT` | `/unifi-identity/config` | Save enabled state, console URL, token, and TLS policy. |
| `POST` | `/unifi-identity/test` | Test the configured connection. |
| `POST` | `/unifi-identity/resources/refresh` | Refresh discovered UniFi resources. |
| `POST` | `/unifi-identity/groups/refresh` | Refresh UniFi groups. |
| `GET` | `/unifi-identity/resources` | List cached organization resources. |
| `GET` | `/unifi-identity/user-access` | Read per-user access state. |
| `PUT` | `/unifi-identity/user-access` | Update per-user access state. |
| `POST` | `/unifi-identity/users/reconcile` | Reconcile an existing Better Auth user with UniFi. |
| `POST` | `/unifi-identity/users/provision` | Provision a user in UniFi Identity. |

## Data model

The plugin declares organization connection configuration, organization/user links, cached resources and groups, user access, and group/resource entitlement rules. The organization and user references cascade according to the Better Auth schema declarations.

## Client behavior

`client.ts` contains the HTTP transport for the UniFi console. Keep authentication headers, response validation, TLS handling, and error redaction centralized there rather than duplicating network calls in endpoints.

## Security and operations

- Store the encryption key only in deployment secrets; never commit it.
- Keep TLS verification enabled in production. Disabling it permits man-in-the-middle attacks.
- Treat provisioning and entitlement changes as privileged external side effects.
- Avoid logging API tokens or full upstream error responses that may echo credentials.
- Use connection testing and resource refresh before enabling user provisioning.

