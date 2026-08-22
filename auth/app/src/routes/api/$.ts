import { auth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

async function handleAuthRequest(
  request: Request
) {
  return await auth.handler(request)
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
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
