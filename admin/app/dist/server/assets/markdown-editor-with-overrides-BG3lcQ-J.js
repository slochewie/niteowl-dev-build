import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { a2 as throttle, a3 as cn, l as usePluginOverrides, A as BLOG_LOCALIZATION } from "./router-DU5jczZR.js";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { editorViewCtx, parserCtx } from "@milkdown/kit/core";
import { listenerCtx, listener } from "@milkdown/kit/plugin/listener";
import { Slice } from "@milkdown/kit/prose/model";
import { Selection } from "@milkdown/kit/prose/state";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "zod";
import "lucide-react";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
function MarkdownEditor({
  value,
  onChange,
  className,
  uploadImage,
  placeholder = "Write something...",
  insertImageRef,
  openMediaPickerForImageBlock
}) {
  const containerRef = useRef(null);
  const crepeRef = useRef(null);
  const isReadyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value ?? "");
  const openMediaPickerRef = useRef(
    openMediaPickerForImageBlock
  );
  const throttledOnChangeRef = useRef(null);
  onChangeRef.current = onChange;
  openMediaPickerRef.current = openMediaPickerForImageBlock;
  useLayoutEffect(() => {
    if (crepeRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const hasMediaPicker = !!openMediaPickerRef.current;
    const imageBlockConfig = {};
    if (uploadImage) {
      imageBlockConfig.onUpload = async (file) => uploadImage(file);
    }
    if (hasMediaPicker) {
      imageBlockConfig.blockUploadPlaceholderText = "Media Picker";
      imageBlockConfig.inlineUploadPlaceholderText = "Media Picker";
    }
    const crepe = new Crepe({
      root: container,
      defaultValue: initialValueRef.current,
      featureConfigs: {
        [CrepeFeature.Placeholder]: {
          text: placeholder
        },
        ...Object.keys(imageBlockConfig).length > 0 ? { [CrepeFeature.ImageBlock]: imageBlockConfig } : {}
      }
    });
    const interceptHandler = (e) => {
      if (!openMediaPickerRef.current) return;
      const target = e.target;
      const inPlaceholder = target.closest(".image-edit .placeholder");
      if (!inPlaceholder) return;
      if (target.matches("input")) return;
      e.preventDefault();
      e.stopPropagation();
      const imageEdit = inPlaceholder.closest(".image-edit");
      const linkInput = imageEdit?.querySelector(
        ".link-input-area"
      );
      openMediaPickerRef.current((url) => {
        if (!linkInput) return;
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeSetter?.call(linkInput, url);
        linkInput.dispatchEvent(new Event("input", { bubbles: true }));
        linkInput.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
        );
      });
    };
    container.addEventListener("click", interceptHandler, true);
    throttledOnChangeRef.current = throttle((markdown) => {
      if (onChangeRef.current) onChangeRef.current(markdown);
    }, 200);
    crepe.editor.config((ctx) => {
      ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
        throttledOnChangeRef.current?.(markdown);
      });
    }).use(listener);
    crepe.create().then(() => {
      isReadyRef.current = true;
      setIsReady(true);
    });
    crepeRef.current = crepe;
    return () => {
      container.removeEventListener("click", interceptHandler, true);
      try {
        isReadyRef.current = false;
        throttledOnChangeRef.current?.cancel?.();
        throttledOnChangeRef.current = null;
        crepe.destroy();
      } finally {
        crepeRef.current = null;
      }
    };
  }, []);
  useLayoutEffect(() => {
    if (!isReady) return;
    if (!crepeRef.current) return;
    if (typeof value !== "string") return;
    let currentMarkdown;
    try {
      currentMarkdown = crepeRef.current?.getMarkdown?.();
    } catch {
      return;
    }
    if (currentMarkdown === value) return;
    crepeRef.current.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      if (view?.hasFocus?.() === true) return;
      const parser = ctx.get(parserCtx);
      const doc = parser(value);
      if (!doc) return;
      const state = view.state;
      const selection = state.selection;
      const from = selection.from;
      let tr = state.tr;
      tr = tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0));
      const docSize = doc.content.size;
      const safeFrom = Math.max(1, Math.min(from, Math.max(1, docSize - 2)));
      tr = tr.setSelection(Selection.near(tr.doc.resolve(safeFrom)));
      view.dispatch(tr);
    });
  }, [value, isReady]);
  useLayoutEffect(() => {
    if (!insertImageRef) return;
    insertImageRef.current = (url) => {
      if (!crepeRef.current || !isReadyRef.current) return;
      try {
        const currentMarkdown = crepeRef.current.getMarkdown?.() ?? "";
        const imageMarkdown = `

![](${url})

`;
        const newMarkdown = currentMarkdown.trimEnd() + imageMarkdown;
        crepeRef.current.editor.action((ctx) => {
          const view = ctx.get(editorViewCtx);
          const parser = ctx.get(parserCtx);
          const doc = parser(newMarkdown);
          if (!doc) return;
          const state = view.state;
          const tr = state.tr.replace(
            0,
            state.doc.content.size,
            new Slice(doc.content, 0, 0)
          );
          view.dispatch(tr);
        });
        if (onChangeRef.current) onChangeRef.current(newMarkdown);
      } catch {
      }
    };
    return () => {
      if (insertImageRef) insertImageRef.current = null;
    };
  }, [insertImageRef]);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className: cn("milkdown-custom", className) });
}
function MarkdownEditorWithOverrides(props) {
  const {
    uploadImage,
    imagePicker: ImagePickerTrigger,
    localization
  } = usePluginOverrides(
    "blog",
    { localization: BLOG_LOCALIZATION }
  );
  const insertImageRef = useRef(null);
  const pendingInsertUrlRef = useRef(null);
  const triggerContainerRef = useRef(null);
  const handleSelect = useCallback((url) => {
    if (pendingInsertUrlRef.current) {
      pendingInsertUrlRef.current(url);
      pendingInsertUrlRef.current = null;
    } else {
      insertImageRef.current?.(url);
    }
  }, []);
  const openMediaPickerForImageBlock = useCallback(
    (setUrl) => {
      pendingInsertUrlRef.current = setUrl;
      const btn = triggerContainerRef.current?.querySelector(
        '[data-testid="open-media-picker"]'
      );
      btn?.click();
    },
    []
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx(
      MarkdownEditor,
      {
        ...props,
        uploadImage,
        placeholder: localization?.BLOG_FORMS_EDITOR_PLACEHOLDER,
        insertImageRef,
        openMediaPickerForImageBlock: ImagePickerTrigger ? openMediaPickerForImageBlock : void 0
      }
    ),
    ImagePickerTrigger && /* @__PURE__ */ jsx(
      "div",
      {
        ref: triggerContainerRef,
        className: "flex justify-end mt-1",
        "data-testid": "image-picker-trigger",
        children: /* @__PURE__ */ jsx(ImagePickerTrigger, { onSelect: handleSelect })
      }
    )
  ] });
}
export {
  MarkdownEditorWithOverrides
};
