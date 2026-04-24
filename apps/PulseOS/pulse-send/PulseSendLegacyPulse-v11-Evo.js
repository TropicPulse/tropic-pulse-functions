// ============================================================================
//  PulseSendLegacyPulse-v11-Evo.js
//  Pulse v1 Organism • Stable Evolutionary Tier • Full Organism Minus Compute
//  v11: Diagnostics + Signatures + Ancestry + Stability Surface
//  v11-Binary: Binary-Aware, Unbinary-Friendly, Still Non-Evolving
// ============================================================================
//
//  ROLE:
//    • v1 is the *stable floor* of the organism stack.
//    • It never evolves, never computes evolution tiers, never changes behavior.
//    • It now understands binary metadata if present, but:
//        - It does NOT depend on bits.
//        - It does NOT evolve from bits.
//        - It only *surfaces* binary context in diagnostics/signatures.
//
//  SAFETY CONTRACT (v11-EvoStable):
//  --------------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic, stable, non-evolving organism.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v1 stable organism (v11)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "11.0",
  identity: "Pulse-v1-EvoStable-v11",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,
    routerAwareReady: true,
    meshAwareReady: true,

    evolutionEngineReady: false,   // ⭐ v1 NEVER evolves
    unifiedAdvantageField: true,
    pulseV1Ready: true,
    futureEvolutionReady: false,   // ⭐ v1 stays stable forever

    diagnosticsReady: true,
    signatureReady: true,
    stabilitySurfaceReady: true,

    // Binary-aware but non-evolving:
    //  - can surface binaryPattern/binaryMode/binaryStrength if present
    //  - does not change behavior based on them
    binaryAwareStableReady: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  sendContract: "PulseSend-v11",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// v1 lineage is static (no evolution)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  const raw = `${pattern}::${lineage.join("::")}`;
  return `shape-${computeHash(raw)}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;
  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  return "mature";
}

function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const shape = {
    pattern,
    patternAncestry: buildPatternAncestry(pattern),
    lineageSignature: buildLineageSignature(lineage),
    pageId: pageId || "NO_PAGE"
  };
  return computeHash(JSON.stringify(shape));
}

function extractBinarySurfaceFromPayload(payload) {
  const p = payload || {};

  const binaryPattern  = p.binaryPattern || null;
  const binaryMode     = p.binaryMode || null;
  const binaryPayload  = p.binaryPayload || null;
  const binaryHints    = p.binaryHints || null;
  const binaryStrength = typeof p.binaryStrength === "number"
    ? p.binaryStrength
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

function buildDiagnostics(pattern, lineage, payload) {
  const binarySurface = extractBinarySurfaceFromPayload(payload);

  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,
    stabilityTier: "v1-evo-stable-v11",

    // Binary surface (optional, non-breaking)
    binary: binarySurface
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v1 Organism (v11‑EvoStable + Binary-Aware)
// ============================================================================
export function createLegacyPulse({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  mode = "normal",
  pageId = "NO_PAGE"
}) {
  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  const patternAncestry       = buildPatternAncestry(pattern);
  const lineageSignature      = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  // ⭐ v1 stable advantage field
  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth: lineage.length,
    modeBias: mode === "stress" ? 2 : 1,
    stabilityTier: "v1-evo-stable-v11"
  };

  // ⭐ v1 stable health score
  const healthScore = 1.0;
  const tier = "stable";

  const diagnostics = buildDiagnostics(pattern, lineage, payload);

  return {
    PulseRole,
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    mode,
    pageId,

    pulseType: "Pulse-v1-EvoStable-v11",

    advantageField,
    healthScore,
    tier,

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      diagnostics,

      // ⭐ v11 signatures
      stableSignature: computeHash(pattern + "::" + lineageSignature),
      patternSignature: computeHash(pattern),
      lineageSurface: computeHash(String(lineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageField)),
      healthSignature: computeHash("1.0"),
      tierSignature: computeHash("stable")
    }
  };
}


// ============================================================================
//  FROM IMPULSE — build a v1 Pulse from an Impulse traveler
//  (Binary-aware but still stable / non-evolving)
// ============================================================================
export function legacyPulseFromImpulse(impulse, overrides = {}) {
  if (!impulse) return null;

  const payload = impulse.payload || {};

  const pattern       = overrides.pattern       || payload.pattern       || impulse.intent || "UNKNOWN_PATTERN";
  const jobId         = overrides.jobId         || payload.jobId         || impulse.tickId;
  const priority      = overrides.priority      || payload.priority      || "normal";
  const returnTo      = overrides.returnTo      || payload.returnTo      || null;
  const parentLineage = overrides.parentLineage || payload.parentLineage || null;
  const mode          = overrides.mode          || payload.mode          || "normal";
  const pageId        = overrides.pageId        || payload.pageId        || "NO_PAGE";

  // We pass payload through unchanged so any binary metadata (binaryPattern,
  // binaryMode, binaryPayload, binaryHints, binaryStrength) is preserved and
  // surfaced by diagnostics, but never used to evolve v1.
  return createLegacyPulse({
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    parentLineage,
    mode,
    pageId
  });
}
