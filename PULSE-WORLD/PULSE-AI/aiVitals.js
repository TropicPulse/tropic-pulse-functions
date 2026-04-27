/**
 * aiVitals.js — Pulse OS v11.2‑EVO+ Organ
 * ============================================================
 * ORGAN ROLE (CANONICAL):
 *   The Binary Vitals Engine is the organism’s **health artery**.
 *
 *   It evaluates binary‑level health across:
 *     - memory integrity
 *     - pipeline stability
 *     - reflex responsiveness
 *     - heartbeat rhythm
 *     - scheduler accuracy
 *     - evolution drift
 *     - organ signature consistency
 *     - binary artery metrics (throughput, pressure, cost, budget)
 *
 *   It produces:
 *     - binary health scores
 *     - binary anomaly packets
 *     - binary vitals snapshots
 *
 * ARCHITECTURAL POSITION:
 *   Layer: Binary Nervous System (BNS)
 *   Band: Binary (primary), Symbolic (optional trace)
 *   Mode: Read‑only measurement + binary packet emission
 *
 *   This organ is NOT:
 *     - a healer
 *     - a governor
 *     - a scheduler
 *     - a reflex engine
 *
 *   This organ IS:
 *     - a binary health evaluator
 *     - a drift detector
 *     - a vitals generator
 *     - a binary artery monitor
 *
 * ORGAN CONTRACT (v11.2‑EVO+):
 *   - Must never mutate external organs
 *   - Must never generate symbolic state
 *   - Must only emit binary packets
 *   - Must remain deterministic
 *   - Must not block the organism
 *   - Must treat all inputs as read‑only
 *
 * VITALS PACKET FORMAT:
 *   {
 *     type: "binary-vitals",
 *     timestamp: <ms>,
 *     metrics: { ... },
 *     binary: { throughput, pressure, cost, budget, buckets },
 *     bits: <binary>,
 *     bitLength: <number>
 *   }
 */

export const VitalsMeta = Object.freeze({
  type: "Binary",
  subsystem: "aiBinaryVitals",
  layer: "BinaryNervousSystem",
  role: "BINARY_VITALS_ORGAN",
  version: "11.2-EVO+",
  identity: "aiBinaryVitals-v11.2-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    relayOnly: false,
    analysisAware: true,
    schemaAware: true,
    lineageAware: true,
    slowdownAware: true,
    tourismAware: false,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Evaluate organism health across memory, pipeline, reflex, heartbeat, scheduler, evolution drift, and artery metrics, producing deterministic binary vitals packets.",

    never: Object.freeze([
      "mutate external organs",
      "generate symbolic state",
      "introduce randomness",
      "override pipeline decisions",
      "override reflex decisions",
      "block organism execution",
      "perform cognition",
      "perform intent logic"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "emit binary-only vitals packets",
      "apply deterministic health rules",
      "compute artery metrics",
      "log deterministic steps when tracing",
      "remain non-blocking"
    ])
  }),

  boundaryReflex() {
    return "Binary Vitals is read-only, deterministic, and binary-only — it evaluates health but never mutates or governs other organs.";
  }
});

export class AIBinaryVitals {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-vitals";
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.evolution = config.evolution;

    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.heartbeat = config.heartbeat || null;
    this.scheduler = config.scheduler || null;
    this.logger = config.logger || null;

    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinaryVitals requires aiBinaryAgent encoder");
    if (!this.memory) throw new Error("AIBinaryVitals requires aiBinaryMemory");
    if (!this.evolution) throw new Error("AIBinaryVitals requires aiBinaryEvolution");
  }

  // ============================================================
  // BINARY HEALTH ARTERY METRICS
  // ============================================================

  _computeHealthThroughput(memoryHealth, pipelineStability) {
    const raw = Math.max(
      0,
      1 - ((1 - memoryHealth) * 0.5 + (1 - pipelineStability) * 0.5)
    );
    return Math.min(1, raw);
  }

  _computeHealthPressure(reflexResponsiveness, heartbeatRhythm, schedulerAccuracy) {
    const raw =
      (1 - reflexResponsiveness) * 0.3 +
      (1 - heartbeatRhythm) * 0.3 +
      (1 - schedulerAccuracy) * 0.4;

    return Math.max(0, Math.min(1, raw));
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

  // ============================================================
  // METRIC CALCULATIONS (DETERMINISTIC)
  // ============================================================

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
    // v11.2‑EVO+ placeholder — evolution organ will supply real drift soon
    return 1;
  }

  // ============================================================
  // VITALS GENERATION
  // ============================================================

  generateVitals() {
    const metrics = {
      memoryHealth: this._memoryHealth(),
      pipelineStability: this._pipelineStability(),
      reflexResponsiveness: this._reflexResponsiveness(),
      heartbeatRhythm: this._heartbeatRhythm(),
      schedulerAccuracy: this._schedulerAccuracy(),
      evolutionDrift: this._evolutionDrift()
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
      type: "binary-vitals",
      timestamp: Date.now(),
      metrics,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    this._trace("vitals:generated", {
      bits: packet.bitLength,
      metrics,
      binary
    });

    return packet;
  }

  // ============================================================
  // VITALS EMISSION
  // ============================================================

  emitVitals() {
    const vitals = this.generateVitals();

    if (this.pipeline) this.pipeline.run(vitals.bits);
    if (this.reflex) this.reflex.run(vitals.bits);
    if (this.logger) this.logger.logBinary(vitals.bits, { source: "vitals" });

    this._trace("vitals:emitted", {
      bits: vitals.bitLength
    });

    return vitals;
  }

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

export function createAIBinaryVitals(config) {
  return new AIBinaryVitals(config);
}

// ---------------------------------------------------------------------------
// DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VitalsMeta,
    AIBinaryVitals,
    createAIBinaryVitals
  };
}
