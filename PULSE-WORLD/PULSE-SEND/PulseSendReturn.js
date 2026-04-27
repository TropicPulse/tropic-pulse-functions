// ============================================================================
//  PulseSendReturn-v11-Evo.js
//  Return Arc • Pulse‑Agnostic Bounce‑Back Organ • Handles returnTo Logic
//  v11: Diagnostics + Signatures + Pattern Surface + Lineage Surface
//  v11-Binary: Binary-Aware + Symbolic-Aware Return Surface
// ============================================================================
//
//  ROLE:
//    • Pulse‑agnostic return organ (v1/v2/v3).
//    • Handles returnTo logic and routes the pulse back via Router + Mesh.
//    • Emits rich diagnostics + signatures for the return arc.
//    • Now *binary-aware*:
//        - If pulse carries binary metadata (binaryPattern, binaryMode, etc.),
//          it is surfaced in diagnostics and returnSignature.
//        - Works equally well for purely symbolic pulses.
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
// ⭐ PulseRole — identifies this as the PulseSend Return Organ (v11-Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Return",
  version: "11.0",
  identity: "PulseSendReturn-v11-Evo",

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
    //  - understands binaryPattern / binaryMode / binaryStrength if present
    //  - but does not require them
    binaryAwareReturnReady: true
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
  // We treat binary metadata as *optional* and non-breaking.
  // If present, we surface it; if not, we stay purely symbolic.
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

function buildReturnDiagnostics({ pulse, returnTo, targetOrgan, pathway, mode }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binarySurface = extractBinarySurfaceFromPulse(pulse);

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

    // Hashes for quick indexing / SDN / logging
    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    returnTargetHash: computeHash(String(returnTo)),
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
//  FACTORY — Create the Return Organ (v11-Evo + Binary-Aware)
// ============================================================================
export function createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log }) {
  return {
    PulseRole,

    handle(pulse, mode = "normal") {
      const {
        returnTo,
        pattern = "UNKNOWN_PATTERN",
        lineage = []
      } = pulse;

      const lineageDepth = Array.isArray(lineage) ? lineage.length : 0;
      const pulseType = pulse.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

      // ⭐ No return target → end of chain
      if (!returnTo) {
        const diagnostics = buildReturnDiagnostics({
          pulse,
          returnTo: null,
          targetOrgan: null,
          pathway: null,
          mode
        });

        log && log("[PulseSendReturn-v11-Evo] No returnTo target — chain complete", {
          jobId: pulse.jobId,
          diagnostics
        });

        return {
          completed: true,
          returned: false,
          diagnostics,
          pulse
        };
      }

      // ⭐ Return target exists → route the return pulse
      log && log("[PulseSendReturn-v11-Evo] Returning pulse", {
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
        returnTo,
        targetOrgan,
        pathway,
        mode
      });

      // ⭐ v11 return signature (now implicitly binary-aware via diagnostics)
      const returnSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.returnTo +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY_PATTERN")
      );

      // ⭐ Step 3 — fire impulse back (prevent infinite loops)
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
        returnSignature,
        diagnostics,
        movement
      };
    }
  };
}
