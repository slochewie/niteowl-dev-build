import { createFileRoute } from "@tanstack/react-router"
import { myStack } from "@/lib/stack"

let seeded = false

export const Route = createFileRoute("/api/seed-form-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true })
        seeded = true
        try {
          const result = await (async () => {
  const adapter = myStack.adapter
  const existing = await adapter.findMany({ model: "form", limit: 1 })
  if (existing.length > 0) return { ok: true, skipped: true }
  const contactFormSchema = JSON.stringify({
    type: "object",
    properties: {
      name: { type: "string", title: "Your Name", "x-field-type": "text" },
      email: { type: "string", format: "email", title: "Email Address", "x-field-type": "text" },
      subject: { type: "string", title: "Subject", "x-field-type": "text" },
      message: { type: "string", title: "Message", "x-field-type": "textarea" },
      newsletter: { type: "boolean", title: "Subscribe to newsletter", "x-field-type": "switch", default: false },
    },
    required: ["name", "email", "message"],
  })
  const feedbackFormSchema = JSON.stringify({
    type: "object",
    properties: {
      rating: { type: "string", title: "Rating", "x-field-type": "select", enum: ["1","2","3","4","5"], enumNames: ["⭐ Poor","⭐⭐ Fair","⭐⭐⭐ Good","⭐⭐⭐⭐ Very Good","⭐⭐⭐⭐⭐ Excellent"] },
      category: { type: "string", title: "Category", "x-field-type": "radio", enum: ["product","support","documentation","other"], enumNames: ["Product","Support","Documentation","Other"] },
      comments: { type: "string", title: "Comments", "x-field-type": "textarea" },
    },
    required: ["rating", "category"],
  })
  const now = new Date()
  await adapter.create({ model: "form", data: { name: "Contact Us", slug: "contact-us", description: "A simple contact form for getting in touch.", schema: contactFormSchema, successMessage: "Thanks for reaching out! We'll get back to you soon.", status: "active", createdAt: now, updatedAt: now } })
  await adapter.create({ model: "form", data: { name: "Feedback Form", slug: "feedback", description: "Share your feedback about our product and services.", schema: feedbackFormSchema, successMessage: "Thank you for your feedback!", status: "active", createdAt: new Date(now.getTime() - 86400000), updatedAt: new Date(now.getTime() - 86400000) } })
  console.log("[seed] form-builder: 2 forms created")
  return { ok: true }
          })()
          return Response.json(result ?? { ok: true })
        } catch (err) {
          seeded = false
          console.error("[seed] form-builder failed:", err)
          return Response.json({ ok: false }, { status: 500 })
        }
      },
    },
  },
})
