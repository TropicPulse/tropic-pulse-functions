// ============================================================================
//  PulseSendAdapter.js — v10.4‑Evo
//  Pattern‑Shape Adapter • Pulse‑Agnostic Translator • Pre‑Delivery Adapter
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • Takes a Pulse v1/v2/v3 organism.
//  • Adapts it into the shape the target organ expects.
//  • Pure deterministic translation.
//  • Pattern‑aware, identity‑aware, lineage‑aware, mode‑aware.
//  • Zero compute, zero mutation, zero randomness.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mesh layer.
//  • Not a compute engine.
//  • Not a healer or brain.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Adapter Organ (v10.4‑Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Adapter",
  version: "10.4‑Evo",
  identity: "PulseSendAdapter-v10.4‑Evo",

  evo: {
    driftProof: true,
    shapeShiftReady: true,
    multiOrganReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    selfTranslationReady: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend10Ready: true
  },

  routingContract: "PulseRouter-v10.4",
  meshContract: "PulseMesh-v10.4",

  // ⭐ Pulse‑agnostic
  pulseContract: "Pulse-v1/v2/v3",

  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  ADAPTER RULES — how each organ wants to receive a Pulse organism
// ============================================================================
//
//  Each organ has its own “coat” or “shape.”
//  The adapter wraps the Pulse organism into the correct shape.
//  Pulse‑agnostic, mode‑aware, lineage‑aware, pattern‑aware.
// ============================================================================

const ORGAN_ADAPTERS = {
  GPU: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    gpuReady: true
  }),

  Earn: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    earnReady: true
  }),

  OS: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    osReady: true
  }),

  Mesh: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    meshReady: true
  })
};


// ============================================================================
//  FACTORY — Create an Adapter for ANY Pulse organism (v1/v2/v3)
// ============================================================================
export function adaptPulseSendPacket(pulse, targetOrgan, mode = "normal") {
  const adapter = ORGAN_ADAPTERS[targetOrgan];

  // ⭐ Extract identity + advantage
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
  const advantageField = pulse?.advantageField || null;

  if (typeof adapter === "function") {
    return adapter(
      { ...pulse, pulseType, advantageField },
      targetOrgan,
      mode
    );
  }

  // ⭐ fallback: neutral shape
  return {
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType,
    advantageField,
    neutral: true
  };
}
