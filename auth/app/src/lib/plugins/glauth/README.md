# GLAuth Better Auth plugin

Projects Better Auth users and organization membership into one or more GLAuth-backed LDAP directories. The plugin manages LDAP sources, assigns organizations to sources, allocates UID/GID values, and reconciles application identities into GLAuth runtime tables.

## Registration

```ts
import { glauth } from "./src/lib/plugins/glauth/index.js";

const plugins = [glauth({ pool })];
```

`pool` is the application PostgreSQL `Pool`. The database user must be able to manage the Better Auth plugin tables and the per-source runtime schemas used by GLAuth.

## Endpoints

All endpoints require an authenticated session. Source management is restricted by the authorization checks in the plugin.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/glauth/sources` | List configured GLAuth sources and their assignments/runtime state. |
| `POST` | `/glauth/sources/create` | Create a source from a display name and URL-safe slug. |
| `POST` | `/glauth/sources/update` | Update source identity ranges, group settings, and enabled state. |
| `POST` | `/glauth/sources/organization` | Assign or unassign an organization. |
| `POST` | `/glauth/sources/reconcile` | Rebuild a source's projected users and groups. |

## Data model

The plugin declares source and organization-assignment models, normalized GLAuth users/groups/memberships, service accounts, and GLAuth-compatible runtime models for users, groups, included groups, and capabilities. Source deletion cascades through dependent records where declared by the schema.

## Runtime lifecycle

The runtime manager creates and removes instance directories under the repository-level `glauth-runtimes/` directory. That directory and all generated `config.cfg` files are runtime state and must remain ignored by Git.

Reconciliation derives LDAP records from current Better Auth users and organization memberships. Treat changes to UID/GID allocation, base DNs, runtime schema names, or source slugs as operational migrations rather than cosmetic edits.

## Security

- Do not commit generated GLAuth configuration or password hashes.
- Limit database privileges to the schemas the plugin and runtime manager require.
- Protect reconciliation and source-management routes as administrative operations.
- Back up the database before changing UID/GID ranges or deleting a source.

