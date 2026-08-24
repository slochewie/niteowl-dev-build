export const INTEGRATION_IDS = [
  "seven-shifts-csv",
  "seven-shifts-api",
  "unifi-api",
  "glauth",
  "unifi-ldap"
] as const

export type IntegrationId =
  (typeof INTEGRATION_IDS)[number]

export const PLANNED_INTEGRATION_IDS = [
  "toast-api",
  "paychex-api",
  "wifi",
  "mqtt",
  "counter"
] as const

export type PlannedIntegrationId =
  (typeof PLANNED_INTEGRATION_IDS)[number]

export type CatalogIntegrationId =
  | IntegrationId
  | PlannedIntegrationId

export type IntegrationDefinition = {
  id: CatalogIntegrationId
  name: string
  description: string
  category: string
  configurationLabel: string
  status: "available" | "planned"
}

export const INTEGRATIONS =
  [
    {
      id: "seven-shifts-csv",
      name: "7shifts CSV",
      description:
        "Import workforce data from 7shifts CSV exports.",
      category: "Workforce",
      configurationLabel: "CSV Upload",
      status: "available"
    },
    {
      id: "seven-shifts-api",
      name: "7shifts API",
      description:
        "Synchronize workforce data directly with the 7shifts API.",
      category: "Workforce",
      configurationLabel: "API Token",
      status: "available"
    },
    {
      id: "unifi-api",
      name: "UniFi API",
      description:
        "Connect an organization to its UniFi console and Identity services.",
      category: "Network",
      configurationLabel: "API Connection",
      status: "available"
    },
    {
      id: "glauth",
      name: "GLAuth",
      description:
        "Project Better Auth identities into lightweight LDAP directories.",
      category: "Identity",
      configurationLabel: "LDAP Directories",
      status: "available"
    },
    {
      id: "unifi-ldap",
      name: "UniFi LDAP",
      description:
        "Connect UniFi Identity to an LDAP directory and assign organizations to LDAP connections.",
      category: "Network",
      configurationLabel: "LDAP Sources",
      status: "available"
    },
    {
      id: "toast-api",
      name: "Toast",
      description:
        "Connect restaurant and workforce data to Toast through its API.",
      category: "Restaurant",
      configurationLabel: "OAuth / API Credentials",
      status: "planned"
    },
    {
      id: "paychex-api",
      name: "Paychex",
      description:
        "Connect payroll and employee data through Paychex APIs.",
      category: "Workforce",
      configurationLabel: "API Credentials",
      status: "planned"
    },
    {
      id: "wifi",
      name: "WiFi",
      description:
        "Store organization WiFi networks for managed device provisioning.",
      category: "Infrastructure",
      configurationLabel: "Networks & Credentials",
      status: "planned"
    },
    {
      id: "mqtt",
      name: "MQTT",
      description:
        "Configure reusable MQTT broker connections and organization topics.",
      category: "Infrastructure",
      configurationLabel: "Broker & Topics",
      status: "planned"
    },
    {
      id: "counter",
      name: "Counter",
      description:
        "Manage NiteOwl capacity counters and their organization settings.",
      category: "Application",
      configurationLabel: "Counter Settings",
      status: "planned"
    }
  ] as const satisfies readonly IntegrationDefinition[]

export function getIntegration(
  id: string
): IntegrationDefinition | undefined {
  return INTEGRATIONS.find(
    (integration) =>
      integration.id === id
  )
}

export function isAvailableIntegrationId(
  id: string
): id is IntegrationId {
  return (
    INTEGRATION_IDS as readonly string[]
  ).includes(id)
}
