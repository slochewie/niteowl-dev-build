import { A as AcceptInvitationCard } from "./chunk-DKFWHFFN-lEj7qXLU.js";
import { B as BetterAuthPluginProvider } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import "./chunk-KS7QMNEN-DP7ssmzE.js";
import "clsx";
import "react";
import { jsx } from "react/jsx-runtime";
import { l as usePluginOverrides } from "./router-DU5jczZR.js";
import "./chunk-XPGLXIJB-gK-XK5gU.js";
import "lucide-react";
import "@radix-ui/react-avatar";
import "sonner";
import "@wojtekmaj/react-recaptcha-v3";
import "tailwind-merge";
import "zod";
import "@radix-ui/react-slot";
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
function AcceptInvitationPageInternal() {
  var _a;
  const { pageProps } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsx(
    AcceptInvitationCard,
    {
      className: (_a = pageProps == null ? void 0 : pageProps.acceptInvitation) == null ? void 0 : _a.className
    }
  ) });
}
export {
  AcceptInvitationPageInternal
};
