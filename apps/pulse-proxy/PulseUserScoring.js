// FILE: apps/pulse-proxy/PulseUserScoring.js
//
// PulseUserScoring v5.3 — Deterministic, Drift‑Proof, Device‑Aware Batch Scoring
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Batch scoring engine that transforms UserMetrics → UserScores.
//
// RESPONSIBILITIES:
//   • Compute trustScore
//   • Compute meshScore
//   • Compute phase
//   • Detect hub behavior
//   • Allocate instances (device-aware, earn-mode-aware, test-earn-aware)
//   • Log scoring snapshots (optional)
//
// SAFETY RULES:
//   • NO compute
//   • NO miner logic
//   • NO marketplace calls
//   • NO eval / dynamic imports
//   • NO user-provided logic
//
// ------------------------------------------------------
// 🔧 CONFIGURABLE INSTANCE FORMULA VARIABLES (EDIT FREELY)
// ------------------------------------------------------

// Hard caps
export const NORMAL_MAX = 4;
export const UPGRADED_MAX = 8;
export const HIGHEND_MAX = 8;
export const TEST_EARN_MAX = 16;

// Multipliers
export const UPGRADED_MULT = 2;
export const HIGHEND_MULT = 2;
export const EARN_MODE_MULT = 1.5;

// Logging controls
export const ENABLE_SCORING_LOGGING = true;
export const SCORING_LOG_COLLECTION = "UserScoringLogs";

// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

// ------------------------------------------------------
// calculateTrustScore()
// ------------------------------------------------------
function calculateTrustScore(m) {
  if (!m) return 0;

  let score = 0;

  // Activity (0–20)
  score += Math.min(m.totalRequests / 100, 20);

  // Mesh contribution (0–20)
  score += Math.min(m.meshRelays / 10, 20);

  // Hub-like behavior (0–20)
  score += Math.min(m.hubSignals / 5, 20);

  // Latency quality (0–20)
  if (m.avgLatency && m.avgLatency < 150) score += 20;

  // Stability (0–20)
  score += Math.min(m.stabilityScore || 0, 20);

  return Math.min(score, 100);
}

// ------------------------------------------------------
// calculateMeshScore()
// ------------------------------------------------------
function calculateMeshScore(m) {
  if (!m) return 0;

  let score = 0;

  // Relays (0–40)
  score += Math.min(m.meshRelays / 5, 40);

  // Pings (0–20)
  score += Math.min(m.meshPings / 10, 20);

  // Hub signals (0–20)
  score += Math.min(m.hubSignals / 5, 20);

  // Latency quality (0–20)
  if (m.avgLatency && m.avgLatency < 150) score += 20;

  return Math.min(score, 100);
}

// ------------------------------------------------------
// calculatePhase()
// ------------------------------------------------------
function calculatePhase(trustScore) {
  if (trustScore < 25) return 1;
  if (trustScore < 50) return 2;
  if (trustScore < 75) return 3;
  return 4;
}

// ------------------------------------------------------
// isHub()
// ------------------------------------------------------
function isHub(m) {
  if (!m) return false;

  return (
    m.meshRelays > 50 ||
    m.hubSignals > 20 ||
    m.totalRequests > 500
  );
}

// ------------------------------------------------------
// allocateInstances() — v5 Unified Device‑Aware Model
// ------------------------------------------------------
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

  return Math.max(1, Math.min(base, max));
}

// ------------------------------------------------------
// logScoringSnapshot()
// ------------------------------------------------------
async function logScoringSnapshot(userId, snapshot) {
  if (!ENABLE_SCORING_LOGGING) return;

  try {
    await db.collection(SCORING_LOG_COLLECTION).add({
      userId,
      ts: Date.now(),
      ...snapshot
    });
  } catch (err) {
    console.error("[PulseUserScoring] Failed to log scoring snapshot:", err);
  }
}

// ------------------------------------------------------
// runUserScoring()
// ------------------------------------------------------
export async function runUserScoring() {
  const snap = await db.collection("UserMetrics").get();
  const batch = db.batch();

  for (const doc of snap.docs) {
    const m = doc.data();

    const trustScore = calculateTrustScore(m);
    const meshScore = calculateMeshScore(m);
    const phase = calculatePhase(trustScore);
    const hubFlag = isHub(m);

    // NEW v5 fields
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

    // ------------------------------------------------------
    // LOG SCORING SNAPSHOT
    // ------------------------------------------------------
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
}

export {
  calculateTrustScore,
  calculateMeshScore,
  calculatePhase,
  isHub,
  allocateInstances
};
