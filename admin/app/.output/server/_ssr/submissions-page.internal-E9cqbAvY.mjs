import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-qu_5GP1h.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle } from "./dialog-B4u5EdHX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as FORM_BUILDER_LOCALIZATION, d as useSuspenseFormById, g as useSuspenseSubmissions, h as useDeleteSubmission } from "./index-Dsk9Dwgo.mjs";
import { P as PageWrapper } from "./page-wrapper-o76PzhEA.mjs";
import { E as EmptyState, P as Pagination } from "./pagination-BkWUm_df.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { A as ArrowLeft, p as Eye, k as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./index-S7rpP7KI.mjs";
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
function SubmissionsPage({ formId }) {
  const { navigate, Link, localization } = usePluginOverrides("form-builder", {
    localization: FORM_BUILDER_LOCALIZATION
  });
  const basePath = useBasePath();
  const { form } = useSuspenseFormById(formId);
  const { submissions, total, hasMore, isLoadingMore, loadMore, refetch } = useSuspenseSubmissions(formId);
  const deleteMutation = useDeleteSubmission(formId);
  const [deleteId, setDeleteId] = useState(null);
  const [viewSubmission, setViewSubmission] = useState(null);
  const loc = localization || FORM_BUILDER_LOCALIZATION;
  const LinkComponent = Link || "a";
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(loc.FORM_BUILDER_TOAST_SUBMISSION_DELETED);
      setDeleteId(null);
      await refetch();
    } catch (error) {
      toast.error(loc.FORM_BUILDER_TOAST_ERROR);
    }
  };
  const formatSubmissionData = (data) => {
    const entries = Object.entries(data).slice(0, 3);
    return entries.map(([key, value]) => {
      const strValue = typeof value === "string" ? value : JSON.stringify(value);
      const truncated = strValue.length > 30 ? `${strValue.slice(0, 30)}...` : strValue;
      return `${key}: ${truncated}`;
    }).join(", ");
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { testId: "submissions-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(LinkComponent, { href: `${basePath}/forms`, children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: form?.name || loc.FORM_BUILDER_SUBMISSIONS_TITLE }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: loc.FORM_BUILDER_SUBMISSIONS_SUBTITLE })
        ] })
      ] }),
      submissions.length === 0 ? /* @__PURE__ */ jsx(
        EmptyState,
        {
          title: loc.FORM_BUILDER_SUBMISSIONS_EMPTY,
          description: loc.FORM_BUILDER_SUBMISSIONS_EMPTY_DESCRIPTION
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { className: "w-24", children: loc.FORM_BUILDER_SUBMISSIONS_COLUMN_ID }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_SUBMISSIONS_COLUMN_DATA }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_SUBMISSIONS_COLUMN_SUBMITTED_AT }),
            /* @__PURE__ */ jsx(TableHead, { children: loc.FORM_BUILDER_SUBMISSIONS_COLUMN_IP_ADDRESS }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-24", children: loc.FORM_BUILDER_SUBMISSIONS_COLUMN_ACTIONS })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: submissions.map((sub) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { className: "font-mono text-xs", children: [
              sub.id.slice(0, 8),
              "..."
            ] }),
            /* @__PURE__ */ jsx(TableCell, { className: "max-w-xs truncate text-sm text-muted-foreground", children: formatSubmissionData(sub.parsedData ?? {}) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: new Date(sub.submittedAt).toLocaleString() }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground font-mono text-xs", children: sub.ipAddress || "-" }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => setViewSubmission(sub),
                  children: [
                    /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "View" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "text-destructive",
                  onClick: () => setDeleteId(sub.id),
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Delete" })
                  ]
                }
              )
            ] }) })
          ] }, sub.id)) })
        ] }) }),
        /* @__PURE__ */ jsx(
          Pagination,
          {
            total,
            showing: submissions.length,
            hasMore,
            isLoadingMore,
            onLoadMore: loadMore
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: !!viewSubmission,
        onOpenChange: () => setViewSubmission(null),
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-auto", children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Submission Details" }) }),
          viewSubmission && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "ID:" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono truncate", children: viewSubmission.id })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Submitted:" }),
                /* @__PURE__ */ jsx("p", { className: "truncate", children: new Date(viewSubmission.submittedAt).toLocaleString() })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "IP Address:" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono truncate", children: viewSubmission.ipAddress || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "User Agent:" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs truncate", children: viewSubmission.userAgent || "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "Data:" }),
              /* @__PURE__ */ jsx("pre", { className: "mt-2 p-4 bg-muted rounded-lg text-sm overflow-auto", children: JSON.stringify(viewSubmission.parsedData, null, 2) })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Submission" }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: loc.FORM_BUILDER_SUBMISSIONS_DELETE_CONFIRM })
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
  SubmissionsPage
};
