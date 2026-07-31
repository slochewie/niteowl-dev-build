import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-qu_5GP1h.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-EQQ6qBjO.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as FORM_BUILDER_LOCALIZATION, b as useSuspenseForms, c as useDeleteForm } from "./index-Dsk9Dwgo.mjs";
import { P as PageWrapper } from "./page-wrapper-o76PzhEA.mjs";
import { E as EmptyState, P as Pagination } from "./pagination-BkWUm_df.mjs";
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
import { P as Plus, W as Ellipsis, j as Pencil, u as FileText, k as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
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
                /* @__PURE__ */ jsx(Ellipsis, { className: "h-4 w-4" }),
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
