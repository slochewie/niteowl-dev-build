import { jsxs, jsx } from "react/jsx-runtime";
import { lazy } from "react";
import { N as NotFoundPage, D as DefaultError } from "./404-page-C3c0Rv4c.js";
import { S as Skeleton, l as usePluginOverrides, C as ComposedRoute } from "./router-DU5jczZR.js";
function EditorSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-24" })
  ] });
}
const ContentEditorPageInternal = lazy(
  () => import("./content-editor-page.internal-C8Wt0qLx.js").then((m) => ({
    default: m.ContentEditorPage
  }))
);
function ContentEditorPageComponent({
  typeSlug,
  id
}) {
  const { onRouteError } = usePluginOverrides("cms");
  const isNew = !id;
  const path = isNew ? `/cms/${typeSlug}/new` : `/cms/${typeSlug}/${id}`;
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path,
      PageComponent: ContentEditorPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: EditorSkeleton,
      NotFoundComponent: NotFoundPage,
      props: { typeSlug, id },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("contentEditor", error, {
            path,
            params: { typeSlug, id: id ?? "" },
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const contentEditorPage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ContentEditorPageComponent
}, Symbol.toStringTag, { value: "Module" }));
export {
  EditorSkeleton as E,
  contentEditorPage as c
};
