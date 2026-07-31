import { cache, createContext, lazy, Suspense, useContext } from "react";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { c as createRouter$1, a as createEndpoint, b as createClient } from "../_libs/better-call.mjs";
import { m } from "../_libs/react-error-boundary.mjs";
import { P as Pool } from "../_libs/pg.mjs";
import { s as slug } from "../_libs/slug.mjs";
import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, O as Outlet, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound } from "../_libs/tanstack__router-core.mjs";
import { s as setupRouterSsrQueryIntegration } from "../_libs/@tanstack/react-router-ssr-query+[...].mjs";
import { c as createRouter$2, a as createRoute } from "../_libs/btst__yar.mjs";
import { O, h } from "../_libs/lukemorales__query-key-factory.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { c as createDrizzleAdapter } from "../_libs/btst__adapter-drizzle.mjs";
import { d as defineDb, c as createDbPlugin } from "../_libs/btst__db.mjs";
import { r as pgTable, t as timestamp, u as text, v as boolean$1, w as integer, x as drizzle, y as relations } from "../_libs/drizzle-orm.mjs";
import { h as CircleAlert, aO as RefreshCw, L as LoaderCircle, aP as CloudAlert } from "../_libs/lucide-react.mjs";
import { o as object, _ as _enum, s as string, g as date, h as array, i as union, b as boolean, d as number, n as number$1, l as literal, j as httpUrl, k as fromJSONSchema, t as toJSONSchema, m as ZodIssueCode, Z as ZodObject, q as ZodType, a as ZodOptional, v as ZodNullable, w as ZodDefault, x as ZodArray, y as ZodEnum, z as ZodLiteral, A as ZodUnion, B as ZodString, C as ZodNumber, D as ZodBoolean } from "../_libs/zod.mjs";
import "../_libs/better-fetch__fetch.mjs";
import "../_libs/rou3.mjs";
import "../_libs/better-auth__utils.mjs";
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
import "react-dom";
import "react-dom/server";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/@tanstack/router-ssr-query-core+[...].mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/better-auth__core.mjs";
import "../_libs/@opentelemetry/semantic-conventions+[...].mjs";
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support the default provider's concrete timer ID, which is
  // infeasible across environments.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  setTimeout(callback, delay) {
    return this.#provider.setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return this.#provider.setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
  return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i = 0; i < b.length; i++) {
        if (!partialMatchKey(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    const bKeys = Object.keys(b);
    for (const key of bKeys) {
      if (!partialMatchKey(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array2 = isPlainArray(a) && isPlainArray(b);
  if (!array2 && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array2 ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array2 ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array2 ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array2 ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array2 ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
  if (!b || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
  if (typeof throwOnError === "function") {
    return throwOnError(...params);
  }
  return !!throwOnError;
}
function addConsumeAwareSignal(object2, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object2, "signal", {
    enumerable: true,
    get: () => {
      signal ??= getSignal();
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object2;
}
var environmentManager = /* @__PURE__ */ (() => {
  let isServerFn = () => isServer;
  return {
    /**
     * Returns whether the current runtime should be treated as a server environment.
     */
    isServer() {
      return isServerFn();
    },
    /**
     * Overrides the server check globally.
     */
    setIsServer(isServerValue) {
      isServerFn = isServerValue;
    }
  };
})();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (environmentManager.isServer() ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object2) => {
          addConsumeAwareSignal(
            object2,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject(context.signal.reason);
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
function hasNextPage(options, data) {
  if (!data) return false;
  return getNextPageParam(options, data) != null;
}
function hasPreviousPage(options, data) {
  if (!data || !options.getPreviousPageParam) return false;
  return getPreviousPageParam(options, data) != null;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get queryType() {
    return this.#queryType;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    if (options?._type) {
      this.#queryType = options._type;
    }
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state) {
    this.#dispatch({ type: "setState", state });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  get resetState() {
    return this.#initialState;
  }
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveQueryBoolean(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  #isInitialPausedFetch() {
    return this.state.fetchStatus === "paused" && this.state.status === "pending";
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object2) => {
      Object.defineProperty(object2, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    const behavior = this.#queryType === "infinite" ? infiniteQueryBehavior(
      this.options.pages
    ) : this.options.behavior;
    behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state,
            ...successState(action.data, action.dataUpdatedAt),
            dataUpdateCount: state.dataUpdateCount + 1,
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error",
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
            isInvalidated: true
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x) => x !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        if (this.#mutationCache.config.onMutate) {
          await this.#mutationCache.config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      this.#dispatch({ type: "error", error });
      throw error;
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m2) => m2.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m2) => m2 !== mutation && m2.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options._type = "infinite";
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options._type = "infinite";
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: isServer ? 60 * 1e3 : 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false
      },
      dehydrate: {
        shouldDehydrateQuery: () => true
      }
    }
  });
}
let browserQueryClient;
const getServerQueryClient = cache(() => makeQueryClient());
function getOrCreateQueryClient() {
  if (isServer) return getServerQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
const globalsCss = "/assets/globals-C3vVGxOQ.css";
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }
    ],
    links: [{ rel: "stylesheet", href: globalsCss }]
  }),
  component: RootComponent
});
function RootComponent() {
  getOrCreateQueryClient();
  return /* @__PURE__ */ jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$4 = () => import("./index-BfsVN3JM.mjs");
const Route$b = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./route-Bqyf60WR.mjs");
const Route$a = createFileRoute("/pages")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function sitemapEntryToXmlString(entries) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + entries.map((entry) => {
    const url = `<loc>${entry.url}</loc>`;
    const lastModified = entry.lastModified ? `<lastmod>${entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified}</lastmod>` : "";
    const changeFrequency = entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : "";
    const priority = entry.priority !== void 0 ? `<priority>${entry.priority}</priority>` : "";
    return `<url>${url}${lastModified}${changeFrequency}${priority}</url>`;
  }).join("") + `</urlset>`;
  return xml;
}
function normalizePath(path) {
  if (!path) {
    return "/";
  }
  if (Array.isArray(path)) {
    const segments2 = path.filter(Boolean);
    return segments2.length > 0 ? `/${segments2.join("/")}` : "/";
  }
  const segments = path.split("/").filter(Boolean);
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}
function createStackClient(config) {
  const { plugins, basePath } = config;
  const allRoutes = {};
  const clientStackContext = {
    plugins,
    basePath
  };
  for (const [pluginKey, plugin] of Object.entries(plugins)) {
    const pluginRoutes = plugin.routes(clientStackContext);
    Object.assign(allRoutes, pluginRoutes);
  }
  const router2 = createRouter$2(allRoutes);
  return {
    router: router2,
    async generateSitemap() {
      const sitemapEntries = [];
      for (const plugin of Object.values(plugins)) {
        if (typeof plugin.sitemap === "function") {
          const entries = await plugin.sitemap();
          if (Array.isArray(entries)) sitemapEntries.push(...entries);
        }
      }
      const seen = /* @__PURE__ */ new Set();
      const deduped = [];
      for (const entry of sitemapEntries) {
        if (!entry?.url || seen.has(entry.url)) continue;
        seen.add(entry.url);
        deduped.push(entry);
      }
      return deduped;
    }
  };
}
async function runHookWithShim(hookFn, createError, defaultMessage, errorStatus = 403) {
  let result;
  try {
    result = await hookFn();
  } catch (e) {
    throw createError(errorStatus, {
      message: e instanceof Error ? e.message : defaultMessage
    });
  }
  if (typeof result === "boolean") {
    if (!result) {
      throw createError(errorStatus, { message: defaultMessage });
    }
  }
  return result;
}
async function runClientHookWithShim(hookFn, defaultMessage) {
  let result;
  try {
    result = await hookFn();
  } catch (e) {
    throw e instanceof Error ? e : new Error(defaultMessage);
  }
  if (typeof result === "boolean") {
    if (!result) {
      throw new Error(defaultMessage);
    }
  }
  return result;
}
function isConnectionError(err) {
  if (!(err instanceof Error)) return false;
  const code = err.cause?.code ?? err.code;
  return err.message.includes("ECONNREFUSED") || err.message.includes("fetch failed") || err.message.includes("ERR_CONNECTION_REFUSED") || code === "ECONNREFUSED" || code === "ERR_CONNECTION_REFUSED";
}
const SSR_LOADER_ERROR_MESSAGE = "Failed to load data.";
function createSanitizedSSRLoaderError() {
  return new Error(SSR_LOADER_ERROR_MESSAGE);
}
function createApiClient(options) {
  const { baseURL = "", basePath = "/" } = options ?? {};
  const normalizedBaseURL = baseURL ? baseURL.replace(/\/$/, "") : "";
  const normalizedBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const finalBasePath = normalizedBasePath.replace(/\/$/, "");
  const apiPath = normalizedBaseURL + finalBasePath;
  return createClient({
    baseURL: apiPath
  });
}
function defineClientPlugin(plugin) {
  return plugin;
}
function postsListDiscriminator(params) {
  return {
    query: params.query !== void 0 && params.query.trim() === "" ? void 0 : params.query,
    limit: params.limit ?? 10,
    published: params.published,
    tagSlug: params.tagSlug
  };
}
const BLOG_QUERY_KEYS = {
  postsList: (params) => ["posts", "list", postsListDiscriminator(params)],
  postDetail: (slug2) => ["posts", "detail", slug2],
  tagsList: () => ["tags", "list", "tags"]
};
function isErrorResponse$5(response) {
  return typeof response === "object" && response !== null && "error" in response && response.error !== null && response.error !== void 0;
}
function toError$5(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || (typeof errorObj.error === "string" ? errorObj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function createBlogQueryKeys(client, headers) {
  const posts = createPostsQueries(client, headers);
  const drafts = createDraftsQueries(client, headers);
  const tags = createTagsQueries(client, headers);
  return O(posts, drafts, tags);
}
function createPostsQueries(client, headers) {
  return h("posts", {
    list: (params) => ({
      queryKey: [
        postsListDiscriminator({
          published: params?.published ?? true,
          limit: params?.limit ?? 10,
          tagSlug: params?.tagSlug,
          query: params?.query
        })
      ],
      queryFn: async ({ pageParam }) => {
        try {
          const response = await client("/posts", {
            method: "GET",
            query: {
              query: params?.query,
              offset: pageParam ?? 0,
              limit: params?.limit ?? 10,
              published: params?.published !== void 0 ? params.published ? "true" : "false" : void 0,
              tagSlug: params?.tagSlug
            },
            headers
          });
          if (isErrorResponse$5(response)) {
            const errorResponse = response;
            throw toError$5(errorResponse.error);
          }
          const dataResponse = response;
          return dataResponse.data?.items ?? [];
        } catch (error) {
          throw error;
        }
      }
    }),
    // Simplified detail query
    detail: (slug2) => ({
      queryKey: [slug2],
      queryFn: async () => {
        if (!slug2) return null;
        try {
          const response = await client("/posts", {
            method: "GET",
            query: { slug: slug2, limit: 1 },
            headers
          });
          if (isErrorResponse$5(response)) {
            const errorResponse = response;
            throw toError$5(errorResponse.error);
          }
          const dataResponse = response;
          return dataResponse.data?.items?.[0] ?? null;
        } catch (error) {
          throw error;
        }
      }
    }),
    // Next/previous posts query
    nextPrevious: (date2) => ({
      queryKey: ["nextPrevious", date2],
      queryFn: async () => {
        const dateValue = typeof date2 === "string" ? new Date(date2) : date2;
        const response = await client("/posts/next-previous", {
          method: "GET",
          query: {
            date: dateValue.toISOString()
          },
          headers
        });
        if (isErrorResponse$5(response)) {
          const errorResponse = response;
          throw toError$5(errorResponse.error);
        }
        const dataResponse = response;
        return dataResponse.data;
      }
    }),
    // Recent posts query (separate from main list to avoid cache conflicts)
    recent: (params) => ({
      queryKey: ["recent", params],
      queryFn: async () => {
        try {
          const response = await client("/posts", {
            method: "GET",
            query: {
              limit: params?.limit ?? 5,
              published: "true"
            },
            headers
          });
          if (isErrorResponse$5(response)) {
            const errorResponse = response;
            throw toError$5(errorResponse.error);
          }
          const recentResponse = response;
          let posts = recentResponse.data?.items ?? [];
          if (params?.excludeSlug) {
            posts = posts.filter((post2) => post2.slug !== params.excludeSlug);
          }
          return posts;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
function createDraftsQueries(client, headers) {
  return h("drafts", {
    list: (params) => ({
      queryKey: [
        {
          ...params?.limit && { limit: params.limit }
        }
      ],
      queryFn: async ({ pageParam }) => {
        try {
          const response = await client("/posts", {
            method: "GET",
            query: {
              query: params?.query,
              offset: pageParam ?? 0,
              limit: params?.limit ?? 10,
              published: "false"
            },
            headers
          });
          if (isErrorResponse$5(response)) {
            const errorResponse = response;
            throw toError$5(errorResponse.error);
          }
          const draftsResponse = response;
          return draftsResponse.data?.items ?? [];
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
function createTagsQueries(client, headers) {
  return h("tags", {
    list: () => ({
      queryKey: ["tags"],
      queryFn: async () => {
        try {
          const response = await client("/tags", {
            method: "GET",
            headers
          });
          if (isErrorResponse$5(response)) {
            const errorResponse = response;
            throw toError$5(errorResponse.error);
          }
          return response.data ?? [];
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
const StackContext = createContext(null);
function StackProvider({
  children,
  overrides,
  basePath
}) {
  const value = {
    overrides,
    basePath
  };
  return /* @__PURE__ */ jsx(StackContext.Provider, { value, children });
}
function useStack() {
  const context = useContext(
    StackContext
  );
  if (!context) {
    throw new Error(
      "useStack must be used within StackProvider. Wrap your app with <StackProvider> in your layout file."
    );
  }
  return context;
}
function usePluginOverrides(pluginName, defaultValues) {
  const context = useStack();
  const pluginOverrides = context.overrides[pluginName];
  const overrides = defaultValues ? { ...defaultValues, ...pluginOverrides } : pluginOverrides;
  return overrides;
}
function useBasePath() {
  const context = useStack();
  if (!context) {
    throw new Error(
      "useBasePath must be used within StackProvider. Wrap your app with <StackProvider> in your layout file."
    );
  }
  return context.basePath;
}
function ErrorBoundary({
  children,
  FallbackComponent,
  resetKeys,
  onError
}) {
  return /* @__PURE__ */ jsx(
    m,
    {
      FallbackComponent,
      onError,
      resetKeys,
      children
    }
  );
}
function ComposedRoute({
  path,
  PageComponent,
  ErrorComponent,
  LoadingComponent,
  onNotFound,
  NotFoundComponent,
  props,
  onError
}) {
  if (PageComponent) {
    const content = /* @__PURE__ */ jsx(PageComponent, { ...props });
    const suspenseFallback = LoadingComponent ? /* @__PURE__ */ jsx(LoadingComponent, {}) : null;
    if (ErrorComponent) {
      return /* @__PURE__ */ jsx(Suspense, { fallback: suspenseFallback, children: /* @__PURE__ */ jsx(
        ErrorBoundary,
        {
          FallbackComponent: ErrorComponent,
          resetKeys: [path],
          onError,
          children: /* @__PURE__ */ jsx(Suspense, { fallback: suspenseFallback, children: content }, `inner-${path}`)
        }
      ) }, `outer-${path}`);
    }
    return /* @__PURE__ */ jsx(Suspense, { fallback: suspenseFallback, children: content }, path);
  } else {
    if (onNotFound) {
      onNotFound();
    }
    if (NotFoundComponent) {
      return /* @__PURE__ */ jsx(NotFoundComponent, { message: `Unknown route: ${path}` });
    }
  }
}
function PageHeader({
  title,
  description,
  childrenTop,
  childrenBottom
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex max-w-2xl flex-col items-center lg:gap-4 gap-2 text-center wrap-anywhere",
      "data-testid": "page-header",
      children: [
        childrenTop,
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "font-medium font-sans lg:text-6xl text-4xl tracking-tight",
            "data-testid": "page-title",
            children: title
          }
        ),
        description && /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-muted-foreground wrap-anywhere",
            "data-testid": "page-description",
            children: description
          }
        ),
        childrenBottom
      ]
    }
  );
}
function ErrorPlaceholder({
  title,
  message
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex min-h-[600px] flex-col items-center justify-center gap-10",
      "data-testid": "error-placeholder",
      children: [
        /* @__PURE__ */ jsx(PageHeader, { title, description: message }),
        /* @__PURE__ */ jsx(CloudAlert, { className: "size-[100px]" })
      ]
    }
  );
}
const BLOG_CARD = {
  BLOG_CARD_DRAFT_BADGE: "Draft"
};
const BLOG_COMMON = {
  BLOG_GENERIC_ERROR_TITLE: "Something went wrong",
  BLOG_GENERIC_ERROR_MESSAGE: "An unexpected error occurred.",
  BLOG_PAGE_NOT_FOUND_TITLE: "Not Found",
  BLOG_PAGE_NOT_FOUND_DESCRIPTION: "The page you are looking for does not exist.",
  BLOG_TAGS_SHOW_ALL: "Show all tags",
  BLOG_TAGS_SHOW_LESS: "Show fewer tags"
};
const BLOG_LIST = {
  BLOG_LIST_TITLE: "Blog Posts",
  BLOG_LIST_DRAFTS_TITLE: "Draft Posts",
  BLOG_LIST_EMPTY: "There are no posts here yet.",
  BLOG_LIST_LOAD_MORE: "Load more posts",
  BLOG_LIST_LOADING_MORE: "Loading more...",
  BLOG_LIST_SEARCH_PLACEHOLDER: "Search Blog Posts...",
  BLOG_LIST_SEARCH_BUTTON: "Search Posts",
  BLOG_LIST_SEARCH_EMPTY: "No blog posts found.",
  BLOG_TAG_PAGE_TITLE: "{tag} Posts",
  BLOG_TAG_PAGE_DESCRIPTION: "Browse all posts with this tag",
  BLOG_TAG_NOT_FOUND: "Tag not found",
  BLOG_TAG_NOT_FOUND_DESCRIPTION: "The tag you are looking for does not exist."
};
const BLOG_POST = {
  BLOG_POST_ADD_TITLE: "Add New Post",
  BLOG_POST_ADD_DESCRIPTION: "Create a new blog post.",
  BLOG_POST_EDIT_TITLE: "Edit Post",
  BLOG_POST_EDIT_DESCRIPTION: "Update your blog post.",
  BLOG_POST_ON_THIS_PAGE: "In This Post",
  BLOG_POST_KEEP_READING: "Keep Reading",
  BLOG_POST_VIEW_ALL: "View all"
};
const BLOG_FORMS = {
  BLOG_FORMS_TITLE_LABEL: "Title",
  BLOG_FORMS_REQUIRED_ASTERISK: " *",
  BLOG_FORMS_TITLE_PLACEHOLDER: "Enter your post title...",
  BLOG_FORMS_SLUG_LABEL: "Slug",
  BLOG_FORMS_SLUG_PLACEHOLDER: "url-friendly-slug",
  BLOG_FORMS_EXCERPT_LABEL: "Excerpt",
  BLOG_FORMS_EXCERPT_PLACEHOLDER: "Brief summary of your post...",
  BLOG_FORMS_TAGS_LABEL: "Tags",
  BLOG_FORMS_TAGS_PLACEHOLDER: "Enter your post tags...",
  BLOG_FORMS_CONTENT_LABEL: "Content",
  BLOG_FORMS_PUBLISHED_LABEL: "Published",
  BLOG_FORMS_PUBLISHED_DESCRIPTION: "Toggle to publish immediately",
  BLOG_FORMS_SUBMIT_CREATE_IDLE: "Create Post",
  BLOG_FORMS_SUBMIT_CREATE_PENDING: "Creating...",
  BLOG_FORMS_SUBMIT_UPDATE_IDLE: "Update Post",
  BLOG_FORMS_SUBMIT_UPDATE_PENDING: "Updating...",
  BLOG_FORMS_CANCEL_BUTTON: "Cancel",
  BLOG_FORMS_TOAST_CREATE_SUCCESS: "Post created successfully",
  BLOG_FORMS_TOAST_UPDATE_SUCCESS: "Post updated successfully",
  BLOG_FORMS_TOAST_DELETE_SUCCESS: "Post deleted successfully",
  BLOG_FORMS_LOADING_POST: "Loading post...",
  // Delete post
  BLOG_FORMS_DELETE_BUTTON: "Delete Post",
  BLOG_FORMS_DELETE_DIALOG_TITLE: "Delete Post",
  BLOG_FORMS_DELETE_DIALOG_DESCRIPTION: "Are you sure you want to delete this post? This action cannot be undone.",
  BLOG_FORMS_DELETE_DIALOG_CANCEL: "Cancel",
  BLOG_FORMS_DELETE_DIALOG_CONFIRM: "Delete",
  BLOG_FORMS_DELETE_PENDING: "Deleting...",
  // Markdown editor
  BLOG_FORMS_EDITOR_PLACEHOLDER: "Write something...",
  // Featured image field
  BLOG_FORMS_FEATURED_IMAGE_LABEL: "Image",
  BLOG_FORMS_FEATURED_IMAGE_REQUIRED_ASTERISK: " *",
  BLOG_FORMS_FEATURED_IMAGE_INPUT_PLACEHOLDER: "Image URL or upload below...",
  BLOG_FORMS_FEATURED_IMAGE_UPLOAD_BUTTON: "Upload",
  BLOG_FORMS_FEATURED_IMAGE_UPLOADING_BUTTON: "Uploading...",
  BLOG_FORMS_FEATURED_IMAGE_UPLOADING_TEXT: "Uploading image...",
  BLOG_FORMS_FEATURED_IMAGE_PREVIEW_ALT: "Featured image preview",
  BLOG_FORMS_FEATURED_IMAGE_ERROR_NOT_IMAGE: "Please select an image file",
  BLOG_FORMS_FEATURED_IMAGE_ERROR_TOO_LARGE: "Image size must be less than 4MB",
  BLOG_FORMS_FEATURED_IMAGE_TOAST_SUCCESS: "Image uploaded successfully",
  BLOG_FORMS_FEATURED_IMAGE_TOAST_FAILURE: "Failed to upload image"
};
const BLOG_LOCALIZATION = {
  ...BLOG_COMMON,
  ...BLOG_LIST,
  ...BLOG_CARD,
  ...BLOG_POST,
  ...BLOG_FORMS
};
function DefaultError$1({ error }) {
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const title = localization.BLOG_GENERIC_ERROR_TITLE;
  const message = localization.BLOG_GENERIC_ERROR_MESSAGE;
  return /* @__PURE__ */ jsx(ErrorPlaceholder, { title, message });
}
function cn$1(...inputs) {
  return twMerge(clsx(inputs));
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn$1("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function PageHeaderSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "flex max-w-[600px] flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-56" }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-80" })
  ] });
}
function PageLayout({
  children,
  className,
  "data-testid": dataTestId
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn$1(
        "container mx-auto flex min-h-dvh flex-col items-center gap-12 px-4 py-18 lg:px-16",
        className
      ),
      "data-testid": dataTestId,
      children
    }
  );
}
function FormPageSkeleton() {
  return /* @__PURE__ */ jsxs(PageLayout, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(PageHeaderSkeleton, {}) }),
    /* @__PURE__ */ jsx(FormSkeleton, {})
  ] });
}
function FormSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-md" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-28" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-md" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full rounded-md" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-28" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-md" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-md" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-5 rounded-sm" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-44" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-5 rounded-sm" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-36" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-36" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-32 w-full rounded-md" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-24 rounded-md" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-28 rounded-md" })
    ] })
  ] });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn$1(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn$1(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn$1("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn$1("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn$1("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn$1("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
function PostCardSkeleton() {
  return /* @__PURE__ */ jsxs(Card, { className: "h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "relative h-48 w-full", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-full w-full rounded-t-xl" }) }),
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "mb-2 h-4 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "mb-2 h-6 w-full" })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }) }),
    /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-16" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20" })
    ] }) })
  ] });
}
function ListPageSkeleton() {
  return /* @__PURE__ */ jsxs(PageLayout, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(PageHeaderSkeleton, {}) }),
    /* @__PURE__ */ jsx(PostsListSkeleton, { count: 6 })
  ] });
}
function PostsListSkeleton({ count = 6 }) {
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center pb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-md items-center gap-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 grow rounded-md" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-24 rounded-md" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsx(PostCardSkeleton, {}, index)) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-40 rounded-md" }) })
  ] });
}
function PostPageSkeleton() {
  return /* @__PURE__ */ jsxs(PageLayout, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-3", children: /* @__PURE__ */ jsx(PageHeaderSkeleton, {}) }),
    /* @__PURE__ */ jsx(PostSkeleton, {})
  ] });
}
function PostSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-3/4" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20 rounded-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-16 rounded-full" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-full rounded-md" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
      /* @__PURE__ */ jsx(ContentBlockSkeleton, {}),
      /* @__PURE__ */ jsx(ImageBlockSkeleton, {}),
      /* @__PURE__ */ jsx(CodeBlockSkeleton, {}),
      /* @__PURE__ */ jsx(ContentBlockSkeleton, {})
    ] })
  ] });
}
function ContentBlockSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-11/12" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-10/12" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-9/12" })
    ] })
  ] });
}
function ImageBlockSkeleton() {
  return /* @__PURE__ */ jsx(Skeleton, { className: "h-72 w-full rounded-md" });
}
function CodeBlockSkeleton() {
  return /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-full rounded-md" });
}
function FormLoading() {
  return /* @__PURE__ */ jsx("div", { "data-testid": "form-skeleton", children: /* @__PURE__ */ jsx(FormPageSkeleton, {}) });
}
function PostsLoading() {
  return /* @__PURE__ */ jsx("div", { "data-testid": "posts-skeleton", children: /* @__PURE__ */ jsx(ListPageSkeleton, {}) });
}
function PostLoading() {
  return /* @__PURE__ */ jsx("div", { "data-testid": "post-skeleton", children: /* @__PURE__ */ jsx(PostPageSkeleton, {}) });
}
function StackAttribution() {
  return /* @__PURE__ */ jsx("div", { className: "w-full text-center", children: /* @__PURE__ */ jsxs("p", { className: "flex items-center justify-center gap-1 py-2 text-gray-500 text-sm", children: [
    "Powered by",
    " ",
    /* @__PURE__ */ jsx(
      "a",
      {
        className: "flex items-center gap-1 font-semibold underline",
        href: "https://www.better-stack.ai",
        target: "_blank",
        rel: "noopener",
        "aria-label": "BTST — Composable full-stack plugin system for React frameworks",
        title: "BTST — Composable full-stack plugin system for React frameworks",
        children: /* @__PURE__ */ jsx("span", { className: "cursor-pointer", children: "BTST" })
      }
    )
  ] }) });
}
function PageWrapper$1({
  children,
  className,
  testId,
  showAttribution = true
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageLayout, { className, "data-testid": testId, children }),
    showAttribution && /* @__PURE__ */ jsx(StackAttribution, {})
  ] });
}
function PageWrapper({
  children,
  className,
  testId
}) {
  const { showAttribution } = usePluginOverrides("blog", {
    showAttribution: true
  });
  return /* @__PURE__ */ jsx(
    PageWrapper$1,
    {
      className,
      testId,
      showAttribution,
      children
    }
  );
}
function NotFoundPage$1({ message }) {
  const { localization } = usePluginOverrides("blog", {
    localization: BLOG_LOCALIZATION
  });
  const title = localization.BLOG_PAGE_NOT_FOUND_TITLE;
  const desc = message || localization.BLOG_PAGE_NOT_FOUND_DESCRIPTION;
  return /* @__PURE__ */ jsx(PageWrapper, { testId: "404-page", children: /* @__PURE__ */ jsx(ErrorPlaceholder, { title, message: desc }) });
}
const HomePage = lazy(
  () => import("./home-page.internal-BthAh8x1.mjs").then((m2) => ({ default: m2.HomePage }))
);
function HomePageComponent({
  published = true
}) {
  const { onRouteError } = usePluginOverrides("blog");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: published ? "/blog" : "/blog/drafts",
      PageComponent: HomePage,
      ErrorComponent: DefaultError$1,
      LoadingComponent: PostsLoading,
      NotFoundComponent: NotFoundPage$1,
      props: { published },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("posts", error, {
            path: published ? "/blog" : "/blog/drafts",
            isSSR: typeof window === "undefined",
            published
          });
        }
      }
    }
  );
}
const NewPostPage = lazy(
  () => import("./new-post-page.internal-hfBcIxvq.mjs").then((m2) => ({ default: m2.NewPostPage }))
);
function NewPostPageComponent() {
  const { onRouteError } = usePluginOverrides("blog");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/blog/new",
      PageComponent: NewPostPage,
      ErrorComponent: DefaultError$1,
      LoadingComponent: FormLoading,
      NotFoundComponent: NotFoundPage$1,
      onError: (error) => {
        if (onRouteError) {
          onRouteError("newPost", error, {
            path: `/blog/new`,
            isSSR: typeof window === "undefined"
          });
        }
      }
    }
  );
}
const EditPostPage = lazy(
  () => import("./edit-post-page.internal-NKdG5Bn5.mjs").then((m2) => ({
    default: m2.EditPostPage
  }))
);
function EditPostPageComponent({ slug: slug2 }) {
  const { onRouteError } = usePluginOverrides("blog");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/blog/${slug2}/edit`,
      PageComponent: EditPostPage,
      ErrorComponent: DefaultError$1,
      LoadingComponent: FormLoading,
      NotFoundComponent: NotFoundPage$1,
      props: { slug: slug2 },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("editPost", error, {
            path: `/blog/${slug2}/edit`,
            isSSR: typeof window === "undefined",
            slug: slug2
          });
        }
      }
    }
  );
}
const TagPage = lazy(
  () => import("./tag-page.internal-BX4hBb_B.mjs").then((m2) => ({ default: m2.TagPage }))
);
function TagPageComponent({ tagSlug }) {
  const { onRouteError } = usePluginOverrides("blog");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/blog/tag/${tagSlug}`,
      PageComponent: TagPage,
      ErrorComponent: DefaultError$1,
      LoadingComponent: PostsLoading,
      NotFoundComponent: NotFoundPage$1,
      props: { tagSlug },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("tag", error, {
            path: `/blog/tag/${tagSlug}`,
            isSSR: typeof window === "undefined",
            tagSlug
          });
        }
      }
    }
  );
}
const PostPage = lazy(
  () => import("./post-page.internal-DyIgZ4KY.mjs").then((m2) => ({ default: m2.PostPage }))
);
function PostPageComponent({ slug: slug2 }) {
  const { onRouteError } = usePluginOverrides("blog");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/blog/${slug2}`,
      PageComponent: PostPage,
      ErrorComponent: DefaultError$1,
      LoadingComponent: PostLoading,
      NotFoundComponent: NotFoundPage$1,
      props: { slug: slug2 },
      onError: (error) => {
        if (onRouteError) {
          onRouteError("post", error, {
            path: `/blog/${slug2}`,
            isSSR: typeof window === "undefined",
            slug: slug2
          });
        }
      }
    }
  );
}
function createPostsLoader(published, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: published ? "/blog" : "/blog/drafts",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const limit = 10;
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createBlogQueryKeys(client, headers);
      const listQuery = queries.posts.list({
        query: void 0,
        limit,
        published
      });
      try {
        if (hooks?.beforeLoadPosts) {
          await runClientHookWithShim(
            () => hooks.beforeLoadPosts({ published }, context),
            "Load prevented by beforeLoadPosts hook"
          );
        }
        await queryClient.prefetchInfiniteQuery({
          ...listQuery,
          initialPageParam: 0
        });
        const tagsQuery = queries.tags.list();
        await queryClient.prefetchQuery(tagsQuery);
        if (hooks?.afterLoadPosts) {
          const posts = queryClient.getQueryData(listQuery.queryKey) || null;
          await runClientHookWithShim(
            () => hooks.afterLoadPosts(posts, { published }, context),
            "Load prevented by afterLoadPosts hook"
          );
        }
        const queryState = queryClient.getQueryState(listQuery.queryKey);
        if (queryState?.error) {
          if (hooks?.onLoadError) {
            const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
            await hooks.onLoadError(error, context);
          }
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/blog] route.loader() failed — no server running at build time. Use myStack.api.blog.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchInfiniteQuery({
            queryKey: listQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            initialPageParam: 0,
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createPostLoader(slug2, config, path) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: path ?? `/blog/${slug2}`,
        params: { slug: slug2 },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadPost) {
          await runClientHookWithShim(
            () => hooks.beforeLoadPost(slug2, context),
            "Load prevented by beforeLoadPost hook"
          );
        }
        const client = createApiClient({
          baseURL: apiBaseURL,
          basePath: apiBasePath
        });
        const queries = createBlogQueryKeys(client, headers);
        const postQuery = queries.posts.detail(slug2);
        await queryClient.prefetchQuery(postQuery);
        if (hooks?.afterLoadPost) {
          const post2 = queryClient.getQueryData(postQuery.queryKey) || null;
          await runClientHookWithShim(
            () => hooks.afterLoadPost(post2, slug2, context),
            "Load prevented by afterLoadPost hook"
          );
        }
        const queryState = queryClient.getQueryState(postQuery.queryKey);
        if (queryState?.error) {
          if (hooks?.onLoadError) {
            const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
            await hooks.onLoadError(error, context);
          }
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/blog] route.loader() failed — no server running at build time. Use myStack.api.blog.prefetchForRoute() for SSG data prefetching."
          );
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createNewPostLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: "/blog/new",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadNewPost) {
          await runClientHookWithShim(
            () => hooks.beforeLoadNewPost(context),
            "Load prevented by beforeLoadNewPost hook"
          );
        }
        if (hooks?.afterLoadNewPost) {
          await runClientHookWithShim(
            () => hooks.afterLoadNewPost(context),
            "Load prevented by afterLoadNewPost hook"
          );
        }
      } catch (error) {
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createTagLoader(tagSlug, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: `/blog/tag/${tagSlug}`,
        params: { tagSlug },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        const limit = 10;
        const client = createApiClient({
          baseURL: apiBaseURL,
          basePath: apiBasePath
        });
        const queries = createBlogQueryKeys(client, headers);
        const listQuery = queries.posts.list({
          query: void 0,
          limit,
          published: true,
          tagSlug
        });
        await queryClient.prefetchInfiniteQuery({
          ...listQuery,
          initialPageParam: 0
        });
        const tagsQuery = queries.tags.list();
        await queryClient.prefetchQuery(tagsQuery);
        const listState = queryClient.getQueryState(listQuery.queryKey);
        const tagsState = queryClient.getQueryState(tagsQuery.queryKey);
        const queryError = listState?.error || tagsState?.error;
        if (queryError && hooks?.onLoadError) {
          const error = queryError instanceof Error ? queryError : new Error(String(queryError));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/blog] route.loader() failed — no server running at build time. Use myStack.api.blog.prefetchForRoute() for SSG data prefetching."
          );
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createPostsListMeta(published, config) {
  return () => {
    const { siteBaseURL, siteBasePath, seo } = config;
    const path = published ? "/blog" : "/blog/drafts";
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    const title = published ? "Blog" : "Draft Posts";
    const description = published ? "Read our latest articles, insights, and updates on web development, technology, and more." : "View and manage your draft blog posts.";
    return [
      // Primary meta tags
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      {
        name: "keywords",
        content: "blog, articles, technology, web development, insights"
      },
      ...seo?.author ? [{ name: "author", content: seo.author }] : [],
      {
        name: "robots",
        content: published ? "index, follow" : "noindex, nofollow"
      },
      // Open Graph / Facebook
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      ...seo?.siteName ? [{ property: "og:site_name", content: seo.siteName }] : [],
      ...seo?.locale ? [{ property: "og:locale", content: seo.locale }] : [],
      ...seo?.defaultImage ? [{ property: "og:image", content: seo.defaultImage }] : [],
      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...seo?.twitterHandle ? [{ name: "twitter:site", content: seo.twitterHandle }] : []
    ];
  };
}
function createPostMeta(slug2, config) {
  return () => {
    const { queryClient } = config;
    const { apiBaseURL, apiBasePath, siteBaseURL, siteBasePath, seo } = config;
    const queries = createBlogQueryKeys(
      createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      })
    );
    const post2 = queryClient.getQueryData(
      queries.posts.detail(slug2).queryKey
    );
    if (!post2) {
      return [
        { title: "Unknown route" },
        { name: "title", content: "Unknown route" },
        { name: "robots", content: "noindex" }
      ];
    }
    const fullUrl = `${siteBaseURL}${siteBasePath}/blog/${post2.slug}`;
    const title = post2.title;
    const description = post2.excerpt || post2.content.substring(0, 160);
    const publishedTime = post2.publishedAt ? new Date(post2.publishedAt).toISOString() : new Date(post2.createdAt).toISOString();
    const modifiedTime = new Date(post2.updatedAt).toISOString();
    const image = post2.image || seo?.defaultImage;
    return [
      // Primary meta tags
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      ...post2.authorId || seo?.author ? [{ name: "author", content: post2.authorId || seo?.author }] : [],
      {
        name: "robots",
        content: post2.published ? "index, follow" : "noindex, nofollow"
      },
      {
        name: "keywords",
        content: `blog, article, ${post2.slug.replace(/-/g, ", ")}`
      },
      // Open Graph / Facebook
      { property: "og:type", content: "article" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      ...seo?.siteName ? [{ property: "og:site_name", content: seo.siteName }] : [],
      ...seo?.locale ? [{ property: "og:locale", content: seo.locale }] : [],
      ...image ? [{ property: "og:image", content: image }] : [],
      ...image ? [
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: title }
      ] : [],
      // Article-specific Open Graph tags
      { property: "article:published_time", content: publishedTime },
      { property: "article:modified_time", content: modifiedTime },
      ...post2.authorId ? [{ property: "article:author", content: post2.authorId }] : [],
      // Twitter Card
      {
        name: "twitter:card",
        content: image ? "summary_large_image" : "summary"
      },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...seo?.twitterHandle ? [{ name: "twitter:site", content: seo.twitterHandle }] : [],
      ...post2.authorId || seo?.twitterHandle ? [
        {
          name: "twitter:creator",
          content: post2.authorId || seo?.twitterHandle
        }
      ] : [],
      ...image ? [{ name: "twitter:image", content: image }] : [],
      ...image ? [{ name: "twitter:image:alt", content: title }] : [],
      // Additional SEO tags
      { name: "publish_date", content: publishedTime }
    ];
  };
}
function createTagMeta(tagSlug, config) {
  return () => {
    const { queryClient } = config;
    const { apiBaseURL, apiBasePath, siteBaseURL, siteBasePath, seo } = config;
    const queries = createBlogQueryKeys(
      createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      })
    );
    const tags = queryClient.getQueryData(
      queries.tags.list().queryKey
    );
    const tag2 = tags?.find((t) => t.slug === tagSlug);
    if (!tag2) {
      return [
        { title: "Unknown route" },
        { name: "title", content: "Unknown route" },
        { name: "robots", content: "noindex" }
      ];
    }
    const fullUrl = `${siteBaseURL}${siteBasePath}/blog/tag/${tag2.slug}`;
    const title = `${tag2.name} Posts`;
    const description = `Browse all ${tag2.name} posts`;
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { name: "keywords", content: `blog, ${tag2.name}, articles` },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      ...seo?.siteName ? [{ property: "og:site_name", content: seo.siteName }] : [],
      ...seo?.defaultImage ? [{ property: "og:image", content: seo.defaultImage }] : [],
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
function createNewPostMeta(config) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}/blog/new`;
    const title = "Create New Post";
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: "Write and publish a new blog post." },
      { name: "robots", content: "noindex, nofollow" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content: "Write and publish a new blog post."
      },
      { property: "og:url", content: fullUrl },
      // Twitter
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
function createEditPostMeta(slug2, config) {
  return () => {
    const { queryClient } = config;
    const { apiBaseURL, apiBasePath, siteBaseURL, siteBasePath } = config;
    const queries = createBlogQueryKeys(
      createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      })
    );
    const post2 = queryClient.getQueryData(
      queries.posts.detail(slug2).queryKey
    );
    const fullUrl = `${siteBaseURL}${siteBasePath}/blog/${slug2}/edit`;
    const title = post2 ? `Edit: ${post2.title}` : "Unknown route";
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: "Edit your blog post." },
      { name: "robots", content: "noindex, nofollow" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:url", content: fullUrl },
      // Twitter
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
const blogClientPlugin = (config) => defineClientPlugin({
  name: "blog",
  routes: () => ({
    posts: createRoute("/blog", () => {
      const CustomPosts = config.pageComponents?.posts;
      return {
        PageComponent: CustomPosts ?? (() => /* @__PURE__ */ jsx(HomePageComponent, { published: true })),
        loader: createPostsLoader(true, config),
        meta: createPostsListMeta(true, config)
      };
    }),
    drafts: createRoute("/blog/drafts", () => {
      const CustomDrafts = config.pageComponents?.drafts;
      return {
        PageComponent: CustomDrafts ?? (() => /* @__PURE__ */ jsx(HomePageComponent, { published: false })),
        loader: createPostsLoader(false, config),
        meta: createPostsListMeta(false, config)
      };
    }),
    newPost: createRoute("/blog/new", () => {
      const CustomNewPost = config.pageComponents?.newPost;
      return {
        PageComponent: CustomNewPost ?? NewPostPageComponent,
        loader: createNewPostLoader(config),
        meta: createNewPostMeta(config)
      };
    }),
    editPost: createRoute("/blog/:slug/edit", ({ params: { slug: slug2 } }) => {
      const CustomEditPost = config.pageComponents?.editPost;
      return {
        PageComponent: CustomEditPost ? () => /* @__PURE__ */ jsx(CustomEditPost, { slug: slug2 }) : () => /* @__PURE__ */ jsx(EditPostPageComponent, { slug: slug2 }),
        loader: createPostLoader(slug2, config, `/blog/${slug2}/edit`),
        meta: createEditPostMeta(slug2, config)
      };
    }),
    tag: createRoute("/blog/tag/:tagSlug", ({ params: { tagSlug } }) => {
      const CustomTag = config.pageComponents?.tag;
      return {
        PageComponent: CustomTag ? () => /* @__PURE__ */ jsx(CustomTag, { tagSlug }) : () => /* @__PURE__ */ jsx(TagPageComponent, { tagSlug }),
        loader: createTagLoader(tagSlug, config),
        meta: createTagMeta(tagSlug, config)
      };
    }),
    post: createRoute("/blog/:slug", ({ params: { slug: slug2 } }) => {
      const CustomPost = config.pageComponents?.post;
      return {
        PageComponent: CustomPost ? () => /* @__PURE__ */ jsx(CustomPost, { slug: slug2 }) : () => /* @__PURE__ */ jsx(PostPageComponent, { slug: slug2 }),
        loader: createPostLoader(slug2, config),
        meta: createPostMeta(slug2, config)
      };
    })
  }),
  sitemap: async () => {
    const origin = `${config.siteBaseURL}${config.siteBasePath}`;
    const indexUrl = `${origin}/blog`;
    const client = createApiClient({
      baseURL: config.apiBaseURL,
      basePath: config.apiBasePath
    });
    const limit = 100;
    let offset = 0;
    const posts = [];
    while (true) {
      const res = await client("/posts", {
        method: "GET",
        query: {
          offset,
          limit,
          published: "true"
        }
      });
      const page = res.data?.items ?? [];
      posts.push(...page);
      if (page.length < limit) break;
      offset += limit;
    }
    const tagsRes = await client("/tags", {
      method: "GET"
    });
    const tags = tagsRes.data ?? [];
    const getLastModified = (p) => {
      const dates = [p.updatedAt, p.publishedAt, p.createdAt].filter(
        Boolean
      );
      if (dates.length === 0) return void 0;
      const times = dates.map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
      if (times.length === 0) return void 0;
      return new Date(Math.max(...times));
    };
    const latestTime = posts.map((p) => getLastModified(p)?.getTime() ?? 0).reduce((a, b) => Math.max(a, b), 0);
    const entries = [
      {
        url: indexUrl,
        lastModified: latestTime ? new Date(latestTime) : void 0,
        changeFrequency: "daily",
        priority: 0.7
      },
      ...posts.map((p) => ({
        url: `${origin}/blog/${p.slug}`,
        lastModified: getLastModified(p),
        changeFrequency: "monthly",
        priority: 0.6
      })),
      ...tags.map((t) => ({
        url: `${origin}/blog/tag/${t.slug}`,
        lastModified: t.updatedAt ? new Date(t.updatedAt) : void 0,
        changeFrequency: "weekly",
        priority: 0.5
      }))
    ];
    return entries;
  }
});
function contentListDiscriminator(params) {
  return {
    typeSlug: params.typeSlug,
    limit: params.limit ?? 20,
    offset: params.offset ?? 0
  };
}
const CMS_QUERY_KEYS = {
  /**
   * Key for the cmsTypes.list() query.
   * Full key: ["cmsTypes", "list", "list"]
   */
  typesList: () => ["cmsTypes", "list", "list"],
  /**
   * Key for the cmsContent.list({ typeSlug, limit, offset }) query.
   * Full key: ["cmsContent", "list", { typeSlug, limit, offset }]
   */
  contentList: (params) => ["cmsContent", "list", contentListDiscriminator(params)],
  /**
   * Key for the cmsContent.detail(typeSlug, id) query.
   * Full key: ["cmsContent", "detail", typeSlug, id]
   */
  contentDetail: (typeSlug, id) => ["cmsContent", "detail", typeSlug, id]
};
function isErrorResponse$4(response) {
  if (typeof response !== "object" || response === null) {
    return false;
  }
  const obj = response;
  return "error" in obj && obj.error !== null && obj.error !== void 0;
}
function toError$4(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || (typeof errorObj.error === "string" ? errorObj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function createCMSQueryKeys(client, headers) {
  const contentTypes = createContentTypesQueries(client, headers);
  const content = createContentQueries(client, headers);
  return O(contentTypes, content);
}
function createContentTypesQueries(client, headers) {
  return h("cmsTypes", {
    list: () => ({
      queryKey: ["list"],
      queryFn: async () => {
        try {
          const response = await client("/content-types", {
            method: "GET",
            headers
          });
          if (isErrorResponse$4(response)) {
            throw toError$4(response.error);
          }
          return response.data ?? [];
        } catch (error) {
          throw error;
        }
      }
    }),
    detail: (slug2) => ({
      queryKey: [slug2],
      queryFn: async () => {
        if (!slug2) return null;
        try {
          const response = await client("/content-types/:slug", {
            method: "GET",
            params: { slug: slug2 },
            headers
          });
          if (isErrorResponse$4(response)) {
            throw toError$4(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
function createContentQueries(client, headers) {
  return h("cmsContent", {
    list: (params) => ({
      queryKey: [contentListDiscriminator(params)],
      queryFn: async () => {
        try {
          const response = await client("/content/:typeSlug", {
            method: "GET",
            params: { typeSlug: params.typeSlug },
            query: {
              limit: params.limit ?? 20,
              offset: params.offset ?? 0
            },
            headers
          });
          if (isErrorResponse$4(response)) {
            throw toError$4(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }),
    detail: (typeSlug, id) => ({
      queryKey: [typeSlug, id],
      queryFn: async () => {
        if (!typeSlug || !id) return null;
        try {
          const response = await client("/content/:typeSlug/:id", {
            method: "GET",
            params: { typeSlug, id },
            headers
          });
          if (isErrorResponse$4(response)) {
            throw toError$4(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }),
    bySlug: (typeSlug, slug2) => ({
      queryKey: ["bySlug", typeSlug, slug2],
      queryFn: async () => {
        if (!typeSlug || !slug2) return null;
        try {
          const response = await client("/content/:typeSlug", {
            method: "GET",
            params: { typeSlug },
            query: { slug: slug2, limit: 1 },
            headers
          });
          if (isErrorResponse$4(response)) {
            throw toError$4(response.error);
          }
          const data = response.data;
          return data.items[0] ?? null;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
const DashboardPageComponent = lazy(
  () => import("./dashboard-page-FuAwmgdm.mjs").then((m2) => ({
    default: m2.DashboardPageComponent
  }))
);
const ContentListPageComponent = lazy(
  () => import("./content-list-page-k_rWiIqY.mjs").then((m2) => ({
    default: m2.ContentListPageComponent
  }))
);
const ContentEditorPageComponent = lazy(
  () => import("./content-editor-page-Dn0N_5SS.mjs").then((n) => n.c).then((m2) => ({
    default: m2.ContentEditorPageComponent
  }))
);
function createDashboardLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: "/cms",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const typesQuery = queries.cmsTypes.list();
      try {
        if (hooks?.beforeLoadDashboard) {
          await runClientHookWithShim(
            () => hooks.beforeLoadDashboard(context),
            "Load prevented by beforeLoadDashboard hook"
          );
        }
        await queryClient.prefetchQuery(typesQuery);
        if (hooks?.afterLoadDashboard) {
          await hooks.afterLoadDashboard(context);
        }
        const queryState = queryClient.getQueryState(typesQuery.queryKey);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/cms] route.loader() failed — no server running at build time. Use myStack.api.cms.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchQuery({
            queryKey: typesQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createContentListLoader(typeSlug, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: `/cms/${typeSlug}`,
        params: { typeSlug },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const limit = 20;
      const typesQuery = queries.cmsTypes.list();
      const listQuery = queries.cmsContent.list({
        typeSlug,
        limit,
        offset: 0
      });
      try {
        if (hooks?.beforeLoadContentList) {
          await runClientHookWithShim(
            () => hooks.beforeLoadContentList(typeSlug, context),
            "Load prevented by beforeLoadContentList hook"
          );
        }
        await queryClient.prefetchQuery(typesQuery);
        await queryClient.prefetchInfiniteQuery({
          queryKey: listQuery.queryKey,
          queryFn: async ({ pageParam = 0 }) => {
            const response = await client("/content/:typeSlug", {
              method: "GET",
              params: { typeSlug },
              query: { limit, offset: pageParam },
              headers
            });
            if (typeof response === "object" && response !== null && "error" in response && response.error) {
              throw new Error(String(response.error));
            }
            return response.data;
          },
          initialPageParam: 0
        });
        if (hooks?.afterLoadContentList) {
          await hooks.afterLoadContentList(typeSlug, context);
        }
        const typesState = queryClient.getQueryState(typesQuery.queryKey);
        const listState = queryClient.getQueryState(listQuery.queryKey);
        const queryError = typesState?.error || listState?.error;
        if (queryError && hooks?.onLoadError) {
          const error = queryError instanceof Error ? queryError : new Error(String(queryError));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/cms] route.loader() failed — no server running at build time. Use myStack.api.cms.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchInfiniteQuery({
            queryKey: listQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            initialPageParam: 0,
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createContentEditorLoader(typeSlug, id, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: id ? `/cms/${typeSlug}/${id}` : `/cms/${typeSlug}/new`,
        params: id ? { typeSlug, id } : { typeSlug },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const typesQuery = queries.cmsTypes.list();
      const detailQuery = id ? queries.cmsContent.detail(typeSlug, id) : void 0;
      try {
        if (hooks?.beforeLoadContentEditor) {
          await runClientHookWithShim(
            () => hooks.beforeLoadContentEditor(typeSlug, id, context),
            "Load prevented by beforeLoadContentEditor hook"
          );
        }
        const promises = [queryClient.prefetchQuery(typesQuery)];
        if (id) {
          promises.push(queryClient.prefetchQuery(detailQuery));
        }
        await Promise.all(promises);
        if (hooks?.afterLoadContentEditor) {
          await hooks.afterLoadContentEditor(typeSlug, id, context);
        }
        const typesState = queryClient.getQueryState(typesQuery.queryKey);
        const itemState = id ? queryClient.getQueryState(detailQuery.queryKey) : null;
        const queryError = typesState?.error || itemState?.error;
        if (queryError && hooks?.onLoadError) {
          const error = queryError instanceof Error ? queryError : new Error(String(queryError));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/cms] route.loader() failed — no server running at build time. Use myStack.api.cms.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchQuery({
            queryKey: typesQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            retry: false
          });
          if (detailQuery) {
            await queryClient.prefetchQuery({
              queryKey: detailQuery.queryKey,
              queryFn: () => {
                throw errToStore;
              },
              retry: false
            });
          }
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createDashboardMeta() {
  return () => {
    const title = "CMS Dashboard";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function createContentListMeta(typeSlug, config) {
  return () => {
    const { queryClient, apiBasePath, apiBaseURL } = config;
    const client = createApiClient({
      baseURL: apiBaseURL,
      basePath: apiBasePath
    });
    const queries = createCMSQueryKeys(client);
    const contentTypes = queryClient.getQueryData(
      queries.cmsTypes.list().queryKey
    );
    const contentType2 = contentTypes?.find((ct) => ct.slug === typeSlug);
    const title = contentType2?.name ? `${contentType2.name} | CMS` : "Content | CMS";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function createContentEditorMeta(typeSlug, id, config) {
  return () => {
    const { queryClient, apiBasePath, apiBaseURL } = config;
    const client = createApiClient({
      baseURL: apiBaseURL,
      basePath: apiBasePath
    });
    const queries = createCMSQueryKeys(client);
    const contentTypes = queryClient.getQueryData(
      queries.cmsTypes.list().queryKey
    );
    const contentType2 = contentTypes?.find((ct) => ct.slug === typeSlug);
    const title = id ? `Edit ${contentType2?.name || "Content"} | CMS` : `New ${contentType2?.name || "Content"} | CMS`;
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
const cmsClientPlugin = (config) => defineClientPlugin({
  name: "cms",
  routes: () => ({
    dashboard: createRoute("/cms", () => {
      const CustomDashboard = config.pageComponents?.dashboard;
      return {
        PageComponent: CustomDashboard ?? (() => /* @__PURE__ */ jsx(DashboardPageComponent, {})),
        loader: createDashboardLoader(config),
        meta: createDashboardMeta()
      };
    }),
    contentList: createRoute("/cms/:typeSlug", ({ params }) => {
      const CustomContentList = config.pageComponents?.contentList;
      return {
        PageComponent: CustomContentList ? () => /* @__PURE__ */ jsx(CustomContentList, { typeSlug: params.typeSlug }) : () => /* @__PURE__ */ jsx(ContentListPageComponent, { typeSlug: params.typeSlug }),
        loader: createContentListLoader(params.typeSlug, config),
        meta: createContentListMeta(params.typeSlug, config)
      };
    }),
    newContent: createRoute("/cms/:typeSlug/new", ({ params }) => {
      const CustomNewContent = config.pageComponents?.newContent;
      return {
        PageComponent: CustomNewContent ? () => /* @__PURE__ */ jsx(CustomNewContent, { typeSlug: params.typeSlug }) : () => /* @__PURE__ */ jsx(ContentEditorPageComponent, { typeSlug: params.typeSlug }),
        loader: createContentEditorLoader(params.typeSlug, void 0, config),
        meta: createContentEditorMeta(params.typeSlug, void 0, config)
      };
    }),
    editContent: createRoute("/cms/:typeSlug/:id", ({ params }) => {
      const CustomEditContent = config.pageComponents?.editContent;
      return {
        PageComponent: CustomEditContent ? () => /* @__PURE__ */ jsx(CustomEditContent, { typeSlug: params.typeSlug, id: params.id }) : () => /* @__PURE__ */ jsx(
          ContentEditorPageComponent,
          {
            typeSlug: params.typeSlug,
            id: params.id
          }
        ),
        loader: createContentEditorLoader(params.typeSlug, params.id, config),
        meta: createContentEditorMeta(params.typeSlug, params.id, config)
      };
    })
  }),
  sitemap: async () => {
    return [];
  }
});
function zodToFormSchema(schema2, metadata) {
  const jsonSchema = toJSONSchema(schema2, {
    unrepresentable: "any",
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def?.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
        const zodSchema = ctx.zodSchema;
        if (zodSchema.minDate) {
          ctx.jsonSchema.formatMinimum = zodSchema.minDate;
        }
        if (zodSchema.maxDate) {
          ctx.jsonSchema.formatMaximum = zodSchema.maxDate;
        }
      }
    }
  });
  return jsonSchema;
}
function extractStepGroupMap(jsonSchema) {
  const stepGroupMap = {};
  const properties = jsonSchema.properties;
  if (!properties) return stepGroupMap;
  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (typeof fieldSchema.stepGroup === "number") {
      stepGroupMap[fieldName] = fieldSchema.stepGroup;
    }
  }
  return stepGroupMap;
}
function findDateFieldsWithConstraints(jsonSchema) {
  const dateFields2 = {};
  const properties = jsonSchema.properties;
  if (!properties) return dateFields2;
  for (const [key, prop] of Object.entries(properties)) {
    if (prop.type === "string" && prop.format === "date-time") {
      if (prop.formatMinimum || prop.formatMaximum) {
        dateFields2[key] = {
          min: prop.formatMinimum,
          max: prop.formatMaximum
        };
      }
    }
  }
  return dateFields2;
}
function addDateValidations(schema2, dateFieldsWithConstraints) {
  if (Object.keys(dateFieldsWithConstraints).length === 0) {
    return schema2;
  }
  return schema2.superRefine((data, ctx) => {
    for (const [key, constraints] of Object.entries(dateFieldsWithConstraints)) {
      const value = data[key];
      if (value === void 0 || value === null || value === "") continue;
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "Invalid date",
          path: [key]
        });
        continue;
      }
      if (constraints.min) {
        const minDate = new Date(constraints.min);
        if (dateValue < minDate) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `Date must be after ${minDate.toLocaleDateString()}`,
            path: [key]
          });
        }
      }
      if (constraints.max) {
        const maxDate = new Date(constraints.max);
        if (dateValue > maxDate) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `Date must be before ${maxDate.toLocaleDateString()}`,
            path: [key]
          });
        }
      }
    }
  });
}
function attachStepsMetadata(schema2, jsonSchema) {
  const steps = jsonSchema.steps;
  if (!steps || steps.length === 0) {
    return schema2;
  }
  const stepGroupMap = jsonSchema.stepGroupMap ?? extractStepGroupMap(jsonSchema);
  return schema2.meta({
    steps,
    stepGroupMap
  });
}
function formSchemaToZod(jsonSchema) {
  let schema2 = fromJSONSchema(jsonSchema);
  if (schema2 && typeof schema2.passthrough === "function") {
    schema2 = schema2.passthrough();
  }
  const dateFieldsWithConstraints = findDateFieldsWithConstraints(jsonSchema);
  schema2 = addDateValidations(schema2, dateFieldsWithConstraints);
  schema2 = attachStepsMetadata(schema2, jsonSchema);
  return schema2;
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn$1(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function formsListDiscriminator(params) {
  return {
    status: params?.status,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0
  };
}
function submissionsListDiscriminator(params) {
  return {
    formId: params.formId,
    limit: params.limit ?? 20,
    offset: params.offset ?? 0
  };
}
const FORM_QUERY_KEYS = {
  /**
   * Key for forms.list(params) query.
   * Full key: ["forms", "list", "list", { status, limit, offset }]
   */
  formsList: (params) => ["forms", "list", "list", formsListDiscriminator(params)],
  /**
   * Key for forms.byId(id) query.
   * Full key: ["forms", "byId", "byId", id]
   */
  formById: (id) => ["forms", "byId", "byId", id],
  /**
   * Key for formSubmissions.list(params) query.
   * Full key: ["formSubmissions", "list", { formId, limit, offset }]
   */
  submissionsList: (params) => ["formSubmissions", "list", submissionsListDiscriminator(params)]
};
function isErrorResponse$3(response) {
  if (typeof response !== "object" || response === null) {
    return false;
  }
  const obj = response;
  return "error" in obj && obj.error !== null && obj.error !== void 0;
}
function toError$3(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || (typeof errorObj.error === "string" ? errorObj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function createFormBuilderQueryKeys(client, headers) {
  const forms = createFormsQueries(client, headers);
  const submissions = createSubmissionsQueries(client, headers);
  return O(forms, submissions);
}
function createFormsQueries(client, headers) {
  return h("forms", {
    list: (params = {}) => ({
      queryKey: ["list", formsListDiscriminator(params)],
      queryFn: async () => {
        try {
          const response = await client("/forms", {
            method: "GET",
            query: {
              status: params.status,
              limit: params.limit ?? 20,
              offset: params.offset ?? 0
            },
            headers
          });
          if (isErrorResponse$3(response)) {
            throw toError$3(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }),
    bySlug: (slug2) => ({
      queryKey: ["bySlug", slug2],
      queryFn: async () => {
        if (!slug2) return null;
        try {
          const response = await client("/forms/:slug", {
            method: "GET",
            params: { slug: slug2 },
            headers
          });
          if (isErrorResponse$3(response)) {
            throw toError$3(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }),
    byId: (id) => ({
      queryKey: ["byId", id],
      queryFn: async () => {
        if (!id) return null;
        try {
          const response = await client("/forms/id/:id", {
            method: "GET",
            params: { id },
            headers
          });
          if (isErrorResponse$3(response)) {
            throw toError$3(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
function createSubmissionsQueries(client, headers) {
  return h("formSubmissions", {
    list: (params) => ({
      queryKey: [submissionsListDiscriminator(params)],
      queryFn: async () => {
        try {
          const response = await client("/forms/:formId/submissions", {
            method: "GET",
            params: { formId: params.formId },
            query: {
              limit: params.limit ?? 20,
              offset: params.offset ?? 0
            },
            headers
          });
          if (isErrorResponse$3(response)) {
            throw toError$3(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    }),
    detail: (formId, subId) => ({
      queryKey: [formId, subId],
      queryFn: async () => {
        if (!formId || !subId) return null;
        try {
          const response = await client(
            "/forms/:formId/submissions/:subId",
            {
              method: "GET",
              params: { formId, subId },
              headers
            }
          );
          if (isErrorResponse$3(response)) {
            throw toError$3(response.error);
          }
          return response.data;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
const FormListPageComponent = lazy(
  () => import("./form-list-page-EkrFR8Xy.mjs").then((m2) => ({
    default: m2.FormListPageComponent
  }))
);
const FormBuilderPageComponent = lazy(
  () => import("./form-builder-page-Ceb_DSCJ.mjs").then((m2) => ({
    default: m2.FormBuilderPageComponent
  }))
);
const SubmissionsPageComponent = lazy(
  () => import("./submissions-page-CfYbGipE.mjs").then((m2) => ({
    default: m2.SubmissionsPageComponent
  }))
);
function createFormListLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: "/forms",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createFormBuilderQueryKeys(client, headers);
      const limit = 20;
      const listQuery = queries.forms.list({ limit, offset: 0 });
      try {
        if (hooks?.beforeLoadFormList) {
          await runClientHookWithShim(
            () => hooks.beforeLoadFormList(context),
            "Load prevented by beforeLoadFormList hook"
          );
        }
        await queryClient.prefetchInfiniteQuery({
          queryKey: listQuery.queryKey,
          queryFn: async ({ pageParam = 0 }) => {
            const response = await client("/forms", {
              method: "GET",
              query: { limit, offset: pageParam },
              headers
            });
            if (typeof response === "object" && response !== null && "error" in response && response.error) {
              throw new Error(String(response.error));
            }
            return response.data;
          },
          initialPageParam: 0
        });
        if (hooks?.afterLoadFormList) {
          await hooks.afterLoadFormList(context);
        }
        const queryState = queryClient.getQueryState(listQuery.queryKey);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/form-builder] route.loader() failed — no server running at build time. Use myStack.api.formBuilder.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchInfiniteQuery({
            queryKey: listQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            initialPageParam: 0,
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createFormBuilderLoader(id, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: id ? `/forms/${id}/edit` : "/forms/new",
        params: id ? { id } : {},
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createFormBuilderQueryKeys(client, headers);
      const formQuery = id ? queries.forms.byId(id) : void 0;
      try {
        if (hooks?.beforeLoadFormBuilder) {
          await runClientHookWithShim(
            () => hooks.beforeLoadFormBuilder(id, context),
            "Load prevented by beforeLoadFormBuilder hook"
          );
        }
        if (id) {
          await queryClient.prefetchQuery(formQuery);
        }
        if (hooks?.afterLoadFormBuilder) {
          await hooks.afterLoadFormBuilder(id, context);
        }
        if (id) {
          const queryState = queryClient.getQueryState(formQuery.queryKey);
          if (queryState?.error && hooks?.onLoadError) {
            const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
            await hooks.onLoadError(error, context);
          }
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/form-builder] route.loader() failed — no server running at build time. Use myStack.api.formBuilder.prefetchForRoute() for SSG data prefetching."
          );
        } else if (formQuery) {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchQuery({
            queryKey: formQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createSubmissionsLoader(formId, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: `/forms/${formId}/submissions`,
        params: { formId },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createFormBuilderQueryKeys(client, headers);
      const limit = 20;
      const formQuery = queries.forms.byId(formId);
      const submissionsQuery = queries.formSubmissions.list({
        formId,
        limit,
        offset: 0
      });
      try {
        if (hooks?.beforeLoadSubmissions) {
          await runClientHookWithShim(
            () => hooks.beforeLoadSubmissions(formId, context),
            "Load prevented by beforeLoadSubmissions hook"
          );
        }
        await queryClient.prefetchQuery(formQuery);
        await queryClient.prefetchInfiniteQuery({
          queryKey: submissionsQuery.queryKey,
          queryFn: async ({ pageParam = 0 }) => {
            const response = await client(
              "/forms/:formId/submissions",
              {
                method: "GET",
                params: { formId },
                query: { limit, offset: pageParam },
                headers
              }
            );
            if (typeof response === "object" && response !== null && "error" in response && response.error) {
              throw new Error(String(response.error));
            }
            return response.data;
          },
          initialPageParam: 0
        });
        if (hooks?.afterLoadSubmissions) {
          await hooks.afterLoadSubmissions(formId, context);
        }
        const formState = queryClient.getQueryState(formQuery.queryKey);
        const submissionsState = queryClient.getQueryState(
          submissionsQuery.queryKey
        );
        const queryError = formState?.error || submissionsState?.error;
        if (queryError && hooks?.onLoadError) {
          const error = queryError instanceof Error ? queryError : new Error(String(queryError));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/form-builder] route.loader() failed — no server running at build time. Use myStack.api.formBuilder.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchInfiniteQuery({
            queryKey: submissionsQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            initialPageParam: 0,
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createFormListMeta() {
  return () => {
    const title = "Forms";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function createFormBuilderMeta(id, config) {
  return () => {
    const { queryClient, apiBasePath, apiBaseURL } = config;
    let formName = "";
    if (id) {
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createFormBuilderQueryKeys(client);
      const form2 = queryClient.getQueryData(queries.forms.byId(id).queryKey);
      formName = form2?.name || "";
    }
    const title = id ? `Edit ${formName || "Form"}` : "New Form";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function createSubmissionsMeta(formId, config) {
  return () => {
    const { queryClient, apiBasePath, apiBaseURL } = config;
    const client = createApiClient({
      baseURL: apiBaseURL,
      basePath: apiBasePath
    });
    const queries = createFormBuilderQueryKeys(client);
    const form2 = queryClient.getQueryData(
      queries.forms.byId(formId).queryKey
    );
    const title = form2?.name ? `${form2.name} Submissions` : "Submissions";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
const formBuilderClientPlugin = (config) => defineClientPlugin({
  name: "form-builder",
  routes: () => ({
    formList: createRoute("/forms", () => {
      const CustomFormList = config.pageComponents?.formList;
      return {
        PageComponent: CustomFormList ?? (() => /* @__PURE__ */ jsx(FormListPageComponent, {})),
        loader: createFormListLoader(config),
        meta: createFormListMeta()
      };
    }),
    newForm: createRoute("/forms/new", () => {
      const CustomNewForm = config.pageComponents?.newForm;
      return {
        PageComponent: CustomNewForm ?? (() => /* @__PURE__ */ jsx(FormBuilderPageComponent, {})),
        loader: createFormBuilderLoader(void 0, config),
        meta: createFormBuilderMeta(void 0, config)
      };
    }),
    editForm: createRoute("/forms/:id/edit", ({ params }) => {
      const CustomEditForm = config.pageComponents?.editForm;
      return {
        PageComponent: CustomEditForm ? () => /* @__PURE__ */ jsx(CustomEditForm, { id: params.id }) : () => /* @__PURE__ */ jsx(FormBuilderPageComponent, { id: params.id }),
        loader: createFormBuilderLoader(params.id, config),
        meta: createFormBuilderMeta(params.id, config)
      };
    }),
    submissions: createRoute("/forms/:id/submissions", ({ params }) => {
      const CustomSubmissions = config.pageComponents?.submissions;
      return {
        PageComponent: CustomSubmissions ? () => /* @__PURE__ */ jsx(CustomSubmissions, { formId: params.id }) : () => /* @__PURE__ */ jsx(SubmissionsPageComponent, { formId: params.id }),
        loader: createSubmissionsLoader(params.id, config),
        meta: createSubmissionsMeta(params.id, config)
      };
    })
  }),
  sitemap: async () => {
    return [];
  }
});
const uiBuilderPageSchema = object({
  /** JSON-serialized ComponentLayer[] representing the page structure */
  layers: string().meta({ fieldType: "textarea" }),
  /** JSON-serialized Variable[] for dynamic content */
  variables: string().default("[]").meta({ fieldType: "textarea" }),
  /** Page publication status */
  status: _enum(["published", "draft", "archived"]).default("draft").meta({ fieldType: "select" })
});
const UI_BUILDER_CONTENT_TYPE = {
  name: "UI Builder Page",
  slug: "ui-builder-page",
  description: "Visual drag-and-drop page builder pages",
  schema: uiBuilderPageSchema
};
const UI_BUILDER_TYPE_SLUG = "ui-builder-page";
const PageListPageComponent = lazy(
  () => import("./page-list-page-BHwJ4tDM.mjs").then((n) => n.p).then((m2) => ({
    default: m2.PageListPage
  }))
);
const PageBuilderPageComponent = lazy(
  () => import("./page-builder-page-Fugw3gDt.mjs").then((m2) => ({
    default: m2.PageBuilderPage
  }))
);
function createPageListLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const typeSlug = UI_BUILDER_TYPE_SLUG;
      const context = {
        path: "/ui-builder",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const limit = 20;
      const listQuery = queries.cmsContent.list({
        typeSlug,
        limit,
        offset: 0
      });
      const uiBuilderListQueryKey = [...listQuery.queryKey, "ui-builder"];
      try {
        if (hooks?.beforeLoadPageList) {
          await runClientHookWithShim(
            () => hooks.beforeLoadPageList(context),
            "Load prevented by beforeLoadPageList hook"
          );
        }
        await queryClient.prefetchInfiniteQuery({
          queryKey: uiBuilderListQueryKey,
          queryFn: async ({ pageParam = 0 }) => {
            const response = await client("/content/:typeSlug", {
              method: "GET",
              params: { typeSlug },
              query: { limit, offset: pageParam },
              headers
            });
            if (typeof response === "object" && response !== null && "error" in response && response.error) {
              throw new Error(String(response.error));
            }
            return response.data;
          },
          initialPageParam: 0
        });
        if (hooks?.afterLoadPageList) {
          await hooks.afterLoadPageList(context);
        }
        const queryState = queryClient.getQueryState([
          ...uiBuilderListQueryKey
        ]);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/ui-builder] route.loader() failed — no server running at build time. Use myStack.api.uiBuilder.prefetchForRoute() for SSG data prefetching."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchInfiniteQuery({
            queryKey: uiBuilderListQueryKey,
            queryFn: () => {
              throw errToStore;
            },
            initialPageParam: 0,
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createPageBuilderLoader(id, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const typeSlug = UI_BUILDER_TYPE_SLUG;
      const context = {
        path: id ? `/ui-builder/${id}/edit` : "/ui-builder/new",
        params: id ? { id } : {},
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const pageQuery = id ? queries.cmsContent.detail(typeSlug, id) : void 0;
      try {
        if (hooks?.beforeLoadPageBuilder) {
          await runClientHookWithShim(
            () => hooks.beforeLoadPageBuilder(id, context),
            "Load prevented by beforeLoadPageBuilder hook"
          );
        }
        if (id) {
          await queryClient.prefetchQuery(pageQuery);
        }
        if (hooks?.afterLoadPageBuilder) {
          await hooks.afterLoadPageBuilder(id, context);
        }
        if (id) {
          const queryState = queryClient.getQueryState(pageQuery.queryKey);
          if (queryState?.error && hooks?.onLoadError) {
            const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
            await hooks.onLoadError(error, context);
          }
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/ui-builder] route.loader() failed — no server running at build time. Use myStack.api.uiBuilder.prefetchForRoute() for SSG data prefetching."
          );
        } else if (pageQuery) {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchQuery({
            queryKey: pageQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createPageListMeta() {
  return () => {
    const title = "UI Builder Pages";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function createPageBuilderMeta(id, config) {
  return () => {
    const { queryClient, apiBasePath, apiBaseURL, headers } = config;
    const typeSlug = UI_BUILDER_TYPE_SLUG;
    let pageSlug = "";
    if (id) {
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCMSQueryKeys(client, headers);
      const page = queryClient.getQueryData(
        queries.cmsContent.detail(typeSlug, id).queryKey
      );
      pageSlug = page?.slug || "";
    }
    const title = id ? `Edit ${pageSlug || "Page"}` : "New Page";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
const uiBuilderClientPlugin = (config) => defineClientPlugin({
  name: "ui-builder",
  routes: () => ({
    pageList: createRoute("/ui-builder", () => {
      const CustomPageList = config.pageComponents?.pageList;
      return {
        PageComponent: CustomPageList ?? (() => /* @__PURE__ */ jsx(PageListPageComponent, {})),
        loader: createPageListLoader(config),
        meta: createPageListMeta()
      };
    }),
    newPage: createRoute("/ui-builder/new", () => {
      const CustomNewPage = config.pageComponents?.newPage;
      return {
        PageComponent: CustomNewPage ?? (() => /* @__PURE__ */ jsx(PageBuilderPageComponent, {})),
        loader: createPageBuilderLoader(void 0, config),
        meta: createPageBuilderMeta(void 0, config)
      };
    }),
    editPage: createRoute("/ui-builder/:id/edit", ({ params }) => {
      const CustomEditPage = config.pageComponents?.editPage;
      return {
        PageComponent: CustomEditPage ? () => /* @__PURE__ */ jsx(CustomEditPage, { id: params.id }) : () => /* @__PURE__ */ jsx(PageBuilderPageComponent, { id: params.id }),
        loader: createPageBuilderLoader(params.id, config),
        meta: createPageBuilderMeta(params.id, config)
      };
    })
  }),
  sitemap: async () => {
    return [];
  }
});
function boardsListDiscriminator(params) {
  return {
    slug: params?.slug,
    ownerId: params?.ownerId,
    organizationId: params?.organizationId,
    limit: params?.limit ?? 50,
    offset: params?.offset ?? 0
  };
}
const KANBAN_QUERY_KEYS = {
  /**
   * Key for boards.list(params) query.
   * Full key: ["boards", "list", { slug, ownerId, organizationId, limit, offset }]
   */
  boardsList: (params) => ["boards", "list", boardsListDiscriminator(params)],
  /**
   * Key for boards.detail(boardId) query.
   * Full key: ["boards", "detail", boardId]
   */
  boardDetail: (boardId) => ["boards", "detail", boardId]
};
function isErrorResponse$2(response) {
  return typeof response === "object" && response !== null && "error" in response && response.error !== null && response.error !== void 0;
}
function toError$2(error) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || (typeof errorObj.error === "string" ? errorObj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function createKanbanQueryKeys(client, headers) {
  const boards = createBoardsQueries(client, headers);
  return O(boards);
}
function createBoardsQueries(client, headers) {
  return h("boards", {
    list: (params) => ({
      queryKey: [boardsListDiscriminator(params)],
      queryFn: async () => {
        try {
          const response = await client("/boards", {
            method: "GET",
            query: {
              slug: params?.slug,
              ownerId: params?.ownerId,
              organizationId: params?.organizationId,
              limit: params?.limit ?? 50,
              offset: params?.offset ?? 0
            },
            headers
          });
          if (isErrorResponse$2(response)) {
            const errorResponse = response;
            throw toError$2(errorResponse.error);
          }
          const envelope = response.data;
          return envelope?.items ?? [];
        } catch (error) {
          throw error;
        }
      }
    }),
    detail: (boardId) => ({
      queryKey: [boardId],
      queryFn: async () => {
        if (!boardId) return null;
        try {
          const response = await client("/boards/:id", {
            method: "GET",
            params: { id: boardId },
            headers
          });
          if (isErrorResponse$2(response)) {
            const errorResponse = response;
            throw toError$2(errorResponse.error);
          }
          return response.data ?? null;
        } catch (error) {
          throw error;
        }
      }
    }),
    // Get board by slug
    bySlug: (slug2) => ({
      queryKey: ["slug", slug2],
      queryFn: async () => {
        if (!slug2) return null;
        try {
          const response = await client("/boards", {
            method: "GET",
            query: { slug: slug2, limit: 1 },
            headers
          });
          if (isErrorResponse$2(response)) {
            const errorResponse = response;
            throw toError$2(errorResponse.error);
          }
          const envelope = response.data;
          return envelope?.items?.[0] ?? null;
        } catch (error) {
          throw error;
        }
      }
    })
  });
}
function DefaultError({ error, reset }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-12 text-center",
      "data-testid": "error-placeholder",
      children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-full bg-destructive/10 p-6 mb-4", children: /* @__PURE__ */ jsx(CircleAlert, { className: "h-8 w-8 text-destructive" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Something went wrong" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-md mb-4", children: (error instanceof Error ? error.message : void 0) || "An unexpected error occurred. Please try again." }),
        reset && /* @__PURE__ */ jsxs(Button, { onClick: reset, variant: "outline", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
          "Try Again"
        ] })
      ]
    }
  );
}
function BoardsListSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto py-8 px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-48" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-64 mt-2" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-32" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" })
      ] }) })
    ] }, i)) })
  ] });
}
function NotFoundPage() {
  const { navigate: overrideNavigate } = usePluginOverrides("kanban");
  const navigate = overrideNavigate || ((path) => {
    window.location.href = path;
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex min-h-[400px] flex-col items-center justify-center text-center",
      "data-testid": "empty-state",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-2", children: "Page Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "The page you're looking for doesn't exist." }),
        /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/pages/kanban"), children: "Back to Boards" })
      ]
    }
  );
}
const BoardsListPage = lazy(
  () => import("./boards-list-page.internal-DLcTSoSb.mjs").then((m2) => ({
    default: m2.BoardsListPage
  }))
);
function BoardsListPageComponent() {
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/kanban",
      PageComponent: BoardsListPage,
      ErrorComponent: DefaultError,
      LoadingComponent: BoardsListSkeleton,
      NotFoundComponent: NotFoundPage,
      onError: (error) => console.error("BoardsListPage error:", error)
    }
  );
}
const NewBoardPage = lazy(
  () => import("./new-board-page.internal-B6iMaoEh.mjs").then((m2) => ({
    default: m2.NewBoardPage
  }))
);
function NewBoardPageComponent() {
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/kanban/new",
      PageComponent: NewBoardPage,
      ErrorComponent: DefaultError,
      LoadingComponent: BoardsListSkeleton,
      NotFoundComponent: NotFoundPage,
      onError: (error) => console.error("NewBoardPage error:", error)
    }
  );
}
function BoardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto py-8 px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-48" }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-64 mt-2" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-28" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-3", children: Array.from({ length: 3 }).map((_, colIdx) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-lg border bg-zinc-100 dark:bg-zinc-900 p-2.5",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-8" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: Array.from({ length: 3 }).map((_2, taskIdx) => /* @__PURE__ */ jsxs("div", { className: "rounded-md border bg-card p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-6" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-5 flex-1" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-16" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" })
            ] })
          ] }, taskIdx)) })
        ]
      },
      colIdx
    )) })
  ] });
}
const BoardPage = lazy(
  () => import("./board-page.internal-za3YWo9j.mjs").then((m2) => ({
    default: m2.BoardPage
  }))
);
function BoardPageComponent({ boardId }) {
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: `/kanban/${boardId}`,
      PageComponent: BoardPage,
      ErrorComponent: DefaultError,
      LoadingComponent: BoardSkeleton,
      NotFoundComponent: NotFoundPage,
      props: { boardId },
      onError: (error) => console.error("BoardPage error:", error)
    }
  );
}
function createBoardsLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: "/kanban",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadBoards) {
          await runClientHookWithShim(
            () => hooks.beforeLoadBoards(context),
            "Load prevented by beforeLoadBoards hook"
          );
        }
        const client = createApiClient({
          baseURL: apiBaseURL,
          basePath: apiBasePath
        });
        const queries = createKanbanQueryKeys(client, headers);
        const listQuery = queries.boards.list({});
        await queryClient.prefetchQuery(listQuery);
        if (hooks?.afterLoadBoards) {
          const boards = queryClient.getQueryData(
            listQuery.queryKey
          );
          await runClientHookWithShim(
            () => hooks.afterLoadBoards(boards || null, context),
            "Load prevented by afterLoadBoards hook"
          );
        }
        const queryState = queryClient.getQueryState(listQuery.queryKey);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/kanban] route.loader() failed — no server running at build time. Use myStack.api.kanban.prefetchForRoute() for SSG data prefetching."
          );
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createBoardLoader(boardId, config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: `/kanban/${boardId}`,
        params: { boardId },
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadBoard) {
          await runClientHookWithShim(
            () => hooks.beforeLoadBoard(boardId, context),
            "Load prevented by beforeLoadBoard hook"
          );
        }
        const client = createApiClient({
          baseURL: apiBaseURL,
          basePath: apiBasePath
        });
        const queries = createKanbanQueryKeys(client, headers);
        const boardQuery = queries.boards.detail(boardId);
        await queryClient.prefetchQuery(boardQuery);
        if (hooks?.afterLoadBoard) {
          const board = queryClient.getQueryData(
            boardQuery.queryKey
          );
          await runClientHookWithShim(
            () => hooks.afterLoadBoard(board || null, boardId, context),
            "Load prevented by afterLoadBoard hook"
          );
        }
        const queryState = queryClient.getQueryState(boardQuery.queryKey);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/kanban] route.loader() failed — no server running at build time. Use myStack.api.kanban.prefetchForRoute() for SSG data prefetching."
          );
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createNewBoardLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: "/kanban/new",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadNewBoard) {
          await runClientHookWithShim(
            () => hooks.beforeLoadNewBoard(context),
            "Load prevented by beforeLoadNewBoard hook"
          );
        }
        if (hooks?.afterLoadNewBoard) {
          await runClientHookWithShim(
            () => hooks.afterLoadNewBoard(context),
            "Load prevented by afterLoadNewBoard hook"
          );
        }
      } catch (error) {
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createBoardsListMeta(config) {
  return () => {
    const { siteBaseURL, siteBasePath, seo } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}/kanban`;
    const title = "Kanban Boards";
    const description = seo?.description || "Manage your projects with kanban boards";
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      ...seo?.siteName ? [{ property: "og:site_name", content: seo.siteName }] : [],
      ...seo?.locale ? [{ property: "og:locale", content: seo.locale }] : [],
      ...seo?.defaultImage ? [{ property: "og:image", content: seo.defaultImage }] : [],
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
function createBoardMeta(boardId, config) {
  return () => {
    const {
      queryClient,
      apiBaseURL,
      apiBasePath,
      siteBaseURL,
      siteBasePath,
      seo
    } = config;
    const queries = createKanbanQueryKeys(
      createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      })
    );
    const board = queryClient.getQueryData(
      queries.boards.detail(boardId).queryKey
    );
    if (!board) {
      return [
        { title: "Board Not Found" },
        { name: "robots", content: "noindex" }
      ];
    }
    const fullUrl = `${siteBaseURL}${siteBasePath}/kanban/${board.id}`;
    const title = board.name;
    const description = board.description || `Kanban board: ${board.name}`;
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      ...seo?.siteName ? [{ property: "og:site_name", content: seo.siteName }] : [],
      ...seo?.defaultImage ? [{ property: "og:image", content: seo.defaultImage }] : [],
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
function createNewBoardMeta(config) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}/kanban/new`;
    const title = "Create New Board";
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: "Create a new kanban board" },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
const kanbanClientPlugin = (config) => defineClientPlugin({
  name: "kanban",
  routes: () => ({
    boards: createRoute("/kanban", () => {
      const CustomBoards = config.pageComponents?.boards;
      return {
        PageComponent: CustomBoards ?? (() => /* @__PURE__ */ jsx(BoardsListPageComponent, {})),
        loader: createBoardsLoader(config),
        meta: createBoardsListMeta(config)
      };
    }),
    newBoard: createRoute("/kanban/new", () => {
      const CustomNewBoard = config.pageComponents?.newBoard;
      return {
        PageComponent: CustomNewBoard ?? NewBoardPageComponent,
        loader: createNewBoardLoader(config),
        meta: createNewBoardMeta(config)
      };
    }),
    board: createRoute("/kanban/:boardId", ({ params: { boardId } }) => {
      const CustomBoard = config.pageComponents?.board;
      return {
        PageComponent: CustomBoard ? () => /* @__PURE__ */ jsx(CustomBoard, { boardId }) : () => /* @__PURE__ */ jsx(BoardPageComponent, { boardId }),
        loader: createBoardLoader(boardId, config),
        meta: createBoardMeta(boardId, config)
      };
    })
  }),
  sitemap: async () => {
    const origin = `${config.siteBaseURL}${config.siteBasePath}`;
    const indexUrl = `${origin}/kanban`;
    const client = createApiClient({
      baseURL: config.apiBaseURL,
      basePath: config.apiBasePath
    });
    let boards = [];
    try {
      const res = await client("/boards", {
        method: "GET",
        query: { limit: 100 }
      });
      boards = res.data?.items ?? [];
    } catch {
    }
    const entries = [
      {
        url: indexUrl,
        lastModified: /* @__PURE__ */ new Date(),
        changeFrequency: "daily",
        priority: 0.7
      },
      ...boards.map((b) => ({
        url: `${origin}/kanban/${b.id}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : void 0,
        changeFrequency: "weekly",
        priority: 0.6
      }))
    ];
    return entries;
  }
});
function commentsListDiscriminator(params) {
  return {
    resourceId: params?.resourceId,
    resourceType: params?.resourceType,
    parentId: params?.parentId,
    status: params?.status,
    currentUserId: params?.currentUserId,
    authorId: params?.authorId,
    sort: params?.sort,
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0
  };
}
function commentCountDiscriminator(params) {
  return {
    resourceId: params.resourceId,
    resourceType: params.resourceType,
    status: params.status
  };
}
function commentsThreadDiscriminator(params) {
  return {
    resourceId: params?.resourceId,
    resourceType: params?.resourceType,
    parentId: params?.parentId,
    status: params?.status,
    currentUserId: params?.currentUserId,
    sort: params?.sort,
    limit: params?.limit ?? 20
  };
}
function toError$1(error) {
  if (error instanceof Error) return error;
  if (typeof error === "object" && error !== null) {
    const obj = error;
    const message = (typeof obj.message === "string" ? obj.message : null) || (typeof obj.error === "string" ? obj.error : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function isErrorResponse$1(response) {
  return typeof response === "object" && response !== null && "error" in response && response.error !== null && response.error !== void 0;
}
function createCommentsQueryKeys(client, headers) {
  return O(
    createCommentsQueries(client, headers),
    createCommentCountQueries(client, headers),
    createCommentsThreadQueries(client, headers)
  );
}
function createCommentsQueries(client, headers) {
  return h("comments", {
    list: (params) => ({
      queryKey: [commentsListDiscriminator(params)],
      queryFn: async () => {
        const response = await client("/comments", {
          method: "GET",
          query: {
            resourceId: params?.resourceId,
            resourceType: params?.resourceType,
            parentId: params?.parentId === null ? "null" : params?.parentId,
            status: params?.status,
            // currentUserId is intentionally NOT sent to the server.
            // The server resolves the caller's identity server-side via the
            // resolveCurrentUserId hook. Sending it would allow any caller to
            // impersonate another user and read their pending comments.
            // It is still included in the queryKey above for client-side
            // cache segregation (different users get different cache entries).
            authorId: params?.authorId,
            sort: params?.sort,
            limit: params?.limit ?? 20,
            offset: params?.offset ?? 0
          },
          headers
        });
        if (isErrorResponse$1(response)) {
          throw toError$1(response.error);
        }
        const data = response.data;
        return data ?? { items: [], total: 0, limit: 20, offset: 0 };
      }
    })
  });
}
function createCommentCountQueries(client, headers) {
  return h("commentCount", {
    byResource: (params) => ({
      queryKey: [commentCountDiscriminator(params)],
      queryFn: async () => {
        const response = await client("/comments/count", {
          method: "GET",
          query: {
            resourceId: params.resourceId,
            resourceType: params.resourceType,
            status: params.status
          },
          headers
        });
        if (isErrorResponse$1(response)) {
          throw toError$1(response.error);
        }
        const data = response.data;
        return data?.count ?? 0;
      }
    })
  });
}
function createCommentsThreadQueries(client, headers) {
  return h("commentsThread", {
    list: (params) => ({
      // Offset is excluded from the key — it is driven by pageParam.
      queryKey: [commentsThreadDiscriminator(params)],
      queryFn: async ({
        pageParam
      } = {}) => {
        const response = await client("/comments", {
          method: "GET",
          query: {
            resourceId: params?.resourceId,
            resourceType: params?.resourceType,
            parentId: params?.parentId === null ? "null" : params?.parentId,
            status: params?.status,
            // currentUserId is intentionally NOT sent to the server.
            // The server resolves the caller's identity server-side via the
            // resolveCurrentUserId hook. It is still included in the queryKey
            // above for client-side cache segregation.
            sort: params?.sort,
            limit: params?.limit ?? 20,
            offset: pageParam ?? 0
          },
          headers
        });
        if (isErrorResponse$1(response)) {
          throw toError$1(response.error);
        }
        const data = response.data;
        return data ?? {
          items: [],
          total: 0,
          limit: params?.limit ?? 20,
          offset: pageParam ?? 0
        };
      }
    })
  });
}
const ModerationPageComponent = lazy(
  () => import("./moderation-page-CsglAtD7.mjs").then((m2) => ({
    default: m2.ModerationPageComponent
  }))
);
const UserCommentsPageComponent = lazy(
  () => import("./my-comments-page-BTogNq-s.mjs").then((m2) => ({
    default: m2.UserCommentsPageComponent
  }))
);
function createModerationLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: "/comments/moderation",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCommentsQueryKeys(client, headers);
      const listQuery = queries.comments.list({
        status: "pending",
        limit: 20,
        offset: 0
      });
      try {
        if (hooks?.beforeLoadModeration) {
          await hooks.beforeLoadModeration(context);
        }
        await queryClient.prefetchQuery(listQuery);
        const queryState = queryClient.getQueryState(listQuery.queryKey);
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/comments] route.loader() failed — no server running at build time."
          );
        } else {
          const errToStore = createSanitizedSSRLoaderError();
          await queryClient.prefetchQuery({
            queryKey: listQuery.queryKey,
            queryFn: () => {
              throw errToStore;
            },
            retry: false
          });
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createUserCommentsLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, headers, hooks } = config;
      const context = {
        path: "/comments",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      const client = createApiClient({
        baseURL: apiBaseURL,
        basePath: apiBasePath
      });
      const queries = createCommentsQueryKeys(client, headers);
      const getUserListQuery = (currentUserId) => queries.comments.list({
        authorId: currentUserId,
        sort: "desc",
        limit: 20,
        offset: 0
      });
      try {
        if (hooks?.beforeLoadUserComments) {
          await hooks.beforeLoadUserComments(context);
        }
        const currentUserId = typeof context.currentUserId === "string" ? context.currentUserId : void 0;
        if (currentUserId) {
          const listQuery = getUserListQuery(currentUserId);
          await queryClient.prefetchQuery(listQuery);
          const queryState = queryClient.getQueryState(listQuery.queryKey);
          if (queryState?.error && hooks?.onLoadError) {
            const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
            await hooks.onLoadError(error, context);
          }
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/comments] route.loader() failed — no server running at build time."
          );
        } else {
          const currentUserId = typeof context.currentUserId === "string" ? context.currentUserId : void 0;
          if (currentUserId) {
            const errToStore = createSanitizedSSRLoaderError();
            await queryClient.prefetchQuery({
              queryKey: getUserListQuery(currentUserId).queryKey,
              queryFn: () => {
                throw errToStore;
              },
              retry: false
            });
          }
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createCommentsRouteMeta(config, path, title, description) {
  return () => {
    const fullUrl = `${config.siteBaseURL}${config.siteBasePath}${path}`;
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
const commentsClientPlugin = (config) => defineClientPlugin({
  name: "comments",
  routes: () => ({
    moderation: createRoute("/comments/moderation", () => ({
      PageComponent: ModerationPageComponent,
      loader: createModerationLoader(config),
      meta: createCommentsRouteMeta(
        config,
        "/comments/moderation",
        "Comment Moderation",
        "Review and manage comments across all resources."
      )
    })),
    userComments: createRoute("/comments", () => ({
      PageComponent: UserCommentsPageComponent,
      loader: createUserCommentsLoader(config),
      meta: createCommentsRouteMeta(
        config,
        "/comments",
        "User Comments",
        "View and manage your comments across resources."
      )
    }))
  })
});
const LibraryPage = lazy(
  () => import("./library-page.internal-CmhBXUdK.mjs").then((m2) => ({ default: m2.LibraryPage }))
);
function LibraryLoading() {
  return /* @__PURE__ */ jsx("div", { className: "flex h-96 items-center justify-center", children: /* @__PURE__ */ jsx(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" }) });
}
function LibraryError({ error }) {
  const message = error instanceof Error ? error.message : String(error);
  return /* @__PURE__ */ jsx("div", { className: "flex h-96 items-center justify-center p-8 text-destructive", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: message }) });
}
function LibraryPageComponent() {
  usePluginOverrides("media");
  return /* @__PURE__ */ jsx(
    ComposedRoute,
    {
      path: "/media",
      PageComponent: LibraryPage,
      ErrorComponent: LibraryError,
      LoadingComponent: LibraryLoading,
      NotFoundComponent: () => null,
      onError: (error) => console.error("[btst/media] Library error:", error)
    }
  );
}
function assetListDiscriminator(params) {
  return {
    folderId: params?.folderId,
    mimeType: params?.mimeType,
    query: params?.query,
    limit: params?.limit,
    offset: params?.offset
  };
}
function isErrorResponse(response) {
  return typeof response === "object" && response !== null && "error" in response && response.error !== null && response.error !== void 0;
}
function toError(error) {
  if (error instanceof Error) return error;
  if (typeof error === "object" && error !== null) {
    const errorObj = error;
    const message = (typeof errorObj.message === "string" ? errorObj.message : null) || JSON.stringify(error);
    const err = new Error(message);
    Object.assign(err, error);
    return err;
  }
  return new Error(String(error));
}
function createMediaQueryKeys(client, headers) {
  return O(
    h("mediaAssets", {
      list: (params) => ({
        queryKey: [assetListDiscriminator(params)],
        queryFn: async ({ pageParam }) => {
          const response = await client("/media/assets", {
            method: "GET",
            query: {
              folderId: params?.folderId,
              mimeType: params?.mimeType,
              query: params?.query,
              offset: pageParam ?? params?.offset ?? 0,
              limit: params?.limit ?? 20
            },
            headers
          });
          if (isErrorResponse(response)) throw toError(response.error);
          const data = response.data;
          return data;
        }
      }),
      detail: (id) => ({
        queryKey: [id],
        queryFn: async () => {
          const response = await client("/media/assets", {
            method: "GET",
            query: { id },
            headers
          });
          if (isErrorResponse(response)) throw toError(response.error);
          return response.data;
        }
      })
    }),
    h("mediaFolders", {
      list: (parentId) => ({
        queryKey: [parentId ?? "root"],
        queryFn: async () => {
          const response = await client("/media/folders", {
            method: "GET",
            query: parentId !== void 0 ? { parentId: parentId ?? void 0 } : {},
            headers
          });
          if (isErrorResponse(response)) throw toError(response.error);
          return response.data;
        }
      })
    })
  );
}
const mediaClientPlugin = (config) => defineClientPlugin({
  name: "media",
  routes: () => ({
    library: createRoute("/media", () => {
      const CustomLibrary = config.pageComponents?.library;
      return {
        PageComponent: CustomLibrary ?? LibraryPageComponent,
        loader: createMediaLibraryLoader(config),
        meta: createMediaLibraryMeta(config)
      };
    })
  })
});
function createMediaLibraryLoader(config) {
  return async () => {
    if (typeof window === "undefined") {
      const { queryClient, apiBasePath, apiBaseURL, hooks, headers } = config;
      const context = {
        path: "/media",
        isSSR: true,
        apiBaseURL,
        apiBasePath,
        headers
      };
      try {
        if (hooks?.beforeLoadLibrary) {
          await hooks.beforeLoadLibrary(context);
        }
        const client = createApiClient({
          baseURL: apiBaseURL,
          basePath: apiBasePath
        });
        const queries = createMediaQueryKeys(client, headers);
        await queryClient.prefetchInfiniteQuery({
          ...queries.mediaAssets.list({ limit: 40 }),
          initialPageParam: 0
        });
        await queryClient.prefetchQuery(queries.mediaFolders.list(null));
        if (hooks?.afterLoadLibrary) {
          await hooks.afterLoadLibrary(context);
        }
        const queryState = queryClient.getQueryState(
          queries.mediaAssets.list({ limit: 40 }).queryKey
        );
        if (queryState?.error && hooks?.onLoadError) {
          const error = queryState.error instanceof Error ? queryState.error : new Error(String(queryState.error));
          await hooks.onLoadError(error, context);
        }
      } catch (error) {
        if (isConnectionError(error)) {
          console.warn(
            "[btst/media] route.loader() failed — no server running at build time. The media library does not support SSG."
          );
        }
        if (hooks?.onLoadError) {
          await hooks.onLoadError(error, context);
        }
      }
    }
  };
}
function createMediaLibraryMeta(config) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}/media`;
    const title = "Media Library";
    return [
      { title },
      { name: "title", content: title },
      { name: "description", content: "Manage your media assets" },
      { name: "robots", content: "noindex, nofollow" },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content: "Manage your media assets"
      },
      { property: "og:url", content: fullUrl },
      // Twitter
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title }
    ];
  };
}
var authViewPaths = {
  /** @default "callback" */
  CALLBACK: "callback",
  /** @default "email-otp" */
  EMAIL_OTP: "email-otp",
  /** @default "email-verification" */
  EMAIL_VERIFICATION: "email-verification",
  /** @default "forgot-password" */
  FORGOT_PASSWORD: "forgot-password",
  /** @default "magic-link" */
  MAGIC_LINK: "magic-link",
  /** @default "recover-account" */
  RECOVER_ACCOUNT: "recover-account",
  /** @default "reset-password" */
  RESET_PASSWORD: "reset-password",
  /** @default "sign-in" */
  SIGN_IN: "sign-in",
  /** @default "sign-out" */
  SIGN_OUT: "sign-out",
  /** @default "sign-up" */
  SIGN_UP: "sign-up",
  /** @default "two-factor" */
  TWO_FACTOR: "two-factor",
  /** @default "accept-invitation" */
  ACCEPT_INVITATION: "accept-invitation"
};
var accountViewPaths = {
  /** @default "settings" */
  SETTINGS: "settings",
  /** @default "security" */
  SECURITY: "security",
  /** @default "teams" */
  TEAMS: "teams",
  /** @default "api-keys" */
  API_KEYS: "api-keys",
  /** @default "organizations" */
  ORGANIZATIONS: "organizations"
};
var organizationViewPaths = {
  /** @default "settings" */
  SETTINGS: "settings",
  /** @default "members" */
  MEMBERS: "members",
  /** @default "teams" */
  TEAMS: "teams",
  /** @default "api-keys" */
  API_KEYS: "api-keys"
};
function definePlugin(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var accountClientPlugin = (config) => definePlugin({
  name: "account",
  routes: () => ({
    // Account views
    accountSettings: createRoute(
      `/account/${accountViewPaths.SETTINGS}`,
      () => {
        const AccountSettingsPage = lazy(
          () => import("./account-settings-page-TQ7GKK73-C2mf01U8.mjs").then((m2) => ({
            default: m2.AccountSettingsPage
          }))
        );
        return {
          PageComponent: AccountSettingsPage,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.SETTINGS}`,
            "Account Settings",
            "Manage your account settings"
          )
        };
      }
    ),
    accountSecurity: createRoute(
      `/account/${accountViewPaths.SECURITY}`,
      () => {
        const AccountSecurityPage = lazy(
          () => import("./account-security-page-VXPA2HTK-DU4lTrp5.mjs").then((m2) => ({
            default: m2.AccountSecurityPage
          }))
        );
        return {
          PageComponent: AccountSecurityPage,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.SECURITY}`,
            "Security",
            "Manage your security settings"
          )
        };
      }
    ),
    accountApiKeys: createRoute(
      `/account/${accountViewPaths.API_KEYS}`,
      () => {
        const AccountApiKeysPage = lazy(
          () => import("./account-api-keys-page-ML6QV7K4-CTtWy4vr.mjs").then((m2) => ({
            default: m2.AccountApiKeysPage
          }))
        );
        return {
          PageComponent: AccountApiKeysPage,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.API_KEYS}`,
            "API Keys",
            "Manage your API keys"
          )
        };
      }
    ),
    accountOrganizations: createRoute(
      `/account/${accountViewPaths.ORGANIZATIONS}`,
      () => {
        const AccountOrganizationsPage = lazy(
          () => import("./account-organizations-page-LO4AWXYO-B-E-he8B.mjs").then((m2) => ({
            default: m2.AccountOrganizationsPage
          }))
        );
        return {
          PageComponent: AccountOrganizationsPage,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.ORGANIZATIONS}`,
            "Organizations",
            "Manage your organizations"
          )
        };
      }
    ),
    accountTeams: createRoute(
      `/account/${accountViewPaths.TEAMS}`,
      () => {
        const AccountTeamsPage = lazy(
          () => import("./account-teams-page-YXHGA6DU-kExAgCNj.mjs").then((m2) => ({
            default: m2.AccountTeamsPage
          }))
        );
        return {
          PageComponent: AccountTeamsPage,
          meta: createAuthMeta(
            config,
            `/account/${accountViewPaths.TEAMS}`,
            "Teams",
            "Manage your team memberships"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [];
  }
});
function definePlugin2(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta2(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var authClientPlugin = (config) => definePlugin2({
  name: "auth",
  routes: () => ({
    signIn: createRoute(`/auth/${authViewPaths.SIGN_IN}`, () => {
      const SignInPage = lazy(
        () => import("./sign-in-page-5LRHUH6V-BmmNHJ6y.mjs").then(
          (m2) => ({
            default: m2.SignInPage
          })
        )
      );
      return {
        PageComponent: SignInPage,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.SIGN_IN}`,
          "Sign In",
          "Sign in to your account"
        )
      };
    }),
    signUp: createRoute(`/auth/${authViewPaths.SIGN_UP}`, () => {
      const SignUpPage = lazy(
        () => import("./sign-up-page-5PRZNHPF-0XXxteL7.mjs").then(
          (m2) => ({
            default: m2.SignUpPage
          })
        )
      );
      return {
        PageComponent: SignUpPage,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.SIGN_UP}`,
          "Sign Up",
          "Create a new account"
        )
      };
    }),
    forgotPassword: createRoute(
      `/auth/${authViewPaths.FORGOT_PASSWORD}`,
      () => {
        const ForgotPasswordPage = lazy(
          () => import("./forgot-password-page-QW45562I-DCWr_qlS.mjs").then((m2) => ({
            default: m2.ForgotPasswordPage
          }))
        );
        return {
          PageComponent: ForgotPasswordPage,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.FORGOT_PASSWORD}`,
            "Forgot Password",
            "Reset your password"
          )
        };
      }
    ),
    resetPassword: createRoute(
      `/auth/${authViewPaths.RESET_PASSWORD}`,
      () => {
        const ResetPasswordPage = lazy(
          () => import("./reset-password-page-LCLD4DOW-BUmvhAeS.mjs").then((m2) => ({
            default: m2.ResetPasswordPage
          }))
        );
        return {
          PageComponent: ResetPasswordPage,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.RESET_PASSWORD}`,
            "Reset Password",
            "Enter your new password"
          )
        };
      }
    ),
    magicLink: createRoute(`/auth/${authViewPaths.MAGIC_LINK}`, () => {
      const MagicLinkPage = lazy(
        () => import("./magic-link-page-5AKSRKRN-B_wsLwYq.mjs").then(
          (m2) => ({
            default: m2.MagicLinkPage
          })
        )
      );
      return {
        PageComponent: MagicLinkPage,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.MAGIC_LINK}`,
          "Magic Link",
          "Sign in with magic link"
        )
      };
    }),
    emailOtp: createRoute(`/auth/${authViewPaths.EMAIL_OTP}`, () => {
      const EmailOtpPage = lazy(
        () => import("./email-otp-page-C6PVS4I7-CVo6_bTh.mjs").then(
          (m2) => ({
            default: m2.EmailOtpPage
          })
        )
      );
      return {
        PageComponent: EmailOtpPage,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.EMAIL_OTP}`,
          "Email Code",
          "Sign in with email code"
        )
      };
    }),
    twoFactor: createRoute(`/auth/${authViewPaths.TWO_FACTOR}`, () => {
      const TwoFactorPage = lazy(
        () => import("./two-factor-page-G7UY27TG-I-xcbad2.mjs").then(
          (m2) => ({
            default: m2.TwoFactorPage
          })
        )
      );
      return {
        PageComponent: TwoFactorPage,
        meta: createAuthMeta2(
          config,
          `/auth/${authViewPaths.TWO_FACTOR}`,
          "Two-Factor Authentication",
          "Enter your verification code"
        )
      };
    }),
    recoverAccount: createRoute(
      `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
      () => {
        const RecoverAccountPage = lazy(
          () => import("./recover-account-page-YTEGVO7U-BF_KxRHj.mjs").then((m2) => ({
            default: m2.RecoverAccountPage
          }))
        );
        return {
          PageComponent: RecoverAccountPage,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.RECOVER_ACCOUNT}`,
            "Recover Account",
            "Recover your account with a backup code"
          )
        };
      }
    ),
    callback: createRoute(`/auth/${authViewPaths.CALLBACK}`, () => {
      const CallbackPage = lazy(
        () => import("./callback-page-TF3J2VMN-r60bGDjh.mjs").then(
          (m2) => ({
            default: m2.CallbackPage
          })
        )
      );
      return {
        PageComponent: CallbackPage
      };
    }),
    signOut: createRoute(`/auth/${authViewPaths.SIGN_OUT}`, () => {
      const SignOutPage = lazy(
        () => import("./sign-out-page-YWHTKNFE-QGnRx5uY.mjs").then(
          (m2) => ({
            default: m2.SignOutPage
          })
        )
      );
      return {
        PageComponent: SignOutPage
      };
    }),
    acceptInvitation: createRoute(
      `/auth/${authViewPaths.ACCEPT_INVITATION}`,
      () => {
        const AcceptInvitationPage = lazy(
          () => import("./accept-invitation-page-GMSN3A3H-BlYRnHZQ.mjs").then((m2) => ({
            default: m2.AcceptInvitationPage
          }))
        );
        return {
          PageComponent: AcceptInvitationPage
        };
      }
    ),
    emailVerification: createRoute(
      `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
      () => {
        const EmailVerificationPage = lazy(
          () => import("./email-verification-page-DSGCQ3FU-CnOuKHwB.mjs").then((m2) => ({
            default: m2.EmailVerificationPage
          }))
        );
        return {
          PageComponent: EmailVerificationPage,
          meta: createAuthMeta2(
            config,
            `/auth/${authViewPaths.EMAIL_VERIFICATION}`,
            "Email Verification",
            "Verify your email address"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.SIGN_IN}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.8
      },
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.SIGN_UP}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.8
      },
      {
        url: `${config.siteBaseURL}${config.siteBasePath}/auth/${authViewPaths.FORGOT_PASSWORD}`,
        lastModified: /* @__PURE__ */ new Date(),
        priority: 0.5
      }
    ];
  }
});
function definePlugin3(plugin) {
  return defineClientPlugin(plugin);
}
function createAuthMeta3(config, path, title, description) {
  return () => {
    const { siteBaseURL, siteBasePath } = config;
    const fullUrl = `${siteBaseURL}${siteBasePath}${path}`;
    return [
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: fullUrl },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description }
    ];
  };
}
var organizationClientPlugin = (config) => definePlugin3({
  name: "organization",
  routes: () => ({
    organizationSettings: createRoute(
      `/organization/${organizationViewPaths.SETTINGS}`,
      () => {
        const OrganizationSettingsPage = lazy(
          () => import("./organization-settings-page-DOCNYJET-xFcs_-do.mjs").then((m2) => ({
            default: m2.OrganizationSettingsPage
          }))
        );
        return {
          PageComponent: OrganizationSettingsPage,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.SETTINGS}`,
            "Organization Settings",
            "Manage your organization settings"
          )
        };
      }
    ),
    organizationMembers: createRoute(
      `/organization/${organizationViewPaths.MEMBERS}`,
      () => {
        const OrganizationMembersPage = lazy(
          () => import("./organization-members-page-2ZYAVV45-929yxGIc.mjs").then((m2) => ({
            default: m2.OrganizationMembersPage
          }))
        );
        return {
          PageComponent: OrganizationMembersPage,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.MEMBERS}`,
            "Organization Members",
            "Manage organization members"
          )
        };
      }
    ),
    organizationApiKeys: createRoute(
      `/organization/${organizationViewPaths.API_KEYS}`,
      () => {
        const OrganizationApiKeysPage = lazy(
          () => import("./organization-api-keys-page-4MEQXR25-36lqn3Ho.mjs").then((m2) => ({
            default: m2.OrganizationApiKeysPage
          }))
        );
        return {
          PageComponent: OrganizationApiKeysPage,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.API_KEYS}`,
            "Organization API Keys",
            "Manage organization API keys"
          )
        };
      }
    ),
    organizationTeams: createRoute(
      `/organization/${organizationViewPaths.TEAMS}`,
      () => {
        const OrganizationTeamsPage = lazy(
          () => import("./organization-teams-page-B3PZGE5L-X9slIoQD.mjs").then((m2) => ({
            default: m2.OrganizationTeamsPage
          }))
        );
        return {
          PageComponent: OrganizationTeamsPage,
          meta: createAuthMeta3(
            config,
            `/organization/${organizationViewPaths.TEAMS}`,
            "Organization Teams",
            "Manage organization teams"
          )
        };
      }
    )
  }),
  sitemap: async () => {
    return [];
  }
});
function extractPathParams(path) {
  const params = [];
  const segments = path.split("/");
  for (const segment of segments) {
    if (segment.startsWith(":")) {
      params.push(segment.slice(1));
    } else if (segment.startsWith("*:")) {
      params.push(segment.slice(2));
    } else if (segment === "*") {
      params.push("_");
    }
  }
  return params;
}
function getTypeFromZodType$1(zodType) {
  if (zodType instanceof ZodString) return "string";
  if (zodType instanceof ZodNumber) return "number";
  if (zodType instanceof ZodBoolean) return "boolean";
  if (zodType instanceof ZodArray) return "array";
  if (zodType instanceof ZodObject) return "object";
  if (zodType instanceof ZodEnum) return "enum";
  if (zodType instanceof ZodLiteral) return "literal";
  if (zodType instanceof ZodUnion) return "union";
  const type = zodType.type;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "array") return "array";
  if (type === "object") return "object";
  return "string";
}
function processZodType$1(zodType) {
  if (zodType instanceof ZodOptional) {
    const innerType = zodType._def?.innerType || zodType.unwrap?.();
    if (innerType) {
      return processZodType$1(innerType);
    }
  }
  if (zodType instanceof ZodNullable) {
    const innerType = zodType._def?.innerType || zodType.unwrap?.();
    if (innerType) {
      const innerSchema = processZodType$1(innerType);
      return {
        ...innerSchema,
        nullable: true
      };
    }
  }
  if (zodType instanceof ZodDefault) {
    const innerType = zodType._def?.innerType;
    const rawDefault = zodType._def?.defaultValue;
    const defaultValue = typeof rawDefault === "function" ? rawDefault() : rawDefault;
    if (innerType) {
      const innerSchema = processZodType$1(innerType);
      if (defaultValue !== void 0) {
        return {
          ...innerSchema,
          default: defaultValue
        };
      }
      return innerSchema;
    }
  }
  if (zodType instanceof ZodObject) {
    const shape = zodType.shape || zodType._def?.shape?.();
    if (shape) {
      const properties = {};
      const required = [];
      for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZodType) {
          properties[key] = processZodType$1(value);
          if (!(value instanceof ZodOptional)) {
            required.push(key);
          }
        }
      }
      return {
        type: "object",
        properties,
        ...required.length > 0 ? { required } : {}
      };
    }
  }
  if (zodType instanceof ZodArray) {
    const elementType = zodType._def?.type || zodType.element;
    return {
      type: "array",
      items: elementType ? processZodType$1(elementType) : { type: "string" }
    };
  }
  if (zodType instanceof ZodEnum) {
    const values = zodType._def?.values || zodType.options;
    return {
      type: "string",
      enum: values
    };
  }
  if (zodType instanceof ZodLiteral) {
    const value = zodType._def?.value || zodType.value;
    return {
      type: typeof value,
      const: value
    };
  }
  if (zodType instanceof ZodUnion) {
    const options = zodType._def?.options || zodType.options;
    if (options && Array.isArray(options)) {
      return {
        oneOf: options.map((opt) => processZodType$1(opt))
      };
    }
  }
  if (zodType._def?.coerce) {
    const innerType = zodType._def?.innerType;
    if (innerType) {
      return processZodType$1(innerType);
    }
  }
  return {
    type: getTypeFromZodType$1(zodType)
  };
}
function isStandardSchema(obj) {
  return obj && typeof obj === "object" && "~standard" in obj;
}
function extractQueryParams(querySchema) {
  const params = [];
  if (!querySchema) return params;
  if (querySchema instanceof ZodObject) {
    const shape = querySchema.shape || querySchema._def?.shape?.();
    if (shape) {
      for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZodType) {
          params.push({
            name: key,
            type: getTypeFromZodType$1(value),
            required: !(value instanceof ZodOptional),
            schema: processZodType$1(value)
          });
        }
      }
    }
  } else if (isStandardSchema(querySchema)) {
    const zodSchema = querySchema;
    if (zodSchema instanceof ZodObject) {
      return extractQueryParams(zodSchema);
    }
  }
  return params;
}
async function fetchAllSitemapEntries(context) {
  const allEntries = [];
  for (const [pluginKey, plugin] of Object.entries(context.plugins)) {
    if (pluginKey === "routeDocs" || plugin.name === "route-docs") {
      continue;
    }
    if (plugin.sitemap) {
      try {
        const entries = await plugin.sitemap();
        for (const entry of entries) {
          allEntries.push({
            ...entry,
            pluginKey
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch sitemap for plugin ${pluginKey}:`, error);
      }
    }
  }
  return allEntries;
}
function generateRouteDocsSchema(context, sitemapEntries = []) {
  const documentedPlugins = [];
  const sitemapByPlugin = {};
  for (const entry of sitemapEntries) {
    if (!sitemapByPlugin[entry.pluginKey]) {
      sitemapByPlugin[entry.pluginKey] = [];
    }
    sitemapByPlugin[entry.pluginKey].push(entry);
  }
  for (const [pluginKey, plugin] of Object.entries(context.plugins)) {
    if (pluginKey === "routeDocs" || plugin.name === "route-docs") {
      continue;
    }
    const pluginRoutes = plugin.routes(context);
    const documentedRoutes = [];
    for (const [routeKey, route] of Object.entries(pluginRoutes)) {
      const r = route;
      const path = r.path;
      const routeOptions = r.options || {};
      const routeMeta = r.meta;
      if (!path) continue;
      const pathParamNames = extractPathParams(path);
      const pathParams = pathParamNames.map((name) => ({
        name,
        type: "string",
        // Path params are always strings
        required: true
      }));
      const queryParams = extractQueryParams(routeOptions.query);
      documentedRoutes.push({
        key: routeKey,
        path,
        pathParams,
        queryParams,
        meta: routeMeta
      });
    }
    if (documentedRoutes.length > 0) {
      documentedPlugins.push({
        key: pluginKey,
        name: plugin.name,
        routes: documentedRoutes,
        sitemapEntries: sitemapByPlugin[pluginKey] || []
      });
    }
  }
  return {
    plugins: documentedPlugins,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    allSitemapEntries: sitemapEntries
  };
}
const DocsPageComponent = lazy(
  () => import("./docs-page-eiG41Qll.mjs").then((m2) => ({
    default: m2.DocsPageComponent
  }))
);
const DocsPageSkeleton = lazy(
  () => import("./docs-skeleton-aFTNiYxZ.mjs").then((m2) => ({
    default: m2.DocsPageSkeleton
  }))
);
const ROUTE_DOCS_QUERY_KEY = ["route-docs", "schema"];
let moduleStoredContext = null;
async function generateSchema() {
  if (!moduleStoredContext) {
    return {
      plugins: [],
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      allSitemapEntries: []
    };
  }
  try {
    const sitemapEntries = await fetchAllSitemapEntries(moduleStoredContext);
    return generateRouteDocsSchema(moduleStoredContext, sitemapEntries);
  } catch (error) {
    console.warn("Failed to generate route docs schema:", error);
    return generateRouteDocsSchema(moduleStoredContext, []);
  }
}
function createDocsMeta(config) {
  return () => {
    const title = config.title || "Route Documentation";
    return [
      { title },
      { name: "title", content: title },
      { name: "robots", content: "noindex" }
    ];
  };
}
function DocsErrorComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-destructive mb-2", children: "Error Loading Documentation" }),
    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "An error occurred while loading the documentation." })
  ] }) });
}
function createRouteDocsLoader(config) {
  return async () => {
    if (typeof window === "undefined" && moduleStoredContext) {
      const { queryClient } = config;
      try {
        const sitemapEntries = await fetchAllSitemapEntries(moduleStoredContext);
        const schema2 = generateRouteDocsSchema(
          moduleStoredContext,
          sitemapEntries
        );
        queryClient.setQueryData(ROUTE_DOCS_QUERY_KEY, schema2);
      } catch (error) {
        console.warn("Failed to load route docs schema:", error);
        queryClient.setQueryData(ROUTE_DOCS_QUERY_KEY, {
          plugins: [],
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          allSitemapEntries: []
        });
      }
    }
  };
}
const routeDocsClientPlugin = (config) => {
  return defineClientPlugin({
    name: "route-docs",
    routes: (context) => {
      moduleStoredContext = context || null;
      return {
        docs: createRoute("/route-docs", () => {
          return {
            PageComponent: () => /* @__PURE__ */ jsx(
              DocsPageComponent,
              {
                title: config.title,
                description: config.description,
                siteBasePath: config.siteBasePath || "/pages"
              }
            ),
            LoadingComponent: () => /* @__PURE__ */ jsx(DocsPageSkeleton, {}),
            ErrorComponent: () => /* @__PURE__ */ jsx(DocsErrorComponent, {}),
            loader: createRouteDocsLoader(config),
            meta: createDocsMeta(config)
          };
        })
      };
    },
    sitemap: async () => {
      return [];
    }
  });
};
function getStackClient(queryClient) {
  const baseURL = getBaseURL();
  return createStackClient({
    plugins: {
      blog: blogClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      cms: cmsClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        queryClient
      }),
      formBuilder: formBuilderClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        queryClient
      }),
      uiBuilder: uiBuilderClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        queryClient
      }),
      kanban: kanbanClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      comments: commentsClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      media: mediaClientPlugin({
        apiBaseURL: baseURL,
        apiBasePath: "/api/data",
        siteBaseURL: baseURL,
        siteBasePath: "/pages",
        queryClient
      }),
      auth: authClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      account: accountClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      organization: organizationClientPlugin({
        siteBaseURL: baseURL,
        siteBasePath: "/pages"
      }),
      routeDocs: routeDocsClientPlugin({
        queryClient,
        siteBasePath: "/pages"
      })
    }
  });
}
function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.BTST_SITE_URL) return process.env.BTST_SITE_URL;
  if (process.env.VITE_PUBLIC_SITE_URL) return process.env.VITE_PUBLIC_SITE_URL;
  if (process.env.BASE_URL) return process.env.BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
const Route$9 = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const queryClient = new QueryClient();
        const lib = getStackClient(queryClient);
        const entries = await lib.generateSitemap();
        const xml = sitemapEntryToXmlString(entries);
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
          }
        });
      }
    }
  }
});
function stack(config) {
  const { plugins, adapter, dbSchema, basePath } = config;
  const allRoutes = {};
  let betterDbSchema = dbSchema ?? defineDb({});
  for (const [pluginKey, plugin] of Object.entries(plugins)) {
    betterDbSchema = betterDbSchema.use(plugin.dbPlugin);
  }
  const adapterInstance = adapter(betterDbSchema);
  const context = {
    plugins,
    basePath,
    adapter: adapterInstance
  };
  for (const [pluginKey, plugin] of Object.entries(plugins)) {
    const pluginRoutes = plugin.routes(adapterInstance, context);
    for (const [routeKey, endpoint] of Object.entries(pluginRoutes)) {
      const compositeKey = `${pluginKey}_${routeKey}`;
      allRoutes[compositeKey] = endpoint;
    }
  }
  const pluginApis = {};
  for (const [pluginKey, plugin] of Object.entries(plugins)) {
    if (plugin.api) {
      pluginApis[pluginKey] = plugin.api(adapterInstance);
    }
  }
  const router2 = createRouter$1(allRoutes, {
    basePath
  });
  return {
    handler: router2.handler,
    router: router2,
    dbSchema: betterDbSchema,
    adapter: adapterInstance,
    api: pluginApis
  };
}
function defineBackendPlugin(plugin) {
  return plugin;
}
const blogSchema = createDbPlugin("blog", {
  post: {
    modelName: "post",
    fields: {
      title: {
        type: "string",
        required: true
      },
      content: {
        type: "string",
        required: true
      },
      excerpt: {
        type: "string",
        defaultValue: ""
      },
      slug: {
        type: "string",
        required: true,
        unique: true
      },
      image: {
        type: "string",
        required: false
      },
      published: {
        type: "boolean",
        defaultValue: false
      },
      publishedAt: {
        type: "date",
        required: false
      },
      authorId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  tag: {
    modelName: "tag",
    fields: {
      name: {
        type: "string",
        required: true,
        unique: true
      },
      slug: {
        type: "string",
        required: true,
        unique: true
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  postTag: {
    modelName: "postTag",
    fields: {
      postId: {
        type: "string",
        required: true,
        references: {
          model: "post",
          field: "id",
          onDelete: "cascade"
        }
      },
      tagId: {
        type: "string",
        required: true,
        references: {
          model: "tag",
          field: "id",
          onDelete: "cascade"
        }
      }
    }
  }
});
function slugify$3(text2, locale = "en") {
  return slug(text2, { lower: true, locale });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function throttle(callback, waitMs) {
  let timerId = null;
  let lastInvokeTime = 0;
  let trailingArgs = null;
  const invoke = (args) => {
    lastInvokeTime = Date.now();
    callback(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const remaining = waitMs - (now - lastInvokeTime);
    if (lastInvokeTime === 0) {
      invoke(args);
      return;
    }
    if (remaining <= 0 || remaining > waitMs) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      invoke(args);
    } else {
      trailingArgs = args;
      if (!timerId) {
        timerId = setTimeout(() => {
          timerId = null;
          if (trailingArgs) {
            invoke(trailingArgs);
            trailingArgs = null;
          }
        }, remaining);
      }
    }
  };
  throttled.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    trailingArgs = null;
    lastInvokeTime = 0;
  };
  throttled.flush = () => {
    if (timerId && trailingArgs) {
      clearTimeout(timerId);
      timerId = null;
      invoke(trailingArgs);
      trailingArgs = null;
    }
  };
  return throttled;
}
function stripHtml(html) {
  let text2 = html.replace(/<[^>]*>/g, "");
  text2 = text2.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/").replace(/&nbsp;/g, " ").replace(/&hellip;/g, "...");
  return text2.replace(/\s+/g, " ").trim();
}
function stripMarkdown(markdown) {
  let text2 = markdown;
  text2 = text2.replace(/^#{1,6}\s+/gm, "");
  text2 = text2.replace(/\*\*([^*]+)\*\*/g, "$1");
  text2 = text2.replace(/\*([^*]+)\*/g, "$1");
  text2 = text2.replace(/__([^_]+)__/g, "$1");
  text2 = text2.replace(/_([^_]+)_/g, "$1");
  text2 = text2.replace(/~~([^~]+)~~/g, "$1");
  text2 = text2.replace(/`([^`]+)`/g, "$1");
  text2 = text2.replace(/```[\s\S]*?```/g, "");
  text2 = text2.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text2 = text2.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  text2 = text2.replace(/^>\s+/gm, "");
  text2 = text2.replace(/^[-*]{3,}$/gm, "");
  text2 = text2.replace(/^[\s]*[-*+]\s+/gm, "");
  text2 = text2.replace(/^[\s]*\d+\.\s+/gm, "");
  return text2.replace(/\n\s*\n/g, "\n").replace(/\s+/g, " ").trim();
}
const dateFields = {
  publishedAt: date().optional(),
  createdAt: date().optional(),
  updatedAt: date().optional()
};
const coreFields = {
  title: string().min(1, "Title is required"),
  content: string().min(1, "Content is required"),
  excerpt: string().min(1, "Excerpt is required"),
  image: string().optional(),
  published: boolean().optional().default(false),
  slug: string().min(1, "Slug is required"),
  tags: array(
    union([
      object({ name: string() }),
      object({ id: string(), name: string(), slug: string() })
    ])
  ).optional().default([])
};
const PostDomainSchema = object({
  id: string().optional(),
  ...coreFields,
  ...dateFields
});
const createPostSchema = PostDomainSchema.extend({
  slug: PostDomainSchema.shape.slug.optional()
}).omit({ id: true });
const updatePostSchema = PostDomainSchema.extend({
  id: string()
  // required on update
});
async function getAllPosts(adapter, params) {
  const query = params ?? {};
  const whereConditions = [];
  if (query.tagSlug) {
    const tag2 = await adapter.findOne({
      model: "tag",
      where: [{ field: "slug", value: query.tagSlug, operator: "eq" }]
    });
    if (!tag2) {
      return { items: [], total: 0, limit: query.limit, offset: query.offset };
    }
    const postTags = await adapter.findMany({
      model: "postTag",
      where: [{ field: "tagId", value: tag2.id, operator: "eq" }]
    });
    const taggedPostIds = postTags.map((pt) => pt.postId);
    if (taggedPostIds.length === 0) {
      return { items: [], total: 0, limit: query.limit, offset: query.offset };
    }
    whereConditions.push({
      field: "id",
      value: taggedPostIds,
      operator: "in"
    });
  }
  if (query.published !== void 0) {
    whereConditions.push({
      field: "published",
      value: query.published,
      operator: "eq"
    });
  }
  if (query.slug) {
    whereConditions.push({
      field: "slug",
      value: query.slug,
      operator: "eq"
    });
  }
  const needsInMemoryFilter = !!query.query;
  const dbWhere = whereConditions.length > 0 ? whereConditions : void 0;
  const dbTotal = !needsInMemoryFilter ? await adapter.count({ model: "post", where: dbWhere }) : void 0;
  const posts = await adapter.findMany({
    model: "post",
    limit: !needsInMemoryFilter ? query.limit : void 0,
    offset: !needsInMemoryFilter ? query.offset : void 0,
    where: dbWhere,
    sortBy: { field: "createdAt", direction: "desc" },
    join: { postTag: true }
  });
  const tagIds = /* @__PURE__ */ new Set();
  for (const post2 of posts) {
    if (post2.postTag) {
      for (const pt of post2.postTag) {
        tagIds.add(pt.tagId);
      }
    }
  }
  const tags = tagIds.size > 0 ? await adapter.findMany({
    model: "tag",
    where: [
      {
        field: "id",
        value: Array.from(tagIds),
        operator: "in"
      }
    ]
  }) : [];
  const tagMap = new Map(tags.map((t) => [t.id, t]));
  let result = posts.map((post2) => {
    const postTags = (post2.postTag || []).map((pt) => {
      const tag2 = tagMap.get(pt.tagId);
      return tag2 ? { ...tag2 } : void 0;
    }).filter((tag2) => tag2 !== void 0);
    const { postTag: _, ...postWithoutJoin } = post2;
    return { ...postWithoutJoin, tags: postTags };
  });
  if (query.query) {
    const searchLower = query.query.toLowerCase();
    result = result.filter(
      (post2) => post2.title?.toLowerCase().includes(searchLower) || post2.content?.toLowerCase().includes(searchLower) || post2.excerpt?.toLowerCase().includes(searchLower)
    );
  }
  if (needsInMemoryFilter) {
    const total = result.length;
    const offset = query.offset ?? 0;
    const limit = query.limit;
    result = result.slice(
      offset,
      limit !== void 0 ? offset + limit : void 0
    );
    return { items: result, total, limit: query.limit, offset: query.offset };
  }
  return {
    items: result,
    total: dbTotal ?? result.length,
    limit: query.limit,
    offset: query.offset
  };
}
async function getPostBySlug(adapter, slug2) {
  const posts = await adapter.findMany({
    model: "post",
    where: [{ field: "slug", value: slug2, operator: "eq" }],
    limit: 1,
    join: { postTag: true }
  });
  if (posts.length === 0) return null;
  const post2 = posts[0];
  const tagIds = (post2.postTag || []).map((pt) => pt.tagId);
  const tags = tagIds.length > 0 ? await adapter.findMany({
    model: "tag",
    where: [{ field: "id", value: tagIds, operator: "in" }]
  }) : [];
  const tagMap = new Map(tags.map((t) => [t.id, t]));
  const resolvedTags = (post2.postTag || []).map((pt) => tagMap.get(pt.tagId)).filter((t) => t !== void 0);
  const { postTag: _, ...postWithoutJoin } = post2;
  return { ...postWithoutJoin, tags: resolvedTags };
}
async function getAllTags(adapter) {
  return adapter.findMany({
    model: "tag",
    sortBy: { field: "name", direction: "asc" }
  });
}
async function findOrCreateTags(adapter, tagInputs) {
  if (tagInputs.length === 0) return [];
  const normalizeTagName = (name) => name.trim();
  const tagsWithIds = [];
  const tagsToFindOrCreate = [];
  for (const tagInput of tagInputs) {
    if ("id" in tagInput && tagInput.id) {
      tagsWithIds.push({
        id: tagInput.id,
        name: normalizeTagName(tagInput.name),
        slug: tagInput.slug,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
    } else {
      tagsToFindOrCreate.push({ name: normalizeTagName(tagInput.name) });
    }
  }
  if (tagsToFindOrCreate.length === 0) {
    return tagsWithIds;
  }
  const allTags = await adapter.findMany({ model: "tag" });
  const tagMapBySlug = /* @__PURE__ */ new Map();
  for (const tag2 of allTags) {
    tagMapBySlug.set(tag2.slug, tag2);
  }
  const tagSlugs = tagsToFindOrCreate.map((tag2) => slugify$3(tag2.name));
  const foundTags = [];
  for (const slug2 of tagSlugs) {
    const tag2 = tagMapBySlug.get(slug2);
    if (tag2) {
      foundTags.push(tag2);
    }
  }
  const existingSlugs = /* @__PURE__ */ new Set([
    ...tagsWithIds.map((tag2) => tag2.slug),
    ...foundTags.map((tag2) => tag2.slug)
  ]);
  const tagsToCreate = tagsToFindOrCreate.filter(
    (tag2) => !existingSlugs.has(slugify$3(tag2.name))
  );
  const createdTags = [];
  for (const tag2 of tagsToCreate) {
    const normalizedName = normalizeTagName(tag2.name);
    const newTag = await adapter.create({
      model: "tag",
      data: {
        name: normalizedName,
        slug: slugify$3(normalizedName),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    createdTags.push(newTag);
  }
  return [...tagsWithIds, ...foundTags, ...createdTags];
}
async function createPost(adapter, input) {
  const { tags: tagInputs, ...postData } = input;
  const tagList = tagInputs ?? [];
  const newPost = await adapter.create({
    model: "post",
    data: {
      ...postData,
      published: postData.published ?? false,
      tags: [],
      createdAt: postData.createdAt ?? /* @__PURE__ */ new Date(),
      updatedAt: postData.updatedAt ?? /* @__PURE__ */ new Date()
    }
  });
  if (tagList.length > 0) {
    const resolvedTags = await findOrCreateTags(adapter, tagList);
    await adapter.transaction(async (tx) => {
      for (const tag2 of resolvedTags) {
        await tx.create({
          model: "postTag",
          data: {
            postId: newPost.id,
            tagId: tag2.id
          }
        });
      }
    });
    newPost.tags = resolvedTags.map((tag2) => ({ ...tag2 }));
  } else {
    newPost.tags = [];
  }
  return newPost;
}
async function updatePost(adapter, id, input) {
  const { tags: tagInputs, ...postData } = input;
  return adapter.transaction(async (tx) => {
    const updatedPost = await tx.update({
      model: "post",
      where: [{ field: "id", value: id }],
      update: {
        ...postData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    if (!updatedPost) return null;
    if (tagInputs !== void 0) {
      const existingPostTags = await tx.findMany({
        model: "postTag",
        where: [{ field: "postId", value: id, operator: "eq" }]
      });
      for (const postTag2 of existingPostTags) {
        await tx.delete({
          model: "postTag",
          where: [
            {
              field: "postId",
              value: postTag2.postId,
              operator: "eq"
            },
            {
              field: "tagId",
              value: postTag2.tagId,
              operator: "eq"
            }
          ]
        });
      }
      if (tagInputs.length > 0) {
        const resolvedTags = await findOrCreateTags(adapter, tagInputs);
        for (const tag2 of resolvedTags) {
          await tx.create({
            model: "postTag",
            data: {
              postId: id,
              tagId: tag2.id
            }
          });
        }
        updatedPost.tags = resolvedTags.map((tag2) => ({ ...tag2 }));
      } else {
        updatedPost.tags = [];
      }
    } else {
      const existingPostTags = await tx.findMany({
        model: "postTag",
        where: [{ field: "postId", value: id, operator: "eq" }]
      });
      if (existingPostTags.length > 0) {
        const tagIds = existingPostTags.map((pt) => pt.tagId);
        const tags = await tx.findMany({
          model: "tag"
        });
        updatedPost.tags = tags.filter((tag2) => tagIds.includes(tag2.id)).map((tag2) => ({ ...tag2 }));
      } else {
        updatedPost.tags = [];
      }
    }
    return updatedPost;
  });
}
async function deletePost(adapter, id) {
  await adapter.delete({
    model: "post",
    where: [{ field: "id", value: id }]
  });
}
function serializeTag(tag2) {
  return {
    ...tag2,
    createdAt: tag2.createdAt.toISOString(),
    updatedAt: tag2.updatedAt.toISOString()
  };
}
function serializePost(post2) {
  return {
    ...post2,
    createdAt: post2.createdAt.toISOString(),
    updatedAt: post2.updatedAt.toISOString(),
    publishedAt: post2.publishedAt?.toISOString(),
    tags: post2.tags.map(serializeTag)
  };
}
function createBlogPrefetchForRoute(adapter) {
  return async function prefetchForRoute(key, qc, params) {
    switch (key) {
      case "posts":
      case "drafts": {
        const published = key === "posts";
        const [result, tags] = await Promise.all([
          getAllPosts(adapter, { published, limit: 10 }),
          getAllTags(adapter)
        ]);
        qc.setQueryData(BLOG_QUERY_KEYS.postsList({ published, limit: 10 }), {
          pages: [result.items.map(serializePost)],
          pageParams: [0]
        });
        qc.setQueryData(BLOG_QUERY_KEYS.tagsList(), tags.map(serializeTag));
        break;
      }
      case "post":
      case "editPost": {
        const slug2 = params?.slug ?? "";
        if (slug2) {
          const post2 = await getPostBySlug(adapter, slug2);
          qc.setQueryData(
            BLOG_QUERY_KEYS.postDetail(slug2),
            post2 ? serializePost(post2) : null
          );
        }
        break;
      }
      case "tag": {
        const tagSlug = params?.tagSlug ?? "";
        const [result, tags] = await Promise.all([
          getAllPosts(adapter, { published: true, limit: 10, tagSlug }),
          getAllTags(adapter)
        ]);
        qc.setQueryData(
          BLOG_QUERY_KEYS.postsList({ published: true, limit: 10, tagSlug }),
          {
            pages: [result.items.map(serializePost)],
            pageParams: [0]
          }
        );
        qc.setQueryData(BLOG_QUERY_KEYS.tagsList(), tags.map(serializeTag));
        break;
      }
    }
  };
}
const PostListQuerySchema = object({
  slug: string().optional(),
  tagSlug: string().optional(),
  offset: number().int().min(0).optional(),
  limit: number().int().min(1).max(100).optional(),
  query: string().optional(),
  published: string().optional().transform((val) => {
    if (val === void 0) return void 0;
    if (val === "true") return true;
    if (val === "false") return false;
    return void 0;
  })
});
const NextPreviousPostsQuerySchema = object({
  date: date()
});
const blogBackendPlugin = (hooks) => defineBackendPlugin({
  name: "blog",
  dbPlugin: blogSchema,
  api: (adapter) => ({
    getAllPosts: (params) => getAllPosts(adapter, params),
    getPostBySlug: (slug2) => getPostBySlug(adapter, slug2),
    getAllTags: () => getAllTags(adapter),
    prefetchForRoute: createBlogPrefetchForRoute(adapter),
    // Mutations
    createPost: (input) => createPost(adapter, input),
    updatePost: (id, input) => updatePost(adapter, id, input),
    deletePost: (id) => deletePost(adapter, id)
  }),
  routes: (adapter) => {
    const listPosts = createEndpoint(
      "/posts",
      {
        method: "GET",
        query: PostListQuerySchema
      },
      async (ctx) => {
        const { query, headers } = ctx;
        try {
          if (hooks?.onBeforeListPosts) ;
          const result = await getAllPosts(adapter, query);
          if (hooks?.onPostsRead) ;
          return result;
        } catch (error) {
          throw error;
        }
      }
    );
    const createPost$1 = createEndpoint(
      "/posts",
      {
        method: "POST",
        body: createPostSchema
      },
      async (ctx) => {
        ({
          body: ctx.body,
          headers: ctx.headers
        });
        try {
          if (hooks?.onBeforeCreatePost) ;
          const {
            tags,
            slug: rawSlug,
            createdAt: _ca,
            updatedAt: _ua,
            ...postData
          } = ctx.body;
          const slug2 = slugify$3(rawSlug || postData.title);
          if (!slug2) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          const newPost = await createPost(adapter, {
            ...postData,
            slug: slug2,
            tags: tags ?? [],
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
          if (hooks?.onPostCreated) ;
          return newPost;
        } catch (error) {
          throw error;
        }
      }
    );
    const updatePost$1 = createEndpoint(
      "/posts/:id",
      {
        method: "PUT",
        body: updatePostSchema
      },
      async (ctx) => {
        ({
          body: ctx.body,
          params: ctx.params,
          headers: ctx.headers
        });
        try {
          if (hooks?.onBeforeUpdatePost) ;
          const {
            tags,
            slug: rawSlug,
            createdAt: _ca,
            updatedAt: _ua,
            ...restPostData
          } = ctx.body;
          const slugified = rawSlug ? slugify$3(rawSlug) : void 0;
          if (rawSlug && !slugified) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          const updated = await updatePost(adapter, ctx.params.id, {
            ...restPostData,
            ...slugified ? { slug: slugified } : {},
            tags: tags ?? []
          });
          if (!updated) {
            throw ctx.error(404, { message: "Post not found" });
          }
          if (hooks?.onPostUpdated) ;
          return updated;
        } catch (error) {
          throw error;
        }
      }
    );
    const deletePost$1 = createEndpoint(
      "/posts/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        ({
          params: ctx.params,
          headers: ctx.headers
        });
        try {
          if (hooks?.onBeforeDeletePost) ;
          await deletePost(adapter, ctx.params.id);
          if (hooks?.onPostDeleted) ;
          return { success: true };
        } catch (error) {
          throw error;
        }
      }
    );
    const getNextPreviousPosts = createEndpoint(
      "/posts/next-previous",
      {
        method: "GET",
        query: NextPreviousPostsQuerySchema
      },
      async (ctx) => {
        const { query, headers } = ctx;
        try {
          if (hooks?.onBeforeListPosts) ;
          const date2 = query.date;
          const previousPosts = await adapter.findMany({
            model: "post",
            limit: 1,
            where: [
              {
                field: "createdAt",
                value: date2,
                operator: "lt"
              },
              {
                field: "published",
                value: true,
                operator: "eq"
              }
            ],
            sortBy: {
              field: "createdAt",
              direction: "desc"
            },
            join: {
              postTag: true
            }
          });
          const nextPosts = await adapter.findMany({
            model: "post",
            limit: 1,
            where: [
              {
                field: "createdAt",
                value: date2,
                operator: "gt"
              },
              {
                field: "published",
                value: true,
                operator: "eq"
              }
            ],
            sortBy: {
              field: "createdAt",
              direction: "asc"
            },
            join: {
              postTag: true
            }
          });
          const tagIds = /* @__PURE__ */ new Set();
          const allPosts = [...previousPosts, ...nextPosts];
          for (const post2 of allPosts) {
            if (post2.postTag) {
              for (const pt of post2.postTag) {
                tagIds.add(pt.tagId);
              }
            }
          }
          const tagMap = /* @__PURE__ */ new Map();
          if (tagIds.size > 0) {
            const tags = await adapter.findMany({
              model: "tag"
            });
            for (const tag2 of tags) {
              if (tagIds.has(tag2.id)) {
                tagMap.set(tag2.id, tag2);
              }
            }
          }
          const mapPostWithTags = (post2) => {
            const tags = (post2.postTag || []).map((pt) => {
              const tag2 = tagMap.get(pt.tagId);
              return tag2 ? { ...tag2 } : void 0;
            }).filter((tag2) => tag2 !== void 0);
            const { postTag: _, ...postWithoutJoin } = post2;
            return {
              ...postWithoutJoin,
              tags
            };
          };
          return {
            previous: previousPosts[0] ? mapPostWithTags(previousPosts[0]) : null,
            next: nextPosts[0] ? mapPostWithTags(nextPosts[0]) : null
          };
        } catch (error) {
          throw error;
        }
      }
    );
    const listTags = createEndpoint(
      "/tags",
      {
        method: "GET"
      },
      async () => {
        return await getAllTags(adapter);
      }
    );
    return {
      listPosts,
      createPost: createPost$1,
      updatePost: updatePost$1,
      deletePost: deletePost$1,
      getNextPreviousPosts,
      listTags
    };
  }
});
const cmsSchema = createDbPlugin("cms", {
  contentType: {
    modelName: "contentType",
    fields: {
      name: {
        type: "string",
        required: true
      },
      slug: {
        type: "string",
        required: true,
        unique: true
      },
      description: {
        type: "string",
        required: false
      },
      jsonSchema: {
        type: "string",
        required: true
      },
      fieldConfig: {
        type: "string",
        required: false
      },
      autoFormVersion: {
        type: "number",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  contentItem: {
    modelName: "contentItem",
    fields: {
      contentTypeId: {
        type: "string",
        required: true,
        references: {
          model: "contentType",
          field: "id",
          onDelete: "cascade"
        }
      },
      slug: {
        type: "string",
        required: true
      },
      data: {
        type: "string",
        required: true
      },
      authorId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  /**
   * Junction table for content item relationships
   * Stores many-to-many and one-to-many relations between content items
   */
  contentRelation: {
    modelName: "contentRelation",
    fields: {
      /** The content item that has the relation field */
      sourceId: {
        type: "string",
        required: true,
        references: {
          model: "contentItem",
          field: "id",
          onDelete: "cascade"
        }
      },
      /** The content item being referenced */
      targetId: {
        type: "string",
        required: true,
        references: {
          model: "contentItem",
          field: "id",
          onDelete: "cascade"
        }
      },
      /** The field name in the source content type schema (e.g., "categoryIds") */
      fieldName: {
        type: "string",
        required: true
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  }
});
const DEFAULT_MAX_PAGE_SIZE = 1e3;
function createListContentQuerySchema(maxPageSize = DEFAULT_MAX_PAGE_SIZE) {
  return object({
    slug: string().optional(),
    limit: number().min(1).max(maxPageSize).optional().default(20),
    offset: number().min(0).optional().default(0)
  });
}
createListContentQuerySchema();
object({
  slug: string().min(1, "Slug is required"),
  // Use passthrough object instead of z.record(z.unknown()) due to Zod v4 bug
  data: object({}).passthrough()
});
object({
  slug: string().min(1, "Slug is required").optional(),
  // Use passthrough object instead of z.record(z.unknown()) due to Zod v4 bug
  data: object({}).passthrough().optional()
});
const contentTypeResponseSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  description: string().nullable().optional(),
  jsonSchema: string(),
  createdAt: string(),
  updatedAt: string()
});
const contentItemResponseSchema = object({
  id: string(),
  contentTypeId: string(),
  slug: string(),
  data: string(),
  authorId: string().nullable().optional(),
  createdAt: string(),
  updatedAt: string()
});
const contentItemWithDataResponseSchema = contentItemResponseSchema.extend({
  // Use passthrough object instead of z.record(z.unknown()) due to Zod v4 bug
  parsedData: object({}).passthrough(),
  contentType: contentTypeResponseSchema.optional()
});
object({
  items: array(contentItemWithDataResponseSchema),
  total: number$1(),
  limit: number$1(),
  offset: number$1()
});
function slugify$2(text2, locale = "en") {
  return slug(text2, { lower: true, locale });
}
function serializeContentType(ct) {
  const needsMigration = !ct.autoFormVersion || ct.autoFormVersion < 2;
  const migratedJsonSchema = needsMigration ? migrateToUnifiedSchema(ct.jsonSchema, ct.fieldConfig) : ct.jsonSchema;
  return {
    id: ct.id,
    name: ct.name,
    slug: ct.slug,
    description: ct.description,
    jsonSchema: migratedJsonSchema,
    createdAt: ct.createdAt.toISOString(),
    updatedAt: ct.updatedAt.toISOString()
  };
}
function migrateToUnifiedSchema(jsonSchemaStr, fieldConfigStr) {
  if (!fieldConfigStr) return jsonSchemaStr;
  try {
    const jsonSchema = JSON.parse(jsonSchemaStr);
    const fieldConfig = JSON.parse(fieldConfigStr);
    if (!jsonSchema.properties || typeof fieldConfig !== "object") {
      return jsonSchemaStr;
    }
    for (const [key, config] of Object.entries(fieldConfig)) {
      if (jsonSchema.properties[key] && typeof config === "object" && config !== null && "fieldType" in config) {
        jsonSchema.properties[key].fieldType = config.fieldType;
      }
    }
    return JSON.stringify(jsonSchema);
  } catch {
    return jsonSchemaStr;
  }
}
function serializeContentItem(item) {
  return {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  };
}
function serializeContentItemWithType(item) {
  const parsedData = JSON.parse(item.data);
  return {
    ...serializeContentItem(item),
    parsedData,
    contentType: item.contentType ? serializeContentType(item.contentType) : void 0
  };
}
async function getAllContentTypes(adapter) {
  const contentTypes = await adapter.findMany({
    model: "contentType",
    sortBy: { field: "name", direction: "asc" }
  });
  return contentTypes.map(serializeContentType);
}
async function getAllContentItems(adapter, contentTypeSlug, params) {
  const contentType2 = await adapter.findOne({
    model: "contentType",
    where: [
      {
        field: "slug",
        value: contentTypeSlug,
        operator: "eq"
      }
    ]
  });
  if (!contentType2) {
    return {
      items: [],
      total: 0,
      limit: params?.limit,
      offset: params?.offset
    };
  }
  const whereConditions = [
    {
      field: "contentTypeId",
      value: contentType2.id,
      operator: "eq"
    }
  ];
  if (params?.slug) {
    whereConditions.push({
      field: "slug",
      value: params.slug,
      operator: "eq"
    });
  }
  const total = await adapter.count({
    model: "contentItem",
    where: whereConditions
  });
  const items = await adapter.findMany({
    model: "contentItem",
    where: whereConditions,
    limit: params?.limit,
    offset: params?.offset,
    sortBy: { field: "createdAt", direction: "desc" },
    join: { contentType: true }
  });
  return {
    items: items.map(serializeContentItemWithType),
    total,
    limit: params?.limit,
    offset: params?.offset
  };
}
async function getContentItemById(adapter, id) {
  const item = await adapter.findOne({
    model: "contentItem",
    where: [{ field: "id", value: id, operator: "eq" }],
    join: { contentType: true }
  });
  if (!item) return null;
  return serializeContentItemWithType(item);
}
async function getContentItemBySlug(adapter, contentTypeSlug, slug2) {
  const contentType2 = await adapter.findOne({
    model: "contentType",
    where: [
      {
        field: "slug",
        value: contentTypeSlug,
        operator: "eq"
      }
    ]
  });
  if (!contentType2) {
    return null;
  }
  const item = await adapter.findOne({
    model: "contentItem",
    where: [
      {
        field: "contentTypeId",
        value: contentType2.id,
        operator: "eq"
      },
      { field: "slug", value: slug2, operator: "eq" }
    ],
    join: { contentType: true }
  });
  if (!item) {
    return null;
  }
  return serializeContentItemWithType(item);
}
function extractRelationFields(contentType2) {
  const jsonSchema = JSON.parse(
    contentType2.jsonSchema
  );
  const properties = jsonSchema.properties || {};
  const relationFields = {};
  for (const [fieldName, fieldSchema] of Object.entries(properties)) {
    if (fieldSchema.fieldType === "relation" && fieldSchema.relation) {
      relationFields[fieldName] = fieldSchema.relation;
    }
  }
  return relationFields;
}
function isNewRelationValue(value) {
  return typeof value === "object" && value !== null && "_new" in value && value._new === true && "data" in value;
}
function isExistingRelationValue(value) {
  return typeof value === "object" && value !== null && "id" in value && typeof value.id === "string";
}
function collectExistingRelationIds(data, relationFields) {
  const relationIds = {};
  for (const [fieldName, relationConfig] of Object.entries(relationFields)) {
    if (!(fieldName in data)) continue;
    const fieldValue = data[fieldName];
    if (!fieldValue) {
      relationIds[fieldName] = [];
      continue;
    }
    const ids = [];
    if (relationConfig.type === "belongsTo") {
      const value = fieldValue;
      if (isExistingRelationValue(value)) {
        ids.push(value.id);
      }
    } else {
      const values = Array.isArray(fieldValue) ? fieldValue : [];
      for (const value of values) {
        if (isExistingRelationValue(value)) {
          ids.push(value.id);
        }
      }
    }
    relationIds[fieldName] = ids;
  }
  return relationIds;
}
async function syncRelations(adapter, sourceId, relationIds) {
  for (const [fieldName, targetIds] of Object.entries(relationIds)) {
    await adapter.delete({
      model: "contentRelation",
      where: [
        { field: "sourceId", value: sourceId, operator: "eq" },
        { field: "fieldName", value: fieldName, operator: "eq" }
      ]
    });
    for (const targetId of targetIds) {
      await adapter.create({
        model: "contentRelation",
        data: {
          sourceId,
          targetId,
          fieldName,
          createdAt: /* @__PURE__ */ new Date()
        }
      });
    }
  }
}
async function createCMSContentItem(adapter, contentTypeSlug, input, options = {}) {
  const contentType2 = await adapter.findOne({
    model: "contentType",
    where: [
      {
        field: "slug",
        value: contentTypeSlug,
        operator: "eq"
      }
    ]
  });
  if (!contentType2) {
    throw new Error(`Content type "${contentTypeSlug}" not found`);
  }
  const existing = await adapter.findOne({
    model: "contentItem",
    where: [
      {
        field: "contentTypeId",
        value: contentType2.id,
        operator: "eq"
      },
      { field: "slug", value: input.slug, operator: "eq" }
    ]
  });
  if (existing) {
    throw new Error(
      `Content item with slug "${input.slug}" already exists in type "${contentTypeSlug}"`
    );
  }
  const item = await adapter.create({
    model: "contentItem",
    data: {
      contentTypeId: contentType2.id,
      slug: input.slug,
      data: JSON.stringify(input.data),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  if (options.syncRelations) {
    const relationFields = extractRelationFields(contentType2);
    if (Object.keys(relationFields).length > 0) {
      const relationIds = collectExistingRelationIds(
        input.data,
        relationFields
      );
      await syncRelations(adapter, item.id, relationIds);
    }
  }
  return serializeContentItem(item);
}
async function syncContentTypes(adapter, config) {
  for (const ct of config.contentTypes) {
    const jsonSchema = JSON.stringify(zodToFormSchema(ct.schema));
    const existing = await adapter.findOne({
      model: "contentType",
      where: [{ field: "slug", value: ct.slug, operator: "eq" }]
    });
    if (existing) {
      await adapter.update({
        model: "contentType",
        where: [{ field: "id", value: existing.id, operator: "eq" }],
        update: {
          name: ct.name,
          description: ct.description ?? null,
          jsonSchema,
          fieldConfig: null,
          // No longer used in version 2
          autoFormVersion: 2,
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
    } else {
      try {
        await adapter.create({
          model: "contentType",
          data: {
            name: ct.name,
            slug: ct.slug,
            description: ct.description ?? null,
            jsonSchema,
            fieldConfig: null,
            // No longer used in version 2
            autoFormVersion: 2,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }
        });
      } catch (err) {
        const nowExists = await adapter.findOne({
          model: "contentType",
          where: [{ field: "slug", value: ct.slug, operator: "eq" }]
        });
        if (nowExists) {
          continue;
        }
        const message = err instanceof Error ? err.message : "Unknown database error";
        throw new Error(
          `Failed to create content type "${ct.slug}": ${message}`
        );
      }
    }
  }
}
function getContentTypeZodSchema(contentType2) {
  const jsonSchema = JSON.parse(contentType2.jsonSchema);
  return formSchemaToZod(jsonSchema);
}
async function processRelationsInData(adapter, contentType2, data, getContentTypeFn) {
  const relationFields = extractRelationFields(contentType2);
  const processedData = { ...data };
  const relationIds = {};
  for (const [fieldName, relationConfig] of Object.entries(relationFields)) {
    if (!(fieldName in data)) {
      continue;
    }
    const fieldValue = data[fieldName];
    if (!fieldValue) {
      relationIds[fieldName] = [];
      continue;
    }
    const targetContentType = await getContentTypeFn(relationConfig.targetType);
    if (!targetContentType) {
      throw new Error(
        `Target content type "${relationConfig.targetType}" not found for relation field "${fieldName}"`
      );
    }
    const ids = [];
    if (relationConfig.type === "belongsTo") {
      const value = fieldValue;
      if (isNewRelationValue(value)) {
        const newItem = await createRelatedItem(
          adapter,
          targetContentType,
          value.data
        );
        ids.push(newItem.id);
        processedData[fieldName] = { id: newItem.id };
      } else if (isExistingRelationValue(value)) {
        ids.push(value.id);
      }
    } else {
      const values = Array.isArray(fieldValue) ? fieldValue : [];
      const processedValues = [];
      for (const value of values) {
        if (isNewRelationValue(value)) {
          const newItem = await createRelatedItem(
            adapter,
            targetContentType,
            value.data
          );
          ids.push(newItem.id);
          processedValues.push({ id: newItem.id });
        } else if (isExistingRelationValue(value)) {
          ids.push(value.id);
          processedValues.push({ id: value.id });
        }
      }
      processedData[fieldName] = processedValues;
    }
    relationIds[fieldName] = ids;
  }
  return { processedData, relationIds };
}
async function createRelatedItem(adapter, targetContentType, data) {
  const slug2 = slugify$2(
    data.slug || data.name || data.title || `item-${Date.now()}`
  );
  const zodSchema = getContentTypeZodSchema(targetContentType);
  const validation = zodSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(
      `Validation failed for new ${targetContentType.slug}: ${JSON.stringify(validation.error.issues)}`
    );
  }
  const existing = await adapter.findOne({
    model: "contentItem",
    where: [
      {
        field: "contentTypeId",
        value: targetContentType.id,
        operator: "eq"
      },
      { field: "slug", value: slug2, operator: "eq" }
    ]
  });
  if (existing) {
    return existing;
  }
  const item = await adapter.create({
    model: "contentItem",
    data: {
      contentTypeId: targetContentType.id,
      slug: slug2,
      data: JSON.stringify(validation.data),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return item;
}
async function populateRelations(adapter, item) {
  const relations2 = {};
  const contentRelations = await adapter.findMany({
    model: "contentRelation",
    where: [{ field: "sourceId", value: item.id, operator: "eq" }]
  });
  const relationsByField = {};
  for (const rel of contentRelations) {
    if (!relationsByField[rel.fieldName]) {
      relationsByField[rel.fieldName] = [];
    }
    relationsByField[rel.fieldName].push(rel.targetId);
  }
  for (const [fieldName, targetIds] of Object.entries(relationsByField)) {
    if (targetIds.length === 0) {
      relations2[fieldName] = [];
      continue;
    }
    const relatedItems = [];
    for (const targetId of targetIds) {
      const relatedItem = await adapter.findOne({
        model: "contentItem",
        where: [{ field: "id", value: targetId, operator: "eq" }],
        join: { contentType: true }
      });
      if (relatedItem) {
        relatedItems.push(serializeContentItemWithType(relatedItem));
      }
    }
    relations2[fieldName] = relatedItems;
  }
  return relations2;
}
const cmsBackendPlugin = (config) => {
  let syncPromise = null;
  const ensureSynced = (adapter) => {
    if (!syncPromise) {
      syncPromise = syncContentTypes(adapter, config).catch((err) => {
        syncPromise = null;
        throw err;
      });
    }
    return syncPromise;
  };
  const getContentTypesWithCounts = async (adapter) => {
    const contentTypes = await getAllContentTypes(adapter);
    return Promise.all(
      contentTypes.map(async (ct) => {
        const count = await adapter.count({
          model: "contentItem",
          where: [
            { field: "contentTypeId", value: ct.id, operator: "eq" }
          ]
        });
        return { ...ct, itemCount: count };
      })
    );
  };
  const createCMSPrefetchForRoute = (adapter) => {
    return async function prefetchForRoute(key, qc, params) {
      await ensureSynced(adapter);
      switch (key) {
        case "dashboard":
        case "newContent": {
          const typesWithCounts = await getContentTypesWithCounts(adapter);
          qc.setQueryData(CMS_QUERY_KEYS.typesList(), typesWithCounts);
          break;
        }
        case "contentList": {
          const typeSlug = params?.typeSlug ?? "";
          const [contentTypes, contentItems] = await Promise.all([
            getContentTypesWithCounts(adapter),
            getAllContentItems(adapter, typeSlug, { limit: 20, offset: 0 })
          ]);
          qc.setQueryData(CMS_QUERY_KEYS.typesList(), contentTypes);
          qc.setQueryData(
            CMS_QUERY_KEYS.contentList({ typeSlug, limit: 20, offset: 0 }),
            {
              pages: [
                {
                  items: contentItems.items,
                  total: contentItems.total,
                  limit: contentItems.limit ?? 20,
                  offset: contentItems.offset ?? 0
                }
              ],
              pageParams: [0]
            }
          );
          break;
        }
        case "editContent": {
          const typeSlug = params?.typeSlug ?? "";
          const id = params?.id ?? "";
          const [contentTypes, item] = await Promise.all([
            getContentTypesWithCounts(adapter),
            id ? getContentItemById(adapter, id) : Promise.resolve(null)
          ]);
          qc.setQueryData(CMS_QUERY_KEYS.typesList(), contentTypes);
          if (id) {
            qc.setQueryData(CMS_QUERY_KEYS.contentDetail(typeSlug, id), item);
          }
          break;
        }
      }
    };
  };
  return defineBackendPlugin({
    name: "cms",
    dbPlugin: cmsSchema,
    api: (adapter) => ({
      getAllContentTypes: async () => {
        await ensureSynced(adapter);
        return getAllContentTypes(adapter);
      },
      getAllContentItems: async (contentTypeSlug, params) => {
        await ensureSynced(adapter);
        return getAllContentItems(adapter, contentTypeSlug, params);
      },
      getContentItemBySlug: async (contentTypeSlug, slug2) => {
        await ensureSynced(adapter);
        return getContentItemBySlug(adapter, contentTypeSlug, slug2);
      },
      getContentItemById: async (id) => {
        await ensureSynced(adapter);
        return getContentItemById(adapter, id);
      },
      prefetchForRoute: createCMSPrefetchForRoute(adapter),
      // Mutations
      createContentItem: async (typeSlug, input, options) => {
        await ensureSynced(adapter);
        return createCMSContentItem(adapter, typeSlug, input, options);
      }
    }),
    routes: (adapter) => {
      const listContentQuerySchema = createListContentQuerySchema(
        config.maxPageSize
      );
      const paginationQuerySchema = object({
        limit: number().min(1).max(config.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE).optional().default(20),
        offset: number().min(0).optional().default(0)
      });
      const getContentType = async (slug2) => {
        await ensureSynced(adapter);
        return adapter.findOne({
          model: "contentType",
          where: [{ field: "slug", value: slug2, operator: "eq" }]
        });
      };
      const createContext2 = (typeSlug, headers) => ({
        typeSlug,
        headers
      });
      const listContentTypes = createEndpoint(
        "/content-types",
        { method: "GET" },
        async (ctx) => {
          await ensureSynced(adapter);
          const contentTypes = await adapter.findMany({
            model: "contentType",
            sortBy: { field: "name", direction: "asc" }
          });
          const typesWithCounts = await Promise.all(
            contentTypes.map(async (ct) => {
              const itemCount = await adapter.count({
                model: "contentItem",
                where: [
                  {
                    field: "contentTypeId",
                    value: ct.id,
                    operator: "eq"
                  }
                ]
              });
              return {
                ...serializeContentType(ct),
                itemCount
              };
            })
          );
          return typesWithCounts;
        }
      );
      const getContentTypeBySlug = createEndpoint(
        "/content-types/:slug",
        {
          method: "GET",
          params: object({ slug: string() })
        },
        async (ctx) => {
          const { slug: slug2 } = ctx.params;
          const contentType2 = await getContentType(slug2);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          return serializeContentType(contentType2);
        }
      );
      const listContentItems = createEndpoint(
        "/content/:typeSlug",
        {
          method: "GET",
          params: object({ typeSlug: string() }),
          query: listContentQuerySchema
        },
        async (ctx) => {
          const { typeSlug } = ctx.params;
          const { slug: slug2, limit, offset } = ctx.query;
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          return getAllContentItems(adapter, typeSlug, { slug: slug2, limit, offset });
        }
      );
      const getContentItem = createEndpoint(
        "/content/:typeSlug/:id",
        {
          method: "GET",
          params: object({ typeSlug: string(), id: string() })
        },
        async (ctx) => {
          const { typeSlug, id } = ctx.params;
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const item = await adapter.findOne({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }],
            join: { contentType: true }
          });
          if (!item || item.contentTypeId !== contentType2.id) {
            throw ctx.error(404, { message: "Content item not found" });
          }
          return serializeContentItemWithType(item);
        }
      );
      const createContentItem = createEndpoint(
        "/content/:typeSlug",
        {
          method: "POST",
          params: object({ typeSlug: string() }),
          body: object({
            slug: string().min(1),
            // Use passthrough object instead of z.record(z.unknown()) due to Zod v4 bug
            data: object({}).passthrough()
          })
        },
        async (ctx) => {
          const { typeSlug } = ctx.params;
          const { slug: rawSlug, data } = ctx.body;
          const context = createContext2(typeSlug, ctx.headers);
          const slug2 = slugify$2(rawSlug);
          if (!slug2) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const { processedData: dataWithResolvedRelations, relationIds } = await processRelationsInData(
            adapter,
            contentType2,
            data,
            getContentType
          );
          const zodSchema = getContentTypeZodSchema(contentType2);
          const validation = zodSchema.safeParse(dataWithResolvedRelations);
          if (!validation.success) {
            throw ctx.error(400, {
              message: "Validation failed",
              errors: validation.error.issues
            });
          }
          const existing = await adapter.findOne({
            model: "contentItem",
            where: [
              {
                field: "contentTypeId",
                value: contentType2.id,
                operator: "eq"
              },
              { field: "slug", value: slug2, operator: "eq" }
            ]
          });
          if (existing) {
            throw ctx.error(409, {
              message: "Content item with this slug already exists"
            });
          }
          const processedData = validation.data;
          if (config.hooks?.onBeforeCreate) {
            await runHookWithShim(
              () => config.hooks.onBeforeCreate(processedData, context),
              ctx.error,
              "Create operation denied"
            );
          }
          const item = await adapter.create({
            model: "contentItem",
            data: {
              contentTypeId: contentType2.id,
              slug: slug2,
              data: JSON.stringify(processedData),
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          await syncRelations(adapter, item.id, relationIds);
          const serialized = serializeContentItem(item);
          if (config.hooks?.onAfterCreate) {
            await config.hooks.onAfterCreate(serialized, context);
          }
          return {
            ...serialized,
            parsedData: processedData
          };
        }
      );
      const updateContentItem = createEndpoint(
        "/content/:typeSlug/:id",
        {
          method: "PUT",
          params: object({ typeSlug: string(), id: string() }),
          body: object({
            slug: string().min(1).optional(),
            // Use passthrough object instead of z.record(z.unknown()) due to Zod v4 bug
            data: object({}).passthrough().optional()
          })
        },
        async (ctx) => {
          const { typeSlug, id } = ctx.params;
          const { slug: rawSlug, data } = ctx.body;
          const context = createContext2(typeSlug, ctx.headers);
          const slug2 = rawSlug ? slugify$2(rawSlug) : void 0;
          if (rawSlug && !slug2) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const existing = await adapter.findOne({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }]
          });
          if (!existing || existing.contentTypeId !== contentType2.id) {
            throw ctx.error(404, { message: "Content item not found" });
          }
          if (slug2 && slug2 !== existing.slug) {
            const duplicate = await adapter.findOne({
              model: "contentItem",
              where: [
                {
                  field: "contentTypeId",
                  value: contentType2.id,
                  operator: "eq"
                },
                { field: "slug", value: slug2, operator: "eq" }
              ]
            });
            if (duplicate) {
              throw ctx.error(409, {
                message: "Content item with this slug already exists"
              });
            }
          }
          let dataWithResolvedRelations;
          let relationIds;
          if (data) {
            const result = await processRelationsInData(
              adapter,
              contentType2,
              data,
              getContentType
            );
            dataWithResolvedRelations = result.processedData;
            relationIds = result.relationIds;
          }
          let validatedData = dataWithResolvedRelations;
          if (dataWithResolvedRelations) {
            const existingData = existing.data ? JSON.parse(existing.data) : {};
            const mergedData = {
              ...existingData,
              ...dataWithResolvedRelations
            };
            const zodSchema = getContentTypeZodSchema(contentType2);
            const validation = zodSchema.safeParse(mergedData);
            if (!validation.success) {
              throw ctx.error(400, {
                message: "Validation failed",
                errors: validation.error.issues
              });
            }
            validatedData = validation.data;
          }
          const processedData = validatedData;
          if (config.hooks?.onBeforeUpdate && validatedData) {
            await runHookWithShim(
              () => config.hooks.onBeforeUpdate(id, validatedData, context),
              ctx.error,
              "Update operation denied"
            );
          }
          if (relationIds) {
            await syncRelations(adapter, id, relationIds);
          }
          const updateData = {
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (slug2) updateData.slug = slug2;
          if (processedData) updateData.data = JSON.stringify(processedData);
          await adapter.update({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }],
            update: updateData
          });
          const updated = await adapter.findOne({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }],
            join: { contentType: true }
          });
          if (!updated) {
            throw ctx.error(500, { message: "Failed to fetch updated item" });
          }
          const serialized = serializeContentItem(updated);
          if (config.hooks?.onAfterUpdate) {
            await config.hooks.onAfterUpdate(serialized, context);
          }
          return serializeContentItemWithType(updated);
        }
      );
      const deleteContentItem = createEndpoint(
        "/content/:typeSlug/:id",
        {
          method: "DELETE",
          params: object({ typeSlug: string(), id: string() })
        },
        async (ctx) => {
          const { typeSlug, id } = ctx.params;
          const context = createContext2(typeSlug, ctx.headers);
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const existing = await adapter.findOne({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }]
          });
          if (!existing || existing.contentTypeId !== contentType2.id) {
            throw ctx.error(404, { message: "Content item not found" });
          }
          if (config.hooks?.onBeforeDelete) {
            await runHookWithShim(
              () => config.hooks.onBeforeDelete(id, context),
              ctx.error,
              "Delete operation denied"
            );
          }
          await adapter.delete({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }]
          });
          if (config.hooks?.onAfterDelete) {
            await config.hooks.onAfterDelete(id, context);
          }
          return { success: true };
        }
      );
      const getContentItemPopulated = createEndpoint(
        "/content/:typeSlug/:id/populated",
        {
          method: "GET",
          params: object({ typeSlug: string(), id: string() })
        },
        async (ctx) => {
          const { typeSlug, id } = ctx.params;
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const item = await adapter.findOne({
            model: "contentItem",
            where: [{ field: "id", value: id, operator: "eq" }],
            join: { contentType: true }
          });
          if (!item || item.contentTypeId !== contentType2.id) {
            throw ctx.error(404, { message: "Content item not found" });
          }
          const _relations = await populateRelations(adapter, item);
          return {
            ...serializeContentItemWithType(item),
            _relations
          };
        }
      );
      const listContentByRelation = createEndpoint(
        "/content/:typeSlug/by-relation",
        {
          method: "GET",
          params: object({ typeSlug: string() }),
          query: object({
            field: string(),
            targetId: string()
          }).merge(paginationQuerySchema)
        },
        async (ctx) => {
          const { typeSlug } = ctx.params;
          const { field, targetId, limit, offset } = ctx.query;
          const contentType2 = await getContentType(typeSlug);
          if (!contentType2) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const contentRelations = await adapter.findMany({
            model: "contentRelation",
            where: [
              { field: "targetId", value: targetId, operator: "eq" },
              { field: "fieldName", value: field, operator: "eq" }
            ]
          });
          const sourceIds = [
            ...new Set(contentRelations.map((r) => r.sourceId))
          ];
          if (sourceIds.length === 0) {
            return {
              items: [],
              total: 0,
              limit,
              offset
            };
          }
          const allItems = [];
          for (const sourceId of sourceIds) {
            const item = await adapter.findOne({
              model: "contentItem",
              where: [
                { field: "id", value: sourceId, operator: "eq" },
                {
                  field: "contentTypeId",
                  value: contentType2.id,
                  operator: "eq"
                }
              ],
              join: { contentType: true }
            });
            if (item) {
              allItems.push(item);
            }
          }
          allItems.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          const total = allItems.length;
          const paginatedItems = allItems.slice(offset, offset + limit);
          return {
            items: paginatedItems.map(serializeContentItemWithType),
            total,
            limit,
            offset
          };
        }
      );
      const getInverseRelations = createEndpoint(
        "/content-types/:slug/inverse-relations",
        {
          method: "GET",
          params: object({ slug: string() }),
          query: object({
            itemId: string().optional()
          })
        },
        async (ctx) => {
          const { slug: slug2 } = ctx.params;
          const { itemId } = ctx.query;
          await ensureSynced(adapter);
          const targetContentType = await getContentType(slug2);
          if (!targetContentType) {
            throw ctx.error(404, { message: "Content type not found" });
          }
          const allContentTypes = await adapter.findMany({
            model: "contentType"
          });
          const inverseRelations = [];
          for (const contentType2 of allContentTypes) {
            const relationFields = extractRelationFields(contentType2);
            for (const [fieldName, relationConfig] of Object.entries(
              relationFields
            )) {
              if (relationConfig.type === "belongsTo" && relationConfig.targetType === slug2) {
                let count = 0;
                if (itemId) {
                  const relations2 = await adapter.findMany({
                    model: "contentRelation",
                    where: [
                      {
                        field: "targetId",
                        value: itemId,
                        operator: "eq"
                      },
                      {
                        field: "fieldName",
                        value: fieldName,
                        operator: "eq"
                      }
                    ]
                  });
                  const itemIds = relations2.map((r) => r.sourceId);
                  for (const sourceId of itemIds) {
                    const item = await adapter.findOne({
                      model: "contentItem",
                      where: [
                        {
                          field: "id",
                          value: sourceId,
                          operator: "eq"
                        },
                        {
                          field: "contentTypeId",
                          value: contentType2.id,
                          operator: "eq"
                        }
                      ]
                    });
                    if (item) count++;
                  }
                }
                inverseRelations.push({
                  sourceType: contentType2.slug,
                  sourceTypeName: contentType2.name,
                  fieldName,
                  count
                });
              }
            }
          }
          return { inverseRelations };
        }
      );
      const listInverseRelationItems = createEndpoint(
        "/content-types/:slug/inverse-relations/:sourceType",
        {
          method: "GET",
          params: object({
            slug: string(),
            sourceType: string()
          }),
          query: object({
            itemId: string(),
            fieldName: string()
          }).merge(paginationQuerySchema)
        },
        async (ctx) => {
          const { slug: slug2, sourceType } = ctx.params;
          const { itemId, fieldName, limit, offset } = ctx.query;
          await ensureSynced(adapter);
          const targetContentType = await getContentType(slug2);
          if (!targetContentType) {
            throw ctx.error(404, { message: "Target content type not found" });
          }
          const sourceContentType = await getContentType(sourceType);
          if (!sourceContentType) {
            throw ctx.error(404, { message: "Source content type not found" });
          }
          const relations2 = await adapter.findMany({
            model: "contentRelation",
            where: [
              { field: "targetId", value: itemId, operator: "eq" },
              { field: "fieldName", value: fieldName, operator: "eq" }
            ]
          });
          const sourceIds = [...new Set(relations2.map((r) => r.sourceId))];
          const allItems = [];
          for (const sourceId of sourceIds) {
            const item = await adapter.findOne({
              model: "contentItem",
              where: [
                { field: "id", value: sourceId, operator: "eq" },
                {
                  field: "contentTypeId",
                  value: sourceContentType.id,
                  operator: "eq"
                }
              ],
              join: { contentType: true }
            });
            if (item) {
              allItems.push(item);
            }
          }
          allItems.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
          const total = allItems.length;
          const paginatedItems = allItems.slice(offset, offset + limit);
          return {
            items: paginatedItems.map(serializeContentItemWithType),
            total,
            limit,
            offset
          };
        }
      );
      return {
        listContentTypes,
        getContentTypeBySlug,
        listContentItems,
        getContentItem,
        createContentItem,
        updateContentItem,
        deleteContentItem,
        getContentItemPopulated,
        listContentByRelation,
        getInverseRelations,
        listInverseRelationItems
      };
    }
  });
};
const formBuilderSchema = createDbPlugin("form-builder", {
  form: {
    modelName: "form",
    fields: {
      name: {
        type: "string",
        required: true
      },
      slug: {
        type: "string",
        required: true,
        unique: true
      },
      description: {
        type: "string",
        required: false
      },
      // JSON Schema stored as string (includes steps, fieldType, stepGroup, etc.)
      schema: {
        type: "string",
        required: true
      },
      // Optional custom success message after submission
      successMessage: {
        type: "string",
        required: false
      },
      // Optional redirect URL after submission
      redirectUrl: {
        type: "string",
        required: false
      },
      // Form status: active, inactive, archived
      status: {
        type: "string",
        defaultValue: "active"
      },
      // User who created the form
      createdBy: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  formSubmission: {
    modelName: "formSubmission",
    fields: {
      formId: {
        type: "string",
        required: true,
        // Database reference for efficient joins
        references: {
          model: "form",
          field: "id",
          onDelete: "cascade"
        }
      },
      // Submitted data as JSON string
      data: {
        type: "string",
        required: true
      },
      // Submission timestamp
      submittedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      // Optional user ID if authenticated
      submittedBy: {
        type: "string",
        required: false
      },
      // IP address for rate limiting and spam protection
      ipAddress: {
        type: "string",
        required: false
      },
      // User agent for analytics
      userAgent: {
        type: "string",
        required: false
      }
    }
  }
});
const listFormsQuerySchema = object({
  status: _enum(["active", "inactive", "archived"]).optional(),
  limit: number().min(1).max(100).optional().default(20),
  offset: number().min(0).optional().default(0)
});
const createFormSchema = object({
  name: string().min(1, "Name is required"),
  slug: string().min(1, "Slug is required"),
  description: string().optional(),
  schema: string().min(1, "Schema is required"),
  successMessage: string().optional(),
  redirectUrl: string().url().optional().or(literal("")),
  status: _enum(["active", "inactive", "archived"]).optional().default("active")
});
const updateFormSchema = object({
  name: string().min(1, "Name is required").optional(),
  slug: string().min(1, "Slug is required").optional(),
  description: string().optional(),
  schema: string().min(1, "Schema is required").optional(),
  successMessage: string().optional(),
  redirectUrl: string().url().optional().or(literal("")),
  status: _enum(["active", "inactive", "archived"]).optional()
});
const formResponseSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  description: string().nullable().optional(),
  schema: string(),
  successMessage: string().nullable().optional(),
  redirectUrl: string().nullable().optional(),
  status: string(),
  createdBy: string().nullable().optional(),
  createdAt: string(),
  updatedAt: string()
});
object({
  items: array(formResponseSchema),
  total: number$1(),
  limit: number$1(),
  offset: number$1()
});
const listSubmissionsQuerySchema = object({
  limit: number().min(1).max(100).optional().default(20),
  offset: number().min(0).optional().default(0)
});
object({
  // Use passthrough object for dynamic form data validation
  data: object({}).passthrough()
});
const formSubmissionResponseSchema = object({
  id: string(),
  formId: string(),
  data: string(),
  submittedAt: string(),
  submittedBy: string().nullable().optional(),
  ipAddress: string().nullable().optional(),
  userAgent: string().nullable().optional()
});
const formSubmissionWithDataResponseSchema = formSubmissionResponseSchema.extend({
  // Use passthrough object for dynamic parsed data
  parsedData: object({}).passthrough(),
  form: formResponseSchema.optional()
});
object({
  items: array(formSubmissionWithDataResponseSchema),
  total: number$1(),
  limit: number$1(),
  offset: number$1()
});
function slugify$1(text2, locale = "en") {
  return slug(text2, { lower: true, locale });
}
function extractIpAddress(headers) {
  if (!headers) return void 0;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return void 0;
}
function extractUserAgent(headers) {
  if (!headers) return void 0;
  return headers.get("user-agent") || void 0;
}
function serializeForm(form2) {
  return {
    id: form2.id,
    name: form2.name,
    slug: form2.slug,
    description: form2.description,
    schema: form2.schema,
    successMessage: form2.successMessage,
    redirectUrl: form2.redirectUrl,
    status: form2.status,
    createdBy: form2.createdBy,
    createdAt: form2.createdAt.toISOString(),
    updatedAt: form2.updatedAt.toISOString()
  };
}
function serializeFormSubmission(submission) {
  return {
    ...submission,
    submittedAt: submission.submittedAt.toISOString()
  };
}
function serializeFormSubmissionWithData(submission) {
  let parsedData = null;
  try {
    parsedData = JSON.parse(submission.data);
  } catch {
  }
  return {
    ...serializeFormSubmission(submission),
    parsedData,
    form: submission.form ? serializeForm(submission.form) : void 0
  };
}
async function getAllForms(adapter, params) {
  const whereConditions = [];
  if (params?.status) {
    whereConditions.push({
      field: "status",
      value: params.status,
      operator: "eq"
    });
  }
  const total = await adapter.count({
    model: "form",
    where: whereConditions.length > 0 ? whereConditions : void 0
  });
  const forms = await adapter.findMany({
    model: "form",
    where: whereConditions.length > 0 ? whereConditions : void 0,
    limit: params?.limit,
    offset: params?.offset,
    sortBy: { field: "createdAt", direction: "desc" }
  });
  return {
    items: forms.map(serializeForm),
    total,
    limit: params?.limit,
    offset: params?.offset
  };
}
async function getFormById(adapter, id) {
  const form2 = await adapter.findOne({
    model: "form",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
  if (!form2) return null;
  return serializeForm(form2);
}
async function getFormBySlug(adapter, slug2) {
  const form2 = await adapter.findOne({
    model: "form",
    where: [{ field: "slug", value: slug2, operator: "eq" }]
  });
  if (!form2) {
    return null;
  }
  return serializeForm(form2);
}
async function getFormSubmissions(adapter, formId, params) {
  const form2 = await adapter.findOne({
    model: "form",
    where: [{ field: "id", value: formId, operator: "eq" }]
  });
  if (!form2) {
    return {
      items: [],
      total: 0,
      limit: params?.limit,
      offset: params?.offset
    };
  }
  const total = await adapter.count({
    model: "formSubmission",
    where: [{ field: "formId", value: formId, operator: "eq" }]
  });
  const submissions = await adapter.findMany({
    model: "formSubmission",
    where: [{ field: "formId", value: formId, operator: "eq" }],
    limit: params?.limit,
    offset: params?.offset,
    sortBy: { field: "submittedAt", direction: "desc" },
    join: { form: true }
  });
  return {
    items: submissions.map(serializeFormSubmissionWithData),
    total,
    limit: params?.limit,
    offset: params?.offset
  };
}
function createFormBuilderPrefetchForRoute(adapter) {
  return async function prefetchForRoute(key, qc, params) {
    switch (key) {
      case "formList": {
        const result = await getAllForms(adapter, { limit: 20, offset: 0 });
        qc.setQueryData(FORM_QUERY_KEYS.formsList({ limit: 20, offset: 0 }), {
          pages: [
            {
              items: result.items,
              total: result.total,
              limit: result.limit ?? 20,
              offset: result.offset ?? 0
            }
          ],
          pageParams: [0]
        });
        break;
      }
      case "editForm": {
        const id = params?.id ?? "";
        if (id) {
          const form2 = await getFormById(adapter, id);
          qc.setQueryData(FORM_QUERY_KEYS.formById(id), form2);
        }
        break;
      }
      case "submissions": {
        const id = params?.id ?? "";
        if (id) {
          const [form2, submissionsResult] = await Promise.all([
            getFormById(adapter, id),
            getFormSubmissions(adapter, id, { limit: 20, offset: 0 })
          ]);
          qc.setQueryData(FORM_QUERY_KEYS.formById(id), form2);
          qc.setQueryData(
            FORM_QUERY_KEYS.submissionsList({
              formId: id,
              limit: 20,
              offset: 0
            }),
            {
              pages: [
                {
                  items: submissionsResult.items,
                  total: submissionsResult.total,
                  limit: submissionsResult.limit ?? 20,
                  offset: submissionsResult.offset ?? 0
                }
              ],
              pageParams: [0]
            }
          );
        }
        break;
      }
    }
  };
}
const formBuilderBackendPlugin = (config = {}) => defineBackendPlugin({
  name: "form-builder",
  dbPlugin: formBuilderSchema,
  api: (adapter) => ({
    getAllForms: (params) => getAllForms(adapter, params),
    getFormById: (id) => getFormById(adapter, id),
    getFormBySlug: (slug2) => getFormBySlug(adapter, slug2),
    getFormSubmissions: (formId, params) => getFormSubmissions(adapter, formId, params),
    prefetchForRoute: createFormBuilderPrefetchForRoute(adapter)
  }),
  routes: (adapter) => {
    const createContext2 = (headers) => ({
      headers,
      ipAddress: extractIpAddress(headers),
      userAgent: extractUserAgent(headers)
    });
    const createSubmissionContext = (formSlug, formId, headers) => ({
      ...createContext2(headers),
      formSlug,
      formId
    });
    const listForms = createEndpoint(
      "/forms",
      {
        method: "GET",
        query: listFormsQuerySchema
      },
      async (ctx) => {
        const { status, limit, offset } = ctx.query;
        const context = createContext2(ctx.headers);
        if (config.hooks?.onBeforeListForms) {
          await runHookWithShim(
            () => config.hooks.onBeforeListForms(context),
            ctx.error,
            "Access denied"
          );
        }
        return getAllForms(adapter, { status, limit, offset });
      }
    );
    const getFormBySlug$1 = createEndpoint(
      "/forms/:slug",
      {
        method: "GET",
        params: object({ slug: string() })
      },
      async (ctx) => {
        const { slug: slug2 } = ctx.params;
        const context = createContext2(ctx.headers);
        if (config.hooks?.onBeforeGetForm) {
          await runHookWithShim(
            () => config.hooks.onBeforeGetForm(slug2, context),
            ctx.error,
            "Access denied"
          );
        }
        const form2 = await getFormBySlug(adapter, slug2);
        if (!form2) {
          throw ctx.error(404, { message: "Form not found" });
        }
        return form2;
      }
    );
    const getFormById2 = createEndpoint(
      "/forms/id/:id",
      {
        method: "GET",
        params: object({ id: string() })
      },
      async (ctx) => {
        const { id } = ctx.params;
        const context = createContext2(ctx.headers);
        if (config.hooks?.onBeforeGetForm) {
          await runHookWithShim(
            () => config.hooks.onBeforeGetForm(id, context),
            ctx.error,
            "Access denied"
          );
        }
        const form2 = await adapter.findOne({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }]
        });
        if (!form2) {
          throw ctx.error(404, { message: "Form not found" });
        }
        return serializeForm(form2);
      }
    );
    const createForm = createEndpoint(
      "/forms",
      {
        method: "POST",
        body: createFormSchema
      },
      async (ctx) => {
        const body = ctx.body;
        const context = createContext2(ctx.headers);
        const slug2 = slugify$1(body.slug);
        if (!slug2) {
          throw ctx.error(400, {
            message: "Invalid slug: must contain at least one alphanumeric character"
          });
        }
        const existing = await adapter.findOne({
          model: "form",
          where: [{ field: "slug", value: slug2, operator: "eq" }]
        });
        if (existing) {
          throw ctx.error(409, {
            message: "Form with this slug already exists"
          });
        }
        try {
          JSON.parse(body.schema);
        } catch {
          throw ctx.error(400, { message: "Invalid JSON Schema" });
        }
        let formInput = {
          name: body.name,
          slug: slug2,
          description: body.description,
          schema: body.schema,
          successMessage: body.successMessage,
          redirectUrl: body.redirectUrl || void 0,
          status: body.status
        };
        if (config.hooks?.onBeforeFormCreated) {
          const hookResult = await runHookWithShim(
            () => config.hooks.onBeforeFormCreated(formInput, context),
            ctx.error,
            "Create operation denied"
          );
          if (hookResult && typeof hookResult === "object") {
            formInput = hookResult;
          }
        }
        const form2 = await adapter.create({
          model: "form",
          data: {
            name: formInput.name,
            slug: formInput.slug,
            description: formInput.description,
            schema: formInput.schema,
            successMessage: formInput.successMessage,
            redirectUrl: formInput.redirectUrl,
            status: formInput.status || "active",
            createdBy: formInput.createdBy,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }
        });
        const serialized = serializeForm(form2);
        if (config.hooks?.onAfterFormCreated) {
          await config.hooks.onAfterFormCreated(serialized, context);
        }
        return serialized;
      }
    );
    const updateForm = createEndpoint(
      "/forms/:id",
      {
        method: "PUT",
        params: object({ id: string() }),
        body: updateFormSchema
      },
      async (ctx) => {
        const { id } = ctx.params;
        const body = ctx.body;
        const context = createContext2(ctx.headers);
        const existing = await adapter.findOne({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }]
        });
        if (!existing) {
          throw ctx.error(404, { message: "Form not found" });
        }
        let slug2;
        if (body.slug) {
          slug2 = slugify$1(body.slug);
          if (!slug2) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          if (slug2 !== existing.slug) {
            const duplicate = await adapter.findOne({
              model: "form",
              where: [
                { field: "slug", value: slug2, operator: "eq" }
              ]
            });
            if (duplicate) {
              throw ctx.error(409, {
                message: "Form with this slug already exists"
              });
            }
          }
        }
        if (body.schema) {
          try {
            JSON.parse(body.schema);
          } catch {
            throw ctx.error(400, { message: "Invalid JSON Schema" });
          }
        }
        let updateInput = {
          name: body.name,
          slug: slug2,
          description: body.description,
          schema: body.schema,
          successMessage: body.successMessage,
          redirectUrl: body.redirectUrl,
          status: body.status
        };
        if (config.hooks?.onBeforeFormUpdated) {
          const hookResult = await runHookWithShim(
            () => config.hooks.onBeforeFormUpdated(id, updateInput, context),
            ctx.error,
            "Update operation denied"
          );
          if (hookResult && typeof hookResult === "object") {
            updateInput = hookResult;
          }
        }
        const updateData = {
          updatedAt: /* @__PURE__ */ new Date()
        };
        if (updateInput.name) updateData.name = updateInput.name;
        if (updateInput.slug) updateData.slug = updateInput.slug;
        if (updateInput.description !== void 0)
          updateData.description = updateInput.description;
        if (updateInput.schema) updateData.schema = updateInput.schema;
        if (updateInput.successMessage !== void 0)
          updateData.successMessage = updateInput.successMessage;
        if (updateInput.redirectUrl !== void 0)
          updateData.redirectUrl = updateInput.redirectUrl;
        if (updateInput.status) updateData.status = updateInput.status;
        await adapter.update({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }],
          update: updateData
        });
        const updated = await adapter.findOne({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }]
        });
        if (!updated) {
          throw ctx.error(500, { message: "Failed to fetch updated form" });
        }
        const serialized = serializeForm(updated);
        if (config.hooks?.onAfterFormUpdated) {
          await config.hooks.onAfterFormUpdated(serialized, context);
        }
        return serialized;
      }
    );
    const deleteForm = createEndpoint(
      "/forms/:id",
      {
        method: "DELETE",
        params: object({ id: string() })
      },
      async (ctx) => {
        const { id } = ctx.params;
        const context = createContext2(ctx.headers);
        const existing = await adapter.findOne({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }]
        });
        if (!existing) {
          throw ctx.error(404, { message: "Form not found" });
        }
        if (config.hooks?.onBeforeFormDeleted) {
          await runHookWithShim(
            () => config.hooks.onBeforeFormDeleted(id, context),
            ctx.error,
            "Delete operation denied"
          );
        }
        await adapter.delete({
          model: "formSubmission",
          where: [{ field: "formId", value: id, operator: "eq" }]
        });
        await adapter.delete({
          model: "form",
          where: [{ field: "id", value: id, operator: "eq" }]
        });
        if (config.hooks?.onAfterFormDeleted) {
          await config.hooks.onAfterFormDeleted(id, context);
        }
        return { success: true };
      }
    );
    const submitForm = createEndpoint(
      "/forms/:slug/submit",
      {
        method: "POST",
        params: object({ slug: string() }),
        body: object({
          // Use passthrough object for dynamic form data
          data: object({}).passthrough()
        })
      },
      async (ctx) => {
        const { slug: slug2 } = ctx.params;
        const { data } = ctx.body;
        const baseContext = createContext2(ctx.headers);
        const form2 = await adapter.findOne({
          model: "form",
          where: [{ field: "slug", value: slug2, operator: "eq" }]
        });
        if (!form2) {
          throw ctx.error(404, { message: "Form not found" });
        }
        if (form2.status !== "active") {
          throw ctx.error(400, {
            message: "Form is not accepting submissions"
          });
        }
        const submissionContext = createSubmissionContext(
          slug2,
          form2.id,
          ctx.headers
        );
        try {
          const jsonSchema = JSON.parse(form2.schema);
          const zodSchema = formSchemaToZod(jsonSchema);
          const validation = zodSchema.safeParse(data);
          if (!validation.success) {
            throw ctx.error(400, {
              message: "Validation failed",
              errors: validation.error.issues
            });
          }
        } catch (error) {
          if (error && typeof error === "object" && "code" in error) {
            throw error;
          }
          throw ctx.error(400, { message: "Invalid form data" });
        }
        let finalData = data;
        if (config.hooks?.onBeforeSubmission) {
          let hookResult;
          let originalError;
          try {
            hookResult = await config.hooks.onBeforeSubmission(
              slug2,
              data,
              submissionContext
            );
            if (hookResult === false) {
              originalError = new Error("Submission rejected");
            }
          } catch (e) {
            originalError = e instanceof Error ? e : new Error("Submission rejected");
          }
          if (originalError) {
            if (config.hooks?.onSubmissionError) {
              await config.hooks.onSubmissionError(
                originalError,
                slug2,
                data,
                submissionContext
              );
            }
            throw ctx.error(400, { message: originalError.message });
          }
          if (hookResult && typeof hookResult === "object") {
            finalData = hookResult;
          }
        }
        const submission = await adapter.create({
          model: "formSubmission",
          data: {
            formId: form2.id,
            data: JSON.stringify(finalData),
            submittedAt: /* @__PURE__ */ new Date(),
            ipAddress: baseContext.ipAddress,
            userAgent: baseContext.userAgent
          }
        });
        const serialized = serializeFormSubmission(submission);
        if (config.hooks?.onAfterSubmission) {
          await config.hooks.onAfterSubmission(
            serialized,
            serializeForm(form2),
            submissionContext
          );
        }
        return {
          ...serialized,
          form: {
            successMessage: form2.successMessage,
            redirectUrl: form2.redirectUrl
          }
        };
      }
    );
    const listSubmissions = createEndpoint(
      "/forms/:formId/submissions",
      {
        method: "GET",
        params: object({ formId: string() }),
        query: listSubmissionsQuerySchema
      },
      async (ctx) => {
        const { formId } = ctx.params;
        const { limit, offset } = ctx.query;
        const context = createContext2(ctx.headers);
        const form2 = await adapter.findOne({
          model: "form",
          where: [{ field: "id", value: formId, operator: "eq" }]
        });
        if (!form2) {
          throw ctx.error(404, { message: "Form not found" });
        }
        if (config.hooks?.onBeforeListSubmissions) {
          await runHookWithShim(
            () => config.hooks.onBeforeListSubmissions(formId, context),
            ctx.error,
            "Access denied"
          );
        }
        return getFormSubmissions(adapter, formId, { limit, offset });
      }
    );
    const getSubmission = createEndpoint(
      "/forms/:formId/submissions/:subId",
      {
        method: "GET",
        params: object({ formId: string(), subId: string() })
      },
      async (ctx) => {
        const { formId, subId } = ctx.params;
        const context = createContext2(ctx.headers);
        if (config.hooks?.onBeforeGetSubmission) {
          await runHookWithShim(
            () => config.hooks.onBeforeGetSubmission(subId, context),
            ctx.error,
            "Access denied"
          );
        }
        const submission = await adapter.findOne({
          model: "formSubmission",
          where: [{ field: "id", value: subId, operator: "eq" }],
          join: { form: true }
        });
        if (!submission || submission.formId !== formId) {
          throw ctx.error(404, { message: "Submission not found" });
        }
        return serializeFormSubmissionWithData(submission);
      }
    );
    const deleteSubmission = createEndpoint(
      "/forms/:formId/submissions/:subId",
      {
        method: "DELETE",
        params: object({ formId: string(), subId: string() })
      },
      async (ctx) => {
        const { formId, subId } = ctx.params;
        const context = createContext2(ctx.headers);
        const existing = await adapter.findOne({
          model: "formSubmission",
          where: [{ field: "id", value: subId, operator: "eq" }]
        });
        if (!existing || existing.formId !== formId) {
          throw ctx.error(404, { message: "Submission not found" });
        }
        if (config.hooks?.onBeforeSubmissionDeleted) {
          await runHookWithShim(
            () => config.hooks.onBeforeSubmissionDeleted(subId, context),
            ctx.error,
            "Delete operation denied"
          );
        }
        await adapter.delete({
          model: "formSubmission",
          where: [{ field: "id", value: subId, operator: "eq" }]
        });
        if (config.hooks?.onAfterSubmissionDeleted) {
          await config.hooks.onAfterSubmissionDeleted(subId, context);
        }
        return { success: true };
      }
    );
    return {
      listForms,
      getFormBySlug: getFormBySlug$1,
      getFormById: getFormById2,
      createForm,
      updateForm,
      deleteForm,
      submitForm,
      listSubmissions,
      getSubmission,
      deleteSubmission
    };
  }
});
const kanbanSchema = createDbPlugin("kanban", {
  board: {
    modelName: "kanbanBoard",
    fields: {
      name: {
        type: "string",
        required: true
      },
      slug: {
        type: "string",
        required: true,
        unique: true
      },
      description: {
        type: "string",
        required: false
      },
      ownerId: {
        type: "string",
        required: false
      },
      organizationId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  column: {
    modelName: "kanbanColumn",
    fields: {
      title: {
        type: "string",
        required: true
      },
      order: {
        type: "number",
        required: true,
        defaultValue: 0
      },
      boardId: {
        type: "string",
        required: true,
        references: {
          model: "kanbanBoard",
          field: "id",
          onDelete: "cascade"
        }
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  task: {
    modelName: "kanbanTask",
    fields: {
      title: {
        type: "string",
        required: true
      },
      description: {
        type: "string",
        required: false
      },
      priority: {
        type: "string",
        required: true,
        defaultValue: "MEDIUM"
      },
      order: {
        type: "number",
        required: true,
        defaultValue: 0
      },
      columnId: {
        type: "string",
        required: true,
        references: {
          model: "kanbanColumn",
          field: "id",
          onDelete: "cascade"
        }
      },
      assigneeId: {
        type: "string",
        required: false
      },
      completedAt: {
        type: "date",
        required: false
      },
      isArchived: {
        type: "boolean",
        defaultValue: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  }
});
function slugify(text2) {
  return text2.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function getPriorityConfig(priority) {
  switch (priority) {
    case "URGENT":
      return {
        label: "Urgent",
        variant: "destructive",
        className: "kanban-priority-urgent"
      };
    case "HIGH":
      return {
        label: "High",
        variant: "outline",
        className: "kanban-priority-high"
      };
    case "MEDIUM":
      return {
        label: "Medium",
        variant: "default",
        className: "kanban-priority-medium"
      };
    case "LOW":
      return {
        label: "Low",
        variant: "secondary",
        className: "kanban-priority-low"
      };
    default:
      return {
        label: "Medium",
        variant: "default",
        className: "kanban-priority-medium"
      };
  }
}
const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" }
];
const PrioritySchema = _enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
const boardDateFields = {
  createdAt: date().optional(),
  updatedAt: date().optional()
};
const boardCoreFields = {
  name: string().min(1, "Name is required"),
  slug: string().min(1, "Slug is required"),
  description: string().optional(),
  ownerId: string().optional(),
  organizationId: string().optional()
};
const BoardDomainSchema = object({
  id: string().optional(),
  ...boardCoreFields,
  ...boardDateFields
});
const createBoardSchema = BoardDomainSchema.extend({
  slug: BoardDomainSchema.shape.slug.optional()
}).omit({ id: true });
const updateBoardSchema = BoardDomainSchema.extend({
  id: string()
}).partial().required({ id: true });
const columnDateFields = {
  createdAt: date().optional(),
  updatedAt: date().optional()
};
const columnCoreFields = {
  title: string().min(1, "Title is required"),
  order: number$1().int().min(0).optional().default(0),
  boardId: string().min(1, "Board ID is required")
};
const ColumnDomainSchema = object({
  id: string().optional(),
  ...columnCoreFields,
  ...columnDateFields
});
const createColumnSchema = ColumnDomainSchema.omit({ id: true });
const updateColumnSchema = ColumnDomainSchema.extend({
  id: string()
}).partial().required({ id: true });
const taskDateFields = {
  completedAt: date().optional(),
  createdAt: date().optional(),
  updatedAt: date().optional()
};
const taskCoreFields = {
  title: string().min(1, "Title is required"),
  description: string().optional(),
  priority: PrioritySchema.optional().default("MEDIUM"),
  order: number$1().int().min(0).optional().default(0),
  columnId: string().min(1, "Column ID is required"),
  assigneeId: string().optional().nullable(),
  isArchived: boolean().optional().default(false)
};
const TaskDomainSchema = object({
  id: string().optional(),
  ...taskCoreFields,
  ...taskDateFields
});
const createTaskSchema = TaskDomainSchema.omit({ id: true });
const updateTaskSchema = TaskDomainSchema.extend({
  id: string()
}).partial().required({ id: true });
const BoardListQuerySchema = object({
  slug: string().optional(),
  ownerId: string().optional(),
  organizationId: string().optional(),
  offset: number().int().min(0).optional(),
  limit: number().int().min(1).max(100).optional()
});
object({
  boardId: string().optional()
});
object({
  columnId: string().optional(),
  assigneeId: string().optional(),
  priority: PrioritySchema.optional(),
  isArchived: string().optional().transform((val) => {
    if (val === void 0) return void 0;
    if (val === "true") return true;
    if (val === "false") return false;
    return void 0;
  })
});
const reorderColumnsSchema = object({
  boardId: string().min(1, "Board ID is required"),
  columnIds: array(string()).min(1, "Column IDs are required")
});
const reorderTasksSchema = object({
  columnId: string().min(1, "Column ID is required"),
  taskIds: array(string()).min(1, "Task IDs are required")
});
const moveTaskSchema = object({
  taskId: string().min(1, "Task ID is required"),
  targetColumnId: string().min(1, "Target column ID is required"),
  targetOrder: number$1().int().min(0)
});
async function hydrateColumnsWithTasks(adapter, board) {
  const columnIds = (board.column || []).map((c) => c.id);
  const tasksByColumn = /* @__PURE__ */ new Map();
  if (columnIds.length > 0) {
    const taskResults = await Promise.all(
      columnIds.map(
        (columnId) => adapter.findMany({
          model: "kanbanTask",
          where: [
            { field: "columnId", value: columnId, operator: "eq" }
          ],
          sortBy: { field: "order", direction: "asc" }
        })
      )
    );
    for (let i = 0; i < columnIds.length; i++) {
      const columnId = columnIds[i];
      const tasks = taskResults[i];
      if (columnId && tasks) {
        tasksByColumn.set(columnId, tasks);
      }
    }
  }
  const columns = (board.column || []).sort((a, b) => a.order - b.order).map((col) => ({ ...col, tasks: tasksByColumn.get(col.id) || [] }));
  const { column: _, ...boardWithoutJoin } = board;
  return { ...boardWithoutJoin, columns };
}
async function getAllBoards(adapter, params) {
  const query = params ?? {};
  const whereConditions = [];
  if (query.slug) {
    whereConditions.push({
      field: "slug",
      value: query.slug,
      operator: "eq"
    });
  }
  if (query.ownerId) {
    whereConditions.push({
      field: "ownerId",
      value: query.ownerId,
      operator: "eq"
    });
  }
  if (query.organizationId) {
    whereConditions.push({
      field: "organizationId",
      value: query.organizationId,
      operator: "eq"
    });
  }
  const where = whereConditions.length > 0 ? whereConditions : void 0;
  const [boards, total] = await Promise.all([
    adapter.findMany({
      model: "kanbanBoard",
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
      where,
      sortBy: { field: "createdAt", direction: "desc" },
      join: { kanbanColumn: true }
    }),
    adapter.count({ model: "kanbanBoard", where })
  ]);
  const items = await Promise.all(
    boards.map((board) => hydrateColumnsWithTasks(adapter, board))
  );
  return { items, total, limit: query.limit, offset: query.offset };
}
async function getBoardById(adapter, id) {
  const board = await adapter.findOne({
    model: "kanbanBoard",
    where: [{ field: "id", value: id, operator: "eq" }],
    join: { kanbanColumn: true }
  });
  if (!board) {
    return null;
  }
  return hydrateColumnsWithTasks(adapter, board);
}
async function createKanbanTask(adapter, input) {
  const existingTasks = await adapter.findMany({
    model: "kanbanTask",
    where: [
      {
        field: "columnId",
        value: input.columnId,
        operator: "eq"
      }
    ]
  });
  const nextOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map((t) => t.order)) + 1 : 0;
  return adapter.create({
    model: "kanbanTask",
    data: {
      title: input.title,
      columnId: input.columnId,
      description: input.description,
      priority: input.priority ?? "MEDIUM",
      order: nextOrder,
      assigneeId: input.assigneeId,
      isArchived: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
const _pendingBoardCreations = /* @__PURE__ */ new Map();
async function findOrCreateKanbanBoard(adapter, slug2, name, columnTitles) {
  const existing = await adapter.findOne({
    model: "kanbanBoard",
    where: [{ field: "slug", value: slug2, operator: "eq" }]
  });
  if (existing) return existing;
  const inflight = _pendingBoardCreations.get(slug2);
  if (inflight) return inflight;
  const creation = (async () => {
    try {
      const board = await adapter.create({
        model: "kanbanBoard",
        data: {
          name,
          slug: slug2,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      });
      await Promise.all(
        columnTitles.map(
          (title, index) => adapter.create({
            model: "kanbanColumn",
            data: {
              title,
              boardId: board.id,
              order: index,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          })
        )
      );
      return board;
    } catch (err) {
      const winner = await adapter.findOne({
        model: "kanbanBoard",
        where: [{ field: "slug", value: slug2, operator: "eq" }]
      });
      if (winner) return winner;
      throw err;
    }
  })();
  _pendingBoardCreations.set(slug2, creation);
  try {
    return await creation;
  } finally {
    _pendingBoardCreations.delete(slug2);
  }
}
async function getKanbanColumnsByBoardId(adapter, boardId) {
  return adapter.findMany({
    model: "kanbanColumn",
    where: [{ field: "boardId", value: boardId, operator: "eq" }],
    sortBy: { field: "order", direction: "asc" }
  });
}
function serializeTask(task) {
  return {
    ...task,
    completedAt: task.completedAt?.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}
function serializeColumn(col) {
  return {
    ...col,
    createdAt: col.createdAt.toISOString(),
    updatedAt: col.updatedAt.toISOString(),
    tasks: col.tasks.map(serializeTask)
  };
}
function serializeBoard(board) {
  return {
    ...board,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
    columns: board.columns.map(serializeColumn)
  };
}
function createKanbanPrefetchForRoute(adapter) {
  return async function prefetchForRoute(key, qc, params) {
    switch (key) {
      case "boards": {
        const result = await getAllBoards(adapter, { limit: 50, offset: 0 });
        qc.setQueryData(
          KANBAN_QUERY_KEYS.boardsList({}),
          result.items.map(serializeBoard)
        );
        break;
      }
      case "board": {
        const boardId = params?.boardId ?? "";
        if (boardId) {
          const board = await getBoardById(adapter, boardId);
          qc.setQueryData(
            KANBAN_QUERY_KEYS.boardDetail(boardId),
            board ? serializeBoard(board) : null
          );
        }
        break;
      }
    }
  };
}
const kanbanBackendPlugin = (hooks) => defineBackendPlugin({
  name: "kanban",
  dbPlugin: kanbanSchema,
  api: (adapter) => ({
    getAllBoards: (params) => getAllBoards(adapter, params),
    getBoardById: (id) => getBoardById(adapter, id),
    prefetchForRoute: createKanbanPrefetchForRoute(adapter),
    // Mutations
    createTask: (input) => createKanbanTask(adapter, input),
    findOrCreateBoard: (slug2, name, columnTitles) => findOrCreateKanbanBoard(adapter, slug2, name, columnTitles),
    getColumnsByBoardId: (boardId) => getKanbanColumnsByBoardId(adapter, boardId)
  }),
  routes: (adapter) => {
    const listBoards = createEndpoint(
      "/boards",
      {
        method: "GET",
        query: BoardListQuerySchema
      },
      async (ctx) => {
        const { query, headers } = ctx;
        const context = { query, headers };
        try {
          if (hooks?.onBeforeListBoards) {
            await runHookWithShim(
              () => hooks.onBeforeListBoards(query, context),
              ctx.error,
              "Unauthorized: Cannot list boards"
            );
          }
          const result = await getAllBoards(adapter, query);
          if (hooks?.onBoardsRead) {
            await hooks.onBoardsRead(result.items, query, context);
          }
          return result;
        } catch (error) {
          if (hooks?.onListBoardsError) {
            await hooks.onListBoardsError(error, context);
          }
          throw error;
        }
      }
    );
    const getBoard = createEndpoint(
      "/boards/:id",
      {
        method: "GET"
      },
      async (ctx) => {
        const { params, headers } = ctx;
        const context = { params, headers };
        try {
          if (hooks?.onBeforeReadBoard) {
            await runHookWithShim(
              () => hooks.onBeforeReadBoard(params.id, context),
              ctx.error,
              "Unauthorized: Cannot read board"
            );
          }
          const result = await getBoardById(adapter, params.id);
          if (!result) {
            throw ctx.error(404, { message: "Board not found" });
          }
          if (hooks?.onBoardRead) {
            await hooks.onBoardRead(result, context);
          }
          return result;
        } catch (error) {
          if (hooks?.onReadBoardError) {
            await hooks.onReadBoardError(error, context);
          }
          throw error;
        }
      }
    );
    const createBoard = createEndpoint(
      "/boards",
      {
        method: "POST",
        body: createBoardSchema
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeCreateBoard) {
            await runHookWithShim(
              () => hooks.onBeforeCreateBoard(ctx.body, context),
              ctx.error,
              "Unauthorized: Cannot create board"
            );
          }
          const { ...boardData } = ctx.body;
          const slug2 = slugify(boardData.slug || boardData.name);
          if (!slug2) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          let newBoard;
          const createdColumns = [];
          await adapter.transaction(async (tx) => {
            const createdBoard = await tx.create({
              model: "kanbanBoard",
              data: {
                ...boardData,
                slug: slug2,
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date()
              }
            });
            newBoard = createdBoard;
            const defaultColumns = [
              { title: "To Do", order: 0, boardId: createdBoard.id },
              { title: "In Progress", order: 1, boardId: createdBoard.id },
              { title: "Done", order: 2, boardId: createdBoard.id }
            ];
            for (const colData of defaultColumns) {
              const col = await tx.create({
                model: "kanbanColumn",
                data: {
                  ...colData,
                  createdAt: /* @__PURE__ */ new Date(),
                  updatedAt: /* @__PURE__ */ new Date()
                }
              });
              createdColumns.push({ ...col, tasks: [] });
            }
          });
          if (!newBoard) {
            throw ctx.error(500, {
              message: "Failed to create board"
            });
          }
          const result = { ...newBoard, columns: createdColumns };
          if (hooks?.onBoardCreated) {
            await hooks.onBoardCreated(result, context);
          }
          return result;
        } catch (error) {
          if (hooks?.onCreateBoardError) {
            await hooks.onCreateBoardError(error, context);
          }
          throw error;
        }
      }
    );
    const updateBoard = createEndpoint(
      "/boards/:id",
      {
        method: "PUT",
        body: updateBoardSchema.omit({ id: true })
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeUpdateBoard) {
            await runHookWithShim(
              () => hooks.onBeforeUpdateBoard(
                ctx.params.id,
                { ...ctx.body, id: ctx.params.id },
                context
              ),
              ctx.error,
              "Unauthorized: Cannot update board"
            );
          }
          const { slug: rawSlug, ...restBoardData } = ctx.body;
          const slugified = rawSlug ? slugify(rawSlug) : void 0;
          if (rawSlug && !slugified) {
            throw ctx.error(400, {
              message: "Invalid slug: must contain at least one alphanumeric character"
            });
          }
          const boardData = {
            ...restBoardData,
            ...slugified ? { slug: slugified } : {}
          };
          const updated = await adapter.update({
            model: "kanbanBoard",
            where: [{ field: "id", value: ctx.params.id }],
            update: {
              ...boardData,
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          if (!updated) {
            throw ctx.error(404, { message: "Board not found" });
          }
          if (hooks?.onBoardUpdated) {
            await hooks.onBoardUpdated(updated, context);
          }
          return updated;
        } catch (error) {
          if (hooks?.onUpdateBoardError) {
            await hooks.onUpdateBoardError(error, context);
          }
          throw error;
        }
      }
    );
    const deleteBoard = createEndpoint(
      "/boards/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        const context = {
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          const existingBoard = await adapter.findOne({
            model: "kanbanBoard",
            where: [
              { field: "id", value: ctx.params.id, operator: "eq" }
            ]
          });
          if (!existingBoard) {
            throw ctx.error(404, { message: "Board not found" });
          }
          if (hooks?.onBeforeDeleteBoard) {
            await runHookWithShim(
              () => hooks.onBeforeDeleteBoard(ctx.params.id, context),
              ctx.error,
              "Unauthorized: Cannot delete board"
            );
          }
          await adapter.delete({
            model: "kanbanBoard",
            where: [{ field: "id", value: ctx.params.id }]
          });
          if (hooks?.onBoardDeleted) {
            await hooks.onBoardDeleted(ctx.params.id, context);
          }
          return { success: true };
        } catch (error) {
          if (hooks?.onDeleteBoardError) {
            await hooks.onDeleteBoardError(error, context);
          }
          throw error;
        }
      }
    );
    const createColumn = createEndpoint(
      "/columns",
      {
        method: "POST",
        body: createColumnSchema
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeCreateColumn) {
            await runHookWithShim(
              () => hooks.onBeforeCreateColumn(ctx.body, context),
              ctx.error,
              "Unauthorized: Cannot create column"
            );
          }
          const existingColumns = await adapter.findMany({
            model: "kanbanColumn",
            where: [
              {
                field: "boardId",
                value: ctx.body.boardId,
                operator: "eq"
              }
            ]
          });
          const nextOrder = existingColumns.length > 0 ? Math.max(...existingColumns.map((c) => c.order)) + 1 : 0;
          const newColumn = await adapter.create({
            model: "kanbanColumn",
            data: {
              ...ctx.body,
              order: ctx.body.order ?? nextOrder,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          if (hooks?.onColumnCreated) {
            await hooks.onColumnCreated(newColumn, context);
          }
          return newColumn;
        } catch (error) {
          throw error;
        }
      }
    );
    const updateColumn = createEndpoint(
      "/columns/:id",
      {
        method: "PUT",
        body: updateColumnSchema.omit({ id: true })
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeUpdateColumn) {
            await runHookWithShim(
              () => hooks.onBeforeUpdateColumn(
                ctx.params.id,
                { ...ctx.body, id: ctx.params.id },
                context
              ),
              ctx.error,
              "Unauthorized: Cannot update column"
            );
          }
          const updated = await adapter.update({
            model: "kanbanColumn",
            where: [{ field: "id", value: ctx.params.id }],
            update: {
              ...ctx.body,
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          if (!updated) {
            throw ctx.error(404, { message: "Column not found" });
          }
          if (hooks?.onColumnUpdated) {
            await hooks.onColumnUpdated(updated, context);
          }
          return updated;
        } catch (error) {
          throw error;
        }
      }
    );
    const deleteColumn = createEndpoint(
      "/columns/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        const context = {
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          const existingColumn = await adapter.findOne({
            model: "kanbanColumn",
            where: [
              { field: "id", value: ctx.params.id, operator: "eq" }
            ]
          });
          if (!existingColumn) {
            throw ctx.error(404, { message: "Column not found" });
          }
          if (hooks?.onBeforeDeleteColumn) {
            await runHookWithShim(
              () => hooks.onBeforeDeleteColumn(ctx.params.id, context),
              ctx.error,
              "Unauthorized: Cannot delete column"
            );
          }
          await adapter.delete({
            model: "kanbanColumn",
            where: [{ field: "id", value: ctx.params.id }]
          });
          if (hooks?.onColumnDeleted) {
            await hooks.onColumnDeleted(ctx.params.id, context);
          }
          return { success: true };
        } catch (error) {
          throw error;
        }
      }
    );
    const reorderColumns = createEndpoint(
      "/columns/reorder",
      {
        method: "POST",
        body: reorderColumnsSchema
      },
      async (ctx) => {
        const { boardId, columnIds } = ctx.body;
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        if (hooks?.onBeforeUpdateColumn) {
          for (let i = 0; i < columnIds.length; i++) {
            const columnId = columnIds[i];
            if (!columnId) continue;
            await runHookWithShim(
              () => hooks.onBeforeUpdateColumn(
                columnId,
                { id: columnId, order: i },
                context
              ),
              ctx.error,
              "Unauthorized: Cannot reorder columns"
            );
          }
        }
        const updatedColumns = [];
        await adapter.transaction(async (tx) => {
          for (let i = 0; i < columnIds.length; i++) {
            const columnId = columnIds[i];
            if (!columnId) continue;
            const updated = await tx.update({
              model: "kanbanColumn",
              where: [
                { field: "id", value: columnId },
                { field: "boardId", value: boardId, operator: "eq" }
              ],
              update: { order: i, updatedAt: /* @__PURE__ */ new Date() }
            });
            if (updated) {
              updatedColumns.push(updated);
            }
          }
        });
        if (hooks?.onColumnUpdated) {
          for (const column of updatedColumns) {
            await hooks.onColumnUpdated(column, context);
          }
        }
        return { success: true };
      }
    );
    const createTask = createEndpoint(
      "/tasks",
      {
        method: "POST",
        body: createTaskSchema
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeCreateTask) {
            await runHookWithShim(
              () => hooks.onBeforeCreateTask(ctx.body, context),
              ctx.error,
              "Unauthorized: Cannot create task"
            );
          }
          const existingTasks = await adapter.findMany({
            model: "kanbanTask",
            where: [
              {
                field: "columnId",
                value: ctx.body.columnId,
                operator: "eq"
              }
            ]
          });
          const nextOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map((t) => t.order)) + 1 : 0;
          const taskData = {
            title: ctx.body.title,
            columnId: ctx.body.columnId,
            description: ctx.body.description,
            priority: ctx.body.priority || "MEDIUM",
            order: ctx.body.order ?? nextOrder,
            assigneeId: ctx.body.assigneeId ?? void 0,
            isArchived: ctx.body.isArchived ?? false,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          };
          const newTask = await adapter.create({
            model: "kanbanTask",
            data: taskData
          });
          if (hooks?.onTaskCreated) {
            await hooks.onTaskCreated(newTask, context);
          }
          return newTask;
        } catch (error) {
          throw error;
        }
      }
    );
    const updateTask = createEndpoint(
      "/tasks/:id",
      {
        method: "PUT",
        body: updateTaskSchema.omit({ id: true })
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          if (hooks?.onBeforeUpdateTask) {
            await runHookWithShim(
              () => hooks.onBeforeUpdateTask(
                ctx.params.id,
                { ...ctx.body, id: ctx.params.id },
                context
              ),
              ctx.error,
              "Unauthorized: Cannot update task"
            );
          }
          const updated = await adapter.update({
            model: "kanbanTask",
            where: [{ field: "id", value: ctx.params.id }],
            update: {
              ...ctx.body,
              updatedAt: /* @__PURE__ */ new Date()
            }
          });
          if (!updated) {
            throw ctx.error(404, { message: "Task not found" });
          }
          if (hooks?.onTaskUpdated) {
            await hooks.onTaskUpdated(updated, context);
          }
          return updated;
        } catch (error) {
          throw error;
        }
      }
    );
    const deleteTask = createEndpoint(
      "/tasks/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        const context = {
          params: ctx.params,
          headers: ctx.headers
        };
        try {
          const existingTask = await adapter.findOne({
            model: "kanbanTask",
            where: [
              { field: "id", value: ctx.params.id, operator: "eq" }
            ]
          });
          if (!existingTask) {
            throw ctx.error(404, { message: "Task not found" });
          }
          if (hooks?.onBeforeDeleteTask) {
            await runHookWithShim(
              () => hooks.onBeforeDeleteTask(ctx.params.id, context),
              ctx.error,
              "Unauthorized: Cannot delete task"
            );
          }
          await adapter.delete({
            model: "kanbanTask",
            where: [{ field: "id", value: ctx.params.id }]
          });
          if (hooks?.onTaskDeleted) {
            await hooks.onTaskDeleted(ctx.params.id, context);
          }
          return { success: true };
        } catch (error) {
          throw error;
        }
      }
    );
    const moveTask = createEndpoint(
      "/tasks/move",
      {
        method: "POST",
        body: moveTaskSchema
      },
      async (ctx) => {
        const { taskId, targetColumnId, targetOrder } = ctx.body;
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        const task = await adapter.findOne({
          model: "kanbanTask",
          where: [{ field: "id", value: taskId, operator: "eq" }]
        });
        if (!task) {
          throw ctx.error(404, { message: "Task not found" });
        }
        if (hooks?.onBeforeUpdateTask) {
          await runHookWithShim(
            () => hooks.onBeforeUpdateTask(
              taskId,
              { id: taskId, columnId: targetColumnId, order: targetOrder },
              context
            ),
            ctx.error,
            "Unauthorized: Cannot move task"
          );
        }
        const updated = await adapter.update({
          model: "kanbanTask",
          where: [{ field: "id", value: taskId }],
          update: {
            columnId: targetColumnId,
            order: targetOrder,
            updatedAt: /* @__PURE__ */ new Date()
          }
        });
        if (!updated) {
          throw ctx.error(404, { message: "Task not found" });
        }
        if (hooks?.onTaskUpdated) {
          await hooks.onTaskUpdated(updated, context);
        }
        return updated;
      }
    );
    const reorderTasks = createEndpoint(
      "/tasks/reorder",
      {
        method: "POST",
        body: reorderTasksSchema
      },
      async (ctx) => {
        const { columnId, taskIds } = ctx.body;
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        if (hooks?.onBeforeUpdateTask) {
          for (let i = 0; i < taskIds.length; i++) {
            const taskId = taskIds[i];
            if (!taskId) continue;
            await runHookWithShim(
              () => hooks.onBeforeUpdateTask(
                taskId,
                { id: taskId, order: i },
                context
              ),
              ctx.error,
              "Unauthorized: Cannot reorder tasks"
            );
          }
        }
        const updatedTasks = [];
        await adapter.transaction(async (tx) => {
          for (let i = 0; i < taskIds.length; i++) {
            const taskId = taskIds[i];
            if (!taskId) continue;
            const updated = await tx.update({
              model: "kanbanTask",
              where: [
                { field: "id", value: taskId },
                {
                  field: "columnId",
                  value: columnId,
                  operator: "eq"
                }
              ],
              update: { order: i, updatedAt: /* @__PURE__ */ new Date() }
            });
            if (updated) {
              updatedTasks.push(updated);
            }
          }
        });
        if (hooks?.onTaskUpdated) {
          for (const task of updatedTasks) {
            await hooks.onTaskUpdated(task, context);
          }
        }
        return { success: true };
      }
    );
    return {
      listBoards,
      getBoard,
      createBoard,
      updateBoard,
      deleteBoard,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks
    };
  }
});
const commentsSchema = createDbPlugin("comments", {
  comment: {
    modelName: "comment",
    fields: {
      resourceId: {
        type: "string",
        required: true
      },
      resourceType: {
        type: "string",
        required: true
      },
      parentId: {
        type: "string",
        required: false
      },
      authorId: {
        type: "string",
        required: true
      },
      body: {
        type: "string",
        required: true
      },
      status: {
        type: "string",
        defaultValue: "pending"
      },
      likes: {
        type: "number",
        defaultValue: 0
      },
      editedAt: {
        type: "date",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      },
      updatedAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  commentLike: {
    modelName: "commentLike",
    fields: {
      commentId: {
        type: "string",
        required: true,
        references: {
          model: "comment",
          field: "id",
          onDelete: "cascade"
        }
      },
      authorId: {
        type: "string",
        required: true
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  }
});
const CommentStatusSchema = _enum(["pending", "approved", "spam"]);
const createCommentSchema = object({
  resourceId: string().min(1, "Resource ID is required"),
  resourceType: string().min(1, "Resource type is required"),
  parentId: string().optional().nullable(),
  body: string().min(1, "Body is required").max(1e4, "Comment too long")
});
createCommentSchema.extend({
  authorId: string().min(1, "Author ID is required")
});
const updateCommentSchema = object({
  body: string().min(1, "Body is required").max(1e4, "Comment too long")
});
const updateCommentStatusSchema = object({
  status: CommentStatusSchema
});
const CommentListQuerySchema = object({
  resourceId: string().optional(),
  resourceType: string().optional(),
  parentId: string().optional().nullable(),
  status: CommentStatusSchema.optional(),
  authorId: string().optional(),
  sort: _enum(["asc", "desc"]).optional(),
  limit: number().int().min(1).max(100).optional(),
  offset: number().int().min(0).optional()
});
CommentListQuerySchema.extend({
  currentUserId: string().optional()
});
const CommentCountQuerySchema = object({
  resourceId: string().min(1),
  resourceType: string().min(1),
  status: CommentStatusSchema.optional()
});
async function resolveAuthors(authorIds, resolveUser) {
  const unique = [...new Set(authorIds)];
  const map = /* @__PURE__ */ new Map();
  if (!resolveUser || unique.length === 0) {
    for (const id of unique) {
      map.set(id, { name: "[deleted]", avatarUrl: null });
    }
    return map;
  }
  await Promise.all(
    unique.map(async (id) => {
      try {
        const result = await resolveUser(id);
        map.set(id, {
          name: result?.name ?? "[deleted]",
          avatarUrl: result?.avatarUrl ?? null
        });
      } catch {
        map.set(id, { name: "[deleted]", avatarUrl: null });
      }
    })
  );
  return map;
}
function enrichComment(comment2, authorMap, likedCommentIds, replyCount = 0) {
  const author = authorMap.get(comment2.authorId) ?? {
    name: "[deleted]",
    avatarUrl: null
  };
  return {
    id: comment2.id,
    resourceId: comment2.resourceId,
    resourceType: comment2.resourceType,
    parentId: comment2.parentId ?? null,
    authorId: comment2.authorId,
    resolvedAuthorName: author.name,
    resolvedAvatarUrl: author.avatarUrl,
    body: comment2.body,
    status: comment2.status,
    likes: comment2.likes,
    isLikedByCurrentUser: likedCommentIds.has(comment2.id),
    editedAt: comment2.editedAt?.toISOString() ?? null,
    createdAt: comment2.createdAt.toISOString(),
    updatedAt: comment2.updatedAt.toISOString(),
    replyCount
  };
}
function buildBaseConditions(params) {
  const conditions = [];
  if (params.resourceId) {
    conditions.push({
      field: "resourceId",
      value: params.resourceId,
      operator: "eq"
    });
  }
  if (params.resourceType) {
    conditions.push({
      field: "resourceType",
      value: params.resourceType,
      operator: "eq"
    });
  }
  if (params.parentId !== void 0) {
    const parentValue = params.parentId === null || params.parentId === "null" ? null : params.parentId;
    conditions.push({ field: "parentId", value: parentValue, operator: "eq" });
  }
  if (params.authorId) {
    conditions.push({
      field: "authorId",
      value: params.authorId,
      operator: "eq"
    });
  }
  return conditions;
}
async function listComments(adapter, params, resolveUser) {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const sortDirection = params.sort ?? "asc";
  const omitStatusFilter = !!params.authorId && !params.status;
  const statusFilter = omitStatusFilter ? null : params.status ?? "approved";
  const baseConditions = buildBaseConditions(params);
  let comments;
  let total;
  if (!omitStatusFilter && statusFilter === "approved" && params.currentUserId) {
    const [ownPendingAll, approvedCount] = await Promise.all([
      adapter.findMany({
        model: "comment",
        where: [
          ...baseConditions,
          { field: "status", value: "pending", operator: "eq" },
          { field: "authorId", value: params.currentUserId, operator: "eq" }
        ],
        sortBy: { field: "createdAt", direction: sortDirection }
      }),
      adapter.count({
        model: "comment",
        where: [
          ...baseConditions,
          { field: "status", value: "approved", operator: "eq" }
        ]
      })
    ]);
    total = approvedCount + ownPendingAll.length;
    if (ownPendingAll.length === 0) {
      comments = await adapter.findMany({
        model: "comment",
        limit,
        offset,
        where: [
          ...baseConditions,
          { field: "status", value: "approved", operator: "eq" }
        ],
        sortBy: { field: "createdAt", direction: sortDirection }
      });
    } else {
      const dateOp = sortDirection === "asc" ? "lt" : "gt";
      const pendingWithPositions = await Promise.all(
        ownPendingAll.map(async (p, i) => {
          const approvedBefore = await adapter.count({
            model: "comment",
            where: [
              ...baseConditions,
              { field: "status", value: "approved", operator: "eq" },
              {
                field: "createdAt",
                value: p.createdAt,
                operator: dateOp
              }
            ]
          });
          return { comment: p, mergedPosition: approvedBefore + i };
        })
      );
      const pendingInWindow = pendingWithPositions.filter(
        ({ mergedPosition }) => mergedPosition >= offset && mergedPosition < offset + limit
      );
      const countPendingBeforeWindow = pendingWithPositions.filter(
        ({ mergedPosition }) => mergedPosition < offset
      ).length;
      const approvedOffset = Math.max(0, offset - countPendingBeforeWindow);
      const approvedLimit = limit - pendingInWindow.length;
      const approvedPage = approvedLimit > 0 ? await adapter.findMany({
        model: "comment",
        limit: approvedLimit,
        offset: approvedOffset,
        where: [
          ...baseConditions,
          { field: "status", value: "approved", operator: "eq" }
        ],
        sortBy: { field: "createdAt", direction: sortDirection }
      }) : [];
      const merged = [
        ...approvedPage,
        ...pendingInWindow.map(({ comment: comment2 }) => comment2)
      ];
      merged.sort((a, b) => {
        const diff = a.createdAt.getTime() - b.createdAt.getTime();
        return sortDirection === "desc" ? -diff : diff;
      });
      comments = merged;
    }
  } else {
    const where = [...baseConditions];
    if (statusFilter !== null) {
      where.push({
        field: "status",
        value: statusFilter,
        operator: "eq"
      });
    }
    const [found, count] = await Promise.all([
      adapter.findMany({
        model: "comment",
        limit,
        offset,
        where,
        sortBy: { field: "createdAt", direction: sortDirection }
      }),
      adapter.count({ model: "comment", where })
    ]);
    comments = found;
    total = count;
  }
  const authorIds = comments.map((c) => c.authorId);
  const authorMap = await resolveAuthors(authorIds, resolveUser);
  const likedCommentIds = /* @__PURE__ */ new Set();
  if (params.currentUserId && comments.length > 0) {
    const commentIds = comments.map((c) => c.id);
    const likes = await Promise.all(
      commentIds.map(
        (commentId) => adapter.findOne({
          model: "commentLike",
          where: [
            { field: "commentId", value: commentId, operator: "eq" },
            {
              field: "authorId",
              value: params.currentUserId,
              operator: "eq"
            }
          ]
        })
      )
    );
    likes.forEach((like, i) => {
      if (like) likedCommentIds.add(commentIds[i]);
    });
  }
  const replyCounts = /* @__PURE__ */ new Map();
  const isTopLevelQuery = params.parentId === null || params.parentId === "null";
  if (isTopLevelQuery && comments.length > 0) {
    await Promise.all(
      comments.map(async (c) => {
        const approvedCount = await adapter.count({
          model: "comment",
          where: [
            { field: "parentId", value: c.id, operator: "eq" },
            { field: "status", value: "approved", operator: "eq" }
          ]
        });
        let ownPendingCount = 0;
        if (params.currentUserId) {
          ownPendingCount = await adapter.count({
            model: "comment",
            where: [
              { field: "parentId", value: c.id, operator: "eq" },
              { field: "status", value: "pending", operator: "eq" },
              {
                field: "authorId",
                value: params.currentUserId,
                operator: "eq"
              }
            ]
          });
        }
        replyCounts.set(c.id, approvedCount + ownPendingCount);
      })
    );
  }
  const items = comments.map(
    (c) => enrichComment(c, authorMap, likedCommentIds, replyCounts.get(c.id) ?? 0)
  );
  return { items, total, limit, offset };
}
async function getCommentById(adapter, id, resolveUser, currentUserId) {
  const comment2 = await adapter.findOne({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
  if (!comment2) return null;
  const authorMap = await resolveAuthors([comment2.authorId], resolveUser);
  const likedCommentIds = /* @__PURE__ */ new Set();
  if (currentUserId) {
    const like = await adapter.findOne({
      model: "commentLike",
      where: [
        { field: "commentId", value: id, operator: "eq" },
        { field: "authorId", value: currentUserId, operator: "eq" }
      ]
    });
    if (like) likedCommentIds.add(id);
  }
  return enrichComment(comment2, authorMap, likedCommentIds);
}
async function getCommentCount(adapter, params) {
  const whereConditions = [
    { field: "resourceId", value: params.resourceId, operator: "eq" },
    { field: "resourceType", value: params.resourceType, operator: "eq" }
  ];
  const statusFilter = params.status ?? "approved";
  whereConditions.push({
    field: "status",
    value: statusFilter,
    operator: "eq"
  });
  return adapter.count({ model: "comment", where: whereConditions });
}
async function createComment(adapter, input) {
  return adapter.create({
    model: "comment",
    data: {
      resourceId: input.resourceId,
      resourceType: input.resourceType,
      parentId: input.parentId ?? null,
      authorId: input.authorId,
      body: input.body,
      status: input.status ?? "pending",
      likes: 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
async function updateComment(adapter, id, body) {
  const existing = await adapter.findOne({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
  if (!existing) return null;
  return adapter.update({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }],
    update: {
      body,
      editedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
}
async function updateCommentStatus(adapter, id, status) {
  const existing = await adapter.findOne({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
  if (!existing) return null;
  return adapter.update({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }],
    update: { status, updatedAt: /* @__PURE__ */ new Date() }
  });
}
async function deleteComment(adapter, id) {
  const existing = await adapter.findOne({
    model: "comment",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
  if (!existing) return false;
  await adapter.transaction(async (tx) => {
    await tx.delete({
      model: "comment",
      where: [{ field: "parentId", value: id, operator: "eq" }]
    });
    await tx.delete({
      model: "comment",
      where: [{ field: "id", value: id, operator: "eq" }]
    });
  });
  return true;
}
async function toggleCommentLike(adapter, commentId, authorId) {
  return adapter.transaction(async (tx) => {
    const comment2 = await tx.findOne({
      model: "comment",
      where: [{ field: "id", value: commentId, operator: "eq" }]
    });
    if (!comment2) {
      throw new Error("Comment not found");
    }
    const existingLike = await tx.findOne({
      model: "commentLike",
      where: [
        { field: "commentId", value: commentId, operator: "eq" },
        { field: "authorId", value: authorId, operator: "eq" }
      ]
    });
    let newLikes;
    let isLiked;
    if (existingLike) {
      await tx.delete({
        model: "commentLike",
        where: [
          { field: "commentId", value: commentId, operator: "eq" },
          { field: "authorId", value: authorId, operator: "eq" }
        ]
      });
      newLikes = Math.max(0, comment2.likes - 1);
      isLiked = false;
    } else {
      await tx.create({
        model: "commentLike",
        data: {
          commentId,
          authorId,
          createdAt: /* @__PURE__ */ new Date()
        }
      });
      newLikes = comment2.likes + 1;
      isLiked = true;
    }
    await tx.update({
      model: "comment",
      where: [{ field: "id", value: commentId, operator: "eq" }],
      update: { likes: newLikes, updatedAt: /* @__PURE__ */ new Date() }
    });
    return { likes: newLikes, isLiked };
  });
}
const commentsBackendPlugin = (options) => {
  const postingEnabled = options.allowPosting !== false;
  const editingEnabled = options.allowEditing !== false;
  const onBeforePost = options.allowPosting !== false ? options.onBeforePost : void 0;
  const resolveCurrentUserId = options.allowPosting !== false ? options.resolveCurrentUserId : void 0;
  return defineBackendPlugin({
    name: "comments",
    dbPlugin: commentsSchema,
    api: (adapter) => ({
      listComments: (params) => listComments(adapter, params, options?.resolveUser),
      getCommentById: (id, currentUserId) => getCommentById(adapter, id, options?.resolveUser, currentUserId),
      getCommentCount: (params) => getCommentCount(adapter, params)
    }),
    routes: (adapter) => {
      const listCommentsEndpoint = createEndpoint(
        "/comments",
        {
          method: "GET",
          query: CommentListQuerySchema
        },
        async (ctx) => {
          const context = {
            query: ctx.query,
            request: ctx.request,
            headers: ctx.headers
          };
          if (ctx.query.authorId) {
            if (!options?.onBeforeListByAuthor) {
              throw ctx.error(403, {
                message: "Forbidden: authorId filter requires onBeforeListByAuthor hook"
              });
            }
            await runHookWithShim(
              () => options.onBeforeListByAuthor(
                ctx.query.authorId,
                ctx.query,
                context
              ),
              ctx.error,
              "Forbidden: Cannot list comments for this author"
            );
          }
          if (ctx.query.status && ctx.query.status !== "approved") {
            if (!options?.onBeforeList) {
              throw ctx.error(403, {
                message: "Forbidden: status filter requires authorization"
              });
            }
            await runHookWithShim(
              () => options.onBeforeList(ctx.query, context),
              ctx.error,
              "Forbidden: Cannot list comments with this status filter"
            );
          } else if (options?.onBeforeList && !ctx.query.authorId) {
            await runHookWithShim(
              () => options.onBeforeList(ctx.query, context),
              ctx.error,
              "Forbidden: Cannot list comments"
            );
          }
          let resolvedCurrentUserId;
          if (resolveCurrentUserId) {
            try {
              const result = await resolveCurrentUserId(context);
              resolvedCurrentUserId = result ?? void 0;
            } catch {
              resolvedCurrentUserId = void 0;
            }
          }
          return await listComments(
            adapter,
            { ...ctx.query, currentUserId: resolvedCurrentUserId },
            options?.resolveUser
          );
        }
      );
      const createCommentEndpoint = createEndpoint(
        "/comments",
        {
          method: "POST",
          body: createCommentSchema
        },
        async (ctx) => {
          if (!postingEnabled) {
            throw ctx.error(403, { message: "Posting comments is disabled" });
          }
          const context = {
            body: ctx.body,
            headers: ctx.headers
          };
          const { authorId } = await runHookWithShim(
            () => onBeforePost(ctx.body, context),
            ctx.error,
            "Unauthorized: Cannot post comment"
          );
          const status = options?.autoApprove ? "approved" : "pending";
          const comment2 = await createComment(adapter, {
            ...ctx.body,
            authorId,
            status
          });
          if (options?.onAfterPost) {
            await options.onAfterPost(comment2, context);
          }
          const serialized = await getCommentById(
            adapter,
            comment2.id,
            options?.resolveUser
          );
          if (!serialized) {
            throw ctx.error(500, {
              message: "Failed to retrieve created comment"
            });
          }
          return serialized;
        }
      );
      const updateCommentEndpoint = createEndpoint(
        "/comments/:id",
        {
          method: "PATCH",
          body: updateCommentSchema
        },
        async (ctx) => {
          if (!editingEnabled) {
            throw ctx.error(403, { message: "Editing comments is disabled" });
          }
          const { id } = ctx.params;
          const context = {
            params: ctx.params,
            body: ctx.body,
            headers: ctx.headers
          };
          if (!options?.onBeforeEdit) {
            throw ctx.error(403, {
              message: "Forbidden: editing comments requires the onBeforeEdit hook"
            });
          }
          await runHookWithShim(
            () => options.onBeforeEdit(id, { body: ctx.body.body }, context),
            ctx.error,
            "Unauthorized: Cannot edit comment"
          );
          const updated = await updateComment(adapter, id, ctx.body.body);
          if (!updated) {
            throw ctx.error(404, { message: "Comment not found" });
          }
          if (options?.onAfterEdit) {
            await options.onAfterEdit(updated, context);
          }
          const serialized = await getCommentById(
            adapter,
            updated.id,
            options?.resolveUser
          );
          if (!serialized) {
            throw ctx.error(500, {
              message: "Failed to retrieve updated comment"
            });
          }
          return serialized;
        }
      );
      const getCommentCountEndpoint = createEndpoint(
        "/comments/count",
        {
          method: "GET",
          query: CommentCountQuerySchema
        },
        async (ctx) => {
          const context = {
            query: ctx.query,
            headers: ctx.headers
          };
          if (ctx.query.status && ctx.query.status !== "approved") {
            if (!options?.onBeforeList) {
              throw ctx.error(403, {
                message: "Forbidden: status filter requires authorization"
              });
            }
            await runHookWithShim(
              () => options.onBeforeList(
                { ...ctx.query, status: ctx.query.status },
                context
              ),
              ctx.error,
              "Forbidden: Cannot count comments with this status filter"
            );
          } else if (options?.onBeforeList) {
            await runHookWithShim(
              () => options.onBeforeList(
                { ...ctx.query, status: ctx.query.status },
                context
              ),
              ctx.error,
              "Forbidden: Cannot count comments"
            );
          }
          const count = await getCommentCount(adapter, ctx.query);
          return { count };
        }
      );
      const toggleLikeEndpoint = createEndpoint(
        "/comments/:id/like",
        {
          method: "POST",
          body: object({ authorId: string().min(1) })
        },
        async (ctx) => {
          const { id } = ctx.params;
          const context = {
            params: ctx.params,
            body: ctx.body,
            headers: ctx.headers
          };
          if (!options?.onBeforeLike) {
            throw ctx.error(403, {
              message: "Forbidden: toggling likes requires the onBeforeLike hook"
            });
          }
          await runHookWithShim(
            () => options.onBeforeLike(id, ctx.body.authorId, context),
            ctx.error,
            "Unauthorized: Cannot like comment"
          );
          const result = await toggleCommentLike(
            adapter,
            id,
            ctx.body.authorId
          );
          return result;
        }
      );
      const updateStatusEndpoint = createEndpoint(
        "/comments/:id/status",
        {
          method: "PATCH",
          body: updateCommentStatusSchema
        },
        async (ctx) => {
          const { id } = ctx.params;
          const context = {
            params: ctx.params,
            body: ctx.body,
            headers: ctx.headers
          };
          if (!options?.onBeforeStatusChange) {
            throw ctx.error(403, {
              message: "Forbidden: changing comment status requires the onBeforeStatusChange hook"
            });
          }
          await runHookWithShim(
            () => options.onBeforeStatusChange(id, ctx.body.status, context),
            ctx.error,
            "Unauthorized: Cannot change comment status"
          );
          const updated = await updateCommentStatus(
            adapter,
            id,
            ctx.body.status
          );
          if (!updated) {
            throw ctx.error(404, { message: "Comment not found" });
          }
          if (ctx.body.status === "approved" && options?.onAfterApprove) {
            await options.onAfterApprove(updated, context);
          }
          const serialized = await getCommentById(
            adapter,
            updated.id,
            options?.resolveUser
          );
          if (!serialized) {
            throw ctx.error(500, {
              message: "Failed to retrieve updated comment"
            });
          }
          return serialized;
        }
      );
      const deleteCommentEndpoint = createEndpoint(
        "/comments/:id",
        {
          method: "DELETE"
        },
        async (ctx) => {
          const { id } = ctx.params;
          const context = {
            params: ctx.params,
            headers: ctx.headers
          };
          if (!options?.onBeforeDelete) {
            throw ctx.error(403, {
              message: "Forbidden: deleting comments requires the onBeforeDelete hook"
            });
          }
          await runHookWithShim(
            () => options.onBeforeDelete(id, context),
            ctx.error,
            "Unauthorized: Cannot delete comment"
          );
          const deleted = await deleteComment(adapter, id);
          if (!deleted) {
            throw ctx.error(404, { message: "Comment not found" });
          }
          if (options?.onAfterDelete) {
            await options.onAfterDelete(id, context);
          }
          return { success: true };
        }
      );
      return {
        listComments: listCommentsEndpoint,
        ...postingEnabled && { createComment: createCommentEndpoint },
        ...editingEnabled && { updateComment: updateCommentEndpoint },
        getCommentCount: getCommentCountEndpoint,
        toggleLike: toggleLikeEndpoint,
        updateCommentStatus: updateStatusEndpoint,
        deleteComment: deleteCommentEndpoint
      };
    }
  });
};
const mediaSchema = createDbPlugin("media", {
  asset: {
    modelName: "mediaAsset",
    fields: {
      filename: {
        type: "string",
        required: true
      },
      originalName: {
        type: "string",
        required: true
      },
      mimeType: {
        type: "string",
        required: true
      },
      size: {
        type: "number",
        required: true
      },
      url: {
        type: "string",
        required: true
      },
      folderId: {
        type: "string",
        required: false,
        references: {
          model: "mediaFolder",
          field: "id"
        }
      },
      alt: {
        type: "string",
        required: false
      },
      tenantId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  },
  folder: {
    modelName: "mediaFolder",
    fields: {
      name: {
        type: "string",
        required: true
      },
      parentId: {
        type: "string",
        required: false,
        references: {
          model: "mediaFolder",
          field: "id"
        }
      },
      tenantId: {
        type: "string",
        required: false
      },
      createdAt: {
        type: "date",
        defaultValue: () => /* @__PURE__ */ new Date()
      }
    }
  }
});
const AssetListQuerySchema = object({
  folderId: string().optional(),
  mimeType: string().optional(),
  query: string().optional(),
  offset: number().int().min(0).optional(),
  limit: number().int().min(1).max(100).optional()
});
const createAssetSchema = object({
  filename: string().min(1),
  originalName: string().min(1),
  mimeType: string().min(1),
  // Allow 0 for URL-registered assets where size is unknown at registration time.
  size: number$1().int().min(0),
  url: httpUrl(),
  folderId: string().optional(),
  alt: string().optional()
});
const updateAssetSchema = object({
  alt: string().optional(),
  folderId: string().nullable().optional()
});
const createFolderSchema = object({
  name: string().min(1),
  parentId: string().optional()
});
const uploadTokenRequestSchema = object({
  filename: string().min(1),
  mimeType: string().min(1),
  size: number$1().int().positive(),
  folderId: string().optional()
});
async function listAssets(adapter, params) {
  const query = params ?? {};
  const whereConditions = [];
  if (query.folderId !== void 0) {
    whereConditions.push({
      field: "folderId",
      value: query.folderId,
      operator: "eq"
    });
  }
  if (query.mimeType) {
    whereConditions.push({
      field: "mimeType",
      value: query.mimeType,
      operator: "eq"
    });
  }
  if (query.tenantId !== void 0) {
    whereConditions.push({
      field: "tenantId",
      value: query.tenantId,
      operator: "eq"
    });
  }
  const needsInMemoryFilter = !!query.query;
  const dbWhere = whereConditions.length > 0 ? whereConditions : void 0;
  const dbTotal = !needsInMemoryFilter ? await adapter.count({ model: "mediaAsset", where: dbWhere }) : void 0;
  let assets = await adapter.findMany({
    model: "mediaAsset",
    limit: !needsInMemoryFilter ? query.limit : void 0,
    offset: !needsInMemoryFilter ? query.offset : void 0,
    where: dbWhere,
    sortBy: { field: "createdAt", direction: "desc" }
  });
  if (query.query) {
    const searchLower = query.query.toLowerCase();
    assets = assets.filter(
      (asset) => asset.filename.toLowerCase().includes(searchLower) || asset.originalName.toLowerCase().includes(searchLower) || asset.alt?.toLowerCase().includes(searchLower)
    );
  }
  if (needsInMemoryFilter) {
    const total = assets.length;
    const offset = query.offset ?? 0;
    const limit = query.limit;
    assets = assets.slice(
      offset,
      limit !== void 0 ? offset + limit : void 0
    );
    return { items: assets, total, limit: query.limit, offset: query.offset };
  }
  return {
    items: assets,
    total: dbTotal ?? assets.length,
    limit: query.limit,
    offset: query.offset
  };
}
async function getAssetById(adapter, id) {
  return adapter.findOne({
    model: "mediaAsset",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
}
async function listFolders(adapter, params) {
  const whereConditions = [];
  if (params?.parentId !== void 0) {
    whereConditions.push({
      field: "parentId",
      value: params.parentId,
      operator: "eq"
    });
  }
  if (params?.tenantId !== void 0) {
    whereConditions.push({
      field: "tenantId",
      value: params.tenantId,
      operator: "eq"
    });
  }
  return adapter.findMany({
    model: "mediaFolder",
    where: whereConditions.length > 0 ? whereConditions : void 0,
    sortBy: { field: "name", direction: "asc" }
  });
}
async function getFolderById(adapter, id) {
  return adapter.findOne({
    model: "mediaFolder",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
}
async function getFolderByName(adapter, name, parentId, tenantId) {
  const where = [{ field: "name", value: name, operator: "eq" }];
  if (parentId !== void 0) {
    where.push({ field: "parentId", value: parentId, operator: "eq" });
  }
  if (tenantId !== void 0) {
    where.push({ field: "tenantId", value: tenantId, operator: "eq" });
  }
  return adapter.findOne({ model: "mediaFolder", where });
}
async function createAsset(adapter, input) {
  return adapter.create({
    model: "mediaAsset",
    data: {
      filename: input.filename,
      originalName: input.originalName,
      mimeType: input.mimeType,
      size: input.size,
      url: input.url,
      folderId: input.folderId,
      alt: input.alt,
      tenantId: input.tenantId,
      createdAt: /* @__PURE__ */ new Date()
    }
  });
}
async function updateAsset(adapter, id, input) {
  const update = {};
  if (input.alt !== void 0) {
    update.alt = input.alt;
  }
  if ("folderId" in input) {
    update.folderId = input.folderId;
  }
  return adapter.update({
    model: "mediaAsset",
    where: [{ field: "id", value: id, operator: "eq" }],
    update
  });
}
async function deleteAsset(adapter, id) {
  await adapter.delete({
    model: "mediaAsset",
    where: [{ field: "id", value: id, operator: "eq" }]
  });
}
async function createFolder(adapter, input) {
  return adapter.create({
    model: "mediaFolder",
    data: {
      name: input.name,
      parentId: input.parentId,
      tenantId: input.tenantId,
      createdAt: /* @__PURE__ */ new Date()
    }
  });
}
async function deleteFolder(adapter, id) {
  const allFolderIds = [id];
  const queue = [id];
  while (queue.length > 0) {
    const parentId = queue.shift();
    const children = await adapter.findMany({
      model: "mediaFolder",
      where: [{ field: "parentId", value: parentId, operator: "eq" }]
    });
    for (const child of children) {
      allFolderIds.push(child.id);
      queue.push(child.id);
    }
  }
  let totalAssets = 0;
  for (const folderId of allFolderIds) {
    totalAssets += await adapter.count({
      model: "mediaAsset",
      where: [{ field: "folderId", value: folderId, operator: "eq" }]
    });
  }
  if (totalAssets > 0) {
    throw new Error(
      `Cannot delete folder: it or one of its subfolders contains ${totalAssets} asset(s). Move or delete them first.`
    );
  }
  await adapter.transaction(async (tx) => {
    for (const folderId of [...allFolderIds].reverse()) {
      await tx.delete({
        model: "mediaFolder",
        where: [{ field: "id", value: folderId, operator: "eq" }]
      });
    }
  });
}
function isDirectAdapter(adapter) {
  return adapter.type === "local";
}
function isS3Adapter(adapter) {
  return adapter.type === "s3";
}
function isVercelBlobAdapter(adapter) {
  return adapter.type === "vercel-blob";
}
function sanitizeS3KeySegment(s) {
  return s.replace(/[/\\]/g, "-").replace(/\.\./g, "_").trim() || "unknown";
}
function matchesUrlPrefix(url, prefix) {
  const trimmedPrefix = prefix.trim();
  if (!trimmedPrefix) return false;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmedPrefix)) {
    if (trimmedPrefix.endsWith("://")) {
      return url.startsWith(trimmedPrefix);
    }
    const normalizedPrefix2 = trimmedPrefix.replace(/\/+$/, "");
    return url === normalizedPrefix2 || url.startsWith(`${normalizedPrefix2}/`);
  }
  const normalizedPrefix = `${trimmedPrefix.replace(/\/+$/, "")}/`;
  return url.startsWith(normalizedPrefix);
}
const mediaBackendPlugin = (config) => defineBackendPlugin({
  name: "media",
  dbPlugin: mediaSchema,
  api: (adapter) => ({
    listAssets: (params) => listAssets(adapter, params),
    getAssetById: (id) => getAssetById(adapter, id),
    createAsset: (input) => createAsset(adapter, input),
    updateAsset: (id, input) => updateAsset(adapter, id, input),
    listFolders: (params) => listFolders(adapter, params),
    getFolderById: (id) => getFolderById(adapter, id),
    getFolderByName: (name, parentId, tenantId) => getFolderByName(adapter, name, parentId, tenantId),
    createFolder: (input) => createFolder(adapter, input)
  }),
  routes: (adapter) => {
    const {
      storageAdapter,
      maxFileSizeBytes = 10 * 1024 * 1024,
      allowedMimeTypes,
      allowedUrlPrefixes,
      hooks,
      resolveTenantId
    } = config;
    function validateMimeType(mimeType, ctx) {
      if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        const allowed = allowedMimeTypes.some((pattern) => {
          if (pattern.endsWith("/*")) {
            return mimeType.startsWith(pattern.slice(0, -1));
          }
          return mimeType === pattern;
        });
        if (!allowed) {
          throw ctx.error(415, {
            message: `MIME type '${mimeType}' is not allowed. Allowed: ${allowedMimeTypes.join(", ")}`
          });
        }
      }
    }
    const listAssetsEndpoint = createEndpoint(
      "/media/assets",
      {
        method: "GET",
        query: AssetListQuerySchema
      },
      async (ctx) => {
        const { query, headers } = ctx;
        const context = { query, headers };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeListAssets) {
          await runHookWithShim(
            () => hooks.onBeforeListAssets(query, context),
            ctx.error,
            "Unauthorized: Cannot list assets"
          );
        }
        return listAssets(adapter, { ...query, tenantId });
      }
    );
    const createAssetEndpoint = createEndpoint(
      "/media/assets",
      {
        method: "POST",
        body: createAssetSchema
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeUpload) {
          await runHookWithShim(
            () => hooks.onBeforeUpload(
              {
                filename: ctx.body.filename,
                mimeType: ctx.body.mimeType,
                size: ctx.body.size
              },
              context
            ),
            ctx.error,
            "Unauthorized: Cannot upload asset"
          );
        }
        validateMimeType(ctx.body.mimeType, ctx);
        if (ctx.body.size > maxFileSizeBytes) {
          throw ctx.error(413, {
            message: `File size ${ctx.body.size} bytes exceeds the limit of ${maxFileSizeBytes} bytes`
          });
        }
        {
          const url = ctx.body.url;
          let urlAllowed = true;
          let denialReason = "";
          if (allowedUrlPrefixes && allowedUrlPrefixes.length > 0) {
            urlAllowed = allowedUrlPrefixes.some(
              (p) => matchesUrlPrefix(url, p)
            );
            denialReason = `URL must start with one of: ${allowedUrlPrefixes.join(", ")}`;
          } else if (isDirectAdapter(storageAdapter)) {
            urlAllowed = false;
            denialReason = "Client-supplied asset URLs are not allowed with localAdapter. Use POST /media/upload instead, or configure allowedUrlPrefixes to explicitly allow trusted URL prefixes.";
          } else if (isS3Adapter(storageAdapter)) {
            urlAllowed = matchesUrlPrefix(url, storageAdapter.urlPrefix);
            denialReason = `URL must start with the configured S3 publicBaseUrl: ${storageAdapter.urlPrefix}`;
          } else if (isVercelBlobAdapter(storageAdapter)) {
            try {
              const hostname = new URL(url).hostname;
              urlAllowed = hostname.endsWith(
                storageAdapter.urlHostnameSuffix
              );
            } catch {
              urlAllowed = false;
            }
            denialReason = `URL hostname must end with ${storageAdapter.urlHostnameSuffix}`;
          }
          if (!urlAllowed) {
            throw ctx.error(400, { message: denialReason });
          }
        }
        if (ctx.body.folderId) {
          const folder = await getFolderById(adapter, ctx.body.folderId);
          if (!folder) {
            throw ctx.error(404, { message: "Folder not found" });
          }
          if (tenantId !== void 0 && folder.tenantId !== tenantId) {
            throw ctx.error(404, { message: "Folder not found" });
          }
        }
        const asset = await createAsset(adapter, { ...ctx.body, tenantId });
        if (hooks?.onAfterUpload) {
          await hooks.onAfterUpload(asset, context);
        }
        return asset;
      }
    );
    const updateAssetEndpoint = createEndpoint(
      "/media/assets/:id",
      {
        method: "PATCH",
        body: updateAssetSchema
      },
      async (ctx) => {
        const existing = await getAssetById(adapter, ctx.params.id);
        if (!existing) {
          throw ctx.error(404, { message: "Asset not found" });
        }
        const context = {
          body: ctx.body,
          params: ctx.params,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (tenantId !== void 0 && existing.tenantId !== tenantId) {
          throw ctx.error(404, { message: "Asset not found" });
        }
        if (hooks?.onBeforeUpdateAsset) {
          await runHookWithShim(
            () => hooks.onBeforeUpdateAsset(existing, ctx.body, context),
            ctx.error,
            "Unauthorized: Cannot update asset"
          );
        }
        if (ctx.body.folderId != null) {
          const folder = await getFolderById(adapter, ctx.body.folderId);
          if (!folder) {
            throw ctx.error(404, { message: "Folder not found" });
          }
          if (tenantId !== void 0 && folder.tenantId !== tenantId) {
            throw ctx.error(404, { message: "Folder not found" });
          }
        }
        const updated = await updateAsset(adapter, ctx.params.id, ctx.body);
        if (!updated) {
          throw ctx.error(404, { message: "Asset not found" });
        }
        return updated;
      }
    );
    const deleteAssetEndpoint = createEndpoint(
      "/media/assets/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        const context = {
          params: ctx.params,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        const asset = await getAssetById(adapter, ctx.params.id);
        if (!asset) {
          throw ctx.error(404, { message: "Asset not found" });
        }
        if (tenantId !== void 0 && asset.tenantId !== tenantId) {
          throw ctx.error(404, { message: "Asset not found" });
        }
        if (hooks?.onBeforeDelete) {
          await runHookWithShim(
            () => hooks.onBeforeDelete(asset, context),
            ctx.error,
            "Unauthorized: Cannot delete asset"
          );
        }
        try {
          await storageAdapter.delete(asset.url);
        } catch (err) {
          console.error(
            `[btst/media] Failed to delete file from storage: ${asset.url}`,
            err
          );
          throw ctx.error(500, {
            message: "Failed to delete file from storage"
          });
        }
        await deleteAsset(adapter, ctx.params.id);
        if (hooks?.onAfterDelete) {
          await hooks.onAfterDelete(ctx.params.id, context);
        }
        return { success: true };
      }
    );
    const listFoldersEndpoint = createEndpoint(
      "/media/folders",
      {
        method: "GET",
        query: object({
          parentId: string().optional()
        })
      },
      async (ctx) => {
        const filter = { parentId: ctx.query.parentId };
        const context = {
          query: ctx.query,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeListFolders) {
          await runHookWithShim(
            () => hooks.onBeforeListFolders(filter, context),
            ctx.error,
            "Unauthorized: Cannot list folders"
          );
        }
        return listFolders(adapter, { ...filter, tenantId });
      }
    );
    const createFolderEndpoint = createEndpoint(
      "/media/folders",
      {
        method: "POST",
        body: createFolderSchema
      },
      async (ctx) => {
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeCreateFolder) {
          await runHookWithShim(
            () => hooks.onBeforeCreateFolder(ctx.body, context),
            ctx.error,
            "Unauthorized: Cannot create folder"
          );
        }
        if (ctx.body.parentId) {
          const folder = await getFolderById(adapter, ctx.body.parentId);
          if (!folder) {
            throw ctx.error(404, { message: "Folder not found" });
          }
          if (tenantId !== void 0 && folder.tenantId !== tenantId) {
            throw ctx.error(404, { message: "Folder not found" });
          }
        }
        return createFolder(adapter, { ...ctx.body, tenantId });
      }
    );
    const deleteFolderEndpoint = createEndpoint(
      "/media/folders/:id",
      {
        method: "DELETE"
      },
      async (ctx) => {
        const context = {
          params: ctx.params,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        const folder = await getFolderById(adapter, ctx.params.id);
        if (!folder) {
          throw ctx.error(404, { message: "Folder not found" });
        }
        if (tenantId !== void 0 && folder.tenantId !== tenantId) {
          throw ctx.error(404, { message: "Folder not found" });
        }
        if (hooks?.onBeforeDeleteFolder) {
          await runHookWithShim(
            () => hooks.onBeforeDeleteFolder(folder, context),
            ctx.error,
            "Unauthorized: Cannot delete folder"
          );
        }
        try {
          await deleteFolder(adapter, ctx.params.id);
        } catch (err) {
          throw ctx.error(409, {
            message: err instanceof Error ? err.message : "Cannot delete folder"
          });
        }
        return { success: true };
      }
    );
    const uploadDirectEndpoint = createEndpoint(
      "/media/upload",
      {
        method: "POST",
        metadata: {
          // Tell Better Call this endpoint accepts multipart/form-data so it
          // parses the body into a FormData object and exposes it as ctx.body.
          // Without this, Better Call may pre-read the body stream and calling
          // ctx.request.formData() afterwards fails with "Body already read".
          allowedMediaTypes: ["multipart/form-data"]
        }
      },
      async (ctx) => {
        if (!isDirectAdapter(storageAdapter)) {
          throw ctx.error(400, {
            message: "Direct upload is only supported with the local storage adapter"
          });
        }
        const body = ctx.body;
        if (!body || typeof body !== "object") {
          throw ctx.error(400, {
            message: "Expected multipart/form-data request body"
          });
        }
        const fileRaw = body.file;
        if (!fileRaw || typeof fileRaw !== "object" || typeof fileRaw.arrayBuffer !== "function") {
          throw ctx.error(400, {
            message: "Missing 'file' field in form data"
          });
        }
        if (typeof fileRaw.size !== "number" || fileRaw.size < 0) {
          throw ctx.error(400, {
            message: "File 'size' is missing or invalid"
          });
        }
        if (typeof fileRaw.name !== "string" || !fileRaw.name) {
          throw ctx.error(400, {
            message: "File 'name' is missing or invalid"
          });
        }
        if (typeof fileRaw.type !== "string") {
          throw ctx.error(400, {
            message: "File 'type' is missing or invalid"
          });
        }
        const file = fileRaw;
        const context = { headers: ctx.headers };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeUpload) {
          await runHookWithShim(
            () => hooks.onBeforeUpload(
              {
                filename: file.name,
                mimeType: file.type,
                size: file.size
              },
              context
            ),
            ctx.error,
            "Unauthorized: Cannot upload asset"
          );
        }
        validateMimeType(file.type, ctx);
        if (file.size > maxFileSizeBytes) {
          throw ctx.error(413, {
            message: `File size ${file.size} bytes exceeds the limit of ${maxFileSizeBytes} bytes`
          });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const folderId = typeof body.folderId === "string" && body.folderId ? body.folderId : void 0;
        if (folderId) {
          const folder = await getFolderById(adapter, folderId);
          if (!folder) {
            throw ctx.error(404, { message: "Folder not found" });
          }
          if (tenantId !== void 0 && folder.tenantId !== tenantId) {
            throw ctx.error(404, { message: "Folder not found" });
          }
        }
        const { url } = await storageAdapter.upload(buffer, {
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          folderId
        });
        let asset;
        try {
          asset = await createAsset(adapter, {
            filename: url.split("/").pop() ?? file.name,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url,
            folderId,
            tenantId
          });
        } catch (err) {
          try {
            await storageAdapter.delete(url);
          } catch (cleanupErr) {
            console.error(
              `[btst/media] Failed to clean up orphaned storage file after DB error: ${url}`,
              cleanupErr
            );
          }
          throw err;
        }
        if (hooks?.onAfterUpload) {
          await hooks.onAfterUpload(asset, context);
        }
        return asset;
      }
    );
    const uploadTokenEndpoint = createEndpoint(
      "/media/upload/token",
      {
        method: "POST",
        body: uploadTokenRequestSchema
      },
      async (ctx) => {
        if (!isS3Adapter(storageAdapter)) {
          throw ctx.error(400, {
            message: "Upload token endpoint is only supported with the S3 storage adapter"
          });
        }
        const context = {
          body: ctx.body,
          headers: ctx.headers
        };
        const tenantId = resolveTenantId ? await resolveTenantId(context) ?? void 0 : void 0;
        if (hooks?.onBeforeUpload) {
          await runHookWithShim(
            () => hooks.onBeforeUpload(
              {
                filename: ctx.body.filename,
                mimeType: ctx.body.mimeType,
                size: ctx.body.size
              },
              context
            ),
            ctx.error,
            "Unauthorized: Cannot upload asset"
          );
        }
        validateMimeType(ctx.body.mimeType, ctx);
        if (ctx.body.size > maxFileSizeBytes) {
          throw ctx.error(413, {
            message: `File size ${ctx.body.size} bytes exceeds the limit of ${maxFileSizeBytes} bytes`
          });
        }
        let folderId = ctx.body.folderId;
        if (folderId) {
          const folder = await getFolderById(adapter, folderId);
          if (!folder) {
            throw ctx.error(404, {
              message: "Folder not found"
            });
          }
          if (tenantId !== void 0 && folder.tenantId !== tenantId) {
            throw ctx.error(404, { message: "Folder not found" });
          }
          folderId = folder.id;
        }
        const filename = sanitizeS3KeySegment(ctx.body.filename);
        return storageAdapter.generateUploadToken({
          filename,
          mimeType: ctx.body.mimeType,
          size: ctx.body.size,
          folderId
        });
      }
    );
    const uploadVercelBlobEndpoint = createEndpoint(
      "/media/upload/vercel-blob",
      {
        method: "POST"
      },
      async (ctx) => {
        if (!isVercelBlobAdapter(storageAdapter)) {
          throw ctx.error(400, {
            message: "Vercel Blob endpoint is only supported with the vercelBlobAdapter"
          });
        }
        const context = { headers: ctx.headers };
        if (resolveTenantId) {
          await resolveTenantId(context);
        }
        if (!ctx.request) {
          throw ctx.error(400, {
            message: "Request object is not available"
          });
        }
        return storageAdapter.handleRequest(ctx.request, ctx.body, {
          onBeforeGenerateToken: async (pathname, clientPayload) => {
            const filename = pathname.split("/").pop() ?? pathname;
            let parsed = {};
            try {
              parsed = clientPayload ? JSON.parse(clientPayload) : {};
            } catch {
            }
            const mimeType = parsed.mimeType ?? "application/octet-stream";
            const size = parsed.size;
            if (hooks?.onBeforeUpload) {
              await runHookWithShim(
                () => hooks.onBeforeUpload(
                  { filename, mimeType, size },
                  context
                ),
                ctx.error,
                "Unauthorized: Cannot upload asset"
              );
            }
            validateMimeType(mimeType, ctx);
            if (size != null && size > maxFileSizeBytes) {
              throw ctx.error(413, {
                message: `File size ${size} bytes exceeds the limit of ${maxFileSizeBytes} bytes`
              });
            }
            return {
              addRandomSuffix: true,
              allowedContentTypes: allowedMimeTypes && allowedMimeTypes.length > 0 ? allowedMimeTypes : void 0,
              maximumSizeInBytes: maxFileSizeBytes
            };
          }
        });
      }
    );
    return {
      listAssets: listAssetsEndpoint,
      createAsset: createAssetEndpoint,
      updateAsset: updateAssetEndpoint,
      deleteAsset: deleteAssetEndpoint,
      listFolders: listFoldersEndpoint,
      createFolder: createFolderEndpoint,
      deleteFolder: deleteFolderEndpoint,
      uploadDirect: uploadDirectEndpoint,
      uploadToken: uploadTokenEndpoint,
      uploadVercelBlob: uploadVercelBlobEndpoint
    };
  }
});
const openApiSchema = createDbPlugin("openApi", {});
function toOpenApiPath(path) {
  return path.split("/").map((part) => part.startsWith(":") ? `{${part.slice(1)}}` : part).join("/");
}
function getTypeFromZodType(zodType) {
  if (zodType instanceof ZodString) return "string";
  if (zodType instanceof ZodNumber) return "number";
  if (zodType instanceof ZodBoolean) return "boolean";
  if (zodType instanceof ZodArray) return "array";
  if (zodType instanceof ZodObject) return "object";
  const type = zodType.type;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "array") return "array";
  if (type === "object") return "object";
  return "string";
}
function processZodType(zodType) {
  if (zodType instanceof ZodOptional) {
    const innerType = zodType._def?.innerType || zodType.unwrap?.();
    if (innerType) {
      return processZodType(innerType);
    }
  }
  if (zodType instanceof ZodNullable) {
    const innerType = zodType._def?.innerType || zodType.unwrap?.();
    if (innerType) {
      const innerSchema = processZodType(innerType);
      return {
        ...innerSchema,
        nullable: true
      };
    }
  }
  if (zodType instanceof ZodDefault) {
    const innerType = zodType._def?.innerType;
    const rawDefault = zodType._def?.defaultValue;
    const defaultValue = typeof rawDefault === "function" ? rawDefault() : rawDefault;
    if (innerType) {
      const innerSchema = processZodType(innerType);
      if (defaultValue !== void 0) {
        return {
          ...innerSchema,
          default: defaultValue
        };
      }
      return innerSchema;
    }
  }
  if (zodType instanceof ZodObject) {
    const shape = zodType.shape || zodType._def?.shape?.();
    if (shape) {
      const properties = {};
      const required = [];
      for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZodType) {
          properties[key] = processZodType(value);
          if (!(value instanceof ZodOptional)) {
            required.push(key);
          }
        }
      }
      return {
        type: "object",
        properties,
        ...required.length > 0 ? { required } : {}
      };
    }
  }
  if (zodType instanceof ZodArray) {
    const elementType = zodType._def?.type || zodType.element;
    return {
      type: "array",
      items: elementType ? processZodType(elementType) : { type: "string" }
    };
  }
  if (zodType instanceof ZodEnum) {
    const values = zodType._def?.values || zodType.options;
    return {
      type: "string",
      enum: values
    };
  }
  if (zodType instanceof ZodLiteral) {
    const value = zodType._def?.value || zodType.value;
    let type;
    if (value === null) {
      type = "null";
    } else if (value === void 0) {
      return { nullable: true };
    } else {
      type = typeof value;
    }
    return {
      type,
      const: value
    };
  }
  if (zodType instanceof ZodUnion) {
    const options = zodType._def?.options || zodType.options;
    if (options && Array.isArray(options)) {
      return {
        oneOf: options.map((opt) => processZodType(opt))
      };
    }
  }
  if (zodType._def?.coerce) {
    const innerType = zodType._def?.innerType;
    if (innerType) {
      return processZodType(innerType);
    }
  }
  return {
    type: getTypeFromZodType(zodType)
  };
}
function getParameters(options) {
  const parameters = [];
  if (options.query instanceof ZodObject) {
    const shape = options.query.shape || options.query._def?.shape?.();
    if (shape) {
      for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZodType) {
          parameters.push({
            name: key,
            in: "query",
            required: !(value instanceof ZodOptional),
            schema: processZodType(value)
          });
        }
      }
    }
  }
  if (options.params instanceof ZodObject) {
    const shape = options.params.shape || options.params._def?.shape?.();
    if (shape) {
      for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZodType) {
          parameters.push({
            name: key,
            in: "path",
            required: true,
            schema: processZodType(value)
          });
        }
      }
    }
  }
  return parameters;
}
function getRequestBody(options) {
  if (!options.body) return void 0;
  if (options.body instanceof ZodType) {
    const schema2 = processZodType(options.body);
    const isOptional = options.body instanceof ZodOptional;
    return {
      required: !isOptional,
      content: {
        "application/json": {
          schema: schema2
        }
      }
    };
  }
  return void 0;
}
function createErrorSchema() {
  return {
    type: "object",
    properties: {
      message: { type: "string" }
    },
    required: ["message"]
  };
}
function getErrorResponses() {
  return {
    "400": {
      description: "Bad Request",
      content: { "application/json": { schema: createErrorSchema() } }
    },
    "401": {
      description: "Unauthorized",
      content: { "application/json": { schema: createErrorSchema() } }
    },
    "403": {
      description: "Forbidden",
      content: { "application/json": { schema: createErrorSchema() } }
    },
    "404": {
      description: "Not Found",
      content: { "application/json": { schema: createErrorSchema() } }
    },
    "500": {
      description: "Internal Server Error",
      content: { "application/json": { schema: createErrorSchema() } }
    }
  };
}
function generateOpenAPISchema(context, options) {
  const paths = {};
  const tags = [];
  for (const [pluginKey, plugin] of Object.entries(context.plugins)) {
    if (pluginKey === "openApi" || plugin.name === "open-api") {
      continue;
    }
    const pluginRoutes = plugin.routes(context.adapter, context);
    const tagName = pluginKey.charAt(0).toUpperCase() + pluginKey.slice(1);
    tags.push({
      name: tagName,
      description: `${tagName} plugin endpoints`
    });
    for (const [routeKey, endpoint] of Object.entries(pluginRoutes)) {
      const ep = endpoint;
      const path = ep.path;
      const endpointOptions = ep.options || {};
      const method = (endpointOptions.method || "GET").toLowerCase();
      if (!path) continue;
      const openApiPath = toOpenApiPath(path);
      if (!paths[openApiPath]) {
        paths[openApiPath] = {};
      }
      const operation = {
        tags: [tagName],
        operationId: `${pluginKey}_${routeKey}`,
        summary: endpointOptions.metadata?.openapi?.summary,
        description: endpointOptions.metadata?.openapi?.description,
        parameters: getParameters(endpointOptions),
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { type: "object" }
              }
            }
          },
          ...getErrorResponses()
        }
      };
      if (["post", "put", "patch"].includes(method)) {
        const requestBody = getRequestBody(endpointOptions);
        if (requestBody) {
          operation.requestBody = requestBody;
        }
      }
      paths[openApiPath][method] = operation;
    }
  }
  return {
    openapi: "3.1.0",
    info: {
      title: options?.title || "BTST API",
      description: options?.description || "API Reference for your BTST application",
      version: options?.version || "1.0.0"
    },
    servers: [
      {
        url: context.basePath,
        description: "API Server"
      }
    ],
    tags,
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Bearer token authentication"
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session",
          description: "Session cookie authentication"
        }
      }
    }
  };
}
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" rx="20" fill="#0ea5e9"/>
  <path d="M25 35h50M25 50h50M25 65h35" stroke="white" stroke-width="8" stroke-linecap="round"/>
</svg>`;
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeJsonForHtml(json) {
  return json.replace(/</g, "\\u003c");
}
function getScalarHTML(schema2, theme = "default", nonce) {
  const nonceAttr = "";
  const encodedLogo = encodeURIComponent(logo);
  const title = schema2.info?.title || "API Reference";
  const description = schema2.info?.description || "API Reference";
  return `<!doctype html>
<html>
  <head>
    <title>${escapeHtml(title)}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json"${nonceAttr}>
    ${escapeJsonForHtml(JSON.stringify(schema2))}
    <\/script>
    <script${nonceAttr}>
      var configuration = {
        favicon: "data:image/svg+xml;utf8,${encodedLogo}",
        theme: "${theme}",
        metaData: {
          title: ${JSON.stringify(title)},
          description: ${JSON.stringify(description)},
        }
      }

      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    <\/script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"${nonceAttr}><\/script>
  </body>
</html>`;
}
const openApiBackendPlugin = (options) => {
  const referencePath = "/reference";
  let storedContext = null;
  return defineBackendPlugin({
    name: "open-api",
    dbPlugin: openApiSchema,
    routes: (_adapter, context) => {
      storedContext = context ?? null;
      const generateSchema2 = createEndpoint(
        "/open-api/schema",
        {
          method: "GET"
        },
        async (ctx) => {
          if (!storedContext) {
            throw ctx.error(500, {
              message: "OpenAPI context not available"
            });
          }
          const schema2 = generateOpenAPISchema(storedContext, {
            title: options?.title,
            description: options?.description,
            version: options?.version
          });
          return schema2;
        }
      );
      const reference = createEndpoint(
        referencePath,
        {
          method: "GET"
        },
        async (ctx) => {
          if (!storedContext) {
            throw ctx.error(500, {
              message: "OpenAPI context not available"
            });
          }
          const schema2 = generateOpenAPISchema(storedContext, {
            title: options?.title,
            description: options?.description,
            version: options?.version
          });
          return new Response(
            getScalarHTML(schema2, options?.theme),
            {
              headers: {
                "Content-Type": "text/html; charset=utf-8"
              }
            }
          );
        }
      );
      return {
        generateSchema: generateSchema2,
        reference
      };
    }
  });
};
const post = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").default("").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  published: boolean$1("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const postTag = pgTable("post_tag", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tag.id, { onDelete: "cascade" })
});
const contentType = pgTable("content_type", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  jsonSchema: text("json_schema").notNull(),
  fieldConfig: text("field_config"),
  autoFormVersion: integer("auto_form_version"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const contentItem = pgTable("content_item", {
  id: text("id").primaryKey(),
  contentTypeId: text("content_type_id").notNull().references(() => contentType.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  data: text("data").notNull(),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const contentRelation = pgTable("content_relation", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().references(() => contentItem.id, { onDelete: "cascade" }),
  targetId: text("target_id").notNull().references(() => contentItem.id, { onDelete: "cascade" }),
  fieldName: text("field_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const form = pgTable("form", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  schema: text("schema").notNull(),
  successMessage: text("success_message"),
  redirectUrl: text("redirect_url"),
  status: text("status").default("active").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const formSubmission = pgTable("form_submission", {
  id: text("id").primaryKey(),
  formId: text("form_id").notNull().references(() => form.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  submittedBy: text("submitted_by"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent")
});
const kanbanBoard = pgTable("kanban_board", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ownerId: text("owner_id"),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const kanbanColumn = pgTable("kanban_column", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").default(0).notNull(),
  boardId: text("board_id").notNull().references(() => kanbanBoard.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const kanbanTask = pgTable("kanban_task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("MEDIUM").notNull(),
  order: integer("order").default(0).notNull(),
  columnId: text("column_id").notNull().references(() => kanbanColumn.id, { onDelete: "cascade" }),
  assigneeId: text("assignee_id"),
  completedAt: timestamp("completed_at"),
  isArchived: boolean$1("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const comment = pgTable("comment", {
  id: text("id").primaryKey(),
  resourceId: text("resource_id").notNull(),
  resourceType: text("resource_type").notNull(),
  parentId: text("parent_id"),
  authorId: text("author_id").notNull(),
  body: text("body").notNull(),
  status: text("status").default("pending").notNull(),
  likes: integer("likes").default(0).notNull(),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const commentLike = pgTable("comment_like", {
  id: text("id").primaryKey(),
  commentId: text("comment_id").notNull().references(() => comment.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  folderId: text("folder_id").references(() => mediaFolder.id, {
    onDelete: "cascade"
  }),
  alt: text("alt"),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const mediaFolder = pgTable("media_folder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id").references(() => mediaFolder.id, {
    onDelete: "cascade"
  }),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const postRelations = relations(post, ({ many }) => ({
  postTags: many(postTag)
}));
const tagRelations = relations(tag, ({ many }) => ({
  postTags: many(postTag)
}));
const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, {
    fields: [postTag.postId],
    references: [post.id]
  }),
  tag: one(tag, {
    fields: [postTag.tagId],
    references: [tag.id]
  })
}));
const contentTypeRelations = relations(contentType, ({ many }) => ({
  contentItems: many(contentItem)
}));
const contentItemRelations = relations(contentItem, ({ one, many }) => ({
  contentType: one(contentType, {
    fields: [contentItem.contentTypeId],
    references: [contentType.id]
  }),
  contentRelations: many(contentRelation)
}));
const contentRelationSourceIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.sourceId],
      references: [contentItem.id]
    })
  })
);
const contentRelationTargetIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.targetId],
      references: [contentItem.id]
    })
  })
);
const formRelations = relations(form, ({ many }) => ({
  formSubmissions: many(formSubmission)
}));
const formSubmissionRelations = relations(formSubmission, ({ one }) => ({
  form: one(form, {
    fields: [formSubmission.formId],
    references: [form.id]
  })
}));
const kanbanBoardRelations = relations(kanbanBoard, ({ many }) => ({
  kanbanColumns: many(kanbanColumn)
}));
const kanbanColumnRelations = relations(
  kanbanColumn,
  ({ one, many }) => ({
    kanbanBoard: one(kanbanBoard, {
      fields: [kanbanColumn.boardId],
      references: [kanbanBoard.id]
    }),
    kanbanTasks: many(kanbanTask)
  })
);
const kanbanTaskRelations = relations(kanbanTask, ({ one }) => ({
  kanbanColumn: one(kanbanColumn, {
    fields: [kanbanTask.columnId],
    references: [kanbanColumn.id]
  })
}));
const commentRelations = relations(comment, ({ many }) => ({
  commentLikes: many(commentLike)
}));
const commentLikeRelations = relations(commentLike, ({ one }) => ({
  comment: one(comment, {
    fields: [commentLike.commentId],
    references: [comment.id]
  })
}));
const mediaAssetRelations = relations(mediaAsset, ({ one }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaAsset.folderId],
    references: [mediaFolder.id]
  })
}));
const mediaFolderRelations = relations(mediaFolder, ({ one, many }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaFolder.parentId],
    references: [mediaFolder.id]
  }),
  mediaAssets: many(mediaAsset)
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  comment,
  commentLike,
  commentLikeRelations,
  commentRelations,
  contentItem,
  contentItemRelations,
  contentRelation,
  contentRelationSourceIdRelations,
  contentRelationTargetIdRelations,
  contentType,
  contentTypeRelations,
  form,
  formRelations,
  formSubmission,
  formSubmissionRelations,
  kanbanBoard,
  kanbanBoardRelations,
  kanbanColumn,
  kanbanColumnRelations,
  kanbanTask,
  kanbanTaskRelations,
  mediaAsset,
  mediaAssetRelations,
  mediaFolder,
  mediaFolderRelations,
  post,
  postRelations,
  postTag,
  postTagRelations,
  tag,
  tagRelations
}, Symbol.toStringTag, { value: "Module" }));
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});
const drizzleDb = drizzle(pool, {
  schema
});
const myStack = stack({
  basePath: "/api/data",
  plugins: {
    blog: blogBackendPlugin(),
    cms: cmsBackendPlugin({ contentTypes: [{
      name: "Article",
      slug: "article",
      schema: object({
        title: string(),
        summary: string(),
        body: string(),
        publishedAt: string(),
        published: boolean()
      })
    }, UI_BUILDER_CONTENT_TYPE] }),
    formBuilder: formBuilderBackendPlugin(),
    kanban: kanbanBackendPlugin(),
    comments: commentsBackendPlugin({ allowPosting: false }),
    media: mediaBackendPlugin({ storageAdapter: void 0 }),
    openApi: openApiBackendPlugin()
  },
  adapter: (db) => createDrizzleAdapter(
    drizzleDb,
    db,
    {
      provider: "pg"
    }
  )({})
});
const { handler } = myStack;
let seeded$4 = false;
const Route$8 = createFileRoute("/api/seed-blog")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$4) return Response.json({ ok: true, skipped: true });
        seeded$4 = true;
        try {
          const result = await (async () => {
            const adapter = myStack.adapter;
            const existing = await adapter.findMany({ model: "post", limit: 1 });
            if (existing.length > 0) return { ok: true, skipped: true };
            const now = /* @__PURE__ */ new Date();
            await adapter.create({
              model: "post",
              data: {
                title: "Getting Started with BTST Blog",
                slug: "getting-started",
                content: `# Getting Started with BTST Blog

Welcome to the **BTST Blog plugin** demo! This post was seeded automatically when the server started.

## What you can do

- Browse published posts on this page
- Click a post to read the full article
- Use the **New Post** button to create your own post
- Edit or delete posts from the post detail page

## Markdown support

The editor supports full **Markdown** including code blocks, blockquotes, tables, lists, and headings.

Try creating a new post to see the editor in action!`,
                excerpt: "An introduction to the BTST blog plugin — browse posts, create new ones, and explore the Markdown editor.",
                published: true,
                publishedAt: now,
                createdAt: now,
                updatedAt: now
              }
            });
            await adapter.create({
              model: "post",
              data: {
                title: "Building Full-Stack Apps with Plugins",
                slug: "full-stack-plugins",
                content: `# Building Full-Stack Apps with Plugins

BTST takes a plugin-first approach to full-stack development. Each plugin ships with backend API routes, database schema, React components, and React Query hooks.

| Plugin | Description |
|--------|-------------|
| Blog | Markdown blog with drafts, tags, and RSS |
| AI Chat | Streaming AI conversations |
| CMS | Headless content management |
| Kanban | Project boards and task tracking |
| Form Builder | Dynamic forms with submissions |
| UI Builder | Visual drag-and-drop page builder |`,
                excerpt: "Explore how BTST plugins combine backend APIs, database schemas, and React components into one cohesive system.",
                published: true,
                publishedAt: new Date(now.getTime() - 864e5),
                createdAt: new Date(now.getTime() - 864e5),
                updatedAt: new Date(now.getTime() - 864e5)
              }
            });
            await adapter.create({
              model: "post",
              data: {
                title: "SEO and Meta Tags in BTST",
                slug: "seo-and-meta-tags",
                content: `# SEO and Meta Tags in BTST

BTST plugins generate proper meta tags for every page automatically including title, description, Open Graph, and Twitter card tags.`,
                excerpt: "BTST plugins generate Open Graph and Twitter card meta tags for every page automatically.",
                published: true,
                publishedAt: new Date(now.getTime() - 1728e5),
                createdAt: new Date(now.getTime() - 1728e5),
                updatedAt: new Date(now.getTime() - 1728e5)
              }
            });
            console.log("[seed] blog: 3 posts created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$4 = false;
          console.error("[seed] blog failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$3 = false;
const Route$7 = createFileRoute("/api/seed-cms")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$3) return Response.json({ ok: true, skipped: true });
        seeded$3 = true;
        try {
          const result = await (async () => {
            const api = myStack.api;
            const existing = await api.cms.getAllContentItems("article", { limit: 1 });
            if (existing.items && existing.items.length > 0) return { ok: true, skipped: true };
            await api.cms.createContentItem("article", { slug: "welcome-to-btst-cms", data: { title: "Welcome to BTST CMS", summary: "An introduction to managing structured content with the BTST CMS plugin.", body: "The BTST CMS plugin lets you define your content types as Zod schemas and get a fully functional headless CMS automatically.", publishedAt: (/* @__PURE__ */ new Date()).toISOString(), published: true } });
            await api.cms.createContentItem("article", { slug: "getting-started-with-content-types", data: { title: "Getting Started with Content Types", summary: "Learn how to define and manage content types in the BTST CMS plugin.", body: "Content types are defined as Zod schemas in your stack configuration. Each schema field maps to a form field in the CMS editor.", publishedAt: new Date(Date.now() - 864e5).toISOString(), published: true } });
            await api.cms.createContentItem("article", { slug: "headless-cms-benefits", data: { title: "Benefits of a Headless CMS", summary: "Explore why headless CMS architecture is ideal for modern web applications.", body: "A headless CMS separates content management from presentation, giving developers full control over how content is displayed.", publishedAt: new Date(Date.now() - 1728e5).toISOString(), published: false } });
            console.log("[seed] cms: 3 articles created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$3 = false;
          console.error("[seed] cms failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$2 = false;
const Route$6 = createFileRoute("/api/seed-form-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$2) return Response.json({ ok: true, skipped: true });
        seeded$2 = true;
        try {
          const result = await (async () => {
            const adapter = myStack.adapter;
            const existing = await adapter.findMany({ model: "form", limit: 1 });
            if (existing.length > 0) return { ok: true, skipped: true };
            const contactFormSchema = JSON.stringify({
              type: "object",
              properties: {
                name: { type: "string", title: "Your Name", "x-field-type": "text" },
                email: { type: "string", format: "email", title: "Email Address", "x-field-type": "text" },
                subject: { type: "string", title: "Subject", "x-field-type": "text" },
                message: { type: "string", title: "Message", "x-field-type": "textarea" },
                newsletter: { type: "boolean", title: "Subscribe to newsletter", "x-field-type": "switch", default: false }
              },
              required: ["name", "email", "message"]
            });
            const feedbackFormSchema = JSON.stringify({
              type: "object",
              properties: {
                rating: { type: "string", title: "Rating", "x-field-type": "select", enum: ["1", "2", "3", "4", "5"], enumNames: ["⭐ Poor", "⭐⭐ Fair", "⭐⭐⭐ Good", "⭐⭐⭐⭐ Very Good", "⭐⭐⭐⭐⭐ Excellent"] },
                category: { type: "string", title: "Category", "x-field-type": "radio", enum: ["product", "support", "documentation", "other"], enumNames: ["Product", "Support", "Documentation", "Other"] },
                comments: { type: "string", title: "Comments", "x-field-type": "textarea" }
              },
              required: ["rating", "category"]
            });
            const now = /* @__PURE__ */ new Date();
            await adapter.create({ model: "form", data: { name: "Contact Us", slug: "contact-us", description: "A simple contact form for getting in touch.", schema: contactFormSchema, successMessage: "Thanks for reaching out! We'll get back to you soon.", status: "active", createdAt: now, updatedAt: now } });
            await adapter.create({ model: "form", data: { name: "Feedback Form", slug: "feedback", description: "Share your feedback about our product and services.", schema: feedbackFormSchema, successMessage: "Thank you for your feedback!", status: "active", createdAt: new Date(now.getTime() - 864e5), updatedAt: new Date(now.getTime() - 864e5) } });
            console.log("[seed] form-builder: 2 forms created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$2 = false;
          console.error("[seed] form-builder failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded$1 = false;
const Route$5 = createFileRoute("/api/seed-kanban")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded$1) return Response.json({ ok: true, skipped: true });
        seeded$1 = true;
        try {
          const result = await (async () => {
            const { findOrCreateKanbanBoard: findOrCreateKanbanBoard2, getKanbanColumnsByBoardId: getKanbanColumnsByBoardId2, createKanbanTask: createKanbanTask2 } = await Promise.resolve().then(function() {
              return indexBD2v7dD;
            });
            const adapter = myStack.adapter;
            const board = await findOrCreateKanbanBoard2(adapter, "demo-board", "BTST Demo Board", ["To Do", "In Progress", "In Review", "Done"]);
            const columns = await getKanbanColumnsByBoardId2(adapter, board.id);
            if (!columns || columns.length === 0) return { ok: true, skipped: true };
            const todoCol = columns.find((c) => c.title === "To Do");
            const inProgressCol = columns.find((c) => c.title === "In Progress");
            const doneCol = columns.find((c) => c.title === "Done");
            if (!todoCol || !inProgressCol || !doneCol) return { ok: true, skipped: true };
            const existingTasks = await adapter.findMany({ model: "kanbanTask", where: [{ field: "columnId", value: todoCol.id, operator: "eq" }], limit: 1 });
            if (existingTasks.length > 0) return { ok: true, skipped: true };
            await createKanbanTask2(adapter, { title: "Set up the BTST stack", columnId: doneCol.id, description: "Install @btst/stack and configure the adapter", priority: "HIGH" });
            await createKanbanTask2(adapter, { title: "Add the Kanban plugin", columnId: doneCol.id, description: "Register kanbanBackendPlugin and kanbanClientPlugin", priority: "HIGH" });
            await createKanbanTask2(adapter, { title: "Configure custom columns", columnId: inProgressCol.id, description: "Customize the board columns to fit the team workflow", priority: "MEDIUM" });
            await createKanbanTask2(adapter, { title: "Invite team members", columnId: inProgressCol.id, description: "Add colleagues to the demo board", priority: "LOW" });
            await createKanbanTask2(adapter, { title: "Connect to a real database", columnId: todoCol.id, description: "Replace the in-memory adapter with Prisma, Drizzle, or another supported ORM", priority: "MEDIUM" });
            await createKanbanTask2(adapter, { title: "Add authentication", columnId: todoCol.id, description: "Protect the kanban routes with your auth solution", priority: "HIGH" });
            await createKanbanTask2(adapter, { title: "Deploy to production", columnId: todoCol.id, description: "Deploy the app to Vercel, Fly.io, or your preferred hosting", priority: "URGENT" });
            console.log("[seed] kanban: 1 board, 4 columns, 7 tasks created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded$1 = false;
          console.error("[seed] kanban failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
let seeded = false;
const Route$4 = createFileRoute("/api/seed-ui-builder")({
  server: {
    handlers: {
      GET: async () => {
        if (seeded) return Response.json({ ok: true, skipped: true });
        seeded = true;
        try {
          const result = await (async () => {
            const { UI_BUILDER_TYPE_SLUG: UI_BUILDER_TYPE_SLUG2 } = await Promise.resolve().then(function() {
              return indexIgGk0suP;
            });
            const api = myStack.api;
            const existing = await api.cms.getAllContentItems(UI_BUILDER_TYPE_SLUG2, { limit: 1 });
            if (existing.items && existing.items.length > 0) return { ok: true, skipped: true };
            const initialLayers = [{ id: "page-root", type: "div", name: "Page", props: { className: "min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8" }, children: [{ id: "welcome-card", type: "Card", name: "Welcome Card", props: { className: "w-full max-w-md shadow-xl" }, children: [{ id: "card-content", type: "CardContent", name: "Card Content", props: {}, children: [{ id: "welcome-text", type: "CardDescription", name: "Welcome Message", props: { className: "text-base leading-relaxed" }, children: "Welcome to UI Builder! Edit this page in the visual editor." }] }] }] }];
            const initialVariables = [{ id: "userName", name: "User Name", type: "string", defaultValue: "Alex" }];
            await api.cms.createContentItem(UI_BUILDER_TYPE_SLUG2, { slug: "welcome", data: { layers: JSON.stringify(initialLayers), variables: JSON.stringify(initialVariables), status: "published" } });
            console.log("[seed] ui-builder: 1 sample page created");
            return { ok: true };
          })();
          return Response.json(result ?? { ok: true });
        } catch (err) {
          seeded = false;
          console.error("[seed] ui-builder failed:", err);
          return Response.json({ ok: false }, { status: 500 });
        }
      }
    }
  }
});
const $$splitComponentImporter$2 = () => import("./form-demo._slug-DvRImzI0.mjs");
const Route$3 = createFileRoute("/form-demo/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_-B2T2OkzX.mjs");
const Route$2 = createFileRoute("/pages/$")({
  ssr: true,
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  loader: async ({
    params
  }) => {
    const queryClient = getOrCreateQueryClient();
    const routePath = normalizePath(params._splat);
    const route = getStackClient(queryClient).router.getRoute(routePath);
    if (!route) throw notFound();
    if (route.loader) await route.loader();
    return {
      meta: route.meta?.()
    };
  },
  head: ({
    loaderData
  }) => {
    if (!loaderData?.meta || !Array.isArray(loaderData.meta)) {
      return {
        title: "No Meta",
        meta: [{
          title: "No Meta"
        }]
      };
    }
    return {
      meta: loaderData.meta
    };
  }
});
const $$splitComponentImporter = () => import("./preview._slug-BqbmYbEm.mjs");
const Route$1 = createFileRoute("/preview/$slug")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/api/data/$")({
  server: {
    handlers: {
      GET: async ({ request }) => handler(request),
      POST: async ({ request }) => handler(request),
      PUT: async ({ request }) => handler(request),
      PATCH: async ({ request }) => handler(request),
      DELETE: async ({ request }) => handler(request)
    }
  }
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const PagesRouteRoute = Route$a.update({
  id: "/pages",
  path: "/pages",
  getParentRoute: () => Route$c
});
const SitemapDotxmlRoute = Route$9.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$c
});
const ApiSeedBlogRoute = Route$8.update({
  id: "/api/seed-blog",
  path: "/api/seed-blog",
  getParentRoute: () => Route$c
});
const ApiSeedCmsRoute = Route$7.update({
  id: "/api/seed-cms",
  path: "/api/seed-cms",
  getParentRoute: () => Route$c
});
const ApiSeedFormBuilderRoute = Route$6.update({
  id: "/api/seed-form-builder",
  path: "/api/seed-form-builder",
  getParentRoute: () => Route$c
});
const ApiSeedKanbanRoute = Route$5.update({
  id: "/api/seed-kanban",
  path: "/api/seed-kanban",
  getParentRoute: () => Route$c
});
const ApiSeedUiBuilderRoute = Route$4.update({
  id: "/api/seed-ui-builder",
  path: "/api/seed-ui-builder",
  getParentRoute: () => Route$c
});
const FormDemoSlugRoute = Route$3.update({
  id: "/form-demo/$slug",
  path: "/form-demo/$slug",
  getParentRoute: () => Route$c
});
const PagesSplatRoute = Route$2.update({
  id: "/$",
  path: "/$",
  getParentRoute: () => PagesRouteRoute
});
const PreviewSlugRoute = Route$1.update({
  id: "/preview/$slug",
  path: "/preview/$slug",
  getParentRoute: () => Route$c
});
const ApiDataSplatRoute = Route.update({
  id: "/api/data/$",
  path: "/api/data/$",
  getParentRoute: () => Route$c
});
const PagesRouteRouteChildren = {
  PagesSplatRoute
};
const PagesRouteRouteWithChildren = PagesRouteRoute._addFileChildren(
  PagesRouteRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  PagesRouteRoute: PagesRouteRouteWithChildren,
  SitemapDotxmlRoute,
  ApiSeedBlogRoute,
  ApiSeedCmsRoute,
  ApiSeedFormBuilderRoute,
  ApiSeedKanbanRoute,
  ApiSeedUiBuilderRoute,
  FormDemoSlugRoute,
  PreviewSlugRoute,
  ApiDataSplatRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const queryClient = getOrCreateQueryClient();
  const router2 = createRouter({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: "intent",
    scrollRestoration: true
  });
  setupRouterSsrQueryIntegration({
    router: router2,
    queryClient
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
const indexBD2v7dD = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  KANBAN_QUERY_KEYS,
  createKanbanTask,
  findOrCreateKanbanBoard,
  getAllBoards,
  getBoardById,
  getKanbanColumnsByBoardId,
  kanbanBackendPlugin,
  serializeBoard,
  serializeColumn,
  serializeTask
});
const indexIgGk0suP = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  UI_BUILDER_CONTENT_TYPE,
  UI_BUILDER_TYPE_SLUG,
  uiBuilderPageSchema
});
export {
  Route$3 as $,
  BLOG_LOCALIZATION as A,
  Button as B,
  ComposedRoute as C,
  useBasePath as D,
  PageWrapper as E,
  PageHeader as F,
  Route$1 as G,
  StackProvider as H,
  Subscribable as I,
  shallowEqualObjects as J,
  KANBAN_QUERY_KEYS as K,
  hashKey as L,
  getDefaultState as M,
  notifyManager as N,
  noop as O,
  PageWrapper$1 as P,
  shouldThrowError as Q,
  Route$2 as R,
  Skeleton as S,
  createApiClient as T,
  UI_BUILDER_TYPE_SLUG as U,
  createCMSQueryKeys as V,
  generateSchema as W,
  ROUTE_DOCS_QUERY_KEY as X,
  createKanbanQueryKeys as Y,
  buttonVariants as Z,
  formSchemaToZod as _,
  getAllBoards as a,
  toError$1 as a0,
  createCommentsQueryKeys as a1,
  throttle as a2,
  cn as a3,
  stripMarkdown as a4,
  stripHtml as a5,
  createBlogQueryKeys as a6,
  updatePostSchema as a7,
  slugify$3 as a8,
  createPostSchema as a9,
  pendingThenable as aa,
  resolveQueryBoolean as ab,
  resolveStaleTime as ac,
  environmentManager as ad,
  isValidTimeout as ae,
  timeUntilStale as af,
  timeoutManager as ag,
  focusManager as ah,
  fetchState as ai,
  replaceData as aj,
  createFormBuilderQueryKeys as ak,
  replaceEqualDeep as al,
  slugify$2 as am,
  createMediaQueryKeys as an,
  getPriorityConfig as ao,
  PRIORITY_OPTIONS as ap,
  PostCardSkeleton as aq,
  slugify$1 as ar,
  CardFooter as as,
  router as at,
  getBoardById as b,
  createKanbanTask as c,
  serializeColumn as d,
  serializeTask as e,
  findOrCreateKanbanBoard as f,
  getKanbanColumnsByBoardId as g,
  UI_BUILDER_CONTENT_TYPE as h,
  getOrCreateQueryClient as i,
  getStackClient as j,
  kanbanBackendPlugin as k,
  usePluginOverrides as l,
  accountViewPaths as m,
  normalizePath as n,
  authViewPaths as o,
  organizationViewPaths as p,
  cn$1 as q,
  hasPreviousPage as r,
  serializeBoard as s,
  hasNextPage as t,
  uiBuilderPageSchema as u,
  Card as v,
  CardContent as w,
  CardHeader as x,
  CardTitle as y,
  CardDescription as z
};
