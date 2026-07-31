import { createFileRoute } from "@tanstack/react-router"
import { myStack } from "@/lib/stack"

let seeded = false

export const Route = createFileRoute("/api/seed-ui-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true })
        seeded = true
        try {
          const result = await (async () => {
  const { UI_BUILDER_TYPE_SLUG } = await import("@btst/stack/plugins/ui-builder")
  const api = myStack.api
  const existing = await api.cms.getAllContentItems(UI_BUILDER_TYPE_SLUG, { limit: 1 })
  if (existing.items && existing.items.length > 0) return { ok: true, skipped: true }
  const initialLayers = [{ id: "page-root", type: "div", name: "Page", props: { className: "min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8" }, children: [{ id: "welcome-card", type: "Card", name: "Welcome Card", props: { className: "w-full max-w-md shadow-xl" }, children: [{ id: "card-content", type: "CardContent", name: "Card Content", props: {}, children: [{ id: "welcome-text", type: "CardDescription", name: "Welcome Message", props: { className: "text-base leading-relaxed" }, children: "Welcome to UI Builder! Edit this page in the visual editor." }] }] }] }]
  const initialVariables = [{ id: "userName", name: "User Name", type: "string", defaultValue: "Alex" }]
  await api.cms.createContentItem(UI_BUILDER_TYPE_SLUG, { slug: "welcome", data: { layers: JSON.stringify(initialLayers), variables: JSON.stringify(initialVariables), status: "published" } })
  console.log("[seed] ui-builder: 1 sample page created")
  return { ok: true }
          })()
          return Response.json(result ?? { ok: true })
        } catch (err) {
          seeded = false
          console.error("[seed] ui-builder failed:", err)
          return Response.json({ ok: false }, { status: 500 })
        }
      },
    },
  },
})
