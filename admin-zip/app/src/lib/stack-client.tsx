import { createStackClient } from "@btst/stack/client"
import { QueryClient } from "@tanstack/react-query"
import { blogClientPlugin } from "@btst/stack/plugins/blog/client"
import { cmsClientPlugin } from "@btst/stack/plugins/cms/client"
import { formBuilderClientPlugin } from "@btst/stack/plugins/form-builder/client"
import { uiBuilderClientPlugin } from "@btst/stack/plugins/ui-builder/client"
import { kanbanClientPlugin } from "@btst/stack/plugins/kanban/client"
import { commentsClientPlugin } from "@btst/stack/plugins/comments/client"
import { mediaClientPlugin } from "@btst/stack/plugins/media/client"
import { authClientPlugin, accountClientPlugin, organizationClientPlugin } from "@btst/better-auth-ui/client"
import { routeDocsClientPlugin } from "@btst/stack/plugins/route-docs/client"

export function getStackClient(queryClient: QueryClient) {
	const baseURL = getBaseURL()
	return createStackClient({
		plugins: {
			blog: blogClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			cms: cmsClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			formBuilder: formBuilderClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			uiBuilder: uiBuilderClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			kanban: kanbanClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			comments: commentsClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			media: mediaClientPlugin({
				apiBaseURL: baseURL,
				apiBasePath: "/api/data",
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
				queryClient,
			}),
			auth: authClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
			account: accountClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
			organization: organizationClientPlugin({
				siteBaseURL: baseURL,
				siteBasePath: "/pages",
			}),
			routeDocs: routeDocsClientPlugin({
				queryClient,
				siteBasePath: "/pages",
			}),
		},
	})
}
function getBaseURL() {
	if (typeof window !== "undefined") {
		return window.location.origin
	}

	// Use literal process.env.XXX so bundlers (Vite define, Next.js, etc.)
	// can statically replace these at build/transform time.
	if (process.env.BTST_SITE_URL) return process.env.BTST_SITE_URL
	if (process.env.VITE_PUBLIC_SITE_URL) return process.env.VITE_PUBLIC_SITE_URL
	if (process.env.BASE_URL) return process.env.BASE_URL
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return "http://localhost:3000"
}
