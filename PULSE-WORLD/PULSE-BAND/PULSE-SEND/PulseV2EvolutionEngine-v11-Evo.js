// ============================================================================
//  FILE: PulseV2EvolutionEngine-v14.4-IMMORTAL.js
//  Pulse v2 • Evolution Engine • Experimental Trait Layer (Compute Inside Pulse)
//  v14.4: Binary-Aware + ImmortalMeta + Degradation v14 + DualBand + Rich Diagnostics
// ============================================================================
//
//  ROLE:
//    • Symbolic evolution engine (v2 tier).
//    • Computes deterministic advantageField.
//    • Computes healthScore + 14.4 degradation tier.
//    • Surfaces binary metadata (non-breaking).
//    • Surfaces immortalMeta (presenceBandState, harmonicDrift, coherenceScore,
//      dualBandMode, shifterBand).
//    • Deterministic, stable, no randomness.
//
//  SAFETY CONTRACT (v14.4-IMMORTAL):
//    • No imports.
//    • No randomness.
//    • No timestamps.
//    • No external mutation.
//    • Pure deterministic compute loop.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseV2EvolutionEngine",
  version: "v14.4-EVO",
  layer: "frontend",
  role: "evolution_engine_v2",
  lineage: "PulseOS-v12",

  evo: {
    evolutionCore: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseSendSystem",
      "PulseV3UnifiedOrganism"
    ],
    never: [
      "legacyEvolutionEngine",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v2 evolution engine (v14.4)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "14.4",
  identity: "Pulse-v2-EvolutionEngine-v14.4-IMMORTAL",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,

    routerAwareReady: true,
    meshAwareReady: true,

    evolutionEngineReady: true,
    unifiedAdvantageField: true,
    pulseV2Ready: true,
    futureEvolutionReady: true,

    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // Binary integration
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryV2EvolutionEngine-v14.4-IMMORTAL",

    // IMMORTAL META
    immortalMetaAware: true,
    dualBandAware: true,
    harmonicAware: true,
    coherenceAware: true,

    // 14.4 degradation
    degradationAware: true
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
    h = (h + str.charCodeAt(i) * (i + 3)) % 100000;
  }
  return `h${h}`;
}

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  return `shape-${computeHash(pattern + "::" + lineage.join("::"))}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;
  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  if (depth === 4) return "canopy";
  return "wild";
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


// ============================================================================
//  BINARY SURFACE — optional, non-breaking
// ============================================================================
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


// ============================================================================
//  IMMORTAL META SURFACE (14.4)
// ============================================================================
function extractImmortalMeta(payload) {
  const m = payload?.immortalMeta || {};
  return {
    presenceBandState: m.presenceBandState ?? null,
    harmonicDrift: m.harmonicDrift ?? null,
    coherenceScore: m.coherenceScore ?? null,
    dualBandMode: m.dualBandMode ?? null,
    shifterBand: m.shifterBand ?? null
  };
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v14.4)
// ============================================================================
function runEvolutionComputeLoopV2({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = pattern.length;

  const binarySurface = extractBinarySurfaceFromPayload(payload);
  const immortalMeta  = extractImmortalMeta(payload);

  const binaryStrength = typeof binarySurface.binaryStrength === "number"
    ? binarySurface.binaryStrength
    : 0;

  const advantageField = {
    patternStrength: patternLen,
    lineageDepth,
    payloadSize,

    modeBias:
      mode === "stress"   ? 4 :
      mode === "drain"    ? 3 :
      mode === "recovery" ? 2 :
      1,

    experimentalTier: "v2-evolution-engine-v14.4-IMMORTAL",

    // Binary-aware advantage surface
    binaryAware: binarySurface.hasBinary,
    binaryStrength,
    binaryMode: binarySurface.binaryMode,
    binaryPattern: binarySurface.binaryPattern,

    // IMMORTAL META surfaced
    presenceBandState: immortalMeta.presenceBandState,
    harmonicDrift: immortalMeta.harmonicDrift,
    coherenceScore: immortalMeta.coherenceScore,
    dualBandMode: immortalMeta.dualBandMode,
    shifterBand: immortalMeta.shifterBand
  };

  const maxPattern = 64;
  const maxLineage = 16;
  const maxPayload = 32;

  const patternScore = Math.min(patternLen / maxPattern, 1);
  const lineageScore = Math.min(lineageDepth / maxLineage, 1);
  const payloadScore = Math.min(payloadSize / maxPayload, 1);
  const binaryScore  = Math.min(Math.max(binaryStrength, 0), 1);

  // v14.4: binaryScore participates but never dominates.
  const healthScore = (
    patternScore * 0.45 +
    lineageScore * 0.25 +
    payloadScore * 0.20 +
    binaryScore  * 0.10
  );

  return {
    advantageField,
    healthScore,
    binarySurface,
    immortalMeta
  };
}


// ============================================================================
//  DIAGNOSTICS (14.4)
// ============================================================================
function buildDiagnostics(pattern, lineage, healthScore, tier, binarySurface, immortalMeta) {
  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,

    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",

    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,

    binary: binarySurface,
    immortal: immortalMeta,

    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,

    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null,

    immortalSignature: computeHash(JSON.stringify(immortalMeta))
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v2 Evolution Engine Organism (v14.4-IMMORTAL)
// ============================================================================
export function createPulseV2({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  mode = "normal",
  pageId = "NO_PAGE"
}) {
  const lineage               = buildLineage(parentLineage, pattern);
  const shapeSignature        = computeShapeSignature(pattern, lineage);
  const evolutionStage        = computeEvolutionStage(pattern, lineage);
  const patternAncestry       = buildPatternAncestry(pattern);
  const lineageSignature      = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  const {
    advantageField,
    healthScore,
    binarySurface,
    immortalMeta
  } = runEvolutionComputeLoopV2({
    pattern,
    lineage,
    payload,
    mode
  });

  // v14.4 degradation tier
  const tier =
    healthScore >= 0.97 ? "microDegrade" :
    healthScore >= 0.90 ? "softDegrade" :
    healthScore >= 0.60 ? "midDegrade" :
    healthScore >= 0.25 ? "hardDegrade" :
    "criticalDegrade";

  const diagnostics = buildDiagnostics(
    pattern,
    lineage,
    healthScore,
    tier,
    binarySurface,
    immortalMeta
  );

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

    pulseType: "Pulse-v2-EvolutionEngine-v14.4-IMMORTAL",

    advantageField,
    healthScore,
    tier,

    immortalMeta,

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      diagnostics,

      evolutionSignature: computeHash(pattern + "::" + lineageSignature),
      patternSignature: computeHash(pattern),
      lineageSurface: computeHash(String(lineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageField)),
      healthSignature: computeHash(String(healthScore)),
      tierSignature: computeHash(tier)
    }
  };
}
