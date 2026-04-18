// ============================================================================
// FILE: /apps/netlify/functions/router.js
// PULSE BACKEND ROUTER — v6.3
// “THE SECRETARY / FRONT‑DESK REQUEST INTAKE LAYER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE SECRETARY / FRONT‑DESK REQUEST INTAKE LAYER” (C‑Layer)
// - ROLE: First internal backend component after frontend connectors
// - Added CONTEXT MAP (A → A2 → B → C → D → D2)
// - Added SAFETY CONTRACT + STRUCTURE + BOUNDARIES
// - Added ROUTER_DIAGNOSTICS logs (DOM‑visible via log pipeline)
// - Added PAGE INDEX + MARKED LOG POINTS
// - ZERO business logic added; pure intake + delegation preserved
//
// ============================================================================
// PERSONALITY + ROLE — “THE SECRETARY”
// ----------------------------------------------------------------------------
// router.js is the **SECRETARY** of the backend.
// It is the **FRONT‑DESK REQUEST INTAKE LAYER** — the calm, predictable,
// professional gatekeeper that receives structured calls from the frontend
// connector layer (B‑Layer).
//
// The Secretary:
//   • Receives { hook, payload } from B‑Layer connectors
//   • Validates the request format
//   • Enforces POST‑only syscall behavior
//   • Delegates the request to index.js (The Dispatcher / D‑Layer)
//   • Wraps responses safely and predictably
//
// The Secretary NEVER:
//   • Performs business logic
//   • Touches Firestore
//   • Authenticates users
//   • Sends emails
//   • Generates maps
//   • Modifies data
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ The ONLY backend entry point for connector‑level calls
//   ✔ A strict POST‑only syscall receiver
//   ✔ A validator for incoming { hook, payload }
//   ✔ A delegator to index.js (D‑Layer dispatcher)
//   ✔ A safe JSON response wrapper
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT business logic
//   ✘ NOT Firestore access
//   ✘ NOT authentication
//   ✘ NOT email sending
//   ✘ NOT map generation
//   ✘ NOT data modification
//
// ============================================================================
// ARCHITECTURE MODEL (A → A2 → B → C → D → D2)
// ----------------------------------------------------------------------------
//   A   = Page (UI Shell)
//   A2  = PageRouter (Global Error Interceptor)
//   B   = Frontend Connectors (getHook, getAuth, getMap)
//   C   = THIS FILE (Backend Router / Secretary)
//   D   = index.js (Backend Dispatcher / “The Dispatcher”)
//   D2  = Actual backend logic files (getHook.js, getAuth.js, etc.)
//
// ============================================================================
// SAFETY CONTRACT (C‑Layer / Secretary)
// ----------------------------------------------------------------------------
//   • Must remain minimal, predictable, and stable
//   • Must never contain business logic
//   • Must never call external services directly
//   • Must always fail‑open with safe JSON
//   • Must never mutate payloads
//   • Must never bypass index.js
//
// ============================================================================
// STRUCTURE + BOUNDARIES
// ----------------------------------------------------------------------------
//   • Input:  event.httpMethod, event.body
//   • Output: JSON { statusCode, body }
//   • Delegation: ALWAYS → indexHandler(hook, payload)
//   • Error handling: Safe JSON only
//   • Logging: Layer‑tagged, DOM‑visible via log pipeline
//
// ============================================================================
// PAGE INDEX (Human Recall)
// ----------------------------------------------------------------------------
//   [1] Layer constants + diagnostics helpers
//   [2] POST enforcement
//   [3] JSON parsing + hook validation
//   [4] Delegation to Dispatcher (index.js)
//   [5] Safe JSON response
//   [6] Secretary‑level error handling
//
// ============================================================================

import { handler as indexHandler } from "./index.js";

// ============================================================================
// [1] LAYER CONSTANTS + DIAGNOSTICS HELPERS
// ============================================================================
const LAYER_ID = "C-LAYER";
const LAYER_NAME = "THE SECRETARY";
const LAYER_ROLE = "FRONT-DESK REQUEST INTAKE";

const ROUTER_DIAGNOSTICS_ENABLED =
  process.env.PULSE_ROUTER_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logSecretary = (stage, details = {}) => {
  if (!ROUTER_DIAGNOSTICS_ENABLED) return;

  // DOM‑visible style structured log (for your log pipeline / inspector)
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
// [C‑LAYER ENTRY] ⭐ “THE SECRETARY’S DESK”
// ============================================================================
export const handler = async (event) => {
  const startTime = Date.now();

  logSecretary("INTAKE_START", {
    httpMethod: event?.httpMethod,
    hasBody: !!event?.body
  });

  try {
    // [2] Enforce POST‑only behavior
    if (event.httpMethod !== "POST") {
      logSecretary("INTAKE_REJECT_METHOD", {
        httpMethod: event.httpMethod
      });

      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // [3] Parse incoming JSON
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch (parseErr) {
      logSecretary("INTAKE_PARSE_ERROR", {
        message: parseErr?.message || "Invalid JSON"
      });

      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON body" })
      };
    }

    const { hook, payload = {} } = body;

    // Validate hook
    if (!hook) {
      logSecretary("INTAKE_MISSING_HOOK", {
        hasPayload: !!payload
      });

      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing hook" })
      };
    }

    logSecretary("INTAKE_VALIDATED", {
      hook,
      payloadType: typeof payload
    });

    // [4] Delegate to Dispatcher (index.js)
    const result = await indexHandler(hook, payload);

    // [5] Safe JSON response
    const durationMs = Date.now() - startTime;
    logSecretary("INTAKE_COMPLETE", {
      hook,
      durationMs,
      resultType: typeof result
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result ?? {})
    };

  } catch (err) {
    const durationMs = Date.now() - startTime;

    console.error("[router] Unhandled error:", err);
    logSecretary("INTAKE_FATAL_ERROR", {
      message: err?.message || "Unknown error",
      durationMs
    });

    // [6] Secretary‑level safe failure
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Router failure",
        message: err?.message || "Unknown error"
      })
    };
  }
};
