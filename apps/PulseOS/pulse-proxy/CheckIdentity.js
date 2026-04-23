// ============================================================================
// FILE: pulse-proxy/CheckIdentity.js
// PULSE IDENTITY ENGINE — v10.4
// “THE SELF+++ / CANONICAL IDENTITY ENGINE / SENSE‑OF‑SELF LAYER”
// ============================================================================
//
// ROLE (v10.4):
//   • Canonical identity validator + deterministic self‑repair engine
//   • Preserves lineage, drift markers, session state, trusted device flags
//   • Supports offline-first identity survival
//   • Mode-aware (A→B→A routing safe)
//   • Returns authoritative v10.4 identity snapshot
//   • Zero randomness, deterministic, replayable
//
// CONTRACT (v10.4):
//   • Fail-open: invalid identity → null (frontend handles fallback)
//   • Never mutate original input
//   • Always return structurally complete v10.4 identity
//   • Never trust external identity providers
//   • Deterministic, loggable, lineage-safe
//   • No single point of failure
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "IDENTITY-LAYER";
const LAYER_NAME = "THE SELF+++";
const LAYER_ROLE = "SENSE-OF-SELF ENGINE";
const LAYER_VER  = "10.4";

const IDENTITY_DIAGNOSTICS_ENABLED =
  process.env.PULSE_IDENTITY_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

function safeLog(...args)  { try { console.log(...args); } catch {} }
function safeError(...args){ try { console.error(...args); } catch {} }

const logSelf = (stage, details = {}) => {
  if (!IDENTITY_DIAGNOSTICS_ENABLED) return;

  safeLog(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};


// ============================================================================
// MODE RESOLUTION — A/B/A routing metadata
// ============================================================================
function resolveMode(event) {
  try {
    const headers = event?.headers || {};
    return (
      headers["x-pulse-mode"] ||
      headers["X-Pulse-Mode"] ||
      "identity"
    ).toString();
  } catch {
    return "identity";
  }
}


// ============================================================================
// HELPERS — NORMALIZE IDENTITY TO v10.4 SHAPE
// ============================================================================
function normalizeIdentity(raw, mode) {
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

    // Identity health + drift markers
    identityHealth: safeStr(raw.identityHealth, "Unknown"),
    drift: safeObj(raw.drift, {}),

    // Lineage + versioning
    identityVersion: LAYER_VER,
    lineage: safeObj(raw.lineage, {}),
    repairMode: safeStr(raw.repairMode, "none"),

    // Session + device
    trustedDevice: safeBool(raw.trustedDevice, false),
    sessionAge: safeNum(raw.sessionAge, 0),
    lastVaultVisit: safeNum(raw.lastVaultVisit, 0),

    // Timestamps
    createdAt: raw.createdAt || Date.now(),
    updatedAt: Date.now(),

    // Context injection
    layer: LAYER_NAME,
    context: "Canonical backend identity snapshot (v10.4)",
    mode
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE SELF+++”
// ============================================================================
export const handler = async (event, context) => {
  const mode = resolveMode(event);

  logSelf("INTAKE_START", {
    hasCookie: !!event?.headers?.cookie,
    mode
  });

  try {
    // ----------------------------------------------------
    // ⭐ 1. Load token (identity seed)
    // ----------------------------------------------------
    const token = event.headers.cookie || "";
    logSelf("TOKEN_LOADED", { tokenLength: token.length, mode });

    // ----------------------------------------------------
    // ⭐ 2. Validate token → load identity
    // ----------------------------------------------------
    const identity = await validateAndLoadIdentity(token);

    if (!identity) {
      logSelf("IDENTITY_INVALID", { mode });
      return {
        statusCode: 401,
        body: JSON.stringify(null)
      };
    }

    logSelf("IDENTITY_LOADED", {
      uid: identity?.uid || null,
      mode
    });

    // ----------------------------------------------------
    // ⭐ 3. Repair identity drift (Sense-of-Self correction)
    // ----------------------------------------------------
    const repaired = await repairIdentity(identity);

    logSelf("IDENTITY_REPAIRED", {
      uid: repaired?.uid || null,
      mode
    });

    // ----------------------------------------------------
    // ⭐ 4. Normalize to v10.4 identity shape
    // ----------------------------------------------------
    const normalized = normalizeIdentity(repaired, mode);

    logSelf("IDENTITY_NORMALIZED", {
      uid: normalized?.uid || null,
      version: normalized?.identityVersion,
      mode
    });

    // ----------------------------------------------------
    // ⭐ 5. Return final, authoritative identity
    // ----------------------------------------------------
    logSelf("RETURN_SELF", {
      uid: normalized?.uid || null,
      mode
    });

    return {
      statusCode: 200,
      body: JSON.stringify(normalized)
    };

  } catch (err) {
    safeError("CheckIdentity error:", err);

    logSelf("FATAL_ERROR", {
      message: err?.message || "Unknown error",
      mode
    });

    return {
      statusCode: 500,
      body: JSON.stringify(null)
    };
  }
};
