// ============================================================================
//  aiMetabolism.js — Pulse OS v11.3‑EVO Organ
//  Binary Metabolism Engine • BinaryCore • Deterministic • Metabolic Artery Metrics
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
//
//    It is the organism’s:
//      • energy system
//      • load balancer
//      • resource allocator
//      • metabolic regulator
//      • binary energy artery source
// ============================================================================

// ---------------------------------------------------------
//  META BLOCK — v11.3‑EVO
// ---------------------------------------------------------
export const MetabolismMeta = Object.freeze({
  layer: "BinaryCore",
  role: "BINARY_METABOLISM_ENGINE",
  version: "11.3-EVO",
  identity: "aiBinaryMetabolism-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    pipelineAware: true,
    schedulerAware: true,
    vitalsAware: true,
    energyAware: true,

    dualband: true,        // ⭐ NEW
    packetAware: true,     // ⭐ NEW
    windowAware: true,     // ⭐ NEW (safe metabolic snapshots)
    bluetoothReady: true,  // ⭐ placeholder for future metabolic channels
    arteryAware: true,     // ⭐ NEW

    multiInstanceReady: true,
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Measure load, compute metabolic metrics, and emit binary metabolic packets to maintain internal balance.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "interpret symbolic state",
      "override pipeline behavior",
      "override scheduler behavior"
    ]),

    always: Object.freeze([
      "compute load deterministically",
      "emit binary metabolic packets",
      "track load history",
      "maintain metabolic artery metrics",
      "remain pure and minimal",
      "treat all inputs as read-only"
    ])
  })
});

// ---------------------------------------------------------
//  PREWARM — v11.3‑EVO
// ---------------------------------------------------------
export function prewarmAIBinaryMetabolism({ trace = false } = {}) {
  const packet = Object.freeze({
    type: "binary-metabolism-prewarm",
    meta: MetabolismMeta,
    epoch: MetabolismMeta.evo.epoch,
    message: "Metabolism engine prewarmed and artery metrics aligned."
  });

  if (trace) console.log("[AIBinaryMetabolism] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
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

    this.loadHistory = [];
    this.pressure = 0;
    this.budget = 1;

    // Window‑safe metabolic artery snapshot
    this.metabolicArtery = {
      throughput: 0,
      pressure: 0,
      cost: 0,
      budget: 1,
      snapshot: () =>
        Object.freeze({
          throughput: this.metabolicArtery.throughput,
          pressure: this.metabolicArtery.pressure,
          cost: this.metabolicArtery.cost,
          budget: this.metabolicArtery.budget
        })
    };
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
  //  METABOLIC PACKET
  // ---------------------------------------------------------
  generateMetabolicPacket() {
    const load = this._computeLoad();
    const avgSize = this.loadHistory.length
      ? this.loadHistory.reduce((a, b) => a + b, 0) / this.loadHistory.length
      : 0;

    const pressure = this._computeEnergyPressure(load, avgSize);
    const throughput = this._computeEnergyThroughput(load);
    const cost = this._computeEnergyCost(pressure, throughput);
    const budget = this._computeEnergyBudget(throughput, cost);

    const binary = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget)
    };

    const payload = {
      type: "binary-metabolism",
      timestamp: Date.now(),
      load,
      pressure,
      budget,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    // Update artery snapshot
    this.metabolicArtery.throughput = throughput;
    this.metabolicArtery.pressure = pressure;
    this.metabolicArtery.cost = cost;
    this.metabolicArtery.budget = budget;

    this._trace("metabolism:packet", { bits: packet.bitLength, binary });

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
    console.log(`[${this.id}] ${event}`, payload);
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
    prewarmAIBinaryMetabolism
  };
}
