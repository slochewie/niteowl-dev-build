import {
  createFileRoute,
  Link
} from "@tanstack/react-router"
import {
  Building2,
  CircleCheck,
  KeyRound,
  ShieldBan,
  UserRound
} from "lucide-react"

import { UserAccounts } from "@/components/auth/admin/user-accounts"
import { UserActivity } from "@/components/auth/admin/user-activity"
import { UserAdminActions } from "@/components/auth/admin/user-admin-actions"
import { UserOrganizations } from "@/components/auth/admin/user-organizations"
import { UserSessions } from "@/components/auth/admin/user-sessions"
import { UserAvatar } from "@/components/auth/user/user-avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@/components/ui/item"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  getAdminUserActivity
} from "@/lib/admin/user-activity"
import {
  getAllOrganizations
} from "@/lib/admin/user-organizations"
import { getAdminUser } from "@/lib/admin/users"

export const Route =
  createFileRoute("/_app/users/$userId")({
    loader: async ({ params }) => {
      const [
        user,
        allOrganizations,
        activity
      ] = await Promise.all([
        getAdminUser({
          data: {
            userId: params.userId
          }
        }),

        getAllOrganizations(),

        getAdminUserActivity({
          data: {
            userId: params.userId,
            limit: 100,
            offset: 0
          }
        })
      ])

      return {
        user,
        allOrganizations,
        activity
      }
    },

    component: UserPage
  })

function UserPage() {
  const {
    user,
    allOrganizations,
    activity
  } = Route.useLoaderData()

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <div className="border-b px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/users"
            className="hover:text-foreground"
          >
            Users
          </Link>

          <span>/</span>

          <span className="truncate text-foreground">
            {user.name || user.email}
          </span>
        </div>
      </div>

      <div className="grid min-w-0 flex-1 gap-6 p-4 sm:p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-6">
          <div className="space-y-4">
            <UserAvatar
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ?? undefined,
                username: user.username,
                displayUsername:
                  user.displayUsername,
                emailVerified:
                  user.emailVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              }}
              className="size-28"
            />

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold">
                {user.name || user.email}
              </h1>

              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>

            {user.banned ? (
              <Badge variant="destructive">
                <ShieldBan />
                Banned
              </Badge>
            ) : (
              <Badge variant="secondary">
                <CircleCheck />
                Active
              </Badge>
            )}
          </div>

          <UserAdminActions
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              displayUsername:
                user.displayUsername,
              banned: user.banned
            }}
          />
        </aside>

        <div className="min-w-0 max-w-full overflow-hidden">
          <Tabs
            defaultValue="overview"
            className="min-w-0 w-full"
          >
            <div className="max-w-full overflow-x-auto overscroll-x-contain">
              <TabsList className="h-auto w-max min-w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>

                <TabsTrigger
                  value="accounts"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Accounts
                </TabsTrigger>

                <TabsTrigger
                  value="sessions"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Sessions
                </TabsTrigger>

                <TabsTrigger
                  value="organizations"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Organizations
                </TabsTrigger>

                <TabsTrigger
                  value="activity"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Activity
                </TabsTrigger>

                <TabsTrigger
                  value="security"
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="overview"
              className="mt-6 min-w-0 space-y-6"
            >
              <ProfileInformationCard
                user={user}
              />

              <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                <UserSessions
                  userId={user.id}
                  sessions={user.sessions}
                  compact
                />

                <ConnectedAccountsCard
                  accounts={user.accounts}
                />
              </div>

              <OrganizationsCard
                organizations={
                  user.organizations
                }
              />
            </TabsContent>

            <TabsContent
              value="accounts"
              className="mt-6 min-w-0"
            >
              <UserAccounts
                accounts={user.accounts}
              />
            </TabsContent>

            <TabsContent
              value="sessions"
              className="mt-6 min-w-0"
            >
              <UserSessions
                userId={user.id}
                sessions={user.sessions}
              />
            </TabsContent>

            <TabsContent
              value="organizations"
              className="mt-6 min-w-0"
            >
              <UserOrganizations
                userId={user.id}
                organizations={
                  user.organizations
                }
                allOrganizations={
                  allOrganizations
                }
              />
            </TabsContent>

            <TabsContent
              value="activity"
              className="mt-6 min-w-0"
            >
              <UserActivity
                activity={activity}
              />
            </TabsContent>

            <TabsContent
              value="security"
              className="mt-6 min-w-0"
            >
              <PlaceholderCard
                title="Security"
                description="Authentication and access-control events will appear here."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ProfileInformationCard({
  user
}: {
  user: Awaited<
    ReturnType<typeof getAdminUser>
  >
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-5" />
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-x-12 gap-y-6 md:grid-cols-2">
        <InfoField
          label="Name"
          value={user.name}
        />

        <InfoField
          label="Status"
          value={
            user.banned
              ? "Banned"
              : "Active"
          }
        />

        <InfoField
          label="Email"
          value={user.email}
        />

        <InfoField
          label="Joined"
          value={formatDate(
            user.createdAt
          )}
        />

        <InfoField
          label="User ID"
          value={user.id}
        />

        <InfoField
          label="Role"
          value={user.role ?? "user"}
        />

        <InfoField
          label="Username"
          value={user.username ?? "—"}
        />

        <InfoField
          label="Display Username"
          value={
            user.displayUsername ??
            "—"
          }
        />
      </CardContent>
    </Card>
  )
}

function ConnectedAccountsCard({
  accounts
}: {
  accounts: Array<{
    id: string
    accountId: string
    providerId: string
    createdAt: Date
  }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Connected Accounts
        </CardTitle>
      </CardHeader>

      <CardContent>
        {accounts.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No connected accounts
          </div>
        ) : (
          <ItemGroup className="gap-0">
            {accounts.map(
              (account, index) => (
                <div key={account.id}>
                  {index > 0 && (
                    <ItemSeparator />
                  )}

                  <Item>
                    <ItemMedia variant="icon">
                      <KeyRound />
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>
                        {formatProvider(
                          account.providerId
                        )}
                      </ItemTitle>

                      <ItemDescription>
                        {account.providerId ===
                        "credential"
                          ? "Password authentication"
                          : account.accountId}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </div>
              )
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function OrganizationsCard({
  organizations
}: {
  organizations: Array<{
    id: string
    memberId: string
    name: string
    slug: string
    logo: string | null
    role: string
    joinedAt: Date
  }>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Organizations
        </CardTitle>
      </CardHeader>

      <CardContent>
        {organizations.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Not a member of any organizations
          </div>
        ) : (
          <ItemGroup className="gap-0">
            {organizations.map(
              (
                organization,
                index
              ) => (
                <div
                  key={
                    organization.id
                  }
                >
                  {index > 0 && (
                    <ItemSeparator />
                  )}

                  <Item>
                    <ItemMedia variant="icon">
                      <Building2 />
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle>
                        {
                          organization.name
                        }
                      </ItemTitle>

                      <ItemDescription>
                        {
                          organization.slug
                        }
                        {" · "}
                        {
                          organization.role
                        }
                        {" · Joined "}
                        {formatDate(
                          organization.joinedAt
                        )}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </div>
              )
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function PlaceholderCard({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

function InfoField({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="text-sm text-muted-foreground">
        {label}
      </div>

      <div className="break-all text-sm">
        {value}
      </div>
    </div>
  )
}

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(
    new Date(value)
  )
}

function formatProvider(
  providerId: string
) {
  if (
    providerId === "credential"
  ) {
    return "Email & Password"
  }

  return providerId
    .split(/[-_]/g)
    .map(
      (part) =>
        part.charAt(0)
          .toUpperCase() +
        part.slice(1)
    )
    .join(" ")
}
