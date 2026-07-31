import { r as requireCjs } from "./jose.mjs";
import { a as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireDist$2 } from "./@vercel/cli-config.mjs";
import require$$0 from "path";
import require$$0$1 from "fs";
import { r as requireDist$1 } from "./@vercel/cli-exec.mjs";
import require$$0$2 from "os";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        }
      }
    }
  }
  return Object.freeze(n);
}
var version_1;
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version_1;
  hasRequiredVersion = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var version_exports = {};
  __export(version_exports, {
    version: () => version
  });
  version_1 = __toCommonJS(version_exports);
  const version = "3.8.1";
  return version_1;
}
var exchangeVercelOidcToken_1;
var hasRequiredExchangeVercelOidcToken;
function requireExchangeVercelOidcToken() {
  if (hasRequiredExchangeVercelOidcToken) return exchangeVercelOidcToken_1;
  hasRequiredExchangeVercelOidcToken = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var exchange_vercel_oidc_token_exports = {};
  __export(exchange_vercel_oidc_token_exports, {
    exchangeVercelOidcToken: () => exchangeVercelOidcToken
  });
  exchangeVercelOidcToken_1 = __toCommonJS(exchange_vercel_oidc_token_exports);
  var import_version = requireVersion();
  class TokenCache {
    constructor(maxEntries) {
      this.maxEntries = maxEntries;
      this.entries = /* @__PURE__ */ new Map();
    }
    /**
     * Returns a cached token for the key when present and unexpired, refreshing
     * its recency for LRU eviction. Expired entries are removed on access.
     */
    get(key) {
      const entry = this.entries.get(key);
      if (entry === void 0) {
        return void 0;
      }
      if (entry.expiresAt <= Date.now()) {
        this.entries.delete(key);
        return void 0;
      }
      this.entries.delete(key);
      this.entries.set(key, entry);
      return entry.token;
    }
    /**
     * Stores a token under the key and evicts the least-recently-used entries
     * once the cache exceeds its size limit.
     */
    set({
      key,
      token: token2,
      expiresAt
    }) {
      this.entries.delete(key);
      this.entries.set(key, { token: token2, expiresAt });
      while (this.entries.size > this.maxEntries) {
        const oldest = this.entries.keys().next().value;
        if (oldest === void 0) {
          break;
        }
        this.entries.delete(oldest);
      }
    }
  }
  const MAX_CACHE_ENTRIES = 1e3;
  const tokenCache = new TokenCache(MAX_CACHE_ENTRIES);
  async function getCacheKey(options) {
    const input = JSON.stringify([options.token, options.audience, options.jti]);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(input)
    );
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  async function exchangeVercelOidcToken(options) {
    const cacheKey = await getCacheKey(options);
    if (!options.skipCache) {
      const cached = tokenCache.get(cacheKey);
      if (cached !== void 0) {
        return cached;
      }
    }
    const response = await fetch("https://oidc.vercel.com/~token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": `@vercel/oidc@${import_version.version}`
      },
      body: JSON.stringify({
        token: options.token,
        aud: options.audience,
        ...options.jti ? { jti: options.jti } : void 0
      })
    });
    if (!response.ok) {
      throw new Error(
        `Failed to exchange token: ${await readErrorMessage(response)}`
      );
    }
    let data;
    try {
      data = await response.json();
    } catch (_error) {
      throw new Error("Failed to exchange token: response was not valid JSON");
    }
    if (!data || typeof data !== "object" || !("token" in data) || typeof data.token !== "string") {
      throw new Error(
        "Failed to exchange token: response did not contain a token"
      );
    }
    const { token: token2 } = data;
    const expiry = "expiry" in data && typeof data.expiry === "number" ? data.expiry : void 0;
    if (expiry !== void 0) {
      const expiresAt = expiry * 1e3;
      if (expiresAt > Date.now()) {
        tokenCache.set({ key: cacheKey, token: token2, expiresAt });
      }
    }
    return token2;
  }
  async function readErrorMessage(response) {
    try {
      const data = await response.json();
      if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
        return data.error;
      }
    } catch (_error) {
    }
    return response.statusText || `HTTP ${response.status}`;
  }
  return exchangeVercelOidcToken_1;
}
var getContext_1;
var hasRequiredGetContext;
function requireGetContext() {
  if (hasRequiredGetContext) return getContext_1;
  hasRequiredGetContext = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var get_context_exports = {};
  __export(get_context_exports, {
    SYMBOL_FOR_REQ_CONTEXT: () => SYMBOL_FOR_REQ_CONTEXT,
    getContext: () => getContext
  });
  getContext_1 = __toCommonJS(get_context_exports);
  const SYMBOL_FOR_REQ_CONTEXT = /* @__PURE__ */ Symbol.for("@vercel/request-context");
  function getContext() {
    const fromSymbol = globalThis;
    return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
  }
  return getContext_1;
}
var getVercelOidcTokenSync_1;
var hasRequiredGetVercelOidcTokenSync;
function requireGetVercelOidcTokenSync() {
  if (hasRequiredGetVercelOidcTokenSync) return getVercelOidcTokenSync_1;
  hasRequiredGetVercelOidcTokenSync = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var get_vercel_oidc_token_sync_exports = {};
  __export(get_vercel_oidc_token_sync_exports, {
    getVercelOidcTokenSync: () => getVercelOidcTokenSync
  });
  getVercelOidcTokenSync_1 = __toCommonJS(get_vercel_oidc_token_sync_exports);
  var import_get_context = requireGetContext();
  function getVercelOidcTokenSync() {
    const token2 = (0, import_get_context.getContext)().headers?.["x-vercel-oidc-token"] ?? process.env.VERCEL_OIDC_TOKEN;
    if (!token2) {
      throw new Error(
        `The 'x-vercel-oidc-token' header is missing from the request.`
      );
    }
    return token2;
  }
  return getVercelOidcTokenSync_1;
}
var tokenError;
var hasRequiredTokenError;
function requireTokenError() {
  if (hasRequiredTokenError) return tokenError;
  hasRequiredTokenError = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var token_error_exports = {};
  __export(token_error_exports, {
    VercelOidcTokenError: () => VercelOidcTokenError
  });
  tokenError = __toCommonJS(token_error_exports);
  class VercelOidcTokenError extends Error {
    constructor(message, cause) {
      super(message);
      this.name = "VercelOidcTokenError";
      this.cause = cause;
    }
    toString() {
      if (this.cause) {
        return `${this.name}: ${this.message}: ${this.cause}`;
      }
      return `${this.name}: ${this.message}`;
    }
  }
  return tokenError;
}
var getVercelOidcTokenWithRefresh;
var hasRequiredGetVercelOidcTokenWithRefresh;
function requireGetVercelOidcTokenWithRefresh() {
  if (hasRequiredGetVercelOidcTokenWithRefresh) return getVercelOidcTokenWithRefresh;
  hasRequiredGetVercelOidcTokenWithRefresh = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var get_vercel_oidc_token_with_refresh_exports = {};
  __export(get_vercel_oidc_token_with_refresh_exports, {
    getVercelOidcToken: () => getVercelOidcToken
  });
  getVercelOidcTokenWithRefresh = __toCommonJS(get_vercel_oidc_token_with_refresh_exports);
  var import_exchange_vercel_oidc_token = requireExchangeVercelOidcToken();
  var import_get_vercel_oidc_token_sync = requireGetVercelOidcTokenSync();
  var import_token_error = requireTokenError();
  async function getVercelOidcToken(options) {
    let token2 = "";
    let err;
    try {
      token2 = (0, import_get_vercel_oidc_token_sync.getVercelOidcTokenSync)();
    } catch (error) {
      err = error;
    }
    try {
      const [{ getTokenPayload, isExpired }, { refreshToken }] = await Promise.all([
        await Promise.resolve().then(function() {
          return tokenUtil$1;
        }),
        await Promise.resolve().then(function() {
          return token$1;
        })
      ]);
      if (!token2 || isExpired(getTokenPayload(token2), options?.expirationBufferMs)) {
        await refreshToken(options);
        token2 = (0, import_get_vercel_oidc_token_sync.getVercelOidcTokenSync)();
      }
    } catch (error) {
      let message = err instanceof Error ? err.message : "";
      if (error instanceof Error) {
        message = `${message}
${error.message}`;
      }
      if (message) {
        throw new import_token_error.VercelOidcTokenError(message);
      }
      throw error;
    }
    if (options?.audience) {
      token2 = await (0, import_exchange_vercel_oidc_token.exchangeVercelOidcToken)({
        token: token2,
        audience: options.audience,
        jti: options.jti,
        skipCache: options.skipCache
      });
    }
    return token2;
  }
  return getVercelOidcTokenWithRefresh;
}
var verifyVercelOidcToken_1;
var hasRequiredVerifyVercelOidcToken;
function requireVerifyVercelOidcToken() {
  if (hasRequiredVerifyVercelOidcToken) return verifyVercelOidcToken_1;
  hasRequiredVerifyVercelOidcToken = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var verify_vercel_oidc_token_exports = {};
  __export(verify_vercel_oidc_token_exports, {
    verifyVercelOidcToken: () => verifyVercelOidcToken
  });
  verifyVercelOidcToken_1 = __toCommonJS(verify_vercel_oidc_token_exports);
  var import_jose2 = /* @__PURE__ */ requireCjs();
  const VERCEL_OIDC_ISSUER = "https://oidc.vercel.com";
  const VERCEL_OIDC_JWKS_URL = new URL(
    "https://oidc.vercel.com/.well-known/jwks"
  );
  const DEFAULT_ALGORITHMS = ["RS256"];
  const VERCEL_OIDC_JWKS = (0, import_jose2.createRemoteJWKSet)(VERCEL_OIDC_JWKS_URL);
  async function verifyVercelOidcToken(token2, options) {
    const {
      algorithms,
      projectId = process.env.VERCEL_PROJECT_ID,
      environment = process.env.VERCEL_TARGET_ENV || process.env.VERCEL_ENV,
      ownerId,
      ...verifyOptions
    } = options ?? {};
    if (projectId === "*" && ownerId === void 0 && !hasAudienceVerification(verifyOptions.audience)) {
      throw new TypeError(
        "Expected ownerId or audience to be provided when projectId is '*'."
      );
    }
    const result = await (0, import_jose2.jwtVerify)(token2, VERCEL_OIDC_JWKS, {
      ...verifyOptions,
      algorithms: algorithms ?? DEFAULT_ALGORITHMS
    });
    validateIssuer(result.payload.iss);
    validateClaim({
      actual: result.payload.project_id,
      claim: "project_id",
      env: "VERCEL_PROJECT_ID",
      expected: projectId,
      option: "projectId"
    });
    validateClaim({
      actual: result.payload.environment,
      claim: "environment",
      env: "VERCEL_TARGET_ENV or VERCEL_ENV",
      expected: environment,
      option: "environment"
    });
    validateOptionalClaim({
      actual: result.payload.owner_id,
      claim: "owner_id",
      expected: ownerId
    });
    return result;
  }
  function hasAudienceVerification(audience) {
    return Array.isArray(audience) ? audience.length > 0 : audience !== void 0;
  }
  function validateIssuer(actual) {
    if (actual !== VERCEL_OIDC_ISSUER && (typeof actual !== "string" || !actual.startsWith(`${VERCEL_OIDC_ISSUER}/`))) {
      throw new TypeError(
        `Expected Vercel OIDC token iss claim to be "${VERCEL_OIDC_ISSUER}" or to start with "${VERCEL_OIDC_ISSUER}/".`
      );
    }
  }
  function validateClaim({
    actual,
    claim,
    env,
    expected,
    option
  }) {
    if (expected === "*") {
      return;
    }
    if (expected === void 0 || expected.length === 0) {
      throw new TypeError(
        `Expected ${env} to be set or ${option} to be provided. Pass ${option}: '*' to allow any ${claim} claim.`
      );
    }
    if (Array.isArray(expected) && typeof actual === "string" && expected.includes(actual)) {
      return;
    }
    if (actual !== expected) {
      throw new TypeError(
        Array.isArray(expected) ? `Expected Vercel OIDC token ${claim} claim to be one of: ${expected.map((value) => `"${value}"`).join(", ")}.` : `Expected Vercel OIDC token ${claim} claim to be "${expected}".`
      );
    }
  }
  function validateOptionalClaim({
    actual,
    claim,
    expected
  }) {
    if (expected === void 0) {
      return;
    }
    if (actual !== expected) {
      throw new TypeError(
        `Expected Vercel OIDC token ${claim} claim to be "${expected}".`
      );
    }
  }
  return verifyVercelOidcToken_1;
}
var authErrors;
var hasRequiredAuthErrors;
function requireAuthErrors() {
  if (hasRequiredAuthErrors) return authErrors;
  hasRequiredAuthErrors = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var auth_errors_exports = {};
  __export(auth_errors_exports, {
    AccessTokenMissingError: () => AccessTokenMissingError,
    RefreshAccessTokenFailedError: () => RefreshAccessTokenFailedError
  });
  authErrors = __toCommonJS(auth_errors_exports);
  class AccessTokenMissingError extends Error {
    constructor() {
      super(
        "No authentication found. Please log in with the Vercel CLI (vercel login)."
      );
      this.name = "AccessTokenMissingError";
    }
  }
  class RefreshAccessTokenFailedError extends Error {
    constructor(cause) {
      super("Failed to refresh authentication token.");
      this.name = "RefreshAccessTokenFailedError";
      if (cause !== void 0) {
        this.cause = cause;
      }
    }
  }
  return authErrors;
}
var tokenIo;
var hasRequiredTokenIo;
function requireTokenIo() {
  if (hasRequiredTokenIo) return tokenIo;
  hasRequiredTokenIo = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var token_io_exports = {};
  __export(token_io_exports, {
    findRootDir: () => findRootDir,
    getUserDataDir: () => getUserDataDir
  });
  tokenIo = __toCommonJS(token_io_exports);
  var import_path2 = __toESM(require$$0);
  var import_fs2 = __toESM(require$$0$1);
  var import_os2 = __toESM(require$$0$2);
  var import_token_error = requireTokenError();
  function findRootDir() {
    try {
      let dir = process.cwd();
      while (dir !== import_path2.default.dirname(dir)) {
        const pkgPath = import_path2.default.join(dir, ".vercel");
        if (import_fs2.default.existsSync(pkgPath)) {
          return dir;
        }
        dir = import_path2.default.dirname(dir);
      }
    } catch (_e) {
      throw new import_token_error.VercelOidcTokenError(
        "Token refresh only supported in node server environments"
      );
    }
    return null;
  }
  function getUserDataDir() {
    if (process.env.XDG_DATA_HOME) {
      return process.env.XDG_DATA_HOME;
    }
    switch (import_os2.default.platform()) {
      case "darwin":
        return import_path2.default.join(import_os2.default.homedir(), "Library/Application Support");
      case "linux":
        return import_path2.default.join(import_os2.default.homedir(), ".local/share");
      case "win32":
        if (process.env.LOCALAPPDATA) {
          return process.env.LOCALAPPDATA;
        }
        return null;
      default:
        return null;
    }
  }
  return tokenIo;
}
var oauth;
var hasRequiredOauth;
function requireOauth() {
  if (hasRequiredOauth) return oauth;
  hasRequiredOauth = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var oauth_exports = {};
  __export(oauth_exports, {
    processTokenResponse: () => processTokenResponse,
    refreshTokenRequest: () => refreshTokenRequest
  });
  oauth = __toCommonJS(oauth_exports);
  var import_os2 = require$$0$2;
  const VERCEL_ISSUER = "https://vercel.com";
  const VERCEL_CLI_CLIENT_ID = "cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp";
  const userAgent = `@vercel/oidc node-${process.version} ${(0, import_os2.platform)()} (${(0, import_os2.arch)()}) ${(0, import_os2.hostname)()}`;
  let _tokenEndpoint = null;
  async function getTokenEndpoint() {
    if (_tokenEndpoint) {
      return _tokenEndpoint;
    }
    const discoveryUrl = `${VERCEL_ISSUER}/.well-known/openid-configuration`;
    const response = await fetch(discoveryUrl, {
      headers: { "user-agent": userAgent }
    });
    if (!response.ok) {
      throw new Error("Failed to discover OAuth endpoints");
    }
    const metadata = await response.json();
    if (!metadata || typeof metadata.token_endpoint !== "string") {
      throw new Error("Invalid OAuth discovery response");
    }
    const endpoint = metadata.token_endpoint;
    _tokenEndpoint = endpoint;
    return endpoint;
  }
  async function refreshTokenRequest(options) {
    const tokenEndpoint = await getTokenEndpoint();
    return await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "user-agent": userAgent
      },
      body: new URLSearchParams({
        client_id: VERCEL_CLI_CLIENT_ID,
        grant_type: "refresh_token",
        ...options
      })
    });
  }
  async function processTokenResponse(response) {
    const json = await response.json();
    if (!response.ok) {
      const errorMsg = typeof json === "object" && json && "error" in json ? String(json.error) : "Token refresh failed";
      return [new Error(errorMsg)];
    }
    if (typeof json !== "object" || json === null) {
      return [new Error("Invalid token response")];
    }
    if (typeof json.access_token !== "string") {
      return [new Error("Missing access_token in response")];
    }
    if (json.token_type !== "Bearer") {
      return [new Error("Invalid token_type in response")];
    }
    if (typeof json.expires_in !== "number") {
      return [new Error("Missing expires_in in response")];
    }
    return [null, json];
  }
  return oauth;
}
var tokenUtil$2;
var hasRequiredTokenUtil;
function requireTokenUtil() {
  if (hasRequiredTokenUtil) return tokenUtil$2;
  hasRequiredTokenUtil = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var token_util_exports = {};
  __export(token_util_exports, {
    assertVercelOidcTokenResponse: () => assertVercelOidcTokenResponse,
    findProjectInfo: () => findProjectInfo,
    getTokenPayload: () => getTokenPayload,
    getVercelOidcToken: () => getVercelOidcToken,
    getVercelOidcTokenFromCli: () => getVercelOidcTokenFromCli,
    getVercelToken: () => getVercelToken,
    isExpired: () => isExpired,
    loadToken: () => loadToken,
    saveToken: () => saveToken
  });
  tokenUtil$2 = __toCommonJS(token_util_exports);
  var path = __toESM(require$$0);
  var fs = __toESM(require$$0$1);
  var import_cli_exec2 = requireDist$1();
  var import_cli_config2 = requireDist$2();
  var import_token_error = requireTokenError();
  var import_token_io = requireTokenIo();
  var import_oauth = requireOauth();
  var import_auth_errors = requireAuthErrors();
  async function getVercelToken(options) {
    const configDir = (0, import_cli_config2.getGlobalPathConfig)();
    const authConfig = (0, import_cli_config2.tryReadAuthConfig)(configDir);
    if (!authConfig || !authConfig.token && !authConfig.refreshToken) {
      throw new import_auth_errors.AccessTokenMissingError();
    }
    if (isValidAccessToken(authConfig, options?.expirationBufferMs)) {
      return authConfig.token;
    }
    if (!authConfig.refreshToken) {
      (0, import_cli_config2.writeAuthConfig)(configDir, {});
      throw new import_auth_errors.RefreshAccessTokenFailedError("No refresh token available");
    }
    try {
      const tokenResponse = await (0, import_oauth.refreshTokenRequest)({
        refresh_token: authConfig.refreshToken
      });
      const [tokensError, tokens] = await (0, import_oauth.processTokenResponse)(tokenResponse);
      if (tokensError || !tokens) {
        (0, import_cli_config2.writeAuthConfig)(configDir, {});
        throw new import_auth_errors.RefreshAccessTokenFailedError(tokensError);
      }
      const updatedConfig = {
        token: tokens.access_token,
        expiresAt: Math.floor(Date.now() / 1e3) + tokens.expires_in,
        refreshToken: tokens.refresh_token
      };
      (0, import_cli_config2.writeAuthConfig)(configDir, updatedConfig);
      return updatedConfig.token;
    } catch (error) {
      (0, import_cli_config2.writeAuthConfig)(configDir, {});
      if (error instanceof import_auth_errors.AccessTokenMissingError || error instanceof import_auth_errors.RefreshAccessTokenFailedError) {
        throw error;
      }
      throw new import_auth_errors.RefreshAccessTokenFailedError(error);
    }
  }
  function isValidAccessToken(authConfig, expirationBufferMs = 0) {
    if (!authConfig.token)
      return false;
    if (typeof authConfig.expiresAt !== "number")
      return true;
    const nowInSeconds = Math.floor(Date.now() / 1e3);
    const bufferInSeconds = expirationBufferMs / 1e3;
    return authConfig.expiresAt >= nowInSeconds + bufferInSeconds;
  }
  async function getVercelOidcTokenFromCli(projectId, teamId) {
    const args = ["project", "token", projectId, "--format=json"];
    if (teamId) {
      args.push("--scope", teamId);
    }
    try {
      const { stdout } = await (0, import_cli_exec2.execVercelCli)(args);
      let parsedOutput;
      if (typeof stdout !== "string") {
        throw new import_token_error.VercelOidcTokenError(
          "Failed to refresh OIDC token: `vercel project token` did not return stdout"
        );
      }
      try {
        parsedOutput = JSON.parse(stdout);
      } catch {
        throw new import_token_error.VercelOidcTokenError(
          "Failed to refresh OIDC token: `vercel project token` returned invalid JSON: " + stdout
        );
      }
      assertVercelOidcTokenResponse(parsedOutput);
      return parsedOutput;
    } catch (error) {
      if (error instanceof import_token_error.VercelOidcTokenError) {
        throw error;
      }
      let message = error instanceof Error ? error.message : "";
      const stderr = error instanceof import_cli_exec2.VercelCliError ? error.stderr?.trim() : void 0;
      if (stderr && !message.includes(stderr)) {
        message = `${message}
${stderr}`.trim();
      }
      throw new import_token_error.VercelOidcTokenError(
        message ? `Failed to refresh OIDC token with the Vercel CLI: ${message}` : "Failed to refresh OIDC token with the Vercel CLI"
      );
    }
  }
  async function getVercelOidcToken(authToken, projectId, teamId) {
    const url = `https://api.vercel.com/v1/projects/${projectId}/token?source=vercel-oidc-refresh${teamId ? `&teamId=${teamId}` : ""}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    if (!res.ok) {
      throw new import_token_error.VercelOidcTokenError(
        `Failed to refresh OIDC token: ${res.statusText}`
      );
    }
    const tokenRes = await res.json();
    assertVercelOidcTokenResponse(tokenRes);
    return tokenRes;
  }
  function assertVercelOidcTokenResponse(res) {
    if (!res || typeof res !== "object") {
      throw new TypeError("Vercel OIDC token is malformed. Expected an object.");
    }
    if (!("token" in res) || typeof res.token !== "string") {
      throw new TypeError(
        "Vercel OIDC token is malformed. Expected a string-valued token property."
      );
    }
  }
  function findProjectInfo() {
    const dir = (0, import_token_io.findRootDir)();
    if (!dir) {
      throw new import_token_error.VercelOidcTokenError(
        "Unable to find project root directory. Have you linked your project with `vc link?`"
      );
    }
    const prjPath = path.join(dir, ".vercel", "project.json");
    if (!fs.existsSync(prjPath)) {
      throw new import_token_error.VercelOidcTokenError(
        "project.json not found, have you linked your project with `vc link?`"
      );
    }
    const prj = JSON.parse(fs.readFileSync(prjPath, "utf8"));
    if (typeof prj.projectId !== "string" && typeof prj.orgId !== "string") {
      throw new TypeError(
        "Expected a string-valued projectId property. Try running `vc link` to re-link your project."
      );
    }
    return { projectId: prj.projectId, teamId: prj.orgId };
  }
  function saveToken(token2, projectId) {
    const dir = (0, import_token_io.getUserDataDir)();
    if (!dir) {
      throw new import_token_error.VercelOidcTokenError(
        "Unable to find user data directory. Please reach out to Vercel support."
      );
    }
    const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
    const tokenJson = JSON.stringify(token2);
    fs.mkdirSync(path.dirname(tokenPath), { mode: 504, recursive: true });
    fs.writeFileSync(tokenPath, tokenJson);
    fs.chmodSync(tokenPath, 432);
    return;
  }
  function loadToken(projectId) {
    const dir = (0, import_token_io.getUserDataDir)();
    if (!dir) {
      throw new import_token_error.VercelOidcTokenError(
        "Unable to find user data directory. Please reach out to Vercel support."
      );
    }
    const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
    if (!fs.existsSync(tokenPath)) {
      return null;
    }
    const token2 = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    assertVercelOidcTokenResponse(token2);
    return token2;
  }
  function getTokenPayload(token2) {
    const tokenParts = token2.split(".");
    if (tokenParts.length !== 3) {
      throw new import_token_error.VercelOidcTokenError("Invalid token.");
    }
    const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + (4 - base64.length % 4) % 4,
      "="
    );
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  }
  function isExpired(token2, bufferMs = 0) {
    return token2.exp * 1e3 < Date.now() + bufferMs;
  }
  return tokenUtil$2;
}
var dist;
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var src_exports = {};
  __export(src_exports, {
    AccessTokenMissingError: () => import_auth_errors.AccessTokenMissingError,
    RefreshAccessTokenFailedError: () => import_auth_errors.RefreshAccessTokenFailedError,
    exchangeVercelOidcToken: () => import_exchange_vercel_oidc_token.exchangeVercelOidcToken,
    getContext: () => import_get_context.getContext,
    getVercelOidcToken: () => import_get_vercel_oidc_token_with_refresh.getVercelOidcToken,
    getVercelOidcTokenSync: () => import_get_vercel_oidc_token_sync.getVercelOidcTokenSync,
    getVercelToken: () => import_token_util.getVercelToken,
    verifyVercelOidcToken: () => import_verify_vercel_oidc_token.verifyVercelOidcToken
  });
  dist = __toCommonJS(src_exports);
  var import_get_vercel_oidc_token_with_refresh = requireGetVercelOidcTokenWithRefresh();
  var import_get_vercel_oidc_token_sync = requireGetVercelOidcTokenSync();
  var import_get_context = requireGetContext();
  var import_verify_vercel_oidc_token = requireVerifyVercelOidcToken();
  var import_auth_errors = requireAuthErrors();
  var import_exchange_vercel_oidc_token = requireExchangeVercelOidcToken();
  var import_token_util = requireTokenUtil();
  return dist;
}
var distExports = requireDist();
var tokenUtilExports = requireTokenUtil();
const tokenUtil = /* @__PURE__ */ getDefaultExportFromCjs(tokenUtilExports);
const tokenUtil$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: tokenUtil
}, [tokenUtilExports]);
var token$2;
var hasRequiredToken;
function requireToken() {
  if (hasRequiredToken) return token$2;
  hasRequiredToken = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var token_exports = {};
  __export(token_exports, {
    refreshToken: () => refreshToken
  });
  token$2 = __toCommonJS(token_exports);
  var import_cli_config2 = requireDist$2();
  var import_token_error = requireTokenError();
  var import_token_util = requireTokenUtil();
  async function refreshToken(options) {
    let projectId = options?.project;
    let teamId = options?.team;
    if (!projectId && !teamId) {
      const projectInfo = (0, import_token_util.findProjectInfo)();
      projectId = projectInfo.projectId;
      teamId = projectInfo.teamId;
    } else if (!projectId || !teamId) {
      const projectInfo = (0, import_token_util.findProjectInfo)();
      projectId = projectId ?? projectInfo.projectId;
      teamId = teamId ?? projectInfo.teamId;
    }
    if (!projectId) {
      throw new import_token_error.VercelOidcTokenError(
        "Failed to refresh OIDC token: No project specified. Try re-linking your project with `vc link`"
      );
    }
    let maybeToken = (0, import_token_util.loadToken)(projectId);
    if (!maybeToken || (0, import_token_util.isExpired)((0, import_token_util.getTokenPayload)(maybeToken.token), options?.expirationBufferMs)) {
      const configDir = (0, import_cli_config2.getGlobalPathConfig)();
      if ((0, import_cli_config2.getLikelyEffectiveCredStorage)(configDir) === "keyring") {
        maybeToken = await (0, import_token_util.getVercelOidcTokenFromCli)(projectId, teamId);
      } else {
        const authToken = await (0, import_token_util.getVercelToken)({
          expirationBufferMs: options?.expirationBufferMs
        });
        maybeToken = await (0, import_token_util.getVercelOidcToken)(authToken, projectId, teamId);
      }
      if (!maybeToken) {
        throw new import_token_error.VercelOidcTokenError("Failed to refresh OIDC token");
      }
      (0, import_token_util.saveToken)(maybeToken, projectId);
    }
    process.env.VERCEL_OIDC_TOKEN = maybeToken.token;
    return;
  }
  return token$2;
}
var tokenExports = requireToken();
const token = /* @__PURE__ */ getDefaultExportFromCjs(tokenExports);
const token$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: token
}, [tokenExports]);
export {
  distExports as d
};
