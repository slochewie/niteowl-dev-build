import { jsx, jsxs } from "react/jsx-runtime";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useState, useMemo } from "react";
import { Q as QueryClientProvider } from "./QueryClientProvider-BNL98aJf.mjs";
import { S as SteppedAutoForm } from "./stepped-auto-form-mEkHGDwr.mjs";
import { b as buildFieldConfigFromJsonSchema } from "./index-zHebWDbP.mjs";
import { $ as Route$3, i as getOrCreateQueryClient, H as StackProvider, l as usePluginOverrides, _ as formSchemaToZod, S as Skeleton } from "./router-qu_5GP1h.mjs";
import { F as FORM_BUILDER_LOCALIZATION, u as useFormBySlug, a as useSubmitForm } from "./index-Dsk9Dwgo.mjs";
import "./separator-dOz0oFNG.mjs";
import "./index-CpOdxbMb.mjs";
import "react-dom";
import "./form-Cx2oXTTw.mjs";
import "./accordion-DJKZ9YSV.mjs";
import "./index-BUGN0YTJ.mjs";
import "./index-BI_-Kgeu.mjs";
import "./checkbox-DYzrULg_.mjs";
import "./popover-I-2hrCQX.mjs";
import "./Combination-C2ce2hnQ.mjs";
import "./select-DRbaYjS4.mjs";
import "./index-x6nDyT23.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import { h as CircleAlert, L as LoaderCircle, v as CircleCheckBig } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
import "../_libs/react-hook-form.mjs";
import "../_libs/hookform__resolvers.mjs";
import "./input-Ds7nu5GX.mjs";
import "./index-S7rpP7KI.mjs";
import "./index-rdulpQ7P.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "./index-KZ0RSJRl.mjs";
import "./index-CshadhlS.mjs";
import "./switch-DIDzzBgm.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "./textarea-ClKgIhzC.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "./label-DWXXj0lo.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "./index-IXOTxK3N.mjs";
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
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-destructive/10 p-3 mb-4", children: /* @__PURE__ */ jsx(CircleAlert, { className: "h-6 w-6 text-destructive" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Failed to load form" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: error.message || "An unexpected error occurred" })
  ] });
}
function DefaultSuccessComponent({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4", children: /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }),
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
  } = Route$3.useParams();
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
    /* @__PURE__ */ jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading form..." })
  ] });
}
function FormErrorState({
  error
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-4 text-center", children: [
    /* @__PURE__ */ jsx(CircleAlert, { className: "h-12 w-12 text-destructive" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Form not found" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: error.message || "The form you're looking for doesn't exist or is no longer available." })
    ] })
  ] });
}
export {
  FormDemoPage as component
};
