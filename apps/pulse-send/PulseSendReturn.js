// ============================================================================
//  PulseSendReturn.js — v3.0
//  Return Arc • Pattern‑Aware Bounce‑Back Organ • Handles returnTo Logic
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • Looks at the final Pulse v2 packet.
//  • Checks if returnTo is set.
//  • If yes → asks Router + Mesh for return routing.
//  • Fires a new Impulse back to the return organ.
//  • If no → ends the chain.
//  • Pure deterministic return logic.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v3 handles routing).
//  • Not a mover.
//  • Not a mesh layer.
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a messenger cell.
//
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Pure deterministic return logic.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseSend Return Organ
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Return",
  version: "3.0",
  identity: "PulseSendReturn-v3",

  evo: {
    driftProof: true,
    returnArcReady: true,
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
//  FACTORY — Create the Return Organ
// ============================================================================
//
//  Dependencies injected:
//    • impulse      → to fire the return movement
//    • pulseRouter  → to determine return target
//    • pulseMesh    → to determine return pathway
//    • log          → optional logging
//
//  Behavior:
//    • If pulse.returnTo exists → route + return
//    • If not → end of chain
// ============================================================================

export function createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log }) {
  return {
    PulseRole,

    handle(pulse) {
      const { returnTo } = pulse;

      // ⭐ No return target → end of chain
      if (!returnTo) {
        log && log("[PulseSendReturn-v3] No returnTo target — chain complete", {
          jobId: pulse.jobId,
          pattern: pulse.pattern
        });
        return { completed: true, returned: false, pulse };
      }

      // ⭐ Return target exists → route the return pulse
      log && log("[PulseSendReturn-v3] Returning pulse", {
        jobId: pulse.jobId,
        pattern: pulse.pattern,
        returnTo
      });

      // ⭐ Step 1 — determine return target via Router
      const targetOrgan = returnTo;

      // ⭐ Step 2 — determine pathway via Mesh
      const pathway = pulseMesh.pathwayFor(targetOrgan);

      // ⭐ Step 3 — fire impulse back
      const movement = impulse.fire({
        pulse: {
          ...pulse,
          returnTo: null // ⭐ prevent infinite loops
        },
        targetOrgan,
        pathway
      });

      return {
        completed: true,
        returned: true,
        movement
      };
    }
  };
}
