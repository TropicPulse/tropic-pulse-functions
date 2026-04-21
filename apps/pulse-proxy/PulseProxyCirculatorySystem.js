// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseClient.js
// LAYER: CIRCULATORY SYSTEM (Arterial Fetch Layer) — v7.7
// ============================================================================
//
// ROLE (v7.7):
//   THE CIRCULATORY SYSTEM — Arterial Fetch Layer
//   • Moves data outward through the organism
//   • Attempts accelerated PULSE route first (arterial path)
//   • Falls back to PHONE route if needed (venous path)
//   • Returns clean { data, meta } packets (oxygenated payloads)
//
// CONTRACT (v7.7):
//   • No PulseBand imports
//   • No PulseNet imports
//   • No global state
//   • No side effects
//   • Pure circulatory subsystem
//
// SAFETY (v7.7):
//   • No console.*
//   • All logs routed through PulseLogger
//   • All metrics routed through PulseTelemetry
//   • Deterministic, drift‑proof, AND‑architecture aligned
// ============================================================================

import { log, warn, error } from "./PulseProxyVitalsLogger.js";
import { emitTelemetry } from "./PulseProxyBloodStream.js";

// ============================================================================
// ⭐ OS‑v7 CONTEXT METADATA — Circulatory Identity
// ============================================================================
const CIRCULATION_CONTEXT = {
  layer: "PulseClient",
  role: "CIRCULATORY_SYSTEM",
  purpose: "Arterial fetch layer + venous fallback",
  context: "Moves data outward through organism with deterministic routing",
  target: "full-os",
  version: "7.7",
  selfRepairable: true,
  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true
  }
};

// ============================================================================
// SUBSYSTEM IDENTITY
// ============================================================================
const SUBSYSTEM = "circulation";

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const CIRCULATION_LAYER_ID = "CIRCULATORY-LAYER";
const CIRCULATION_LAYER_NAME = "THE CIRCULATORY SYSTEM";
const CIRCULATION_LAYER_ROLE = "Arterial Fetch Layer";

const CIRCULATION_DIAGNOSTICS_ENABLED =
  (typeof window !== "undefined" &&
    (window.PULSE_BLOODFLOW_DIAGNOSTICS === true ||
     window.PULSE_DIAGNOSTICS === true)) ||
  false;

const circulationLog = (stage, details = {}) => {
  if (!CIRCULATION_DIAGNOSTICS_ENABLED) return;

  log(SUBSYSTEM, stage, {
    pulseLayer: CIRCULATION_LAYER_ID,
    pulseName: CIRCULATION_LAYER_NAME,
    pulseRole: CIRCULATION_LAYER_ROLE,
    meta: { ...CIRCULATION_CONTEXT },
    ...details
  });

  emitTelemetry(SUBSYSTEM, stage, details);
};

circulationLog("CIRCULATION_INIT");

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

  circulationLog("DEVICE_INFO_COLLECTED", info);
  return info;
}

// ============================================================================
// CORE FETCH WRAPPER — ARTERIAL FLOW (v7.7)
// ============================================================================
async function pulseFetch(url) {
  circulationLog("FETCH_START", { url });

  const device = getDeviceInfo();
  const start = performance.now();

  try {
    circulationLog("ARTERIAL_ATTEMPT", { url });

    const res = await fetch(
      `${PULSE_PROXY_URL}/TPProxy?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "x-pulse-device": JSON.stringify(device),
          "x-pulse-context": JSON.stringify(CIRCULATION_CONTEXT)
        }
      }
    );

    const durationMs = performance.now() - start;

    if (!res.ok) {
      circulationLog("ARTERIAL_FAIL", { status: res.status });
      throw new Error("Pulse route failed: " + res.status);
    }

    const contentType = res.headers.get("content-type") || "";
    const bytes = Number(res.headers.get("x-pulse-bytes") ?? "0");

    let data;
    if (contentType.includes("application/json")) data = await res.json();
    else if (contentType.startsWith("text/")) data = await res.text();
    else data = await res.arrayBuffer();

    circulationLog("ARTERIAL_SUCCESS", { durationMs, bytes });

    return {
      data,
      meta: {
        route: "Pulse",
        bytes,
        durationMs,
        context: CIRCULATION_CONTEXT
      }
    };

  } catch (err) {
    circulationLog("ARTERIAL_EXCEPTION", { error: String(err) });

    const fbStart = performance.now();
    const fbRes = await fetch(url);
    const fbDuration = performance.now() - fbStart;

    const contentType = fbRes.headers.get("content-type") || "";
    const bytes = Number(fbRes.headers.get("content-length") ?? "0");

    let data;
    if (contentType.includes("application/json")) data = await fbRes.json();
    else if (contentType.startsWith("text/")) data = await fbRes.text();
    else data = await fbRes.arrayBuffer();

    circulationLog("VENOUS_SUCCESS", { durationMs: fbDuration, bytes });

    return {
      data,
      meta: {
        route: "Phone",
        bytes,
        durationMs: fbDuration,
        context: CIRCULATION_CONTEXT
      }
    };
  }
}

// ============================================================================
// PUBLIC API — CIRCULATORY SYSTEM v7.7
// ============================================================================
export const PulseClient = {
  get: pulseFetch,
  meta: { ...CIRCULATION_CONTEXT }
};
