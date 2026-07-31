import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"

const btstSeedPlugin = {
  name: "btst-seed",
  configureServer(server) {
    const SEEDS = ["/api/seed-blog", "/api/seed-cms", "/api/seed-form-builder", "/api/seed-ui-builder", "/api/seed-kanban"]
    const BASE = "http://localhost:3000"
    async function trySeed(path) {
      for (let i = 0; i < 60; i++) {
        try {
          const res = await fetch(BASE + path)
          if (res.ok) { const d = await res.json(); console.log("[seed]", path, d); return }
        } catch {}
        await new Promise(r => setTimeout(r, 1000))
      }
      console.error("[seed] timed out:", path)
    }
    ;(async () => {
      await new Promise(resolve => {
        if (server.httpServer?.listening) resolve(undefined)
        else server.httpServer?.once("listening", () => resolve(undefined))
      })
      try {
        for (const path of SEEDS) { await trySeed(path) }
        console.log("[seed] Seeding complete")
      } catch (err) { console.error("[seed] Seeding failed:", err) }
    })()
  },
}

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    nitro(),
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
    {
      // WebContainers: Node's ESM loader cannot handle .css imports inside SSR
      // bundles (ERR_UNKNOWN_FILE_EXTENSION). Return an empty module for every
      // .css file during SSR so the import is a no-op rather than a crash.
      name: "ssr-ignore-css",
      enforce: "pre",
      load(id, options) {
        if (options?.ssr && /\.css(\?.*)?$/.test(id)) {
          return { code: "" }
        }
      },
    },
    btstSeedPlugin,
  ],
  ssr: {
    // Bundle @btst/* and highlight.js through Vite so the plugin above can
    // intercept their .css imports before they reach Node's ESM loader.
    noExternal: ["@btst", "highlight.js"],
  },
  define: {
    "import.meta.env.VITE_BASE_URL": JSON.stringify("http://localhost:3000"),
    // No OPENAI_API_KEY in WebContainers — banner will prompt users to add it.
    "import.meta.env.VITE_HAS_OPENAI_KEY": JSON.stringify(""),
  },
})
