# NiteOwl Auth application

This directory contains the NiteOwl Auth service and administration console. It is a TanStack Start application built around Better Auth with custom organization-aware plugins for NiteOwl applications and external integrations.

The repository-level documentation is in [`../../README.md`](../../README.md). Read both the repository-level `AGENTS.md` and this directory's `AGENTS.md` before changing application code.

## What this application provides

The Auth app is responsible for:

- Better Auth users, accounts, sessions, organizations, teams, invitations, and global admin roles;
- login/account-management UI;
- OAuth authorization-server behavior for NiteOwl applications;
- API keys and JWT support;
- application-specific organization access and delegated-manager assignments;
- workforce ingestion from 7shifts CSV/API;
- local persisted 7shifts schedules;
- UniFi Identity and UniFi Access integrations;
- GLAuth/LDAP projection;
- shared Inventory master/organization data;
- Counter, Tip Calculator, Inventory, and Network Status authorization APIs;
- NiteOwl administration UI for users, organizations, plugins, integrations, schedules, and assignments.

## Runtime

The Compose `auth` service mounts this directory at `/app` and currently builds then starts the production server:

```text
npm run build && npm start
```

The container is exposed through host port `3031` to application port `3000`.

Local shared packages are mounted at:

```text
/app/packages/niteowl-app-config
/app/packages/niteowl-ui
```

The application uses Nitro through TanStack Start for its Node server output.

## Useful commands

From this directory/container:

```bash
npm run dev
npm run generate-routes
npm run build
npm run lint
npm run format
npm run check
npm start
```

Avoid broad formatting changes when making targeted Auth edits.

## Core Better Auth configuration

`src/lib/auth.ts` is the composition root for the Better Auth instance.

Current core behavior includes:

- PostgreSQL database adapter through `pg.Pool`;
- Redis secondary storage;
- 7-day sessions with 1-day update age and database-backed session storage;
- database-backed verification records;
- email/password authentication;
- Resend password-reset and verification mail;
- GitHub social-provider backend configuration;
- username plugin;
- Better Auth admin plugin with custom roles;
- organization/teams plugin;
- multi-session support;
- OpenAPI;
- API keys;
- JWT;
- OAuth provider;
- email OTP;
- magic links;
- Have I Been Pwned password checks;
- Better Auth Infra Dash/Sentinel;
- TanStack Start cookies.

### Global admin roles

Defined in `src/lib/admin/permissions.ts`:

| Role | Meaning |
| --- | --- |
| `admin` | Full global administration. |
| `admin-viewer` | Read-only Better Auth admin access to users and sessions. |
| `user` | No global admin permissions. |

`canManageAdmin()` checks for `admin`. `canViewAdmin()` accepts either `admin` or `admin-viewer`.

Only a global `admin` may create an organization through the current Better Auth organization configuration.

## Routes and console layout

Authenticated routes are under the `/_app` layout. `beforeLoad` requires a Better Auth session and redirects unauthenticated users to the Better Auth sign-in route.

The shared application shell includes:

- `AppSidebar`;
- shared NiteOwl organization selector;
- NiteOwl user menu/avatar;
- the NiteOwl app configuration package for app labels/navigation;
- organization- and user-management routes;
- plugins/integrations routes;
- schedules route.

The document title is `NiteOwl.dev Admin Console` by default and `Admin Console` on McCarthy's hostnames.

## Custom Better Auth plugins

Plugins live under `src/lib/plugins/`.

| Plugin | Purpose |
| --- | --- |
| `organization-status` | Global organization enable/disable state and active-organization protection. |
| `organization-member-status` | Membership active/inactive state and relationship metadata. |
| `revision-history` | Reusable revision persistence/helpers. |
| `counter` | Counter definitions, user assignments, delegated managers, access checks. |
| `network-status` | Network Status assignments/managers/Fabric Overview access. |
| `inventory` | Inventory authorization plus shared masters, organization variants, imports/config/catalog. |
| `tip-claim` | Tip Calculator access, assignments, staffing, presets, claims, and tip-pool persistence. |
| `integration-manager` | Integration catalog and organization-level integration policy. |
| `user-profile` | Extended user profile used by workforce integrations. |
| `seven-shifts` | Normalized workforce model and role-to-app permission mapping. |
| `seven-shifts-csv` | CSV workforce import. |
| `seven-shifts-api` | Encrypted API source configuration and workforce synchronization. |
| `seven-shifts-schedules` | Schedule preview, sync, persistence, and weekly read APIs. |
| `unifi-identity` | Organization-level UniFi Identity config/resources/entitlements/provisioning. |
| `unifi-access` | UniFi Access source discovery, reconciliation, provisioning, and source assignment. |
| `glauth` | LDAP source management and Better Auth identity projection. |

`api-source/secret.ts` is a shared integration utility rather than a Better Auth plugin. It centralizes secret encryption/decryption for API-source plugins.

Each plugin with its own README documents its endpoints and persistence model.

## Authorization model

Authorization is intentionally layered. Application plugins typically evaluate:

1. whether the organization exists and is enabled;
2. whether a user is globally privileged;
3. whether a non-global user has an active membership;
4. whether an application-specific access assignment is enabled;
5. whether a delegated manager is allowed to modify the target user's assignment;
6. whether the target is another manager/global admin/self where special restrictions apply.

This means UI routing is not relied on as the security boundary. Backend endpoints enforce access independently.

### Organization status

`organization-status` stores one enable/disable record per organization. Disabling an organization clears matching `session.activeOrganizationId` values and prevents that organization from being activated.

### Organization membership status

`organization-member-status` augments Better Auth's `member` row with:

- active/inactive state;
- person type;
- vendor company;
- sponsor;
- access expiration;
- notes;
- source/reason;
- deactivation/reactivation timestamps.

Application plugins generally exclude banned users and inactive organization memberships.

## OAuth provider

The Auth service is an OAuth provider for NiteOwl applications.

Current scopes include:

```text
openid
offline_access
counter:read
counter:write
tip-claim:read
tip-claim:write
tip-claim:manage
inventory:read
inventory:write
inventory:manage
```

Configured resources include both NiteOwl and McCarthy's domains for Counter, Tip Calculator, and Inventory.

OAuth scope/resource validation and application plugin authorization are separate checks. A client token does not grant organization/application access by itself.

## Environment

`src/lib/env.ts` requires:

```text
BETTER_AUTH_SECRET
BETTER_AUTH_ALLOWED_HOSTS
PGHOST
PGPORT
PGDATABASE
PGUSER
PGPASSWORD
REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
INTEGRATION_ENCRYPTION_KEY
```

Optional/feature-specific values include:

```text
BETTER_AUTH_TRUSTED_ORIGINS
SEVEN_SHIFTS_CSV_STORAGE_ROOT
RESEND_API_KEY
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
COUNTER_AUTH_INTERNAL_SECRET
NETWORK_STATUS_INTERNAL_SECRET
INVENTORY_AUTH_INTERNAL_SECRET
TIP_CLAIM_INTERNAL_SECRET
```

`SEVEN_SHIFTS_CSV_STORAGE_ROOT` defaults to `/app/.data/integrations/7shifts-csv`.

Never commit environment files or credentials.

## Internal service endpoints

Counter, Network Status, Inventory, and Tip Claim expose internal service-to-service authorization/data endpoints protected by dedicated shared secrets. The calling application must send the expected internal-secret header.

These endpoints are intended for trusted backend-to-backend calls. Do not expose the shared secrets to browser clients.

## Integrations and encrypted credentials

The following integrations persist encrypted external credentials using `INTEGRATION_ENCRYPTION_KEY`:

- 7shifts API;
- 7shifts Schedules (through its 7shifts API source);
- UniFi Identity;
- UniFi Access.

Keep the key stable and backed up. Changing it without migrating ciphertext breaks existing saved credentials.

## 7shifts schedules

`seven-shifts-schedules` persists schedule rows in `sevenShiftsScheduledShift` and provides:

- global preview;
- organization listing;
- week reads;
- sync-control status;
- update checks;
- single-organization sync;
- broader schedule sync.

The `schedules` administration route consumes this plugin.

## Inventory architecture

Inventory is one of the largest custom plugins. Its schema currently includes:

- `inventoryAssignment`;
- `inventoryOrganizationConfig`;
- `inventoryLiquorModifier`;
- `inventoryOrganizationLiquorModifier`;
- `inventoryCocktail`;
- `inventoryOrganizationCocktail`;
- `inventoryCategory`;
- `inventoryItem`;
- `inventoryItemAlias`;
- `inventoryItemVariant`;
- `inventoryOrganizationVariant`;
- `inventoryImport`;
- `inventorySourceItem`.

The plugin separates shared master records from organization-scoped variants where appropriate, and stores import/source mapping history needed by the Inventory application.

## Migrations

When Better Auth plugin schemas change, use the repository's established interactive Better Auth migration flow. Do not handwave schema changes or run broad migrations without reviewing the generated SQL/schema effect.

After an edit:

```bash
git status --short
git --no-pager diff
```

Build/test only after the source diff is correct.

## Development rules

The repository-level `AGENTS.md` is authoritative for workflow. In particular:

- GitHub access for ChatGPT is read-only;
- the user applies source modifications locally;
- prefer guarded Node.js heredoc edits in the `auth` container;
- do not use Python for Auth edits;
- do not use Git pagers;
- do not overwrite unrelated local changes;
- avoid broad Biome formatting;
- validate the diff before build/test;
- commit/push only after validation.

This directory's `AGENTS.md` additionally lists TanStack Intent guidance that should be loaded before editing relevant TanStack APIs.
