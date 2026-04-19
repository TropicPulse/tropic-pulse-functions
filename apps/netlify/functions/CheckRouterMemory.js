// ============================================================================
// FILE: /apps/netlify/functions/CheckRouterMemory.js
// PULSE NETWORK MEMORY HEALER — v6.4
// “THE NETWORK / B‑LAYER LOG HEALING + INTAKE ENGINE”
// ============================================================================
//
// ⭐ v6.4 COMMENT LOG
// - THEME: “THE NETWORK / LOG HEALING + INTAKE ENGINE”
// - ROLE: Backend intake + validator for RouterMemory flushes
// - Added Lymbic escalation hook on FATAL_ERROR (RouteDownAlert)
// - Kept safety contract: no direct external writes, fail‑open behavior
// - Kept healing + normalization logic IDENTICAL to v6.3
//
// ============================================================================
// PERSONALITY + ROLE — “THE NETWORK HEALER”
// ----------------------------------------------------------------------------
// CheckRouterMemory is the **BACKEND HEALER** for the RouterMemory buffer.
// It is the **B‑LAYER LOG HEALING + INTAKE ENGINE** — the place where
// short‑term logs from RouterMemory are received, validated, lightly healed,
// and prepared for downstream storage or processing.
//
//   • Receives flushed logs from RouterMemory / Timer.js
//   • Validates structure + required fields
//   • Repairs minor drift (missing context, malformed entries)
//   • Returns a clean, authoritative log batch
//
// This is the OS’s **neural intake clinic** — the point where noisy,
// short‑term network memory is normalized before being committed.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A backend intake + validator for RouterMemory flushes
//   ✔ A light healing layer for log structure + context
//   ✔ A deterministic, diagnostics‑rich network memory healer
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a database writer
//   ✘ NOT a router
//   ✘ NOT a business logic layer
//   ✘ NOT a security or auth layer
//
// ============================================================================
// SAFETY CONTRACT (v6.4)
// ----------------------------------------------------------------------------
//   • Never write directly to external systems from here
//   • Fail‑open: invalid payload → empty, safe array
//   • Never mutate the original input in place
//   • Always return a structurally safe, array‑of‑objects batch
//   • Lymbic escalation (RouteDownAlert) must NEVER throw back into this file
//
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "NETWORK-LAYER";
const LAYER_NAME = "THE NETWORK HEALER";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + REPAIR";

const NETWORK_DIAGNOSTICS_ENABLED =
  process.env.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logNetworkHealer = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

  console.log(
    `%c(${LAYER_NAME} ${LAYER_ROLE}) %c${stage}`,
    "color:#00eaff;font-weight:bold;",
    "color:#fff;font-weight:bold;"
  );

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
// HUMAN‑READABLE CONTEXT MAP (MIRROR OF FRONTEND MEMORY CONTEXT)
// ============================================================================
const MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Log Buffer + Healing Support",
  context: "Stores logs before Timer.js flush"
};

// ============================================================================
// HELPER — SAFE PARSE + NORMALIZE LOG BATCH
// ============================================================================
function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logNetworkHealer("BODY_PARSE_ERROR", {
      message: err?.message || "Unknown parse error"
    });
    return null;
  }
}

function normalizeLogEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const base = {
    eventType: typeof entry.eventType === "string" ? entry.eventType : "UNKNOWN",
    data: typeof entry.data === "object" && entry.data !== null ? entry.data : {},
    timestamp: entry.timestamp || Date.now()
  };

  // Ensure MEMORY_CONTEXT is present
  return {
    ...base,
    ...MEMORY_CONTEXT
  };
}

function healLogBatch(raw) {
  if (!Array.isArray(raw)) {
    logNetworkHealer("BATCH_INVALID_TYPE", {
      receivedType: typeof raw
    });
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
// LYMBIC ESCALATION HOOK — SAFE, OPTIONAL
// ----------------------------------------------------------------------------
// On FATAL_ERROR, we *optionally* notify RouteDownAlert.
// This is an internal syscall only; if it fails, we swallow the error.
// ============================================================================
async function notifyLymbicOnFatal(err) {
  try {
    await fetch("/.netlify/functions/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err?.message || String(err) || "Unknown error",
        type: "CheckRouterMemoryFatal",
        source: "CheckRouterMemory",
        extra: {
          layer: LAYER_ID,
          role: LAYER_ROLE
        }
      })
    });
  } catch (e) {
    // Lymbic must NEVER stab the spine.
    logNetworkHealer("LYMBIC_NOTIFY_FAILED", {
      message: String(e)
    });
  }
}

// ============================================================================
// BACKEND ENTRY POINT — “THE NETWORK HEALER”
// ============================================================================
//
// EXPECTED INPUT (Timer.js → CheckRouterMemory):
//   POST body: JSON.stringify({ logs: [ ...RouterMemory.getAll() ] })
//
// RETURNS:
//   200 + { logs: [ ...healedLogs ] } on success
//   400 + { logs: [] } on invalid payload
//   500 + { logs: [] } on fatal error
//
// ============================================================================
export const handler = async (event, context) => {
  logNetworkHealer("INTAKE_START", {
    method: event?.httpMethod || "UNKNOWN",
    hasBody: !!event?.body
  });

  try {
    if (event.httpMethod !== "POST") {
      logNetworkHealer("INVALID_METHOD", {
        method: event.httpMethod
      });

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
      logNetworkHealer("PAYLOAD_INVALID", {});
      return {
        statusCode: 400,
        body: JSON.stringify({ logs: [] })
      };
    }

    const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
    logNetworkHealer("PAYLOAD_RECEIVED", {
      rawCount: rawLogs.length
    });

    // ----------------------------------------------------
    // ⭐ 2. Heal + normalize log batch
    // ----------------------------------------------------
    const healedLogs = healLogBatch(rawLogs);

    // ----------------------------------------------------
    // ⭐ 3. (Optional) Forward to downstream storage/processing
    // ----------------------------------------------------
    // NOTE:
    //   This layer does NOT decide where logs are stored.
    //   It ONLY ensures the batch is structurally safe.
    //
    //   A downstream function / service should:
    //     • write to database
    //     • trigger analytics
    //     • perform heavy processing
    //
    //   Here we remain a pure healer + normalizer.

    logNetworkHealer("RETURN_BATCH", {
      finalCount: healedLogs.length
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: healedLogs })
    };

  } catch (err) {
    console.error("CheckRouterMemory error:", err);

    logNetworkHealer("FATAL_ERROR", {
      message: err?.message || "Unknown error"
    });

    // ⭐ Lymbic escalation — MUST NOT throw
    await notifyLymbicOnFatal(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ logs: [] })
    };
  }
};
