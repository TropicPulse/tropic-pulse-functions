// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryBrain.js
//  PULSE OS v11‑EVO‑PRIME — EVOLUTIONARY PAGE BRAIN (UPGRADED)
//  “THE PAGE CORTEX / COORDINATION LAYER”
//  Now powered by PulseCoreMemory → PulseEvolutionaryMemory.
// ============================================================================

export const BrainRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageBrain",
  version: "11.3-Evo-Prime",
  identity: "PulseEvolutionaryBrain",

  evo: {
    driftProof: true,
    deterministic: true,
    pageBrain: true,
    dualBandAware: true,
    memoryAware: true,
    cnsAware: true,
    routeAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — wires Code + Memory + CNS using the new Core Memory Spine
// ============================================================================
export function createPulseEvolutionaryBrain({
  Evolution,
  LongTermMemory,   // now a route-aware client of PulseCoreMemory
  CNS,
  createCode,       // factory: () => PulseEvolutionaryCode organ
  createMemory,     // factory: () => PulseEvolutionaryMemory organ
  log = console.log,
  warn = console.warn
} = {}) {

  const BrainState = {
    initialized: false,
    lastMode: null,      // "restore" | "fresh"
    lastResult: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryBrain]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  Instantiate sub‑organs (route-aware memory + code)
  // --------------------------------------------------------------------------
  const MemoryOrgan =
    typeof createMemory === "function"
      ? createMemory({ log, warn })
      : LongTermMemory || null;

  const CodeOrgan =
    typeof createCode === "function"
      ? createCode({ Evolution, LongTermMemory: MemoryOrgan, CNS, log, warn })
      : null;

  if (!MemoryOrgan) warn("[PulseEvolutionaryBrain] NO_MEMORY_ORGAN");
  if (!CodeOrgan) warn("[PulseEvolutionaryBrain] NO_CODE_ORGAN");

  // --------------------------------------------------------------------------
  //  RESTORE PATH — deterministic, binary-native, core-powered
  // --------------------------------------------------------------------------
  async function restore() {
    if (!MemoryOrgan || !CodeOrgan) {
      warn("[PulseEvolutionaryBrain] MISSING_ORGANS_RESTORE");
      return { ok: false, error: "MissingOrgans" };
    }

    const model = await MemoryOrgan.loadPage();
    if (!model) {
      safeLog("RESTORE_EMPTY", {});
      return { ok: false, error: "NoSavedPage" };
    }

    // Let CodeOrgan re-apply the model
    const res = await CodeOrgan.restore?.();
    BrainState.lastMode = "restore";
    BrainState.lastResult = res || null;

    CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
      event: "restore",
      ok: !!res?.ok
    });

    safeLog("RESTORE_DONE", { ok: !!res?.ok });
    return res || { ok: true, model };
  }

  // --------------------------------------------------------------------------
  //  FRESH EVOLVE PATH — deterministic, no randomness
  // --------------------------------------------------------------------------
  async function freshEvolve({ type = "page:init", payload, binaryPayload, context } = {}) {
    if (!CodeOrgan) {
      warn("[PulseEvolutionaryBrain] MISSING_CODE_ORGAN");
      return { ok: false, error: "MissingCodeOrgan" };
    }

    const res = await CodeOrgan.evolve({ type, payload, binaryPayload, context });
    BrainState.lastMode = "fresh";
    BrainState.lastResult = res || null;

    CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
      event: "freshEvolve",
      ok: !!res?.ok
    });

    safeLog("FRESH_EVOLVE_DONE", { ok: !!res?.ok });
    return res;
  }

  // --------------------------------------------------------------------------
  //  PUBLIC ENTRY — boot sequence
  //  1) Try restore from memory
  //  2) If none, do fresh evolve
  // --------------------------------------------------------------------------
  async function boot({ payload, binaryPayload, context } = {}) {
    safeLog("BOOT_START", {});

    const restored = await restore();
    if (restored?.ok) {
      BrainState.initialized = true;
      safeLog("BOOT_RESTORE_PATH", {});
      return restored;
    }

    const fresh = await freshEvolve({ type: "page:init", payload, binaryPayload, context });
    BrainState.initialized = true;
    safeLog("BOOT_FRESH_PATH", {});
    return fresh;
  }

  const PulseEvolutionaryBrain = {
    BrainRole,
    BrainState,
    boot,
    restore,
    freshEvolve
  };

  safeLog("INIT", {
    identity: BrainRole.identity,
    version: BrainRole.version
  });

  return PulseEvolutionaryBrain;
}
