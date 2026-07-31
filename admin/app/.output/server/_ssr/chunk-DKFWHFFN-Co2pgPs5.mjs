import { u as useAuthenticate, O as OrganizationCellView } from "./chunk-XPGLXIJB-D0r-Tyqx.mjs";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { j as getSearchParam, b as Card, e as CardHeader, S as Skeleton, c as cn, C as CardContent, f as CardTitle, h as CardDescription, B as Button, g as getLocalizedError } from "./chunk-KS7QMNEN-DP7ssmzE.mjs";
import { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { L as LoaderCircle, X, f as Check } from "../_libs/lucide-react.mjs";
function AcceptInvitationCard({
  className,
  classNames,
  localization: localizationProp
}) {
  const {
    localization: contextLocalization,
    redirectTo,
    replace,
    toast
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: sessionData } = useAuthenticate();
  const [invitationId, setInvitationId] = useState(null);
  useEffect(() => {
    const invitationIdParam = getSearchParam("invitationId");
    if (!invitationIdParam) {
      toast({
        variant: "error",
        message: localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
      return;
    }
    setInvitationId(invitationIdParam);
  }, [localization.INVITATION_NOT_FOUND, toast, replace, redirectTo]);
  if (!sessionData || !invitationId) {
    return /* @__PURE__ */ jsx(
      AcceptInvitationSkeleton,
      {
        className,
        classNames
      }
    );
  }
  return /* @__PURE__ */ jsx(
    AcceptInvitationContent,
    {
      className,
      classNames,
      localization,
      invitationId
    }
  );
}
function AcceptInvitationContent({
  className,
  classNames,
  localization: localizationProp,
  invitationId
}) {
  var _a;
  const {
    authClient,
    hooks: { useInvitation },
    localization: contextLocalization,
    organization,
    redirectTo,
    replace,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const isProcessing = isRejecting || isAccepting;
  const { data: invitation, isPending } = useInvitation({
    query: {
      id: invitationId
    }
  });
  const getRedirectTo = useCallback(
    () => getSearchParam("redirectTo") || redirectTo,
    [redirectTo]
  );
  useEffect(() => {
    if (isPending || !invitationId) return;
    if (!invitation) {
      toast({
        variant: "error",
        message: localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
      return;
    }
    if (invitation.status !== "pending" || new Date(invitation.expiresAt) < /* @__PURE__ */ new Date()) {
      toast({
        variant: "error",
        message: new Date(invitation.expiresAt) < /* @__PURE__ */ new Date() ? localization.INVITATION_EXPIRED : localization.INVITATION_NOT_FOUND
      });
      replace(redirectTo);
    }
  }, [
    invitation,
    isPending,
    invitationId,
    localization,
    toast,
    replace,
    redirectTo
  ]);
  const acceptInvitation = async () => {
    setIsAccepting(true);
    try {
      await authClient.organization.acceptInvitation({
        invitationId,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.INVITATION_ACCEPTED || "Invitation accepted"
      });
      replace(getRedirectTo());
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsAccepting(false);
    }
  };
  const rejectInvitation = async () => {
    setIsRejecting(true);
    try {
      await authClient.organization.rejectInvitation({
        invitationId,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.INVITATION_REJECTED
      });
      replace(redirectTo);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsRejecting(false);
    }
  };
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organization == null ? void 0 : organization.customRoles) || []];
  const roleLabel = ((_a = roles.find((r) => r.role === (invitation == null ? void 0 : invitation.role))) == null ? void 0 : _a.label) || (invitation == null ? void 0 : invitation.role);
  if (!invitation)
    return /* @__PURE__ */ jsx(
      AcceptInvitationSkeleton,
      {
        className,
        classNames
      }
    );
  return /* @__PURE__ */ jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsxs(
      CardHeader,
      {
        className: cn(
          "justify-items-center text-center",
          classNames == null ? void 0 : classNames.header
        ),
        children: [
          /* @__PURE__ */ jsx(
            CardTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.ACCEPT_INVITATION
            }
          ),
          /* @__PURE__ */ jsx(
            CardDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.ACCEPT_INVITATION_DESCRIPTION
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      CardContent,
      {
        className: cn(
          "flex flex-col gap-6 truncate",
          classNames == null ? void 0 : classNames.content
        ),
        children: [
          /* @__PURE__ */ jsxs(Card, { className: cn("flex-row items-center p-4"), children: [
            /* @__PURE__ */ jsx(
              OrganizationCellView,
              {
                organization: {
                  id: invitation.organizationId,
                  name: invitation.organizationName,
                  slug: invitation.organizationSlug,
                  logo: invitation.organizationLogo,
                  createdAt: /* @__PURE__ */ new Date()
                },
                localization
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "ml-auto text-muted-foreground text-sm", children: roleLabel })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                onClick: rejectInvitation,
                disabled: isProcessing,
                children: [
                  isRejecting ? /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsx(X, {}),
                  localization.REJECT
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                onClick: acceptInvitation,
                disabled: isProcessing,
                children: [
                  isAccepting ? /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Check, {}),
                  localization.ACCEPT
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
var AcceptInvitationSkeleton = ({
  className,
  classNames,
  localization
}) => {
  return /* @__PURE__ */ jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsxs(
      CardHeader,
      {
        className: cn("justify-items-center", classNames == null ? void 0 : classNames.header),
        children: [
          /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn(
                "my-1 h-5 w-full max-w-32 md:h-5.5 md:w-40",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn(
                "my-0.5 h-3 w-full max-w-56 md:h-3.5 md:w-64",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      CardContent,
      {
        className: cn(
          "flex flex-col gap-6 truncate",
          classNames == null ? void 0 : classNames.content
        ),
        children: [
          /* @__PURE__ */ jsxs(Card, { className: cn("flex-row items-center p-4"), children: [
            /* @__PURE__ */ jsx(
              OrganizationCellView,
              {
                isPending: true,
                localization
              }
            ),
            /* @__PURE__ */ jsx(Skeleton, { className: "mt-0.5 ml-auto h-4 w-full max-w-14 shrink-2" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-full" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-full" })
          ] })
        ]
      }
    )
  ] });
};
export {
  AcceptInvitationCard as A
};
