// FILE: apps/pulse-proxy/PulseUserMetrics.js
//
// PulseUserMetrics v5.2 — Deterministic, Drift‑Proof, Performance‑Aware Metrics Engine
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Centralized metrics engine for Tropic Pulse.
//
// RESPONSIBILITIES:
//   • Track user activity (requests, bytes, latency)
//   • Track mesh behavior (relays, pings)
//   • Track hub signals
//   • Track stability
//   • Compute trustScore
//   • Compute phase
//   • Detect hub behavior
//   • Allocate base instances
//   • Log performance snapshots for admin dashboards
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
export const ENABLE_PERFORMANCE_LOGGING = true;
export const PERFORMANCE_LOG_COLLECTION = "UserPerformanceLogs";

// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

// ------------------------------------------------------
// updateUserMetrics()
// Called from server.js (TPProxy) on every request
// ------------------------------------------------------
export async function updateUserMetrics(userId, data = {}) {
  if (!userId || userId === "anonymous") return;

  const ref = db.collection("UserMetrics").doc(userId);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const existing = snap.exists ? snap.data() : {};

    // Base counters
    const totalRequests = (existing.totalRequests || 0) + 1;
    const totalBytes = (existing.totalBytes || 0) + (data.bytes || 0);

    // Latency averaging
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

    // Mesh + hub signals
    const meshRelays = (existing.meshRelays || 0) + (data.meshRelay ? 1 : 0);
    const meshPings = (existing.meshPings || 0) + (data.meshPing ? 1 : 0);
    const hubSignals = (existing.hubSignals || 0) + (data.hubFlag ? 1 : 0);

    // Stability (simple for now)
    const stabilityScore = existing.stabilityScore || 0;
    const lastSeen = now;

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
  // PERFORMANCE SNAPSHOT LOGGING
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
    } catch (err) {
      console.error("[PulseUserMetrics] Failed to log performance:", err);
    }
  }
}

// ------------------------------------------------------
// calculateTrustScore()
// ------------------------------------------------------
export function calculateTrustScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Activity
  score += Math.min(metrics.totalRequests / 100, 20);

  // Mesh contribution
  score += Math.min(metrics.meshRelays / 10, 20);

  // Hub-like behavior
  score += Math.min(metrics.hubSignals / 5, 20);

  // Latency quality
  if (metrics.avgLatency && metrics.avgLatency < 150) score += 20;

  // Stability
  score += metrics.stabilityScore || 0;

  return Math.min(score, 100);
}

// ------------------------------------------------------
// calculatePhase()
// ------------------------------------------------------
export function calculatePhase(trustScore) {
  if (trustScore < 25) return 1;
  if (trustScore < 50) return 2;
  if (trustScore < 75) return 3;
  return 4;
}

// ------------------------------------------------------
// isHub()
// ------------------------------------------------------
export function isHub(metrics) {
  if (!metrics) return false;

  return (
    metrics.meshRelays > 50 ||
    metrics.hubSignals > 20 ||
    metrics.totalRequests > 500
  );
}

// ------------------------------------------------------
// allocateInstances() — v5 Device‑Aware Model
// ------------------------------------------------------
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

  return Math.max(1, Math.min(base, max));
}
