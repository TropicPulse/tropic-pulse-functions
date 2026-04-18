// ======================================================
//  PULSE USER SCORING v6.3
//  “THE HYPOTHALAMUS / HOMEOSTASIS REGULATION LAYER”
//  Deterministic, Drift‑Proof, Device‑Aware Batch Scoring
//  PURE HEALING. NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL.
// ======================================================
//
// BODY THEME — ORGANISM MAPPING:
//  ------------------------------
//  PulseUserScoring is the **HYPOTHALAMUS** of Tropic Pulse.
//  It is the **HOMEOSTASIS REGULATION LAYER** — the interpreter of vitals.
//
//  • Reads vitals from UserMetrics (circulatory telemetry).
//  • Computes trustScore → overall health index.
//  • Computes meshScore → network circulation health.
//  • Computes phase → functional fitness tier.
//  • Detects hubs → high‑flow organs.
//  • Allocates instances → resource distribution.
//  • Logs scoring snapshots → diagnostic chart notes.
//
//  This subsystem does NOT measure — it **interprets**.
//  It does NOT heal — it **classifies**.
//  It does NOT scale — it **decides how scaling SHOULD behave**.
//
//  It is the hypothalamus: the organ that reads the vitals monitor
//  and determines the body’s internal state.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The batch scoring engine for Tropic Pulse.
//  • The transformer from UserMetrics → UserScores.
//  • The trustScore + meshScore calculator.
//  • The phase calculator.
//  • The hub detector.
//  • The device-aware instance allocator.
//  • The scoring snapshot logger.
//  • The homeostasis interpreter.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a scheduler.
//  • NOT a runtime.
//  • NOT a marketplace adapter.
//  • NOT a blockchain client.
//  • NOT a wallet.
//  • NOT a place for user-provided logic.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No compute.
//  • No eval().
//  • No dynamic imports.
//  • No user logic.
//  • No marketplace calls.
//  • Deterministic, drift-proof scoring only.
//
// ======================================================
//  CONFIGURABLE INSTANCE FORMULA VARIABLES
// ======================================================

// Physiological caps (max resource distribution)
export const NORMAL_MAX = 4;
export const UPGRADED_MAX = 8;
export const HIGHEND_MAX = 8;
export const TEST_EARN_MAX = 16;

// Multipliers (body condition modifiers)
export const UPGRADED_MULT = 2;
export const HIGHEND_MULT = 2;
export const EARN_MODE_MULT = 1.5;

// Logging controls (diagnostic chart notes)
export const ENABLE_SCORING_LOGGING = true;
export const SCORING_LOG_COLLECTION = "UserScoringLogs";

// ======================================================
//  Imports
// ======================================================
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

console.log("[Hypothalamus BOOT] PulseUserScoring v6.3 online.");
console.log("[Hypothalamus BOOT] Scoring logging:", ENABLE_SCORING_LOGGING);

// ======================================================
//  calculateTrustScore()
//  “Overall health index”
// ======================================================
function calculateTrustScore(m) {
  if (!m) return 0;

  let score = 0;

  // Activity (circulatory activity)
  score += Math.min(m.totalRequests / 100, 20);

  // Mesh contribution (network circulation)
  score += Math.min(m.meshRelays / 10, 20);

  // Hub-like behavior (high-flow organ)
  score += Math.min(m.hubSignals / 5, 20);

  // Latency quality (blood pressure)
  if (m.avgLatency && m.avgLatency < 150) score += 20;

  // Stability (baseline health)
  score += Math.min(m.stabilityScore || 0, 20);

  const final = Math.min(score, 100);

  console.log(
    `[Hypothalamus] HealthIndex | user=${m.userId ?? "?"} | score=${final}`
  );

  return final;
}

// ======================================================
//  calculateMeshScore()
//  “Circulatory network health”
// ======================================================
function calculateMeshScore(m) {
  if (!m) return 0;

  let score = 0;

  // Relays (arterial routing)
  score += Math.min(m.meshRelays / 5, 40);

  // Pings (capillary checks)
  score += Math.min(m.meshPings / 10, 20);

  // Hub signals (organ perfusion)
  score += Math.min(m.hubSignals / 5, 20);

  // Latency quality (blood pressure)
  if (m.avgLatency && m.avgLatency < 150) score += 20;

  const final = Math.min(score, 100);

  console.log(
    `[Hypothalamus] MeshHealth | user=${m.userId ?? "?"} | score=${final}`
  );

  return final;
}

// ======================================================
//  calculatePhase()
//  “Functional fitness tier”
// ======================================================
function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25) phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else phase = 4;

  console.log(
    `[Hypothalamus] Phase | trustScore=${trustScore} | phase=${phase}`
  );

  return phase;
}

// ======================================================
//  isHub()
//  “High-flow organ detection”
// ======================================================
function isHub(m) {
  if (!m) return false;

  const hub =
    m.meshRelays > 50 ||
    m.hubSignals > 20 ||
    m.totalRequests > 500;

  if (hub) {
    console.log(
      `[Hypothalamus] HIGH-FLOW ORGAN | user=${m.userId ?? "?"} | relays=${m.meshRelays} | hubSignals=${m.hubSignals} | totalRequests=${m.totalRequests}`
    );
  }

  return hub;
}

// ======================================================
//  allocateInstances()
//  “Resource distribution / circulatory allocation”
// ======================================================
function allocateInstances(phase, hubFlag, deviceTier, earnMode, testEarnActive) {
  let base = phase >= 2 ? 2 : 1;

  if (hubFlag) base = base * 2;

  if (deviceTier === "upgraded") base *= UPGRADED_MULT;
  if (deviceTier === "highend") base *= HIGHEND_MULT;

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

  console.log(
    `[Hypothalamus] Resource allocation | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | final=${final}`
  );

  return final;
}

// ======================================================
//  logScoringSnapshot()
//  “Diagnostic chart note”
// ======================================================
async function logScoringSnapshot(userId, snapshot) {
  if (!ENABLE_SCORING_LOGGING) return;

  try {
    await db.collection(SCORING_LOG_COLLECTION).add({
      userId,
      ts: Date.now(),
      ...snapshot
    });

    console.log(`[Hypothalamus] Snapshot logged | user=${userId}`);
  } catch (err) {
    console.error("[Hypothalamus] Failed to log scoring snapshot:", err);
  }
}

// ======================================================
//  runUserScoring()
//  “Homeostasis regulation pass”
// ======================================================
export async function runUserScoring() {
  console.log("[Hypothalamus] Running homeostasis scoring pass…");

  const snap = await db.collection("UserMetrics").get();
  const batch = db.batch();

  for (const doc of snap.docs) {
    const m = doc.data();
    m.userId = doc.id;

    const trustScore = calculateTrustScore(m);
    const meshScore = calculateMeshScore(m);
    const phase = calculatePhase(trustScore);
    const hubFlag = isHub(m);

    const deviceTier = m.deviceTier ?? "normal";
    const earnMode = m.earnMode ?? false;
    const testEarnActive = m.testEarnActive ?? false;

    const instances = allocateInstances(
      phase,
      hubFlag,
      deviceTier,
      earnMode,
      testEarnActive
    );

    console.log(
      `[Hypothalamus] Final State | user=${doc.id} | trust=${trustScore} | mesh=${meshScore} | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | instances=${instances}`
    );

    const ref = db.collection("UserScores").doc(doc.id);

    batch.set(
      ref,
      {
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
  }

  await batch.commit();

  console.log("[Hypothalamus] Homeostasis scoring pass complete.");
}

export {
  calculateTrustScore,
  calculateMeshScore,
  calculatePhase,
  isHub,
  allocateInstances
};
