import { c as commandsCtx } from "./milkdown__core.mjs";
import { $ as $ctx, a as $prose, k as $useKeymap, b as $command } from "./milkdown__utils.mjs";
import { u as undo, r as redo, h as history$1 } from "./prosemirror-history.mjs";
function withMeta(plugin, meta) {
  Object.assign(plugin, { meta: {
    package: "@milkdown/plugin-history",
    ...meta
  } });
  return plugin;
}
var undoCommand = $command("Undo", () => () => undo);
withMeta(undoCommand, { displayName: "Command<undo>" });
var redoCommand = $command("Redo", () => () => redo);
withMeta(redoCommand, { displayName: "Command<redo>" });
var historyProviderConfig = $ctx({}, "historyProviderConfig");
withMeta(historyProviderConfig, { displayName: "Ctx<historyProviderConfig>" });
var historyProviderPlugin = $prose((ctx) => history$1(ctx.get(historyProviderConfig.key)));
withMeta(historyProviderPlugin, { displayName: "Ctx<historyProviderPlugin>" });
var historyKeymap = $useKeymap("historyKeymap", {
  Undo: {
    shortcuts: "Mod-z",
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(undoCommand.key);
    }
  },
  Redo: {
    shortcuts: ["Mod-y", "Shift-Mod-z"],
    command: (ctx) => {
      const commands = ctx.get(commandsCtx);
      return () => commands.call(redoCommand.key);
    }
  }
});
withMeta(historyKeymap.ctx, { displayName: "KeymapCtx<history>" });
withMeta(historyKeymap.shortcuts, { displayName: "Keymap<history>" });
var history = [
  historyProviderConfig,
  historyProviderPlugin,
  historyKeymap,
  undoCommand,
  redoCommand
].flat();
export {
  history as h
};
