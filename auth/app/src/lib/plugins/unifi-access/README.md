# UniFi Access Better Auth plugin

Connects NiteOwl Auth to the UniFi Access local developer API.

It stores encrypted API-source credentials, discovers UniFi users/groups/resources, maps sources to Better Auth organizations, caches discovered state, provides reconciliation views, and can provision/update UniFi users from Better Auth.

The UniFi Access developer API uses HTTPS on the console and Bearer API-token authentication. The API source token is encrypted at rest by this plugin.

## Registration

```ts
unifiAccess({
  pool,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

- `unifiAccessSource` — source name, URL, port, encrypted API token, TLS policy, enabled/test state.
- `unifiAccessOrganizationSource` — organization/source assignment.
- `unifiAccessUser` — cached upstream UniFi Access user.
- `unifiAccessGroup` — cached upstream user group.
- `unifiAccessResource` — cached Identity/Access resource.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/unifi-access/sources` | List sources and organization assignments. |
| `POST` | `/unifi-access/sources/create` | Create a source and encrypt its API token. |
| `POST` | `/unifi-access/sources/update` | Update source metadata, TLS policy, enabled state, or token. |
| `POST` | `/unifi-access/sources/discover` | Fetch and persist upstream users/groups/resources. |
| `POST` | `/unifi-access/sources/test` | Test source connectivity/authentication. |
| `GET` | `/unifi-access/sources/users` | List cached source users with pagination/filtering/sorting. |
| `GET` | `/unifi-access/sources/reconcile` | Refresh live discovery and compare Better Auth vs UniFi state for an organization. |
| `POST` | `/unifi-access/sources/users/provision` | Provision a Better Auth user into UniFi Access. |
| `POST` | `/unifi-access/sources/users/status` | Change/reconcile upstream user status. |
| `POST` | `/unifi-access/sources/assign` | Assign a source to an organization. |
| `POST` | `/unifi-access/sources/unassign` | Remove an organization/source assignment. |
| `POST` | `/unifi-access/sources/delete` | Delete a source. |

Source-management operations are restricted to global administrators. Read-only admin viewers may be allowed on selected listing/reconciliation reads where the source code explicitly permits viewer access.

## Discovery and reconciliation

Discovery reads live UniFi users, user groups, and Identity resources and writes the normalized cache tables.

Reconciliation intentionally refreshes the live UniFi console first rather than trusting stale cache state. It then compares the assigned NiteOwl organization's Better Auth users against UniFi records and classifies differences such as missing, should-activate, should-deactivate, disabled/in-sync, or UniFi-only states.

## Security

- Store `INTEGRATION_ENCRYPTION_KEY` only in deployment secrets.
- Do not log or return plaintext API tokens.
- TLS verification should remain enabled for production sources.
- Provisioning/status changes are external side effects and must remain administrator-controlled.

For the upstream API itself, the supplied UniFi Access documentation indicates API-token authentication, HTTPS on port 12445, and permission-scoped developer endpoints. Keep source behavior aligned with the actual console/API version in use.
