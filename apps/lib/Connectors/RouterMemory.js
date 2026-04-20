// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/RouterMemory.js
// PULSE NETWORK MEMORY — v7.1
// “THE NETWORK+ / LIVING NEURAL BUFFER”
// ============================================================================
//
// ROLE (v7.1):
//   • Short‑term neural memory for router.js (B‑Layer)
//   • Dual‑mode: works identically in offline + online environments
//   • Lineage‑preserving, context‑aware, evolution‑safe
//   • Stores logs before backend healing or Heart.js flush
//   • Dedupe with structural awareness (not just JSON equality)
//   • Never writes to long‑term storage directly
//   • Never depends on internet or external stimuli
//
// CONTRACT (v7.1):
//   • Never mutate logs after insertion
//   • Never bypass RouterMemory for logging
//   • Always preserve lineage + timestamps
//   • Always dedupe identical consecutive events (structural)
//   • Always remain offline‑absolute
//   • Always AND: internal + external compatible
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "NETWORK-LAYER";
const LAYER_NAME = "THE NETWORK+";
const LAYER_ROLE = "B-LAYER MEMORY BUFFER";
const LAYER_VER  = "7.1";

const NETWORK_DIAGNOSTICS_ENABLED =
  window.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logNetwork = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

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
  purpose: "Log Buffer + Healing Support",
  context: "Stores logs before Heart.js flush"
};


// ============================================================================
// INTERNAL HELPERS — v7.1
// ============================================================================

// Structural dedupe: compares eventType + shallow data keys
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
// THE NETWORK+ — LIVING B‑LAYER MEMORY BUFFER
// ============================================================================
export const RouterMemory = {
  _logs: [],
  _maxLogs: 750, // v7.1: slightly larger buffer for dual-mode environments

  // --------------------------------------------------------------------------
  // ⭐ PUSH A NEW LOG ENTRY (router.js → RouterMemory)
  // --------------------------------------------------------------------------
  push(entry) {
    if (!entry || typeof entry !== "object") {
      logNetwork("PUSH_INVALID", {});
      return;
    }

    // Attach memory context + version
    entry = {
      ...entry,
      ...MEMORY_CONTEXT,
      memoryVersion: LAYER_VER
    };

    const last = this._logs[this._logs.length - 1];

    // v7.1: structural dedupe (not JSON stringify)
    if (last && isStructurallySame(last, entry)) {
      logNetwork("PUSH_DEDUPE_STRUCTURAL", { eventType: entry.eventType });
      return;
    }

    this._logs.push(entry);

    logNetwork("PUSH_OK", {
      eventType: entry.eventType,
      total: this._logs.length
    });

    // v7.1: enforce max size with lineage preservation
    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
      logNetwork("PUSH_TRIM", { max: this._maxLogs });
    }
  },

  // --------------------------------------------------------------------------
  // ⭐ GET ALL LOGS (Heart.js → RouterMemory)
  // --------------------------------------------------------------------------
  getAll() {
    logNetwork("READ", { total: this._logs.length });
    return [...this._logs];
  },

  // --------------------------------------------------------------------------
  // ⭐ CLEAR LOGS AFTER FLUSH (Heart.js → RouterMemory)
  // --------------------------------------------------------------------------
  clear() {
    logNetwork("CLEAR", { removed: this._logs.length });
    this._logs = [];
  },

  // --------------------------------------------------------------------------
  // ⭐ CHECK IF MEMORY HAS ANY LOGS
  // --------------------------------------------------------------------------
  hasLogs() {
    const has = this._logs.length > 0;
    logNetwork("HAS_LOGS", { has });
    return has;
  },

  // --------------------------------------------------------------------------
  // ⭐ SNAPSHOT (for offline mode + diagnostics)
  // --------------------------------------------------------------------------
  snapshot() {
    logNetwork("SNAPSHOT", { total: this._logs.length });
    return {
      version: LAYER_VER,
      count: this._logs.length,
      logs: [...this._logs]
    };
  }
};
