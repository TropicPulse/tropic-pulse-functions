// ============================================================================
//  EvolutionaryThought-v11-Evo-DualStack
//  PulseRouter v11 • Pattern + Binary Brainstem • Degradation + Route DNA Router
// ============================================================================
//
//  ROLE:
//    • The routing brainstem for Pulse organisms.
//    • Symbolic + Binary dual-stack ancestry.
//    • Chooses target organs based on pattern, lineage, page, binary hints.
//    • Maintains reflex arcs + avoidance arcs.
//    • Maintains route DNA (symbolic + binary).
//    • Deterministic, drift-proof, degradation-aware.
//    • Page inheritance + binary inheritance.
//    • Pure memory organ — NO external mutation.
//
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter v11‑Evo DualStack Organ
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "11.0",
  identity: "PulseRouter-v11-Evo-DualStack",

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
    pageInheritanceReady: true,

    // ⭐ NEW: binary-aware routing brainstem
    binaryAware: true
  },

  pulseContract: "Pulse-v-unified",
  sendContract: "PulseSend-v11",
  meshContract: "PulseMesh-v11",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
// INTERNAL HELPERS — deterministic, pure
// ============================================================================

const ROUTER_VERSION = "11.0-Evo-DualStack";

function extractBinarySurface(payload = {}) {
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

function buildRouteKey(pulse) {
  const pattern = pulse.pattern || "";
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pageId = pulse.pageId || "NO_PAGE";

  const binary = extractBinarySurface(pulse.payload || {});

  return `${pattern}::d${depth}::p${pageId}::b${binary.binaryPattern || "NONE"}`;
}

function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function inferOrganHint(pattern, binary) {
  if (binary.hasBinary && binary.binaryHints?.organHint) {
    return binary.binaryHints.organHint;
  }

  const p = (pattern || "").toLowerCase();
  if (p.includes("gpu")) return "GPU";
  if (p.includes("earn")) return "Earn";
  if (p.includes("os")) return "OS";
  if (p.includes("mesh")) return "Mesh";
  return "OS";
}

function defaultRoute(pulse) {
  const binary = extractBinarySurface(pulse.payload || {});
  return inferOrganHint(pulse.pattern, binary);
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function mapTierToMode(tier) {
  if (tier === "microDegrade") return "direct";
  if (tier === "softDegrade") return "microBypass";
  if (tier === "midDegrade") return "softBypass";
  if (tier === "hardDegrade") return "midBypass";
  return "routeAround";
}

function setRoutingMode(entry, newMode) {
  const prev = entry.mode || "direct";
  entry.lastMode = prev;
  entry.mode = newMode;
  entry.modeTransition = prev === newMode ? "stable" : `${prev}->${newMode}`;
  entry.degraded = newMode !== "direct";
}

function deriveHealthScore(pulse, context = {}) {
  if (typeof context.healthScore === "number") return context.healthScore;
  if (typeof pulse.healthScore === "number") return pulse.healthScore;

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


// ============================================================================
// PAGE INHERITANCE (symbolic + binary)
// ============================================================================
function buildPageKey(pulse) {
  const pattern = pulse.pattern || "";
  const pageId = pulse.pageId || "NO_PAGE";
  const binary = extractBinarySurface(pulse.payload || {});
  return `${pattern}::p${pageId}::b${binary.binaryPattern || "NONE"}`;
}

function ensurePageEntry(pageMemory, pulse, context = {}) {
  const key = buildPageKey(pulse);
  let entry = pageMemory[key];

  const patternAncestry = buildPatternAncestry(pulse.pattern);
  const lineageSignature = buildLineageSignature(pulse.lineage);
  const binary = extractBinarySurface(pulse.payload || {});

  if (!entry) {
    entry = {
      key,
      pattern: pulse.pattern || "",
      pageId: pulse.pageId || "NO_PAGE",
      patternAncestry,
      lineageSignature,
      binary,
      imports: Array.isArray(context.imports) ? context.imports.slice() : [],
      settings:
        context.settings && typeof context.settings === "object"
          ? { ...context.settings }
          : {}
    };
    pageMemory[key] = entry;
  } else {
    entry.patternAncestry = patternAncestry;
    entry.lineageSignature = lineageSignature;
    entry.binary = binary;

    if (Array.isArray(context.imports)) entry.imports = context.imports.slice();
    if (context.settings && typeof context.settings === "object") {
      entry.settings = { ...context.settings };
    }
  }

  return entry;
}

function resolveInheritedPageContext(pageMemory, pulse) {
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage : [];
  const patternAncestry = buildPatternAncestry(pulse.pattern);

  const mergedImports = [];
  const mergedSettings = {};

  function merge(entry) {
    if (!entry) return;

    if (Array.isArray(entry.imports)) {
      for (const v of entry.imports) {
        if (!mergedImports.includes(v)) mergedImports.push(v);
      }
    }

    if (entry.settings && typeof entry.settings === "object") {
      for (const k of Object.keys(entry.settings)) {
        mergedSettings[k] = entry.settings[k];
      }
    }
  }

  // Pattern ancestry pages
  for (let i = 0; i < patternAncestry.length; i++) {
    const subPattern = patternAncestry.slice(0, i + 1).join("/");
    const key = `${subPattern}::pNO_PAGE::bNONE`;
    merge(pageMemory[key]);
  }

  // Lineage pages
  for (let i = 0; i < lineage.length; i++) {
    const ancestorPageId = lineage[i];
    const key = `${pulse.pattern}::p${ancestorPageId}::bNONE`;
    merge(pageMemory[key]);
  }

  // Current page
  merge(pageMemory[buildPageKey(pulse)]);

  return { imports: mergedImports, settings: mergedSettings };
}


// ============================================================================
// FACTORY — createPulseRouter (DualStack)
// ============================================================================
export function createPulseRouter({ log } = {}) {
  const memory = {};     // routeKey → route DNA entry
  const pageMemory = {}; // pageKey → page inheritance entry

  function ensureEntry(pulse, healthScore) {
    const key = buildRouteKey(pulse);
    let entry = memory[key];

    const patternAncestry = buildPatternAncestry(pulse.pattern);
    const lineageSignature = buildLineageSignature(pulse.lineage);
    const binary = extractBinarySurface(pulse.payload || {});

    const h = typeof healthScore === "number" ? healthScore : 1.0;
    const tier = classifyDegradationTier(h);
    const mode = mapTierToMode(tier);

    if (!entry) {
      const idealOrgan = defaultRoute(pulse);
      let currentOrgan = idealOrgan;

      if (mode === "routeAround") currentOrgan = "OS";

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
        binary,
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
      entry.binary = binary;
      entry.healthScore = h;
      entry.tier = tier;
      setRoutingMode(entry, mapTierToMode(tier));

      entry.currentOrgan = entry.mode === "routeAround"
        ? "OS"
        : entry.idealOrgan;
    }

    return { key, entry };
  }


  // --------------------------------------------------------------------------
  //  route(pulse, context)
  // --------------------------------------------------------------------------
  function route(pulse, context = {}) {
    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    ensurePageEntry(pageMemory, pulse, context);
    const inherited = resolveInheritedPageContext(pageMemory, pulse);

    const targetOrgan = entry.currentOrgan || entry.idealOrgan || "OS";

    return {
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
      binary: entry.binary,

      inheritedImports: inherited.imports,
      inheritedSettings: inherited.settings
    };
  }


  // --------------------------------------------------------------------------
  //  recordSuccess / recordFailure
  // --------------------------------------------------------------------------
  function recordSuccess(pulse, context = {}) {
    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    entry.successCount += 1;
    entry.stabilityScore = Math.min(1.0, entry.stabilityScore + 0.05);
    entry.healingScore = Math.min(1.0, (entry.healingScore + entry.healthScore) / 2);

    entry.degradationHistory.push({ event: "success", tier: entry.tier, mode: entry.mode });
    if (entry.degraded) entry.bypassHistory.push({ mode: entry.mode, tier: entry.tier });

    return {
      routeKey: key,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore
    };
  }

  function recordFailure(pulse, context = {}) {
    const healthScore = deriveHealthScore(pulse, context);
    const { key, entry } = ensureEntry(pulse, healthScore);

    entry.failureCount += 1;
    entry.stabilityScore = Math.max(0.0, entry.stabilityScore - 0.1);
    entry.healingScore = Math.max(0.0, entry.healingScore - 0.1);

    entry.degradationHistory.push({ event: "failure", tier: entry.tier, mode: entry.mode });
    if (entry.degraded) entry.bypassHistory.push({ mode: entry.mode, tier: entry.tier });

    return {
      routeKey: key,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore
    };
  }


  // --------------------------------------------------------------------------
  //  getRouteDNA
  // --------------------------------------------------------------------------
  function getRouteDNA(pulse) {
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
      binary: entry.binary,
      stabilityScore: entry.stabilityScore,
      healingScore: entry.healingScore,
      degradationHistory: entry.degradationHistory.slice(),
      bypassHistory: entry.bypassHistory.slice()
    };
  }


  // --------------------------------------------------------------------------
  //  Snapshots
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
        healingScore: entry.healingScore,
        binary: entry.binary
      };
    }
    return out;
  }

  function getPageInheritanceSnapshot() {
    const out = {};
    for (const [key, entry] of Object.entries(pageMemory)) {
      out[key] = {
        pattern: entry.pattern,
        pageId: entry.pageId,
        patternAncestry: entry.patternAncestry.slice(),
        lineageSignature: entry.lineageSignature,
        binary: entry.binary,
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
