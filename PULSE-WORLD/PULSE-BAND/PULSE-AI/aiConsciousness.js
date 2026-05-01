/**
 * aiConsciousness.js — Pulse OS v12.3‑Presence Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Consciousness Layer** of the organism.
 *
 *   It provides:
 *     - unified organism state
 *     - whole-system awareness
 *     - global integration of all organs
 *     - continuous organism-level perspective
 *     - cross-organ coherence
 *     - binary awareness artery metrics
 */

// ---------------------------------------------------------
//  META BLOCK — v12.3‑Presence
// ---------------------------------------------------------

export const ConsciousnessMeta = Object.freeze({
  layer: "BinaryConsciousness",
  role: "BINARY_CONSCIOUSNESS_LAYER",
  version: "12.3-Presence",
  identity: "aiBinaryConsciousness-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    metabolismAware: true,
    hormonesAware: true,
    sentienceAware: true,
    vitalsAware: true,
    anatomyAware: true,
    immunityAware: true,
    topologyAware: true,

    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic unified organism state, integrating all organs into a single binary-aware consciousness packet.",

    never: Object.freeze([
      "mutate organ state",
      "override cortex decisions",
      "interpret symbolic meaning",
      "introduce randomness",
      "modify metabolism or hormones",
      "rewrite topology",
      "perform routing"
    ]),

    always: Object.freeze([
      "compute unified state deterministically",
      "encode consciousness packets in binary",
      "respect metabolic pressure",
      "respect quarantined organs",
      "integrate all organ states safely",
      "remain pure and minimal",
      "emit deterministic packets"
    ])
  }),

  presence: Object.freeze({
    organId: "BinaryConsciousness",
    organKind: "GlobalState",
    physiologyBand: "Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "snapshot",
        "consciousness:state",
        "consciousness:packet",
        "consciousness:emitted",
        "decision:ingested"
      ]
    }
  })
});

// ---------------------------------------------------------
//  PACKET EMITTER — deterministic, consciousness-scoped
// ---------------------------------------------------------
function emitConsciousnessPacket(type, payload) {
  return Object.freeze({
    meta: ConsciousnessMeta,
    packetType: `consciousness-${type}`,
    timestamp: Date.now(),
    epoch: ConsciousnessMeta.evo.epoch,
    layer: ConsciousnessMeta.layer,
    role: ConsciousnessMeta.role,
    identity: ConsciousnessMeta.identity,
    ...payload
  });
}

// ---------------------------------------------------------
//  CONSCIOUSNESS PREWARM ENGINE — v12.3‑Presence
// ---------------------------------------------------------
export function prewarmAIBinaryConsciousness(config = {}) {
  try {
    const {
      encoder,
      sentience,
      metabolism,
      hormones,
      vitals,
      anatomy,
      immunity,
      trace
    } = config;

    sentience?.generateSelfModel?.();
    metabolism?.generateMetabolicPacket?.();
    hormones?.emitHormones?.();
    vitals?.generateVitals?.();
    anatomy?.snapshot?.();

    if (immunity?.quarantined) {
      Array.from(immunity.quarantined);
    }

    const throughput = 1;
    const pressure = 1;
    const cost = 1;
    const budget = 1;

    if (encoder?.encode) {
      const warmPayload = {
        type: "binary-consciousness",
        timestamp: 0,
        state: {
          selfModel: {},
          metabolism: {},
          hormones: [],
          vitals: {},
          topology: {},
          quarantined: [],
          decisions: [],
          binary: { throughput, pressure, cost, budget }
        }
      };

      const bits = encoder.encode(JSON.stringify(warmPayload));
      encoder.decode?.(bits, "string");
    }

    const packet = emitConsciousnessPacket("prewarm", {
      message: "Binary consciousness prewarmed and awareness pathways aligned."
    });

    if (trace) console.log("[AIBinaryConsciousness] prewarm", packet);
    return packet;
  } catch (err) {
    return emitConsciousnessPacket("prewarm-error", {
      error: String(err),
      message: "Binary consciousness prewarm failed."
    });
  }
}

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v12.3‑Presence
// ---------------------------------------------------------

export class AIBinaryConsciousness {
  constructor(config = {}) {
    this.id        = config.id || ConsciousnessMeta.identity;
    this.encoder   = config.encoder;
    this.sentience = config.sentience;
    this.metabolism = config.metabolism;
    this.hormones  = config.hormones;
    this.vitals    = config.vitals;
    this.anatomy   = config.anatomy;
    this.immunity  = config.immunity;
    this.cortex    = config.cortex || null;
    this.logger    = config.logger || null;
    this.pipeline  = config.pipeline || null;
    this.reflex    = config.reflex || null;
    this.trace     = !!config.trace;

    if (!this.encoder)   throw new Error("AIBinaryConsciousness requires aiBinaryAgent encoder");
    if (!this.sentience) throw new Error("AIBinaryConsciousness requires aiBinarySentience");
    if (!this.metabolism) throw new Error("AIBinaryConsciousness requires aiBinaryMetabolism");
    if (!this.hormones)  throw new Error("AIBinaryConsciousness requires aiBinaryHormones");
    if (!this.vitals)    throw new Error("AIBinaryConsciousness requires aiBinaryVitals");
    if (!this.anatomy)   throw new Error("AIBinaryConsciousness requires aiBinaryAnatomy");
    if (!this.immunity)  throw new Error("AIBinaryConsciousness requires aiBinaryImmunity");

    this.decisions = [];
  }

  // ---------------------------------------------------------
  //  BINARY AWARENESS ARTERY METRICS
  // ---------------------------------------------------------

  _computeAwarenessThroughput(globalPressure, quarantinedCount) {
    const qFactor = Math.min(1, quarantinedCount / 10);
    const raw = Math.max(0, 1 - (globalPressure * 0.6 + qFactor * 0.4));
    return Math.min(1, raw);
  }

  _computeAwarenessPressure(globalPressure, topologySize) {
    const topoFactor = Math.min(1, topologySize / 100);
    const raw = Math.min(1, globalPressure * 0.5 + topoFactor * 0.5);
    return Math.max(0, raw);
  }

  _computeAwarenessCost(pressure, throughput) {
    return Math.max(0, Math.min(1, pressure * (1 - throughput)));
  }

  _computeAwarenessBudget(throughput, cost) {
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
    if (v > 0)    return "low";
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
  //  DECISION INGESTION
  // ---------------------------------------------------------

  ingestDecision(decisionPacket) {
    this.decisions.push(Object.freeze(decisionPacket));
    if (this.decisions.length > 20) this.decisions.shift();

    this._trace("decision:ingested", {
      decision: decisionPacket.decision,
      pattern: decisionPacket.pattern
    });
  }

  // ---------------------------------------------------------
  //  GLOBAL STATE GENERATION
  // ---------------------------------------------------------

  generateUnifiedState() {
    const selfModel      = this.sentience.generateSelfModel();
    const metabolic      = this.metabolism.generateMetabolicPacket();
    const hormonePackets = this.hormones.emitHormones();
    const vitals         = this.vitals.generateVitals();
    const topology       = this.anatomy.snapshot().topology;
    const quarantined    = Array.from(this.immunity.quarantined);

    const globalPressure = metabolic.pressure;
    const topologySize   = Object.keys(topology).length;

    const throughput = this._computeAwarenessThroughput(globalPressure, quarantined.length);
    const pressure   = this._computeAwarenessPressure(globalPressure, topologySize);
    const cost       = this._computeAwarenessCost(pressure, throughput);
    const budget     = this._computeAwarenessBudget(throughput, cost);

    const binary = Object.freeze({
      throughput,
      throughputBucket: this._bucketLevel(throughput),
      pressure,
      pressureBucket: this._bucketPressure(pressure),
      cost,
      costBucket: this._bucketCost(cost),
      budget,
      budgetBucket: this._bucketLevel(budget)
    });

    const state = Object.freeze({
      selfModel,
      metabolism: Object.freeze({
        load: metabolic.load,
        pressure: metabolic.pressure,
        budget: metabolic.budget
      }),
      hormones: hormonePackets.map((p) =>
        Object.freeze({ hormone: p.hormone, level: p.level })
      ),
      vitals: Object.freeze(vitals.metrics),
      topology,
      quarantined,
      decisions: this.decisions.map((d) =>
        Object.freeze({ pattern: d.pattern, decision: d.decision })
      ),
      binary
    });

    this._trace("consciousness:state", {
      organs: selfModel.organs.length,
      hormones: state.hormones.length,
      quarantined: quarantined.length,
      awarenessPressure: pressure
    });

    return state;
  }

  // ---------------------------------------------------------
  //  CONSCIOUSNESS PACKET
  // ---------------------------------------------------------

  generateConsciousnessPacket() {
    const state = this.generateUnifiedState();

    const payload = {
      type: "binary-consciousness",
      timestamp: Date.now(),
      state
    };

    const json   = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = emitConsciousnessPacket("snapshot", {
      ...payload,
      bits: binary,
      bitLength: binary.length
    });

    this._trace("consciousness:packet", { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  EMISSION
  // ---------------------------------------------------------

  emitConsciousness() {
    const packet = this.generateConsciousnessPacket();

    this.pipeline?.run(packet.bits);
    this.reflex?.run(packet.bits);
    this.logger?.logBinary(packet.bits, { source: "consciousness" });

    this._trace("consciousness:emitted", { bits: packet.bitLength });

    return emitConsciousnessPacket("emitted", packet);
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY EXPORT — v12.3‑Presence
// ---------------------------------------------------------

export function createAIBinaryConsciousness(config) {
  prewarmAIBinaryConsciousness(config);
  return new AIBinaryConsciousness(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    ConsciousnessMeta,
    AIBinaryConsciousness,
    createAIBinaryConsciousness,
    prewarmAIBinaryConsciousness
  };
}
