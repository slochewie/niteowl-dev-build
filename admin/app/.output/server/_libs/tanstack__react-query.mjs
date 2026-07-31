import * as React from "react";
import { jsx } from "react/jsx-runtime";
var QueryClientContext = React.createContext(
  void 0
);
var QueryClientProvider = ({
  client,
  children
}) => {
  React.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsx(QueryClientContext.Provider, { value: client, children });
};
export {
  QueryClientProvider as Q
};
