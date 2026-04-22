// ============================================================================
// FILE: /apps/netlify/functions/CheckRouterMemory.js
// PULSE NETWORK MEMORY HEALER — v7.1
// “THE NETWORK HEALER+ / B‑LAYER LOG INTAKE + REPAIR ENGINE”
// ============================================================================
//
// ROLE (v7.1):
//   • Backend intake + validator for RouterMemory flushes
//   • Dual‑mode: works identically in offline + online environments
//   • Normalizes all v7.1 RouterMemory fields (context, lineage, version)
//   • Detects structural drift + malformed entries
//   • Preserves lineage + timestamps
//   • Returns authoritative, organism‑safe log batch
//
// CONTRACT (v7.1):
//   • Never mutate original input
//   • Fail‑open: invalid payload → empty safe array
//   • Always return structurally complete log entries
//   • Always AND: internal + external compatible
//   • Lymbic escalation must NEVER throw
//   • Deterministic, loggable, replayable
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "NETWORK-LAYER";
const LAYER_NAME = "THE NETWORK HEALER+";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + REPAIR";
const LAYER_VER  = "7.1";

const NETWORK_DIAGNOSTICS_ENABLED =
  process.env.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logNetworkHealer = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

  log(
    `%c(${LAYER_NAME} ${LAYER_ROLE}) %c${stage}`,
    "color:#00eaff;font-weight:bold;",
    "color:#fff;font-weight:bold;"
  );

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
// HUMAN‑READABLE CONTEXT MAP (MIRROR OF FRONTEND MEMORY CONTEXT)
// ============================================================================
const MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Log Buffer + Healing Support",
  context: "RouterMemory → CheckRouterMemory",
  healerVersion: LAYER_VER
};


// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE LOG BATCH (v7.1)
// ============================================================================

// Safe JSON parse
function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logNetworkHealer("BODY_PARSE_ERROR", { message: err?.message });
    return null;
  }
}


// Normalize a single log entry to v7.1 shape
function normalizeLogEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const safeStr = (v, d = "UNKNOWN") =>
    typeof v === "string" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  const safeNum = (v, d = Date.now()) =>
    typeof v === "number" ? v : d;

  return {
    eventType: safeStr(entry.eventType),
    data: safeObj(entry.data),
    timestamp: safeNum(entry.timestamp),

    // v7.1 lineage + context
    memoryVersion: entry.memoryVersion || LAYER_VER,
    ...MEMORY_CONTEXT
  };
}


// Heal entire batch
function healLogBatch(raw) {
  if (!Array.isArray(raw)) {
    logNetworkHealer("BATCH_INVALID_TYPE", { receivedType: typeof raw });
    return [];
  }

  const healed = [];
  let dropped = 0;

  for (const entry of raw) {
    const normalized = normalizeLogEntry(entry);
    if (!normalized) {
      dropped++;
      continue;
    }
    healed.push(normalized);
  }

  logNetworkHealer("BATCH_HEALED", {
    inputCount: raw.length,
    outputCount: healed.length,
    dropped
  });

  return healed;
}


// ============================================================================
// LYMBIC ESCALATION HOOK — SAFE, OPTIONAL (v7.1)
// ============================================================================
async function notifyLymbicOnFatal(err) {
  try {
    await fetch("/.netlify/functions/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err?.message || String(err),
        type: "CheckRouterMemoryFatal",
        source: "CheckRouterMemory",
        extra: {
          layer: LAYER_ID,
          role: LAYER_ROLE,
          version: LAYER_VER
        }
      })
    });
  } catch (e) {
    logNetworkHealer("LYMBIC_NOTIFY_FAILED", { message: String(e) });
  }
}


// ============================================================================
// BACKEND ENTRY POINT — “THE NETWORK HEALER+”
// ============================================================================
export const handler = async (event, context) => {
  logNetworkHealer("INTAKE_START", {
    method: event?.httpMethod || "UNKNOWN",
    hasBody: !!event?.body
  });

  try {
    if (event.httpMethod !== "POST") {
      logNetworkHealer("INVALID_METHOD", { method: event.httpMethod });
      return {
        statusCode: 405,
        body: JSON.stringify({ logs: [] })
      };
    }

    // ----------------------------------------------------
    // ⭐ 1. Parse incoming body
    // ----------------------------------------------------
    const parsed = safeParseBody(event.body);

    if (!parsed || typeof parsed !== "object") {
      logNetworkHealer("PAYLOAD_INVALID");
      return {
        statusCode: 400,
        body: JSON.stringify({ logs: [] })
      };
    }

    const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
    logNetworkHealer("PAYLOAD_RECEIVED", { rawCount: rawLogs.length });

    // ----------------------------------------------------
    // ⭐ 2. Heal + normalize log batch
    // ----------------------------------------------------
    const healedLogs = healLogBatch(rawLogs);

    // ----------------------------------------------------
    // ⭐ 3. Return authoritative batch
    // ----------------------------------------------------
    logNetworkHealer("RETURN_BATCH", { finalCount: healedLogs.length });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: healedLogs })
    };

  } catch (err) {
    error("CheckRouterMemory error:", err);

    logNetworkHealer("FATAL_ERROR", { message: err?.message });

    // ⭐ Lymbic escalation — MUST NOT throw
    await notifyLymbicOnFatal(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ logs: [] })
    };
  }
};
