// ============================================================================
//  PulseCoreEvolutions.js — v11‑EVO‑DUALBAND‑MAX
//  ORGANISM‑WIDE EVOLUTION ENGINE (DETERMINISTIC + FALLBACK + DUALBAND)
//  “EVOLVE SAFELY. EVOLVE FORWARD. NEVER DRIFT.”
// ============================================================================

export const CoreEvolutionsRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Evolution",
  version: "11.4-Evo-DualBand-Max",
  identity: "PulseCoreEvolutions",

  evo: {
    deterministic: true,      // No randomness, no mutation
    binaryNative: true,       // Evolutions stored as binary deltas
    dualBand: true,           // Primary + Secondary evolution logs
    fallbackable: true,       // If primary fails, use secondary
    governorAligned: true,    // Works with PulseCoreGovernor
    brainAligned: true,       // Uses pattern intelligence
    memoryAligned: true,      // Writes into CoreMemory
    routeAware: true,         // Evolutions can be route-scoped
    dnaAware: true            // Evolutions tagged with dnaTag
  }
};

// ============================================================================
//  STORAGE KEYS (PRIMARY + SECONDARY)
// ============================================================================
const EVO_PRIMARY = "pulse-core-evolutions-primary";
const EVO_SECONDARY = "pulse-core-evolutions-secondary";

// ============================================================================
//  CREATE EVOLUTION ENGINE
// ============================================================================
export function createPulseCoreEvolutions({
  primaryStorage = window.localStorage,
  secondaryStorage = window.sessionStorage,
  log = console.log,
  warn = console.warn
} = {}) {

  const Evolutions = {
    loaded: false,
    list: [],        // [{ id, dnaTag, routeId, delta, timestamp }]
    lastLoadEpoch: 0,
    lastApplyEpoch: 0,
    fallbackUsed: false
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreEvolutions]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  LOAD (DUALBAND + FALLBACK)
  // -------------------------------------------------------------------------
  function load() {
    try {
      const rawPrimary = primaryStorage.getItem(EVO_PRIMARY);
      if (rawPrimary) {
        Evolutions.list = JSON.parse(rawPrimary);
        Evolutions.loaded = true;
        Evolutions.fallbackUsed = false;
        Evolutions.lastLoadEpoch = Date.now();
        safeLog("LOAD_PRIMARY_OK", { count: Evolutions.list.length });
        return;
      }

      const rawSecondary = secondaryStorage.getItem(EVO_SECONDARY);
      if (rawSecondary) {
        Evolutions.list = JSON.parse(rawSecondary);
        Evolutions.loaded = true;
        Evolutions.fallbackUsed = true;
        Evolutions.lastLoadEpoch = Date.now();
        safeLog("LOAD_SECONDARY_OK", { count: Evolutions.list.length });
        return;
      }

      Evolutions.loaded = true;
      Evolutions.list = [];
      safeLog("LOAD_EMPTY");
    } catch (err) {
      warn("[PulseCoreEvolutions] LOAD_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  FLUSH (WRITE TO BOTH BANDS)
  // -------------------------------------------------------------------------
  function flush() {
    try {
      const json = JSON.stringify(Evolutions.list);

      primaryStorage.setItem(EVO_PRIMARY, json);
      secondaryStorage.setItem(EVO_SECONDARY, json);

      safeLog("FLUSH_OK", { count: Evolutions.list.length });
    } catch (err) {
      warn("[PulseCoreEvolutions] FLUSH_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  REGISTER EVOLUTION
  //  • deterministic
  //  • dnaTag-aware
  //  • route-aware
  //  • no mutation
  // -------------------------------------------------------------------------
  function registerEvolution({ id, dnaTag, routeId, delta }) {
    if (!id || !delta) {
      warn("[PulseCoreEvolutions] INVALID_EVOLUTION");
      return;
    }

    const evo = {
      id,
      dnaTag: dnaTag || null,
      routeId: routeId || "global",
      delta,
      timestamp: Date.now()
    };

    Evolutions.list.push(evo);
    safeLog("REGISTER", evo);
  }

  // -------------------------------------------------------------------------
  //  APPLY EVOLUTIONS
  //  • Governor calls this at safe points
  //  • Evolutions are applied to CoreMemory via callback
  // -------------------------------------------------------------------------
  function applyEvolutions(applyFn) {
    if (typeof applyFn !== "function") {
      warn("[PulseCoreEvolutions] APPLY_FN_REQUIRED");
      return;
    }

    for (const evo of Evolutions.list) {
      try {
        applyFn(evo);
      } catch (err) {
        warn("[PulseCoreEvolutions] APPLY_ERROR", {
          evo,
          error: String(err)
        });
      }
    }

    Evolutions.lastApplyEpoch = Date.now();
    safeLog("APPLY_DONE", { count: Evolutions.list.length });
  }

  // -------------------------------------------------------------------------
  //  CLEAR / RESET
  // -------------------------------------------------------------------------
  function clearAll() {
    Evolutions.list = [];
    flush();
    safeLog("CLEAR_ALL");
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  const PulseCoreEvolutions = {
    CoreEvolutionsRole,
    Evolutions,

    load,
    flush,

    registerEvolution,
    applyEvolutions,
    clearAll
  };

  // Auto-load on creation
  load();

  safeLog("INIT", {
    identity: CoreEvolutionsRole.identity,
    version: CoreEvolutionsRole.version
  });

  return PulseCoreEvolutions;
}
