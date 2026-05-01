/**
 * aiBinaryAgent.js — Pulse OS v12.3‑Presence Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Compute Cortex** of the organism.
 *
 *   In the v12.3‑Presence dualband organism:
 *     - This organ remains a **binary‑only physiology organ**
 *     - It provides the organism’s low‑level compute reflexes
 *     - It measures compute throughput, pressure, cost, and budget
 *     - It performs binary encoding/decoding
 *     - It executes binary compute arteries
 *     - It exposes a presence‑aware surface for orchestration
 *
 *   This organ is NOT symbolic, NOT dualband, NOT cognitive.
 *   It is pure binary physiology — the “bit‑level cortex.”
 */

// ---------------------------------------------------------
//  META BLOCK — v12.3‑Presence
// ---------------------------------------------------------

export const BinaryAgentMeta = Object.freeze({
  layer: "BinaryCompute",
  role: "BINARY_COMPUTE_CORTEX",
  version: "12.3-Presence",
  identity: "aiBinaryAgent-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    computeAware: true,
    arteryAware: true,
    metricsAware: true,
    encodingAware: true,
    decodingAware: true,
    multiInstanceReady: true,
    epoch: "v12.3-Presence",

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    dualBandSafe: true,   // safe to live in dualband organism, but stays binary‑only
    sideEffectFree: true
  }),

  contract: Object.freeze({
    purpose:
      "Provide a pure binary compute cortex that encodes/decodes values, executes binary compute arteries, and measures compute throughput, pressure, cost, and budget.",

    never: Object.freeze([
      "interpret symbolic meaning",
      "perform cognition",
      "act as a router",
      "act as a scheduler",
      "mutate external organs",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "operate on binary-only values",
      "compute artery metrics deterministically",
      "encode values into binary",
      "decode binary into requested types",
      "validate binary inputs",
      "remain pure and minimal"
    ])
  }),

  presence: Object.freeze({
    organId: "BinaryComputeCortex",
    organKind: "Physiology",
    physiologyBand: "Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "computeBinary:inputs",
        "computeBinary:rawResult",
        "computeAndProject:projected",
        "addBinary",
        "andBinary",
        "orBinary",
        "bytesToBinary:truncated"
      ]
    }
  })
});

// ---------------------------------------------------------
//  BINARY AGENT PREWARM ENGINE — v12.3‑Presence
// ---------------------------------------------------------

export function prewarmAIBinaryAgent(config = {}) {
  try {
    const {
      encoder,
      compute,
      trace,
      measurePressure,
      measureThroughput,
      measureCost,
      measureBudget
    } = config;

    const localTrace = !!trace;
    const traceFn = localTrace
      ? (event, payload) =>
          console.log("[AIBinaryAgent:prewarm]", event, payload)
      : () => {};

    // Warm encoder encode/decode
    if (encoder?.encode && encoder?.decode) {
      const warmJson = JSON.stringify({ id: "prewarm", bits: 0 });
      const warmBits = encoder.encode(warmJson);
      encoder.decode(warmBits, "string");
      traceFn("encoder:warm", { bits: warmBits.length });
    }

    // Warm binary compute arteries
    if (typeof compute === "function" && encoder?.encode) {
      const token = encoder.encode("prewarm-compute");
      compute(token);
      traceFn("compute:warm", { tokenBits: token.length });
    }

    // Warm pressure/throughput/cost/budget meters if present
    if (typeof measurePressure === "function") {
      measurePressure();
      traceFn("measurePressure:warm");
    }
    if (typeof measureThroughput === "function") {
      measureThroughput();
      traceFn("measureThroughput:warm");
    }
    if (typeof measureCost === "function") {
      measureCost();
      traceFn("measureCost:warm");
    }
    if (typeof measureBudget === "function") {
      measureBudget();
      traceFn("measureBudget:warm");
    }

    return true;
  } catch (err) {
    console.error("[AIBinaryAgent Prewarm] Failed:", err);
    return false;
  }
}

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v12.3‑Presence
// ---------------------------------------------------------

class AIBinaryAgent {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-agent";
    this.maxBits = typeof config.maxBits === "number" ? config.maxBits : 64;
    this.trace = !!config.trace;

    // Optional GPU / buffer hints (no hard dependency, just presence‑aware)
    this.gpuHints = Object.freeze({
      allowGPU: !!config.allowGPU,
      preferredBatchSize: config.preferredBatchSize || 0,
      preferredBufferBits: config.preferredBufferBits || this.maxBits
    });
  }

  // ---------------------------------------------------------
  //  BINARY COMPUTE ARTERY METRICS
  // ---------------------------------------------------------

  _computeComputeThroughput(inputCount, avgBits) {
    const countFactor = Math.min(1, inputCount / 20);
    const sizeFactor = Math.min(1, avgBits / this.maxBits);
    const raw = Math.max(0, 1 - (countFactor * 0.5 + sizeFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeComputePressure(inputCount, totalBits) {
    const density = inputCount + totalBits / this.maxBits;
    const raw = Math.min(1, density / 30);
    return Math.max(0, raw);
  }

  _computeComputeCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeComputeBudget(throughput, cost) {
    const raw = throughput - cost;
    return Math.max(0, Math.min(1, raw));
  }

  _bucketLevel(v) {
    if (v >= 0.9) return "elite";
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "medium";
    if (v >= 0.25) return "low";
    return "critical";
  }

  _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0) return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8) return "heavy";
    if (v >= 0.5) return "moderate";
    if (v >= 0.2) return "light";
    if (v > 0) return "negligible";
    return "none";
  }

  _computeArtery(binaryInputs) {
    const inputCount = binaryInputs.length;

    let totalBits = 0;
    for (const b of binaryInputs) totalBits += b.length;

    const avgBits = inputCount > 0 ? totalBits / inputCount : 0;

    const throughput = this._computeComputeThroughput(inputCount, avgBits);
    const pressure = this._computeComputePressure(inputCount, totalBits);
    const cost = this._computeComputeCost(pressure, throughput);
    const budget = this._computeComputeBudget(throughput, cost);

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      inputCount,
      totalBits,
      avgBits
    };
  }

  // ---------------------------------------------------------
  //  BINARY ENCODING / DECODING
  // ---------------------------------------------------------

  encodeNumber(value) {
    if (typeof value === "bigint") return value.toString(2);
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError("encodeNumber expects a finite number or bigint");
    }
    return Math.trunc(value).toString(2);
  }

  decodeNumber(binaryStr) {
    if (!/^[01]+$/.test(binaryStr)) {
      throw new TypeError("decodeNumber expects a binary string");
    }
    if (binaryStr.length > 53) {
      return BigInt("0b" + binaryStr);
    }
    return parseInt(binaryStr, 2);
  }

  encode(value) {
    if (typeof value === "number" || typeof value === "bigint") {
      return this.encodeNumber(value);
    }
    if (typeof value === "string") {
      const bytes = Buffer.from(value, "utf8");
      return this._bytesToBinary(bytes);
    }
    if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
      return this._bytesToBinary(value);
    }
    throw new TypeError("encode: unsupported type");
  }

  decode(binaryStr, type = "number") {
    switch (type) {
      case "number":
        return this.decodeNumber(binaryStr);
      case "bigint":
        return BigInt("0b" + binaryStr);
      case "string": {
        const bytes = this._binaryToBytes(binaryStr);
        return Buffer.from(bytes).toString("utf8");
      }
      case "bytes":
        return this._binaryToBytes(binaryStr);
      default:
        throw new TypeError(`decode: unsupported target type "${type}"`);
    }
  }

  // ---------------------------------------------------------
  //  BINARY COMPUTE SURFACE (Presence‑aware)
// ---------------------------------------------------------

  computeBinary(fn, ...inputs) {
    if (typeof fn !== "function") {
      throw new TypeError("computeBinary expects a function");
    }

    const binaryInputs = inputs.map((v) => this.encode(v));
    const artery = this._computeArtery(binaryInputs);

    this._trace("computeBinary:inputs", {
      binaryInputs,
      artery,
      gpuHints: this.gpuHints
    });

    const result = fn(binaryInputs);

    this._trace("computeBinary:rawResult", result);

    if (Array.isArray(result)) {
      result.forEach((r) => this._assertBinary(r));
    } else {
      this._assertBinary(result);
    }

    return result;
  }

  computeAndProject(fn, projector, ...inputs) {
    const binaryResult = this.computeBinary(fn, ...inputs);

    if (Array.isArray(binaryResult)) {
      const projected = binaryResult.map((b) => projector(b));
      this._trace("computeAndProject:projected", projected);
      return projected;
    }

    const projected = projector(binaryResult);
    this._trace("computeAndProject:projected", projected);
    return projected;
  }

  // ---------------------------------------------------------
  //  EXAMPLE BINARY OPS
  // ---------------------------------------------------------

  addBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const a = BigInt("0b" + aBin);
    const b = BigInt("0b" + bBin);
    const sum = a + b;

    const out = sum.toString(2);
    this._trace("addBinary", { aBin, bBin, out });
    return out;
  }

  andBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const len = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(len, "0");
    const b = bBin.padStart(len, "0");

    let out = "";
    for (let i = 0; i < len; i++) {
      out += a[i] === "1" && b[i] === "1" ? "1" : "0";
    }

    this._trace("andBinary", { a, b, out });
    return out.replace(/^0+(?=\d)/, "");
  }

  orBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const len = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(len, "0");
    const b = bBin.padStart(len, "0");

    let out = "";
    for (let i = 0; i < len; i++) {
      out += a[i] === "1" || b[i] === "1" ? "1" : "0";
    }

    this._trace("orBinary", { a, b, out });
    return out.replace(/^0+(?=\d)/, "");
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _bytesToBinary(bytes) {
    let out = "";
    for (const byte of bytes) {
      out += byte.toString(2).padStart(8, "0");
    }

    if (out.length > this.maxBits && this.maxBits > 0) {
      this._trace("bytesToBinary:truncated", {
        originalBits: out.length,
        maxBits: this.maxBits
      });
      return out.slice(-this.maxBits);
    }

    return out;
  }

  _binaryToBytes(binaryStr) {
    this._assertBinary(binaryStr);

    const padded = binaryStr.padStart(
      Math.ceil(binaryStr.length / 8) * 8,
      "0"
    );

    const bytes = [];
    for (let i = 0; i < padded.length; i += 8) {
      bytes.push(parseInt(padded.slice(i, i + 8), 2));
    }

    return Uint8Array.from(bytes);
  }

  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  PRESENCE SURFACE / FACTORY EXPORT — v12.3‑Presence
// ---------------------------------------------------------

export function createAIBinaryAgent(config = {}) {
  prewarmAIBinaryAgent(config); // one-time binary cortex warm-up
  return new AIBinaryAgent(config);
}

export const BinaryAgentPresence = Object.freeze({
  meta: BinaryAgentMeta,
  create: createAIBinaryAgent,
  prewarm: prewarmAIBinaryAgent,
  organ: "AIBinaryAgent",
  layer: BinaryAgentMeta.layer,
  role: BinaryAgentMeta.role,
  version: BinaryAgentMeta.version
});

// Keep direct class export for advanced callers
export { AIBinaryAgent };

// ---------------------------------------------------------
//  COMMONJS FALLBACK EXPORT (Dual‑Mode)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryAgent,
    createAIBinaryAgent,
    BinaryAgentMeta,
    BinaryAgentPresence,
    prewarmAIBinaryAgent
  };
}
