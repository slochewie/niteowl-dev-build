"use client"

import {
  Github,
  KeyRound,
  Mail,
  Plug
} from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

import type {
  AdminUserAccount
} from "@/lib/admin/users"

type UserAccountsProps = {
  accounts: AdminUserAccount[]
}

export function UserAccounts({
  accounts
}: UserAccountsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Accounts
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Authentication methods and linked accounts for this user
        </p>
      </CardHeader>

      <CardContent>
        {accounts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No authentication accounts found
          </div>
        ) : (
          <ItemGroup className="gap-0">
            {accounts.map(
              (account, index) => (
                <div key={account.id}>
                  {index > 0 && (
                    <ItemSeparator />
                  )}

                  <AccountRow
                    account={account}
                  />
                </div>
              )
            )}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function AccountRow({
  account
}: {
  account: AdminUserAccount
}) {
  const credential =
    account.providerId ===
    "credential"

  return (
    <Item>
      <ItemMedia variant="icon">
        <ProviderIcon
          providerId={
            account.providerId
          }
        />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="flex flex-wrap items-center gap-2">
          {formatProvider(
            account.providerId
          )}

          <Badge variant="outline">
            {credential
              ? "Credential"
              : "Linked"}
          </Badge>
        </ItemTitle>

        <ItemDescription>
          {credential
            ? "Email & password authentication"
            : `Account ID: ${account.accountId}`}
        </ItemDescription>

        <div className="mt-2 grid gap-x-8 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            Linked:{" "}
            {formatDate(
              account.createdAt
            )}
          </div>

          <div>
            Updated:{" "}
            {formatDate(
              account.updatedAt
            )}
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}

function ProviderIcon({
  providerId
}: {
  providerId: string
}) {
  switch (
    providerId.toLowerCase()
  ) {
    case "credential":
      return <KeyRound />

    case "github":
      return <Github />

    case "email":
      return <Mail />

    default:
      return <Plug />
  }
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
