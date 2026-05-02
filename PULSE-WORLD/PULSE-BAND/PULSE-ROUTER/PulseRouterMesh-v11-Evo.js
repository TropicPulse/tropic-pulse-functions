// ============================================================================
//  PulseMeshRouter-v12.3-Evo-DualStack — MESH ROUTING ORGAN (Symbolic + Binary)
//  Deterministic Mesh Path Selection • Pattern/Lineage/Page/Binary-Aware
//  12.3+: cacheChunkKey • prewarmHint • multiPresenceScope
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterMesh",
  version: "v14.4-EVO-MESH",
  layer: "frontend",
  role: "router_mesh_engine",
  lineage: "PulseOS-v12",

  evo: {
    meshCore: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    multiRoute: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterEvolutionaryDesign",
      "PulseRouterEvolutionaryInstincts",
      "PulseRouterEvolutionaryThought"
    ],
    never: [
      "legacyRouterMesh",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseMeshRole = {
  type: "MeshRouter",
  subsystem: "PulseMesh",
  layer: "Routing",
  version: "12.3",
  identity: "PulseMeshRouter-v12.3-Evo-DualStack",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    pageAware: true,
    deterministicRouting: true,
    unifiedAdvantageField: true,
    loopTheoryAware: true,

    // ⭐ binary-aware mesh routing
    binaryAware: true,

    // ⭐ 12.3+: cache / prewarm / presence
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true
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
//  HELPERS — stable stringify + hash (for ancestry/cache/presence)
// ============================================================================
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") +
    "}"
  );
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
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

  return simpleHash(stableStringify(shape));
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
//  12.3+ — cacheChunkKey / prewarmHint / multiPresenceScope
// ============================================================================
function buildCacheChunkKey({ pattern, lineage, pageId, binary }) {
  const shape = {
    pattern,
    lineage,
    pageId,
    binaryPattern: binary.binaryPattern,
    binaryMode: binary.binaryMode
  };
  return "mesh-cache::" + simpleHash(stableStringify(shape));
}

function buildPrewarmHint({ pattern, pageId, binary }) {
  const base = {
    pattern,
    pageId,
    hasBinary: binary.hasBinary,
    binaryPattern: binary.binaryPattern
  };
  const hash = simpleHash(stableStringify(base));
  const bucket = parseInt(hash.slice(0, 2), 16) % 3;

  const level = bucket === 0 ? "light" : bucket === 1 ? "aggressive" : "none";
  return {
    level,
    hintKey: "mesh-prewarm::" + hash
  };
}

function buildPresenceScope({ pattern, pageId, binary }) {
  if (binary.hasBinary && binary.binaryPattern) {
    const key =
      "mesh-presence::page::" +
      simpleHash(`${pattern}::${pageId}::${binary.binaryPattern}`);
    return { scope: "page", presenceKey: key };
  }

  const key = "mesh-presence::local::" + simpleHash(`${pattern}::${pageId}`);
  return { scope: "local", presenceKey: key };
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
//  PUBLIC API — PulseMeshRouter (DualStack, 12.3+)
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

    const cacheChunkKey = buildCacheChunkKey({
      pattern,
      lineage,
      pageId,
      binary
    });

    const prewarmHint = buildPrewarmHint({
      pattern,
      pageId,
      binary
    });

    const presenceScope = buildPresenceScope({
      pattern,
      pageId,
      binary
    });

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

      // ⭐ 12.3+: cache / prewarm / presence
      cacheChunkKey,
      prewarmHint,
      presenceScope,

      loopTheory: { ...PulseMeshRole.loopTheory }
    };
  }
};
