// ============================================================================
// FILE: /apps/netlify/functions/router.js
// LAYER: C‑LAYER (BACKEND ROUTER)
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   This file is the CENTRAL BACKEND ROUTER for the entire Pulse OS backend.
//   It receives { hook, payload } from the frontend connector layer (B‑Layer)
//   and dispatches the request to the backend dispatcher (index.js, D‑Layer).
//
// WHAT THIS FILE *IS*:
//   • The ONLY backend entry point for connector‑level calls
//   • A strict POST‑only syscall receiver
//   • A validator for incoming { hook, payload }
//   • A delegator to index.js (D‑Layer dispatcher)
//   • A safe JSON response wrapper
//
// WHAT THIS FILE *IS NOT*:
//   • It does NOT contain business logic
//   • It does NOT talk to Firestore
//   • It does NOT send emails
//   • It does NOT generate maps
//   • It does NOT authenticate users
//   • It does NOT modify data directly
//
// ARCHITECTURE MODEL (A → A2 → B → C → D → D2):
//
//   A   = Page (UI Shell)
//   A2  = PageRouter (Global Error Interceptor)
//   B   = Frontend Connectors (getHook, getAuth, getMap)
//   C   = THIS FILE (Backend Router)
//   D   = index.js (Backend Dispatcher)
//   D2  = Actual backend logic files (getHook.js, getAuth.js, getMap.js, etc.)
//
// PURPOSE:
//   Keep backend routing deterministic, secure, and drift‑proof.
//   This file MUST remain minimal, predictable, and stable.
// ============================================================================

import { handler as indexHandler } from "./index.js";

// ---------------------------------------------------------------------------
// ⭐ Netlify Function Handler (C‑Layer Entry Point)
// ---------------------------------------------------------------------------
export const handler = async (event) => {
  try {
    // Enforce POST‑only behavior
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // Parse incoming JSON
    const body = JSON.parse(event.body || "{}");
    const { hook, payload = {} } = body;

    // Validate hook
    if (!hook) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing hook" })
      };
    }

    // -----------------------------------------------------------------------
    // ⭐ DELEGATE TO INDEX (D‑LAYER DISPATCHER)
    // indexHandler maps hook → backend logic file.
    // -----------------------------------------------------------------------
    const result = await indexHandler(hook, payload);

    return {
      statusCode: 200,
      body: JSON.stringify(result ?? {})
    };

  } catch (err) {
    console.error("[router] Unhandled error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Router failure",
        message: err?.message || "Unknown error"
      })
    };
  }
};