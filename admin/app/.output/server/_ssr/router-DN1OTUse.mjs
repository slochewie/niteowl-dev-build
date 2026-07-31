import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, O as Outlet, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound } from "../_libs/tanstack__router-core.mjs";
import { s as setupRouterSsrQueryIntegration } from "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import { cache } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
import { sitemapEntryToXmlString, createStackClient, normalizePath } from "@btst/stack/client";
import { blogClientPlugin } from "@btst/stack/plugins/blog/client";
import { cmsClientPlugin } from "@btst/stack/plugins/cms/client";
import { formBuilderClientPlugin } from "@btst/stack/plugins/form-builder/client";
import { uiBuilderClientPlugin } from "@btst/stack/plugins/ui-builder/client";
import { kanbanClientPlugin } from "@btst/stack/plugins/kanban/client";
import { commentsClientPlugin } from "@btst/stack/plugins/comments/client";
import { mediaClientPlugin } from "@btst/stack/plugins/media/client";
import { o as organizationClientPlugin, a as accountClientPlugin, b as authClientPlugin } from "../_libs/btst__better-auth-ui.mjs";
import { routeDocsClientPlugin } from "@btst/stack/plugins/route-docs/client";
import { stack } from "@btst/stack";
import { c as createDrizzleAdapter } from "../_libs/btst__adapter-drizzle.mjs";
import { blogBackendPlugin } from "@btst/stack/plugins/blog/api";
import { cmsBackendPlugin } from "@btst/stack/plugins/cms/api";
import { formBuilderBackendPlugin } from "@btst/stack/plugins/form-builder/api";
import { UI_BUILDER_CONTENT_TYPE } from "@btst/stack/plugins/ui-builder";
import { kanbanBackendPlugin } from "@btst/stack/plugins/kanban/api";
import { commentsBackendPlugin } from "@btst/stack/plugins/comments/api";
import { mediaBackendPlugin } from "@btst/stack/plugins/media/api";
import { openApiBackendPlugin } from "@btst/stack/plugins/open-api/api";
import { P as Pool } from "../_libs/pg.mjs";
import { i as isServer, Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as pgTable, t as timestamp, u as text, v as boolean, w as integer, x as drizzle, y as relations } from "../_libs/drizzle-orm.mjs";
import { o as object, c as boolean$1, s as string } from "../_libs/zod.mjs";
import "react-dom";
import "react-dom/server";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "@btst/stack/plugins/client";
import "@btst/stack/client/components";
import "@btst/stack/context";
import "../_libs/vaul.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/hcaptcha__react-hcaptcha.mjs";
import "../_libs/react-google-recaptcha.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/react.mjs";
import "../_libs/react-async-script.mjs";
import "../_libs/hoist-non-react-statics.mjs";
import "../_libs/react-is.mjs";
import "../_libs/hookform__resolvers.mjs";
import "../_libs/react-hook-form.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/bowser.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/wojtekmaj__react-recaptcha-v3.mjs";
import "../_libs/warning.mjs";
import "../_libs/captchafox__react.mjs";
import "../_libs/marsidev__react-turnstile.mjs";
import "../_libs/react-qr-code.mjs";
import "../_libs/qrcode-generator.mjs";
import "../_libs/input-otp.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/sonner.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/noble__hashes.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "events";
import "util/types";
import "crypto";
import "dns";
import "net";
import "tls";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "stream";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: isServer ? 60 * 1e3 : 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false
      },
      dehydrate: {
        shouldDehydrateQuery: () => true
      }
    }
  });
}
let browserQueryClient;
const getServerQueryClient = cache(() => makeQueryClient());
function getOrCreateQueryClient() {
  if (isServer) return getServerQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
const globalsCss = "/assets/globals-C3vVGxOQ.css";
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }
    ],
    links: [{ rel: "stylesheet", href: globalsCss }]
  }),
  component: RootComponent
});
function RootComponent() {
  getOrCreateQueryClient();
  return /* @__PURE__ */ jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$4 = () => import("./index-BfsVN3JM.mjs");
const Route$b = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./route-DxCUGKBG.mjs");
const Route$a = createFileRoute("/pages")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function getStackClient(queryClient) {
  const baseURL = getBaseURL();
  return createStackClient({
    plugins: {
      blog: blogClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      cms: cmsClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      formBuilder: formBuilderClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      uiBuilder: uiBuilderClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      kanban: kanbanClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      comments: commentsClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      media: mediaClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      auth: authClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      account: accountClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      organization: organizationClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      routeDocs: routeDocsClientPlugin({
        queryClient,
        siteBasePath: "/pages"
      })
    }
  });
}
function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.BTST_SITE_URL) return process.env.BTST_SITE_URL;
  if (process.env.VITE_PUBLIC_SITE_URL) return process.env.VITE_PUBLIC_SITE_URL;
  if (process.env.BASE_URL) return process.env.BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
const Route$9 = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const queryClient = new QueryClient();
        const lib = getStackClient(queryClient);
        const entries = await lib.generateSitemap();
        const xml = sitemapEntryToXmlString(entries);
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
          }
        });
      }
    }
  }
});
const post = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").default("").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const postTag = pgTable("post_tag", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tag.id, { onDelete: "cascade" })
});
const contentType = pgTable("content_type", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  jsonSchema: text("json_schema").notNull(),
  fieldConfig: text("field_config"),
  autoFormVersion: integer("auto_form_version"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const contentItem = pgTable("content_item", {
  id: text("id").primaryKey(),
  contentTypeId: text("content_type_id").notNull().references(() => contentType.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  data: text("data").notNull(),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const contentRelation = pgTable("content_relation", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => contentItem.id, { onDelete: "cascade" }),
  targetId: text("target_id").notNull().references(() => contentItem.id, { onDelete: "cascade" }),
  fieldName: text("field_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const form = pgTable("form", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  schema: text("schema").notNull(),
  successMessage: text("success_message"),
  redirectUrl: text("redirect_url"),
  status: text("status").default("active").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const formSubmission = pgTable("form_submission", {
  id: text("id").primaryKey(),
  formId: text("form_id").notNull().references(() => form.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  submittedBy: text("submitted_by"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent")
});
const kanbanBoard = pgTable("kanban_board", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ownerId: text("owner_id"),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const kanbanColumn = pgTable("kanban_column", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").default(0).notNull(),
  boardId: text("board_id").notNull().references(() => kanbanBoard.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const kanbanTask = pgTable("kanban_task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("MEDIUM").notNull(),
  order: integer("order").default(0).notNull(),
  columnId: text("column_id").notNull().references(() => kanbanColumn.id, { onDelete: "cascade" }),
  assigneeId: text("assignee_id"),
  completedAt: timestamp("completed_at"),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const comment = pgTable("comment", {
  id: text("id").primaryKey(),
  resourceId: text("resource_id").notNull(),
  resourceType: text("resource_type").notNull(),
  parentId: text("parent_id"),
  authorId: text("author_id").notNull(),
  body: text("body").notNull(),
  status: text("status").default("pending").notNull(),
  likes: integer("likes").default(0).notNull(),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const commentLike = pgTable("comment_like", {
  id: text("id").primaryKey(),
  commentId: text("comment_id").notNull().references(() => comment.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  folderId: text("folder_id").references(() => mediaFolder.id, {
    onDelete: "cascade"
  }),
  alt: text("alt"),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const mediaFolder = pgTable("media_folder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id").references(() => mediaFolder.id, {
    onDelete: "cascade"
  }),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const postRelations = relations(post, ({ many }) => ({
  postTags: many(postTag)
}));
const tagRelations = relations(tag, ({ many }) => ({
  postTags: many(postTag)
}));
const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, {
    fields: [postTag.postId],
    references: [post.id]
  }),
  tag: one(tag, {
    fields: [postTag.tagId],
    references: [tag.id]
  })
}));
const contentTypeRelations = relations(contentType, ({ many }) => ({
  contentItems: many(contentItem)
}));
const contentItemRelations = relations(contentItem, ({ one, many }) => ({
  contentType: one(contentType, {
    fields: [contentItem.contentTypeId],
    references: [contentType.id]
  }),
  contentRelations: many(contentRelation)
}));
const contentRelationSourceIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.sourceId],
      references: [contentItem.id]
    })
  })
);
const contentRelationTargetIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.targetId],
      references: [contentItem.id]
    })
  })
);
const formRelations = relations(form, ({ many }) => ({
  formSubmissions: many(formSubmission)
}));
const formSubmissionRelations = relations(formSubmission, ({ one }) => ({
  form: one(form, {
    fields: [formSubmission.formId],
    references: [form.id]
  })
}));
const kanbanBoardRelations = relations(kanbanBoard, ({ many }) => ({
  kanbanColumns: many(kanbanColumn)
}));
const kanbanColumnRelations = relations(
  kanbanColumn,
  ({ one, many }) => ({
    kanbanBoard: one(kanbanBoard, {
      fields: [kanbanColumn.boardId],
      references: [kanbanBoard.id]
    }),
    kanbanTasks: many(kanbanTask)
  })
);
const kanbanTaskRelations = relations(kanbanTask, ({ one }) => ({
  kanbanColumn: one(kanbanColumn, {
    fields: [kanbanTask.columnId],
    references: [kanbanColumn.id]
  })
}));
const commentRelations = relations(comment, ({ many }) => ({
  commentLikes: many(commentLike)
}));
const commentLikeRelations = relations(commentLike, ({ one }) => ({
  comment: one(comment, {
    fields: [commentLike.commentId],
    references: [comment.id]
  })
}));
const mediaAssetRelations = relations(mediaAsset, ({ one }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaAsset.folderId],
    references: [mediaFolder.id]
  })
}));
const mediaFolderRelations = relations(mediaFolder, ({ one, many }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaFolder.parentId],
    references: [mediaFolder.id]
  }),
  mediaAssets: many(mediaAsset)
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  comment,
  commentLike,
  commentLikeRelations,
  commentRelations,
  contentItem,
  contentItemRelations,
  contentRelation,
  contentRelationSourceIdRelations,
  contentRelationTargetIdRelations,
  contentType,
  contentTypeRelations,
  form,
  formRelations,
  formSubmission,
  formSubmissionRelations,
  kanbanBoard,
  kanbanBoardRelations,
  kanbanColumn,
  kanbanColumnRelations,
  kanbanTask,
  kanbanTaskRelations,
  mediaAsset,
  mediaAssetRelations,
  mediaFolder,
  mediaFolderRelations,
  post,
  postRelations,
  postTag,
  postTagRelations,
  tag,
  tagRelations
}, Symbol.toStringTag, { value: "Module" }));
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});
const drizzleDb = drizzle(pool, {
  schema
});
const myStack = stack({
  basePath: "/api/data",
  plugins: {
    blog: blogBackendPlugin(),
    cms: cmsBackendPlugin({ contentTypes: [{
      name: "Article",
      slug: "article",
      schema: object({
        title: string(),
        summary: string(),
        body: string(),
        publishedAt: string(),
        published: boolean$1()
      })
    }, UI_BUILDER_CONTENT_TYPE] }),
    formBuilder: formBuilderBackendPlugin(),
    kanban: kanbanBackendPlugin(),
    comments: commentsBackendPlugin({ allowPosting: false }),
    media: mediaBackendPlugin({ storageAdapter: void 0 }),
    openApi: openApiBackendPlugin()
  },
  adapter: (db) => createDrizzleAdapter(
    drizzleDb,
    db,
    {
      provider: "pg"
    }
  )({})
});
const { handler, dbSchema } = myStack;
let seeded$4 = false;
const Route$8 = createFileRoute("/api/seed-blog")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$4) return Response.json({ ok: true, skipped: true });
        seeded$4 = true;
        try {
          const result = await (async () => {
            const adapter = myStack.adapter;
            const existing = await adapter.findMany({ model: "post", limit: 1 });
            if (existing.length > 0) return { ok: true, skipped: true };
            const now = /* @__PURE__ */ new Date();
            await adapter.create({
              model: "post",
              data: {
                title: "Getting Started with BTST Blog",
                slug: "getting-started",
                content: `# Getting Started with BTST Blog

Welcome to the **BTST Blog plugin** demo! This post was seeded automatically when the server started.

## What you can do

- Browse published posts on this page
- Click a post to read the full article
- Use the **New Post** button to create your own post
- Edit or delete posts from the post detail page

## Markdown support

The editor supports full **Markdown** including code blocks, blockquotes, tables, lists, and headings.

Try creating a new post to see the editor in action!`,
                excerpt: "An introduction to the BTST blog plugin — browse posts, create new ones, and explore the Markdown editor.",
                published: true,
                publishedAt: now,
                createdAt: now,
                updatedAt: now
              }
            });
            await adapter.create({
              model: "post",
              data: {
                title: "Building Full-Stack Apps with Plugins",
                slug: "full-stack-plugins",
                content: `# Building Full-Stack Apps with Plugins

BTST takes a plugin-first approach to full-stack development. Each plugin ships with backend API routes, database schema, React components, and React Query hooks.

| Plugin | Description |
|--------|-------------|
| Blog | Markdown blog with drafts, tags, and RSS |
| AI Chat | Streaming AI conversations |
| CMS | Headless content management |
| Kanban | Project boards and task tracking |
| Form Builder | Dynamic forms with submissions |
| UI Builder | Visual drag-and-drop page builder |`,
                excerpt: "Explore how BTST plugins combine backend APIs, database schemas, and React components into one cohesive system.",
                published: true,
                publishedAt: new Date(now.getTime() - 864e5),
                createdAt: new Date(now.getTime() - 864e5),
                updatedAt: new Date(now.getTime() - 864e5)
              }
            });
            await adapter.create({
              model: "post",
              data: {
                title: "SEO and Meta Tags in BTST",
                slug: "seo-and-meta-tags",
                content: `# SEO and Meta Tags in BTST

BTST plugins generate proper meta tags for every page automatically including title, description, Open Graph, and Twitter card tags.`,
                excerpt: "BTST plugins generate Open Graph and Twitter card meta tags for every page automatically.",
                published: true,
                publishedAt: new Date(now.getTime() - 1728e5),
                createdAt: new Date(now.getTime() - 1728e5),
                updatedAt: new Date(now.getTime() - 1728e5)
              }
            });
            console.log("[seed] blog: 3 posts created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$4 = false;
          console.error("[seed] blog failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$3 = false;
const Route$7 = createFileRoute("/api/seed-cms")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$3) return Response.json({ ok: true, skipped: true });
        seeded$3 = true;
        try {
          const result = await (async () => {
            const api = myStack.api;
            const existing = await api.cms.getAllContentItems("article", { limit: 1 });
            if (existing.items && existing.items.length > 0) return { ok: true, skipped: true };
            await api.cms.createContentItem("article", { slug: "welcome-to-btst-cms", data: { title: "Welcome to BTST CMS", summary: "An introduction to managing structured content with the BTST CMS plugin.", body: "The BTST CMS plugin lets you define your content types as Zod schemas and get a fully functional headless CMS automatically.", publishedAt: (/* @__PURE__ */ new Date()).toISOString(), published: true } });
            await api.cms.createContentItem("article", { slug: "getting-started-with-content-types", data: { title: "Getting Started with Content Types", summary: "Learn how to define and manage content types in the BTST CMS plugin.", body: "Content types are defined as Zod schemas in your stack configuration. Each schema field maps to a form field in the CMS editor.", publishedAt: new Date(Date.now() - 864e5).toISOString(), published: true } });
            await api.cms.createContentItem("article", { slug: "headless-cms-benefits", data: { title: "Benefits of a Headless CMS", summary: "Explore why headless CMS architecture is ideal for modern web applications.", body: "A headless CMS separates content management from presentation, giving developers full control over how content is displayed.", publishedAt: new Date(Date.now() - 1728e5).toISOString(), published: false } });
            console.log("[seed] cms: 3 articles created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$3 = false;
          console.error("[seed] cms failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$2 = false;
const Route$6 = createFileRoute("/api/seed-form-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$2) return Response.json({ ok: true, skipped: true });
        seeded$2 = true;
        try {
          const result = await (async () => {
            const adapter = myStack.adapter;
            const existing = await adapter.findMany({ model: "form", limit: 1 });
            if (existing.length > 0) return { ok: true, skipped: true };
            const contactFormSchema = JSON.stringify({
              type: "object",
              properties: {
                name: { type: "string", title: "Your Name", "x-field-type": "text" },
                email: { type: "string", format: "email", title: "Email Address", "x-field-type": "text" },
                subject: { type: "string", title: "Subject", "x-field-type": "text" },
                message: { type: "string", title: "Message", "x-field-type": "textarea" },
                newsletter: { type: "boolean", title: "Subscribe to newsletter", "x-field-type": "switch", default: false }
              },
              required: ["name", "email", "message"]
            });
            const feedbackFormSchema = JSON.stringify({
              type: "object",
              properties: {
                rating: { type: "string", title: "Rating", "x-field-type": "select", enum: ["1", "2", "3", "4", "5"], enumNames: ["⭐ Poor", "⭐⭐ Fair", "⭐⭐⭐ Good", "⭐⭐⭐⭐ Very Good", "⭐⭐⭐⭐⭐ Excellent"] },
                category: { type: "string", title: "Category", "x-field-type": "radio", enum: ["product", "support", "documentation", "other"], enumNames: ["Product", "Support", "Documentation", "Other"] },
                comments: { type: "string", title: "Comments", "x-field-type": "textarea" }
              },
              required: ["rating", "category"]
            });
            const now = /* @__PURE__ */ new Date();
            await adapter.create({ model: "form", data: { name: "Contact Us", slug: "contact-us", description: "A simple contact form for getting in touch.", schema: contactFormSchema, successMessage: "Thanks for reaching out! We'll get back to you soon.", status: "active", createdAt: now, updatedAt: now } });
            await adapter.create({ model: "form", data: { name: "Feedback Form", slug: "feedback", description: "Share your feedback about our product and services.", schema: feedbackFormSchema, successMessage: "Thank you for your feedback!", status: "active", createdAt: new Date(now.getTime() - 864e5), updatedAt: new Date(now.getTime() - 864e5) } });
            console.log("[seed] form-builder: 2 forms created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$2 = false;
          console.error("[seed] form-builder failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$1 = false;
const Route$5 = createFileRoute("/api/seed-kanban")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$1) return Response.json({ ok: true, skipped: true });
        seeded$1 = true;
        try {
          const result = await (async () => {
            const { findOrCreateKanbanBoard, getKanbanColumnsByBoardId, createKanbanTask } = await import("@btst/stack/plugins/kanban/api");
            const adapter = myStack.adapter;
            const board = await findOrCreateKanbanBoard(adapter, "demo-board", "BTST Demo Board", ["To Do", "In Progress", "In Review", "Done"]);
            const columns = await getKanbanColumnsByBoardId(adapter, board.id);
            if (!columns || columns.length === 0) return { ok: true, skipped: true };
            const todoCol = columns.find((c) => c.title === "To Do");
            const inProgressCol = columns.find((c) => c.title === "In Progress");
            const doneCol = columns.find((c) => c.title === "Done");
            if (!todoCol || !inProgressCol || !doneCol) return { ok: true, skipped: true };
            const existingTasks = await adapter.findMany({ model: "kanbanTask", where: [{ field: "columnId", value: todoCol.id, operator: "eq" }], limit: 1 });
            if (existingTasks.length > 0) return { ok: true, skipped: true };
            await createKanbanTask(adapter, { title: "Set up the BTST stack", columnId: doneCol.id, description: "Install @btst/stack and configure the adapter", priority: "HIGH" });
            await createKanbanTask(adapter, { title: "Add the Kanban plugin", columnId: doneCol.id, description: "Register kanbanBackendPlugin and kanbanClientPlugin", priority: "HIGH" });
            await createKanbanTask(adapter, { title: "Configure custom columns", columnId: inProgressCol.id, description: "Customize the board columns to fit the team workflow", priority: "MEDIUM" });
            await createKanbanTask(adapter, { title: "Invite team members", columnId: inProgressCol.id, description: "Add colleagues to the demo board", priority: "LOW" });
            await createKanbanTask(adapter, { title: "Connect to a real database", columnId: todoCol.id, description: "Replace the in-memory adapter with Prisma, Drizzle, or another supported ORM", priority: "MEDIUM" });
            await createKanbanTask(adapter, { title: "Add authentication", columnId: todoCol.id, description: "Protect the kanban routes with your auth solution", priority: "HIGH" });
            await createKanbanTask(adapter, { title: "Deploy to production", columnId: todoCol.id, description: "Deploy the app to Vercel, Fly.io, or your preferred hosting", priority: "URGENT" });
            console.log("[seed] kanban: 1 board, 4 columns, 7 tasks created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$1 = false;
          console.error("[seed] kanban failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded = false;
const Route$4 = createFileRoute("/api/seed-ui-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true });
        seeded = true;
        try {
          const result = await (async () => {
            const { UI_BUILDER_TYPE_SLUG } = await import("@btst/stack/plugins/ui-builder");
            const api = myStack.api;
            const existing = await api.cms.getAllContentItems(UI_BUILDER_TYPE_SLUG, { limit: 1 });
            if (existing.items && existing.items.length > 0) return { ok: true, skipped: true };
            const initialLayers = [{ id: "page-root", type: "div", name: "Page", props: { className: "min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8" }, children: [{ id: "welcome-card", type: "Card", name: "Welcome Card", props: { className: "w-full max-w-md shadow-xl" }, children: [{ id: "card-content", type: "CardContent", name: "Card Content", props: {}, children: [{ id: "welcome-text", type: "CardDescription", name: "Welcome Message", props: { className: "text-base leading-relaxed" }, children: "Welcome to UI Builder! Edit this page in the visual editor." }] }] }] }];
            const initialVariables = [{ id: "userName", name: "User Name", type: "string", defaultValue: "Alex" }];
            await api.cms.createContentItem(UI_BUILDER_TYPE_SLUG, { slug: "welcome", data: { layers: JSON.stringify(initialLayers), variables: JSON.stringify(initialVariables), status: "published" } });
            console.log("[seed] ui-builder: 1 sample page created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded = false;
          console.error("[seed] ui-builder failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$2 = () => import("./form-demo._slug-CrAQv24Q.mjs");
const Route$3 = createFileRoute("/form-demo/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_-CYwod7oq.mjs");
const Route$2 = createFileRoute("/pages/$")({
  ssr: true,
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  loader: async ({
    params
  }) => {
    const queryClient = getOrCreateQueryClient();
    const routePath = normalizePath(params._splat);
    const route = getStackClient(queryClient).router.getRoute(routePath);
    if (!route) throw notFound();
    if (route.loader) await route.loader();
    return {
      meta: route.meta?.()
    };
  },
  head: ({
    loaderData
  }) => {
    if (!loaderData?.meta || !Array.isArray(loaderData.meta)) {
      return {
        title: "No Meta",
        meta: [{
          title: "No Meta"
        }]
      };
    }
    return {
      meta: loaderData.meta
    };
  }
});
const $$splitComponentImporter = () => import("./preview._slug-22zRUtdE.mjs");
const Route$1 = createFileRoute("/preview/$slug")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/api/data/$")({
  server: {
    handlers: {
      GET: async ({ request }) => handler(request),
      POST: async ({ request }) => handler(request),
      PUT: async ({ request }) => handler(request),
      PATCH: async ({ request }) => handler(request),
      DELETE: async ({ request }) => handler(request)
    }
  }
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const PagesRouteRoute = Route$a.update({
  id: "/pages",
  path: "/pages",
  getParentRoute: () => Route$c
});
const SitemapDotxmlRoute = Route$9.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$c
});
const ApiSeedBlogRoute = Route$8.update({
  id: "/api/seed-blog",
  path: "/api/seed-blog",
  getParentRoute: () => Route$c
});
const ApiSeedCmsRoute = Route$7.update({
  id: "/api/seed-cms",
  path: "/api/seed-cms",
  getParentRoute: () => Route$c
});
const ApiSeedFormBuilderRoute = Route$6.update({
  id: "/api/seed-form-builder",
  path: "/api/seed-form-builder",
  getParentRoute: () => Route$c
});
const ApiSeedKanbanRoute = Route$5.update({
  id: "/api/seed-kanban",
  path: "/api/seed-kanban",
  getParentRoute: () => Route$c
});
const ApiSeedUiBuilderRoute = Route$4.update({
  id: "/api/seed-ui-builder",
  path: "/api/seed-ui-builder",
  getParentRoute: () => Route$c
});
const FormDemoSlugRoute = Route$3.update({
  id: "/form-demo/$slug",
  path: "/form-demo/$slug",
  getParentRoute: () => Route$c
});
const PagesSplatRoute = Route$2.update({
  id: "/$",
  path: "/$",
  getParentRoute: () => PagesRouteRoute
});
const PreviewSlugRoute = Route$1.update({
  id: "/preview/$slug",
  path: "/preview/$slug",
  getParentRoute: () => Route$c
});
const ApiDataSplatRoute = Route.update({
  id: "/api/data/$",
  path: "/api/data/$",
  getParentRoute: () => Route$c
});
const PagesRouteRouteChildren = {
  PagesSplatRoute
};
const PagesRouteRouteWithChildren = PagesRouteRoute._addFileChildren(
  PagesRouteRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  PagesRouteRoute: PagesRouteRouteWithChildren,
  SitemapDotxmlRoute,
  ApiSeedBlogRoute,
  ApiSeedCmsRoute,
  ApiSeedFormBuilderRoute,
  ApiSeedKanbanRoute,
  ApiSeedUiBuilderRoute,
  FormDemoSlugRoute,
  PreviewSlugRoute,
  ApiDataSplatRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const queryClient = getOrCreateQueryClient();
  const router2 = createRouter({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: "intent",
    scrollRestoration: true
  });
  setupRouterSsrQueryIntegration({
    router: router2,
    queryClient
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  Route$2 as a,
  getStackClient as b,
  Route$1 as c,
  getOrCreateQueryClient as g,
  router as r
};
