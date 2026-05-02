// ============================================================================
//  PulseEarnRouter-v11-Evo-DualStack — EARN ROUTING ORGAN (Symbolic + Binary)
//  Deterministic Earn Routing • Pattern/Lineage/Page/Binary-Aware
//  + CoreMemory Integration: hot patterns/pages/binary surfaces
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterEarn",
  version: "v14.4-EVO",
  layer: "frontend",
  role: "earn_router",
  lineage: "PulseOS-v12",

  evo: {
    earnCore: true,
    advantageV2: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    deterministic: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterCommandments",
      "PulsePresence",
      "PulseChunks"
    ],
    never: [
      "legacyEarnRouter",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

export const PulseEarnRole = {
  type: "EarnRouter",
  subsystem: "PulseEarn",
  layer: "Routing",
  version: "11.0",
  identity: "PulseEarnRouter-v11-Evo-DualStack",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    pageAware: true,
    deterministicRouting: true,
    unifiedAdvantageField: true,
    loopTheoryAware: true,

    // ⭐ NEW: binary-aware earn routing
    binaryAware: true,

    // ⭐ NEW: core-memory-aware
    coreMemoryAware: true,
    hotPatternAware: true,
    hotPageAware: true,
    hotBinarySurfaceAware: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  earnContract: "PulseEarn-v11",
  sendContract: "PulseSend-v11"
};


// ============================================================================
//  CORE MEMORY — hot caching / presence
// ============================================================================
const CoreMemory = createPulseCoreMemory();
const ROUTE = "earn-router-global";

const KEY_LAST_DECISION = "last-decision";
const KEY_LAST_PULSE_SURFACE = "last-pulse-surface";
const KEY_HOT_PATTERNS = "hot-patterns";
const KEY_HOT_PAGES = "hot-pages";
const KEY_HOT_BINARY = "hot-binary-patterns";

function trackPattern(pattern) {
  if (!pattern) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_PATTERNS) || {};
  hot[pattern] = (hot[pattern] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_PATTERNS, hot);
}

function trackPage(pageId) {
  if (!pageId) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_PAGES) || {};
  hot[pageId] = (hot[pageId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_PAGES, hot);
}

function trackBinary(binary) {
  if (!binary || !binary.hasBinary) return;
  const key = binary.binaryPattern || binary.binaryMode || "generic-binary";
  const hot = CoreMemory.get(ROUTE, KEY_HOT_BINARY) || {};
  hot[key] = (hot[key] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_BINARY, hot);
}

function storeDecision(decision, pulseSurface) {
  CoreMemory.set(ROUTE, KEY_LAST_DECISION, decision);
  CoreMemory.set(ROUTE, KEY_LAST_PULSE_SURFACE, pulseSurface);
  trackPattern(pulseSurface.pattern);
  trackPage(pulseSurface.pageId);
  trackBinary(pulseSurface.binary);
}


// ============================================================================
//  HELPERS — symbolic ancestry
// ============================================================================
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

  let raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ============================================================================
//  HELPERS — binary ancestry (optional)
// ============================================================================
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


// ============================================================================
//  DEGRADATION TIER
// ============================================================================
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ============================================================================
//  DETERMINISTIC EARN PATH SELECTION (Symbolic + Binary)
// ============================================================================
function chooseEarnPath(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const health = pulse.healthScore ?? 1;

  const binary = extractBinarySurface(pulse.payload || {});

  // ⭐ If binary hints exist, use them deterministically
  if (binary.hasBinary && binary.binaryHints?.organHint) {
    return binary.binaryHints.organHint;
  }

  // ⭐ Otherwise symbolic deterministic fallback
  const raw = `${pattern}::${health}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 7)) % 7919;
  }

  const paths = ["earn-core", "earn-cache", "earn-os-fallback"];
  return paths[acc % paths.length];
}


// ============================================================================
//  INTERNAL — pure decision builder (no CoreMemory side effects)
// ============================================================================
function buildEarnDecision(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage.slice() : [];
  const pageId = pulse.pageId || "NO_PAGE";

  const patternAncestry =
    pulse.patternAncestry?.length
      ? pulse.patternAncestry.slice()
      : buildPatternAncestry(pattern);

  const lineageSignature =
    typeof pulse.lineageSignature === "string"
      ? pulse.lineageSignature
      : buildLineageSignature(lineage);

  const pageAncestrySignature =
    typeof pulse.pageAncestrySignature === "string"
      ? pulse.pageAncestrySignature
      : buildPageAncestrySignature({ pattern, lineage, pageId });

  const binary = extractBinarySurface(pulse.payload || {});
  const tier = classifyDegradationTier(pulse.healthScore ?? 1);

  const targetPath = chooseEarnPath(pulse);

  return {
    decision: {
      targetPath,
      tier,

      // symbolic ancestry
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature,

      // ⭐ NEW: binary ancestry
      binary,

      loopTheory: { ...PulseEarnRole.loopTheory }
    },
    surface: {
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature,
      binary
    }
  };
}


// ============================================================================
//  PUBLIC API — PulseEarnRouter (DualStack + CoreMemory)
// ============================================================================
export const PulseEarnRouter = {

  PulseEarnRole,

  routeEarn(pulse) {
    CoreMemory.prewarm();

    const { decision, surface } = buildEarnDecision(pulse);
    storeDecision(decision, surface);

    return decision;
  },

  // Hot memory diagnostics / presence
  getEarnRoutingState() {
    CoreMemory.prewarm();

    return {
      lastDecision: CoreMemory.get(ROUTE, KEY_LAST_DECISION),
      lastPulseSurface: CoreMemory.get(ROUTE, KEY_LAST_PULSE_SURFACE),
      hotPatterns: CoreMemory.get(ROUTE, KEY_HOT_PATTERNS),
      hotPages: CoreMemory.get(ROUTE, KEY_HOT_PAGES),
      hotBinaryPatterns: CoreMemory.get(ROUTE, KEY_HOT_BINARY)
    };
  },

  CoreMemory
};
