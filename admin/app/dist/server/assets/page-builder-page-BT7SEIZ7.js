import { jsxs, jsx } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { S as Skeleton } from "./router-DU5jczZR.js";
import { ErrorBoundary } from "react-error-boundary";
import { D as DefaultError } from "./default-error-Cs5qeeYK.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "lucide-react";
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
function PageBuilderSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", "data-testid": "page-builder-skeleton", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-24" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-64 border-r p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" }),
        Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 rounded-lg" }, i))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-64 rounded-lg" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-32 rounded-lg" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-80 border-l p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full" })
      ] })
    ] })
  ] });
}
const PageBuilderPageInternal = lazy(
  () => import("./page-builder-page.internal-CUjyZM2X.js").then((m) => ({
    default: m.PageBuilderPage
  }))
);
function PageBuilderPage({ id }) {
  return /* @__PURE__ */ jsx(ErrorBoundary, { FallbackComponent: DefaultError, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageBuilderSkeleton, {}), children: /* @__PURE__ */ jsx(PageBuilderPageInternal, { id }) }) });
}
export {
  PageBuilderPage
};
