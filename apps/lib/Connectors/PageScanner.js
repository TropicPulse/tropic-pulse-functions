// ============================================================================
// FILE: /apps/lib/Connectors/PageScanner.js
// LAYER: A2‑LAYER (PAGE‑LEVEL SCANNER / PASS‑THROUGH)
//
// PURPOSE:
// This file is a PASS‑THROUGH SCANNER between the Page (A‑Layer) and the
// Frontend Connector (B‑Layer). It does NOT contain logic, identity handling,
// backend rules, or business decisions.
//
// PageScanner ONLY:
// • Intercepts page‑level missing‑field errors.
// • Extracts the Firestore table + field name.
// • Sends that information to router.js for secure backend handling.
//
// ALL security, identity, backend logic, and data resolution occur OUTSIDE
// this file in the B‑Layer, C‑Layer, and D‑Layer.
//
// This file is PURE THROUGHPUT.
// ============================================================================
//
// ⭐ SOURCE‑OF‑TRUTH: A → A2 → B → C → D MODEL
//
// A  = PAGE (UI Shell)
//      • Runs page code.
//      • May accidentally reference missing fields.
//
// A2 = PAGE SCANNER (THIS FILE)
//      • Catches missing‑field errors.
//      • Extracts table + field.
//      • Passes request to router.js.
//      • Contains ZERO logic.
//
// B  = FRONTEND CONNECTOR (router.js)
//      • Secure syscall layer.
//      • Sends requests to backend entry point.
//
// C  = BACKEND ENTRY POINT (endpoint.js)
//      • Kernel dispatcher.
//
// D  = BACKEND LOGIC FILES
//      • Firestore Admin, Stripe, Email, etc.
// ============================================================================


// ------------------------------------------------------------
// ⭐ GLOBAL ERROR INTERCEPTOR (A → A2)
// Catches missing-field errors and forwards them to router.js.
// ------------------------------------------------------------
let healingInProgress = false;

window.addEventListener("error", async (event) => {
  if (healingInProgress) return;

  const msg = event.message || "";
  const parsed = parseMissingField(msg);
  if (!parsed) return; // Not a missing-field error

  const { table, field } = parsed;

  healingInProgress = true;

  console.warn("[PageScanner] Missing:", `${table}.${field}`);

  try {
    // --------------------------------------------------------
    // ⭐ PASS‑THROUGH CALL TO ROUTER.JS (A2 → B)
    // router.js handles ALL secure logic.
    // --------------------------------------------------------
    await getHook({
      type: "fetchField",
      table,
      field
    });

  } catch (err) {
    console.error("[PageScanner] Router fetch failed:", err);
  }

  healingInProgress = false;

  // Prevent page crash
  event.preventDefault();
}, true);


// ------------------------------------------------------------
// ⭐ PARSER: Extract Firestore table + field from JS error
// ASSUMPTIONS:
// • All missing fields originate from the Users table.
// • Field name is extracted from the JS error message.
// ------------------------------------------------------------
function parseMissingField(message) {
  // Pattern: Cannot read properties of undefined (reading 'resendToken')
  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  // Pattern: resendToken is not defined
  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  // Pattern: Cannot read property 'stripeAccountId'
  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}
// ============================================================================
