# 7shifts API Better Auth plugin

Connects NiteOwl Auth to the 7shifts API, stores encrypted source credentials, discovers upstream locations, previews synchronization, and reconciles workforce data into Better Auth plus the normalized 7shifts models.

## Registration

```ts
sevenShiftsApi({
  pool,
  encryptionKey: env.integrationEncryptionKey,
})
```

The encryption key protects stored API access tokens. Keep it stable; changing it without migrating ciphertext makes existing source credentials unreadable.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/seven-shifts-api/sources` | List API sources without exposing plaintext tokens. |
| `POST` | `/seven-shifts-api/sources/create` | Create a named source and encrypt its token. |
| `POST` | `/seven-shifts-api/sources/update` | Update source metadata or credentials. |
| `POST` | `/seven-shifts-api/sources/test` | Validate a source against 7shifts. |
| `GET` | `/seven-shifts-api/sources/locations` | List upstream locations for mapping. |
| `POST` | `/seven-shifts-api/sources/sync-preview` | Preview synchronization effects. |
| `POST` | `/seven-shifts-api/sources/sync` | Synchronize workforce data. |
| `POST` | `/seven-shifts-api/sources/delete` | Delete a source. |
| `POST` | `/seven-shifts-api/sources/unassign` | Remove an organization/source-location mapping. |
| `POST` | `/seven-shifts-api/sources/assign` | Assign a source/location to an organization. |

## Data model

- `sevenShiftsApiSource` — encrypted access token, company identity, API version, and test/sync metadata.
- `sevenShiftsApiOrganizationSource` — NiteOwl organization to 7shifts source/location mapping.

The plugin writes normalized workforce records through the core `seven-shifts` model and updates extended user/membership state through shared helpers where appropriate.

## Relationship to schedules

`seven-shifts-schedules` reuses the source credentials and organization/location mappings defined here. Deleting or remapping a source therefore affects later schedule synchronization as well as workforce sync.

## Security and operations

- Never log, return, or commit access tokens or the encryption key.
- Run sync preview before synchronization after changing mappings.
- Review user disable/reactivation and membership effects before applying large syncs.
- External 7shifts updates are side effects; keep any upstream-write behavior tightly authorized.
