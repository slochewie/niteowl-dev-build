# NiteOwl Auth Service

NiteOwl Auth Service is a self-hosted identity, authentication, organization-management, and application-integration platform built around Better Auth.

It provides a central identity and authorization layer for NiteOwl applications while connecting external workforce, infrastructure, and directory services.

## Architecture

```text
External workforce and infrastructure systems
              ↓
       Better Auth service
              ↓
Users • Organizations • Roles • Permissions
              ↓
NiteOwl applications • UniFi • GLAuth/LDAP
```

Better Auth can consume identity data from external authoritative systems or act as the authoritative source itself.

Examples include:

- **7shifts** for employees, locations, departments, roles, and employment status
- **UniFi Identity** for infrastructure identity, access, and Wi-Fi provisioning
- **GLAuth** for LDAP-compatible access to identities managed through Better Auth
- **NiteOwl Counter** and other custom applications for organization-scoped authorization

Integrations are optional. The service can operate as a standalone authentication and authorization system using Better Auth users, sessions, organizations, memberships, and permissions.

## Stack

- **Better Auth** — authentication, sessions, users, organizations, teams, and authorization
- **Better Auth UI** — authentication and account-management UI
- **TanStack Start** — full-stack React framework
- **shadcn/ui** — application and administration components
- **PostgreSQL 18** — primary persistent database
- **Redis 8** — session and supporting authentication storage
- **Node.js 26** — application runtime
- **Docker Compose** — local and self-hosted orchestration
- **GLAuth** — dynamically provisioned LDAP-compatible directories

## Repository Layout

```text
.
├── auth/
│   └── app/                    # Better Auth application and admin interface
├── glauth/                     # Static GLAuth service resources
├── glauth-postgres/            # GLAuth PostgreSQL resources
├── glauth-runtime-manager/     # Creates and removes GLAuth instances
├── glauth-runtimes/            # Generated runtime instances; ignored by Git
├── postgres/                   # Local PostgreSQL data; ignored by Git
├── redis/                      # Local Redis data; ignored by Git
├── docker-compose.yml
└── README.md
```

Some local reference or upstream source directories are intentionally excluded from version control.

## Docker Compose Services

| Service | Purpose | Host port |
| --- | --- | --- |
| `postgres` | Primary PostgreSQL database | Internal only |
| `redis` | Persistent Redis service | Internal only |
| `auth` | NiteOwl Better Auth application | `3031` |
| `admin` | Separate local administration application | `3030` |
| `node-upstream` | Local upstream Node reference environment | `3040` |
| `glauth-runtime-manager` | Manages dynamic GLAuth containers | Internal only |

All services communicate through the `niteowl-dev` Docker network.

## Configuration

The Compose environment expects local environment files including:

```text
.env-postgres
.env-better-auth
.env-btst
```

Environment files can contain credentials and must not be committed. The repository’s `.gitignore` excludes `.env` variants throughout the project.

At minimum, configure:

- PostgreSQL database credentials
- Redis password
- Better Auth secrets and URLs
- Application database and Redis connections
- Encryption keys used by integrations
- External API credentials where required

Use stable encryption keys in deployed environments. Changing a plugin encryption key can make previously stored credentials unreadable.

## Running the Service

Start the primary services:

```bash
docker compose up -d postgres redis auth glauth-runtime-manager
```

Start every configured service:

```bash
docker compose up -d
```

Check service state:

```bash
docker compose ps
```

Follow the authentication service logs:

```bash
docker compose logs -f auth
```

Stop the stack:

```bash
docker compose down
```

PostgreSQL and Redis data remain in their local persistent directories after the containers stop.

## Administration

The application includes a custom administration interface for managing:

- users and account state;
- organizations, memberships, and teams;
- authentication methods;
- plugins and integrations;
- integration sources;
- organization-level enablement and configuration;
- workforce synchronization;
- GLAuth LDAP sources;
- UniFi Identity access.

Project-specific administration components are maintained separately from upstream Better Auth UI components.

## Custom Better Auth Plugins

### Integration Manager

Controls organization-level integration enablement, configuration ownership, and synchronization direction.

[Integration Manager documentation](auth/app/src/lib/plugins/integration-manager/README.md)

### User Profile

Adds application-specific personal and workforce profile fields to Better Auth users.

[User Profile documentation](auth/app/src/lib/plugins/user-profile/README.md)

### 7shifts Core

Provides the normalized employee, location, department, role, assignment, and application-permission model shared by 7shifts integrations.

[7shifts core documentation](auth/app/src/lib/plugins/seven-shifts/README.md)

### 7shifts CSV

Imports workforce data from 7shifts CSV exports. Sources can be assigned to organizations and reconciled into Better Auth users, memberships, roles, locations, and profiles.

[7shifts CSV documentation](auth/app/src/lib/plugins/seven-shifts-csv/README.md)

### 7shifts API

Synchronizes workforce and location data directly with the 7shifts API. API credentials are encrypted before storage.

[7shifts API documentation](auth/app/src/lib/plugins/seven-shifts-api/README.md)

### UniFi Identity

Connects Better Auth organizations and users to UniFi Identity for provisioning, access management, groups, resources, and Wi-Fi entitlements.

[UniFi Identity documentation](auth/app/src/lib/plugins/unifi-identity/README.md)

### GLAuth

Projects selected Better Auth identities and organization memberships into dynamically managed LDAP-compatible directories.

[GLAuth documentation](auth/app/src/lib/plugins/glauth/README.md)

## GLAuth Runtime Management

GLAuth acts as a compatibility bridge for infrastructure and legacy applications that require LDAP.

```text
External systems → Better Auth → GLAuth → LDAP consumers
```

The `glauth-runtime-manager` service monitors the database and dynamically creates or removes GLAuth instances.

Generated instances are stored under:

```text
glauth-runtimes/
```

This directory is runtime state and is ignored by Git. Individual instance directories and `config.cfg` files may appear or disappear as GLAuth sources are created, updated, or deleted.

The runtime manager mounts the Docker socket so it can manage GLAuth containers. Treat this service as privileged infrastructure and restrict access accordingly.

Relevant runtime settings include:

- `GLAUTH_RUNTIME_ROOT`
- `GLAUTH_RUNTIME_HOST_ROOT`
- `GLAUTH_RUNTIME_NETWORK`
- `GLAUTH_RUNTIME_IMAGE`
- `GLAUTH_RUNTIME_POLL_MS`
- `GLAUTH_RUNTIME_HOST_UID`
- `GLAUTH_RUNTIME_HOST_GID`

Better Auth remains the authoritative identity layer. GLAuth should not be treated as an independent user-management database.

## Runtime and Sensitive Data

The following must remain outside version control:

- environment files;
- PostgreSQL and Redis data;
- generated GLAuth runtime directories and configuration;
- uploaded 7shifts CSV files;
- generated password and credential exports;
- integration API tokens;
- encryption keys;
- local backups and migration data.

If a credential is accidentally committed, removing the file in a later commit is insufficient. Rotate the credential and, when necessary, rewrite repository history.

## Planned Integrations

Planned or experimental integration areas include:

- Toast
- Paychex
- MQTT
- NiteOwl Counter
- device provisioning
- organization Wi-Fi configuration
- additional UniFi services

The integration architecture is designed so each service can share the central Better Auth identity and organization model while remaining independently configurable.

## Development Status

This project is under active development.

APIs, database schemas, synchronization behavior, authorization rules, plugin interfaces, and administration screens may change as the architecture evolves.
