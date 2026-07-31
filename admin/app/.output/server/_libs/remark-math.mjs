import { m as math } from "./micromark-extension-math.mjs";
import { m as mathFromMarkdown, a as mathToMarkdown } from "./mdast-util-math.mjs";
import "./micromark-factory-space.mjs";
import "./micromark-util-character.mjs";
import "./devlop.mjs";
import "./longest-streak.mjs";
const emptyOptions = {};
function remarkMath(options) {
  const self = (
    /** @type {Processor} */
    this
  );
  const settings = options || emptyOptions;
  const data = self.data();
  const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
  const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
  const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);
  micromarkExtensions.push(math(settings));
  fromMarkdownExtensions.push(mathFromMarkdown());
  toMarkdownExtensions.push(mathToMarkdown(settings));
}
export {
  remarkMath as default
};
