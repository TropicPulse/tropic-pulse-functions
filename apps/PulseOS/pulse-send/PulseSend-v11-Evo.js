// ============================================================================
//  PulseSend-v11-Evo.js — PulseSend Organism v11.0 (Symbolic Edition)
//  Evolutionary Transport Organ • Pattern + Lineage + Shape • SDN-Aware
//  11.0: Fallback Surface + Movement Surface + Route Surface + Diagnostics
//  NOTE: This is the SYMBOLIC (pre-binary) top-level PulseSend.
// ============================================================================
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No randomness.
//  • No timestamps.
//  • No external IO.
//  • Pure deterministic transport chain.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Organ Wrapper (v11)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "TransportSystem",
  version: "11.0",
  identity: "PulseSend-v11-Evo",

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
    pulseSend11Ready: true,

    fallbackAware: true,
    movementAware: true,
    returnArcAware: true,
    pathwayAware: true,
    routerAware: true,
    meshAware: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  pulseContract: "Pulse-v1/v2/v3",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildFallbackSurface(type, error) {
  return {
    fallbackType: type,
    errorMessage: error ? String(error) : null
  };
}

function buildSendDiagnostics({ jobId, pattern, mode, pulseType }) {
  return {
    jobId,
    patternLength: pattern.length,
    mode,
    pulseType,
    patternHash: computeHash(pattern),
    modeHash: computeHash(mode)
  };
}

function buildMovementSurface(movement) {
  if (!movement || !movement.packet) {
    return {
      hasPacket: false,
      movementSignature: "NO_PACKET"
    };
  }

  const raw = JSON.stringify(movement.packet);
  return {
    hasPacket: true,
    movementSignature: computeHash(raw)
  };
}

function buildRouteSurface(targetOrgan) {
  const raw = JSON.stringify(targetOrgan || {});
  return {
    targetOrgan,
    routeSignature: computeHash(raw)
  };
}

function buildPathwaySurface(pathway) {
  const raw = JSON.stringify(pathway || {});
  return {
    pathway,
    pathwaySignature: computeHash(raw)
  };
}

function buildReturnSurface(result) {
  const ok = result && result.ok !== false;
  const raw = JSON.stringify(result || {});
  return {
    ok,
    returnSignature: computeHash(raw)
  };
}


// ============================================================================
//  FACTORY — Build the Full PulseSend v11 Organism (Symbolic Edition)
// ============================================================================
export function createPulseSend({
  createPulseV3,
  createPulseV2,
  createPulseV1,
  pulseRouter,
  pulseMesh,
  createPulseSendMover,
  createPulseSendImpulse,
  createPulseSendReturn,
  log,
  sdn
}) {
  const mover = createPulseSendMover({ pulseMesh, log });
  const impulse = createPulseSendImpulse({ mover, log });
  const returnArc = createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log });

  function emitSDN(source, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(source, payload);
    } catch (e) {
      log && log("[PulseSend-v11] SDN emit failed (non-fatal)", { source, error: e });
    }
  }

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
    let fallbackSurface = null;

    emitSDN("send:begin", { jobId, pattern, priority, returnTo, mode });

    // ⭐ Tier 1 — Pulse v3
    try {
      pulse = createPulseV3({ jobId, pattern, payload, priority, returnTo, mode });
      pulseType = "Pulse-v3";
    } catch (errV3) {
      fallbackSurface = buildFallbackSurface("v3→v2", errV3);
      emitSDN("send:pulse-fallback", { jobId, pattern, from: "v3", to: "v2", error: String(errV3) });
    }

    // ⭐ Tier 2 — Pulse v2
    if (!pulse) {
      try {
        pulse = createPulseV2({ jobId, pattern, payload, priority, returnTo, mode });
        pulseType = "Pulse-v2";
      } catch (errV2) {
        fallbackSurface = buildFallbackSurface("v2→v1", errV2);
        emitSDN("send:pulse-fallback", { jobId, pattern, from: "v2", to: "v1", error: String(errV2) });
      }
    }

    // ⭐ Tier 3 — Pulse v1
    if (!pulse) {
      pulse = createPulseV1({ jobId, pattern, payload, priority, returnTo, mode });
      pulseType = "Pulse-v1";
      fallbackSurface = buildFallbackSurface("none→v1", "v3/v2 creation failed");
      emitSDN("send:pulse-fallback", { jobId, pattern, from: "none", to: "v1" });
    }

    emitSDN("send:pulse-created", { jobId, pattern, mode, pulseType });

    // ⭐ Route
    const targetOrgan = pulseRouter.route(pulse);
    const routeSurface = buildRouteSurface(targetOrgan);

    // ⭐ Pathway
    const pathway = pulseMesh.pathwayFor(targetOrgan, mode);
    const pathwaySurface = buildPathwaySurface(pathway);

    emitSDN("send:routed", { jobId, pattern, targetOrgan, pathway, mode, pulseType });

    // ⭐ Movement
    const movement = impulse.fire({ pulse, targetOrgan, pathway, mode });
    const movementSurface = buildMovementSurface(movement);

    emitSDN("send:movement", {
      jobId,
      pattern,
      targetOrgan,
      pathway,
      mode,
      pulseType,
      movementMeta: movementSurface
    });

    // ⭐ Return Arc
    const result = returnArc.handle(movement.packet, mode);
    const returnSurface = buildReturnSurface(result);

    emitSDN("send:return", {
      jobId,
      pattern,
      mode,
      pulseType,
      resultMeta: returnSurface
    });

    // ⭐ Memory
    pulseRouter.remember(pulse, targetOrgan, "success", pulse.healthScore || 1);

    emitSDN("send:complete", { jobId, pattern, targetOrgan, mode, pulseType });

    // ⭐ Return full telemetry
    return {
      PulseRole,
      movement,
      result,
      mode,
      pulseType,

      fallbackSurface,
      routeSurface,
      pathwaySurface,
      movementSurface,
      returnSurface,

      diagnostics: buildSendDiagnostics({
        jobId,
        pattern,
        mode,
        pulseType
      })
    };
  }

  return {
    PulseRole,
    send
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSend (v11)
// ============================================================================
export const PulseSend = {
  PulseRole,

  send(...args) {
    throw new Error(
      "[PulseSend-v11] PulseSend.send() was called before initialization. " +
      "Use createPulseSend(...) to wire dependencies."
    );
  }
};
