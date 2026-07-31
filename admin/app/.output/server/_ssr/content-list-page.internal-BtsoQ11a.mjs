import { jsx, jsxs } from "react/jsx-runtime";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-qu_5GP1h.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { u as useSuspenseContentTypes, a as useSuspenseContent, b as useDeleteContent, E as EmptyState, C as CMS_LOCALIZATION } from "./cms-hooks-qLe16dQu.mjs";
import { P as PageWrapper } from "./page-wrapper-Cg71u63l.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "react";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { A as ArrowLeft, P as Plus, j as Pencil, k as Trash2, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
              isLoadingMore && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
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
