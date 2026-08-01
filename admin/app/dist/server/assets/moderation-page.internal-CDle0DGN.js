import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { D as Dialog, d as DialogContent, a as DialogHeader, b as DialogTitle } from "./dialog-Chz0Zs_g.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { l as usePluginOverrides, B as Button } from "./router-DU5jczZR.js";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-BbzCMZxa.js";
import { C as Checkbox } from "./checkbox-Ct6-tiwE.js";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-DyL-BTAC.js";
import { CheckCircle, Trash2, Eye, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { u as useRegisterPageAIContext } from "./page-ai-context-C_8XrHKf.js";
import { P as PaginationControls, c as useSuspenseModerationComments, d as useUpdateCommentStatus, b as useDeleteComment, g as getInitials } from "./pagination-controls-C3vuScZO.js";
import { C as COMMENTS_LOCALIZATION } from "./page-wrapper-DCLvTidy.js";
import "@radix-ui/react-dialog";
import "./index-S7rpP7KI.js";
import "@radix-ui/react-slot";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
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
import "./index-x6nDyT23.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "react-dom";
import "./index-BI_-Kgeu.js";
import "./index-CshadhlS.js";
import "./index-CpOdxbMb.js";
import "./index3-B51lEsWR.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useMutation-wDhDrN3q.js";
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  limit,
  offset
}) {
  const { localization: customLocalization } = usePluginOverrides("comments");
  const localization = { ...COMMENTS_LOCALIZATION, ...customLocalization };
  return /* @__PURE__ */ jsx(
    PaginationControls,
    {
      currentPage,
      totalPages,
      onPageChange,
      total,
      limit,
      offset,
      labels: {
        previous: localization.COMMENTS_MODERATION_PAGINATION_PREVIOUS,
        next: localization.COMMENTS_MODERATION_PAGINATION_NEXT,
        showing: localization.COMMENTS_MODERATION_PAGINATION_SHOWING
      }
    }
  );
}
function StatusBadge({ status }) {
  const variants = {
    pending: "secondary",
    approved: "default",
    spam: "destructive"
  };
  return /* @__PURE__ */ jsx(Badge, { variant: variants[status], children: status });
}
function ModerationPage({
  apiBaseURL,
  apiBasePath,
  headers,
  localization: localizationProp
}) {
  const loc = { ...COMMENTS_LOCALIZATION, ...localizationProp };
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
  const [viewComment, setViewComment] = useState(
    null
  );
  const [deleteIds, setDeleteIds] = useState([]);
  const config = { apiBaseURL, apiBasePath, headers };
  const { comments, total, limit, offset, totalPages, refetch } = useSuspenseModerationComments(config, {
    status: activeTab,
    page: currentPage
  });
  const updateStatus = useUpdateCommentStatus(config);
  const deleteMutation = useDeleteComment(config);
  useRegisterPageAIContext({
    routeName: "comments-moderation",
    pageDescription: `${total} ${activeTab} comments in the moderation queue.

Top ${activeTab} comments:
${comments.slice(0, 5).map(
      (c) => `- "${c.body.slice(0, 80)}${c.body.length > 80 ? "…" : ""}" by ${c.resolvedAuthorName} on ${c.resourceType}/${c.resourceId}`
    ).join("\n")}`,
    suggestions: [
      "Approve all safe-looking comments",
      "Flag spam comments",
      "Summarize today's discussion"
    ]
  });
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selected.size === comments.length) {
      setSelected(/* @__PURE__ */ new Set());
    } else {
      setSelected(new Set(comments.map((c) => c.id)));
    }
  };
  const handleApprove = async (id) => {
    try {
      await updateStatus.mutateAsync({ id, status: "approved" });
      toast.success(loc.COMMENTS_MODERATION_TOAST_APPROVED);
      await refetch();
    } catch {
      toast.error(loc.COMMENTS_MODERATION_TOAST_APPROVE_ERROR);
    }
  };
  const handleSpam = async (id) => {
    try {
      await updateStatus.mutateAsync({ id, status: "spam" });
      toast.success(loc.COMMENTS_MODERATION_TOAST_SPAM);
      await refetch();
    } catch {
      toast.error(loc.COMMENTS_MODERATION_TOAST_SPAM_ERROR);
    }
  };
  const handleDelete = async (ids) => {
    try {
      await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
      toast.success(
        ids.length === 1 ? loc.COMMENTS_MODERATION_TOAST_DELETED : loc.COMMENTS_MODERATION_TOAST_DELETED_PLURAL.replace(
          "{n}",
          String(ids.length)
        )
      );
      setSelected(/* @__PURE__ */ new Set());
      setDeleteIds([]);
      await refetch();
    } catch {
      toast.error(loc.COMMENTS_MODERATION_TOAST_DELETE_ERROR);
    }
  };
  const handleBulkApprove = async () => {
    const ids = [...selected];
    try {
      await Promise.all(
        ids.map((id) => updateStatus.mutateAsync({ id, status: "approved" }))
      );
      toast.success(
        loc.COMMENTS_MODERATION_TOAST_BULK_APPROVED.replace(
          "{n}",
          String(ids.length)
        )
      );
      setSelected(/* @__PURE__ */ new Set());
      await refetch();
    } catch {
      toast.error(loc.COMMENTS_MODERATION_TOAST_BULK_APPROVE_ERROR);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", "data-testid": "moderation-page", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: loc.COMMENTS_MODERATION_TITLE }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mt-1", children: loc.COMMENTS_MODERATION_DESCRIPTION })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: activeTab,
        onValueChange: (v) => {
          setActiveTab(v);
          setCurrentPage(1);
          setSelected(/* @__PURE__ */ new Set());
        },
        children: /* @__PURE__ */ jsxs(TabsList, { children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "pending", "data-testid": "tab-pending", children: loc.COMMENTS_MODERATION_TAB_PENDING }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "approved", "data-testid": "tab-approved", children: loc.COMMENTS_MODERATION_TAB_APPROVED }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "spam", "data-testid": "tab-spam", children: loc.COMMENTS_MODERATION_TAB_SPAM })
        ] })
      }
    ),
    selected.size > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-muted rounded-lg", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: loc.COMMENTS_MODERATION_SELECTED.replace(
        "{n}",
        String(selected.size)
      ) }),
      activeTab !== "approved" && /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: handleBulkApprove,
          disabled: updateStatus.isPending,
          children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-1" }),
            loc.COMMENTS_MODERATION_APPROVE_SELECTED
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground",
          onClick: () => setDeleteIds([...selected]),
          children: [
            /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
            loc.COMMENTS_MODERATION_DELETE_SELECTED
          ]
        }
      )
    ] }),
    comments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 py-16 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: loc.COMMENTS_MODERATION_EMPTY.replace("{status}", activeTab) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-lg border", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-10", children: /* @__PURE__ */ jsx(
            Checkbox,
            {
              checked: selected.size === comments.length && comments.length > 0,
              onCheckedChange: toggleSelectAll,
              "aria-label": loc.COMMENTS_MODERATION_SELECT_ALL
            }
          ) }),
          /* @__PURE__ */ jsx(TableHead, { children: loc.COMMENTS_MODERATION_COL_AUTHOR }),
          /* @__PURE__ */ jsx(TableHead, { children: loc.COMMENTS_MODERATION_COL_COMMENT }),
          /* @__PURE__ */ jsx(TableHead, { children: loc.COMMENTS_MODERATION_COL_RESOURCE }),
          /* @__PURE__ */ jsx(TableHead, { children: loc.COMMENTS_MODERATION_COL_DATE }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-36", children: loc.COMMENTS_MODERATION_COL_ACTIONS })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: comments.map((comment) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            "data-testid": "moderation-row",
            "data-comment-id": comment.id,
            children: [
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: selected.has(comment.id),
                  onCheckedChange: () => toggleSelect(comment.id),
                  "aria-label": loc.COMMENTS_MODERATION_SELECT_ONE
                }
              ) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7", children: [
                  comment.resolvedAvatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: comment.resolvedAvatarUrl }),
                  /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(comment.resolvedAuthorName) })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium truncate max-w-[100px]", children: comment.resolvedAuthorName })
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-xs truncate", children: comment.body }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                comment.resourceType,
                "/",
                comment.resourceId
              ] }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground whitespace-nowrap", children: formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true
              }) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7",
                    title: loc.COMMENTS_MODERATION_ACTION_VIEW,
                    onClick: () => setViewComment(comment),
                    "data-testid": "view-button",
                    children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                ),
                activeTab !== "approved" && /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-green-600 hover:text-green-700",
                    title: loc.COMMENTS_MODERATION_ACTION_APPROVE,
                    onClick: () => handleApprove(comment.id),
                    disabled: updateStatus.isPending,
                    "data-testid": "approve-button",
                    children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" })
                  }
                ),
                activeTab !== "spam" && /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-orange-500 hover:text-orange-600",
                    title: loc.COMMENTS_MODERATION_ACTION_SPAM,
                    onClick: () => handleSpam(comment.id),
                    disabled: updateStatus.isPending,
                    "data-testid": "spam-button",
                    children: /* @__PURE__ */ jsx(ShieldOff, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-destructive hover:text-destructive",
                    title: loc.COMMENTS_MODERATION_ACTION_DELETE,
                    onClick: () => setDeleteIds([comment.id]),
                    "data-testid": "delete-button",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] }) })
            ]
          },
          comment.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsx(
        Pagination,
        {
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          total,
          limit,
          offset
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!viewComment, onOpenChange: () => setViewComment(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: loc.COMMENTS_MODERATION_DIALOG_TITLE }) }),
      viewComment && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-10 w-10", children: [
            viewComment.resolvedAvatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: viewComment.resolvedAvatarUrl }),
            /* @__PURE__ */ jsx(AvatarFallback, { children: getInitials(viewComment.resolvedAuthorName) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-sm", children: viewComment.resolvedAuthorName }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(viewComment.createdAt).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsx(StatusBadge, { status: viewComment.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: loc.COMMENTS_MODERATION_DIALOG_RESOURCE }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-xs", children: [
              viewComment.resourceType,
              "/",
              viewComment.resourceId
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: loc.COMMENTS_MODERATION_DIALOG_LIKES }),
            /* @__PURE__ */ jsx("p", { children: viewComment.likes })
          ] }),
          viewComment.parentId && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: loc.COMMENTS_MODERATION_DIALOG_REPLY_TO }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xs", children: viewComment.parentId })
          ] }),
          viewComment.editedAt && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: loc.COMMENTS_MODERATION_DIALOG_EDITED }),
            /* @__PURE__ */ jsx("p", { className: "text-xs", children: new Date(viewComment.editedAt).toLocaleString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs mb-1", children: loc.COMMENTS_MODERATION_DIALOG_BODY }),
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words", children: viewComment.body })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          viewComment.status !== "approved" && /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              onClick: async () => {
                await handleApprove(viewComment.id);
                setViewComment(null);
              },
              disabled: updateStatus.isPending,
              "data-testid": "dialog-approve-button",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-1" }),
                loc.COMMENTS_MODERATION_DIALOG_APPROVE
              ]
            }
          ),
          viewComment.status !== "spam" && /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: async () => {
                await handleSpam(viewComment.id);
                setViewComment(null);
              },
              disabled: updateStatus.isPending,
              children: [
                /* @__PURE__ */ jsx(ShieldOff, { className: "h-4 w-4 mr-1" }),
                loc.COMMENTS_MODERATION_DIALOG_MARK_SPAM
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => {
                setDeleteIds([viewComment.id]);
                setViewComment(null);
              },
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
                loc.COMMENTS_MODERATION_DIALOG_DELETE
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      AlertDialog,
      {
        open: deleteIds.length > 0,
        onOpenChange: (open) => !open && setDeleteIds([]),
        children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: deleteIds.length === 1 ? loc.COMMENTS_MODERATION_DELETE_TITLE_SINGULAR : loc.COMMENTS_MODERATION_DELETE_TITLE_PLURAL.replace(
              "{n}",
              String(deleteIds.length)
            ) }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: deleteIds.length === 1 ? loc.COMMENTS_MODERATION_DELETE_DESCRIPTION_SINGULAR : loc.COMMENTS_MODERATION_DELETE_DESCRIPTION_PLURAL })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: loc.COMMENTS_MODERATION_DELETE_CANCEL }),
            /* @__PURE__ */ jsx(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                onClick: () => handleDelete(deleteIds),
                "data-testid": "confirm-delete-button",
                children: deleteMutation.isPending ? loc.COMMENTS_MODERATION_DELETE_DELETING : loc.COMMENTS_MODERATION_DELETE_CONFIRM
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  ModerationPage
};
