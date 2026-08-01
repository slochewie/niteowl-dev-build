import { jsxs, jsx } from "react/jsx-runtime";
import { S as Skeleton, v as Card, w as CardContent } from "./router-DU5jczZR.js";
import { S as ScrollArea } from "./scroll-area-BkT6tLMk.js";
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
import "./index-BUGN0YTJ.js";
import "react-dom";
import "./index-BI_-Kgeu.js";
import "./index-S7rpP7KI.js";
import "./index-KZ0RSJRl.js";
import "./index-IXOTxK3N.js";
function DocsPageSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:block w-72 border-r bg-card shrink-0", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" }) }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "h-[calc(100vh-57px)]", children: /* @__PURE__ */ jsx("div", { className: "p-3 space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "ml-2 space-y-1", children: [1, 2, 3].map((j) => /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-full" }, j)) })
      ] }, i)) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto pt-16 md:pt-0", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 sm:h-9 w-48 sm:w-64" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 sm:h-5 w-72 sm:w-96" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-px bg-border" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20" })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32 mb-4" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-0 space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "hidden md:block space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-full" }, i)) }),
          /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-28 w-full rounded-lg" }, i)) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  DocsPageSkeleton
};
