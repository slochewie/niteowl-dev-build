# MQTT Better Auth plugin

Provides reusable MQTT broker configuration and organization-scoped topic assignments for NiteOwl applications and managed devices.

The plugin separates a reusable broker definition from the organization assignment that chooses a topic prefix. Broker credentials are encrypted at rest with the shared integration encryption key.

## Registration

```ts
mqttIntegration({
  pool,
  encryptionKey: env.integrationEncryptionKey,
})
```

## Data model

### `mqttBrokerSource`

Stores a reusable broker connection:

- `name`;
- native MQTT `host`, `port`, and `protocol` (`mqtt` or `mqtts`);
- optional WebSocket `websocketHost`, `websocketPort`, and `websocketProtocol` (`ws` or `wss`);
- optional `username` and encrypted `password`;
- `enabled` state.

The native MQTT endpoint and WebSocket endpoint describe alternate transports to the same logical broker. Server-side consumers may use the native endpoint when reachable. Browser-facing or reverse-proxy deployments may require the WebSocket endpoint.

### `mqttOrganizationSource`

Assigns a broker source to an organization and stores:

- `organizationId`;
- `sourceId`;
- `topicPrefix`;
- `enabled` state.

When no custom prefix is supplied, the plugin defaults to:

```text
organizations/<organizationId>/
```

The stored prefix is normalized to end with `/`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/mqtt/sources` | List broker sources and their organization assignments. |
| `GET` | `/mqtt/organization-sources` | List MQTT sources assigned to one organization. |
| `POST` | `/mqtt/sources/create` | Create a broker source. |
| `POST` | `/mqtt/sources/update` | Update a broker source. |
| `POST` | `/mqtt/sources/assign` | Assign a broker source to an organization and configure its topic prefix. |
| `POST` | `/mqtt/sources/unassign` | Remove an organization assignment from a broker source. |
| `DELETE` | `/mqtt/sources/delete` | Delete an unassigned broker source. |

Global admins manage broker sources and assignments. Admin viewers may read the global configuration.

## Credentials

MQTT passwords are encrypted before persistence with `INTEGRATION_ENCRYPTION_KEY`. Read APIs expose only whether a password is saved; they do not return the plaintext password.

Trusted internal provisioning endpoints in other plugins may decrypt the password when required for backend-to-backend operation. Never forward a decrypted broker password to an untrusted browser client.

## Counter integration

The Counter provisioning endpoint uses the enabled organization MQTT assignment as its required transport configuration. It returns both native MQTT fields and optional WebSocket fields so the Counter backend can choose an appropriate transport.

WiFi configuration is independent of MQTT. A Counter organization does not need a WiFi network in order to use Counter App or MQTT.

## Plugin catalog count

The Plugins & APIs catalog counts an organization as MQTT-enabled when it has an enabled assignment to an enabled broker source. The count is derived from MQTT configuration rather than `organizationIntegration.enabled`.
