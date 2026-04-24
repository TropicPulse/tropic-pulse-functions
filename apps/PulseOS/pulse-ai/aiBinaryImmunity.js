/**
 * aiBinaryImmunity.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Immune System** of the organism.
 *
 *   It protects against:
 *     - corrupted binary packets
 *     - malformed signals
 *     - failing organs
 *     - drifted signatures
 *     - pipeline contamination
 *     - reflex misfires
 *
 *   It performs:
 *     - anomaly detection
 *     - organ quarantine
 *     - packet neutralization
 *     - structural isolation (via Anatomy)
 *     - binary immune artery scoring (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • immune core
 *     • quarantine engine
 *     • structural firewall
 *     • binary sanitation layer
 *     • internal immune artery source
 *
 * WHY THIS ORGAN EXISTS:
 *   Without immunity:
 *     - one corrupted packet can poison the organism
 *     - one failing organ can cascade failures
 *     - drift can spread unchecked
 *     - watchdog alerts cannot be acted upon
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST DEFEND ITSELF.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a watchdog (detects failures)
 *     - a vitals system (scores health)
 *     - a governor (makes decisions)
 *
 *   This organ IS:
 *     - a binary immune layer
 *     - a quarantine engine
 *     - a packet sanitizer
 *     - a structural isolator
 *     - an immune artery pressure regulator
 *
 * IMMUNITY MODEL:
 *   Immune response packet:
 *
 *     {
 *       type: "binary-immune-response",
 *       timestamp: <ms>,
 *       anomaly: <string>,
 *       organId: <string|null>,
 *       binary: { throughput, pressure, cost, budget, buckets },
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   Entire immune response is encoded into binary.
 */

class AIBinaryImmunity {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-immunity';
    this.encoder = config.encoder;
    this.anatomy = config.anatomy;
    this.evolution = config.evolution;
    this.registry = config.registry;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryImmunity requires aiBinaryAgent encoder');
    if (!this.anatomy) throw new Error('AIBinaryImmunity requires aiBinaryAnatomy');
    if (!this.evolution) throw new Error('AIBinaryImmunity requires aiBinaryEvolution');
    if (!this.registry) throw new Error('AIBinaryImmunity requires aiBinaryOrganRegistry');

    this.quarantined = new Set();
  }

  // ---------------------------------------------------------
  //  BINARY IMMUNE ARTERY METRICS
  // ---------------------------------------------------------

  _computeSanitationThroughput(anomalySeverity) {
    const raw = 1 - anomalySeverity;
    return Math.max(0, Math.min(1, raw));
  }

  _computeSanitationPressure(binaryLength, anomalySeverity) {
    const raw = Math.min(1, (binaryLength / 50000) * anomalySeverity);
    return Math.max(0, Math.min(1, raw));
  }

  _computeSanitationCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeSanitationBudget(throughput, cost) {
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
  //  IMMUNE RESPONSE GENERATION
  // ---------------------------------------------------------

  _generateResponse(anomaly, organId = null, anomalySeverity = 0.5, binaryLength = 1) {
    const throughput = this._computeSanitationThroughput(anomalySeverity);
    const pressure   = this._computeSanitationPressure(binaryLength, anomalySeverity);
    const cost       = this._computeSanitationCost(pressure, throughput);
    const budget     = this._computeSanitationBudget(throughput, cost);

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
      type: 'binary-immune-response',
      timestamp: Date.now(),
      anomaly,
      organId,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length,
    };

    this._trace('immune:generated', packet);

    return packet;
  }

  _emitResponse(anomaly, organId = null, severity = 0.5, binaryLength = 1) {
    const response = this._generateResponse(anomaly, organId, severity, binaryLength);

    if (this.pipeline) this.pipeline.run(response.bits);
    if (this.reflex) this.reflex.run(response.bits);
    if (this.logger) this.logger.logBinary(response.bits, { source: 'immunity', anomaly, organId });

    this._trace('immune:emitted', { anomaly, organId });

    return response;
  }

  // ---------------------------------------------------------
  //  PACKET SANITIZATION
  // ---------------------------------------------------------

  sanitize(binary) {
    if (typeof binary !== 'string' || !/^[01]+$/.test(binary)) {
      return this._emitResponse('malformed-packet', null, 1.0, binary.length || 1);
    }

    const repeat = /(000000+|111111+)/;
    if (repeat.test(binary)) {
      return this._emitResponse('corrupted-packet', null, 0.8, binary.length);
    }

    return true;
  }

  // ---------------------------------------------------------
  //  ORGAN QUARANTINE
  // ---------------------------------------------------------

  quarantineOrgan(organId) {
    this.quarantined.add(organId);

    const topo = this.anatomy.topology.get(organId);
    if (topo) {
      topo.inputs = [];
      topo.outputs = [];
      topo.bidirectional = [];
    }

    this._emitResponse('organ-quarantined', organId, 0.9, 1);
  }

  releaseOrgan(organId) {
    if (this.quarantined.has(organId)) {
      this.quarantined.delete(organId);
      this._emitResponse('organ-released', organId, 0.2, 1);
    }
  }

  // ---------------------------------------------------------
  //  SIGNATURE DRIFT DETECTION
  // ---------------------------------------------------------

  checkOrgan(organId) {
    const record = this.registry.getOrganRecord(organId);
    if (!record) return;

    const storedSig = this.evolution.loadSignature({ id: organId });
    const currentSig = this.evolution.generateSignature({ id: organId });

    if (storedSig !== currentSig) {
      this._emitResponse('signature-drift', organId, 0.7, 1);
      this.quarantineOrgan(organId);
    }
  }

  // ---------------------------------------------------------
  //  ORGANISM-WIDE IMMUNE SWEEP
  // ---------------------------------------------------------

  sweep() {
    const organIds = this.registry.listOrgans();

    for (const id of organIds) {
      if (!this.quarantined.has(id)) {
        this.checkOrgan(id);
      }
    }

    this._trace('immune:sweep', { organs: organIds.length });
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryImmunity(config) {
  return new AIBinaryImmunity(config);
}

module.exports = {
  AIBinaryImmunity,
  createAIBinaryImmunity,
};
