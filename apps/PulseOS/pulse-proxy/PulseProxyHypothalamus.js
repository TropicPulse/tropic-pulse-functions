// ============================================================================
//  PULSE OS v9.3 — HYPOTHALAMUS
//  PulseUserScoring — Homeostasis Regulation Organ
//  Backend‑Only • Deterministic • Drift‑Proof • No IQ
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



// ============================================================================
// LAYER IDENTITY — v9.3
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "Hypothalamus",
  version: "9.3",
  identity: "PulseUserScoring",

  evo: {
    driftProof: true,
    deterministic: true,
    homeostasisRegulation: true,
    backendOnly: true,
    multiInstanceReady: true,
    pulseSendAware: true,
    futureEvolutionReady: true
  }
};

const HYPOTHALAMUS_CONTEXT = {
  layer: PulseRole.layer,
  role: "HYPOTHALAMUS",
  version: PulseRole.version,
  evo: PulseRole.evo
};


// ============================================================================
// LAYER STATE (backend health)
// ============================================================================
global.PULSE_LAYER_STATE = global.PULSE_LAYER_STATE || {};
global.PULSE_LAYER_STATE[4] = {
  name: "Hypothalamus",
  ok: true,
  role: HYPOTHALAMUS_CONTEXT.role,
  version: HYPOTHALAMUS_CONTEXT.version
};

if (!db) {
  log("hypothalamus", "WARNING: global.db missing — scoring disabled until wiring completes.");
}


// ============================================================================
// CONFIG — Instance Formula Limits (unchanged, but v9.3 aligned)
// ============================================================================
export const NORMAL_MAX    = 4;
export const UPGRADED_MAX  = 8;
export const HIGHEND_MAX   = 8;
export const TEST_EARN_MAX = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_SCORING_LOGGING = true;
export const SCORING_LOG_COLLECTION = "UserScoringLogs";


// ============================================================================
// TRUST SCORE — deterministic (unchanged)
// ============================================================================
function calculateTrustScore(m) {
  if (!m) return 0;

  const totalRequests = Number(m.totalRequests || 0);
  const meshRelays    = Number(m.meshRelays || 0);
  const hubSignals    = Number(m.hubSignals || 0);
  const stability     = Number(m.stabilityScore || 0);
  const avgLatency    = m.avgLatency ? Number(m.avgLatency) : null;

  let score = 0;

  score += Math.min(totalRequests / 100, 20);
  score += Math.min(meshRelays / 10, 20);
  score += Math.min(hubSignals / 5, 20);
  if (avgLatency && avgLatency < 150) score += 20;
  score += Math.min(stability, 20);

  const final = Math.min(score, 100);

  log("hypothalamus", `HealthIndex | user=${m.userId ?? "?"} | score=${final}`);
  return final;
}


// ============================================================================
// MESH SCORE — deterministic (unchanged)
// ============================================================================
function calculateMeshScore(m) {
  if (!m) return 0;

  const meshRelays = Number(m.meshRelays || 0);
  const meshPings  = Number(m.meshPings || 0);
  const hubSignals = Number(m.hubSignals || 0);
  const avgLatency = m.avgLatency ? Number(m.avgLatency) : null;

  let score = 0;

  score += Math.min(meshRelays / 5, 40);
  score += Math.min(meshPings / 10, 20);
  score += Math.min(hubSignals / 5, 20);
  if (avgLatency && avgLatency < 150) score += 20;

  const final = Math.min(score, 100);

  log("hypothalamus", `MeshHealth | user=${m.userId ?? "?"} | score=${final}`);
  return final;
}


// ============================================================================
// PHASE — deterministic (unchanged)
// ============================================================================
function calculatePhase(trustScore) {
  const t = Number(trustScore || 0);
  let phase = 1;

  if (t < 25) phase = 1;
  else if (t < 50) phase = 2;
  else if (t < 75) phase = 3;
  else phase = 4;

  log("hypothalamus", `Phase | trustScore=${t} | phase=${phase}`);
  return phase;
}


// ============================================================================
// HUB DETECTION — deterministic (unchanged)
// ============================================================================
function isHub(m) {
  if (!m) return false;

  const meshRelays    = Number(m.meshRelays || 0);
  const hubSignals    = Number(m.hubSignals || 0);
  const totalRequests = Number(m.totalRequests || 0);

  const hub =
    meshRelays > 50 ||
    hubSignals > 20 ||
    totalRequests > 500;

  if (hub) {
    log(
      "hypothalamus",
      `HIGH-FLOW ORGAN | user=${m.userId ?? "?"} | relays=${meshRelays} | hubSignals=${hubSignals} | totalRequests=${totalRequests}`
    );
  }

  return hub;
}


// ============================================================================
// INSTANCE FORMULA — deterministic (unchanged)
// ============================================================================
function allocateInstances(
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

  log(
    "hypothalamus",
    `Resource allocation | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | final=${final}`
  );

  return final;
}


// ============================================================================
// SNAPSHOT LOGGING — unchanged
// ============================================================================
async function logScoringSnapshot(userId, snapshot) {
  if (!ENABLE_SCORING_LOGGING || !db) return;

  try {
    await db.collection(SCORING_LOG_COLLECTION).add({
      ...HYPOTHALAMUS_CONTEXT,
      userId,
      ts: Date.now(),
      ...snapshot
    });

    log("hypothalamus", `Snapshot logged | user=${userId}`);
  } catch (err) {
    error("hypothalamus", "Failed to log scoring snapshot", String(err));
  }
}


// ============================================================================
// MAIN PASS — runUserScoring() (unchanged logic)
// ============================================================================
export async function runUserScoring() {
  log("hypothalamus", "Running homeostasis scoring pass…");

  if (!db) {
    error("hypothalamus", "runUserScoring called but global.db is missing.");
    global.PULSE_LAYER_STATE[4].ok = false;
    global.PULSE_LAYER_STATE[4].lastError = "db_missing";
    return { ok: false, error: "db_missing" };
  }

  let snap;
  try {
    snap = await db.collection("UserMetrics").get();
  } catch (err) {
    const msg = String(err);
    error("hypothalamus", "Failed to read UserMetrics", msg);
    global.PULSE_LAYER_STATE[4].ok = false;
    global.PULSE_LAYER_STATE[4].lastError = msg;
    return { ok: false, error: "read_UserMetrics_failed" };
  }

  const batch = db.batch();
  let processed = 0;

  for (const doc of snap.docs) {
    const m = doc.data() || {};
    m.userId = doc.id;

    const trustScore = calculateTrustScore(m);
    const meshScore  = calculateMeshScore(m);
    const phase      = calculatePhase(trustScore);
    const hubFlag    = isHub(m);

    const deviceTier     = m.deviceTier ?? "normal";
    const earnMode       = m.earnMode ?? false;
    const testEarnActive = m.testEarnActive ?? false;

    const instances = allocateInstances(
      phase,
      hubFlag,
      deviceTier,
      earnMode,
      testEarnActive
    );

    log(
      "hypothalamus",
      `Final State | user=${doc.id} | trust=${trustScore} | mesh=${meshScore} | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | instances=${instances}`
    );

    const ref = db.collection("UserScores").doc(doc.id);

    batch.set(
      ref,
      {
        ...HYPOTHALAMUS_CONTEXT,
        userId: doc.id,
        trustScore,
        meshScore,
        phase,
        hub: hubFlag,
        deviceTier,
        earnMode,
        testEarnActive,
        instances,
        lastUpdated: Date.now()
      },
      { merge: true }
    );

    await logScoringSnapshot(doc.id, {
      trustScore,
      meshScore,
      phase,
      hubFlag,
      deviceTier,
      earnMode,
      testEarnActive,
      instances
    });

    processed++;
  }

  try {
    await batch.commit();
    log("hypothalamus", `Homeostasis scoring pass complete. Processed=${processed}`);
    global.PULSE_LAYER_STATE[4].ok = true;
    global.PULSE_LAYER_STATE[4].lastError = null;
    return { ok: true, processed };
  } catch (err) {
    const msg = String(err);
    error("hypothalamus", "Failed to commit UserScores batch", msg);
    global.PULSE_LAYER_STATE[4].ok = false;
    global.PULSE_LAYER_STATE[4].lastError = msg;
    return { ok: false, error: "commit_UserScores_failed" };
  }
}


// ============================================================================
// PUBLIC EXPORTS
// ============================================================================
export {
  calculateTrustScore,
  calculateMeshScore,
  calculatePhase,
  isHub,
  allocateInstances
};
