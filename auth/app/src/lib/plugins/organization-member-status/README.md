# Organization Member Status Better Auth plugin

Extends Better Auth organization memberships with active/inactive state and relationship metadata.

This plugin is intentionally separate from the Better Auth `member.role`. Role answers "what may this member do?" while member status answers "is this relationship currently active and what kind of relationship is it?"

## Data model

`organizationMemberStatus` is keyed by Better Auth `memberId` and stores:

- `active`;
- `personType`;
- `vendorCompany`;
- `sponsorUserId`;
- `accessExpiresAt`;
- `notes`;
- `source`;
- `reason`;
- `deactivatedAt`;
- `reactivatedAt`;
- created/updated timestamps.

Supported person types currently include:

```text
employee
vendor
contractor
it_support
accountant
owner
service_account
other
```

The default is `employee`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/organization-member-status/eligible` | List members eligible for relationship/sponsor selection. |
| `GET` | `/organization-member-status/list` | List membership status metadata for an organization. |
| `POST` | `/organization-member-status/set` | Update active state and relationship metadata. |

## Exported helper

`setOrganizationMemberStatus()` is exported for trusted integration code such as 7shifts import/sync paths so they can update membership status without duplicating SQL.

## Authorization effect

Counter, Tip Claim, Inventory, Network Status, and workforce/integration code generally exclude memberships whose status is inactive. A Better Auth membership row alone does not imply active application access.
