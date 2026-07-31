import * as React from "react";
import { P as Primitive } from "./radix-ui__react-primitive.mjs";
import { jsx } from "react/jsx-runtime";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var Arrow = /* @__PURE__ */ React.forwardRef(
  /* @__PURE__ */ __name(function Arrow2(props, forwardedRef) {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ jsx(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  }, "Arrow")
);
var Root = Arrow;
export {
  Root as R
};
