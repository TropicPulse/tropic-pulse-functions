/**
 * aiMemory.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Memory Layer** of Pulse OS (dualband).
 *
 *   It stores:
 *     - binary segments
 *     - binary keys
 *     - binary values
 *     - binary snapshots
 *
 *   It is the organism’s:
 *     • hippocampus
 *     • structural memory engine
 *     • persistent substrate
 *     • memory artery source
 *
 *   It includes:
 *     - memory throughput
 *     - memory pressure
 *     - memory cost
 *     - memory budget
 *     - descriptive buckets
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

export const MemoryMeta = Object.freeze({
  layer: "OrganismMemory",
  role: "MEMORY_LAYER",
  version: "11.0-EVO",
  identity: "aiMemory-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    memoryAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic memory storage with artery metrics for throughput, pressure, cost, and budget.",

    never: Object.freeze([
      "store non-binary data",
      "interpret symbolic state",
      "mutate external organs",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "validate binary inputs",
      "store keys and values in binary",
      "compute memory artery metrics",
      "remain pure and minimal",
      "treat all memory segments as read-only data"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (LOGIC UNCHANGED)
// ---------------------------------------------------------

class AIMemory {
  constructor(config = {}) {
    this.id = config.id || 'memory';
    this.maxBits = config.maxBits || 4096;
    this.trace = !!config.trace;

    this.segments = new Map();
  }

  _computeMemoryThroughput(segmentCount, avgSize) {
    const countFactor = Math.min(1, segmentCount / 100);
    const sizeFactor = Math.min(1, avgSize / this.maxBits);
    const raw = Math.max(0, 1 - (countFactor * 0.5 + sizeFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeMemoryPressure(totalBits, maxBits) {
    const raw = Math.min(1, totalBits / maxBits);
    return Math.max(0, raw);
  }

  _computeMemoryCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeMemoryBudget(throughput, cost) {
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
    if (v > 0)   return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8) return "heavy";
    if (v >= 0.5) return "moderate";
    if (v >= 0.2) return "light";
    if (v > 0)    return "negligible";
    return "none";
  }

  _computeMemoryArtery() {
    const keys = Array.from(this.segments.keys());
    const segmentCount = keys.length;

    let totalBits = 0;
    let avgSize = 0;

    if (segmentCount > 0) {
      for (const key of keys) {
        const val = this.segments.get(key);
        totalBits += key.length + val.length;
      }
      avgSize = totalBits / segmentCount;
    }

    const throughput = this._computeMemoryThroughput(segmentCount, avgSize);
    const pressure   = this._computeMemoryPressure(totalBits, this.maxBits);
    const cost       = this._computeMemoryCost(pressure, throughput);
    const budget     = this._computeMemoryBudget(throughput, cost);

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      segmentCount,
      totalBits,
      avgSize
    };
  }

  write(keyBin, valueBin) {
    this._assertBinary(keyBin);
    this._assertBinary(valueBin);

    if (valueBin.length > this.maxBits) {
      this._trace('write:truncated', { keyBin, originalBits: valueBin.length });
      valueBin = valueBin.slice(-this.maxBits);
    }

    this.segments.set(keyBin, valueBin);

    const artery = this._computeMemoryArtery();
    this._trace('write', { keyBin, valueBin, artery });
  }

  read(keyBin) {
    this._assertBinary(keyBin);
    const value = this.segments.get(keyBin);

    const artery = this._computeMemoryArtery();
    this._trace('read', { keyBin, value, artery });

    return value;
  }

  delete(keyBin) {
    this._assertBinary(keyBin);
    const existed = this.segments.delete(keyBin);

    const artery = this._computeMemoryArtery();
    this._trace('delete', { keyBin, existed, artery });
  }

  listKeys() {
    const keys = Array.from(this.segments.keys());
    const artery = this._computeMemoryArtery();

    this._trace('listKeys', { keys, artery });
    return keys;
  }

  snapshot() {
    const keys = Array.from(this.segments.keys()).sort();
    let out = '';

    for (const key of keys) {
      const val = this.segments.get(key);
      out += key + val;
    }

    if (out.length > this.maxBits) {
      this._trace('snapshot:truncated', { originalBits: out.length });
      out = out.slice(-this.maxBits);
    }

    const artery = this._computeMemoryArtery();
    this._trace('snapshot', { bits: out.length, artery });

    return out;
  }

  _assertBinary(str) {
    if (typeof str !== 'string' || !/^[01]+$/.test(str)) {
      throw new TypeError('expected binary string');
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIMemory(config) {
  return new AIMemory(config);
}

module.exports = {
  AIMemory,
  createAIMemory,
  MemoryMeta
};
