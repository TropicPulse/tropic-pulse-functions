/**
 * aiSentinel.js — Pulse OS v11‑EVO Organ
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
 *     - binary immune artery metrics (throughput, pressure, cost, budget)
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
 * ORGAN CONTRACT (v11‑EVO):
 *   - Must never mutate external organs
 *   - Must never generate symbolic state
 *   - Must only emit binary packets
 *   - Must remain deterministic
 *   - Must treat all inputs as untrusted
 *   - Must not block the organism
 *
 * SENTINEL PACKET FORMAT:
 *   {
 *     type: "binary-sentinel-alert",
 *     timestamp: <ms>,
 *     threat: <string>,
 *     severity: <0–1>,
 *     binary: { throughput, pressure, cost, budget, buckets },
 *     bits: <binary>,
 *     bitLength: <number>
 *   }
 */
export const SentinelMeta = Object.freeze({
  layer: "BinaryImmuneSystem",
  role: "BINARY_SENTINEL_ORGAN",
  version: "11.0-EVO",
  identity: "aiBinarySentinel-v11-EVO",

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
    tourismAware: false,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic perimeter scanning, hostile-pattern detection, binary threat classification, and immune artery pressure metrics.",

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
      "compute immune artery metrics",
      "log deterministic steps when tracing",
      "remain non-blocking"
    ])
  })
});

class AIBinarySentinel {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-sentinel";
    this.encoder = config.encoder;
    this.immunity = config.immunity;

    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;

    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinarySentinel requires aiBinaryAgent encoder");
    if (!this.immunity) throw new Error("AIBinarySentinel requires aiBinaryImmunity");
  }

  // ============================================================
  // BINARY IMMUNE ARTERY METRICS
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
    if (this.logger) this.logger.logBinary(packet.bits, { source: "sentinel", threat });

    return packet;
  }

  // ============================================================
  // PERIMETER SCAN (PRIMARY ORGAN FUNCTION)
  // ============================================================

  scan(binary) {
    const threat = this._detectThreat(binary);

    if (!threat) {
      this._trace("sentinel:safe", { size: binary.length });
      return true;
    }

    const { threat: name, severity } = threat;

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
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinarySentinel(config) {
  return new AIBinarySentinel(config);
}

module.exports = {
  AIBinarySentinel,
  createAIBinarySentinel
};
