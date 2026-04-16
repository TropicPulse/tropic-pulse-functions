// FILE: apps/pulse-proxy/PulseInstanceOrchestrator.js
//
// PulseInstanceOrchestrator v5.1 — Deterministic, Drift‑Proof, Device‑Aware Scaling
// WITH PERFORMANCE LOGGING + USER INSTANCE SNAPSHOTS
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Proxy-side supervisor that manages per-user worker instances.
//
// RESPONSIBILITIES:
//   • Read UserScores
//   • Apply device-aware + mode-aware scaling rules
//   • Launch workers
//   • Kill workers
//   • Prevent duplicates
//   • Maintain lifecycle
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
export const ENABLE_INSTANCE_LOGGING = true;
export const INSTANCE_LOG_COLLECTION = "UserInstanceLogs";

// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();

// In-memory worker registry
const activeWorkers = new Map();

// ------------------------------------------------------
// Device tier → max instances
// ------------------------------------------------------
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

// ------------------------------------------------------
// Compute final instance count (FULLY DETERMINISTIC)
// ------------------------------------------------------
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive) {
  let final = base;

  if (deviceTier === "upgraded") final *= UPGRADED_MULT;
  if (deviceTier === "highend") final *= HIGHEND_MULT;

  if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

  if (testEarnActive) final = TEST_EARN_MAX;

  const max = getDeviceMax(deviceTier, testEarnActive);
  return Math.max(1, Math.min(final, max));
}

// ------------------------------------------------------
// Log user instance performance snapshot
// ------------------------------------------------------
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      userId,
      ts: Date.now(),
      ...snapshot
    });
  } catch (err) {
    console.error("[InstanceOrchestrator] Failed to log snapshot:", err);
  }
}

// ------------------------------------------------------
// Launch a worker
// ------------------------------------------------------
function launchWorker(userId, workerIndex) {
  const workerName = `${userId}-instance-${workerIndex}`;
  console.log(`Launching worker: ${workerName}`);

  return {
    name: workerName,
    userId,
    index: workerIndex,
    started: Date.now(),
    interval: setInterval(() => {
      console.log(`Worker ${workerName} heartbeat`);
    }, 5000)
  };
}

// ------------------------------------------------------
// Kill a worker
// ------------------------------------------------------
function killWorker(worker) {
  console.log(`Killing worker: ${worker.name}`);
  clearInterval(worker.interval);
}

// ------------------------------------------------------
// MAIN ORCHESTRATOR LOOP
// ------------------------------------------------------
export async function runInstanceOrchestrator() {
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

    // SCALE UP
    if (currentWorkers.length < finalInstances) {
      const needed = finalInstances - currentWorkers.length;

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex);
        currentWorkers.push(worker);
      }
    }

    // SCALE DOWN
    if (currentWorkers.length > finalInstances) {
      const extra = currentWorkers.length - finalInstances;

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // ------------------------------------------------------
    // PERFORMANCE SNAPSHOT LOGGING
    // ------------------------------------------------------
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

  return true;
}
