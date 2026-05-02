// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryCode.js
//  PULSE OS v11‑EVO‑PRIME — PAGE EVOLUTION ORGAN (UPGRADED)
//  “SELF‑EVOLVING PAGE LAYER WITH CORE‑POWERED MEMORY”
//
//  UPGRADE NOTE:
//  -------------
//  • Now uses PulseEvolutionaryMemory → PulseCoreMemory (binary‑native).
//  • No direct localStorage usage.
//  • No JSON churn.
//  • Route‑aware memory buckets.
//  • Deterministic, drift‑proof, dual‑band.
// ============================================================================

export const PageRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageEvo",
  version: "11.3-Evo-Prime",
  identity: "PulseEvolutionaryCode",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    pageEvolution: true,
    lineageAware: true,
    memoryPersistence: true,
    routeAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — dependencies injected by the HTML page brain
// ============================================================================
export function createPulseEvolutionaryCode({
  Evolution,
  LongTermMemory,   // now a route-aware client of PulseCoreMemory
  CNS,
  log = console.log,
  warn = console.warn
} = {}) {

  const PageState = {
    lastRender: null,
    lastLineage: null,
    lastBinary: null,
    lastModel: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryCode]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  LOAD PREVIOUS EVOLUTION FROM MEMORY (CORE‑POWERED)
  // --------------------------------------------------------------------------
  async function loadFromMemory() {
    try {
      const saved = await LongTermMemory?.loadPage?.();
      if (saved && typeof saved === "object") {
        safeLog("MEMORY_LOAD_OK", {});
        PageState.lastModel = saved;
        applyModelToDOM(saved);
        return saved;
      }
    } catch (err) {
      warn("[PulseEvolutionaryCode] MEMORY_LOAD_ERROR", String(err));
    }
    safeLog("MEMORY_LOAD_EMPTY", {});
    return null;
  }

  // --------------------------------------------------------------------------
  //  BUILD PAGE MODEL — deterministic, no randomness
  // --------------------------------------------------------------------------
  function buildPageModel({ payload, binaryPayload }) {
    const lineage = Evolution?.getPageLineage?.() || {};

    const model = {
      lineage,
      payload: payload || {},
      binary: binaryPayload || null,
      version: PageRole.version,
      timestamp: "NO_TIMESTAMP_v11" // deterministic placeholder
    };

    PageState.lastLineage = lineage;
    PageState.lastBinary = binaryPayload || null;
    PageState.lastModel = model;

    return model;
  }

  // --------------------------------------------------------------------------
  //  APPLY PAGE MODEL TO DOM — deterministic
  // --------------------------------------------------------------------------
  function applyModelToDOM(model) {
    const wrapper = document.getElementById("evo-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    const div = document.createElement("div");
    div.className = "evo-block evo-breathe evo-shimmer";

    div.innerHTML = `
      <div class="evo-title">Pulse Evolutionary Page</div>
      <div class="evo-content"><pre>${JSON.stringify(model, null, 2)}</pre></div>
    `;

    wrapper.appendChild(div);
    PageState.lastRender = model;
  }

  // --------------------------------------------------------------------------
  //  SAVE MODEL TO MEMORY — now uses PulseCoreMemory
  // --------------------------------------------------------------------------
  async function saveToMemory(model) {
    try {
      await LongTermMemory?.savePage?.(model);
      Evolution?.recordPageLineage?.(model);
      safeLog("MEMORY_SAVE_OK", {});
    } catch (err) {
      warn("[PulseEvolutionaryCode] MEMORY_SAVE_ERROR", String(err));
    }
  }

  // --------------------------------------------------------------------------
  //  PUBLIC ENTRY — evolve the page
  // --------------------------------------------------------------------------
  async function evolve({ type, payload, binaryPayload, context } = {}) {
    safeLog("EVOLVE_START", { type });

    const model = buildPageModel({ payload, binaryPayload });
    applyModelToDOM(model);
    await saveToMemory(model);

    // Emit impulse to CNS
    CNS?.emitImpulse?.("PulseEvolutionaryCode", {
      modeKind: binaryPayload ? "dual" : "symbolic",
      executionContext: context || {}
    });

    safeLog("EVOLVE_DONE", { type });
    return { ok: true, model };
  }

  // --------------------------------------------------------------------------
  //  PUBLIC ENTRY — restore previous evolution
  // --------------------------------------------------------------------------
  async function restore() {
    const restored = await loadFromMemory();
    if (restored) {
      safeLog("RESTORE_OK", {});
      return { ok: true, model: restored };
    }
    return { ok: false, error: "NoSavedPage" };
  }

  const PulseEvolutionaryCode = {
    PageRole,
    PageState,
    evolve,
    restore
  };

  safeLog("INIT", {
    identity: PageRole.identity,
    version: PageRole.version,
    upgradeFrom: "Endpoint.js"
  });

  return PulseEvolutionaryCode;
}
