// ============================================================================
//  PulseSendReturn.js — v10.4
//  Return Arc • Pulse‑Agnostic Bounce‑Back Organ • Handles returnTo Logic
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • Works with Pulse v1, Pulse v2, Pulse v3 organisms.
//  • Checks if returnTo is set.
//  • If yes → asks Router + Mesh for return routing.
//  • Fires a new Impulse back to the return organ.
//  • If no → ends the chain.
//  • Pure deterministic return logic.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router.
//  • Not a mover.
//  • Not a mesh layer.
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a messenger cell.
//
//  SAFETY CONTRACT (v10.4):
//  ------------------------
//  • No imports.
//  • No network.
//  • No compute.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Return Organ (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Return",
  version: "10.4",
  identity: "PulseSendReturn-v10.4",

  evo: {
    driftProof: true,
    returnArcReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    multiOrganReady: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend10Ready: true
  },

  routingContract: "PulseRouter-v10.4",
  meshContract: "PulseMesh-v10.4",
  pulseContract: "Pulse-v1/v2/v3",   // ⭐ Pulse‑agnostic
  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  FACTORY — Create the Return Organ (v10.4)
// ============================================================================
export function createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log }) {
  return {
    PulseRole,

    handle(pulse) {
      const {
        returnTo,
        mode = "normal",
        pattern = "UNKNOWN_PATTERN",
        lineage = []
      } = pulse;

      const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
      const pulseType = pulse.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

      // ⭐ No return target → end of chain
      if (!returnTo) {
        log && log("[PulseSendReturn-v10.4] No returnTo target — chain complete", {
          jobId: pulse.jobId,
          pattern,
          lineageDepth,
          mode,
          pulseType
        });

        return { completed: true, returned: false, pulse };
      }

      // ⭐ Return target exists → route the return pulse
      log && log("[PulseSendReturn-v10.4] Returning pulse", {
        jobId: pulse.jobId,
        pattern,
        returnTo,
        lineageDepth,
        mode,
        pulseType
      });

      // ⭐ Step 1 — determine return target via Router
      const targetOrgan = pulseRouter.route({
        ...pulse,
        targetHint: returnTo,
        mode
      });

      // ⭐ Step 2 — determine pathway via Mesh
      const pathway = pulseMesh.pathwayFor(targetOrgan, mode);

      // ⭐ Step 3 — fire impulse back
      const movement = impulse.fire({
        pulse: {
          ...pulse,
          returnTo: null, // ⭐ prevent infinite loops
          mode
        },
        targetOrgan,
        pathway,
        mode
      });

      return {
        completed: true,
        returned: true,
        movement
      };
    }
  };
}
