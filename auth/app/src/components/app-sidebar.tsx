"use client"

import {
  Blocks,
  Building2,
  LayoutDashboard,
  Users
} from "lucide-react"
import {
  Link,
  useRouterState
} from "@tanstack/react-router"
import {
  useAuth,
  useSession
} from "@better-auth-ui/react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { authClient } = useAuth()

  const { data: session } =
    useSession(authClient)

  const {
    isMobile,
    setOpenMobile
  } = useSidebar()

  const pathname = useRouterState({
    select: (state) =>
      state.location.pathname
  })

  const navigation = [
    {
      title: "Dashboard",
      to: "/",
      icon: LayoutDashboard
    },

    ...(session?.user.role === "admin"
      ? [
          {
            title: "Users",
            to: "/users",
            icon: Users
          },
          {
            title: "Organizations",
            to: "/organizations",
            icon: Building2
          },
          {
            title: "Plugins & APIs",
            to: "/plugins",
            icon: Blocks
          }
        ]
      : [])
  ]

  function closeMobileSidebar() {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            NiteOwl
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(
                        item.to
                      )

                return (
                  <SidebarMenuItem
                    key={item.to}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        to={item.to}
                        onClick={
                          closeMobileSidebar
                        }
                      >
                        <item.icon />

                        <span>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
