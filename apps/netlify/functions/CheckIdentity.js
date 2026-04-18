// ============================================================================
// FILE: netlify/functions/CheckIdentity.js
// PULSE IDENTITY ENGINE — v6.3
// “THE SELF / IDENTITY ENGINE / SENSE‑OF‑SELF LAYER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE SELF / IDENTITY ENGINE / SENSE‑OF‑SELF LAYER”
// - ROLE: Authoritative identity validator + self-repair engine
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (DOM-visible inspector compatible)
// - Added explicit STAGE markers for identity lifecycle
// - ZERO logic changes to validation or repair flow
//
// ============================================================================
// PERSONALITY + ROLE — “THE SELF”
// ----------------------------------------------------------------------------
// CheckIdentity is the **IDENTITY ENGINE** of the entire system.
// It is the **SENSE‑OF‑SELF LAYER** — the authoritative source of truth
// for who the user is, who the system believes they are, and how identity
// should be repaired when corrupted.
//
//   • Validates identity tokens
//   • Loads the authoritative identity record
//   • Repairs identity drift
//   • Returns the final, corrected identity
//
// This is the layer that ensures the system always knows:
//     “This is me.”
//     “This is my true state.”
//     “I remain myself across sessions.”
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A backend identity validator + repair engine
//   ✔ A deterministic, authoritative identity source
//   ✔ A self-repairing identity layer
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a UI layer
//   ✘ NOT a GPU subsystem
//   ✘ NOT a frontend identity cache
//   ✘ NOT a session tracer
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • No randomness in identity logic
//   • Fail-open: invalid identity → null
//   • Self-repair-ready: identity is corrected before returning
//   • No external identity authorities (Firebase, Cloudflare, OAuth, etc.)
//   • Identity must remain fully Pulse‑controlled
//
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "IDENTITY-LAYER";
const LAYER_NAME = "THE SELF";
const LAYER_ROLE = "SENSE-OF-SELF ENGINE";

const IDENTITY_DIAGNOSTICS_ENABLED =
  process.env.PULSE_IDENTITY_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logSelf = (stage, details = {}) => {
  if (!IDENTITY_DIAGNOSTICS_ENABLED) return;

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
// BACKEND ENTRY POINT — “THE SELF”
// ============================================================================
export const handler = async (event, context) => {
  logSelf("INTAKE_START", {
    hasCookie: !!event?.headers?.cookie
  });

  try {
    // ----------------------------------------------------
    // ⭐ 1. Load token (identity seed)
    // ----------------------------------------------------
    const token = event.headers.cookie || "";
    logSelf("TOKEN_LOADED", { tokenLength: token.length });

    // ----------------------------------------------------
    // ⭐ 2. Validate token → load identity
    // ----------------------------------------------------
    const identity = await validateAndLoadIdentity(token);

    if (!identity) {
      logSelf("IDENTITY_INVALID", {});
      return {
        statusCode: 401,
        body: JSON.stringify(null)
      };
    }

    logSelf("IDENTITY_LOADED", {
      uid: identity?.uid || null
    });

    // ----------------------------------------------------
    // ⭐ 3. Repair identity drift (Sense-of-Self correction)
    // ----------------------------------------------------
    const repaired = await repairIdentity(identity);

    logSelf("IDENTITY_REPAIRED", {
      uid: repaired?.uid || null
    });

    // ----------------------------------------------------
    // ⭐ 4. Return final, authoritative identity
    // ----------------------------------------------------
    logSelf("RETURN_SELF", {
      uid: repaired?.uid || null
    });

    return {
      statusCode: 200,
      body: JSON.stringify(repaired)
    };

  } catch (err) {
    console.error("CheckIdentity error:", err);

    logSelf("FATAL_ERROR", {
      message: err?.message || "Unknown error"
    });

    return {
      statusCode: 500,
      body: JSON.stringify(null)
    };
  }
};
