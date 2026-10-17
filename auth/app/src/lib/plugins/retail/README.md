# Retail Better Auth plugin

Standalone, explicit Retail assortment over the existing Inventory catalog.
Registered with `enabled: false`; no organization is activated by this change.
The user applied the reviewed schema migration and PostgreSQL uniqueness index.
Read-only verification confirmed all eight Retail tables, 11 foreign keys and the
expected initial indexes. The user also applied the three-table stock migration;
read-only verification confirmed seven stock indexes, seven restrictive foreign keys,
and empty operation/balance/movement tables. All 421 existing variants remain menu-eligible with null variation
keys. No organization configuration or enrollment was created; Retail stays disabled.

## Initial endpoints

All endpoints require Better Auth sessions.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /retail/access | Effective organization Retail capabilities |
| GET | /retail/assignments | List active organization members and stored assignments |
| PATCH | /retail/assignment | Replace a member assignment and its capabilities |
| GET | /retail/catalog | Organization enrollments, including disabled rows, SKUs and barcodes |
| GET | /retail/identifiers | Read an enrollment’s SKU and barcode mappings |
| PATCH | /retail/sku | Set, replace, or clear an organization SKU |
| POST | /retail/barcode | Add an organization barcode mapping |
| POST | /retail/barcode/remove | Remove an organization barcode mapping |
| GET | /retail/barcode/lookup | Resolve an active sellable variant within an organization |
| POST | /retail/variant | Create/reuse an attribute combination under an existing master and enroll it |
| POST | /retail/organization-variant | Idempotently enroll an existing active shared variant |
| POST | /retail/organization-variant/disable | Disable enrollment without deleting history |

POST enrollment accepts only organizationId and inventoryItemVariantId.
Disable accepts organizationId and retailOrganizationVariantId.
Enrollment requests cannot change price, menu destination or identifiers.
Identifiers and stock use separate endpoints below. Supplier writes are not implemented.

## Ownership

retailOrganizationVariant has a unique, restrictive foreign key to
inventoryOrganizationVariant.id. Organization and shared variant ownership
are derived through that parent; there is no duplicate organization/item owner.
This is a normalization refinement of the earlier proposed composite relationship.
SKU/barcode and stock metadata reference this stable enrollment ID.

The Inventory-owned injected catalog service locks active master/variant records,
creates a missing organization variant with enabled=false and exportToToast=false,
and preserves existing rows through ON CONFLICT DO NOTHING. Enrollment and neutral
parent creation share one transaction. Retrying enrollment preserves existing
enabled/disabled state; reactivation is intentionally not exposed yet.

Retail catalog reads include only explicit organization enrollments and reuse
existing organization price overrides and shared variant default prices.

## Organization SKUs and multiple barcodes

retailSku holds at most one SKU per enrollment, unique on (organizationId, sku).
PATCH /retail/sku accepts organizationId, retailOrganizationVariantId and sku.
A null SKU clears the mapping; clearing is allowed on disabled enrollments.
SKU values normalize Unicode, trim whitespace and uppercase to 1–80 ASCII
letters/digits with dot, slash, underscore or hyphen after the first character.
Replacement retains the SKU record ID; an identical retry is a no-op.

retailBarcode supports multiple records per enrollment, unique on
(organizationId, barcode). Values remain text, preserving leading zeros and case.
Only trimmed, printable ASCII values without spaces (1–128 characters) are accepted.
Symbology is optional metadata: unspecified, upc-a, ean-13, ean-8, code-128,
code-39 or qr. This slice does not validate symbology checksums or payload standards.
Identical add retries preserve the mapping ID; ownership/symbology conflicts return
409. Removal accepts organizationId and barcodeId and audits the removed mapping.

Reads require retail:read; mutations require retail:item:write. New identifiers
require an enabled enrollment with active shared master/variant. Existing mappings
remain reserved on disabled items until explicitly cleared/removed. Listing permits
disabled enrollments for administration; scanner lookup returns only active items.

Identifier organizationId supplies the uniqueness scope. Enrollment-derived
organization remains authoritative: all writes validate that relationship, and
lookup/catalog queries match both stored and derived organization IDs. Separate
foreign keys do not themselves enforce equality across those parent relationships;
these services must own identifier writes. There is no database RLS boundary here.

Mutations share the existing organization write lock and transaction-level
permission recheck. Database uniqueness violations return 409. Identifier changes
and revisionHistory snapshots commit or roll back together. Inventory menu fields
are never updated. Merge rebinding retains the enrollment ID, so identifier foreign
keys survive without copying mappings; duplicate-enrollment merges still conflict.

## Canonical product variations

POST /retail/variant accepts organizationId, inventoryItemId, and attributes such
as {"size":"M","color":"Red"}. It does not create a new master catalog or master
item. The Inventory-owned service creates/reuses inventoryItemVariant and enrolls
it atomically, preserving existing organization rows.

One to eight attributes are required. Names and values normalize Unicode, case,
and surrounding whitespace; names sort deterministically. The canonical JSON is
stored once as inventoryItemVariant.variationKey, with a non-unique lookup index on
(inventoryItemId, variationKey). Better Auth rejects portable unique indexes containing
nullable fields. The Inventory service locks the master row before checking/creating
a combination; this serializes supported writes. PostgreSQL additionally enforces
non-null combination uniqueness through the separately applied partial unique index
inventoryItemVariant_master_variation_key_uidx. This index is not declared in the
portable Better Auth schema and must be provisioned separately on fresh databases.
Direct canonical writes must not bypass the service or the locked merge transaction.
Nullable legacy keys retain existing identities.
Attributes cannot duplicate existing kind, ounce-size, package, or pricing fields.
New combinations are explicitly menuEligible=false. Existing combinations are
reused without changing eligibility, pricing or active state; inactive matches
return 409. No attribute-editing endpoint is provided.

Catalog responses expose decoded attributes. No-attribute products can use the
existing enrollment endpoint; creating their masters/variants is not provided yet.

## Capabilities and assignments

Both the registration gate and retailOrganizationConfig.enabled must be true.
Until all Retail tables, menuEligible, and variationKey exist, access fails closed.
Banned users, inactive/expired memberships and disabled organizations are rejected.
System admins and active organization owners/admins receive all capabilities.
Other active members require an enabled Retail assignment. Global admin-viewer has
no special Retail privilege; it may act only through ordinary explicit membership
grants. Inventory assignments do not grant Retail access.

Capabilities are independent:

| Capability | Current enforcement |
| --- | --- |
| retail:read | Organization catalog and authorized location stock reads |
| retail:item:write | Enroll, disable, and create product variations |
| retail:manage | List and replace capability assignments |
| retail:stock:adjust | Adjust stock at explicitly authorized locations |
| retail:stock:transfer | Transfer stock with authority at both locations |
| retail:receive | Reserved for receiving |
| retail:purchase | Reserved for purchasing |
| retail:cost:read | Reserved for purchase-cost visibility |

Unknown persisted capabilities grant nothing. No capability implies another.
Receiving, purchasing and cost endpoints are not implemented. Location scopes and stock operations are described below.

retailAssignment references member.id uniquely. Its organization/user ownership is
derived from membership; membership deletion cascades through the assignment and
retailAssignmentCapability rows. Rejoining with a new membership does not resurrect
old grants. Capabilities are unique per assignment, and assignments default disabled.

PATCH /retail/assignment accepts organizationId, userId, enabled, and capabilities.
It replaces the complete stored capability set. Disabled assignments retain their
stored capabilities for administration but grant no effective access. Assignment
listing reports stored capabilities for ordinary members and implicit grants for
protected administrators.

Self-editing and modifications to organization/system administrators are rejected.
Delegated managers cannot grant retail:manage, edit an existing Retail manager, or
modify/grant capabilities outside their own set. Organization/system admins may
manage delegated managers. Target membership must be active, unexpired, non-banned,
and belong to the requested organization.

All Retail mutations serialize on an organization advisory transaction lock and
recheck actor access after acquiring it. Grant replacement and revisionHistory
auditing share that transaction; any error rolls back the change.

## Locations and location scopes

retailLocation belongs to organization.id. Codes normalize to uppercase ASCII
letters/digits/underscore/hyphen (1–40 characters) and are unique per organization.
Names normalize Unicode and trim whitespace (1–120 characters). Codes and ownership
are immutable through these endpoints. Archive/reactivate through PATCH; no deletes.
Archived locations retain grants and history but grant no operational access.
Reactivation restores retained scopes. Organization deletion is restricted by locations.

retailAssignmentCapability.allLocations defaults false. retailLocationGrant references
a capability row and location, unique on (assignmentCapabilityId, locationId). Grants
cascade when a capability is removed, and location deletion is restricted. Ownership
derives through capability -> assignment -> member. Services validate that membership
and location share an organization; separate foreign keys do not enforce that equality.
No RLS is provided. All location/grant writes must use these services.

Location authority intersects effective organization capabilities with an explicit
location grant or allLocations. The latter explicitly includes future locations in
the same organization. Ordinary members default to no location authority. Owners,
organization admins and system admins have implicit location authority after existing
Retail gating. Scope applies to read, stock:adjust, stock:transfer, receive, purchase,
and cost:read capabilities (all prefixed retail:). Catalog/identifier access stays
organization-wide; location access does not grant otherwise missing capabilities.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /retail/locations | Active locations authorized for retail:read |
| GET | /retail/locations/manage | Administrative list including archived locations |
| POST | /retail/location | Create organization location (code, name) |
| PATCH | /retail/location | Replace name and active state by locationId |
| GET | /retail/location-access | Current user's effective capabilities for locationId |
| GET | /retail/location-grants | Stored scopes for userId, including disabled assignments |
| PATCH | /retail/location-grant | Replace one capability's scope for userId |

All requests include organizationId. Location/grant administration requires an
organization/system administrator, not delegated retail:manage alone. Scope replacement
accepts capability, allLocations, locationIds (maximum 200 distinct active local IDs).
allLocations:true requires an empty locationIds list. False plus an empty list revokes
location scope. Targets need an enabled assignment carrying that capability; protected
administrators, self-editing, inactive or expired members and banned users are rejected.

Assignment saves preserve retained capability IDs and location scopes. Removing a
capability cascades its grants; re-adding defaults to no location scope. Disabled
assignments retain scopes without effective access. Delegated managers cannot edit or
reactivate assignments carrying any location scope; administrators manage those.
Location and grant mutations use the organization transaction lock and authorization
recheck, with atomic revisionHistory auditing. Scope revisions include before/after.
Stock writes call requireRetailLocationAccess inside that transaction;
transfers check both source and destination before any stock writes.

Schema readiness requires the location tables and allLocations column as well as the
previous Retail/Inventory fields. Keep the registration gate disabled until review.

## Stock ledger and balances (schema deployment verified)

retailStockOperation owns organization-scoped idempotency keys, request fingerprints,
operation kind, reason and actor. The key is unique on (organizationId, idempotencyKey).
retailStockBalance references existing Retail enrollment and location, unique on that
pair. retailStockMovement references operation, enrollment and location and stores
signed delta and the resulting quantity. Its unique (operationId, locationId,
retailOrganizationVariantId) index prevents duplicate lines within one operation.
All stock foreign keys restrict deletion, including actorUserId -> user.id, to preserve
history. The declaration creates operation/balance before movement and follows existing
location/enrollment models. No new catalog, item owner, menu price or cost is introduced.

Organization ownership is derived from enrollment and location, while operations carry
organizationId for idempotency scope. Services validate all three agree and read queries
join those relationships explicitly. Independent foreign keys alone do not enforce that
equality. Balances are nonnegative whole sellable units up to 2,147,483,647. Fractional
units and negative inventory are rejected. Missing balances mean zero; a failed negative
adjustment does not leave a newly initialized row behind.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /retail/stock/adjust | Signed quantityDelta at locationId |
| POST | /retail/stock/transfer | Positive quantity from sourceLocationId to destinationLocationId |
| GET | /retail/stock/balances | Authorized location balances, including disabled enrollments |
| GET | /retail/stock/movements | Authorized location ledger, newest first |

Writes require organizationId, retailOrganizationVariantId, idempotencyKey and reason
(trimmed 3–500 characters). Keys are case-sensitive ASCII letters/digits/dot/underscore/
colon/hyphen, 1–128 characters, starting with a letter/digit. Adjustments require
retail:stock:adjust; transfers require retail:stock:transfer at BOTH distinct active
locations. New operations require an enabled enrollment and active shared master/variant.

All stock mutation, receipt lookup and auditing share the existing organization advisory
transaction lock. Location authority is rechecked after the lock. Balances lock in stable
location order, both resulting transfer quantities validate before ledger insertion,
and movements, balances, operation and revisionHistory commit or roll back together.
Transfer deltas sum to zero. An audit or second movement failure rolls back both sides.

The request fingerprint fixes kind, enrollment, locations, quantity and normalized
reason. An identical retry returns the original operationId and movement quantities
with replayed:true, without additional stock changes or audit. A changed payload under
the same organization/key returns 409, even across adjustment and transfer endpoints.
Retries still require current authority at all involved active locations, but may return
an existing receipt after an enrollment is disabled. Idempotency is organization-wide;
another currently authorized actor may retry the same request. Failed transactions do
not reserve keys. A committed operation with an incomplete receipt fails closed.

Reads require retail:read at locationId. They expose no other location's lines or costs.
limit defaults 100, maximum 200. Balance pagination uses afterId and nextAfterId. Movement
pagination uses a complete before/beforeId pair and returns next; timestamps preserve
PostgreSQL microseconds to avoid dropping rows between pages. Archived locations deny
these operational reads; historical administrative access can be added separately.

Ledger operations have no update/delete endpoints. This is append-only service behavior,
not a PostgreSQL trigger or RLS guarantee. Quantity bounds and cross-parent organization
consistency are service-enforced. Direct SQL/adapter writes must not bypass this service.
No reservations, receiving, sales deduction, reversal endpoint, costing, purchase orders
or synchronization workers are implemented. Corrections use a new signed adjustment
with its own key and reason; historical movement rows remain unchanged.

The user applied the reviewed migration for retailStockOperation, retailStockBalance
and retailStockMovement. Read-only verification confirmed all required fields, seven
declared indexes and seven restrictive foreign keys. All three tables are empty.
Retail registration remains disabled and no organization is enabled. Access fails
closed if these tables are absent on another deployment. No stock writes, activation
or Auth restart were performed during implementation or verification.

## Rollout

There is no activation/configuration-write endpoint. Keep the registration gate false
until migration SQL and the merge conflict policy have been reviewed. Inventory now
invokes an injected Retail participant before deleting duplicate organization variants.
A source-only enrollment is rebound with its ID and enabled state preserved. If both
parents have enrollments, the merge returns 409 and rolls back; no automatic enrollment
deletion or history consolidation occurs. Unchanged organization-variant IDs need no
rebind. Before Retail tables exist the participant is a no-op. Cross-assortment merges
remain blocked by menu eligibility until explicit promotion/variation policy exists.

inventoryOrganizationConfig.retailEnabled remains the existing menu-category setting.
It is not the Retail feature gate.

## Migration review notes

The pre-migration read-only inspection found all eight Retail tables absent and both
Inventory variant fields absent. Expected scope: eight new Retail tables,
inventoryItemVariant.menuEligible (required, default true), nullable variationKey,
and a non-unique lookup index on (inventoryItemId, variationKey). The portable schema
does not enforce canonical combination uniqueness; supported writes serialize on the
master row. The user separately applied the reviewed PostgreSQL partial unique index.
Read-only inspection confirmed it is unique, valid and ready, covers
(inventoryItemId, variationKey), and has WHERE variationKey IS NOT NULL.
Fresh databases require this additional index after the portable migration. Legacy menu variants must retain
menuEligible=true. Inspect the full CLI proposal for unrelated plugin changes too.

Better Auth 1.7.2's installed planner emits plugin tables in declaration order when
no explicit order is supplied. Enrollment is declared before SKU/barcode child tables;
assignment precedes capability, and both capability/location precede location grants.
The installed planner emits static defaults for added columns but not for new-table
columns. Raw capability INSERTs explicitly set allLocations=false; other Retail raw
writes likewise supply required state fields. Do not assume schema defaultValue means
a new PostgreSQL table column has a DEFAULT clause. Review actual CLI SQL before apply.

The planner executes migration statements sequentially without wrapping the entire
plan in one transaction. A later failure may leave earlier statements applied.
Do not auto-confirm the CLI proposal. Schema review does not activate Retail, create
organization configuration, or restart Auth. The user applied the reviewed migration
and partial unique index; this session verified them using read-only queries.

## Validation

```bash
node --test src/lib/plugins/retail/*.test.ts src/lib/plugins/inventory/*.test.ts
```
