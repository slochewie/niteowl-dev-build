"use client";

import type { ComponentProps } from "react";

import { OrganizationMemberRow } from "@/components/auth/organization/organization-member-row";
import { getUserInitials } from "@/components/niteowl/user-avatar";

type OrganizationMemberRowProps =
  ComponentProps<typeof OrganizationMemberRow>;

export function NiteOwlOrganizationMemberRow({
  member,
  ...props
}: OrganizationMemberRowProps) {
  const user = {
    ...member.user,
    username: getUserInitials(member.user),
    displayUsername:
      member.user.displayUsername ||
      member.user.name ||
      member.user.email,
  } as typeof member.user & {
    username?: string | null;
    displayUsername?: string | null;
  };

  return (
    <OrganizationMemberRow
      {...props}
      member={{
        ...member,
        user,
      }}
    />
  );
}
