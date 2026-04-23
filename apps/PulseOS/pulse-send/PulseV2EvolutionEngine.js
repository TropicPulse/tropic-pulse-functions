// ============================================================================
//  PulseV2EvolutionEngine.js — v10.4
//  Pulse v2 • Evolution Engine • Experimental Trait Layer (Compute Inside Pulse)
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The Pulse v2 evolution engine.
//  • Same external shape as Pulse v1 (EvoStable) and Pulse v3 (Unified).
//  • Experimental evolution tier: stronger internal compute loop.
//  • Pattern‑aware, lineage‑aware, mode‑aware, identity‑aware.
//  • Provides advantageField + healthScore for Router/Mesh/Send.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mesh layer.
//  • Not a transport organ.
//  • Not a GPU/Earn/OS organ.
//  • Not a healer or brain.
//
//  SAFETY CONTRACT (v10.4):
//  ------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Deterministic compute loop only.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the Pulse v2 evolution engine (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "10.4",
  identity: "Pulse-v2-EvolutionEngine",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,
    routerAwareReady: true,
    meshAwareReady: true,

    // ⭐ Evolution engine ON (experimental tier)
    evolutionEngineReady: true,

    unifiedAdvantageField: true,
    pulseV2Ready: true,
    futureEvolutionReady: true
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

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 3)) % 100000; // ⭐ slightly different weight than v3
  }

  return `shape-${acc}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  if (depth === 4) return "canopy";
  return "wild";
}


// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v2 — more experimental)
// ============================================================================
//
//  v2 is the “try new traits” tier:
//    • Still deterministic.
//    • Slightly more aggressive weighting.
//    • No randomness, no timestamps, no external I/O.
// ============================================================================

function runEvolutionComputeLoopV2({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  const patternLen = pattern.length;

  // ⭐ More experimental advantage field
  const advantageField = {
    patternStrength: patternLen,
    lineageDepth,
    payloadSize,
    modeBias:
      mode === "stress"   ? 4 :
      mode === "drain"    ? 3 :
      mode === "recovery" ? 2 :
      1,
    experimentalTier: "v2-evolution-engine"
  };

  // ⭐ HealthScore with sharper curve (more sensitive)
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
//  FACTORY — Create a Pulse v2 Evolution Engine Organism (v10.4)
// ============================================================================
//
//  Input:
//    • jobId
//    • pattern
//    • payload
//    • priority
//    • returnTo
//    • parentLineage
//    • mode
//
//  Output (shape‑compatible with v1/v3):
//    • {
//        PulseRole,
//        jobId,
//        pattern,
//        payload,
//        priority,
//        returnTo,
//        lineage,
//        mode,
//        pulseType,
//        advantageField,
//        healthScore,
//        meta: { shapeSignature, evolutionStage }
//      }
// ============================================================================

export function createPulseV2({
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

  const { advantageField, healthScore } = runEvolutionComputeLoopV2({
    pattern,
    lineage,
    payload,
    mode
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

    // ⭐ Experimental evolution tier identity
    pulseType: "Pulse-v2-EvolutionEngine",

    advantageField,
    healthScore,

    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}
