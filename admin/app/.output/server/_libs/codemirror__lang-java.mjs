import { p as parser } from "./lezer__java.mjs";
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
const javaLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "java",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        IfStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|catch|finally)\b/ }),
        LabeledStatement: flatIndent,
        SwitchBlock: (context) => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
        },
        Block: /* @__PURE__ */ delimitedIndent({ closing: "}" }),
        BlockComment: () => null,
        Statement: /* @__PURE__ */ continuedIndent({ except: /^{/ })
      }),
      /* @__PURE__ */ foldNodeProp.add({
        ["Block SwitchBlock ClassBody ElementValueArrayInitializer ModuleBody EnumBody ConstructorBody InterfaceBody ArrayInitializer"]: foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\})$/
  }
});
function java() {
  return new LanguageSupport(javaLanguage);
}
export {
  java,
  javaLanguage
};
