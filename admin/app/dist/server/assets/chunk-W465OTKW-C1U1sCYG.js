import { D as Drawer, a as DrawerTrigger, b as DrawerContent, c as DrawerHeader, d as DrawerTitle, A as ApiKeysCard, S as SettingsCard, e as SettingsCellSkeleton, m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription, r as DialogFooter, f as SettingsCardHeader, g as SettingsCardFooter, U as UserView, L as LeaveOrganizationDialog, h as Select, i as SelectTrigger, j as SelectValue, k as SelectContent, l as SelectItem } from "./chunk-2YWC3WKF-BkWGzDxB.js";
import { L as Label2, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, F as Form, d as FormField, e as FormItem, h as FormLabel, f as FormControl, I as Input, g as FormMessage, U as UserAvatar, r as resizeAndCropImage, i as fileToBase64 } from "./chunk-52PGTSBA-DxrPz66P.js";
import { u as useAuthenticate, a as OrganizationLogo, O as OrganizationCellView } from "./chunk-XPGLXIJB-gK-XK5gU.js";
import { A as AuthUIContext, c as useCurrentOrganization, u as useIsHydrated, a as useLang } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { g as getViewByPath, B as Button, c as cn, C as CardContent, a as Card, S as Skeleton, d as getLocalizedError, e as CardHeader, f as CardTitle } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuIcon, UsersIcon, EllipsisIcon, Edit, Archive, Loader2, UserCogIcon, Users, UserXIcon, XIcon, UploadCloudIcon, Trash2Icon } from "lucide-react";
import { useContext, useMemo, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
function CreateTeamDialog({
  classNames,
  localization: localizationProp,
  refetch,
  organizationId,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    localizeErrors,
    toast
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const formSchema = z.object({
    name: z.string().min(1, {
      message: `${localization.TEAM_NAME} ${localization.IS_REQUIRED}`
    }).max(64, {
      message: localization.TEAM_NAME_INSTRUCTIONS
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  async function onSubmit({ name }) {
    if (!organizationId) return;
    try {
      await authClient.organization.createTeam({
        name,
        organizationId,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      toast({
        variant: "success",
        message: localization.CREATE_TEAM_SUCCESS
      });
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(DialogContent, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
      /* @__PURE__ */ jsx(
        DialogTitle,
        {
          className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
          children: localization.CREATE_TEAM
        }
      ),
      /* @__PURE__ */ jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.TEAM_NAME_DESCRIPTION
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
      "form",
      {
        method: "POST",
        onSubmit: form.handleSubmit(onSubmit),
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: localization.TEAM_NAME }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: localization.TEAM_NAME_PLACEHOLDER,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                children: localization.CANCEL
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                disabled: isSubmitting || !organizationId,
                children: [
                  isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                  localization.CREATE_TEAM
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function DeleteOrganizationDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  organization,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    account: accountOptions,
    hooks: { useListOrganizations },
    localization: contextLocalization,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganizations } = useListOrganizations();
  const formSchema = z.object({
    slug: z.string().min(1, { message: localization.SLUG_REQUIRED }).refine((val) => val === organization.slug, {
      message: localization.SLUG_DOES_NOT_MATCH
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: ""
    }
  });
  const { isSubmitting } = form.formState;
  const deleteOrganization = async () => {
    try {
      await authClient.organization.delete({
        organizationId: organization.id,
        fetchOptions: { throw: true }
      });
      await (refetchOrganizations == null ? void 0 : refetchOrganizations());
      toast({
        variant: "success",
        message: localization.DELETE_ORGANIZATION_SUCCESS
      });
      navigate(
        `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths.ORGANIZATIONS}`
      );
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: cn("sm:max-w-md", (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization == null ? void 0 : localization.DELETE_ORGANIZATION
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Card, { className: cn("my-2 flex-row p-4", classNames == null ? void 0 : classNames.cell), children: /* @__PURE__ */ jsx(
          OrganizationCellView,
          {
            organization,
            localization
          }
        ) }),
        /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
          "form",
          {
            method: "POST",
            onSubmit: form.handleSubmit(deleteOrganization),
            className: "grid gap-6",
            children: [
              /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "slug",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                      localization == null ? void 0 : localization.DELETE_ORGANIZATION_INSTRUCTIONS,
                      /* @__PURE__ */ jsx("span", { className: "font-bold", children: organization.slug })
                    ] }),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        placeholder: organization.slug,
                        className: classNames == null ? void 0 : classNames.input,
                        autoComplete: "off",
                        ...field
                      }
                    ) }),
                    /* @__PURE__ */ jsx(
                      FormMessage,
                      {
                        className: classNames == null ? void 0 : classNames.error
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "button",
                    variant: "secondary",
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.secondaryButton
                    ),
                    onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                    children: localization.CANCEL
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.destructiveButton
                    ),
                    disabled: isSubmitting,
                    variant: "destructive",
                    type: "submit",
                    children: [
                      isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                      localization == null ? void 0 : localization.DELETE_ORGANIZATION
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  ) });
}
function DeleteOrganizationCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization)
    return /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        description: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION,
        isPending: true,
        title: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        variant: "destructive"
      }
    );
  return /* @__PURE__ */ jsx(
    DeleteOrganizationForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function DeleteOrganizationForm({
  className,
  classNames,
  localization: localizationProp,
  organization
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission }
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: hasPermission, isPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["delete"]
    }
  });
  const [showDialog, setShowDialog] = useState(false);
  if (!(hasPermission == null ? void 0 : hasPermission.success)) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        description: localization == null ? void 0 : localization.DELETE_ORGANIZATION_DESCRIPTION,
        isPending,
        title: localization == null ? void 0 : localization.DELETE_ORGANIZATION,
        variant: "destructive",
        action: () => setShowDialog(true)
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteOrganizationDialog,
      {
        classNames,
        localization,
        open: showDialog,
        onOpenChange: setShowDialog,
        organization
      }
    )
  ] });
}
function DeleteTeamDialog({
  classNames,
  team,
  localization: localizationProp,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({
      ...contextLocalization,
      ...localizationProp
    }),
    [contextLocalization, localizationProp]
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await authClient.organization.removeTeam({
        teamId: team.id,
        organizationId: team.organizationId,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.DELETE_TEAM_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.DELETE_TEAM
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.REMOVE_TEAM_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Card,
          {
            className: cn(
              "my-2 flex-row items-center gap-3 px-4 py-3",
              classNames == null ? void 0 : classNames.cell
            ),
            children: [
              /* @__PURE__ */ jsx(
                UsersIcon,
                {
                  className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
                /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              disabled: isDeleting,
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              type: "button",
              variant: "secondary",
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isDeleting,
              onClick: handleDelete,
              type: "button",
              variant: "destructive",
              children: [
                isDeleting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function InvitationCell({
  className,
  classNames,
  invitation,
  localization: localizationProp,
  organization
}) {
  const {
    authClient,
    hooks: { useListInvitations },
    organization: organizationOptions,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { lang } = useLang();
  const [isLoading, setIsLoading] = useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === invitation.role);
  const { refetch } = useListInvitations({
    query: { organizationId: organization == null ? void 0 : organization.id }
  });
  const handleCancelInvitation = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      toast({
        variant: "success",
        message: localization.INVITATION_CANCELLED
      });
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center p-4",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            UserAvatar,
            {
              className: "my-0.5",
              user: invitation,
              localization
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left leading-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: invitation.email }),
            /* @__PURE__ */ jsxs("span", { className: "truncate text-muted-foreground text-xs", children: [
              localization.EXPIRES,
              " ",
              invitation.expiresAt.toLocaleDateString(lang ?? "en")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "truncate text-sm opacity-70", children: role == null ? void 0 : role.label }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isLoading,
              size: "icon",
              type: "button",
              variant: "outline",
              children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ jsx(EllipsisIcon, { className: classNames == null ? void 0 : classNames.icon })
            }
          ) }),
          /* @__PURE__ */ jsx(
            DropdownMenuContent,
            {
              onCloseAutoFocus: (e) => e.preventDefault(),
              children: /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  onClick: handleCancelInvitation,
                  disabled: isLoading,
                  variant: "destructive",
                  children: [
                    /* @__PURE__ */ jsx(XIcon, { className: classNames == null ? void 0 : classNames.icon }),
                    localization.CANCEL_INVITATION
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function OrganizationInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  emptyState,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) return null;
  return /* @__PURE__ */ jsx(
    OrganizationInvitationsContent,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationInvitationsContent({
  className,
  classNames,
  localization: localizationProp,
  organization,
  emptyState,
  ...props
}) {
  const {
    hooks: { useListInvitations },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: invitations } = useListInvitations({
    query: { organizationId: organization.id }
  });
  const pendingInvitations = invitations == null ? void 0 : invitations.filter(
    (invitation) => invitation.status === "pending"
  );
  if (!(pendingInvitations == null ? void 0 : pendingInvitations.length)) return /* @__PURE__ */ jsx(Fragment, { children: emptyState });
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PENDING_INVITATIONS,
      description: localization.PENDING_INVITATIONS_DESCRIPTION,
      ...props,
      children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: pendingInvitations.map((invitation) => /* @__PURE__ */ jsx(
        InvitationCell,
        {
          classNames,
          invitation,
          localization,
          organization
        },
        invitation.id
      )) })
    }
  );
}
function OrganizationLogoCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsxs(
      Card,
      {
        className: cn(
          "w-full pb-0 text-start",
          className,
          classNames == null ? void 0 : classNames.base
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx(
              SettingsCardHeader,
              {
                className: "grow self-start",
                title: localization.LOGO,
                description: localization.LOGO_DESCRIPTION,
                isPending: true,
                classNames
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                disabled: true,
                children: /* @__PURE__ */ jsx(
                  OrganizationLogo,
                  {
                    isPending: true,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    localization
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            SettingsCardFooter,
            {
              className: "!py-5",
              instructions: localization.LOGO_INSTRUCTIONS,
              classNames,
              isPending: true
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    OrganizationLogoForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationLogoForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    hooks: { useHasPermission },
    localization: authLocalization,
    organization: organizationOptions,
    mutators: { updateOrganization },
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...authLocalization, ...localizationProp }),
    [authLocalization, localizationProp]
  );
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const isPending = permissionPending;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleLogoChange = async (file) => {
    if (!(organizationOptions == null ? void 0 : organizationOptions.logo) || !(hasPermission == null ? void 0 : hasPermission.success)) return;
    setLoading(true);
    const resizedFile = await resizeAndCropImage(
      file,
      crypto.randomUUID(),
      organizationOptions.logo.size,
      organizationOptions.logo.extension
    );
    let image;
    if (organizationOptions.logo.upload) {
      image = await organizationOptions.logo.upload(resizedFile);
    } else {
      image = await fileToBase64(resizedFile);
    }
    if (!image) {
      setLoading(false);
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { logo: image }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const handleDeleteLogo = async () => {
    var _a, _b;
    if (!(hasPermission == null ? void 0 : hasPermission.success)) return;
    setLoading(true);
    try {
      if (organization.logo) {
        await ((_b = (_a = organizationOptions == null ? void 0 : organizationOptions.logo) == null ? void 0 : _a.delete) == null ? void 0 : _b.call(_a, organization.logo));
      }
      await updateOrganization({
        organizationId: organization.id,
        data: { logo: "" }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setLoading(false);
  };
  const openFileDialog = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "w-full pb-0 text-start",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            accept: "image/*",
            disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
            hidden: true,
            type: "file",
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a.item(0);
              if (file) handleLogoChange(file);
              e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx(
            SettingsCardHeader,
            {
              className: "grow self-start",
              title: localization.LOGO,
              description: localization.LOGO_DESCRIPTION,
              isPending,
              classNames
            }
          ),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                disabled: !(hasPermission == null ? void 0 : hasPermission.success),
                children: /* @__PURE__ */ jsx(
                  OrganizationLogo,
                  {
                    isPending: isPending || loading,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    organization,
                    localization
                  },
                  organization.logo
                )
              }
            ) }),
            /* @__PURE__ */ jsxs(
              DropdownMenuContent,
              {
                align: "end",
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      onClick: openFileDialog,
                      disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
                      children: [
                        /* @__PURE__ */ jsx(UploadCloudIcon, {}),
                        localization.UPLOAD_LOGO
                      ]
                    }
                  ),
                  organization.logo && /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      onClick: handleDeleteLogo,
                      disabled: loading || !(hasPermission == null ? void 0 : hasPermission.success),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsx(Trash2Icon, {}),
                        localization.DELETE_LOGO
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          SettingsCardFooter,
          {
            className: "!py-5",
            instructions: localization.LOGO_INSTRUCTIONS,
            classNames,
            isPending,
            isSubmitting: loading
          }
        )
      ]
    }
  );
}
function InviteMemberDialog({
  classNames,
  localization: localizationProp,
  onOpenChange,
  organization,
  ...props
}) {
  var _a, _b, _c;
  const {
    teams: teamOptions,
    authClient,
    hooks: { useListInvitations, useListMembers, useSession, useListTeams },
    localization: contextLocalization,
    toast,
    organization: organizationOptions,
    localizeErrors
  } = useContext(AuthUIContext);
  const { enabled: teamsEnabled } = teamOptions || {};
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data } = useListMembers({
    query: { organizationId: organization.id }
  });
  const { refetch } = useListInvitations({
    query: { organizationId: organization.id }
  });
  const members = data == null ? void 0 : data.members;
  const { data: sessionData } = useSession();
  const membership = members == null ? void 0 : members.find((m) => m.userId === (sessionData == null ? void 0 : sessionData.user.id));
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const availableRoles = roles.filter(
    (role) => (membership == null ? void 0 : membership.role) === "owner" || role.role !== "owner"
  );
  const { data: teams } = teamsEnabled ? useListTeams({
    organizationId: organization.id
  }) : { data: void 0 };
  const formSchema = z.object({
    email: z.string().min(1, { message: localization.EMAIL_REQUIRED }).email({
      message: localization.INVALID_EMAIL
    }),
    role: z.string().min(1, {
      message: `${localization.ROLE} ${localization.IS_REQUIRED}`
    }),
    teamId: z.string().optional()
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
      teamId: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  async function onSubmit({
    email,
    role,
    teamId
  }) {
    try {
      await authClient.organization.inviteMember({
        email,
        role,
        organizationId: organization.id,
        fetchOptions: { throw: true },
        ...teamsEnabled && { teamId }
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      toast({
        variant: "success",
        message: localization.SEND_INVITATION_SUCCESS || "Invitation sent successfully"
      });
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  }
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(DialogContent, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content, children: [
    /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
      /* @__PURE__ */ jsx(
        DialogTitle,
        {
          className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
          children: localization.INVITE_MEMBER
        }
      ),
      /* @__PURE__ */ jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.INVITE_MEMBER_DESCRIPTION
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
      "form",
      {
        method: "POST",
        onSubmit: form.handleSubmit(onSubmit),
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "email",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: localization.EMAIL_PLACEHOLDER,
                    type: "email",
                    ...field,
                    className: classNames == null ? void 0 : classNames.input
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "role",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.ROLE
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      onValueChange: field.onChange,
                      defaultValue: field.value,
                      children: [
                        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: availableRoles.map((role) => /* @__PURE__ */ jsx(
                          SelectItem,
                          {
                            value: role.role,
                            children: role.label
                          },
                          role.role
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            ),
            teamsEnabled && /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "teamId",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.TEAM
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Select,
                    {
                      onValueChange: field.onChange,
                      defaultValue: field.value,
                      children: [
                        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(
                          SelectValue,
                          {
                            placeholder: localization.SELECT_TEAMS
                          }
                        ) }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: teams == null ? void 0 : teams.map((team) => /* @__PURE__ */ jsx(
                          SelectItem,
                          {
                            value: team.id,
                            children: team.name
                          },
                          team.id
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(FormMessage, {})
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                children: localization.CANCEL
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                className: cn(
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.primaryButton
                ),
                disabled: isSubmitting,
                children: [
                  isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                  localization.SEND_INVITATION
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function RemoveMemberDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    hooks: { useListMembers },
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const removeMember = async () => {
    setIsRemoving(true);
    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.id,
        organizationId: member.organizationId,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.REMOVE_MEMBER_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsRemoving(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.REMOVE_MEMBER
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.REMOVE_MEMBER_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          MemberCell,
          {
            className: classNames == null ? void 0 : classNames.cell,
            member,
            localization,
            hideActions: true
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isRemoving,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: removeMember,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isRemoving,
              children: [
                isRemoving && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.REMOVE_MEMBER
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function UpdateMemberRoleDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c, _d;
  const {
    authClient,
    hooks: { useSession, useListMembers },
    localization: contextLocalization,
    organization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data, refetch } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const members = data == null ? void 0 : data.members;
  const { data: sessionData } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member.role);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organization == null ? void 0 : organization.customRoles) || []];
  const currentUserRole = (_a = members == null ? void 0 : members.find(
    (m) => {
      var _a2;
      return ((_a2 = m.user) == null ? void 0 : _a2.id) === (sessionData == null ? void 0 : sessionData.user.id);
    }
  )) == null ? void 0 : _a.role;
  const availableRoles = roles.filter((role) => {
    if (role.role === "owner") {
      return currentUserRole === "owner";
    }
    if (role.role === "admin") {
      return currentUserRole === "owner" || currentUserRole === "admin";
    }
    return true;
  });
  const updateMemberRole = async () => {
    if (selectedRole === member.role) {
      toast({
        variant: "error",
        message: `${localization.ROLE} ${localization.IS_THE_SAME}`
      });
      return;
    }
    setIsUpdating(true);
    try {
      await authClient.organization.updateMemberRole({
        memberId: member.id,
        role: selectedRole,
        organizationId: member.organizationId,
        fetchOptions: {
          throw: true
        }
      });
      toast({
        variant: "success",
        message: localization.MEMBER_ROLE_UPDATED
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setIsUpdating(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_ROLE
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_ROLE_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 py-4", children: [
          /* @__PURE__ */ jsx(
            MemberCell,
            {
              className: classNames == null ? void 0 : classNames.cell,
              member,
              localization,
              hideActions: true
            }
          ),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: selectedRole,
              onValueChange: setSelectedRole,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(
                  SelectValue,
                  {
                    placeholder: localization.SELECT_ROLE
                  }
                ) }),
                /* @__PURE__ */ jsx(SelectContent, { children: availableRoles.map((role) => /* @__PURE__ */ jsx(SelectItem, { value: role.role, children: role.label }, role.role)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_d = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _d.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isUpdating,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              onClick: updateMemberRole,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              disabled: isUpdating,
              children: [
                isUpdating && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.UPDATE_ROLE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function UpdateMemberTeamCell({
  className,
  classNames,
  userId,
  team,
  added,
  localization,
  refetch
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [isUpdating, setIsUpdating] = useState(false);
  const handleAddRemoveTeam = async () => {
    try {
      setIsUpdating(true);
      if (added) {
        await authClient.organization.removeTeamMember({
          teamId: team.id,
          userId,
          fetchOptions: { throw: true }
        });
        toast({
          variant: "success",
          message: localization.REMOVE_TEAM_MEMBER_SUCCESS
        });
      } else {
        await authClient.organization.addTeamMember({
          teamId: team.id,
          userId,
          fetchOptions: { throw: true }
        });
        toast({
          variant: "success",
          message: localization.ADD_TEAM_MEMBER_SUCCESS
        });
      }
      await (refetch == null ? void 0 : refetch());
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsx(
          UsersIcon,
          {
            className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col truncate", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
          /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isUpdating,
            size: "sm",
            variant: "outline",
            onClick: handleAddRemoveTeam,
            children: [
              isUpdating && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
              added ? localization.REMOVE : localization.ADD
            ]
          }
        )
      ]
    }
  );
}
function UpdateMemberTeamsDialog({
  member,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    hooks: { useListTeams, useListUserTeams },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const {
    data: memberTeams,
    isPending: memberTeamsPending,
    refetch
  } = useListUserTeams();
  function isAdded(teamId) {
    return (memberTeams == null ? void 0 : memberTeams.some((mt) => mt.id === teamId)) ?? false;
  }
  const { data: orgTeams, isPending: orgTeamsPending } = useListTeams({
    organizationId: member.organizationId
  });
  const isPending = memberTeamsPending || orgTeamsPending;
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_TEAMS
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_TEAMS_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 py-4", children: [
          /* @__PURE__ */ jsx(
            MemberCell,
            {
              className: classNames == null ? void 0 : classNames.cell,
              member,
              localization,
              hideActions: true
            }
          ),
          /* @__PURE__ */ jsxs(Card, { className: "gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: localization.TEAMS }) }),
            /* @__PURE__ */ jsx(
              CardContent,
              {
                className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
                children: isPending ? /* @__PURE__ */ jsx(
                  SettingsCellSkeleton,
                  {
                    classNames
                  },
                  "skeleton"
                ) : orgTeams && orgTeams.length > 0 ? orgTeams.sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                ).map((team) => /* @__PURE__ */ jsx(
                  UpdateMemberTeamCell,
                  {
                    classNames,
                    added: isAdded(team.id),
                    userId: member.userId,
                    localization,
                    refetch,
                    team
                  },
                  team.id
                )) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            disabled: isPending,
            children: localization.DONE
          }
        ) })
      ]
    }
  ) });
}
function MemberCell({
  className,
  classNames,
  member,
  localization: localizationProp,
  hideActions
}) {
  var _a;
  const {
    teams: teamOptions,
    organization: organizationOptions,
    hooks: {
      useListMembers,
      useSession,
      useListOrganizations,
      useHasPermission
    },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  const { enabled: teamsEnabled } = teamOptions || {};
  const localization = { ...contextLocalization, ...localizationProp };
  const { data: sessionData } = useSession();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [updateTeamsDialogOpen, setUpdateTeamsDialogOpen] = useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const { data } = useListMembers({
    query: { organizationId: member.organizationId }
  });
  const members = data == null ? void 0 : data.members;
  const myRole = (_a = members == null ? void 0 : members.find(
    (m) => {
      var _a2;
      return ((_a2 = m.user) == null ? void 0 : _a2.id) === (sessionData == null ? void 0 : sessionData.user.id);
    }
  )) == null ? void 0 : _a.role;
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === member.role);
  const isSelf = (sessionData == null ? void 0 : sessionData.user.id) === (member == null ? void 0 : member.userId);
  const { data: organizations } = useListOrganizations();
  const organization = organizations == null ? void 0 : organizations.find(
    (org) => org.id === member.organizationId
  );
  const { data: hasPermissionToUpdateMember } = useHasPermission({
    organizationId: member.organizationId,
    permissions: { member: ["update"] }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center p-4",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsx(
            UserView,
            {
              user: member.user,
              localization,
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-xs opacity-70", children: role == null ? void 0 : role.label }),
          !hideActions && (isSelf || member.role !== "owner" || myRole === "owner") && /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              Button,
              {
                className: cn(
                  "relative ms-auto",
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                size: "icon",
                type: "button",
                variant: "outline",
                children: /* @__PURE__ */ jsx(
                  EllipsisIcon,
                  {
                    className: classNames == null ? void 0 : classNames.icon
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs(
              DropdownMenuContent,
              {
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  (hasPermissionToUpdateMember == null ? void 0 : hasPermissionToUpdateMember.success) && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => setUpdateRoleDialogOpen(true),
                        children: [
                          /* @__PURE__ */ jsx(
                            UserCogIcon,
                            {
                              className: classNames == null ? void 0 : classNames.icon
                            }
                          ),
                          localization == null ? void 0 : localization.UPDATE_ROLE
                        ]
                      }
                    ),
                    teamsEnabled && /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => setUpdateTeamsDialogOpen(
                          true
                        ),
                        children: [
                          /* @__PURE__ */ jsx(
                            Users,
                            {
                              className: classNames == null ? void 0 : classNames.icon
                            }
                          ),
                          localization == null ? void 0 : localization.UPDATE_TEAMS
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      onClick: () => isSelf ? setLeaveDialogOpen(true) : setRemoveDialogOpen(true),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsx(UserXIcon, { className: classNames == null ? void 0 : classNames.icon }),
                        isSelf ? localization == null ? void 0 : localization.LEAVE_ORGANIZATION : localization == null ? void 0 : localization.REMOVE_MEMBER
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      RemoveMemberDialog,
      {
        open: removeDialogOpen,
        onOpenChange: setRemoveDialogOpen,
        member,
        classNames,
        localization
      }
    ),
    organization && /* @__PURE__ */ jsx(
      LeaveOrganizationDialog,
      {
        open: leaveDialogOpen,
        onOpenChange: setLeaveDialogOpen,
        organization,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsx(
      UpdateMemberRoleDialog,
      {
        open: updateRoleDialogOpen,
        onOpenChange: setUpdateRoleDialogOpen,
        member,
        classNames,
        localization
      }
    ),
    teamsEnabled && /* @__PURE__ */ jsx(
      UpdateMemberTeamsDialog,
      {
        open: updateTeamsDialogOpen,
        onOpenChange: setUpdateTeamsDialogOpen,
        member,
        classNames,
        localization
      }
    )
  ] });
}
function OrganizationMembersCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.MEMBERS,
        description: localization.MEMBERS_DESCRIPTION,
        instructions: localization.MEMBERS_INSTRUCTIONS,
        actionLabel: localization.INVITE_MEMBER,
        isPending: true,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsx(
    OrganizationMembersContent,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationMembersContent({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    hooks: { useHasPermission, useListMembers },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: hasPermissionInvite, isPending: isPendingInvite } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      invitation: ["create"]
    }
  });
  const {
    data: hasPermissionUpdateMember,
    isPending: isPendingUpdateMember
  } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      member: ["update"]
    }
  });
  const isPending = isPendingInvite || isPendingUpdateMember;
  const { data } = useListMembers({
    query: { organizationId: organization.id }
  });
  const members = data == null ? void 0 : data.members;
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.MEMBERS,
        description: localization.MEMBERS_DESCRIPTION,
        instructions: localization.MEMBERS_INSTRUCTIONS,
        actionLabel: localization.INVITE_MEMBER,
        action: () => setInviteDialogOpen(true),
        isPending,
        disabled: !(hasPermissionInvite == null ? void 0 : hasPermissionInvite.success),
        ...props,
        children: !isPending && members && members.length > 0 && /* @__PURE__ */ jsx(
          CardContent,
          {
            className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
            children: members.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ).map((member) => /* @__PURE__ */ jsx(
              MemberCell,
              {
                classNames,
                member,
                localization,
                hideActions: !(hasPermissionUpdateMember == null ? void 0 : hasPermissionUpdateMember.success)
              },
              member.id
            ))
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      InviteMemberDialog,
      {
        open: inviteDialogOpen,
        onOpenChange: setInviteDialogOpen,
        classNames,
        localization,
        organization
      }
    )
  ] });
}
function OrganizationNameCard({
  className,
  classNames,
  localization: localizationProp,
  slug,
  ...props
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.SAVE,
        description: localization.ORGANIZATION_NAME_DESCRIPTION,
        instructions: localization.ORGANIZATION_NAME_INSTRUCTIONS,
        isPending: true,
        title: localization.ORGANIZATION_NAME,
        ...props,
        children: /* @__PURE__ */ jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton)
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    OrganizationNameForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationNameForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission },
    mutators: { updateOrganization },
    optimistic,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...localizationProp };
  const { data: hasPermission, isPending: permissionPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const isPending = permissionPending;
  const formSchema = z.object({
    name: z.string().min(1, {
      message: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    values: { name: organization.name || "" }
  });
  const { isSubmitting } = form.formState;
  const updateOrganizationName = async ({
    name
  }) => {
    if (organization.name === name) {
      toast({
        variant: "error",
        message: `${localization.ORGANIZATION_NAME} ${localization.IS_THE_SAME}`
      });
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { name }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
      toast({
        variant: "success",
        message: `${localization.ORGANIZATION_NAME} ${localization.UPDATED_SUCCESSFULLY}`
      });
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(updateOrganizationName),
      children: /* @__PURE__ */ jsx(
        SettingsCard,
        {
          className,
          classNames,
          description: localization.ORGANIZATION_NAME_DESCRIPTION,
          instructions: localization.ORGANIZATION_NAME_INSTRUCTIONS,
          isPending,
          title: localization.ORGANIZATION_NAME,
          actionLabel: localization.SAVE,
          optimistic,
          disabled: !(hasPermission == null ? void 0 : hasPermission.success),
          ...props,
          children: /* @__PURE__ */ jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: isPending ? /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn(
                "h-9 w-full",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ) : /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: localization.ORGANIZATION_NAME_PLACEHOLDER,
                    disabled: isSubmitting || !(hasPermission == null ? void 0 : hasPermission.success),
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            }
          ) })
        }
      )
    }
  ) });
}
function OrganizationSlugCard({
  className,
  classNames,
  localization: localizationProp,
  slug: slugProp,
  ...props
}) {
  const {
    localization: contextLocalization,
    organization: organizationOptions
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const slug = slugProp || (organizationOptions == null ? void 0 : organizationOptions.slug);
  const { data: organization } = useCurrentOrganization({ slug });
  if (!organization) {
    return /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        description: localization.ORGANIZATION_SLUG_DESCRIPTION,
        instructions: localization.ORGANIZATION_SLUG_INSTRUCTIONS,
        isPending: true,
        title: localization.ORGANIZATION_SLUG,
        actionLabel: localization.SAVE,
        ...props,
        children: /* @__PURE__ */ jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton)
          }
        ) })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    OrganizationSlugForm,
    {
      className,
      classNames,
      localization,
      organization,
      ...props
    }
  );
}
function OrganizationSlugForm({
  className,
  classNames,
  localization: localizationProp,
  organization,
  ...props
}) {
  const {
    localization: contextLocalization,
    hooks: { useHasPermission },
    mutators: { updateOrganization },
    optimistic,
    toast,
    organization: organizationOptions,
    replace,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganization } = useCurrentOrganization({
    slug: organization.slug
  });
  const { data: hasPermission, isPending } = useHasPermission({
    organizationId: organization.id,
    permissions: {
      organization: ["update"]
    }
  });
  const formSchema = z.object({
    slug: z.string().min(1, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`
    }).regex(/^[a-z0-9-]+$/, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    values: { slug: organization.slug || "" }
  });
  const { isSubmitting } = form.formState;
  const updateOrganizationSlug = async ({
    slug
  }) => {
    if (organization.slug === slug) {
      toast({
        variant: "error",
        message: `${localization.ORGANIZATION_SLUG} ${localization.IS_THE_SAME}`
      });
      return;
    }
    try {
      await updateOrganization({
        organizationId: organization.id,
        data: { slug }
      });
      await (refetchOrganization == null ? void 0 : refetchOrganization());
      toast({
        variant: "success",
        message: `${localization.ORGANIZATION_SLUG} ${localization.UPDATED_SUCCESSFULLY}`
      });
      if ((organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug") {
        const basePath = organizationOptions.basePath;
        const settingsPath = organizationOptions.viewPaths.SETTINGS;
        replace(`${basePath}/${slug}/${settingsPath}`);
      }
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
  };
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(updateOrganizationSlug),
      children: /* @__PURE__ */ jsx(
        SettingsCard,
        {
          className,
          classNames,
          description: localization.ORGANIZATION_SLUG_DESCRIPTION,
          instructions: localization.ORGANIZATION_SLUG_INSTRUCTIONS,
          isPending,
          title: localization.ORGANIZATION_SLUG,
          actionLabel: localization.SAVE,
          optimistic,
          disabled: !(hasPermission == null ? void 0 : hasPermission.success),
          ...props,
          children: /* @__PURE__ */ jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: isPending ? /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn(
                "h-9 w-full",
                classNames == null ? void 0 : classNames.skeleton
              )
            }
          ) : /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: localization.ORGANIZATION_SLUG_PLACEHOLDER,
                    disabled: isSubmitting || !(hasPermission == null ? void 0 : hasPermission.success),
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            }
          ) })
        }
      )
    }
  ) });
}
function OrganizationSettingsCards({
  className,
  classNames,
  localization,
  slug
}) {
  const { organization: organizationOptions } = useContext(AuthUIContext);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        (organizationOptions == null ? void 0 : organizationOptions.logo) && /* @__PURE__ */ jsx(
          OrganizationLogoCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsx(
          OrganizationNameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsx(
          OrganizationSlugCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        ),
        /* @__PURE__ */ jsx(
          DeleteOrganizationCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            slug
          }
        )
      ]
    }
  );
}
var fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "field",
      "data-orientation": orientation,
      className: cn(fieldVariants({ orientation }), className),
      ...props
    }
  );
}
function FieldLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Label2,
    {
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      ...props
    }
  );
}
function UpdateTeamDialog({
  classNames,
  team,
  localization: localizationProp,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({
      ...contextLocalization,
      ...localizationProp
    }),
    [contextLocalization, localizationProp]
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(team.name);
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await authClient.organization.updateTeam({
        teamId: team.id,
        data: { name },
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.UPDATE_TEAM_SUCCESS
      });
      await (refetch == null ? void 0 : refetch());
      onOpenChange == null ? void 0 : onOpenChange(false);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.UPDATE_TEAM
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.UPDATE_TEAM_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Card,
          {
            className: cn(
              "my-2 flex-row items-center gap-3 px-4 py-3",
              classNames == null ? void 0 : classNames.cell
            ),
            children: [
              /* @__PURE__ */ jsx(
                UsersIcon,
                {
                  className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
                /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Field, { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "name", children: localization.TEAM_NAME }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "name",
              onChange: (e) => setName(e.target.value),
              placeholder: localization.TEAM_NAME_PLACEHOLDER,
              required: true,
              value: name
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              disabled: isUpdating,
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              type: "button",
              variant: "secondary",
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              disabled: isUpdating || name.trim().length === 0,
              onClick: handleUpdate,
              type: "button",
              children: [
                isUpdating && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.UPDATE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function TeamCell({
  className,
  classNames,
  team,
  localization,
  canDelete,
  canUpdate,
  refetch
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center gap-3 truncate px-4 py-3",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsx(
            UsersIcon,
            {
              className: cn("size-5 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col truncate", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: team.name }) }),
            /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground text-xs", children: localization == null ? void 0 : localization.TEAM })
          ] }),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              Button,
              {
                className: cn(
                  "relative ms-auto",
                  classNames == null ? void 0 : classNames.button,
                  classNames == null ? void 0 : classNames.outlineButton
                ),
                size: "icon",
                type: "button",
                variant: "outline",
                children: /* @__PURE__ */ jsx(EllipsisIcon, { className: classNames == null ? void 0 : classNames.icon })
              }
            ) }),
            /* @__PURE__ */ jsxs(
              DropdownMenuContent,
              {
                onCloseAutoFocus: (e) => e.preventDefault(),
                children: [
                  /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      disabled: !canUpdate,
                      onSelect: () => setShowUpdateDialog(true),
                      children: [
                        /* @__PURE__ */ jsx(Edit, { className: classNames == null ? void 0 : classNames.icon }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          " ",
                          localization == null ? void 0 : localization.UPDATE_TEAM
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      disabled: !canDelete,
                      onClick: () => setShowDeleteDialog(true),
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsx(Archive, { className: classNames == null ? void 0 : classNames.icon }),
                        /* @__PURE__ */ jsx("span", { children: localization == null ? void 0 : localization.DELETE_TEAM })
                      ]
                    }
                  )
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      UpdateTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setShowUpdateDialog,
        open: showUpdateDialog,
        refetch,
        team
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setShowDeleteDialog,
        open: showDeleteDialog,
        refetch,
        team
      }
    )
  ] });
}
function TeamsCard({
  className,
  classNames,
  localization,
  organizationId,
  ...props
}) {
  const {
    hooks: { useHasPermission, useListTeams },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const isHydrated = useIsHydrated();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: hasPermissionCreate, isPending: permissionCreatePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["create"]
    }
  });
  const { data: hasPermissionUpdate, isPending: permissionUpdatePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["update"]
    }
  });
  const { data: hasPermissionDelete, isPending: permissionDeletePending } = useHasPermission({
    organizationId,
    permissions: {
      team: ["delete"]
    }
  });
  const {
    data: teams,
    isPending: teamsPending,
    refetch
  } = useListTeams({
    organizationId
  });
  const isPending = !isHydrated || permissionCreatePending || permissionUpdatePending || permissionDeletePending || teamsPending;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        action: () => setCreateDialogOpen(true),
        actionLabel: localization.CREATE_TEAM,
        className,
        classNames,
        description: localization.TEAMS_DESCRIPTION,
        disabled: !(hasPermissionCreate == null ? void 0 : hasPermissionCreate.success),
        instructions: localization.CREATE_TEAM_INSTRUCTIONS,
        isPending,
        title: localization.TEAMS,
        ...props,
        children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsx(SettingsCellSkeleton, {}) : teams && teams.length > 0 ? teams.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ).map((team) => /* @__PURE__ */ jsx(
          TeamCell,
          {
            canDelete: !!(hasPermissionDelete == null ? void 0 : hasPermissionDelete.success),
            canUpdate: !!(hasPermissionUpdate == null ? void 0 : hasPermissionUpdate.success),
            classNames,
            localization,
            refetch,
            team
          },
          team.id
        )) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND }) })
      }
    ),
    /* @__PURE__ */ jsx(
      CreateTeamDialog,
      {
        classNames,
        localization,
        onOpenChange: setCreateDialogOpen,
        open: createDialogOpen,
        organizationId,
        refetch
      }
    )
  ] });
}
function OrganizationView({
  className,
  classNames,
  localization: localizationProp,
  path: pathProp,
  pathname,
  view: viewProp,
  hideNav,
  slug: slugProp
}) {
  var _a, _b, _c;
  const {
    teams: teamOptions,
    organization: organizationOptions,
    localization: contextLocalization,
    account: accountOptions,
    Link,
    replace
  } = useContext(AuthUIContext);
  const { slug: contextSlug, viewPaths, apiKey } = organizationOptions || {};
  const { enabled: teamsEnabled } = teamOptions || {};
  useAuthenticate();
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(viewPaths, path) || "SETTINGS";
  const slug = slugProp || contextSlug;
  const {
    data: organization,
    isPending: organizationPending,
    isRefetching: organizationRefetching
  } = useCurrentOrganization({ slug });
  const navItems = [
    { view: "SETTINGS", label: localization.SETTINGS },
    { view: "MEMBERS", label: localization.MEMBERS }
  ];
  if (teamsEnabled) {
    navItems.push({
      view: "TEAMS",
      label: localization.TEAMS
    });
  }
  if (apiKey) {
    navItems.push({
      view: "API_KEYS",
      label: localization.API_KEYS
    });
  }
  useEffect(() => {
    var _a2;
    if (organization || organizationPending || organizationRefetching)
      return;
    replace(
      `${accountOptions == null ? void 0 : accountOptions.basePath}/${(_a2 = accountOptions == null ? void 0 : accountOptions.viewPaths) == null ? void 0 : _a2.ORGANIZATIONS}`
    );
  }, [
    organization,
    organizationPending,
    organizationRefetching,
    accountOptions == null ? void 0 : accountOptions.basePath,
    (_a = accountOptions == null ? void 0 : accountOptions.viewPaths) == null ? void 0 : _a.ORGANIZATIONS,
    replace
  ]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex w-full grow flex-col gap-4 md:flex-row md:gap-12",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        !hideNav && /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2 md:hidden", children: [
          /* @__PURE__ */ jsx(Label2, { className: "font-semibold text-base", children: (_b = navItems.find((i) => i.view === view)) == null ? void 0 : _b.label }),
          /* @__PURE__ */ jsxs(Drawer, { children: [
            /* @__PURE__ */ jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", children: /* @__PURE__ */ jsx(MenuIcon, {}) }) }),
            /* @__PURE__ */ jsxs(DrawerContent, { children: [
              /* @__PURE__ */ jsx(DrawerHeader, { children: /* @__PURE__ */ jsx(DrawerTitle, { className: "hidden", children: localization.ORGANIZATION }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col px-4 pb-4", children: navItems.map((item) => {
                var _a2;
                return /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `${organizationOptions == null ? void 0 : organizationOptions.basePath}${(organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug" ? `/${slug}` : ""}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths[item.view]}`,
                    children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "lg",
                        className: cn(
                          "w-full justify-start px-4 transition-none",
                          (_a2 = classNames == null ? void 0 : classNames.drawer) == null ? void 0 : _a2.menuItem,
                          view === item.view ? "font-semibold" : "text-foreground/70"
                        ),
                        variant: "ghost",
                        children: item.label
                      }
                    )
                  },
                  item.view
                );
              }) })
            ] })
          ] })
        ] }),
        !hideNav && /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex w-48 flex-col gap-1 lg:w-60",
              (_c = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _c.base
            ),
            children: navItems.map((item) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: `${organizationOptions == null ? void 0 : organizationOptions.basePath}${(organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug" ? `/${slug}` : ""}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths[item.view]}`,
                  children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "lg",
                      className: cn(
                        "w-full justify-start px-4 transition-none",
                        (_a2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _a2.button,
                        view === item.view ? "font-semibold" : "text-foreground/70",
                        view === item.view && ((_b2 = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _b2.buttonActive)
                      ),
                      variant: "ghost",
                      children: item.label
                    }
                  )
                },
                item.view
              );
            })
          }
        ) }),
        view === "MEMBERS" && /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex w-full flex-col gap-4 md:gap-6",
              className,
              classNames == null ? void 0 : classNames.cards
            ),
            children: [
              /* @__PURE__ */ jsx(
                OrganizationMembersCard,
                {
                  classNames: classNames == null ? void 0 : classNames.card,
                  localization,
                  slug
                }
              ),
              /* @__PURE__ */ jsx(
                OrganizationInvitationsCard,
                {
                  classNames: classNames == null ? void 0 : classNames.card,
                  localization,
                  slug
                }
              )
            ]
          }
        ),
        view === "TEAMS" && (organization == null ? void 0 : organization.id) && teamsEnabled && /* @__PURE__ */ jsx(
          TeamsCard,
          {
            classNames,
            localization,
            organizationId: organization.id
          }
        ),
        view === "API_KEYS" && /* @__PURE__ */ jsx(
          ApiKeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization,
            isPending: organizationPending,
            organizationId: organization == null ? void 0 : organization.id
          }
        ),
        view === "SETTINGS" && /* @__PURE__ */ jsx(
          OrganizationSettingsCards,
          {
            classNames,
            localization,
            slug
          }
        )
      ]
    }
  );
}
export {
  OrganizationView as O
};
