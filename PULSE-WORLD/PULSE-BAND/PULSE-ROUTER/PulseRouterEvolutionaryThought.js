// ============================================================================
//  EvolutionaryThought-v12.3-Evo-DualStack
//  PulseRouter v12.3 • Pattern + Binary + Presence + CacheChunk Brainstem
//  Degradation + Route DNA Router • Multi-Presence + Prewarm/Cache-Aware
// ============================================================================
//
//  ROLE:
//    • The routing brainstem for Pulse organisms.
//    • Symbolic + Binary + Presence + CacheChunk dual-stack ancestry.
//    • Chooses target organs based on pattern, lineage, page, binary hints,
//      presence hints, cacheChunk/prewarm hints, advantageField.
//    • Maintains reflex arcs + avoidance arcs.
//    • Maintains route DNA (symbolic + binary + presence + cacheChunk).
//    • Deterministic, drift-proof, degradation-aware.
//    • Page inheritance + binary/presence/cache inheritance.
//    • Pure memory organ — NO external mutation.
//
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterEvolutionaryThought",
  version: "v14.4-EVO-THOUGHT",
  layer: "frontend",
  role: "router_reasoning_engine",
  lineage: "PulseOS-v12",

  evo: {
    thoughtCore: true,
    deterministic: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    noMutation: true,
    noDrift: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterEvolutionaryDesign",
      "PulseRouterEvolutionaryInstincts"
    ],
    never: [
      "legacyRouterThought",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter v12.3-Evo DualStack Organ
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "Brainstem",
  version: "12.3",
  identity: "PulseRouter-v12.3-Evo-DualStack",

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
    binaryAware: true,

    // ⭐ NEW: presence-aware routing brainstem
    presenceAware: true,
    multiPresenceAware: true,

    // ⭐ NEW: cacheChunk/prewarm-aware routing brainstem
    cacheChunkAware: true,
    prewarmAware: true
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

const ROUTER_VERSION = "12.3-Evo-DualStack";

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

// ---------------------------------------------------------------------------
// Presence / Multi-Presence surface
// ---------------------------------------------------------------------------
function extractPresenceSurface(payload = {}) {
  const presenceId       = payload.presenceId || null;
  const presenceMode     = payload.presenceMode || null;
  const presenceHints    = payload.presenceHints || null;
  const multiPresence    = Array.isArray(payload.multiPresence)
    ? payload.multiPresence.slice()
    : (payload.multiPresence || null);
  const presenceStrength = typeof payload.presenceStrength === "number"
    ? payload.presenceStrength
    : null;

  const hasPresence =
    !!presenceId ||
    !!presenceMode ||
    !!presenceHints ||
    (multiPresence && (
      (Array.isArray(multiPresence) && multiPresence.length > 0) ||
      (!Array.isArray(multiPresence))
    )) ||
    presenceStrength !== null;

  return {
    hasPresence,
    presenceId,
    presenceMode,
    presenceHints,
    multiPresence,
    presenceStrength
  };
}

// ---------------------------------------------------------------------------
// CacheChunk / Prewarm surface
// ---------------------------------------------------------------------------
function extractCacheChunkSurface(payload = {}) {
  const cacheChunkId   = payload.cacheChunkId || null;
  const cacheMode      = payload.cacheMode || null;
  const cacheTier      = payload.cacheTier || null;
  const prewarmHints   = payload.prewarmHints || null;
  const cacheStrength  = typeof payload.cacheStrength === "number"
    ? payload.cacheStrength
    : null;

  const hasCacheChunk =
    !!cacheChunkId ||
    !!cacheMode ||
    !!cacheTier ||
    !!prewarmHints ||
    cacheStrength !== null;

  return {
    hasCacheChunk,
    cacheChunkId,
    cacheMode,
    cacheTier,
    prewarmHints,
    cacheStrength
  };
}

// ---------------------------------------------------------------------------
// AdvantageField surface (symbolic + numeric)
// ---------------------------------------------------------------------------
function extractAdvantageSurface(pulse = {}) {
  const adv = pulse.advantageField || {};

  const healthScoreHint   = typeof adv.healthScore === "number" ? adv.healthScore : null;
  const lineageDepth      = typeof adv.lineageDepth === "number" ? adv.lineageDepth : null;
  const patternStrength   = typeof adv.patternStrength === "number" ? adv.patternStrength : null;
  const cacheAffinity     = typeof adv.cacheAffinity === "number" ? adv.cacheAffinity : null;
  const gpuAffinity       = typeof adv.gpuAffinity === "number" ? adv.gpuAffinity : null;
  const presenceAffinity  = typeof adv.presenceAffinity === "number" ? adv.presenceAffinity : null;

  const hasAdvantage =
    healthScoreHint !== null ||
    lineageDepth !== null ||
    patternStrength !== null ||
    cacheAffinity !== null ||
    gpuAffinity !== null ||
    presenceAffinity !== null;

  return {
    hasAdvantage,
    healthScoreHint,
    lineageDepth,
    patternStrength,
    cacheAffinity,
    gpuAffinity,
    presenceAffinity
  };
}

function buildRouteKey(pulse) {
  const pattern = pulse.pattern || "";
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pageId = pulse.pageId || "NO_PAGE";

  const binary    = extractBinarySurface(pulse.payload || {});
  const presence  = extractPresenceSurface(pulse.payload || {});
  const cacheSurf = extractCacheChunkSurface(pulse.payload || {});

  const binaryKey    = binary.binaryPattern || "NONE";
  const presenceKey  = presence.presenceId || "NONE";
  const cacheKey     = cacheSurf.cacheChunkId || "NONE";

  return `${pattern}::d${depth}::p${pageId}::b${binaryKey}::pr${presenceKey}::cc${cacheKey}`;
}

function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function inferOrganHint(pattern, binary, presence, cacheSurf) {
  // 1) Binary organHint wins
  if (binary.hasBinary && binary.binaryHints?.organHint) {
    return binary.binaryHints.organHint;
  }

  // 2) Presence hints
  if (presence.hasPresence && presence.presenceHints?.organHint) {
    return presence.presenceHints.organHint;
  }

  // 3) CacheChunk hints (e.g., GPU-heavy cache, OS prewarm, etc.)
  if (cacheSurf.hasCacheChunk && cacheSurf.prewarmHints?.organHint) {
    return cacheSurf.prewarmHints.organHint;
  }

  // 4) Pattern-based inference
  const p = (pattern || "").toLowerCase();
  if (p.includes("gpu")) return "GPU";
  if (p.includes("earn")) return "Earn";
  if (p.includes("os")) return "OS";
  if (p.includes("mesh")) return "Mesh";
  return "OS";
}

function defaultRoute(pulse) {
  const binary    = extractBinarySurface(pulse.payload || {});
  const presence  = extractPresenceSurface(pulse.payload || {});
  const cacheSurf = extractCacheChunkSurface(pulse.payload || {});
  return inferOrganHint(pulse.pattern, binary, presence, cacheSurf);
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
  const advSurface = extractAdvantageSurface(pulse);

  if (typeof context.healthScore === "number") return context.healthScore;
  if (typeof pulse.healthScore === "number") return pulse.healthScore;
  if (advSurface.healthScoreHint !== null) return advSurface.healthScoreHint;

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
// PAGE INHERITANCE (symbolic + binary + presence + cacheChunk)
// ============================================================================
function buildPageKey(pulse) {
  const pattern = pulse.pattern || "";
  const pageId = pulse.pageId || "NO_PAGE";
  const binary    = extractBinarySurface(pulse.payload || {});
  const presence  = extractPresenceSurface(pulse.payload || {});
  const cacheSurf = extractCacheChunkSurface(pulse.payload || {});

  const binaryKey    = binary.binaryPattern || "NONE";
  const presenceKey  = presence.presenceId || "NONE";
  const cacheKey     = cacheSurf.cacheChunkId || "NONE";

  return `${pattern}::p${pageId}::b${binaryKey}::pr${presenceKey}::cc${cacheKey}`;
}

function ensurePageEntry(pageMemory, pulse, context = {}) {
  const key = buildPageKey(pulse);
  let entry = pageMemory[key];

  const patternAncestry = buildPatternAncestry(pulse.pattern);
  const lineageSignature = buildLineageSignature(pulse.lineage);
  const binary    = extractBinarySurface(pulse.payload || {});
  const presence  = extractPresenceSurface(pulse.payload || {});
  const cacheSurf = extractCacheChunkSurface(pulse.payload || {});
  const advantage = extractAdvantageSurface(pulse);

  if (!entry) {
    entry = {
      key,
      pattern: pulse.pattern || "",
      pageId: pulse.pageId || "NO_PAGE",
      patternAncestry,
      lineageSignature,

      // dual-stack surfaces
      binary,
      presence,
      cacheChunk: cacheSurf,
      advantage,

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
    entry.presence = presence;
    entry.cacheChunk = cacheSurf;
    entry.advantage = advantage;

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

  // Pattern ancestry pages (symbolic-only key for inheritance baseline)
  for (let i = 0; i < patternAncestry.length; i++) {
    const subPattern = patternAncestry.slice(0, i + 1).join("/");
    const key = `${subPattern}::pNO_PAGE::bNONE::prNONE::ccNONE`;
    merge(pageMemory[key]);
  }

  // Lineage pages (symbolic-only key for inheritance baseline)
  for (let i = 0; i < lineage.length; i++) {
    const ancestorPageId = lineage[i];
    const key = `${pulse.pattern}::p${ancestorPageId}::bNONE::prNONE::ccNONE`;
    merge(pageMemory[key]);
  }

  // Current page (full dual-stack key)
  merge(pageMemory[buildPageKey(pulse)]);

  return { imports: mergedImports, settings: mergedSettings };
}


// ============================================================================
// FACTORY — createPulseRouter (DualStack v12.3)
// ============================================================================
export function createPulseRouter({ log } = {}) {
  const memory = {};     // routeKey → route DNA entry
  const pageMemory = {}; // pageKey → page inheritance entry

  function ensureEntry(pulse, healthScore) {
    const key = buildRouteKey(pulse);
    let entry = memory[key];

    const patternAncestry = buildPatternAncestry(pulse.pattern);
    const lineageSignature = buildLineageSignature(pulse.lineage);

    const binary    = extractBinarySurface(pulse.payload || {});
    const presence  = extractPresenceSurface(pulse.payload || {});
    const cacheSurf = extractCacheChunkSurface(pulse.payload || {});
    const advantage = extractAdvantageSurface(pulse);

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

        // dual-stack surfaces
        binary,
        presence,
        cacheChunk: cacheSurf,
        advantage,

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
      entry.presence = presence;
      entry.cacheChunk = cacheSurf;
      entry.advantage = advantage;

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

      // dual-stack ancestry surfaces
      binary: entry.binary,
      presence: entry.presence,
      cacheChunk: entry.cacheChunk,
      advantage: entry.advantage,

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

      // dual-stack ancestry
      binary: entry.binary,
      presence: entry.presence,
      cacheChunk: entry.cacheChunk,
      advantage: entry.advantage,

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

        // dual-stack ancestry
        binary: entry.binary,
        presence: entry.presence,
        cacheChunk: entry.cacheChunk,
        advantage: entry.advantage
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

        // dual-stack ancestry
        binary: entry.binary,
        presence: entry.presence,
        cacheChunk: entry.cacheChunk,
        advantage: entry.advantage,

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
