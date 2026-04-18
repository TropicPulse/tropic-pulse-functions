// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/router.js
// PULSE COMMUNICATION INTELLIGENCE — v6.3
// “THE WISDOM / COMMUNICATION INTELLIGENCE LAYER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE WISDOM / COMMUNICATION INTELLIGENCE LAYER”
// - ROLE: Structured communication + logging + healing intelligence
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (DOM-visible inspector compatible)
// - Added explicit STAGE markers for route/log/heal
// - ZERO logic changes to routing or logging behavior
//
// ============================================================================
// PERSONALITY + ROLE — “THE WISDOM”
// ----------------------------------------------------------------------------
// router.js is the **WISDOM** of the frontend.
// It is the **COMMUNICATION INTELLIGENCE LAYER** — the subsystem that knows
// how to speak to the backend, how to structure requests, how to log events,
// and how to initiate healing.
//
//   • Sends structured syscalls to the backend
//   • Logs events into RouterMemory (The Network)
//   • Provides healing requests
//   • Maintains communication order + structure
//
// This is the OS’s procedural wisdom — the intelligence that keeps
// communication coherent and self-healing.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A structured syscall generator
//   ✔ A logging + healing connector
//   ✔ A communication intelligence layer
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a backend router
//   ✘ NOT a business logic layer
//   ✘ NOT a security layer
//   ✘ NOT a database writer
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Never mutate payloads
//   • Never bypass RouterMemory
//   • Never call backend with malformed structure
//   • Always log before and after syscalls
//
// ============================================================================

import { RouterMemory } from "./RouterMemory.js";

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "COMM-LAYER";
const LAYER_NAME = "THE WISDOM";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE";

const WISDOM_DIAGNOSTICS_ENABLED =
  process.env.PULSE_WISDOM_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logWisdom = (stage, details = {}) => {
  if (!WISDOM_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};

// ============================================================================
// CONTEXT MAP
// ============================================================================
const ROUTER_CONTEXT = {
  label: "ROUTER",
  layer: "B‑Layer",
  purpose: "Frontend → Backend Connector",
  context: "Sends structured requests to backend router"
};

// ============================================================================
// ⭐ UNIVERSAL SYS‑CALL FUNCTION (A → B → C)
// ============================================================================
export async function route(type, payload = {}) {
  logWisdom("ROUTE_CALL", { type });

  logEvent("routeCall", {
    type,
    payload,
    ...ROUTER_CONTEXT
  });

  try {
    const res = await fetch("/.netlify/functions/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })
    });

    const json = await res.json();

    logWisdom("ROUTE_RESPONSE", { type });

    logEvent("routeResponse", {
      type,
      payload,
      json,
      ...ROUTER_CONTEXT
    });

    return json;

  } catch (err) {
    logWisdom("ROUTE_ERROR", { type, message: String(err) });

    logEvent("routeError", {
      type,
      payload,
      error: String(err),
      ...ROUTER_CONTEXT
    });

    return {
      error: "Frontend connector failed",
      details: String(err)
    };
  }
}

// ============================================================================
// ⭐ LOGGING ENTRY POINT (A2 → B)
// ============================================================================
export function logEvent(eventType, data) {
  logWisdom("LOG_EVENT", { eventType });

  const entry = {
    eventType,
    data,
    page: window.location.pathname,
    timestamp: Date.now()
  };

  RouterMemory.push(entry);

  logWisdom("LOG_PUSHED", { eventType });

  timer();
  logWisdom("TIMER_TRIGGERED", {});
}

// ============================================================================
// ⭐ HEALING ENTRY POINT (A2 → B)
// ============================================================================
export async function heal(type, payload) {
  logWisdom("HEAL_CALL", { type });

  logEvent("healingRequest", {
    type,
    payload,
    ...ROUTER_CONTEXT
  });

  return await route(type, payload);
}
