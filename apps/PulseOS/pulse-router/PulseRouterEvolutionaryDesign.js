// ============================================================================
//  PULSE ROUTER EVOLUTIONARY DESIGN v11‑Evo‑DualStack — ROUTER DESIGN CORTEX
//  Long‑Term Route Architecture Memory • Deterministic • Drift‑Proof
//  Symbolic + Binary Design Metadata • Page/Lineage/Pattern/Binary‑Ancestry Aware
// ============================================================================
//
//  ROLE:
//    • Stores long‑term route design blueprints.
//    • Symbolic + Binary dual‑stack design memory.
//    • Preserves structural intent + evolution lineage.
//    • Deterministic design lookup + self‑repair.
//    • Ensures router never drifts from founder‑approved design.
//    • Loop‑Theory‑Aware.
//    • Pure memory organ — NO routing, NO compute, NO mutation outside instance.
//
// ============================================================================


// ------------------------------------------------------------
// v11‑Evo CONTEXT METADATA — Router Design Identity
// ------------------------------------------------------------
const ROUTER_DESIGN_CONTEXT = {
  layer: "PulseRouterEvolutionaryDesign",
  role: "ROUTER_DESIGN_CORTEX",
  purpose: "Long‑term architectural memory for route design blueprints",
  context: "Stores route design intent, lineage, constraints, evolution, binary metadata",
  target: "dual-stack-router",
  version: 11.0,
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

    // ⭐ NEW: binary-aware design cortex
    binaryAware: true
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
    const score = scoreDesign(designStats);

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

    const loopTheory = {
      routingCompletion: true,
      allowLoopfieldPropulsion: true,
      pulseComputeContinuity: true,
      errorRouteAround: true
    };

    const baseEntry = {
      routeId,
      designHash,
      design: design || {},
      bestStats: designStats || {},
      bestScore: score,

      // symbolic ancestry
      pattern: safePattern,
      patternAncestry,
      lineage: safeLineage,
      lineageSignature,
      pageId: safePageId,
      pageAncestrySignature,

      // ⭐ NEW: binary ancestry
      binary,

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

        pattern: safePattern || existing.pattern,
        patternAncestry: patternAncestry.length
          ? patternAncestry
          : existing.patternAncestry,

        lineage: safeLineage.length ? safeLineage : existing.lineage,
        lineageSignature: lineageSignature || existing.lineageSignature,

        pageId: safePageId || existing.pageId,
        pageAncestrySignature:
          pageAncestrySignature || existing.pageAncestrySignature,

        // ⭐ always update binary surface
        binary,

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

        // symbolic ancestry
        pattern: entry.pattern,
        patternAncestry: entry.patternAncestry.slice(),
        lineage: entry.lineage.slice(),
        lineageSignature: entry.lineageSignature,
        pageId: entry.pageId,
        pageAncestrySignature: entry.pageAncestrySignature,

        // ⭐ binary ancestry
        binary: { ...entry.binary },

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

      const safeEntry = {
        routeId: entry.routeId,
        designHash: entry.designHash || "",
        design: entry.design || {},
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
        binary: entry.binary || extractBinarySurface({}),

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
