// ============================================================================
// FILE: /apps/pulse-proxy/CheckRouterMemory-v11-EVO-BINARY.js
// PULSE NETWORK MEMORY HEALER — v11‑EVO‑BINARY
// “THE NETWORK HEALER+++ / BINARY-FIRST LOG INTAKE + DUALBAND REPAIR ENGINE”
// ============================================================================
//
// ROLE (v11‑EVO‑BINARY):
//   • Backend intake + validator for RouterMemory flushes
//   • Binary‑first, dualband healer: Symbolic A → Binary B → Symbolic A
//   • Normalizes ALL log fields (routeTrace, lineage, evo, importConflict)
//   • Detects structural drift + malformed entries + non‑binary core usage
//   • Preserves lineage + timestamps (never invents time)
//   • Returns authoritative, organism‑safe, binary‑aware log batch
//   • Mode‑aware: A→B→A compatible, binary‑first nervous system
//
// CONTRACT (v11‑EVO‑BINARY):
//   • Never mutate original input
//   • Fail‑open: invalid payload → empty safe array
//   • Always return structurally complete log entries
//   • Lymbic escalation must NEVER throw
//   • Deterministic, loggable, replayable
//   • No single point of failure: healer must not crash the proxy
//   • No synthetic timestamps (no Date.now defaults)
//   • Binary drift detection + proxy bypass detection
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "NETWORK-LAYER-BINARY";
const LAYER_NAME = "THE NETWORK HEALER+++";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + DUALBAND REPAIR";
const LAYER_VER  = "11.0-EVO-BINARY";

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
  context: "RouterMemory → CheckRouterMemory-v11-EVO-BINARY",
  healerVersion: LAYER_VER,
  binaryFirst: true,
  dualband: true
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

    return (headerMode || queryMode || "router-memory-binary").toString();
  } catch {
    return "router-memory-binary";
  }
}

function buildMemoryContext(mode) {
  return {
    ...BASE_MEMORY_CONTEXT,
    mode
  };
}


// ============================================================================
// BINARY SIGNATURE + DRIFT DETECTION HELPERS
// ============================================================================
function computeBinaryLogSignature(entry) {
  try {
    const seed = JSON.stringify({
      eventType: entry.eventType,
      page: entry.page,
      routeTrace: entry.routeTrace,
      evo: entry.evo
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "LOG-BIN-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "LOG-BIN-00000000";
  }
}

function detectBinaryDrift(entry) {
  const driftFlags = [];

  // Non‑binary core usage (intent: detectNonBinaryCoreUsage)
  if (!entry.evo || typeof entry.evo !== "object") {
    driftFlags.push("missing_evo_metadata");
  }

  // Proxy bypass detection (intent: detectProxyBypass)
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const hasBinaryProxy = trace.some((t) =>
    typeof t === "string" && t.includes("BinaryProxy")
  );
  const hasProxySpine = trace.some((t) =>
    typeof t === "string" && t.includes("PulseProxySpine")
  );

  if (!hasBinaryProxy && hasProxySpine) {
    driftFlags.push("proxy_bypass_suspected");
  }

  return driftFlags;
}


// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE LOG BATCH (v11‑EVO‑BINARY)
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

// Normalize a single log entry to v11‑EVO‑BINARY shape
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

  const normalized = {
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

  // Attach binary signature + drift flags
  normalized.binarySignature = computeBinaryLogSignature(normalized);
  normalized.binaryDriftFlags = detectBinaryDrift(normalized);

  return normalized;
}


// ============================================================================
// DUALBAND HEALING — A → B → A
// ============================================================================
function dualbandHealLogEntry(entry, mode, memoryContext) {
  // Symbolic normalization (A)
  const symbolic = normalizeLogEntry(entry, mode, memoryContext);
  if (!symbolic) return null;

  // Binary compression / annotation (B)
  const binary = {
    ...symbolic,
    binaryCompressed: true
  };

  // Symbolic merge (A)
  return {
    ...binary,
    repairMode: "dualband"
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
    const normalized = dualbandHealLogEntry(entry, mode, memoryContext);
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
// – LYMBIC ESCALATION HOOK — SAFE, OPTIONAL (v11‑EVO‑BINARY)
// ============================================================================
async function notifyLymbicOnFatal(err, mode) {
  try {
    await fetch("/pulse-router/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err?.message || String(err),
        type: "CheckRouterMemoryFatal",
        source: "CheckRouterMemory-v11-EVO-BINARY",
        mode,
        extra: {
          layer: LAYER_ID,
          role: LAYER_ROLE,
          version: LAYER_VER,
          binaryFirst: true,
          dualband: true
        }
      })
    });
  } catch (e) {
    logNetworkHealer("LYMBIC_NOTIFY_FAILED", { message: String(e), mode });
  }
}


// ============================================================================
// BACKEND ENTRY POINT — “THE NETWORK HEALER+++” (v11‑EVO‑BINARY)
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
    safeError("CheckRouterMemory v11‑EVO‑BINARY error:", err);

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
