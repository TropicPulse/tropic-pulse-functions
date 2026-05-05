// ============================================================================
//  FILE: PulseV3UnifiedOrganism-v16.js
//  Pulse v3 • Unified Organism • Evolution-Aware • Deterministic Compute Loop
//  v16-Immortal:
//    • Unified Advantage Surface (INTEL) + Degradation Tier v16
//    • Rich Diagnostics + Signature Surface
//    • Binary-Front-End Ready (full binary surface)
//    • ImmortalMeta v16 Surface (dual-band, harmonic, coherence)
//    • PulseIntelligence Surface (solvedness + factoring + computeTier)
//    • 16+: cacheChunk / prewarm / presence / degradation / immortal surfaces
//           exposed as first-class organism metadata
// ============================================================================
//
//  SAFETY CONTRACT (v16-Immortal):
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
  version: "v16-Immortal-INTEL",
  layer: "frontend",
  role: "unified_pulse_organism",
  lineage: "PulseOS-v16",

  evo: {
    unifiedOrganism: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    pulseIntelligenceReady: true,
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true,
    degradationAware: true,
    immortalMetaAware: true,
    binaryFrontEndReady: true
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
// ⭐ PulseRole — identifies this as the Pulse v3 unified organism (v16)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "16",
  identity: "Pulse-v3-Unified-v16-Immortal-INTEL",

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
    binaryFrontEndContract: "PulseBinaryUnifiedOrganism-v16-Immortal-INTEL",

    // Immortal meta awareness
    immortalMetaAware: true,
    dualBandAware: true,
    harmonicAware: true,
    coherenceAware: true,

    // 16+: cacheChunk / prewarm / presence / degradation / immortal surfaces
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true,
    degradationAware: true
  },

  routingContract: "PulseRouter-v16",
  meshContract: "PulseMesh-v16",
  sendContract: "PulseSend-v16",
  gpuOrganContract: "PulseGPU-v16",
  earnCompatibility: "PulseEarn-v16"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 131072;
  }
  return `h16_${h}`;
}

function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  const keys = Object.keys(v).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
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

  return computeHash(stableStringify(shape));
}

function computeDegradationTierV16(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  return (
    h >= 0.98 ? "microDegrade" :
    h >= 0.92 ? "softDegrade"  :
    h >= 0.60 ? "midDegrade"   :
    h >= 0.25 ? "hardDegrade"  :
    "criticalDegrade"
  );
}


// ============================================================================
//  BINARY SURFACE (v16) — optional, non-breaking
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

  const routerHint = p.routerHint ?? (binaryHints && binaryHints.routerHint) ?? null;
  const meshHint   = p.meshHint   ?? (binaryHints && binaryHints.meshHint)   ?? null;
  const organHint  = p.organHint  ?? (binaryHints && binaryHints.organHint)  ?? null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength,
    routerHint,
    meshHint,
    organHint
  };
}


// ============================================================================
//  IMMORTAL META SURFACE (v16)
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
//  PULSE INTELLIGENCE SURFACE (v16-INTEL)
// ============================================================================
function computePulseIntelligence({ pattern, lineage, payload, healthScore, binarySurface }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = typeof pattern === "string" ? pattern.length : 0;

  const maxPattern = 128;
  const maxPayload = 64;

  const patternComplexity = Math.min(patternLen / maxPattern, 1);
  const payloadComplexity = Math.min(payloadSize / maxPayload, 1);

  const binaryStrength = typeof binarySurface?.binaryStrength === "number"
    ? Math.min(Math.max(binarySurface.binaryStrength, 0), 1)
    : 0;

  const solvednessScore = Math.max(
    0,
    Math.min(
      healthScore * 0.6 +
      (1 - patternComplexity) * 0.15 +
      (1 - payloadComplexity) * 0.15 +
      binaryStrength * 0.10,
      1
    )
  );

  const factoringSignal =
    lineageDepth >= 4 || payloadSize >= 12
      ? "high"
      : lineageDepth >= 2 || payloadSize >= 4
        ? "medium"
        : "low";

  const computeTier =
    solvednessScore >= 0.9 ? "nearSolution" :
    solvednessScore >= 0.7 ? "highValue"    :
    solvednessScore >= 0.4 ? "normal"       :
    solvednessScore >= 0.2 ? "lowPriority"  :
    "avoidCompute";

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
//  16+ Surfaces — cacheChunk / prewarm / presence / degradation / immortal
// ============================================================================
function buildCacheChunkSurface({ pattern, lineage, pageId, mode }) {
  const shape = {
    pattern,
    lineageDepth: Array.isArray(lineage) ? lineage.length : 0,
    pageId,
    mode
  };
  const raw = stableStringify(shape);
  const cacheChunkKey = "pulse-v3-cache::" + computeHash(raw);

  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ priority, mode }) {
  let level = "none";

  if (priority === "critical" || priority === "high") level = "aggressive";
  else if (priority === "normal") level = "medium";
  else if (priority === "low") level = "light";

  const shape = { priority, mode };
  const raw = stableStringify(shape);
  const prewarmKey = "pulse-v3-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

function buildPresenceSurface({ pattern, pageId }) {
  let scope = "local";
  if (typeof pattern === "string") {
    if (pattern.includes("/global")) scope = "global";
    else if (pattern.includes("/page")) scope = "page";
  }

  const shape = { pattern, pageId, scope };
  const raw = stableStringify(shape);
  const presenceKey = "pulse-v3-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}

function buildDegradationSurface({ healthScore }) {
  const tier = computeDegradationTierV16(healthScore);
  return {
    healthScore,
    degradationTier: tier,
    degradationSignature: computeHash(tier)
  };
}

function buildImmortalSurface({ immortalMeta }) {
  const raw = stableStringify(immortalMeta);
  return {
    immortalMeta,
    immortalSignature: computeHash("immortal-v3::" + raw)
  };
}


// ============================================================================
//  DIAGNOSTICS (unified organism view + immortalMeta + intelligence + binary)
// ============================================================================
function buildDiagnostics({
  pattern,
  lineage,
  healthScore,
  tier,
  immortalSurface,
  pulseIntelligence,
  binarySurface,
  cacheChunkSurface,
  prewarmSurface,
  presenceSurface,
  degradationSurface
}) {
  const immortalMeta = immortalSurface.immortalMeta;

  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,

    // Immortal + intelligence
    immortal: immortalMeta,
    immortalSignature: immortalSurface.immortalSignature,

    intelligence: pulseIntelligence,
    intelligenceSignature: computeHash(stableStringify(pulseIntelligence)),

    // Binary surface
    binary: binarySurface,
    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null,
    binaryRouterHintHash: binarySurface.routerHint
      ? computeHash(binarySurface.routerHint)
      : null,
    binaryMeshHintHash: binarySurface.meshHint
      ? computeHash(binarySurface.meshHint)
      : null,
    binaryOrganHintHash: binarySurface.organHint
      ? computeHash(binarySurface.organHint)
      : null,

    // 16+ movement surfaces
    cacheChunkSurface,
    prewarmSurface,
    presenceSurface,
    degradationSurface
  };
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v3, v16 surface)
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

  const binarySurface = extractBinarySurfaceFromPayload(payload);
  const immortalMeta  = extractImmortalMeta(payload);

  const healthScore = (
    patternScore * 0.4 +
    lineageScore * 0.3 +
    payloadScore * 0.3
  );

  const pulseIntelligence = computePulseIntelligence({
    pattern,
    lineage,
    payload,
    healthScore,
    binarySurface
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

    unifiedTier: "v3-unified-v16-Immortal-INTEL",

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
    readinessScore: pulseIntelligence.readinessScore,

    // Binary-aware advantage surface
    binaryAware: binarySurface.hasBinary,
    binaryStrength: binarySurface.binaryStrength,
    binaryMode: binarySurface.binaryMode,
    binaryPattern: binarySurface.binaryPattern,
    routerHint: binarySurface.routerHint,
    meshHint: binarySurface.meshHint,
    organHint: binarySurface.organHint
  };

  return {
    advantageField,
    healthScore,
    immortalMeta,
    pulseIntelligence,
    binarySurface
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v3 Unified Organism (v16-Immortal-INTEL)
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
    pulseIntelligence,
    binarySurface
  } = runEvolutionComputeLoop({
    pattern,
    lineage,
    payload,
    mode
  });

  const tier = computeDegradationTierV16(healthScore);

  const cacheChunkSurface = buildCacheChunkSurface({
    pattern,
    lineage,
    pageId,
    mode
  });

  const prewarmSurface = buildPrewarmSurface({
    priority,
    mode
  });

  const presenceSurface = buildPresenceSurface({
    pattern,
    pageId
  });

  const degradationSurface = buildDegradationSurface({
    healthScore
  });

  const immortalSurface = buildImmortalSurface({
    immortalMeta
  });

  const diagnostics = buildDiagnostics({
    pattern,
    lineage,
    healthScore,
    tier,
    immortalSurface,
    pulseIntelligence,
    binarySurface,
    cacheChunkSurface,
    prewarmSurface,
    presenceSurface,
    degradationSurface
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
    pulseType: "Pulse-v3-Unified-v16-Immortal-INTEL",

    // Advantage + health
    advantageField,
    healthScore,
    tier,

    // Immortal meta surfaced at organism level
    immortalMeta,

    // Intelligence surfaced at organism level
    pulseIntelligence,

    // 16+ movement / presence surfaces
    cacheChunkSurface,
    prewarmSurface,
    presenceSurface,
    degradationSurface,
    immortalSurface,

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
      advantageSignature: computeHash(stableStringify(advantageField)),
      healthSignature: computeHash(String(healthScore)),
      tierSignature: computeHash(tier),
      pulseIntelligenceSignature: computeHash(stableStringify(pulseIntelligence))
    }
  };
}
