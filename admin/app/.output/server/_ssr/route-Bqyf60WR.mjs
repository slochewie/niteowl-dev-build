import { jsx } from "react/jsx-runtime";
import { a as capitalizeFirstLetter, d as defineErrorCodes, e as env, i as isSafeUrlScheme, t as toKebabCase, B as BetterAuthError } from "../_libs/better-auth__core.mjs";
import { d as defu } from "../_libs/defu.mjs";
import { c as createFetch } from "../_libs/better-fetch__fetch.mjs";
import { useRef, useCallback, useSyncExternalStore } from "react";
import { u as useNavigate, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { Q as QueryClientProvider } from "./QueryClientProvider-BNL98aJf.mjs";
import { i as getOrCreateQueryClient, H as StackProvider } from "./router-qu_5GP1h.mjs";
import "../_libs/better-call.mjs";
import "../_libs/react-error-boundary.mjs";
import "../_libs/pg.mjs";
import "../_libs/slug.mjs";
import { l as listenKeys, o as onMount, a as atom, b as onSet } from "../_libs/nanostores.mjs";
import "../_libs/better-auth__utils.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "react-dom";
import "react-dom/server";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/btst__yar.mjs";
import "../_libs/rou3.mjs";
import "../_libs/lukemorales__query-key-factory.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/btst__adapter-drizzle.mjs";
import "../_libs/drizzle-orm.mjs";
import "../_libs/btst__db.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "../_libs/react.mjs";
import "../_libs/pg-types.mjs";
import "../_libs/postgres-array.mjs";
import "../_libs/postgres-date.mjs";
import "../_libs/postgres-interval.mjs";
import "../_libs/xtend.mjs";
import "../_libs/postgres-bytea.mjs";
import "../_libs/pg-int8.mjs";
import "util";
import "crypto";
import "../_libs/pg-connection-string.mjs";
import "fs";
import "../_libs/pg-protocol.mjs";
import "../_libs/pg-cloudflare.mjs";
import "../_libs/pgpass.mjs";
import "path";
import "stream";
import "../_libs/split2.mjs";
import "string_decoder";
import "../_libs/pg-pool.mjs";
const SLASH_CHAR_CODE = "/".charCodeAt(0);
function trimTrailingSlashes(value) {
  let end = value.length;
  while (end > 0 && value.charCodeAt(end - 1) === SLASH_CHAR_CODE) end--;
  return end === value.length ? value : value.slice(0, end);
}
function checkHasPath(url) {
  try {
    return (trimTrailingSlashes(new URL(url).pathname) || "/") !== "/";
  } catch {
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`);
  }
}
function assertHasProtocol(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new BetterAuthError(`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
  } catch (error) {
    if (error instanceof BetterAuthError) throw error;
    throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`, { cause: error });
  }
}
function withPath(url, path = "/api/auth") {
  assertHasProtocol(url);
  if (checkHasPath(url)) return url;
  const trimmedUrl = trimTrailingSlashes(url);
  if (!path || path === "/") return trimmedUrl;
  path = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedUrl}${path}`;
}
function getBaseURL$1(url, path, request, loadEnv, trustedProxyHeaders) {
  if (url) return withPath(url, path);
  {
    const fromEnv = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
    if (fromEnv) return withPath(fromEnv, path);
  }
  if (typeof window !== "undefined" && window.location) return withPath(window.location.origin, path);
}
const PROTO_POLLUTION_PATTERNS = {
  proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
  constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
  protoShort: /"__proto__"\s*:/,
  constructorShort: /"constructor"\s*:/
};
const JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
const SPECIAL_VALUES = {
  true: true,
  false: false,
  null: null,
  undefined: void 0,
  nan: NaN,
  infinity: Number.POSITIVE_INFINITY,
  "-infinity": Number.NEGATIVE_INFINITY
};
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
  const match = ISO_DATE_REGEX.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
  const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
  if (offsetSign) {
    const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
    date.setUTCMinutes(date.getUTCMinutes() + offset);
  }
  return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
  const { strict = false, warnings = false, reviver, parseDates = true } = options;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  const lowerValue = trimmed.toLowerCase();
  if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
  if (!JSON_SIGNATURE.test(trimmed)) {
    if (strict) throw new SyntaxError("[better-json] Invalid JSON");
    return value;
  }
  if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
    const matches = pattern.test(trimmed);
    if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
    return matches;
  }) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
  try {
    const secureReviver = (key, value2) => {
      if (key === "__proto__" || key === "constructor" && value2 && typeof value2 === "object" && "prototype" in value2) {
        if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
        return;
      }
      if (parseDates && typeof value2 === "string") {
        const date = parseISODate(value2);
        if (date) return date;
      }
      return reviver ? reviver(key, value2) : value2;
    };
    return JSON.parse(trimmed, secureReviver);
  } catch (error) {
    if (strict) throw error;
    return value;
  }
}
function parseJSON(value, options = { strict: true }) {
  return betterJSONParse(value, options);
}
const redirectPlugin = {
  id: "redirect",
  name: "Redirect",
  hooks: { onSuccess(context) {
    if (context.data?.url && context.data?.redirect && isSafeUrlScheme(context.data.url)) {
      if (typeof window !== "undefined" && window.location) {
        if (window.location) try {
          window.location.href = context.data.url;
        } catch {
        }
      }
    }
  } }
};
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function isJsonEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!isJsonEqual(a[i], b[i])) return false;
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) if (!(key in b) || !isJsonEqual(a[key], b[key])) return false;
    return true;
  }
  return false;
}
function withEquality(store, isEqual) {
  return onSet(store, ({ newValue, abort }) => {
    if (isEqual(store.value, newValue)) abort();
  });
}
const kBroadcastChannel = /* @__PURE__ */ Symbol.for("better-auth:broadcast-channel");
const now$1 = () => Math.floor(Date.now() / 1e3);
var WindowBroadcastChannel = class {
  listeners = /* @__PURE__ */ new Set();
  name;
  constructor(name = "better-auth.message") {
    this.name = name;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  post(message) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.name, JSON.stringify({
        ...message,
        timestamp: now$1()
      }));
    } catch {
    }
  }
  setup() {
    if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const handler = (event) => {
      if (event.key !== this.name) return;
      const message = JSON.parse(event.newValue ?? "{}");
      if (message?.event !== "session" || !message?.data) return;
      this.listeners.forEach((listener) => listener(message));
    };
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }
};
function getGlobalBroadcastChannel(name = "better-auth.message") {
  if (!globalThis[kBroadcastChannel]) globalThis[kBroadcastChannel] = new WindowBroadcastChannel(name);
  return globalThis[kBroadcastChannel];
}
const kFocusManager = /* @__PURE__ */ Symbol.for("better-auth:focus-manager");
var WindowFocusManager = class {
  listeners = /* @__PURE__ */ new Set();
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setFocused(focused) {
    this.listeners.forEach((listener) => listener(focused));
  }
  setup() {
    if (typeof window === "undefined" || typeof document === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") this.setFocused(true);
    };
    document.addEventListener("visibilitychange", visibilityHandler, false);
    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler, false);
    };
  }
};
function getGlobalFocusManager() {
  if (!globalThis[kFocusManager]) globalThis[kFocusManager] = new WindowFocusManager();
  return globalThis[kFocusManager];
}
const kOnlineManager = /* @__PURE__ */ Symbol.for("better-auth:online-manager");
var WindowOnlineManager = class {
  listeners = /* @__PURE__ */ new Set();
  isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setOnline(online) {
    this.isOnline = online;
    this.listeners.forEach((listener) => listener(online));
  }
  setup() {
    if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {
    };
    const onOnline = () => this.setOnline(true);
    const onOffline = () => this.setOnline(false);
    window.addEventListener("online", onOnline, false);
    window.addEventListener("offline", onOffline, false);
    return () => {
      window.removeEventListener("online", onOnline, false);
      window.removeEventListener("offline", onOffline, false);
    };
  }
};
function getGlobalOnlineManager() {
  if (!globalThis[kOnlineManager]) globalThis[kOnlineManager] = new WindowOnlineManager();
  return globalThis[kOnlineManager];
}
const now = () => Math.floor(Date.now() / 1e3);
const FOCUS_REFETCH_RATE_LIMIT_SECONDS = 5;
function createSessionRefreshManager(opts) {
  const { fetchSession, shouldPollSession = () => true, sessionSignal, options = {} } = opts;
  const refetchInterval = options.sessionOptions?.refetchInterval ?? 0;
  const refetchOnWindowFocus = options.sessionOptions?.refetchOnWindowFocus ?? true;
  const refetchWhenOffline = options.sessionOptions?.refetchWhenOffline ?? false;
  const state = {
    isInitialized: false,
    lastSessionRequest: 0
  };
  const shouldRefetch = () => {
    return refetchWhenOffline || getGlobalOnlineManager().isOnline;
  };
  const triggerRefetch = (event) => {
    if (!shouldRefetch()) return;
    if (event?.event === "storage") {
      fetchSession();
      return;
    }
    if (event?.event === "poll") {
      state.lastSessionRequest = now();
      fetchSession();
      return;
    }
    if (event?.event === "visibilitychange") {
      if (now() - state.lastSessionRequest < FOCUS_REFETCH_RATE_LIMIT_SECONDS) return;
      state.lastSessionRequest = now();
      fetchSession();
      return;
    }
    fetchSession();
  };
  const broadcastSessionUpdate = (trigger) => {
    getGlobalBroadcastChannel().post({
      event: "session",
      data: { trigger },
      clientId: Math.random().toString(36).substring(7)
    });
  };
  const setupPolling = () => {
    if (refetchInterval && refetchInterval > 0) state.pollInterval = setInterval(() => {
      if (shouldPollSession()) triggerRefetch({ event: "poll" });
    }, refetchInterval * 1e3);
  };
  const setupBroadcast = () => {
    state.unsubscribeBroadcast = getGlobalBroadcastChannel().subscribe(() => {
      triggerRefetch({ event: "storage" });
    });
  };
  const setupFocusRefetch = () => {
    if (!refetchOnWindowFocus) return;
    state.unsubscribeFocus = getGlobalFocusManager().subscribe(() => {
      triggerRefetch({ event: "visibilitychange" });
    });
  };
  const setupOnlineRefetch = () => {
    state.unsubscribeOnline = getGlobalOnlineManager().subscribe((online) => {
      if (online) triggerRefetch({ event: "visibilitychange" });
    });
  };
  const setupSignalSubscription = () => {
    state.unsubscribeSignal = sessionSignal.listen(() => {
      fetchSession();
    });
  };
  const init = () => {
    if (state.isInitialized) return;
    state.isInitialized = true;
    setupPolling();
    setupBroadcast();
    setupFocusRefetch();
    setupOnlineRefetch();
    setupSignalSubscription();
    state.cleanupBroadcastSetup = getGlobalBroadcastChannel().setup();
    state.cleanupFocusSetup = getGlobalFocusManager().setup();
    state.cleanupOnlineSetup = getGlobalOnlineManager().setup();
  };
  const cleanup = () => {
    if (!state.isInitialized) return;
    if (state.pollInterval) {
      clearInterval(state.pollInterval);
      state.pollInterval = void 0;
    }
    if (state.unsubscribeBroadcast) {
      state.unsubscribeBroadcast();
      state.unsubscribeBroadcast = void 0;
    }
    if (state.unsubscribeFocus) {
      state.unsubscribeFocus();
      state.unsubscribeFocus = void 0;
    }
    if (state.unsubscribeOnline) {
      state.unsubscribeOnline();
      state.unsubscribeOnline = void 0;
    }
    if (state.unsubscribeSignal) {
      state.unsubscribeSignal();
      state.unsubscribeSignal = void 0;
    }
    if (state.cleanupBroadcastSetup) {
      state.cleanupBroadcastSetup();
      state.cleanupBroadcastSetup = void 0;
    }
    if (state.cleanupFocusSetup) {
      state.cleanupFocusSetup();
      state.cleanupFocusSetup = void 0;
    }
    if (state.cleanupOnlineSetup) {
      state.cleanupOnlineSetup();
      state.cleanupOnlineSetup = void 0;
    }
    state.isInitialized = false;
    state.lastSessionRequest = 0;
  };
  return {
    init,
    cleanup,
    triggerRefetch,
    broadcastSessionUpdate
  };
}
const isServer$1 = () => typeof window === "undefined";
function normalizeSessionResponse(res) {
  if (typeof res === "object" && res !== null && "data" in res && "error" in res) return res;
  return {
    data: res,
    error: null
  };
}
function normalizeSessionData(data) {
  if (!data) return null;
  if (data.session === null && data.user === null) return null;
  return data;
}
function isSessionAtomEqual(a, b) {
  return isJsonEqual(a.data, b.data) && a.error === b.error && a.isPending === b.isPending && a.isRefetching === b.isRefetching && a.refetch === b.refetch;
}
function getSessionAtom($fetch, options) {
  const $signal = atom(false);
  let abortController;
  const refetch = (queryParams) => fetchSession(queryParams);
  const session = atom({
    data: null,
    error: null,
    isPending: true,
    isRefetching: false,
    refetch
  });
  withEquality(session, isSessionAtomEqual);
  const settleAbortedFetch = (controller) => {
    if (abortController !== controller) return;
    const current = session.get();
    abortController = void 0;
    if (!current.isPending && !current.isRefetching) return;
    session.set({
      ...current,
      isPending: false,
      isRefetching: false,
      refetch
    });
  };
  const fetchSession = async (queryParams) => {
    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;
    const current = session.get();
    session.set({
      ...current,
      isPending: current.data === null,
      isRefetching: true,
      error: null,
      refetch
    });
    try {
      const res = await $fetch("/get-session", {
        method: "GET",
        query: queryParams?.query,
        signal: controller.signal
      });
      if (controller.signal.aborted) {
        settleAbortedFetch(controller);
        return;
      }
      let { data, error } = normalizeSessionResponse(res);
      if (data?.needsRefresh) try {
        const refreshRes = await $fetch("/get-session", {
          method: "POST",
          signal: controller.signal
        });
        if (controller.signal.aborted) {
          settleAbortedFetch(controller);
          return;
        }
        ({ data, error } = normalizeSessionResponse(refreshRes));
      } catch {
        if (controller.signal.aborted) {
          settleAbortedFetch(controller);
          return;
        }
      }
      if (error) {
        const latest = session.get();
        const isUnauthorized = error?.status === 401;
        session.set({
          data: isUnauthorized ? null : latest.data,
          error,
          isPending: false,
          isRefetching: false,
          refetch
        });
        return;
      }
      const sessionData = normalizeSessionData(data);
      const current2 = session.get();
      const stableData = current2.data != null && sessionData != null && isJsonEqual(current2.data, sessionData) ? current2.data : sessionData;
      session.set({
        data: stableData,
        error: null,
        isPending: false,
        isRefetching: false,
        refetch
      });
    } catch (fetchError) {
      if (controller.signal.aborted) {
        settleAbortedFetch(controller);
        return;
      }
      const latest = session.get();
      session.set({
        data: latest.data,
        error: fetchError,
        isPending: false,
        isRefetching: false,
        refetch
      });
    }
  };
  let broadcastSessionUpdate = () => {
  };
  onMount(session, () => {
    let timeoutId;
    if (!isServer$1()) timeoutId = setTimeout(() => {
      fetchSession();
    }, 0);
    const refreshManager = createSessionRefreshManager({
      fetchSession,
      shouldPollSession: () => session.get().data != null,
      sessionSignal: $signal,
      options
    });
    refreshManager.init();
    broadcastSessionUpdate = refreshManager.broadcastSessionUpdate;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      const controller = abortController;
      controller?.abort();
      if (controller) settleAbortedFetch(controller);
      refreshManager.cleanup();
    };
  });
  return {
    session,
    $sessionSignal: $signal,
    broadcastSessionUpdate: (trigger) => broadcastSessionUpdate(trigger)
  };
}
const resolvePublicAuthUrl = (basePath) => {
  if (typeof process === "undefined") return void 0;
  const path = basePath ?? "/api/auth";
  if (process.env.NEXT_PUBLIC_AUTH_URL) return process.env.NEXT_PUBLIC_AUTH_URL;
  if (typeof window === "undefined") {
    if (process.env.NEXTAUTH_URL) try {
      return process.env.NEXTAUTH_URL;
    } catch {
    }
    if (process.env.VERCEL_URL) try {
      const protocol = process.env.VERCEL_URL.startsWith("http") ? "" : "https://";
      return `${new URL(`${protocol}${process.env.VERCEL_URL}`).origin}${path}`;
    } catch {
    }
  }
};
const getClientConfig = (options, loadEnv) => {
  const isCredentialsSupported = "credentials" in Request.prototype;
  const baseURL = getBaseURL$1(options?.baseURL, options?.basePath) ?? resolvePublicAuthUrl(options?.basePath) ?? "/api/auth";
  const pluginsFetchPlugins = options?.plugins?.flatMap((plugin) => plugin.fetchPlugins).filter((pl) => pl !== void 0) || [];
  const lifeCyclePlugin = {
    id: "lifecycle-hooks",
    name: "lifecycle-hooks",
    hooks: {
      onSuccess: options?.fetchOptions?.onSuccess,
      onError: options?.fetchOptions?.onError,
      onRequest: options?.fetchOptions?.onRequest,
      onResponse: options?.fetchOptions?.onResponse
    }
  };
  const { onSuccess: _onSuccess, onError: _onError, onRequest: _onRequest, onResponse: _onResponse, ...restOfFetchOptions } = options?.fetchOptions || {};
  const $fetch = createFetch({
    baseURL,
    ...isCredentialsSupported ? { credentials: "include" } : {},
    method: "GET",
    jsonParser(text) {
      if (!text) return null;
      return parseJSON(text, { strict: false });
    },
    customFetchImpl: fetch,
    ...restOfFetchOptions,
    plugins: [
      lifeCyclePlugin,
      ...restOfFetchOptions.plugins || [],
      ...options?.disableDefaultFetchPlugins ? [] : [redirectPlugin],
      ...pluginsFetchPlugins
    ]
  });
  const { $sessionSignal, session, broadcastSessionUpdate } = getSessionAtom($fetch, options);
  const plugins = options?.plugins || [];
  let pluginsActions = {};
  const pluginsAtoms = {
    $sessionSignal,
    session
  };
  const pluginPathMethods = {
    "/sign-out": "POST",
    "/revoke-sessions": "POST",
    "/revoke-other-sessions": "POST",
    "/delete-user": "POST"
  };
  const atomListeners = [{
    signal: "$sessionSignal",
    matcher(path) {
      return path === "/sign-out" || path === "/update-user" || path === "/update-session" || path === "/sign-up/email" || path === "/sign-in/email" || path === "/delete-user" || path === "/verify-email" || path === "/revoke-sessions" || path === "/revoke-session" || path === "/revoke-other-sessions" || path === "/change-email" || path === "/change-password";
    },
    callback(path) {
      if (path === "/sign-out") broadcastSessionUpdate("signout");
      else if (path === "/update-user" || path === "/update-session") broadcastSessionUpdate("updateUser");
    }
  }];
  for (const plugin of plugins) {
    if (plugin.getAtoms) Object.assign(pluginsAtoms, plugin.getAtoms?.($fetch));
    if (plugin.pathMethods) Object.assign(pluginPathMethods, plugin.pathMethods);
    if (plugin.atomListeners) atomListeners.push(...plugin.atomListeners);
  }
  const $store = {
    notify: (signal) => {
      pluginsAtoms[signal].set(!pluginsAtoms[signal].get());
    },
    listen: (signal, listener) => {
      pluginsAtoms[signal].subscribe(listener);
    },
    atoms: pluginsAtoms
  };
  for (const plugin of plugins) if (plugin.getActions) pluginsActions = defu(plugin.getActions?.($fetch, $store, options) ?? {}, pluginsActions);
  return {
    get baseURL() {
      return baseURL;
    },
    pluginsActions,
    pluginsAtoms,
    pluginPathMethods,
    atomListeners,
    $fetch,
    $store
  };
};
function isAtom(value) {
  return typeof value === "object" && value !== null && "get" in value && typeof value.get === "function" && "lc" in value && typeof value.lc === "number";
}
function getMethod(path, knownPathMethods, args) {
  const method = knownPathMethods[path];
  const { fetchOptions, query: _query, ...body } = args || {};
  if (method) return method;
  if (fetchOptions?.method) return fetchOptions.method;
  if (body && Object.keys(body).length > 0) return "POST";
  return "GET";
}
function createDynamicPathProxy(routes, client, knownPathMethods, atoms, atomListeners) {
  function createProxy(path = []) {
    return new Proxy(function() {
    }, {
      get(_, prop) {
        if (typeof prop !== "string") return;
        if (prop === "then" || prop === "catch" || prop === "finally") return;
        const fullPath = [...path, prop];
        let current = routes;
        for (const segment of fullPath) if (current && typeof current === "object" && segment in current) current = current[segment];
        else {
          current = void 0;
          break;
        }
        if (typeof current === "function") return current;
        if (isAtom(current)) return current;
        return createProxy(fullPath);
      },
      apply: async (_, __, args) => {
        const routePath = "/" + path.map(toKebabCase).join("/");
        const arg = args[0] || {};
        const fetchOptions = args[1] || {};
        const { query, fetchOptions: argFetchOptions, ...body } = arg;
        const options = {
          ...fetchOptions,
          ...argFetchOptions
        };
        const method = getMethod(routePath, knownPathMethods, arg);
        return await client(routePath, {
          ...options,
          body: method === "GET" ? void 0 : {
            ...body,
            ...options?.body || {}
          },
          query: query || options?.query,
          method,
          async onSuccess(context) {
            await options?.onSuccess?.(context);
            if (!atomListeners || options.disableSignal) return;
            const matches = atomListeners.filter((s) => s.matcher(routePath));
            if (!matches.length) return;
            const visited = /* @__PURE__ */ new Set();
            for (const match of matches) {
              const signal = atoms[match.signal];
              if (!signal) return;
              if (visited.has(match.signal)) continue;
              visited.add(match.signal);
              const val = signal.get();
              setTimeout(() => {
                signal.set(!val);
              }, 10);
              match.callback?.(routePath);
            }
          }
        });
      }
    });
  }
  return createProxy();
}
function useStore(store, options = {}) {
  const snapshotRef = useRef(store.get());
  const { keys, deps = [store, keys] } = options;
  const subscribe = useCallback((onChange) => {
    const emitChange = (value) => {
      if (snapshotRef.current === value) return;
      snapshotRef.current = value;
      onChange();
    };
    emitChange(store.value);
    if (keys?.length) return listenKeys(store, keys, emitChange);
    return store.listen(emitChange);
  }, deps);
  const get = () => snapshotRef.current;
  return useSyncExternalStore(subscribe, get, get);
}
function getAtomKey(str) {
  return `use${capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
  const { pluginPathMethods, pluginsActions, pluginsAtoms, $fetch, $store, atomListeners } = getClientConfig(options);
  const resolvedHooks = {};
  for (const [key, value] of Object.entries(pluginsAtoms)) resolvedHooks[getAtomKey(key)] = () => useStore(value);
  return createDynamicPathProxy({
    ...pluginsActions,
    ...resolvedHooks,
    $fetch,
    $store
  }, $fetch, pluginPathMethods, pluginsAtoms, atomListeners);
}
var version = "1.6.25";
const PACKAGE_VERSION = version;
function unknownResourceResponse(requestedResource) {
  return {
    success: false,
    error: `You are not allowed to access resource: ${requestedResource}`
  };
}
function unauthorizedResourceResponse(requestedResource) {
  return {
    success: false,
    error: `unauthorized to access resource "${requestedResource}"`
  };
}
function normalizeConnector(connector) {
  return connector === "OR" ? "OR" : "AND";
}
function isActionList(actions) {
  return Array.isArray(actions);
}
function normalizeActionRequest(requestedActions) {
  if (isActionList(requestedActions)) return {
    actions: requestedActions,
    connector: "AND"
  };
  if (!requestedActions || typeof requestedActions !== "object") throw new BetterAuthError("Invalid access control request");
  const { actions, connector } = requestedActions;
  if (!isActionList(actions)) return {
    actions: [],
    connector: normalizeConnector(connector)
  };
  return {
    actions,
    connector: normalizeConnector(connector)
  };
}
function hasAllowedAction(allowedActions, requestedAction) {
  return typeof requestedAction === "string" && allowedActions.includes(requestedAction);
}
function isResourceAuthorized(allowedActions, { actions, connector }) {
  if (actions.length === 0) return false;
  if (connector === "OR") return actions.some((requestedAction) => hasAllowedAction(allowedActions, requestedAction));
  return actions.every((requestedAction) => hasAllowedAction(allowedActions, requestedAction));
}
function role(statements) {
  return {
    authorize(request, connector = "AND") {
      let hasAuthorizedResource = false;
      for (const [requestedResource, requestedActions] of Object.entries(request)) {
        const allowedActions = statements[requestedResource];
        if (!allowedActions) {
          if (connector === "AND") return unknownResourceResponse(requestedResource);
          continue;
        }
        const isAuthorized = isResourceAuthorized(allowedActions, normalizeActionRequest(requestedActions));
        if (isAuthorized) hasAuthorizedResource = true;
        if (isAuthorized && connector === "OR") return { success: true };
        if (!isAuthorized && connector === "AND") return unauthorizedResourceResponse(requestedResource);
      }
      if (hasAuthorizedResource) return { success: true };
      return {
        success: false,
        error: "Not authorized"
      };
    },
    statements
  };
}
function createAccessControl(s) {
  return {
    newRole(statements) {
      return role(statements);
    },
    statements: s
  };
}
const ORGANIZATION_ERROR_CODES = defineErrorCodes({
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
  ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
  ORGANIZATION_SLUG_ALREADY_TAKEN: "Organization slug already taken",
  ORGANIZATION_NOT_FOUND: "Organization not found",
  USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
  NO_ACTIVE_ORGANIZATION: "No active organization",
  USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
  MEMBER_NOT_FOUND: "Member not found",
  ROLE_NOT_FOUND: "Role not found",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
  TEAM_ALREADY_EXISTS: "Team already exists",
  TEAM_NOT_FOUND: "Team not found",
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
  YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: "You cannot leave the organization without an owner",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
  USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
  INVITATION_NOT_FOUND: "Invitation not found",
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
  EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: "Email verification required before accepting or rejecting invitation",
  EMAIL_VERIFICATION_REQUIRED_FOR_INVITATION: "Email verification required to view or list invitations for the session email",
  YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
  INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
  YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "You are not allowed to invite a user with this role",
  FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
  YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
  UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
  ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
  INVITATION_LIMIT_REACHED: "Invitation limit reached",
  TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached",
  USER_IS_NOT_A_MEMBER_OF_THE_TEAM: "User is not a member of the team",
  YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: "You are not allowed to list the members of this team",
  YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: "You do not have an active team",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: "You are not allowed to create a new member",
  YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: "You are not allowed to remove a team member",
  YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: "You are not allowed to access this organization as an owner",
  YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: "You are not a member of this organization",
  MISSING_AC_INSTANCE: "Dynamic Access Control requires a pre-defined ac instance on the server auth plugin. Read server logs for more information",
  YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: "You must be in an organization to create a role",
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: "You are not allowed to create a role",
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: "You are not allowed to update a role",
  YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: "You are not allowed to delete a role",
  YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: "You are not allowed to read a role",
  YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: "You are not allowed to list a role",
  YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: "You are not allowed to get a role",
  TOO_MANY_ROLES: "This organization has too many roles",
  INVALID_RESOURCE: "The provided permission includes an invalid resource",
  ROLE_NAME_IS_ALREADY_TAKEN: "That role name is already taken",
  CANNOT_DELETE_A_PRE_DEFINED_ROLE: "Cannot delete a pre-defined role",
  ROLE_IS_ASSIGNED_TO_MEMBERS: "Cannot delete a role that is assigned to members. Please reassign the members to a different role first",
  INVALID_TEAM_ID: "Team id contains a reserved character"
});
const isServer = () => typeof window === "undefined";
function isAuthQueryStateEqual(a, b) {
  return isJsonEqual(a.data, b.data) && a.error === b.error && a.isPending === b.isPending && a.isRefetching === b.isRefetching && a.refetch === b.refetch;
}
const useAuthQuery = (initializedAtom, path, $fetch, options) => {
  const value = atom({
    data: null,
    error: null,
    isPending: true,
    isRefetching: false,
    refetch: (queryParams) => fn(queryParams)
  });
  withEquality(value, isAuthQueryStateEqual);
  const fn = async (queryParams) => {
    return new Promise((resolve) => {
      const opts = typeof options === "function" ? options({
        data: value.get().data,
        error: value.get().error,
        isPending: value.get().isPending
      }) : options;
      $fetch(path, {
        ...opts,
        query: {
          ...opts?.query,
          ...queryParams?.query
        },
        async onSuccess(context) {
          const current = value.get();
          const stableData = current.data != null && context.data != null && isJsonEqual(current.data, context.data) ? current.data : context.data;
          value.set({
            data: stableData,
            error: null,
            isPending: false,
            isRefetching: false,
            refetch: value.value.refetch
          });
          await opts?.onSuccess?.(context);
        },
        async onError(context) {
          const { request } = context;
          const retryAttempts = typeof request.retry === "number" ? request.retry : request.retry?.attempts;
          const retryAttempt = request.retryAttempt || 0;
          if (retryAttempts && retryAttempt < retryAttempts) return;
          const isUnauthorized = context.error.status === 401;
          value.set({
            error: context.error,
            data: isUnauthorized ? null : value.get().data,
            isPending: false,
            isRefetching: false,
            refetch: value.value.refetch
          });
          await opts?.onError?.(context);
        },
        async onRequest(context) {
          const currentValue = value.get();
          value.set({
            isPending: currentValue.data === null,
            data: currentValue.data,
            error: null,
            isRefetching: true,
            refetch: value.value.refetch
          });
          await opts?.onRequest?.(context);
        }
      }).catch((error) => {
        value.set({
          error,
          data: value.get().data,
          isPending: false,
          isRefetching: false,
          refetch: value.value.refetch
        });
      }).finally(() => {
        resolve(void 0);
      });
    });
  };
  initializedAtom = Array.isArray(initializedAtom) ? initializedAtom : [initializedAtom];
  let isMountFetchPending = false;
  let isMounted = false;
  let shouldRefetchAfterPending = false;
  const fetchOnMount = () => {
    if (isMountFetchPending) {
      shouldRefetchAfterPending = true;
      return;
    }
    isMountFetchPending = true;
    fn().finally(() => {
      isMountFetchPending = false;
      const shouldRefetch = shouldRefetchAfterPending && isMounted;
      shouldRefetchAfterPending = false;
      if (shouldRefetch) fetchOnMount();
    });
  };
  onMount(value, () => {
    if (isServer()) return;
    isMounted = true;
    let isInitialized = false;
    let timeoutId;
    const cleanups = initializedAtom.map((initAtom) => initAtom.listen(() => {
      if (isInitialized) fn();
      else {
        isInitialized = true;
        clearTimeout(timeoutId);
        fetchOnMount();
      }
    }));
    timeoutId = setTimeout(() => {
      isInitialized = true;
      fetchOnMount();
    }, 0);
    return () => {
      isMounted = false;
      for (const cleanup of cleanups) cleanup();
      clearTimeout(timeoutId);
    };
  });
  return value;
};
const defaultStatements = {
  organization: ["update", "delete"],
  member: [
    "create",
    "update",
    "delete"
  ],
  invitation: ["create", "cancel"],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
};
const defaultAc = createAccessControl(defaultStatements);
const adminAc = defaultAc.newRole({
  organization: ["update"],
  invitation: ["create", "cancel"],
  member: [
    "create",
    "update",
    "delete"
  ],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
});
const ownerAc = defaultAc.newRole({
  organization: ["update", "delete"],
  member: [
    "create",
    "update",
    "delete"
  ],
  invitation: ["create", "cancel"],
  team: [
    "create",
    "update",
    "delete"
  ],
  ac: [
    "create",
    "read",
    "update",
    "delete"
  ]
});
const memberAc = defaultAc.newRole({
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: ["read"]
});
const defaultRoles = {
  admin: adminAc,
  owner: ownerAc,
  member: memberAc
};
const hasPermissionFn = (input, acRoles) => {
  if (!input.permissions) return false;
  const roles = input.role.split(",");
  const creatorRole = input.options.creatorRole || "owner";
  const isCreator = roles.includes(creatorRole);
  const allowCreatorsAllPermissions = input.allowCreatorAllPermissions || false;
  if (isCreator && allowCreatorsAllPermissions) return true;
  for (const role2 of roles) if (acRoles[role2]?.authorize(input.permissions)?.success) return true;
  return false;
};
const clientSideHasPermission = (input) => {
  return hasPermissionFn(input, input.options.roles || defaultRoles);
};
const organizationClient = (options) => {
  const $listOrg = atom(false);
  const $activeOrgSignal = atom(false);
  const $activeMemberSignal = atom(false);
  const $activeMemberRoleSignal = atom(false);
  const roles = {
    admin: adminAc,
    member: memberAc,
    owner: ownerAc,
    ...options?.roles
  };
  return {
    id: "organization",
    version: PACKAGE_VERSION,
    $InferServerPlugin: {},
    getActions: ($fetch, _$store, co) => ({
      $Infer: {
        ActiveOrganization: {},
        Organization: {},
        Invitation: {},
        Member: {},
        Team: {}
      },
      organization: { checkRolePermission: (data) => {
        return clientSideHasPermission({
          role: data.role,
          options: {
            ac: options?.ac,
            roles
          },
          permissions: data.permissions
        });
      } }
    }),
    getAtoms: ($fetch) => {
      const listOrganizations = useAuthQuery($listOrg, "/organization/list", $fetch, { method: "GET" });
      const activeOrganization = useAuthQuery([$activeOrgSignal], "/organization/get-full-organization", $fetch, () => ({ method: "GET" }));
      const activeMember = useAuthQuery([$activeOrgSignal, $activeMemberSignal], "/organization/get-active-member", $fetch, { method: "GET" });
      const activeMemberRole = useAuthQuery([$activeOrgSignal, $activeMemberRoleSignal], "/organization/get-active-member-role", $fetch, { method: "GET" });
      return {
        $listOrg,
        $activeOrgSignal,
        $activeMemberSignal,
        $activeMemberRoleSignal,
        activeOrganization,
        listOrganizations,
        activeMember,
        activeMemberRole
      };
    },
    pathMethods: {
      "/organization/get-full-organization": "GET",
      "/organization/list-user-teams": "GET"
    },
    atomListeners: [
      {
        matcher(path) {
          return path === "/organization/create" || path === "/organization/delete" || path === "/organization/update";
        },
        signal: "$listOrg"
      },
      {
        matcher(path) {
          return path === "/sign-out" || path.startsWith("/organization");
        },
        signal: "$activeOrgSignal"
      },
      {
        matcher(path) {
          return path.startsWith("/organization/set-active") || path === "/organization/create" || path === "/organization/delete" || path === "/organization/remove-member" || path === "/organization/leave" || path === "/organization/accept-invitation";
        },
        signal: "$sessionSignal"
      },
      {
        matcher(path) {
          return path.includes("/organization/update-member-role") || path.startsWith("/organization/set-active");
        },
        signal: "$activeMemberSignal"
      },
      {
        matcher(path) {
          return path.includes("/organization/update-member-role") || path.startsWith("/organization/set-active");
        },
        signal: "$activeMemberRoleSignal"
      }
    ],
    $ERROR_CODES: ORGANIZATION_ERROR_CODES
  };
};
function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return "http://192.168.111.27:3031";
  }
  return process.env.AUTH_BASE_URL ?? process.env.VITE_AUTH_BASE_URL ?? "http://auth:3000";
}
const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  fetchOptions: {
    credentials: "include"
  },
  plugins: [
    organizationClient()
  ]
});
function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (typeof process !== "undefined") {
    return process.env.VITE_BASE_URL || process.env.BASE_URL || "http://localhost:3000";
  }
  return "http://localhost:3000";
}
function BtstPagesLayout() {
  const navigate = useNavigate();
  const queryClient = getOrCreateQueryClient();
  const baseURL = getBaseURL();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(StackProvider, { basePath: "/pages", overrides: {
    "blog": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props }),
      uploadImage: async () => {
        throw new Error("TODO: implement blog.uploadImage override in src/routes/pages/route.tsx");
      }
    },
    "cms": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    },
    "form-builder": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    },
    "ui-builder": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    },
    "kanban": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props }),
      uploadImage: async () => {
        throw new Error("TODO: implement kanban.uploadImage override in src/routes/pages/route.tsx");
      },
      resolveUser: async () => null,
      searchUsers: async () => []
    },
    "comments": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data"
    },
    "media": {
      apiBaseURL: baseURL,
      apiBasePath: "/api/data",
      queryClient,
      navigate: (path) => navigate({
        to: path
      }),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props })
    },
    auth: {
      authClient,
      navigate: (path) => navigate({
        to: path
      }),
      replace: (path) => navigate({
        to: path,
        replace: true
      }),
      onSessionChange: () => window.location.reload(),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props }),
      basePath: "/pages/auth",
      redirectTo: "/pages/account/settings"
    },
    account: {
      authClient,
      navigate: (path) => navigate({
        to: path
      }),
      replace: (path) => navigate({
        to: path,
        replace: true
      }),
      onSessionChange: () => window.location.reload(),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props }),
      basePath: "/pages/account",
      account: {
        fields: ["image", "name"]
      }
    },
    organization: {
      authClient,
      navigate: (path) => navigate({
        to: path
      }),
      replace: (path) => navigate({
        to: path,
        replace: true
      }),
      onSessionChange: () => window.location.reload(),
      Link: ({
        href,
        to,
        ...props
      }) => /* @__PURE__ */ jsx(Link, { to: href || to || "#", ...props }),
      basePath: "/pages/org",
      organization: {
        basePath: "/pages/org"
      }
    }
  }, children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
export {
  BtstPagesLayout as component
};
