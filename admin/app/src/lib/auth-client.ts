import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return (
      import.meta.env.VITE_AUTH_BASE_URL ??
      "http://192.168.111.27:3031"
    )
  }

  return (
    process.env.AUTH_BASE_URL ??
    process.env.VITE_AUTH_BASE_URL ??
    "http://auth:3000"
  )
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    organizationClient(),
  ],
})
