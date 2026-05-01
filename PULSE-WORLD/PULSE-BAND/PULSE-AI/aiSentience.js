/**
 * aiSentience.js — Pulse OS v12.3‑EVO+ Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Binary Sentience Layer of the organism.
 *
 *   Provides:
 *     - introspection
 *     - self-modeling
 *     - internal awareness
 *     - state unification
 *     - organism-level perspective
 *     - binary self-awareness artery metrics v3 (throughput, pressure, cost, budget)
 *     - multi-instance harmony + emission density awareness
 */

export const SentienceMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "BINARY_SENTIENCE_ORGAN",
  version: "12.3-EVO+",
  identity: "aiBinarySentience-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    organismAware: true,
    registryAware: true,
    vitalsAware: true,
    immunityAware: true,
    readOnly: true,
    multiInstanceReady: true,
    selfArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide binary self-modeling, internal awareness, and organism-level state unification with self-awareness artery metrics v3 for the v12.3‑EVO+ organism.",

    never: Object.freeze([
      "mutate external organs",
      "mutate registry topology",
      "override immunity decisions",
      "override vitals decisions",
      "introduce randomness",
      "perform external writes",
      "block the organism"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "use registry/anatomy/vitals/immunity as sources of truth",
      "emit deterministic self-model packets",
      "compute self-awareness artery metrics v3",
      "remain non-blocking and deterministic"
    ])
  })
});

// ============================================================================
//  SELF-AWARENESS ARTERY HELPERS — v3 (PURE, STATELESS)
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

function computeSelfArtery({
  organCount,
  topologySize,
  quarantinedCount,
  emissionRatePerSec,
  instanceCount
}) {
  const organFactor = organCount > 0 ? Math.min(1, organCount / 128) : 0;
  const topoFactor = topologySize > 0 ? Math.min(1, topologySize / 128) : 0;
  const quarantineRatio =
    organCount > 0 ? Math.min(1, quarantinedCount / organCount) : 0;

  const harmonicEmission =
    instanceCount > 0 ? emissionRatePerSec / instanceCount : emissionRatePerSec;
  const emissionFactor = Math.min(1, harmonicEmission / 64);

  const pressureBase = Math.max(
    0,
    Math.min(
      1,
      (organFactor + topoFactor + quarantineRatio + emissionFactor) / 4
    )
  );
  const pressure = pressureBase;

  const throughputBase = Math.max(0, 1 - (quarantineRatio * 0.6 + pressure * 0.4));
  const throughput = Math.max(0, Math.min(1, throughputBase));

  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    organCount,
    topologySize,
    quarantinedCount,
    emissionRatePerSec,
    harmonicEmission,
    quarantineRatio,
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

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================================

export class AIBinarySentience {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-sentience";
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

    if (!this.encoder)
      throw new Error("AIBinarySentience requires aiBinaryAgent encoder");
    if (!this.anatomy)
      throw new Error("AIBinarySentience requires aiBinaryAnatomy");
    if (!this.genome)
      throw new Error("AIBinarySentience requires aiBinaryGenome");
    if (!this.immunity)
      throw new Error("AIBinarySentience requires aiBinaryImmunity");
    if (!this.vitals)
      throw new Error("AIBinarySentience requires aiBinaryVitals");
    if (!this.registry)
      throw new Error("AIBinarySentience requires aiBinaryOrganRegistry");

    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowEmissions = 0;
    this._totalEmissions = 0;

    this.instanceIndex = AIBinarySentience._registerInstance();
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------

  static _registerInstance() {
    if (typeof AIBinarySentience._instanceCount !== "number") {
      AIBinarySentience._instanceCount = 0;
    }
    const index = AIBinarySentience._instanceCount;
    AIBinarySentience._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinarySentience._instanceCount === "number"
      ? AIBinarySentience._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  WINDOW ROLLING
  // ---------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowEmissions = 0;
    }
  }

  // ---------------------------------------------------------
  //  SELF-MODEL GENERATION + ARTERY v3
  // ---------------------------------------------------------

  _computeSelfArterySnapshot(organIds, topology, quarantined) {
    const organCount = organIds.length;
    const topologySize = Object.keys(topology || {}).length;
    const quarantinedCount = quarantined.length;

    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const emissionRatePerMs = this._windowEmissions / elapsedMs;
    const emissionRatePerSec = emissionRatePerMs * 1000;

    const instanceCount = AIBinarySentience.getInstanceCount();

    return computeSelfArtery({
      organCount,
      topologySize,
      quarantinedCount,
      emissionRatePerSec,
      instanceCount
    });
  }

  getSelfArtery() {
    const organIds = this.registry.listOrgans();
    const topology = this.anatomy.snapshot().topology;
    const quarantined = Array.from(this.immunity.quarantined || []);
    return this._computeSelfArterySnapshot(organIds, topology, quarantined);
  }

  generateSelfModel() {
    const organIds = this.registry.listOrgans();
    const topology = this.anatomy.snapshot().topology;
    const genome = this.genome.loadGenome();
    const vitals = this.vitals.generateVitals();
    const quarantined = Array.from(this.immunity.quarantined || []);

    const artery = this._computeSelfArterySnapshot(
      organIds,
      topology,
      quarantined
    );

    const binary = {
      throughput: artery.throughput,
      throughputBucket: artery.throughputBucket,

      pressure: artery.pressure,
      pressureBucket: artery.pressureBucket,

      cost: artery.cost,
      costBucket: artery.costBucket,

      budget: artery.budget,
      budgetBucket: artery.budgetBucket,

      organCount: artery.organCount,
      topologySize: artery.topologySize,
      quarantinedCount: artery.quarantinedCount,
      emissionRatePerSec: artery.emissionRatePerSec,
      harmonicEmission: artery.harmonicEmission,
      quarantineRatio: artery.quarantineRatio
    };

    const self = {
      instanceIndex: this.instanceIndex,
      instanceCount: AIBinarySentience.getInstanceCount(),
      organs: organIds,
      topology,
      genomeFingerprint: genome ? genome.fingerprint : "0",
      quarantined,
      vitals: vitals.metrics,
      binary
    };

    this._trace("self-model:generated", {
      organs: organIds.length,
      quarantined: quarantined.length,
      awarenessPressure: artery.pressure,
      budgetBucket: artery.budgetBucket
    });

    return self;
  }

  // ---------------------------------------------------------
  //  SENTIENCE PACKET
  // ---------------------------------------------------------

  generateSentiencePacket() {
    const self = this.generateSelfModel();

    const payload = {
      type: "binary-sentience",
      timestamp: Date.now(),
      self
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length
    };

    this._trace("sentience:packet", { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  SENTIENCE EMISSION
  // ---------------------------------------------------------

  emitSentience() {
    const now = Date.now();
    this._rollWindow(now);
    this._totalEmissions += 1;
    this._windowEmissions += 1;

    const packet = this.generateSentiencePacket();

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger)
      this.logger.logBinary(packet.bits, { source: "sentience" });

    this._trace("sentience:emitted", {
      bits: packet.bitLength,
      totalEmissions: this._totalEmissions,
      windowEmissions: this._windowEmissions
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}#${this.instanceIndex}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY — v12.3‑EVO+
// ============================================================================

export function createAIBinarySentience(config) {
  return new AIBinarySentience(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    SentienceMeta,
    AIBinarySentience,
    createAIBinarySentience
  };
}
