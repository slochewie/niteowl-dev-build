import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { l as usePluginOverrides, T as createApiClient, a6 as createBlogQueryKeys, q as cn$1 } from "./router-qu_5GP1h.mjs";
import { u as useQuery } from "./useQuery-bnZbjTSo.mjs";
import { u as useSuspenseQuery } from "./useSuspenseQuery-CxR8OJs1.mjs";
import { u as useSuspenseInfiniteQuery } from "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { u as useMutation } from "./useMutation-C_XiO15s.mjs";
import { u as useInfiniteQuery } from "./useInfiniteQuery-BegVgW11.mjs";
import { useRef, useEffect, useState } from "react";
import { N as NotebookText } from "../_libs/lucide-react.mjs";
function Empty({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty",
      className: cn$1(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      ),
      ...props
    }
  );
}
function EmptyHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-header",
      className: cn$1(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      ),
      ...props
    }
  );
}
const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function EmptyMedia({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-icon",
      "data-variant": variant,
      className: cn$1(emptyMediaVariants({ variant, className })),
      ...props
    }
  );
}
function EmptyTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "empty-title",
      className: cn$1("text-lg font-medium tracking-tight", className),
      ...props
    }
  );
}
function EmptyList({ message }) {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    Empty,
    {
      className: "border border-dashed min-h-[600px] w-full",
      "data-testid": "empty-state",
      children: /* @__PURE__ */ jsxs(EmptyHeader, { children: [
        /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", className: "size-20", children: /* @__PURE__ */ jsx(NotebookText, { className: "text-muted-foreground size-16" }) }),
        /* @__PURE__ */ jsx(EmptyTitle, { "data-testid": "empty-message", children: message })
      ] })
    }
  ) });
}
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
const SHARED_QUERY_CONFIG = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  staleTime: 1e3 * 60 * 5,
  // 5 minutes
  gcTime: 1e3 * 60 * 10
  // 10 minutes
};
function usePosts(options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const {
    tag,
    tagSlug,
    limit = 10,
    enabled = true,
    query,
    published
  } = options;
  const queries = createBlogQueryKeys(client, headers);
  const queryParams = {
    tag,
    tagSlug,
    limit,
    query,
    published
  };
  const basePosts = queries.posts.list(queryParams);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    ...basePosts,
    ...SHARED_QUERY_CONFIG,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const posts2 = lastPage;
      if (posts2.length < limit) return void 0;
      return allPages.length * limit;
    },
    enabled: enabled && !!client
  });
  const posts = data?.pages?.flat() ?? [];
  return {
    posts,
    isLoading,
    error,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useSuspensePosts(options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const {
    tag,
    tagSlug,
    limit = 10,
    enabled = true,
    query,
    published
  } = options;
  const queries = createBlogQueryKeys(client, headers);
  const queryParams = { tag, tagSlug, limit, query, published };
  const basePosts = queries.posts.list(queryParams);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
    isFetching
  } = useSuspenseInfiniteQuery({
    ...basePosts,
    ...SHARED_QUERY_CONFIG,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const posts2 = lastPage;
      if (posts2.length < limit) return void 0;
      return allPages.length * limit;
    }
  });
  if (error && !isFetching) {
    throw error;
  }
  const posts = data.pages?.flat() ?? [];
  return {
    posts,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useSuspensePost(slug) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createBlogQueryKeys(client, headers);
  const basePost = queries.posts.detail(slug);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...basePost,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  return { post: data || null, refetch };
}
function useTags() {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createBlogQueryKeys(client, headers);
  const baseTags = queries.tags.list();
  const { data, isLoading, error, refetch } = useQuery({
    ...baseTags,
    ...SHARED_QUERY_CONFIG,
    enabled: !!client
  });
  return {
    tags: data ?? [],
    isLoading,
    error,
    refetch
  };
}
function useSuspenseTags() {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createBlogQueryKeys(client, headers);
  const baseTags = queries.tags.list();
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...baseTags,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  return {
    tags: data ?? [],
    refetch
  };
}
function useCreatePost() {
  const { refresh, apiBaseURL, apiBasePath } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createBlogQueryKeys(client);
  return useMutation({
    mutationKey: [...queries.posts._def, "create"],
    mutationFn: async (postData) => {
      const response = await client("@post/posts", {
        method: "POST",
        body: postData
      });
      return response.data;
    },
    onSuccess: async (created) => {
      if (created?.slug) {
        queryClient.setQueryData(
          queries.posts.detail(created.slug).queryKey,
          created
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queries.posts.list._def
      });
      await queryClient.invalidateQueries({
        queryKey: queries.drafts.list._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useUpdatePost() {
  const { refresh, apiBaseURL, apiBasePath } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createBlogQueryKeys(client);
  return useMutation({
    mutationKey: [...queries.posts._def, "update"],
    mutationFn: async ({ id, data }) => {
      const response = await client(`@put/posts/:id`, {
        method: "PUT",
        params: { id },
        body: data
      });
      return response.data;
    },
    onSuccess: async (updated) => {
      if (updated?.slug) {
        queryClient.setQueryData(
          queries.posts.detail(updated.slug).queryKey,
          updated
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queries.posts.list._def
      });
      await queryClient.invalidateQueries({
        queryKey: queries.drafts.list._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useDeletePost() {
  const { refresh, apiBaseURL, apiBasePath } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createBlogQueryKeys(client);
  return useMutation({
    mutationKey: [...queries.posts._def, "delete"],
    mutationFn: async ({ id }) => {
      const response = await client(`@delete/posts/:id`, {
        method: "DELETE",
        params: { id }
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.posts._def
      });
      await queryClient.invalidateQueries({
        queryKey: queries.drafts.list._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function usePostSearch({
  query,
  enabled = true,
  debounceMs = 300,
  limit = 10,
  published = true
}) {
  const debouncedQuery = useDebounce(query, debounceMs);
  const shouldSearch = enabled && (query?.trim().length ?? 0) > 0;
  const lastResultsRef = useRef([]);
  const { posts, isLoading, error, refetch } = usePosts({
    query: debouncedQuery,
    limit,
    enabled: shouldSearch && debouncedQuery.trim() !== "",
    published
  });
  const effectivePosts = shouldSearch ? posts : [];
  useEffect(() => {
    if (!isLoading && posts && posts.length >= 0) {
      lastResultsRef.current = posts;
    }
  }, [posts, isLoading]);
  const isDebouncing = enabled && debounceMs > 0 && debouncedQuery !== query;
  const effectiveLoading = isLoading || isDebouncing;
  const dataToReturn = !shouldSearch ? [] : effectiveLoading ? lastResultsRef.current : effectivePosts;
  return {
    posts: dataToReturn,
    // compatibility alias similar to tanstack useQuery
    data: dataToReturn,
    isLoading: effectiveLoading,
    error,
    refetch,
    isSearching: effectiveLoading,
    searchQuery: debouncedQuery
  };
}
function useNextPreviousPosts(createdAt, options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createBlogQueryKeys(client, headers);
  const dateValue = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const baseQuery = queries.posts.nextPrevious(dateValue);
  const { data, isLoading, error, refetch } = useQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG,
    enabled: (options.enabled ?? true) && !!client
  });
  return {
    previousPost: data?.previous ?? null,
    nextPost: data?.next ?? null,
    isLoading,
    error,
    refetch
  };
}
function useRecentPosts(options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("blog");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createBlogQueryKeys(client, headers);
  const baseQuery = queries.posts.recent({
    limit: options.limit ?? 5,
    excludeSlug: options.excludeSlug
  });
  const { data, isLoading, error, refetch } = useQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG,
    enabled: (options.enabled ?? true) && !!client
  });
  return {
    recentPosts: data ?? [],
    isLoading,
    error,
    refetch
  };
}
export {
  EmptyList as E,
  useSuspensePosts as a,
  usePostSearch as b,
  useDebounce as c,
  useCreatePost as d,
  useSuspensePost as e,
  useUpdatePost as f,
  useDeletePost as g,
  useTags as h,
  useNextPreviousPosts as i,
  useRecentPosts as j,
  useSuspenseTags as u
};
