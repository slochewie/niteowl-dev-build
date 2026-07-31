import { j as lineNumbers, m as highlightActiveLineGutter, n as highlightSpecialChars, d as drawSelection, o as dropCursor, p as rectangularSelection, q as crosshairCursor, t as highlightActiveLine, k as keymap } from "./codemirror__view.mjs";
import { E as EditorState } from "./codemirror__state.mjs";
import { f as foldGutter, e as indentOnInput, s as syntaxHighlighting, h as defaultHighlightStyle, j as bracketMatching, k as foldKeymap } from "./codemirror__language.mjs";
import { h as history, d as defaultKeymap, a as historyKeymap } from "./codemirror__commands.mjs";
import { h as highlightSelectionMatches, s as searchKeymap } from "./codemirror__search.mjs";
import { c as closeBrackets, a as autocompletion, b as closeBracketsKeymap, d as completionKeymap } from "./codemirror__autocomplete.mjs";
import { l as lintKeymap } from "./codemirror__lint.mjs";
const basicSetup = /* @__PURE__ */ (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
])();
export {
  basicSetup as b
};
