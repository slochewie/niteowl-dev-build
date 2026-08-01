import { jsxs, jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, E as PageWrapper, F as PageHeader } from "./router-DU5jczZR.js";
import { P as PostsList } from "./posts-list-DA6MmIoY.js";
import { u as useTags, E as EmptyList, a as useSuspensePosts } from "./blog-hooks-lyVerMe2.js";
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
function TagPage({ tagSlug }) {
  const overrides = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { localization } = overrides;
  useRouteLifecycle({
    routeName: "tag",
    context: {
      path: `/blog/tag/${tagSlug}`,
      params: { tagSlug },
      isSSR: typeof window === "undefined"
    },
    overrides
  });
  const { tags } = useTags();
  const tag = tags?.find((t) => t.slug === tagSlug);
  if (!tag) {
    return /* @__PURE__ */ jsxs(PageWrapper, { testId: "tag-page", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(PageHeader, { title: localization.BLOG_TAG_NOT_FOUND }) }),
      /* @__PURE__ */ jsx(EmptyList, { message: localization.BLOG_TAG_NOT_FOUND_DESCRIPTION })
    ] });
  }
  return /* @__PURE__ */ jsxs(PageWrapper, { testId: "tag-page", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: `${localization.BLOG_TAG_PAGE_TITLE.replace("{tag}", tag.name)}`,
        description: localization.BLOG_TAG_PAGE_DESCRIPTION
      }
    ) }),
    /* @__PURE__ */ jsx(Content, { tagSlug })
  ] });
}
function Content({ tagSlug }) {
  const { posts, loadMore, hasMore, isLoadingMore } = useSuspensePosts({
    published: true,
    tagSlug
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
  TagPage
};
