// ============================================================================
//  aiMetabolism.js — Pulse OS v15.0-IMMORTAL Organ
//  Binary Metabolism Engine • BinaryCore • Deterministic • Metabolic Artery v3
// ----------------------------------------------------------------------------
//  CANONICAL ROLE:
//    This organ is the **Binary Metabolism Engine** of the organism.
//
//    It manages:
//      • compute load
//      • resource budgeting
//      • binary flow pressure
//      • organ energy distribution
//      • overload prevention
//      • starvation prevention
//      • binary metabolic artery metrics (throughput, pressure, cost, budget)
//      • multi-instance metabolic harmony + spiral warnings (non-blocking)
//
//    It is the organism’s:
//      • energy system
//      • load balancer
//      • resource allocator
//      • metabolic regulator
//      • binary energy artery source
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiMetabolism",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "ai_metabolic_engine",
  lineage: "aiMetabolism-v11 → v12.3-Presence → v15-IMMORTAL",

  evo: {
    metabolismEngine: true,
    energyModel: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiHeartbeat", "aiNervousSystem", "aiReflex", "aiMetabolicHormones"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

// ---------------------------------------------------------
//  META BLOCK — v15.0-IMMORTAL
// ---------------------------------------------------------
export const MetabolismMeta = Object.freeze({
  layer: "BinaryCore",
  role: "BINARY_METABOLISM_ENGINE",
  version: "15.0-IMMORTAL",
  identity: "aiBinaryMetabolism-v15.0-IMMORTAL",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    pipelineAware: true,
    schedulerAware: true,
    vitalsAware: true,
    energyAware: true,

    dualband: true,
    packetAware: true,
    windowAware: true,      // window-safe metabolic snapshots
    arteryAware: true,      // metabolic artery v3
    spiralAware: true,      // soft spiral warnings, non-blocking

    multiInstanceReady: true,
    epoch: "v15.0-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose:
      "Measure load, compute metabolic metrics, and emit binary metabolic packets to maintain internal balance and expose metabolic artery v3 to the organism.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "interpret symbolic state",
      "override pipeline behavior",
      "override scheduler behavior",
      "block the organism"
    ]),

    always: Object.freeze([
      "compute load deterministically",
      "emit binary metabolic packets",
      "track load history",
      "maintain metabolic artery metrics v3",
      "remain pure and minimal",
      "treat all inputs as read-only"
    ])
  })
});

// ---------------------------------------------------------
//  GLOBAL METABOLIC ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ---------------------------------------------------------
const _globalMetabolicArteryRegistry = new Map();
/**
 * Registry key: `${id}#${instanceIndex}`
 */
function _registryKey(id, instanceIndex) {
  return `${id || MetabolismMeta.identity}#${instanceIndex}`;
}

export function getGlobalMetabolicArteries() {
  const out = {};
  for (const [k, v] of _globalMetabolicArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

// ---------------------------------------------------------
//  PREWARM — v15.0-IMMORTAL
// ---------------------------------------------------------
export function prewarmAIBinaryMetabolism({ trace = false } = {}) {
  const packet = Object.freeze({
    type: "binary-metabolism-prewarm",
    meta: MetabolismMeta,
    epoch: MetabolismMeta.evo.epoch,
    message: "Metabolism engine prewarmed and metabolic artery v3 aligned."
  });

  if (trace) console.log("[AIBinaryMetabolism] prewarm", packet);
  return packet;
}

// ============================================================================
//  ARTERY HELPERS — v3 (PURE, STATELESS)
// ============================================================================
function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v15.0-IMMORTAL
// ============================================================================
export class AIBinaryMetabolism {
  constructor(config = {}) {
    this.id = config.id || MetabolismMeta.identity;
    this.encoder = config.encoder;
    this.pipeline = config.pipeline;
    this.scheduler = config.scheduler || null;
    this.heartbeat = config.heartbeat || null;
    this.vitals = config.vitals || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder) {
      throw new Error("AIBinaryMetabolism requires aiBinaryAgent encoder");
    }
    if (!this.pipeline) {
      throw new Error("AIBinaryMetabolism requires aiBinaryPipeline");
    }

    // load history (bits length samples)
    this.loadHistory = [];
    this.pressure = 0;
    this.budget = 1;

    // multi-instance identity
    this.instanceIndex = AIBinaryMetabolism._registerInstance();

    // Window‑safe metabolic artery snapshot (v3)
    this.metabolicArtery = {
      throughput: 0,
      pressure: 0,
      cost: 0,
      budget: 1,
      load: 0,
      avgSize: 0,
      snapshot: () =>
        Object.freeze({
          throughput: this.metabolicArtery.throughput,
          pressure: this.metabolicArtery.pressure,
          cost: this.metabolicArtery.cost,
          budget: this.metabolicArtery.budget,
          load: this.metabolicArtery.load,
          avgSize: this.metabolicArtery.avgSize,
          instanceIndex: this.instanceIndex,
          instanceCount: AIBinaryMetabolism.getInstanceCount()
        })
    };
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------
  static _registerInstance() {
    if (typeof AIBinaryMetabolism._instanceCount !== "number") {
      AIBinaryMetabolism._instanceCount = 0;
    }
    const index = AIBinaryMetabolism._instanceCount;
    AIBinaryMetabolism._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinaryMetabolism._instanceCount === "number"
      ? AIBinaryMetabolism._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  BINARY METABOLIC ARTERY METRICS
  // ---------------------------------------------------------
  _computeEnergyThroughput(load) {
    const raw = 1 - load;
    return Math.max(0, Math.min(1, raw));
  }

  _computeEnergyPressure(load, avgSize) {
    const sizeFactor = Math.min(1, avgSize / 50000);
    const raw = Math.min(1, load * 0.6 + sizeFactor * 0.4);
    return Math.max(0, raw);
  }

  _computeEnergyCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeEnergyBudget(throughput, cost) {
    const raw = throughput - cost;
    return Math.max(0, Math.min(1, raw));
  }

  _bucketLevel(v) {
    return bucketLevel(v);
  }

  _bucketPressure(v) {
    return bucketPressure(v);
  }

  _bucketCost(v) {
    return bucketCost(v);
  }

  // ---------------------------------------------------------
  //  LOAD MEASUREMENT
  // ---------------------------------------------------------
  recordLoad(bits) {
    const size = bits.length;
    this.loadHistory.push(size);

    if (this.loadHistory.length > 20) {
      this.loadHistory.shift();
    }

    this._trace("load:recorded", { size });
  }

  _computeLoad() {
    if (this.loadHistory.length === 0) return 0;

    const max = Math.max(...this.loadHistory);
    const avg =
      this.loadHistory.reduce((a, b) => a + b, 0) / this.loadHistory.length;

    const load = Math.min(1, avg / (max || 1));

    this._trace("load:computed", { load });

    return load;
  }

  // Public-friendly pressure helper for other organs (e.g. hormones)
  _computePressure(load) {
    const avgSize = this.loadHistory.length
      ? this.loadHistory.reduce((a, b) => a + b, 0) / this.loadHistory.length
      : 0;

    const pressure = this._computeEnergyPressure(load, avgSize);
    this._trace("pressure:computed", { load, avgSize, pressure });
    return pressure;
  }

  // ---------------------------------------------------------
  //  METABOLIC ARTERY v3 — SNAPSHOT + REGISTRY
  // ---------------------------------------------------------
  _computeMetabolicArtery() {
    const load = this._computeLoad();
    const avgSize = this.loadHistory.length
      ? this.loadHistory.reduce((a, b) => a + b, 0) / this.loadHistory.length
      : 0;

    const pressure = this._computeEnergyPressure(load, avgSize);
    const throughput = this._computeEnergyThroughput(load);
    const cost = this._computeEnergyCost(pressure, throughput);
    const budget = this._computeEnergyBudget(throughput, cost);

    const artery = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      load,
      avgSize,

      instanceIndex: this.instanceIndex,
      instanceCount: AIBinaryMetabolism.getInstanceCount(),
      id: this.id,
      timestamp: Date.now()
    };

    // update window-safe snapshot
    this.metabolicArtery.throughput = throughput;
    this.metabolicArtery.pressure = pressure;
    this.metabolicArtery.cost = cost;
    this.metabolicArtery.budget = budget;
    this.metabolicArtery.load = load;
    this.metabolicArtery.avgSize = avgSize;

    // update global registry
    const key = _registryKey(this.id, this.instanceIndex);
    _globalMetabolicArteryRegistry.set(key, artery);

    // soft spiral warning (non-blocking)
    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      this._trace("metabolism:spiral-warning", {
        pressure: artery.pressure,
        pressureBucket: artery.pressureBucket,
        budget: artery.budget,
        budgetBucket: artery.budgetBucket
      });
    }

    return artery;
  }

  getMetabolicArtery() {
    return this._computeMetabolicArtery();
  }

  // ---------------------------------------------------------
  //  METABOLIC PACKET
  // ---------------------------------------------------------
  generateMetabolicPacket() {
    const artery = this._computeMetabolicArtery();

    const payload = {
      type: "binary-metabolism",
      timestamp: artery.timestamp,
      load: artery.load,
      pressure: artery.pressure,
      budget: artery.budget,
      binary: {
        throughput: artery.throughput,
        throughputBucket: artery.throughputBucket,

        pressure: artery.pressure,
        pressureBucket: artery.pressureBucket,

        cost: artery.cost,
        costBucket: artery.costBucket,

        budget: artery.budget,
        budgetBucket: artery.budgetBucket
      },
      instanceIndex: artery.instanceIndex,
      instanceCount: artery.instanceCount,
      id: artery.id
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    this._trace("metabolism:packet", {
      bits: packet.bitLength,
      binary: payload.binary
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  METABOLIC EMISSION
  // ---------------------------------------------------------
  emitMetabolism() {
    const packet = this.generateMetabolicPacket();

    if (this.pipeline && typeof this.pipeline.run === "function") {
      this.pipeline.run(packet.bits);
    }

    // NOTE: scheduler wiring remains binary-only and non-blocking.
    // Existing scheduler implementations may expect different payload shapes;
    // we keep the original pattern to avoid external drift.
    if (this.scheduler && typeof this.scheduler.scheduleTask === "function") {
      this.scheduler.scheduleTask({
        type: "metabolism",
        bits: packet.bits,
        source: this.id
      });
    }

    if (this.logger && typeof this.logger.logBinary === "function") {
      this.logger.logBinary(packet.bits, { source: "metabolism" });
    }

    this._trace("metabolism:emitted", { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(
      `[${this.id}#${this.instanceIndex}] ${event}`,
      payload
    );
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryMetabolism(config) {
  return new AIBinaryMetabolism(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryMetabolism,
    createAIBinaryMetabolism,
    MetabolismMeta,
    prewarmAIBinaryMetabolism,
    getGlobalMetabolicArteries
  };
}
