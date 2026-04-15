// ============================================================================
// ⭐ CONNECTOR LAYER: AUTH (B LAYER)
// This file is the ONLY legal bridge between frontend pages (A) and backend
// identity functions (C). Frontend pages NEVER call backend endpoints directly.
// Backend functions NEVER talk to pages directly. All communication MUST pass
// through this connector layer.
//
// ⭐ SOURCE‑OF‑TRUTH: A → B → C MODEL
// The system no longer works in a direct A→C pattern where a page calls a backend
// action and the platform magically finds and runs it. The new model is literal and
// structured: A (the page) must call B (a small connector function), and B is the
// only thing allowed to call C (the backend action file). This separation exists
// because the new environment does not guess or auto‑route backend actions; it only
// runs backend logic placed in the backend folder, and it only allows frontend pages
// to talk through connectors. A→B→C is now required so the system stays deterministic,
// secure, and drift‑proof.
//
// This file defines the AUTH connector functions that frontend pages call.
// Each function here maps 1:1 to a backend function file in /netlify/functions.
// ============================================================================


// ------------------------------------------------------------
// B → C CALLER TEMPLATE
// Every connector function follows this exact pattern:
// 1. Receive simple arguments from the frontend (A)
// 2. Call the backend function file (C)
// 3. Return clean results back to the frontend
// ------------------------------------------------------------
a// ============================================================================
// FILE: apps/tropic-pulse/lib/Connectors/getAuth.js
// LAYER: B‑LAYER (FRONTEND CONNECTOR)
//
// PURPOSE:
// This connector is a PATHWAY. It does NOT call backend endpoints directly.
// It ONLY forwards { type, payload } to router.js, which handles routing.
// ============================================================================

import { route } from "./router.js";

// ⭐ REAL getAuth — forwards to routing system
export const getAuth = (payload = {}) => {
  return route("getAuth", payload);
};

// ------------------------------------------------------------
// Add more AUTH connector functions here as needed.
// Each one maps to a backend file in /netlify/functions.
// ------------------------------------------------------------