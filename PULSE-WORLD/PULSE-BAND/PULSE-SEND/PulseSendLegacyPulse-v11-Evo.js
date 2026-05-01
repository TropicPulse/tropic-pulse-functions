// ============================================================================
//  PulseSendLegacyPulse-v12.3-EvoStable.js
//  Pulse v1 Organism • Stable Evolutionary Floor • Non-Evolving
//  v12.3: Binary + CacheChunk + Prewarm + Presence Surfaces (Stable-Plus)
// ============================================================================
//
//  ROLE:
//    • v1 is the *stable floor* of the organism stack.
//    • It never evolves, never mutates, never computes evolution tiers.
//    • It now surfaces 12.3 metadata (cacheChunk, prewarm, presence).
//    • It does NOT use these surfaces to evolve or change behavior.
//    • Deterministic, stable, non-evolving, non-computing.
//
//  SAFETY CONTRACT (v12.3-EvoStable):
//  ----------------------------------
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic, stable, non-evolving organism.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v1 stable organism (v12.3)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "12.3",
  identity: "Pulse-v1-EvoStable-v12.3",

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

    // Binary-aware but non-evolving
    binaryAwareStableReady: true,

    // ⭐ 12.3 surfaces (surfaced only, never used for evolution)
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true
  }
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
//  DIAGNOSTICS (stable, non-evolving)
// ============================================================================
function buildDiagnostics(pattern, lineage, payload) {
  const binarySurface = extractBinarySurface(payload);

  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,
    stabilityTier: "v1-evo-stable-12.3",

    binary: binarySurface
  };
}


// ============================================================================
//  FACTORY — Create a Pulse v1 Organism (v12.3 Stable-Plus)
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
    stabilityTier: "v1-evo-stable-12.3"
  };

  const healthScore = 1.0;
  const tier = "stable";

  const diagnostics = buildDiagnostics(pattern, lineage, payload);

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

    pulseType: "Pulse-v1-EvoStable-v12.3",

    advantageField,
    healthScore,
    tier,

    cacheChunkSurface,
    prewarmSurface,
    presenceSurface,

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
//  FROM IMPULSE — build a v1 Pulse from an Impulse traveler (12.3 Stable-Plus)
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
