// ============================================================================
//  PULSE OS v9.2 — USER METRICS (VITALS MONITOR)
//  “The Vitals Monitor / Circulatory Telemetry Layer”
//  PURE MEASUREMENT. NO HEALING. NO COMMAND. NO SCALING.
// ============================================================================

// Safe globals (backend-only)
const db    = global.db;
const log   = global.log   || console.log;
const error = global.error || console.error;


// ============================================================================
//  ORGAN CONTEXT — v9.2
// ============================================================================
const VITALS_CONTEXT = {
  layer: "PulseUserMetrics",
  role: "VITALS_MONITOR",
  version: "9.2",
  lineage: "interface-core",   // circulatory telemetry lineage

  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,
    deterministicVitals: true,
    zeroDriftAverages: true
  }
};


// ============================================================================
//  CONFIG — Physiological Limits (unchanged behavior, v9.2 identity)
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
//  updateUserMetrics() — “Record a heartbeat + vitals panel”
//  PURE MEASUREMENT. Deterministic. Drift‑proof.
// ============================================================================
export async function updateUserMetrics(userId, data = {}) {
  if (!userId || userId === "anonymous") return;

  log("vitals", "update", {
    userId,
    bytes: data.bytes ?? 0,
    durationMs: data.durationMs ?? 0,
    meshRelay: !!data.meshRelay,
    meshPing: !!data.meshPing,
    hubFlag: !!data.hubFlag
  });

  const ref = db.collection("UserMetrics").doc(userId);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const existing = snap.exists ? snap.data() : {};

    // Basic counters
    const totalRequests = (existing.totalRequests || 0) + 1;
    const totalBytes    = (existing.totalBytes || 0) + (data.bytes || 0);

    // Rolling average latency (zero‑drift)
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

    // Mesh + hub activity
    const meshRelays     = (existing.meshRelays || 0) + (data.meshRelay ? 1 : 0);
    const meshPings      = (existing.meshPings || 0) + (data.meshPing ? 1 : 0);
    const hubSignals     = (existing.hubSignals || 0) + (data.hubFlag ? 1 : 0);
    const stabilityScore = existing.stabilityScore || 0;

    // Write updated vitals
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

  // Optional performance snapshot
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

      log("vitals", "snapshot_logged", { userId });
    } catch (err) {
      error("vitals", "snapshot_failed", { error: String(err) });
    }
  }
}


// ============================================================================
//  calculateTrustScore() — “Overall health index”
//  Deterministic scoring. Zero‑drift. v9.2 identity.
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

  log("vitals", "trust_score", {
    userId: metrics.userId ?? "?",
    score: final
  });

  return final;
}


// ============================================================================
//  calculatePhase() — “Functional fitness tier”
//  1–4 tier. Deterministic. No behavior change.
// ============================================================================
export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25) phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else phase = 4;

  log("vitals", "phase", { trustScore, phase });

  return phase;
}


// ============================================================================
//  isHub() — “High‑flow organ detection”
//  Same logic, v9.2 identity.
// ============================================================================
export function isHub(metrics) {
  if (!metrics) return false;

  const hub =
    metrics.meshRelays > 50 ||
    metrics.hubSignals > 20 ||
    metrics.totalRequests > 500;

  if (hub) {
    log("vitals", "hub_detected", {
      userId: metrics.userId ?? "?",
      relays: metrics.meshRelays,
      hubSignals: metrics.hubSignals,
      totalRequests: metrics.totalRequests
    });
  }

  return hub;
}


// ============================================================================
//  allocateInstances() — “Circulatory capacity allocation”
//  PURE COMPUTE. No scaling. No command. No healing.
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

  log("vitals", "instance_allocation", {
    phase,
    hubFlag,
    deviceTier,
    earnMode,
    testEarnActive,
    final
  });

  return final;
}
