import require$$2 from "node:os";
import { r as requireZod } from "../zod.mjs";
import require$$0 from "node:fs";
import minpath from "node:path";
import { r as requireLib } from "../xdg-app-paths.mjs";
var dist = {};
var types = {};
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types;
  hasRequiredTypes = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_CRED_STORAGE = exports.CRED_STORAGE_VALUES = exports.CRED_STORAGE_CONFIG_VALUES = void 0;
    exports.CRED_STORAGE_CONFIG_VALUES = [
      "auto",
      "file",
      "keyring"
    ];
    exports.CRED_STORAGE_VALUES = exports.CRED_STORAGE_CONFIG_VALUES.filter((storage) => storage !== "auto");
    exports.DEFAULT_CRED_STORAGE = "file";
  })(types);
  return types;
}
var schema = {};
var schema_zod = {};
var hasRequiredSchema_zod;
function requireSchema_zod() {
  if (hasRequiredSchema_zod) return schema_zod;
  hasRequiredSchema_zod = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalConfigSchema = exports.authFileConfigSchema = exports.authConfigSchema = exports.credStorageSchema = exports.updatesConfigSchema = exports.guidanceConfigSchema = exports.telemetryConfigSchema = void 0;
    const zod_1 = /* @__PURE__ */ requireZod();
    exports.telemetryConfigSchema = zod_1.z.object({
      enabled: zod_1.z.boolean().optional()
    });
    exports.guidanceConfigSchema = zod_1.z.object({
      enabled: zod_1.z.boolean().optional()
    });
    exports.updatesConfigSchema = zod_1.z.object({
      auto: zod_1.z.boolean().optional()
    });
    exports.credStorageSchema = zod_1.z.union([
      zod_1.z.literal("auto"),
      zod_1.z.literal("file"),
      zod_1.z.literal("keyring")
    ]);
    exports.authConfigSchema = zod_1.z.object({
      "// Note": zod_1.z.string().optional(),
      "// Docs": zod_1.z.string().optional(),
      skipWrite: zod_1.z.boolean().optional(),
      token: zod_1.z.string().optional(),
      userId: zod_1.z.string().optional(),
      refreshToken: zod_1.z.string().optional(),
      expiresAt: zod_1.z.number().optional(),
      tokenSource: zod_1.z.union([zod_1.z.literal("flag"), zod_1.z.literal("env")]).optional()
    });
    exports.authFileConfigSchema = exports.authConfigSchema.omit({
      tokenSource: true
    });
    exports.globalConfigSchema = zod_1.z.object({
      "// Note": zod_1.z.string().optional(),
      "// Docs": zod_1.z.string().optional(),
      credStorage: exports.credStorageSchema.optional(),
      currentTeam: zod_1.z.string().optional(),
      api: zod_1.z.string().optional(),
      telemetry: exports.telemetryConfigSchema.optional(),
      guidance: exports.guidanceConfigSchema.optional(),
      updates: exports.updatesConfigSchema.optional(),
      useNativeBinary: zod_1.z.boolean().optional()
    });
  })(schema_zod);
  return schema_zod;
}
var hasRequiredSchema;
function requireSchema() {
  if (hasRequiredSchema) return schema;
  hasRequiredSchema = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.authConfigSchema = exports.globalConfigSchema = exports.credStorageSchema = exports.updatesConfigSchema = exports.guidanceConfigSchema = exports.telemetryConfigSchema = void 0;
    const zod_1 = /* @__PURE__ */ requireZod();
    const schema_zod_1 = requireSchema_zod();
    const types_1 = requireTypes();
    function formatCredStorageError(value) {
      return `Invalid value for \`credStorage\`: ${JSON.stringify(value)}. Expected one of: ${types_1.CRED_STORAGE_CONFIG_VALUES.map((storage) => JSON.stringify(storage)).join(", ")}.`;
    }
    exports.telemetryConfigSchema = schema_zod_1.telemetryConfigSchema.passthrough();
    exports.guidanceConfigSchema = schema_zod_1.guidanceConfigSchema.passthrough();
    exports.updatesConfigSchema = schema_zod_1.updatesConfigSchema.passthrough();
    exports.credStorageSchema = zod_1.z.enum(types_1.CRED_STORAGE_CONFIG_VALUES, {
      error: (issue) => {
        return formatCredStorageError(issue.input);
      }
    }).optional();
    exports.globalConfigSchema = schema_zod_1.globalConfigSchema.extend({
      credStorage: exports.credStorageSchema,
      telemetry: exports.telemetryConfigSchema.optional(),
      guidance: exports.guidanceConfigSchema.optional(),
      updates: exports.updatesConfigSchema.optional()
    }).passthrough();
    exports.authConfigSchema = schema_zod_1.authConfigSchema.passthrough();
  })(schema);
  return schema;
}
var cliConfig = {};
var paths = {};
var hasRequiredPaths;
function requirePaths() {
  if (hasRequiredPaths) return paths;
  hasRequiredPaths = 1;
  var __importDefault = paths && paths.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(paths, "__esModule", { value: true });
  paths.getGlobalPathConfig = getGlobalPathConfig;
  paths.getConfigFilePath = getConfigFilePath;
  paths.getAuthConfigFilePath = getAuthConfigFilePath;
  paths.readGlobalConfigFlag = readGlobalConfigFlag;
  const node_fs_1 = __importDefault(require$$0);
  const node_path_1 = __importDefault(minpath);
  const node_os_1 = require$$2;
  const xdg_app_paths_1 = __importDefault(requireLib());
  function isReadableDirectory(targetPath) {
    try {
      return node_fs_1.default.lstatSync(targetPath).isDirectory();
    } catch (_) {
      return false;
    }
  }
  function getGlobalPathConfig() {
    const vercelDirectories = (0, xdg_app_paths_1.default)("com.vercel.cli").dataDirs();
    const possibleConfigPaths = [
      ...vercelDirectories,
      // latest vercel directory
      node_path_1.default.join((0, node_os_1.homedir)(), ".now"),
      // legacy config in user's home directory
      ...(0, xdg_app_paths_1.default)("now").dataDirs()
      // legacy XDG directory
    ];
    return possibleConfigPaths.find((configPath) => isReadableDirectory(configPath)) || vercelDirectories[0];
  }
  function getConfigFilePath(configDir) {
    return node_path_1.default.join(configDir, "config.json");
  }
  function getAuthConfigFilePath(configDir) {
    return node_path_1.default.join(configDir, "auth.json");
  }
  function readGlobalConfigFlag(configPath, key) {
    try {
      const content = node_fs_1.default.readFileSync(configPath, "utf8").replace(/^\uFEFF/, "");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        return parsed[key];
      }
    } catch {
    }
    return void 0;
  }
  return paths;
}
var hasRequiredCliConfig;
function requireCliConfig() {
  if (hasRequiredCliConfig) return cliConfig;
  hasRequiredCliConfig = 1;
  (function(exports) {
    var __importDefault = cliConfig && cliConfig.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultAuthConfig = exports.defaultGlobalConfig = exports.getGlobalPathConfig = exports.getConfigFilePath = exports.getAuthConfigFilePath = void 0;
    exports.getDefaultAuthConfig = getDefaultAuthConfig;
    exports.parseGlobalConfig = parseGlobalConfig;
    exports.parseAuthConfig = parseAuthConfig;
    exports.parseAuthFileConfig = parseAuthFileConfig;
    exports.readConfigFile = readConfigFile;
    exports.writeConfigFile = writeConfigFile;
    exports.readGlobalConfigFile = readGlobalConfigFile;
    exports.writeGlobalConfigFile = writeGlobalConfigFile;
    exports.readAuthConfigFile = readAuthConfigFile;
    exports.readAuthFileConfig = readAuthFileConfig;
    exports.readAuthConfig = readAuthConfig;
    exports.tryReadAuthConfig = tryReadAuthConfig;
    exports.writeAuthConfigFile = writeAuthConfigFile;
    exports.writeAuthConfig = writeAuthConfig;
    exports.deleteAuthConfigFile = deleteAuthConfigFile;
    exports.deleteAuthConfig = deleteAuthConfig;
    const node_fs_1 = __importDefault(require$$0);
    const node_path_1 = __importDefault(minpath);
    const zod_1 = /* @__PURE__ */ requireZod();
    const schema_1 = requireSchema();
    const paths_1 = requirePaths();
    Object.defineProperty(exports, "getAuthConfigFilePath", { enumerable: true, get: function() {
      return paths_1.getAuthConfigFilePath;
    } });
    Object.defineProperty(exports, "getConfigFilePath", { enumerable: true, get: function() {
      return paths_1.getConfigFilePath;
    } });
    Object.defineProperty(exports, "getGlobalPathConfig", { enumerable: true, get: function() {
      return paths_1.getGlobalPathConfig;
    } });
    const DOCS_URL = "https://vercel.com/docs/projects/project-configuration/global-configuration";
    exports.defaultGlobalConfig = {
      "// Note": "This is your Vercel config file. For more information see the global configuration documentation.",
      "// Docs": `${DOCS_URL}#config.json`
    };
    function getDefaultAuthConfig() {
      return {
        "// Note": "This is your Vercel credentials file. DO NOT SHARE!",
        "// Docs": `${DOCS_URL}#auth.json`
      };
    }
    exports.defaultAuthConfig = getDefaultAuthConfig();
    function normalizeConfigError(error) {
      if (error instanceof zod_1.z.ZodError) {
        const credStorageIssue = error.issues.find((issue) => issue.path[0] === "credStorage");
        if (credStorageIssue) {
          throw new Error(credStorageIssue.message);
        }
      }
      throw error;
    }
    function parseGlobalConfig(value) {
      try {
        return schema_1.globalConfigSchema.parse(value);
      } catch (error) {
        normalizeConfigError(error);
      }
    }
    function parseAuthConfig(value) {
      return schema_1.authConfigSchema.parse(value);
    }
    function parseAuthFileConfig(value) {
      const { tokenSource, ...authConfig } = parseAuthConfig(value);
      return authConfig;
    }
    function readJsonFileSync(filePath) {
      const content = node_fs_1.default.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
      return JSON.parse(content);
    }
    function writeJsonFileSync(filePath, value, options = {}) {
      const directory = node_path_1.default.dirname(filePath);
      const tempFilePath = node_path_1.default.join(directory, `.${node_path_1.default.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
      const content = `${JSON.stringify(value, null, options.indent ?? 2)}
`;
      node_fs_1.default.mkdirSync(directory, { recursive: true });
      try {
        node_fs_1.default.writeFileSync(tempFilePath, content, {
          encoding: "utf8",
          mode: options.mode
        });
        node_fs_1.default.renameSync(tempFilePath, filePath);
      } catch (error) {
        try {
          node_fs_1.default.rmSync(tempFilePath, { force: true });
        } catch {
        }
        throw error;
      }
    }
    function readConfigFile(configPath, schema2) {
      return schema2.parse(readJsonFileSync(configPath));
    }
    function writeConfigFile(configPath, schema2, config, options) {
      const normalizedConfig = zod_1.z.encode(schema2, config);
      writeJsonFileSync(configPath, normalizedConfig, {
        indent: 2,
        ...options
      });
    }
    function readGlobalConfigFile(configPath) {
      try {
        return readConfigFile(configPath, schema_1.globalConfigSchema);
      } catch (error) {
        normalizeConfigError(error);
      }
    }
    function writeGlobalConfigFile(configPath, config) {
      writeConfigFile(configPath, schema_1.globalConfigSchema, config);
    }
    function readAuthConfigFile(configPath) {
      return readConfigFile(configPath, schema_1.authConfigSchema);
    }
    function readAuthFileConfig(configPath) {
      return parseAuthFileConfig(readJsonFileSync(configPath));
    }
    function readAuthConfig(configDir) {
      return readAuthConfigFile((0, paths_1.getAuthConfigFilePath)(configDir));
    }
    function tryReadAuthConfig(configDir) {
      try {
        return readAuthConfig(configDir);
      } catch {
        return null;
      }
    }
    function writeAuthConfigFile(configPath, authConfig) {
      if (authConfig.skipWrite) {
        return;
      }
      writeConfigFile(configPath, schema_1.authConfigSchema, authConfig, {
        mode: 384
      });
    }
    function writeAuthConfig(configDir, authConfig) {
      writeAuthConfigFile((0, paths_1.getAuthConfigFilePath)(configDir), authConfig);
    }
    function deleteAuthConfigFile(configPath) {
      node_fs_1.default.rmSync(configPath, { force: true });
    }
    function deleteAuthConfig(configDir) {
      deleteAuthConfigFile((0, paths_1.getAuthConfigFilePath)(configDir));
    }
  })(cliConfig);
  return cliConfig;
}
var credStorage = {};
var hasRequiredCredStorage;
function requireCredStorage() {
  if (hasRequiredCredStorage) return credStorage;
  hasRequiredCredStorage = 1;
  Object.defineProperty(credStorage, "__esModule", { value: true });
  credStorage.authConfigHasUsableTokenData = authConfigHasUsableTokenData;
  credStorage.getLikelyEffectiveCredStorage = getLikelyEffectiveCredStorage;
  const types_1 = requireTypes();
  const cli_config_1 = requireCliConfig();
  const TOKEN_STORAGE_ENV = "VERCEL_TOKEN_STORAGE";
  function isErrnoException(error) {
    return typeof error === "object" && error !== null && "code" in error;
  }
  function isCredStorage(value) {
    return types_1.CRED_STORAGE_CONFIG_VALUES.includes(value);
  }
  function formatCredStorageError(value, source) {
    return `Invalid value for \`${source}\`: ${JSON.stringify(value)}. Expected one of: ${types_1.CRED_STORAGE_CONFIG_VALUES.map((storage) => JSON.stringify(storage)).join(", ")}.`;
  }
  function parseCredStorage(value, source = "credStorage") {
    if (typeof value === "undefined") {
      return void 0;
    }
    if (isCredStorage(value)) {
      return value;
    }
    throw new Error(formatCredStorageError(value, source));
  }
  function authConfigHasUsableTokenData(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    const authConfig = value;
    return typeof authConfig.token === "string" && authConfig.token.length > 0 || typeof authConfig.refreshToken === "string" && authConfig.refreshToken.length > 0;
  }
  function getLikelyAutoCredStorage(configDir) {
    try {
      return authConfigHasUsableTokenData((0, cli_config_1.readAuthConfigFile)((0, cli_config_1.getAuthConfigFilePath)(configDir))) ? "file" : "keyring";
    } catch {
      return "keyring";
    }
  }
  function getLikelyConfiguredCredStorage(configDir, credStorage2) {
    if (credStorage2 === "keyring") {
      return "keyring";
    }
    if (credStorage2 !== "auto") {
      return types_1.DEFAULT_CRED_STORAGE;
    }
    return getLikelyAutoCredStorage(configDir);
  }
  function getLikelyEffectiveCredStorage(configDir) {
    let config = {};
    const credStorageOverride = process.env[TOKEN_STORAGE_ENV];
    if (typeof credStorageOverride !== "undefined") {
      return getLikelyConfiguredCredStorage(configDir, parseCredStorage(credStorageOverride, TOKEN_STORAGE_ENV));
    }
    try {
      const parsed = (0, cli_config_1.readGlobalConfigFile)((0, cli_config_1.getConfigFilePath)(configDir));
      config = {
        ...parsed,
        credStorage: parseCredStorage(parsed.credStorage)
      };
    } catch (error) {
      if (!(isErrnoException(error) && error.code === "ENOENT")) {
        throw error;
      }
    }
    return getLikelyConfiguredCredStorage(configDir, config.credStorage);
  }
  return credStorage;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function(exports) {
    var __createBinding = dist && dist.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = dist && dist.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireTypes(), exports);
    __exportStar(requireSchema(), exports);
    __exportStar(requireCliConfig(), exports);
    __exportStar(requireCredStorage(), exports);
  })(dist);
  return dist;
}
export {
  requireDist as r
};
