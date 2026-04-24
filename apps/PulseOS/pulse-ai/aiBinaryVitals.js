/**
 * aiBinaryVitals.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Vitals System** of the organism.
 *
 *   It evaluates:
 *     - memory health
 *     - pipeline stability
 *     - reflex responsiveness
 *     - heartbeat rhythm
 *     - scheduler timing
 *     - evolution drift
 *     - organ signature consistency
 *     - binary health artery metrics (throughput, pressure, cost, budget)
 *
 *   It produces:
 *     - binary health scores
 *     - binary anomaly packets
 *     - binary vitals snapshots
 */

class AIBinaryVitals {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-vitals';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.evolution = config.evolution;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.heartbeat = config.heartbeat || null;
    this.scheduler = config.scheduler || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryVitals requires aiBinaryAgent encoder');
    if (!this.memory) throw new Error('AIBinaryVitals requires aiBinaryMemory');
    if (!this.evolution) throw new Error('AIBinaryVitals requires aiBinaryEvolution');
  }

  // ---------------------------------------------------------
  //  BINARY HEALTH ARTERY METRICS
  // ---------------------------------------------------------

  _computeHealthThroughput(memoryHealth, pipelineStability) {
    const raw = Math.max(0, 1 - ((1 - memoryHealth) * 0.5 + (1 - pipelineStability) * 0.5));
    return Math.min(1, raw);
  }

  _computeHealthPressure(reflexResponsiveness, heartbeatRhythm, schedulerAccuracy) {
    const raw = Math.min(
      1,
      (1 - reflexResponsiveness) * 0.3 +
      (1 - heartbeatRhythm) * 0.3 +
      (1 - schedulerAccuracy) * 0.4
    );
    return Math.max(0, raw);
  }

  _computeHealthCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeHealthBudget(throughput, cost) {
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
  //  METRIC CALCULATIONS
  // ---------------------------------------------------------

  _memoryHealth() {
    const snapshot = this.memory.snapshot();
    return snapshot.length > 0 ? 1 : 0.5;
  }

  _pipelineStability() {
    return this.pipeline ? 1 : 0.5;
  }

  _reflexResponsiveness() {
    return this.reflex ? 1 : 0.5;
  }

  _heartbeatRhythm() {
    return this.heartbeat ? 1 : 0.5;
  }

  _schedulerAccuracy() {
    return this.scheduler ? 1 : 0.5;
  }

  _evolutionDrift() {
    return 1; // placeholder deterministic rule
  }

  // ---------------------------------------------------------
  //  VITALS GENERATION
  // ---------------------------------------------------------

  generateVitals() {
    const metrics = {
      memoryHealth: this._memoryHealth(),
      pipelineStability: this._pipelineStability(),
      reflexResponsiveness: this._reflexResponsiveness(),
      heartbeatRhythm: this._heartbeatRhythm(),
      schedulerAccuracy: this._schedulerAccuracy(),
      evolutionDrift: this._evolutionDrift(),
    };

    const throughput = this._computeHealthThroughput(
      metrics.memoryHealth,
      metrics.pipelineStability
    );

    const pressure = this._computeHealthPressure(
      metrics.reflexResponsiveness,
      metrics.heartbeatRhythm,
      metrics.schedulerAccuracy
    );

    const cost = this._computeHealthCost(pressure, throughput);
    const budget = this._computeHealthBudget(throughput, cost);

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
      type: 'binary-vitals',
      timestamp: Date.now(),
      metrics,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length,
    };

    this._trace('vitals:generated', {
      bits: packet.bitLength,
      metrics,
      binary
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  VITALS EMISSION
  // ---------------------------------------------------------

  emitVitals() {
    const vitals = this.generateVitals();

    if (this.pipeline) this.pipeline.run(vitals.bits);
    if (this.reflex) this.reflex.run(vitals.bits);
    if (this.logger) this.logger.logBinary(vitals.bits, { source: 'vitals' });

    this._trace('vitals:emitted', {
      bits: vitals.bitLength,
    });

    return vitals;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryVitals(config) {
  return new AIBinaryVitals(config);
}

module.exports = {
  AIBinaryVitals,
  createAIBinaryVitals,
};
