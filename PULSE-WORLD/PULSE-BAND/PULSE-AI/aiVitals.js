/**
 * aiVitals.js — Pulse OS v12.3‑EVO+ Organ
 * ============================================================
 * ORGAN ROLE (CANONICAL):
 *   The Binary Vitals Engine is the organism’s **health artery**.
 *
 *   It evaluates binary‑level health across:
 *     - memory integrity
 *     - pipeline stability
 *     - reflex responsiveness
 *     - heartbeat rhythm
 *     - scheduler accuracy + temporal artery v3
 *     - evolution drift
 *     - sentience self‑awareness artery
 *     - sentinel threat artery
 *     - instruments analysis artery
 *     - binary artery metrics (throughput, pressure, cost, budget)
 *
 *   It produces:
 *     - binary health scores
 *     - binary anomaly packets (optional)
 *     - binary vitals snapshots
 *     - layered organism health artery v3
 *
 * ARCHITECTURAL POSITION:
 *   Layer: Binary Nervous System (BNS)
 *   Band: Binary (primary), Symbolic (optional trace only)
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
 *     - an organism‑level health fusion layer
 *
 * ORGAN CONTRACT (v12.3‑EVO+):
 *   - Must never mutate external organs
 *   - Must never generate symbolic state as primary output
 *   - Must only emit binary packets
 *   - Must remain deterministic
 *   - Must not block the organism
 *   - Must treat all inputs as read‑only
 *
 * VITALS PACKET FORMAT:
 *   {
 *     type: "binary-vitals",
 *     timestamp: <ms>,
 *     layered: {
 *       organism: { ... },
 *       scheduler: { ... },
 *       instruments: { ... },
 *       sentience: { ... },
 *       sentinel: { ... },
 *       memory: { ... },
 *       evolution: { ... },
 *       reflex: { ... },
 *       pipeline: { ... },
 *       heartbeat: { ... }
 *     },
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
  version: "12.3-EVO+",
  identity: "aiBinaryVitals-v12.3-EVO+",

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
    temporalAware: true,
    arteryAware: true,
    healthFusionAware: true,
    epoch: "v12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Evaluate organism health across memory, pipeline, reflex, heartbeat, scheduler, evolution drift, and fused subsystem arteries, producing deterministic binary vitals packets with layered organism health artery v3.",

    never: Object.freeze([
      "mutate external organs",
      "generate symbolic state as primary output",
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
      "compute artery metrics v3",
      "log deterministic steps when tracing",
      "remain non-blocking",
      "remain drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Binary Vitals is read-only, deterministic, and binary-only — it fuses health arteries but never mutates or governs other organs.";
  }
});

// ============================================================================
//  ARTERY HELPERS — v3 (PURE, STATELESS)
// ============================================================================

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+ HYBRID FUSION
// ============================================================================

export class AIBinaryVitals {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-vitals";
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.evolution = config.evolution;

    this.scheduler = config.scheduler || null;   // expects getTemporalArtery()
    this.instruments = config.instruments || null; // optional, expects getInstrumentsArterySnapshot? (or similar)
    this.sentience = config.sentience || null;   // expects generateSelfModel()
    this.sentinel = config.sentinel || null;     // optional, threat artery source

    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.heartbeat = config.heartbeat || null;
    this.logger = config.logger || null;

    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIBinaryVitals requires aiBinaryAgent encoder");
    }
    if (!this.memory || typeof this.memory.snapshot !== "function") {
      throw new Error("AIBinaryVitals requires aiBinaryMemory");
    }
    if (!this.evolution) {
      throw new Error("AIBinaryVitals requires aiBinaryEvolution");
    }

    // rolling window for artery v3
    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowSamples = 0;
    this._windowHighPressureSamples = 0;
    this._windowLowBudgetSamples = 0;

    this._totalSamples = 0;

    // spiral warning (non-blocking)
    this._spiralWarnings = 0;

    // binary payload cache
    this._lastPayloadJson = null;
    this._lastBits = null;

    // multi-instance identity
    this.instanceIndex = AIBinaryVitals._registerInstance();
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------

  static _registerInstance() {
    if (typeof AIBinaryVitals._instanceCount !== "number") {
      AIBinaryVitals._instanceCount = 0;
    }
    const index = AIBinaryVitals._instanceCount;
    AIBinaryVitals._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinaryVitals._instanceCount === "number"
      ? AIBinaryVitals._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  WINDOW ROLLING
  // ---------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowSamples = 0;
      this._windowHighPressureSamples = 0;
      this._windowLowBudgetSamples = 0;
    }
  }

  // ============================================================
  // BASE HEALTH METRICS (DETERMINISTIC)
// ============================================================

  _memoryHealth() {
    const snapshot = this.memory.snapshot();
    return snapshot && snapshot.length > 0 ? 1 : 0.5;
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
    // placeholder — evolution organ can supply real drift metric
    return 1;
  }

  // ============================================================
  // FUSED SUBSYSTEM ARTERIES (READ‑ONLY)
// ============================================================

  _schedulerArtery() {
    if (!this.scheduler || typeof this.scheduler.getTemporalArtery !== "function") {
      return null;
    }
    try {
      return this.scheduler.getTemporalArtery();
    } catch {
      return null;
    }
  }

  _instrumentsArtery() {
    if (!this.instruments || typeof this.instruments.getInstrumentsArterySnapshot !== "function") {
      return null;
    }
    try {
      return this.instruments.getInstrumentsArterySnapshot();
    } catch {
      return null;
    }
  }

  _sentienceArtery() {
    if (!this.sentience || typeof this.sentience.generateSelfModel !== "function") {
      return null;
    }
    try {
      const self = this.sentience.generateSelfModel();
      return self && self.binary ? self.binary : null;
    } catch {
      return null;
    }
  }

  _sentinelArtery() {
    // Sentinel is event‑driven; vitals can optionally read last known threat metrics if exposed.
    if (!this.sentinel || typeof this.sentinel.getLastThreatArtery !== "function") {
      return null;
    }
    try {
      return this.sentinel.getLastThreatArtery();
    } catch {
      return null;
    }
  }

  // ============================================================
  // ORGANISM‑LEVEL ARTERY v3 (LAYERED FUSION)
// ============================================================

  _computeOrganismArtery(layered) {
    const {
      memory,
      pipeline,
      reflex,
      heartbeat,
      scheduler,
      evolution,
      sentience,
      sentinel,
      instruments
    } = layered;

    const memoryHealth = memory.health;
    const pipelineStability = pipeline.stability;
    const reflexResponsiveness = reflex.responsiveness;
    const heartbeatRhythm = heartbeat.rhythm;
    const schedulerAccuracy = scheduler.accuracy;
    const evolutionDrift = evolution.drift;

    // base organism pressure/throughput from core health
    const corePressure =
      (1 - memoryHealth) * 0.15 +
      (1 - pipelineStability) * 0.15 +
      (1 - reflexResponsiveness) * 0.15 +
      (1 - heartbeatRhythm) * 0.15 +
      (1 - schedulerAccuracy) * 0.2 +
      (1 - evolutionDrift) * 0.2;

    const schedulerPressure = scheduler.artery?.pressure ?? 0;
    const instrumentsPressure = instruments.artery?.pressure ?? 0;
    const sentiencePressure = sentience.artery?.pressure ?? 0;
    const sentinelPressure = sentinel.artery?.pressure ?? 0;

    const fusedPressureBase = Math.min(
      1,
      corePressure * 0.5 +
        schedulerPressure * 0.15 +
        instrumentsPressure * 0.1 +
        sentiencePressure * 0.15 +
        sentinelPressure * 0.1
    );

    const pressure = Math.max(0, fusedPressureBase);
    const throughputBase = Math.max(0, 1 - pressure);
    const throughput = Math.max(0, Math.min(1, throughputBase));
    const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const artery = {
      throughput,
      pressure,
      cost,
      budget,
      throughputBucket: bucketLevel(throughput),
      pressureBucket: bucketPressure(pressure),
      costBucket: bucketCost(cost),
      budgetBucket: bucketLevel(budget)
    };

    return artery;
  }

  // ============================================================
  // LAYERED SNAPSHOT (HYBRID FUSION)
// ============================================================

  _computeLayeredSnapshot() {
    const memoryHealth = this._memoryHealth();
    const pipelineStability = this._pipelineStability();
    const reflexResponsiveness = this._reflexResponsiveness();
    const heartbeatRhythm = this._heartbeatRhythm();
    const schedulerAccuracy = this._schedulerAccuracy();
    const evolutionDrift = this._evolutionDrift();

    const schedulerArtery = this._schedulerArtery();
    const instrumentsArtery = this._instrumentsArtery();
    const sentienceArtery = this._sentienceArtery();
    const sentinelArtery = this._sentinelArtery();

    const layered = {
      scheduler: {
        accuracy: schedulerAccuracy,
        artery: schedulerArtery || null
      },
      instruments: {
        artery: instrumentsArtery || null
      },
      sentience: {
        artery: sentienceArtery || null
      },
      sentinel: {
        artery: sentinelArtery || null
      },
      memory: {
        health: memoryHealth
      },
      evolution: {
        drift: evolutionDrift
      },
      reflex: {
        responsiveness: reflexResponsiveness
      },
      pipeline: {
        stability: pipelineStability
      },
      heartbeat: {
        rhythm: heartbeatRhythm
      }
    };

    const organismArtery = this._computeOrganismArtery(layered);
    layered.organism = organismArtery;

    return layered;
  }

  // ============================================================
  // SPIRAL WARNING (NON‑BLOCKING)
// ============================================================

  _updateSpiralState(organismArtery, now) {
    this._rollWindow(now);

    this._windowSamples += 1;
    this._totalSamples += 1;

    if (organismArtery.pressure >= 0.7) {
      this._windowHighPressureSamples += 1;
    }
    if (organismArtery.budget <= 0.25) {
      this._windowLowBudgetSamples += 1;
    }

    const highPressureRatio =
      this._windowSamples > 0
        ? this._windowHighPressureSamples / this._windowSamples
        : 0;

    const lowBudgetRatio =
      this._windowSamples > 0
        ? this._windowLowBudgetSamples / this._windowSamples
        : 0;

    const spiralDetected =
      highPressureRatio >= 0.6 && lowBudgetRatio >= 0.4;

    if (spiralDetected) {
      this._spiralWarnings += 1;
      this._trace("vitals:spiral-warning", {
        instanceIndex: this.instanceIndex,
        highPressureRatio,
        lowBudgetRatio,
        windowSamples: this._windowSamples,
        spiralWarnings: this._spiralWarnings
      });
    }
  }

  // ============================================================
  // VITALS GENERATION (BINARY‑ONLY OUTPUT)
// ============================================================

  generateVitals() {
    const now = Date.now();
    const layered = this._computeLayeredSnapshot();
    const organismArtery = layered.organism;

    this._updateSpiralState(organismArtery, now);

    const binary = {
      throughput: organismArtery.throughput,
      pressure: organismArtery.pressure,
      cost: organismArtery.cost,
      budget: organismArtery.budget,
      throughputBucket: organismArtery.throughputBucket,
      pressureBucket: organismArtery.pressureBucket,
      costBucket: organismArtery.costBucket,
      budgetBucket: organismArtery.budgetBucket
    };

    const payload = {
      type: "binary-vitals",
      timestamp: now,
      layered,
      binary
    };

    const json = JSON.stringify(payload);

    // binary payload cache (deterministic)
    if (this._lastPayloadJson === json && this._lastBits) {
      const packet = {
        ...payload,
        bits: this._lastBits,
        bitLength: this._lastBits.length
      };

      this._trace("vitals:generated:cached", {
        bits: packet.bitLength,
        organism: payload.binary,
        instanceIndex: this.instanceIndex
      });

      return packet;
    }

    const encoded = this.encoder.encode(json);

    this._lastPayloadJson = json;
    this._lastBits = encoded;

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    this._trace("vitals:generated", {
      bits: packet.bitLength,
      organism: payload.binary,
      instanceIndex: this.instanceIndex
    });

    return packet;
  }

  // ============================================================
  // PREWARM — STABILIZE ARTERY BEFORE FIRST EMISSION
  // ============================================================

  prewarm(iterations = 3) {
    const count = Math.max(1, Math.min(10, iterations));
    for (let i = 0; i < count; i++) {
      const now = Date.now();
      const layered = this._computeLayeredSnapshot();
      const organismArtery = layered.organism;
      this._updateSpiralState(organismArtery, now);
    }
    this._trace("vitals:prewarm", {
      iterations: count,
      instanceIndex: this.instanceIndex
    });
  }

  // ============================================================
  // VITALS EMISSION
  // ============================================================

  emitVitals() {
    const vitals = this.generateVitals();

    if (this.pipeline) this.pipeline.run(vitals.bits);
    if (this.reflex) this.reflex.run(vitals.bits);
    if (this.logger && typeof this.logger.logBinary === "function") {
      this.logger.logBinary(vitals.bits, { source: "vitals" });
    }

    this._trace("vitals:emitted", {
      bits: vitals.bitLength,
      instanceIndex: this.instanceIndex
    });

    return vitals;
  }

  // ============================================================
  // EXTERNAL SNAPSHOT ACCESSOR (OPTIONAL, SYMBOLIC TRACE ONLY)
// ============================================================

  getLayeredArtery() {
    return this._computeLayeredSnapshot();
  }

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}#${this.instanceIndex}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY — v12.3‑EVO+
// ============================================================================

export function createAIBinaryVitals(config) {
  return new AIBinaryVitals(config);
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VitalsMeta,
    AIBinaryVitals,
    createAIBinaryVitals
  };
}
