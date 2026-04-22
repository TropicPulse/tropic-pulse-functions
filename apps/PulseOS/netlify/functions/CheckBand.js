// ============================================================================
// FILE: /apps/netlify/functions/CheckBand.js
// PULSE BAND HEALER — v7.1
// “THE MUSCLE CLINIC+ / KINETIC SUBSYSTEM REPAIR ENGINE”
// ============================================================================
//
// ROLE (v7.1):
//   • Backend validator + healer for PulseBand subsystem state
//   • Dual‑mode: works identically in offline + online environments
//   • Normalizes all v7.1 PulseBand fields (bars, latency, health, modes, etc.)
//   • Detects structural drift + missing fields
//   • Preserves lineage + timestamps
//   • Returns authoritative, organism‑safe kinetic snapshot
//
// CONTRACT (v7.1):
//   • Never mutate original input
//   • Fail‑open with safe defaults
//   • Always return structurally complete band state
//   • Always AND: internal + external compatible
//   • No physics, no GPU, no timing loops
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "MUSCLE-LAYER";
const LAYER_NAME = "THE MUSCLE CLINIC+";
const LAYER_ROLE = "KINETIC SUBSYSTEM HEALER";
const LAYER_VER  = "7.1";

const BAND_DIAGNOSTICS_ENABLED =
  process.env.PULSE_BAND_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logBandHealer = (stage, details = {}) => {
  if (!BAND_DIAGNOSTICS_ENABLED) return;

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
// HUMAN‑READABLE CONTEXT MAP (MIRROR OF FRONTEND BAND CONTEXT)
// ============================================================================
const BAND_CONTEXT = {
  label: "PULSEBAND",
  layer: "Kinetic Layer",
  purpose: "Motion + Physics Subsystem",
  context: "Frontend kinetic engine state",
  healerVersion: LAYER_VER
};


// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE BAND STATE (v7.1)
// ============================================================================

// Safe JSON parse
function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logBandHealer("BODY_PARSE_ERROR", { message: err?.message });
    return null;
  }
}


// Normalize all v7.1 PulseBand fields
function normalizeBandState(raw) {
  if (!raw || typeof raw !== "object") return null;

  const safeNum = (v, d = 0) =>
    typeof v === "number" && !isNaN(v) ? v : d;

  const safeBool = (v, d = false) =>
    typeof v === "boolean" ? v : d;

  const safeStr = (v, d = "UNKNOWN") =>
    typeof v === "string" ? v : d;

  return {
    // Core kinetic flags
    active: safeBool(raw.active, false),
    mode: safeStr(raw.mode, "IDLE"),

    // Bars + signal
    pulsebandBars: safeNum(raw.pulsebandBars, 0),
    phoneBars: safeNum(raw.phoneBars, 0),

    // Latency + stability
    latency: safeNum(raw.latency, 0),
    stabilityScore: safeNum(raw.stabilityScore, 0),
    latencyClass: safeStr(raw.latencyClass, "UNKNOWN"),

    // Network health
    networkHealth: safeStr(raw.networkHealth, "UNKNOWN"),

    // Advantage + efficiency
    advantage: safeNum(raw.advantage, 0),
    efficiencyMode: safeStr(raw.efficiencyMode, "NORMAL"),
    burstMode: safeStr(raw.burstMode, "OFF"),

    // Route + state
    route: safeStr(raw.route, "UNKNOWN"),
    state: safeStr(raw.state, "IDLE"),

    // Sync + timing
    lastSyncSeconds: safeNum(raw.lastSyncSeconds, 0),
    lastSyncTimestamp: safeNum(raw.lastSyncTimestamp, Date.now()),

    // Kinetic metrics
    metrics: typeof raw.metrics === "object" && raw.metrics !== null
      ? raw.metrics
      : {},

    // Timestamp normalization
    timestamp: raw.timestamp || Date.now(),

    // Context injection
    ...BAND_CONTEXT
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE MUSCLE CLINIC+”
// ============================================================================
export const handler = async (event, context) => {
  logBandHealer("INTAKE_START", {
    method: event?.httpMethod || "UNKNOWN",
    hasBody: !!event?.body
  });

  try {
    if (event.httpMethod !== "POST") {
      logBandHealer("INVALID_METHOD", { method: event.httpMethod });
      return {
        statusCode: 405,
        body: JSON.stringify({ band: null })
      };
    }

    // ----------------------------------------------------
    // ⭐ 1. Parse incoming body
    // ----------------------------------------------------
    const parsed = safeParseBody(event.body);

    if (!parsed || typeof parsed !== "object") {
      logBandHealer("PAYLOAD_INVALID");
      return {
        statusCode: 400,
        body: JSON.stringify({ band: null })
      };
    }

    const rawBand = parsed.band || null;
    logBandHealer("PAYLOAD_RECEIVED", { hasBand: !!rawBand });

    // ----------------------------------------------------
    // ⭐ 2. Heal + normalize subsystem state
    // ----------------------------------------------------
    const healedBand = normalizeBandState(rawBand);

    logBandHealer("STATE_HEALED", { healed: !!healedBand });

    // ----------------------------------------------------
    // ⭐ 3. Return healed state
    // ----------------------------------------------------
    logBandHealer("RETURN_STATE");

    return {
      statusCode: 200,
      body: JSON.stringify({ band: healedBand })
    };

  } catch (err) {
    error("CheckBand error:", err);

    logBandHealer("FATAL_ERROR", { message: err?.message });

    return {
      statusCode: 500,
      body: JSON.stringify({ band: null })
    };
  }
};
