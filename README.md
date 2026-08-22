# NiteOwl Auth Service

NiteOwl Auth Service is a self-hosted identity, authentication, organization management, and application integration service built around Better Auth.

It provides a central identity and authorization layer for NiteOwl applications while also acting as middleware between external SaaS platforms, infrastructure services, and custom applications.

## Stack

The application is built with:

- **Better Auth** — authentication, sessions, users, organizations, teams, and authorization
- **Better Auth UI** — authentication and account-management UI
- **TanStack Start** — full-stack React application framework
- **shadcn/ui** — application and administration interface components
- **PostgreSQL** — primary persistent database
- **Redis** — session and supporting authentication storage
- **Docker Compose** — local/self-hosted service orchestration

## Identity and Integration Model

Better Auth acts as the central identity and authorization layer between applications and the systems that provide or consume identity data.

For SaaS and infrastructure integrations, an external system can be treated as the authoritative source for some portion of the data managed by Better Auth.

Examples include:

- **7shifts** — workforce, locations, roles, and employment status
- **Toast** — restaurant and employee data
- **Paychex** — workforce and payroll-related identity data
- **UniFi Identity Endpoint** — infrastructure identity, access, and WiFi provisioning

Data from these systems can be normalized into Better Auth users, organizations, memberships, roles, and application-specific permissions. Better Auth then provides a consistent identity layer to applications without requiring each application to integrate directly with every external provider.

Authority does not have to flow in only one direction. Different integrations can be authoritative for different data, and Better Auth itself can be authoritative where appropriate.

For custom applications such as the NiteOwl **Counter** application, Better Auth can be the authoritative source for users, organizations, permissions, application configuration, and device ownership.

External SaaS integrations are optional. The Auth Service can also operate independently as the complete authentication and authorization system for custom applications that only need Better Auth users, organizations, sessions, and permissions.

## Administration

The application includes a custom administration console for managing:

- Users
- Organizations and memberships
- Teams
- Authentication and account information
- Plugins and integrations
- Organization-specific integration enablement and configuration

Project-specific administration and integration interfaces are maintained separately from upstream Better Auth UI components.

## Custom Better Auth Plugins

### Integration Manager

Provides the common framework used to register and manage NiteOwl integrations.

It supports global integration configuration, organization-level enablement, and relationships between organizations and external data sources.

### 7shifts CSV

Imports workforce data exported from 7shifts into the NiteOwl identity system.

CSV Sources can be assigned to one or more organizations, allowing a workforce export to populate the appropriate Better Auth users, organizations, memberships, roles, locations, and assignments.

CSV upload and import are managed centrally through the **Plugins & APIs** administration interface.

### UniFi Identity

Integrates Better Auth organizations and users with UniFi Identity infrastructure.

Current functionality includes organization-specific UniFi configuration, user provisioning, entitlement handling, and One-Click WiFi access management.

## LDAP Compatibility with GLAuth

GLAuth provides a minimal LDAP-compatible directory service populated from Better Auth.

Better Auth remains the central identity layer. A synchronization service translates selected Better Auth users, account status, organization membership, and related identity information into GLAuth configuration.

This allows infrastructure and legacy applications that expect LDAP or an AD-style directory interface to consume identities managed through NiteOwl without maintaining an independent user database.

In this architecture:

**SaaS / external systems → Better Auth → GLAuth / LDAP consumers**

or, for applications where Better Auth is authoritative:

**Better Auth → custom applications and services**

GLAuth therefore acts as a lightweight compatibility bridge rather than a separate authoritative identity system.

## Work in Progress

### 7shifts API

Direct 7shifts API integration is being developed alongside the CSV importer.

The goal is to allow 7shifts workforce and location data to serve as an authoritative source without requiring manual CSV exports.

### UniFi Integration

The UniFi integration is being expanded beyond Identity provisioning to support additional UniFi permissions and organization-aware access to UniFi Network information.

### Additional Integrations

Planned or experimental integrations include:

- Toast
- Paychex
- Capacity Counter
- MQTT services
- Device provisioning
- Organization WiFi configuration

The plugin architecture is intended to allow these services to share the same Better Auth identity and organization model while remaining independently configurable.

## Status

This project is under active development.

APIs, database schemas, plugin behavior, synchronization rules, and administration interfaces may change as the integration architecture is refined.
