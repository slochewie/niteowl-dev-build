import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, B as Button, a8 as slugify$3, a9 as createPostSchema, a7 as updatePostSchema } from "./router-qu_5GP1h.mjs";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage, f as FormDescription } from "./form-Cx2oXTTw.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { S as Switch } from "./switch-DIDzzBgm.mjs";
import { T as Textarea } from "./textarea-ClKgIhzC.mjs";
import { d as useCreatePost, e as useSuspensePost, f as useUpdatePost, g as useDeletePost, E as EmptyList, h as useTags } from "./blog-hooks-gv3MttsW.mjs";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-uhUcP2mH.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { memo, useState, useEffect, useMemo, Suspense, useRef, lazy } from "react";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MultipleSelector } from "./multi-select-CD_n40D7.mjs";
import { L as LoaderCircle, U as Upload } from "../_libs/lucide-react.mjs";
function FeaturedImageField({
  isRequired,
  value,
  onChange,
  setFeaturedImageUploading
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    uploadImage,
    Image,
    localization,
    imageInputField: ImageInput
  } = usePluginOverrides(
    "blog",
    { localization: BLOG_LOCALIZATION }
  );
  const ImageComponent = Image ? Image : DefaultImage;
  if (ImageInput) {
    return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxs(FormLabel, { children: [
        localization.BLOG_FORMS_FEATURED_IMAGE_LABEL,
        isRequired && /* @__PURE__ */ jsxs("span", { className: "text-destructive", children: [
          " ",
          localization.BLOG_FORMS_FEATURED_IMAGE_REQUIRED_ASTERISK
        ] })
      ] }),
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        ImageInput,
        {
          value: value || "",
          onChange,
          isRequired
        }
      ) }),
      /* @__PURE__ */ jsx(FormDescription, {}),
      /* @__PURE__ */ jsx(FormMessage, {})
    ] });
  }
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(localization.BLOG_FORMS_FEATURED_IMAGE_ERROR_NOT_IMAGE);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error(localization.BLOG_FORMS_FEATURED_IMAGE_ERROR_TOO_LARGE);
      return;
    }
    try {
      setIsUploading(true);
      setFeaturedImageUploading(true);
      const url = await uploadImage(file);
      onChange(url);
      toast.success(localization.BLOG_FORMS_FEATURED_IMAGE_TOAST_SUCCESS);
    } catch (error) {
      toast.error(localization.BLOG_FORMS_FEATURED_IMAGE_TOAST_FAILURE);
      console.error("Failed to upload image:", error);
      toast.error(localization.BLOG_FORMS_FEATURED_IMAGE_TOAST_FAILURE);
    } finally {
      setIsUploading(false);
      setFeaturedImageUploading(false);
    }
  };
  return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs(FormLabel, { children: [
      localization.BLOG_FORMS_FEATURED_IMAGE_LABEL,
      isRequired && /* @__PURE__ */ jsxs("span", { className: "text-destructive", children: [
        " ",
        localization.BLOG_FORMS_FEATURED_IMAGE_REQUIRED_ASTERISK
      ] })
    ] }),
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: localization.BLOG_FORMS_FEATURED_IMAGE_INPUT_PLACEHOLDER,
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            disabled: isUploading
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => fileInputRef.current?.click(),
            disabled: isUploading,
            children: isUploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              localization.BLOG_FORMS_FEATURED_IMAGE_UPLOADING_BUTTON
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
              localization.BLOG_FORMS_FEATURED_IMAGE_UPLOAD_BUTTON
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/*",
          onChange: handleImageUpload,
          className: "hidden"
        }
      ),
      isUploading && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
        /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        localization.BLOG_FORMS_FEATURED_IMAGE_UPLOADING_TEXT
      ] }),
      value && !isUploading && /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
        ImageComponent,
        {
          src: value,
          alt: localization.BLOG_FORMS_FEATURED_IMAGE_PREVIEW_ALT,
          className: "h-auto w-full max-w-xs rounded-md border",
          width: 400,
          height: 400
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(FormDescription, {}),
    /* @__PURE__ */ jsx(FormMessage, {})
  ] });
}
function DefaultImage({
  src,
  alt,
  className,
  width,
  height
}) {
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt,
      className,
      width,
      height
    }
  );
}
function TagsMultiSelect({
  value,
  onChange,
  placeholder
}) {
  const { tags } = useTags();
  const tagMap = /* @__PURE__ */ new Map();
  const idToTagMap = /* @__PURE__ */ new Map();
  (tags || []).forEach((tag) => {
    tagMap.set(tag.name.toLowerCase(), tag);
    tagMap.set(tag.slug, tag);
    idToTagMap.set(tag.id, tag);
  });
  const options = (tags || []).map((tag) => ({
    value: tag.id,
    label: tag.name
  }));
  const selectedOptions = (value || []).map((tag) => {
    if ("id" in tag && tag.id) {
      return {
        value: tag.id,
        label: tag.name
      };
    }
    const existingTag = tagMap.get(tag.name.toLowerCase());
    return {
      value: existingTag?.id || tag.name,
      label: tag.name
    };
  });
  const handleChange = (newOptions) => {
    const tagObjects = newOptions.map((option) => {
      const existingTag = idToTagMap.get(option.value) || Array.from(tagMap.values()).find(
        (tag) => tag.name.toLowerCase() === option.value.toLowerCase()
      );
      if (existingTag) {
        return {
          id: existingTag.id,
          name: existingTag.name,
          slug: existingTag.slug
        };
      }
      return { name: option.value };
    });
    onChange(tagObjects);
  };
  return /* @__PURE__ */ jsx(
    MultipleSelector,
    {
      value: selectedOptions,
      onChange: handleChange,
      placeholder: placeholder ?? "Search or create tags...",
      options,
      creatable: true,
      hidePlaceholderWhenSelected: true,
      className: "w-full"
    }
  );
}
const MarkdownEditor = lazy(
  () => import("./markdown-editor-with-overrides-lTz7qW6y.mjs").then((module) => ({
    default: module.MarkdownEditorWithOverrides
  }))
);
function PostFormBody({
  form,
  onSubmit,
  submitLabel,
  onCancel,
  disabled,
  errorMessage,
  setFeaturedImageUploading,
  initialSlugTouched = false
}) {
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const [slugTouched, setSlugTouched] = useState(initialSlugTouched);
  const nameTitle = "title";
  const nameSlug = "slug";
  const nameExcerpt = "excerpt";
  const nameImage = "image";
  const nameTags = "tags";
  const nameContent = "content";
  const namePublished = "published";
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { className: "w-full space-y-4", onSubmit: form.handleSubmit(onSubmit), children: [
    errorMessage && /* @__PURE__ */ jsx("div", { className: "rounded-md border border-red-200 bg-red-50 p-3 text-red-600 text-sm", children: errorMessage }),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: nameTitle,
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxs(FormLabel, { children: [
            localization.BLOG_FORMS_TITLE_LABEL,
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: localization.BLOG_FORMS_REQUIRED_ASTERISK })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: localization.BLOG_FORMS_TITLE_PLACEHOLDER,
              ...field,
              value: String(field.value ?? ""),
              onChange: (e) => {
                const newTitle = e.target.value;
                field.onChange(e);
                if (!slugTouched) {
                  form.setValue(nameSlug, slugify$3(newTitle));
                }
              }
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
        name: nameSlug,
        render: ({ field }) => {
          const currentTitle = form.getValues(nameTitle);
          const autoGeneratedSlug = slugify$3(String(currentTitle ?? ""));
          const currentSlug = String(field.value ?? "");
          return /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormLabel, { children: localization.BLOG_FORMS_SLUG_LABEL }),
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: localization.BLOG_FORMS_SLUG_PLACEHOLDER,
                ...field,
                value: currentSlug,
                onChange: (e) => {
                  const newSlug = e.target.value;
                  field.onChange(e);
                  if (newSlug !== autoGeneratedSlug) {
                    setSlugTouched(true);
                  }
                }
              }
            ) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] });
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: nameExcerpt,
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs(FormLabel, { children: [
            localization.BLOG_FORMS_EXCERPT_LABEL,
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: localization.BLOG_FORMS_REQUIRED_ASTERISK })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            Textarea,
            {
              placeholder: localization.BLOG_FORMS_EXCERPT_PLACEHOLDER,
              className: "min-h-20",
              value: String(field.value ?? ""),
              onChange: field.onChange
            }
          ) }),
          /* @__PURE__ */ jsx(FormDescription, {}),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: nameImage,
        render: ({ field }) => /* @__PURE__ */ jsx(
          FeaturedImageField,
          {
            isRequired: false,
            value: String(field.value ?? ""),
            onChange: field.onChange,
            setFeaturedImageUploading
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: nameTags,
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx(FormLabel, { children: localization.BLOG_FORMS_TAGS_LABEL }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            TagsMultiSelect,
            {
              value: Array.isArray(field.value) ? field.value : [],
              onChange: field.onChange,
              placeholder: localization.BLOG_FORMS_TAGS_PLACEHOLDER
            }
          ) }),
          /* @__PURE__ */ jsx(FormDescription, {}),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: nameContent,
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxs(FormLabel, { children: [
            localization.BLOG_FORMS_CONTENT_LABEL,
            /* @__PURE__ */ jsx("span", { className: "text-destructive", children: localization.BLOG_FORMS_REQUIRED_ASTERISK })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            Suspense,
            {
              fallback: /* @__PURE__ */ jsx("div", { className: "min-h-80 max-w-full border-input rounded-md border shadow-xs flex items-center justify-center bg-muted/50", children: /* @__PURE__ */ jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }),
              children: /* @__PURE__ */ jsx(
                MarkdownEditor,
                {
                  className: "min-h-80 max-w-full border-input rounded-md border shadow-xs",
                  value: typeof field.value === "string" ? field.value : "",
                  onChange: (content) => {
                    field.onChange(content);
                  }
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsx(FormDescription, {}),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: namePublished,
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsx(FormLabel, { children: localization.BLOG_FORMS_PUBLISHED_LABEL }),
            /* @__PURE__ */ jsx(FormDescription, { children: localization.BLOG_FORMS_PUBLISHED_DESCRIPTION })
          ] }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            Switch,
            {
              checked: !!field.value,
              onCheckedChange: field.onChange
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled, children: submitLabel }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          disabled,
          type: "button",
          children: localization.BLOG_FORMS_CANCEL_BUTTON
        }
      )
    ] })
  ] }) });
}
const CustomPostCreateSchema = createPostSchema.omit({
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});
const CustomPostUpdateSchema = updatePostSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true
});
const addPostFormPropsAreEqual = (prevProps, nextProps) => {
  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;
  if (prevProps.onFormReady !== nextProps.onFormReady) return false;
  return true;
};
const AddPostFormComponent = ({
  onClose,
  onSuccess,
  onFormReady
}) => {
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const schema = CustomPostCreateSchema;
  const {
    mutateAsync: createPost,
    isPending: isCreatingPost,
    error: createPostError
  } = useCreatePost();
  const onSubmit = async (data) => {
    const slug = data.slug || slugify$3(data.title);
    const createdPost = await createPost({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt ?? "",
      slug,
      published: data.published ?? false,
      publishedAt: data.published ? /* @__PURE__ */ new Date() : void 0,
      image: data.image,
      tags: data.tags || []
    });
    toast.success(localization.BLOG_FORMS_TOAST_CREATE_SUCCESS);
    onSuccess({ published: createdPost?.published ?? false });
  };
  const form = useForm({
    resolver: u(schema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: void 0,
      published: false,
      image: "",
      tags: []
    }
  });
  useEffect(() => {
    onFormReady?.(form);
  }, []);
  return /* @__PURE__ */ jsx(
    PostFormBody,
    {
      form,
      onSubmit,
      submitLabel: isCreatingPost ? localization.BLOG_FORMS_SUBMIT_CREATE_PENDING : localization.BLOG_FORMS_SUBMIT_CREATE_IDLE,
      onCancel: onClose,
      disabled: isCreatingPost || featuredImageUploading,
      errorMessage: createPostError?.message,
      setFeaturedImageUploading
    }
  );
};
const AddPostForm = memo(AddPostFormComponent, addPostFormPropsAreEqual);
const editPostFormPropsAreEqual = (prevProps, nextProps) => {
  if (prevProps.postSlug !== nextProps.postSlug) return false;
  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;
  if (prevProps.onDelete !== nextProps.onDelete) return false;
  if (prevProps.onFormReady !== nextProps.onFormReady) return false;
  return true;
};
const EditPostFormComponent = ({
  postSlug,
  onClose,
  onSuccess,
  onDelete,
  onFormReady
}) => {
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const { post } = useSuspensePost(postSlug);
  const initialData = useMemo(() => {
    if (!post) return {};
    return {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published,
      image: post.image || "",
      tags: post.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      }))
    };
  }, [post]);
  const schema = CustomPostUpdateSchema;
  const {
    mutateAsync: updatePost,
    isPending: isUpdatingPost,
    error: updatePostError
  } = useUpdatePost();
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
  const onSubmit = async (data) => {
    const updatedPost = await updatePost({
      id: post.id,
      data: {
        id: post.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt ?? "",
        slug: data.slug,
        published: data.published ?? false,
        publishedAt: data.published && !post?.published ? /* @__PURE__ */ new Date() : post?.publishedAt ? new Date(post.publishedAt) : void 0,
        image: data.image,
        tags: data.tags || []
      }
    });
    toast.success(localization.BLOG_FORMS_TOAST_UPDATE_SUCCESS);
    onSuccess({
      slug: updatedPost?.slug ?? "",
      published: updatedPost?.published ?? false
    });
  };
  const handleDelete = async () => {
    if (!post?.id) return;
    await deletePost({ id: post.id });
    toast.success(localization.BLOG_FORMS_TOAST_DELETE_SUCCESS);
    setDeleteDialogOpen(false);
    if (onDelete) {
      onDelete();
    } else {
      onClose();
    }
  };
  const form = useForm({
    resolver: u(schema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      published: false,
      image: "",
      tags: []
    },
    values: initialData
  });
  useEffect(() => {
    onFormReady?.(form);
  }, []);
  if (!post) {
    return /* @__PURE__ */ jsx(EmptyList, { message: localization.BLOG_PAGE_NOT_FOUND_DESCRIPTION });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PostFormBody,
      {
        form,
        onSubmit,
        submitLabel: isUpdatingPost ? localization.BLOG_FORMS_SUBMIT_UPDATE_PENDING : localization.BLOG_FORMS_SUBMIT_UPDATE_IDLE,
        onCancel: onClose,
        disabled: isUpdatingPost || featuredImageUploading,
        errorMessage: updatePostError?.message,
        setFeaturedImageUploading,
        initialSlugTouched: !!post?.slug
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs(AlertDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: [
      /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "destructive",
          type: "button",
          disabled: isUpdatingPost || featuredImageUploading || isDeletingPost,
          className: "mt-4",
          children: localization.BLOG_FORMS_DELETE_BUTTON
        }
      ) }),
      /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
        /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsx(AlertDialogTitle, { children: localization.BLOG_FORMS_DELETE_DIALOG_TITLE }),
          /* @__PURE__ */ jsx(AlertDialogDescription, { children: localization.BLOG_FORMS_DELETE_DIALOG_DESCRIPTION })
        ] }),
        /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsx(AlertDialogCancel, { disabled: isDeletingPost, children: localization.BLOG_FORMS_DELETE_DIALOG_CANCEL }),
          /* @__PURE__ */ jsx(
            AlertDialogAction,
            {
              onClick: (e) => {
                e.preventDefault();
                void handleDelete();
              },
              disabled: isDeletingPost,
              children: isDeletingPost ? localization.BLOG_FORMS_DELETE_PENDING : localization.BLOG_FORMS_DELETE_DIALOG_CONFIRM
            }
          )
        ] })
      ] })
    ] }) })
  ] });
};
const EditPostForm = memo(
  EditPostFormComponent,
  editPostFormPropsAreEqual
);
function createFillBlogFormHandler(formRef, successMessage) {
  return async ({
    title,
    content,
    excerpt,
    tags
  }) => {
    const form = formRef.current;
    if (!form) return { success: false, message: "Form not ready" };
    if (title !== void 0)
      form.setValue("title", title, { shouldValidate: true });
    if (content !== void 0)
      form.setValue("content", content, { shouldValidate: true });
    if (excerpt !== void 0) form.setValue("excerpt", excerpt);
    if (tags !== void 0)
      form.setValue(
        "tags",
        tags.map((name) => ({ name }))
      );
    return { success: true, message: successMessage };
  };
}
export {
  AddPostForm as A,
  EditPostForm as E,
  createFillBlogFormHandler as c
};
