// ============================================================================
// CENTRAL NERVOUS SYSTEM — PulseOSCNSNervousSystem — v11.0
// “THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN”
// ============================================================================
//
// ROLE IN THE ORGANISM (v11.0):
// -----------------------------
// • B‑Layer CNS: frontend ↔ backend communication organ.
// • Dual‑band: OFFLINE (local endpoints) + ONLINE (proxy spine) as two bands.
// • Sends structured requests to backend via Proxy Spine gateway.
// • Records route events into RouterMemory for healing + drift analysis.
// • Triggers router healing and route‑down alerts when degradation appears.
// • Respects offline mode and local endpoints (local‑first, network as injection).
//
// SAFETY CONTRACT (v11.0):
// ------------------------
// • No dynamic eval.
// • No direct filesystem access.
// • Network only via well‑defined proxy endpoints.
// • Deterministic routing behavior (no random branching).
// • RouterMemory is the single source of CNS event history.
// • CNS never hard‑kills the organism; it reports, retries, and alerts.
// • Guarded access to globals (window, fetch) for environment‑agnostic behavior.
// • Dual‑band is MODE ONLY (offline/online), not two codepaths of logic mutation.
// ============================================================================


// ============================================================================
// ORGAN IMPORTS — COMPLETE THE CONNECTION (Membranes → CNS)
// ============================================================================
import { PulseOSShortTermMemory } from "../PULSE-OS/PulseOSShortTermMemory.js";


// ============================================================================
// ORGAN IDENTITY — v11.0 CNS COMMUNICATION ORGAN
// ============================================================================
export const PulseRole = {
  type: "NervousSystem",
  subsystem: "CNS",
  layer: "B-Layer",
  version: "11.0",
  identity: "PulseOSCNSNervousSystem",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,

    // Dual‑band: symbolic (routes, types) + binary (payload bytes) as modes, not mutation
    dualBand: true,
    binaryAware: true,
    zeroFilesystem: true,

    // Contracts — v11 organism‑wide
    routingContract: "PulseRouter-v11.0",
    proxyCompatibility: "PulseProxySpine-v11.0",
    sendCompatibility: "PulseSendSystem-v11.0",

    // Continuance / loop‑theory awareness
    loopTheoryAware: true,
    continuanceAware: true
  }
};


// ============================================================================
// CNS CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "CNS-LAYER";
const LAYER_NAME = "THE CENTRAL NERVOUS SYSTEM";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE ORGAN";
const LAYER_VER  = "11.0";

const hasWindow = typeof window !== "undefined";

const CNS_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_CNS_DIAGNOSTICS === "true" ||
    window.PULSE_DIAGNOSTICS === "true");

const logCNS = (stage, details = {}) => {
  if (!CNS_DIAGNOSTICS_ENABLED) return;
  if (typeof log !== "function") return;

  log(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};

logCNS("CNS_INIT");


// ============================================================================
// ROUTE FAILURE STATE
// ============================================================================
let routeFailureCount = 0;


// ============================================================================
// CNS CONTEXT MAP — v11 dual‑band aware
// ============================================================================
const CNS_CONTEXT = {
  label: "CNS",
  layer: "B‑Layer",
  purpose: "Frontend → Backend Communication Organ",
  context: "Sends structured requests to backend via Proxy Spine gateway",
  version: LAYER_VER,
  band: "dual", // offline band + online band
  modes: {
    offline: "local-endpoint",
    online: "proxy-spine"
  }
};


// ============================================================================
// TRANSPORT LAYER — OFFLINE + ONLINE (GUARDED GLOBALS, DUAL‑BAND)
// ============================================================================
// NOTE: Dual‑band here is MODE SELECTION ONLY (offline vs online).
//       Logic remains deterministic; no random branching, no mutation of contracts.
const Transport = {
  async callEndpoint(type, payload) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    // OFFLINE BAND — local‑first, no network
    if (offlineMode) {
      logCNS("TRANSPORT_OFFLINE_MODE", { type, band: "offline" });

      const localEndpoint =
        hasWindow && window.PulseLocalEndpoint &&
        typeof window.PulseLocalEndpoint.handle === "function"
          ? window.PulseLocalEndpoint
          : null;

      if (localEndpoint) {
        try {
          const result = await localEndpoint.handle({ type, payload, CNS_CONTEXT });
          logCNS("TRANSPORT_OFFLINE_RESPONSE", { type, band: "offline" });
          return result;
        } catch (err) {
          logCNS("TRANSPORT_OFFLINE_ERROR", {
            type,
            band: "offline",
            message: String(err)
          });
          return { error: "Offline local endpoint failed", details: String(err) };
        }
      }

      logCNS("TRANSPORT_OFFLINE_NO_HANDLER", { type, band: "offline" });
      return { error: "Offline mode: no local endpoint handler registered" };
    }

    // ONLINE BAND — proxy spine only
    logCNS("TRANSPORT_ONLINE_CALL", { type, band: "online" });

    if (typeof fetch !== "function") {
      logCNS("TRANSPORT_ONLINE_NO_FETCH", { type, band: "online" });
      return { error: "Fetch API not available in this environment" };
    }

    const res = await fetch("/pulse-proxy/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload, context: CNS_CONTEXT })
    });

    const json = await res.json();
    logCNS("TRANSPORT_ONLINE_RESPONSE", { type, band: "online" });
    return json;
  },

  async callCheckRouterMemory(logs) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logCNS("HEAL_SKIP_OFFLINE", { count: logs.length, band: "offline" });
      return null;
    }

    if (typeof fetch !== "function") {
      logCNS("HEAL_NO_FETCH", { count: logs.length, band: "online" });
      return null;
    }

    const res = await fetch("/pulse-proxy/CheckRouterMemory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs, context: CNS_CONTEXT })
    });

    return await res.json();
  },

  async callRouteDownAlert(error, type) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logCNS("ALERT_SKIP_OFFLINE", { error, type, band: "offline" });
      return;
    }

    if (typeof fetch !== "function") {
      logCNS("ALERT_NO_FETCH", { error, type, band: "online" });
      return;
    }

    await fetch("/pulse-router/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error, type, context: CNS_CONTEXT })
    });
  }
};

// (You can wire Transport + PulseOSShortTermMemory into the rest of the CNS organ
// in part 2 without changing this contract.)
// ============================================================================
// ROUTER MEMORY HEALING — v11 Dual‑Band Aware
// ============================================================================
async function healRouterMemoryIfNeeded() {
  if (!RouterMemory || typeof RouterMemory.getAll !== "function") {
    logCNS("HEAL_SKIP_NO_ROUTER_MEMORY");
    return;
  }

  const logs = RouterMemory.getAll();
  if (!logs || logs.length === 0) {
    logCNS("HEAL_SKIP_EMPTY");
    return;
  }

  logCNS("HEAL_REQUEST", { count: logs.length });

  try {
    const data = await Transport.callCheckRouterMemory(logs);

    if (data && Array.isArray(data.logs)) {
      if (typeof RouterMemory.replaceAll === "function") {
        RouterMemory.replaceAll(data.logs);
      } else {
        RouterMemory._logs = data.logs;
      }
      logCNS("HEAL_APPLIED", { count: data.logs.length });
    } else if (data === null) {
      logCNS("HEAL_OFFLINE_NO_REMOTE");
    } else {
      logCNS("HEAL_DEGRADED");
    }
  } catch (err) {
    logCNS("HEAL_ERROR", { message: String(err) });
  }
}


// ============================================================================
// ROUTE‑DOWN ALERT — v11 Continuance‑First
// ============================================================================
async function triggerRouteDownAlert(error, type, band = "symbolic") {
  logCNS("ALERT_TRIGGER", { error, type, band });

  try {
    await Transport.callRouteDownAlert(error, type);
    logCNS("ALERT_SENT", { type, band });
  } catch (err) {
    logCNS("ALERT_ERROR", { message: String(err), band });
  }
}


// ============================================================================
// UNIVERSAL SYS‑CALL FUNCTION — CNS v11 Dual‑Band
// ============================================================================
const ROUTE_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

const routingInProgressBands = new Set();

function resolveBandFromPayload(payload) {
  const band = payload && typeof payload.__band === "string"
    ? payload.__band.toLowerCase()
    : ROUTE_BANDS.SYMBOLIC;

  return band === ROUTE_BANDS.BINARY ? ROUTE_BANDS.BINARY : ROUTE_BANDS.SYMBOLIC;
}

function makeErrorSignature(err) {
  const msg = String(err);
  const stack = err?.stack || "";
  const top = stack.split("\n")[1] || "NO_FRAME";
  return msg + "::" + top.trim();
}

export async function route(type, payload = {}) {
  const band = resolveBandFromPayload(payload);

  if (routingInProgressBands.has(band)) {
    return {
      error: "routeRecursionDetected",
      details: "Routing attempted while routing already in progress for this band",
      band
    };
  }

  routingInProgressBands.add(band);

  logCNS("ROUTE_CALL", { type, band });

  await logEvent("routeCall", { type, payload, band, ...CNS_CONTEXT });
  await healRouterMemoryIfNeeded();

  try {
    const json = await Transport.callEndpoint(type, payload);

    routeFailureCount = 0;
    routingInProgressBands.delete(band);

    logCNS("ROUTE_RESPONSE", { type, band });
    logEvent("routeResponse", { type, payload, json, band, ...CNS_CONTEXT });

    return json;

  } catch (err) {
    const msg = String(err);
    const signature = makeErrorSignature(err);

    routeFailureCount++;

    logCNS("ROUTE_ERROR", {
      type,
      message: msg,
      signature,
      count: routeFailureCount,
      band
    });

    logEvent("routeError", {
      type,
      payload,
      error: msg,
      signature,
      band,
      ...CNS_CONTEXT
    });

    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      routingInProgressBands.delete(band);
      return { error: "importConflict", details: msg, signature, band };
    }

    if (msg.includes("process is not defined")) {
      if (RouterMemory && typeof RouterMemory.push === "function") {
        RouterMemory.push({
          eventType: "frontendEnvMismatch",
          repairHint: "Replace process.env.* with window.PULSE_*",
          timestamp: ++routerEventSeq,
          signature,
          band
        });
      }
      routingInProgressBands.delete(band);
      return { error: "frontendEnvMismatch", details: msg, signature, band };
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      routingInProgressBands.delete(band);
      return { error: "routeRecursionLoop", details: msg, signature, band };
    }

    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (!offlineMode && routeFailureCount === 1) {
      logCNS("ROUTE_RETRY", { type, band });

      try {
        const retryJson = await Transport.callEndpoint(type, payload);

        routeFailureCount = 0;
        routingInProgressBands.delete(band);

        logCNS("ROUTE_RETRY_SUCCESS", { type, band });
        logEvent("routeRetrySuccess", {
          type,
          payload,
          retryJson,
          signature,
          band,
          ...CNS_CONTEXT
        });

        return retryJson;

      } catch (retryErr) {
        logCNS("ROUTE_RETRY_FAIL", {
          type,
          message: String(retryErr),
          signature,
          band
        });

        await triggerRouteDownAlert(String(retryErr), type, band);
        routeFailureCount = 0;
      }
    }

    routingInProgressBands.delete(band);
    return {
      error: "Frontend connector failed",
      details: msg,
      signature,
      band
    };
  }
}


// ============================================================================
// LOGGING ENTRY POINT — v11 Dual‑Band
// ============================================================================
let routerEventSeq = 0;

export async function logEvent(eventType, data) {
  const band = resolveBandFromPayload(data || {});
  logCNS("LOG_EVENT", { eventType, band });

  const page =
    hasWindow && window.location
      ? window.location.pathname
      : null;

  if (RouterMemory && typeof RouterMemory.push === "function") {
    RouterMemory.push({
      eventType,
      data,
      page,
      band,
      timestamp: ++routerEventSeq
    });
  }

  logCNS("LOG_PUSHED", { eventType, band });

  await healRouterMemoryIfNeeded();

  if (typeof GateHeartbeat === "function") {
    GateHeartbeat();
    logCNS("GATE_HEARTBEAT_SIGNAL_SENT", { band });
  }
}


// ============================================================================
// HEALING ENTRY POINT — v11 Dual‑Band
// ============================================================================
export async function heal(type, payload) {
  const band = resolveBandFromPayload(payload || {});
  logCNS("HEAL_CALL", { type, band });

  logEvent("healingRequest", { type, payload, band, ...CNS_CONTEXT });

  return await route(type, payload);
}

// ============================================================================
// END OF FILE — THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN
// ============================================================================
