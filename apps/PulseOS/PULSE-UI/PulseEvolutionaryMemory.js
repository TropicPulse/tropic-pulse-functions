// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryMemory.js
//  PULSE OS v11‑EVO‑PRIME — UI LONG‑TERM MEMORY ORGAN (UPGRADED)
//  “ROUTE‑AWARE CLIENT OF PulseCoreMemory”
//  Deterministic • Drift‑Proof • Binary‑Native • No Host Churn
//
//  UPGRADE NOTE:
//  -------------
//  • This organ NO LONGER touches localStorage directly.
//  • It delegates all persistence to PulseCoreMemory (the memory spine).
//  • Page memory is now route‑scoped, binary‑native, bulk‑loaded, bulk‑flushed.
//  • This is the OFFICIAL v11‑Evo UI Long‑Term Memory organ.
// ============================================================================

import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

export const MemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageMemory",
  version: "11.3-Evo-Prime",
  identity: "PulseEvolutionaryMemory",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    memoryPersistence: true,
    lineageAware: true,
    routeAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — creates the UI memory organ
// ============================================================================
export function createPulseEvolutionaryMemory({
  routeId = "page",   // UI pages get their own bucket
  log = console.log,
  warn = console.warn
} = {}) {

  const Core = createPulseCoreMemory({ log, warn });

  const MemoryState = {
    lastSaved: null,
    lastLoaded: null,
    routeId
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryMemory]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  SAVE PAGE MODEL — now uses PulseCoreMemory
  // --------------------------------------------------------------------------
  async function savePage(model) {
    if (!model || typeof model !== "object") {
      warn("[PulseEvolutionaryMemory] INVALID_MODEL");
      return { ok: false, error: "InvalidModel" };
    }

    try {
      Core.setRouteSnapshot(routeId, model);
      MemoryState.lastSaved = model;

      // NOTE: We do NOT flush here — bulk flush happens once/day or manually.
      safeLog("SAVE_OK", { routeId });
      return { ok: true };
    } catch (err) {
      warn("[PulseEvolutionaryMemory] SAVE_ERROR", String(err));
      return { ok: false, error: "SaveError" };
    }
  }

  // --------------------------------------------------------------------------
  //  LOAD PAGE MODEL — now uses PulseCoreMemory
  // --------------------------------------------------------------------------
  async function loadPage() {
    try {
      const snapshot = Core.getRouteSnapshot(routeId);

      if (!snapshot || Object.keys(snapshot).length === 0) {
        safeLog("LOAD_EMPTY", { routeId });
        return null;
      }

      MemoryState.lastLoaded = snapshot;
      safeLog("LOAD_OK", { routeId });
      return snapshot;
    } catch (err) {
      warn("[PulseEvolutionaryMemory] LOAD_ERROR", String(err));
      return null;
    }
  }

  // --------------------------------------------------------------------------
  //  OPTIONAL: FORCE FLUSH (rare)
  // --------------------------------------------------------------------------
  function flush() {
    Core.bulkFlush();
  }

  const PulseEvolutionaryMemory = {
    MemoryRole,
    MemoryState,
    savePage,
    loadPage,
    flush,
    core: Core
  };

  safeLog("INIT", {
    identity: MemoryRole.identity,
    version: MemoryRole.version,
    routeId
  });

  return PulseEvolutionaryMemory;
}
