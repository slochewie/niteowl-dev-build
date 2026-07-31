import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useCallback, useState, useLayoutEffect } from "react";
import { l as usePluginOverrides, A as BLOG_LOCALIZATION, a2 as throttle, a3 as cn } from "./router-qu_5GP1h.mjs";
import { C as Crepe, a as CrepeFeature } from "../_libs/milkdown__crepe.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import { l as listenerCtx, a as listener } from "../_libs/milkdown__plugin-listener.mjs";
import { e as editorViewCtx, h as parserCtx } from "../_libs/milkdown__core.mjs";
import { S as Slice } from "../_libs/prosemirror-model.mjs";
import { S as Selection } from "../_libs/prosemirror-state.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "../_libs/codemirror__language-data.mjs";
import "../_libs/codemirror__language.mjs";
import "../_libs/lezer__common.mjs";
import "../_libs/codemirror__state.mjs";
import "../_libs/marijn__find-cluster-break.mjs";
import "../_libs/codemirror__view.mjs";
import "../_libs/style-mod.mjs";
import "../_libs/w3c-keyname.mjs";
import "../_libs/crelt.mjs";
import "../_libs/lezer__highlight.mjs";
import "../_libs/codemirror__theme-one-dark.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/vue.mjs";
import "../_libs/vue__compiler-dom.mjs";
import "../_libs/vue__compiler-core.mjs";
import "../_libs/vue__shared.mjs";
import "../_libs/react.mjs";
import "../_libs/entities.mjs";
import "../_libs/babel__parser.mjs";
import "../_libs/estree-walker.mjs";
import "../_libs/source-map-js.mjs";
import "../_libs/vue__runtime-dom.mjs";
import "../_libs/vue__runtime-core.mjs";
import "../_libs/vue__reactivity.mjs";
import "../_libs/codemirror__commands.mjs";
import "../_libs/codemirror.mjs";
import "../_libs/codemirror__search.mjs";
import "../_libs/codemirror__autocomplete.mjs";
import "../_libs/codemirror__lint.mjs";
import "../_libs/prosemirror-virtual-cursor.mjs";
import "../_libs/prosemirror-view.mjs";
import "../_libs/prosemirror-transform.mjs";
import "../_libs/katex.mjs";
import "../_libs/lodash-es.mjs";
import "../_libs/milkdown__utils.mjs";
import "../_libs/milkdown__ctx.mjs";
import "../_libs/milkdown__exception.mjs";
import "../_libs/nanoid.mjs";
import "node:crypto";
import "../_libs/milkdown__plugin-indent.mjs";
import "../_libs/milkdown__plugin-upload.mjs";
import "../_libs/milkdown__components.mjs";
import "../_libs/milkdown__plugin-diff.mjs";
import "../_libs/prosemirror-changeset.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/milkdown__preset-commonmark.mjs";
import "../_libs/milkdown__prose.mjs";
import "../_libs/prosemirror-inputrules.mjs";
import "../_libs/prosemirror-tables.mjs";
import "../_libs/prosemirror-keymap.mjs";
import "../_libs/prosemirror-commands.mjs";
import "../_libs/prosemirror-schema-list.mjs";
import "../_libs/remark-inline-links.mjs";
import "../_libs/mdast-util-definitions.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/prosemirror-history.mjs";
import "../_libs/rope-sequence.mjs";
import "../_libs/milkdown__plugin-tooltip.mjs";
import "../_libs/milkdown__preset-gfm.mjs";
import "../_libs/prosemirror-safari-ime-span.mjs";
import "../_libs/remark-gfm.mjs";
import "../_libs/micromark-extension-gfm.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-extension-gfm-autolink-literal+[...].mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-extension-gfm-footnote+[...].mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/micromark-extension-gfm-strikethrough+[...].mjs";
import "../_libs/micromark-extension-gfm-table.mjs";
import "../_libs/micromark-extension-gfm-task-list-item+[...].mjs";
import "../_libs/mdast-util-gfm.mjs";
import "../_libs/mdast-util-gfm-autolink-literal+[...].mjs";
import "../_libs/ccount.mjs";
import "../_libs/devlop.mjs";
import "../_libs/mdast-util-find-and-replace.mjs";
import "../_libs/escape-string-regexp.mjs";
import "../_libs/mdast-util-gfm-footnote.mjs";
import "../_libs/mdast-util-gfm-strikethrough.mjs";
import "../_libs/mdast-util-gfm-table.mjs";
import "../_libs/markdown-table.mjs";
import "../_libs/mdast-util-to-markdown.mjs";
import "../_libs/zwitch.mjs";
import "../_libs/longest-streak.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/mdast-util-phrasing.mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/mdast-util-gfm-task-list-item.mjs";
import "../_libs/milkdown__plugin-history.mjs";
import "../_libs/milkdown__plugin-trailing.mjs";
import "../_libs/milkdown__plugin-clipboard.mjs";
import "../_libs/milkdown__plugin-streaming.mjs";
import "../_libs/milkdown__plugin-block.mjs";
import "../_libs/milkdown__plugin-cursor.mjs";
import "../_libs/prosemirror-drop-indicator.mjs";
import "../_libs/ocavue__utils.mjs";
import "../_libs/prosemirror-gapcursor.mjs";
import "../_libs/milkdown__plugin-slash.mjs";
import "../_libs/remark-math.mjs";
import "../_libs/micromark-extension-math.mjs";
import "../_libs/mdast-util-math.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
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
import "../_libs/milkdown__transformer.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark.mjs";
import "../_libs/remark-stringify.mjs";
import "../_libs/orderedmap.mjs";
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
