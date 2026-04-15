// ======================================================
// ⭐ PulseUpdate.js — v3‑Aligned 4‑Layer Health + Physics
// ======================================================

// ------------------------------------------------------
// 0. REAL UPSTREAM LATENCY (frontend RTT)
// ------------------------------------------------------
async function measureUpstreamLatency(
  url = "https://jsonplaceholder.typicode.com/todos/1"
) {
  const start = performance.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    await res.text();
    return performance.now() - start;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// ------------------------------------------------------
// ⭐ 4‑LAYER HEALTH CHECK
// ------------------------------------------------------
async function pingWithTimeout(fn, timeoutMs = 1500) {
  return Promise.race([
    fn().then((v) => ({ ok: true, value: v })),
    new Promise((resolve) =>
      setTimeout(() => resolve({ ok: false, value: "timeout" }), timeoutMs)
    )
  ]);
}

async function pingFrontend() {
  const t0 = performance.now();
  return performance.now() - t0; // always instant
}

async function pingHosting() {
  const t0 = performance.now();
  try {
    const res = await fetch("/ping", { cache: "no-store" });
    await res.text();
    return performance.now() - t0;
  } catch {
    return null;
  }
}

async function pingProxy() {
  const t0 = performance.now();
  try {
    const res = await fetch("/pulse-proxy/ping", { cache: "no-store" });
    await res.json();
    return performance.now() - t0;
  } catch {
    return null;
  }
}

async function pingDataBackend() {
  const t0 = performance.now();
  try {
    const res = await fetch("/ping", { cache: "no-store" });
    await res.text();
    return performance.now() - t0;
  } catch {
    return null;
  }
}

// ------------------------------------------------------
// ⭐ RUN ALL 4 PINGS IN PARALLEL
// ------------------------------------------------------
async function runPulseBandHealthCheck() {
  const [frontend, hosting, proxy, data] = await Promise.all([
    pingWithTimeout(pingFrontend),
    pingWithTimeout(pingHosting),
    pingWithTimeout(pingProxy),
    pingWithTimeout(pingDataBackend)
  ]);

  const health = {
    frontend: frontend.ok ? frontend.value : null,
    hosting: hosting.ok ? hosting.value : null,
    proxy: proxy.ok ? proxy.value : null,
    data: data.ok ? data.value : null
  };

  const classify = (v) => {
    if (v === null || v === "timeout") return "down";
    if (v < 300) return "healthy";
    if (v < 1500) return "degraded";
    return "down";
  };

  const healthMap = {
    frontend: classify(health.frontend),
    hosting: classify(health.hosting),
    proxy: classify(health.proxy),
    data: classify(health.data)
  };

  const proxyDown = healthMap.proxy === "down";

  window.pulseband.setStatus({
    live: {
      pulsebandMode: proxyDown ? "fallback" : "normal",
      healthMap
    }
  });

  return !proxyDown;
}

// ------------------------------------------------------
// ⭐ GLOBAL PulseBand RATE ENGINE
// ------------------------------------------------------
window.getPulseBandRate = async function () {
  window.__pulseLogs = window.__pulseLogs || [];

  let pingLatency = null;
  let kbps = null;
  let msPerKB = null;

  try {
    const t0 = performance.now();
    const res = await fetch("/pulse-proxy/ping", {
      method: "GET",
      cache: "no-store"
    });
    const t1 = performance.now();
    const data = await res.json().catch(() => ({}));

    pingLatency = data.rtt ?? (t1 - t0);

    if (data.kbps != null && data.msPerKB != null) {
      kbps = data.kbps;
      msPerKB = data.msPerKB;
    } else if (data.bytes != null) {
      const durationMs = t1 - t0;
      const sizeKB = data.bytes / 1024;
      kbps = Math.round((sizeKB / (durationMs / 1000)) * 8);
      msPerKB = sizeKB > 0 ? durationMs / sizeKB : null;
    }
  } catch (err) {
    console.log(err);
  }

  const upstreamLatency = await measureUpstreamLatency();
  const latency = pingLatency ?? upstreamLatency ?? null;

  let pulsebandBars = 1;
  if (latency !== null) {
    if (latency < 80) pulsebandBars = 4;
    else if (latency < 110) pulsebandBars = 3;
    else if (latency < 160) pulsebandBars = 2;
  }

  let networkHealth = "Unknown";
  if (latency !== null) {
    if (latency < 90) networkHealth = "Excellent";
    else if (latency < 120) networkHealth = "Good";
    else if (latency < 180) networkHealth = "Weak";
    else networkHealth = "Poor";
  }

  return {
    state: "active",
    latency,
    kbps,
    msPerKB,
    pulsebandBars,
    phoneBars: 4,
    networkHealth,
    route: "Primary",
    microWindowActive: null,
    stabilityScore: null,
    advantage: null,
    lastChunkDurationMs: latency,
    lastChunkSizeKB: kbps ? kbps / 8 : null,
    lastChunkKbps: kbps,
    lastChunkIndex: Date.now(),
    upstreamLatency
  };
};

// ------------------------------------------------------
// ⭐ PulseBand Physics Loop (v3 setStatus)
// ------------------------------------------------------
async function pollPulsePhysics() {
  try {
    const data = await window.getPulseBandRate();

    const gpuPerf = {
      smoothness: window.gpu?.runtime?.smoothnessScore ?? 0,
      pacing: window.gpu?.runtime?.pacingQuality ?? "Unknown",
      stalls: window.gpu?.runtime?.stallCount ?? 0,
      efficiency: window.gpu?.runtime?.efficiencySavings ?? 100,
      load: window.gpu?.runtime?.loadPercent ?? 0
    };

    window.pulseband.setStatus({
      live: {
        latency: data.latency,
        phoneKbps: data.kbps,
        appKbps: data.kbps,
        pulsebandBars: data.pulsebandBars,
        phoneBars: data.phoneBars,
        networkHealth: data.networkHealth,
        route: data.route,
        state: data.state || "active",
        microWindowActive: data.microWindowActive ?? true,
        lastSyncTimestamp: Date.now()
      },
      snapshot: {
        lastChunkDurationMs: data.lastChunkDurationMs,
        lastChunkSizeKB: data.lastChunkSizeKB,
        lastChunkKbps: data.lastChunkKbps,
        lastChunkIndex: data.lastChunkIndex
      },
      gpuPerformance: gpuPerf
    });
  } catch (err) {
    window.pulseband.setStatus({
      live: {
        lastProxyError: String(err)
      }
    });
  }
}

// ------------------------------------------------------
// ⭐ SYSTEM COMPUTE STARTER (v3 — backend‑driven)
// ------------------------------------------------------
function startSystemCompute() {
  console.log("[PulseBand] System compute is handled by backend in v3 — no local MinerEngine.");
}

// ------------------------------------------------------
// ⭐ INIT: RUN HEALTH CHECK FIRST + START PHYSICS LOOP
// ------------------------------------------------------
(async function initPulseBand() {
  const ok = await runPulseBandHealthCheck();
  if (!ok) {
    console.warn("PulseBand disabled — proxy unreachable.");
    return;
  }

  startSystemCompute();

  await pollPulsePhysics();
  setInterval(pollPulsePhysics, 3000);
})();