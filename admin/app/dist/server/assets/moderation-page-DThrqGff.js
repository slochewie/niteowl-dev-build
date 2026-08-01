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
const ModerationPageInternal = lazy(
  () => import("./moderation-page.internal-CDle0DGN.js").then((m) => ({
    default: m.ModerationPage
  }))
);
function ModerationPageSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl mx-auto space-y-4 animate-pulse", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-64 rounded bg-muted" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 w-48 rounded bg-muted" }),
    /* @__PURE__ */ jsx("div", { className: "h-10 w-72 rounded bg-muted" }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border h-64 bg-muted" })
  ] });
}
function ModerationPageComponent() {
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/comments/moderation",
      PageComponent: ModerationPageWrapper,
      LoadingComponent: ModerationPageSkeleton,
      onError: (error) => console.error("[btst/comments] Moderation error:", error)
    }
  );
}
function ModerationPageWrapper() {
  const overrides = usePluginOverrides("comments");
  const loc = { ...COMMENTS_LOCALIZATION, ...overrides.localization };
  useRouteLifecycle({
    routeName: "moderation",
    context: {
      path: "/comments/moderation",
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (o, context) => {
      if (o.onBeforeModerationPageRendered) {
        return o.onBeforeModerationPageRendered(context);
      }
      return true;
    }
  });
  return /* @__PURE__ */ jsx(PageWrapper, { children: /* @__PURE__ */ jsx(
    ModerationPageInternal,
    {
      apiBaseURL: overrides.apiBaseURL,
      apiBasePath: overrides.apiBasePath,
      headers: overrides.headers,
      localization: loc
    }
  ) });
}
export {
  ModerationPageComponent
};
