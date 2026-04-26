/**
 * aiHormones.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Hormone System** of the organism.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

const HormonesMeta = Object.freeze({
  layer: "BinaryModulation",
  role: "BINARY_HORMONE_SYSTEM",
  version: "11.0-EVO",
  identity: "aiBinaryHormones-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    metabolismAware: true,
    sentienceAware: true,
    pipelineAware: true,
    reflexAware: true,
    globalModulation: true,
    packetAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide slow-acting global modulation signals that influence organism-wide behavior and long-term state.",

    never: Object.freeze([
      "mutate external organs",
      "override metabolism or sentience",
      "interpret symbolic meaning",
      "introduce randomness",
      "act as a router or governor"
    ]),

    always: Object.freeze([
      "compute hormone levels deterministically",
      "emit binary hormone packets",
      "use metabolism + sentience as inputs",
      "remain pure and minimal",
      "treat hormone levels as metadata-only influence",
      "emit deterministic hormone snapshots"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v11‑EVO COMPLETE
// ---------------------------------------------------------

class AIBinaryHormones {
  constructor(config = {}) {
    this.id = config.id || HormonesMeta.identity;
    this.encoder = config.encoder;
    this.metabolism = config.metabolism;
    this.sentience = config.sentience;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinaryHormones requires aiBinaryAgent encoder");
    if (!this.metabolism) throw new Error("AIBinaryHormones requires aiBinaryMetabolism");
    if (!this.sentience) throw new Error("AIBinaryHormones requires aiBinarySentience");

    this.hormoneLevels = new Map();
  }

  _computeHormoneThroughput(globalPressure, quarantinedCount) {
    const qFactor = Math.min(1, quarantinedCount / 10);
    return Math.max(0, Math.min(1, 1 - (globalPressure * 0.6 + qFactor * 0.4)));
  }

  _computeHormonePressure(load, metabolicPressure) {
    return Math.max(0, Math.min(1, load * 0.5 + metabolicPressure * 0.5));
  }

  _computeHormoneCost(pressure, throughput) {
    return Math.max(0, Math.min(1, pressure * (1 - throughput)));
  }

  _computeHormoneBudget(throughput, cost) {
    return Math.max(0, Math.min(1, throughput - cost));
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

  _computeHormoneLevels() {
    const load = this.metabolism._computeLoad();
    const metabolicPressure = this.metabolism._computePressure(load);
    const self = this.sentience.generateSelfModel();
    const quarantinedCount = self.quarantined.length;

    const throughput = this._computeHormoneThroughput(metabolicPressure, quarantinedCount);
    const pressure   = this._computeHormonePressure(load, metabolicPressure);
    const cost       = this._computeHormoneCost(pressure, throughput);
    const budget     = this._computeHormoneBudget(throughput, cost);

    const artery = Object.freeze({
      throughput,
      throughputBucket: this._bucketLevel(throughput),
      pressure,
      pressureBucket: this._bucketPressure(pressure),
      cost,
      costBucket: this._bucketCost(cost),
      budget,
      budgetBucket: this._bucketLevel(budget)
    });

    const levels = Object.freeze({
      urgency: pressure,
      calm: Math.max(0, 1 - pressure),
      focus: self.vitals.memoryHealth,
      growth: self.vitals.pipelineStability,
      repair: quarantinedCount > 0 ? 1 : 0.2
    });

    return { levels, artery };
  }

  _generateHormonePacket(hormone, level, artery) {
    const payload = {
      type: "binary-hormone",
      timestamp: Date.now(),
      hormone,
      level,
      binary: artery
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    return Object.freeze({
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    });
  }

  emitHormones() {
    const { levels, artery } = this._computeHormoneLevels();
    const packets = [];

    for (const hormone of Object.keys(levels)) {
      const level = levels[hormone];
      const packet = this._generateHormonePacket(hormone, level, artery);

      this.pipeline?.run(packet.bits);
      this.reflex?.run(packet.bits);
      this.logger?.logBinary(packet.bits, { source: "hormones", hormone });

      packets.push(packet);
    }

    this._trace("hormones:emitted", { count: packets.length });

    return Object.freeze(packets);
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY
// ---------------------------------------------------------

function createAIBinaryHormones(config) {
  return new AIBinaryHormones(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

// ESM
export {
  AIBinaryHormones,
  createAIBinaryHormones,
  HormonesMeta
};

// CommonJS
module.exports = {
  AIBinaryHormones,
  createAIBinaryHormones,
  HormonesMeta
};
