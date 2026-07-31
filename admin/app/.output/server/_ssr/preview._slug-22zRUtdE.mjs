import { jsx, jsxs } from "react/jsx-runtime";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useState } from "react";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { StackProvider } from "@btst/stack/context";
import { defaultComponentRegistry, PageRenderer } from "@btst/stack/plugins/ui-builder/client";
import { c as Route$1, g as getOrCreateQueryClient } from "./router-DN1OTUse.mjs";
import "../_libs/pg.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "@btst/stack/client";
import "@btst/stack/plugins/blog/client";
import "@btst/stack/plugins/cms/client";
import "@btst/stack/plugins/form-builder/client";
import "@btst/stack/plugins/kanban/client";
import "@btst/stack/plugins/comments/client";
import "@btst/stack/plugins/media/client";
import "../_libs/btst__better-auth-ui.mjs";
import "@btst/stack/plugins/client";
import "@btst/stack/client/components";
import "../_libs/vaul.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "../_libs/hcaptcha__react-hcaptcha.mjs";
import "../_libs/react-google-recaptcha.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/react.mjs";
import "../_libs/react-async-script.mjs";
import "../_libs/hoist-non-react-statics.mjs";
import "../_libs/react-is.mjs";
import "../_libs/hookform__resolvers.mjs";
import "../_libs/react-hook-form.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/bowser.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/wojtekmaj__react-recaptcha-v3.mjs";
import "../_libs/warning.mjs";
import "../_libs/captchafox__react.mjs";
import "../_libs/marsidev__react-turnstile.mjs";
import "../_libs/react-qr-code.mjs";
import "../_libs/qrcode-generator.mjs";
import "../_libs/input-otp.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/sonner.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/noble__hashes.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "@btst/stack/plugins/route-docs/client";
import "@btst/stack";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "@btst/stack/plugins/blog/api";
import "@btst/stack/plugins/cms/api";
import "@btst/stack/plugins/form-builder/api";
import "@btst/stack/plugins/ui-builder";
import "@btst/stack/plugins/kanban/api";
import "@btst/stack/plugins/comments/api";
import "@btst/stack/plugins/media/api";
import "@btst/stack/plugins/open-api/api";
import "events";
import "util/types";
import "crypto";
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
