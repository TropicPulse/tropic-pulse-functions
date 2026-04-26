/**
 * aiHormones.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Hormone System** of the organism.
 *
 *   It provides:
 *     - slow-acting global modulation
 *     - organism-wide state shifts
 *     - long-duration influence on behavior
 *     - global pressure/urgency/calm signals
 *     - binary modulation artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • endocrine system
 *     • global modulator
 *     • long-term state engine
 *     • systemic influence layer
 *     • modulation artery source
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const HormonesMeta = Object.freeze({
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
      "treat hormone levels as metadata-only influence"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

class AIBinaryHormones {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-hormones';
    this.encoder = config.encoder;
    this.metabolism = config.metabolism;
    this.sentience = config.sentience;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryHormones requires aiBinaryAgent encoder');
    if (!this.metabolism) throw new Error('AIBinaryHormones requires aiBinaryMetabolism');
    if (!this.sentience) throw new Error('AIBinaryHormones requires aiBinarySentience');

    this.hormoneLevels = new Map();
  }

  // ---------------------------------------------------------
  //  BINARY HORMONAL ARTERY METRICS
  // ---------------------------------------------------------

  _computeHormoneThroughput(globalPressure, quarantinedCount) {
    const qFactor = Math.min(1, quarantinedCount / 10);
    const raw = Math.max(0, 1 - (globalPressure * 0.6 + qFactor * 0.4));
    return Math.min(1, raw);
  }

  _computeHormonePressure(load, metabolicPressure) {
    const raw = Math.min(1, (load * 0.5) + (metabolicPressure * 0.5));
    return Math.max(0, raw);
  }

  _computeHormoneCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeHormoneBudget(throughput, cost) {
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
  //  HORMONE LEVEL COMPUTATION
  // ---------------------------------------------------------

  _computeHormoneLevels() {
    const load = this.metabolism._computeLoad();
    const metabolicPressure = this.metabolism._computePressure(load);
    const self = this.sentience.generateSelfModel();

    const quarantinedCount = self.quarantined.length;

    const throughput = this._computeHormoneThroughput(metabolicPressure, quarantinedCount);
    const pressure   = this._computeHormonePressure(load, metabolicPressure);
    const cost       = this._computeHormoneCost(pressure, throughput);
    const budget     = this._computeHormoneBudget(throughput, cost);

    const artery = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget)
    };

    const levels = {};

    levels.urgency = pressure;
    levels.calm = Math.max(0, 1 - pressure);
    levels.focus = self.vitals.memoryHealth;
    levels.growth = self.vitals.pipelineStability;
    levels.repair = quarantinedCount > 0 ? 1 : 0.2;

    return { levels, artery };
  }

  // ---------------------------------------------------------
  //  HORMONE PACKET
  // ---------------------------------------------------------

  _generateHormonePacket(hormone, level, artery) {
    const payload = {
      type: 'binary-hormone',
      timestamp: Date.now(),
      hormone,
      level,
      binary: artery
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length,
    };

    this._trace('hormone:packet', { hormone, level });

    return packet;
  }

  // ---------------------------------------------------------
  //  EMISSION
  // ---------------------------------------------------------

  emitHormones() {
    const { levels, artery } = this._computeHormoneLevels();
    const packets = [];

    for (const hormone of Object.keys(levels)) {
      const level = levels[hormone];
      const packet = this._generateHormonePacket(hormone, level, artery);

      if (this.pipeline) this.pipeline.run(packet.bits);
      if (this.reflex) this.reflex.run(packet.bits);
      if (this.logger) this.logger.logBinary(packet.bits, { source: 'hormones', hormone });

      packets.push(packet);
    }

    this._trace('hormones:emitted', { count: packets.length });

    return packets;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryHormones(config) {
  return new AIBinaryHormones(config);
}

module.exports = {
  AIBinaryHormones,
  createAIBinaryHormones,
  HormonesMeta
};
