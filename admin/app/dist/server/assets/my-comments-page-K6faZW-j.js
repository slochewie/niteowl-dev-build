import { jsx, jsxs } from "react/jsx-runtime";
import { lazy } from "react";
import { P as PageWrapper, C as COMMENTS_LOCALIZATION } from "./page-wrapper-DCLvTidy.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
import { C as ComposedRoute, l as usePluginOverrides } from "./router-DU5jczZR.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
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
const UserCommentsPageInternal = lazy(
  () => import("./my-comments-page.internal-BCDJrFIP.js").then((m) => ({
    default: m.UserCommentsPage
  }))
);
function UserCommentsPageSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-3xl mx-auto space-y-4 animate-pulse", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-48 rounded bg-muted" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 w-64 rounded bg-muted" }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border h-96 bg-muted" })
  ] });
}
function UserCommentsPageComponent() {
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/comments",
      PageComponent: UserCommentsPageWrapper,
      LoadingComponent: UserCommentsPageSkeleton,
      onError: (error) => console.error("[btst/comments] User Comments error:", error)
    }
  );
}
function UserCommentsPageWrapper() {
  const overrides = usePluginOverrides("comments");
  const loc = { ...COMMENTS_LOCALIZATION, ...overrides.localization };
  useRouteLifecycle({
    routeName: "userComments",
    context: {
      path: "/comments",
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (o, context) => {
      if (o.onBeforeUserCommentsPageRendered) {
        const result = o.onBeforeUserCommentsPageRendered(context);
        return result === false ? false : true;
      }
      return true;
    }
  });
  return /* @__PURE__ */ jsx(PageWrapper, { children: /* @__PURE__ */ jsx(
    UserCommentsPageInternal,
    {
      apiBaseURL: overrides.apiBaseURL,
      apiBasePath: overrides.apiBasePath,
      headers: overrides.headers,
      currentUserId: overrides.currentUserId,
      resourceLinks: overrides.resourceLinks,
      localization: loc
    }
  ) });
}
export {
  UserCommentsPageComponent
};
