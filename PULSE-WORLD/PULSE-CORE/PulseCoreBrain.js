// ============================================================================
//  PulseCoreBrain.js — v11‑EVO‑PATTERN‑MAX
//  ORGANISM‑WIDE PATTERN INTELLIGENCE ENGINE
//  “THINK ONCE. REUSE FOREVER.”
//  • Detects structure (formulas, shapes, trees, queries, routes)
//  • Canonicalizes patterns
//  • Stores simplest form
//  • Returns patternId + parameters
// ============================================================================

export const CoreBrainRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Brain",
  version: "11.4-Evo-Pattern-Max",
  identity: "PulseCoreBrain",

  evo: {
    deterministic: true,      // Same input → same patternId
    binaryNative: true,       // Patterns can be stored as binary
    routeAware: true,         // Patterns can be route-scoped
    dnaAware: true,           // Patterns can be dnaTag-scoped
    governorAligned: true,    // Works with PulseCoreGovernor
    memoryAligned: true       // Uses CoreMemory for persistence
  }
};

// ============================================================================
//  SIMPLE HASH / ID HELPERS (STRUCTURAL, NOT CRYPTO)
//  You can swap this for a stronger / GPU-backed hash later.
// ============================================================================
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return "patt-" + (h >>> 0).toString(16);
}

// Normalize a JS object / structure into a stable string
function normalizeStructure(struct) {
  try {
    return JSON.stringify(struct, Object.keys(struct).sort());
  } catch {
    return JSON.stringify(struct || {});
  }
}

// ============================================================================
//  CREATE BRAIN
//  • In-memory pattern cache
//  • Optional CoreMemory integration via injected callbacks
// ============================================================================
export function createPulseCoreBrain({
  log = console.log,
  warn = console.warn,

  // Optional: CoreMemory integration
  coreMemory = null,          // e.g., PulseCoreGovernor.CoreMemory
  coreMemoryRouteId = "brain-patterns"
} = {}) {
  const Patterns = {
    // patternId -> { canonical, meta }
    byId: Object.create(null),

    // normalizedKey -> patternId
    index: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreBrain]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: PERSIST / LOAD (OPTIONAL)
  //  • If coreMemory is provided, we persist patterns there
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
  //  CORE IDEA:
  //    • You give the Brain a structure (formula, AST, UI tree, query, etc.)
  //    • It:
  //        1) normalizes it
  //        2) hashes it
  //        3) returns patternId + canonical form
  //    • If seen before, it reuses the same patternId
  // -------------------------------------------------------------------------
  function registerPattern(struct, meta = {}) {
    const normalized = normalizeStructure(struct || {});
    const existingId = Patterns.index[normalized];

    if (existingId) {
      return {
        patternId: existingId,
        canonical: Patterns.byId[existingId].canonical,
        reused: true
      };
    }

    const patternId = simpleHash(normalized);

    Patterns.index[normalized] = patternId;
    Patterns.byId[patternId] = {
      canonical: struct,
      meta: {
        ...meta,
        createdAt: Date.now()
      }
    };

    safeLog("REGISTER_PATTERN", {
      patternId,
      meta
    });

    return {
      patternId,
      canonical: struct,
      reused: false
    };
  }

  // -------------------------------------------------------------------------
  //  LOOKUP
  // -------------------------------------------------------------------------
  function getPattern(patternId) {
    return Patterns.byId[patternId] || null;
  }

  // -------------------------------------------------------------------------
  //  HIGHER-LEVEL: FORMULA EXAMPLE (LIKE YOUR x+1 IDEA)
  //  • This is a placeholder hook — you can extend it later.
//  • For now, we just treat formula as a string pattern.
// -------------------------------------------------------------------------
  function registerFormula(formulaStr, meta = {}) {
    return registerPattern({ type: "formula", value: formulaStr }, meta);
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
    Patterns,

    loadFromCoreMemory,
    flushToCoreMemory,

    registerPattern,
    getPattern,

    registerFormula,
    clearAll
  };

  // Optional initial load
  loadFromCoreMemory();

  safeLog("INIT", {
    identity: CoreBrainRole.identity,
    version: CoreBrainRole.version
  });

  return PulseCoreBrain;
}
