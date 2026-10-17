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

## Menu and shared catalog boundary

`GET /inventory/catalog` defaults to `scope=menu`, excluding variants explicitly
marked `menuEligible=false`. Menu-eligible variants without organization assignments
remain discoverable. `scope=shared` requires Inventory admin access and includes both
assortments. Global master administration remains available through master-items.

Catalog rows add `menuEligible`, nullable `inventoryOrganizationVariantId`, and
`organization.assigned`; existing IDs, prices, and export flags retain their meaning.

The declared `inventoryItemVariant.menuEligible` field defaults to true for legacy
menu creation. Its migration has **not** been applied by this change. Until the column
exists, JSON row reads treat variants as legacy menu-eligible. Retail variation
creation explicitly persists false after schema deployment. The separate promotion
endpoint described below handles audited system-admin promotion.

Menu assignment writes, imports, and source mapping reject Retail-only targets with
409. Existing menu variants on mixed masters remain usable. Whole-master category
changes and merges involving Retail-only variants remain rejected; explicit global
promotion is required before menu merge workflows. Retail enrollment must not reuse
menu write endpoints.

Run focused coverage with:

```bash
node --test src/lib/plugins/inventory/menu-boundary.test.ts
```

## Canonical variation identity and explicit menu promotion

inventoryItemVariant.variationKey is nullable canonical JSON containing string
attributes. The catalog service serializes combination creation under a master row
lock and reuses existing combinations. The portable schema declares a non-unique
lookup index because Better Auth rejects composite unique indexes over nullable
fields. All canonical writes must use the locked service or merge transaction.
The user separately applied inventoryItemVariant_master_variation_key_uidx, a
PostgreSQL partial unique index on (inventoryItemId, variationKey) WHERE variationKey
IS NOT NULL. Read-only inspection confirmed it is unique, valid and ready. Fresh
databases require this additional index after the portable Better Auth migration.
Legacy variants retain null keys. Canonical
attribute combinations match during merges independently of display names;
legacy beverage matching retains its previous kind/size/package/name semantics.
Automatic menu identity matching excludes attributed variants; explicitly selected
promoted variants remain usable through existing variant-ID workflows.

POST /inventory/menu-eligibility/promote accepts organizationId,
inventoryItemVariantId and a reason (3–1000 characters). It requires enabled
organization/Inventory access and a non-banned global system admin, rechecked inside
the transaction. Organization/delegated Inventory admins cannot promote shared
variants globally. Promotion changes only shared eligibility/updatedAt, appends a
revisionHistory snapshot with actor/reason atomically, and never changes organization
menu availability, export settings or prices. Retrying an already promoted variant
is a no-op. Undeployed eligibility schema returns 503; no demotion endpoint exists.

Before activation, review migration SQL for the nullable variationKey column,
non-unique combination lookup index, and menuEligible NOT NULL DEFAULT true/backfill. Installed
Better Auth migration code supports this static boolean default. The user applied
the reviewed migration; read-only verification confirmed all 421 existing variants
remain menu-eligible. Retail creation must continue to persist false
explicitly; existing raw menu inserts rely on the reviewed database default.

## Transactional merge participants

The composition root injects `mergeParticipants` into Inventory. Each participant
receives the same PostgreSQL transaction and the source/target organization variant
IDs before a duplicate parent is deleted. Any failure rolls back the entire merge.
The response adds `organizationVariantMappings` so consumers can refresh old parent
references. Moving a variant or retaining its organization parent preserves IDs and
requires no callback. Inventory imports only the generic participant types.

## Neutral Retail enrollment service

`retail-catalog.ts` exports the Inventory-owned `inventoryRetailCatalog` service.
The composition root injects it into the standalone Retail plugin. It creates a
missing organization variant with menu availability/export disabled and preserves
existing menu rows. Its caller must own the transaction and enforce Retail access.
No shared master creation or price changes are performed. Its variation-creation
method creates/reuses variants under an existing master using canonical attributes.

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
