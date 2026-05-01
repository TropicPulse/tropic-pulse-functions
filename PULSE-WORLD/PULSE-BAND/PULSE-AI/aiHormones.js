// ============================================================================
//  aiHormones.js — Pulse OS v12.3‑EVO Organ
//  Binary Hormone System • Global Modulation • Membrane‑Aware • Packet‑Ready
// ============================================================================
//
//  CANONICAL ROLE:
//    • Slow‑acting, global binary modulation for the organism.
//    • Feeds binary hormone packets into pipelines/reflexes/governor membranes.
//    • Never interprets symbols, never routes, never mutates external organs.
//    • Provides cached hormone snapshots for Execution / Evolution / Diagnostics.
// ============================================================================

export const HormonesMeta = Object.freeze({
  layer: "BinaryModulation",
  role: "BINARY_HORMONE_SYSTEM",
  version: "12.3-EVO",
  identity: "aiBinaryHormones-v12.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    dualband: true,
    packetAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    metabolismAware: true,
    sentienceAware: true,
    pipelineAware: true,
    reflexAware: true,
    globalModulation: true,

    driftAware: true,          // drift between hormone states
    hormoneCache: true,        // cached levels + artery
    arteryAware: true,         // throughput/pressure/cost/budget

    membraneAware: true,       // ready to feed GovernorAdapter
    governorAware: true,       // governor‑facing binary modulation
    executionAware: true,      // visible to ExecutionEngine
    diagnosticsAware: true,    // drift can be surfaced by callers

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide slow-acting global modulation signals that influence organism-wide behavior and long-term state.",

    never: Object.freeze([
      "mutate external organs",
      "override metabolism or sentience",
      "interpret symbolic meaning",
      "introduce randomness",
      "act as a router or governor",
      "auto-connect bluetooth"
    ]),

    always: Object.freeze([
      "compute hormone levels deterministically",
      "emit binary hormone packets",
      "use metabolism + sentience as inputs",
      "remain pure and minimal",
      "treat hormone levels as metadata-only influence",
      "emit deterministic hormone snapshots",
      "prepare for future hormone packet channels"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, hormone-scoped
// ============================================================================
function emitHormonePacket(type, payload) {
  return Object.freeze({
    meta: HormonesMeta,
    packetType: `hormone-${type}`,
    timestamp: Date.now(),
    epoch: HormonesMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms metabolism + sentience + artery metrics + cache
//  (uses a local warm instance so the real organ stays pure)
// ============================================================================
export function prewarmBinaryHormones(dualBand = null, { trace = false } = {}) {
  try {
    const warmVitals = {
      pressure: dualBand?.binary?.metabolic?.pressure ?? 0.1,
      load:     dualBand?.binary?.metabolic?.load     ?? 0.1
    };

    // Minimal warm metabolism/sentience for prewarm path
    const warmMetabolism = {
      _computeLoad:     () => warmVitals.load,
      _computePressure: () => warmVitals.pressure
    };

    const warmSentience = {
      generateSelfModel: () => ({
        quarantined: [],
        vitals: {
          memoryHealth: 1,
          pipelineStability: 1
        }
      })
    };

    const warm = new AIBinaryHormones({
      encoder:   { encode: (s) => s }, // no-op encoder for warm path
      metabolism: warmMetabolism,
      sentience:  warmSentience,
      logger: null,
      pipeline: null,
      reflex: null,
      bluetooth: null,
      trace
    });

    const warmPacket = warm.emitHormones();

    const packet = emitHormonePacket("prewarm", {
      message: "Binary hormone system prewarmed and modulation metrics aligned.",
      warmVitals,
      warmPacketSummary: {
        levels: warmPacket.levels,
        artery: warmPacket.artery
      }
    });

    if (trace) console.log("[aiBinaryHormones] prewarm", packet);
    return packet;
  } catch (err) {
    return emitHormonePacket("prewarm-error", {
      error: String(err),
      message: "Hormone prewarm failed."
    });
  }
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO
// ============================================================================
export class AIBinaryHormones {
  constructor(config = {}) {
    this.id = config.id || HormonesMeta.identity;

    this.encoder    = config.encoder;
    this.metabolism = config.metabolism;
    this.sentience  = config.sentience;

    this.logger   = config.logger   || null;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;

    this.bluetooth = config.bluetooth || null;
    this.trace     = !!config.trace;

    if (!this.encoder)    throw new Error("AIBinaryHormones requires aiBinaryAgent encoder");
    if (!this.metabolism) throw new Error("AIBinaryHormones requires aiBinaryMetabolism");
    if (!this.sentience)  throw new Error("AIBinaryHormones requires aiBinarySentience");

    // Hormone cache for stable states (levels + artery)
    this._cache = {
      levels: null,
      artery: null
    };
  }

  // ---------------------------------------------------------------------------
  //  ARTERY METRICS — deterministic, drift-proof
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  //  BUCKETS — stable categorical mapping
  // ---------------------------------------------------------------------------
  _bucketLevel(v) {
    if (v >= 0.9)  return "elite";
    if (v >= 0.75) return "high";
    if (v >= 0.5)  return "medium";
    if (v >= 0.25) return "low";
    return "critical";
  }

  _bucketPressure(v) {
    if (v >= 0.9)  return "overload";
    if (v >= 0.7)  return "high";
    if (v >= 0.4)  return "medium";
    if (v > 0)     return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8)  return "heavy";
    if (v >= 0.5)  return "moderate";
    if (v >= 0.2)  return "light";
    if (v > 0)     return "negligible";
    return "none";
  }

  // ---------------------------------------------------------------------------
  //  HORMONE LEVEL COMPUTATION — pure binary modulation
  // ---------------------------------------------------------------------------
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
      calm:   Math.max(0, 1 - pressure),
      focus:  self.vitals.memoryHealth,
      growth: self.vitals.pipelineStability,
      repair: quarantinedCount > 0 ? 1 : 0.2
    });

    return { levels, artery };
  }

  // ---------------------------------------------------------------------------
  //  PACKET GENERATION — binary-only, packet-aware
  // ---------------------------------------------------------------------------
  _generateHormonePacket(hormone, level, artery) {
    const payload = {
      type: "binary-hormone",
      timestamp: Date.now(),
      hormone,
      level,
      artery,
      bluetooth: {
        ready: !!this.bluetooth,
        channel: null
      }
    };

    const json    = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    return Object.freeze({
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    });
  }

  // ---------------------------------------------------------------------------
  //  SNAPSHOT — organism/window-safe hormone snapshot
  //  (used by ExecutionEngine / Evolution / Diagnostics)
// ---------------------------------------------------------------------------
  getSnapshot() {
    if (!this._cache.levels || !this._cache.artery) {
      const { levels, artery } = this._computeHormoneLevels();
      this._cache.levels = levels;
      this._cache.artery = artery;
    }

    return Object.freeze({
      levels: this._cache.levels,
      artery: this._cache.artery
    });
  }

  // ---------------------------------------------------------------------------
  //  EMIT — global modulation packets (v12.3‑EVO)
// ---------------------------------------------------------------------------
  emitHormones() {
    const { levels, artery } = this._computeHormoneLevels();

    // Fast path: no drift → reuse cached state
    if (this._cache.levels && JSON.stringify(this._cache.levels) === JSON.stringify(levels)) {
      return emitHormonePacket("fast", {
        levels,
        artery,
        message: "Hormone levels unchanged (fast path)."
      });
    }

    // Deep path: drift detected → emit packets
    const packets = [];

    for (const hormone of Object.keys(levels)) {
      const level  = levels[hormone];
      const packet = this._generateHormonePacket(hormone, level, artery);

      this.pipeline?.run(packet.bits);
      this.reflex?.run(packet.bits);
      this.logger?.logBinary(packet.bits, { source: "hormones", hormone });

      packets.push(packet);
    }

    this._cache.levels = levels;
    this._cache.artery = artery;

    return emitHormonePacket("emit", {
      count: packets.length,
      levels,
      artery,
      packets,
      membraneSnapshot: {
        id: this.id,
        artery
      }
    });
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryHormones(config) {
  return new AIBinaryHormones(config);
}

if (typeof module !== "undefined") {
  module.exports = {
    HormonesMeta,
    AIBinaryHormones,
    createAIBinaryHormones,
    prewarmBinaryHormones
  };
}
