// FILE: apps/tropic-pulse/lib/Connectors/getHook.js
//
// INTENT-CHECK:
//   If you are editing this file while rushed, frustrated, or uncertain,
//   pause and re-read your INTENT. If this PAGE INDEX does not match your
//   intent for this file, update it BEFORE touching the code.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed
// behavior of this connector module. It is the compressed representation
// of the entire file. Keep this updated as webhook‑related flows evolve.
//
// CONTENTS TO MAINTAIN:
//   • What this file IS
//   • What this file IS NOT
//   • Responsibilities
//   • Exported functions
//   • Internal logic summary
//   • Boundaries + constraints
//
// ROLE:
//   getHook — the connector between frontend pages (A layer) and the backend
//   webhook handler (C layer). This module is responsible for:
//     • Accepting a payload from the UI
//     • Forwarding that payload to the backend massEmailWebhook function
//     • Returning clean JSON results back to the UI
//
// REAL‑WORLD CONTEXT (for future Aldwyn):
//   • This file does NOT send emails.
//   • This file does NOT deduct credits.
//   • This file does NOT talk to Firestore.
//   • This file does NOT manipulate DOM.
//   • This file ONLY forwards webhook payloads to backend and returns results.
//
// THIS FILE IS:
//   • A bridge between UI and backend
//   • A translator of arguments → backend payload
//   • A clean, deterministic connector
//
// THIS FILE IS NOT:
//   • A backend function
//   • A UI helper
//   • A compute engine
//   • A storage handler
//   • A business logic module
//   • A generic webhook forwarder (security risk)
//     → This connector ONLY calls massEmailWebhook.
//
// DEPLOYMENT:
//   Lives in apps/tropic-pulse/lib/Connectors.
//   Must remain browser-safe. Must NOT contain secure logic or secrets.
//
// INTERNAL LOGIC SUMMARY:
//   • callBackend(endpoint, payload)
//       - POSTs JSON to Netlify backend functions
//       - Returns parsed JSON
//
//   • getHook(payload)
//       - Calls backend massEmailWebhook
//       - Returns backend response to UI
//
// ------------------------------------------------------
// getHook — Connector for Mass Email Webhook (B Layer)
// ------------------------------------------------------
// FILE: apps/tropic-pulse/lib/Connectors/getHook.js
// LAYER: B-LAYER (FRONTEND CONNECTOR)
//
// PURPOSE:
// A clean, deterministic syscall from the frontend (A/A2 layer)
// to the backend router (C layer). This file contains ZERO routing
// logic. It ONLY forwards { hook, payload } to the backend router
// located in /.netlify/functions/router.
//
// This file MUST remain browser-safe and contain no secrets.

export async function getHook(hook, payload = {}) {
  const res = await fetch("/.netlify/functions/router", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hook, payload })
  });

  return await res.json();
}