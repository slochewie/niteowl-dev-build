import { Fragment } from "react";
import { Q as QueryClientProvider } from "../tanstack__react-query.mjs";
import { s as setupCoreRouterSsrQueryIntegration } from "./router-ssr-query-core+[...].mjs";
import { jsx } from "react/jsx-runtime";
function setupRouterSsrQueryIntegration(opts) {
  setupCoreRouterSsrQueryIntegration(opts);
  if (opts.wrapQueryClient === false) return;
  const OGWrap = opts.router.options.Wrap || Fragment;
  opts.router.options.Wrap = ({ children }) => {
    return /* @__PURE__ */ jsx(QueryClientProvider, {
      client: opts.queryClient,
      children: /* @__PURE__ */ jsx(OGWrap, { children })
    });
  };
}
export {
  setupRouterSsrQueryIntegration as s
};
