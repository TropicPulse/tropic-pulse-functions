// ============================================================================
//  FILE: PulseShifterEvolutionaryPulse-v11-Evo.js
//  Pulse v2 Organism • Evolution Engine • Pattern + Lineage + Shape
//  v11-Evo: Diagnostics + Signatures + Ancestry + Evolution Surface
// ============================================================================
//
//  ROLE:
//  -----
//  This organ is the *pure evolution core* for Pulse v2.
//
//  It does NOT know about bits, binary pulses, or UI.
//  It only knows about:
//    - pattern: a symbolic identifier for the work / route / job
//    - lineage: the historical chain of patterns
//    - shape: how pattern + lineage combine into a "shape signature"
//    - advantageField: a deterministic "fitness" / advantage surface
//    - healthScore: a normalized health metric for this pulse
//    - tier: a coarse degradation tier based on healthScore
//
//  This engine is designed to sit BEHIND a binary front-end such as
//  PulseBinaryShifterEvolutionaryPulse-v11-Evo, which will:
//    - accept bits
//    - derive pattern/mode/payload hints
//    - call createPulseV2 / evolvePulseV2
//    - emit compact, binary-friendly summaries
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No imports.
//  • No network.
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
  identity: "PulseShifterEvolutionaryPulse-v11-Evo",

  evo: {
    // Core evolution capabilities
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

    // Advantage field is unified so a binary front-end can read it
    unifiedAdvantageField: true,
    pulseV2Ready: true,
    futureEvolutionReady: true,

    // Diagnostics + signatures + evolution surface
    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // Binary integration flags:
    //   - This file is the *back-end* evolution engine.
    //   - A separate binary organ (PulseBinaryShifterEvolutionaryPulse-v11-Evo)
    //     will act as the front-end that speaks in bits.
    binaryBackEndReady: true,
    binaryFrontEndContract: "PulseBinaryShifterEvolutionaryPulse-v11-Evo"
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
//  These helpers are intentionally small and self-contained. They define how
//  patterns, lineages, and shapes are turned into signatures and diagnostics.
//  They are the "symbolic math" behind the evolution engine.
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
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;
  return `shape-${computeHash(raw)}`;
}

function computeEvolutionStage(pattern, lineage) {
  // Simple, human-readable stage based on lineage depth.
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  if (depth === 4) return "canopy";
  return "wild";
}

// v2-style deterministic pattern evolution
// This is where a front-end (router/mesh/binary) can inject hints.
function evolvePattern(pattern, context = {}) {
  const { routerHint, meshHint, organHint } = context;

  const parts = [pattern];

  if (routerHint) parts.push(`r:${routerHint}`);
  if (meshHint) parts.push(`m:${meshHint}`);
  if (organHint) parts.push(`o:${organHint}`);

  return parts.join("|");
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

function buildDiagnostics(pattern, lineage, healthScore, tier) {
  // Diagnostics are a human/AI-readable summary of the evolution state.
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
//  INTERNAL: Deterministic evolution compute loop (v2 — experimental tier)
// ============================================================================
//  This is the core "advantage field" computation. It takes symbolic inputs
//  (pattern, lineage, payload, mode) and produces:
//    - advantageField: a structured description of "strength" and context
//    - healthScore: a normalized [0..1] health metric
//
//  A binary front-end can:
//    - feed patterns/modes derived from bits
//    - read advantageField + healthScore
//    - route or prioritize work accordingly
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


// ============================================================================
//  FACTORY — Create a Pulse v2 Evolution Engine Organism (v11-Evo)
// ============================================================================
//  This is the "birth" function for a Pulse v2 evolution instance.
//  A binary front-end will typically call this after deriving:
//    - pattern (from bits / route / job)
//    - payload (metadata)
//    - mode (stress/drain/recovery/normal)
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


// ============================================================================
//  EVOLUTION ENGINE — evolve an existing Pulse deterministically (v2 style)
// ============================================================================
//  This is the "next step" function. A binary front-end or router/mesh can:
//    - take an existing pulse
//    - provide context hints (routerHint, meshHint, organHint)
//    - get back a new pulse with updated pattern/lineage/advantage/health
// ============================================================================

export function evolvePulseV2(pulse, context = {}) {
  const nextPattern    = evolvePattern(pulse.pattern, context);
  const nextLineage    = buildLineage(pulse.lineage, nextPattern);
  const shapeSignature = computeShapeSignature(nextPattern, nextLineage);
  const evolutionStage = computeEvolutionStage(nextPattern, nextLineage);

  const patternAncestry       = buildPatternAncestry(nextPattern);
  const lineageSignature      = buildLineageSignature(nextLineage);
  const pageId                = pulse.pageId || "NO_PAGE";
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern: nextPattern,
    lineage: nextLineage,
    pageId
  });

  const { advantageField, healthScore } = runEvolutionComputeLoopV2({
    pattern: nextPattern,
    lineage: nextLineage,
    payload: pulse.payload,
    mode: pulse.mode || "normal"
  });

  const tier =
    healthScore >= 0.95 ? "microDegrade" :
    healthScore >= 0.85 ? "softDegrade" :
    healthScore >= 0.50 ? "midDegrade" :
    healthScore >= 0.15 ? "hardDegrade" :
    "criticalDegrade";

  const diagnostics = buildDiagnostics(nextPattern, nextLineage, healthScore, tier);

  return {
    // Identity + contracts
    PulseRole,

    // Core pulse identity (carried forward)
    jobId: pulse.jobId,
    pattern: nextPattern,
    payload: pulse.payload,
    priority: pulse.priority,
    returnTo: pulse.returnTo,
    lineage: nextLineage,
    mode: pulse.mode || "normal",
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

      evolutionSignature: computeHash(nextPattern + "::" + lineageSignature),
      patternSignature: computeHash(nextPattern),
      lineageSurface: computeHash(String(nextLineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageField)),
      healthSignature: computeHash(String(healthScore)),
      tierSignature: computeHash(tier)
    }
  };
}
