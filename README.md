# NiteOwl Auth Service

NiteOwl Auth Service is a self-hosted authentication, organization management, and application integration service built around [Better Auth](https://www.better-auth.com/).

The project provides a central identity and authorization layer for NiteOwl applications and services, with organization-aware access control and custom integrations for external workforce and infrastructure systems.

## Stack

The application is built with:

- **Better Auth** — authentication, sessions, users, organizations, teams, and authorization
- **Better Auth UI** — authentication and account management UI
- **TanStack Start** — full-stack React application framework
- **shadcn/ui** — application and administration interface components
- **PostgreSQL** — primary persistent database
- **Redis** — session and supporting authentication storage
- **Docker Compose** — local/self-hosted service orchestration

## Administration

The application includes a custom administration console for managing:

- Users
- Organizations
- Organization memberships
- Teams
- Authentication and account information
- Plugins and external integrations

Project-specific administration and integration interfaces are built separately from the upstream Better Auth UI components.

## Custom Better Auth Plugins

### Integration Manager

Provides the common framework used to register and manage NiteOwl integrations.

It supports global plugin configuration, organization-level enablement, and organization-specific integration relationships.

### 7shifts CSV

Imports workforce data exported from 7shifts into the NiteOwl identity system.

CSV Sources can be assigned to one or more organizations, allowing a shared workforce export to populate the appropriate Better Auth organizations, users, memberships, roles, and assignments.

CSV upload and import are managed centrally through the Plugins & APIs administration interface.

### UniFi Identity

Integrates Better Auth organizations and users with UniFi Identity / Access infrastructure.

Current functionality includes organization-specific UniFi configuration, user provisioning, entitlement handling, and One-Click WiFi access management.

## Work in Progress

Several integrations and supporting services are under active development.

### 7shifts API

Direct 7shifts API integration is being developed alongside the CSV importer. The goal is to use 7shifts workforce and location data as an authoritative source without requiring manual CSV exports.

### UniFi Integration

The UniFi integration is being expanded beyond Identity provisioning to support additional UniFi permissions and organization-aware access to UniFi Network information.

### GLAuth / LDAP

A GLAuth synchronization service exposes selected Better Auth users and organization information through LDAP for systems that support LDAP-based identity integration.

### Additional Integrations

Planned or experimental integrations include:

- Toast
- Paychex
- Capacity Counter
- MQTT services
- Device provisioning
- Organization WiFi configuration

## Status

This project is under active development. APIs, database schemas, plugin behavior, and administration interfaces may change as the integration architecture is refined.
