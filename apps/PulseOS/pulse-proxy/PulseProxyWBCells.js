// ============================================================================
//  PULSE OS v11 — PROXY HEALER
//  “WHITE BLOOD CELL LAYER / IMMUNE PATROL”
//  Deterministic • Drift‑Proof • Proxy‑Only Healing Layer
//  PURE DETECTION. NO AI. NO BUSINESS MUTATION.
//  BINARY CORE + SYMBOLIC WRAPPER
// ============================================================================


// ============================================================================
// GLOBAL WIRING — backend-only, no global.* hard dependency
// ============================================================================
const G = typeof globalThis !== "undefined"
  ? globalThis
  : typeof global !== "undefined"
  ? global
  : {};

// Safe fallbacks — backend-only organ, but never break if wiring incomplete
const db    = G.db    || null;
const log   = G.log   || console.log;
const error = G.error || console.error;

// Firestore Timestamp (optional, backend-only)
const Timestamp = (G.firebaseAdmin && G.firebaseAdmin.firestore.Timestamp) ||
                  G.Timestamp ||
                  null;


// ============================================================================
//  ORGAN IDENTITY — v11
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "ImmuneLayer",
  version: "11.0",
  identity: "PulseProxyHealer",

  evo: {
    driftProof: true,
    deterministicImmuneScan: true,
    zeroDriftPressure: true,
    backendOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,          // no business compute; only threshold checks
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    binaryCore: true,
    symbolicWrapper: true,
    futureEvolutionReady: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v11
// ============================================================================
const WBC_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  version: PulseRole.version,
  lineage: "immune-core",
  evo: PulseRole.evo
};

// Lightweight immune heartbeat (for OS‑level healers / dashboards)
const ImmuneState = {
  lastHealthScanTs: null,
  lastMetricsScanTs: null,
  lastScoresScanTs: null,
  lastHealthError: null,
  lastMetricsError: null,
  lastScoresError: null,
  status: "idle"
};


// ============================================================================
//  IMMUNE CONFIG — unchanged thresholds
// ============================================================================
export const PROXY_HEALTH_URL  =
  process.env.PULSE_PROXY_HEALTH_URL  || "http://localhost:8080/pulse-proxy/health";

export const PROXY_METRICS_URL =
  process.env.PULSE_PROXY_METRICS_URL || "http://localhost:8080/pulse-proxy/metrics";

export const HEALTH_INTERVAL_MS      = 30_000;
export const SCORES_SCAN_INTERVAL_MS = 60_000;

export const CPU_PRESSURE_WARN     = 80;
export const MEM_PRESSURE_WARN     = 80;
export const EVENT_LOOP_LAG_WARN   = 100;

export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 32;

export const FUNCTION_LOGS_COLLECTION     = "FUNCTION_LOGS";
export const PROXY_HEALER_LOGS_COLLECTION = "ProxyHealerLogs";


// ============================================================================
//  SHARED HELPERS — deterministic, no randomness
// ============================================================================
function nowMs() {
  return Date.now();
}


// ============================================================================
//  BINARY CORE — v11 (no fetch, no timers, no window)
//  Pure classification + hint engine
// ============================================================================

function classifyPressureBinary(metrics) {
  if (!metrics || typeof metrics !== "object") {
    return {
      status: "unknown",
      warnings: [],
      cpuPercent: null,
      memPressure: null,
      eventLoopLagMs: null
    };
  }

  const cpuPercent     = metrics.cpu?.percent ?? null;
  const memPressure    = metrics.memory?.pressure ?? null;
  const eventLoopLagMs = metrics.eventLoopLagMs ?? null;

  const warnings = [];

  if (cpuPercent     != null && cpuPercent     > CPU_PRESSURE_WARN)   warnings.push("cpu_high");
  if (memPressure    != null && memPressure    > MEM_PRESSURE_WARN)   warnings.push("memory_high");
  if (eventLoopLagMs != null && eventLoopLagMs > EVENT_LOOP_LAG_WARN) warnings.push("event_loop_lag_high");

  const status =
    warnings.length === 0
      ? "healthy"
      : "warning";

  return {
    status,
    warnings,
    cpuPercent,
    memPressure,
    eventLoopLagMs
  };
}

function evaluateUserScoreBinary(scoreDoc) {
  if (!scoreDoc || typeof scoreDoc !== "object") {
    return {
      outOfBounds: false,
      upgradeHint: false,
      reviewHint: false
    };
  }

  const trustScore = scoreDoc.trustScore ?? 0;
  const meshScore  = scoreDoc.meshScore ?? 0; // currently unused, but preserved
  const phase      = scoreDoc.phase ?? 1;     // currently unused, but preserved
  const hub        = !!scoreDoc.hub;          // currently unused, but preserved
  const instances  = scoreDoc.instances ?? 1;

  const outOfBounds =
    instances < MIN_INSTANCES || instances > MAX_INSTANCES;

  const upgradeHint =
    !outOfBounds && trustScore > 80 && instances < 4;

  const reviewHint =
    !outOfBounds && trustScore < 20 && instances > 4;

  return {
    outOfBounds,
    upgradeHint,
    reviewHint,
    trustScore,
    meshScore,
    phase,
    hub,
    instances
  };
}

function buildImmuneSnapshotBinary({ healthResult, scoreHints, ts }) {
  return {
    ts,
    status: healthResult?.status ?? "unknown",
    warnings: healthResult?.warnings ?? [],
    cpuPercent: healthResult?.cpuPercent ?? null,
    memPressure: healthResult?.memPressure ?? null,
    eventLoopLagMs: healthResult?.eventLoopLagMs ?? null,
    scoreHints,
    meta: { ...WBC_CONTEXT }
  };
}

export const ProxyHealerBinary = {
  classifyPressure: classifyPressureBinary,
  evaluateUserScore: evaluateUserScoreBinary,
  buildSnapshot: buildImmuneSnapshotBinary
};


// ============================================================================
//  IMMUNE LOGGING HELPERS — drift‑proof, backend‑safe
// ============================================================================
async function writeFunctionLog(entry) {
  if (!db) return;

  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...WBC_CONTEXT,
      ...entry,
      createdAt: Timestamp ? Timestamp.now() : nowMs(),
      processed: false
    });
  } catch (err) {
    error("wbc", "function_log_failed", { error: String(err) });
  }
}

async function writeHealerLog(entry) {
  if (!db) return;

  try {
    await db.collection(PROXY_HEALER_LOGS_COLLECTION).add({
      ...WBC_CONTEXT,
      ...entry,
      ts: nowMs()
    });
  } catch (err) {
    error("wbc", "healer_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  SYMBOLIC WRAPPER — v10.4–11 (fetch + db + intervals)
//  Uses binary core for all decisions
// ============================================================================

// HEALTH + METRICS SCAN — immune patrol over proxy spine
async function checkProxyHealthAndMetrics() {
  ImmuneState.status = "scanning";
  ImmuneState.lastHealthScanTs = nowMs();
  log("wbc", "scan_start");

  let health = null;
  let metrics = null;

  try {
    const res = await fetch(PROXY_HEALTH_URL);
    health = await res.json().catch(() => null);
  } catch (err) {
    const msg = String(err);
    ImmuneState.lastHealthError = msg;
    error("wbc", "health_fetch_failed", { error: msg });
    await writeHealerLog({ type: "health_error", error: msg, url: PROXY_HEALTH_URL });
  }

  try {
    const res = await fetch(PROXY_METRICS_URL);
    metrics = await res.json().catch(() => null);
  } catch (err) {
    const msg = String(err);
    ImmuneState.lastMetricsError = msg;
    error("wbc", "metrics_fetch_failed", { error: msg });
    await writeHealerLog({ type: "metrics_error", error: msg, url: PROXY_METRICS_URL });
  }

  if (!metrics) {
    log("wbc", "metrics_unavailable");
    ImmuneState.status = "degraded";
    return;
  }

  ImmuneState.lastMetricsScanTs = nowMs();

  const healthResult = ProxyHealerBinary.classifyPressure(metrics);

  if (healthResult.warnings.length) {
    ImmuneState.status = "warning";

    log("wbc", "pressure_warning", { warnings: healthResult.warnings });

    await writeHealerLog({
      type: "proxy_pressure_warning",
      cpuPercent: healthResult.cpuPercent,
      memPressure: healthResult.memPressure,
      eventLoopLagMs: healthResult.eventLoopLagMs,
      warnings: healthResult.warnings
    });
  } else {
    ImmuneState.status = "healthy";
    log("wbc", "pressure_normal");
  }
}

// USER SCORES SCAN — immune hints for instance allocation
async function scanUserScoresForInstanceHints() {
  if (!db) {
    log("wbc", "scores_scan_skipped_no_db");
    return;
  }

  ImmuneState.lastScoresScanTs = nowMs();
  log("wbc", "scores_scan_start");

  let snap;
  try {
    snap = await db.collection("UserScores").get();
  } catch (err) {
    const msg = String(err);
    ImmuneState.lastScoresError = msg;
    error("wbc", "scores_fetch_failed", { error: msg });
    await writeHealerLog({ type: "scores_fetch_error", error: msg });
    return;
  }

  for (const doc of snap.docs) {
    const s = doc.data() || {};
    const userId = doc.id;

    const hint = ProxyHealerBinary.evaluateUserScore(s);

    if (hint.outOfBounds) {
      log("wbc", "instance_out_of_bounds", { userId, instances: hint.instances });

      await writeHealerLog({
        type: "instance_out_of_bounds",
        userId,
        instances: hint.instances,
        trustScore: hint.trustScore,
        meshScore: hint.meshScore,
        phase: hint.phase,
        hub: hint.hub
      });

      await writeFunctionLog({
        type: "missing_field",
        pagePath: "/apps/pulse-proxy",
        fileName: "PulseUserScoring.js",
        functionName: "allocateInstances",
        fieldName: "instances",
        note: "Instance count outside sane bounds; review allocation formula."
      });

      continue;
    }

    if (hint.upgradeHint) {
      log("wbc", "upgrade_hint", { userId });

      await writeHealerLog({
        type: "instance_upgrade_hint",
        userId,
        reason: "high_trust_low_instances",
        trustScore: hint.trustScore,
        meshScore: hint.meshScore,
        phase: hint.phase,
        hub: hint.hub,
        instances: hint.instances
      });
    }

    if (hint.reviewHint) {
      log("wbc", "review_hint", { userId });

      await writeHealerLog({
        type: "instance_review_hint",
        userId,
        reason: "low_trust_high_instances",
        trustScore: hint.trustScore,
        meshScore: hint.meshScore,
        phase: hint.phase,
        hub: hint.hub,
        instances: hint.instances
      });
    }
  }

  log("wbc", "scores_scan_complete");
}


// ============================================================================
//  PUBLIC: startPulseProxyHealer() — immune patrol loop (symbolic wrapper)
// ============================================================================
export default function startPulseProxyHealer() {
  log("wbc", "immune_patrol_start", WBC_CONTEXT);

  // Continuous proxy health + metrics patrol
  setInterval(() => {
    checkProxyHealthAndMetrics().catch(err =>
      error("wbc", "health_loop_error", { error: String(err) })
    );
  }, HEALTH_INTERVAL_MS);

  // Continuous user score scan for instance hints
  setInterval(() => {
    scanUserScoresForInstanceHints().catch(err =>
      error("wbc", "scores_loop_error", { error: String(err) })
    );
  }, SCORES_SCAN_INTERVAL_MS);

  log("wbc", "immune_patrol_active_v11", {
    ...WBC_CONTEXT,
    healthIntervalMs: HEALTH_INTERVAL_MS,
    scoresIntervalMs: SCORES_SCAN_INTERVAL_MS
  });
}

// Optional: export immune state for OS‑level dashboards / healers
export function getProxyImmuneState() {
  return { ...ImmuneState, context: { ...WBC_CONTEXT } };
}
