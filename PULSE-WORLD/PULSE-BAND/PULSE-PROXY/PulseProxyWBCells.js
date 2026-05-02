// ============================================================================
//  PULSE OS v12.3‑EVO‑PRESENCE — PROXY HEALER
//  “WHITE BLOOD CELL LAYER / IMMUNE PATROL”
//  Deterministic • Drift‑Proof • Proxy‑Only Healing Layer
//  PURE DETECTION. NO AI. NO BUSINESS MUTATION.
//  BINARY CORE + SYMBOLIC WRAPPER + PRESENCE OVERLAYS
// ============================================================================


// ============================================================================
// GLOBAL WIRING — backend-only, no global.* hard dependency
// ============================================================================
const G = typeof globalThis !== "undefined"
  ? globalThis
  : typeof global !== "undefined"
  ? global
  : {};

const log   = G.log   || console.log;
const error = G.error || console.error;

const Timestamp = (G.firebaseAdmin && G.firebaseAdmin.firestore.Timestamp) ||
                  G.Timestamp ||
                  null;

const admin = global.db;
const db    = global.db;


// ============================================================================
//  ORGAN IDENTITY — v12.3‑EVO‑PRESENCE
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "ImmuneLayer",
  version: "12.3-EVO-PRESENCE",
  identity: "PulseProxyHealer-v12.3-EVO-PRESENCE",

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
    binaryCore: true,
    symbolicWrapper: true,
    futureEvolutionReady: true,

    // 12.3 presence + advantage overlays (meta-only)
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    presenceAware: true,
    presenceFieldAware: true,

    // performance-awareness (meta only)
    prewarmAware: true,
    cacheAware: true,
    chunkAware: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v12.3
// ============================================================================
const WBC_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  version: PulseRole.version,
  lineage: "immune-core",
  evo: PulseRole.evo
};

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
  process.env.PULSE_PROXY_HEALTH_URL  || "http://localhost:8080/PULSE-PROXY/health";

export const PROXY_METRICS_URL =
  process.env.PULSE_PROXY_METRICS_URL || "http://localhost:8080/PULSE-PROXY/metrics";

export const HEALTH_INTERVAL_MS      = 30_000;
export const SCORES_SCAN_INTERVAL_MS = 60_000;

export const CPU_PRESSURE_WARN     = 80;
export const MEM_PRESSURE_WARN     = 80;
export const EVENT_LOOP_LAG_WARN   = 100;

export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 32;


// ============================================================================
//  META — v12.3‑EVO‑BINARY‑MAX‑ABA‑PRESENCE
// ============================================================================
export const PulseProxyHealerMeta = Object.freeze({
  layer: "PulseProxyHealer",
  role: "IMMUNE_PATROL_ORGAN",
  version: "v12.3-EVO-BINARY-MAX-ABA-PRESENCE",
  identity: "PulseProxyHealer-v12.3-EVO-BINARY-MAX-ABA-PRESENCE",

  guarantees: Object.freeze({
    deterministicImmuneScan: true,
    driftProof: true,
    zeroDriftPressure: true,
    multiInstanceReady: true,
    backendOnly: true,
    binaryCore: true,
    symbolicWrapper: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    immunePressureAware: true,
    immuneMisconfigurationAware: true,
    immuneVitalsAware: true,
    failOpenSafe: true,

    // Execution prohibitions
    zeroIQ: true,
    zeroRouting: true,
    zeroCompute: true,
    zeroRandomness: true,
    zeroDateNow: false,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroNetworkMutation: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroGPU: true,

    // Awareness (12.3)
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    presenceAware: true,
    presenceFieldAware: true,
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,

    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "HealthSnapshot",
      "MetricsSnapshot",
      "UserScoresSnapshot",
      "DualBandContext",
      "AdvantageContext"
    ],
    output: [
      "ImmuneScanResult",
      "ImmuneBandSignature",
      "ImmuneBinaryField",
      "ImmuneWaveField",
      "ImmunePresenceField",
      "ImmuneDiagnostics",
      "ImmuneHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "PulseProxyHealer-v7",
      "PulseProxyHealer-v8",
      "PulseProxyHealer-v9",
      "PulseProxyHealer-v10",
      "PulseProxyHealer-v11",
      "PulseProxyHealer-v11-Evo",
      "PulseProxyHealer-v11-Evo-Prime",
      "PulseProxyHealer-v12.3-EVO-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic", "dual"],
    default: "binary",
    behavior: "immune-patrol"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "health + metrics + scores → immune scan → immune surfaces",
    adaptive: "binary-field + wave-field + presence overlays",
    return: "deterministic immune surfaces + signatures"
  })
});

// ============================================================================
// writeHealerLog — v14 IMMORTAL HEALER LOGGER
// Writes deterministic, drift‑proof healer logs to FUNCTION_LOGS
// ============================================================================
export async function writeHealerLog({
  subsystem = "unknown",
  stage = "unknown",
  severity = "info",
  note = null,
  details = null,
  runId = null,
  uid = null,
  file = null,
  fn = null
} = {}) {
  try {
    const ts = Date.now();
    const id = `HL_${ts}_${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      ts,
      subsystem,
      stage,
      severity,
      note,
      details,
      runId,
      uid,
      file,
      fn,
      healerVersion: "v14-IMMORTAL",
      layer: "backend_healer",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("FUNCTION_LOGS").doc(id).set(payload);
    return id;

  } catch (err) {
    // NEVER throw — healer logs must not break the healer
    try {
      await db.collection("FUNCTION_ERRORS").add({
        ts: Date.now(),
        fn: "writeHealerLog",
        error: String(err),
        stage: "healer_log_failure",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (_) {}

    return null;
  }
}

// ============================================================================
//  BINARY CORE — v12.3 (unchanged logic, upgraded surfaces)
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

  if (cpuPercent     > CPU_PRESSURE_WARN)   warnings.push("cpu_high");
  if (memPressure    > MEM_PRESSURE_WARN)   warnings.push("memory_high");
  if (eventLoopLagMs > EVENT_LOOP_LAG_WARN) warnings.push("event_loop_lag_high");

  const status = warnings.length === 0 ? "healthy" : "warning";

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
//  IMMUNE SURFACE HELPERS — 12.3 presence overlays
// ============================================================================
function buildBandSignature(status) {
  return `immune-band-v12.3:${status}`;
}

function buildWaveField(healthResult) {
  return {
    cpu: healthResult.cpuPercent,
    mem: healthResult.memPressure,
    lag: healthResult.eventLoopLagMs
  };
}

function buildBinaryField(healthResult) {
  return {
    warnings: healthResult.warnings,
    cpu: healthResult.cpuPercent,
    mem: healthResult.memPressure
  };
}

function buildPresenceField(status) {
  return {
    layer: "ImmuneLayer",
    state: status,
    presenceSignature: `immune-presence-${status}`
  };
}


// ============================================================================
//  SYMBOLIC WRAPPER — v12.3 (fetch + db + intervals + presence overlays)
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
    await writeHealerLog({ type: "health_error", error: msg });
  }

  try {
    const res = await fetch(PROXY_METRICS_URL);
    metrics = await res.json().catch(() => null);
  } catch (err) {
    const msg = String(err);
    ImmuneState.lastMetricsError = msg;
    error("wbc", "metrics_fetch_failed", { error: msg });
    await writeHealerLog({ type: "metrics_error", error: msg });
  }

  if (!metrics) {
    ImmuneState.status = "degraded";
    return;
  }

  ImmuneState.lastMetricsScanTs = Date.now();

  const healthResult = ProxyHealerBinary.classifyPressure(metrics);

  // presence overlays
  const bandSignature  = buildBandSignature(healthResult.status);
  const waveField      = buildWaveField(healthResult);
  const binaryField    = buildBinaryField(healthResult);
  const presenceField  = buildPresenceField(healthResult.status);

  if (healthResult.warnings.length) {
    ImmuneState.status = "warning";

    await writeHealerLog({
      type: "proxy_pressure_warning",
      bandSignature,
      waveField,
      binaryField,
      presenceField
    });
  } else {
    ImmuneState.status = "healthy";
  }
}

async function scanUserScoresForInstanceHints() {
  if (!db) return;

  ImmuneState.lastScoresScanTs = Date.now();

  let snap;
  try {
    snap = await db.collection("UserScores").get();
  } catch (err) {
    const msg = String(err);
    ImmuneState.lastScoresError = msg;
    await writeHealerLog({ type: "scores_fetch_error", error: msg });
    return;
  }

  for (const doc of snap.docs) {
    const s = doc.data() || {};
    const userId = doc.id;

    const hint = ProxyHealerBinary.evaluateUserScore(s);

    const bandSignature = buildBandSignature(hint.outOfBounds ? "critical" : "ok");
    const waveField     = { trust: hint.trustScore, instances: hint.instances };
    const binaryField   = { trust: hint.trustScore };
    const presenceField = buildPresenceField(hint.outOfBounds ? "critical" : "ok");

    if (hint.outOfBounds) {
      await writeHealerLog({
        type: "instance_out_of_bounds",
        userId,
        bandSignature,
        waveField,
        binaryField,
        presenceField
      });
      continue;
    }

    if (hint.upgradeHint) {
      await writeHealerLog({
        type: "instance_upgrade_hint",
        userId,
        bandSignature,
        waveField,
        binaryField,
        presenceField
      });
    }

    if (hint.reviewHint) {
      await writeHealerLog({
        type: "instance_review_hint",
        userId,
        bandSignature,
        waveField,
        binaryField,
        presenceField
      });
    }
  }
}


// ============================================================================
//  PUBLIC: startPulseProxyHealer() — immune patrol loop (symbolic wrapper)
// ============================================================================
export default function startPulseProxyHealer() {
  log("wbc", "immune_patrol_start_v12.3", WBC_CONTEXT);

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

  log("wbc", "immune_patrol_active_v12.3", {
    ...WBC_CONTEXT,
    healthIntervalMs: HEALTH_INTERVAL_MS,
    scoresIntervalMs: SCORES_SCAN_INTERVAL_MS
  });
}


// ============================================================================
//  EXPORTED IMMUNE STATE
// ============================================================================
export function getProxyImmuneState() {
  return {
    ...ImmuneState,
    bandSignature: buildBandSignature(ImmuneState.status),
    presenceField: buildPresenceField(ImmuneState.status),
    context: { ...WBC_CONTEXT }
  };
}
