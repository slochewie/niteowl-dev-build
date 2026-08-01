import { jsxs, jsx } from "react/jsx-runtime";
import { c as createFillBlogFormHandler, A as AddPostForm } from "./fill-blog-form-handler-V3YzsvFE.js";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, D as useBasePath, E as PageWrapper, F as PageHeader } from "./router-DU5jczZR.js";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.js";
import { u as useRegisterPageAIContext } from "./page-ai-context-C_8XrHKf.js";
import { useRef, useCallback } from "react";
import "./form-h3RPcnMA.js";
import "@radix-ui/react-slot";
import "react-hook-form";
import "./label-BdRDX7M-.js";
import "@radix-ui/react-label";
import "./input-Db1DsNBl.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "./textarea-DS3tfP2l.js";
import "./blog-hooks-lyVerMe2.js";
import "lucide-react";
import "class-variance-authority";
import "./useQuery-CQBkpW0a.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
import "./useInfiniteQuery-DU3bok0g.js";
import "./alert-dialog-CEYtu72k.js";
import "./index-S7rpP7KI.js";
import "@radix-ui/react-dialog";
import "@hookform/resolvers/zod";
import "sonner";
import "./multi-select-Dwrj6IWT.js";
import "cmdk";
import "./badge-DFvO9DkX.js";
import "./command-5HTd1Hbk.js";
import "./dialog-Chz0Zs_g.js";
import "./use-debounce-B6NKG3k-.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
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
function NewPostPage() {
  const overrides = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { localization, navigate } = overrides;
  const basePath = useBasePath();
  useRouteLifecycle({
    routeName: "newPost",
    context: {
      path: "/blog/new",
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeNewPostPageRendered) {
        return overrides2.onBeforeNewPostPageRendered(context);
      }
      return true;
    }
  });
  const formRef = useRef(null);
  const handleFormReady = useCallback((form) => {
    formRef.current = form;
  }, []);
  useRegisterPageAIContext({
    routeName: "blog-new-post",
    pageDescription: "User is creating a new blog post in the admin editor. IMPORTANT: When asked to write, draft, or create a blog post, you MUST call the fillBlogForm tool to populate the form fields directly — do NOT just output the text in your response.",
    suggestions: [
      "Write a post about AI trends",
      "Draft an intro paragraph",
      "Suggest 5 tags for this post"
    ],
    clientTools: {
      fillBlogForm: createFillBlogFormHandler(
        formRef,
        "Form filled successfully"
      )
    }
  });
  const handleClose = () => {
    navigate(`${basePath}/blog`);
  };
  const handleSuccess = (post) => {
    if (post.published) {
      navigate(`${basePath}/blog`);
    } else {
      navigate(`${basePath}/blog/drafts`);
    }
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { className: "gap-6", testId: "new-post-page", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: localization.BLOG_POST_ADD_TITLE,
        description: localization.BLOG_POST_ADD_DESCRIPTION
      }
    ),
    /* @__PURE__ */ jsx(
      AddPostForm,
      {
        onClose: handleClose,
        onSuccess: handleSuccess,
        onFormReady: handleFormReady
      }
    )
  ] });
}
export {
  NewPostPage
};
