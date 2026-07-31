import { authClient } from "@/lib/auth-client"
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { Link as RouterLink } from "@tanstack/react-router"
import { StackProvider } from "@btst/stack/context"
import { QueryClientProvider } from "@tanstack/react-query"
import { getOrCreateQueryClient } from "@/lib/query-client"

export const Route = createFileRoute("/pages")({
	component: BtstPagesLayout,
})

function getBaseURL() {
	if (typeof window !== "undefined") {
		return window.location.origin
	}

	if (typeof process !== "undefined") {
		return process.env.VITE_BASE_URL || process.env.BASE_URL || "http://localhost:3000"
	}

	return "http://localhost:3000"
}

function BtstPagesLayout() {
	const navigate = useNavigate()
	const queryClient = getOrCreateQueryClient()
	const baseURL = getBaseURL()
	return (
		<QueryClientProvider client={queryClient}>
			<StackProvider
				basePath="/pages"
				overrides={
					{
					"blog": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
						uploadImage: async () => {
							throw new Error("TODO: implement blog.uploadImage override in src/routes/pages/route.tsx")
						},
					},
					"cms": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
					},
					"form-builder": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
					},
					"ui-builder": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
					},
					"kanban": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
						uploadImage: async () => {
							throw new Error("TODO: implement kanban.uploadImage override in src/routes/pages/route.tsx")
						},
						resolveUser: async () => null,
						searchUsers: async () => [],
					},
					"comments": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
					},
					"media": {
						apiBaseURL: baseURL,
						apiBasePath: "/api/data",
						queryClient,
						navigate: (path: string) => navigate({ to: path }),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
					},
					auth: {
						authClient,
						navigate: (path: string) => navigate({ to: path }),
						replace: (path: string) => navigate({ to: path, replace: true }),
						onSessionChange: () => window.location.reload(),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
						basePath: "/pages/auth",
						redirectTo: "/pages/account/settings",
					},
					account: {
						authClient,
						navigate: (path: string) => navigate({ to: path }),
						replace: (path: string) => navigate({ to: path, replace: true }),
						onSessionChange: () => window.location.reload(),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
						basePath: "/pages/account",
						account: { fields: ["image", "name"] },
					},
					organization: {
						authClient,
						navigate: (path: string) => navigate({ to: path }),
						replace: (path: string) => navigate({ to: path, replace: true }),
						onSessionChange: () => window.location.reload(),
						Link: ({ href, to, ...props }: any) => <RouterLink to={href || to || "#"} {...props} />,
						basePath: "/pages/org",
						organization: { basePath: "/pages/org" },
					},
					}
				}
			>
				<Outlet />
			</StackProvider>
		</QueryClientProvider>
	)
}
