// ============================================================================
//  EvolutionaryThought.js — v10.0
//  PulseRouter v10 • Pattern Brainstem • Degradation-Aware Reflex Router
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The routing brainstem for Pulse organisms.
//  • Chooses target organs based on pattern + lineage + degradation.
//  • Remembers successful routes (reflex arcs).
//  • Remembers degraded routes and bypasses (avoidance arcs).
//  • Deterministic, pattern‑native, lineage‑aware, degradation‑aware.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a transport organ (PulseSend handles movement).
//  • Not a mesh/wiring organ (PulseMesh handles pathways).
//  • Not a compute engine.
//  • Not a network client.
//  • Not a GPU/Earn/OS organ.
//  • Not an IQ/import organ.
//
//  SAFETY CONTRACT (v10.0):
//  ------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape logic.
//  • Internal memory only (no external mutation).
//  • Degradation-aware, but always routes forward.
// ============================================================================

// ⭐ PulseRole — identifies this as the PulseRouter v10.0 Organ
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "10.0",
  identity: "PulseRouter-v10.0",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    memoryReady: true,
    deterministicImpulseFlow: true,
    unifiedAdvantageField: true,
    pulseRouter10Ready: true,
    degradationAware: true,
    routeAroundReady: true,
    futureEvolutionReady: true
  },

  // Contract alignment for OS‑v10
  pulseContract: "Pulse-v3",
  sendContract: "PulseSend-v3",
  meshContract: "PulseMesh-v3",
  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  INTERNAL HELPERS — tiny, deterministic, pure
// ============================================================================

// ⭐ Build a routing key from pattern + lineage depth (+ optional pageId)
function buildRouteKey(pulse) {
  const pattern = pulse.pattern || "";
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pageId = pulse.pageId || "NO_PAGE";
  return `${pattern}::d${depth}::p${pageId}`;
}

// ⭐ Very small, deterministic organ hint from pattern
function inferOrganHint(pattern) {
  const p = (pattern || "").toLowerCase();

  if (p.includes("gpu")) return "GPU";
  if (p.includes("earn")) return "Earn";
  if (p.includes("os")) return "OS";
  if (p.includes("mesh")) return "Mesh";

  // Fallback: OS as safe default
  return "OS";
}

// ⭐ Default routing decision when no memory exists
function defaultRoute(pulse) {
  return inferOrganHint(pulse.pattern);
}

// ⭐ Classify degradation into routing mode
//    • direct      → ideal route
//    • bypass      → keep route but mark as degraded
//    • routeAround → route around this segment (fallback to OS)
function classifyDegradation(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;

  if (h >= 0.85) return "direct";
  if (h >= 0.15) return "bypass";
  return "routeAround";
}


// ============================================================================
//  FACTORY — Create PulseRouter v10.0
// ============================================================================
//
//  Behavior:
//    • route(pulse) → returns targetOrgan (string)
//         pulse may include:
//           - pattern
//           - lineage
//           - pageId
//           - degraded (boolean)
//           - healthScore (0.0–1.0)
//    • remember(pulse, targetOrgan, outcome?, healthScore?) → stores reflex memory
//
//  Memory model:
//    • internal map: routeKey → {
//          idealOrgan,      // best known organ for this pattern/lineage/page
//          currentOrgan,    // organ used under current degradation
//          successCount,
//          failureCount,
//          degraded,
//          healthScore,     // last observed healthScore
//          mode             // "direct" | "bypass" | "routeAround"
//      }
//    • no randomness, no timestamps
// ============================================================================

export function createPulseRouter({ log } = {}) {
  const memory = {}; // routeKey → { idealOrgan, currentOrgan, successCount, failureCount, degraded, healthScore, mode }

  function route(pulse) {
    const key = buildRouteKey(pulse);
    const incomingHealth = typeof pulse.healthScore === "number" ? pulse.healthScore : 1.0;
    const incomingDegraded = !!pulse.degraded;

    let entry = memory[key];

    // Initialize memory entry if none exists
    if (!entry) {
      const idealOrgan = defaultRoute(pulse);
      const mode = classifyDegradation(incomingHealth);
      let currentOrgan = idealOrgan;

      if (mode === "routeAround") {
        // Full route-around: OS as global safe fallback
        currentOrgan = "OS";
      }

      entry = {
        idealOrgan,
        currentOrgan,
        successCount: 0,
        failureCount: 0,
        degraded: incomingDegraded || mode !== "direct",
        healthScore: incomingHealth,
        mode
      };

      memory[key] = entry;
    } else {
      // Update degradation state based on latest healthScore
      const mode = classifyDegradation(incomingHealth);
      entry.healthScore = incomingHealth;
      entry.degraded = incomingDegraded || mode !== "direct";
      entry.mode = mode;

      if (mode === "direct") {
        // Use ideal route when healthy
        entry.currentOrgan = entry.idealOrgan;
      } else if (mode === "bypass") {
        // Bypass but keep same organ; higher layers decide how to "go around page"
        // Router stays deterministic: same organ, different mode.
        entry.currentOrgan = entry.currentOrgan || entry.idealOrgan;
      } else {
        // routeAround: full bypass to OS
        entry.currentOrgan = "OS";
      }

      memory[key] = entry;
    }

    const targetOrgan = entry.currentOrgan;

    log && log("[PulseRouter-v10.0] Routing pulse", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      pageId: pulse.pageId || "NO_PAGE",
      lineageDepth: Array.isArray(pulse.lineage) ? pulse.lineage.length : 0,
      routeKey: key,
      targetOrgan,
      mode: entry.mode,
      degraded: entry.degraded,
      healthScore: entry.healthScore
    });

    return targetOrgan;
  }

  function remember(pulse, targetOrgan, outcome = "success", healthScore) {
    const key = buildRouteKey(pulse);
    let entry = memory[key];

    if (!entry) {
      const idealOrgan = targetOrgan || defaultRoute(pulse);
      const mode = classifyDegradation(healthScore);
      entry = {
        idealOrgan,
        currentOrgan: idealOrgan,
        successCount: 0,
        failureCount: 0,
        degraded: mode !== "direct",
        healthScore: typeof healthScore === "number" ? healthScore : 1.0,
        mode
      };
    }

    if (outcome === "success") {
      entry.successCount += 1;

      // On success with good health, we can safely treat this as the ideal route
      if (typeof healthScore === "number") {
        entry.healthScore = healthScore;
        const mode = classifyDegradation(healthScore);
        entry.mode = mode;
        entry.degraded = mode !== "direct";

        if (mode === "direct") {
          entry.idealOrgan = targetOrgan;
          entry.currentOrgan = targetOrgan;
        } else if (mode === "bypass") {
          entry.currentOrgan = targetOrgan;
        } else {
          entry.currentOrgan = "OS";
        }
      } else {
        entry.idealOrgan = targetOrgan;
        entry.currentOrgan = targetOrgan;
      }

    } else if (outcome === "failure") {
      entry.failureCount += 1;

      // If failures dominate, treat this route as degraded and prefer OS as route-around
      if (entry.failureCount > entry.successCount && targetOrgan !== "OS") {
        entry.degraded = true;
        entry.mode = "routeAround";
        entry.currentOrgan = "OS";
      }
    }

    memory[key] = entry;

    log && log("[PulseRouter-v10.0] Remembering route", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      pageId: pulse.pageId || "NO_PAGE",
      routeKey: key,
      idealOrgan: entry.idealOrgan,
      currentOrgan: entry.currentOrgan,
      mode: entry.mode,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      successCount: entry.successCount,
      failureCount: entry.failureCount,
      outcome
    });

    return entry;
  }

  return {
    PulseRole,
    route,
    remember
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseRouter (v10.0)
//  Provides BOTH:
//    • createPulseRouter() factory
//    • Unified organ object (PulseRouter) for Kernel/Understanding
// ============================================================================
export const PulseRouter = {
  PulseRole,

  // Placeholder until wired by PulseUnderstanding
  route(...args) {
    throw new Error(
      "[PulseRouter-v10.0] PulseRouter.route() was called before initialization. " +
      "Use createPulseRouter(...) to wire dependencies."
    );
  },

  remember(...args) {
    throw new Error(
      "[PulseRouter-v10.0] PulseRouter.remember() was called before initialization. " +
      "Use createPulseRouter(...) to wire dependencies."
    );
  }
};
