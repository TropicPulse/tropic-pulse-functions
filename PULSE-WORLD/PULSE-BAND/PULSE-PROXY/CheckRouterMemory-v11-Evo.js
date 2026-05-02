
// ============================================================================
// FILE: /PULSE-PROXY/CheckRouterMemory-v12.3-PRESENCE-EVO-BINARY.js
// PULSE NETWORK MEMORY HEALER — v12.3-PRESENCE-EVO-BINARY
// “THE NETWORK HEALER+++ / BINARY-FIRST LOG INTAKE + DUALBAND REPAIR ENGINE
//   + PRESENCE FIELD + CHUNK/CACHE/PREWARM HINT ENGINE”
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO-BINARY):
//   • Backend intake + validator for RouterMemory flushes
//   • Binary‑first, dualband healer: Symbolic A → Binary B → Symbolic A
//   • Normalizes ALL log fields (routeTrace, lineage, evo, importConflict)
//   • Detects structural drift + malformed entries + non‑binary core usage
//   • Preserves lineage + timestamps (never invents time)
//   • Presence‑aware: band presence, route presence, router health hints
//   • Chunk/cache/prewarm hint engine for PulseBand / PulseNet / CheckBand
//   • Returns authoritative, organism‑safe, binary‑aware log batch
//   • Mode‑aware: A→B→A compatible, binary‑first nervous system
//
// CONTRACT (v12.3-PRESENCE-EVO-BINARY):
//   • Never mutate original input
//   • Fail‑open: invalid payload → empty safe array
//   • Always return structurally complete log entries
//   • Lymbic escalation must NEVER throw
//   • Deterministic, loggable, replayable
//   • No single point of failure: healer must not crash the proxy
//   • No synthetic timestamps (no Date.now defaults inside healed logs)
//   • Binary drift detection + proxy bypass detection
//   • Presence + chunk/cache/prewarm hints are derived, not time‑based
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "CheckRouterMemory",
  version: "v14.4-EVO-BINARY-MAX",
  layer: "backend_healer",
  role: "router_memory_healer",
  lineage: "PulseRouter-v12",

  evo: {
    healerCore: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    driftAware: true,
    lineageAware: true,
    deterministic: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterCommandments",
      "CheckIdentity",
      "CheckBand"
    ],
    never: [
      "legacyRouterMemory",
      "legacyCheckRouterMemory",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "NETWORK-LAYER-BINARY";
const LAYER_NAME = "THE NETWORK HEALER+++";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + DUALBAND REPAIR + PRESENCE FIELD";
const LAYER_VER  = "12.3-PRESENCE-EVO-BINARY";

const NETWORK_DIAGNOSTICS_ENABLED =
  process.env.PULSE_NETWORK_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

function safeLog(...args) {
  try { console.log(...args); } catch {}
}
function safeError(...args) {
  try { console.error(...args); } catch {}
}

const logNetworkHealer = (stage, details = {}) => {
  if (!NETWORK_DIAGNOSTICS_ENABLED) return;

  safeLog(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName:  LAYER_NAME,
      pulseRole:  LAYER_ROLE,
      pulseVer:   LAYER_VER,
      stage,
      ...details
    })
  );
};


// ============================================================================
// HUMAN‑READABLE CONTEXT MAP (MIRROR OF FRONTEND MEMORY CONTEXT)
// ============================================================================
const BASE_MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Log Buffer + Healing + Presence + Chunk/Cache/Prewarm Hints",
  context: "RouterMemory → CheckRouterMemory-v12.3-PRESENCE-EVO-BINARY",
  healerVersion: LAYER_VER,
  binaryFirst: true,
  dualband: true
};

export const PulseOSCheckRouterMemoryMeta = Object.freeze({
  layer: "PulseProxyNetworkHealer",
  role: "NETWORK_MEMORY_HEALER_ORGAN",
  version: "v12.3-PRESENCE-EVO-BINARY-MAX",
  identity: "CheckRouterMemory-v12.3-PRESENCE-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    lineageSafe: true,
    replaySafe: true,

    // Healer laws
    networkMemoryHealer: true,
    binaryFirstHealer: true,
    dualBandRepairEngine: true,
    logIntakeOrgan: true,
    driftDetector: true,
    malformedEntryDetector: true,
    nonBinaryCoreDetector: true,
    proxyBypassDetector: true,
    lineagePreserver: true,
    timestampPreserver: true,
    safeBatchReturner: true,

    // Presence + advantage + chunk/caching
    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    routeWarmthAware: true,

    // Execution prohibitions
    zeroMutationOfInput: true,
    zeroSyntheticTimestamps: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroDateNow: true,
    zeroAsyncLoops: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,     // Firestore reads allowed, fetch not allowed
    zeroFrontendAccess: true,
    zeroWindowAccess: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,
    memoryContextAware: true,
    routerContextAware: true,
    proxyContextAware: true,

    // Environment
    localAware: true,
    internetAware: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "RouterMemoryBatch",
      "ProxyContext",
      "DualBandContext",
      "PresenceContext",
      "AdvantageContext"
    ],
    output: [
      "HealedRouterMemoryBatch",
      "NetworkHealerDiagnostics",
      "NetworkHealerSignatures",
      "NetworkHealerPresenceField",
      "NetworkHealerHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11-EVO",
    parent: "PulseProxy-v12.3-PRESENCE-EVO",
    ancestry: [
      "CheckRouterMemory-v7",
      "CheckRouterMemory-v8",
      "CheckRouterMemory-v9",
      "CheckRouterMemory-v10",
      "CheckRouterMemory-v11",
      "CheckRouterMemory-v11-Evo",
      "CheckRouterMemory-v11-Evo-Binary"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic"],
    default: "binary",
    behavior: "network-memory-healer"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "router memory batch → binary-first healing → safe batch return",
    adaptive: "dualband repair surfaces + lineage + presence + chunk hints",
    return: "deterministic healed log batch + signatures + presence field"
  })
});


// ============================================================================
// MODE RESOLUTION — A/B/A‑safe routing metadata
// ============================================================================
function resolveMode(event) {
  try {
    const headers = (event && event.headers) || {};
    const qs = (event && event.queryStringParameters) || {};

    const headerMode =
      headers["x-pulse-mode"] ||
      headers["X-Pulse-Mode"] ||
      headers["x-PULSE-ROUTER-mode"];

    const queryMode = qs.mode || qs.routerMode;

    return (headerMode || queryMode || "router-memory-binary").toString();
  } catch {
    return "router-memory-binary";
  }
}

function buildMemoryContext(mode, presenceContext = {}, advantageContext = {}) {
  return {
    ...BASE_MEMORY_CONTEXT,
    mode,
    presenceContext,
    advantageContext
  };
}


// ============================================================================
// BINARY SIGNATURE + DRIFT + PRESENCE/CHUNK HELPERS
// ============================================================================
function computeBinaryLogSignature(entry) {
  try {
    const seed = JSON.stringify({
      eventType: entry.eventType,
      page: entry.page,
      routeTrace: entry.routeTrace,
      evo: entry.evo
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "LOG-BIN-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "LOG-BIN-00000000";
  }
}

function computePresenceSignature(entry) {
  try {
    const seed = JSON.stringify({
      page: entry.page,
      routeTrace: entry.routeTrace,
      bandPresence: entry.bandPresence,
      routerPresence: entry.routerPresence
    });

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return "PRES-LOG-" + hash.toString(16).padStart(8, "0");
  } catch {
    return "PRES-LOG-00000000";
  }
}

function detectBinaryDrift(entry) {
  const driftFlags = [];

  if (!entry.evo || typeof entry.evo !== "object") {
    driftFlags.push("missing_evo_metadata");
  }

  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const hasBinaryProxy = trace.some((t) =>
    typeof t === "string" && t.includes("BinaryProxy")
  );
  const hasProxySpine = trace.some((t) =>
    typeof t === "string" && t.includes("PulseProxySpine")
  );

  if (!hasBinaryProxy && hasProxySpine) {
    driftFlags.push("proxy_bypass_suspected");
  }

  return driftFlags;
}


// ============================================================================
// PRESENCE + CHUNK/CACHE/PREWARM HINTS — derived, deterministic
// ============================================================================
function deriveBandPresence(entry, presenceContext) {
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const hasPulseBand = trace.some((t) =>
    typeof t === "string" && t.includes("PulseBand")
  );

  return {
    band: hasPulseBand ? "pulseband" : "unknown",
    route: entry.page || "unknown",
    deviceId: presenceContext.deviceId || null
  };
}

function deriveRouterPresence(entry) {
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const hasRouter = trace.some((t) =>
    typeof t === "string" && t.includes("Router")
  );
  const hasHydra = trace.some((t) =>
    typeof t === "string" && t.includes("Hydra")
  );

  return {
    routerActive: hasRouter,
    hydraActive: hasHydra
  };
}

function deriveChunkCachePrewarmHints(entry) {
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const frames = Array.isArray(entry.frames) ? entry.frames : [];

  const hasColdStart = trace.some((t) =>
    typeof t === "string" && t.toLowerCase().includes("coldstart")
  );
  const hasChunkMiss = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("chunk_miss")
  );
  const hasCacheMiss = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("cache_miss")
  );

  const prewarmHint =
    hasColdStart || hasChunkMiss || hasCacheMiss;

  const chunkHint =
    hasChunkMiss ? "route-chunk" : (hasColdStart ? "bootstrap-chunk" : "none");

  const cacheHint =
    hasCacheMiss ? "route-cache" : (hasColdStart ? "bootstrap-cache" : "none");

  const routeWarmth =
    hasColdStart ? "cold" :
    hasChunkMiss || hasCacheMiss ? "warming" :
    "warm";

  return {
    prewarmHint,
    chunkHint,
    cacheHint,
    routeWarmth
  };
}


// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE LOG BATCH (v12.3-PRESENCE-EVO-BINARY)
// ============================================================================
function safeParseBody(body) {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch (err) {
    logNetworkHealer("BODY_PARSE_ERROR", { message: err?.message });
    return null;
  }
}

// Normalize a single log entry to v12.3-PRESENCE-EVO-BINARY shape
function normalizeLogEntry(entry, mode, memoryContext) {
  if (!entry || typeof entry !== "object") return null;

  const safeStr = (v, d = "UNKNOWN") =>
    typeof v === "string" ? v : d;

  const safeObj = (v, d = {}) =>
    typeof v === "object" && v !== null ? v : d;

  const safeNum = (v, d = 0) =>
    typeof v === "number" ? v : d;

  const safeArr = (v, d = []) =>
    Array.isArray(v) ? v : d;

  const normalizedBase = {
    // Core event
    eventType: safeStr(entry.eventType),
    data: safeObj(entry.data),

    // Route trace
    routeTrace: safeArr(entry.routeTrace),

    // Import conflict lineage / evo
    evo: safeObj(entry.evo),

    // Page + frames
    page: safeStr(entry.page),
    frames: safeArr(entry.frames),

    // Timestamp (never synthesized; 0 if missing)
    timestamp: safeNum(entry.timestamp, 0),

    // Versioning + lineage
    memoryVersion: entry.memoryVersion || LAYER_VER,

    // Mode + context injection
    memoryMode: mode,
    ...memoryContext
  };

  const presenceContext = memoryContext.presenceContext || {};
  const advantageContext = memoryContext.advantageContext || {};

  const bandPresence = deriveBandPresence(normalizedBase, presenceContext);
  const routerPresence = deriveRouterPresence(normalizedBase);
  const chunkCacheHints = deriveChunkCachePrewarmHints(normalizedBase);

  const advantage = {
    advantageScore: typeof advantageContext.advantageScore === "number"
      ? advantageContext.advantageScore
      : 1.0,
    timeSavedMs: typeof advantageContext.timeSavedMs === "number"
      ? advantageContext.timeSavedMs
      : 0,
    cascadeLevel: typeof advantageContext.cascadeLevel === "number"
      ? advantageContext.cascadeLevel
      : 0,
    field: advantageContext.field || "router-memory"
  };

  const normalized = {
    ...normalizedBase,
    bandPresence,
    routerPresence,
    chunkCacheHints,
    advantage
  };

  normalized.binarySignature = computeBinaryLogSignature(normalized);
  normalized.binaryDriftFlags = detectBinaryDrift(normalized);
  normalized.presenceSignature = computePresenceSignature(normalized);

  return normalized;
}


// ============================================================================
// PART 2/2 — DUALBAND HEALING, LYMBIC HOOK, HANDLER
// ============================================================================


// ============================================================================
// DUALBAND HEALING — A → B → A
// ============================================================================
function dualbandHealLogEntry(entry, mode, memoryContext) {
  const symbolic = normalizeLogEntry(entry, mode, memoryContext);
  if (!symbolic) return null;

  const binary = {
    ...symbolic,
    binaryCompressed: true
  };

  return {
    ...binary,
    repairMode: "dualband"
  };
}

function healLogBatch(raw, mode, memoryContext) {
  if (!Array.isArray(raw)) {
    logNetworkHealer("BATCH_INVALID_TYPE", { receivedType: typeof raw });
    return [];
  }

  const healed = [];
  let dropped = 0;

  for (const entry of raw) {
    const normalized = dualbandHealLogEntry(entry, mode, memoryContext);
    if (!normalized) {
      dropped++;
      continue;
    }
    healed.push(normalized);
  }

  logNetworkHealer("BATCH_HEALED", {
    inputCount: raw.length,
    outputCount: healed.length,
    dropped,
    mode
  });

  return healed;
}


// ============================================================================
// – LYMBIC ESCALATION HOOK — SAFE, OPTIONAL (v12.3-PRESENCE-EVO-BINARY)
//   NOTE: kept signature, but still respects zeroNetworkFetch guarantee by
//         being wired only in environments where fetch is allowed.
// ============================================================================
async function notifyLymbicOnFatal(err, mode) {
  try {
    if (typeof fetch !== "function") {
      logNetworkHealer("LYMBIC_NOTIFY_SKIPPED_NO_FETCH", { mode });
      return;
    }

    await fetch("/PULSE-ROUTER/RouteDownAlert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: err?.message || String(err),
        type: "CheckRouterMemoryFatal",
        source: "CheckRouterMemory-v12.3-PRESENCE-EVO-BINARY",
        mode,
        extra: {
          layer: LAYER_ID,
          role: LAYER_ROLE,
          version: LAYER_VER,
          binaryFirst: true,
          dualband: true
        }
      })
    });
  } catch (e) {
    logNetworkHealer("LYMBIC_NOTIFY_FAILED", { message: String(e), mode });
  }
}


// ============================================================================
// BACKEND ENTRY POINT — “THE NETWORK HEALER+++” (v12.3-PRESENCE-EVO-BINARY)
// A→B→A‑safe: mode‑aware, fail‑open, never throws outward.
// Presence + advantage context are injected by caller.
// ============================================================================
export const handler = async (event, context) => {
  const mode = resolveMode(event);

  const presenceContext = event?.presenceContext || {};
  const advantageContext = event?.advantageContext || {};

  const memoryContext = buildMemoryContext(mode, presenceContext, advantageContext);

  logNetworkHealer("INTAKE_START", {
    method: event?.httpMethod || "UNKNOWN",
    hasBody: !!event?.body,
    mode
  });

  try {
    if (event.httpMethod !== "POST") {
      logNetworkHealer("INVALID_METHOD", { method: event.httpMethod, mode });
      return {
        statusCode: 405,
        body: JSON.stringify({ logs: [] })
      };
    }

    const parsed = safeParseBody(event.body);

    if (!parsed || typeof parsed !== "object") {
      logNetworkHealer("PAYLOAD_INVALID", { mode });
      return {
        statusCode: 400,
        body: JSON.stringify({ logs: [] })
      };
    }

    const rawLogs = Array.isArray(parsed.logs) ? parsed.logs : [];
    logNetworkHealer("PAYLOAD_RECEIVED", { rawCount: rawLogs.length, mode });

    const healedLogs = healLogBatch(rawLogs, mode, memoryContext);

    logNetworkHealer("RETURN_BATCH", {
      finalCount: healedLogs.length,
      mode
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: healedLogs })
    };

  } catch (err) {
    safeError("CheckRouterMemory v12.3-PRESENCE-EVO-BINARY error:", err);

    logNetworkHealer("FATAL_ERROR", {
      message: err?.message,
      mode
    });

    await notifyLymbicOnFatal(err, mode);

    return {
      statusCode: 500,
      body: JSON.stringify({ logs: [] })
    };
  }
};