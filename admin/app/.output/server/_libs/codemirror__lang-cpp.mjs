import { p as parser } from "./lezer__cpp.mjs";
import { a as LanguageSupport, l as LRLanguage, n as indentNodeProp, q as flatIndent, o as continuedIndent, r as delimitedIndent, p as foldNodeProp, t as foldInside } from "./codemirror__language.mjs";
import "./lezer__lr.mjs";
import "./lezer__common.mjs";
import "./lezer__highlight.mjs";
import "./codemirror__state.mjs";
import "./marijn__find-cluster-break.mjs";
import "./codemirror__view.mjs";
import "./style-mod.mjs";
import "./w3c-keyname.mjs";
import "./crelt.mjs";
const cppLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "cpp",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        IfStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|catch)\b/ }),
        LabeledStatement: flatIndent,
        CaseStatement: (context) => context.baseIndent + context.unit,
        BlockComment: () => null,
        CompoundStatement: /* @__PURE__ */ delimitedIndent({ closing: "}" }),
        Statement: /* @__PURE__ */ continuedIndent({ except: /^{/ })
      }),
      /* @__PURE__ */ foldNodeProp.add({
        "DeclarationList CompoundStatement EnumeratorList FieldDeclarationList InitializerList": foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\})$/,
    closeBrackets: { stringPrefixes: ["L", "u", "U", "u8", "LR", "UR", "uR", "u8R", "R"] }
  }
});
function cpp() {
  return new LanguageSupport(cppLanguage);
}
export {
  cpp,
  cppLanguage
};
