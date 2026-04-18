// ============================================================================
// FILE: /apps/netlify/functions/endpoint.js
// PULSE BACKEND ENDPOINT — VERSION 6.3
// “THE BODYGUARD / GUARDIAN SECURITY LAYER”
// ============================================================================
//
// PAGE INDEX (v6.3 Source of Truth)
// ---------------------------------
// ROLE:
//   This file is the **BODYGUARD** of the backend — the Guardian Security Layer.
//   It stands between the outside world and all backend logic.
//
//   • Intercepts every request
//   • Validates intent (type)
//   • Routes to modular handlers
//   • Falls back to legacy handlers
//   • Reports missing handlers for healing
//
//   Nothing touches backend logic without going through this guard.
//
// WHAT THIS FILE *IS*:
//   • The kernel dispatcher for all backend calls
//   • A deterministic, fail‑open routing layer
//   • A security gate that protects backend logic from invalid calls
//
// WHAT THIS FILE *IS NOT*:
//   • NOT business logic
//   • NOT a renderer
//   • NOT a GPU subsystem
//   • NOT a persistence layer
//
// SAFETY CONTRACT (v6.3):
//   • Fail‑open: missing handlers → healing path
//   • No randomness
//   • No timestamps
//   • No external side effects beyond logging
//   • No mutation of payload or event
//   • No new imports without architectural approval
//
// STRUCTURE RULES:
//   • Modular handlers take priority
//   • Legacy index.js is fallback only
//   • Unknown handlers must return healing metadata
//
// VERSION TAG:
//   version: 6.3
//
// ============================================================================
// ⭐ v6.3 COMMENT LOG
// ---------------------------------------------------------------------------
// • Added full v6.3 PAGE INDEX
// • Added metaphor layer (BODYGUARD / GUARDIAN SECURITY LAYER)
// • Added safety contract + structure rules
// • Added v6.3 context map
// • No logic changes
// • No renames
// • No behavior drift
// ============================================================================

import * as LegacyLogic from "./index.js";

// ------------------------------------------------------------
// ⭐ HUMAN‑READABLE CONTEXT MAP (v6.3)
// ------------------------------------------------------------
const ENDPOINT_CONTEXT = {
  label: "ENDPOINT",
  layer: "C‑Layer",
  role: "Guardian Security Layer",
  purpose: "Backend Kernel Dispatcher",
  context: "Routes modular handlers, falls back to legacy, heals missing functions",
  version: "6.3"
};

// ------------------------------------------------------------
// ⭐ DYNAMIC MODULAR BACKEND LOADER
// ------------------------------------------------------------
async function loadModularHandler(type) {
  try {
    const module = await import(`./${type}.js`);
    if (typeof module.handler === "function") {
      return module.handler;
    }
  } catch (err) {
    // Missing or invalid module → fallback
  }
  return null;
}

// ------------------------------------------------------------
// ⭐ MAIN HANDLER — THE BODYGUARD
// ------------------------------------------------------------
export const handler = async (event) => {
  let type;
  let payload = {};

  // ------------------------------------------------------------
  // 0. NORMALIZE INPUT
  // ------------------------------------------------------------
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      type = body.type;
      payload = body.payload || {};
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON body",
          ...ENDPOINT_CONTEXT
        })
      };
    }
  } else if (event.httpMethod === "GET") {
    type = event.queryStringParameters?.type;
    payload = event.queryStringParameters || {};
  }

  // ------------------------------------------------------------
  // ⭐ DEV LOGGING (COLOR‑CODED)
// ------------------------------------------------------------
  console.log(
    `%c🛡️ BODYGUARD CALL → type: ${type}`,
    "color:#03A9F4; font-weight:bold;"
  );

  // ------------------------------------------------------------
  // 1. TRY MODULAR BACKEND FILE FIRST
  // ------------------------------------------------------------
  const modularFn = await loadModularHandler(type);

  if (modularFn) {
    console.log(
      `%c🟩 MODULAR HANDLER FOUND → ${type}.js`,
      "color:#4CAF50; font-weight:bold;"
    );

    try {
      const result = await modularFn(payload);

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          ...ENDPOINT_CONTEXT
        })
      };

    } catch (err) {
      console.error(
        `%c🟥 MODULAR HANDLER ERROR`,
        "color:#FF5252; font-weight:bold;",
        err
      );

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Modular backend execution failed",
          details: String(err),
          ...ENDPOINT_CONTEXT
        })
      };
    }
  }

  // ------------------------------------------------------------
  // 2. FALLBACK TO LEGACY index.js
  // ------------------------------------------------------------
  console.warn(
    `%c🟨 NO MODULAR HANDLER → Falling back to legacy index.js`,
    "color:#FFC107; font-weight:bold;"
  );

  const legacyFn = LegacyLogic[type];

  if (typeof legacyFn === "function") {
    try {
      const result = await legacyFn(payload);

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          ...ENDPOINT_CONTEXT
        })
      };

    } catch (err) {
      console.error(
        `%c🟥 LEGACY HANDLER ERROR`,
        "color:#FF5252; font-weight:bold;",
        err
      );

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Legacy backend execution failed",
          details: String(err),
          ...ENDPOINT_CONTEXT
        })
      };
    }
  }

  // ------------------------------------------------------------
  // 3. NOTHING FOUND → LET ROUTER HEAL IT
  // ------------------------------------------------------------
  console.error(
    `%c🟥 UNKNOWN BACKEND FUNCTION → ${type}`,
    "color:#FF5252; font-weight:bold;"
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      error: "Backend function not found",
      missingFunction: type,
      allowPageFallback: true,
      ...ENDPOINT_CONTEXT
    })
  };
};
