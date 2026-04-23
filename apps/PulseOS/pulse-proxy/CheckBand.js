// ============================================================================
//  PULSE OS v10.4 — ADRENAL SYSTEM
//  PulseInstanceOrchestrator — Fight‑or‑Flight Scaling Layer
//  Deterministic • Drift‑Proof • Device‑Aware • Reflex‑Safe
//  Backend‑Only Organ (Proxy Spine)
// ============================================================================
//
//  ROLE (v10.4):
//  ------------
//  • Backend reflex organ that scales worker “cells” per user.
//  • Reads UserScores → computes deterministic instance counts.
//  • Launches or reabsorbs workers.
//  • Logs snapshots for admin dashboards.
//  • Mode‑aware: routes behavior via orchestratorMode (NORMAL / EARN_STRESS / DRAIN).
//  • Ready to be wrapped by PulseOSGovernor (multi‑instance law).
//
//  SAFETY CONTRACT (v10.4):
//  ------------------------
//  • Imports allowed (backend‑only).
//  • No eval / Function().
//  • No dynamic imports.
//  • No mutation outside worker registry.
//  • Deterministic scaling only.
//  • Drift‑proof instance counts.
//  • Immune‑safe logging.
// ============================================================================


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================
import { logger } from "../OSKernel/PulseLogger.js";
import { PulseLineage } from "../OSKernel/PulseIdentity.js";

// Firestore (backend‑only)
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();


// ============================================================================
//  PULSE ROLE — v10.4 Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "10.4",
  identity: "PulseInstanceOrchestrator",

  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSendAware: true,
    futureEvolutionReady: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v10.4
// ============================================================================
const ADRENAL_CONTEXT = {
  layer: PulseRole.layer,
  role: "ADRENAL_SYSTEM",
  version: PulseRole.version,
  lineage: PulseLineage.optimizer,
  evo: PulseRole.evo
};


// ============================================================================
//  MODES — Orchestrator routing modes (v10.4)
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};


// ============================================================================
//  CONFIG — Physiological Limits (v10.4)
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
const activeWorkers = new Map(); // userId -> worker[]


// ============================================================================
//  DEVICE TIER → MAX INSTANCES
// ============================================================================
function getDeviceMax(deviceTier, testEarnActive, orchestratorMode) {
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) return 1;
  if (testEarnActive) return TEST_EARN_MAX;

  switch (deviceTier) {
    case "upgraded": return UPGRADED_MAX;
    case "highend":  return HIGHEND_MAX;
    default:         return NORMAL_MAX;
  }
}


// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — Deterministic v10.4
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode) {
  let final = base;

  // Mode‑aware routing
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      // Stress mode: push to deterministic ceiling, but still bounded
      final = Math.max(final, base * 2);
    }

    if (testEarnActive) final = TEST_EARN_MAX;
  }

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  return Math.max(1, Math.min(final, max));
}


// ============================================================================
//  LOG USER SNAPSHOT — v10.4
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
function launchWorker(userId, workerIndex, orchestratorMode) {
  const workerName = `${userId}-instance-${workerIndex}`;

  logger.log("adrenal", "launch", {
    userId,
    workerName,
    workerIndex,
    mode: orchestratorMode
  });

  return {
    name: workerName,
    userId,
    index: workerIndex,
    mode: orchestratorMode,
    started: Date.now(),
    interval: setInterval(() => {
      logger.log("adrenal", "worker_heartbeat", { workerName, mode: orchestratorMode });
    }, 5000)
  };
}


// ============================================================================
//  KILL WORKER — Reabsorb a “cell”
// ============================================================================
function killWorker(worker) {
  logger.log("adrenal", "shutdown", { worker: worker.name, mode: worker.mode });
  clearInterval(worker.interval);
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v10.4
//  Optional pulse envelope for future Governor wrapping:
//    pulse = { jobId, lineage, meta..., mode }
// ============================================================================
export async function runInstanceOrchestrator(pulse) {
  const orchestratorMode =
    pulse?.mode && Object.values(ORCHESTRATOR_MODES).includes(pulse.mode)
      ? pulse.mode
      : ORCHESTRATOR_MODES.NORMAL;

  logger.log("adrenal", "tick_start", {
    ...ADRENAL_CONTEXT,
    pulseId: pulse?.jobId || pulse?.id || null,
    mode: orchestratorMode
  });

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
      testEarnActive,
      orchestratorMode
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
      final: finalInstances,
      mode: orchestratorMode
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
        to: finalInstances,
        mode: orchestratorMode
      });

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex, orchestratorMode);
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
        to: finalInstances,
        mode: orchestratorMode
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
      lastUpdated: Date.now(),
      mode: orchestratorMode
    });
  }

  logger.log("adrenal", "tick_complete", { mode: orchestratorMode });
  return true;
}
