import { u as useQuery } from "./useQuery-bnZbjTSo.mjs";
import { u as useSuspenseQuery } from "./useSuspenseQuery-CxR8OJs1.mjs";
import { u as useSuspenseInfiniteQuery } from "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.mjs";
import { u as useMutation } from "./useMutation-C_XiO15s.mjs";
import { l as usePluginOverrides, T as createApiClient, ak as createFormBuilderQueryKeys } from "./router-qu_5GP1h.mjs";
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
function useSuspenseForms(options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createFormBuilderQueryKeys(client, headers);
  const { status, limit = 20 } = options;
  const baseQuery = queries.forms.list({ status, limit, offset: 0 });
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
      const response = await client("/forms", {
        method: "GET",
        query: { status, limit, offset: pageParam },
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
      const items = lastPage?.items;
      if (!Array.isArray(items) || items.length < limit) return void 0;
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
  const forms = pages?.flatMap(
    (page) => Array.isArray(page?.items) ? page.items : []
  ) ?? [];
  const total = pages?.[0]?.total ?? 0;
  return {
    forms,
    total,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useSuspenseFormById(id) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createFormBuilderQueryKeys(client, headers);
  const baseQuery = queries.forms.byId(id);
  const { data, refetch, error, isFetching } = useSuspenseQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG
  });
  if (error && !isFetching) {
    throw error;
  }
  return {
    form: data ?? null,
    refetch
  };
}
function useFormBySlug(slug) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createFormBuilderQueryKeys(client, headers);
  const baseQuery = queries.forms.bySlug(slug);
  const { data, isLoading, error, refetch } = useQuery({
    ...baseQuery,
    ...SHARED_QUERY_CONFIG,
    enabled: !!slug
  });
  return {
    form: data ?? null,
    isLoading,
    error,
    refetch
  };
}
function useCreateForm() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createFormBuilderQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.forms._def, "create"],
    mutationFn: async (data) => {
      const response = await client("@post/forms", {
        method: "POST",
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
        queryKey: queries.forms._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useUpdateForm() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createFormBuilderQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.forms._def, "update"],
    mutationFn: async ({ id, data }) => {
      const response = await client("@put/forms/:id", {
        method: "PUT",
        params: { id },
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
          queries.forms.byId(updated.id).queryKey,
          updated
        );
        queryClient.setQueryData(
          queries.forms.bySlug(updated.slug).queryKey,
          updated
        );
      }
      await queryClient.invalidateQueries({
        queryKey: queries.forms._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useDeleteForm() {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createFormBuilderQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.forms._def, "delete"],
    mutationFn: async (id) => {
      const response = await client("@delete/forms/:id", {
        method: "DELETE",
        params: { id },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.forms._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
function useSubmitForm(slug) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createFormBuilderQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.forms._def, slug, "submit"],
    mutationFn: async ({ data }) => {
      const response = await client("@post/forms/:slug/submit", {
        method: "POST",
        params: { slug },
        body: { data },
        headers
      });
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    }
  });
}
function useSuspenseSubmissions(formId, options = {}) {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queries = createFormBuilderQueryKeys(client, headers);
  const { limit = 20 } = options;
  const baseQuery = queries.formSubmissions.list({
    formId,
    limit,
    offset: 0
  });
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
      const response = await client("/forms/:formId/submissions", {
        method: "GET",
        params: { formId },
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
      const items = lastPage?.items;
      if (!Array.isArray(items) || items.length < limit) return void 0;
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
  const submissions = pages?.flatMap(
    (page) => Array.isArray(page?.items) ? page.items : []
  ) ?? [];
  const total = pages?.[0]?.total ?? 0;
  return {
    submissions,
    total,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoadingMore: isFetchingNextPage,
    refetch
  };
}
function useDeleteSubmission(formId) {
  const { refresh, apiBaseURL, apiBasePath, headers } = usePluginOverrides("form-builder");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  const queryClient = useQueryClient();
  const queries = createFormBuilderQueryKeys(client, headers);
  return useMutation({
    mutationKey: [...queries.formSubmissions._def, formId, "delete"],
    mutationFn: async (subId) => {
      const response = await client(
        "@delete/forms/:formId/submissions/:subId",
        {
          method: "DELETE",
          params: { formId, subId },
          headers
        }
      );
      if (isErrorResponse(response)) {
        throw toError(response.error);
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queries.formSubmissions._def
      });
      if (refresh) {
        await refresh();
      }
    }
  });
}
const FORM_BUILDER_COMMON = {
  // Buttons
  FORM_BUILDER_BUTTON_SAVE: "Save",
  FORM_BUILDER_BUTTON_CANCEL: "Cancel",
  FORM_BUILDER_BUTTON_DELETE: "Delete",
  FORM_BUILDER_BUTTON_CREATE: "Create",
  FORM_BUILDER_BUTTON_BACK: "Back",
  FORM_BUILDER_BUTTON_NEW_FORM: "New Form",
  FORM_BUILDER_BUTTON_SUBMIT: "Submit",
  // Labels
  FORM_BUILDER_LABEL_NAME: "Name",
  FORM_BUILDER_LABEL_SLUG: "Slug",
  FORM_BUILDER_LABEL_SLUG_DESCRIPTION: "URL-friendly identifier for this form",
  FORM_BUILDER_LABEL_DESCRIPTION: "Description",
  FORM_BUILDER_LABEL_STATUS: "Status",
  FORM_BUILDER_LABEL_CREATED_AT: "Created",
  FORM_BUILDER_LABEL_UPDATED_AT: "Last Updated",
  FORM_BUILDER_LABEL_ACTIONS: "Actions",
  // Status
  FORM_BUILDER_STATUS_LOADING: "Loading...",
  FORM_BUILDER_STATUS_SAVING: "Saving...",
  FORM_BUILDER_STATUS_DELETING: "Deleting...",
  FORM_BUILDER_STATUS_ACTIVE: "Active",
  FORM_BUILDER_STATUS_INACTIVE: "Inactive",
  FORM_BUILDER_STATUS_ARCHIVED: "Archived",
  // Errors
  FORM_BUILDER_ERROR_GENERIC: "Something went wrong",
  FORM_BUILDER_ERROR_NOT_FOUND: "Not found",
  FORM_BUILDER_ERROR_VALIDATION: "Please fix the errors above",
  // Attribution
  FORM_BUILDER_ATTRIBUTION: "Powered by BTST"
};
const FORM_BUILDER_TOASTS = {
  FORM_BUILDER_TOAST_CREATE_SUCCESS: "Form created successfully",
  FORM_BUILDER_TOAST_UPDATE_SUCCESS: "Form updated successfully",
  FORM_BUILDER_TOAST_DELETE_SUCCESS: "Form deleted successfully",
  FORM_BUILDER_TOAST_SUBMIT_SUCCESS: "Form submitted successfully",
  FORM_BUILDER_TOAST_ERROR: "An error occurred. Please try again.",
  FORM_BUILDER_TOAST_VALIDATION_ERROR: "Please fix the validation errors",
  FORM_BUILDER_TOAST_DUPLICATE_SLUG: "A form with this slug already exists",
  FORM_BUILDER_TOAST_SUBMISSION_DELETED: "Submission deleted successfully"
};
const FORM_BUILDER_LIST = {
  FORM_BUILDER_LIST_TITLE: "Forms",
  FORM_BUILDER_LIST_SUBTITLE: "Manage your forms",
  FORM_BUILDER_LIST_EMPTY: "No forms yet",
  FORM_BUILDER_LIST_EMPTY_DESCRIPTION: "Create your first form to get started.",
  FORM_BUILDER_LIST_COLUMN_NAME: "Name",
  FORM_BUILDER_LIST_COLUMN_SLUG: "Slug",
  FORM_BUILDER_LIST_COLUMN_STATUS: "Status",
  FORM_BUILDER_LIST_COLUMN_CREATED: "Created",
  FORM_BUILDER_LIST_COLUMN_ACTIONS: "Actions",
  FORM_BUILDER_LIST_ACTION_EDIT: "Edit",
  FORM_BUILDER_LIST_ACTION_DELETE: "Delete",
  FORM_BUILDER_LIST_ACTION_SUBMISSIONS: "Submissions",
  FORM_BUILDER_LIST_PAGINATION_SHOWING: "Showing {from}-{to} of {total}",
  FORM_BUILDER_LIST_PAGINATION_PREVIOUS: "Previous",
  FORM_BUILDER_LIST_PAGINATION_NEXT: "Next"
};
const FORM_BUILDER_EDITOR = {
  FORM_BUILDER_EDITOR_TITLE_NEW: "New Form",
  FORM_BUILDER_EDITOR_TITLE_EDIT: "Edit Form",
  FORM_BUILDER_EDITOR_SLUG_AUTO: "Auto-generated from name",
  FORM_BUILDER_EDITOR_SLUG_MANUAL: "Manually set",
  FORM_BUILDER_EDITOR_DELETE_CONFIRM: "Are you sure you want to delete this form? All submissions will also be deleted.",
  FORM_BUILDER_EDITOR_UNSAVED_CHANGES: "You have unsaved changes",
  FORM_BUILDER_EDITOR_NAME_PLACEHOLDER: "Enter form name",
  FORM_BUILDER_EDITOR_SLUG_PLACEHOLDER: "enter-form-slug",
  FORM_BUILDER_EDITOR_DESCRIPTION_PLACEHOLDER: "Optional description for this form",
  FORM_BUILDER_EDITOR_SUCCESS_MESSAGE_LABEL: "Success Message",
  FORM_BUILDER_EDITOR_SUCCESS_MESSAGE_PLACEHOLDER: "Thank you for your submission!",
  FORM_BUILDER_EDITOR_REDIRECT_URL_LABEL: "Redirect URL (optional)",
  FORM_BUILDER_EDITOR_REDIRECT_URL_PLACEHOLDER: "https://example.com/thank-you"
};
const FORM_BUILDER_SUBMISSIONS = {
  FORM_BUILDER_SUBMISSIONS_TITLE: "Submissions",
  FORM_BUILDER_SUBMISSIONS_SUBTITLE: "View form submissions",
  FORM_BUILDER_SUBMISSIONS_EMPTY: "No submissions yet",
  FORM_BUILDER_SUBMISSIONS_EMPTY_DESCRIPTION: "Submissions will appear here when users submit this form.",
  FORM_BUILDER_SUBMISSIONS_COLUMN_ID: "ID",
  FORM_BUILDER_SUBMISSIONS_COLUMN_DATA: "Data",
  FORM_BUILDER_SUBMISSIONS_COLUMN_SUBMITTED_AT: "Submitted",
  FORM_BUILDER_SUBMISSIONS_COLUMN_IP_ADDRESS: "IP Address",
  FORM_BUILDER_SUBMISSIONS_COLUMN_ACTIONS: "Actions",
  FORM_BUILDER_SUBMISSIONS_ACTION_VIEW: "View",
  FORM_BUILDER_SUBMISSIONS_ACTION_DELETE: "Delete",
  FORM_BUILDER_SUBMISSIONS_DELETE_CONFIRM: "Are you sure you want to delete this submission?",
  FORM_BUILDER_SUBMISSIONS_BACK_TO_FORM: "Back to Form"
};
const FORM_BUILDER_LOCALIZATION = {
  ...FORM_BUILDER_COMMON,
  ...FORM_BUILDER_TOASTS,
  ...FORM_BUILDER_LIST,
  ...FORM_BUILDER_EDITOR,
  ...FORM_BUILDER_SUBMISSIONS
};
export {
  FORM_BUILDER_LOCALIZATION as F,
  useSubmitForm as a,
  useSuspenseForms as b,
  useDeleteForm as c,
  useSuspenseFormById as d,
  useCreateForm as e,
  useUpdateForm as f,
  useSuspenseSubmissions as g,
  useDeleteSubmission as h,
  useFormBySlug as u
};
