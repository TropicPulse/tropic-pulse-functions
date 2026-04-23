// ============================================================================
// FILE: /apps/pulse-proxy/CheckRouterMemory.js
// PULSE NETWORK MEMORY HEALER — v11
// “THE NETWORK HEALER++ / B‑LAYER LOG INTAKE + REPAIR ENGINE”
// ============================================================================
//
// ROLE (v11):
//   • Backend intake + validator for RouterMemory flushes
//   • Normalizes ALL log fields (routeTrace, lineage, evo, importConflict)
//   • Detects structural drift + malformed entries
//   • Preserves lineage + timestamps (never invents time)
//   • Returns authoritative, organism‑safe log batch
//   • Mode‑aware: can be routed/observed per‑mode (A→B→A compatible)
//
// CONTRACT (v11):
//   • Never mutate original input
//   • Fail‑open: invalid payload → empty safe array
//   • Always return structurally complete log entries
//   • Lymbic escalation must NEVER throw
//   • Deterministic, loggable, replayable
//   • No single point of failure: healer must not crash the proxy
//   • No synthetic timestamps (no Date.now defaults)
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "NETWORK-LAYER";
const LAYER_NAME = "THE NETWORK HEALER++";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + REPAIR";
const LAYER_VER  = "11.0";

const NETWORK_DIAGNOSTICS_ENABLED =
  process.env.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

function safeLog(...args) {
  try { console.log(...args); } catch {}
}
function safeError(...args) {
  try { console.error(...args); } catch {}
}

const logNetworkHealer = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

  safeLog(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName:  LAYER_NAME,
      pulseRole:  LAYER_ROLE,
      pulseVer:   LAYER_VER,
      stage,
      ...details
    })
  );
};


// ============================================================================
// HUMAN‑READABLE CONTEXT MAP (MIRROR OF FRONTEND MEMORY CONTEXT)
// ============================================================================
const BASE_MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Log Buffer + Healing Support",
  context: "RouterMemory → CheckRouterMemory",
  healerVersion: LAYER_VER
};


// ============================================================================
// MODE RESOLUTION — A/B/A‑safe routing metadata
// ============================================================================
function resolveMode(event) {
  try {
    const headers = (event && event.headers) || {};
    const qs = (event && event.queryStringParameters) || {};

    const headerMode =
      headers["x-pulse-mode"] ||
      headers["X-Pulse-Mode"] ||
      headers["x-pulse-router-mode"];

    const queryMode = qs.mode || qs.routerMode;

    return (headerMode || queryMode || "router-memory").toString();
  } catch {
    return "router-memory";
  }
}

function buildMemoryContext(mode) {
  return {
    ...BASE_MEMORY_CONTEXT,
    mode
  };
}


// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE LOG BATCH (v11)
// ============================================================================
function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logNetworkHealer("BODY_PARSE_ERROR", { message: err?.message });
    return null;
  }
}

// Normalize a single log entry to v11 shape
function normalizeLogEntry(entry, mode, memoryContext) {
  if (!entry || typeof entry !== "object") return null;

  const safeStr = (v, d = "UNKNOWN") =>
    typeof v === "string" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  const safeNum = (v, d = 0) =>
    typeof v === "number" ? v : d;

  const safeArr = (v, d = []) =>
    Array.isArray(v) ? v : d;

  return {
    // Core event
    eventType: safeStr(entry.eventType),
    data: safeObj(entry.data),

    // Route trace
    routeTrace: safeArr(entry.routeTrace),

    // Import conflict lineage / evo
    evo: safeObj(entry.evo),

    // Page + frames
    page: safeStr(entry.page),
    frames: safeArr(entry.frames),

    // Timestamp (never synthesized; 0 if missing)
    timestamp: safeNum(entry.timestamp, 0),

    // Versioning + lineage
    memoryVersion: entry.memoryVersion || LAYER_VER,

    // Mode + context injection
    memoryMode: mode,
    ...memoryContext
  };
}

// Heal entire batch
function healLogBatch(raw, mode, memoryContext) {
  if (!Array.isArray(raw)) {
    logNetworkHealer("BATCH_INVALID_TYPE", { receivedType: typeof raw });
    return [];
  }

  const healed = [];
  let dropped = 0;

  for (const entry of raw) {
    const normalized = normalizeLogEntry(entry, mode, memoryContext);
    if (!normalized) {
      dropped++;
      continue;
    }
    healed.push(normalized);
  }

  logNetworkHealer("BATCH_HEALED", {
    inputCount: raw.length,
    outputCount: healed.length,
    dropped,
    mode
  });

  return healed;
}


// ============================================================================
// LYMBIC ESCALATION HOOK — SAFE, OPTIONAL (v11)
// ============================================================================
async function notifyLymbicOnFatal(err, mode) {
  try {
    await fetch("/pulse-router/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err?.message || String(err),
        type: "CheckRouterMemoryFatal",
        source: "CheckRouterMemory",
        mode,
        extra: {
          layer: LAYER_ID,
          role: LAYER_ROLE,
          version: LAYER_VER
        }
      })
    });
  } catch (e) {
    logNetworkHealer("LYMBIC_NOTIFY_FAILED", { message: String(e), mode });
  }
}


// ============================================================================
// BACKEND ENTRY POINT — “THE NETWORK HEALER++” (v11)
// A→B→A‑safe: mode‑aware, fail‑open, never throws outward.
// ============================================================================
export const handler = async (event, context) => {
  const mode = resolveMode(event);
  const memoryContext = buildMemoryContext(mode);

  logNetworkHealer("INTAKE_START", {
    method: event?.httpMethod || "UNKNOWN",
    hasBody: !!event?.body,
    mode
  });

  try {
    if (event.httpMethod !== "POST") {
      logNetworkHealer("INVALID_METHOD", { method: event.httpMethod, mode });
      return {
        statusCode: 405,
        body: JSON.stringify({ logs: [] })
      };
    }

    const parsed = safeParseBody(event.body);

    if (!parsed || typeof parsed !== "object") {
      logNetworkHealer("PAYLOAD_INVALID", { mode });
      return {
        statusCode: 400,
        body: JSON.stringify({ logs: [] })
      };
    }

    const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
    logNetworkHealer("PAYLOAD_RECEIVED", { rawCount: rawLogs.length, mode });

    const healedLogs = healLogBatch(rawLogs, mode, memoryContext);

    logNetworkHealer("RETURN_BATCH", {
      finalCount: healedLogs.length,
      mode
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: healedLogs })
    };

  } catch (err) {
    safeError("CheckRouterMemory error:", err);

    logNetworkHealer("FATAL_ERROR", {
      message: err?.message,
      mode
    });

    await notifyLymbicOnFatal(err, mode);

    return {
      statusCode: 500,
      body: JSON.stringify({ logs: [] })
    };
  }
};
