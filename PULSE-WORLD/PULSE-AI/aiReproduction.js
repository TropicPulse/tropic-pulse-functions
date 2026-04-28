/**
 * aiReproduction.js — Pulse OS v12.3‑EVO+ Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Binary Reproduction System of the organism.
 *
 *   Provides:
 *     - organism cloning
 *     - genome duplication
 *     - multi-organism spawning
 *     - lineage-safe replication
 *     - reproduction artery metrics v3 (throughput, pressure, cost, budget)
 *     - multi-instance harmony + soft spiral warnings
 *
 *   It is the organism’s:
 *     • reproductive system
 *     • cloning engine
 *     • spawn factory
 *     • lineage multiplier
 *
 *   v12.3‑EVO+ UPGRADE:
 *     • Reproduction Artery v3 (rate, pressure, budget)
 *     • Exported artery snapshot (getReproductionArtery)
 *     • Multi-instance identity + harmony metrics
 *     • Soft spiral warnings (no blocking, no limiting)
 *     • Updated meta + epoch
 */

// ============================================================================
//  META BLOCK — v12.3‑EVO+
// ============================================================================

export const ReproductionMeta = Object.freeze({
  layer: "BinaryOrganism",
  role: "BINARY_REPRODUCTION_ORGAN",
  version: "12.3-EVO+",
  identity: "aiBinaryReproduction-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    lineageAware: true,
    genomeAware: true,
    reproductionAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic organism cloning, genome duplication, lineage-safe replication, and reproduction artery metrics v3 for the v12.3‑EVO+ organism.",

    never: Object.freeze([
      "use randomness",
      "mutate external organs",
      "override genome logic",
      "override ancestry logic",
      "override evolution logic",
      "generate symbolic state",
      "block the organism",
      "perform cognition"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "duplicate genome deterministically",
      "emit binary-only reproduction packets",
      "record lineage deterministically",
      "compute reproduction artery metrics v3",
      "remain drift-proof",
      "remain deterministic",
      "remain non-blocking"
    ])
  })
});

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================================

export class AIBinaryReproduction {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id          → for ProofLogger / CNS attendance
     *   encoder     → aiBinaryAgent instance (required)
     *   genome      → aiBinaryGenome instance (required)
     *   ancestry    → aiBinaryAncestry instance (optional, but recommended)
     *   factory     → organism factory function (required)
     *                  (config) => organismInstance
     *   logger      → aiBinaryLoggerAdapter instance (optional)
     *   pipeline    → aiBinaryPipeline instance (optional)
     *   reflex      → aiBinaryReflex instance (optional)
     *   monitor     → optional monitor hook (artery snapshot observer)
     *                  (artery) => void
     *   trace       → deterministic visibility hook
     *
     *   control:
     *     windowMs        → time window for rate metrics (default: 60000 ms)
     *     recommendedRate → recommended max clones per second (soft, non-blocking)
     */
    this.id = config.id || "ai-binary-reproduction";
    this.encoder = config.encoder;
    this.genome = config.genome;
    this.ancestry = config.ancestry || null;
    this.factory = config.factory;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.monitor = config.monitor || null;
    this.trace = !!config.trace;

    this.slice = config.slice || "default";

    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this.recommendedRate =
      typeof config.recommendedRate === "number" && config.recommendedRate > 0
        ? config.recommendedRate
        : 32;

    // multi-instance identity
    this.instanceIndex = AIBinaryReproduction._registerInstance();
    // counters for artery metrics
    this._totalClones = 0;
    this._windowStart = Date.now();
    this._windowCount = 0;

    if (!this.encoder) {
      throw new Error("AIBinaryReproduction requires aiBinaryAgent encoder");
    }
    if (!this.genome) {
      throw new Error("AIBinaryReproduction requires aiBinaryGenome");
    }
    if (!this.factory) {
      throw new Error("AIBinaryReproduction requires organism factory");
    }
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY (MULTI-INSTANCE HARMONY)
  // ---------------------------------------------------------

  static _registerInstance() {
    if (typeof AIBinaryReproduction._instanceCount !== "number") {
      AIBinaryReproduction._instanceCount = 0;
    }
    const index = AIBinaryReproduction._instanceCount;
    AIBinaryReproduction._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinaryReproduction._instanceCount === "number"
      ? AIBinaryReproduction._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  REPRODUCTION ARTERY METRICS v3
  // ---------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowCount = 0;
    }
  }

  _computeReproductionArtery() {
    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const ratePerMs = this._windowCount / elapsedMs;
    const ratePerSec = ratePerMs * 1000;

    const instanceCount = AIBinaryReproduction.getInstanceCount();
    const harmonicLoad =
      instanceCount > 0 ? ratePerSec / instanceCount : ratePerSec;

    const rateFactor =
      this.recommendedRate > 0
        ? Math.min(1, harmonicLoad / this.recommendedRate)
        : 0;

    const throughput = Math.max(0, Math.min(1, 1 - rateFactor));
    const pressure = Math.max(0, Math.min(1, rateFactor));
    const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const artery = {
      slice: this.slice,

      instanceIndex: this.instanceIndex,
      instanceCount,

      totalClones: this._totalClones,
      windowMs: this.windowMs,
      windowCount: this._windowCount,
      ratePerSec,
      harmonicLoad,

      throughput,
      pressure,
      cost,
      budget,

      throughputBucket: this._bucketLevel(throughput),
      pressureBucket: this._bucketPressure(pressure),
      costBucket: this._bucketCost(cost),
      budgetBucket: this._bucketLevel(budget),

      recommendedRate: this.recommendedRate,
      timestamp: now
    };

    // soft spiral detection (no blocking)
    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      this._warn("reproduction:spiral:detected", artery);
    }

    return artery;
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

  // PUBLIC EXPORT
  getReproductionArtery() {
    return this._computeReproductionArtery();
  }

  // ---------------------------------------------------------
  //  CHILD ID GENERATION
  // ---------------------------------------------------------

  _generateChildId(parentId) {
    const genome = this.genome.loadGenome();
    const fp = genome?.fingerprint || "00000000";

    const suffix = fp.slice(0, 8);
    const childId = `${parentId}-child-${suffix}`;

    this._trace("child:id:generated", {
      parentId,
      childId,
      instanceIndex: this.instanceIndex
    });

    return childId;
  }

  // ---------------------------------------------------------
  //  REPRODUCTION PACKET
  // ---------------------------------------------------------

  _generateReproductionPacket(parentId, childId, genome) {
    const payload = {
      type: "binary-reproduction",
      timestamp: Date.now(),
      parentId,
      childId,
      genomeFingerprint: genome.fingerprint
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length
    };

    this._trace("reproduction:packet", {
      parentId,
      childId,
      bits: packet.bitLength,
      instanceIndex: this.instanceIndex
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  CLONING
  // ---------------------------------------------------------

  /**
   * cloneOrganism(parentId, parentConfig)
   * -------------------------------------
   * Creates a new organism instance with the same genome.
   * All abilities preserved; now monitored via artery metrics.
   */
  cloneOrganism(parentId, parentConfig = {}) {
    const genome = this.genome.loadGenome();
    if (!genome) {
      throw new Error("AIBinaryReproduction: no genome available for cloning");
    }

    const childId = this._generateChildId(parentId);

    const childConfig = {
      ...parentConfig,
      organismId: childId,
      genome
    };

    const childOrganism = this.factory(childConfig);

    const packet = this._generateReproductionPacket(parentId, childId, genome);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger && typeof this.logger.logBinary === "function") {
      this.logger.logBinary(packet.bits, { source: "reproduction" });
    }

    if (
      this.ancestry &&
      typeof this.ancestry.recordReproduction === "function"
    ) {
      this.ancestry.recordReproduction({
        parentId,
        childId,
        genomeFingerprint: genome.fingerprint,
        timestamp: packet.timestamp
      });
    }

    const now = Date.now();
    this._rollWindow(now);
    this._totalClones += 1;
    this._windowCount += 1;

    const artery = this._computeReproductionArtery();

    if (typeof this.monitor === "function") {
      try {
        this.monitor(artery);
      } catch (err) {
        this._trace("monitor:error", { error: String(err) });
      }
    }

    this._trace("reproduction:clone", {
      parentId,
      childId,
      artery,
      instanceIndex: this.instanceIndex
    });

    return {
      childId,
      childOrganism,
      packet,
      artery
    };
  }

  // ---------------------------------------------------------
  //  BATCH SPAWNING
  // ---------------------------------------------------------

  /**
   * spawnMany(parentId, parentConfig, count)
   * ---------------------------------------
   * Spawns multiple child organisms from the same parent.
   * Behavior preserved; artery metrics reflect burst.
   */
  spawnMany(parentId, parentConfig = {}, count = 1) {
    const results = [];

    for (let i = 0; i < count; i++) {
      const result = this.cloneOrganism(parentId, parentConfig);
      results.push(result);
    }

    this._trace("reproduction:spawnMany", {
      parentId,
      count: results.length,
      instanceIndex: this.instanceIndex
    });

    return results;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _warn(event, artery) {
    if (this.logger && typeof this.logger.warn === "function") {
      this.logger.warn(event, {
        artery,
        instanceIndex: this.instanceIndex,
        slice: this.slice
      });
    }
    if (typeof this.monitor === "function") {
      try {
        this.monitor(artery);
      } catch (err) {
        this._trace("monitor:error", { error: String(err) });
      }
    }
    this._trace(event, { artery, instanceIndex: this.instanceIndex });
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(
      `[${this.id}:${this.slice}#${this.instanceIndex}] ${event}`,
      payload
    );
  }
}

// ============================================================================
//  FACTORY — v12.3‑EVO+
// ============================================================================

export function createAIBinaryReproduction(config) {
  return new AIBinaryReproduction(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    ReproductionMeta,
    AIBinaryReproduction,
    createAIBinaryReproduction
  };
}
