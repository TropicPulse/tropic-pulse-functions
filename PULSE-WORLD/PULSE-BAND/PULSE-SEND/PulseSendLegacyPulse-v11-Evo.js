// ============================================================================
//  PulseSendLegacyPulse-v14.4-IMMORTAL.js
//  Pulse v1 Organism • Stable Evolutionary Floor • Non-Evolving
//  v14.4: Binary + CacheChunk + Prewarm + Presence + Degradation + ImmortalMeta
//         (Stable-Plus-IMMORTAL)
// ============================================================================
//
//  ROLE:
//    • v1 is the *stable floor* of the organism stack.
//    • It never evolves, never mutates, never computes evolution tiers.
//    • It surfaces 12.3+ metadata (cacheChunk, prewarm, presence, degradation, immortalMeta).
//    • It does NOT use these surfaces to evolve or change behavior.
//    • Deterministic, stable, non-evolving, non-computing.
//
//  SAFETY CONTRACT (v14.4-IMMORTAL-EvoStable):
//  ------------------------------------------
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic, stable, non-evolving organism.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseSendLegacyPulse",
  version: "v14.4-IMMORTAL",
  layer: "frontend",
  role: "legacy_pulse_floor",
  lineage: "PulseOS-v12",

  evo: {
    immutable: true,
    noEvolution: true,
    deterministic: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseSendSystem"
    ],
    never: [
      "legacyLegacyPulse",
      "legacyEvolutionEngine",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v1 Stable Organism (v14.4 IMMORTAL)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "14.4",
  identity: "Pulse-v1-EvoStable-v14.4-IMMORTAL",

  evo: {
    // v1 is stable, non-evolving, deterministic
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,

    // v1 participates in routing/mesh/send but does NOT evolve
    routerAwareReady: true,
    meshAwareReady: true,
    sendAwareReady: true,

    // v1 does NOT run evolution compute loops
    evolutionEngineReady: false,
    pulseV1Ready: true,
    pulseV2Ready: false,
    pulseV3Ready: false,

    // v1 surfaces only metadata (cache, prewarm, presence, immortal)
    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: false,

    // IMMORTAL META
    immortalMetaAware: true,
    dualBandAware: true,
    harmonicAware: true,
    coherenceAware: true,

    // v1 degradation surfaces (metadata only)
    degradationAware: true,

    // v1 does NOT support intelligence compute
    pulseIntelligenceReady: false,
    solvednessAware: false,
    factoringAware: false,
    computeTierAware: false
  },

  // Contracts for compatibility with the rest of the organism
  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  sendContract: "PulseSend-v11",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 3)) % 131072;
  }
  return `h12_${h}`;
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
  return `shape-${computeHash(pattern + "::" + lineage.join("::"))}`;
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
  return computeHash(stableStringify(shape));
}

function extractBinarySurface(payload) {
  const p = payload || {};

  const binaryPattern  = p.binaryPattern || null;
  const binaryMode     = p.binaryMode || null;
  const binaryPayload  = p.binaryPayload || null;
  const binaryHints    = p.binaryHints || null;
  const binaryStrength = typeof p.binaryStrength === "number" ? p.binaryStrength : null;

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

function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function extractImmortalMeta(payload) {
  const meta = payload?.immortalMeta || {};
  return {
    presenceBandState: meta.presenceBandState ?? null,
    harmonicDrift: meta.harmonicDrift ?? null,
    coherenceScore: meta.coherenceScore ?? null,
    dualBandMode: meta.dualBandMode ?? null,
    shifterBand: meta.shifterBand ?? null
  };
}


// ============================================================================
//  12.3 surfaces — surfaced only, never used for evolution
// ============================================================================
function buildCacheChunkSurface({ pattern, lineage, pageId }) {
  const shape = { pattern, lineage, pageId };
  const raw = stableStringify(shape);
  const cacheChunkKey = "pulse-v1-cache::" + computeHash(raw);

  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ priority }) {
  let level = "none";
  if (priority === "critical" || priority === "high") level = "aggressive";
  else if (priority === "normal") level = "medium";
  else if (priority === "low") level = "light";

  const raw = stableStringify({ priority });
  const prewarmKey = "pulse-v1-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

function buildPresenceSurface({ pattern }) {
  let scope = "local";
  if (pattern.includes("/global")) scope = "global";
  else if (pattern.includes("/page")) scope = "page";

  const raw = stableStringify({ pattern, scope });
  const presenceKey = "pulse-v1-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}


// ============================================================================
//  14.4 surfaces — degradation + immortalMeta (metadata only)
// ============================================================================
function buildDegradationSurface({ healthScore }) {
  const tier = classifyDegradationTier(healthScore);
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
    immortalSignature: computeHash("immortal-v1::" + raw)
  };
}


// ============================================================================
//  DIAGNOSTICS (stable, non-evolving)
// ============================================================================
function buildDiagnostics(pattern, lineage, payload, healthScore) {
  const binarySurface = extractBinarySurface(payload);
  const degradationSurface = buildDegradationSurface({ healthScore });
  const immortalMeta = extractImmortalMeta(payload);
  const immortalSurface = buildImmortalSurface({ immortalMeta });

  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,
    stabilityTier: "v1-evo-stable-14.4-IMMORTAL",

    binary: binarySurface,
    degradation: degradationSurface,
    immortal: immortalSurface
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v1 Organism (v14.4 Stable-Plus-IMMORTAL)
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
  const lineage = buildLineage(parentLineage, pattern);

  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  const patternAncestry       = buildPatternAncestry(pattern);
  const lineageSignature      = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth: lineage.length,
    modeBias: mode === "stress" ? 2 : 1,
    stabilityTier: "v1-evo-stable-14.4-IMMORTAL"
  };

  const healthScore = 1.0;
  const tier = "stable";

  const cacheChunkSurface = buildCacheChunkSurface({
    pattern,
    lineage,
    pageId
  });

  const prewarmSurface = buildPrewarmSurface({
    priority
  });

  const presenceSurface = buildPresenceSurface({
    pattern
  });

  const diagnostics = buildDiagnostics(pattern, lineage, payload, healthScore);

  const immortalMeta = diagnostics.immortal.immortalMeta;

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

    pulseType: "Pulse-v1-EvoStable-v14.4-IMMORTAL",

    advantageField,
    healthScore,
    tier,

    cacheChunkSurface,
    prewarmSurface,
    presenceSurface,

    immortalMeta,

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      diagnostics,

      stableSignature: computeHash(pattern + "::" + lineageSignature),
      patternSignature: computeHash(pattern),
      lineageSurface: computeHash(String(lineage.length)),
      advantageSignature: computeHash(stableStringify(advantageField)),
      healthSignature: computeHash("1.0"),
      tierSignature: computeHash("stable")
    }
  };
}


// ============================================================================
//  FROM IMPULSE — build a v1 Pulse from an Impulse traveler (14.4 IMMORTAL)
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
