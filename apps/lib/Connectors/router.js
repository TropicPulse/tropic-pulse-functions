// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/router.js
// LAYER: B‑LAYER (FRONTEND INTELLIGENCE + LOGGING CONNECTOR)
//
// PURPOSE:
// • Receive logs + healing requests from PageScanner (A2).
// • Store logs in RouterMemory.
// • Dedupe repeated failures.
// • Detect drift.
// • Detect missing fields/functions/accessors/handlers.
// • Forward backend requests to endpoint.js.
// • Flush logs to Firebase via Timer.js.
// ============================================================================

import { RouterMemory } from "./RouterMemory.js";

// ------------------------------------------------------------
// ⭐ UNIVERSAL SYS‑CALL FUNCTION (A → B → C)
// ------------------------------------------------------------
export async function route(type, payload = {}) {
  logEvent("routeCall", { type, payload });

  try {
    const res = await fetch("/.netlify/functions/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })
    });

    const json = await res.json();

    logEvent("routeResponse", { type, payload, json });

    return json;

  } catch (err) {
    logEvent("routeError", { type, payload, error: String(err) });

    return {
      error: "Frontend connector failed",
      details: String(err)
    };
  }
}

// ------------------------------------------------------------
// ⭐ LOGGING ENTRY POINT (A2 → B)
// ------------------------------------------------------------
export function logEvent(eventType, data) {
  const entry = {
    eventType,
    data,
    page: window.location.pathname,
    timestamp: Date.now()
  };

  RouterMemory.push(entry);
  timer();
}

// ------------------------------------------------------------
// ⭐ HEALING ENTRY POINT (A2 → B)
// ------------------------------------------------------------
export async function heal(type, payload) {
  logEvent("healingRequest", { type, payload });
  return await route(type, payload);
}

// ============================================================================
// NO getMap / getAuth / getHook / callHelper.
// Router.js = INTELLIGENCE + LOGGING + HEALING ONLY.
// ============================================================================

