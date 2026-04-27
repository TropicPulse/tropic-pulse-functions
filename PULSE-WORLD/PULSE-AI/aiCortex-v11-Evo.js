/**
 * aiCortex-v11-Evo.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Dual‑Band Executive Cortex** of the organism.
 *
 *   Dual‑band model:
 *     - Binary‑primary (deterministic, pattern, metrics, arteries)
 *     - Symbolic‑fallback (semantic, contextual, persona, boundaries)
 *
 *   It provides:
 *     - long-term reasoning
 *     - pattern recognition
 *     - decision-making
 *     - predictive modeling (lightweight, deterministic)
 *     - high-level interpretation of signals
 *     - binary cognition artery metrics (throughput, pressure, cost, budget)
 *     - symbolic cognition artery metrics (intent clarity, semantic load, context depth)
 *
 *   It is the organism’s:
 *     • executive brain
 *     • reasoning engine
 *     • pattern cortex
 *     • decision layer
 *     • cognition artery regulator
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a reflex engine
 *     - a pipeline
 *     - a governor
 *     - a scheduler
 *
 *   This organ IS:
 *     - a reasoning layer
 *     - a pattern analyzer
 *     - a decision engine
 *     - a binary cognition organ
 *     - a symbolic cognition organ (fallback/augment)
 *     - a cognition artery pressure source
 *
 * CORTEX MODEL:
 *   A dual‑band cortex decision packet is:
 *
 *     {
 *       type: "binary-cortex-decision",
 *       timestamp: <ms>,
 *       pattern: <string>,
 *       decision: <string>,               // fused decision
 *       binary: { throughput, pressure, cost, budget, buckets },
 *       symbolic: {
 *         intent,
 *         confidence,
 *         semanticLoad,
 *         contextDepth,
 *         persona,
 *         boundaryMode
 *       },
 *       band: {
 *         primary: "binary",
 *         secondary: "symbolic",
 *         fusion: "binary-primary-symbolic-fallback"
 *       },
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   Entire fused decision is encoded into binary.
 */
/**
 * aiCortex.js — Pulse OS v11.1‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Dual‑band executive cortex (binary‑primary, symbolic‑fallback)
 */

// ---------------------------------------------------------
//  META BLOCK — v11.1‑EVO
// ---------------------------------------------------------

const CortexMeta = Object.freeze({
  layer: "PulseAICortexFrame",
  role: "CORTEX_ORGAN",
  version: "11.1-EVO",
  identity: "aiCortex-v11-EVO",

  evo: Object.freeze({
    // Core identity
    driftProof: true,
    deterministic: true,
    dualband: true,

    // Awareness
    binaryAware: true,
    symbolicAware: true,
    patternAware: true,
    decisionAware: true,
    fusionAware: true,
    cognitionAware: true,
    pressureAware: true,
    throughputAware: true,
    costAware: true,
    budgetAware: true,

    // Organism integration
    organismAware: true,
    personaAware: true,
    boundaryAware: true,
    routerAware: true,
    evolutionAware: true,
    registryAware: true,
    memoryAware: true,

    // Safety
    identitySafe: true,
    readOnly: true,

    // Lifecycle
    multiInstanceReady: true,
    epoch: "11.1-EVO"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide dual-band executive reasoning",
      "Fuse binary-primary and symbolic-fallback cognition",
      "Regulate cognition artery metrics (throughput, pressure, cost, budget)",
      "Interpret patterns and generate deterministic decisions",
      "Serve as the organism’s executive brain"
    ]),

    never: Object.freeze([
      "introduce randomness",
      "mutate external systems",
      "bypass persona or boundaries",
      "override evolution logic",
      "modify binary pipeline or reflex behavior"
    ]),

    always: Object.freeze([
      "analyze patterns deterministically",
      "compute cognition metrics safely",
      "fuse binary and symbolic decisions",
      "log trace events deterministically",
      "return frozen decision packets"
    ])
  })
});

// ---------------------------------------------------------
//  CORTEX CLASS — HEADER
// ---------------------------------------------------------

class AIDualBandCortex {
  constructor(config = {}) {
    this.id = config.id || "ai-dualband-cortex";

    // Binary / organism stack
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.memory = config.memory || null;
    this.registry = config.registry || null;
    this.evolution = config.evolution || null;

    // Symbolic / CNS stack
    this.router = config.router || null;
    this.personaEngine = config.personaEngine || null;
    this.boundariesEngine = config.boundariesEngine || null;
    this.permissionsEngine = config.permissionsEngine || null;

    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIDualBandCortex requires aiBinaryAgent encoder");

    this.patternHistory = [];
  }

  // ---------------------------------------------------------
  //  BINARY COGNITION ARTERY METRICS
  // ---------------------------------------------------------

  _computeCognitionThroughput(patternComplexity, snapshotBits) {
    const sizeFactor = Math.min(1, snapshotBits / 65536); // up to 64k bits
    const raw = Math.max(0, 1 - (patternComplexity * 0.5 + sizeFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeCognitionPressure(bitLength, snapshotBits) {
    const sizeFactor = Math.min(1, snapshotBits / 65536);
    const raw = Math.min(1, (bitLength / 50000) * (0.5 + sizeFactor * 0.5));
    return Math.max(0, raw);
  }

  _computeCognitionCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeCognitionBudget(throughput, cost) {
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
  //  PATTERN RECOGNITION (BINARY PRIMARY)
  // ---------------------------------------------------------

  _detectPattern(bits) {
    const motif = bits.slice(0, 16); // slightly richer motif

    this.patternHistory.push(motif);
    if (this.patternHistory.length > 32) {
      this.patternHistory.shift();
    }

    this._trace("pattern:detected", { motif });

    return motif;
  }

  // ---------------------------------------------------------
  //  BINARY DECISION (PRIMARY)
  // ---------------------------------------------------------

  _makeBinaryDecision(pattern, bits, snapshotBits) {
    const bitLength = bits.length;
    const complexity = pattern.length / 8;

    // Simple deterministic heuristic:
    // - high snapshotBits + long bits → "conserve"
    // - low snapshotBits + short bits → "expand"
    // - otherwise "neutral"
    const loadFactor = Math.min(1, snapshotBits / 65536);
    const signalFactor = Math.min(1, bitLength / 32768);

    let decision = "neutral";

    if (loadFactor > 0.7 && signalFactor > 0.5) {
      decision = "conserve";
    } else if (loadFactor < 0.3 && signalFactor < 0.5) {
      decision = "expand";
    }

    this._trace("decision:binary", {
      pattern,
      decision,
      loadFactor,
      signalFactor,
      complexity
    });

    return decision;
  }

  // ---------------------------------------------------------
  //  SYMBOLIC COGNITION (FALLBACK / AUGMENT)
  // ---------------------------------------------------------

  _makeSymbolicDecision(pattern, bits, routerPacket = null) {
    if (!routerPacket) {
      this._trace("symbolic:skipped", { reason: "no-router-packet" });
      return {
        decision: null,
        intent: null,
        confidence: 0,
        semanticLoad: 0,
        contextDepth: 0,
        persona: null,
        boundaryMode: null
      };
    }

    const intent = routerPacket.overmind?.intent || "analyze";
    const personaId = routerPacket.personaId || null;
    const safetyMode = routerPacket.personaSafety?.safetyMode || "standard";

    // Deterministic symbolic metrics based on flags + persona
    const flags = routerPacket.overmind?.flags || {};
    const activeFlags = Object.values(flags).filter(Boolean).length;

    const semanticLoad = Math.min(1, activeFlags / 10);
    const contextDepth =
      personaId === "ARCHITECT"
        ? 0.8
        : personaId === "OBSERVER"
        ? 0.6
        : personaId === "TOURGUIDE"
        ? 0.5
        : 0.4;

    const confidence =
      safetyMode === "strict"
        ? 0.6
        : safetyMode === "standard"
        ? 0.7
        : 0.8;

    // Symbolic decision is advisory; we keep it simple and deterministic
    let decision = null;
    if (intent === "optimize" || intent === "refactor") {
      decision = "expand";
    } else if (intent === "stabilize" || intent === "diagnose") {
      decision = "conserve";
    }

    const personaName = personaId;
    const boundaryMode = safetyMode;

    this._trace("decision:symbolic", {
      pattern,
      decision,
      intent,
      confidence,
      semanticLoad,
      contextDepth,
      persona: personaName,
      boundaryMode
    });

    return {
      decision,
      intent,
      confidence,
      semanticLoad,
      contextDepth,
      persona: personaName,
      boundaryMode
    };
  }

  // ---------------------------------------------------------
  //  DUAL‑BAND FUSION (BINARY‑PRIMARY, SYMBOLIC‑FALLBACK)
  // ---------------------------------------------------------

  _fuseDecisions(binaryDecision, symbolic) {
    const symbolicDecision = symbolic.decision;
    const confidence = symbolic.confidence || 0;

    let finalDecision = binaryDecision;

    if (symbolicDecision && confidence >= 0.8) {
      finalDecision = symbolicDecision;
    } else if (
      symbolicDecision &&
      confidence >= 0.5 &&
      symbolicDecision !== "neutral"
    ) {
      finalDecision = symbolicDecision;
    }

    this._trace("decision:fused", {
      binaryDecision,
      symbolicDecision,
      confidence,
      finalDecision
    });

    return finalDecision;
  }

  // ---------------------------------------------------------
  //  CORTEX PACKET (DUAL‑BAND)
// ---------------------------------------------------------
  _generateDecisionPacket(pattern, decision, bits, options = {}) {
    const bitLength = bits.length;

    let snapshotBits = 0;
    if (this.memory && typeof this.memory.snapshot === "function") {
      const snapshot = this.memory.snapshot();
      if (typeof snapshot === "string") {
        snapshotBits = snapshot.length;
      }
    }

    const patternComplexity = pattern.length / 8;

    const throughput = this._computeCognitionThroughput(
      patternComplexity,
      snapshotBits
    );
    const pressure = this._computeCognitionPressure(bitLength, snapshotBits);
    const cost = this._computeCognitionCost(pressure, throughput);
    const budget = this._computeCognitionBudget(throughput, cost);

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

    const symbolic = options.symbolic || {
      intent: null,
      confidence: 0,
      semanticLoad: 0,
      contextDepth: 0,
      persona: null,
      boundaryMode: null
    };

    const band = {
      primary: "binary",
      secondary: "symbolic",
      fusion: "binary-primary-symbolic-fallback"
    };

    const payload = {
      type: "binary-cortex-decision",
      timestamp: Date.now(),
      pattern,
      decision,
      binary,
      symbolic,
      band,
      binaryDecision: options.binaryDecision || decision,
      symbolicDecision: symbolic.decision || null
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    this._trace("cortex:packet", {
      bits: packet.bitLength,
      band
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  EXECUTIVE PROCESSING (DUAL‑BAND)
// ---------------------------------------------------------
  async process(bits, routerPacket = null) {
    // Binary pattern
    const pattern = this._detectPattern(bits);

    // Snapshot-based cognition context
    let snapshotBits = 0;
    if (this.memory && typeof this.memory.snapshot === "function") {
      const snapshot = this.memory.snapshot();
      if (typeof snapshot === "string") {
        snapshotBits = snapshot.length;
      }
    }

    // Binary primary decision
    const binaryDecision = this._makeBinaryDecision(
      pattern,
      bits,
      snapshotBits
    );

    // Symbolic fallback / augment (router packet from aiRouter-v11-EVO)
    const symbolic = this._makeSymbolicDecision(pattern, bits, routerPacket);

    // Dual‑band fusion
    const fusedDecision = this._fuseDecisions(binaryDecision, symbolic);

    const packet = this._generateDecisionPacket(pattern, fusedDecision, bits, {
      binaryDecision,
      symbolic
    });

    // Binary band propagation
    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: "cortex" });

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

function createCortex(config) {
  return new AIDualBandCortex(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

// ESM
export {
  CortexMeta,
  AIDualBandCortex,
  createCortex
};

// CommonJS
if (typeof module !== "undefined") {
  module.exports = {
    CortexMeta,
    AIDualBandCortex,
    createCortex
  };
}
