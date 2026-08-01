import { N as NotFoundPage, P as PageLoading, D as DefaultError } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import "clsx";
import { l as usePluginOverrides, C as ComposedRoute, o as authViewPaths } from "./router-DU5jczZR.js";
import { lazy } from "react";
import { jsx } from "react/jsx-runtime";
import "tailwind-merge";
import "zod";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "lucide-react";
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
var ForgotPasswordPageInternal = lazy(
  () => import("./forgot-password-page.internal-ETDVCAUC-DXfFmcjQ.js").then((m) => ({
    default: m.ForgotPasswordPageInternal
  }))
);
function ForgotPasswordPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.FORGOT_PASSWORD}`,
      PageComponent: ForgotPasswordPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("forgotPassword", error, {
            path: `/auth/${authViewPaths.FORGOT_PASSWORD}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  ForgotPasswordPage
};
