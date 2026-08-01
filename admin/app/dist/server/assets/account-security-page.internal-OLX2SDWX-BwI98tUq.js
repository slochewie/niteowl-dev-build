import { B as BetterAuthPluginProvider } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { A as AccountView } from "./chunk-YR2DLEVB-BAWvLAcJ.js";
import "./chunk-52PGTSBA-DxrPz66P.js";
import "./chunk-KS7QMNEN-DP7ssmzE.js";
import "clsx";
import "react";
import { jsx } from "react/jsx-runtime";
import "@hookform/resolvers/zod";
import "vaul";
import "@hcaptcha/react-hcaptcha";
import "react-google-recaptcha";
import { l as usePluginOverrides, m as accountViewPaths } from "./router-DU5jczZR.js";
import "sonner";
import "@wojtekmaj/react-recaptcha-v3";
import "./chunk-2YWC3WKF-BkWGzDxB.js";
import "./chunk-XPGLXIJB-gK-XK5gU.js";
import "lucide-react";
import "@radix-ui/react-avatar";
import "react-hook-form";
import "@radix-ui/react-dialog";
import "zod";
import "@radix-ui/react-select";
import "./chunk-2FH7HU2O-MYBnhmp_.js";
import "@radix-ui/react-checkbox";
import "@captchafox/react";
import "@marsidev/react-turnstile";
import "@radix-ui/react-tooltip";
import "bowser";
import "@noble/hashes/sha2.js";
import "@noble/hashes/utils.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-slot";
import "tailwind-merge";
import "class-variance-authority";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
function AccountSecurityPageInternal() {
  const { pageProps } = usePluginOverrides("account");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.accountSecurity) ?? {};
  return /* @__PURE__ */ jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsx(
    AccountView,
    {
      path: accountViewPaths.SECURITY,
      ...rest,
      localization
    }
  ) });
}
export {
  AccountSecurityPageInternal
};
