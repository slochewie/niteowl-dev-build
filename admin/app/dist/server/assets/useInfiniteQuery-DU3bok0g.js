import { I as InfiniteQueryObserver } from "./infiniteQueryObserver-EXEbLXDI.js";
import { u as useBaseQuery } from "./useBaseQuery-z1wQ1YES.js";
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
