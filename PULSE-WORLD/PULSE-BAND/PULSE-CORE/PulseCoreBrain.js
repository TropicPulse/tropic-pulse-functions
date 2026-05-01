// ============================================================================
//  PulseCoreBrain.js — v12‑EVO‑PRESENCE‑MAX
//  ORGANISM‑WIDE PATTERN INTELLIGENCE ENGINE
//  “THINK ONCE. REUSE FOREVER. NEVER DRIFT.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version aware
//  • presence aware
//  • lineage + ancestry
//  • advantage scoring
//  • dual‑band metadata alignment
//  • CoreMemory persistence
//  • deterministic canonicalization
// ============================================================================

export const CoreBrainRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Brain",
  identity: "PulseCoreBrain",
  version: "12.0-Evo-Presence",

  evo: {
    deterministic: true,
    binaryNative: true,
    routeAware: true,
    dnaAware: true,
    governorAligned: true,
    memoryAligned: true,
    presenceAware: true,
    versionAware: true,
    lineageAware: true,
    advantageAware: true
  }
};

// ---------------------------------------------------------------------------
//  v12 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreBrainMetaBlock = {
  identity: "PulseCoreBrain",
  subsystem: "Core",
  layer: "Brain",
  role: "Pattern-Intelligence",
  version: "12.0-Evo-Presence",
  evo: CoreBrainRole.evo
};

// ---------------------------------------------------------------------------
//  SIMPLE HASH / ID HELPERS (STRUCTURAL, NOT CRYPTO)
// ---------------------------------------------------------------------------
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return "patt-" + (h >>> 0).toString(16);
}

function normalizeStructure(struct) {
  try {
    return JSON.stringify(struct, Object.keys(struct).sort());
  } catch {
    return JSON.stringify(struct || {});
  }
}

// ---------------------------------------------------------------------------
//  CREATE BRAIN (v12)
// ---------------------------------------------------------------------------
export function createPulseCoreBrain({
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  overlay = null,
  coreMemory = null,
  coreMemoryRouteId = "brain-patterns",
  log = console.log,
  warn = console.warn
} = {}) {

  const Patterns = {
    byId: Object.create(null),
    index: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreBrain]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v12)
  // -------------------------------------------------------------------------
  function scorePattern(meta) {
    let score = 0;
    if (meta.dnaTag === dnaTag) score += 2;
    if (meta.routeId && meta.routeId !== "global") score += 1;
    if (meta.type) score += 1;
    return score;
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: LINEAGE + ANCESTRY (v12)
  // -------------------------------------------------------------------------
  function assignLineage(meta) {
    meta.lineage = `${dnaTag}:${version}:${meta.patternId}`;
    meta.ancestry = [dnaTag, version];
  }

  // -------------------------------------------------------------------------
  //  LOAD FROM CORE MEMORY (v12)
// -------------------------------------------------------------------------
  function loadFromCoreMemory() {
    if (!coreMemory) return;
    try {
      const snapshot = coreMemory.getRouteSnapshot(coreMemoryRouteId) || {};
      Patterns.byId = snapshot.byId || Object.create(null);
      Patterns.index = snapshot.index || Object.create(null);

      safeLog("LOAD_FROM_CORE_MEMORY", {
        patterns: Object.keys(Patterns.byId).length
      });
    } catch (err) {
      warn("[PulseCoreBrain] LOAD_FROM_CORE_MEMORY_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  FLUSH TO CORE MEMORY (v12)
// -------------------------------------------------------------------------
  function flushToCoreMemory() {
    if (!coreMemory) return;
    try {
      const snapshot = {
        byId: Patterns.byId,
        index: Patterns.index
      };
      coreMemory.setRouteSnapshot(coreMemoryRouteId, snapshot);

      safeLog("FLUSH_TO_CORE_MEMORY", {
        patterns: Object.keys(Patterns.byId).length
      });
    } catch (err) {
      warn("[PulseCoreBrain] FLUSH_TO_CORE_MEMORY_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  REGISTER PATTERN (v12)
// -------------------------------------------------------------------------
  function registerPattern(struct, meta = {}) {
    const normalized = normalizeStructure(struct || {});
    const existingId = Patterns.index[normalized];

    if (existingId) {
      const existing = Patterns.byId[existingId];
      return {
        patternId: existingId,
        canonical: existing.canonical,
        reused: true,
        meta: existing.meta
      };
    }

    const patternId = simpleHash(normalized);

    const enrichedMeta = {
      ...meta,
      dnaTag,
      version,
      patternId,
      createdAt: Date.now()
    };

    assignLineage(enrichedMeta);
    enrichedMeta.score = scorePattern(enrichedMeta);

    Patterns.index[normalized] = patternId;
    Patterns.byId[patternId] = {
      canonical: struct,
      meta: enrichedMeta
    };

    // Presence‑touch propagation
    if (overlay && overlay.touch) {
      try { overlay.touch("brain", enrichedMeta.createdAt); }
      catch {}
    }

    safeLog("REGISTER_PATTERN", {
      patternId,
      score: enrichedMeta.score
    });

    return {
      patternId,
      canonical: struct,
      reused: false,
      meta: enrichedMeta
    };
  }

  // -------------------------------------------------------------------------
  //  LOOKUP
// -------------------------------------------------------------------------
  function getPattern(patternId) {
    return Patterns.byId[patternId] || null;
  }

  // -------------------------------------------------------------------------
  //  FORMULA REGISTRATION (v12)
// -------------------------------------------------------------------------
  function registerFormula(formulaStr, meta = {}) {
    return registerPattern(
      { type: "formula", value: formulaStr },
      meta
    );
  }

  // -------------------------------------------------------------------------
  //  CLEAR / RESET
// -------------------------------------------------------------------------
  function clearAll() {
    Patterns.byId = Object.create(null);
    Patterns.index = Object.create(null);
    flushToCoreMemory();
    safeLog("CLEAR_ALL");
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
// -------------------------------------------------------------------------
  const PulseCoreBrain = {
    CoreBrainRole,
    CoreBrainMetaBlock,
    Patterns,

    loadFromCoreMemory,
    flushToCoreMemory,

    registerPattern,
    getPattern,
    registerFormula,

    clearAll,

    dnaTag,
    version
  };

  loadFromCoreMemory();

  safeLog("INIT", {
    identity: CoreBrainRole.identity,
    version: CoreBrainRole.version
  });

  return PulseCoreBrain;
}
