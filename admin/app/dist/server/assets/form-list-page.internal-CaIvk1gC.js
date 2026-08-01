import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-DU5jczZR.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-DwfP37wf.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { Plus, MoreHorizontal, Pencil, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { F as FORM_BUILDER_LOCALIZATION, u as useSuspenseForms, a as useDeleteForm } from "./index-CRLEFUXL.js";
import { P as PageWrapper } from "./page-wrapper-CpCNJw6l.js";
import { E as EmptyState, P as Pagination } from "./pagination-DIsG38a8.js";
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
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
function FormListPage() {
  const { navigate, Link, localization } = usePluginOverrides("form-builder", {
    localization: FORM_BUILDER_LOCALIZATION
  });
  const basePath = useBasePath();
  const { forms, total, hasMore, isLoadingMore, loadMore, refetch } = useSuspenseForms();
  const deleteMutation = useDeleteForm();
  const [deleteId, setDeleteId] = useState(null);
  const loc = localization || FORM_BUILDER_LOCALIZATION;
  const LinkComponent = Link || "a";
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(loc.FORM_BUILDER_TOAST_DELETE_SUCCESS);
      setDeleteId(null);
      await refetch();
    } catch (error) {
      toast.error(loc.FORM_BUILDER_TOAST_ERROR);
    }
  };
  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.inactive}`,
        children: status
      }
    );
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { testId: "form-list-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: loc.FORM_BUILDER_LIST_TITLE }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: loc.FORM_BUILDER_LIST_SUBTITLE })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(LinkComponent, { href: `${basePath}/forms/new`, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          loc.FORM_BUILDER_BUTTON_NEW_FORM
        ] }) })
      ] }),
      forms.length === 0 ? /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: loc.FORM_BUILDER_LIST_EMPTY,
          description: loc.FORM_BUILDER_LIST_EMPTY_DESCRIPTION,
          action: /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(LinkComponent, { href: `${basePath}/forms/new`, children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            loc.FORM_BUILDER_BUTTON_NEW_FORM
          ] }) })
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_LIST_COLUMN_NAME }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_LIST_COLUMN_SLUG }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_LIST_COLUMN_STATUS }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_LIST_COLUMN_CREATED }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-12", children: loc.FORM_BUILDER_LIST_COLUMN_ACTIONS })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: forms.map((form) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: form.name }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground font-mono text-sm", children: form.slug }),
            /* @__PURE__ */ jsx(TableCell, { children: getStatusBadge(form.status) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: new Date(form.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", children: [
                /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    onClick: () => navigate?.(`${basePath}/forms/${form.id}/edit`),
                    children: [
                      /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
                      loc.FORM_BUILDER_LIST_ACTION_EDIT
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    onClick: () => navigate?.(
                      `${basePath}/forms/${form.id}/submissions`
                    ),
                    children: [
                      /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
                      loc.FORM_BUILDER_LIST_ACTION_SUBMISSIONS
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "text-destructive",
                    onClick: () => setDeleteId(form.id),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                      loc.FORM_BUILDER_LIST_ACTION_DELETE
                    ]
                  }
                )
              ] })
            ] }) })
          ] }, form.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(
          Pagination,
          {
            total,
            showing: forms.length,
            hasMore,
            isLoadingMore,
            onLoadMore: loadMore
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Form" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: loc.FORM_BUILDER_EDITOR_DELETE_CONFIRM })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: loc.FORM_BUILDER_BUTTON_CANCEL }),
        /* @__PURE__ */ jsx(
          AlertDialogAction,
          {
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: deleteMutation.isPending ? loc.FORM_BUILDER_STATUS_DELETING : loc.FORM_BUILDER_BUTTON_DELETE
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  FormListPage
};
