// ============================================================================
//  FILE: PulseV3UnifiedOrganism-v11-Evo.js
//  Pulse v3 • Unified Organism • Evolution-Aware • Deterministic Compute Loop
//  v11: Diagnostics + Signatures + Evolution Surface + Advantage Surface
// ============================================================================
//
//  ROLE (v3 vs v2):
//  ----------------
//  • Pulse v2 (your evolution engine) is a *specialized evolution core*.
//  • Pulse v3 is the *unified organism* view: it treats pattern+lineage+payload
//    as a single organism surface with a unified advantage field.
//
//  This file is the *symbolic* v3 organism core:
//    - It does NOT know about bits directly.
//    - It is designed to sit behind a binary front-end (e.g. a future
//      PulseBinaryUnifiedOrganism-v11-Evo).
//    - It exposes a unified advantage surface that binary layers can read.
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
// ⭐ PulseRole — identifies this as the Pulse v3 unified organism (v11-Evo)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "11.0",
  identity: "Pulse-v3-Unified-v11-Evo",

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

    // Evolution + advantage surface
    evolutionEngineReady: true,
    unifiedAdvantageField: true,
    pulseV3Ready: true,
    futureEvolutionReady: true,

    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // Binary integration flags:
    //   - This file is the *back-end* unified organism engine.
    //   - A separate binary organ will act as the front-end that speaks in bits.
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryUnifiedOrganism-v11-Evo"
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
//  These helpers define how v3 builds its unified organism identity:
//    - lineage: ancestry chain
//    - shapeSignature: pattern+lineage compressed
//    - evolutionStage: coarse growth stage
//    - ancestry signatures: pattern/lineage/page binding
//    - diagnostics: human/AI-readable health summary
// ============================================================================

function computeHash(str) {
  // v3-specific deterministic hash; small, bounded, and stable.
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// Build lineage chain (v3 can extend lineage deterministically)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// Deterministic shape signature
function computeShapeSignature(pattern, lineage) {
  const raw = `${pattern}::${lineage.join("::")}`;
  return `shape-${computeHash(raw)}`;
}

// Evolution stage classification (v3: simpler, unified)
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

function buildDiagnostics(pattern, lineage, healthScore) {
  // Diagnostics: unified organism view of health + structure.
  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length
  };
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v3, v11 surface)
// ============================================================================
//  v3's compute loop is a *unified advantage surface*:
//
//    - patternScore: how "large/complex" the pattern is
//    - lineageScore: how deep the ancestry is
//    - payloadScore: how rich the payload is
//
//  The advantageField is a structured description that a binary front-end
//  can read without understanding all symbolic details.
// ============================================================================

function runEvolutionComputeLoop({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const maxPattern = 64;
  const maxLineage = 16;
  const maxPayload = 32;

  const patternScore = Math.min(pattern.length / maxPattern, 1);
  const lineageScore = Math.min(lineageDepth / maxLineage, 1);
  const payloadScore = Math.min(payloadSize / maxPayload, 1);

  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth,
    payloadSize,
    modeBias:
      mode === "stress"   ? 3 :
      mode === "drain"    ? 2 :
      mode === "recovery" ? 2 :
      1,
    unifiedTier: "v3-unified-v11"
  };

  const healthScore = (
    patternScore * 0.4 +
    lineageScore * 0.3 +
    payloadScore * 0.3
  );

  return {
    advantageField,
    healthScore
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v3 Unified Organism (v11-Evo)
// ============================================================================
//  This is the "birth" function for a v3 unified organism instance.
//  A binary front-end will typically:
//
//    - derive pattern from bits / route / job
//    - derive payload from bits / metadata
//    - choose mode (normal/stress/drain/recovery)
//    - call createPulseV3
//
//  The result is a unified organism object with:
//    - PulseRole
//    - pattern/lineage/mode/payload
//    - advantageField + healthScore
//    - meta: signatures + diagnostics
// ============================================================================

export function createPulseV3({
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

  const { advantageField, healthScore } = runEvolutionComputeLoop({
    pattern,
    lineage,
    payload,
    mode
  });

  const diagnostics = buildDiagnostics(pattern, lineage, healthScore);

  return {
    // Identity + contracts
    PulseRole,

    // Core organism identity
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    mode,
    pageId,

    // Unified organism type
    pulseType: "Pulse-v3-Unified-v11",

    // Advantage + health
    advantageField,
    healthScore,

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
      healthSignature: computeHash(String(healthScore))
    }
  };
}
