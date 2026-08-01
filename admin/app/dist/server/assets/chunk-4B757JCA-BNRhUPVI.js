import { c as cn, g as getViewByPath, a as Card, e as CardHeader, f as CardTitle, h as CardDescription, C as CardContent, i as CardFooter, B as Button, d as getLocalizedError, j as getSearchParam, b as getPasswordSchema, k as isValidEmail } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { A as AuthCallback } from "./chunk-RM3CMS3T-BA2SCinp.js";
import { S as SignOut } from "./chunk-VDEJY4DC-BKV7CoXX.js";
import { u as useOnSuccessTransition } from "./chunk-J2UYHABD-DLDVTXtS.js";
import { A as AcceptInvitationCard } from "./chunk-DKFWHFFN-lEj7qXLU.js";
import { s as socialProviders, u as useCaptcha, P as PasswordInput, C as Checkbox, a as Captcha, T as Textarea } from "./chunk-2FH7HU2O-MYBnhmp_.js";
import { F as Form, d as FormField, e as FormItem, h as FormLabel, f as FormControl, I as Input, g as FormMessage, L as Label2, D as DropdownMenu, a as DropdownMenuTrigger, U as UserAvatar, b as DropdownMenuContent, c as DropdownMenuItem, r as resizeAndCropImage, i as fileToBase64 } from "./chunk-52PGTSBA-DxrPz66P.js";
import { u as useIsHydrated, A as AuthUIContext } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, LockIcon, MailIcon, FingerprintIcon, Loader2, SendIcon, QrCodeIcon, UploadCloudIcon, Trash2Icon, MinusIcon } from "lucide-react";
import * as React from "react";
import { useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import QRCode from "react-qr-code";
import { OTPInput, OTPInputContext } from "input-otp";
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function ForgotPasswordForm({
  className,
  classNames,
  isSubmitting,
  localization,
  setIsSubmitting
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    baseURL,
    localization: contextLocalization,
    navigate,
    toast,
    viewPaths,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const formSchema = z.object({
    email: z.string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }).min(1, {
      message: `${localization.EMAIL} ${localization.IS_REQUIRED}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function forgotPassword({ email }) {
    try {
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/forget-password")
      };
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
        fetchOptions
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
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(forgotPassword),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
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
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/forget-password"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.FORGOT_PASSWORD_ACTION
          }
        )
      ]
    }
  ) });
}
function MagicLinkForm({
  className,
  classNames,
  callbackURL: callbackURLProp,
  isSubmitting,
  localization,
  redirectTo: redirectToProp,
  setIsSubmitting
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    baseURL,
    persistClient,
    localization: contextLocalization,
    redirectTo: contextRedirectTo,
    viewPaths,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const getRedirectTo = useCallback(
    () => redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectToProp, contextRedirectTo]
  );
  const getCallbackURL = useCallback(
    () => `${baseURL}${callbackURLProp || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURLProp,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const formSchema = z.object({
    email: z.string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function sendMagicLink({ email }) {
    try {
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/sign-in/magic-link")
      };
      await authClient.signIn.magicLink({
        email,
        callbackURL: getCallbackURL(),
        fetchOptions
      });
      toast({
        variant: "success",
        message: localization.MAGIC_LINK_EMAIL
      });
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
      resetCaptcha();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(sendMagicLink),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
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
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-in/magic-link"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.MAGIC_LINK_ACTION
          }
        )
      ]
    }
  ) });
}
function RecoverAccountForm({
  className,
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = z.object({
    code: z.string().min(1, { message: localization.BACKUP_CODE_REQUIRED })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function verifyBackupCode({ code }) {
    try {
      await authClient.twoFactor.verifyBackupCode({
        code,
        fetchOptions: { throw: true }
      });
      await onSuccess();
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyBackupCode),
      className: cn("grid gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.BACKUP_CODE }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: localization.BACKUP_CODE_PLACEHOLDER,
                  autoComplete: "off",
                  className: classNames == null ? void 0 : classNames.input,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.RECOVER_ACCOUNT_ACTION
          }
        )
      ]
    }
  ) });
}
function ResetPasswordForm({
  className,
  classNames,
  localization,
  passwordValidation
}) {
  const tokenChecked = useRef(false);
  const {
    authClient,
    basePath,
    credentials,
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const formSchema = z.object({
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
    }) : z.string().optional()
  }).refine(
    (data) => !confirmPasswordEnabled || data.newPassword === data.confirmPassword,
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  useEffect(() => {
    if (tokenChecked.current) return;
    tokenChecked.current = true;
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    if (!token || token === "INVALID_TOKEN") {
      navigate(
        `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
      );
      toast({ variant: "error", message: localization.INVALID_TOKEN });
    }
  }, [basePath, navigate, toast, viewPaths, localization]);
  async function resetPassword({ newPassword }) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      await authClient.resetPassword({
        newPassword,
        token,
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.RESET_PASSWORD_SUCCESS
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
      form.reset();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(resetPassword),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "newPassword",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.NEW_PASSWORD }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.NEW_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        confirmPasswordEnabled && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "confirmPassword",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.CONFIRM_PASSWORD }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.RESET_PASSWORD_ACTION
          }
        )
      ]
    }
  ) });
}
function SignInForm({
  className,
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting,
  passwordValidation,
  callbackURL
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    authClient,
    basePath,
    credentials,
    localization: contextLocalization,
    viewPaths,
    navigate,
    toast,
    Link,
    localizeErrors,
    emailVerification
  } = useContext(AuthUIContext);
  const rememberMeEnabled = credentials == null ? void 0 : credentials.rememberMe;
  const usernameEnabled = credentials == null ? void 0 : credentials.username;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = z.object({
    email: usernameEnabled ? z.string().min(1, {
      message: `${localization.USERNAME} ${localization.IS_REQUIRED}`
    }) : z.string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }),
    password: getPasswordSchema(passwordValidation, localization),
    rememberMe: z.boolean().optional()
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: !rememberMeEnabled
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function signIn({
    email,
    password,
    rememberMe
  }) {
    var _a;
    try {
      let response = {};
      if (usernameEnabled && !isValidEmail(email)) {
        const fetchOptions = {
          throw: true,
          headers: await getCaptchaHeaders("/sign-in/username")
        };
        response = await authClient.signIn.username({
          username: email,
          password,
          rememberMe,
          fetchOptions,
          callbackURL
        });
      } else {
        const fetchOptions = {
          throw: true,
          headers: await getCaptchaHeaders("/sign-in/email")
        };
        response = await authClient.signIn.email({
          email,
          password,
          rememberMe,
          fetchOptions,
          callbackURL
        });
      }
      if (response.twoFactorRedirect) {
        navigate(
          `${basePath}/${viewPaths.TWO_FACTOR}${window.location.search}`
        );
      } else {
        await onSuccess();
      }
    } catch (error) {
      form.resetField("password");
      resetCaptcha();
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      if ((emailVerification == null ? void 0 : emailVerification.otp) && ((_a = error == null ? void 0 : error.error) == null ? void 0 : _a.code) === "EMAIL_NOT_VERIFIED") {
        navigate(
          `${basePath}/${viewPaths.EMAIL_VERIFICATION}?email=${encodeURIComponent(email)}`
        );
      }
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(signIn),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: usernameEnabled ? localization.USERNAME : localization.EMAIL }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  autoComplete: usernameEnabled ? "username" : "email",
                  className: classNames == null ? void 0 : classNames.input,
                  type: usernameEnabled ? "text" : "email",
                  placeholder: usernameEnabled ? localization.SIGN_IN_USERNAME_PLACEHOLDER : localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.PASSWORD }),
                (credentials == null ? void 0 : credentials.forgotPassword) && /* @__PURE__ */ jsx(
                  Link,
                  {
                    className: cn(
                      "text-sm hover:underline",
                      classNames == null ? void 0 : classNames.forgotPasswordLink
                    ),
                    href: `${basePath}/${viewPaths.FORGOT_PASSWORD}${isHydrated ? window.location.search : ""}`,
                    children: localization.FORGOT_PASSWORD_LINK
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                PasswordInput,
                {
                  autoComplete: "current-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        rememberMeEnabled && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "rememberMe",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex", children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Checkbox,
                {
                  checked: field.value,
                  onCheckedChange: field.onChange,
                  disabled: isSubmitting
                }
              ) }),
              /* @__PURE__ */ jsx(FormLabel, { children: localization.REMEMBER_ME })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-in/email"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.SIGN_IN_ACTION
          }
        )
      ]
    }
  ) });
}
function SignUpForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting,
  passwordValidation
}) {
  var _a, _b, _c, _d, _e, _f;
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
    localization
  });
  const {
    additionalFields,
    authClient,
    basePath,
    baseURL,
    credentials,
    localization: contextLocalization,
    nameRequired,
    persistClient,
    redirectTo: contextRedirectTo,
    signUp: signUpOptions,
    viewPaths,
    navigate,
    toast,
    avatar,
    localizeErrors,
    emailVerification
  } = useContext(AuthUIContext);
  const confirmPasswordEnabled = credentials == null ? void 0 : credentials.confirmPassword;
  const usernameEnabled = credentials == null ? void 0 : credentials.username;
  const usernameRequired = (credentials == null ? void 0 : credentials.usernameRequired) ?? true;
  const contextPasswordValidation = credentials == null ? void 0 : credentials.passwordValidation;
  const signUpFields = signUpOptions == null ? void 0 : signUpOptions.fields;
  localization = { ...contextLocalization, ...localization };
  passwordValidation = { ...contextPasswordValidation, ...passwordValidation };
  const fileInputRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const getRedirectTo = useCallback(
    () => redirectTo || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectTo, contextRedirectTo]
  );
  const getCallbackURL = useCallback(
    () => `${baseURL}${callbackURL || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURL,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const defaultFields = {
    email: z.string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    }),
    password: getPasswordSchema(passwordValidation, localization),
    name: (signUpFields == null ? void 0 : signUpFields.includes("name")) && nameRequired ? z.string().min(1, {
      message: `${localization.NAME} ${localization.IS_REQUIRED}`
    }) : z.string().optional(),
    image: z.string().optional(),
    username: usernameEnabled ? usernameRequired ? z.string().min(1, {
      message: `${localization.USERNAME} ${localization.IS_REQUIRED}`
    }) : z.string().optional() : z.string().optional(),
    confirmPassword: confirmPasswordEnabled ? getPasswordSchema(passwordValidation, {
      PASSWORD_REQUIRED: localization.CONFIRM_PASSWORD_REQUIRED,
      PASSWORD_TOO_SHORT: localization.PASSWORD_TOO_SHORT,
      PASSWORD_TOO_LONG: localization.PASSWORD_TOO_LONG,
      INVALID_PASSWORD: localization.INVALID_PASSWORD
    }) : z.string().optional()
  };
  const schemaFields = {};
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === "name") continue;
      if (field === "image") continue;
      const additionalField = additionalFields == null ? void 0 : additionalFields[field];
      if (!additionalField) continue;
      let fieldSchema;
      if (additionalField.type === "number") {
        fieldSchema = additionalField.required ? z.preprocess(
          (val) => !val ? void 0 : Number(val),
          z.number({
            message: ((_a = additionalField.errorMessage) == null ? void 0 : _a.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
          })
        ) : z.coerce.number({
          message: ((_b = additionalField.errorMessage) == null ? void 0 : _b.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).optional();
      } else if (additionalField.type === "boolean") {
        fieldSchema = additionalField.required ? z.coerce.boolean({
          message: ((_c = additionalField.errorMessage) == null ? void 0 : _c.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).refine((val) => val === true, {
          message: ((_d = additionalField.errorMessage) == null ? void 0 : _d.required) ?? `${additionalField.label} ${localization.IS_REQUIRED}`
        }) : z.coerce.boolean({
          message: ((_e = additionalField.errorMessage) == null ? void 0 : _e.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
        }).optional();
      } else {
        fieldSchema = additionalField.required ? z.string().min(
          1,
          ((_f = additionalField.errorMessage) == null ? void 0 : _f.required) ?? `${additionalField.label} ${localization.IS_REQUIRED}`
        ) : z.string().optional();
      }
      schemaFields[field] = fieldSchema;
    }
  }
  const formSchema = z.object(defaultFields).extend(schemaFields).refine(
    (data) => {
      if (!confirmPasswordEnabled) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: localization.PASSWORDS_DO_NOT_MATCH,
      path: ["confirmPassword"]
    }
  );
  const defaultValues = {
    email: "",
    password: "",
    ...confirmPasswordEnabled && { confirmPassword: "" },
    ...(signUpFields == null ? void 0 : signUpFields.includes("name")) ? { name: "" } : {},
    ...usernameEnabled ? { username: "" } : {},
    ...(signUpFields == null ? void 0 : signUpFields.includes("image")) && avatar ? { image: "" } : {}
  };
  if (signUpFields) {
    for (const field of signUpFields) {
      if (field === "name") continue;
      if (field === "image") continue;
      const additionalField = additionalFields == null ? void 0 : additionalFields[field];
      if (!additionalField) continue;
      defaultValues[field] = additionalField.type === "boolean" ? false : "";
    }
  }
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  const handleAvatarChange = async (file) => {
    if (!avatar) return;
    setUploadingAvatar(true);
    try {
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
      if (image) {
        setAvatarImage(image);
        form.setValue("image", image);
      } else {
        setAvatarImage(null);
        form.setValue("image", "");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
    }
    setUploadingAvatar(false);
  };
  const handleDeleteAvatar = () => {
    setAvatarImage(null);
    form.setValue("image", "");
  };
  const openFileDialog = () => {
    var _a2;
    return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  };
  async function signUp({
    email,
    password,
    name,
    username,
    confirmPassword,
    image,
    ...additionalFieldValues
  }) {
    var _a2, _b2;
    try {
      for (const [field, value] of Object.entries(
        additionalFieldValues
      )) {
        const additionalField = additionalFields == null ? void 0 : additionalFields[field];
        if (!(additionalField == null ? void 0 : additionalField.validate)) continue;
        if (typeof value === "string" && !await additionalField.validate(value)) {
          form.setError(field, {
            message: ((_a2 = additionalField.errorMessage) == null ? void 0 : _a2.validate) ?? ((_b2 = additionalField.errorMessage) == null ? void 0 : _b2.invalid) ?? `${additionalField.label} ${localization.IS_INVALID}`
          });
          return;
        }
      }
      const fetchOptions = {
        throw: true,
        headers: await getCaptchaHeaders("/sign-up/email")
      };
      const additionalParams = {};
      if (username !== void 0) {
        if (!usernameRequired && (username === null || username === "" || typeof username === "string" && username.trim() === "")) {
        } else {
          additionalParams.username = username;
        }
      }
      if (image !== void 0) {
        additionalParams.image = image;
      }
      const data = await authClient.signUp.email({
        email,
        password,
        name: name || "",
        ...additionalParams,
        ...additionalFieldValues,
        callbackURL: getCallbackURL(),
        fetchOptions
      });
      if ("token" in data && data.token) {
        await onSuccess();
      } else if (emailVerification == null ? void 0 : emailVerification.otp) {
        navigate(
          `${basePath}/${viewPaths.EMAIL_VERIFICATION}?email=${encodeURIComponent(email)}`
        );
      } else {
        navigate(
          `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
        );
        toast({
          variant: "success",
          message: localization.SIGN_UP_EMAIL
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
      form.resetField("password");
      form.resetField("confirmPassword");
      resetCaptcha();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(signUp),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        (signUpFields == null ? void 0 : signUpFields.includes("image")) && avatar && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: fileInputRef,
              accept: "image/*",
              disabled: uploadingAvatar,
              hidden: true,
              type: "file",
              onChange: (e) => {
                var _a2;
                const file = (_a2 = e.target.files) == null ? void 0 : _a2.item(0);
                if (file) handleAvatarChange(file);
                e.target.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "image",
              render: () => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { children: localization.AVATAR }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "size-fit rounded-full",
                        size: "icon",
                        variant: "ghost",
                        type: "button",
                        children: /* @__PURE__ */ jsx(
                          UserAvatar,
                          {
                            isPending: uploadingAvatar,
                            className: "size-16",
                            user: avatarImage ? {
                              name: form.watch(
                                "name"
                              ),
                              email: form.watch(
                                "email"
                              ),
                              image: avatarImage
                            } : null,
                            localization
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
                              disabled: uploadingAvatar,
                              children: [
                                /* @__PURE__ */ jsx(UploadCloudIcon, {}),
                                localization.UPLOAD_AVATAR
                              ]
                            }
                          ),
                          avatarImage && /* @__PURE__ */ jsxs(
                            DropdownMenuItem,
                            {
                              onClick: handleDeleteAvatar,
                              disabled: uploadingAvatar,
                              variant: "destructive",
                              children: [
                                /* @__PURE__ */ jsx(Trash2Icon, {}),
                                localization.DELETE_AVATAR
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
                      type: "button",
                      variant: "outline",
                      onClick: openFileDialog,
                      disabled: uploadingAvatar,
                      children: [
                        uploadingAvatar && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                        localization.UPLOAD
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        (signUpFields == null ? void 0 : signUpFields.includes("name")) && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                localization.NAME,
                !nameRequired && /* @__PURE__ */ jsx("span", { className: "ml-1 text-muted-foreground", children: localization.OPTIONAL_BRACKETS })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  autoComplete: "name",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.NAME_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        usernameEnabled && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "username",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxs(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: [
                localization.USERNAME,
                !usernameRequired && /* @__PURE__ */ jsx("span", { className: "ml-1 text-muted-foreground", children: localization.OPTIONAL_BRACKETS })
              ] }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  autoComplete: "username",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.USERNAME_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
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
                  autoComplete: "email",
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "password",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.PASSWORD }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  enableToggle: true,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        confirmPasswordEnabled && /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "confirmPassword",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.CONFIRM_PASSWORD }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                PasswordInput,
                {
                  autoComplete: "new-password",
                  className: classNames == null ? void 0 : classNames.input,
                  placeholder: localization.CONFIRM_PASSWORD_PLACEHOLDER,
                  disabled: isSubmitting,
                  enableToggle: true,
                  ...field,
                  value: field.value
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        signUpFields == null ? void 0 : signUpFields.filter((field) => field !== "name" && field !== "image").map((field) => {
          const additionalField = additionalFields == null ? void 0 : additionalFields[field];
          if (!additionalField) {
            console.error(`Additional field ${field} not found`);
            return null;
          }
          return additionalField.type === "boolean" ? /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: field,
              render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex", children: [
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    checked: formField.value,
                    onCheckedChange: formField.onChange,
                    disabled: isSubmitting
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  FormLabel,
                  {
                    className: classNames == null ? void 0 : classNames.label,
                    children: additionalField.label
                  }
                ),
                /* @__PURE__ */ jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            },
            field
          ) : /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: field,
              render: ({ field: formField }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(
                  FormLabel,
                  {
                    className: classNames == null ? void 0 : classNames.label,
                    children: additionalField.label
                  }
                ),
                /* @__PURE__ */ jsx(FormControl, { children: additionalField.type === "number" ? /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    type: "number",
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) : additionalField.multiline ? /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) : /* @__PURE__ */ jsx(
                  Input,
                  {
                    className: classNames == null ? void 0 : classNames.input,
                    type: "text",
                    placeholder: additionalField.placeholder || (typeof additionalField.label === "string" ? additionalField.label : ""),
                    disabled: isSubmitting,
                    ...formField,
                    value: formField.value
                  }
                ) }),
                /* @__PURE__ */ jsx(
                  FormMessage,
                  {
                    className: classNames == null ? void 0 : classNames.error
                  }
                )
              ] })
            },
            field
          );
        }),
        /* @__PURE__ */ jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/sign-up/email"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.SIGN_UP_ACTION
          }
        )
      ]
    }
  ) });
}
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    OTPInput,
    {
      "data-slot": "input-otp",
      containerClassName: cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      ),
      className: cn("disabled:cursor-not-allowed", className),
      ...props
    }
  );
}
function InputOTPGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "input-otp-group",
      className: cn("flex items-center", className),
      ...props
    }
  );
}
function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = (inputOTPContext == null ? void 0 : inputOTPContext.slots[index]) ?? {};
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "input-otp-slot",
      "data-active": isActive,
      className: cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-caret-blink bg-foreground h-4 w-px duration-1000" }) })
      ]
    }
  );
}
function InputOTPSeparator({ ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "input-otp-separator", role: "separator", ...props, children: /* @__PURE__ */ jsx(MinusIcon, {}) });
}
function OTPInputGroup({
  otpSeparators = 0
}) {
  if (otpSeparators === 0) {
    return /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 0 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 1 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 2 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 3 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 4 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 5 })
    ] });
  }
  if (otpSeparators === 1) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 0 }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 1 }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 2 })
      ] }),
      /* @__PURE__ */ jsx(InputOTPSeparator, {}),
      /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 3 }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 4 }),
        /* @__PURE__ */ jsx(InputOTPSlot, { index: 5 })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 0 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 1 })
    ] }),
    /* @__PURE__ */ jsx(InputOTPSeparator, {}),
    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 2 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 3 })
    ] }),
    /* @__PURE__ */ jsx(InputOTPSeparator, {}),
    /* @__PURE__ */ jsxs(InputOTPGroup, { children: [
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 4 }),
      /* @__PURE__ */ jsx(InputOTPSlot, { index: 5 })
    ] })
  ] });
}
function TwoFactorForm({
  className,
  classNames,
  isSubmitting,
  localization,
  otpSeparators = 0,
  redirectTo,
  setIsSubmitting
}) {
  var _a;
  const isHydrated = useIsHydrated();
  const totpURI = isHydrated ? getSearchParam("totpURI") : null;
  const initialSendRef = useRef(false);
  const {
    authClient,
    basePath,
    hooks: { useSession },
    localization: contextLocalization,
    twoFactor,
    viewPaths,
    toast,
    Link,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const { data: sessionData } = useSession();
  const isTwoFactorEnabled = (_a = sessionData == null ? void 0 : sessionData.user) == null ? void 0 : _a.twoFactorEnabled;
  const [method, setMethod] = useState(
    (twoFactor == null ? void 0 : twoFactor.length) === 1 ? twoFactor[0] : null
  );
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const formSchema = z.object({
    code: z.string().min(1, {
      message: `${localization.ONE_TIME_PASSWORD} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.ONE_TIME_PASSWORD} ${localization.IS_INVALID}`
    }),
    trustDevice: z.boolean().optional()
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  useEffect(() => {
    if (method === "otp" && cooldownSeconds <= 0 && !initialSendRef.current) {
      initialSendRef.current = true;
      sendOtp();
    }
  }, [method]);
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(() => {
      setCooldownSeconds((prev) => prev - 1);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);
  const sendOtp = async () => {
    if (isSendingOtp || cooldownSeconds > 0) return;
    try {
      setIsSendingOtp(true);
      await authClient.twoFactor.sendOtp({
        fetchOptions: { throw: true }
      });
      setCooldownSeconds(60);
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      if (error.error.code === "INVALID_TWO_FACTOR_COOKIE") {
        history.back();
      }
    }
    initialSendRef.current = false;
    setIsSendingOtp(false);
  };
  async function verifyCode({
    code,
    trustDevice
  }) {
    try {
      const verifyMethod = method === "totp" ? authClient.twoFactor.verifyTotp : authClient.twoFactor.verifyOtp;
      await verifyMethod({
        code,
        trustDevice,
        fetchOptions: { throw: true }
      });
      await onSuccess();
      if (sessionData && !isTwoFactorEnabled) {
        toast({
          variant: "success",
          message: localization == null ? void 0 : localization.TWO_FACTOR_ENABLED
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
      form.reset();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        (twoFactor == null ? void 0 : twoFactor.includes("totp")) && totpURI && method === "totp" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Label2, { className: classNames == null ? void 0 : classNames.label, children: localization.TWO_FACTOR_TOTP_LABEL }),
          /* @__PURE__ */ jsx(
            QRCode,
            {
              className: cn(
                "border shadow-xs",
                classNames == null ? void 0 : classNames.qrCode
              ),
              value: totpURI
            }
          )
        ] }),
        method !== null && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "code",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx(
                    FormLabel,
                    {
                      className: classNames == null ? void 0 : classNames.label,
                      children: localization.ONE_TIME_PASSWORD
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      className: cn(
                        "text-sm hover:underline",
                        classNames == null ? void 0 : classNames.forgotPasswordLink
                      ),
                      href: `${basePath}/${viewPaths.RECOVER_ACCOUNT}${isHydrated ? window.location.search : ""}`,
                      children: localization.FORGOT_AUTHENTICATOR
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  InputOTP,
                  {
                    ...field,
                    maxLength: 6,
                    onChange: (value) => {
                      field.onChange(value);
                      if (value.length === 6) {
                        form.handleSubmit(
                          verifyCode
                        )();
                      }
                    },
                    containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                    className: classNames == null ? void 0 : classNames.otpInput,
                    disabled: isSubmitting,
                    children: /* @__PURE__ */ jsx(
                      OTPInputGroup,
                      {
                        otpSeparators
                      }
                    )
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
              name: "trustDevice",
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
                /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.TRUST_DEVICE })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
          method !== null && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: isSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: [
                isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.TWO_FACTOR_ACTION
              ]
            }
          ),
          method === "otp" && (twoFactor == null ? void 0 : twoFactor.includes("otp")) && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: sendOtp,
              disabled: cooldownSeconds > 0 || isSendingOtp || isSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.outlineButton
              ),
              children: [
                isSendingOtp ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ jsx(SendIcon, { className: classNames == null ? void 0 : classNames.icon }),
                localization.RESEND_CODE,
                cooldownSeconds > 0 && ` (${cooldownSeconds})`
              ]
            }
          ),
          method !== "otp" && (twoFactor == null ? void 0 : twoFactor.includes("otp")) && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              onClick: () => setMethod("otp"),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(SendIcon, { className: classNames == null ? void 0 : classNames.icon }),
                localization.SEND_VERIFICATION_CODE
              ]
            }
          ),
          method !== "totp" && (twoFactor == null ? void 0 : twoFactor.includes("totp")) && /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.secondaryButton
              ),
              onClick: () => setMethod("totp"),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsx(QrCodeIcon, { className: classNames == null ? void 0 : classNames.icon }),
                localization.CONTINUE_WITH_AUTHENTICATOR
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function EmailOTPForm(props) {
  const [email, setEmail] = useState();
  if (!email) {
    return /* @__PURE__ */ jsx(EmailForm, { ...props, setEmail });
  }
  return /* @__PURE__ */ jsx(OTPForm, { ...props, email });
}
function EmailForm({
  className,
  classNames,
  isSubmitting,
  localization,
  setIsSubmitting,
  setEmail
}) {
  const isHydrated = useIsHydrated();
  const { captchaRef, getCaptchaHeaders } = useCaptcha({ localization });
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const formSchema = z.object({
    email: z.string().email({
      message: `${localization.EMAIL} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, setIsSubmitting]);
  async function sendEmailOTP({ email }) {
    const fetchOptions = {
      throw: true,
      headers: await getCaptchaHeaders("/email-otp/send-verification-otp")
    };
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions
      });
      toast({
        variant: "success",
        message: localization.EMAIL_OTP_VERIFICATION_SENT
      });
      setEmail(email);
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
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(sendEmailOTP),
      noValidate: isHydrated,
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
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
                  className: classNames == null ? void 0 : classNames.input,
                  type: "email",
                  placeholder: localization.EMAIL_PLACEHOLDER,
                  disabled: isSubmitting,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Captcha,
          {
            ref: captchaRef,
            localization,
            action: "/email-otp/send-verification-otp"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              "w-full",
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: isSubmitting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : localization.EMAIL_OTP_SEND_ACTION
          }
        )
      ]
    }
  ) });
}
function OTPForm({
  className,
  classNames,
  isSubmitting,
  localization,
  otpSeparators = 0,
  redirectTo,
  setIsSubmitting,
  email
}) {
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = z.object({
    code: z.string().min(1, {
      message: `${localization.EMAIL_OTP} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.EMAIL_OTP} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ""
    }
  });
  isSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  async function verifyCode({ code }) {
    try {
      await authClient.signIn.emailOtp({
        email,
        otp: code,
        fetchOptions: { throw: true }
      });
      await onSuccess();
    } catch (error) {
      toast({
        variant: "error",
        message: getLocalizedError({
          error,
          localization,
          localizeErrors
        })
      });
      form.reset();
    }
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL_OTP }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                InputOTP,
                {
                  ...field,
                  maxLength: 6,
                  onChange: (value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(verifyCode)();
                    }
                  },
                  containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                  className: classNames == null ? void 0 : classNames.otpInput,
                  disabled: isSubmitting,
                  children: /* @__PURE__ */ jsx(
                    OTPInputGroup,
                    {
                      otpSeparators
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: /* @__PURE__ */ jsxs(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: cn(
              classNames == null ? void 0 : classNames.button,
              classNames == null ? void 0 : classNames.primaryButton
            ),
            children: [
              isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
              localization.EMAIL_OTP_VERIFY_ACTION
            ]
          }
        ) })
      ]
    }
  ) });
}
function EmailVerificationForm({
  onCancel,
  localization,
  className,
  classNames,
  otpSeparators,
  callbackURL,
  isSubmitting,
  redirectTo,
  setIsSubmitting
}) {
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors,
    navigate,
    basePath,
    viewPaths
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const email = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("email") || "" : "";
  const { onSuccess, isPending: transitionPending } = useOnSuccessTransition({
    redirectTo
  });
  const formSchema = z.object({
    code: z.string().min(1, {
      message: `${localization.EMAIL_OTP} ${localization.IS_REQUIRED}`
    }).min(6, {
      message: `${localization.EMAIL_OTP} ${localization.IS_INVALID}`
    })
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ""
    }
  });
  const currentIsSubmitting = isSubmitting || form.formState.isSubmitting || transitionPending;
  useEffect(() => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(form.formState.isSubmitting || transitionPending);
  }, [form.formState.isSubmitting, transitionPending, setIsSubmitting]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1e3);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);
  async function verifyCode({ code }) {
    try {
      const data = await authClient.emailOtp.verifyEmail({
        email,
        otp: code,
        fetchOptions: { throw: true }
      });
      if ("token" in data && data.token) {
        await onSuccess();
      } else {
        navigate(
          `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
        );
        toast({
          variant: "success",
          message: localization.EMAIL_VERIFICATION_SUCCESS
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
      form.reset();
    }
  }
  async function resendCode() {
    if (resendDisabled) return;
    setResendDisabled(true);
    setCountdown(30);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
        fetchOptions: { throw: true }
      });
      toast({
        variant: "success",
        message: localization.EMAIL_OTP_VERIFICATION_SENT
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
      setCountdown(0);
    }
  }
  if (!email) {
    return /* @__PURE__ */ jsx("div", { className: cn("grid w-full gap-6", className), children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold text-destructive text-lg", children: "Invalid Request" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: localization.EMAIL_REQUIRED || "Email address is required" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs(
    "form",
    {
      method: "POST",
      onSubmit: form.handleSubmit(verifyCode),
      className: cn("grid w-full gap-6", className, classNames == null ? void 0 : classNames.base),
      children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "code",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormLabel, { className: classNames == null ? void 0 : classNames.label, children: localization.EMAIL_OTP }),
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                InputOTP,
                {
                  ...field,
                  maxLength: 6,
                  onChange: (value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(verifyCode)();
                    }
                  },
                  containerClassName: classNames == null ? void 0 : classNames.otpInputContainer,
                  className: classNames == null ? void 0 : classNames.otpInput,
                  disabled: currentIsSubmitting,
                  children: /* @__PURE__ */ jsx(
                    OTPInputGroup,
                    {
                      otpSeparators
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, { className: classNames == null ? void 0 : classNames.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: currentIsSubmitting,
              className: cn(
                classNames == null ? void 0 : classNames.button,
                classNames == null ? void 0 : classNames.primaryButton
              ),
              children: [
                currentIsSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }),
                localization.EMAIL_OTP_VERIFY_ACTION
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: resendCode,
              disabled: resendDisabled || currentIsSubmitting,
              className: cn("w-full", classNames == null ? void 0 : classNames.button),
              children: resendDisabled ? `${localization.RESEND_VERIFICATION_EMAIL} (${countdown}s)` : localization.RESEND_VERIFICATION_EMAIL
            }
          ),
          onCancel && /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onCancel,
              disabled: currentIsSubmitting,
              className: "w-full",
              children: localization.CANCEL
            }
          )
        ] })
      ]
    }
  ) });
}
function AuthForm({
  className,
  classNames,
  callbackURL,
  isSubmitting,
  localization,
  pathname,
  redirectTo,
  view,
  otpSeparators = 0,
  setIsSubmitting
}) {
  const {
    basePath,
    credentials,
    localization: contextLocalization,
    magicLink,
    emailOTP,
    signUp,
    twoFactor: twoFactorEnabled,
    viewPaths,
    replace
  } = useContext(AuthUIContext);
  const signUpEnabled = !!signUp;
  localization = { ...contextLocalization, ...localization };
  useEffect(() => {
    if (pathname && !getViewByPath(viewPaths, pathname)) {
      console.error(`Invalid auth view: ${pathname}`);
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [pathname, viewPaths, basePath, replace]);
  view = view || getViewByPath(viewPaths, pathname) || "SIGN_IN";
  useEffect(() => {
    let isInvalidView = false;
    if (view === "MAGIC_LINK" && (!magicLink || !credentials && !emailOTP)) {
      isInvalidView = true;
    }
    if (view === "EMAIL_OTP" && (!emailOTP || !credentials && !magicLink)) {
      isInvalidView = true;
    }
    if (view === "SIGN_UP" && !signUpEnabled) {
      isInvalidView = true;
    }
    if (!credentials && [
      "SIGN_UP",
      "FORGOT_PASSWORD",
      "RESET_PASSWORD",
      "TWO_FACTOR",
      "RECOVER_ACCOUNT"
    ].includes(view)) {
      isInvalidView = true;
    }
    if (["TWO_FACTOR", "RECOVER_ACCOUNT"].includes(view) && !twoFactorEnabled) {
      isInvalidView = true;
    }
    if (isInvalidView) {
      replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`);
    }
  }, [
    basePath,
    view,
    viewPaths,
    credentials,
    replace,
    emailOTP,
    signUpEnabled,
    magicLink,
    twoFactorEnabled
  ]);
  if (view === "SIGN_OUT") return /* @__PURE__ */ jsx(SignOut, { redirectTo });
  if (view === "CALLBACK") return /* @__PURE__ */ jsx(AuthCallback, { redirectTo });
  if (view === "SIGN_IN") {
    return credentials ? /* @__PURE__ */ jsx(
      SignInForm,
      {
        className,
        classNames,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting,
        callbackURL
      }
    ) : magicLink ? /* @__PURE__ */ jsx(
      MagicLinkForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    ) : emailOTP ? /* @__PURE__ */ jsx(
      EmailOTPForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    ) : null;
  }
  if (view === "TWO_FACTOR") {
    return /* @__PURE__ */ jsx(
      TwoFactorForm,
      {
        className,
        classNames,
        localization,
        otpSeparators,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "RECOVER_ACCOUNT") {
    return /* @__PURE__ */ jsx(
      RecoverAccountForm,
      {
        className,
        classNames,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "MAGIC_LINK") {
    return /* @__PURE__ */ jsx(
      MagicLinkForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "EMAIL_OTP") {
    return /* @__PURE__ */ jsx(
      EmailOTPForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "EMAIL_VERIFICATION") {
    return /* @__PURE__ */ jsx(
      EmailVerificationForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        otpSeparators,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "FORGOT_PASSWORD") {
    return /* @__PURE__ */ jsx(
      ForgotPasswordForm,
      {
        className,
        classNames,
        localization,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
  if (view === "RESET_PASSWORD") {
    return /* @__PURE__ */ jsx(
      ResetPasswordForm,
      {
        className,
        classNames,
        localization
      }
    );
  }
  if (view === "SIGN_UP") {
    return signUpEnabled && /* @__PURE__ */ jsx(
      SignUpForm,
      {
        className,
        classNames,
        callbackURL,
        localization,
        redirectTo,
        isSubmitting,
        setIsSubmitting
      }
    );
  }
}
function EmailOTPButton({
  classNames,
  isSubmitting,
  localization,
  view
}) {
  var _a, _b, _c, _d;
  const { viewPaths, navigate, basePath } = useContext(AuthUIContext);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      type: "button",
      variant: "secondary",
      onClick: () => navigate(
        `${basePath}/${view === "EMAIL_OTP" ? viewPaths.SIGN_IN : viewPaths.EMAIL_OTP}${window.location.search}`
      ),
      children: [
        view === "EMAIL_OTP" ? /* @__PURE__ */ jsx(LockIcon, { className: (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.icon }) : /* @__PURE__ */ jsx(MailIcon, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        localization.SIGN_IN_WITH,
        " ",
        view === "EMAIL_OTP" ? localization.PASSWORD : localization.EMAIL_OTP
      ]
    }
  );
}
function MagicLinkButton({
  classNames,
  isSubmitting,
  localization,
  view
}) {
  var _a, _b, _c, _d;
  const { viewPaths, navigate, basePath, credentials } = useContext(AuthUIContext);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      type: "button",
      variant: "secondary",
      onClick: () => navigate(
        `${basePath}/${view === "MAGIC_LINK" || !credentials ? viewPaths.SIGN_IN : viewPaths.MAGIC_LINK}${window.location.search}`
      ),
      children: [
        view === "MAGIC_LINK" ? /* @__PURE__ */ jsx(LockIcon, { className: (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.icon }) : /* @__PURE__ */ jsx(MailIcon, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        localization.SIGN_IN_WITH,
        " ",
        view === "MAGIC_LINK" ? localization.PASSWORD : localization.MAGIC_LINK
      ]
    }
  );
}
function OneTap({ localization, redirectTo }) {
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const oneTapFetched = useRef(false);
  localization = useMemo(
    () => ({ ...contextLocalization, ...localization }),
    [contextLocalization, localization]
  );
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  useEffect(() => {
    if (oneTapFetched.current) return;
    oneTapFetched.current = true;
    try {
      authClient.oneTap({
        fetchOptions: {
          throw: true,
          onSuccess
        }
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
  }, [authClient, localization, localizeErrors, onSuccess, toast]);
  return null;
}
function PasskeyButton({
  classNames,
  isSubmitting,
  localization,
  redirectTo,
  setIsSubmitting
}) {
  var _a, _b;
  const {
    authClient,
    localization: contextLocalization,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  const { onSuccess } = useOnSuccessTransition({ redirectTo });
  const signInPassKey = async () => {
    setIsSubmitting == null ? void 0 : setIsSubmitting(true);
    try {
      const response = await authClient.signIn.passkey({
        fetchOptions: { throw: true }
      });
      if (response == null ? void 0 : response.error) {
        toast({
          variant: "error",
          message: getLocalizedError({
            error: response.error,
            localization,
            localizeErrors
          })
        });
        setIsSubmitting == null ? void 0 : setIsSubmitting(false);
      } else {
        onSuccess();
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
      setIsSubmitting == null ? void 0 : setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        "w-full",
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.secondaryButton
      ),
      disabled: isSubmitting,
      formNoValidate: true,
      name: "passkey",
      value: "true",
      variant: "secondary",
      onClick: signInPassKey,
      children: [
        /* @__PURE__ */ jsx(FingerprintIcon, {}),
        localization.SIGN_IN_WITH,
        " ",
        localization.PASSKEY
      ]
    }
  );
}
function ProviderButton({
  className,
  classNames,
  callbackURL: callbackURLProp,
  isSubmitting,
  localization,
  other,
  provider,
  redirectTo: redirectToProp,
  socialLayout,
  setIsSubmitting
}) {
  var _a, _b, _c, _d;
  const {
    authClient,
    basePath,
    baseURL,
    persistClient,
    redirectTo: contextRedirectTo,
    viewPaths,
    social,
    genericOAuth,
    toast,
    localizeErrors
  } = useContext(AuthUIContext);
  const getRedirectTo = useCallback(
    () => redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
    [redirectToProp, contextRedirectTo]
  );
  const getCallbackURL = useCallback(
    () => `${baseURL}${callbackURLProp || (persistClient ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${encodeURIComponent(getRedirectTo())}` : getRedirectTo())}`,
    [
      callbackURLProp,
      persistClient,
      basePath,
      viewPaths,
      baseURL,
      getRedirectTo
    ]
  );
  const doSignInSocial = async () => {
    setIsSubmitting(true);
    try {
      if (other) {
        const oauth2Params = {
          providerId: provider.provider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true }
        };
        if (genericOAuth == null ? void 0 : genericOAuth.signIn) {
          await genericOAuth.signIn(oauth2Params);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 1e4);
        } else {
          await authClient.signIn.oauth2(oauth2Params);
        }
      } else {
        const socialParams = {
          provider: provider.provider,
          callbackURL: getCallbackURL(),
          fetchOptions: { throw: true }
        };
        if (social == null ? void 0 : social.signIn) {
          await social.signIn(socialParams);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 1e4);
        } else {
          await authClient.signIn.social(socialParams);
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
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        socialLayout === "vertical" ? "w-full" : "grow",
        className,
        (_a = classNames == null ? void 0 : classNames.form) == null ? void 0 : _a.button,
        (_b = classNames == null ? void 0 : classNames.form) == null ? void 0 : _b.outlineButton,
        (_c = classNames == null ? void 0 : classNames.form) == null ? void 0 : _c.providerButton
      ),
      disabled: isSubmitting,
      variant: "outline",
      onClick: doSignInSocial,
      children: [
        provider.icon && /* @__PURE__ */ jsx(provider.icon, { className: (_d = classNames == null ? void 0 : classNames.form) == null ? void 0 : _d.icon }),
        socialLayout === "grid" && provider.name,
        socialLayout === "vertical" && `${localization.SIGN_IN_WITH} ${provider.name}`
      ]
    }
  );
}
function AuthView({
  className,
  classNames,
  callbackURL,
  cardHeader,
  cardFooter,
  localization,
  path: pathProp,
  pathname,
  redirectTo,
  socialLayout: socialLayoutProp = "auto",
  view: viewProp,
  otpSeparators = 0
}) {
  var _a, _b, _c, _d, _e, _f;
  const isHydrated = useIsHydrated();
  const {
    basePath,
    credentials,
    localization: contextLocalization,
    magicLink,
    emailOTP,
    oneTap,
    passkey,
    signUp,
    social,
    genericOAuth,
    viewPaths,
    Link
  } = useContext(AuthUIContext);
  localization = { ...contextLocalization, ...localization };
  let socialLayout = socialLayoutProp;
  if (socialLayout === "auto") {
    socialLayout = !credentials ? "vertical" : (social == null ? void 0 : social.providers) && social.providers.length > 2 ? "horizontal" : "vertical";
  }
  const path = pathProp ?? (pathname == null ? void 0 : pathname.split("/").pop());
  const view = viewProp || getViewByPath(viewPaths, path) || "SIGN_IN";
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const handlePageHide = () => setIsSubmitting(false);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      setIsSubmitting(false);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
  if (view === "CALLBACK") return /* @__PURE__ */ jsx(AuthCallback, { redirectTo });
  if (view === "SIGN_OUT") return /* @__PURE__ */ jsx(SignOut, { redirectTo });
  if (view === "ACCEPT_INVITATION")
    return /* @__PURE__ */ jsx(
      AcceptInvitationCard,
      {
        className,
        classNames
      }
    );
  const description = !credentials && !magicLink && !emailOTP ? localization.DISABLED_CREDENTIALS_DESCRIPTION : localization[`${view}_DESCRIPTION`];
  return /* @__PURE__ */ jsxs(Card, { className: cn("w-full max-w-sm", className, classNames == null ? void 0 : classNames.base), children: [
    /* @__PURE__ */ jsx(CardHeader, { className: classNames == null ? void 0 : classNames.header, children: cardHeader ? cardHeader : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        CardTitle,
        {
          className: cn(
            "text-lg md:text-xl",
            classNames == null ? void 0 : classNames.title
          ),
          children: localization[view]
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
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: cn("grid gap-6", classNames == null ? void 0 : classNames.content), children: [
      oneTap && ["SIGN_IN", "SIGN_UP", "MAGIC_LINK", "EMAIL_OTP"].includes(
        view
      ) && /* @__PURE__ */ jsx(
        OneTap,
        {
          localization,
          redirectTo
        }
      ),
      (credentials || magicLink || emailOTP) && /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsx(
          AuthForm,
          {
            classNames: classNames == null ? void 0 : classNames.form,
            callbackURL,
            isSubmitting,
            localization,
            otpSeparators,
            view,
            redirectTo,
            setIsSubmitting
          }
        ),
        magicLink && (credentials && [
          "FORGOT_PASSWORD",
          "SIGN_UP",
          "SIGN_IN",
          "MAGIC_LINK",
          "EMAIL_OTP"
        ].includes(view) || emailOTP && view === "EMAIL_OTP") && /* @__PURE__ */ jsx(
          MagicLinkButton,
          {
            classNames,
            localization,
            view,
            isSubmitting
          }
        ),
        emailOTP && (credentials && [
          "FORGOT_PASSWORD",
          "SIGN_UP",
          "SIGN_IN",
          "MAGIC_LINK",
          "EMAIL_OTP"
        ].includes(view) || magicLink && ["SIGN_IN", "MAGIC_LINK"].includes(
          view
        )) && /* @__PURE__ */ jsx(
          EmailOTPButton,
          {
            classNames,
            localization,
            view,
            isSubmitting
          }
        )
      ] }),
      view !== "RESET_PASSWORD" && view !== "EMAIL_VERIFICATION" && (((_a = social == null ? void 0 : social.providers) == null ? void 0 : _a.length) || ((_b = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _b.length) || view === "SIGN_IN" && passkey) && /* @__PURE__ */ jsxs(Fragment, { children: [
        (credentials || magicLink || emailOTP) && /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-2",
              classNames == null ? void 0 : classNames.continueWith
            ),
            children: [
              /* @__PURE__ */ jsx(
                Separator,
                {
                  className: cn(
                    "!w-auto grow",
                    classNames == null ? void 0 : classNames.separator
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 text-muted-foreground text-sm", children: localization.OR_CONTINUE_WITH }),
              /* @__PURE__ */ jsx(
                Separator,
                {
                  className: cn(
                    "!w-auto grow",
                    classNames == null ? void 0 : classNames.separator
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
          (((_c = social == null ? void 0 : social.providers) == null ? void 0 : _c.length) || ((_d = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _d.length)) && /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "flex w-full items-center justify-between gap-4",
                socialLayout === "horizontal" && "flex-wrap",
                socialLayout === "vertical" && "flex-col",
                socialLayout === "grid" && "grid grid-cols-2"
              ),
              children: [
                (_e = social == null ? void 0 : social.providers) == null ? void 0 : _e.map((provider) => {
                  const socialProvider = socialProviders.find(
                    (socialProvider2) => socialProvider2.provider === provider
                  );
                  if (!socialProvider) return null;
                  return /* @__PURE__ */ jsx(
                    ProviderButton,
                    {
                      classNames,
                      callbackURL,
                      isSubmitting,
                      localization,
                      provider: socialProvider,
                      redirectTo,
                      setIsSubmitting,
                      socialLayout
                    },
                    provider
                  );
                }),
                (_f = genericOAuth == null ? void 0 : genericOAuth.providers) == null ? void 0 : _f.map(
                  (provider) => /* @__PURE__ */ jsx(
                    ProviderButton,
                    {
                      classNames,
                      callbackURL,
                      isSubmitting,
                      localization,
                      provider,
                      redirectTo,
                      setIsSubmitting,
                      socialLayout,
                      other: true
                    },
                    provider.provider
                  )
                )
              ]
            }
          ),
          passkey && [
            "SIGN_IN",
            "MAGIC_LINK",
            "EMAIL_OTP",
            "RECOVER_ACCOUNT",
            "TWO_FACTOR",
            "FORGOT_PASSWORD"
          ].includes(view) && /* @__PURE__ */ jsx(
            PasskeyButton,
            {
              classNames,
              isSubmitting,
              localization,
              redirectTo,
              setIsSubmitting
            }
          )
        ] })
      ] })
    ] }),
    cardFooter && /* @__PURE__ */ jsx(CardFooter, { className: classNames == null ? void 0 : classNames.footer, children: cardFooter }),
    credentials && signUp && /* @__PURE__ */ jsxs(
      CardFooter,
      {
        className: cn(
          "justify-center gap-1.5 text-muted-foreground text-sm",
          classNames == null ? void 0 : classNames.footer
        ),
        children: [
          view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? localization.DONT_HAVE_AN_ACCOUNT : view === "SIGN_UP" ? localization.ALREADY_HAVE_AN_ACCOUNT : /* @__PURE__ */ jsx(ArrowLeftIcon, { className: "size-3" }),
          view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" || view === "SIGN_UP" ? /* @__PURE__ */ jsx(
            Link,
            {
              className: cn(
                "text-foreground underline",
                classNames == null ? void 0 : classNames.footerLink
              ),
              href: `${basePath}/${viewPaths[view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? "SIGN_UP" : "SIGN_IN"]}${isHydrated ? window.location.search : ""}`,
              children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "link",
                  size: "sm",
                  className: cn(
                    "px-0 text-foreground underline",
                    classNames == null ? void 0 : classNames.footerLink
                  ),
                  children: view === "SIGN_IN" || view === "MAGIC_LINK" || view === "EMAIL_OTP" ? localization.SIGN_UP : localization.SIGN_IN
                }
              )
            }
          ) : /* @__PURE__ */ jsx(
            Button,
            {
              variant: "link",
              size: "sm",
              className: cn(
                "px-0 text-foreground underline",
                classNames == null ? void 0 : classNames.footerLink
              ),
              onClick: () => window.history.back(),
              children: localization.GO_BACK
            }
          )
        ]
      }
    )
  ] });
}
export {
  AuthView as A
};
