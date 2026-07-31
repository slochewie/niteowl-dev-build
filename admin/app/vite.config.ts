import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
  },

  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    nitro({
      preset: "node-server",
      inlineDynamicImports: true,
    }),
    viteReact(),
  ],
});
