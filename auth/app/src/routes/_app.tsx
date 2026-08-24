import {
  ensureSession as ensureSessionClient
} from "@better-auth-ui/react"
import {
  ensureSession as ensureSessionServer
} from "@better-auth-ui/react/server"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect
} from "@tanstack/react-router"
import {
  createIsomorphicFn
} from "@tanstack/react-start"
import {
  getRequestHeaders
} from "@tanstack/react-start/server"

import { AppSidebar } from "@/components/app-sidebar"
import { UserButton } from "@/components/auth/user/user-button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { authClient } from "@/lib/auth-client"

export const Route =
  createFileRoute("/_app")({
    async beforeLoad({
      context: {
        queryClient
      },
      location
    }) {
      const ensureSession =
        createIsomorphicFn()
          .server(() =>
            ensureSessionServer(
              queryClient,
              auth,
              {
                headers:
                  getRequestHeaders()
              }
            )
          )
          .client(() =>
            ensureSessionClient(
              queryClient,
              authClient
            )
          )

      const session =
        await ensureSession()

      if (!session) {
        throw redirect({
          to: "/auth/$path",
          params: {
            path: "sign-in"
          },
          search: {
            redirectTo:
              location.href
          }
        })
      }

      return {
        session
      }
    },

    component: AppLayout
  })

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />

          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
          >
            <img
              src="/branding/niteowl.dev/niteowl-icon.png"
              alt=""
              className="size-7 shrink-0 object-contain"
            />

            <h1 className="truncate text-base">
              <span>Nite</span>
              <span className="text-[#00AEEF]">Owl</span>
              <span>.dev</span>
            </h1>
          </Link>

          <div className="ml-auto flex items-center gap-2">
<UserButton
              size="icon"
              align="end"
            />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
