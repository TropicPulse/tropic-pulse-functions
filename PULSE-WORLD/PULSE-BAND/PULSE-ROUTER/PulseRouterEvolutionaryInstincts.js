// ============================================================================
//  PULSE ROUTER EVOLUTIONARY INSTINCTS v12.3‑Evo‑DualStack — ROUTER EVOLUTION CORE
//  Adaptive Routing Identity • Genetic Route Memory • Best‑Path Preservation
//  Symbolic + Binary + Presence + CacheChunk Ancestry • Deterministic • Drift‑Proof
// ============================================================================
//
//  ROLE:
//    • Stores evolutionary routing memory (success/failure/degrade).
//    • Symbolic + Binary + Presence + CacheChunk dual‑stack ancestry.
//    • Deterministic scoring + regression detection.
//    • Loop‑Theory‑Aware.
//    • Pure memory organ — NO routing, NO compute, NO mutation outside instance.
//
// ============================================================================


// ------------------------------------------------------------
// v12.3‑Evo CONTEXT METADATA — Router Evolution Identity
// ------------------------------------------------------------
const ROUTER_EVOLUTION_CONTEXT = {
  layer: "PulseRouterEvolutionaryInstincts",
  role: "ROUTER_EVOLUTION_CORE",
  purpose: "Adaptive routing identity + genetic memory for symbolic + binary routes",
  context: "Stores best-known routes, lineage, stability, regression, binary + presence + cache ancestry",
  target: "dual-stack-router",
  version: 12.3,
  selfRepairable: true,

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    routingContract: "PulseSend-v11",
    routerOrganContract: "PulseRouter-v11",
    earnCompatibility: "Earn-v3",

    // ⭐ binary + presence + cache-aware instincts cortex
    binaryAware: true,
    presenceAware: true,
    cacheChunkAware: true,
    prewarmAware: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  }
};


// ------------------------------------------------------------
// Utility: stable JSON stringify
// ------------------------------------------------------------
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}


// ------------------------------------------------------------
// Utility: deterministic hash
// ------------------------------------------------------------
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ------------------------------------------------------------
// Symbolic ancestry helpers
// ------------------------------------------------------------
function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId
  };

  return simpleHash(stableStringify(shape));
}


// ------------------------------------------------------------
// Binary ancestry helpers (optional)
// ------------------------------------------------------------
function extractBinarySurface(payload = {}) {
  const binaryPattern  = payload.binaryPattern || null;
  const binaryMode     = payload.binaryMode || null;
  const binaryPayload  = payload.binaryPayload || null;
  const binaryHints    = payload.binaryHints || null;
  const binaryStrength = typeof payload.binaryStrength === "number"
    ? payload.binaryStrength
    : null;

  const hasBinary =
    !!binaryPattern ||
    !!binaryMode ||
    !!binaryPayload ||
    !!binaryHints ||
    binaryStrength !== null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength
  };
}


// ------------------------------------------------------------
// Presence / multi‑presence helpers
// ------------------------------------------------------------
function extractPresenceSurface(payload = {}) {
  const instanceId   = payload.instanceId || null;
  const presenceId   = payload.presenceId || null;
  const presenceRole = payload.presenceRole || null;
  const presenceGroupId = payload.presenceGroupId || null;
  const regionId     = payload.regionId || null;
  const hostName     = payload.hostName || null;

  const hasPresence =
    !!instanceId ||
    !!presenceId ||
    !!presenceRole ||
    !!presenceGroupId ||
    !!regionId ||
    !!hostName;

  return {
    hasPresence,
    instanceId,
    presenceId,
    presenceRole,
    presenceGroupId,
    regionId,
    hostName
  };
}


// ------------------------------------------------------------
// CacheChunk / prewarm helpers
// ------------------------------------------------------------
function extractCacheChunkSurface(payload = {}) {
  const cacheChunkId   = payload.cacheChunkId || null;
  const cacheTier      = payload.cacheTier || null;
  const prewarmKey     = payload.prewarmKey || null;
  const prewarmHint    = payload.prewarmHint || null;
  const cacheStrategy  = payload.cacheStrategy || null;
  const advantageField = payload.advantageField || null;

  const hasCacheChunk =
    !!cacheChunkId ||
    !!cacheTier ||
    !!prewarmKey ||
    !!prewarmHint ||
    !!cacheStrategy ||
    !!advantageField;

  return {
    hasCacheChunk,
    cacheChunkId,
    cacheTier,
    prewarmKey,
    prewarmHint,
    cacheStrategy,
    advantageField
  };
}


// ------------------------------------------------------------
// Route hash — Genetic Route Fingerprint (Symbolic + Binary + Presence + Cache)
// ------------------------------------------------------------
function computeRouteHash(routeShape, payload = {}) {
  const binary   = extractBinarySurface(payload);
  const presence = extractPresenceSurface(payload);
  const cache    = extractCacheChunkSurface(payload);

  const base = {
    routeShape,
    binary,
    presence,
    cache
  };

  return simpleHash(stableStringify(base));
}


// ------------------------------------------------------------
// Route scoring — Evolutionary Fitness Score
// ------------------------------------------------------------
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function scoreRoute(routeStats = {}) {
  const {
    successCount = 0,
    failureCount = 0,
    degradationEvents = 0
  } = routeStats;

  const s = clamp(successCount, 0, 100000);
  const f = clamp(failureCount, 0, 100000);
  const d = clamp(degradationEvents, 0, 100000);

  return clamp(s * 1.0 - f * 0.8 - d * 0.5, 0, 100000);
}


// ------------------------------------------------------------
// Regression detection — Evolutionary Delta
// ------------------------------------------------------------
function detectRegression(currentStats, baselineStats) {
  const currentScore = scoreRoute(currentStats);
  const baselineScore = scoreRoute(baselineStats);
  if (baselineScore === 0) return 0;
  return ((currentScore - baselineScore) / baselineScore) * 100;
}


// ------------------------------------------------------------
// Degradation tier helper
// ------------------------------------------------------------
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ------------------------------------------------------------
// Memory entry model — Evolutionary Route Record (DualStack + Presence + Cache)
// ------------------------------------------------------------
class PulseRouterEvolutionaryStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...ROUTER_EVOLUTION_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  recordRoute({ routeShape, routeStats, healthScore, pattern, lineage, pageId, payload }) {
    const routeHash = computeRouteHash(routeShape, payload || {});
    const score = scoreRoute(routeStats);

    const existing = this.entries.get(routeHash);

    const safePattern = typeof pattern === "string" ? pattern : "";
    const safeLineage = Array.isArray(lineage) ? lineage.slice() : [];
    const safePageId = pageId || "NO_PAGE";
    const safeHealth = typeof healthScore === "number" ? healthScore : 1.0;
    const tier = classifyDegradationTier(safeHealth);

    const patternAncestry = buildPatternAncestry(safePattern);
    const lineageSignature = buildLineageSignature(safeLineage);
    const pageAncestrySignature = buildPageAncestrySignature({
      pattern: safePattern,
      lineage: safeLineage,
      pageId: safePageId
    });

    const binary    = extractBinarySurface(payload || {});
    const presence  = extractPresenceSurface(payload || {});
    const cache     = extractCacheChunkSurface(payload || {});

    const loopTheory = {
      routingCompletion: true,
      allowLoopfieldPropulsion: true,
      pulseComputeContinuity: true,
      errorRouteAround: true
    };

    const baseEntry = {
      key: routeHash,
      routeShape: routeShape || {},
      bestStats: routeStats || {},
      bestScore: score,

      // symbolic ancestry
      pattern: safePattern,
      patternAncestry,
      lineage: safeLineage,
      lineageSignature,
      pageId: safePageId,
      pageAncestrySignature,

      // ⭐ binary ancestry
      binary,

      // ⭐ presence / multi‑presence surface
      presence,

      // ⭐ cacheChunk / prewarm surface
      cache,

      healthScore: safeHealth,
      tier,
      loopTheory,
      meta: { ...ROUTER_EVOLUTION_CONTEXT }
    };

    if (!existing || score > existing.bestScore) {
      this.entries.set(routeHash, baseEntry);
    } else {
      const merged = {
        ...existing,

        pattern: safePattern || existing.pattern,
        patternAncestry: patternAncestry.length ? patternAncestry : existing.patternAncestry,

        lineage: safeLineage.length ? safeLineage : existing.lineage,
        lineageSignature: lineageSignature || existing.lineageSignature,

        pageId: safePageId || existing.pageId,
        pageAncestrySignature: pageAncestrySignature || existing.pageAncestrySignature,

        // ⭐ always update binary surface
        binary,

        // ⭐ always update presence + cache surfaces
        presence,
        cache,

        healthScore: safeHealth,
        tier,
        loopTheory
      };

      this.entries.set(routeHash, merged);
    }

    return this.entries.get(routeHash);
  }

  getBestRoute(routeShape, payload = {}) {
    const routeHash = computeRouteHash(routeShape, payload || {});
    return this.entries.get(routeHash) || null;
  }

  getSnapshot() {
    const out = {};
    for (const [key, entry] of this.entries.entries()) {
      out[key] = {
        key: entry.key,
        bestScore: entry.bestScore,
        bestStats: entry.bestStats,

        // symbolic ancestry
        pattern: entry.pattern,
        patternAncestry: entry.patternAncestry.slice(),
        lineage: entry.lineage.slice(),
        lineageSignature: entry.lineageSignature,
        pageId: entry.pageId,
        pageAncestrySignature: entry.pageAncestrySignature,

        // ⭐ binary ancestry
        binary: { ...entry.binary },

        // ⭐ presence / multi‑presence snapshot
        presence: { ...entry.presence },

        // ⭐ cacheChunk / prewarm snapshot
        cache: { ...entry.cache },

        healthScore: entry.healthScore,
        tier: entry.tier,
        loopTheory: { ...entry.loopTheory }
      };
    }
    return out;
  }

  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }

  deserialize(jsonString) {
    this.entries.clear();
    if (!jsonString) return;

    let arr;
    try {
      arr = JSON.parse(jsonString);
    } catch {
      return;
    }

    if (!Array.isArray(arr)) return;

    arr.forEach((entry) => {
      if (!entry || typeof entry !== "object" || !entry.key) return;

      const safePattern = typeof entry.pattern === "string" ? entry.pattern : "";
      const safeLineage = Array.isArray(entry.lineage) ? entry.lineage.slice() : [];
      const safePageId = entry.pageId || "NO_PAGE";

      const patternAncestry = Array.isArray(entry.patternAncestry)
        ? entry.patternAncestry.slice()
        : buildPatternAncestry(safePattern);

      const lineageSignature =
        typeof entry.lineageSignature === "string"
          ? entry.lineageSignature
          : buildLineageSignature(safeLineage);

      const pageAncestrySignature =
        typeof entry.pageAncestrySignature === "string"
          ? entry.pageAncestrySignature
          : buildPageAncestrySignature({
              pattern: safePattern,
              lineage: safeLineage,
              pageId: safePageId
            });

      const binary =
        entry.binary && typeof entry.binary === "object"
          ? entry.binary
          : extractBinarySurface({});

      const presence =
        entry.presence && typeof entry.presence === "object"
          ? entry.presence
          : extractPresenceSurface({});

      const cache =
        entry.cache && typeof entry.cache === "object"
          ? entry.cache
          : extractCacheChunkSurface({});

      const healthScore =
        typeof entry.healthScore === "number" ? entry.healthScore : 1.0;

      const safeEntry = {
        key: entry.key,
        routeShape: entry.routeShape || {},
        bestStats: entry.bestStats || {},
        bestScore:
          typeof entry.bestScore === "number" ? entry.bestScore : 0,

        pattern: safePattern,
        patternAncestry,
        lineage: safeLineage,
        lineageSignature,
        pageId: safePageId,
        pageAncestrySignature,

        // ⭐ restore binary surface
        binary,

        // ⭐ restore presence + cache surfaces
        presence,
        cache,

        healthScore,
        tier: classifyDegradationTier(healthScore),

        loopTheory: {
          routingCompletion: true,
          allowLoopfieldPropulsion: true,
          pulseComputeContinuity: true,
          errorRouteAround: true
        },

        meta: { ...ROUTER_EVOLUTION_CONTEXT }
      };

      this.entries.set(safeEntry.key, safeEntry);
    });
  }
}


// ------------------------------------------------------------
// Public API wrapper — Evolution Core Surface
// ------------------------------------------------------------
class PulseRouterEvolutionaryInstincts {
  constructor() {
    this.store = new PulseRouterEvolutionaryStore();
    this.meta = { ...ROUTER_EVOLUTION_CONTEXT };
  }

  recordRoute(route) {
    return this.store.recordRoute(route);
  }

  getBestRoute(routeShape, payload) {
    return this.store.getBestRoute(routeShape, payload);
  }

  detectRegression(currentStats, baselineStats) {
    return detectRegression(currentStats, baselineStats);
  }

  scoreRoute(stats) {
    return scoreRoute(stats);
  }

  getSnapshot() {
    return this.store.getSnapshot();
  }

  serialize() {
    return this.store.serialize();
  }

  deserialize(jsonString) {
    this.store.deserialize(jsonString);
  }

  clear() {
    this.store.clear();
  }
}


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseRouterEvolutionaryInstincts,
  computeRouteHash,
  scoreRoute,
  detectRegression
};
