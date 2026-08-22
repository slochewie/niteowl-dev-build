import type {
  AdminPluginCatalogItem
} from "@/lib/admin/plugins"

import {
  PluginCard
} from "./plugin-card"

export function PluginCatalog({
  plugins
}: {
  plugins:
    AdminPluginCatalogItem[]
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {plugins.map(
        (plugin) => (
          <PluginCard
            key={plugin.id}
            plugin={plugin}
          />
        )
      )}
    </div>
  )
}
