import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useMemo } from "react";
import { B as Button, v as Card, w as CardContent, W as generateSchema, X as ROUTE_DOCS_QUERY_KEY, q as cn$1, x as CardHeader, y as CardTitle } from "./router-qu_5GP1h.mjs";
import { B as Badge } from "./badge-CGoI1f31.mjs";
import { S as ScrollArea } from "./scroll-area-BTcAkCUP.mjs";
import { S as Separator } from "./separator-dOz0oFNG.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-lRTtBhlU.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { L as Label } from "./label-DWXXj0lo.mjs";
import { D as Dialog, d as DialogTrigger, c as DialogContent, f as DialogClose, e as DialogTitle, a as DialogPortal, b as DialogOverlay } from "../_libs/radix-ui__react-dialog.mjs";
import { u as useSuspenseQuery } from "./useSuspenseQuery-CxR8OJs1.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./index-BUGN0YTJ.mjs";
import "react-dom";
import "./index-BI_-Kgeu.mjs";
import "./index-CpOdxbMb.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import { M as Menu, q as Globe, m as Folder, X, r as Link2, s as ExternalLink, t as Navigation, n as FolderOpen, d as ChevronRight, u as FileText } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "./index-S7rpP7KI.mjs";
import "./index-KZ0RSJRl.mjs";
import "./index-IXOTxK3N.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
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
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(Dialog, { "data-slot": "sheet", ...props });
}
function SheetTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogTrigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPortal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogOverlay,
    {
      "data-slot": "sheet-overlay",
      className: cn$1(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogContent,
      {
        "data-slot": "sheet-content",
        className: cn$1(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogClose, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn$1("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogTitle,
    {
      "data-slot": "sheet-title",
      className: cn$1("text-foreground font-semibold", className),
      ...props
    }
  );
}
function escapeRegexForRoutePath(path) {
  const PARAM_PLACEHOLDER = "\0PARAM\0";
  const WILDCARD_PLACEHOLDER = "\0WILDCARD\0";
  let result = path.replace(/:[^/]+/g, PARAM_PLACEHOLDER).replace(/\*/g, WILDCARD_PLACEHOLDER);
  result = result.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  result = result.replace(new RegExp(PARAM_PLACEHOLDER, "g"), "[^/]+").replace(new RegExp(WILDCARD_PLACEHOLDER, "g"), ".*");
  return result;
}
function HighlightedPath({ path }) {
  const parts = path.split("/");
  return /* @__PURE__ */ jsx("code", { className: "font-mono text-xl break-all", children: parts.map((part, i) => {
    const isParam = part.startsWith(":") || part.startsWith("*");
    return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
      i > 0 && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "/" }),
      isParam ? /* @__PURE__ */ jsx("span", { className: "text-primary font-semibold", children: part }) : /* @__PURE__ */ jsx("span", { className: "text-foreground", children: part })
    ] }, i);
  }) });
}
function ParameterCard({ param }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border p-4 space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx("code", { className: "font-mono text-sm text-primary font-semibold", children: param.name }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: param.type }),
        /* @__PURE__ */ jsx(
          Badge,
          {
            variant: param.required ? "destructive" : "outline",
            className: "text-xs",
            children: param.required ? "required" : "optional"
          }
        )
      ] })
    ] }),
    param.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: param.description }),
    param.schema?.enum && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Values: ",
      param.schema.enum.join(" | ")
    ] })
  ] });
}
function ParametersSection({
  params,
  title
}) {
  if (params.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: title }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-lg border overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[150px]", children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "Type" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Required" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Description" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: params.map((param) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("code", { className: "font-mono text-sm text-primary", children: param.name }) }),
        /* @__PURE__ */ jsxs(TableCell, { children: [
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: param.type }),
          param.schema?.enum && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-muted-foreground", children: [
            "(",
            param.schema.enum.join(" | "),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Badge,
          {
            variant: param.required ? "destructive" : "outline",
            className: "text-xs",
            children: param.required ? "required" : "optional"
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: param.description || "—" })
      ] }, param.name)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: params.map((param) => /* @__PURE__ */ jsx(ParameterCard, { param }, param.name)) })
  ] });
}
function NavigationForm({
  route,
  siteBasePath
}) {
  const [paramValues, setParamValues] = useState({});
  const handleParamChange = (name, value) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };
  const buildUrl = () => {
    let url = route.path;
    for (const param of route.pathParams) {
      const value = paramValues[param.name] || `{${param.name}}`;
      if (param.name === "_") {
        url = url.replace("*", value);
      } else if (url.includes(`*:${param.name}`)) {
        url = url.replace(`*:${param.name}`, value);
      } else {
        url = url.replace(`:${param.name}`, value);
      }
    }
    return `${siteBasePath}${url}`;
  };
  const handleVisit = () => {
    const url = buildUrl();
    const hasUnfilledParams = route.pathParams.some(
      (p) => !paramValues[p.name]
    );
    if (hasUnfilledParams) {
      return;
    }
    window.open(url, "_blank");
  };
  const allParamsFilled = route.pathParams.every((p) => paramValues[p.name]);
  const previewUrl = buildUrl();
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" }),
      "Navigate to Route"
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: route.pathParams.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2", children: route.pathParams.map((param) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: `param-${param.name}`, className: "font-mono", children: [
          ":",
          param.name
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: `param-${param.name}`,
            placeholder: `Enter ${param.name}...`,
            value: paramValues[param.name] || "",
            onChange: (e) => handleParamChange(param.name, e.target.value)
          }
        )
      ] }, param.name)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2", children: [
        /* @__PURE__ */ jsx("code", { className: "flex-1 text-xs bg-muted px-3 py-2 rounded-md font-mono text-muted-foreground break-all", children: previewUrl }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleVisit,
            disabled: !allParamsFilled,
            className: "shrink-0",
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 mr-2" }),
              "Visit"
            ]
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("code", { className: "flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono break-all", children: [
        siteBasePath,
        route.path
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: () => window.open(`${siteBasePath}${route.path}`, "_blank"),
          className: "shrink-0",
          children: [
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 mr-2" }),
            "Visit"
          ]
        }
      )
    ] }) })
  ] });
}
function getMatchingSitemapEntries(route, sitemapEntries) {
  const hasParams = route.pathParams.length > 0;
  if (!hasParams) {
    return sitemapEntries.filter((e) => {
      try {
        const url = new URL(e.url);
        return url.pathname.endsWith(route.path);
      } catch {
        return false;
      }
    });
  } else {
    const routePattern = escapeRegexForRoutePath(route.path);
    const regex = new RegExp(`${routePattern}$`);
    return sitemapEntries.filter((e) => {
      try {
        const url = new URL(e.url);
        return regex.test(url.pathname);
      } catch {
        return false;
      }
    });
  }
}
function RouteSitemapSection({
  route,
  sitemapEntries
}) {
  const matchingEntries = useMemo(
    () => getMatchingSitemapEntries(route, sitemapEntries),
    [route, sitemapEntries]
  );
  if (matchingEntries.length === 0) return null;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
      "Sitemap Entries",
      /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-1", children: matchingEntries.length })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-lg border overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "URL" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "Last Modified" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Priority" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: matchingEntries.map((entry, idx) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:underline",
              children: /* @__PURE__ */ jsx("code", { className: "font-mono text-xs text-primary truncate block max-w-[400px]", children: entry.url })
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: formatDate(entry.lastModified) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: entry.priority !== void 0 ? entry.priority : "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => window.open(entry.url, "_blank"),
              children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            }
          ) })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: matchingEntries.map((entry, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border p-3 space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "font-mono text-xs text-primary break-all hover:underline",
              children: entry.url
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0 shrink-0",
              onClick: () => window.open(entry.url, "_blank"),
              children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
          entry.lastModified && /* @__PURE__ */ jsx("span", { children: formatDate(entry.lastModified) }),
          entry.priority !== void 0 && /* @__PURE__ */ jsxs("span", { children: [
            "Priority: ",
            entry.priority
          ] })
        ] })
      ] }, idx)) })
    ] })
  ] });
}
function RouteDetail({
  route,
  pluginName,
  sitemapEntries,
  siteBasePath
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    route.meta && (route.meta.title || route.meta.description) && /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: route.meta.title && /* @__PURE__ */ jsx(CardTitle, { className: "text-lg sm:text-xl", children: route.meta.title }) }),
      (route.meta.description || route.meta.tags && route.meta.tags.length > 0) && /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        route.meta.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm sm:text-base", children: route.meta.description }),
        route.meta.tags && route.meta.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: route.meta.tags.map((tag) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: tag }, tag)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsx("div", { className: "font-mono overflow-x-auto", children: /* @__PURE__ */ jsx(HighlightedPath, { path: route.path }) }),
      /* @__PURE__ */ jsx(Badge, { variant: "outline", children: pluginName })
    ] }),
    /* @__PURE__ */ jsx(NavigationForm, { route, siteBasePath }),
    /* @__PURE__ */ jsx(ParametersSection, { params: route.pathParams, title: "Path Parameters" }),
    /* @__PURE__ */ jsx(ParametersSection, { params: route.queryParams, title: "Query Parameters" }),
    /* @__PURE__ */ jsx(RouteSitemapSection, { route, sitemapEntries })
  ] });
}
function getRouteAnchorId(pluginKey, routeKey) {
  return `route-${pluginKey}-${routeKey}`;
}
function SidebarRouteItem({
  route,
  pluginKey,
  onNavigate
}) {
  const anchorId = getRouteAnchorId(pluginKey, route.key);
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${anchorId}`);
    }
    onNavigate?.();
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `#${anchorId}`,
      onClick: handleClick,
      className: "flex items-center w-full justify-start font-mono text-xs h-auto py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
      children: [
        /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-3 w-3 shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "truncate", children: route.path })
      ]
    }
  );
}
function SidebarPluginGroup({
  plugin,
  onNavigate
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "w-full justify-between font-medium h-auto py-2",
        onClick: () => setIsExpanded(!isExpanded),
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
            isExpanded ? /* @__PURE__ */ jsx(FolderOpen, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ jsx(Folder, { className: "mr-2 h-4 w-4" }),
            plugin.name
          ] }),
          /* @__PURE__ */ jsx(
            ChevronRight,
            {
              className: `h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`
            }
          )
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsx("div", { className: "ml-2 space-y-0.5", children: plugin.routes.map((route) => /* @__PURE__ */ jsx(
      SidebarRouteItem,
      {
        route,
        pluginKey: plugin.key,
        onNavigate
      },
      route.key
    )) })
  ] });
}
function SidebarContent({
  schema,
  onNavigate
}) {
  return /* @__PURE__ */ jsx("div", { className: "p-3 space-y-4", children: schema.plugins.map((plugin) => /* @__PURE__ */ jsx(
    SidebarPluginGroup,
    {
      plugin,
      onNavigate
    },
    plugin.key
  )) });
}
function RouteCard({
  pluginName,
  route,
  hasParams,
  staticUrl,
  sitemapCount = 0,
  onSelect
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onSelect, className: "text-left hover:underline", children: /* @__PURE__ */ jsx("code", { className: "font-mono text-sm text-primary break-all", children: route.path }) }),
      staticUrl ? /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0 shrink-0",
          onClick: () => window.open(staticUrl, "_blank"),
          children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" })
        }
      ) : /* @__PURE__ */ jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 w-8 p-0 shrink-0",
          onClick: onSelect,
          children: /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" })
        }
      )
    ] }),
    route.meta?.title && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: route.meta.title }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: pluginName }),
      hasParams && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
        route.pathParams.length,
        " param",
        route.pathParams.length > 1 ? "s" : ""
      ] }),
      sitemapCount > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
        /* @__PURE__ */ jsx(Link2, { className: "h-3 w-3 mr-1" }),
        sitemapCount,
        " in sitemap"
      ] })
    ] })
  ] });
}
function formatDate(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function SitemapSection({
  entries,
  schema
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const getPluginName = (pluginKey) => {
    const plugin = schema.plugins.find((p) => p.key === pluginKey);
    return plugin?.name || pluginKey;
  };
  if (entries.length === 0) return null;
  const displayedEntries = isExpanded ? entries : entries.slice(0, 10);
  const hasMore = entries.length > 10;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 sm:pb-6", children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5" }),
      "Sitemap Entries",
      /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2", children: entries.length })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-lg border overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "URL" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Plugin" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "Last Modified" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: displayedEntries.map((entry, idx) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:underline",
              children: /* @__PURE__ */ jsx("code", { className: "font-mono text-xs text-primary truncate block max-w-[400px]", children: entry.url })
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: getPluginName(entry.pluginKey) }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: formatDate(entry.lastModified) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => window.open(entry.url, "_blank"),
              children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            }
          ) })
        ] }, `${entry.pluginKey}-${idx}`)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: displayedEntries.map((entry, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border p-3 space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "font-mono text-xs text-primary break-all hover:underline",
              children: entry.url
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0 shrink-0",
              onClick: () => window.open(entry.url, "_blank"),
              children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: getPluginName(entry.pluginKey) }),
          entry.lastModified && /* @__PURE__ */ jsx("span", { children: formatDate(entry.lastModified) })
        ] })
      ] }, idx)) }),
      hasMore && /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setIsExpanded(!isExpanded),
          children: isExpanded ? "Show less" : `Show all ${entries.length} entries`
        }
      ) })
    ] })
  ] });
}
function AllRoutesSection({
  schema,
  siteBasePath
}) {
  const scrollToRoute = (pluginKey, routeKey) => {
    const anchorId = getRouteAnchorId(pluginKey, routeKey);
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${anchorId}`);
    }
  };
  const allRoutes = useMemo(() => {
    const routes = [];
    for (const plugin of schema.plugins) {
      for (const route of plugin.routes) {
        const hasParams = route.pathParams.length > 0;
        let sitemapCount = 0;
        if (!hasParams) {
          sitemapCount = plugin.sitemapEntries.filter((e) => {
            try {
              const url = new URL(e.url);
              return url.pathname.endsWith(route.path);
            } catch {
              return false;
            }
          }).length;
        } else {
          const routePattern = escapeRegexForRoutePath(route.path);
          const regex = new RegExp(`${routePattern}$`);
          sitemapCount = plugin.sitemapEntries.filter((e) => {
            try {
              const url = new URL(e.url);
              return regex.test(url.pathname);
            } catch {
              return false;
            }
          }).length;
        }
        routes.push({
          pluginKey: plugin.key,
          pluginName: plugin.name,
          route,
          hasParams,
          staticUrl: hasParams ? null : `${siteBasePath}${route.path}`,
          sitemapCount
        });
      }
    }
    return routes;
  }, [schema, siteBasePath]);
  if (allRoutes.length === 0) return null;
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 sm:pb-6", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "All Routes" }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("div", { className: "hidden md:block rounded-lg border overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Route" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "Plugin" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Params" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Sitemap" }),
          /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: allRoutes.map(
          ({
            pluginKey,
            pluginName,
            route,
            hasParams,
            staticUrl,
            sitemapCount
          }) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => scrollToRoute(pluginKey, route.key),
                  className: "text-left hover:underline",
                  children: /* @__PURE__ */ jsx("code", { className: "font-mono text-sm text-primary", children: route.path })
                }
              ),
              route.meta?.title && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: route.meta.title })
            ] }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: pluginName }) }),
            /* @__PURE__ */ jsx(TableCell, { children: hasParams ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: route.pathParams.length }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: sitemapCount > 0 ? /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              /* @__PURE__ */ jsx(Link2, { className: "h-3 w-3 mr-1" }),
              sitemapCount
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsx(TableCell, { children: staticUrl ? /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 px-2",
                onClick: () => window.open(staticUrl, "_blank"),
                children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
              }
            ) : /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 px-2",
                onClick: () => scrollToRoute(pluginKey, route.key),
                children: /* @__PURE__ */ jsx(Navigation, { className: "h-3 w-3" })
              }
            ) })
          ] }, `${pluginKey}-${route.key}`)
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden space-y-3", children: allRoutes.map(
        ({
          pluginKey,
          pluginName,
          route,
          hasParams,
          staticUrl,
          sitemapCount
        }) => /* @__PURE__ */ jsx(
          RouteCard,
          {
            pluginName,
            route,
            hasParams,
            staticUrl,
            sitemapCount,
            onSelect: () => scrollToRoute(pluginKey, route.key)
          },
          `${pluginKey}-${route.key}`
        )
      ) })
    ] })
  ] });
}
function DocsPageComponent({
  title = "Route Documentation",
  description = "Documentation for all client routes in your application",
  siteBasePath = "/pages"
}) {
  const { data: schema } = useSuspenseQuery({
    queryKey: ROUTE_DOCS_QUERY_KEY,
    queryFn: generateSchema,
    staleTime: Infinity
    // Don't refetch - schema is static for this session
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalRoutes = schema.plugins.reduce(
    (sum, p) => sum + p.routes.length,
    0
  );
  const handleMobileNavigate = () => {
    setMobileMenuOpen(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:block w-72 border-r bg-card shrink-0 sticky top-0 h-screen", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wide", children: "Routes" }) }),
      /* @__PURE__ */ jsx(ScrollArea, { className: "h-[calc(100vh-57px)]", children: /* @__PURE__ */ jsx(SidebarContent, { schema }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wide", children: "Route Docs" }),
      /* @__PURE__ */ jsxs(Sheet, { open: mobileMenuOpen, onOpenChange: setMobileMenuOpen, children: [
        /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
          /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4 mr-2" }),
          "Routes"
        ] }) }),
        /* @__PURE__ */ jsxs(SheetContent, { side: "left", className: "w-80 p-0", children: [
          /* @__PURE__ */ jsx(SheetHeader, { className: "p-4 border-b", children: /* @__PURE__ */ jsx(SheetTitle, { className: "text-left text-sm text-muted-foreground uppercase tracking-wide", children: "Routes" }) }),
          /* @__PURE__ */ jsx(ScrollArea, { className: "h-[calc(100vh-57px)]", children: /* @__PURE__ */ jsx(
            SidebarContent,
            {
              schema,
              onNavigate: handleMobileNavigate
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto pt-16 md:pt-0", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 text-sm sm:text-base", children: description })
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      totalRoutes > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
            schema.plugins.length,
            " plugins"
          ] }),
          /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
            totalRoutes,
            " routes"
          ] }),
          schema.allSitemapEntries.length > 0 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", children: [
            /* @__PURE__ */ jsx(Globe, { className: "h-3 w-3 mr-1" }),
            schema.allSitemapEntries.length,
            " sitemap entries"
          ] })
        ] }),
        /* @__PURE__ */ jsx(AllRoutesSection, { schema, siteBasePath }),
        schema.plugins.map((plugin) => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-4", children: [
            /* @__PURE__ */ jsx(Folder, { className: "h-6 w-6 text-muted-foreground" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: plugin.name }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
              plugin.routes.length,
              " routes"
            ] })
          ] }),
          plugin.routes.map((route) => /* @__PURE__ */ jsx(
            "div",
            {
              id: getRouteAnchorId(plugin.key, route.key),
              className: "scroll-mt-20 md:scroll-mt-4",
              children: /* @__PURE__ */ jsx(
                RouteDetail,
                {
                  route,
                  pluginName: plugin.name,
                  sitemapEntries: plugin.sitemapEntries,
                  siteBasePath
                }
              )
            },
            route.key
          )),
          /* @__PURE__ */ jsx(Separator, {})
        ] }, plugin.key)),
        /* @__PURE__ */ jsx(
          SitemapSection,
          {
            entries: schema.allSitemapEntries,
            schema
          }
        )
      ] }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-8 sm:py-12 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No documented routes found." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Add client plugins with routes to see documentation here." })
      ] }) })
    ] }) }) })
  ] });
}
export {
  DocsPageComponent
};
