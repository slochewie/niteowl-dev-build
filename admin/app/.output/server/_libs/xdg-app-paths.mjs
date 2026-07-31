import require$$0 from "path";
import { r as requireLib$1 } from "./xdg-portable.mjs";
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  const path = require$$0;
  const xdg = requireLib$1();
  function normalizeOptions_(options, isolated) {
    if (!isObject(options)) {
      options = { isolated: options };
    }
    options = options || {};
    options.isolated = options.isolated === void 0 || options.isolated === null ? isolated : options.isolated;
    if (!isBoolean(options.isolated)) {
      throw new TypeError(
        `Expected boolean for "isolated" argument, got ${typeOf(options.isolated)}`
      );
    }
    return options;
  }
  function isBoolean(value) {
    return typeOf(value) === "boolean";
  }
  function isObject(value) {
    return typeOf(value) === "object";
  }
  function isString(value) {
    return typeOf(value) === "string";
  }
  function typeOf(value) {
    return typeof value;
  }
  class XDGAppPaths_ {
    constructor(options = null) {
      const XDGAppPaths = function(options2 = null) {
        return new XDGAppPaths_(options2).fn;
      };
      if (!isObject(options)) {
        options = { name: options };
      }
      options = options || {};
      options.isolated = options.isolated === void 0 || options.isolated === null ? true : options.isolated;
      const isolated_ = options.isolated;
      if (!isBoolean(isolated_)) {
        throw new TypeError(`Expected boolean for "isolated" argument, got ${typeOf(isolated_)}`);
      }
      options.suffix = options.suffix === void 0 || options.suffix === null ? "" : options.suffix;
      const suffix_ = options.suffix;
      if (!isString(suffix_)) {
        throw new TypeError(`Expected string for "suffix" argument, got ${typeOf(suffix_)}`);
      }
      options.name = options.name === void 0 || options.name === null ? "" : options.name;
      let name_ = options.name;
      if (!isString(name_)) {
        throw new TypeError(`Expected string for "name" argument, got ${typeOf(name_)}`);
      }
      if (!name_) {
        name_ = path.parse(require.main && require.main.filename || process.execPath).name;
      }
      name_ += suffix_ || "";
      XDGAppPaths.$name = () => name_;
      XDGAppPaths.$isolated = () => isolated_;
      XDGAppPaths.cache = (dirOptions = null) => {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return path.join(xdg.cache(), dirOptions.isolated ? name_ : "");
      };
      XDGAppPaths.config = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return path.join(xdg.config(), dirOptions.isolated ? name_ : "");
      };
      XDGAppPaths.data = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return path.join(xdg.data(), dirOptions.isolated ? name_ : "");
      };
      XDGAppPaths.runtime = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return xdg.runtime() ? path.join(xdg.runtime(), dirOptions.isolated ? name_ : "") : void 0;
      };
      XDGAppPaths.state = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return path.join(xdg.state(), dirOptions.isolated ? name_ : "");
      };
      XDGAppPaths.configDirs = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return xdg.configDirs().map((s) => path.join(s, dirOptions.isolated ? name_ : ""));
      };
      XDGAppPaths.dataDirs = function(dirOptions = null) {
        dirOptions = normalizeOptions_(dirOptions, isolated_);
        return xdg.dataDirs().map((s) => path.join(s, dirOptions.isolated ? name_ : ""));
      };
      this.fn = XDGAppPaths;
    }
  }
  lib = new XDGAppPaths_().fn;
  return lib;
}
export {
  requireLib as r
};
