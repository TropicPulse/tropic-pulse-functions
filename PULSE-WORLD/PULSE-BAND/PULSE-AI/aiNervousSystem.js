// ============================================================================
//  aiNervousSystem.js — Pulse OS v12.3-Presence Organ
//  Binary Nervous System • Routing Brainstem • Deterministic • Routing Artery
// ============================================================================

export const NervousSystemMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "BINARY_NERVOUS_SYSTEM",
  version: "12.3-Presence",
  identity: "aiBinaryNervousSystem-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    routingAware: true,
    immunityAware: true,
    anatomyAware: true,
    registryAware: true,

    dualband: true,        // ⭐ NEW
    packetAware: true,     // ⭐ NEW
    windowAware: true,     // ⭐ NEW (safe routing snapshots)
    bluetoothReady: true,  // ⭐ placeholder
    arteryAware: true,     // ⭐ NEW
    prewarmAware: true,    // ⭐ NEW

    multiInstanceReady: true,
    epoch: "v12.3-Presence"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic routing of binary signals between organs using anatomy, immunity, and registry data.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "perform cognition",
      "interpret symbolic state",
      "override pipeline or reflex engines"
    ]),

    always: Object.freeze([
      "route signals deterministically",
      "respect immunity quarantine",
      "respect anatomy topology",
      "encode routing packets in binary",
      "remain pure and minimal"
    ])
  })
});

// ============================================================================
//  PREWARM — v11.3‑EVO
// ============================================================================
export function prewarmAIBinaryNervousSystem({ trace = false } = {}) {
  const packet = Object.freeze({
    type: "binary-routing-prewarm",
    meta: NervousSystemMeta,
    epoch: NervousSystemMeta.evo.epoch,
    message: "Nervous system prewarmed and routing artery aligned."
  });

  if (trace) console.log("[AIBinaryNervousSystem] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIBinaryNervousSystem {
  constructor(config = {}) {
    this.id = config.id || NervousSystemMeta.identity;
    this.encoder = config.encoder;
    this.anatomy = config.anatomy;
    this.immunity = config.immunity;
    this.registry = config.registry;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinaryNervousSystem requires aiBinaryAgent encoder");
    if (!this.anatomy?.topology?.get) throw new Error("AIBinaryNervousSystem requires aiBinaryAnatomy with topology Map");
    if (!this.immunity?.sanitize || !this.immunity.quarantined) throw new Error("AIBinaryNervousSystem requires aiBinaryImmunity");
    if (!this.registry) throw new Error("AIBinaryNervousSystem requires aiBinaryOrganRegistry");

    this.organs = new Map();

    // Window‑safe routing artery snapshot
    this.routingArtery = {
      throughput: 0,
      pressure: 0,
      cost: 0,
      budget: 1,
      lastTargets: [],
      lastSource: null,
      snapshot: () =>
        Object.freeze({
          throughput: this.routingArtery.throughput,
          pressure: this.routingArtery.pressure,
          cost: this.routingArtery.cost,
          budget: this.routingArtery.budget,
          lastTargets: this.routingArtery.lastTargets,
          lastSource: this.routingArtery.lastSource
        })
    };
  }

  // ---------------------------------------------------------
  //  ROUTING ARTERY METRICS
  // ---------------------------------------------------------
  _computeRoutingThroughput(targetCount, bitLength) {
    const loadFactor = Math.min(1, targetCount / 10);
    const sizeFactor = Math.min(1, bitLength / 50000);
    return Math.max(0, Math.min(1, 1 - (loadFactor * 0.5 + sizeFactor * 0.5)));
  }

  _computeRoutingPressure(targetCount, bitLength) {
    return Math.max(0, Math.min(1, (targetCount * bitLength) / 200000));
  }

  _computeRoutingCost(pressure, throughput) {
    return Math.max(0, Math.min(1, pressure * (1 - throughput)));
  }

  _computeRoutingBudget(throughput, cost) {
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

  // ---------------------------------------------------------
  //  ORGAN REGISTRATION
  // ---------------------------------------------------------
  registerOrgan(organId, organInstance) {
    this.organs.set(organId, organInstance);
    this._trace("organ:registered", { organId });
  }

  // ---------------------------------------------------------
  //  TARGET RESOLUTION
  // ---------------------------------------------------------
  _determineTargets(sourceId) {
    const topo = this.anatomy.topology.get(sourceId);
    if (!topo) return [];

    const outputs = topo.outputs || [];
    const bidirectional = topo.bidirectional || [];

    const targets = [...outputs, ...bidirectional].filter(
      (id) => !this.immunity.quarantined.has(id)
    );

    this._trace("routing:targets", { sourceId, targets });
    return targets;
  }

  // ---------------------------------------------------------
  //  ROUTING PACKET
  // ---------------------------------------------------------
  _generateRoutingPacket(sourceId, targets, bits) {
    const bitLength = bits.length;

    const throughput = this._computeRoutingThroughput(targets.length, bitLength);
    const pressure = this._computeRoutingPressure(targets.length, bitLength);
    const cost = this._computeRoutingCost(pressure, throughput);
    const budget = this._computeRoutingBudget(throughput, cost);

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
      type: "binary-routing",
      timestamp: Date.now(),
      source: sourceId,
      targets,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length
    };

    // Update artery snapshot
    this.routingArtery.throughput = throughput;
    this.routingArtery.pressure = pressure;
    this.routingArtery.cost = cost;
    this.routingArtery.budget = budget;
    this.routingArtery.lastTargets = targets;
    this.routingArtery.lastSource = sourceId;

    this._trace("routing:packet", { bits: packet.bitLength });
    return packet;
  }

  // ---------------------------------------------------------
  //  SIGNAL PROPAGATION
  // ---------------------------------------------------------
  propagate(sourceId, bits) {
    if (typeof bits !== "string") return;

    const safe = this.immunity.sanitize(bits);
    if (safe !== true) return;

    const targets = this._determineTargets(sourceId);
    const routingPacket = this._generateRoutingPacket(sourceId, targets, bits);

    if (this.logger?.logBinary) {
      this.logger.logBinary(routingPacket.bits, {
        source: "nervous-system",
        from: sourceId,
        targets
      });
    }

    for (const targetId of targets) {
      const organ = this.organs.get(targetId);
      if (!organ) continue;

      if (typeof organ.run === "function") {
        organ.run(bits);
      } else if (typeof organ.handle === "function") {
        organ.handle(bits);
      }

      this._trace("routing:delivered", { sourceId, targetId });
    }

    return routingPacket;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryNervousSystem(config) {
  return new AIBinaryNervousSystem(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryNervousSystem,
    createAIBinaryNervousSystem,
    NervousSystemMeta,
    prewarmAIBinaryNervousSystem
  };
}
