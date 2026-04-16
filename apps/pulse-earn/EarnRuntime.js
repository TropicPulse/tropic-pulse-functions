// FILE: tropic-pulse-functions/apps/pulse-earn/EarnRuntime.js
//
// EarnRuntime v5 — Deterministic, Drift‑Proof, Self‑Healing Worker Loop
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   EarnRuntime — the active worker loop for Pulse Earn.
//
// RESPONSIBILITIES:
//   • Continuously pull jobs from MarketplaceConnector
//   • Execute jobs via WorkerExecution
//   • Submit results via ResultSubmission
//   • Log lifecycle events
//   • Obey engineRef.running for lifecycle control
//
// THIS FILE IS:
//   • The worker loop
//   • The runtime executor
//   • The job → compute → submit pipeline
//   • A deterministic, safe execution environment
//
// THIS FILE IS NOT:
//   • A scheduler
//   • A supervisor
//   • A compute engine
//   • A marketplace adapter
//   • A reputation engine
//   • A ledger client
//   • A wallet or token handler
//
// SAFETY RULES:
//   • Never execute arbitrary code
//   • Never mutate job objects
//   • Always catch runtime errors
//   • Always remain deterministic
//
// ------------------------------------------------------
// EarnRuntime — Worker Execution Loop (v5 Healing Edition)
// ------------------------------------------------------

import { getNextJob } from "./MarketplaceConnector.js";
import { executeJob } from "./WorkerExecution.js";
import { submitJobResult } from "./ResultSubmission.js";

// Healing metadata
const runtimeHealing = {
  cycles: 0,
  lastJob: null,
  lastResult: null,
  lastSubmission: null,
  lastError: null,
  lastExitReason: null,
  lastTimestamp: null,
};

export async function startEarnRuntime(workerId, config, engineRef) {
  const { logFn, idleDelayMs, stopOnError } = config;

  logFn("earn:runtime_start", { workerId });

  while (engineRef.running) {
    try {
      runtimeHealing.cycles++;
      runtimeHealing.lastTimestamp = Date.now();

      // ------------------------------------------------------
      // 1. FETCH
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
      // 2. EXECUTE
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
      // 3. SUBMIT
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

export function stopEarnRuntime() {
  // No-op: engine controls lifecycle
}

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------
export function getEarnRuntimeHealingState() {
  return { ...runtimeHealing };
}
