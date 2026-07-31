import { jsxs, jsx } from "react/jsx-runtime";
import { u as useQuery } from "./useQuery-bnZbjTSo.mjs";
import { u as useSuspenseQuery } from "./useSuspenseQuery-CxR8OJs1.mjs";
import { u as useSuspenseInfiniteQuery } from "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { u as useMutation } from "./useMutation-C_XiO15s.mjs";
import { u as useInfiniteQuery } from "./useInfiniteQuery-BegVgW11.mjs";
import { l as usePluginOverrides, T as createApiClient, V as createCMSQueryKeys } from "./router-qu_5GP1h.mjs";
import { V as Inbox } from "../_libs/lucide-react.mjs";
function EmptyState({ title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-muted p-4 mb-4", children: /* @__PURE__ */ jsx(Inbox, { className: "h-8 w-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: description }),
    action
  ] });
}
const CMS_COMMON = {
  // Buttons
  CMS_BUTTON_SAVE: "Save",
  CMS_BUTTON_CANCEL: "Cancel",
  CMS_BUTTON_DELETE: "Delete",
  CMS_BUTTON_CREATE: "Create",
  CMS_BUTTON_BACK: "Back",
  CMS_BUTTON_NEW_ITEM: "New Item",
  // Labels
  CMS_LABEL_SLUG: "Slug",
  CMS_LABEL_SLUG_DESCRIPTION: "URL-friendly identifier for this item",
  CMS_LABEL_CREATED_AT: "Created",
  CMS_LABEL_UPDATED_AT: "Last Updated",
  CMS_LABEL_ACTIONS: "Actions",
  // Status
  CMS_STATUS_LOADING: "Loading...",
  CMS_STATUS_SAVING: "Saving...",
  CMS_STATUS_DELETING: "Deleting...",
  // Errors
  CMS_ERROR_GENERIC: "Something went wrong",
  CMS_ERROR_NOT_FOUND: "Not found",
  CMS_ERROR_VALIDATION: "Please fix the errors above",
  // Attribution
  CMS_ATTRIBUTION: "Powered by BTST"
};
const CMS_TOASTS = {
  CMS_TOAST_CREATE_SUCCESS: "Item created successfully",
  CMS_TOAST_UPDATE_SUCCESS: "Item updated successfully",
  CMS_TOAST_DELETE_SUCCESS: "Item deleted successfully",
  CMS_TOAST_ERROR: "An error occurred. Please try again.",
  CMS_TOAST_VALIDATION_ERROR: "Please fix the validation errors",
  CMS_TOAST_DUPLICATE_SLUG: "An item with this slug already exists"
};
const CMS_DASHBOARD = {
  CMS_DASHBOARD_TITLE: "Content",
  CMS_DASHBOARD_SUBTITLE: "Manage your content types",
  CMS_DASHBOARD_NO_TYPES: "No content types configured",
  CMS_DASHBOARD_NO_TYPES_DESCRIPTION: "Add content types to your CMS configuration to get started.",
  CMS_DASHBOARD_ITEMS_COUNT: "{count} items",
  CMS_DASHBOARD_ITEMS_COUNT_ZERO: "No items",
  CMS_DASHBOARD_ITEMS_COUNT_ONE: "1 item"
};
const CMS_LIST = {
  CMS_LIST_TITLE: "{typeName}",
  CMS_LIST_EMPTY: "No items yet",
  CMS_LIST_EMPTY_DESCRIPTION: "Create your first item to get started.",
  CMS_LIST_COLUMN_SLUG: "Slug",
  CMS_LIST_COLUMN_CREATED: "Created",
  CMS_LIST_COLUMN_UPDATED: "Updated",
  CMS_LIST_COLUMN_ACTIONS: "Actions",
  CMS_LIST_ACTION_EDIT: "Edit",
  CMS_LIST_ACTION_DELETE: "Delete",
  CMS_LIST_PAGINATION_SHOWING: "Showing {from}-{to} of {total}",
  CMS_LIST_PAGINATION_PREVIOUS: "Previous",
  CMS_LIST_PAGINATION_NEXT: "Next"
};
const CMS_EDITOR = {
  CMS_EDITOR_TITLE_NEW: "New {typeName}",
  CMS_EDITOR_TITLE_EDIT: "Edit {typeName}",
  CMS_EDITOR_SLUG_AUTO: "Auto-generated from first field",
  CMS_EDITOR_SLUG_MANUAL: "Manually set",
  CMS_EDITOR_DELETE_CONFIRM: "Are you sure you want to delete this item?",
  CMS_EDITOR_UNSAVED_CHANGES: "You have unsaved changes"
};
const CMS_LOCALIZATION = {
  ...CMS_COMMON,
  ...CMS_TOASTS,
  ...CMS_DASHBOARD,
  ...CMS_LIST,
  ...CMS_EDITOR
};
function isErrorResponse(response) {
  if (typeof response !== "object" || response === null) {
    return false;
  }
  const obj = response;
  return "error" in obj && obj.error !== null && obj.error !== void 0;
}
function toError(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || (typeof errorObj.error === "string" ? errorObj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
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
function useSuspenseContentTypes() {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const baseQuery = queries.cmsTypes.list();
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  return {
    contentTypes: data ?? [],
    refetch
  };
}
function useContent(typeSlug, options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const { limit = 10, enabled = true } = options;
  const baseQuery = queries.cmsContent.list({ typeSlug, limit, offset: 0 });
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: baseQuery.queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await client("/content/:typeSlug", {
        method: "GET",
        params: { typeSlug },
        query: { limit, offset: pageParam },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    ...SHARED_QUERY_CONFIG,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || typeof lastPage !== "object") return void 0;
      const items2 = lastPage?.items;
      if (!Array.isArray(items2) || items2.length < limit) return void 0;
      const loadedCount = (allPages || []).reduce(
        (sum, page) => sum + (Array.isArray(page?.items) ? page.items.length : 0),
        0
      );
      const total2 = lastPage?.total ?? 0;
      if (loadedCount >= total2) return void 0;
      return loadedCount;
    },
    enabled: enabled && !!typeSlug
  });
  const pages = data?.pages;
  const items = pages?.flatMap(
    (page) => Array.isArray(page?.items) ? page.items : []
  ) ?? [];
  const total = pages?.[0]?.total ?? 0;
  return {
    items,
    total,
    isLoading,
    error,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useSuspenseContent(typeSlug, options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const { limit = 10 } = options;
  const baseQuery = queries.cmsContent.list({ typeSlug, limit, offset: 0 });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
    isFetching
  } = useSuspenseInfiniteQuery({
    queryKey: baseQuery.queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await client("/content/:typeSlug", {
        method: "GET",
        params: { typeSlug },
        query: { limit, offset: pageParam },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    ...SHARED_QUERY_CONFIG,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || typeof lastPage !== "object") return void 0;
      const items2 = lastPage?.items;
      if (!Array.isArray(items2) || items2.length < limit) return void 0;
      const loadedCount = (allPages || []).reduce(
        (sum, page) => sum + (Array.isArray(page?.items) ? page.items.length : 0),
        0
      );
      const total2 = lastPage?.total ?? 0;
      if (loadedCount >= total2) return void 0;
      return loadedCount;
    }
  });
  if (error && !isFetching) {
    throw error;
  }
  const pages = data.pages;
  const items = pages?.flatMap(
    (page) => Array.isArray(page?.items) ? page.items : []
  ) ?? [];
  const total = pages?.[0]?.total ?? 0;
  return {
    items,
    total,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useContentItem(typeSlug, id) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const baseQuery = queries.cmsContent.detail(typeSlug, id);
  const { data, isLoading, error, refetch } = useQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG,
    enabled: !!typeSlug && !!id
  });
  return {
    item: data ?? null,
    isLoading,
    error,
    refetch
  };
}
function useCreateContent(typeSlug) {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "create"],
    mutationFn: async (data) => {
      const response = await client("@post/content/:typeSlug", {
        method: "POST",
        params: { typeSlug },
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.cmsContent.list._def,
        refetchType: "all"
      });
      await queryClient.invalidateQueries({
        queryKey: queries.cmsTypes.list._def,
        refetchType: "all"
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useUpdateContent(typeSlug) {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "update"],
    mutationFn: async ({ id, data }) => {
      const response = await client("@put/content/:typeSlug/:id", {
        method: "PUT",
        params: { typeSlug, id },
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    onSuccess: async (updated) => {
      if (updated) {
        queryClient.setQueryData(
          queries.cmsContent.detail(typeSlug, updated.id).queryKey,
          updated
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queries.cmsContent.list._def,
        refetchType: "all"
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useDeleteContent(typeSlug) {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("cms");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "delete"],
    mutationFn: async (id) => {
      const response = await client("@delete/content/:typeSlug/:id", {
        method: "DELETE",
        params: { typeSlug, id },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.cmsContent._def
      });
      await queryClient.invalidateQueries({
        queryKey: queries.cmsTypes.list._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
export {
  CMS_LOCALIZATION as C,
  EmptyState as E,
  useSuspenseContent as a,
  useDeleteContent as b,
  useContentItem as c,
  useCreateContent as d,
  useUpdateContent as e,
  useContent as f,
  useSuspenseContentTypes as u
};
