// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/EarnEngine.js
// LAYER: THE MUSCLE SYSTEM (Worker Supervisor + Profit Orchestrator)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE MUSCLE SYSTEM — deterministic contraction engine of Pulse‑Earn.
//   • Oversees worker lifecycle (muscle fibers).
//   • Fetches jobs from MarketplaceConnector (motor signals).
//   • Executes jobs via PulseSend (primary) or WorkerExecution (fallback).
//   • Submits results via ResultSubmission (release).
//   • Maintains healing + pressure metadata (muscle memory).
//
// CONTRACT:
//   • PURE SUPERVISOR — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic worker loops only.
//   • v7.5+ adds metadata-only awareness of tendon/field context.
//   • v9.2 adds PulseSend compute integration with safe fallback.
// ============================================================================

import { getNextJob } from "./PulseEarnNervousSystem.js";
import { executeJob } from "./PulseEarnMetabolism.js";
import { submitJobResult } from "./PulseEarnLymphNodes.js";

// Primary compute path (new)
// NOTE: adjust import path/name to your actual PulseSend module.
import * as PulseSend from "../pulse-send/PulseSend.js";

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

  // v7.5+: event sequencing for deterministic logs
  eventSeq: 0,

  // -------------------------------------------------------------------------
  // Internal: unified event logger
  // -------------------------------------------------------------------------
  logEvent(config, stage, details = {}) {
    this.eventSeq++;

    const base = {
      seq: this.eventSeq,
      stage,
      engineState: this.engineState,
      cycleCount: this.cycleCount,
      lastJobId: this.lastJob?.id || null,
      lastError: this.lastError || null,
      lastReason: this.lastReason || null,
      lastTendonContext: this.lastTendonContext,
      lastVolatility: this.lastVolatility,
    };

    config.logFn(stage, {
      ...base,
      ...details,
    });
  },

  // -------------------------------------------------------------------------
  // Internal: snapshot logger — earn:snapshot
  // -------------------------------------------------------------------------
  logSnapshot(config, reason = "periodic") {
    const workers = Array.from(this.workerStates.entries()).map(
      ([workerId, state]) => ({
        workerId,
        ...state,
      })
    );

    this.logEvent(config, "earn:snapshot", {
      reason,
      workers,
    });
  },

  // -------------------------------------------------------------------------
  // Internal: compute adapter — PulseSend first, muscle fallback
  // -------------------------------------------------------------------------
  async computeJob(job, config, { tendonContext, volatility }) {
    // Try PulseSend if available
    if (PulseSend && typeof PulseSend.computeWork === "function") {
      this.logEvent(config, "earn:compute_pulsesend_attempt", {
        jobId: job.id,
        tendonClass: tendonContext?.class,
        earnerVolatility: volatility,
      });

      try {
        const result = await PulseSend.computeWork(job, { tendonContext, volatility, config });
        this.logEvent(config, "earn:compute_pulsesend_success", {
          jobId: job.id,
          success: result?.success,
        });
        return result;
      } catch (err) {
        this.logEvent(config, "earn:compute_pulsesend_failed", {
          jobId: job.id,
          error: err.message,
        });
        // fall through to legacy path
      }
    }

    // Fallback: legacy WorkerExecution
    this.logEvent(config, "earn:compute_legacy_fallback", {
      jobId: job.id,
      tendonClass: tendonContext?.class,
      earnerVolatility: volatility,
    });

    return executeJob(job);
  },

  // -------------------------------------------------------------------------
  // start(config) — Begin contraction cycles
  // -------------------------------------------------------------------------
  async start(config) {
    if (this.running) {
      this.logEvent(config, "earn:already_running");
      return;
    }

    this.running = true;
    this.engineState = "running";
    this.lastReason = null;

    this.logEvent(config, "earn:engine_start", {
      maxWorkers: config.maxWorkers,
    });

    // Initial snapshot at start
    this.logSnapshot(config, "engine_start");

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
    this.logEvent(config, "earn:worker_start", { workerId });

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
          this.logEvent(config, "earn:no_job_available", {
            workerId,
            cycle: this.cycleCount,
          });
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

        this.logEvent(config, "earn:job_selected", {
          workerId,
          jobId: job.id,
          cycle: this.cycleCount,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // ------------------------------------------------------
        // 2. EXECUTE — Contraction (PulseSend → legacy fallback)
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "executing";

        const result = await this.computeJob(job, config, {
          tendonContext,
          volatility,
        });

        this.lastResult = result;

        this.logEvent(config, "earn:job_executed", {
          workerId,
          jobId: job.id,
          success: result?.success,
          durationMs: result?.durationMs,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // ------------------------------------------------------
        // 3. SUBMIT — Release
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "submitting";

        const submission = await submitJobResult(job, result);

        this.logEvent(config, "earn:job_submitted", {
          workerId,
          jobId: job.id,
          submission,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility,
        });

        // Optional: snapshot after each successful cycle
        if (config.snapshotEveryCycle) {
          this.logSnapshot(config, "post_cycle");
        }

        // ------------------------------------------------------
        // 4. IDLE — Relaxation
        // ------------------------------------------------------
        this.workerStates.get(workerId).state = "idle";

      } catch (err) {
        // Reflexive inhibition
        this.lastError = err.message;
        this.workerStates.get(workerId).lastError = err.message;
        this.workerStates.get(workerId).state = "error";

        this.logEvent(config, "earn:worker_error", {
          workerId,
          error: err.message,
        });

        this.logSnapshot(config, "worker_error");

        if (config.stopOnError) {
          await this.hardStop(config, err.message);
          return;
        }
      }
    }

    this.workerStates.get(workerId).state = "stopped";
    this.logEvent(config, "earn:worker_exit", { workerId });
  },

  // -------------------------------------------------------------------------
  // hardStop(config, reason) — Emergency Reflex Shutdown
  // -------------------------------------------------------------------------
  async hardStop(config, reason) {
    if (!this.running) return;

    this.running = false;
    this.engineState = "error";
    this.lastReason = reason;

    this.logEvent(config, "earn:engine_hard_stop", {
      reason,
      workers: Array.from(this.workers.keys()),
    });

    this.logSnapshot(config, "engine_hard_stop");

    try {
      await config.sendFailureEmailFn({
        reason,
        lastEvent: this.lastReason,
        workers: Array.from(this.workers.keys()),
        lastTendonContext: this.lastTendonContext,
        lastVolatility: this.lastVolatility,
      });
    } catch (err) {
      this.logEvent(config, "earn:email_failed", { err: err.message });
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

    this.logEvent(config, "earn:engine_soft_stop", {
      workers: Array.from(this.workers.keys()),
    });

    this.logSnapshot(config, "engine_soft_stop");
  },
};

export default EarnEngine;
