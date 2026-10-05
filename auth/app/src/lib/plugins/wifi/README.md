# WiFi Better Auth plugin

Stores organization-scoped WiFi networks and encrypted credentials for managed-device provisioning.

WiFi is infrastructure metadata for devices that need network credentials during provisioning. It is not an application-access requirement and is not required for Counter App or MQTT operation.

## Registration

```ts
wifiIntegration({
  pool,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

### `wifiNetwork`

Each network belongs directly to one organization and stores:

- `organizationId`;
- display `name`;
- `ssid`;
- optional encrypted `password`;
- `hidden` flag;
- `enabled` state.

An organization may have multiple saved networks. SSIDs are unique per organization, case-insensitively.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/wifi/networks` | List all saved WiFi networks for global administration. |
| `GET` | `/wifi/organization-networks` | List saved networks for one organization. |
| `POST` | `/wifi/networks/create` | Create an organization WiFi network. |
| `POST` | `/wifi/networks/update` | Update a saved network, including password preservation/clearing. |
| `DELETE` | `/wifi/networks/delete` | Delete a saved network. |

Global admins can manage all organizations. Organization owners/admins can manage their own organization's networks. Read-only admin access may inspect configuration without revealing saved passwords.

## Credentials

Passwords are encrypted before persistence with `INTEGRATION_ENCRYPTION_KEY`. Normal read APIs return `hasPassword` instead of plaintext credentials.

Trusted device-provisioning flows may decrypt saved credentials server-side. Do not expose decrypted WiFi passwords to untrusted browser clients.

## Counter relationship

Counter provisioning can include enabled WiFi networks in its trusted internal response, but WiFi is optional. If an organization has no enabled WiFi networks, Counter provisioning still succeeds as long as the Counter definition and MQTT configuration are valid.

This allows Counter App to operate entirely through MQTT while preserving WiFi credentials for future hardware provisioning, such as M5Stack/M5 Stopwatch devices.

## Plugin catalog count

The Plugins & APIs catalog counts distinct organizations that have at least one enabled `wifiNetwork`. The count is derived from saved WiFi configuration rather than `organizationIntegration.enabled`.
