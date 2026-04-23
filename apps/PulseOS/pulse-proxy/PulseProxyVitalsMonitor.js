// ============================================================================
//  PULSE OS v10.4 — USER METRICS (VITALS MONITOR ULTRA LOGGER)
//  “Circulatory Telemetry Layer / Bloodstream Diagnostics / Route Map Renderer”
//  PURE MEASUREMENT. PURE LOGGING. ZERO HEALING. ZERO COMMAND. ZERO ROUTING.
// ============================================================================

// ============================================================================
//  UNIVERSAL GLOBAL RESOLVER — NEVER THROWS
// ============================================================================
const g =
  typeof global !== "undefined"
    ? global
    : typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : {};

// Backend-only globals (db only exists on backend)
const db    = g.db || null;
const log   = g.log   || console.log;
const warn  = g.warn  || console.warn;
const error = g.error || console.error;

// ============================================================================
//  ORGAN IDENTITY — v10.4
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "VitalsMonitor",
  version: "10.4",
  identity: "PulseUserMetrics",

  evo: {
    driftProof: true,
    deterministicVitals: true,
    zeroDriftAverages: true,
    backendOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  ORGAN CONTEXT — v10.4
// ============================================================================
const VITALS_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  version: PulseRole.version,
  lineage: "interface-core",
  evo: PulseRole.evo
};

// ============================================================================
//  ICONS — Circulatory Telemetry Glyphs (v10.4)
// ============================================================================
const ICON = {
  update: "🩸",
  trust: "🧪",
  phase: "📊",
  hub: "🛰️",
  alloc: "⚙️",
  warn: "⚠️",
  error: "🟥",
  ok: "🟢"
};

// ============================================================================
//  ROUTE MAP ICONS — Organism Route Layer (v10.4)
// ============================================================================
const ORG = {
  brain:      "🧠",
  synapse:    "⚡",
  spine:      "🧵",
  heart:      "🫀",
  band:       "📡",
  router:     "🛰️",
  proxy:      "🌐",
  vitals:     "🩸",
  history:    "📜",
  purifier:   "🧹",
  unknown:    "⬡"
};

// ============================================================================
//  ROUTE HEALTH SYMBOLS
// ============================================================================
const HEALTH = {
  healthy:   "|",
  stable:    "|",
  degrading: "~",
  critical:  "X",
  unknown:   "?"
};

// ============================================================================
//  ROUTE MAP RENDERER
// ============================================================================
function makeHealthBar(status) {
  const sym = HEALTH[status] || HEALTH.unknown;

  switch (status) {
    case "healthy":   return `${sym} OK`;
    case "stable":    return `${sym} STABLE`;
    case "degrading": return `${sym} DEGRADED`;
    case "critical":  return `${sym} BROKEN`;
    default:          return `${sym} UNKNOWN`;
  }
}

function renderRouteNode(name, icon, status, color) {
  const bar = makeHealthBar(status);
  console.log(
    `%c${icon}  ${name.padEnd(14)} → ${bar}`,
    `color:${color}; font-weight:bold;`
  );
}

export function printRouteScan(route = {}) {
  console.groupCollapsed(
    "%c🔍 ROUTE SCAN — PulseOS v10.4",
    "color:#03A9F4; font-weight:bold;"
  );

  renderRouteNode("Brain",     ORG.brain,    route.brain,    "#7C4DFF");
  renderRouteNode("Synapse",   ORG.synapse,  route.synapse,  "#42A5F5");
  renderRouteNode("Spine",     ORG.spine,    route.spine,    "#26A69A");
  renderRouteNode("Heart",     ORG.heart,    route.heart,    "#E53935");
  renderRouteNode("PulseBand", ORG.band,     route.band,     "#EC407A");
  renderRouteNode("Router",    ORG.router,   route.router,   "#26C6DA");
  renderRouteNode("Proxy",     ORG.proxy,    route.proxy,    "#29B6F6");
  renderRouteNode("Vitals",    ORG.vitals,   route.vitals,   "#FF7043");
  renderRouteNode("History",   ORG.history,  route.history,  "#BDBDBD");
  renderRouteNode("Purifier",  ORG.purifier, route.purifier, "#8D6E63");

  console.groupEnd();
}

// ============================================================================
//  CONFIG — Physiological Limits (unchanged behavior)
// ============================================================================
export const NORMAL_MAX     = 4;
export const UPGRADED_MAX   = 8;
export const HIGHEND_MAX    = 8;
export const TEST_EARN_MAX  = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_PERFORMANCE_LOGGING = true;
export const PERFORMANCE_LOG_COLLECTION = "UserPerformanceLogs";

// ============================================================================
//  updateUserMetrics() — PURE MEASUREMENT + ULTRA LOGGING
// ============================================================================
export async function updateUserMetrics(userId, data = {}) {
  if (!db) return;
  if (!userId || userId === "anonymous") return;

  log(
    "vitals",
    `${ICON.update} update`,
    {
      userId,
      bytes: data.bytes ?? 0,
      durationMs: data.durationMs ?? 0,
      meshRelay: !!data.meshRelay,
      meshPing: !!data.meshPing,
      hubFlag: !!data.hubFlag
    }
  );

  const ref = db.collection("UserMetrics").doc(userId);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const existing = snap.exists ? snap.data() : {};

    const totalRequests = (existing.totalRequests || 0) + 1;
    const totalBytes    = (existing.totalBytes || 0) + (data.bytes || 0);

    let avgLatency = existing.avgLatency || 0;
    if (data.durationMs != null) {
      if (!existing.totalRequests) {
        avgLatency = data.durationMs;
      } else {
        avgLatency =
          (avgLatency * existing.totalRequests + data.durationMs) /
          totalRequests;
      }
    }

    const meshRelays     = (existing.meshRelays || 0) + (data.meshRelay ? 1 : 0);
    const meshPings      = (existing.meshPings || 0) + (data.meshPing ? 1 : 0);
    const hubSignals     = (existing.hubSignals || 0) + (data.hubFlag ? 1 : 0);
    const stabilityScore = existing.stabilityScore || 0;

    tx.set(
      ref,
      {
        userId,
        totalRequests,
        totalBytes,
        avgLatency,
        meshRelays,
        meshPings,
        hubSignals,
        stabilityScore,
        lastSeen: now,
        updatedAt: now
      },
      { merge: true }
    );
  });

  if (ENABLE_PERFORMANCE_LOGGING) {
    try {
      await db.collection(PERFORMANCE_LOG_COLLECTION).add({
        ...VITALS_CONTEXT,
        userId,
        ts: Date.now(),
        bytes: data.bytes ?? null,
        durationMs: data.durationMs ?? null,
        meshRelay: data.meshRelay ?? false,
        meshPing: data.meshPing ?? false,
        hubFlag: data.hubFlag ?? false
      });

      log("vitals", `${ICON.ok} snapshot_logged`, { userId });
    } catch (err) {
      error("vitals", `${ICON.error} snapshot_failed`, { error: String(err) });
    }
  }
}

// ============================================================================
//  calculateTrustScore() — unchanged logic + ULTRA LOGGING
// ============================================================================
export function calculateTrustScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  score += Math.min(metrics.totalRequests / 100, 20);
  score += Math.min(metrics.meshRelays / 10, 20);
  score += Math.min(metrics.hubSignals / 5, 20);

  if (metrics.avgLatency && metrics.avgLatency < 150) score += 20;

  score += metrics.stabilityScore || 0;

  const final = Math.min(score, 100);

  log("vitals", `${ICON.trust} trust_score`, {
    userId: metrics.userId ?? "?",
    score: final
  });

  return final;
}

// ============================================================================
//  calculatePhase() — unchanged logic + ULTRA LOGGING
// ============================================================================
export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25) phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else phase = 4;

  log("vitals", `${ICON.phase} phase`, { trustScore, phase });

  return phase;
}

// ============================================================================
//  isHub() — unchanged logic + ULTRA LOGGING
// ============================================================================
export function isHub(metrics) {
  if (!metrics) return false;

  const hub =
    metrics.meshRelays > 50 ||
    metrics.hubSignals > 20 ||
    metrics.totalRequests > 500;

  if (hub) {
    warn("vitals", `${ICON.hub} hub_detected`, {
      userId: metrics.userId ?? "?",
      relays: metrics.meshRelays,
      hubSignals: metrics.hubSignals,
      totalRequests: metrics.totalRequests
    });
  }

  return hub;
}

// ============================================================================
//  allocateInstances() — unchanged logic + ULTRA LOGGING
// ============================================================================
export function allocateInstances(
  phase,
  hubFlag,
  deviceTier,
  earnMode,
  testEarnActive
) {
  let base = phase >= 2 ? 2 : 1;

  if (hubFlag) base *= 2;
  if (deviceTier === "upgraded") base *= UPGRADED_MULT;
  if (deviceTier === "highend")  base *= HIGHEND_MULT;
  if (earnMode) base = Math.floor(base * EARN_MODE_MULT);
  if (testEarnActive) base = TEST_EARN_MAX;

  const max =
    testEarnActive
      ? TEST_EARN_MAX
      : deviceTier === "upgraded"
      ? UPGRADED_MAX
      : deviceTier === "highend"
      ? HIGHEND_MAX
      : NORMAL_MAX;

  const final = Math.max(1, Math.min(base, max));

  log("vitals", `${ICON.alloc} instance_allocation`, {
    phase,
    hubFlag,
    deviceTier,
    earnMode,
    testEarnActive,
    final
  });

  return final;
}

// ============================================================================
//  ORGAN EXPORT — ⭐ VitalsMonitor (v10.4)
// ============================================================================
export const VitalsMonitor = {
  PulseRole,

  updateUserMetrics,
  calculateTrustScore,
  calculatePhase,
  isHub,
  allocateInstances,

  printRouteScan,

  NORMAL_MAX,
  UPGRADED_MAX,
  HIGHEND_MAX,
  TEST_EARN_MAX,
  UPGRADED_MULT,
  HIGHEND_MULT,
  EARN_MODE_MULT,
  ENABLE_PERFORMANCE_LOGGING,
  PERFORMANCE_LOG_COLLECTION,

  meta: {
    layer: PulseRole.layer,
    subsystem: PulseRole.subsystem,
    version: PulseRole.version,
    identity: PulseRole.identity
  }
};
