import require$$0$1 from "node:buffer";
import require$$1 from "node:util";
import require$$2$1 from "node:events";
import require$$0 from "node:crypto";
import require$$2 from "node:http";
import nodeHTTPS from "node:https";
var cjs = {};
var decrypt$4 = {};
var decrypt$3 = {};
var base64url$1 = {};
var buffer_utils = {};
var digest = {};
var hasRequiredDigest;
function requireDigest() {
  if (hasRequiredDigest) return digest;
  hasRequiredDigest = 1;
  Object.defineProperty(digest, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const digest$1 = (algorithm, data) => (0, node_crypto_1.createHash)(algorithm).update(data).digest();
  digest.default = digest$1;
  return digest;
}
var hasRequiredBuffer_utils;
function requireBuffer_utils() {
  if (hasRequiredBuffer_utils) return buffer_utils;
  hasRequiredBuffer_utils = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decoder = exports.encoder = void 0;
    exports.concat = concat;
    exports.p2s = p2s;
    exports.uint64be = uint64be;
    exports.uint32be = uint32be;
    exports.lengthAndInput = lengthAndInput;
    exports.concatKdf = concatKdf;
    const digest_js_1 = /* @__PURE__ */ requireDigest();
    exports.encoder = new TextEncoder();
    exports.decoder = new TextDecoder();
    const MAX_INT32 = 2 ** 32;
    function concat(...buffers) {
      const size = buffers.reduce((acc, { length }) => acc + length, 0);
      const buf = new Uint8Array(size);
      let i = 0;
      for (const buffer of buffers) {
        buf.set(buffer, i);
        i += buffer.length;
      }
      return buf;
    }
    function p2s(alg, p2sInput) {
      return concat(exports.encoder.encode(alg), new Uint8Array([0]), p2sInput);
    }
    function writeUInt32BE(buf, value, offset) {
      if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
      }
      buf.set([value >>> 24, value >>> 16, value >>> 8, value & 255], offset);
    }
    function uint64be(value) {
      const high = Math.floor(value / MAX_INT32);
      const low = value % MAX_INT32;
      const buf = new Uint8Array(8);
      writeUInt32BE(buf, high, 0);
      writeUInt32BE(buf, low, 4);
      return buf;
    }
    function uint32be(value) {
      const buf = new Uint8Array(4);
      writeUInt32BE(buf, value);
      return buf;
    }
    function lengthAndInput(input) {
      return concat(uint32be(input.length), input);
    }
    async function concatKdf(secret, bits, value) {
      const iterations = Math.ceil((bits >> 3) / 32);
      const res = new Uint8Array(iterations * 32);
      for (let iter = 0; iter < iterations; iter++) {
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await (0, digest_js_1.default)("sha256", buf), iter * 32);
      }
      return res.slice(0, bits >> 3);
    }
  })(buffer_utils);
  return buffer_utils;
}
var hasRequiredBase64url$1;
function requireBase64url$1() {
  if (hasRequiredBase64url$1) return base64url$1;
  hasRequiredBase64url$1 = 1;
  Object.defineProperty(base64url$1, "__esModule", { value: true });
  base64url$1.decode = base64url$1.encode = base64url$1.encodeBase64 = base64url$1.decodeBase64 = void 0;
  const node_buffer_1 = require$$0$1;
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
      encoded = buffer_utils_js_1.decoder.decode(encoded);
    }
    return encoded;
  }
  const encode = (input) => node_buffer_1.Buffer.from(input).toString("base64url");
  base64url$1.encode = encode;
  const decodeBase64 = (input) => new Uint8Array(node_buffer_1.Buffer.from(input, "base64"));
  base64url$1.decodeBase64 = decodeBase64;
  const encodeBase64 = (input) => node_buffer_1.Buffer.from(input).toString("base64");
  base64url$1.encodeBase64 = encodeBase64;
  const decode = (input) => new Uint8Array(node_buffer_1.Buffer.from(normalize(input), "base64url"));
  base64url$1.decode = decode;
  return base64url$1;
}
var decrypt$2 = {};
var check_iv_length = {};
var errors = {};
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  Object.defineProperty(errors, "__esModule", { value: true });
  errors.JWSSignatureVerificationFailed = errors.JWKSTimeout = errors.JWKSMultipleMatchingKeys = errors.JWKSNoMatchingKey = errors.JWKSInvalid = errors.JWKInvalid = errors.JWTInvalid = errors.JWSInvalid = errors.JWEInvalid = errors.JWEDecryptionFailed = errors.JOSENotSupported = errors.JOSEAlgNotAllowed = errors.JWTExpired = errors.JWTClaimValidationFailed = errors.JOSEError = void 0;
  class JOSEError extends Error {
    static code = "ERR_JOSE_GENERIC";
    code = "ERR_JOSE_GENERIC";
    constructor(message, options) {
      super(message, options);
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  }
  errors.JOSEError = JOSEError;
  class JWTClaimValidationFailed extends JOSEError {
    static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    claim;
    reason;
    payload;
    constructor(message, payload, claim = "unspecified", reason = "unspecified") {
      super(message, { cause: { claim, reason, payload } });
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  }
  errors.JWTClaimValidationFailed = JWTClaimValidationFailed;
  class JWTExpired extends JOSEError {
    static code = "ERR_JWT_EXPIRED";
    code = "ERR_JWT_EXPIRED";
    claim;
    reason;
    payload;
    constructor(message, payload, claim = "unspecified", reason = "unspecified") {
      super(message, { cause: { claim, reason, payload } });
      this.claim = claim;
      this.reason = reason;
      this.payload = payload;
    }
  }
  errors.JWTExpired = JWTExpired;
  class JOSEAlgNotAllowed extends JOSEError {
    static code = "ERR_JOSE_ALG_NOT_ALLOWED";
    code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
  errors.JOSEAlgNotAllowed = JOSEAlgNotAllowed;
  class JOSENotSupported extends JOSEError {
    static code = "ERR_JOSE_NOT_SUPPORTED";
    code = "ERR_JOSE_NOT_SUPPORTED";
  }
  errors.JOSENotSupported = JOSENotSupported;
  class JWEDecryptionFailed extends JOSEError {
    static code = "ERR_JWE_DECRYPTION_FAILED";
    code = "ERR_JWE_DECRYPTION_FAILED";
    constructor(message = "decryption operation failed", options) {
      super(message, options);
    }
  }
  errors.JWEDecryptionFailed = JWEDecryptionFailed;
  class JWEInvalid extends JOSEError {
    static code = "ERR_JWE_INVALID";
    code = "ERR_JWE_INVALID";
  }
  errors.JWEInvalid = JWEInvalid;
  class JWSInvalid extends JOSEError {
    static code = "ERR_JWS_INVALID";
    code = "ERR_JWS_INVALID";
  }
  errors.JWSInvalid = JWSInvalid;
  class JWTInvalid extends JOSEError {
    static code = "ERR_JWT_INVALID";
    code = "ERR_JWT_INVALID";
  }
  errors.JWTInvalid = JWTInvalid;
  class JWKInvalid extends JOSEError {
    static code = "ERR_JWK_INVALID";
    code = "ERR_JWK_INVALID";
  }
  errors.JWKInvalid = JWKInvalid;
  class JWKSInvalid extends JOSEError {
    static code = "ERR_JWKS_INVALID";
    code = "ERR_JWKS_INVALID";
  }
  errors.JWKSInvalid = JWKSInvalid;
  class JWKSNoMatchingKey extends JOSEError {
    static code = "ERR_JWKS_NO_MATCHING_KEY";
    code = "ERR_JWKS_NO_MATCHING_KEY";
    constructor(message = "no applicable key found in the JSON Web Key Set", options) {
      super(message, options);
    }
  }
  errors.JWKSNoMatchingKey = JWKSNoMatchingKey;
  class JWKSMultipleMatchingKeys extends JOSEError {
    [Symbol.asyncIterator];
    static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    constructor(message = "multiple matching keys found in the JSON Web Key Set", options) {
      super(message, options);
    }
  }
  errors.JWKSMultipleMatchingKeys = JWKSMultipleMatchingKeys;
  class JWKSTimeout extends JOSEError {
    static code = "ERR_JWKS_TIMEOUT";
    code = "ERR_JWKS_TIMEOUT";
    constructor(message = "request timed out", options) {
      super(message, options);
    }
  }
  errors.JWKSTimeout = JWKSTimeout;
  class JWSSignatureVerificationFailed extends JOSEError {
    static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    constructor(message = "signature verification failed", options) {
      super(message, options);
    }
  }
  errors.JWSSignatureVerificationFailed = JWSSignatureVerificationFailed;
  return errors;
}
var iv = {};
var random = {};
var hasRequiredRandom;
function requireRandom() {
  if (hasRequiredRandom) return random;
  hasRequiredRandom = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = void 0;
    var node_crypto_1 = require$$0;
    Object.defineProperty(exports, "default", { enumerable: true, get: function() {
      return node_crypto_1.randomFillSync;
    } });
  })(random);
  return random;
}
var hasRequiredIv;
function requireIv() {
  if (hasRequiredIv) return iv;
  hasRequiredIv = 1;
  Object.defineProperty(iv, "__esModule", { value: true });
  iv.bitLength = bitLength;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const random_js_1 = /* @__PURE__ */ requireRandom();
  function bitLength(alg) {
    switch (alg) {
      case "A128GCM":
      case "A128GCMKW":
      case "A192GCM":
      case "A192GCMKW":
      case "A256GCM":
      case "A256GCMKW":
        return 96;
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return 128;
      default:
        throw new errors_js_1.JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
  }
  iv.default = (alg) => (0, random_js_1.default)(new Uint8Array(bitLength(alg) >> 3));
  return iv;
}
var hasRequiredCheck_iv_length;
function requireCheck_iv_length() {
  if (hasRequiredCheck_iv_length) return check_iv_length;
  hasRequiredCheck_iv_length = 1;
  Object.defineProperty(check_iv_length, "__esModule", { value: true });
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const iv_js_1 = /* @__PURE__ */ requireIv();
  const checkIvLength = (enc, iv2) => {
    if (iv2.length << 3 !== (0, iv_js_1.bitLength)(enc)) {
      throw new errors_js_1.JWEInvalid("Invalid Initialization Vector length");
    }
  };
  check_iv_length.default = checkIvLength;
  return check_iv_length;
}
var check_cek_length = {};
var is_key_object = {};
var hasRequiredIs_key_object;
function requireIs_key_object() {
  if (hasRequiredIs_key_object) return is_key_object;
  hasRequiredIs_key_object = 1;
  Object.defineProperty(is_key_object, "__esModule", { value: true });
  const util = require$$1;
  is_key_object.default = (obj) => util.types.isKeyObject(obj);
  return is_key_object;
}
var hasRequiredCheck_cek_length;
function requireCheck_cek_length() {
  if (hasRequiredCheck_cek_length) return check_cek_length;
  hasRequiredCheck_cek_length = 1;
  Object.defineProperty(check_cek_length, "__esModule", { value: true });
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const checkCekLength = (enc, cek2) => {
    let expected;
    switch (enc) {
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        expected = parseInt(enc.slice(-3), 10);
        break;
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        expected = parseInt(enc.slice(1, 4), 10);
        break;
      default:
        throw new errors_js_1.JOSENotSupported(`Content Encryption Algorithm ${enc} is not supported either by JOSE or your javascript runtime`);
    }
    if (cek2 instanceof Uint8Array) {
      const actual = cek2.byteLength << 3;
      if (actual !== expected) {
        throw new errors_js_1.JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
      }
      return;
    }
    if ((0, is_key_object_js_1.default)(cek2) && cek2.type === "secret") {
      const actual = cek2.symmetricKeySize << 3;
      if (actual !== expected) {
        throw new errors_js_1.JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
      }
      return;
    }
    throw new TypeError("Invalid Content Encryption Key type");
  };
  check_cek_length.default = checkCekLength;
  return check_cek_length;
}
var timing_safe_equal = {};
var hasRequiredTiming_safe_equal;
function requireTiming_safe_equal() {
  if (hasRequiredTiming_safe_equal) return timing_safe_equal;
  hasRequiredTiming_safe_equal = 1;
  Object.defineProperty(timing_safe_equal, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const timingSafeEqual = node_crypto_1.timingSafeEqual;
  timing_safe_equal.default = timingSafeEqual;
  return timing_safe_equal;
}
var cbc_tag = {};
var hasRequiredCbc_tag;
function requireCbc_tag() {
  if (hasRequiredCbc_tag) return cbc_tag;
  hasRequiredCbc_tag = 1;
  Object.defineProperty(cbc_tag, "__esModule", { value: true });
  cbc_tag.default = cbcTag;
  const node_crypto_1 = require$$0;
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  function cbcTag(aad, iv2, ciphertext, macSize, macKey, keySize) {
    const macData = (0, buffer_utils_js_1.concat)(aad, iv2, ciphertext, (0, buffer_utils_js_1.uint64be)(aad.length << 3));
    const hmac = (0, node_crypto_1.createHmac)(`sha${macSize}`, macKey);
    hmac.update(macData);
    return hmac.digest().slice(0, keySize >> 3);
  }
  return cbc_tag;
}
var webcrypto = {};
var hasRequiredWebcrypto;
function requireWebcrypto() {
  if (hasRequiredWebcrypto) return webcrypto;
  hasRequiredWebcrypto = 1;
  Object.defineProperty(webcrypto, "__esModule", { value: true });
  webcrypto.isCryptoKey = void 0;
  const crypto = require$$0;
  const util = require$$1;
  const webcrypto$1 = crypto.webcrypto;
  webcrypto.default = webcrypto$1;
  const isCryptoKey = (key) => util.types.isCryptoKey(key);
  webcrypto.isCryptoKey = isCryptoKey;
  return webcrypto;
}
var crypto_key = {};
var hasRequiredCrypto_key;
function requireCrypto_key() {
  if (hasRequiredCrypto_key) return crypto_key;
  hasRequiredCrypto_key = 1;
  Object.defineProperty(crypto_key, "__esModule", { value: true });
  crypto_key.checkSigCryptoKey = checkSigCryptoKey;
  crypto_key.checkEncCryptoKey = checkEncCryptoKey;
  function unusable(name, prop = "algorithm.name") {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
  }
  function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
  }
  function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
  }
  function getNamedCurve(alg) {
    switch (alg) {
      case "ES256":
        return "P-256";
      case "ES384":
        return "P-384";
      case "ES512":
        return "P-521";
      default:
        throw new Error("unreachable");
    }
  }
  function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
      let msg = "CryptoKey does not support this operation, its usages must include ";
      if (usages.length > 2) {
        const last = usages.pop();
        msg += `one of ${usages.join(", ")}, or ${last}.`;
      } else if (usages.length === 2) {
        msg += `one of ${usages[0]} or ${usages[1]}.`;
      } else {
        msg += `${usages[0]}.`;
      }
      throw new TypeError(msg);
    }
  }
  function checkSigCryptoKey(key, alg, ...usages) {
    switch (alg) {
      case "HS256":
      case "HS384":
      case "HS512": {
        if (!isAlgorithm(key.algorithm, "HMAC"))
          throw unusable("HMAC");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "RS256":
      case "RS384":
      case "RS512": {
        if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
          throw unusable("RSASSA-PKCS1-v1_5");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "PS256":
      case "PS384":
      case "PS512": {
        if (!isAlgorithm(key.algorithm, "RSA-PSS"))
          throw unusable("RSA-PSS");
        const expected = parseInt(alg.slice(2), 10);
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      case "EdDSA": {
        if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
          throw unusable("Ed25519 or Ed448");
        }
        break;
      }
      case "Ed25519": {
        if (!isAlgorithm(key.algorithm, "Ed25519"))
          throw unusable("Ed25519");
        break;
      }
      case "ES256":
      case "ES384":
      case "ES512": {
        if (!isAlgorithm(key.algorithm, "ECDSA"))
          throw unusable("ECDSA");
        const expected = getNamedCurve(alg);
        const actual = key.algorithm.namedCurve;
        if (actual !== expected)
          throw unusable(expected, "algorithm.namedCurve");
        break;
      }
      default:
        throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
  }
  function checkEncCryptoKey(key, alg, ...usages) {
    switch (alg) {
      case "A128GCM":
      case "A192GCM":
      case "A256GCM": {
        if (!isAlgorithm(key.algorithm, "AES-GCM"))
          throw unusable("AES-GCM");
        const expected = parseInt(alg.slice(1, 4), 10);
        const actual = key.algorithm.length;
        if (actual !== expected)
          throw unusable(expected, "algorithm.length");
        break;
      }
      case "A128KW":
      case "A192KW":
      case "A256KW": {
        if (!isAlgorithm(key.algorithm, "AES-KW"))
          throw unusable("AES-KW");
        const expected = parseInt(alg.slice(1, 4), 10);
        const actual = key.algorithm.length;
        if (actual !== expected)
          throw unusable(expected, "algorithm.length");
        break;
      }
      case "ECDH": {
        switch (key.algorithm.name) {
          case "ECDH":
          case "X25519":
          case "X448":
            break;
          default:
            throw unusable("ECDH, X25519, or X448");
        }
        break;
      }
      case "PBES2-HS256+A128KW":
      case "PBES2-HS384+A192KW":
      case "PBES2-HS512+A256KW":
        if (!isAlgorithm(key.algorithm, "PBKDF2"))
          throw unusable("PBKDF2");
        break;
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512": {
        if (!isAlgorithm(key.algorithm, "RSA-OAEP"))
          throw unusable("RSA-OAEP");
        const expected = parseInt(alg.slice(9), 10) || 1;
        const actual = getHashLength(key.algorithm.hash);
        if (actual !== expected)
          throw unusable(`SHA-${expected}`, "algorithm.hash");
        break;
      }
      default:
        throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
  }
  return crypto_key;
}
var invalid_key_input = {};
var hasRequiredInvalid_key_input;
function requireInvalid_key_input() {
  if (hasRequiredInvalid_key_input) return invalid_key_input;
  hasRequiredInvalid_key_input = 1;
  Object.defineProperty(invalid_key_input, "__esModule", { value: true });
  invalid_key_input.withAlg = withAlg;
  function message(msg, actual, ...types) {
    types = types.filter(Boolean);
    if (types.length > 2) {
      const last = types.pop();
      msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else if (types.length === 2) {
      msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
      msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
      msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
      msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
      if (actual.constructor?.name) {
        msg += ` Received an instance of ${actual.constructor.name}`;
      }
    }
    return msg;
  }
  invalid_key_input.default = (actual, ...types) => {
    return message("Key must be ", actual, ...types);
  };
  function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
  }
  return invalid_key_input;
}
var ciphers = {};
var hasRequiredCiphers;
function requireCiphers() {
  if (hasRequiredCiphers) return ciphers;
  hasRequiredCiphers = 1;
  Object.defineProperty(ciphers, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  let ciphers$1;
  ciphers.default = (algorithm) => {
    ciphers$1 ||= new Set((0, node_crypto_1.getCiphers)());
    return ciphers$1.has(algorithm);
  };
  return ciphers;
}
var is_key_like = {};
var hasRequiredIs_key_like;
function requireIs_key_like() {
  if (hasRequiredIs_key_like) return is_key_like;
  hasRequiredIs_key_like = 1;
  Object.defineProperty(is_key_like, "__esModule", { value: true });
  is_key_like.types = void 0;
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  is_key_like.default = (key) => (0, is_key_object_js_1.default)(key) || (0, webcrypto_js_1.isCryptoKey)(key);
  const types = ["KeyObject"];
  is_key_like.types = types;
  if (globalThis.CryptoKey || webcrypto_js_1.default?.CryptoKey) {
    types.push("CryptoKey");
  }
  return is_key_like;
}
var hasRequiredDecrypt$4;
function requireDecrypt$4() {
  if (hasRequiredDecrypt$4) return decrypt$2;
  hasRequiredDecrypt$4 = 1;
  Object.defineProperty(decrypt$2, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const check_iv_length_js_1 = /* @__PURE__ */ requireCheck_iv_length();
  const check_cek_length_js_1 = /* @__PURE__ */ requireCheck_cek_length();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const timing_safe_equal_js_1 = /* @__PURE__ */ requireTiming_safe_equal();
  const cbc_tag_js_1 = /* @__PURE__ */ requireCbc_tag();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const ciphers_js_1 = /* @__PURE__ */ requireCiphers();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  function cbcDecrypt(enc, cek2, ciphertext, iv2, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if ((0, is_key_object_js_1.default)(cek2)) {
      cek2 = cek2.export();
    }
    const encKey = cek2.subarray(keySize >> 3);
    const macKey = cek2.subarray(0, keySize >> 3);
    const macSize = parseInt(enc.slice(-3), 10);
    const algorithm = `aes-${keySize}-cbc`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const expectedTag = (0, cbc_tag_js_1.default)(aad, iv2, ciphertext, macSize, macKey, keySize);
    let macCheckPassed;
    try {
      macCheckPassed = (0, timing_safe_equal_js_1.default)(tag, expectedTag);
    } catch {
    }
    if (!macCheckPassed) {
      throw new errors_js_1.JWEDecryptionFailed();
    }
    let plaintext;
    try {
      const decipher = (0, node_crypto_1.createDecipheriv)(algorithm, encKey, iv2);
      plaintext = (0, buffer_utils_js_1.concat)(decipher.update(ciphertext), decipher.final());
    } catch {
    }
    if (!plaintext) {
      throw new errors_js_1.JWEDecryptionFailed();
    }
    return plaintext;
  }
  function gcmDecrypt(enc, cek2, ciphertext, iv2, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    try {
      const decipher = (0, node_crypto_1.createDecipheriv)(algorithm, cek2, iv2, { authTagLength: 16 });
      decipher.setAuthTag(tag);
      if (aad.byteLength) {
        decipher.setAAD(aad, { plaintextLength: ciphertext.length });
      }
      const plaintext = decipher.update(ciphertext);
      decipher.final();
      return plaintext;
    } catch {
      throw new errors_js_1.JWEDecryptionFailed();
    }
  }
  const decrypt2 = (enc, cek2, ciphertext, iv2, tag, aad) => {
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(cek2)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(cek2, enc, "decrypt");
      key = node_crypto_1.KeyObject.from(cek2);
    } else if (cek2 instanceof Uint8Array || (0, is_key_object_js_1.default)(cek2)) {
      key = cek2;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(cek2, ...is_key_like_js_1.types, "Uint8Array"));
    }
    if (!iv2) {
      throw new errors_js_1.JWEInvalid("JWE Initialization Vector missing");
    }
    if (!tag) {
      throw new errors_js_1.JWEInvalid("JWE Authentication Tag missing");
    }
    (0, check_cek_length_js_1.default)(enc, key);
    (0, check_iv_length_js_1.default)(enc, iv2);
    switch (enc) {
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return cbcDecrypt(enc, key, ciphertext, iv2, tag, aad);
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        return gcmDecrypt(enc, key, ciphertext, iv2, tag, aad);
      default:
        throw new errors_js_1.JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
  };
  decrypt$2.default = decrypt2;
  return decrypt$2;
}
var is_disjoint = {};
var hasRequiredIs_disjoint;
function requireIs_disjoint() {
  if (hasRequiredIs_disjoint) return is_disjoint;
  hasRequiredIs_disjoint = 1;
  Object.defineProperty(is_disjoint, "__esModule", { value: true });
  const isDisjoint = (...headers) => {
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
      return true;
    }
    let acc;
    for (const header of sources) {
      const parameters = Object.keys(header);
      if (!acc || acc.size === 0) {
        acc = new Set(parameters);
        continue;
      }
      for (const parameter of parameters) {
        if (acc.has(parameter)) {
          return false;
        }
        acc.add(parameter);
      }
    }
    return true;
  };
  is_disjoint.default = isDisjoint;
  return is_disjoint;
}
var is_object = {};
var hasRequiredIs_object;
function requireIs_object() {
  if (hasRequiredIs_object) return is_object;
  hasRequiredIs_object = 1;
  Object.defineProperty(is_object, "__esModule", { value: true });
  is_object.default = isObject;
  function isObjectLike(value) {
    return typeof value === "object" && value !== null;
  }
  function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
      return false;
    }
    if (Object.getPrototypeOf(input) === null) {
      return true;
    }
    let proto = input;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
  }
  return is_object;
}
var decrypt_key_management = {};
var aeskw = {};
var hasRequiredAeskw;
function requireAeskw() {
  if (hasRequiredAeskw) return aeskw;
  hasRequiredAeskw = 1;
  Object.defineProperty(aeskw, "__esModule", { value: true });
  aeskw.unwrap = aeskw.wrap = void 0;
  const node_buffer_1 = require$$0$1;
  const node_crypto_1 = require$$0;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const ciphers_js_1 = /* @__PURE__ */ requireCiphers();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.slice(1, 4), 10)) {
      throw new TypeError(`Invalid key size for alg: ${alg}`);
    }
  }
  function ensureKeyObject(key, alg, usage) {
    if ((0, is_key_object_js_1.default)(key)) {
      return key;
    }
    if (key instanceof Uint8Array) {
      return (0, node_crypto_1.createSecretKey)(key);
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, usage);
      return node_crypto_1.KeyObject.from(key);
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
  }
  const wrap = (alg, key, cek2) => {
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "wrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0, node_crypto_1.createCipheriv)(algorithm, keyObject, node_buffer_1.Buffer.alloc(8, 166));
    return (0, buffer_utils_js_1.concat)(cipher.update(cek2), cipher.final());
  };
  aeskw.wrap = wrap;
  const unwrap = (alg, key, encryptedKey) => {
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "unwrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0, node_crypto_1.createDecipheriv)(algorithm, keyObject, node_buffer_1.Buffer.alloc(8, 166));
    return (0, buffer_utils_js_1.concat)(cipher.update(encryptedKey), cipher.final());
  };
  aeskw.unwrap = unwrap;
  return aeskw;
}
var ecdhes = {};
var get_named_curve = {};
var is_jwk = {};
var hasRequiredIs_jwk;
function requireIs_jwk() {
  if (hasRequiredIs_jwk) return is_jwk;
  hasRequiredIs_jwk = 1;
  Object.defineProperty(is_jwk, "__esModule", { value: true });
  is_jwk.isJWK = isJWK;
  is_jwk.isPrivateJWK = isPrivateJWK;
  is_jwk.isPublicJWK = isPublicJWK;
  is_jwk.isSecretJWK = isSecretJWK;
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  function isJWK(key) {
    return (0, is_object_js_1.default)(key) && typeof key.kty === "string";
  }
  function isPrivateJWK(key) {
    return key.kty !== "oct" && typeof key.d === "string";
  }
  function isPublicJWK(key) {
    return key.kty !== "oct" && typeof key.d === "undefined";
  }
  function isSecretJWK(key) {
    return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
  }
  return is_jwk;
}
var hasRequiredGet_named_curve;
function requireGet_named_curve() {
  if (hasRequiredGet_named_curve) return get_named_curve;
  hasRequiredGet_named_curve = 1;
  Object.defineProperty(get_named_curve, "__esModule", { value: true });
  get_named_curve.weakMap = void 0;
  const node_crypto_1 = require$$0;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const is_jwk_js_1 = /* @__PURE__ */ requireIs_jwk();
  get_named_curve.weakMap = /* @__PURE__ */ new WeakMap();
  const namedCurveToJOSE = (namedCurve) => {
    switch (namedCurve) {
      case "prime256v1":
        return "P-256";
      case "secp384r1":
        return "P-384";
      case "secp521r1":
        return "P-521";
      case "secp256k1":
        return "secp256k1";
      default:
        throw new errors_js_1.JOSENotSupported("Unsupported key curve for this operation");
    }
  };
  const getNamedCurve = (kee, raw) => {
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(kee)) {
      key = node_crypto_1.KeyObject.from(kee);
    } else if ((0, is_key_object_js_1.default)(kee)) {
      key = kee;
    } else if ((0, is_jwk_js_1.isJWK)(kee)) {
      return kee.crv;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(kee, ...is_key_like_js_1.types));
    }
    if (key.type === "secret") {
      throw new TypeError('only "private" or "public" type keys can be used for this operation');
    }
    switch (key.asymmetricKeyType) {
      case "ed25519":
      case "ed448":
        return `Ed${key.asymmetricKeyType.slice(2)}`;
      case "x25519":
      case "x448":
        return `X${key.asymmetricKeyType.slice(1)}`;
      case "ec": {
        const namedCurve = key.asymmetricKeyDetails.namedCurve;
        if (raw) {
          return namedCurve;
        }
        return namedCurveToJOSE(namedCurve);
      }
      default:
        throw new TypeError("Invalid asymmetric key type for this operation");
    }
  };
  get_named_curve.default = getNamedCurve;
  return get_named_curve;
}
var hasRequiredEcdhes;
function requireEcdhes() {
  if (hasRequiredEcdhes) return ecdhes;
  hasRequiredEcdhes = 1;
  Object.defineProperty(ecdhes, "__esModule", { value: true });
  ecdhes.ecdhAllowed = void 0;
  ecdhes.deriveKey = deriveKey;
  ecdhes.generateEpk = generateEpk;
  const node_crypto_1 = require$$0;
  const node_util_1 = require$$1;
  const get_named_curve_js_1 = /* @__PURE__ */ requireGet_named_curve();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const generateKeyPair = (0, node_util_1.promisify)(node_crypto_1.generateKeyPair);
  async function deriveKey(publicKee, privateKee, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) {
    let publicKey;
    if ((0, webcrypto_js_1.isCryptoKey)(publicKee)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(publicKee, "ECDH");
      publicKey = node_crypto_1.KeyObject.from(publicKee);
    } else if ((0, is_key_object_js_1.default)(publicKee)) {
      publicKey = publicKee;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(publicKee, ...is_key_like_js_1.types));
    }
    let privateKey;
    if ((0, webcrypto_js_1.isCryptoKey)(privateKee)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(privateKee, "ECDH", "deriveBits");
      privateKey = node_crypto_1.KeyObject.from(privateKee);
    } else if ((0, is_key_object_js_1.default)(privateKee)) {
      privateKey = privateKee;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(privateKee, ...is_key_like_js_1.types));
    }
    const value = (0, buffer_utils_js_1.concat)((0, buffer_utils_js_1.lengthAndInput)(buffer_utils_js_1.encoder.encode(algorithm)), (0, buffer_utils_js_1.lengthAndInput)(apu), (0, buffer_utils_js_1.lengthAndInput)(apv), (0, buffer_utils_js_1.uint32be)(keyLength));
    const sharedSecret = (0, node_crypto_1.diffieHellman)({ privateKey, publicKey });
    return (0, buffer_utils_js_1.concatKdf)(sharedSecret, keyLength, value);
  }
  async function generateEpk(kee) {
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(kee)) {
      key = node_crypto_1.KeyObject.from(kee);
    } else if ((0, is_key_object_js_1.default)(kee)) {
      key = kee;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(kee, ...is_key_like_js_1.types));
    }
    switch (key.asymmetricKeyType) {
      case "x25519":
        return generateKeyPair("x25519");
      case "x448": {
        return generateKeyPair("x448");
      }
      case "ec": {
        const namedCurve = (0, get_named_curve_js_1.default)(key);
        return generateKeyPair("ec", { namedCurve });
      }
      default:
        throw new errors_js_1.JOSENotSupported("Invalid or unsupported EPK");
    }
  }
  const ecdhAllowed = (key) => ["P-256", "P-384", "P-521", "X25519", "X448"].includes((0, get_named_curve_js_1.default)(key));
  ecdhes.ecdhAllowed = ecdhAllowed;
  return ecdhes;
}
var pbes2kw = {};
var check_p2s = {};
var hasRequiredCheck_p2s;
function requireCheck_p2s() {
  if (hasRequiredCheck_p2s) return check_p2s;
  hasRequiredCheck_p2s = 1;
  Object.defineProperty(check_p2s, "__esModule", { value: true });
  check_p2s.default = checkP2s;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  function checkP2s(p2s) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
      throw new errors_js_1.JWEInvalid("PBES2 Salt Input must be 8 or more octets");
    }
  }
  return check_p2s;
}
var hasRequiredPbes2kw;
function requirePbes2kw() {
  if (hasRequiredPbes2kw) return pbes2kw;
  hasRequiredPbes2kw = 1;
  Object.defineProperty(pbes2kw, "__esModule", { value: true });
  pbes2kw.decrypt = pbes2kw.encrypt = void 0;
  const node_util_1 = require$$1;
  const node_crypto_1 = require$$0;
  const random_js_1 = /* @__PURE__ */ requireRandom();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const aeskw_js_1 = /* @__PURE__ */ requireAeskw();
  const check_p2s_js_1 = /* @__PURE__ */ requireCheck_p2s();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const pbkdf2 = (0, node_util_1.promisify)(node_crypto_1.pbkdf2);
  function getPassword(key, alg) {
    if ((0, is_key_object_js_1.default)(key)) {
      return key.export();
    }
    if (key instanceof Uint8Array) {
      return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, "deriveBits", "deriveKey");
      return node_crypto_1.KeyObject.from(key).export();
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
  }
  const encrypt2 = async (alg, key, cek2, p2c = 2048, p2s = (0, random_js_1.default)(new Uint8Array(16))) => {
    (0, check_p2s_js_1.default)(p2s);
    const salt = (0, buffer_utils_js_1.p2s)(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    const encryptedKey = await (0, aeskw_js_1.wrap)(alg.slice(-6), derivedKey, cek2);
    return { encryptedKey, p2c, p2s: (0, base64url_js_1.encode)(p2s) };
  };
  pbes2kw.encrypt = encrypt2;
  const decrypt2 = async (alg, key, encryptedKey, p2c, p2s) => {
    (0, check_p2s_js_1.default)(p2s);
    const salt = (0, buffer_utils_js_1.p2s)(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    return (0, aeskw_js_1.unwrap)(alg.slice(-6), derivedKey, encryptedKey);
  };
  pbes2kw.decrypt = decrypt2;
  return pbes2kw;
}
var rsaes = {};
var check_key_length = {};
var hasRequiredCheck_key_length;
function requireCheck_key_length() {
  if (hasRequiredCheck_key_length) return check_key_length;
  hasRequiredCheck_key_length = 1;
  Object.defineProperty(check_key_length, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  check_key_length.default = (key, alg) => {
    let modulusLength;
    try {
      if (key instanceof node_crypto_1.KeyObject) {
        modulusLength = key.asymmetricKeyDetails?.modulusLength;
      } else {
        modulusLength = Buffer.from(key.n, "base64url").byteLength << 3;
      }
    } catch {
    }
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  };
  return check_key_length;
}
var hasRequiredRsaes;
function requireRsaes() {
  if (hasRequiredRsaes) return rsaes;
  hasRequiredRsaes = 1;
  Object.defineProperty(rsaes, "__esModule", { value: true });
  rsaes.decrypt = rsaes.encrypt = void 0;
  const node_crypto_1 = require$$0;
  const node_util_1 = require$$1;
  const check_key_length_js_1 = /* @__PURE__ */ requireCheck_key_length();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const checkKey = (key, alg) => {
    if (key.asymmetricKeyType !== "rsa") {
      throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
    }
    (0, check_key_length_js_1.default)(key, alg);
  };
  const RSA1_5 = (0, node_util_1.deprecate)(() => node_crypto_1.constants.RSA_PKCS1_PADDING, 'The RSA1_5 "alg" (JWE Algorithm) is deprecated and will be removed in the next major revision.');
  const resolvePadding = (alg) => {
    switch (alg) {
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512":
        return node_crypto_1.constants.RSA_PKCS1_OAEP_PADDING;
      case "RSA1_5":
        return RSA1_5();
      default:
        return void 0;
    }
  };
  const resolveOaepHash = (alg) => {
    switch (alg) {
      case "RSA-OAEP":
        return "sha1";
      case "RSA-OAEP-256":
        return "sha256";
      case "RSA-OAEP-384":
        return "sha384";
      case "RSA-OAEP-512":
        return "sha512";
      default:
        return void 0;
    }
  };
  function ensureKeyObject(key, alg, ...usages) {
    if ((0, is_key_object_js_1.default)(key)) {
      return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, ...usages);
      return node_crypto_1.KeyObject.from(key);
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
  }
  const encrypt2 = (alg, key, cek2) => {
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = ensureKeyObject(key, alg, "wrapKey", "encrypt");
    checkKey(keyObject, alg);
    return (0, node_crypto_1.publicEncrypt)({ key: keyObject, oaepHash, padding }, cek2);
  };
  rsaes.encrypt = encrypt2;
  const decrypt2 = (alg, key, encryptedKey) => {
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = ensureKeyObject(key, alg, "unwrapKey", "decrypt");
    checkKey(keyObject, alg);
    return (0, node_crypto_1.privateDecrypt)({ key: keyObject, oaepHash, padding }, encryptedKey);
  };
  rsaes.decrypt = decrypt2;
  return rsaes;
}
var normalize_key = {};
var hasRequiredNormalize_key;
function requireNormalize_key() {
  if (hasRequiredNormalize_key) return normalize_key;
  hasRequiredNormalize_key = 1;
  Object.defineProperty(normalize_key, "__esModule", { value: true });
  normalize_key.default = {};
  return normalize_key;
}
var cek = {};
var hasRequiredCek;
function requireCek() {
  if (hasRequiredCek) return cek;
  hasRequiredCek = 1;
  Object.defineProperty(cek, "__esModule", { value: true });
  cek.bitLength = bitLength;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const random_js_1 = /* @__PURE__ */ requireRandom();
  function bitLength(alg) {
    switch (alg) {
      case "A128GCM":
        return 128;
      case "A192GCM":
        return 192;
      case "A256GCM":
      case "A128CBC-HS256":
        return 256;
      case "A192CBC-HS384":
        return 384;
      case "A256CBC-HS512":
        return 512;
      default:
        throw new errors_js_1.JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
  }
  cek.default = (alg) => (0, random_js_1.default)(new Uint8Array(bitLength(alg) >> 3));
  return cek;
}
var _import = {};
var asn1 = {};
var hasRequiredAsn1;
function requireAsn1() {
  if (hasRequiredAsn1) return asn1;
  hasRequiredAsn1 = 1;
  Object.defineProperty(asn1, "__esModule", { value: true });
  asn1.fromX509 = asn1.fromSPKI = asn1.fromPKCS8 = asn1.toPKCS8 = asn1.toSPKI = void 0;
  const node_crypto_1 = require$$0;
  const node_buffer_1 = require$$0$1;
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const genericExport = (keyType, keyFormat, key) => {
    let keyObject;
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      if (!key.extractable) {
        throw new TypeError("CryptoKey is not extractable");
      }
      keyObject = node_crypto_1.KeyObject.from(key);
    } else if ((0, is_key_object_js_1.default)(key)) {
      keyObject = key;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
    }
    if (keyObject.type !== keyType) {
      throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({ format: "pem", type: keyFormat });
  };
  const toSPKI = (key) => {
    return genericExport("public", "spki", key);
  };
  asn1.toSPKI = toSPKI;
  const toPKCS8 = (key) => {
    return genericExport("private", "pkcs8", key);
  };
  asn1.toPKCS8 = toPKCS8;
  const fromPKCS8 = (pem) => (0, node_crypto_1.createPrivateKey)({
    key: node_buffer_1.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ""), "base64"),
    type: "pkcs8",
    format: "der"
  });
  asn1.fromPKCS8 = fromPKCS8;
  const fromSPKI = (pem) => (0, node_crypto_1.createPublicKey)({
    key: node_buffer_1.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ""), "base64"),
    type: "spki",
    format: "der"
  });
  asn1.fromSPKI = fromSPKI;
  const fromX509 = (pem) => (0, node_crypto_1.createPublicKey)({
    key: pem,
    type: "spki",
    format: "pem"
  });
  asn1.fromX509 = fromX509;
  return asn1;
}
var jwk_to_key = {};
var hasRequiredJwk_to_key;
function requireJwk_to_key() {
  if (hasRequiredJwk_to_key) return jwk_to_key;
  hasRequiredJwk_to_key = 1;
  Object.defineProperty(jwk_to_key, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const parse = (key) => {
    if (key.d) {
      return (0, node_crypto_1.createPrivateKey)({ format: "jwk", key });
    }
    return (0, node_crypto_1.createPublicKey)({ format: "jwk", key });
  };
  jwk_to_key.default = parse;
  return jwk_to_key;
}
var hasRequired_import;
function require_import() {
  if (hasRequired_import) return _import;
  hasRequired_import = 1;
  Object.defineProperty(_import, "__esModule", { value: true });
  _import.importSPKI = importSPKI;
  _import.importX509 = importX509;
  _import.importPKCS8 = importPKCS8;
  _import.importJWK = importJWK;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const asn1_js_1 = /* @__PURE__ */ requireAsn1();
  const jwk_to_key_js_1 = /* @__PURE__ */ requireJwk_to_key();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  async function importSPKI(spki, alg, options) {
    if (typeof spki !== "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) {
      throw new TypeError('"spki" must be SPKI formatted string');
    }
    return (0, asn1_js_1.fromSPKI)(spki, alg, options);
  }
  async function importX509(x509, alg, options) {
    if (typeof x509 !== "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0) {
      throw new TypeError('"x509" must be X.509 formatted string');
    }
    return (0, asn1_js_1.fromX509)(x509, alg, options);
  }
  async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) {
      throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return (0, asn1_js_1.fromPKCS8)(pkcs8, alg, options);
  }
  async function importJWK(jwk, alg) {
    if (!(0, is_object_js_1.default)(jwk)) {
      throw new TypeError("JWK must be an object");
    }
    alg ||= jwk.alg;
    switch (jwk.kty) {
      case "oct":
        if (typeof jwk.k !== "string" || !jwk.k) {
          throw new TypeError('missing "k" (Key Value) Parameter value');
        }
        return (0, base64url_js_1.decode)(jwk.k);
      case "RSA":
        if ("oth" in jwk && jwk.oth !== void 0) {
          throw new errors_js_1.JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
        }
      case "EC":
      case "OKP":
        return (0, jwk_to_key_js_1.default)({ ...jwk, alg });
      default:
        throw new errors_js_1.JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
    }
  }
  return _import;
}
var check_key_type = {};
var hasRequiredCheck_key_type;
function requireCheck_key_type() {
  if (hasRequiredCheck_key_type) return check_key_type;
  hasRequiredCheck_key_type = 1;
  Object.defineProperty(check_key_type, "__esModule", { value: true });
  check_key_type.checkKeyTypeWithJwk = void 0;
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const jwk = /* @__PURE__ */ requireIs_jwk();
  const tag = (key) => key?.[Symbol.toStringTag];
  const jwkMatchesOp = (alg, key, usage) => {
    if (key.use !== void 0 && key.use !== "sig") {
      throw new TypeError("Invalid key for this operation, when present its use must be sig");
    }
    if (key.key_ops !== void 0 && key.key_ops.includes?.(usage) !== true) {
      throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
    }
    if (key.alg !== void 0 && key.alg !== alg) {
      throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
    }
    return true;
  };
  const symmetricTypeCheck = (alg, key, usage, allowJwk) => {
    if (key instanceof Uint8Array)
      return;
    if (allowJwk && jwk.isJWK(key)) {
      if (jwk.isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
        return;
      throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!(0, is_key_like_js_1.default)(key)) {
      throw new TypeError((0, invalid_key_input_js_1.withAlg)(alg, key, ...is_key_like_js_1.types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
    }
    if (key.type !== "secret") {
      throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
  };
  const asymmetricTypeCheck = (alg, key, usage, allowJwk) => {
    if (allowJwk && jwk.isJWK(key)) {
      switch (usage) {
        case "sign":
          if (jwk.isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
            return;
          throw new TypeError(`JSON Web Key for this operation be a private JWK`);
        case "verify":
          if (jwk.isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
            return;
          throw new TypeError(`JSON Web Key for this operation be a public JWK`);
      }
    }
    if (!(0, is_key_like_js_1.default)(key)) {
      throw new TypeError((0, invalid_key_input_js_1.withAlg)(alg, key, ...is_key_like_js_1.types, allowJwk ? "JSON Web Key" : null));
    }
    if (key.type === "secret") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === "sign" && key.type === "public") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === "decrypt" && key.type === "public") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === "verify" && key.type === "private") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === "encrypt" && key.type === "private") {
      throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
  };
  function checkKeyType(allowJwk, alg, key, usage) {
    const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
      symmetricTypeCheck(alg, key, usage, allowJwk);
    } else {
      asymmetricTypeCheck(alg, key, usage, allowJwk);
    }
  }
  check_key_type.default = checkKeyType.bind(void 0, false);
  check_key_type.checkKeyTypeWithJwk = checkKeyType.bind(void 0, true);
  return check_key_type;
}
var aesgcmkw = {};
var encrypt$4 = {};
var hasRequiredEncrypt$4;
function requireEncrypt$4() {
  if (hasRequiredEncrypt$4) return encrypt$4;
  hasRequiredEncrypt$4 = 1;
  Object.defineProperty(encrypt$4, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const check_iv_length_js_1 = /* @__PURE__ */ requireCheck_iv_length();
  const check_cek_length_js_1 = /* @__PURE__ */ requireCheck_cek_length();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const cbc_tag_js_1 = /* @__PURE__ */ requireCbc_tag();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const iv_js_1 = /* @__PURE__ */ requireIv();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const ciphers_js_1 = /* @__PURE__ */ requireCiphers();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  function cbcEncrypt(enc, plaintext, cek2, iv2, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if ((0, is_key_object_js_1.default)(cek2)) {
      cek2 = cek2.export();
    }
    const encKey = cek2.subarray(keySize >> 3);
    const macKey = cek2.subarray(0, keySize >> 3);
    const algorithm = `aes-${keySize}-cbc`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0, node_crypto_1.createCipheriv)(algorithm, encKey, iv2);
    const ciphertext = (0, buffer_utils_js_1.concat)(cipher.update(plaintext), cipher.final());
    const macSize = parseInt(enc.slice(-3), 10);
    const tag = (0, cbc_tag_js_1.default)(aad, iv2, ciphertext, macSize, macKey, keySize);
    return { ciphertext, tag, iv: iv2 };
  }
  function gcmEncrypt(enc, plaintext, cek2, iv2, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
      throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0, node_crypto_1.createCipheriv)(algorithm, cek2, iv2, { authTagLength: 16 });
    if (aad.byteLength) {
      cipher.setAAD(aad, { plaintextLength: plaintext.length });
    }
    const ciphertext = cipher.update(plaintext);
    cipher.final();
    const tag = cipher.getAuthTag();
    return { ciphertext, tag, iv: iv2 };
  }
  const encrypt2 = (enc, plaintext, cek2, iv2, aad) => {
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(cek2)) {
      (0, crypto_key_js_1.checkEncCryptoKey)(cek2, enc, "encrypt");
      key = node_crypto_1.KeyObject.from(cek2);
    } else if (cek2 instanceof Uint8Array || (0, is_key_object_js_1.default)(cek2)) {
      key = cek2;
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(cek2, ...is_key_like_js_1.types, "Uint8Array"));
    }
    (0, check_cek_length_js_1.default)(enc, key);
    if (iv2) {
      (0, check_iv_length_js_1.default)(enc, iv2);
    } else {
      iv2 = (0, iv_js_1.default)(enc);
    }
    switch (enc) {
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        return cbcEncrypt(enc, plaintext, key, iv2, aad);
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        return gcmEncrypt(enc, plaintext, key, iv2, aad);
      default:
        throw new errors_js_1.JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
  };
  encrypt$4.default = encrypt2;
  return encrypt$4;
}
var hasRequiredAesgcmkw;
function requireAesgcmkw() {
  if (hasRequiredAesgcmkw) return aesgcmkw;
  hasRequiredAesgcmkw = 1;
  Object.defineProperty(aesgcmkw, "__esModule", { value: true });
  aesgcmkw.wrap = wrap;
  aesgcmkw.unwrap = unwrap;
  const encrypt_js_1 = /* @__PURE__ */ requireEncrypt$4();
  const decrypt_js_1 = /* @__PURE__ */ requireDecrypt$4();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  async function wrap(alg, key, cek2, iv2) {
    const jweAlgorithm = alg.slice(0, 7);
    const wrapped = await (0, encrypt_js_1.default)(jweAlgorithm, cek2, key, iv2, new Uint8Array(0));
    return {
      encryptedKey: wrapped.ciphertext,
      iv: (0, base64url_js_1.encode)(wrapped.iv),
      tag: (0, base64url_js_1.encode)(wrapped.tag)
    };
  }
  async function unwrap(alg, key, encryptedKey, iv2, tag) {
    const jweAlgorithm = alg.slice(0, 7);
    return (0, decrypt_js_1.default)(jweAlgorithm, key, encryptedKey, iv2, tag, new Uint8Array(0));
  }
  return aesgcmkw;
}
var hasRequiredDecrypt_key_management;
function requireDecrypt_key_management() {
  if (hasRequiredDecrypt_key_management) return decrypt_key_management;
  hasRequiredDecrypt_key_management = 1;
  Object.defineProperty(decrypt_key_management, "__esModule", { value: true });
  const aeskw_js_1 = /* @__PURE__ */ requireAeskw();
  const ECDH = /* @__PURE__ */ requireEcdhes();
  const pbes2kw_js_1 = /* @__PURE__ */ requirePbes2kw();
  const rsaes_js_1 = /* @__PURE__ */ requireRsaes();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const normalize_key_js_1 = /* @__PURE__ */ requireNormalize_key();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const cek_js_1 = /* @__PURE__ */ requireCek();
  const import_js_1 = /* @__PURE__ */ require_import();
  const check_key_type_js_1 = /* @__PURE__ */ requireCheck_key_type();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const aesgcmkw_js_1 = /* @__PURE__ */ requireAesgcmkw();
  async function decryptKeyManagement(alg, key, encryptedKey, joseHeader, options) {
    (0, check_key_type_js_1.default)(alg, key, "decrypt");
    key = await normalize_key_js_1.default.normalizePrivateKey?.(key, alg) || key;
    switch (alg) {
      case "dir": {
        if (encryptedKey !== void 0)
          throw new errors_js_1.JWEInvalid("Encountered unexpected JWE Encrypted Key");
        return key;
      }
      case "ECDH-ES":
        if (encryptedKey !== void 0)
          throw new errors_js_1.JWEInvalid("Encountered unexpected JWE Encrypted Key");
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW": {
        if (!(0, is_object_js_1.default)(joseHeader.epk))
          throw new errors_js_1.JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
        if (!ECDH.ecdhAllowed(key))
          throw new errors_js_1.JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
        const epk = await (0, import_js_1.importJWK)(joseHeader.epk, alg);
        let partyUInfo;
        let partyVInfo;
        if (joseHeader.apu !== void 0) {
          if (typeof joseHeader.apu !== "string")
            throw new errors_js_1.JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
          try {
            partyUInfo = (0, base64url_js_1.decode)(joseHeader.apu);
          } catch {
            throw new errors_js_1.JWEInvalid("Failed to base64url decode the apu");
          }
        }
        if (joseHeader.apv !== void 0) {
          if (typeof joseHeader.apv !== "string")
            throw new errors_js_1.JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
          try {
            partyVInfo = (0, base64url_js_1.decode)(joseHeader.apv);
          } catch {
            throw new errors_js_1.JWEInvalid("Failed to base64url decode the apv");
          }
        }
        const sharedSecret = await ECDH.deriveKey(epk, key, alg === "ECDH-ES" ? joseHeader.enc : alg, alg === "ECDH-ES" ? (0, cek_js_1.bitLength)(joseHeader.enc) : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
        if (alg === "ECDH-ES")
          return sharedSecret;
        if (encryptedKey === void 0)
          throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
        return (0, aeskw_js_1.unwrap)(alg.slice(-6), sharedSecret, encryptedKey);
      }
      case "RSA1_5":
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512": {
        if (encryptedKey === void 0)
          throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
        return (0, rsaes_js_1.decrypt)(alg, key, encryptedKey);
      }
      case "PBES2-HS256+A128KW":
      case "PBES2-HS384+A192KW":
      case "PBES2-HS512+A256KW": {
        if (encryptedKey === void 0)
          throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
        if (typeof joseHeader.p2c !== "number")
          throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
        const p2cLimit = options?.maxPBES2Count || 1e4;
        if (joseHeader.p2c > p2cLimit)
          throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
        if (typeof joseHeader.p2s !== "string")
          throw new errors_js_1.JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
        let p2s;
        try {
          p2s = (0, base64url_js_1.decode)(joseHeader.p2s);
        } catch {
          throw new errors_js_1.JWEInvalid("Failed to base64url decode the p2s");
        }
        return (0, pbes2kw_js_1.decrypt)(alg, key, encryptedKey, joseHeader.p2c, p2s);
      }
      case "A128KW":
      case "A192KW":
      case "A256KW": {
        if (encryptedKey === void 0)
          throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
        return (0, aeskw_js_1.unwrap)(alg, key, encryptedKey);
      }
      case "A128GCMKW":
      case "A192GCMKW":
      case "A256GCMKW": {
        if (encryptedKey === void 0)
          throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
        if (typeof joseHeader.iv !== "string")
          throw new errors_js_1.JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
        if (typeof joseHeader.tag !== "string")
          throw new errors_js_1.JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
        let iv2;
        try {
          iv2 = (0, base64url_js_1.decode)(joseHeader.iv);
        } catch {
          throw new errors_js_1.JWEInvalid("Failed to base64url decode the iv");
        }
        let tag;
        try {
          tag = (0, base64url_js_1.decode)(joseHeader.tag);
        } catch {
          throw new errors_js_1.JWEInvalid("Failed to base64url decode the tag");
        }
        return (0, aesgcmkw_js_1.unwrap)(alg, key, encryptedKey, iv2, tag);
      }
      default: {
        throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
      }
    }
  }
  decrypt_key_management.default = decryptKeyManagement;
  return decrypt_key_management;
}
var validate_crit = {};
var hasRequiredValidate_crit;
function requireValidate_crit() {
  if (hasRequiredValidate_crit) return validate_crit;
  hasRequiredValidate_crit = 1;
  Object.defineProperty(validate_crit, "__esModule", { value: true });
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
      throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === void 0) {
      return /* @__PURE__ */ new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
      throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== void 0) {
      recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
    } else {
      recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit) {
      if (!recognized.has(parameter)) {
        throw new errors_js_1.JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
      }
      if (joseHeader[parameter] === void 0) {
        throw new Err(`Extension Header Parameter "${parameter}" is missing`);
      }
      if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
        throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
      }
    }
    return new Set(protectedHeader.crit);
  }
  validate_crit.default = validateCrit;
  return validate_crit;
}
var validate_algorithms = {};
var hasRequiredValidate_algorithms;
function requireValidate_algorithms() {
  if (hasRequiredValidate_algorithms) return validate_algorithms;
  hasRequiredValidate_algorithms = 1;
  Object.defineProperty(validate_algorithms, "__esModule", { value: true });
  const validateAlgorithms = (option, algorithms) => {
    if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
      throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
      return void 0;
    }
    return new Set(algorithms);
  };
  validate_algorithms.default = validateAlgorithms;
  return validate_algorithms;
}
var hasRequiredDecrypt$3;
function requireDecrypt$3() {
  if (hasRequiredDecrypt$3) return decrypt$3;
  hasRequiredDecrypt$3 = 1;
  Object.defineProperty(decrypt$3, "__esModule", { value: true });
  decrypt$3.flattenedDecrypt = flattenedDecrypt;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const decrypt_js_1 = /* @__PURE__ */ requireDecrypt$4();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_disjoint_js_1 = /* @__PURE__ */ requireIs_disjoint();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const decrypt_key_management_js_1 = /* @__PURE__ */ requireDecrypt_key_management();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const cek_js_1 = /* @__PURE__ */ requireCek();
  const validate_crit_js_1 = /* @__PURE__ */ requireValidate_crit();
  const validate_algorithms_js_1 = /* @__PURE__ */ requireValidate_algorithms();
  async function flattenedDecrypt(jwe, key, options) {
    if (!(0, is_object_js_1.default)(jwe)) {
      throw new errors_js_1.JWEInvalid("Flattened JWE must be an object");
    }
    if (jwe.protected === void 0 && jwe.header === void 0 && jwe.unprotected === void 0) {
      throw new errors_js_1.JWEInvalid("JOSE Header missing");
    }
    if (jwe.iv !== void 0 && typeof jwe.iv !== "string") {
      throw new errors_js_1.JWEInvalid("JWE Initialization Vector incorrect type");
    }
    if (typeof jwe.ciphertext !== "string") {
      throw new errors_js_1.JWEInvalid("JWE Ciphertext missing or incorrect type");
    }
    if (jwe.tag !== void 0 && typeof jwe.tag !== "string") {
      throw new errors_js_1.JWEInvalid("JWE Authentication Tag incorrect type");
    }
    if (jwe.protected !== void 0 && typeof jwe.protected !== "string") {
      throw new errors_js_1.JWEInvalid("JWE Protected Header incorrect type");
    }
    if (jwe.encrypted_key !== void 0 && typeof jwe.encrypted_key !== "string") {
      throw new errors_js_1.JWEInvalid("JWE Encrypted Key incorrect type");
    }
    if (jwe.aad !== void 0 && typeof jwe.aad !== "string") {
      throw new errors_js_1.JWEInvalid("JWE AAD incorrect type");
    }
    if (jwe.header !== void 0 && !(0, is_object_js_1.default)(jwe.header)) {
      throw new errors_js_1.JWEInvalid("JWE Shared Unprotected Header incorrect type");
    }
    if (jwe.unprotected !== void 0 && !(0, is_object_js_1.default)(jwe.unprotected)) {
      throw new errors_js_1.JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
    }
    let parsedProt;
    if (jwe.protected) {
      try {
        const protectedHeader2 = (0, base64url_js_1.decode)(jwe.protected);
        parsedProt = JSON.parse(buffer_utils_js_1.decoder.decode(protectedHeader2));
      } catch {
        throw new errors_js_1.JWEInvalid("JWE Protected Header is invalid");
      }
    }
    if (!(0, is_disjoint_js_1.default)(parsedProt, jwe.header, jwe.unprotected)) {
      throw new errors_js_1.JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...parsedProt,
      ...jwe.header,
      ...jwe.unprotected
    };
    (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, /* @__PURE__ */ new Map(), options?.crit, parsedProt, joseHeader);
    if (joseHeader.zip !== void 0) {
      throw new errors_js_1.JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
    }
    const { alg, enc } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new errors_js_1.JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
    }
    if (typeof enc !== "string" || !enc) {
      throw new errors_js_1.JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
    }
    const keyManagementAlgorithms = options && (0, validate_algorithms_js_1.default)("keyManagementAlgorithms", options.keyManagementAlgorithms);
    const contentEncryptionAlgorithms = options && (0, validate_algorithms_js_1.default)("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms);
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg) || !keyManagementAlgorithms && alg.startsWith("PBES2")) {
      throw new errors_js_1.JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
      throw new errors_js_1.JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter value not allowed');
    }
    let encryptedKey;
    if (jwe.encrypted_key !== void 0) {
      try {
        encryptedKey = (0, base64url_js_1.decode)(jwe.encrypted_key);
      } catch {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the encrypted_key");
      }
    }
    let resolvedKey = false;
    if (typeof key === "function") {
      key = await key(parsedProt, jwe);
      resolvedKey = true;
    }
    let cek2;
    try {
      cek2 = await (0, decrypt_key_management_js_1.default)(alg, key, encryptedKey, joseHeader, options);
    } catch (err) {
      if (err instanceof TypeError || err instanceof errors_js_1.JWEInvalid || err instanceof errors_js_1.JOSENotSupported) {
        throw err;
      }
      cek2 = (0, cek_js_1.default)(enc);
    }
    let iv2;
    let tag;
    if (jwe.iv !== void 0) {
      try {
        iv2 = (0, base64url_js_1.decode)(jwe.iv);
      } catch {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the iv");
      }
    }
    if (jwe.tag !== void 0) {
      try {
        tag = (0, base64url_js_1.decode)(jwe.tag);
      } catch {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the tag");
      }
    }
    const protectedHeader = buffer_utils_js_1.encoder.encode(jwe.protected ?? "");
    let additionalData;
    if (jwe.aad !== void 0) {
      additionalData = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), buffer_utils_js_1.encoder.encode(jwe.aad));
    } else {
      additionalData = protectedHeader;
    }
    let ciphertext;
    try {
      ciphertext = (0, base64url_js_1.decode)(jwe.ciphertext);
    } catch {
      throw new errors_js_1.JWEInvalid("Failed to base64url decode the ciphertext");
    }
    const plaintext = await (0, decrypt_js_1.default)(enc, cek2, ciphertext, iv2, tag, additionalData);
    const result = { plaintext };
    if (jwe.protected !== void 0) {
      result.protectedHeader = parsedProt;
    }
    if (jwe.aad !== void 0) {
      try {
        result.additionalAuthenticatedData = (0, base64url_js_1.decode)(jwe.aad);
      } catch {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the aad");
      }
    }
    if (jwe.unprotected !== void 0) {
      result.sharedUnprotectedHeader = jwe.unprotected;
    }
    if (jwe.header !== void 0) {
      result.unprotectedHeader = jwe.header;
    }
    if (resolvedKey) {
      return { ...result, key };
    }
    return result;
  }
  return decrypt$3;
}
var hasRequiredDecrypt$2;
function requireDecrypt$2() {
  if (hasRequiredDecrypt$2) return decrypt$4;
  hasRequiredDecrypt$2 = 1;
  Object.defineProperty(decrypt$4, "__esModule", { value: true });
  decrypt$4.compactDecrypt = compactDecrypt;
  const decrypt_js_1 = /* @__PURE__ */ requireDecrypt$3();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  async function compactDecrypt(jwe, key, options) {
    if (jwe instanceof Uint8Array) {
      jwe = buffer_utils_js_1.decoder.decode(jwe);
    }
    if (typeof jwe !== "string") {
      throw new errors_js_1.JWEInvalid("Compact JWE must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: encryptedKey, 2: iv2, 3: ciphertext, 4: tag, length } = jwe.split(".");
    if (length !== 5) {
      throw new errors_js_1.JWEInvalid("Invalid Compact JWE");
    }
    const decrypted = await (0, decrypt_js_1.flattenedDecrypt)({
      ciphertext,
      iv: iv2 || void 0,
      protected: protectedHeader,
      tag: tag || void 0,
      encrypted_key: encryptedKey || void 0
    }, key, options);
    const result = { plaintext: decrypted.plaintext, protectedHeader: decrypted.protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: decrypted.key };
    }
    return result;
  }
  return decrypt$4;
}
var decrypt$1 = {};
var hasRequiredDecrypt$1;
function requireDecrypt$1() {
  if (hasRequiredDecrypt$1) return decrypt$1;
  hasRequiredDecrypt$1 = 1;
  Object.defineProperty(decrypt$1, "__esModule", { value: true });
  decrypt$1.generalDecrypt = generalDecrypt;
  const decrypt_js_1 = /* @__PURE__ */ requireDecrypt$3();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  async function generalDecrypt(jwe, key, options) {
    if (!(0, is_object_js_1.default)(jwe)) {
      throw new errors_js_1.JWEInvalid("General JWE must be an object");
    }
    if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(is_object_js_1.default)) {
      throw new errors_js_1.JWEInvalid("JWE Recipients missing or incorrect type");
    }
    if (!jwe.recipients.length) {
      throw new errors_js_1.JWEInvalid("JWE Recipients has no members");
    }
    for (const recipient of jwe.recipients) {
      try {
        return await (0, decrypt_js_1.flattenedDecrypt)({
          aad: jwe.aad,
          ciphertext: jwe.ciphertext,
          encrypted_key: recipient.encrypted_key,
          header: recipient.header,
          iv: jwe.iv,
          protected: jwe.protected,
          tag: jwe.tag,
          unprotected: jwe.unprotected
        }, key, options);
      } catch {
      }
    }
    throw new errors_js_1.JWEDecryptionFailed();
  }
  return decrypt$1;
}
var encrypt$3 = {};
var encrypt$2 = {};
var private_symbols = {};
var hasRequiredPrivate_symbols;
function requirePrivate_symbols() {
  if (hasRequiredPrivate_symbols) return private_symbols;
  hasRequiredPrivate_symbols = 1;
  Object.defineProperty(private_symbols, "__esModule", { value: true });
  private_symbols.unprotected = void 0;
  private_symbols.unprotected = /* @__PURE__ */ Symbol();
  return private_symbols;
}
var encrypt_key_management = {};
var _export = {};
var key_to_jwk = {};
var hasRequiredKey_to_jwk;
function requireKey_to_jwk() {
  if (hasRequiredKey_to_jwk) return key_to_jwk;
  hasRequiredKey_to_jwk = 1;
  Object.defineProperty(key_to_jwk, "__esModule", { value: true });
  const node_crypto_1 = require$$0;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const is_key_object_js_1 = /* @__PURE__ */ requireIs_key_object();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const keyToJWK = (key) => {
    let keyObject;
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      if (!key.extractable) {
        throw new TypeError("CryptoKey is not extractable");
      }
      keyObject = node_crypto_1.KeyObject.from(key);
    } else if ((0, is_key_object_js_1.default)(key)) {
      keyObject = key;
    } else if (key instanceof Uint8Array) {
      return {
        kty: "oct",
        k: (0, base64url_js_1.encode)(key)
      };
    } else {
      throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
    }
    if (keyObject.type !== "secret" && !["rsa", "ec", "ed25519", "x25519", "ed448", "x448"].includes(keyObject.asymmetricKeyType)) {
      throw new errors_js_1.JOSENotSupported("Unsupported key asymmetricKeyType");
    }
    return keyObject.export({ format: "jwk" });
  };
  key_to_jwk.default = keyToJWK;
  return key_to_jwk;
}
var hasRequired_export;
function require_export() {
  if (hasRequired_export) return _export;
  hasRequired_export = 1;
  Object.defineProperty(_export, "__esModule", { value: true });
  _export.exportSPKI = exportSPKI;
  _export.exportPKCS8 = exportPKCS8;
  _export.exportJWK = exportJWK;
  const asn1_js_1 = /* @__PURE__ */ requireAsn1();
  const asn1_js_2 = /* @__PURE__ */ requireAsn1();
  const key_to_jwk_js_1 = /* @__PURE__ */ requireKey_to_jwk();
  async function exportSPKI(key) {
    return (0, asn1_js_1.toSPKI)(key);
  }
  async function exportPKCS8(key) {
    return (0, asn1_js_2.toPKCS8)(key);
  }
  async function exportJWK(key) {
    return (0, key_to_jwk_js_1.default)(key);
  }
  return _export;
}
var hasRequiredEncrypt_key_management;
function requireEncrypt_key_management() {
  if (hasRequiredEncrypt_key_management) return encrypt_key_management;
  hasRequiredEncrypt_key_management = 1;
  Object.defineProperty(encrypt_key_management, "__esModule", { value: true });
  const aeskw_js_1 = /* @__PURE__ */ requireAeskw();
  const ECDH = /* @__PURE__ */ requireEcdhes();
  const pbes2kw_js_1 = /* @__PURE__ */ requirePbes2kw();
  const rsaes_js_1 = /* @__PURE__ */ requireRsaes();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const normalize_key_js_1 = /* @__PURE__ */ requireNormalize_key();
  const cek_js_1 = /* @__PURE__ */ requireCek();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const export_js_1 = /* @__PURE__ */ require_export();
  const check_key_type_js_1 = /* @__PURE__ */ requireCheck_key_type();
  const aesgcmkw_js_1 = /* @__PURE__ */ requireAesgcmkw();
  async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek2;
    (0, check_key_type_js_1.default)(alg, key, "encrypt");
    key = await normalize_key_js_1.default.normalizePublicKey?.(key, alg) || key;
    switch (alg) {
      case "dir": {
        cek2 = key;
        break;
      }
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW": {
        if (!ECDH.ecdhAllowed(key)) {
          throw new errors_js_1.JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
        }
        const { apu, apv } = providedParameters;
        let { epk: ephemeralKey } = providedParameters;
        ephemeralKey ||= (await ECDH.generateEpk(key)).privateKey;
        const { x, y, crv, kty } = await (0, export_js_1.exportJWK)(ephemeralKey);
        const sharedSecret = await ECDH.deriveKey(key, ephemeralKey, alg === "ECDH-ES" ? enc : alg, alg === "ECDH-ES" ? (0, cek_js_1.bitLength)(enc) : parseInt(alg.slice(-5, -2), 10), apu, apv);
        parameters = { epk: { x, crv, kty } };
        if (kty === "EC")
          parameters.epk.y = y;
        if (apu)
          parameters.apu = (0, base64url_js_1.encode)(apu);
        if (apv)
          parameters.apv = (0, base64url_js_1.encode)(apv);
        if (alg === "ECDH-ES") {
          cek2 = sharedSecret;
          break;
        }
        cek2 = providedCek || (0, cek_js_1.default)(enc);
        const kwAlg = alg.slice(-6);
        encryptedKey = await (0, aeskw_js_1.wrap)(kwAlg, sharedSecret, cek2);
        break;
      }
      case "RSA1_5":
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512": {
        cek2 = providedCek || (0, cek_js_1.default)(enc);
        encryptedKey = await (0, rsaes_js_1.encrypt)(alg, key, cek2);
        break;
      }
      case "PBES2-HS256+A128KW":
      case "PBES2-HS384+A192KW":
      case "PBES2-HS512+A256KW": {
        cek2 = providedCek || (0, cek_js_1.default)(enc);
        const { p2c, p2s } = providedParameters;
        ({ encryptedKey, ...parameters } = await (0, pbes2kw_js_1.encrypt)(alg, key, cek2, p2c, p2s));
        break;
      }
      case "A128KW":
      case "A192KW":
      case "A256KW": {
        cek2 = providedCek || (0, cek_js_1.default)(enc);
        encryptedKey = await (0, aeskw_js_1.wrap)(alg, key, cek2);
        break;
      }
      case "A128GCMKW":
      case "A192GCMKW":
      case "A256GCMKW": {
        cek2 = providedCek || (0, cek_js_1.default)(enc);
        const { iv: iv2 } = providedParameters;
        ({ encryptedKey, ...parameters } = await (0, aesgcmkw_js_1.wrap)(alg, key, cek2, iv2));
        break;
      }
      default: {
        throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
      }
    }
    return { cek: cek2, encryptedKey, parameters };
  }
  encrypt_key_management.default = encryptKeyManagement;
  return encrypt_key_management;
}
var hasRequiredEncrypt$3;
function requireEncrypt$3() {
  if (hasRequiredEncrypt$3) return encrypt$2;
  hasRequiredEncrypt$3 = 1;
  Object.defineProperty(encrypt$2, "__esModule", { value: true });
  encrypt$2.FlattenedEncrypt = void 0;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const private_symbols_js_1 = /* @__PURE__ */ requirePrivate_symbols();
  const encrypt_js_1 = /* @__PURE__ */ requireEncrypt$4();
  const encrypt_key_management_js_1 = /* @__PURE__ */ requireEncrypt_key_management();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_disjoint_js_1 = /* @__PURE__ */ requireIs_disjoint();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const validate_crit_js_1 = /* @__PURE__ */ requireValidate_crit();
  class FlattenedEncrypt {
    _plaintext;
    _protectedHeader;
    _sharedUnprotectedHeader;
    _unprotectedHeader;
    _aad;
    _cek;
    _iv;
    _keyManagementParameters;
    constructor(plaintext) {
      if (!(plaintext instanceof Uint8Array)) {
        throw new TypeError("plaintext must be an instance of Uint8Array");
      }
      this._plaintext = plaintext;
    }
    setKeyManagementParameters(parameters) {
      if (this._keyManagementParameters) {
        throw new TypeError("setKeyManagementParameters can only be called once");
      }
      this._keyManagementParameters = parameters;
      return this;
    }
    setProtectedHeader(protectedHeader) {
      if (this._protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this._protectedHeader = protectedHeader;
      return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
      if (this._sharedUnprotectedHeader) {
        throw new TypeError("setSharedUnprotectedHeader can only be called once");
      }
      this._sharedUnprotectedHeader = sharedUnprotectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      if (this._unprotectedHeader) {
        throw new TypeError("setUnprotectedHeader can only be called once");
      }
      this._unprotectedHeader = unprotectedHeader;
      return this;
    }
    setAdditionalAuthenticatedData(aad) {
      this._aad = aad;
      return this;
    }
    setContentEncryptionKey(cek2) {
      if (this._cek) {
        throw new TypeError("setContentEncryptionKey can only be called once");
      }
      this._cek = cek2;
      return this;
    }
    setInitializationVector(iv2) {
      if (this._iv) {
        throw new TypeError("setInitializationVector can only be called once");
      }
      this._iv = iv2;
      return this;
    }
    async encrypt(key, options) {
      if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) {
        throw new errors_js_1.JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
      }
      if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) {
        throw new errors_js_1.JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
      }
      const joseHeader = {
        ...this._protectedHeader,
        ...this._unprotectedHeader,
        ...this._sharedUnprotectedHeader
      };
      (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, /* @__PURE__ */ new Map(), options?.crit, this._protectedHeader, joseHeader);
      if (joseHeader.zip !== void 0) {
        throw new errors_js_1.JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
      }
      const { alg, enc } = joseHeader;
      if (typeof alg !== "string" || !alg) {
        throw new errors_js_1.JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
      }
      if (typeof enc !== "string" || !enc) {
        throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
      }
      let encryptedKey;
      if (this._cek && (alg === "dir" || alg === "ECDH-ES")) {
        throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
      }
      let cek2;
      {
        let parameters;
        ({ cek: cek2, encryptedKey, parameters } = await (0, encrypt_key_management_js_1.default)(alg, enc, key, this._cek, this._keyManagementParameters));
        if (parameters) {
          if (options && private_symbols_js_1.unprotected in options) {
            if (!this._unprotectedHeader) {
              this.setUnprotectedHeader(parameters);
            } else {
              this._unprotectedHeader = { ...this._unprotectedHeader, ...parameters };
            }
          } else if (!this._protectedHeader) {
            this.setProtectedHeader(parameters);
          } else {
            this._protectedHeader = { ...this._protectedHeader, ...parameters };
          }
        }
      }
      let additionalData;
      let protectedHeader;
      let aadMember;
      if (this._protectedHeader) {
        protectedHeader = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(JSON.stringify(this._protectedHeader)));
      } else {
        protectedHeader = buffer_utils_js_1.encoder.encode("");
      }
      if (this._aad) {
        aadMember = (0, base64url_js_1.encode)(this._aad);
        additionalData = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), buffer_utils_js_1.encoder.encode(aadMember));
      } else {
        additionalData = protectedHeader;
      }
      const { ciphertext, tag, iv: iv2 } = await (0, encrypt_js_1.default)(enc, this._plaintext, cek2, this._iv, additionalData);
      const jwe = {
        ciphertext: (0, base64url_js_1.encode)(ciphertext)
      };
      if (iv2) {
        jwe.iv = (0, base64url_js_1.encode)(iv2);
      }
      if (tag) {
        jwe.tag = (0, base64url_js_1.encode)(tag);
      }
      if (encryptedKey) {
        jwe.encrypted_key = (0, base64url_js_1.encode)(encryptedKey);
      }
      if (aadMember) {
        jwe.aad = aadMember;
      }
      if (this._protectedHeader) {
        jwe.protected = buffer_utils_js_1.decoder.decode(protectedHeader);
      }
      if (this._sharedUnprotectedHeader) {
        jwe.unprotected = this._sharedUnprotectedHeader;
      }
      if (this._unprotectedHeader) {
        jwe.header = this._unprotectedHeader;
      }
      return jwe;
    }
  }
  encrypt$2.FlattenedEncrypt = FlattenedEncrypt;
  return encrypt$2;
}
var hasRequiredEncrypt$2;
function requireEncrypt$2() {
  if (hasRequiredEncrypt$2) return encrypt$3;
  hasRequiredEncrypt$2 = 1;
  Object.defineProperty(encrypt$3, "__esModule", { value: true });
  encrypt$3.GeneralEncrypt = void 0;
  const encrypt_js_1 = /* @__PURE__ */ requireEncrypt$3();
  const private_symbols_js_1 = /* @__PURE__ */ requirePrivate_symbols();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const cek_js_1 = /* @__PURE__ */ requireCek();
  const is_disjoint_js_1 = /* @__PURE__ */ requireIs_disjoint();
  const encrypt_key_management_js_1 = /* @__PURE__ */ requireEncrypt_key_management();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const validate_crit_js_1 = /* @__PURE__ */ requireValidate_crit();
  class IndividualRecipient {
    parent;
    unprotectedHeader;
    key;
    options;
    constructor(enc, key, options) {
      this.parent = enc;
      this.key = key;
      this.options = options;
    }
    setUnprotectedHeader(unprotectedHeader) {
      if (this.unprotectedHeader) {
        throw new TypeError("setUnprotectedHeader can only be called once");
      }
      this.unprotectedHeader = unprotectedHeader;
      return this;
    }
    addRecipient(...args) {
      return this.parent.addRecipient(...args);
    }
    encrypt(...args) {
      return this.parent.encrypt(...args);
    }
    done() {
      return this.parent;
    }
  }
  class GeneralEncrypt {
    _plaintext;
    _recipients = [];
    _protectedHeader;
    _unprotectedHeader;
    _aad;
    constructor(plaintext) {
      this._plaintext = plaintext;
    }
    addRecipient(key, options) {
      const recipient = new IndividualRecipient(this, key, { crit: options?.crit });
      this._recipients.push(recipient);
      return recipient;
    }
    setProtectedHeader(protectedHeader) {
      if (this._protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this._protectedHeader = protectedHeader;
      return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
      if (this._unprotectedHeader) {
        throw new TypeError("setSharedUnprotectedHeader can only be called once");
      }
      this._unprotectedHeader = sharedUnprotectedHeader;
      return this;
    }
    setAdditionalAuthenticatedData(aad) {
      this._aad = aad;
      return this;
    }
    async encrypt() {
      if (!this._recipients.length) {
        throw new errors_js_1.JWEInvalid("at least one recipient must be added");
      }
      if (this._recipients.length === 1) {
        const [recipient] = this._recipients;
        const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).encrypt(recipient.key, { ...recipient.options });
        const jwe2 = {
          ciphertext: flattened.ciphertext,
          iv: flattened.iv,
          recipients: [{}],
          tag: flattened.tag
        };
        if (flattened.aad)
          jwe2.aad = flattened.aad;
        if (flattened.protected)
          jwe2.protected = flattened.protected;
        if (flattened.unprotected)
          jwe2.unprotected = flattened.unprotected;
        if (flattened.encrypted_key)
          jwe2.recipients[0].encrypted_key = flattened.encrypted_key;
        if (flattened.header)
          jwe2.recipients[0].header = flattened.header;
        return jwe2;
      }
      let enc;
      for (let i = 0; i < this._recipients.length; i++) {
        const recipient = this._recipients[i];
        if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader, recipient.unprotectedHeader)) {
          throw new errors_js_1.JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
        }
        const joseHeader = {
          ...this._protectedHeader,
          ...this._unprotectedHeader,
          ...recipient.unprotectedHeader
        };
        const { alg } = joseHeader;
        if (typeof alg !== "string" || !alg) {
          throw new errors_js_1.JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
        }
        if (alg === "dir" || alg === "ECDH-ES") {
          throw new errors_js_1.JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
        }
        if (typeof joseHeader.enc !== "string" || !joseHeader.enc) {
          throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
        }
        if (!enc) {
          enc = joseHeader.enc;
        } else if (enc !== joseHeader.enc) {
          throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
        }
        (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, /* @__PURE__ */ new Map(), recipient.options.crit, this._protectedHeader, joseHeader);
        if (joseHeader.zip !== void 0) {
          throw new errors_js_1.JOSENotSupported('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
        }
      }
      const cek2 = (0, cek_js_1.default)(enc);
      const jwe = {
        ciphertext: "",
        iv: "",
        recipients: [],
        tag: ""
      };
      for (let i = 0; i < this._recipients.length; i++) {
        const recipient = this._recipients[i];
        const target = {};
        jwe.recipients.push(target);
        const joseHeader = {
          ...this._protectedHeader,
          ...this._unprotectedHeader,
          ...recipient.unprotectedHeader
        };
        const p2c = joseHeader.alg.startsWith("PBES2") ? 2048 + i : void 0;
        if (i === 0) {
          const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(cek2).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).setKeyManagementParameters({ p2c }).encrypt(recipient.key, {
            ...recipient.options,
            [private_symbols_js_1.unprotected]: true
          });
          jwe.ciphertext = flattened.ciphertext;
          jwe.iv = flattened.iv;
          jwe.tag = flattened.tag;
          if (flattened.aad)
            jwe.aad = flattened.aad;
          if (flattened.protected)
            jwe.protected = flattened.protected;
          if (flattened.unprotected)
            jwe.unprotected = flattened.unprotected;
          target.encrypted_key = flattened.encrypted_key;
          if (flattened.header)
            target.header = flattened.header;
          continue;
        }
        const { encryptedKey, parameters } = await (0, encrypt_key_management_js_1.default)(recipient.unprotectedHeader?.alg || this._protectedHeader?.alg || this._unprotectedHeader?.alg, enc, recipient.key, cek2, { p2c });
        target.encrypted_key = (0, base64url_js_1.encode)(encryptedKey);
        if (recipient.unprotectedHeader || parameters)
          target.header = { ...recipient.unprotectedHeader, ...parameters };
      }
      return jwe;
    }
  }
  encrypt$3.GeneralEncrypt = GeneralEncrypt;
  return encrypt$3;
}
var verify$4 = {};
var verify$3 = {};
var verify$2 = {};
var dsa_digest = {};
var hasRequiredDsa_digest;
function requireDsa_digest() {
  if (hasRequiredDsa_digest) return dsa_digest;
  hasRequiredDsa_digest = 1;
  Object.defineProperty(dsa_digest, "__esModule", { value: true });
  dsa_digest.default = dsaDigest;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  function dsaDigest(alg) {
    switch (alg) {
      case "PS256":
      case "RS256":
      case "ES256":
      case "ES256K":
        return "sha256";
      case "PS384":
      case "RS384":
      case "ES384":
        return "sha384";
      case "PS512":
      case "RS512":
      case "ES512":
        return "sha512";
      case "Ed25519":
      case "EdDSA":
        return void 0;
      default:
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
  }
  return dsa_digest;
}
var node_key = {};
var hasRequiredNode_key;
function requireNode_key() {
  if (hasRequiredNode_key) return node_key;
  hasRequiredNode_key = 1;
  Object.defineProperty(node_key, "__esModule", { value: true });
  node_key.default = keyForCrypto;
  const node_crypto_1 = require$$0;
  const get_named_curve_js_1 = /* @__PURE__ */ requireGet_named_curve();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const check_key_length_js_1 = /* @__PURE__ */ requireCheck_key_length();
  const ecCurveAlgMap = /* @__PURE__ */ new Map([
    ["ES256", "P-256"],
    ["ES256K", "secp256k1"],
    ["ES384", "P-384"],
    ["ES512", "P-521"]
  ]);
  function keyForCrypto(alg, key) {
    let asymmetricKeyType;
    let asymmetricKeyDetails;
    let isJWK;
    if (key instanceof node_crypto_1.KeyObject) {
      asymmetricKeyType = key.asymmetricKeyType;
      asymmetricKeyDetails = key.asymmetricKeyDetails;
    } else {
      isJWK = true;
      switch (key.kty) {
        case "RSA":
          asymmetricKeyType = "rsa";
          break;
        case "EC":
          asymmetricKeyType = "ec";
          break;
        case "OKP": {
          if (key.crv === "Ed25519") {
            asymmetricKeyType = "ed25519";
            break;
          }
          if (key.crv === "Ed448") {
            asymmetricKeyType = "ed448";
            break;
          }
          throw new TypeError("Invalid key for this operation, its crv must be Ed25519 or Ed448");
        }
        default:
          throw new TypeError("Invalid key for this operation, its kty must be RSA, OKP, or EC");
      }
    }
    let options;
    switch (alg) {
      case "Ed25519":
        if (asymmetricKeyType !== "ed25519") {
          throw new TypeError(`Invalid key for this operation, its asymmetricKeyType must be ed25519`);
        }
        break;
      case "EdDSA":
        if (!["ed25519", "ed448"].includes(asymmetricKeyType)) {
          throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448");
        }
        break;
      case "RS256":
      case "RS384":
      case "RS512":
        if (asymmetricKeyType !== "rsa") {
          throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
        }
        (0, check_key_length_js_1.default)(key, alg);
        break;
      case "PS256":
      case "PS384":
      case "PS512":
        if (asymmetricKeyType === "rsa-pss") {
          const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = asymmetricKeyDetails;
          const length = parseInt(alg.slice(-3), 10);
          if (hashAlgorithm !== void 0 && (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)) {
            throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${alg}`);
          }
          if (saltLength !== void 0 && saltLength > length >> 3) {
            throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${alg}`);
          }
        } else if (asymmetricKeyType !== "rsa") {
          throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss");
        }
        (0, check_key_length_js_1.default)(key, alg);
        options = {
          padding: node_crypto_1.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: node_crypto_1.constants.RSA_PSS_SALTLEN_DIGEST
        };
        break;
      case "ES256":
      case "ES256K":
      case "ES384":
      case "ES512": {
        if (asymmetricKeyType !== "ec") {
          throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ec");
        }
        const actual = (0, get_named_curve_js_1.default)(key);
        const expected = ecCurveAlgMap.get(alg);
        if (actual !== expected) {
          throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
        }
        options = { dsaEncoding: "ieee-p1363" };
        break;
      }
      default:
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    if (isJWK) {
      return { format: "jwk", key, ...options };
    }
    return options ? { ...options, key } : key;
  }
  return node_key;
}
var sign$4 = {};
var hmac_digest = {};
var hasRequiredHmac_digest;
function requireHmac_digest() {
  if (hasRequiredHmac_digest) return hmac_digest;
  hasRequiredHmac_digest = 1;
  Object.defineProperty(hmac_digest, "__esModule", { value: true });
  hmac_digest.default = hmacDigest;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  function hmacDigest(alg) {
    switch (alg) {
      case "HS256":
        return "sha256";
      case "HS384":
        return "sha384";
      case "HS512":
        return "sha512";
      default:
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
  }
  return hmac_digest;
}
var get_sign_verify_key = {};
var hasRequiredGet_sign_verify_key;
function requireGet_sign_verify_key() {
  if (hasRequiredGet_sign_verify_key) return get_sign_verify_key;
  hasRequiredGet_sign_verify_key = 1;
  Object.defineProperty(get_sign_verify_key, "__esModule", { value: true });
  get_sign_verify_key.default = getSignVerifyKey;
  const node_crypto_1 = require$$0;
  const webcrypto_js_1 = /* @__PURE__ */ requireWebcrypto();
  const crypto_key_js_1 = /* @__PURE__ */ requireCrypto_key();
  const invalid_key_input_js_1 = /* @__PURE__ */ requireInvalid_key_input();
  const is_key_like_js_1 = /* @__PURE__ */ requireIs_key_like();
  const jwk = /* @__PURE__ */ requireIs_jwk();
  function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
      if (!alg.startsWith("HS")) {
        throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
      }
      return (0, node_crypto_1.createSecretKey)(key);
    }
    if (key instanceof node_crypto_1.KeyObject) {
      return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
      (0, crypto_key_js_1.checkSigCryptoKey)(key, alg, usage);
      return node_crypto_1.KeyObject.from(key);
    }
    if (jwk.isJWK(key)) {
      if (alg.startsWith("HS")) {
        return (0, node_crypto_1.createSecretKey)(Buffer.from(key.k, "base64url"));
      }
      return key;
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array", "JSON Web Key"));
  }
  return get_sign_verify_key;
}
var hasRequiredSign$4;
function requireSign$4() {
  if (hasRequiredSign$4) return sign$4;
  hasRequiredSign$4 = 1;
  Object.defineProperty(sign$4, "__esModule", { value: true });
  const crypto = require$$0;
  const node_util_1 = require$$1;
  const dsa_digest_js_1 = /* @__PURE__ */ requireDsa_digest();
  const hmac_digest_js_1 = /* @__PURE__ */ requireHmac_digest();
  const node_key_js_1 = /* @__PURE__ */ requireNode_key();
  const get_sign_verify_key_js_1 = /* @__PURE__ */ requireGet_sign_verify_key();
  const oneShotSign = (0, node_util_1.promisify)(crypto.sign);
  const sign2 = async (alg, key, data) => {
    const k = (0, get_sign_verify_key_js_1.default)(alg, key, "sign");
    if (alg.startsWith("HS")) {
      const hmac = crypto.createHmac((0, hmac_digest_js_1.default)(alg), k);
      hmac.update(data);
      return hmac.digest();
    }
    return oneShotSign((0, dsa_digest_js_1.default)(alg), data, (0, node_key_js_1.default)(alg, k));
  };
  sign$4.default = sign2;
  return sign$4;
}
var hasRequiredVerify$4;
function requireVerify$4() {
  if (hasRequiredVerify$4) return verify$2;
  hasRequiredVerify$4 = 1;
  Object.defineProperty(verify$2, "__esModule", { value: true });
  const crypto = require$$0;
  const node_util_1 = require$$1;
  const dsa_digest_js_1 = /* @__PURE__ */ requireDsa_digest();
  const node_key_js_1 = /* @__PURE__ */ requireNode_key();
  const sign_js_1 = /* @__PURE__ */ requireSign$4();
  const get_sign_verify_key_js_1 = /* @__PURE__ */ requireGet_sign_verify_key();
  const oneShotVerify = (0, node_util_1.promisify)(crypto.verify);
  const verify2 = async (alg, key, signature, data) => {
    const k = (0, get_sign_verify_key_js_1.default)(alg, key, "verify");
    if (alg.startsWith("HS")) {
      const expected = await (0, sign_js_1.default)(alg, k, data);
      const actual = signature;
      try {
        return crypto.timingSafeEqual(actual, expected);
      } catch {
        return false;
      }
    }
    const algorithm = (0, dsa_digest_js_1.default)(alg);
    const keyInput = (0, node_key_js_1.default)(alg, k);
    try {
      return await oneShotVerify(algorithm, data, keyInput, signature);
    } catch {
      return false;
    }
  };
  verify$2.default = verify2;
  return verify$2;
}
var hasRequiredVerify$3;
function requireVerify$3() {
  if (hasRequiredVerify$3) return verify$3;
  hasRequiredVerify$3 = 1;
  Object.defineProperty(verify$3, "__esModule", { value: true });
  verify$3.flattenedVerify = flattenedVerify;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const verify_js_1 = /* @__PURE__ */ requireVerify$4();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const is_disjoint_js_1 = /* @__PURE__ */ requireIs_disjoint();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const check_key_type_js_1 = /* @__PURE__ */ requireCheck_key_type();
  const validate_crit_js_1 = /* @__PURE__ */ requireValidate_crit();
  const validate_algorithms_js_1 = /* @__PURE__ */ requireValidate_algorithms();
  const is_jwk_js_1 = /* @__PURE__ */ requireIs_jwk();
  const import_js_1 = /* @__PURE__ */ require_import();
  async function flattenedVerify(jws, key, options) {
    if (!(0, is_object_js_1.default)(jws)) {
      throw new errors_js_1.JWSInvalid("Flattened JWS must be an object");
    }
    if (jws.protected === void 0 && jws.header === void 0) {
      throw new errors_js_1.JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== void 0 && typeof jws.protected !== "string") {
      throw new errors_js_1.JWSInvalid("JWS Protected Header incorrect type");
    }
    if (jws.payload === void 0) {
      throw new errors_js_1.JWSInvalid("JWS Payload missing");
    }
    if (typeof jws.signature !== "string") {
      throw new errors_js_1.JWSInvalid("JWS Signature missing or incorrect type");
    }
    if (jws.header !== void 0 && !(0, is_object_js_1.default)(jws.header)) {
      throw new errors_js_1.JWSInvalid("JWS Unprotected Header incorrect type");
    }
    let parsedProt = {};
    if (jws.protected) {
      try {
        const protectedHeader = (0, base64url_js_1.decode)(jws.protected);
        parsedProt = JSON.parse(buffer_utils_js_1.decoder.decode(protectedHeader));
      } catch {
        throw new errors_js_1.JWSInvalid("JWS Protected Header is invalid");
      }
    }
    if (!(0, is_disjoint_js_1.default)(parsedProt, jws.header)) {
      throw new errors_js_1.JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...parsedProt,
      ...jws.header
    };
    const extensions = (0, validate_crit_js_1.default)(errors_js_1.JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
      b64 = parsedProt.b64;
      if (typeof b64 !== "boolean") {
        throw new errors_js_1.JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new errors_js_1.JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && (0, validate_algorithms_js_1.default)("algorithms", options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
      throw new errors_js_1.JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (b64) {
      if (typeof jws.payload !== "string") {
        throw new errors_js_1.JWSInvalid("JWS Payload must be a string");
      }
    } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
      throw new errors_js_1.JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
    }
    let resolvedKey = false;
    if (typeof key === "function") {
      key = await key(parsedProt, jws);
      resolvedKey = true;
      (0, check_key_type_js_1.checkKeyTypeWithJwk)(alg, key, "verify");
      if ((0, is_jwk_js_1.isJWK)(key)) {
        key = await (0, import_js_1.importJWK)(key, alg);
      }
    } else {
      (0, check_key_type_js_1.checkKeyTypeWithJwk)(alg, key, "verify");
    }
    const data = (0, buffer_utils_js_1.concat)(buffer_utils_js_1.encoder.encode(jws.protected ?? ""), buffer_utils_js_1.encoder.encode("."), typeof jws.payload === "string" ? buffer_utils_js_1.encoder.encode(jws.payload) : jws.payload);
    let signature;
    try {
      signature = (0, base64url_js_1.decode)(jws.signature);
    } catch {
      throw new errors_js_1.JWSInvalid("Failed to base64url decode the signature");
    }
    const verified = await (0, verify_js_1.default)(alg, key, signature, data);
    if (!verified) {
      throw new errors_js_1.JWSSignatureVerificationFailed();
    }
    let payload;
    if (b64) {
      try {
        payload = (0, base64url_js_1.decode)(jws.payload);
      } catch {
        throw new errors_js_1.JWSInvalid("Failed to base64url decode the payload");
      }
    } else if (typeof jws.payload === "string") {
      payload = buffer_utils_js_1.encoder.encode(jws.payload);
    } else {
      payload = jws.payload;
    }
    const result = { payload };
    if (jws.protected !== void 0) {
      result.protectedHeader = parsedProt;
    }
    if (jws.header !== void 0) {
      result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
      return { ...result, key };
    }
    return result;
  }
  return verify$3;
}
var hasRequiredVerify$2;
function requireVerify$2() {
  if (hasRequiredVerify$2) return verify$4;
  hasRequiredVerify$2 = 1;
  Object.defineProperty(verify$4, "__esModule", { value: true });
  verify$4.compactVerify = compactVerify;
  const verify_js_1 = /* @__PURE__ */ requireVerify$3();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
      jws = buffer_utils_js_1.decoder.decode(jws);
    }
    if (typeof jws !== "string") {
      throw new errors_js_1.JWSInvalid("Compact JWS must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
    if (length !== 3) {
      throw new errors_js_1.JWSInvalid("Invalid Compact JWS");
    }
    const verified = await (0, verify_js_1.flattenedVerify)({ payload, protected: protectedHeader, signature }, key, options);
    const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: verified.key };
    }
    return result;
  }
  return verify$4;
}
var verify$1 = {};
var hasRequiredVerify$1;
function requireVerify$1() {
  if (hasRequiredVerify$1) return verify$1;
  hasRequiredVerify$1 = 1;
  Object.defineProperty(verify$1, "__esModule", { value: true });
  verify$1.generalVerify = generalVerify;
  const verify_js_1 = /* @__PURE__ */ requireVerify$3();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  async function generalVerify(jws, key, options) {
    if (!(0, is_object_js_1.default)(jws)) {
      throw new errors_js_1.JWSInvalid("General JWS must be an object");
    }
    if (!Array.isArray(jws.signatures) || !jws.signatures.every(is_object_js_1.default)) {
      throw new errors_js_1.JWSInvalid("JWS Signatures missing or incorrect type");
    }
    for (const signature of jws.signatures) {
      try {
        return await (0, verify_js_1.flattenedVerify)({
          header: signature.header,
          payload: jws.payload,
          protected: signature.protected,
          signature: signature.signature
        }, key, options);
      } catch {
      }
    }
    throw new errors_js_1.JWSSignatureVerificationFailed();
  }
  return verify$1;
}
var verify = {};
var jwt_claims_set = {};
var epoch = {};
var hasRequiredEpoch;
function requireEpoch() {
  if (hasRequiredEpoch) return epoch;
  hasRequiredEpoch = 1;
  Object.defineProperty(epoch, "__esModule", { value: true });
  epoch.default = (date) => Math.floor(date.getTime() / 1e3);
  return epoch;
}
var secs = {};
var hasRequiredSecs;
function requireSecs() {
  if (hasRequiredSecs) return secs;
  hasRequiredSecs = 1;
  Object.defineProperty(secs, "__esModule", { value: true });
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const year = day * 365.25;
  const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
  secs.default = (str) => {
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
      throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch (unit) {
      case "sec":
      case "secs":
      case "second":
      case "seconds":
      case "s":
        numericDate = Math.round(value);
        break;
      case "minute":
      case "minutes":
      case "min":
      case "mins":
      case "m":
        numericDate = Math.round(value * minute);
        break;
      case "hour":
      case "hours":
      case "hr":
      case "hrs":
      case "h":
        numericDate = Math.round(value * hour);
        break;
      case "day":
      case "days":
      case "d":
        numericDate = Math.round(value * day);
        break;
      case "week":
      case "weeks":
      case "w":
        numericDate = Math.round(value * week);
        break;
      default:
        numericDate = Math.round(value * year);
        break;
    }
    if (matched[1] === "-" || matched[4] === "ago") {
      return -numericDate;
    }
    return numericDate;
  };
  return secs;
}
var hasRequiredJwt_claims_set;
function requireJwt_claims_set() {
  if (hasRequiredJwt_claims_set) return jwt_claims_set;
  hasRequiredJwt_claims_set = 1;
  Object.defineProperty(jwt_claims_set, "__esModule", { value: true });
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const epoch_js_1 = /* @__PURE__ */ requireEpoch();
  const secs_js_1 = /* @__PURE__ */ requireSecs();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const normalizeTyp = (value) => value.toLowerCase().replace(/^application\//, "");
  const checkAudiencePresence = (audPayload, audOption) => {
    if (typeof audPayload === "string") {
      return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
      return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
  };
  jwt_claims_set.default = (protectedHeader, encodedPayload, options = {}) => {
    let payload;
    try {
      payload = JSON.parse(buffer_utils_js_1.decoder.decode(encodedPayload));
    } catch {
    }
    if (!(0, is_object_js_1.default)(payload)) {
      throw new errors_js_1.JWTInvalid("JWT Claims Set must be a top-level JSON object");
    }
    const { typ } = options;
    if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
      throw new errors_js_1.JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [...requiredClaims];
    if (maxTokenAge !== void 0)
      presenceCheck.push("iat");
    if (audience !== void 0)
      presenceCheck.push("aud");
    if (subject !== void 0)
      presenceCheck.push("sub");
    if (issuer !== void 0)
      presenceCheck.push("iss");
    for (const claim of new Set(presenceCheck.reverse())) {
      if (!(claim in payload)) {
        throw new errors_js_1.JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
      }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
      throw new errors_js_1.JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
    }
    if (subject && payload.sub !== subject) {
      throw new errors_js_1.JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
      throw new errors_js_1.JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
    }
    let tolerance;
    switch (typeof options.clockTolerance) {
      case "string":
        tolerance = (0, secs_js_1.default)(options.clockTolerance);
        break;
      case "number":
        tolerance = options.clockTolerance;
        break;
      case "undefined":
        tolerance = 0;
        break;
      default:
        throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate } = options;
    const now = (0, epoch_js_1.default)(currentDate || /* @__PURE__ */ new Date());
    if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
      throw new errors_js_1.JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
    }
    if (payload.nbf !== void 0) {
      if (typeof payload.nbf !== "number") {
        throw new errors_js_1.JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
      }
      if (payload.nbf > now + tolerance) {
        throw new errors_js_1.JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
      }
    }
    if (payload.exp !== void 0) {
      if (typeof payload.exp !== "number") {
        throw new errors_js_1.JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
      }
      if (payload.exp <= now - tolerance) {
        throw new errors_js_1.JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
      }
    }
    if (maxTokenAge) {
      const age = now - payload.iat;
      const max = typeof maxTokenAge === "number" ? maxTokenAge : (0, secs_js_1.default)(maxTokenAge);
      if (age - tolerance > max) {
        throw new errors_js_1.JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
      }
      if (age < 0 - tolerance) {
        throw new errors_js_1.JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
      }
    }
    return payload;
  };
  return jwt_claims_set;
}
var hasRequiredVerify;
function requireVerify() {
  if (hasRequiredVerify) return verify;
  hasRequiredVerify = 1;
  Object.defineProperty(verify, "__esModule", { value: true });
  verify.jwtVerify = jwtVerify;
  const verify_js_1 = /* @__PURE__ */ requireVerify$2();
  const jwt_claims_set_js_1 = /* @__PURE__ */ requireJwt_claims_set();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  async function jwtVerify(jwt, key, options) {
    const verified = await (0, verify_js_1.compactVerify)(jwt, key, options);
    if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
      throw new errors_js_1.JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    const payload = (0, jwt_claims_set_js_1.default)(verified.protectedHeader, verified.payload, options);
    const result = { payload, protectedHeader: verified.protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: verified.key };
    }
    return result;
  }
  return verify;
}
var decrypt = {};
var hasRequiredDecrypt;
function requireDecrypt() {
  if (hasRequiredDecrypt) return decrypt;
  hasRequiredDecrypt = 1;
  Object.defineProperty(decrypt, "__esModule", { value: true });
  decrypt.jwtDecrypt = jwtDecrypt;
  const decrypt_js_1 = /* @__PURE__ */ requireDecrypt$2();
  const jwt_claims_set_js_1 = /* @__PURE__ */ requireJwt_claims_set();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  async function jwtDecrypt(jwt, key, options) {
    const decrypted = await (0, decrypt_js_1.compactDecrypt)(jwt, key, options);
    const payload = (0, jwt_claims_set_js_1.default)(decrypted.protectedHeader, decrypted.plaintext, options);
    const { protectedHeader } = decrypted;
    if (protectedHeader.iss !== void 0 && protectedHeader.iss !== payload.iss) {
      throw new errors_js_1.JWTClaimValidationFailed('replicated "iss" claim header parameter mismatch', payload, "iss", "mismatch");
    }
    if (protectedHeader.sub !== void 0 && protectedHeader.sub !== payload.sub) {
      throw new errors_js_1.JWTClaimValidationFailed('replicated "sub" claim header parameter mismatch', payload, "sub", "mismatch");
    }
    if (protectedHeader.aud !== void 0 && JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)) {
      throw new errors_js_1.JWTClaimValidationFailed('replicated "aud" claim header parameter mismatch', payload, "aud", "mismatch");
    }
    const result = { payload, protectedHeader };
    if (typeof key === "function") {
      return { ...result, key: decrypted.key };
    }
    return result;
  }
  return decrypt;
}
var encrypt$1 = {};
var hasRequiredEncrypt$1;
function requireEncrypt$1() {
  if (hasRequiredEncrypt$1) return encrypt$1;
  hasRequiredEncrypt$1 = 1;
  Object.defineProperty(encrypt$1, "__esModule", { value: true });
  encrypt$1.CompactEncrypt = void 0;
  const encrypt_js_1 = /* @__PURE__ */ requireEncrypt$3();
  class CompactEncrypt {
    _flattened;
    constructor(plaintext) {
      this._flattened = new encrypt_js_1.FlattenedEncrypt(plaintext);
    }
    setContentEncryptionKey(cek2) {
      this._flattened.setContentEncryptionKey(cek2);
      return this;
    }
    setInitializationVector(iv2) {
      this._flattened.setInitializationVector(iv2);
      return this;
    }
    setProtectedHeader(protectedHeader) {
      this._flattened.setProtectedHeader(protectedHeader);
      return this;
    }
    setKeyManagementParameters(parameters) {
      this._flattened.setKeyManagementParameters(parameters);
      return this;
    }
    async encrypt(key, options) {
      const jwe = await this._flattened.encrypt(key, options);
      return [jwe.protected, jwe.encrypted_key, jwe.iv, jwe.ciphertext, jwe.tag].join(".");
    }
  }
  encrypt$1.CompactEncrypt = CompactEncrypt;
  return encrypt$1;
}
var sign$3 = {};
var sign$2 = {};
var hasRequiredSign$3;
function requireSign$3() {
  if (hasRequiredSign$3) return sign$2;
  hasRequiredSign$3 = 1;
  Object.defineProperty(sign$2, "__esModule", { value: true });
  sign$2.FlattenedSign = void 0;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const sign_js_1 = /* @__PURE__ */ requireSign$4();
  const is_disjoint_js_1 = /* @__PURE__ */ requireIs_disjoint();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const check_key_type_js_1 = /* @__PURE__ */ requireCheck_key_type();
  const validate_crit_js_1 = /* @__PURE__ */ requireValidate_crit();
  class FlattenedSign {
    _payload;
    _protectedHeader;
    _unprotectedHeader;
    constructor(payload) {
      if (!(payload instanceof Uint8Array)) {
        throw new TypeError("payload must be an instance of Uint8Array");
      }
      this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
      if (this._protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this._protectedHeader = protectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      if (this._unprotectedHeader) {
        throw new TypeError("setUnprotectedHeader can only be called once");
      }
      this._unprotectedHeader = unprotectedHeader;
      return this;
    }
    async sign(key, options) {
      if (!this._protectedHeader && !this._unprotectedHeader) {
        throw new errors_js_1.JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
      }
      if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader)) {
        throw new errors_js_1.JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
      }
      const joseHeader = {
        ...this._protectedHeader,
        ...this._unprotectedHeader
      };
      const extensions = (0, validate_crit_js_1.default)(errors_js_1.JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this._protectedHeader, joseHeader);
      let b64 = true;
      if (extensions.has("b64")) {
        b64 = this._protectedHeader.b64;
        if (typeof b64 !== "boolean") {
          throw new errors_js_1.JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
      }
      const { alg } = joseHeader;
      if (typeof alg !== "string" || !alg) {
        throw new errors_js_1.JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
      }
      (0, check_key_type_js_1.checkKeyTypeWithJwk)(alg, key, "sign");
      let payload = this._payload;
      if (b64) {
        payload = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(payload));
      }
      let protectedHeader;
      if (this._protectedHeader) {
        protectedHeader = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(JSON.stringify(this._protectedHeader)));
      } else {
        protectedHeader = buffer_utils_js_1.encoder.encode("");
      }
      const data = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), payload);
      const signature = await (0, sign_js_1.default)(alg, key, data);
      const jws = {
        signature: (0, base64url_js_1.encode)(signature),
        payload: ""
      };
      if (b64) {
        jws.payload = buffer_utils_js_1.decoder.decode(payload);
      }
      if (this._unprotectedHeader) {
        jws.header = this._unprotectedHeader;
      }
      if (this._protectedHeader) {
        jws.protected = buffer_utils_js_1.decoder.decode(protectedHeader);
      }
      return jws;
    }
  }
  sign$2.FlattenedSign = FlattenedSign;
  return sign$2;
}
var hasRequiredSign$2;
function requireSign$2() {
  if (hasRequiredSign$2) return sign$3;
  hasRequiredSign$2 = 1;
  Object.defineProperty(sign$3, "__esModule", { value: true });
  sign$3.CompactSign = void 0;
  const sign_js_1 = /* @__PURE__ */ requireSign$3();
  class CompactSign {
    _flattened;
    constructor(payload) {
      this._flattened = new sign_js_1.FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
      this._flattened.setProtectedHeader(protectedHeader);
      return this;
    }
    async sign(key, options) {
      const jws = await this._flattened.sign(key, options);
      if (jws.payload === void 0) {
        throw new TypeError("use the flattened module for creating JWS with b64: false");
      }
      return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
  }
  sign$3.CompactSign = CompactSign;
  return sign$3;
}
var sign$1 = {};
var hasRequiredSign$1;
function requireSign$1() {
  if (hasRequiredSign$1) return sign$1;
  hasRequiredSign$1 = 1;
  Object.defineProperty(sign$1, "__esModule", { value: true });
  sign$1.GeneralSign = void 0;
  const sign_js_1 = /* @__PURE__ */ requireSign$3();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  class IndividualSignature {
    parent;
    protectedHeader;
    unprotectedHeader;
    options;
    key;
    constructor(sig, key, options) {
      this.parent = sig;
      this.key = key;
      this.options = options;
    }
    setProtectedHeader(protectedHeader) {
      if (this.protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this.protectedHeader = protectedHeader;
      return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
      if (this.unprotectedHeader) {
        throw new TypeError("setUnprotectedHeader can only be called once");
      }
      this.unprotectedHeader = unprotectedHeader;
      return this;
    }
    addSignature(...args) {
      return this.parent.addSignature(...args);
    }
    sign(...args) {
      return this.parent.sign(...args);
    }
    done() {
      return this.parent;
    }
  }
  class GeneralSign {
    _payload;
    _signatures = [];
    constructor(payload) {
      this._payload = payload;
    }
    addSignature(key, options) {
      const signature = new IndividualSignature(this, key, options);
      this._signatures.push(signature);
      return signature;
    }
    async sign() {
      if (!this._signatures.length) {
        throw new errors_js_1.JWSInvalid("at least one signature must be added");
      }
      const jws = {
        signatures: [],
        payload: ""
      };
      for (let i = 0; i < this._signatures.length; i++) {
        const signature = this._signatures[i];
        const flattened = new sign_js_1.FlattenedSign(this._payload);
        flattened.setProtectedHeader(signature.protectedHeader);
        flattened.setUnprotectedHeader(signature.unprotectedHeader);
        const { payload, ...rest } = await flattened.sign(signature.key, signature.options);
        if (i === 0) {
          jws.payload = payload;
        } else if (jws.payload !== payload) {
          throw new errors_js_1.JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
        }
        jws.signatures.push(rest);
      }
      return jws;
    }
  }
  sign$1.GeneralSign = GeneralSign;
  return sign$1;
}
var sign = {};
var produce = {};
var hasRequiredProduce;
function requireProduce() {
  if (hasRequiredProduce) return produce;
  hasRequiredProduce = 1;
  Object.defineProperty(produce, "__esModule", { value: true });
  produce.ProduceJWT = void 0;
  const epoch_js_1 = /* @__PURE__ */ requireEpoch();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const secs_js_1 = /* @__PURE__ */ requireSecs();
  function validateInput(label, input) {
    if (!Number.isFinite(input)) {
      throw new TypeError(`Invalid ${label} input`);
    }
    return input;
  }
  class ProduceJWT {
    _payload;
    constructor(payload = {}) {
      if (!(0, is_object_js_1.default)(payload)) {
        throw new TypeError("JWT Claims Set MUST be an object");
      }
      this._payload = payload;
    }
    setIssuer(issuer) {
      this._payload = { ...this._payload, iss: issuer };
      return this;
    }
    setSubject(subject) {
      this._payload = { ...this._payload, sub: subject };
      return this;
    }
    setAudience(audience) {
      this._payload = { ...this._payload, aud: audience };
      return this;
    }
    setJti(jwtId) {
      this._payload = { ...this._payload, jti: jwtId };
      return this;
    }
    setNotBefore(input) {
      if (typeof input === "number") {
        this._payload = { ...this._payload, nbf: validateInput("setNotBefore", input) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, nbf: validateInput("setNotBefore", (0, epoch_js_1.default)(input)) };
      } else {
        this._payload = { ...this._payload, nbf: (0, epoch_js_1.default)(/* @__PURE__ */ new Date()) + (0, secs_js_1.default)(input) };
      }
      return this;
    }
    setExpirationTime(input) {
      if (typeof input === "number") {
        this._payload = { ...this._payload, exp: validateInput("setExpirationTime", input) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, exp: validateInput("setExpirationTime", (0, epoch_js_1.default)(input)) };
      } else {
        this._payload = { ...this._payload, exp: (0, epoch_js_1.default)(/* @__PURE__ */ new Date()) + (0, secs_js_1.default)(input) };
      }
      return this;
    }
    setIssuedAt(input) {
      if (typeof input === "undefined") {
        this._payload = { ...this._payload, iat: (0, epoch_js_1.default)(/* @__PURE__ */ new Date()) };
      } else if (input instanceof Date) {
        this._payload = { ...this._payload, iat: validateInput("setIssuedAt", (0, epoch_js_1.default)(input)) };
      } else if (typeof input === "string") {
        this._payload = {
          ...this._payload,
          iat: validateInput("setIssuedAt", (0, epoch_js_1.default)(/* @__PURE__ */ new Date()) + (0, secs_js_1.default)(input))
        };
      } else {
        this._payload = { ...this._payload, iat: validateInput("setIssuedAt", input) };
      }
      return this;
    }
  }
  produce.ProduceJWT = ProduceJWT;
  return produce;
}
var hasRequiredSign;
function requireSign() {
  if (hasRequiredSign) return sign;
  hasRequiredSign = 1;
  Object.defineProperty(sign, "__esModule", { value: true });
  sign.SignJWT = void 0;
  const sign_js_1 = /* @__PURE__ */ requireSign$2();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const produce_js_1 = /* @__PURE__ */ requireProduce();
  class SignJWT extends produce_js_1.ProduceJWT {
    _protectedHeader;
    setProtectedHeader(protectedHeader) {
      this._protectedHeader = protectedHeader;
      return this;
    }
    async sign(key, options) {
      const sig = new sign_js_1.CompactSign(buffer_utils_js_1.encoder.encode(JSON.stringify(this._payload)));
      sig.setProtectedHeader(this._protectedHeader);
      if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
        throw new errors_js_1.JWTInvalid("JWTs MUST NOT use unencoded payload");
      }
      return sig.sign(key, options);
    }
  }
  sign.SignJWT = SignJWT;
  return sign;
}
var encrypt = {};
var hasRequiredEncrypt;
function requireEncrypt() {
  if (hasRequiredEncrypt) return encrypt;
  hasRequiredEncrypt = 1;
  Object.defineProperty(encrypt, "__esModule", { value: true });
  encrypt.EncryptJWT = void 0;
  const encrypt_js_1 = /* @__PURE__ */ requireEncrypt$1();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const produce_js_1 = /* @__PURE__ */ requireProduce();
  class EncryptJWT extends produce_js_1.ProduceJWT {
    _cek;
    _iv;
    _keyManagementParameters;
    _protectedHeader;
    _replicateIssuerAsHeader;
    _replicateSubjectAsHeader;
    _replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader) {
      if (this._protectedHeader) {
        throw new TypeError("setProtectedHeader can only be called once");
      }
      this._protectedHeader = protectedHeader;
      return this;
    }
    setKeyManagementParameters(parameters) {
      if (this._keyManagementParameters) {
        throw new TypeError("setKeyManagementParameters can only be called once");
      }
      this._keyManagementParameters = parameters;
      return this;
    }
    setContentEncryptionKey(cek2) {
      if (this._cek) {
        throw new TypeError("setContentEncryptionKey can only be called once");
      }
      this._cek = cek2;
      return this;
    }
    setInitializationVector(iv2) {
      if (this._iv) {
        throw new TypeError("setInitializationVector can only be called once");
      }
      this._iv = iv2;
      return this;
    }
    replicateIssuerAsHeader() {
      this._replicateIssuerAsHeader = true;
      return this;
    }
    replicateSubjectAsHeader() {
      this._replicateSubjectAsHeader = true;
      return this;
    }
    replicateAudienceAsHeader() {
      this._replicateAudienceAsHeader = true;
      return this;
    }
    async encrypt(key, options) {
      const enc = new encrypt_js_1.CompactEncrypt(buffer_utils_js_1.encoder.encode(JSON.stringify(this._payload)));
      if (this._replicateIssuerAsHeader) {
        this._protectedHeader = { ...this._protectedHeader, iss: this._payload.iss };
      }
      if (this._replicateSubjectAsHeader) {
        this._protectedHeader = { ...this._protectedHeader, sub: this._payload.sub };
      }
      if (this._replicateAudienceAsHeader) {
        this._protectedHeader = { ...this._protectedHeader, aud: this._payload.aud };
      }
      enc.setProtectedHeader(this._protectedHeader);
      if (this._iv) {
        enc.setInitializationVector(this._iv);
      }
      if (this._cek) {
        enc.setContentEncryptionKey(this._cek);
      }
      if (this._keyManagementParameters) {
        enc.setKeyManagementParameters(this._keyManagementParameters);
      }
      return enc.encrypt(key, options);
    }
  }
  encrypt.EncryptJWT = EncryptJWT;
  return encrypt;
}
var thumbprint = {};
var hasRequiredThumbprint;
function requireThumbprint() {
  if (hasRequiredThumbprint) return thumbprint;
  hasRequiredThumbprint = 1;
  Object.defineProperty(thumbprint, "__esModule", { value: true });
  thumbprint.calculateJwkThumbprint = calculateJwkThumbprint;
  thumbprint.calculateJwkThumbprintUri = calculateJwkThumbprintUri;
  const digest_js_1 = /* @__PURE__ */ requireDigest();
  const base64url_js_1 = /* @__PURE__ */ requireBase64url$1();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const check = (value, description) => {
    if (typeof value !== "string" || !value) {
      throw new errors_js_1.JWKInvalid(`${description} missing or invalid`);
    }
  };
  async function calculateJwkThumbprint(jwk, digestAlgorithm) {
    if (!(0, is_object_js_1.default)(jwk)) {
      throw new TypeError("JWK must be an object");
    }
    digestAlgorithm ??= "sha256";
    if (digestAlgorithm !== "sha256" && digestAlgorithm !== "sha384" && digestAlgorithm !== "sha512") {
      throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
    }
    let components;
    switch (jwk.kty) {
      case "EC":
        check(jwk.crv, '"crv" (Curve) Parameter');
        check(jwk.x, '"x" (X Coordinate) Parameter');
        check(jwk.y, '"y" (Y Coordinate) Parameter');
        components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
        break;
      case "OKP":
        check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
        check(jwk.x, '"x" (Public Key) Parameter');
        components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
        break;
      case "RSA":
        check(jwk.e, '"e" (Exponent) Parameter');
        check(jwk.n, '"n" (Modulus) Parameter');
        components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
        break;
      case "oct":
        check(jwk.k, '"k" (Key Value) Parameter');
        components = { k: jwk.k, kty: jwk.kty };
        break;
      default:
        throw new errors_js_1.JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = buffer_utils_js_1.encoder.encode(JSON.stringify(components));
    return (0, base64url_js_1.encode)(await (0, digest_js_1.default)(digestAlgorithm, data));
  }
  async function calculateJwkThumbprintUri(jwk, digestAlgorithm) {
    digestAlgorithm ??= "sha256";
    const thumbprint2 = await calculateJwkThumbprint(jwk, digestAlgorithm);
    return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint2}`;
  }
  return thumbprint;
}
var embedded = {};
var hasRequiredEmbedded;
function requireEmbedded() {
  if (hasRequiredEmbedded) return embedded;
  hasRequiredEmbedded = 1;
  Object.defineProperty(embedded, "__esModule", { value: true });
  embedded.EmbeddedJWK = EmbeddedJWK;
  const import_js_1 = /* @__PURE__ */ require_import();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
      ...protectedHeader,
      ...token?.header
    };
    if (!(0, is_object_js_1.default)(joseHeader.jwk)) {
      throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = await (0, import_js_1.importJWK)({ ...joseHeader.jwk, ext: true }, joseHeader.alg);
    if (key instanceof Uint8Array || key.type !== "public") {
      throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
  }
  return embedded;
}
var local = {};
var hasRequiredLocal;
function requireLocal() {
  if (hasRequiredLocal) return local;
  hasRequiredLocal = 1;
  Object.defineProperty(local, "__esModule", { value: true });
  local.createLocalJWKSet = createLocalJWKSet;
  const import_js_1 = /* @__PURE__ */ require_import();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  function getKtyFromAlg(alg) {
    switch (typeof alg === "string" && alg.slice(0, 2)) {
      case "RS":
      case "PS":
        return "RSA";
      case "ES":
        return "EC";
      case "Ed":
        return "OKP";
      default:
        throw new errors_js_1.JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    }
  }
  function isJWKSLike(jwks) {
    return jwks && typeof jwks === "object" && Array.isArray(jwks.keys) && jwks.keys.every(isJWKLike);
  }
  function isJWKLike(key) {
    return (0, is_object_js_1.default)(key);
  }
  function clone(obj) {
    if (typeof structuredClone === "function") {
      return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
  }
  class LocalJWKSet {
    _jwks;
    _cached = /* @__PURE__ */ new WeakMap();
    constructor(jwks) {
      if (!isJWKSLike(jwks)) {
        throw new errors_js_1.JWKSInvalid("JSON Web Key Set malformed");
      }
      this._jwks = clone(jwks);
    }
    async getKey(protectedHeader, token) {
      const { alg, kid } = { ...protectedHeader, ...token?.header };
      const kty = getKtyFromAlg(alg);
      const candidates = this._jwks.keys.filter((jwk2) => {
        let candidate = kty === jwk2.kty;
        if (candidate && typeof kid === "string") {
          candidate = kid === jwk2.kid;
        }
        if (candidate && typeof jwk2.alg === "string") {
          candidate = alg === jwk2.alg;
        }
        if (candidate && typeof jwk2.use === "string") {
          candidate = jwk2.use === "sig";
        }
        if (candidate && Array.isArray(jwk2.key_ops)) {
          candidate = jwk2.key_ops.includes("verify");
        }
        if (candidate) {
          switch (alg) {
            case "ES256":
              candidate = jwk2.crv === "P-256";
              break;
            case "ES256K":
              candidate = jwk2.crv === "secp256k1";
              break;
            case "ES384":
              candidate = jwk2.crv === "P-384";
              break;
            case "ES512":
              candidate = jwk2.crv === "P-521";
              break;
            case "Ed25519":
              candidate = jwk2.crv === "Ed25519";
              break;
            case "EdDSA":
              candidate = jwk2.crv === "Ed25519" || jwk2.crv === "Ed448";
              break;
          }
        }
        return candidate;
      });
      const { 0: jwk, length } = candidates;
      if (length === 0) {
        throw new errors_js_1.JWKSNoMatchingKey();
      }
      if (length !== 1) {
        const error = new errors_js_1.JWKSMultipleMatchingKeys();
        const { _cached } = this;
        error[Symbol.asyncIterator] = async function* () {
          for (const jwk2 of candidates) {
            try {
              yield await importWithAlgCache(_cached, jwk2, alg);
            } catch {
            }
          }
        };
        throw error;
      }
      return importWithAlgCache(this._cached, jwk, alg);
    }
  }
  async function importWithAlgCache(cache, jwk, alg) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
    if (cached[alg] === void 0) {
      const key = await (0, import_js_1.importJWK)({ ...jwk, ext: true }, alg);
      if (key instanceof Uint8Array || key.type !== "public") {
        throw new errors_js_1.JWKSInvalid("JSON Web Key Set members must be public keys");
      }
      cached[alg] = key;
    }
    return cached[alg];
  }
  function createLocalJWKSet(jwks) {
    const set = new LocalJWKSet(jwks);
    const localJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
    Object.defineProperties(localJWKSet, {
      jwks: {
        value: () => clone(set._jwks),
        enumerable: true,
        configurable: false,
        writable: false
      }
    });
    return localJWKSet;
  }
  return local;
}
var remote = {};
var fetch_jwks = {};
var hasRequiredFetch_jwks;
function requireFetch_jwks() {
  if (hasRequiredFetch_jwks) return fetch_jwks;
  hasRequiredFetch_jwks = 1;
  Object.defineProperty(fetch_jwks, "__esModule", { value: true });
  const http = require$$2;
  const https = nodeHTTPS;
  const node_events_1 = require$$2$1;
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const fetchJwks = async (url, timeout, options) => {
    let get;
    switch (url.protocol) {
      case "https:":
        get = https.get;
        break;
      case "http:":
        get = http.get;
        break;
      default:
        throw new TypeError("Unsupported URL protocol.");
    }
    const { agent, headers } = options;
    const req = get(url.href, {
      agent,
      timeout,
      headers
    });
    const [response] = await Promise.race([(0, node_events_1.once)(req, "response"), (0, node_events_1.once)(req, "timeout")]);
    if (!response) {
      req.destroy();
      throw new errors_js_1.JWKSTimeout();
    }
    if (response.statusCode !== 200) {
      throw new errors_js_1.JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
    }
    const parts = [];
    for await (const part of response) {
      parts.push(part);
    }
    try {
      return JSON.parse(buffer_utils_js_1.decoder.decode((0, buffer_utils_js_1.concat)(...parts)));
    } catch {
      throw new errors_js_1.JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
  };
  fetch_jwks.default = fetchJwks;
  return fetch_jwks;
}
var hasRequiredRemote;
function requireRemote() {
  if (hasRequiredRemote) return remote;
  hasRequiredRemote = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.experimental_jwksCache = exports.jwksCache = void 0;
    exports.createRemoteJWKSet = createRemoteJWKSet;
    const fetch_jwks_js_1 = /* @__PURE__ */ requireFetch_jwks();
    const errors_js_1 = /* @__PURE__ */ requireErrors();
    const local_js_1 = /* @__PURE__ */ requireLocal();
    const is_object_js_1 = /* @__PURE__ */ requireIs_object();
    function isCloudflareWorkers() {
      return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
    }
    let USER_AGENT;
    if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
      const NAME = "jose";
      const VERSION = "v5.10.0";
      USER_AGENT = `${NAME}/${VERSION}`;
    }
    exports.jwksCache = /* @__PURE__ */ Symbol();
    function isFreshJwksCache(input, cacheMaxAge) {
      if (typeof input !== "object" || input === null) {
        return false;
      }
      if (!("uat" in input) || typeof input.uat !== "number" || Date.now() - input.uat >= cacheMaxAge) {
        return false;
      }
      if (!("jwks" in input) || !(0, is_object_js_1.default)(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, is_object_js_1.default)) {
        return false;
      }
      return true;
    }
    class RemoteJWKSet {
      _url;
      _timeoutDuration;
      _cooldownDuration;
      _cacheMaxAge;
      _jwksTimestamp;
      _pendingFetch;
      _options;
      _local;
      _cache;
      constructor(url, options) {
        if (!(url instanceof URL)) {
          throw new TypeError("url must be an instance of URL");
        }
        this._url = new URL(url.href);
        this._options = { agent: options?.agent, headers: options?.headers };
        this._timeoutDuration = typeof options?.timeoutDuration === "number" ? options?.timeoutDuration : 5e3;
        this._cooldownDuration = typeof options?.cooldownDuration === "number" ? options?.cooldownDuration : 3e4;
        this._cacheMaxAge = typeof options?.cacheMaxAge === "number" ? options?.cacheMaxAge : 6e5;
        if (options?.[exports.jwksCache] !== void 0) {
          this._cache = options?.[exports.jwksCache];
          if (isFreshJwksCache(options?.[exports.jwksCache], this._cacheMaxAge)) {
            this._jwksTimestamp = this._cache.uat;
            this._local = (0, local_js_1.createLocalJWKSet)(this._cache.jwks);
          }
        }
      }
      coolingDown() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cooldownDuration : false;
      }
      fresh() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cacheMaxAge : false;
      }
      async getKey(protectedHeader, token) {
        if (!this._local || !this.fresh()) {
          await this.reload();
        }
        try {
          return await this._local(protectedHeader, token);
        } catch (err) {
          if (err instanceof errors_js_1.JWKSNoMatchingKey) {
            if (this.coolingDown() === false) {
              await this.reload();
              return this._local(protectedHeader, token);
            }
          }
          throw err;
        }
      }
      async reload() {
        if (this._pendingFetch && isCloudflareWorkers()) {
          this._pendingFetch = void 0;
        }
        const headers = new Headers(this._options.headers);
        if (USER_AGENT && !headers.has("User-Agent")) {
          headers.set("User-Agent", USER_AGENT);
          this._options.headers = Object.fromEntries(headers.entries());
        }
        this._pendingFetch ||= (0, fetch_jwks_js_1.default)(this._url, this._timeoutDuration, this._options).then((json) => {
          this._local = (0, local_js_1.createLocalJWKSet)(json);
          if (this._cache) {
            this._cache.uat = Date.now();
            this._cache.jwks = json;
          }
          this._jwksTimestamp = Date.now();
          this._pendingFetch = void 0;
        }).catch((err) => {
          this._pendingFetch = void 0;
          throw err;
        });
        await this._pendingFetch;
      }
    }
    function createRemoteJWKSet(url, options) {
      const set = new RemoteJWKSet(url, options);
      const remoteJWKSet = async (protectedHeader, token) => set.getKey(protectedHeader, token);
      Object.defineProperties(remoteJWKSet, {
        coolingDown: {
          get: () => set.coolingDown(),
          enumerable: true,
          configurable: false
        },
        fresh: {
          get: () => set.fresh(),
          enumerable: true,
          configurable: false
        },
        reload: {
          value: () => set.reload(),
          enumerable: true,
          configurable: false,
          writable: false
        },
        reloading: {
          get: () => !!set._pendingFetch,
          enumerable: true,
          configurable: false
        },
        jwks: {
          value: () => set._local?.jwks(),
          enumerable: true,
          configurable: false,
          writable: false
        }
      });
      return remoteJWKSet;
    }
    exports.experimental_jwksCache = exports.jwksCache;
  })(remote);
  return remote;
}
var unsecured = {};
var hasRequiredUnsecured;
function requireUnsecured() {
  if (hasRequiredUnsecured) return unsecured;
  hasRequiredUnsecured = 1;
  Object.defineProperty(unsecured, "__esModule", { value: true });
  unsecured.UnsecuredJWT = void 0;
  const base64url2 = /* @__PURE__ */ requireBase64url$1();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const jwt_claims_set_js_1 = /* @__PURE__ */ requireJwt_claims_set();
  const produce_js_1 = /* @__PURE__ */ requireProduce();
  class UnsecuredJWT extends produce_js_1.ProduceJWT {
    encode() {
      const header = base64url2.encode(JSON.stringify({ alg: "none" }));
      const payload = base64url2.encode(JSON.stringify(this._payload));
      return `${header}.${payload}.`;
    }
    static decode(jwt, options) {
      if (typeof jwt !== "string") {
        throw new errors_js_1.JWTInvalid("Unsecured JWT must be a string");
      }
      const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split(".");
      if (length !== 3 || signature !== "") {
        throw new errors_js_1.JWTInvalid("Invalid Unsecured JWT");
      }
      let header;
      try {
        header = JSON.parse(buffer_utils_js_1.decoder.decode(base64url2.decode(encodedHeader)));
        if (header.alg !== "none")
          throw new Error();
      } catch {
        throw new errors_js_1.JWTInvalid("Invalid Unsecured JWT");
      }
      const payload = (0, jwt_claims_set_js_1.default)(header, base64url2.decode(encodedPayload), options);
      return { payload, header };
    }
  }
  unsecured.UnsecuredJWT = UnsecuredJWT;
  return unsecured;
}
var decode_protected_header = {};
var base64url = {};
var hasRequiredBase64url;
function requireBase64url() {
  if (hasRequiredBase64url) return base64url;
  hasRequiredBase64url = 1;
  Object.defineProperty(base64url, "__esModule", { value: true });
  base64url.decode = base64url.encode = void 0;
  const base64url$12 = /* @__PURE__ */ requireBase64url$1();
  base64url.encode = base64url$12.encode;
  base64url.decode = base64url$12.decode;
  return base64url;
}
var hasRequiredDecode_protected_header;
function requireDecode_protected_header() {
  if (hasRequiredDecode_protected_header) return decode_protected_header;
  hasRequiredDecode_protected_header = 1;
  Object.defineProperty(decode_protected_header, "__esModule", { value: true });
  decode_protected_header.decodeProtectedHeader = decodeProtectedHeader;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  function decodeProtectedHeader(token) {
    let protectedB64u;
    if (typeof token === "string") {
      const parts = token.split(".");
      if (parts.length === 3 || parts.length === 5) {
        [protectedB64u] = parts;
      }
    } else if (typeof token === "object" && token) {
      if ("protected" in token) {
        protectedB64u = token.protected;
      } else {
        throw new TypeError("Token does not contain a Protected Header");
      }
    }
    try {
      if (typeof protectedB64u !== "string" || !protectedB64u) {
        throw new Error();
      }
      const result = JSON.parse(buffer_utils_js_1.decoder.decode((0, base64url_js_1.decode)(protectedB64u)));
      if (!(0, is_object_js_1.default)(result)) {
        throw new Error();
      }
      return result;
    } catch {
      throw new TypeError("Invalid Token or Protected Header formatting");
    }
  }
  return decode_protected_header;
}
var decode_jwt = {};
var hasRequiredDecode_jwt;
function requireDecode_jwt() {
  if (hasRequiredDecode_jwt) return decode_jwt;
  hasRequiredDecode_jwt = 1;
  Object.defineProperty(decode_jwt, "__esModule", { value: true });
  decode_jwt.decodeJwt = decodeJwt;
  const base64url_js_1 = /* @__PURE__ */ requireBase64url();
  const buffer_utils_js_1 = /* @__PURE__ */ requireBuffer_utils();
  const is_object_js_1 = /* @__PURE__ */ requireIs_object();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  function decodeJwt(jwt) {
    if (typeof jwt !== "string")
      throw new errors_js_1.JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload, length } = jwt.split(".");
    if (length === 5)
      throw new errors_js_1.JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3)
      throw new errors_js_1.JWTInvalid("Invalid JWT");
    if (!payload)
      throw new errors_js_1.JWTInvalid("JWTs must contain a payload");
    let decoded;
    try {
      decoded = (0, base64url_js_1.decode)(payload);
    } catch {
      throw new errors_js_1.JWTInvalid("Failed to base64url decode the payload");
    }
    let result;
    try {
      result = JSON.parse(buffer_utils_js_1.decoder.decode(decoded));
    } catch {
      throw new errors_js_1.JWTInvalid("Failed to parse the decoded payload as JSON");
    }
    if (!(0, is_object_js_1.default)(result))
      throw new errors_js_1.JWTInvalid("Invalid JWT Claims Set");
    return result;
  }
  return decode_jwt;
}
var generate_key_pair = {};
var generate = {};
var hasRequiredGenerate;
function requireGenerate() {
  if (hasRequiredGenerate) return generate;
  hasRequiredGenerate = 1;
  Object.defineProperty(generate, "__esModule", { value: true });
  generate.generateSecret = generateSecret;
  generate.generateKeyPair = generateKeyPair;
  const node_crypto_1 = require$$0;
  const node_util_1 = require$$1;
  const random_js_1 = /* @__PURE__ */ requireRandom();
  const errors_js_1 = /* @__PURE__ */ requireErrors();
  const generate$1 = (0, node_util_1.promisify)(node_crypto_1.generateKeyPair);
  async function generateSecret(alg, options) {
    let length;
    switch (alg) {
      case "HS256":
      case "HS384":
      case "HS512":
      case "A128CBC-HS256":
      case "A192CBC-HS384":
      case "A256CBC-HS512":
        length = parseInt(alg.slice(-3), 10);
        break;
      case "A128KW":
      case "A192KW":
      case "A256KW":
      case "A128GCMKW":
      case "A192GCMKW":
      case "A256GCMKW":
      case "A128GCM":
      case "A192GCM":
      case "A256GCM":
        length = parseInt(alg.slice(1, 4), 10);
        break;
      default:
        throw new errors_js_1.JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return (0, node_crypto_1.createSecretKey)((0, random_js_1.default)(new Uint8Array(length >> 3)));
  }
  async function generateKeyPair(alg, options) {
    switch (alg) {
      case "RS256":
      case "RS384":
      case "RS512":
      case "PS256":
      case "PS384":
      case "PS512":
      case "RSA-OAEP":
      case "RSA-OAEP-256":
      case "RSA-OAEP-384":
      case "RSA-OAEP-512":
      case "RSA1_5": {
        const modulusLength = options?.modulusLength ?? 2048;
        if (typeof modulusLength !== "number" || modulusLength < 2048) {
          throw new errors_js_1.JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
        }
        const keypair = await generate$1("rsa", {
          modulusLength,
          publicExponent: 65537
        });
        return keypair;
      }
      case "ES256":
        return generate$1("ec", { namedCurve: "P-256" });
      case "ES256K":
        return generate$1("ec", { namedCurve: "secp256k1" });
      case "ES384":
        return generate$1("ec", { namedCurve: "P-384" });
      case "ES512":
        return generate$1("ec", { namedCurve: "P-521" });
      case "Ed25519":
        return generate$1("ed25519");
      case "EdDSA": {
        switch (options?.crv) {
          case void 0:
          case "Ed25519":
            return generate$1("ed25519");
          case "Ed448":
            return generate$1("ed448");
          default:
            throw new errors_js_1.JOSENotSupported("Invalid or unsupported crv option provided, supported values are Ed25519 and Ed448");
        }
      }
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW": {
        const crv = options?.crv ?? "P-256";
        switch (crv) {
          case void 0:
          case "P-256":
          case "P-384":
          case "P-521":
            return generate$1("ec", { namedCurve: crv });
          case "X25519":
            return generate$1("x25519");
          case "X448":
            return generate$1("x448");
          default:
            throw new errors_js_1.JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
        }
      }
      default:
        throw new errors_js_1.JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
  }
  return generate;
}
var hasRequiredGenerate_key_pair;
function requireGenerate_key_pair() {
  if (hasRequiredGenerate_key_pair) return generate_key_pair;
  hasRequiredGenerate_key_pair = 1;
  Object.defineProperty(generate_key_pair, "__esModule", { value: true });
  generate_key_pair.generateKeyPair = generateKeyPair;
  const generate_js_1 = /* @__PURE__ */ requireGenerate();
  async function generateKeyPair(alg, options) {
    return (0, generate_js_1.generateKeyPair)(alg, options);
  }
  return generate_key_pair;
}
var generate_secret = {};
var hasRequiredGenerate_secret;
function requireGenerate_secret() {
  if (hasRequiredGenerate_secret) return generate_secret;
  hasRequiredGenerate_secret = 1;
  Object.defineProperty(generate_secret, "__esModule", { value: true });
  generate_secret.generateSecret = generateSecret;
  const generate_js_1 = /* @__PURE__ */ requireGenerate();
  async function generateSecret(alg, options) {
    return (0, generate_js_1.generateSecret)(alg, options);
  }
  return generate_secret;
}
var runtime$1 = {};
var runtime = {};
var hasRequiredRuntime$1;
function requireRuntime$1() {
  if (hasRequiredRuntime$1) return runtime;
  hasRequiredRuntime$1 = 1;
  Object.defineProperty(runtime, "__esModule", { value: true });
  runtime.default = "node:crypto";
  return runtime;
}
var hasRequiredRuntime;
function requireRuntime() {
  if (hasRequiredRuntime) return runtime$1;
  hasRequiredRuntime = 1;
  Object.defineProperty(runtime$1, "__esModule", { value: true });
  const runtime_js_1 = /* @__PURE__ */ requireRuntime$1();
  runtime$1.default = runtime_js_1.default;
  return runtime$1;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cryptoRuntime = exports.base64url = exports.generateSecret = exports.generateKeyPair = exports.errors = exports.decodeJwt = exports.decodeProtectedHeader = exports.importJWK = exports.importX509 = exports.importPKCS8 = exports.importSPKI = exports.exportJWK = exports.exportSPKI = exports.exportPKCS8 = exports.UnsecuredJWT = exports.experimental_jwksCache = exports.jwksCache = exports.createRemoteJWKSet = exports.createLocalJWKSet = exports.EmbeddedJWK = exports.calculateJwkThumbprintUri = exports.calculateJwkThumbprint = exports.EncryptJWT = exports.SignJWT = exports.GeneralSign = exports.FlattenedSign = exports.CompactSign = exports.FlattenedEncrypt = exports.CompactEncrypt = exports.jwtDecrypt = exports.jwtVerify = exports.generalVerify = exports.flattenedVerify = exports.compactVerify = exports.GeneralEncrypt = exports.generalDecrypt = exports.flattenedDecrypt = exports.compactDecrypt = void 0;
    var decrypt_js_1 = /* @__PURE__ */ requireDecrypt$2();
    Object.defineProperty(exports, "compactDecrypt", { enumerable: true, get: function() {
      return decrypt_js_1.compactDecrypt;
    } });
    var decrypt_js_2 = /* @__PURE__ */ requireDecrypt$3();
    Object.defineProperty(exports, "flattenedDecrypt", { enumerable: true, get: function() {
      return decrypt_js_2.flattenedDecrypt;
    } });
    var decrypt_js_3 = /* @__PURE__ */ requireDecrypt$1();
    Object.defineProperty(exports, "generalDecrypt", { enumerable: true, get: function() {
      return decrypt_js_3.generalDecrypt;
    } });
    var encrypt_js_1 = /* @__PURE__ */ requireEncrypt$2();
    Object.defineProperty(exports, "GeneralEncrypt", { enumerable: true, get: function() {
      return encrypt_js_1.GeneralEncrypt;
    } });
    var verify_js_1 = /* @__PURE__ */ requireVerify$2();
    Object.defineProperty(exports, "compactVerify", { enumerable: true, get: function() {
      return verify_js_1.compactVerify;
    } });
    var verify_js_2 = /* @__PURE__ */ requireVerify$3();
    Object.defineProperty(exports, "flattenedVerify", { enumerable: true, get: function() {
      return verify_js_2.flattenedVerify;
    } });
    var verify_js_3 = /* @__PURE__ */ requireVerify$1();
    Object.defineProperty(exports, "generalVerify", { enumerable: true, get: function() {
      return verify_js_3.generalVerify;
    } });
    var verify_js_4 = /* @__PURE__ */ requireVerify();
    Object.defineProperty(exports, "jwtVerify", { enumerable: true, get: function() {
      return verify_js_4.jwtVerify;
    } });
    var decrypt_js_4 = /* @__PURE__ */ requireDecrypt();
    Object.defineProperty(exports, "jwtDecrypt", { enumerable: true, get: function() {
      return decrypt_js_4.jwtDecrypt;
    } });
    var encrypt_js_2 = /* @__PURE__ */ requireEncrypt$1();
    Object.defineProperty(exports, "CompactEncrypt", { enumerable: true, get: function() {
      return encrypt_js_2.CompactEncrypt;
    } });
    var encrypt_js_3 = /* @__PURE__ */ requireEncrypt$3();
    Object.defineProperty(exports, "FlattenedEncrypt", { enumerable: true, get: function() {
      return encrypt_js_3.FlattenedEncrypt;
    } });
    var sign_js_1 = /* @__PURE__ */ requireSign$2();
    Object.defineProperty(exports, "CompactSign", { enumerable: true, get: function() {
      return sign_js_1.CompactSign;
    } });
    var sign_js_2 = /* @__PURE__ */ requireSign$3();
    Object.defineProperty(exports, "FlattenedSign", { enumerable: true, get: function() {
      return sign_js_2.FlattenedSign;
    } });
    var sign_js_3 = /* @__PURE__ */ requireSign$1();
    Object.defineProperty(exports, "GeneralSign", { enumerable: true, get: function() {
      return sign_js_3.GeneralSign;
    } });
    var sign_js_4 = /* @__PURE__ */ requireSign();
    Object.defineProperty(exports, "SignJWT", { enumerable: true, get: function() {
      return sign_js_4.SignJWT;
    } });
    var encrypt_js_4 = /* @__PURE__ */ requireEncrypt();
    Object.defineProperty(exports, "EncryptJWT", { enumerable: true, get: function() {
      return encrypt_js_4.EncryptJWT;
    } });
    var thumbprint_js_1 = /* @__PURE__ */ requireThumbprint();
    Object.defineProperty(exports, "calculateJwkThumbprint", { enumerable: true, get: function() {
      return thumbprint_js_1.calculateJwkThumbprint;
    } });
    Object.defineProperty(exports, "calculateJwkThumbprintUri", { enumerable: true, get: function() {
      return thumbprint_js_1.calculateJwkThumbprintUri;
    } });
    var embedded_js_1 = /* @__PURE__ */ requireEmbedded();
    Object.defineProperty(exports, "EmbeddedJWK", { enumerable: true, get: function() {
      return embedded_js_1.EmbeddedJWK;
    } });
    var local_js_1 = /* @__PURE__ */ requireLocal();
    Object.defineProperty(exports, "createLocalJWKSet", { enumerable: true, get: function() {
      return local_js_1.createLocalJWKSet;
    } });
    var remote_js_1 = /* @__PURE__ */ requireRemote();
    Object.defineProperty(exports, "createRemoteJWKSet", { enumerable: true, get: function() {
      return remote_js_1.createRemoteJWKSet;
    } });
    Object.defineProperty(exports, "jwksCache", { enumerable: true, get: function() {
      return remote_js_1.jwksCache;
    } });
    Object.defineProperty(exports, "experimental_jwksCache", { enumerable: true, get: function() {
      return remote_js_1.experimental_jwksCache;
    } });
    var unsecured_js_1 = /* @__PURE__ */ requireUnsecured();
    Object.defineProperty(exports, "UnsecuredJWT", { enumerable: true, get: function() {
      return unsecured_js_1.UnsecuredJWT;
    } });
    var export_js_1 = /* @__PURE__ */ require_export();
    Object.defineProperty(exports, "exportPKCS8", { enumerable: true, get: function() {
      return export_js_1.exportPKCS8;
    } });
    Object.defineProperty(exports, "exportSPKI", { enumerable: true, get: function() {
      return export_js_1.exportSPKI;
    } });
    Object.defineProperty(exports, "exportJWK", { enumerable: true, get: function() {
      return export_js_1.exportJWK;
    } });
    var import_js_1 = /* @__PURE__ */ require_import();
    Object.defineProperty(exports, "importSPKI", { enumerable: true, get: function() {
      return import_js_1.importSPKI;
    } });
    Object.defineProperty(exports, "importPKCS8", { enumerable: true, get: function() {
      return import_js_1.importPKCS8;
    } });
    Object.defineProperty(exports, "importX509", { enumerable: true, get: function() {
      return import_js_1.importX509;
    } });
    Object.defineProperty(exports, "importJWK", { enumerable: true, get: function() {
      return import_js_1.importJWK;
    } });
    var decode_protected_header_js_1 = /* @__PURE__ */ requireDecode_protected_header();
    Object.defineProperty(exports, "decodeProtectedHeader", { enumerable: true, get: function() {
      return decode_protected_header_js_1.decodeProtectedHeader;
    } });
    var decode_jwt_js_1 = /* @__PURE__ */ requireDecode_jwt();
    Object.defineProperty(exports, "decodeJwt", { enumerable: true, get: function() {
      return decode_jwt_js_1.decodeJwt;
    } });
    exports.errors = /* @__PURE__ */ requireErrors();
    var generate_key_pair_js_1 = /* @__PURE__ */ requireGenerate_key_pair();
    Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function() {
      return generate_key_pair_js_1.generateKeyPair;
    } });
    var generate_secret_js_1 = /* @__PURE__ */ requireGenerate_secret();
    Object.defineProperty(exports, "generateSecret", { enumerable: true, get: function() {
      return generate_secret_js_1.generateSecret;
    } });
    exports.base64url = /* @__PURE__ */ requireBase64url();
    var runtime_js_1 = /* @__PURE__ */ requireRuntime();
    Object.defineProperty(exports, "cryptoRuntime", { enumerable: true, get: function() {
      return runtime_js_1.default;
    } });
  })(cjs);
  return cjs;
}
export {
  requireCjs as r
};
