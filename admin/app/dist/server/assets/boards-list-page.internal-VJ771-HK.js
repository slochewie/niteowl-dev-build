import { jsxs, jsx } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { l as usePluginOverrides, B as Button, v as Card, x as CardHeader, y as CardTitle, z as CardDescription, w as CardContent } from "./router-DU5jczZR.js";
import { u as useSuspenseBoards, P as PageWrapper } from "./page-wrapper-Dq5Sql4Y.js";
import { E as EmptyState } from "./empty-state-JVMtvHrl.js";
import { format } from "date-fns";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "react";
import "@btst/yar";
import "better-call/client";
import "zod";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useMutation-wDhDrN3q.js";
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
