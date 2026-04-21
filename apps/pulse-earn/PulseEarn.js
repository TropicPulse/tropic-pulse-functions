// ============================================================================
//  PulseEarn.js — Earn Organism v2.0
//  Evolutionary Earn Organ • Pattern + Lineage + Shape • Compute‑Ready
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The evolved Earn organism (v2).
//  • Carries compute payloads, miner hints, GPU hints, and economic metadata.
//  • Pattern-aware, lineage-aware, shape-aware.
//  • Deterministic evolution (no randomness).
//  • Designed to compute-in-the-air on the way to the miner.
//  • Compatible with PulseSendSystem + EarnSendSystem.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mesh layer.
//  • Not a GPU engine.
//  • Not a miner.
//  • Not a network client.
//
//  SAFETY CONTRACT (v2.0):
//  ------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
//  EarnRole — identifies this as the Earn v2 Organism
// ============================================================================
export const EarnRole = {
  type: "Earn",
  subsystem: "Earn",
  layer: "Organ",
  version: "2.0",
  identity: "Earn-v2",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    evolutionEngineReady: true,
    gpuAwareReady: true,
    minerAwareReady: true,
    offlineAwareReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    earnV2Ready: true
  },

  routingContract: "PulseRouter-v3",
  meshContract: "PulseMesh-v3",
  sendContract: "PulseSend-v3",
  gpuOrganContract: "PulseGPU-v9.2",
  minerContract: "PulseMiner-v9",
  pulseCompatibility: "Pulse-v2"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// Build lineage chain: parentLineage + current pattern
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// Compute deterministic shape signature
function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `earn-shape-${acc}`;
}

// Determine evolution stage
function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  if (pattern.includes("gpu")) return "gpu-aware";
  if (pattern.includes("miner")) return "miner-aware";
  if (pattern.includes("air")) return "air-compute";

  return "mature";
}

// Deterministic pattern evolution
function evolvePattern(pattern, context = {}) {
  const { gpuHint, minerHint, airHint } = context;

  const parts = [pattern];

  if (gpuHint) parts.push(`g:${gpuHint}`);
  if (minerHint) parts.push(`m:${minerHint}`);
  if (airHint) parts.push(`a:${airHint}`);

  return parts.join("|");
}


// ============================================================================
//  FACTORY — Create an Earn v2 Organism
// ============================================================================
export function createEarn({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null
}) {
  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  return {
    EarnRole,
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
//  EVOLUTION ENGINE — evolve an existing Earn deterministically
// ============================================================================
export function evolveEarn(earn, context = {}) {
  const nextPattern = evolvePattern(earn.pattern, context);
  const nextLineage = buildLineage(earn.lineage, nextPattern);
  const shapeSignature = computeShapeSignature(nextPattern, nextLineage);
  const evolutionStage = computeEvolutionStage(nextPattern, nextLineage);

  return {
    EarnRole,
    jobId: earn.jobId,
    pattern: nextPattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: nextLineage,
    meta: {
      shapeSignature,
      evolutionStage
    }
  };
}
