// ============================================================================
//  PULSE OS v9.3 — PROXY HEALER
//  “WHITE BLOOD CELL LAYER / IMMUNE PATROL”
//  Deterministic • Drift‑Proof • Proxy‑Only Healing Layer
//  PURE DETECTION. NO AI. NO COMPUTE. NO MUTATION.
// ============================================================================
// ============================================================================
// GLOBAL WIRING — v10.2 (Safe, backend-only, no global.* dependency)
// ============================================================================

// Universal global resolver (works in Node, Workers, Serverless)
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
const Timestamp = G.Timestamp || null;

// ============================================================================
//  ORGAN IDENTITY — v9.3
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "ImmuneLayer",
  version: "9.3",
  identity: "PulseProxyHealer",

  evo: {
    driftProof: true,
    deterministicImmuneScan: true,
    zeroDriftPressure: true,
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
//  ORGAN CONTEXT — v9.3
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
//  IMMUNE CONFIG — unchanged
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
//  IMMUNE LOGGING HELPERS — drift‑proof, backend‑safe
// ============================================================================
async function writeFunctionLog(entry) {
  if (!db) return; // backend‑only organ, fail‑open if db missing

  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...WBC_CONTEXT,
      ...entry,
      createdAt: Timestamp ? Timestamp.now() : Date.now(),
      processed: false
    });
  } catch (err) {
    error("wbc", "function_log_failed", { error: String(err) });
  }
}

async function writeHealerLog(entry) {
  if (!db) return; // backend‑only organ, fail‑open if db missing

  try {
    await db.collection(PROXY_HEALER_LOGS_COLLECTION).add({
      ...WBC_CONTEXT,
      ...entry,
      ts: Date.now()
    });
  } catch (err) {
    error("wbc", "healer_log_failed", { error: String(err) });
  }
}

// ============================================================================
//  HEALTH + METRICS SCAN — immune patrol over proxy spine
// ============================================================================
async function checkProxyHealthAndMetrics() {
  ImmuneState.status = "scanning";
  ImmuneState.lastHealthScanTs = Date.now();
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

  ImmuneState.lastMetricsScanTs = Date.now();

  const cpuPercent     = metrics.cpu?.percent ?? null;
  const memPressure    = metrics.memory?.pressure ?? null;
  const eventLoopLagMs = metrics.eventLoopLagMs ?? null;

  const warnings = [];

  if (cpuPercent     > CPU_PRESSURE_WARN)   warnings.push("cpu_high");
  if (memPressure    > MEM_PRESSURE_WARN)   warnings.push("memory_high");
  if (eventLoopLagMs > EVENT_LOOP_LAG_WARN) warnings.push("event_loop_lag_high");

  if (warnings.length) {
    ImmuneState.status = "warning";

    log("wbc", "pressure_warning", { warnings });

    await writeHealerLog({
      type: "proxy_pressure_warning",
      cpuPercent,
      memPressure,
      eventLoopLagMs,
      warnings
    });
  } else {
    ImmuneState.status = "healthy";
    log("wbc", "pressure_normal");
  }
}

// ============================================================================
//  USER SCORES SCAN — immune hints for instance allocation
// ============================================================================
async function scanUserScoresForInstanceHints() {
  if (!db) {
    log("wbc", "scores_scan_skipped_no_db");
    return;
  }

  ImmuneState.lastScoresScanTs = Date.now();
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
    const s = doc.data();
    const userId = doc.id;

    const trustScore = s.trustScore ?? 0;
    const meshScore  = s.meshScore ?? 0;
    const phase      = s.phase ?? 1;
    const hub        = !!s.hub;
    const instances  = s.instances ?? 1;

    if (instances < MIN_INSTANCES || instances > MAX_INSTANCES) {
      log("wbc", "instance_out_of_bounds", { userId, instances });

      await writeHealerLog({
        type: "instance_out_of_bounds",
        userId,
        instances,
        trustScore,
        meshScore,
        phase,
        hub
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

    if (trustScore > 80 && instances < 4) {
      log("wbc", "upgrade_hint", { userId });

      await writeHealerLog({
        type: "instance_upgrade_hint",
        userId,
        reason: "high_trust_low_instances",
        trustScore,
        meshScore,
        phase,
        hub,
        instances
      });
    }

    if (trustScore < 20 && instances > 4) {
      log("wbc", "review_hint", { userId });

      await writeHealerLog({
        type: "instance_review_hint",
        userId,
        reason: "low_trust_high_instances",
        trustScore,
        meshScore,
        phase,
        hub,
        instances
      });
    }
  }

  log("wbc", "scores_scan_complete");
}

// ============================================================================
//  PUBLIC: startPulseProxyHealer() — immune patrol loop
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

  log("wbc", "immune_patrol_active_v9_3", {
    ...WBC_CONTEXT,
    healthIntervalMs: HEALTH_INTERVAL_MS,
    scoresIntervalMs: SCORES_SCAN_INTERVAL_MS
  });
}

// Optional: export immune state for OS‑level dashboards / healers
export function getProxyImmuneState() {
  return { ...ImmuneState, context: { ...WBC_CONTEXT } };
}
