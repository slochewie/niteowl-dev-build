import { p as parser } from "./lezer__json.mjs";
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
const jsonParseLinter = () => (view) => {
  try {
    JSON.parse(view.state.doc.toString());
  } catch (e) {
    if (!(e instanceof SyntaxError))
      throw e;
    const pos = getErrorPosition(e, view.state.doc);
    return [{
      from: pos,
      message: e.message,
      severity: "error",
      to: pos
    }];
  }
  return [];
};
function getErrorPosition(error, doc) {
  let m;
  if (m = error.message.match(/at position (\d+)/))
    return Math.min(+m[1], doc.length);
  if (m = error.message.match(/at line (\d+) column (\d+)/))
    return Math.min(doc.line(+m[1]).from + +m[2] - 1, doc.length);
  return 0;
}
const jsonLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "json",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        Object: /* @__PURE__ */ continuedIndent({ except: /^\s*\}/ }),
        Array: /* @__PURE__ */ continuedIndent({ except: /^\s*\]/ })
      }),
      /* @__PURE__ */ foldNodeProp.add({
        "Object Array": foldInside
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    indentOnInput: /^\s*[\}\]]$/
  }
});
function json() {
  return new LanguageSupport(jsonLanguage);
}
export {
  json,
  jsonLanguage,
  jsonParseLinter
};
