// ============================================================================
//  EvolutionaryWiring.js — v12.3-PRESENCE-EVO-MAX-PRIME
//  PulseMesh Wiring Organ • Nervous System Pathway Selector
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The wiring layer of the Pulse Nervous System.
//  • Chooses wiring surfaces for symbolic + binary + dual-band pulses.
//  • Pattern-aware, lineage-aware, presence-aware, deterministic.
//  • Self-repairing: bad wiring auto-corrects to safe defaults.
//  • Zero compute, zero mutation outside instance.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter handles destination).
//  • Not a mover (PulseSend handles movement).
//  • Not a compute engine.
//  • Not a network layer.
//  • Not a messenger.
//
//  SAFETY CONTRACT (v12.3):
//  -------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic wiring logic.
//  • Zero mutation outside instance.
//  • Presence-aware, binary-aware, dual-band-aware.
// ============================================================================


// ⭐ PulseRole — identifies this as the PulseMesh Wiring Organ (v12.3)
export const PulseRole = {
  type: "Mesh",
  subsystem: "PulseMesh",
  layer: "Wiring",
  version: "12.3-PRESENCE-EVO-MAX-PRIME",
  identity: "PulseMesh-Wiring-v12.3",

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
    presenceAware: true,
    bandAware: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    deterministicField: true,
    pulseMesh12Ready: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  routerContract: "PulseRouter-v12.3",
  sendContract: "PulseSend-v12.3"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// Build a wiring key from organ + lineage depth + mode + presence band
function buildWiringKey(targetOrgan, pulse) {
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "symbolic";
  const band = pulse.band || "symbolic";
  return `${targetOrgan}::d${depth}::${mode}::${band}`;
}

// Infer default wiring surface from organ + pattern + mode + presence band
function inferDefaultWiring(targetOrgan, pulse) {
  const p = (pulse.pattern || "").toLowerCase();
  const mode = pulse.mode || "symbolic";
  const band = pulse.band || "symbolic";

  // Presence-band bias
  if (band === "binary") {
    if (targetOrgan === "GPU") return "gpuBinaryBurst";
    if (targetOrgan === "Earn") return "earnBinaryChain";
    if (targetOrgan === "OS") return "osBinaryBridge";
    if (targetOrgan === "Mesh") return "meshBinarySignal";
    return "binaryPreferred";
  }

  if (band === "dual") {
    if (targetOrgan === "GPU") return "gpuDualBurst";
    if (targetOrgan === "Earn") return "earnDualChain";
    if (targetOrgan === "OS") return "osDualBridge";
    if (targetOrgan === "Mesh") return "meshDualSignal";
    return "dualPreferred";
  }

  // Mode bias (symbolic vs binary)
  if (mode === "binary") {
    if (targetOrgan === "GPU") return "gpuBinaryBurst";
    if (targetOrgan === "Earn") return "earnBinaryChain";
    if (targetOrgan === "OS") return "osBinaryBridge";
    if (targetOrgan === "Mesh") return "meshBinarySignal";
    return "binaryPreferred";
  }

  // Symbolic defaults
  if (targetOrgan === "GPU") return "gpuBurst";
  if (targetOrgan === "Earn") return "earnCreditChain";
  if (targetOrgan === "OS") return "osBridge";
  if (targetOrgan === "Mesh") return "meshSignal";

  // Pattern hints
  if (p.includes("gpu")) return "gpuBurst";
  if (p.includes("earn")) return "earnCreditChain";
  if (p.includes("os")) return "osBridge";
  if (p.includes("mesh")) return "meshSignal";

  return "neutral";
}


// ============================================================================
//  FACTORY — Create PulseMesh Wiring Organ (v12.3)
// ============================================================================
//
//  Behavior:
//    • wiringFor(targetOrgan, pulse) → returns wiring surface
//    • remember(targetOrgan, pulse, outcome) → stores reflexive wiring memory
//
//  Memory model:
//    • internal map: wiringKey → { surface, successCount, failureCount }
//    • deterministic fallback: if failures dominate → safeFallback
//    • presence-aware: wiring memory is band-scoped
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

    log && log("[PulseMesh-Wiring-v12.3] Selecting wiring surface", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      lineageDepth: pulse.lineage?.length || 0,
      mode: pulse.mode,
      band: pulse.band,
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

    log && log("[PulseMesh-Wiring-v12.3] Remembering wiring", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      mode: pulse.mode,
      band: pulse.band,
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
