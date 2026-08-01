import { jsxs, jsx } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { B as Button } from "./router-DU5jczZR.js";
function DefaultError({ error, resetErrorBoundary }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-destructive/10 p-4 mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-destructive" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: (error instanceof Error ? error.message : void 0) || "An unexpected error occurred" }),
    resetErrorBoundary && /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetErrorBoundary, children: "Try again" })
  ] });
}
export {
  DefaultError as D
};
