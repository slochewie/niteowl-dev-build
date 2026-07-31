import { F as Form, d as FormField, e as FormItem, h as FormLabel, f as FormControl, g as FormMessage, I as Input, U as UserAvatar } from "./chunk-52PGTSBA-BdHAHenY.mjs";
import { O as OrganizationCellView } from "./chunk-XPGLXIJB-D0r-Tyqx.mjs";
import { A as AuthUIContext, a as useLang } from "./chunk-EIO6LPR6-DGHjhJA7.mjs";
import { c as cn, C as CardContent, b as Card, S as Skeleton, B as Button, e as CardHeader, f as CardTitle, h as CardDescription, i as CardFooter, g as getLocalizedError } from "./chunk-KS7QMNEN-DP7ssmzE.mjs";
import { u as useForm, c as useFormState } from "../_libs/react-hook-form.mjs";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useContext, useMemo, useState } from "react";
import { D as Dialog$1, c as DialogContent$1, f as DialogClose, e as DialogTitle$1, g as DialogDescription$1, a as DialogPortal$1, b as DialogOverlay$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { S as Select$1, a as SelectTrigger$1, b as SelectIcon, c as SelectValue$1, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1 } from "../_libs/radix-ui__react-select.mjs";
import { D as Drawer$1 } from "../_libs/vaul.mjs";
import { aE as KeyRound, L as LoaderCircle, f as Check, g as Copy, a as ChevronDown, X, C as ChevronUp } from "../_libs/lucide-react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
function SettingsActionButton({
  classNames,
  actionLabel,
  disabled,
  isSubmitting,
  variant,
  onClick,
  ...props
}) {
  if (!onClick) {
    const formState = useFormState();
    isSubmitting = formState.isSubmitting;
  }
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        "md:ms-auto",
        classNames == null ? void 0 : classNames.button,
        variant === "default" && (classNames == null ? void 0 : classNames.primaryButton),
        variant === "destructive" && (classNames == null ? void 0 : classNames.destructiveButton)
      ),
      disabled: isSubmitting || disabled,
      size: "sm",
      type: onClick ? "button" : "submit",
      variant,
      onClick,
      ...props,
      children: [
        isSubmitting && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
        actionLabel
      ]
    }
  );
}
function SettingsCardFooter({
  className,
  classNames,
  actionLabel,
  disabled,
  instructions,
  isPending,
  isSubmitting,
  variant,
  action
}) {
  return /* @__PURE__ */ jsx(
    CardFooter,
    {
      className: cn(
        "flex flex-col justify-between gap-4 rounded-b-xl md:flex-row",
        (actionLabel || instructions) && "!py-4 border-t",
        variant === "destructive" ? "border-destructive/30 bg-destructive/15" : "bg-sidebar",
        className,
        classNames == null ? void 0 : classNames.footer
      ),
      children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
        instructions && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: cn(
              "my-0.5 h-3 w-48 max-w-full md:h-4 md:w-56",
              classNames == null ? void 0 : classNames.skeleton
            )
          }
        ),
        actionLabel && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: cn(
              "h-8 w-14 md:ms-auto",
              classNames == null ? void 0 : classNames.skeleton
            )
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        instructions && /* @__PURE__ */ jsx(
          CardDescription,
          {
            className: cn(
              "text-center text-muted-foreground text-xs md:text-start md:text-sm",
              classNames == null ? void 0 : classNames.instructions
            ),
            children: instructions
          }
        ),
        actionLabel && /* @__PURE__ */ jsx(
          SettingsActionButton,
          {
            classNames,
            actionLabel,
            disabled,
            isSubmitting,
            variant,
            onClick: action
          }
        )
      ] })
    }
  );
}
function SettingsCardHeader({
  className,
  classNames,
  description,
  isPending,
  title
}) {
  return /* @__PURE__ */ jsx(CardHeader, { className: cn(classNames == null ? void 0 : classNames.header, className), children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: cn(
          "my-0.5 h-5 w-1/3 md:h-5.5",
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    ),
    description && /* @__PURE__ */ jsx(
      Skeleton,
      {
        className: cn(
          "mt-1.5 mb-0.5 h-3 w-2/3 md:h-3.5",
          classNames == null ? void 0 : classNames.skeleton
        )
      }
    )
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      CardTitle,
      {
        className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
        children: title
      }
    ),
    description && /* @__PURE__ */ jsx(
      CardDescription,
      {
        className: cn(
          "text-xs md:text-sm",
          classNames == null ? void 0 : classNames.description
        ),
        children: description
      }
    )
  ] }) });
}
function SettingsCard({
  children,
  className,
  classNames,
  title,
  description,
  instructions,
  actionLabel,
  disabled,
  isPending,
  isSubmitting,
  optimistic,
  variant,
  action,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "w-full pb-0 text-start",
        variant === "destructive" && "border-destructive/40",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          SettingsCardHeader,
          {
            classNames,
            description,
            isPending,
            title
          }
        ),
        children,
        /* @__PURE__ */ jsx(
          SettingsCardFooter,
          {
            classNames,
            actionLabel,
            disabled,
            isPending,
            isSubmitting,
            instructions,
            optimistic,
            variant,
            action
          }
        )
      ]
    }
  );
}
function SettingsCellSkeleton({
  classNames
}) {
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        "flex-row items-center gap-3 px-4 py-3",
        classNames == null ? void 0 : classNames.cell
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn("size-5 rounded-full", classNames == null ? void 0 : classNames.skeleton)
            }
          ),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            Skeleton,
            {
              className: cn("h-4 w-24", classNames == null ? void 0 : classNames.skeleton)
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: cn("ms-auto size-8 w-12", classNames == null ? void 0 : classNames.skeleton)
          }
        )
      ]
    }
  );
}
function UserView({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsx(
          UserAvatar,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            size,
            user,
            localization
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "grid flex-1 text-start leading-tight",
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
                    size === "lg" ? "h-3.5 w-40" : "h-3 w-32",
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
                  children: (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email) || (localization == null ? void 0 : localization.USER)
                }
              ),
              !(user == null ? void 0 : user.isAnonymous) && size !== "sm" && ((user == null ? void 0 : user.name) || (user == null ? void 0 : user.username)) && /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: user == null ? void 0 : user.email
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(Dialog$1, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPortal$1, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogOverlay$1,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogContent$1,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogClose,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(X, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogTitle$1,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogDescription$1,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function ApiKeyDeleteDialog({
  classNames,
  apiKey,
  localization,
  refetch,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    localization: contextLocalization,
    mutators: { deleteApiKey },
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteApiKey({ keyId: apiKey.id });
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
    setIsLoading(false);
  };
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization.NEVER_EXPIRES;
    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(
      lang ?? "en",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    )}`;
  };
  return /* @__PURE__ */ jsx(Dialog, { onOpenChange, ...props, children: /* @__PURE__ */ jsxs(
    DialogContent,
    {
      onOpenAutoFocus: (e) => e.preventDefault(),
      className: (_a = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _a.content,
      children: [
        /* @__PURE__ */ jsxs(DialogHeader, { className: (_b = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _b.header, children: [
          /* @__PURE__ */ jsxs(
            DialogTitle,
            {
              className: cn("text-lg md:text-xl", classNames == null ? void 0 : classNames.title),
              children: [
                localization.DELETE,
                " ",
                localization.API_KEY
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.DELETE_API_KEY_CONFIRM
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
              /* @__PURE__ */ jsx(KeyRound, { className: cn("size-4", classNames == null ? void 0 : classNames.icon) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: apiKey.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-sm", children: [
                    apiKey.start,
                    "******"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: formatExpiration() })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { className: (_c = classNames == null ? void 0 : classNames.dialog) == null ? void 0 : _c.footer, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "secondary",
              onClick: () => onOpenChange == null ? void 0 : onOpenChange(false),
              disabled: isLoading,
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
              type: "button",
              variant: "destructive",
              onClick: handleDelete,
              disabled: isLoading,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              children: [
                isLoading && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                localization.DELETE
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function ApiKeyCell({
  className,
  classNames,
  apiKey,
  localization,
  refetch
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const formatExpiration = () => {
    if (!apiKey.expiresAt) return localization.NEVER_EXPIRES;
    const expiresDate = new Date(apiKey.expiresAt);
    return `${localization.EXPIRES} ${expiresDate.toLocaleDateString(
      lang ?? "en",
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    )}`;
  };
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
            KeyRound,
            {
              className: cn("size-4 flex-shrink-0", classNames == null ? void 0 : classNames.icon)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col truncate", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "truncate font-semibold text-sm", children: apiKey.name }),
              /* @__PURE__ */ jsxs("span", { className: "flex-1 truncate text-muted-foreground text-sm", children: [
                apiKey.start,
                "******"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "truncate text-muted-foreground text-xs", children: formatExpiration() })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: cn(
                "relative ms-auto",
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              size: "sm",
              variant: "outline",
              onClick: () => setShowDeleteDialog(true),
              children: localization.DELETE
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      ApiKeyDeleteDialog,
      {
        classNames,
        apiKey,
        localization,
        open: showDeleteDialog,
        onOpenChange: setShowDeleteDialog,
        refetch
      }
    )
  ] });
}
function ApiKeyDisplayDialog({
  classNames,
  apiKey,
  localization,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const { localization: contextLocalization } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
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
              children: localization.API_KEY_CREATED
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.CREATE_API_KEY_SUCCESS
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "break-all rounded-md bg-muted p-4 font-mono text-sm", children: apiKey }),
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
                localization.COPY_TO_CLIPBOARD
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
              children: localization.DONE
            }
          )
        ] })
      ]
    }
  ) });
}
function PersonalAccountView({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization
}) {
  const { localization: contextLocalization } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...propLocalization }),
    [contextLocalization, propLocalization]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2",
        className,
        classNames == null ? void 0 : classNames.base
      ),
      children: [
        /* @__PURE__ */ jsx(
          UserAvatar,
          {
            className: cn(size !== "sm" && "my-0.5"),
            classNames: classNames == null ? void 0 : classNames.avatar,
            isPending,
            localization,
            size,
            user
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "grid flex-1 text-left leading-tight",
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
                    size === "lg" ? "h-3.5 w-40" : "h-3 w-32",
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
                  children: (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email) || (localization == null ? void 0 : localization.USER)
                }
              ),
              size !== "sm" && /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    "truncate opacity-70",
                    size === "lg" ? "text-sm" : "text-xs",
                    classNames == null ? void 0 : classNames.subtitle
                  ),
                  children: localization == null ? void 0 : localization.PERSONAL_ACCOUNT
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(Select$1, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectValue$1, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectTrigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPortal, { children: /* @__PURE__ */ jsxs(
    SelectContent$1,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectViewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectItem$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectScrollUpButton$1,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectScrollDownButton$1,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDown, { className: "size-4" })
    }
  );
}
function CreateApiKeyDialog({
  classNames,
  localization,
  onSuccess,
  refetch,
  organizationId,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    apiKey,
    hooks: { useListOrganizations, useSession },
    localization: contextLocalization,
    organization: contextOrganization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { lang } = useLang();
  let organizations;
  if (contextOrganization) {
    const { data } = useListOrganizations();
    organizations = data;
  }
  const { data: sessionData } = useSession();
  const user = sessionData == null ? void 0 : sessionData.user;
  const showOrganizationSelect = contextOrganization == null ? void 0 : contextOrganization.apiKey;
  const formSchema = object({
    name: string().min(1, `${localization.NAME} ${localization.IS_REQUIRED}`),
    expiresInDays: string().optional(),
    organizationId: showOrganizationSelect ? string().min(
      1,
      `${localization.ORGANIZATION} ${localization.IS_REQUIRED}`
    ) : string().optional()
  });
  const form = useForm({
    resolver: u(formSchema),
    values: {
      name: "",
      expiresInDays: "none",
      organizationId: organizationId ?? "personal"
    }
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (values) => {
    try {
      const expiresIn = values.expiresInDays && values.expiresInDays !== "none" ? Number.parseInt(values.expiresInDays) * 60 * 60 * 24 : void 0;
      const selectedOrgId = values.organizationId === "personal" ? void 0 : values.organizationId;
      const metadata = {
        ...typeof apiKey === "object" ? apiKey.metadata : {},
        ...contextOrganization && selectedOrgId ? { organizationId: selectedOrgId } : {}
      };
      const result = await authClient.apiKey.create({
        name: values.name,
        expiresIn,
        prefix: typeof apiKey === "object" ? apiKey.prefix : void 0,
        metadata: Object.keys(metadata).length > 0 ? metadata : void 0,
        fetchOptions: { throw: true }
      });
      await (refetch == null ? void 0 : refetch());
      onSuccess(result.key);
      onOpenChange == null ? void 0 : onOpenChange(false);
      form.reset();
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
  const rtf = new Intl.RelativeTimeFormat(lang ?? "en");
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
              children: localization.CREATE_API_KEY
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.CREATE_API_KEY_DESCRIPTION
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
              showOrganizationSelect && /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "organizationId",
                  render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "w-full", children: [
                    /* @__PURE__ */ jsx(
                      FormLabel,
                      {
                        className: classNames == null ? void 0 : classNames.label,
                        children: localization.ORGANIZATION
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      Select,
                      {
                        onValueChange: field.onChange,
                        value: field.value,
                        disabled: isSubmitting,
                        children: [
                          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                            SelectTrigger,
                            {
                              className: cn(
                                "w-full p-2",
                                classNames == null ? void 0 : classNames.input
                              ),
                              children: /* @__PURE__ */ jsx(
                                SelectValue,
                                {
                                  placeholder: localization.ORGANIZATION
                                }
                              )
                            }
                          ) }),
                          /* @__PURE__ */ jsxs(SelectContent, { className: "w-[--radix-select-trigger-width]", children: [
                            /* @__PURE__ */ jsx(
                              SelectItem,
                              {
                                value: "personal",
                                className: "p-2",
                                children: /* @__PURE__ */ jsx(
                                  PersonalAccountView,
                                  {
                                    user,
                                    localization,
                                    size: "sm"
                                  }
                                )
                              }
                            ),
                            organizations == null ? void 0 : organizations.map((org) => /* @__PURE__ */ jsx(
                              SelectItem,
                              {
                                value: org.id,
                                className: "p-2",
                                children: /* @__PURE__ */ jsx(
                                  OrganizationCellView,
                                  {
                                    organization: org,
                                    localization,
                                    size: "sm"
                                  }
                                )
                              },
                              org.id
                            ))
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsx(
                  FormField,
                  {
                    control: form.control,
                    name: "name",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex-1", children: [
                      /* @__PURE__ */ jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.NAME
                        }
                      ),
                      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                        Input,
                        {
                          className: classNames == null ? void 0 : classNames.input,
                          placeholder: localization.API_KEY_NAME_PLACEHOLDER,
                          autoFocus: true,
                          disabled: isSubmitting,
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
                    name: "expiresInDays",
                    render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                      /* @__PURE__ */ jsx(
                        FormLabel,
                        {
                          className: classNames == null ? void 0 : classNames.label,
                          children: localization.EXPIRES
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        Select,
                        {
                          onValueChange: field.onChange,
                          defaultValue: field.value,
                          disabled: isSubmitting,
                          children: [
                            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                              SelectTrigger,
                              {
                                className: classNames == null ? void 0 : classNames.input,
                                children: /* @__PURE__ */ jsx(
                                  SelectValue,
                                  {
                                    placeholder: localization.NO_EXPIRATION
                                  }
                                )
                              }
                            ) }),
                            /* @__PURE__ */ jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsx(SelectItem, { value: "none", children: localization.NO_EXPIRATION }),
                              [
                                1,
                                7,
                                30,
                                60,
                                90,
                                180,
                                365
                              ].map((days) => /* @__PURE__ */ jsx(
                                SelectItem,
                                {
                                  value: days.toString(),
                                  children: days === 365 ? rtf.format(
                                    1,
                                    "year"
                                  ) : rtf.format(
                                    days,
                                    "day"
                                  )
                                },
                                days
                              ))
                            ] })
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
                    disabled: isSubmitting,
                    children: localization.CANCEL
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "submit",
                    variant: "default",
                    className: cn(
                      classNames == null ? void 0 : classNames.button,
                      classNames == null ? void 0 : classNames.primaryButton
                    ),
                    disabled: isSubmitting,
                    children: [
                      isSubmitting && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                      localization.CREATE_API_KEY
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
function ApiKeysCard({
  className,
  classNames,
  localization,
  organizationId,
  ...props
}) {
  const {
    hooks: { useListApiKeys },
    localization: contextLocalization
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { data: apiKeysRes, isPending, refetch } = useListApiKeys();
  const filteredApiKeys = useMemo(() => {
    var _a;
    return (_a = apiKeysRes == null ? void 0 : apiKeysRes.apiKeys) == null ? void 0 : _a.filter(
      (apiKey) => {
        var _a2;
        return organizationId === ((_a2 = apiKey.metadata) == null ? void 0 : _a2.organizationId);
      }
    );
  }, [apiKeysRes, organizationId]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [displayDialogOpen, setDisplayDialogOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState("");
  const handleCreateApiKey = (apiKey) => {
    setCreatedApiKey(apiKey);
    setDisplayDialogOpen(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SettingsCard,
      {
        className,
        classNames,
        actionLabel: localization.CREATE_API_KEY,
        description: localization.API_KEYS_DESCRIPTION,
        instructions: localization.API_KEYS_INSTRUCTIONS,
        isPending,
        title: localization.API_KEYS,
        action: () => setCreateDialogOpen(true),
        ...props,
        children: filteredApiKeys && filteredApiKeys.length > 0 && /* @__PURE__ */ jsx(
          CardContent,
          {
            className: cn("grid gap-4", classNames == null ? void 0 : classNames.content),
            children: filteredApiKeys == null ? void 0 : filteredApiKeys.map((apiKey) => /* @__PURE__ */ jsx(
              ApiKeyCell,
              {
                classNames,
                apiKey,
                localization,
                refetch
              },
              apiKey.id
            ))
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      CreateApiKeyDialog,
      {
        classNames,
        localization,
        open: createDialogOpen,
        onOpenChange: setCreateDialogOpen,
        onSuccess: handleCreateApiKey,
        refetch,
        organizationId
      }
    ),
    /* @__PURE__ */ jsx(
      ApiKeyDisplayDialog,
      {
        classNames,
        apiKey: createdApiKey,
        localization,
        open: displayDialogOpen,
        onOpenChange: setDisplayDialogOpen
      }
    )
  ] });
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      ),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function LeaveOrganizationDialog({
  organization,
  className,
  classNames,
  localization: localizationProp,
  onOpenChange,
  ...props
}) {
  var _a, _b, _c;
  const {
    authClient,
    hooks: { useListOrganizations },
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const localization = useMemo(
    () => ({ ...contextLocalization, ...localizationProp }),
    [contextLocalization, localizationProp]
  );
  const { refetch: refetchOrganizations } = useListOrganizations();
  const [isLeaving, setIsLeaving] = useState(false);
  const handleLeaveOrganization = async () => {
    setIsLeaving(true);
    try {
      await authClient.organization.leave({
        organizationId: organization.id,
        fetchOptions: { throw: true }
      });
      await (refetchOrganizations == null ? void 0 : refetchOrganizations());
      toast({
        variant: "success",
        message: localization.LEAVE_ORGANIZATION_SUCCESS
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
    setIsLeaving(false);
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
              children: localization.LEAVE_ORGANIZATION
            }
          ),
          /* @__PURE__ */ jsx(
            DialogDescription,
            {
              className: cn(
                "text-xs md:text-sm",
                classNames == null ? void 0 : classNames.description
              ),
              children: localization.LEAVE_ORGANIZATION_CONFIRM
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Card,
          {
            className: cn(
              "my-2 flex-row p-4",
              className,
              classNames == null ? void 0 : classNames.cell
            ),
            children: /* @__PURE__ */ jsx(
              OrganizationCellView,
              {
                organization,
                localization
              }
            )
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
              disabled: isLeaving,
              children: localization.CANCEL
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "destructive",
              onClick: handleLeaveOrganization,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.destructiveButton
              ),
              disabled: isLeaving,
              children: [
                isLeaving && /* @__PURE__ */ jsx(LoaderCircle, { className: "animate-spin" }),
                localization.LEAVE_ORGANIZATION
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  ApiKeysCard as A,
  Drawer as D,
  LeaveOrganizationDialog as L,
  SettingsCard as S,
  UserView as U,
  DrawerTrigger as a,
  DrawerContent as b,
  DrawerHeader as c,
  DrawerTitle as d,
  SettingsCellSkeleton as e,
  SettingsCardHeader as f,
  SettingsCardFooter as g,
  Select as h,
  SelectTrigger as i,
  SelectValue as j,
  SelectContent as k,
  SelectItem as l,
  Dialog as m,
  DialogContent as n,
  DialogHeader as o,
  DialogTitle as p,
  DialogDescription as q,
  DialogFooter as r
};
