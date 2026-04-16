/* ============================================================
   PulseUpdate.js — v6
   Purpose: Simple telemetry → PulseBand + PulseNet
   Notes:
     - No 4-layer health
     - No proxy health map
     - No system compute
     - Just: measure → normalize → pulseband.setStatus()
   ============================================================ */

/* ------------------------------------------------------------
   1. Simple upstream latency probe
------------------------------------------------------------ */
async function measureLatency(url = "/pulse-proxy/ping") {
  const start = performance.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const t = performance.now() - start;

    let data = {};
    try {
      data = await res.json();
    } catch {
      // ignore body parse errors
    }

    return {
      ok: res.ok,
      rtt: data.rtt ?? t,
      bytes: data.bytes ?? null,
      kbps: data.kbps ?? null,
      msPerKB: data.msPerKB ?? null
    };
  } catch {
    return { ok: false, rtt: null, bytes: null, kbps: null, msPerKB: null };
  }
}

/* ------------------------------------------------------------
   2. Classifiers
------------------------------------------------------------ */
function classifyBars(latency) {
  if (latency == null) return 1;
  if (latency < 80) return 4;
  if (latency < 110) return 3;
  if (latency < 160) return 2;
  return 1;
}

function classifyNetworkHealth(latency) {
  if (latency == null) return "Unknown";
  if (latency < 90) return "Excellent";
  if (latency < 120) return "Good";
  if (latency < 180) return "Weak";
  return "Poor";
}

/* ------------------------------------------------------------
   3. Single telemetry → PulseBand.setStatus()
------------------------------------------------------------ */
async function pollPulseTelemetry() {
  const ping = await measureLatency();

  const latency = ping.rtt;
  const kbps = ping.kbps;
  const pulsebandBars = classifyBars(latency);
  const networkHealth = classifyNetworkHealth(latency);

  const snapshot = {
    lastChunkDurationMs: latency,
    lastChunkSizeKB: kbps ? kbps / 8 : null,
    lastChunkKbps: kbps ?? null,
    lastChunkIndex: Date.now()
  };

  const gpuPerf = {
    smoothness: window.gpu?.runtime?.smoothnessScore ?? 0,
    pacing: window.gpu?.runtime?.pacingQuality ?? "Unknown",
    stalls: window.gpu?.runtime?.stallCount ?? 0,
    efficiency: window.gpu?.runtime?.efficiencySavings ?? 100,
    load: window.gpu?.runtime?.loadPercent ?? 0
  };

  window.pulseband?.setStatus({
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
    snapshot,
    gpuPerformance: gpuPerf
  });

  // Bridge into PulseNet (if present)
  if (window.pulsenet && window.pulseband) {
    window.pulsenet.updateSignalFromPulseBand(window.pulseband.getStatus());
  }
}

/* ------------------------------------------------------------
   4. Init: start simple telemetry loop
------------------------------------------------------------ */
(async function initPulseUpdate() {
  await pollPulseTelemetry();
  setInterval(pollPulseTelemetry, 3000);
})();
