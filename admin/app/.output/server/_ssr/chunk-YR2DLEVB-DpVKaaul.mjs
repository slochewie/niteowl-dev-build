import { D as Drawer, a as DrawerTrigger, b as DrawerContent, c as DrawerHeader, d as DrawerTitle, A as ApiKeysCard, S as SettingsCard, e as SettingsCellSkeleton, f as SettingsCardHeader, g as SettingsCardFooter, h as Select, i as SelectTrigger, j as SelectValue, k as SelectContent, l as SelectItem, L as LeaveOrganizationDialog, m as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, q as DialogDescription, r as DialogFooter, U as UserView } from "./chunk-2YWC3WKF-DaMD_vc6.mjs";
import { C as Checkbox, T as Textarea, u as useCaptcha, a as Captcha, P as PasswordInput, s as socialProviders } from "./chunk-2FH7HU2O-DxLZ7u6A.mjs";
import { L as Label2, D as DropdownMenu, a as DropdownMenuTrigger, U as UserAvatar, b as DropdownMenuContent, c as DropdownMenuItem, F as Form, d as FormField, e as FormItem, f as FormControl, I as Input, g as FormMessage, h as FormLabel, r as resizeAndCropImage, i as fileToBase64 } from "./chunk-52PGTSBA-BdHAHenY.mjs";
import { u as useAuthenticate, O as OrganizationCellView, a as OrganizationLogo } from "./chunk-XPGLXIJB-D0r-Tyqx.mjs";
import { A as AuthUIContext, u as useIsHydrated, a as useLang } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { a as getViewByPath, B as Button, c as cn, C as CardContent, b as Card, S as Skeleton, d as getPasswordSchema, g as getLocalizedError } from "./chunk-KS7QMNEN-DP7ssmzE.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { useContext, useMemo, useState, useRef, useCallback, useEffect } from "react";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { R as Root3, T as Trigger, P as Portal, C as Content2, A as Arrow2, a as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { B as Bowser } from "../_libs/bowser.mjs";
import { M as Menu, aw as CloudUpload, k as Trash2, ax as Users, L as LoaderCircle, W as Ellipsis, i as Settings, ay as LogOut, f as Check, X, az as Repeat, aA as UserRoundX, aB as FingerprintPattern, ai as Smartphone, aC as Laptop, g as Copy } from "../_libs/lucide-react.mjs";
import { o as object, s as string, p as preprocess, n as number, d as number$1, f as boolean, u as unknown } from "../_libs/zod.mjs";
function CreateOrganizationDialog({
  className,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    localization: contextLocalization,
    organization: organizationOptions,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const [logo, setLogo] = useState(null);
  const [logoPending, setLogoPending] = useState(false);
  const fileInputRef = useRef(null);
  const openFileDialog = () => {
    var _a2;
    return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  };
  const formSchema = object({
    logo: string().optional(),
    name: string().min(1, {
      message: `${localization.ORGANIZATION_NAME} ${localization.IS_REQUIRED}`
    }),
    slug: string().min(1, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_REQUIRED}`
    }).regex(/^[a-z0-9-]+$/, {
      message: `${localization.ORGANIZATION_SLUG} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      logo: "",
      name: "",
      slug: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  const handleLogoChange = async (file) => {
    if (!(organizationOptions == null ? void 0 : organizationOptions.logo)) return;
    setLogoPending(true);
    try {
      const resizedFile = await resizeAndCropImage(
        file,
        crypto.randomUUID(),
        organizationOptions.logo.size,
        organizationOptions.logo.extension
      );
      let image;
      if (organizationOptions == null ? void 0 : organizationOptions.logo.upload) {
        image = await organizationOptions.logo.upload(resizedFile);
      } else {
        image = await fileToBase64(resizedFile);
      }
      setLogo(image || null);
      form.setValue("logo", image || "");
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
    setLogoPending(false);
  };
  const deleteLogo = async () => {
    var _a2;
    setLogoPending(true);
    const currentUrl = logo || void 0;
    if (currentUrl && ((_a2 = organizationOptions == null ? void 0 : organizationOptions.logo) == null ? void 0 : _a2.delete)) {
      await organizationOptions.logo.delete(currentUrl);
    }
    setLogo(null);
    form.setValue("logo", "");
    setLogoPending(false);
  };
  async function onSubmit({ name, slug, logo: logo2 }) {
    try {
      const organization = await authClient.organization.create({
        name,
        slug,
        logo: logo2,
        fetchOptions: { throw: true }
      });
      if ((organizationOptions == null ? void 0 : organizationOptions.pathMode) === "slug") {
        navigate(`${organizationOptions.basePath}/${organization.slug}`);
        return;
      }
      await authClient.organization.setActive({
        organizationId: organization.id
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
      setLogo(null);
      toast({
        variant: "success",
        message: localization.CREATE_ORGANIZATION_SUCCESS
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
          children: localization.CREATE_ORGANIZATION
        }
      ),
      /* @__PURE__ */ jsx(
        DialogDescription,
        {
          className: cn(
            "text-xs md:text-sm",
            classNames == null ? void 0 : classNames.description
          ),
          children: localization.ORGANIZATIONS_INSTRUCTIONS
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
          (organizationOptions == null ? void 0 : organizationOptions.logo) && /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "logo",
              render: () => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    accept: "image/*",
                    disabled: logoPending,
                    hidden: true,
                    type: "file",
                    onChange: (e) => {
                      var _a2;
                      const file = (_a2 = e.target.files) == null ? void 0 : _a2.item(0);
                      if (file) handleLogoChange(file);
                      e.target.value = "";
                    }
                  }
                ),
                /* @__PURE__ */ jsx(FormLabel, { children: localization.LOGO }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "size-fit rounded-full",
                        size: "icon",
                        type: "button",
                        variant: "ghost",
                        children: /* @__PURE__ */ jsx(
                          OrganizationLogo,
                          {
                            className: "size-16",
                            isPending: logoPending,
                            localization,
                            organization: {
                              name: form.watch(
                                "name"
                              ),
                              logo
                            }
                          }
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuContent,
                      {
                        align: "start",
                        onCloseAutoFocus: (e) => e.preventDefault(),
                        children: [
                          /* @__PURE__ */ jsxs(
                            DropdownMenuItem,
                            {
                              onClick: openFileDialog,
                              disabled: logoPending,
                              children: [
                                /* @__PURE__ */ jsx(CloudUpload, {}),
                                localization.UPLOAD_LOGO
                              ]
                            }
                          ),
                          logo && /* @__PURE__ */ jsxs(
                            DropdownMenuItem,
                            {
                              onClick: deleteLogo,
                              disabled: logoPending,
                              variant: "destructive",
                              children: [
                                /* @__PURE__ */ jsx(Trash2, {}),
                                localization.DELETE_LOGO
                              ]
                            }
                          )
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      disabled: logoPending,
                      variant: "outline",
                      onClick: openFileDialog,
                      type: "button",
                      children: [
                        logoPending && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                        localization.UPLOAD
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "name",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: localization.ORGANIZATION_NAME }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: localization.ORGANIZATION_NAME_PLACEHOLDER,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "slug",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: localization.ORGANIZATION_SLUG }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  {
                    placeholder: localization.ORGANIZATION_SLUG_PLACEHOLDER,
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
                disabled: isSubmitting,
                children: [
                  isSubmitting && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                  localization.CREATE_ORGANIZATION
                ]
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function OrganizationCell({
  className,
  classNames,
  organization,
  localization: localizationProp
}) {
  var _a;
  const {
    authClient,
    localization: contextLocalization,
    organization: organizationOptions,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { pathMode } = organizationOptions || {};
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isManagingOrganization, setIsManagingOrganization] = useState(false);
  const handleManageOrganization = useCallback(async () => {
    var _a2;
    setIsManagingOrganization(true);
    if (pathMode === "slug") {
      navigate(
        `${organizationOptions == null ? void 0 : organizationOptions.basePath}/${organization.slug}/${organizationOptions == null ? void 0 : organizationOptions.viewPaths.SETTINGS}`
      );
      return;
    }
    try {
      await authClient.organization.setActive({
        organizationId: organization.id,
        fetchOptions: {
          throw: true
        }
      });
      navigate(
        `${organizationOptions == null ? void 0 : organizationOptions.basePath}/${(_a2 = organizationOptions == null ? void 0 : organizationOptions.viewPaths) == null ? void 0 : _a2.SETTINGS}`
      );
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsManagingOrganization(false);
    }
  }, [
    authClient,
    organization.id,
    organizationOptions == null ? void 0 : organizationOptions.basePath,
    (_a = organizationOptions == null ? void 0 : organizationOptions.viewPaths) == null ? void 0 : _a.SETTINGS,
    organization.slug,
    pathMode,
    navigate,
    toast,
    localization,
    localizeErrors
  ]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Card, { className: cn("flex-row p-4", className, classNames == null ? void 0 : classNames.cell), children: [
      /* @__PURE__ */ jsx(
        OrganizationCellView,
        {
          organization,
          localization
        }
      ),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isManagingOrganization,
            size: "icon",
            type: "button",
            variant: "outline",
            children: isManagingOrganization ? /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
          }
        ) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { children: [
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: handleManageOrganization,
              disabled: isManagingOrganization,
              children: [
                /* @__PURE__ */ jsx(Settings, { className: classNames == null ? void 0 : classNames.icon }),
                localization.MANAGE_ORGANIZATION
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => setIsLeaveDialogOpen(true),
              variant: "destructive",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: classNames == null ? void 0 : classNames.icon }),
                localization.LEAVE_ORGANIZATION
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      LeaveOrganizationDialog,
      {
        open: isLeaveDialogOpen,
        onOpenChange: setIsLeaveDialogOpen,
        organization,
        localization
      }
    )
  ] });
}
function OrganizationsCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useListOrganizations },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const isHydrated = useIsHydrated();
  const { data: organizations, isPending: organizationsPending } = useListOrganizations();
  const isPending = !isHydrated || organizationsPending;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        title: localization.ORGANIZATIONS,
        description: localization.ORGANIZATIONS_DESCRIPTION,
        instructions: localization.ORGANIZATIONS_INSTRUCTIONS,
        actionLabel: localization.CREATE_ORGANIZATION,
        action: () => setCreateDialogOpen(true),
        isPending,
        ...props,
        children: /* @__PURE__ */ jsxs(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: [
          isPending && /* @__PURE__ */ jsx(SettingsCellSkeleton, {}),
          organizations == null ? void 0 : organizations.map((organization) => /* @__PURE__ */ jsx(
            OrganizationCell,
            {
              classNames,
              organization,
              localization
            },
            organization.id
          ))
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      CreateOrganizationDialog,
      {
        classNames,
        localization,
        open: createDialogOpen,
        onOpenChange: setCreateDialogOpen
      }
    )
  ] });
}
function UserInvitationsCard({
  className,
  classNames,
  localization: localizationProp,
  ...props
}) {
  const {
    hooks: { useListUserInvitations, useListOrganizations },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { data: invitations, refetch: refetchInvitations } = useListUserInvitations();
  const { refetch: refetchOrganizations } = useListOrganizations();
  const handleRefresh = async () => {
    await (refetchInvitations == null ? void 0 : refetchInvitations());
    await (refetchOrganizations == null ? void 0 : refetchOrganizations());
  };
  const pendingInvitations = invitations == null ? void 0 : invitations.filter(
    (invitation) => invitation.status === "pending"
  );
  if (!(pendingInvitations == null ? void 0 : pendingInvitations.length)) return null;
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PENDING_INVITATIONS,
      description: localization.PENDING_USER_INVITATIONS_DESCRIPTION || localization.PENDING_INVITATIONS_DESCRIPTION,
      ...props,
      children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: pendingInvitations.map((invitation) => /* @__PURE__ */ jsx(
        UserInvitationRow,
        {
          classNames,
          invitation: {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            expiresAt: invitation.expiresAt
          },
          onChanged: handleRefresh
        },
        invitation.id
      )) })
    }
  );
}
function UserInvitationRow({
  classNames,
  invitation,
  onChanged
}) {
  const {
    authClient,
    organization: organizationOptions,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = contextLocalization;
  const { lang } = useLang();
  const [isLoading, setIsLoading] = useState(false);
  const builtInRoles = [
    { role: "owner", label: localization.OWNER },
    { role: "admin", label: localization.ADMIN },
    { role: "member", label: localization.MEMBER }
  ];
  const roles = [...builtInRoles, ...(organizationOptions == null ? void 0 : organizationOptions.customRoles) || []];
  const role = roles.find((r) => r.role === invitation.role);
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (onChanged == null ? void 0 : onChanged());
      toast({
        variant: "success",
        message: localization.INVITATION_ACCEPTED
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
  const handleReject = async () => {
    setIsLoading(true);
    try {
      await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
        fetchOptions: { throw: true }
      });
      await (onChanged == null ? void 0 : onChanged());
      toast({
        variant: "success",
        message: localization.INVITATION_REJECTED
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
  return /* @__PURE__ */ jsxs(Card, { className: cn("flex-row items-center p-4", classNames == null ? void 0 : classNames.cell), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        UserAvatar,
        {
          className: "my-0.5",
          user: { email: invitation.email },
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
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
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
          children: isLoading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
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
                onClick: handleAccept,
                disabled: isLoading,
                children: [
                  /* @__PURE__ */ jsx(Check, { className: classNames == null ? void 0 : classNames.icon }),
                  localization.ACCEPT
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: handleReject,
                disabled: isLoading,
                variant: "destructive",
                children: [
                  /* @__PURE__ */ jsx(X, { className: classNames == null ? void 0 : classNames.icon }),
                  localization.REJECT
                ]
              }
            )
          ]
        }
      )
    ] }) })
  ] });
}
function AccountCell({
  className,
  classNames,
  deviceSession,
  localization,
  refetch
}) {
  const {
    basePath,
    localization: contextLocalization,
    hooks: { useSession },
    mutators: { revokeDeviceSession, setActiveSession },
    toast,
    viewPaths,
    navigate,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const handleRevoke = async () => {
    setIsLoading(true);
    try {
      await revokeDeviceSession({
        sessionToken: deviceSession.session.token
      });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      setIsLoading(false);
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
  const handleSetActiveSession = async () => {
    setIsLoading(true);
    try {
      await setActiveSession({
        sessionToken: deviceSession.session.token
      });
      refetch == null ? void 0 : refetch();
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
  const isCurrentSession = deviceSession.session.id === (sessionData == null ? void 0 : sessionData.session.id);
  return /* @__PURE__ */ jsxs(Card, { className: cn("flex-row p-4", className, classNames == null ? void 0 : classNames.cell), children: [
    /* @__PURE__ */ jsx(UserView, { user: deviceSession.user, localization }),
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
          children: isLoading ? /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Ellipsis, { className: classNames == null ? void 0 : classNames.icon })
        }
      ) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { children: [
        !isCurrentSession && /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSetActiveSession, children: [
          /* @__PURE__ */ jsx(Repeat, { className: classNames == null ? void 0 : classNames.icon }),
          localization.SWITCH_ACCOUNT
        ] }),
        /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => {
              if (isCurrentSession) {
                navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
                return;
              }
              handleRevoke();
            },
            variant: "destructive",
            children: [
              isCurrentSession ? /* @__PURE__ */ jsx(LogOut, { className: classNames == null ? void 0 : classNames.icon }) : /* @__PURE__ */ jsx(UserRoundX, { className: classNames == null ? void 0 : classNames.icon }),
              isCurrentSession ? localization.SIGN_OUT : localization.REVOKE
            ]
          }
        )
      ] })
    ] })
  ] });
}
function AccountsCard({
  className,
  classNames,
  localization
}) {
  const {
    basePath,
    hooks: { useListDeviceSessions, useSession },
    localization: contextLocalization,
    viewPaths,
    navigate
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: deviceSessions, isPending, refetch } = useListDeviceSessions();
  const { data: sessionData } = useSession();
  const otherDeviceSessions = (deviceSessions || []).filter(
    (ds) => ds.session.id !== (sessionData == null ? void 0 : sessionData.session.id)
  );
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.ACCOUNTS,
      description: localization.ACCOUNTS_DESCRIPTION,
      actionLabel: localization.ADD_ACCOUNT,
      instructions: localization.ACCOUNTS_INSTRUCTIONS,
      isPending,
      action: () => navigate(`${basePath}/${viewPaths.SIGN_IN}`),
      children: (deviceSessions == null ? void 0 : deviceSessions.length) ? /* @__PURE__ */ jsxs(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: [
        sessionData && /* @__PURE__ */ jsx(
          AccountCell,
          {
            classNames,
            deviceSession: sessionData,
            localization,
            refetch
          }
        ),
        otherDeviceSessions.map((deviceSession) => /* @__PURE__ */ jsx(
          AccountCell,
          {
            classNames,
            deviceSession,
            localization,
            refetch
          },
          deviceSession.session.id
        ))
      ] }) : null
    }
  );
}
function UpdateAvatarCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useSession },
    mutators: { updateUser },
    localization: authLocalization,
    optimistic,
    avatar,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...authLocalization, ...localization };
  const { data: sessionData, isPending, refetch } = useSession();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleAvatarChange = async (file) => {
    if (!sessionData || !avatar) return;
    setLoading(true);
    const resizedFile = await resizeAndCropImage(
      file,
      crypto.randomUUID(),
      avatar.size,
      avatar.extension
    );
    let image;
    if (avatar.upload) {
      image = await avatar.upload(resizedFile);
    } else {
      image = await fileToBase64(resizedFile);
    }
    if (!image) {
      setLoading(false);
      return;
    }
    if (optimistic && !avatar.upload) setLoading(false);
    try {
      await updateUser({ image });
      await (refetch == null ? void 0 : refetch());
      if (avatar.upload && avatar.delete && sessionData.user.image) {
        try {
          await avatar.delete(sessionData.user.image);
        } catch (error) {
          console.error("Failed to delete old avatar:", error);
        }
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
    setLoading(false);
  };
  const handleDeleteAvatar = async () => {
    if (!sessionData) return;
    setLoading(true);
    try {
      if (sessionData.user.image && (avatar == null ? void 0 : avatar.delete)) {
        await avatar.delete(sessionData.user.image);
      }
      await updateUser({ image: null });
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
    }
    setLoading(false);
  };
  const openFileDialog = () => {
    var _a;
    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
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
            disabled: loading,
            hidden: true,
            type: "file",
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a.item(0);
              if (file) handleAvatarChange(file);
              e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx(
            SettingsCardHeader,
            {
              className: "grow self-start",
              title: localization.AVATAR,
              description: localization.AVATAR_DESCRIPTION,
              isPending,
              classNames
            }
          ),
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              Button,
              {
                className: "me-6 size-fit rounded-full",
                size: "icon",
                variant: "ghost",
                children: /* @__PURE__ */ jsx(
                  UserAvatar,
                  {
                    isPending: isPending || loading,
                    className: "size-20 text-2xl",
                    classNames: classNames == null ? void 0 : classNames.avatar,
                    user: sessionData == null ? void 0 : sessionData.user,
                    localization
                  },
                  sessionData == null ? void 0 : sessionData.user.image
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
                      disabled: loading,
                      children: [
                        /* @__PURE__ */ jsx(CloudUpload, {}),
                        localization.UPLOAD_AVATAR
                      ]
                    }
                  ),
                  (sessionData == null ? void 0 : sessionData.user.image) && /* @__PURE__ */ jsxs(
                    DropdownMenuItem,
                    {
                      onClick: handleDeleteAvatar,
                      disabled: loading,
                      variant: "destructive",
                      children: [
                        /* @__PURE__ */ jsx(Trash2, {}),
                        localization.DELETE_AVATAR
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
            instructions: localization.AVATAR_INSTRUCTIONS,
            classNames,
            isPending,
            isSubmitting: loading
          }
        )
      ]
    }
  );
}
function UpdateFieldCard({
  className,
  classNames,
  description,
  instructions,
  localization: localizationProp,
  name,
  placeholder,
  required,
  label,
  type,
  multiline,
  value,
  validate,
  errorMessage,
  options,
  onUpdateComplete
}) {
  const {
    hooks: { useSession },
    mutators: { updateUser },
    localization: contextLocalization,
    optimistic,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { isPending } = useSession();
  let fieldSchema = unknown();
  if (type === "number") {
    fieldSchema = required ? preprocess(
      (val) => !val ? void 0 : Number(val),
      number({
        message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
      })
    ) : number$1({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    }).optional();
  } else if (type === "boolean") {
    fieldSchema = required ? boolean({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    }).refine((val) => val === true, {
      message: (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    }) : boolean({
      message: (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
    });
  } else if (type === "select") {
    fieldSchema = required ? string().min(
      1,
      (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    ) : string().optional();
  } else {
    fieldSchema = required ? string().min(
      1,
      (errorMessage == null ? void 0 : errorMessage.required) ?? `${label} ${localization.IS_REQUIRED}`
    ) : string().optional();
  }
  const form = useForm({
    resolver: u(object({ [name]: fieldSchema })),
    values: { [name]: value || "" }
  });
  const { isSubmitting } = form.formState;
  const updateField = async (values) => {
    await new Promise((resolve) => setTimeout(resolve));
    const newValue = values[name];
    if (value === newValue) {
      toast({
        variant: "error",
        message: `${label} ${localization.IS_THE_SAME}`
      });
      return;
    }
    if (validate && typeof newValue === "string" && !await validate(newValue)) {
      form.setError(name, {
        message: (errorMessage == null ? void 0 : errorMessage.validate) ?? (errorMessage == null ? void 0 : errorMessage.invalid) ?? `${label} ${localization.IS_INVALID}`
      });
      return;
    }
    try {
      await updateUser({ [name]: newValue });
      toast({
        variant: "success",
        message: `${label} ${localization.UPDATED_SUCCESSFULLY}`
      });
      onUpdateComplete == null ? void 0 : onUpdateComplete();
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
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx("form", { method: "POST", onSubmit: form.handleSubmit(updateField), children: /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      description,
      instructions,
      isPending,
      title: label,
      actionLabel: localization.SAVE,
      optimistic,
      children: /* @__PURE__ */ jsx(CardContent, { className: classNames == null ? void 0 : classNames.content, children: type === "boolean" ? /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name,
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex", children: [
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                checked: field.value,
                onCheckedChange: field.onChange,
                disabled: isSubmitting,
                className: classNames == null ? void 0 : classNames.checkbox
              }
            ) }),
            /* @__PURE__ */ jsx(
              FormLabel,
              {
                className: classNames == null ? void 0 : classNames.label,
                children: label
              }
            ),
            /* @__PURE__ */ jsx(
              FormMessage,
              {
                className: classNames == null ? void 0 : classNames.error
              }
            )
          ] })
        }
      ) : isPending ? /* @__PURE__ */ jsx(
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
          name,
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormControl, { children: type === "select" ? /* @__PURE__ */ jsxs(
              Select,
              {
                onValueChange: field.onChange,
                value: field.value,
                disabled: isSubmitting,
                children: [
                  /* @__PURE__ */ jsx(
                    SelectTrigger,
                    {
                      className: cn(
                        "w-full",
                        classNames == null ? void 0 : classNames.input
                      ),
                      children: /* @__PURE__ */ jsx(
                        SelectValue,
                        {
                          placeholder: placeholder || (typeof label === "string" ? label : "Select an option")
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(SelectContent, { children: options == null ? void 0 : options.map(
                    (option) => /* @__PURE__ */ jsx(
                      SelectItem,
                      {
                        value: option.value,
                        children: option.label
                      },
                      option.value
                    )
                  ) })
                ]
              }
            ) : type === "number" ? /* @__PURE__ */ jsx(
              Input,
              {
                className: classNames == null ? void 0 : classNames.input,
                type: "number",
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
              }
            ) : multiline ? /* @__PURE__ */ jsx(
              Textarea,
              {
                className: classNames == null ? void 0 : classNames.input,
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
              }
            ) : /* @__PURE__ */ jsx(
              Input,
              {
                className: classNames == null ? void 0 : classNames.input,
                type: "text",
                placeholder: placeholder || (typeof label === "string" ? label : ""),
                disabled: isSubmitting,
                ...field,
                value: field.value
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
  ) }) });
}
function UpdateNameCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    hooks: { useSession },
    localization: contextLocalization,
    nameRequired
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  return /* @__PURE__ */ jsx(
    UpdateFieldCard,
    {
      className,
      classNames,
      value: sessionData == null ? void 0 : sessionData.user.name,
      description: localization.NAME_DESCRIPTION,
      name: "name",
      instructions: localization.NAME_INSTRUCTIONS,
      label: localization.NAME,
      localization,
      placeholder: localization.NAME_PLACEHOLDER,
      required: nameRequired,
      ...props
    }
  );
}
function UpdateUsernameCard({
  className,
  classNames,
  localization,
  ...props
}) {
  var _a, _b;
  const {
    hooks: { useSession },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const value = ((_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.displayUsername) || ((_b = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _b.username);
  return /* @__PURE__ */ jsx(
    UpdateFieldCard,
    {
      className,
      classNames,
      value,
      description: localization.USERNAME_DESCRIPTION,
      name: "username",
      instructions: localization.USERNAME_INSTRUCTIONS,
      label: localization.USERNAME,
      localization,
      placeholder: localization.USERNAME_PLACEHOLDER,
      required: true,
      ...props
    }
  );
}
function ChangeEmailCard({
  className,
  classNames,
  localization,
  ...props
}) {
  const {
    authClient,
    emailVerification,
    hooks: { useSession },
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, isPending, refetch } = useSession();
  const [resendDisabled, setResendDisabled] = useState(false);
  const formSchema = object({
    email: string().email({ message: localization.INVALID_EMAIL })
  });
  const form = useForm({
    resolver: u(formSchema),
    values: {
      email: (sessionData == null ? void 0 : sessionData.user.email) || ""
    }
  });
  const resendForm = useForm();
  const { isSubmitting } = form.formState;
  const changeEmail = async ({ email }) => {
    if (email === (sessionData == null ? void 0 : sessionData.user.email)) {
      await new Promise((resolve) => setTimeout(resolve));
      toast({
        variant: "error",
        message: localization.EMAIL_IS_THE_SAME
      });
      return;
    }
    try {
      await authClient.changeEmail({
        newEmail: email,
        callbackURL: window.location.pathname,
        fetchOptions: { throw: true }
      });
      if (sessionData == null ? void 0 : sessionData.user.emailVerified) {
        toast({
          variant: "success",
          message: localization.EMAIL_VERIFY_CHANGE
        });
      } else {
        await (refetch == null ? void 0 : refetch());
        toast({
          variant: "success",
          message: `${localization.EMAIL} ${localization.UPDATED_SUCCESSFULLY}`
        });
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
  const resendVerification = async () => {
    if (!sessionData) return;
    const email = sessionData.user.email;
    setResendDisabled(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.EMAIL_VERIFY_CHANGE
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
      setResendDisabled(false);
      throw error;
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx(
      "form",
      {
        method: "POST",
        noValidate: true,
        onSubmit: form.handleSubmit(changeEmail),
        children: /* @__PURE__ */ jsx(
          SettingsCard,
          {
            className,
            classNames,
            description: localization.EMAIL_DESCRIPTION,
            instructions: localization.EMAIL_INSTRUCTIONS,
            isPending,
            title: localization.EMAIL,
            actionLabel: localization.SAVE,
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
                name: "email",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    Input,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      placeholder: localization.EMAIL_PLACEHOLDER,
                      type: "email",
                      disabled: isSubmitting,
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
    ) }),
    emailVerification && (sessionData == null ? void 0 : sessionData.user) && !(sessionData == null ? void 0 : sessionData.user.emailVerified) && /* @__PURE__ */ jsx(Form, { ...resendForm, children: /* @__PURE__ */ jsx(
      "form",
      {
        method: "POST",
        onSubmit: resendForm.handleSubmit(
          resendVerification
        ),
        children: /* @__PURE__ */ jsx(
          SettingsCard,
          {
            className,
            classNames,
            title: localization.VERIFY_YOUR_EMAIL,
            description: localization.VERIFY_YOUR_EMAIL_DESCRIPTION,
            actionLabel: localization.RESEND_VERIFICATION_EMAIL,
            disabled: resendDisabled,
            ...props
          }
        )
      }
    ) })
  ] });
}
function AccountSettingsCards({
  className,
  classNames,
  localization
}) {
  var _a, _b, _c;
  const {
    additionalFields,
    avatar,
    changeEmail,
    credentials,
    hooks: { useSession },
    multiSession,
    account: accountOptions
  } = useContext(AuthUIContext);
  const { data: sessionData } = useSession();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        ((_a = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _a.includes("image")) && avatar && /* @__PURE__ */ jsx(
          UpdateAvatarCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        (credentials == null ? void 0 : credentials.username) && /* @__PURE__ */ jsx(
          UpdateUsernameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        ((_b = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _b.includes("name")) && /* @__PURE__ */ jsx(
          UpdateNameCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        changeEmail && /* @__PURE__ */ jsx(
          ChangeEmailCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        (_c = accountOptions == null ? void 0 : accountOptions.fields) == null ? void 0 : _c.map((field) => {
          if (field === "image") return null;
          if (field === "name") return null;
          const additionalField = additionalFields == null ? void 0 : additionalFields[field];
          if (!additionalField) return null;
          const {
            label,
            description,
            instructions,
            placeholder,
            required,
            type,
            multiline,
            validate,
            errorMessage
          } = additionalField;
          const defaultValue = sessionData == null ? void 0 : sessionData.user[field];
          return /* @__PURE__ */ jsx(
            UpdateFieldCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              value: defaultValue,
              description,
              name: field,
              instructions,
              label,
              localization,
              placeholder,
              required,
              type,
              multiline,
              validate,
              errorMessage
            },
            field
          );
        }),
        multiSession && /* @__PURE__ */ jsx(
          AccountsCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        )
      ]
    }
  );
}
function DeleteAccountDialog({
  classNames,
  accounts,
  localization,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    basePath,
    baseURL,
    deleteUser,
    freshAge,
    hooks: { useSession },
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const user = sessionData == null ? void 0 : sessionData.user;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  const formSchema = object({
    password: credentialsLinked ? string().min(1, { message: localization.PASSWORD_REQUIRED }) : string().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      password: ""
    }
  });
  const { isSubmitting } = form.formState;
  const deleteAccount = async ({ password }) => {
    const params = {};
    if (credentialsLinked) {
      params.password = password;
    } else if (!isFresh) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }
    if (deleteUser == null ? void 0 : deleteUser.verification) {
      params.callbackURL = `${baseURL}${basePath}/${viewPaths.SIGN_OUT}`;
    }
    try {
      await authClient.deleteUser({
        ...params,
        fetchOptions: {
          throw: true
        }
      });
      if (deleteUser == null ? void 0 : deleteUser.verification) {
        toast({
          variant: "success",
          message: localization.DELETE_ACCOUNT_VERIFY
        });
      } else {
        toast({
          variant: "success",
          message: localization.DELETE_ACCOUNT_SUCCESS
        });
        navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
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
    onOpenChange == null ? void 0 : onOpenChange(false);
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
              children: localization == null ? void 0 : localization.DELETE_ACCOUNT
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: isFresh ? localization == null ? void 0 : localization.DELETE_ACCOUNT_INSTRUCTIONS : localization == null ? void 0 : localization.SESSION_NOT_FRESH
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Card, { className: cn("my-2 flex-row p-4", classNames == null ? void 0 : classNames.cell), children: /* @__PURE__ */ jsx(UserView, { user, localization }) }),
        /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
          "form",
          {
            method: "POST",
            onSubmit: form.handleSubmit(deleteAccount),
            className: "grid gap-6",
            children: [
              credentialsLinked && /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "password",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsx(
                      FormLabel,
                      {
                        className: classNames == null ? void 0 : classNames.label,
                        children: localization == null ? void 0 : localization.PASSWORD
                      }
                    ),
                    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                      Input,
                      {
                        autoComplete: "current-password",
                        placeholder: localization == null ? void 0 : localization.PASSWORD_PLACEHOLDER,
                        type: "password",
                        className: classNames == null ? void 0 : classNames.input,
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
                      isSubmitting && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                      isFresh ? localization == null ? void 0 : localization.DELETE_ACCOUNT : localization == null ? void 0 : localization.SIGN_OUT
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
function DeleteAccountCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook
}) {
  const {
    hooks: { useListAccounts },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [showDialog, setShowDialog] = useState(false);
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization == null ? void 0 : localization.DELETE_ACCOUNT,
        description: localization == null ? void 0 : localization.DELETE_ACCOUNT_DESCRIPTION,
        isPending,
        title: localization == null ? void 0 : localization.DELETE_ACCOUNT,
        variant: "destructive",
        action: () => setShowDialog(true)
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteAccountDialog,
      {
        classNames,
        accounts,
        localization,
        open: showDialog,
        onOpenChange: setShowDialog
      }
    )
  ] });
}
function SessionFreshnessDialog({
  classNames,
  localization,
  title,
  description,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    basePath,
    localization: contextLocalization,
    viewPaths,
    navigate
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const handleSignOut = () => {
    navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
    onOpenChange == null ? void 0 : onOpenChange(false);
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
              children: title || (localization == null ? void 0 : localization.SESSION_EXPIRED) || "Session Expired"
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: description || (localization == null ? void 0 : localization.SESSION_NOT_FRESH)
            }
          )
        ] }),
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
          /* @__PURE__ */ jsx(
            Button,
            {
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              variant: "default",
              onClick: handleSignOut,
              children: localization == null ? void 0 : localization.SIGN_OUT
            }
          )
        ] })
      ]
    }
  ) });
}
function PasskeyCell({
  className,
  classNames,
  localization,
  passkey
}) {
  const {
    freshAge,
    hooks: { useSession, useListPasskeys },
    localization: contextLocalization,
    mutators: { deletePasskey },
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { refetch } = useListPasskeys();
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const [showFreshnessDialog, setShowFreshnessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeletePasskey = async () => {
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }
    setIsLoading(true);
    try {
      await deletePasskey({ id: passkey.id });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      setIsLoading(false);
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SessionFreshnessDialog,
      {
        open: showFreshnessDialog,
        onOpenChange: setShowFreshnessDialog,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsxs(
      Card,
      {
        className: cn(
          "flex-row items-center p-4",
          className,
          classNames == null ? void 0 : classNames.cell
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              FingerprintPattern,
              {
                className: cn("size-4", classNames == null ? void 0 : classNames.icon)
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: new Date(passkey.createdAt).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              disabled: isLoading,
              size: "sm",
              variant: "outline",
              onClick: handleDeletePasskey,
              children: [
                isLoading && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ]
      }
    )
  ] });
}
function PasskeysCard({
  className,
  classNames,
  localization
}) {
  const {
    authClient,
    freshAge,
    hooks: { useListPasskeys, useSession },
    localization: authLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...authLocalization, ...localization };
  const { data: passkeys, isPending, refetch } = useListPasskeys();
  const { data: sessionData } = useSession();
  const session = sessionData == null ? void 0 : sessionData.session;
  const isFresh = session ? Date.now() - new Date(session == null ? void 0 : session.createdAt).getTime() < freshAge * 1e3 : false;
  const [showFreshnessDialog, setShowFreshnessDialog] = useState(false);
  const addPasskey = async () => {
    if (!isFresh) {
      setShowFreshnessDialog(true);
      return;
    }
    try {
      await authClient.passkey.addPasskey({
        fetchOptions: { throw: true }
      });
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
    }
  };
  const form = useForm();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SessionFreshnessDialog,
      {
        open: showFreshnessDialog,
        onOpenChange: setShowFreshnessDialog,
        classNames,
        localization
      }
    ),
    /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx("form", { method: "POST", onSubmit: form.handleSubmit(addPasskey), children: /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.ADD_PASSKEY,
        description: localization.PASSKEYS_DESCRIPTION,
        instructions: localization.PASSKEYS_INSTRUCTIONS,
        isPending,
        title: localization.PASSKEYS,
        children: passkeys && passkeys.length > 0 && /* @__PURE__ */ jsx(
          CardContent,
          {
            className: cn(
              "grid gap-4",
              classNames == null ? void 0 : classNames.content
            ),
            children: passkeys == null ? void 0 : passkeys.map((passkey) => /* @__PURE__ */ jsx(
              PasskeyCell,
              {
                classNames,
                localization,
                passkey
              },
              passkey.id
            ))
          }
        )
      }
    ) }) })
  ] });
}
function useIsOverflow() {
  const [isOverflow, setIsOverflow] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(void 0);
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsOverflow(false);
      return;
    }
    const currentTrigger = element.textContent;
    if (triggerRef.current !== currentTrigger) {
      triggerRef.current = currentTrigger;
      setIsOverflow(false);
    }
    const checkOverflow = () => {
      setIsOverflow(element.offsetWidth < element.scrollWidth);
    };
    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  });
  return { ref, isOverflow };
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(
    Content2,
    {
      className: cn(
        "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-foreground px-3 py-1.5 text-background text-xs data-[state=closed]:animate-out",
        className
      ),
      "data-slot": "tooltip-content",
      sideOffset,
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(Arrow2, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}
function ProviderCell({
  className,
  classNames,
  account,
  localization,
  other,
  provider,
  refetch
}) {
  const {
    authClient,
    basePath,
    baseURL,
    localization: contextLocalization,
    mutators: { unlinkAccount },
    viewPaths,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [isLoading, setIsLoading] = useState(false);
  const handleLink = async () => {
    setIsLoading(true);
    const callbackURL = `${baseURL}${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(window.location.pathname)}`;
    try {
      if (other) {
        await authClient.oauth2.link({
          providerId: provider.provider,
          callbackURL,
          fetchOptions: { throw: true }
        });
      } else {
        await authClient.linkSocial({
          provider: provider.provider,
          callbackURL,
          fetchOptions: { throw: true }
        });
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
      setIsLoading(false);
    }
  };
  const handleUnlink = async () => {
    setIsLoading(true);
    try {
      await unlinkAccount({
        accountId: account == null ? void 0 : account.accountId,
        providerId: provider.provider
      });
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
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "min-w-0 flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsx(
          ProviderCellContent,
          {
            account,
            provider,
            classNames
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: cn("relative ms-auto shrink-0", classNames == null ? void 0 : classNames.button),
            disabled: isLoading,
            size: "sm",
            type: "button",
            variant: account ? "outline" : "default",
            onClick: account ? handleUnlink : handleLink,
            children: [
              isLoading && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
              account ? localization.UNLINK : localization.LINK
            ]
          }
        )
      ]
    }
  );
}
function ProviderCellContent({
  account,
  classNames,
  provider
}) {
  if (account) {
    return /* @__PURE__ */ jsx(
      ConnectedProviderContent,
      {
        account,
        classNames,
        provider
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: /* @__PURE__ */ jsx(ProviderContent, { classNames, provider }) });
}
function ConnectedProviderContent({
  account,
  classNames,
  provider
}) {
  const {
    hooks: { useAccountInfo }
  } = useContext(AuthUIContext);
  const { data: accountInfo, isPending } = useAccountInfo({
    query: { accountId: account.accountId }
  });
  const email = accountInfo == null ? void 0 : accountInfo.user.email;
  const { ref: emailRef, isOverflow } = useIsOverflow();
  const emailElement = isPending ? /* @__PURE__ */ jsx(Skeleton, { className: "my-0.5 h-3 w-28" }) : email ? /* @__PURE__ */ jsx("span", { ref: emailRef, className: "truncate text-muted-foreground text-xs", children: email }) : null;
  const content = /* @__PURE__ */ jsx(
    ProviderContent,
    {
      accountInfo: emailElement,
      classNames,
      provider
    }
  );
  const wrapperClassName = "flex min-w-0 flex-1 items-center gap-3";
  if (email && isOverflow) {
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: cn(wrapperClassName, "cursor-default"), children: content }) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("p", { children: email }) })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: wrapperClassName, children: content });
}
function ProviderContent({
  accountInfo,
  classNames,
  provider
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    provider.icon && /* @__PURE__ */ jsx(
      provider.icon,
      {
        className: cn("size-4 shrink-0", classNames == null ? void 0 : classNames.icon)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: provider.name }),
      accountInfo
    ] })
  ] });
}
function ProvidersCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
  refetch
}) {
  var _a, _b, _c;
  const {
    hooks: { useListAccounts },
    localization: contextLocalization,
    social,
    genericOAuth
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
    refetch = result.refetch;
  }
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      title: localization.PROVIDERS,
      description: localization.PROVIDERS_DESCRIPTION,
      isPending,
      children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? (_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.map((provider) => /* @__PURE__ */ jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        provider
      )) : /* @__PURE__ */ jsxs(Fragment, { children: [
        accounts == null ? void 0 : accounts.map((account) => {
          var _a2;
          const socialProvider = socialProviders.find(
            (sp) => sp.provider === account.providerId
          );
          const genericOAuthProvider = (_a2 = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _a2.find(
            (gp) => gp.provider === account.providerId
          );
          const provider = socialProvider || genericOAuthProvider;
          if (!provider) return null;
          return /* @__PURE__ */ jsx(
            ProviderCell,
            {
              classNames,
              account,
              provider,
              refetch,
              other: !socialProvider
            },
            account.providerId
          );
        }),
        (_b = social == null ? void 0 : social.providers) == null ? void 0 : _b.map((provider) => {
          const socialProvider = socialProviders.find(
            (socialProvider2) => socialProvider2.provider === provider
          );
          if (!socialProvider) return null;
          return /* @__PURE__ */ jsx(
            ProviderCell,
            {
              classNames,
              provider: socialProvider,
              refetch
            },
            provider
          );
        }),
        (_c = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _c.map((provider) => /* @__PURE__ */ jsx(
          ProviderCell,
          {
            classNames,
            account: accounts == null ? void 0 : accounts.find(
              (acc) => acc.providerId === provider.provider
            ),
            provider,
            refetch,
            other: true
          },
          provider.provider
        ))
      ] }) })
    }
  );
}
function InputFieldSkeleton({
  classNames
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: cn("h-4 w-32", classNames == null ? void 0 : classNames.skeleton) }),
    /* @__PURE__ */ jsx(Skeleton, { className: cn("h-9 w-full", classNames == null ? void 0 : classNames.skeleton) })
  ] });
}
function ChangePasswordCard({
  className,
  classNames,
  accounts,
  isPending,
  localization,
  skipHook,
  passwordValidation
}) {
  const {
    authClient,
    basePath,
    baseURL,
    credentials,
    hooks: { useSession, useListAccounts },
    localization: contextLocalization,
    navigate,
    viewPaths,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const { data: sessionData } = useSession();
  if (!skipHook) {
    const result = useListAccounts();
    accounts = result.data;
    isPending = result.isPending;
  }
  const formSchema = object({
    currentPassword: getPasswordSchema(
      passwordValidation,
      localization
    ),
    newPassword: getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.NEW_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }),
    confirmPassword: confirmPasswordEnabled ? getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }) : string().optional()
  }).refine(
    (data) => !confirmPasswordEnabled || data.newPassword === data.confirmPassword,
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  const setPasswordForm = useForm();
  const { isSubmitting } = form.formState;
  const setPassword = async () => {
    if (!sessionData) return;
    const email = sessionData == null ? void 0 : sessionData.user.email;
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions: {
          throw: true,
          headers: await getCaptchaHeaders("/forget-password")
        }
      });
      toast({
        variant: "success",
        message: localization.FORGOT_PASSWORD_EMAIL
      });
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      resetCaptcha();
    }
  };
  const changePassword = async ({
    currentPassword,
    newPassword
  }) => {
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.CHANGE_PASSWORD_SUCCESS
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
    form.reset();
  };
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  if (!isPending && !credentialsLinked) {
    return /* @__PURE__ */ jsx(Form, { ...setPasswordForm, children: /* @__PURE__ */ jsx(
      "form",
      {
        method: "POST",
        onSubmit: setPasswordForm.handleSubmit(setPassword),
        children: /* @__PURE__ */ jsx(
          SettingsCard,
          {
            title: localization.SET_PASSWORD,
            description: localization.SET_PASSWORD_DESCRIPTION,
            actionLabel: localization.SET_PASSWORD,
            isPending,
            className,
            classNames,
            children: /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-sm", children: /* @__PURE__ */ jsx(
              Captcha,
              {
                ref: captchaRef,
                localization,
                action: "/forget-password"
              }
            ) })
          }
        )
      }
    ) });
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsx("form", { method: "POST", onSubmit: form.handleSubmit(changePassword), children: /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      actionLabel: localization.SAVE,
      description: localization.CHANGE_PASSWORD_DESCRIPTION,
      instructions: localization.CHANGE_PASSWORD_INSTRUCTIONS,
      isPending,
      title: localization.CHANGE_PASSWORD,
      children: /* @__PURE__ */ jsx(
        CardContent,
        {
          className: cn("grid gap-6", classNames == null ? void 0 : classNames.content),
          children: isPending || !accounts ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(InputFieldSkeleton, { classNames }),
            /* @__PURE__ */ jsx(InputFieldSkeleton, { classNames }),
            confirmPasswordEnabled && /* @__PURE__ */ jsx(
              InputFieldSkeleton,
              {
                classNames
              }
            )
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "currentPassword",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.CURRENT_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "current-password",
                      placeholder: localization.CURRENT_PASSWORD_PLACEHOLDER,
                      disabled: isSubmitting,
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
            /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "newPassword",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.NEW_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "new-password",
                      disabled: isSubmitting,
                      placeholder: localization.NEW_PASSWORD_PLACEHOLDER,
                      enableToggle: true,
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
            confirmPasswordEnabled && /* @__PURE__ */ jsx(
              FormField,
              {
                control: form.control,
                name: "confirmPassword",
                render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.CONFIRM_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                    PasswordInput,
                    {
                      className: classNames == null ? void 0 : classNames.input,
                      autoComplete: "new-password",
                      placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                      disabled: isSubmitting,
                      enableToggle: true,
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
            )
          ] })
        }
      )
    }
  ) }) });
}
function SessionCell({
  className,
  classNames,
  localization,
  session,
  refetch
}) {
  var _a, _b;
  const {
    basePath,
    hooks: { useSession },
    localization: contextLocalization,
    mutators: { revokeSession },
    viewPaths,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData } = useSession();
  const isCurrentSession = session.id === ((_a = sessionData == null ? void 0 : sessionData.session) == null ? void 0 : _a.id);
  const [isLoading, setIsLoading] = useState(false);
  const handleRevoke = async () => {
    setIsLoading(true);
    if (isCurrentSession) {
      navigate(`${basePath}/${viewPaths.SIGN_OUT}`);
      return;
    }
    try {
      await revokeSession({ token: session.token });
      refetch == null ? void 0 : refetch();
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      setIsLoading(false);
    }
  };
  const parsed = session.userAgent ? Bowser.parse(session.userAgent) : null;
  const isMobile = (parsed == null ? void 0 : parsed.platform.type) === "mobile";
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        className,
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        isMobile ? /* @__PURE__ */ jsx(Smartphone, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }) : /* @__PURE__ */ jsx(Laptop, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: isCurrentSession ? localization.CURRENT_SESSION : session == null ? void 0 : session.ipAddress }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: ((_b = session.userAgent) == null ? void 0 : _b.includes("tauri-plugin-http")) ? localization.APP : (parsed == null ? void 0 : parsed.os.name) && (parsed == null ? void 0 : parsed.browser.name) ? `${parsed.os.name}, ${parsed.browser.name}` : (parsed == null ? void 0 : parsed.os.name) || (parsed == null ? void 0 : parsed.browser.name) || session.userAgent || localization.UNKNOWN })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: cn(
              "relative ms-auto",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.outlineButton
            ),
            disabled: isLoading,
            size: "sm",
            variant: "outline",
            onClick: handleRevoke,
            children: [
              isLoading && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
              isCurrentSession ? localization.SIGN_OUT : localization.REVOKE
            ]
          }
        )
      ]
    }
  );
}
function SessionsCard({
  className,
  classNames,
  localization
}) {
  const {
    hooks: { useListSessions },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessions, isPending, refetch } = useListSessions();
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      description: localization.SESSIONS_DESCRIPTION,
      isPending,
      title: localization.SESSIONS,
      children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        "skeleton"
      ) : sessions == null ? void 0 : sessions.map((session) => /* @__PURE__ */ jsx(
        SessionCell,
        {
          classNames,
          localization,
          session,
          refetch
        },
        session.id
      )) })
    }
  );
}
function BackupCodesDialog({
  classNames,
  backupCodes,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const { localization } = useContext(AuthUIContext);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const codeText = backupCodes.join("\n");
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsx(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: localization.BACKUP_CODES
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.BACKUP_CODES_DESCRIPTION
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: backupCodes.map((code, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "rounded-md bg-muted p-2 text-center font-mono text-sm",
            children: code
          },
          index
        )) }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleCopy,
              disabled: copied,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Check, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPIED_TO_CLIPBOARD
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Copy, { className: classNames == null ? void 0 : classNames.icon }),
                localization.COPY_ALL_CODES
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "default",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: localization.CONTINUE
            }
          )
        ] })
      ]
    }
  ) });
}
function TwoFactorPasswordDialog({
  classNames,
  onOpenChange,
  isTwoFactorEnabled,
  ...props
}) {
  var _a, _b;
  const {
    localization,
    authClient,
    basePath,
    viewPaths,
    navigate,
    toast,
    twoFactor,
    localizeErrors
  } = useContext(AuthUIContext);
  const [showBackupCodesDialog, setShowBackupCodesDialog] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [totpURI, setTotpURI] = useState(null);
  const formSchema = object({
    password: string().min(1, { message: localization.PASSWORD_REQUIRED })
  });
  const form = useForm({
    resolver: u(formSchema),
    defaultValues: {
      password: ""
    }
  });
  const { isSubmitting } = form.formState;
  async function enableTwoFactor({ password }) {
    try {
      const response = await authClient.twoFactor.enable({
        password,
        fetchOptions: { throw: true }
      });
      onOpenChange == null ? void 0 : onOpenChange(false);
      setBackupCodes(response.backupCodes);
      if (twoFactor == null ? void 0 : twoFactor.includes("totp")) {
        setTotpURI(response.totpURI);
      }
      setTimeout(() => {
        setShowBackupCodesDialog(true);
      }, 250);
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
  async function disableTwoFactor({ password }) {
    try {
      await authClient.twoFactor.disable({
        password,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.TWO_FACTOR_DISABLED
      });
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
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: cn("sm:max-w-md", classNames == null ? void 0 : classNames.dialog),
        children: [
          /* @__PURE__ */ jsxs(DialogHeader, { className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.header, children: [
            /* @__PURE__ */ jsx(DialogTitle, { className: classNames == null ? void 0 : classNames.title, children: localization.TWO_FACTOR }),
            /* @__PURE__ */ jsx(DialogDescription, { className: classNames == null ? void 0 : classNames.description, children: isTwoFactorEnabled ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS })
          ] }),
          /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
            "form",
            {
              method: "POST",
              onSubmit: form.handleSubmit(
                isTwoFactorEnabled ? disableTwoFactor : enableTwoFactor
              ),
              className: "grid gap-4",
              children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "password",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.PASSWORD
                        }
                      ),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        PasswordInput,
                        {
                          className: classNames == null ? void 0 : classNames.input,
                          placeholder: localization.PASSWORD_PLACEHOLDER,
                          autoComplete: "current-password",
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
                /* @__PURE__ */ jsxs(
                  DialogFooter,
                  {
                    className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.footer,
                    children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "secondary",
                          onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
                          className: cn(
                            classNames == null ? void 0 : classNames.button,
                            classNames == null ? void 0 : classNames.secondaryButton
                          ),
                          children: localization.CANCEL
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        Button,
                        {
                          type: "submit",
                          disabled: isSubmitting,
                          className: cn(
                            classNames == null ? void 0 : classNames.button,
                            classNames == null ? void 0 : classNames.primaryButton
                          ),
                          children: [
                            isSubmitting && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                            isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR
                          ]
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      BackupCodesDialog,
      {
        classNames,
        open: showBackupCodesDialog,
        onOpenChange: (open) => {
          setShowBackupCodesDialog(open);
          if (!open) {
            const url = `${basePath}/${viewPaths.TWO_FACTOR}`;
            navigate(
              (twoFactor == null ? void 0 : twoFactor.includes("totp")) && totpURI ? `${url}?totpURI=${totpURI}` : url
            );
          }
        },
        backupCodes
      }
    )
  ] });
}
function TwoFactorCard({
  className,
  classNames,
  localization
}) {
  var _a;
  const {
    localization: contextLocalization,
    hooks: { useSession }
  } = useContext(AuthUIContext);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, isPending } = useSession();
  const isTwoFactorEnabled = (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.twoFactorEnabled;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: isTwoFactorEnabled ? localization.DISABLE_TWO_FACTOR : localization.ENABLE_TWO_FACTOR,
        description: localization.TWO_FACTOR_CARD_DESCRIPTION,
        instructions: isTwoFactorEnabled ? localization.TWO_FACTOR_DISABLE_INSTRUCTIONS : localization.TWO_FACTOR_ENABLE_INSTRUCTIONS,
        isPending,
        title: localization.TWO_FACTOR,
        action: () => setShowPasswordDialog(true)
      }
    ),
    /* @__PURE__ */ jsx(
      TwoFactorPasswordDialog,
      {
        classNames,
        open: showPasswordDialog,
        onOpenChange: setShowPasswordDialog,
        isTwoFactorEnabled: !!isTwoFactorEnabled
      }
    )
  ] });
}
function SecuritySettingsCards({
  className,
  classNames,
  localization
}) {
  var _a, _b;
  const {
    credentials,
    deleteUser,
    hooks,
    localization: contextLocalization,
    passkey,
    social,
    genericOAuth,
    twoFactor
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { useListAccounts } = hooks;
  const {
    data: accounts,
    isPending: accountsPending,
    refetch: refetchAccounts
  } = useListAccounts();
  const credentialsLinked = accounts == null ? void 0 : accounts.some(
    (acc) => acc.providerId === "credential"
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex w-full flex-col gap-4 md:gap-6",
        className,
        classNames == null ? void 0 : classNames.cards
      ),
      children: [
        credentials && /* @__PURE__ */ jsx(
          ChangePasswordCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            skipHook: true
          }
        ),
        (((_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.length) || ((_b = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _b.length)) && /* @__PURE__ */ jsx(
          ProvidersCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            refetch: refetchAccounts,
            skipHook: true
          }
        ),
        twoFactor && credentialsLinked && /* @__PURE__ */ jsx(
          TwoFactorCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        passkey && /* @__PURE__ */ jsx(
          PasskeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        /* @__PURE__ */ jsx(
          SessionsCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        deleteUser && /* @__PURE__ */ jsx(
          DeleteAccountCard,
          {
            accounts,
            classNames: classNames == null ? void 0 : classNames.card,
            isPending: accountsPending,
            localization,
            skipHook: true
          }
        )
      ]
    }
  );
}
function UserTeamCell({
  className,
  classNames,
  team,
  localization,
  refetch
}) {
  var _a;
  const {
    authClient,
    hooks: { useSession },
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: sessionData, refetch: refetchSession } = useSession();
  const isCurrentTeam = team.id === ((_a = sessionData == null ? void 0 : sessionData.session) == null ? void 0 : _a.activeTeamId);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleSetActiveTeam = async () => {
    try {
      setIsUpdating(true);
      await authClient.organization.setActiveTeam({
        teamId: team.id,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.UPDATE_TEAM_SUCCESS
      });
      await (refetchSession == null ? void 0 : refetchSession());
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
          Users,
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
            disabled: isCurrentTeam || isUpdating,
            size: "sm",
            variant: "outline",
            onClick: handleSetActiveTeam,
            children: [
              isUpdating && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
              isCurrentTeam ? localization.TEAM_ACTIVE : localization.TEAM_SET_ACTIVE
            ]
          }
        )
      ]
    }
  );
}
function UserTeamsCard({
  className,
  classNames,
  localization
}) {
  const {
    hooks: { useListUserTeams },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: teams, isPending, refetch } = useListUserTeams();
  return /* @__PURE__ */ jsx(
    SettingsCard,
    {
      className,
      classNames,
      description: localization.USER_TEAMS_DESCRIPTION,
      isPending,
      title: localization.TEAMS,
      children: /* @__PURE__ */ jsx(CardContent, { className: cn("grid gap-4", classNames == null ? void 0 : classNames.content), children: isPending ? /* @__PURE__ */ jsx(
        SettingsCellSkeleton,
        {
          classNames
        },
        "skeleton"
      ) : teams && teams.length > 0 ? teams.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ).map((team) => /* @__PURE__ */ jsx(
        UserTeamCell,
        {
          classNames,
          localization,
          refetch,
          team
        },
        team.id
      )) : /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: localization.NO_TEAMS_FOUND }) })
    }
  );
}
function AccountView({
  className,
  classNames,
  localization: localizationProp,
  path: pathProp,
  pathname,
  view: viewProp,
  hideNav,
  showTeams
}) {
  var _a, _b;
  const {
    apiKey,
    teams: teamOptions,
    localization: contextLocalization,
    organization,
    account: accountOptions,
    Link
  } = useContext(AuthUIContext);
  if (!accountOptions) {
    return null;
  }
  const { enabled: teamsEnabled } = teamOptions || {};
  useAuthenticate();
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(accountOptions.viewPaths, path) || "SETTINGS";
  const navItems = [
    { view: "SETTINGS", label: localization.ACCOUNT },
    { view: "SECURITY", label: localization.SECURITY }
  ];
  if (teamsEnabled && showTeams) {
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
  if (organization) {
    navItems.push({
      view: "ORGANIZATIONS",
      label: localization.ORGANIZATIONS
    });
  }
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
          /* @__PURE__ */ jsx(Label2, { className: "font-semibold text-base", children: (_a = navItems.find((i) => i.view === view)) == null ? void 0 : _a.label }),
          /* @__PURE__ */ jsxs(Drawer, { children: [
            /* @__PURE__ */ jsx(DrawerTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", children: /* @__PURE__ */ jsx(Menu, {}) }) }),
            /* @__PURE__ */ jsxs(DrawerContent, { children: [
              /* @__PURE__ */ jsx(DrawerHeader, { children: /* @__PURE__ */ jsx(DrawerTitle, { className: "hidden", children: localization.SETTINGS }) }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col px-4 pb-4", children: navItems.map((item) => {
                var _a2;
                return /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths[item.view]}`,
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
              (_b = classNames == null ? void 0 : classNames.sidebar) == null ? void 0 : _b.base
            ),
            children: navItems.map((item) => {
              var _a2, _b2;
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: `${accountOptions == null ? void 0 : accountOptions.basePath}/${accountOptions == null ? void 0 : accountOptions.viewPaths[item.view]}`,
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
        view === "SETTINGS" && /* @__PURE__ */ jsx(
          AccountSettingsCards,
          {
            classNames,
            localization
          }
        ),
        view === "SECURITY" && /* @__PURE__ */ jsx(
          SecuritySettingsCards,
          {
            classNames,
            localization
          }
        ),
        view === "TEAMS" && teamsEnabled && showTeams && /* @__PURE__ */ jsx(
          UserTeamsCard,
          {
            classNames,
            localization
          }
        ),
        view === "API_KEYS" && /* @__PURE__ */ jsx(
          ApiKeysCard,
          {
            classNames: classNames == null ? void 0 : classNames.card,
            localization
          }
        ),
        view === "ORGANIZATIONS" && organization && /* @__PURE__ */ jsxs("div", { className: "grid w-full gap-4 md:gap-6", children: [
          /* @__PURE__ */ jsx(
            OrganizationsCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              localization
            }
          ),
          /* @__PURE__ */ jsx(
            UserInvitationsCard,
            {
              classNames: classNames == null ? void 0 : classNames.card,
              localization
            }
          )
        ] })
      ]
    }
  );
}
export {
  AccountView as A
};
