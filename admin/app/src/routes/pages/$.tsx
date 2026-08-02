import { createFileRoute, notFound } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { normalizePath } from "@btst/stack/client"
import { RouteRenderer } from "@btst/stack/client/components"
import { getStackClient } from "@/lib/stack-client"

export const Route = createFileRoute("/pages/$")({
  ssr: true,
  component: BtstPagesRoute,

  loader: async ({ params, context }) => {
    const routePath = normalizePath(params._splat)
    const route = getStackClient(context.queryClient).router.getRoute(routePath)

    if (!route) {
      throw notFound()
    }

    if (route.loader) {
      await route.loader()
    }

    return {
      meta: route.meta?.(),
    }
  },

  head: ({ loaderData }) => {
    if (!loaderData?.meta || !Array.isArray(loaderData.meta)) {
      return {
        title: "No Meta",
        meta: [{ title: "No Meta" }],
      }
    }

    return {
      meta: loaderData.meta,
    }
  },
})

function BtstPagesRoute() {
  const params = Route.useParams()
  const { queryClient } = Route.useRouteContext()
  const routePath = normalizePath(params._splat)
  const router = getStackClient(queryClient).router
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <RouteRenderer
      router={router}
      path={routePath}
      onError={(error) => {
        console.error("BTST route error:", error)
      }}
      onNotFound={() => {
        throw notFound()
      }}
    />
  )
}
