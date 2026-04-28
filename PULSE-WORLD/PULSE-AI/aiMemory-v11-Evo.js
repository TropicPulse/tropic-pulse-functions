// ============================================================================
//  aiMemory.js — Pulse OS v11.3‑EVO Organ
//  Pure PulseCoreMemory Adapter • Dualband • Binary‑Only • Zero Local State
// ----------------------------------------------------------------------------
//  CANONICAL ROLE:
//    This organ is the **Memory Layer Adapter** of Pulse OS (dualband).
//
//    It does NOT own storage.
//    It does NOT cache locally.
//    It does NOT interpret symbolic state.
//
//    It ONLY:
//      • validates binary keys + values
//      • forwards reads/writes to PulseCoreMemory
//      • computes memory artery metrics (throughput, pressure, cost, budget)
//      • exposes window‑safe memory snapshots
//
//  STORAGE TRUTH:
//    • All real storage lives in PulseCoreMemory.
//    • All caching, speed, and power optimizations are handled by PulseCoreMemory
//      and lower layers — organism‑wide, not per‑organ.
// ============================================================================

import { PulseCoreMemory } from "./pulseCoreMemory.js";

// ---------------------------------------------------------
//  META BLOCK — v11.3‑EVO
// ---------------------------------------------------------
export const MemoryMeta = Object.freeze({
  layer: "OrganismMemory",
  role: "MEMORY_LAYER",
  version: "11.3-EVO",
  identity: "aiMemory-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    memoryAware: true,
    packetAware: true,
    windowAware: true,
    bluetoothReady: true,
    multiInstanceReady: true,
    readOnly: false,
    microPipeline: true,     // ⭐ NEW
    speedOptimized: true,    // ⭐ NEW
    prewarmAware: true,      // ⭐ NEW
    arteryAware: true,       // ⭐ NEW
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic memory access over PulseCoreMemory with artery metrics for throughput, pressure, cost, and budget.",

    never: Object.freeze([
      "store non-binary data",
      "interpret symbolic state",
      "mutate external organs directly",
      "introduce randomness",
      "maintain its own storage backend",
      "bypass PulseCoreMemory"
    ]),

    always: Object.freeze([
      "validate binary inputs",
      "use PulseCoreMemory as the single source of truth",
      "compute memory artery metrics deterministically",
      "remain pure and minimal",
      "treat all memory segments as read-only data from this organ’s perspective"
    ])
  })
});

// ---------------------------------------------------------
//  PACKET EMITTER — deterministic, memory-scoped
// ---------------------------------------------------------
function emitMemoryPacket(type, payload) {
  return Object.freeze({
    meta: MemoryMeta,
    packetType: `memory-${type}`,
    timestamp: Date.now(),
    epoch: MemoryMeta.evo.epoch,
    ...payload
  });
}

// ---------------------------------------------------------
//  PREWARM — v11.3‑EVO
// ---------------------------------------------------------
export function prewarmAIMemory({ trace = false } = {}) {
  const packet = emitMemoryPacket("prewarm", {
    message: "Memory adapter prewarmed and artery metrics aligned."
  });

  if (trace) console.log("[AIMemory] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO (PulseCoreMemory‑only)
// ============================================================================
export class AIMemory {
  constructor(config = {}) {
    this.id = config.id || MemoryMeta.identity;

    this.core = config.core || PulseCoreMemory;
    this.trace = !!config.trace;

    this.maxBits = config.maxBits || 4096;

    if (
      !this.core ||
      typeof this.core.writeBinary !== "function" ||
      typeof this.core.readBinary !== "function"
    ) {
      throw new Error(
        "AIMemory requires PulseCoreMemory with writeBinary(key, value) and readBinary(key)"
      );
    }
  }

  // --------------------------------------------------------------------------
  //  ARTERY METRICS — computed from PulseCoreMemory metadata
  // --------------------------------------------------------------------------
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
    const meta = this.core.getBinaryMeta
      ? this.core.getBinaryMeta()
      : { segmentCount: 0, totalBits: 0, avgSize: 0 };

    const segmentCount = meta.segmentCount || 0;
    const totalBits = meta.totalBits || 0;
    const avgSize = meta.avgSize || 0;

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

  // --------------------------------------------------------------------------
  //  WRITE — forwards directly to PulseCoreMemory
  // --------------------------------------------------------------------------
  write(keyBin, valueBin) {
    this._assertBinary(keyBin);
    this._assertBinary(valueBin);

    let toStore = valueBin;
    if (toStore.length > this.maxBits) {
      this._trace("write:truncated", { keyBin, originalBits: toStore.length });
      toStore = toStore.slice(-this.maxBits);
    }

    this.core.writeBinary(keyBin, toStore);

    const artery = this._computeMemoryArtery();
    this._trace("write", { keyBin, valueBits: toStore.length, artery });

    return emitMemoryPacket("write", {
      keyBits: keyBin.length,
      valueBits: toStore.length,
      artery
    });
  }

  // --------------------------------------------------------------------------
  //  READ — forwards directly to PulseCoreMemory
  // --------------------------------------------------------------------------
  read(keyBin) {
    this._assertBinary(keyBin);

    const value = this.core.readBinary(keyBin);
    const artery = this._computeMemoryArtery();

    this._trace("read", { keyBin, valueBits: value ? value.length : 0, artery });

    return value;
  }

  // --------------------------------------------------------------------------
  //  DELETE — forwards directly to PulseCoreMemory
  // --------------------------------------------------------------------------
  delete(keyBin) {
    this._assertBinary(keyBin);

    const existed = this.core.deleteBinary
      ? this.core.deleteBinary(keyBin)
      : false;

    const artery = this._computeMemoryArtery();
    this._trace("delete", { keyBin, existed, artery });

    return emitMemoryPacket("delete", {
      keyBits: keyBin.length,
      existed,
      artery
    });
  }

  // --------------------------------------------------------------------------
  //  LIST KEYS — delegated to PulseCoreMemory
  // --------------------------------------------------------------------------
  listKeys() {
    const keys = this.core.listBinaryKeys
      ? this.core.listBinaryKeys()
      : [];

    const artery = this._computeMemoryArtery();
    this._trace("listKeys", { keyCount: keys.length, artery });

    return keys;
  }

  // --------------------------------------------------------------------------
  //  SNAPSHOT — window‑safe binary snapshot of memory state
  // --------------------------------------------------------------------------
  snapshot() {
    let out = "";

    if (this.core.snapshotBinary) {
      out = this.core.snapshotBinary(this.maxBits);
    } else {
      const keys = this.listKeys().slice().sort();
      for (const key of keys) {
        const val = this.core.readBinary(key) || "";
        out += key + val;
      }
    }

    if (out.length > this.maxBits) {
      this._trace("snapshot:truncated", { originalBits: out.length });
      out = out.slice(-this.maxBits);
    }

    const artery = this._computeMemoryArtery();
    this._trace("snapshot", { bits: out.length, artery });

    return out;
  }

  // --------------------------------------------------------------------------
  //  VALIDATION + TRACE
  // --------------------------------------------------------------------------
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

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIMemory(config) {
  return new AIMemory(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    AIMemory,
    createAIMemory,
    MemoryMeta,
    prewarmAIMemory
  };
}
