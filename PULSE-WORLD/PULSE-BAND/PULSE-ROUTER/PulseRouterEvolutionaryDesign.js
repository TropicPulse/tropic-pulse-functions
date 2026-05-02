// ============================================================================
//  PulseRouterEvolutionaryDesign-v12.3-Evo-DualStack-AdvMultiPresence
//  ROUTER DESIGN CORTEX (Symbolic + Binary + Advantage + Prewarm/Cache/Chunk/Multi‑Presence)
//  Deterministic Architectural Memory • Drift‑Proof • Pure Memory Organ
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterEvolutionaryDesign",
  version: "v14.4-EVO-DESIGN",
  layer: "frontend",
  role: "router_design_cortex",
  lineage: "PulseOS-v12",

  evo: {
    designCore: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    longTermMemory: true,
    lineageAware: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterEvolutionaryInstincts",
      "PulseRouterEvolutionaryThought"
    ],
    never: [
      "legacyRouterDesign",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ------------------------------------------------------------
// v12.3‑Evo CONTEXT METADATA — Router Design Identity
// ------------------------------------------------------------
const ROUTER_DESIGN_CONTEXT = {
  layer: "PulseRouterEvolutionaryDesign",
  role: "ROUTER_DESIGN_CORTEX",
  purpose: "Long‑term architectural memory for route design blueprints",
  context:
    "Stores route design intent, lineage, constraints, evolution, binary metadata, multi‑presence + prewarm/cache/chunk hints",
  target: "dual-stack-router",
  version: "12.3",
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

    binaryAware: true,

    // 12.3+: full advantage + prewarm/cache/chunk/multi‑presence
    advantageFieldAware: true,
    prewarmAware: true,
    cacheAware: true,
    chunkAware: true,
    presenceAware: true,
    multiPresenceAware: true
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
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map(
    (k) => JSON.stringify(k) + ":" + stableStringify(value[k])
  );
  return "{" + parts.join(",") + "}";
}


// ------------------------------------------------------------
// Utility: deterministic hash
// ------------------------------------------------------------
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
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
// Design hash — Architectural Fingerprint
// ------------------------------------------------------------
function computeDesignHash(design) {
  const serialized = stableStringify(design || {});
  return simpleHash(serialized);
}


// ------------------------------------------------------------
// Design scoring — Structural Fitness Score
// ------------------------------------------------------------
function scoreDesign(designStats = {}) {
  const {
    stability = 1.0,
    clarity = 1.0,
    lineageStrength = 1.0
  } = designStats;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const s = clamp01(stability);
  const c = clamp01(clarity);
  const l = clamp01(lineageStrength);

  return s * 0.5 + c * 0.3 + l * 0.2;
}


// ------------------------------------------------------------
// Advantage field — unified design advantage
// ------------------------------------------------------------
function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function computeDesignAdvantageField(designStats = {}, binarySurface = {}) {
  if (typeof designStats.advantageField === "number") {
    return clamp01(designStats.advantageField);
  }

  const stability = typeof designStats.stability === "number"
    ? clamp01(designStats.stability)
    : 1.0;

  const clarity = typeof designStats.clarity === "number"
    ? clamp01(designStats.clarity)
    : 1.0;

  const lineageStrength = typeof designStats.lineageStrength === "number"
    ? clamp01(designStats.lineageStrength)
    : 1.0;

  const binaryStrength =
    typeof binarySurface.binaryStrength === "number"
      ? clamp01(binarySurface.binaryStrength)
      : (binarySurface.hasBinary ? 0.75 : 0.5);

  const base = stability * 0.4 + clarity * 0.3 + lineageStrength * 0.3;
  const adv = base * 0.8 + binaryStrength * 0.2;
  return clamp01(adv);
}


// ------------------------------------------------------------
// Prewarm / Cache / Chunk / Presence design hints (single + multi)
// ------------------------------------------------------------
function buildPrewarmDesign({ pattern, binary, advantageField }) {
  return {
    enabled: true,
    strategy: binary.hasBinary ? "binary-primed-prewarm" : "symbolic-prewarm",
    pattern,
    advantageField,
    binaryAware: binary.hasBinary
  };
}

function buildCacheDesign({ pattern, binary, advantageField }) {
  return {
    enabled: true,
    strategy: binary.hasBinary ? "binary-hot-cache-design" : "symbolic-hot-cache-design",
    tiers: ["L1-route", "L2-organ", "L3-world"],
    pattern,
    advantageField,
    binaryAware: binary.hasBinary
  };
}

function buildChunkDesign({ pattern, binary, advantageField }) {
  return {
    enabled: true,
    strategy: "router-chunk-design-hints",
    lanes: [
      "symbolic-route-plan",
      "binary-lane-hints",
      "presence-surface",
      "advantage-field"
    ],
    pattern,
    advantageField,
    hints: {
      binaryLanePriority: binary.hasBinary ? "elevated" : "normal"
    },
    binaryAware: binary.hasBinary
  };
}

function buildPresenceDesign({ pattern, pageId, binary, advantageField }) {
  return {
    enabled: true,
    strategy: "router-presence-design",
    pattern,
    pageId,
    advantageField,
    binarySignal:
      binary.hasBinary ? (binary.binaryMode || "binary-present") : "none",
    binaryAware: binary.hasBinary
  };
}

// 12.3+: multi‑presence profiles (per‑route, per‑page, per‑mode)
function buildMultiPresenceProfiles({ pattern, pageId, binary, advantageField }) {
  const baseId = `${pattern || "NO_PATTERN"}::${pageId || "NO_PAGE"}`;

  const mkProfile = (kind, extra = {}) => ({
    id: simpleHash(`${baseId}::${kind}`),
    kind,
    pattern,
    pageId,
    advantageField,
    binaryAware: binary.hasBinary,
    binaryMode: binary.binaryMode || null,
    ...extra
  });

  return [
    mkProfile("foreground", {
      priority: "high",
      cacheTier: "L1-route",
      chunkLane: "presence-surface"
    }),
    mkProfile("background", {
      priority: "medium",
      cacheTier: "L2-organ",
      chunkLane: "advantage-field"
    }),
    mkProfile("standby", {
      priority: "low",
      cacheTier: "L3-world",
      chunkLane: "binary-lane-hints"
    })
  ];
}


// ------------------------------------------------------------
// Memory entry model — Architectural Design Record (DualStack)
// ------------------------------------------------------------
class PulseRouterDesignStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...ROUTER_DESIGN_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  recordDesign({ routeId, design, designStats, pattern, lineage, pageId, payload }) {
    const designHash = computeDesignHash(design);
    const score = scoreDesign(designStats || {});

    const existing = this.entries.get(routeId);

    const safePattern = typeof pattern === "string" ? pattern : "";
    const safeLineage = Array.isArray(lineage) ? lineage.slice() : [];
    const safePageId = pageId || "NO_PAGE";

    const patternAncestry = buildPatternAncestry(safePattern);
    const lineageSignature = buildLineageSignature(safeLineage);
    const pageAncestrySignature = buildPageAncestrySignature({
      pattern: safePattern,
      lineage: safeLineage,
      pageId: safePageId
    });

    const binary = extractBinarySurface(payload || {});
    const advantageField = computeDesignAdvantageField(designStats || {}, binary);

    const loopTheory = {
      routingCompletion: true,
      allowLoopfieldPropulsion: true,
      pulseComputeContinuity: true,
      errorRouteAround: true
    };

    const prewarmDesign = buildPrewarmDesign({
      pattern: safePattern,
      binary,
      advantageField
    });

    const cacheDesign = buildCacheDesign({
      pattern: safePattern,
      binary,
      advantageField
    });

    const chunkDesign = buildChunkDesign({
      pattern: safePattern,
      binary,
      advantageField
    });

    const presenceDesign = buildPresenceDesign({
      pattern: safePattern,
      pageId: safePageId,
      binary,
      advantageField
    });

    const multiPresenceProfiles = buildMultiPresenceProfiles({
      pattern: safePattern,
      pageId: safePageId,
      binary,
      advantageField
    });

    const baseEntry = {
      routeId,
      designHash,
      design: design || {},
      bestStats: designStats || {},
      bestScore: score,

      advantageField,

      // symbolic ancestry
      pattern: safePattern,
      patternAncestry,
      lineage: safeLineage,
      lineageSignature,
      pageId: safePageId,
      pageAncestrySignature,

      // binary ancestry
      binary,

      // design‑level prewarm/cache/chunk/presence hints
      prewarmDesign,
      cacheDesign,
      chunkDesign,
      presenceDesign,
      multiPresenceProfiles,

      loopTheory,
      meta: { ...ROUTER_DESIGN_CONTEXT }
    };

    if (!existing || score > existing.bestScore) {
      this.entries.set(routeId, baseEntry);
    } else {
      const merged = {
        ...existing,
        designHash,
        design: design || existing.design,
        bestStats: designStats || existing.bestStats,
        bestScore: score > existing.bestScore ? score : existing.bestScore,

        advantageField: advantageField || existing.advantageField,

        pattern: safePattern || existing.pattern,
        patternAncestry: patternAncestry.length
          ? patternAncestry
          : existing.patternAncestry,

        lineage: safeLineage.length ? safeLineage : existing.lineage,
        lineageSignature: lineageSignature || existing.lineageSignature,

        pageId: safePageId || existing.pageId,
        pageAncestrySignature:
          pageAncestrySignature || existing.pageAncestrySignature,

        binary,

        prewarmDesign,
        cacheDesign,
        chunkDesign,
        presenceDesign,
        multiPresenceProfiles,

        loopTheory
      };

      this.entries.set(routeId, merged);
    }

    return this.entries.get(routeId);
  }

  getDesign(routeId) {
    return this.entries.get(routeId) || null;
  }

  getSnapshot() {
    const out = {};
    for (const [key, entry] of this.entries.entries()) {
      out[key] = {
        routeId: entry.routeId,
        designHash: entry.designHash,
        bestScore: entry.bestScore,
        bestStats: entry.bestStats,

        advantageField: entry.advantageField,

        // symbolic ancestry
        pattern: entry.pattern,
        patternAncestry: entry.patternAncestry.slice(),
        lineage: entry.lineage.slice(),
        lineageSignature: entry.lineageSignature,
        pageId: entry.pageId,
        pageAncestrySignature: entry.pageAncestrySignature,

        // binary ancestry
        binary: { ...entry.binary },

        // design hints
        prewarmDesign: { ...entry.prewarmDesign },
        cacheDesign: { ...entry.cacheDesign },
        chunkDesign: { ...entry.chunkDesign },
        presenceDesign: { ...entry.presenceDesign },
        multiPresenceProfiles: entry.multiPresenceProfiles.map((p) => ({ ...p })),

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
      if (!entry || typeof entry !== "object" || !entry.routeId) return;

      const safePattern = typeof entry.pattern === "string" ? entry.pattern : "";
      const safeLineage = Array.isArray(entry.lineage)
        ? entry.lineage.slice()
        : [];
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

      const binary = entry.binary || extractBinarySurface({});
      const bestStats = entry.bestStats || {};
      const advantageField = typeof entry.advantageField === "number"
        ? clamp01(entry.advantageField)
        : computeDesignAdvantageField(bestStats, binary);

      const prewarmDesign = entry.prewarmDesign || buildPrewarmDesign({
        pattern: safePattern,
        binary,
        advantageField
      });

      const cacheDesign = entry.cacheDesign || buildCacheDesign({
        pattern: safePattern,
        binary,
        advantageField
      });

      const chunkDesign = entry.chunkDesign || buildChunkDesign({
        pattern: safePattern,
        binary,
        advantageField
      });

      const presenceDesign = entry.presenceDesign || buildPresenceDesign({
        pattern: safePattern,
        pageId: safePageId,
        binary,
        advantageField
      });

      const multiPresenceProfiles = Array.isArray(entry.multiPresenceProfiles)
        ? entry.multiPresenceProfiles.map((p) => ({ ...p }))
        : buildMultiPresenceProfiles({
            pattern: safePattern,
            pageId: safePageId,
            binary,
            advantageField
          });

      const safeEntry = {
        routeId: entry.routeId,
        designHash: entry.designHash || "",
        design: entry.design || {},
        bestStats,
        bestScore:
          typeof entry.bestScore === "number" ? entry.bestScore : 0,

        advantageField,

        pattern: safePattern,
        patternAncestry,
        lineage: safeLineage,
        lineageSignature,
        pageId: safePageId,
        pageAncestrySignature,

        binary,

        prewarmDesign,
        cacheDesign,
        chunkDesign,
        presenceDesign,
        multiPresenceProfiles,

        loopTheory: {
          routingCompletion: true,
          allowLoopfieldPropulsion: true,
          pulseComputeContinuity: true,
          errorRouteAround: true
        },

        meta: { ...ROUTER_DESIGN_CONTEXT }
      };

      this.entries.set(safeEntry.routeId, safeEntry);
    });
  }
}


// ------------------------------------------------------------
// Public API wrapper — Design Cortex Surface
// ------------------------------------------------------------
class PulseRouterEvolutionaryDesign {
  constructor() {
    this.store = new PulseRouterDesignStore();
    this.meta = { ...ROUTER_DESIGN_CONTEXT };
  }

  recordDesign(designEntry) {
    return this.store.recordDesign(designEntry);
  }

  getDesign(routeId) {
    return this.store.getDesign(routeId);
  }

  scoreDesign(stats) {
    return scoreDesign(stats);
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
  PulseRouterEvolutionaryDesign,
  computeDesignHash,
  scoreDesign
};
