// ============================================================================
//  EvolutionaryThought.js — v10.4‑Evo
//  PulseRouter v10.4 • Pattern Brainstem • Degradation + Route DNA Router
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The routing brainstem for Pulse organisms.
//  • Chooses target organs based on pattern + lineage + degradation.
//  • Remembers successful routes (reflex arcs).
//  • Remembers degraded routes and bypasses (avoidance arcs).
//  • Builds and maintains "route DNA" for each pattern/lineage/page.
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
//  SAFETY CONTRACT (v10.4‑Evo):
//  ----------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape logic.
//  • Internal memory only (no external mutation).
//  • Degradation-aware, but always routes forward.
//  • Route DNA is internal only, never mutates external state.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter v10.4‑Evo Organ
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "10.4",
  identity: "PulseRouter-v10.4-Evo",

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
    routeDNAReady: true,
    modeTransitionAware: true,
    healingLadderAware: true,
    futureEvolutionReady: true
  },

  // Contract alignment for OS‑v10.4 unified organism
  pulseContract: "Pulse-v-unified",      // v1/v2/v3 shape‑compatible
  sendContract: "PulseSend-v10.4",
  meshContract: "PulseMesh-v10.4",
  gpuOrganContract: "PulseGPU-v10",
  earnCompatibility: "PulseEarn-v10"
};


// ============================================================================
//  INTERNAL HELPERS — tiny, deterministic, pure (v10.4‑Evo)
// ============================================================================

const ROUTER_VERSION = "10.4-Evo";

// ⭐ Build a routing key from pattern + lineage depth (+ optional pageId)
function buildRouteKey(pulse) {
  const pattern = pulse.pattern || "";
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pageId = pulse.pageId || "NO_PAGE";
  return `${pattern}::d${depth}::p${pageId}`;
}

// ⭐ Build a simple pattern ancestry (e.g., "gpu/insights/detail" → ["gpu","insights","detail"])
function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

// ⭐ Build a lineage signature (compressed representation of lineage array)
function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
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

// ⭐ Degradation tier classification
//    • microDegrade     → 0.95–1.0
//    • softDegrade      → 0.85–0.95
//    • midDegrade       → 0.50–0.85
//    • hardDegrade      → 0.15–0.50
//    • criticalDegrade  → 0.00–0.15
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;

  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

// ⭐ Map degradation tier to routing mode
//    • direct       → ideal route
//    • microBypass  → minor degradation, same organ
//    • softBypass   → moderate degradation, same organ
//    • midBypass    → heavier degradation, same organ
//    • hardBypass   → severe degradation, same organ
//    • routeAround  → route around this segment (fallback to OS)
function mapTierToMode(tier) {
  if (tier === "microDegrade") return "direct";
  if (tier === "softDegrade") return "microBypass";
  if (tier === "midDegrade") return "softBypass";
  if (tier === "hardDegrade") return "midBypass";
  return "routeAround"; // criticalDegrade
}

// ⭐ Centralized mode transition helper (A→B tracking)
function setRoutingMode(entry, newMode) {
  const prev = entry.mode || "direct";
  entry.lastMode = prev;
  entry.mode = newMode;
  entry.modeTransition = prev === newMode ? "stable" : `${prev}->${newMode}`;
  entry.degraded = newMode !== "direct";
}

// ⭐ Derive healthScore from pulse + optional context
function deriveHealthScore(pulse, context = {}) {
  if (typeof context.healthScore === "number") {
    return context.healthScore;
  }

  if (typeof pulse.healthScore === "number") {
    return pulse.healthScore;
  }

  // Advantage‑aware deterministic fallback
  const adv = pulse.advantageField || {};
  const lineageDepth = typeof adv.lineageDepth === "number"
    ? adv.lineageDepth
    : (Array.isArray(pulse.lineage) ? pulse.lineage.length : 1);

  const patternStrength = typeof adv.patternStrength === "number"
    ? adv.patternStrength
    : (typeof pulse.pattern === "string" ? pulse.pattern.length : 8);

  const base = 0.7 + Math.min(0.3, (lineageDepth * 0.02) + (patternStrength * 0.001));
  return Math.max(0.15, Math.min(1.0, base));
}

// ⭐ Deterministic stability update
function updateStabilityOnSuccess(entry) {
  entry.successCount += 1;
  entry.stabilityScore = Math.min(1.0, entry.stabilityScore + 0.05);
  entry.healingScore = Math.min(1.0, (entry.healingScore + entry.healthScore) / 2);

  entry.degradationHistory.push({
    event: "success",
    tier: entry.tier,
    mode: entry.mode
  });

  if (entry.degraded) {
    entry.bypassHistory.push({
      mode: entry.mode,
      tier: entry.tier
    });
  }

  if (entry.degradationHistory.length > 32) {
    entry.degradationHistory = entry.degradationHistory.slice(-32);
  }
  if (entry.bypassHistory.length > 32) {
    entry.bypassHistory = entry.bypassHistory.slice(-32);
  }
}

function updateStabilityOnFailure(entry) {
  entry.failureCount += 1;
  entry.stabilityScore = Math.max(0.0, entry.stabilityScore - 0.1);
  entry.healingScore = Math.max(0.0, entry.healingScore - 0.1);

  entry.degradationHistory.push({
    event: "failure",
    tier: entry.tier,
    mode: entry.mode
  });

  if (entry.degraded) {
    entry.bypassHistory.push({
      mode: entry.mode,
      tier: entry.tier
    });
  }

  if (entry.degradationHistory.length > 32) {
    entry.degradationHistory = entry.degradationHistory.slice(-32);
  }
  if (entry.bypassHistory.length > 32) {
    entry.bypassHistory = entry.bypassHistory.slice(-32);
  }
}


// ============================================================================
//  FACTORY — createPulseRouter (v10.4‑Evo)
//  Pulse‑agnostic (v1/v2/v3), deterministic, degradation‑aware brainstem
// ============================================================================
export function createPulseRouter({ log } = {}) {
  const memory = {}; // routeKey → route DNA entry

  function ensureEntry(pulse, healthScore) {
    const key = buildRouteKey(pulse);
    let entry = memory[key];

    const patternAncestry = buildPatternAncestry(pulse.pattern);
    const lineageSignature = buildLineageSignature(pulse.lineage);
    const h = typeof healthScore === "number" ? healthScore : 1.0;
    const tier = classifyDegradationTier(h);
    const mode = mapTierToMode(tier);

    if (!entry) {
      const idealOrgan = defaultRoute(pulse);
      let currentOrgan = idealOrgan;

      if (mode === "routeAround") {
        currentOrgan = "OS";
      }

      entry = {
        idealOrgan,
        currentOrgan,
        successCount: 0,
        failureCount: 0,
        degraded: mode !== "direct",
        healthScore: h,
        tier,
        mode,
        lastMode: mode,
        modeTransition: "init",
        patternAncestry,
        lineageSignature,
        degradationHistory: [],
        bypassHistory: [],
        stabilityScore: 0.5,
        healingScore: h
      };

      setRoutingMode(entry, mode);
      memory[key] = entry;
    } else {
      entry.patternAncestry = patternAncestry;
      entry.lineageSignature = lineageSignature;
      entry.healthScore = h;
      entry.tier = tier;
      setRoutingMode(entry, mapTierToMode(tier));

      if (entry.mode === "routeAround") {
        entry.currentOrgan = "OS";
      } else {
        entry.currentOrgan = entry.idealOrgan;
      }
    }

    return { key, entry };
  }

  // --------------------------------------------------------------------------
  //  route(pulse, context)
  //  • Main routing decision
  //  • Pure, deterministic, pulse‑agnostic
  // --------------------------------------------------------------------------
  function route(pulse, context = {}) {
    if (!pulse || typeof pulse !== "object") {
      throw new Error("[PulseRouter-v10.4-Evo] route() requires a Pulse organism");
    }

    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    const targetOrgan = entry.currentOrgan || entry.idealOrgan || "OS";

    const result = {
      routerIdentity: PulseRole.identity,
      routerVersion: ROUTER_VERSION,
      routeKey: key,
      targetOrgan,
      mode: entry.mode,
      tier: entry.tier,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore,
      patternAncestry: entry.patternAncestry,
      lineageSignature: entry.lineageSignature
    };

    if (typeof log === "function") {
      log({
        type: "PulseRouter-v10.4-Evo:route",
        pulsePattern: pulse.pattern,
        routeKey: key,
        targetOrgan,
        mode: entry.mode,
        tier: entry.tier,
        healthScore: entry.healthScore
      });
    }

    return result;
  }

  // --------------------------------------------------------------------------
  //  recordSuccess(pulse, context)
  //  • Reflex arc reinforcement
  // --------------------------------------------------------------------------
  function recordSuccess(pulse, context = {}) {
    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    updateStabilityOnSuccess(entry);

    if (typeof log === "function") {
      log({
        type: "PulseRouter-v10.4-Evo:success",
        routeKey: key,
        mode: entry.mode,
        tier: entry.tier,
        stabilityScore: entry.stabilityScore,
        healingScore: entry.healingScore
      });
    }

    return {
      routeKey: key,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore
    };
  }

  // --------------------------------------------------------------------------
  //  recordFailure(pulse, context)
  //  • Avoidance arc reinforcement
  // --------------------------------------------------------------------------
  function recordFailure(pulse, context = {}) {
    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    updateStabilityOnFailure(entry);

    if (typeof log === "function") {
      log({
        type: "PulseRouter-v10.4-Evo:failure",
        routeKey: key,
        mode: entry.mode,
        tier: entry.tier,
        stabilityScore: entry.stabilityScore,
        healingScore: entry.healingScore
      });
    }

    return {
      routeKey: key,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore
    };
  }

  // --------------------------------------------------------------------------
  //  getRouteDNA(pulse)
  //  • Introspect route DNA for a given pulse
  // --------------------------------------------------------------------------
  function getRouteDNA(pulse) {
    if (!pulse || typeof pulse !== "object") return null;
    const key = buildRouteKey(pulse);
    const entry = memory[key] || null;

    if (!entry) return null;

    return {
      routeKey: key,
      idealOrgan: entry.idealOrgan,
      currentOrgan: entry.currentOrgan,
      successCount: entry.successCount,
      failureCount: entry.failureCount,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      tier: entry.tier,
      mode: entry.mode,
      lastMode: entry.lastMode,
      modeTransition: entry.modeTransition,
      patternAncestry: entry.patternAncestry.slice(),
      lineageSignature: entry.lineageSignature,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore,
      degradationHistory: entry.degradationHistory.slice(),
      bypassHistory: entry.bypassHistory.slice()
    };
  }

  // --------------------------------------------------------------------------
  //  getMemorySnapshot()
//  • Returns a shallow snapshot of all route DNA entries
  // --------------------------------------------------------------------------
  function getMemorySnapshot() {
    const out = {};
    for (const [key, entry] of Object.entries(memory)) {
      out[key] = {
        idealOrgan: entry.idealOrgan,
        currentOrgan: entry.currentOrgan,
        successCount: entry.successCount,
        failureCount: entry.failureCount,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        mode: entry.mode,
        lastMode: entry.lastMode,
        modeTransition: entry.modeTransition,
        stabilityScore: entry.stabilityScore,
        healingScore: entry.healingScore
      };
    }
    return out;
  }

  return {
    PulseRole,
    version: ROUTER_VERSION,
    route,
    recordSuccess,
    recordFailure,
    getRouteDNA,
    getMemorySnapshot
  };
}
