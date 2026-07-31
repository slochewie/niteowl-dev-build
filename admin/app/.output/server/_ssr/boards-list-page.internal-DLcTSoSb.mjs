import { jsxs, jsx } from "react/jsx-runtime";
import { l as usePluginOverrides, B as Button, v as Card, x as CardHeader, y as CardTitle, z as CardDescription, w as CardContent } from "./router-qu_5GP1h.mjs";
import { u as useSuspenseBoards, P as PageWrapper } from "./page-wrapper-D5yp3MTX.mjs";
import { E as EmptyState } from "./empty-state-BoXvaZla.mjs";
import "react";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { P as Plus } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
function BoardsListPage() {
  const { data: boards, error, isFetching } = useSuspenseBoards();
  if (error && !isFetching) {
    throw error;
  }
  const { Link: OverrideLink, navigate: overrideNavigate } = usePluginOverrides("kanban");
  const Link = OverrideLink || "a";
  const navigate = overrideNavigate || ((path) => {
    window.location.href = path;
  });
  const handleNewBoard = () => {
    navigate("/pages/kanban/new");
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { "data-testid": "boards-list-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", "data-testid": "page-header", children: "Kanban Boards" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Manage your projects and tasks" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: handleNewBoard, children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "New Board"
      ] })
    ] }),
    boards.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: boards.map((board) => /* @__PURE__ */ jsx(
      Link,
      {
        href: `/pages/kanban/${board.id}`,
        className: "block group",
        children: /* @__PURE__ */ jsxs(Card, { className: "h-full transition-shadow hover:shadow-md cursor-pointer", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "group-hover:text-primary transition-colors", children: board.name }),
            board.description && /* @__PURE__ */ jsx(CardDescription, { className: "line-clamp-2", children: board.description })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              board.columns?.length || 0,
              " columns"
            ] }),
            /* @__PURE__ */ jsx("span", { children: format(new Date(board.createdAt), "MMM d, yyyy") })
          ] }) })
        ] })
      },
      board.id
    )) }) : /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No boards yet",
        description: "Create your first kanban board to start organizing your tasks.",
        action: /* @__PURE__ */ jsxs(Button, { onClick: handleNewBoard, children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Create Board"
        ] })
      }
    )
  ] });
}
export {
  BoardsListPage
};
