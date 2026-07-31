var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _marks, _hasText, _maybeMerge, _matchTarget, _runNode, _closeNodeAndPush, _addNodeAndPush, _a, _b, _openMarks, _matchTarget2, _runProseNode, _runProseMark, _orderMarks, _closeEndedMarks, _runNode2, _maybeMergeChildren, _createMarkdownNode, _moveSpaces, _closeNodeAndPush2, _addNodeAndPush2, _openMark, _closeMark, _c;
import { p as parserMatchError, b as createNodeInParserFail, s as stackOverFlow, d as serializerMatchError } from "./milkdown__exception.mjs";
import { M as Mark } from "./prosemirror-model.mjs";
var StackElement = class {
};
var Stack = class {
  constructor() {
    this.elements = [];
    this.size = () => {
      return this.elements.length;
    };
    this.top = () => {
      return this.elements.at(-1);
    };
    this.push = (node) => {
      this.top()?.push(node);
    };
    this.open = (node) => {
      this.elements.push(node);
    };
    this.close = () => {
      const el = this.elements.pop();
      if (!el) throw stackOverFlow();
      return el;
    };
  }
};
var ParserStackElement = class ParserStackElement2 extends StackElement {
  constructor(type, content, attrs) {
    super();
    this.type = type;
    this.content = content;
    this.attrs = attrs;
  }
  push(node, ...rest) {
    this.content.push(node, ...rest);
  }
  pop() {
    return this.content.pop();
  }
  static create(type, content, attrs) {
    return new ParserStackElement2(type, content, attrs);
  }
};
var ParserState = (_a = class extends Stack {
  constructor(schema) {
    super();
    __privateAdd(this, _marks);
    __privateAdd(this, _hasText);
    __privateAdd(this, _maybeMerge);
    __privateAdd(this, _matchTarget);
    __privateAdd(this, _runNode);
    __privateAdd(this, _closeNodeAndPush);
    __privateAdd(this, _addNodeAndPush);
    __privateSet(this, _marks, Mark.none);
    __privateSet(this, _hasText, (node) => node.isText);
    __privateSet(this, _maybeMerge, (a, b) => {
      if (__privateGet(this, _hasText).call(this, a) && __privateGet(this, _hasText).call(this, b) && Mark.sameSet(a.marks, b.marks)) return this.schema.text(a.text + b.text, a.marks);
    });
    __privateSet(this, _matchTarget, (node) => {
      const result = Object.values({
        ...this.schema.nodes,
        ...this.schema.marks
      }).find((x) => {
        return x.spec.parseMarkdown.match(node);
      });
      if (!result) throw parserMatchError(node);
      return result;
    });
    __privateSet(this, _runNode, (node) => {
      const type = __privateGet(this, _matchTarget).call(this, node);
      type.spec.parseMarkdown.runner(this, node, type);
    });
    this.injectRoot = (node, nodeType, attrs) => {
      this.openNode(nodeType, attrs);
      this.next(node.children);
      return this;
    };
    this.openNode = (nodeType, attrs) => {
      this.open(ParserStackElement.create(nodeType, [], attrs));
      return this;
    };
    __privateSet(this, _closeNodeAndPush, () => {
      __privateSet(this, _marks, Mark.none);
      const element = this.close();
      return __privateGet(this, _addNodeAndPush).call(this, element.type, element.attrs, element.content);
    });
    this.closeNode = () => {
      try {
        __privateGet(this, _closeNodeAndPush).call(this);
      } catch (e) {
        console.error(e);
      }
      return this;
    };
    __privateSet(this, _addNodeAndPush, (nodeType, attrs, content) => {
      const node = nodeType.createAndFill(attrs, content, __privateGet(this, _marks));
      if (!node) throw createNodeInParserFail(nodeType, attrs, content);
      this.push(node);
      return node;
    });
    this.addNode = (nodeType, attrs, content) => {
      try {
        __privateGet(this, _addNodeAndPush).call(this, nodeType, attrs, content);
      } catch (e) {
        console.error(e);
      }
      return this;
    };
    this.openMark = (markType, attrs) => {
      const mark = markType.create(attrs);
      __privateSet(this, _marks, mark.addToSet(__privateGet(this, _marks)));
      return this;
    };
    this.closeMark = (markType) => {
      __privateSet(this, _marks, markType.removeFromSet(__privateGet(this, _marks)));
      return this;
    };
    this.addText = (text) => {
      try {
        const topElement = this.top();
        if (!topElement) throw stackOverFlow();
        const prevNode = topElement.pop();
        const currNode = this.schema.text(text, __privateGet(this, _marks));
        if (!prevNode) {
          topElement.push(currNode);
          return this;
        }
        const merged = __privateGet(this, _maybeMerge).call(this, prevNode, currNode);
        if (merged) {
          topElement.push(merged);
          return this;
        }
        topElement.push(prevNode, currNode);
        return this;
      } catch (e) {
        console.error(e);
        return this;
      }
    };
    this.build = () => {
      let doc;
      do
        doc = __privateGet(this, _closeNodeAndPush).call(this);
      while (this.size());
      return doc;
    };
    this.next = (nodes = []) => {
      [nodes].flat().forEach((node) => __privateGet(this, _runNode).call(this, node));
      return this;
    };
    this.toDoc = () => this.build();
    this.run = (remark, markdown) => {
      const tree = remark.runSync(remark.parse(markdown), markdown);
      this.next(tree);
      return this;
    };
    this.schema = schema;
  }
}, _marks = new WeakMap(), _hasText = new WeakMap(), _maybeMerge = new WeakMap(), _matchTarget = new WeakMap(), _runNode = new WeakMap(), _closeNodeAndPush = new WeakMap(), _addNodeAndPush = new WeakMap(), _a.create = (schema, remark) => {
  const state = new _a(schema);
  return (text) => {
    state.run(remark, text);
    return state.toDoc();
  };
}, _a);
var SerializerStackElement = (_b = class extends StackElement {
  constructor(type, children, value, props = {}) {
    super();
    this.type = type;
    this.children = children;
    this.value = value;
    this.props = props;
    this.push = (node, ...rest) => {
      if (!this.children) this.children = [];
      this.children.push(node, ...rest);
    };
    this.pop = () => this.children?.pop();
  }
}, _b.create = (type, children, value, props = {}) => new _b(type, children, value, props), _b);
var isFragment = (x) => Object.prototype.hasOwnProperty.call(x, "size");
var SerializerState = (_c = class extends Stack {
  constructor(schema) {
    super();
    __privateAdd(this, _openMarks);
    __privateAdd(this, _matchTarget2);
    __privateAdd(this, _runProseNode);
    __privateAdd(this, _runProseMark);
    __privateAdd(this, _orderMarks);
    __privateAdd(this, _closeEndedMarks);
    __privateAdd(this, _runNode2);
    __privateAdd(this, _maybeMergeChildren);
    __privateAdd(this, _createMarkdownNode);
    __privateAdd(this, _moveSpaces);
    __privateAdd(this, _closeNodeAndPush2);
    __privateAdd(this, _addNodeAndPush2);
    __privateAdd(this, _openMark);
    __privateAdd(this, _closeMark);
    __privateSet(this, _openMarks, []);
    __privateSet(this, _matchTarget2, (node) => {
      const result = Object.values({
        ...this.schema.nodes,
        ...this.schema.marks
      }).find((x) => {
        return x.spec.toMarkdown.match(node);
      });
      if (!result) throw serializerMatchError(node.type);
      return result;
    });
    __privateSet(this, _runProseNode, (node) => {
      return __privateGet(this, _matchTarget2).call(this, node).spec.toMarkdown.runner(this, node);
    });
    __privateSet(this, _runProseMark, (mark, node) => {
      return __privateGet(this, _matchTarget2).call(this, mark).spec.toMarkdown.runner(this, mark, node);
    });
    __privateSet(this, _orderMarks, (marks) => {
      const getPriority = (x) => x.type.spec.priority ?? 50;
      const rest = [...marks].sort((a, b) => getPriority(a) - getPriority(b));
      const continuing = [];
      __privateGet(this, _openMarks).forEach(({ mark }) => {
        const index = rest.findIndex((x) => x.eq(mark));
        if (index >= 0) continuing.push(...rest.splice(index, 1));
      });
      return continuing.concat(rest);
    });
    __privateSet(this, _closeEndedMarks, (next) => {
      const nextMarks = next?.marks;
      let keep = 0;
      while (keep < __privateGet(this, _openMarks).length) {
        const { mark, spanning } = __privateGet(this, _openMarks)[keep];
        if (spanning && nextMarks?.some((x) => x.eq(mark))) keep++;
        else break;
      }
      for (let i = __privateGet(this, _openMarks).length - 1; i >= keep; i--) __privateGet(this, _closeMark).call(this, __privateGet(this, _openMarks)[i].mark);
    });
    __privateSet(this, _runNode2, (node, next) => {
      if (__privateGet(this, _orderMarks).call(this, node.marks).every((mark) => !__privateGet(this, _runProseMark).call(this, mark, node))) __privateGet(this, _runProseNode).call(this, node);
      __privateGet(this, _closeEndedMarks).call(this, next);
    });
    __privateSet(this, _maybeMergeChildren, (node) => {
      const { children } = node;
      if (!children) return node;
      node.children = children.reduce((nextChildren, child, index) => {
        if (index === 0) return [child];
        const last = nextChildren.at(-1);
        if (last && last.isMark && child.isMark) {
          const { children: currChildren, ...currRest } = child;
          const { children: prevChildren, ...prevRest } = last;
          if (child.type === last.type && currChildren && prevChildren && JSON.stringify(currRest) === JSON.stringify(prevRest)) {
            const next = {
              ...prevRest,
              children: [...prevChildren, ...currChildren]
            };
            return nextChildren.slice(0, -1).concat(__privateGet(this, _maybeMergeChildren).call(this, next));
          }
        }
        return nextChildren.concat(child);
      }, []);
      return node;
    });
    __privateSet(this, _createMarkdownNode, (element) => {
      const node = {
        ...element.props,
        type: element.type
      };
      if (element.children) node.children = element.children;
      if (element.value) node.value = element.value;
      return node;
    });
    this.openNode = (type, value, props) => {
      this.open(SerializerStackElement.create(type, void 0, value, props));
      return this;
    };
    __privateSet(this, _moveSpaces, (element, onPush) => {
      let startSpaces = "";
      let endSpaces = "";
      const children = element.children;
      if (children) {
        const firstChild = children[0];
        const lastChild = children.at(-1);
        if (lastChild && lastChild.type === "text" && lastChild.value.endsWith(" ")) {
          const text = lastChild.value;
          const trimmed = text.trimEnd();
          endSpaces = text.slice(trimmed.length);
          lastChild.value = trimmed;
        }
        if (firstChild && firstChild.type === "text" && firstChild.value.startsWith(" ")) {
          const text = firstChild.value;
          const trimmed = text.trimStart();
          startSpaces = text.slice(0, text.length - trimmed.length);
          firstChild.value = trimmed;
        }
      }
      if (startSpaces.length) __privateGet(this, _addNodeAndPush2).call(this, "text", void 0, startSpaces);
      const result = onPush();
      if (endSpaces.length) __privateGet(this, _addNodeAndPush2).call(this, "text", void 0, endSpaces);
      return result;
    });
    __privateSet(this, _closeNodeAndPush2, (trim = false) => {
      const element = this.close();
      const onPush = () => __privateGet(this, _addNodeAndPush2).call(this, element.type, element.children, element.value, element.props);
      if (trim) return __privateGet(this, _moveSpaces).call(this, element, onPush);
      return onPush();
    });
    this.closeNode = () => {
      __privateGet(this, _closeNodeAndPush2).call(this);
      return this;
    };
    __privateSet(this, _addNodeAndPush2, (type, children, value, props) => {
      const element = SerializerStackElement.create(type, children, value, props);
      const node = __privateGet(this, _maybeMergeChildren).call(this, __privateGet(this, _createMarkdownNode).call(this, element));
      this.push(node);
      return node;
    });
    this.addNode = (type, children, value, props) => {
      __privateGet(this, _addNodeAndPush2).call(this, type, children, value, props);
      return this;
    };
    __privateSet(this, _openMark, (mark, type, value, props) => {
      if (__privateGet(this, _openMarks).some((x) => x.mark.eq(mark))) return this;
      __privateGet(this, _openMarks).push({
        mark,
        spanning: value == null
      });
      return this.openNode(type, value, {
        ...props,
        isMark: true
      });
    });
    __privateSet(this, _closeMark, (mark) => {
      let index = -1;
      for (let i = __privateGet(this, _openMarks).length - 1; i >= 0; i--) if (__privateGet(this, _openMarks)[i].mark.eq(mark)) {
        index = i;
        break;
      }
      if (index < 0) return;
      __privateGet(this, _openMarks).splice(index, 1);
      __privateGet(this, _closeNodeAndPush2).call(this, true);
    });
    this.withMark = (mark, type, value, props) => {
      __privateGet(this, _openMark).call(this, mark, type, value, props);
      return this;
    };
    this.closeMark = (mark) => {
      __privateGet(this, _closeMark).call(this, mark);
      return this;
    };
    this.build = () => {
      let doc = null;
      do
        doc = __privateGet(this, _closeNodeAndPush2).call(this);
      while (this.size());
      return doc;
    };
    this.next = (nodes) => {
      if (isFragment(nodes)) {
        nodes.forEach((node, _offset, index) => {
          __privateGet(this, _runNode2).call(this, node, nodes.maybeChild(index + 1) ?? void 0);
        });
        return this;
      }
      __privateGet(this, _runNode2).call(this, nodes);
      return this;
    };
    this.toString = (remark) => remark.stringify(this.build());
    this.run = (tree) => {
      __privateSet(this, _openMarks, []);
      this.next(tree);
      return this;
    };
    this.schema = schema;
  }
}, _openMarks = new WeakMap(), _matchTarget2 = new WeakMap(), _runProseNode = new WeakMap(), _runProseMark = new WeakMap(), _orderMarks = new WeakMap(), _closeEndedMarks = new WeakMap(), _runNode2 = new WeakMap(), _maybeMergeChildren = new WeakMap(), _createMarkdownNode = new WeakMap(), _moveSpaces = new WeakMap(), _closeNodeAndPush2 = new WeakMap(), _addNodeAndPush2 = new WeakMap(), _openMark = new WeakMap(), _closeMark = new WeakMap(), _c.create = (schema, remark) => {
  const state = new _c(schema);
  return (content) => {
    state.run(content);
    return state.toString(remark);
  };
}, _c);
export {
  ParserState as P,
  SerializerState as S
};
