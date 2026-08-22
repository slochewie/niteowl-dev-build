import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { auth, pool } from "@/lib/auth"

export type AdminUserActivityEvent = {
  eventType: string
  eventData: Record<string, unknown>
  eventKey: string
  projectId: string
  createdAt: string
  updatedAt: string
  ageInMinutes?: number
  location?: {
    ipAddress?: string | null
    city?: string | null
    country?: string | null
    countryCode?: string | null
  }
}

export type AdminUserActivityResult = {
  events: AdminUserActivityEvent[]
  total: number
  limit: number
  offset: number
  error?: string
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

  return session
}

function getDashApiUrl() {
  return (
    process.env.BETTER_AUTH_API_URL ||
    "https://dash.better-auth.com"
  ).replace(/\/+$/, "")
}

export const getAdminUserActivity =
  createServerFn({
    method: "GET"
  })
    .validator(
      (data: {
        userId: string
        limit?: number
        offset?: number
      }) => data
    )
    .handler(
      async ({
        data
      }): Promise<AdminUserActivityResult> => {
        await requireGlobalAdmin()

        const apiKey =
          process.env.BETTER_AUTH_API_KEY

        const limit = Math.min(
          Math.max(
            data.limit ?? 100,
            1
          ),
          100
        )

        const offset = Math.max(
          data.offset ?? 0,
          0
        )

        if (!apiKey) {
          return {
            events: [],
            total: 0,
            limit,
            offset,
            error:
              "BETTER_AUTH_API_KEY is not configured"
          }
        }

        /*
         * Dash's /events/activity endpoint expects
         * organizationIds when filtering by userId.
         *
         * This admin page is global-admin-only, so use
         * every Better Auth organization as the allowed
         * organization scope.
         */
        const organizationsResult =
          await pool.query<{
            id: string
          }>(`
            SELECT id
            FROM organization
            ORDER BY id
          `)

        const organizationIds =
          organizationsResult.rows
            .map(
              (organization) =>
                organization.id
            )
            .filter(Boolean)

        if (
          organizationIds.length === 0
        ) {
          return {
            events: [],
            total: 0,
            limit,
            offset
          }
        }

        const url = new URL(
          `${getDashApiUrl()}/events/activity`
        )

        url.searchParams.set(
          "userId",
          data.userId
        )

        url.searchParams.set(
          "organizationIds",
          organizationIds.join(",")
        )

        url.searchParams.set(
          "limit",
          String(limit)
        )

        url.searchParams.set(
          "offset",
          String(offset)
        )

        try {
          const response =
            await fetch(
              url,
              {
                method: "GET",
                headers: {
                  Authorization:
                    `Bearer ${apiKey}`,
                  Accept:
                    "application/json"
                }
              }
            )

          if (!response.ok) {
            const body =
              await response.text()

            console.error(
              "[Admin Activity] Better Auth Infrastructure request failed",
              {
                status:
                  response.status,
                statusText:
                  response.statusText,
                url:
                  url.toString(),
                body
              }
            )

            return {
              events: [],
              total: 0,
              limit,
              offset,
              error:
                body ||
                `Unable to load activity: HTTP ${response.status}`
            }
          }

          const payload =
            await response.json() as {
              events?:
                AdminUserActivityEvent[]
              total?: number
              limit?: number
              offset?: number
            }

          return {
            events:
              payload.events ?? [],
            total:
              payload.total ?? 0,
            limit:
              payload.limit ?? limit,
            offset:
              payload.offset ?? offset
          }
        } catch (error) {
          console.error(
            "[Admin Activity] Unable to contact Better Auth Infrastructure",
            error
          )

          return {
            events: [],
            total: 0,
            limit,
            offset,
            error:
              error instanceof Error
                ? error.message
                : "Unable to load activity"
          }
        }
      }
    )
