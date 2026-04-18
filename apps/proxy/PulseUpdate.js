// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseUpdate.js
// LAYER: BLOOD PRESSURE (Circulatory Pressure + Vital Signs Layer)
// ============================================================================
//
// ROLE:
//   BLOOD PRESSURE — The vital-signs subsystem of Pulse OS
//   • Measures upstream pressure (latency)
//   • Measures flow rate (kbps)
//   • Classifies circulatory health
//   • Builds normalized telemetry packets
//   • Feeds the Nervous System (PulseBand)
//
// CONTRACT:
//   • No PulseBand imports
//   • No PulseNet imports
//   • No global state
//   • Pure subsystem module
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PulseUpdate
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const BLOODPRESSURE_LAYER_ID = "BLOOD-PRESSURE-LAYER";
const BLOODPRESSURE_LAYER_NAME = "THE BLOOD PRESSURE";
const BLOODPRESSURE_LAYER_ROLE = "Circulatory Pressure + Vital Signs Layer";

const BLOODPRESSURE_DIAGNOSTICS_ENABLED =
  window?.PULSE_BLOODPRESSURE_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const bpLog = (stage, details = {}) => {
  if (!BLOODPRESSURE_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: BLOODPRESSURE_LAYER_ID,
      pulseName: BLOODPRESSURE_LAYER_NAME,
      pulseRole: BLOODPRESSURE_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

bpLog("BLOODPRESSURE_INIT", {});

// ============================================================================
// 1. Simple upstream latency probe — PRESSURE MEASUREMENT
// ============================================================================
async function measureLatency(url = "/pulse-proxy/ping") {
  osLog(`PulseUpdate → measureLatency() called (${url})`);
  bpLog("MEASURE_LATENCY_START", { url });

  const start = performance.now();

  try {
    const res = await fetch(url, { cache: "no-store" });
    const t = performance.now() - start;

    osLog(`PulseUpdate → ping returned in ${t.toFixed(1)}ms`);
    bpLog("PING_SUCCESS", { durationMs: t });

    let data = {};
    try {
      data = await res.json();
      osLog("PulseUpdate → ping JSON parsed");
      bpLog("PING_JSON_PARSED");
    } catch {
      osLog("PulseUpdate → ping JSON parse failed (ignored)");
      bpLog("PING_JSON_PARSE_FAILED");
    }

    return {
      ok: res.ok,
      rtt: data.rtt ?? t,
      bytes: data.bytes ?? null,
      kbps: data.kbps ?? null,
      msPerKB: data.msPerKB ?? null
    };

  } catch (err) {
    osLog("PulseUpdate → ping FAILED");
    bpLog("PING_FAILED", { error: String(err) });

    return {
      ok: false,
      rtt: null,
      bytes: null,
      kbps: null,
      msPerKB: null
    };
  }
}

// ============================================================================
// 2. Classifiers — BLOOD PRESSURE INTERPRETATION
// ============================================================================
function classifyBars(latency) {
  osLog(`PulseUpdate → classifyBars(${latency})`);
  bpLog("CLASSIFY_BARS", { latency });

  if (latency == null) return 1;
  if (latency < 80) return 4;
  if (latency < 110) return 3;
  if (latency < 160) return 2;
  return 1;
}

function classifyNetworkHealth(latency) {
  osLog(`PulseUpdate → classifyNetworkHealth(${latency})`);
  bpLog("CLASSIFY_HEALTH", { latency });

  if (latency == null) return "Unknown";
  if (latency < 90) return "Excellent";
  if (latency < 120) return "Good";
  if (latency < 180) return "Weak";
  return "Poor";
}

// ============================================================================
// 3. Public API — NORMALIZED VITAL SIGNS PACKET
// ============================================================================
async function getPulseTelemetry() {
  osLog("PulseUpdate → getPulseTelemetry()");
  bpLog("TELEMETRY_START");

  const ping = await measureLatency();

  const latency = ping.rtt;
  const kbps = ping.kbps;

  osLog(`PulseUpdate → latency=${latency}, kbps=${kbps}`);
  bpLog("TELEMETRY_VALUES", { latency, kbps });

  const pulsebandBars = classifyBars(latency);
  const networkHealth = classifyNetworkHealth(latency);

  osLog(`PulseUpdate → bars=${pulsebandBars}, health=${networkHealth}`);
  bpLog("TELEMETRY_CLASSIFIED", { pulsebandBars, networkHealth });

  const snapshot = {
    lastChunkDurationMs: latency,
    lastChunkSizeKB: kbps ? kbps / 8 : null,
    lastChunkKbps: kbps ?? null,
    lastChunkIndex: Date.now()
  };

  osLog("PulseUpdate → snapshot built");
  bpLog("SNAPSHOT_BUILT", snapshot);

  const result = {
    live: {
      latency,
      phoneKbps: kbps,
      appKbps: kbps,
      pulsebandBars,
      phoneBars: 4,
      networkHealth,
      route: "Primary",
      state: "active",
      microWindowActive: true,
      lastSyncTimestamp: Date.now()
    },
    snapshot
  };

  osLog("PulseUpdate → telemetry ready");
  bpLog("TELEMETRY_READY", result);

  return result;
}

// ============================================================================
// Exported API — BLOOD PRESSURE
// ============================================================================
export const PulseUpdate = {
  measureLatency,
  getPulseTelemetry
};
