// ============================================================================
//  FILE: PulseV3UnifiedOrganism-v14.4-IMMORTAL.js
//  Pulse v3 • Unified Organism • Evolution-Aware • Deterministic Compute Loop
//  v14.4: Unified Advantage Surface + Degradation Tier + Rich Diagnostics
//         + Signature Surface + Binary-Front-End Ready + ImmortalMeta Surface
//         + PulseIntelligence Surface (solvedness + factoring + computeTier)
// ============================================================================
//
//  ROLE (v3 vs v2):
//  ----------------
//  • Pulse v2 (evolution engine) is a *specialized evolution core*.
//  • Pulse v3 is the *unified organism* view: pattern+lineage+payload as a
//    single organism surface with a unified advantage field.
//
//  This file is the *symbolic* v3 organism core:
//    - It does NOT know about bits directly.
//    - It is designed to sit behind a binary front-end.
//    - It exposes a unified advantage surface + tier + diagnostics that
//      binary layers can read without understanding all symbolic details.
//    - v14.4: also surfaces immortalMeta (presenceBandState, harmonicDrift,
//      coherenceScore, dualBandMode, shifterBand).
//    - v14.4-INTEL: adds pulseIntelligence (solvedness, factoring, computeTier,
//      payloadComplexity, readinessScore, evolutionDepth).
//
//  SAFETY CONTRACT (v14.4-IMMORTAL):
//  ---------------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic compute loop only.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseV3UnifiedOrganism",
  version: "v14.4-EVO-INTEL",
  layer: "frontend",
  role: "unified_pulse_organism",
  lineage: "PulseOS-v12",

  evo: {
    unifiedOrganism: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    pulseIntelligenceReady: true
  },

  contract: {
    always: [
      "PulseSendSystem",
      "PulseV2EvolutionEngine"
    ],
    never: [
      "legacyUnifiedOrganism",
      "legacyPulse",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v3 unified organism (v14.4)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "14.4",
  identity: "Pulse-v3-Unified-v14.4-IMMORTAL-INTEL",

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

    // Diagnostics + signatures + evolution surface
    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,
    degradationTierReady: true,
    healthScoreReady: true,
    patternSurfaceReady: true,
    lineageSurfaceReady: true,

    // Intelligence surface
    pulseIntelligenceReady: true,
    solvednessAware: true,
    factoringAware: true,
    computeTierAware: true,

    // Binary integration flags:
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryUnifiedOrganism-v14.4-IMMORTAL-INTEL",

    // Immortal meta awareness
    immortalMetaAware: true,
    dualBandAware: true,
    harmonicAware: true,
    coherenceAware: true
  },

  routingContract: "PulseRouter-v14.4",
  meshContract: "PulseMesh-v14.4",
  sendContract: "PulseSend-v14.4",
  gpuOrganContract: "PulseGPU-v14.4",
  earnCompatibility: "PulseEarn-v14.4"
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

function computeDegradationTier(healthScore) {
  return (
    healthScore >= 0.95 ? "microDegrade" :
    healthScore >= 0.85 ? "softDegrade"  :
    healthScore >= 0.50 ? "midDegrade"   :
    healthScore >= 0.15 ? "hardDegrade"  :
    "criticalDegrade"
  );
}


// ============================================================================
//  IMMORTAL META SURFACE (v14.4)
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
//  PULSE INTELLIGENCE SURFACE (v14.4-INTEL)
//  Deterministic, symbolic "compute" surface: no device load, pure logic.
//  - solvednessScore: how close this pulse feels to "ready / solved"
//  - factoringSignal: how much structure / reuse potential exists
//  - computeTier: how much real compute this pulse *deserves* if any
//  - payloadComplexity: structural richness of payload
//  - evolutionDepth: lineage depth as an intelligence proxy
//  - readinessScore: combined readiness for heavy work
// ============================================================================
function computePulseIntelligence({ pattern, lineage, payload, healthScore }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = typeof pattern === "string" ? pattern.length : 0;

  // Normalized structural complexity
  const maxPattern = 128;
  const maxPayload = 64;

  const patternComplexity = Math.min(patternLen / maxPattern, 1);
  const payloadComplexity = Math.min(payloadSize / maxPayload, 1);

  // More health + less complexity → higher solvedness
  const solvednessScore = Math.max(
    0,
    Math.min(
      healthScore * 0.7 + (1 - patternComplexity) * 0.15 + (1 - payloadComplexity) * 0.15,
      1
    )
  );

  // Factoring signal: how much structure is available to reuse
  const factoringSignal =
    lineageDepth >= 4 || payloadSize >= 12
      ? "high"
      : lineageDepth >= 2 || payloadSize >= 4
        ? "medium"
        : "low";

  // Compute tier: how much heavy compute this pulse deserves
  const computeTier =
    solvednessScore >= 0.9 ? "nearSolution" :
    solvednessScore >= 0.7 ? "highValue"    :
    solvednessScore >= 0.4 ? "normal"       :
    solvednessScore >= 0.2 ? "lowPriority"  :
    "avoidCompute";

  // Readiness: how "ready" this pulse is to be handed to a miner/GPU
  const readinessScore = Math.max(
    0,
    Math.min(
      solvednessScore * 0.6 +
      healthScore * 0.3 +
      (factoringSignal === "high" ? 0.1 : factoringSignal === "medium" ? 0.05 : 0),
      1
    )
  );

  return {
    solvednessScore,
    factoringSignal,
    computeTier,
    payloadComplexity,
    evolutionDepth: lineageDepth,
    readinessScore
  };
}


// ============================================================================
//  DIAGNOSTICS (unified organism view + immortalMeta + intelligence)
// ============================================================================
function buildDiagnostics({ pattern, lineage, healthScore, tier, immortalMeta, pulseIntelligence }) {
  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,

    immortal: immortalMeta,
    immortalSignature: computeHash(JSON.stringify(immortalMeta)),

    intelligence: pulseIntelligence,
    intelligenceSignature: computeHash(JSON.stringify(pulseIntelligence))
  };
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v3, v14.4 surface)
// ============================================================================
//
//  v3's compute loop is a *unified advantage surface*:
//
//    - patternScore: how "large/complex" the pattern is
//    - lineageScore: how deep the ancestry is
//    - payloadScore: how rich the payload is
//
//  v14.4: immortalMeta is surfaced into advantageField but does not
//         change the core scoring behavior (non-breaking).
//  v14.4-INTEL: pulseIntelligence is computed alongside healthScore and
//               surfaced for higher layers (Shifter, Mesh, Earn, etc.).
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

  const immortalMeta = extractImmortalMeta(payload);

  const healthScore = (
    patternScore * 0.4 +
    lineageScore * 0.3 +
    payloadScore * 0.3
  );

  const pulseIntelligence = computePulseIntelligence({
    pattern,
    lineage,
    payload,
    healthScore
  });

  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth,
    payloadSize,
    modeBias:
      mode === "stress"   ? 3 :
      mode === "drain"    ? 2 :
      mode === "recovery" ? 2 :
      1,

    unifiedTier: "v3-unified-v14.4-IMMORTAL-INTEL",

    // Immortal meta surfaced for higher layers
    presenceBandState: immortalMeta.presenceBandState,
    harmonicDrift: immortalMeta.harmonicDrift,
    coherenceScore: immortalMeta.coherenceScore,
    dualBandMode: immortalMeta.dualBandMode,
    shifterBand: immortalMeta.shifterBand,

    // Intelligence surfaced for routing / Earn / GPU organs
    solvednessScore: pulseIntelligence.solvednessScore,
    factoringSignal: pulseIntelligence.factoringSignal,
    computeTier: pulseIntelligence.computeTier,
    payloadComplexity: pulseIntelligence.payloadComplexity,
    readinessScore: pulseIntelligence.readinessScore
  };

  return {
    advantageField,
    healthScore,
    immortalMeta,
    pulseIntelligence
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v3 Unified Organism (v14.4-IMMORTAL-INTEL)
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

  const {
    advantageField,
    healthScore,
    immortalMeta,
    pulseIntelligence
  } = runEvolutionComputeLoop({
    pattern,
    lineage,
    payload,
    mode
  });

  const tier = computeDegradationTier(healthScore);
  const diagnostics = buildDiagnostics({
    pattern,
    lineage,
    healthScore,
    tier,
    immortalMeta,
    pulseIntelligence
  });

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
    pulseType: "Pulse-v3-Unified-v14.4-IMMORTAL-INTEL",

    // Advantage + health
    advantageField,
    healthScore,
    tier,

    // Immortal meta surfaced at organism level
    immortalMeta,

    // Intelligence surfaced at organism level
    pulseIntelligence,

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
      tierSignature: computeHash(tier),
      pulseIntelligenceSignature: computeHash(JSON.stringify(pulseIntelligence))
    }
  };
}
