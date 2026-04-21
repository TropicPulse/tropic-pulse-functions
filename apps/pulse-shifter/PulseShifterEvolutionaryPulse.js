// ============================================================================
//  EvolutionaryPulse.js — v2.0
//  Pulse v2 Organism • Evolution Engine • Pattern + Lineage + Shape
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The Pulse v2 organism + its evolutionary engine.
//  • Creates self‑describing Pulse packets.
//  • Carries pattern, lineage, payload, priority, returnTo.
//  • Evolves deterministically based on context (no randomness).
//  • Generates shape signatures + evolution stages.
//  • Designed to be used by PulseSend v3, PulseRouter v3, PulseMesh v3.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mover.
//  • Not a mesh layer.
//  • Not a network client.
//  • Not a GPU/Earn/OS organ.
//  • Not a compute engine (no heavy logic).
//
//  SAFETY CONTRACT (v2.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the Pulse v2 Organism + Evolution Engine
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "2.0",
  identity: "Pulse-v2",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    evolutionEngineReady: true,
    meshAwareReady: true,
    routerAwareReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseV2Ready: true
  },

  routingContract: "PulseRouter-v3",
  meshContract: "PulseMesh-v3",
  sendContract: "PulseSend-v3",
  gpuOrganContract: "PulseGPU-v9.2",
  earnCompatibility: "PulseEarn-v9"
};

// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// ⭐ Build lineage chain: parentLineage + current pattern
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// ⭐ Compute a simple, deterministic shape signature from pattern + lineage
function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  // Tiny deterministic hash‑like reducer (no randomness, no crypto)
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `shape-${acc}`;
}

// ⭐ Determine evolution stage based on lineage depth + pattern features
function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;
  const hasMeshHint = pattern.includes("mesh");
  const hasRouterHint = pattern.includes("route");
  const hasGpuHint = pattern.includes("gpu");
  const hasEarnHint = pattern.includes("earn");

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  if (hasMeshHint && hasRouterHint) return "networked-reflex";
  if (hasGpuHint && hasEarnHint) return "compute-economy";
  if (hasMeshHint) return "mesh-aware";
  if (hasRouterHint) return "router-aware";

  return "mature";
}

// ⭐ Deterministic pattern evolution based on context (no randomness)
function evolvePattern(pattern, context = {}) {
  const { routerHint, meshHint, organHint } = context;

  const parts = [pattern];

  if (routerHint) parts.push(`r:${routerHint}`);
  if (meshHint) parts.push(`m:${meshHint}`);
  if (organHint) parts.push(`o:${organHint}`);

  return parts.join("|");
}

// ============================================================================
//  FACTORY — Create a Pulse v2 Organism
// ============================================================================
//
//  Input:
//    • jobId        → unique job identifier
//    • pattern      → pattern identity (string)
//    • payload      → what it carries
//    • priority     → low / normal / high
//    • returnTo     → optional return target
//    • parentLineage → optional lineage array from previous pulse
//
//  Output:
//    • Pulse v2 organism with:
//        - pattern
//        - lineage
//        - payload
//        - priority
//        - returnTo
//        - meta: { shapeSignature, evolutionStage }
// ============================================================================

export function createPulse({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null
}) {
  const lineage = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  return {
    PulseRole,
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}

// ============================================================================
//  EVOLUTION ENGINE — evolve an existing Pulse deterministically
// ============================================================================
//
//  Input:
//    • pulse    → existing Pulse v2 organism
//    • context  → { routerHint, meshHint, organHint }
//
//  Output:
//    • newPulse → evolved Pulse v2 organism with:
//        - updated pattern
//        - extended lineage
//        - updated shapeSignature + evolutionStage
//
//  Notes:
//    • No randomness.
//    • No external mutation.
//    • Pure function: returns a NEW pulse object.
// ============================================================================

export function evolvePulse(pulse, context = {}) {
  const nextPattern = evolvePattern(pulse.pattern, context);
  const nextLineage = buildLineage(pulse.lineage, nextPattern);
  const shapeSignature = computeShapeSignature(nextPattern, nextLineage);
  const evolutionStage = computeEvolutionStage(nextPattern, nextLineage);

  return {
    PulseRole,
    jobId: pulse.jobId,
    pattern: nextPattern,
    payload: pulse.payload,
    priority: pulse.priority,
    returnTo: pulse.returnTo,
    lineage: nextLineage,
    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}
