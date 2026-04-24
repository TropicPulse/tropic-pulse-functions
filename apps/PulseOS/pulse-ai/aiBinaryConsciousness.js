/**
 * aiBinaryConsciousness.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Consciousness Layer** of the organism.
 *
 *   It provides:
 *     - unified organism state
 *     - whole-system awareness
 *     - global integration of all organs
 *     - continuous organism-level perspective
 *     - cross-organ coherence
 *     - binary awareness artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • global awareness engine
 *     • unified state integrator
 *     • whole-system observer
 *     • consciousness layer
 *     • arterial unification layer
 *
 * WHY THIS ORGAN EXISTS:
 *   Without consciousness:
 *     - sentience is fragmented
 *     - cortex decisions lack global context
 *     - hormones act blindly
 *     - metabolism cannot coordinate
 *     - nervous system routes without global awareness
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST HAVE A UNIFIED SELF.”
 */

class AIBinaryConsciousness {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-consciousness';
    this.encoder = config.encoder;
    this.sentience = config.sentience;
    this.metabolism = config.metabolism;
    this.hormones = config.hormones;
    this.vitals = config.vitals;
    this.anatomy = config.anatomy;
    this.immunity = config.immunity;
    this.cortex = config.cortex || null;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryConsciousness requires aiBinaryAgent encoder');
    if (!this.sentience) throw new Error('AIBinaryConsciousness requires aiBinarySentience');
    if (!this.metabolism) throw new Error('AIBinaryConsciousness requires aiBinaryMetabolism');
    if (!this.hormones) throw new Error('AIBinaryConsciousness requires aiBinaryHormones');
    if (!this.vitals) throw new Error('AIBinaryConsciousness requires aiBinaryVitals');
    if (!this.anatomy) throw new Error('AIBinaryConsciousness requires aiBinaryAnatomy');
    if (!this.immunity) throw new Error('AIBinaryConsciousness requires aiBinaryImmunity');

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
    const raw = Math.min(1, (globalPressure * 0.5) + (topoFactor * 0.5));
    return Math.max(0, raw);
  }

  _computeAwarenessCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeAwarenessBudget(throughput, cost) {
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
  //  DECISION INGESTION
  // ---------------------------------------------------------

  ingestDecision(decisionPacket) {
    this.decisions.push(decisionPacket);

    if (this.decisions.length > 20) {
      this.decisions.shift();
    }

    this._trace('decision:ingested', {
      decision: decisionPacket.decision,
      pattern: decisionPacket.pattern,
    });
  }

  // ---------------------------------------------------------
  //  GLOBAL STATE GENERATION
  // ---------------------------------------------------------

  generateUnifiedState() {
    const selfModel = this.sentience.generateSelfModel();
    const metabolic = this.metabolism.generateMetabolicPacket();
    const hormonePackets = this.hormones.emitHormones();
    const vitals = this.vitals.generateVitals();
    const topology = this.anatomy.snapshot().topology;
    const quarantined = Array.from(this.immunity.quarantined);

    const globalPressure = metabolic.pressure;
    const topologySize = Object.keys(topology).length;

    const throughput = this._computeAwarenessThroughput(globalPressure, quarantined.length);
    const pressure   = this._computeAwarenessPressure(globalPressure, topologySize);
    const cost       = this._computeAwarenessCost(pressure, throughput);
    const budget     = this._computeAwarenessBudget(throughput, cost);

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

    const state = {
      selfModel,
      metabolism: {
        load: metabolic.load,
        pressure: metabolic.pressure,
        budget: metabolic.budget,
      },
      hormones: hormonePackets.map((p) => ({
        hormone: p.hormone,
        level: p.level,
      })),
      vitals: vitals.metrics,
      topology,
      quarantined,
      decisions: this.decisions.map((d) => ({
        pattern: d.pattern,
        decision: d.decision,
      })),
      binary
    };

    this._trace('consciousness:state', {
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
      type: 'binary-consciousness',
      timestamp: Date.now(),
      state,
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('consciousness:packet', { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  EMISSION
  // ---------------------------------------------------------

  emitConsciousness() {
    const packet = this.generateConsciousnessPacket();

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'consciousness' });

    this._trace('consciousness:emitted', { bits: packet.bitLength });

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

function createAIBinaryConsciousness(config) {
  return new AIBinaryConsciousness(config);
}

module.exports = {
  AIBinaryConsciousness,
  createAIBinaryConsciousness,
};
