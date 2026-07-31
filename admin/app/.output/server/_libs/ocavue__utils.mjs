function isElement(node) {
  return node.nodeType === 1;
}
function isHTMLElement(node) {
  return isElement(node) && node.namespaceURI === "http://www.w3.org/1999/xhtml";
}
export {
  isHTMLElement as i
};
