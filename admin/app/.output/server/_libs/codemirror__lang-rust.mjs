import { p as parser } from "./lezer__rust.mjs";
import { a as LanguageSupport, l as LRLanguage, n as indentNodeProp, o as continuedIndent, p as foldNodeProp, t as foldInside } from "./codemirror__language.mjs";
import "./lezer__lr.mjs";
import "./lezer__common.mjs";
import "./lezer__highlight.mjs";
import "./codemirror__state.mjs";
import "./marijn__find-cluster-break.mjs";
import "./codemirror__view.mjs";
import "./style-mod.mjs";
import "./w3c-keyname.mjs";
import "./crelt.mjs";
const rustLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "rust",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        IfExpression: /* @__PURE__ */ continuedIndent({ except: /^\s*({|else\b)/ }),
        "String BlockComment": () => null,
        "AttributeItem": (cx) => cx.continue(),
        "Statement MatchArm": /* @__PURE__ */ continuedIndent()
      }),
      /* @__PURE__ */ foldNodeProp.add((type) => {
        if (/(Block|edTokens|List)$/.test(type.name))
          return foldInside;
        if (type.name == "BlockComment")
          return (tree) => ({ from: tree.from + 2, to: tree.to - 2 });
        return void 0;
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:\{|\})$/,
    closeBrackets: { stringPrefixes: ["b", "r", "br"] }
  }
});
function rust() {
  return new LanguageSupport(rustLanguage);
}
export {
  rust,
  rustLanguage
};
