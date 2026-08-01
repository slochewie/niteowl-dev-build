import { A as AuthView } from "./chunk-4B757JCA-BNRhUPVI.js";
import "clsx";
import { jsx } from "react/jsx-runtime";
import { B as BetterAuthPluginProvider } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import "react";
import "./chunk-KS7QMNEN-DP7ssmzE.js";
import "./chunk-52PGTSBA-DxrPz66P.js";
import "@hcaptcha/react-hcaptcha";
import "react-google-recaptcha";
import { l as usePluginOverrides, o as authViewPaths } from "./router-DU5jczZR.js";
import "@radix-ui/react-separator";
import "./chunk-RM3CMS3T-BA2SCinp.js";
import "./chunk-J2UYHABD-DLDVTXtS.js";
import "lucide-react";
import "./chunk-VDEJY4DC-BKV7CoXX.js";
import "./chunk-DKFWHFFN-lEj7qXLU.js";
import "./chunk-XPGLXIJB-gK-XK5gU.js";
import "@radix-ui/react-avatar";
import "./chunk-2FH7HU2O-MYBnhmp_.js";
import "@radix-ui/react-checkbox";
import "@wojtekmaj/react-recaptcha-v3";
import "@captchafox/react";
import "@marsidev/react-turnstile";
import "@hookform/resolvers/zod";
import "react-hook-form";
import "zod";
import "react-qr-code";
import "input-otp";
import "sonner";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@noble/hashes/sha2.js";
import "@noble/hashes/utils.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-label";
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
function EmailOtpPageInternal() {
  const { pageProps } = usePluginOverrides("auth");
  const { localization, ...rest } = (pageProps == null ? void 0 : pageProps.emailOtp) ?? {};
  return /* @__PURE__ */ jsx(BetterAuthPluginProvider, { children: /* @__PURE__ */ jsx(
    AuthView,
    {
      path: authViewPaths.EMAIL_OTP,
      ...rest,
      localization
    }
  ) });
}
export {
  EmailOtpPageInternal
};
