import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Q as QueryClientProvider } from "./QueryClientProvider-BNL98aJf.js";
import { S as SteppedAutoForm } from "./stepped-auto-form-CP6ms7XR.js";
import { b as buildFieldConfigFromJsonSchema } from "./index-BCS2IiYe.js";
import { l as usePluginOverrides, _ as formSchemaToZod, S as Skeleton, $ as Route, i as getOrCreateQueryClient, H as StackProvider } from "./router-DU5jczZR.js";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { e as useFormBySlug, f as useSubmitForm, F as FORM_BUILDER_LOCALIZATION } from "./index-CRLEFUXL.js";
import "zod";
import "./separator-2KKe-9Ln.js";
import "./index-CpOdxbMb.js";
import "react-dom";
import "@radix-ui/react-slot";
import "./form-h3RPcnMA.js";
import "react-hook-form";
import "./label-BdRDX7M-.js";
import "@radix-ui/react-label";
import "@hookform/resolvers/zod";
import "./accordion-CYnXr6WS.js";
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "./index-BI_-Kgeu.js";
import "./checkbox-Ct6-tiwE.js";
import "./index-CshadhlS.js";
import "date-fns";
import "date-fns/locale";
import "./popover-DQgN5wJE.js";
import "./Combination-C2ce2hnQ.js";
import "./select-B_yf4oCD.js";
import "./index-IXOTxK3N.js";
import "./input-Db1DsNBl.js";
import "./index-x6nDyT23.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "./textarea-DS3tfP2l.js";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
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
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
function DefaultLoadingComponent() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" })
  ] });
}
function DefaultErrorComponent({ error }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-destructive/10 p-3 mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6 text-destructive" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Failed to load form" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: error.message || "An unexpected error occurred" })
  ] });
}
function DefaultSuccessComponent({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Form Submitted" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: message })
  ] });
}
function FormRenderer$1({
  slug,
  onSuccess,
  onError,
  fieldComponents: propFieldComponents,
  successMessage: propSuccessMessage,
  submitButtonText,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
  className
}) {
  const { fieldComponents: overrideFieldComponents, localization } = usePluginOverrides("form-builder", {
    localization: FORM_BUILDER_LOCALIZATION
  });
  const loc = localization || FORM_BUILDER_LOCALIZATION;
  const { form, isLoading, error } = useFormBySlug(slug);
  const submitMutation = useSubmitForm(slug);
  const [submitted, setSubmitted] = useState(false);
  const [finalSuccessMessage, setFinalSuccessMessage] = useState(
    null
  );
  const mergedFieldComponents = useMemo(
    () => ({
      ...overrideFieldComponents,
      ...propFieldComponents
    }),
    [overrideFieldComponents, propFieldComponents]
  );
  const { zodSchema, fieldConfig } = useMemo(() => {
    if (!form?.schema) {
      return { zodSchema: null, fieldConfig: {} };
    }
    try {
      const parsedSchema = JSON.parse(form.schema);
      const zod = formSchemaToZod(parsedSchema);
      const config = buildFieldConfigFromJsonSchema(
        parsedSchema,
        mergedFieldComponents
      );
      return { zodSchema: zod, fieldConfig: config };
    } catch {
      return { zodSchema: null, fieldConfig: {} };
    }
  }, [form?.schema, mergedFieldComponents]);
  const handleSubmit = async (data) => {
    try {
      const result = await submitMutation.mutateAsync({ data });
      const message = propSuccessMessage || result.form.successMessage || "Thank you for your submission!";
      setFinalSuccessMessage(message);
      setSubmitted(true);
      onSuccess?.(result);
      if (result.form.redirectUrl) {
        window.location.href = result.form.redirectUrl;
        return;
      }
    } catch (err) {
      onError?.(err);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(LoadingComponent, {}) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(ErrorComponent, { error }) });
  }
  if (!form) {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(ErrorComponent, { error: new Error("Form not found") }) });
  }
  if (form.status !== "active") {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(
      ErrorComponent,
      {
        error: new Error("This form is not currently accepting submissions")
      }
    ) });
  }
  if (!zodSchema) {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(ErrorComponent, { error: new Error("Failed to parse form schema") }) });
  }
  if (submitted && finalSuccessMessage) {
    return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(DefaultSuccessComponent, { message: finalSuccessMessage }) });
  }
  return /* @__PURE__ */ jsx("div", { className, "data-testid": "form-renderer", children: /* @__PURE__ */ jsx(
    SteppedAutoForm,
    {
      formSchema: zodSchema,
      fieldConfig,
      onSubmit: (values) => handleSubmit(values),
      isSubmitting: submitMutation.isPending,
      submitButtonText: submitButtonText || loc.FORM_BUILDER_BUTTON_SUBMIT
    }
  ) });
}
const FormRenderer = FormRenderer$1;
const getBaseURL = () => typeof window !== "undefined" ? window.location.origin : process.env.VITE_PUBLIC_SITE_URL || process.env.BASE_URL || "http://localhost:3000";
function FormDemoPage() {
  const {
    slug
  } = Route.useParams();
  const navigate = useNavigate();
  const [queryClient] = useState(() => getOrCreateQueryClient());
  const baseURL = getBaseURL();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(StackProvider, { basePath: "", overrides: {
    "form-builder": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      refresh: () => window.location.reload(),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    }
  }, children: /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-card rounded-lg border p-6 shadow-sm", children: /* @__PURE__ */ jsx(FormRenderer, { slug, onSuccess: (submission) => {
    console.log("Form submitted:", submission);
  }, onError: (error) => {
    console.error("Form error:", error);
  }, LoadingComponent: FormLoadingState, ErrorComponent: FormErrorState, className: "space-y-6" }) }) }) }) }) });
}
function FormLoadingState() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-4", children: [
    /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading form..." })
  ] });
}
function FormErrorState({
  error
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-4 text-center", children: [
    /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-destructive" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Form not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: error.message || "The form you're looking for doesn't exist or is no longer available." })
    ] })
  ] });
}
export {
  FormDemoPage as component
};
