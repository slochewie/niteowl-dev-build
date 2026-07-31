import { jsxs, jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, E as PageWrapper, F as PageHeader, A as BLOG_LOCALIZATION } from "./router-qu_5GP1h.mjs";
import { P as PostsList } from "./posts-list-BuIpVeBq.mjs";
import { u as useSuspenseTags, a as useSuspensePosts } from "./blog-hooks-gv3MttsW.mjs";
import { C as CollapsibleTagList } from "./collapsible-tag-list-uL1HzXpe.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import "react";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
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
import "./command-8DCQ5FSU.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./dialog-B4u5EdHX.mjs";
import "./post-card-BBIV2tCO.mjs";
import "./badge-CGoI1f31.mjs";
import "../_libs/date-fns.mjs";
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
function TagsList() {
  const { tags } = useSuspenseTags();
  if (!tags || tags.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: /* @__PURE__ */ jsx(CollapsibleTagList, { tags }) });
}
function HomePage({ published }) {
  const overrides = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { localization } = overrides;
  useRouteLifecycle({
    routeName: published ? "posts" : "drafts",
    context: {
      path: published ? "/blog" : "/blog/drafts",
      isSSR: typeof window === "undefined",
      published
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (published && overrides2.onBeforePostsPageRendered) {
        return overrides2.onBeforePostsPageRendered(context);
      }
      if (!published && overrides2.onBeforeDraftsPageRendered) {
        return overrides2.onBeforeDraftsPageRendered(context);
      }
      return true;
    }
  });
  return /* @__PURE__ */ jsxs(PageWrapper, { testId: published ? "home-page" : "drafts-home-page", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: published ? localization.BLOG_LIST_TITLE : localization.BLOG_LIST_DRAFTS_TITLE,
        childrenBottom: /* @__PURE__ */ jsx(TagsList, {})
      }
    ) }),
    /* @__PURE__ */ jsx(Content, { published })
  ] });
}
function Content({ published }) {
  const { posts, loadMore, hasMore, isLoadingMore } = useSuspensePosts({
    published
  });
  return /* @__PURE__ */ jsx(
    PostsList,
    {
      posts,
      onLoadMore: loadMore,
      hasMore,
      isLoadingMore
    }
  );
}
export {
  HomePage
};
