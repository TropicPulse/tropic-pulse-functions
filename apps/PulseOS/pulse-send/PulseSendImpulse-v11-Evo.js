// ============================================================================
//  PulseSendImpulse-v11-Evo.js
//  Nerve‑Spark • Pulse‑Agnostic Trigger Organ • Fires the Movement
//  v11: Diagnostics + Signatures + Pattern Surface + Lineage Surface
//  v11-Binary: Binary-Aware Impulse Surface (Optional, Non-Breaking)
// ============================================================================
//
//  ROLE:
//    • Pulse‑agnostic spark organ (v1/v2/v3).
//    • Fires the movement via the mover organ.
//    • Emits diagnostics + signatures for the impulse arc.
//    • Now *binary-aware*:
//        - If the pulse carries binary metadata (binaryPattern, binaryMode, etc.),
//          it is surfaced in diagnostics and in the impulseSignature.
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
// ⭐ PulseRole — identifies this as the PulseSend Impulse Organ (v11-Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Impulse",
  version: "11.0",
  identity: "PulseSendImpulse-v11-Evo",

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
    pulseSend11Ready: true,

    diagnosticsReady: true,
    signatureReady: true,
    impulseSurfaceReady: true,

    // Binary-aware impulse surface:
    //  - understands binaryPattern / binaryMode / binaryStrength if present
    //  - does not require them
    binaryAwareImpulseReady: true
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

function buildImpulseDiagnostics({ pulse, targetOrgan, pathway, mode }) {
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
//  FACTORY — Create the Impulse Organ (v11-Evo + Binary-Aware)
// ============================================================================
export function createPulseSendImpulse({ mover, log }) {
  return {
    PulseRole,

    fire({ pulse, targetOrgan, pathway, mode = "normal" }) {

      const diagnostics = buildImpulseDiagnostics({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      const advantageField = pulse?.advantageField || null;

      // ⭐ v11 logging surface
      log && log("[PulseSendImpulse-v11-Evo] Spark fired", {
        jobId: pulse.jobId,
        diagnostics,
        advantageField
      });

      // ⭐ v11 impulse signature (now implicitly binary-aware via diagnostics)
      const impulseSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.lineageDepth +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY_PATTERN")
      );

      // ⭐ Trigger the mover (pure spark)
      const movement = mover.move({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      return {
        impulseSignature,
        diagnostics,
        movement
      };
    }
  };
}
