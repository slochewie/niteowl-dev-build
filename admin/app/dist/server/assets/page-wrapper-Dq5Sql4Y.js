import { u as useQuery } from "./useQuery-CQBkpW0a.js";
import { u as useSuspenseQuery } from "./useSuspenseQuery--TKlWsW-.js";
import { u as useQueryClient } from "./QueryClientProvider-BNL98aJf.js";
import { u as useMutation } from "./useMutation-wDhDrN3q.js";
import { Y as createKanbanQueryKeys, l as usePluginOverrides, T as createApiClient, q as cn } from "./router-DU5jczZR.js";
import { jsx } from "react/jsx-runtime";
function isErrorResponse(response) {
  return typeof response === "object" && response !== null && "error" in response && response.error !== null && response.error !== void 0;
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
function useKanbanClient() {
  const { apiBaseURL, apiBasePath, headers } = usePluginOverrides("kanban");
  const client = createApiClient({
    baseURL: apiBaseURL,
    basePath: apiBasePath
  });
  return { client, headers };
}
function useSuspenseBoards(params) {
  const { client, headers } = useKanbanClient();
  const queries = createKanbanQueryKeys(client, headers);
  const result = useSuspenseQuery({
    ...queries.boards.list(params),
    staleTime: 3e4,
    refetchOnWindowFocus: true
  });
  if (result.error && !result.isFetching) {
    throw result.error;
  }
  return result;
}
function useSuspenseBoard(boardId) {
  const { client, headers } = useKanbanClient();
  const queries = createKanbanQueryKeys(client, headers);
  const result = useSuspenseQuery({
    ...queries.boards.detail(boardId),
    staleTime: 3e4,
    refetchOnWindowFocus: true
  });
  if (result.error && !result.isFetching) {
    throw result.error;
  }
  return result;
}
function useBoardMutations() {
  const { client, headers } = useKanbanClient();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await client("@post/boards", {
        method: "POST",
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      const response = await client("@put/boards/:id", {
        method: "PUT",
        params: { id },
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await client("@delete/boards/:id", {
        method: "DELETE",
        params: { id },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  return {
    createBoard: createMutation.mutateAsync,
    updateBoard: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteBoard: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error
  };
}
function useColumnMutations() {
  const { client, headers } = useKanbanClient();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await client("@post/columns", {
        method: "POST",
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      const response = await client("@put/columns/:id", {
        method: "PUT",
        params: { id },
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await client("@delete/columns/:id", {
        method: "DELETE",
        params: { id },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const reorderMutation = useMutation({
    mutationFn: async ({
      boardId,
      columnIds
    }) => {
      const response = await client("@post/columns/reorder", {
        method: "POST",
        body: { boardId, columnIds },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  return {
    createColumn: createMutation.mutateAsync,
    updateColumn: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteColumn: deleteMutation.mutateAsync,
    reorderColumns: (boardId, columnIds) => reorderMutation.mutateAsync({ boardId, columnIds }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    reorderError: reorderMutation.error
  };
}
function useTaskMutations() {
  const { client, headers } = useKanbanClient();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await client("@post/tasks", {
        method: "POST",
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      const response = await client("@put/tasks/:id", {
        method: "PUT",
        params: { id },
        body: data,
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await client("@delete/tasks/:id", {
        method: "DELETE",
        params: { id },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const moveMutation = useMutation({
    mutationFn: async ({
      taskId,
      targetColumnId,
      targetOrder
    }) => {
      const response = await client("@post/tasks/move", {
        method: "POST",
        body: { taskId, targetColumnId, targetOrder },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  const reorderMutation = useMutation({
    mutationFn: async ({
      columnId,
      taskIds
    }) => {
      const response = await client("@post/tasks/reorder", {
        method: "POST",
        body: { columnId, taskIds },
        headers
      });
      if (isErrorResponse(response)) {
        const errorResponse = response;
        throw toError(errorResponse.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    }
  });
  return {
    createTask: createMutation.mutateAsync,
    updateTask: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteTask: deleteMutation.mutateAsync,
    moveTask: (taskId, targetColumnId, targetOrder) => moveMutation.mutateAsync({ taskId, targetColumnId, targetOrder }),
    reorderTasks: (columnId, taskIds) => reorderMutation.mutateAsync({ columnId, taskIds }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMoving: moveMutation.isPending,
    isReordering: reorderMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    moveError: moveMutation.error,
    reorderError: reorderMutation.error
  };
}
function useResolveUser(userId) {
  const { resolveUser } = usePluginOverrides("kanban");
  return useQuery({
    queryKey: ["kanban", "users", userId],
    queryFn: async () => {
      if (!userId) return null;
      const result = await resolveUser(userId);
      return result;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1e3,
    // Cache user info for 5 minutes
    gcTime: 10 * 60 * 1e3
    // Keep in cache for 10 minutes
  });
}
function useSearchUsers(query, boardId) {
  const { searchUsers } = usePluginOverrides("kanban");
  return useQuery({
    queryKey: ["kanban", "users", "search", query, boardId],
    queryFn: async () => {
      const result = await searchUsers(query, boardId);
      return result;
    },
    staleTime: 3e4
    // Cache search results for 30 seconds
  });
}
function PageWrapper({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("container mx-auto py-8 px-4", className), ...props, children });
}
export {
  PageWrapper as P,
  useBoardMutations as a,
  useResolveUser as b,
  useColumnMutations as c,
  useTaskMutations as d,
  useSearchUsers as e,
  useSuspenseBoard as f,
  useSuspenseBoards as u
};
