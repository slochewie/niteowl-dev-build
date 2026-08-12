export type OrganizationTeam = {
  id: string
  name: string
  organizationId: string
  createdAt: Date | string
}

export type TeamMembership = {
  id: string
  teamId: string
  userId: string
  createdAt: Date | string
}
