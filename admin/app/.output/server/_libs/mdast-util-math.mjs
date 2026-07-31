import { o as ok } from "./devlop.mjs";
import { l as longestStreak } from "./longest-streak.mjs";
function mathFromMarkdown() {
  return {
    enter: {
      mathFlow: enterMathFlow,
      mathFlowFenceMeta: enterMathFlowMeta,
      mathText: enterMathText
    },
    exit: {
      mathFlow: exitMathFlow,
      mathFlowFence: exitMathFlowFence,
      mathFlowFenceMeta: exitMathFlowMeta,
      mathFlowValue: exitMathData,
      mathText: exitMathText,
      mathTextData: exitMathData
    }
  };
  function enterMathFlow(token) {
    const code = {
      type: "element",
      tagName: "code",
      properties: { className: ["language-math", "math-display"] },
      children: []
    };
    this.enter(
      {
        type: "math",
        meta: null,
        value: "",
        data: { hName: "pre", hChildren: [code] }
      },
      token
    );
  }
  function enterMathFlowMeta() {
    this.buffer();
  }
  function exitMathFlowMeta() {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node.type === "math");
    node.meta = data;
  }
  function exitMathFlowFence() {
    if (this.data.mathFlowInside) return;
    this.buffer();
    this.data.mathFlowInside = true;
  }
  function exitMathFlow(token) {
    const data = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    const node = this.stack[this.stack.length - 1];
    ok(node.type === "math");
    this.exit(token);
    node.value = data;
    const code = (
      /** @type {HastElement} */
      node.data.hChildren[0]
    );
    ok(code.type === "element");
    ok(code.tagName === "code");
    code.children.push({ type: "text", value: data });
    this.data.mathFlowInside = void 0;
  }
  function enterMathText(token) {
    this.enter(
      {
        type: "inlineMath",
        value: "",
        data: {
          hName: "code",
          hProperties: { className: ["language-math", "math-inline"] },
          hChildren: []
        }
      },
      token
    );
    this.buffer();
  }
  function exitMathText(token) {
    const data = this.resume();
    const node = this.stack[this.stack.length - 1];
    ok(node.type === "inlineMath");
    this.exit(token);
    node.value = data;
    const children = (
      /** @type {Array<HastElementContent>} */
      // @ts-expect-error: we defined it in `enterMathFlow`.
      node.data.hChildren
    );
    children.push({ type: "text", value: data });
  }
  function exitMathData(token) {
    this.config.enter.data.call(this, token);
    this.config.exit.data.call(this, token);
  }
}
function mathToMarkdown(options) {
  let single = (options || {}).singleDollarTextMath;
  if (single === null || single === void 0) {
    single = true;
  }
  inlineMath.peek = inlineMathPeek;
  return {
    unsafe: [
      { character: "\r", inConstruct: "mathFlowMeta" },
      { character: "\n", inConstruct: "mathFlowMeta" },
      {
        character: "$",
        after: single ? void 0 : "\\$",
        inConstruct: "phrasing"
      },
      { character: "$", inConstruct: "mathFlowMeta" },
      { atBreak: true, character: "$", after: "\\$" }
    ],
    handlers: { math, inlineMath }
  };
  function math(node, _, state, info) {
    const raw = node.value || "";
    const tracker = state.createTracker(info);
    const sequence = "$".repeat(Math.max(longestStreak(raw, "$") + 1, 2));
    const exit = state.enter("mathFlow");
    let value = tracker.move(sequence);
    if (node.meta) {
      const subexit = state.enter("mathFlowMeta");
      value += tracker.move(
        state.safe(node.meta, {
          after: "\n",
          before: value,
          encode: ["$"],
          ...tracker.current()
        })
      );
      subexit();
    }
    value += tracker.move("\n");
    if (raw) {
      value += tracker.move(raw + "\n");
    }
    value += tracker.move(sequence);
    exit();
    return value;
  }
  function inlineMath(node, _, state) {
    let value = node.value || "";
    let size = 1;
    if (!single) size++;
    while (new RegExp("(^|[^$])" + "\\$".repeat(size) + "([^$]|$)").test(value)) {
      size++;
    }
    const sequence = "$".repeat(size);
    if (
      // Contains non-space.
      /[^ \r\n]/.test(value) && // Starts with space and ends with space.
      (/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value) || // Starts or ends with dollar.
      /^\$|\$$/.test(value))
    ) {
      value = " " + value + " ";
    }
    let index = -1;
    while (++index < state.unsafe.length) {
      const pattern = state.unsafe[index];
      if (!pattern.atBreak) continue;
      const expression = state.compilePattern(pattern);
      let match;
      while (match = expression.exec(value)) {
        let position = match.index;
        if (value.codePointAt(position) === 10 && value.codePointAt(position - 1) === 13) {
          position--;
        }
        value = value.slice(0, position) + " " + value.slice(match.index + 1);
      }
    }
    return sequence + value + sequence;
  }
  function inlineMathPeek() {
    return "$";
  }
}
export {
  mathToMarkdown as a,
  mathFromMarkdown as m
};
