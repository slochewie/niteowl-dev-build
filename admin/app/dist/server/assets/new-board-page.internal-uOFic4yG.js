import { jsxs, jsx } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
import { l as usePluginOverrides, v as Card, x as CardHeader, y as CardTitle, z as CardDescription, w as CardContent } from "./router-DU5jczZR.js";
import { B as BoardForm } from "./board-form-DgkYpgTT.js";
import { P as PageWrapper } from "./page-wrapper-Dq5Sql4Y.js";
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
import "./input-Db1DsNBl.js";
import "./textarea-DS3tfP2l.js";
import "./label-BdRDX7M-.js";
import "@radix-ui/react-label";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useMutation-wDhDrN3q.js";
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
