import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { nitro } from "nitro/vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart(),

    nitro({
      preset: "node-server",
      traceDeps: [
        "@btst/stack",
        "react",
        "react-dom",
      ],
    }),

    viteReact(),
  ],
})
