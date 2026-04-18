// ======================================================
//  PULSE USER METRICS v6.3
//  “THE VITALS MONITOR / CIRCULATORY TELEMETRY LAYER”
//  Deterministic, Drift‑Proof, Performance‑Aware Metrics Engine
//  PURE HEALING. NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL.
// ======================================================
//
// BODY THEME — ORGANISM MAPPING:
//  ------------------------------
//  PulseUserMetrics is the **VITALS MONITOR** of Tropic Pulse.
//  It is the **CIRCULATORY TELEMETRY LAYER** — the bedside monitor.
//
//  • Records request “heartbeats” (totalRequests).
//  • Measures bandwidth “blood flow” (totalBytes).
//  • Tracks latency as “blood pressure” (avgLatency).
//  • Tracks mesh relays as “circulatory routing signals”.
//  • Tracks hub behavior as “high‑flow organ activity”.
//  • Computes trustScore as an overall “health index”.
//  • Computes phase as the “functional fitness tier”.
//  • Logs performance snapshots as “vitals panels”.
//
//  This subsystem does NOT heal — it **monitors**.
//  It does NOT command — it **reports**.
//  It does NOT scale — it **measures**.
//
//  It is the ICU monitor of the Pulse organism.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The centralized metrics engine for Tropic Pulse.
//  • The authoritative source of user activity metrics.
//  • The trustScore + phase calculator.
//  • The hub detector.
//  • The base instance allocator.
//  • The performance snapshot logger.
//  • The vitals monitor reporting circulatory conditions.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a marketplace adapter.
//  • NOT a trust engine (scores only).
//  • NOT a scheduler.
//  • NOT a runtime.
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
//  • No mutation outside Firestore.
//  • Deterministic, drift-proof metrics only.
//
// ======================================================
//  CONFIGURABLE INSTANCE FORMULA VARIABLES
// ======================================================

// Physiological caps (max circulatory throughput)
export const NORMAL_MAX = 4;
export const UPGRADED_MAX = 8;
export const HIGHEND_MAX = 8;
export const TEST_EARN_MAX = 16;

// Multipliers (fitness / stress modifiers)
export const UPGRADED_MULT = 2;
export const HIGHEND_MULT = 2;
export const EARN_MODE_MULT = 1.5;

// Logging controls (vitals panel)
export const ENABLE_PERFORMANCE_LOGGING = true;
export const PERFORMANCE_LOG_COLLECTION = "UserPerformanceLogs";

// ======================================================
//  Imports
// ======================================================
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

console.log("[VitalsMonitor BOOT] PulseUserMetrics v6.3 online.");
console.log("[VitalsMonitor BOOT] Performance logging:", ENABLE_PERFORMANCE_LOGGING);

// ======================================================
//  updateUserMetrics()
//  Called from server.js (TPProxy) on every request
//  “Record a heartbeat + vitals panel”
// ======================================================
export async function updateUserMetrics(userId, data = {}) {
  if (!userId || userId === "anonymous") return;

  console.log(
    `[VitalsMonitor] Update | user=${userId} | bytes=${data.bytes ?? 0} | duration=${data.durationMs ?? 0}ms | meshRelay=${!!data.meshRelay} | meshPing=${!!data.meshPing} | hubFlag=${!!data.hubFlag}`
  );

  const ref = db.collection("UserMetrics").doc(userId);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const existing = snap.exists ? snap.data() : {};

    // Heartbeat count
    const totalRequests = (existing.totalRequests || 0) + 1;

    // Blood flow
    const totalBytes = (existing.totalBytes || 0) + (data.bytes || 0);

    // Blood pressure (latency)
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

    // Circulatory routing signals
    const meshRelays = (existing.meshRelays || 0) + (data.meshRelay ? 1 : 0);
    const meshPings = (existing.meshPings || 0) + (data.meshPing ? 1 : 0);

    // High-flow organ signals
    const hubSignals = (existing.hubSignals || 0) + (data.hubFlag ? 1 : 0);

    // Stability index
    const stabilityScore = existing.stabilityScore || 0;

    const lastSeen = now;

    console.log(
      `[VitalsMonitor] user=${userId} | heartbeats=${totalRequests} | bloodFlow=${totalBytes} | bloodPressure=${avgLatency.toFixed(
        2
      )}ms | relays=${meshRelays} | pings=${meshPings} | hubSignals=${hubSignals}`
    );

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
        lastSeen,
        updatedAt: now
      },
      { merge: true }
    );
  });

  // ------------------------------------------------------
  // PERFORMANCE SNAPSHOT LOGGING (vitals panel)
  // ------------------------------------------------------
  if (ENABLE_PERFORMANCE_LOGGING) {
    try {
      await db.collection(PERFORMANCE_LOG_COLLECTION).add({
        userId,
        ts: Date.now(),
        bytes: data.bytes ?? null,
        durationMs: data.durationMs ?? null,
        meshRelay: data.meshRelay ?? false,
        meshPing: data.meshPing ?? false,
        hubFlag: data.hubFlag ?? false
      });

      console.log(`[VitalsMonitor] Snapshot logged for user=${userId}`);
    } catch (err) {
      console.error("[VitalsMonitor] Failed to log performance:", err);
    }
  }
}

// ======================================================
//  calculateTrustScore()
//  “Overall health index”
// ======================================================
export function calculateTrustScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Activity (circulatory activity)
  score += Math.min(metrics.totalRequests / 100, 20);

  // Mesh contribution (routing health)
  score += Math.min(metrics.meshRelays / 10, 20);

  // Hub-like behavior (high-flow organ)
  score += Math.min(metrics.hubSignals / 5, 20);

  // Blood pressure quality (latency)
  if (metrics.avgLatency && metrics.avgLatency < 150) score += 20;

  // Stability (baseline health)
  score += metrics.stabilityScore || 0;

  const final = Math.min(score, 100);

  console.log(
    `[VitalsMonitor] HealthIndex computed | user=${metrics.userId ?? "?"} | score=${final}`
  );

  return final;
}

// ======================================================
//  calculatePhase()
//  “Functional fitness tier”
// ======================================================
export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25) phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else phase = 4;

  console.log(`[VitalsMonitor] Phase computed | trustScore=${trustScore} | phase=${phase}`);

  return phase;
}

// ======================================================
//  isHub()
//  “High-flow organ detection”
// ======================================================
export function isHub(metrics) {
  if (!metrics) return false;

  const hub =
    metrics.meshRelays > 50 ||
    metrics.hubSignals > 20 ||
    metrics.totalRequests > 500;

  if (hub) {
    console.log(
      `[VitalsMonitor] HIGH-FLOW ORGAN DETECTED | user=${metrics.userId ?? "?"} | relays=${metrics.meshRelays} | hubSignals=${metrics.hubSignals} | totalRequests=${metrics.totalRequests}`
    );
  }

  return hub;
}

// ======================================================
//  allocateInstances()
//  “Circulatory capacity allocation”
// ======================================================
export function allocateInstances(phase, hubFlag, deviceTier, earnMode, testEarnActive) {
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
    `[VitalsMonitor] Circulatory capacity allocated | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | final=${final}`
  );

  return final;
}
