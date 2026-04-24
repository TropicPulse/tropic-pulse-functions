// ============================================================================
//  PulseSendMover-v11-Evo.js
//  Movement Organ • Pulse‑Agnostic • Deterministic Transport Muscle
//  v11: Diagnostics + Signatures + Pattern Surface + Lineage Surface
//  v11-Binary: Binary-Aware Movement Surface (Optional, Non-Breaking)
// ============================================================================
//
//  ROLE:
//    • Pulse‑agnostic movement organ (v1/v2/v3).
//    • Builds a deterministic movement packet (no side effects).
//    • Emits diagnostics + signatures for the movement arc.
//    • Now *binary-aware*:
//        - If the pulse carries binary metadata (binaryPattern, binaryMode, etc.),
//          it is surfaced in diagnostics and in the movementSignature.
//        - If not, behavior is unchanged.
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No imports.
//  • No network.
//  • No compute beyond local helpers.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Mover Organ (v11-Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Mover",
  version: "11.0",
  identity: "PulseSendMover-v11-Evo",

  evo: {
    driftProof: true,
    moverReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    multiOrganReady: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    diagnosticsReady: true,
    signatureReady: true,
    movementSurfaceReady: true,

    // Binary-aware movement surface:
    //  - understands binaryPattern / binaryMode / binaryStrength if present
    //  - does not require them
    binaryAwareMovementReady: true
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

function buildMovementDiagnostics({ pulse, targetOrgan, pathway, mode }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binarySurface = extractBinarySurfaceFromPulse(pulse);

  return {
    // Core symbolic surface
    pattern,
    lineageDepth,
    pulseType,
    targetOrgan: targetOrgan || "NO_ORGAN",
    pathway: pathway || "NO_PATHWAY",
    mode,

    // Binary surface (optional, non-breaking)
    binary: binarySurface,

    // Hashes for quick indexing / SDN / logging
    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    organHash: computeHash(String(targetOrgan)),
    pathwayHash: computeHash(JSON.stringify(pathway || {})),

    // Binary hashes (only meaningful if hasBinary === true)
    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  FACTORY — Create the Mover Organ (v11-Evo + Binary-Aware)
// ============================================================================
export function createPulseSendMover({ pulseMesh, log }) {
  return {
    PulseRole,

    move({ pulse, targetOrgan, pathway, mode = "normal" }) {

      const diagnostics = buildMovementDiagnostics({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      const advantageField = pulse?.advantageField || null;

      // ⭐ v11 logging surface
      log && log("[PulseSendMover-v11-Evo] Movement fired", {
        jobId: pulse.jobId,
        diagnostics,
        advantageField
      });

      // ⭐ v11 movement signature (now implicitly binary-aware via diagnostics)
      const movementSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY_PATTERN")
      );

      // ⭐ Return deterministic movement packet
      return {
        packet: {
          pulse,
          targetOrgan,
          pathway,
          mode,
          movementSignature,
          diagnostics
        }
      };
    }
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSendMover (v11-Evo)
// ============================================================================
export const PulseSendMover = {
  PulseRole,

  move({ pulse, targetOrgan, pathway, mode }) {
    const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
    const pattern = pulse?.pattern || "NO_PATTERN";
    const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
    const organLabel = targetOrgan || "NO_ORGAN";
    const pathwayLabel = pathway || "NO_PATHWAY";
    const modeLabel = mode || "NO_MODE";
    const advantageField = pulse?.advantageField || null;

    throw new Error(
      `[PulseSendMover-v11-Evo] move() called before initialization.\n` +
      `• pulseType: ${pulseType}\n` +
      `• pattern: ${pattern}\n` +
      `• lineageDepth: ${lineageDepth}\n` +
      `• targetOrgan: ${organLabel}\n` +
      `• pathway: ${pathwayLabel}\n` +
      `• mode: ${modeLabel}\n` +
      `• advantageField: ${JSON.stringify(advantageField)}\n` +
      `Use createPulseSendMover(...) to wire dependencies.`
    );
  }
};
