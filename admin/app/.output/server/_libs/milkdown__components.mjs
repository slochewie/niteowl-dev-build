import { $ as $ctx, a as $prose, c as $remark, d as $nodeSchema, e as $view, b as $command } from "./milkdown__utils.mjs";
import { c as commandsCtx, e as editorViewCtx } from "./milkdown__core.mjs";
import { d as diffPluginKey, g as getPendingChanges, a as acceptDiffRangeCmd, r as rejectDiffRangeCmd } from "./milkdown__plugin-diff.mjs";
import { a as PluginKey, P as Plugin, T as TextSelection, N as NodeSelection } from "./prosemirror-state.mjs";
import { D as DecorationSet, a as Decoration } from "./prosemirror-view.mjs";
import { D as DOMSerializer } from "./prosemirror-model.mjs";
import { c as clsx } from "./clsx.mjs";
import { p as purify } from "./dompurify.mjs";
import { v as vueExports } from "./vue.mjs";
import { i as expectDomTypeError } from "./milkdown__exception.mjs";
import { c as customAlphabet } from "./nanoid.mjs";
import { v as visit } from "./unist-util-visit.mjs";
import { c as codeBlockSchema, i as imageSchema, l as linkSchema, s as sanitizeLinkHref, a as listItemSchema } from "./milkdown__preset-commonmark.mjs";
import { m as Compartment, E as EditorState } from "./codemirror__state.mjs";
import { E as EditorView, d as drawSelection, k as keymap } from "./codemirror__view.mjs";
import { c as computePosition, o as offset } from "./floating-ui__dom.mjs";
import { e as exitCode } from "./prosemirror-commands.mjs";
import { u as undo, r as redo } from "./prosemirror-history.mjs";
import { t as tooltipFactory, T as TooltipProvider } from "./milkdown__plugin-tooltip.mjs";
import { p as posToDOMRect, f as findParent } from "./milkdown__prose.mjs";
import { d as debounce, t as throttle } from "./lodash-es.mjs";
import { t as tableSchema, s as selectColCommand, m as moveColCommand, a as selectRowCommand, b as moveRowCommand, c as setAlignCommand, d as deleteSelectedCellsCommand, e as addColAfterCommand, f as addColBeforeCommand, g as addRowAfterCommand, h as addRowBeforeCommand } from "./milkdown__preset-gfm.mjs";
import { C as CellSelection, f as findTable } from "./prosemirror-tables.mjs";
var __defProp$8 = Object.defineProperty;
var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$8 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$8.call(b, prop))
      __defNormalProp$8(a, prop, b[prop]);
  if (__getOwnPropSymbols$8)
    for (var prop of __getOwnPropSymbols$8(b)) {
      if (__propIsEnum$8.call(b, prop))
        __defNormalProp$8(a, prop, b[prop]);
    }
  return a;
};
function withMeta$6(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$8({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
const DIFF_CLASS_PREFIX = "milkdown-diff";
const defaultConfig$2 = {
  acceptLabel: "Accept",
  rejectLabel: "Reject",
  customBlockTypes: []
};
const diffComponentConfig = $ctx(defaultConfig$2, "diffComponentConfig");
withMeta$6(diffComponentConfig, {
  displayName: "Ctx<diffComponentConfig>",
  group: "DiffComponent"
});
function isBlockSpanning(doc, from, to) {
  if (from === to) return false;
  const $from = doc.resolve(from);
  const $to = doc.resolve(to);
  const fromIndex = $from.index(0);
  const toIndex = $to.depth === 0 ? Math.max(0, $to.index(0) - 1) : $to.index(0);
  return fromIndex !== toIndex;
}
function hasBlockContent(doc, from, to) {
  if (from >= to) return false;
  const $from = doc.resolve(from);
  const $to = doc.resolve(to);
  if ($from.sameParent($to) && $from.parent.isTextblock) return false;
  let found = false;
  doc.nodesBetween(from, to, (node, pos) => {
    if (found) return false;
    if (!node.isBlock) return true;
    const nodeEnd = pos + node.nodeSize;
    if (pos >= from && nodeEnd <= to) {
      found = true;
      return false;
    }
    return true;
  });
  return found;
}
function coversOnlyTrailingEmptyParagraphs(doc, from, to) {
  if (to !== doc.content.size) return false;
  const $from = doc.resolve(from);
  if ($from.depth !== 0) return false;
  for (let i = $from.index(0); i < doc.childCount; i++) {
    const child = doc.child(i);
    if (child.type.name !== "paragraph" || child.content.size > 0) return false;
  }
  return true;
}
function trailingEmptyParagraphStart(doc) {
  let start = doc.content.size;
  for (let i = doc.childCount - 1; i >= 0; i--) {
    const child = doc.child(i);
    if (child.type.name !== "paragraph" || child.content.size > 0) break;
    start -= child.nodeSize;
  }
  return start;
}
function snapToBlockBoundary(doc, pos) {
  const $pos = doc.resolve(pos);
  for (let d = $pos.depth; d >= 1; d--) {
    const parent = $pos.node(d);
    if (parent.isTextblock) {
      return $pos.before(d);
    }
  }
  return pos;
}
function forEachTopLevelNodeInRange(doc, from, to, callback) {
  let pos = 0;
  for (let i = 0; i < doc.childCount; i++) {
    const child = doc.child(i);
    const nodeEnd = pos + child.nodeSize;
    if (pos >= to) break;
    if (nodeEnd > from && pos < to) callback(child, pos, nodeEnd);
    pos = nodeEnd;
  }
}
function addBlockDeletionDecorations(doc, from, to, decorations) {
  forEachTopLevelNodeInRange(doc, from, to, (node, start, end) => {
    if (end === doc.content.size && node.type.name === "paragraph" && node.content.size === 0)
      return;
    decorations.push(
      Decoration.node(start, end, {
        class: `${DIFF_CLASS_PREFIX}-removed-block`
      })
    );
  });
}
function getTopLevelBlockRange(doc, pos, endBoundary = false) {
  if (pos < 0 || pos > doc.content.size) return null;
  const $pos = doc.resolve(Math.min(pos, doc.content.size));
  if ($pos.depth >= 1) {
    return {
      from: $pos.before(1),
      to: $pos.after(1)
    };
  }
  if (endBoundary) {
    const nodeBefore = $pos.nodeBefore;
    if (nodeBefore) {
      return { from: pos - nodeBefore.nodeSize, to: pos };
    }
    const nodeAfter = $pos.nodeAfter;
    if (nodeAfter) {
      return { from: pos, to: pos + nodeAfter.nodeSize };
    }
  } else {
    const nodeAfter = $pos.nodeAfter;
    if (nodeAfter) {
      return { from: pos, to: pos + nodeAfter.nodeSize };
    }
    const nodeBefore = $pos.nodeBefore;
    if (nodeBefore) {
      return { from: pos - nodeBefore.nodeSize, to: pos };
    }
  }
  return null;
}
function getCustomBlockAncestor(doc, pos, customBlockTypes) {
  if (pos < 0 || pos > doc.content.size) return null;
  const $pos = doc.resolve(Math.min(pos, doc.content.size));
  for (let d = $pos.depth; d >= 0; d--) {
    const name = $pos.node(d).type.name;
    if (customBlockTypes.has(name)) return name;
  }
  return null;
}
function getCustomBlockAt(doc, pos, customBlockTypes, endBoundary = false) {
  const ancestor = getCustomBlockAncestor(doc, pos, customBlockTypes);
  if (ancestor) return ancestor;
  const $pos = doc.resolve(Math.min(Math.max(pos, 0), doc.content.size));
  const sibling = endBoundary ? $pos.nodeBefore : $pos.nodeAfter;
  if (sibling && customBlockTypes.has(sibling.type.name))
    return sibling.type.name;
  return null;
}
function collectTopLevelNodes(doc, from, to) {
  const nodes = [];
  let aligned = true;
  let firstStart = -1;
  let lastEnd = -1;
  forEachTopLevelNodeInRange(doc, from, to, (node, start, end) => {
    if (firstStart === -1) firstStart = start;
    lastEnd = end;
    nodes.push(node);
  });
  if (nodes.length === 0 || firstStart !== from || lastEnd !== to) {
    aligned = false;
  }
  return aligned ? nodes : [];
}
function overlaps(a1, a2, b1, b2) {
  return a1 < b2 && a2 > b1;
}
function touchesCustomBlockRange(doc, from, to, customBlockTypes) {
  if (from === to) {
    return getCustomBlockAncestor(doc, from, customBlockTypes) != null;
  }
  return getCustomBlockAt(doc, from, customBlockTypes) != null || getCustomBlockAt(doc, to, customBlockTypes, true) != null;
}
function splitCrossBoundaryChange(doc, newDoc, change) {
  const $fromA = doc.resolve(change.fromA);
  if (!$fromA.parent.isTextblock || $fromA.depth < 1) return null;
  if (!$fromA.node(1).isTextblock) return null;
  const blockEndA = $fromA.after(1);
  const $fromB = newDoc.resolve(change.fromB);
  let splitB;
  if ($fromB.depth >= 1 && $fromB.node(1).isTextblock) {
    splitB = $fromB.after(1);
    if (splitB > change.toB) splitB = change.toB;
  } else {
    splitB = change.fromB;
  }
  if (blockEndA >= change.toA && splitB >= change.toB) return null;
  const segments = [];
  if (blockEndA > change.fromA || splitB > change.fromB) {
    segments.push({
      fromA: change.fromA,
      toA: Math.min(blockEndA, change.toA),
      fromB: change.fromB,
      toB: splitB,
      isBlock: false
    });
  }
  if (change.toA > blockEndA || change.toB > splitB) {
    segments.push({
      fromA: blockEndA,
      toA: Math.max(blockEndA, change.toA),
      fromB: splitB,
      toB: change.toB,
      isBlock: true
    });
  }
  return segments.length > 1 ? segments : null;
}
function changeTouchesCustomBlock(change, doc, newDoc, customBlockTypes) {
  return touchesCustomBlockRange(doc, change.fromA, change.toA, customBlockTypes) || touchesCustomBlockRange(newDoc, change.fromB, change.toB, customBlockTypes);
}
function mergeBlockChanges(pending, doc, newDoc, customBlockTypes) {
  var _a, _b, _c, _d;
  const result = [];
  const consumed = /* @__PURE__ */ new Set();
  for (let i = 0; i < pending.length; i++) {
    if (consumed.has(i)) continue;
    const change = pending[i];
    if (!changeTouchesCustomBlock(change, doc, newDoc, customBlockTypes)) {
      result.push({
        fromA: change.fromA,
        toA: change.toA,
        fromB: change.fromB,
        toB: change.toB,
        isCustomBlock: false
      });
      continue;
    }
    const blockRangeA = expandToCustomBlockRange(
      doc,
      change.fromA,
      change.toA,
      customBlockTypes
    );
    const blockRangeB = expandToCustomBlockRange(
      newDoc,
      change.fromB,
      change.toB,
      customBlockTypes
    );
    const merged = {
      fromA: Math.min((_a = blockRangeA == null ? void 0 : blockRangeA.from) != null ? _a : change.fromA, change.fromA),
      toA: Math.max((_b = blockRangeA == null ? void 0 : blockRangeA.to) != null ? _b : change.toA, change.toA),
      fromB: Math.min((_c = blockRangeB == null ? void 0 : blockRangeB.from) != null ? _c : change.fromB, change.fromB),
      toB: Math.max((_d = blockRangeB == null ? void 0 : blockRangeB.to) != null ? _d : change.toB, change.toB),
      isCustomBlock: true
    };
    consumed.add(i);
    for (let j = i + 1; j < pending.length; j++) {
      if (consumed.has(j)) continue;
      const other = pending[j];
      const overlapA = blockRangeA && overlaps(other.fromA, other.toA, blockRangeA.from, blockRangeA.to);
      const overlapB = blockRangeB && overlaps(other.fromB, other.toB, blockRangeB.from, blockRangeB.to);
      if (!overlapA && !overlapB) continue;
      consumed.add(j);
      merged.fromA = Math.min(merged.fromA, other.fromA);
      merged.toA = Math.max(merged.toA, other.toA);
      merged.fromB = Math.min(merged.fromB, other.fromB);
      merged.toB = Math.max(merged.toB, other.toB);
    }
    const absorbedIndexes = [];
    for (let k = 0; k < result.length; k++) {
      const prev = result[k];
      if (!prev.isCustomBlock) continue;
      const touchesA = overlaps(merged.fromA, merged.toA, prev.fromA, prev.toA);
      const touchesB = overlaps(merged.fromB, merged.toB, prev.fromB, prev.toB);
      if (!touchesA && !touchesB) continue;
      merged.fromA = Math.min(merged.fromA, prev.fromA);
      merged.toA = Math.max(merged.toA, prev.toA);
      merged.fromB = Math.min(merged.fromB, prev.fromB);
      merged.toB = Math.max(merged.toB, prev.toB);
      absorbedIndexes.push(k);
    }
    for (let k = absorbedIndexes.length - 1; k >= 0; k--) {
      result.splice(absorbedIndexes[k], 1);
    }
    result.push(merged);
  }
  return result;
}
function anchorTrailingInsertsBeforeEmptyParagraph(changes, doc) {
  const trailingStart = trailingEmptyParagraphStart(doc);
  if (trailingStart === doc.content.size) return;
  for (const change of changes) {
    const isPureInsert = change.fromA === change.toA && change.fromB < change.toB;
    if (isPureInsert && change.fromA >= trailingStart) {
      change.fromA = trailingStart;
      change.toA = trailingStart;
    }
  }
}
function expandToCustomBlockRange(doc, from, to, customBlockTypes) {
  if (from === to) {
    if (getCustomBlockAncestor(doc, from, customBlockTypes) == null) return null;
    return getTopLevelBlockRange(doc, from);
  }
  if (getCustomBlockAt(doc, from, customBlockTypes) != null) {
    return getTopLevelBlockRange(doc, from);
  }
  if (getCustomBlockAt(doc, to, customBlockTypes, true) != null) {
    return getTopLevelBlockRange(doc, to, true);
  }
  return null;
}
const diffDecorationKey = new PluginKey(
  "MILKDOWN_DIFF_DECORATION"
);
const diffDecorationPlugin = $prose((ctx) => {
  const config = ctx.get(diffComponentConfig.key);
  return new Plugin({
    key: diffDecorationKey,
    state: {
      init: () => DecorationSet.empty,
      apply(tr, decorations, _oldState, newState) {
        const diffState = diffPluginKey.getState(newState);
        if (!(diffState == null ? void 0 : diffState.active)) return DecorationSet.empty;
        if (tr.getMeta(diffPluginKey) || tr.docChanged)
          return buildDecorations(ctx, newState.doc, diffState, config);
        return decorations.map(tr.mapping, tr.doc);
      }
    },
    props: {
      decorations(state) {
        var _a;
        return (_a = diffDecorationKey.getState(state)) != null ? _a : DecorationSet.empty;
      }
    }
  });
});
withMeta$6(diffDecorationPlugin, {
  displayName: "Prose<diffDecoration>",
  group: "DiffComponent"
});
function addCrossBoundaryDecorations({
  doc,
  newDoc,
  segments,
  change,
  changeIndex,
  commands,
  acceptLabel,
  rejectLabel,
  decorations
}) {
  for (let j = 0; j < segments.length; j++) {
    const seg = segments[j];
    const segDeletion = seg.fromA < seg.toA;
    const segInsertion = seg.fromB < seg.toB;
    if (segDeletion) {
      if (seg.isBlock) {
        addBlockDeletionDecorations(doc, seg.fromA, seg.toA, decorations);
      } else {
        decorations.push(
          Decoration.inline(seg.fromA, seg.toA, {
            class: `${DIFF_CLASS_PREFIX}-removed`
          })
        );
      }
    }
    if (segInsertion) {
      const widgetPos = seg.isBlock ? snapToBlockBoundary(doc, segDeletion ? seg.toA : seg.fromA) : segDeletion ? seg.toA : seg.fromA;
      const widget = createInsertedWidget(newDoc, seg, seg.isBlock);
      decorations.push(
        Decoration.widget(widgetPos, widget, {
          side: -1,
          key: `added-${changeIndex}-${j}`
        })
      );
    }
  }
  const lastSeg = segments[segments.length - 1];
  const lastSegEnd = lastSeg.isBlock ? lastSeg.fromA < lastSeg.toA ? lastSeg.toA : lastSeg.fromA : change.toA;
  const controlsPos = snapToBlockBoundary(doc, lastSegEnd);
  const controls = createControlsWidget({
    commands,
    isBlockLevel: true,
    change,
    acceptLabel,
    rejectLabel
  });
  decorations.push(
    Decoration.widget(controlsPos, controls, {
      side: -1,
      key: `controls-${changeIndex}`
    })
  );
}
function buildDecorations(ctx, doc, diffState, config) {
  const decorations = [];
  const commands = ctx.get(commandsCtx);
  const customBlockTypes = new Set(config.customBlockTypes);
  const pending = getPendingChanges(diffState);
  const mergedChanges = mergeBlockChanges(
    pending,
    doc,
    diffState.newDoc,
    customBlockTypes
  );
  anchorTrailingInsertsBeforeEmptyParagraph(mergedChanges, doc);
  for (let i = 0; i < mergedChanges.length; i++) {
    const change = mergedChanges[i];
    const isDeletion = change.fromA < change.toA;
    const isInsertion = change.fromB < change.toB;
    if (isDeletion && !isInsertion && coversOnlyTrailingEmptyParagraphs(doc, change.fromA, change.toA))
      continue;
    const deletionSpansBlocks = isDeletion && isBlockSpanning(doc, change.fromA, change.toA);
    const deletionHasBlocks = isDeletion && hasBlockContent(doc, change.fromA, change.toA);
    const insertionHasBlocks = isInsertion && hasBlockContent(diffState.newDoc, change.fromB, change.toB);
    const deletionWithinSingleBlock = isDeletion && !deletionSpansBlocks && !deletionHasBlocks && !change.isCustomBlock && !insertionHasBlocks;
    const isBlockLevel = (deletionSpansBlocks || deletionHasBlocks || insertionHasBlocks) && !deletionWithinSingleBlock;
    if (isBlockLevel && !change.isCustomBlock) {
      const segments = splitCrossBoundaryChange(doc, diffState.newDoc, change);
      if (segments) {
        addCrossBoundaryDecorations({
          doc,
          newDoc: diffState.newDoc,
          segments,
          change,
          changeIndex: i,
          commands,
          acceptLabel: config.acceptLabel,
          rejectLabel: config.rejectLabel,
          decorations
        });
        continue;
      }
    }
    if (isDeletion) {
      if (change.isCustomBlock || isBlockLevel) {
        addBlockDeletionDecorations(doc, change.fromA, change.toA, decorations);
      } else {
        decorations.push(
          Decoration.inline(change.fromA, change.toA, {
            class: `${DIFF_CLASS_PREFIX}-removed`
          })
        );
      }
    }
    const rawWidgetPos = isDeletion ? change.toA : change.fromA;
    const widgetPos = isBlockLevel ? snapToBlockBoundary(doc, rawWidgetPos) : rawWidgetPos;
    if (isInsertion) {
      const widget = createInsertedWidget(
        diffState.newDoc,
        change,
        isBlockLevel
      );
      decorations.push(
        Decoration.widget(widgetPos, widget, { side: -1, key: `added-${i}` })
      );
    }
    const controls = createControlsWidget({
      commands,
      isBlockLevel,
      change,
      acceptLabel: config.acceptLabel,
      rejectLabel: config.rejectLabel
    });
    decorations.push(
      Decoration.widget(widgetPos, controls, {
        side: isBlockLevel ? -1 : 1,
        key: `controls-${i}`
      })
    );
  }
  return DecorationSet.create(doc, decorations);
}
function createInsertedWidget(newDoc, change, isBlockLevel) {
  var _a;
  const dom = document.createElement(isBlockLevel ? "div" : "span");
  dom.className = `${DIFF_CLASS_PREFIX}-added`;
  dom.contentEditable = "false";
  if (isBlockLevel) dom.classList.add(`${DIFF_CLASS_PREFIX}-added-block`);
  const serializer = DOMSerializer.fromSchema(newDoc.type.schema);
  if (isBlockLevel) {
    const nodes = collectTopLevelNodes(newDoc, change.fromB, change.toB);
    if (nodes.length > 0) {
      const fragment2 = document.createDocumentFragment();
      for (const node of nodes) {
        fragment2.appendChild(serializer.serializeNode(node));
      }
      dom.appendChild(fragment2);
      return dom;
    }
  }
  const slice = newDoc.slice(change.fromB, change.toB);
  const fragment = serializer.serializeFragment(slice.content);
  dom.appendChild(fragment);
  if (!((_a = dom.textContent) == null ? void 0 : _a.trim()) && !dom.querySelector("img, video, audio, canvas, svg")) {
    const fallback = newDoc.textBetween(change.fromB, change.toB, "\n", "\n");
    if (fallback.trim()) {
      dom.textContent = fallback;
    }
  }
  return dom;
}
function createControlsWidget({
  commands,
  isBlockLevel,
  change,
  acceptLabel,
  rejectLabel
}) {
  const dom = document.createElement(isBlockLevel ? "div" : "span");
  dom.className = `${DIFF_CLASS_PREFIX}-controls`;
  dom.contentEditable = "false";
  if (isBlockLevel) dom.classList.add(`${DIFF_CLASS_PREFIX}-controls-block`);
  const handler = (action) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const range = {
      fromA: change.fromA,
      toA: change.toA,
      fromB: change.fromB,
      toB: change.toB
    };
    const key = action === "accept" ? acceptDiffRangeCmd.key : rejectDiffRangeCmd.key;
    commands.call(key, range);
  };
  const acceptBtn = document.createElement("button");
  acceptBtn.className = `${DIFF_CLASS_PREFIX}-accept`;
  acceptBtn.textContent = acceptLabel;
  acceptBtn.addEventListener("click", handler("accept"));
  const rejectBtn = document.createElement("button");
  rejectBtn.className = `${DIFF_CLASS_PREFIX}-reject`;
  rejectBtn.textContent = rejectLabel;
  rejectBtn.addEventListener("click", handler("reject"));
  dom.appendChild(acceptBtn);
  dom.appendChild(rejectBtn);
  return dom;
}
const diffComponent = [
  diffComponentConfig,
  diffDecorationPlugin
];
function keepAlive$6(..._args) {
}
keepAlive$6(vueExports.h);
function Icon$6({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$6.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
var __defProp$2$2 = Object.defineProperty;
var __getOwnPropSymbols$2$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2$2 = (obj, key, value) => key in obj ? __defProp$2$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2$2.call(b, prop))
      __defNormalProp$2$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2$2)
    for (var prop of __getOwnPropSymbols$2$2(b)) {
      if (__propIsEnum$2$2.call(b, prop))
        __defNormalProp$2$2(a, prop, b[prop]);
    }
  return a;
};
function withMeta$5(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$2$2({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
const defaultImageBlockConfig = {
  imageIcon: "🌌",
  captionIcon: "💬",
  uploadButton: "Upload file",
  confirmButton: "Confirm ⏎",
  uploadPlaceholderText: "or paste the image link ...",
  captionPlaceholderText: "Image caption",
  onUpload: (file) => Promise.resolve(URL.createObjectURL(file))
};
const imageBlockConfig = $ctx(
  defaultImageBlockConfig,
  "imageBlockConfigCtx"
);
withMeta$5(imageBlockConfig, {
  displayName: "Config<image-block>",
  group: "ImageBlock"
});
function visitImage(ast) {
  return visit(
    ast,
    "paragraph",
    (node, index, parent) => {
      var _a, _b;
      if (((_a = node.children) == null ? void 0 : _a.length) !== 1) return;
      const firstChild = (_b = node.children) == null ? void 0 : _b[0];
      if (!firstChild || firstChild.type !== "image") return;
      const { url, alt, title } = firstChild;
      const newNode = {
        type: "image-block",
        url,
        alt,
        title
      };
      parent.children.splice(index, 1, newNode);
    }
  );
}
const remarkImageBlockPlugin = $remark(
  "remark-image-block",
  () => () => visitImage
);
withMeta$5(remarkImageBlockPlugin.plugin, {
  displayName: "Remark<remarkImageBlock>",
  group: "ImageBlock"
});
withMeta$5(remarkImageBlockPlugin.options, {
  displayName: "RemarkConfig<remarkImageBlock>",
  group: "ImageBlock"
});
var __defProp$1$2 = Object.defineProperty;
var __getOwnPropSymbols$1$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$1$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$1$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1$2 = (obj, key, value) => key in obj ? __defProp$1$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1$2.call(b, prop))
      __defNormalProp$1$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$1$2)
    for (var prop of __getOwnPropSymbols$1$2(b)) {
      if (__propIsEnum$1$2.call(b, prop))
        __defNormalProp$1$2(a, prop, b[prop]);
    }
  return a;
};
const IMAGE_DATA_TYPE = "image-block";
const imageBlockSchema = $nodeSchema("image-block", () => {
  return {
    inline: false,
    group: "block",
    selectable: true,
    draggable: true,
    isolating: true,
    marks: "",
    atom: true,
    priority: 100,
    attrs: {
      src: { default: "", validate: "string" },
      caption: { default: "", validate: "string" },
      ratio: { default: 1, validate: "number" }
    },
    parseDOM: [
      {
        tag: `img[data-type="${IMAGE_DATA_TYPE}"]`,
        getAttrs: (dom) => {
          var _a;
          if (!(dom instanceof HTMLElement)) throw expectDomTypeError(dom);
          return {
            src: dom.getAttribute("src") || "",
            caption: dom.getAttribute("caption") || "",
            ratio: Number((_a = dom.getAttribute("ratio")) != null ? _a : 1)
          };
        }
      }
    ],
    toDOM: (node) => ["img", __spreadValues$1$2({ "data-type": IMAGE_DATA_TYPE }, node.attrs)],
    parseMarkdown: {
      match: ({ type }) => type === "image-block",
      runner: (state, node, type) => {
        const src = node.url;
        const caption = node.title;
        let ratio = Number(node.alt || 1);
        if (Number.isNaN(ratio) || ratio === 0) ratio = 1;
        state.addNode(type, {
          src,
          caption,
          ratio
        });
      }
    },
    toMarkdown: {
      match: (node) => node.type.name === "image-block",
      runner: (state, node) => {
        state.openNode("paragraph");
        state.addNode("image", void 0, void 0, {
          title: node.attrs.caption,
          url: node.attrs.src,
          alt: `${Number.parseFloat(node.attrs.ratio).toFixed(2)}`
        });
        state.closeNode();
      }
    }
  };
});
withMeta$5(imageBlockSchema.node, {
  displayName: "NodeSchema<image-block>",
  group: "ImageBlock"
});
function keepAlive$5(..._args) {
}
keepAlive$5(vueExports.h);
function Icon$5({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$5.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
keepAlive$5(vueExports.h, vueExports.Fragment);
const nanoid$1 = customAlphabet("abcdefg", 8);
const ImageInput$1 = vueExports.defineComponent({
  props: {
    src: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    setLink: {
      type: Function,
      required: true
    },
    imageIcon: {
      type: String,
      required: false
    },
    uploadButton: {
      type: String,
      required: false
    },
    confirmButton: {
      type: String,
      required: false
    },
    uploadPlaceholderText: {
      type: String,
      required: false
    },
    onUpload: {
      type: Function,
      required: true
    },
    onImageLoadError: {
      type: Function,
      required: false
    }
  },
  setup({
    readonly,
    src,
    setLink,
    onUpload,
    imageIcon,
    uploadButton,
    confirmButton,
    uploadPlaceholderText,
    className,
    onImageLoadError
  }) {
    var _a, _b;
    const focusLinkInput = vueExports.ref(false);
    const linkInputRef = vueExports.ref();
    const currentLink = vueExports.ref((_a = src.value) != null ? _a : "");
    const uuid = vueExports.ref(nanoid$1());
    const hidePlaceholder = vueExports.ref(((_b = src.value) == null ? void 0 : _b.length) !== 0);
    const onEditLink = (e) => {
      const target = e.target;
      const value = target.value;
      hidePlaceholder.value = value.length !== 0;
      currentLink.value = value;
    };
    const onKeydown = (e) => {
      var _a2, _b2;
      if (e.key === "Enter") {
        setLink((_b2 = (_a2 = linkInputRef.value) == null ? void 0 : _a2.value) != null ? _b2 : "");
      }
    };
    const onConfirmLinkInput = () => {
      var _a2, _b2;
      setLink((_b2 = (_a2 = linkInputRef.value) == null ? void 0 : _a2.value) != null ? _b2 : "");
    };
    const onUploadFile = (e) => {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file) return;
      onUpload(file).then((url) => {
        if (!url) return;
        setLink(url);
        hidePlaceholder.value = true;
      }).catch((err) => {
        console.error("An error occurred while uploading image");
        console.error(err);
      });
    };
    return () => {
      return /* @__PURE__ */ vueExports.h("div", { class: clsx("image-edit", className) }, /* @__PURE__ */ vueExports.h(Icon$5, { icon: imageIcon, class: "image-icon" }), /* @__PURE__ */ vueExports.h("div", { class: clsx("link-importer", focusLinkInput.value && "focus") }, /* @__PURE__ */ vueExports.h(
        "input",
        {
          ref: linkInputRef,
          draggable: "true",
          onDragstart: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          disabled: readonly.value,
          class: "link-input-area",
          value: currentLink.value,
          onInput: onEditLink,
          onKeydown,
          onFocus: () => focusLinkInput.value = true,
          onBlur: () => focusLinkInput.value = false
        }
      ), !hidePlaceholder.value && /* @__PURE__ */ vueExports.h("div", { class: "placeholder" }, /* @__PURE__ */ vueExports.h(
        "input",
        {
          disabled: readonly.value,
          class: "hidden",
          id: uuid.value,
          type: "file",
          accept: "image/*",
          onChange: onUploadFile
        }
      ), /* @__PURE__ */ vueExports.h("label", { class: "uploader", for: uuid.value }, /* @__PURE__ */ vueExports.h(Icon$5, { icon: uploadButton })), /* @__PURE__ */ vueExports.h("span", { class: "text", onClick: () => {
        var _a2;
        return (_a2 = linkInputRef.value) == null ? void 0 : _a2.focus();
      } }, uploadPlaceholderText))), currentLink.value && /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("div", { class: "image-preview" }, /* @__PURE__ */ vueExports.h(
        "img",
        {
          src: currentLink.value,
          alt: "",
          onError: (e) => Promise.resolve(onImageLoadError == null ? void 0 : onImageLoadError(e)).catch(() => {
          })
        }
      )), /* @__PURE__ */ vueExports.h("div", { class: "confirm", onClick: () => onConfirmLinkInput() }, /* @__PURE__ */ vueExports.h(Icon$5, { icon: confirmButton }))));
    };
  }
});
keepAlive$5(vueExports.h, vueExports.Fragment);
const ImageViewer = vueExports.defineComponent({
  props: {
    src: {
      type: Object,
      required: true
    },
    caption: {
      type: Object,
      required: true
    },
    ratio: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    setAttr: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  setup({ src, caption, ratio, readonly, setAttr, config }) {
    var _a;
    const imageRef = vueExports.ref();
    const resizeHandle = vueExports.ref();
    const showCaption = vueExports.ref(Boolean((_a = caption.value) == null ? void 0 : _a.length));
    const timer = vueExports.ref(0);
    const onImageLoad = () => {
      var _a2;
      const image = imageRef.value;
      if (!image) return;
      const host = image.closest(".milkdown-image-block");
      if (!host) return;
      let maxWidth = host.getBoundingClientRect().width;
      if (!maxWidth) return;
      if (config.maxWidth && config.maxWidth < maxWidth)
        maxWidth = config.maxWidth;
      const height = image.naturalHeight;
      const width = image.naturalWidth;
      let transformedHeight = width < maxWidth ? height : maxWidth * (height / width);
      if (config.maxHeight && transformedHeight > config.maxHeight)
        transformedHeight = config.maxHeight;
      const h2 = (transformedHeight * ((_a2 = ratio.value) != null ? _a2 : 1)).toFixed(2);
      image.dataset.origin = transformedHeight.toFixed(2);
      image.dataset.height = h2;
      image.style.height = `${h2}px`;
      if (config.maxWidth) image.style.maxWidth = `${config.maxWidth}px`;
    };
    const onToggleCaption = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (readonly.value) return;
      showCaption.value = !showCaption.value;
    };
    const onInputCaption = (e) => {
      const target = e.target;
      const value = target.value;
      if (timer.value) window.clearTimeout(timer.value);
      timer.value = window.setTimeout(() => {
        setAttr("caption", value);
      }, 1e3);
    };
    const onBlurCaption = (e) => {
      const target = e.target;
      const value = target.value;
      if (timer.value) {
        window.clearTimeout(timer.value);
        timer.value = 0;
      }
      setAttr("caption", value);
    };
    const onResizeHandlePointerMove = (e) => {
      e.preventDefault();
      const image = imageRef.value;
      if (!image) return;
      const top = image.getBoundingClientRect().top;
      let height = e.clientY - top;
      if (height < 100) height = 100;
      if (config.maxHeight && height > config.maxHeight)
        height = config.maxHeight;
      const h2 = Number(height).toFixed(2);
      image.dataset.height = h2;
      image.style.height = `${h2}px`;
    };
    const onResizeHandlePointerUp = () => {
      window.removeEventListener("pointermove", onResizeHandlePointerMove);
      window.removeEventListener("pointerup", onResizeHandlePointerUp);
      const image = imageRef.value;
      if (!image) return;
      const originHeight = Number(image.dataset.origin);
      const currentHeight = Number(image.dataset.height);
      const ratio2 = Number.parseFloat(
        Number(currentHeight / originHeight).toFixed(2)
      );
      if (Number.isNaN(ratio2)) return;
      setAttr("ratio", ratio2);
    };
    const onResizeHandlePointerDown = (e) => {
      if (readonly.value) return;
      e.preventDefault();
      e.stopPropagation();
      window.addEventListener("pointermove", onResizeHandlePointerMove);
      window.addEventListener("pointerup", onResizeHandlePointerUp);
    };
    return () => {
      return /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("div", { class: "image-wrapper" }, /* @__PURE__ */ vueExports.h("div", { class: "operation" }, /* @__PURE__ */ vueExports.h("div", { class: "operation-item", onPointerdown: onToggleCaption }, /* @__PURE__ */ vueExports.h(Icon$5, { icon: config.captionIcon }))), /* @__PURE__ */ vueExports.h(
        "img",
        {
          ref: imageRef,
          "data-type": IMAGE_DATA_TYPE,
          onLoad: onImageLoad,
          src: src.value,
          alt: caption.value,
          onError: (e) => {
            var _a2;
            return Promise.resolve((_a2 = config.onImageLoadError) == null ? void 0 : _a2.call(config, e)).catch(() => {
            });
          }
        }
      ), /* @__PURE__ */ vueExports.h(
        "div",
        {
          ref: resizeHandle,
          class: "image-resize-handle",
          onPointerdown: onResizeHandlePointerDown
        }
      )), showCaption.value && /* @__PURE__ */ vueExports.h(
        "input",
        {
          draggable: "true",
          onDragstart: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          class: "caption-input",
          placeholder: config == null ? void 0 : config.captionPlaceholderText,
          onInput: onInputCaption,
          onBlur: onBlurCaption,
          value: caption.value
        }
      ));
    };
  }
});
var __defProp$7 = Object.defineProperty;
var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$7 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$7.call(b, prop))
      __defNormalProp$7(a, prop, b[prop]);
  if (__getOwnPropSymbols$7)
    for (var prop of __getOwnPropSymbols$7(b)) {
      if (__propIsEnum$7.call(b, prop))
        __defNormalProp$7(a, prop, b[prop]);
    }
  return a;
};
keepAlive$5(vueExports.h, vueExports.Fragment);
const MilkdownImageBlock = vueExports.defineComponent({
  props: {
    src: {
      type: Object,
      required: true
    },
    caption: {
      type: Object,
      required: true
    },
    ratio: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    setAttr: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { src } = props;
    return () => {
      var _a;
      if (!((_a = src.value) == null ? void 0 : _a.length)) {
        return /* @__PURE__ */ vueExports.h(
          ImageInput$1,
          {
            src: props.src,
            selected: props.selected,
            readonly: props.readonly,
            setLink: (link) => props.setAttr("src", link),
            imageIcon: props.config.imageIcon,
            uploadButton: props.config.uploadButton,
            confirmButton: props.config.confirmButton,
            uploadPlaceholderText: props.config.uploadPlaceholderText,
            onUpload: props.config.onUpload,
            onImageLoadError: props.config.onImageLoadError
          }
        );
      }
      return /* @__PURE__ */ vueExports.h(ImageViewer, __spreadValues$7({}, props));
    };
  }
});
const imageBlockView = $view(
  imageBlockSchema.node,
  (ctx) => {
    return (initialNode, view, getPos) => {
      const src = vueExports.ref(initialNode.attrs.src);
      const caption = vueExports.ref(initialNode.attrs.caption);
      const ratio = vueExports.ref(initialNode.attrs.ratio);
      const selected = vueExports.ref(false);
      const readonly = vueExports.ref(!view.editable);
      const setAttr = (attr, value) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;
        view.dispatch(
          view.state.tr.setNodeAttribute(
            pos,
            attr,
            attr === "src" ? purify.sanitize(value) : value
          )
        );
      };
      const config = ctx.get(imageBlockConfig.key);
      const app = vueExports.createApp(MilkdownImageBlock, {
        src,
        caption,
        ratio,
        selected,
        readonly,
        setAttr,
        config
      });
      const dom = document.createElement("div");
      dom.className = "milkdown-image-block";
      const disposeSelectedWatcher = vueExports.watchEffect(() => {
        const isSelected = selected.value;
        if (isSelected) {
          dom.classList.add("selected");
        } else {
          dom.classList.remove("selected");
        }
      });
      const proxyDomURL = config.proxyDomURL;
      const bindAttrs = (node) => {
        if (!proxyDomURL) {
          src.value = node.attrs.src;
        } else {
          const proxiedURL = proxyDomURL(node.attrs.src);
          if (typeof proxiedURL === "string") {
            src.value = proxiedURL;
          } else {
            proxiedURL.then((url) => {
              src.value = url;
            }).catch(console.error);
          }
        }
        ratio.value = node.attrs.ratio;
        caption.value = node.attrs.caption;
        readonly.value = !view.editable;
      };
      bindAttrs(initialNode);
      app.mount(dom);
      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;
          bindAttrs(updatedNode);
          return true;
        },
        stopEvent: (e) => {
          if (e.target instanceof HTMLInputElement) return true;
          return false;
        },
        selectNode: () => {
          selected.value = true;
        },
        deselectNode: () => {
          selected.value = false;
        },
        destroy: () => {
          disposeSelectedWatcher();
          app.unmount();
          dom.remove();
        }
      };
    };
  }
);
withMeta$5(imageBlockView, {
  displayName: "NodeView<image-block>",
  group: "ImageBlock"
});
const imageBlockComponent = [
  remarkImageBlockPlugin,
  imageBlockSchema,
  imageBlockView,
  imageBlockConfig
].flat();
var __defProp$6 = Object.defineProperty;
var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$6 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$6.call(b, prop))
      __defNormalProp$6(a, prop, b[prop]);
  if (__getOwnPropSymbols$6)
    for (var prop of __getOwnPropSymbols$6(b)) {
      if (__propIsEnum$6.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    }
  return a;
};
function withMeta$4(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$6({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
const defaultConfig$1 = {
  extensions: [],
  languages: [],
  expandIcon: "⬇",
  searchIcon: "🔍",
  clearSearchIcon: "⌫",
  searchPlaceholder: "Search language",
  noResultText: "No result",
  copyText: "Copy",
  copyIcon: "📋",
  onCopy: () => {
  },
  renderLanguage: (language) => language,
  renderPreview: () => null,
  previewToggleButton: (previewOnlyMode) => previewOnlyMode ? "Edit" : "Hide",
  previewLabel: "Preview",
  previewLoading: "Loading..."
};
const codeBlockConfig = $ctx(defaultConfig$1, "codeBlockConfigCtx");
withMeta$4(codeBlockConfig, {
  displayName: "Config<code-block>",
  group: "CodeBlock"
});
class LanguageLoader {
  constructor(languages) {
    this.languages = languages;
    this.map = {};
    languages.forEach((language) => {
      language.alias.forEach((alias) => {
        this.map[alias] = language;
      });
    });
  }
  getAll() {
    return this.languages.map((language) => {
      return {
        name: language.name,
        alias: language.alias
      };
    });
  }
  load(languageName) {
    const languageMap = this.map;
    const language = languageMap[languageName.toLowerCase()];
    if (!language) return Promise.resolve(void 0);
    if (language.support) return Promise.resolve(language.support);
    return language.load();
  }
}
function keepAlive$4(..._args) {
}
keepAlive$4(vueExports.h);
function Icon$4({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$4.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
keepAlive$4(vueExports.h, vueExports.Fragment);
function copyToClipboard(text) {
  return __async(this, null, function* () {
    try {
      return navigator.clipboard.writeText(text);
    } catch (e) {
      const element = document.createElement("textarea");
      const previouslyFocusedElement = document.activeElement;
      element.value = text;
      element.setAttribute("readonly", "");
      element.style.contain = "strict";
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.fontSize = "12pt";
      const selection = document.getSelection();
      const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
      document.body.appendChild(element);
      element.select();
      element.selectionStart = 0;
      element.selectionEnd = text.length;
      document.execCommand("copy");
      document.body.removeChild(element);
      if (originalRange) {
        selection.removeAllRanges();
        selection.addRange(originalRange);
      }
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }
  });
}
const CopyButton = vueExports.defineComponent({
  props: {
    copyText: {
      type: String,
      required: true
    },
    copyIcon: {
      type: String,
      required: true
    },
    onCopy: {
      type: Function,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const onCopyCode = () => {
      copyToClipboard(props.text).then(() => props.onCopy(props.text)).catch(console.error);
    };
    return () => {
      return /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("button", { type: "button", class: "copy-button", onClick: onCopyCode }, /* @__PURE__ */ vueExports.h(Icon$4, { icon: props.copyIcon }), props.copyText));
    };
  }
});
keepAlive$4(vueExports.h, vueExports.Fragment);
const LanguagePicker = vueExports.defineComponent({
  props: {
    language: {
      type: Object,
      required: true
    },
    getReadOnly: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    getAllLanguages: {
      type: Function,
      required: true
    },
    setLanguage: {
      type: Function,
      required: true
    }
  },
  setup({ language, config, setLanguage, getAllLanguages, getReadOnly }) {
    const triggerRef = vueExports.ref();
    const showPicker = vueExports.ref(false);
    const searchRef = vueExports.ref();
    const pickerRef = vueExports.ref();
    const filter = vueExports.ref("");
    vueExports.watch([showPicker, triggerRef, pickerRef], () => {
      filter.value = "";
      const picker = triggerRef.value;
      const languageList = pickerRef.value;
      if (!picker || !languageList) return;
      computePosition(picker, languageList, {
        placement: "bottom-start"
      }).then(({ x, y }) => {
        Object.assign(languageList.style, {
          left: `${x}px`,
          top: `${y}px`
        });
      }).catch(console.error);
    });
    const onTogglePicker = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (getReadOnly()) return;
      const next = !showPicker.value;
      showPicker.value = next;
      if (next) {
        setTimeout(() => {
          var _a;
          return (_a = searchRef.value) == null ? void 0 : _a.focus();
        }, 0);
      }
    };
    const changeFilter = (e) => {
      const target = e.target;
      filter.value = target.value;
    };
    const onSearchKeydown = (e) => {
      if (e.key === "Escape") filter.value = "";
    };
    const languages = vueExports.computed(() => {
      var _a;
      if (!showPicker.value) return [];
      const all = (_a = getAllLanguages()) != null ? _a : [];
      const selected = all.find(
        (languageInfo) => languageInfo.name.toLowerCase() === language.value.toLowerCase()
      );
      const filtered = all.filter((languageInfo) => {
        const currentValue = filter.value.toLowerCase();
        return (languageInfo.name.toLowerCase().includes(currentValue) || languageInfo.alias.some(
          (alias) => alias.toLowerCase().includes(currentValue)
        )) && languageInfo !== selected;
      });
      if (filtered.length === 0) return [];
      if (!selected) return filtered;
      return [selected, ...filtered];
    });
    const clickHandler = (e) => {
      const target = e.target;
      if (triggerRef.value && triggerRef.value.contains(target)) return;
      const picker = pickerRef.value;
      const trigger = triggerRef.value;
      if (!trigger || !picker) return;
      if (trigger.dataset.expanded !== "true") return;
      if (!picker.contains(target)) showPicker.value = false;
    };
    vueExports.onMounted(() => {
      window.addEventListener("click", clickHandler);
    });
    vueExports.onUnmounted(() => {
      window.removeEventListener("click", clickHandler);
    });
    return () => {
      return /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h(
        "button",
        {
          type: "button",
          ref: triggerRef,
          class: "language-button",
          onClick: onTogglePicker,
          "data-expanded": String(showPicker.value)
        },
        language.value || "Text",
        /* @__PURE__ */ vueExports.h("div", { class: "expand-icon" }, /* @__PURE__ */ vueExports.h(Icon$4, { icon: config.expandIcon }))
      ), /* @__PURE__ */ vueExports.h("div", { ref: pickerRef, class: "language-picker" }, showPicker.value ? /* @__PURE__ */ vueExports.h("div", { class: "list-wrapper" }, /* @__PURE__ */ vueExports.h("div", { class: "search-box" }, /* @__PURE__ */ vueExports.h("div", { class: "search-icon" }, /* @__PURE__ */ vueExports.h(Icon$4, { icon: config.searchIcon })), /* @__PURE__ */ vueExports.h(
        "input",
        {
          ref: searchRef,
          class: "search-input",
          placeholder: config.searchPlaceholder,
          value: filter.value,
          onInput: changeFilter,
          onKeydown: onSearchKeydown
        }
      ), /* @__PURE__ */ vueExports.h(
        "div",
        {
          class: clsx(
            "clear-icon",
            filter.value.length === 0 && "hidden"
          ),
          onMousedown: (e) => {
            e.preventDefault();
            filter.value = "";
          }
        },
        /* @__PURE__ */ vueExports.h(Icon$4, { icon: config.clearSearchIcon })
      )), /* @__PURE__ */ vueExports.h(
        "ul",
        {
          class: "language-list",
          role: "listbox",
          onKeydown: (e) => {
            if (e.key === "Enter") {
              const active = document.activeElement;
              if (active instanceof HTMLElement && active.dataset.language)
                setLanguage(active.dataset.language);
            }
          }
        },
        !languages.value.length ? /* @__PURE__ */ vueExports.h("li", { class: "language-list-item no-result" }, config.noResultText) : languages.value.map((languageInfo) => /* @__PURE__ */ vueExports.h(
          "li",
          {
            role: "listitem",
            tabindex: "0",
            class: "language-list-item",
            "aria-selected": languageInfo.name.toLowerCase() === language.value.toLowerCase(),
            "data-language": languageInfo.name,
            onClick: () => {
              setLanguage(languageInfo.name);
              showPicker.value = false;
            }
          },
          config.renderLanguage(
            languageInfo.name,
            languageInfo.name.toLowerCase() === language.value.toLowerCase()
          )
        ))
      )) : null));
    };
  }
});
keepAlive$4(vueExports.h, vueExports.Fragment);
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createSvgAwareSanitizer() {
  const purify$1 = purify();
  const config = {
    ADD_TAGS: ["foreignObject"],
    ADD_ATTR: ["xmlns"],
    HTML_INTEGRATION_POINTS: { foreignobject: true }
  };
  purify$1.addHook("uponSanitizeElement", (node, data) => {
    var _a;
    if (data.tagName === "foreignobject") {
      const parent = node.parentElement;
      if (!parent || parent.namespaceURI !== SVG_NAMESPACE) {
        (_a = node.parentNode) == null ? void 0 : _a.removeChild(node);
      }
    }
  });
  return (dirty) => purify$1.sanitize(dirty, config);
}
let cachedSanitizer;
function sanitizeSvg(dirty) {
  cachedSanitizer != null ? cachedSanitizer : cachedSanitizer = createSvgAwareSanitizer();
  return cachedSanitizer(dirty);
}
const PreviewPanel = vueExports.defineComponent({
  props: {
    text: {
      type: Object,
      required: true
    },
    language: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    previewOnlyMode: {
      type: Object,
      required: true
    },
    preview: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { previewOnlyMode, config, preview } = props;
    const previewRef = vueExports.ref();
    vueExports.watchEffect(() => {
      const previewContainer = previewRef.value;
      if (!previewContainer) return;
      while (previewContainer.firstChild) {
        previewContainer.removeChild(previewContainer.firstChild);
      }
      const previewContent = preview.value;
      if (typeof previewContent === "string" || previewContent instanceof Element) {
        previewContainer.innerHTML = sanitizeSvg(previewContent);
      }
    });
    return () => {
      if (!preview.value) return null;
      return /* @__PURE__ */ vueExports.h("div", { class: "preview-panel" }, !previewOnlyMode.value && /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("div", { class: "preview-divider" }), /* @__PURE__ */ vueExports.h("div", { class: "preview-label" }, config.previewLabel)), /* @__PURE__ */ vueExports.h("div", { ref: previewRef, class: "preview" }));
    };
  }
});
keepAlive$4(vueExports.h, vueExports.Fragment);
const CodeBlock = vueExports.defineComponent({
  props: {
    text: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    getReadOnly: {
      type: Function,
      required: true
    },
    codemirror: {
      type: Object,
      required: true
    },
    language: {
      type: Object,
      required: true
    },
    getAllLanguages: {
      type: Function,
      required: true
    },
    setLanguage: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    var _a;
    const previewOnlyByDefault = (_a = props.config.previewOnlyByDefault) != null ? _a : props.getReadOnly();
    const previewOnlyMode = vueExports.ref(previewOnlyByDefault);
    const codemirrorHostRef = vueExports.ref();
    const preview = vueExports.ref(null);
    vueExports.onMounted(() => {
      var _a2;
      while ((_a2 = codemirrorHostRef.value) == null ? void 0 : _a2.firstChild) {
        codemirrorHostRef.value.removeChild(codemirrorHostRef.value.firstChild);
      }
      if (codemirrorHostRef.value) {
        codemirrorHostRef.value.appendChild(props.codemirror.dom);
      }
    });
    vueExports.watch(
      () => [props.text.value, props.language.value],
      () => {
        const result = props.config.renderPreview(
          props.language.value,
          props.text.value,
          (value) => preview.value = value
        );
        if (result) {
          preview.value = result;
        }
        const isAsyncPreview = result === void 0;
        if (isAsyncPreview && !preview.value) {
          preview.value = purify.sanitize(props.config.previewLoading);
        }
        if (result === null) {
          preview.value = null;
        }
      },
      { immediate: true }
    );
    const empty = () => {
    };
    return () => {
      var _a2;
      return /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("div", { class: "tools" }, /* @__PURE__ */ vueExports.h(
        LanguagePicker,
        {
          language: props.language,
          config: props.config,
          setLanguage: props.setLanguage,
          getAllLanguages: props.getAllLanguages,
          getReadOnly: props.getReadOnly
        }
      ), /* @__PURE__ */ vueExports.h("div", { class: "tools-button-group" }, /* @__PURE__ */ vueExports.h(
        CopyButton,
        {
          copyIcon: props.config.copyIcon,
          copyText: props.config.copyText,
          onCopy: (_a2 = props.config.onCopy) != null ? _a2 : empty,
          text: props.text.value
        }
      ), preview.value ? /* @__PURE__ */ vueExports.h(
        "button",
        {
          class: "preview-toggle-button",
          onClick: () => previewOnlyMode.value = !previewOnlyMode.value
        },
        /* @__PURE__ */ vueExports.h(
          Icon$4,
          {
            icon: props.config.previewToggleButton(
              previewOnlyMode.value
            )
          }
        )
      ) : null)), /* @__PURE__ */ vueExports.h(
        "div",
        {
          ref: codemirrorHostRef,
          class: clsx(
            "codemirror-host",
            preview.value && previewOnlyMode.value && "hidden"
          )
        }
      ), /* @__PURE__ */ vueExports.h(
        PreviewPanel,
        {
          text: props.text,
          language: props.language,
          config: props.config,
          previewOnlyMode,
          preview
        }
      ));
    };
  }
});
const visibilityCallbacks = /* @__PURE__ */ new WeakMap();
let sharedObserver = null;
function getSharedObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const callback = visibilityCallbacks.get(entry.target);
          callback == null ? void 0 : callback(entry.isIntersecting);
        }
      },
      { rootMargin: "200px" }
    );
  }
  return sharedObserver;
}
const _CodeMirrorBlock = class _CodeMirrorBlock2 {
  constructor(node, view, getPos, loader, config) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.loader = loader;
    this.config = config;
    this.selected = vueExports.ref(false);
    this.language = vueExports.ref("");
    this.text = vueExports.ref("");
    this.initialized = false;
    this.updating = false;
    this.languageName = "";
    this.teardownTimer = null;
    this.forwardUpdate = (update) => {
      var _a2;
      if (this.updating || !this.cm.hasFocus) return;
      let offset2 = ((_a2 = this.getPos()) != null ? _a2 : 0) + 1;
      const { main } = update.state.selection;
      const selFrom = offset2 + main.from;
      const selTo = offset2 + main.to;
      const pmSel = this.view.state.selection;
      if (update.docChanged || pmSel.from !== selFrom || pmSel.to !== selTo) {
        const tr = this.view.state.tr;
        update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
          if (text.length)
            tr.replaceWith(
              offset2 + fromA,
              offset2 + toA,
              this.view.state.schema.text(text.toString())
            );
          else tr.delete(offset2 + fromA, offset2 + toA);
          offset2 += toB - fromB - (toA - fromA);
        });
        tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo));
        this.view.dispatch(tr);
      }
    };
    this.createApp = () => {
      return vueExports.createApp(CodeBlock, {
        text: this.text,
        selected: this.selected,
        codemirror: this.cm,
        language: this.language,
        getAllLanguages: this.getAllLanguages,
        getReadOnly: () => !this.view.editable,
        setLanguage: this.setLanguage,
        config: this.config
      });
    };
    this.codeMirrorKeymap = () => {
      const view2 = this.view;
      return [
        { key: "ArrowUp", run: () => this.maybeEscape("line", -1) },
        { key: "ArrowLeft", run: () => this.maybeEscape("char", -1) },
        { key: "ArrowDown", run: () => this.maybeEscape("line", 1) },
        { key: "ArrowRight", run: () => this.maybeEscape("char", 1) },
        {
          key: "Mod-Enter",
          run: () => {
            if (!exitCode(view2.state, view2.dispatch)) return false;
            view2.focus();
            return true;
          }
        },
        { key: "Mod-z", run: () => undo(view2.state, view2.dispatch) },
        { key: "Shift-Mod-z", run: () => redo(view2.state, view2.dispatch) },
        { key: "Mod-y", run: () => redo(view2.state, view2.dispatch) },
        {
          key: "Backspace",
          run: () => {
            var _a2;
            const ranges = this.cm.state.selection.ranges;
            if (ranges.length > 1) return false;
            const selection = ranges[0];
            if (selection && (!selection.empty || selection.anchor > 0))
              return false;
            if (this.cm.state.doc.lines >= 2) return false;
            const state = this.view.state;
            const pos = (_a2 = this.getPos()) != null ? _a2 : 0;
            const tr = state.tr.replaceWith(
              pos,
              pos + this.node.nodeSize,
              state.schema.nodes.paragraph.createChecked({}, this.node.content)
            );
            tr.setSelection(TextSelection.near(tr.doc.resolve(pos)));
            this.view.dispatch(tr);
            this.view.focus();
            return true;
          }
        }
      ];
    };
    this.maybeEscape = (unit, dir) => {
      var _a2;
      const { state } = this.cm;
      let main = state.selection.main;
      if (!main.empty) return false;
      if (unit === "line") main = state.doc.lineAt(main.head);
      if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false;
      const targetPos = ((_a2 = this.getPos()) != null ? _a2 : 0) + (dir < 0 ? 0 : this.node.nodeSize);
      const selection = TextSelection.near(
        this.view.state.doc.resolve(targetPos),
        dir
      );
      const tr = this.view.state.tr.setSelection(selection).scrollIntoView();
      this.view.dispatch(tr);
      this.view.focus();
      return true;
    };
    this.setLanguage = (language) => {
      var _a2;
      this.view.dispatch(
        this.view.state.tr.setNodeAttribute(
          (_a2 = this.getPos()) != null ? _a2 : 0,
          "language",
          language
        )
      );
    };
    this.getAllLanguages = () => {
      return this.loader.getAll();
    };
    var _a;
    this.languageConf = new Compartment();
    this.readOnlyConf = new Compartment();
    this.text.value = this.node.textContent;
    this.language.value = (_a = this.node.attrs.language) != null ? _a : "";
    this.dom = document.createElement("div");
    this.dom.className = "milkdown-code-block";
    this.disposeSelectedWatcher = vueExports.watchEffect(() => {
      const isSelected = this.selected.value;
      if (isSelected) {
        this.dom.classList.add("selected");
      } else {
        this.dom.classList.remove("selected");
      }
    });
    this.renderPlaceholder();
    visibilityCallbacks.set(this.dom, (isIntersecting) => {
      if (isIntersecting) {
        this.cancelTeardown();
        this.initializeCodeMirror();
      } else if (this.initialized) {
        this.scheduleTeardown();
      }
    });
    getSharedObserver().observe(this.dom);
  }
  renderPlaceholder() {
    const pre = document.createElement("pre");
    pre.className = "milkdown-code-block-placeholder";
    const code = document.createElement("code");
    code.textContent = this.node.textContent;
    pre.appendChild(code);
    this.dom.appendChild(pre);
  }
  initializeCodeMirror() {
    if (this.initialized) return;
    this.initialized = true;
    this.cm = new EditorView({
      doc: this.node.textContent,
      root: this.view.root,
      extensions: [
        this.readOnlyConf.of(EditorState.readOnly.of(!this.view.editable)),
        drawSelection(),
        keymap.of(this.codeMirrorKeymap()),
        this.languageConf.of([]),
        EditorState.changeFilter.of(() => this.view.editable),
        ...this.config.extensions,
        EditorView.updateListener.of(this.forwardUpdate)
      ]
    });
    const placeholder = this.dom.querySelector(
      ".milkdown-code-block-placeholder"
    );
    if (placeholder) {
      this.dom.removeChild(placeholder);
    }
    this.app = this.createApp();
    this.app.mount(this.dom);
    this.updateLanguage();
  }
  teardownCodeMirror() {
    if (!this.initialized) return;
    if (this.cm.hasFocus || this.selected.value) return;
    this.app.unmount();
    this.cm.destroy();
    this.initialized = false;
    this.languageName = "";
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }
    this.renderPlaceholder();
  }
  scheduleTeardown() {
    this.cancelTeardown();
    this.teardownTimer = setTimeout(
      () => this.teardownCodeMirror(),
      _CodeMirrorBlock2.TEARDOWN_DELAY
    );
  }
  cancelTeardown() {
    if (this.teardownTimer != null) {
      clearTimeout(this.teardownTimer);
      this.teardownTimer = null;
    }
  }
  updateLanguage() {
    const languageName = this.node.attrs.language;
    if (languageName === this.languageName) return;
    this.language.value = languageName;
    const language = this.loader.load(languageName != null ? languageName : "");
    language.then((lang) => {
      if (lang) {
        this.cm.dispatch({
          effects: this.languageConf.reconfigure(lang)
        });
        this.languageName = languageName;
      }
    }).catch(console.error);
  }
  setSelection(anchor, head) {
    if (!this.initialized) {
      this.initializeCodeMirror();
    }
    if (!this.cm.dom.isConnected) return;
    this.cm.focus();
    this.updating = true;
    this.cm.dispatch({ selection: { anchor, head } });
    this.updating = false;
  }
  update(node) {
    var _a;
    if (node.type !== this.node.type) return false;
    if (this.updating) return true;
    this.node = node;
    this.text.value = node.textContent;
    this.language.value = (_a = node.attrs.language) != null ? _a : "";
    if (!this.initialized) {
      const code = this.dom.querySelector(
        ".milkdown-code-block-placeholder code"
      );
      if (code) {
        code.textContent = node.textContent;
      }
      return true;
    }
    this.updateLanguage();
    if (this.view.editable === this.cm.state.readOnly) {
      this.cm.dispatch({
        effects: this.readOnlyConf.reconfigure(
          EditorState.readOnly.of(!this.view.editable)
        )
      });
    }
    const change = computeChange(this.cm.state.doc.toString(), node.textContent);
    if (change) {
      this.updating = true;
      this.cm.dispatch({
        changes: { from: change.from, to: change.to, insert: change.text },
        scrollIntoView: true
      });
      this.updating = false;
    }
    return true;
  }
  selectNode() {
    if (!this.initialized) {
      this.initializeCodeMirror();
    }
    this.selected.value = true;
    this.cm.focus();
  }
  deselectNode() {
    this.selected.value = false;
  }
  stopEvent() {
    return true;
  }
  destroy() {
    this.cancelTeardown();
    getSharedObserver().unobserve(this.dom);
    visibilityCallbacks.delete(this.dom);
    if (this.initialized) {
      this.app.unmount();
      this.cm.destroy();
    }
    this.disposeSelectedWatcher();
  }
};
_CodeMirrorBlock.TEARDOWN_DELAY = 5e3;
let CodeMirrorBlock = _CodeMirrorBlock;
function computeChange(oldVal, newVal) {
  if (oldVal === newVal) return null;
  let start = 0;
  let oldEnd = oldVal.length;
  let newEnd = newVal.length;
  while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start))
    ++start;
  while (oldEnd > start && newEnd > start && oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)) {
    oldEnd--;
    newEnd--;
  }
  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
}
const codeBlockView = $view(
  codeBlockSchema.node,
  (ctx) => {
    const config = ctx.get(codeBlockConfig.key);
    const languageLoader = new LanguageLoader(config.languages);
    return (node, view, getPos) => new CodeMirrorBlock(node, view, getPos, languageLoader, config);
  }
);
withMeta$4(codeBlockView, {
  displayName: "NodeView<code-block>",
  group: "CodeBlock"
});
const codeBlockComponent = [
  codeBlockView,
  codeBlockConfig
];
var __defProp$5 = Object.defineProperty;
var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$5 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$5.call(b, prop))
      __defNormalProp$5(a, prop, b[prop]);
  if (__getOwnPropSymbols$5)
    for (var prop of __getOwnPropSymbols$5(b)) {
      if (__propIsEnum$5.call(b, prop))
        __defNormalProp$5(a, prop, b[prop]);
    }
  return a;
};
function withMeta$3(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$5({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
const defaultInlineImageConfig = {
  imageIcon: "🌌",
  uploadButton: "Upload",
  confirmButton: "⏎",
  uploadPlaceholderText: "/Paste",
  onUpload: (file) => Promise.resolve(URL.createObjectURL(file))
};
const inlineImageConfig = $ctx(
  defaultInlineImageConfig,
  "inlineImageConfigCtx"
);
withMeta$3(inlineImageConfig, {
  displayName: "Config<image-inline>",
  group: "ImageInline"
});
function keepAlive$3(..._args) {
}
keepAlive$3(vueExports.h);
function Icon$3({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$3.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
keepAlive$3(vueExports.h, vueExports.Fragment);
const nanoid = customAlphabet("abcdefg", 8);
const ImageInput = vueExports.defineComponent({
  props: {
    src: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    setLink: {
      type: Function,
      required: true
    },
    imageIcon: {
      type: String,
      required: false
    },
    uploadButton: {
      type: String,
      required: false
    },
    confirmButton: {
      type: String,
      required: false
    },
    uploadPlaceholderText: {
      type: String,
      required: false
    },
    onUpload: {
      type: Function,
      required: true
    },
    onImageLoadError: {
      type: Function,
      required: false
    }
  },
  setup({
    readonly,
    src,
    setLink,
    onUpload,
    imageIcon,
    uploadButton,
    confirmButton,
    uploadPlaceholderText,
    className,
    onImageLoadError
  }) {
    var _a, _b;
    const focusLinkInput = vueExports.ref(false);
    const linkInputRef = vueExports.ref();
    const currentLink = vueExports.ref((_a = src.value) != null ? _a : "");
    const uuid = vueExports.ref(nanoid());
    const hidePlaceholder = vueExports.ref(((_b = src.value) == null ? void 0 : _b.length) !== 0);
    const onEditLink = (e) => {
      const target = e.target;
      const value = target.value;
      hidePlaceholder.value = value.length !== 0;
      currentLink.value = value;
    };
    const onKeydown = (e) => {
      var _a2, _b2;
      if (e.key === "Enter") {
        setLink((_b2 = (_a2 = linkInputRef.value) == null ? void 0 : _a2.value) != null ? _b2 : "");
      }
    };
    const onConfirmLinkInput = () => {
      var _a2, _b2;
      setLink((_b2 = (_a2 = linkInputRef.value) == null ? void 0 : _a2.value) != null ? _b2 : "");
    };
    const onUploadFile = (e) => {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file) return;
      onUpload(file).then((url) => {
        if (!url) return;
        setLink(url);
        hidePlaceholder.value = true;
      }).catch((err) => {
        console.error("An error occurred while uploading image");
        console.error(err);
      });
    };
    return () => {
      return /* @__PURE__ */ vueExports.h("div", { class: clsx("image-edit", className) }, /* @__PURE__ */ vueExports.h(Icon$3, { icon: imageIcon, class: "image-icon" }), /* @__PURE__ */ vueExports.h("div", { class: clsx("link-importer", focusLinkInput.value && "focus") }, /* @__PURE__ */ vueExports.h(
        "input",
        {
          ref: linkInputRef,
          draggable: "true",
          onDragstart: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          disabled: readonly.value,
          class: "link-input-area",
          value: currentLink.value,
          onInput: onEditLink,
          onKeydown,
          onFocus: () => focusLinkInput.value = true,
          onBlur: () => focusLinkInput.value = false
        }
      ), !hidePlaceholder.value && /* @__PURE__ */ vueExports.h("div", { class: "placeholder" }, /* @__PURE__ */ vueExports.h(
        "input",
        {
          disabled: readonly.value,
          class: "hidden",
          id: uuid.value,
          type: "file",
          accept: "image/*",
          onChange: onUploadFile
        }
      ), /* @__PURE__ */ vueExports.h("label", { class: "uploader", for: uuid.value }, /* @__PURE__ */ vueExports.h(Icon$3, { icon: uploadButton })), /* @__PURE__ */ vueExports.h("span", { class: "text", onClick: () => {
        var _a2;
        return (_a2 = linkInputRef.value) == null ? void 0 : _a2.focus();
      } }, uploadPlaceholderText))), currentLink.value && /* @__PURE__ */ vueExports.h(vueExports.Fragment, null, /* @__PURE__ */ vueExports.h("div", { class: "image-preview" }, /* @__PURE__ */ vueExports.h(
        "img",
        {
          src: currentLink.value,
          alt: "",
          onError: (e) => Promise.resolve(onImageLoadError == null ? void 0 : onImageLoadError(e)).catch(() => {
          })
        }
      )), /* @__PURE__ */ vueExports.h("div", { class: "confirm", onClick: () => onConfirmLinkInput() }, /* @__PURE__ */ vueExports.h(Icon$3, { icon: confirmButton }))));
    };
  }
});
keepAlive$3(vueExports.h, vueExports.Fragment);
const MilkdownImageInline = vueExports.defineComponent({
  props: {
    src: {
      type: Object,
      required: true
    },
    alt: {
      type: Object,
      required: true
    },
    title: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    setAttr: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { src, alt, title } = props;
    return () => {
      var _a;
      if (!((_a = src.value) == null ? void 0 : _a.length)) {
        return /* @__PURE__ */ vueExports.h(
          ImageInput,
          {
            src: props.src,
            selected: props.selected,
            readonly: props.readonly,
            setLink: (link) => props.setAttr("src", link),
            imageIcon: props.config.imageIcon,
            uploadButton: props.config.uploadButton,
            confirmButton: props.config.confirmButton,
            uploadPlaceholderText: props.config.uploadPlaceholderText,
            onUpload: props.config.onUpload,
            className: "empty-image-inline"
          }
        );
      }
      return /* @__PURE__ */ vueExports.h(
        "img",
        {
          class: "image-inline",
          src: src.value,
          alt: alt.value,
          title: title.value
        }
      );
    };
  }
});
const inlineImageView = $view(
  imageSchema.node,
  (ctx) => {
    return (initialNode, view, getPos) => {
      const src = vueExports.ref(initialNode.attrs.src);
      const alt = vueExports.ref(initialNode.attrs.alt);
      const title = vueExports.ref(initialNode.attrs.title);
      const selected = vueExports.ref(false);
      const readonly = vueExports.ref(!view.editable);
      const setAttr = (attr, value) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;
        view.dispatch(
          view.state.tr.setNodeAttribute(
            pos,
            attr,
            attr === "src" ? purify.sanitize(value) : value
          )
        );
      };
      const config = ctx.get(inlineImageConfig.key);
      const app = vueExports.createApp(MilkdownImageInline, {
        src,
        alt,
        title,
        selected,
        readonly,
        setAttr,
        config
      });
      const dom = document.createElement("span");
      dom.className = "milkdown-image-inline";
      const disposeSelectedWatcher = vueExports.watchEffect(() => {
        const isSelected = selected.value;
        if (isSelected) {
          dom.classList.add("selected");
        } else {
          dom.classList.remove("selected");
        }
      });
      const proxyDomURL = config.proxyDomURL;
      const bindAttrs = (node) => {
        if (!proxyDomURL) {
          src.value = node.attrs.src;
        } else {
          const proxiedURL = proxyDomURL(node.attrs.src);
          if (typeof proxiedURL === "string") {
            src.value = proxiedURL;
          } else {
            proxiedURL.then((url) => {
              src.value = url;
            }).catch(console.error);
          }
        }
        alt.value = node.attrs.alt;
        title.value = node.attrs.title;
      };
      bindAttrs(initialNode);
      app.mount(dom);
      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;
          bindAttrs(updatedNode);
          return true;
        },
        stopEvent: (e) => {
          if (e.target instanceof HTMLInputElement) return true;
          return false;
        },
        selectNode: () => {
          selected.value = true;
        },
        deselectNode: () => {
          selected.value = false;
        },
        destroy: () => {
          disposeSelectedWatcher();
          app.unmount();
          dom.remove();
        }
      };
    };
  }
);
withMeta$3(inlineImageView, {
  displayName: "NodeView<image-inline>",
  group: "ImageInline"
});
const imageInlineComponent = [
  inlineImageConfig,
  inlineImageView
];
var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
function withMeta$2(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$3({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
var __defProp$2$1 = Object.defineProperty;
var __getOwnPropSymbols$2$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$2$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$2$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2$1 = (obj, key, value) => key in obj ? __defProp$2$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2$1.call(b, prop))
      __defNormalProp$2$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$2$1)
    for (var prop of __getOwnPropSymbols$2$1(b)) {
      if (__propIsEnum$2$1.call(b, prop))
        __defNormalProp$2$1(a, prop, b[prop]);
    }
  return a;
};
const defaultState = {
  mode: "preview"
};
const linkTooltipState = $ctx(__spreadValues$2$1({}, defaultState), "linkTooltipStateCtx");
withMeta$2(linkTooltipState, {
  displayName: "State<link-tooltip>",
  group: "LinkTooltip"
});
const defaultAPI = {
  addLink: () => {
  },
  editLink: () => {
  },
  removeLink: () => {
  }
};
const linkTooltipAPI = $ctx(__spreadValues$2$1({}, defaultAPI), "linkTooltipAPICtx");
withMeta$2(linkTooltipState, {
  displayName: "API<link-tooltip>",
  group: "LinkTooltip"
});
const defaultConfig = {
  linkIcon: "🔗",
  editButton: "✎",
  removeButton: "⌫",
  confirmButton: "Confirm ⏎",
  onCopyLink: () => {
  },
  inputPlaceholder: "Paste link..."
};
const linkTooltipConfig = $ctx(
  __spreadValues$2$1({}, defaultConfig),
  "linkTooltipConfigCtx"
);
withMeta$2(linkTooltipState, {
  displayName: "Config<link-tooltip>",
  group: "LinkTooltip"
});
const toggleLinkCommand = $command("ToggleLink", (ctx) => {
  return () => (state) => {
    const { doc, selection } = state;
    const mark = linkSchema.type(ctx);
    const hasLink = doc.rangeHasMark(selection.from, selection.to, mark);
    if (hasLink) {
      ctx.get(linkTooltipAPI.key).removeLink(selection.from, selection.to);
      return true;
    }
    ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to);
    return true;
  };
});
const linkPreviewTooltip = tooltipFactory("LINK_PREVIEW");
withMeta$2(linkPreviewTooltip[0], {
  displayName: "PreviewTooltipSpec<link-tooltip>",
  group: "LinkTooltip"
});
withMeta$2(linkPreviewTooltip[1], {
  displayName: "PreviewTooltipPlugin<link-tooltip>",
  group: "LinkTooltip"
});
const linkEditTooltip = tooltipFactory("LINK_EDIT");
withMeta$2(linkEditTooltip[0], {
  displayName: "EditTooltipSpec<link-tooltip>",
  group: "LinkTooltip"
});
withMeta$2(linkEditTooltip[1], {
  displayName: "EditTooltipPlugin<link-tooltip>",
  group: "LinkTooltip"
});
function keepAlive$2(..._args) {
}
keepAlive$2(vueExports.h);
function Icon$2({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$2.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
keepAlive$2(vueExports.h);
const EditLink = vueExports.defineComponent({
  props: {
    config: {
      type: Object,
      required: true
    },
    src: {
      type: Object,
      required: true
    },
    onConfirm: {
      type: Function,
      required: true
    },
    onCancel: {
      type: Function,
      required: true
    }
  },
  setup({ config, src, onConfirm, onCancel }) {
    const link = vueExports.ref(src);
    vueExports.watch(src, (value) => {
      link.value = value;
    });
    const onConfirmEdit = () => {
      onConfirm(link.value);
    };
    const onKeydown = (e) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirmEdit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    return () => {
      return /* @__PURE__ */ vueExports.h("div", { class: "link-edit" }, /* @__PURE__ */ vueExports.h(
        "input",
        {
          class: "input-area",
          placeholder: config.value.inputPlaceholder,
          onKeydown,
          onInput: (e) => {
            link.value = e.target.value;
          },
          value: link.value
        }
      ), link.value ? /* @__PURE__ */ vueExports.h(
        Icon$2,
        {
          class: "button confirm",
          icon: config.value.confirmButton,
          onClick: onConfirmEdit
        }
      ) : null);
    };
  }
});
var __defProp$1$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1$1 = Object.prototype.propertyIsEnumerable;
var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$1$1 = (obj, key, value) => key in obj ? __defProp$1$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1$1.call(b, prop))
      __defNormalProp$1$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1$1)
    for (var prop of __getOwnPropSymbols$1$1(b)) {
      if (__propIsEnum$1$1.call(b, prop))
        __defNormalProp$1$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet$1 = (obj, member, value, setter) => (__accessCheck$1(obj, member, "write to private field"), member.set(obj, value), value);
var _content$1, _provider$1, _data, _app$1, _config$1, _src$1, _reset, _onOutsidePointerDown, _startOutsideClickListener, _stopOutsideClickListener, _confirmEdit, _enterEditMode;
const defaultData = {
  from: -1,
  to: -1,
  mark: null
};
class LinkEditTooltip {
  constructor(ctx, view) {
    this.ctx = ctx;
    __privateAdd$1(this, _content$1);
    __privateAdd$1(this, _provider$1);
    __privateAdd$1(this, _data, __spreadValues$1$1({}, defaultData));
    __privateAdd$1(this, _app$1);
    __privateAdd$1(this, _config$1);
    __privateAdd$1(this, _src$1, vueExports.ref(""));
    __privateAdd$1(this, _reset, () => {
      __privateGet$1(this, _stopOutsideClickListener).call(this);
      __privateGet$1(this, _provider$1).hide();
      this.ctx.update(linkTooltipState.key, (state) => __spreadProps$1(__spreadValues$1$1({}, state), {
        mode: "preview"
      }));
      __privateSet$1(this, _data, __spreadValues$1$1({}, defaultData));
    });
    __privateAdd$1(this, _onOutsidePointerDown, (e) => {
      const target = e.target;
      if (!target) return;
      if (__privateGet$1(this, _content$1).contains(target)) return;
      __privateGet$1(this, _reset).call(this);
    });
    __privateAdd$1(this, _startOutsideClickListener, () => {
      document.addEventListener("pointerdown", __privateGet$1(this, _onOutsidePointerDown), true);
    });
    __privateAdd$1(this, _stopOutsideClickListener, () => {
      document.removeEventListener(
        "pointerdown",
        __privateGet$1(this, _onOutsidePointerDown),
        true
      );
    });
    __privateAdd$1(this, _confirmEdit, (href) => {
      const view2 = this.ctx.get(editorViewCtx);
      const { from, to, mark } = __privateGet$1(this, _data);
      const type = linkSchema.type(this.ctx);
      const link = sanitizeLinkHref(href);
      if (mark && mark.attrs.href === link) {
        __privateGet$1(this, _reset).call(this);
        return;
      }
      const tr = view2.state.tr;
      if (mark) tr.removeMark(from, to, mark);
      if (from === to) {
        if (!link) {
          __privateGet$1(this, _reset).call(this);
          return;
        }
        const linkMark = type.create({ href: link });
        tr.insertText(link, from);
        tr.addMark(from, from + link.length, linkMark);
      } else {
        tr.addMark(from, to, type.create({ href: link }));
      }
      view2.dispatch(tr);
      __privateGet$1(this, _reset).call(this);
    });
    __privateAdd$1(this, _enterEditMode, (value, from, to) => {
      const config = this.ctx.get(linkTooltipConfig.key);
      __privateGet$1(this, _config$1).value = config;
      __privateGet$1(this, _src$1).value = value;
      this.ctx.update(linkTooltipState.key, (state) => __spreadProps$1(__spreadValues$1$1({}, state), {
        mode: "edit"
      }));
      const view2 = this.ctx.get(editorViewCtx);
      view2.dispatch(
        view2.state.tr.setSelection(TextSelection.create(view2.state.doc, from, to))
      );
      __privateGet$1(this, _provider$1).show(
        { getBoundingClientRect: () => posToDOMRect(view2, from, to) },
        view2
      );
      __privateGet$1(this, _startOutsideClickListener).call(this);
      requestAnimationFrame(() => {
        var _a;
        (_a = __privateGet$1(this, _content$1).querySelector("input")) == null ? void 0 : _a.focus();
      });
    });
    this.update = (view2) => {
      const { state } = view2;
      const { selection } = state;
      if (!(selection instanceof TextSelection)) return;
      const { from, to } = selection;
      if (from === __privateGet$1(this, _data).from && to === __privateGet$1(this, _data).to) return;
      __privateGet$1(this, _reset).call(this);
    };
    this.destroy = () => {
      __privateGet$1(this, _stopOutsideClickListener).call(this);
      __privateGet$1(this, _app$1).unmount();
      __privateGet$1(this, _provider$1).destroy();
      __privateGet$1(this, _content$1).remove();
    };
    this.addLink = (from, to) => {
      __privateSet$1(this, _data, {
        from,
        to,
        mark: null
      });
      __privateGet$1(this, _enterEditMode).call(this, "", from, to);
    };
    this.editLink = (mark, from, to) => {
      __privateSet$1(this, _data, {
        from,
        to,
        mark
      });
      __privateGet$1(this, _enterEditMode).call(this, mark.attrs.href, from, to);
    };
    this.removeLink = (from, to) => {
      const view2 = this.ctx.get(editorViewCtx);
      const tr = view2.state.tr;
      tr.removeMark(from, to, linkSchema.type(this.ctx));
      view2.dispatch(tr);
      __privateGet$1(this, _reset).call(this);
    };
    __privateSet$1(this, _config$1, vueExports.ref(this.ctx.get(linkTooltipConfig.key)));
    const content = document.createElement("div");
    content.className = "milkdown-link-edit";
    const app = vueExports.createApp(EditLink, {
      config: __privateGet$1(this, _config$1),
      src: __privateGet$1(this, _src$1),
      onConfirm: __privateGet$1(this, _confirmEdit),
      onCancel: __privateGet$1(this, _reset)
    });
    app.mount(content);
    __privateSet$1(this, _app$1, app);
    __privateSet$1(this, _content$1, content);
    __privateSet$1(this, _provider$1, new TooltipProvider({
      content,
      debounce: 0,
      shouldShow: () => false
    }));
    __privateGet$1(this, _provider$1).onHide = () => {
      requestAnimationFrame(() => {
        view.dom.focus({ preventScroll: true });
      });
    };
    __privateGet$1(this, _provider$1).update(view);
  }
}
_content$1 = /* @__PURE__ */ new WeakMap();
_provider$1 = /* @__PURE__ */ new WeakMap();
_data = /* @__PURE__ */ new WeakMap();
_app$1 = /* @__PURE__ */ new WeakMap();
_config$1 = /* @__PURE__ */ new WeakMap();
_src$1 = /* @__PURE__ */ new WeakMap();
_reset = /* @__PURE__ */ new WeakMap();
_onOutsidePointerDown = /* @__PURE__ */ new WeakMap();
_startOutsideClickListener = /* @__PURE__ */ new WeakMap();
_stopOutsideClickListener = /* @__PURE__ */ new WeakMap();
_confirmEdit = /* @__PURE__ */ new WeakMap();
_enterEditMode = /* @__PURE__ */ new WeakMap();
var __defProp$4 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$4(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function configureLinkEditTooltip(ctx) {
  let linkEditTooltipView;
  ctx.update(linkTooltipAPI.key, (api) => __spreadProps(__spreadValues$4({}, api), {
    addLink: (from, to) => {
      linkEditTooltipView == null ? void 0 : linkEditTooltipView.addLink(from, to);
    },
    editLink: (mark, from, to) => {
      linkEditTooltipView == null ? void 0 : linkEditTooltipView.editLink(mark, from, to);
    },
    removeLink: (from, to) => {
      linkEditTooltipView == null ? void 0 : linkEditTooltipView.removeLink(from, to);
    }
  }));
  ctx.set(linkEditTooltip.key, {
    view: (view) => {
      linkEditTooltipView = new LinkEditTooltip(ctx, view);
      return linkEditTooltipView;
    }
  });
}
function findMarkPosition(mark, node, doc, from, to) {
  let markPos = { start: -1, end: -1 };
  doc.nodesBetween(from, to, (n, pos) => {
    if (markPos.start > -1) return false;
    if (markPos.start === -1 && mark.isInSet(n.marks) && node === n) {
      markPos = {
        start: pos,
        end: pos + Math.max(n.textContent.length, 1)
      };
    }
    return void 0;
  });
  return markPos;
}
function shouldShowPreviewWhenHover(ctx, view, event) {
  const $pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
  if (!$pos) return;
  const { pos } = $pos;
  const node = view.state.doc.nodeAt(pos);
  if (!node) return;
  const mark = node.marks.find(
    (mark2) => mark2.type === linkSchema.mark.type(ctx)
  );
  if (!mark) return;
  const key = linkPreviewTooltip.pluginKey();
  if (!key) return;
  return { show: true, pos, node, mark };
}
keepAlive$2(vueExports.h);
const PreviewLink = vueExports.defineComponent({
  props: {
    config: {
      type: Object,
      required: true
    },
    src: {
      type: Object,
      required: true
    },
    onEdit: {
      type: Object,
      required: true
    },
    onRemove: {
      type: Object,
      required: true
    }
  },
  setup({ config, src, onEdit, onRemove }) {
    const safeHref = vueExports.computed(() => sanitizeLinkHref(src.value));
    const onClickEditButton = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit.value();
    };
    const onClickRemoveButton = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove.value();
    };
    const onClickPreview = (e) => {
      e.preventDefault();
      const link = src.value;
      if (navigator.clipboard && link) {
        navigator.clipboard.writeText(link).then(() => {
          config.value.onCopyLink(link);
        }).catch((e2) => console.error(e2));
      }
    };
    return () => {
      return /* @__PURE__ */ vueExports.h("div", { class: "link-preview" }, /* @__PURE__ */ vueExports.h(
        Icon$2,
        {
          class: "button link-icon",
          icon: config.value.linkIcon,
          onClick: onClickPreview
        }
      ), /* @__PURE__ */ vueExports.h(
        "a",
        {
          href: safeHref.value,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "link-display"
        },
        src.value
      ), /* @__PURE__ */ vueExports.h(
        Icon$2,
        {
          class: "button link-edit-button",
          icon: config.value.editButton,
          onClick: onClickEditButton
        }
      ), /* @__PURE__ */ vueExports.h(
        Icon$2,
        {
          class: "button link-remove-button",
          icon: config.value.removeButton,
          onClick: onClickRemoveButton
        }
      ));
    };
  }
});
var __typeError$2 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$2 = (obj, member, msg) => member.has(obj) || __typeError$2("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck$2(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$2 = (obj, member, value) => member.has(obj) ? __typeError$2("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck$2(obj, member, "write to private field"), member.set(obj, value), value);
var _content, _provider, _slice, _config, _src, _onEdit, _onRemove, _app, _editorView, _hovering, _onStateChange, _onMouseEnter, _onMouseLeave, _hide;
class LinkPreviewTooltip {
  constructor(ctx, view) {
    this.ctx = ctx;
    __privateAdd$2(this, _content);
    __privateAdd$2(this, _provider);
    __privateAdd$2(this, _slice);
    __privateAdd$2(this, _config);
    __privateAdd$2(this, _src, vueExports.ref(""));
    __privateAdd$2(this, _onEdit, vueExports.ref(() => {
    }));
    __privateAdd$2(this, _onRemove, vueExports.ref(() => {
    }));
    __privateAdd$2(this, _app);
    __privateAdd$2(this, _editorView);
    __privateAdd$2(this, _hovering, false);
    __privateAdd$2(this, _onStateChange, ({ mode }) => {
      if (mode === "edit") __privateGet(this, _hide).call(this);
    });
    __privateAdd$2(this, _onMouseEnter, () => {
      __privateSet(this, _hovering, true);
    });
    __privateAdd$2(this, _onMouseLeave, () => {
      __privateSet(this, _hovering, false);
    });
    __privateAdd$2(this, _hide, () => {
      __privateGet(this, _provider).hide();
      __privateGet(this, _provider).element.removeEventListener("mouseenter", __privateGet(this, _onMouseEnter));
      __privateGet(this, _provider).element.removeEventListener("mouseleave", __privateGet(this, _onMouseLeave));
    });
    this.show = (mark, from, to, rect) => {
      __privateGet(this, _config).value = this.ctx.get(linkTooltipConfig.key);
      __privateGet(this, _src).value = mark.attrs.href;
      __privateGet(this, _onEdit).value = () => {
        this.ctx.get(linkTooltipAPI.key).editLink(mark, from, to);
      };
      __privateGet(this, _onRemove).value = () => {
        this.ctx.get(linkTooltipAPI.key).removeLink(from, to);
        __privateGet(this, _hide).call(this);
      };
      __privateGet(this, _provider).show({ getBoundingClientRect: () => rect }, __privateGet(this, _editorView));
      __privateGet(this, _provider).element.addEventListener("mouseenter", __privateGet(this, _onMouseEnter));
      __privateGet(this, _provider).element.addEventListener("mouseleave", __privateGet(this, _onMouseLeave));
    };
    this.hide = () => {
      if (__privateGet(this, _hovering)) return;
      __privateGet(this, _hide).call(this);
    };
    this.update = () => {
    };
    this.destroy = () => {
      __privateGet(this, _app).unmount();
      __privateGet(this, _slice).off(__privateGet(this, _onStateChange));
      __privateGet(this, _provider).destroy();
      __privateGet(this, _content).remove();
    };
    __privateSet(this, _editorView, view);
    __privateSet(this, _config, vueExports.ref(this.ctx.get(linkTooltipConfig.key)));
    __privateSet(this, _app, vueExports.createApp(PreviewLink, {
      config: __privateGet(this, _config),
      src: __privateGet(this, _src),
      onEdit: __privateGet(this, _onEdit),
      onRemove: __privateGet(this, _onRemove)
    }));
    __privateSet(this, _content, document.createElement("div"));
    __privateGet(this, _content).className = "milkdown-link-preview";
    __privateGet(this, _app).mount(__privateGet(this, _content));
    __privateSet(this, _provider, new TooltipProvider({
      debounce: 0,
      content: __privateGet(this, _content),
      shouldShow: () => false
    }));
    __privateGet(this, _provider).update(view);
    __privateSet(this, _slice, ctx.use(linkTooltipState.key));
    __privateGet(this, _slice).on(__privateGet(this, _onStateChange));
  }
}
_content = /* @__PURE__ */ new WeakMap();
_provider = /* @__PURE__ */ new WeakMap();
_slice = /* @__PURE__ */ new WeakMap();
_config = /* @__PURE__ */ new WeakMap();
_src = /* @__PURE__ */ new WeakMap();
_onEdit = /* @__PURE__ */ new WeakMap();
_onRemove = /* @__PURE__ */ new WeakMap();
_app = /* @__PURE__ */ new WeakMap();
_editorView = /* @__PURE__ */ new WeakMap();
_hovering = /* @__PURE__ */ new WeakMap();
_onStateChange = /* @__PURE__ */ new WeakMap();
_onMouseEnter = /* @__PURE__ */ new WeakMap();
_onMouseLeave = /* @__PURE__ */ new WeakMap();
_hide = /* @__PURE__ */ new WeakMap();
function configureLinkPreviewTooltip(ctx) {
  let linkPreviewTooltipView;
  const DELAY = 50;
  const onMouseMove = debounce((view, event) => {
    if (!linkPreviewTooltipView) return;
    if (!view.hasFocus()) return;
    const state = ctx.get(linkTooltipState.key);
    if (state.mode === "edit") return;
    const result = shouldShowPreviewWhenHover(ctx, view, event);
    if (result) {
      const position = view.state.doc.resolve(result.pos);
      const markPosition = findMarkPosition(
        result.mark,
        result.node,
        view.state.doc,
        position.before(),
        position.after()
      );
      const from = markPosition.start;
      const to = markPosition.end;
      linkPreviewTooltipView.show(
        result.mark,
        from,
        to,
        posToDOMRect(view, from, to)
      );
      return;
    }
    linkPreviewTooltipView.hide();
  }, DELAY);
  const onMouseLeave = () => {
    setTimeout(() => {
      linkPreviewTooltipView == null ? void 0 : linkPreviewTooltipView.hide();
    }, DELAY);
  };
  ctx.set(linkPreviewTooltip.key, {
    props: {
      handleDOMEvents: {
        mousemove: onMouseMove,
        mouseleave: onMouseLeave
      }
    },
    view: (view) => {
      linkPreviewTooltipView = new LinkPreviewTooltip(ctx, view);
      return linkPreviewTooltipView;
    }
  });
}
function configureLinkTooltip(ctx) {
  configureLinkPreviewTooltip(ctx);
  configureLinkEditTooltip(ctx);
}
const linkTooltipPlugin = [
  linkTooltipState,
  linkTooltipAPI,
  linkTooltipConfig,
  linkPreviewTooltip,
  linkEditTooltip,
  toggleLinkCommand
].flat();
var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
function withMeta$1(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$2({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
const defaultListItemBlockConfig = {
  renderLabel: ({ label, listType, checked }) => {
    const content = checked == null ? listType === "bullet" ? "⦿" : label : checked ? "☑" : "□";
    return content;
  }
};
const listItemBlockConfig = $ctx(
  defaultListItemBlockConfig,
  "listItemBlockConfigCtx"
);
withMeta$1(listItemBlockConfig, {
  displayName: "Config<list-item-block>",
  group: "ListItemBlock"
});
function keepAlive$1(..._args) {
}
keepAlive$1(vueExports.h);
function Icon$1({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon$1.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
keepAlive$1(vueExports.h);
const ListItem = vueExports.defineComponent({
  props: {
    label: {
      type: Object,
      required: true
    },
    checked: {
      type: Object,
      required: true
    },
    listType: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    readonly: {
      type: Object,
      required: true
    },
    selected: {
      type: Object,
      required: true
    },
    setAttr: {
      type: Function,
      required: true
    },
    onMount: {
      type: Function,
      required: true
    }
  },
  setup({
    label,
    checked,
    listType,
    config,
    readonly,
    setAttr,
    onMount,
    selected
  }) {
    const contentWrapperRef = (div) => {
      if (div == null) return;
      if (div instanceof Element) {
        onMount(div);
      }
    };
    const onClickLabel = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (checked.value == null) return;
      setAttr("checked", !checked.value);
    };
    const icon = vueExports.computed(() => {
      return config.renderLabel({
        label: label.value,
        listType: listType.value,
        checked: checked.value,
        readonly: readonly.value
      });
    });
    const labelClass = vueExports.computed(() => {
      if (checked.value == null) {
        if (listType.value === "bullet") return "bullet";
        return "ordered";
      }
      if (checked.value) return "checked";
      return "unchecked";
    });
    return () => {
      return /* @__PURE__ */ vueExports.h(
        "li",
        {
          class: clsx(
            "list-item",
            selected.value && "ProseMirror-selectednode"
          )
        },
        /* @__PURE__ */ vueExports.h(
          "div",
          {
            class: "label-wrapper",
            onPointerdown: onClickLabel,
            contenteditable: false
          },
          /* @__PURE__ */ vueExports.h(
            Icon$1,
            {
              class: clsx(
                "label",
                readonly.value && "readonly",
                labelClass.value
              ),
              icon: icon.value
            }
          )
        ),
        /* @__PURE__ */ vueExports.h("div", { class: "children", ref: contentWrapperRef })
      );
    };
  }
});
const listItemBlockView = $view(
  listItemSchema.node,
  (ctx) => {
    return (initialNode, view, getPos) => {
      const dom = document.createElement("div");
      dom.className = "milkdown-list-item-block";
      const contentDOM = document.createElement("div");
      contentDOM.setAttribute("data-content-dom", "true");
      contentDOM.classList.add("content-dom");
      const label = vueExports.ref(initialNode.attrs.label);
      const checked = vueExports.ref(initialNode.attrs.checked);
      const listType = vueExports.ref(initialNode.attrs.listType);
      const readonly = vueExports.ref(!view.editable);
      const config = ctx.get(listItemBlockConfig.key);
      const selected = vueExports.ref(false);
      const setAttr = (attr, value) => {
        if (!view.editable) return;
        const pos = getPos();
        if (pos == null) return;
        if (!view.hasFocus()) view.focus();
        view.dispatch(view.state.tr.setNodeAttribute(pos, attr, value));
      };
      const disposeSelectedWatcher = vueExports.watchEffect(() => {
        const isSelected = selected.value;
        if (isSelected) {
          dom.classList.add("selected");
        } else {
          dom.classList.remove("selected");
        }
      });
      let raf = 0;
      const onMount = (div) => {
        const { anchor, head } = view.state.selection;
        div.appendChild(contentDOM);
        const anchorPos = view.state.doc.resolve(anchor);
        const headPos = view.state.doc.resolve(head);
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (view.isDestroyed) return;
          if (!anchorPos.doc.eq(view.state.doc)) return;
          const selection = new TextSelection(anchorPos, headPos);
          view.dispatch(view.state.tr.setSelection(selection));
        });
      };
      const app = vueExports.createApp(ListItem, {
        label,
        checked,
        listType,
        readonly,
        config,
        selected,
        setAttr,
        onMount
      });
      app.mount(dom);
      const bindAttrs = (node2) => {
        listType.value = node2.attrs.listType;
        label.value = node2.attrs.label;
        checked.value = node2.attrs.checked;
        readonly.value = !view.editable;
      };
      bindAttrs(initialNode);
      let node = initialNode;
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;
          if (updatedNode.sameMarkup(node) && updatedNode.content.eq(node.content))
            return true;
          node = updatedNode;
          bindAttrs(updatedNode);
          return true;
        },
        ignoreMutation: (mutation) => {
          if (!dom || !contentDOM) return true;
          if (mutation.type === "selection") return false;
          if (contentDOM === mutation.target && mutation.type === "attributes")
            return true;
          if (contentDOM.contains(mutation.target)) return false;
          return true;
        },
        selectNode: () => {
          selected.value = true;
        },
        deselectNode: () => {
          selected.value = false;
        },
        destroy: () => {
          cancelAnimationFrame(raf);
          disposeSelectedWatcher();
          app.unmount();
          dom.remove();
          contentDOM.remove();
        }
      };
    };
  }
);
withMeta$1(listItemBlockView, {
  displayName: "NodeView<list-item-block>",
  group: "ListItemBlock"
});
const listItemBlockComponent = [
  listItemBlockConfig,
  listItemBlockView
];
var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
function withMeta(plugin, meta) {
  Object.assign(plugin, {
    meta: __spreadValues$1({
      package: "@milkdown/components"
    }, meta)
  });
  return plugin;
}
var __defProp = Object.defineProperty;
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
const defaultTableBlockConfig = {
  renderButton: (renderType) => {
    switch (renderType) {
      case "add_row":
        return "+";
      case "add_col":
        return "+";
      case "delete_row":
        return "-";
      case "delete_col":
        return "-";
      case "align_col_left":
        return "left";
      case "align_col_center":
        return "center";
      case "align_col_right":
        return "right";
      case "col_drag_handle":
        return "=";
      case "row_drag_handle":
        return "=";
    }
  }
};
const tableBlockConfig = $ctx(
  __spreadValues({}, defaultTableBlockConfig),
  "tableBlockConfigCtx"
);
withMeta(tableBlockConfig, {
  displayName: "Config<table-block>",
  group: "TableBlock"
});
function keepAlive(..._args) {
}
keepAlive(vueExports.h);
function Icon({ icon, class: className, onClick }) {
  return /* @__PURE__ */ vueExports.h(
    "span",
    {
      class: clsx("milkdown-icon", className),
      onPointerdown: onClick,
      innerHTML: icon ? purify.sanitize(icon.trim()) : void 0
    }
  );
}
Icon.props = {
  icon: {
    type: String,
    required: false
  },
  class: {
    type: String,
    required: false
  },
  onClick: {
    type: Function,
    required: false
  }
};
function prepareDndContext(refs) {
  const {
    dragPreviewRef,
    tableWrapperRef,
    contentWrapperRef,
    yLineHandleRef,
    xLineHandleRef,
    colHandleRef,
    rowHandleRef
  } = refs;
  const preview = dragPreviewRef.value;
  if (!preview) return;
  const wrapper = tableWrapperRef.value;
  if (!wrapper) return;
  const content = contentWrapperRef.value;
  if (!content) return;
  const contentRoot = content.querySelector("tbody");
  if (!contentRoot) return;
  const previewRoot = preview.querySelector("tbody");
  if (!previewRoot) return;
  const yHandle = yLineHandleRef.value;
  if (!yHandle) return;
  const xHandle = xLineHandleRef.value;
  if (!xHandle) return;
  const colHandle = colHandleRef.value;
  if (!colHandle) return;
  const rowHandle = rowHandleRef.value;
  if (!rowHandle) return;
  const context = {
    preview,
    wrapper,
    content,
    contentRoot,
    previewRoot,
    yHandle,
    xHandle,
    colHandle,
    rowHandle
  };
  return context;
}
function clearPreview(previewRoot) {
  while (previewRoot.firstChild) previewRoot.removeChild(previewRoot.firstChild);
}
function renderPreview(axis, preview, previewRoot, tableContent, index) {
  const { width: tableWidth, height: tableHeight } = tableContent.querySelector("tbody").getBoundingClientRect();
  if (axis === "y") {
    const rows = tableContent.querySelectorAll("tr");
    const row = rows[index];
    if (!row) return;
    previewRoot.appendChild(row.cloneNode(true));
    const height = row.getBoundingClientRect().height;
    Object.assign(preview.style, {
      width: `${tableWidth}px`,
      height: `${height}px`
    });
    preview.dataset.show = "true";
    return;
  }
  if (axis === "x") {
    const rows = tableContent.querySelectorAll("tr");
    let width;
    Array.from(rows).forEach((row) => {
      const col = row.children[index];
      if (!col) return;
      if (width === void 0) width = col.getBoundingClientRect().width;
      const tr = col.parentElement.cloneNode(false);
      const clone = col.cloneNode(true);
      tr.appendChild(clone);
      previewRoot.appendChild(tr);
    });
    Object.assign(preview.style, {
      width: `${width}px`,
      height: `${tableHeight}px`
    });
    preview.dataset.show = "true";
    return;
  }
}
function createDragRowHandler(refs, ctx) {
  return (event) => {
    handleDrag(refs, event, ctx, (context) => {
      updateDragInfo("y", event, context, refs);
      const { preview, content, previewRoot } = context;
      clearPreview(previewRoot);
      const { hoverIndex } = refs;
      const [rowIndex] = hoverIndex.value;
      renderPreview("y", preview, previewRoot, content, rowIndex);
    });
  };
}
function createDragColHandler(refs, ctx) {
  return (event) => {
    handleDrag(refs, event, ctx, (context) => {
      updateDragInfo("x", event, context, refs);
      const { preview, content, previewRoot } = context;
      const { hoverIndex } = refs;
      const [_, colIndex] = hoverIndex.value;
      clearPreview(previewRoot);
      renderPreview("x", preview, previewRoot, content, colIndex);
    });
  };
}
function updateDragInfo(axis, event, context, refs) {
  const { xHandle, yHandle, colHandle, rowHandle, preview } = context;
  xHandle.dataset.displayType = axis === "y" ? "indicator" : "none";
  yHandle.dataset.displayType = axis === "x" ? "indicator" : "none";
  if (axis === "y") {
    colHandle.dataset.show = "false";
    hideButtonGroup(rowHandle);
  } else {
    rowHandle.dataset.show = "false";
    hideButtonGroup(colHandle);
  }
  const { hoverIndex, dragInfo } = refs;
  const [rowIndex, colIndex] = hoverIndex.value;
  dragInfo.value = {
    startCoords: [event.clientX, event.clientY],
    startIndex: axis === "y" ? rowIndex : colIndex,
    endIndex: axis === "y" ? rowIndex : colIndex,
    type: axis === "y" ? "row" : "col"
  };
  preview.dataset.direction = axis === "y" ? "vertical" : "horizontal";
}
function handleDrag(refs, event, ctx, fn) {
  const view = ctx == null ? void 0 : ctx.get(editorViewCtx);
  if (!(view == null ? void 0 : view.editable)) return;
  event.stopPropagation();
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  const context = prepareDndContext(refs);
  if (!context) return;
  requestAnimationFrame(() => {
    fn(context);
  });
}
function hideButtonGroup(handle) {
  var _a;
  (_a = handle.querySelector(".button-group")) == null ? void 0 : _a.setAttribute("data-show", "false");
}
function findNodeIndex(parent, child) {
  for (let i = 0; i < parent.childCount; i++) {
    if (parent.child(i) === child) return i;
  }
  return -1;
}
function findPointerIndex(event, view) {
  var _a, _b, _c;
  if (!view) return;
  try {
    const posAtCoords = view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    });
    if (!posAtCoords) return;
    const pos = posAtCoords == null ? void 0 : posAtCoords.inside;
    if (pos == null || pos < 0) return;
    const $pos = view.state.doc.resolve(pos);
    const node = view.state.doc.nodeAt(pos);
    if (!node) return;
    const cellType = ["table_cell", "table_header"];
    const rowType = ["table_row", "table_header_row"];
    const cell = cellType.includes(node.type.name) ? node : (_a = findParent((node2) => cellType.includes(node2.type.name))($pos)) == null ? void 0 : _a.node;
    const row = (_b = findParent((node2) => rowType.includes(node2.type.name))(
      $pos
    )) == null ? void 0 : _b.node;
    const table = (_c = findParent((node2) => node2.type.name === "table")($pos)) == null ? void 0 : _c.node;
    if (!cell || !row || !table) return;
    const columnIndex = findNodeIndex(row, cell);
    const rowIndex = findNodeIndex(table, row);
    return [rowIndex, columnIndex];
  } catch (e) {
    return void 0;
  }
}
function getRelatedDOM(contentWrapperRef, [rowIndex, columnIndex]) {
  const content = contentWrapperRef.value;
  if (!content) return;
  const rows = content.querySelectorAll("tr");
  const row = rows[rowIndex];
  if (!row) return;
  const firstRow = rows[0];
  if (!firstRow) return;
  const headerCol = firstRow.children[columnIndex];
  if (!headerCol) return;
  const col = row.children[columnIndex];
  if (!col) return;
  return {
    row,
    col,
    headerCol
  };
}
function recoveryStateBetweenUpdate(refs, view, node) {
  if (!node) return;
  if (!view) return;
  const { selection } = view.state;
  if (!(selection instanceof CellSelection)) return;
  const { $from } = selection;
  const table = findTable($from);
  if (!table || table.node !== node) return;
  if (selection.isColSelection()) {
    const { $head } = selection;
    const colIndex = $head.index($head.depth - 1);
    computeColHandlePositionByIndex({
      refs,
      index: [0, colIndex],
      before: (handleDOM) => {
        var _a;
        (_a = handleDOM.querySelector(".button-group")) == null ? void 0 : _a.setAttribute("data-show", "true");
      }
    });
    return;
  }
  if (selection.isRowSelection()) {
    const { $head } = selection;
    const rowNode = findParent(
      (node2) => node2.type.name === "table_row" || node2.type.name === "table_header_row"
    )($head);
    if (!rowNode) return;
    const rowIndex = findNodeIndex(table.node, rowNode.node);
    computeRowHandlePositionByIndex({
      refs,
      index: [rowIndex, 0],
      before: (handleDOM) => {
        var _a;
        if (rowIndex > 0)
          (_a = handleDOM.querySelector(".button-group")) == null ? void 0 : _a.setAttribute("data-show", "true");
      }
    });
  }
}
function computeColHandlePositionByIndex({
  refs,
  index,
  before,
  after
}) {
  const { contentWrapperRef, colHandleRef, hoverIndex } = refs;
  const colHandle = colHandleRef.value;
  if (!colHandle) return;
  hoverIndex.value = index;
  const dom = getRelatedDOM(contentWrapperRef, index);
  if (!dom) return;
  const { headerCol: col } = dom;
  colHandle.dataset.show = "true";
  if (before) before(colHandle);
  computePosition(col, colHandle, { placement: "top" }).then(({ x, y }) => {
    Object.assign(colHandle.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    if (after) after(colHandle);
  }).catch(console.error);
}
function computeRowHandlePositionByIndex({
  refs,
  index,
  before,
  after
}) {
  const { contentWrapperRef, rowHandleRef, hoverIndex } = refs;
  const rowHandle = rowHandleRef.value;
  if (!rowHandle) return;
  hoverIndex.value = index;
  const dom = getRelatedDOM(contentWrapperRef, index);
  if (!dom) return;
  const { row } = dom;
  rowHandle.dataset.show = "true";
  if (before) before(rowHandle);
  computePosition(row, rowHandle, { placement: "left" }).then(({ x, y }) => {
    Object.assign(rowHandle.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    if (after) after(rowHandle);
  }).catch(console.error);
}
function findDragOverElement(elements, pointer, axis) {
  const startProp = axis === "x" ? "left" : "top";
  const endProp = axis === "x" ? "right" : "bottom";
  const lastIndex = elements.length - 1;
  const index = elements.findIndex((el, index2) => {
    const rect = el.getBoundingClientRect();
    const boundaryStart = rect[startProp];
    const boundaryEnd = rect[endProp];
    if (boundaryStart <= pointer && pointer <= boundaryEnd) return true;
    if (index2 === lastIndex && pointer > boundaryEnd) return true;
    if (index2 === 0 && pointer < boundaryStart) return true;
    return false;
  });
  const element = elements[index];
  return element ? [element, index] : void 0;
}
function getDragOverColumn(table, pointerX) {
  const firstRow = table.querySelector("tr");
  if (!firstRow) return;
  const cells = Array.from(firstRow.children);
  return findDragOverElement(cells, pointerX, "x");
}
function getDragOverRow(table, pointerY) {
  const rows = Array.from(table.querySelectorAll("tr"));
  return findDragOverElement(rows, pointerY, "y");
}
function createDragOverHandler(refs) {
  return throttle((e) => {
    const context = prepareDndContext(refs);
    if (!context) return;
    const { preview, content, contentRoot, xHandle, yHandle } = context;
    const { dragInfo, hoverIndex } = refs;
    if (preview.dataset.show === "false") return;
    const dom = getRelatedDOM(refs.contentWrapperRef, hoverIndex.value);
    if (!dom) return;
    const firstRow = contentRoot.querySelector("tr");
    if (!firstRow) return;
    const info = dragInfo.value;
    if (!info) return;
    if (!contentRoot.offsetParent) return;
    const wrapperOffsetTop = contentRoot.offsetParent.offsetTop;
    const wrapperOffsetLeft = contentRoot.offsetParent.offsetLeft;
    if (info.type === "col") {
      const width = dom.col.getBoundingClientRect().width;
      const { left, width: fullWidth } = contentRoot.getBoundingClientRect();
      const leftGap = wrapperOffsetLeft - left;
      const previewLeft = e.clientX + leftGap - width / 2;
      const [startX] = info.startCoords;
      const direction = startX < e.clientX ? "right" : "left";
      preview.style.top = `${wrapperOffsetTop}px`;
      const previewLeftOffset = previewLeft < left + leftGap - 20 ? left + leftGap - 20 : previewLeft > left + fullWidth + leftGap - width + 20 ? left + fullWidth + leftGap - width + 20 : previewLeft;
      preview.style.left = `${previewLeftOffset}px`;
      const dragOverColumn = getDragOverColumn(contentRoot, e.clientX);
      if (dragOverColumn) {
        const [col, index] = dragOverColumn;
        const yHandleWidth = yHandle.getBoundingClientRect().width;
        const contentBoundary = content.getBoundingClientRect();
        info.endIndex = index;
        computePosition(col, yHandle, {
          placement: direction === "left" ? "left" : "right",
          middleware: [offset(direction === "left" ? -1 * yHandleWidth : 0)]
        }).then(({ x }) => {
          yHandle.dataset.show = "true";
          Object.assign(yHandle.style, {
            height: `${contentBoundary.height}px`,
            left: `${x}px`,
            top: `${wrapperOffsetTop}px`
          });
        }).catch(console.error);
      }
    } else if (info.type === "row") {
      const height = dom.row.getBoundingClientRect().height;
      const { top, height: fullHeight } = contentRoot.getBoundingClientRect();
      const topGap = wrapperOffsetTop - top;
      const previewTop = e.clientY + topGap - height / 2;
      const [_, startY] = info.startCoords;
      const direction = startY < e.clientY ? "down" : "up";
      const previewTopOffset = previewTop < top + topGap - 20 ? top + topGap - 20 : previewTop > top + fullHeight + topGap - height + 20 ? top + fullHeight + topGap - height + 20 : previewTop;
      preview.style.top = `${previewTopOffset}px`;
      preview.style.left = `${wrapperOffsetLeft}px`;
      const dragOverRow = getDragOverRow(contentRoot, e.clientY);
      if (dragOverRow) {
        const [row, index] = dragOverRow;
        const xHandleHeight = xHandle.getBoundingClientRect().height;
        const contentBoundary = content.getBoundingClientRect();
        info.endIndex = index;
        computePosition(row, xHandle, {
          placement: direction === "up" ? "top" : "bottom",
          middleware: [offset(direction === "up" ? -1 * xHandleHeight : 0)]
        }).then(({ y }) => {
          xHandle.dataset.show = "true";
          Object.assign(xHandle.style, {
            width: `${contentBoundary.width}px`,
            top: `${y}px`
          });
        }).catch(console.error);
      }
    }
  }, 20);
}
function useDragHandlers(refs, ctx, getPos) {
  const { dragPreviewRef, yLineHandleRef, xLineHandleRef, dragInfo } = refs;
  const dragRow = createDragRowHandler(refs, ctx);
  const dragCol = createDragColHandler(refs, ctx);
  const onDragEnd = () => {
    const preview = dragPreviewRef.value;
    if (!preview) return;
    if (preview.dataset.show === "false") return;
    const previewRoot = preview == null ? void 0 : preview.querySelector("tbody");
    while (previewRoot == null ? void 0 : previewRoot.firstChild)
      previewRoot == null ? void 0 : previewRoot.removeChild(previewRoot.firstChild);
    if (preview) preview.dataset.show = "false";
  };
  const onDrop = () => {
    var _a;
    const preview = dragPreviewRef.value;
    if (!preview) return;
    const yHandle = yLineHandleRef.value;
    if (!yHandle) return;
    const xHandle = xLineHandleRef.value;
    if (!xHandle) return;
    const info = dragInfo.value;
    if (!info) return;
    if (!ctx) return;
    if (preview.dataset.show === "false") return;
    const colHandle = refs.colHandleRef.value;
    if (!colHandle) return;
    const rowHandle = refs.rowHandleRef.value;
    if (!rowHandle) return;
    yHandle.dataset.show = "false";
    xHandle.dataset.show = "false";
    if (info.startIndex === info.endIndex) return;
    const commands = ctx.get(commandsCtx);
    const payload = {
      from: info.startIndex,
      to: info.endIndex,
      pos: ((_a = getPos == null ? void 0 : getPos()) != null ? _a : 0) + 1
    };
    if (info.type === "col") {
      commands.call(selectColCommand.key, {
        pos: payload.pos,
        index: info.startIndex
      });
      commands.call(moveColCommand.key, payload);
      const index = [0, info.endIndex];
      computeColHandlePositionByIndex({
        refs,
        index
      });
    } else {
      commands.call(selectRowCommand.key, {
        pos: payload.pos,
        index: info.startIndex
      });
      commands.call(moveRowCommand.key, payload);
      const index = [info.endIndex, 0];
      computeRowHandlePositionByIndex({
        refs,
        index
      });
    }
    requestAnimationFrame(() => {
      ctx.get(editorViewCtx).focus();
    });
  };
  const onDragOver = createDragOverHandler(refs);
  vueExports.onMounted(() => {
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragend", onDragEnd);
    window.addEventListener("drop", onDrop);
  });
  vueExports.onUnmounted(() => {
    window.removeEventListener("dragover", onDragOver);
    window.removeEventListener("dragend", onDragEnd);
    window.removeEventListener("drop", onDrop);
  });
  return {
    dragRow,
    dragCol
  };
}
function useOperation(refs, ctx, getPos) {
  const {
    xLineHandleRef,
    contentWrapperRef,
    colHandleRef,
    rowHandleRef,
    hoverIndex,
    lineHoverIndex
  } = refs;
  const onAddRow = () => {
    var _a, _b, _c;
    if (!ctx) return;
    const xHandle = xLineHandleRef.value;
    if (!xHandle) return;
    const [rowIndex] = lineHoverIndex.value;
    if (rowIndex < 0) return;
    if (!ctx.get(editorViewCtx).editable) return;
    const rows = Array.from(
      (_b = (_a = contentWrapperRef.value) == null ? void 0 : _a.querySelectorAll("tr")) != null ? _b : []
    );
    const commands = ctx.get(commandsCtx);
    const pos = ((_c = getPos == null ? void 0 : getPos()) != null ? _c : 0) + 1;
    if (rows.length === rowIndex) {
      commands.call(selectRowCommand.key, { pos, index: rowIndex - 1 });
      commands.call(addRowAfterCommand.key);
    } else {
      commands.call(selectRowCommand.key, { pos, index: rowIndex });
      commands.call(addRowBeforeCommand.key);
    }
    commands.call(selectRowCommand.key, { pos, index: rowIndex });
    xHandle.dataset.show = "false";
  };
  const onAddCol = () => {
    var _a, _b, _c, _d;
    if (!ctx) return;
    const xHandle = xLineHandleRef.value;
    if (!xHandle) return;
    const [_, colIndex] = lineHoverIndex.value;
    if (colIndex < 0) return;
    if (!ctx.get(editorViewCtx).editable) return;
    const cols = Array.from(
      (_c = (_b = (_a = contentWrapperRef.value) == null ? void 0 : _a.querySelector("tr")) == null ? void 0 : _b.children) != null ? _c : []
    );
    const commands = ctx.get(commandsCtx);
    const pos = ((_d = getPos == null ? void 0 : getPos()) != null ? _d : 0) + 1;
    if (cols.length === colIndex) {
      commands.call(selectColCommand.key, { pos, index: colIndex - 1 });
      commands.call(addColAfterCommand.key);
    } else {
      commands.call(selectColCommand.key, { pos, index: colIndex });
      commands.call(addColBeforeCommand.key);
    }
    commands.call(selectColCommand.key, { pos, index: colIndex });
  };
  const selectCol = () => {
    var _a, _b;
    if (!ctx) return;
    const [_, colIndex] = hoverIndex.value;
    const commands = ctx.get(commandsCtx);
    const pos = ((_a = getPos == null ? void 0 : getPos()) != null ? _a : 0) + 1;
    commands.call(selectColCommand.key, { pos, index: colIndex });
    const buttonGroup = (_b = colHandleRef.value) == null ? void 0 : _b.querySelector(".button-group");
    if (buttonGroup)
      buttonGroup.dataset.show = buttonGroup.dataset.show === "true" ? "false" : "true";
  };
  const selectRow = () => {
    var _a, _b;
    if (!ctx) return;
    const [rowIndex, _] = hoverIndex.value;
    const commands = ctx.get(commandsCtx);
    const pos = ((_a = getPos == null ? void 0 : getPos()) != null ? _a : 0) + 1;
    commands.call(selectRowCommand.key, { pos, index: rowIndex });
    const buttonGroup = (_b = rowHandleRef.value) == null ? void 0 : _b.querySelector(".button-group");
    if (buttonGroup && rowIndex > 0)
      buttonGroup.dataset.show = buttonGroup.dataset.show === "true" ? "false" : "true";
  };
  const deleteSelected = (e) => {
    if (!ctx) return;
    if (!ctx.get(editorViewCtx).editable) return;
    e.preventDefault();
    e.stopPropagation();
    const commands = ctx.get(commandsCtx);
    commands.call(deleteSelectedCellsCommand.key);
    requestAnimationFrame(() => {
      ctx.get(editorViewCtx).focus();
    });
  };
  const onAlign = (direction) => (e) => {
    if (!ctx) return;
    if (!ctx.get(editorViewCtx).editable) return;
    e.preventDefault();
    e.stopPropagation();
    const commands = ctx.get(commandsCtx);
    commands.call(setAlignCommand.key, direction);
    requestAnimationFrame(() => {
      ctx.get(editorViewCtx).focus();
    });
  };
  return {
    onAddRow,
    onAddCol,
    selectCol,
    selectRow,
    deleteSelected,
    onAlign
  };
}
function createPointerMoveHandler(refs, view) {
  return throttle((e) => {
    if (!(view == null ? void 0 : view.editable)) return;
    const {
      contentWrapperRef,
      yLineHandleRef,
      xLineHandleRef,
      colHandleRef,
      rowHandleRef,
      hoverIndex,
      lineHoverIndex
    } = refs;
    const yHandle = yLineHandleRef.value;
    if (!yHandle) return;
    const xHandle = xLineHandleRef.value;
    if (!xHandle) return;
    const content = contentWrapperRef.value;
    if (!content) return;
    const rowHandle = rowHandleRef.value;
    if (!rowHandle) return;
    const colHandle = colHandleRef.value;
    if (!colHandle) return;
    const index = findPointerIndex(e, view);
    if (!index) return;
    const dom = getRelatedDOM(contentWrapperRef, index);
    if (!dom) return;
    const [rowIndex, colIndex] = index;
    const boundary = dom.col.getBoundingClientRect();
    const closeToBoundaryLeft = Math.abs(e.clientX - boundary.left) < 8;
    const closeToBoundaryRight = Math.abs(boundary.right - e.clientX) < 8;
    const closeToBoundaryTop = Math.abs(e.clientY - boundary.top) < 8;
    const closeToBoundaryBottom = Math.abs(boundary.bottom - e.clientY) < 8;
    const closeToBoundary = closeToBoundaryLeft || closeToBoundaryRight || closeToBoundaryTop || closeToBoundaryBottom;
    const rowButtonGroup = rowHandle.querySelector(".button-group");
    const colButtonGroup = colHandle.querySelector(".button-group");
    if (rowButtonGroup) rowButtonGroup.dataset.show = "false";
    if (colButtonGroup) colButtonGroup.dataset.show = "false";
    if (closeToBoundary) {
      const contentBoundary = content.getBoundingClientRect();
      rowHandle.dataset.show = "false";
      colHandle.dataset.show = "false";
      xHandle.dataset.displayType = "tool";
      yHandle.dataset.displayType = "tool";
      const yHandleWidth = yHandle.getBoundingClientRect().width;
      const xHandleHeight = xHandle.getBoundingClientRect().height;
      if (closeToBoundaryLeft || closeToBoundaryRight) {
        lineHoverIndex.value[1] = closeToBoundaryLeft ? colIndex : colIndex + 1;
        computePosition(dom.col, yHandle, {
          placement: closeToBoundaryLeft ? "left" : "right",
          middleware: [offset(closeToBoundaryLeft ? -1 * yHandleWidth : 0)]
        }).then(({ x }) => {
          yHandle.dataset.show = "true";
          Object.assign(yHandle.style, {
            height: `${contentBoundary.height}px`,
            left: `${x}px`
          });
        }).catch(console.error);
      } else {
        yHandle.dataset.show = "false";
      }
      if (index[0] !== 0 && (closeToBoundaryTop || closeToBoundaryBottom)) {
        lineHoverIndex.value[0] = closeToBoundaryTop ? rowIndex : rowIndex + 1;
        computePosition(dom.row, xHandle, {
          placement: closeToBoundaryTop ? "top" : "bottom",
          middleware: [offset(closeToBoundaryTop ? -1 * xHandleHeight : 0)]
        }).then(({ y }) => {
          xHandle.dataset.show = "true";
          Object.assign(xHandle.style, {
            width: `${contentBoundary.width}px`,
            top: `${y}px`
          });
        }).catch(console.error);
      } else {
        xHandle.dataset.show = "false";
      }
      return;
    }
    lineHoverIndex.value = [-1, -1];
    yHandle.dataset.show = "false";
    xHandle.dataset.show = "false";
    rowHandle.dataset.show = "true";
    colHandle.dataset.show = "true";
    computeRowHandlePositionByIndex({
      refs,
      index
    });
    computeColHandlePositionByIndex({
      refs,
      index
    });
    hoverIndex.value = index;
  }, 20);
}
function createPointerLeaveHandler(refs) {
  return () => {
    const { rowHandleRef, colHandleRef, yLineHandleRef, xLineHandleRef } = refs;
    setTimeout(() => {
      const rowHandle = rowHandleRef.value;
      if (!rowHandle) return;
      const colHandle = colHandleRef.value;
      if (!colHandle) return;
      const yHandle = yLineHandleRef.value;
      if (!yHandle) return;
      const xHandle = xLineHandleRef.value;
      if (!xHandle) return;
      rowHandle.dataset.show = "false";
      colHandle.dataset.show = "false";
      yHandle.dataset.show = "false";
      xHandle.dataset.show = "false";
    }, 200);
  };
}
function usePointerHandlers(refs, view) {
  const pointerMove = createPointerMoveHandler(refs, view);
  const pointerLeave = createPointerLeaveHandler(refs);
  return {
    pointerMove,
    pointerLeave
  };
}
keepAlive(vueExports.h);
const TableBlock = vueExports.defineComponent({
  props: {
    view: {
      type: Object,
      required: true
    },
    ctx: {
      type: Object,
      required: true
    },
    getPos: {
      type: Function,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    onMount: {
      type: Function,
      required: true
    },
    node: {
      type: Object,
      required: true
    }
  },
  setup({ view, node, ctx, getPos, config, onMount }) {
    const contentWrapperRef = vueExports.ref();
    const contentWrapperFunctionRef = (div) => {
      if (div == null) return;
      if (div instanceof HTMLElement) {
        contentWrapperRef.value = div;
        onMount(div);
      } else {
        contentWrapperRef.value = void 0;
      }
    };
    const colHandleRef = vueExports.ref();
    const rowHandleRef = vueExports.ref();
    const xLineHandleRef = vueExports.ref();
    const yLineHandleRef = vueExports.ref();
    const tableWrapperRef = vueExports.ref();
    const dragPreviewRef = vueExports.ref();
    const hoverIndex = vueExports.ref([0, 0]);
    const lineHoverIndex = vueExports.ref([-1, -1]);
    const dragInfo = vueExports.ref();
    const refs = {
      dragPreviewRef,
      tableWrapperRef,
      contentWrapperRef,
      yLineHandleRef,
      xLineHandleRef,
      colHandleRef,
      rowHandleRef,
      hoverIndex,
      lineHoverIndex,
      dragInfo
    };
    const { pointerLeave, pointerMove } = usePointerHandlers(refs, view);
    const { dragRow, dragCol } = useDragHandlers(refs, ctx, getPos);
    const {
      onAddRow,
      onAddCol,
      selectCol,
      selectRow,
      deleteSelected,
      onAlign
    } = useOperation(refs, ctx, getPos);
    vueExports.onMounted(() => {
      requestAnimationFrame(() => {
        if (view.editable) recoveryStateBetweenUpdate(refs, view, node.value);
      });
    });
    return () => {
      return /* @__PURE__ */ vueExports.h(
        "div",
        {
          onDragstart: (e) => e.preventDefault(),
          onDragover: (e) => e.preventDefault(),
          onDragleave: (e) => e.preventDefault(),
          onPointermove: pointerMove,
          onPointerleave: pointerLeave
        },
        /* @__PURE__ */ vueExports.h(
          "div",
          {
            "data-show": "false",
            contenteditable: "false",
            draggable: "true",
            "data-role": "col-drag-handle",
            class: "handle cell-handle",
            onDragstart: dragCol,
            onClick: selectCol,
            onPointerdown: (e) => e.stopPropagation(),
            onPointermove: (e) => e.stopPropagation(),
            ref: colHandleRef
          },
          /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("col_drag_handle") }),
          /* @__PURE__ */ vueExports.h(
            "div",
            {
              "data-show": "false",
              class: "button-group",
              onPointermove: (e) => e.stopPropagation()
            },
            /* @__PURE__ */ vueExports.h("button", { type: "button", onPointerdown: onAlign("left") }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("align_col_left") })),
            /* @__PURE__ */ vueExports.h("button", { type: "button", onPointerdown: onAlign("center") }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("align_col_center") })),
            /* @__PURE__ */ vueExports.h("button", { type: "button", onPointerdown: onAlign("right") }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("align_col_right") })),
            /* @__PURE__ */ vueExports.h("button", { type: "button", onPointerdown: deleteSelected }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("delete_col") }))
          )
        ),
        /* @__PURE__ */ vueExports.h(
          "div",
          {
            "data-show": "false",
            contenteditable: "false",
            draggable: "true",
            "data-role": "row-drag-handle",
            class: "handle cell-handle",
            onDragstart: dragRow,
            onClick: selectRow,
            onPointerdown: (e) => e.stopPropagation(),
            onPointermove: (e) => e.stopPropagation(),
            ref: rowHandleRef
          },
          /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("row_drag_handle") }),
          /* @__PURE__ */ vueExports.h(
            "div",
            {
              "data-show": "false",
              class: "button-group",
              onPointermove: (e) => e.stopPropagation()
            },
            /* @__PURE__ */ vueExports.h("button", { type: "button", onPointerdown: deleteSelected }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("delete_row") }))
          )
        ),
        /* @__PURE__ */ vueExports.h("div", { class: "table-wrapper", ref: tableWrapperRef }, /* @__PURE__ */ vueExports.h(
          "div",
          {
            "data-show": "false",
            class: "drag-preview",
            "data-direction": "vertical",
            ref: dragPreviewRef
          },
          /* @__PURE__ */ vueExports.h("table", null, /* @__PURE__ */ vueExports.h("tbody", null))
        ), /* @__PURE__ */ vueExports.h(
          "div",
          {
            "data-show": "false",
            contenteditable: "false",
            "data-display-type": "tool",
            "data-role": "x-line-drag-handle",
            class: "handle line-handle",
            onPointermove: (e) => e.stopPropagation(),
            ref: xLineHandleRef
          },
          /* @__PURE__ */ vueExports.h("button", { type: "button", onClick: onAddRow, class: "add-button" }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("add_row") }))
        ), /* @__PURE__ */ vueExports.h(
          "div",
          {
            "data-show": "false",
            contenteditable: "false",
            "data-display-type": "tool",
            "data-role": "y-line-drag-handle",
            class: "handle line-handle",
            onPointermove: (e) => e.stopPropagation(),
            ref: yLineHandleRef
          },
          /* @__PURE__ */ vueExports.h("button", { type: "button", onClick: onAddCol, class: "add-button" }, /* @__PURE__ */ vueExports.h(Icon, { icon: config.renderButton("add_col") }))
        ), /* @__PURE__ */ vueExports.h("table", { ref: contentWrapperFunctionRef, class: "children" }))
      );
    };
  }
});
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _TableNodeView_instances, handleClick_fn;
class TableNodeView {
  constructor(ctx, node, view, getPos) {
    this.ctx = ctx;
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    __privateAdd(this, _TableNodeView_instances);
    const dom = document.createElement("div");
    dom.className = "milkdown-table-block";
    const contentDOM = document.createElement("tbody");
    this.contentDOM = contentDOM;
    contentDOM.setAttribute("data-content-dom", "true");
    contentDOM.classList.add("content-dom");
    this.nodeRef = vueExports.shallowRef(node);
    const app = vueExports.createApp(TableBlock, {
      view,
      ctx,
      getPos,
      config: ctx.get(tableBlockConfig.key),
      onMount: (div) => {
        div.appendChild(contentDOM);
      },
      node: this.nodeRef
    });
    app.mount(dom);
    this.app = app;
    this.dom = dom;
  }
  update(node) {
    if (node.type !== this.node.type) return false;
    if (node.sameMarkup(this.node) && node.content.eq(this.node.content))
      return false;
    this.node = node;
    this.nodeRef.value = node;
    return true;
  }
  stopEvent(e) {
    if (e.type === "drop" || e.type.startsWith("drag")) return true;
    if (e.type === "mousedown" || e.type === "pointerdown") {
      if (e.target instanceof Element && e.target.closest("button")) return true;
      const target = e.target;
      if (target instanceof HTMLElement && (target.closest("th") || target.closest("td"))) {
        const event = e;
        return __privateMethod(this, _TableNodeView_instances, handleClick_fn).call(this, event);
      }
    }
    return false;
  }
  ignoreMutation(mutation) {
    if (!this.dom || !this.contentDOM) return true;
    if (mutation.type === "selection") return false;
    if (this.contentDOM === mutation.target && mutation.type === "attributes")
      return true;
    if (this.contentDOM.contains(mutation.target)) return false;
    return true;
  }
  destroy() {
    this.app.unmount();
    this.dom.remove();
    this.contentDOM.remove();
  }
}
_TableNodeView_instances = /* @__PURE__ */ new WeakSet();
handleClick_fn = function(event) {
  const view = this.view;
  if (!view.editable) return false;
  const { state, dispatch } = view;
  const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
  if (!pos) return false;
  const $pos = state.doc.resolve(pos.inside);
  const node = findParent(
    (node2) => node2.type.name === "table_cell" || node2.type.name === "table_header"
  )($pos);
  if (!node) return false;
  if (state.selection instanceof TextSelection) {
    const currentNode = findParent(
      (node2) => node2.type.name === "table_cell" || node2.type.name === "table_header"
    )(state.selection.$from);
    if ((currentNode == null ? void 0 : currentNode.node) === node.node) return false;
  }
  const { from } = node;
  const selection = NodeSelection.create(state.doc, from + 1);
  if (state.selection.eq(selection)) return false;
  if (state.selection instanceof CellSelection) {
    setTimeout(() => {
      dispatch(state.tr.setSelection(selection).scrollIntoView());
    }, 20);
  } else {
    requestAnimationFrame(() => {
      dispatch(state.tr.setSelection(selection).scrollIntoView());
    });
  }
  return true;
};
const tableBlockView = $view(
  tableSchema.node,
  (ctx) => {
    return (initialNode, view, getPos) => {
      return new TableNodeView(ctx, initialNode, view, getPos);
    };
  }
);
withMeta(tableBlockView, {
  displayName: "NodeView<table-block>",
  group: "TableBlock"
});
const tableBlock = [tableBlockConfig, tableBlockView];
export {
  Icon$6 as I,
  diffComponent as a,
  tableBlock as b,
  codeBlockConfig as c,
  diffComponentConfig as d,
  inlineImageConfig as e,
  imageBlockComponent as f,
  imageInlineComponent as g,
  configureLinkTooltip as h,
  imageBlockConfig as i,
  linkTooltipPlugin as j,
  listItemBlockComponent as k,
  linkTooltipConfig as l,
  codeBlockComponent as m,
  listItemBlockConfig as n,
  toggleLinkCommand as o,
  imageBlockSchema as p,
  tableBlockConfig as t
};
