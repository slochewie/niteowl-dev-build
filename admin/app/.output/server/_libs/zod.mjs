var _a$1;
function $constructor(name, initializer2, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer2(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a2;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def);
    (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}
class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  return globalConfig;
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  return {
    get value() {
      {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
    }
  };
}
function nullish$1(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
const EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object2, key, getter) {
  let value = void 0;
  Object.defineProperty(object2, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object2, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
const propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
const primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
const NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
const BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks2 = currDef.checks;
  const hasChecks = checks2 && checks2.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks2 = currDef.checks;
  const hasChecks = checks2 && checks2.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks2 = schema._zod.def.checks;
  const hasChecks = checks2 && checks2.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask) {
  const currDef = schema._zod.def;
  const checks2 = currDef.checks;
  const hasChecks = checks2 && checks2.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a2;
    (_a2 = iss).path ?? (_a2.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
const initializer$1 = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error2, path = []) => {
    for (const issue2 of error2.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}
const _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
const parse$3 = /* @__PURE__ */ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
const parseAsync$1 = /* @__PURE__ */ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
const _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
const cuid$1 = /^[cC][0-9a-z]{6,}$/;
const cuid2$1 = /^[0-9a-z]+$/;
const ulid$1 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid$1 = /^[0-9a-vA-V]{20}$/;
const ksuid$1 = /^[A-Za-z0-9]{27}$/;
const nanoid$1 = /^[a-zA-Z0-9_-]{21}$/;
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
const extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const guid$1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
const uuid$1 = (version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const uuid4 = /* @__PURE__ */ uuid$1(4);
const uuid6 = /* @__PURE__ */ uuid$1(6);
const uuid7 = /* @__PURE__ */ uuid$1(7);
const email$1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
const idnEmail = unicodeEmail;
const browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji$1() {
  return new RegExp(_emoji$1, "u");
}
const ipv4$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const mac$1 = (delimiter) => {
  const escapedDelim = escapeRegex(delimiter ?? ":");
  return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
};
const cidrv4$1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64$1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url$1 = /^[A-Za-z0-9_-]*$/;
const hostname$1 = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
const domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const httpProtocol = /^https?$/;
const e164$1 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$3 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time$1(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
  const time2 = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time2}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
const bigint$1 = /^-?\d+n?$/;
const integer = /^-?\d+$/;
const number$2 = /^-?\d+(?:\.\d+)?$/;
const boolean$2 = /^(?:true|false)$/i;
const _null$2 = /^null$/i;
const _undefined$2 = /^undefined$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
const hex$1 = /^[0-9a-fA-F]*$/;
function fixedBase64(bodyLength, padding) {
  return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
function fixedBase64url(length) {
  return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
const md5_hex = /^[0-9a-fA-F]{32}$/;
const md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
const md5_base64url = /* @__PURE__ */ fixedBase64url(22);
const sha1_hex = /^[0-9a-fA-F]{40}$/;
const sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
const sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
const sha256_hex = /^[0-9a-fA-F]{64}$/;
const sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
const sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
const sha384_hex = /^[0-9a-fA-F]{96}$/;
const sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
const sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
const sha512_hex = /^[0-9a-fA-F]{128}$/;
const sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
const sha512_base64url = /* @__PURE__ */ fixedBase64url(86);
const regexes$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  base64: base64$1,
  base64url: base64url$1,
  bigint: bigint$1,
  boolean: boolean$2,
  browserEmail,
  cidrv4: cidrv4$1,
  cidrv6: cidrv6$1,
  cuid: cuid$1,
  cuid2: cuid2$1,
  date: date$3,
  datetime: datetime$1,
  domain,
  duration: duration$1,
  e164: e164$1,
  email: email$1,
  emoji: emoji$1,
  extendedDuration,
  guid: guid$1,
  hex: hex$1,
  hostname: hostname$1,
  html5Email,
  httpProtocol,
  idnEmail,
  integer,
  ipv4: ipv4$1,
  ipv6: ipv6$1,
  ksuid: ksuid$1,
  lowercase,
  mac: mac$1,
  md5_base64,
  md5_base64url,
  md5_hex,
  nanoid: nanoid$1,
  null: _null$2,
  number: number$2,
  rfc5322Email,
  sha1_base64,
  sha1_base64url,
  sha1_hex,
  sha256_base64,
  sha256_base64url,
  sha256_hex,
  sha384_base64,
  sha384_base64url,
  sha384_hex,
  sha512_base64,
  sha512_base64url,
  sha512_hex,
  string: string$1,
  time: time$1,
  ulid: ulid$1,
  undefined: _undefined$2,
  unicodeEmail,
  uppercase,
  uuid: uuid$1,
  uuid4,
  uuid6,
  uuid7,
  xid: xid$1
});
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a2;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a2 = inst._zod).onattach ?? (_a2.onattach = []);
});
const numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
const $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    var _a2;
    (_a2 = inst2._zod.bag).multipleOf ?? (_a2.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (input < minimum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "bigint",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size <= def.maximum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size >= def.minimum)
      return;
    payload.issues.push({
      origin: getSizableOrigin(input),
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.size !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.size;
    bag.maximum = def.size;
    bag.size = def.size;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const size = input.size;
    if (size === def.size)
      return;
    const tooBig = size > def.size;
    payload.issues.push({
      origin: getSizableOrigin(input),
      ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a2;
  $ZodCheck.init(inst, def);
  (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
    const val = payload.value;
    return !nullish$1(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a2, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a2 = inst._zod).check ?? (_a2.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function handleCheckPropertyResult(result, payload, property) {
  if (result.issues.length) {
    payload.issues.push(...prefixIssues(property, result.issues));
  }
}
const $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    const result = def.schema._zod.run({
      value: payload.value[def.property],
      issues: []
    }, {});
    if (result instanceof Promise) {
      return result.then((result2) => handleCheckPropertyResult(result2, payload, def.property));
    }
    handleCheckPropertyResult(result, payload, def.property);
    return;
  };
});
const $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
  $ZodCheck.init(inst, def);
  const mimeSet = new Set(def.mime);
  inst._zod.onattach.push((inst2) => {
    inst2._zod.bag.mime = def.mime;
  });
  inst._zod.check = (payload) => {
    if (mimeSet.has(payload.value.type))
      return;
    payload.issues.push({
      code: "invalid_value",
      values: def.mime,
      input: payload.value.type,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join("\n"));
  }
}
const version = {
  major: 4,
  minor: 4,
  patch: 3
};
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a2;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks2 = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks2.unshift(inst);
  }
  for (const ch of checks2) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks2.length === 0) {
    (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks3, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks3) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks2, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks2, ctx));
      }
      return runChecks(result, checks2, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse$1(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid$1(v));
  } else
    def.pattern ?? (def.pattern = uuid$1());
  $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url2 = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url2.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url2.protocol.endsWith(":") ? url2.protocol.slice(0, -1) : url2.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url2.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji$1());
  $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime$1(def));
  $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date$3);
  $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time$1(def));
  $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4$1);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6$1);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
const $ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def) => {
  def.pattern ?? (def.pattern = mac$1(def.delimiter));
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `mac`;
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4$1);
  $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6$1);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error();
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error();
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64$1);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url$1.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url$1);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164$1);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (def.fn(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: def.format,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
const $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number$2;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
const $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean$2;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = bigint$1;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = BigInt(payload.value);
      } catch (_) {
      }
    if (typeof payload.value === "bigint")
      return payload;
    payload.issues.push({
      expected: "bigint",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
const $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def) => {
  $ZodCheckBigIntFormat.init(inst, def);
  $ZodBigInt.init(inst, def);
});
const $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "symbol")
      return payload;
    payload.issues.push({
      expected: "symbol",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _undefined$2;
  inst._zod.values = /* @__PURE__ */ new Set([void 0]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null$2;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
const $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
const $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (typeof input === "undefined")
      return payload;
    payload.issues.push({
      expected: "void",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce) {
      try {
        payload.value = new Date(payload.value);
      } catch (_err) {
      }
    }
    const input = payload.value;
    const isDate = input instanceof Date;
    const isValidDate = isDate && !Number.isNaN(input.getTime());
    if (isValidDate)
      return payload;
    payload.issues.push({
      expected: "date",
      code: "invalid_type",
      input,
      ...isDate ? { received: "Invalid Date" } : {},
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject$1 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject$1(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
const $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc2 = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc2.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc2.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id2 = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc2.write(`const ${id2} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc2.write(`
        if (${id2}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id2}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id2}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id2}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc2.write(`
        const ${id2}_present = ${k} in input;
        if (${id2}.issues.length) {
          payload.issues = payload.issues.concat(${id2}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id2}_present && !${id2}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id2}_present) {
          if (${id2}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id2}.value;
          }
        }

      `);
      } else {
        doc2.write(`
        if (${id2}.issues.length) {
          payload.issues = payload.issues.concat(${id2}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id2}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id2}.value;
        }
        
      `);
      }
    }
    doc2.write(`payload.value = newResult;`);
    doc2.write(`return payload;`);
    const fn = doc2.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject$1 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval$1 = allowsEval;
  const fastEnabled = jit && allowsEval$1.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject$1(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
function handleExclusiveUnionResults(results, final, inst, ctx) {
  const successes = results.filter((r) => r.issues.length === 0);
  if (successes.length === 1) {
    final.value = successes[0].value;
    return final;
  }
  if (successes.length === 0) {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    });
  } else {
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: [],
      inclusive: false
    });
  }
  return final;
}
const $ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def) => {
  $ZodUnion.init(inst, def);
  def.inclusive = false;
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        results.push(result);
      }
    }
    if (!async)
      return handleExclusiveUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleExclusiveUnionResults(results2, payload, inst, ctx);
    });
  };
});
const $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazy(inst._zod, "propValues", () => {
    const propValues = {};
    for (const option of def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
      for (const [k, v] of Object.entries(pv)) {
        if (!propValues[k])
          propValues[k] = /* @__PURE__ */ new Set();
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    return propValues;
  });
  const disc = cached(() => {
    const opts = def.options;
    const map2 = /* @__PURE__ */ new Map();
    for (const o of opts) {
      const values = o._zod.propValues?.[def.discriminator];
      if (!values || values.size === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
      for (const v of values) {
        if (map2.has(v)) {
          throw new Error(`Duplicate discriminator value "${String(v)}"`);
        }
        map2.set(v, o);
      }
    }
    return map2;
  });
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const opt = disc.value.get(input?.[def.discriminator]);
    if (opt) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
const $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
  $ZodType.init(inst, def);
  const items = def.items;
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        input,
        inst,
        expected: "tuple",
        code: "invalid_type"
      });
      return payload;
    }
    payload.value = [];
    const proms = [];
    const optinStart = getTupleOptStart(items, "optin");
    const optoutStart = getTupleOptStart(items, "optout");
    if (!def.rest) {
      if (input.length < optinStart) {
        payload.issues.push({
          code: "too_small",
          minimum: optinStart,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
        return payload;
      }
      if (input.length > items.length) {
        payload.issues.push({
          code: "too_big",
          maximum: items.length,
          inclusive: true,
          input,
          inst,
          origin: "array"
        });
      }
    }
    const itemResults = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((rr) => {
          itemResults[i] = rr;
        }));
      } else {
        itemResults[i] = r;
      }
    }
    if (def.rest) {
      let i = items.length - 1;
      const rest = input.slice(items.length);
      for (const el of rest) {
        i++;
        const result = def.rest._zod.run({ value: el, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((r) => handleTupleResult(r, payload, i)));
        } else {
          handleTupleResult(result, payload, i);
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
    }
    return handleTupleResults(itemResults, payload, items, input, optoutStart);
  };
});
function getTupleOptStart(items, key) {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i]._zod[key] !== "optional")
      return i + 1;
  }
  return 0;
}
function handleTupleResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
function handleTupleResults(itemResults, final, items, input, optoutStart) {
  for (let i = 0; i < items.length; i++) {
    const r = itemResults[i];
    const isPresent = i < input.length;
    if (r.issues.length) {
      if (!isPresent && i >= optoutStart) {
        final.value.length = i;
        break;
      }
      final.issues.push(...prefixIssues(i, r.issues));
    }
    final.value[i] = r.value;
  }
  for (let i = final.value.length - 1; i >= input.length; i--) {
    if (items[i]._zod.optout === "optional" && final.value[i] === void 0) {
      final.value.length = i;
    } else {
      break;
    }
  }
  return final;
}
const $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number$2.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[keyResult.value] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
const $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Map)) {
      payload.issues.push({
        expected: "map",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    payload.value = /* @__PURE__ */ new Map();
    for (const [key, value] of input) {
      const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
      const valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
      if (keyResult instanceof Promise || valueResult instanceof Promise) {
        proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
          handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
        }));
      } else {
        handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
      }
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
  if (keyResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, keyResult.issues));
    } else {
      final.issues.push({
        code: "invalid_key",
        origin: "map",
        input,
        inst,
        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  if (valueResult.issues.length) {
    if (propertyKeyTypes.has(typeof key)) {
      final.issues.push(...prefixIssues(key, valueResult.issues));
    } else {
      final.issues.push({
        origin: "map",
        code: "invalid_element",
        input,
        inst,
        key,
        issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
    }
  }
  final.value.set(keyResult.value, valueResult.value);
}
const $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!(input instanceof Set)) {
      payload.issues.push({
        input,
        inst,
        expected: "set",
        code: "invalid_type"
      });
      return payload;
    }
    const proms = [];
    payload.value = /* @__PURE__ */ new Set();
    for (const item of input) {
      const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleSetResult(result2, payload)));
      } else
        handleSetResult(result, payload);
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handleSetResult(result, final) {
  if (result.issues.length) {
    final.issues.push(...result.issues);
  }
  final.value.add(result.value);
}
const $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
const $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
const $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input instanceof File)
      return payload;
    payload.issues.push({
      expected: "file",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === void 0) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
const $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError("ZodSuccess");
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.issues.length === 0;
        return payload;
      });
    }
    payload.value = result.issues.length === 0;
    return payload;
  };
});
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
const $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "nan",
        code: "invalid_type"
      });
      return payload;
    }
    return payload;
  };
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
const $ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
      const left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left2) => handleCodecAResult(left2, def, ctx));
      }
      return handleCodecAResult(left, def, ctx);
    } else {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handleCodecAResult(right2, def, ctx));
      }
      return handleCodecAResult(right, def, ctx);
    }
  };
});
function handleCodecAResult(result, def, ctx) {
  if (result.issues.length) {
    result.aborted = true;
    return result;
  }
  const direction = ctx.direction || "forward";
  if (direction === "forward") {
    const transformed = def.transform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
    }
    return handleCodecTxResult(result, transformed, def.out, ctx);
  } else {
    const transformed = def.reverseTransform(result.value, result);
    if (transformed instanceof Promise) {
      return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
    }
    return handleCodecTxResult(result, transformed, def.in, ctx);
  }
}
function handleCodecTxResult(left, value, nextSchema, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return nextSchema._zod.run({ value, issues: left.issues }, ctx);
}
const $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
  $ZodPipe.init(inst, def);
});
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
const $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const regexParts = [];
  for (const part of def.parts) {
    if (typeof part === "object" && part !== null) {
      if (!part._zod.pattern) {
        throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
      }
      const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
      if (!source)
        throw new Error(`Invalid template literal part: ${part._zod.traits}`);
      const start = source.startsWith("^") ? 1 : 0;
      const end = source.endsWith("$") ? source.length - 1 : source.length;
      regexParts.push(source.slice(start, end));
    } else if (part === null || primitiveTypes.has(typeof part)) {
      regexParts.push(escapeRegex(`${part}`));
    } else {
      throw new Error(`Invalid template literal part: ${part}`);
    }
  }
  inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "string") {
      payload.issues.push({
        input: payload.value,
        inst,
        expected: "string",
        code: "invalid_type"
      });
      return payload;
    }
    inst._zod.pattern.lastIndex = 0;
    if (!inst._zod.pattern.test(payload.value)) {
      payload.issues.push({
        input: payload.value,
        inst,
        code: "invalid_format",
        format: def.format ?? "template_literal",
        pattern: inst._zod.pattern.source
      });
      return payload;
    }
    return payload;
  };
});
const $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
  $ZodType.init(inst, def);
  inst._def = def;
  inst._zod.def = def;
  inst.implement = (func) => {
    if (typeof func !== "function") {
      throw new Error("implement() must be called with a function");
    }
    return function(...args) {
      const parsedArgs = inst._def.input ? parse$3(inst._def.input, args) : args;
      const result = Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return parse$3(inst._def.output, result);
      }
      return result;
    };
  };
  inst.implementAsync = (func) => {
    if (typeof func !== "function") {
      throw new Error("implementAsync() must be called with a function");
    }
    return async function(...args) {
      const parsedArgs = inst._def.input ? await parseAsync$1(inst._def.input, args) : args;
      const result = await Reflect.apply(func, this, parsedArgs);
      if (inst._def.output) {
        return await parseAsync$1(inst._def.output, result);
      }
      return result;
    };
  };
  inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "function") {
      payload.issues.push({
        code: "invalid_type",
        expected: "function",
        input: payload.value,
        inst
      });
      return payload;
    }
    const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
    if (hasPromiseOutput) {
      payload.value = inst.implementAsync(payload.value);
    } else {
      payload.value = inst.implement(payload.value);
    }
    return payload;
  };
  inst.input = (...args) => {
    const F = inst.constructor;
    if (Array.isArray(args[0])) {
      return new F({
        type: "function",
        input: new $ZodTuple({
          type: "tuple",
          items: args[0],
          rest: args[1]
        }),
        output: inst._def.output
      });
    }
    return new F({
      type: "function",
      input: args[0],
      output: inst._def.output
    });
  };
  inst.output = (output) => {
    const F = inst.constructor;
    return new F({
      type: "function",
      input: inst._def.input,
      output
    });
  };
  return inst;
});
const $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
  };
});
const $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "innerType", () => {
    const d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  });
  defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
  defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
  defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? void 0);
  defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? void 0);
  inst._zod.parse = (payload, ctx) => {
    const inner = inst._zod.innerType;
    return inner._zod.run(payload, ctx);
  };
});
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
var _a;
class $ZodRegistry {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta2 = _meta[0];
    this._map.set(schema, meta2);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.set(meta2.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta2 = this._map.get(schema);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.delete(meta2.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _mac(Class, params) {
  return new Class({
    type: "string",
    format: "mac",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _coercedNumber(Class, params) {
  return new Class({
    type: "number",
    coerce: true,
    checks: [],
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _float32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float32",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _float64(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "float64",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _int32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "int32",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uint32(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "uint32",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _coercedBoolean(Class, params) {
  return new Class({
    type: "boolean",
    coerce: true,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _bigint(Class, params) {
  return new Class({
    type: "bigint",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _int64(Class, params) {
  return new Class({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "int64",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uint64(Class, params) {
  return new Class({
    type: "bigint",
    check: "bigint_format",
    abort: false,
    format: "uint64",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _symbol(Class, params) {
  return new Class({
    type: "symbol",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _undefined$1(Class, params) {
  return new Class({
    type: "undefined",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _null$1(Class, params) {
  return new Class({
    type: "null",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _any(Class) {
  return new Class({
    type: "any"
  });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _void$1(Class, params) {
  return new Class({
    type: "void",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _date(Class, params) {
  return new Class({
    type: "date",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _coercedDate(Class, params) {
  return new Class({
    type: "date",
    coerce: true,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nan(Class, params) {
  return new Class({
    type: "nan",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _positive(params) {
  return /* @__PURE__ */ _gt(0, params);
}
// @__NO_SIDE_EFFECTS__
function _negative(params) {
  return /* @__PURE__ */ _lt(0, params);
}
// @__NO_SIDE_EFFECTS__
function _nonpositive(params) {
  return /* @__PURE__ */ _lte(0, params);
}
// @__NO_SIDE_EFFECTS__
function _nonnegative(params) {
  return /* @__PURE__ */ _gte(0, params);
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
// @__NO_SIDE_EFFECTS__
function _maxSize(maximum, params) {
  return new $ZodCheckMaxSize({
    check: "max_size",
    ...normalizeParams(params),
    maximum
  });
}
// @__NO_SIDE_EFFECTS__
function _minSize(minimum, params) {
  return new $ZodCheckMinSize({
    check: "min_size",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _size(size, params) {
  return new $ZodCheckSizeEquals({
    check: "size_equals",
    ...normalizeParams(params),
    size
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _property(property, schema, params) {
  return new $ZodCheckProperty({
    check: "property",
    property,
    schema,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _mime(types, params) {
  return new $ZodCheckMimeType({
    check: "mime_type",
    mime: types,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _file(Class, params) {
  return new Class({
    type: "file",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue$1) => {
      if (typeof issue$1 === "string") {
        payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
      } else {
        const _issue = issue$1;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// @__NO_SIDE_EFFECTS__
function describe$1(description) {
  const ch = new $ZodCheck({ check: "describe" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, description });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
// @__NO_SIDE_EFFECTS__
function meta$1(metadata) {
  const ch = new $ZodCheck({ check: "meta" });
  ch._zod.onattach = [
    (inst) => {
      const existing = globalRegistry.get(inst) ?? {};
      globalRegistry.add(inst, { ...existing, ...metadata });
    }
  ];
  ch._zod.check = () => {
  };
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _stringbool(Classes, _params) {
  const params = normalizeParams(_params);
  let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
  let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (params.case !== "sensitive") {
    truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
    falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
  }
  const truthySet = new Set(truthyArray);
  const falsySet = new Set(falsyArray);
  const _Codec = Classes.Codec ?? $ZodCodec;
  const _Boolean = Classes.Boolean ?? $ZodBoolean;
  const _String = Classes.String ?? $ZodString;
  const stringSchema = new _String({ type: "string", error: params.error });
  const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
  const codec2 = new _Codec({
    type: "pipe",
    in: stringSchema,
    out: booleanSchema,
    transform: ((input, payload) => {
      let data = input;
      if (params.case !== "sensitive")
        data = data.toLowerCase();
      if (truthySet.has(data)) {
        return true;
      } else if (falsySet.has(data)) {
        return false;
      } else {
        payload.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...truthySet, ...falsySet],
          input: payload.value,
          inst: codec2,
          continue: false
        });
        return {};
      }
    }),
    reverseTransform: ((input, _payload) => {
      if (input === true) {
        return truthyArray[0] || "true";
      } else {
        return falsyArray[0] || "false";
      }
    }),
    error: params.error
  });
  return codec2;
}
// @__NO_SIDE_EFFECTS__
function _stringFormat(Class, format, fnOrRegex, _params = {}) {
  const params = normalizeParams(_params);
  const def = {
    ...normalizeParams(_params),
    check: "string_format",
    type: "string",
    format,
    fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
    ...params
  };
  if (fnOrRegex instanceof RegExp) {
    def.pattern = fnOrRegex;
  }
  const inst = new Class(def);
  return inst;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a2;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    Object.assign(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id2 = ctx.metadataRegistry.get(entry[0])?.id;
    if (id2) {
      const existing = idToSchema.get(id2);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id2}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id2, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id3) => id3);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id2 = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id2;
      return { defId: id2, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id2}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id2 = ctx.metadataRegistry.get(entry[0])?.id;
    if (id2) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") ;
  else ;
  if (ctx.external?.uri) {
    const id2 = ctx.external.registry.get(schema)?.id;
    if (!id2)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id2);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) ;
  else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
const formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
const stringProcessor = (schema, ctx, _json, _params) => {
  const json2 = _json;
  json2.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minLength = minimum;
  if (typeof maximum === "number")
    json2.maxLength = maximum;
  if (format) {
    json2.format = formatMap[format] ?? format;
    if (json2.format === "")
      delete json2.format;
    if (format === "time") {
      delete json2.format;
    }
  }
  if (contentEncoding)
    json2.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes2 = [...patterns];
    if (regexes2.length === 1)
      json2.pattern = regexes2[0].source;
    else if (regexes2.length > 1) {
      json2.allOf = [
        ...regexes2.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
const numberProcessor = (schema, ctx, _json, _params) => {
  const json2 = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json2.type = "integer";
  else
    json2.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json2.minimum = exclusiveMinimum;
      json2.exclusiveMinimum = true;
    } else {
      json2.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json2.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json2.maximum = exclusiveMaximum;
      json2.exclusiveMaximum = true;
    } else {
      json2.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json2.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json2.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
};
const bigintProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("BigInt cannot be represented in JSON Schema");
  }
};
const symbolProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Symbols cannot be represented in JSON Schema");
  }
};
const nullProcessor = (_schema, ctx, json2, _params) => {
  if (ctx.target === "openapi-3.0") {
    json2.type = "string";
    json2.nullable = true;
    json2.enum = [null];
  } else {
    json2.type = "null";
  }
};
const undefinedProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Undefined cannot be represented in JSON Schema");
  }
};
const voidProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Void cannot be represented in JSON Schema");
  }
};
const neverProcessor = (_schema, _ctx, json2, _params) => {
  json2.not = {};
};
const anyProcessor = (_schema, _ctx, _json, _params) => {
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {
};
const dateProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Date cannot be represented in JSON Schema");
  }
};
const enumProcessor = (schema, _ctx, json2, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json2.type = "number";
  if (values.every((v) => typeof v === "string"))
    json2.type = "string";
  json2.enum = values;
};
const literalProcessor = (schema, ctx, json2, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === void 0) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) ;
  else if (vals.length === 1) {
    const val = vals[0];
    json2.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json2.enum = [val];
    } else {
      json2.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json2.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json2.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json2.type = "boolean";
    if (vals.every((v) => v === null))
      json2.type = "null";
    json2.enum = vals;
  }
};
const nanProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("NaN cannot be represented in JSON Schema");
  }
};
const templateLiteralProcessor = (schema, _ctx, json2, _params) => {
  const _json = json2;
  const pattern = schema._zod.pattern;
  if (!pattern)
    throw new Error("Pattern not found in template literal");
  _json.type = "string";
  _json.pattern = pattern.source;
};
const fileProcessor = (schema, _ctx, json2, _params) => {
  const _json = json2;
  const file2 = {
    type: "string",
    format: "binary",
    contentEncoding: "binary"
  };
  const { minimum, maximum, mime } = schema._zod.bag;
  if (minimum !== void 0)
    file2.minLength = minimum;
  if (maximum !== void 0)
    file2.maxLength = maximum;
  if (mime) {
    if (mime.length === 1) {
      file2.contentMediaType = mime[0];
      Object.assign(_json, file2);
    } else {
      Object.assign(_json, file2);
      _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
    }
  } else {
    Object.assign(_json, file2);
  }
};
const successProcessor = (_schema, _ctx, json2, _params) => {
  json2.type = "boolean";
};
const customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
const functionProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Function types cannot be represented in JSON Schema");
  }
};
const transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
const mapProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Map cannot be represented in JSON Schema");
  }
};
const setProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Set cannot be represented in JSON Schema");
  }
};
const arrayProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
  json2.type = "array";
  json2.items = process(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
const objectProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "object";
  json2.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json2.properties[key] = process(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === void 0;
    } else {
      return v.optout === void 0;
    }
  }));
  if (requiredKeys.size > 0) {
    json2.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json2.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json2.additionalProperties = false;
  } else if (def.catchall) {
    json2.additionalProperties = process(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
const unionProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json2.oneOf = options;
  } else {
    json2.anyOf = options;
  }
};
const intersectionProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const a = process(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json2.allOf = allOf;
};
const tupleProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "array";
  const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
  const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
  const prefixItems = def.items.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, prefixPath, i]
  }));
  const rest = def.rest ? process(def.rest, ctx, {
    ...params,
    path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def.items.length] : []]
  }) : null;
  if (ctx.target === "draft-2020-12") {
    json2.prefixItems = prefixItems;
    if (rest) {
      json2.items = rest;
    }
  } else if (ctx.target === "openapi-3.0") {
    json2.items = {
      anyOf: prefixItems
    };
    if (rest) {
      json2.items.anyOf.push(rest);
    }
    json2.minItems = prefixItems.length;
    if (!rest) {
      json2.maxItems = prefixItems.length;
    }
  } else {
    json2.items = prefixItems;
    if (rest) {
      json2.additionalItems = rest;
    }
  }
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json2.minItems = minimum;
  if (typeof maximum === "number")
    json2.maxItems = maximum;
};
const recordProcessor = (schema, ctx, _json, params) => {
  const json2 = _json;
  const def = schema._zod.def;
  json2.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json2.patternProperties = {};
    for (const pattern of patterns) {
      json2.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json2.propertyNames = process(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json2.additionalProperties = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json2.required = validKeyValues;
    }
  }
};
const nullableProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  const inner = process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json2.nullable = true;
  } else {
    json2.anyOf = [inner, { type: "null" }];
  }
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json2.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json2._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json2.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json2, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json2.readOnly = true;
};
const promiseProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
const optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
const lazyProcessor = (schema, ctx, _json, params) => {
  const innerType = schema._zod.innerType;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
const allProcessors = {
  string: stringProcessor,
  number: numberProcessor,
  boolean: booleanProcessor,
  bigint: bigintProcessor,
  symbol: symbolProcessor,
  null: nullProcessor,
  undefined: undefinedProcessor,
  void: voidProcessor,
  never: neverProcessor,
  any: anyProcessor,
  unknown: unknownProcessor,
  date: dateProcessor,
  enum: enumProcessor,
  literal: literalProcessor,
  nan: nanProcessor,
  template_literal: templateLiteralProcessor,
  file: fileProcessor,
  success: successProcessor,
  custom: customProcessor,
  function: functionProcessor,
  transform: transformProcessor,
  map: mapProcessor,
  set: setProcessor,
  array: arrayProcessor,
  object: objectProcessor,
  union: unionProcessor,
  intersection: intersectionProcessor,
  tuple: tupleProcessor,
  record: recordProcessor,
  nullable: nullableProcessor,
  nonoptional: nonoptionalProcessor,
  default: defaultProcessor,
  prefault: prefaultProcessor,
  catch: catchProcessor,
  pipe: pipeProcessor,
  readonly: readonlyProcessor,
  promise: promiseProcessor,
  optional: optionalProcessor,
  lazy: lazyProcessor
};
function toJSONSchema(input, params) {
  if ("_idmap" in input) {
    const registry2 = input;
    const ctx2 = initializeContext({ ...params, processors: allProcessors });
    const defs = {};
    for (const entry of registry2._idmap.entries()) {
      const [_, schema] = entry;
      process(schema, ctx2);
    }
    const schemas2 = {};
    const external2 = {
      registry: registry2,
      uri: params?.uri,
      defs
    };
    ctx2.external = external2;
    for (const entry of registry2._idmap.entries()) {
      const [key, schema] = entry;
      extractDefs(ctx2, schema);
      schemas2[key] = finalize(ctx2, schema);
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = ctx2.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas2.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas: schemas2 };
  }
  const ctx = initializeContext({ ...params, processors: allProcessors });
  process(input, ctx);
  extractDefs(ctx, input);
  return finalize(ctx, input);
}
const _checks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  endsWith: _endsWith,
  gt: _gt,
  gte: _gte,
  includes: _includes,
  length: _length,
  lowercase: _lowercase,
  lt: _lt,
  lte: _lte,
  maxLength: _maxLength,
  maxSize: _maxSize,
  mime: _mime,
  minLength: _minLength,
  minSize: _minSize,
  multipleOf: _multipleOf,
  negative: _negative,
  nonnegative: _nonnegative,
  nonpositive: _nonpositive,
  normalize: _normalize,
  overwrite: _overwrite,
  positive: _positive,
  property: _property,
  regex: _regex,
  size: _size,
  slugify: _slugify,
  startsWith: _startsWith,
  toLowerCase: _toLowerCase,
  toUpperCase: _toUpperCase,
  trim: _trim,
  uppercase: _uppercase
});
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime(params) {
  return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date$2(params) {
  return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time(params) {
  return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration(params) {
  return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
const _iso = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ZodISODate,
  ZodISODateTime,
  ZodISODuration,
  ZodISOTime,
  date: date$2,
  datetime,
  duration,
  time
});
const initializer = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
      // enumerable: false,
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
      // enumerable: false,
    },
    addIssue: {
      value: (issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
};
const ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, {
  Parent: Error
});
const parse$2 = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse$2(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode(inst, data, params);
  inst.decode = (data, params) => decode(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def2 = this.def;
      return this.clone(mergeDefs(def2, {
        checks: [
          ...def2.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def2, params) {
      return clone(this, def2, params);
    },
    brand() {
      return this;
    },
    register(reg, meta2) {
      reg.add(this, meta2);
      return this;
    },
    refine(check2, params) {
      return this.check(refine(check2, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(/* @__PURE__ */ _overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(/* @__PURE__ */ _regex(...args));
    },
    includes(...args) {
      return this.check(/* @__PURE__ */ _includes(...args));
    },
    startsWith(...args) {
      return this.check(/* @__PURE__ */ _startsWith(...args));
    },
    endsWith(...args) {
      return this.check(/* @__PURE__ */ _endsWith(...args));
    },
    min(...args) {
      return this.check(/* @__PURE__ */ _minLength(...args));
    },
    max(...args) {
      return this.check(/* @__PURE__ */ _maxLength(...args));
    },
    length(...args) {
      return this.check(/* @__PURE__ */ _length(...args));
    },
    nonempty(...args) {
      return this.check(/* @__PURE__ */ _minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(/* @__PURE__ */ _lowercase(params));
    },
    uppercase(params) {
      return this.check(/* @__PURE__ */ _uppercase(params));
    },
    trim() {
      return this.check(/* @__PURE__ */ _trim());
    },
    normalize(...args) {
      return this.check(/* @__PURE__ */ _normalize(...args));
    },
    toLowerCase() {
      return this.check(/* @__PURE__ */ _toLowerCase());
    },
    toUpperCase() {
      return this.check(/* @__PURE__ */ _toUpperCase());
    },
    slugify() {
      return this.check(/* @__PURE__ */ _slugify());
    }
  });
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
  inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
  inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
  inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime(params));
  inst.date = (params) => inst.check(date$2(params));
  inst.time = (params) => inst.check(time(params));
  inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
  return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function email(params) {
  return /* @__PURE__ */ _email(ZodEmail, params);
}
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function guid(params) {
  return /* @__PURE__ */ _guid(ZodGUID, params);
}
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function uuid(params) {
  return /* @__PURE__ */ _uuid(ZodUUID, params);
}
function uuidv4(params) {
  return /* @__PURE__ */ _uuidv4(ZodUUID, params);
}
function uuidv6(params) {
  return /* @__PURE__ */ _uuidv6(ZodUUID, params);
}
function uuidv7(params) {
  return /* @__PURE__ */ _uuidv7(ZodUUID, params);
}
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function url(params) {
  return /* @__PURE__ */ _url(ZodURL, params);
}
function httpUrl(params) {
  return /* @__PURE__ */ _url(ZodURL, {
    protocol: httpProtocol,
    hostname: domain,
    ...normalizeParams(params)
  });
}
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function emoji(params) {
  return /* @__PURE__ */ _emoji(ZodEmoji, params);
}
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function nanoid(params) {
  return /* @__PURE__ */ _nanoid(ZodNanoID, params);
}
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cuid(params) {
  return /* @__PURE__ */ _cuid(ZodCUID, params);
}
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cuid2(params) {
  return /* @__PURE__ */ _cuid2(ZodCUID2, params);
}
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ulid(params) {
  return /* @__PURE__ */ _ulid(ZodULID, params);
}
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function xid(params) {
  return /* @__PURE__ */ _xid(ZodXID, params);
}
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ksuid(params) {
  return /* @__PURE__ */ _ksuid(ZodKSUID, params);
}
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ipv4(params) {
  return /* @__PURE__ */ _ipv4(ZodIPv4, params);
}
const ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def) => {
  $ZodMAC.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function mac(params) {
  return /* @__PURE__ */ _mac(ZodMAC, params);
}
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function ipv6(params) {
  return /* @__PURE__ */ _ipv6(ZodIPv6, params);
}
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cidrv4(params) {
  return /* @__PURE__ */ _cidrv4(ZodCIDRv4, params);
}
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function cidrv6(params) {
  return /* @__PURE__ */ _cidrv6(ZodCIDRv6, params);
}
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function base64(params) {
  return /* @__PURE__ */ _base64(ZodBase64, params);
}
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function base64url(params) {
  return /* @__PURE__ */ _base64url(ZodBase64URL, params);
}
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function e164(params) {
  return /* @__PURE__ */ _e164(ZodE164, params);
}
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function jwt(params) {
  return /* @__PURE__ */ _jwt(ZodJWT, params);
}
const ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def) => {
  $ZodCustomStringFormat.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function stringFormat(format, fnOrRegex, _params = {}) {
  return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname(_params) {
  return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, "hostname", hostname$1, _params);
}
function hex(_params) {
  return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, "hex", hex$1, _params);
}
function hash(alg, params) {
  const enc = params?.enc ?? "hex";
  const format = `${alg}_${enc}`;
  const regex = regexes$1[format];
  if (!regex)
    throw new Error(`Unrecognized hash format: ${format}`);
  return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, format, regex, params);
}
const ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(/* @__PURE__ */ _gt(value, params));
    },
    gte(value, params) {
      return this.check(/* @__PURE__ */ _gte(value, params));
    },
    min(value, params) {
      return this.check(/* @__PURE__ */ _gte(value, params));
    },
    lt(value, params) {
      return this.check(/* @__PURE__ */ _lt(value, params));
    },
    lte(value, params) {
      return this.check(/* @__PURE__ */ _lte(value, params));
    },
    max(value, params) {
      return this.check(/* @__PURE__ */ _lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(/* @__PURE__ */ _gt(0, params));
    },
    nonnegative(params) {
      return this.check(/* @__PURE__ */ _gte(0, params));
    },
    negative(params) {
      return this.check(/* @__PURE__ */ _lt(0, params));
    },
    nonpositive(params) {
      return this.check(/* @__PURE__ */ _lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(/* @__PURE__ */ _multipleOf(value, params));
    },
    step(value, params) {
      return this.check(/* @__PURE__ */ _multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number$1(params) {
  return /* @__PURE__ */ _number(ZodNumber, params);
}
const ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
function float32(params) {
  return /* @__PURE__ */ _float32(ZodNumberFormat, params);
}
function float64(params) {
  return /* @__PURE__ */ _float64(ZodNumberFormat, params);
}
function int32(params) {
  return /* @__PURE__ */ _int32(ZodNumberFormat, params);
}
function uint32(params) {
  return /* @__PURE__ */ _uint32(ZodNumberFormat, params);
}
const ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => booleanProcessor(inst, ctx, json2);
});
function boolean$1(params) {
  return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
const ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def) => {
  $ZodBigInt.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => bigintProcessor(inst, ctx);
  inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
  inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
  inst.gt = (value, params) => inst.check(/* @__PURE__ */ _gt(value, params));
  inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
  inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
  inst.lt = (value, params) => inst.check(/* @__PURE__ */ _lt(value, params));
  inst.lte = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
  inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
  inst.positive = (params) => inst.check(/* @__PURE__ */ _gt(BigInt(0), params));
  inst.negative = (params) => inst.check(/* @__PURE__ */ _lt(BigInt(0), params));
  inst.nonpositive = (params) => inst.check(/* @__PURE__ */ _lte(BigInt(0), params));
  inst.nonnegative = (params) => inst.check(/* @__PURE__ */ _gte(BigInt(0), params));
  inst.multipleOf = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
  const bag = inst._zod.bag;
  inst.minValue = bag.minimum ?? null;
  inst.maxValue = bag.maximum ?? null;
  inst.format = bag.format ?? null;
});
function bigint(params) {
  return /* @__PURE__ */ _bigint(ZodBigInt, params);
}
const ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def) => {
  $ZodBigIntFormat.init(inst, def);
  ZodBigInt.init(inst, def);
});
function int64(params) {
  return /* @__PURE__ */ _int64(ZodBigIntFormat, params);
}
function uint64(params) {
  return /* @__PURE__ */ _uint64(ZodBigIntFormat, params);
}
const ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def) => {
  $ZodSymbol.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => symbolProcessor(inst, ctx);
});
function symbol(params) {
  return /* @__PURE__ */ _symbol(ZodSymbol, params);
}
const ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
  $ZodUndefined.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => undefinedProcessor(inst, ctx);
});
function _undefined(params) {
  return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
}
const ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2);
});
function _null(params) {
  return /* @__PURE__ */ _null$1(ZodNull, params);
}
const ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
  $ZodAny.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => anyProcessor();
});
function any() {
  return /* @__PURE__ */ _any(ZodAny);
}
const ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unknownProcessor();
});
function unknown() {
  return /* @__PURE__ */ _unknown(ZodUnknown);
}
const ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2);
});
function never(params) {
  return /* @__PURE__ */ _never(ZodNever, params);
}
const ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
  $ZodVoid.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => voidProcessor(inst, ctx);
});
function _void(params) {
  return /* @__PURE__ */ _void$1(ZodVoid, params);
}
const ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def) => {
  $ZodDate.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => dateProcessor(inst, ctx);
  inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
  inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
  const c = inst._zod.bag;
  inst.minDate = c.minimum ? new Date(c.minimum) : null;
  inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date$1(params) {
  return /* @__PURE__ */ _date(ZodDate, params);
}
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(/* @__PURE__ */ _minLength(n, params));
    },
    nonempty(params) {
      return this.check(/* @__PURE__ */ _minLength(1, params));
    },
    max(n, params) {
      return this.check(/* @__PURE__ */ _maxLength(n, params));
    },
    length(n, params) {
      return this.check(/* @__PURE__ */ _length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return /* @__PURE__ */ _array(ZodArray, element, params);
}
function keyof(schema) {
  const shape = schema._zod.def.shape;
  return _enum(Object.keys(shape));
}
const ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
  defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(incoming) {
      return extend(this, incoming);
    },
    safeExtend(incoming) {
      return safeExtend(this, incoming);
    },
    merge(other) {
      return merge(this, other);
    },
    pick(mask) {
      return pick(this, mask);
    },
    omit(mask) {
      return omit(this, mask);
    },
    partial(...args) {
      return partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return required(ZodNonOptional, this, args[0]);
    }
  });
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...normalizeParams(params)
  });
}
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...normalizeParams(params)
  });
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
const ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodXor.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
  inst.options = def.options;
});
function xor(options, params) {
  return new ZodXor({
    type: "union",
    options,
    inclusive: false,
    ...normalizeParams(params)
  });
}
const ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...normalizeParams(params)
  });
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => intersectionProcessor(inst, ctx, json2, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
const ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
  $ZodTuple.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => tupleProcessor(inst, ctx, json2, params);
  inst.rest = (rest) => inst.clone({
    ...inst._zod.def,
    rest
  });
});
function tuple(items, _paramsOrRest, _params) {
  const hasRest = _paramsOrRest instanceof $ZodType;
  const params = hasRest ? _params : _paramsOrRest;
  const rest = hasRest ? _paramsOrRest : null;
  return new ZodTuple({
    type: "tuple",
    items,
    rest,
    ...normalizeParams(params)
  });
}
const ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
function partialRecord(keyType, valueType, params) {
  const k = clone(keyType);
  k._zod.values = void 0;
  return new ZodRecord({
    type: "record",
    keyType: k,
    valueType,
    ...normalizeParams(params)
  });
}
function looseRecord(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    mode: "loose",
    ...normalizeParams(params)
  });
}
const ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def) => {
  $ZodMap.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => mapProcessor(inst, ctx);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
  inst.min = (...args) => inst.check(/* @__PURE__ */ _minSize(...args));
  inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minSize(1, params));
  inst.max = (...args) => inst.check(/* @__PURE__ */ _maxSize(...args));
  inst.size = (...args) => inst.check(/* @__PURE__ */ _size(...args));
});
function map(keyType, valueType, params) {
  return new ZodMap({
    type: "map",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
const ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def) => {
  $ZodSet.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => setProcessor(inst, ctx);
  inst.min = (...args) => inst.check(/* @__PURE__ */ _minSize(...args));
  inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minSize(1, params));
  inst.max = (...args) => inst.check(/* @__PURE__ */ _maxSize(...args));
  inst.size = (...args) => inst.check(/* @__PURE__ */ _size(...args));
});
function set(valueType, params) {
  return new ZodSet({
    type: "set",
    valueType,
    ...normalizeParams(params)
  });
}
const ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function nativeEnum(entries, params) {
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
const ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => literalProcessor(inst, ctx, json2);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
const ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def) => {
  $ZodFile.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => fileProcessor(inst, ctx, json2);
  inst.min = (size, params) => inst.check(/* @__PURE__ */ _minSize(size, params));
  inst.max = (size, params) => inst.check(/* @__PURE__ */ _maxSize(size, params));
  inst.mime = (types, params) => inst.check(/* @__PURE__ */ _mime(Array.isArray(types) ? types : [types], params));
});
function file(params) {
  return /* @__PURE__ */ _file(ZodFile, params);
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => transformProcessor(inst, ctx);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue$1) => {
      if (typeof issue$1 === "string") {
        payload.issues.push(issue(issue$1, payload.value, def));
      } else {
        const _issue = issue$1;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => optionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nullableProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
function nullish(innerType) {
  return optional(nullable(innerType));
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => defaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => prefaultProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nonoptionalProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
const ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def) => {
  $ZodSuccess.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => successProcessor(inst, ctx, json2);
  inst.unwrap = () => inst._zod.def.innerType;
});
function success(innerType) {
  return new ZodSuccess({
    type: "success",
    innerType
  });
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
const ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
  $ZodNaN.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => nanProcessor(inst, ctx);
});
function nan(params) {
  return /* @__PURE__ */ _nan(ZodNaN, params);
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
const ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodCodec.init(inst, def);
});
function codec(in_, out, params) {
  return new ZodCodec({
    type: "pipe",
    in: in_,
    out,
    transform: params.decode,
    reverseTransform: params.encode
  });
}
function invertCodec(codec2) {
  const def = codec2._zod.def;
  return new ZodCodec({
    type: "pipe",
    in: def.out,
    out: def.in,
    transform: def.reverseTransform,
    reverseTransform: def.transform
  });
}
const ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodPreprocess.init(inst, def);
});
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => readonlyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
const ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
  $ZodTemplateLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => templateLiteralProcessor(inst, ctx, json2);
});
function templateLiteral(parts, params) {
  return new ZodTemplateLiteral({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
const ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => lazyProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
const ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def) => {
  $ZodPromise.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => promiseProcessor(inst, ctx, json2, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function promise(innerType) {
  return new ZodPromise({
    type: "promise",
    innerType
  });
}
const ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
  $ZodFunction.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => functionProcessor(inst, ctx);
});
function _function(params) {
  return new ZodFunction({
    type: "function",
    input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
    output: params?.output ?? unknown()
  });
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx);
});
function check(fn) {
  const ch = new $ZodCheck({
    check: "custom"
    // ...util.normalizeParams(params),
  });
  ch._zod.check = fn;
  return ch;
}
function custom(fn, _params) {
  return /* @__PURE__ */ _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return /* @__PURE__ */ _superRefine(fn, params);
}
const describe = describe$1;
const meta = meta$1;
function _instanceof(cls, params = {}) {
  const inst = new ZodCustom({
    type: "custom",
    check: "custom",
    fn: (data) => data instanceof cls,
    abort: true,
    ...normalizeParams(params)
  });
  inst._zod.bag.Class = cls;
  inst._zod.check = (payload) => {
    if (!(payload.value instanceof cls)) {
      payload.issues.push({
        code: "invalid_type",
        expected: cls.name,
        input: payload.value,
        inst,
        path: [...inst._zod.def.path ?? []]
      });
    }
  };
  return inst;
}
const stringbool = (...args) => /* @__PURE__ */ _stringbool({
  Codec: ZodCodec,
  Boolean: ZodBoolean,
  String: ZodString
}, ...args);
function json(params) {
  const jsonSchema2 = lazy(() => {
    return union([string(params), number$1(), boolean$1(), _null(), array(jsonSchema2), record(string(), jsonSchema2)]);
  });
  return jsonSchema2;
}
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}
const _schemas = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ZodAny,
  ZodArray,
  ZodBase64,
  ZodBase64URL,
  ZodBigInt,
  ZodBigIntFormat,
  ZodBoolean,
  ZodCIDRv4,
  ZodCIDRv6,
  ZodCUID,
  ZodCUID2,
  ZodCatch,
  ZodCodec,
  ZodCustom,
  ZodCustomStringFormat,
  ZodDate,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodE164,
  ZodEmail,
  ZodEmoji,
  ZodEnum,
  ZodExactOptional,
  ZodFile,
  ZodFunction,
  ZodGUID,
  ZodIPv4,
  ZodIPv6,
  ZodIntersection,
  ZodJWT,
  ZodKSUID,
  ZodLazy,
  ZodLiteral,
  ZodMAC,
  ZodMap,
  ZodNaN,
  ZodNanoID,
  ZodNever,
  ZodNonOptional,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodNumberFormat,
  ZodObject,
  ZodOptional,
  ZodPipe,
  ZodPrefault,
  ZodPreprocess,
  ZodPromise,
  ZodReadonly,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodStringFormat,
  ZodSuccess,
  ZodSymbol,
  ZodTemplateLiteral,
  ZodTransform,
  ZodTuple,
  ZodType,
  ZodULID,
  ZodURL,
  ZodUUID,
  ZodUndefined,
  ZodUnion,
  ZodUnknown,
  ZodVoid,
  ZodXID,
  ZodXor,
  _ZodString,
  _default,
  _function,
  any,
  array,
  base64,
  base64url,
  bigint,
  boolean: boolean$1,
  catch: _catch,
  check,
  cidrv4,
  cidrv6,
  codec,
  cuid,
  cuid2,
  custom,
  date: date$1,
  describe,
  discriminatedUnion,
  e164,
  email,
  emoji,
  enum: _enum,
  exactOptional,
  file,
  float32,
  float64,
  function: _function,
  guid,
  hash,
  hex,
  hostname,
  httpUrl,
  instanceof: _instanceof,
  int,
  int32,
  int64,
  intersection,
  invertCodec,
  ipv4,
  ipv6,
  json,
  jwt,
  keyof,
  ksuid,
  lazy,
  literal,
  looseObject,
  looseRecord,
  mac,
  map,
  meta,
  nan,
  nanoid,
  nativeEnum,
  never,
  nonoptional,
  null: _null,
  nullable,
  nullish,
  number: number$1,
  object,
  optional,
  partialRecord,
  pipe,
  prefault,
  preprocess,
  promise,
  readonly,
  record,
  refine,
  set,
  strictObject,
  string,
  stringFormat,
  stringbool,
  success,
  superRefine,
  symbol,
  templateLiteral,
  transform,
  tuple,
  uint32,
  uint64,
  ulid,
  undefined: _undefined,
  union,
  unknown,
  url,
  uuid,
  uuidv4,
  uuidv6,
  uuidv7,
  void: _void,
  xid,
  xor
});
const ZodIssueCode = {
  custom: "custom"
};
const z = {
  ..._schemas,
  ..._checks,
  iso: _iso
};
const RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
  // Schema identification
  "$schema",
  "$ref",
  "$defs",
  "definitions",
  // Core schema keywords
  "$id",
  "id",
  "$comment",
  "$anchor",
  "$vocabulary",
  "$dynamicRef",
  "$dynamicAnchor",
  // Type
  "type",
  "enum",
  "const",
  // Composition
  "anyOf",
  "oneOf",
  "allOf",
  "not",
  // Object
  "properties",
  "required",
  "additionalProperties",
  "patternProperties",
  "propertyNames",
  "minProperties",
  "maxProperties",
  // Array
  "items",
  "prefixItems",
  "additionalItems",
  "minItems",
  "maxItems",
  "uniqueItems",
  "contains",
  "minContains",
  "maxContains",
  // String
  "minLength",
  "maxLength",
  "pattern",
  "format",
  // Number
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  // Already handled metadata
  "description",
  "default",
  // Content
  "contentEncoding",
  "contentMediaType",
  "contentSchema",
  // Unsupported (error-throwing)
  "unevaluatedItems",
  "unevaluatedProperties",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependentRequired",
  // OpenAPI
  "nullable",
  "readOnly"
]);
function detectVersion(schema, defaultTarget) {
  const $schema = schema.$schema;
  if ($schema === "https://json-schema.org/draft/2020-12/schema") {
    return "draft-2020-12";
  }
  if ($schema === "http://json-schema.org/draft-07/schema#") {
    return "draft-7";
  }
  if ($schema === "http://json-schema.org/draft-04/schema#") {
    return "draft-4";
  }
  return "draft-2020-12";
}
function resolveRef(ref, ctx) {
  if (!ref.startsWith("#")) {
    throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
  }
  const path = ref.slice(1).split("/").filter(Boolean);
  if (path.length === 0) {
    return ctx.rootSchema;
  }
  const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
  if (path[0] === defsKey) {
    const key = path[1];
    if (!key || !ctx.defs[key]) {
      throw new Error(`Reference not found: ${ref}`);
    }
    return ctx.defs[key];
  }
  throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
  if (schema.not !== void 0) {
    if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
      return z.never();
    }
    throw new Error("not is not supported in Zod (except { not: {} } for never)");
  }
  if (schema.unevaluatedItems !== void 0) {
    throw new Error("unevaluatedItems is not supported");
  }
  if (schema.unevaluatedProperties !== void 0) {
    throw new Error("unevaluatedProperties is not supported");
  }
  if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) {
    throw new Error("Conditional schemas (if/then/else) are not supported");
  }
  if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) {
    throw new Error("dependentSchemas and dependentRequired are not supported");
  }
  if (schema.$ref) {
    const refPath = schema.$ref;
    if (ctx.refs.has(refPath)) {
      return ctx.refs.get(refPath);
    }
    if (ctx.processing.has(refPath)) {
      return z.lazy(() => {
        if (!ctx.refs.has(refPath)) {
          throw new Error(`Circular reference not resolved: ${refPath}`);
        }
        return ctx.refs.get(refPath);
      });
    }
    ctx.processing.add(refPath);
    const resolved = resolveRef(refPath, ctx);
    const zodSchema2 = convertSchema(resolved, ctx);
    ctx.refs.set(refPath, zodSchema2);
    ctx.processing.delete(refPath);
    return zodSchema2;
  }
  if (schema.enum !== void 0) {
    const enumValues = schema.enum;
    if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
      return z.null();
    }
    if (enumValues.length === 0) {
      return z.never();
    }
    if (enumValues.length === 1) {
      return z.literal(enumValues[0]);
    }
    if (enumValues.every((v) => typeof v === "string")) {
      return z.enum(enumValues);
    }
    const literalSchemas = enumValues.map((v) => z.literal(v));
    if (literalSchemas.length < 2) {
      return literalSchemas[0];
    }
    return z.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
  }
  if (schema.const !== void 0) {
    return z.literal(schema.const);
  }
  const type = schema.type;
  if (Array.isArray(type)) {
    const typeSchemas = type.map((t) => {
      const typeSchema = { ...schema, type: t };
      return convertBaseSchema(typeSchema, ctx);
    });
    if (typeSchemas.length === 0) {
      return z.never();
    }
    if (typeSchemas.length === 1) {
      return typeSchemas[0];
    }
    return z.union(typeSchemas);
  }
  if (!type) {
    return z.any();
  }
  let zodSchema;
  switch (type) {
    case "string": {
      let stringSchema = z.string();
      if (schema.format) {
        const format = schema.format;
        if (format === "email") {
          stringSchema = stringSchema.check(z.email());
        } else if (format === "uri" || format === "uri-reference") {
          stringSchema = stringSchema.check(z.url());
        } else if (format === "uuid" || format === "guid") {
          stringSchema = stringSchema.check(z.uuid());
        } else if (format === "date-time") {
          stringSchema = stringSchema.check(z.iso.datetime());
        } else if (format === "date") {
          stringSchema = stringSchema.check(z.iso.date());
        } else if (format === "time") {
          stringSchema = stringSchema.check(z.iso.time());
        } else if (format === "duration") {
          stringSchema = stringSchema.check(z.iso.duration());
        } else if (format === "ipv4") {
          stringSchema = stringSchema.check(z.ipv4());
        } else if (format === "ipv6") {
          stringSchema = stringSchema.check(z.ipv6());
        } else if (format === "mac") {
          stringSchema = stringSchema.check(z.mac());
        } else if (format === "cidr") {
          stringSchema = stringSchema.check(z.cidrv4());
        } else if (format === "cidr-v6") {
          stringSchema = stringSchema.check(z.cidrv6());
        } else if (format === "base64") {
          stringSchema = stringSchema.check(z.base64());
        } else if (format === "base64url") {
          stringSchema = stringSchema.check(z.base64url());
        } else if (format === "e164") {
          stringSchema = stringSchema.check(z.e164());
        } else if (format === "jwt") {
          stringSchema = stringSchema.check(z.jwt());
        } else if (format === "emoji") {
          stringSchema = stringSchema.check(z.emoji());
        } else if (format === "nanoid") {
          stringSchema = stringSchema.check(z.nanoid());
        } else if (format === "cuid") {
          stringSchema = stringSchema.check(z.cuid());
        } else if (format === "cuid2") {
          stringSchema = stringSchema.check(z.cuid2());
        } else if (format === "ulid") {
          stringSchema = stringSchema.check(z.ulid());
        } else if (format === "xid") {
          stringSchema = stringSchema.check(z.xid());
        } else if (format === "ksuid") {
          stringSchema = stringSchema.check(z.ksuid());
        }
      }
      if (typeof schema.minLength === "number") {
        stringSchema = stringSchema.min(schema.minLength);
      }
      if (typeof schema.maxLength === "number") {
        stringSchema = stringSchema.max(schema.maxLength);
      }
      if (schema.pattern) {
        stringSchema = stringSchema.regex(new RegExp(schema.pattern));
      }
      zodSchema = stringSchema;
      break;
    }
    case "number":
    case "integer": {
      let numberSchema = type === "integer" ? z.number().int() : z.number();
      if (typeof schema.minimum === "number") {
        numberSchema = numberSchema.min(schema.minimum);
      }
      if (typeof schema.maximum === "number") {
        numberSchema = numberSchema.max(schema.maximum);
      }
      if (typeof schema.exclusiveMinimum === "number") {
        numberSchema = numberSchema.gt(schema.exclusiveMinimum);
      } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
        numberSchema = numberSchema.gt(schema.minimum);
      }
      if (typeof schema.exclusiveMaximum === "number") {
        numberSchema = numberSchema.lt(schema.exclusiveMaximum);
      } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
        numberSchema = numberSchema.lt(schema.maximum);
      }
      if (typeof schema.multipleOf === "number") {
        numberSchema = numberSchema.multipleOf(schema.multipleOf);
      }
      zodSchema = numberSchema;
      break;
    }
    case "boolean": {
      zodSchema = z.boolean();
      break;
    }
    case "null": {
      zodSchema = z.null();
      break;
    }
    case "object": {
      const shape = {};
      const properties = schema.properties || {};
      const requiredSet = new Set(schema.required || []);
      for (const [key, propSchema] of Object.entries(properties)) {
        const propZodSchema = convertSchema(propSchema, ctx);
        shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
      }
      if (schema.propertyNames) {
        const keySchema = convertSchema(schema.propertyNames, ctx);
        const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
        if (Object.keys(shape).length === 0) {
          zodSchema = z.record(keySchema, valueSchema);
          break;
        }
        const objectSchema2 = z.object(shape).passthrough();
        const recordSchema = z.looseRecord(keySchema, valueSchema);
        zodSchema = z.intersection(objectSchema2, recordSchema);
        break;
      }
      if (schema.patternProperties) {
        const patternProps = schema.patternProperties;
        const patternKeys = Object.keys(patternProps);
        const looseRecords = [];
        for (const pattern of patternKeys) {
          const patternValue = convertSchema(patternProps[pattern], ctx);
          const keySchema = z.string().regex(new RegExp(pattern));
          looseRecords.push(z.looseRecord(keySchema, patternValue));
        }
        const schemasToIntersect = [];
        if (Object.keys(shape).length > 0) {
          schemasToIntersect.push(z.object(shape).passthrough());
        }
        schemasToIntersect.push(...looseRecords);
        if (schemasToIntersect.length === 0) {
          zodSchema = z.object({}).passthrough();
        } else if (schemasToIntersect.length === 1) {
          zodSchema = schemasToIntersect[0];
        } else {
          let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
          for (let i = 2; i < schemasToIntersect.length; i++) {
            result = z.intersection(result, schemasToIntersect[i]);
          }
          zodSchema = result;
        }
        break;
      }
      const objectSchema = z.object(shape);
      if (schema.additionalProperties === false) {
        zodSchema = objectSchema.strict();
      } else if (typeof schema.additionalProperties === "object") {
        zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
      } else {
        zodSchema = objectSchema.passthrough();
      }
      break;
    }
    case "array": {
      const prefixItems = schema.prefixItems;
      const items = schema.items;
      if (prefixItems && Array.isArray(prefixItems)) {
        const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
        const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (Array.isArray(items)) {
        const tupleItems = items.map((item) => convertSchema(item, ctx));
        const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
        if (rest) {
          zodSchema = z.tuple(tupleItems).rest(rest);
        } else {
          zodSchema = z.tuple(tupleItems);
        }
        if (typeof schema.minItems === "number") {
          zodSchema = zodSchema.check(z.minLength(schema.minItems));
        }
        if (typeof schema.maxItems === "number") {
          zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
        }
      } else if (items !== void 0) {
        const element = convertSchema(items, ctx);
        let arraySchema = z.array(element);
        if (typeof schema.minItems === "number") {
          arraySchema = arraySchema.min(schema.minItems);
        }
        if (typeof schema.maxItems === "number") {
          arraySchema = arraySchema.max(schema.maxItems);
        }
        zodSchema = arraySchema;
      } else {
        zodSchema = z.array(z.any());
      }
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
  return zodSchema;
}
function convertSchema(schema, ctx) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let baseSchema = convertBaseSchema(schema, ctx);
  const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const options = schema.anyOf.map((s) => convertSchema(s, ctx));
    const anyOfUnion = z.union(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const options = schema.oneOf.map((s) => convertSchema(s, ctx));
    const oneOfUnion = z.xor(options);
    baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
  }
  if (schema.allOf && Array.isArray(schema.allOf)) {
    if (schema.allOf.length === 0) {
      baseSchema = hasExplicitType ? baseSchema : z.any();
    } else {
      let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
      const startIdx = hasExplicitType ? 0 : 1;
      for (let i = startIdx; i < schema.allOf.length; i++) {
        result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
      }
      baseSchema = result;
    }
  }
  if (schema.nullable === true && ctx.version === "openapi-3.0") {
    baseSchema = z.nullable(baseSchema);
  }
  if (schema.readOnly === true) {
    baseSchema = z.readonly(baseSchema);
  }
  if (schema.default !== void 0) {
    baseSchema = baseSchema.default(schema.default);
  }
  const extraMeta = {};
  const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
  for (const key of coreMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
  for (const key of contentMetadataKeys) {
    if (key in schema) {
      extraMeta[key] = schema[key];
    }
  }
  for (const key of Object.keys(schema)) {
    if (!RECOGNIZED_KEYS.has(key)) {
      extraMeta[key] = schema[key];
    }
  }
  if (Object.keys(extraMeta).length > 0) {
    ctx.registry.add(baseSchema, extraMeta);
  }
  if (schema.description) {
    baseSchema = baseSchema.describe(schema.description);
  }
  return baseSchema;
}
function fromJSONSchema(schema, params) {
  if (typeof schema === "boolean") {
    return schema ? z.any() : z.never();
  }
  let normalized;
  try {
    normalized = JSON.parse(JSON.stringify(schema));
  } catch {
    throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
  }
  const version2 = detectVersion(normalized);
  const defs = normalized.$defs || normalized.definitions || {};
  const ctx = {
    version: version2,
    defs,
    refs: /* @__PURE__ */ new Map(),
    processing: /* @__PURE__ */ new Set(),
    rootSchema: normalized,
    registry: globalRegistry
  };
  return convertSchema(normalized, ctx);
}
function number(params) {
  return /* @__PURE__ */ _coercedNumber(ZodNumber, params);
}
function boolean(params) {
  return /* @__PURE__ */ _coercedBoolean(ZodBoolean, params);
}
function date(params) {
  return /* @__PURE__ */ _coercedDate(ZodDate, params);
}
var zod = {};
var external = {};
var core$1 = {};
var core = {};
var hasRequiredCore$1;
function requireCore$1() {
  if (hasRequiredCore$1) return core;
  hasRequiredCore$1 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalConfig = exports.$ZodEncodeError = exports.$ZodAsyncError = exports.$brand = exports.NEVER = void 0;
    exports.$constructor = $constructor2;
    exports.config = config2;
    exports.NEVER = Object.freeze({
      status: "aborted"
    });
    function $constructor2(name, initializer2, params) {
      function init(inst, def) {
        var _a2;
        Object.defineProperty(inst, "_zod", {
          value: inst._zod ?? {},
          enumerable: false
        });
        (_a2 = inst._zod).traits ?? (_a2.traits = /* @__PURE__ */ new Set());
        inst._zod.traits.add(name);
        initializer2(inst, def);
        for (const k in _.prototype) {
          if (!(k in inst))
            Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
        }
        inst._zod.constr = _;
        inst._zod.def = def;
      }
      const Parent = params?.Parent ?? Object;
      class Definition extends Parent {
      }
      Object.defineProperty(Definition, "name", { value: name });
      function _(def) {
        var _a2;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        for (const fn of inst._zod.deferred) {
          fn();
        }
        return inst;
      }
      Object.defineProperty(_, "init", { value: init });
      Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
          if (params?.Parent && inst instanceof params.Parent)
            return true;
          return inst?._zod?.traits?.has(name);
        }
      });
      Object.defineProperty(_, "name", { value: name });
      return _;
    }
    exports.$brand = /* @__PURE__ */ Symbol("zod_brand");
    class $ZodAsyncError2 extends Error {
      constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
    }
    exports.$ZodAsyncError = $ZodAsyncError2;
    class $ZodEncodeError2 extends Error {
      constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
      }
    }
    exports.$ZodEncodeError = $ZodEncodeError2;
    exports.globalConfig = {};
    function config2(newConfig) {
      if (newConfig)
        Object.assign(exports.globalConfig, newConfig);
      return exports.globalConfig;
    }
  })(core);
  return core;
}
var parse$1 = {};
var errors$1 = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  Object.defineProperty(util, "__esModule", { value: true });
  util.Class = util.BIGINT_FORMAT_RANGES = util.NUMBER_FORMAT_RANGES = util.primitiveTypes = util.propertyKeyTypes = util.getParsedType = util.allowsEval = util.captureStackTrace = void 0;
  util.assertEqual = assertEqual;
  util.assertNotEqual = assertNotEqual;
  util.assertIs = assertIs;
  util.assertNever = assertNever;
  util.assert = assert;
  util.getEnumValues = getEnumValues2;
  util.joinValues = joinValues;
  util.jsonStringifyReplacer = jsonStringifyReplacer2;
  util.cached = cached2;
  util.nullish = nullish2;
  util.cleanRegex = cleanRegex2;
  util.floatSafeRemainder = floatSafeRemainder2;
  util.defineLazy = defineLazy2;
  util.objectClone = objectClone;
  util.assignProp = assignProp2;
  util.mergeDefs = mergeDefs2;
  util.cloneDef = cloneDef;
  util.getElementAtPath = getElementAtPath;
  util.promiseAllObject = promiseAllObject;
  util.randomString = randomString;
  util.esc = esc2;
  util.isObject = isObject2;
  util.isPlainObject = isPlainObject2;
  util.shallowClone = shallowClone2;
  util.numKeys = numKeys;
  util.escapeRegex = escapeRegex2;
  util.clone = clone2;
  util.normalizeParams = normalizeParams2;
  util.createTransparentProxy = createTransparentProxy;
  util.stringifyPrimitive = stringifyPrimitive;
  util.optionalKeys = optionalKeys2;
  util.pick = pick2;
  util.omit = omit2;
  util.extend = extend2;
  util.safeExtend = safeExtend2;
  util.merge = merge2;
  util.partial = partial2;
  util.required = required2;
  util.aborted = aborted2;
  util.prefixIssues = prefixIssues2;
  util.unwrapMessage = unwrapMessage2;
  util.finalizeIssue = finalizeIssue2;
  util.getSizableOrigin = getSizableOrigin2;
  util.getLengthableOrigin = getLengthableOrigin2;
  util.issue = issue2;
  util.cleanEnum = cleanEnum;
  util.base64ToUint8Array = base64ToUint8Array;
  util.uint8ArrayToBase64 = uint8ArrayToBase64;
  util.base64urlToUint8Array = base64urlToUint8Array;
  util.uint8ArrayToBase64url = uint8ArrayToBase64url;
  util.hexToUint8Array = hexToUint8Array;
  util.uint8ArrayToHex = uint8ArrayToHex;
  function assertEqual(val) {
    return val;
  }
  function assertNotEqual(val) {
    return val;
  }
  function assertIs(_arg) {
  }
  function assertNever(_x) {
    throw new Error();
  }
  function assert(_) {
  }
  function getEnumValues2(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
    return values;
  }
  function joinValues(array2, separator = "|") {
    return array2.map((val) => stringifyPrimitive(val)).join(separator);
  }
  function jsonStringifyReplacer2(_, value) {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  }
  function cached2(getter) {
    return {
      get value() {
        {
          const value = getter();
          Object.defineProperty(this, "value", { value });
          return value;
        }
      }
    };
  }
  function nullish2(input) {
    return input === null || input === void 0;
  }
  function cleanRegex2(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
  }
  function floatSafeRemainder2(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepString = step.toString();
    let stepDecCount = (stepString.split(".")[1] || "").length;
    if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
      const match = stepString.match(/\d?e-(\d?)/);
      if (match?.[1]) {
        stepDecCount = Number.parseInt(match[1]);
      }
    }
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  const EVALUATING2 = /* @__PURE__ */ Symbol("evaluating");
  function defineLazy2(object2, key, getter) {
    let value = void 0;
    Object.defineProperty(object2, key, {
      get() {
        if (value === EVALUATING2) {
          return void 0;
        }
        if (value === void 0) {
          value = EVALUATING2;
          value = getter();
        }
        return value;
      },
      set(v) {
        Object.defineProperty(object2, key, {
          value: v
          // configurable: true,
        });
      },
      configurable: true
    });
  }
  function objectClone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  }
  function assignProp2(target, prop, value) {
    Object.defineProperty(target, prop, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  function mergeDefs2(...defs) {
    const mergedDescriptors = {};
    for (const def of defs) {
      const descriptors = Object.getOwnPropertyDescriptors(def);
      Object.assign(mergedDescriptors, descriptors);
    }
    return Object.defineProperties({}, mergedDescriptors);
  }
  function cloneDef(schema) {
    return mergeDefs2(schema._zod.def);
  }
  function getElementAtPath(obj, path) {
    if (!path)
      return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
  }
  function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
      const resolvedObj = {};
      for (let i = 0; i < keys.length; i++) {
        resolvedObj[keys[i]] = results[i];
      }
      return resolvedObj;
    });
  }
  function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
  function esc2(str) {
    return JSON.stringify(str);
  }
  util.captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
  };
  function isObject2(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  util.allowsEval = cached2(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
      return false;
    }
    try {
      const F = Function;
      new F("");
      return true;
    } catch (_) {
      return false;
    }
  });
  function isPlainObject2(o) {
    if (isObject2(o) === false)
      return false;
    const ctor = o.constructor;
    if (ctor === void 0)
      return true;
    const prot = ctor.prototype;
    if (isObject2(prot) === false)
      return false;
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  function shallowClone2(o) {
    if (isPlainObject2(o))
      return { ...o };
    if (Array.isArray(o))
      return [...o];
    return o;
  }
  function numKeys(data) {
    let keyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        keyCount++;
      }
    }
    return keyCount;
  }
  const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return "undefined";
      case "string":
        return "string";
      case "number":
        return Number.isNaN(data) ? "nan" : "number";
      case "boolean":
        return "boolean";
      case "function":
        return "function";
      case "bigint":
        return "bigint";
      case "symbol":
        return "symbol";
      case "object":
        if (Array.isArray(data)) {
          return "array";
        }
        if (data === null) {
          return "null";
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return "promise";
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return "map";
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return "set";
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return "date";
        }
        if (typeof File !== "undefined" && data instanceof File) {
          return "file";
        }
        return "object";
      default:
        throw new Error(`Unknown data type: ${t}`);
    }
  };
  util.getParsedType = getParsedType;
  util.propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
  util.primitiveTypes = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
  function escapeRegex2(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function clone2(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
      cl._zod.parent = inst;
    return cl;
  }
  function normalizeParams2(_params) {
    const params = _params;
    if (!params)
      return {};
    if (typeof params === "string")
      return { error: () => params };
    if (params?.message !== void 0) {
      if (params?.error !== void 0)
        throw new Error("Cannot specify both `message` and `error` params");
      params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
      return { ...params, error: () => params.error };
    return params;
  }
  function createTransparentProxy(getter) {
    let target;
    return new Proxy({}, {
      get(_, prop, receiver) {
        target ?? (target = getter());
        return Reflect.get(target, prop, receiver);
      },
      set(_, prop, value, receiver) {
        target ?? (target = getter());
        return Reflect.set(target, prop, value, receiver);
      },
      has(_, prop) {
        target ?? (target = getter());
        return Reflect.has(target, prop);
      },
      deleteProperty(_, prop) {
        target ?? (target = getter());
        return Reflect.deleteProperty(target, prop);
      },
      ownKeys(_) {
        target ?? (target = getter());
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor(_, prop) {
        target ?? (target = getter());
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
      defineProperty(_, prop, descriptor) {
        target ?? (target = getter());
        return Reflect.defineProperty(target, prop, descriptor);
      }
    });
  }
  function stringifyPrimitive(value) {
    if (typeof value === "bigint")
      return value.toString() + "n";
    if (typeof value === "string")
      return `"${value}"`;
    return `${value}`;
  }
  function optionalKeys2(shape) {
    return Object.keys(shape).filter((k) => {
      return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
  }
  util.NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 34028234663852886e22],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
  };
  util.BIGINT_FORMAT_RANGES = {
    int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
  };
  function pick2(schema, mask) {
    const currDef = schema._zod.def;
    const def = mergeDefs2(schema._zod.def, {
      get shape() {
        const newShape = {};
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          newShape[key] = currDef.shape[key];
        }
        assignProp2(this, "shape", newShape);
        return newShape;
      },
      checks: []
    });
    return clone2(schema, def);
  }
  function omit2(schema, mask) {
    const currDef = schema._zod.def;
    const def = mergeDefs2(schema._zod.def, {
      get shape() {
        const newShape = { ...schema._zod.def.shape };
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          delete newShape[key];
        }
        assignProp2(this, "shape", newShape);
        return newShape;
      },
      checks: []
    });
    return clone2(schema, def);
  }
  function extend2(schema, shape) {
    if (!isPlainObject2(shape)) {
      throw new Error("Invalid input to extend: expected a plain object");
    }
    const checks2 = schema._zod.def.checks;
    const hasChecks = checks2 && checks2.length > 0;
    if (hasChecks) {
      throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
    }
    const def = mergeDefs2(schema._zod.def, {
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp2(this, "shape", _shape);
        return _shape;
      },
      checks: []
    });
    return clone2(schema, def);
  }
  function safeExtend2(schema, shape) {
    if (!isPlainObject2(shape)) {
      throw new Error("Invalid input to safeExtend: expected a plain object");
    }
    const def = {
      ...schema._zod.def,
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp2(this, "shape", _shape);
        return _shape;
      },
      checks: schema._zod.def.checks
    };
    return clone2(schema, def);
  }
  function merge2(a, b) {
    const def = mergeDefs2(a._zod.def, {
      get shape() {
        const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
        assignProp2(this, "shape", _shape);
        return _shape;
      },
      get catchall() {
        return b._zod.def.catchall;
      },
      checks: []
      // delete existing checks
    });
    return clone2(a, def);
  }
  function partial2(Class2, schema, mask) {
    const def = mergeDefs2(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in oldShape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            shape[key] = Class2 ? new Class2({
              type: "optional",
              innerType: oldShape[key]
            }) : oldShape[key];
          }
        } else {
          for (const key in oldShape) {
            shape[key] = Class2 ? new Class2({
              type: "optional",
              innerType: oldShape[key]
            }) : oldShape[key];
          }
        }
        assignProp2(this, "shape", shape);
        return shape;
      },
      checks: []
    });
    return clone2(schema, def);
  }
  function required2(Class2, schema, mask) {
    const def = mergeDefs2(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in shape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key]
            });
          }
        } else {
          for (const key in oldShape) {
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key]
            });
          }
        }
        assignProp2(this, "shape", shape);
        return shape;
      },
      checks: []
    });
    return clone2(schema, def);
  }
  function aborted2(x, startIndex = 0) {
    if (x.aborted === true)
      return true;
    for (let i = startIndex; i < x.issues.length; i++) {
      if (x.issues[i]?.continue !== true) {
        return true;
      }
    }
    return false;
  }
  function prefixIssues2(path, issues) {
    return issues.map((iss) => {
      var _a2;
      (_a2 = iss).path ?? (_a2.path = []);
      iss.path.unshift(path);
      return iss;
    });
  }
  function unwrapMessage2(message) {
    return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue2(iss, ctx, config2) {
    const full = { ...iss, path: iss.path ?? [] };
    if (!iss.message) {
      const message = unwrapMessage2(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage2(ctx?.error?.(iss)) ?? unwrapMessage2(config2.customError?.(iss)) ?? unwrapMessage2(config2.localeError?.(iss)) ?? "Invalid input";
      full.message = message;
    }
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
      delete full.input;
    }
    return full;
  }
  function getSizableOrigin2(input) {
    if (input instanceof Set)
      return "set";
    if (input instanceof Map)
      return "map";
    if (input instanceof File)
      return "file";
    return "unknown";
  }
  function getLengthableOrigin2(input) {
    if (Array.isArray(input))
      return "array";
    if (typeof input === "string")
      return "string";
    return "unknown";
  }
  function issue2(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
      return {
        message: iss,
        code: "custom",
        input,
        inst
      };
    }
    return { ...iss };
  }
  function cleanEnum(obj) {
    return Object.entries(obj).filter(([k, _]) => {
      return Number.isNaN(Number.parseInt(k, 10));
    }).map((el) => el[1]);
  }
  function base64ToUint8Array(base642) {
    const binaryString = atob(base642);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  function uint8ArrayToBase64(bytes) {
    let binaryString = "";
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }
  function base64urlToUint8Array(base64url2) {
    const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - base642.length % 4) % 4);
    return base64ToUint8Array(base642 + padding);
  }
  function uint8ArrayToBase64url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function hexToUint8Array(hex2) {
    const cleanHex = hex2.replace(/^0x/, "");
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Invalid hex string length");
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
  }
  function uint8ArrayToHex(bytes) {
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  class Class {
    constructor(..._args) {
    }
  }
  util.Class = Class;
  return util;
}
var hasRequiredErrors$1;
function requireErrors$1() {
  if (hasRequiredErrors$1) return errors$1;
  hasRequiredErrors$1 = 1;
  var __createBinding = errors$1 && errors$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = errors$1 && errors$1.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = errors$1 && errors$1.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(errors$1, "__esModule", { value: true });
  errors$1.$ZodRealError = errors$1.$ZodError = void 0;
  errors$1.flattenError = flattenError2;
  errors$1.formatError = formatError2;
  errors$1.treeifyError = treeifyError;
  errors$1.toDotPath = toDotPath;
  errors$1.prettifyError = prettifyError;
  const core_js_1 = requireCore$1();
  const util2 = __importStar(requireUtil());
  const initializer2 = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
      value: inst._zod,
      enumerable: false
    });
    Object.defineProperty(inst, "issues", {
      value: def,
      enumerable: false
    });
    inst.message = JSON.stringify(def, util2.jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
      value: () => inst.message,
      enumerable: false
    });
  };
  errors$1.$ZodError = (0, core_js_1.$constructor)("$ZodError", initializer2);
  errors$1.$ZodRealError = (0, core_js_1.$constructor)("$ZodError", initializer2, { Parent: Error });
  function flattenError2(error, mapper = (issue2) => issue2.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  function formatError2(error, _mapper) {
    const mapper = _mapper || function(issue2) {
      return issue2.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error2) => {
      for (const issue2 of error2.issues) {
        if (issue2.code === "invalid_union" && issue2.errors.length) {
          issue2.errors.map((issues) => processError({ issues }));
        } else if (issue2.code === "invalid_key") {
          processError({ issues: issue2.issues });
        } else if (issue2.code === "invalid_element") {
          processError({ issues: issue2.issues });
        } else if (issue2.path.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue2.path.length) {
            const el = issue2.path[i];
            const terminal = i === issue2.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(error);
    return fieldErrors;
  }
  function treeifyError(error, _mapper) {
    const mapper = _mapper || function(issue2) {
      return issue2.message;
    };
    const result = { errors: [] };
    const processError = (error2, path = []) => {
      var _a2, _b;
      for (const issue2 of error2.issues) {
        if (issue2.code === "invalid_union" && issue2.errors.length) {
          issue2.errors.map((issues) => processError({ issues }, issue2.path));
        } else if (issue2.code === "invalid_key") {
          processError({ issues: issue2.issues }, issue2.path);
        } else if (issue2.code === "invalid_element") {
          processError({ issues: issue2.issues }, issue2.path);
        } else {
          const fullpath = [...path, ...issue2.path];
          if (fullpath.length === 0) {
            result.errors.push(mapper(issue2));
            continue;
          }
          let curr = result;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (typeof el === "string") {
              curr.properties ?? (curr.properties = {});
              (_a2 = curr.properties)[el] ?? (_a2[el] = { errors: [] });
              curr = curr.properties[el];
            } else {
              curr.items ?? (curr.items = []);
              (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
              curr = curr.items[el];
            }
            if (terminal) {
              curr.errors.push(mapper(issue2));
            }
            i++;
          }
        }
      }
    };
    processError(error);
    return result;
  }
  function toDotPath(_path) {
    const segs = [];
    const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
    for (const seg of path) {
      if (typeof seg === "number")
        segs.push(`[${seg}]`);
      else if (typeof seg === "symbol")
        segs.push(`[${JSON.stringify(String(seg))}]`);
      else if (/[^\w$]/.test(seg))
        segs.push(`[${JSON.stringify(seg)}]`);
      else {
        if (segs.length)
          segs.push(".");
        segs.push(seg);
      }
    }
    return segs.join("");
  }
  function prettifyError(error) {
    const lines = [];
    const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
    for (const issue2 of issues) {
      lines.push(`✖ ${issue2.message}`);
      if (issue2.path?.length)
        lines.push(`  → at ${toDotPath(issue2.path)}`);
    }
    return lines.join("\n");
  }
  return errors$1;
}
var hasRequiredParse$1;
function requireParse$1() {
  if (hasRequiredParse$1) return parse$1;
  hasRequiredParse$1 = 1;
  (function(exports) {
    var __createBinding = parse$1 && parse$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = parse$1 && parse$1.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = parse$1 && parse$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeDecodeAsync = exports._safeDecodeAsync = exports.safeEncodeAsync = exports._safeEncodeAsync = exports.safeDecode = exports._safeDecode = exports.safeEncode = exports._safeEncode = exports.decodeAsync = exports._decodeAsync = exports.encodeAsync = exports._encodeAsync = exports.decode = exports._decode = exports.encode = exports._encode = exports.safeParseAsync = exports._safeParseAsync = exports.safeParse = exports._safeParse = exports.parseAsync = exports._parseAsync = exports.parse = exports._parse = void 0;
    const core2 = __importStar(requireCore$1());
    const errors2 = __importStar(requireErrors$1());
    const util2 = __importStar(requireUtil());
    const _parse2 = (_Err) => (schema, value, _ctx, _params) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
        throw new core2.$ZodAsyncError();
      }
      if (result.issues.length) {
        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())));
        util2.captureStackTrace(e, _params?.callee);
        throw e;
      }
      return result.value;
    };
    exports._parse = _parse2;
    exports.parse = (0, exports._parse)(errors2.$ZodRealError);
    const _parseAsync2 = (_Err) => async (schema, value, _ctx, params) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
        result = await result;
      if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())));
        util2.captureStackTrace(e, params?.callee);
        throw e;
      }
      return result.value;
    };
    exports._parseAsync = _parseAsync2;
    exports.parseAsync = (0, exports._parseAsync)(errors2.$ZodRealError);
    const _safeParse2 = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
        throw new core2.$ZodAsyncError();
      }
      return result.issues.length ? {
        success: false,
        error: new (_Err ?? errors2.$ZodError)(result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())))
      } : { success: true, data: result.value };
    };
    exports._safeParse = _safeParse2;
    exports.safeParse = (0, exports._safeParse)(errors2.$ZodRealError);
    const _safeParseAsync2 = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
        result = await result;
      return result.issues.length ? {
        success: false,
        error: new _Err(result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())))
      } : { success: true, data: result.value };
    };
    exports._safeParseAsync = _safeParseAsync2;
    exports.safeParseAsync = (0, exports._safeParseAsync)(errors2.$ZodRealError);
    const _encode2 = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return (0, exports._parse)(_Err)(schema, value, ctx);
    };
    exports._encode = _encode2;
    exports.encode = (0, exports._encode)(errors2.$ZodRealError);
    const _decode2 = (_Err) => (schema, value, _ctx) => {
      return (0, exports._parse)(_Err)(schema, value, _ctx);
    };
    exports._decode = _decode2;
    exports.decode = (0, exports._decode)(errors2.$ZodRealError);
    const _encodeAsync2 = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return (0, exports._parseAsync)(_Err)(schema, value, ctx);
    };
    exports._encodeAsync = _encodeAsync2;
    exports.encodeAsync = (0, exports._encodeAsync)(errors2.$ZodRealError);
    const _decodeAsync2 = (_Err) => async (schema, value, _ctx) => {
      return (0, exports._parseAsync)(_Err)(schema, value, _ctx);
    };
    exports._decodeAsync = _decodeAsync2;
    exports.decodeAsync = (0, exports._decodeAsync)(errors2.$ZodRealError);
    const _safeEncode2 = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return (0, exports._safeParse)(_Err)(schema, value, ctx);
    };
    exports._safeEncode = _safeEncode2;
    exports.safeEncode = (0, exports._safeEncode)(errors2.$ZodRealError);
    const _safeDecode2 = (_Err) => (schema, value, _ctx) => {
      return (0, exports._safeParse)(_Err)(schema, value, _ctx);
    };
    exports._safeDecode = _safeDecode2;
    exports.safeDecode = (0, exports._safeDecode)(errors2.$ZodRealError);
    const _safeEncodeAsync2 = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return (0, exports._safeParseAsync)(_Err)(schema, value, ctx);
    };
    exports._safeEncodeAsync = _safeEncodeAsync2;
    exports.safeEncodeAsync = (0, exports._safeEncodeAsync)(errors2.$ZodRealError);
    const _safeDecodeAsync2 = (_Err) => async (schema, value, _ctx) => {
      return (0, exports._safeParseAsync)(_Err)(schema, value, _ctx);
    };
    exports._safeDecodeAsync = _safeDecodeAsync2;
    exports.safeDecodeAsync = (0, exports._safeDecodeAsync)(errors2.$ZodRealError);
  })(parse$1);
  return parse$1;
}
var schemas$1 = {};
var checks$1 = {};
var regexes = {};
var hasRequiredRegexes;
function requireRegexes() {
  if (hasRequiredRegexes) return regexes;
  hasRequiredRegexes = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha384_base64 = exports.sha384_hex = exports.sha256_base64url = exports.sha256_base64 = exports.sha256_hex = exports.sha1_base64url = exports.sha1_base64 = exports.sha1_hex = exports.md5_base64url = exports.md5_base64 = exports.md5_hex = exports.hex = exports.uppercase = exports.lowercase = exports.undefined = exports.null = exports.boolean = exports.number = exports.integer = exports.bigint = exports.string = exports.date = exports.e164 = exports.domain = exports.hostname = exports.base64url = exports.base64 = exports.cidrv6 = exports.cidrv4 = exports.ipv6 = exports.ipv4 = exports.browserEmail = exports.idnEmail = exports.unicodeEmail = exports.rfc5322Email = exports.html5Email = exports.email = exports.uuid7 = exports.uuid6 = exports.uuid4 = exports.uuid = exports.guid = exports.extendedDuration = exports.duration = exports.nanoid = exports.ksuid = exports.xid = exports.ulid = exports.cuid2 = exports.cuid = void 0;
    exports.sha512_base64url = exports.sha512_base64 = exports.sha512_hex = exports.sha384_base64url = void 0;
    exports.emoji = emoji2;
    exports.time = time2;
    exports.datetime = datetime2;
    exports.cuid = /^[cC][^\s-]{8,}$/;
    exports.cuid2 = /^[0-9a-z]+$/;
    exports.ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
    exports.xid = /^[0-9a-vA-V]{20}$/;
    exports.ksuid = /^[A-Za-z0-9]{27}$/;
    exports.nanoid = /^[a-zA-Z0-9_-]{21}$/;
    exports.duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
    exports.extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    exports.guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    const uuid2 = (version2) => {
      if (!version2)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
      return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
    };
    exports.uuid = uuid2;
    exports.uuid4 = (0, exports.uuid)(4);
    exports.uuid6 = (0, exports.uuid)(6);
    exports.uuid7 = (0, exports.uuid)(7);
    exports.email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    exports.html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    exports.rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    exports.unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
    exports.idnEmail = exports.unicodeEmail;
    exports.browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const _emoji2 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    function emoji2() {
      return new RegExp(_emoji2, "u");
    }
    exports.ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    exports.ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    exports.cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
    exports.cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    exports.base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
    exports.base64url = /^[A-Za-z0-9_-]*$/;
    exports.hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
    exports.domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    exports.e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
    const dateSource2 = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
    exports.date = new RegExp(`^${dateSource2}$`);
    function timeSource2(args) {
      const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
      const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
      return regex;
    }
    function time2(args) {
      return new RegExp(`^${timeSource2(args)}$`);
    }
    function datetime2(args) {
      const time3 = timeSource2({ precision: args.precision });
      const opts = ["Z"];
      if (args.local)
        opts.push("");
      if (args.offset)
        opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
      const timeRegex = `${time3}(?:${opts.join("|")})`;
      return new RegExp(`^${dateSource2}T(?:${timeRegex})$`);
    }
    const string2 = (params) => {
      const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
      return new RegExp(`^${regex}$`);
    };
    exports.string = string2;
    exports.bigint = /^-?\d+n?$/;
    exports.integer = /^-?\d+$/;
    exports.number = /^-?\d+(?:\.\d+)?/;
    exports.boolean = /^(?:true|false)$/i;
    const _null2 = /^null$/i;
    exports.null = _null2;
    const _undefined2 = /^undefined$/i;
    exports.undefined = _undefined2;
    exports.lowercase = /^[^A-Z]*$/;
    exports.uppercase = /^[^a-z]*$/;
    exports.hex = /^[0-9a-fA-F]*$/;
    function fixedBase642(bodyLength, padding) {
      return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
    }
    function fixedBase64url2(length) {
      return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
    }
    exports.md5_hex = /^[0-9a-fA-F]{32}$/;
    exports.md5_base64 = fixedBase642(22, "==");
    exports.md5_base64url = fixedBase64url2(22);
    exports.sha1_hex = /^[0-9a-fA-F]{40}$/;
    exports.sha1_base64 = fixedBase642(27, "=");
    exports.sha1_base64url = fixedBase64url2(27);
    exports.sha256_hex = /^[0-9a-fA-F]{64}$/;
    exports.sha256_base64 = fixedBase642(43, "=");
    exports.sha256_base64url = fixedBase64url2(43);
    exports.sha384_hex = /^[0-9a-fA-F]{96}$/;
    exports.sha384_base64 = fixedBase642(64, "");
    exports.sha384_base64url = fixedBase64url2(64);
    exports.sha512_hex = /^[0-9a-fA-F]{128}$/;
    exports.sha512_base64 = fixedBase642(86, "==");
    exports.sha512_base64url = fixedBase64url2(86);
  })(regexes);
  return regexes;
}
var hasRequiredChecks$1;
function requireChecks$1() {
  if (hasRequiredChecks$1) return checks$1;
  hasRequiredChecks$1 = 1;
  (function(exports) {
    var __createBinding = checks$1 && checks$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = checks$1 && checks$1.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = checks$1 && checks$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ZodCheckOverwrite = exports.$ZodCheckMimeType = exports.$ZodCheckProperty = exports.$ZodCheckEndsWith = exports.$ZodCheckStartsWith = exports.$ZodCheckIncludes = exports.$ZodCheckUpperCase = exports.$ZodCheckLowerCase = exports.$ZodCheckRegex = exports.$ZodCheckStringFormat = exports.$ZodCheckLengthEquals = exports.$ZodCheckMinLength = exports.$ZodCheckMaxLength = exports.$ZodCheckSizeEquals = exports.$ZodCheckMinSize = exports.$ZodCheckMaxSize = exports.$ZodCheckBigIntFormat = exports.$ZodCheckNumberFormat = exports.$ZodCheckMultipleOf = exports.$ZodCheckGreaterThan = exports.$ZodCheckLessThan = exports.$ZodCheck = void 0;
    const core2 = __importStar(requireCore$1());
    const regexes2 = __importStar(requireRegexes());
    const util2 = __importStar(requireUtil());
    exports.$ZodCheck = core2.$constructor("$ZodCheck", (inst, def) => {
      var _a2;
      inst._zod ?? (inst._zod = {});
      inst._zod.def = def;
      (_a2 = inst._zod).onattach ?? (_a2.onattach = []);
    });
    const numericOriginMap2 = {
      number: "number",
      bigint: "bigint",
      object: "date"
    };
    exports.$ZodCheckLessThan = core2.$constructor("$ZodCheckLessThan", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const origin = numericOriginMap2[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
          if (def.inclusive)
            bag.maximum = def.value;
          else
            bag.exclusiveMaximum = def.value;
        }
      });
      inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
          return;
        }
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: def.value,
          input: payload.value,
          inclusive: def.inclusive,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckGreaterThan = core2.$constructor("$ZodCheckGreaterThan", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const origin = numericOriginMap2[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
          if (def.inclusive)
            bag.minimum = def.value;
          else
            bag.exclusiveMinimum = def.value;
        }
      });
      inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
          return;
        }
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: def.value,
          input: payload.value,
          inclusive: def.inclusive,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMultipleOf = /* @__PURE__ */ core2.$constructor("$ZodCheckMultipleOf", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        var _a2;
        (_a2 = inst2._zod.bag).multipleOf ?? (_a2.multipleOf = def.value);
      });
      inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
          throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : util2.floatSafeRemainder(payload.value, def.value) === 0;
        if (isMultiple)
          return;
        payload.issues.push({
          origin: typeof payload.value,
          code: "not_multiple_of",
          divisor: def.value,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckNumberFormat = core2.$constructor("$ZodCheckNumberFormat", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      def.format = def.format || "float64";
      const isInt = def.format?.includes("int");
      const origin = isInt ? "int" : "number";
      const [minimum, maximum] = util2.NUMBER_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
          bag.pattern = regexes2.integer;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
          if (!Number.isInteger(input)) {
            payload.issues.push({
              expected: origin,
              format: def.format,
              code: "invalid_type",
              continue: false,
              input,
              inst
            });
            return;
          }
          if (!Number.isSafeInteger(input)) {
            if (input > 0) {
              payload.issues.push({
                input,
                code: "too_big",
                maximum: Number.MAX_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst,
                origin,
                continue: !def.abort
              });
            } else {
              payload.issues.push({
                input,
                code: "too_small",
                minimum: Number.MIN_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst,
                origin,
                continue: !def.abort
              });
            }
            return;
          }
        }
        if (input < minimum) {
          payload.issues.push({
            origin: "number",
            input,
            code: "too_small",
            minimum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
        if (input > maximum) {
          payload.issues.push({
            origin: "number",
            input,
            code: "too_big",
            maximum,
            inst
          });
        }
      };
    });
    exports.$ZodCheckBigIntFormat = core2.$constructor("$ZodCheckBigIntFormat", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const [minimum, maximum] = util2.BIGINT_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        if (input < minimum) {
          payload.issues.push({
            origin: "bigint",
            input,
            code: "too_small",
            minimum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
        if (input > maximum) {
          payload.issues.push({
            origin: "bigint",
            input,
            code: "too_big",
            maximum,
            inst
          });
        }
      };
    });
    exports.$ZodCheckMaxSize = core2.$constructor("$ZodCheckMaxSize", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr)
          inst2._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum)
          return;
        payload.issues.push({
          origin: util2.getSizableOrigin(input),
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMinSize = core2.$constructor("$ZodCheckMinSize", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr)
          inst2._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum)
          return;
        payload.issues.push({
          origin: util2.getSizableOrigin(input),
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckSizeEquals = core2.$constructor("$ZodCheckSizeEquals", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size === def.size)
          return;
        const tooBig = size > def.size;
        payload.issues.push({
          origin: util2.getSizableOrigin(input),
          ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMaxLength = core2.$constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr)
          inst2._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
          return;
        const origin = util2.getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMinLength = core2.$constructor("$ZodCheckMinLength", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr)
          inst2._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
          return;
        const origin = util2.getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckLengthEquals = core2.$constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a2;
      exports.$ZodCheck.init(inst, def);
      (_a2 = inst._zod.def).when ?? (_a2.when = (payload) => {
        const val = payload.value;
        return !util2.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
          return;
        const origin = util2.getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
          origin,
          ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckStringFormat = core2.$constructor("$ZodCheckStringFormat", (inst, def) => {
      var _a2, _b;
      exports.$ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
          bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
          bag.patterns.add(def.pattern);
        }
      });
      if (def.pattern)
        (_a2 = inst._zod).check ?? (_a2.check = (payload) => {
          def.pattern.lastIndex = 0;
          if (def.pattern.test(payload.value))
            return;
          payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            ...def.pattern ? { pattern: def.pattern.toString() } : {},
            inst,
            continue: !def.abort
          });
        });
      else
        (_b = inst._zod).check ?? (_b.check = () => {
        });
    });
    exports.$ZodCheckRegex = core2.$constructor("$ZodCheckRegex", (inst, def) => {
      exports.$ZodCheckStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "regex",
          input: payload.value,
          pattern: def.pattern.toString(),
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckLowerCase = core2.$constructor("$ZodCheckLowerCase", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.lowercase);
      exports.$ZodCheckStringFormat.init(inst, def);
    });
    exports.$ZodCheckUpperCase = core2.$constructor("$ZodCheckUpperCase", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.uppercase);
      exports.$ZodCheckStringFormat.init(inst, def);
    });
    exports.$ZodCheckIncludes = core2.$constructor("$ZodCheckIncludes", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const escapedRegex = util2.escapeRegex(def.includes);
      const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
      def.pattern = pattern;
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "includes",
          includes: def.includes,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckStartsWith = core2.$constructor("$ZodCheckStartsWith", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const pattern = new RegExp(`^${util2.escapeRegex(def.prefix)}.*`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "starts_with",
          prefix: def.prefix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckEndsWith = core2.$constructor("$ZodCheckEndsWith", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const pattern = new RegExp(`.*${util2.escapeRegex(def.suffix)}$`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "ends_with",
          suffix: def.suffix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    function handleCheckPropertyResult2(result, payload, property) {
      if (result.issues.length) {
        payload.issues.push(...util2.prefixIssues(property, result.issues));
      }
    }
    exports.$ZodCheckProperty = core2.$constructor("$ZodCheckProperty", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        const result = def.schema._zod.run({
          value: payload.value[def.property],
          issues: []
        }, {});
        if (result instanceof Promise) {
          return result.then((result2) => handleCheckPropertyResult2(result2, payload, def.property));
        }
        handleCheckPropertyResult2(result, payload, def.property);
        return;
      };
    });
    exports.$ZodCheckMimeType = core2.$constructor("$ZodCheckMimeType", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const mimeSet = new Set(def.mime);
      inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.mime = def.mime;
      });
      inst._zod.check = (payload) => {
        if (mimeSet.has(payload.value.type))
          return;
        payload.issues.push({
          code: "invalid_value",
          values: def.mime,
          input: payload.value.type,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckOverwrite = core2.$constructor("$ZodCheckOverwrite", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
      };
    });
  })(checks$1);
  return checks$1;
}
var doc = {};
var hasRequiredDoc;
function requireDoc() {
  if (hasRequiredDoc) return doc;
  hasRequiredDoc = 1;
  Object.defineProperty(doc, "__esModule", { value: true });
  doc.Doc = void 0;
  class Doc2 {
    constructor(args = []) {
      this.content = [];
      this.indent = 0;
      if (this)
        this.args = args;
    }
    indented(fn) {
      this.indent += 1;
      fn(this);
      this.indent -= 1;
    }
    write(arg) {
      if (typeof arg === "function") {
        arg(this, { execution: "sync" });
        arg(this, { execution: "async" });
        return;
      }
      const content = arg;
      const lines = content.split("\n").filter((x) => x);
      const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
      const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
      for (const line of dedented) {
        this.content.push(line);
      }
    }
    compile() {
      const F = Function;
      const args = this?.args;
      const content = this?.content ?? [``];
      const lines = [...content.map((x) => `  ${x}`)];
      return new F(...args, lines.join("\n"));
    }
  }
  doc.Doc = Doc2;
  return doc;
}
var versions = {};
var hasRequiredVersions;
function requireVersions() {
  if (hasRequiredVersions) return versions;
  hasRequiredVersions = 1;
  Object.defineProperty(versions, "__esModule", { value: true });
  versions.version = void 0;
  versions.version = {
    major: 4,
    minor: 1,
    patch: 11
  };
  return versions;
}
var hasRequiredSchemas$1;
function requireSchemas$1() {
  if (hasRequiredSchemas$1) return schemas$1;
  hasRequiredSchemas$1 = 1;
  (function(exports) {
    var __createBinding = schemas$1 && schemas$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = schemas$1 && schemas$1.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = schemas$1 && schemas$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ZodMap = exports.$ZodRecord = exports.$ZodTuple = exports.$ZodIntersection = exports.$ZodDiscriminatedUnion = exports.$ZodUnion = exports.$ZodObjectJIT = exports.$ZodObject = exports.$ZodArray = exports.$ZodDate = exports.$ZodVoid = exports.$ZodNever = exports.$ZodUnknown = exports.$ZodAny = exports.$ZodNull = exports.$ZodUndefined = exports.$ZodSymbol = exports.$ZodBigIntFormat = exports.$ZodBigInt = exports.$ZodBoolean = exports.$ZodNumberFormat = exports.$ZodNumber = exports.$ZodCustomStringFormat = exports.$ZodJWT = exports.$ZodE164 = exports.$ZodBase64URL = exports.$ZodBase64 = exports.$ZodCIDRv6 = exports.$ZodCIDRv4 = exports.$ZodIPv6 = exports.$ZodIPv4 = exports.$ZodISODuration = exports.$ZodISOTime = exports.$ZodISODate = exports.$ZodISODateTime = exports.$ZodKSUID = exports.$ZodXID = exports.$ZodULID = exports.$ZodCUID2 = exports.$ZodCUID = exports.$ZodNanoID = exports.$ZodEmoji = exports.$ZodURL = exports.$ZodEmail = exports.$ZodUUID = exports.$ZodGUID = exports.$ZodStringFormat = exports.$ZodString = exports.clone = exports.$ZodType = void 0;
    exports.$ZodCustom = exports.$ZodLazy = exports.$ZodPromise = exports.$ZodFunction = exports.$ZodTemplateLiteral = exports.$ZodReadonly = exports.$ZodCodec = exports.$ZodPipe = exports.$ZodNaN = exports.$ZodCatch = exports.$ZodSuccess = exports.$ZodNonOptional = exports.$ZodPrefault = exports.$ZodDefault = exports.$ZodNullable = exports.$ZodOptional = exports.$ZodTransform = exports.$ZodFile = exports.$ZodLiteral = exports.$ZodEnum = exports.$ZodSet = void 0;
    exports.isValidBase64 = isValidBase642;
    exports.isValidBase64URL = isValidBase64URL2;
    exports.isValidJWT = isValidJWT2;
    const checks2 = __importStar(requireChecks$1());
    const core2 = __importStar(requireCore$1());
    const doc_js_1 = requireDoc();
    const parse_js_1 = requireParse$1();
    const regexes2 = __importStar(requireRegexes());
    const util2 = __importStar(requireUtil());
    const versions_js_1 = requireVersions();
    exports.$ZodType = core2.$constructor("$ZodType", (inst, def) => {
      var _a2;
      inst ?? (inst = {});
      inst._zod.def = def;
      inst._zod.bag = inst._zod.bag || {};
      inst._zod.version = versions_js_1.version;
      const checks3 = [...inst._zod.def.checks ?? []];
      if (inst._zod.traits.has("$ZodCheck")) {
        checks3.unshift(inst);
      }
      for (const ch of checks3) {
        for (const fn of ch._zod.onattach) {
          fn(inst);
        }
      }
      if (checks3.length === 0) {
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        inst._zod.deferred?.push(() => {
          inst._zod.run = inst._zod.parse;
        });
      } else {
        const runChecks = (payload, checks4, ctx) => {
          let isAborted = util2.aborted(payload);
          let asyncResult;
          for (const ch of checks4) {
            if (ch._zod.def.when) {
              const shouldRun = ch._zod.def.when(payload);
              if (!shouldRun)
                continue;
            } else if (isAborted) {
              continue;
            }
            const currLen = payload.issues.length;
            const _ = ch._zod.check(payload);
            if (_ instanceof Promise && ctx?.async === false) {
              throw new core2.$ZodAsyncError();
            }
            if (asyncResult || _ instanceof Promise) {
              asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                await _;
                const nextLen = payload.issues.length;
                if (nextLen === currLen)
                  return;
                if (!isAborted)
                  isAborted = util2.aborted(payload, currLen);
              });
            } else {
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                continue;
              if (!isAborted)
                isAborted = util2.aborted(payload, currLen);
            }
          }
          if (asyncResult) {
            return asyncResult.then(() => {
              return payload;
            });
          }
          return payload;
        };
        const handleCanaryResult = (canary, payload, ctx) => {
          if (util2.aborted(canary)) {
            canary.aborted = true;
            return canary;
          }
          const checkResult = runChecks(payload, checks3, ctx);
          if (checkResult instanceof Promise) {
            if (ctx.async === false)
              throw new core2.$ZodAsyncError();
            return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
          }
          return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
          if (ctx.skipChecks) {
            return inst._zod.parse(payload, ctx);
          }
          if (ctx.direction === "backward") {
            const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
            if (canary instanceof Promise) {
              return canary.then((canary2) => {
                return handleCanaryResult(canary2, payload, ctx);
              });
            }
            return handleCanaryResult(canary, payload, ctx);
          }
          const result = inst._zod.parse(payload, ctx);
          if (result instanceof Promise) {
            if (ctx.async === false)
              throw new core2.$ZodAsyncError();
            return result.then((result2) => runChecks(result2, checks3, ctx));
          }
          return runChecks(result, checks3, ctx);
        };
      }
      inst["~standard"] = {
        validate: (value) => {
          try {
            const r = (0, parse_js_1.safeParse)(inst, value);
            return r.success ? { value: r.data } : { issues: r.error?.issues };
          } catch (_) {
            return (0, parse_js_1.safeParseAsync)(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
          }
        },
        vendor: "zod",
        version: 1
      };
    });
    var util_js_1 = requireUtil();
    Object.defineProperty(exports, "clone", { enumerable: true, get: function() {
      return util_js_1.clone;
    } });
    exports.$ZodString = core2.$constructor("$ZodString", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? regexes2.string(inst._zod.bag);
      inst._zod.parse = (payload, _) => {
        if (def.coerce)
          try {
            payload.value = String(payload.value);
          } catch (_2) {
          }
        if (typeof payload.value === "string")
          return payload;
        payload.issues.push({
          expected: "string",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodStringFormat = core2.$constructor("$ZodStringFormat", (inst, def) => {
      checks2.$ZodCheckStringFormat.init(inst, def);
      exports.$ZodString.init(inst, def);
    });
    exports.$ZodGUID = core2.$constructor("$ZodGUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.guid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodUUID = core2.$constructor("$ZodUUID", (inst, def) => {
      if (def.version) {
        const versionMap = {
          v1: 1,
          v2: 2,
          v3: 3,
          v4: 4,
          v5: 5,
          v6: 6,
          v7: 7,
          v8: 8
        };
        const v = versionMap[def.version];
        if (v === void 0)
          throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = regexes2.uuid(v));
      } else
        def.pattern ?? (def.pattern = regexes2.uuid());
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodEmail = core2.$constructor("$ZodEmail", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.email);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodURL = core2.$constructor("$ZodURL", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        try {
          const trimmed = payload.value.trim();
          const url2 = new URL(trimmed);
          if (def.hostname) {
            def.hostname.lastIndex = 0;
            if (!def.hostname.test(url2.hostname)) {
              payload.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid hostname",
                pattern: regexes2.hostname.source,
                input: payload.value,
                inst,
                continue: !def.abort
              });
            }
          }
          if (def.protocol) {
            def.protocol.lastIndex = 0;
            if (!def.protocol.test(url2.protocol.endsWith(":") ? url2.protocol.slice(0, -1) : url2.protocol)) {
              payload.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid protocol",
                pattern: def.protocol.source,
                input: payload.value,
                inst,
                continue: !def.abort
              });
            }
          }
          if (def.normalize) {
            payload.value = url2.href;
          } else {
            payload.value = trimmed;
          }
          return;
        } catch (_) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodEmoji = core2.$constructor("$ZodEmoji", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.emoji());
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodNanoID = core2.$constructor("$ZodNanoID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.nanoid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCUID = core2.$constructor("$ZodCUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.cuid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCUID2 = core2.$constructor("$ZodCUID2", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.cuid2);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodULID = core2.$constructor("$ZodULID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.ulid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodXID = core2.$constructor("$ZodXID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.xid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodKSUID = core2.$constructor("$ZodKSUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.ksuid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODateTime = core2.$constructor("$ZodISODateTime", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.datetime(def));
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODate = core2.$constructor("$ZodISODate", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.date);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISOTime = core2.$constructor("$ZodISOTime", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.time(def));
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODuration = core2.$constructor("$ZodISODuration", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.duration);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodIPv4 = core2.$constructor("$ZodIPv4", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.ipv4);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = `ipv4`;
      });
    });
    exports.$ZodIPv6 = core2.$constructor("$ZodIPv6", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.ipv6);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = `ipv6`;
      });
      inst._zod.check = (payload) => {
        try {
          new URL(`http://[${payload.value}]`);
        } catch {
          payload.issues.push({
            code: "invalid_format",
            format: "ipv6",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodCIDRv4 = core2.$constructor("$ZodCIDRv4", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.cidrv4);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCIDRv6 = core2.$constructor("$ZodCIDRv6", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.cidrv6);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        const parts = payload.value.split("/");
        try {
          if (parts.length !== 2)
            throw new Error();
          const [address, prefix] = parts;
          if (!prefix)
            throw new Error();
          const prefixNum = Number(prefix);
          if (`${prefixNum}` !== prefix)
            throw new Error();
          if (prefixNum < 0 || prefixNum > 128)
            throw new Error();
          new URL(`http://[${address}]`);
        } catch {
          payload.issues.push({
            code: "invalid_format",
            format: "cidrv6",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    function isValidBase642(data) {
      if (data === "")
        return true;
      if (data.length % 4 !== 0)
        return false;
      try {
        atob(data);
        return true;
      } catch {
        return false;
      }
    }
    exports.$ZodBase64 = core2.$constructor("$ZodBase64", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.base64);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.contentEncoding = "base64";
      });
      inst._zod.check = (payload) => {
        if (isValidBase642(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    function isValidBase64URL2(data) {
      if (!regexes2.base64url.test(data))
        return false;
      const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
      const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
      return isValidBase642(padded);
    }
    exports.$ZodBase64URL = core2.$constructor("$ZodBase64URL", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.base64url);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.contentEncoding = "base64url";
      });
      inst._zod.check = (payload) => {
        if (isValidBase64URL2(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodE164 = core2.$constructor("$ZodE164", (inst, def) => {
      def.pattern ?? (def.pattern = regexes2.e164);
      exports.$ZodStringFormat.init(inst, def);
    });
    function isValidJWT2(token, algorithm = null) {
      try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
          return false;
        const [header] = tokensParts;
        if (!header)
          return false;
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
          return false;
        if (!parsedHeader.alg)
          return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
          return false;
        return true;
      } catch {
        return false;
      }
    }
    exports.$ZodJWT = core2.$constructor("$ZodJWT", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (isValidJWT2(payload.value, def.alg))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "jwt",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCustomStringFormat = core2.$constructor("$ZodCustomStringFormat", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (def.fn(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodNumber = core2.$constructor("$ZodNumber", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = inst._zod.bag.pattern ?? regexes2.number;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = Number(payload.value);
          } catch (_) {
          }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
          return payload;
        }
        const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
        payload.issues.push({
          expected: "number",
          code: "invalid_type",
          input,
          inst,
          ...received ? { received } : {}
        });
        return payload;
      };
    });
    exports.$ZodNumberFormat = core2.$constructor("$ZodNumber", (inst, def) => {
      checks2.$ZodCheckNumberFormat.init(inst, def);
      exports.$ZodNumber.init(inst, def);
    });
    exports.$ZodBoolean = core2.$constructor("$ZodBoolean", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes2.boolean;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = Boolean(payload.value);
          } catch (_) {
          }
        const input = payload.value;
        if (typeof input === "boolean")
          return payload;
        payload.issues.push({
          expected: "boolean",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodBigInt = core2.$constructor("$ZodBigInt", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes2.bigint;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = BigInt(payload.value);
          } catch (_) {
          }
        if (typeof payload.value === "bigint")
          return payload;
        payload.issues.push({
          expected: "bigint",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodBigIntFormat = core2.$constructor("$ZodBigInt", (inst, def) => {
      checks2.$ZodCheckBigIntFormat.init(inst, def);
      exports.$ZodBigInt.init(inst, def);
    });
    exports.$ZodSymbol = core2.$constructor("$ZodSymbol", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "symbol")
          return payload;
        payload.issues.push({
          expected: "symbol",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodUndefined = core2.$constructor("$ZodUndefined", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes2.undefined;
      inst._zod.values = /* @__PURE__ */ new Set([void 0]);
      inst._zod.optin = "optional";
      inst._zod.optout = "optional";
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
          return payload;
        payload.issues.push({
          expected: "undefined",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodNull = core2.$constructor("$ZodNull", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes2.null;
      inst._zod.values = /* @__PURE__ */ new Set([null]);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
          return payload;
        payload.issues.push({
          expected: "null",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodAny = core2.$constructor("$ZodAny", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
    });
    exports.$ZodUnknown = core2.$constructor("$ZodUnknown", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
    });
    exports.$ZodNever = core2.$constructor("$ZodNever", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
          expected: "never",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodVoid = core2.$constructor("$ZodVoid", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
          return payload;
        payload.issues.push({
          expected: "void",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodDate = core2.$constructor("$ZodDate", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) {
          try {
            payload.value = new Date(payload.value);
          } catch (_err) {
          }
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate)
          return payload;
        payload.issues.push({
          expected: "date",
          code: "invalid_type",
          input,
          ...isDate ? { received: "Invalid Date" } : {},
          inst
        });
        return payload;
      };
    });
    function handleArrayResult2(result, final, index) {
      if (result.issues.length) {
        final.issues.push(...util2.prefixIssues(index, result.issues));
      }
      final.value[index] = result.value;
    }
    exports.$ZodArray = core2.$constructor("$ZodArray", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            expected: "array",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
          const item = input[i];
          const result = def.element._zod.run({
            value: item,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleArrayResult2(result2, payload, i)));
          } else {
            handleArrayResult2(result, payload, i);
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => payload);
        }
        return payload;
      };
    });
    function handlePropertyResult2(result, final, key, input) {
      if (result.issues.length) {
        final.issues.push(...util2.prefixIssues(key, result.issues));
      }
      if (result.value === void 0) {
        if (key in input) {
          final.value[key] = void 0;
        }
      } else {
        final.value[key] = result.value;
      }
    }
    function normalizeDef2(def) {
      const keys = Object.keys(def.shape);
      for (const k of keys) {
        if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
          throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
        }
      }
      const okeys = util2.optionalKeys(def.shape);
      return {
        ...def,
        keys,
        keySet: new Set(keys),
        numKeys: keys.length,
        optionalKeys: new Set(okeys)
      };
    }
    function handleCatchall2(proms, input, payload, ctx, def, inst) {
      const unrecognized = [];
      const keySet = def.keySet;
      const _catchall = def.catchall._zod;
      const t = _catchall.def.type;
      for (const key of Object.keys(input)) {
        if (keySet.has(key))
          continue;
        if (t === "never") {
          unrecognized.push(key);
          continue;
        }
        const r = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise) {
          proms.push(r.then((r2) => handlePropertyResult2(r2, payload, key, input)));
        } else {
          handlePropertyResult2(r, payload, key, input);
        }
      }
      if (unrecognized.length) {
        payload.issues.push({
          code: "unrecognized_keys",
          keys: unrecognized,
          input,
          inst
        });
      }
      if (!proms.length)
        return payload;
      return Promise.all(proms).then(() => {
        return payload;
      });
    }
    exports.$ZodObject = core2.$constructor("$ZodObject", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const desc = Object.getOwnPropertyDescriptor(def, "shape");
      if (!desc?.get) {
        const sh = def.shape;
        Object.defineProperty(def, "shape", {
          get: () => {
            const newSh = { ...sh };
            Object.defineProperty(def, "shape", {
              value: newSh
            });
            return newSh;
          }
        });
      }
      const _normalized = util2.cached(() => normalizeDef2(def));
      util2.defineLazy(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
          const field = shape[key]._zod;
          if (field.values) {
            propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
            for (const v of field.values)
              propValues[key].add(v);
          }
        }
        return propValues;
      });
      const isObject2 = util2.isObject;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject2(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = {};
        const proms = [];
        const shape = value.shape;
        for (const key of value.keys) {
          const el = shape[key];
          const r = el._zod.run({ value: input[key], issues: [] }, ctx);
          if (r instanceof Promise) {
            proms.push(r.then((r2) => handlePropertyResult2(r2, payload, key, input)));
          } else {
            handlePropertyResult2(r, payload, key, input);
          }
        }
        if (!catchall) {
          return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        return handleCatchall2(proms, input, payload, ctx, _normalized.value, inst);
      };
    });
    exports.$ZodObjectJIT = core2.$constructor("$ZodObjectJIT", (inst, def) => {
      exports.$ZodObject.init(inst, def);
      const superParse = inst._zod.parse;
      const _normalized = util2.cached(() => normalizeDef2(def));
      const generateFastpass = (shape) => {
        const doc2 = new doc_js_1.Doc(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
          const k = util2.esc(key);
          return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc2.write(`const input = payload.value;`);
        const ids = /* @__PURE__ */ Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
          ids[key] = `key_${counter++}`;
        }
        doc2.write(`const newResult = {};`);
        for (const key of normalized.keys) {
          const id2 = ids[key];
          const k = util2.esc(key);
          doc2.write(`const ${id2} = ${parseStr(key)};`);
          doc2.write(`
        if (${id2}.issues.length) {
          payload.issues = payload.issues.concat(${id2}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        
        if (${id2}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id2}.value;
        }
        
      `);
        }
        doc2.write(`payload.value = newResult;`);
        doc2.write(`return payload;`);
        const fn = doc2.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
      };
      let fastpass;
      const isObject2 = util2.isObject;
      const jit = !core2.globalConfig.jitless;
      const allowsEval2 = util2.allowsEval;
      const fastEnabled = jit && allowsEval2.value;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject2(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
          if (!fastpass)
            fastpass = generateFastpass(def.shape);
          payload = fastpass(payload, ctx);
          if (!catchall)
            return payload;
          return handleCatchall2([], input, payload, ctx, value, inst);
        }
        return superParse(payload, ctx);
      };
    });
    function handleUnionResults2(results, final, inst, ctx) {
      for (const result of results) {
        if (result.issues.length === 0) {
          final.value = result.value;
          return final;
        }
      }
      const nonaborted = results.filter((r) => !util2.aborted(r));
      if (nonaborted.length === 1) {
        final.value = nonaborted[0].value;
        return nonaborted[0];
      }
      final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) => result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())))
      });
      return final;
    }
    exports.$ZodUnion = core2.$constructor("$ZodUnion", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
      util2.defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
      util2.defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
          return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return void 0;
      });
      util2.defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
          const patterns = def.options.map((o) => o._zod.pattern);
          return new RegExp(`^(${patterns.map((p) => util2.cleanRegex(p.source)).join("|")})$`);
        }
        return void 0;
      });
      const single = def.options.length === 1;
      const first = def.options[0]._zod.run;
      inst._zod.parse = (payload, ctx) => {
        if (single) {
          return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
          const result = option._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            results.push(result);
            async = true;
          } else {
            if (result.issues.length === 0)
              return result;
            results.push(result);
          }
        }
        if (!async)
          return handleUnionResults2(results, payload, inst, ctx);
        return Promise.all(results).then((results2) => {
          return handleUnionResults2(results2, payload, inst, ctx);
        });
      };
    });
    exports.$ZodDiscriminatedUnion = /* @__PURE__ */ core2.$constructor("$ZodDiscriminatedUnion", (inst, def) => {
      exports.$ZodUnion.init(inst, def);
      const _super = inst._zod.parse;
      util2.defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
          const pv = option._zod.propValues;
          if (!pv || Object.keys(pv).length === 0)
            throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
          for (const [k, v] of Object.entries(pv)) {
            if (!propValues[k])
              propValues[k] = /* @__PURE__ */ new Set();
            for (const val of v) {
              propValues[k].add(val);
            }
          }
        }
        return propValues;
      });
      const disc = util2.cached(() => {
        const opts = def.options;
        const map2 = /* @__PURE__ */ new Map();
        for (const o of opts) {
          const values = o._zod.propValues?.[def.discriminator];
          if (!values || values.size === 0)
            throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
          for (const v of values) {
            if (map2.has(v)) {
              throw new Error(`Duplicate discriminator value "${String(v)}"`);
            }
            map2.set(v, o);
          }
        }
        return map2;
      });
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!util2.isObject(input)) {
          payload.issues.push({
            code: "invalid_type",
            expected: "object",
            input,
            inst
          });
          return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
          return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback) {
          return _super(payload, ctx);
        }
        payload.issues.push({
          code: "invalid_union",
          errors: [],
          note: "No matching discriminator",
          discriminator: def.discriminator,
          input,
          path: [def.discriminator],
          inst
        });
        return payload;
      };
    });
    exports.$ZodIntersection = core2.$constructor("$ZodIntersection", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
          return Promise.all([left, right]).then(([left2, right2]) => {
            return handleIntersectionResults2(payload, left2, right2);
          });
        }
        return handleIntersectionResults2(payload, left, right);
      };
    });
    function mergeValues2(a, b) {
      if (a === b) {
        return { valid: true, data: a };
      }
      if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
      }
      if (util2.isPlainObject(a) && util2.isPlainObject(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
          const sharedValue = mergeValues2(a[key], b[key]);
          if (!sharedValue.valid) {
            return {
              valid: false,
              mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
            };
          }
          newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
          const itemA = a[index];
          const itemB = b[index];
          const sharedValue = mergeValues2(itemA, itemB);
          if (!sharedValue.valid) {
            return {
              valid: false,
              mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
            };
          }
          newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
      }
      return { valid: false, mergeErrorPath: [] };
    }
    function handleIntersectionResults2(result, left, right) {
      if (left.issues.length) {
        result.issues.push(...left.issues);
      }
      if (right.issues.length) {
        result.issues.push(...right.issues);
      }
      if (util2.aborted(result))
        return result;
      const merged = mergeValues2(left.value, right.value);
      if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
      }
      result.value = merged.data;
      return result;
    }
    exports.$ZodTuple = core2.$constructor("$ZodTuple", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const items = def.items;
      const optStart = items.length - [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            input,
            inst,
            expected: "tuple",
            code: "invalid_type"
          });
          return payload;
        }
        payload.value = [];
        const proms = [];
        if (!def.rest) {
          const tooBig = input.length > items.length;
          const tooSmall = input.length < optStart - 1;
          if (tooBig || tooSmall) {
            payload.issues.push({
              ...tooBig ? { code: "too_big", maximum: items.length } : { code: "too_small", minimum: items.length },
              input,
              inst,
              origin: "array"
            });
            return payload;
          }
        }
        let i = -1;
        for (const item of items) {
          i++;
          if (i >= input.length) {
            if (i >= optStart)
              continue;
          }
          const result = item._zod.run({
            value: input[i],
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleTupleResult2(result2, payload, i)));
          } else {
            handleTupleResult2(result, payload, i);
          }
        }
        if (def.rest) {
          const rest = input.slice(items.length);
          for (const el of rest) {
            i++;
            const result = def.rest._zod.run({
              value: el,
              issues: []
            }, ctx);
            if (result instanceof Promise) {
              proms.push(result.then((result2) => handleTupleResult2(result2, payload, i)));
            } else {
              handleTupleResult2(result, payload, i);
            }
          }
        }
        if (proms.length)
          return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    function handleTupleResult2(result, final, index) {
      if (result.issues.length) {
        final.issues.push(...util2.prefixIssues(index, result.issues));
      }
      final.value[index] = result.value;
    }
    exports.$ZodRecord = core2.$constructor("$ZodRecord", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!util2.isPlainObject(input)) {
          payload.issues.push({
            expected: "record",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        const proms = [];
        if (def.keyType._zod.values) {
          const values = def.keyType._zod.values;
          payload.value = {};
          for (const key of values) {
            if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
              const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
              if (result instanceof Promise) {
                proms.push(result.then((result2) => {
                  if (result2.issues.length) {
                    payload.issues.push(...util2.prefixIssues(key, result2.issues));
                  }
                  payload.value[key] = result2.value;
                }));
              } else {
                if (result.issues.length) {
                  payload.issues.push(...util2.prefixIssues(key, result.issues));
                }
                payload.value[key] = result.value;
              }
            }
          }
          let unrecognized;
          for (const key in input) {
            if (!values.has(key)) {
              unrecognized = unrecognized ?? [];
              unrecognized.push(key);
            }
          }
          if (unrecognized && unrecognized.length > 0) {
            payload.issues.push({
              code: "unrecognized_keys",
              input,
              inst,
              keys: unrecognized
            });
          }
        } else {
          payload.value = {};
          for (const key of Reflect.ownKeys(input)) {
            if (key === "__proto__")
              continue;
            const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            if (keyResult instanceof Promise) {
              throw new Error("Async schemas not supported in object keys currently");
            }
            if (keyResult.issues.length) {
              payload.issues.push({
                code: "invalid_key",
                origin: "record",
                issues: keyResult.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config())),
                input: key,
                path: [key],
                inst
              });
              payload.value[keyResult.value] = keyResult.value;
              continue;
            }
            const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result instanceof Promise) {
              proms.push(result.then((result2) => {
                if (result2.issues.length) {
                  payload.issues.push(...util2.prefixIssues(key, result2.issues));
                }
                payload.value[keyResult.value] = result2.value;
              }));
            } else {
              if (result.issues.length) {
                payload.issues.push(...util2.prefixIssues(key, result.issues));
              }
              payload.value[keyResult.value] = result.value;
            }
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => payload);
        }
        return payload;
      };
    });
    exports.$ZodMap = core2.$constructor("$ZodMap", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Map)) {
          payload.issues.push({
            expected: "map",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        const proms = [];
        payload.value = /* @__PURE__ */ new Map();
        for (const [key, value] of input) {
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          const valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
          if (keyResult instanceof Promise || valueResult instanceof Promise) {
            proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
              handleMapResult2(keyResult2, valueResult2, payload, key, input, inst, ctx);
            }));
          } else {
            handleMapResult2(keyResult, valueResult, payload, key, input, inst, ctx);
          }
        }
        if (proms.length)
          return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    function handleMapResult2(keyResult, valueResult, final, key, input, inst, ctx) {
      if (keyResult.issues.length) {
        if (util2.propertyKeyTypes.has(typeof key)) {
          final.issues.push(...util2.prefixIssues(key, keyResult.issues));
        } else {
          final.issues.push({
            code: "invalid_key",
            origin: "map",
            input,
            inst,
            issues: keyResult.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config()))
          });
        }
      }
      if (valueResult.issues.length) {
        if (util2.propertyKeyTypes.has(typeof key)) {
          final.issues.push(...util2.prefixIssues(key, valueResult.issues));
        } else {
          final.issues.push({
            origin: "map",
            code: "invalid_element",
            input,
            inst,
            key,
            issues: valueResult.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config()))
          });
        }
      }
      final.value.set(keyResult.value, valueResult.value);
    }
    exports.$ZodSet = core2.$constructor("$ZodSet", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Set)) {
          payload.issues.push({
            input,
            inst,
            expected: "set",
            code: "invalid_type"
          });
          return payload;
        }
        const proms = [];
        payload.value = /* @__PURE__ */ new Set();
        for (const item of input) {
          const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleSetResult2(result2, payload)));
          } else
            handleSetResult2(result, payload);
        }
        if (proms.length)
          return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    function handleSetResult2(result, final) {
      if (result.issues.length) {
        final.issues.push(...result.issues);
      }
      final.value.add(result.value);
    }
    exports.$ZodEnum = core2.$constructor("$ZodEnum", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const values = util2.getEnumValues(def.entries);
      const valuesSet = new Set(values);
      inst._zod.values = valuesSet;
      inst._zod.pattern = new RegExp(`^(${values.filter((k) => util2.propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? util2.escapeRegex(o) : o.toString()).join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) {
          return payload;
        }
        payload.issues.push({
          code: "invalid_value",
          values,
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodLiteral = core2.$constructor("$ZodLiteral", (inst, def) => {
      exports.$ZodType.init(inst, def);
      if (def.values.length === 0) {
        throw new Error("Cannot create literal schema with no valid values");
      }
      inst._zod.values = new Set(def.values);
      inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? util2.escapeRegex(o) : o ? util2.escapeRegex(o.toString()) : String(o)).join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
          return payload;
        }
        payload.issues.push({
          code: "invalid_value",
          values: def.values,
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodFile = core2.$constructor("$ZodFile", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input instanceof File)
          return payload;
        payload.issues.push({
          expected: "file",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodTransform = core2.$constructor("$ZodTransform", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          throw new core2.$ZodEncodeError(inst.constructor.name);
        }
        const _out = def.transform(payload.value, payload);
        if (ctx.async) {
          const output = _out instanceof Promise ? _out : Promise.resolve(_out);
          return output.then((output2) => {
            payload.value = output2;
            return payload;
          });
        }
        if (_out instanceof Promise) {
          throw new core2.$ZodAsyncError();
        }
        payload.value = _out;
        return payload;
      };
    });
    function handleOptionalResult2(result, input) {
      if (result.issues.length && input === void 0) {
        return { issues: [], value: void 0 };
      }
      return result;
    }
    exports.$ZodOptional = core2.$constructor("$ZodOptional", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.optout = "optional";
      util2.defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
      });
      util2.defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${util2.cleanRegex(pattern.source)})?$`) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise)
            return result.then((r) => handleOptionalResult2(r, payload.value));
          return handleOptionalResult2(result, payload.value);
        }
        if (payload.value === void 0) {
          return payload;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodNullable = core2.$constructor("$ZodNullable", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      util2.defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      util2.defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${util2.cleanRegex(pattern.source)}|null)$`) : void 0;
      });
      util2.defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (payload.value === null)
          return payload;
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodDefault = core2.$constructor("$ZodDefault", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      util2.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
          return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => handleDefaultResult2(result2, def));
        }
        return handleDefaultResult2(result, def);
      };
    });
    function handleDefaultResult2(payload, def) {
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
      }
      return payload;
    }
    exports.$ZodPrefault = core2.$constructor("$ZodPrefault", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      util2.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodNonOptional = core2.$constructor("$ZodNonOptional", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => handleNonOptionalResult2(result2, inst));
        }
        return handleNonOptionalResult2(result, inst);
      };
    });
    function handleNonOptionalResult2(payload, inst) {
      if (!payload.issues.length && payload.value === void 0) {
        payload.issues.push({
          code: "invalid_type",
          expected: "nonoptional",
          input: payload.value,
          inst
        });
      }
      return payload;
    }
    exports.$ZodSuccess = core2.$constructor("$ZodSuccess", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          throw new core2.$ZodEncodeError("ZodSuccess");
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => {
            payload.value = result2.issues.length === 0;
            return payload;
          });
        }
        payload.value = result.issues.length === 0;
        return payload;
      };
    });
    exports.$ZodCatch = core2.$constructor("$ZodCatch", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      util2.defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      util2.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => {
            payload.value = result2.value;
            if (result2.issues.length) {
              payload.value = def.catchValue({
                ...payload,
                error: {
                  issues: result2.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config()))
                },
                input: payload.value
              });
              payload.issues = [];
            }
            return payload;
          });
        }
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => util2.finalizeIssue(iss, ctx, core2.config()))
            },
            input: payload.value
          });
          payload.issues = [];
        }
        return payload;
      };
    });
    exports.$ZodNaN = core2.$constructor("$ZodNaN", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
          payload.issues.push({
            input: payload.value,
            inst,
            expected: "nan",
            code: "invalid_type"
          });
          return payload;
        }
        return payload;
      };
    });
    exports.$ZodPipe = core2.$constructor("$ZodPipe", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "values", () => def.in._zod.values);
      util2.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      util2.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      util2.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) {
            return right.then((right2) => handlePipeResult2(right2, def.in, ctx));
          }
          return handlePipeResult2(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
          return left.then((left2) => handlePipeResult2(left2, def.out, ctx));
        }
        return handlePipeResult2(left, def.out, ctx);
      };
    });
    function handlePipeResult2(left, next, ctx) {
      if (left.issues.length) {
        left.aborted = true;
        return left;
      }
      return next._zod.run({ value: left.value, issues: left.issues }, ctx);
    }
    exports.$ZodCodec = core2.$constructor("$ZodCodec", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "values", () => def.in._zod.values);
      util2.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      util2.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      util2.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        const direction = ctx.direction || "forward";
        if (direction === "forward") {
          const left = def.in._zod.run(payload, ctx);
          if (left instanceof Promise) {
            return left.then((left2) => handleCodecAResult2(left2, def, ctx));
          }
          return handleCodecAResult2(left, def, ctx);
        } else {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) {
            return right.then((right2) => handleCodecAResult2(right2, def, ctx));
          }
          return handleCodecAResult2(right, def, ctx);
        }
      };
    });
    function handleCodecAResult2(result, def, ctx) {
      if (result.issues.length) {
        result.aborted = true;
        return result;
      }
      const direction = ctx.direction || "forward";
      if (direction === "forward") {
        const transformed = def.transform(result.value, result);
        if (transformed instanceof Promise) {
          return transformed.then((value) => handleCodecTxResult2(result, value, def.out, ctx));
        }
        return handleCodecTxResult2(result, transformed, def.out, ctx);
      } else {
        const transformed = def.reverseTransform(result.value, result);
        if (transformed instanceof Promise) {
          return transformed.then((value) => handleCodecTxResult2(result, value, def.in, ctx));
        }
        return handleCodecTxResult2(result, transformed, def.in, ctx);
      }
    }
    function handleCodecTxResult2(left, value, nextSchema, ctx) {
      if (left.issues.length) {
        left.aborted = true;
        return left;
      }
      return nextSchema._zod.run({ value, issues: left.issues }, ctx);
    }
    exports.$ZodReadonly = core2.$constructor("$ZodReadonly", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
      util2.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      util2.defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      util2.defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then(handleReadonlyResult2);
        }
        return handleReadonlyResult2(result);
      };
    });
    function handleReadonlyResult2(payload) {
      payload.value = Object.freeze(payload.value);
      return payload;
    }
    exports.$ZodTemplateLiteral = core2.$constructor("$ZodTemplateLiteral", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const regexParts = [];
      for (const part of def.parts) {
        if (typeof part === "object" && part !== null) {
          if (!part._zod.pattern) {
            throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
          }
          const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
          if (!source)
            throw new Error(`Invalid template literal part: ${part._zod.traits}`);
          const start = source.startsWith("^") ? 1 : 0;
          const end = source.endsWith("$") ? source.length - 1 : source.length;
          regexParts.push(source.slice(start, end));
        } else if (part === null || util2.primitiveTypes.has(typeof part)) {
          regexParts.push(util2.escapeRegex(`${part}`));
        } else {
          throw new Error(`Invalid template literal part: ${part}`);
        }
      }
      inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "string") {
          payload.issues.push({
            input: payload.value,
            inst,
            expected: "template_literal",
            code: "invalid_type"
          });
          return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
          payload.issues.push({
            input: payload.value,
            inst,
            code: "invalid_format",
            format: def.format ?? "template_literal",
            pattern: inst._zod.pattern.source
          });
          return payload;
        }
        return payload;
      };
    });
    exports.$ZodFunction = core2.$constructor("$ZodFunction", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._def = def;
      inst._zod.def = def;
      inst.implement = (func) => {
        if (typeof func !== "function") {
          throw new Error("implement() must be called with a function");
        }
        return function(...args) {
          const parsedArgs = inst._def.input ? (0, parse_js_1.parse)(inst._def.input, args) : args;
          const result = Reflect.apply(func, this, parsedArgs);
          if (inst._def.output) {
            return (0, parse_js_1.parse)(inst._def.output, result);
          }
          return result;
        };
      };
      inst.implementAsync = (func) => {
        if (typeof func !== "function") {
          throw new Error("implementAsync() must be called with a function");
        }
        return async function(...args) {
          const parsedArgs = inst._def.input ? await (0, parse_js_1.parseAsync)(inst._def.input, args) : args;
          const result = await Reflect.apply(func, this, parsedArgs);
          if (inst._def.output) {
            return await (0, parse_js_1.parseAsync)(inst._def.output, result);
          }
          return result;
        };
      };
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "function") {
          payload.issues.push({
            code: "invalid_type",
            expected: "function",
            input: payload.value,
            inst
          });
          return payload;
        }
        const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
        if (hasPromiseOutput) {
          payload.value = inst.implementAsync(payload.value);
        } else {
          payload.value = inst.implement(payload.value);
        }
        return payload;
      };
      inst.input = (...args) => {
        const F = inst.constructor;
        if (Array.isArray(args[0])) {
          return new F({
            type: "function",
            input: new exports.$ZodTuple({
              type: "tuple",
              items: args[0],
              rest: args[1]
            }),
            output: inst._def.output
          });
        }
        return new F({
          type: "function",
          input: args[0],
          output: inst._def.output
        });
      };
      inst.output = (output) => {
        const F = inst.constructor;
        return new F({
          type: "function",
          input: inst._def.input,
          output
        });
      };
      return inst;
    });
    exports.$ZodPromise = core2.$constructor("$ZodPromise", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
      };
    });
    exports.$ZodLazy = core2.$constructor("$ZodLazy", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util2.defineLazy(inst._zod, "innerType", () => def.getter());
      util2.defineLazy(inst._zod, "pattern", () => inst._zod.innerType._zod.pattern);
      util2.defineLazy(inst._zod, "propValues", () => inst._zod.innerType._zod.propValues);
      util2.defineLazy(inst._zod, "optin", () => inst._zod.innerType._zod.optin ?? void 0);
      util2.defineLazy(inst._zod, "optout", () => inst._zod.innerType._zod.optout ?? void 0);
      inst._zod.parse = (payload, ctx) => {
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
      };
    });
    exports.$ZodCustom = core2.$constructor("$ZodCustom", (inst, def) => {
      checks2.$ZodCheck.init(inst, def);
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _) => {
        return payload;
      };
      inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
          return r.then((r2) => handleRefineResult2(r2, payload, input, inst));
        }
        handleRefineResult2(r, payload, input, inst);
        return;
      };
    });
    function handleRefineResult2(result, payload, input, inst) {
      if (!result) {
        const _iss = {
          code: "custom",
          input,
          inst,
          // incorporates params.error into issue reporting
          path: [...inst._zod.def.path ?? []],
          // incorporates params.error into issue reporting
          continue: !inst._zod.def.abort
          // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
          _iss.params = inst._zod.def.params;
        payload.issues.push(util2.issue(_iss));
      }
    }
  })(schemas$1);
  return schemas$1;
}
var locales = {};
var ar$1 = { exports: {} };
var ar = ar$1.exports;
var hasRequiredAr;
function requireAr() {
  if (hasRequiredAr) return ar$1.exports;
  hasRequiredAr = 1;
  (function(module, exports) {
    var __createBinding = ar && ar.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ar && ar.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ar && ar.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "حرف", verb: "أن يحوي" },
        file: { unit: "بايت", verb: "أن يحوي" },
        array: { unit: "عنصر", verb: "أن يحوي" },
        set: { unit: "عنصر", verb: "أن يحوي" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "مدخل",
        email: "بريد إلكتروني",
        url: "رابط",
        emoji: "إيموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاريخ ووقت بمعيار ISO",
        date: "تاريخ بمعيار ISO",
        time: "وقت بمعيار ISO",
        duration: "مدة بمعيار ISO",
        ipv4: "عنوان IPv4",
        ipv6: "عنوان IPv6",
        cidrv4: "مدى عناوين بصيغة IPv4",
        cidrv6: "مدى عناوين بصيغة IPv6",
        base64: "نَص بترميز base64-encoded",
        base64url: "نَص بترميز base64url-encoded",
        json_string: "نَص على هيئة JSON",
        e164: "رقم هاتف بمعيار E.164",
        jwt: "JWT",
        template_literal: "مدخل"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `مدخلات غير مقبولة: يفترض إدخال ${issue2.expected}، ولكن تم إدخال ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `مدخلات غير مقبولة: يفترض إدخال ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return ` أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
            return `أكبر من اللازم: يفترض أن تكون ${issue2.origin ?? "القيمة"} ${adj} ${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `أصغر من اللازم: يفترض لـ ${issue2.origin} أن يكون ${adj} ${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `نَص غير مقبول: يجب أن يبدأ بـ "${issue2.prefix}"`;
            if (_issue.format === "ends_with")
              return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} غير مقبول`;
          }
          case "not_multiple_of":
            return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue2.divisor}`;
          case "unrecognized_keys":
            return `معرف${issue2.keys.length > 1 ? "ات" : ""} غريب${issue2.keys.length > 1 ? "ة" : ""}: ${util2.joinValues(issue2.keys, "، ")}`;
          case "invalid_key":
            return `معرف غير مقبول في ${issue2.origin}`;
          case "invalid_union":
            return "مدخل غير مقبول";
          case "invalid_element":
            return `مدخل غير مقبول في ${issue2.origin}`;
          default:
            return "مدخل غير مقبول";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ar$1, ar$1.exports);
  return ar$1.exports;
}
var az$1 = { exports: {} };
var az = az$1.exports;
var hasRequiredAz;
function requireAz() {
  if (hasRequiredAz) return az$1.exports;
  hasRequiredAz = 1;
  (function(module, exports) {
    var __createBinding = az && az.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = az && az.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = az && az.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "simvol", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "element", verb: "olmalıdır" },
        set: { unit: "element", verb: "olmalıdır" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Yanlış dəyər: gözlənilən ${issue2.expected}, daxil olan ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Yanlış dəyər: gözlənilən ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
            return `Çox böyük: gözlənilən ${issue2.origin ?? "dəyər"} ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            return `Çox kiçik: gözlənilən ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
            if (_issue.format === "ends_with")
              return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
            if (_issue.format === "includes")
              return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
            if (_issue.format === "regex")
              return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
            return `Yanlış ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Yanlış ədəd: ${issue2.divisor} ilə bölünə bilən olmalıdır`;
          case "unrecognized_keys":
            return `Tanınmayan açar${issue2.keys.length > 1 ? "lar" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `${issue2.origin} daxilində yanlış açar`;
          case "invalid_union":
            return "Yanlış dəyər";
          case "invalid_element":
            return `${issue2.origin} daxilində yanlış dəyər`;
          default:
            return `Yanlış dəyər`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(az$1, az$1.exports);
  return az$1.exports;
}
var be$1 = { exports: {} };
var be = be$1.exports;
var hasRequiredBe;
function requireBe() {
  if (hasRequiredBe) return be$1.exports;
  hasRequiredBe = 1;
  (function(module, exports) {
    var __createBinding = be && be.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = be && be.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = be && be.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    function getBelarusianPlural(count, one, few, many) {
      const absCount = Math.abs(count);
      const lastDigit = absCount % 10;
      const lastTwoDigits = absCount % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
      }
      if (lastDigit === 1) {
        return one;
      }
      if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
      }
      return many;
    }
    const error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "сімвал",
            few: "сімвалы",
            many: "сімвалаў"
          },
          verb: "мець"
        },
        array: {
          unit: {
            one: "элемент",
            few: "элементы",
            many: "элементаў"
          },
          verb: "мець"
        },
        set: {
          unit: {
            one: "элемент",
            few: "элементы",
            many: "элементаў"
          },
          verb: "мець"
        },
        file: {
          unit: {
            one: "байт",
            few: "байты",
            many: "байтаў"
          },
          verb: "мець"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "лік";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "масіў";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "увод",
        email: "email адрас",
        url: "URL",
        emoji: "эмодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата і час",
        date: "ISO дата",
        time: "ISO час",
        duration: "ISO працягласць",
        ipv4: "IPv4 адрас",
        ipv6: "IPv6 адрас",
        cidrv4: "IPv4 дыяпазон",
        cidrv6: "IPv6 дыяпазон",
        base64: "радок у фармаце base64",
        base64url: "радок у фармаце base64url",
        json_string: "JSON радок",
        e164: "нумар E.164",
        jwt: "JWT",
        template_literal: "увод"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Няправільны ўвод: чакаўся ${issue2.expected}, атрымана ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Няправільны ўвод: чакалася ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Няправільны варыянт: чакаўся адзін з ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              const maxValue = Number(issue2.maximum);
              const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue2.maximum.toString()} ${unit}`;
            }
            return `Занадта вялікі: чакалася, што ${issue2.origin ?? "значэнне"} павінна быць ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              const minValue = Number(issue2.minimum);
              const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `Занадта малы: чакалася, што ${issue2.origin} павінна ${sizing.verb} ${adj}${issue2.minimum.toString()} ${unit}`;
            }
            return `Занадта малы: чакалася, што ${issue2.origin} павінна быць ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
            return `Няправільны ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Няправільны лік: павінен быць кратным ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Нераспазнаны ${issue2.keys.length > 1 ? "ключы" : "ключ"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Няправільны ключ у ${issue2.origin}`;
          case "invalid_union":
            return "Няправільны ўвод";
          case "invalid_element":
            return `Няправільнае значэнне ў ${issue2.origin}`;
          default:
            return `Няправільны ўвод`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(be$1, be$1.exports);
  return be$1.exports;
}
var ca$1 = { exports: {} };
var ca = ca$1.exports;
var hasRequiredCa;
function requireCa() {
  if (hasRequiredCa) return ca$1.exports;
  hasRequiredCa = 1;
  (function(module, exports) {
    var __createBinding = ca && ca.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ca && ca.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ca && ca.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caràcters", verb: "contenir" },
        file: { unit: "bytes", verb: "contenir" },
        array: { unit: "elements", verb: "contenir" },
        set: { unit: "elements", verb: "contenir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "entrada",
        email: "adreça electrònica",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "durada ISO",
        ipv4: "adreça IPv4",
        ipv6: "adreça IPv6",
        cidrv4: "rang IPv4",
        cidrv6: "rang IPv6",
        base64: "cadena codificada en base64",
        base64url: "cadena codificada en base64url",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Tipus invàlid: s'esperava ${issue2.expected}, s'ha rebut ${parsedType(issue2.input)}`;
          // return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Valor invàlid: s'esperava ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Opció invàlida: s'esperava una de ${util2.joinValues(issue2.values, " o ")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "com a màxim" : "menys de";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} contingués ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} fos ${adj} ${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? "com a mínim" : "més de";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Massa petit: s'esperava que ${issue2.origin} contingués ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Massa petit: s'esperava que ${issue2.origin} fos ${adj} ${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Format invàlid: ha d'incloure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
            return `Format invàlid per a ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Número invàlid: ha de ser múltiple de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Clau${issue2.keys.length > 1 ? "s" : ""} no reconeguda${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Clau invàlida a ${issue2.origin}`;
          case "invalid_union":
            return "Entrada invàlida";
          // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
          case "invalid_element":
            return `Element invàlid a ${issue2.origin}`;
          default:
            return `Entrada invàlida`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ca$1, ca$1.exports);
  return ca$1.exports;
}
var cs$1 = { exports: {} };
var cs = cs$1.exports;
var hasRequiredCs;
function requireCs() {
  if (hasRequiredCs) return cs$1.exports;
  hasRequiredCs = 1;
  (function(module, exports) {
    var __createBinding = cs && cs.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = cs && cs.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = cs && cs.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "znaků", verb: "mít" },
        file: { unit: "bajtů", verb: "mít" },
        array: { unit: "prvků", verb: "mít" },
        set: { unit: "prvků", verb: "mít" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "číslo";
          }
          case "string": {
            return "řetězec";
          }
          case "boolean": {
            return "boolean";
          }
          case "bigint": {
            return "bigint";
          }
          case "function": {
            return "funkce";
          }
          case "symbol": {
            return "symbol";
          }
          case "undefined": {
            return "undefined";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "pole";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "regulární výraz",
        email: "e-mailová adresa",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "datum a čas ve formátu ISO",
        date: "datum ve formátu ISO",
        time: "čas ve formátu ISO",
        duration: "doba trvání ISO",
        ipv4: "IPv4 adresa",
        ipv6: "IPv6 adresa",
        cidrv4: "rozsah IPv4",
        cidrv6: "rozsah IPv6",
        base64: "řetězec zakódovaný ve formátu base64",
        base64url: "řetězec zakódovaný ve formátu base64url",
        json_string: "řetězec ve formátu JSON",
        e164: "číslo E.164",
        jwt: "JWT",
        template_literal: "vstup"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Neplatný vstup: očekáváno ${issue2.expected}, obdrženo ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Neplatný vstup: očekáváno ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Neplatná možnost: očekávána jedna z hodnot ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "prvků"}`;
            }
            return `Hodnota je příliš velká: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí mít ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "prvků"}`;
            }
            return `Hodnota je příliš malá: ${issue2.origin ?? "hodnota"} musí být ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
            return `Neplatný formát ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Neplatné číslo: musí být násobkem ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Neznámé klíče: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Neplatný klíč v ${issue2.origin}`;
          case "invalid_union":
            return "Neplatný vstup";
          case "invalid_element":
            return `Neplatná hodnota v ${issue2.origin}`;
          default:
            return `Neplatný vstup`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(cs$1, cs$1.exports);
  return cs$1.exports;
}
var da$1 = { exports: {} };
var da = da$1.exports;
var hasRequiredDa;
function requireDa() {
  if (hasRequiredDa) return da$1.exports;
  hasRequiredDa = 1;
  (function(module, exports) {
    var __createBinding = da && da.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = da && da.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = da && da.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "tegn", verb: "havde" },
        file: { unit: "bytes", verb: "havde" },
        array: { unit: "elementer", verb: "indeholdt" },
        set: { unit: "elementer", verb: "indeholdt" }
      };
      const TypeNames = {
        string: "streng",
        number: "tal",
        boolean: "boolean",
        array: "liste",
        object: "objekt",
        set: "sæt",
        file: "fil"
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      function getTypeName(type) {
        return TypeNames[type] ?? type;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "tal";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "liste";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
            return "objekt";
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "e-mailadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslæt",
        date: "ISO-dato",
        time: "ISO-klokkeslæt",
        duration: "ISO-varighed",
        ipv4: "IPv4-område",
        ipv6: "IPv6-område",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodet streng",
        base64url: "base64url-kodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ugyldigt input: forventede ${getTypeName(issue2.expected)}, fik ${getTypeName(parsedType(issue2.input))}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ugyldig værdi: forventede ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ugyldigt valg: forventede en af følgende ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            const origin = getTypeName(issue2.origin);
            if (sizing)
              return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
            return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            const origin = getTypeName(issue2.origin);
            if (sizing) {
              return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `For lille: forventede ${origin} havde ${adj} ${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
            return `Ugyldig ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Ugyldigt tal: skal være deleligt med ${issue2.divisor}`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig nøgle i ${issue2.origin}`;
          case "invalid_union":
            return "Ugyldigt input: matcher ingen af de tilladte typer";
          case "invalid_element":
            return `Ugyldig værdi i ${issue2.origin}`;
          default:
            return `Ugyldigt input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(da$1, da$1.exports);
  return da$1.exports;
}
var de$1 = { exports: {} };
var de = de$1.exports;
var hasRequiredDe;
function requireDe() {
  if (hasRequiredDe) return de$1.exports;
  hasRequiredDe = 1;
  (function(module, exports) {
    var __createBinding = de && de.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = de && de.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = de && de.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "Zeichen", verb: "zu haben" },
        file: { unit: "Bytes", verb: "zu haben" },
        array: { unit: "Elemente", verb: "zu haben" },
        set: { unit: "Elemente", verb: "zu haben" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "Zahl";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "Array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "Eingabe",
        email: "E-Mail-Adresse",
        url: "URL",
        emoji: "Emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-Datum und -Uhrzeit",
        date: "ISO-Datum",
        time: "ISO-Uhrzeit",
        duration: "ISO-Dauer",
        ipv4: "IPv4-Adresse",
        ipv6: "IPv6-Adresse",
        cidrv4: "IPv4-Bereich",
        cidrv6: "IPv6-Bereich",
        base64: "Base64-codierter String",
        base64url: "Base64-URL-codierter String",
        json_string: "JSON-String",
        e164: "E.164-Nummer",
        jwt: "JWT",
        template_literal: "Eingabe"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ungültige Eingabe: erwartet ${issue2.expected}, erhalten ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ungültige Eingabe: erwartet ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ungültige Option: erwartet eine von ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
            return `Zu groß: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ist`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} hat`;
            }
            return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ist`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
            if (_issue.format === "ends_with")
              return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
            if (_issue.format === "includes")
              return `Ungültiger String: muss "${_issue.includes}" enthalten`;
            if (_issue.format === "regex")
              return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
            return `Ungültig: ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Ungültige Zahl: muss ein Vielfaches von ${issue2.divisor} sein`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Ungültiger Schlüssel in ${issue2.origin}`;
          case "invalid_union":
            return "Ungültige Eingabe";
          case "invalid_element":
            return `Ungültiger Wert in ${issue2.origin}`;
          default:
            return `Ungültige Eingabe`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(de$1, de$1.exports);
  return de$1.exports;
}
var en = {};
var hasRequiredEn;
function requireEn() {
  if (hasRequiredEn) return en;
  hasRequiredEn = 1;
  (function(exports) {
    var __createBinding = en && en.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = en && en.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = en && en.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
          if (Array.isArray(data)) {
            return "array";
          }
          if (data === null) {
            return "null";
          }
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
        }
      }
      return t;
    };
    exports.parsedType = parsedType;
    const error = () => {
      const Sizable = {
        string: { unit: "characters", verb: "to have" },
        file: { unit: "bytes", verb: "to have" },
        array: { unit: "items", verb: "to have" },
        set: { unit: "items", verb: "to have" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Invalid input: expected ${issue2.expected}, received ${(0, exports.parsedType)(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Invalid input: expected ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Invalid option: expected one of ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Invalid string: must start with "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Invalid string: must end with "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Invalid string: must include "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Invalid string: must match pattern ${_issue.pattern}`;
            return `Invalid ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Invalid number: must be a multiple of ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Invalid key in ${issue2.origin}`;
          case "invalid_union":
            return "Invalid input";
          case "invalid_element":
            return `Invalid value in ${issue2.origin}`;
          default:
            return `Invalid input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(en);
  return en;
}
var eo = {};
var hasRequiredEo;
function requireEo() {
  if (hasRequiredEo) return eo;
  hasRequiredEo = 1;
  (function(exports) {
    var __createBinding = eo && eo.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = eo && eo.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = eo && eo.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "nombro";
        }
        case "object": {
          if (Array.isArray(data)) {
            return "tabelo";
          }
          if (data === null) {
            return "senvalora";
          }
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
        }
      }
      return t;
    };
    exports.parsedType = parsedType;
    const error = () => {
      const Sizable = {
        string: { unit: "karaktrojn", verb: "havi" },
        file: { unit: "bajtojn", verb: "havi" },
        array: { unit: "elementojn", verb: "havi" },
        set: { unit: "elementojn", verb: "havi" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const Nouns = {
        regex: "enigo",
        email: "retadreso",
        url: "URL",
        emoji: "emoĝio",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datotempo",
        date: "ISO-dato",
        time: "ISO-tempo",
        duration: "ISO-daŭro",
        ipv4: "IPv4-adreso",
        ipv6: "IPv6-adreso",
        cidrv4: "IPv4-rango",
        cidrv6: "IPv6-rango",
        base64: "64-ume kodita karaktraro",
        base64url: "URL-64-ume kodita karaktraro",
        json_string: "JSON-karaktraro",
        e164: "E.164-nombro",
        jwt: "JWT",
        template_literal: "enigo"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Nevalida enigo: atendiĝis ${issue2.expected}, riceviĝis ${(0, exports.parsedType)(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Nevalida enigo: atendiĝis ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Nevalida opcio: atendiĝis unu el ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
            return `Tro granda: atendiĝis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Tro malgranda: atendiĝis ke ${issue2.origin} havu ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Tro malgranda: atendiĝis ke ${issue2.origin} estu ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
            return `Nevalida ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Nevalida nombro: devas esti oblo de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Nekonata${issue2.keys.length > 1 ? "j" : ""} ŝlosilo${issue2.keys.length > 1 ? "j" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Nevalida ŝlosilo en ${issue2.origin}`;
          case "invalid_union":
            return "Nevalida enigo";
          case "invalid_element":
            return `Nevalida valoro en ${issue2.origin}`;
          default:
            return `Nevalida enigo`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(eo);
  return eo;
}
var es$1 = { exports: {} };
var es = es$1.exports;
var hasRequiredEs;
function requireEs() {
  if (hasRequiredEs) return es$1.exports;
  hasRequiredEs = 1;
  (function(module, exports) {
    var __createBinding = es && es.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = es && es.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = es && es.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caracteres", verb: "tener" },
        file: { unit: "bytes", verb: "tener" },
        array: { unit: "elementos", verb: "tener" },
        set: { unit: "elementos", verb: "tener" }
      };
      const TypeNames = {
        string: "texto",
        number: "número",
        boolean: "booleano",
        array: "arreglo",
        object: "objeto",
        set: "conjunto",
        file: "archivo",
        date: "fecha",
        bigint: "número grande",
        symbol: "símbolo",
        undefined: "indefinido",
        null: "nulo",
        function: "función",
        map: "mapa",
        record: "registro",
        tuple: "tupla",
        enum: "enumeración",
        union: "unión",
        literal: "literal",
        promise: "promesa",
        void: "vacío",
        never: "nunca",
        unknown: "desconocido",
        any: "cualquiera"
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      function getTypeName(type) {
        return TypeNames[type] ?? type;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype) {
              return data.constructor.name;
            }
            return "object";
          }
        }
        return t;
      };
      const Nouns = {
        regex: "entrada",
        email: "dirección de correo electrónico",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "fecha y hora ISO",
        date: "fecha ISO",
        time: "hora ISO",
        duration: "duración ISO",
        ipv4: "dirección IPv4",
        ipv6: "dirección IPv6",
        cidrv4: "rango IPv4",
        cidrv6: "rango IPv6",
        base64: "cadena codificada en base64",
        base64url: "URL codificada en base64",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Entrada inválida: se esperaba ${getTypeName(issue2.expected)}, recibido ${getTypeName(parsedType(issue2.input))}`;
          // return `Entrada inválida: se esperaba ${issue.expected}, recibido ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Entrada inválida: se esperaba ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Opción inválida: se esperaba una de ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            const origin = getTypeName(issue2.origin);
            if (sizing)
              return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
            return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            const origin = getTypeName(issue2.origin);
            if (sizing) {
              return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Cadena inválida: debe incluir "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
            return `Inválido ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Número inválido: debe ser múltiplo de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Llave${issue2.keys.length > 1 ? "s" : ""} desconocida${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Llave inválida en ${getTypeName(issue2.origin)}`;
          case "invalid_union":
            return "Entrada inválida";
          case "invalid_element":
            return `Valor inválido en ${getTypeName(issue2.origin)}`;
          default:
            return `Entrada inválida`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(es$1, es$1.exports);
  return es$1.exports;
}
var fa$1 = { exports: {} };
var fa = fa$1.exports;
var hasRequiredFa;
function requireFa() {
  if (hasRequiredFa) return fa$1.exports;
  hasRequiredFa = 1;
  (function(module, exports) {
    var __createBinding = fa && fa.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = fa && fa.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = fa && fa.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "کاراکتر", verb: "داشته باشد" },
        file: { unit: "بایت", verb: "داشته باشد" },
        array: { unit: "آیتم", verb: "داشته باشد" },
        set: { unit: "آیتم", verb: "داشته باشد" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "عدد";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "آرایه";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ورودی",
        email: "آدرس ایمیل",
        url: "URL",
        emoji: "ایموجی",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاریخ و زمان ایزو",
        date: "تاریخ ایزو",
        time: "زمان ایزو",
        duration: "مدت زمان ایزو",
        ipv4: "IPv4 آدرس",
        ipv6: "IPv6 آدرس",
        cidrv4: "IPv4 دامنه",
        cidrv6: "IPv6 دامنه",
        base64: "base64-encoded رشته",
        base64url: "base64url-encoded رشته",
        json_string: "JSON رشته",
        e164: "E.164 عدد",
        jwt: "JWT",
        template_literal: "ورودی"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `ورودی نامعتبر: می‌بایست ${issue2.expected} می‌بود، ${parsedType(issue2.input)} دریافت شد`;
          case "invalid_value":
            if (issue2.values.length === 1) {
              return `ورودی نامعتبر: می‌بایست ${util2.stringifyPrimitive(issue2.values[0])} می‌بود`;
            }
            return `گزینه نامعتبر: می‌بایست یکی از ${util2.joinValues(issue2.values, "|")} می‌بود`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
            }
            return `خیلی بزرگ: ${issue2.origin ?? "مقدار"} باید ${adj}${issue2.maximum.toString()} باشد`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} باشد`;
            }
            return `خیلی کوچک: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} باشد`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
            }
            if (_issue.format === "ends_with") {
              return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
            }
            if (_issue.format === "includes") {
              return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
            }
            if (_issue.format === "regex") {
              return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
            }
            return `${Nouns[_issue.format] ?? issue2.format} نامعتبر`;
          }
          case "not_multiple_of":
            return `عدد نامعتبر: باید مضرب ${issue2.divisor} باشد`;
          case "unrecognized_keys":
            return `کلید${issue2.keys.length > 1 ? "های" : ""} ناشناس: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `کلید ناشناس در ${issue2.origin}`;
          case "invalid_union":
            return `ورودی نامعتبر`;
          case "invalid_element":
            return `مقدار نامعتبر در ${issue2.origin}`;
          default:
            return `ورودی نامعتبر`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(fa$1, fa$1.exports);
  return fa$1.exports;
}
var fi$1 = { exports: {} };
var fi = fi$1.exports;
var hasRequiredFi;
function requireFi() {
  if (hasRequiredFi) return fi$1.exports;
  hasRequiredFi = 1;
  (function(module, exports) {
    var __createBinding = fi && fi.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = fi && fi.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = fi && fi.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "merkkiä", subject: "merkkijonon" },
        file: { unit: "tavua", subject: "tiedoston" },
        array: { unit: "alkiota", subject: "listan" },
        set: { unit: "alkiota", subject: "joukon" },
        number: { unit: "", subject: "luvun" },
        bigint: { unit: "", subject: "suuren kokonaisluvun" },
        int: { unit: "", subject: "kokonaisluvun" },
        date: { unit: "", subject: "päivämäärän" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "säännöllinen lauseke",
        email: "sähköpostiosoite",
        url: "URL-osoite",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-aikaleima",
        date: "ISO-päivämäärä",
        time: "ISO-aika",
        duration: "ISO-kesto",
        ipv4: "IPv4-osoite",
        ipv6: "IPv6-osoite",
        cidrv4: "IPv4-alue",
        cidrv6: "IPv6-alue",
        base64: "base64-koodattu merkkijono",
        base64url: "base64url-koodattu merkkijono",
        json_string: "JSON-merkkijono",
        e164: "E.164-luku",
        jwt: "JWT",
        template_literal: "templaattimerkkijono"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Virheellinen tyyppi: odotettiin ${issue2.expected}, oli ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Virheellinen syöte: täytyy olla ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Virheellinen valinta: täytyy olla yksi seuraavista: ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue2.maximum.toString()} ${sizing.unit}`.trim();
            }
            return `Liian suuri: arvon täytyy olla ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue2.minimum.toString()} ${sizing.unit}`.trim();
            }
            return `Liian pieni: arvon täytyy olla ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
            if (_issue.format === "regex") {
              return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
            }
            return `Virheellinen ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Virheellinen luku: täytyy olla luvun ${issue2.divisor} monikerta`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return "Virheellinen avain tietueessa";
          case "invalid_union":
            return "Virheellinen unioni";
          case "invalid_element":
            return "Virheellinen arvo joukossa";
          default:
            return `Virheellinen syöte`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(fi$1, fi$1.exports);
  return fi$1.exports;
}
var fr$1 = { exports: {} };
var fr = fr$1.exports;
var hasRequiredFr;
function requireFr() {
  if (hasRequiredFr) return fr$1.exports;
  hasRequiredFr = 1;
  (function(module, exports) {
    var __createBinding = fr && fr.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = fr && fr.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = fr && fr.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "nombre";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "tableau";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "entrée",
        email: "adresse e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date et heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Entrée invalide : ${issue2.expected} attendu, ${parsedType(issue2.input)} reçu`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Entrée invalide : ${util2.stringifyPrimitive(issue2.values[0])} attendu`;
            return `Option invalide : une valeur parmi ${util2.joinValues(issue2.values, "|")} attendue`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Trop grand : ${issue2.origin ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
            return `Trop grand : ${issue2.origin ?? "valeur"} doit être ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Trop petit : ${issue2.origin} doit ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Trop petit : ${issue2.origin} doit être ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Chaîne invalide : doit inclure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Clé invalide dans ${issue2.origin}`;
          case "invalid_union":
            return "Entrée invalide";
          case "invalid_element":
            return `Valeur invalide dans ${issue2.origin}`;
          default:
            return `Entrée invalide`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(fr$1, fr$1.exports);
  return fr$1.exports;
}
var frCA$1 = { exports: {} };
var frCA = frCA$1.exports;
var hasRequiredFrCA;
function requireFrCA() {
  if (hasRequiredFrCA) return frCA$1.exports;
  hasRequiredFrCA = 1;
  (function(module, exports) {
    var __createBinding = frCA && frCA.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = frCA && frCA.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = frCA && frCA.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "entrée",
        email: "adresse courriel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date-heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Entrée invalide : attendu ${issue2.expected}, reçu ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Entrée invalide : attendu ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Option invalide : attendu l'une des valeurs suivantes ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "≤" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} ait ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
            return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} soit ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? "≥" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Trop petit : attendu que ${issue2.origin} ait ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Trop petit : attendu que ${issue2.origin} soit ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Chaîne invalide : doit inclure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit être un multiple de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Clé${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Clé invalide dans ${issue2.origin}`;
          case "invalid_union":
            return "Entrée invalide";
          case "invalid_element":
            return `Valeur invalide dans ${issue2.origin}`;
          default:
            return `Entrée invalide`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(frCA$1, frCA$1.exports);
  return frCA$1.exports;
}
var he$1 = { exports: {} };
var he = he$1.exports;
var hasRequiredHe;
function requireHe() {
  if (hasRequiredHe) return he$1.exports;
  hasRequiredHe = 1;
  (function(module, exports) {
    var __createBinding = he && he.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = he && he.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = he && he.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "אותיות", verb: "לכלול" },
        file: { unit: "בייטים", verb: "לכלול" },
        array: { unit: "פריטים", verb: "לכלול" },
        set: { unit: "פריטים", verb: "לכלול" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "קלט",
        email: "כתובת אימייל",
        url: "כתובת רשת",
        emoji: "אימוג'י",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "תאריך וזמן ISO",
        date: "תאריך ISO",
        time: "זמן ISO",
        duration: "משך זמן ISO",
        ipv4: "כתובת IPv4",
        ipv6: "כתובת IPv6",
        cidrv4: "טווח IPv4",
        cidrv6: "טווח IPv6",
        base64: "מחרוזת בבסיס 64",
        base64url: "מחרוזת בבסיס 64 לכתובות רשת",
        json_string: "מחרוזת JSON",
        e164: "מספר E.164",
        jwt: "JWT",
        template_literal: "קלט"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `קלט לא תקין: צריך ${issue2.expected}, התקבל ${parsedType(issue2.input)}`;
          // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `קלט לא תקין: צריך ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `קלט לא תקין: צריך אחת מהאפשרויות  ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `גדול מדי: ${issue2.origin ?? "value"} צריך להיות ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `גדול מדי: ${issue2.origin ?? "value"} צריך להיות ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `קטן מדי: ${issue2.origin} צריך להיות ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `קטן מדי: ${issue2.origin} צריך להיות ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `מחרוזת לא תקינה: חייבת להתחיל ב"${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `מחרוזת לא תקינה: חייבת להסתיים ב "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `מחרוזת לא תקינה: חייבת לכלול "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} לא תקין`;
          }
          case "not_multiple_of":
            return `מספר לא תקין: חייב להיות מכפלה של ${issue2.divisor}`;
          case "unrecognized_keys":
            return `מפתח${issue2.keys.length > 1 ? "ות" : ""} לא מזוה${issue2.keys.length > 1 ? "ים" : "ה"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `מפתח לא תקין ב${issue2.origin}`;
          case "invalid_union":
            return "קלט לא תקין";
          case "invalid_element":
            return `ערך לא תקין ב${issue2.origin}`;
          default:
            return `קלט לא תקין`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(he$1, he$1.exports);
  return he$1.exports;
}
var hu$1 = { exports: {} };
var hu = hu$1.exports;
var hasRequiredHu;
function requireHu() {
  if (hasRequiredHu) return hu$1.exports;
  hasRequiredHu = 1;
  (function(module, exports) {
    var __createBinding = hu && hu.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = hu && hu.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = hu && hu.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "legyen" },
        file: { unit: "byte", verb: "legyen" },
        array: { unit: "elem", verb: "legyen" },
        set: { unit: "elem", verb: "legyen" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "szám";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "tömb";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "bemenet",
        email: "email cím",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO időbélyeg",
        date: "ISO dátum",
        time: "ISO idő",
        duration: "ISO időintervallum",
        ipv4: "IPv4 cím",
        ipv6: "IPv6 cím",
        cidrv4: "IPv4 tartomány",
        cidrv6: "IPv6 tartomány",
        base64: "base64-kódolt string",
        base64url: "base64url-kódolt string",
        json_string: "JSON string",
        e164: "E.164 szám",
        jwt: "JWT",
        template_literal: "bemenet"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Érvénytelen bemenet: a várt érték ${issue2.expected}, a kapott érték ${parsedType(issue2.input)}`;
          // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Érvénytelen bemenet: a várt érték ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Érvénytelen opció: valamelyik érték várt ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Túl nagy: ${issue2.origin ?? "érték"} mérete túl nagy ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elem"}`;
            return `Túl nagy: a bemeneti érték ${issue2.origin ?? "érték"} túl nagy: ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Túl kicsi: a bemeneti érték ${issue2.origin} mérete túl kicsi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Túl kicsi: a bemeneti érték ${issue2.origin} túl kicsi ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
            if (_issue.format === "ends_with")
              return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
            if (_issue.format === "includes")
              return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
            if (_issue.format === "regex")
              return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
            return `Érvénytelen ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Érvénytelen szám: ${issue2.divisor} többszörösének kell lennie`;
          case "unrecognized_keys":
            return `Ismeretlen kulcs${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Érvénytelen kulcs ${issue2.origin}`;
          case "invalid_union":
            return "Érvénytelen bemenet";
          case "invalid_element":
            return `Érvénytelen érték: ${issue2.origin}`;
          default:
            return `Érvénytelen bemenet`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(hu$1, hu$1.exports);
  return hu$1.exports;
}
var id$1 = { exports: {} };
var id = id$1.exports;
var hasRequiredId;
function requireId() {
  if (hasRequiredId) return id$1.exports;
  hasRequiredId = 1;
  (function(module, exports) {
    var __createBinding = id && id.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = id && id.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = id && id.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "memiliki" },
        file: { unit: "byte", verb: "memiliki" },
        array: { unit: "item", verb: "memiliki" },
        set: { unit: "item", verb: "memiliki" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "alamat email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tanggal dan waktu format ISO",
        date: "tanggal format ISO",
        time: "jam format ISO",
        duration: "durasi format ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "rentang alamat IPv4",
        cidrv6: "rentang alamat IPv6",
        base64: "string dengan enkode base64",
        base64url: "string dengan enkode base64url",
        json_string: "string JSON",
        e164: "angka E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Input tidak valid: diharapkan ${issue2.expected}, diterima ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Input tidak valid: diharapkan ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Pilihan tidak valid: diharapkan salah satu dari ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} memiliki ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
            return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} menjadi ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Terlalu kecil: diharapkan ${issue2.origin} memiliki ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Terlalu kecil: diharapkan ${issue2.origin} menjadi ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `String tidak valid: harus menyertakan "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} tidak valid`;
          }
          case "not_multiple_of":
            return `Angka tidak valid: harus kelipatan dari ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Kunci tidak dikenali ${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Kunci tidak valid di ${issue2.origin}`;
          case "invalid_union":
            return "Input tidak valid";
          case "invalid_element":
            return `Nilai tidak valid di ${issue2.origin}`;
          default:
            return `Input tidak valid`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(id$1, id$1.exports);
  return id$1.exports;
}
var is = {};
var hasRequiredIs;
function requireIs() {
  if (hasRequiredIs) return is;
  hasRequiredIs = 1;
  (function(exports) {
    var __createBinding = is && is.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = is && is.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = is && is.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "númer";
        }
        case "object": {
          if (Array.isArray(data)) {
            return "fylki";
          }
          if (data === null) {
            return "null";
          }
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
        }
      }
      return t;
    };
    exports.parsedType = parsedType;
    const error = () => {
      const Sizable = {
        string: { unit: "stafi", verb: "að hafa" },
        file: { unit: "bæti", verb: "að hafa" },
        array: { unit: "hluti", verb: "að hafa" },
        set: { unit: "hluti", verb: "að hafa" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const Nouns = {
        regex: "gildi",
        email: "netfang",
        url: "vefslóð",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dagsetning og tími",
        date: "ISO dagsetning",
        time: "ISO tími",
        duration: "ISO tímalengd",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded strengur",
        base64url: "base64url-encoded strengur",
        json_string: "JSON strengur",
        e164: "E.164 tölugildi",
        jwt: "JWT",
        template_literal: "gildi"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Rangt gildi: Þú slóst inn ${(0, exports.parsedType)(issue2.input)} þar sem á að vera ${issue2.expected}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Rangt gildi: gert ráð fyrir ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ógilt val: má vera eitt af eftirfarandi ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} hafi ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "hluti"}`;
            return `Of stórt: gert er ráð fyrir að ${issue2.origin ?? "gildi"} sé ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Of lítið: gert er ráð fyrir að ${issue2.origin} hafi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Of lítið: gert er ráð fyrir að ${issue2.origin} sé ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
            return `Rangt ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Röng tala: verður að vera margfeldi af ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Óþekkt ${issue2.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Rangur lykill í ${issue2.origin}`;
          case "invalid_union":
            return "Rangt gildi";
          case "invalid_element":
            return `Rangt gildi í ${issue2.origin}`;
          default:
            return `Rangt gildi`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(is);
  return is;
}
var it$1 = { exports: {} };
var it = it$1.exports;
var hasRequiredIt;
function requireIt() {
  if (hasRequiredIt) return it$1.exports;
  hasRequiredIt = 1;
  (function(module, exports) {
    var __createBinding = it && it.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = it && it.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = it && it.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caratteri", verb: "avere" },
        file: { unit: "byte", verb: "avere" },
        array: { unit: "elementi", verb: "avere" },
        set: { unit: "elementi", verb: "avere" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "numero";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "vettore";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "indirizzo email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e ora ISO",
        date: "data ISO",
        time: "ora ISO",
        duration: "durata ISO",
        ipv4: "indirizzo IPv4",
        ipv6: "indirizzo IPv6",
        cidrv4: "intervallo IPv4",
        cidrv6: "intervallo IPv6",
        base64: "stringa codificata in base64",
        base64url: "URL codificata in base64",
        json_string: "stringa JSON",
        e164: "numero E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Input non valido: atteso ${issue2.expected}, ricevuto ${parsedType(issue2.input)}`;
          // return `Input non valido: atteso ${issue.expected}, ricevuto ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Input non valido: atteso ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Opzione non valida: atteso uno tra ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Troppo grande: ${issue2.origin ?? "valore"} deve avere ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementi"}`;
            return `Troppo grande: ${issue2.origin ?? "valore"} deve essere ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Troppo piccolo: ${issue2.origin} deve avere ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Troppo piccolo: ${issue2.origin} deve essere ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Stringa non valida: deve includere "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
            return `Invalid ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Numero non valido: deve essere un multiplo di ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Chiav${issue2.keys.length > 1 ? "i" : "e"} non riconosciut${issue2.keys.length > 1 ? "e" : "a"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Chiave non valida in ${issue2.origin}`;
          case "invalid_union":
            return "Input non valido";
          case "invalid_element":
            return `Valore non valido in ${issue2.origin}`;
          default:
            return `Input non valido`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(it$1, it$1.exports);
  return it$1.exports;
}
var ja$1 = { exports: {} };
var ja = ja$1.exports;
var hasRequiredJa;
function requireJa() {
  if (hasRequiredJa) return ja$1.exports;
  hasRequiredJa = 1;
  (function(module, exports) {
    var __createBinding = ja && ja.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ja && ja.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ja && ja.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "文字", verb: "である" },
        file: { unit: "バイト", verb: "である" },
        array: { unit: "要素", verb: "である" },
        set: { unit: "要素", verb: "である" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "数値";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "配列";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "入力値",
        email: "メールアドレス",
        url: "URL",
        emoji: "絵文字",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日時",
        date: "ISO日付",
        time: "ISO時刻",
        duration: "ISO期間",
        ipv4: "IPv4アドレス",
        ipv6: "IPv6アドレス",
        cidrv4: "IPv4範囲",
        cidrv6: "IPv6範囲",
        base64: "base64エンコード文字列",
        base64url: "base64urlエンコード文字列",
        json_string: "JSON文字列",
        e164: "E.164番号",
        jwt: "JWT",
        template_literal: "入力値"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `無効な入力: ${issue2.expected}が期待されましたが、${parsedType(issue2.input)}が入力されました`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `無効な入力: ${util2.stringifyPrimitive(issue2.values[0])}が期待されました`;
            return `無効な選択: ${util2.joinValues(issue2.values, "、")}のいずれかである必要があります`;
          case "too_big": {
            const adj = issue2.inclusive ? "以下である" : "より小さい";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
            return `大きすぎる値: ${issue2.origin ?? "値"}は${issue2.maximum.toString()}${adj}必要があります`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? "以上である" : "より大きい";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${sizing.unit}${adj}必要があります`;
            return `小さすぎる値: ${issue2.origin}は${issue2.minimum.toString()}${adj}必要があります`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
            if (_issue.format === "ends_with")
              return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
            if (_issue.format === "includes")
              return `無効な文字列: "${_issue.includes}"を含む必要があります`;
            if (_issue.format === "regex")
              return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
            return `無効な${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `無効な数値: ${issue2.divisor}の倍数である必要があります`;
          case "unrecognized_keys":
            return `認識されていないキー${issue2.keys.length > 1 ? "群" : ""}: ${util2.joinValues(issue2.keys, "、")}`;
          case "invalid_key":
            return `${issue2.origin}内の無効なキー`;
          case "invalid_union":
            return "無効な入力";
          case "invalid_element":
            return `${issue2.origin}内の無効な値`;
          default:
            return `無効な入力`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ja$1, ja$1.exports);
  return ja$1.exports;
}
var ka = {};
var hasRequiredKa;
function requireKa() {
  if (hasRequiredKa) return ka;
  hasRequiredKa = 1;
  (function(exports) {
    var __createBinding = ka && ka.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ka && ka.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ka && ka.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "რიცხვი";
        }
        case "object": {
          if (Array.isArray(data)) {
            return "მასივი";
          }
          if (data === null) {
            return "null";
          }
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
        }
      }
      const typeMap = {
        string: "სტრინგი",
        boolean: "ბულეანი",
        undefined: "undefined",
        bigint: "bigint",
        symbol: "symbol",
        function: "ფუნქცია"
      };
      return typeMap[t] ?? t;
    };
    exports.parsedType = parsedType;
    const error = () => {
      const Sizable = {
        string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
        file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
        array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
        set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const Nouns = {
        regex: "შეყვანა",
        email: "ელ-ფოსტის მისამართი",
        url: "URL",
        emoji: "ემოჯი",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "თარიღი-დრო",
        date: "თარიღი",
        time: "დრო",
        duration: "ხანგრძლივობა",
        ipv4: "IPv4 მისამართი",
        ipv6: "IPv6 მისამართი",
        cidrv4: "IPv4 დიაპაზონი",
        cidrv6: "IPv6 დიაპაზონი",
        base64: "base64-კოდირებული სტრინგი",
        base64url: "base64url-კოდირებული სტრინგი",
        json_string: "JSON სტრინგი",
        e164: "E.164 ნომერი",
        jwt: "JWT",
        template_literal: "შეყვანა"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `არასწორი შეყვანა: მოსალოდნელი ${issue2.expected}, მიღებული ${(0, exports.parsedType)(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `არასწორი შეყვანა: მოსალოდნელი ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${util2.joinValues(issue2.values, "|")}-დან`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
            return `ზედმეტად დიდი: მოსალოდნელი ${issue2.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `ზედმეტად პატარა: მოსალოდნელი ${issue2.origin} იყოს ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `არასწორი სტრინგი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
            }
            if (_issue.format === "ends_with")
              return `არასწორი სტრინგი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
            if (_issue.format === "includes")
              return `არასწორი სტრინგი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
            if (_issue.format === "regex")
              return `არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
            return `არასწორი ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `არასწორი რიცხვი: უნდა იყოს ${issue2.divisor}-ის ჯერადი`;
          case "unrecognized_keys":
            return `უცნობი გასაღებ${issue2.keys.length > 1 ? "ები" : "ი"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `არასწორი გასაღები ${issue2.origin}-ში`;
          case "invalid_union":
            return "არასწორი შეყვანა";
          case "invalid_element":
            return `არასწორი მნიშვნელობა ${issue2.origin}-ში`;
          default:
            return `არასწორი შეყვანა`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(ka);
  return ka;
}
var kh$1 = { exports: {} };
var km$1 = { exports: {} };
var km = km$1.exports;
var hasRequiredKm;
function requireKm() {
  if (hasRequiredKm) return km$1.exports;
  hasRequiredKm = 1;
  (function(module, exports) {
    var __createBinding = km && km.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = km && km.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = km && km.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "តួអក្សរ", verb: "គួរមាន" },
        file: { unit: "បៃ", verb: "គួរមាន" },
        array: { unit: "ធាតុ", verb: "គួរមាន" },
        set: { unit: "ធាតុ", verb: "គួរមាន" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "អារេ (Array)";
            }
            if (data === null) {
              return "គ្មានតម្លៃ (null)";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ទិន្នន័យបញ្ចូល",
        email: "អាសយដ្ឋានអ៊ីមែល",
        url: "URL",
        emoji: "សញ្ញាអារម្មណ៍",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
        date: "កាលបរិច្ឆេទ ISO",
        time: "ម៉ោង ISO",
        duration: "រយៈពេល ISO",
        ipv4: "អាសយដ្ឋាន IPv4",
        ipv6: "អាសយដ្ឋាន IPv6",
        cidrv4: "ដែនអាសយដ្ឋាន IPv4",
        cidrv6: "ដែនអាសយដ្ឋាន IPv6",
        base64: "ខ្សែអក្សរអ៊ិកូដ base64",
        base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
        json_string: "ខ្សែអក្សរ JSON",
        e164: "លេខ E.164",
        jwt: "JWT",
        template_literal: "ទិន្នន័យបញ្ចូល"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${issue2.expected} ប៉ុន្តែទទួលបាន ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
            return `ធំពេក៖ ត្រូវការ ${issue2.origin ?? "តម្លៃ"} ${adj} ${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `តូចពេក៖ ត្រូវការ ${issue2.origin} ${adj} ${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
            return `មិនត្រឹមត្រូវ៖ ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue2.divisor}`;
          case "unrecognized_keys":
            return `រកឃើញសោមិនស្គាល់៖ ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
          case "invalid_union":
            return `ទិន្នន័យមិនត្រឹមត្រូវ`;
          case "invalid_element":
            return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue2.origin}`;
          default:
            return `ទិន្នន័យមិនត្រឹមត្រូវ`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(km$1, km$1.exports);
  return km$1.exports;
}
var kh = kh$1.exports;
var hasRequiredKh;
function requireKh() {
  if (hasRequiredKh) return kh$1.exports;
  hasRequiredKh = 1;
  (function(module, exports) {
    var __importDefault = kh && kh.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const km_js_1 = __importDefault(requireKm());
    function default_1() {
      return (0, km_js_1.default)();
    }
    module.exports = exports.default;
  })(kh$1, kh$1.exports);
  return kh$1.exports;
}
var ko$1 = { exports: {} };
var ko = ko$1.exports;
var hasRequiredKo;
function requireKo() {
  if (hasRequiredKo) return ko$1.exports;
  hasRequiredKo = 1;
  (function(module, exports) {
    var __createBinding = ko && ko.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ko && ko.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ko && ko.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "문자", verb: "to have" },
        file: { unit: "바이트", verb: "to have" },
        array: { unit: "개", verb: "to have" },
        set: { unit: "개", verb: "to have" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "입력",
        email: "이메일 주소",
        url: "URL",
        emoji: "이모지",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 날짜시간",
        date: "ISO 날짜",
        time: "ISO 시간",
        duration: "ISO 기간",
        ipv4: "IPv4 주소",
        ipv6: "IPv6 주소",
        cidrv4: "IPv4 범위",
        cidrv6: "IPv6 범위",
        base64: "base64 인코딩 문자열",
        base64url: "base64url 인코딩 문자열",
        json_string: "JSON 문자열",
        e164: "E.164 번호",
        jwt: "JWT",
        template_literal: "입력"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `잘못된 입력: 예상 타입은 ${issue2.expected}, 받은 타입은 ${parsedType(issue2.input)}입니다`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `잘못된 입력: 값은 ${util2.stringifyPrimitive(issue2.values[0])} 이어야 합니다`;
            return `잘못된 옵션: ${util2.joinValues(issue2.values, "또는 ")} 중 하나여야 합니다`;
          case "too_big": {
            const adj = issue2.inclusive ? "이하" : "미만";
            const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
            const sizing = getSizing(issue2.origin);
            const unit = sizing?.unit ?? "요소";
            if (sizing)
              return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()}${unit} ${adj}${suffix}`;
            return `${issue2.origin ?? "값"}이 너무 큽니다: ${issue2.maximum.toString()} ${adj}${suffix}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? "이상" : "초과";
            const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
            const sizing = getSizing(issue2.origin);
            const unit = sizing?.unit ?? "요소";
            if (sizing) {
              return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()}${unit} ${adj}${suffix}`;
            }
            return `${issue2.origin ?? "값"}이 너무 작습니다: ${issue2.minimum.toString()} ${adj}${suffix}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
            }
            if (_issue.format === "ends_with")
              return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
            if (_issue.format === "includes")
              return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
            if (_issue.format === "regex")
              return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
            return `잘못된 ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `잘못된 숫자: ${issue2.divisor}의 배수여야 합니다`;
          case "unrecognized_keys":
            return `인식할 수 없는 키: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `잘못된 키: ${issue2.origin}`;
          case "invalid_union":
            return `잘못된 입력`;
          case "invalid_element":
            return `잘못된 값: ${issue2.origin}`;
          default:
            return `잘못된 입력`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ko$1, ko$1.exports);
  return ko$1.exports;
}
var lt = {};
var hasRequiredLt;
function requireLt() {
  if (hasRequiredLt) return lt;
  hasRequiredLt = 1;
  (function(exports) {
    var __createBinding = lt && lt.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = lt && lt.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = lt && lt.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      return parsedTypeFromType(t, data);
    };
    exports.parsedType = parsedType;
    const parsedTypeFromType = (t, data = void 0) => {
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "skaičius";
        }
        case "bigint": {
          return "sveikasis skaičius";
        }
        case "string": {
          return "eilutė";
        }
        case "boolean": {
          return "loginė reikšmė";
        }
        case "undefined":
        case "void": {
          return "neapibrėžta reikšmė";
        }
        case "function": {
          return "funkcija";
        }
        case "symbol": {
          return "simbolis";
        }
        case "object": {
          if (data === void 0)
            return "nežinomas objektas";
          if (data === null)
            return "nulinė reikšmė";
          if (Array.isArray(data))
            return "masyvas";
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
          return "objektas";
        }
        //Zod types below
        case "null": {
          return "nulinė reikšmė";
        }
      }
      return t;
    };
    const capitalizeFirstCharacter = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };
    function getUnitTypeFromNumber(number2) {
      const abs = Math.abs(number2);
      const last = abs % 10;
      const last2 = abs % 100;
      if (last2 >= 11 && last2 <= 19 || last === 0)
        return "many";
      if (last === 1)
        return "one";
      return "few";
    }
    const error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "simbolis",
            few: "simboliai",
            many: "simbolių"
          },
          verb: {
            smaller: {
              inclusive: "turi būti ne ilgesnė kaip",
              notInclusive: "turi būti trumpesnė kaip"
            },
            bigger: {
              inclusive: "turi būti ne trumpesnė kaip",
              notInclusive: "turi būti ilgesnė kaip"
            }
          }
        },
        file: {
          unit: {
            one: "baitas",
            few: "baitai",
            many: "baitų"
          },
          verb: {
            smaller: {
              inclusive: "turi būti ne didesnis kaip",
              notInclusive: "turi būti mažesnis kaip"
            },
            bigger: {
              inclusive: "turi būti ne mažesnis kaip",
              notInclusive: "turi būti didesnis kaip"
            }
          }
        },
        array: {
          unit: {
            one: "elementą",
            few: "elementus",
            many: "elementų"
          },
          verb: {
            smaller: {
              inclusive: "turi turėti ne daugiau kaip",
              notInclusive: "turi turėti mažiau kaip"
            },
            bigger: {
              inclusive: "turi turėti ne mažiau kaip",
              notInclusive: "turi turėti daugiau kaip"
            }
          }
        },
        set: {
          unit: {
            one: "elementą",
            few: "elementus",
            many: "elementų"
          },
          verb: {
            smaller: {
              inclusive: "turi turėti ne daugiau kaip",
              notInclusive: "turi turėti mažiau kaip"
            },
            bigger: {
              inclusive: "turi turėti ne mažiau kaip",
              notInclusive: "turi turėti daugiau kaip"
            }
          }
        }
      };
      function getSizing(origin, unitType, inclusive, targetShouldBe) {
        const result = Sizable[origin] ?? null;
        if (result === null)
          return result;
        return {
          unit: result.unit[unitType],
          verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
        };
      }
      const Nouns = {
        regex: "įvestis",
        email: "el. pašto adresas",
        url: "URL",
        emoji: "jaustukas",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO data ir laikas",
        date: "ISO data",
        time: "ISO laikas",
        duration: "ISO trukmė",
        ipv4: "IPv4 adresas",
        ipv6: "IPv6 adresas",
        cidrv4: "IPv4 tinklo prefiksas (CIDR)",
        cidrv6: "IPv6 tinklo prefiksas (CIDR)",
        base64: "base64 užkoduota eilutė",
        base64url: "base64url užkoduota eilutė",
        json_string: "JSON eilutė",
        e164: "E.164 numeris",
        jwt: "JWT",
        template_literal: "įvestis"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Gautas tipas ${(0, exports.parsedType)(issue2.input)}, o tikėtasi - ${parsedTypeFromType(issue2.expected)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Privalo būti ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Privalo būti vienas iš ${util2.joinValues(issue2.values, "|")} pasirinkimų`;
          case "too_big": {
            const origin = parsedTypeFromType(issue2.origin);
            const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.maximum)), issue2.inclusive ?? false, "smaller");
            if (sizing?.verb)
              return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.maximum.toString()} ${sizing.unit ?? "elementų"}`;
            const adj = issue2.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
            return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.maximum.toString()} ${sizing?.unit}`;
          }
          case "too_small": {
            const origin = parsedTypeFromType(issue2.origin);
            const sizing = getSizing(issue2.origin, getUnitTypeFromNumber(Number(issue2.minimum)), issue2.inclusive ?? false, "bigger");
            if (sizing?.verb)
              return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} ${sizing.verb} ${issue2.minimum.toString()} ${sizing.unit ?? "elementų"}`;
            const adj = issue2.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
            return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi būti ${adj} ${issue2.minimum.toString()} ${sizing?.unit}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Eilutė privalo prasidėti "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Eilutė privalo įtraukti "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Eilutė privalo atitikti ${_issue.pattern}`;
            return `Neteisingas ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Skaičius privalo būti ${issue2.divisor} kartotinis.`;
          case "unrecognized_keys":
            return `Neatpažint${issue2.keys.length > 1 ? "i" : "as"} rakt${issue2.keys.length > 1 ? "ai" : "as"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return "Rastas klaidingas raktas";
          case "invalid_union":
            return "Klaidinga įvestis";
          case "invalid_element": {
            const origin = parsedTypeFromType(issue2.origin);
            return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reikšmė")} turi klaidingą įvestį`;
          }
          default:
            return "Klaidinga įvestis";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(lt);
  return lt;
}
var mk$1 = { exports: {} };
var mk = mk$1.exports;
var hasRequiredMk;
function requireMk() {
  if (hasRequiredMk) return mk$1.exports;
  hasRequiredMk = 1;
  (function(module, exports) {
    var __createBinding = mk && mk.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = mk && mk.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = mk && mk.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "знаци", verb: "да имаат" },
        file: { unit: "бајти", verb: "да имаат" },
        array: { unit: "ставки", verb: "да имаат" },
        set: { unit: "ставки", verb: "да имаат" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "број";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "низа";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "внес",
        email: "адреса на е-пошта",
        url: "URL",
        emoji: "емоџи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO датум и време",
        date: "ISO датум",
        time: "ISO време",
        duration: "ISO времетраење",
        ipv4: "IPv4 адреса",
        ipv6: "IPv6 адреса",
        cidrv4: "IPv4 опсег",
        cidrv6: "IPv6 опсег",
        base64: "base64-енкодирана низа",
        base64url: "base64url-енкодирана низа",
        json_string: "JSON низа",
        e164: "E.164 број",
        jwt: "JWT",
        template_literal: "внес"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Грешен внес: се очекува ${issue2.expected}, примено ${parsedType(issue2.input)}`;
          // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Invalid input: expected ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Грешана опција: се очекува една ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да има ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементи"}`;
            return `Премногу голем: се очекува ${issue2.origin ?? "вредноста"} да биде ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Премногу мал: се очекува ${issue2.origin} да има ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Премногу мал: се очекува ${issue2.origin} да биде ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
            return `Invalid ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Грешен број: мора да биде делив со ${issue2.divisor}`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Грешен клуч во ${issue2.origin}`;
          case "invalid_union":
            return "Грешен внес";
          case "invalid_element":
            return `Грешна вредност во ${issue2.origin}`;
          default:
            return `Грешен внес`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(mk$1, mk$1.exports);
  return mk$1.exports;
}
var ms$1 = { exports: {} };
var ms = ms$1.exports;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms$1.exports;
  hasRequiredMs = 1;
  (function(module, exports) {
    var __createBinding = ms && ms.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ms && ms.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ms && ms.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "aksara", verb: "mempunyai" },
        file: { unit: "bait", verb: "mempunyai" },
        array: { unit: "elemen", verb: "mempunyai" },
        set: { unit: "elemen", verb: "mempunyai" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "nombor";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "alamat e-mel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tarikh masa ISO",
        date: "tarikh ISO",
        time: "masa ISO",
        duration: "tempoh ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "julat IPv4",
        cidrv6: "julat IPv6",
        base64: "string dikodkan base64",
        base64url: "string dikodkan base64url",
        json_string: "string JSON",
        e164: "nombor E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Input tidak sah: dijangka ${issue2.expected}, diterima ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Input tidak sah: dijangka ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Pilihan tidak sah: dijangka salah satu daripada ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
            return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} adalah ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Terlalu kecil: dijangka ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Terlalu kecil: dijangka ${issue2.origin} adalah ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} tidak sah`;
          }
          case "not_multiple_of":
            return `Nombor tidak sah: perlu gandaan ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Kunci tidak dikenali: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Kunci tidak sah dalam ${issue2.origin}`;
          case "invalid_union":
            return "Input tidak sah";
          case "invalid_element":
            return `Nilai tidak sah dalam ${issue2.origin}`;
          default:
            return `Input tidak sah`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ms$1, ms$1.exports);
  return ms$1.exports;
}
var nl$1 = { exports: {} };
var nl = nl$1.exports;
var hasRequiredNl;
function requireNl() {
  if (hasRequiredNl) return nl$1.exports;
  hasRequiredNl = 1;
  (function(module, exports) {
    var __createBinding = nl && nl.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = nl && nl.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = nl && nl.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "tekens" },
        file: { unit: "bytes" },
        array: { unit: "elementen" },
        set: { unit: "elementen" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "getal";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "invoer",
        email: "emailadres",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum en tijd",
        date: "ISO datum",
        time: "ISO tijd",
        duration: "ISO duur",
        ipv4: "IPv4-adres",
        ipv6: "IPv6-adres",
        cidrv4: "IPv4-bereik",
        cidrv6: "IPv6-bereik",
        base64: "base64-gecodeerde tekst",
        base64url: "base64 URL-gecodeerde tekst",
        json_string: "JSON string",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "invoer"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ongeldige invoer: verwacht ${issue2.expected}, ontving ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ongeldige invoer: verwacht ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ongeldige optie: verwacht één van ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Te lang: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementen"} bevat`;
            return `Te lang: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} is`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Te kort: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} bevat`;
            }
            return `Te kort: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} is`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
            }
            if (_issue.format === "ends_with")
              return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
            if (_issue.format === "includes")
              return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
            if (_issue.format === "regex")
              return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
            return `Ongeldig: ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Ongeldig getal: moet een veelvoud van ${issue2.divisor} zijn`;
          case "unrecognized_keys":
            return `Onbekende key${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Ongeldige key in ${issue2.origin}`;
          case "invalid_union":
            return "Ongeldige invoer";
          case "invalid_element":
            return `Ongeldige waarde in ${issue2.origin}`;
          default:
            return `Ongeldige invoer`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(nl$1, nl$1.exports);
  return nl$1.exports;
}
var no$1 = { exports: {} };
var no = no$1.exports;
var hasRequiredNo;
function requireNo() {
  if (hasRequiredNo) return no$1.exports;
  hasRequiredNo = 1;
  (function(module, exports) {
    var __createBinding = no && no.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = no && no.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = no && no.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "tegn", verb: "å ha" },
        file: { unit: "bytes", verb: "å ha" },
        array: { unit: "elementer", verb: "å inneholde" },
        set: { unit: "elementer", verb: "å inneholde" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "tall";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "liste";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "input",
        email: "e-postadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslett",
        date: "ISO-dato",
        time: "ISO-klokkeslett",
        duration: "ISO-varighet",
        ipv4: "IPv4-område",
        ipv6: "IPv6-område",
        cidrv4: "IPv4-spekter",
        cidrv6: "IPv6-spekter",
        base64: "base64-enkodet streng",
        base64url: "base64url-enkodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ugyldig input: forventet ${issue2.expected}, fikk ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ugyldig verdi: forventet ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ugyldig valg: forventet en av ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
            return `For stor(t): forventet ${issue2.origin ?? "value"} til å ha ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `For lite(n): forventet ${issue2.origin} til å ha ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Ugyldig streng: må starte med "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Ugyldig streng: må ende med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ugyldig streng: må inneholde "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
            return `Ugyldig ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Ugyldig tall: må være et multiplum av ${issue2.divisor}`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig nøkkel i ${issue2.origin}`;
          case "invalid_union":
            return "Ugyldig input";
          case "invalid_element":
            return `Ugyldig verdi i ${issue2.origin}`;
          default:
            return `Ugyldig input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(no$1, no$1.exports);
  return no$1.exports;
}
var ota$1 = { exports: {} };
var ota = ota$1.exports;
var hasRequiredOta;
function requireOta() {
  if (hasRequiredOta) return ota$1.exports;
  hasRequiredOta = 1;
  (function(module, exports) {
    var __createBinding = ota && ota.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ota && ota.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ota && ota.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "harf", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "unsur", verb: "olmalıdır" },
        set: { unit: "unsur", verb: "olmalıdır" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "numara";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "saf";
            }
            if (data === null) {
              return "gayb";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "giren",
        email: "epostagâh",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO hengâmı",
        date: "ISO tarihi",
        time: "ISO zamanı",
        duration: "ISO müddeti",
        ipv4: "IPv4 nişânı",
        ipv6: "IPv6 nişânı",
        cidrv4: "IPv4 menzili",
        cidrv6: "IPv6 menzili",
        base64: "base64-şifreli metin",
        base64url: "base64url-şifreli metin",
        json_string: "JSON metin",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "giren"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Fâsit giren: umulan ${issue2.expected}, alınan ${parsedType(issue2.input)}`;
          // return `Fâsit giren: umulan ${issue.expected}, alınan ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Fâsit giren: umulan ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Fâsit tercih: mûteberler ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
            return `Fazla büyük: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} olmalıydı.`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
            }
            return `Fazla küçük: ${issue2.origin}, ${adj}${issue2.minimum.toString()} olmalıydı.`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
            if (_issue.format === "ends_with")
              return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
            if (_issue.format === "includes")
              return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
            if (_issue.format === "regex")
              return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
            return `Fâsit ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Fâsit sayı: ${issue2.divisor} katı olmalıydı.`;
          case "unrecognized_keys":
            return `Tanınmayan anahtar ${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `${issue2.origin} için tanınmayan anahtar var.`;
          case "invalid_union":
            return "Giren tanınamadı.";
          case "invalid_element":
            return `${issue2.origin} için tanınmayan kıymet var.`;
          default:
            return `Kıymet tanınamadı.`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ota$1, ota$1.exports);
  return ota$1.exports;
}
var ps$1 = { exports: {} };
var ps = ps$1.exports;
var hasRequiredPs;
function requirePs() {
  if (hasRequiredPs) return ps$1.exports;
  hasRequiredPs = 1;
  (function(module, exports) {
    var __createBinding = ps && ps.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ps && ps.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ps && ps.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "توکي", verb: "ولري" },
        file: { unit: "بایټس", verb: "ولري" },
        array: { unit: "توکي", verb: "ولري" },
        set: { unit: "توکي", verb: "ولري" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "عدد";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "ارې";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ورودي",
        email: "بریښنالیک",
        url: "یو آر ال",
        emoji: "ایموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "نیټه او وخت",
        date: "نېټه",
        time: "وخت",
        duration: "موده",
        ipv4: "د IPv4 پته",
        ipv6: "د IPv6 پته",
        cidrv4: "د IPv4 ساحه",
        cidrv6: "د IPv6 ساحه",
        base64: "base64-encoded متن",
        base64url: "base64url-encoded متن",
        json_string: "JSON متن",
        e164: "د E.164 شمېره",
        jwt: "JWT",
        template_literal: "ورودي"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `ناسم ورودي: باید ${issue2.expected} وای, مګر ${parsedType(issue2.input)} ترلاسه شو`;
          case "invalid_value":
            if (issue2.values.length === 1) {
              return `ناسم ورودي: باید ${util2.stringifyPrimitive(issue2.values[0])} وای`;
            }
            return `ناسم انتخاب: باید یو له ${util2.joinValues(issue2.values, "|")} څخه وای`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
            }
            return `ډیر لوی: ${issue2.origin ?? "ارزښت"} باید ${adj}${issue2.maximum.toString()} وي`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} ${sizing.unit} ولري`;
            }
            return `ډیر کوچنی: ${issue2.origin} باید ${adj}${issue2.minimum.toString()} وي`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
            }
            if (_issue.format === "ends_with") {
              return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
            }
            if (_issue.format === "includes") {
              return `ناسم متن: باید "${_issue.includes}" ولري`;
            }
            if (_issue.format === "regex") {
              return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
            }
            return `${Nouns[_issue.format] ?? issue2.format} ناسم دی`;
          }
          case "not_multiple_of":
            return `ناسم عدد: باید د ${issue2.divisor} مضرب وي`;
          case "unrecognized_keys":
            return `ناسم ${issue2.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `ناسم کلیډ په ${issue2.origin} کې`;
          case "invalid_union":
            return `ناسمه ورودي`;
          case "invalid_element":
            return `ناسم عنصر په ${issue2.origin} کې`;
          default:
            return `ناسمه ورودي`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ps$1, ps$1.exports);
  return ps$1.exports;
}
var pl$1 = { exports: {} };
var pl = pl$1.exports;
var hasRequiredPl;
function requirePl() {
  if (hasRequiredPl) return pl$1.exports;
  hasRequiredPl = 1;
  (function(module, exports) {
    var __createBinding = pl && pl.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = pl && pl.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = pl && pl.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "znaków", verb: "mieć" },
        file: { unit: "bajtów", verb: "mieć" },
        array: { unit: "elementów", verb: "mieć" },
        set: { unit: "elementów", verb: "mieć" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "liczba";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "tablica";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "wyrażenie",
        email: "adres email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i godzina w formacie ISO",
        date: "data w formacie ISO",
        time: "godzina w formacie ISO",
        duration: "czas trwania ISO",
        ipv4: "adres IPv4",
        ipv6: "adres IPv6",
        cidrv4: "zakres IPv4",
        cidrv6: "zakres IPv6",
        base64: "ciąg znaków zakodowany w formacie base64",
        base64url: "ciąg znaków zakodowany w formacie base64url",
        json_string: "ciąg znaków w formacie JSON",
        e164: "liczba E.164",
        jwt: "JWT",
        template_literal: "wejście"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Nieprawidłowe dane wejściowe: oczekiwano ${issue2.expected}, otrzymano ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Nieprawidłowe dane wejściowe: oczekiwano ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Za duża wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementów"}`;
            }
            return `Zbyt duż(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Za mała wartość: oczekiwano, że ${issue2.origin ?? "wartość"} będzie mieć ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "elementów"}`;
            }
            return `Zbyt mał(y/a/e): oczekiwano, że ${issue2.origin ?? "wartość"} będzie wynosić ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
            return `Nieprawidłow(y/a/e) ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Nieprawidłowa liczba: musi być wielokrotnością ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Nierozpoznane klucze${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Nieprawidłowy klucz w ${issue2.origin}`;
          case "invalid_union":
            return "Nieprawidłowe dane wejściowe";
          case "invalid_element":
            return `Nieprawidłowa wartość w ${issue2.origin}`;
          default:
            return `Nieprawidłowe dane wejściowe`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(pl$1, pl$1.exports);
  return pl$1.exports;
}
var pt$1 = { exports: {} };
var pt = pt$1.exports;
var hasRequiredPt;
function requirePt() {
  if (hasRequiredPt) return pt$1.exports;
  hasRequiredPt = 1;
  (function(module, exports) {
    var __createBinding = pt && pt.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = pt && pt.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = pt && pt.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "caracteres", verb: "ter" },
        file: { unit: "bytes", verb: "ter" },
        array: { unit: "itens", verb: "ter" },
        set: { unit: "itens", verb: "ter" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "número";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "nulo";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "padrão",
        email: "endereço de e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "duração ISO",
        ipv4: "endereço IPv4",
        ipv6: "endereço IPv6",
        cidrv4: "faixa de IPv4",
        cidrv6: "faixa de IPv6",
        base64: "texto codificado em base64",
        base64url: "URL codificada em base64",
        json_string: "texto JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Tipo inválido: esperado ${issue2.expected}, recebido ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Entrada inválida: esperado ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Opção inválida: esperada uma das ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Muito grande: esperado que ${issue2.origin ?? "valor"} tivesse ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
            return `Muito grande: esperado que ${issue2.origin ?? "valor"} fosse ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Muito pequeno: esperado que ${issue2.origin} tivesse ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Muito pequeno: esperado que ${issue2.origin} fosse ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Texto inválido: deve começar com "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Texto inválido: deve terminar com "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Texto inválido: deve incluir "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} inválido`;
          }
          case "not_multiple_of":
            return `Número inválido: deve ser múltiplo de ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Chave${issue2.keys.length > 1 ? "s" : ""} desconhecida${issue2.keys.length > 1 ? "s" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Chave inválida em ${issue2.origin}`;
          case "invalid_union":
            return "Entrada inválida";
          case "invalid_element":
            return `Valor inválido em ${issue2.origin}`;
          default:
            return `Campo inválido`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(pt$1, pt$1.exports);
  return pt$1.exports;
}
var ru$1 = { exports: {} };
var ru = ru$1.exports;
var hasRequiredRu;
function requireRu() {
  if (hasRequiredRu) return ru$1.exports;
  hasRequiredRu = 1;
  (function(module, exports) {
    var __createBinding = ru && ru.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ru && ru.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ru && ru.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    function getRussianPlural(count, one, few, many) {
      const absCount = Math.abs(count);
      const lastDigit = absCount % 10;
      const lastTwoDigits = absCount % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
      }
      if (lastDigit === 1) {
        return one;
      }
      if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
      }
      return many;
    }
    const error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "символ",
            few: "символа",
            many: "символов"
          },
          verb: "иметь"
        },
        file: {
          unit: {
            one: "байт",
            few: "байта",
            many: "байт"
          },
          verb: "иметь"
        },
        array: {
          unit: {
            one: "элемент",
            few: "элемента",
            many: "элементов"
          },
          verb: "иметь"
        },
        set: {
          unit: {
            one: "элемент",
            few: "элемента",
            many: "элементов"
          },
          verb: "иметь"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "число";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "массив";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ввод",
        email: "email адрес",
        url: "URL",
        emoji: "эмодзи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата и время",
        date: "ISO дата",
        time: "ISO время",
        duration: "ISO длительность",
        ipv4: "IPv4 адрес",
        ipv6: "IPv6 адрес",
        cidrv4: "IPv4 диапазон",
        cidrv6: "IPv6 диапазон",
        base64: "строка в формате base64",
        base64url: "строка в формате base64url",
        json_string: "JSON строка",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "ввод"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Неверный ввод: ожидалось ${issue2.expected}, получено ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Неверный ввод: ожидалось ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Неверный вариант: ожидалось одно из ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              const maxValue = Number(issue2.maximum);
              const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет иметь ${adj}${issue2.maximum.toString()} ${unit}`;
            }
            return `Слишком большое значение: ожидалось, что ${issue2.origin ?? "значение"} будет ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              const minValue = Number(issue2.minimum);
              const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет иметь ${adj}${issue2.minimum.toString()} ${unit}`;
            }
            return `Слишком маленькое значение: ожидалось, что ${issue2.origin} будет ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Неверная строка: должна содержать "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
            return `Неверный ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Неверное число: должно быть кратным ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Нераспознанн${issue2.keys.length > 1 ? "ые" : "ый"} ключ${issue2.keys.length > 1 ? "и" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Неверный ключ в ${issue2.origin}`;
          case "invalid_union":
            return "Неверные входные данные";
          case "invalid_element":
            return `Неверное значение в ${issue2.origin}`;
          default:
            return `Неверные входные данные`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ru$1, ru$1.exports);
  return ru$1.exports;
}
var sl$1 = { exports: {} };
var sl = sl$1.exports;
var hasRequiredSl;
function requireSl() {
  if (hasRequiredSl) return sl$1.exports;
  hasRequiredSl = 1;
  (function(module, exports) {
    var __createBinding = sl && sl.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = sl && sl.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = sl && sl.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "znakov", verb: "imeti" },
        file: { unit: "bajtov", verb: "imeti" },
        array: { unit: "elementov", verb: "imeti" },
        set: { unit: "elementov", verb: "imeti" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "število";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "tabela";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "vnos",
        email: "e-poštni naslov",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum in čas",
        date: "ISO datum",
        time: "ISO čas",
        duration: "ISO trajanje",
        ipv4: "IPv4 naslov",
        ipv6: "IPv6 naslov",
        cidrv4: "obseg IPv4",
        cidrv6: "obseg IPv6",
        base64: "base64 kodiran niz",
        base64url: "base64url kodiran niz",
        json_string: "JSON niz",
        e164: "E.164 številka",
        jwt: "JWT",
        template_literal: "vnos"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Neveljaven vnos: pričakovano ${issue2.expected}, prejeto ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Neveljaven vnos: pričakovano ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Neveljavna možnost: pričakovano eno izmed ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} imelo ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementov"}`;
            return `Preveliko: pričakovano, da bo ${issue2.origin ?? "vrednost"} ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Premajhno: pričakovano, da bo ${issue2.origin} imelo ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Premajhno: pričakovano, da bo ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
            return `Neveljaven ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Neveljavno število: mora biti večkratnik ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Neprepoznan${issue2.keys.length > 1 ? "i ključi" : " ključ"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Neveljaven ključ v ${issue2.origin}`;
          case "invalid_union":
            return "Neveljaven vnos";
          case "invalid_element":
            return `Neveljavna vrednost v ${issue2.origin}`;
          default:
            return "Neveljaven vnos";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(sl$1, sl$1.exports);
  return sl$1.exports;
}
var sv$1 = { exports: {} };
var sv = sv$1.exports;
var hasRequiredSv;
function requireSv() {
  if (hasRequiredSv) return sv$1.exports;
  hasRequiredSv = 1;
  (function(module, exports) {
    var __createBinding = sv && sv.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = sv && sv.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = sv && sv.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "tecken", verb: "att ha" },
        file: { unit: "bytes", verb: "att ha" },
        array: { unit: "objekt", verb: "att innehålla" },
        set: { unit: "objekt", verb: "att innehålla" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "antal";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "lista";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "reguljärt uttryck",
        email: "e-postadress",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datum och tid",
        date: "ISO-datum",
        time: "ISO-tid",
        duration: "ISO-varaktighet",
        ipv4: "IPv4-intervall",
        ipv6: "IPv6-intervall",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodad sträng",
        base64url: "base64url-kodad sträng",
        json_string: "JSON-sträng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "mall-literal"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ogiltig inmatning: förväntat ${issue2.expected}, fick ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ogiltig inmatning: förväntat ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Ogiltigt val: förväntade en av ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `För stor(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
            }
            return `För stor(t): förväntat ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `För lite(t): förväntade ${issue2.origin ?? "värdet"} att ha ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
            return `Ogiltig(t) ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Ogiltigt tal: måste vara en multipel av ${issue2.divisor}`;
          case "unrecognized_keys":
            return `${issue2.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Ogiltig nyckel i ${issue2.origin ?? "värdet"}`;
          case "invalid_union":
            return "Ogiltig input";
          case "invalid_element":
            return `Ogiltigt värde i ${issue2.origin ?? "värdet"}`;
          default:
            return `Ogiltig input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(sv$1, sv$1.exports);
  return sv$1.exports;
}
var ta$1 = { exports: {} };
var ta = ta$1.exports;
var hasRequiredTa;
function requireTa() {
  if (hasRequiredTa) return ta$1.exports;
  hasRequiredTa = 1;
  (function(module, exports) {
    var __createBinding = ta && ta.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ta && ta.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ta && ta.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
        file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
        array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
        set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "எண் அல்லாதது" : "எண்";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "அணி";
            }
            if (data === null) {
              return "வெறுமை";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "உள்ளீடு",
        email: "மின்னஞ்சல் முகவரி",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO தேதி நேரம்",
        date: "ISO தேதி",
        time: "ISO நேரம்",
        duration: "ISO கால அளவு",
        ipv4: "IPv4 முகவரி",
        ipv6: "IPv6 முகவரி",
        cidrv4: "IPv4 வரம்பு",
        cidrv6: "IPv6 வரம்பு",
        base64: "base64-encoded சரம்",
        base64url: "base64url-encoded சரம்",
        json_string: "JSON சரம்",
        e164: "E.164 எண்",
        jwt: "JWT",
        template_literal: "input"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${issue2.expected}, பெறப்பட்டது ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${util2.joinValues(issue2.values, "|")} இல் ஒன்று`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
            }
            return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue2.origin ?? "மதிப்பு"} ${adj}${issue2.maximum.toString()} ஆக இருக்க வேண்டும்`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
            }
            return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue2.origin} ${adj}${issue2.minimum.toString()} ஆக இருக்க வேண்டும்`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
            if (_issue.format === "ends_with")
              return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
            if (_issue.format === "includes")
              return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
            if (_issue.format === "regex")
              return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
            return `தவறான ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `தவறான எண்: ${issue2.divisor} இன் பலமாக இருக்க வேண்டும்`;
          case "unrecognized_keys":
            return `அடையாளம் தெரியாத விசை${issue2.keys.length > 1 ? "கள்" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `${issue2.origin} இல் தவறான விசை`;
          case "invalid_union":
            return "தவறான உள்ளீடு";
          case "invalid_element":
            return `${issue2.origin} இல் தவறான மதிப்பு`;
          default:
            return `தவறான உள்ளீடு`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ta$1, ta$1.exports);
  return ta$1.exports;
}
var th$1 = { exports: {} };
var th = th$1.exports;
var hasRequiredTh;
function requireTh() {
  if (hasRequiredTh) return th$1.exports;
  hasRequiredTh = 1;
  (function(module, exports) {
    var __createBinding = th && th.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = th && th.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = th && th.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "ตัวอักษร", verb: "ควรมี" },
        file: { unit: "ไบต์", verb: "ควรมี" },
        array: { unit: "รายการ", verb: "ควรมี" },
        set: { unit: "รายการ", verb: "ควรมี" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "อาร์เรย์ (Array)";
            }
            if (data === null) {
              return "ไม่มีค่า (null)";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ข้อมูลที่ป้อน",
        email: "ที่อยู่อีเมล",
        url: "URL",
        emoji: "อิโมจิ",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "วันที่เวลาแบบ ISO",
        date: "วันที่แบบ ISO",
        time: "เวลาแบบ ISO",
        duration: "ช่วงเวลาแบบ ISO",
        ipv4: "ที่อยู่ IPv4",
        ipv6: "ที่อยู่ IPv6",
        cidrv4: "ช่วง IP แบบ IPv4",
        cidrv6: "ช่วง IP แบบ IPv6",
        base64: "ข้อความแบบ Base64",
        base64url: "ข้อความแบบ Base64 สำหรับ URL",
        json_string: "ข้อความแบบ JSON",
        e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
        jwt: "โทเคน JWT",
        template_literal: "ข้อมูลที่ป้อน"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${issue2.expected} แต่ได้รับ ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `ค่าไม่ถูกต้อง: ควรเป็น ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "ไม่เกิน" : "น้อยกว่า";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
            return `เกินกำหนด: ${issue2.origin ?? "ค่า"} ควรมี${adj} ${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? "อย่างน้อย" : "มากกว่า";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `น้อยกว่ากำหนด: ${issue2.origin} ควรมี${adj} ${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
            if (_issue.format === "regex")
              return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
            return `รูปแบบไม่ถูกต้อง: ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue2.divisor} ได้ลงตัว`;
          case "unrecognized_keys":
            return `พบคีย์ที่ไม่รู้จัก: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `คีย์ไม่ถูกต้องใน ${issue2.origin}`;
          case "invalid_union":
            return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
          case "invalid_element":
            return `ข้อมูลไม่ถูกต้องใน ${issue2.origin}`;
          default:
            return `ข้อมูลไม่ถูกต้อง`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(th$1, th$1.exports);
  return th$1.exports;
}
var tr = {};
var hasRequiredTr;
function requireTr() {
  if (hasRequiredTr) return tr;
  hasRequiredTr = 1;
  (function(exports) {
    var __createBinding = tr && tr.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = tr && tr.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = tr && tr.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parsedType = void 0;
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const parsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
          if (Array.isArray(data)) {
            return "array";
          }
          if (data === null) {
            return "null";
          }
          if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
            return data.constructor.name;
          }
        }
      }
      return t;
    };
    exports.parsedType = parsedType;
    const error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "olmalı" },
        file: { unit: "bayt", verb: "olmalı" },
        array: { unit: "öğe", verb: "olmalı" },
        set: { unit: "öğe", verb: "olmalı" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const Nouns = {
        regex: "girdi",
        email: "e-posta adresi",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO tarih ve saat",
        date: "ISO tarih",
        time: "ISO saat",
        duration: "ISO süre",
        ipv4: "IPv4 adresi",
        ipv6: "IPv6 adresi",
        cidrv4: "IPv4 aralığı",
        cidrv6: "IPv6 aralığı",
        base64: "base64 ile şifrelenmiş metin",
        base64url: "base64url ile şifrelenmiş metin",
        json_string: "JSON dizesi",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "Şablon dizesi"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Geçersiz değer: beklenen ${issue2.expected}, alınan ${(0, exports.parsedType)(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Geçersiz değer: beklenen ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "öğe"}`;
            return `Çok büyük: beklenen ${issue2.origin ?? "değer"} ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            return `Çok küçük: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
            if (_issue.format === "ends_with")
              return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
            if (_issue.format === "includes")
              return `Geçersiz metin: "${_issue.includes}" içermeli`;
            if (_issue.format === "regex")
              return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
            return `Geçersiz ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Geçersiz sayı: ${issue2.divisor} ile tam bölünebilmeli`;
          case "unrecognized_keys":
            return `Tanınmayan anahtar${issue2.keys.length > 1 ? "lar" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `${issue2.origin} içinde geçersiz anahtar`;
          case "invalid_union":
            return "Geçersiz değer";
          case "invalid_element":
            return `${issue2.origin} içinde geçersiz değer`;
          default:
            return `Geçersiz değer`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
  })(tr);
  return tr;
}
var ua$1 = { exports: {} };
var uk$1 = { exports: {} };
var uk = uk$1.exports;
var hasRequiredUk;
function requireUk() {
  if (hasRequiredUk) return uk$1.exports;
  hasRequiredUk = 1;
  (function(module, exports) {
    var __createBinding = uk && uk.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = uk && uk.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = uk && uk.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "символів", verb: "матиме" },
        file: { unit: "байтів", verb: "матиме" },
        array: { unit: "елементів", verb: "матиме" },
        set: { unit: "елементів", verb: "матиме" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "число";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "масив";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "вхідні дані",
        email: "адреса електронної пошти",
        url: "URL",
        emoji: "емодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "дата та час ISO",
        date: "дата ISO",
        time: "час ISO",
        duration: "тривалість ISO",
        ipv4: "адреса IPv4",
        ipv6: "адреса IPv6",
        cidrv4: "діапазон IPv4",
        cidrv6: "діапазон IPv6",
        base64: "рядок у кодуванні base64",
        base64url: "рядок у кодуванні base64url",
        json_string: "рядок JSON",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "вхідні дані"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Неправильні вхідні дані: очікується ${issue2.expected}, отримано ${parsedType(issue2.input)}`;
          // return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${util.getParsedType(issue.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Неправильні вхідні дані: очікується ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Неправильна опція: очікується одне з ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "елементів"}`;
            return `Занадто велике: очікується, що ${issue2.origin ?? "значення"} буде ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Занадто мале: очікується, що ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Занадто мале: очікується, що ${issue2.origin} буде ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Неправильний рядок: повинен містити "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
            return `Неправильний ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Неправильне число: повинно бути кратним ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Нерозпізнаний ключ${issue2.keys.length > 1 ? "і" : ""}: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Неправильний ключ у ${issue2.origin}`;
          case "invalid_union":
            return "Неправильні вхідні дані";
          case "invalid_element":
            return `Неправильне значення у ${issue2.origin}`;
          default:
            return `Неправильні вхідні дані`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(uk$1, uk$1.exports);
  return uk$1.exports;
}
var ua = ua$1.exports;
var hasRequiredUa;
function requireUa() {
  if (hasRequiredUa) return ua$1.exports;
  hasRequiredUa = 1;
  (function(module, exports) {
    var __importDefault = ua && ua.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const uk_js_1 = __importDefault(requireUk());
    function default_1() {
      return (0, uk_js_1.default)();
    }
    module.exports = exports.default;
  })(ua$1, ua$1.exports);
  return ua$1.exports;
}
var ur$1 = { exports: {} };
var ur = ur$1.exports;
var hasRequiredUr;
function requireUr() {
  if (hasRequiredUr) return ur$1.exports;
  hasRequiredUr = 1;
  (function(module, exports) {
    var __createBinding = ur && ur.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = ur && ur.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = ur && ur.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "حروف", verb: "ہونا" },
        file: { unit: "بائٹس", verb: "ہونا" },
        array: { unit: "آئٹمز", verb: "ہونا" },
        set: { unit: "آئٹمز", verb: "ہونا" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "نمبر";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "آرے";
            }
            if (data === null) {
              return "نل";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ان پٹ",
        email: "ای میل ایڈریس",
        url: "یو آر ایل",
        emoji: "ایموجی",
        uuid: "یو یو آئی ڈی",
        uuidv4: "یو یو آئی ڈی وی 4",
        uuidv6: "یو یو آئی ڈی وی 6",
        nanoid: "نینو آئی ڈی",
        guid: "جی یو آئی ڈی",
        cuid: "سی یو آئی ڈی",
        cuid2: "سی یو آئی ڈی 2",
        ulid: "یو ایل آئی ڈی",
        xid: "ایکس آئی ڈی",
        ksuid: "کے ایس یو آئی ڈی",
        datetime: "آئی ایس او ڈیٹ ٹائم",
        date: "آئی ایس او تاریخ",
        time: "آئی ایس او وقت",
        duration: "آئی ایس او مدت",
        ipv4: "آئی پی وی 4 ایڈریس",
        ipv6: "آئی پی وی 6 ایڈریس",
        cidrv4: "آئی پی وی 4 رینج",
        cidrv6: "آئی پی وی 6 رینج",
        base64: "بیس 64 ان کوڈڈ سٹرنگ",
        base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
        json_string: "جے ایس او این سٹرنگ",
        e164: "ای 164 نمبر",
        jwt: "جے ڈبلیو ٹی",
        template_literal: "ان پٹ"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `غلط ان پٹ: ${issue2.expected} متوقع تھا، ${parsedType(issue2.input)} موصول ہوا`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `غلط ان پٹ: ${util2.stringifyPrimitive(issue2.values[0])} متوقع تھا`;
            return `غلط آپشن: ${util2.joinValues(issue2.values, "|")} میں سے ایک متوقع تھا`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کے ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
            return `بہت بڑا: ${issue2.origin ?? "ویلیو"} کا ${adj}${issue2.maximum.toString()} ہونا متوقع تھا`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `بہت چھوٹا: ${issue2.origin} کے ${adj}${issue2.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
            }
            return `بہت چھوٹا: ${issue2.origin} کا ${adj}${issue2.minimum.toString()} ہونا متوقع تھا`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
            }
            if (_issue.format === "ends_with")
              return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
            if (_issue.format === "includes")
              return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
            if (_issue.format === "regex")
              return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
            return `غلط ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `غلط نمبر: ${issue2.divisor} کا مضاعف ہونا چاہیے`;
          case "unrecognized_keys":
            return `غیر تسلیم شدہ کی${issue2.keys.length > 1 ? "ز" : ""}: ${util2.joinValues(issue2.keys, "، ")}`;
          case "invalid_key":
            return `${issue2.origin} میں غلط کی`;
          case "invalid_union":
            return "غلط ان پٹ";
          case "invalid_element":
            return `${issue2.origin} میں غلط ویلیو`;
          default:
            return `غلط ان پٹ`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(ur$1, ur$1.exports);
  return ur$1.exports;
}
var vi$1 = { exports: {} };
var vi = vi$1.exports;
var hasRequiredVi;
function requireVi() {
  if (hasRequiredVi) return vi$1.exports;
  hasRequiredVi = 1;
  (function(module, exports) {
    var __createBinding = vi && vi.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = vi && vi.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = vi && vi.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "ký tự", verb: "có" },
        file: { unit: "byte", verb: "có" },
        array: { unit: "phần tử", verb: "có" },
        set: { unit: "phần tử", verb: "có" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "số";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "mảng";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "đầu vào",
        email: "địa chỉ email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ngày giờ ISO",
        date: "ngày ISO",
        time: "giờ ISO",
        duration: "khoảng thời gian ISO",
        ipv4: "địa chỉ IPv4",
        ipv6: "địa chỉ IPv6",
        cidrv4: "dải IPv4",
        cidrv6: "dải IPv6",
        base64: "chuỗi mã hóa base64",
        base64url: "chuỗi mã hóa base64url",
        json_string: "chuỗi JSON",
        e164: "số E.164",
        jwt: "JWT",
        template_literal: "đầu vào"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Đầu vào không hợp lệ: mong đợi ${issue2.expected}, nhận được ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Đầu vào không hợp lệ: mong đợi ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
            return `Quá lớn: mong đợi ${issue2.origin ?? "giá trị"} ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `Quá nhỏ: mong đợi ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `Quá nhỏ: mong đợi ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
            return `${Nouns[_issue.format] ?? issue2.format} không hợp lệ`;
          }
          case "not_multiple_of":
            return `Số không hợp lệ: phải là bội số của ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Khóa không được nhận dạng: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Khóa không hợp lệ trong ${issue2.origin}`;
          case "invalid_union":
            return "Đầu vào không hợp lệ";
          case "invalid_element":
            return `Giá trị không hợp lệ trong ${issue2.origin}`;
          default:
            return `Đầu vào không hợp lệ`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(vi$1, vi$1.exports);
  return vi$1.exports;
}
var zhCN$1 = { exports: {} };
var zhCN = zhCN$1.exports;
var hasRequiredZhCN;
function requireZhCN() {
  if (hasRequiredZhCN) return zhCN$1.exports;
  hasRequiredZhCN = 1;
  (function(module, exports) {
    var __createBinding = zhCN && zhCN.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = zhCN && zhCN.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = zhCN && zhCN.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "字符", verb: "包含" },
        file: { unit: "字节", verb: "包含" },
        array: { unit: "项", verb: "包含" },
        set: { unit: "项", verb: "包含" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "非数字(NaN)" : "数字";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "数组";
            }
            if (data === null) {
              return "空值(null)";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "输入",
        email: "电子邮件",
        url: "URL",
        emoji: "表情符号",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日期时间",
        date: "ISO日期",
        time: "ISO时间",
        duration: "ISO时长",
        ipv4: "IPv4地址",
        ipv6: "IPv6地址",
        cidrv4: "IPv4网段",
        cidrv6: "IPv6网段",
        base64: "base64编码字符串",
        base64url: "base64url编码字符串",
        json_string: "JSON字符串",
        e164: "E.164号码",
        jwt: "JWT",
        template_literal: "输入"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `无效输入：期望 ${issue2.expected}，实际接收 ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `无效输入：期望 ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `无效选项：期望以下之一 ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "个元素"}`;
            return `数值过大：期望 ${issue2.origin ?? "值"} ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `数值过小：期望 ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `无效字符串：必须以 "${_issue.prefix}" 开头`;
            if (_issue.format === "ends_with")
              return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
            if (_issue.format === "includes")
              return `无效字符串：必须包含 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
            return `无效${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `无效数字：必须是 ${issue2.divisor} 的倍数`;
          case "unrecognized_keys":
            return `出现未知的键(key): ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `${issue2.origin} 中的键(key)无效`;
          case "invalid_union":
            return "无效输入";
          case "invalid_element":
            return `${issue2.origin} 中包含无效值(value)`;
          default:
            return `无效输入`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(zhCN$1, zhCN$1.exports);
  return zhCN$1.exports;
}
var zhTW$1 = { exports: {} };
var zhTW = zhTW$1.exports;
var hasRequiredZhTW;
function requireZhTW() {
  if (hasRequiredZhTW) return zhTW$1.exports;
  hasRequiredZhTW = 1;
  (function(module, exports) {
    var __createBinding = zhTW && zhTW.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = zhTW && zhTW.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = zhTW && zhTW.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "字元", verb: "擁有" },
        file: { unit: "位元組", verb: "擁有" },
        array: { unit: "項目", verb: "擁有" },
        set: { unit: "項目", verb: "擁有" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "array";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "輸入",
        email: "郵件地址",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 日期時間",
        date: "ISO 日期",
        time: "ISO 時間",
        duration: "ISO 期間",
        ipv4: "IPv4 位址",
        ipv6: "IPv6 位址",
        cidrv4: "IPv4 範圍",
        cidrv6: "IPv6 範圍",
        base64: "base64 編碼字串",
        base64url: "base64url 編碼字串",
        json_string: "JSON 字串",
        e164: "E.164 數值",
        jwt: "JWT",
        template_literal: "輸入"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `無效的輸入值：預期為 ${issue2.expected}，但收到 ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `無效的輸入值：預期為 ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `無效的選項：預期為以下其中之一 ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "個元素"}`;
            return `數值過大：預期 ${issue2.origin ?? "值"} 應為 ${adj}${issue2.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing) {
              return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
            }
            return `數值過小：預期 ${issue2.origin} 應為 ${adj}${issue2.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with") {
              return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
            }
            if (_issue.format === "ends_with")
              return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
            if (_issue.format === "includes")
              return `無效的字串：必須包含 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `無效的字串：必須符合格式 ${_issue.pattern}`;
            return `無效的 ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `無效的數字：必須為 ${issue2.divisor} 的倍數`;
          case "unrecognized_keys":
            return `無法識別的鍵值${issue2.keys.length > 1 ? "們" : ""}：${util2.joinValues(issue2.keys, "、")}`;
          case "invalid_key":
            return `${issue2.origin} 中有無效的鍵值`;
          case "invalid_union":
            return "無效的輸入值";
          case "invalid_element":
            return `${issue2.origin} 中有無效的值`;
          default:
            return `無效的輸入值`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(zhTW$1, zhTW$1.exports);
  return zhTW$1.exports;
}
var yo$1 = { exports: {} };
var yo = yo$1.exports;
var hasRequiredYo;
function requireYo() {
  if (hasRequiredYo) return yo$1.exports;
  hasRequiredYo = 1;
  (function(module, exports) {
    var __createBinding = yo && yo.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = yo && yo.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = yo && yo.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    const util2 = __importStar(requireUtil());
    const error = () => {
      const Sizable = {
        string: { unit: "àmi", verb: "ní" },
        file: { unit: "bytes", verb: "ní" },
        array: { unit: "nkan", verb: "ní" },
        set: { unit: "nkan", verb: "ní" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
          case "number": {
            return Number.isNaN(data) ? "NaN" : "nọ́mbà";
          }
          case "object": {
            if (Array.isArray(data)) {
              return "akopọ";
            }
            if (data === null) {
              return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
              return data.constructor.name;
            }
          }
        }
        return t;
      };
      const Nouns = {
        regex: "ẹ̀rọ ìbáwọlé",
        email: "àdírẹ́sì ìmẹ́lì",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "àkókò ISO",
        date: "ọjọ́ ISO",
        time: "àkókò ISO",
        duration: "àkókò tó pé ISO",
        ipv4: "àdírẹ́sì IPv4",
        ipv6: "àdírẹ́sì IPv6",
        cidrv4: "àgbègbè IPv4",
        cidrv6: "àgbègbè IPv6",
        base64: "ọ̀rọ̀ tí a kọ́ ní base64",
        base64url: "ọ̀rọ̀ base64url",
        json_string: "ọ̀rọ̀ JSON",
        e164: "nọ́mbà E.164",
        jwt: "JWT",
        template_literal: "ẹ̀rọ ìbáwọlé"
      };
      return (issue2) => {
        switch (issue2.code) {
          case "invalid_type":
            return `Ìbáwọlé aṣìṣe: a ní láti fi ${issue2.expected}, àmọ̀ a rí ${parsedType(issue2.input)}`;
          case "invalid_value":
            if (issue2.values.length === 1)
              return `Ìbáwọlé aṣìṣe: a ní láti fi ${util2.stringifyPrimitive(issue2.values[0])}`;
            return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${util2.joinValues(issue2.values, "|")}`;
          case "too_big": {
            const adj = issue2.inclusive ? "<=" : "<";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue2.origin ?? "iye"} ${sizing.verb} ${adj}${issue2.maximum} ${sizing.unit}`;
            return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue2.maximum}`;
          }
          case "too_small": {
            const adj = issue2.inclusive ? ">=" : ">";
            const sizing = getSizing(issue2.origin);
            if (sizing)
              return `Kéré ju: a ní láti jẹ́ pé ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum} ${sizing.unit}`;
            return `Kéré ju: a ní láti jẹ́ ${adj}${issue2.minimum}`;
          }
          case "invalid_format": {
            const _issue = issue2;
            if (_issue.format === "starts_with")
              return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
            return `Aṣìṣe: ${Nouns[_issue.format] ?? issue2.format}`;
          }
          case "not_multiple_of":
            return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue2.divisor}`;
          case "unrecognized_keys":
            return `Bọtìnì àìmọ̀: ${util2.joinValues(issue2.keys, ", ")}`;
          case "invalid_key":
            return `Bọtìnì aṣìṣe nínú ${issue2.origin}`;
          case "invalid_union":
            return "Ìbáwọlé aṣìṣe";
          case "invalid_element":
            return `Iye aṣìṣe nínú ${issue2.origin}`;
          default:
            return "Ìbáwọlé aṣìṣe";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  })(yo$1, yo$1.exports);
  return yo$1.exports;
}
var hasRequiredLocales;
function requireLocales() {
  if (hasRequiredLocales) return locales;
  hasRequiredLocales = 1;
  (function(exports) {
    var __importDefault = locales && locales.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.yo = exports.zhTW = exports.zhCN = exports.vi = exports.ur = exports.uk = exports.ua = exports.tr = exports.th = exports.ta = exports.sv = exports.sl = exports.ru = exports.pt = exports.pl = exports.ps = exports.ota = exports.no = exports.nl = exports.ms = exports.mk = exports.lt = exports.ko = exports.km = exports.kh = exports.ka = exports.ja = exports.it = exports.is = exports.id = exports.hu = exports.he = exports.frCA = exports.fr = exports.fi = exports.fa = exports.es = exports.eo = exports.en = exports.de = exports.da = exports.cs = exports.ca = exports.be = exports.az = exports.ar = void 0;
    var ar_js_1 = requireAr();
    Object.defineProperty(exports, "ar", { enumerable: true, get: function() {
      return __importDefault(ar_js_1).default;
    } });
    var az_js_1 = requireAz();
    Object.defineProperty(exports, "az", { enumerable: true, get: function() {
      return __importDefault(az_js_1).default;
    } });
    var be_js_1 = requireBe();
    Object.defineProperty(exports, "be", { enumerable: true, get: function() {
      return __importDefault(be_js_1).default;
    } });
    var ca_js_1 = requireCa();
    Object.defineProperty(exports, "ca", { enumerable: true, get: function() {
      return __importDefault(ca_js_1).default;
    } });
    var cs_js_1 = requireCs();
    Object.defineProperty(exports, "cs", { enumerable: true, get: function() {
      return __importDefault(cs_js_1).default;
    } });
    var da_js_1 = requireDa();
    Object.defineProperty(exports, "da", { enumerable: true, get: function() {
      return __importDefault(da_js_1).default;
    } });
    var de_js_1 = requireDe();
    Object.defineProperty(exports, "de", { enumerable: true, get: function() {
      return __importDefault(de_js_1).default;
    } });
    var en_js_1 = requireEn();
    Object.defineProperty(exports, "en", { enumerable: true, get: function() {
      return __importDefault(en_js_1).default;
    } });
    var eo_js_1 = requireEo();
    Object.defineProperty(exports, "eo", { enumerable: true, get: function() {
      return __importDefault(eo_js_1).default;
    } });
    var es_js_1 = requireEs();
    Object.defineProperty(exports, "es", { enumerable: true, get: function() {
      return __importDefault(es_js_1).default;
    } });
    var fa_js_1 = requireFa();
    Object.defineProperty(exports, "fa", { enumerable: true, get: function() {
      return __importDefault(fa_js_1).default;
    } });
    var fi_js_1 = requireFi();
    Object.defineProperty(exports, "fi", { enumerable: true, get: function() {
      return __importDefault(fi_js_1).default;
    } });
    var fr_js_1 = requireFr();
    Object.defineProperty(exports, "fr", { enumerable: true, get: function() {
      return __importDefault(fr_js_1).default;
    } });
    var fr_CA_js_1 = requireFrCA();
    Object.defineProperty(exports, "frCA", { enumerable: true, get: function() {
      return __importDefault(fr_CA_js_1).default;
    } });
    var he_js_1 = requireHe();
    Object.defineProperty(exports, "he", { enumerable: true, get: function() {
      return __importDefault(he_js_1).default;
    } });
    var hu_js_1 = requireHu();
    Object.defineProperty(exports, "hu", { enumerable: true, get: function() {
      return __importDefault(hu_js_1).default;
    } });
    var id_js_1 = requireId();
    Object.defineProperty(exports, "id", { enumerable: true, get: function() {
      return __importDefault(id_js_1).default;
    } });
    var is_js_1 = requireIs();
    Object.defineProperty(exports, "is", { enumerable: true, get: function() {
      return __importDefault(is_js_1).default;
    } });
    var it_js_1 = requireIt();
    Object.defineProperty(exports, "it", { enumerable: true, get: function() {
      return __importDefault(it_js_1).default;
    } });
    var ja_js_1 = requireJa();
    Object.defineProperty(exports, "ja", { enumerable: true, get: function() {
      return __importDefault(ja_js_1).default;
    } });
    var ka_js_1 = requireKa();
    Object.defineProperty(exports, "ka", { enumerable: true, get: function() {
      return __importDefault(ka_js_1).default;
    } });
    var kh_js_1 = requireKh();
    Object.defineProperty(exports, "kh", { enumerable: true, get: function() {
      return __importDefault(kh_js_1).default;
    } });
    var km_js_1 = requireKm();
    Object.defineProperty(exports, "km", { enumerable: true, get: function() {
      return __importDefault(km_js_1).default;
    } });
    var ko_js_1 = requireKo();
    Object.defineProperty(exports, "ko", { enumerable: true, get: function() {
      return __importDefault(ko_js_1).default;
    } });
    var lt_js_1 = requireLt();
    Object.defineProperty(exports, "lt", { enumerable: true, get: function() {
      return __importDefault(lt_js_1).default;
    } });
    var mk_js_1 = requireMk();
    Object.defineProperty(exports, "mk", { enumerable: true, get: function() {
      return __importDefault(mk_js_1).default;
    } });
    var ms_js_1 = requireMs();
    Object.defineProperty(exports, "ms", { enumerable: true, get: function() {
      return __importDefault(ms_js_1).default;
    } });
    var nl_js_1 = requireNl();
    Object.defineProperty(exports, "nl", { enumerable: true, get: function() {
      return __importDefault(nl_js_1).default;
    } });
    var no_js_1 = requireNo();
    Object.defineProperty(exports, "no", { enumerable: true, get: function() {
      return __importDefault(no_js_1).default;
    } });
    var ota_js_1 = requireOta();
    Object.defineProperty(exports, "ota", { enumerable: true, get: function() {
      return __importDefault(ota_js_1).default;
    } });
    var ps_js_1 = requirePs();
    Object.defineProperty(exports, "ps", { enumerable: true, get: function() {
      return __importDefault(ps_js_1).default;
    } });
    var pl_js_1 = requirePl();
    Object.defineProperty(exports, "pl", { enumerable: true, get: function() {
      return __importDefault(pl_js_1).default;
    } });
    var pt_js_1 = requirePt();
    Object.defineProperty(exports, "pt", { enumerable: true, get: function() {
      return __importDefault(pt_js_1).default;
    } });
    var ru_js_1 = requireRu();
    Object.defineProperty(exports, "ru", { enumerable: true, get: function() {
      return __importDefault(ru_js_1).default;
    } });
    var sl_js_1 = requireSl();
    Object.defineProperty(exports, "sl", { enumerable: true, get: function() {
      return __importDefault(sl_js_1).default;
    } });
    var sv_js_1 = requireSv();
    Object.defineProperty(exports, "sv", { enumerable: true, get: function() {
      return __importDefault(sv_js_1).default;
    } });
    var ta_js_1 = requireTa();
    Object.defineProperty(exports, "ta", { enumerable: true, get: function() {
      return __importDefault(ta_js_1).default;
    } });
    var th_js_1 = requireTh();
    Object.defineProperty(exports, "th", { enumerable: true, get: function() {
      return __importDefault(th_js_1).default;
    } });
    var tr_js_1 = requireTr();
    Object.defineProperty(exports, "tr", { enumerable: true, get: function() {
      return __importDefault(tr_js_1).default;
    } });
    var ua_js_1 = requireUa();
    Object.defineProperty(exports, "ua", { enumerable: true, get: function() {
      return __importDefault(ua_js_1).default;
    } });
    var uk_js_1 = requireUk();
    Object.defineProperty(exports, "uk", { enumerable: true, get: function() {
      return __importDefault(uk_js_1).default;
    } });
    var ur_js_1 = requireUr();
    Object.defineProperty(exports, "ur", { enumerable: true, get: function() {
      return __importDefault(ur_js_1).default;
    } });
    var vi_js_1 = requireVi();
    Object.defineProperty(exports, "vi", { enumerable: true, get: function() {
      return __importDefault(vi_js_1).default;
    } });
    var zh_CN_js_1 = requireZhCN();
    Object.defineProperty(exports, "zhCN", { enumerable: true, get: function() {
      return __importDefault(zh_CN_js_1).default;
    } });
    var zh_TW_js_1 = requireZhTW();
    Object.defineProperty(exports, "zhTW", { enumerable: true, get: function() {
      return __importDefault(zh_TW_js_1).default;
    } });
    var yo_js_1 = requireYo();
    Object.defineProperty(exports, "yo", { enumerable: true, get: function() {
      return __importDefault(yo_js_1).default;
    } });
  })(locales);
  return locales;
}
var registries = {};
var hasRequiredRegistries;
function requireRegistries() {
  if (hasRequiredRegistries) return registries;
  hasRequiredRegistries = 1;
  Object.defineProperty(registries, "__esModule", { value: true });
  registries.globalRegistry = registries.$ZodRegistry = registries.$input = registries.$output = void 0;
  registries.registry = registry2;
  registries.$output = /* @__PURE__ */ Symbol("ZodOutput");
  registries.$input = /* @__PURE__ */ Symbol("ZodInput");
  class $ZodRegistry2 {
    constructor() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
    }
    add(schema, ..._meta) {
      const meta2 = _meta[0];
      this._map.set(schema, meta2);
      if (meta2 && typeof meta2 === "object" && "id" in meta2) {
        if (this._idmap.has(meta2.id)) {
          throw new Error(`ID ${meta2.id} already exists in the registry`);
        }
        this._idmap.set(meta2.id, schema);
      }
      return this;
    }
    clear() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
      return this;
    }
    remove(schema) {
      const meta2 = this._map.get(schema);
      if (meta2 && typeof meta2 === "object" && "id" in meta2) {
        this._idmap.delete(meta2.id);
      }
      this._map.delete(schema);
      return this;
    }
    get(schema) {
      const p = schema._zod.parent;
      if (p) {
        const pm = { ...this.get(p) ?? {} };
        delete pm.id;
        const f = { ...pm, ...this._map.get(schema) };
        return Object.keys(f).length ? f : void 0;
      }
      return this._map.get(schema);
    }
    has(schema) {
      return this._map.has(schema);
    }
  }
  registries.$ZodRegistry = $ZodRegistry2;
  function registry2() {
    return new $ZodRegistry2();
  }
  registries.globalRegistry = registry2();
  return registries;
}
var api = {};
var hasRequiredApi;
function requireApi() {
  if (hasRequiredApi) return api;
  hasRequiredApi = 1;
  var __createBinding = api && api.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = api && api.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = api && api.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(api, "__esModule", { value: true });
  api.TimePrecision = void 0;
  api._string = _string2;
  api._coercedString = _coercedString;
  api._email = _email2;
  api._guid = _guid2;
  api._uuid = _uuid2;
  api._uuidv4 = _uuidv42;
  api._uuidv6 = _uuidv62;
  api._uuidv7 = _uuidv72;
  api._url = _url2;
  api._emoji = _emoji2;
  api._nanoid = _nanoid2;
  api._cuid = _cuid3;
  api._cuid2 = _cuid22;
  api._ulid = _ulid2;
  api._xid = _xid2;
  api._ksuid = _ksuid2;
  api._ipv4 = _ipv42;
  api._ipv6 = _ipv62;
  api._cidrv4 = _cidrv42;
  api._cidrv6 = _cidrv62;
  api._base64 = _base642;
  api._base64url = _base64url2;
  api._e164 = _e1642;
  api._jwt = _jwt2;
  api._isoDateTime = _isoDateTime2;
  api._isoDate = _isoDate2;
  api._isoTime = _isoTime2;
  api._isoDuration = _isoDuration2;
  api._number = _number2;
  api._coercedNumber = _coercedNumber2;
  api._int = _int2;
  api._float32 = _float322;
  api._float64 = _float642;
  api._int32 = _int322;
  api._uint32 = _uint322;
  api._boolean = _boolean2;
  api._coercedBoolean = _coercedBoolean2;
  api._bigint = _bigint2;
  api._coercedBigint = _coercedBigint;
  api._int64 = _int642;
  api._uint64 = _uint642;
  api._symbol = _symbol2;
  api._undefined = _undefined2;
  api._null = _null2;
  api._any = _any2;
  api._unknown = _unknown2;
  api._never = _never2;
  api._void = _void2;
  api._date = _date2;
  api._coercedDate = _coercedDate2;
  api._nan = _nan2;
  api._lt = _lt2;
  api._lte = _lte2;
  api._max = _lte2;
  api._lte = _lte2;
  api._max = _lte2;
  api._gt = _gt2;
  api._gte = _gte2;
  api._min = _gte2;
  api._gte = _gte2;
  api._min = _gte2;
  api._positive = _positive2;
  api._negative = _negative2;
  api._nonpositive = _nonpositive2;
  api._nonnegative = _nonnegative2;
  api._multipleOf = _multipleOf2;
  api._maxSize = _maxSize2;
  api._minSize = _minSize2;
  api._size = _size2;
  api._maxLength = _maxLength2;
  api._minLength = _minLength2;
  api._length = _length2;
  api._regex = _regex2;
  api._lowercase = _lowercase2;
  api._uppercase = _uppercase2;
  api._includes = _includes2;
  api._startsWith = _startsWith2;
  api._endsWith = _endsWith2;
  api._property = _property2;
  api._mime = _mime2;
  api._overwrite = _overwrite2;
  api._normalize = _normalize2;
  api._trim = _trim2;
  api._toLowerCase = _toLowerCase2;
  api._toUpperCase = _toUpperCase2;
  api._array = _array2;
  api._union = _union;
  api._discriminatedUnion = _discriminatedUnion;
  api._intersection = _intersection;
  api._tuple = _tuple;
  api._record = _record;
  api._map = _map;
  api._set = _set;
  api._enum = _enum2;
  api._nativeEnum = _nativeEnum;
  api._literal = _literal;
  api._file = _file2;
  api._transform = _transform;
  api._optional = _optional;
  api._nullable = _nullable;
  api._default = _default2;
  api._nonoptional = _nonoptional;
  api._success = _success;
  api._catch = _catch2;
  api._pipe = _pipe;
  api._readonly = _readonly;
  api._templateLiteral = _templateLiteral;
  api._lazy = _lazy;
  api._promise = _promise;
  api._custom = _custom2;
  api._refine = _refine2;
  api._superRefine = _superRefine2;
  api._check = _check2;
  api._stringbool = _stringbool2;
  api._stringFormat = _stringFormat2;
  const checks2 = __importStar(requireChecks$1());
  const schemas2 = __importStar(requireSchemas$1());
  const util2 = __importStar(requireUtil());
  function _string2(Class, params) {
    return new Class({
      type: "string",
      ...util2.normalizeParams(params)
    });
  }
  function _coercedString(Class, params) {
    return new Class({
      type: "string",
      coerce: true,
      ...util2.normalizeParams(params)
    });
  }
  function _email2(Class, params) {
    return new Class({
      type: "string",
      format: "email",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _guid2(Class, params) {
    return new Class({
      type: "string",
      format: "guid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _uuid2(Class, params) {
    return new Class({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _uuidv42(Class, params) {
    return new Class({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v4",
      ...util2.normalizeParams(params)
    });
  }
  function _uuidv62(Class, params) {
    return new Class({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v6",
      ...util2.normalizeParams(params)
    });
  }
  function _uuidv72(Class, params) {
    return new Class({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v7",
      ...util2.normalizeParams(params)
    });
  }
  function _url2(Class, params) {
    return new Class({
      type: "string",
      format: "url",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _emoji2(Class, params) {
    return new Class({
      type: "string",
      format: "emoji",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _nanoid2(Class, params) {
    return new Class({
      type: "string",
      format: "nanoid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _cuid3(Class, params) {
    return new Class({
      type: "string",
      format: "cuid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _cuid22(Class, params) {
    return new Class({
      type: "string",
      format: "cuid2",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _ulid2(Class, params) {
    return new Class({
      type: "string",
      format: "ulid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _xid2(Class, params) {
    return new Class({
      type: "string",
      format: "xid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _ksuid2(Class, params) {
    return new Class({
      type: "string",
      format: "ksuid",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _ipv42(Class, params) {
    return new Class({
      type: "string",
      format: "ipv4",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _ipv62(Class, params) {
    return new Class({
      type: "string",
      format: "ipv6",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _cidrv42(Class, params) {
    return new Class({
      type: "string",
      format: "cidrv4",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _cidrv62(Class, params) {
    return new Class({
      type: "string",
      format: "cidrv6",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _base642(Class, params) {
    return new Class({
      type: "string",
      format: "base64",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _base64url2(Class, params) {
    return new Class({
      type: "string",
      format: "base64url",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _e1642(Class, params) {
    return new Class({
      type: "string",
      format: "e164",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  function _jwt2(Class, params) {
    return new Class({
      type: "string",
      format: "jwt",
      check: "string_format",
      abort: false,
      ...util2.normalizeParams(params)
    });
  }
  api.TimePrecision = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6
  };
  function _isoDateTime2(Class, params) {
    return new Class({
      type: "string",
      format: "datetime",
      check: "string_format",
      offset: false,
      local: false,
      precision: null,
      ...util2.normalizeParams(params)
    });
  }
  function _isoDate2(Class, params) {
    return new Class({
      type: "string",
      format: "date",
      check: "string_format",
      ...util2.normalizeParams(params)
    });
  }
  function _isoTime2(Class, params) {
    return new Class({
      type: "string",
      format: "time",
      check: "string_format",
      precision: null,
      ...util2.normalizeParams(params)
    });
  }
  function _isoDuration2(Class, params) {
    return new Class({
      type: "string",
      format: "duration",
      check: "string_format",
      ...util2.normalizeParams(params)
    });
  }
  function _number2(Class, params) {
    return new Class({
      type: "number",
      checks: [],
      ...util2.normalizeParams(params)
    });
  }
  function _coercedNumber2(Class, params) {
    return new Class({
      type: "number",
      coerce: true,
      checks: [],
      ...util2.normalizeParams(params)
    });
  }
  function _int2(Class, params) {
    return new Class({
      type: "number",
      check: "number_format",
      abort: false,
      format: "safeint",
      ...util2.normalizeParams(params)
    });
  }
  function _float322(Class, params) {
    return new Class({
      type: "number",
      check: "number_format",
      abort: false,
      format: "float32",
      ...util2.normalizeParams(params)
    });
  }
  function _float642(Class, params) {
    return new Class({
      type: "number",
      check: "number_format",
      abort: false,
      format: "float64",
      ...util2.normalizeParams(params)
    });
  }
  function _int322(Class, params) {
    return new Class({
      type: "number",
      check: "number_format",
      abort: false,
      format: "int32",
      ...util2.normalizeParams(params)
    });
  }
  function _uint322(Class, params) {
    return new Class({
      type: "number",
      check: "number_format",
      abort: false,
      format: "uint32",
      ...util2.normalizeParams(params)
    });
  }
  function _boolean2(Class, params) {
    return new Class({
      type: "boolean",
      ...util2.normalizeParams(params)
    });
  }
  function _coercedBoolean2(Class, params) {
    return new Class({
      type: "boolean",
      coerce: true,
      ...util2.normalizeParams(params)
    });
  }
  function _bigint2(Class, params) {
    return new Class({
      type: "bigint",
      ...util2.normalizeParams(params)
    });
  }
  function _coercedBigint(Class, params) {
    return new Class({
      type: "bigint",
      coerce: true,
      ...util2.normalizeParams(params)
    });
  }
  function _int642(Class, params) {
    return new Class({
      type: "bigint",
      check: "bigint_format",
      abort: false,
      format: "int64",
      ...util2.normalizeParams(params)
    });
  }
  function _uint642(Class, params) {
    return new Class({
      type: "bigint",
      check: "bigint_format",
      abort: false,
      format: "uint64",
      ...util2.normalizeParams(params)
    });
  }
  function _symbol2(Class, params) {
    return new Class({
      type: "symbol",
      ...util2.normalizeParams(params)
    });
  }
  function _undefined2(Class, params) {
    return new Class({
      type: "undefined",
      ...util2.normalizeParams(params)
    });
  }
  function _null2(Class, params) {
    return new Class({
      type: "null",
      ...util2.normalizeParams(params)
    });
  }
  function _any2(Class) {
    return new Class({
      type: "any"
    });
  }
  function _unknown2(Class) {
    return new Class({
      type: "unknown"
    });
  }
  function _never2(Class, params) {
    return new Class({
      type: "never",
      ...util2.normalizeParams(params)
    });
  }
  function _void2(Class, params) {
    return new Class({
      type: "void",
      ...util2.normalizeParams(params)
    });
  }
  function _date2(Class, params) {
    return new Class({
      type: "date",
      ...util2.normalizeParams(params)
    });
  }
  function _coercedDate2(Class, params) {
    return new Class({
      type: "date",
      coerce: true,
      ...util2.normalizeParams(params)
    });
  }
  function _nan2(Class, params) {
    return new Class({
      type: "nan",
      ...util2.normalizeParams(params)
    });
  }
  function _lt2(value, params) {
    return new checks2.$ZodCheckLessThan({
      check: "less_than",
      ...util2.normalizeParams(params),
      value,
      inclusive: false
    });
  }
  function _lte2(value, params) {
    return new checks2.$ZodCheckLessThan({
      check: "less_than",
      ...util2.normalizeParams(params),
      value,
      inclusive: true
    });
  }
  function _gt2(value, params) {
    return new checks2.$ZodCheckGreaterThan({
      check: "greater_than",
      ...util2.normalizeParams(params),
      value,
      inclusive: false
    });
  }
  function _gte2(value, params) {
    return new checks2.$ZodCheckGreaterThan({
      check: "greater_than",
      ...util2.normalizeParams(params),
      value,
      inclusive: true
    });
  }
  function _positive2(params) {
    return _gt2(0, params);
  }
  function _negative2(params) {
    return _lt2(0, params);
  }
  function _nonpositive2(params) {
    return _lte2(0, params);
  }
  function _nonnegative2(params) {
    return _gte2(0, params);
  }
  function _multipleOf2(value, params) {
    return new checks2.$ZodCheckMultipleOf({
      check: "multiple_of",
      ...util2.normalizeParams(params),
      value
    });
  }
  function _maxSize2(maximum, params) {
    return new checks2.$ZodCheckMaxSize({
      check: "max_size",
      ...util2.normalizeParams(params),
      maximum
    });
  }
  function _minSize2(minimum, params) {
    return new checks2.$ZodCheckMinSize({
      check: "min_size",
      ...util2.normalizeParams(params),
      minimum
    });
  }
  function _size2(size, params) {
    return new checks2.$ZodCheckSizeEquals({
      check: "size_equals",
      ...util2.normalizeParams(params),
      size
    });
  }
  function _maxLength2(maximum, params) {
    const ch = new checks2.$ZodCheckMaxLength({
      check: "max_length",
      ...util2.normalizeParams(params),
      maximum
    });
    return ch;
  }
  function _minLength2(minimum, params) {
    return new checks2.$ZodCheckMinLength({
      check: "min_length",
      ...util2.normalizeParams(params),
      minimum
    });
  }
  function _length2(length, params) {
    return new checks2.$ZodCheckLengthEquals({
      check: "length_equals",
      ...util2.normalizeParams(params),
      length
    });
  }
  function _regex2(pattern, params) {
    return new checks2.$ZodCheckRegex({
      check: "string_format",
      format: "regex",
      ...util2.normalizeParams(params),
      pattern
    });
  }
  function _lowercase2(params) {
    return new checks2.$ZodCheckLowerCase({
      check: "string_format",
      format: "lowercase",
      ...util2.normalizeParams(params)
    });
  }
  function _uppercase2(params) {
    return new checks2.$ZodCheckUpperCase({
      check: "string_format",
      format: "uppercase",
      ...util2.normalizeParams(params)
    });
  }
  function _includes2(includes, params) {
    return new checks2.$ZodCheckIncludes({
      check: "string_format",
      format: "includes",
      ...util2.normalizeParams(params),
      includes
    });
  }
  function _startsWith2(prefix, params) {
    return new checks2.$ZodCheckStartsWith({
      check: "string_format",
      format: "starts_with",
      ...util2.normalizeParams(params),
      prefix
    });
  }
  function _endsWith2(suffix, params) {
    return new checks2.$ZodCheckEndsWith({
      check: "string_format",
      format: "ends_with",
      ...util2.normalizeParams(params),
      suffix
    });
  }
  function _property2(property, schema, params) {
    return new checks2.$ZodCheckProperty({
      check: "property",
      property,
      schema,
      ...util2.normalizeParams(params)
    });
  }
  function _mime2(types, params) {
    return new checks2.$ZodCheckMimeType({
      check: "mime_type",
      mime: types,
      ...util2.normalizeParams(params)
    });
  }
  function _overwrite2(tx) {
    return new checks2.$ZodCheckOverwrite({
      check: "overwrite",
      tx
    });
  }
  function _normalize2(form) {
    return _overwrite2((input) => input.normalize(form));
  }
  function _trim2() {
    return _overwrite2((input) => input.trim());
  }
  function _toLowerCase2() {
    return _overwrite2((input) => input.toLowerCase());
  }
  function _toUpperCase2() {
    return _overwrite2((input) => input.toUpperCase());
  }
  function _array2(Class, element, params) {
    return new Class({
      type: "array",
      element,
      // get element() {
      //   return element;
      // },
      ...util2.normalizeParams(params)
    });
  }
  function _union(Class, options, params) {
    return new Class({
      type: "union",
      options,
      ...util2.normalizeParams(params)
    });
  }
  function _discriminatedUnion(Class, discriminator, options, params) {
    return new Class({
      type: "union",
      options,
      discriminator,
      ...util2.normalizeParams(params)
    });
  }
  function _intersection(Class, left, right) {
    return new Class({
      type: "intersection",
      left,
      right
    });
  }
  function _tuple(Class, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof schemas2.$ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class({
      type: "tuple",
      items,
      rest,
      ...util2.normalizeParams(params)
    });
  }
  function _record(Class, keyType, valueType, params) {
    return new Class({
      type: "record",
      keyType,
      valueType,
      ...util2.normalizeParams(params)
    });
  }
  function _map(Class, keyType, valueType, params) {
    return new Class({
      type: "map",
      keyType,
      valueType,
      ...util2.normalizeParams(params)
    });
  }
  function _set(Class, valueType, params) {
    return new Class({
      type: "set",
      valueType,
      ...util2.normalizeParams(params)
    });
  }
  function _enum2(Class, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new Class({
      type: "enum",
      entries,
      ...util2.normalizeParams(params)
    });
  }
  function _nativeEnum(Class, entries, params) {
    return new Class({
      type: "enum",
      entries,
      ...util2.normalizeParams(params)
    });
  }
  function _literal(Class, value, params) {
    return new Class({
      type: "literal",
      values: Array.isArray(value) ? value : [value],
      ...util2.normalizeParams(params)
    });
  }
  function _file2(Class, params) {
    return new Class({
      type: "file",
      ...util2.normalizeParams(params)
    });
  }
  function _transform(Class, fn) {
    return new Class({
      type: "transform",
      transform: fn
    });
  }
  function _optional(Class, innerType) {
    return new Class({
      type: "optional",
      innerType
    });
  }
  function _nullable(Class, innerType) {
    return new Class({
      type: "nullable",
      innerType
    });
  }
  function _default2(Class, innerType, defaultValue) {
    return new Class({
      type: "default",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function" ? defaultValue() : util2.shallowClone(defaultValue);
      }
    });
  }
  function _nonoptional(Class, innerType, params) {
    return new Class({
      type: "nonoptional",
      innerType,
      ...util2.normalizeParams(params)
    });
  }
  function _success(Class, innerType) {
    return new Class({
      type: "success",
      innerType
    });
  }
  function _catch2(Class, innerType, catchValue) {
    return new Class({
      type: "catch",
      innerType,
      catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
    });
  }
  function _pipe(Class, in_, out) {
    return new Class({
      type: "pipe",
      in: in_,
      out
    });
  }
  function _readonly(Class, innerType) {
    return new Class({
      type: "readonly",
      innerType
    });
  }
  function _templateLiteral(Class, parts, params) {
    return new Class({
      type: "template_literal",
      parts,
      ...util2.normalizeParams(params)
    });
  }
  function _lazy(Class, getter) {
    return new Class({
      type: "lazy",
      getter
    });
  }
  function _promise(Class, innerType) {
    return new Class({
      type: "promise",
      innerType
    });
  }
  function _custom2(Class, fn, _params) {
    const norm = util2.normalizeParams(_params);
    norm.abort ?? (norm.abort = true);
    const schema = new Class({
      type: "custom",
      check: "custom",
      fn,
      ...norm
    });
    return schema;
  }
  function _refine2(Class, fn, _params) {
    const schema = new Class({
      type: "custom",
      check: "custom",
      fn,
      ...util2.normalizeParams(_params)
    });
    return schema;
  }
  function _superRefine2(fn) {
    const ch = _check2((payload) => {
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(util2.issue(issue2, payload.value, ch._zod.def));
        } else {
          const _issue = issue2;
          if (_issue.fatal)
            _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = ch);
          _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
          payload.issues.push(util2.issue(_issue));
        }
      };
      return fn(payload.value, payload);
    });
    return ch;
  }
  function _check2(fn, params) {
    const ch = new checks2.$ZodCheck({
      check: "custom",
      ...util2.normalizeParams(params)
    });
    ch._zod.check = fn;
    return ch;
  }
  function _stringbool2(Classes, _params) {
    const params = util2.normalizeParams(_params);
    let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
    let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (params.case !== "sensitive") {
      truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
      falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
    }
    const truthySet = new Set(truthyArray);
    const falsySet = new Set(falsyArray);
    const _Codec = Classes.Codec ?? schemas2.$ZodCodec;
    const _Boolean = Classes.Boolean ?? schemas2.$ZodBoolean;
    const _String = Classes.String ?? schemas2.$ZodString;
    const stringSchema = new _String({ type: "string", error: params.error });
    const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
    const codec2 = new _Codec({
      type: "pipe",
      in: stringSchema,
      out: booleanSchema,
      transform: ((input, payload) => {
        let data = input;
        if (params.case !== "sensitive")
          data = data.toLowerCase();
        if (truthySet.has(data)) {
          return true;
        } else if (falsySet.has(data)) {
          return false;
        } else {
          payload.issues.push({
            code: "invalid_value",
            expected: "stringbool",
            values: [...truthySet, ...falsySet],
            input: payload.value,
            inst: codec2,
            continue: false
          });
          return {};
        }
      }),
      reverseTransform: ((input, _payload) => {
        if (input === true) {
          return truthyArray[0] || "true";
        } else {
          return falsyArray[0] || "false";
        }
      }),
      error: params.error
    });
    return codec2;
  }
  function _stringFormat2(Class, format, fnOrRegex, _params = {}) {
    const params = util2.normalizeParams(_params);
    const def = {
      ...util2.normalizeParams(_params),
      check: "string_format",
      type: "string",
      format,
      fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
      ...params
    };
    if (fnOrRegex instanceof RegExp) {
      def.pattern = fnOrRegex;
    }
    const inst = new Class(def);
    return inst;
  }
  return api;
}
var toJsonSchema = {};
var hasRequiredToJsonSchema;
function requireToJsonSchema() {
  if (hasRequiredToJsonSchema) return toJsonSchema;
  hasRequiredToJsonSchema = 1;
  Object.defineProperty(toJsonSchema, "__esModule", { value: true });
  toJsonSchema.JSONSchemaGenerator = void 0;
  toJsonSchema.toJSONSchema = toJSONSchema2;
  const registries_js_1 = requireRegistries();
  const util_js_1 = requireUtil();
  class JSONSchemaGenerator {
    constructor(params) {
      this.counter = 0;
      this.metadataRegistry = params?.metadata ?? registries_js_1.globalRegistry;
      this.target = params?.target ?? "draft-2020-12";
      this.unrepresentable = params?.unrepresentable ?? "throw";
      this.override = params?.override ?? (() => {
      });
      this.io = params?.io ?? "output";
      this.seen = /* @__PURE__ */ new Map();
    }
    process(schema, _params = { path: [], schemaPath: [] }) {
      var _a2;
      const def = schema._zod.def;
      const formatMap2 = {
        guid: "uuid",
        url: "uri",
        datetime: "date-time",
        json_string: "json-string",
        regex: ""
        // do not set
      };
      const seen = this.seen.get(schema);
      if (seen) {
        seen.count++;
        const isCycle = _params.schemaPath.includes(schema);
        if (isCycle) {
          seen.cycle = _params.path;
        }
        return seen.schema;
      }
      const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
      this.seen.set(schema, result);
      const overrideSchema = schema._zod.toJSONSchema?.();
      if (overrideSchema) {
        result.schema = overrideSchema;
      } else {
        const params = {
          ..._params,
          schemaPath: [..._params.schemaPath, schema],
          path: _params.path
        };
        const parent = schema._zod.parent;
        if (parent) {
          result.ref = parent;
          this.process(parent, params);
          this.seen.get(parent).isParent = true;
        } else {
          const _json = result.schema;
          switch (def.type) {
            case "string": {
              const json2 = _json;
              json2.type = "string";
              const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
              if (typeof minimum === "number")
                json2.minLength = minimum;
              if (typeof maximum === "number")
                json2.maxLength = maximum;
              if (format) {
                json2.format = formatMap2[format] ?? format;
                if (json2.format === "")
                  delete json2.format;
              }
              if (contentEncoding)
                json2.contentEncoding = contentEncoding;
              if (patterns && patterns.size > 0) {
                const regexes2 = [...patterns];
                if (regexes2.length === 1)
                  json2.pattern = regexes2[0].source;
                else if (regexes2.length > 1) {
                  result.schema.allOf = [
                    ...regexes2.map((regex) => ({
                      ...this.target === "draft-7" || this.target === "draft-4" || this.target === "openapi-3.0" ? { type: "string" } : {},
                      pattern: regex.source
                    }))
                  ];
                }
              }
              break;
            }
            case "number": {
              const json2 = _json;
              const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
              if (typeof format === "string" && format.includes("int"))
                json2.type = "integer";
              else
                json2.type = "number";
              if (typeof exclusiveMinimum === "number") {
                if (this.target === "draft-4" || this.target === "openapi-3.0") {
                  json2.minimum = exclusiveMinimum;
                  json2.exclusiveMinimum = true;
                } else {
                  json2.exclusiveMinimum = exclusiveMinimum;
                }
              }
              if (typeof minimum === "number") {
                json2.minimum = minimum;
                if (typeof exclusiveMinimum === "number" && this.target !== "draft-4") {
                  if (exclusiveMinimum >= minimum)
                    delete json2.minimum;
                  else
                    delete json2.exclusiveMinimum;
                }
              }
              if (typeof exclusiveMaximum === "number") {
                if (this.target === "draft-4" || this.target === "openapi-3.0") {
                  json2.maximum = exclusiveMaximum;
                  json2.exclusiveMaximum = true;
                } else {
                  json2.exclusiveMaximum = exclusiveMaximum;
                }
              }
              if (typeof maximum === "number") {
                json2.maximum = maximum;
                if (typeof exclusiveMaximum === "number" && this.target !== "draft-4") {
                  if (exclusiveMaximum <= maximum)
                    delete json2.maximum;
                  else
                    delete json2.exclusiveMaximum;
                }
              }
              if (typeof multipleOf === "number")
                json2.multipleOf = multipleOf;
              break;
            }
            case "boolean": {
              const json2 = _json;
              json2.type = "boolean";
              break;
            }
            case "bigint": {
              if (this.unrepresentable === "throw") {
                throw new Error("BigInt cannot be represented in JSON Schema");
              }
              break;
            }
            case "symbol": {
              if (this.unrepresentable === "throw") {
                throw new Error("Symbols cannot be represented in JSON Schema");
              }
              break;
            }
            case "null": {
              if (this.target === "openapi-3.0") {
                _json.type = "string";
                _json.nullable = true;
                _json.enum = [null];
              } else
                _json.type = "null";
              break;
            }
            case "any": {
              break;
            }
            case "unknown": {
              break;
            }
            case "undefined": {
              if (this.unrepresentable === "throw") {
                throw new Error("Undefined cannot be represented in JSON Schema");
              }
              break;
            }
            case "void": {
              if (this.unrepresentable === "throw") {
                throw new Error("Void cannot be represented in JSON Schema");
              }
              break;
            }
            case "never": {
              _json.not = {};
              break;
            }
            case "date": {
              if (this.unrepresentable === "throw") {
                throw new Error("Date cannot be represented in JSON Schema");
              }
              break;
            }
            case "array": {
              const json2 = _json;
              const { minimum, maximum } = schema._zod.bag;
              if (typeof minimum === "number")
                json2.minItems = minimum;
              if (typeof maximum === "number")
                json2.maxItems = maximum;
              json2.type = "array";
              json2.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
              break;
            }
            case "object": {
              const json2 = _json;
              json2.type = "object";
              json2.properties = {};
              const shape = def.shape;
              for (const key in shape) {
                json2.properties[key] = this.process(shape[key], {
                  ...params,
                  path: [...params.path, "properties", key]
                });
              }
              const allKeys = new Set(Object.keys(shape));
              const requiredKeys = new Set([...allKeys].filter((key) => {
                const v = def.shape[key]._zod;
                if (this.io === "input") {
                  return v.optin === void 0;
                } else {
                  return v.optout === void 0;
                }
              }));
              if (requiredKeys.size > 0) {
                json2.required = Array.from(requiredKeys);
              }
              if (def.catchall?._zod.def.type === "never") {
                json2.additionalProperties = false;
              } else if (!def.catchall) {
                if (this.io === "output")
                  json2.additionalProperties = false;
              } else if (def.catchall) {
                json2.additionalProperties = this.process(def.catchall, {
                  ...params,
                  path: [...params.path, "additionalProperties"]
                });
              }
              break;
            }
            case "union": {
              const json2 = _json;
              const options = def.options.map((x, i) => this.process(x, {
                ...params,
                path: [...params.path, "anyOf", i]
              }));
              json2.anyOf = options;
              break;
            }
            case "intersection": {
              const json2 = _json;
              const a = this.process(def.left, {
                ...params,
                path: [...params.path, "allOf", 0]
              });
              const b = this.process(def.right, {
                ...params,
                path: [...params.path, "allOf", 1]
              });
              const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
              const allOf = [
                ...isSimpleIntersection(a) ? a.allOf : [a],
                ...isSimpleIntersection(b) ? b.allOf : [b]
              ];
              json2.allOf = allOf;
              break;
            }
            case "tuple": {
              const json2 = _json;
              json2.type = "array";
              const prefixPath = this.target === "draft-2020-12" ? "prefixItems" : "items";
              const restPath = this.target === "draft-2020-12" ? "items" : this.target === "openapi-3.0" ? "items" : "additionalItems";
              const prefixItems = def.items.map((x, i) => this.process(x, {
                ...params,
                path: [...params.path, prefixPath, i]
              }));
              const rest = def.rest ? this.process(def.rest, {
                ...params,
                path: [...params.path, restPath, ...this.target === "openapi-3.0" ? [def.items.length] : []]
              }) : null;
              if (this.target === "draft-2020-12") {
                json2.prefixItems = prefixItems;
                if (rest) {
                  json2.items = rest;
                }
              } else if (this.target === "openapi-3.0") {
                json2.items = {
                  anyOf: prefixItems
                };
                if (rest) {
                  json2.items.anyOf.push(rest);
                }
                json2.minItems = prefixItems.length;
                if (!rest) {
                  json2.maxItems = prefixItems.length;
                }
              } else {
                json2.items = prefixItems;
                if (rest) {
                  json2.additionalItems = rest;
                }
              }
              const { minimum, maximum } = schema._zod.bag;
              if (typeof minimum === "number")
                json2.minItems = minimum;
              if (typeof maximum === "number")
                json2.maxItems = maximum;
              break;
            }
            case "record": {
              const json2 = _json;
              json2.type = "object";
              if (this.target === "draft-7" || this.target === "draft-2020-12") {
                json2.propertyNames = this.process(def.keyType, {
                  ...params,
                  path: [...params.path, "propertyNames"]
                });
              }
              json2.additionalProperties = this.process(def.valueType, {
                ...params,
                path: [...params.path, "additionalProperties"]
              });
              break;
            }
            case "map": {
              if (this.unrepresentable === "throw") {
                throw new Error("Map cannot be represented in JSON Schema");
              }
              break;
            }
            case "set": {
              if (this.unrepresentable === "throw") {
                throw new Error("Set cannot be represented in JSON Schema");
              }
              break;
            }
            case "enum": {
              const json2 = _json;
              const values = (0, util_js_1.getEnumValues)(def.entries);
              if (values.every((v) => typeof v === "number"))
                json2.type = "number";
              if (values.every((v) => typeof v === "string"))
                json2.type = "string";
              json2.enum = values;
              break;
            }
            case "literal": {
              const json2 = _json;
              const vals = [];
              for (const val of def.values) {
                if (val === void 0) {
                  if (this.unrepresentable === "throw") {
                    throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                  }
                } else if (typeof val === "bigint") {
                  if (this.unrepresentable === "throw") {
                    throw new Error("BigInt literals cannot be represented in JSON Schema");
                  } else {
                    vals.push(Number(val));
                  }
                } else {
                  vals.push(val);
                }
              }
              if (vals.length === 0) ;
              else if (vals.length === 1) {
                const val = vals[0];
                json2.type = val === null ? "null" : typeof val;
                if (this.target === "draft-4" || this.target === "openapi-3.0") {
                  json2.enum = [val];
                } else {
                  json2.const = val;
                }
              } else {
                if (vals.every((v) => typeof v === "number"))
                  json2.type = "number";
                if (vals.every((v) => typeof v === "string"))
                  json2.type = "string";
                if (vals.every((v) => typeof v === "boolean"))
                  json2.type = "string";
                if (vals.every((v) => v === null))
                  json2.type = "null";
                json2.enum = vals;
              }
              break;
            }
            case "file": {
              const json2 = _json;
              const file2 = {
                type: "string",
                format: "binary",
                contentEncoding: "binary"
              };
              const { minimum, maximum, mime } = schema._zod.bag;
              if (minimum !== void 0)
                file2.minLength = minimum;
              if (maximum !== void 0)
                file2.maxLength = maximum;
              if (mime) {
                if (mime.length === 1) {
                  file2.contentMediaType = mime[0];
                  Object.assign(json2, file2);
                } else {
                  json2.anyOf = mime.map((m) => {
                    const mFile = { ...file2, contentMediaType: m };
                    return mFile;
                  });
                }
              } else {
                Object.assign(json2, file2);
              }
              break;
            }
            case "transform": {
              if (this.unrepresentable === "throw") {
                throw new Error("Transforms cannot be represented in JSON Schema");
              }
              break;
            }
            case "nullable": {
              const inner = this.process(def.innerType, params);
              if (this.target === "openapi-3.0") {
                result.ref = def.innerType;
                _json.nullable = true;
              } else {
                _json.anyOf = [inner, { type: "null" }];
              }
              break;
            }
            case "nonoptional": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              break;
            }
            case "success": {
              const json2 = _json;
              json2.type = "boolean";
              break;
            }
            case "default": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              _json.default = JSON.parse(JSON.stringify(def.defaultValue));
              break;
            }
            case "prefault": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              if (this.io === "input")
                _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
              break;
            }
            case "catch": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              let catchValue;
              try {
                catchValue = def.catchValue(void 0);
              } catch {
                throw new Error("Dynamic catch values are not supported in JSON Schema");
              }
              _json.default = catchValue;
              break;
            }
            case "nan": {
              if (this.unrepresentable === "throw") {
                throw new Error("NaN cannot be represented in JSON Schema");
              }
              break;
            }
            case "template_literal": {
              const json2 = _json;
              const pattern = schema._zod.pattern;
              if (!pattern)
                throw new Error("Pattern not found in template literal");
              json2.type = "string";
              json2.pattern = pattern.source;
              break;
            }
            case "pipe": {
              const innerType = this.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
              this.process(innerType, params);
              result.ref = innerType;
              break;
            }
            case "readonly": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              _json.readOnly = true;
              break;
            }
            // passthrough types
            case "promise": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              break;
            }
            case "optional": {
              this.process(def.innerType, params);
              result.ref = def.innerType;
              break;
            }
            case "lazy": {
              const innerType = schema._zod.innerType;
              this.process(innerType, params);
              result.ref = innerType;
              break;
            }
            case "custom": {
              if (this.unrepresentable === "throw") {
                throw new Error("Custom types cannot be represented in JSON Schema");
              }
              break;
            }
            case "function": {
              if (this.unrepresentable === "throw") {
                throw new Error("Function types cannot be represented in JSON Schema");
              }
              break;
            }
          }
        }
      }
      const meta2 = this.metadataRegistry.get(schema);
      if (meta2)
        Object.assign(result.schema, meta2);
      if (this.io === "input" && isTransforming2(schema)) {
        delete result.schema.examples;
        delete result.schema.default;
      }
      if (this.io === "input" && result.schema._prefault)
        (_a2 = result.schema).default ?? (_a2.default = result.schema._prefault);
      delete result.schema._prefault;
      const _result = this.seen.get(schema);
      return _result.schema;
    }
    emit(schema, _params) {
      const params = {
        cycles: _params?.cycles ?? "ref",
        reused: _params?.reused ?? "inline",
        // unrepresentable: _params?.unrepresentable ?? "throw",
        // uri: _params?.uri ?? ((id) => `${id}`),
        external: _params?.external ?? void 0
      };
      const root = this.seen.get(schema);
      if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
      const makeURI = (entry) => {
        const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
        if (params.external) {
          const externalId = params.external.registry.get(entry[0])?.id;
          const uriGenerator = params.external.uri ?? ((id3) => id3);
          if (externalId) {
            return { ref: uriGenerator(externalId) };
          }
          const id2 = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
          entry[1].defId = id2;
          return { defId: id2, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id2}` };
        }
        if (entry[1] === root) {
          return { ref: "#" };
        }
        const uriPrefix = `#`;
        const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
        const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
        return { defId, ref: defUriPrefix + defId };
      };
      const extractToDef = (entry) => {
        if (entry[1].schema.$ref) {
          return;
        }
        const seen = entry[1];
        const { ref, defId } = makeURI(entry);
        seen.def = { ...seen.schema };
        if (defId)
          seen.defId = defId;
        const schema2 = seen.schema;
        for (const key in schema2) {
          delete schema2[key];
        }
        schema2.$ref = ref;
      };
      if (params.cycles === "throw") {
        for (const entry of this.seen.entries()) {
          const seen = entry[1];
          if (seen.cycle) {
            throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
          }
        }
      }
      for (const entry of this.seen.entries()) {
        const seen = entry[1];
        if (schema === entry[0]) {
          extractToDef(entry);
          continue;
        }
        if (params.external) {
          const ext = params.external.registry.get(entry[0])?.id;
          if (schema !== entry[0] && ext) {
            extractToDef(entry);
            continue;
          }
        }
        const id2 = this.metadataRegistry.get(entry[0])?.id;
        if (id2) {
          extractToDef(entry);
          continue;
        }
        if (seen.cycle) {
          extractToDef(entry);
          continue;
        }
        if (seen.count > 1) {
          if (params.reused === "ref") {
            extractToDef(entry);
            continue;
          }
        }
      }
      const flattenRef = (zodSchema, params2) => {
        const seen = this.seen.get(zodSchema);
        const schema2 = seen.def ?? seen.schema;
        const _cached = { ...schema2 };
        if (seen.ref === null) {
          return;
        }
        const ref = seen.ref;
        seen.ref = null;
        if (ref) {
          flattenRef(ref, params2);
          const refSchema = this.seen.get(ref).schema;
          if (refSchema.$ref && (params2.target === "draft-7" || params2.target === "draft-4" || params2.target === "openapi-3.0")) {
            schema2.allOf = schema2.allOf ?? [];
            schema2.allOf.push(refSchema);
          } else {
            Object.assign(schema2, refSchema);
            Object.assign(schema2, _cached);
          }
        }
        if (!seen.isParent)
          this.override({
            zodSchema,
            jsonSchema: schema2,
            path: seen.path ?? []
          });
      };
      for (const entry of [...this.seen.entries()].reverse()) {
        flattenRef(entry[0], { target: this.target });
      }
      const result = {};
      if (this.target === "draft-2020-12") {
        result.$schema = "https://json-schema.org/draft/2020-12/schema";
      } else if (this.target === "draft-7") {
        result.$schema = "http://json-schema.org/draft-07/schema#";
      } else if (this.target === "draft-4") {
        result.$schema = "http://json-schema.org/draft-04/schema#";
      } else if (this.target === "openapi-3.0") ;
      else {
        console.warn(`Invalid target: ${this.target}`);
      }
      if (params.external?.uri) {
        const id2 = params.external.registry.get(schema)?.id;
        if (!id2)
          throw new Error("Schema is missing an `id` property");
        result.$id = params.external.uri(id2);
      }
      Object.assign(result, root.def);
      const defs = params.external?.defs ?? {};
      for (const entry of this.seen.entries()) {
        const seen = entry[1];
        if (seen.def && seen.defId) {
          defs[seen.defId] = seen.def;
        }
      }
      if (params.external) ;
      else {
        if (Object.keys(defs).length > 0) {
          if (this.target === "draft-2020-12") {
            result.$defs = defs;
          } else {
            result.definitions = defs;
          }
        }
      }
      try {
        return JSON.parse(JSON.stringify(result));
      } catch (_err) {
        throw new Error("Error converting schema to JSON.");
      }
    }
  }
  toJsonSchema.JSONSchemaGenerator = JSONSchemaGenerator;
  function toJSONSchema2(input, _params) {
    if (input instanceof registries_js_1.$ZodRegistry) {
      const gen2 = new JSONSchemaGenerator(_params);
      const defs = {};
      for (const entry of input._idmap.entries()) {
        const [_, schema] = entry;
        gen2.process(schema);
      }
      const schemas2 = {};
      const external2 = {
        registry: input,
        uri: _params?.uri,
        defs
      };
      for (const entry of input._idmap.entries()) {
        const [key, schema] = entry;
        schemas2[key] = gen2.emit(schema, {
          ..._params,
          external: external2
        });
      }
      if (Object.keys(defs).length > 0) {
        const defsSegment = gen2.target === "draft-2020-12" ? "$defs" : "definitions";
        schemas2.__shared = {
          [defsSegment]: defs
        };
      }
      return { schemas: schemas2 };
    }
    const gen = new JSONSchemaGenerator(_params);
    gen.process(input);
    return gen.emit(input, _params);
  }
  function isTransforming2(_schema, _ctx) {
    const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
    if (ctx.seen.has(_schema))
      return false;
    ctx.seen.add(_schema);
    const schema = _schema;
    const def = schema._zod.def;
    switch (def.type) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      case "date":
      case "symbol":
      case "undefined":
      case "null":
      case "any":
      case "unknown":
      case "never":
      case "void":
      case "literal":
      case "enum":
      case "nan":
      case "file":
      case "template_literal":
        return false;
      case "array": {
        return isTransforming2(def.element, ctx);
      }
      case "object": {
        for (const key in def.shape) {
          if (isTransforming2(def.shape[key], ctx))
            return true;
        }
        return false;
      }
      case "union": {
        for (const option of def.options) {
          if (isTransforming2(option, ctx))
            return true;
        }
        return false;
      }
      case "intersection": {
        return isTransforming2(def.left, ctx) || isTransforming2(def.right, ctx);
      }
      case "tuple": {
        for (const item of def.items) {
          if (isTransforming2(item, ctx))
            return true;
        }
        if (def.rest && isTransforming2(def.rest, ctx))
          return true;
        return false;
      }
      case "record": {
        return isTransforming2(def.keyType, ctx) || isTransforming2(def.valueType, ctx);
      }
      case "map": {
        return isTransforming2(def.keyType, ctx) || isTransforming2(def.valueType, ctx);
      }
      case "set": {
        return isTransforming2(def.valueType, ctx);
      }
      // inner types
      case "promise":
      case "optional":
      case "nonoptional":
      case "nullable":
      case "readonly":
        return isTransforming2(def.innerType, ctx);
      case "lazy":
        return isTransforming2(def.getter(), ctx);
      case "default": {
        return isTransforming2(def.innerType, ctx);
      }
      case "prefault": {
        return isTransforming2(def.innerType, ctx);
      }
      case "custom": {
        return false;
      }
      case "transform": {
        return true;
      }
      case "pipe": {
        return isTransforming2(def.in, ctx) || isTransforming2(def.out, ctx);
      }
      case "success": {
        return false;
      }
      case "catch": {
        return false;
      }
      case "function": {
        return false;
      }
    }
    throw new Error(`Unknown schema type: ${def.type}`);
  }
  return toJsonSchema;
}
var jsonSchema = {};
var hasRequiredJsonSchema;
function requireJsonSchema() {
  if (hasRequiredJsonSchema) return jsonSchema;
  hasRequiredJsonSchema = 1;
  Object.defineProperty(jsonSchema, "__esModule", { value: true });
  return jsonSchema;
}
var hasRequiredCore;
function requireCore() {
  if (hasRequiredCore) return core$1;
  hasRequiredCore = 1;
  (function(exports) {
    var __createBinding = core$1 && core$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = core$1 && core$1.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = core$1 && core$1.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importStar = core$1 && core$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONSchema = exports.locales = exports.regexes = exports.util = void 0;
    __exportStar(requireCore$1(), exports);
    __exportStar(requireParse$1(), exports);
    __exportStar(requireErrors$1(), exports);
    __exportStar(requireSchemas$1(), exports);
    __exportStar(requireChecks$1(), exports);
    __exportStar(requireVersions(), exports);
    exports.util = __importStar(requireUtil());
    exports.regexes = __importStar(requireRegexes());
    exports.locales = __importStar(requireLocales());
    __exportStar(requireRegistries(), exports);
    __exportStar(requireDoc(), exports);
    __exportStar(requireApi(), exports);
    __exportStar(requireToJsonSchema(), exports);
    exports.JSONSchema = __importStar(requireJsonSchema());
  })(core$1);
  return core$1;
}
var schemas = {};
var checks = {};
var hasRequiredChecks;
function requireChecks() {
  if (hasRequiredChecks) return checks;
  hasRequiredChecks = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUpperCase = exports.toLowerCase = exports.trim = exports.normalize = exports.overwrite = exports.mime = exports.property = exports.endsWith = exports.startsWith = exports.includes = exports.uppercase = exports.lowercase = exports.regex = exports.length = exports.minLength = exports.maxLength = exports.size = exports.minSize = exports.maxSize = exports.multipleOf = exports.nonnegative = exports.nonpositive = exports.negative = exports.positive = exports.gte = exports.gt = exports.lte = exports.lt = void 0;
    var index_js_1 = requireCore();
    Object.defineProperty(exports, "lt", { enumerable: true, get: function() {
      return index_js_1._lt;
    } });
    Object.defineProperty(exports, "lte", { enumerable: true, get: function() {
      return index_js_1._lte;
    } });
    Object.defineProperty(exports, "gt", { enumerable: true, get: function() {
      return index_js_1._gt;
    } });
    Object.defineProperty(exports, "gte", { enumerable: true, get: function() {
      return index_js_1._gte;
    } });
    Object.defineProperty(exports, "positive", { enumerable: true, get: function() {
      return index_js_1._positive;
    } });
    Object.defineProperty(exports, "negative", { enumerable: true, get: function() {
      return index_js_1._negative;
    } });
    Object.defineProperty(exports, "nonpositive", { enumerable: true, get: function() {
      return index_js_1._nonpositive;
    } });
    Object.defineProperty(exports, "nonnegative", { enumerable: true, get: function() {
      return index_js_1._nonnegative;
    } });
    Object.defineProperty(exports, "multipleOf", { enumerable: true, get: function() {
      return index_js_1._multipleOf;
    } });
    Object.defineProperty(exports, "maxSize", { enumerable: true, get: function() {
      return index_js_1._maxSize;
    } });
    Object.defineProperty(exports, "minSize", { enumerable: true, get: function() {
      return index_js_1._minSize;
    } });
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return index_js_1._size;
    } });
    Object.defineProperty(exports, "maxLength", { enumerable: true, get: function() {
      return index_js_1._maxLength;
    } });
    Object.defineProperty(exports, "minLength", { enumerable: true, get: function() {
      return index_js_1._minLength;
    } });
    Object.defineProperty(exports, "length", { enumerable: true, get: function() {
      return index_js_1._length;
    } });
    Object.defineProperty(exports, "regex", { enumerable: true, get: function() {
      return index_js_1._regex;
    } });
    Object.defineProperty(exports, "lowercase", { enumerable: true, get: function() {
      return index_js_1._lowercase;
    } });
    Object.defineProperty(exports, "uppercase", { enumerable: true, get: function() {
      return index_js_1._uppercase;
    } });
    Object.defineProperty(exports, "includes", { enumerable: true, get: function() {
      return index_js_1._includes;
    } });
    Object.defineProperty(exports, "startsWith", { enumerable: true, get: function() {
      return index_js_1._startsWith;
    } });
    Object.defineProperty(exports, "endsWith", { enumerable: true, get: function() {
      return index_js_1._endsWith;
    } });
    Object.defineProperty(exports, "property", { enumerable: true, get: function() {
      return index_js_1._property;
    } });
    Object.defineProperty(exports, "mime", { enumerable: true, get: function() {
      return index_js_1._mime;
    } });
    Object.defineProperty(exports, "overwrite", { enumerable: true, get: function() {
      return index_js_1._overwrite;
    } });
    Object.defineProperty(exports, "normalize", { enumerable: true, get: function() {
      return index_js_1._normalize;
    } });
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return index_js_1._trim;
    } });
    Object.defineProperty(exports, "toLowerCase", { enumerable: true, get: function() {
      return index_js_1._toLowerCase;
    } });
    Object.defineProperty(exports, "toUpperCase", { enumerable: true, get: function() {
      return index_js_1._toUpperCase;
    } });
  })(checks);
  return checks;
}
var iso = {};
var hasRequiredIso;
function requireIso() {
  if (hasRequiredIso) return iso;
  hasRequiredIso = 1;
  (function(exports) {
    var __createBinding = iso && iso.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = iso && iso.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = iso && iso.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodISODuration = exports.ZodISOTime = exports.ZodISODate = exports.ZodISODateTime = void 0;
    exports.datetime = datetime2;
    exports.date = date2;
    exports.time = time2;
    exports.duration = duration2;
    const core2 = __importStar(requireCore());
    const schemas2 = __importStar(requireSchemas());
    exports.ZodISODateTime = core2.$constructor("ZodISODateTime", (inst, def) => {
      core2.$ZodISODateTime.init(inst, def);
      schemas2.ZodStringFormat.init(inst, def);
    });
    function datetime2(params) {
      return core2._isoDateTime(exports.ZodISODateTime, params);
    }
    exports.ZodISODate = core2.$constructor("ZodISODate", (inst, def) => {
      core2.$ZodISODate.init(inst, def);
      schemas2.ZodStringFormat.init(inst, def);
    });
    function date2(params) {
      return core2._isoDate(exports.ZodISODate, params);
    }
    exports.ZodISOTime = core2.$constructor("ZodISOTime", (inst, def) => {
      core2.$ZodISOTime.init(inst, def);
      schemas2.ZodStringFormat.init(inst, def);
    });
    function time2(params) {
      return core2._isoTime(exports.ZodISOTime, params);
    }
    exports.ZodISODuration = core2.$constructor("ZodISODuration", (inst, def) => {
      core2.$ZodISODuration.init(inst, def);
      schemas2.ZodStringFormat.init(inst, def);
    });
    function duration2(params) {
      return core2._isoDuration(exports.ZodISODuration, params);
    }
  })(iso);
  return iso;
}
var parse = {};
var errors = {};
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  var __createBinding = errors && errors.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = errors && errors.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = errors && errors.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(errors, "__esModule", { value: true });
  errors.ZodRealError = errors.ZodError = void 0;
  const core2 = __importStar(requireCore());
  const index_js_1 = requireCore();
  const util2 = __importStar(requireUtil());
  const initializer2 = (inst, issues) => {
    index_js_1.$ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
      format: {
        value: (mapper) => core2.formatError(inst, mapper)
        // enumerable: false,
      },
      flatten: {
        value: (mapper) => core2.flattenError(inst, mapper)
        // enumerable: false,
      },
      addIssue: {
        value: (issue2) => {
          inst.issues.push(issue2);
          inst.message = JSON.stringify(inst.issues, util2.jsonStringifyReplacer, 2);
        }
        // enumerable: false,
      },
      addIssues: {
        value: (issues2) => {
          inst.issues.push(...issues2);
          inst.message = JSON.stringify(inst.issues, util2.jsonStringifyReplacer, 2);
        }
        // enumerable: false,
      },
      isEmpty: {
        get() {
          return inst.issues.length === 0;
        }
        // enumerable: false,
      }
    });
  };
  errors.ZodError = core2.$constructor("ZodError", initializer2);
  errors.ZodRealError = core2.$constructor("ZodError", initializer2, {
    Parent: Error
  });
  return errors;
}
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse;
  hasRequiredParse = 1;
  var __createBinding = parse && parse.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = parse && parse.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = parse && parse.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(parse, "__esModule", { value: true });
  parse.safeDecodeAsync = parse.safeEncodeAsync = parse.safeDecode = parse.safeEncode = parse.decodeAsync = parse.encodeAsync = parse.decode = parse.encode = parse.safeParseAsync = parse.safeParse = parse.parseAsync = parse.parse = void 0;
  const core2 = __importStar(requireCore());
  const errors_js_1 = requireErrors();
  parse.parse = core2._parse(errors_js_1.ZodRealError);
  parse.parseAsync = core2._parseAsync(errors_js_1.ZodRealError);
  parse.safeParse = core2._safeParse(errors_js_1.ZodRealError);
  parse.safeParseAsync = core2._safeParseAsync(errors_js_1.ZodRealError);
  parse.encode = core2._encode(errors_js_1.ZodRealError);
  parse.decode = core2._decode(errors_js_1.ZodRealError);
  parse.encodeAsync = core2._encodeAsync(errors_js_1.ZodRealError);
  parse.decodeAsync = core2._decodeAsync(errors_js_1.ZodRealError);
  parse.safeEncode = core2._safeEncode(errors_js_1.ZodRealError);
  parse.safeDecode = core2._safeDecode(errors_js_1.ZodRealError);
  parse.safeEncodeAsync = core2._safeEncodeAsync(errors_js_1.ZodRealError);
  parse.safeDecodeAsync = core2._safeDecodeAsync(errors_js_1.ZodRealError);
  return parse;
}
var hasRequiredSchemas;
function requireSchemas() {
  if (hasRequiredSchemas) return schemas;
  hasRequiredSchemas = 1;
  (function(exports) {
    var __createBinding = schemas && schemas.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = schemas && schemas.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = schemas && schemas.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodTransform = exports.ZodFile = exports.ZodLiteral = exports.ZodEnum = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodUnion = exports.ZodObject = exports.ZodArray = exports.ZodDate = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodBigIntFormat = exports.ZodBigInt = exports.ZodBoolean = exports.ZodNumberFormat = exports.ZodNumber = exports.ZodCustomStringFormat = exports.ZodJWT = exports.ZodE164 = exports.ZodBase64URL = exports.ZodBase64 = exports.ZodCIDRv6 = exports.ZodCIDRv4 = exports.ZodIPv6 = exports.ZodIPv4 = exports.ZodKSUID = exports.ZodXID = exports.ZodULID = exports.ZodCUID2 = exports.ZodCUID = exports.ZodNanoID = exports.ZodEmoji = exports.ZodURL = exports.ZodUUID = exports.ZodGUID = exports.ZodEmail = exports.ZodStringFormat = exports.ZodString = exports._ZodString = exports.ZodType = void 0;
    exports.stringbool = exports.ZodCustom = exports.ZodFunction = exports.ZodPromise = exports.ZodLazy = exports.ZodTemplateLiteral = exports.ZodReadonly = exports.ZodCodec = exports.ZodPipe = exports.ZodNaN = exports.ZodCatch = exports.ZodSuccess = exports.ZodNonOptional = exports.ZodPrefault = exports.ZodDefault = exports.ZodNullable = exports.ZodOptional = void 0;
    exports.string = string2;
    exports.email = email2;
    exports.guid = guid2;
    exports.uuid = uuid2;
    exports.uuidv4 = uuidv42;
    exports.uuidv6 = uuidv62;
    exports.uuidv7 = uuidv72;
    exports.url = url2;
    exports.httpUrl = httpUrl2;
    exports.emoji = emoji2;
    exports.nanoid = nanoid2;
    exports.cuid = cuid3;
    exports.cuid2 = cuid22;
    exports.ulid = ulid2;
    exports.xid = xid2;
    exports.ksuid = ksuid2;
    exports.ipv4 = ipv42;
    exports.ipv6 = ipv62;
    exports.cidrv4 = cidrv42;
    exports.cidrv6 = cidrv62;
    exports.base64 = base642;
    exports.base64url = base64url2;
    exports.e164 = e1642;
    exports.jwt = jwt2;
    exports.stringFormat = stringFormat2;
    exports.hostname = hostname2;
    exports.hex = hex2;
    exports.hash = hash2;
    exports.number = number2;
    exports.int = int2;
    exports.float32 = float322;
    exports.float64 = float642;
    exports.int32 = int322;
    exports.uint32 = uint322;
    exports.boolean = boolean2;
    exports.bigint = bigint2;
    exports.int64 = int642;
    exports.uint64 = uint642;
    exports.symbol = symbol2;
    exports.undefined = _undefined2;
    exports.null = _null2;
    exports.any = any2;
    exports.unknown = unknown2;
    exports.never = never2;
    exports.void = _void2;
    exports.date = date2;
    exports.array = array2;
    exports.keyof = keyof2;
    exports.object = object2;
    exports.strictObject = strictObject2;
    exports.looseObject = looseObject2;
    exports.union = union2;
    exports.discriminatedUnion = discriminatedUnion2;
    exports.intersection = intersection2;
    exports.tuple = tuple2;
    exports.record = record2;
    exports.partialRecord = partialRecord2;
    exports.map = map2;
    exports.set = set2;
    exports.enum = _enum2;
    exports.nativeEnum = nativeEnum2;
    exports.literal = literal2;
    exports.file = file2;
    exports.transform = transform2;
    exports.optional = optional2;
    exports.nullable = nullable2;
    exports.nullish = nullish2;
    exports._default = _default2;
    exports.prefault = prefault2;
    exports.nonoptional = nonoptional2;
    exports.success = success2;
    exports.catch = _catch2;
    exports.nan = nan2;
    exports.pipe = pipe2;
    exports.codec = codec2;
    exports.readonly = readonly2;
    exports.templateLiteral = templateLiteral2;
    exports.lazy = lazy2;
    exports.promise = promise2;
    exports._function = _function2;
    exports.function = _function2;
    exports._function = _function2;
    exports.function = _function2;
    exports.check = check2;
    exports.custom = custom2;
    exports.refine = refine2;
    exports.superRefine = superRefine2;
    exports.instanceof = _instanceof2;
    exports.json = json2;
    exports.preprocess = preprocess2;
    const core2 = __importStar(requireCore());
    const index_js_1 = requireCore();
    const checks2 = __importStar(requireChecks());
    const iso2 = __importStar(requireIso());
    const parse2 = __importStar(requireParse());
    exports.ZodType = core2.$constructor("ZodType", (inst, def) => {
      core2.$ZodType.init(inst, def);
      inst.def = def;
      inst.type = def.type;
      Object.defineProperty(inst, "_def", { value: def });
      inst.check = (...checks3) => {
        return inst.clone(index_js_1.util.mergeDefs(def, {
          checks: [
            ...def.checks ?? [],
            ...checks3.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
          ]
        }));
      };
      inst.clone = (def2, params) => core2.clone(inst, def2, params);
      inst.brand = () => inst;
      inst.register = ((reg, meta2) => {
        reg.add(inst, meta2);
        return inst;
      });
      inst.parse = (data, params) => parse2.parse(inst, data, params, { callee: inst.parse });
      inst.safeParse = (data, params) => parse2.safeParse(inst, data, params);
      inst.parseAsync = async (data, params) => parse2.parseAsync(inst, data, params, { callee: inst.parseAsync });
      inst.safeParseAsync = async (data, params) => parse2.safeParseAsync(inst, data, params);
      inst.spa = inst.safeParseAsync;
      inst.encode = (data, params) => parse2.encode(inst, data, params);
      inst.decode = (data, params) => parse2.decode(inst, data, params);
      inst.encodeAsync = async (data, params) => parse2.encodeAsync(inst, data, params);
      inst.decodeAsync = async (data, params) => parse2.decodeAsync(inst, data, params);
      inst.safeEncode = (data, params) => parse2.safeEncode(inst, data, params);
      inst.safeDecode = (data, params) => parse2.safeDecode(inst, data, params);
      inst.safeEncodeAsync = async (data, params) => parse2.safeEncodeAsync(inst, data, params);
      inst.safeDecodeAsync = async (data, params) => parse2.safeDecodeAsync(inst, data, params);
      inst.refine = (check3, params) => inst.check(refine2(check3, params));
      inst.superRefine = (refinement) => inst.check(superRefine2(refinement));
      inst.overwrite = (fn) => inst.check(checks2.overwrite(fn));
      inst.optional = () => optional2(inst);
      inst.nullable = () => nullable2(inst);
      inst.nullish = () => optional2(nullable2(inst));
      inst.nonoptional = (params) => nonoptional2(inst, params);
      inst.array = () => array2(inst);
      inst.or = (arg) => union2([inst, arg]);
      inst.and = (arg) => intersection2(inst, arg);
      inst.transform = (tx) => pipe2(inst, transform2(tx));
      inst.default = (def2) => _default2(inst, def2);
      inst.prefault = (def2) => prefault2(inst, def2);
      inst.catch = (params) => _catch2(inst, params);
      inst.pipe = (target) => pipe2(inst, target);
      inst.readonly = () => readonly2(inst);
      inst.describe = (description) => {
        const cl = inst.clone();
        core2.globalRegistry.add(cl, { description });
        return cl;
      };
      Object.defineProperty(inst, "description", {
        get() {
          return core2.globalRegistry.get(inst)?.description;
        },
        configurable: true
      });
      inst.meta = (...args) => {
        if (args.length === 0) {
          return core2.globalRegistry.get(inst);
        }
        const cl = inst.clone();
        core2.globalRegistry.add(cl, args[0]);
        return cl;
      };
      inst.isOptional = () => inst.safeParse(void 0).success;
      inst.isNullable = () => inst.safeParse(null).success;
      return inst;
    });
    exports._ZodString = core2.$constructor("_ZodString", (inst, def) => {
      core2.$ZodString.init(inst, def);
      exports.ZodType.init(inst, def);
      const bag = inst._zod.bag;
      inst.format = bag.format ?? null;
      inst.minLength = bag.minimum ?? null;
      inst.maxLength = bag.maximum ?? null;
      inst.regex = (...args) => inst.check(checks2.regex(...args));
      inst.includes = (...args) => inst.check(checks2.includes(...args));
      inst.startsWith = (...args) => inst.check(checks2.startsWith(...args));
      inst.endsWith = (...args) => inst.check(checks2.endsWith(...args));
      inst.min = (...args) => inst.check(checks2.minLength(...args));
      inst.max = (...args) => inst.check(checks2.maxLength(...args));
      inst.length = (...args) => inst.check(checks2.length(...args));
      inst.nonempty = (...args) => inst.check(checks2.minLength(1, ...args));
      inst.lowercase = (params) => inst.check(checks2.lowercase(params));
      inst.uppercase = (params) => inst.check(checks2.uppercase(params));
      inst.trim = () => inst.check(checks2.trim());
      inst.normalize = (...args) => inst.check(checks2.normalize(...args));
      inst.toLowerCase = () => inst.check(checks2.toLowerCase());
      inst.toUpperCase = () => inst.check(checks2.toUpperCase());
    });
    exports.ZodString = core2.$constructor("ZodString", (inst, def) => {
      core2.$ZodString.init(inst, def);
      exports._ZodString.init(inst, def);
      inst.email = (params) => inst.check(core2._email(exports.ZodEmail, params));
      inst.url = (params) => inst.check(core2._url(exports.ZodURL, params));
      inst.jwt = (params) => inst.check(core2._jwt(exports.ZodJWT, params));
      inst.emoji = (params) => inst.check(core2._emoji(exports.ZodEmoji, params));
      inst.guid = (params) => inst.check(core2._guid(exports.ZodGUID, params));
      inst.uuid = (params) => inst.check(core2._uuid(exports.ZodUUID, params));
      inst.uuidv4 = (params) => inst.check(core2._uuidv4(exports.ZodUUID, params));
      inst.uuidv6 = (params) => inst.check(core2._uuidv6(exports.ZodUUID, params));
      inst.uuidv7 = (params) => inst.check(core2._uuidv7(exports.ZodUUID, params));
      inst.nanoid = (params) => inst.check(core2._nanoid(exports.ZodNanoID, params));
      inst.guid = (params) => inst.check(core2._guid(exports.ZodGUID, params));
      inst.cuid = (params) => inst.check(core2._cuid(exports.ZodCUID, params));
      inst.cuid2 = (params) => inst.check(core2._cuid2(exports.ZodCUID2, params));
      inst.ulid = (params) => inst.check(core2._ulid(exports.ZodULID, params));
      inst.base64 = (params) => inst.check(core2._base64(exports.ZodBase64, params));
      inst.base64url = (params) => inst.check(core2._base64url(exports.ZodBase64URL, params));
      inst.xid = (params) => inst.check(core2._xid(exports.ZodXID, params));
      inst.ksuid = (params) => inst.check(core2._ksuid(exports.ZodKSUID, params));
      inst.ipv4 = (params) => inst.check(core2._ipv4(exports.ZodIPv4, params));
      inst.ipv6 = (params) => inst.check(core2._ipv6(exports.ZodIPv6, params));
      inst.cidrv4 = (params) => inst.check(core2._cidrv4(exports.ZodCIDRv4, params));
      inst.cidrv6 = (params) => inst.check(core2._cidrv6(exports.ZodCIDRv6, params));
      inst.e164 = (params) => inst.check(core2._e164(exports.ZodE164, params));
      inst.datetime = (params) => inst.check(iso2.datetime(params));
      inst.date = (params) => inst.check(iso2.date(params));
      inst.time = (params) => inst.check(iso2.time(params));
      inst.duration = (params) => inst.check(iso2.duration(params));
    });
    function string2(params) {
      return core2._string(exports.ZodString, params);
    }
    exports.ZodStringFormat = core2.$constructor("ZodStringFormat", (inst, def) => {
      core2.$ZodStringFormat.init(inst, def);
      exports._ZodString.init(inst, def);
    });
    exports.ZodEmail = core2.$constructor("ZodEmail", (inst, def) => {
      core2.$ZodEmail.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function email2(params) {
      return core2._email(exports.ZodEmail, params);
    }
    exports.ZodGUID = core2.$constructor("ZodGUID", (inst, def) => {
      core2.$ZodGUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function guid2(params) {
      return core2._guid(exports.ZodGUID, params);
    }
    exports.ZodUUID = core2.$constructor("ZodUUID", (inst, def) => {
      core2.$ZodUUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function uuid2(params) {
      return core2._uuid(exports.ZodUUID, params);
    }
    function uuidv42(params) {
      return core2._uuidv4(exports.ZodUUID, params);
    }
    function uuidv62(params) {
      return core2._uuidv6(exports.ZodUUID, params);
    }
    function uuidv72(params) {
      return core2._uuidv7(exports.ZodUUID, params);
    }
    exports.ZodURL = core2.$constructor("ZodURL", (inst, def) => {
      core2.$ZodURL.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function url2(params) {
      return core2._url(exports.ZodURL, params);
    }
    function httpUrl2(params) {
      return core2._url(exports.ZodURL, {
        protocol: /^https?$/,
        hostname: core2.regexes.domain,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodEmoji = core2.$constructor("ZodEmoji", (inst, def) => {
      core2.$ZodEmoji.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function emoji2(params) {
      return core2._emoji(exports.ZodEmoji, params);
    }
    exports.ZodNanoID = core2.$constructor("ZodNanoID", (inst, def) => {
      core2.$ZodNanoID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function nanoid2(params) {
      return core2._nanoid(exports.ZodNanoID, params);
    }
    exports.ZodCUID = core2.$constructor("ZodCUID", (inst, def) => {
      core2.$ZodCUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cuid3(params) {
      return core2._cuid(exports.ZodCUID, params);
    }
    exports.ZodCUID2 = core2.$constructor("ZodCUID2", (inst, def) => {
      core2.$ZodCUID2.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cuid22(params) {
      return core2._cuid2(exports.ZodCUID2, params);
    }
    exports.ZodULID = core2.$constructor("ZodULID", (inst, def) => {
      core2.$ZodULID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ulid2(params) {
      return core2._ulid(exports.ZodULID, params);
    }
    exports.ZodXID = core2.$constructor("ZodXID", (inst, def) => {
      core2.$ZodXID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function xid2(params) {
      return core2._xid(exports.ZodXID, params);
    }
    exports.ZodKSUID = core2.$constructor("ZodKSUID", (inst, def) => {
      core2.$ZodKSUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ksuid2(params) {
      return core2._ksuid(exports.ZodKSUID, params);
    }
    exports.ZodIPv4 = core2.$constructor("ZodIPv4", (inst, def) => {
      core2.$ZodIPv4.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ipv42(params) {
      return core2._ipv4(exports.ZodIPv4, params);
    }
    exports.ZodIPv6 = core2.$constructor("ZodIPv6", (inst, def) => {
      core2.$ZodIPv6.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ipv62(params) {
      return core2._ipv6(exports.ZodIPv6, params);
    }
    exports.ZodCIDRv4 = core2.$constructor("ZodCIDRv4", (inst, def) => {
      core2.$ZodCIDRv4.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cidrv42(params) {
      return core2._cidrv4(exports.ZodCIDRv4, params);
    }
    exports.ZodCIDRv6 = core2.$constructor("ZodCIDRv6", (inst, def) => {
      core2.$ZodCIDRv6.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cidrv62(params) {
      return core2._cidrv6(exports.ZodCIDRv6, params);
    }
    exports.ZodBase64 = core2.$constructor("ZodBase64", (inst, def) => {
      core2.$ZodBase64.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function base642(params) {
      return core2._base64(exports.ZodBase64, params);
    }
    exports.ZodBase64URL = core2.$constructor("ZodBase64URL", (inst, def) => {
      core2.$ZodBase64URL.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function base64url2(params) {
      return core2._base64url(exports.ZodBase64URL, params);
    }
    exports.ZodE164 = core2.$constructor("ZodE164", (inst, def) => {
      core2.$ZodE164.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function e1642(params) {
      return core2._e164(exports.ZodE164, params);
    }
    exports.ZodJWT = core2.$constructor("ZodJWT", (inst, def) => {
      core2.$ZodJWT.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function jwt2(params) {
      return core2._jwt(exports.ZodJWT, params);
    }
    exports.ZodCustomStringFormat = core2.$constructor("ZodCustomStringFormat", (inst, def) => {
      core2.$ZodCustomStringFormat.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function stringFormat2(format, fnOrRegex, _params = {}) {
      return core2._stringFormat(exports.ZodCustomStringFormat, format, fnOrRegex, _params);
    }
    function hostname2(_params) {
      return core2._stringFormat(exports.ZodCustomStringFormat, "hostname", core2.regexes.hostname, _params);
    }
    function hex2(_params) {
      return core2._stringFormat(exports.ZodCustomStringFormat, "hex", core2.regexes.hex, _params);
    }
    function hash2(alg, params) {
      const enc = params?.enc ?? "hex";
      const format = `${alg}_${enc}`;
      const regex = core2.regexes[format];
      if (!regex)
        throw new Error(`Unrecognized hash format: ${format}`);
      return core2._stringFormat(exports.ZodCustomStringFormat, format, regex, params);
    }
    exports.ZodNumber = core2.$constructor("ZodNumber", (inst, def) => {
      core2.$ZodNumber.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.gt = (value, params) => inst.check(checks2.gt(value, params));
      inst.gte = (value, params) => inst.check(checks2.gte(value, params));
      inst.min = (value, params) => inst.check(checks2.gte(value, params));
      inst.lt = (value, params) => inst.check(checks2.lt(value, params));
      inst.lte = (value, params) => inst.check(checks2.lte(value, params));
      inst.max = (value, params) => inst.check(checks2.lte(value, params));
      inst.int = (params) => inst.check(int2(params));
      inst.safe = (params) => inst.check(int2(params));
      inst.positive = (params) => inst.check(checks2.gt(0, params));
      inst.nonnegative = (params) => inst.check(checks2.gte(0, params));
      inst.negative = (params) => inst.check(checks2.lt(0, params));
      inst.nonpositive = (params) => inst.check(checks2.lte(0, params));
      inst.multipleOf = (value, params) => inst.check(checks2.multipleOf(value, params));
      inst.step = (value, params) => inst.check(checks2.multipleOf(value, params));
      inst.finite = () => inst;
      const bag = inst._zod.bag;
      inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
      inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
      inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
      inst.isFinite = true;
      inst.format = bag.format ?? null;
    });
    function number2(params) {
      return core2._number(exports.ZodNumber, params);
    }
    exports.ZodNumberFormat = core2.$constructor("ZodNumberFormat", (inst, def) => {
      core2.$ZodNumberFormat.init(inst, def);
      exports.ZodNumber.init(inst, def);
    });
    function int2(params) {
      return core2._int(exports.ZodNumberFormat, params);
    }
    function float322(params) {
      return core2._float32(exports.ZodNumberFormat, params);
    }
    function float642(params) {
      return core2._float64(exports.ZodNumberFormat, params);
    }
    function int322(params) {
      return core2._int32(exports.ZodNumberFormat, params);
    }
    function uint322(params) {
      return core2._uint32(exports.ZodNumberFormat, params);
    }
    exports.ZodBoolean = core2.$constructor("ZodBoolean", (inst, def) => {
      core2.$ZodBoolean.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function boolean2(params) {
      return core2._boolean(exports.ZodBoolean, params);
    }
    exports.ZodBigInt = core2.$constructor("ZodBigInt", (inst, def) => {
      core2.$ZodBigInt.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.gte = (value, params) => inst.check(checks2.gte(value, params));
      inst.min = (value, params) => inst.check(checks2.gte(value, params));
      inst.gt = (value, params) => inst.check(checks2.gt(value, params));
      inst.gte = (value, params) => inst.check(checks2.gte(value, params));
      inst.min = (value, params) => inst.check(checks2.gte(value, params));
      inst.lt = (value, params) => inst.check(checks2.lt(value, params));
      inst.lte = (value, params) => inst.check(checks2.lte(value, params));
      inst.max = (value, params) => inst.check(checks2.lte(value, params));
      inst.positive = (params) => inst.check(checks2.gt(BigInt(0), params));
      inst.negative = (params) => inst.check(checks2.lt(BigInt(0), params));
      inst.nonpositive = (params) => inst.check(checks2.lte(BigInt(0), params));
      inst.nonnegative = (params) => inst.check(checks2.gte(BigInt(0), params));
      inst.multipleOf = (value, params) => inst.check(checks2.multipleOf(value, params));
      const bag = inst._zod.bag;
      inst.minValue = bag.minimum ?? null;
      inst.maxValue = bag.maximum ?? null;
      inst.format = bag.format ?? null;
    });
    function bigint2(params) {
      return core2._bigint(exports.ZodBigInt, params);
    }
    exports.ZodBigIntFormat = core2.$constructor("ZodBigIntFormat", (inst, def) => {
      core2.$ZodBigIntFormat.init(inst, def);
      exports.ZodBigInt.init(inst, def);
    });
    function int642(params) {
      return core2._int64(exports.ZodBigIntFormat, params);
    }
    function uint642(params) {
      return core2._uint64(exports.ZodBigIntFormat, params);
    }
    exports.ZodSymbol = core2.$constructor("ZodSymbol", (inst, def) => {
      core2.$ZodSymbol.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function symbol2(params) {
      return core2._symbol(exports.ZodSymbol, params);
    }
    exports.ZodUndefined = core2.$constructor("ZodUndefined", (inst, def) => {
      core2.$ZodUndefined.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function _undefined2(params) {
      return core2._undefined(exports.ZodUndefined, params);
    }
    exports.ZodNull = core2.$constructor("ZodNull", (inst, def) => {
      core2.$ZodNull.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function _null2(params) {
      return core2._null(exports.ZodNull, params);
    }
    exports.ZodAny = core2.$constructor("ZodAny", (inst, def) => {
      core2.$ZodAny.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function any2() {
      return core2._any(exports.ZodAny);
    }
    exports.ZodUnknown = core2.$constructor("ZodUnknown", (inst, def) => {
      core2.$ZodUnknown.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function unknown2() {
      return core2._unknown(exports.ZodUnknown);
    }
    exports.ZodNever = core2.$constructor("ZodNever", (inst, def) => {
      core2.$ZodNever.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function never2(params) {
      return core2._never(exports.ZodNever, params);
    }
    exports.ZodVoid = core2.$constructor("ZodVoid", (inst, def) => {
      core2.$ZodVoid.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function _void2(params) {
      return core2._void(exports.ZodVoid, params);
    }
    exports.ZodDate = core2.$constructor("ZodDate", (inst, def) => {
      core2.$ZodDate.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.min = (value, params) => inst.check(checks2.gte(value, params));
      inst.max = (value, params) => inst.check(checks2.lte(value, params));
      const c = inst._zod.bag;
      inst.minDate = c.minimum ? new Date(c.minimum) : null;
      inst.maxDate = c.maximum ? new Date(c.maximum) : null;
    });
    function date2(params) {
      return core2._date(exports.ZodDate, params);
    }
    exports.ZodArray = core2.$constructor("ZodArray", (inst, def) => {
      core2.$ZodArray.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.element = def.element;
      inst.min = (minLength, params) => inst.check(checks2.minLength(minLength, params));
      inst.nonempty = (params) => inst.check(checks2.minLength(1, params));
      inst.max = (maxLength, params) => inst.check(checks2.maxLength(maxLength, params));
      inst.length = (len, params) => inst.check(checks2.length(len, params));
      inst.unwrap = () => inst.element;
    });
    function array2(element, params) {
      return core2._array(exports.ZodArray, element, params);
    }
    function keyof2(schema) {
      const shape = schema._zod.def.shape;
      return _enum2(Object.keys(shape));
    }
    exports.ZodObject = core2.$constructor("ZodObject", (inst, def) => {
      core2.$ZodObjectJIT.init(inst, def);
      exports.ZodType.init(inst, def);
      index_js_1.util.defineLazy(inst, "shape", () => {
        return def.shape;
      });
      inst.keyof = () => _enum2(Object.keys(inst._zod.def.shape));
      inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall });
      inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown2() });
      inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown2() });
      inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never2() });
      inst.strip = () => inst.clone({ ...inst._zod.def, catchall: void 0 });
      inst.extend = (incoming) => {
        return index_js_1.util.extend(inst, incoming);
      };
      inst.safeExtend = (incoming) => {
        return index_js_1.util.safeExtend(inst, incoming);
      };
      inst.merge = (other) => index_js_1.util.merge(inst, other);
      inst.pick = (mask) => index_js_1.util.pick(inst, mask);
      inst.omit = (mask) => index_js_1.util.omit(inst, mask);
      inst.partial = (...args) => index_js_1.util.partial(exports.ZodOptional, inst, args[0]);
      inst.required = (...args) => index_js_1.util.required(exports.ZodNonOptional, inst, args[0]);
    });
    function object2(shape, params) {
      const def = {
        type: "object",
        shape: shape ?? {},
        ...index_js_1.util.normalizeParams(params)
      };
      return new exports.ZodObject(def);
    }
    function strictObject2(shape, params) {
      return new exports.ZodObject({
        type: "object",
        shape,
        catchall: never2(),
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function looseObject2(shape, params) {
      return new exports.ZodObject({
        type: "object",
        shape,
        catchall: unknown2(),
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodUnion = core2.$constructor("ZodUnion", (inst, def) => {
      core2.$ZodUnion.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.options = def.options;
    });
    function union2(options, params) {
      return new exports.ZodUnion({
        type: "union",
        options,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodDiscriminatedUnion = core2.$constructor("ZodDiscriminatedUnion", (inst, def) => {
      exports.ZodUnion.init(inst, def);
      core2.$ZodDiscriminatedUnion.init(inst, def);
    });
    function discriminatedUnion2(discriminator, options, params) {
      return new exports.ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodIntersection = core2.$constructor("ZodIntersection", (inst, def) => {
      core2.$ZodIntersection.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function intersection2(left, right) {
      return new exports.ZodIntersection({
        type: "intersection",
        left,
        right
      });
    }
    exports.ZodTuple = core2.$constructor("ZodTuple", (inst, def) => {
      core2.$ZodTuple.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.rest = (rest) => inst.clone({
        ...inst._zod.def,
        rest
      });
    });
    function tuple2(items, _paramsOrRest, _params) {
      const hasRest = _paramsOrRest instanceof core2.$ZodType;
      const params = hasRest ? _params : _paramsOrRest;
      const rest = hasRest ? _paramsOrRest : null;
      return new exports.ZodTuple({
        type: "tuple",
        items,
        rest,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodRecord = core2.$constructor("ZodRecord", (inst, def) => {
      core2.$ZodRecord.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.keyType = def.keyType;
      inst.valueType = def.valueType;
    });
    function record2(keyType, valueType, params) {
      return new exports.ZodRecord({
        type: "record",
        keyType,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function partialRecord2(keyType, valueType, params) {
      const k = core2.clone(keyType);
      k._zod.values = void 0;
      return new exports.ZodRecord({
        type: "record",
        keyType: k,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodMap = core2.$constructor("ZodMap", (inst, def) => {
      core2.$ZodMap.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.keyType = def.keyType;
      inst.valueType = def.valueType;
    });
    function map2(keyType, valueType, params) {
      return new exports.ZodMap({
        type: "map",
        keyType,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodSet = core2.$constructor("ZodSet", (inst, def) => {
      core2.$ZodSet.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.min = (...args) => inst.check(core2._minSize(...args));
      inst.nonempty = (params) => inst.check(core2._minSize(1, params));
      inst.max = (...args) => inst.check(core2._maxSize(...args));
      inst.size = (...args) => inst.check(core2._size(...args));
    });
    function set2(valueType, params) {
      return new exports.ZodSet({
        type: "set",
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodEnum = core2.$constructor("ZodEnum", (inst, def) => {
      core2.$ZodEnum.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.enum = def.entries;
      inst.options = Object.values(def.entries);
      const keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
          if (keys.has(value)) {
            newEntries[value] = def.entries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new exports.ZodEnum({
          ...def,
          checks: [],
          ...index_js_1.util.normalizeParams(params),
          entries: newEntries
        });
      };
      inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
          if (keys.has(value)) {
            delete newEntries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new exports.ZodEnum({
          ...def,
          checks: [],
          ...index_js_1.util.normalizeParams(params),
          entries: newEntries
        });
      };
    });
    function _enum2(values, params) {
      const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
      return new exports.ZodEnum({
        type: "enum",
        entries,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function nativeEnum2(entries, params) {
      return new exports.ZodEnum({
        type: "enum",
        entries,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodLiteral = core2.$constructor("ZodLiteral", (inst, def) => {
      core2.$ZodLiteral.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.values = new Set(def.values);
      Object.defineProperty(inst, "value", {
        get() {
          if (def.values.length > 1) {
            throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
          }
          return def.values[0];
        }
      });
    });
    function literal2(value, params) {
      return new exports.ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodFile = core2.$constructor("ZodFile", (inst, def) => {
      core2.$ZodFile.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.min = (size, params) => inst.check(core2._minSize(size, params));
      inst.max = (size, params) => inst.check(core2._maxSize(size, params));
      inst.mime = (types, params) => inst.check(core2._mime(Array.isArray(types) ? types : [types], params));
    });
    function file2(params) {
      return core2._file(exports.ZodFile, params);
    }
    exports.ZodTransform = core2.$constructor("ZodTransform", (inst, def) => {
      core2.$ZodTransform.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
          throw new core2.$ZodEncodeError(inst.constructor.name);
        }
        payload.addIssue = (issue2) => {
          if (typeof issue2 === "string") {
            payload.issues.push(index_js_1.util.issue(issue2, payload.value, def));
          } else {
            const _issue = issue2;
            if (_issue.fatal)
              _issue.continue = false;
            _issue.code ?? (_issue.code = "custom");
            _issue.input ?? (_issue.input = payload.value);
            _issue.inst ?? (_issue.inst = inst);
            payload.issues.push(index_js_1.util.issue(_issue));
          }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
          return output.then((output2) => {
            payload.value = output2;
            return payload;
          });
        }
        payload.value = output;
        return payload;
      };
    });
    function transform2(fn) {
      return new exports.ZodTransform({
        type: "transform",
        transform: fn
      });
    }
    exports.ZodOptional = core2.$constructor("ZodOptional", (inst, def) => {
      core2.$ZodOptional.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function optional2(innerType) {
      return new exports.ZodOptional({
        type: "optional",
        innerType
      });
    }
    exports.ZodNullable = core2.$constructor("ZodNullable", (inst, def) => {
      core2.$ZodNullable.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function nullable2(innerType) {
      return new exports.ZodNullable({
        type: "nullable",
        innerType
      });
    }
    function nullish2(innerType) {
      return optional2(nullable2(innerType));
    }
    exports.ZodDefault = core2.$constructor("ZodDefault", (inst, def) => {
      core2.$ZodDefault.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeDefault = inst.unwrap;
    });
    function _default2(innerType, defaultValue) {
      return new exports.ZodDefault({
        type: "default",
        innerType,
        get defaultValue() {
          return typeof defaultValue === "function" ? defaultValue() : index_js_1.util.shallowClone(defaultValue);
        }
      });
    }
    exports.ZodPrefault = core2.$constructor("ZodPrefault", (inst, def) => {
      core2.$ZodPrefault.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function prefault2(innerType, defaultValue) {
      return new exports.ZodPrefault({
        type: "prefault",
        innerType,
        get defaultValue() {
          return typeof defaultValue === "function" ? defaultValue() : index_js_1.util.shallowClone(defaultValue);
        }
      });
    }
    exports.ZodNonOptional = core2.$constructor("ZodNonOptional", (inst, def) => {
      core2.$ZodNonOptional.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function nonoptional2(innerType, params) {
      return new exports.ZodNonOptional({
        type: "nonoptional",
        innerType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodSuccess = core2.$constructor("ZodSuccess", (inst, def) => {
      core2.$ZodSuccess.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function success2(innerType) {
      return new exports.ZodSuccess({
        type: "success",
        innerType
      });
    }
    exports.ZodCatch = core2.$constructor("ZodCatch", (inst, def) => {
      core2.$ZodCatch.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeCatch = inst.unwrap;
    });
    function _catch2(innerType, catchValue) {
      return new exports.ZodCatch({
        type: "catch",
        innerType,
        catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
      });
    }
    exports.ZodNaN = core2.$constructor("ZodNaN", (inst, def) => {
      core2.$ZodNaN.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function nan2(params) {
      return core2._nan(exports.ZodNaN, params);
    }
    exports.ZodPipe = core2.$constructor("ZodPipe", (inst, def) => {
      core2.$ZodPipe.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.in = def.in;
      inst.out = def.out;
    });
    function pipe2(in_, out) {
      return new exports.ZodPipe({
        type: "pipe",
        in: in_,
        out
        // ...util.normalizeParams(params),
      });
    }
    exports.ZodCodec = core2.$constructor("ZodCodec", (inst, def) => {
      exports.ZodPipe.init(inst, def);
      core2.$ZodCodec.init(inst, def);
    });
    function codec2(in_, out, params) {
      return new exports.ZodCodec({
        type: "pipe",
        in: in_,
        out,
        transform: params.decode,
        reverseTransform: params.encode
      });
    }
    exports.ZodReadonly = core2.$constructor("ZodReadonly", (inst, def) => {
      core2.$ZodReadonly.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function readonly2(innerType) {
      return new exports.ZodReadonly({
        type: "readonly",
        innerType
      });
    }
    exports.ZodTemplateLiteral = core2.$constructor("ZodTemplateLiteral", (inst, def) => {
      core2.$ZodTemplateLiteral.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function templateLiteral2(parts, params) {
      return new exports.ZodTemplateLiteral({
        type: "template_literal",
        parts,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodLazy = core2.$constructor("ZodLazy", (inst, def) => {
      core2.$ZodLazy.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.getter();
    });
    function lazy2(getter) {
      return new exports.ZodLazy({
        type: "lazy",
        getter
      });
    }
    exports.ZodPromise = core2.$constructor("ZodPromise", (inst, def) => {
      core2.$ZodPromise.init(inst, def);
      exports.ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function promise2(innerType) {
      return new exports.ZodPromise({
        type: "promise",
        innerType
      });
    }
    exports.ZodFunction = core2.$constructor("ZodFunction", (inst, def) => {
      core2.$ZodFunction.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function _function2(params) {
      return new exports.ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? tuple2(params?.input) : params?.input ?? array2(unknown2()),
        output: params?.output ?? unknown2()
      });
    }
    exports.ZodCustom = core2.$constructor("ZodCustom", (inst, def) => {
      core2.$ZodCustom.init(inst, def);
      exports.ZodType.init(inst, def);
    });
    function check2(fn) {
      const ch = new core2.$ZodCheck({
        check: "custom"
        // ...util.normalizeParams(params),
      });
      ch._zod.check = fn;
      return ch;
    }
    function custom2(fn, _params) {
      return core2._custom(exports.ZodCustom, fn ?? (() => true), _params);
    }
    function refine2(fn, _params = {}) {
      return core2._refine(exports.ZodCustom, fn, _params);
    }
    function superRefine2(fn) {
      return core2._superRefine(fn);
    }
    function _instanceof2(cls, params = {
      error: `Input not instance of ${cls.name}`
    }) {
      const inst = new exports.ZodCustom({
        type: "custom",
        check: "custom",
        fn: (data) => data instanceof cls,
        abort: true,
        ...index_js_1.util.normalizeParams(params)
      });
      inst._zod.bag.Class = cls;
      return inst;
    }
    const stringbool2 = (...args) => core2._stringbool({
      Codec: exports.ZodCodec,
      Boolean: exports.ZodBoolean,
      String: exports.ZodString
    }, ...args);
    exports.stringbool = stringbool2;
    function json2(params) {
      const jsonSchema2 = lazy2(() => {
        return union2([string2(params), number2(), boolean2(), _null2(), array2(jsonSchema2), record2(string2(), jsonSchema2)]);
      });
      return jsonSchema2;
    }
    function preprocess2(fn, schema) {
      return pipe2(transform2(fn), schema);
    }
  })(schemas);
  return schemas;
}
var compat = {};
var hasRequiredCompat;
function requireCompat() {
  if (hasRequiredCompat) return compat;
  hasRequiredCompat = 1;
  (function(exports) {
    var __createBinding = compat && compat.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = compat && compat.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = compat && compat.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodFirstPartyTypeKind = exports.config = exports.$brand = exports.ZodIssueCode = void 0;
    exports.setErrorMap = setErrorMap;
    exports.getErrorMap = getErrorMap;
    const core2 = __importStar(requireCore());
    exports.ZodIssueCode = {
      invalid_type: "invalid_type",
      too_big: "too_big",
      too_small: "too_small",
      invalid_format: "invalid_format",
      not_multiple_of: "not_multiple_of",
      unrecognized_keys: "unrecognized_keys",
      invalid_union: "invalid_union",
      invalid_key: "invalid_key",
      invalid_element: "invalid_element",
      invalid_value: "invalid_value",
      custom: "custom"
    };
    var index_js_1 = requireCore();
    Object.defineProperty(exports, "$brand", { enumerable: true, get: function() {
      return index_js_1.$brand;
    } });
    Object.defineProperty(exports, "config", { enumerable: true, get: function() {
      return index_js_1.config;
    } });
    function setErrorMap(map2) {
      core2.config({
        customError: map2
      });
    }
    function getErrorMap() {
      return core2.config().customError;
    }
    var ZodFirstPartyTypeKind;
    /* @__PURE__ */ (function(ZodFirstPartyTypeKind2) {
    })(ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = ZodFirstPartyTypeKind = {}));
  })(compat);
  return compat;
}
var coerce = {};
var hasRequiredCoerce;
function requireCoerce() {
  if (hasRequiredCoerce) return coerce;
  hasRequiredCoerce = 1;
  var __createBinding = coerce && coerce.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = coerce && coerce.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = coerce && coerce.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(coerce, "__esModule", { value: true });
  coerce.string = string2;
  coerce.number = number2;
  coerce.boolean = boolean2;
  coerce.bigint = bigint2;
  coerce.date = date2;
  const core2 = __importStar(requireCore());
  const schemas2 = __importStar(requireSchemas());
  function string2(params) {
    return core2._coercedString(schemas2.ZodString, params);
  }
  function number2(params) {
    return core2._coercedNumber(schemas2.ZodNumber, params);
  }
  function boolean2(params) {
    return core2._coercedBoolean(schemas2.ZodBoolean, params);
  }
  function bigint2(params) {
    return core2._coercedBigint(schemas2.ZodBigInt, params);
  }
  function date2(params) {
    return core2._coercedDate(schemas2.ZodDate, params);
  }
  return coerce;
}
var hasRequiredExternal;
function requireExternal() {
  if (hasRequiredExternal) return external;
  hasRequiredExternal = 1;
  (function(exports) {
    var __createBinding = external && external.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = external && external.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = external && external.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = external && external.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importDefault = external && external.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coerce = exports.iso = exports.ZodISODuration = exports.ZodISOTime = exports.ZodISODate = exports.ZodISODateTime = exports.locales = exports.NEVER = exports.util = exports.TimePrecision = exports.toJSONSchema = exports.flattenError = exports.formatError = exports.prettifyError = exports.treeifyError = exports.regexes = exports.clone = exports.$brand = exports.$input = exports.$output = exports.config = exports.registry = exports.globalRegistry = exports.core = void 0;
    exports.core = __importStar(requireCore());
    __exportStar(requireSchemas(), exports);
    __exportStar(requireChecks(), exports);
    __exportStar(requireErrors(), exports);
    __exportStar(requireParse(), exports);
    __exportStar(requireCompat(), exports);
    const index_js_1 = requireCore();
    const en_js_1 = __importDefault(requireEn());
    (0, index_js_1.config)((0, en_js_1.default)());
    var index_js_2 = requireCore();
    Object.defineProperty(exports, "globalRegistry", { enumerable: true, get: function() {
      return index_js_2.globalRegistry;
    } });
    Object.defineProperty(exports, "registry", { enumerable: true, get: function() {
      return index_js_2.registry;
    } });
    Object.defineProperty(exports, "config", { enumerable: true, get: function() {
      return index_js_2.config;
    } });
    Object.defineProperty(exports, "$output", { enumerable: true, get: function() {
      return index_js_2.$output;
    } });
    Object.defineProperty(exports, "$input", { enumerable: true, get: function() {
      return index_js_2.$input;
    } });
    Object.defineProperty(exports, "$brand", { enumerable: true, get: function() {
      return index_js_2.$brand;
    } });
    Object.defineProperty(exports, "clone", { enumerable: true, get: function() {
      return index_js_2.clone;
    } });
    Object.defineProperty(exports, "regexes", { enumerable: true, get: function() {
      return index_js_2.regexes;
    } });
    Object.defineProperty(exports, "treeifyError", { enumerable: true, get: function() {
      return index_js_2.treeifyError;
    } });
    Object.defineProperty(exports, "prettifyError", { enumerable: true, get: function() {
      return index_js_2.prettifyError;
    } });
    Object.defineProperty(exports, "formatError", { enumerable: true, get: function() {
      return index_js_2.formatError;
    } });
    Object.defineProperty(exports, "flattenError", { enumerable: true, get: function() {
      return index_js_2.flattenError;
    } });
    Object.defineProperty(exports, "toJSONSchema", { enumerable: true, get: function() {
      return index_js_2.toJSONSchema;
    } });
    Object.defineProperty(exports, "TimePrecision", { enumerable: true, get: function() {
      return index_js_2.TimePrecision;
    } });
    Object.defineProperty(exports, "util", { enumerable: true, get: function() {
      return index_js_2.util;
    } });
    Object.defineProperty(exports, "NEVER", { enumerable: true, get: function() {
      return index_js_2.NEVER;
    } });
    exports.locales = __importStar(requireLocales());
    var iso_js_1 = requireIso();
    Object.defineProperty(exports, "ZodISODateTime", { enumerable: true, get: function() {
      return iso_js_1.ZodISODateTime;
    } });
    Object.defineProperty(exports, "ZodISODate", { enumerable: true, get: function() {
      return iso_js_1.ZodISODate;
    } });
    Object.defineProperty(exports, "ZodISOTime", { enumerable: true, get: function() {
      return iso_js_1.ZodISOTime;
    } });
    Object.defineProperty(exports, "ZodISODuration", { enumerable: true, get: function() {
      return iso_js_1.ZodISODuration;
    } });
    exports.iso = __importStar(requireIso());
    exports.coerce = __importStar(requireCoerce());
  })(external);
  return external;
}
var hasRequiredZod;
function requireZod() {
  if (hasRequiredZod) return zod;
  hasRequiredZod = 1;
  (function(exports) {
    var __createBinding = zod && zod.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = zod && zod.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = zod && zod.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = zod && zod.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    const z2 = __importStar(requireExternal());
    exports.z = z2;
    __exportStar(requireExternal(), exports);
    exports.default = z2;
  })(zod);
  return zod;
}
export {
  ZodUnion as A,
  ZodString as B,
  ZodNumber as C,
  ZodBoolean as D,
  ZodObject as Z,
  _enum as _,
  ZodOptional as a,
  boolean$1 as b,
  any as c,
  number as d,
  date$1 as e,
  boolean as f,
  date as g,
  array as h,
  union as i,
  httpUrl as j,
  fromJSONSchema as k,
  literal as l,
  ZodIssueCode as m,
  number$1 as n,
  object as o,
  preprocess as p,
  ZodType as q,
  requireZod as r,
  string as s,
  toJSONSchema as t,
  unknown as u,
  ZodNullable as v,
  ZodDefault as w,
  ZodArray as x,
  ZodEnum as y,
  ZodLiteral as z
};
