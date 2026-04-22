// ============================================================================
// FILE: /apps/PulseOS/Organs/NervousSystem/PulseOSNervousSystem.js
// PULSE OS — v9.2
// “THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN”
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Central Nervous System (CNS)
//   • Layer: B‑Layer (Core Communication Intelligence)
//   • Biological Analog: Brainstem + Spinal Relay
//   • System Role: Structured signaling, healing coordination, memory integration
//
// PURPOSE:
//   ✔ Receive structured signals from membranes + reflex layers
//   ✔ Forward signals to backend organs via Proxy Spine (endpoint gateway)
//   ✔ Integrate with Short‑Term Memory (RouterMemory)
//   ✔ Integrate with Survival Instincts / diagnostics organs
//   ✔ Integrate with Heartbeat (GateHeartbeat)
//   ✔ Provide retry + alert logic (CNS‑level resilience)
//   ✔ Operate identically offline + online (environment‑agnostic)
//
// SAFETY CONTRACT (v9.2):
//   • Never mutate payloads
//   • Never bypass RouterMemory
//   • Never call backend with malformed structure
//   • Always log before and after syscalls
//   • Always retry once before alerting (when online)
//   • Always heal RouterMemory before GateHeartbeat
//   • Never run timing logic on frontend
//   • Never break offline mode
// ============================================================================


// ============================================================================
// ORGAN IMPORTS — COMPLETE THE CONNECTION (Membranes → CNS)
// ============================================================================
import { RouterMemory } from "../PULSE-OS/PulseOSShortTermMemory.js";
import { GateHeartbeat } from "../PULSE-OS/PulseOSCNSNervousSystem.js";


// ============================================================================
// CNS CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "CNS-LAYER";
const LAYER_NAME = "THE CENTRAL NERVOUS SYSTEM";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE ORGAN";
const LAYER_VER  = "9.2";

const CNS_DIAGNOSTICS_ENABLED =
  window.PULSE_CNS_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logCNS = (stage, details = {}) => {
  if (!CNS_DIAGNOSTICS_ENABLED) return;
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
// CNS CONTEXT MAP
// ============================================================================
const CNS_CONTEXT = {
  label: "CNS",
  layer: "B‑Layer",
  purpose: "Frontend → Backend Communication Organ",
  context: "Sends structured requests to backend via Proxy Spine gateway",
  version: "9.2"
};


// ============================================================================
// TRANSPORT LAYER — OFFLINE + ONLINE
// ============================================================================
const Transport = {
  async callEndpoint(type, payload) {
    const offlineMode = window.PULSE_OFFLINE_MODE === true;

    // OFFLINE MODE
    if (offlineMode) {
      logCNS("TRANSPORT_OFFLINE_MODE", { type });

      if (window.PulseLocalEndpoint?.handle) {
        try {
          const result = await window.PulseLocalEndpoint.handle({ type, payload });
          logCNS("TRANSPORT_OFFLINE_RESPONSE", { type });
          return result;
        } catch (err) {
          logCNS("TRANSPORT_OFFLINE_ERROR", { type, message: String(err) });
          return { error: "Offline local endpoint failed", details: String(err) };
        }
      }

      logCNS("TRANSPORT_OFFLINE_NO_HANDLER", { type });
      return { error: "Offline mode: no local endpoint handler registered" };
    }

    // ONLINE MODE
    logCNS("TRANSPORT_ONLINE_CALL", { type });

    const res = await fetch("/.netlify/functions/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })
    });

    const json = await res.json();
    logCNS("TRANSPORT_ONLINE_RESPONSE", { type });
    return json;
  },

  async callCheckRouterMemory(logs) {
    const offlineMode = window.PULSE_OFFLINE_MODE === true;
    if (offlineMode) {
      logCNS("HEAL_SKIP_OFFLINE", { count: logs.length });
      return null;
    }

    const res = await fetch("/.netlify/functions/CheckRouterMemory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs })
    });

    return await res.json();
  },

  async callRouteDownAlert(error, type) {
    const offlineMode = window.PULSE_OFFLINE_MODE === true;
    if (offlineMode) {
      logCNS("ALERT_SKIP_OFFLINE", { error, type });
      return;
    }

    await fetch("/.netlify/functions/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error, type })
    });
  }
};


// ============================================================================
// ROUTER MEMORY HEALING
// ============================================================================
async function healRouterMemoryIfNeeded() {
  const logs = RouterMemory.getAll();
  if (!logs || logs.length === 0) {
    logCNS("HEAL_SKIP_EMPTY");
    return;
  }

  logCNS("HEAL_REQUEST", { count: logs.length });

  try {
    const data = await Transport.callCheckRouterMemory(logs);

    if (data && Array.isArray(data.logs)) {
      RouterMemory._logs = data.logs; // legacy behavior preserved
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
// ROUTE‑DOWN ALERT
// ============================================================================
async function triggerRouteDownAlert(error, type) {
  logCNS("ALERT_TRIGGER", { error, type });

  try {
    await Transport.callRouteDownAlert(error, type);
    logCNS("ALERT_SENT", { type });
  } catch (err) {
    logCNS("ALERT_ERROR", { message: String(err) });
  }
}


// ============================================================================
// UNIVERSAL SYS‑CALL FUNCTION — CNS v9.2
// ============================================================================
let routingInProgress = false;

function makeErrorSignature(err) {
  const msg = String(err);
  const stack = err?.stack || "";
  const top = stack.split("\n")[1] || "NO_FRAME";
  return msg + "::" + top.trim();
}

export async function route(type, payload = {}) {
  if (routingInProgress) {
    return {
      error: "routeRecursionDetected",
      details: "Routing attempted while routing already in progress"
    };
  }

  routingInProgress = true;

  logCNS("ROUTE_CALL", { type });

  await logEvent("routeCall", { type, payload, ...CNS_CONTEXT });
  await healRouterMemoryIfNeeded();

  try {
    const json = await Transport.callEndpoint(type, payload);

    routeFailureCount = 0;
    routingInProgress = false;

    logCNS("ROUTE_RESPONSE", { type });
    logEvent("routeResponse", { type, payload, json, ...CNS_CONTEXT });

    return json;

  } catch (err) {
    const msg = String(err);
    const signature = makeErrorSignature(err);

    routeFailureCount++;

    logCNS("ROUTE_ERROR", { type, message: msg, signature, count: routeFailureCount });

    logEvent("routeError", {
      type,
      payload,
      error: msg,
      signature,
      ...CNS_CONTEXT
    });

    // Import conflict
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      routingInProgress = false;
      return { error: "importConflict", details: msg, signature };
    }

    // Env mismatch
    if (msg.includes("process is not defined")) {
      RouterMemory.push({
        eventType: "frontendEnvMismatch",
        repairHint: "Replace process.env.* with window.PULSE_*",
        timestamp: Date.now(),
        signature
      });
      routingInProgress = false;
      return { error: "frontendEnvMismatch", details: msg, signature };
    }

    // Recursion
    if (msg.includes("Maximum call stack size exceeded")) {
      routingInProgress = false;
      return { error: "routeRecursionLoop", details: msg, signature };
    }

    // Retry logic
    const offlineMode = window.PULSE_OFFLINE_MODE === true;

    if (!offlineMode && routeFailureCount === 1) {
      logCNS("ROUTE_RETRY", { type });

      try {
        const retryJson = await Transport.callEndpoint(type, payload);

        routeFailureCount = 0;
        routingInProgress = false;

        logCNS("ROUTE_RETRY_SUCCESS", { type });
        logEvent("routeRetrySuccess", {
          type,
          payload,
          retryJson,
          signature,
          ...CNS_CONTEXT
        });

        return retryJson;

      } catch (retryErr) {
        logCNS("ROUTE_RETRY_FAIL", {
          type,
          message: String(retryErr),
          signature
        });

        await triggerRouteDownAlert(String(retryErr), type);
        routeFailureCount = 0;
      }
    }

    routingInProgress = false;
    return { error: "Frontend connector failed", details: msg, signature };
  }
}


// ============================================================================
// LOGGING ENTRY POINT
// ============================================================================
export async function logEvent(eventType, data) {
  logCNS("LOG_EVENT", { eventType });

  RouterMemory.push({
    eventType,
    data,
    page: window.location.pathname,
    timestamp: Date.now()
  });

  logCNS("LOG_PUSHED", { eventType });

  await healRouterMemoryIfNeeded();

  GateHeartbeat();
  logCNS("GATE_HEARTBEAT_SIGNAL_SENT");
}


// ============================================================================
// HEALING ENTRY POINT
// ============================================================================
export async function heal(type, payload) {
  logCNS("HEAL_CALL", { type });

  logEvent("healingRequest", { type, payload, ...CNS_CONTEXT });

  return await route(type, payload);
}


// ============================================================================
// END OF FILE — THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN
// ============================================================================
