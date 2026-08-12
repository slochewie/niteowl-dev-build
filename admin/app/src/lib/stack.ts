import { stack } from "@btst/stack"
import { createKyselyAdapter } from "@btst/adapter-kysely"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { blogBackendPlugin } from "@btst/stack/plugins/blog/api"
// import { aiChatBackendPlugin } from "@btst/stack/plugins/ai-chat/api"
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api"
import { formBuilderBackendPlugin } from "@btst/stack/plugins/form-builder/api"
import { UI_BUILDER_CONTENT_TYPE } from "@btst/stack/plugins/ui-builder"
import { kanbanBackendPlugin } from "@btst/stack/plugins/kanban/api"
import { commentsBackendPlugin } from "@btst/stack/plugins/comments/api"
import { mediaBackendPlugin } from "@btst/stack/plugins/media/api"
// import { openApiBackendPlugin } from "@btst/stack/plugins/open-api/api"
// import { openai } from "@ai-sdk/openai"

import { z } from "zod"
// TODO: wire your Kysely DB instance (kyselyDb)
// const kyselyDb = {} as never
const kyselyDb = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL })
  })
})

export const myStack = stack({
	basePath: "/api/data",
	plugins: {
		blog: blogBackendPlugin(),
//		aiChat: aiChatBackendPlugin({ model: openai("gpt-4o-mini"), mode: "public" as const }),
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
//		openApi: openApiBackendPlugin(),
	},
        adapter: (db) => createKyselyAdapter(kyselyDb, db, {})({}),
//	adapter: (db) => createKyselyAdapter(kyselyDb, db, {}),
          userTable: "user",
          sessionTable: "session",
          organizationTable: "organization",
          memberTable: "member",
          invitationTable: "invitation",
})

export const { handler, dbSchema } = myStack
