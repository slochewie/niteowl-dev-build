import { jsx, jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { S as Skeleton } from "./router-DU5jczZR.js";
import { P as PageWrapper } from "./page-wrapper-CpCNJw6l.js";
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
function SubmissionsSkeleton() {
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "submissions-skeleton", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-64" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" })
      ] }) }),
      Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "border-b p-4 last:border-0", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" })
      ] }) }, i))
    ] })
  ] }) });
}
const SubmissionsPage = lazy(
  () => import("./submissions-page.internal-CGN4ahaI.js").then((m) => ({
    default: m.SubmissionsPage
  }))
);
function SubmissionsPageComponent({ formId }) {
  return /* @__PURE__ */ jsx(ErrorBoundary, { FallbackComponent: DefaultError, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SubmissionsSkeleton, {}), children: /* @__PURE__ */ jsx(SubmissionsPage, { formId }) }) });
}
export {
  SubmissionsPageComponent
};
