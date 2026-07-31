import { p as parser } from "./lezer__php.mjs";
import { p as parseMixed } from "./lezer__common.mjs";
import { html } from "./codemirror__lang-html.mjs";
import { a as LanguageSupport, l as LRLanguage, n as indentNodeProp, o as continuedIndent, r as delimitedIndent, p as foldNodeProp, t as foldInside } from "./codemirror__language.mjs";
import "./lezer__lr.mjs";
import "./lezer__highlight.mjs";
import "./lezer__html.mjs";
import "./codemirror__lang-css.mjs";
import "./lezer__css.mjs";
import "./codemirror__state.mjs";
import "./marijn__find-cluster-break.mjs";
import "./codemirror__view.mjs";
import "./style-mod.mjs";
import "./w3c-keyname.mjs";
import "./crelt.mjs";
import "./codemirror__lang-javascript.mjs";
import "./lezer__javascript.mjs";
import "./codemirror__autocomplete.mjs";
const phpLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "php",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        IfStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|else\b|elseif\b|endif\b)/ }),
        TryStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|catch\b|finally\b)/ }),
        SwitchBody: (context) => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
        },
        ColonBlock: (cx) => cx.baseIndent + cx.unit,
        "Block EnumBody DeclarationList": /* @__PURE__ */ delimitedIndent({ closing: "}" }),
        ArrowFunction: (cx) => cx.baseIndent + cx.unit,
        "String BlockComment": () => null,
        Statement: /* @__PURE__ */ continuedIndent({ except: /^({|end(for|foreach|switch|while)\b)/ })
      }),
      /* @__PURE__ */ foldNodeProp.add({
        "Block EnumBody DeclarationList SwitchBody ArrayExpression ValueList": foldInside,
        ColonBlock(tree) {
          return { from: tree.from + 1, to: tree.to };
        },
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" }, line: "//" },
    indentOnInput: /^\s*(?:case |default:|end(?:if|for(?:each)?|switch|while)|else(?:if)?|\{|\})$/,
    wordChars: "$",
    closeBrackets: { stringPrefixes: ["b", "B"] }
  }
});
function php(config = {}) {
  let support = [], base;
  if (config.baseLanguage === null) ;
  else if (config.baseLanguage) {
    base = config.baseLanguage;
  } else {
    let htmlSupport = html({ matchClosingTags: false });
    support.push(htmlSupport.support);
    base = htmlSupport.language;
  }
  return new LanguageSupport(phpLanguage.configure({
    wrap: base && parseMixed((node) => {
      if (!node.type.isTop)
        return null;
      return {
        parser: base.parser,
        overlay: (node2) => node2.name == "Text"
      };
    }),
    top: config.plain ? "Program" : "Template"
  }), support);
}
export {
  php,
  phpLanguage
};
