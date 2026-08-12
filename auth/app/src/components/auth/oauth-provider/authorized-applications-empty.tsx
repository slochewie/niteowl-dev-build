"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { ShieldCheck } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "#/components/ui/empty.tsx"
import { oauthProviderPlugin } from "#/lib/auth/oauth-provider-plugin.ts"

export function AuthorizedApplicationsEmpty() {
  const { localization } = useAuthPlugin(oauthProviderPlugin)

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldCheck />
        </EmptyMedia>
        <EmptyTitle>{localization.noConnectedApplications}</EmptyTitle>
        <EmptyDescription>
          {localization.connectedApplicationsDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
