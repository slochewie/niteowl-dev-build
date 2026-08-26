# 7shifts API Better Auth plugin

Connects NiteOwl to the 7shifts API, stores encrypted source credentials, previews synchronization, and imports workforce data into the normalized 7shifts and Better Auth models.

## Registration

```ts
import { sevenShiftsApi } from "./src/lib/plugins/seven-shifts-api/index.js";

const plugins = [sevenShiftsApi({ pool, encryptionKey })];
```

`encryptionKey` protects stored API access tokens. Supply a stable secret from the runtime environment; changing it makes existing encrypted tokens unreadable.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/seven-shifts-api/sources` | List API sources without exposing plaintext tokens. |
| `POST` | `/seven-shifts-api/sources/create` | Create a named source and encrypt its token. |
| `POST` | `/seven-shifts-api/sources/update` | Update source metadata or credentials. |
| `POST` | `/seven-shifts-api/sources/test` | Validate a source against 7shifts. |
| `GET` | `/seven-shifts-api/sources/locations` | List upstream locations for assignment. |
| `POST` | `/seven-shifts-api/sources/sync-preview` | Preview synchronization effects. |
| `POST` | `/seven-shifts-api/sources/sync` | Synchronize workforce data. |
| `POST` | `/seven-shifts-api/sources/assign` | Assign a 7shifts location/source to an organization. |

## Data model

`sevenShiftsApiSource` stores encrypted access tokens, company identity, API version, and test/sync timestamps. `sevenShiftsApiOrganizationSource` maps a Better Auth organization to a source and upstream 7shifts location.

The plugin depends on the core `seven-shifts` models and uses `user-profile` helpers while reconciling employee profile data.

## Security and operations

- Never log, return, or commit access tokens or the encryption key.
- Run preview before synchronization after changing mappings.
- Keep the encryption key stable and backed up in the deployment secret store.
- Review bidirectional updates carefully; upstream user updates are external side effects.
- Test with a non-production 7shifts company before changing reconciliation behavior.

