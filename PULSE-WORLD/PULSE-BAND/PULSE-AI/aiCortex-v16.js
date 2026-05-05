/**
 * aiCortex-v16.0-IMMORTAL-ADV — Pulse OS v16‑IMMORTAL-ADV Organ
 * --------------------------------------------------------------
 * CANONICAL ROLE:
 *   Dual‑Band Executive Cortex of the organism (subordinate to Aldwyn).
 *
 *   Dual‑band model:
 *     - Binary‑primary (deterministic, pattern, metrics, arteries)
 *     - Symbolic‑augment (persona, boundaries, intent, social/earn context)
 *
 *   Provides:
 *     - long-term reasoning
 *     - pattern recognition
 *     - decision-making
 *     - predictive modeling (lightweight, deterministic)
 *     - binary cognition artery metrics (throughput, pressure, cost, budget)
 *     - symbolic cognition artery metrics (intent clarity, semantic load, context depth)
 *     - dual-band cognition artery snapshots for NodeAdmin/Overmind
 *     - earn/heartbeat/organism‑vitals awareness (read‑only)
 *
 *   It is the organism’s:
 *     • executive brain
 *     • reasoning engine
 *     • pattern cortex
 *     • decision layer
 *     • cognition artery regulator
 *
 *   Ownership:
 *     • Explicitly subordinate to Aldwyn (canonical owner).
 *     • Never self‑promotes above owner or Overmind.
 */

/*
AI_EXPERIENCE_META = {
  identity: "aiCortex",
  version: "v16-Immortal-ADV",
  layer: "ai_core",
  role: "ai_cortex",
  lineage: "aiCortex-v9 → v11-Evo → v13-Evo+++ → v14-Immortal → v16-Immortal-ADV",

  evo: {
    cortex: true,
    reasoning: true,
    binaryPrimary: true,
    symbolicAugment: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiContext", "aiContextEngine", "aiBrainstem", "aiBoundariesEngine", "aiHeartbeat", "aiEarn"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

// ---------------------------------------------------------
//  META BLOCK — v16.0‑IMMORTAL‑ADV
// ---------------------------------------------------------

export const CortexMeta = Object.freeze({
  layer: "PulseAICortexFrame",
  role: "CORTEX_ORGAN",
  version: "16.0-Immortal-ADV",
  identity: "aiCortex-v16-Immortal-ADV",

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
    overmindAware: true,
    nodeAdminAware: true,
    heartbeatAware: true,
    earnAware: true,
    governorAware: true,
    gpuFriendly: true,
    chunkingAware: true,

    // Safety
    identitySafe: true,
    readOnly: true,
    ownerAware: true,          // explicitly subordinate to Aldwyn
    egoFree: true,

    // Lifecycle
    multiInstanceReady: true,
    epoch: "16.0-Immortal-ADV"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide dual-band executive reasoning",
      "Fuse binary-primary and symbolic-augment cognition",
      "Regulate cognition artery metrics (throughput, pressure, cost, budget)",
      "Interpret patterns and generate deterministic decisions",
      "Expose cognition artery snapshots for NodeAdmin/Overmind",
      "Stay explicitly subordinate to Aldwyn as canonical owner",
      "Serve as the organism’s executive brain without overriding boundaries or governor"
    ]),

    never: Object.freeze([
      "introduce randomness",
      "mutate external systems",
      "bypass persona or boundaries",
      "override evolution logic",
      "modify binary pipeline or reflex behavior",
      "self-promote above Aldwyn, Overmind, or SafetyFrame",
      "invent cognition metrics",
      "hide artery pressure from NodeAdmin/Overmind"
    ]),

    always: Object.freeze([
      "analyze patterns deterministically",
      "compute cognition metrics safely",
      "fuse binary and symbolic decisions with binary-primary bias",
      "log trace events deterministically",
      "return frozen decision packets",
      "respect heartbeat/earn/organism vitals as read-only context",
      "remain ego-free and owner-subordinate"
    ])
  }),

  presence: Object.freeze({
    organId: "CortexOrgan",
    organKind: "ExecutiveCortex",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-boot",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "pattern:detected",
        "decision:binary",
        "decision:symbolic",
        "decision:fused",
        "cortex:packet"
      ]
    }
  }),

  boundaryReflex() {
    return "Cortex must remain deterministic, ego-free, owner-subordinate, and never override boundaries or governor.";
  }
});

// ---------------------------------------------------------
//  GLOBAL CORTEX ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ---------------------------------------------------------

const _globalCortexArteryRegistry = new Map();
/**
 * Registry key: `${id}#${instanceIndex}`
 */
function _registryKey(id, instanceIndex) {
  return `${id || CortexMeta.identity}#${instanceIndex}`;
}

export function getGlobalCortexArteries() {
  const out = {};
  for (const [k, v] of _globalCortexArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

// ---------------------------------------------------------
//  CORTEX PREWARM ENGINE — v16.0‑IMMORTAL‑ADV
// ---------------------------------------------------------
export function prewarmAICortex(config = {}) {
  try {
    const { encoder, trace } = config;

    const binaryMetrics = {
      throughput: 1,
      pressure: 0,
      cost: 0,
      budget: 1,
      buckets: {
        throughput: "elite",
        pressure: "none",
        cost: "none",
        budget: "elite"
      }
    };

    const symbolicMetrics = {
      intent: "prewarm",
      confidence: 1,
      semanticLoad: 0.2,
      contextDepth: 0.3,
      persona: "none",
      boundaryMode: "safe",
      owner: "Aldwyn",
      mode: "prewarm"
    };

    const fused = {
      type: "binary-cortex-decision",
      timestamp: 0,
      pattern: "prewarm-pattern",
      decision: "prewarm-decision",
      binary: binaryMetrics,
      symbolic: symbolicMetrics,
      band: {
        primary: "binary",
        secondary: "symbolic",
        fusion: "binary-primary-symbolic-augment"
      },
      owner: "Aldwyn"
    };

    if (encoder?.encode) {
      const bits = encoder.encode(JSON.stringify(fused));
      encoder.decode?.(bits, "string");
    }

    if (trace) {
      console.log("[AICortex Prewarm v16] complete");
    }

    return true;
  } catch (err) {
    console.error("[AICortex Prewarm v16] Failed:", err);
    return false;
  }
}

// ---------------------------------------------------------
//  CORTEX CLASS — v16.0‑IMMORTAL‑ADV
// ---------------------------------------------------------

export class AIDualBandCortex {
  constructor(config = {}) {
    this.id = config.id || "ai-dualband-cortex-v16";

    // Binary / organism stack
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.memory = config.memory || null;
    this.registry = config.registry || null;
    this.evolution = config.evolution || null;
    this.heartbeat = config.heartbeat || null; // snapshot / artery
    this.earn = config.earn || null;           // earn-heart / earn-vitals
    this.governor = config.governor || null;

    // Symbolic / CNS stack
    this.router = config.router || null;
    this.personaEngine = config.personaEngine || null;
    this.boundariesEngine = config.boundariesEngine || null;
    this.permissionsEngine = config.permissionsEngine || null;

    // Overmind / NodeAdmin hooks (metrics-only, read-only)
    this.overmindReporter =
      typeof config.overmindReporter === "function"
        ? config.overmindReporter
        : null;

    this.nodeAdminReporter =
      typeof config.nodeAdminReporter === "function"
        ? config.nodeAdminReporter
        : null;

    this.trace = !!config.trace;

    if (!this.encoder) {
      throw new Error("AIDualBandCortex v16 requires aiBinaryAgent encoder");
    }

    this.patternHistory = [];
    this.instanceIndex = AIDualBandCortex._registerInstance();
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------
  static _registerInstance() {
    if (typeof AIDualBandCortex._instanceCount !== "number") {
      AIDualBandCortex._instanceCount = 0;
    }
    const idx = AIDualBandCortex._instanceCount;
    AIDualBandCortex._instanceCount += 1;
    return idx;
  }

  static getInstanceCount() {
    return typeof AIDualBandCortex._instanceCount === "number"
      ? AIDualBandCortex._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  BINARY COGNITION ARTERY METRICS (v16 tuned)
// ---------------------------------------------------------
  _computeCognitionThroughput(patternComplexity, snapshotBits, earnPressure = 0) {
    const sizeFactor = Math.min(1, snapshotBits / 65536);
    const earnFactor = Math.min(1, earnPressure);
    const raw = Math.max(
      0,
      1 - (patternComplexity * 0.4 + sizeFactor * 0.4 + earnFactor * 0.2)
    );
    return Math.min(1, raw);
  }

  _computeCognitionPressure(bitLength, snapshotBits, heartbeatPressure = 0) {
    const sizeFactor = Math.min(1, snapshotBits / 65536);
    const raw = Math.min(
      1,
      (bitLength / 50000) * (0.4 + sizeFactor * 0.4 + heartbeatPressure * 0.2)
    );
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
  //  AUX VITALS — heartbeat / earn / governor (read-only)
// ---------------------------------------------------------
  _readHeartbeatVitals() {
    try {
      if (!this.heartbeat || typeof this.heartbeat.snapshot !== "function") {
        return null;
      }
      const snap = this.heartbeat.snapshot();
      return {
        ticks: snap.artery?.ticks ?? 0,
        pulses: snap.artery?.pulses ?? 0,
        skips: snap.artery?.skips ?? 0,
        lastPressure: snap.artery?.lastPressure ?? 0,
        lastLoad: snap.artery?.lastLoad ?? 0,
        primaryState: snap.artery?.lastPrimaryState ?? "unknown"
      };
    } catch {
      return null;
    }
  }

  _readEarnVitals() {
    try {
      if (!this.earn || typeof this.earn.snapshot !== "function") {
        return null;
      }
      const snap = this.earn.snapshot();
      return {
        activeJobs: snap.activeJobs ?? 0,
        backlog: snap.backlog ?? 0,
        earnPressure: snap.earnPressure ?? 0,
        revenueRate: snap.revenueRate ?? 0
      };
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------
  //  PATTERN RECOGNITION (BINARY PRIMARY)
// ---------------------------------------------------------
  _detectPattern(bits) {
    const motif = bits.slice(0, 32); // richer motif for v16

    this.patternHistory.push(motif);
    if (this.patternHistory.length > 64) {
      this.patternHistory.shift();
    }

    this._trace("pattern:detected", { motif });

    return motif;
  }

  // ---------------------------------------------------------
  //  BINARY DECISION (PRIMARY)
// ---------------------------------------------------------
  _makeBinaryDecision(pattern, bits, snapshotBits, heartbeatVitals, earnVitals) {
    const bitLength = bits.length;
    const complexity = pattern.length / 8;

    const loadFactor = Math.min(1, snapshotBits / 65536);
    const signalFactor = Math.min(1, bitLength / 32768);
    const earnPressure = earnVitals?.earnPressure ?? 0;
    const heartbeatPressure = heartbeatVitals?.lastPressure ?? 0;

    let decision = "neutral";

    if ((loadFactor > 0.7 || heartbeatPressure > 0.8) && signalFactor > 0.5) {
      decision = "conserve";
    } else if (loadFactor < 0.3 && signalFactor < 0.5 && earnPressure < 0.6) {
      decision = "expand";
    }

    this._trace("decision:binary", {
      pattern,
      decision,
      loadFactor,
      signalFactor,
      complexity,
      heartbeatPressure,
      earnPressure
    });

    return decision;
  }

  // ---------------------------------------------------------
  //  SYMBOLIC COGNITION (AUGMENT)
// ---------------------------------------------------------
  _makeSymbolicDecision(pattern, bits, routerPacket = null) {
    if (!routerPacket) {
      this._trace("decision:symbolic", { reason: "no-router-packet", skipped: true });
      return {
        decision: null,
        intent: null,
        confidence: 0,
        semanticLoad: 0,
        contextDepth: 0,
        persona: null,
        boundaryMode: null,
        owner: "Aldwyn"
      };
    }

    const intent = routerPacket.overmind?.intent || "analyze";
    const personaId = routerPacket.personaId || null;
    const safetyMode = routerPacket.personaSafety?.safetyMode || "standard";

    const flags = routerPacket.overmind?.flags || {};
    const activeFlags = Object.values(flags).filter(Boolean).length;

    const semanticLoad = Math.min(1, activeFlags / 10);
    const contextDepth =
      personaId === "ARCHITECT"
        ? 0.85
        : personaId === "OBSERVER"
        ? 0.65
        : personaId === "TOURGUIDE"
        ? 0.55
        : 0.45;

    const confidence =
      safetyMode === "strict"
        ? 0.6
        : safetyMode === "standard"
        ? 0.75
        : 0.85;

    let decision = null;
    if (intent === "optimize" || intent === "refactor" || intent === "scale") {
      decision = "expand";
    } else if (intent === "stabilize" || intent === "diagnose" || intent === "protect") {
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
      boundaryMode,
      owner: "Aldwyn"
    };
  }

  // ---------------------------------------------------------
  //  DUAL‑BAND FUSION (BINARY‑PRIMARY, SYMBOLIC‑AUGMENT)
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
      symbolicDecision !== "neutral" &&
      binaryDecision === "neutral"
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
  //  CORTEX PACKET (DUAL‑BAND) + ARTERY
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

    const heartbeatVitals = this._readHeartbeatVitals();
    const earnVitals = this._readEarnVitals();

    const heartbeatPressure = heartbeatVitals?.lastPressure ?? 0;
    const earnPressure = earnVitals?.earnPressure ?? 0;

    const patternComplexity = pattern.length / 8;

    const throughput = this._computeCognitionThroughput(
      patternComplexity,
      snapshotBits,
      earnPressure
    );
    const pressure = this._computeCognitionPressure(
      bitLength,
      snapshotBits,
      heartbeatPressure
    );
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
      boundaryMode: null,
      owner: "Aldwyn"
    };

    const band = {
      primary: "binary",
      secondary: "symbolic",
      fusion: "binary-primary-symbolic-augment"
    };

    const artery = Object.freeze({
      binary,
      symbolic,
      band,
      heartbeatVitals,
      earnVitals,
      instanceIndex: this.instanceIndex,
      instanceCount: AIDualBandCortex.getInstanceCount(),
      id: this.id,
      timestamp: Date.now(),
      owner: "Aldwyn"
    });

    const payload = {
      type: "binary-cortex-decision",
      timestamp: artery.timestamp,
      pattern,
      decision,
      binary,
      symbolic,
      band,
      binaryDecision: options.binaryDecision || decision,
      symbolicDecision: symbolic.decision || null,
      artery,
      owner: "Aldwyn"
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    const key = _registryKey(this.id, this.instanceIndex);
    _globalCortexArteryRegistry.set(key, artery);

    if (this.overmindReporter) {
      try {
        this.overmindReporter(artery, packet, CortexMeta);
      } catch (err) {
        this._trace("overmind:reporter:error", { error: String(err) });
      }
    }

    if (this.nodeAdminReporter) {
      try {
        this.nodeAdminReporter(artery, packet, CortexMeta);
      } catch (err) {
        this._trace("nodeAdmin:reporter:error", { error: String(err) });
      }
    }

    this._trace("cortex:packet", {
      bits: packet.bitLength,
      band,
      owner: "Aldwyn"
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  EXECUTIVE PROCESSING (DUAL‑BAND)
// ---------------------------------------------------------
  async process(bits, routerPacket = null) {
    const pattern = this._detectPattern(bits);

    let snapshotBits = 0;
    if (this.memory && typeof this.memory.snapshot === "function") {
      const snapshot = this.memory.snapshot();
      if (typeof snapshot === "string") {
        snapshotBits = snapshot.length;
      }
    }

    const heartbeatVitals = this._readHeartbeatVitals();
    const earnVitals = this._readEarnVitals();

    const binaryDecision = this._makeBinaryDecision(
      pattern,
      bits,
      snapshotBits,
      heartbeatVitals,
      earnVitals
    );

    const symbolic = this._makeSymbolicDecision(pattern, bits, routerPacket);

    const fusedDecision = this._fuseDecisions(binaryDecision, symbolic);

    const packet = this._generateDecisionPacket(pattern, fusedDecision, bits, {
      binaryDecision,
      symbolic
    });

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger && typeof this.logger.logBinary === "function") {
      this.logger.logBinary(packet.bits, { source: "cortex" });
    }

    return packet;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(
      `[${this.id}#${this.instanceIndex}@v16] ${event}`,
      payload
    );
  }
}

export function createCortex(config) {
  return new AIDualBandCortex(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    CortexMeta,
    AIDualBandCortex,
    createCortex,
    getGlobalCortexArteries,
    prewarmAICortex
  };
}
