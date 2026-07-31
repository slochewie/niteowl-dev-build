#!/usr/bin/env node
import { cp, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";

const src = "node_modules/@btst/stack/src";
const dest = "src/.btst-stack-src";
const uiSrc = "node_modules/@btst/stack/dist/packages/ui";
const uiDest = "src/.btst-stack-ui";

if (!existsSync(src)) {
  console.log("[copy-stack-src] node_modules/@btst/stack/src not found, skipping");
  process.exit(0);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`[copy-stack-src] copied ${src} → ${dest}`);

if (existsSync(uiSrc)) {
  await rm(uiDest, { recursive: true, force: true });
  await mkdir(uiDest, { recursive: true });
  await cp(uiSrc, uiDest, { recursive: true });
  console.log(`[copy-stack-src] copied ${uiSrc} → ${uiDest}`);
}
