import {
  createFileRoute
} from "@tanstack/react-router"

import {
  PluginCatalog
} from "@/components/admin/plugins/plugin-catalog"
import {
  getAdminPluginCatalog
} from "@/lib/admin/plugins"

export const Route =
  createFileRoute(
    "/_app/plugins/"
  )({
    loader: async () => {
      const plugins =
        await getAdminPluginCatalog()

      return {
        plugins
      }
    },

    component:
      PluginsPage
  })

function PluginsPage() {
  const {
    plugins
  } = Route.useLoaderData()

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-6 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Plugins & APIs
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage integrations available to your organizations
        </p>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <PluginCatalog
          plugins={plugins}
        />
      </div>
    </div>
  )
}
