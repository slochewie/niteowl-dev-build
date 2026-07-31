import require$$0$1 from "buffer";
import require$$0 from "stream";
import require$$0$2 from "util";
var getStream = { exports: {} };
var bufferStream;
var hasRequiredBufferStream;
function requireBufferStream() {
  if (hasRequiredBufferStream) return bufferStream;
  hasRequiredBufferStream = 1;
  const { PassThrough: PassThroughStream } = require$$0;
  bufferStream = (options) => {
    options = { ...options };
    const { array } = options;
    let { encoding } = options;
    const isBuffer = encoding === "buffer";
    let objectMode = false;
    if (array) {
      objectMode = !(encoding || isBuffer);
    } else {
      encoding = encoding || "utf8";
    }
    if (isBuffer) {
      encoding = null;
    }
    const stream = new PassThroughStream({ objectMode });
    if (encoding) {
      stream.setEncoding(encoding);
    }
    let length = 0;
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
      if (objectMode) {
        length = chunks.length;
      } else {
        length += chunk.length;
      }
    });
    stream.getBufferedValue = () => {
      if (array) {
        return chunks;
      }
      return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
    };
    stream.getBufferedLength = () => length;
    return stream;
  };
  return bufferStream;
}
var hasRequiredGetStream;
function requireGetStream() {
  if (hasRequiredGetStream) return getStream.exports;
  hasRequiredGetStream = 1;
  const { constants: BufferConstants } = require$$0$1;
  const stream = require$$0;
  const { promisify } = require$$0$2;
  const bufferStream2 = requireBufferStream();
  const streamPipelinePromisified = promisify(stream.pipeline);
  class MaxBufferError extends Error {
    constructor() {
      super("maxBuffer exceeded");
      this.name = "MaxBufferError";
    }
  }
  async function getStream$1(inputStream, options) {
    if (!inputStream) {
      throw new Error("Expected a stream");
    }
    options = {
      maxBuffer: Infinity,
      ...options
    };
    const { maxBuffer } = options;
    const stream2 = bufferStream2(options);
    await new Promise((resolve, reject) => {
      const rejectPromise = (error) => {
        if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
          error.bufferedData = stream2.getBufferedValue();
        }
        reject(error);
      };
      (async () => {
        try {
          await streamPipelinePromisified(inputStream, stream2);
          resolve();
        } catch (error) {
          rejectPromise(error);
        }
      })();
      stream2.on("data", () => {
        if (stream2.getBufferedLength() > maxBuffer) {
          rejectPromise(new MaxBufferError());
        }
      });
    });
    return stream2.getBufferedValue();
  }
  getStream.exports = getStream$1;
  getStream.exports.buffer = (stream2, options) => getStream$1(stream2, { ...options, encoding: "buffer" });
  getStream.exports.array = (stream2, options) => getStream$1(stream2, { ...options, array: true });
  getStream.exports.MaxBufferError = MaxBufferError;
  return getStream.exports;
}
export {
  requireGetStream as r
};
