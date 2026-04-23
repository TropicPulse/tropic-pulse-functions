// ============================================================================
//  PulseSendLegacyPulse.js — v10.4‑EvoStable
//  Pulse v1 Organism • Stable Evolutionary Tier • Full Organism Minus Compute
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The Pulse v1 stable organism.
//  • Fully capable: routing-aware, mesh-aware, mode-aware, lineage-aware,
//    pattern-aware, identity-aware, advantage-aware.
//  • Deterministic, stable, non-self-looping.
//  • Shape-compatible with Pulse v2/v3.
//  • Safe to pass through Router v10.4, Mesh v10.4, Send v10.4.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not an evolution engine.
//  • Does NOT run the compute loop.
//  • Does NOT self-expand lineage.
//  • Does NOT mutate pattern.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v1 stable organism (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "10.4",
  identity: "Pulse-v1-EvoStable",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,
    routerAwareReady: true,
    meshAwareReady: true,

    // ⭐ Evolution engine stays OFF
    evolutionEngineReady: false,

    unifiedAdvantageField: true,
    pulseV1Ready: true,
    futureEvolutionReady: false
  },

  routingContract: "PulseRouter-v10.4",
  meshContract: "PulseMesh-v10.4",
  sendContract: "PulseSend-v10.4",
  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// Build lineage chain (v1 does NOT evolve later; lineage is static)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// Deterministic shape signature (same as v2/v3)
function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `shape-${acc}`;
}

// Evolution stage classification (static)
function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  return "mature";
}


// ============================================================================
//  FACTORY — Create a Pulse v1 Organism (v10.4‑EvoStable)
// ============================================================================
export function createLegacyPulse({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  mode = "normal"
}) {
  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  // ⭐ NEW: advantage field (deterministic)
  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth: lineage.length,
    modeBias: mode === "stress" ? 2 : 1
  };

  // ⭐ NEW: healthScore (stable organism always healthy)
  const healthScore = 1;

  return {
    PulseRole,
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    mode,

    // ⭐ NEW: organism identity
    pulseType: "Pulse-v1-EvoStable",

    // ⭐ NEW: deterministic advantage field
    advantageField,

    // ⭐ NEW: stable health score
    healthScore,

    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}


// ============================================================================
//  FROM IMPULSE — build a v1 Pulse from an Impulse traveler
// ============================================================================
export function legacyPulseFromImpulse(impulse, overrides = {}) {
  if (!impulse) return null;

  const pattern       = overrides.pattern       || impulse.payload?.pattern      || impulse.intent || "UNKNOWN_PATTERN";
  const jobId         = overrides.jobId         || impulse.payload?.jobId        || impulse.tickId;
  const priority      = overrides.priority      || impulse.payload?.priority     || "normal";
  const returnTo      = overrides.returnTo      || impulse.payload?.returnTo     || null;
  const parentLineage = overrides.parentLineage || impulse.payload?.parentLineage || null;
  const mode          = overrides.mode          || impulse.payload?.mode         || "normal";

  return createLegacyPulse({
    jobId,
    pattern,
    payload: impulse.payload || {},
    priority,
    returnTo,
    parentLineage,
    mode
  });
}
