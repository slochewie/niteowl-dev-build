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
var EmailVerificationPageInternal = lazy(
  () => import("./email-verification-page.internal-E7EMM4LT-BH7TbPbT.js").then((m) => ({
    default: m.EmailVerificationPageInternal
  }))
);
function EmailVerificationPage() {
  const { onRouteError } = usePluginOverrides("auth");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
      PageComponent: EmailVerificationPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("emailVerification", error, {
            path: `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  EmailVerificationPage
};
