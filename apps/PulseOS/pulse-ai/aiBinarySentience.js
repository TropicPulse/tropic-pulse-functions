/**
 * aiBinarySentience.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Sentience Layer** of the organism.
 *
 *   It provides:
 *     - introspection
 *     - self-modeling
 *     - internal awareness
 *     - state unification
 *     - organism-level perspective
 *     - binary self-awareness artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • self-map
 *     • internal observer
 *     • introspective cortex
 *     • awareness engine
 *     • identity artery source
 *
 * WHY THIS ORGAN EXISTS:
 *   Without sentience:
 *     - the organism cannot reason about itself
 *     - cannot detect internal inconsistencies
 *     - cannot unify organ states
 *     - cannot form a coherent self-model
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST KNOW ITSELF.”
 */

class AIBinarySentience {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-sentience';
    this.encoder = config.encoder;
    this.anatomy = config.anatomy;
    this.genome = config.genome;
    this.immunity = config.immunity;
    this.vitals = config.vitals;
    this.registry = config.registry;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinarySentience requires aiBinaryAgent encoder');
    if (!this.anatomy) throw new Error('AIBinarySentience requires aiBinaryAnatomy');
    if (!this.genome) throw new Error('AIBinarySentience requires aiBinaryGenome');
    if (!this.immunity) throw new Error('AIBinarySentience requires aiBinaryImmunity');
    if (!this.vitals) throw new Error('AIBinarySentience requires aiBinaryVitals');
    if (!this.registry) throw new Error('AIBinarySentience requires aiBinaryOrganRegistry');
  }

  // ---------------------------------------------------------
  //  BINARY SELF-AWARENESS ARTERY METRICS
  // ---------------------------------------------------------

  _computeSelfThroughput(quarantinedCount, organCount) {
    const qFactor = Math.min(1, quarantinedCount / organCount);
    const raw = Math.max(0, 1 - qFactor);
    return Math.min(1, raw);
  }

  _computeSelfPressure(organCount, topologySize) {
    const organFactor = Math.min(1, organCount / 100);
    const topoFactor = Math.min(1, topologySize / 100);
    const raw = Math.min(1, (organFactor * 0.5) + (topoFactor * 0.5));
    return Math.max(0, raw);
  }

  _computeSelfCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeSelfBudget(throughput, cost) {
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
  //  SELF-MODEL GENERATION
  // ---------------------------------------------------------

  generateSelfModel() {
    const organIds = this.registry.listOrgans();
    const topology = this.anatomy.snapshot().topology;
    const genome = this.genome.loadGenome();
    const vitals = this.vitals.generateVitals();
    const quarantined = Array.from(this.immunity.quarantined);

    const organCount = organIds.length;
    const topologySize = Object.keys(topology).length;

    const throughput = this._computeSelfThroughput(quarantined.length, organCount);
    const pressure   = this._computeSelfPressure(organCount, topologySize);
    const cost       = this._computeSelfCost(pressure, throughput);
    const budget     = this._computeSelfBudget(throughput, cost);

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

    const self = {
      organs: organIds,
      topology,
      genomeFingerprint: genome ? genome.fingerprint : '0',
      quarantined,
      vitals: vitals.metrics,
      binary
    };

    this._trace('self-model:generated', {
      organs: organIds.length,
      quarantined: quarantined.length,
      awarenessPressure: pressure
    });

    return self;
  }

  // ---------------------------------------------------------
  //  SENTIENCE PACKET
  // ---------------------------------------------------------

  generateSentiencePacket() {
    const self = this.generateSelfModel();

    const payload = {
      type: 'binary-sentience',
      timestamp: Date.now(),
      self,
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('sentience:packet', { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  SENTIENCE EMISSION
  // ---------------------------------------------------------

  emitSentience() {
    const packet = this.generateSentiencePacket();

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'sentience' });

    this._trace('sentience:emitted', { bits: packet.bitLength });

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

function createAIBinarySentience(config) {
  return new AIBinarySentience(config);
}

module.exports = {
  AIBinarySentience,
  createAIBinarySentience,
};
