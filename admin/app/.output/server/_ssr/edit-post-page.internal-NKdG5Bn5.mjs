import { jsxs, jsx } from "react/jsx-runtime";
import { E as EditPostForm, c as createFillBlogFormHandler } from "./fill-blog-form-handler-DOfzPQuG.mjs";
import { l as usePluginOverrides, D as useBasePath, E as PageWrapper, F as PageHeader, A as BLOG_LOCALIZATION } from "./router-qu_5GP1h.mjs";
import { u as useRouteLifecycle } from "./use-route-lifecycle-CK7wPPTX.mjs";
import { u as useRegisterPageAIContext } from "./page-ai-context-C_8XrHKf.mjs";
import { useRef, useCallback } from "react";
import "./form-Cx2oXTTw.mjs";
import "./useBaseQuery-Bzp30GCu.mjs";
import "./QueryClientProvider-BNL98aJf.mjs";
import "./alert-dialog-uhUcP2mH.mjs";
import "../_libs/sonner.mjs";
import "./multi-select-CD_n40D7.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import "./input-Ds7nu5GX.mjs";
import "./switch-DIDzzBgm.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "react-dom";
import "../_libs/radix-ui__react-slot.mjs";
import "./textarea-ClKgIhzC.mjs";
import "./blog-hooks-gv3MttsW.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./useQuery-bnZbjTSo.mjs";
import "./useSuspenseQuery-CxR8OJs1.mjs";
import "./useSuspenseInfiniteQuery-BNot5GKT.mjs";
import "./infiniteQueryObserver-CMC81Kyb.mjs";
import "./useMutation-C_XiO15s.mjs";
import "./useInfiniteQuery-BegVgW11.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/hookform__resolvers.mjs";
import "../_libs/react-hook-form.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/zod.mjs";
import "./label-DWXXj0lo.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "./index-S7rpP7KI.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
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
import "../_libs/cmdk.mjs";
import "./badge-CGoI1f31.mjs";
import "./command-8DCQ5FSU.mjs";
import "./dialog-B4u5EdHX.mjs";
import "./use-debounce-B6NKG3k-.mjs";
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
function EditPostPage({ slug }) {
  const overrides = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { localization, navigate } = overrides;
  const basePath = useBasePath();
  useRouteLifecycle({
    routeName: "editPost",
    context: {
      path: `/blog/${slug}/edit`,
      params: { slug },
      isSSR: typeof window === "undefined"
    },
    overrides,
    beforeRenderHook: (overrides2, context) => {
      if (overrides2.onBeforeEditPostPageRendered) {
        return overrides2.onBeforeEditPostPageRendered(slug, context);
      }
      return true;
    }
  });
  const formRef = useRef(null);
  const handleFormReady = useCallback((form) => {
    formRef.current = form;
  }, []);
  useRegisterPageAIContext({
    routeName: "blog-edit-post",
    pageDescription: `User is editing a blog post (slug: "${slug}") in the admin editor.`,
    suggestions: [
      "Improve this post's title",
      "Rewrite the intro paragraph",
      "Suggest better tags"
    ],
    clientTools: {
      fillBlogForm: createFillBlogFormHandler(
        formRef,
        "Form updated successfully"
      )
    }
  });
  const handleClose = () => {
    navigate(`${basePath}/blog`);
  };
  const handleSuccess = (post) => {
    navigate(`${basePath}/blog/${post.slug}`);
  };
  const handleDelete = () => {
    navigate(`${basePath}/blog`);
  };
  return /* @__PURE__ */ jsxs(PageWrapper, { className: "gap-6", testId: "edit-post-page", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: localization.BLOG_POST_EDIT_TITLE,
        description: localization.BLOG_POST_EDIT_DESCRIPTION
      }
    ),
    /* @__PURE__ */ jsx(
      EditPostForm,
      {
        postSlug: slug,
        onClose: handleClose,
        onSuccess: handleSuccess,
        onDelete: handleDelete,
        onFormReady: handleFormReady
      }
    )
  ] });
}
export {
  EditPostPage
};
