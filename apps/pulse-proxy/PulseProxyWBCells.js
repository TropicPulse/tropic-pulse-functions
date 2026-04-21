// ============================================================================
//  PULSE OS v7.7 — PROXY HEALER
//  “WHITE BLOOD CELL LAYER / IMMUNE PATROL”
//  Deterministic • Drift‑Proof • Proxy‑Only Healing Layer
//  PURE DETECTION. NO AI. NO COMPUTE. NO MUTATION.
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v7.7):
//  ----------------------------------------
//  PulseProxyHealer is the **white blood cell layer** of the proxy subsystem.
//  It performs *immune patrol* — scanning for irritation, drift, pressure,
//  misconfiguration, and out‑of‑bounds behavior.
//
//  It does NOT:
//    • heal directly
//    • mutate state
//    • compute
//    • orchestrate
//    • reason
//    • call backend logic
//
//  It ONLY:
//    • detects irritation
//    • emits immune logs
//    • emits FUNCTION_LOG hints
//    • records proxy pressure
//    • records instance anomalies
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//    • White Blood Cell Layer → proxy‑level immune patrol
//    • Pressure Monitor → CPU/memory/event‑loop irritation
//    • Instance Sanity Checker → detects out‑of‑bounds allocations
//    • Immune Hint Emitter → FUNCTION_LOGS for Thymus + GlobalHealer
//    • Drift Sentinel → records proxy‑level drift signatures
//
//  SAFETY CONTRACT (v7.7):
//  ------------------------
//    • No eval()
//    • No dynamic imports
//    • No arbitrary code execution
//    • No compute
//    • No mutation of proxy state
//    • No backend orchestration
//    • Deterministic immune patrol only
//
// ============================================================================

const db    = global.db;
const log   = global.log   || console.log;
const error = global.error || console.error;

// ============================================================================
//  ORGAN CONTEXT — v7.7
// ============================================================================
const WBC_CONTEXT = {
  layer: "PulseProxyHealer",
  role: "WHITE_BLOOD_CELL_LAYER",
  version: "7.7",
  lineage: PulseLineage.optimizer,   // immune lineage
  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  IMMUNE CONFIG — v7.7
// ============================================================================
export const PROXY_HEALTH_URL  = process.env.PULSE_PROXY_HEALTH_URL  || "http://localhost:8080/pulse-proxy/health";
export const PROXY_METRICS_URL = process.env.PULSE_PROXY_METRICS_URL || "http://localhost:8080/pulse-proxy/metrics";

export const HEALTH_INTERVAL_MS       = 30_000;  // immune heartbeat
export const SCORES_SCAN_INTERVAL_MS  = 60_000;  // immune tissue scan

export const CPU_PRESSURE_WARN       = 80;
export const MEM_PRESSURE_WARN       = 80;
export const EVENT_LOOP_LAG_WARN     = 100;

export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 32;

export const FUNCTION_LOGS_COLLECTION     = "FUNCTION_LOGS";
export const PROXY_HEALER_LOGS_COLLECTION = "ProxyHealerLogs";

// ============================================================================
//  IMMUNE LOGGING HELPERS — v7.7
// ============================================================================
async function writeFunctionLog(entry) {
  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...WBC_CONTEXT,
      ...entry,
      createdAt: Timestamp.now(),
      processed: false
    });
  } catch (err) {
    error("wbc", "function_log_failed", { error: String(err) });
  }
}

async function writeHealerLog(entry) {
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
//  HEALTH + METRICS SCAN — v7.7
//  Immune patrol of proxy vitals (pressure, lag, irritation).
// ============================================================================
async function checkProxyHealthAndMetrics() {
  log("wbc", "scan_start");

  let health = null;
  let metrics = null;

  // HEALTH
  try {
    const res = await fetch(PROXY_HEALTH_URL);
    health = await res.json().catch(() => null);
  } catch (err) {
    error("wbc", "health_fetch_failed", { error: String(err) });
    await writeHealerLog({ type: "health_error", error: String(err), url: PROXY_HEALTH_URL });
  }

  // METRICS
  try {
    const res = await fetch(PROXY_METRICS_URL);
    metrics = await res.json().catch(() => null);
  } catch (err) {
    error("wbc", "metrics_fetch_failed", { error: String(err) });
    await writeHealerLog({ type: "metrics_error", error: String(err), url: PROXY_METRICS_URL });
  }

  if (!metrics) {
    log("wbc", "metrics_unavailable");
    return;
  }

  const cpuPercent     = metrics.cpu?.percent ?? null;
  const memPressure    = metrics.memory?.pressure ?? null;
  const eventLoopLagMs = metrics.eventLoopLagMs ?? null;

  const warnings = [];

  if (cpuPercent     > CPU_PRESSURE_WARN)     warnings.push("cpu_high");
  if (memPressure    > MEM_PRESSURE_WARN)     warnings.push("memory_high");
  if (eventLoopLagMs > EVENT_LOOP_LAG_WARN)   warnings.push("event_loop_lag_high");

  if (warnings.length) {
    log("wbc", "pressure_warning", { warnings });

    await writeHealerLog({
      type: "proxy_pressure_warning",
      cpuPercent,
      memPressure,
      eventLoopLagMs,
      warnings
    });
  } else {
    log("wbc", "pressure_normal");
  }
}

// ============================================================================
//  USER SCORES SCAN — v7.7
//  Immune patrol of user scoring tissue (instance sanity).
// ============================================================================
async function scanUserScoresForInstanceHints() {
  log("wbc", "scores_scan_start");

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const s = doc.data();
    const userId = doc.id;

    const trustScore = s.trustScore ?? 0;
    const meshScore  = s.meshScore ?? 0;
    const phase      = s.phase ?? 1;
    const hub        = !!s.hub;
    const instances  = s.instances ?? 1;

    // OUT OF BOUNDS
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

    // HIGH TRUST + LOW INSTANCES
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

    // LOW TRUST + HIGH INSTANCES
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
//  PUBLIC: startPulseProxyHealer() — v7.7
//  Activates immune patrol loops (health + scoring).
// ============================================================================
export default function startPulseProxyHealer() {
  log("wbc", "immune_patrol_start", WBC_CONTEXT);

  setInterval(() => {
    checkProxyHealthAndMetrics().catch(err =>
      error("wbc", "health_loop_error", { error: String(err) })
    );
  }, HEALTH_INTERVAL_MS);

  setInterval(() => {
    scanUserScoresForInstanceHints().catch(err =>
      error("wbc", "scores_loop_error", { error: String(err) })
    );
  }, SCORES_SCAN_INTERVAL_MS);

  log("wbc", "immune_patrol_active_v7_7");
}
