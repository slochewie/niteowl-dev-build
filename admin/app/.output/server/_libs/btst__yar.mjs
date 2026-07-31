import "react";
import { b as addRoute, f as findRoute, c as createRouter$1 } from "./rou3.mjs";
function createRoute(path, handler, options, meta) {
  const internalHandler = (...inputCtx) => {
    const context = inputCtx[0] || {};
    const internalContext = createInternalContext(context, {
      options,
      path
    });
    const response = handler(internalContext);
    return response;
  };
  internalHandler.options = options;
  internalHandler.path = path;
  internalHandler.meta = meta;
  return internalHandler;
}
var createRouter = (routes, config) => {
  const internalRouter = createRouter$1();
  for (const endpoint of Object.values(routes)) {
    addRoute(internalRouter, "GET", endpoint.path, endpoint);
  }
  return {
    routes,
    /**
     * Returns the route object for the given path and query params
     * @param path
     * @param queryParams
     * @returns {GetRouteReturn<E> | null} The route object for the given path and query params
     */
    getRoute: (path, queryParams = {}) => {
      const route = findRoute(internalRouter, "GET", path);
      if (!route?.data) {
        return null;
      }
      const handler = route.data;
      const params = route.params ?? {};
      const context = {
        path,
        method: "GET",
        params,
        query: queryParams,
        context: {}
      };
      const responseObj = handler(context);
      const {
        PageComponent,
        LoadingComponent,
        ErrorComponent,
        loader,
        meta,
        extra
      } = responseObj;
      const routeKey = Object.entries(routes).find(
        ([, v]) => v === handler
      )?.[0];
      return {
        PageComponent,
        LoadingComponent,
        ErrorComponent,
        params,
        loader,
        meta,
        extra,
        routeKey
      };
    }
  };
};
var createInternalContext = (context, {
  options,
  path
}) => {
  let error = null;
  const internalContext = {
    ...context,
    query: void 0,
    queryError: error,
    path: context.path || path,
    context: "context" in context && context.context ? context.context : {},
    params: "params" in context ? context.params : void 0,
    method: "GET"
  };
  return internalContext;
};
export {
  createRoute as a,
  createRouter as c
};
