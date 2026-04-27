// ============================================================================
//  PulseMeshRouter-v11-Evo-DualStack — MESH ROUTING ORGAN (Symbolic + Binary)
//  Deterministic Mesh Path Selection • Pattern/Lineage/Page/Binary-Aware
// ============================================================================

export const PulseMeshRole = {
  type: "MeshRouter",
  subsystem: "PulseMesh",
  layer: "Routing",
  version: "11.0",
  identity: "PulseMeshRouter-v11-Evo-DualStack",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    pageAware: true,
    deterministicRouting: true,
    unifiedAdvantageField: true,
    loopTheoryAware: true,

    // ⭐ NEW: binary-aware mesh routing
    binaryAware: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  meshContract: "PulseMesh-v11",
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
//  DETERMINISTIC MESH PATH SELECTION (Symbolic + Binary)
// ============================================================================
function chooseMeshPath(pulse) {
  const binary = extractBinarySurface(pulse.payload || {});

  // ⭐ If binary hints exist, use them deterministically
  if (binary.hasBinary && binary.binaryHints?.meshHint) {
    return binary.binaryHints.meshHint;
  }

  // ⭐ Otherwise symbolic deterministic fallback
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;

  const raw = `${pattern}::${lineageDepth}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 11)) % 6151;
  }

  const paths = ["mesh-local", "mesh-remote", "mesh-os-fallback"];
  return paths[acc % paths.length];
}


// ============================================================================
//  PUBLIC API — PulseMeshRouter (DualStack)
// ============================================================================
export const PulseMeshRouter = {

  PulseMeshRole,

  routeMesh(pulse) {
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

    const meshPath = chooseMeshPath(pulse);

    return {
      meshPath,
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

      loopTheory: { ...PulseMeshRole.loopTheory }
    };
  }
};
