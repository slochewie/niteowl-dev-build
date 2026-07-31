import { u as useSuspenseQuery } from "./useSuspenseQuery-CxR8OJs1.mjs";
import { u as useSuspenseInfiniteQuery } from "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { u as useMutation } from "./useMutation-C_XiO15s.mjs";
import { l as usePluginOverrides, T as createApiClient, V as createCMSQueryKeys, U as UI_BUILDER_TYPE_SLUG } from "./router-qu_5GP1h.mjs";
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
function toUIBuilderPage(item) {
  return {
    id: item.id,
    contentTypeId: item.contentTypeId,
    slug: item.slug,
    data: item.data,
    authorId: item.authorId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    parsedData: item.parsedData
  };
}
function parseLayers(layersJson) {
  try {
    return JSON.parse(layersJson);
  } catch {
    return [];
  }
}
function parseVariables(variablesJson) {
  try {
    return JSON.parse(variablesJson);
  } catch {
    return [];
  }
}
function useSuspenseUIBuilderPages(options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const { limit = 10 } = options;
  const typeSlug = UI_BUILDER_TYPE_SLUG;
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
    queryKey: [...baseQuery.queryKey, "ui-builder"],
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
  const pagesData = data.pages;
  const items = pagesData?.flatMap(
    (page) => Array.isArray(page?.items) ? page.items : []
  ) ?? [];
  const total = pagesData?.[0]?.total ?? 0;
  return {
    pages: items.map(toUIBuilderPage),
    total,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useSuspenseUIBuilderPage(id) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const typeSlug = UI_BUILDER_TYPE_SLUG;
  const baseQuery = queries.cmsContent.detail(typeSlug, id);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  return {
    page: data ? toUIBuilderPage(
      data
    ) : null,
    refetch
  };
}
function useSuspenseUIBuilderPageBySlug(slug) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createCMSQueryKeys(client, headers);
  const typeSlug = UI_BUILDER_TYPE_SLUG;
  const baseQuery = queries.cmsContent.bySlug(typeSlug, slug);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  const page = data ? toUIBuilderPage(
    data
  ) : null;
  return {
    page,
    layers: page ? parseLayers(page.parsedData.layers) : [],
    variables: page ? parseVariables(page.parsedData.variables) : [],
    refetch
  };
}
function useCreateUIBuilderPage() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  const typeSlug = UI_BUILDER_TYPE_SLUG;
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "create", "ui-builder"],
    mutationFn: async (input) => {
      const data = {
        layers: JSON.stringify(input.layers),
        variables: JSON.stringify(input.variables ?? []),
        status: input.status ?? "draft"
      };
      const response = await client("@post/content/:typeSlug", {
        method: "POST",
        params: { typeSlug },
        body: { slug: input.slug, data },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return toUIBuilderPage(
        response.data
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.cmsContent.list._def
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
function useUpdateUIBuilderPage() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  const typeSlug = UI_BUILDER_TYPE_SLUG;
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "update", "ui-builder"],
    mutationFn: async ({ id, data: input }) => {
      const data = {};
      if (input.layers !== void 0) {
        data.layers = JSON.stringify(input.layers);
      }
      if (input.variables !== void 0) {
        data.variables = JSON.stringify(input.variables);
      }
      if (input.status !== void 0) {
        data.status = input.status;
      }
      const body = {};
      if (input.slug !== void 0) {
        body.slug = input.slug;
      }
      if (Object.keys(data).length > 0) {
        body.data = data;
      }
      const response = await client("@put/content/:typeSlug/:id", {
        method: "PUT",
        params: { typeSlug, id },
        body,
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return toUIBuilderPage(
        response.data
      );
    },
    onSuccess: async (updated) => {
      if (updated) {
        queryClient.setQueryData(
          queries.cmsContent.detail(typeSlug, updated.id).queryKey,
          updated
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queries.cmsContent.list._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useDeleteUIBuilderPage() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("ui-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createCMSQueryKeys(client, headers);
  const typeSlug = UI_BUILDER_TYPE_SLUG;
  return useMutation({
    mutationKey: [...queries.cmsContent._def, typeSlug, "delete", "ui-builder"],
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
const uiBuilderLocalization = {
  pageList: {
    title: "UI Builder Pages",
    description: "Create and manage visual pages with the drag-and-drop builder",
    createButton: "Create Page",
    emptyState: {
      title: "No pages yet",
      description: "Create your first page with the visual builder"
    },
    columns: {
      name: "Name",
      slug: "Slug",
      status: "Status",
      updatedAt: "Updated",
      actions: "Actions"
    },
    actions: {
      edit: "Edit",
      delete: "Delete"
    },
    deleteDialog: {
      title: "Delete Page",
      description: "Are you sure you want to delete this page? This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete"
    }
  },
  pageBuilder: {
    newPage: "New Page",
    editPage: "Edit Page",
    backToList: "Back to Pages",
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    saveError: "Failed to save",
    slugLabel: "Page Slug",
    slugPlaceholder: "my-page-slug",
    slugDescription: "URL-friendly identifier for this page",
    statusLabel: "Status",
    statusOptions: {
      draft: "Draft",
      published: "Published",
      archived: "Archived"
    },
    validation: {
      slugRequired: "Slug is required",
      slugFormat: "Slug must contain only lowercase letters, numbers, and hyphens",
      layersRequired: "Page must have at least one component"
    }
  },
  pageRenderer: {
    loading: "Loading page...",
    notFound: "Page not found",
    error: "Failed to load page"
  }
};
export {
  uiBuilderLocalization as a,
  useSuspenseUIBuilderPages as b,
  useDeleteUIBuilderPage as c,
  useSuspenseUIBuilderPage as d,
  useCreateUIBuilderPage as e,
  useUpdateUIBuilderPage as f,
  useSuspenseUIBuilderPageBySlug as u
};
