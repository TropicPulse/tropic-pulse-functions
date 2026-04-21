// ============================================================================
//  PULSE OS v7.7 — ADRENAL SYSTEM
//  PulseInstanceOrchestrator — Fight‑or‑Flight Scaling Layer
//  Deterministic • Drift‑Proof • Device‑Aware • Reflex‑Safe
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v7.7):
//  ----------------------------------------
//  The Adrenal System is the **fight‑or‑flight organ** of PulseOS. It reacts
//  reflexively to stress signals (UserScores) and adjusts per‑user worker
//  instances (“cells”) accordingly.
//
//  It does NOT:
//    • compute jobs
//    • run marketplace logic
//    • run user logic
//    • mutate global state
//    • perform reasoning or orchestration
//
//  It ONLY:
//    • reads UserScores
//    • computes deterministic instance counts
//    • launches or reabsorbs workers
//    • logs snapshots for admin dashboards
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//    • Fight‑or‑Flight Reflex → scale up under stress
//    • Recovery Reflex → scale down when stress drops
//    • Device‑Aware Scaling → respects device tier limits
//    • Earn‑Mode Reflex → boosts instances when earning
//    • Test‑Earn Override → max instances for test mode
//    • Immune‑Safe Logging → snapshots only, no mutation
//
//  SAFETY CONTRACT (v7.7):
//  ------------------------
//    • No eval / Function()
//    • No dynamic imports
//    • No marketplace logic
//    • No compute logic
//    • No user logic
//    • No mutation outside worker registry
//    • Deterministic scaling only
//    • Drift‑proof instance counts
//
//  BACKEND‑ONLY ORGAN
//    • Lives under /pulse-proxy
//    • Never imported by frontend
//    • Uses OSKernel logger + identity lineage
// ============================================================================


// ============================================================================
//  OSKernel imports (correct + safe)
// ============================================================================
import { logger } from "../OSKernel/PulseLogger.js";
import { PulseLineage } from "../OSKernel/PulseIdentity.js";

// Firestore (backend‑only)
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();


// ============================================================================
//  ORGAN CONTEXT — v7.7
// ============================================================================
const ADRENAL_CONTEXT = {
  layer: "PulseInstanceOrchestrator",
  role: "ADRENAL_SYSTEM",
  version: "7.7",
  lineage: PulseLineage.optimizer,   // immune/optimizer lineage
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
//  CONFIG — Physiological Limits (v7.7)
// ============================================================================
export const NORMAL_MAX     = 4;
export const UPGRADED_MAX   = 8;
export const HIGHEND_MAX    = 8;
export const TEST_EARN_MAX  = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_INSTANCE_LOGGING = true;
export const INSTANCE_LOG_COLLECTION = "UserInstanceLogs";


// ============================================================================
//  INTERNAL STATE — Active “cells” per user
// ============================================================================
const activeWorkers = new Map();


// ============================================================================
//  DEVICE TIER → MAX INSTANCES
// ============================================================================
function getDeviceMax(deviceTier, testEarnActive) {
  if (testEarnActive) return TEST_EARN_MAX;

  switch (deviceTier) {
    case "upgraded": return UPGRADED_MAX;
    case "highend":  return HIGHEND_MAX;
    default:         return NORMAL_MAX;
  }
}


// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — Deterministic v7.7
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive) {
  let final = base;

  if (deviceTier === "upgraded") final *= UPGRADED_MULT;
  if (deviceTier === "highend")  final *= HIGHEND_MULT;

  if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

  if (testEarnActive) final = TEST_EARN_MAX;

  const max = getDeviceMax(deviceTier, testEarnActive);
  return Math.max(1, Math.min(final, max));
}


// ============================================================================
//  LOG USER SNAPSHOT — v7.7
// ============================================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      ts: Date.now(),
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — Spawn a new “cell”
// ============================================================================
function launchWorker(userId, workerIndex) {
  const workerName = `${userId}-instance-${workerIndex}`;

  logger.log("adrenal", "launch", { userId, workerName, workerIndex });

  return {
    name: workerName,
    userId,
    index: workerIndex,
    started: Date.now(),
    interval: setInterval(() => {
      logger.log("adrenal", "worker_heartbeat", { workerName });
    }, 5000)
  };
}


// ============================================================================
//  KILL WORKER — Reabsorb a “cell”
// ============================================================================
function killWorker(worker) {
  logger.log("adrenal", "shutdown", { worker: worker.name });
  clearInterval(worker.interval);
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v7.7
// ============================================================================
export async function runInstanceOrchestrator() {
  logger.log("adrenal", "tick_start", ADRENAL_CONTEXT);

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data();

    const baseInstances   = data.instances ?? 1;
    const deviceTier      = data.deviceTier ?? "normal";
    const earnMode        = data.earnMode ?? false;
    const testEarnActive  = data.testEarnActive ?? false;

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

    logger.log("adrenal", "state", {
      userId,
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      current: currentWorkers.length,
      final: finalInstances
    });

    // ------------------------------------------------------------
    // SCALE UP — Fight‑or‑Flight Reflex
    // ------------------------------------------------------------
    if (currentWorkers.length < finalInstances) {
      const needed = finalInstances - currentWorkers.length;

      logger.log("adrenal", "scale_up", {
        userId,
        needed,
        from: currentWorkers.length,
        to: finalInstances
      });

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex);
        currentWorkers.push(worker);
      }
    }

    // ------------------------------------------------------------
    // SCALE DOWN — Recovery Reflex
    // ------------------------------------------------------------
    if (currentWorkers.length > finalInstances) {
      const extra = currentWorkers.length - finalInstances;

      logger.log("adrenal", "scale_down", {
        userId,
        extra,
        from: currentWorkers.length,
        to: finalInstances
      });

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // ------------------------------------------------------------
    // SNAPSHOT — Immune‑Safe Logging
    // ------------------------------------------------------------
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

  logger.log("adrenal", "tick_complete");
  return true;
}
