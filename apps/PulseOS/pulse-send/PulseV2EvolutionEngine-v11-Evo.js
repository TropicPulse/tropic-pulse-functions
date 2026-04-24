// ============================================================================
//  FILE: PulseV2EvolutionEngine-v11-Evo.js
//  Pulse v2 • Evolution Engine • Experimental Trait Layer (Compute Inside Pulse)
//  v11: Diagnostics + Signatures + Evolution Surface + Advantage Surface
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
//  It does NOT know about bits directly.
//  It is designed to sit behind a binary front-end (e.g. a future
//  PulseBinaryV2EvolutionEngine-v11-Evo) that:
//    - Accepts bits.
//    - Derives pattern/mode/payload from binary.
//    - Calls createPulseV2.
//    - Uses advantageField + healthScore + tier to route work.
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic compute loop only.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v2 evolution engine (v11-Evo)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "11.0",
  identity: "Pulse-v2-EvolutionEngine-v11-Evo",

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
//   - A separate binary organ will act as the front-end that speaks in bits.
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryV2EvolutionEngine-v11-Evo"
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
//  These helpers define how v2 builds its evolution identity:
//    - lineage: ancestry chain
//    - shapeSignature: pattern+lineage compressed
//    - evolutionStage: coarse growth stage
//    - ancestry signatures: pattern/lineage/page binding
//    - diagnostics: human/AI-readable health summary
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
  // Append the new pattern to the existing lineage, forming a simple ancestry chain.
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  // Shape = pattern + lineage combined into a single signature.
  const raw = `${pattern}::${lineage.join("::")}`;
  return `shape-${computeHash(raw)}`;
}

function computeEvolutionStage(pattern, lineage) {
  // v2 evolution stage: more "wild" at deeper depths.
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
  // Page ancestry is a compact way to tie pattern+lineage to a page context.
  const shape = {
    pattern,
    patternAncestry: buildPatternAncestry(pattern),
    lineageSignature: buildLineageSignature(lineage),
    pageId: pageId || "NO_PAGE"
  };

  return computeHash(JSON.stringify(shape));
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v11 — enhanced v2 tier)
// ============================================================================
//  v2's compute loop is an *experimental trait layer*:
//
//    - patternScore: how "large/complex" the pattern is
//    - lineageScore: how deep the ancestry is
//    - payloadScore: how rich the payload is
//
//  The advantageField is a structured description that routers/meshes/binary
//  front-ends can read to understand "strength" and context.
// ============================================================================

function runEvolutionComputeLoopV2({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = pattern.length;

  const advantageField = {
    patternStrength: patternLen,
    lineageDepth,
    payloadSize,
    modeBias:
      mode === "stress"   ? 4 :
      mode === "drain"    ? 3 :
      mode === "recovery" ? 2 :
      1,
    experimentalTier: "v2-evolution-engine-v11"
  };

  const maxPattern = 64;
  const maxLineage = 16;
  const maxPayload = 32;

  const patternScore = Math.min(patternLen / maxPattern, 1);
  const lineageScore = Math.min(lineageDepth / maxLineage, 1);
  const payloadScore = Math.min(payloadSize / maxPayload, 1);

  const healthScore = (
    patternScore * 0.5 +
    lineageScore * 0.3 +
    payloadScore * 0.2
  );

  return {
    advantageField,
    healthScore
  };
}

function buildDiagnostics(pattern, lineage, healthScore, tier) {
  // Diagnostics: evolution engine view of health + structure + tier.
  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v2 Evolution Engine Organism (v11-Evo)
// ============================================================================
//  This is the "birth" function for a v2 evolution instance.
//  A binary front-end will typically:
//
//    - derive pattern from bits / route / job
//    - derive payload from bits / metadata
//    - choose mode (normal/stress/drain/recovery)
//    - call createPulseV2
//
//  The result is a v2 evolution object with:
//    - PulseRole
//    - pattern/lineage/mode/payload
//    - advantageField + healthScore + tier
//    - meta: signatures + diagnostics
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
  const lineage              = buildLineage(parentLineage, pattern);
  const shapeSignature       = computeShapeSignature(pattern, lineage);
  const evolutionStage       = computeEvolutionStage(pattern, lineage);
  const patternAncestry      = buildPatternAncestry(pattern);
  const lineageSignature     = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  const { advantageField, healthScore } = runEvolutionComputeLoopV2({
    pattern,
    lineage,
    payload,
    mode
  });

  const tier =
    healthScore >= 0.95 ? "microDegrade" :
    healthScore >= 0.85 ? "softDegrade" :
    healthScore >= 0.50 ? "midDegrade" :
    healthScore >= 0.15 ? "hardDegrade" :
    "criticalDegrade";

  const diagnostics = buildDiagnostics(pattern, lineage, healthScore, tier);

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
    pulseType: "Pulse-v2-EvolutionEngine-v11",

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
