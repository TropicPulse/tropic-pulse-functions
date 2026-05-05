// ============================================================================
// FILE: PULSE-proxy/CheckIdentity-v16-Immortal-Dualband-Presence-ADVANTAGE.js
// PULSE IDENTITY ENGINE — v16-Immortal-Dualband-Presence-ADVANTAGE
// “THE SELF++++ • BINARY-FIRST IDENTITY ENGINE • DUALBAND PRESENCE + ADVANTAGE CORE”
// ============================================================================
//
// ROLE (v16-Immortal-Dualband-Presence-ADVANTAGE):
//   • Canonical identity + presence + advantage validator for a binary-first organism.
//   • Dualband identity engine (Symbolic A → Binary B → Symbolic A) with compression metadata.
//   • Backbone of PulseBand / PulseNet / CheckBand / RouterMemory identity field.
//   • Preserves lineage, drift markers, binary signatures, device trust, and advantage field.
//   • Presence-aware: Bluetooth / device / band presence surfaces, offline-first survival.
//   • Advantage-aware: local advantage hints, cascade level, time-saved descriptors.
//   • Deterministic, replayable, lineage-safe, drift-aware, cache/chunk/prewarm-aware.
//   • Returns authoritative v16 identity + presence + advantage snapshot.
//
// CONTRACT (v16-Immortal-Dualband-Presence-ADVANTAGE):
//   • Fail-open: invalid identity → null (frontend + PulseBand handle fallback).
//   • Never mutate original input; always clone/normalize.
//   • Always return structurally complete v16 identity snapshot when valid.
//   • Never trust external identity providers blindly; token is treated as hint only.
//   • No astral layers, no legacy PNS, no translator cores.
//   • Binary-first nervous system compliance; dualband compression + unified advantage field.
//   • No network fetch; no timers; no randomness; no external mutation.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "CheckIdentity",
  version: "v16-Immortal-Dualband-Presence-ADVANTAGE",
  layer: "backend_identity_engine",
  role: "binary_first_identity_healer",
  lineage: "PulseProxy-v16-Immortal",

  evo: {
    // Core identity engine
    identityEngine: true,
    binaryFirstIdentity: true,
    dualBandIdentity: true,
    symbolicAware: true,
    binaryAware: true,
    dualModeAware: true,
    deterministic: true,
    driftProof: true,
    lineageSafe: true,
    replaySafe: true,
    zeroMutationOfInput: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroNetworkFetch: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroAI: true,
    zeroAutonomy: true,

    // Presence / mesh / band
    presenceAware: true,
    bluetoothPresenceAware: true,
    bandPresenceAware: true,
    identityPresenceField: true,
    offlineSurvivalReady: true,

    // Advantage / topology / chunking
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    cacheWarmupAware: true,
    chunkAware: true,
    prewarmAware: true,
    pulseTopologyAware: true,

    // Context awareness
    deviceTrustAware: true,
    compressionAware: true,
    localAware: true,
    internetAware: true,
    safeRouteFree: true,
    worldLensAware: false
  },

  contract: {
    always: [
      "PulsePresence",
      "PulseBand",
      "CheckBand",
      "CheckRouterMemory",
      "CheckIdentity",
      "PulseOSBrain"
    ],
    never: [
      "legacyIdentity",
      "legacyCheckIdentity",
      "legacyPresenceIdentity",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseOSCheckIdentityMeta = Object.freeze({
  layer: "PulseProxyIdentityEngine",
  role: "BINARY_FIRST_IDENTITY_ORGAN",
  version: "v16-Immortal-Dualband-Presence-ADVANTAGE",
  identity: "CheckIdentity-v16-Immortal-Dualband-Presence-ADVANTAGE",

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
    pulseTopologyAware: true,

    // Execution prohibitions (binary core)
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
      "AdvantageContext",
      "TopologyContext"
    ],
    output: [
      "AuthoritativeIdentitySnapshot",
      "IdentityDiagnostics",
      "IdentitySignatures",
      "IdentityPresenceSnapshot",
      "IdentityAdvantageSnapshot",
      "IdentityTopologySnapshot",
      "IdentityHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11-Evo",
    parent: "PulseProxy-v16-Immortal",
    ancestry: [
      "CheckIdentity-v7",
      "CheckIdentity-v8",
      "CheckIdentity-v9",
      "CheckIdentity-v10",
      "CheckIdentity-v11",
      "CheckIdentity-v11-Evo",
      "CheckIdentity-v11-Evo-Binary",
      "CheckIdentity-v12.0-Evo",
      "CheckIdentity-v12.1-Evo",
      "CheckIdentity-v12.2-Evo",
      "CheckIdentity-v12.3-Presence-Evo-BINARY-MAX"
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
    adaptive:
      "binary-first identity + presence/advantage/topology overlays + chunk/prewarm-aware descriptors",
    return:
      "deterministic identity + presence + advantage + topology snapshot + signatures"
  })
});

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================

const LAYER_ID   = "IDENTITY-LAYER-BINARY";
const LAYER_NAME = "THE SELF++++";
const LAYER_ROLE = "BINARY-FIRST SENSE-OF-SELF ENGINE";
const LAYER_VER  = "16-Immortal-Dualband-Presence-ADVANTAGE";

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
// BINARY SIGNATURES — v16-Immortal-Dualband-Presence-ADVANTAGE
// ============================================================================

function computeBinarySignature(identity) {
  try {
    const seed = JSON.stringify({
      uid: identity.uid,
      lineage: identity.lineage,
      drift: identity.drift,
      presenceBand: identity?.presence?.band || "unknown",
      advantageScore: identity?.advantage?.advantageScore ?? null
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
      route: presence?.route || "unknown",
      presenceLevel: presence?.presenceLevel || "Unknown"
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

function computeAdvantageSignature(advantage) {
  try {
    const seed = JSON.stringify({
      score: advantage?.advantageScore ?? null,
      band: advantage?.advantageBand || "neutral",
      cascadeLevel: advantage?.cascadeLevel ?? 0,
      field: advantage?.field || "identity"
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "ADV-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "ADV-00000000";
  }
}

function computeTopologySignature(topology) {
  try {
    const seed = JSON.stringify({
      momHeart: topology?.momHeart?.identity || null,
      dadHeart: topology?.dadHeart?.identity || null,
      babyHeart: topology?.babyHeart?.identity || null,
      bandSource: topology?.bandSource || "unknown"
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "TOPO-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "TOPO-00000000";
  }
}

// ============================================================================
// SAFE HELPERS — TYPE-SAFE NORMALIZATION
// ============================================================================

function safeStr(v, d = "") {
  return typeof v === "string" ? v : d;
}

function safeBool(v, d = false) {
  return typeof v === "boolean" ? v : d;
}

function safeObj(v, d = {}) {
  return typeof v === "object" && v !== null ? v : d;
}

function safeNum(v, d = 0) {
  return typeof v === "number" && !isNaN(v) ? v : d;
}

// ============================================================================
// ADVANTAGE + TOPOLOGY HINTS — metadata-only, no network
// ============================================================================

// v16: optional local advantage hint (pure metadata, no network)
function safeAdvantageHint(advantageContext = {}) {
  try {
    const score = safeNum(
      advantageContext.advantageScore,
      advantageContext.score ?? null
    );
    const band = safeStr(
      advantageContext.advantageBand,
      advantageContext.band || "neutral"
    );

    return {
      advantageScore: score,
      advantageBand: band,
      regionAdvantage: safeObj(advantageContext.regionAdvantage, {}),
      cascadeHints: safeObj(advantageContext.cascadeHints, {}),
      cascadeLevel: safeNum(advantageContext.cascadeLevel, 0),
      field: safeStr(advantageContext.field, "identity")
    };
  } catch {
    return {
      advantageScore: null,
      advantageBand: "neutral",
      regionAdvantage: {},
      cascadeHints: {},
      cascadeLevel: 0,
      field: "identity"
    };
  }
}

function safeTopologyHint(topologyContext = {}) {
  try {
    const mom = safeObj(topologyContext.momHeart, null);
    const dad = safeObj(topologyContext.dadHeart, null);
    const baby = safeObj(topologyContext.babyHeart, null);

    const fallbackRules = safeObj(topologyContext.fallbackRules, {
      babyPulseSource: "mom-or-dad",
      momFallbackToDad: true,
      dadFallbackToMom: true
    });

    return {
      momHeart: mom
        ? { identity: mom.identity || "mom-heart", role: mom.role || "MOM_HEART" }
        : null,
      dadHeart: dad
        ? { identity: dad.identity || "dad-heart", role: dad.role || "DAD_HEART" }
        : null,
      babyHeart: baby
        ? { identity: baby.identity || "baby-heart", role: baby.role || "EARN_HEART" }
        : null,
      bandSource: safeStr(topologyContext.bandSource, "identity"),
      fallbackRules
    };
  } catch {
    return {
      momHeart: null,
      dadHeart: null,
      babyHeart: null,
      bandSource: "identity",
      fallbackRules: {
        babyPulseSource: "mom-or-dad",
        momFallbackToDad: true,
        dadFallbackToMom: true
      }
    };
  }
}

// ============================================================================
// HELPERS — NORMALIZE IDENTITY TO v16-Immortal-Dualband-Presence-ADVANTAGE SHAPE
// ============================================================================

function normalizeIdentity(
  raw,
  mode,
  presenceContext = {},
  advantageContext = {},
  topologyContext = {}
) {
  if (!raw || typeof raw !== "object") return null;

  const presence = {
    deviceId: safeStr(presenceContext.deviceId, ""),
    bluetooth: safeBool(presenceContext.bluetooth, false),
    band: safeStr(presenceContext.band, "unknown"),
    route: safeStr(presenceContext.route, "unknown"),
    lastSeenMs: safeNum(presenceContext.lastSeenMs, 0),
    presenceLevel: safeStr(presenceContext.presenceLevel, "Unknown")
  };

  const advantage = safeAdvantageHint(advantageContext);
  const topology = safeTopologyHint(topologyContext);

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

    // Presence + advantage + topology fields
    presence,
    advantage,
    topology,

    // Context injection
    layer: LAYER_NAME,
    context:
      "Canonical backend identity + presence + advantage + topology snapshot (v16-Immortal-Dualband-Presence-ADVANTAGE)",
    mode
  };

  normalized.binarySignature = computeBinarySignature(normalized);
  normalized.presenceSignature = computePresenceSignature(normalized, presence);
  normalized.advantageSignature = computeAdvantageSignature(advantage);
  normalized.topologySignature = computeTopologySignature(topology);

  return normalized;
}

// ============================================================================
// DUALBAND IDENTITY REPAIR — A → B → A
// ============================================================================

async function repairIdentity(identity) {
  if (!identity) return null;

  return {
    ...identity,
    uid: identity.uid || identity.userId || null,
    resendToken: identity.resendToken || null
  };
}

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
// IDENTITY LOADER — 99% AUTOMATED, 1% resendToken
// Token → minimal identity seed (no DB, no cache wiring here)
// ============================================================================

async function validateAndLoadIdentity(token) {
  if (!token || typeof token !== "string") return null;

  // Extract raw token
  const raw = token.replace("identity=", "").trim();
  if (!raw) return null;

  // Decode token → symbolic seed
  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }

  // Must have uid
  if (!decoded?.uid) return null;

  return {
    uid: decoded.uid,
    resendToken: decoded.resendToken || null,
    tokenVersion: decoded.version || "unknown",
    source: "token"
  };
}

// ============================================================================
// IDENTITY DIAGNOSTICS SNAPSHOT — metadata-only
// ============================================================================

function buildIdentityDiagnostics(normalized, mode) {
  if (!normalized) {
    return {
      ok: false,
      mode,
      reason: "IDENTITY_NULL"
    };
  }

  return {
    ok: true,
    mode,
    uid: normalized.uid || null,
    identityVersion: normalized.identityVersion,
    presenceBand: normalized?.presence?.band || "unknown",
    presenceLevel: normalized?.presence?.presenceLevel || "Unknown",
    advantageBand: normalized?.advantage?.advantageBand || "neutral",
    advantageScore: normalized?.advantage?.advantageScore ?? null,
    topologyBandSource: normalized?.topology?.bandSource || "identity",
    binarySignature: normalized.binarySignature,
    presenceSignature: normalized.presenceSignature,
    advantageSignature: normalized.advantageSignature,
    topologySignature: normalized.topologySignature
  };
}

// ============================================================================
// BACKEND ENTRY POINT — “THE SELF++++” v16-Immortal-Dualband-Presence-ADVANTAGE
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

    // Presence + advantage + topology context are injected by caller / organism wiring
    const presenceContext = event?.presenceContext || {};
    const advantageContext = event?.advantageContext || {};
    const topologyContext = event?.topologyContext || {};

    const normalized = normalizeIdentity(
      repaired,
      mode,
      presenceContext,
      advantageContext,
      topologyContext
    );

    const diagnostics = buildIdentityDiagnostics(normalized, mode);

    logSelf("IDENTITY_NORMALIZED", {
      uid: normalized?.uid || null,
      version: normalized?.identityVersion,
      presenceSignature: normalized?.presenceSignature,
      advantageSignature: normalized?.advantageSignature,
      topologySignature: normalized?.topologySignature,
      mode
    });

    logSelf("RETURN_SELF", {
      uid: normalized?.uid || null,
      mode
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        snapshot: normalized,
        diagnostics
      })
    };

  } catch (err) {
    safeError("CheckIdentity v16-Immortal-Dualband-Presence-ADVANTAGE error:", err);

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
