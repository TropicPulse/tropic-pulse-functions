// ============================================================================
// FILE: /apps/pulse-proxy/CheckBand.js
// PULSE BAND HEALER — v9.3
// “THE MUSCLE CLINIC++ / KINETIC ORGAN HEALER”
// ============================================================================
//
// ROLE (v9.3):
//   • Backend validator + healer for PulseBand v9.x kinetic subsystem
//   • Normalizes ALL v9.3 fields (physics, sampler, GPU, network, advantage)
//   • Detects structural drift + missing fields
//   • Preserves lineage + timestamps
//   • Returns authoritative, organism‑safe kinetic snapshot
//
// CONTRACT (v9.3):
//   • Never mutate original input
//   • Fail‑open with safe defaults
//   • Always return structurally complete v9.3 band state
//   • No physics simulation, no timing loops
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "MUSCLE-LAYER";
const LAYER_NAME = "THE MUSCLE CLINIC++";
const LAYER_ROLE = "KINETIC ORGAN HEALER";
const LAYER_VER  = "9.3";

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
// HELPERS — SAFE PARSE + NORMALIZE BAND STATE (v9.3)
// ============================================================================

function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logBandHealer("BODY_PARSE_ERROR", { message: err?.message });
    return null;
  }
}

function normalizeBandState(raw) {
  if (!raw || typeof raw !== "object") return null;

  const safeNum = (v, d = 0) =>
    typeof v === "number" && !isNaN(v) ? v : d;

  const safeBool = (v, d = false) =>
    typeof v === "boolean" ? v : d;

  const safeStr = (v, d = "UNKNOWN") =>
    typeof v === "string" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

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

    // Network health (v9.3)
    networkHealth: safeStr(raw.networkHealth, "UNKNOWN"),

    // Advantage + efficiency (v9.3)
    advantage: safeNum(raw.advantage, 0),
    baselineAdvantage: safeNum(raw.baselineAdvantage, 0),
    efficiencyMode: safeStr(raw.efficiencyMode, "NORMAL"),
    burstMode: safeStr(raw.burstMode, "OFF"),

    // Route + state
    route: safeStr(raw.route, "UNKNOWN"),
    state: safeStr(raw.state, "IDLE"),

    // Sync + timing
    lastSyncSeconds: safeNum(raw.lastSyncSeconds, 0),
    lastSyncTimestamp: safeNum(raw.lastSyncTimestamp, Date.now()),

    // Physics + kinetic metrics (v9.3)
    phoneKbps: safeNum(raw.phoneKbps, 0),
    appKbps: safeNum(raw.appKbps, 0),
    lastChunkKbps: safeNum(raw.lastChunkKbps, 0),
    lastChunkDurationMs: safeNum(raw.lastChunkDurationMs, 0),
    lastChunkSizeKB: safeNum(raw.lastChunkSizeKB, 0),
    lastChunkIndex: safeNum(raw.lastChunkIndex, 0),

    // GPU + sampler flags (v9.3)
    microWindowActive: safeBool(raw.microWindowActive, false),
    engineDisabled: safeBool(raw.engineDisabled, false),

    // Estimated timing (v9.3)
    estimatedPhoneSeconds: safeNum(raw.estimatedPhoneSeconds, 0),
    pulseSeconds: safeNum(raw.pulseSeconds, 0),

    // Metrics container
    metrics: safeObj(raw.metrics, {}),

    // Timestamp normalization
    timestamp: raw.timestamp || Date.now(),

    // Context injection
    ...BAND_CONTEXT
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE MUSCLE CLINIC++”
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

    const healedBand = normalizeBandState(rawBand);

    logBandHealer("STATE_HEALED", { healed: !!healedBand });

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
