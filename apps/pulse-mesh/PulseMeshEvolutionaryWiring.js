// ============================================================================
//  EvolutionaryWiring.js — v3.0
//  PulseMesh v3 • Nervous System Wiring • Pattern-Based Pathways
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The wiring layer of the Pulse Nervous System.
//  • Chooses pathway style for Pulse v2 organisms.
//  • Pattern-aware, lineage-aware, reflexive, deterministic.
//  • Self-repairing: bad pathways auto-correct to safe defaults.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter v3 handles destination).
//  • Not a mover (PulseSend handles movement).
//  • Not a compute engine.
//  • Not a network layer.
//  • Not a messenger.
//
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic wiring logic.
//  • Zero mutation outside instance.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseMesh v3 Organ
export const PulseRole = {
  type: "Mesh",
  subsystem: "PulseMesh",
  layer: "Wiring",
  version: "3.0",
  identity: "PulseMesh-v3",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    wiringReady: true,
    selfRepairReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseMesh3Ready: true
  },

  pulseContract: "Pulse-v2",
  routerContract: "PulseRouter-v3",
  sendContract: "PulseSend-v3",
  gpuOrganContract: "PulseGPU-v9.2",
  earnCompatibility: "PulseEarn-v9"
};

// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// ⭐ Build a wiring key from organ + lineage depth
function buildWiringKey(targetOrgan, pulse) {
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  return `${targetOrgan}::d${depth}`;
}

// ⭐ Infer pathway style from organ name + pattern hints
function inferDefaultPathway(targetOrgan, pulse) {
  const p = pulse.pattern.toLowerCase();

  if (targetOrgan === "GPU") return "fast-lane";
  if (targetOrgan === "Earn") return "steady-lane";
  if (targetOrgan === "OS") return "safe-lane";
  if (targetOrgan === "Mesh") return "signal-lane";

  if (p.includes("gpu")) return "fast-lane";
  if (p.includes("earn")) return "steady-lane";
  if (p.includes("os")) return "safe-lane";
  if (p.includes("mesh")) return "signal-lane";

  return "neutral-lane";
}

// ============================================================================
//  FACTORY — Create PulseMesh v3
// ============================================================================
//
//  Behavior:
//    • pathwayFor(targetOrgan, pulse) → returns pathway style
//    • remember(targetOrgan, pulse, outcome) → stores reflexive wiring memory
//
//  Memory model:
//    • internal map: wiringKey → { pathway, successCount, failureCount }
//    • deterministic fallback: if failures dominate → safe-lane
// ============================================================================

export function createPulseMesh({ log } = {}) {
  const memory = {}; // wiringKey → { pathway, successCount, failureCount }

  function pathwayFor(targetOrgan, pulse) {
    const key = buildWiringKey(targetOrgan, pulse);
    const entry = memory[key];

    let pathway;

    if (entry && entry.pathway) {
      pathway = entry.pathway;
    } else {
      pathway = inferDefaultPathway(targetOrgan, pulse);
      memory[key] = {
        pathway,
        successCount: 0,
        failureCount: 0
      };
    }

    log && log("[PulseMesh-v3] Selecting pathway", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      lineageDepth: pulse.lineage.length,
      wiringKey: key,
      pathway
    });

    return pathway;
  }

  function remember(targetOrgan, pulse, outcome = "success") {
    const key = buildWiringKey(targetOrgan, pulse);
    const entry = memory[key] || {
      pathway: inferDefaultPathway(targetOrgan, pulse),
      successCount: 0,
      failureCount: 0
    };

    if (outcome === "success") {
      entry.successCount += 1;
    } else if (outcome === "failure") {
      entry.failureCount += 1;
    }

    // ⭐ Self-repair: if failures dominate, switch to safe-lane
    if (entry.failureCount > entry.successCount) {
      entry.pathway = "safe-lane";
    }

    memory[key] = entry;

    log && log("[PulseMesh-v3] Remembering pathway", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      wiringKey: key,
      pathway: entry.pathway,
      successCount: entry.successCount,
      failureCount: entry.failureCount
    });

    return entry;
  }

  return {
    PulseRole,
    pathwayFor,
    remember
  };
}
