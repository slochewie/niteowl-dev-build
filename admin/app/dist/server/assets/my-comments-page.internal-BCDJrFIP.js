import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqndLpkg.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CEYtu72k.js";
import { B as Button } from "./router-DU5jczZR.js";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-DyL-BTAC.js";
import { LogIn, MessageSquareOff, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { u as useResolvedCurrentUserId, a as useSuspenseComments, b as useDeleteComment, P as PaginationControls, g as getInitials } from "./pagination-controls-C3vuScZO.js";
import { C as COMMENTS_LOCALIZATION } from "./page-wrapper-DCLvTidy.js";
import "./index-S7rpP7KI.js";
import "@radix-ui/react-dialog";
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
import "./index-KZ0RSJRl.js";
import "./index-CpOdxbMb.js";
import "react-dom";
import "./index3-B51lEsWR.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useMutation-wDhDrN3q.js";
const PAGE_LIMIT = 20;
function StatusBadge({
  status,
  loc
}) {
  if (status === "approved") {
    return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-green-700 border-green-300", children: loc.COMMENTS_MY_STATUS_APPROVED });
  }
  if (status === "pending") {
    return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-yellow-700 border-yellow-300", children: loc.COMMENTS_MY_STATUS_PENDING });
  }
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-red-700 border-red-300", children: loc.COMMENTS_MY_STATUS_SPAM });
}
function UserCommentsPage({
  apiBaseURL,
  apiBasePath,
  headers,
  currentUserId: currentUserIdProp,
  resourceLinks,
  localization: localizationProp
}) {
  const loc = { ...COMMENTS_LOCALIZATION, ...localizationProp };
  const resolvedUserId = useResolvedCurrentUserId(currentUserIdProp);
  if (!resolvedUserId) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-20 text-center",
        "data-testid": "my-comments-login-prompt",
        children: [
          /* @__PURE__ */ jsx(LogIn, { className: "h-10 w-10 text-muted-foreground" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: loc.COMMENTS_MY_LOGIN_TITLE }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: loc.COMMENTS_MY_LOGIN_DESCRIPTION })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    UserCommentsList,
    {
      apiBaseURL,
      apiBasePath,
      headers,
      currentUserId: resolvedUserId,
      resourceLinks,
      loc
    }
  );
}
function UserCommentsList({
  apiBaseURL,
  apiBasePath,
  headers,
  currentUserId,
  resourceLinks,
  loc
}) {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const config = { apiBaseURL, apiBasePath, headers };
  const offset = (page - 1) * PAGE_LIMIT;
  const { comments, total, refetch } = useSuspenseComments(config, {
    authorId: currentUserId,
    sort: "desc",
    limit: PAGE_LIMIT,
    offset
  });
  const deleteMutation = useDeleteComment(config);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(loc.COMMENTS_MY_TOAST_DELETED);
      refetch();
    } catch {
      toast.error(loc.COMMENTS_MY_TOAST_DELETE_ERROR);
    } finally {
      setDeleteId(null);
    }
  };
  if (comments.length === 0 && page === 1) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-20 text-center",
        "data-testid": "my-comments-empty",
        children: [
          /* @__PURE__ */ jsx(MessageSquareOff, { className: "h-10 w-10 text-muted-foreground" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: loc.COMMENTS_MY_EMPTY_TITLE }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: loc.COMMENTS_MY_EMPTY_DESCRIPTION })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { "data-testid": "my-comments-page", className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: loc.COMMENTS_MY_PAGE_TITLE }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        total,
        " ",
        loc.COMMENTS_MY_COL_COMMENT.toLowerCase(),
        total !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-lg border overflow-hidden",
        "data-testid": "my-comments-list",
        children: [
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableHead, { className: "w-10" }),
              /* @__PURE__ */ jsx(TableHead, { children: loc.COMMENTS_MY_COL_COMMENT }),
              /* @__PURE__ */ jsx(TableHead, { className: "hidden sm:table-cell w-32", children: loc.COMMENTS_MY_COL_RESOURCE }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-28", children: loc.COMMENTS_MY_COL_STATUS }),
              /* @__PURE__ */ jsx(TableHead, { className: "hidden md:table-cell w-36", children: loc.COMMENTS_MY_COL_DATE }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-16" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: comments.map((comment) => /* @__PURE__ */ jsx(
              CommentRow,
              {
                comment,
                resourceLinks,
                loc,
                onDelete: () => setDeleteId(comment.id),
                isDeleting: deleteMutation.isPending && deleteId === comment.id
              },
              comment.id
            )) })
          ] }),
          /* @__PURE__ */ jsx(
            PaginationControls,
            {
              currentPage: page,
              totalPages,
              total,
              limit: PAGE_LIMIT,
              offset,
              onPageChange: (p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AlertDialog,
      {
        open: !!deleteId,
        onOpenChange: (open) => !open && setDeleteId(null),
        children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: loc.COMMENTS_MY_DELETE_TITLE }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: loc.COMMENTS_MY_DELETE_DESCRIPTION })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: loc.COMMENTS_MY_DELETE_CANCEL }),
            /* @__PURE__ */ jsx(
              AlertDialogAction,
              {
                onClick: handleDelete,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: loc.COMMENTS_MY_DELETE_CONFIRM
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function CommentRow({
  comment,
  resourceLinks,
  loc,
  onDelete,
  isDeleting
}) {
  const resourceUrlBase = resourceLinks?.[comment.resourceType]?.(
    comment.resourceId
  );
  const resourceUrl = resourceUrlBase ? `${resourceUrlBase}#comments` : void 0;
  return /* @__PURE__ */ jsxs(TableRow, { "data-testid": "my-comment-row", children: [
    /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7", children: [
      comment.resolvedAvatarUrl && /* @__PURE__ */ jsx(
        AvatarImage,
        {
          src: comment.resolvedAvatarUrl,
          alt: comment.resolvedAuthorName
        }
      ),
      /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(comment.resolvedAuthorName) })
    ] }) }),
    /* @__PURE__ */ jsxs(TableCell, { className: "max-w-xs", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm line-clamp-2", children: comment.body }),
      comment.parentId && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground mt-0.5 block", children: loc.COMMENTS_MY_REPLY_INDICATOR })
    ] }),
    /* @__PURE__ */ jsx(TableCell, { className: "hidden sm:table-cell", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-muted-foreground capitalize", children: comment.resourceType.replace(/-/g, " ") }),
      resourceUrl ? /* @__PURE__ */ jsxs(
        "a",
        {
          href: resourceUrl,
          className: "text-xs text-primary hover:underline inline-flex items-center gap-1",
          target: "_blank",
          rel: "noopener noreferrer",
          children: [
            loc.COMMENTS_MY_VIEW_LINK,
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
          ]
        }
      ) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground truncate max-w-[100px]", children: comment.resourceId })
    ] }) }),
    /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { status: comment.status, loc }) }),
    /* @__PURE__ */ jsx(TableCell, { className: "hidden md:table-cell text-xs text-muted-foreground", children: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) }),
    /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7 text-muted-foreground hover:text-destructive",
        onClick: onDelete,
        disabled: isDeleting,
        "data-testid": "my-comment-delete-button",
        children: [
          /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: loc.COMMENTS_MY_DELETE_BUTTON_SR })
        ]
      }
    ) })
  ] });
}
export {
  UserCommentsPage
};
