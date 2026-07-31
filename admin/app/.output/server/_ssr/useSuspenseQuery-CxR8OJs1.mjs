import { u as useBaseQuery, Q as QueryObserver, d as defaultThrowOnError } from "./useBaseQuery-Bzp30GCu.mjs";
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
