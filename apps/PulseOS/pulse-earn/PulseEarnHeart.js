// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnHeart.js
// LAYER: THE HEART (Heartbeat Loop + Circulatory Pump)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE HEART — Pulse‑Earn’s continuous rhythmic engine.
//   • Pulls jobs from the Exchange Office (MarketplaceConnector).
//   • Executes jobs via the Craftsman (WorkerExecution) or PulseSend fallback.
//   • Submits results via the Return Clerk (ResultSubmission).
//   • Logs each cardiac cycle of the worker’s lifecycle.
//
// WHY “HEART”?:
//   • It is the rhythmic loop that keeps Earn alive.
//   • It beats continuously while the Muscle System (EarnEngine) allows it.
//   • It pumps jobs through the system like blood through arteries.
//   • It maintains the life cycle of the Earn worker (cardiac output).
//
// PURPOSE (v9.2):
//   • Provide a deterministic, drift‑proof execution loop.
//   • Guarantee safe job → compute → submit flow.
//   • Maintain healing metadata for the Immune System (PulseEarnImmuneSystem).
//   • Preserve cardiac rhythm + circulatory stability (conceptual only).
//
// CONTRACT (unchanged):
//   • PURE RUNTIME — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic loop only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v9.2 EarnRuntime.
// ============================================================================

import { getNextJob } from "./PulseEarnNervousSystem.js";
import { executeJob } from "./PulseEarnMetabolism.js";
import { submitJobResult } from "./PulseEarnLymphNodes.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Cardiac Rhythm Log
// ---------------------------------------------------------------------------
const heartHealing = {
  cycles: 0,              // cardiac cycles completed
  lastJob: null,          // last “blood cell” pumped
  lastResult: null,       // metabolic output
  lastSubmission: null,   // venous return
  lastError: null,        // arrhythmia event
  lastExitReason: null,   // cardiac arrest reason
  lastTimestamp: null,    // last heartbeat timestamp
};

// ---------------------------------------------------------------------------
// startPulseEarnHeart — Begin the heartbeat
// ---------------------------------------------------------------------------
export async function startPulseEarnHeart(workerId, config, engineRef) {
  const { logFn, idleDelayMs, stopOnError } = config;

  logFn("earn:heart_start", { workerId });

  // NOTE: While the Muscle System (EarnEngine) is running,
  //       the Heart continues to beat.
  while (engineRef.running) {
    try {
      heartHealing.cycles++;
      heartHealing.lastTimestamp = Date.now();

      // ------------------------------------------------------
      // 1. FETCH — Systole: Heart contracts, pulling in blood
      // ------------------------------------------------------
      const job = await getNextJob(config.marketplaces);

      if (!job) {
        const delay = Math.max(50, idleDelayMs || 250);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      heartHealing.lastJob = job;

      logFn("earn:heart_job_selected", { workerId, jobId: job.id });

      // ------------------------------------------------------
      // 2. EXECUTE — Cardiac output: Heart pumps
      // ------------------------------------------------------
      const result = await executeJob(job);
      heartHealing.lastResult = result;

      logFn("earn:heart_job_executed", {
        workerId,
        jobId: job.id,
        success: result.success,
        durationMs: result.durationMs,
      });

      // ------------------------------------------------------
      // 3. SUBMIT — Venous return: Blood flows back
      // ------------------------------------------------------
      const submission = await submitJobResult(job, result);
      heartHealing.lastSubmission = submission;

      logFn("earn:heart_job_submitted", {
        workerId,
        jobId: job.id,
        submission,
      });

      // NOTE: Successful cycle = healthy cardiac output

    } catch (err) {
      // Arrhythmia event
      heartHealing.lastError = {
        message: err.message,
        workerId,
        timestamp: Date.now(),
      };

      logFn("earn:heart_error", {
        workerId,
        error: err.message,
      });

      if (stopOnError) {
        heartHealing.lastExitReason = "hardStop";
        await engineRef.hardStop(config, err.message);
        break;
      }
    }
  }

  // Cardiac arrest (engine stopped)
  heartHealing.lastExitReason = "softStop";
  logFn("earn:heart_exit", { workerId });
}

// ---------------------------------------------------------------------------
// stopPulseEarnHeart — Heart stops when Muscle System stops engine
// ---------------------------------------------------------------------------
export function stopPulseEarnHeart() {
  // No-op: engine controls lifecycle
}

// ---------------------------------------------------------------------------
// Export healing metadata — Cardiac Rhythm Report
// ---------------------------------------------------------------------------
export function getPulseEarnHeartHealingState() {
  return { ...heartHealing };
}
