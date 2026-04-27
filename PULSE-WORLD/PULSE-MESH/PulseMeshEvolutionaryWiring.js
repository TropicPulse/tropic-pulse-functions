// ============================================================================
//  EvolutionaryWiring.js — v11-Evo
//  PulseMesh Wiring Organ • Nervous System Pathway Selector
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The wiring layer of the Pulse Nervous System.
//  • Chooses wiring surfaces for symbolic + binary pulses.
//  • Pattern-aware, lineage-aware, dual-mode-aware, deterministic.
//  • Self-repairing: bad wiring auto-corrects to safe defaults.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v11 handles destination).
//  • Not a mover (PulseSend v11 handles movement).
//  • Not a compute engine.
//  • Not a network layer.
//  • Not a messenger.
//
//  SAFETY CONTRACT (v11-Evo):
//  ---------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic wiring logic.
//  • Zero mutation outside instance.
// ============================================================================


// ⭐ PulseRole — identifies this as the PulseMesh Wiring Organ (v11-Evo)
export const PulseRole = {
  type: "Mesh",
  subsystem: "PulseMesh",
  layer: "Wiring",
  version: "11.0-Evo",
  identity: "PulseMesh-Wiring-v11-Evo",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    wiringReady: true,
    selfRepairReady: true,
    dualModeReady: true,
    binaryAware: true,
    symbolicAware: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    deterministicField: true,
    pulseMesh11Ready: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  routerContract: "PulseRouter-v11",
  sendContract: "PulseSend-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// Build a wiring key from organ + lineage depth + mode
function buildWiringKey(targetOrgan, pulse) {
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "symbolic";
  return `${targetOrgan}::d${depth}::${mode}`;
}

// Infer default wiring surface from organ + pattern + mode
function inferDefaultWiring(targetOrgan, pulse) {
  const p = (pulse.pattern || "").toLowerCase();
  const mode = pulse.mode || "symbolic";

  // Binary mode prefers binary surfaces
  if (mode === "binary") {
    if (targetOrgan === "GPU") return "gpuBurst";
    if (targetOrgan === "Earn") return "earnCreditChain";
    if (targetOrgan === "OS") return "osBridge";
    if (targetOrgan === "Mesh") return "meshSignal";
    return "binaryPreferred";
  }

  // Symbolic mode
  if (targetOrgan === "GPU") return "gpuBurst";
  if (targetOrgan === "Earn") return "earnCreditChain";
  if (targetOrgan === "OS") return "osBridge";
  if (targetOrgan === "Mesh") return "meshSignal";

  if (p.includes("gpu")) return "gpuBurst";
  if (p.includes("earn")) return "earnCreditChain";
  if (p.includes("os")) return "osBridge";
  if (p.includes("mesh")) return "meshSignal";

  return "neutral";
}


// ============================================================================
//  FACTORY — Create PulseMesh Wiring Organ (v11-Evo)
// ============================================================================
//
//  Behavior:
//    • wiringFor(targetOrgan, pulse) → returns wiring surface
//    • remember(targetOrgan, pulse, outcome) → stores reflexive wiring memory
//
//  Memory model:
//    • internal map: wiringKey → { surface, successCount, failureCount }
//    • deterministic fallback: if failures dominate → safeFallback
// ============================================================================

export function createPulseMeshWiring({ log } = {}) {
  const memory = {}; // wiringKey → { surface, successCount, failureCount }

  function wiringFor(targetOrgan, pulse) {
    const key = buildWiringKey(targetOrgan, pulse);
    const entry = memory[key];

    let surface;

    if (entry && entry.surface) {
      surface = entry.surface;
    } else {
      surface = inferDefaultWiring(targetOrgan, pulse);
      memory[key] = {
        surface,
        successCount: 0,
        failureCount: 0
      };
    }

    log && log("[PulseMesh-Wiring-v11-Evo] Selecting wiring surface", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      lineageDepth: pulse.lineage?.length || 0,
      mode: pulse.mode,
      wiringKey: key,
      surface
    });

    return surface;
  }

  function remember(targetOrgan, pulse, outcome = "success") {
    const key = buildWiringKey(targetOrgan, pulse);
    const entry = memory[key] || {
      surface: inferDefaultWiring(targetOrgan, pulse),
      successCount: 0,
      failureCount: 0
    };

    if (outcome === "success") {
      entry.successCount += 1;
    } else if (outcome === "failure") {
      entry.failureCount += 1;
    }

    // ⭐ Self-repair: if failures dominate, switch to safeFallback
    if (entry.failureCount > entry.successCount) {
      entry.surface = "safeFallback";
    }

    memory[key] = entry;

    log && log("[PulseMesh-Wiring-v11-Evo] Remembering wiring", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      mode: pulse.mode,
      wiringKey: key,
      surface: entry.surface,
      successCount: entry.successCount,
      failureCount: entry.failureCount
    });

    return entry;
  }

  return {
    PulseRole,
    wiringFor,
    remember
  };
}
