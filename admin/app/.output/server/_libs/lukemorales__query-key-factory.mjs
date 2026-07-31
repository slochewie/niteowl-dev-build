var x = (m) => {
  let K = Object.keys(m).sort((y, i) => y.localeCompare(i));
  if (K.some((y) => y.startsWith("_"))) throw new Error('Keys that start with "_" are reserved for Query Key Factory');
  return K;
};
function e(m) {
  return Object.assign(/* @__PURE__ */ Object.create(null), m);
}
function h(m, K) {
  let u = { _def: [m] };
  if (K == null) return e(u);
  let y = (l, p) => x(l).reduce((F, d) => {
    let t = l[d], n = [...p, d], S = (o) => Array.isArray(o), a;
    if (typeof t == "function") {
      let o = (...s) => {
        let r = t(...s);
        if (S(r)) return e({ queryKey: [...n, ...r] });
        let c = [...n, ...r.queryKey];
        if ("queryFn" in r) {
          let f = { queryKey: c, queryFn: r.queryFn };
          if ("contextQueries" in r) {
            let Q = y(r.contextQueries, c);
            return e({ _ctx: e(Object.fromEntries(Q)), ...f });
          }
          return e({ ...f });
        }
        if ("contextQueries" in r) {
          let f = y(r.contextQueries, c);
          return e({ _ctx: e(Object.fromEntries(f)), queryKey: c });
        }
        return e({ queryKey: c });
      };
      o._def = n, a = o;
    } else if (t == null) a = e({ queryKey: n });
    else if (S(t)) a = e({ _def: n, queryKey: [...n, ...t] });
    else if ("queryFn" in t) {
      let o = { ...t.queryKey ? { _def: n } : void 0 }, s = [...n, ...t.queryKey ?? []], r = { queryKey: s, queryFn: t.queryFn };
      if ("contextQueries" in t) {
        let c = y(t.contextQueries, s);
        a = e({ _ctx: e(Object.fromEntries(c)), ...o, ...r });
      } else a = e({ ...o, ...r });
    } else if ("contextQueries" in t) {
      let o = { ...t.queryKey ? { _def: n } : void 0 }, s = [...n, ...t.queryKey ?? []], r = y(t.contextQueries, s);
      a = e({ _ctx: e(Object.fromEntries(r)), queryKey: s, ...o });
    } else {
      let o = { ...t.queryKey ? { _def: n } : void 0 }, s = [...n, ...t.queryKey ?? []];
      a = e({ queryKey: s, ...o });
    }
    return F.set(d, a), F;
  }, /* @__PURE__ */ new Map()), i = y(K, u._def);
  return e({ ...Object.fromEntries(i), ...u });
}
function O(...m) {
  let K = m.reduce((u, y) => {
    let [i] = y._def;
    return u.set(i, { ...u.get(i), ...y }), u;
  }, /* @__PURE__ */ new Map());
  return e(Object.fromEntries(K));
}
export {
  O,
  h
};
