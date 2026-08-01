import { jsx, jsxs } from "react/jsx-runtime";
import { FileText } from "lucide-react";
import { l as usePluginOverrides, D as useBasePath, v as Card, x as CardHeader, y as CardTitle, w as CardContent } from "./router-DU5jczZR.js";
import { u as useSuspenseContentTypes, C as CMS_LOCALIZATION, E as EmptyState } from "./cms-hooks-BTUtZRnj.js";
import { P as PageWrapper } from "./page-wrapper-DuLRJf3n.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "react";
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
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
import "./useInfiniteQuery-DU3bok0g.js";
function DashboardPage() {
  const overrides = usePluginOverrides("cms");
  const { navigate } = overrides;
  const localization = { ...CMS_LOCALIZATION, ...overrides.localization };
  const basePath = useBasePath();
  useRouteLifecycle({
    routeName: "dashboard",
    context: {
      path: "/cms",
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeDashboardRendered) {
        return overrides2.onBeforeDashboardRendered(context);
      }
      return true;
    }
  });
  const { contentTypes } = useSuspenseContentTypes();
  if (contentTypes.length === 0) {
    return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-dashboard-page", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: localization.CMS_DASHBOARD_TITLE }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: localization.CMS_DASHBOARD_SUBTITLE })
      ] }),
      /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: localization.CMS_DASHBOARD_NO_TYPES,
          description: localization.CMS_DASHBOARD_NO_TYPES_DESCRIPTION
        }
      )
    ] }) });
  }
  const formatItemCount = (count) => {
    if (count === 0) return localization.CMS_DASHBOARD_ITEMS_COUNT_ZERO;
    if (count === 1) return localization.CMS_DASHBOARD_ITEMS_COUNT_ONE;
    return localization.CMS_DASHBOARD_ITEMS_COUNT.replace(
      "{count}",
      String(count)
    );
  };
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-dashboard-page", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: localization.CMS_DASHBOARD_TITLE }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: localization.CMS_DASHBOARD_SUBTITLE })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: contentTypes.map((ct) => /* @__PURE__ */ jsxs(
      Card,
      {
        className: "hover:border-primary/50 transition-colors cursor-pointer",
        onClick: () => navigate(`${basePath}/cms/${ct.slug}`),
        children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-medium", children: ct.name }),
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: ct.itemCount }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: formatItemCount(ct.itemCount) }),
            ct.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2 line-clamp-2", children: ct.description })
          ] })
        ]
      },
      ct.id
    )) })
  ] }) });
}
export {
  DashboardPage
};
