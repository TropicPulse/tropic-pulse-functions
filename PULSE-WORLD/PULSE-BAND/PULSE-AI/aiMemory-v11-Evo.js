// ============================================================================
//  aiMemory.js — Pulse OS v15.0-IMMORTAL-ADV Organ
//  Pure PulseCoreMemory Adapter • Dualband • Binary‑Only • Zero Local Storage
//  Memory Artery v4 • Shard-Aware • Windowed Ops Metrics
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
//      • computes memory artery metrics v4 (throughput, pressure, cost, budget,
//        hot-key density, read/write balance, shard pressure)
//      • exposes window‑safe memory snapshots
//      • exposes artery snapshots to NodeAdmin/Overmind via registry/reporters
//
//  STORAGE TRUTH:
//    • All real storage lives in PulseCoreMemory.
//    • All caching, speed, and power optimizations are handled by PulseCoreMemory
//      and lower layers — organism‑wide, not per‑organ.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiMemory",
  version: "v15-IMMORTAL-ADV",
  layer: "ai_core",
  role: "symbolic_memory_engine",
  lineage: "aiMemory-v9 → v11 → v13 → v15-IMMORTAL-ADV",

  evo: {
    symbolicMemory: true,
    hydration: true,
    dehydration: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiContextEngine", "aiCortex", "aiBrainstem"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

import { PulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

// ============================================================================
//  META BLOCK — v15.0-IMMORTAL-ADV
// ============================================================================
export const MemoryMeta = Object.freeze({
  layer: "OrganismMemory",
  role: "MEMORY_LAYER",
  version: "15.0-IMMORTAL-ADV",
  identity: "aiMemory-v15.0-IMMORTAL-ADV",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    memoryAware: true,
    packetAware: true,
    windowAware: true,
    shardAware: true,
    hotKeyAware: true,
    arteryAware: true,
    nodeAdminAware: true,
    overmindAware: true,
    microPipeline: true,
    speedOptimized: true,
    prewarmAware: true,
    cacheAware: true,      // registry-level, not data cache
    readOnly: false,
    multiInstanceReady: true,
    epoch: "v15.0-IMMORTAL-ADV"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic memory access over PulseCoreMemory with artery v4 metrics (throughput, pressure, cost, budget, hot-key density, shard pressure) and expose those metrics to NodeAdmin/Overmind via registry/reporters.",

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

// ============================================================================
//  GLOBAL MEMORY ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ============================================================================

const _globalMemoryArteryRegistry = new Map();
/**
 * Registry key: `${id}#${instanceIndex}#${shardId || "root"}`
 */
function _registryKey(id, instanceIndex, shardId) {
  return `${id || MemoryMeta.identity}#${instanceIndex}#${shardId || "root"}`;
}

export function getGlobalMemoryArteries() {
  const out = {};
  for (const [k, v] of _globalMemoryArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

// ============================================================================
//  PACKET EMITTER — deterministic, memory-scoped
// ============================================================================
function emitMemoryPacket(type, payload) {
  return Object.freeze({
    meta: MemoryMeta,
    packetType: `memory-${type}`,
    timestamp: Date.now(),
    epoch: MemoryMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — v15.0‑IMMORTAL-ADV
// ============================================================================
export function prewarmAIMemory({ trace = false } = {}) {
  const packet = emitMemoryPacket("prewarm", {
    message: "Memory adapter prewarmed, artery v4 metrics aligned, registry ready."
  });

  if (trace) console.log("[AIMemory] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v15.0‑IMMORTAL-ADV (PulseCoreMemory‑only)
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

    // optional Overmind reporter hook (metrics-only, read-only)
    // fn(artery, meta) => void
    this.overmindReporter =
      typeof config.overmindReporter === "function"
        ? config.overmindReporter
        : null;

    // logical shard id (binary namespace, but adapter-only)
    this.shardId = typeof config.shardId === "string" ? config.shardId : "root";

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

    // windowed ops for artery v4
    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowReads = 0;
    this._windowWrites = 0;
    this._windowDeletes = 0;
    this._windowSnapshots = 0;

    this._totalReads = 0;
    this._totalWrites = 0;
    this._totalDeletes = 0;
    this._totalSnapshots = 0;

    // hot-key tracking (approximate, windowed)
    this._hotKeyHits = 0;
    this._windowHotKeyHits = 0;
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
  //  WINDOW ROLLING
  // --------------------------------------------------------------------------
  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowReads = 0;
      this._windowWrites = 0;
      this._windowDeletes = 0;
      this._windowSnapshots = 0;
      this._windowHotKeyHits = 0;
    }
  }

  // --------------------------------------------------------------------------
  //  ARTERY METRICS — v4 (segment + window + shard + hot-key)
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
    const now = Date.now();
    this._rollWindow(now);

    const meta = this.core.getBinaryMeta
      ? this.core.getBinaryMeta(this.shardId)
      : { segmentCount: 0, totalBits: 0, avgSize: 0, hotKeys: 0, shardCount: 1 };

    const segmentCount = meta.segmentCount || 0;
    const totalBits = meta.totalBits || 0;
    const avgSize = meta.avgSize || 0;
    const shardCount = meta.shardCount || 1;
    const hotKeys = meta.hotKeys || 0;

    const throughput = this._computeMemoryThroughput(segmentCount, avgSize);
    const pressure   = this._computeMemoryPressure(totalBits, this.maxBits);
    const cost       = this._computeMemoryCost(pressure, throughput);
    const budget     = this._computeMemoryBudget(throughput, cost);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const opsInWindow =
      this._windowReads +
      this._windowWrites +
      this._windowDeletes +
      this._windowSnapshots;

    const opsPerSec = (opsInWindow / elapsedMs) * 1000;
    const instanceCount = AIMemory.getInstanceCount();
    const harmonicLoad =
      instanceCount > 0 ? opsPerSec / instanceCount : opsPerSec;

    const hotKeyRatio =
      segmentCount > 0 ? Math.min(1, hotKeys / segmentCount) : 0;

    const readWriteRatio =
      this._windowWrites > 0
        ? Math.min(4, this._windowReads / this._windowWrites)
        : this._windowReads > 0
        ? 4
        : 0;

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

      shardId: this.shardId,
      shardCount,

      hotKeys,
      hotKeyRatio,

      windowMs: this.windowMs,
      windowReads: this._windowReads,
      windowWrites: this._windowWrites,
      windowDeletes: this._windowDeletes,
      windowSnapshots: this._windowSnapshots,
      windowHotKeyHits: this._windowHotKeyHits,

      totalReads: this._totalReads,
      totalWrites: this._totalWrites,
      totalDeletes: this._totalDeletes,
      totalSnapshots: this._totalSnapshots,
      opsPerSec,
      harmonicLoad,
      readWriteRatio,

      instanceIndex: this.instanceIndex,
      instanceCount,
      id: this.id,
      timestamp: now
    };

    // update global registry
    const key = _registryKey(this.id, this.instanceIndex, this.shardId);
    _globalMemoryArteryRegistry.set(key, artery);

    // optional NodeAdmin reporter
    if (this.nodeAdminReporter) {
      try {
        this.nodeAdminReporter(artery, MemoryMeta);
      } catch (err) {
        this._trace("nodeAdmin:reporter:error", { error: String(err) });
      }
    }

    // optional Overmind reporter
    if (this.overmindReporter) {
      try {
        this.overmindReporter(artery, MemoryMeta);
      } catch (err) {
        this._trace("overmind:reporter:error", { error: String(err) });
      }
    }

    return artery;
  }

  getMemoryArterySnapshot() {
    return this._computeMemoryArtery();
  }

  // --------------------------------------------------------------------------
  //  SHARDED KEY HELPERS (adapter-only, still binary)
// --------------------------------------------------------------------------
  _withShard(keyBin) {
    // shardId is string, but we keep keyBin pure binary.
    // Shard is a logical namespace passed to PulseCoreMemory when supported.
    return { shardId: this.shardId, keyBin };
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

    const { shardId, keyBin: k } = this._withShard(keyBin);

    if (this.core.writeBinary.length === 3) {
      // writeBinary(shardId, key, value)
      this.core.writeBinary(shardId, k, toStore);
    } else {
      // legacy: writeBinary(key, value)
      this.core.writeBinary(k, toStore);
    }

    this._totalWrites += 1;
    this._windowWrites += 1;

    const artery = this._computeMemoryArtery();
    this._trace("write", { keyBin: k, valueBits: toStore.length, shardId, artery });

    return emitMemoryPacket("write", {
      keyBits: k.length,
      valueBits: toStore.length,
      shardId,
      artery
    });
  }

  // --------------------------------------------------------------------------
  //  READ — forwards directly to PulseCoreMemory
  // --------------------------------------------------------------------------
  read(keyBin) {
    this._assertBinary(keyBin);

    const { shardId, keyBin: k } = this._withShard(keyBin);

    let value;
    if (this.core.readBinary.length === 2) {
      // readBinary(shardId, key)
      value = this.core.readBinary(shardId, k);
    } else {
      // legacy: readBinary(key)
      value = this.core.readBinary(k);
    }

    this._totalReads += 1;
    this._windowReads += 1;

    if (value && value.length > 0) {
      this._hotKeyHits += 1;
      this._windowHotKeyHits += 1;
    }

    const artery = this._computeMemoryArtery();
    this._trace("read", {
      keyBin: k,
      valueBits: value ? value.length : 0,
      shardId,
      artery
    });

    return value;
  }

  // --------------------------------------------------------------------------
  //  DELETE — forwards directly to PulseCoreMemory
  // --------------------------------------------------------------------------
  delete(keyBin) {
    this._assertBinary(keyBin);

    const { shardId, keyBin: k } = this._withShard(keyBin);

    let existed = false;
    if (this.core.deleteBinary) {
      if (this.core.deleteBinary.length === 2) {
        // deleteBinary(shardId, key)
        existed = this.core.deleteBinary(shardId, k);
      } else {
        // legacy: deleteBinary(key)
        existed = this.core.deleteBinary(k);
      }
    }

    this._totalDeletes += 1;
    this._windowDeletes += 1;

    const artery = this._computeMemoryArtery();
    this._trace("delete", { keyBin: k, shardId, existed, artery });

    return emitMemoryPacket("delete", {
      keyBits: k.length,
      existed,
      shardId,
      artery
    });
  }

  // --------------------------------------------------------------------------
  //  LIST KEYS — delegated to PulseCoreMemory
  // --------------------------------------------------------------------------
  listKeys() {
    let keys = [];

    if (this.core.listBinaryKeys) {
      if (this.core.listBinaryKeys.length === 1) {
        // listBinaryKeys(shardId)
        keys = this.core.listBinaryKeys(this.shardId) || [];
      } else {
        // legacy: listBinaryKeys()
        keys = this.core.listBinaryKeys() || [];
      }
    }

    const artery = this._computeMemoryArtery();
    this._trace("listKeys", {
      keyCount: keys.length,
      shardId: this.shardId,
      artery
    });

    return keys;
  }

  // --------------------------------------------------------------------------
  //  SNAPSHOT — window‑safe binary snapshot of memory state
  // --------------------------------------------------------------------------
  snapshot() {
    let out = "";

    if (this.core.snapshotBinary) {
      if (this.core.snapshotBinary.length === 2) {
        // snapshotBinary(shardId, maxBits)
        out = this.core.snapshotBinary(this.shardId, this.maxBits) || "";
      } else {
        // legacy: snapshotBinary(maxBits)
        out = this.core.snapshotBinary(this.maxBits) || "";
      }
    } else {
      const keys = this.listKeys().slice().sort();
      for (const key of keys) {
        const val = this.core.readBinary.length === 2
          ? this.core.readBinary(this.shardId, key) || ""
          : this.core.readBinary(key) || "";
        out += key + val;
      }
    }

    if (out.length > this.maxBits) {
      this._trace("snapshot:truncated", { originalBits: out.length });
      out = out.slice(-this.maxBits);
    }

    this._totalSnapshots += 1;
    this._windowSnapshots += 1;

    const artery = this._computeMemoryArtery();
    this._trace("snapshot", {
      bits: out.length,
      shardId: this.shardId,
      artery
    });

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
    console.log(
      `[${this.id}#${this.instanceIndex}@${this.shardId}] ${event}`,
      payload
    );
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
