// ============================================================================
//  PulseEarnRouter-v11-Evo-DualStack — EARN ROUTING ORGAN (Symbolic + Binary)
//  Deterministic Earn Routing • Pattern/Lineage/Page/Binary-Aware
// ============================================================================

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
    binaryAware: true
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
//  PUBLIC API — PulseEarnRouter (DualStack)
// ============================================================================
export const PulseEarnRouter = {

  PulseEarnRole,

  routeEarn(pulse) {
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
    };
  }
};
