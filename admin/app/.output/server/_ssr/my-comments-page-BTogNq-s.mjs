import { jsx, jsxs } from "react/jsx-runtime";
import { lazy } from "react";
import { P as PageWrapper, C as COMMENTS_LOCALIZATION } from "./page-wrapper-BF9x77Ov.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import { C as ComposedRoute, l as usePluginOverrides } from "./router-qu_5GP1h.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
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
const UserCommentsPageInternal = lazy(
  () => import("./my-comments-page.internal-BPuxJTWU.mjs").then((m) => ({
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
