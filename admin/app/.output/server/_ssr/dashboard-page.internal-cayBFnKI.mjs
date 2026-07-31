import { jsx, jsxs } from "react/jsx-runtime";
import { l as usePluginOverrides, D as useBasePath, v as Card, x as CardHeader, y as CardTitle, w as CardContent } from "./router-qu_5GP1h.mjs";
import { u as useSuspenseContentTypes, C as CMS_LOCALIZATION, E as EmptyState } from "./cms-hooks-qLe16dQu.mjs";
import { P as PageWrapper } from "./page-wrapper-Cg71u63l.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import "react";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { u as FileText } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/zod.mjs";
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "./useInfiniteQuery-BegVgW11.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/react.mjs";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "crypto";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "stream";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
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
