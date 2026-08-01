import { jsx, jsxs } from "react/jsx-runtime";
import { lazy } from "react";
import { N as NotFoundPage, D as DefaultError } from "./404-page-C3c0Rv4c.js";
import { S as Skeleton, l as usePluginOverrides, C as ComposedRoute } from "./router-DU5jczZR.js";
import { P as PageWrapper } from "./page-wrapper-DuLRJf3n.js";
import "lucide-react";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
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
function DashboardSkeleton() {
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-dashboard-skeleton", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-64" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-32 rounded-lg" }, i)) })
  ] }) });
}
const DashboardPageInternal = lazy(
  () => import("./dashboard-page.internal-XW_VgdVO.js").then((m) => ({
    default: m.DashboardPage
  }))
);
function DashboardPageComponent() {
  const { onRouteError } = usePluginOverrides("cms");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/cms",
      PageComponent: DashboardPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: DashboardSkeleton,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("dashboard", error, {
            path: "/cms",
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  DashboardPageComponent
};
