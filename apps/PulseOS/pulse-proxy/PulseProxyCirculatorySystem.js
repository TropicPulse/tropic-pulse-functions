// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseClient.js
// LAYER: CIRCULATORY SYSTEM (Arterial Fetch Layer) — v10.4
// ============================================================================
//
// ROLE (v10.4):
//   THE CIRCULATORY SYSTEM — Arterial Fetch Layer
//   • Arterial path: accelerated PULSE proxy route
//   • Venous path: direct PHONE fallback
//   • Moves oxygenated data outward through the organism
//   • Returns deterministic { data, meta } packets
//
// CONTRACT (v10.4):
//   • No PulseBand imports
//   • No PulseNet imports
//   • No global state
//   • No side effects
//   • Pure circulatory subsystem
//
// SAFETY (v10.4):
//   • No console.*
//   • All diagnostics routed through PulseProxyBloodStream
//   • Deterministic, drift‑proof, AND‑architecture aligned
//   • No mutation of external state
//   • No routing logic beyond arterial→venous fallback
// ============================================================================

import { emitTelemetry } from "./PulseProxyBloodStream.js";


// ============================================================================
// ⭐ OS‑v10.4 CONTEXT METADATA — Circulatory Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseClient",
  layer: "CirculatorySystem",
  version: "10.4",
  identity: "PulseClientArterialLayer",

  evo: {
    driftProof: true,
    pulseEfficiencyAware: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    pulseSendAware: true,
    futureEvolutionReady: true
  }
};

const CIRCULATION_CONTEXT = {
  layer: PulseRole.layer,
  role: "CIRCULATORY_SYSTEM",
  purpose: "Arterial fetch layer + venous fallback",
  context: "Moves data outward through organism with deterministic routing",
  target: "full-os",
  version: PulseRole.version,
  selfRepairable: true,
  evo: PulseRole.evo
};


// ============================================================================
// SUBSYSTEM IDENTITY
// ============================================================================
const SUBSYSTEM = "circulation";


// ============================================================================
// DIAGNOSTICS (v10.4)
// ============================================================================
const CIRCULATION_DIAGNOSTICS_ENABLED =
  (typeof window !== "undefined" &&
    (window.PULSE_BLOODFLOW_DIAGNOSTICS === true ||
     window.PULSE_DIAGNOSTICS === true)) ||
  false;

const circulationLog = (stage, details = {}) => {
  if (!CIRCULATION_DIAGNOSTICS_ENABLED) return;

  emitTelemetry(SUBSYSTEM, stage, {
    pulseLayer: PulseRole.layer,
    pulseName: "THE CIRCULATORY SYSTEM",
    pulseRole: "Arterial Fetch Layer",
    meta: { ...CIRCULATION_CONTEXT },
    ...details
  });
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
// CORE FETCH WRAPPER — ARTERIAL FLOW (v10.4)
// ============================================================================
async function pulseFetch(url) {
  circulationLog("FETCH_START", { url });

  const device = getDeviceInfo();
  const start = performance.now();

  try {
    // ---------------------------------------------------------
    // ARTERIAL ATTEMPT — PULSE ROUTE
    // ---------------------------------------------------------
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
    // ---------------------------------------------------------
    // VENOUS FALLBACK — PHONE ROUTE
    // ---------------------------------------------------------
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
// PUBLIC API — CIRCULATORY SYSTEM v10.4
// ============================================================================
export const PulseClient = {
  get: pulseFetch,
  meta: { ...CIRCULATION_CONTEXT },
  PulseRole
};
