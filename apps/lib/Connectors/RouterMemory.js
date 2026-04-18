// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/RouterMemory.js
// PULSE NETWORK MEMORY — v6.3
// “THE NETWORK / B‑LAYER LOGGING + HEALING BUFFER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE NETWORK / LOGGING + HEALING BUFFER”
// - ROLE: Short‑term neural memory for router.js + Timer.js
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (DOM‑visible inspector compatible)
// - Added explicit STAGE markers for push/read/clear
// - ZERO logic changes to dedupe or memory behavior
//
// ============================================================================
// PERSONALITY + ROLE — “THE NETWORK”
// ----------------------------------------------------------------------------
// RouterMemory is the **NETWORK** of the Pulse OS.
// It is the **B‑LAYER LOGGING + HEALING BUFFER** — the short‑term,
// pre‑flush memory that holds events before Timer.js commits them.
//
//   • Stores logs from router.js before Timer.js flushes them
//   • Dedupes repeated logs
//   • Preserves lineage + timestamps
//   • Provides safe access for router.js + Timer.js
//   • NEVER writes to long‑term storage directly
//
// This is the OS’s **neural mesh** — the working memory between perception
// (router.js) and long‑term record (Timer.js).
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A short‑term memory buffer
//   ✔ A dedupe + lineage preservation layer
//   ✔ A safe intermediary between router.js and Timer.js
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a database writer
//   ✘ NOT a router
//   ✘ NOT a business logic layer
//   ✘ NOT a security layer
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Never write to Firebase or any external system
//   • Never mutate logs after flush
//   • Always dedupe identical consecutive events
//   • Always preserve lineage + context
//
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "NETWORK-LAYER";
const LAYER_NAME = "THE NETWORK";
const LAYER_ROLE = "B-LAYER MEMORY BUFFER";

const NETWORK_DIAGNOSTICS_ENABLED =
  process.env.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logNetwork = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};

// ============================================================================
// HUMAN‑READABLE CONTEXT MAP
// ============================================================================
const MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Log Buffer + Healing Support",
  context: "Stores logs before Timer.js flush"
};

// ============================================================================
// THE NETWORK — B‑LAYER MEMORY BUFFER
// ============================================================================
export const RouterMemory = {
  _logs: [],
  _maxLogs: 500,

  // ------------------------------------------------------------
  // ⭐ PUSH A NEW LOG ENTRY (router.js → RouterMemory)
  // ------------------------------------------------------------
  push(entry) {
    if (!entry || typeof entry !== "object") {
      logNetwork("PUSH_INVALID", {});
      return;
    }

    // Attach memory context
    entry = { ...entry, ...MEMORY_CONTEXT };

    // Dedupe identical consecutive logs
    const last = this._logs[this._logs.length - 1];
    if (
      last &&
      last.eventType === entry.eventType &&
      JSON.stringify(last.data) === JSON.stringify(entry.data)
    ) {
      logNetwork("PUSH_DEDUPE", { eventType: entry.eventType });
      return;
    }

    this._logs.push(entry);

    logNetwork("PUSH_OK", {
      eventType: entry.eventType,
      total: this._logs.length
    });

    // Enforce max size
    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
      logNetwork("PUSH_TRIM", { max: this._maxLogs });
    }
  },

  // ------------------------------------------------------------
  // ⭐ GET ALL LOGS (Timer.js → RouterMemory)
  // ------------------------------------------------------------
  getAll() {
    logNetwork("READ", { total: this._logs.length });
    return [...this._logs];
  },

  // ------------------------------------------------------------
  // ⭐ CLEAR LOGS AFTER FLUSH (Timer.js → RouterMemory)
  // ------------------------------------------------------------
  clear() {
    logNetwork("CLEAR", { removed: this._logs.length });
    this._logs = [];
  },

  // ------------------------------------------------------------
  // ⭐ CHECK IF MEMORY HAS ANY LOGS
  // ------------------------------------------------------------
  hasLogs() {
    const has = this._logs.length > 0;
    logNetwork("HAS_LOGS", { has });
    return has;
  }
};
