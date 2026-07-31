import { p as parser } from "./lezer__go.mjs";
import { a as LanguageSupport, l as LRLanguage, n as indentNodeProp, q as flatIndent, o as continuedIndent, r as delimitedIndent, p as foldNodeProp, t as foldInside, b as syntaxTree } from "./codemirror__language.mjs";
import { i as ifNotIn, e as completeFromList, s as snippetCompletion } from "./codemirror__autocomplete.mjs";
import { d as NodeWeakMap, I as IterMode } from "./lezer__common.mjs";
import "./lezer__lr.mjs";
import "./lezer__highlight.mjs";
import "./codemirror__state.mjs";
import "./marijn__find-cluster-break.mjs";
import "./codemirror__view.mjs";
import "./style-mod.mjs";
import "./w3c-keyname.mjs";
import "./crelt.mjs";
const snippets = [
  /* @__PURE__ */ snippetCompletion("func ${name}(${params}) ${type} {\n	${}\n}", {
    label: "func",
    detail: "declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("func (${receiver}) ${name}(${params}) ${type} {\n	${}\n}", {
    label: "func",
    detail: "method declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("var ${name} = ${value}", {
    label: "var",
    detail: "declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("type ${name} ${type}", {
    label: "type",
    detail: "declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("const ${name} = ${value}", {
    label: "const",
    detail: "declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("type ${name} = ${type}", {
    label: "type",
    detail: "alias declaration",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("for ${init}; ${test}; ${update} {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("for ${i} := range ${value} {\n	${}\n}", {
    label: "for",
    detail: "range",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("select {\n	${}\n}", {
    label: "select",
    detail: "statement",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("case ${}:\n${}", {
    label: "case",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("switch ${} {\n	${}\n}", {
    label: "switch",
    detail: "statement",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("switch ${}.(${type}) {\n	${}\n}", {
    label: "switch",
    detail: "type statement",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("if ${} {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion("if ${} {\n	${}\n} else {\n	${}\n}", {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ snippetCompletion('import ${name} "${module}"\n${}', {
    label: "import",
    detail: "declaration",
    type: "keyword"
  })
];
const cache = /* @__PURE__ */ new NodeWeakMap();
const ScopeNodes = /* @__PURE__ */ new Set([
  "SourceFile",
  "Block",
  "FunctionDecl",
  "MethodDecl",
  "FunctionLiteral",
  "ForStatement",
  "SwitchStatement",
  "TypeSwitchStatement",
  "IfStatement"
]);
function defIDs(type, spec) {
  return (node, def) => {
    outer: for (let cur = node.node.firstChild, depth = 0, parent = null; ; ) {
      while (!cur) {
        if (!depth)
          break outer;
        depth--;
        cur = parent.nextSibling;
        parent = parent.parent;
      }
      if (spec && cur.name == spec || cur.name == "SpecList") {
        depth++;
        parent = cur;
        cur = cur.firstChild;
      } else {
        if (cur.name == "DefName")
          def(cur, type);
        cur = cur.nextSibling;
      }
    }
    return true;
  };
}
const gatherCompletions = {
  FunctionDecl: /* @__PURE__ */ defIDs("function"),
  VarDecl: /* @__PURE__ */ defIDs("var", "VarSpec"),
  ConstDecl: /* @__PURE__ */ defIDs("constant", "ConstSpec"),
  TypeDecl: /* @__PURE__ */ defIDs("type", "TypeSpec"),
  ImportDecl: /* @__PURE__ */ defIDs("constant", "ImportSpec"),
  Parameter: /* @__PURE__ */ defIDs("var"),
  __proto__: null
};
function getScope(doc, node) {
  let cached = cache.get(node);
  if (cached)
    return cached;
  let completions = [], top = true;
  function def(node2, type) {
    let name = doc.sliceString(node2.from, node2.to);
    completions.push({ label: name, type });
  }
  node.cursor(IterMode.IncludeAnonymous).iterate((node2) => {
    if (top) {
      top = false;
    } else if (node2.name) {
      let gather = gatherCompletions[node2.name];
      if (gather && gather(node2, def) || ScopeNodes.has(node2.name))
        return false;
    } else if (node2.to - node2.from > 8192) {
      for (let c of getScope(doc, node2.node))
        completions.push(c);
      return false;
    }
  });
  cache.set(node, completions);
  return completions;
}
const Identifier = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/;
const dontComplete = [
  "String",
  "LineComment",
  "BlockComment",
  "DefName",
  "LabelName",
  "FieldName",
  ".",
  "?."
];
const localCompletionSource = (context) => {
  let inner = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (dontComplete.indexOf(inner.name) > -1)
    return null;
  let isWord = inner.name == "VariableName" || inner.to - inner.from < 20 && Identifier.test(context.state.sliceDoc(inner.from, inner.to));
  if (!isWord && !context.explicit)
    return null;
  let options = [];
  for (let pos = inner; pos; pos = pos.parent) {
    if (ScopeNodes.has(pos.name))
      options = options.concat(getScope(context.state.doc, pos));
  }
  return {
    options,
    from: isWord ? inner.from : context.pos,
    validFor: Identifier
  };
};
const goLanguage = /* @__PURE__ */ LRLanguage.define({
  name: "go",
  parser: /* @__PURE__ */ parser.configure({
    props: [
      /* @__PURE__ */ indentNodeProp.add({
        IfStatement: /* @__PURE__ */ continuedIndent({ except: /^\s*({|else\b)/ }),
        LabeledStatement: flatIndent,
        "SwitchBlock SelectBlock": (context) => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
          return context.baseIndent + (closed || isCase ? 0 : context.unit);
        },
        Block: /* @__PURE__ */ delimitedIndent({ closing: "}" }),
        BlockComment: () => null,
        Statement: /* @__PURE__ */ continuedIndent({ except: /^{/ })
      }),
      /* @__PURE__ */ foldNodeProp.add({
        "Block SwitchBlock SelectBlock LiteralValue InterfaceType StructType SpecList": foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case\b|default\b|\})$/
  }
});
let kwCompletion = (name) => ({ label: name, type: "keyword" });
const keywords = /* @__PURE__ */ "interface struct chan map package go return break continue goto fallthrough else defer range true false nil".split(" ").map(kwCompletion);
function go() {
  let completions = snippets.concat(keywords);
  return new LanguageSupport(goLanguage, [
    goLanguage.data.of({
      autocomplete: ifNotIn(dontComplete, completeFromList(completions))
    }),
    goLanguage.data.of({
      autocomplete: localCompletionSource
    })
  ]);
}
export {
  go,
  goLanguage,
  localCompletionSource,
  snippets
};
