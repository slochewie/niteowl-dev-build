const DEFAULT_BASE_URL =
  "https://api.7shifts.com/v2"

export const SEVEN_SHIFTS_API_VERSION =
  "2026-01-01"

export type SevenShiftsCompany = {
  id: number
  name: string
  uuid?: string
  country?: string
  status?: string
}

export type SevenShiftsLocation = {
  id: number
  company_id: number
  name: string
  active?: boolean
  city?: string | null
  state?: string | null
  country?: string | null
  timezone?: string | null
}

export type SevenShiftsDepartment = {
  id: number
  company_id: number
  location_id: number
  name: string
  default?: boolean
  deleted?: string | null
  created?: string | null
  modified?: string | null
}

export type SevenShiftsRole = {
  id: number
  company_id: number
  location_id: number
  department_id: number
  name: string
  job_code?: string | null
  created?: string | null
  modified?: string | null
}

export type SevenShiftsUser = {
  id: number
  identity_id?: number | null
  company_id: number
  first_name: string
  last_name: string
  preferred_first_name?: string | null
  preferred_last_name?: string | null
  pronouns?: string | null
  email?: string | null
  mobile_number?: string | null
  home_number?: string | null
  address?: string | null
  postal_zip?: string | null
  city?: string | null
  prov_state?: string | null
  active: boolean
  invite_status?: string | null
  hire_date?: string | null
  type?: string | null
  punch_id?: string | null
  employee_id?: string | null
  birth_date?: string | null
}

export type SevenShiftsRoleAssignment = {
  role_id: number
  company_id: number
  location_id: number
  department_id: number
  name: string
  is_primary?: boolean
  skill_level?: number | null
  sort?: number | null
}

type SevenShiftsCursor = {
  current?: string | null
  next?: string | null
  prev?: string | null
  count?: number
}

type SevenShiftsListResponse<T> = {
  data: T[]
  meta?: {
    cursor?: SevenShiftsCursor
  }
}

function buildPath(
  path: string,
  params?: Record<
    string,
    string | number | boolean | null | undefined
  >
) {
  const url =
    new URL(
      path,
      "https://seven-shifts.local"
    )

  for (
    const [
      key,
      value
    ]
    of Object.entries(
      params ?? {}
    )
  ) {
    if (
      value === undefined ||
      value === null
    ) {
      continue
    }

    url.searchParams.set(
      key,
      String(
        value
      )
    )
  }

  return (
    url.pathname +
    url.search
  )
}

export class SevenShiftsApiError
  extends Error {
  status: number
  body: unknown

  constructor({
    message,
    status,
    body
  }: {
    message: string
    status: number
    body: unknown
  }) {
    super(message)

    this.name =
      "SevenShiftsApiError"

    this.status =
      status

    this.body =
      body
  }
}

async function readResponse(
  response: Response
) {
  const text =
    await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(
      text
    ) as unknown
  } catch {
    return text
  }
}

export async function sevenShiftsRequest<T>({
  accessToken,
  path,
  method = "GET",
  apiVersion =
    SEVEN_SHIFTS_API_VERSION,
  baseUrl =
    DEFAULT_BASE_URL,
  body
}: {
  accessToken: string
  path: string
  method?:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
  apiVersion?: string
  baseUrl?: string
  body?: unknown
}): Promise<T> {
  const normalizedBaseUrl =
    baseUrl.replace(
      /\/+$/,
      ""
    )

  const normalizedPath =
    path.startsWith("/")
      ? path
      : "/" + path

  const response =
    await fetch(
      normalizedBaseUrl +
        normalizedPath,
      {
        method,
        headers: {
          Authorization:
            "Bearer " +
            accessToken,

          "x-api-version":
            apiVersion,

          Accept:
            "application/json",

          ...(body === undefined
            ? {}
            : {
                "Content-Type":
                  "application/json"
              })
        },

        ...(body === undefined
          ? {}
          : {
              body:
                JSON.stringify(
                  body
                )
            })
      }
    )

  const responseBody =
    await readResponse(
      response
    )

  if (!response.ok) {
    throw new SevenShiftsApiError({
      message:
        "7shifts API request failed with HTTP " +
        response.status,
      status:
        response.status,
      body:
        responseBody
    })
  }

  return responseBody as T
}

async function listAll<T>({
  accessToken,
  path,
  apiVersion,
  baseUrl,
  params
}: {
  accessToken: string
  path: string
  apiVersion?: string
  baseUrl?: string
  params?: Record<
    string,
    string | number | boolean | null | undefined
  >
}) {
  const items:
    T[] =
      []

  let cursor:
    string | null =
      null

  do {
    const response =
      await sevenShiftsRequest<
        SevenShiftsListResponse<T>
      >({
        accessToken,
        apiVersion,
        baseUrl,
        path:
          buildPath(
            path,
            {
              ...params,
              limit:
                500,
              ...(cursor
                ? {
                    cursor
                  }
                : {})
            }
          )
      })

    items.push(
      ...(response.data ?? [])
    )

    cursor =
      response.meta
        ?.cursor
        ?.next ??
      null
  } while (
    cursor
  )

  return items
}

export async function listSevenShiftsCompanies({
  accessToken,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  apiVersion?: string
  baseUrl?: string
}) {
  return listAll<
    SevenShiftsCompany
  >({
    accessToken,
    apiVersion,
    baseUrl,
    path:
      "/companies"
  })
}

export async function listSevenShiftsLocations({
  accessToken,
  companyId,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  companyId: number
  apiVersion?: string
  baseUrl?: string
}) {
  return listAll<
    SevenShiftsLocation
  >({
    accessToken,
    apiVersion,
    baseUrl,
    path:
      "/company/" +
      companyId +
      "/locations"
  })
}

export async function listSevenShiftsDepartments({
  accessToken,
  companyId,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  companyId: number
  apiVersion?: string
  baseUrl?: string
}) {
  return listAll<
    SevenShiftsDepartment
  >({
    accessToken,
    apiVersion,
    baseUrl,
    path:
      "/company/" +
      companyId +
      "/departments"
  })
}

export async function listSevenShiftsRoles({
  accessToken,
  companyId,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  companyId: number
  apiVersion?: string
  baseUrl?: string
}) {
  return listAll<
    SevenShiftsRole
  >({
    accessToken,
    apiVersion,
    baseUrl,
    path:
      "/company/" +
      companyId +
      "/roles"
  })
}

export async function listSevenShiftsUsers({
  accessToken,
  companyId,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  companyId: number
  apiVersion?: string
  baseUrl?: string
}) {
  return listAll<
    SevenShiftsUser
  >({
    accessToken,
    apiVersion,
    baseUrl,
    path:
      "/company/" +
      companyId +
      "/users"
  })
}

export async function listSevenShiftsUserRoleAssignments({
  accessToken,
  companyId,
  userId,
  apiVersion,
  baseUrl
}: {
  accessToken: string
  companyId: number
  userId: number
  apiVersion?: string
  baseUrl?: string
}) {
  const response =
    await sevenShiftsRequest<
      SevenShiftsListResponse<
        SevenShiftsRoleAssignment
      >
    >({
      accessToken,
      apiVersion,
      baseUrl,
      path:
        "/company/" +
        companyId +
        "/users/" +
        userId +
        "/role_assignments"
    })

  return response.data ?? []
}
