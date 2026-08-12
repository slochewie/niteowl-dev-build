import { createAuthPlugin } from "@better-auth-ui/core"
import {
  multiSessionPlugin as coreMultiSessionPlugin,
  type MultiSessionPluginOptions
} from "@better-auth-ui/core/plugins"

import { ManageAccounts } from "#/components/auth/multi-session/manage-accounts.tsx"
import { SwitchAccountSubmenu } from "#/components/auth/multi-session/switch-account-submenu.tsx"

export const multiSessionPlugin = createAuthPlugin(
  coreMultiSessionPlugin.id,
  (options: MultiSessionPluginOptions = {}) => ({
    ...coreMultiSessionPlugin(options),
    accountCards: [ManageAccounts],
    userMenuItems: [SwitchAccountSubmenu]
  })
)
