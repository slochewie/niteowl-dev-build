import { jsxs, jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, v as Card, x as CardHeader, y as CardTitle, z as CardDescription, w as CardContent } from "./router-qu_5GP1h.mjs";
import { B as BoardForm } from "./board-form-CBlFKGw9.mjs";
import { P as PageWrapper } from "./page-wrapper-D5yp3MTX.mjs";
import "react";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { A as ArrowLeft } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/zod.mjs";
import "./input-Ds7nu5GX.mjs";
import "./textarea-ClKgIhzC.mjs";
import "./label-DWXXj0lo.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useMutation-C_XiO15s.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/react.mjs";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "crypto";
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
function NewBoardPage() {
  const { Link: OverrideLink, navigate: overrideNavigate } = usePluginOverrides("kanban");
  const navigate = overrideNavigate || ((path) => {
    window.location.href = path;
  });
  const Link = OverrideLink || "a";
  const handleSuccess = (boardId) => {
    navigate(`/pages/kanban/${boardId}`);
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { "data-testid": "new-board-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/pages/kanban",
          className: "text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", "data-testid": "page-header", children: "Create New Board" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Set up a new kanban board for your project" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Board Details" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Enter the details for your new kanban board." })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
        BoardForm,
        {
          onClose: () => navigate("/pages/kanban"),
          onSuccess: handleSuccess
        }
      ) })
    ] })
  ] });
}
export {
  NewBoardPage
};
