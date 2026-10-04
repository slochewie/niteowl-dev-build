# Organization Status Better Auth plugin

Adds a global enabled/disabled state to Better Auth organizations.

## Data model

`organizationStatus` contains one row per organization with:

- `organizationId`;
- `enabled`;
- created/updated timestamps.

Missing status rows are treated as enabled by the surrounding application logic.

## Endpoint

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/organization-status/set` | Enable or disable an organization. Global admin only. |

## Better Auth hook

The plugin installs a `before` hook for `/organization/set-active`. If the requested organization has an explicit disabled status, the activation request is rejected.

When an organization is disabled, sessions whose `activeOrganizationId` points at that organization are cleared.

## Usage

Application plugins use organization status as an early authorization gate. A disabled organization should not be considered usable merely because the user still has a Better Auth `member` row.
