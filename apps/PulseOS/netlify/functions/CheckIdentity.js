// ============================================================================
// FILE: netlify/functions/CheckIdentity.js
// PULSE IDENTITY ENGINE — v7.1
// “THE SELF+ / IDENTITY ENGINE / SENSE‑OF‑SELF LAYER”
// ============================================================================
//
// ROLE (v7.1):
//   • Canonical identity validator + self-repair engine
//   • Dual‑mode: works identically in offline + online environments
//   • Preserves lineage, version, drift markers
//   • Returns authoritative identity snapshot when online
//   • Supports offline-first frontend identity survival
//   • No external identity authorities (Pulse-only)
//
// CONTRACT (v7.1):
//   • No randomness in identity logic
//   • Fail-open: invalid identity → null (frontend handles offline fallback)
//   • Never trust external identity providers
//   • Never mutate original input
//   • Always return structurally complete identity
//   • Always AND: internal + external compatible
//   • Deterministic, loggable, replayable
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "IDENTITY-LAYER";
const LAYER_NAME = "THE SELF+";
const LAYER_ROLE = "SENSE-OF-SELF ENGINE";
const LAYER_VER  = "7.1";

const IDENTITY_DIAGNOSTICS_ENABLED =
  process.env.PULSE_IDENTITY_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logSelf = (stage, details = {}) => {
  if (!IDENTITY_DIAGNOSTICS_ENABLED) return;

  log(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};


// ============================================================================
// HELPERS — SAFE TOKEN + IDENTITY NORMALIZATION (v7.1)
// ============================================================================

// Normalize identity structure to v7.1 shape
function normalizeIdentity(raw) {
  if (!raw || typeof raw !== "object") return null;

  const safeStr = (v, d = "") =>
    typeof v === "string" ? v : d;

  const safeBool = (v, d = false) =>
    typeof v === "boolean" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  return {
    uid: safeStr(raw.uid),
    email: safeStr(raw.email),
    name: safeStr(raw.name),
    roles: Array.isArray(raw.roles) ? raw.roles : [],

    // Identity health + drift markers
    identityHealth: safeStr(raw.identityHealth, "Unknown"),
    drift: safeObj(raw.drift, {}),

    // Timestamps
    createdAt: raw.createdAt || Date.now(),
    updatedAt: Date.now(),

    // v7.1 context injection
    identityVersion: LAYER_VER,
    layer: LAYER_NAME,
    context: "Canonical backend identity snapshot"
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE SELF+”
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
      logSelf("IDENTITY_INVALID");
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
    // ⭐ 4. Normalize to v7.1 identity shape
    // ----------------------------------------------------
    const normalized = normalizeIdentity(repaired);

    logSelf("IDENTITY_NORMALIZED", {
      uid: normalized?.uid || null,
      version: normalized?.identityVersion
    });

    // ----------------------------------------------------
    // ⭐ 5. Return final, authoritative identity
    // ----------------------------------------------------
    logSelf("RETURN_SELF", {
      uid: normalized?.uid || null
    });

    return {
      statusCode: 200,
      body: JSON.stringify(normalized)
    };

  } catch (err) {
    error("CheckIdentity error:", err);

    logSelf("FATAL_ERROR", {
      message: err?.message || "Unknown error"
    });

    return {
      statusCode: 500,
      body: JSON.stringify(null)
    };
  }
};
