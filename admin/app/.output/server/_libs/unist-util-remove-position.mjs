import { v as visit } from "./unist-util-visit.mjs";
function removePosition(tree, options) {
  const config = options || {};
  const force = config.force || false;
  visit(tree, remove);
  function remove(node) {
    if (force) {
      delete node.position;
    } else {
      node.position = void 0;
    }
  }
}
export {
  removePosition as r
};
