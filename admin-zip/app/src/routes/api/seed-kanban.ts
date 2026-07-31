import { createFileRoute } from "@tanstack/react-router"
import { myStack } from "@/lib/stack"

let seeded = false

export const Route = createFileRoute("/api/seed-kanban")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true })
        seeded = true
        try {
          const result = await (async () => {
  const { findOrCreateKanbanBoard, getKanbanColumnsByBoardId, createKanbanTask } = await import("@btst/stack/plugins/kanban/api")
  const adapter = myStack.adapter
  const board = await findOrCreateKanbanBoard(adapter, "demo-board", "BTST Demo Board", ["To Do", "In Progress", "In Review", "Done"])
  const columns = await getKanbanColumnsByBoardId(adapter, board.id)
  if (!columns || columns.length === 0) return { ok: true, skipped: true }
  const todoCol = columns.find((c) => c.title === "To Do")
  const inProgressCol = columns.find((c) => c.title === "In Progress")
  const doneCol = columns.find((c) => c.title === "Done")
  if (!todoCol || !inProgressCol || !doneCol) return { ok: true, skipped: true }
  const existingTasks = await adapter.findMany({ model: "kanbanTask", where: [{ field: "columnId", value: todoCol.id, operator: "eq" }], limit: 1 })
  if (existingTasks.length > 0) return { ok: true, skipped: true }
  await createKanbanTask(adapter, { title: "Set up the BTST stack", columnId: doneCol.id, description: "Install @btst/stack and configure the adapter", priority: "HIGH" })
  await createKanbanTask(adapter, { title: "Add the Kanban plugin", columnId: doneCol.id, description: "Register kanbanBackendPlugin and kanbanClientPlugin", priority: "HIGH" })
  await createKanbanTask(adapter, { title: "Configure custom columns", columnId: inProgressCol.id, description: "Customize the board columns to fit the team workflow", priority: "MEDIUM" })
  await createKanbanTask(adapter, { title: "Invite team members", columnId: inProgressCol.id, description: "Add colleagues to the demo board", priority: "LOW" })
  await createKanbanTask(adapter, { title: "Connect to a real database", columnId: todoCol.id, description: "Replace the in-memory adapter with Prisma, Drizzle, or another supported ORM", priority: "MEDIUM" })
  await createKanbanTask(adapter, { title: "Add authentication", columnId: todoCol.id, description: "Protect the kanban routes with your auth solution", priority: "HIGH" })
  await createKanbanTask(adapter, { title: "Deploy to production", columnId: todoCol.id, description: "Deploy the app to Vercel, Fly.io, or your preferred hosting", priority: "URGENT" })
  console.log("[seed] kanban: 1 board, 4 columns, 7 tasks created")
  return { ok: true }
          })()
          return Response.json(result ?? { ok: true })
        } catch (err) {
          seeded = false
          console.error("[seed] kanban failed:", err)
          return Response.json({ ok: false }, { status: 500 })
        }
      },
    },
  },
})
