import { f as fromHtml } from "./hast-util-from-html.mjs";
import { r as removePosition } from "./unist-util-remove-position.mjs";
function fromHtmlIsomorphic(value, options) {
  const tree = fromHtml(value, options);
  removePosition(tree, { force: true });
  delete tree.data;
  return tree;
}
export {
  fromHtmlIsomorphic as f
};
