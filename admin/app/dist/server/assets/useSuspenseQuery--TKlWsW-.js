import { u as useBaseQuery, Q as QueryObserver, d as defaultThrowOnError } from "./useBaseQuery-z1wQ1YES.js";
function useSuspenseQuery(options, queryClient) {
  return useBaseQuery(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: defaultThrowOnError,
      placeholderData: void 0
    },
    QueryObserver,
    queryClient
  );
}
export {
  useSuspenseQuery as u
};
