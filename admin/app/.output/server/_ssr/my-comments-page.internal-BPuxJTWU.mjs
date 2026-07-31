import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { A as AlertDialog, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { B as Button } from "./router-qu_5GP1h.mjs";
import { B as Badge } from "./badge-CGoI1f31.mjs";
import { A as Avatar, b as AvatarImage, a as AvatarFallback } from "./avatar-DgTJEQBc.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as useResolvedCurrentUserId, d as useSuspenseComments, b as useDeleteComment, P as PaginationControls, g as getInitials } from "./pagination-controls-BRFj7vBl.mjs";
import { C as COMMENTS_LOCALIZATION } from "./page-wrapper-BF9x77Ov.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./index-CpOdxbMb.mjs";
import "react-dom";
import "./index3-B51lEsWR.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { au as LogIn, av as MessageSquareOff, s as ExternalLink, k as Trash2 } from "../_libs/lucide-react.mjs";
import { H as formatDistanceToNow } from "../_libs/date-fns.mjs";
import "./index-S7rpP7KI.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "./index-KZ0RSJRl.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
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
