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
var AccountSettingsPageInternal = lazy(
  () => import("./account-settings-page.internal-JCXCAIIM-ChzzF8MG.js").then((m) => ({
    default: m.AccountSettingsPageInternal
  }))
);
function AccountSettingsPage() {
  const { onRouteError } = usePluginOverrides("account");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/account/${accountViewPaths.SETTINGS}`,
      PageComponent: AccountSettingsPageInternal,
      ErrorComponent: DefaultError,
      LoadingComponent: PageLoading,
      NotFoundComponent: NotFoundPage,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("accountSettings", error, {
            path: `/account/${accountViewPaths.SETTINGS}`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
export {
  AccountSettingsPage
};
