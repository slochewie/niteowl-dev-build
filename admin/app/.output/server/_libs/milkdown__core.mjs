import { c as createSlice, a as createTimer, C as Container, b as Clock, d as Ctx } from "./milkdown__ctx.mjs";
import { c as ctxCallOutOfScope, e as callCommandBeforeEditorView, f as docTypeError } from "./milkdown__exception.mjs";
import { c as customInputRules } from "./milkdown__prose.mjs";
import { P as ParserState, S as SerializerState } from "./milkdown__transformer.mjs";
import { c as Schema, b as DOMParser, N as Node } from "./prosemirror-model.mjs";
import { P as Plugin, a as PluginKey, E as EditorState } from "./prosemirror-state.mjs";
import { k as keymap$1 } from "./prosemirror-keymap.mjs";
import { E as EditorView } from "./prosemirror-view.mjs";
import { u as unified } from "./unified.mjs";
import { r as remarkParse } from "./remark-parse.mjs";
import { r as remarkStringify } from "./remark-stringify.mjs";
import { c as chainCommands, b as baseKeymap, s as selectNodeBackward, j as joinTextblockBackward, d as deleteSelection } from "./prosemirror-commands.mjs";
import { u as undoInputRule } from "./prosemirror-inputrules.mjs";
function withMeta(plugin, meta) {
  plugin.meta = {
    package: "@milkdown/core",
    group: "System",
    ...meta
  };
  return plugin;
}
var remarkHandlers = {
  text: (node, _, state, info) => {
    const value = node.value;
    if (/^[^*_\\]*\s+$/.test(value)) return value;
    return state.safe(value, {
      ...info,
      encode: []
    });
  },
  strong: (node, _, state, info) => {
    const marker = node.marker || state.options.strong || "*";
    const exit = state.enter("strong");
    const tracker = state.createTracker(info);
    let value = tracker.move(marker + marker);
    value += tracker.move(state.containerPhrasing(node, {
      before: value,
      after: marker,
      ...tracker.current()
    }));
    value += tracker.move(marker + marker);
    exit();
    return value;
  },
  emphasis: (node, _, state, info) => {
    const marker = node.marker || state.options.emphasis || "*";
    const exit = state.enter("emphasis");
    const tracker = state.createTracker(info);
    let value = tracker.move(marker);
    value += tracker.move(state.containerPhrasing(node, {
      before: value,
      after: marker,
      ...tracker.current()
    }));
    value += tracker.move(marker);
    exit();
    return value;
  }
};
var editorViewCtx = createSlice({}, "editorView");
var editorStateCtx = createSlice({}, "editorState");
var initTimerCtx = createSlice([], "initTimer");
var editorCtx = createSlice({}, "editor");
var inputRulesCtx = createSlice([], "inputRules");
var prosePluginsCtx = createSlice([], "prosePlugins");
var remarkPluginsCtx = createSlice([], "remarkPlugins");
var nodeViewCtx = createSlice([], "nodeView");
var markViewCtx = createSlice([], "markView");
var remarkCtx = createSlice(unified().use(remarkParse).use(remarkStringify), "remark");
var remarkStringifyOptionsCtx = createSlice({
  handlers: remarkHandlers,
  encode: []
}, "remarkStringifyOptions");
var ConfigReady = createTimer("ConfigReady");
function config(configure) {
  const plugin = (ctx) => {
    ctx.record(ConfigReady);
    return async () => {
      await configure(ctx);
      ctx.done(ConfigReady);
      return () => {
        ctx.clearTimer(ConfigReady);
      };
    };
  };
  withMeta(plugin, { displayName: "Config" });
  return plugin;
}
var InitReady = createTimer("InitReady");
function init(editor) {
  const plugin = (ctx) => {
    ctx.inject(editorCtx, editor).inject(prosePluginsCtx, []).inject(remarkPluginsCtx, []).inject(inputRulesCtx, []).inject(nodeViewCtx, []).inject(markViewCtx, []).inject(remarkStringifyOptionsCtx, {
      handlers: remarkHandlers,
      encode: []
    }).inject(remarkCtx, unified().use(remarkParse).use(remarkStringify)).inject(initTimerCtx, [ConfigReady]).record(InitReady);
    return async () => {
      await ctx.waitTimers(initTimerCtx);
      const options = ctx.get(remarkStringifyOptionsCtx);
      ctx.set(remarkCtx, unified().use(remarkParse).use(remarkStringify, options));
      ctx.done(InitReady);
      return () => {
        ctx.remove(editorCtx).remove(prosePluginsCtx).remove(remarkPluginsCtx).remove(inputRulesCtx).remove(nodeViewCtx).remove(markViewCtx).remove(remarkStringifyOptionsCtx).remove(remarkCtx).remove(initTimerCtx).clearTimer(InitReady);
      };
    };
  };
  withMeta(plugin, { displayName: "Init" });
  return plugin;
}
var SchemaReady = createTimer("SchemaReady");
var schemaTimerCtx = createSlice([], "schemaTimer");
var schemaCtx = createSlice({}, "schema");
var nodesCtx = createSlice([], "nodes");
var marksCtx = createSlice([], "marks");
function extendPriority(x) {
  return {
    ...x,
    parseDOM: x.parseDOM?.map((rule) => ({
      priority: x.priority,
      ...rule
    }))
  };
}
var schema = (ctx) => {
  ctx.inject(schemaCtx, {}).inject(nodesCtx, []).inject(marksCtx, []).inject(schemaTimerCtx, [InitReady]).record(SchemaReady);
  return async () => {
    await ctx.waitTimers(schemaTimerCtx);
    const remark = ctx.get(remarkCtx);
    const processor = ctx.get(remarkPluginsCtx).reduce((acc, plug) => acc.use(plug.plugin, plug.options), remark);
    ctx.set(remarkCtx, processor);
    const schema2 = new Schema({
      nodes: Object.fromEntries(ctx.get(nodesCtx).map(([key2, x]) => [key2, extendPriority(x)])),
      marks: Object.fromEntries(ctx.get(marksCtx).map(([key2, x]) => [key2, extendPriority(x)]))
    });
    ctx.set(schemaCtx, schema2);
    ctx.done(SchemaReady);
    return () => {
      ctx.remove(schemaCtx).remove(nodesCtx).remove(marksCtx).remove(schemaTimerCtx).clearTimer(SchemaReady);
    };
  };
};
withMeta(schema, { displayName: "Schema" });
var CommandManager = class {
  constructor() {
    this.#container = new Container();
    this.#ctx = null;
    this.setCtx = (ctx) => {
      this.#ctx = ctx;
    };
    this.chain = () => {
      if (this.#ctx == null) throw callCommandBeforeEditorView();
      const ctx = this.#ctx;
      const commands2 = [];
      const get = this.get.bind(this);
      const chains = {
        run: () => {
          const chained = chainCommands(...commands2);
          const view = ctx.get(editorViewCtx);
          return chained(view.state, view.dispatch, view);
        },
        inline: (command) => {
          commands2.push(command);
          return chains;
        },
        pipe: pipe.bind(this)
      };
      function pipe(slice, payload) {
        const cmd = get(slice);
        commands2.push(cmd(payload));
        return chains;
      }
      return chains;
    };
  }
  #container;
  #ctx;
  get ctx() {
    return this.#ctx;
  }
  create(meta, value) {
    const slice = meta.create(this.#container.sliceMap);
    slice.set(value);
    return slice;
  }
  get(slice) {
    return this.#container.get(slice).get();
  }
  remove(slice) {
    return this.#container.remove(slice);
  }
  call(slice, payload) {
    if (this.#ctx == null) throw callCommandBeforeEditorView();
    const command = this.get(slice)(payload);
    const view = this.#ctx.get(editorViewCtx);
    return command(view.state, view.dispatch, view);
  }
  inline(command) {
    if (this.#ctx == null) throw callCommandBeforeEditorView();
    const view = this.#ctx.get(editorViewCtx);
    return command(view.state, view.dispatch, view);
  }
};
function createCmdKey(key2 = "cmdKey") {
  return createSlice((() => () => false), key2);
}
var commandsCtx = createSlice(new CommandManager(), "commands");
var commandsTimerCtx = createSlice([SchemaReady], "commandsTimer");
var CommandsReady = createTimer("CommandsReady");
var commands = (ctx) => {
  const cmd = new CommandManager();
  cmd.setCtx(ctx);
  ctx.inject(commandsCtx, cmd).inject(commandsTimerCtx, [SchemaReady]).record(CommandsReady);
  return async () => {
    await ctx.waitTimers(commandsTimerCtx);
    ctx.done(CommandsReady);
    return () => {
      ctx.remove(commandsCtx).remove(commandsTimerCtx).clearTimer(CommandsReady);
    };
  };
};
withMeta(commands, { displayName: "Commands" });
function overrideBaseKeymap(keymap2) {
  keymap2.Backspace = chainCommands(undoInputRule, deleteSelection, joinTextblockBackward, selectNodeBackward);
  return keymap2;
}
var KeymapManager = class {
  constructor() {
    this.#ctx = null;
    this.#keymap = [];
    this.setCtx = (ctx) => {
      this.#ctx = ctx;
    };
    this.add = (keymap2) => {
      this.#keymap.push(keymap2);
      return () => {
        this.#keymap = this.#keymap.filter((item) => item !== keymap2);
      };
    };
    this.addObjectKeymap = (keymaps) => {
      const remove = [];
      Object.entries(keymaps).forEach(([key2, command]) => {
        if (typeof command === "function") {
          const keymapItem = {
            key: key2,
            onRun: () => command
          };
          this.#keymap.push(keymapItem);
          remove.push(() => {
            this.#keymap = this.#keymap.filter((item) => item !== keymapItem);
          });
        } else {
          this.#keymap.push(command);
          remove.push(() => {
            this.#keymap = this.#keymap.filter((item) => item !== command);
          });
        }
      });
      return () => {
        remove.forEach((fn) => fn());
      };
    };
    this.addBaseKeymap = () => {
      const base = overrideBaseKeymap(baseKeymap);
      return this.addObjectKeymap(base);
    };
    this.build = () => {
      const keymap2 = {};
      this.#keymap.forEach((item) => {
        keymap2[item.key] = [...keymap2[item.key] || [], item];
      });
      return Object.fromEntries(Object.entries(keymap2).map(([key2, items]) => {
        const sortedItems = items.sort((a, b) => (b.priority ?? 50) - (a.priority ?? 50));
        const command = (state, dispatch, view) => {
          const ctx = this.#ctx;
          if (ctx == null) throw ctxCallOutOfScope();
          return chainCommands(...sortedItems.map((item) => item.onRun(ctx)))(state, dispatch, view);
        };
        return [key2, command];
      }));
    };
  }
  #ctx;
  #keymap;
  get ctx() {
    return this.#ctx;
  }
};
var keymapCtx = createSlice(new KeymapManager(), "keymap");
var keymapTimerCtx = createSlice([SchemaReady], "keymapTimer");
var KeymapReady = createTimer("KeymapReady");
var keymap = (ctx) => {
  const km = new KeymapManager();
  km.setCtx(ctx);
  ctx.inject(keymapCtx, km).inject(keymapTimerCtx, [SchemaReady]).record(KeymapReady);
  return async () => {
    await ctx.waitTimers(keymapTimerCtx);
    ctx.done(KeymapReady);
    return () => {
      ctx.remove(keymapCtx).remove(keymapTimerCtx).clearTimer(KeymapReady);
    };
  };
};
var ParserReady = createTimer("ParserReady");
var outOfScope$1 = (() => {
  throw ctxCallOutOfScope();
});
var parserCtx = createSlice(outOfScope$1, "parser");
var parserTimerCtx = createSlice([], "parserTimer");
var parser = (ctx) => {
  ctx.inject(parserCtx, outOfScope$1).inject(parserTimerCtx, [SchemaReady]).record(ParserReady);
  return async () => {
    await ctx.waitTimers(parserTimerCtx);
    const remark = ctx.get(remarkCtx);
    const schema2 = ctx.get(schemaCtx);
    ctx.set(parserCtx, ParserState.create(schema2, remark));
    ctx.done(ParserReady);
    return () => {
      ctx.remove(parserCtx).remove(parserTimerCtx).clearTimer(ParserReady);
    };
  };
};
withMeta(parser, { displayName: "Parser" });
var SerializerReady = createTimer("SerializerReady");
var serializerTimerCtx = createSlice([], "serializerTimer");
var outOfScope = (() => {
  throw ctxCallOutOfScope();
});
var serializerCtx = createSlice(outOfScope, "serializer");
var serializer = (ctx) => {
  ctx.inject(serializerCtx, outOfScope).inject(serializerTimerCtx, [SchemaReady]).record(SerializerReady);
  return async () => {
    await ctx.waitTimers(serializerTimerCtx);
    const remark = ctx.get(remarkCtx);
    const schema2 = ctx.get(schemaCtx);
    ctx.set(serializerCtx, SerializerState.create(schema2, remark));
    ctx.done(SerializerReady);
    return () => {
      ctx.remove(serializerCtx).remove(serializerTimerCtx).clearTimer(SerializerReady);
    };
  };
};
withMeta(serializer, { displayName: "Serializer" });
var defaultValueCtx = createSlice("", "defaultValue");
var editorStateOptionsCtx = createSlice((x) => x, "stateOptions");
var editorStateTimerCtx = createSlice([], "editorStateTimer");
var EditorStateReady = createTimer("EditorStateReady");
function getDoc(defaultValue, parser2, schema2) {
  if (typeof defaultValue === "string") return parser2(defaultValue);
  if (defaultValue.type === "html") return DOMParser.fromSchema(schema2).parse(defaultValue.dom);
  if (defaultValue.type === "json") return Node.fromJSON(schema2, defaultValue.value);
  throw docTypeError(defaultValue);
}
var key$1 = new PluginKey("MILKDOWN_STATE_TRACKER");
var editorState = (ctx) => {
  ctx.inject(defaultValueCtx, "").inject(editorStateCtx, {}).inject(editorStateOptionsCtx, (x) => x).inject(editorStateTimerCtx, [
    ParserReady,
    SerializerReady,
    CommandsReady,
    KeymapReady
  ]).record(EditorStateReady);
  return async () => {
    await ctx.waitTimers(editorStateTimerCtx);
    const schema2 = ctx.get(schemaCtx);
    const parser2 = ctx.get(parserCtx);
    const rules = ctx.get(inputRulesCtx);
    const optionsOverride = ctx.get(editorStateOptionsCtx);
    const prosePlugins = ctx.get(prosePluginsCtx);
    const doc = getDoc(ctx.get(defaultValueCtx), parser2, schema2);
    const km = ctx.get(keymapCtx);
    const disposeBaseKeymap = km.addBaseKeymap();
    const plugins = [
      ...prosePlugins,
      new Plugin({
        key: key$1,
        state: {
          init: () => {
          },
          apply: (_tr, _value, _oldState, newState) => {
            ctx.set(editorStateCtx, newState);
          }
        }
      }),
      customInputRules({ rules }),
      keymap$1(km.build())
    ];
    ctx.set(prosePluginsCtx, plugins);
    const options = optionsOverride({
      schema: schema2,
      doc,
      plugins
    });
    const state = EditorState.create(options);
    ctx.set(editorStateCtx, state);
    ctx.done(EditorStateReady);
    return () => {
      disposeBaseKeymap();
      ctx.remove(defaultValueCtx).remove(editorStateCtx).remove(editorStateOptionsCtx).remove(editorStateTimerCtx).clearTimer(EditorStateReady);
    };
  };
};
withMeta(editorState, { displayName: "EditorState" });
var pasteRulesCtx = createSlice([], "pasteRule");
var pasteRulesTimerCtx = createSlice([SchemaReady], "pasteRuleTimer");
var PasteRulesReady = createTimer("PasteRuleReady");
var pasteRule = (ctx) => {
  ctx.inject(pasteRulesCtx, []).inject(pasteRulesTimerCtx, [SchemaReady]).record(PasteRulesReady);
  return async () => {
    await ctx.waitTimers(pasteRulesTimerCtx);
    ctx.done(PasteRulesReady);
    return () => {
      ctx.remove(pasteRulesCtx).remove(pasteRulesTimerCtx).clearTimer(PasteRulesReady);
    };
  };
};
withMeta(pasteRule, { displayName: "PasteRule" });
var EditorViewReady = createTimer("EditorViewReady");
var editorViewTimerCtx = createSlice([], "editorViewTimer");
var editorViewOptionsCtx = createSlice({}, "editorViewOptions");
var rootCtx = createSlice(null, "root");
var rootDOMCtx = createSlice(null, "rootDOM");
var rootAttrsCtx = createSlice({}, "rootAttrs");
function createViewContainer(root, ctx) {
  const container = document.createElement("div");
  container.className = "milkdown";
  root.appendChild(container);
  ctx.set(rootDOMCtx, container);
  const attrs = ctx.get(rootAttrsCtx);
  Object.entries(attrs).forEach(([key2, value]) => container.setAttribute(key2, value));
  return container;
}
function prepareViewDom(dom) {
  dom.classList.add("editor");
  dom.setAttribute("role", "textbox");
}
var key = new PluginKey("MILKDOWN_VIEW_CLEAR");
var editorView = (ctx) => {
  ctx.inject(rootCtx, document.body).inject(editorViewCtx, {}).inject(editorViewOptionsCtx, {}).inject(rootDOMCtx, null).inject(rootAttrsCtx, {}).inject(editorViewTimerCtx, [EditorStateReady, PasteRulesReady]).record(EditorViewReady);
  return async () => {
    await ctx.wait(InitReady);
    const root = ctx.get(rootCtx) || document.body;
    const el = typeof root === "string" ? document.querySelector(root) : root;
    ctx.update(prosePluginsCtx, (xs) => [new Plugin({
      key,
      view: (editorView2) => {
        const container = el ? createViewContainer(el, ctx) : void 0;
        const handleDOM = () => {
          if (container && el) {
            const editor = editorView2.dom;
            el.replaceChild(container, editor);
            container.appendChild(editor);
          }
        };
        handleDOM();
        return { destroy: () => {
          if (container?.parentNode) container?.parentNode.replaceChild(editorView2.dom, container);
          container?.remove();
        } };
      }
    }), ...xs]);
    await ctx.waitTimers(editorViewTimerCtx);
    const state = ctx.get(editorStateCtx);
    const options = ctx.get(editorViewOptionsCtx);
    const view = new EditorView(el, {
      state,
      nodeViews: Object.fromEntries(ctx.get(nodeViewCtx)),
      markViews: Object.fromEntries(ctx.get(markViewCtx)),
      transformPasted: (slice, view2, isPlainText) => {
        ctx.get(pasteRulesCtx).sort((a, b) => (b.priority ?? 50) - (a.priority ?? 50)).map((rule) => rule.run).forEach((runner) => {
          slice = runner(slice, view2, isPlainText);
        });
        return slice;
      },
      ...options
    });
    prepareViewDom(view.dom);
    ctx.set(editorViewCtx, view);
    ctx.done(EditorViewReady);
    return () => {
      view?.destroy();
      ctx.remove(rootCtx).remove(editorViewCtx).remove(editorViewOptionsCtx).remove(rootDOMCtx).remove(rootAttrsCtx).remove(editorViewTimerCtx).clearTimer(EditorViewReady);
    };
  };
};
withMeta(editorView, { displayName: "EditorView" });
var EditorStatus = /* @__PURE__ */ (function(EditorStatus2) {
  EditorStatus2["Idle"] = "Idle";
  EditorStatus2["OnCreate"] = "OnCreate";
  EditorStatus2["Created"] = "Created";
  EditorStatus2["OnDestroy"] = "OnDestroy";
  EditorStatus2["Destroyed"] = "Destroyed";
  return EditorStatus2;
})({});
var Editor = class Editor2 {
  constructor() {
    this.#enableInspector = false;
    this.#status = "Idle";
    this.#configureList = [];
    this.#onStatusChange = () => void 0;
    this.#container = new Container();
    this.#clock = new Clock();
    this.#usrPluginStore = /* @__PURE__ */ new Map();
    this.#sysPluginStore = /* @__PURE__ */ new Map();
    this.#ctx = new Ctx(this.#container, this.#clock);
    this.#loadInternal = () => {
      const configPlugin = config(async (ctx) => {
        await Promise.all(this.#configureList.map((fn) => Promise.resolve(fn(ctx))));
      });
      const internalPlugins = [
        schema,
        parser,
        serializer,
        commands,
        keymap,
        pasteRule,
        editorState,
        editorView,
        init(this),
        configPlugin
      ];
      this.#prepare(internalPlugins, this.#sysPluginStore);
    };
    this.#prepare = (plugins, store) => {
      plugins.forEach((plugin) => {
        const ctx = this.#ctx.produce(this.#enableInspector ? plugin.meta : void 0);
        const handler = plugin(ctx);
        store.set(plugin, {
          ctx,
          handler,
          cleanup: void 0
        });
      });
    };
    this.#cleanup = (plugins, remove = false) => {
      return Promise.all([plugins].flat().map(async (plugin) => {
        const cleanup = this.#usrPluginStore.get(plugin)?.cleanup;
        if (remove) this.#usrPluginStore.delete(plugin);
        else this.#usrPluginStore.set(plugin, {
          ctx: void 0,
          handler: void 0,
          cleanup: void 0
        });
        if (typeof cleanup === "function") return cleanup();
        return cleanup;
      }));
    };
    this.#cleanupInternal = async () => {
      await Promise.all([...this.#sysPluginStore.entries()].map(async ([_, { cleanup }]) => {
        if (typeof cleanup === "function") return cleanup();
        return cleanup;
      }));
      this.#sysPluginStore.clear();
    };
    this.#setStatus = (status) => {
      this.#status = status;
      this.#onStatusChange(status);
    };
    this.#loadPluginInStore = (store) => {
      return [...store.entries()].map(async ([key2, loader]) => {
        const { ctx, handler } = loader;
        if (!handler) return;
        const cleanup = await handler();
        store.set(key2, {
          ctx,
          handler,
          cleanup
        });
      });
    };
    this.enableInspector = (enable = true) => {
      this.#enableInspector = enable;
      return this;
    };
    this.onStatusChange = (onChange) => {
      this.#onStatusChange = onChange;
      return this;
    };
    this.config = (configure) => {
      this.#configureList.push(configure);
      return this;
    };
    this.removeConfig = (configure) => {
      this.#configureList = this.#configureList.filter((x) => x !== configure);
      return this;
    };
    this.use = (plugins) => {
      const _plugins = [plugins].flat();
      _plugins.flat().forEach((plugin) => {
        this.#usrPluginStore.set(plugin, {
          ctx: void 0,
          handler: void 0,
          cleanup: void 0
        });
      });
      if (this.#status === "Created") this.#prepare(_plugins, this.#usrPluginStore);
      return this;
    };
    this.remove = async (plugins) => {
      if (this.#status === "OnCreate") {
        console.warn("[Milkdown]: You are trying to remove plugins when the editor is creating, this is not recommended, please check your code.");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.remove(plugins));
          }, 50);
        });
      }
      await this.#cleanup([plugins].flat(), true);
      return this;
    };
    this.create = async () => {
      if (this.#status === "OnCreate") return this;
      if (this.#status === "Created") await this.destroy();
      this.#setStatus("OnCreate");
      this.#loadInternal();
      this.#prepare([...this.#usrPluginStore.keys()], this.#usrPluginStore);
      await Promise.all([this.#loadPluginInStore(this.#sysPluginStore), this.#loadPluginInStore(this.#usrPluginStore)].flat());
      this.#setStatus("Created");
      return this;
    };
    this.destroy = async (clearPlugins = false) => {
      if (this.#status === "Destroyed" || this.#status === "OnDestroy") return this;
      if (this.#status === "OnCreate") return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.destroy(clearPlugins));
        }, 50);
      });
      if (clearPlugins) this.#configureList = [];
      this.#setStatus("OnDestroy");
      await this.#cleanup([...this.#usrPluginStore.keys()], clearPlugins);
      await this.#cleanupInternal();
      this.#setStatus("Destroyed");
      return this;
    };
    this.action = (action) => action(this.#ctx);
    this.inspect = () => {
      if (!this.#enableInspector) {
        console.warn("[Milkdown]: You are trying to collect inspection when inspector is disabled, please enable inspector by `editor.enableInspector()` first.");
        return [];
      }
      return [...this.#sysPluginStore.values(), ...this.#usrPluginStore.values()].map(({ ctx }) => ctx?.inspector?.read()).filter((x) => Boolean(x));
    };
  }
  static make() {
    return new Editor2();
  }
  #enableInspector;
  #status;
  #configureList;
  #onStatusChange;
  #container;
  #clock;
  #usrPluginStore;
  #sysPluginStore;
  #ctx;
  #loadInternal;
  #prepare;
  #cleanup;
  #cleanupInternal;
  #setStatus;
  #loadPluginInStore;
  get ctx() {
    return this.#ctx;
  }
  get status() {
    return this.#status;
  }
};
export {
  CommandsReady as C,
  EditorViewReady as E,
  InitReady as I,
  KeymapReady as K,
  SchemaReady as S,
  serializerCtx as a,
  pasteRulesCtx as b,
  commandsCtx as c,
  nodesCtx as d,
  editorViewCtx as e,
  createCmdKey as f,
  marksCtx as g,
  parserCtx as h,
  inputRulesCtx as i,
  remarkStringifyOptionsCtx as j,
  keymapCtx as k,
  editorViewOptionsCtx as l,
  markViewCtx as m,
  nodeViewCtx as n,
  SerializerReady as o,
  prosePluginsCtx as p,
  EditorStatus as q,
  remarkPluginsCtx as r,
  schemaCtx as s,
  Editor as t,
  rootCtx as u,
  defaultValueCtx as v,
  editorCtx as w
};
