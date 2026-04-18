// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseClient.js
// LAYER: BLOOD FLOW (Circulatory Fetch Layer)
// ============================================================================
//
// ROLE:
//   BLOOD FLOW — The outbound circulatory layer of Pulse OS
//   • Moves data through the system
//   • Attempts accelerated PULSE route first
//   • Falls back to PHONE route if needed
//   • Returns clean { data, meta } packets
//
// CONTRACT:
//   • No PulseBand imports
//   • No PulseNet imports
//   • No global state
//   • No side effects
//   • Pure subsystem module
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PulseClient
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const BLOODFLOW_LAYER_ID = "BLOOD-FLOW-LAYER";
const BLOODFLOW_LAYER_NAME = "THE BLOOD FLOW";
const BLOODFLOW_LAYER_ROLE = "Circulatory Fetch Layer";

const BLOODFLOW_DIAGNOSTICS_ENABLED =
  window?.PULSE_BLOODFLOW_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const bloodFlowLog = (stage, details = {}) => {
  if (!BLOODFLOW_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: BLOODFLOW_LAYER_ID,
      pulseName: BLOODFLOW_LAYER_NAME,
      pulseRole: BLOODFLOW_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

bloodFlowLog("BLOODFLOW_INIT", {});

// ============================================================================
// CONSTANTS
// ============================================================================
const PULSE_PROXY_URL = "https://www.tropicpulse.bz";

// ============================================================================
// DEVICE METADATA
// ============================================================================
function getDeviceInfo() {
  const info = {
    ua: navigator.userAgent || "",
    platform: navigator.platform || "",
    language: navigator.language || ""
  };

  window.PULSE_LOG("PulseClient → getDeviceInfo()");
  bloodFlowLog("DEVICE_INFO_COLLECTED", info);

  return info;
}

// ============================================================================
// CORE FETCH WRAPPER — BLOOD FLOW
// ============================================================================
async function pulseFetch(url) {
  window.PULSE_LOG(`PulseClient → pulseFetch() called for URL: ${url}`);
  bloodFlowLog("FETCH_START", { url });

  const device = getDeviceInfo();
  const start = performance.now();

  try {
    window.PULSE_LOG("PulseClient → Attempting PULSE route…");
    bloodFlowLog("PULSE_ROUTE_ATTEMPT", { url });

    const res = await fetch(
      `${PULSE_PROXY_URL}/TPProxy?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "x-pulse-device": JSON.stringify(device)
        }
      }
    );

    const durationMs = performance.now() - start;

    if (!res.ok) {
      window.PULSE_LOG(`PulseClient → Pulse route FAILED (${res.status})`);
      bloodFlowLog("PULSE_ROUTE_FAIL", { status: res.status });
      throw new Error("Pulse route failed: " + res.status);
    }

    const contentType = res.headers.get("content-type") || "";
    const bytes = Number(res.headers.get("x-pulse-bytes") ?? "0");

    let data;
    if (contentType.includes("application/json")) data = await res.json();
    else if (contentType.startsWith("text/")) data = await res.text();
    else data = await res.arrayBuffer();

    window.PULSE_LOG(
      `PulseClient → Pulse route SUCCESS (${durationMs.toFixed(
        1
      )}ms, ${bytes} bytes)`
    );

    bloodFlowLog("PULSE_ROUTE_SUCCESS", {
      durationMs,
      bytes
    });

    return { data, meta: { route: "Pulse", bytes, durationMs } };

  } catch (err) {
    window.PULSE_LOG("PulseClient → Pulse route FAILED → Falling back to PHONE route");
    bloodFlowLog("PULSE_ROUTE_EXCEPTION", { error: String(err) });

    const fbStart = performance.now();
    const fbRes = await fetch(url);
    const fbDuration = performance.now() - fbStart;

    const contentType = fbRes.headers.get("content-type") || "";
    const bytes = Number(fbRes.headers.get("content-length") ?? "0");

    let data;
    if (contentType.includes("application/json")) data = await fbRes.json();
    else if (contentType.startsWith("text/")) data = await fbRes.text();
    else data = await fbRes.arrayBuffer();

    window.PULSE_LOG(
      `PulseClient → Phone route SUCCESS (${fbDuration.toFixed(
        1
      )}ms, ${bytes} bytes)`
    );

    bloodFlowLog("PHONE_ROUTE_SUCCESS", {
      durationMs: fbDuration,
      bytes
    });

    return { data, meta: { route: "Phone", bytes, durationMs: fbDuration } };
  }
}

// ============================================================================
// PUBLIC API — BLOOD FLOW
// ============================================================================
export const PulseClient = {
  get: pulseFetch
};
