// ============================================================================
//  PulseSendReturn-v11-Evo-12_4_Upgrade.js
//  Return Arc • Pulse‑Agnostic Bounce‑Back Organ • Handles returnTo Logic
//  v11: Diagnostics + Signatures + Pattern Surface + Lineage Surface
//  v11-Binary: Binary-Aware + Symbolic-Aware Return Surface
//  12.4-Upgrade: Movement-aware, packet-aware, backward-compatible
// ============================================================================

export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Return",
  version: "11.0",
  identity: "PulseSendReturn-v11-Evo-12.4-Upgrade",

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
    pulseSend11Ready: true,

    diagnosticsReady: true,
    signatureReady: true,
    returnSurfaceReady: true,

    // Binary-aware return surface:
    binaryAwareReturnReady: true,

    // 12.4+: movement/packet aware
    movementPacketAware: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  pulseContract: "Pulse-v1/v2/v3",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function extractBinarySurfaceFromPulse(pulse) {
  const payload = pulse?.payload || {};

  const binaryPattern  = payload.binaryPattern || null;
  const binaryMode     = payload.binaryMode || null;
  const binaryPayload  = payload.binaryPayload || null;
  const binaryHints    = payload.binaryHints || null;
  const binaryStrength = typeof payload.binaryStrength === "number"
    ? payload.binaryStrength
    : null;

  const hasBinary =
    !!binaryPattern ||
    !!binaryMode ||
    !!binaryPayload ||
    !!binaryHints ||
    binaryStrength !== null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength
  };
}

function buildReturnDiagnostics({
  pulse,
  movementPacket,
  returnTo,
  targetOrgan,
  pathway,
  mode
}) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binarySurface = extractBinarySurfaceFromPulse(pulse);

  const movementSignature = movementPacket?.movementSignature || null;
  const movementDiagnostics = movementPacket?.diagnostics || null;

  return {
    // Core symbolic surface
    pattern,
    lineageDepth,
    pulseType,
    returnTo: returnTo || "NO_RETURN_TARGET",
    targetOrgan: targetOrgan || "NO_ORGAN",
    pathway: pathway || "NO_PATHWAY",
    mode,

    // Binary surface (optional, non-breaking)
    binary: binarySurface,

    // Movement packet surface (12.4+)
    movementSignature,
    movementDiagnostics,

    // Hashes
    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    returnTargetHash: computeHash(String(returnTo)),
    organHash: computeHash(String(targetOrgan)),
    pathwayHash: computeHash(JSON.stringify(pathway || {})),

    // Binary hashes
    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  FACTORY — Create the Return Organ (v11-Evo + Binary-Aware + 12.4 Packet)
// ============================================================================
export function createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log }) {
  return {
    PulseRole,

    // movementOrPulse is usually movement.packet from Impulse/Mover,
    // but we stay backward-compatible with a raw pulse.
    handle(movementOrPulse, modeOverride = "normal") {
      const movementPacket = movementOrPulse && movementOrPulse.packet
        ? movementOrPulse.packet
        : movementOrPulse;

      const packet = movementPacket || {};
      const pulse = packet.pulse || movementOrPulse || {};

      const {
        returnTo,
        pattern = "UNKNOWN_PATTERN",
        lineage = []
      } = pulse;

      const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
      const pulseType = pulse.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
      const mode = modeOverride || packet.mode || pulse.mode || "normal";

      // ⭐ No return target → end of chain
      if (!returnTo) {
        const diagnostics = buildReturnDiagnostics({
          pulse,
          movementPacket: packet,
          returnTo: null,
          targetOrgan: null,
          pathway: null,
          mode
        });

        log && log("[PulseSendReturn-v11-Evo-12.4] No returnTo target — chain complete", {
          jobId: pulse.jobId,
          diagnostics
        });

        return {
          completed: true,
          returned: false,
          diagnostics,
          pulse,
          movementIn: packet
        };
      }

      // ⭐ Return target exists → route the return pulse
      log && log("[PulseSendReturn-v11-Evo-12.4] Returning pulse", {
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

      const diagnostics = buildReturnDiagnostics({
        pulse,
        movementPacket: packet,
        returnTo,
        targetOrgan,
        pathway,
        mode
      });

      // ⭐ v11/12.4 return signature (binary + movement aware)
      const returnSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.returnTo +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY_PATTERN") +
        "::" +
        (diagnostics.movementSignature || "NO_MOVEMENT_SIGNATURE")
      );

      // ⭐ Step 3 — fire impulse back (prevent infinite loops)
      const backMovement = impulse.fire({
        pulse: {
          ...pulse,
          returnTo: null, // prevent infinite loops
          mode
        },
        targetOrgan,
        pathway,
        mode
      });

      return {
        completed: true,
        returned: true,
        returnSignature,
        diagnostics,
        movement: backMovement,
        movementIn: packet
      };
    }
  };
}
