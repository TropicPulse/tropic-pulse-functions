// PulseClient.js — PulseBand v3 Architecture

const PULSE_PROXY_URL = "https://tropicpulse.bz";

/* ---------------- System Info ---------------- */

function getSystemInfo() {
  const ua = navigator.userAgent || "";
  return {
    ua,
    platform: navigator.platform || "",
    language: navigator.language || "",
    deviceModel: detectDeviceModel(ua),
    osVersion: detectOSVersion(ua),
    appVersion: window.__APP_VERSION__ || "Unknown"
  };
}

function detectDeviceModel(ua) {
  if (ua.includes("S27")) return "Galaxy S27";
  if (ua.includes("S26+")) return "Galaxy S26+";
  if (ua.includes("S26 ")) return "Galaxy S26";
  return "Unknown Device";
}

function detectOSVersion(ua) {
  const m = ua.match(/Android\s([\d.]+)/i);
  return m ? `Android ${m[1]}` : "Unknown OS";
}

/* ---------------- Remember Me ---------------- */

function getRememberMeFlag() {
  return localStorage.getItem("tp_stay_signed_v4") === "1";
}

/* ---------------- Logging ---------------- */

window.__pulseLogs = window.__pulseLogs || [];

function pushLog(evt) {
  window.__pulseLogs.push(evt);
  if (window.__pulseLogs.length > 200) window.__pulseLogs.shift();
}

/* ---------------- Proxy Fetch (v3) ---------------- */

async function getViaProxy(url) {
  const sys = getSystemInfo();
  const rememberMe = getRememberMeFlag();
  const start = performance.now();

  try {
    const res = await fetch(
      `${PULSE_PROXY_URL}/TPProxy?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "x-pulse-device": JSON.stringify(sys),
          "x-pulse-remember": rememberMe ? "1" : "0",
          "x-pulse-user": window.identity?.uid || "anonymous"
        }
      }
    );

    if (!res.ok) throw new Error("Pulse route failed: " + res.status);

    const contentType = res.headers.get("content-type") || "";
    const bytes = Number(res.headers.get("x-pulse-bytes") ?? "0");
    const chunks = Number(res.headers.get("x-pulse-chunks") ?? "1");
    const durationMs = performance.now() - start;

    let data;
    if (contentType.includes("application/json")) data = await res.json();
    else if (contentType.startsWith("text/")) data = await res.text();
    else data = await res.arrayBuffer();

    const evt = {
      ts: Date.now(),
      type: "generic",
      path: url,
      route: "pulse",
      bytes,
      durationMs,
      chunks,
      system: sys,
      rememberMe
    };

    pushLog(evt);
    return { data, meta: evt };

  } catch (err) {
    // fallback
    const fbStart = performance.now();
    const fbRes = await fetch(url);
    const contentType = fbRes.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) data = await fbRes.json();
    else if (contentType.startsWith("text/")) data = await fbRes.text();
    else data = await fbRes.arrayBuffer();

    const durationMs = performance.now() - fbStart;
    const bytes = Number(fbRes.headers.get("content-length") ?? "0");

    const evt = {
      ts: Date.now(),
      type: "generic",
      path: url,
      route: "phone",
      bytes,
      durationMs,
      chunks: 1,
      system: sys,
      rememberMe,
      error: String(err?.message || err)
    };

    pushLog(evt);
    return { data, meta: evt };
  }
}

/* ---------------- LIVE PHYSICS ENGINE (v3) ---------------- */

async function pollPulsePhysics() {
  try {
    const res = await fetch(`${PULSE_PROXY_URL}/ping`);
    if (!res.ok) return;

    const data = await res.json();

    window.pulseband.setStatus({
      live: {
        latency: data.latency,
        pulsebandBars: data.bars,
        phoneBars: data.phoneBars,
        route: data.route,
        state: data.state,
        microWindowActive: data.microWindowActive,
        lastSyncTimestamp: Date.now()
      }
    });

    if (window.pulsenet) {
      window.pulsenet.updateSignalFromPulseBand(
        window.pulseband.getStatus().live
      );
    }

  } catch (err) {
    console.log(err);
  }
}

setInterval(pollPulsePhysics, 1500);

/* ---------------- Public API ---------------- */

window.PulseClient = {
  get: getViaProxy
};