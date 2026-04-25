// ============================================================================
//  FILE: /ui/PulseEvolutionaryMemory.js
//  PULSE OS v11‑EVO‑PRIME — UI LONG‑TERM MEMORY ORGAN
//  “THE EVOLUTIONARY PAGE MEMORY LAYER”
//  Deterministic • Drift‑Proof • Dual‑Band • No Randomness
//
//  UPGRADE NOTE:
//  -------------
//  • This file REPLACES all legacy UI memory layers (PageMemory.js, UIMemory.js).
//  • This is the OFFICIAL v11‑Evo UI Long‑Term Memory organ.
//  • If wiped, the organism loses page reconstruction ability.
//  • Works directly with PulseEvolutionaryCode.js.
// ============================================================================

export const MemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageMemory",
  version: "11.2-Evo-Prime",
  identity: "PulseEvolutionaryMemory",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    memoryPersistence: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  STORAGE KEY — deterministic, no randomness
// ============================================================================
const STORAGE_KEY = "PulseEvolutionaryPage_v11";

// ============================================================================
//  SAFE JSON HELPERS — deterministic, no randomness
// ============================================================================
function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
}

// ============================================================================
//  FACTORY — creates the memory organ
// ============================================================================
export function createPulseEvolutionaryMemory({
  log = console.log,
  warn = console.warn
} = {}) {

  const MemoryState = {
    lastSaved: null,
    lastLoaded: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryMemory]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  SAVE PAGE MODEL — deterministic
  // --------------------------------------------------------------------------
  async function savePage(model) {
    if (!model || typeof model !== "object") {
      warn("[PulseEvolutionaryMemory] INVALID_MODEL");
      return { ok: false, error: "InvalidModel" };
    }

    const json = safeStringify(model);
    if (!json) {
      warn("[PulseEvolutionaryMemory] STRINGIFY_ERROR");
      return { ok: false, error: "StringifyError" };
    }

    try {
      localStorage.setItem(STORAGE_KEY, json);
      MemoryState.lastSaved = model;
      safeLog("SAVE_OK", {});
      return { ok: true };
    } catch (err) {
      warn("[PulseEvolutionaryMemory] SAVE_ERROR", String(err));
      return { ok: false, error: "SaveError" };
    }
  }

  // --------------------------------------------------------------------------
  //  LOAD PAGE MODEL — deterministic
  // --------------------------------------------------------------------------
  async function loadPage() {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        safeLog("LOAD_EMPTY", {});
        return null;
      }

      const model = safeParse(json);
      if (!model) {
        warn("[PulseEvolutionaryMemory] PARSE_ERROR");
        return null;
      }

      MemoryState.lastLoaded = model;
      safeLog("LOAD_OK", {});
      return model;
    } catch (err) {
      warn("[PulseEvolutionaryMemory] LOAD_ERROR", String(err));
      return null;
    }
  }

  const PulseEvolutionaryMemory = {
    MemoryRole,
    MemoryState,
    savePage,
    loadPage
  };

  safeLog("INIT", {
    identity: MemoryRole.identity,
    version: MemoryRole.version,
    upgradeFrom: "LegacyPageMemory.js"
  });

  return PulseEvolutionaryMemory;
}
