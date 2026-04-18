// ======================================================
//  PULSE INSTANCE ORCHESTRATOR v5.2
//  “THE ADRENAL SYSTEM / FIGHT‑OR‑FLIGHT SCALING LAYER”
//  Deterministic, Drift‑Proof, Device‑Aware Scaling
//  WITH PERFORMANCE LOGGING + USER INSTANCE SNAPSHOTS
//  PURE HEALING. NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL.
// ======================================================
//
// BODY THEME — ORGANISM MAPPING:
//  ------------------------------
//  PulseInstanceOrchestrator is the **ADRENAL SYSTEM** of the Pulse organism.
//  It is the **FIGHT‑OR‑FLIGHT SCALING LAYER** — the reflexive output regulator.
//
//  • When “stress” rises (earn mode, test earn, higher tier), it scales up.
//  • When “stress” falls, it scales down.
//  • It launches new “cells” (workers) when demand spikes.
//  • It kills excess “cells” when demand drops.
//  • It never guesses — it reacts deterministically to signals.
//  • It keeps the organism efficient, not over‑inflamed.
//
//  Think of this as the **adrenal glands** for the proxy:
//  • Adrenaline = more instances, fast.
//  • Calm baseline = fewer instances, stable.
//  • Hard caps = physiological limits.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The proxy-side supervisor for per-user worker instances.
//  • The deterministic scaling engine for Pulse workers.
//  • The lifecycle manager for launching/killing workers.
//  • The performance snapshot logger for admin dashboards.
//  • The device-tier + earn-mode scaling controller.
//  • The drift-proof instance allocator.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a marketplace adapter.
//  • NOT a trust engine.
//  • NOT a scoring engine.
//  • NOT a GPU worker.
//  • NOT a blockchain client.
//  • NOT a place for user-provided logic.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No compute.
//  • No user logic.
//  • No eval / Function() / dynamic import.
//  • No Earn logic.
//  • No marketplace calls.
//  • No mutation outside worker registry.
//  • Deterministic scaling only.
//  • Drift-proof instance counts.
//
// ======================================================
//  CONFIGURABLE INSTANCE FORMULA VARIABLES
// ======================================================

// Hard caps — physiological limits of the “organism”
export const NORMAL_MAX = 4;
export const UPGRADED_MAX = 8;
export const HIGHEND_MAX = 8;
export const TEST_EARN_MAX = 16;

// Multipliers — “adrenaline boosts” under stress
export const UPGRADED_MULT = 2;
export const HIGHEND_MULT = 2;
export const EARN_MODE_MULT = 1.5;

// Logging controls — hormone panel / lab work
export const ENABLE_INSTANCE_LOGGING = true;
export const INSTANCE_LOG_COLLECTION = "UserInstanceLogs";

// ======================================================
//  Imports
// ======================================================
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

// In-memory worker registry — active “cells” per user
const activeWorkers = new Map();

console.log(
  "[ADRENAL BOOT] PulseInstanceOrchestrator v5.2 online — fight-or-flight scaling layer active."
);
console.log("[ADRENAL BOOT] Hard caps (physiological limits):", {
  NORMAL_MAX,
  UPGRADED_MAX,
  HIGHEND_MAX,
  TEST_EARN_MAX
});
console.log("[ADRENAL BOOT] Multipliers (stress response):", {
  UPGRADED_MULT,
  HIGHEND_MULT,
  EARN_MODE_MULT
});

// ======================================================
//  Device tier → max instances (body capacity)
// ======================================================
function getDeviceMax(deviceTier, testEarnActive) {
  if (testEarnActive) return TEST_EARN_MAX;

  switch (deviceTier) {
    case "upgraded":
      return UPGRADED_MAX;
    case "highend":
      return HIGHEND_MAX;
    default:
      return NORMAL_MAX;
  }
}

// ======================================================
//  Compute final instance count (FULLY DETERMINISTIC)
//  “Hormone output” based on stress + capacity
// ======================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive) {
  let final = base;

  // Structural capacity multipliers (stronger “body”)
  if (deviceTier === "upgraded") final *= UPGRADED_MULT;
  if (deviceTier === "highend") final *= HIGHEND_MULT;

  // Acute stress response (earn mode)
  if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

  // Test earn = full adrenal surge
  if (testEarnActive) final = TEST_EARN_MAX;

  const max = getDeviceMax(deviceTier, testEarnActive);
  return Math.max(1, Math.min(final, max));
}

// ======================================================
//  Log user instance performance snapshot
//  (Lab panel for adrenal output)
// ======================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      userId,
      ts: Date.now(),
      ...snapshot
    });
  } catch (err) {
    console.error("[ADRENAL] Failed to log snapshot:", err);
  }
}

// ======================================================
//  Launch a worker — spawn a new “cell”
// ======================================================
function launchWorker(userId, workerIndex) {
  const workerName = `${userId}-instance-${workerIndex}`;

  console.log(
    `[ADRENAL LAUNCH] User=${userId} | Worker=${workerName} | Index=${workerIndex}`
  );

  return {
    name: workerName,
    userId,
    index: workerIndex,
    started: Date.now(),
    interval: setInterval(() => {
      console.log(`[WORKER HEARTBEAT] ${workerName}`);
    }, 5000)
  };
}

// ======================================================
//  Kill a worker — reabsorb / shut down a “cell”
// ======================================================
function killWorker(worker) {
  console.log(`[ADRENAL SHUTDOWN] ${worker.name}`);
  clearInterval(worker.interval);
}

// ======================================================
//  MAIN ORCHESTRATOR LOOP
//  Periodic stress assessment + hormone adjustment
// ======================================================
export async function runInstanceOrchestrator() {
  console.log(
    "[ADRENAL TICK] Running fight-or-flight scaling cycle for all users…"
  );

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data();

    const baseInstances = data.instances ?? 1;
    const deviceTier = data.deviceTier ?? "normal";
    const earnMode = data.earnMode ?? false;
    const testEarnActive = data.testEarnActive ?? false;

    const finalInstances = computeFinalInstances(
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive
    );

    if (!activeWorkers.has(userId)) {
      activeWorkers.set(userId, []);
    }

    const currentWorkers = activeWorkers.get(userId);

    console.log(
      `[ADRENAL STATE] User=${userId} | Base=${baseInstances} | Tier=${deviceTier} | EarnMode=${earnMode} | TestEarn=${testEarnActive} | Current=${currentWorkers.length} | Final=${finalInstances}`
    );

    // ======================================================
    //  SCALE UP — acute stress response (adrenaline surge)
    // ======================================================
    if (currentWorkers.length < finalInstances) {
      const needed = finalInstances - currentWorkers.length;

      console.log(
        `[ADRENAL SCALE UP] User=${userId} | Need=${needed} | From=${currentWorkers.length} → To=${finalInstances}`
      );

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex);
        currentWorkers.push(worker);
      }
    }

    // ======================================================
    //  SCALE DOWN — recovery phase (return to baseline)
// ======================================================
    if (currentWorkers.length > finalInstances) {
      const extra = currentWorkers.length - finalInstances;

      console.log(
        `[ADRENAL SCALE DOWN] User=${userId} | Remove=${extra} | From=${currentWorkers.length} → To=${finalInstances}`
      );

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // ======================================================
    //  PERFORMANCE SNAPSHOT LOGGING
    //  (How much “hormone” we actually produced)
// ======================================================
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      lastUpdated: Date.now()
    });
  }

  console.log("[ADRENAL TICK COMPLETE]");
  return true;
}
