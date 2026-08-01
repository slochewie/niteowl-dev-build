import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { l as usePluginOverrides, D as useBasePath, B as Button } from "./router-DU5jczZR.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle } from "./dialog-Chz0Zs_g.js";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { F as FORM_BUILDER_LOCALIZATION, b as useSuspenseFormById, c as useSuspenseSubmissions, d as useDeleteSubmission } from "./index-CRLEFUXL.js";
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
import "@radix-ui/react-dialog";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
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
