import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-qu_5GP1h.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-EQQ6qBjO.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as useSuspenseUIBuilderPages, c as useDeleteUIBuilderPage, a as uiBuilderLocalization } from "./index-C9QBiYz9.mjs";
import { P as PageWrapper } from "./page-list-page-BHwJ4tDM.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./index-BUGN0YTJ.mjs";
import "react-dom";
import "./Combination-C2ce2hnQ.mjs";
import "./index-BI_-Kgeu.mjs";
import "./index-x6nDyT23.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { P as Plus, W as Ellipsis, j as Pencil, k as Trash2, V as Inbox, d as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "./index-S7rpP7KI.mjs";
import "./index-rdulpQ7P.mjs";
import "./index-KZ0RSJRl.mjs";
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
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "./default-error-4AzAiTkr.mjs";
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
function EmptyState({ title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-muted p-4 mb-4", children: /* @__PURE__ */ jsx(Inbox, { className: "h-8 w-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: description }),
    action
  ] });
}
function Pagination({
  total,
  showing,
  hasMore,
  isLoadingMore,
  onLoadMore,
  labels = {}
}) {
  const {
    showing: showingLabel = "Showing {count} of {total}",
    next = "Load More"
  } = labels;
  const showingText = showingLabel.replace("{count}", String(showing)).replace("{total}", String(total));
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: showingText }),
    hasMore && /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onLoadMore,
        disabled: isLoadingMore,
        children: [
          isLoadingMore ? "Loading..." : next,
          /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4" })
        ]
      }
    )
  ] });
}
function PageListPage() {
  const { navigate, Link } = usePluginOverrides("ui-builder");
  const basePath = useBasePath();
  const { pages, total, hasMore, isLoadingMore, loadMore, refetch } = useSuspenseUIBuilderPages();
  const deleteMutation = useDeleteUIBuilderPage();
  const [deleteId, setDeleteId] = useState(null);
  const loc = uiBuilderLocalization;
  const LinkComponent = Link || "a";
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Page deleted successfully");
      setDeleteId(null);
      await refetch();
    } catch {
      toast.error("Failed to delete page");
    }
  };
  const getStatusBadge = (status) => {
    const colors = {
      published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.draft}`,
        children: loc.pageBuilder.statusOptions[status] || status
      }
    );
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { testId: "page-list-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: loc.pageList.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: loc.pageList.description })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(LinkComponent, { href: `${basePath}/ui-builder/new`, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          loc.pageList.createButton
        ] }) })
      ] }),
      pages.length === 0 ? /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: loc.pageList.emptyState.title,
          description: loc.pageList.emptyState.description,
          action: /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(LinkComponent, { href: `${basePath}/ui-builder/new`, children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            loc.pageList.createButton
          ] }) })
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: loc.pageList.columns.slug }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.pageList.columns.status }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.pageList.columns.updatedAt }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: loc.pageList.columns.actions })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: pages.map((page) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-sm", children: page.slug }),
            /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(page.parsedData.status) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: new Date(page.updatedAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", children: [
                /* @__PURE__ */ jsx(Ellipsis, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    onClick: () => navigate?.(
                      `${basePath}/ui-builder/${page.id}/edit`
                    ),
                    children: [
                      /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                      loc.pageList.actions.edit
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "text-destructive",
                    onClick: () => setDeleteId(page.id),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                      loc.pageList.actions.delete
                    ]
                  }
                )
              ] })
            ] }) })
          ] }, page.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(
          Pagination,
          {
            total,
            showing: pages.length,
            hasMore,
            isLoadingMore,
            onLoadMore: loadMore
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: loc.pageList.deleteDialog.title }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: loc.pageList.deleteDialog.description })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: loc.pageList.deleteDialog.cancel }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: deleteMutation.isPending ? "Deleting..." : loc.pageList.deleteDialog.confirm
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  PageListPage
};
