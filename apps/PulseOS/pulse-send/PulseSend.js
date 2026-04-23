// ============================================================================
//  PulseSend.js — v10.4
//  Pulse‑Agnostic Transport Organ • Evolution‑Aware • Mode‑Aware
// ============================================================================
//
//  NEW BEHAVIOR (v10.4‑Evo):
//  -------------------------
//  • Try Pulse v3 (unified organism).
//  • If v3 creation fails → try Pulse v2 (evolution engine).
//  • If v2 creation fails → try Pulse v1 (stable fallback).
//  • Always succeed.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Organ Wrapper (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "TransportSystem",
  version: "10.4",
  identity: "PulseSend-v10.4",

  evo: {
    driftProof: true,
    unifiedOrganReady: true,
    multiOrganReady: true,
    shapeShiftAware: true,
    reflexChainReady: true,
    patternAware: true,
    lineageAware: true,
    memoryAware: true,
    modeAware: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend10Ready: true
  },

  routingContract: "PulseRouter-v10.4",
  meshContract: "PulseMesh-v10.4",
  pulseContract: "Pulse-v1/v2/v3",
  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  FACTORY — Build the Full PulseSend v10.4 Organism
// ============================================================================
export function createPulseSend({
  createPulseV3,         // ⭐ NEW: Pulse v3 creator
  createPulseV2,         // ⭐ NEW: Pulse v2 creator
  createPulseV1,         // ⭐ NEW: Pulse v1 creator
  pulseRouter,
  pulseMesh,
  createPulseSendMover,
  createPulseSendImpulse,
  createPulseSendReturn,
  log
}) {
  // ⭐ Build sub‑organs
  const mover = createPulseSendMover({ pulseMesh, log });
  const impulse = createPulseSendImpulse({ mover, log });
  const returnArc = createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log });

  // ========================================================================
  //  PUBLIC API — send()
  // ========================================================================
  function send({
    jobId,
    pattern,
    payload = {},
    priority = "normal",
    returnTo = null,
    mode = "normal"
  }) {

    let pulse = null;
    let pulseType = null;

    // ================================================================
    // ⭐ Tier 1 — Try Pulse v3 (Unified Organism)
    // ================================================================
    try {
      pulse = createPulseV3({
        jobId, pattern, payload, priority, returnTo, mode
      });
      pulseType = "Pulse-v3";
    } catch (errV3) {
      log && log("[PulseSend-v10.4] Pulse v3 failed, falling back to v2", { errV3 });
    }

    // ================================================================
    // ⭐ Tier 2 — Try Pulse v2 (Evolution Engine)
    // ================================================================
    if (!pulse) {
      try {
        pulse = createPulseV2({
          jobId, pattern, payload, priority, returnTo, mode
        });
        pulseType = "Pulse-v2";
      } catch (errV2) {
        log && log("[PulseSend-v10.4] Pulse v2 failed, falling back to v1", { errV2 });
      }
    }

    // ================================================================
    // ⭐ Tier 3 — Fallback to Pulse v1 (Stable Organism)
    // ================================================================
    if (!pulse) {
      pulse = createPulseV1({
        jobId, pattern, payload, priority, returnTo, mode
      });
      pulseType = "Pulse-v1";
      log && log("[PulseSend-v10.4] Using Pulse v1 fallback", { jobId, pattern });
    }

    // ================================================================
    // ⭐ Continue normal transport chain
    // ================================================================

    // Step 2 — route
    const targetOrgan = pulseRouter.route(pulse);

    // Step 3 — pathway
    const pathway = pulseMesh.pathwayFor(targetOrgan, mode);

    log && log("[PulseSend-v10.4] Routing pulse", {
      jobId,
      pattern,
      targetOrgan,
      pathway,
      mode,
      pulseType
    });

    // Step 4 — movement
    const movement = impulse.fire({
      pulse,
      targetOrgan,
      pathway,
      mode
    });

    // Step 5 — return arc
    const result = returnArc.handle(movement.packet, mode);

    // Step 6 — memory
    pulseRouter.remember(
      pulse,
      targetOrgan,
      "success",
      pulse.healthScore || 1
    );

    return {
      PulseRole,
      movement,
      result,
      mode,
      pulseType
    };
  }

  return {
    PulseRole,
    send
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSend (v10.4)
// ============================================================================
export const PulseSend = {
  PulseRole,

  send(...args) {
    throw new Error(
      "[PulseSend-v10.4] PulseSend.send() was called before initialization. " +
      "Use createPulseSend(...) to wire dependencies."
    );
  }
};
