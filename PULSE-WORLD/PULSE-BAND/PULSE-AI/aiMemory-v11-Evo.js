// ============================================================================
//  aiMemory.js — Pulse OS v13.0-Presence-ADV Organ
//  Pure PulseCoreMemory Adapter • Dualband • Binary‑Only • Zero Local Storage
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
//      • exposes artery snapshots to NodeAdmin/Overmind via registry/reporter
//
//  STORAGE TRUTH:
//    • All real storage lives in PulseCoreMemory.
//    • All caching, speed, and power optimizations are handled by PulseCoreMemory
//      and lower layers — organism‑wide, not per‑organ.
// ============================================================================

import { PulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

// ---------------------------------------------------------
//  META BLOCK — v13.0-Presence-ADV
// ---------------------------------------------------------
export const MemoryMeta = Object.freeze({
  layer: "OrganismMemory",
  role: "MEMORY_LAYER",
  version: "13.0-Presence-ADV",
  identity: "aiMemory-v13.0-Presence-ADV",

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
    microPipeline: true,
    speedOptimized: true,
    prewarmAware: true,
    arteryAware: true,
    nodeAdminAware: true,
    cacheAware: true,      // registry-level, not data cache
    epoch: "v13.0-Presence-ADV"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic memory access over PulseCoreMemory with artery metrics for throughput, pressure, cost, and budget, and expose those metrics to NodeAdmin/Overmind via registry/reporter.",

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
//  GLOBAL MEMORY ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ---------------------------------------------------------

const _globalMemoryArteryRegistry = new Map();
/**
 * Registry key: `${id}#${instanceIndex}`
 */
function _registryKey(id, instanceIndex) {
  return `${id || MemoryMeta.identity}#${instanceIndex}`;
}

export function getGlobalMemoryArteries() {
  const out = {};
  for (const [k, v] of _globalMemoryArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

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
//  PREWARM — v13.0‑ADV
// ---------------------------------------------------------
export function prewarmAIMemory({ trace = false } = {}) {
  const packet = emitMemoryPacket("prewarm", {
    message: "Memory adapter prewarmed and artery metrics aligned."
  });

  if (trace) console.log("[AIMemory] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v13.0‑ADV (PulseCoreMemory‑only)
// ============================================================================
export class AIMemory {
  constructor(config = {}) {
    this.id = config.id || MemoryMeta.identity;

    this.core = config.core || PulseCoreMemory;
    this.trace = !!config.trace;

    this.maxBits = config.maxBits || 4096;

    // optional NodeAdmin reporter hook (metrics-only, read-only)
    // fn(artery, meta) => void
    this.nodeAdminReporter =
      typeof config.nodeAdminReporter === "function"
        ? config.nodeAdminReporter
        : null;

    // instance index for registry
    this.instanceIndex = AIMemory._registerInstance();

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
  //  STATIC INSTANCE REGISTRY
  // --------------------------------------------------------------------------
  static _registerInstance() {
    if (typeof AIMemory._instanceCount !== "number") {
      AIMemory._instanceCount = 0;
    }
    const idx = AIMemory._instanceCount;
    AIMemory._instanceCount += 1;
    return idx;
  }

  static getInstanceCount() {
    return typeof AIMemory._instanceCount === "number"
      ? AIMemory._instanceCount
      : 0;
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

    const artery = {
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
      avgSize,

      instanceIndex: this.instanceIndex,
      instanceCount: AIMemory.getInstanceCount(),
      id: this.id,
      timestamp: Date.now()
    };

    // update global registry
    const key = _registryKey(this.id, this.instanceIndex);
    _globalMemoryArteryRegistry.set(key, artery);

    // optional NodeAdmin reporter
    if (this.nodeAdminReporter) {
      try {
        this.nodeAdminReporter(artery, MemoryMeta);
      } catch (err) {
        this._trace("nodeAdmin:reporter:error", { error: String(err) });
      }
    }

    return artery;
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
    console.log(`[${this.id}#${this.instanceIndex}] ${event}`, payload);
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
    prewarmAIMemory,
    getGlobalMemoryArteries
  };
}
