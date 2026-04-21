// ============================================================================
//  EvolutionaryThought.js — v3.0
//  PulseRouter v3 • Pattern Brainstem • Reflexive Route Memory
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The routing brainstem for Pulse v2 organisms.
//  • Chooses target organs based on pattern + lineage.
//  • Remembers successful routes (reflex arcs).
//  • Remembers failures (avoidance arcs).
//  • Deterministic, pattern‑native, lineage‑aware.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a transport organ (PulseSend handles movement).
//  • Not a mesh/wiring organ (PulseMesh handles pathways).
//  • Not a compute engine.
//  • Not a network client.
//  • Not a GPU/Earn/OS organ.
//
//  SAFETY CONTRACT (v3.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape logic.
//  • Internal memory only (no external mutation).
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseRouter v3 Organ
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "3.0",
  identity: "PulseRouter-v3",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    memoryReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseRouter3Ready: true
  },

  pulseContract: "Pulse-v2",
  sendContract: "PulseSend-v3",
  meshContract: "PulseMesh-v3",
  gpuOrganContract: "PulseGPU-v9.2",
  earnCompatibility: "PulseEarn-v9"
};

// ============================================================================
//  INTERNAL HELPERS — tiny, deterministic, pure
// ============================================================================

// ⭐ Build a routing key from pattern + lineage depth
function buildRouteKey(pulse) {
  const pattern = pulse.pattern || "";
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  return `${pattern}::d${depth}`;
}

// ⭐ Very small, deterministic organ hint from pattern
function inferOrganHint(pattern) {
  const p = pattern.toLowerCase();

  if (p.includes("gpu")) return "GPU";
  if (p.includes("earn")) return "Earn";
  if (p.includes("os")) return "OS";
  if (p.includes("mesh")) return "Mesh";

  return null;
}

// ⭐ Default routing decision when no memory exists
function defaultRoute(pulse) {
  const hint = inferOrganHint(pulse.pattern);
  if (hint) return hint;

  // Fallback: OS as safe default
  return "OS";
}

// ============================================================================
//  FACTORY — Create PulseRouter v3
// ============================================================================
//
//  Behavior:
//    • route(pulse)    → returns targetOrgan
//    • remember(pulse, targetOrgan, outcome?) → stores reflex memory
//
//  Memory model:
//    • internal map: routeKey → { targetOrgan, successCount, failureCount }
//    • no randomness, no timestamps
// ============================================================================

export function createPulseRouter({ log } = {}) {
  const memory = {}; // routeKey → { targetOrgan, successCount, failureCount }

  function route(pulse) {
    const key = buildRouteKey(pulse);
    const entry = memory[key];

    let targetOrgan;

    if (entry && entry.targetOrgan) {
      targetOrgan = entry.targetOrgan;
    } else {
      targetOrgan = defaultRoute(pulse);
      memory[key] = {
        targetOrgan,
        successCount: 0,
        failureCount: 0
      };
    }

    log && log("[PulseRouter-v3] Routing pulse", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      lineageDepth: Array.isArray(pulse.lineage) ? pulse.lineage.length : 0,
      routeKey: key,
      targetOrgan
    });

    return targetOrgan;
  }

  function remember(pulse, targetOrgan, outcome = "success") {
    const key = buildRouteKey(pulse);
    const entry = memory[key] || {
      targetOrgan,
      successCount: 0,
      failureCount: 0
    };

    if (outcome === "success") {
      entry.successCount += 1;
    } else if (outcome === "failure") {
      entry.failureCount += 1;
    }

    // Deterministic adjustment: if failures dominate, fall back to OS
    if (entry.failureCount > entry.successCount && targetOrgan !== "OS") {
      entry.targetOrgan = "OS";
    } else {
      entry.targetOrgan = targetOrgan;
    }

    memory[key] = entry;

    log && log("[PulseRouter-v3] Remembering route", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      routeKey: key,
      targetOrgan: entry.targetOrgan,
      successCount: entry.successCount,
      failureCount: entry.failureCount
    });

    return entry;
  }

  return {
    PulseRole,
    route,
    remember
  };
}
