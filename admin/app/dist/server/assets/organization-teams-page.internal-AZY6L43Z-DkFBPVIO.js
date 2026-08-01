import { O as OrganizationView } from "./chunk-W465OTKW-C1U1sCYG.js";
import "clsx";
import { jsx } from "react/jsx-runtime";
import { B as BetterAuthPluginProvider } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import "./chunk-52PGTSBA-DxrPz66P.js";
import "./chunk-KS7QMNEN-DP7ssmzE.js";
import "react";
import "@hookform/resolvers/zod";
import "vaul";
import { l as usePluginOverrides, p as organizationViewPaths } from "./router-DU5jczZR.js";
import "./chunk-2YWC3WKF-BkWGzDxB.js";
import "./chunk-XPGLXIJB-gK-XK5gU.js";
import "lucide-react";
import "@radix-ui/react-avatar";
import "react-hook-form";
import "@radix-ui/react-dialog";
import "zod";
import "@radix-ui/react-select";
import "class-variance-authority";
import "sonner";
import "@wojtekmaj/react-recaptcha-v3";
import "@noble/hashes/sha2.js";
import "@noble/hashes/utils.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
import "@radix-ui/react-slot";
import "tailwind-merge";
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
function OrganizationTeamsPageInternal() {
  const { pageProps } = usePluginOverrides("organization");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.organizationTeams) ?? {};
  return /* @__PURE__ */ jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsx(
    OrganizationView,
    {
      path: organizationViewPaths.TEAMS,
      ...rest,
      localization
    }
  ) });
}
export {
  OrganizationTeamsPageInternal
};
