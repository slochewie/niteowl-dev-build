import { P as Plugin, a as PluginKey, N as NodeSelection } from "./prosemirror-state.mjs";
import { I as InputRule } from "./prosemirror-inputrules.mjs";
import { g as getAtomFromSchemaFail } from "./milkdown__exception.mjs";
import "./prosemirror-tables.mjs";
const nav = typeof navigator != "undefined" ? navigator : null;
const doc = typeof document != "undefined" ? document : null;
const agent = nav && nav.userAgent || "";
const ie_edge = /Edge\/(\d+)/.exec(agent);
const ie_upto10 = /MSIE \d/.exec(agent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(agent);
const ie = !!(ie_upto10 || ie_11up || ie_edge);
const ie_version = ie_upto10 ? document.documentMode : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0;
const gecko = !ie && /gecko\/(\d+)/i.test(agent);
const gecko_version = gecko && +(/Firefox\/(\d+)/.exec(agent) || [0, 0])[1];
const _chrome = !ie && /Chrome\/(\d+)/.exec(agent);
const chrome = !!_chrome;
const chrome_version = _chrome ? +_chrome[1] : 0;
const safari = !ie && !!nav && /Apple Computer/.test(nav.vendor);
const ios = safari && (/Mobile\/\w+/.test(agent) || !!nav && nav.maxTouchPoints > 2);
const mac = ios || (nav ? /Mac/.test(nav.platform) : false);
const android = /Android \d/.test(agent);
const webkit = !!doc && "webkitFontSmoothing" in doc.documentElement.style;
const webkit_version = webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
var browser = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  android,
  chrome,
  chrome_version,
  gecko,
  gecko_version,
  ie,
  ie_version,
  ios,
  mac,
  safari,
  webkit,
  webkit_version
});
function run(view, from, to, text, rules, plugin) {
  if (view.composing) return false;
  const state = view.state;
  const $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) return false;
  const textBefore = $from.parent.textBetween(
    Math.max(0, $from.parentOffset - 500),
    $from.parentOffset,
    void 0,
    "￼"
  ) + text;
  for (let _matcher of rules) {
    const matcher = _matcher;
    const match = matcher.match.exec(textBefore);
    const tr = match && match[0] && matcher.handler(state, match, from - (match[0].length - text.length), to);
    if (!tr) continue;
    if (matcher.undoable !== false)
      tr.setMeta(plugin, { transform: tr, from, to, text });
    view.dispatch(tr);
    return true;
  }
  return false;
}
const customInputRulesKey = new PluginKey("MILKDOWN_CUSTOM_INPUTRULES");
function customInputRules({ rules }) {
  const plugin = new Plugin({
    key: customInputRulesKey,
    isInputRules: true,
    state: {
      init() {
        return null;
      },
      apply(tr, prev) {
        const stored = tr.getMeta(this);
        if (stored) return stored;
        return tr.selectionSet || tr.docChanged ? null : prev;
      }
    },
    props: {
      handleTextInput(view, from, to, text) {
        return run(view, from, to, text, rules, plugin);
      },
      handleDOMEvents: {
        compositionend: (view) => {
          setTimeout(() => {
            const { $cursor } = view.state.selection;
            if ($cursor) run(view, $cursor.pos, $cursor.pos, "", rules, plugin);
          });
          return false;
        },
        keydown: (view, event) => {
          if (!(android && chrome && event.key === "Enter"))
            return false;
          if (view.composing) return false;
          if (view.someProp(
            "handleKeyDown",
            (f) => f(view, event)
          )) {
            event.preventDefault();
            return true;
          }
          return false;
        }
      },
      handleKeyDown(view, event) {
        if (event.key !== "Enter") return false;
        const { $cursor } = view.state.selection;
        if ($cursor)
          return run(view, $cursor.pos, $cursor.pos, "\n", rules, plugin);
        return false;
      }
    }
  });
  return plugin;
}
function markRule(regexp, markType, options = {}) {
  return new InputRule(regexp, (state, match, start, end) => {
    var _a, _b, _c, _d;
    const { tr } = state;
    const matchLength = match.length;
    let group = match[matchLength - 1];
    let fullMatch = match[0];
    let initialStoredMarks = [];
    let markEnd;
    const captured = {
      group,
      fullMatch,
      start,
      end
    };
    const result = (_a = options.updateCaptured) == null ? void 0 : _a.call(options, captured);
    Object.assign(captured, result);
    ({ group, fullMatch, start, end } = captured);
    if (fullMatch === null) return null;
    if ((group == null ? void 0 : group.trim()) === "") return null;
    if (group) {
      const startSpaces = fullMatch.search(/\S/);
      const textStart = start + fullMatch.indexOf(group);
      const textEnd = textStart + group.length;
      initialStoredMarks = (_b = tr.storedMarks) != null ? _b : [];
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start + startSpaces, textStart);
      markEnd = start + startSpaces + group.length;
      const attrs = (_c = options.getAttr) == null ? void 0 : _c.call(options, match);
      tr.addMark(start, markEnd, markType.create(attrs));
      tr.setStoredMarks(initialStoredMarks);
      (_d = options.beforeDispatch) == null ? void 0 : _d.call(options, { match, start, end, tr });
    }
    return tr;
  });
}
function nodeRule(regexp, nodeType, options = {}) {
  return new InputRule(regexp, (state, match, start, end) => {
    var _a, _b, _c;
    const { tr } = state;
    let group = match[1];
    let fullMatch = match[0];
    const captured = {
      group,
      fullMatch,
      start,
      end
    };
    const result = (_a = options.updateCaptured) == null ? void 0 : _a.call(options, captured);
    Object.assign(captured, result);
    ({ group, fullMatch, start, end } = captured);
    if (fullMatch === null) return null;
    if (!group || group.trim() === "") return null;
    const attrs = (_b = options.getAttr) == null ? void 0 : _b.call(options, match);
    const node = nodeType.createAndFill(attrs);
    if (node) {
      tr.replaceRangeWith(
        nodeType.isBlock ? tr.doc.resolve(start).before() : start,
        end,
        node
      );
      (_c = options.beforeDispatch) == null ? void 0 : _c.call(options, {
        match: [fullMatch, group],
        start,
        end,
        tr
      });
    }
    return tr;
  });
}
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function minMax(value = 0, min = 0, max = 0) {
  return Math.min(Math.max(value, min), max);
}
function posToDOMRect(view, from, to) {
  const minPos = 0;
  const maxPos = view.state.doc.content.size;
  const resolvedFrom = minMax(from, minPos, maxPos);
  const resolvedEnd = minMax(to, minPos, maxPos);
  const start = view.coordsAtPos(resolvedFrom);
  const end = view.coordsAtPos(resolvedEnd, -1);
  const top = Math.min(start.top, end.top);
  const bottom = Math.max(start.bottom, end.bottom);
  const left = Math.min(start.left, end.left);
  const right = Math.max(start.right, end.right);
  const width = right - left;
  const height = bottom - top;
  const x = left;
  const y = top;
  const data = {
    top,
    bottom,
    left,
    right,
    width,
    height,
    x,
    y
  };
  return __spreadProps(__spreadValues({}, data), {
    toJSON: () => data
  });
}
function cloneTr(tr) {
  return Object.assign(Object.create(tr), tr).setTime(Date.now());
}
function equalNodeType(nodeType, node) {
  return Array.isArray(nodeType) && nodeType.includes(node.type) || node.type === nodeType;
}
function isTextOnlySlice(slice) {
  if (slice.content.childCount === 1) {
    const node = slice.content.firstChild;
    if ((node == null ? void 0 : node.type.name) === "text" && node.marks.length === 0) return node;
    if ((node == null ? void 0 : node.type.name) === "paragraph" && node.childCount === 1) {
      const _node = node.firstChild;
      if ((_node == null ? void 0 : _node.type.name) === "text" && _node.marks.length === 0) return _node;
    }
  }
  return false;
}
function findParent(predicate) {
  return ($pos) => {
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
      const node = $pos.node(depth);
      if (predicate(node)) {
        const from = $pos.before(depth);
        const to = $pos.after(depth);
        return {
          from,
          to,
          node
        };
      }
    }
    return void 0;
  };
}
function findParentNodeType($pos, nodeType) {
  return findParent((node) => node.type === nodeType)($pos);
}
function getNodeFromSchema(type, schema) {
  const target = schema.nodes[type];
  if (!target) throw getAtomFromSchemaFail("node", type);
  return target;
}
function findParentNodeClosestToPos(predicate) {
  return ($pos) => {
    for (let i = $pos.depth; i > 0; i--) {
      const node = $pos.node(i);
      if (predicate(node)) {
        return {
          pos: $pos.before(i),
          start: $pos.start(i),
          depth: i,
          node
        };
      }
    }
    return void 0;
  };
}
function findParentNode(predicate) {
  return (selection) => {
    return findParentNodeClosestToPos(predicate)(selection.$from);
  };
}
function findSelectedNodeOfType(selection, nodeType) {
  if (!(selection instanceof NodeSelection)) return;
  const { node, $from } = selection;
  if (equalNodeType(nodeType, node))
    return {
      node,
      pos: $from.pos,
      start: $from.start($from.depth),
      depth: $from.depth
    };
  return void 0;
}
const findNodeInSelection = (state, node) => {
  const { selection, doc: doc2 } = state;
  if (selection instanceof NodeSelection) {
    return {
      hasNode: selection.node.type === node,
      pos: selection.from,
      target: selection.node
    };
  }
  const { from, to } = selection;
  let hasNode = false;
  let pos = -1;
  let target = null;
  doc2.nodesBetween(from, to, (n, p) => {
    if (target) return false;
    if (n.type === node) {
      hasNode = true;
      pos = p;
      target = n;
      return false;
    }
    return true;
  });
  return {
    hasNode,
    pos,
    target
  };
};
export {
  findSelectedNodeOfType as a,
  browser as b,
  customInputRules as c,
  findNodeInSelection as d,
  findParentNode as e,
  findParent as f,
  findParentNodeType as g,
  cloneTr as h,
  findParentNodeClosestToPos as i,
  getNodeFromSchema as j,
  isTextOnlySlice as k,
  markRule as m,
  nodeRule as n,
  posToDOMRect as p
};
