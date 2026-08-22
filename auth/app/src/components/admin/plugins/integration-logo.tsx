import type {
  CatalogIntegrationId
} from "@/lib/plugins/integration-manager/registry"

type IntegrationLogoProps = {
  pluginId: CatalogIntegrationId
  name: string
}

const logoSources:
  Partial<
    Record<
      CatalogIntegrationId,
      string
    >
  > = {
    "seven-shifts-csv":
      "/branding/integrations/7shifts.png",

    "seven-shifts-api":
      "/branding/integrations/7shifts.png",

    "unifi-api":
      "/branding/integrations/unifi.svg",

    "unifi-ldap":
      "/branding/integrations/unifi.svg",

    "toast-api":
      "/branding/integrations/toast.svg",

    "paychex-api":
      "/branding/integrations/paychex.png",

    counter:
      "/branding/integrations/counter.png"
  }

export function IntegrationLogo({
  pluginId,
  name
}: IntegrationLogoProps) {
  const source =
    logoSources[pluginId]

  if (!source) {
    return null
  }

  if (
    pluginId ===
    "paychex-api"
  ) {
    return (
      <div className="flex h-10 min-w-[112px] shrink-0 items-center">
        <img
          src={source}
          alt={name}
          className="h-7 w-auto object-contain"
        />
      </div>
    )
  }

  return (
    <div className="flex size-10 shrink-0 items-center justify-center">
      <img
        src={source}
        alt={name}
        className="size-8 object-contain"
      />
    </div>
  )
}
