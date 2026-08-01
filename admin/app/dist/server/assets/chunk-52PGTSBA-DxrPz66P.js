import { A as Avatar, b as AvatarImage, c as AvatarFallback } from "./chunk-XPGLXIJB-gK-XK5gU.js";
import { A as AuthUIContext } from "./chunk-EIO6LPR6-BfBdj5c5.js";
import { c as cn, S as Skeleton } from "./chunk-KS7QMNEN-DP7ssmzE.js";
import { UserRoundIcon } from "lucide-react";
import * as React from "react";
import { useContext } from "react";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { jsx, jsxs } from "react/jsx-runtime";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { FormProvider, Controller, useFormContext, useFormState } from "react-hook-form";
function getGravatarUrl(email, options) {
  if (!email) return null;
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const encoder = new TextEncoder();
    const emailBytes = encoder.encode(normalizedEmail);
    const hash = bytesToHex(sha256(emailBytes));
    const extension = (options == null ? void 0 : options.jpg) ? ".jpg" : "";
    let url = `https://gravatar.com/avatar/${hash}${extension}`;
    const params = new URLSearchParams();
    if (options == null ? void 0 : options.size) {
      params.append(
        "s",
        Math.min(Math.max(options.size, 1), 2048).toString()
      );
    }
    if (options == null ? void 0 : options.d) {
      params.append("d", options.d);
    }
    if (options == null ? void 0 : options.forceDefault) {
      params.append("f", "y");
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    return url;
  } catch (error) {
    console.error("Error generating Gravatar URL:", error);
    return null;
  }
}
function UserAvatar({
  className,
  classNames,
  isPending,
  size,
  user,
  localization: propLocalization,
  ...props
}) {
  const {
    localization: contextLocalization,
    gravatar,
    avatar
  } = useContext(AuthUIContext);
  const localization = { ...contextLocalization, ...propLocalization };
  const name = (user == null ? void 0 : user.displayName) || (user == null ? void 0 : user.name) || (user == null ? void 0 : user.fullName) || (user == null ? void 0 : user.firstName) || (user == null ? void 0 : user.displayUsername) || (user == null ? void 0 : user.username) || (user == null ? void 0 : user.email);
  const userImage = (user == null ? void 0 : user.image) || (user == null ? void 0 : user.avatar) || (user == null ? void 0 : user.avatarUrl);
  const gravatarUrl = gravatar && (user == null ? void 0 : user.email) ? getGravatarUrl(
    user.email,
    gravatar === true ? void 0 : gravatar
  ) : null;
  const src = gravatar ? gravatarUrl : userImage;
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
            alt: name || (localization == null ? void 0 : localization.USER),
            className: classNames == null ? void 0 : classNames.image,
            src: src || ""
          }
        ) : /* @__PURE__ */ jsx(
          AvatarImage,
          {
            alt: name || (localization == null ? void 0 : localization.USER),
            className: classNames == null ? void 0 : classNames.image,
            src: src || void 0
          }
        ),
        /* @__PURE__ */ jsx(
          AvatarFallback,
          {
            className: cn(
              "text-foreground uppercase",
              classNames == null ? void 0 : classNames.fallback
            ),
            delayMs: src ? 600 : void 0,
            children: firstTwoCharacters(name) || /* @__PURE__ */ jsx(
              UserRoundIcon,
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
var firstTwoCharacters = (name) => name == null ? void 0 : name.slice(0, 2);
async function resizeAndCropImage(file, name, size, extension) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const minEdge = Math.min(image.width, image.height);
  const sx = (image.width - minEdge) / 2;
  const sy = (image.height - minEdge) / 2;
  const sWidth = minEdge;
  const sHeight = minEdge;
  ctx == null ? void 0 : ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, size, size);
  const resizedImageBlob = await new Promise(
    (resolve) => canvas.toBlob(resolve, `image/${extension}`)
  );
  return new File([resizedImageBlob], `${name}.${extension}`, {
    type: `image/${extension}`
  });
}
async function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      image.src = (_a = e.target) == null ? void 0 : _a.result;
    };
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Label2({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
var Form = FormProvider;
var FormFieldContext = React.createContext(
  {}
);
var FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
var useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
var FormItemContext = React.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label2,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String((error == null ? void 0 : error.message) ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
export {
  DropdownMenu as D,
  Form as F,
  Input as I,
  Label2 as L,
  UserAvatar as U,
  DropdownMenuTrigger as a,
  DropdownMenuContent as b,
  DropdownMenuItem as c,
  FormField as d,
  FormItem as e,
  FormControl as f,
  FormMessage as g,
  FormLabel as h,
  fileToBase64 as i,
  resizeAndCropImage as r
};
