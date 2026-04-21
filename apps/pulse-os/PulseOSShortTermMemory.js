// ============================================================================
// FILE: /apps/PulseOS/Organs/Memory/PulseOSShortTermMemory.js
// PULSE OS — v9.2
// “THE SHORT‑TERM MEMORY / HIPPOCAMPAL BUFFER”
// B‑LAYER NEURAL MEMORY • OFFLINE‑ABSOLUTE • ZERO MUTATION AFTER INSERTION
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Memory (Short‑Term / Working Memory)
//   • Layer: B‑Layer (Router‑Adjacent Neural Buffer)
//   • Biological Analog: Hippocampal short‑term memory buffer
//   • System Role: Hold logs before Heart.js flush + Immune healing
//
// SAFETY CONTRACT (v9.2):
//   • Never mutate logs after insertion
//   • Never bypass this organ for logging
//   • Always preserve lineage + timestamps
//   • Always dedupe structurally
//   • Always remain offline‑absolute
//   • Never run timers, loops, or network calls
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "SHORT-TERM-MEMORY";
const LAYER_NAME = "THE HIPPOCAMPAL BUFFER";
const LAYER_ROLE = "B-LAYER NEURAL MEMORY";
const LAYER_VER  = "9.2";

const MEMORY_DIAGNOSTICS_ENABLED =
  window.PULSE_MEMORY_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logMemory = (stage, details = {}) => {
  if (!MEMORY_DIAGNOSTICS_ENABLED) return;

  log(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};


// ============================================================================
// HUMAN‑READABLE CONTEXT MAP
// ============================================================================
const MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Short‑Term Neural Buffer",
  context: "Stores logs before Heart.js flush",
  version: LAYER_VER,
  evo: {
    driftProof: true,
    deterministicNeuron: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    zeroNetwork: true,
    zeroMutation: true,
    zeroTiming: true,
    offlineAbsolute: true
  }
};


// ============================================================================
// INTERNAL HELPERS — STRUCTURAL DEDUPE
// ============================================================================
function isStructurallySame(a, b) {
  if (!a || !b) return false;
  if (a.eventType !== b.eventType) return false;

  const aKeys = Object.keys(a.data || {});
  const bKeys = Object.keys(b.data || {});
  if (aKeys.length !== bKeys.length) return false;

  for (const k of aKeys) {
    if (!(k in b.data)) return false;
  }

  return true;
}


// ============================================================================
// SHORT‑TERM MEMORY ORGAN — HIPPOCAMPAL BUFFER (v9.2)
// ============================================================================
export const PulseOSShortTermMemory = {
  _logs: [],
  _maxLogs: 750,

  // --------------------------------------------------------------------------
  // ⭐ PUSH A NEW LOG ENTRY (Router.js → ShortTermMemory)
  // --------------------------------------------------------------------------
  push(entry) {
    if (!entry || typeof entry !== "object") {
      logMemory("PUSH_INVALID", {});
      return;
    }

    // Immutable insertion wrapper
    entry = {
      ...entry,
      ...MEMORY_CONTEXT,
      memoryVersion: LAYER_VER
    };

    const last = this._logs[this._logs.length - 1];

    // Structural dedupe
    if (last && isStructurallySame(last, entry)) {
      logMemory("PUSH_DEDUPE_STRUCTURAL", { eventType: entry.eventType });
      return;
    }

    this._logs.push(entry);

    logMemory("PUSH_OK", {
      eventType: entry.eventType,
      total: this._logs.length
    });

    // Trim oldest logs
    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
      logMemory("PUSH_TRIM", { max: this._maxLogs });
    }
  },

  // --------------------------------------------------------------------------
  // ⭐ GET ALL LOGS (Heart.js → ShortTermMemory)
  // --------------------------------------------------------------------------
  getAll() {
    logMemory("READ", { total: this._logs.length });
    return [...this._logs];
  },

  // --------------------------------------------------------------------------
  // ⭐ CLEAR LOGS AFTER FLUSH (Heart.js → ShortTermMemory)
  // --------------------------------------------------------------------------
  clear() {
    logMemory("CLEAR", { removed: this._logs.length });
    this._logs = [];
  },

  // --------------------------------------------------------------------------
  // ⭐ CHECK IF MEMORY HAS ANY LOGS
  // --------------------------------------------------------------------------
  hasLogs() {
    const has = this._logs.length > 0;
    logMemory("HAS_LOGS", { has });
    return has;
  },

  // --------------------------------------------------------------------------
  // ⭐ SNAPSHOT (offline mode + diagnostics)
  // --------------------------------------------------------------------------
  snapshot() {
    logMemory("SNAPSHOT", { total: this._logs.length });
    return {
      version: LAYER_VER,
      count: this._logs.length,
      logs: [...this._logs]
    };
  }
};
