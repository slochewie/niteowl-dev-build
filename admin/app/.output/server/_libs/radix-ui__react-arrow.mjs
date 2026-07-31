import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { P as Primitive } from "./radix-ui__react-primitive.mjs";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var Arrow = /* @__PURE__ */ reactExports.forwardRef(
  /* @__PURE__ */ __name(function Arrow2(props, forwardedRef) {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  }, "Arrow")
);
var Root = Arrow;
export {
  Root as R
};
