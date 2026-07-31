import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"

import globalsCss from "@/styles/globals.css?url"
import type { MyRouterContext } from "@/router"
import { getOrCreateQueryClient } from "@/lib/query-client"

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [{ rel: "stylesheet", href: globalsCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  const queryClient = getOrCreateQueryClient()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
