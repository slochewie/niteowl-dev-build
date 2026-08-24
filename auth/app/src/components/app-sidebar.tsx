"use client"

import {
  Blocks,
  Building2,
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { authClient } =
    useAuth()

  const { data: session } =
    useSession(authClient)

  const {
    isMobile,
    setOpenMobile
  } = useSidebar()

  const pathname =
    useRouterState({
      select: (state) =>
        state.location.pathname
    })

  const organizationMatch =
    /^\/organization\/([^/]+)\/(settings|people|teams)(?:\/|$)/.exec(
      pathname
    )

  const activeOrganizationSlug =
    organizationMatch?.[1] ??
    null

  const isAdmin =
    session?.user.role ===
    "admin"

  const settingsNavigation = [
    {
      title: "Account",
      to: "/settings/account",
      icon: UserCircle
    },
    {
      title: "Security",
      to: "/settings/security",
      icon: ShieldCheck
    },
    {
      title: "Organizations",
      to: "/settings/organizations",
      icon: Building2
    }
  ]

  const adminNavigation = [
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

  function closeMobileSidebar() {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  function navigationItem(
    item: {
      title: string
      to: string
      icon: typeof LayoutDashboard
    }
  ) {
    const isActive =
      item.to === "/"
        ? pathname === "/"
        : item.to ===
            "/settings/organizations"
          ? pathname.startsWith(
              "/settings/organizations"
            ) ||
            pathname.startsWith(
              "/organization/"
            )
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
              {navigationItem({
                title: "Dashboard",
                to: "/",
                icon: LayoutDashboard
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>
            Settings
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavigation.map(
                (item) => {
                  if (
                    item.to !==
                      "/settings/organizations"
                  ) {
                    return navigationItem(
                      item
                    )
                  }

                  const isActive =
                    pathname.startsWith(
                      "/settings/organizations"
                    ) ||
                    pathname.startsWith(
                      "/organization/"
                    )

                  return (
                    <SidebarMenuItem
                      key={item.to}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={
                          isActive
                        }
                        tooltip={
                          item.title
                        }
                      >
                        <Link
                          to={
                            item.to
                          }
                          onClick={
                            closeMobileSidebar
                          }
                        >
                          <item.icon />

                          <span>
                            {
                              item.title
                            }
                          </span>
                        </Link>
                      </SidebarMenuButton>

                      {activeOrganizationSlug && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={
                                pathname ===
                                `/organization/${activeOrganizationSlug}/settings`
                              }
                            >
                              <Link
                                to="/organization/$slug/$path"
                                params={{
                                  slug:
                                    activeOrganizationSlug,
                                  path:
                                    "settings"
                                }}
                                onClick={
                                  closeMobileSidebar
                                }
                              >
                                Settings
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={
                                pathname ===
                                `/organization/${activeOrganizationSlug}/people`
                              }
                            >
                              <Link
                                to="/organization/$slug/$path"
                                params={{
                                  slug:
                                    activeOrganizationSlug,
                                  path:
                                    "people"
                                }}
                                onClick={
                                  closeMobileSidebar
                                }
                              >
                                People
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={
                                pathname ===
                                `/organization/${activeOrganizationSlug}/teams`
                              }
                            >
                              <Link
                                to="/organization/$slug/$path"
                                params={{
                                  slug:
                                    activeOrganizationSlug,
                                  path:
                                    "teams"
                                }}
                                onClick={
                                  closeMobileSidebar
                                }
                              >
                                Teams
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  )
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <>
            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>
                Admin
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavigation.map(
                    navigationItem
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
