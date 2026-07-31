import { jsx } from "react/jsx-runtime";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { q as cn$1 } from "./router-qu_5GP1h.mjs";
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Root,
    {
      "data-slot": "label",
      className: cn$1(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
export {
  Label as L
};
