# Inventory Better Auth plugin

Provides organization-scoped Inventory authorization plus the shared data model used by `inventory-app`.

The plugin has two responsibilities:

1. determine which users may read/manage Inventory for an organization; and
2. persist the Inventory master/organization data that must be shared independently of the frontend application.

## Registration

```ts
inventoryAccess({
  pool,
  internalSecret: process.env.INVENTORY_AUTH_INTERNAL_SECRET,
})
```

## Data model

Current schema models are:

- `inventoryAssignment` — organization/user access and role (`viewer` or management-level roles used by the app);
- `inventoryOrganizationConfig` — organization Inventory settings, happy-hour ranges, default/custom draft sizes, optional beer categories, and related export/import configuration;
- `inventoryLiquorModifier` — shared liquor-modifier master record;
- `inventoryOrganizationLiquorModifier` — organization-specific liquor-modifier variant/assignment;
- `inventoryCocktail` — shared cocktail master;
- `inventoryOrganizationCocktail` — organization-specific cocktail variant/assignment;
- `inventoryCategory` — shared category data;
- `inventoryItem` — shared master item;
- `inventoryItemAlias` — normalized/source aliases for shared items;
- `inventoryItemVariant` — shared item variants;
- `inventoryOrganizationVariant` — organization-specific item variant/price/category state;
- `inventoryImport` — import history/metadata;
- `inventorySourceItem` — source-to-master mapping/import lineage.

The current architecture deliberately separates shared master records from organization-scoped variants where the same logical item/cocktail/modifier may be used by multiple organizations.

## Endpoint groups

### Cocktails

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/inventory/cocktail-masters` | List shared cocktail masters, including admin-oriented master metadata. |
| `PATCH` | `/inventory/cocktail-master` | Update shared cocktail master state/name metadata. |
| `GET` | `/inventory/cocktails` | List organization cocktail variants. |
| `POST` | `/inventory/cocktail` | Create/assign an organization cocktail variant. |
| `PATCH` | `/inventory/cocktail` | Update an organization cocktail variant. |
| `POST` | `/inventory/cocktail/remove` | Remove an organization cocktail variant/assignment. |

### Liquor modifiers

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/inventory/liquor-mod-masters` | List shared liquor-modifier masters. |
| `POST` | `/inventory/liquor-mod-master` | Create a shared liquor-modifier master. |
| `PATCH` | `/inventory/liquor-mod-master` | Update a shared liquor-modifier master. |
| `GET` | `/inventory/liquor-mods` | List organization liquor modifiers. |
| `POST` | `/inventory/liquor-mod` | Create/assign an organization liquor modifier. |
| `PATCH` | `/inventory/liquor-mod` | Update an organization liquor modifier. |
| `POST` | `/inventory/liquor-mod/remove` | Remove an organization liquor-modifier assignment. |
| `PATCH` | `/inventory/liquor-mods/reorder` | Persist organization ordering. |

### Items/imports/catalog

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/inventory/import` | Persist normalized import results. |
| `POST` | `/inventory/organization-variant` | Create an organization item variant. |
| `PATCH` | `/inventory/organization-variants` | Batch update organization variants. |
| `PATCH` | `/inventory/organization-variant` | Update one organization variant. |
| `GET` | `/inventory/master-items` | List shared master items. |
| `PATCH` | `/inventory/master-item-name` | Update shared master naming. |
| `PATCH` | `/inventory/item-category` | Change category assignment. |
| `POST` | `/inventory/item-merge` | Merge shared master items. |
| `GET` | `/inventory/source-mappings` | List source mappings. |
| `PATCH` | `/inventory/source-mapping` | Update a source mapping. |
| `GET` | `/inventory/imports` | List import history. |
| `GET` | `/inventory/catalog` | Return organization catalog data. |

### Organization configuration

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/inventory/organization-config` | Read Inventory organization settings. |
| `PATCH` | `/inventory/organization-config` | Update Inventory organization settings. |

The organization configuration includes the optional Beer category slots used for organization-specific package/draft categories and supports the current two happy-hour time ranges.

### Authorization and assignments

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/inventory/access` | Test signed-in user's organization Inventory access. |
| `PATCH` | `/inventory/assignment` | Update one user's Inventory assignment/role. |
| `GET` | `/inventory/assignments` | List organization Inventory assignments. |
| `GET` | `/inventory/management-access` | Determine whether caller can manage assignments. |
| `GET` | `/inventory/access/internal` | Internal-secret authorization for `inventory-app`. |

## Authorization

Inventory access checks include enabled organization, active membership, non-banned user, and `inventoryAssignment` state. Global admins receive elevated access.

The plugin distinguishes read-only/viewer behavior from users allowed to modify Inventory. The frontend should use the returned authorization metadata for UX, but backend endpoints remain the enforcement point.

## Shared-master rules

When extending the schema, prefer the existing master + organization-variant pattern for data that can be shared across organizations. Do not duplicate shared logical records into organization-only tables merely to simplify the frontend.

Recent examples include Cocktails and Liquor Modifiers.

## Internal access

`/inventory/access/internal` is protected by `INVENTORY_AUTH_INTERNAL_SECRET` and intended only for trusted backend-to-backend calls.
