import { jsx } from "react/jsx-runtime";
import { R as Route, i as getOrCreateQueryClient, n as normalizePath, j as getStackClient } from "./router-DU5jczZR.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "react";
import "@btst/yar";
import "better-call/client";
import "zod";
import "lucide-react";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
function BtstPagesRoute() {
  const params = Route.useParams();
  const queryClient = getOrCreateQueryClient();
  const routePath = normalizePath(params._splat);
  const route = getStackClient(queryClient).router.getRoute(routePath);
  return route?.PageComponent ? /* @__PURE__ */ jsx(route.PageComponent, {}) : /* @__PURE__ */ jsx("div", { children: "Route not found" });
}
export {
  BtstPagesRoute as component
};
