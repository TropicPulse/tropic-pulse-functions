// ============================================================================
//  FILE: PulseProxySpineBinary.js
//  PULSE OS v11-EVO — PULSE PROXY SPINE (BINARY CORE)
//  Deterministic Brainstem • Vitals Math • Rate Limit Field • Healability Map
//  PURE BINARY ORGAN — NO IO, NO GLOBALS, NO EXPRESS, NO REDIS, NO MAILER.
// ============================================================================
//
//  ROLE (v11-EVO):
//  --------------
//  • This is the BINARY CORE of PulseProxySpine.
//  • It defines the organism-correct shape of the backend spine:
//      – identity + context
//      – vitals field
//      – rate-limit field
//      – node/region descriptors
//      – healability descriptors
//  • It performs ONLY deterministic, side-effect-free computations.
//  • It is the "brainstem math" that the symbolic spine calls into.
//
//  SAFETY CONTRACT (v11-EVO):
//  --------------------------
//  • No imports.
//  • No globalThis/global/window/process access.
//  • No timers, no Date.now() calls inside helpers (caller passes timestamps).
//  • No IO: no network, no Redis, no mailer, no filesystem.
//  • No logging, no console.*.
//  • Pure functions only — all state passed in, all results returned.
//  • Deterministic for same inputs.
//  • Drift-proof: all shapes and defaults are explicit.
//  • Binary-only: never reaches into OS, Express, or external services.
// ============================================================================


// ============================================================================
//  ORGAN IDENTITY — v11-EVO (Binary Core)
// ============================================================================
export const PulseRoleBinary = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "BackendSpineBinary",
  version: "11.0",
  identity: "PulseProxySpineBinary",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    binaryCore: true,
    dualModeEvolution: true,          // paired with symbolic PulseProxySpine
    noIQ: true,
    noRouting: true,
    noCompute: true,                  // no business compute, only vitals math
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    futureEvolutionReady: true
  }
};
export const PulseProxySpineBinaryMeta = Object.freeze({
  layer: "PulseProxySpineBinary",
  role: "BINARY_BACKEND_SPINE_CORE",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseProxySpineBinary-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,
    zeroDriftCloning: true,

    // Binary spine laws
    binaryCore: true,
    backendOnly: true,
    pureBrainstemMath: true,
    vitalsMath: true,
    rateLimitField: true,
    healabilityField: true,
    nodeRegionDescriptor: true,
    clusterCoherence: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    cognitiveComputeLink: true,

    // Absolute prohibitions
    noImports: true,
    noIO: true,
    noNetwork: true,
    noRedis: true,
    noMailer: true,
    noFilesystem: true,
    noGlobals: true,
    noWindow: true,
    noProcess: true,
    noTimers: true,
    noDateNow: true,
    noAsync: true,
    noRandomness: true,
    noLogging: true,
    noConsole: true,
    noExternalMutation: true,
    noDynamicImports: true,
    noEval: true,

    // Awareness
    binaryAware: true,
    symbolicAware: false,       // symbolic spine calls into this, not vice‑versa
    dualModeEvolution: true,
    futureEvolutionReady: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "BinaryVitalsContext",
      "BinaryRateLimitContext",
      "BinaryNodeRegionContext",
      "BinaryHealabilityContext"
    ],
    output: [
      "BinaryVitalsSnapshot",
      "BinaryRateLimitSnapshot",
      "BinaryNodeRegionSnapshot",
      "BinaryHealabilitySnapshot",
      "BinarySpineSignatures"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "PulseProxySpineBinary-v9",
      "PulseProxySpineBinary-v10",
      "PulseProxySpineBinary-v11",
      "PulseProxySpineBinary-v11-Evo",
      "PulseProxySpineBinary-v11-Evo-Max"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary"],
    default: "binary",
    behavior: "binary-brainstem"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "binary inputs → deterministic brainstem math → binary outputs",
    adaptive: "binary-only backend surfaces",
    return: "pure binary vitals + rate-limit + healability + signatures"
  })
});


// ============================================================================
//  CONTEXT SHAPE — v11-EVO
// ============================================================================
export function createSpineContext({
  layer = "BackendSpine",
  role = "PulseProxySpine",
  purpose = "Unified TPProxy gateway + vitals pump + OS healer feed",
  context = "Backend spine for PulseProxy: routes traffic, exposes vitals, feeds healers",
  version = "11.0",
  target = "proxy-core",
  selfRepairable = true
} = {}) {
  return {
    layer,
    role,
    purpose,
    context,
    version,
    target,
    selfRepairable,
    evo: { ...PulseRoleBinary.evo }
  };
}


// ============================================================================
//  VITALS FIELD — Deterministic Shape + Defaults
// ============================================================================
//
//  The symbolic spine maintains a mutable healingState object.
//  The binary core defines the canonical shape and provides
//  pure helpers to derive status from raw counters + timestamps.
// ============================================================================
export function createEmptyVitals(context = createSpineContext()) {
  return {
    ...context,
    lastRequestTs: null,
    lastError: null,
    lastProxyError: null,
    lastRedisError: null,
    lastEmailError: null,
    lastWarmConnection: null,
    lastRateLimitDecision: null,
    lastTPProxyCall: null,
    lastHealthCheck: null,
    lastMetricsCheck: null,
    lastNodeCheck: null,
    lastPingCheck: null,
    cycleCount: 0,
    status: "healthy",
    mode: "online"
  };
}


// ============================================================================
//  RATE LIMIT FIELD — Deterministic Rate Limit Math
// ============================================================================
//
//  The binary core does not enforce rate limits; it only computes
//  descriptors and decisions based on counters and thresholds.
// ============================================================================
export function computeRateLimitState({
  totalRequestsToday,
  maxRequestsPerDay,
  nowMs,
  startTimeMs
} = {}) {
  const safeTotal = Number.isFinite(totalRequestsToday)
    ? Math.max(0, totalRequestsToday)
    : 0;

  const safeMax = Number.isFinite(maxRequestsPerDay) && maxRequestsPerDay > 0
    ? maxRequestsPerDay
    : 1;

  const usageRatio = safeTotal / safeMax;
  const clampedRatio = usageRatio > 1 ? 1 : usageRatio;

  let band = "low";
  if (clampedRatio >= 0.9) band = "critical";
  else if (clampedRatio >= 0.7) band = "high";
  else if (clampedRatio >= 0.4) band = "medium";

  const uptimeMs =
    Number.isFinite(nowMs) && Number.isFinite(startTimeMs) && nowMs >= startTimeMs
      ? nowMs - startTimeMs
      : null;

  return {
    totalRequestsToday: safeTotal,
    maxRequestsPerDay: safeMax,
    usageRatio: clampedRatio,
    band,
    uptimeMs
  };
}


// ============================================================================
//  NODE + REGION DESCRIPTORS — Deterministic Identity View
// ============================================================================
export function buildNodeDescriptor({
  region,
  nodeId,
  version,
  mode,
  maxRequestsPerDay
} = {}) {
  return {
    region: region || "unknown-region",
    nodeId: nodeId || "unknown-node",
    version: version || "v11",
    mode: mode === "offline" ? "offline" : "online",
    maxRequestsPerDay: Number.isFinite(maxRequestsPerDay)
      ? maxRequestsPerDay
      : null
  };
}


// ============================================================================
//  HEALABILITY MAP — How the Spine Looks to Healers (Binary View)
// ============================================================================
//
//  The symbolic spine can expose this to PulseOSHealer / GlobalHealer
//  as a stable, drift-proof description of the spine’s health.
// ============================================================================
export function buildHealabilitySnapshot({
  vitals,
  rateLimit,
  nodeDescriptor,
  redisReady,
  offlineMode
} = {}) {
  const v = vitals || {};
  const r = rateLimit || {};
  const n = nodeDescriptor || {};

  const redisStatus = redisReady ? "ready" : "degraded";
  const mode = offlineMode ? "offline" : "online";

  // High-level health classification (binary-only, no IO)
  let health = "healthy";

  if (v.lastProxyError || v.lastRedisError || v.lastEmailError) {
    health = "degraded";
  }

  if (r.band === "critical") {
    health = "rate-limited";
  }

  if (mode === "offline") {
    // Offline is not an error, but we mark it explicitly.
    health = health === "healthy" ? "offline" : health;
  }

  return {
    health,
    mode,
    redisStatus,
    node: {
      region: n.region,
      nodeId: n.nodeId,
      version: n.version
    },
    rateLimit: {
      band: r.band,
      usageRatio: r.usageRatio,
      totalRequestsToday: r.totalRequestsToday,
      maxRequestsPerDay: r.maxRequestsPerDay
    },
    vitals: {
      lastRequestTs: v.lastRequestTs,
      lastError: v.lastError,
      lastProxyError: v.lastProxyError,
      lastRedisError: v.lastRedisError,
      lastEmailError: v.lastEmailError,
      lastWarmConnection: v.lastWarmConnection,
      lastRateLimitDecision: v.lastRateLimitDecision,
      lastTPProxyCall: v.lastTPProxyCall,
      lastHealthCheck: v.lastHealthCheck,
      lastMetricsCheck: v.lastMetricsCheck,
      lastNodeCheck: v.lastNodeCheck,
      lastPingCheck: v.lastPingCheck,
      cycleCount: v.cycleCount
    }
  };
}


// ============================================================================
//  VITALS UPDATE HELPERS — Pure, Caller-Driven
// ============================================================================
//
//  These helpers never mutate in-place; they always return new objects.
//  The symbolic spine owns the mutable healingState and calls these
//  to derive updated snapshots.
// ============================================================================
export function bumpCycle(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastRequestTs: Number.isFinite(nowMs) ? nowMs : base.lastRequestTs || null,
    cycleCount: (base.cycleCount || 0) + 1
  };
}

export function recordError(vitals, { type, message, nowMs } = {}) {
  const base = vitals || {};
  const msg = typeof message === "string" ? message : String(message || "");

  const next = {
    ...base,
    lastError: msg
  };

  if (type === "proxy") {
    next.lastProxyError = msg;
  } else if (type === "redis") {
    next.lastRedisError = msg;
  } else if (type === "email") {
    next.lastEmailError = msg;
  }

  if (Number.isFinite(nowMs)) {
    next.lastRequestTs = nowMs;
  }

  return next;
}

export function recordWarmConnection(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastWarmConnection: Number.isFinite(nowMs) ? nowMs : base.lastWarmConnection || null
  };
}

export function recordRateLimitDecision(vitals, { decision, nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastRateLimitDecision: decision || base.lastRateLimitDecision || null,
    lastRequestTs: Number.isFinite(nowMs) ? nowMs : base.lastRequestTs || null
  };
}

export function recordTPProxyCall(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastTPProxyCall: Number.isFinite(nowMs) ? nowMs : base.lastTPProxyCall || null
  };
}

export function recordHealthCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastHealthCheck: Number.isFinite(nowMs) ? nowMs : base.lastHealthCheck || null
  };
}

export function recordMetricsCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastMetricsCheck: Number.isFinite(nowMs) ? nowMs : base.lastMetricsCheck || null
  };
}

export function recordNodeCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastNodeCheck: Number.isFinite(nowMs) ? nowMs : base.lastNodeCheck || null
  };
}

export function recordPingCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastPingCheck: Number.isFinite(nowMs) ? nowMs : base.lastPingCheck || null
  };
}


// ============================================================================
//  PACKET / EARN DESCRIPTORS — Binary View Only
// ============================================================================
//
//  The symbolic spine + PacketEngine do the real IO. The binary core
//  only describes packets in a deterministic way for logging, healing,
//  or rate-limit classification.
// ============================================================================
export function describePacket({
  packetId,
  userId,
  deviceId,
  kind,
  createdAtMs,
  sizeBytes
} = {}) {
  return {
    packetId: packetId || null,
    userId: userId || null,
    deviceId: deviceId || null,
    kind: kind || "unknown",
    createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : null,
    sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : null
  };
}


// ============================================================================
//  REDIS DESCRIPTORS — Binary View Only
// ============================================================================
export function describeRedisState({ ready, lastError } = {}) {
  return {
    ready: !!ready,
    lastError: lastError ? String(lastError) : null,
    status: ready ? "ready" : "degraded"
  };
}


// ============================================================================
//  MAILER DESCRIPTORS — Binary View Only
// ============================================================================
export function describeMailerState({ enabled, lastError } = {}) {
  return {
    enabled: !!enabled,
    lastError: lastError ? String(lastError) : null,
    status: enabled ? "ready" : "disabled"
  };
}


// ============================================================================
//  TPProxy DESCRIPTORS — Binary View Only
// ============================================================================
export function describeTPProxyState({
  lastTPProxyCall,
  lastProxyError
} = {}) {
  return {
    lastTPProxyCall: Number.isFinite(lastTPProxyCall) ? lastTPProxyCall : null,
    lastProxyError: lastProxyError ? String(lastProxyError) : null
  };
}
