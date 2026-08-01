import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-DU5jczZR.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { u as useSuspenseContentTypes, a as useSuspenseContent, b as useDeleteContent, E as EmptyState, C as CMS_LOCALIZATION } from "./cms-hooks-BTUtZRnj.js";
import { P as PageWrapper } from "./page-wrapper-DuLRJf3n.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
import { toast } from "sonner";
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
function ContentListPage({ typeSlug }) {
  const overrides = usePluginOverrides("cms");
  const { navigate, Link } = overrides;
  const localization = { ...CMS_LOCALIZATION, ...overrides.localization };
  const basePath = useBasePath();
  useRouteLifecycle({
    routeName: "contentList",
    context: {
      path: `/cms/${typeSlug}`,
      params: { typeSlug },
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeListRendered) {
        return overrides2.onBeforeListRendered(typeSlug, context);
      }
      return true;
    }
  });
  const limit = 20;
  const { contentTypes } = useSuspenseContentTypes();
  const contentType = contentTypes.find((ct) => ct.slug === typeSlug);
  const { items, total, refetch, loadMore, hasMore, isLoadingMore } = useSuspenseContent(typeSlug, {
    limit
  });
  const deleteContent = useDeleteContent(typeSlug);
  const LinkComponent = Link || "a";
  const handleDelete = async (id) => {
    try {
      await deleteContent.mutateAsync(id);
      toast.success(localization.CMS_TOAST_DELETE_SUCCESS);
      void refetch();
    } catch {
      toast.error(localization.CMS_TOAST_ERROR);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  if (!contentType) {
    return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-list-page", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-5xl", children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: localization.CMS_ERROR_NOT_FOUND,
        description: "Content type not found"
      }
    ) }) });
  }
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "cms-list-page", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => navigate(`${basePath}/cms`),
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: contentType.name }),
          contentType.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: contentType.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => navigate(`${basePath}/cms/${typeSlug}/new`), children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        localization.CMS_BUTTON_NEW_ITEM
      ] })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: localization.CMS_LIST_EMPTY,
        description: localization.CMS_LIST_EMPTY_DESCRIPTION,
        action: /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: () => navigate(`${basePath}/cms/${typeSlug}/new`),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
              localization.CMS_BUTTON_CREATE
            ]
          }
        )
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "border rounded-lg", children: [
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: localization.CMS_LIST_COLUMN_SLUG }),
          /* @__PURE__ */ jsx(TableHead, { children: localization.CMS_LIST_COLUMN_CREATED }),
          /* @__PURE__ */ jsx(TableHead, { children: localization.CMS_LIST_COLUMN_UPDATED }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: localization.CMS_LIST_COLUMN_ACTIONS })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: items.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsx(
            LinkComponent,
            {
              href: `${basePath}/cms/${typeSlug}/${item.id}`,
              className: "hover:underline",
              children: item.slug
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: formatDate(item.createdAt) }),
          /* @__PURE__ */ jsx(TableCell, { children: formatDate(item.updatedAt) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => navigate(`${basePath}/cms/${typeSlug}/${item.id}`),
                children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => handleDelete(item.id),
                disabled: deleteContent.isPending,
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
              }
            )
          ] }) })
        ] }, item.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: localization.CMS_LIST_PAGINATION_SHOWING.replace("{from}", "1").replace("{to}", String(items.length)).replace("{total}", String(total)) }),
        hasMore && /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => loadMore(),
            disabled: isLoadingMore,
            children: [
              isLoadingMore && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
              localization.CMS_LIST_PAGINATION_NEXT
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  ContentListPage
};
