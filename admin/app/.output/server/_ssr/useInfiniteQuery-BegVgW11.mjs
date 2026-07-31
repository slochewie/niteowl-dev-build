import { I as InfiniteQueryObserver } from "./infiniteQueryObserver-CMC81Kyb.mjs";
import { u as useBaseQuery } from "./useBaseQuery-Bzp30GCu.mjs";
function useInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    options,
    InfiniteQueryObserver,
    queryClient
  );
}
export {
  useInfiniteQuery as u
};
