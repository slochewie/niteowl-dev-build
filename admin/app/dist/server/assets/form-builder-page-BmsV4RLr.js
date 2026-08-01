import { jsxs, jsx } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { S as Skeleton } from "./router-DU5jczZR.js";
import { ErrorBoundary } from "react-error-boundary";
import { D as DefaultError } from "./default-error-DmTYveZZ.js";
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
function FormBuilderSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", "data-testid": "form-builder-skeleton", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-24" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-64 border-r p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" }),
        Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 rounded-lg" }, i))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-48 rounded-lg" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-24 rounded-lg" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-80 border-l p-4 space-y-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-full rounded-lg" })
      ] })
    ] })
  ] });
}
const FormBuilderPage = lazy(
  () => import("./form-builder-page.internal-Cbd1U5-G.js").then((m) => ({
    default: m.FormBuilderPage
  }))
);
function FormBuilderPageComponent({ id }) {
  return /* @__PURE__ */ jsx(ErrorBoundary, { FallbackComponent: DefaultError, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(FormBuilderSkeleton, {}), children: /* @__PURE__ */ jsx(FormBuilderPage, { id }) }) });
}
export {
  FormBuilderPageComponent
};
