
// ============================================================================
// FILE: /apps/PulseOS/Organs/Memory/PulseOSShortTermMemory.js
// PULSE OS — v11-Evo-Prime
// “THE SHORT‑TERM MEMORY / HIPPOCAMPAL BUFFER”
// DUAL‑BAND NEURAL MEMORY • OFFLINE‑ABSOLUTE • ZERO MUTATION AFTER INSERTION
// ============================================================================


const LAYER_ID   = "SHORT-TERM-MEMORY";
const LAYER_NAME = "THE HIPPOCAMPAL BUFFER";
const LAYER_ROLE = "B-LAYER NEURAL MEMORY";
const LAYER_VER  = "11.0-Evo-Prime";

// ============================================================================
// MEMORY CONTEXT — organism-wide identity
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
    offlineAbsolute: true,

    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,

    executionContextAware: true,
    pressureAware: true,
    dispatchAware: true
  }
};

// ============================================================================
// HELPERS — deterministic structural signature
// ============================================================================
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map(k => JSON.stringify(k) + ":" + stableStringify(value[k]));
  return "{" + parts.join(",") + "}";
}

function buildMemorySignature(entry) {
  return stableStringify({
    eventType: entry.eventType || "unknown",
    modeKind: entry.modeKind || "symbolic",
    executionContext: entry.executionContext || {},
    pressureSnapshot: entry.pressureSnapshot || {}
  });
}

// ============================================================================
// STRUCTURAL DEDUPE — drift-proof
// ============================================================================
function isStructurallySame(a, b) {
  if (!a || !b) return false;
  return a.memorySignature === b.memorySignature;
}

// ============================================================================
// SHORT‑TERM MEMORY ORGAN — v11-Evo-Prime
// ============================================================================
export const PulseOSShortTermMemory = {
  _logs: [],
  _maxLogs: 750,

  // --------------------------------------------------------------------------
  // PUSH — immutable insertion, dual-band aware
  // --------------------------------------------------------------------------
  push(entry) {
    if (!entry || typeof entry !== "object") return;

    const memorySignature = buildMemorySignature(entry);

    const wrapped = {
      ...entry,
      ...MEMORY_CONTEXT,
      memoryVersion: LAYER_VER,
      memorySignature
    };

    const last = this._logs[this._logs.length - 1];

    if (last && isStructurallySame(last, wrapped)) {
      return;
    }

    this._logs.push(wrapped);

    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
    }
  },

  // --------------------------------------------------------------------------
  // GET ALL — immutable read
  // --------------------------------------------------------------------------
  getAll() {
    return [...this._logs];
  },

  // --------------------------------------------------------------------------
  // CLEAR — after flush
  // --------------------------------------------------------------------------
  clear() {
    this._logs = [];
  },

  // --------------------------------------------------------------------------
  // HAS LOGS
  // --------------------------------------------------------------------------
  hasLogs() {
    return this._logs.length > 0;
  },

  // --------------------------------------------------------------------------
  // SNAPSHOT — offline-absolute
  // --------------------------------------------------------------------------
  snapshot() {
    return {
      version: LAYER_VER,
      count: this._logs.length,
      logs: [...this._logs]
    };
  }
};
