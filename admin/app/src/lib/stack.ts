import { stack } from "@btst/stack"
import { createDrizzleAdapter } from "@btst/adapter-drizzle"
import { blogBackendPlugin } from "@btst/stack/plugins/blog/api"
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api"
import { formBuilderBackendPlugin } from "@btst/stack/plugins/form-builder/api"
import { UI_BUILDER_CONTENT_TYPE } from "@btst/stack/plugins/ui-builder"
import { kanbanBackendPlugin } from "@btst/stack/plugins/kanban/api"
import { commentsBackendPlugin } from "@btst/stack/plugins/comments/api"
import { mediaBackendPlugin } from "@btst/stack/plugins/media/api"
import { openApiBackendPlugin } from "@btst/stack/plugins/open-api/api"
import { z } from "zod"
// TODO: wire your Drizzle DB instance (drizzleDb)
//const drizzleDb = {} as never
import { drizzleDb } from "@/lib/db"

export const myStack = stack({
	basePath: "/api/data",
	plugins: {
		blog: blogBackendPlugin(),
		cms: cmsBackendPlugin({ contentTypes: [{
				name: "Article",
				slug: "article",
				schema: z.object({
					title: z.string(),
					summary: z.string(),
					body: z.string(),
					publishedAt: z.string(),
					published: z.boolean(),
				}),
			}, UI_BUILDER_CONTENT_TYPE] }),
		formBuilder: formBuilderBackendPlugin(),
		kanban: kanbanBackendPlugin(),
		comments: commentsBackendPlugin({ allowPosting: false }),
		media: mediaBackendPlugin({ storageAdapter: undefined as any }),
		openApi: openApiBackendPlugin(),
	},
	adapter: (db) => createDrizzleAdapter(drizzleDb, db, {}),
})

export const { handler, dbSchema } = myStack
