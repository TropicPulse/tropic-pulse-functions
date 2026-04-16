// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/router.js
// LAYER: B‑LAYER (FRONTEND CONNECTOR)
//
// PURPOSE:
// The ONLY legal bridge between frontend pages (A‑Layer) and the backend
// entry point (C‑Layer). Pages NEVER call backend endpoints directly.
// ALL communication MUST pass through this connector.
//
// FRONTEND SAFETY INVARIANTS:
// • Frontend NEVER creates files (HTML/JS/CSS). Only updates existing pages.
// • Frontend NEVER contains backend logic.
// • Frontend NEVER imports secrets or backend modules.
// • Frontend ONLY imports this connector.
// • Frontend ONLY calls route(), never fetches backend directly.
// • Auto‑healing system ensures this file is imported in first 10 lines of pages.
//
// BACKEND CONTRACT:
// • Backend receives { type, payload }.
// • Backend router (endpoint.js) dispatches to backend logic (D‑Layer).
// • Backend handles versioning, creation, AI comments, and approval pipeline.
// ============================================================================
//
// ⭐ SOURCE‑OF‑TRUTH: A → B → C → D MODEL
//
// A = PAGE (UI + DOM only)
//     • Owns page‑level UI logic.
//     • Calls route() for backend actions.
//     • NEVER defines connector functions.
//
// B = FRONTEND CONNECTOR (THIS FILE)
//     • Exposes ONLY generic system calls: getMap, getAuth, getHook.
//     • NEVER exposes page‑level actions.
//     • NEVER contains business logic.
//
// C = BACKEND ENTRY POINT (/apps/netlify/functions/endpoint.js)
//     • Kernel dispatcher.
//     • Receives ALL backend calls.
//     • Routes ONLY connector-level types.
//
// D = BACKEND LOGIC FILES (getMap.js, getAuth.js, getHook.js, etc.)
//     • Contain actual backend logic.
//     • Connector NEVER contains business logic.
// ============================================================================


// ------------------------------------------------------------
// ⭐ UNIVERSAL SYS‑CALL FUNCTION (A → B → C)
// ------------------------------------------------------------
// Sends a POST request to backend entry point with { type, payload }.
// Backend router handles:
// • identity
// • helper whitelists
// • routing
// • versioning
// • AI comments
// • backend-only file creation
// ------------------------------------------------------------
async function route(type, payload = {}) {
  try {
    const res = await fetch("/.netlify/functions/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload })
    });

    // Basic JSON return; backend handles all logic + errors
    return await res.json();

  } catch (err) {
    // //// 🟦 REVIEW-NOTE:
    // //// Frontend route() failed to reach backend.
    // //// This is usually a network issue or backend downtime.
    return {
      error: "Frontend connector failed",
      details: String(err)
    };
  }
}


// ------------------------------------------------------------
// ⭐ CONNECTOR FUNCTIONS (B‑LAYER)
// ------------------------------------------------------------
// These are the ONLY functions frontend pages are allowed to call.
// Each maps 1:1 to a backend function file in /apps/netlify/functions.
//
// IMPORTANT:
// • Pages NEVER call fetch() directly.
// • Pages NEVER call backend endpoints directly.
// • Pages NEVER import backend logic.
// • Pages ONLY call these connector functions.
// ------------------------------------------------------------
export const getMap  = (payload) => route("getMap", payload);
export const getAuth = (payload) => route("getAuth", payload);
export const getHook = (payload) => route("getHook", payload);

// //// 🟦 REVIEW-NOTE:
// //// Add new connector functions ONLY when backend logic exists.
// //// Frontend NEVER creates new connector files automatically.
// //// Frontend auto-healing ONLY inserts the import for THIS file
// //// into pages that are missing it (first 10 lines).
// ============================================================================

export { route };
