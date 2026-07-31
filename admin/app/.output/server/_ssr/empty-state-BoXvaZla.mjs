import { jsxs, jsx } from "react/jsx-runtime";
import { q as cn$1 } from "./router-qu_5GP1h.mjs";
function EmptyState({
  title,
  description,
  action,
  icon,
  className
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn$1(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      ),
      "data-testid": "empty-state",
      children: [
        icon && /* @__PURE__ */ jsx("div", { className: "rounded-full bg-muted p-6 mb-4", children: icon }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-md mb-4", children: description }),
        action && /* @__PURE__ */ jsx("div", { children: action })
      ]
    }
  );
}
export {
  EmptyState as E
};
