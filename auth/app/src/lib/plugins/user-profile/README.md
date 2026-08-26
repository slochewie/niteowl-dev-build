# User Profile Better Auth plugin

Adds an application-specific, one-to-one profile record to each Better Auth user and exports PostgreSQL helpers used by workforce integrations.

## Registration

```ts
import { userProfile } from "./src/lib/plugins/user-profile/index.js";

const plugins = [userProfile({ pool })];
```

The plugin itself declares schema only. Profile reads and writes are performed through the exported helpers using the same PostgreSQL pool.

## Exported API

- `getUserProfile(pool, userId)` returns the profile or `null`.
- `upsertUserProfile(pool, userId, fields)` creates a profile or merges provided fields into the existing profile.
- `UserProfile` describes the complete stored record.
- `UserProfileFields` describes optional fields accepted by the upsert helper.

## Data model

`userProfile.userId` is unique, references Better Auth's `user.id`, and cascades on user deletion. Optional fields cover legal/preferred names, pronouns, birthdate, phone numbers, address, and emergency contact details. The model also stores creation and update timestamps.

## Example

```ts
await upsertUserProfile(pool, userId, {
  firstName: "Avery",
  preferredFirstName: "Avery",
  mobilePhone: "+15555550123",
});

const profile = await getUserProfile(pool, userId);
```

Only supplied fields are changed; omitted fields retain their previous values.

## Privacy and security

Profiles contain personal information. Apply authorization at every caller, minimize logging, avoid returning unnecessary fields, and follow the application's retention and deletion requirements. Do not expose these helpers directly as unauthenticated endpoints.

