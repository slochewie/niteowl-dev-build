import { jsx, jsxs } from "react/jsx-runtime";
import { lazy } from "react";
import { N as NotFoundPage, D as DefaultError } from "./404-page-j8_18ZSG.mjs";
import { l as usePluginOverrides, C as ComposedRoute, S as Skeleton } from "./router-qu_5GP1h.mjs";
import { P as PageWrapper } from "./page-wrapper-Cg71u63l.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "../_libs/lucide-react.mjs";
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
  () => import("./content-list-page.internal-BtsoQ11a.mjs").then((m) => ({
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
