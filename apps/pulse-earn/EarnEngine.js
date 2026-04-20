// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/EarnEngine.js
// LAYER: THE MUSCLE SYSTEM (Worker Supervisor + Profit Orchestrator)
// ============================================================================
//
// ROLE (v7.5):
//   THE MUSCLE SYSTEM — deterministic contraction engine of Pulse‑Earn.
//   • Oversees worker lifecycle (muscle fibers).
//   • Fetches jobs from MarketplaceConnector (motor signals).
//   • Executes jobs via WorkerExecution (contraction).
//   • Submits results via ResultSubmission (release).
//   • Maintains healing + pressure metadata (muscle memory).
//
// WHY “MUSCLE SYSTEM”?:
//   • Workers behave like muscle fibers contracting in cycles.
//   • Foreman acts like a neuromuscular controller.
//   • Ensures continuous throughput (rhythmic contraction).
//   • Handles errors safely (reflexive inhibition).
//   • Maintains stable, profitable output (homeostasis).
//
// PURPOSE (v7.5):
//   • Provide a deterministic, drift‑proof worker lifecycle engine.
//   • Guarantee safe, predictable job execution.
//   • Maintain healing + pressure metadata for Earn healers.
//   • Preserve contraction cycles + muscle memory (conceptual only).
//
// CONTRACT (unchanged in spirit):
//   • PURE SUPERVISOR — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic worker loops only.
//   • v7.5 adds metadata-only awareness of tendon/field context.
// ============================================================================

import { getNextJob } from "./MarketplaceConnector.js";
import { executeJob } from "./WorkerExecution.js";
import { submitJobResult } from "./ResultSubmission.js";

const EarnEngine = {
  running: false,
  workers: new Map(),

  // -------------------------------------------------------------------------
  // Healing Metadata — Muscle Memory Log
  // -------------------------------------------------------------------------
  engineState: "idle", // idle | running | stopping | error
  workerStates: new Map(), // workerId → { state, lastJobId, lastError, lastClass, lastVolatility }
  cycleCount: 0,
  lastJob: null,
  lastResult: null,
  lastError: null,
  lastReason: null,

  // v7.5: pressure + context awareness (read-only, for healers/diagnostics)
  lastTendonContext: null,   // earner_context from job, if present
  lastVolatility: null,      // earner_volatility from job, if present

  // -------------------------------------------------------------------------
  // start(config) — Begin contraction cycles
  // -------------------------------------------------------------------------
  async start(config) {
    if (this.running) {
      config.logFn("earn:already_running");
      return;
    }

    this.running = true;
    this.engineState = "running";
    this.lastReason = null;

    config.logFn("earn:engine_start", {
      maxWorkers: config.maxWorkers,
      engineState: this.engineState,
    });

    // Spawn muscle fibers (workers)
    for (let i = 0; i < config.maxWorkers; i++) {
      const workerId = `${config.workerIdBase}-${i}`;
      this.workerStates.set(workerId, {
        state: "starting",
        lastJobId: null,
        lastError: null,
        lastClass: null,
        lastVolatility: null,
      });

      const workerPromise = this.workerLoop(workerId, config);
      this.workers.set(workerId, workerPromise);
    }
  },

  // -------------------------------------------------------------------------
  // workerLoop(workerId, config) — Contraction Cycle Loop
  // -------------------------------------------------------------------------
  async workerLoop(workerId, config) {
    config.logFn("earn:worker_start", { workerId });

    this.workerStates.set(workerId, {
      state: "running",
      lastJobId: null,
      lastError: null,
      lastClass: null,
      lastVolatility: null,
    });

    while (this.running) {
      try {
        this.cycleCount++;

        // ------------------------------------------------------
        // 1. FETCH — Motor signal
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "fetching";

        const job = await getNextJob(config.marketplaces, config.capacity);

        if (!job) {
          await new Promise(r => setTimeout(r, config.idleDelayMs));
          continue;
        }

        this.lastJob = job;
        this.workerStates.get(workerId).lastJobId = job.id;

        // v7.5: read tendon/field metadata if present (safe, optional)
        const tendonContext = job.impulse?.flags?.earner_context || null;
        const volatility = job.impulse?.flags?.earner_volatility ?? null;

        this.lastTendonContext = tendonContext;
        this.lastVolatility = volatility;

        if (tendonContext) {
          this.workerStates.get(workerId).lastClass = tendonContext.class || null;
        }
        if (volatility !== null) {
          this.workerStates.get(workerId).lastVolatility = volatility;
        }

        config.logFn("earn:job_selected", {
          workerId,
          jobId: job.id,
          cycle: this.cycleCount,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // ------------------------------------------------------
        // 2. EXECUTE — Contraction
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "executing";

        const result = await executeJob(job);
        this.lastResult = result;

        config.logFn("earn:job_executed", {
          workerId,
          jobId: job.id,
          success: result.success,
          durationMs: result.durationMs,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // ------------------------------------------------------
        // 3. SUBMIT — Release
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "submitting";

        const submission = await submitJobResult(job, result);

        config.logFn("earn:job_submitted", {
          workerId,
          jobId: job.id,
          submission,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // ------------------------------------------------------
        // 4. IDLE — Relaxation
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "idle";

      } catch (err) {
        // Reflexive inhibition
        this.lastError = err.message;
        this.workerStates.get(workerId).lastError = err.message;
        this.workerStates.get(workerId).state = "error";

        config.logFn("earn:worker_error", {
          workerId,
          error: err.message,
        });

        if (config.stopOnError) {
          await this.hardStop(config, err.message);
          return;
        }
      }
    }

    this.workerStates.get(workerId).state = "stopped";
    config.logFn("earn:worker_exit", { workerId });
  },

  // -------------------------------------------------------------------------
  // hardStop(config, reason) — Emergency Reflex Shutdown
  // -------------------------------------------------------------------------
  async hardStop(config, reason) {
    if (!this.running) return;

    this.running = false;
    this.engineState = "error";
    this.lastReason = reason;

    config.logFn("earn:engine_hard_stop", {
      reason,
      workers: Array.from(this.workers.keys()),
      lastTendonContext: this.lastTendonContext,
      lastVolatility: this.lastVolatility,
    });

    try {
      await config.sendFailureEmailFn({
        reason,
        lastEvent: this.lastReason,
        workers: Array.from(this.workers.keys()),
        lastTendonContext: this.lastTendonContext,
        lastVolatility: this.lastVolatility,
      });
    } catch (err) {
      config.logFn("earn:email_failed", { err });
    }

    await Promise.allSettled(this.workers.values());
    this.workers.clear();
  },

  // -------------------------------------------------------------------------
  // softStop(config) — Controlled Relaxation
  // -------------------------------------------------------------------------
  softStop(config) {
    if (!this.running) return;

    this.running = false;
    this.engineState = "stopping";

    config.logFn("earn:engine_soft_stop", {
      workers: Array.from(this.workers.keys()),
    });
  },
};

export default EarnEngine;
