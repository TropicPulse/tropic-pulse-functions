// ============================================================================
//  PulseV3UnifiedOrganism.js — v10.4
//  Pulse v3 • Unified Organism • Evolution‑Aware • Deterministic Compute Loop
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The Pulse v3 unified organism.
//  • Full organism: pattern‑aware, lineage‑aware, mode‑aware, identity‑aware.
//  • Contains an internal, deterministic compute loop (evolution engine).
//  • Shape‑compatible with Pulse v1 (EvoStable) and Pulse v2.
//  • Provides advantageField + healthScore for Router/Mesh/Send.
//  • Safe for A→B→A loops (mode‑aware).
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
// ⭐ PulseRole — identifies this as the Pulse v3 unified organism (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "10.4",
  identity: "Pulse-v3-Unified",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,
    routerAwareReady: true,
    meshAwareReady: true,

    // ⭐ Evolution engine ON for v3
    evolutionEngineReady: true,

    unifiedAdvantageField: true,
    pulseV3Ready: true,
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

// Build lineage chain (v3 can extend lineage deterministically)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// Deterministic shape signature (shared with v1/v2)
function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `shape-${acc}`;
}

// Evolution stage classification
function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";
  return "mature";
}

// ============================================================================
//  INTERNAL: Deterministic evolution compute loop (v3)
// ============================================================================
//
//  This is the ONLY place where v3 "thinks":
//    • No randomness
//    • No timestamps
//    • No external I/O
//    • Purely derived from pattern, lineage, payload, mode
// ============================================================================

function runEvolutionComputeLoop({ pattern, lineage, payload, mode }) {
  const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
  const payloadSize = payload && typeof payload === "object"
    ? Object.keys(payload).length
    : 0;

  // ⭐ Deterministic advantage field
  const advantageField = {
    patternStrength: pattern.length,
    lineageDepth,
    payloadSize,
    modeBias:
      mode === "stress" ? 3 :
      mode === "drain"  ? 2 :
      1
  };

  // ⭐ Deterministic healthScore in [0, 1]
  const maxPattern = 64;
  const maxLineage = 16;
  const maxPayload = 32;

  const patternScore = Math.min(pattern.length / maxPattern, 1);
  const lineageScore = Math.min(lineageDepth / maxLineage, 1);
  const payloadScore = Math.min(payloadSize / maxPayload, 1);

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
//  FACTORY — Create a Pulse v3 Unified Organism (v10.4)
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
//  Output (shape‑compatible with v1/v2):
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

export function createPulseV3({
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

  // ⭐ Run deterministic evolution compute loop
  const { advantageField, healthScore } = runEvolutionComputeLoop({
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

    // ⭐ Unified organism identity
    pulseType: "Pulse-v3-Unified",

    // ⭐ Evolutionary intelligence (deterministic)
    advantageField,
    healthScore,

    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}
