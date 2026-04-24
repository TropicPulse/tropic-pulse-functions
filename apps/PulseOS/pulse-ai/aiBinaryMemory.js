/**
 * aiBinaryMemory.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Memory Layer** of Pulse OS.
 *
 *   It stores:
 *     - binary segments
 *     - binary keys
 *     - binary values
 *     - binary snapshots
 *
 *   It is the organism’s:
 *     • binary hippocampus
 *     • structural memory engine
 *     • persistent binary substrate
 *     • memory artery source
 *
 *   It now includes:
 *     - binary memory throughput
 *     - binary memory pressure
 *     - binary memory cost
 *     - binary memory budget
 *     - descriptive buckets
 */

class AIBinaryMemory {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-memory';
    this.maxBits = config.maxBits || 4096;
    this.trace = !!config.trace;

    this.segments = new Map();
  }

  // ---------------------------------------------------------
  //  BINARY MEMORY ARTERY METRICS
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  //  INTERNAL MEMORY STATE METRICS
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  //  BINARY MEMORY OPERATIONS
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

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

function createAIBinaryMemory(config) {
  return new AIBinaryMemory(config);
}

module.exports = {
  AIBinaryMemory,
  createAIBinaryMemory,
};
