// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/router.js
// PULSE COMMUNICATION INTELLIGENCE — v7.1
// “THE WISDOM+ / COMMUNICATION INTELLIGENCE LAYER”
// ============================================================================
//
// ROLE (v7.1):
//   • Structured communication, logging, retry, healing, alerting
//   • Frontend router (B‑Layer) → Backend endpoint (C2‑Layer / BODYGUARD)
//   • AND: Can operate in offline-simulated mode with a local endpoint
//   • Internet is OPTIONAL: used only when external sync is desired
//   • ZERO timing logic on frontend
//   • ZERO scheduling, loops, or intervals
//
// CONTRACT (v7.1):
//   • Never mutate payloads
//   • Never bypass RouterMemory
//   • Never call backend with malformed structure
//   • Always log before and after syscalls
//   • Always retry once before alerting (when using network transport)
//   • Always heal RouterMemory before GateHeartbeat signal
//   • Never run timing logic on frontend
//   • Internal organism is complete; router is communication, not survival
// ============================================================================


// ============================================================================
// ARCHITECTURE MAP  [WHITE — OS‑LEVEL]
// ----------------------------------------------------------------------------
//   A   = Page (UI Shell)
//   A2  = PageScanner.js        [PROTECTOR — ERROR GUARDIAN / IMMUNE SCOUT]
//   B   = THIS FILE (router.js) [WISDOM+ — COMMUNICATION INTELLIGENCE]
//   C2  = endpoint.js           [BODYGUARD — GUARDIAN SECURITY LAYER]
//   D   = index.js              [DISPATCHER — BACKEND ROUTE DISPATCH]
//   D2  = Modular backend files [ORGANS — getHook.js, getAuth.js, etc.]
//
//   • A2 imports B (PageScanner → router.js)
//   • B calls C2 via Transport (network OR local simulated endpoint)
//   • C2 imports D (endpoint.js → index.js)
//   • D imports D2 (index.js → modular backend logic)
//
//   INVARIANT: “IMPORT AT THE TOP, COMPLETE THE CONNECTION.”
// ============================================================================


// ============================================================================
// FRONTEND IMPORTS — COMPLETE THE CONNECTION (A2 → B)  [BLUE / GOLD]
// ============================================================================
import { RouterMemory } from "./RouterMemory.js"; // [BLUE] Network memory / log buffer
import { GateHeartbeat } from "./Gate.js";        // [GOLD] Frontend → backend heartbeat signal


// ============================================================================
// CONSTANTS + DIAGNOSTICS  [BLUE]
// ============================================================================
const LAYER_ID   = "COMM-LAYER";
const LAYER_NAME = "THE WISDOM+";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE";
const LAYER_VER  = "7.1";

const WISDOM_DIAGNOSTICS_ENABLED =
  window.PULSE_WISDOM_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logWisdom = (stage, details = {}) => {
  if (!WISDOM_DIAGNOSTICS_ENABLED) return;
  log(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};

logWisdom("WISDOM_INIT", {});


// ============================================================================
// ROUTE FAILURE STATE  [BLUE]
// ============================================================================
let routeFailureCount = 0;


// ============================================================================
// ROUTER CONTEXT MAP  [BLUE]
// ============================================================================
const ROUTER_CONTEXT = {
  label: "ROUTER",
  layer: "B‑Layer",
  purpose: "Frontend → Backend Connector",
  context: "Sends structured requests to backend BODYGUARD (endpoint.js)"
};


// ============================================================================
// TRANSPORT LAYER — INTERNAL + EXTERNAL (AND, NOT OR)
// ----------------------------------------------------------------------------
//   • If window.PULSE_OFFLINE_MODE === true → use local simulated endpoint
//       - window.PulseLocalEndpoint?.handle({ type, payload })
//   • Else → use network fetch("/.netlify/functions/endpoint")
//   • Organism is the same either way; only the environment changes
// ============================================================================
const Transport = {
  async callEndpoint(type, payload) {
    const offlineMode = window.PULSE_OFFLINE_MODE === true;

    // OFFLINE-SIMULATED MODE (local endpoint)
    if (offlineMode) {
      logWisdom("TRANSPORT_OFFLINE_MODE", { type });

      if (window.PulseLocalEndpoint?.handle) {
        try {
          // ⭐ PASS THROUGH EXACTLY
          const result = await window.PulseLocalEndpoint.handle({ type, payload });
          logWisdom("TRANSPORT_OFFLINE_RESPONSE", { type });
          return result;
        } catch (err) {
          logWisdom("TRANSPORT_OFFLINE_ERROR", {
            type,
            message: String(err)
          });
          return { error: "Offline local endpoint failed", details: String(err) };
        }
      }

      logWisdom("TRANSPORT_OFFLINE_NO_HANDLER", { type });
      return { error: "Offline mode: no local endpoint handler registered" };
    }

    // ONLINE MODE (network fetch)
    logWisdom("TRANSPORT_ONLINE_CALL", { type });

    // ⭐ PASS THROUGH EXACTLY — NO MUTATION
    const res = await fetch("/.netlify/functions/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })  // ⭐ EXACT PASS-THROUGH
    });

    const json = await res.json();
    logWisdom("TRANSPORT_ONLINE_RESPONSE", { type });
    return json;
  },

  async callCheckRouterMemory(logs) {
    const offlineMode = window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logWisdom("HEAL_SKIP_OFFLINE", { count: logs.length });
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
      logWisdom("ALERT_SKIP_OFFLINE", { error, type });
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
// ⭐ ROUTER MEMORY HEALING (pre‑flush)  [BLUE → RED — GOLD]
// ============================================================================
async function healRouterMemoryIfNeeded() {
  const logs = RouterMemory.getAll();
  if (!logs || logs.length === 0) {
    logWisdom("HEAL_SKIP_EMPTY");
    return;
  }

  logWisdom("HEAL_REQUEST", { count: logs.length });

  try {
    const data = await Transport.callCheckRouterMemory(logs);

    if (data && Array.isArray(data.logs)) {
      RouterMemory._logs = data.logs;
      logWisdom("HEAL_APPLIED", { count: data.logs.length });
    } else if (data === null) {
      // Offline mode: no backend healer, but organism is still safe.
      logWisdom("HEAL_OFFLINE_NO_REMOTE", {});
    } else {
      logWisdom("HEAL_DEGRADED");
    }
  } catch (err) {
    logWisdom("HEAL_ERROR", { message: String(err) });
  }
}


// ============================================================================
// ⭐ ROUTE‑DOWN ALERT TRIGGER  [BLUE → RED — GOLD]
// ============================================================================
async function triggerRouteDownAlert(error, type) {
  logWisdom("ALERT_TRIGGER", { error, type });

  try {
    await Transport.callRouteDownAlert(error, type);
    logWisdom("ALERT_SENT", { type });
  } catch (err) {
    logWisdom("ALERT_ERROR", { message: String(err) });
  }
}


// ============================================================================
// ⭐ UNIVERSAL SYS‑CALL FUNCTION  [BLUE → RED → GOLD] — Router v7.1
// ============================================================================

// Prevent recursive routing storms
let routingInProgress = false;

// Simple signature generator (PageScanner-inspired)
function makeErrorSignature(err) {
  const msg = String(err);
  const stack = err?.stack || "";
  const top = stack.split("\n")[1] || "NO_FRAME";
  return msg + "::" + top.trim();
}

export async function route(type, payload = {}) {
  // Prevent recursive route → error → route → error loops
  if (routingInProgress) {
    return {
      error: "routeRecursionDetected",
      details: "Routing attempted while routing already in progress"
    };
  }

  routingInProgress = true;

  logWisdom("ROUTE_CALL", { type });

  // ⭐ 1. Log the route call (this also heals memory once)
  await logEvent("routeCall", { type, payload, ...ROUTER_CONTEXT });

  // ⭐ 2. CRITICAL — Heal memory AGAIN before routing
  // This is the missing link that restores the chain.
  await healRouterMemoryIfNeeded();

  try {
    // ⭐ 3. Now call backend with clean memory + clean context
    const json = await Transport.callEndpoint(type, payload);

    routeFailureCount = 0;
    routingInProgress = false;

    logWisdom("ROUTE_RESPONSE", { type });
    logEvent("routeResponse", { type, payload, json, ...ROUTER_CONTEXT });

    return json;

  } catch (err) {
    const msg = String(err);
    const signature = makeErrorSignature(err);

    routeFailureCount++;

    logWisdom("ROUTE_ERROR", {
      type,
      message: msg,
      signature,
      count: routeFailureCount
    });

    logEvent("routeError", {
      type,
      payload,
      error: msg,
      signature,
      ...ROUTER_CONTEXT
    });

    // ------------------------------------------------------------------------
    // ⭐ v7.1 — PageScanner-inspired classification
    // ------------------------------------------------------------------------

    // 1) Import / module conflict
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      routingInProgress = false;
      return { error: "importConflict", details: msg, signature };
    }

    // 2) Env mismatch
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

    // 3) Recursion / thrash detection (backend-level)
    if (msg.includes("Maximum call stack size exceeded")) {
      routingInProgress = false;
      return { error: "routeRecursionLoop", details: msg, signature };
    }

    // ------------------------------------------------------------------------
    // Retry logic (unchanged)
    // ------------------------------------------------------------------------
    const offlineMode = window.PULSE_OFFLINE_MODE === true;

    if (!offlineMode && routeFailureCount === 1) {
      logWisdom("ROUTE_RETRY", { type });

      try {
        const retryJson = await Transport.callEndpoint(type, payload);

        routeFailureCount = 0;
        routingInProgress = false;

        logWisdom("ROUTE_RETRY_SUCCESS", { type });
        logEvent("routeRetrySuccess", {
          type,
          payload,
          retryJson,
          signature,
          ...ROUTER_CONTEXT
        });

        return retryJson;

      } catch (retryErr) {
        logWisdom("ROUTE_RETRY_FAIL", {
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
// ⭐ LOGGING ENTRY POINT  [BLUE → RED — GOLD]
// ============================================================================
export async function logEvent(eventType, data) {
  logWisdom("LOG_EVENT", { eventType });

  RouterMemory.push({
    eventType,
    data,
    page: window.location.pathname,
    timestamp: Date.now()
  });

  logWisdom("LOG_PUSHED", { eventType });

  await healRouterMemoryIfNeeded();

  GateHeartbeat(); // [GOLD] frontend → backend heartbeat signal (NOT a timer)
  logWisdom("GATE_HEARTBEAT_SIGNAL_SENT");
}


// ============================================================================
// ⭐ HEALING ENTRY POINT  [BLUE → RED — GOLD]
// ============================================================================
export async function heal(type, payload) {
  logWisdom("HEAL_CALL", { type });

  logEvent("healingRequest", { type, payload, ...ROUTER_CONTEXT });

  return await route(type, payload);
}


// ============================================================================
// END OF FILE — THE WISDOM+ / COMMUNICATION INTELLIGENCE LAYER  [PURPLE]
// ============================================================================
