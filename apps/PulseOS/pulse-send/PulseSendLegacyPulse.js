// ============================================================================
//  PulseSendLegacyPulse.js — v1.0 (Shape‑Unified Fallback)
//  Pulse v1 Organism • Stable Fallback • Matches Pulse v2 Shape
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The Pulse v1 fallback organism.
//  • Shape‑compatible with Pulse v2 (same fields, same structure).
//  • Simple, stable, non‑evolving, deterministic.
//  • Safe to pass through Router v3, Mesh v3, Send v3.
//  • Native match for older Mesh v2 + Send v2 behavior.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not an evolution engine.
//  • Not lineage‑expanding.
//  • Not pattern‑mutating.
//  • Not a router or mover.
//  • Not a compute engine.
//
//  SAFETY CONTRACT (v1.0):
//  ------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure stable shape container.
// ============================================================================

// ⭐ PulseRole — identifies this as the Pulse v1 fallback organism
export const PulseRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "Organ",
  version: "1.0",
  identity: "Pulse-v1",

  evo: {
    driftProof: true,
    patternAware: true,       // shape-compatible
    lineageAware: true,       // shape-compatible
    shapeAware: true,         // shape-compatible
    evolutionEngineReady: false,
    meshAwareReady: true,
    routerAwareReady: true,
    futureEvolutionReady: false,

    unifiedAdvantageField: true,
    pulseV1Ready: true
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

// Build lineage chain (v1 does NOT evolve later; lineage is static after create)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

// Same deterministic shape signature as Pulse v2
function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `shape-${acc}`;
}

// Evolution stage is static-ish: we classify, but never evolve further
function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  return "mature";
}


// ============================================================================
//  FACTORY — Create a Pulse v1 Organism (shape‑matched to v2)
// ============================================================================
//
//  Input (same as Pulse v2):
//    • jobId        → unique job identifier
//    • pattern      → pattern identity (string)
//    • payload      → what it carries
//    • priority     → low / normal / high
//    • returnTo     → optional return target
//    • parentLineage → optional lineage array from previous pulse
//
//  Output (same shape as Pulse v2):
//    • {
//        PulseRole,
//        jobId,
//        pattern,
//        payload,
//        priority,
//        returnTo,
//        lineage,
//        meta: { shapeSignature, evolutionStage }
//      }
//
//  Notes:
//    • No evolution engine.
//    • No mutate-in-place.
//    • Pure stable container.
// ============================================================================

export function createLegacyPulse({
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
//  FROM IMPULSE — build a v1 Pulse from an Impulse traveler
// ============================================================================
//
//  This lets you do:
//    const impulse = Impulse.create(intent, payload);
//    const pulseV1 = legacyPulseFromImpulse(impulse);
//
//  It assumes:
//    • intent → pattern fallback
//    • impulse.tickId → jobId fallback
//    • impulse.payload → payload
// ============================================================================

export function legacyPulseFromImpulse(impulse, overrides = {}) {
  if (!impulse) return null;

  const pattern  = overrides.pattern  || impulse.payload?.pattern || impulse.intent || "UNKNOWN_PATTERN";
  const jobId    = overrides.jobId    || impulse.payload?.jobId   || impulse.tickId;
  const priority = overrides.priority || impulse.payload?.priority || "normal";
  const returnTo = overrides.returnTo || impulse.payload?.returnTo || null;
  const parentLineage = overrides.parentLineage || impulse.payload?.parentLineage || null;

  return createLegacyPulse({
    jobId,
    pattern,
    payload: impulse.payload || {},
    priority,
    returnTo,
    parentLineage
  });
}
