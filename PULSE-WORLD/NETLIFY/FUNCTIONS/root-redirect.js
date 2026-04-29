/* global log,warn,error */
// ============================================================================
// FILE: tropic-pulse-functions/netlify/functions/root-redirect.js
// PULSE REDIRECT — VERSION 6.3
// “THE CROSSING GUARD / SAFE‑PASSAGE REDIRECT LAYER”
// ============================================================================
//
// PAGE INDEX (v6.3 Source of Truth)
// ---------------------------------
// ROLE:
//   root-redirect.js is the **CROSSING GUARD** of the backend.
//   It stands at the public edge of the system and ensures safe passage
//   from the app → to Stripe → and back.
//
//   • Validates minimal required parameters (userID, eventID)
//   • Prevents unsafe or malformed crossings
//   • Redirects users safely to the correct Stripe Payment Link
//   • Keeps logic minimal, predictable, and deterministic
//
// WHAT THIS FILE *IS*:
//   • A Netlify HTTP redirect endpoint
//   • A safe-passage layer for payment flows
//   • A deterministic, zero-side-effect redirector
//
// WHAT THIS FILE *IS NOT*:
//   • NOT a router
//   • NOT a backend logic module
//   • NOT a GPU or OS subsystem
//   • NOT a business logic handler
//
// SAFETY CONTRACT (v6.3):
//   • Validate required query parameters
//   • Never expose secrets
//   • Never call external APIs
//   • Keep redirect URLs explicit and intentional
//   • Keep logic minimal and deterministic
//
// STRUCTURE RULES:
//   • No imports allowed unless absolutely required
//   • No mutation of request or response objects
//   • No additional logic beyond validation + redirect
//
// VERSION TAG:
//   version: 6.3
//
// ============================================================================
// ⭐ v6.3 COMMENT LOG
// ---------------------------------------------------------------------------
// • Added full v6.3 PAGE INDEX
// • Added metaphor layer (CROSSING GUARD / SAFE‑PASSAGE REDIRECT LAYER)
// • Added safety contract + structure rules
// • Added v6.3 context map
// • No logic changes
// • No renames
// • No behavior drift
// ============================================================================

export async function handler(event, context) {
  try {
    const params = event.queryStringParameters || {};
    const userID = params.userID;
    const eventID = params.eventID;

    if (!userID) {
      return { statusCode: 400, body: "Missing userID" };
    }
    if (!eventID) {
      return { statusCode: 400, body: "Missing eventID" };
    }

    const realUrl =
      `https://pay.tropicpulse.bz/b/00w4gy1ZP0Si7UpcgIfIs01` +
      `?userID=${encodeURIComponent(userID)}` +
      `&eventID=${encodeURIComponent(eventID)}`;

    return {
      statusCode: 302,
      headers: { Location: realUrl },
      body: ""
    };

  } catch (err) {
    error("Payment redirect error:", err.message);
    return {
      statusCode: 500,
      body: "Payment redirect failed"
    };
  }
}
