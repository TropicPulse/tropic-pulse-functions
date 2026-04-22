// ============================================================================
// FILE: netlify/functions/CheckIdentity.js
// PULSE IDENTITY ENGINE — v9.3
// “THE SELF++ / CANONICAL IDENTITY ENGINE / SENSE‑OF‑SELF LAYER”
// ============================================================================
//
// ROLE (v9.3):
//   • Canonical identity validator + self-repair engine
//   • Preserves lineage, drift markers, session state, trusted device flags
//   • Supports offline-first identity survival
//   • Returns authoritative v9.3 identity snapshot
//   • Zero randomness, deterministic, replayable
//
// CONTRACT (v9.3):
//   • Fail-open: invalid identity → null (frontend handles fallback)
//   • Never mutate original input
//   • Always return structurally complete v9.3 identity
//   • Never trust external identity providers
//   • Deterministic, loggable, lineage-safe
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "IDENTITY-LAYER";
const LAYER_NAME = "THE SELF++";
const LAYER_ROLE = "SENSE-OF-SELF ENGINE";
const LAYER_VER  = "9.3";

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
// HELPERS — NORMALIZE IDENTITY TO v9.3 SHAPE
// ============================================================================
function normalizeIdentity(raw) {
  if (!raw || typeof raw !== "object") return null;

  const safeStr = (v, d = "") =>
    typeof v === "string" ? v : d;

  const safeBool = (v, d = false) =>
    typeof v === "boolean" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  const safeNum = (v, d = 0) =>
    typeof v === "number" && !isNaN(v) ? v : d;

  return {
    // Core identity
    uid: safeStr(raw.uid),
    email: safeStr(raw.email),
    name: safeStr(raw.name),
    roles: Array.isArray(raw.roles) ? raw.roles : [],

    // Identity health + drift markers (v9.3)
    identityHealth: safeStr(raw.identityHealth, "Unknown"),
    drift: safeObj(raw.drift, {}),

    // Lineage + versioning (v9.3)
    identityVersion: LAYER_VER,
    lineage: safeObj(raw.lineage, {}),
    repairMode: safeStr(raw.repairMode, "none"),

    // Session + device (v9.3)
    trustedDevice: safeBool(raw.trustedDevice, false),
    sessionAge: safeNum(raw.sessionAge, 0),
    lastVaultVisit: safeNum(raw.lastVaultVisit, 0),

    // Timestamps
    createdAt: raw.createdAt || Date.now(),
    updatedAt: Date.now(),

    // Context injection
    layer: LAYER_NAME,
    context: "Canonical backend identity snapshot (v9.3)"
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE SELF++”
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
    // ⭐ 4. Normalize to v9.3 identity shape
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
