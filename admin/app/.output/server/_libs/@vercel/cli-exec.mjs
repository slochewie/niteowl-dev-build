import require$$0 from "node:fs/promises";
import minpath from "node:path";
import { r as requireExeca } from "../execa.mjs";
var errors;
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var errors_exports = {};
  __export(errors_exports, {
    VercelCliError: () => VercelCliError,
    assertValidCwd: () => assertValidCwd,
    getCliNotFoundMessage: () => getCliNotFoundMessage,
    toVercelCliError: () => toVercelCliError
  });
  errors = __toCommonJS(errors_exports);
  var import_promises2 = require$$0;
  class VercelCliError extends Error {
    constructor(options) {
      super(options.message);
      this.name = "VercelCliError";
      this.code = options.code;
      this.invocation = options.invocation;
      this.stdout = options.stdout;
      this.stderr = options.stderr;
      this.exitCode = options.exitCode;
      if (options.cause !== void 0) {
        this.cause = options.cause;
      }
    }
  }
  function getCliNotFoundMessage(diagnostics) {
    const details = [];
    const { localBinSearch } = diagnostics;
    if (localBinSearch.stopReason === "project-root-marker") {
      details.push(
        `Local bin lookup stopped at ${JSON.stringify(localBinSearch.stoppedAt)} (${JSON.stringify(localBinSearch.markerPath)}).`
      );
    } else if (localBinSearch.stopReason === "filesystem-root") {
      details.push(
        `No project root marker was found from ${JSON.stringify(localBinSearch.searchRoot)}; local bin lookup reached the filesystem root.`
      );
    }
    for (const skippedNodeModules of localBinSearch.skippedNodeModules) {
      details.push(
        `Skipped ${JSON.stringify(skippedNodeModules.directory)}: ${skippedNodeModules.reason}.`
      );
    }
    for (const skippedLocalBin of diagnostics.skippedLocalBins) {
      details.push(
        `Skipped ${JSON.stringify(skippedLocalBin.candidate)}: ${skippedLocalBin.reason}.`
      );
    }
    if (details.length === 0) {
      return "Unable to find a usable Vercel CLI installation.";
    }
    return ["Unable to find a usable Vercel CLI installation.", ...details].join(
      "\n"
    );
  }
  async function assertValidCwd(cwd) {
    try {
      if (!(await (0, import_promises2.stat)(cwd)).isDirectory()) {
        throw new Error("not a directory");
      }
    } catch {
      throw new VercelCliError({
        code: "VERCEL_CLI_INVALID_CWD",
        message: `Working directory ${JSON.stringify(cwd)} does not exist or is not a directory.`
      });
    }
  }
  function toVercelCliError(invocation, error) {
    if (typeof error === "object" && error !== null) {
      const execaError = error;
      if (execaError.code === "ENOENT") {
        return new VercelCliError({
          code: "VERCEL_CLI_NOT_FOUND",
          message: `Unable to find Vercel CLI command ${JSON.stringify(invocation.command)}.`,
          invocation,
          cause: error
        });
      }
      if (execaError.code === "EACCES" || execaError.code === "EPERM") {
        return new VercelCliError({
          code: "VERCEL_CLI_PERMISSION_DENIED",
          message: `Permission denied while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
          invocation,
          cause: error
        });
      }
      if (execaError.timedOut) {
        return new VercelCliError({
          code: "VERCEL_CLI_TIMED_OUT",
          message: `Timed out while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
          invocation,
          stdout: execaError.stdout,
          stderr: execaError.stderr,
          cause: error
        });
      }
      if (execaError.isCanceled) {
        return new VercelCliError({
          code: "VERCEL_CLI_CANCELED",
          message: `Canceled while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
          invocation,
          stdout: execaError.stdout,
          stderr: execaError.stderr,
          cause: error
        });
      }
      if (execaError.signal) {
        return new VercelCliError({
          code: "VERCEL_CLI_SIGNALED",
          message: `Vercel CLI command ${JSON.stringify(invocation.command)} exited due to signal ${execaError.signal}.`,
          invocation,
          stdout: execaError.stdout,
          stderr: execaError.stderr,
          cause: error
        });
      }
      if (typeof execaError.exitCode === "number") {
        return new VercelCliError({
          code: "VERCEL_CLI_ERRORED",
          message: execaError.shortMessage ?? execaError.message ?? `Vercel CLI command ${JSON.stringify(invocation.command)} exited with code ${execaError.exitCode}.`,
          invocation,
          stdout: execaError.stdout,
          stderr: execaError.stderr,
          exitCode: execaError.exitCode,
          cause: error
        });
      }
    }
    return new VercelCliError({
      code: "VERCEL_CLI_EXEC_FAILED",
      message: `Could not execute Vercel CLI command ${JSON.stringify(invocation.command)}.`,
      invocation,
      cause: error
    });
  }
  return errors;
}
var envpath;
var hasRequiredEnvpath;
function requireEnvpath() {
  if (hasRequiredEnvpath) return envpath;
  hasRequiredEnvpath = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var envpath_exports = {};
  __export(envpath_exports, {
    getEnvPath: () => getEnvPath,
    prependPathEntries: () => prependPathEntries,
    setEnvPath: () => setEnvPath,
    splitPath: () => splitPath
  });
  envpath = __toCommonJS(envpath_exports);
  var import_node_path2 = __toESM(minpath);
  function prependPathEntries(pathValue, directories) {
    const pathParts = pathValue.split(import_node_path2.default.delimiter).filter(Boolean);
    const prepended = [];
    for (const directory of directories) {
      if (!pathParts.includes(directory) && !prepended.includes(directory)) {
        prepended.push(directory);
      }
    }
    if (prepended.length === 0) {
      return pathValue;
    }
    return pathValue === "" || pathValue === import_node_path2.default.delimiter ? `${prepended.join(import_node_path2.default.delimiter)}${pathValue}` : [...prepended, pathValue].join(import_node_path2.default.delimiter);
  }
  function splitPath(pathValue) {
    return pathValue.split(import_node_path2.default.delimiter).filter(Boolean);
  }
  function getEnvPath(env = process.env) {
    if (process.platform !== "win32") {
      return env.PATH ?? "";
    }
    const pathKeys = Object.keys(env).filter((key) => key.toLowerCase() === "path");
    for (let index = pathKeys.length - 1; index >= 0; index--) {
      const value = env[pathKeys[index]];
      if (value !== void 0) {
        return value;
      }
    }
    return "";
  }
  function setEnvPath(env = process.env, pathValue) {
    if (process.platform !== "win32") {
      return {
        ...env,
        PATH: pathValue
      };
    }
    const normalizedEnv = { ...env };
    for (const key of Object.keys(normalizedEnv)) {
      if (key !== "PATH" && key.toLowerCase() === "path") {
        delete normalizedEnv[key];
      }
    }
    normalizedEnv.PATH = pathValue;
    return normalizedEnv;
  }
  return envpath;
}
var errutils;
var hasRequiredErrutils;
function requireErrutils() {
  if (hasRequiredErrutils) return errutils;
  hasRequiredErrutils = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var errutils_exports = {};
  __export(errutils_exports, {
    getErrorMessage: () => getErrorMessage,
    isMissingPathError: () => isMissingPathError
  });
  errutils = __toCommonJS(errutils_exports);
  function getErrorMessage(error) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  function isMissingPathError(error) {
    return typeof error === "object" && error !== null && "code" in error && (error.code === "ENOENT" || error.code === "ENOTDIR");
  }
  return errutils;
}
var fsutils;
var hasRequiredFsutils;
function requireFsutils() {
  if (hasRequiredFsutils) return fsutils;
  hasRequiredFsutils = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var fsutils_exports = {};
  __export(fsutils_exports, {
    getCanonicalPath: () => getCanonicalPath,
    getCommandBase: () => getCommandBase,
    getDirectoriesBetween: () => getDirectoriesBetween,
    isNodeScript: () => isNodeScript,
    isSubpath: () => isSubpath,
    statIfExists: () => statIfExists
  });
  fsutils = __toCommonJS(fsutils_exports);
  var import_promises2 = require$$0;
  var import_node_path2 = __toESM(minpath);
  var import_errutils = requireErrutils();
  async function getCanonicalPath(filePath) {
    try {
      return await (0, import_promises2.realpath)(filePath);
    } catch {
      return filePath;
    }
  }
  function getDirectoriesBetween(parent, child) {
    const directories = [];
    let current = import_node_path2.default.resolve(child);
    const resolvedParent = import_node_path2.default.resolve(parent);
    while (true) {
      directories.push(current);
      if (current === resolvedParent) {
        return directories.reverse();
      }
      const next = import_node_path2.default.dirname(current);
      if (next === current) {
        return [];
      }
      current = next;
    }
  }
  async function statIfExists(filePath) {
    try {
      return { stats: await (0, import_promises2.stat)(filePath) };
    } catch (error) {
      if ((0, import_errutils.isMissingPathError)(error)) {
        return { missing: true };
      }
      return { reason: `could not inspect: ${(0, import_errutils.getErrorMessage)(error)}` };
    }
  }
  function isNodeScript(filePath) {
    return [".js", ".cjs", ".mjs"].includes(import_node_path2.default.extname(filePath));
  }
  function isSubpath(parent, child) {
    const relativePath = import_node_path2.default.relative(parent, child);
    return relativePath === "" || relativePath !== "" && !relativePath.startsWith("..") && !import_node_path2.default.isAbsolute(relativePath);
  }
  function getCommandBase(command) {
    const extension = import_node_path2.default.extname(command).toLowerCase();
    if (process.platform === "win32" && [".cmd", ".exe"].includes(extension)) {
      return import_node_path2.default.basename(command, extension);
    }
    return import_node_path2.default.basename(command);
  }
  return fsutils;
}
var safety;
var hasRequiredSafety;
function requireSafety() {
  if (hasRequiredSafety) return safety;
  hasRequiredSafety = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var safety_exports = {};
  __export(safety_exports, {
    getSkippedNodeModulesReason: () => getSkippedNodeModulesReason,
    getUnsafeDirectoryReason: () => getUnsafeDirectoryReason,
    getUnsafePackageBinReason: () => getUnsafePackageBinReason,
    getUnsafePackageDirectoryReason: () => getUnsafePackageDirectoryReason,
    getUnsafePackageFileReason: () => getUnsafePackageFileReason,
    getUnsafeStatsReason: () => getUnsafeStatsReason
  });
  safety = __toCommonJS(safety_exports);
  var import_promises2 = require$$0;
  var import_node_path2 = __toESM(minpath);
  var import_errutils = requireErrutils();
  var import_fsutils = requireFsutils();
  async function getSkippedNodeModulesReason(nodeModulesDirectory, parentDirectories) {
    const parentDirectory = import_node_path2.default.dirname(nodeModulesDirectory);
    parentDirectories ??= [parentDirectory];
    for (const directory of parentDirectories) {
      let unsafeParentReason;
      try {
        unsafeParentReason = await getUnsafeDirectoryReason(directory);
      } catch (error) {
        unsafeParentReason = `could not inspect: ${(0, import_errutils.getErrorMessage)(error)}`;
      }
      if (unsafeParentReason) {
        return `${directory} is ${unsafeParentReason}`;
      }
    }
    const result = await (0, import_fsutils.statIfExists)(nodeModulesDirectory);
    if ("missing" in result) {
      return null;
    }
    if ("reason" in result) {
      return result.reason;
    }
    if (!result.stats.isDirectory()) {
      return "not a directory";
    }
    const unsafeNodeModulesReason = getUnsafeStatsReason(result.stats);
    if (unsafeNodeModulesReason) {
      return unsafeNodeModulesReason;
    }
    return await getSkippedLocalBinDirectoryReason(
      import_node_path2.default.join(nodeModulesDirectory, ".bin")
    );
  }
  async function getSkippedLocalBinDirectoryReason(localBinDirectory) {
    const result = await (0, import_fsutils.statIfExists)(localBinDirectory);
    if ("missing" in result) {
      return null;
    }
    if ("reason" in result) {
      return `${localBinDirectory} ${result.reason}`;
    }
    if (!result.stats.isDirectory()) {
      return `${localBinDirectory} is not a directory`;
    }
    const unsafeLocalBinReason = getUnsafeStatsReason(result.stats);
    return unsafeLocalBinReason ? `${localBinDirectory} is ${unsafeLocalBinReason}` : null;
  }
  async function getUnsafePackageBinReason(nodeModulesDirectory, packageDirectory, binPath) {
    const unsafePackageDirectoryReason = await getUnsafePackageDirectoryReason(
      nodeModulesDirectory,
      packageDirectory
    );
    if (unsafePackageDirectoryReason) {
      return unsafePackageDirectoryReason;
    }
    return await getUnsafePackageFileReason(packageDirectory, binPath);
  }
  async function getUnsafePackageDirectoryReason(nodeModulesDirectory, packageDirectory) {
    const directoriesToCheck = (0, import_fsutils.getDirectoriesBetween)(
      nodeModulesDirectory,
      packageDirectory
    );
    if (directoriesToCheck.length === 0) {
      return `${packageDirectory} resolves outside local node_modules`;
    }
    for (const directory of directoriesToCheck) {
      const reason = await getUnsafeDirectoryReason(directory);
      if (reason) {
        return `${directory} is ${reason}`;
      }
    }
    return null;
  }
  async function getUnsafePackageFileReason(packageDirectory, filePath) {
    const directoriesToCheck = (0, import_fsutils.getDirectoriesBetween)(
      packageDirectory,
      import_node_path2.default.dirname(filePath)
    );
    if (directoriesToCheck.length === 0) {
      return `${filePath} resolves outside package`;
    }
    for (const directory of directoriesToCheck) {
      const reason2 = await getUnsafeDirectoryReason(directory);
      if (reason2) {
        return `${directory} is ${reason2}`;
      }
    }
    const reason = await getUnsafeFileReason(filePath);
    return reason ? `${filePath} is ${reason}` : null;
  }
  async function getUnsafeDirectoryReason(directory) {
    const stats = await (0, import_promises2.stat)(directory);
    if (!stats.isDirectory()) {
      return "not a directory";
    }
    return getUnsafeStatsReason(stats);
  }
  async function getUnsafeFileReason(filePath) {
    const stats = await (0, import_promises2.stat)(filePath);
    if (!stats.isFile()) {
      return "not a file";
    }
    return getUnsafeStatsReason(stats);
  }
  function getUnsafeStatsReason(stats) {
    const getuid = process.geteuid ?? process.getuid;
    if (typeof getuid !== "function") {
      return null;
    }
    const uid = getuid();
    if ((stats.mode & 18) !== 0) {
      if ((stats.mode & 2) !== 0) {
        return "world-writable";
      }
      return "group-writable";
    }
    if (stats.uid !== uid) {
      return `owned by uid ${stats.uid}, current uid is ${uid}`;
    }
    return null;
  }
  return safety;
}
var lookup;
var hasRequiredLookup;
function requireLookup() {
  if (hasRequiredLookup) return lookup;
  hasRequiredLookup = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var lookup_exports = {};
  __export(lookup_exports, {
    clearCachedCliInvocation: () => clearCachedCliInvocation,
    clearVercelCliLookupCache: () => clearVercelCliLookupCache,
    findVercelCli: () => findVercelCli,
    getLocalBinSearch: () => getLocalBinSearch,
    resolveCachedCliInvocation: () => resolveCachedCliInvocation,
    toVercelCliInvocation: () => toVercelCliInvocation
  });
  lookup = __toCommonJS(lookup_exports);
  var import_promises2 = require$$0;
  var import_node_path2 = __toESM(minpath);
  var import_envpath = requireEnvpath();
  var import_errutils = requireErrutils();
  var import_fsutils = requireFsutils();
  var import_safety = requireSafety();
  const cliInvocationCache = /* @__PURE__ */ new Map();
  async function findVercelCli(options = {}) {
    const cwd = import_node_path2.default.resolve(options.cwd ?? process.cwd());
    const pathValue = options.path ?? (0, import_envpath.getEnvPath)(process.env);
    const resolution = await resolveCachedCliInvocation(cwd, pathValue);
    return resolution.found ? toVercelCliInvocation(resolution) : null;
  }
  function resolveCachedCliInvocation(cwd, pathValue) {
    const cacheKey = getCliInvocationCacheKey(cwd, pathValue);
    if (cliInvocationCache.has(cacheKey)) {
      return cliInvocationCache.get(cacheKey);
    }
    const resolution = resolveCliInvocation(cwd, pathValue).catch((error) => {
      cliInvocationCache.delete(cacheKey);
      throw error;
    });
    cliInvocationCache.set(cacheKey, resolution);
    return resolution;
  }
  function toVercelCliInvocation(resolution) {
    return {
      command: resolution.command,
      commandArgs: resolution.commandArgs,
      source: resolution.source
    };
  }
  function clearVercelCliLookupCache() {
    cliInvocationCache.clear();
  }
  function clearCachedCliInvocation(cwd, pathValue) {
    cliInvocationCache.delete(getCliInvocationCacheKey(cwd, pathValue));
  }
  async function resolveCliInvocation(cwd, pathValue) {
    const localBinSearch = await getLocalBinSearch(cwd);
    const diagnostics = {
      localBinSearch: localBinSearch.diagnostics,
      skippedLocalBins: []
    };
    const resolvedPath = (0, import_envpath.prependPathEntries)(
      pathValue,
      localBinSearch.directories
    );
    for (const command of getVercelCommandNames()) {
      const resolvedCommand = await findCommandInPath(
        command,
        resolvedPath,
        cwd,
        localBinSearch,
        diagnostics
      );
      if (!resolvedCommand) {
        continue;
      }
      if ((0, import_fsutils.isNodeScript)(resolvedCommand.realPath)) {
        return {
          found: true,
          command: process.execPath,
          commandArgs: [resolvedCommand.realPath],
          source: resolvedCommand.source,
          diagnostics
        };
      }
      return {
        found: true,
        command: resolvedCommand.realPath,
        commandArgs: [],
        source: resolvedCommand.source,
        diagnostics
      };
    }
    return { found: false, diagnostics };
  }
  async function findCommandInPath(command, pathValue, cwd, localBinSearch, diagnostics) {
    for (const directory of (0, import_envpath.splitPath)(pathValue)) {
      const candidate = getPathCommandCandidate(directory, command, cwd);
      try {
        const canAccess = await canAccessCommandCandidate(
          candidate,
          localBinSearch,
          diagnostics
        );
        if (canAccess) {
          const resolvedCommand = await resolveCommandCandidate(
            command,
            candidate,
            localBinSearch,
            diagnostics
          );
          if (resolvedCommand) {
            return resolvedCommand;
          }
        }
      } catch {
      }
    }
    return null;
  }
  function getPathCommandCandidate(directory, command, cwd) {
    const candidateDirectory = import_node_path2.default.isAbsolute(directory) ? directory : import_node_path2.default.resolve(cwd, directory);
    return import_node_path2.default.join(candidateDirectory, command);
  }
  async function canAccessCommandCandidate(candidate, localBinSearch, diagnostics) {
    try {
      await (0, import_promises2.access)(
        candidate,
        process.platform === "win32" ? import_promises2.constants.F_OK : import_promises2.constants.F_OK | import_promises2.constants.X_OK
      );
      return true;
    } catch (error) {
      if (!(0, import_errutils.isMissingPathError)(error)) {
        await recordInaccessibleLocalBinCandidate(
          candidate,
          error,
          localBinSearch,
          diagnostics
        );
      }
      return false;
    }
  }
  async function recordInaccessibleLocalBinCandidate(candidate, error, localBinSearch, diagnostics) {
    const localBinCandidate = await classifyPathLocalBinCandidate(
      candidate,
      localBinSearch.directories
    );
    if (!localBinCandidate) {
      return;
    }
    recordSkippedLocalBin(
      diagnostics,
      candidate,
      "reason" in localBinCandidate ? localBinCandidate.reason : `local bin is not accessible: ${(0, import_errutils.getErrorMessage)(error)}`
    );
  }
  async function resolveCommandCandidate(command, candidate, localBinSearch, diagnostics) {
    if (!(await (0, import_promises2.stat)(candidate)).isFile()) {
      return null;
    }
    const realPath = await (0, import_promises2.realpath)(candidate);
    const localBinCandidate = await classifyPathLocalBinCandidate(
      candidate,
      localBinSearch.directories
    );
    if (!localBinCandidate) {
      return { realPath, source: "path" };
    }
    if ("reason" in localBinCandidate) {
      recordSkippedLocalBin(diagnostics, candidate, localBinCandidate.reason);
      return null;
    }
    const localPackageBinResult = await getLocalVercelPackageBin(
      command,
      localBinCandidate.directory
    );
    if ("reason" in localPackageBinResult) {
      recordSkippedLocalBin(diagnostics, candidate, localPackageBinResult.reason);
      return null;
    }
    return { realPath: localPackageBinResult.binPath, source: "local-bin" };
  }
  function recordSkippedLocalBin(diagnostics, candidate, reason) {
    diagnostics.skippedLocalBins.push({ candidate, reason });
  }
  function getVercelCommandNames() {
    const commandBases = ["vercel"];
    if (process.platform !== "win32") {
      return commandBases;
    }
    const extensions = [".cmd", ".exe", ""];
    return commandBases.flatMap(
      (command) => extensions.map((extension) => `${command}${extension}`)
    );
  }
  async function getLocalBinSearch(cwd) {
    const searchRoot = await (0, import_fsutils.getCanonicalPath)(import_node_path2.default.resolve(cwd));
    const ancestorSearch = await getAncestorDirectorySearch(searchRoot);
    const skippedNodeModules = [];
    const directories = [];
    for (const directory of ancestorSearch.directories) {
      const nodeModulesDirectory = import_node_path2.default.join(directory, "node_modules");
      const parentDirectories = ancestorSearch.stopReason === "project-root-marker" ? (0, import_fsutils.getDirectoriesBetween)(ancestorSearch.stoppedAt, directory) : (0, import_fsutils.getDirectoriesBetween)(directory, searchRoot);
      const skippedReason = await (0, import_safety.getSkippedNodeModulesReason)(
        nodeModulesDirectory,
        parentDirectories
      );
      if (skippedReason) {
        skippedNodeModules.push({
          directory: nodeModulesDirectory,
          reason: skippedReason
        });
        continue;
      }
      directories.push(import_node_path2.default.join(nodeModulesDirectory, ".bin"));
    }
    return {
      directories,
      diagnostics: {
        searchRoot,
        stoppedAt: ancestorSearch.stoppedAt,
        stopReason: ancestorSearch.stopReason,
        markerPath: ancestorSearch.markerPath,
        skippedNodeModules
      }
    };
  }
  async function getAncestorDirectorySearch(cwd) {
    const directories = [];
    let current = import_node_path2.default.resolve(cwd);
    while (true) {
      directories.push(current);
      const marker = await getProjectRootMarker(current);
      if (marker) {
        return {
          directories,
          stoppedAt: current,
          stopReason: "project-root-marker",
          markerPath: marker.path
        };
      }
      const parent = import_node_path2.default.dirname(current);
      if (parent === current) {
        return {
          directories,
          stoppedAt: current,
          stopReason: "filesystem-root"
        };
      }
      current = parent;
    }
  }
  async function getProjectRootMarker(directory) {
    const gitPath = import_node_path2.default.join(directory, ".git");
    try {
      await (0, import_promises2.stat)(gitPath);
      return { path: gitPath };
    } catch {
    }
    return null;
  }
  async function getLocalBinDirectory(filePath, localBinDirectories) {
    const resolvedFilePath = import_node_path2.default.resolve(filePath);
    let canonicalFilePath = resolvedFilePath;
    try {
      canonicalFilePath = import_node_path2.default.join(
        await (0, import_promises2.realpath)(import_node_path2.default.dirname(resolvedFilePath)),
        import_node_path2.default.basename(resolvedFilePath)
      );
    } catch {
    }
    for (let localBinDirectory of localBinDirectories) {
      try {
        localBinDirectory = await (0, import_promises2.realpath)(localBinDirectory);
      } catch {
      }
      if (canonicalFilePath.startsWith(`${localBinDirectory}${import_node_path2.default.sep}`)) {
        return localBinDirectory;
      }
    }
    return null;
  }
  async function getNodeModulesBinDirectory(filePath) {
    const candidateDirectory = import_node_path2.default.resolve(import_node_path2.default.dirname(filePath));
    const directories = [candidateDirectory];
    try {
      const canonicalDirectory = await (0, import_promises2.realpath)(candidateDirectory);
      if (!directories.includes(canonicalDirectory)) {
        directories.push(canonicalDirectory);
      }
    } catch {
    }
    for (const directory of directories) {
      if (import_node_path2.default.basename(directory) === ".bin" && import_node_path2.default.basename(import_node_path2.default.dirname(directory)) === "node_modules") {
        return directory;
      }
    }
    return null;
  }
  async function classifyPathLocalBinCandidate(filePath, localBinDirectories) {
    const localBinDirectory = await getLocalBinDirectory(
      filePath,
      localBinDirectories
    );
    if (localBinDirectory) {
      return { directory: localBinDirectory };
    }
    const nodeModulesBinDirectory = await getNodeModulesBinDirectory(filePath);
    if (!nodeModulesBinDirectory) {
      return null;
    }
    const nodeModulesDirectory = import_node_path2.default.dirname(nodeModulesBinDirectory);
    const skippedReason = await (0, import_safety.getSkippedNodeModulesReason)(nodeModulesDirectory);
    if (skippedReason) {
      return { reason: `local node_modules is ${skippedReason}` };
    }
    return { reason: "local bin is outside project lookup boundary" };
  }
  async function getLocalVercelPackageBin(command, localBinDirectory) {
    const commandBase = (0, import_fsutils.getCommandBase)(command);
    const nodeModulesDirectory = import_node_path2.default.dirname(localBinDirectory);
    if (commandBase !== "vercel" || import_node_path2.default.basename(nodeModulesDirectory) !== "node_modules") {
      return { reason: "not a local vercel bin" };
    }
    try {
      const localPackage = await getLocalVercelPackage(nodeModulesDirectory);
      if ("reason" in localPackage) {
        return localPackage;
      }
      const packageJsonResult = await readLocalVercelPackageJson(
        localPackage.realPackageDirectory
      );
      if ("reason" in packageJsonResult) {
        return packageJsonResult;
      }
      localPackage.packageJson = packageJsonResult.packageJson;
      return await getDeclaredLocalVercelPackageBin(localPackage, commandBase);
    } catch (error) {
      return {
        reason: `could not validate local vercel package: ${(0, import_errutils.getErrorMessage)(error)}`
      };
    }
  }
  async function getLocalVercelPackage(nodeModulesDirectory) {
    const packageDirectory = import_node_path2.default.join(nodeModulesDirectory, "vercel");
    const realNodeModulesDirectory = await (0, import_promises2.realpath)(nodeModulesDirectory);
    const realPackageDirectory = await (0, import_promises2.realpath)(packageDirectory);
    if (!(0, import_fsutils.isSubpath)(realNodeModulesDirectory, realPackageDirectory)) {
      return {
        reason: "local vercel package resolves outside local node_modules"
      };
    }
    const unsafePackageDirectoryReason = await (0, import_safety.getUnsafePackageDirectoryReason)(
      realNodeModulesDirectory,
      realPackageDirectory
    );
    if (unsafePackageDirectoryReason) {
      return {
        reason: `local vercel package is unsafe: ${unsafePackageDirectoryReason}`
      };
    }
    return {
      realNodeModulesDirectory,
      realPackageDirectory,
      packageJson: {}
    };
  }
  async function readLocalVercelPackageJson(realPackageDirectory) {
    const packageJsonPath = import_node_path2.default.join(realPackageDirectory, "package.json");
    const realPackageJsonPath = await (0, import_promises2.realpath)(packageJsonPath);
    if (!(0, import_fsutils.isSubpath)(realPackageDirectory, realPackageJsonPath)) {
      return { reason: "local vercel package.json resolves outside package" };
    }
    const unsafePackageJsonReason = await (0, import_safety.getUnsafePackageFileReason)(
      realPackageDirectory,
      realPackageJsonPath
    );
    if (unsafePackageJsonReason) {
      return {
        reason: `local vercel package.json is unsafe: ${unsafePackageJsonReason}`
      };
    }
    const packageJson = JSON.parse(
      await (0, import_promises2.readFile)(realPackageJsonPath, "utf8")
    );
    if (packageJson.name !== "vercel") {
      return {
        reason: 'local vercel package.json does not have name "vercel"'
      };
    }
    return { packageJson };
  }
  async function getDeclaredLocalVercelPackageBin(localPackage, commandBase) {
    const { packageJson, realNodeModulesDirectory, realPackageDirectory } = localPackage;
    const binTarget = getPackageBinTarget(packageJson, commandBase);
    if (!binTarget) {
      return { reason: "local vercel package does not declare bin.vercel" };
    }
    const declaredBinPath = import_node_path2.default.resolve(realPackageDirectory, binTarget);
    const realDeclaredBinPath = await (0, import_promises2.realpath)(declaredBinPath);
    if (!(0, import_fsutils.isSubpath)(realPackageDirectory, realDeclaredBinPath)) {
      return { reason: "local vercel package bin resolves outside package" };
    }
    const unsafePackageBinReason = await (0, import_safety.getUnsafePackageBinReason)(
      realNodeModulesDirectory,
      realPackageDirectory,
      realDeclaredBinPath
    );
    if (unsafePackageBinReason) {
      return {
        reason: `local vercel package bin is unsafe: ${unsafePackageBinReason}`
      };
    }
    if (process.platform !== "win32" && !(0, import_fsutils.isNodeScript)(realDeclaredBinPath)) {
      try {
        await (0, import_promises2.access)(realDeclaredBinPath, import_promises2.constants.F_OK | import_promises2.constants.X_OK);
      } catch (error) {
        return {
          reason: `local vercel package bin is not executable: ${(0, import_errutils.getErrorMessage)(error)}`
        };
      }
    }
    return { binPath: realDeclaredBinPath };
  }
  function getPackageBinTarget(packageJson, command) {
    const bin = packageJson.bin;
    if (typeof bin === "string") {
      return command === "vercel" ? bin : null;
    }
    if (bin && typeof bin === "object") {
      const target = bin[command];
      if (typeof target === "string") {
        return target;
      }
    }
    return null;
  }
  function getCliInvocationCacheKey(cwd, pathValue) {
    return `${cwd}\0${pathValue}`;
  }
  return lookup;
}
var exec;
var hasRequiredExec;
function requireExec() {
  if (hasRequiredExec) return exec;
  hasRequiredExec = 1;
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var exec_exports = {};
  __export(exec_exports, {
    execVercelCli: () => execVercelCli
  });
  exec = __toCommonJS(exec_exports);
  var import_node_path2 = __toESM(minpath);
  var import_execa2 = __toESM(requireExeca());
  var import_envpath = requireEnvpath();
  var import_errors = requireErrors();
  var import_lookup = requireLookup();
  async function execVercelCli(args, options = {}) {
    const cwd = import_node_path2.default.resolve(options.cwd ?? process.cwd());
    await (0, import_errors.assertValidCwd)(cwd);
    const env = mergeExecEnv(options.env);
    const pathValue = (0, import_envpath.getEnvPath)(env);
    try {
      return await execResolvedVercelCli(args, options, cwd, env, pathValue);
    } catch (error) {
      if (error instanceof import_errors.VercelCliError && error.code === "VERCEL_CLI_NOT_FOUND") {
        (0, import_lookup.clearCachedCliInvocation)(cwd, pathValue);
        return await execResolvedVercelCli(args, options, cwd, env, pathValue);
      }
      throw error;
    }
  }
  async function execResolvedVercelCli(args, options, cwd, env, pathValue) {
    const invocation = await resolveInvocationOrThrow(cwd, pathValue);
    try {
      const execaOptions = {
        input: options.input,
        stdio: options.stdio,
        stdin: options.stdin,
        stdout: options.stdout,
        stderr: options.stderr,
        timeout: options.timeout,
        cwd,
        env: await prependLocalBinsToEnvPath(cwd, env),
        windowsHide: true
      };
      if (options.signal) {
        execaOptions.signal = options.signal;
      }
      const { stdout, stderr } = await (0, import_execa2.default)(
        invocation.command,
        [...invocation.commandArgs, ...args],
        execaOptions
      );
      return { stdout, stderr, invocation };
    } catch (error) {
      throw (0, import_errors.toVercelCliError)(invocation, error);
    }
  }
  async function resolveInvocationOrThrow(cwd, pathValue) {
    const resolution = await (0, import_lookup.resolveCachedCliInvocation)(cwd, pathValue);
    if (!resolution.found) {
      throw new import_errors.VercelCliError({
        code: "VERCEL_CLI_NOT_FOUND",
        message: (0, import_errors.getCliNotFoundMessage)(resolution.diagnostics)
      });
    }
    return (0, import_lookup.toVercelCliInvocation)(resolution);
  }
  function mergeExecEnv(env) {
    if (!env) {
      return process.env;
    }
    return { ...process.env, ...env };
  }
  async function prependLocalBinsToEnvPath(cwd, env = process.env) {
    const localPath = await prependLocalBinsToPath(cwd, (0, import_envpath.getEnvPath)(env));
    return (0, import_envpath.setEnvPath)(
      env,
      (0, import_envpath.prependPathEntries)(localPath, [import_node_path2.default.dirname(process.execPath)])
    );
  }
  async function prependLocalBinsToPath(cwd, pathValue = "") {
    return (0, import_envpath.prependPathEntries)(
      pathValue,
      (await (0, import_lookup.getLocalBinSearch)(cwd)).directories
    );
  }
  return exec;
}
var dist;
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var src_exports = {};
  __export(src_exports, {
    VercelCliError: () => import_errors.VercelCliError,
    clearVercelCliLookupCache: () => import_lookup.clearVercelCliLookupCache,
    execVercelCli: () => import_exec.execVercelCli,
    findVercelCli: () => import_lookup.findVercelCli
  });
  dist = __toCommonJS(src_exports);
  var import_errors = requireErrors();
  var import_exec = requireExec();
  var import_lookup = requireLookup();
  return dist;
}
export {
  requireDist as r
};
