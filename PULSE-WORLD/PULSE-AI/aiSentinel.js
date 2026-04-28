/**
 * aiSentinel.js — Pulse OS v12.3‑EVO+ Organ
 * ============================================================
 * ORGAN ROLE (CANONICAL):
 *   The Binary Sentinel is the organism’s **perimeter immune layer**.
 *
 *   It enforces the Prime Law:
 *       “THE ORGANISM MUST DEFEND ITS PERIMETER.”
 *
 *   It performs:
 *     - external threat detection
 *     - environmental anomaly scanning
 *     - hostile pattern recognition
 *     - perimeter-level packet filtering
 *     - early-warning alerts
 *     - binary immune artery metrics v3 (throughput, pressure, cost, budget)
 *     - multi-instance harmony + spiral warnings (non-blocking)
 *
 * ARCHITECTURAL POSITION:
 *   Layer: Binary Immune System (BIS)
 *   Band: Binary (primary), Symbolic (optional trace)
 *   Mode: Read‑only scanning + binary anomaly emission
 *
 *   This organ is NOT:
 *     - internal immunity
 *     - a reflex engine
 *     - a pipeline
 *     - a cortex
 *
 *   This organ IS:
 *     - a perimeter scanner
 *     - a threat detector
 *     - a hostile-pattern filter
 *     - a binary sentinel
 *     - an immune artery pressure source
 *
 * ORGAN CONTRACT (v12.3‑EVO+):
 *   - Must never mutate external organs
 *   - Must never generate symbolic state
 *   - Must only emit binary packets
 *   - Must remain deterministic
 *   - Must treat all inputs as untrusted
 *   - Must not block the organism
 */

export const SentinelMeta = Object.freeze({
  layer: "BinaryImmuneSystem",
  role: "BINARY_SENTINEL_ORGAN",
  version: "12.3-EVO+",
  identity: "aiBinarySentinel-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    relayOnly: false,
    analysisAware: false,
    schemaAware: false,
    lineageAware: true,
    slowdownAware: true,
    immuneAware: true,
    immuneArteryAware: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic perimeter scanning, hostile-pattern detection, binary threat classification, and immune artery pressure metrics v3.",

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
      "treat all inputs as untrusted",
      "emit binary-only alert packets",
      "apply deterministic threat rules",
      "compute immune artery metrics v3",
      "log deterministic steps when tracing",
      "remain non-blocking"
    ])
  })
});

// ============================================================
// IMMUNE ARTERY HELPERS — v3 (PURE, STATELESS)
// ============================================================

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

function computeImmuneArtery({
  scanRatePerSec,
  alertRatePerSec,
  severeRatio,
  avgThreatSeverity,
  avgBinaryLength,
  instanceCount
}) {
  const harmonicAlertRate =
    instanceCount > 0 ? alertRatePerSec / instanceCount : alertRatePerSec;

  const scanFactor = Math.min(1, scanRatePerSec / 256);
  const alertFactor = Math.min(1, harmonicAlertRate / 64);
  const severityFactor = Math.min(1, avgThreatSeverity);
  const sizeFactor = Math.min(1, avgBinaryLength / 65536);
  const severeFactor = Math.min(1, severeRatio);

  const pressureBase = Math.max(
    0,
    Math.min(
      1,
      (scanFactor + alertFactor + severityFactor + sizeFactor + severeFactor) /
        5
    )
  );
  const pressure = pressureBase;

  const throughputBase = Math.max(
    0,
    1 - (alertFactor * 0.4 + severityFactor * 0.3 + severeFactor * 0.3)
  );
  const throughput = Math.max(0, Math.min(1, throughputBase));

  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    scanRatePerSec,
    alertRatePerSec,
    harmonicAlertRate,
    severeRatio,
    avgThreatSeverity,
    avgBinaryLength,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: bucketLevel(throughput),
    pressureBucket: bucketPressure(pressure),
    costBucket: bucketCost(cost),
    budgetBucket: bucketLevel(budget)
  });
}

// ============================================================
// ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================

export class AIBinarySentinel {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-sentinel";
    this.encoder = config.encoder;
    this.immunity = config.immunity;

    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;

    this.trace = !!config.trace;

    if (!this.encoder)
      throw new Error("AIBinarySentinel requires aiBinaryAgent encoder");
    if (!this.immunity)
      throw new Error("AIBinarySentinel requires aiBinaryImmunity");

    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowScans = 0;
    this._windowAlerts = 0;
    this._windowSevereAlerts = 0;
    this._windowSeveritySum = 0;
    this._windowBinaryLengthSum = 0;

    this._totalAlerts = 0;

    this.instanceIndex = AIBinarySentinel._registerInstance();
  }

  // ----------------------------------------------------------
  // STATIC INSTANCE REGISTRY
  // ----------------------------------------------------------

  static _registerInstance() {
    if (typeof AIBinarySentinel._instanceCount !== "number") {
      AIBinarySentinel._instanceCount = 0;
    }
    const index = AIBinarySentinel._instanceCount;
    AIBinarySentinel._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinarySentinel._instanceCount === "number"
      ? AIBinarySentinel._instanceCount
      : 0;
  }

  // ----------------------------------------------------------
  // WINDOW ROLLING
  // ----------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowScans = 0;
      this._windowAlerts = 0;
      this._windowSevereAlerts = 0;
      this._windowSeveritySum = 0;
      this._windowBinaryLengthSum = 0;
    }
  }

  // ============================================================
  // BINARY IMMUNE ARTERY SNAPSHOT v3
  // ============================================================

  _computeImmuneArterySnapshot(binaryLengthHint = 0, severityHint = 0) {
    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const scanRatePerMs = this._windowScans / elapsedMs;
    const alertRatePerMs = this._windowAlerts / elapsedMs;

    const scanRatePerSec = scanRatePerMs * 1000;
    const alertRatePerSec = alertRatePerMs * 1000;

    const instanceCount = AIBinarySentinel.getInstanceCount();

    const avgThreatSeverity =
      this._windowAlerts > 0
        ? this._windowSeveritySum / this._windowAlerts
        : severityHint;

    const avgBinaryLength =
      this._windowAlerts > 0
        ? this._windowBinaryLengthSum / this._windowAlerts
        : binaryLengthHint;

    const severeRatio =
      this._windowAlerts > 0
        ? this._windowSevereAlerts / this._windowAlerts
        : 0;

    return computeImmuneArtery({
      scanRatePerSec,
      alertRatePerSec,
      severeRatio,
      avgThreatSeverity,
      avgBinaryLength,
      instanceCount
    });
  }

  getImmuneArtery() {
    return this._computeImmuneArterySnapshot();
  }

  // ============================================================
  // BINARY IMMUNE ARTERY METRICS (PER-ALERT VIEW)
  // ============================================================

  _computeThreatThroughput(severity) {
    return Math.max(0, Math.min(1, 1 - severity));
  }

  _computeThreatPressure(binaryLength, severity) {
    const raw = (binaryLength / 50000) * severity;
    return Math.max(0, Math.min(1, raw));
  }

  _computeThreatCost(pressure, throughput) {
    return Math.max(0, Math.min(1, pressure * (1 - throughput)));
  }

  _computeThreatBudget(throughput, cost) {
    return Math.max(0, Math.min(1, throughput - cost));
  }

  _bucketLevel(v) {
    return bucketLevel(v);
  }

  _bucketPressure(v) {
    return bucketPressure(v);
  }

  _bucketCost(v) {
    return bucketCost(v);
  }

  // ============================================================
  // THREAT DETECTION RULES (DETERMINISTIC)
  // ============================================================

  _detectThreat(binary) {
    if (typeof binary !== "string" || !/^[01]+$/.test(binary)) {
      return { threat: "non-binary-input", severity: 1 };
    }

    if (/00000000|11111111/.test(binary)) {
      return { threat: "repetition-attack", severity: 0.8 };
    }

    if (binary.length < 8) {
      return { threat: "probing-signal", severity: 0.4 };
    }

    if (binary.length > 50000) {
      return { threat: "flood-attack", severity: 0.9 };
    }

    const ones = binary.split("").filter((b) => b === "1").length;
    const ratio = ones / binary.length;

    if (ratio > 0.9 || ratio < 0.1) {
      return { threat: "entropy-anomaly", severity: 0.6 };
    }

    return null;
  }

  // ============================================================
  // ALERT PACKET GENERATION
  // ============================================================

  _generateAlertPacket(threat, severity, binaryLength) {
    const throughput = this._computeThreatThroughput(severity);
    const pressure = this._computeThreatPressure(binaryLength, severity);
    const cost = this._computeThreatCost(pressure, throughput);
    const budget = this._computeThreatBudget(throughput, cost);

    const artery = this._computeImmuneArterySnapshot(binaryLength, severity);

    const binary = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      immuneArtery: artery
    };

    const payload = {
      type: "binary-sentinel-alert",
      timestamp: Date.now(),
      threat,
      severity,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      this._trace("sentinel:spiral-warning", {
        threat,
        severity,
        immunePressure: artery.pressure,
        immuneBudgetBucket: artery.budgetBucket
      });
    }

    this._trace("sentinel:alert", { threat, severity });
    return packet;
  }

  // ============================================================
  // ALERT EMISSION
  // ============================================================

  _emitAlert(threat, severity, binaryLength) {
    const packet = this._generateAlertPacket(threat, severity, binaryLength);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger)
      this.logger.logBinary(packet.bits, { source: "sentinel", threat });

    return packet;
  }

  // ============================================================
  // PERIMETER SCAN (PRIMARY ORGAN FUNCTION)
// ============================================================

  scan(binary) {
    const now = Date.now();
    this._rollWindow(now);
    this._windowScans += 1;

    const threat = this._detectThreat(binary);

    if (!threat) {
      const artery = this._computeImmuneArterySnapshot(
        binary?.length || 0,
        0
      );
      this._trace("sentinel:safe", {
        size: binary?.length || 0,
        immunePressure: artery.pressure,
        immuneBudgetBucket: artery.budgetBucket
      });
      return true;
    }

    const { threat: name, severity } = threat;

    this._windowAlerts += 1;
    this._windowSeveritySum += severity;
    this._windowBinaryLengthSum += binary.length;
    if (severity >= 0.7) this._windowSevereAlerts += 1;
    this._totalAlerts += 1;

    this._emitAlert(name, severity, binary.length);

    // Immunity organ handles sanitization
    this.immunity.sanitize(binary);

    return false;
  }

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}#${this.instanceIndex}] ${event}`, payload);
  }
}

// FACTORY — v12.3‑EVO+ STYLE
export function createAIBinarySentinel(config) {
  return new AIBinarySentinel(config);
}

// DUAL‑MODE EXPORTS (ESM + CommonJS)
if (typeof module !== "undefined") {
  module.exports = {
    SentinelMeta,
    AIBinarySentinel,
    createAIBinarySentinel
  };
}
