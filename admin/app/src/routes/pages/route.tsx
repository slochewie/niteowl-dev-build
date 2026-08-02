import { authClient } from "@/lib/auth-client"
import {
  createFileRoute,
  Link as RouterLink,
  Outlet,
  useRouter,
} from "@tanstack/react-router"
import { StackProvider } from "@btst/stack/context"
import { QueryClientProvider } from "@tanstack/react-query"

export const Route = createFileRoute("/pages")({
  component: BtstPagesLayout,
})

function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  if (typeof process !== "undefined") {
    return (
      process.env.VITE_BASE_URL ??
      process.env.BASE_URL ??
      "http://localhost:3000"
    )
  }

  return "http://localhost:3000"
}

function BtstPagesLayout() {
  const router = useRouter()
  const { queryClient } = Route.useRouteContext()
  const baseURL = getBaseURL()

  const navigate = (path: string) => {
    void router.navigate({
      href: path,
    })
  }

  const replace = (path: string) => {
    void router.navigate({
      href: path,
      replace: true,
    })
  }

  const onSessionChange = () => {
    void router.invalidate()
  }

  const Link = ({
    href,
    to,
    ...props
  }: {
    href?: string
    to?: string
    [key: string]: unknown
  }) => <RouterLink to={href ?? to ?? "#"} {...props} />

  return (
    <QueryClientProvider client={queryClient}>
      <StackProvider
        basePath="/pages"
        overrides={{
          blog: {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            navigate,
            Link,
            uploadImage: async () => {
              throw new Error(
                "TODO: implement blog.uploadImage override in src/routes/pages/route.tsx",
              )
            },
          },

          cms: {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            navigate,
            Link,
          },

          "form-builder": {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            navigate,
            Link,
          },

          "ui-builder": {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            navigate,
            Link,
          },

          kanban: {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            navigate,
            Link,
            uploadImage: async () => {
              throw new Error(
                "TODO: implement kanban.uploadImage override in src/routes/pages/route.tsx",
              )
            },
            resolveUser: async () => null,
            searchUsers: async () => [],
          },

          comments: {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
          },

          media: {
            apiBaseURL: baseURL,
            apiBasePath: "/api/data",
            queryClient,
            navigate,
            Link,
          },

          auth: {
            authClient,
            navigate,
            replace,
            onSessionChange,
            Link,
            basePath: "/pages/auth",
            redirectTo: "/pages/account/settings",
          },

          account: {
            authClient,
            navigate,
            replace,
            onSessionChange,
            Link,
            basePath: "/pages/account",
            account: {
              fields: ["image", "name"],
            },
          },

          organization: {
            authClient,
            navigate,
            replace,
            onSessionChange,
            Link,
            basePath: "/pages/org",
            organization: {
              basePath: "/pages/org",
            },
          },
        }}
      >
        <Outlet />
      </StackProvider>
    </QueryClientProvider>
  )
}
