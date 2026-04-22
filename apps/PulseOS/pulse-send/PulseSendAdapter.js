// ============================================================================
//  PulseSendAdapter.js — v3.0
//  Pattern‑Shape Adapter • Organ‑Aware Translator • Pre‑Delivery Adapter
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • Takes a Pulse v2 organism.
//  • Adapts it into the shape the target organ expects.
//  • Pure deterministic translation.
//  • Pattern‑aware, identity‑aware, lineage‑aware.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v3 handles routing).
//  • Not a wiring layer (PulseMesh v3 handles pathways).
//  • Not a compute engine.
//  • Not a messenger cell.
//  • Not a healer or brain.
//
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Pure deterministic translation only.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseSend Adapter Organ
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Adapter",
  version: "3.0",
  identity: "PulseSendAdapter-v3",

  evo: {
    driftProof: true,
    shapeShiftReady: true,
    multiOrganReady: true,
    patternAware: true,
    lineageAware: true,
    selfTranslationReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend3Ready: true
  },

  routingContract: "PulseRouter-v3",
  meshContract: "PulseMesh-v3",
  pulseContract: "Pulse-v2",
  gpuOrganContract: "PulseGPU-v9.2",
  earnCompatibility: "PulseEarn-v9"
};

// ============================================================================
//  ADAPTER RULES — how each organ wants to receive a Pulse v2 organism
// ============================================================================
//
//  Each organ has its own “coat” or “shape”.
//  The adapter wraps the Pulse v2 organism into the correct shape.
// ============================================================================

const ORGAN_ADAPTERS = {
  GPU: (pulse, targetOrgan) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    gpuReady: true
  }),

  Earn: (pulse, targetOrgan) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    earnReady: true
  }),

  OS: (pulse, targetOrgan) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    osReady: true
  }),

  Mesh: (pulse, targetOrgan) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    meshReady: true
  })
};

// ============================================================================
//  FACTORY — Create an Adapter for a Pulse v2 organism
// ============================================================================
//
//  Takes a Pulse v2 organism and returns a shape‑shifted version
//  for the target organ.
//
//  If the organ has no adapter, it returns a neutral packet.
// ============================================================================

export function adaptPulseSendPacket(pulse, targetOrgan) {
  const adapter = ORGAN_ADAPTERS[targetOrgan];

  if (typeof adapter === "function") {
    return adapter(pulse, targetOrgan);
  }

  // ⭐ fallback: neutral shape
  return {
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    neutral: true
  };
}
