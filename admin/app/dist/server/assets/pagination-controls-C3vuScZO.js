import { u as useSuspenseQuery } from "./useSuspenseQuery--TKlWsW-.js";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.js";
import { u as useMutation } from "./useMutation-wDhDrN3q.js";
import { a0 as toError$1, a1 as createCommentsQueryKeys, T as createApiClient, B as Button } from "./router-DU5jczZR.js";
import { useState, useEffect } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
function useResolvedCurrentUserId(raw) {
  const [resolved, setResolved] = useState(
    typeof raw === "string" ? raw : void 0
  );
  useEffect(() => {
    if (typeof raw === "function") {
      void Promise.resolve(raw()).then((id) => setResolved(id ?? void 0)).catch((err) => {
        console.error(
          "[btst/comments] Failed to resolve currentUserId:",
          err
        );
      });
    } else {
      setResolved(raw ?? void 0);
    }
  }, [raw]);
  return resolved;
}
const toError = toError$1;
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}
function getClient(config) {
  return createApiClient({
    baseURL: config.apiBaseURL,
    basePath: config.apiBasePath
  });
}
function useSuspenseComments(config, params) {
  const client = getClient(config);
  const queries = createCommentsQueryKeys(client, config.headers);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...queries.comments.list(params),
    staleTime: 3e4,
    retry: false
  });
  if (error && !isFetching) {
    throw error;
  }
  return {
    comments: data?.items ?? [],
    total: data?.total ?? 0,
    refetch
  };
}
function useSuspenseModerationComments(config, params) {
  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const offset = (page - 1) * limit;
  const client = getClient(config);
  const queries = createCommentsQueryKeys(client, config.headers);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...queries.comments.list({ status: params.status, limit, offset }),
    staleTime: 3e4,
    retry: false
  });
  if (error && !isFetching) {
    throw error;
  }
  const comments = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    comments,
    total,
    limit,
    offset,
    totalPages,
    refetch
  };
}
function useUpdateCommentStatus(config) {
  const queryClient = useQueryClient();
  const client = getClient(config);
  const queries = createCommentsQueryKeys(client, config.headers);
  return useMutation({
    mutationFn: async (input) => {
      const response = await client("@patch/comments/:id/status", {
        method: "PATCH",
        params: { id: input.id },
        body: { status: input.status },
        headers: config.headers
      });
      const data = response.data;
      if (!data) throw toError(response.error);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.list._def
      });
      queryClient.invalidateQueries({
        queryKey: queries.commentCount.byResource._def
      });
      queryClient.invalidateQueries({ queryKey: ["commentsThread"] });
    }
  });
}
function useDeleteComment(config) {
  const queryClient = useQueryClient();
  const client = getClient(config);
  const queries = createCommentsQueryKeys(client, config.headers);
  return useMutation({
    mutationFn: async (id) => {
      const response = await client("@delete/comments/:id", {
        method: "DELETE",
        params: { id },
        headers: config.headers
      });
      const data = response.data;
      if (!data) throw toError(response.error);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.list._def
      });
      queryClient.invalidateQueries({
        queryKey: queries.commentCount.byResource._def
      });
      queryClient.invalidateQueries({ queryKey: ["commentsThread"] });
    }
  });
}
function PaginationControls({
  currentPage,
  totalPages,
  total,
  limit,
  offset,
  onPageChange,
  labels
}) {
  const previous = labels?.previous ?? "Previous";
  const next = labels?.next ?? "Next";
  const showingTemplate = labels?.showing ?? "Showing {from}–{to} of {total}";
  const from = offset + 1;
  const to = Math.min(offset + limit, total);
  const showingText = showingTemplate.replace("{from}", String(from)).replace("{to}", String(to)).replace("{total}", String(total));
  if (totalPages <= 1) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: showingText }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
            previous
          ]
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
        currentPage,
        " / ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
          children: [
            next,
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
          ]
        }
      )
    ] })
  ] });
}
export {
  PaginationControls as P,
  useSuspenseComments as a,
  useDeleteComment as b,
  useSuspenseModerationComments as c,
  useUpdateCommentStatus as d,
  getInitials as g,
  useResolvedCurrentUserId as u
};
