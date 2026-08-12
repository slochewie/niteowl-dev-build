import { UserButton } from "@/components/auth/user/user-button"
import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher"

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3 p-4">
      <OrganizationSwitcher />

      <UserButton />
    </header>
  )
}
