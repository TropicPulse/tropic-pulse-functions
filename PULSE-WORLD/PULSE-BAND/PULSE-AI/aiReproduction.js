/**
 * aiReproduction.js — Pulse OS v13.0‑PRESENCE‑EVO+++
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
 *     - presence-aware reproduction metrics (cluster, density, band mix)
 *     - route-aware metrics (castles, servers, corridors, route pressure)
 *     - NodeAdmin-aware metrics (mesh pressure, route pressure, reproduction priority)
 *     - NodeAdmin-reportable artery snapshots (via config hook)
 *
 *   It is the organism’s:
 *     • reproductive system
 *     • cloning engine
 *     • spawn factory
 *     • lineage multiplier
 *     • corridor / route reinforcement signaler (metrics-only)
 *
 *   v13.0‑PRESENCE‑EVO+++ UPGRADE:
 *     • Presence/Route/NodeAdmin context preserved (read-only, optional)
 *     • Global artery registry (read-only, metrics-only) for NodeAdmin/Overmind
 *     • Optional nodeAdminReporter hook (metrics-only, no behavior change)
 *     • Prewarm helper for artery metrics
 *     • No behavioral change inside reproduction (no auto-spawn decisions)
 *     • Still deterministic, drift-proof, non-blocking
 */

// ============================================================================
//  META BLOCK — v13.0‑PRESENCE‑EVO+++
// ============================================================================

export const ReproductionMeta = Object.freeze({
  layer: "BinaryOrganism",
  role: "BINARY_REPRODUCTION_ORGAN",
  version: "13.0-PRESENCE-EVO+++",
  identity: "aiBinaryReproduction-v13.0-PRESENCE-EVO+++",

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
    presenceAware: true,
    socialAware: true,
    routeAware: true,
    nodeAdminAware: true,
    arteryAware: true,
    cacheAware: true,
    prewarmReady: true,
    epoch: "13.0-PRESENCE-EVO+++"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic organism cloning, genome duplication, lineage-safe replication, and reproduction artery metrics v3 + presence/route/NodeAdmin-enriched metrics for the v13.0‑PRESENCE‑EVO+++ organism.",

    never: Object.freeze([
      "use randomness",
      "mutate external organs",
      "override genome logic",
      "override ancestry logic",
      "override evolution logic",
      "generate symbolic state",
      "block the organism",
      "perform cognition",
      "drive presence, route, or social behavior directly",
      "decide reproduction policy (NodeAdmin/Expansion/Castle own that)"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "duplicate genome deterministically",
      "emit binary-only reproduction packets",
      "record lineage deterministically",
      "compute reproduction artery metrics v3",
      "enrich metrics with presence/route/NodeAdmin context only (read-only)",
      "expose artery snapshots for NodeAdmin/Overmind via hooks/registry",
      "remain drift-proof",
      "remain deterministic",
      "remain non-blocking"
    ])
  })
});

// ============================================================================
//  GLOBAL ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ============================================================================

const _globalReproductionArteryRegistry = new Map();
/**
 * Registry key: `${slice}#${instanceIndex}`
 */
function _registryKey(slice, instanceIndex) {
  return `${slice || "default"}#${instanceIndex}`;
}

export function getGlobalReproductionArteries() {
  // shallow copy, read-only view
  const out = {};
  for (const [k, v] of _globalReproductionArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

export function prewarmReproductionArtery(slice = "default") {
  // no-op placeholder for now; kept for symmetry and future tuning
  // (you can call this to ensure the module is loaded and registry is live)
  return !!slice;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v13.0‑PRESENCE‑EVO+++
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
     *
     *   presence:
     *     presenceContextProvider → optional fn() => {
     *        clusterId?: string,
     *        presenceDensity?: number,        // 0..1
     *        bandMix?: { symbolic?: number, dual?: number, binary?: number },
     *        newCount?: number,
     *        veteranCount?: number,
     *        powerUserCount?: number
     *     }
     *
     *   routes (castles/servers/corridors):
     *     routeContextProvider → optional fn() => {
     *        weakSegments?: string[],         // route IDs / corridor IDs
     *        prioritySegments?: string[],     // high-value corridors
     *        corridorPressure?: number,       // 0..1
     *        castleLoad?: number,            // 0..1
     *        serverLoad?: number             // 0..1
     *     }
     *
     *   NodeAdmin:
     *     nodeAdminContextProvider → optional fn() => {
     *        meshPressure?: number,          // 0..1
     *        routePressure?: number,         // 0..1
     *        reproductionPriority?: number   // 0..1 (advisory)
     *     }
     *
     *     nodeAdminReporter → optional fn(artery, meta) => void
     *       - metrics-only, read-only
     *       - can forward artery to PulseNodeAdmin-v11-Evo or similar
     *       - no behavior change inside this organ
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

    // presence context provider (optional, read-only)
    this.presenceContextProvider =
      typeof config.presenceContextProvider === "function"
        ? config.presenceContextProvider
        : null;

    // route context provider (optional, read-only)
    this.routeContextProvider =
      typeof config.routeContextProvider === "function"
        ? config.routeContextProvider
        : null;

    // NodeAdmin context provider (optional, read-only)
    this.nodeAdminContextProvider =
      typeof config.nodeAdminContextProvider === "function"
        ? config.nodeAdminContextProvider
        : null;

    // NodeAdmin reporter hook (optional, metrics-only)
    this.nodeAdminReporter =
      typeof config.nodeAdminReporter === "function"
        ? config.nodeAdminReporter
        : null;

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
  //  CONTEXT PROVIDERS (PRESENCE / ROUTE / NODEADMIN)
  // ---------------------------------------------------------

  _safePresenceContext() {
    if (!this.presenceContextProvider) return null;

    try {
      const ctx = this.presenceContextProvider() || {};
      return {
        clusterId: typeof ctx.clusterId === "string" ? ctx.clusterId : null,
        presenceDensity: this._clamp01(ctx.presenceDensity),
        bandMix: {
          symbolic: this._clamp01(ctx.bandMix?.symbolic),
          dual: this._clamp01(ctx.bandMix?.dual),
          binary: this._clamp01(ctx.bandMix?.binary)
        },
        newCount: typeof ctx.newCount === "number" ? ctx.newCount : 0,
        veteranCount:
          typeof ctx.veteranCount === "number" ? ctx.veteranCount : 0,
        powerUserCount:
          typeof ctx.powerUserCount === "number" ? ctx.powerUserCount : 0
      };
    } catch (err) {
      this._trace("presence:context:error", { error: String(err) });
      return null;
    }
  }

  _safeRouteContext() {
    if (!this.routeContextProvider) return null;

    try {
      const ctx = this.routeContextProvider() || {};
      return {
        weakSegments: Array.isArray(ctx.weakSegments)
          ? ctx.weakSegments.slice(0, 32)
          : [],
        prioritySegments: Array.isArray(ctx.prioritySegments)
          ? ctx.prioritySegments.slice(0, 32)
          : [],
        corridorPressure: this._clamp01(ctx.corridorPressure),
        castleLoad: this._clamp01(ctx.castleLoad),
        serverLoad: this._clamp01(ctx.serverLoad)
      };
    } catch (err) {
      this._trace("route:context:error", { error: String(err) });
      return null;
    }
  }

  _safeNodeAdminContext() {
    if (!this.nodeAdminContextProvider) return null;

    try {
      const ctx = this.nodeAdminContextProvider() || {};
      return {
        meshPressure: this._clamp01(ctx.meshPressure),
        routePressure: this._clamp01(ctx.routePressure),
        reproductionPriority: this._clamp01(ctx.reproductionPriority)
      };
    } catch (err) {
      this._trace("nodeAdmin:context:error", { error: String(err) });
      return null;
    }
  }

  // ---------------------------------------------------------
  //  REPRODUCTION ARTERY METRICS v3 + PRESENCE/ROUTE/NODEADMIN
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

    const presenceCtx = this._safePresenceContext();
    const routeCtx = this._safeRouteContext();
    const nodeCtx = this._safeNodeAdminContext();

    // advisory hint for NodeAdmin / Expansion / Castle (metrics-only)
    let reproductionHint = "normal";
    if (nodeCtx && nodeCtx.reproductionPriority >= 0.7) {
      reproductionHint = "recommended";
    }
    if (routeCtx && routeCtx.corridorPressure >= 0.7) {
      reproductionHint = "recommended";
    }
    if (
      nodeCtx &&
      nodeCtx.reproductionPriority >= 0.9 &&
      routeCtx &&
      routeCtx.corridorPressure >= 0.8
    ) {
      reproductionHint = "urgent";
    }

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
      timestamp: now,

      reproductionHint, // advisory only, no behavior inside this organ

      // presence-enriched metrics (read-only, optional)
      presence: presenceCtx && {
        clusterId: presenceCtx.clusterId,
        presenceDensity: presenceCtx.presenceDensity,
        bandMix: presenceCtx.bandMix,
        newCount: presenceCtx.newCount,
        veteranCount: presenceCtx.veteranCount,
        powerUserCount: presenceCtx.powerUserCount
      },

      // route-enriched metrics (castles/servers/corridors)
      routes: routeCtx && {
        weakSegments: routeCtx.weakSegments,
        prioritySegments: routeCtx.prioritySegments,
        corridorPressure: routeCtx.corridorPressure,
        castleLoad: routeCtx.castleLoad,
        serverLoad: routeCtx.serverLoad
      },

      // NodeAdmin-enriched metrics
      nodeAdmin: nodeCtx && {
        meshPressure: nodeCtx.meshPressure,
        routePressure: nodeCtx.routePressure,
        reproductionPriority: nodeCtx.reproductionPriority
      }
    };

    // soft spiral detection (no blocking)
    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      this._warn("reproduction:spiral:detected", artery);
    }

    // update global registry (read-only for others)
    const key = _registryKey(this.slice, this.instanceIndex);
    _globalReproductionArteryRegistry.set(key, artery);

    // optional NodeAdmin reporter hook
    if (this.nodeAdminReporter) {
      try {
        this.nodeAdminReporter(artery, ReproductionMeta);
      } catch (err) {
        this._trace("nodeAdmin:reporter:error", { error: String(err) });
      }
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

  _clamp01(v) {
    const n = typeof v === "number" ? v : 0;
    if (n <= 0) return 0;
    if (n >= 1) return 1;
    return n;
  }

  // PUBLIC EXPORT
  getReproductionArtery() {
    return this._computeReproductionArtery();
  }

  getReproductionSnapshot() {
    return Object.freeze({
      meta: ReproductionMeta,
      artery: this._computeReproductionArtery()
    });
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
   * ReproductionHint is advisory for NodeAdmin/Expansion/Castle only.
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
   * NodeAdmin/Expansion/Castle can read reproductionHint to decide strategy.
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
//  FACTORY — v13.0‑PRESENCE‑EVO+++
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
    createAIBinaryReproduction,
    getGlobalReproductionArteries,
    prewarmReproductionArtery
  };
}
