import { N as NotFoundPage, P as PageLoading, D as DefaultError } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import "clsx";
import { l as usePluginOverrides, C as ComposedRoute, m as accountViewPaths } from "./router-DU5jczZR.js";
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
var AccountApiKeysPageInternal = lazy(
  () => import("./account-api-keys-page.internal-YQO3GVRR-CGSiSotK.js").then((m) => ({
    default: m.AccountApiKeysPageInternal
  }))
);
function AccountApiKeysPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.API_KEYS}`,
      PageComponent: AccountApiKeysPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountApiKeys", error, {
            path: `/account/${accountViewPaths.API_KEYS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  AccountApiKeysPage
};
