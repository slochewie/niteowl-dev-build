import { s as schemaCtx, l as editorViewOptionsCtx, a as serializerCtx, h as parserCtx } from "./milkdown__core.mjs";
import { j as getNodeFromSchema, k as isTextOnlySlice } from "./milkdown__prose.mjs";
import { a as $prose } from "./milkdown__utils.mjs";
import { P as Plugin, a as PluginKey, T as TextSelection } from "./prosemirror-state.mjs";
import { b as DOMParser, D as DOMSerializer } from "./prosemirror-model.mjs";
function isPureText(content) {
  if (!content) return false;
  if (Array.isArray(content)) {
    if (content.length > 1) return false;
    return isPureText(content[0]);
  }
  const child = content.content;
  if (child) return isPureText(child);
  return content.type === "text";
}
function withMeta(plugin, meta) {
  Object.assign(plugin, { meta: {
    package: "@milkdown/plugin-clipboard",
    ...meta
  } });
  return plugin;
}
function dispatchPasteSlice(view, slice) {
  const node = isTextOnlySlice(slice);
  if (node) {
    view.dispatch(view.state.tr.replaceSelectionWith(node, true));
    return true;
  }
  try {
    view.dispatch(view.state.tr.replaceSelection(slice));
    return true;
  } catch {
    return false;
  }
}
var clipboard = $prose((ctx) => {
  const schema = ctx.get(schemaCtx);
  ctx.update(editorViewOptionsCtx, (prev) => ({
    ...prev,
    editable: prev.editable ?? (() => true),
    transformPastedHTML: (html, view) => {
      const prevTransform = prev.transformPastedHTML;
      if (prevTransform) html = prevTransform(html, view);
      if (html.includes("docs-internal-guid")) {
        html = html.replace(/<b[^>]*id="docs-internal-guid[^"]*"[^>]*>([\s\S]*)<\/b>/, "$1");
        html = html.replace(/<div[^>]*>(<table[\s\S]*?<\/table>)<\/div>/g, "$1");
      }
      return html;
    }
  }));
  return new Plugin({
    key: new PluginKey("MILKDOWN_CLIPBOARD"),
    props: {
      handlePaste: (view, event, preProcessedSlice) => {
        const parser = ctx.get(parserCtx);
        const editable = view.props.editable?.(view.state);
        const { clipboardData } = event;
        if (!editable || !clipboardData) return false;
        if (view.state.selection.$from.node().type.spec.code) return false;
        const text = clipboardData.getData("text/plain");
        const vscodeData = clipboardData.getData("vscode-editor-data");
        if (vscodeData) {
          const language = JSON.parse(vscodeData)?.mode;
          if (text && language) {
            const { tr } = view.state;
            const codeBlock = getNodeFromSchema("code_block", schema);
            tr.replaceSelectionWith(codeBlock.create({ language })).setSelection(TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2)))).insertText(text.replace(/\r\n?/g, "\n"));
            view.dispatch(tr);
            return true;
          }
        }
        const html = clipboardData.getData("text/html");
        if (html.length === 0 && text.length === 0) return false;
        if (html.length > 0 && preProcessedSlice) return dispatchPasteSlice(view, preProcessedSlice);
        const domParser = DOMParser.fromSchema(schema);
        let dom;
        if (html.length === 0) {
          const slice = parser(text);
          if (!slice || typeof slice === "string") return false;
          dom = DOMSerializer.fromSchema(schema).serializeFragment(slice.content);
        } else {
          const template = document.createElement("template");
          template.innerHTML = html;
          dom = template.content.cloneNode(true);
          template.remove();
        }
        return dispatchPasteSlice(view, domParser.parseSlice(dom));
      },
      clipboardTextSerializer: (slice) => {
        const serializer = ctx.get(serializerCtx);
        if (isPureText(slice.content.toJSON())) return slice.content.textBetween(0, slice.content.size, "\n\n");
        const doc = schema.topNodeType.createAndFill(void 0, slice.content);
        if (!doc) return "";
        return serializer(doc);
      }
    }
  });
});
withMeta(clipboard, { displayName: "Prose<clipboard>" });
export {
  clipboard as c
};
