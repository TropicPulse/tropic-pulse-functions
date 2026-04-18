// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/EarnRuntime.js
// LAYER: THE PULSE (Heartbeat Loop + Purpose Executor)
// ============================================================================
//
// ROLE:
//   THE PULSE — Pulse‑Earn’s continuous heartbeat.
//   • Pulls jobs from the Exchange Office (MarketplaceConnector)
//   • Executes jobs via the Craftsman (WorkerExecution)
//   • Submits results via the Return Clerk (ResultSubmission)
//   • Logs each beat of the worker’s lifecycle
//
// WHY “PULSE”?:
//   • It is the rhythmic loop that keeps Earn alive
//   • It beats continuously while the Foreman allows it
//   • It pumps jobs through the system like blood through veins
//   • It maintains the life cycle of the Earn worker
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof execution loop
//   • Guarantee safe job → compute → submit flow
//   • Maintain healing metadata for the Physician (EarnHealer)
//
// CONTRACT:
//   • PURE RUNTIME — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic loop only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 EarnRuntime
// ============================================================================

import { getNextJob } from "./MarketplaceConnector.js";
import { executeJob } from "./WorkerExecution.js";
import { submitJobResult } from "./ResultSubmission.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Pulse Rhythm Log
// ---------------------------------------------------------------------------
const runtimeHealing = {
  cycles: 0,
  lastJob: null,
  lastResult: null,
  lastSubmission: null,
  lastError: null,
  lastExitReason: null,
  lastTimestamp: null,
};

// ---------------------------------------------------------------------------
// startEarnRuntime — Begin the heartbeat
// ---------------------------------------------------------------------------
export async function startEarnRuntime(workerId, config, engineRef) {
  const { logFn, idleDelayMs, stopOnError } = config;

  logFn("earn:runtime_start", { workerId });

  while (engineRef.running) {
    try {
      runtimeHealing.cycles++;
      runtimeHealing.lastTimestamp = Date.now();

      // ------------------------------------------------------
      // 1. FETCH — Pulse contraction
      // ------------------------------------------------------
      const job = await getNextJob(config.marketplaces);

      if (!job) {
        const delay = Math.max(50, idleDelayMs || 250);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      runtimeHealing.lastJob = job;

      logFn("earn:runtime_job_selected", { workerId, jobId: job.id });

      // ------------------------------------------------------
      // 2. EXECUTE — Pulse pumps
      // ------------------------------------------------------
      const result = await executeJob(job);
      runtimeHealing.lastResult = result;

      logFn("earn:runtime_job_executed", {
        workerId,
        jobId: job.id,
        success: result.success,
        durationMs: result.durationMs,
      });

      // ------------------------------------------------------
      // 3. SUBMIT — Pulse releases
      // ------------------------------------------------------
      const submission = await submitJobResult(job, result);
      runtimeHealing.lastSubmission = submission;

      logFn("earn:runtime_job_submitted", {
        workerId,
        jobId: job.id,
        submission,
      });

    } catch (err) {
      runtimeHealing.lastError = {
        message: err.message,
        workerId,
        timestamp: Date.now(),
      };

      logFn("earn:runtime_error", {
        workerId,
        error: err.message,
      });

      if (stopOnError) {
        runtimeHealing.lastExitReason = "hardStop";
        await engineRef.hardStop(config, err.message);
        break;
      }
    }
  }

  runtimeHealing.lastExitReason = "softStop";
  logFn("earn:runtime_exit", { workerId });
}

// ---------------------------------------------------------------------------
// stopEarnRuntime — Pulse stops when Foreman stops engine
// ---------------------------------------------------------------------------
export function stopEarnRuntime() {
  // No-op: engine controls lifecycle
}

// ---------------------------------------------------------------------------
// Export healing metadata — Pulse Rhythm Report
// ---------------------------------------------------------------------------
export function getEarnRuntimeHealingState() {
  return { ...runtimeHealing };
}
