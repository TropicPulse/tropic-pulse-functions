// ============================================================================
//  EvolutionaryThought.js — v11‑Evo
//  PulseRouter v11 • Pattern Brainstem • Degradation + Route DNA Router
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
//  • Page‑inheritance‑aware: can derive imports/settings from prior pages.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a transport organ (PulseSend handles movement).
//  • Not a mesh/wiring organ (PulseMesh handles pathways).
//  • Not a compute engine.
//  • Not a network client.
//  • Not a GPU/Earn/OS organ.
//  • Not an IQ/import organ (it only routes + derives).
//
//  SAFETY CONTRACT (v11‑Evo):
//  --------------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape logic.
//  • Internal memory only (no external mutation).
//  • Degradation-aware, but always routes forward.
//  • Route DNA is internal only, never mutates external state.
//  • Page inheritance is internal only, never mutates external state.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter v11‑Evo Organ
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "11.0",
  identity: "PulseRouter-v11-Evo",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    memoryReady: true,
    deterministicImpulseFlow: true,
    unifiedAdvantageField: true,
    pulseRouter11Ready: true,
    degradationAware: true,
    routeAroundReady: true,
    routeDNAReady: true,
    modeTransitionAware: true,
    healingLadderAware: true,
    futureEvolutionReady: true,
    pageInheritanceReady: true
  },

  // Contract alignment for OS‑v11 unified organism
  pulseContract: "Pulse-v-unified",      // v1/v2/v3 shape‑compatible
  sendContract: "PulseSend-v11",
  meshContract: "PulseMesh-v11",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — tiny, deterministic, pure (v11‑Evo)
// ============================================================================

const ROUTER_VERSION = "11.0-Evo";

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
//  PAGE INHERITANCE LAYER — pattern + lineage + pageId aware
//  • Pulls imports/settings from last page + skipped pages until next page
//  • Purely internal, deterministic, no external mutation
// ============================================================================
// ⭐ Build a page key from pattern + pageId
function buildPageKey(pulse) {
  const pattern = pulse.pattern || "";
  const pageId = pulse.pageId || "NO_PAGE";
  return `${pattern}::p${pageId}`;
}
// ⭐ Internal page memory: pageKey → { imports, settings, lineageSignature, patternAncestry }
function ensurePageEntry(pageMemory, pulse, context = {}) {
  const key = buildPageKey(pulse);
  let entry = pageMemory[key];

  const patternAncestry = buildPatternAncestry(pulse.pattern);
  const lineageSignature = buildLineageSignature(pulse.lineage);

  if (!entry) {
    entry = {
      key,
      pattern: pulse.pattern || "",
      pageId: pulse.pageId || "NO_PAGE",
      patternAncestry,
      lineageSignature,
      imports: Array.isArray(context.imports) ? context.imports.slice() : [],
      settings:
        context.settings && typeof context.settings === "object"
          ? { ...context.settings }
          : {}
    };
    pageMemory[key] = entry;
  } else {
    // Update ancestry + lineage; only overwrite imports/settings if explicitly provided
    entry.patternAncestry = patternAncestry;
    entry.lineageSignature = lineageSignature;

    if (Array.isArray(context.imports)) {
      entry.imports = context.imports.slice();
    }
    if (context.settings && typeof context.settings === "object") {
      entry.settings = { ...context.settings };
    }
  }

  return entry;
}
// ⭐ Resolve inherited imports/settings from:
//    • current page (if any)
//    • previous lineage pages (in order)
//    • pattern ancestry pages (in order)
//    Deterministic merge: earlier sources first, later override/append.
function resolveInheritedPageContext(pageMemory, pulse) {
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage : [];
  const patternAncestry = buildPatternAncestry(pulse.pattern);

  const mergedImports = [];
  const mergedSettings = {};

  function mergeFromEntry(entry) {
    if (!entry) return;
    if (Array.isArray(entry.imports)) {
      for (let i = 0; i < entry.imports.length; i++) {
        const value = entry.imports[i];
        if (!mergedImports.includes(value)) {
          mergedImports.push(value);
        }
      }
    }
    if (entry.settings && typeof entry.settings === "object") {
      const keys = Object.keys(entry.settings);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        mergedSettings[k] = entry.settings[k];
      }
    }
  }

  // 1) Pattern ancestry pages (broadest → most specific)
  for (let i = 0; i < patternAncestry.length; i++) {
    const subPattern = patternAncestry.slice(0, i + 1).join("/");
    const ancestorPulse = {
      pattern: subPattern,
      pageId: "NO_PAGE",
      lineage: []
    };
    const key = buildPageKey(ancestorPulse);
    mergeFromEntry(pageMemory[key]);
  }

  // 2) Lineage pages (oldest → newest)
  for (let i = 0; i < lineage.length; i++) {
    const ancestorPageId = lineage[i];
    const ancestorPulse = {
      pattern: pulse.pattern,
      pageId: ancestorPageId,
      lineage: lineage.slice(0, i)
    };
    const key = buildPageKey(ancestorPulse);
    mergeFromEntry(pageMemory[key]);
  }

  // 3) Current page (most specific, final override)
  const currentKey = buildPageKey(pulse);
  mergeFromEntry(pageMemory[currentKey]);

  return {
    imports: mergedImports,
    settings: mergedSettings
  };
}
// ============================================================================
//  FACTORY — createPulseRouter (v11‑Evo)
//  Pulse‑agnostic (v1/v2/v3), deterministic, degradation‑aware brainstem
// ============================================================================
export function createPulseRouter({ log } = {}) {
  const memory = {};     // routeKey → route DNA entry
  const pageMemory = {}; // pageKey → page inheritance entry

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
  //  • Now page‑inheritance‑aware (imports/settings)
  // --------------------------------------------------------------------------
  function route(pulse, context = {}) {
    if (!pulse || typeof pulse !== "object") {
      throw new Error("[PulseRouter-v11-Evo] route() requires a Pulse organism");
    }

    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    // Update page memory with any explicit imports/settings from context
    ensurePageEntry(pageMemory, pulse, context);

    // Resolve inherited imports/settings from last page + skipped pages
    const inherited = resolveInheritedPageContext(pageMemory, pulse);

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
      lineageSignature: entry.lineageSignature,
      inheritedImports: inherited.imports,
      inheritedSettings: inherited.settings
    };

    if (typeof log === "function") {
      log({
        type: "PulseRouter-v11-Evo:route",
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
        type: "PulseRouter-v11-Evo:success",
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
        type: "PulseRouter-v11-Evo:failure",
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
  // --------------------------------------------------------------------------
  //  getPageInheritanceSnapshot()
  //  • Introspect page‑level inheritance memory (for debugging/verification)
  // --------------------------------------------------------------------------
  function getPageInheritanceSnapshot() {
    const out = {};
    for (const [key, entry] of Object.entries(pageMemory)) {
      out[key] = {
        pattern: entry.pattern,
        pageId: entry.pageId,
        patternAncestry: entry.patternAncestry.slice(),
        lineageSignature: entry.lineageSignature,
        imports: entry.imports.slice(),
        settings: { ...entry.settings }
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
    getMemorySnapshot,
    getPageInheritanceSnapshot
  };
}
