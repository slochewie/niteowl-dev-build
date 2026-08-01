import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function getLocalizedError({
  error,
  localization,
  localizeErrors = true
}) {
  var _a;
  const DEFAULT_ERROR_MESSAGE = "Request failed";
  if (!localizeErrors) {
    if (error == null ? void 0 : error.message) return error.message;
    if ((_a = error == null ? void 0 : error.error) == null ? void 0 : _a.message) return error.error.message;
    return DEFAULT_ERROR_MESSAGE;
  }
  if (typeof error === "string") {
    if (localization == null ? void 0 : localization[error])
      return localization[error];
  }
  if (error == null ? void 0 : error.error) {
    if (error.error.code) {
      const errorCode = error.error.code;
      if (localization == null ? void 0 : localization[errorCode]) return localization[errorCode];
    }
    return error.error.message || error.error.code || error.error.statusText || (localization == null ? void 0 : localization.REQUEST_FAILED);
  }
  return (error == null ? void 0 : error.message) || (localization == null ? void 0 : localization.REQUEST_FAILED) || DEFAULT_ERROR_MESSAGE;
}
function getSearchParam(paramName) {
  return typeof window !== "undefined" ? new URLSearchParams(window.location.search).get(paramName) : null;
}
function getViewByPath(viewPaths, path) {
  for (const key in viewPaths) {
    if (viewPaths[key] === path) {
      return key;
    }
  }
}
function getPasswordSchema(passwordValidation, localization) {
  let schema = z.string().min(1, {
    message: localization == null ? void 0 : localization.PASSWORD_REQUIRED
  });
  if (passwordValidation == null ? void 0 : passwordValidation.minLength) {
    schema = schema.min(passwordValidation.minLength, {
      message: localization == null ? void 0 : localization.PASSWORD_TOO_SHORT
    });
  }
  if (passwordValidation == null ? void 0 : passwordValidation.maxLength) {
    schema = schema.max(passwordValidation.maxLength, {
      message: localization == null ? void 0 : localization.PASSWORD_TOO_LONG
    });
  }
  if (passwordValidation == null ? void 0 : passwordValidation.regex) {
    schema = schema.regex(passwordValidation.regex, {
      message: localization == null ? void 0 : localization.INVALID_PASSWORD
    });
  }
  return schema;
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function DefaultError({ error, reset }) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Something went wrong!" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: error.message || "An unexpected error occurred" }),
      error.digest && /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
        "Error ID: ",
        error.digest
      ] }),
      reset && /* @__PURE__ */ jsx(Button, { onClick: reset, className: "w-full", children: "Try again" })
    ] })
  ] }) });
}
function NotFoundPage() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "404 - Page Not Found" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "The page you're looking for doesn't exist." }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            window.location.href = "/";
          },
          className: "w-full",
          children: "Go Home"
        }
      )
    ] })
  ] }) });
}
function PageLoading() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-48" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" })
    ] })
  ] }) });
}
export {
  Button as B,
  CardContent as C,
  DefaultError as D,
  NotFoundPage as N,
  PageLoading as P,
  Skeleton as S,
  Card as a,
  getPasswordSchema as b,
  cn as c,
  getLocalizedError as d,
  CardHeader as e,
  CardTitle as f,
  getViewByPath as g,
  CardDescription as h,
  CardFooter as i,
  getSearchParam as j,
  isValidEmail as k
};
