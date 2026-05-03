/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryMemory.js
LAYER: UI LONG‑TERM MEMORY ORGAN
===============================================================================
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryMemory",
  version: "v15-IMMORTAL",
  layer: "pulse_ui",
  role: "ui_long_term_memory",
  lineage: "PulseEvolutionaryMemory-v11.3-Evo-Prime → v14-IMMORTAL → v15-IMMORTAL",

  evo: {
    memoryOrgan: true,
    longTermMemory: true,
    routeAware: true,
    lineageAware: true,
    binaryAware: true,
    symbolicAware: true,
    dualBand: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    // v15 upgrades
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    bulkFlushAware: true
  },

  contract: {
    always: [
      "PulseCore.Memory",
      "PulseUI.EvolutionaryCode",
      "PulseUI.EvolutionaryBrain",
      "PulseUI.EvolutionaryBinary"
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
  organ: "PulseUI.EvolutionaryMemory",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "PageModel",
    "RouteId",
    "PulseCoreMemory"
  ],

  produces: [
    "SavedSnapshot",
    "LoadedSnapshot",
    "BulkFlushResult"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}

*/
import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

export const MemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageMemory",
  version: "15.0-IMMORTAL",
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

const MEMORY_SCHEMA_VERSION = "v2";

// ============================================================================
// FACTORY — creates the UI memory organ (CoreMemory‑powered)
// ============================================================================
export function createPulseEvolutionaryMemory({
  routeId = "page",
  log = console.log,
  warn = console.warn
} = {}) {

  // CoreMemory v15 IMMORTAL
  const Core = PulseProofBridge.coreMemory;

  const MemoryState = {
    lastSaved: null,
    lastLoaded: null,
    lastError: null,
    routeId,
    eventSeq: 0
  };

  function nextSeq() {
    MemoryState.eventSeq += 1;
    return MemoryState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryMemory]",
        stage,
        JSON.stringify({
          schemaVersion: MEMORY_SCHEMA_VERSION,
          seq: MemoryState.eventSeq,
          routeId,
          ...details
        })
      );
    } catch {}
  }

  // --------------------------------------------------------------------------
  // SAVE PAGE MODEL — deterministic, route‑scoped, binary‑aware
  // --------------------------------------------------------------------------
  async function savePage(model) {
    nextSeq();

    if (!model || typeof model !== "object") {
      const errorInfo = "InvalidModel";
      MemoryState.lastError = errorInfo;
      warn("[PulseEvolutionaryMemory] INVALID_MODEL");
      safeLog("SAVE_INVALID_MODEL", { error: errorInfo });
      return { ok: false, error: errorInfo };
    }

    try {
      const envelope = {
        schemaVersion: MEMORY_SCHEMA_VERSION,
        version: MemoryRole.version,
        routeId,
        model,
        timestamp: "NO_TIMESTAMP_v15"
      };

      Core.setRouteSnapshot(routeId, envelope);

      MemoryState.lastSaved = envelope;
      safeLog("SAVE_OK", {});
      return { ok: true, envelope };
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory] SAVE_ERROR", msg);
      safeLog("SAVE_ERROR", { error: msg });
      return { ok: false, error: "SaveError" };
    }
  }

  // --------------------------------------------------------------------------
  // LOAD PAGE MODEL — deterministic, route‑scoped, integrity‑aware
  // --------------------------------------------------------------------------
  async function loadPage() {
    nextSeq();

    try {
      const envelope = Core.getRouteSnapshot(routeId);

      if (!envelope || typeof envelope !== "object") {
        safeLog("LOAD_EMPTY", {});
        return null;
      }

      MemoryState.lastLoaded = envelope;
      safeLog("LOAD_OK", {});
      return envelope.model || null;
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory] LOAD_ERROR", msg);
      safeLog("LOAD_ERROR", { error: msg });
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // OPTIONAL: FORCE FLUSH — CoreMemory bulk flush
  // --------------------------------------------------------------------------
  function flush() {
    nextSeq();
    try {
      Core.bulkFlush();
      safeLog("FLUSH_OK", {});
      return { ok: true };
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory] FLUSH_ERROR", msg);
      safeLog("FLUSH_ERROR", { error: msg });
      return { ok: false, error: "FlushError" };
    }
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
    version: MemoryRole.version
  });

  return PulseEvolutionaryMemory;
}
