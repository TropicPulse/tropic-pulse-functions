// ============================================================================
//  PART 1/3
//  PulseRouterEvolutionaryDesign-v16-IMMORTAL-AdvMultiPresence-IntelDualHash
//  ROUTER DESIGN CORTEX (Symbolic + Binary + Advantage v4 + Prewarm/Cache/Chunk/Multi‑Presence v4)
//  Deterministic Architectural Memory • Drift‑Proof • Pure Memory Organ • Cosmos‑Aware
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterEvolutionaryDesign",
  version: "v16.0-IMMORTAL-DESIGN",
  layer: "frontend",
  role: "router_design_cortex",
  lineage: "PulseOS-v16-IMMORTAL",

  evo: {
    designCore: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    longTermMemory: true,
    lineageAware: true,
    pageAware: true,
    cosmosAware: true,
    meshAware: true,
    earnAware: true,
    binaryRouterAware: true,
    advantageV4: true,
    intelDualHash: true,
    triHash: true,
    driftProof: true,
    snapshotReady: true,
    multiPresenceAware: true,
    prewarmAware: true,
    cacheAware: true,
    chunkAware: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterEvolutionaryDesign",
      "PulseRouterEvolutionaryInstincts",
      "PulseRouterEvolutionaryThought",
      "PulseMeshRouter",
      "PulseEarnRouter",
      "PulseRouterCommandments",
      "PulsePresence",
      "PulseChunks"
    ],
    never: [
      "legacyRouterDesign",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS",
      "legacyChunker"
    ]
  }
}
*/


// ============================================================================
// IMPORTS — Router Mesh / Earn / Law Surfaces (symbolic contracts only)
// ============================================================================
import { PulseMeshRouter } from "./PulseRouterMesh-v16.js";
import { PulseEarnRouter } from "./PulseRouterEarn-v16.js";
import {
  PulseRouterCommandments,
  buildRouteKey as buildCommandmentRouteKey
} from "./PulseRouterCommandments.js";


// ------------------------------------------------------------
// v16‑IMMORTAL CONTEXT METADATA — Router Design Identity
// ------------------------------------------------------------
const ROUTER_DESIGN_CONTEXT_V16 = {
  layer: "PulseRouterEvolutionaryDesign",
  role: "ROUTER_DESIGN_CORTEX",
  purpose: "Long‑term architectural memory for route design blueprints (v16 IMMORTAL)",
  context:
    "Stores route design intent, lineage, constraints, evolution, binary metadata, cosmos, multi‑presence + prewarm/cache/chunk hints",
  target: "dual-stack-router",
  version: "16.0-IMMORTAL",
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
    cosmosAware: true,
    meshAware: true,
    earnAware: true,

    // v16+: full advantage + prewarm/cache/chunk/multi‑presence
    advantageFieldAware: true,
    prewarmAware: true,
    cacheAware: true,
    chunkAware: true,
    presenceAware: true,
    multiPresenceAware: true,
    triHashAware: true,
    intelDualHashAware: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  }
};


// ------------------------------------------------------------
// COSMOS HELPERS — v16 IMMORTAL
// ------------------------------------------------------------
function normalizeCosmos(cosmos = {}) {
  return {
    universeId: cosmos.universeId || "u:default",
    timelineId: cosmos.timelineId || "t:main",
    branchId: cosmos.branchId || "b:root",
    worldId: cosmos.worldId || "w:primary",
    shardId: cosmos.shardId || "s:0"
  };
}

function cosmosSignature(cosmos) {
  const raw = `${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}|${cosmos.worldId}|${cosmos.shardId}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `cx16-${h.toString(16)}`;
}


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
// Utility: deterministic hash (32‑bit)
// ------------------------------------------------------------
function simpleHash32(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0) >>> 0;
}


// ------------------------------------------------------------
// IntelDualHash + TriHash — v16 Design Fingerprints
// ------------------------------------------------------------
function intelDualHash(shape) {
  const raw = stableStringify(shape || {});
  const mid = Math.floor(raw.length / 2);

  const left = raw.slice(0, mid);
  const right = raw.slice(mid);

  const h1 = simpleHash32(left);
  const h2 = simpleHash32(right);

  const hi = (BigInt(h1) << 32n) | BigInt(h2);
  const lo = BigInt(simpleHash32(raw));

  const combined = (hi ^ (lo << 1n)) & ((1n << 96n) - 1n);

  const hiHex = hi.toString(16);
  const loHex = combined.toString(16);

  return {
    primary: `idh16-${hiHex}`,
    secondary: `idh16s-${loHex}`,
    hi,
    lo
  };
}

function triHash(shape) {
  const raw = stableStringify(shape || {});
  const len = raw.length || 1;
  const third = Math.floor(len / 3);

  const a = raw.slice(0, third);
  const b = raw.slice(third, 2 * third);
  const c = raw.slice(2 * third);

  const hA = simpleHash32(a);
  const hB = simpleHash32(b);
  const hC = simpleHash32(c);

  const hi = (BigInt(hA) << 32n) | BigInt(hB);
  const mid = BigInt(hC);
  const lo = BigInt(simpleHash32(raw));

  const combined = (hi ^ (mid << 16n) ^ (lo << 1n)) & ((1n << 112n) - 1n);

  return {
    triPrimary: `th16-${combined.toString(16)}`,
    hi,
    mid,
    lo
  };
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

function buildPageAncestrySignature({ pattern, lineage, pageId, cosmos }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId,
    cosmosSignature: cosmosSignature(cosmos)
  };

  return simpleHash32(stableStringify(shape)).toString(16);
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
// Design hash — Architectural Fingerprint v16
// ------------------------------------------------------------
function computeDesignHash(design) {
  const serialized = stableStringify(design || {});
  return simpleHash32(serialized).toString(16);
}

function computeDesignDualHash(design) {
  return intelDualHash(design || {});
}

function computeDesignTriHash(design) {
  return triHash(design || {});
}


// ------------------------------------------------------------
// Design scoring — Structural Fitness Score v16
// ------------------------------------------------------------
function scoreDesign(designStats = {}) {
  const {
    stability = 1.0,
    clarity = 1.0,
    lineageStrength = 1.0,
    meshAffinity = 0.8,
    earnAffinity = 0.8,
    cosmosStability = 1.0
  } = designStats;

  const clamp01Local = (v) => Math.max(0, Math.min(1, v));

  const s = clamp01Local(stability);
  const c = clamp01Local(clarity);
  const l = clamp01Local(lineageStrength);
  const m = clamp01Local(meshAffinity);
  const e = clamp01Local(earnAffinity);
  const cs = clamp01Local(cosmosStability);

  const base = s * 0.35 + c * 0.25 + l * 0.2 + cs * 0.2;
  const meshEarnBoost = (m + e) * 0.25;

  return base * 0.8 + meshEarnBoost * 0.2;
}


// ------------------------------------------------------------
// Advantage field — unified design advantage v4
// ------------------------------------------------------------
function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function computeDesignAdvantageField(designStats = {}, binarySurface = {}, cosmos = {}) {
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

  const meshAffinity = typeof designStats.meshAffinity === "number"
    ? clamp01(designStats.meshAffinity)
    : 0.8;

  const earnAffinity = typeof designStats.earnAffinity === "number"
    ? clamp01(designStats.earnAffinity)
    : 0.8;

  const cosmosStability = typeof designStats.cosmosStability === "number"
    ? clamp01(designStats.cosmosStability)
    : 1.0;

  const binaryStrength =
    typeof binarySurface.binaryStrength === "number"
      ? clamp01(binarySurface.binaryStrength)
      : (binarySurface.hasBinary ? 0.75 : 0.5);

  const base = stability * 0.3 + clarity * 0.2 + lineageStrength * 0.2 + cosmosStability * 0.3;
  const meshEarnBoost = (meshAffinity + earnAffinity) * 0.25;
  const adv = base * 0.7 + binaryStrength * 0.15 + meshEarnBoost * 0.15;

  return clamp01(adv);
}


// ------------------------------------------------------------
// Prewarm / Cache / Chunk / Presence design hints (single + multi)
// ------------------------------------------------------------
function buildPrewarmDesign({ pattern, binary, advantageField, cosmos }) {
  return {
    enabled: true,
    strategy: binary.hasBinary ? "binary-primed-prewarm" : "symbolic-prewarm",
    pattern,
    advantageField,
    binaryAware: binary.hasBinary,
    cosmosSignature: cosmosSignature(cosmos),
    lanes: binary.hasBinary
      ? ["binary-lane", "symbolic-lane", "presence-surface"]
      : ["symbolic-lane", "presence-surface"]
  };
}

function buildCacheDesign({ pattern, binary, advantageField, cosmos }) {
  return {
    enabled: true,
    strategy: binary.hasBinary ? "binary-hot-cache-design" : "symbolic-hot-cache-design",
    tiers: ["L1-route", "L2-organ", "L3-world", "L4-cosmos"],
    pattern,
    advantageField,
    binaryAware: binary.hasBinary,
    cosmosSignature: cosmosSignature(cosmos)
  };
}

function buildChunkDesign({ pattern, binary, advantageField, cosmos }) {
  return {
    enabled: true,
    strategy: "router-chunk-design-hints",
    lanes: [
      "symbolic-route-plan",
      "binary-lane-hints",
      "presence-surface",
      "advantage-field",
      "cosmos-context"
    ],
    pattern,
    advantageField,
    hints: {
      binaryLanePriority: binary.hasBinary ? "elevated" : "normal",
      cosmosLanePriority: "stable"
    },
    binaryAware: binary.hasBinary,
    cosmosSignature: cosmosSignature(cosmos)
  };
}

function buildPresenceDesign({ pattern, pageId, binary, advantageField, cosmos }) {
  return {
    enabled: true,
    strategy: "router-presence-design",
    pattern,
    pageId,
    advantageField,
    binarySignal:
      binary.hasBinary ? (binary.binaryMode || "binary-present") : "none",
    binaryAware: binary.hasBinary,
    cosmosSignature: cosmosSignature(cosmos)
  };
}

// 16+: multi‑presence profiles (per‑route, per‑page, per‑mode, per‑cosmos)
function buildMultiPresenceProfiles({ pattern, pageId, binary, advantageField, cosmos }) {
  const baseId = `${pattern || "NO_PATTERN"}::${pageId || "NO_PAGE"}::${cosmosSignature(
    cosmos
  )}`;

  const mkProfile = (kind, extra = {}) => ({
    id: simpleHash32(`${baseId}::${kind}`).toString(16),
    kind,
    pattern,
    pageId,
    advantageField,
    binaryAware: binary.hasBinary,
    binaryMode: binary.binaryMode || null,
    cosmosSignature: cosmosSignature(cosmos),
    ...extra
  });

  return [
    mkProfile("foreground", {
      priority: "high",
      cacheTier: "L1-route",
      chunkLane: "presence-surface",
      presenceScope: "route-local"
    }),
    mkProfile("background", {
      priority: "medium",
      cacheTier: "L2-organ",
      chunkLane: "advantage-field",
      presenceScope: "organ-local"
    }),
    mkProfile("standby", {
      priority: "low",
      cacheTier: "L3-world",
      chunkLane: "binary-lane-hints",
      presenceScope: "world-ambient"
    }),
    mkProfile("cosmos", {
      priority: "medium",
      cacheTier: "L4-cosmos",
      chunkLane: "cosmos-context",
      presenceScope: "cosmos-field"
    })
  ];
}

// ============================================================================
//  END PART 1/3 — Helpers, Context, Advantage, Presence, Multi‑Presence
//  NEXT: PART 2/3 — PulseRouterDesignStore v16 IMMORTAL
// ============================================================================
// ============================================================================
//  PART 2/3
//  PulseRouterDesignStore‑v16‑IMMORTAL‑AdvMultiPresence‑IntelDualHash‑TriHash
//  FULL DESIGN MEMORY ORGAN (Symbolic + Binary + Cosmos + Advantage v4)
//  Deterministic Architectural Memory • Drift‑Proof • IMMORTAL Snapshot Engine
// ============================================================================


// ------------------------------------------------------------
// Memory entry model — Architectural Design Record (DualStack v16 IMMORTAL)
// ------------------------------------------------------------
class PulseRouterDesignStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...ROUTER_DESIGN_CONTEXT_V16 };
  }

  clear() {
    this.entries.clear();
  }

  // ------------------------------------------------------------
  // recordDesign — the HEART of the Evolutionary Design Cortex
  // ------------------------------------------------------------
  recordDesign({
    routeId,
    design,
    designStats,
    pattern,
    lineage,
    pageId,
    payload,
    cosmos
  }) {
    const cx = normalizeCosmos(cosmos || {});
    const designHash = computeDesignHash(design);
    const dualHash = computeDesignDualHash(design);
    const triHash = computeDesignTriHash(design);
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
      pageId: safePageId,
      cosmos: cx
    });

    const binary = extractBinarySurface(payload || {});
    const advantageField = computeDesignAdvantageField(designStats || {}, binary, cx);

    const loopTheory = {
      routingCompletion: true,
      allowLoopfieldPropulsion: true,
      pulseComputeContinuity: true,
      errorRouteAround: true
    };

    // ------------------------------------------------------------
    // Build design‑level prewarm/cache/chunk/presence hints
    // ------------------------------------------------------------
    const prewarmDesign = buildPrewarmDesign({
      pattern: safePattern,
      binary,
      advantageField,
      cosmos: cx
    });

    const cacheDesign = buildCacheDesign({
      pattern: safePattern,
      binary,
      advantageField,
      cosmos: cx
    });

    const chunkDesign = buildChunkDesign({
      pattern: safePattern,
      binary,
      advantageField,
      cosmos: cx
    });

    const presenceDesign = buildPresenceDesign({
      pattern: safePattern,
      pageId: safePageId,
      binary,
      advantageField,
      cosmos: cx
    });

    const multiPresenceProfiles = buildMultiPresenceProfiles({
      pattern: safePattern,
      pageId: safePageId,
      binary,
      advantageField,
      cosmos: cx
    });

    // ------------------------------------------------------------
    // Base entry (IMMORTAL v16)
    // ------------------------------------------------------------
    const baseEntry = {
      routeId,
      designHash,
      designDualHash: dualHash,
      designTriHash: triHash,

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

      // cosmos ancestry
      cosmos: cx,
      cosmosSignature: cosmosSignature(cx),

      // design‑level prewarm/cache/chunk/presence hints
      prewarmDesign,
      cacheDesign,
      chunkDesign,
      presenceDesign,
      multiPresenceProfiles,

      loopTheory,
      meta: { ...ROUTER_DESIGN_CONTEXT_V16 }
    };

    // ------------------------------------------------------------
    // Merge logic — IMMORTAL v16 (keeps bestScore, merges ancestry)
    // ------------------------------------------------------------
    if (!existing || score > existing.bestScore) {
      this.entries.set(routeId, baseEntry);
    } else {
      const merged = {
        ...existing,

        designHash,
        designDualHash: dualHash,
        designTriHash: triHash,

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

        cosmos: cx,
        cosmosSignature: cosmosSignature(cx),

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

  // ------------------------------------------------------------
  // getDesign — retrieve IMMORTAL design entry
  // ------------------------------------------------------------
  getDesign(routeId) {
    return this.entries.get(routeId) || null;
  }

  // ------------------------------------------------------------
  // getSnapshot — FULL IMMORTAL SNAPSHOT
  // ------------------------------------------------------------
  getSnapshot() {
    const out = {};
    for (const [key, entry] of this.entries.entries()) {
      out[key] = {
        routeId: entry.routeId,
        designHash: entry.designHash,
        designDualHash: entry.designDualHash,
        designTriHash: entry.designTriHash,

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

        // cosmos ancestry
        cosmos: { ...entry.cosmos },
        cosmosSignature: entry.cosmosSignature,

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

  // ------------------------------------------------------------
  // serialize — IMMORTAL safe
  // ------------------------------------------------------------
  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }

  // ------------------------------------------------------------
  // deserialize — IMMORTAL migration logic
  // ------------------------------------------------------------
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

      const cx = normalizeCosmos(entry.cosmos || {});
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
              pageId: safePageId,
              cosmos: cx
            });

      const binary = entry.binary || extractBinarySurface({});
      const bestStats = entry.bestStats || {};

      const advantageField =
        typeof entry.advantageField === "number"
          ? clamp01(entry.advantageField)
          : computeDesignAdvantageField(bestStats, binary, cx);

      const prewarmDesign =
        entry.prewarmDesign ||
        buildPrewarmDesign({
          pattern: safePattern,
          binary,
          advantageField,
          cosmos: cx
        });

      const cacheDesign =
        entry.cacheDesign ||
        buildCacheDesign({
          pattern: safePattern,
          binary,
          advantageField,
          cosmos: cx
        });

      const chunkDesign =
        entry.chunkDesign ||
        buildChunkDesign({
          pattern: safePattern,
          binary,
          advantageField,
          cosmos: cx
        });

      const presenceDesign =
        entry.presenceDesign ||
        buildPresenceDesign({
          pattern: safePattern,
          pageId: safePageId,
          binary,
          advantageField,
          cosmos: cx
        });

      const multiPresenceProfiles = Array.isArray(entry.multiPresenceProfiles)
        ? entry.multiPresenceProfiles.map((p) => ({ ...p }))
        : buildMultiPresenceProfiles({
            pattern: safePattern,
            pageId: safePageId,
            binary,
            advantageField,
            cosmos: cx
          });

      const safeEntry = {
        routeId: entry.routeId,
        designHash: entry.designHash || computeDesignHash(entry.design || {}),
        designDualHash:
          entry.designDualHash || computeDesignDualHash(entry.design || {}),
        designTriHash:
          entry.designTriHash || computeDesignTriHash(entry.design || {}),

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

        cosmos: cx,
        cosmosSignature: cosmosSignature(cx),

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

        meta: { ...ROUTER_DESIGN_CONTEXT_V16 }
      };

      this.entries.set(safeEntry.routeId, safeEntry);
    });
  }
}


// ============================================================================
//  END PART 2/3 — PulseRouterDesignStore v16 IMMORTAL
//  NEXT: PART 3/3 — Public API Wrapper + Exports
// ============================================================================
// ============================================================================
//  PART 3/3
//  PulseRouterEvolutionaryDesign‑v16‑IMMORTAL
//  PUBLIC DESIGN CORTEX SURFACE + INTEGRATION HOOKS + EXPORTS
// ============================================================================


// ------------------------------------------------------------
// Public API wrapper — Design Cortex Surface v16 IMMORTAL
// ------------------------------------------------------------
class PulseRouterEvolutionaryDesign {
  constructor() {
    this.store = new PulseRouterDesignStore();
    this.meta = { ...ROUTER_DESIGN_CONTEXT_V16 };

    // Optional: attach law + mesh + earn surfaces (symbolic integration only)
    this.commandments = new PulseRouterCommandments();
    this.meshRouter = PulseMeshRouter;
    this.earnRouter = PulseEarnRouter;
  }

  // Core design recording
  recordDesign(designEntry) {
    return this.store.recordDesign(designEntry);
  }

  // Retrieve design by routeId
  getDesign(routeId) {
    return this.store.getDesign(routeId);
  }

  // Expose scoring as pure function
  scoreDesign(stats) {
    return scoreDesign(stats);
  }

  // IMMORTAL snapshot
  getSnapshot() {
    return this.store.getSnapshot();
  }

  // Serialization
  serialize() {
    return this.store.serialize();
  }

  deserialize(jsonString) {
    this.store.deserialize(jsonString);
  }

  clear() {
    this.store.clear();
  }

  // ------------------------------------------------------------
  // v16+ — Integration helpers with Mesh / Earn / Commandments
  // ------------------------------------------------------------

  // Build a design entry from a mesh routing decision
  fromMeshDecision({ routeId, meshDecision, design, designStats }) {
    if (!meshDecision) return null;

    const {
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature,
      binary,
      cacheChunkKey,
      prewarmHint,
      presenceScope
    } = meshDecision;

    const cosmos = {}; // mesh is typically local‑world; cosmos can be extended upstream

    const enrichedDesign = {
      ...(design || {}),
      mesh: {
        meshPath: meshDecision.meshPath,
        tier: meshDecision.tier,
        cacheChunkKey,
        prewarmHint,
        presenceScope
      },
      ancestry: {
        pattern,
        patternAncestry,
        lineage,
        lineageSignature,
        pageId,
        pageAncestrySignature
      },
      binary: binary || {}
    };

    return this.recordDesign({
      routeId,
      design: enrichedDesign,
      designStats: designStats || {},
      pattern,
      lineage,
      pageId,
      payload: binary || {},
      cosmos
    });
  }

  // Build a design entry from an earn routing decision
  fromEarnDecision({ routeId, earnDecision, design, designStats }) {
    if (!earnDecision) return null;

    const {
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature,
      binary,
      tier
    } = earnDecision;

    const cosmos = {}; // earn is typically world‑level; cosmos can be extended upstream

    const enrichedDesign = {
      ...(design || {}),
      earn: {
        targetPath: earnDecision.targetPath,
        tier
      },
      ancestry: {
        pattern,
        patternAncestry,
        lineage,
        lineageSignature,
        pageId,
        pageAncestrySignature
      },
      binary: binary || {}
    };

    return this.recordDesign({
      routeId,
      design: enrichedDesign,
      designStats: designStats || {},
      pattern,
      lineage,
      pageId,
      payload: binary || {},
      cosmos
    });
  }

  // Build a design entry from a commandments route key + law context
  fromCommandments({
    routeId,
    tierId,
    context,
    pattern,
    lineage,
    pageId,
    payload,
    cosmos,
    design,
    designStats
  }) {
    const cx = normalizeCosmos(cosmos || {});
    const { key, intelDualHash } = buildCommandmentRouteKey({
      routeId,
      tierId,
      context,
      pattern,
      lineage,
      pageId,
      payload,
      cosmos: cx
    });

    const lawEntry = this.commandments.getCommandments({
      routeId,
      tierId,
      context,
      pattern,
      lineage,
      pageId,
      payload,
      cosmos: cx
    });

    const enrichedDesign = {
      ...(design || {}),
      law: {
        routeKey: key,
        intelDualHash,
        commandments: lawEntry.commandments || {}
      }
    };

    return this.recordDesign({
      routeId,
      design: enrichedDesign,
      designStats: designStats || {},
      pattern,
      lineage,
      pageId,
      payload,
      cosmos: cx
    });
  }
}


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  // Core organ
  PulseRouterEvolutionaryDesign,
  PulseRouterDesignStore,

  // Hash / advantage helpers
  computeDesignHash,
  computeDesignDualHash,
  computeDesignTriHash,
  scoreDesign,
  computeDesignAdvantageField,

  // Ancestry / cosmos helpers
  buildPatternAncestry,
  buildLineageSignature,
  buildPageAncestrySignature,
  extractBinarySurface,
  normalizeCosmos,
  cosmosSignature,

  // Hash helpers
  intelDualHash,
  triHash
};
