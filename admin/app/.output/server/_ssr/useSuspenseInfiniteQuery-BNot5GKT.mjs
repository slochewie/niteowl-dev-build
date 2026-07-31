import { I as InfiniteQueryObserver } from "./infiniteQueryObserver-CMC81Kyb.mjs";
import { u as useBaseQuery, d as defaultThrowOnError } from "./useBaseQuery-Bzp30GCu.mjs";
function useSuspenseInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: defaultThrowOnError
    },
    InfiniteQueryObserver,
    queryClient
  );
}
export {
  useSuspenseInfiniteQuery as u
};
