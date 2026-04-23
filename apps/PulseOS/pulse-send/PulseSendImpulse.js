// ============================================================================
//  PulseSendImpulse.js — v10.4‑Evo
//  Nerve‑Spark • Pulse‑Agnostic Trigger Organ • Fires the Movement
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The tiny spark that tells the Mover to activate.
//  • Works with Pulse v1, Pulse v2, Pulse v3.
//  • Pure deterministic “GO” signal.
//  • Pattern‑aware, lineage‑aware, mode‑aware, identity‑aware.
//  • Zero compute, zero mutation, zero randomness.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mover.
//  • Not a mesh layer.
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a network layer.
//
//  SAFETY CONTRACT (v10.4‑Evo):
//  ----------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Impulse Organ (v10.4‑Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Impulse",
  version: "10.4‑Evo",
  identity: "PulseSendImpulse-v10.4‑Evo",

  evo: {
    driftProof: true,
    reflexReady: true,
    sparkReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    multiOrganReady: true,
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
//  FACTORY — Create the Impulse Organ (v10.4‑Evo)
// ============================================================================
export function createPulseSendImpulse({ mover, log }) {
  return {
    PulseRole,

    fire({ pulse, targetOrgan, pathway, mode = "normal" }) {

      // ⭐ Extract organism identity
      const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

      // ⭐ Deterministic spark‑intelligence (allowed, zero compute)
      const pattern = pulse?.pattern || "NO_PATTERN";
      const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
      const organLabel = targetOrgan || "NO_ORGAN";
      const pathwayLabel = pathway || "NO_PATHWAY";

      // ⭐ Advantage field (if present)
      const advantageField = pulse?.advantageField || null;

      log && log("[PulseSendImpulse-v10.4‑Evo] Spark fired", {
        jobId: pulse.jobId,
        pulseType,
        pattern,
        lineageDepth,
        targetOrgan: organLabel,
        pathway: pathwayLabel,
        mode,
        advantageField
      });

      // ⭐ Trigger the mover (muscle twitch)
      return mover.move({
        pulse,
        targetOrgan,
        pathway,
        mode
      });
    }
  };
}
