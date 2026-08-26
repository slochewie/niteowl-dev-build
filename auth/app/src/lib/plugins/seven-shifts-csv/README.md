# 7shifts CSV Better Auth plugin

Imports 7shifts CSV exports into Better Auth and the shared normalized 7shifts workforce model. It manages named import sources, organization assignments, uploaded files, selected files, reconciliation, and generated onboarding credentials.

## Registration

```ts
import { sevenShiftsCsv } from "./src/lib/plugins/seven-shifts-csv/index.js";

const plugins = [sevenShiftsCsv({ pool, storageRoot })];
```

`storageRoot` must be a writable runtime directory outside version control. In this application, CSV import data and generated credential files are intentionally ignored by Git.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/seven-shifts-csv/sources` | List named CSV sources and organization assignments. |
| `POST` | `/seven-shifts-csv/sources/create` | Create an import source. |
| `POST` | `/seven-shifts-csv/sources/rename` | Rename a source. |
| `POST` | `/seven-shifts-csv/sources/assign` | Assign or unassign an organization. |
| `GET` | `/seven-shifts-csv/files` | List files stored for a source. |
| `POST` | `/seven-shifts-csv/upload` | Upload and store a CSV export. |
| `POST` | `/seven-shifts-csv/select` | Select the file used by the next import. |
| `POST` | `/seven-shifts-csv/import` | Parse and reconcile the selected export. |

## Data model and filesystem

The Better Auth schema stores CSV sources and organization/source assignments. Uploaded CSVs, selection metadata, reports, and generated password/credential files live beneath `storageRoot`, not in the database.

Imports can create or update users, memberships, locations, roles, assignments, and profile records. They can also disable missing employees or remove stale assignments depending on the implemented reconciliation path.

## Security and operations

- CSV exports contain personal data; restrict filesystem and administrative access.
- Generated password/credential files are especially sensitive and must never be committed.
- Back up the database and run imports against a test organization when changing column mapping.
- Review the import report counts, especially disabled users and removed memberships/assignments.
- Ensure upload filenames cannot escape `storageRoot`; keep the existing basename/path validation intact.

