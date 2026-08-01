import { I as InfiniteQueryObserver } from "./infiniteQueryObserver-EXEbLXDI.js";
import { u as useBaseQuery, d as defaultThrowOnError } from "./useBaseQuery-z1wQ1YES.js";
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
