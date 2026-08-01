import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Q as QueryClientProvider } from "./QueryClientProvider-BNL98aJf.js";
import { G as Route, i as getOrCreateQueryClient, H as StackProvider } from "./router-DU5jczZR.js";
import { d as defaultComponentRegistry, L as LayerRenderer } from "./registry-C8q1hYUi.js";
import { ErrorBoundary } from "react-error-boundary";
import { u as useSuspenseUIBuilderPageBySlug, a as uiBuilderLocalization } from "./index-DQd4hyqM.js";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "lucide-react";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
import "./badge-DFvO9DkX.js";
import "./accordion-CYnXr6WS.js";
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "react-dom";
import "./index-BI_-Kgeu.js";
import "./separator-2KKe-9Ln.js";
import "./index-CpOdxbMb.js";
import "./tabs-BbzCMZxa.js";
import "./index-x6nDyT23.js";
import "./label-BdRDX7M-.js";
import "@radix-ui/react-label";
import "react-markdown";
import "remark-gfm";
import "remark-math";
import "./form-h3RPcnMA.js";
import "react-hook-form";
import "./command-5HTd1Hbk.js";
import "cmdk";
import "./dialog-Chz0Zs_g.js";
import "@radix-ui/react-dialog";
import "./popover-DQgN5wJE.js";
import "./Combination-C2ce2hnQ.js";
import "./core.esm-Bjw07ll7.js";
import "crypto";
import "./use-debounce-B6NKG3k-.js";
import "./textarea-DS3tfP2l.js";
import "./minimal-tiptap-2ESukVs0.js";
import "./index3-B51lEsWR.js";
import "./dropdown-menu-DwfP37wf.js";
import "./select-B_yf4oCD.js";
import "./index-IXOTxK3N.js";
import "./index-CshadhlS.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "./input-Db1DsNBl.js";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/arduino";
import "highlight.js/lib/languages/bash";
import "highlight.js/lib/languages/c";
import "highlight.js/lib/languages/cpp";
import "highlight.js/lib/languages/csharp";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/diff";
import "highlight.js/lib/languages/go";
import "highlight.js/lib/languages/graphql";
import "highlight.js/lib/languages/ini";
import "highlight.js/lib/languages/java";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/json";
import "highlight.js/lib/languages/kotlin";
import "highlight.js/lib/languages/less";
import "highlight.js/lib/languages/lua";
import "highlight.js/lib/languages/makefile";
import "highlight.js/lib/languages/markdown";
import "highlight.js/lib/languages/objectivec";
import "highlight.js/lib/languages/perl";
import "highlight.js/lib/languages/php";
import "highlight.js/lib/languages/php-template";
import "highlight.js/lib/languages/plaintext";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/python-repl";
import "highlight.js/lib/languages/r";
import "highlight.js/lib/languages/ruby";
import "highlight.js/lib/languages/rust";
import "highlight.js/lib/languages/scss";
import "highlight.js/lib/languages/shell";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/swift";
import "highlight.js/lib/languages/typescript";
import "highlight.js/lib/languages/vbnet";
import "highlight.js/lib/languages/wasm";
import "highlight.js/lib/languages/xml";
import "highlight.js/lib/languages/yaml";
import "sonner";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
function DefaultLoadingComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[200px]", children: /* @__PURE__ */ jsx("div", { className: "animate-pulse text-muted-foreground", children: uiBuilderLocalization.pageRenderer.loading }) });
}
function DefaultErrorComponent({ error }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[200px] p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-destructive font-medium", children: uiBuilderLocalization.pageRenderer.error }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-2", children: error instanceof Error ? error.message : String(error) })
  ] });
}
function DefaultNotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[200px]", children: /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: uiBuilderLocalization.pageRenderer.notFound }) });
}
function PageRenderer({
  slug,
  componentRegistry = defaultComponentRegistry,
  variableValues,
  functionRegistry,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
  NotFoundComponent = DefaultNotFoundComponent,
  className
}) {
  return /* @__PURE__ */ jsx(
    ErrorBoundary,
    {
      FallbackComponent: ({ error }) => /* @__PURE__ */ jsx(ErrorComponent, { error }),
      children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingComponent, {}), children: /* @__PURE__ */ jsx(
        SuspensePageRendererContent,
        {
          slug,
          componentRegistry,
          variableValues,
          functionRegistry,
          NotFoundComponent,
          className
        }
      ) })
    }
  );
}
function SuspensePageRendererContent({
  slug,
  componentRegistry = defaultComponentRegistry,
  variableValues,
  functionRegistry,
  NotFoundComponent = DefaultNotFoundComponent,
  className
}) {
  const { page, layers, variables } = useSuspenseUIBuilderPageBySlug(slug);
  if (!page || layers.length === 0) {
    return /* @__PURE__ */ jsx(NotFoundComponent, {});
  }
  const rootLayer = layers[0];
  if (!rootLayer) {
    return /* @__PURE__ */ jsx(NotFoundComponent, {});
  }
  return /* @__PURE__ */ jsx(
    LayerRenderer,
    {
      className,
      page: rootLayer,
      componentRegistry,
      variables,
      variableValues,
      functionRegistry
    }
  );
}
const getBaseURL = () => typeof window !== "undefined" ? window.location.origin : process.env.VITE_PUBLIC_SITE_URL || process.env.BASE_URL || "http://localhost:3000";
function PreviewPage() {
  const {
    slug
  } = Route.useParams();
  const navigate = useNavigate();
  const [queryClient] = useState(() => getOrCreateQueryClient());
  const baseURL = getBaseURL();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(StackProvider, { basePath: "/preview", overrides: {
    "ui-builder": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      componentRegistry: defaultComponentRegistry,
      navigate: (path) => navigate({
        to: path
      }),
      refresh: () => window.location.reload(),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    }
  }, children: /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsx(PageRenderer, { slug, componentRegistry: defaultComponentRegistry, className: "w-full", NotFoundComponent: () => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-2", children: "Page Not Found" }),
    /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-4", children: [
      "The page “",
      slug,
      "” does not exist."
    ] }),
    /* @__PURE__ */ jsx(Link, { to: "/pages/ui-builder", className: "text-primary hover:underline", children: "Go to UI Builder" })
  ] }), ErrorComponent: ({
    error
  }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-destructive mb-2", children: "Error" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: error instanceof Error ? error.message : String(error) })
  ] }) }) }) }) });
}
export {
  PreviewPage as component
};
