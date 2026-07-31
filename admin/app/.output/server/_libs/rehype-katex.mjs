import { a as katex } from "./katex.mjs";
import { v as visitParents, S as SKIP } from "./unist-util-visit-parents.mjs";
import { t as toText } from "./hast-util-to-text.mjs";
import { f as fromHtmlIsomorphic } from "./hast-util-from-html-isomorphic.mjs";
import "./unist-util-is.mjs";
import "./hast-util-is-element.mjs";
import "./unist-util-find-after.mjs";
import "./hast-util-from-html.mjs";
import "./parse5.mjs";
import "./entities.mjs";
import "./vfile.mjs";
import "./vfile-message.mjs";
import "./unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "./hast-util-from-parse5.mjs";
import "./devlop.mjs";
import "./property-information.mjs";
import "./web-namespaces.mjs";
import "./hastscript.mjs";
import "./comma-separated-tokens.mjs";
import "./space-separated-tokens.mjs";
import "./hast-util-parse-selector.mjs";
import "./vfile-location.mjs";
import "./unist-util-remove-position.mjs";
import "./unist-util-visit.mjs";
const emptyOptions = {};
const emptyClasses = [];
function rehypeKatex(options) {
  const settings = options || emptyOptions;
  return function(tree, file) {
    visitParents(tree, "element", function(element, parents) {
      const classes = Array.isArray(element.properties.className) ? element.properties.className : emptyClasses;
      const languageMath = classes.includes("language-math");
      const mathDisplay = classes.includes("math-display");
      const mathInline = classes.includes("math-inline");
      let displayMode = mathDisplay;
      if (!languageMath && !mathDisplay && !mathInline) {
        return;
      }
      let parent = parents[parents.length - 1];
      let scope = element;
      if (element.tagName === "code" && languageMath && parent && parent.type === "element" && parent.tagName === "pre") {
        scope = parent;
        parent = parents[parents.length - 2];
        displayMode = true;
      }
      if (!parent) return;
      const value = toText(scope, { whitespace: "pre" });
      let result;
      try {
        result = katex.renderToString(value, {
          ...settings,
          displayMode,
          throwOnError: true
        });
      } catch (error) {
        const cause = (
          /** @type {Error} */
          error
        );
        const ruleId = cause.name.toLowerCase();
        file.message("Could not render math with KaTeX", {
          ancestors: [...parents, element],
          cause,
          place: element.position,
          ruleId,
          source: "rehype-katex"
        });
        try {
          result = katex.renderToString(value, {
            ...settings,
            displayMode,
            strict: "ignore",
            throwOnError: false
          });
        } catch {
          result = [
            {
              type: "element",
              tagName: "span",
              properties: {
                className: ["katex-error"],
                style: "color:" + (settings.errorColor || "#cc0000"),
                title: String(error)
              },
              children: [{ type: "text", value }]
            }
          ];
        }
      }
      if (typeof result === "string") {
        const root = fromHtmlIsomorphic(result, { fragment: true });
        result = /** @type {Array<ElementContent>} */
        root.children;
      }
      const index = parent.children.indexOf(scope);
      parent.children.splice(index, 1, ...result);
      return SKIP;
    });
  };
}
export {
  rehypeKatex as default
};
