import { A as AuthUIContext } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { c as cn, S as Skeleton } from "./chunk-KS7QMNEN-DP7ssmzE.mjs";
import { useContext, useEffect, useMemo } from "react";
import { A as Avatar$1, a as AvatarImage$1, b as AvatarFallback$1 } from "../_libs/radix-ui__react-avatar.mjs";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { aG as Building } from "../_libs/lucide-react.mjs";
function useAuthenticate(options) {
  const { authView = "SIGN_IN", enabled = true } = {};
  const {
    hooks: { useSession },
    basePath,
    viewPaths,
    replace
  } = useContext(AuthUIContext);
  const { data, isPending, error, refetch } = useSession();
  const sessionData = data;
  useEffect(() => {
    if (!enabled || isPending || sessionData) return;
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get("redirectTo") || window.location.pathname + window.location.search;
    replace(
      `${basePath}/${viewPaths[authView]}?redirectTo=${encodeURIComponent(redirectTo)}`
    );
  }, [
    isPending,
    sessionData,
    basePath,
    viewPaths,
    replace,
    authView,
    enabled
  ]);
  return {
    data: sessionData,
    user: sessionData == null ? void 0 : sessionData.user,
    isPending,
    error,
    refetch
  };
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Avatar$1,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarImage$1,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarFallback$1,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function OrganizationLogo({
  className,
  classNames,
  isPending,
  size,
  organization,
  localization: propLocalization,
  ...props
}) {
  const { localization: contextLocalization, avatar } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  const name = organization == null ? void 0 : organization.name;
  const src = organization == null ? void 0 : organization.logo;
  if (isPending) {
    return /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: cn(
          "shrink-0 rounded-full",
          size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
          className,
          classNames == null ? void 0 : classNames.base,
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    Avatar,
    {
      className: cn(
        "bg-muted",
        size === "sm" ? "size-6" : size === "lg" ? "size-10" : size === "xl" ? "size-12" : "size-8",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        (avatar == null ? void 0 : avatar.Image) ? /* @__PURE__ */ jsx(
          avatar.Image,
          {
            alt: name || (localization == null ? void 0 : localization.ORGANIZATION),
            className: classNames == null ? void 0 : classNames.image,
            src: src || ""
          }
        ) : /* @__PURE__ */ jsx(
          AvatarImage,
          {
            alt: name || (localization == null ? void 0 : localization.ORGANIZATION),
            className: classNames == null ? void 0 : classNames.image,
            src: src || void 0
          }
        ),
        /* @__PURE__ */ jsx(
          AvatarFallback,
          {
            className: cn("text-foreground", classNames == null ? void 0 : classNames.fallback),
            delayMs: src ? 600 : void 0,
            children: /* @__PURE__ */ jsx(
              Building,
              {
                className: cn("size-[50%]", classNames == null ? void 0 : classNames.fallbackIcon)
              }
            )
          }
        )
      ]
    }
  );
}
function OrganizationCellView({
  className,
  classNames,
  isPending,
  size,
  organization,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...propLocalization };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 truncate",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsx(
          OrganizationLogo,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            localization,
            organization,
            size
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex flex-col truncate text-left leading-tight",
              classNames == null ? void 0 : classNames.content
            ),
            children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                Skeleton,
                {
                  className: cn(
                    "max-w-full",
                    size === "lg" ? "h-4.5 w-32" : "h-3.5 w-24",
                    classNames == null ? void 0 : classNames.title,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsx(
                Skeleton,
                {
                  className: cn(
                    "mt-1.5 max-w-full",
                    size === "lg" ? "h-3.5 w-24" : "h-3 w-16",
                    classNames == null ? void 0 : classNames.subtitle,
                    classNames == null ? void 0 : classNames.skeleton
                  )
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "truncate font-semibold",
                    size === "lg" ? "text-base" : "text-sm",
                    classNames == null ? void 0 : classNames.title
                  ),
                  children: (organization == null ? void 0 : organization.name) || (localization == null ? void 0 : localization.ORGANIZATION)
                }
              ),
              size !== "sm" && (organization == null ? void 0 : organization.slug) && /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: organization.slug
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
export {
  Avatar as A,
  OrganizationCellView as O,
  OrganizationLogo as a,
  AvatarImage as b,
  AvatarFallback as c,
  useAuthenticate as u
};
