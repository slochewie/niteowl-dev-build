import { auth } from '@/lib/auth'
import { env } from '@/lib/env'
import { createFileRoute } from '@tanstack/react-router'

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('origin')

  if (
    !origin ||
    !env.trustedOrigins.includes(origin)
  ) {
    return null
  }

  const requestedHeaders =
    request.headers.get(
      'access-control-request-headers'
    )

  return {
    'Access-Control-Allow-Origin':
      origin,
    'Access-Control-Allow-Credentials':
      'true',
    'Access-Control-Allow-Methods':
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      requestedHeaders ??
      'Content-Type, Authorization',
    'Vary':
      'Origin, Access-Control-Request-Headers',
  }
}

function withCors(
  request: Request,
  response: Response
) {
  const corsHeaders =
    getCorsHeaders(request)

  if (!corsHeaders) {
    return response
  }

  const headers =
    new Headers(response.headers)

  for (const [
    name,
    value,
  ] of Object.entries(
    corsHeaders
  )) {
    if (
      name.toLowerCase() ===
      'vary'
    ) {
      const existingVary =
        headers.get('Vary')

      headers.set(
        'Vary',
        existingVary
          ? `${existingVary}, ${value}`
          : value
      )

      continue
    }

    headers.set(
      name,
      value
    )
  }

  return new Response(
    response.body,
    {
      status: response.status,
      statusText:
        response.statusText,
      headers,
    }
  )
}

async function handleAuthRequest(
  request: Request
) {
  const response =
    await auth.handler(request)

  return withCors(
    request,
    response
  )
}

async function handleOptions(
  request: Request
) {
  const corsHeaders =
    getCorsHeaders(request)

  if (!corsHeaders) {
    return new Response(
      null,
      {
        status: 204,
      }
    )
  }

  return new Response(
    null,
    {
      status: 204,
      headers: corsHeaders,
    }
  )
}

export const Route =
  createFileRoute('/api/$')({
    server: {
      handlers: {
        OPTIONS: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleOptions(
            request
          )
        },

        GET: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleAuthRequest(
            request
          )
        },

        POST: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleAuthRequest(
            request
          )
        },

        PUT: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleAuthRequest(
            request
          )
        },

        PATCH: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleAuthRequest(
            request
          )
        },

        DELETE: async ({
          request,
        }: {
          request: Request
        }) => {
          return await handleAuthRequest(
            request
          )
        },
      },
    },
  })
