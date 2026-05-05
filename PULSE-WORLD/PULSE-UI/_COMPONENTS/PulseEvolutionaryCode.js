/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryCode-v16-Immortal.js
LAYER: UI PAGE EVOLUTION ORGAN
===============================================================================

ROLE (v16):
  THE PAGE EVOLUTION ORGAN — deterministic self‑evolving page layer.
  • Builds page models from symbolic + binary payloads.
  • Computes lightweight advantageView for diagnostics + brain/route awareness.
  • Applies deterministic DOM updates (guarded, minimal, introspectable).
  • Persists models via PulseCoreMemory (route‑aware).
  • Emits CNS impulses for evolution + restore events.

PURPOSE (v16):
  • Provide a stable, deterministic, drift‑proof page evolution engine.
  • Guarantee lineage‑aware, route‑aware, memory‑aware evolution.
  • Surface a unified advantage field for higher‑level organs (Brain/Binary).
  • Serve as the execution layer beneath the Page Brain.

CONTRACT:
  • PURE LOGIC except DOM writes.
  • No randomness, no network, no filesystem.
  • Deterministic output only.

SAFETY:
  • v16 upgrade is PURE + STRUCTURAL — logic is richer but still safe.
  • All behavior is deterministic and organism‑safe.
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryCode",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "page_evolution_organ",
  lineage: "PulseEvolutionaryCode-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    pageEvolution: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,
    memoryPersistence: true,
    routeAware: true,
    lineageAware: true,
    cnsAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    schemaVersioned: true,
    errorAware: true,
    domGuarded: true,
    advantageView: true
  },

  contract: {
    always: [
      "PulseUI.Evolution",
      "PulseUI.EvolutionaryMemory",
      "PulseCore.Memory",
      "PulseCore.CNS",
      "PulseUI.EvolutionaryBrain"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS",
      "safeRoute"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.EvolutionaryCode",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "Evolution",
    "LongTermMemory",
    "CNS"
  ],

  produces: [
    "PageModel",
    "RenderedDOM",
    "MemorySaveResult",
    "RestoreResult",
    "AdvantageView"
  ],

  sideEffects: "dom_manipulation_only",
  network: "none",
  filesystem: "none"
}
*/

// Global handle
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

export const PageRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageEvo",
  version: "16.0-Immortal",
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
    futureEvolutionReady: true,
    domGuarded: true,
    advantageView: true
  }
};

const PAGE_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// ADVANTAGE VIEW (LIGHTWEIGHT, DETERMINISTIC)
// ---------------------------------------------------------------------------
function computeAdvantageView({ payload, binaryPayload, lineage }) {
  const payloadSize = payload ? JSON.stringify(payload).length : 0;
  const binarySize = binaryPayload ? (binaryPayload.length || 0) : 0;

  const totalSize = payloadSize + binarySize;
  const sizeTier =
    totalSize > 64 * 1024 ? "huge" :
    totalSize > 32 * 1024 ? "large" :
    totalSize > 8 * 1024  ? "medium" :
    totalSize > 0         ? "small" :
                            "empty";

  const density = totalSize > 0 ? binarySize / totalSize : 0;
  const entropyHint = density > 0 ? clamp01(1 - Math.abs(0.5 - density) * 2) : 0.5;

  const lineageHash = hashString(JSON.stringify(lineage || {}));

  return {
    sizeTier,
    payloadSize,
    binarySize,
    totalSize,
    density,
    entropyHint,
    lineageHash
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// ---------------------------------------------------------------------------
// FACTORY
// ---------------------------------------------------------------------------
export function createPulseEvolutionaryCode({
  Evolution,
  LongTermMemory,   // route-aware PulseCoreMemory client
  CNS,
  log = console.log,
  warn = console.warn
} = {}) {

  const PageState = {
    lastRender: null,
    lastLineage: null,
    lastBinary: null,
    lastModel: null,
    lastError: null,
    lastAdvantage: null,
    lastModeKind: null, // "symbolic" | "dual"
    eventSeq: 0
  };

  function nextSeq() {
    PageState.eventSeq += 1;
    return PageState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryCode-v16]",
        stage,
        JSON.stringify({
          schemaVersion: PAGE_SCHEMA_VERSION,
          seq: PageState.eventSeq,
          ...details
        })
      );
    } catch {}
  }

  // -------------------------------------------------------------------------
  // MEMORY LOAD
  // -------------------------------------------------------------------------
  async function loadFromMemory() {
    nextSeq();
    try {
      const saved = await LongTermMemory?.loadPage?.();
      if (saved && typeof saved === "object") {
        safeLog("MEMORY_LOAD_OK", {});
        PageState.lastModel = saved;
        PageState.lastLineage = saved.lineage || null;
        PageState.lastBinary = saved.binary || null;
        PageState.lastAdvantage = saved.advantage || null;
        applyModelToDOM(saved);
        return saved;
      }
    } catch (err) {
      const msg = String(err);
      PageState.lastError = msg;
      warn("[PulseEvolutionaryCode-v16] MEMORY_LOAD_ERROR", msg);
      safeLog("MEMORY_LOAD_ERROR", { error: msg });
    }
    safeLog("MEMORY_LOAD_EMPTY", {});
    return null;
  }

  // -------------------------------------------------------------------------
  // MODEL BUILD
  // -------------------------------------------------------------------------
  function buildPageModel({ payload, binaryPayload }) {
    const lineage = Evolution?.getPageLineage?.() || {};
    const advantage = computeAdvantageView({ payload, binaryPayload, lineage });

    const model = {
      schemaVersion: PAGE_SCHEMA_VERSION,
      lineage,
      payload: payload || {},
      binary: binaryPayload || null,
      advantage,
      version: PageRole.version,
      timestamp: "NO_TIMESTAMP_v16" // deterministic placeholder
    };

    PageState.lastLineage = lineage;
    PageState.lastBinary = binaryPayload || null;
    PageState.lastModel = model;
    PageState.lastAdvantage = advantage;

    return model;
  }

  // -------------------------------------------------------------------------
  // DOM APPLY (GUARDED, MINIMAL)
// -------------------------------------------------------------------------
  function applyModelToDOM(model) {
    if (typeof document === "undefined") {
      safeLog("DOM_SKIP_NO_DOCUMENT", {});
      return;
    }

    const wrapper = document.getElementById("evo-wrapper");
    if (!wrapper) {
      safeLog("DOM_SKIP_NO_WRAPPER", {});
      return;
    }

    try {
      wrapper.innerHTML = "";

      const div = document.createElement("div");
      div.className = "evo-block evo-breathe evo-shimmer";

      const modeKind = model.binary ? "dual" : "symbolic";

      div.innerHTML = `
        <div class="evo-title">Pulse Evolutionary Page (v16)</div>
        <div class="evo-meta">
          <span class="evo-chip">mode: ${modeKind}</span>
          <span class="evo-chip">sizeTier: ${model.advantage?.sizeTier || "unknown"}</span>
          <span class="evo-chip">entropy: ${(model.advantage?.entropyHint ?? 0.5).toFixed(2)}</span>
        </div>
        <div class="evo-content">
          <pre>${escapeHtml(JSON.stringify(model, null, 2))}</pre>
        </div>
      `;

      wrapper.appendChild(div);
      PageState.lastRender = model;
      PageState.lastModeKind = modeKind;
      safeLog("DOM_APPLY_OK", { modeKind, sizeTier: model.advantage?.sizeTier });
    } catch (err) {
      const msg = String(err);
      PageState.lastError = msg;
      warn("[PulseEvolutionaryCode-v16] DOM_APPLY_ERROR", msg);
      safeLog("DOM_APPLY_ERROR", { error: msg });
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // -------------------------------------------------------------------------
  // MEMORY SAVE
  // -------------------------------------------------------------------------
  async function saveToMemory(model) {
    nextSeq();
    try {
      await LongTermMemory?.savePage?.(model);
      Evolution?.recordPageLineage?.(model);
      safeLog("MEMORY_SAVE_OK", {});
      return { ok: true };
    } catch (err) {
      const msg = String(err);
      PageState.lastError = msg;
      warn("[PulseEvolutionaryCode-v16] MEMORY_SAVE_ERROR", msg);
      safeLog("MEMORY_SAVE_ERROR", { error: msg });
      return { ok: false, error: "MemorySaveError" };
    }
  }

  // -------------------------------------------------------------------------
  // EVOLVE
  // -------------------------------------------------------------------------
  async function evolve({ type, payload, binaryPayload, context } = {}) {
    nextSeq();
    const modeKind = binaryPayload ? "dual" : "symbolic";
    safeLog("EVOLVE_START", { type, modeKind });

    try {
      const model = buildPageModel({ payload, binaryPayload });
      applyModelToDOM(model);
      const saveRes = await saveToMemory(model);

      CNS?.emitImpulse?.("PulseEvolutionaryCode", {
        event: "evolve",
        type,
        modeKind,
        executionContext: context || {},
        advantage: model.advantage
      });

      const ok = !!saveRes.ok;
      safeLog("EVOLVE_DONE", {
        type,
        ok,
        modeKind,
        sizeTier: model.advantage?.sizeTier
      });

      return {
        ok,
        model,
        advantage: model.advantage
      };
    } catch (err) {
      const msg = String(err);
      PageState.lastError = msg;
      warn("[PulseEvolutionaryCode-v16] EVOLVE_ERROR", msg);
      safeLog("EVOLVE_ERROR", { error: msg });
      return { ok: false, error: "EvolveError" };
    }
  }

  // -------------------------------------------------------------------------
  // RESTORE
  // -------------------------------------------------------------------------
  async function restore() {
    nextSeq();
    const restored = await loadFromMemory();
    if (restored) {
      CNS?.emitImpulse?.("PulseEvolutionaryCode", {
        event: "restore",
        modeKind: restored.binary ? "dual" : "symbolic",
        advantage: restored.advantage || null
      });

      safeLog("RESTORE_OK", {
        modeKind: restored.binary ? "dual" : "symbolic",
        sizeTier: restored.advantage?.sizeTier
      });

      return {
        ok: true,
        model: restored,
        advantage: restored.advantage || null
      };
    }
    safeLog("RESTORE_EMPTY", {});
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
    version: PageRole.version
  });

  return PulseEvolutionaryCode;
}

// ---------------------------------------------------------------------------
// GLOBAL REGISTRATION (WINDOW-SAFE, IMMORTAL)
// ---------------------------------------------------------------------------
try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryCode = createPulseEvolutionaryCode;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryCode = createPulseEvolutionaryCode;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryCode = createPulseEvolutionaryCode;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryCode = createPulseEvolutionaryCode;
  }
} catch {}
