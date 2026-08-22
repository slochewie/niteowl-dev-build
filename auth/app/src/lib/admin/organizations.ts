import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth, pool } from "@/lib/auth"

export type OrganizationRole =
  | "member"
  | "admin"
  | "owner"

export type AdminOrganizationMemberPreview = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

export type AdminOrganizationListItem = {
  id: string
  name: string
  slug: string
  logo: string | null
  createdAt: Date
  memberCount: number
  members: AdminOrganizationMemberPreview[]
}

export type AdminOrganizationMember = {
  memberId: string
  userId: string
  name: string
  email: string
  image: string | null
  role: string
  joinedAt: Date
  banned: boolean
}

export type AdminOrganizationInvitation = {
  id: string
  email: string
  role: string | null
  status: string
  createdAt: Date
  expiresAt: Date
}

export type AdminOrganizationTeam = {
  id: string
  name: string
  createdAt: Date
  memberCount: number
  memberUserIds: string[]
}

export type AdminOrganizationDetail = {
  id: string
  name: string
  slug: string
  logo: string | null
  metadata: string | null
  createdAt: Date
  memberCount: number
  pendingInvitationCount: number
  teamCount: number
  members: AdminOrganizationMember[]
  invitations: AdminOrganizationInvitation[]
  teams: AdminOrganizationTeam[]
}

export type AdminOrganizationUserOption = {
  id: string
  name: string
  email: string
  image: string | null
}

async function requireGlobalAdmin() {
  const request = getRequest()

  const session = await auth.api.getSession({
    headers: request.headers
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "admin") {
    throw new Error("Forbidden")
  }

  return {
    session,
    request
  }
}

export const getAdminOrganizations =
  createServerFn({
    method: "GET"
  }).handler(
    async (): Promise<
      AdminOrganizationListItem[]
    > => {
      await requireGlobalAdmin()

      const result =
        await pool.query<{
          id: string
          name: string
          slug: string
          logo: string | null
          createdAt: Date
          memberCount: string
          members:
            AdminOrganizationMemberPreview[]
        }>(`
          SELECT
            o.id,
            o.name,
            o.slug,
            o.logo,
            o."createdAt",
            COUNT(m.id)::text AS "memberCount",
            COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'id',
                    preview_user.id,
                    'name',
                    preview_user.name,
                    'email',
                    preview_user.email,
                    'image',
                    preview_user.image,
                    'role',
                    preview_member.role
                  )
                  ORDER BY
                    preview_member."createdAt" ASC
                )
                FROM (
                  SELECT *
                  FROM member
                  WHERE
                    "organizationId" = o.id
                  ORDER BY
                    "createdAt" ASC
                  LIMIT 5
                ) preview_member
                INNER JOIN "user" preview_user
                  ON preview_user.id =
                    preview_member."userId"
              ),
              '[]'::jsonb
            ) AS members
          FROM organization o
          LEFT JOIN member m
            ON m."organizationId" = o.id
          GROUP BY
            o.id
          ORDER BY
            o."createdAt" DESC
        `)

      return result.rows.map(
        (row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          logo: row.logo,
          createdAt: row.createdAt,
          memberCount:
            Number(row.memberCount),
          members: row.members ?? []
        })
      )
    }
  )

export const getAdminOrganization =
  createServerFn({
    method: "GET"
  })
    .validator(
      (data: {
        organizationId: string
      }) => data
    )
    .handler(
      async ({
        data
      }): Promise<AdminOrganizationDetail> => {
        await requireGlobalAdmin()

        const organizationResult =
          await pool.query<{
            id: string
            name: string
            slug: string
            logo: string | null
            metadata: string | null
            createdAt: Date
          }>(
            `
              SELECT
                id,
                name,
                slug,
                logo,
                metadata,
                "createdAt"
              FROM organization
              WHERE id = $1
              LIMIT 1
            `,
            [data.organizationId]
          )

        const organization =
          organizationResult.rows[0]

        if (!organization) {
          throw new Error(
            "Organization not found"
          )
        }

        const membersResult =
          await pool.query<AdminOrganizationMember>(
            `
              SELECT
                m.id AS "memberId",
                u.id AS "userId",
                u.name,
                u.email,
                u.image,
                m.role,
                m."createdAt" AS "joinedAt",
                COALESCE(
                  u.banned,
                  false
                ) AS banned
              FROM member m
              INNER JOIN "user" u
                ON u.id = m."userId"
              WHERE
                m."organizationId" = $1
              ORDER BY
                u.name ASC,
                u.email ASC
            `,
            [data.organizationId]
          )

        const invitationsResult =
          await pool.query<AdminOrganizationInvitation>(
            `
              SELECT
                id,
                email,
                role,
                status,
                "createdAt",
                "expiresAt"
              FROM invitation
              WHERE
                "organizationId" = $1
              ORDER BY
                "createdAt" DESC
            `,
            [data.organizationId]
          )

        const teamsResult =
          await pool.query<{
            id: string
            name: string
            createdAt: Date
            memberCount: number
            memberUserIds: string[]
          }>(
            `
              SELECT
                t.id,
                t.name,
                t."createdAt",
                COUNT(tm.id)::int AS "memberCount",
                COALESCE(
                  array_agg(
                    tm."userId"
                    ORDER BY tm."userId"
                  ) FILTER (
                    WHERE tm."userId" IS NOT NULL
                  ),
                  ARRAY[]::text[]
                ) AS "memberUserIds"
              FROM team t
              LEFT JOIN "teamMember" tm
                ON tm."teamId" = t.id
              WHERE
                t."organizationId" = $1
              GROUP BY
                t.id
              ORDER BY
                t."createdAt" ASC
            `,
            [data.organizationId]
          )

        return {
          ...organization,

          memberCount:
            membersResult.rows.length,

          pendingInvitationCount:
            invitationsResult.rows.filter(
              (invitation) =>
                invitation.status ===
                "pending"
            ).length,

          teamCount:
            teamsResult.rows.length,

          members:
            membersResult.rows,

          invitations:
            invitationsResult.rows,

          teams:
            teamsResult.rows
        }
      }
    )

export const getAdminOrganizationUserOptions =
  createServerFn({
    method: "GET"
  }).handler(
    async (): Promise<
      AdminOrganizationUserOption[]
    > => {
      await requireGlobalAdmin()

      const result =
        await pool.query<AdminOrganizationUserOption>(
          `
            SELECT
              id,
              name,
              email,
              image
            FROM "user"
            ORDER BY
              name ASC,
              email ASC
          `
        )

      return result.rows
    }
  )

export const addAdminOrganizationMember =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        userId: string
        role: OrganizationRole
      }) => data
    )
    .handler(async ({ data }) => {
      await requireGlobalAdmin()

      await auth.api.addMember({
        body: {
          organizationId:
            data.organizationId,
          userId: data.userId,
          role: data.role
        }
      })

      return {
        ok: true
      }
    })

export const updateAdminOrganizationMemberRole =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        memberId: string
        role: OrganizationRole
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.updateMemberRole({
        body: {
          organizationId:
            data.organizationId,
          memberId: data.memberId,
          role: data.role
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const removeAdminOrganizationMember =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        memberId: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.removeMember({
        body: {
          organizationId:
            data.organizationId,
          memberIdOrEmail:
            data.memberId
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const inviteAdminOrganizationMember =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        email: string
        role: OrganizationRole
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.createInvitation({
        body: {
          organizationId:
            data.organizationId,
          email: data.email,
          role: data.role
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const updateAdminOrganization =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        name: string
        slug: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.updateOrganization({
        body: {
          organizationId:
            data.organizationId,
          data: {
            name: data.name,
            slug: data.slug
          }
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const deleteAdminOrganization =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.deleteOrganization({
        body: {
          organizationId:
            data.organizationId
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const createAdminOrganizationTeam =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        name: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.createTeam({
        body: {
          organizationId:
            data.organizationId,
          name: data.name
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const updateAdminOrganizationTeam =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        teamId: string
        name: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.updateTeam({
        body: {
          teamId: data.teamId,
          data: {
            name: data.name,
            organizationId:
              data.organizationId
          }
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const deleteAdminOrganizationTeam =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        organizationId: string
        teamId: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.removeTeam({
        body: {
          organizationId:
            data.organizationId,
          teamId: data.teamId
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const addAdminOrganizationTeamMember =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        teamId: string
        userId: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.addTeamMember({
        body: {
          teamId: data.teamId,
          userId: data.userId
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })

export const removeAdminOrganizationTeamMember =
  createServerFn({
    method: "POST"
  })
    .validator(
      (data: {
        teamId: string
        userId: string
      }) => data
    )
    .handler(async ({ data }) => {
      const {
        request
      } = await requireGlobalAdmin()

      await auth.api.removeTeamMember({
        body: {
          teamId: data.teamId,
          userId: data.userId
        },
        headers: request.headers
      })

      return {
        ok: true
      }
    })
