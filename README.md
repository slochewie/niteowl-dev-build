# NiteOwl Auth Service

NiteOwl Auth Service is the central authentication, authorization, organization, and application-access service for NiteOwl applications. It is built on Better Auth and adds organization-aware application permissions, workforce synchronization, infrastructure integrations, and an administration console.

The service runs as part of the `niteowl-dev-build` repository and is developed primarily under `auth/app/`.

## Architecture

```text
External workforce / infrastructure systems
                |
                v
          NiteOwl Auth
        (Better Auth)
                |
        +-------+-------+
        |               |
        v               v
  Users / Orgs      App access
  Memberships       assignments
  Roles / Status    and policies
        |               |
        +-------+-------+
                |
                v
 Counter | Tip Calculator | Inventory | Network Status | UniFi | GLAuth
```

Better Auth supplies the core user, account, session, organization, team, admin, OAuth, API-key, JWT, passkey, email OTP, magic-link, and password flows. NiteOwl plugins add application-specific persistence and authorization on top of that core.

## Current stack

- **Better Auth 1.7.x** — authentication, sessions, organizations, admin roles, OAuth provider, API keys, JWT, passkeys, email OTP, magic links, and password authentication
- **Better Auth UI** — authentication/account-management components
- **TanStack Start / Router / Query** — application framework and routing
- **React 19** and **shadcn/ui** — administration UI
- **PostgreSQL 18** — primary persistent store
- **Redis 8** — Better Auth secondary storage
- **Node.js 26** — runtime
- **Resend** — transactional authentication email
- **Docker Compose** — local/self-hosted orchestration
- **GLAuth** — LDAP projection for systems that require LDAP

## Repository layout

```text
.
├── AGENTS.md                         # Repository development rules
├── README.md                         # This file
├── docker-compose.yml
├── auth/
│   └── app/
│       ├── AGENTS.md                 # TanStack intent guidance
│       ├── README.md                 # Auth application architecture/development docs
│       └── src/lib/plugins/          # NiteOwl Better Auth plugins
└── glauth-runtime-manager/           # Dynamic GLAuth runtime manager
```

Local runtime data such as PostgreSQL, Redis, generated GLAuth instances, uploaded integration files, and environment files is intentionally kept outside version control.

## Docker Compose services

| Service | Purpose | Host port |
| --- | --- | --- |
| `postgres` | Primary PostgreSQL database | internal only |
| `redis` | Redis secondary storage | internal only |
| `auth` | NiteOwl Auth application/admin console | `3031` |
| `admin` | Separate local administration/reference application | `3030` |
| `node-upstream` | Local upstream/reference Node environment | `3040` |
| `glauth-runtime-manager` | Creates/removes dynamic GLAuth containers | internal only |

All services use the `niteowl-dev` Docker network.

## Authentication and system administration

The Better Auth instance currently includes:

- username/password authentication;
- email verification and password-reset email through Resend;
- email OTP and magic-link sign-in;
- GitHub social-provider configuration in the auth backend;
- passkeys;
- multi-session support;
- Better Auth admin roles;
- organizations and teams;
- API keys;
- JWTs;
- OpenAPI support;
- OAuth provider support;
- Have I Been Pwned password checking;
- Better Auth Infra Dash/Sentinel components;
- PostgreSQL-backed sessions with Redis secondary storage.

System admin roles are:

- `admin` — full Better Auth/NiteOwl administration;
- `admin-viewer` — read-only Better Auth admin access for users/sessions;
- `user` — no global admin privileges.

Only global admins may create organizations through the current organization policy.

## Organization status and membership status

NiteOwl extends Better Auth organizations with two separate status layers:

- **Organization status** can disable an organization globally. Disabled organizations cannot be made active and are excluded from application-access checks.
- **Organization member status** can independently activate/deactivate a membership and store relationship metadata such as person type, vendor company, sponsor, expiration, notes, source, and reason.

Application plugins consistently consider the user, membership, organization status, and application-specific assignment before granting access.

## Application-access plugins

### Counter

Organization-scoped Counter definitions, per-counter user assignments, delegated Counter Managers, internal service checks, and organization availability.

[Counter plugin documentation](auth/app/src/lib/plugins/counter/README.md)

### Tip Claim / Tip Calculator

Organization-scoped application access, assignment management, role eligibility, staffing snapshots, weight presets, saved claim shifts, and tip-pool shifts. It exposes both session-authenticated administration endpoints and internal-secret endpoints used by the Tip Calculator application.

[Tip Claim plugin documentation](auth/app/src/lib/plugins/tip-claim/README.md)

### Inventory

Organization-scoped inventory authorization plus shared master data, organization variants, source mappings, imports, categories, cocktails, liquor modifiers, pricing/configuration, and catalog APIs.

[Inventory plugin documentation](auth/app/src/lib/plugins/inventory/README.md)

### Network Status

Organization-scoped Network Status access, delegated managers, Fabric Overview permission, and internal service authorization.

[Network Status plugin documentation](auth/app/src/lib/plugins/network-status/README.md)

## Organization-control plugins

- [Organization Status](auth/app/src/lib/plugins/organization-status/README.md)
- [Organization Member Status](auth/app/src/lib/plugins/organization-member-status/README.md)
- [Revision History](auth/app/src/lib/plugins/revision-history/README.md)

Revision history is a reusable schema/helper layer used by features that need immutable resource revisions; it is not itself a public HTTP API.

## Workforce and schedule integrations

### 7shifts core

Normalizes 7shifts employees, locations, departments, roles, and assignments and maps selected 7shifts roles to NiteOwl application permissions.

[7shifts core documentation](auth/app/src/lib/plugins/seven-shifts/README.md)

### 7shifts CSV

Imports 7shifts CSV exports and reconciles them into Better Auth and normalized 7shifts records.

[7shifts CSV documentation](auth/app/src/lib/plugins/seven-shifts-csv/README.md)

### 7shifts API

Stores encrypted API credentials, discovers locations, previews/synchronizes workforce data, and maps upstream locations to NiteOwl organizations.

[7shifts API documentation](auth/app/src/lib/plugins/seven-shifts-api/README.md)

### 7shifts Schedules

Persists organization schedules from the 7shifts API, exposes week reads and sync controls, and supports both manual/global and per-organization schedule synchronization.

[7shifts Schedules documentation](auth/app/src/lib/plugins/seven-shifts-schedules/README.md)

## Infrastructure integrations

### UniFi Access

Connects to the local UniFi Access developer API, stores encrypted source tokens, discovers users/groups/resources, assigns sources to organizations, and provides reconciliation/provisioning controls.

[UniFi Access documentation](auth/app/src/lib/plugins/unifi-access/README.md)

### UniFi Identity

Stores encrypted organization-level UniFi Identity configuration and supports resource/group discovery, entitlements, user reconciliation, and provisioning.

[UniFi Identity documentation](auth/app/src/lib/plugins/unifi-identity/README.md)

### GLAuth

Projects Better Auth identities and memberships into dynamically managed LDAP-compatible GLAuth instances.

[GLAuth documentation](auth/app/src/lib/plugins/glauth/README.md)

### Integration Manager

Provides the administration catalog/control plane for organization integration enablement, configuration ownership, and synchronization direction.

[Integration Manager documentation](auth/app/src/lib/plugins/integration-manager/README.md)

### User Profile

Stores the extended personal/workforce profile used by workforce integrations.

[User Profile documentation](auth/app/src/lib/plugins/user-profile/README.md)

## OAuth resources and scopes

The Better Auth OAuth provider currently advertises application scopes for:

- `counter:read`, `counter:write`;
- `tip-claim:read`, `tip-claim:write`, `tip-claim:manage`;
- `inventory:read`, `inventory:write`, `inventory:manage`.

Resource identifiers are configured for both McCarthy's production domains and NiteOwl domains for Counter, Tip Calculator, and Inventory.

Application access is still enforced by the corresponding NiteOwl plugin; possession of an OAuth scope alone is not sufficient to bypass organization/application assignments.

## Configuration

The Compose stack expects local environment files such as:

```text
.env-postgres
.env-better-auth
.env-btst
```

The Auth application requires, at minimum:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_ALLOWED_HOSTS`
- PostgreSQL connection variables (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`)
- Redis connection variables (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`)
- `INTEGRATION_ENCRYPTION_KEY`

Optional/feature-specific values include trusted origins, Resend credentials, social-provider credentials, application internal secrets, and the 7shifts CSV storage root.

Keep integration encryption keys stable. Rotating a key without migrating encrypted values makes stored external API credentials unreadable.

## Running the stack

Start the primary services:

```bash
docker compose up -d postgres redis auth glauth-runtime-manager
```

Start all configured services:

```bash
docker compose up -d
```

Inspect service state:

```bash
docker compose ps
```

Follow Auth logs:

```bash
docker compose logs -f auth
```

Stop the stack:

```bash
docker compose down
```

## Database migrations

Better Auth schema changes are migrated through the Better Auth CLI. The repository development rules require reviewing the generated migration interactively rather than applying broad schema changes blindly.

Use the repository's established migration workflow and review the source diff before building, testing, committing, or pushing.

## Security boundaries

The codebase intentionally uses multiple authorization layers:

1. authentication/session validation;
2. global Better Auth admin role checks;
3. enabled organization checks;
4. active organization membership checks;
5. application-specific assignments/manager roles;
6. internal shared-secret checks for service-to-service endpoints;
7. encrypted storage for external integration credentials.

UI visibility is not treated as the security boundary; backend plugin endpoints enforce their own authorization.

## Sensitive/runtime data

Never commit:

- `.env` files or secrets;
- PostgreSQL or Redis data;
- integration API tokens or encryption keys;
- uploaded 7shifts CSVs;
- generated onboarding credentials/password exports;
- GLAuth runtime configuration or password hashes;
- local backups or migration dumps.

If a secret is committed, deleting it in a later commit is not sufficient. Rotate it and, where necessary, rewrite repository history.

## Development workflow

Read `AGENTS.md` before modifying the repository. Important rules include:

- ChatGPT access to this repository is read-only;
- source edits are applied locally by the user;
- Auth edits should use guarded Node.js heredoc scripts rather than Python;
- never use a Git pager;
- inspect `git status --short` and `git --no-pager diff` after changes;
- avoid broad Biome formatting;
- build/test only after the source diff is correct;
- commit/push only after validation.

The Auth application also contains `auth/app/AGENTS.md`, which defines TanStack intent guidance for changes that touch TanStack APIs.

## Development status

This project is under active development. Plugin schemas, authorization policy, integrations, administration screens, and external API behavior can change as application requirements evolve.
