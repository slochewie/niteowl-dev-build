"use client"

import { Skeleton } from "#/components/ui/skeleton.tsx"
import { TableCell, TableRow } from "#/components/ui/table.tsx"

/**
 * Placeholder row matching `OrganizationInvitationRow` while invitations load.
 */
export function OrganizationInvitationRowSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-[30%]">
        <Skeleton className="h-4 w-48 rounded-md" />
      </TableCell>

      <TableCell className="w-[20%]">
        <Skeleton className="h-4 w-36 rounded-md" />
      </TableCell>

      <TableCell className="w-[16%]">
        <Skeleton className="h-4 w-16 rounded-md" />
      </TableCell>

      <TableCell className="w-[24%]">
        <Skeleton className="h-4 w-14 rounded-full" />
      </TableCell>

      <TableCell className="w-[10%]" />
    </TableRow>
  )
}
