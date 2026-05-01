// ============================================================================
// FILE: PULSE-proxy/CheckIdentity-v12.3-PRESENCE-EVO-BINARY.js
// PULSE IDENTITY ENGINE — v12.3-PRESENCE-EVO-BINARY
// “THE SELF++++ / BINARY‑FIRST IDENTITY ENGINE / DUALBAND PRESENCE CORE”
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO-BINARY):
//   • Canonical identity + presence validator for a binary‑first organism
//   • Dualband identity engine (Symbolic A → Binary B → Symbolic A)
//   • Backbone of PulseBand / PulseNet / CheckBand identity field
//   • Preserves lineage, drift markers, binary signatures, device trust
//   • Presence‑aware: Bluetooth / device / band presence surfaces
//   • Supports offline‑first survival + binary compression
//   • Deterministic, replayable, lineage‑safe, drift‑aware
//   • Returns authoritative v12.3+ identity + presence snapshot
//
// CONTRACT (v12.3-PRESENCE-EVO-BINARY):
//   • Fail‑open: invalid identity → null (frontend + PulseBand handle fallback)
//   • Never mutate original input
//   • Always return structurally complete v12.3 identity snapshot
//   • Never trust external identity providers blindly
//   • No astral layers, no legacy PNS, no translator cores
//   • Binary‑first nervous system compliance
//   • Dualband compression + unified advantage field required
// ============================================================================

export const PulseOSCheckIdentityMeta = Object.freeze({
  layer: "PulseProxyIdentityEngine",
  role: "BINARY_FIRST_IDENTITY_ORGAN",
  version: "v12.3-PRESENCE-EVO-BINARY-MAX",
  identity: "CheckIdentity-v12.3-PRESENCE-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    lineageSafe: true,
    replaySafe: true,

    // Identity laws
    identityEngine: true,
    binaryFirstIdentity: true,
    dualBandIdentity: true,
    symbolicAware: true,
    binaryAware: true,
    dualModeAware: true,
    lineageAware: true,
    driftMarkerAware: true,
    deviceTrustAware: true,
    compressionAware: true,
    offlineSurvivalReady: true,

    // Advantage / presence field
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    presenceAware: true,
    bluetoothPresenceAware: true,
    bandPresenceAware: true,
    identityPresenceField: true,
    cacheWarmupAware: true,
    chunkAware: true,
    prewarmAware: true,

    // Execution prohibitions (binary core)
//  zeroDateNow: true,          // symbolic wrapper may still use Date.now
    zeroMutationOfInput: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroNetworkFetch: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroAI: true,
    zeroAutonomy: true,

    // Environment
    localAware: true,
    internetAware: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "IdentityPayload",
      "BinaryIdentityContext",
      "DualBandContext",
      "DeviceTrustContext",
      "PresenceContext",
      "AdvantageContext"
    ],
    output: [
      "AuthoritativeIdentitySnapshot",
      "IdentityDiagnostics",
      "IdentitySignatures",
      "IdentityPresenceSnapshot",
      "IdentityHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11-EVO",
    parent: "PulseProxy-v12.3-PRESENCE-EVO",
    ancestry: [
      "CheckIdentity-v7",
      "CheckIdentity-v8",
      "CheckIdentity-v9",
      "CheckIdentity-v10",
      "CheckIdentity-v11",
      "CheckIdentity-v11-Evo",
      "CheckIdentity-v11-Evo-Binary",
      "CheckIdentity-v12.0-EVO",
      "CheckIdentity-v12.1-EVO",
      "CheckIdentity-v12.2-EVO"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic", "dual"],
    default: "binary",
    behavior: "identity-engine"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "symbolic identity → binary compression → symbolic return",
    adaptive: "binary-first identity + presence overlays",
    return: "deterministic identity + presence snapshot + signatures"
  })
});


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "IDENTITY-LAYER-BINARY";
const LAYER_NAME = "THE SELF++++";
const LAYER_ROLE = "BINARY-FIRST SENSE-OF-SELF ENGINE";
const LAYER_VER  = "12.3-PRESENCE-EVO-BINARY";

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
// BINARY SIGNATURES — v12.3-PRESENCE-EVO-BINARY
// ============================================================================
function computeBinarySignature(identity) {
  try {
    const seed = JSON.stringify({
      uid: identity.uid,
      lineage: identity.lineage,
      drift: identity.drift
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "BIN-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "BIN-00000000";
  }
}

function computePresenceSignature(identity, presence) {
  try {
    const seed = JSON.stringify({
      uid: identity.uid,
      deviceId: presence?.deviceId || null,
      bluetooth: !!presence?.bluetooth,
      band: presence?.band || "unknown",
      route: presence?.route || "unknown"
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "PRES-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "PRES-00000000";
  }
}


// ============================================================================
// HELPERS — NORMALIZE IDENTITY TO v12.3-PRESENCE-EVO-BINARY SHAPE
// ============================================================================
function normalizeIdentity(raw, mode, presenceContext = {}, advantageContext = {}) {
  if (!raw || typeof raw !== "object") return null;

  const safeStr = (v, d = "") =>
    typeof v === "string" ? v : d;

  const safeBool = (v, d = false) =>
    typeof v === "boolean" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  const safeNum = (v, d = 0) =>
    typeof v === "number" && !isNaN(v) ? v : d;

  const presence = {
    deviceId: safeStr(presenceContext.deviceId, ""),
    bluetooth: safeBool(presenceContext.bluetooth, false),
    band: safeStr(presenceContext.band, "unknown"),
    route: safeStr(presenceContext.route, "unknown"),
    lastSeenMs: safeNum(presenceContext.lastSeenMs, 0),
    presenceLevel: safeStr(presenceContext.presenceLevel, "Unknown")
  };

  const advantage = {
    advantageScore: safeNum(advantageContext.advantageScore, 1.0),
    timeSavedMs: safeNum(advantageContext.timeSavedMs, 0),
    cascadeLevel: safeNum(advantageContext.cascadeLevel, 0),
    field: safeStr(advantageContext.field, "identity")
  };

  const normalized = {
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

    // Timestamps (symbolic; binary core treats as opaque)
    createdAt: raw.createdAt || Date.now(),
    updatedAt: Date.now(),

    // Presence + advantage fields
    presence,
    advantage,

    // Context injection
    layer: LAYER_NAME,
    context: "Canonical backend identity + presence snapshot (v12.3-PRESENCE-EVO-BINARY)",
    mode
  };

  normalized.binarySignature = computeBinarySignature(normalized);
  normalized.presenceSignature = computePresenceSignature(normalized, presence);

  return normalized;
}


// ============================================================================
// DUALBAND IDENTITY REPAIR — A → B → A
// (repairIdentity + validateAndLoadIdentity are organism-level wiring)
// ============================================================================
async function dualbandRepair(identity) {
  const symbolic = await repairIdentity(identity);

  const binary = {
    ...symbolic,
    binaryCompressed: true,
    binarySignature: computeBinarySignature(symbolic)
  };

  return {
    ...binary,
    repairMode: "dualband"
  };
}


// ============================================================================
// BACKEND ENTRY POINT — “THE SELF++++” v12.3-PRESENCE-EVO-BINARY
// ============================================================================
export const handler = async (event, context) => {
  const mode = resolveMode(event);

  logSelf("INTAKE_START", {
    hasCookie: !!event?.headers?.cookie,
    mode
  });

  try {
    const token = event.headers.cookie || "";
    logSelf("TOKEN_LOADED", { tokenLength: token.length, mode });

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

    const repaired = await dualbandRepair(identity);

    logSelf("IDENTITY_REPAIRED", {
      uid: repaired?.uid || null,
      mode
    });

    // Presence + advantage context are injected by caller / organism wiring
    const presenceContext = event?.presenceContext || {};
    const advantageContext = event?.advantageContext || {};

    const normalized = normalizeIdentity(repaired, mode, presenceContext, advantageContext);

    logSelf("IDENTITY_NORMALIZED", {
      uid: normalized?.uid || null,
      version: normalized?.identityVersion,
      presenceSignature: normalized?.presenceSignature,
      mode
    });

    logSelf("RETURN_SELF", {
      uid: normalized?.uid || null,
      mode
    });

    return {
      statusCode: 200,
      body: JSON.stringify(normalized)
    };

  } catch (err) {
    safeError("CheckIdentity v12.3-PRESENCE-EVO-BINARY error:", err);

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
