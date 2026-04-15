// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/router.js
// LAYER: B‑LAYER (FRONTEND CONNECTOR)
//
// PURPOSE:
// This file is the ONLY legal bridge between frontend pages (A‑Layer) and the
// backend entry point (C‑Layer). Pages NEVER call backend endpoints directly.
// ALL communication MUST pass through this connector.
//
// INPUTS:
// • Pages call small connector functions (getMap, getAuth, getHook).
// • These connector functions send { type, payload } to the backend entry point.
//
// OUTPUTS:
// • The backend entry point (C‑Layer) dispatches to the correct backend logic
//   file (D‑Layer).
// ============================================================================
//
// ⭐ SOURCE‑OF‑TRUTH: A → B → C → D MODEL
//
// A = PAGE (Function‑Level Shell)
//     • Pages own their own page‑level functions.
//     • Pages may call backend using GET or POST.
//     • Pages NEVER define connector-level functions.
//
// B = FRONTEND CONNECTOR (THIS FILE)
//     • The ONLY bridge from A → C.
//     • Exposes ONLY generic system calls: getMap, getAuth, getHook.
//     • NEVER exposes page-level actions.
//
// C = BACKEND ENTRY POINT (/apps/netlify/functions/endpoint.js)
//     • Kernel dispatcher.
//     • Receives ALL backend calls (POST from connector, GET from pages).
//     • Routes ONLY connector-level types.
//
// D = BACKEND LOGIC FILES (getMap.js, getAuth.js, getHook.js, etc.)
//     • Contain actual backend logic.
//     • Connector NEVER contains business logic.
// ============================================================================
// ------------------------------------------------------------
// ⭐ UNIVERSAL SYS‑CALL FUNCTION (A → B → C)
// ------------------------------------------------------------
async function route(type, payload = {}) {
  const res = await fetch("/.netlify/functions/endpoint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload })
  });

  return res.json();
}
// ------------------------------------------------------------
// ⭐ CONNECTOR FUNCTIONS (B‑LAYER)
// These are the ONLY functions frontend pages are allowed to call.
// Each maps 1:1 to a backend function file in /apps/netlify/functions.
// ------------------------------------------------------------
export const getMap  = (payload) => route("getMap", payload);
export const getAuth = (payload) => route("getAuth", payload);
export const getHook = (payload) => route("getHook", payload);

// Add more connector functions as needed.
// ============================================================================