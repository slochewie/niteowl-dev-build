import require$$0 from "path";
import { r as requireLib$1 } from "./os-paths.mjs";
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  const path = require$$0;
  const osPaths = requireLib$1();
  const linux = () => {
    const object = {};
    object.cache = () => process.env.XDG_CACHE_HOME || path.join(osPaths.home() || osPaths.temp(), ".cache");
    object.config = () => process.env.XDG_CONFIG_HOME || path.join(osPaths.home() || osPaths.temp(), ".config");
    object.data = () => process.env.XDG_DATA_HOME || path.join(osPaths.home() || osPaths.temp(), ".local", "share");
    object.runtime = () => process.env.XDG_RUNTIME_DIR || void 0;
    object.state = () => process.env.XDG_STATE_HOME || path.join(osPaths.home() || osPaths.temp(), ".local", "state");
    return object;
  };
  const macos = () => {
    const object = {};
    object.cache = () => process.env.XDG_CACHE_HOME || path.join(path.join(osPaths.home() || osPaths.temp(), "Library"), "Caches");
    object.config = () => process.env.XDG_CONFIG_HOME || path.join(path.join(osPaths.home() || osPaths.temp(), "Library"), "Preferences");
    object.data = () => process.env.XDG_DATA_HOME || path.join(path.join(osPaths.home() || osPaths.temp(), "Library"), "Application Support");
    object.runtime = () => process.env.XDG_RUNTIME_DIR || void 0;
    object.state = () => process.env.XDG_STATE_HOME || path.join(path.join(osPaths.home() || osPaths.temp(), "Library"), "State");
    return object;
  };
  const windows = () => {
    const object = {};
    object.cache = () => {
      const localAppData = process.env.LOCALAPPDATA || path.join(osPaths.home() || osPaths.temp(), "AppData", "Local");
      return process.env.XDG_CACHE_HOME || path.join(localAppData, "xdg.cache");
    };
    object.config = () => {
      const appData = process.env.APPDATA || path.join(osPaths.home() || osPaths.temp(), "AppData", "Roaming");
      return process.env.XDG_CONFIG_HOME || path.join(appData, "xdg.config");
    };
    object.data = () => {
      const appData = process.env.APPDATA || path.join(osPaths.home() || osPaths.temp(), "AppData", "Roaming");
      return process.env.XDG_DATA_HOME || path.join(appData, "xdg.data");
    };
    object.runtime = () => process.env.XDG_RUNTIME_DIR || void 0;
    object.state = () => {
      const localAppData = process.env.LOCALAPPDATA || path.join(osPaths.home() || osPaths.temp(), "AppData", "Local");
      return process.env.XDG_STATE_HOME || path.join(localAppData, "xdg.state");
    };
    return object;
  };
  const _XDGPortable = () => {
    const XDGPortable = function() {
      return _XDGPortable();
    };
    let extension = {};
    if (/^darwin$/i.test(process.platform)) {
      extension = macos();
    } else if (/^win/i.test(process.platform)) {
      extension = windows();
    } else {
      extension = linux();
    }
    extension.configDirs = () => {
      const dirs = [];
      dirs.push(extension.config());
      if (process.env.XDG_CONFIG_DIRS) {
        dirs.push(...process.env.XDG_CONFIG_DIRS.split(path.delimiter));
      }
      return dirs;
    };
    extension.dataDirs = () => {
      const dirs = [];
      dirs.push(extension.data());
      if (process.env.XDG_DATA_DIRS) {
        dirs.push(...process.env.XDG_DATA_DIRS.split(path.delimiter));
      }
      return dirs;
    };
    Object.keys(extension).forEach((key) => {
      XDGPortable[key] = extension[key];
    });
    return XDGPortable;
  };
  lib = _XDGPortable();
  return lib;
}
export {
  requireLib as r
};
