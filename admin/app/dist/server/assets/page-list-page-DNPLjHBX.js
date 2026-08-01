import { jsx, jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { l as usePluginOverrides, P as PageWrapper$1, S as Skeleton } from "./router-DU5jczZR.js";
import { ErrorBoundary } from "react-error-boundary";
import { D as DefaultError } from "./default-error-Cs5qeeYK.js";
function PageWrapper({
  children,
  className,
  testId
}) {
  const { showAttribution } = usePluginOverrides("ui-builder", {
    showAttribution: true
  });
  return /* @__PURE__ */ jsx(
    PageWrapper$1,
    {
      className,
      testId,
      showAttribution,
      children
    }
  );
}
function PageListSkeleton() {
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "page-list-skeleton", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-64" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-16 rounded-lg" }, i)) })
  ] }) });
}
const PageListPageInternal = lazy(
  () => import("./page-list-page.internal-DYpocpuZ.js").then((m) => ({
    default: m.PageListPage
  }))
);
function PageListPage() {
  return /* @__PURE__ */ jsx(ErrorBoundary, { FallbackComponent: DefaultError, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(PageListSkeleton, {}), children: /* @__PURE__ */ jsx(PageListPageInternal, {}) }) });
}
const pageListPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PageListPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  PageWrapper as P,
  pageListPage as p
};
