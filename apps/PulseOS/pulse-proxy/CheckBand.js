// ============================================================================
//  PULSE OS v11 — ADRENAL SYSTEM
//  PulseInstanceOrchestrator — Fight‑or‑Flight Scaling Layer
//  Deterministic • Drift‑Proof • Device‑Aware • Reflex‑Safe
//  Backend‑Only Organ (Proxy Spine)
// ============================================================================
//
//  ROLE (v11):
//  -----------
//  • Backend reflex organ that scales worker “cells” per user.
//  • Reads UserScores → computes deterministic instance counts.
//  • Launches or reabsorbs workers.
//  • Logs snapshots for admin dashboards.
//  • Mode‑aware: routes behavior via orchestratorMode (NORMAL / EARN_STRESS / DRAIN).
//  • Ready to be wrapped by PulseOSGovernor (multi‑instance law).
//
//  SAFETY CONTRACT (v11):
//  ----------------------
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
//  PULSE ROLE — v11 Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "11.0",
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
//  ORGAN CONTEXT — v11
// ============================================================================
const ADRENAL_CONTEXT = {
  layer: PulseRole.layer,
  role: "ADRENAL_SYSTEM",
  version: PulseRole.version,
  lineage: PulseLineage.optimizer,
  evo: PulseRole.evo
};


// ============================================================================
//  MODES — Orchestrator routing modes (v11)
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};


// ============================================================================
//  CONFIG — Physiological Limits (v11, drift‑proof)
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
//  • Only legal mutable registry in this organ
// ============================================================================
const activeWorkers = new Map(); // userId -> worker[]


// ============================================================================
//  DEVICE TIER → MAX INSTANCES (deterministic, v11)
// ============================================================================
function getDeviceMax(deviceTier, testEarnActive, orchestratorMode) {
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    return 1;
  }

  if (testEarnActive) {
    return TEST_EARN_MAX;
  }

  switch (deviceTier) {
    case "upgraded":
      return UPGRADED_MAX;
    case "highend":
      return HIGHEND_MAX;
    default:
      return NORMAL_MAX;
  }
}
// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — Deterministic v11
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode) {
  let final = base;

  // Mode-aware routing (deterministic)
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) {
      final = Math.floor(final * EARN_MODE_MULT);
    }

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      // Stress mode: deterministic ceiling, no randomness
      final = Math.max(final, base * 2);
    }

    if (testEarnActive) {
      final = TEST_EARN_MAX;
    }
  }

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  return Math.max(1, Math.min(final, max));
}


// ============================================================================
//  LOG USER SNAPSHOT — v11 (deterministic, immune-safe)
//  • No Date.now()
//  • No nondeterministic timestamps
// ============================================================================
let adrenalSeq = 0;

async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      seq: ++adrenalSeq,   // deterministic, replaces Date.now()
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — v11 (no timers, no intervals, no Date.now)
//  • Workers become pure metadata objects
//  • Heartbeats removed (timers forbidden in v11)
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
    seq: ++adrenalSeq   // deterministic creation marker
  };
}


// ============================================================================
//  KILL WORKER — v11 (no intervals to clear)
// ============================================================================
function killWorker(worker) {
  logger.log("adrenal", "shutdown", {
    worker: worker.name,
    mode: worker.mode
  });
  // No timers to clear in v11
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v11
//  Deterministic • Drift‑Proof • No timing • No intervals
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
    // SCALE UP — Fight‑or‑Flight Reflex (deterministic)
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
    // SCALE DOWN — Recovery Reflex (deterministic)
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
    // SNAPSHOT — Immune‑Safe Logging (deterministic)
    // ------------------------------------------------------------
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      seq: adrenalSeq,
      mode: orchestratorMode
    });
  }

  logger.log("adrenal", "tick_complete", { mode: orchestratorMode });
  return true;
}
