import { forwardRef, useCallback, useState, useRef, useEffect, useMemo, useImperativeHandle } from "react";
import { jsx } from "react/jsx-runtime";
var c = forwardRef(({ as: e = `div`, ...t }, n) => jsx(e, { ...t, ref: n }));
const l = `https://challenges.cloudflare.com/turnstile/v0/api.js`, u = `cf-turnstile-script`, f = `onloadTurnstileCallback`, p = (e) => !!document.getElementById(e), m = ({ render: e = `explicit`, onLoadCallbackName: t = f, scriptOptions: { nonce: n = ``, defer: r = true, async: i = true, id: a = ``, appendTo: o, onError: s, crossOrigin: c2 = `` } = {} }) => {
  let u2 = a || `cf-turnstile-script`;
  if (p(u2)) return;
  let d = document.createElement(`script`);
  d.id = u2, d.src = `${l}?onload=${t}&render=${e}`, !document.querySelector(`script[src="${d.src}"]`) && (d.defer = !!r, d.async = !!i, n && d.setAttribute(`nonce`, n), c2 && (d.crossOrigin = c2), s && (d.onerror = s, delete window[t]), (o === `body` ? document.body : document.getElementsByTagName(`head`)[0]).appendChild(d));
}, h = { normal: { width: 300, height: 65 }, compact: { width: 150, height: 140 }, invisible: { width: 0, height: 0, overflow: `hidden` }, flexible: { minWidth: 300, width: `100%`, height: 65 } };
function g(e) {
  if (e !== `invisible`) return e;
}
function _(e = u) {
  let [t, r] = useState(false);
  return useEffect(() => {
    let t2 = () => {
      p(e) && r(true);
    }, n = new MutationObserver(t2);
    return n.observe(document, { childList: true, subtree: true }), t2(), () => {
      n.disconnect();
    };
  }, [e]), t;
}
let v = `unloaded`, y;
const b = new Promise((e, t) => {
  y = { resolve: e, reject: t }, v === `ready` && e(void 0);
}), x = (e = f) => (v === `unloaded` && (v = `loading`, window[e] = () => {
  y.resolve(), v = `ready`, delete window[e];
}), b), S = forwardRef((e, l2) => {
  let { scriptOptions: u2, options: d = {}, siteKey: f2, onWidgetLoad: p2, onSuccess: y2, onExpire: b2, onError: S2, onBeforeInteractive: C, onAfterInteractive: w, onUnsupported: T, onTimeout: E, onLoadScript: D, id: O, style: k, as: A = `div`, injectScript: j = true, rerenderOnCallbackChange: M = false, ...N } = e, P = d.size, F = useCallback(() => {
    if (P === void 0) return {};
    if (d.execution === `execute`) return h.invisible;
    let e2 = h[P];
    return d.appearance === `interaction-only` ? { ...e2, height: `auto` } : e2;
  }, [d.execution, P, d.appearance]), [I, L] = useState(F()), R = useRef(null), [z, B] = useState(false), V = useRef(void 0), H = useRef(false), U = O || `cf-turnstile`, W = useRef({ onSuccess: y2, onError: S2, onExpire: b2, onBeforeInteractive: C, onAfterInteractive: w, onUnsupported: T, onTimeout: E });
  useEffect(() => {
    M || (W.current = { onSuccess: y2, onError: S2, onExpire: b2, onBeforeInteractive: C, onAfterInteractive: w, onUnsupported: T, onTimeout: E });
  });
  let G = u2?.id || `cf-turnstile-script`, K = _(G), q = u2?.onLoadCallbackName || `onloadTurnstileCallback`, J = d.appearance || `always`, Y = useMemo(() => ({ sitekey: f2, action: d.action, cData: d.cData, theme: d.theme || `auto`, language: d.language || `auto`, tabindex: d.tabIndex, "response-field": d.responseField, "response-field-name": d.responseFieldName, size: g(P), retry: d.retry || `auto`, "retry-interval": d.retryInterval || 8e3, "refresh-expired": d.refreshExpired || `auto`, "refresh-timeout": d.refreshTimeout || `auto`, execution: d.execution || `render`, appearance: d.appearance || `always`, "feedback-enabled": d.feedbackEnabled ?? true, callback: (e2) => {
    H.current = true, M ? y2?.(e2) : W.current.onSuccess?.(e2);
  }, "error-callback": M ? S2 : (...e2) => W.current.onError?.(...e2), "expired-callback": M ? b2 : (...e2) => W.current.onExpire?.(...e2), "before-interactive-callback": M ? C : (...e2) => W.current.onBeforeInteractive?.(...e2), "after-interactive-callback": M ? w : (...e2) => W.current.onAfterInteractive?.(...e2), "unsupported-callback": M ? T : (...e2) => W.current.onUnsupported?.(...e2), "timeout-callback": M ? E : (...e2) => W.current.onTimeout?.(...e2) }), [d.action, d.appearance, d.cData, d.execution, d.language, d.refreshExpired, d.responseField, d.responseFieldName, d.retry, d.retryInterval, d.tabIndex, d.theme, d.feedbackEnabled, d.refreshTimeout, f2, P, M, M ? y2 : null, M ? S2 : null, M ? b2 : null, M ? C : null, M ? w : null, M ? T : null, M ? E : null]), X = useCallback(() => typeof window < `u` && !!window.turnstile, []);
  return useEffect(function() {
    j && !z && (x(q), m({ onLoadCallbackName: q, scriptOptions: { ...u2, id: G } }));
  }, [j, z, u2, G, q]), useEffect(function() {
    v !== `ready` && x(q).then(() => B(true)).catch(console.error);
  }, [q]), useEffect(function() {
    if (!R.current || !z) return;
    let e2 = false;
    return (async () => {
      e2 || !R.current || (V.current = window.turnstile.render(R.current, Y), V.current && p2?.(V.current));
    })(), () => {
      e2 = true, V.current && (window.turnstile.remove(V.current), H.current = false);
    };
  }, [U, z, Y]), useImperativeHandle(l2, () => {
    let { turnstile: e2 } = window;
    return { getResponse() {
      if (!e2?.getResponse || !V.current || !X()) {
        console.warn(`Turnstile has not been loaded`);
        return;
      }
      return e2.getResponse(V.current);
    }, async getResponsePromise(e3 = 3e4, t = 100) {
      return new Promise((n, r) => {
        let i, a = async () => {
          if (H.current && window.turnstile && V.current) try {
            let e4 = window.turnstile.getResponse(V.current);
            return i && clearTimeout(i), e4 ? n(e4) : r(Error(`No response received`));
          } catch (e4) {
            return i && clearTimeout(i), console.warn(`Failed to get response`, e4), r(Error(`Failed to get response`));
          }
          i ||= setTimeout(() => {
            i && clearTimeout(i), r(Error(`Timeout`));
          }, e3), await new Promise((e4) => setTimeout(e4, t)), await a();
        };
        a();
      });
    }, reset() {
      if (!e2?.reset || !V.current || !X()) {
        console.warn(`Turnstile has not been loaded`);
        return;
      }
      d.execution === `execute` && L(h.invisible);
      try {
        H.current = false, e2.reset(V.current);
      } catch (e3) {
        console.warn(`Failed to reset Turnstile widget ${V.current}`, e3);
      }
    }, remove() {
      if (!e2?.remove || !V.current || !X()) {
        console.warn(`Turnstile has not been loaded`);
        return;
      }
      L(h.invisible), H.current = false, e2.remove(V.current), V.current = null;
    }, render() {
      if (!e2?.render || !R.current || !X() || V.current) {
        console.warn(`Turnstile has not been loaded or container not found`);
        return;
      }
      let t = e2.render(R.current, Y);
      return V.current = t, V.current && p2?.(V.current), d.execution !== `execute` && L(F()), t;
    }, execute() {
      if (d.execution !== `execute`) {
        console.warn(`Execution mode is not set to "execute"`);
        return;
      }
      if (!e2?.execute || !R.current || !V.current || !X()) {
        console.warn(`Turnstile has not been loaded or container not found`);
        return;
      }
      e2.execute(R.current), L(F());
    }, isExpired() {
      return !e2?.isExpired || !V.current || !X() ? (console.warn(`Turnstile has not been loaded`), false) : e2.isExpired(V.current);
    } };
  }, [V, d.execution, P, Y, R, X, z, p2, F]), useEffect(() => {
    if (z || !K) return;
    if (window.turnstile) {
      B(true);
      return;
    }
    let e2 = setInterval(() => {
      window.turnstile && (B(true), clearInterval(e2));
    }, 50);
    return () => {
      clearInterval(e2);
    };
  }, [z, K]), useEffect(() => {
    L(F());
  }, [d.execution, P, J]), useEffect(() => {
    !K || typeof D != `function` || D();
  }, [K]), jsx(c, { ref: R, as: A, id: U, style: { ...I, ...k }, ...N });
});
S.displayName = `Turnstile`;
export {
  S
};
