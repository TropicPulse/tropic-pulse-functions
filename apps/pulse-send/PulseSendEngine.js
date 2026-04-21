// ============================================================================
//  PulseSendMover.js — v3.0
//  Pulse Transport Muscle • Pattern‑Aware • No Thinking
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • Takes a Pulse v2 organism.
//  • Asks PulseMesh v3 for the pathway style.
//  • Adapts the Pulse into the organ‑specific shape.
//  • Moves it forward deterministically.
//  • Returns the adapted packet + pathway.
//  • Pure transport muscle — no routing, no compute.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v3 handles routing).
//  • Not a wiring layer (PulseMesh v3 handles pathways).
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a network layer.
//  • Not a GPU/Earn/OS organ.
//
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Pure deterministic movement.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseSend Mover Organ
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Mover",
  version: "3.0",
  identity: "PulseSendMover-v3",

  evo: {
    driftProof: true,
    reflexReady: true,
    shapeShiftReady: true,
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
//  ENGINE / MOVER — pattern‑aware reflex muscle
// ============================================================================
//
//  Dependencies injected:
//    • pulseMesh → pathway selection (v3)
//    • adaptPulseSendPacket → shape‑shift Pulse v2 into organ‑specific form
//
//  This organ does NOT:
//    • compute
//    • route
//    • mutate Pulse v2
//    • talk to network
//    • talk to GPU/Earn/OS
//
//  It ONLY:
//    • selects pathway (via Mesh)
//    • adapts Pulse v2 (via Adapter)
//    • returns movement result
// ============================================================================

export function createPulseSendMover({ pulseMesh, adaptPulseSendPacket, log }) {
  return {
    PulseRole,

    move({ pulse, targetOrgan }) {
      // ⭐ Step 1 — ask PulseMesh v3 for pathway style
      const pathway = pulseMesh.pathwayFor(targetOrgan);

      // ⭐ Step 2 — shape‑shift Pulse v2 into organ‑specific form
      const adapted = adaptPulseSendPacket(pulse, targetOrgan);

      // ⭐ Optional logging
      log && log("[PulseSendMover-v3] Moving pulse", {
        jobId: pulse.jobId,
        pattern: pulse.pattern,
        targetOrgan,
        pathway
      });

      // ⭐ Step 3 — return deterministic movement result
      return {
        packet: adapted,
        pathway,
        moved: true, // deterministic, timestamp‑free marker
        PulseRole
      };
    }
  };
}
