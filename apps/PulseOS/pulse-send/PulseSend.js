// ============================================================================
//  PulseSend.js — v3.0
//  Pattern‑Native Transport Organ • Identity‑Aware • Memory‑Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The full PulseSend v3 organism.
//  • Pure transport intelligence (NOT routing).
//  • Reads Pulse v2 pattern + lineage.
//  • Asks PulseRouter v3 for routing decisions.
//  • Asks PulseMesh v3 for pathway style.
//  • Moves pulses deterministically.
//  • Handles return arcs.
//  • Stamps lineage memory.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v3 handles routing).
//  • Not a wiring layer (PulseMesh v3 handles pathways).
//  • Not a compute engine.
//  • Not a network layer.
//  • Not a healer or brain.
//  • Not a miner.
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
//  • Pattern‑aware, lineage‑aware, identity‑aware.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseSend Organ Wrapper
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Organ",
  version: "3.0",
  identity: "PulseSend-v3",

  evo: {
    driftProof: true,
    unifiedOrganReady: true,
    multiOrganReady: true,
    shapeShiftAware: true,
    reflexChainReady: true,
    patternAware: true,
    lineageAware: true,
    memoryAware: true,
    futureEvolutionReady: true,

    // v9.3 unified advantage + PulseSend‑3.0 identity
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
//  FACTORY — Build the Full PulseSend v3 Organism
// ============================================================================
//
//  Dependencies injected:
//    • createPulse (Pulse v2)
//    • pulseRouter (PulseRouter v3)
//    • pulseMesh (PulseMesh v3)
//    • createPulseSendMover
//    • createPulseSendImpulse
//    • createPulseSendReturn
//    • log (optional)
//
//  Returns:
//    • send() → the full PulseSend v3 chain
// ============================================================================

export function createPulseSend({
  createPulse,          // Pulse v2
  pulseRouter,          // PulseRouter v3
  pulseMesh,            // PulseMesh v3
  createPulseSendMover,
  createPulseSendImpulse,
  createPulseSendReturn,
  log
}) {
  // ⭐ Build sub‑organs
  const mover = createPulseSendMover({
    pulseMesh,
    log
  });

  const impulse = createPulseSendImpulse({
    mover,
    log
  });

  const returnArc = createPulseSendReturn({
    impulse,
    log
  });

  // ========================================================================
  //  PUBLIC API — send()
  // ========================================================================
  //
  //  Steps:
  //    1. Create Pulse v2 organism
  //    2. Ask PulseRouter v3 for routing target
  //    3. Ask PulseMesh v3 for pathway style
  //    4. Fire impulse (movement)
  //    5. Handle return arc
  //    6. Stamp lineage memory
  //
  // ========================================================================

  function send({ jobId, pattern, payload = {}, priority = "normal", returnTo = null }) {
    // ⭐ Step 1 — create Pulse v2 organism
    const pulse = createPulse({
      jobId,
      pattern,
      payload,
      priority,
      returnTo
    });

    // ⭐ Step 2 — ask PulseRouter v3 for routing target
    const targetOrgan = pulseRouter.route(pulse);

    // ⭐ Step 3 — ask PulseMesh v3 for pathway style
    const pathway = pulseMesh.pathwayFor(targetOrgan);

    log && log("[PulseSend-v3] Routing pulse", {
      jobId,
      pattern,
      targetOrgan,
      pathway
    });

    // ⭐ Step 4 — fire impulse (movement)
    const movement = impulse.fire({
      pulse,
      targetOrgan,
      pathway
    });

    // ⭐ Step 5 — handle return arc
    const result = returnArc.handle(movement.packet);

    // ⭐ Step 6 — stamp lineage memory
    pulseRouter.remember(pulse, targetOrgan);

    return {
      PulseRole,
      movement,
      result
    };
  }

  // ⭐ Expose the unified organ
  return {
    PulseRole,
    send
  };
}
