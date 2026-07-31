import { $ as $ctx, a as $prose } from "./milkdown__utils.mjs";
import { c as createDropIndicatorPlugin } from "./prosemirror-drop-indicator.mjs";
import { g as gapCursor } from "./prosemirror-gapcursor.mjs";
import { P as Plugin, a as PluginKey } from "./prosemirror-state.mjs";
function withMeta(plugin, meta) {
  Object.assign(plugin, { meta: {
    package: "@milkdown/plugin-cursor",
    ...meta
  } });
  return plugin;
}
var dropIndicatorState = $ctx(null, "dropIndicatorState");
withMeta(dropIndicatorState, { displayName: "Ctx<dropIndicatorState>" });
var dropIndicatorConfig = $ctx({
  width: 2,
  color: false,
  class: "milkdown-drop-indicator"
}, "dropIndicatorConfig");
withMeta(dropIndicatorConfig, { displayName: "Ctx<dropIndicatorConfig>" });
var key = new PluginKey("MILKDOWN_DROP_INDICATOR_DOM");
var dropIndicatorDOMPlugin = $prose((ctx) => new Plugin({
  key,
  view: (view) => {
    const config = ctx.get(dropIndicatorConfig.key);
    const dom = document.createElement("div");
    Object.assign(dom.style, {
      position: "fixed",
      pointerEvents: "none",
      display: "none",
      backgroundColor: config.color,
      top: "0",
      left: "0"
    });
    dom.classList.add(config.class);
    dom.classList.add("milkdown-drop-indicator");
    view.dom.parentNode?.appendChild(dom);
    const stateSlice = ctx.use(dropIndicatorState.key);
    const onUpdate = (state) => {
      renderIndicator(dom, state, config);
    };
    stateSlice.on(onUpdate);
    return { destroy: () => {
      stateSlice.off(onUpdate);
      dom.remove();
    } };
  }
}));
withMeta(dropIndicatorDOMPlugin, { displayName: "Prose<dropIndicatorDOM>" });
function renderIndicator(dom, state, config) {
  if (!state) {
    Object.assign(dom.style, { display: "none" });
    return;
  }
  const { line } = state;
  const { width: lineWidth } = config;
  const { p1: { x: x1, y: y1 }, p2: { x: x2, y: y2 } } = line;
  const horizontal = y1 === y2;
  let width;
  let height;
  let top = y1;
  let left = x1;
  if (horizontal) {
    width = x2 - x1;
    height = lineWidth;
    top -= lineWidth / 2;
  } else {
    width = lineWidth;
    height = y2 - y1;
    left -= lineWidth / 2;
  }
  top = Math.round(top);
  left = Math.round(left);
  Object.assign(dom.style, {
    display: "block",
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${left}px, ${top}px)`
  });
}
var dropIndicatorPlugin = $prose((ctx) => {
  const onShow = (options) => {
    ctx.set(dropIndicatorState.key, options);
  };
  const onHide = () => {
    ctx.set(dropIndicatorState.key, null);
  };
  return createDropIndicatorPlugin({
    onShow,
    onHide,
    onDrag: () => true
  });
});
withMeta(dropIndicatorPlugin, { displayName: "Prose<dropIndicator>" });
var gapCursorPlugin = $prose(() => gapCursor());
withMeta(gapCursorPlugin, { displayName: "Prose<gapCursor>" });
var cursor = [
  gapCursorPlugin,
  dropIndicatorConfig,
  dropIndicatorState,
  dropIndicatorDOMPlugin,
  dropIndicatorPlugin
].flat();
export {
  cursor as c,
  dropIndicatorConfig as d
};
