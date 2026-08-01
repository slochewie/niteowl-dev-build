import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { B as Button, l as usePluginOverrides, D as useBasePath } from "./router-DU5jczZR.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-DwfP37wf.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { Inbox, ChevronRight, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { b as useSuspenseUIBuilderPages, c as useDeleteUIBuilderPage, a as uiBuilderLocalization } from "./index-DQd4hyqM.js";
import { P as PageWrapper } from "./page-list-page-DNPLjHBX.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
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
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "react-dom";
import "./Combination-C2ce2hnQ.js";
import "./index-BI_-Kgeu.js";
import "./index-x6nDyT23.js";
import "@radix-ui/react-dialog";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
import "./default-error-Cs5qeeYK.js";
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
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
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
