import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { w as warning } from "./warning.mjs";
const ReCaptchaContext = reactExports.createContext({});
function useReCaptcha() {
  return reactExports.useContext(ReCaptchaContext);
}
function loadScript({ async, appendTo, defer, id, nonce, src }) {
  const script = document.createElement("script");
  if (async !== void 0) {
    script.async = async;
  }
  if (defer !== void 0) {
    script.defer = defer;
  }
  if (id) {
    script.id = id;
  }
  if (nonce) {
    script.setAttribute("nonce", nonce);
  }
  script.src = src;
  const appendTarget = appendTo === "head" ? document.head : document.body;
  appendTarget.appendChild(script);
}
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
let loadedUrl = null;
let isLoaded = false;
const instances = /* @__PURE__ */ new Set();
const onLoadCallbacks = /* @__PURE__ */ new Set();
const isBrowser = typeof window !== "undefined";
const cfgKey = "___grecaptcha_cfg";
const onLoadCallbackName = `onLoadCallback_${Math.random().toString(36).slice(2)}`;
function initialize() {
  if (!isBrowser) {
    return;
  }
  function ready(cb) {
    if (isLoaded) {
      cb();
    } else {
      if (!window[cfgKey]) {
        window[cfgKey] = {};
      }
      const cfg = window[cfgKey];
      if (!cfg.fns) {
        cfg.fns = [];
      }
      const fns = cfg.fns;
      fns.push(cb);
    }
  }
  if (!window.grecaptcha) {
    window.grecaptcha = {};
  }
  if (!window.grecaptcha.enterprise) {
    window.grecaptcha.enterprise = {};
  }
  window.grecaptcha.ready = ready;
  window.grecaptcha.enterprise.ready = ready;
  function onLoadCallback() {
    isLoaded = true;
    for (const callback of onLoadCallbacks) {
      callback();
    }
    onLoadCallbacks.clear();
  }
  window[onLoadCallbackName] = onLoadCallback;
}
function generateGoogleRecaptchaSrc({ language, onLoadCallbackName: onLoadCallbackName2, render, useEnterprise = false, useRecaptchaNet = false }) {
  const host = useRecaptchaNet ? "recaptcha.net" : "google.com";
  const script = useEnterprise ? "enterprise.js" : "api.js";
  const params = new URLSearchParams({
    render
  });
  if (onLoadCallbackName2) {
    params.set("onload", onLoadCallbackName2);
  }
  if (language) {
    params.set("hl", language);
  }
  return `https://www.${host}/recaptcha/${script}?${params.toString()}`;
}
function loadGoogleRecaptchaScript({ language, render, scriptProps, useEnterprise, useRecaptchaNet }) {
  const defaultScriptProps = {
    id: "google-recaptcha-v3"
  };
  const src = generateGoogleRecaptchaSrc({
    language,
    onLoadCallbackName,
    render,
    useEnterprise,
    useRecaptchaNet
  });
  if (loadedUrl) {
    if (loadedUrl !== src) {
      throw new Error("reCAPTCHA has already been loaded with different parameters. Remove the existing script and load it again.");
    }
    return;
  }
  loadedUrl = src;
  loadScript(Object.assign(Object.assign(Object.assign({}, defaultScriptProps), scriptProps), { src }));
}
function removeClient(clientId) {
  if (!window[cfgKey]) {
    return;
  }
  const cfg = window[cfgKey];
  if (!cfg.clients) {
    return;
  }
  delete cfg.clients[clientId];
}
function registerInstance(instanceId, _a) {
  var { onLoadCallback, onLoadCallbackName: onLoadCallbackName2 } = _a, loadGoogleRecaptchaScriptOptions = __rest(_a, ["onLoadCallback", "onLoadCallbackName"]);
  if (instances.size === 0) {
    initialize();
  }
  loadGoogleRecaptchaScript(loadGoogleRecaptchaScriptOptions);
  instances.add(instanceId);
  if (onLoadCallback) {
    if (isLoaded) {
      onLoadCallback();
    } else {
      onLoadCallbacks.add(onLoadCallback);
    }
  }
  if (onLoadCallbackName2) {
    let callOnLoadCallbackIfExists = function() {
      if (!onLoadCallbackName2) {
        return;
      }
      const maybeOnLoadCallback = window[onLoadCallbackName2];
      if (typeof maybeOnLoadCallback === "function") {
        maybeOnLoadCallback();
      }
    };
    if (isLoaded) {
      callOnLoadCallbackIfExists();
    } else {
      onLoadCallbacks.add(callOnLoadCallbackIfExists);
    }
  }
}
function unregisterInstance(instanceId) {
  var _a, _b, _c;
  instances.delete(instanceId);
  if (instances.size === 0) {
    window.grecaptcha = void 0;
    window[cfgKey] = void 0;
    (_a = document.querySelector(".grecaptcha-badge")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.querySelector(`script[src="${loadedUrl}"]`)) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = document.querySelector(`script[src^="https://www.gstatic.com/recaptcha/releases"]`)) === null || _c === void 0 ? void 0 : _c.remove();
    loadedUrl = null;
    isLoaded = false;
  }
}
let didWarnAboutHiddenBadge = false;
function ReCaptchaProvider({ container, children, language, reCaptchaKey, scriptProps, useEnterprise, useRecaptchaNet }) {
  var _a, _b, _c, _d, _e, _f, _g;
  const id = reactExports.useId();
  const [reCaptchaInstance, setReCaptchaInstance] = reactExports.useState(null);
  const [clientId, setClientId] = reactExports.useState(null);
  const clientIdMounted = reactExports.useRef(false);
  reactExports.useEffect(() => {
    function onLoadCallback() {
      var _a2;
      const nextReCaptchaInstance = useEnterprise ? (_a2 = window.grecaptcha) === null || _a2 === void 0 ? void 0 : _a2.enterprise : window.grecaptcha;
      if (!nextReCaptchaInstance) {
        throw new Error("reCAPTCHA not found");
      }
      if (!nextReCaptchaInstance.ready) {
        throw new Error("reCAPTCHA ready callback not found");
      }
      nextReCaptchaInstance.ready(() => {
        setReCaptchaInstance(nextReCaptchaInstance);
      });
    }
    registerInstance(id, {
      language,
      onLoadCallback,
      onLoadCallbackName: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.onLoadCallbackName,
      render: (container === null || container === void 0 ? void 0 : container.element) ? "explicit" : reCaptchaKey,
      scriptProps: {
        appendTo: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.appendTo,
        async: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.async,
        defer: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.defer,
        id: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.id,
        nonce: scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.nonce
      },
      useEnterprise,
      useRecaptchaNet
    });
    return () => {
      unregisterInstance(id);
      setReCaptchaInstance(null);
    };
  }, [
    container === null || container === void 0 ? void 0 : container.element,
    id,
    language,
    reCaptchaKey,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.appendTo,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.async,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.defer,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.id,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.nonce,
    scriptProps === null || scriptProps === void 0 ? void 0 : scriptProps.onLoadCallbackName,
    useEnterprise,
    useRecaptchaNet
  ]);
  reactExports.useEffect(() => {
    var _a2, _b2, _c2;
    if (!(container === null || container === void 0 ? void 0 : container.element) || !(reCaptchaInstance === null || reCaptchaInstance === void 0 ? void 0 : reCaptchaInstance.render)) {
      return;
    }
    const params = {
      "error-callback": container.parameters.errorCallback,
      "expired-callback": container.parameters.expiredCallback,
      badge: ((_a2 = container.parameters) === null || _a2 === void 0 ? void 0 : _a2.badge) || "inline",
      callback: container.parameters.callback,
      sitekey: reCaptchaKey,
      size: "invisible",
      tabindex: container.parameters.tabindex,
      theme: container.parameters.theme
    };
    const actualContainerElement = typeof (container === null || container === void 0 ? void 0 : container.element) === "string" ? document.getElementById(container.element) : container === null || container === void 0 ? void 0 : container.element;
    if (!actualContainerElement) {
      throw new Error("reCAPTCHA container element not found");
    }
    const nextClientId = reCaptchaInstance.render(actualContainerElement, params);
    if ((_b2 = container === null || container === void 0 ? void 0 : container.parameters) === null || _b2 === void 0 ? void 0 : _b2.hidden) {
      if (!didWarnAboutHiddenBadge) {
        warning(false, "reCAPTCHA badge hidden. See https://cloud.google.com/recaptcha/docs/faq#id_like_to_hide_the_badge_what_is_allowed for more information.");
        didWarnAboutHiddenBadge = true;
      }
      (_c2 = actualContainerElement.querySelector(".grecaptcha-badge")) === null || _c2 === void 0 ? void 0 : _c2.style.setProperty("display", "none");
    }
    setClientId(nextClientId);
    clientIdMounted.current = true;
    return () => {
      setClientId(null);
      clientIdMounted.current = false;
      removeClient(nextClientId);
      actualContainerElement.innerHTML = "";
    };
  }, [
    container === null || container === void 0 ? void 0 : container.element,
    (_a = container === null || container === void 0 ? void 0 : container.parameters) === null || _a === void 0 ? void 0 : _a.badge,
    (_b = container === null || container === void 0 ? void 0 : container.parameters) === null || _b === void 0 ? void 0 : _b.hidden,
    (_c = container === null || container === void 0 ? void 0 : container.parameters) === null || _c === void 0 ? void 0 : _c.callback,
    (_d = container === null || container === void 0 ? void 0 : container.parameters) === null || _d === void 0 ? void 0 : _d.errorCallback,
    (_e = container === null || container === void 0 ? void 0 : container.parameters) === null || _e === void 0 ? void 0 : _e.expiredCallback,
    (_f = container === null || container === void 0 ? void 0 : container.parameters) === null || _f === void 0 ? void 0 : _f.tabindex,
    (_g = container === null || container === void 0 ? void 0 : container.parameters) === null || _g === void 0 ? void 0 : _g.theme,
    reCaptchaInstance,
    reCaptchaKey
  ]);
  const shouldUseClientId = Boolean(container === null || container === void 0 ? void 0 : container.element);
  const clientIdOrReCaptchaKey = shouldUseClientId ? clientId : reCaptchaKey;
  const executeRecaptcha = reactExports.useMemo(() => clientIdOrReCaptchaKey !== null && (reCaptchaInstance === null || reCaptchaInstance === void 0 ? void 0 : reCaptchaInstance.execute) ? (action) => {
    if (clientIdOrReCaptchaKey === null || !(reCaptchaInstance === null || reCaptchaInstance === void 0 ? void 0 : reCaptchaInstance.execute)) {
      throw new Error("reCAPTCHA has not been loaded");
    }
    if (shouldUseClientId && !clientIdMounted.current) {
      console.warn("Client ID not mounted");
      return null;
    }
    return reCaptchaInstance.execute(clientIdOrReCaptchaKey, { action });
  } : void 0, [clientIdOrReCaptchaKey, reCaptchaInstance, shouldUseClientId]);
  return jsxRuntimeExports.jsx(ReCaptchaContext.Provider, { value: {
    container: container === null || container === void 0 ? void 0 : container.element,
    executeRecaptcha,
    reCaptchaInstance
  }, children });
}
export {
  ReCaptchaProvider as R,
  useReCaptcha as u
};
