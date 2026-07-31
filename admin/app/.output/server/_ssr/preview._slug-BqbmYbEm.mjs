import { jsx, jsxs } from "react/jsx-runtime";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useState, Suspense } from "react";
import { Q as QueryClientProvider } from "./QueryClientProvider-BNL98aJf.mjs";
import { G as Route$1, i as getOrCreateQueryClient, H as StackProvider } from "./router-qu_5GP1h.mjs";
import { d as defaultComponentRegistry, L as LayerRenderer } from "./registry-CU-mV0Xp.mjs";
import { m } from "../_libs/react-error-boundary.mjs";
import { u as useSuspenseUIBuilderPageBySlug, a as uiBuilderLocalization } from "./index-C9QBiYz9.mjs";
import "../_libs/better-call.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./accordion-DJKZ9YSV.mjs";
import "./index-BUGN0YTJ.mjs";
import "react-dom";
import "./index-BI_-Kgeu.mjs";
import "./separator-dOz0oFNG.mjs";
import "./index-CpOdxbMb.mjs";
import "./tabs-DEFvB4cH.mjs";
import "./index-x6nDyT23.mjs";
import "./form-Cx2oXTTw.mjs";
import "./popover-I-2hrCQX.mjs";
import "./Combination-C2ce2hnQ.mjs";
import "./core.esm-Bjw07ll7.mjs";
import "./minimal-tiptap-C14rUPAr.mjs";
import "./index3-B51lEsWR.mjs";
import "./dropdown-menu-EQQ6qBjO.mjs";
import "./select-DRbaYjS4.mjs";
import "../_libs/sonner.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "./badge-CGoI1f31.mjs";
import "./label-DWXXj0lo.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./command-8DCQ5FSU.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./dialog-B4u5EdHX.mjs";
import "crypto";
import "./use-debounce-B6NKG3k-.mjs";
import "./textarea-ClKgIhzC.mjs";
import "../_libs/remark-gfm.mjs";
import "../_libs/micromark-extension-gfm.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-extension-gfm-autolink-literal+[...].mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-extension-gfm-footnote+[...].mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/micromark-extension-gfm-strikethrough+[...].mjs";
import "../_libs/micromark-extension-gfm-table.mjs";
import "../_libs/micromark-extension-gfm-task-list-item+[...].mjs";
import "../_libs/mdast-util-gfm.mjs";
import "../_libs/mdast-util-gfm-autolink-literal+[...].mjs";
import "../_libs/ccount.mjs";
import "../_libs/devlop.mjs";
import "../_libs/mdast-util-find-and-replace.mjs";
import "../_libs/escape-string-regexp.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/mdast-util-gfm-footnote.mjs";
import "../_libs/mdast-util-gfm-strikethrough.mjs";
import "../_libs/mdast-util-gfm-table.mjs";
import "../_libs/markdown-table.mjs";
import "../_libs/mdast-util-to-markdown.mjs";
import "../_libs/zwitch.mjs";
import "../_libs/longest-streak.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/mdast-util-phrasing.mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/mdast-util-gfm-task-list-item.mjs";
import "../_libs/remark-math.mjs";
import "../_libs/micromark-extension-math.mjs";
import "../_libs/mdast-util-math.mjs";
import "../_libs/react-markdown.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/react.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "stream";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
import "./index-S7rpP7KI.mjs";
import "./index-rdulpQ7P.mjs";
import "./index-KZ0RSJRl.mjs";
import "../_libs/react-hook-form.mjs";
import "./switch-DIDzzBgm.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "./input-Ds7nu5GX.mjs";
import "../_libs/highlight.js.mjs";
import "./index-IXOTxK3N.mjs";
import "./index-CshadhlS.mjs";
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
    m,
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
  } = Route$1.useParams();
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
