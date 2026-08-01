import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, useMemo, useRef, useLayoutEffect, useImperativeHandle, createElement, useCallback, useEffect, memo, forwardRef, useContext, createContext } from "react";
import { B as Button, q as cn, Z as buttonVariants, v as Card, x as CardHeader, y as CardTitle, w as CardContent, l as usePluginOverrides, D as useBasePath } from "./router-DU5jczZR.js";
import { I as Input } from "./input-Db1DsNBl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B_yf4oCD.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-DQgN5wJE.js";
import { L as Label } from "./label-BdRDX7M-.js";
import { Check, X as X$1, ChevronDown, ChevronRight, GripVertical, Plus, MoreVertical, PlusCircle, Copy, Scissors, ClipboardPaste, CopyPlus, Trash, ZoomIn, ZoomOut, Crosshair, MousePointer, PanelLeft, PanelRight, Maximize, Monitor, Tablet, Smartphone, Undo, Redo, Eye, FileUp, SunIcon, MoonIcon, PlusIcon, CheckIcon, GripVerticalIcon, InfoIcon, Edit2, Trash2, Loader2Icon, OctagonXIcon, TriangleAlertIcon, CircleCheckIcon, Save, ArrowLeft, Settings2 } from "lucide-react";
import { Toaster as Toaster$1, toast } from "sonner";
import { u as useEditorStore, a as useLayerStore, b as useGlobalLayerActions, c as canComponentAcceptChildren, h as hasLayerChildren, A as AddComponentsPopover, i as isDeepEqual, f as findAllParentLayersRecursive, D as DevProfiler, e as isVariableReference, g as canLayerAcceptChildren, j as DndContextStateContext, C as ComponentDragContext, k as useDndContext, l as useFrame, m as useFloating, n as canPasteLayer, S as SHORTCUTS, o as useComponentDragContext, p as countLayers, R as ResizableWrapper, q as AutoFrame, L as LayerRenderer, T as TransformWrapper, r as TransformComponent, s as useControls, t as resolveVariableReferences, v as addDefaultValues, w as generateFieldOverrides, x as useStore$1, y as toKeyboardShortcut, z as useKeyboardShortcuts, B as CodePanel, E as baseColors, F as TAILWIND_V4_COLOR_KEYS, d as defaultComponentRegistry } from "./registry-C8q1hYUi.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-DwfP37wf.js";
import { p as pointerWithin, r as rectIntersection, q as DragOverlay, k as useSensors, l as useSensor, T as TouchSensor, M as MouseSensor, D as DndContext } from "./core.esm-Bjw07ll7.js";
import { createPortal } from "react-dom";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent, d as Toggle } from "./minimal-tiptap-2ESukVs0.js";
import { o as offset, f as flip, s as shift, l as limitShift } from "./Combination-C2ce2hnQ.js";
import { z as z$1 } from "zod";
import { g as getBaseType, A as AutoForm } from "./index-BCS2IiYe.js";
import { D as Dialog, e as DialogTrigger, a as DialogHeader, b as DialogTitle, h as DialogPortal, i as DialogOverlay, d as DialogContent, f as DialogClose } from "./dialog-Chz0Zs_g.js";
import { a as Command, e as CommandInput, b as CommandList, f as CommandEmpty, g as CommandSeparator, c as CommandGroup, C as CommandItem, h as CommandShortcut } from "./command-5HTd1Hbk.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BbzCMZxa.js";
import { u as useRegisterPageAIContext } from "./page-ai-context-C_8XrHKf.js";
import { d as useSuspenseUIBuilderPage, e as useCreateUIBuilderPage, f as useUpdateUIBuilderPage, a as uiBuilderLocalization } from "./index-DQd4hyqM.js";
import "@tanstack/react-router";
import "@tanstack/react-router-ssr-query";
import "@btst/yar";
import "better-call/client";
import "react-error-boundary";
import "@lukemorales/query-key-factory";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@btst/adapter-drizzle";
import "drizzle-orm/node-postgres";
import "pg";
import "drizzle-orm";
import "drizzle-orm/pg-core";
import "better-call";
import "@btst/db";
import "better-call/node";
import "slug";
import "./index-IXOTxK3N.js";
import "./index-S7rpP7KI.js";
import "./index-rdulpQ7P.js";
import "./index-KZ0RSJRl.js";
import "./index-BUGN0YTJ.js";
import "./index-CshadhlS.js";
import "./index-BI_-Kgeu.js";
import "@radix-ui/react-label";
import "./badge-DFvO9DkX.js";
import "./accordion-CYnXr6WS.js";
import "./separator-2KKe-9Ln.js";
import "./index-CpOdxbMb.js";
import "react-markdown";
import "remark-gfm";
import "remark-math";
import "./form-h3RPcnMA.js";
import "react-hook-form";
import "crypto";
import "cmdk";
import "./use-debounce-B6NKG3k-.js";
import "./textarea-DS3tfP2l.js";
import "./index-x6nDyT23.js";
import "./index3-B51lEsWR.js";
import "./switch-WrObWEGq.js";
import "@radix-ui/react-switch";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/arduino";
import "highlight.js/lib/languages/bash";
import "highlight.js/lib/languages/c";
import "highlight.js/lib/languages/cpp";
import "highlight.js/lib/languages/csharp";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/diff";
import "highlight.js/lib/languages/go";
import "highlight.js/lib/languages/graphql";
import "highlight.js/lib/languages/ini";
import "highlight.js/lib/languages/java";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/json";
import "highlight.js/lib/languages/kotlin";
import "highlight.js/lib/languages/less";
import "highlight.js/lib/languages/lua";
import "highlight.js/lib/languages/makefile";
import "highlight.js/lib/languages/markdown";
import "highlight.js/lib/languages/objectivec";
import "highlight.js/lib/languages/perl";
import "highlight.js/lib/languages/php";
import "highlight.js/lib/languages/php-template";
import "highlight.js/lib/languages/plaintext";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/python-repl";
import "highlight.js/lib/languages/r";
import "highlight.js/lib/languages/ruby";
import "highlight.js/lib/languages/rust";
import "highlight.js/lib/languages/scss";
import "highlight.js/lib/languages/shell";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/swift";
import "highlight.js/lib/languages/typescript";
import "highlight.js/lib/languages/vbnet";
import "highlight.js/lib/languages/wasm";
import "highlight.js/lib/languages/xml";
import "highlight.js/lib/languages/yaml";
import "@hookform/resolvers/zod";
import "./checkbox-Ct6-tiwE.js";
import "date-fns";
import "date-fns/locale";
import "@radix-ui/react-dialog";
import "./useSuspenseQuery--TKlWsW-.js";
import "./useBaseQuery-z1wQ1YES.js";
import "./QueryClientProvider-BNL98aJf.js";
import "./useSuspenseInfiniteQuery-BmxntFOE.js";
import "./infiniteQueryObserver-EXEbLXDI.js";
import "./useMutation-wDhDrN3q.js";
const getIframeElements = () => {
  const iframe = document.querySelector('[data-testid="auto-frame"]');
  if (!iframe) return null;
  const iframeWindow = iframe.contentWindow;
  const iframeDocument = iframe.contentDocument;
  if (!iframeWindow || !iframeDocument) return null;
  return {
    iframe,
    window: iframeWindow,
    document: iframeDocument,
    body: iframeDocument.body
  };
};
const createTransformAwareCollisionDetection = () => {
  return ({ active, droppableRects, droppableContainers, pointerCoordinates, collisionRect }) => {
    if (!pointerCoordinates) {
      return [];
    }
    const transformState = getTransformState();
    const iframeElements = getIframeElements();
    let iframeScrollOffset = { x: 0, y: 0 };
    let iframeRect = { left: 0, top: 0 };
    if (iframeElements) {
      const { iframe, window: iframeWindow } = iframeElements;
      if (iframeWindow) {
        iframeScrollOffset = {
          x: iframeWindow.pageXOffset || iframeWindow.scrollX || 0,
          y: iframeWindow.pageYOffset || iframeWindow.scrollY || 0
        };
      }
      const rect = iframe.getBoundingClientRect();
      iframeRect = { left: rect.left, top: rect.top };
    }
    const freshDroppableRects = new Map(droppableRects);
    const isAtTop = Math.abs(iframeScrollOffset.y) < 5;
    const needsFreshRects = Math.abs(iframeScrollOffset.y) > 10 || isAtTop;
    if (needsFreshRects) {
      droppableContainers.forEach((container) => {
        const element = container.node.current;
        if (element) {
          try {
            const rect = element.getBoundingClientRect();
            if (isAtTop) {
              freshDroppableRects.set(container.id, {
                top: rect.top - iframeRect.top + iframeScrollOffset.y,
                left: rect.left - iframeRect.left + iframeScrollOffset.x,
                bottom: rect.bottom - iframeRect.top + iframeScrollOffset.y,
                right: rect.right - iframeRect.left + iframeScrollOffset.x,
                width: rect.width,
                height: rect.height
              });
            } else {
              freshDroppableRects.set(container.id, {
                top: rect.top - iframeRect.top + iframeScrollOffset.y,
                left: rect.left - iframeRect.left + iframeScrollOffset.x,
                bottom: rect.bottom - iframeRect.top + iframeScrollOffset.y,
                right: rect.right - iframeRect.left + iframeScrollOffset.x,
                width: rect.width,
                height: rect.height
              });
            }
          } catch (error) {
            console.warn("Failed to get fresh rectangle for:", container.id, error);
          }
        }
      });
    }
    const iframeRelativeX = pointerCoordinates.x - iframeRect.left;
    const iframeRelativeY = pointerCoordinates.y - iframeRect.top;
    const transformAdjustedX = (iframeRelativeX - transformState.positionX) / transformState.scale;
    const transformAdjustedY = (iframeRelativeY - transformState.positionY) / transformState.scale;
    let adjustedPointerCoordinates;
    if (isAtTop) {
      adjustedPointerCoordinates = {
        x: transformAdjustedX,
        y: transformAdjustedY
      };
    } else {
      adjustedPointerCoordinates = {
        x: transformAdjustedX + iframeScrollOffset.x,
        y: transformAdjustedY + iframeScrollOffset.y
      };
    }
    const simpleAdjustedCoordinates = {
      x: pointerCoordinates.x - iframeRect.left + iframeScrollOffset.x,
      y: pointerCoordinates.y - iframeRect.top + iframeScrollOffset.y
    };
    iframeScrollOffset.y > 0;
    ({
      scrollY: iframeScrollOffset.y,
      containerCount: droppableContainers.length
    });
    if (isNaN(adjustedPointerCoordinates.x) || isNaN(adjustedPointerCoordinates.y)) {
      console.warn("Invalid adjusted coordinates, falling back to original");
      const fallbackArgs = {
        droppableRects,
        droppableContainers,
        pointerCoordinates
      };
      return pointerWithin(fallbackArgs);
    }
    const adjustedArgs = {
      droppableRects: freshDroppableRects,
      droppableContainers,
      pointerCoordinates: adjustedPointerCoordinates,
      collisionRect
    };
    const pointerCollisions = pointerWithin(adjustedArgs);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    const rectCollisions = rectIntersection(adjustedArgs);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }
    const simpleArgs = {
      droppableRects: freshDroppableRects,
      droppableContainers,
      pointerCoordinates: simpleAdjustedCoordinates
    };
    const simpleCollisions = pointerWithin(simpleArgs);
    if (simpleCollisions.length > 0) {
      return simpleCollisions;
    }
    const cachedArgs = {
      droppableRects,
      droppableContainers,
      pointerCoordinates: adjustedPointerCoordinates
    };
    const cachedCollisions = pointerWithin(cachedArgs);
    if (cachedCollisions.length > 0) {
      return cachedCollisions;
    }
    const originalArgs = {
      droppableRects,
      droppableContainers,
      pointerCoordinates
    };
    const originalCollisions = pointerWithin(originalArgs);
    return originalCollisions;
  };
};
const getTransformState = () => {
  const transformComponent = document.querySelector('[data-testid="transform-component"]');
  let transformState = { scale: 1, positionX: 0, positionY: 0 };
  if (transformComponent) {
    const computedStyle = window.getComputedStyle(transformComponent);
    const transform = computedStyle.transform;
    if (transform && transform !== "none") {
      const matrixMatch = transform.match(/matrix\(([^)]*)\)/);
      if (matrixMatch && matrixMatch[1]) {
        const values = matrixMatch[1].split(",").map((v) => parseFloat(v.trim()));
        if (values.length >= 6) {
          const scale = values[0];
          const positionX = values[4];
          const positionY = values[5];
          if (scale !== void 0 && positionX !== void 0 && positionY !== void 0) {
            transformState = {
              scale,
              // scaleX
              positionX,
              // translateX
              positionY
              // translateY
            };
          }
        }
      }
    }
  }
  return transformState;
};
function notLessThan(n, min) {
  return n < min ? min : n;
}
function notGreaterThan(n, max) {
  return n < max ? n : max;
}
function between(n, min, max) {
  return notGreaterThan(notLessThan(n, min), max);
}
function arrayFirst(arr) {
  return arr[0];
}
function arrayLast(arr) {
  return arr[arr.length - 1];
}
function findParent(el, callback) {
  let opt = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  let cur = opt && opt.withSelf ? el : el.parentElement;
  while (cur) {
    const shouldBreak = opt.until && cur === opt.until;
    if (shouldBreak && !opt.withUntil) {
      return;
    }
    const r = callback(cur);
    if (r === "break") {
      return;
    } else if (r) {
      return cur;
    } else if (shouldBreak) {
      return;
    } else {
      cur = cur.parentElement;
    }
  }
}
function binarySearch(arr, callback) {
  let opt = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  opt = {
    start: 0,
    end: arr.length - 1,
    maxTimes: 1e3,
    ...opt
  };
  let {
    start,
    end
  } = opt;
  const {
    returnNearestIfNoHit,
    maxTimes
  } = opt;
  let midNum;
  let mid;
  if (start == null) {
    start = 0;
    end = arr.length - 1;
  }
  let i = 0;
  let r;
  while (start >= 0 && start <= end) {
    if (i >= maxTimes) {
      throw Error(`binarySearch: loop times is over ${maxTimes}, you can increase the limit.`);
    }
    midNum = Math.floor((end - start) / 2 + start);
    mid = arr[midNum];
    const count = i + 1;
    r = callback(mid, midNum, count);
    if (r > 0) {
      end = midNum - 1;
    } else if (r < 0) {
      start = midNum + 1;
    } else {
      return {
        index: midNum,
        value: mid,
        count,
        hit: true
      };
    }
    i++;
  }
  return returnNearestIfNoHit ? {
    index: midNum,
    value: mid,
    count: i + 1,
    hit: false,
    greater: r > 0
  } : null;
}
const Q = React__default.forwardRef, W$1 = {
  /**
   * The visible space of the list. It is only used before DOM created(SSR).
   */
  listSize: 1e3,
  /**
   * Whether to enable the virtual list feature.
   */
  virtual: true
}, X = Q(function(e, L) {
  var M2, V2;
  const [c, O2] = useState(e.itemSize || 100), h = useMemo(() => e.buffer || Math.max(c * 5, 100), [e.buffer, c]), u = e.items.length, r = useRef(null), I2 = useRef(null), g = useRef(0), f = useRef(), [$2, j] = useState([]), [b2, N2] = useState(0), [x2, v] = useState(e.listSize), [B, D] = useState([]), T = useRef(false), P = useMemo(() => {
    var C;
    const n = c * u;
    let t = b2 - h, i = n - b2 - x2 - h, l = 0, s = 0;
    t <= 0 ? (t = 0, l = 0) : l = Math.floor(t / c), i < 0 && (i = 0), n <= x2 ? s = u : s = u - Math.floor(i / c), e.virtual || (l = 0, s = u);
    let o = Array.from({ length: s - l }, (S, R) => R + l).concat(e.persistentIndices || []);
    return (C = e.persistentIndices) != null && C.length && (o = [...new Set(o)].sort((S, R) => S - R)), { visible: o.map((S) => e.items[S]), visibleIndices: o, topSpace: t, bottomSpace: i, totalSpace: n };
  }, [e.items, c, u, b2, h, x2, e.virtual, e.persistentIndices]), { visible: U2, visibleIndices: y, topSpace: k, bottomSpace: F, totalSpace: A } = P, z2 = { paddingTop: `${k}px`, boxSizing: "border-box" };
  F < c * 5 ? z2.paddingBottom = `${F}px` : z2.height = `${A}px`, useLayoutEffect(() => {
    if (r.current && (v(r.current.clientHeight), e.itemSize == null)) {
      const n = I2.current;
      let t = parseFloat(getComputedStyle(n).rowGap);
      t = isNaN(t) ? 0 : t;
      let i = 0, l = 0;
      const s = new Set(e.persistentIndices || []);
      let w = -1;
      for (const o of n.children) {
        if (w++, s.has(y[w]))
          continue;
        const a = getComputedStyle(o);
        a.display !== "none" && (a.position !== "static" && a.position !== "relative" || (l += o.offsetHeight + parseFloat(a.marginTop) + parseFloat(a.marginBottom) + t, i++));
      }
      O2(l / i);
    }
  }, [e.itemSize, e.items, B]);
  const G = function(n) {
    var t;
    if (e.virtual && !f.current) {
      if (v(r.current.clientHeight), T.current)
        T.current = false;
      else {
        const i = r.current.scrollTop;
        Math.abs(g.current - i) > (e.triggerDistance ?? c) && (N2(i), g.current = i);
      }
      (t = e.onScroll) == null || t.call(this, n);
    }
  };
  return useImperativeHandle(L, () => ({
    scrollToIndex(n, t = "start") {
      f.current = {
        index: n,
        block: t
      };
      const i = n * c;
      r.current.scrollTop = i, N2(i), g.current = i, j([]);
    },
    getRootElement() {
      return r.current;
    },
    forceUpdate() {
      D([]);
    }
  }), [c]), useLayoutEffect(() => {
    if (f.current) {
      const { index: n, block: t } = f.current;
      f.current = void 0;
      const i = y.indexOf(n), l = I2.current.children[i];
      l && (l.scrollIntoView({ block: t }), T.current = true);
    }
  }, [$2]), useLayoutEffect(() => {
    const { ResizeObserver: n } = window, t = n && new n(() => {
      v(r.current.clientHeight);
    });
    return t == null || t.observe(r.current), () => {
      t == null || t.disconnect();
    };
  }, []), /* @__PURE__ */ jsxs("div", { ref: r, onScroll: G, className: e.className, style: { overflow: "auto", ...e.style }, children: [
    (M2 = e.renderHead) == null ? void 0 : M2.call(e),
    /* @__PURE__ */ jsx("div", { ref: I2, className: e.innerClassName, style: { display: "flex", flexDirection: "column", ...e.virtual && z2 }, children: U2.map((n, t) => e.renderItem(n, y[t])) }),
    (V2 = e.renderFoot) == null ? void 0 : V2.call(e)
  ] });
});
X.defaultProps = W$1;
const ne = {
  id: null,
  x: 0,
  y: 0,
  time: 0
}, Ke = {
  /**
   * 
   */
  idKey: "id",
  parentIdKey: "parent_id",
  childrenKey: "children",
  indent: 20,
  dragOpen: false,
  dragOpenDelay: 600,
  placeholderId: "__DRAG_PLACEHOLDER__",
  dataType: "flat",
  direction: "ltr",
  rootId: null,
  virtual: false
};
function He(r) {
  const e = { ...Ke, ...r }, { idKey: o, parentIdKey: n, childrenKey: I2, placeholderId: g, isFunctionReactive: p } = e, u = { idKey: o, parentIdKey: n };
  if (!e.renderNode && !e.renderNodeBox)
    throw new Error("Either renderNodeBox or renderNode is required.");
  const i = e.direction === "rtl", d = useMemo(() => e.openIds ? [...e.openIds].sort().toString() : void 0, [e.openIds]), y = useMemo(() => new Set(e.openIds), [d]), E2 = useMemo(() => e.checkedIds ? [...e.checkedIds].sort().toString() : "", [e.checkedIds]), N2 = useMemo(() => new Set(e.checkedIds), [E2]), O2 = useMemo(
    () => {
      var ie, ae;
      const D = {}, _2 = {}, B = [], H2 = [], V2 = [], J2 = [];
      function* le() {
        if (e.dataType === "flat")
          for (const t of e.data)
            yield [t];
        else
          for (const t of $(e.data, I2))
            yield t;
      }
      let U2 = 0;
      for (const [t, l] of le()) {
        const s = t[o] ?? U2;
        J2.push(s);
        let f = t[n];
        e.dataType === "tree" && (f = ((ie = l.parent) == null ? void 0 : ie[o]) ?? null);
        let R = _2[f] || null;
        const C = D[f] || null, v = [], h = [], b2 = [];
        let x2, k, T;
        C ? (x2 = C.childIds, k = C.children, T = C.childStats) : (x2 = B, k = H2, T = V2);
        const z2 = x2.length, L = (C == null ? void 0 : C.level) + 1 || 1, F = {
          _isStat: true,
          id: s,
          pid: f,
          childIds: v,
          siblingIds: x2,
          node: t,
          parent: R,
          parentStat: C,
          children: h,
          childStats: b2,
          siblings: k,
          siblingStats: T,
          index: z2,
          level: L,
          open: e.openIds ? y.has(s) : true,
          checked: N2.has(s),
          draggable: false
        };
        D[s] = F, _2[s] = t, x2.push(s), k.push(t), T.push(F), U2++;
      }
      for (const [t] of $(V2, "childStats")) {
        let l = ((ae = e.canDrag) == null ? void 0 : ae.call(e, t)) ?? null;
        l === null && (l = t.parentStat ? t.parentStat.draggable : true), t.draggable = l;
      }
      return {
        // root
        rootIds: B,
        rootNodes: H2,
        rootStats: V2,
        // 
        allIds: J2,
        // methods
        getStat: (t) => {
          let l;
          return typeof t == "object" ? l = t._isStat ? t.id : t[o] : l = t, D[l];
        }
      };
    },
    [
      e.data,
      e.dataType,
      o,
      n,
      y,
      N2,
      p && e.canDrag
    ]
  ), { rootIds: K, rootStats: P, getStat: a } = O2, S = e.indent, [c, m] = useState(), [M2, A] = useState(), X$12 = useRef(null), Y = useRef(null), [w, ee] = useState(), re = !c, ke = useMemo(
    () => {
      const D = [], _2 = [];
      for (const [t, { skipChildren: l }] of $(P, "childStats")) {
        const s = B(t);
        t === c && (Object.assign(s.style, {
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: "-999999999",
          visibility: "hidden"
        }), s["data-dragging"] = true), _2.push(s), D.push(t.id), (!t.open || t === c) && l();
      }
      if (w) {
        const l = ((f, R) => {
          let C = ((f == null ? void 0 : f.childStats) || P)[R], v;
          if (C)
            v = D.indexOf(C.id);
          else {
            const h = (x2) => x2.siblingStats[x2.siblingStats.indexOf(x2) + 1];
            let b2;
            if (f) {
              for (const x2 of ve(f, "parentStat", { withSelf: true }))
                if (b2 = h(x2), b2)
                  break;
            }
            b2 ? v = D.indexOf(b2.id) : v = D.length;
          }
          return v;
        })(w.parentStat, w.index);
        D.splice(l, 0, g);
        const s = B({
          id: g,
          level: w.level
        }, true);
        s["data-drag-placeholder"] = true, _2.splice(l, 0, s);
      }
      function B(t, l = false) {
        return {
          key: t.id,
          draggable: t.draggable,
          style: { [`padding${i ? "Right" : "Left"}`]: (t.level - 1) * S + "px" },
          "data-key": t.id + "",
          "data-level": t.level + "",
          "data-node-box": true,
          onDragStart(s) {
            var v;
            if (l) {
              s.preventDefault();
              return;
            }
            let f;
            const R = findParent(s.target, (h) => (!f && h.hasAttribute("draggable") && (f = h), h.hasAttribute("data-node-box")), { withSelf: true });
            if (R.querySelector("[draggable]") && f === R) {
              s.preventDefault();
              return;
            }
            if (s.dataTransfer.setData("text/plain", "he-tree he-tree-react"), s.dataTransfer.dropEffect = "move", e.customDragImage)
              e.customDragImage(s, t);
            else {
              const h = R.children[0];
              s.dataTransfer.setDragImage(h, i ? h.offsetWidth : 0, 0);
            }
            setTimeout(() => {
              var h;
              m(t), ee({
                ...w,
                parentStat: t.parentStat,
                level: t.level,
                index: (((h = t.parentStat) == null ? void 0 : h.childIds) || K).indexOf(t.id)
              });
            }, 0), (v = e.onDragStart) == null || v.call(e, s, t);
          },
          onDragLeave(s) {
          }
        };
      }
      const H2 = (t) => {
        var R, C, v;
        if (re && !((R = e.onExternalDragOver) != null && R.call(e, t)))
          return;
        const l = s();
        if (l) {
          const h = a(l.getAttribute("data-key")), b2 = !!l.getAttribute("data-drag-placeholder");
          f(h, b2) && e.onDragOpen(h);
          let x2 = pe(h, b2);
          const { closest: k, next: T } = x2;
          let { atTop: z2 } = x2;
          const L = Y.current, F = l;
          let Ie = (() => {
            let G = F.getBoundingClientRect(), W2;
            return i ? W2 = Math.ceil((G.right - t.clientX) / S) : W2 = Math.ceil((t.clientX - G.x) / S), between(W2, 0, ((k == null ? void 0 : k.level) || 0) + 1);
          })();
          if (!z2 && !b2 && k.id === K[0]) {
            const G = L.querySelector(`[data-key="${k.id}"]`);
            if (G) {
              const W2 = G.getBoundingClientRect();
              z2 = W2.y + W2.height / 2 > t.clientY;
            }
          }
          z2 && (Ie = 0);
          let de;
          if (z2)
            U2(null, 0) && (de = {
              ...w,
              parentStat: null,
              level: 1,
              index: 0
            });
          else {
            const G = T ? T.level - 1 : 0, W2 = [], De = [];
            let q = k;
            const ye = () => q ? q.level : 0;
            for (; ye() >= G; ) {
              const xe = ie(q, T);
              if (U2(q, xe) && (Ie > ye() ? W2 : De).unshift({
                parentStat: q,
                index: xe
              }), !q)
                break;
              q = q.parentStat;
            }
            let Q2 = arrayLast(W2);
            Q2 || (Q2 = arrayFirst(De)), Q2 && (de = {
              ...w,
              parentStat: Q2.parentStat,
              level: (((C = Q2.parentStat) == null ? void 0 : C.level) ?? 0) + 1,
              index: Q2.index
            });
          }
          ee(de), de && t.preventDefault(), A(b2 ? void 0 : h), (v = e.onDragOver) == null || v.call(e, t, h, re);
        } else
          U2(null, 0) && (ee({
            ...w,
            parentStat: null,
            level: 1,
            index: 0
          }), t.preventDefault());
        function s() {
          const b2 = Y.current.querySelectorAll("[data-node-box]:not([data-dragging])"), x2 = binarySearch(
            // @ts-ignore
            b2,
            (T) => T.getBoundingClientRect().top - t.clientY,
            { returnNearestIfNoHit: true }
          );
          let k;
          return x2.hit || x2.greater && (k = x2.index - 1, k < 0 && (k = 0)), k == null && (k = x2.index), b2[k];
        }
        function f(h, b2) {
          if (!e.dragOpen || b2 || h.open)
            return false;
          const x2 = () => Object.assign(ne, { id: h.id, x: t.clientX, y: t.clientY, time: Date.now() });
          if (ne.id !== h.id || Le(t.clientX, t.clientY, ne.x, ne.y) > 10)
            return x2(), false;
          if (Date.now() - ne.time >= e.dragOpenDelay)
            return true;
        }
      }, V2 = (t) => {
        var l, s;
        if (!(re && !((l = e.onExternalDragOver) != null && l.call(e, t))) && w && (t.preventDefault(), re)) {
          const { index: f } = w;
          (s = e.onExternalDrop) == null || s.call(e, t, w.parentStat, f), le();
        }
      };
      function J2(t) {
        var f, R;
        if (!c)
          return;
        let l = !w;
        if (!l) {
          let v = Y.current.getBoundingClientRect();
          l = !(t.clientX >= v.left && t.clientX <= v.right && t.clientY >= v.top && t.clientY <= v.bottom);
        }
        if (!(((f = e.onDragEnd) == null ? void 0 : f.call(e, t, c, l)) === false) && w) {
          let C = w.index;
          w.parentStat === c.parentStat && c.index < C && C--;
          const v = [...e.data];
          if (e.dataType === "flat") {
            const h = ((R = w.parentStat) == null ? void 0 : R.id) ?? e.rootId, b2 = Ae(v, c.id, u), x2 = { ...c.node, [n]: h };
            b2[0] = x2;
            const k = be(v, h, C, u);
            v.splice(k, 0, ...b2);
          } else {
            const h = /* @__PURE__ */ new Map(), b2 = (T) => {
              if (!T)
                return v;
              const z2 = b2(T.parentStat);
              let L = [...T.children];
              const F = h.get(T.node) || { ...T.node, [I2]: L };
              return h.set(T.node, F), L = F[I2], z2[T.index] = F, L;
            }, x2 = b2(c.parentStat), k = w.parentStat === c.parentStat ? x2 : b2(w.parentStat);
            x2.splice(c.index, 1), k.splice(C, 0, c.node);
          }
          e.onChange(v);
        }
        le();
      }
      function le() {
        A(void 0), m(void 0), ee(void 0);
      }
      function U2(t, l) {
        var f, R;
        if (!t)
          return ((f = e.canDropToRoot) == null ? void 0 : f.call(e, l)) ?? true;
        if (!t.open)
          return false;
        let s = (R = e.canDrop) == null ? void 0 : R.call(e, t, l);
        return s == null && (s = U2(t.parentStat)), s;
      }
      function pe(t, l) {
        let s = t, f = D.indexOf(l ? e.placeholderId : t.id), R = false;
        const C = (T) => T === g || a(T) === c, v = (T, z2) => {
          let L = T, F;
          do
            L += z2, F = D[L];
          while (F && C(F));
          return { id: F, i: L };
        }, h = (T, z2) => {
          const L = v(T, z2);
          s = a(L.id), f = L.i;
        }, b2 = 1;
        l && (h(f, -1), s || (R = true, h(-1, b2)));
        const k = a(v(f, b2).id);
        return { closest: s, atTop: R, next: k };
      }
      function ie(t, l) {
        const s = t ? t.childStats : P;
        let f = s.length;
        return l && l.siblingStats === s && (f = s.indexOf(l)), f;
      }
      function ae(t, l = "start") {
        const s = a(t);
        if (!s)
          return false;
        let f = D.indexOf(s.id);
        return f === -1 ? false : X$12.current ? (X$12.current.scrollToIndex(f, l), true) : false;
      }
      return { visibleIds: D, attrsList: _2, onDragOverRoot: H2, onDropToRoot: V2, onDragEndOnRoot: J2, scrollToNode: ae };
    },
    [
      O2,
      S,
      c,
      // watch placeholder position
      w == null ? void 0 : w.parentStat,
      w == null ? void 0 : w.index,
      // watch props
      S,
      g,
      i,
      e.rootId,
      // watch func
      ...[e.canDrop, e.canDropToRoot, e.customDragImage, e.onDragStart, e.onDragOver, e.onExternalDragOver, e.onExternalDrop, e.onDragEnd, e.onChange, e.onDragOpen].map((D) => p && D)
    ]
  ), ue = useMemo(() => ({
    getEl: () => window,
    onDragOverWindow: (D) => {
      _2() || (A(void 0), e.keepPlaceholder || ee(void 0));
      function _2() {
        let B = false, H2 = D.target;
        if (H2) {
          for (const V2 of ve(H2, "parentElement", { withSelf: true }))
            if (V2 === Y.current) {
              B = true;
              break;
            }
        }
        return B;
      }
    }
  }), [e.keepPlaceholder]);
  Be(ue.getEl, "dragover", ue.onDragOverWindow);
  const { visibleIds: se, attrsList: he, onDragOverRoot: Te, onDropToRoot: me, onDragEndOnRoot: Ee, scrollToNode: Ce } = ke, Ne = useMemo(() => c ? [se.indexOf(c.id)] : [], [c, se]), ge = (D) => {
    let _2 = e.renderNodeBox;
    if (!_2) {
      const B = /* @__PURE__ */ jsx("div", { className: "he-tree-drag-placeholder", style: { minHeight: "20px", border: "1px dashed blue" } });
      _2 = ({ stat: H2, attrs: V2, isPlaceholder: J2 }) => /* @__PURE__ */ createElement("div", { ...V2, key: V2.key }, J2 ? B : e.renderNode(H2));
    }
    return /* @__PURE__ */ jsx("div", { className: `he-tree ${(D == null ? void 0 : D.className) || ""}`, style: D == null ? void 0 : D.style, ref: Y, onDragOver: Te, onDrop: me, onDragEnd: Ee, children: /* @__PURE__ */ jsx(
      X,
      {
        ref: X$12,
        className: (D == null ? void 0 : D.listClassName) || "",
        innerClassName: (D == null ? void 0 : D.listInnerClassName) || "",
        items: se,
        virtual: e.virtual,
        persistentIndices: Ne,
        style: { height: "100%" },
        renderItem: (B, H2) => _2({
          stat: a(B),
          attrs: he[H2],
          isPlaceholder: B === g
        })
      }
    ) });
  };
  return {
    ...O2,
    // 
    visibleIds: se,
    attrsList: he,
    // ref
    virtualListRef: X$12,
    // drag states
    draggingStat: c,
    dragOverStat: M2,
    placeholder: w,
    // render
    renderTree: ge,
    renderHeTree: ge,
    // methods
    scrollToNode: Ce
  };
}
function* $(r, e = "children") {
  let o = false, n = false;
  const I2 = () => {
    o = true;
  }, g = () => {
    n = true;
  };
  yield* p(r, null, []);
  function* p(u, i, d) {
    let y = 0;
    for (const E2 of u) {
      if (yield [E2, { parent: i, parents: d, siblings: u, index: y, skipChildren: I2, exitWalk: g }], n)
        return;
      if (y++, o)
        o = false;
      else {
        const O2 = E2[e];
        if (O2 && (yield* p(O2, E2, [...d, E2]), n))
          return;
      }
    }
  }
}
function* ve(r, e, o = { withSelf: false }) {
  let n = r;
  for (; n; )
    (n !== r || o.withSelf) && (yield n), n = typeof e == "function" ? e(n) : n[e];
}
const Z = {
  idKey: "id",
  parentIdKey: "parent_id"
};
function* oe(r, e) {
  const o = { ...Z, ...e }, { idKey: n, parentIdKey: I2 } = o;
  let g = false, p = false;
  const u = () => {
    g = true;
  }, i = () => {
    p = true;
  }, d = {}, y = {}, E2 = {}, N2 = [];
  let O2, K = 0;
  for (const P of r) {
    const a = P[n], S = P[I2] ?? null;
    d[a] = P;
    const c = d[S] || null;
    E2[a] = [];
    const m = c ? E2[S] : N2, M2 = m.length;
    m.push(a);
    const A = {
      parent: c,
      parents: c ? [...y[S].parents, c] : [],
      index: M2,
      id: a,
      pid: S,
      treeIndex: K,
      skipChildren: u,
      exitWalk: i
    };
    y[a] = A;
    let X2 = false;
    if (g && O2 && (O2.has(S) ? (O2.add(a), X2 = true) : (g = false, O2 = void 0)), !X2) {
      if (yield [P, A], p)
        break;
      g && (O2 = /* @__PURE__ */ new Set([a]));
    }
    K++;
  }
}
function be(r, e, o, n) {
  const I2 = { ...Z, ...n }, { idKey: g, parentIdKey: p } = I2;
  let u = false, i = -1;
  for (const [d, { treeIndex: y, skipChildren: E2, index: N2 }] of oe(r, I2))
    if (e != null && !u)
      d[g] === e && (u = true);
    else if (e == null || d[p] === e)
      if (o != null && o === N2) {
        i = y;
        break;
      } else
        E2();
    else {
      i = y;
      break;
    }
  return i === -1 && (i = r.length), i;
}
function Ae(r, e, o) {
  if (e == null)
    return r.splice(0, r.length);
  const n = { ...Z, ...o }, { idKey: I2, parentIdKey: g } = n;
  let p = -1, u = -1;
  for (const [i, { treeIndex: d, skipChildren: y }] of oe(r, n))
    if (p === -1)
      i[I2] === e && (p = d, y());
    else {
      u = d;
      break;
    }
  return u === -1 && (u = r.length), p === -1 ? [] : r.splice(p, u - p);
}
function Le(r, e, o, n) {
  return Math.sqrt(Math.pow(o - r, 2) + Math.pow(n - e, 2));
}
function Be(r, e, o) {
  useLayoutEffect(() => {
    const n = r();
    return n == null || n.addEventListener(e, o), () => {
      n == null || n.removeEventListener(e, o);
    };
  }, [r, e, o]);
}
const NameEdit = ({ initialName, onSave, onCancel }) => {
  const [newName, setNewName] = useState(initialName);
  const handleSave = useCallback(() => {
    if (newName.trim()) {
      onSave(newName.trim());
    }
  }, [newName, onSave]);
  const handleCancel = useCallback(() => {
    setNewName(initialName);
    onCancel();
  }, [initialName, onCancel]);
  const handleChange = useCallback((e) => {
    setNewName(e.target.value);
  }, []);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );
  useEffect(() => {
    setNewName(initialName);
  }, [initialName]);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "text",
        value: newName,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        autoFocus: true
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: handleSave,
        className: "ml-1",
        "aria-label": "Save rename",
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        onClick: handleCancel,
        className: "ml-1",
        "aria-label": "Cancel rename",
        children: /* @__PURE__ */ jsx(X$1, { className: "h-4 w-4" })
      }
    )
  ] });
};
const TreeRowNode = memo(({
  node,
  id,
  level,
  open,
  draggable,
  onToggle,
  nodeAttributes,
  selectedLayerId,
  selectLayer
}) => {
  const componentRegistry = useEditorStore((state) => state.registry);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const { handleDelete, handleDuplicate, canDuplicate, canDelete } = useGlobalLayerActions(node.id);
  const [isRenaming, setIsRenaming] = useState(false);
  const [popoverOrMenuOpen, setPopoverOrMenuOpen] = useState(false);
  const handleOpen = useCallback(() => {
    onToggle(id, !open);
  }, [id, open, onToggle]);
  const handleSelect = useCallback(() => {
    selectLayer(node.id);
  }, [node.id, selectLayer]);
  const handleRenameClick = useCallback(() => {
    setIsRenaming(true);
  }, []);
  const handleSaveRename = useCallback(
    (newName) => {
      updateLayer(node.id, {}, { name: newName });
      setIsRenaming(false);
    },
    [node.id, updateLayer]
  );
  const handleCancelRename = useCallback(() => {
    setIsRenaming(false);
  }, []);
  const canRenderAddChild = useMemo(() => {
    const componentDef = componentRegistry[node.type];
    if (!componentDef) return false;
    return canComponentAcceptChildren(componentDef.schema);
  }, [node, componentRegistry]);
  const { key, ...rest } = nodeAttributes;
  if (!node) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { ...rest, className: "w-fit flex items-center group relative", children: [
    /* @__PURE__ */ jsx(RowOffset, { level }),
    hasLayerChildren(node) && node.children.length > 0 ? /* @__PURE__ */ jsx(
      Button,
      {
        className: "w-4 ml-3 p-0",
        variant: "ghost",
        size: "sm",
        onClick: handleOpen,
        children: open ? /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 bg-secondary rounded-full" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "size-4 bg-secondary rounded-full" })
      }
    ) : /* @__PURE__ */ jsx("div", { className: "size-4 rounded-none opacity-0 ml-3" }),
    isRenaming ? /* @__PURE__ */ jsx(
      NameEdit,
      {
        initialName: node.name ?? "",
        onSave: handleSaveRename,
        onCancel: handleCancelRename
      }
    ) : /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: cn(
          "pl-0 gap-0",
          node.id === selectedLayerId ? "text-primary" : "text-muted-foreground"
        ),
        onClick: handleSelect,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "w-4 h-full flex items-center justify-center cursor-move opacity-0 rounded group-hover:opacity-100 hover:bg-muted-foreground hover:text-muted transition-opacity duration-200 ease-in-out",
                popoverOrMenuOpen ? "opacity-100" : "opacity-0"
              ),
              draggable,
              children: /* @__PURE__ */ jsx(GripVertical, { className: "size-4" })
            }
          ),
          node.name
        ]
      }
    ),
    canRenderAddChild && /* @__PURE__ */ jsx(
      AddComponentsPopover,
      {
        parentLayerId: node.id,
        onOpenChange: setPopoverOrMenuOpen,
        children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: cn(
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out",
              popoverOrMenuOpen ? "opacity-100" : "opacity-0"
            ),
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Add component" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs(DropdownMenu, { onOpenChange: setPopoverOrMenuOpen, children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        Button,
        {
          className: cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out",
            popoverOrMenuOpen ? "opacity-100" : "opacity-0"
          ),
          variant: "ghost",
          size: "icon",
          "aria-label": "More options",
          children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" })
        }
      ) }),
      /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
        /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleRenameClick, children: "Rename" }),
        canDuplicate && /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleDuplicate, children: "Duplicate" }),
        canDelete && /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleDelete, children: "Remove" })
      ] })
    ] })
  ] }, key);
}, (prevProps, nextProps) => {
  if (prevProps.node.id !== nextProps.node.id) return false;
  if (!isDeepEqual(prevProps.node, nextProps.node)) return false;
  if (prevProps.id !== nextProps.id) return false;
  if (prevProps.level !== nextProps.level) return false;
  if (prevProps.open !== nextProps.open) return false;
  if (prevProps.draggable !== nextProps.draggable) return false;
  if (prevProps.selectedLayerId !== nextProps.selectedLayerId) return false;
  if (!isDeepEqual(prevProps.nodeAttributes, nextProps.nodeAttributes)) return false;
  if (prevProps.onToggle !== nextProps.onToggle) return false;
  if (prevProps.selectLayer !== nextProps.selectLayer) return false;
  return true;
});
TreeRowNode.displayName = "TreeRowNode";
const RowOffset = ({ level }) => {
  const style = useMemo(() => ({
    width: level * 20
  }), [level]);
  const arr = useMemo(() => Array.from({ length: level }), [level]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "z-[-1] left-0 pointer-events-none absolute flex flex-row bottom-[20px] h-full",
      style,
      children: arr.map((_2, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "w-5 h-full border-l border-dashed border-primary bg-background",
            index === level - 1 && "border-b "
          )
        },
        index
      ))
    }
  );
};
const TreeRowPlaceholder = ({ nodeAttributes }) => {
  const { key, ...rest } = nodeAttributes;
  return /* @__PURE__ */ jsx("div", { ...rest, className: "w-40 h-2", children: /* @__PURE__ */ jsx("div", { className: "size-full border-b-2 border-blue-500 border-dashed" }) }, key);
};
function DividerControl({
  className,
  addPosition,
  parentLayerId
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: cn("relative py-0", className), children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-primary border-dashed" }) }),
    /* @__PURE__ */ jsx(
      AddComponentsPopover,
      {
        onOpenChange: setPopoverOpen,
        addPosition,
        parentLayerId,
        children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "group flex items-center rounded-full bg-secondary h-min p-2 text-sm font-semibold text-secondar-foreground shadow-sm ring-1 ring-inset ring-secondary transition-all duration-200 ease-in-out gap-0",
            children: [
              /* @__PURE__ */ jsx(PlusCircle, { className: "h-5 w-5 text-secondary-foreground" }),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Add component" }),
              /* @__PURE__ */ jsx("span", { className: cn("overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-200 ease-in-out group-hover:pl-2", popoverOpen ? "max-w-xs pl-2" : "max-w-0"), children: "Add component" })
            ]
          }
        )
      }
    )
  ] });
}
const LayersPanel = ({ className }) => {
  const {
    selectedPageId,
    selectedLayerId,
    findLayerById,
    updateLayer,
    selectLayer
  } = useLayerStore();
  const pageLayer = findLayerById(selectedPageId);
  const layers = useMemo(() => [pageLayer], [pageLayer]);
  if (!pageLayer) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    LayersTree,
    {
      className,
      layers,
      selectedPageId,
      selectedLayerId,
      updateLayer,
      selectLayer
    }
  );
};
const LayersTree = React__default.memo(
  ({
    className,
    layers,
    selectedPageId,
    selectedLayerId,
    updateLayer,
    selectLayer
  }) => {
    const [openIdsArray, setOpenIdsArray] = useState([]);
    const prevSelectedLayerId = useRef(selectedLayerId);
    const handleNodeToggle = useCallback((id, open) => {
      setOpenIdsArray((prev) => {
        if (open) {
          return prev.includes(id) ? prev : [...prev, id];
        } else {
          return prev.filter((existingId) => existingId !== id);
        }
      });
    }, []);
    const handleChange = useCallback(
      (newLayers) => {
        if (Array.isArray(newLayers) && newLayers.length > 0) {
          const updatedPageLayer = newLayers[0];
          if (!updatedPageLayer || !updatedPageLayer.id || updatedPageLayer.id !== selectedPageId) {
            console.error(
              "LayersTree onChange: Invalid layer structure - ID mismatch",
              { updatedPageLayer, selectedPageId }
            );
            return;
          }
          const updatedChildren = hasLayerChildren(updatedPageLayer) ? updatedPageLayer.children || [] : [];
          const currentLayer = layers[0];
          const currentChildren = currentLayer && hasLayerChildren(currentLayer) ? currentLayer.children || [] : [];
          if (!isDeepEqual(currentChildren, updatedChildren)) {
            updateLayer(selectedPageId, {}, { children: updatedChildren });
          }
        } else {
          console.error(
            "LayersTree onChange: Invalid newLayers structure received",
            newLayers
          );
        }
      },
      [updateLayer, selectedPageId, layers]
    );
    const handleDragOpen = useCallback(
      (stat) => {
        if (hasLayerChildren(stat.node)) {
          handleNodeToggle(stat.id, true);
        }
      },
      [handleNodeToggle]
    );
    const canNodeDrop = useCallback((layer) => {
      const isDroppable = hasLayerChildren(layer.node);
      return isDroppable;
    }, []);
    const renderNode = useCallback(
      ({ stat, attrs, isPlaceholder }) => {
        const stableKey = isPlaceholder ? `placeholder-${attrs.key}` : stat.node.id;
        if (isPlaceholder) {
          return /* @__PURE__ */ jsx(
            TreeRowPlaceholder,
            {
              nodeAttributes: attrs
            },
            stableKey
          );
        }
        const findOriginalLayer = (layers2, id) => {
          for (const layer of layers2) {
            if (layer.id === id) return layer;
            if (hasLayerChildren(layer)) {
              const found = findOriginalLayer(layer.children, id);
              if (found) return found;
            }
          }
          return null;
        };
        const originalNode = findOriginalLayer(layers, stat.node.id) || stat.node;
        return /* @__PURE__ */ jsx(
          TreeRowNode,
          {
            nodeAttributes: attrs,
            node: originalNode,
            id: stat.id,
            open: stat.open,
            draggable: stat.draggable,
            onToggle: handleNodeToggle,
            level: stat.level,
            selectedLayerId,
            selectLayer
          },
          stableKey
        );
      },
      [
        handleNodeToggle,
        selectedLayerId,
        selectLayer,
        layers
      ]
    );
    const processedLayers = useMemo(() => {
      const processLayer = (layer) => {
        const processed = { ...layer };
        if (hasLayerChildren(layer)) {
          processed.children = layer.children.map(processLayer);
        } else if (typeof layer.children === "string") {
          processed.children = [];
        } else if (isVariableReference(layer.children)) {
          processed.children = [];
        } else if (!layer.children) {
          processed.children = [];
        }
        return processed;
      };
      return layers.map(processLayer);
    }, [layers]);
    const data = useMemo(() => {
      return {
        data: processedLayers,
        dataType: "tree",
        childrenKey: "children",
        openIds: openIdsArray,
        dragOpen: true,
        onChange: handleChange,
        renderNodeBox: renderNode,
        onDragOpen: handleDragOpen,
        canDrop: canNodeDrop
      };
    }, [
      processedLayers,
      openIdsArray,
      handleChange,
      renderNode,
      handleDragOpen,
      canNodeDrop
    ]);
    const { renderTree, scrollToNode } = He(data);
    useLayoutEffect(() => {
      if (selectedLayerId) {
        const parentLayers = findAllParentLayersRecursive(
          layers,
          selectedLayerId
        );
        const parentIds = parentLayers.map((layer) => layer.id);
        setOpenIdsArray((prevOpenIds) => {
          const newIds = [...prevOpenIds];
          let hasChanges = false;
          parentIds.forEach((id) => {
            if (!newIds.includes(id)) {
              newIds.push(id);
              hasChanges = true;
            }
          });
          return hasChanges ? newIds : prevOpenIds;
        });
      }
    }, [selectedLayerId, layers]);
    useLayoutEffect(() => {
      if (prevSelectedLayerId.current !== selectedLayerId) {
        prevSelectedLayerId.current = selectedLayerId;
        if (selectedLayerId) {
          scrollToNode(selectedLayerId);
        }
      }
    }, [scrollToNode, selectedLayerId]);
    const buttonClass = useMemo(() => {
      return cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "cursor-pointer w-full"
      );
    }, []);
    return /* @__PURE__ */ jsx(DevProfiler, { id: "LayersPanel", threshold: 40, children: /* @__PURE__ */ jsx(
      "div",
      {
        "data-testid": "layers-tree",
        className: cn(
          className,
          "flex flex-col size-full overflow-x-auto pl-4"
        ),
        children: layers.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            DividerControl,
            {
              className: "border-l border-dashed border-primary",
              addPosition: 0,
              parentLayerId: selectedPageId
            }
          ),
          renderTree(),
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-[1px] h-4 absolute left-0 bottom-0 border-l border-dashed border-primary bg-background" }) }),
          /* @__PURE__ */ jsx(
            DividerControl,
            {
              className: "border-l border-dashed border-primary",
              parentLayerId: selectedPageId
            }
          )
        ] }) : /* @__PURE__ */ jsx(
          AddComponentsPopover,
          {
            parentLayerId: selectedPageId,
            className: "w-full mt-4",
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: buttonClass,
                children: [
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Add Component" }),
                  /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" }),
                  /* @__PURE__ */ jsx("span", { children: "Add Component" })
                ]
              }
            )
          }
        )
      }
    ) });
  },
  (prevProps, nextProps) => {
    return isDeepEqual(prevProps.layers, nextProps.layers) && prevProps.selectedPageId === nextProps.selectedPageId && prevProps.selectedLayerId === nextProps.selectedLayerId && prevProps.className === nextProps.className;
  }
);
LayersTree.displayName = "LayersTree";
const TransformAwareDragOverlay = ({ children }) => {
  const [mountNode, setMountNode] = useState(null);
  const overlayStyle = useMemo(() => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 9999
  }), []);
  useEffect(() => {
    const transformComponent = document.querySelector('[data-testid="transform-component"]');
    if (transformComponent) {
      setMountNode(transformComponent);
    } else {
      const editorContainer = document.getElementById("editor-panel-content");
      setMountNode(editorContainer);
    }
  }, []);
  if (!mountNode) {
    return /* @__PURE__ */ jsx(DragOverlay, { dropAnimation: null, children });
  }
  return createPortal(
    /* @__PURE__ */ jsx("div", { style: overlayStyle, children: /* @__PURE__ */ jsx(DragOverlay, { dropAnimation: null, children }) }),
    mountNode
  );
};
const DragOverlayContent = ({ layerId, componentType }) => {
  const layer = useLayerStore((state) => layerId ? state.findLayerById(layerId) : null);
  const displayName = layer?.name || layer?.type || componentType || "Component";
  if (!layer && !componentType) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "mt-10 bg-white dark:bg-gray-800 shadow-lg border-2 border-primary/50 rounded-lg px-3 py-2 text-sm font-medium opacity-90 text-nowrap min-w-fit pointer-events-none", children: displayName });
};
const AUTO_SCROLL_THRESHOLD = 50;
const MIN_SCROLL_SPEED = 5;
const MAX_SCROLL_SPEED = 25;
const calculateScrollSpeed = (distanceFromEdge) => {
  if (distanceFromEdge >= AUTO_SCROLL_THRESHOLD) return 0;
  const speedRatio = (AUTO_SCROLL_THRESHOLD - distanceFromEdge) / AUTO_SCROLL_THRESHOLD;
  const easedRatio = Math.pow(speedRatio, 2);
  return MIN_SCROLL_SPEED + (MAX_SCROLL_SPEED - MIN_SCROLL_SPEED) * easedRatio;
};
const useAutoScroll = () => {
  const autoScrollStateRef = useRef({
    isScrolling: false,
    directions: { left: false, right: false, top: false, bottom: false },
    speeds: { horizontal: 0, vertical: 0 }
  });
  const mousePositionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const performAutoScroll = useCallback(() => {
    const iframeElements = getIframeElements();
    if (!iframeElements || !mousePositionRef.current) {
      return;
    }
    const { iframe, window: iframeWindow } = iframeElements;
    const iframeRect = iframe.getBoundingClientRect();
    const iframeMouseX = mousePositionRef.current.x - iframeRect.left;
    const iframeMouseY = mousePositionRef.current.y - iframeRect.top;
    const scrollableWidth = iframeRect.width;
    const scrollableHeight = iframeRect.height;
    const distanceFromLeft = iframeMouseX;
    const distanceFromRight = scrollableWidth - iframeMouseX;
    const distanceFromTop = iframeMouseY;
    const distanceFromBottom = scrollableHeight - iframeMouseY;
    let shouldScrollLeft = distanceFromLeft < AUTO_SCROLL_THRESHOLD;
    let shouldScrollRight = distanceFromRight < AUTO_SCROLL_THRESHOLD;
    let shouldScrollUp = distanceFromTop < AUTO_SCROLL_THRESHOLD;
    let shouldScrollDown = distanceFromBottom < AUTO_SCROLL_THRESHOLD;
    if (shouldScrollLeft && shouldScrollRight) {
      if (distanceFromLeft < distanceFromRight) {
        shouldScrollRight = false;
      } else {
        shouldScrollLeft = false;
      }
    }
    if (shouldScrollUp && shouldScrollDown) {
      if (distanceFromTop < distanceFromBottom) {
        shouldScrollDown = false;
      } else {
        shouldScrollUp = false;
      }
    }
    const leftSpeed = shouldScrollLeft ? calculateScrollSpeed(Math.max(0, distanceFromLeft)) : 0;
    const rightSpeed = shouldScrollRight ? calculateScrollSpeed(Math.max(0, distanceFromRight)) : 0;
    const upSpeed = shouldScrollUp ? calculateScrollSpeed(Math.max(0, distanceFromTop)) : 0;
    const downSpeed = shouldScrollDown ? calculateScrollSpeed(Math.max(0, distanceFromBottom)) : 0;
    const state = autoScrollStateRef.current;
    state.directions = {
      left: shouldScrollLeft,
      right: shouldScrollRight,
      top: shouldScrollUp,
      bottom: shouldScrollDown
    };
    state.speeds = {
      horizontal: leftSpeed || rightSpeed,
      vertical: upSpeed || downSpeed
    };
    state.isScrolling = shouldScrollLeft || shouldScrollRight || shouldScrollUp || shouldScrollDown;
    if (state.isScrolling) {
      let scrollX = 0;
      let scrollY = 0;
      if (shouldScrollLeft) scrollX = -leftSpeed;
      else if (shouldScrollRight) scrollX = rightSpeed;
      if (shouldScrollUp) scrollY = -upSpeed;
      else if (shouldScrollDown) scrollY = downSpeed;
      if (scrollX !== 0 || scrollY !== 0) {
        try {
          iframeWindow.scrollBy(scrollX, scrollY);
        } catch (error) {
          console.warn("Auto-scroll failed:", error);
        }
      }
      animationFrameRef.current = requestAnimationFrame(performAutoScroll);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, []);
  const handleParentMouseMove = useCallback((event, isDragging) => {
    if (!isDragging) return;
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(performAutoScroll);
    }
  }, [performAutoScroll]);
  const handleIframeMouseMove = useCallback((event, isDragging) => {
    if (!isDragging) return;
    const iframeElements = getIframeElements();
    if (!iframeElements) return;
    const { iframe } = iframeElements;
    const iframeRect = iframe.getBoundingClientRect();
    const parentX = event.clientX + iframeRect.left;
    const parentY = event.clientY + iframeRect.top;
    mousePositionRef.current = { x: parentX, y: parentY };
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(performAutoScroll);
    }
  }, [performAutoScroll]);
  const stopAutoScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    autoScrollStateRef.current = {
      isScrolling: false,
      directions: { left: false, right: false, top: false, bottom: false },
      speeds: { horizontal: 0, vertical: 0 }
    };
    mousePositionRef.current = null;
  }, []);
  return {
    handleParentMouseMove,
    handleIframeMouseMove,
    stopAutoScroll,
    autoScrollState: autoScrollStateRef.current
  };
};
const useDndSensors = () => {
  return useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8
      }
    })
  );
};
const useDndEventHandlers = ({
  stopAutoScroll,
  setActiveLayerId,
  setNewComponentType,
  clearDragState,
  canDropOnLayer
}) => {
  const moveLayer = useLayerStore((state) => state.moveLayer);
  const addComponentLayer = useLayerStore((state) => state.addComponentLayer);
  const pages = useLayerStore((state) => state.pages);
  const isLayerDescendantOf = useCallback((childId, parentId) => {
    if (childId === parentId) return true;
    const parentLayers = findAllParentLayersRecursive(pages, childId);
    return parentLayers.some((parent) => parent.id === parentId);
  }, [pages]);
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    if (active.data.current?.type === "layer") {
      setActiveLayerId(active.data.current.layerId);
    } else if (active.data.current?.type === "new-component") {
      const componentType = active.data.current.componentType;
      if (componentType && setNewComponentType) {
        setNewComponentType(componentType);
      }
    }
  }, [setActiveLayerId, setNewComponentType]);
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    stopAutoScroll();
    const activeData = active.data.current;
    const overData = over?.data.current;
    if (!over || !overData || overData.type !== "drop-zone") {
      if (clearDragState) {
        clearDragState();
      } else {
        setActiveLayerId(null);
      }
      return;
    }
    const targetParentId = overData.parentId;
    const targetPosition = overData.position;
    if (canDropOnLayer && !canDropOnLayer(targetParentId)) {
      if (clearDragState) {
        clearDragState();
      } else {
        setActiveLayerId(null);
      }
      return;
    }
    if (activeData?.type === "layer" && activeData.layerId) {
      const activeLayerId = activeData.layerId;
      if (isLayerDescendantOf(targetParentId, activeLayerId)) {
        if (clearDragState) {
          clearDragState();
        } else {
          setActiveLayerId(null);
        }
        return;
      }
      moveLayer(activeLayerId, targetParentId, targetPosition);
    } else if (activeData?.type === "new-component" && activeData.componentType) {
      addComponentLayer(activeData.componentType, targetParentId, targetPosition);
    }
    if (clearDragState) {
      clearDragState();
    } else {
      setActiveLayerId(null);
    }
  }, [moveLayer, addComponentLayer, isLayerDescendantOf, stopAutoScroll, setActiveLayerId, clearDragState, canDropOnLayer]);
  const handleDragCancel = useCallback(() => {
    stopAutoScroll();
    if (clearDragState) {
      clearDragState();
    } else {
      setActiveLayerId(null);
    }
  }, [stopAutoScroll, setActiveLayerId, clearDragState]);
  return {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isLayerDescendantOf
  };
};
const useDropValidation = (activeLayerId, isLayerDescendantOf, newComponentType) => {
  const findLayerById = useLayerStore((state) => state.findLayerById);
  const componentRegistry = useEditorStore((state) => state.registry);
  const canDropOnLayer = useCallback((layerId) => {
    if (!layerId) return false;
    const targetLayer = findLayerById(layerId);
    if (!targetLayer) return false;
    if (!activeLayerId && !newComponentType) {
      return canLayerAcceptChildren(targetLayer, componentRegistry);
    }
    if (newComponentType) {
      const componentDef = componentRegistry[newComponentType];
      if (componentDef?.childOf && !componentDef.childOf.includes(targetLayer.type)) {
        return false;
      }
      return canLayerAcceptChildren(targetLayer, componentRegistry);
    }
    if (activeLayerId) {
      if (isLayerDescendantOf(layerId, activeLayerId)) {
        return false;
      }
      const draggedLayer = findLayerById(activeLayerId);
      if (!draggedLayer) {
        return canLayerAcceptChildren(targetLayer, componentRegistry);
      }
      const draggedDef = componentRegistry[draggedLayer.type];
      if (draggedDef?.childOf && !draggedDef.childOf.includes(targetLayer.type)) {
        return false;
      }
    }
    return canLayerAcceptChildren(targetLayer, componentRegistry);
  }, [activeLayerId, newComponentType, isLayerDescendantOf, findLayerById, componentRegistry]);
  return { canDropOnLayer };
};
const useKeyboardShortcutsDnd = (activeLayerId, handleDragCancel) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && activeLayerId) {
        event.preventDefault();
        event.stopPropagation();
        handleDragCancel();
      }
    };
    if (activeLayerId) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [activeLayerId, handleDragCancel]);
};
const DndContextProvider = ({ children }) => {
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [newComponentType, setNewComponentType] = useState(null);
  const [componentDragging, setComponentDragging] = useState(false);
  const { handleParentMouseMove, handleIframeMouseMove, stopAutoScroll } = useAutoScroll();
  const sensors = useDndSensors();
  const clearDragState = useCallback(() => {
    setActiveLayerId(null);
    setNewComponentType(null);
  }, []);
  const canDropOnLayerRef = React__default.useRef(() => false);
  const { handleDragStart, handleDragEnd, handleDragCancel, isLayerDescendantOf } = useDndEventHandlers({
    stopAutoScroll,
    setActiveLayerId,
    setNewComponentType,
    clearDragState,
    canDropOnLayer: (layerId) => canDropOnLayerRef.current(layerId)
  });
  const { canDropOnLayer } = useDropValidation(activeLayerId, isLayerDescendantOf, newComponentType);
  React__default.useEffect(() => {
    canDropOnLayerRef.current = canDropOnLayer;
  }, [canDropOnLayer]);
  const handleKeyboardCancel = useCallback(() => {
    handleDragCancel();
    clearDragState();
  }, [handleDragCancel, clearDragState]);
  useKeyboardShortcutsDnd(activeLayerId || newComponentType, handleKeyboardCancel);
  const collisionDetection = createTransformAwareCollisionDetection();
  const contextValue = useMemo(() => ({
    isDragging: !!activeLayerId || !!newComponentType,
    activeLayerId,
    newComponentType,
    canDropOnLayer
  }), [activeLayerId, newComponentType, canDropOnLayer]);
  const componentDragContextValue = useMemo(() => ({
    isDragging: componentDragging,
    setDragging: setComponentDragging
  }), [componentDragging]);
  const isDragging = !!activeLayerId || !!newComponentType;
  useEffect(() => {
    if (isDragging) {
      const handleParentMove = (event) => handleParentMouseMove(event, true);
      document.addEventListener("mousemove", handleParentMove);
      const iframeElements = getIframeElements();
      let iframeCleanup = null;
      if (iframeElements) {
        const { window: iframeWindow } = iframeElements;
        if (iframeWindow) {
          const handleIframeMove = (event) => handleIframeMouseMove(event, true);
          iframeWindow.addEventListener("mousemove", handleIframeMove);
          iframeCleanup = () => {
            try {
              iframeWindow.removeEventListener("mousemove", handleIframeMove);
            } catch (error) {
              console.warn("Failed to remove iframe mouse listener:", error);
            }
          };
        }
      }
      return () => {
        document.removeEventListener("mousemove", handleParentMove);
        if (iframeCleanup) {
          iframeCleanup();
        }
        stopAutoScroll();
      };
    } else {
      stopAutoScroll();
    }
  }, [isDragging, handleParentMouseMove, handleIframeMouseMove, stopAutoScroll]);
  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);
  return /* @__PURE__ */ jsx(DndContextStateContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(ComponentDragContext.Provider, { value: componentDragContextValue, children: /* @__PURE__ */ jsxs(
    DndContext,
    {
      sensors,
      collisionDetection,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
      children: [
        children,
        /* @__PURE__ */ jsx(TransformAwareDragOverlay, { children: activeLayerId || newComponentType ? /* @__PURE__ */ jsx(
          DragOverlayContent,
          {
            layerId: activeLayerId || void 0,
            componentType: newComponentType || void 0
          }
        ) : null })
      ]
    }
  ) }) });
};
const LayerContextMenuPortal = () => {
  const contextMenu = useEditorStore((state) => state.contextMenu);
  const closeContextMenu = useEditorStore((state) => state.closeContextMenu);
  const selectedLayerId = useLayerStore((state) => state.selectedLayerId);
  const { isDragging } = useDndContext();
  const [mounted, setMounted] = useState(false);
  const contextMenuLayerIdRef = useRef(null);
  const frameContext = useFrame();
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(2),
      // Small offset from cursor
      flip({
        fallbackPlacements: ["top-start", "bottom-end", "top-end"],
        padding: 8
      }),
      shift({
        crossAxis: true,
        limiter: limitShift(),
        padding: 8
      })
    ]
  });
  useEffect(() => {
    if (!contextMenu.open) return;
    const virtualReference = {
      getBoundingClientRect: () => ({
        x: contextMenu.x,
        y: contextMenu.y,
        width: 0,
        height: 0,
        top: contextMenu.y,
        left: contextMenu.x,
        right: contextMenu.x,
        bottom: contextMenu.y
      })
    };
    refs.setPositionReference(virtualReference);
  }, [contextMenu.open, contextMenu.x, contextMenu.y, refs]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (contextMenu.open && contextMenu.layerId) {
      contextMenuLayerIdRef.current = contextMenu.layerId;
    } else {
      contextMenuLayerIdRef.current = null;
    }
  }, [contextMenu.open, contextMenu.layerId]);
  useEffect(() => {
    if (contextMenu.open && contextMenuLayerIdRef.current && selectedLayerId !== contextMenuLayerIdRef.current) {
      closeContextMenu();
    }
  }, [selectedLayerId, contextMenu.open, closeContextMenu]);
  useEffect(() => {
    if (isDragging && contextMenu.open) {
      closeContextMenu();
    }
  }, [isDragging, contextMenu.open, closeContextMenu]);
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleClickOutside = (e) => {
      const floatingEl = refs.floating.current;
      if (floatingEl && !floatingEl.contains(e.target)) {
        closeContextMenu();
      }
    };
    const handleContextMenuOutside = (e) => {
      const floatingEl = refs.floating.current;
      if (floatingEl && !floatingEl.contains(e.target)) {
        closeContextMenu();
      }
    };
    const targetDoc = frameContext.document ?? document;
    targetDoc.addEventListener("mousedown", handleClickOutside);
    targetDoc.addEventListener("contextmenu", handleContextMenuOutside);
    return () => {
      targetDoc.removeEventListener("mousedown", handleClickOutside);
      targetDoc.removeEventListener("contextmenu", handleContextMenuOutside);
    };
  }, [contextMenu.open, closeContextMenu, refs.floating, frameContext.document]);
  useEffect(() => {
    if (!contextMenu.open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeContextMenu();
      }
    };
    const targetDoc = frameContext.document ?? document;
    targetDoc.addEventListener("keydown", handleKeyDown);
    return () => targetDoc.removeEventListener("keydown", handleKeyDown);
  }, [contextMenu.open, closeContextMenu, frameContext.document]);
  if (!mounted || !contextMenu.open || !contextMenu.layerId) {
    return null;
  }
  const portalTarget = frameContext.document?.body || document.body;
  const menuContent = /* @__PURE__ */ jsx(
    "div",
    {
      ref: refs.setFloating,
      "data-testid": "layer-context-menu-portal",
      className: "z-[10000] min-w-[14rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      style: floatingStyles,
      children: /* @__PURE__ */ jsx(
        ContextMenuPortalItems,
        {
          layerId: contextMenu.layerId,
          onAction: closeContextMenu
        }
      )
    }
  );
  return createPortal(menuContent, portalTarget);
};
const ContextMenuPortalItems = ({
  layerId,
  onAction
}) => {
  const selectedLayer = useLayerStore((state) => state.findLayerById(layerId));
  const findLayerById = useLayerStore((state) => state.findLayerById);
  const componentRegistry = useEditorStore((state) => state.registry);
  const clipboardLayer = useEditorStore((state) => state.clipboard.layer);
  const {
    canDuplicate,
    canDelete,
    canCut,
    handleCopy,
    handleCut,
    handlePaste,
    handleDelete,
    handleDuplicate
  } = useGlobalLayerActions(layerId);
  const canPaste = React__default.useMemo(() => {
    if (!clipboardLayer || !selectedLayer) return false;
    return canPasteLayer(clipboardLayer, layerId, componentRegistry, findLayerById);
  }, [clipboardLayer, layerId, componentRegistry, findLayerById, selectedLayer]);
  const canRenderAddChild = React__default.useMemo(() => {
    if (!selectedLayer) return false;
    const componentDef = componentRegistry[selectedLayer.type];
    if (!componentDef) return false;
    return canComponentAcceptChildren(componentDef.schema);
  }, [selectedLayer, componentRegistry]);
  const handleCopyClick = useCallback(() => {
    handleCopy();
    onAction();
  }, [handleCopy, onAction]);
  const handleCutClick = useCallback(() => {
    handleCut();
    onAction();
  }, [handleCut, onAction]);
  const handlePasteClick = useCallback(() => {
    handlePaste();
    onAction();
  }, [handlePaste, onAction]);
  const handleDuplicateClick = useCallback(() => {
    handleDuplicate();
    onAction();
  }, [handleDuplicate, onAction]);
  const handleDeleteClick = useCallback(() => {
    handleDelete();
    onAction();
  }, [handleDelete, onAction]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    canRenderAddChild && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(AddComponentsPopover, { parentLayerId: layerId, children: /* @__PURE__ */ jsxs(MenuItem, { onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Child"
      ] }) }),
      /* @__PURE__ */ jsx(MenuSeparator, {})
    ] }),
    /* @__PURE__ */ jsxs(MenuItem, { onClick: handleCopyClick, children: [
      /* @__PURE__ */ jsx(Copy, { className: "mr-2 h-4 w-4" }),
      "Copy",
      /* @__PURE__ */ jsx(MenuShortcut, { children: SHORTCUTS.copy.shortcutDisplay })
    ] }),
    canCut && /* @__PURE__ */ jsxs(MenuItem, { onClick: handleCutClick, children: [
      /* @__PURE__ */ jsx(Scissors, { className: "mr-2 h-4 w-4" }),
      "Cut",
      /* @__PURE__ */ jsx(MenuShortcut, { children: SHORTCUTS.cut.shortcutDisplay })
    ] }),
    /* @__PURE__ */ jsxs(MenuItem, { onClick: handlePasteClick, disabled: !canPaste, children: [
      /* @__PURE__ */ jsx(ClipboardPaste, { className: "mr-2 h-4 w-4" }),
      "Paste",
      /* @__PURE__ */ jsx(MenuShortcut, { children: SHORTCUTS.paste.shortcutDisplay })
    ] }),
    /* @__PURE__ */ jsx(MenuSeparator, {}),
    canDuplicate && /* @__PURE__ */ jsxs(MenuItem, { onClick: handleDuplicateClick, children: [
      /* @__PURE__ */ jsx(CopyPlus, { className: "mr-2 h-4 w-4" }),
      "Duplicate",
      /* @__PURE__ */ jsx(MenuShortcut, { children: SHORTCUTS.duplicate.shortcutDisplay })
    ] }),
    canDelete && /* @__PURE__ */ jsxs(
      MenuItem,
      {
        onClick: handleDeleteClick,
        className: "text-destructive focus:text-destructive",
        children: [
          /* @__PURE__ */ jsx(Trash, { className: "mr-2 h-4 w-4" }),
          "Delete",
          /* @__PURE__ */ jsx(MenuShortcut, { children: SHORTCUTS.delete.shortcutDisplay })
        ]
      }
    )
  ] });
};
const MenuItem = ({
  children,
  onClick,
  disabled,
  className
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "menuitem",
      "data-testid": "menu-item",
      onClick: disabled ? void 0 : onClick,
      className: cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      ),
      children
    }
  );
};
const MenuSeparator = () => {
  return /* @__PURE__ */ jsx("div", { className: "-mx-1 my-1 h-px bg-muted", "data-testid": "menu-separator" });
};
const MenuShortcut = ({ children }) => {
  return /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs tracking-widest opacity-60", "data-testid": "menu-shortcut", children });
};
const WRAPPER_STYLE = {
  width: "100%",
  height: "100%"
};
const CONTENT_STYLE = {
  width: "100%",
  height: "100%"
};
const TRANSFORM_DIV_STYLE = {
  minHeight: "100vh",
  padding: "50px"
};
const WHEEL_CONFIG = { step: 0.1 };
const DOUBLE_CLICK_CONFIG = { disabled: false };
const ZoomControls = ({
  onPointerEventsToggle,
  pointerEventsEnabled
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const handleZoomIn = useCallback(() => zoomIn(), [zoomIn]);
  const handleZoomOut = useCallback(() => zoomOut(), [zoomOut]);
  const handleReset = useCallback(() => resetTransform(), [resetTransform]);
  const handleTogglePointerEvents = useCallback(() => {
    onPointerEventsToggle(!pointerEventsEnabled);
  }, [onPointerEventsToggle, pointerEventsEnabled]);
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "absolute bottom-24 md:bottom-4 right-4 z-[1000] flex shadow-lg rounded-full", children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          "data-testid": "button-ZoomIn",
          variant: "secondary",
          className: "size-14 md:size-10 rounded-l-full rounded-r-none border-r border-border [&_svg]:size-7 [&_svg]:md:size-4",
          onClick: handleZoomIn,
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Zoom in" }),
            /* @__PURE__ */ jsx(ZoomIn, { className: "text-secondary-foreground" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: "top", children: /* @__PURE__ */ jsx("p", { children: "Zoom in" }) })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          "data-testid": "button-ZoomOut",
          variant: "secondary",
          className: "size-14 md:size-10 rounded-none border-r border-border [&_svg]:size-7 [&_svg]:md:size-4",
          onClick: handleZoomOut,
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Zoom out" }),
            /* @__PURE__ */ jsx(ZoomOut, { className: "text-secondary-foreground" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: "top", children: /* @__PURE__ */ jsx("p", { children: "Zoom out" }) })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          "data-testid": "button-Reset",
          variant: "secondary",
          className: "size-14 md:size-10 rounded-none border-r border-border [&_svg]:size-7 [&_svg]:md:size-4",
          onClick: handleReset,
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Reset" }),
            /* @__PURE__ */ jsx(Crosshair, { className: "text-secondary-foreground" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: "top", children: /* @__PURE__ */ jsx("p", { children: "Reset zoom and position" }) })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          "data-testid": "button-PointerEvents",
          variant: pointerEventsEnabled ? "default" : "secondary",
          className: "size-14 md:size-10 rounded-r-full rounded-l-none [&_svg]:size-7 [&_svg]:md:size-4",
          onClick: handleTogglePointerEvents,
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: pointerEventsEnabled ? "Disable pointer events" : "Enable pointer events" }),
            /* @__PURE__ */ jsx(MousePointer, { className: pointerEventsEnabled ? "text-primary-foreground" : "text-secondary-foreground" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TooltipContent, { side: "top", children: /* @__PURE__ */ jsx("p", { children: pointerEventsEnabled ? "Disable page interaction" : "Enable page interaction" }) })
    ] })
  ] }) });
};
const EditorPanel = ({ className }) => {
  const {
    selectLayer,
    selectedLayerId,
    findLayerById,
    selectedPageId
  } = useLayerStore();
  const previewMode = useEditorStore((state) => state.previewMode);
  const componentRegistry = useEditorStore((state) => state.registry);
  const selectedLayer = findLayerById(selectedLayerId);
  const selectedPage = findLayerById(selectedPageId);
  const onSelectElement = useCallback(
    (layerId) => {
      selectLayer(layerId);
    },
    [selectLayer]
  );
  return /* @__PURE__ */ jsx(DndContextProvider, { children: /* @__PURE__ */ jsx(
    EditorPanelContent,
    {
      className,
      selectedLayerId,
      selectedPageId,
      selectedLayer,
      selectedPage,
      previewMode,
      componentRegistry,
      autoZoomToSelected: false,
      onSelectElement
    }
  ) });
};
const EditorPanelContent = ({
  className,
  selectedPageId,
  selectedLayerId,
  selectedLayer,
  selectedPage,
  previewMode,
  componentRegistry,
  autoZoomToSelected,
  onSelectElement
}) => {
  const { isDragging: isComponentDragging } = useComponentDragContext();
  const [resizing, setResizing] = useState(false);
  const [frameSize, setFrameSize] = useState({
    width: 1e3,
    height: 1e3
  });
  const [pointerEventsEnabled, setPointerEventsEnabled] = useState(true);
  const frameRef = useRef(null);
  const handleResizingChange = useCallback((isDragging) => {
    setResizing(isDragging);
  }, []);
  const handleSizeChange = useCallback((width, height) => {
    setFrameSize({ width, height });
  }, []);
  const handlePointerEventsToggle = useCallback((enabled) => {
    setPointerEventsEnabled(enabled);
  }, []);
  const layers = selectedPage.children;
  const totalLayers = useMemo(() => countLayers(layers), [layers]);
  const editorConfig = useMemo(
    () => ({
      zIndex: 1,
      totalLayers,
      selectedLayer,
      onSelectElement
    }),
    [
      totalLayers,
      selectedLayer,
      onSelectElement
    ]
  );
  const widthClass = useMemo(() => {
    if (previewMode === "responsive") {
      return "w-full";
    } else if (previewMode === "mobile") {
      return "w-[390px]";
    } else if (previewMode === "tablet") {
      return "w-[768px]";
    } else if (previewMode === "desktop") {
      return "w-[1440px]";
    } else {
      return "w-full";
    }
  }, [previewMode]);
  const heightClass = useMemo(() => {
    if (previewMode === "responsive") {
      return "";
    } else if (previewMode === "mobile") {
      return "h-[844px]";
    } else if (previewMode === "tablet") {
      return "h-[1024px]";
    } else if (previewMode === "desktop") {
      return "h-[900px]";
    } else {
      return "h-full";
    }
  }, [previewMode]);
  const resizableProps = useMemo(() => ({
    isResizable: previewMode === "responsive",
    onDraggingChange: handleResizingChange,
    onSizeChange: handleSizeChange
  }), [previewMode, handleResizingChange, handleSizeChange]);
  const autoFrameProps = useMemo(() => ({
    height: frameSize.height,
    className: cn("shadow-lg", widthClass, heightClass),
    pointerEventsEnabled
  }), [frameSize.height, widthClass, heightClass, pointerEventsEnabled]);
  const layerRendererProps = useMemo(() => ({
    className: "contents",
    page: selectedPage,
    editorConfig,
    componentRegistry
  }), [selectedPage, editorConfig, componentRegistry]);
  const renderer = useMemo(
    () => /* @__PURE__ */ jsx(ResizableWrapper, { ...resizableProps, children: /* @__PURE__ */ jsx(
      "div",
      {
        id: "editor-panel-content",
        className: cn("overflow-visible ", widthClass),
        children: /* @__PURE__ */ jsxs(AutoFrame, { ...autoFrameProps, ref: frameRef, children: [
          /* @__PURE__ */ jsx(LayerRenderer, { ...layerRendererProps }),
          /* @__PURE__ */ jsx(LayerContextMenuPortal, {})
        ] })
      }
    ) }),
    [resizableProps, widthClass, autoFrameProps, layerRendererProps]
  );
  const wrapperStyle = WRAPPER_STYLE;
  const contentStyle = CONTENT_STYLE;
  const transformDivStyle = TRANSFORM_DIV_STYLE;
  const wheelConfig = WHEEL_CONFIG;
  const doubleClickConfig = DOUBLE_CLICK_CONFIG;
  const panningConfig = useMemo(() => ({
    disabled: resizing || isComponentDragging
  }), [resizing, isComponentDragging]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id: "editor-panel-container",
      className: cn(
        "flex flex-col relative size-full bg-fixed bg-[radial-gradient(hsl(var(--border))_1px,hsl(var(--primary)/0.05)_1px)] [background-size:16px_16px] will-change-auto",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          TransformWrapper,
          {
            initialScale: 0.8,
            initialPositionX: -30,
            initialPositionY: -30,
            minScale: 0.1,
            maxScale: 5,
            wheel: wheelConfig,
            doubleClick: doubleClickConfig,
            panning: panningConfig,
            centerOnInit: false,
            limitToBounds: false,
            children: [
              /* @__PURE__ */ jsx(
                ZoomControls,
                {
                  onPointerEventsToggle: handlePointerEventsToggle,
                  pointerEventsEnabled
                }
              ),
              autoZoomToSelected && /* @__PURE__ */ jsx(
                AutoZoomToSelected,
                {
                  selectedLayerId,
                  autoZoomToSelected
                }
              ),
              /* @__PURE__ */ jsx(
                TransformComponent,
                {
                  wrapperStyle,
                  contentStyle,
                  children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn("relative", widthClass),
                      "data-testid": "transform-component",
                      style: transformDivStyle,
                      children: renderer
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(AddComponentsPopover, { parentLayerId: selectedPageId, enableDragToCanvas: true, children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "secondary",
            size: "icon",
            className: "absolute bottom-4 left-4 size-14 md:size-10 flex items-center rounded-full bg-secondary shadow-lg z-[1000] [&_svg]:size-7 [&_svg]:md:size-4",
            children: /* @__PURE__ */ jsx(Plus, { className: "text-secondary-foreground" })
          }
        ) })
      ]
    }
  );
};
const AutoZoomToSelected = ({ selectedLayerId, autoZoomToSelected }) => {
  const { zoomToElement } = useControls();
  const previousSelectedLayerIdRef = useRef(null);
  useEffect(() => {
    if (!selectedLayerId || !zoomToElement || !autoZoomToSelected) return;
    if (previousSelectedLayerIdRef.current === selectedLayerId) return;
    previousSelectedLayerIdRef.current = selectedLayerId;
    const timeoutId = setTimeout(() => {
      const selectedElement = document.querySelector(`[data-layer-id="${selectedLayerId}"]`) || document.getElementById(`layer-${selectedLayerId}`);
      if (selectedElement) {
        zoomToElement(selectedElement, void 0, 300);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedLayerId, zoomToElement, autoZoomToSelected]);
  return null;
};
const PropsPanel = React__default.memo(({ className }) => {
  const selectedLayerId = useLayerStore((state) => state.selectedLayerId);
  const findLayerById = useLayerStore((state) => state.findLayerById);
  const removeLayer = useLayerStore((state) => state.removeLayer);
  const duplicateLayer = useLayerStore((state) => state.duplicateLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const addComponentLayer = useLayerStore((state) => state.addComponentLayer);
  const componentRegistry = useEditorStore((state) => state.registry);
  const selectedLayer = findLayerById(selectedLayerId);
  const handleAddComponentLayer = useCallback(
    (layerType, parentLayerId, addPosition) => {
      addComponentLayer(layerType, parentLayerId, addPosition);
    },
    [addComponentLayer]
  );
  const handleDeleteLayer = useCallback(
    (layerId) => {
      removeLayer(layerId);
    },
    [removeLayer]
  );
  const handleDuplicateLayer = useCallback(() => {
    if (selectedLayer) {
      duplicateLayer(selectedLayer.id);
    }
  }, [selectedLayer, duplicateLayer]);
  const handleUpdateLayer = useCallback(
    (id, props2, rest) => {
      updateLayer(id, props2, rest);
    },
    [updateLayer]
  );
  if (selectedLayer && !componentRegistry[selectedLayer.type]) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className, children: [
    selectedLayer && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Title, {}),
      /* @__PURE__ */ jsxs("h3", { className: "text-base font-medium mb-4", children: [
        "Type: ",
        selectedLayer.type.replaceAll("_", "")
      ] })
    ] }),
    !selectedLayer && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Component Properties" }),
      /* @__PURE__ */ jsx("p", { children: "No component selected" })
    ] }),
    selectedLayer && /* @__PURE__ */ jsx(
      ComponentPropsAutoForm,
      {
        componentRegistry,
        selectedLayerId: selectedLayer.id,
        removeLayer: handleDeleteLayer,
        duplicateLayer: handleDuplicateLayer,
        updateLayer: handleUpdateLayer,
        addComponentLayer: handleAddComponentLayer
      },
      selectedLayer.id
    )
  ] });
});
PropsPanel.displayName = "PropsPanel";
const EMPTY_ZOD_SCHEMA = z$1.object({});
const EMPTY_FORM_VALUES = {};
const ComponentPropsAutoForm = ({
  selectedLayerId,
  componentRegistry,
  removeLayer,
  duplicateLayer,
  updateLayer,
  addComponentLayer
}) => {
  const findLayerById = useLayerStore((state) => state.findLayerById);
  const revisionCounter = useEditorStore((state) => state.revisionCounter);
  const selectedLayer = findLayerById(selectedLayerId);
  const isPage = useLayerStore((state) => state.isLayerAPage(selectedLayerId));
  const allowPagesCreation = useEditorStore(
    (state) => state.allowPagesCreation
  );
  const allowPagesDeletion = useEditorStore(
    (state) => state.allowPagesDeletion
  );
  const { schema } = useMemo(() => {
    if (selectedLayer && componentRegistry[selectedLayer.type]) {
      const registryEntry = componentRegistry[selectedLayer.type];
      if (registryEntry) {
        return registryEntry;
      }
    }
    return { schema: EMPTY_ZOD_SCHEMA };
  }, [selectedLayer, componentRegistry]);
  const handleDeleteLayer = useCallback(() => {
    removeLayer(selectedLayerId);
  }, [removeLayer, selectedLayerId]);
  const handleDuplicateLayer = useCallback(() => {
    duplicateLayer(selectedLayerId);
  }, [duplicateLayer, selectedLayerId]);
  const variables = useLayerStore((state) => state.variables);
  const onParsedValuesChange = useCallback(
    (parsedValues) => {
      const { children, ...dataProps } = parsedValues;
      const preservedProps = {};
      if (selectedLayer) {
        Object.assign(preservedProps, selectedLayer.props);
        Object.keys(dataProps).forEach((key) => {
          const originalValue = selectedLayer.props[key];
          const newValue = dataProps[key];
          const fieldDef = "shape" in schema && schema.shape ? schema.shape[key] : void 0;
          const baseType = fieldDef ? getBaseType(fieldDef) : void 0;
          if (isVariableReference(originalValue)) {
            const variableExists = variables.some((v) => v.id === originalValue.__variableRef);
            if (variableExists) {
              preservedProps[key] = originalValue;
            } else {
              preservedProps[key] = newValue;
            }
          } else {
            if (baseType === "ZodDate" && newValue instanceof Date) {
              preservedProps[key] = newValue.toISOString();
            } else {
              preservedProps[key] = newValue;
            }
          }
        });
      }
      const originalChildren = selectedLayer?.children;
      const shouldPreserveChildrenBinding = isVariableReference(originalChildren) && variables.some((v) => v.id === originalChildren.__variableRef);
      if (shouldPreserveChildrenBinding) {
        updateLayer(selectedLayerId, preservedProps);
      } else if (typeof children === "string") {
        updateLayer(selectedLayerId, preservedProps, { children });
      } else if (children && children.layerType) {
        updateLayer(selectedLayerId, preservedProps, {
          children: selectedLayer?.children
        });
        addComponentLayer(
          children.layerType,
          selectedLayerId,
          children.addPosition
        );
      } else {
        updateLayer(selectedLayerId, preservedProps);
      }
    },
    [updateLayer, selectedLayerId, selectedLayer, addComponentLayer, schema, variables]
  );
  const formValues = useMemo(() => {
    if (!selectedLayer) return EMPTY_FORM_VALUES;
    const resolvedProps = resolveVariableReferences(
      selectedLayer.props,
      variables
    );
    const transformedProps = {};
    const schemaShape = "shape" in schema && schema.shape ? schema.shape : void 0;
    if (schemaShape) {
      for (const [key, value] of Object.entries(resolvedProps)) {
        const fieldDef = schemaShape[key];
        if (fieldDef) {
          const baseType = getBaseType(fieldDef);
          if (baseType === "ZodEnum") {
            transformedProps[key] = typeof value === "string" ? value : String(value);
          } else if (baseType === "ZodDate") {
            if (value instanceof Date) {
              transformedProps[key] = value;
            } else if (typeof value === "string" || typeof value === "number") {
              const date = new Date(value);
              transformedProps[key] = isNaN(date.getTime()) ? void 0 : date;
            } else {
              transformedProps[key] = void 0;
            }
          } else {
            transformedProps[key] = value;
          }
        } else {
          transformedProps[key] = value;
        }
      }
    } else {
      Object.assign(transformedProps, resolvedProps);
    }
    return { ...transformedProps, children: selectedLayer.children };
  }, [selectedLayer, schema, revisionCounter]);
  const autoFormSchema = useMemo(() => {
    if ("shape" in schema && typeof schema.shape === "object") {
      try {
        return addDefaultValues(schema, formValues);
      } catch (error) {
        console.warn("Failed to add default values to schema:", error);
        return schema;
      }
    }
    return schema;
  }, [schema, formValues]);
  const autoFormFieldConfig = useMemo(() => {
    if (!selectedLayer) return void 0;
    return generateFieldOverrides(componentRegistry, selectedLayer);
  }, [componentRegistry, selectedLayer, selectedLayer?.props]);
  const formKey = useMemo(() => {
    return `${selectedLayerId}-${revisionCounter}`;
  }, [selectedLayerId, revisionCounter]);
  if (!selectedLayer || !componentRegistry[selectedLayer.type]) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    AutoForm,
    {
      formSchema: autoFormSchema,
      values: formValues,
      onParsedValuesChange,
      fieldConfig: autoFormFieldConfig,
      className: "space-y-4 mt-4",
      children: [
        (!isPage || allowPagesCreation) && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "secondary",
            className: "mt-4 w-full",
            onClick: handleDuplicateLayer,
            "data-testid": `button-Duplicate ,${isPage ? "Page" : "Component"}`,
            children: [
              "Duplicate ",
              isPage ? "Page" : "Component"
            ]
          }
        ),
        (!isPage || allowPagesDeletion) && /* @__PURE__ */ jsxs(
          Button,
          {
            type: "button",
            variant: "destructive",
            className: "mt-4 w-full",
            onClick: handleDeleteLayer,
            "data-testid": `button-Delete ,${isPage ? "Page" : "Component"}`,
            children: [
              "Delete ",
              isPage ? "Page" : "Component"
            ]
          }
        )
      ]
    },
    formKey
  );
};
ComponentPropsAutoForm.displayName = "ComponentPropsAutoForm";
const nameForLayer = (layer) => {
  return layer.name || layer.type.replaceAll("_", "");
};
const Title = React__default.memo(() => {
  const selectedLayer = useLayerStore((state) => {
    const selectedLayerId = state.selectedLayerId;
    return selectedLayerId ? state.findLayerById(selectedLayerId) : null;
  });
  return /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-2", children: [
    selectedLayer ? nameForLayer(selectedLayer) : "",
    " Properties"
  ] });
});
Title.displayName = "Title";
var M = (e, i, s, u, m, a, l, h) => {
  let d = document.documentElement, w = ["light", "dark"];
  function p(n) {
    (Array.isArray(e) ? e : [e]).forEach((y) => {
      let k = y === "class", S = k && a ? m.map((f) => a[f] || f) : m;
      k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
    }), R(n);
  }
  function R(n) {
    h && w.includes(n) && (d.style.colorScheme = n);
  }
  function c() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  if (u) p(u);
  else try {
    let n = localStorage.getItem(i) || s, y = l && n === "system" ? c() : n;
    p(y);
  } catch (n) {
  }
};
var b = ["light", "dark"], I = "(prefers-color-scheme: dark)", O = typeof window == "undefined", x = React.createContext(void 0), U = { setTheme: (e) => {
}, themes: [] }, z = () => {
  var e;
  return (e = React.useContext(x)) != null ? e : U;
}, J = (e) => React.useContext(x) ? React.createElement(React.Fragment, null, e.children) : React.createElement(V, { ...e }), N = ["light", "dark"], V = ({ forcedTheme: e, disableTransitionOnChange: i = false, enableSystem: s = true, enableColorScheme: u = true, storageKey: m = "theme", themes: a = N, defaultTheme: l = s ? "system" : "light", attribute: h = "data-theme", value: d, children: w, nonce: p, scriptProps: R }) => {
  let [c, n] = React.useState(() => H(m, l)), [T, y] = React.useState(() => c === "system" ? E() : c), k = d ? Object.values(d) : a, S = React.useCallback((o) => {
    let r = o;
    if (!r) return;
    o === "system" && s && (r = E());
    let v = d ? d[r] : r, C = i ? W(p) : null, P = document.documentElement, L = (g) => {
      g === "class" ? (P.classList.remove(...k), v && P.classList.add(v)) : g.startsWith("data-") && (v ? P.setAttribute(g, v) : P.removeAttribute(g));
    };
    if (Array.isArray(h) ? h.forEach(L) : L(h), u) {
      let g = b.includes(l) ? l : null, D = b.includes(r) ? r : g;
      P.style.colorScheme = D;
    }
    C == null || C();
  }, [p]), f = React.useCallback((o) => {
    let r = typeof o == "function" ? o(c) : o;
    n(r);
    try {
      localStorage.setItem(m, r);
    } catch (v) {
    }
  }, [c]), A = React.useCallback((o) => {
    let r = E(o);
    y(r), c === "system" && s && !e && S("system");
  }, [c, e]);
  React.useEffect(() => {
    let o = window.matchMedia(I);
    return o.addListener(A), A(o), () => o.removeListener(A);
  }, [A]), React.useEffect(() => {
    let o = (r) => {
      r.key === m && (r.newValue ? n(r.newValue) : f(l));
    };
    return window.addEventListener("storage", o), () => window.removeEventListener("storage", o);
  }, [f]), React.useEffect(() => {
    S(e != null ? e : c);
  }, [e, c]);
  let Q2 = React.useMemo(() => ({ theme: c, setTheme: f, forcedTheme: e, resolvedTheme: c === "system" ? T : c, themes: s ? [...a, "system"] : a, systemTheme: s ? T : void 0 }), [c, f, e, T, s, a]);
  return React.createElement(x.Provider, { value: Q2 }, React.createElement(_, { forcedTheme: e, storageKey: m, attribute: h, enableSystem: s, enableColorScheme: u, defaultTheme: l, value: d, themes: a, nonce: p, scriptProps: R }), w);
}, _ = React.memo(({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w }) => {
  let p = JSON.stringify([s, i, a, e, h, l, u, m]).slice(1, -1);
  return React.createElement("script", { ...w, suppressHydrationWarning: true, nonce: typeof window == "undefined" ? d : "", dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` } });
}), H = (e, i) => {
  if (O) return;
  let s;
  try {
    s = localStorage.getItem(e) || void 0;
  } catch (u) {
  }
  return s || i;
}, W = (e) => {
  let i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(i), () => {
    window.getComputedStyle(document.body), setTimeout(() => {
      document.head.removeChild(i);
    }, 1);
  };
}, E = (e) => (e || (e = window.matchMedia(I)), e.matches ? "dark" : "light");
const Z_INDEX = 1e3;
function NavBar({ leftChildren, rightChildren, showExport = true } = {}) {
  const selectedPageId = useLayerStore((state) => state.selectedPageId);
  const findLayerById = useLayerStore((state) => state.findLayerById);
  const componentRegistry = useEditorStore((state) => state.registry);
  const incrementRevision = useEditorStore((state) => state.incrementRevision);
  const showLeftPanel = useEditorStore((state) => state.showLeftPanel);
  const setShowLeftPanel = useEditorStore((state) => state.setShowLeftPanel);
  const showRightPanel = useEditorStore((state) => state.showRightPanel);
  const setShowRightPanel = useEditorStore((state) => state.setShowRightPanel);
  const pastStates = useStore$1(
    useLayerStore.temporal,
    (state) => state.pastStates
  );
  const futureStates = useStore$1(
    useLayerStore.temporal,
    (state) => state.futureStates
  );
  const { undo, redo } = useLayerStore.temporal.getState();
  const page = findLayerById(selectedPageId);
  const canUndo = !!pastStates.length;
  const canRedo = !!futureStates.length;
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const handleUndo = useCallback(() => {
    undo();
    incrementRevision();
  }, [undo, incrementRevision]);
  const handleRedo = useCallback(() => {
    redo();
    incrementRevision();
  }, [redo, incrementRevision]);
  const keyCombinations = useMemo(
    () => [
      // Use shortcut registry for undo/redo
      toKeyboardShortcut("undo", (e) => {
        e.preventDefault();
        handleUndo();
      }),
      toKeyboardShortcut("redo", (e) => {
        e.preventDefault();
        handleRedo();
      }),
      // Debug shortcuts (not in registry)
      {
        keys: { metaKey: true, shiftKey: true },
        key: "9",
        handler: (e) => {
          e.preventDefault();
          const elements = document.querySelectorAll("*");
          elements.forEach((element) => {
            element.classList.add("animate-spin", "origin-center");
          });
        }
      },
      {
        keys: { metaKey: true, shiftKey: true },
        key: "0",
        handler: (e) => {
          e.preventDefault();
          const elements = document.querySelectorAll("*");
          elements.forEach((element) => {
            element.classList.remove("animate-spin", "origin-center");
          });
        }
      }
    ],
    [handleUndo, handleRedo]
  );
  useKeyboardShortcuts(keyCombinations);
  const handleOpenPreview = useCallback(() => {
    setIsPreviewModalOpen(true);
  }, []);
  const handleOpenExport = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);
  const handleToggleLeftPanel = useCallback(() => {
    setShowLeftPanel(!showLeftPanel);
  }, [showLeftPanel, setShowLeftPanel]);
  const handleToggleRightPanel = useCallback(() => {
    setShowRightPanel(!showRightPanel);
  }, [showRightPanel, setShowRightPanel]);
  const style = useMemo(() => ({ zIndex: Z_INDEX }), []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-center justify-between bg-background px-2 md:px-6 py-4 border-b",
      style,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          leftChildren,
          leftChildren && /* @__PURE__ */ jsx("div", { className: "hidden md:flex h-10 w-px bg-border" }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:contents", children: [
            /* @__PURE__ */ jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleToggleLeftPanel,
                  variant: showLeftPanel ? "secondary" : "outline",
                  size: "icon",
                  className: "flex flex-col justify-center",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Left Panel" }),
                    /* @__PURE__ */ jsx(PanelLeft, { className: "w-4 h-4" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxs(TooltipContent, { children: [
                showLeftPanel ? "Hide" : "Show",
                " Left Panel"
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleToggleRightPanel,
                  variant: showRightPanel ? "secondary" : "outline",
                  size: "icon",
                  className: "flex flex-col justify-center",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Right Panel" }),
                    /* @__PURE__ */ jsx(PanelRight, { className: "w-4 h-4" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxs(TooltipContent, { children: [
                showRightPanel ? "Hide" : "Show",
                " Right Panel"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex h-10 w-px bg-border" }),
          /* @__PURE__ */ jsx(PagesPopover, {}),
          /* @__PURE__ */ jsx(PreviewModeToggle, {})
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex space-x-2", children: [
            /* @__PURE__ */ jsx(
              ActionButtons,
              {
                canUndo,
                canRedo,
                onUndo: handleUndo,
                onRedo: handleRedo,
                onOpenPreview: handleOpenPreview,
                onOpenExport: handleOpenExport,
                showExport
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "h-10 flex w-px bg-border" })
          ] }),
          /* @__PURE__ */ jsx(ModeToggle, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex md:hidden space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 flex w-px bg-border" }),
            /* @__PURE__ */ jsx(
              ResponsiveDropdown,
              {
                canUndo,
                canRedo,
                onUndo: handleUndo,
                onRedo: handleRedo,
                onOpenPreview: handleOpenPreview,
                onOpenExport: handleOpenExport,
                showExport,
                children: rightChildren
              }
            )
          ] }),
          rightChildren && /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-px bg-border" }),
            rightChildren
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          PreviewDialog,
          {
            isOpen: isPreviewModalOpen,
            onOpenChange: setIsPreviewModalOpen,
            page,
            componentRegistry
          }
        ),
        showExport && /* @__PURE__ */ jsx(
          CodeDialog,
          {
            isOpen: isExportModalOpen,
            onOpenChange: setIsExportModalOpen
          }
        )
      ]
    }
  );
}
const ActionButtons = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenPreview,
  onOpenExport,
  showExport = true
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onUndo,
          variant: "secondary",
          size: "icon",
          disabled: !canUndo,
          className: "flex flex-col justify-center",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Undo" }),
            /* @__PURE__ */ jsx(Undo, { className: "w-4 h-4" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(TooltipContent, { className: "flex items-center gap-2", children: [
        "Undo",
        /* @__PURE__ */ jsx(CommandShortcut, { className: "ml-0 text-sm leading-3", children: SHORTCUTS.undo.shortcutDisplay })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onRedo,
          variant: "secondary",
          size: "icon",
          disabled: !canRedo,
          className: "flex flex-col justify-center",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Redo" }),
            /* @__PURE__ */ jsx(Redo, { className: "w-4 h-4" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(TooltipContent, { className: "flex items-center gap-2", children: [
        "Redo",
        /* @__PURE__ */ jsx(CommandShortcut, { className: "ml-0 text-sm leading-3", children: SHORTCUTS.redo.shortcutDisplay })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onOpenPreview,
          variant: "secondary",
          size: "icon",
          className: "flex flex-col justify-center",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Preview" }),
            /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(TooltipContent, { className: "flex items-center gap-2", children: [
        "Preview",
        /* @__PURE__ */ jsx(CommandShortcut, { className: "ml-0 text-sm leading-3", children: "⌘+⇧+P" })
      ] })
    ] }),
    showExport && /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: onOpenExport,
          variant: "secondary",
          size: "icon",
          className: "flex flex-col justify-center",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Export" }),
            /* @__PURE__ */ jsx(FileUp, { className: "w-4 h-4" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs(TooltipContent, { className: "flex items-center gap-2", children: [
        "Export Code",
        /* @__PURE__ */ jsx(CommandShortcut, { className: "ml-0 text-sm leading-3", children: "⌘+⇧+E" })
      ] })
    ] })
  ] });
};
const ResponsiveDropdown = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenPreview,
  onOpenExport,
  showExport = true,
  children
}) => {
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", children: [
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Actions" }),
      /* @__PURE__ */ jsx(MoreVertical, { className: "w-4 h-4" })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", style, children: [
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          className: "gap-2",
          onClick: onUndo,
          disabled: !canUndo,
          children: [
            /* @__PURE__ */ jsx(Undo, { className: "w-4 h-4" }),
            "Undo",
            /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: SHORTCUTS.undo.shortcutDisplay })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          className: "gap-2",
          onClick: onRedo,
          disabled: !canRedo,
          children: [
            /* @__PURE__ */ jsx(Redo, { className: "w-4 h-4" }),
            "Redo",
            /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: SHORTCUTS.redo.shortcutDisplay })
          ]
        }
      ),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "gap-2", onClick: onOpenPreview, children: [
        /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
        "Preview",
        /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: "⌘+⇧+P" })
      ] }),
      showExport && /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "gap-2", onClick: onOpenExport, children: [
        /* @__PURE__ */ jsx(FileUp, { className: "w-4 h-4" }),
        "Export",
        /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: "⌘+⇧+E" })
      ] }),
      children && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsx("div", { className: "p-2", children })
      ] })
    ] })
  ] });
};
const PreviewDialog = ({
  isOpen,
  onOpenChange,
  page,
  componentRegistry
}) => {
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  const shortcuts = useMemo(
    () => [
      {
        keys: { metaKey: true, shiftKey: true },
        key: "p",
        handler: (e) => {
          e.preventDefault();
          onOpenChange(true);
        }
      }
    ],
    [onOpenChange]
  );
  useKeyboardShortcuts(shortcuts);
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, {}),
    /* @__PURE__ */ jsxs(
      DialogContentWithZIndex,
      {
        className: "max-w-[calc(100dvw)] max-h-[calc(100dvh)] overflow-auto p-0 gap-0",
        style,
        children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "py-3 bg-yellow-600 text-center", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "Page Preview" }) }) }),
          /* @__PURE__ */ jsx(
            LayerRenderer,
            {
              className: "w-full h-full flex flex-col overflow-x-hidden",
              page,
              componentRegistry
            }
          )
        ]
      }
    )
  ] });
};
const CodeDialog = ({ isOpen, onOpenChange }) => {
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  const shortcuts = useMemo(
    () => [
      {
        keys: { metaKey: true, shiftKey: true },
        key: "e",
        handler: (e) => {
          e.preventDefault();
          onOpenChange(true);
        }
      }
    ],
    [onOpenChange]
  );
  useKeyboardShortcuts(shortcuts);
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogTrigger, {}),
    /* @__PURE__ */ jsxs(
      DialogContentWithZIndex,
      {
        className: "sm:max-w-[625px] max-h-[625px]",
        style,
        children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Generated Code" }) }),
          /* @__PURE__ */ jsx(CodePanel, {})
        ]
      }
    )
  ] });
};
function ModeToggle() {
  const { setTheme } = z();
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  const handleSetLightTheme = useCallback(() => {
    setTheme("light");
  }, [setTheme]);
  const handleSetDarkTheme = useCallback(() => {
    setTheme("dark");
  }, [setTheme]);
  const handleSetSystemTheme = useCallback(() => {
    setTheme("system");
  }, [setTheme]);
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", children: [
        /* @__PURE__ */ jsx(SunIcon, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx(MoonIcon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
      ] }) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: "Toggle theme" })
    ] }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", style, children: [
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleSetLightTheme, children: "Light" }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleSetDarkTheme, children: "Dark" }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: handleSetSystemTheme, children: "System" })
    ] })
  ] });
}
function PagesPopover() {
  const { pages, selectedPageId, addPageLayer, selectPage } = useLayerStore();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedPage, setSelectedPage] = useState(
    selectedPageId
  );
  const [textInputValue, setTextInputValue] = useState("");
  const allowPagesCreation = useEditorStore(
    (state) => state.allowPagesCreation
  );
  const selectedPageData = useMemo(() => {
    return pages.find((page) => page.id === selectedPageId);
  }, [pages, selectedPageId]);
  const handleSelect = useCallback(
    (pageId) => {
      setSelectedPage(pageId);
      selectPage(pageId);
      setOpen(false);
    },
    [selectPage, setOpen]
  );
  const handleAddPageLayer = useCallback(
    (pageName) => {
      addPageLayer(pageName);
      setTextInputValue("");
    },
    [addPageLayer, setTextInputValue]
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleAddPageLayer(textInputValue);
    },
    [handleAddPageLayer, textInputValue]
  );
  const handleTextInputChange = useCallback(
    (e) => {
      setTextInputValue(e.target.value);
    },
    [setTextInputValue]
  );
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddPageLayer(textInputValue);
      }
    },
    [handleAddPageLayer, textInputValue]
  );
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  const textInputForm = /* @__PURE__ */ jsx("form", { className: "w-full", onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center space-x-2", children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        className: "w-full flex-grow",
        placeholder: "New page name...",
        value: textInputValue,
        onChange: handleTextInputChange,
        onKeyDown: handleKeyDown
      }
    ),
    /* @__PURE__ */ jsx(Button, { type: "submit", variant: "secondary", children: /* @__PURE__ */ jsx(PlusIcon, { className: "w-4 h-4" }) })
  ] }) });
  return /* @__PURE__ */ jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "default",
          className: "max-w-30 overflow-hidden",
          children: selectedPageData?.name
        }
      ) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: "Select page" })
    ] }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[300px] p-0", style, children: /* @__PURE__ */ jsxs(Command, { children: [
      /* @__PURE__ */ jsx(
        CommandInput,
        {
          placeholder: "Select page or create new...",
          value: inputValue,
          onValueChange: setInputValue
        }
      ),
      /* @__PURE__ */ jsxs(CommandList, { children: [
        /* @__PURE__ */ jsxs(CommandEmpty, { children: [
          "No pages found",
          allowPagesCreation && textInputForm
        ] }),
        pages.map((page) => /* @__PURE__ */ jsx(
          PageItem,
          {
            selectedPageId,
            page,
            onSelect: handleSelect
          },
          page.id
        )),
        /* @__PURE__ */ jsx(CommandSeparator, {}),
        allowPagesCreation && /* @__PURE__ */ jsx(CommandGroup, { heading: "Create new page", children: /* @__PURE__ */ jsx(CommandItem, { children: textInputForm }) })
      ] })
    ] }) })
  ] }) });
}
const PageItem = ({
  selectedPageId,
  page,
  onSelect
}) => {
  const handleSelect = useCallback(() => {
    onSelect(page.id);
  }, [onSelect, page.id]);
  return /* @__PURE__ */ jsxs(
    CommandItem,
    {
      value: page.name,
      onSelect: handleSelect,
      className: cn(selectedPageId === page.id && "font-bold"),
      children: [
        selectedPageId === page.id ? /* @__PURE__ */ jsx(CheckIcon, { className: "w-4 h-4 mr-2" }) : null,
        page.name
      ]
    }
  );
};
const DialogContentWithZIndex = forwardRef(({ className, children, ...props2 }, ref) => {
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  return /* @__PURE__ */ jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsx(DialogOverlay, { style }),
    /* @__PURE__ */ jsxs(
      DialogContent,
      {
        ref,
        className: cn(
          "fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        ),
        ...props2,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
            /* @__PURE__ */ jsx(X$1, { className: "h-4 w-4 rounded-full p-1" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
});
DialogContentWithZIndex.displayName = "DialogContentWithZIndex";
const PreviewModeToggle = () => {
  const { previewMode, setPreviewMode } = useEditorStore();
  const handleSelect = useCallback((mode) => {
    setPreviewMode(mode);
  }, [setPreviewMode]);
  const style = useMemo(() => ({ zIndex: Z_INDEX + 1 }), []);
  const previewModeIcon = useMemo(() => {
    return {
      mobile: /* @__PURE__ */ jsx(Smartphone, { className: "h-4 w-4" }),
      tablet: /* @__PURE__ */ jsx(Tablet, { className: "h-4 w-4" }),
      desktop: /* @__PURE__ */ jsx(Monitor, { className: "h-4 w-4" }),
      responsive: /* @__PURE__ */ jsx(Maximize, { className: "h-4 w-4" })
    }[previewMode];
  }, [previewMode]);
  const handleSelectMobile = useCallback(() => {
    handleSelect("mobile");
  }, [handleSelect]);
  const handleSelectTablet = useCallback(() => {
    handleSelect("tablet");
  }, [handleSelect]);
  const handleSelectDesktop = useCallback(() => {
    handleSelect("desktop");
  }, [handleSelect]);
  const handleSelectResponsive = useCallback(() => {
    handleSelect("responsive");
  }, [handleSelect]);
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", children: [
        previewModeIcon,
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Select screen size" })
      ] }) }) }),
      /* @__PURE__ */ jsx(TooltipContent, { children: "Select screen size" })
    ] }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", style, children: [
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onSelect: handleSelectMobile,
          className: previewMode === "mobile" ? "bg-secondary text-secondary-foreground" : "",
          children: [
            /* @__PURE__ */ jsx(Smartphone, { className: "mr-2 h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Mobile" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onSelect: handleSelectTablet,
          className: previewMode === "tablet" ? "bg-secondary text-secondary-foreground" : "",
          children: [
            /* @__PURE__ */ jsx(Tablet, { className: "mr-2 h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Tablet" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onSelect: handleSelectDesktop,
          className: previewMode === "desktop" ? "bg-secondary text-secondary-foreground" : "",
          children: [
            /* @__PURE__ */ jsx(Monitor, { className: "mr-2 h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Desktop" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onSelect: handleSelectResponsive,
          className: previewMode === "responsive" ? "bg-secondary text-secondary-foreground" : "",
          children: [
            /* @__PURE__ */ jsx(Maximize, { className: "mr-2 h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { children: "Responsive" })
          ]
        }
      )
    ] })
  ] });
};
const isBrowser = typeof window !== "undefined";
const PanelGroupContext = createContext(null);
PanelGroupContext.displayName = "PanelGroupContext";
const DATA_ATTRIBUTES = {
  group: "data-panel-group",
  groupDirection: "data-panel-group-direction",
  groupId: "data-panel-group-id",
  panel: "data-panel",
  panelCollapsible: "data-panel-collapsible",
  panelId: "data-panel-id",
  panelSize: "data-panel-size",
  resizeHandle: "data-resize-handle",
  resizeHandleActive: "data-resize-handle-active",
  resizeHandleEnabled: "data-panel-resize-handle-enabled",
  resizeHandleId: "data-panel-resize-handle-id",
  resizeHandleState: "data-resize-handle-state"
};
const PRECISION = 10;
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : () => {
};
const useId = React["useId".toString()];
const wrappedUseId = typeof useId === "function" ? useId : () => null;
let counter = 0;
function useUniqueId(idFromParams = null) {
  const idFromUseId = wrappedUseId();
  const idRef = useRef(idFromParams || idFromUseId || null);
  if (idRef.current === null) {
    idRef.current = "" + counter++;
  }
  return idFromParams !== null && idFromParams !== void 0 ? idFromParams : idRef.current;
}
function PanelWithForwardedRef({
  children,
  className: classNameFromProps = "",
  collapsedSize,
  collapsible,
  defaultSize,
  forwardedRef,
  id: idFromProps,
  maxSize,
  minSize,
  onCollapse,
  onExpand,
  onResize,
  order,
  style: styleFromProps,
  tagName: Type = "div",
  ...rest
}) {
  const context = useContext(PanelGroupContext);
  if (context === null) {
    throw Error(`Panel components must be rendered within a PanelGroup container`);
  }
  const {
    collapsePanel,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    isPanelCollapsed,
    reevaluatePanelConstraints,
    registerPanel,
    resizePanel: resizePanel2,
    unregisterPanel
  } = context;
  const panelId = useUniqueId(idFromProps);
  const panelDataRef = useRef({
    callbacks: {
      onCollapse,
      onExpand,
      onResize
    },
    constraints: {
      collapsedSize,
      collapsible,
      defaultSize,
      maxSize,
      minSize
    },
    id: panelId,
    idIsFromProps: idFromProps !== void 0,
    order
  });
  useRef({
    didLogMissingDefaultSizeWarning: false
  });
  useIsomorphicLayoutEffect(() => {
    const {
      callbacks,
      constraints
    } = panelDataRef.current;
    const prevConstraints = {
      ...constraints
    };
    panelDataRef.current.id = panelId;
    panelDataRef.current.idIsFromProps = idFromProps !== void 0;
    panelDataRef.current.order = order;
    callbacks.onCollapse = onCollapse;
    callbacks.onExpand = onExpand;
    callbacks.onResize = onResize;
    constraints.collapsedSize = collapsedSize;
    constraints.collapsible = collapsible;
    constraints.defaultSize = defaultSize;
    constraints.maxSize = maxSize;
    constraints.minSize = minSize;
    if (prevConstraints.collapsedSize !== constraints.collapsedSize || prevConstraints.collapsible !== constraints.collapsible || prevConstraints.maxSize !== constraints.maxSize || prevConstraints.minSize !== constraints.minSize) {
      reevaluatePanelConstraints(panelDataRef.current, prevConstraints);
    }
  });
  useIsomorphicLayoutEffect(() => {
    const panelData = panelDataRef.current;
    registerPanel(panelData);
    return () => {
      unregisterPanel(panelData);
    };
  }, [order, panelId, registerPanel, unregisterPanel]);
  useImperativeHandle(forwardedRef, () => ({
    collapse: () => {
      collapsePanel(panelDataRef.current);
    },
    expand: (minSize2) => {
      expandPanel(panelDataRef.current, minSize2);
    },
    getId() {
      return panelId;
    },
    getSize() {
      return getPanelSize(panelDataRef.current);
    },
    isCollapsed() {
      return isPanelCollapsed(panelDataRef.current);
    },
    isExpanded() {
      return !isPanelCollapsed(panelDataRef.current);
    },
    resize: (size) => {
      resizePanel2(panelDataRef.current, size);
    }
  }), [collapsePanel, expandPanel, getPanelSize, isPanelCollapsed, panelId, resizePanel2]);
  const style = getPanelStyle(panelDataRef.current, defaultSize);
  return createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: panelId,
    style: {
      ...style,
      ...styleFromProps
    },
    // CSS selectors
    [DATA_ATTRIBUTES.groupId]: groupId,
    [DATA_ATTRIBUTES.panel]: "",
    [DATA_ATTRIBUTES.panelCollapsible]: collapsible || void 0,
    [DATA_ATTRIBUTES.panelId]: panelId,
    [DATA_ATTRIBUTES.panelSize]: parseFloat("" + style.flexGrow).toFixed(1)
  });
}
const Panel = forwardRef((props2, ref) => createElement(PanelWithForwardedRef, {
  ...props2,
  forwardedRef: ref
}));
PanelWithForwardedRef.displayName = "Panel";
Panel.displayName = "forwardRef(Panel)";
let currentCursorStyle = null;
let prevRuleIndex = -1;
let styleElement = null;
function getCursorStyle(state, constraintFlags) {
  if (constraintFlags) {
    const horizontalMin = (constraintFlags & EXCEEDED_HORIZONTAL_MIN) !== 0;
    const horizontalMax = (constraintFlags & EXCEEDED_HORIZONTAL_MAX) !== 0;
    const verticalMin = (constraintFlags & EXCEEDED_VERTICAL_MIN) !== 0;
    const verticalMax = (constraintFlags & EXCEEDED_VERTICAL_MAX) !== 0;
    if (horizontalMin) {
      if (verticalMin) {
        return "se-resize";
      } else if (verticalMax) {
        return "ne-resize";
      } else {
        return "e-resize";
      }
    } else if (horizontalMax) {
      if (verticalMin) {
        return "sw-resize";
      } else if (verticalMax) {
        return "nw-resize";
      } else {
        return "w-resize";
      }
    } else if (verticalMin) {
      return "s-resize";
    } else if (verticalMax) {
      return "n-resize";
    }
  }
  switch (state) {
    case "horizontal":
      return "ew-resize";
    case "intersection":
      return "move";
    case "vertical":
      return "ns-resize";
  }
}
function resetGlobalCursorStyle() {
  if (styleElement !== null) {
    document.head.removeChild(styleElement);
    currentCursorStyle = null;
    styleElement = null;
    prevRuleIndex = -1;
  }
}
function setGlobalCursorStyle(state, constraintFlags) {
  var _styleElement$sheet$i, _styleElement$sheet2;
  const style = getCursorStyle(state, constraintFlags);
  if (currentCursorStyle === style) {
    return;
  }
  currentCursorStyle = style;
  if (styleElement === null) {
    styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
  }
  if (prevRuleIndex >= 0) {
    var _styleElement$sheet;
    (_styleElement$sheet = styleElement.sheet) === null || _styleElement$sheet === void 0 ? void 0 : _styleElement$sheet.removeRule(prevRuleIndex);
  }
  prevRuleIndex = (_styleElement$sheet$i = (_styleElement$sheet2 = styleElement.sheet) === null || _styleElement$sheet2 === void 0 ? void 0 : _styleElement$sheet2.insertRule(`*{cursor: ${style} !important;}`)) !== null && _styleElement$sheet$i !== void 0 ? _styleElement$sheet$i : -1;
}
function isKeyDown(event) {
  return event.type === "keydown";
}
function isPointerEvent(event) {
  return event.type.startsWith("pointer");
}
function isMouseEvent(event) {
  return event.type.startsWith("mouse");
}
function getResizeEventCoordinates(event) {
  if (isPointerEvent(event)) {
    if (event.isPrimary) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
  } else if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  return {
    x: Infinity,
    y: Infinity
  };
}
function getInputType() {
  if (typeof matchMedia === "function") {
    return matchMedia("(pointer:coarse)").matches ? "coarse" : "fine";
  }
}
function intersects(rectOne, rectTwo, strict) {
  {
    return rectOne.x < rectTwo.x + rectTwo.width && rectOne.x + rectOne.width > rectTwo.x && rectOne.y < rectTwo.y + rectTwo.height && rectOne.y + rectOne.height > rectTwo.y;
  }
}
function compare(a, b2) {
  if (a === b2) throw new Error("Cannot compare node with itself");
  const ancestors = {
    a: get_ancestors(a),
    b: get_ancestors(b2)
  };
  let common_ancestor;
  while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
    a = ancestors.a.pop();
    b2 = ancestors.b.pop();
    common_ancestor = a;
  }
  assert(common_ancestor, "Stacking order can only be calculated for elements with a common ancestor");
  const z_indexes = {
    a: get_z_index(find_stacking_context(ancestors.a)),
    b: get_z_index(find_stacking_context(ancestors.b))
  };
  if (z_indexes.a === z_indexes.b) {
    const children = common_ancestor.childNodes;
    const furthest_ancestors = {
      a: ancestors.a.at(-1),
      b: ancestors.b.at(-1)
    };
    let i = children.length;
    while (i--) {
      const child = children[i];
      if (child === furthest_ancestors.a) return 1;
      if (child === furthest_ancestors.b) return -1;
    }
  }
  return Math.sign(z_indexes.a - z_indexes.b);
}
const props = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function is_flex_item(node) {
  var _get_parent;
  const display = getComputedStyle((_get_parent = get_parent(node)) !== null && _get_parent !== void 0 ? _get_parent : node).display;
  return display === "flex" || display === "inline-flex";
}
function creates_stacking_context(node) {
  const style = getComputedStyle(node);
  if (style.position === "fixed") return true;
  if (style.zIndex !== "auto" && (style.position !== "static" || is_flex_item(node))) return true;
  if (+style.opacity < 1) return true;
  if ("transform" in style && style.transform !== "none") return true;
  if ("webkitTransform" in style && style.webkitTransform !== "none") return true;
  if ("mixBlendMode" in style && style.mixBlendMode !== "normal") return true;
  if ("filter" in style && style.filter !== "none") return true;
  if ("webkitFilter" in style && style.webkitFilter !== "none") return true;
  if ("isolation" in style && style.isolation === "isolate") return true;
  if (props.test(style.willChange)) return true;
  if (style.webkitOverflowScrolling === "touch") return true;
  return false;
}
function find_stacking_context(nodes) {
  let i = nodes.length;
  while (i--) {
    const node = nodes[i];
    assert(node, "Missing node");
    if (creates_stacking_context(node)) return node;
  }
  return null;
}
function get_z_index(node) {
  return node && Number(getComputedStyle(node).zIndex) || 0;
}
function get_ancestors(node) {
  const ancestors = [];
  while (node) {
    ancestors.push(node);
    node = get_parent(node);
  }
  return ancestors;
}
function get_parent(node) {
  const {
    parentNode
  } = node;
  if (parentNode && parentNode instanceof ShadowRoot) {
    return parentNode.host;
  }
  return parentNode;
}
const EXCEEDED_HORIZONTAL_MIN = 1;
const EXCEEDED_HORIZONTAL_MAX = 2;
const EXCEEDED_VERTICAL_MIN = 4;
const EXCEEDED_VERTICAL_MAX = 8;
const isCoarsePointer = getInputType() === "coarse";
let intersectingHandles = [];
let isPointerDown = false;
let ownerDocumentCounts = /* @__PURE__ */ new Map();
let panelConstraintFlags = /* @__PURE__ */ new Map();
const registeredResizeHandlers = /* @__PURE__ */ new Set();
function registerResizeHandle(resizeHandleId, element, direction, hitAreaMargins, setResizeHandlerState) {
  var _ownerDocumentCounts$;
  const {
    ownerDocument
  } = element;
  const data = {
    direction,
    element,
    hitAreaMargins,
    setResizeHandlerState
  };
  const count = (_ownerDocumentCounts$ = ownerDocumentCounts.get(ownerDocument)) !== null && _ownerDocumentCounts$ !== void 0 ? _ownerDocumentCounts$ : 0;
  ownerDocumentCounts.set(ownerDocument, count + 1);
  registeredResizeHandlers.add(data);
  updateListeners();
  return function unregisterResizeHandle() {
    var _ownerDocumentCounts$2;
    panelConstraintFlags.delete(resizeHandleId);
    registeredResizeHandlers.delete(data);
    const count2 = (_ownerDocumentCounts$2 = ownerDocumentCounts.get(ownerDocument)) !== null && _ownerDocumentCounts$2 !== void 0 ? _ownerDocumentCounts$2 : 1;
    ownerDocumentCounts.set(ownerDocument, count2 - 1);
    updateListeners();
    if (count2 === 1) {
      ownerDocumentCounts.delete(ownerDocument);
    }
    if (intersectingHandles.includes(data)) {
      const index = intersectingHandles.indexOf(data);
      if (index >= 0) {
        intersectingHandles.splice(index, 1);
      }
      updateCursor();
      setResizeHandlerState("up", true, null);
    }
  };
}
function handlePointerDown(event) {
  const {
    target
  } = event;
  const {
    x: x2,
    y
  } = getResizeEventCoordinates(event);
  isPointerDown = true;
  recalculateIntersectingHandles({
    target,
    x: x2,
    y
  });
  updateListeners();
  if (intersectingHandles.length > 0) {
    updateResizeHandlerStates("down", event);
    event.preventDefault();
    if (!isWithinResizeHandle(target)) {
      event.stopImmediatePropagation();
    }
  }
}
function handlePointerMove(event) {
  const {
    x: x2,
    y
  } = getResizeEventCoordinates(event);
  if (isPointerDown && event.buttons === 0) {
    isPointerDown = false;
    updateResizeHandlerStates("up", event);
  }
  if (!isPointerDown) {
    const {
      target
    } = event;
    recalculateIntersectingHandles({
      target,
      x: x2,
      y
    });
  }
  updateResizeHandlerStates("move", event);
  updateCursor();
  if (intersectingHandles.length > 0) {
    event.preventDefault();
  }
}
function handlePointerUp(event) {
  const {
    target
  } = event;
  const {
    x: x2,
    y
  } = getResizeEventCoordinates(event);
  panelConstraintFlags.clear();
  isPointerDown = false;
  if (intersectingHandles.length > 0) {
    event.preventDefault();
    if (!isWithinResizeHandle(target)) {
      event.stopImmediatePropagation();
    }
  }
  updateResizeHandlerStates("up", event);
  recalculateIntersectingHandles({
    target,
    x: x2,
    y
  });
  updateCursor();
  updateListeners();
}
function isWithinResizeHandle(element) {
  let currentElement = element;
  while (currentElement) {
    if (currentElement.hasAttribute(DATA_ATTRIBUTES.resizeHandle)) {
      return true;
    }
    currentElement = currentElement.parentElement;
  }
  return false;
}
function recalculateIntersectingHandles({
  target,
  x: x2,
  y
}) {
  intersectingHandles.splice(0);
  let targetElement = null;
  if (target instanceof HTMLElement || target instanceof SVGElement) {
    targetElement = target;
  }
  registeredResizeHandlers.forEach((data) => {
    const {
      element: dragHandleElement,
      hitAreaMargins
    } = data;
    const dragHandleRect = dragHandleElement.getBoundingClientRect();
    const {
      bottom,
      left,
      right,
      top
    } = dragHandleRect;
    const margin = isCoarsePointer ? hitAreaMargins.coarse : hitAreaMargins.fine;
    const eventIntersects = x2 >= left - margin && x2 <= right + margin && y >= top - margin && y <= bottom + margin;
    if (eventIntersects) {
      if (targetElement !== null && document.contains(targetElement) && dragHandleElement !== targetElement && !dragHandleElement.contains(targetElement) && !targetElement.contains(dragHandleElement) && // Calculating stacking order has a cost, so we should avoid it if possible
      // That is why we only check potentially intersecting handles,
      // and why we skip if the event target is within the handle's DOM
      compare(targetElement, dragHandleElement) > 0) {
        let currentElement = targetElement;
        let didIntersect = false;
        while (currentElement) {
          if (currentElement.contains(dragHandleElement)) {
            break;
          } else if (intersects(currentElement.getBoundingClientRect(), dragHandleRect)) {
            didIntersect = true;
            break;
          }
          currentElement = currentElement.parentElement;
        }
        if (didIntersect) {
          return;
        }
      }
      intersectingHandles.push(data);
    }
  });
}
function reportConstraintsViolation(resizeHandleId, flag) {
  panelConstraintFlags.set(resizeHandleId, flag);
}
function updateCursor() {
  let intersectsHorizontal = false;
  let intersectsVertical = false;
  intersectingHandles.forEach((data) => {
    const {
      direction
    } = data;
    if (direction === "horizontal") {
      intersectsHorizontal = true;
    } else {
      intersectsVertical = true;
    }
  });
  let constraintFlags = 0;
  panelConstraintFlags.forEach((flag) => {
    constraintFlags |= flag;
  });
  if (intersectsHorizontal && intersectsVertical) {
    setGlobalCursorStyle("intersection", constraintFlags);
  } else if (intersectsHorizontal) {
    setGlobalCursorStyle("horizontal", constraintFlags);
  } else if (intersectsVertical) {
    setGlobalCursorStyle("vertical", constraintFlags);
  } else {
    resetGlobalCursorStyle();
  }
}
let listenersAbortController = new AbortController();
function updateListeners() {
  listenersAbortController.abort();
  listenersAbortController = new AbortController();
  const options = {
    capture: true,
    signal: listenersAbortController.signal
  };
  if (!registeredResizeHandlers.size) {
    return;
  }
  if (isPointerDown) {
    if (intersectingHandles.length > 0) {
      ownerDocumentCounts.forEach((count, ownerDocument) => {
        const {
          body
        } = ownerDocument;
        if (count > 0) {
          body.addEventListener("contextmenu", handlePointerUp, options);
          body.addEventListener("pointerleave", handlePointerMove, options);
          body.addEventListener("pointermove", handlePointerMove, options);
        }
      });
    }
    window.addEventListener("pointerup", handlePointerUp, options);
    window.addEventListener("pointercancel", handlePointerUp, options);
  } else {
    ownerDocumentCounts.forEach((count, ownerDocument) => {
      const {
        body
      } = ownerDocument;
      if (count > 0) {
        body.addEventListener("pointerdown", handlePointerDown, options);
        body.addEventListener("pointermove", handlePointerMove, options);
      }
    });
  }
}
function updateResizeHandlerStates(action, event) {
  registeredResizeHandlers.forEach((data) => {
    const {
      setResizeHandlerState
    } = data;
    const isActive = intersectingHandles.includes(data);
    setResizeHandlerState(action, isActive, event);
  });
}
function useForceUpdate() {
  const [_2, setCount] = useState(0);
  return useCallback(() => setCount((prevCount) => prevCount + 1), []);
}
function assert(expectedCondition, message) {
  if (!expectedCondition) {
    console.error(message);
    throw Error(message);
  }
}
function fuzzyCompareNumbers(actual, expected, fractionDigits = PRECISION) {
  if (actual.toFixed(fractionDigits) === expected.toFixed(fractionDigits)) {
    return 0;
  } else {
    return actual > expected ? 1 : -1;
  }
}
function fuzzyNumbersEqual$1(actual, expected, fractionDigits = PRECISION) {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0;
}
function fuzzyNumbersEqual(actual, expected, fractionDigits) {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0;
}
function fuzzyLayoutsEqual(actual, expected, fractionDigits) {
  if (actual.length !== expected.length) {
    return false;
  }
  for (let index = 0; index < actual.length; index++) {
    const actualSize = actual[index];
    const expectedSize = expected[index];
    if (!fuzzyNumbersEqual(actualSize, expectedSize, fractionDigits)) {
      return false;
    }
  }
  return true;
}
function resizePanel({
  panelConstraints: panelConstraintsArray,
  panelIndex,
  size
}) {
  const panelConstraints = panelConstraintsArray[panelIndex];
  assert(panelConstraints != null, `Panel constraints not found for index ${panelIndex}`);
  let {
    collapsedSize = 0,
    collapsible,
    maxSize = 100,
    minSize = 0
  } = panelConstraints;
  if (fuzzyCompareNumbers(size, minSize) < 0) {
    if (collapsible) {
      const halfwayPoint = (collapsedSize + minSize) / 2;
      if (fuzzyCompareNumbers(size, halfwayPoint) < 0) {
        size = collapsedSize;
      } else {
        size = minSize;
      }
    } else {
      size = minSize;
    }
  }
  size = Math.min(maxSize, size);
  size = parseFloat(size.toFixed(PRECISION));
  return size;
}
function adjustLayoutByDelta({
  delta,
  initialLayout,
  panelConstraints: panelConstraintsArray,
  pivotIndices,
  prevLayout,
  trigger
}) {
  if (fuzzyNumbersEqual(delta, 0)) {
    return initialLayout;
  }
  const nextLayout = [...initialLayout];
  const [firstPivotIndex, secondPivotIndex] = pivotIndices;
  assert(firstPivotIndex != null, "Invalid first pivot index");
  assert(secondPivotIndex != null, "Invalid second pivot index");
  let deltaApplied = 0;
  {
    if (trigger === "keyboard") {
      {
        const index = delta < 0 ? secondPivotIndex : firstPivotIndex;
        const panelConstraints = panelConstraintsArray[index];
        assert(panelConstraints, `Panel constraints not found for index ${index}`);
        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0
        } = panelConstraints;
        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(prevSize != null, `Previous layout not found for panel index ${index}`);
          if (fuzzyNumbersEqual(prevSize, collapsedSize)) {
            const localDelta = minSize - prevSize;
            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
            }
          }
        }
      }
      {
        const index = delta < 0 ? firstPivotIndex : secondPivotIndex;
        const panelConstraints = panelConstraintsArray[index];
        assert(panelConstraints, `No panel constraints found for index ${index}`);
        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0
        } = panelConstraints;
        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(prevSize != null, `Previous layout not found for panel index ${index}`);
          if (fuzzyNumbersEqual(prevSize, minSize)) {
            const localDelta = prevSize - collapsedSize;
            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
            }
          }
        }
      }
    }
  }
  {
    const increment = delta < 0 ? 1 : -1;
    let index = delta < 0 ? secondPivotIndex : firstPivotIndex;
    let maxAvailableDelta = 0;
    while (true) {
      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);
      const maxSafeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: 100
      });
      const delta2 = maxSafeSize - prevSize;
      maxAvailableDelta += delta2;
      index += increment;
      if (index < 0 || index >= panelConstraintsArray.length) {
        break;
      }
    }
    const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
    delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta;
  }
  {
    const pivotIndex = delta < 0 ? firstPivotIndex : secondPivotIndex;
    let index = pivotIndex;
    while (index >= 0 && index < panelConstraintsArray.length) {
      const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);
      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);
      const unsafeSize = prevSize - deltaRemaining;
      const safeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: unsafeSize
      });
      if (!fuzzyNumbersEqual(prevSize, safeSize)) {
        deltaApplied += prevSize - safeSize;
        nextLayout[index] = safeSize;
        if (deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), void 0, {
          numeric: true
        }) >= 0) {
          break;
        }
      }
      if (delta < 0) {
        index--;
      } else {
        index++;
      }
    }
  }
  if (fuzzyLayoutsEqual(prevLayout, nextLayout)) {
    return prevLayout;
  }
  {
    const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
    const prevSize = initialLayout[pivotIndex];
    assert(prevSize != null, `Previous layout not found for panel index ${pivotIndex}`);
    const unsafeSize = prevSize + deltaApplied;
    const safeSize = resizePanel({
      panelConstraints: panelConstraintsArray,
      panelIndex: pivotIndex,
      size: unsafeSize
    });
    nextLayout[pivotIndex] = safeSize;
    if (!fuzzyNumbersEqual(safeSize, unsafeSize)) {
      let deltaRemaining = unsafeSize - safeSize;
      const pivotIndex2 = delta < 0 ? secondPivotIndex : firstPivotIndex;
      let index = pivotIndex2;
      while (index >= 0 && index < panelConstraintsArray.length) {
        const prevSize2 = nextLayout[index];
        assert(prevSize2 != null, `Previous layout not found for panel index ${index}`);
        const unsafeSize2 = prevSize2 + deltaRemaining;
        const safeSize2 = resizePanel({
          panelConstraints: panelConstraintsArray,
          panelIndex: index,
          size: unsafeSize2
        });
        if (!fuzzyNumbersEqual(prevSize2, safeSize2)) {
          deltaRemaining -= safeSize2 - prevSize2;
          nextLayout[index] = safeSize2;
        }
        if (fuzzyNumbersEqual(deltaRemaining, 0)) {
          break;
        }
        if (delta > 0) {
          index--;
        } else {
          index++;
        }
      }
    }
  }
  const totalSize = nextLayout.reduce((total, size) => size + total, 0);
  if (!fuzzyNumbersEqual(totalSize, 100)) {
    return prevLayout;
  }
  return nextLayout;
}
function calculateAriaValues({
  layout,
  panelsArray,
  pivotIndices
}) {
  let currentMinSize = 0;
  let currentMaxSize = 100;
  let totalMinSize = 0;
  let totalMaxSize = 0;
  const firstIndex = pivotIndices[0];
  assert(firstIndex != null, "No pivot index found");
  panelsArray.forEach((panelData, index) => {
    const {
      constraints
    } = panelData;
    const {
      maxSize = 100,
      minSize = 0
    } = constraints;
    if (index === firstIndex) {
      currentMinSize = minSize;
      currentMaxSize = maxSize;
    } else {
      totalMinSize += minSize;
      totalMaxSize += maxSize;
    }
  });
  const valueMax = Math.min(currentMaxSize, 100 - totalMinSize);
  const valueMin = Math.max(currentMinSize, 100 - totalMaxSize);
  const valueNow = layout[firstIndex];
  return {
    valueMax,
    valueMin,
    valueNow
  };
}
function getResizeHandleElementsForGroup(groupId, scope = document) {
  return Array.from(scope.querySelectorAll(`[${DATA_ATTRIBUTES.resizeHandleId}][data-panel-group-id="${groupId}"]`));
}
function getResizeHandleElementIndex(groupId, id, scope = document) {
  const handles = getResizeHandleElementsForGroup(groupId, scope);
  const index = handles.findIndex((handle) => handle.getAttribute(DATA_ATTRIBUTES.resizeHandleId) === id);
  return index !== null && index !== void 0 ? index : null;
}
function determinePivotIndices(groupId, dragHandleId, panelGroupElement) {
  const index = getResizeHandleElementIndex(groupId, dragHandleId, panelGroupElement);
  return index != null ? [index, index + 1] : [-1, -1];
}
function getPanelGroupElement(id, rootElement = document) {
  var _dataset;
  if (rootElement instanceof HTMLElement && (rootElement === null || rootElement === void 0 ? void 0 : (_dataset = rootElement.dataset) === null || _dataset === void 0 ? void 0 : _dataset.panelGroupId) == id) {
    return rootElement;
  }
  const element = rootElement.querySelector(`[data-panel-group][data-panel-group-id="${id}"]`);
  if (element) {
    return element;
  }
  return null;
}
function getResizeHandleElement(id, scope = document) {
  const element = scope.querySelector(`[${DATA_ATTRIBUTES.resizeHandleId}="${id}"]`);
  if (element) {
    return element;
  }
  return null;
}
function getResizeHandlePanelIds(groupId, handleId, panelsArray, scope = document) {
  var _panelsArray$index$id, _panelsArray$index, _panelsArray$id, _panelsArray;
  const handle = getResizeHandleElement(handleId, scope);
  const handles = getResizeHandleElementsForGroup(groupId, scope);
  const index = handle ? handles.indexOf(handle) : -1;
  const idBefore = (_panelsArray$index$id = (_panelsArray$index = panelsArray[index]) === null || _panelsArray$index === void 0 ? void 0 : _panelsArray$index.id) !== null && _panelsArray$index$id !== void 0 ? _panelsArray$index$id : null;
  const idAfter = (_panelsArray$id = (_panelsArray = panelsArray[index + 1]) === null || _panelsArray === void 0 ? void 0 : _panelsArray.id) !== null && _panelsArray$id !== void 0 ? _panelsArray$id : null;
  return [idBefore, idAfter];
}
function useWindowSplitterPanelGroupBehavior({
  committedValuesRef,
  eagerValuesRef,
  groupId,
  layout,
  panelDataArray,
  panelGroupElement,
  setLayout
}) {
  useRef({
    didWarnAboutMissingResizeHandle: false
  });
  useIsomorphicLayoutEffect(() => {
    if (!panelGroupElement) {
      return;
    }
    const resizeHandleElements = getResizeHandleElementsForGroup(groupId, panelGroupElement);
    for (let index = 0; index < panelDataArray.length - 1; index++) {
      const {
        valueMax,
        valueMin,
        valueNow
      } = calculateAriaValues({
        layout,
        panelsArray: panelDataArray,
        pivotIndices: [index, index + 1]
      });
      const resizeHandleElement = resizeHandleElements[index];
      if (resizeHandleElement == null) ;
      else {
        const panelData = panelDataArray[index];
        assert(panelData, `No panel data found for index "${index}"`);
        resizeHandleElement.setAttribute("aria-controls", panelData.id);
        resizeHandleElement.setAttribute("aria-valuemax", "" + Math.round(valueMax));
        resizeHandleElement.setAttribute("aria-valuemin", "" + Math.round(valueMin));
        resizeHandleElement.setAttribute("aria-valuenow", valueNow != null ? "" + Math.round(valueNow) : "");
      }
    }
    return () => {
      resizeHandleElements.forEach((resizeHandleElement, index) => {
        resizeHandleElement.removeAttribute("aria-controls");
        resizeHandleElement.removeAttribute("aria-valuemax");
        resizeHandleElement.removeAttribute("aria-valuemin");
        resizeHandleElement.removeAttribute("aria-valuenow");
      });
    };
  }, [groupId, layout, panelDataArray, panelGroupElement]);
  useEffect(() => {
    if (!panelGroupElement) {
      return;
    }
    const eagerValues = eagerValuesRef.current;
    assert(eagerValues, `Eager values not found`);
    const {
      panelDataArray: panelDataArray2
    } = eagerValues;
    const groupElement = getPanelGroupElement(groupId, panelGroupElement);
    assert(groupElement != null, `No group found for id "${groupId}"`);
    const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement);
    assert(handles, `No resize handles found for group id "${groupId}"`);
    const cleanupFunctions = handles.map((handle) => {
      const handleId = handle.getAttribute(DATA_ATTRIBUTES.resizeHandleId);
      assert(handleId, `Resize handle element has no handle id attribute`);
      const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelDataArray2, panelGroupElement);
      if (idBefore == null || idAfter == null) {
        return () => {
        };
      }
      const onKeyDown = (event) => {
        if (event.defaultPrevented) {
          return;
        }
        switch (event.key) {
          case "Enter": {
            event.preventDefault();
            const index = panelDataArray2.findIndex((panelData) => panelData.id === idBefore);
            if (index >= 0) {
              const panelData = panelDataArray2[index];
              assert(panelData, `No panel data found for index ${index}`);
              const size = layout[index];
              const {
                collapsedSize = 0,
                collapsible,
                minSize = 0
              } = panelData.constraints;
              if (size != null && collapsible) {
                const nextLayout = adjustLayoutByDelta({
                  delta: fuzzyNumbersEqual(size, collapsedSize) ? minSize - collapsedSize : collapsedSize - size,
                  initialLayout: layout,
                  panelConstraints: panelDataArray2.map((panelData2) => panelData2.constraints),
                  pivotIndices: determinePivotIndices(groupId, handleId, panelGroupElement),
                  prevLayout: layout,
                  trigger: "keyboard"
                });
                if (layout !== nextLayout) {
                  setLayout(nextLayout);
                }
              }
            }
            break;
          }
        }
      };
      handle.addEventListener("keydown", onKeyDown);
      return () => {
        handle.removeEventListener("keydown", onKeyDown);
      };
    });
    return () => {
      cleanupFunctions.forEach((cleanupFunction) => cleanupFunction());
    };
  }, [panelGroupElement, committedValuesRef, eagerValuesRef, groupId, layout, panelDataArray, setLayout]);
}
function areEqual(arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (let index = 0; index < arrayA.length; index++) {
    if (arrayA[index] !== arrayB[index]) {
      return false;
    }
  }
  return true;
}
function getResizeEventCursorPosition(direction, event) {
  const isHorizontal = direction === "horizontal";
  const {
    x: x2,
    y
  } = getResizeEventCoordinates(event);
  return isHorizontal ? x2 : y;
}
function calculateDragOffsetPercentage(event, dragHandleId, direction, initialDragState, panelGroupElement) {
  const isHorizontal = direction === "horizontal";
  const handleElement = getResizeHandleElement(dragHandleId, panelGroupElement);
  assert(handleElement, `No resize handle element found for id "${dragHandleId}"`);
  const groupId = handleElement.getAttribute(DATA_ATTRIBUTES.groupId);
  assert(groupId, `Resize handle element has no group id attribute`);
  let {
    initialCursorPosition
  } = initialDragState;
  const cursorPosition = getResizeEventCursorPosition(direction, event);
  const groupElement = getPanelGroupElement(groupId, panelGroupElement);
  assert(groupElement, `No group element found for id "${groupId}"`);
  const groupRect = groupElement.getBoundingClientRect();
  const groupSizeInPixels = isHorizontal ? groupRect.width : groupRect.height;
  const offsetPixels = cursorPosition - initialCursorPosition;
  const offsetPercentage = offsetPixels / groupSizeInPixels * 100;
  return offsetPercentage;
}
function calculateDeltaPercentage(event, dragHandleId, direction, initialDragState, keyboardResizeBy, panelGroupElement) {
  if (isKeyDown(event)) {
    const isHorizontal = direction === "horizontal";
    let delta = 0;
    if (event.shiftKey) {
      delta = 100;
    } else if (keyboardResizeBy != null) {
      delta = keyboardResizeBy;
    } else {
      delta = 10;
    }
    let movement = 0;
    switch (event.key) {
      case "ArrowDown":
        movement = isHorizontal ? 0 : delta;
        break;
      case "ArrowLeft":
        movement = isHorizontal ? -delta : 0;
        break;
      case "ArrowRight":
        movement = isHorizontal ? delta : 0;
        break;
      case "ArrowUp":
        movement = isHorizontal ? 0 : -delta;
        break;
      case "End":
        movement = 100;
        break;
      case "Home":
        movement = -100;
        break;
    }
    return movement;
  } else {
    if (initialDragState == null) {
      return 0;
    }
    return calculateDragOffsetPercentage(event, dragHandleId, direction, initialDragState, panelGroupElement);
  }
}
function calculateUnsafeDefaultLayout({
  panelDataArray
}) {
  const layout = Array(panelDataArray.length);
  const panelConstraintsArray = panelDataArray.map((panelData) => panelData.constraints);
  let numPanelsWithSizes = 0;
  let remainingSize = 100;
  for (let index = 0; index < panelDataArray.length; index++) {
    const panelConstraints = panelConstraintsArray[index];
    assert(panelConstraints, `Panel constraints not found for index ${index}`);
    const {
      defaultSize
    } = panelConstraints;
    if (defaultSize != null) {
      numPanelsWithSizes++;
      layout[index] = defaultSize;
      remainingSize -= defaultSize;
    }
  }
  for (let index = 0; index < panelDataArray.length; index++) {
    const panelConstraints = panelConstraintsArray[index];
    assert(panelConstraints, `Panel constraints not found for index ${index}`);
    const {
      defaultSize
    } = panelConstraints;
    if (defaultSize != null) {
      continue;
    }
    const numRemainingPanels = panelDataArray.length - numPanelsWithSizes;
    const size = remainingSize / numRemainingPanels;
    numPanelsWithSizes++;
    layout[index] = size;
    remainingSize -= size;
  }
  return layout;
}
function callPanelCallbacks(panelsArray, layout, panelIdToLastNotifiedSizeMap) {
  layout.forEach((size, index) => {
    const panelData = panelsArray[index];
    assert(panelData, `Panel data not found for index ${index}`);
    const {
      callbacks,
      constraints,
      id: panelId
    } = panelData;
    const {
      collapsedSize = 0,
      collapsible
    } = constraints;
    const lastNotifiedSize = panelIdToLastNotifiedSizeMap[panelId];
    if (lastNotifiedSize == null || size !== lastNotifiedSize) {
      panelIdToLastNotifiedSizeMap[panelId] = size;
      const {
        onCollapse,
        onExpand,
        onResize
      } = callbacks;
      if (onResize) {
        onResize(size, lastNotifiedSize);
      }
      if (collapsible && (onCollapse || onExpand)) {
        if (onExpand && (lastNotifiedSize == null || fuzzyNumbersEqual$1(lastNotifiedSize, collapsedSize)) && !fuzzyNumbersEqual$1(size, collapsedSize)) {
          onExpand();
        }
        if (onCollapse && (lastNotifiedSize == null || !fuzzyNumbersEqual$1(lastNotifiedSize, collapsedSize)) && fuzzyNumbersEqual$1(size, collapsedSize)) {
          onCollapse();
        }
      }
    }
  });
}
function compareLayouts(a, b2) {
  if (a.length !== b2.length) {
    return false;
  } else {
    for (let index = 0; index < a.length; index++) {
      if (a[index] != b2[index]) {
        return false;
      }
    }
  }
  return true;
}
function computePanelFlexBoxStyle({
  defaultSize,
  dragState,
  layout,
  panelData,
  panelIndex,
  precision = 3
}) {
  const size = layout[panelIndex];
  let flexGrow;
  if (size == null) {
    flexGrow = defaultSize != void 0 ? defaultSize.toPrecision(precision) : "1";
  } else if (panelData.length === 1) {
    flexGrow = "1";
  } else {
    flexGrow = size.toPrecision(precision);
  }
  return {
    flexBasis: 0,
    flexGrow,
    flexShrink: 1,
    // Without this, Panel sizes may be unintentionally overridden by their content
    overflow: "hidden",
    // Disable pointer events inside of a panel during resize
    // This avoid edge cases like nested iframes
    pointerEvents: dragState !== null ? "none" : void 0
  };
}
function debounce(callback, durationMs = 10) {
  let timeoutId = null;
  let callable = (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, durationMs);
  };
  return callable;
}
function initializeDefaultStorage(storageObject) {
  try {
    if (typeof localStorage !== "undefined") {
      storageObject.getItem = (name) => {
        return localStorage.getItem(name);
      };
      storageObject.setItem = (name, value) => {
        localStorage.setItem(name, value);
      };
    } else {
      throw new Error("localStorage not supported in this environment");
    }
  } catch (error) {
    console.error(error);
    storageObject.getItem = () => null;
    storageObject.setItem = () => {
    };
  }
}
function getPanelGroupKey(autoSaveId) {
  return `react-resizable-panels:${autoSaveId}`;
}
function getPanelKey(panels) {
  return panels.map((panel) => {
    const {
      constraints,
      id,
      idIsFromProps,
      order
    } = panel;
    if (idIsFromProps) {
      return id;
    } else {
      return order ? `${order}:${JSON.stringify(constraints)}` : JSON.stringify(constraints);
    }
  }).sort((a, b2) => a.localeCompare(b2)).join(",");
}
function loadSerializedPanelGroupState(autoSaveId, storage) {
  try {
    const panelGroupKey = getPanelGroupKey(autoSaveId);
    const serialized = storage.getItem(panelGroupKey);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (typeof parsed === "object" && parsed != null) {
        return parsed;
      }
    }
  } catch (error) {
  }
  return null;
}
function loadPanelGroupState(autoSaveId, panels, storage) {
  var _loadSerializedPanelG, _state$panelKey;
  const state = (_loadSerializedPanelG = loadSerializedPanelGroupState(autoSaveId, storage)) !== null && _loadSerializedPanelG !== void 0 ? _loadSerializedPanelG : {};
  const panelKey = getPanelKey(panels);
  return (_state$panelKey = state[panelKey]) !== null && _state$panelKey !== void 0 ? _state$panelKey : null;
}
function savePanelGroupState(autoSaveId, panels, panelSizesBeforeCollapse, sizes, storage) {
  var _loadSerializedPanelG2;
  const panelGroupKey = getPanelGroupKey(autoSaveId);
  const panelKey = getPanelKey(panels);
  const state = (_loadSerializedPanelG2 = loadSerializedPanelGroupState(autoSaveId, storage)) !== null && _loadSerializedPanelG2 !== void 0 ? _loadSerializedPanelG2 : {};
  state[panelKey] = {
    expandToSizes: Object.fromEntries(panelSizesBeforeCollapse.entries()),
    layout: sizes
  };
  try {
    storage.setItem(panelGroupKey, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}
function validatePanelGroupLayout({
  layout: prevLayout,
  panelConstraints
}) {
  const nextLayout = [...prevLayout];
  const nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0);
  if (nextLayout.length !== panelConstraints.length) {
    throw Error(`Invalid ${panelConstraints.length} panel layout: ${nextLayout.map((size) => `${size}%`).join(", ")}`);
  } else if (!fuzzyNumbersEqual(nextLayoutTotalSize, 100) && nextLayout.length > 0) {
    for (let index = 0; index < panelConstraints.length; index++) {
      const unsafeSize = nextLayout[index];
      assert(unsafeSize != null, `No layout data found for index ${index}`);
      const safeSize = 100 / nextLayoutTotalSize * unsafeSize;
      nextLayout[index] = safeSize;
    }
  }
  let remainingSize = 0;
  for (let index = 0; index < panelConstraints.length; index++) {
    const unsafeSize = nextLayout[index];
    assert(unsafeSize != null, `No layout data found for index ${index}`);
    const safeSize = resizePanel({
      panelConstraints,
      panelIndex: index,
      size: unsafeSize
    });
    if (unsafeSize != safeSize) {
      remainingSize += unsafeSize - safeSize;
      nextLayout[index] = safeSize;
    }
  }
  if (!fuzzyNumbersEqual(remainingSize, 0)) {
    for (let index = 0; index < panelConstraints.length; index++) {
      const prevSize = nextLayout[index];
      assert(prevSize != null, `No layout data found for index ${index}`);
      const unsafeSize = prevSize + remainingSize;
      const safeSize = resizePanel({
        panelConstraints,
        panelIndex: index,
        size: unsafeSize
      });
      if (prevSize !== safeSize) {
        remainingSize -= safeSize - prevSize;
        nextLayout[index] = safeSize;
        if (fuzzyNumbersEqual(remainingSize, 0)) {
          break;
        }
      }
    }
  }
  return nextLayout;
}
const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100;
const defaultStorage = {
  getItem: (name) => {
    initializeDefaultStorage(defaultStorage);
    return defaultStorage.getItem(name);
  },
  setItem: (name, value) => {
    initializeDefaultStorage(defaultStorage);
    defaultStorage.setItem(name, value);
  }
};
const debounceMap = {};
function PanelGroupWithForwardedRef({
  autoSaveId = null,
  children,
  className: classNameFromProps = "",
  direction,
  forwardedRef,
  id: idFromProps = null,
  onLayout = null,
  keyboardResizeBy = null,
  storage = defaultStorage,
  style: styleFromProps,
  tagName: Type = "div",
  ...rest
}) {
  const groupId = useUniqueId(idFromProps);
  const panelGroupElementRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [layout, setLayout] = useState([]);
  const forceUpdate = useForceUpdate();
  const panelIdToLastNotifiedSizeMapRef = useRef({});
  const panelSizeBeforeCollapseRef = useRef(/* @__PURE__ */ new Map());
  const prevDeltaRef = useRef(0);
  const committedValuesRef = useRef({
    autoSaveId,
    direction,
    dragState,
    id: groupId,
    keyboardResizeBy,
    onLayout,
    storage
  });
  const eagerValuesRef = useRef({
    layout,
    panelDataArray: [],
    panelDataArrayChanged: false
  });
  useRef({
    didLogIdAndOrderWarning: false,
    didLogPanelConstraintsWarning: false,
    prevPanelIds: []
  });
  useImperativeHandle(forwardedRef, () => ({
    getId: () => committedValuesRef.current.id,
    getLayout: () => {
      const {
        layout: layout2
      } = eagerValuesRef.current;
      return layout2;
    },
    setLayout: (unsafeLayout) => {
      const {
        onLayout: onLayout2
      } = committedValuesRef.current;
      const {
        layout: prevLayout,
        panelDataArray
      } = eagerValuesRef.current;
      const safeLayout = validatePanelGroupLayout({
        layout: unsafeLayout,
        panelConstraints: panelDataArray.map((panelData) => panelData.constraints)
      });
      if (!areEqual(prevLayout, safeLayout)) {
        setLayout(safeLayout);
        eagerValuesRef.current.layout = safeLayout;
        if (onLayout2) {
          onLayout2(safeLayout);
        }
        callPanelCallbacks(panelDataArray, safeLayout, panelIdToLastNotifiedSizeMapRef.current);
      }
    }
  }), []);
  useIsomorphicLayoutEffect(() => {
    committedValuesRef.current.autoSaveId = autoSaveId;
    committedValuesRef.current.direction = direction;
    committedValuesRef.current.dragState = dragState;
    committedValuesRef.current.id = groupId;
    committedValuesRef.current.onLayout = onLayout;
    committedValuesRef.current.storage = storage;
  });
  useWindowSplitterPanelGroupBehavior({
    committedValuesRef,
    eagerValuesRef,
    groupId,
    layout,
    panelDataArray: eagerValuesRef.current.panelDataArray,
    setLayout,
    panelGroupElement: panelGroupElementRef.current
  });
  useEffect(() => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    if (autoSaveId) {
      if (layout.length === 0 || layout.length !== panelDataArray.length) {
        return;
      }
      let debouncedSave = debounceMap[autoSaveId];
      if (debouncedSave == null) {
        debouncedSave = debounce(savePanelGroupState, LOCAL_STORAGE_DEBOUNCE_INTERVAL);
        debounceMap[autoSaveId] = debouncedSave;
      }
      const clonedPanelDataArray = [...panelDataArray];
      const clonedPanelSizesBeforeCollapse = new Map(panelSizeBeforeCollapseRef.current);
      debouncedSave(autoSaveId, clonedPanelDataArray, clonedPanelSizesBeforeCollapse, layout, storage);
    }
  }, [autoSaveId, layout, storage]);
  useEffect(() => {
  });
  const collapsePanel = useCallback((panelData) => {
    const {
      onLayout: onLayout2
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    if (panelData.constraints.collapsible) {
      const panelConstraintsArray = panelDataArray.map((panelData2) => panelData2.constraints);
      const {
        collapsedSize = 0,
        panelSize,
        pivotIndices
      } = panelDataHelper(panelDataArray, panelData, prevLayout);
      assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
      if (!fuzzyNumbersEqual$1(panelSize, collapsedSize)) {
        panelSizeBeforeCollapseRef.current.set(panelData.id, panelSize);
        const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
        const delta = isLastPanel ? panelSize - collapsedSize : collapsedSize - panelSize;
        const nextLayout = adjustLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints: panelConstraintsArray,
          pivotIndices,
          prevLayout,
          trigger: "imperative-api"
        });
        if (!compareLayouts(prevLayout, nextLayout)) {
          setLayout(nextLayout);
          eagerValuesRef.current.layout = nextLayout;
          if (onLayout2) {
            onLayout2(nextLayout);
          }
          callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
        }
      }
    }
  }, []);
  const expandPanel = useCallback((panelData, minSizeOverride) => {
    const {
      onLayout: onLayout2
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    if (panelData.constraints.collapsible) {
      const panelConstraintsArray = panelDataArray.map((panelData2) => panelData2.constraints);
      const {
        collapsedSize = 0,
        panelSize = 0,
        minSize: minSizeFromProps = 0,
        pivotIndices
      } = panelDataHelper(panelDataArray, panelData, prevLayout);
      const minSize = minSizeOverride !== null && minSizeOverride !== void 0 ? minSizeOverride : minSizeFromProps;
      if (fuzzyNumbersEqual$1(panelSize, collapsedSize)) {
        const prevPanelSize = panelSizeBeforeCollapseRef.current.get(panelData.id);
        const baseSize = prevPanelSize != null && prevPanelSize >= minSize ? prevPanelSize : minSize;
        const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
        const delta = isLastPanel ? panelSize - baseSize : baseSize - panelSize;
        const nextLayout = adjustLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints: panelConstraintsArray,
          pivotIndices,
          prevLayout,
          trigger: "imperative-api"
        });
        if (!compareLayouts(prevLayout, nextLayout)) {
          setLayout(nextLayout);
          eagerValuesRef.current.layout = nextLayout;
          if (onLayout2) {
            onLayout2(nextLayout);
          }
          callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
        }
      }
    }
  }, []);
  const getPanelSize = useCallback((panelData) => {
    const {
      layout: layout2,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout2);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return panelSize;
  }, []);
  const getPanelStyle = useCallback((panelData, defaultSize) => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    const panelIndex = findPanelDataIndex(panelDataArray, panelData);
    return computePanelFlexBoxStyle({
      defaultSize,
      dragState,
      layout,
      panelData: panelDataArray,
      panelIndex
    });
  }, [dragState, layout]);
  const isPanelCollapsed = useCallback((panelData) => {
    const {
      layout: layout2,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize = 0,
      collapsible,
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout2);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return collapsible === true && fuzzyNumbersEqual$1(panelSize, collapsedSize);
  }, []);
  const isPanelExpanded = useCallback((panelData) => {
    const {
      layout: layout2,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize = 0,
      collapsible,
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout2);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return !collapsible || fuzzyCompareNumbers(panelSize, collapsedSize) > 0;
  }, []);
  const registerPanel = useCallback((panelData) => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    panelDataArray.push(panelData);
    panelDataArray.sort((panelA, panelB) => {
      const orderA = panelA.order;
      const orderB = panelB.order;
      if (orderA == null && orderB == null) {
        return 0;
      } else if (orderA == null) {
        return -1;
      } else if (orderB == null) {
        return 1;
      } else {
        return orderA - orderB;
      }
    });
    eagerValuesRef.current.panelDataArrayChanged = true;
    forceUpdate();
  }, [forceUpdate]);
  useIsomorphicLayoutEffect(() => {
    if (eagerValuesRef.current.panelDataArrayChanged) {
      eagerValuesRef.current.panelDataArrayChanged = false;
      const {
        autoSaveId: autoSaveId2,
        onLayout: onLayout2,
        storage: storage2
      } = committedValuesRef.current;
      const {
        layout: prevLayout,
        panelDataArray
      } = eagerValuesRef.current;
      let unsafeLayout = null;
      if (autoSaveId2) {
        const state = loadPanelGroupState(autoSaveId2, panelDataArray, storage2);
        if (state) {
          panelSizeBeforeCollapseRef.current = new Map(Object.entries(state.expandToSizes));
          unsafeLayout = state.layout;
        }
      }
      if (unsafeLayout == null) {
        unsafeLayout = calculateUnsafeDefaultLayout({
          panelDataArray
        });
      }
      const nextLayout = validatePanelGroupLayout({
        layout: unsafeLayout,
        panelConstraints: panelDataArray.map((panelData) => panelData.constraints)
      });
      if (!areEqual(prevLayout, nextLayout)) {
        setLayout(nextLayout);
        eagerValuesRef.current.layout = nextLayout;
        if (onLayout2) {
          onLayout2(nextLayout);
        }
        callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
      }
    }
  });
  useIsomorphicLayoutEffect(() => {
    const eagerValues = eagerValuesRef.current;
    return () => {
      eagerValues.layout = [];
    };
  }, []);
  const registerResizeHandle2 = useCallback((dragHandleId) => {
    let isRTL = false;
    const panelGroupElement = panelGroupElementRef.current;
    if (panelGroupElement) {
      const style2 = window.getComputedStyle(panelGroupElement, null);
      if (style2.getPropertyValue("direction") === "rtl") {
        isRTL = true;
      }
    }
    return function resizeHandler(event) {
      event.preventDefault();
      const panelGroupElement2 = panelGroupElementRef.current;
      if (!panelGroupElement2) {
        return () => null;
      }
      const {
        direction: direction2,
        dragState: dragState2,
        id: groupId2,
        keyboardResizeBy: keyboardResizeBy2,
        onLayout: onLayout2
      } = committedValuesRef.current;
      const {
        layout: prevLayout,
        panelDataArray
      } = eagerValuesRef.current;
      const {
        initialLayout
      } = dragState2 !== null && dragState2 !== void 0 ? dragState2 : {};
      const pivotIndices = determinePivotIndices(groupId2, dragHandleId, panelGroupElement2);
      let delta = calculateDeltaPercentage(event, dragHandleId, direction2, dragState2, keyboardResizeBy2, panelGroupElement2);
      const isHorizontal = direction2 === "horizontal";
      if (isHorizontal && isRTL) {
        delta = -delta;
      }
      const panelConstraints = panelDataArray.map((panelData) => panelData.constraints);
      const nextLayout = adjustLayoutByDelta({
        delta,
        initialLayout: initialLayout !== null && initialLayout !== void 0 ? initialLayout : prevLayout,
        panelConstraints,
        pivotIndices,
        prevLayout,
        trigger: isKeyDown(event) ? "keyboard" : "mouse-or-touch"
      });
      const layoutChanged = !compareLayouts(prevLayout, nextLayout);
      if (isPointerEvent(event) || isMouseEvent(event)) {
        if (prevDeltaRef.current != delta) {
          prevDeltaRef.current = delta;
          if (!layoutChanged && delta !== 0) {
            if (isHorizontal) {
              reportConstraintsViolation(dragHandleId, delta < 0 ? EXCEEDED_HORIZONTAL_MIN : EXCEEDED_HORIZONTAL_MAX);
            } else {
              reportConstraintsViolation(dragHandleId, delta < 0 ? EXCEEDED_VERTICAL_MIN : EXCEEDED_VERTICAL_MAX);
            }
          } else {
            reportConstraintsViolation(dragHandleId, 0);
          }
        }
      }
      if (layoutChanged) {
        setLayout(nextLayout);
        eagerValuesRef.current.layout = nextLayout;
        if (onLayout2) {
          onLayout2(nextLayout);
        }
        callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
      }
    };
  }, []);
  const resizePanel2 = useCallback((panelData, unsafePanelSize) => {
    const {
      onLayout: onLayout2
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    const panelConstraintsArray = panelDataArray.map((panelData2) => panelData2.constraints);
    const {
      panelSize,
      pivotIndices
    } = panelDataHelper(panelDataArray, panelData, prevLayout);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
    const delta = isLastPanel ? panelSize - unsafePanelSize : unsafePanelSize - panelSize;
    const nextLayout = adjustLayoutByDelta({
      delta,
      initialLayout: prevLayout,
      panelConstraints: panelConstraintsArray,
      pivotIndices,
      prevLayout,
      trigger: "imperative-api"
    });
    if (!compareLayouts(prevLayout, nextLayout)) {
      setLayout(nextLayout);
      eagerValuesRef.current.layout = nextLayout;
      if (onLayout2) {
        onLayout2(nextLayout);
      }
      callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
    }
  }, []);
  const reevaluatePanelConstraints = useCallback((panelData, prevConstraints) => {
    const {
      layout: layout2,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize: prevCollapsedSize = 0,
      collapsible: prevCollapsible
    } = prevConstraints;
    const {
      collapsedSize: nextCollapsedSize = 0,
      collapsible: nextCollapsible,
      maxSize: nextMaxSize = 100,
      minSize: nextMinSize = 0
    } = panelData.constraints;
    const {
      panelSize: prevPanelSize
    } = panelDataHelper(panelDataArray, panelData, layout2);
    if (prevPanelSize == null) {
      return;
    }
    if (prevCollapsible && nextCollapsible && fuzzyNumbersEqual$1(prevPanelSize, prevCollapsedSize)) {
      if (!fuzzyNumbersEqual$1(prevCollapsedSize, nextCollapsedSize)) {
        resizePanel2(panelData, nextCollapsedSize);
      }
    } else if (prevPanelSize < nextMinSize) {
      resizePanel2(panelData, nextMinSize);
    } else if (prevPanelSize > nextMaxSize) {
      resizePanel2(panelData, nextMaxSize);
    }
  }, [resizePanel2]);
  const startDragging = useCallback((dragHandleId, event) => {
    const {
      direction: direction2
    } = committedValuesRef.current;
    const {
      layout: layout2
    } = eagerValuesRef.current;
    if (!panelGroupElementRef.current) {
      return;
    }
    const handleElement = getResizeHandleElement(dragHandleId, panelGroupElementRef.current);
    assert(handleElement, `Drag handle element not found for id "${dragHandleId}"`);
    const initialCursorPosition = getResizeEventCursorPosition(direction2, event);
    setDragState({
      dragHandleId,
      dragHandleRect: handleElement.getBoundingClientRect(),
      initialCursorPosition,
      initialLayout: layout2
    });
  }, []);
  const stopDragging = useCallback(() => {
    setDragState(null);
  }, []);
  const unregisterPanel = useCallback((panelData) => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    const index = findPanelDataIndex(panelDataArray, panelData);
    if (index >= 0) {
      panelDataArray.splice(index, 1);
      delete panelIdToLastNotifiedSizeMapRef.current[panelData.id];
      eagerValuesRef.current.panelDataArrayChanged = true;
      forceUpdate();
    }
  }, [forceUpdate]);
  const context = useMemo(() => ({
    collapsePanel,
    direction,
    dragState,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    isPanelCollapsed,
    isPanelExpanded,
    reevaluatePanelConstraints,
    registerPanel,
    registerResizeHandle: registerResizeHandle2,
    resizePanel: resizePanel2,
    startDragging,
    stopDragging,
    unregisterPanel,
    panelGroupElement: panelGroupElementRef.current
  }), [collapsePanel, dragState, direction, expandPanel, getPanelSize, getPanelStyle, groupId, isPanelCollapsed, isPanelExpanded, reevaluatePanelConstraints, registerPanel, registerResizeHandle2, resizePanel2, startDragging, stopDragging, unregisterPanel]);
  const style = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    height: "100%",
    overflow: "hidden",
    width: "100%"
  };
  return createElement(PanelGroupContext.Provider, {
    value: context
  }, createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: idFromProps,
    ref: panelGroupElementRef,
    style: {
      ...style,
      ...styleFromProps
    },
    // CSS selectors
    [DATA_ATTRIBUTES.group]: "",
    [DATA_ATTRIBUTES.groupDirection]: direction,
    [DATA_ATTRIBUTES.groupId]: groupId
  }));
}
const PanelGroup = forwardRef((props2, ref) => createElement(PanelGroupWithForwardedRef, {
  ...props2,
  forwardedRef: ref
}));
PanelGroupWithForwardedRef.displayName = "PanelGroup";
PanelGroup.displayName = "forwardRef(PanelGroup)";
function findPanelDataIndex(panelDataArray, panelData) {
  return panelDataArray.findIndex((prevPanelData) => prevPanelData === panelData || prevPanelData.id === panelData.id);
}
function panelDataHelper(panelDataArray, panelData, layout) {
  const panelIndex = findPanelDataIndex(panelDataArray, panelData);
  const isLastPanel = panelIndex === panelDataArray.length - 1;
  const pivotIndices = isLastPanel ? [panelIndex - 1, panelIndex] : [panelIndex, panelIndex + 1];
  const panelSize = layout[panelIndex];
  return {
    ...panelData.constraints,
    panelSize,
    pivotIndices
  };
}
function useWindowSplitterResizeHandlerBehavior({
  disabled,
  handleId,
  resizeHandler,
  panelGroupElement
}) {
  useEffect(() => {
    if (disabled || resizeHandler == null || panelGroupElement == null) {
      return;
    }
    const handleElement = getResizeHandleElement(handleId, panelGroupElement);
    if (handleElement == null) {
      return;
    }
    const onKeyDown = (event) => {
      if (event.defaultPrevented) {
        return;
      }
      switch (event.key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "End":
        case "Home": {
          event.preventDefault();
          resizeHandler(event);
          break;
        }
        case "F6": {
          event.preventDefault();
          const groupId = handleElement.getAttribute(DATA_ATTRIBUTES.groupId);
          assert(groupId, `No group element found for id "${groupId}"`);
          const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement);
          const index = getResizeHandleElementIndex(groupId, handleId, panelGroupElement);
          assert(index !== null, `No resize element found for id "${handleId}"`);
          const nextIndex = event.shiftKey ? index > 0 ? index - 1 : handles.length - 1 : index + 1 < handles.length ? index + 1 : 0;
          const nextHandle = handles[nextIndex];
          nextHandle.focus();
          break;
        }
      }
    };
    handleElement.addEventListener("keydown", onKeyDown);
    return () => {
      handleElement.removeEventListener("keydown", onKeyDown);
    };
  }, [panelGroupElement, disabled, handleId, resizeHandler]);
}
function PanelResizeHandle({
  children = null,
  className: classNameFromProps = "",
  disabled = false,
  hitAreaMargins,
  id: idFromProps,
  onBlur,
  onClick,
  onDragging,
  onFocus,
  onPointerDown,
  onPointerUp,
  style: styleFromProps = {},
  tabIndex = 0,
  tagName: Type = "div",
  ...rest
}) {
  var _hitAreaMargins$coars, _hitAreaMargins$fine;
  const elementRef = useRef(null);
  const callbacksRef = useRef({
    onClick,
    onDragging,
    onPointerDown,
    onPointerUp
  });
  useEffect(() => {
    callbacksRef.current.onClick = onClick;
    callbacksRef.current.onDragging = onDragging;
    callbacksRef.current.onPointerDown = onPointerDown;
    callbacksRef.current.onPointerUp = onPointerUp;
  });
  const panelGroupContext = useContext(PanelGroupContext);
  if (panelGroupContext === null) {
    throw Error(`PanelResizeHandle components must be rendered within a PanelGroup container`);
  }
  const {
    direction,
    groupId,
    registerResizeHandle: registerResizeHandleWithParentGroup,
    startDragging,
    stopDragging,
    panelGroupElement
  } = panelGroupContext;
  const resizeHandleId = useUniqueId(idFromProps);
  const [state, setState] = useState("inactive");
  const [isFocused, setIsFocused] = useState(false);
  const [resizeHandler, setResizeHandler] = useState(null);
  const committedValuesRef = useRef({
    state
  });
  useIsomorphicLayoutEffect(() => {
    committedValuesRef.current.state = state;
  });
  useEffect(() => {
    if (disabled) {
      setResizeHandler(null);
    } else {
      const resizeHandler2 = registerResizeHandleWithParentGroup(resizeHandleId);
      setResizeHandler(() => resizeHandler2);
    }
  }, [disabled, resizeHandleId, registerResizeHandleWithParentGroup]);
  const coarseHitAreaMargins = (_hitAreaMargins$coars = hitAreaMargins === null || hitAreaMargins === void 0 ? void 0 : hitAreaMargins.coarse) !== null && _hitAreaMargins$coars !== void 0 ? _hitAreaMargins$coars : 15;
  const fineHitAreaMargins = (_hitAreaMargins$fine = hitAreaMargins === null || hitAreaMargins === void 0 ? void 0 : hitAreaMargins.fine) !== null && _hitAreaMargins$fine !== void 0 ? _hitAreaMargins$fine : 5;
  useEffect(() => {
    if (disabled || resizeHandler == null) {
      return;
    }
    const element = elementRef.current;
    assert(element, "Element ref not attached");
    let didMove = false;
    const setResizeHandlerState = (action, isActive, event) => {
      if (!isActive) {
        setState("inactive");
        return;
      }
      switch (action) {
        case "down": {
          setState("drag");
          didMove = false;
          assert(event, 'Expected event to be defined for "down" action');
          startDragging(resizeHandleId, event);
          const {
            onDragging: onDragging2,
            onPointerDown: onPointerDown2
          } = callbacksRef.current;
          onDragging2 === null || onDragging2 === void 0 ? void 0 : onDragging2(true);
          onPointerDown2 === null || onPointerDown2 === void 0 ? void 0 : onPointerDown2();
          break;
        }
        case "move": {
          const {
            state: state2
          } = committedValuesRef.current;
          didMove = true;
          if (state2 !== "drag") {
            setState("hover");
          }
          assert(event, 'Expected event to be defined for "move" action');
          resizeHandler(event);
          break;
        }
        case "up": {
          setState("hover");
          stopDragging();
          const {
            onClick: onClick2,
            onDragging: onDragging2,
            onPointerUp: onPointerUp2
          } = callbacksRef.current;
          onDragging2 === null || onDragging2 === void 0 ? void 0 : onDragging2(false);
          onPointerUp2 === null || onPointerUp2 === void 0 ? void 0 : onPointerUp2();
          if (!didMove) {
            onClick2 === null || onClick2 === void 0 ? void 0 : onClick2();
          }
          break;
        }
      }
    };
    return registerResizeHandle(resizeHandleId, element, direction, {
      coarse: coarseHitAreaMargins,
      fine: fineHitAreaMargins
    }, setResizeHandlerState);
  }, [coarseHitAreaMargins, direction, disabled, fineHitAreaMargins, registerResizeHandleWithParentGroup, resizeHandleId, resizeHandler, startDragging, stopDragging]);
  useWindowSplitterResizeHandlerBehavior({
    disabled,
    handleId: resizeHandleId,
    resizeHandler,
    panelGroupElement
  });
  const style = {
    touchAction: "none",
    userSelect: "none"
  };
  return createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: idFromProps,
    onBlur: () => {
      setIsFocused(false);
      onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    },
    onFocus: () => {
      setIsFocused(true);
      onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    },
    ref: elementRef,
    role: "separator",
    style: {
      ...style,
      ...styleFromProps
    },
    tabIndex,
    // CSS selectors
    [DATA_ATTRIBUTES.groupDirection]: direction,
    [DATA_ATTRIBUTES.groupId]: groupId,
    [DATA_ATTRIBUTES.resizeHandle]: "",
    [DATA_ATTRIBUTES.resizeHandleActive]: state === "drag" ? "pointer" : isFocused ? "keyboard" : void 0,
    [DATA_ATTRIBUTES.resizeHandleEnabled]: !disabled,
    [DATA_ATTRIBUTES.resizeHandleId]: resizeHandleId,
    [DATA_ATTRIBUTES.resizeHandleState]: state
  });
}
PanelResizeHandle.displayName = "PanelResizeHandle";
function ResizablePanelGroup({
  className,
  ...props2
}) {
  return /* @__PURE__ */ jsx(
    PanelGroup,
    {
      "data-slot": "resizable-panel-group",
      className: cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      ),
      ...props2
    }
  );
}
function ResizablePanel({
  ...props2
}) {
  return /* @__PURE__ */ jsx(Panel, { "data-slot": "resizable-panel", ...props2 });
}
function ResizableHandle({
  withHandle,
  className,
  ...props2
}) {
  return /* @__PURE__ */ jsx(
    PanelResizeHandle,
    {
      "data-slot": "resizable-handle",
      className: cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      ),
      ...props2,
      children: withHandle && /* @__PURE__ */ jsx("div", { className: "bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border", children: /* @__PURE__ */ jsx(GripVerticalIcon, { className: "size-2.5" }) })
    }
  );
}
const useStore = (store, callback) => {
  const result = store(callback);
  const [data, setData] = useState();
  useEffect(() => {
    setData(result);
  }, [result]);
  return data;
};
const RESET_THEME_PROPS = {
  style: void 0,
  "data-mode": void 0,
  "data-color-theme": void 0,
  "data-border-radius": void 0
};
function TailwindThemePanel() {
  const {
    selectedPageId,
    updateLayer: updateLayerProps,
    findLayerById
  } = useLayerStore();
  const selectedPageData = findLayerById(selectedPageId);
  const [isCustomTheme, setIsCustomTheme] = useState(
    selectedPageData?.props["data-color-theme"] !== void 0
  );
  useEffect(() => {
    if (!isCustomTheme) {
      updateLayerProps(selectedPageId, RESET_THEME_PROPS);
    }
  }, [isCustomTheme, selectedPageId, updateLayerProps]);
  const handleOnToggle = useCallback(() => {
    setIsCustomTheme(!isCustomTheme);
  }, [isCustomTheme]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 mt-4", children: [
    /* @__PURE__ */ jsx(
      Toggle,
      {
        variant: "outline",
        onPressedChange: handleOnToggle,
        "aria-label": "Toggle italic",
        children: isCustomTheme ? "Use Default Theme" : "Use Custom Theme"
      }
    ),
    !isCustomTheme && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
      " Using Your Project's Theme"
    ] }),
    selectedPageData && isCustomTheme && /* @__PURE__ */ jsx(ThemePicker, { isDisabled: !isCustomTheme, pageLayer: selectedPageData }, selectedPageId)
  ] });
}
function ThemePicker({
  className,
  isDisabled,
  pageLayer
}) {
  const { updateLayer: updateLayerProps } = useLayerStore();
  const colorThemeValue = pageLayer.props?.["data-color-theme"];
  const modeValue = pageLayer.props?.["data-mode"];
  const borderRadiusValue = pageLayer.props?.borderRadius;
  const [colorTheme, setColorTheme] = useState(
    typeof colorThemeValue === "string" ? colorThemeValue : "red"
  );
  const [borderRadius, setBorderRadius] = useState(
    typeof borderRadiusValue === "number" ? borderRadiusValue : 0.5
  );
  const [mode, setMode] = useState(
    typeof modeValue === "string" ? modeValue : "light"
  );
  useEffect(() => {
    if (isDisabled) return;
    const colorThemeData = baseColors.find((color) => color.name === colorTheme);
    if (colorThemeData) {
      const colorDataWithBorder = {
        ...colorThemeData,
        cssVars: {
          ...colorThemeData.cssVars,
          [mode]: {
            ...colorThemeData.cssVars[mode],
            radius: `${borderRadius}rem`
          }
        }
      };
      const themeStyle = themeToStyleVars(colorDataWithBorder.cssVars[mode]);
      updateLayerProps(pageLayer.id, {
        style: themeStyle,
        "data-mode": mode,
        "data-color-theme": colorTheme,
        "data-border-radius": borderRadius
      });
    }
  }, [pageLayer.id, updateLayerProps, colorTheme, borderRadius, mode, isDisabled]);
  const colorOptions = useMemo(() => baseColors.map((color) => {
    return /* @__PURE__ */ jsx(
      ThemeColorOption,
      {
        color,
        colorTheme,
        mode,
        onClick: setColorTheme
      },
      color.name
    );
  }), [colorTheme, mode]);
  const borderRadiusOptions = useMemo(() => [0, 0.15, 0.3, 0.5, 0.75, 1].map((radius) => {
    return /* @__PURE__ */ jsx(
      ThemeBorderRadiusOption,
      {
        radius,
        borderRadius,
        onClick: setBorderRadius
      },
      radius
    );
  }), [borderRadius, setBorderRadius]);
  const modeOptions = useMemo(() => ["light", "dark"].map((modeOption) => {
    return /* @__PURE__ */ jsx(
      ThemeModeOption,
      {
        mode,
        modeOption,
        onClick: setMode
      },
      modeOption
    );
  }), [mode, setMode]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex flex-col gap-2",
        className,
        isDisabled && "opacity-30 pointer-events-none"
      ),
      children: [
        /* @__PURE__ */ jsx(Label, { className: "mt-2", children: "Colors" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: colorOptions }),
        /* @__PURE__ */ jsx(Label, { className: "mt-2", children: "Border Radius" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: borderRadiusOptions }),
        /* @__PURE__ */ jsx(Label, { className: "mt-2", children: "Mode" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: modeOptions })
      ]
    }
  );
}
function ThemeColorOption({ color, colorTheme, mode, onClick }) {
  const handleOnClick = useCallback(() => {
    onClick(color.name);
  }, [onClick, color.name]);
  const style = useMemo(() => ({
    backgroundColor: `hsl(${color.activeColor[mode === "dark" ? "dark" : "light"]})`
  }), [color.activeColor, mode]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: cn(
        "gap-2",
        color.name === colorTheme && "border-primary border-2"
      ),
      onClick: handleOnClick,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "size-4 rounded-full",
            style,
            children: color.name === colorTheme && /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" })
          }
        ),
        color.label
      ]
    },
    color.name
  );
}
function ThemeBorderRadiusOption({ radius, borderRadius, onClick }) {
  const handleOnClick = useCallback(() => {
    onClick(radius);
  }, [onClick, radius]);
  const style = useMemo(() => ({
    borderRadius: `${radius}rem`
  }), [radius]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: cn(
        "gap-2",
        radius === borderRadius && "border-primary border-2"
      ),
      onClick: handleOnClick,
      children: [
        /* @__PURE__ */ jsx("div", { className: "size-6 rounded-sm bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "size-10 ml-2 mt-2 border-2 border-secondary-foreground",
            style
          }
        ) }),
        radius
      ]
    },
    radius
  );
}
function ThemeModeOption({ modeOption, mode, onClick }) {
  const handleOnClick = useCallback(() => {
    onClick(modeOption);
  }, [onClick, modeOption]);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      onClick: handleOnClick,
      className: cn(mode === modeOption && "border-2 border-primary"),
      children: [
        modeOption === "light" ? /* @__PURE__ */ jsx(SunIcon, { className: "mr-1 -translate-x-1" }) : /* @__PURE__ */ jsx(MoonIcon, { className: "mr-1 -translate-x-1" }),
        modeOption
      ]
    },
    modeOption
  );
}
function themeToStyleVars(colors) {
  if (!colors) {
    return void 0;
  }
  const styleVariables = {};
  Object.entries(colors).forEach(([key, value]) => {
    styleVariables[`--${key}`] = value;
  });
  TAILWIND_V4_COLOR_KEYS.forEach((key) => {
    const value = colors[key];
    if (value) {
      styleVariables[`--color-${key}`] = `hsl(${value})`;
    }
  });
  const radiusValue = colors.radius;
  if (radiusValue) {
    styleVariables["--radius-lg"] = radiusValue;
    styleVariables["--radius-md"] = `calc(${radiusValue} - 2px)`;
    styleVariables["--radius-sm"] = `calc(${radiusValue} - 4px)`;
  }
  const globalOverrides = {
    color: `hsl(${colors.foreground})`,
    borderColor: `hsl(${colors.border})`,
    backgroundColor: `hsl(${colors.background})`
  };
  return { ...styleVariables, ...globalOverrides };
}
const ConfigPanel = () => {
  const {
    selectedPageId,
    findLayerById,
    removeLayer,
    duplicateLayer,
    updateLayer,
    pages
  } = useLayerStore();
  const selectedLayer = findLayerById(selectedPageId);
  const handleDeleteLayer = useCallback(
    (layerId) => {
      removeLayer(layerId);
    },
    [removeLayer]
  );
  const handleDuplicateLayer = useCallback(() => {
    if (selectedLayer) {
      duplicateLayer(selectedLayer.id);
    }
  }, [selectedLayer, duplicateLayer]);
  const handleUpdateLayerProps = useCallback(
    (id, props2, rest) => {
      updateLayer(id, props2, rest);
    },
    [updateLayer]
  );
  return /* @__PURE__ */ jsx(
    PageLayerForm,
    {
      selectedLayer,
      removeLayer: handleDeleteLayer,
      duplicateLayer: handleDuplicateLayer,
      updateLayerProps: handleUpdateLayerProps,
      allowDelete: pages.length > 1
    }
  );
};
const PageLayerForm = ({
  selectedLayer,
  removeLayer,
  duplicateLayer,
  updateLayerProps,
  allowDelete
}) => {
  const schema = useMemo(() => z$1.object({
    name: z$1.string().min(1, "Name is required")
  }), []);
  const handleSetValues = useCallback(
    (data) => {
      const { name } = data;
      const mergedValues = { ...selectedLayer, name, props: {} };
      const { props: props2, ...rest } = mergedValues;
      updateLayerProps(selectedLayer.id, props2, rest);
    },
    [selectedLayer, updateLayerProps]
  );
  const formSchema = useMemo(() => addDefaultValues(schema, {
    name: selectedLayer.name
  }), [selectedLayer, schema]);
  const values = useMemo(() => ({
    name: selectedLayer.name
  }), [selectedLayer]);
  const fieldConfig = useMemo(() => ({
    name: {
      inputProps: {
        value: selectedLayer.name
        // defaultValue: selectedLayer.name,
      }
    }
  }), [selectedLayer]);
  const handleDuplicateLayer = useCallback(() => {
    duplicateLayer(selectedLayer.id);
  }, [selectedLayer, duplicateLayer]);
  const handleRemoveLayer = useCallback(() => {
    removeLayer(selectedLayer.id);
  }, [selectedLayer, removeLayer]);
  return /* @__PURE__ */ jsxs(
    AutoForm,
    {
      formSchema,
      onValuesChange: handleSetValues,
      values,
      fieldConfig,
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "secondary",
            className: "mt-4 w-full",
            onClick: handleDuplicateLayer,
            children: "Duplicate Page"
          }
        ),
        allowDelete && /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "destructive",
            className: "mt-4 w-full",
            onClick: handleRemoveLayer,
            children: "Delete Page"
          }
        )
      ]
    }
  );
};
const EMPTY_OBJECT = {};
const VariablesPanel = ({
  className
}) => {
  const { variables, addVariable, updateVariable, removeVariable } = useLayerStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const incrementRevision = useEditorStore((state) => state.incrementRevision);
  const allowVariableEditing = useEditorStore((state) => state.allowVariableEditing);
  const functionRegistry = useEditorStore((state) => state.functionRegistry);
  const handleAddVariable = useCallback(
    (name, type, defaultValue) => {
      addVariable(name, type, defaultValue);
      incrementRevision();
    },
    [addVariable, incrementRevision]
  );
  const handleSetIsAdding = useCallback(() => {
    setIsAdding(true);
  }, []);
  const handleSetIsNotAdding = useCallback(() => {
    setIsAdding(false);
  }, []);
  const handleOnSave = useCallback(
    (id, updates) => {
      updateVariable(id, updates);
      setEditingId(null);
    },
    [updateVariable]
  );
  const handleOnCancel = useCallback(() => {
    setEditingId(null);
  }, []);
  const handleOnDelete = useCallback(
    (id) => {
      removeVariable(id);
      incrementRevision();
    },
    [removeVariable, incrementRevision]
  );
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-4 p-4", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Variables" }),
      allowVariableEditing && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSetIsAdding, disabled: isAdding, children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add Variable"
      ] })
    ] }),
    isAdding && allowVariableEditing && /* @__PURE__ */ jsx(
      AddVariableForm,
      {
        onSave: handleAddVariable,
        onCancel: handleSetIsNotAdding,
        functionRegistry
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: variables.map((variable) => /* @__PURE__ */ jsx(
      VariableCard,
      {
        variable,
        isEditing: editingId === variable.id,
        onEdit: setEditingId,
        onSave: handleOnSave,
        onCancel: handleOnCancel,
        onDelete: handleOnDelete,
        editVariables: allowVariableEditing,
        functionRegistry
      },
      variable.id
    )) }),
    variables.length === 0 && !isAdding && /* @__PURE__ */ jsx("div", { className: "text-center text-muted-foreground py-8", children: allowVariableEditing ? 'No variables defined. Click "Add Variable" to create one.' : "No variables defined." })
  ] });
};
const AddVariableForm = ({
  onSave,
  onCancel,
  functionRegistry
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const [defaultValue, setDefaultValue] = useState("");
  const [errors, setErrors] = useState(EMPTY_OBJECT);
  const functionOptions = useMemo(() => {
    if (!functionRegistry) return [];
    return Object.entries(functionRegistry).map(([id, def]) => ({
      id,
      name: def.name,
      description: def.description
    }));
  }, [functionRegistry]);
  const hasFunctions = functionOptions.length > 0;
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (type === "function") {
      if (!defaultValue) {
        newErrors.defaultValue = "Please select a function";
      }
    } else if (!defaultValue.trim()) {
      newErrors.defaultValue = "Preview value is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, defaultValue, type]);
  const handleSave = useCallback(() => {
    if (!validateForm()) return;
    let parsedValue = defaultValue;
    try {
      if (type === "number") {
        parsedValue = parseFloat(defaultValue) || 0;
      } else if (type === "boolean") {
        parsedValue = defaultValue.toLowerCase() === "true";
      }
    } catch (e) {
      console.warn("Error parsing variable value, keeping as string", e);
    }
    onSave(name, type, parsedValue);
  }, [name, type, defaultValue, onSave, validateForm]);
  const handleNameChange = useCallback(
    (e) => {
      setName(e.target.value);
      if (errors.name) setErrors((prev) => ({ ...prev, name: void 0 }));
    },
    [errors.name]
  );
  const handleTypeChange = useCallback(
    (value) => {
      setType(value);
      setDefaultValue("");
    },
    []
  );
  const handleDefaultValueChange = useCallback(
    (e) => {
      setDefaultValue(e.target.value);
      if (errors.defaultValue)
        setErrors((prev) => ({ ...prev, defaultValue: void 0 }));
    },
    [errors.defaultValue]
  );
  const handleFunctionSelect = useCallback(
    (value) => {
      setDefaultValue(value);
      if (errors.defaultValue)
        setErrors((prev) => ({ ...prev, defaultValue: void 0 }));
    },
    [errors.defaultValue]
  );
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Add New Variable" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "var-name", children: [
          "Name ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "var-name",
            value: name,
            onChange: handleNameChange,
            placeholder: "variableName",
            className: errors.name ? "border-red-500" : ""
          }
        ),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "var-type", children: "Type" }),
        /* @__PURE__ */ jsxs(Select, { value: type, onValueChange: handleTypeChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "string", children: "String" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "number", children: "Number" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "boolean", children: "Boolean" }),
            hasFunctions && /* @__PURE__ */ jsx(SelectItem, { value: "function", children: "Function" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: type === "function" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "var-function", children: [
          "Function ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: defaultValue, onValueChange: handleFunctionSelect, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: errors.defaultValue ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a function..." }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: functionOptions.map((fn) => /* @__PURE__ */ jsx(SelectItem, { value: fn.id, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { children: fn.name }),
            fn.description && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: fn.description })
          ] }) }, fn.id)) })
        ] }),
        errors.defaultValue && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.defaultValue })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "var-default", children: [
          "Preview Value ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "var-default",
            value: defaultValue,
            onChange: handleDefaultValueChange,
            placeholder: getPlaceholderForType(type),
            className: errors.defaultValue ? "border-red-500" : ""
          }
        ),
        errors.defaultValue && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.defaultValue })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSave, children: [
          /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-2" }),
          "Save"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: onCancel, children: [
          /* @__PURE__ */ jsx(X$1, { className: "h-4 w-4 mr-2" }),
          "Cancel"
        ] })
      ] })
    ] })
  ] });
};
const VariableCard = ({
  variable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  editVariables,
  functionRegistry
}) => {
  const [name, setName] = useState(variable.name);
  const [type, setType] = useState(variable.type);
  const [defaultValue, setDefaultValue] = useState(
    String(variable.defaultValue)
  );
  const [errors, setErrors] = useState(EMPTY_OBJECT);
  const functionOptions = useMemo(() => {
    if (!functionRegistry) return [];
    return Object.entries(functionRegistry).map(([id, def]) => ({
      id,
      name: def.name,
      description: def.description
    }));
  }, [functionRegistry]);
  const hasFunctions = functionOptions.length > 0;
  const getFunctionDisplayName = useCallback((funcId) => {
    if (!functionRegistry) return funcId;
    const fn = functionRegistry[funcId];
    return fn ? fn.name : funcId;
  }, [functionRegistry]);
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (type === "function") {
      if (!defaultValue) {
        newErrors.defaultValue = "Please select a function";
      }
    } else if (!defaultValue.trim()) {
      newErrors.defaultValue = "Preview value is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, defaultValue, type]);
  const handleSave = useCallback(() => {
    if (!validateForm()) return;
    let parsedValue = defaultValue;
    try {
      if (type === "number") {
        parsedValue = parseFloat(defaultValue) || 0;
      } else if (type === "boolean") {
        parsedValue = defaultValue.toLowerCase() === "true";
      }
    } catch (e) {
      console.warn("Error parsing variable value, keeping as string", e);
    }
    onSave(variable.id, { name, type, defaultValue: parsedValue });
  }, [name, type, defaultValue, onSave, validateForm, variable.id]);
  const handleNameChange = useCallback(
    (e) => {
      setName(e.target.value);
      if (errors.name) setErrors((prev) => ({ ...prev, name: void 0 }));
    },
    [errors.name]
  );
  const handleTypeChange = useCallback(
    (value) => {
      setType(value);
      setDefaultValue("");
    },
    []
  );
  const handleDefaultValueChange = useCallback(
    (e) => {
      setDefaultValue(e.target.value);
      if (errors.defaultValue)
        setErrors((prev) => ({ ...prev, defaultValue: void 0 }));
    },
    [errors.defaultValue]
  );
  const handleFunctionSelect = useCallback(
    (value) => {
      setDefaultValue(value);
      if (errors.defaultValue)
        setErrors((prev) => ({ ...prev, defaultValue: void 0 }));
    },
    [errors.defaultValue]
  );
  const handleOnEdit = useCallback(() => {
    onEdit(variable.id);
  }, [onEdit, variable.id]);
  const handleOnDelete = useCallback(() => {
    onDelete(variable.id);
  }, [onDelete, variable.id]);
  if (isEditing) {
    return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: `edit-name-${variable.id}`, children: [
          "Name ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: `edit-name-${variable.id}`,
            value: name,
            onChange: handleNameChange,
            className: errors.name ? "border-red-500" : ""
          }
        ),
        errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: `edit-type-${variable.id}`, children: "Type" }),
        /* @__PURE__ */ jsxs(Select, { value: type, onValueChange: handleTypeChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "string", children: "String" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "number", children: "Number" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "boolean", children: "Boolean" }),
            hasFunctions && /* @__PURE__ */ jsx(SelectItem, { value: "function", children: "Function" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { children: type === "function" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: `edit-function-${variable.id}`, children: [
          "Function ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: defaultValue, onValueChange: handleFunctionSelect, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: errors.defaultValue ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a function..." }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: functionOptions.map((fn) => /* @__PURE__ */ jsx(SelectItem, { value: fn.id, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { children: fn.name }),
            fn.description && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: fn.description })
          ] }) }, fn.id)) })
        ] }),
        errors.defaultValue && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.defaultValue })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: `edit-default-${variable.id}`, children: [
          "Preview Value ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: `edit-default-${variable.id}`,
            value: defaultValue,
            onChange: handleDefaultValueChange,
            placeholder: getPlaceholderForType(type),
            className: errors.defaultValue ? "border-red-500" : ""
          }
        ),
        errors.defaultValue && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.defaultValue })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSave, children: [
          /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-2" }),
          "Save"
        ] }),
        /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: onCancel, children: [
          /* @__PURE__ */ jsx(X$1, { className: "h-4 w-4 mr-2" }),
          "Cancel"
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: variable.name }),
        /* @__PURE__ */ jsx("span", { className: "text-xs bg-muted px-2 py-1 rounded", children: variable.type })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-1", children: variable.type === "function" ? getFunctionDisplayName(String(variable.defaultValue)) : String(variable.defaultValue) })
    ] }),
    editVariables && /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: handleOnEdit, children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: handleOnDelete, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  ] }) }) });
};
function getPlaceholderForType(type) {
  switch (type) {
    case "string":
      return "Enter text...";
    case "number":
      return "0";
    case "boolean":
      return "true";
    case "function":
      return "Select a function...";
    default:
      return "";
  }
}
const Toaster = ({ ...props2 }) => {
  const { theme = "system" } = z();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      icons: {
        success: /* @__PURE__ */ jsx(CircleCheckIcon, { className: "size-4" }),
        info: /* @__PURE__ */ jsx(InfoIcon, { className: "size-4" }),
        warning: /* @__PURE__ */ jsx(TriangleAlertIcon, { className: "size-4" }),
        error: /* @__PURE__ */ jsx(OctagonXIcon, { className: "size-4" }),
        loading: /* @__PURE__ */ jsx(Loader2Icon, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      ...props2
    }
  );
};
const UIBuilder = ({
  initialLayers,
  onChange,
  initialVariables,
  onVariablesChange,
  componentRegistry,
  panelConfig: userPanelConfig,
  persistLayerStore = true,
  allowVariableEditing = true,
  allowPagesCreation = true,
  allowPagesDeletion = true,
  navLeftChildren,
  navRightChildren,
  showExport = true,
  blocks,
  functionRegistry
}) => {
  const layerStore = useStore(useLayerStore, (state) => state);
  const editorStore = useStore(useEditorStore, (state) => state);
  const [editorStoreInitialized, setEditorStoreInitialized] = useState(false);
  const [layerStoreInitialized, setLayerStoreInitialized] = useState(false);
  const memoizedDefaultTabsContent = useMemo(() => defaultConfigTabsContent(), []);
  const currentPanelConfig = useMemo(() => {
    const effectiveTabsContent = userPanelConfig?.pageConfigPanelTabsContent || memoizedDefaultTabsContent;
    const defaultPanels = getDefaultPanelConfigValues(effectiveTabsContent, navLeftChildren, navRightChildren, showExport);
    return {
      navBar: userPanelConfig?.navBar ?? defaultPanels.navBar,
      pageConfigPanel: userPanelConfig?.pageConfigPanel ?? defaultPanels.pageConfigPanel,
      editorPanel: userPanelConfig?.editorPanel ?? defaultPanels.editorPanel,
      propsPanel: userPanelConfig?.propsPanel ?? defaultPanels.propsPanel
    };
  }, [userPanelConfig, memoizedDefaultTabsContent, navLeftChildren, navRightChildren, showExport]);
  useEffect(() => {
    if (editorStore && componentRegistry && !editorStoreInitialized) {
      editorStore.initialize(componentRegistry, persistLayerStore, allowPagesCreation, allowPagesDeletion, allowVariableEditing, blocks, functionRegistry);
      setEditorStoreInitialized(true);
    }
  }, [
    editorStore,
    componentRegistry,
    editorStoreInitialized,
    persistLayerStore,
    allowPagesCreation,
    allowPagesDeletion,
    allowVariableEditing,
    blocks,
    functionRegistry
  ]);
  useEffect(() => {
    if (layerStore && editorStore) {
      if (initialLayers && !layerStoreInitialized) {
        layerStore.initialize(initialLayers, void 0, void 0, initialVariables);
        setLayerStoreInitialized(true);
        const { clear } = useLayerStore.temporal.getState();
        clear();
      } else {
        setLayerStoreInitialized(true);
      }
    }
  }, [
    layerStore,
    editorStore,
    componentRegistry,
    initialLayers,
    initialVariables,
    layerStoreInitialized
  ]);
  useEffect(() => {
    if (onChange && layerStore?.pages && layerStoreInitialized) {
      onChange(layerStore.pages);
    }
  }, [layerStore?.pages, onChange, layerStoreInitialized]);
  useEffect(() => {
    if (onVariablesChange && layerStore?.variables && layerStoreInitialized) {
      onVariablesChange(layerStore.variables);
    }
  }, [layerStore?.variables, onVariablesChange, layerStoreInitialized]);
  const isLoading = !layerStoreInitialized || !editorStoreInitialized;
  const layout = isLoading ? /* @__PURE__ */ jsx(LoadingSkeleton, {}) : /* @__PURE__ */ jsx(MainLayout, { panelConfig: currentPanelConfig });
  return /* @__PURE__ */ jsx(
    J,
    {
      "data-testid": "theme-provider",
      attribute: "class",
      defaultTheme: "system",
      enableSystem: true,
      disableTransitionOnChange: true,
      children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
        layout,
        /* @__PURE__ */ jsx(Toaster, { position: "bottom-right" })
      ] })
    }
  );
};
function MainLayout({ panelConfig }) {
  const showLeftPanel = useEditorStore((state) => state.showLeftPanel);
  const showRightPanel = useEditorStore((state) => state.showRightPanel);
  const mainPanels = useMemo(() => {
    const panels = [];
    if (showLeftPanel) {
      panels.push({
        title: "Page Config",
        content: panelConfig.pageConfigPanel,
        defaultSize: showRightPanel ? 25 : 33
      });
    }
    panels.push({
      title: "UI Editor",
      content: panelConfig.editorPanel,
      defaultSize: showLeftPanel && showRightPanel ? 50 : showLeftPanel || showRightPanel ? 67 : 100
    });
    if (showRightPanel) {
      panels.push({
        title: "Props",
        content: panelConfig.propsPanel,
        defaultSize: showLeftPanel ? 25 : 33
      });
    }
    return panels;
  }, [panelConfig, showLeftPanel, showRightPanel]);
  const [selectedPanel, setSelectedPanel] = useState(() => {
    const editorPanel = mainPanels.find((panel) => panel.title === "UI Editor");
    return editorPanel || mainPanels[0];
  });
  useEffect(() => {
    const editorPanel = mainPanels.find((panel) => panel.title === "UI Editor");
    const currentPanel = mainPanels.find((panel) => panel.title === selectedPanel?.title);
    if (!currentPanel) {
      setSelectedPanel(editorPanel || mainPanels[0]);
    }
  }, [mainPanels, selectedPanel?.title]);
  const handlePanelClickById = useCallback((e) => {
    const panelIndex = parseInt(e.currentTarget.dataset.panelIndex || "0");
    setSelectedPanel(mainPanels[panelIndex]);
  }, [mainPanels]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-testid": "component-editor",
      className: "flex flex-col w-full flex-grow h-dvh",
      children: [
        panelConfig.navBar,
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(
          ResizablePanelGroup,
          {
            direction: "horizontal",
            className: "flex overflow-hidden flex-1",
            children: mainPanels.map((panel, index) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
              index > 0 && /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true }),
              /* @__PURE__ */ jsx(
                ResizablePanel,
                {
                  defaultSize: panel.defaultSize,
                  minSize: 15,
                  className: "min-h-full flex-1",
                  children: panel.content
                }
              )
            ] }, panel.title))
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex size-full flex-col md:hidden overflow-hidden ", children: [
          selectedPanel?.content,
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 right-4 z-50", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center rounded-full bg-primary p-2 shadow-lg", children: mainPanels.map((panel, index) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: selectedPanel?.title !== panel.title ? "default" : "secondary",
              size: "sm",
              className: "flex-1",
              "data-panel-index": index,
              onClick: handlePanelClickById,
              children: panel.title
            },
            panel.title
          )) }) })
        ] })
      ]
    }
  );
}
function PageConfigPanel({
  className,
  tabsContent
}) {
  const { layers, appearance, data } = tabsContent;
  const tabCount = 1 + (appearance ? 1 : 0) + (data ? 1 : 0);
  return /* @__PURE__ */ jsxs(
    Tabs,
    {
      "data-testid": "page-config-panel",
      defaultValue: "layers",
      className,
      children: [
        /* @__PURE__ */ jsxs(TabsList, { className: `grid grid-cols-${tabCount} mx-4`, children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "layers", children: layers.title }),
          appearance && /* @__PURE__ */ jsx(TabsTrigger, { value: "appearance", children: appearance.title }),
          data && /* @__PURE__ */ jsx(TabsTrigger, { value: "variables", children: data.title })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "layers", children: layers.content }),
        appearance && /* @__PURE__ */ jsx(TabsContent, { value: "appearance", children: appearance.content }),
        data && /* @__PURE__ */ jsx(TabsContent, { value: "variables", children: data.content })
      ]
    }
  );
}
function defaultConfigTabsContent() {
  return {
    layers: { title: "Layers", content: /* @__PURE__ */ jsx(LayersPanel, {}) },
    appearance: {
      title: "Appearance",
      content: /* @__PURE__ */ jsxs("div", { className: "py-2 px-4 gap-2 flex flex-col overflow-y-auto overflow-x-auto", children: [
        /* @__PURE__ */ jsx(ConfigPanel, {}),
        /* @__PURE__ */ jsx(TailwindThemePanel, {})
      ] })
    },
    data: { title: "Data", content: /* @__PURE__ */ jsx(VariablesPanel, {}) }
  };
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-testid": "loading-skeleton",
      className: "flex flex-col flex-1 gap-1 bg-secondary/90",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full h-16 animate-pulse bg-background rounded-md" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1/4 animate-pulse bg-background rounded-md" }),
          /* @__PURE__ */ jsx("div", { className: "w-1/2 animate-pulse bg-muted-background/90 rounded-md" }),
          /* @__PURE__ */ jsx("div", { className: "w-1/4 animate-pulse bg-background rounded-md" })
        ] })
      ]
    }
  );
}
const getDefaultPanelConfigValues = (tabsContent, navLeftChildren, navRightChildren, showExport) => {
  return {
    navBar: /* @__PURE__ */ jsx(NavBar, { leftChildren: navLeftChildren, rightChildren: navRightChildren, showExport }),
    pageConfigPanel: /* @__PURE__ */ jsx(PageConfigPanel, { className: "pt-4 pb-20 md:pb-4 overflow-y-auto relative size-full", tabsContent }),
    editorPanel: /* @__PURE__ */ jsx(
      EditorPanel,
      {
        className: "pb-20 md:pb-0 overflow-y-auto"
      }
    ),
    propsPanel: /* @__PURE__ */ jsx(PropsPanel, { className: "px-4 pt-4 pb-20 md:pb-4 overflow-y-auto relative size-full" })
  };
};
function buildRegistryDescription(registry) {
  const lines = [];
  for (const [name, entry] of Object.entries(registry)) {
    let propsLine = "";
    try {
      const shape = entry.schema?.shape;
      if (shape) {
        const fields = Object.keys(shape).join(", ");
        propsLine = ` — props: ${fields}`;
      }
    } catch {
    }
    lines.push(`- ${name}${propsLine}`);
  }
  return lines.join("\n");
}
function buildPageDescription(id, slug, layers, registry) {
  const header = id ? `UI Builder — editing page (slug: "${slug}")` : "UI Builder — creating new page";
  const layersJson = JSON.stringify(layers, null, 2);
  const registryDesc = buildRegistryDescription(registry);
  const layerFormat = `Each layer: { id: string, type: string, name: string, props: Record<string,any>, children?: ComponentLayer[] | string }`;
  const full = [
    header,
    "",
    `## Current Layers (${layers.length})`,
    layersJson,
    "",
    `## Available Component Types`,
    registryDesc,
    "",
    `## ComponentLayer format`,
    layerFormat
  ].join("\n");
  if (full.length <= 16e3) return full;
  const overhead = [
    header,
    "",
    `## Current Layers (${layers.length})`,
    "",
    "",
    `## Available Component Types`,
    registryDesc,
    "",
    `## ComponentLayer format`,
    layerFormat
  ].join("\n").length + 30;
  const budget = Math.max(0, 16e3 - overhead);
  const truncatedLayers = layersJson.length > budget ? layersJson.slice(0, budget) + "\n...(truncated)" : layersJson;
  return [
    header,
    "",
    `## Current Layers (${layers.length})`,
    truncatedLayers,
    "",
    `## Available Component Types`,
    registryDesc,
    "",
    `## ComponentLayer format`,
    layerFormat
  ].join("\n");
}
function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function PageBuilderPage({ id }) {
  if (id) {
    return /* @__PURE__ */ jsx(EditPageBuilderPage, { id });
  }
  return /* @__PURE__ */ jsx(CreatePageBuilderPage, {});
}
function EditPageBuilderPage({ id }) {
  const { page: existingPage } = useSuspenseUIBuilderPage(id);
  return /* @__PURE__ */ jsx(PageBuilderPageContent, { id, existingPage });
}
function CreatePageBuilderPage() {
  return /* @__PURE__ */ jsx(PageBuilderPageContent, {});
}
function parseLayers(layersJson) {
  if (!layersJson) return [];
  try {
    return JSON.parse(layersJson);
  } catch {
    return [];
  }
}
function parseVariables(variablesJson) {
  if (!variablesJson) return [];
  try {
    return JSON.parse(variablesJson);
  } catch {
    return [];
  }
}
function PageBuilderPageContent({
  id,
  existingPage
}) {
  const {
    navigate,
    Link,
    componentRegistry: customRegistry,
    functionRegistry
  } = usePluginOverrides("ui-builder");
  const basePath = useBasePath();
  const createMutation = useCreateUIBuilderPage();
  const updateMutation = useUpdateUIBuilderPage();
  const loc = uiBuilderLocalization;
  const LinkComponent = Link || "a";
  const componentRegistry = customRegistry || defaultComponentRegistry;
  const existingLayers = parseLayers(existingPage?.parsedData?.layers);
  const existingVariables = parseVariables(existingPage?.parsedData?.variables);
  const [slug, setSlug] = useState(existingPage?.slug || "");
  const [status, setStatus] = useState(
    existingPage?.parsedData?.status || "draft"
  );
  const [layers, setLayers] = useState(existingLayers);
  const [variables, setVariables] = useState(existingVariables);
  const [autoSlug, setAutoSlug] = useState(!id);
  useRegisterPageAIContext({
    routeName: id ? "ui-builder-edit-page" : "ui-builder-new-page",
    pageDescription: buildPageDescription(id, slug, layers, componentRegistry),
    suggestions: [
      "Add a hero section",
      "Add a 3-column feature grid",
      "Make the layout full-width",
      "Add a card with a title, description, and button",
      "Replace the layout with a centered single-column design"
    ],
    clientTools: {
      updatePageLayers: async ({ layers: newLayers }) => {
        const store = useLayerStore.getState();
        store.initialize(
          newLayers,
          store.selectedPageId || newLayers[0]?.id,
          void 0,
          store.variables
        );
        return {
          success: true,
          message: `Applied ${newLayers.length} layer(s) to the page`
        };
      }
    }
  });
  const handleLayersChange = useCallback(
    (newLayers) => {
      setLayers(newLayers);
      if (autoSlug && newLayers.length > 0 && newLayers[0]?.name) {
        setSlug(slugify(newLayers[0].name));
      }
    },
    [autoSlug]
  );
  const handleVariablesChange = useCallback((newVariables) => {
    setVariables(newVariables);
  }, []);
  const handleSave = async () => {
    if (!slug.trim()) {
      toast.error(loc.pageBuilder.validation.slugRequired);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      toast.error(loc.pageBuilder.validation.slugFormat);
      return;
    }
    if (layers.length === 0) {
      toast.error(loc.pageBuilder.validation.layersRequired);
      return;
    }
    try {
      if (id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            layers,
            variables,
            status
          }
        });
        toast.success(loc.pageBuilder.saved);
      } else {
        const newPage = await createMutation.mutateAsync({
          slug,
          layers,
          variables,
          status
        });
        toast.success(loc.pageBuilder.saved);
        navigate?.(`${basePath}/ui-builder/${newPage.id}/edit`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("slug already exists")) {
        toast.error("A page with this slug already exists");
      } else {
        toast.error(loc.pageBuilder.saveError);
      }
    }
  };
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const pageSettingsFields = (isMobile) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: isMobile ? "flex flex-col gap-4" : "flex items-center gap-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: isMobile ? "flex flex-col gap-2" : "", children: [
          isMobile && /* @__PURE__ */ jsx(Label, { htmlFor: "page-slug", className: "text-sm font-medium", children: loc.pageBuilder.slugLabel }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "page-slug",
              value: slug,
              onChange: (e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              },
              placeholder: loc.pageBuilder.slugPlaceholder,
              className: isMobile ? "h-9 font-mono text-sm" : "h-8 w-48 font-mono text-sm",
              disabled: !!id
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: isMobile ? "flex flex-col gap-2" : "", children: [
          isMobile && /* @__PURE__ */ jsx(Label, { htmlFor: "page-status", className: "text-sm font-medium", children: loc.pageBuilder.statusLabel }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: status,
              onValueChange: (v) => setStatus(v),
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { className: isMobile ? "h-9 w-full" : "h-8 w-28", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "draft", children: loc.pageBuilder.statusOptions.draft }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "published", children: loc.pageBuilder.statusOptions.published }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "archived", children: loc.pageBuilder.statusOptions.archived })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
  const navLeftChildren = /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-4", children: [
    /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "shrink-0", children: /* @__PURE__ */ jsx(LinkComponent, { href: `${basePath}/ui-builder`, children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxs(Popover, { children: [
      /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
        /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "max-w-20 truncate font-mono text-xs", children: slug || loc.pageBuilder.slugPlaceholder })
      ] }) }),
      /* @__PURE__ */ jsx(PopoverContent, { className: "z-[9999] w-72", align: "start", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-medium leading-none", children: "Page Settings" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Configure page slug and status" })
        ] }),
        pageSettingsFields(true)
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:flex md:items-center md:gap-4", children: pageSettingsFields(false) })
  ] });
  const navRightChildren = /* @__PURE__ */ jsxs(
    Button,
    {
      onClick: handleSave,
      disabled: isSaving,
      size: "icon",
      className: "md:w-auto md:px-4",
      children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 md:mr-2" }),
        /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: isSaving ? loc.pageBuilder.saving : id ? loc.pageBuilder.save : loc.pageBuilder.save })
      ]
    }
  );
  return /* @__PURE__ */ jsx("div", { className: "flex h-full flex-col", "data-testid": "page-builder-page", children: /* @__PURE__ */ jsx(
    UIBuilder,
    {
      initialLayers: existingLayers.length > 0 ? existingLayers : void 0,
      onChange: handleLayersChange,
      initialVariables: existingVariables.length > 0 ? existingVariables : void 0,
      onVariablesChange: handleVariablesChange,
      componentRegistry,
      functionRegistry,
      persistLayerStore: false,
      allowVariableEditing: true,
      allowPagesCreation: false,
      allowPagesDeletion: false,
      showExport: false,
      navLeftChildren,
      navRightChildren
    }
  ) });
}
export {
  PageBuilderPage
};
