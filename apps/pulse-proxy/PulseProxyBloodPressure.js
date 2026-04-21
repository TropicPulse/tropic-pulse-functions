// ============================================================================
//  PULSE OS v7.7 — CIRCULATION MONITOR
//  “Blood Pressure + Blood Flow Sensor”
//  Measures latency (pressure) and speed (flow) and sends simple vital signs.
//  PURE SENSOR. NO THINKING. NO DECISIONS. NO GLOBAL STATE.
// ============================================================================
//
//  WHAT THIS ORGAN DOES (simple terms):
//  ------------------------------------
//  • Checks how “hard” the network is pushing (latency = blood pressure)
//  • Checks how “fast” data is moving (kbps = blood flow)
//  • Gives a simple health rating (Excellent / Good / Weak / Poor)
//  • Builds a clean vital‑signs packet for the Nervous System (PulseBand)
//  • Never makes decisions — only measures and reports
//
//  SAFETY RULES (v7.7):
//  ---------------------
//  • No PulseBand imports
//  • No PulseNet imports
//  • No global state
//  • No console.* (uses PulseLogger)
//  • No backend calls except the ping endpoint
//  • No compute, no AI, no mutation
//
// ============================================================================

// Logger + Telemetry (safe)
import { logger } from "../OSKernel/PulseLogger.js";
import { emitTelemetry } from "../OSKernel/PulseTelemetry.js";

// ============================================================================
//  ORGAN IDENTITY — v7.7
// ============================================================================
const CIRCULATION_CONTEXT = {
  layer: "PulseUpdate",
  role: "CIRCULATION_MONITOR",
  purpose: "Measure pressure + flow and send simple vital signs",
  version: "7.7",
  target: "full-os",
  evo: {
    driftProof: true,
    pulseEfficiencyAware: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true
  }
};

// Subsystem name for logs + telemetry
const SUBSYSTEM = "circulation";

// ============================================================================
//  DIAGNOSTICS (optional)
// ============================================================================
const DIAG_ENABLED =
  typeof window !== "undefined" &&
  (window.PULSE_CIRCULATION_DIAGNOSTICS === true ||
   window.PULSE_DIAGNOSTICS === true);

function diag(stage, details = {}) {
  if (!DIAG_ENABLED) return;

  logger.log(SUBSYSTEM, stage, {
    ...details,
    meta: { ...CIRCULATION_CONTEXT }
  });

  emitTelemetry(SUBSYSTEM, stage, details);
}

diag("CIRCULATION_INIT");

// ============================================================================
// 1. PRESSURE CHECK — Measure latency (blood pressure)
// ============================================================================
async function measureLatency(url = "/pulse-proxy/ping") {
  diag("MEASURE_LATENCY_START", { url });

  const start = performance.now();

  try {
    const res = await fetch(url, { cache: "no-store" });
    const t = performance.now() - start;

    diag("PING_SUCCESS", { durationMs: t });

    let data = {};
    try {
      data = await res.json();
      diag("PING_JSON_PARSED");
    } catch {
      diag("PING_JSON_PARSE_FAILED");
    }

    return {
      ok: res.ok,
      rtt: data.rtt ?? t,
      kbps: data.kbps ?? null,
      msPerKB: data.msPerKB ?? null
    };

  } catch (err) {
    diag("PING_FAILED", { error: String(err) });

    return {
      ok: false,
      rtt: null,
      kbps: null,
      msPerKB: null
    };
  }
}

// ============================================================================
// 2. CLASSIFIERS — Turn numbers into simple ratings
// ============================================================================

// Bars = how strong the signal feels (1–4)
function classifyBars(latency) {
  diag("CLASSIFY_BARS", { latency });

  if (latency == null) return 1;
  if (latency < 80) return 4;
  if (latency < 110) return 3;
  if (latency < 160) return 2;
  return 1;
}

// Health = simple human‑readable rating
function classifyNetworkHealth(latency) {
  diag("CLASSIFY_HEALTH", { latency });

  if (latency == null) return "Unknown";
  if (latency < 90) return "Excellent";
  if (latency < 120) return "Good";
  if (latency < 180) return "Weak";
  return "Poor";
}

// ============================================================================
// 3. PUBLIC API — Build a simple vital‑signs packet
// ============================================================================
async function getPulseTelemetry() {
  diag("TELEMETRY_START");

  const ping = await measureLatency();

  const latency = ping.rtt;
  const kbps = ping.kbps;

  diag("TELEMETRY_VALUES", { latency, kbps });

  const bars = classifyBars(latency);
  const health = classifyNetworkHealth(latency);

  diag("TELEMETRY_CLASSIFIED", { bars, health });

  // Snapshot = stable record
  const snapshot = {
    lastChunkDurationMs: latency,
    lastChunkKbps: kbps ?? null,
    lastChunkSizeKB: kbps ? kbps / 8 : null,
    lastChunkIndex: Date.now(),
    meta: { ...CIRCULATION_CONTEXT }
  };

  diag("SNAPSHOT_BUILT", snapshot);

  // Live = what PulseBand uses right now
  const result = {
    live: {
      latency,
      phoneKbps: kbps,
      appKbps: kbps,
      pulsebandBars: bars,
      phoneBars: 4,
      networkHealth: health,
      route: "Primary",
      state: "active",
      microWindowActive: true,
      lastSyncTimestamp: Date.now(),
      meta: { ...CIRCULATION_CONTEXT }
    },
    snapshot
  };

  diag("TELEMETRY_READY", result);

  return result;
}

// ============================================================================
//  EXPORT — CIRCULATION MONITOR v7.7
// ============================================================================
export const PulseUpdate = {
  measureLatency,
  getPulseTelemetry,
  meta: { ...CIRCULATION_CONTEXT }
};
