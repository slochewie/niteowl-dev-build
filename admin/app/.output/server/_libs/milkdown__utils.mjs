import { e as editorViewCtx, s as schemaCtx, a as serializerCtx, K as KeymapReady, k as keymapCtx, S as SchemaReady, p as prosePluginsCtx, i as inputRulesCtx, C as CommandsReady, c as commandsCtx, b as pasteRulesCtx, I as InitReady, r as remarkPluginsCtx, n as nodeViewCtx, m as markViewCtx, d as nodesCtx, f as createCmdKey, g as marksCtx } from "./milkdown__core.mjs";
import { c as createSlice } from "./milkdown__ctx.mjs";
import { c as customAlphabet } from "./nanoid.mjs";
import { m as missingNodeInSchema, h as missingMarkInSchema } from "./milkdown__exception.mjs";
import { d as NodeType } from "./prosemirror-model.mjs";
customAlphabet("abcedfghicklmn", 10);
function $command(key, cmd) {
  const cmdKey = createCmdKey(key);
  const plugin = (ctx) => async () => {
    plugin.key = cmdKey;
    await ctx.wait(CommandsReady);
    const command = cmd(ctx);
    ctx.get(commandsCtx).create(cmdKey, command);
    plugin.run = (payload) => ctx.get(commandsCtx).call(key, payload);
    return () => {
      ctx.get(commandsCtx).remove(cmdKey);
    };
  };
  return plugin;
}
function $inputRule(inputRule) {
  const plugin = (ctx) => async () => {
    await ctx.wait(SchemaReady);
    const ir = inputRule(ctx);
    ctx.update(inputRulesCtx, (irs) => [...irs, ir]);
    plugin.inputRule = ir;
    return () => {
      ctx.update(inputRulesCtx, (irs) => irs.filter((x) => x !== ir));
    };
  };
  return plugin;
}
function $pasteRule(pasteRule) {
  const plugin = (ctx) => async () => {
    await ctx.wait(SchemaReady);
    const pr = pasteRule(ctx);
    ctx.update(pasteRulesCtx, (prs) => [...prs, pr]);
    plugin.pasteRule = pr;
    return () => {
      ctx.update(pasteRulesCtx, (prs) => prs.filter((x) => x !== pr));
    };
  };
  return plugin;
}
function $mark(id, schema) {
  const plugin = (ctx) => async () => {
    const markSchema = schema(ctx);
    ctx.update(marksCtx, (ns) => [...ns.filter((n) => n[0] !== id), [id, markSchema]]);
    plugin.id = id;
    plugin.schema = markSchema;
    return () => {
      ctx.update(marksCtx, (ns) => ns.filter(([x]) => x !== id));
    };
  };
  plugin.type = (ctx) => {
    const markType = ctx.get(schemaCtx).marks[id];
    if (!markType) throw missingMarkInSchema(id);
    return markType;
  };
  return plugin;
}
function $node(id, schema) {
  const plugin = (ctx) => async () => {
    const nodeSchema = schema(ctx);
    ctx.update(nodesCtx, (ns) => [...ns.filter((n) => n[0] !== id), [id, nodeSchema]]);
    plugin.id = id;
    plugin.schema = nodeSchema;
    return () => {
      ctx.update(nodesCtx, (ns) => ns.filter(([x]) => x !== id));
    };
  };
  plugin.type = (ctx) => {
    const nodeType = ctx.get(schemaCtx).nodes[id];
    if (!nodeType) throw missingNodeInSchema(id);
    return nodeType;
  };
  return plugin;
}
function $prose(prose) {
  let prosePlugin;
  const plugin = (ctx) => async () => {
    await ctx.wait(SchemaReady);
    prosePlugin = prose(ctx);
    ctx.update(prosePluginsCtx, (ps) => [...ps, prosePlugin]);
    return () => {
      ctx.update(prosePluginsCtx, (ps) => ps.filter((x) => x !== prosePlugin));
    };
  };
  plugin.plugin = () => prosePlugin;
  plugin.key = () => prosePlugin.spec.key;
  return plugin;
}
function $shortcut(shortcut) {
  const plugin = (ctx) => async () => {
    await ctx.wait(KeymapReady);
    const km = ctx.get(keymapCtx);
    const keymap = shortcut(ctx);
    const dispose = km.addObjectKeymap(keymap);
    plugin.keymap = keymap;
    return () => {
      dispose();
    };
  };
  return plugin;
}
function $view(type, view) {
  const plugin = (ctx) => async () => {
    await ctx.wait(SchemaReady);
    const v = view(ctx);
    if (type.type(ctx) instanceof NodeType) ctx.update(nodeViewCtx, (ps) => [...ps, [type.id, v]]);
    else ctx.update(markViewCtx, (ps) => [...ps, [type.id, v]]);
    plugin.view = v;
    plugin.type = type;
    return () => {
      if (type.type(ctx) instanceof NodeType) ctx.update(nodeViewCtx, (ps) => ps.filter((x) => x[0] !== type.id));
      else ctx.update(markViewCtx, (ps) => ps.filter((x) => x[0] !== type.id));
    };
  };
  return plugin;
}
function $ctx(value, name) {
  const slice = createSlice(value, name);
  const plugin = (ctx) => {
    ctx.inject(slice);
    return () => {
      return () => {
        ctx.remove(slice);
      };
    };
  };
  plugin.key = slice;
  return plugin;
}
function $nodeSchema(id, schema) {
  const schemaCtx2 = $ctx(schema, id);
  const nodeSchema = $node(id, (ctx) => {
    return ctx.get(schemaCtx2.key)(ctx);
  });
  const result = [schemaCtx2, nodeSchema];
  result.id = nodeSchema.id;
  result.node = nodeSchema;
  result.type = (ctx) => nodeSchema.type(ctx);
  result.ctx = schemaCtx2;
  result.key = schemaCtx2.key;
  result.extendSchema = (handler) => {
    return $nodeSchema(id, handler(schema));
  };
  return result;
}
function $markSchema(id, schema) {
  const schemaCtx2 = $ctx(schema, id);
  const markSchema = $mark(id, (ctx) => {
    return ctx.get(schemaCtx2.key)(ctx);
  });
  const result = [schemaCtx2, markSchema];
  result.id = markSchema.id;
  result.mark = markSchema;
  result.type = (ctx) => markSchema.type(ctx);
  result.ctx = schemaCtx2;
  result.key = schemaCtx2.key;
  result.extendSchema = (handler) => {
    return $markSchema(id, handler(schema));
  };
  return result;
}
function $useKeymap(name, userKeymap) {
  const keymapDef = $ctx(Object.fromEntries(Object.entries(userKeymap).map(([key, { shortcuts: shortcuts2, priority }]) => {
    return [key, {
      shortcuts: shortcuts2,
      priority
    }];
  })), `${name}Keymap`);
  const shortcuts = $shortcut((ctx) => {
    const keys = ctx.get(keymapDef.key);
    const keymapTuple = Object.entries(userKeymap).flatMap(([key, { command }]) => {
      const target = keys[key];
      const targetKeys = [target.shortcuts].flat();
      const priority = target.priority;
      return targetKeys.map((targetKey) => [targetKey, {
        key: targetKey,
        onRun: command,
        priority
      }]);
    });
    return Object.fromEntries(keymapTuple);
  });
  const result = [keymapDef, shortcuts];
  result.ctx = keymapDef;
  result.shortcuts = shortcuts;
  result.key = keymapDef.key;
  result.keymap = shortcuts.keymap;
  return result;
}
var $nodeAttr = (name, value = () => ({})) => $ctx(value, `${name}Attr`);
var $markAttr = (name, value = () => ({})) => $ctx(value, `${name}Attr`);
function $remark(id, remark, initialOptions) {
  const options = $ctx({}, id);
  const plugin = (ctx) => async () => {
    await ctx.wait(InitReady);
    const remarkPlugin = {
      plugin: remark(ctx),
      options: ctx.get(options.key)
    };
    ctx.update(remarkPluginsCtx, (rp) => [...rp, remarkPlugin]);
    return () => {
      ctx.update(remarkPluginsCtx, (rp) => rp.filter((x) => x !== remarkPlugin));
    };
  };
  const result = [options, plugin];
  result.id = id;
  result.plugin = plugin;
  result.options = options;
  return result;
}
function getMarkdown(range) {
  return (ctx) => {
    const view = ctx.get(editorViewCtx);
    ctx.get(schemaCtx);
    const serializer = ctx.get(serializerCtx);
    return serializer(view.state.doc);
  };
}
export {
  $ctx as $,
  $prose as a,
  $command as b,
  $remark as c,
  $nodeSchema as d,
  $view as e,
  $inputRule as f,
  $node as g,
  $nodeAttr as h,
  $markAttr as i,
  $markSchema as j,
  $useKeymap as k,
  $pasteRule as l,
  $shortcut as m,
  getMarkdown as n
};
