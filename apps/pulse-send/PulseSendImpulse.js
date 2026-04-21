// ============================================================================
//  PulseSendImpulse.js — v3.0
//  Nerve‑Spark • Trigger Organ • Fires the Movement
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The tiny spark that tells the Mover to activate.
//  • Does NOT compute.
//  • Does NOT route.
//  • Does NOT adapt.
//  • Does NOT mutate the Pulse.
//  • Pure “GO” signal.
//  • PulseSend‑3.0‑ready: pattern‑aware + lineage‑aware.
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
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Pure deterministic trigger.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseSend Impulse Organ
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Impulse",
  version: "3.0",
  identity: "PulseSendImpulse-v3",

  evo: {
    driftProof: true,
    reflexReady: true,
    sparkReady: true,
    patternAware: true,
    lineageAware: true,
    multiOrganReady: true,
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
//  FACTORY — Create the Impulse Organ
// ============================================================================
//
//  The Impulse organ simply:
//    • receives a Pulse v2 organism + routing info
//    • triggers the mover
//    • returns the mover’s output
//
//  It is the smallest possible “action organ.”
// ============================================================================

export function createPulseSendImpulse({ mover, log }) {
  return {
    PulseRole,

    fire({ pulse, targetOrgan, pathway }) {
      log && log("[PulseSendImpulse-v3] Firing movement", {
        jobId: pulse.jobId,
        pattern: pulse.pattern,
        targetOrgan,
        pathway
      });

      // ⭐ Trigger the mover (muscle twitch)
      return mover.move({
        pulse,
        targetOrgan,
        pathway
      });
    }
  };
}
