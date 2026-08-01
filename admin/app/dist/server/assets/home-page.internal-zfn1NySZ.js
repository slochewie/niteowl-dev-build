import { jsx, jsxs } from "react/jsx-runtime";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, E as PageWrapper, F as PageHeader } from "./router-DU5jczZR.js";
import { P as PostsList } from "./posts-list-DA6MmIoY.js";
import { b as useSuspenseTags, a as useSuspensePosts } from "./blog-hooks-lyVerMe2.js";
import { C as CollapsibleTagList } from "./collapsible-tag-list-CWaSuOBs.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
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
import "./command-5HTd1Hbk.js";
import "cmdk";
import "./dialog-Chz0Zs_g.js";
import "@radix-ui/react-dialog";
import "./post-card-ZC-FaXC3.js";
import "./badge-DFvO9DkX.js";
import "date-fns";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
import "./useInfiniteQuery-DU3bok0g.js";
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
