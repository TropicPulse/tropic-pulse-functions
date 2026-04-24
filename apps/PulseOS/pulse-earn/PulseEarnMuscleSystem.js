// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/EarnEngine-v11-Evo.js
// LAYER: THE MUSCLE SYSTEM (v11-Evo + Dual-Band + Binary + Wave)
// (Deterministic Worker Supervisor + Profit Orchestrator)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE MUSCLE SYSTEM — deterministic contraction engine of Pulse‑Earn.
//   • Executes a single contraction cycle per invocation.
//   • Fetches deterministic jobs from Nervous System.
//   • Executes deterministic compute via injected PulseSendSystem.
//   • Submits deterministic results via Lymph Nodes.
//   • Maintains healing + pressure metadata (muscle memory + signatures).
//   • Emits dual-band, binary, and wave metadata (structural only).
//
// PURPOSE (v11-Evo):
//   • Replace async worker loops with deterministic single‑cycle contraction.
//   • Remove nondeterminism, concurrency, timestamps, sleeps.
//   • Guarantee drift‑proof Earn → Pulse → Send execution.
//   • Maintain muscle memory + signatures for healers.
//
// CONTRACT (v11-Evo):
//   • PURE SUPERVISOR — no AI layers, no translation, no memory model.
//   • NO async, NO await, NO timers, NO concurrency.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • Deterministic contraction only.
//   • PulseSendSystem is injected, not imported.
//   • Dual-band + binary + wave metadata are structural-only.
// ============================================================================

import { fetchJobFromMarketplace } from "./PulseEarnNervousSystem-v11-Evo.js";
import { submitMarketplaceResult } from "./PulseEarnLymphNodes-v11-Evo.js";


// ============================================================================
// Deterministic Hash Helper — v11-Evo
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ============================================================================
// Healing Metadata — Muscle Memory Log (v11-Evo)
// ============================================================================
const engineHealing = {
  running: false,
  engineState: "idle",
  cycleCount: 0,
  lastJob: null,
  lastResult: null,
  lastError: null,
  lastReason: null,

  lastTendonContext: null,
  lastVolatility: null,

  eventSeq: 0,

  lastEngineSignature: null,
  lastJobSignature: null,
  lastResultSignature: null,

  // v11+ Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
};

// Deterministic engine cycle counter
let engineCycle = 0;


// ============================================================================
// INTERNAL: Signature Builders
// ============================================================================
function buildEngineSignature() {
  return computeHash(
    `ENGINE::${engineHealing.engineState}::${engineHealing.cycleCount}::${engineHealing.lastJob?.id || "NO_JOB"}`
  );
}

function buildJobSignature(job) {
  if (!job) return "JOB::NONE";
  return computeHash(
    `JOB::${job.id}::${job.marketplaceId || "NO_MARKET"}`
  );
}

function buildResultSignature(job, result) {
  const success = result && typeof result.success === "boolean"
    ? result.success
    : null;

  return computeHash(
    `RESULT::${job?.id || "NO_JOB"}::${success === null ? "NA" : success}`
  );
}

function buildEngineBandBinaryWave(job, result, cycleIndex) {
  const band = normalizeBand(
    result?.band ||
    job?.band ||
    job?.meta?.band ||
    "symbolic"
  );
  engineHealing.lastBand = band;
  engineHealing.lastBandSignature = computeHash(`BAND::${band}`);

  const jobIdLength = (job?.id || "").length;
  const marketplaceLength = (job?.marketplaceId || "").length;
  const surface = jobIdLength + marketplaceLength + cycleIndex;

  const binaryField = {
    binaryEngineSignature: computeHash(`BENGINE::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_ENGINE::${surface}`),
    binarySurface: {
      jobIdLength,
      marketplaceLength,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: jobIdLength,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  engineHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: jobIdLength,
    wavelength: cycleIndex,
    phase: (jobIdLength + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  engineHealing.lastWaveField = waveField;

  return { band, binaryField, waveField };
}


// ============================================================================
// FACTORY — createEarnEngine (v11-Evo + Dual-Band + Binary + Wave)
// ============================================================================
export function createEarnEngine({
  pulseSendSystem,      // required: injected PulseSendSystem (must expose compute(job, ctx))
  log = console.log     // optional: deterministic logger
} = {}) {
  if (!pulseSendSystem || typeof pulseSendSystem.compute !== "function") {
    throw new Error(
      "[EarnEngine-v11-Evo] pulseSendSystem with compute(job, ctx) is required."
    );
  }

  const engine = {
    // mirror healing state for external introspection
    running: engineHealing.running,
    engineState: engineHealing.engineState,
    cycleCount: engineHealing.cycleCount,
    lastJob: engineHealing.lastJob,
    lastResult: engineHealing.lastResult,
    lastError: engineHealing.lastError,
    lastReason: engineHealing.lastReason,

    lastTendonContext: engineHealing.lastTendonContext,
    lastVolatility: engineHealing.lastVolatility,

    eventSeq: engineHealing.eventSeq,

    lastEngineSignature: engineHealing.lastEngineSignature,
    lastJobSignature: engineHealing.lastJobSignature,
    lastResultSignature: engineHealing.lastResultSignature,

    // -----------------------------------------------------------------------
    // Internal: unified event logger
    // -----------------------------------------------------------------------
    logEvent(stage, details = {}) {
      engineHealing.eventSeq++;
      this.eventSeq = engineHealing.eventSeq;

      const base = {
        seq: engineHealing.eventSeq,
        stage,
        engineState: engineHealing.engineState,
        cycleCount: engineHealing.cycleCount,
        lastJobId: engineHealing.lastJob?.id || null,
        lastError: engineHealing.lastError || null,
        lastReason: engineHealing.lastReason || null,
        lastTendonContext: engineHealing.lastTendonContext,
        lastVolatility: engineHealing.lastVolatility,
        lastEngineSignature: engineHealing.lastEngineSignature,
        lastJobSignature: engineHealing.lastJobSignature,
        lastResultSignature: engineHealing.lastResultSignature,
        band: engineHealing.lastBand,
        binaryField: engineHealing.lastBinaryField,
        waveField: engineHealing.lastWaveField
      };

      log(stage, { ...base, ...details });
    },

    // -----------------------------------------------------------------------
    // start() — Begin deterministic contraction mode
    // -----------------------------------------------------------------------
    start() {
      if (engineHealing.running) {
        this.logEvent("earn:already_running");
        return;
      }

      engineHealing.running = true;
      engineHealing.engineState = "running";
      engineHealing.lastReason = null;

      engineHealing.lastEngineSignature = buildEngineSignature();

      // mirror
      this.running = engineHealing.running;
      this.engineState = engineHealing.engineState;
      this.lastEngineSignature = engineHealing.lastEngineSignature;

      this.logEvent("earn:engine_start", {
        mode: "deterministic_single_cycle"
      });
    },

    // -----------------------------------------------------------------------
    // stop() — Controlled Relaxation
    // -----------------------------------------------------------------------
    stop() {
      if (!engineHealing.running) return;

      engineHealing.running = false;
      engineHealing.engineState = "stopped";

      engineHealing.lastEngineSignature = buildEngineSignature();

      // mirror
      this.running = engineHealing.running;
      this.engineState = engineHealing.engineState;
      this.lastEngineSignature = engineHealing.lastEngineSignature;

      this.logEvent("earn:engine_stop");
    },

    // -----------------------------------------------------------------------
    // cycle() — ONE deterministic contraction cycle
    // -----------------------------------------------------------------------
    cycle() {
      if (!engineHealing.running) {
        this.logEvent("earn:cycle_ignored_not_running");
        return null;
      }

      try {
        engineCycle++;
        engineHealing.cycleCount++;
        this.cycleCount = engineHealing.cycleCount;

        // ------------------------------------------------------
        // 1. FETCH — Motor signal (deterministic)
        // ------------------------------------------------------
        const job = fetchJobFromMarketplace();

        if (!job) {
          this.logEvent("earn:no_job_available", {
            cycle: engineHealing.cycleCount
          });
          engineHealing.lastEngineSignature = buildEngineSignature();
          this.lastEngineSignature = engineHealing.lastEngineSignature;
          return null;
        }

        engineHealing.lastJob = job;
        engineHealing.lastJobSignature = buildJobSignature(job);
        this.lastJob = job;
        this.lastJobSignature = engineHealing.lastJobSignature;

        const tendonContext = job.impulse?.flags?.earner_context || null;
        const volatility = job.impulse?.flags?.earner_volatility ?? null;

        engineHealing.lastTendonContext = tendonContext;
        engineHealing.lastVolatility = volatility;
        this.lastTendonContext = tendonContext;
        this.lastVolatility = volatility;

        this.logEvent("earn:job_selected", {
          jobId: job.id,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility
        });

        // ------------------------------------------------------
        // 2. EXECUTE — Contraction (PulseSend deterministic)
        // ------------------------------------------------------
        const result = pulseSendSystem.compute(job, {
          tendonContext,
          volatility
        });

        engineHealing.lastResult = result;
        engineHealing.lastResultSignature = buildResultSignature(job, result);
        this.lastResult = result;
        this.lastResultSignature = engineHealing.lastResultSignature;

        const { band, binaryField, waveField } = buildEngineBandBinaryWave(
          job,
          result,
          engineHealing.cycleCount
        );

        this.logEvent("earn:job_executed", {
          jobId: job.id,
          success: result?.success,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility
        });

        // ------------------------------------------------------
        // 3. SUBMIT — Release (deterministic)
        // ------------------------------------------------------
        const submission = submitMarketplaceResult(job, result);

        engineHealing.lastEngineSignature = buildEngineSignature();
        this.lastEngineSignature = engineHealing.lastEngineSignature;

        this.logEvent("earn:job_submitted", {
          jobId: job.id,
          submission,
          tendonClass: tendonContext?.class,
          earnerVolatility: volatility
        });

        return {
          job,
          result,
          submission,
          band,
          binaryField,
          waveField,
          cycleIndex: engineHealing.cycleCount
        };

      } catch (err) {
        engineHealing.lastError = err.message;
        this.lastError = engineHealing.lastError;

        this.logEvent("earn:cycle_error", {
          error: err.message
        });

        engineHealing.lastEngineSignature = buildEngineSignature();
        this.lastEngineSignature = engineHealing.lastEngineSignature;

        return null;
      }
    },

    // -----------------------------------------------------------------------
    // diagnostics() — v11-Evo muscle diagnostics
    // -----------------------------------------------------------------------
    diagnostics() {
      return {
        engineState: engineHealing.engineState,
        cycleCount: engineHealing.cycleCount,
        lastJobId: engineHealing.lastJob?.id || null,
        lastError: engineHealing.lastError || null,
        lastReason: engineHealing.lastReason || null,
        lastTendonContext: engineHealing.lastTendonContext,
        lastVolatility: engineHealing.lastVolatility,
        lastEngineSignature: engineHealing.lastEngineSignature,
        lastJobSignature: engineHealing.lastJobSignature,
        lastResultSignature: engineHealing.lastResultSignature,
        band: engineHealing.lastBand,
        binaryField: engineHealing.lastBinaryField,
        waveField: engineHealing.lastWaveField
      };
    }
  };

  return engine;
}


// ============================================================================
// Export healing metadata — Muscle System Report (v11-Evo)
// ============================================================================
export function getEarnEngineHealingState() {
  return { ...engineHealing };
}

export default createEarnEngine;
