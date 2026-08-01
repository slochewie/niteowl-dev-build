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
function ListSkeleton() {
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-list-skeleton", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-28" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border rounded-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "border-b px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" })
      ] }) }),
      Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b last:border-b-0", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" })
      ] }) }, i))
    ] })
  ] }) });
}
const ContentListPageInternal = lazy(
  () => import("./content-list-page.internal-DDtUUaTf.js").then((m) => ({
    default: m.ContentListPage
  }))
);
function ContentListPageComponent({
  typeSlug
}) {
  const { onRouteError } = usePluginOverrides("cms");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/cms/${typeSlug}`,
      PageComponent: ContentListPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: ListSkeleton,
      NotFoundComponent: NotFoundPage,
      props: { typeSlug },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("contentList", error, {
            path: `/cms/${typeSlug}`,
            params: { typeSlug },
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  ContentListPageComponent
};
