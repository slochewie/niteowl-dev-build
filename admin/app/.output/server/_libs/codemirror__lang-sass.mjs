import { p as parser } from "./lezer__sass.mjs";
import { a as LanguageSupport, l as LRLanguage, p as foldNodeProp, t as foldInside, n as indentNodeProp, o as continuedIndent } from "./codemirror__language.mjs";
import { defineCSSCompletionSource } from "./codemirror__lang-css.mjs";
import "./lezer__lr.mjs";
import "./lezer__common.mjs";
import "./lezer__highlight.mjs";
import "./codemirror__state.mjs";
import "./marijn__find-cluster-break.mjs";
import "./codemirror__view.mjs";
import "./style-mod.mjs";
import "./w3c-keyname.mjs";
import "./crelt.mjs";
import "./lezer__css.mjs";
const sassLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "sass",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ foldNodeProp.add({
        Block: foldInside,
        Comment(node, state) {
          return { from: node.from + 2, to: state.sliceDoc(node.to - 2, node.to) == "*/" ? node.to - 2 : node.to };
        }
      }),
      /* @__PURE__ */ indentNodeProp.add({
        Declaration: /* @__PURE__ */ continuedIndent()
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" }, line: "//" },
    indentOnInput: /^\s*\}$/,
    wordChars: "$-"
  }
});
const indentedSassLanguage = /* @__PURE__ */ sassLanguage.configure({
  dialect: "indented",
  props: [
    /* @__PURE__ */ indentNodeProp.add({
      "Block RuleSet": (cx) => cx.baseIndent + cx.unit
    }),
    /* @__PURE__ */ foldNodeProp.add({
      Block: (node) => ({ from: node.from, to: node.to })
    })
  ]
});
const sassCompletionSource = /* @__PURE__ */ defineCSSCompletionSource((node) => node.name == "VariableName" || node.name == "SassVariableName");
function sass(config) {
  return new LanguageSupport((config === null || config === void 0 ? void 0 : config.indented) ? indentedSassLanguage : sassLanguage, sassLanguage.data.of({ autocomplete: sassCompletionSource }));
}
export {
  sass,
  sassCompletionSource,
  sassLanguage
};
