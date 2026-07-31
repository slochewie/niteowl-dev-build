import { createFileRoute } from "@tanstack/react-router"
import { myStack } from "@/lib/stack"

let seeded = false

export const Route = createFileRoute("/api/seed-blog")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true })
        seeded = true
        try {
          const result = await (async () => {
  const adapter = myStack.adapter
  const existing = await adapter.findMany({ model: "post", limit: 1 })
  if (existing.length > 0) return { ok: true, skipped: true }
  const now = new Date()
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
      updatedAt: now,
    },
  })
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
      publishedAt: new Date(now.getTime() - 86400000),
      createdAt: new Date(now.getTime() - 86400000),
      updatedAt: new Date(now.getTime() - 86400000),
    },
  })
  await adapter.create({
    model: "post",
    data: {
      title: "SEO and Meta Tags in BTST",
      slug: "seo-and-meta-tags",
      content: `# SEO and Meta Tags in BTST

BTST plugins generate proper meta tags for every page automatically including title, description, Open Graph, and Twitter card tags.`,
      excerpt: "BTST plugins generate Open Graph and Twitter card meta tags for every page automatically.",
      published: true,
      publishedAt: new Date(now.getTime() - 172800000),
      createdAt: new Date(now.getTime() - 172800000),
      updatedAt: new Date(now.getTime() - 172800000),
    },
  })
  console.log("[seed] blog: 3 posts created")
  return { ok: true }
          })()
          return Response.json(result ?? { ok: true })
        } catch (err) {
          seeded = false
          console.error("[seed] blog failed:", err)
          return Response.json({ ok: false }, { status: 500 })
        }
      },
    },
  },
})
