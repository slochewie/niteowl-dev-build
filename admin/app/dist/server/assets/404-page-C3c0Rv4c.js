import { jsxs, jsx } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { B as Button, l as usePluginOverrides, D as useBasePath } from "./router-DU5jczZR.js";
function DefaultError({ error, resetErrorBoundary }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-destructive/10 p-4 mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-8 w-8 text-destructive" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: (error instanceof Error ? error.message : void 0) || "An unexpected error occurred" }),
    resetErrorBoundary && /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: resetErrorBoundary, children: "Try again" })
  ] });
}
function NotFoundPage() {
  const { navigate, Link } = usePluginOverrides("cms");
  const basePath = useBasePath();
  const LinkComponent = Link || "a";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-muted-foreground mb-4", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-2", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-sm", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(LinkComponent, { href: `${basePath}/cms`, children: "Back to CMS" }) })
  ] });
}
export {
  DefaultError as D,
  NotFoundPage as N
};
