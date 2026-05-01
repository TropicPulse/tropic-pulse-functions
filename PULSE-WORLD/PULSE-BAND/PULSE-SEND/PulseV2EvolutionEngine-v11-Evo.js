// ============================================================================
//  FILE: PulseV2EvolutionEngine-v12.4-Evo.js
//  Pulse v2 • Evolution Engine • Experimental Trait Layer (Compute Inside Pulse)
//  v12.4: Binary-Aware Evolution Surface + Enhanced Advantage + Rich Diagnostics
// ============================================================================
//
//  ROLE:
//  -----
//  This organ is the *Pulse v2 evolution engine* — the experimental trait layer
//  that computes evolution *inside* a Pulse.
//
//  It is a symbolic evolution core that:
//    - Takes pattern + lineage + payload + mode.
//    - Computes a deterministic advantageField (evolution surface).
//    - Computes a normalized healthScore and a coarse degradation tier.
//    - Emits signatures and diagnostics for routing, mesh, and higher layers.
//
//  v12.4 Binary-Aware Back-End:
//    - Still does NOT accept bits directly.
//    - If payload carries binary metadata (binaryPattern, binaryMode,
//      binaryPayload, binaryHints, binaryStrength), it is surfaced:
//        • in diagnostics.binary
//        • in advantageField.binary* fields (non-breaking)
//    - Behavior remains deterministic and stable if no binary metadata exists.
//
//  SAFETY CONTRACT (v12.4-Evo):
//  ----------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic compute loop only.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v2 evolution engine (v12.4-Evo)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "12.4",
  identity: "Pulse-v2-EvolutionEngine-v12.4-Evo",

  evo: {
    // Core evolution awareness
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,

    // Ready to cooperate with routing/mesh organs
    routerAwareReady: true,
    meshAwareReady: true,

    // Explicitly an evolution engine
    evolutionEngineReady: true,
    unifiedAdvantageField: true,
    pulseV2Ready: true,
    futureEvolutionReady: true,

    // Diagnostics + signatures + evolution surface
    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // Binary integration flags:
    //   - This file is the *back-end* evolution engine.
    //   - A separate binary organ acts as the front-end that speaks in bits.
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryV2EvolutionEngine-v12.4-Evo"
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
  // v2-specific deterministic hash; small, bounded, and stable.
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
  const raw = `${pattern}::${lineage.join("::")}`;
  return `shape-${computeHash(raw)}`;
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
//  INTERNAL: Deterministic evolution compute loop (v12.4 — enhanced v2 tier)
// ============================================================================
//
//  v2's compute loop is an *experimental trait layer*:
//
//    - patternScore: how "large/complex" the pattern is
//    - lineageScore: how deep the ancestry is
//    - payloadScore: how rich the payload is
//    - binaryScore: optional, derived from binaryStrength if present
//
//  advantageField is extended to surface binary context but remains
//  non-breaking for purely symbolic pulses.
// ============================================================================

function runEvolutionComputeLoopV2({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = pattern.length;

  const binarySurface = extractBinarySurfaceFromPayload(payload);
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

    // v12.4 evolution tier label
    experimentalTier: "v2-evolution-engine-v12.4",

    // Binary-aware advantage surface (optional, non-breaking)
    binaryAware: binarySurface.hasBinary,
    binaryStrength,
    binaryMode: binarySurface.binaryMode,
    binaryPattern: binarySurface.binaryPattern
  };

  const maxPattern = 64;
  const maxLineage = 16;
  const maxPayload = 32;

  const patternScore = Math.min(patternLen / maxPattern, 1);
  const lineageScore = Math.min(lineageDepth / maxLineage, 1);
  const payloadScore = Math.min(payloadSize / maxPayload, 1);
  const binaryScore  = Math.min(Math.max(binaryStrength, 0), 1);

  // v12.4: binaryScore participates but never dominates.
  const healthScore = (
    patternScore * 0.45 +
    lineageScore * 0.25 +
    payloadScore * 0.20 +
    binaryScore  * 0.10
  );

  return {
    advantageField,
    healthScore,
    binarySurface
  };
}

function buildDiagnostics(pattern, lineage, healthScore, tier, binarySurface) {
  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,

    // v12.4 binary diagnostics surface
    binary: binarySurface,
    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v2 Evolution Engine Organism (v12.4-Evo)
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
    binarySurface
  } = runEvolutionComputeLoopV2({
    pattern,
    lineage,
    payload,
    mode
  });

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
    binarySurface
  );

  return {
    // Identity + contracts
    PulseRole,

    // Core pulse identity
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    mode,
    pageId,

    // Evolution engine type
    pulseType: "Pulse-v2-EvolutionEngine-v12.4",

    // Advantage + health
    advantageField,
    healthScore,
    tier,

    // Meta: signatures + diagnostics
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
