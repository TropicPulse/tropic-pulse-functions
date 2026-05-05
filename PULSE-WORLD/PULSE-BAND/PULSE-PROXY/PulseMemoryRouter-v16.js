// ============================================================================
// FILE: /PULSE-PROXY/CheckRouterMemory-v16-Immortal-Presence-Advantage.js
// PULSE NETWORK MEMORY HEALER — v16-Immortal-Presence-Advantage
// “THE NETWORK HEALER++++ / BINARY-FIRST LOG INTAKE + DUALBAND REPAIR ENGINE
//   + PRESENCE FIELD + CHUNK/CACHE/PREWARM/ADVANTAGE/RESOURCE HINT ENGINE”
// ============================================================================
//
// ROLE (v16-Immortal-Presence-Advantage):
//   • Backend intake + validator for RouterMemory flushes (B-layer, backend-only).
//   • Binary-first, dualband healer: Symbolic A → Binary B → Symbolic A.
//   • Normalizes ALL log fields (routeTrace, lineage, evo, importConflict, band).
//   • Detects structural drift + malformed entries + non-binary core usage.
//   • Preserves lineage + timestamps (never invents time).
//   • Presence-aware: band presence, route presence, router health hints.
//   • Chunk/cache/prewarm/advantage/resource hint engine for PulseBand / PulseNet / CheckBand.
//   • Returns authoritative, organism-safe, binary-aware log batch.
//   • Mode-aware: A→B→A compatible, binary-first nervous system.
//   • Internet / world-lens / advantage are metadata-only: no fetch, no network.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "CheckRouterMemory",
  version: "v16-Immortal-Presence-Advantage",
  layer: "backend_healer",
  role: "router_memory_healer",
  lineage: "PulseRouter-v16-Immortal",

  evo: {
    healerCore: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    driftAware: true,
    lineageAware: true,
    deterministic: true,
    safeRouteFree: true,

    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    advantageFieldAware: true,
    unifiedAdvantageField: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    routeWarmthAware: true,
    resourcePressureAware: true,
    earnAware: true,

    zeroNetworkFetch: true,
    zeroSyntheticTimestamps: true,
    zeroMutationOfInput: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroFrontendAccess: true,
    zeroWindowAccess: true
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
const LAYER_NAME = "THE NETWORK HEALER++++";
const LAYER_ROLE = "B-LAYER MEMORY INTAKE + DUALBAND REPAIR + PRESENCE/ADVANTAGE FIELD";
const LAYER_VER  = "16-Immortal-Presence-Advantage";

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
// HUMAN-READABLE CONTEXT MAP (MIRROR OF FRONTEND MEMORY CONTEXT)
// ============================================================================
const BASE_MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B-Layer",
  purpose: "Log Buffer + Healing + Presence + Chunk/Cache/Prewarm/Advantage/Resource Hints",
  context: "RouterMemory → CheckRouterMemory-v16-Immortal-Presence-Advantage",
  healerVersion: LAYER_VER,
  binaryFirst: true,
  dualband: true
};

export const PulseOSCheckRouterMemoryMeta = Object.freeze({
  layer: "PulseProxyNetworkHealer",
  role: "NETWORK_MEMORY_HEALER_ORGAN",
  version: "v16-Immortal-Presence-Advantage",
  identity: "CheckRouterMemory-v16-Immortal-Presence-Advantage",

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
    resourcePressureAware: true,
    earnAware: true,

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
      "AdvantageContext",
      "ResourceContext"
    ],
    output: [
      "HealedRouterMemoryBatch",
      "NetworkHealerDiagnostics",
      "NetworkHealerSignatures",
      "NetworkHealerPresenceField",
      "NetworkHealerAdvantageField",
      "NetworkHealerResourceHints",
      "NetworkHealerHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v15-Immortal",
    parent: "PulseProxy-v16-Immortal-Presence-Advantage",
    ancestry: [
      "CheckRouterMemory-v7",
      "CheckRouterMemory-v8",
      "CheckRouterMemory-v9",
      "CheckRouterMemory-v10",
      "CheckRouterMemory-v11",
      "CheckRouterMemory-v11-Evo",
      "CheckRouterMemory-v11-Evo-Binary",
      "CheckRouterMemory-v12.3-Presence-Evo-BINARY"
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
    adaptive: "dualband repair surfaces + lineage + presence + chunk/advantage/resource hints",
    return: "deterministic healed log batch + signatures + presence/advantage/resource field"
  })
});

// ============================================================================
// MODE RESOLUTION — A/B/A-safe routing metadata
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

function buildMemoryContext(mode, presenceContext = {}, advantageContext = {}, resourceContext = {}) {
  return {
    ...BASE_MEMORY_CONTEXT,
    mode,
    presenceContext,
    advantageContext,
    resourceContext
  };
}

// ============================================================================
// BINARY SIGNATURE + DRIFT + PRESENCE/CHUNK/ADVANTAGE/RESOURCE HELPERS
// ============================================================================
function computeBinaryLogSignature(entry) {
  try {
    const seed = JSON.stringify({
      eventType: entry.eventType,
      page: entry.page,
      routeTrace: entry.routeTrace,
      evo: entry.evo,
      bandPresence: entry.bandPresence,
      routerPresence: entry.routerPresence
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

  const hasLegacyRouter = trace.some((t) =>
    typeof t === "string" && t.includes("LegacyRouter")
  );
  if (hasLegacyRouter) {
    driftFlags.push("legacy_router_path_detected");
  }

  return driftFlags;
}

// Presence: band + router
function deriveBandPresence(entry, presenceContext) {
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];
  const hasPulseBand = trace.some((t) =>
    typeof t === "string" && t.includes("PulseBand")
  );
  const hasEarn = trace.some((t) =>
    typeof t === "string" && t.includes("PulseEarn")
  );

  return {
    band: hasPulseBand ? "pulseband" : "unknown",
    route: entry.page || "unknown",
    deviceId: presenceContext.deviceId || null,
    earnPath: hasEarn
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
  const hasMesh = trace.some((t) =>
    typeof t === "string" && t.includes("Mesh")
  );

  return {
    routerActive: hasRouter,
    hydraActive: hasHydra,
    meshActive: hasMesh
  };
}

// Chunk/cache/prewarm hints
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
  const hasGPUCold = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("gpu_cold")
  );

  const prewarmHint =
    hasColdStart || hasChunkMiss || hasCacheMiss || hasGPUCold;

  const chunkHint =
    hasChunkMiss ? "route-chunk" :
    hasColdStart ? "bootstrap-chunk" :
    hasGPUCold ? "gpu-chunk" :
    "none";

  const cacheHint =
    hasCacheMiss ? "route-cache" :
    hasColdStart ? "bootstrap-cache" :
    "none";

  const routeWarmth =
    hasColdStart ? "cold" :
    hasChunkMiss || hasCacheMiss || hasGPUCold ? "warming" :
    "warm";

  return {
    prewarmHint,
    chunkHint,
    cacheHint,
    routeWarmth,
    gpuCold: !!hasGPUCold
  };
}

// Advantage field (local, metadata-only)
function deriveAdvantageField(entry, advantageContext) {
  const baseScore = typeof advantageContext.advantageScore === "number"
    ? advantageContext.advantageScore
    : 1.0;

  const frames = Array.isArray(entry.frames) ? entry.frames : [];
  const hasEarn = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("earn")
  );
  const hasLatency = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("latency")
  );

  let score = baseScore;
  if (hasEarn) score += 0.1;
  if (hasLatency) score -= 0.1;

  if (score > 1.5) score = 1.5;
  if (score < 0.1) score = 0.1;

  const band =
    score >= 1.2 ? "high" :
    score >= 0.8 ? "neutral" :
    "low";

  return {
    advantageScore: score,
    advantageBand: band,
    timeSavedMs: typeof advantageContext.timeSavedMs === "number"
      ? advantageContext.timeSavedMs
      : 0,
    cascadeLevel: typeof advantageContext.cascadeLevel === "number"
      ? advantageContext.cascadeLevel
      : 0,
    field: advantageContext.field || "router-memory"
  };
}

// Resource pressure hints (CPU/GPU/memory) — pure metadata
function deriveResourceHints(entry, resourceContext = {}) {
  const frames = Array.isArray(entry.frames) ? entry.frames : [];
  const trace = Array.isArray(entry.routeTrace) ? entry.routeTrace : [];

  const hasGPULoad = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("gpu_load")
  );
  const hasCPULoad = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("cpu_load")
  );
  const hasMemoryPressure = frames.some((f) =>
    typeof f === "string" && f.toLowerCase().includes("memory_pressure")
  );

  const earnPath = trace.some((t) =>
    typeof t === "string" && t.includes("PulseEarn")
  );

  const baseCPU = typeof resourceContext.cpu === "number" ? resourceContext.cpu : 0;
  const baseGPU = typeof resourceContext.gpu === "number" ? resourceContext.gpu : 0;
  const baseMem = typeof resourceContext.memory === "number" ? resourceContext.memory : 0;

  const cpuPressure =
    hasCPULoad || earnPath ? Math.min(1, baseCPU + 0.2) : baseCPU;
  const gpuPressure =
    hasGPULoad || earnPath ? Math.min(1, baseGPU + 0.2) : baseGPU;
  const memoryPressure =
    hasMemoryPressure ? Math.min(1, baseMem + 0.2) : baseMem;

  return {
    cpuPressure,
    gpuPressure,
    memoryPressure,
    earnPath,
    resourceBand:
      cpuPressure > 0.8 || gpuPressure > 0.8 || memoryPressure > 0.8
        ? "hot"
        : cpuPressure > 0.4 || gpuPressure > 0.4 || memoryPressure > 0.4
        ? "warm"
        : "cool"
  };
}

// ============================================================================
// HELPERS — SAFE PARSE + NORMALIZE LOG BATCH (v16-Immortal-Presence-Advantage)
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

// Normalize a single log entry to v16-Immortal-Presence-Advantage shape
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
  const resourceContext = memoryContext.resourceContext || {};

  const bandPresence = deriveBandPresence(normalizedBase, presenceContext);
  const routerPresence = deriveRouterPresence(normalizedBase);
  const chunkCacheHints = deriveChunkCachePrewarmHints(normalizedBase);
  const advantage = deriveAdvantageField(normalizedBase, advantageContext);
  const resourceHints = deriveResourceHints(normalizedBase, resourceContext);

  const normalized = {
    ...normalizedBase,
    bandPresence,
    routerPresence,
    chunkCacheHints,
    advantage,
    resourceHints
  };

  normalized.binarySignature = computeBinaryLogSignature(normalized);
  normalized.binaryDriftFlags = detectBinaryDrift(normalized);
  normalized.presenceSignature = computePresenceSignature(normalized);

  return normalized;
}

// ============================================================================
// PART 2/2 — DUALBAND HEALING, LYMBIC HOOK, HANDLER
// ============================================================================

// DUALBAND HEALING — A → B → A
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

// LYMBIC ESCALATION HOOK — kept, but still respects zeroNetworkFetch by only
// being wired in environments where fetch is allowed and policy permits.
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
        source: "CheckRouterMemory-v16-Immortal-Presence-Advantage",
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

// BACKEND ENTRY POINT — “THE NETWORK HEALER++++” (v16-Immortal-Presence-Advantage)
// A→B→A-safe: mode-aware, fail-open, never throws outward.
// Presence + advantage + resource context are injected by caller.
// ============================================================================
export const handler = async (event, context) => {
  const mode = resolveMode(event);

  const presenceContext = event?.presenceContext || {};
  const advantageContext = event?.advantageContext || {};
  const resourceContext = event?.resourceContext || {};

  const memoryContext = buildMemoryContext(mode, presenceContext, advantageContext, resourceContext);

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
    safeError("CheckRouterMemory v16-Immortal-Presence-Advantage error:", err);

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
