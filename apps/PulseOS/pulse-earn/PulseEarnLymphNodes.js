// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnLymphNodes-v11-Evo.js
// LAYER: THE LYMPHATIC HANDSHAKE NODES (v11-Evo + Dual-Band + Binary + Wave)
// (Finalizer of Jobs + Immune-Safe Dispatch + Certified Marketplace Exchange)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE LYMPHATIC HANDSHAKE NODES — Pulse‑Earn’s immune‑safe finalizers.
//   • Validate job + marketplace identity (immune recognition).
//   • Locate the correct marketplace receptor (antigen matching).
//   • Ensure submitResult() exists (immune compatibility).
//   • Perform deterministic Earn → Marketplace handshake.
//   • Record certified submission outcome (immune memory + signatures).
//
// CONTRACT (v11-Evo):
//   • PURE RESULT DISPATCHER — no AI layers, no translation, no memory model.
//   • NO async, NO timestamps, NO nondeterministic behavior.
//   • NEVER mutate job objects.
//   • Deterministic identity verification + dispatch only.
//   • Dual-band + binary + wave metadata are structural-only.
// ============================================================================

import { PulseEarnReceptor } from "./PulseEarnReceptor.js";
import { PulseEarnCustomReceptor } from "./PulseEarnCustomReceptorMkt.js";


// ---------------------------------------------------------------------------
// Healing Metadata — Lymphatic Dispatch Log (v11-Evo)
// ---------------------------------------------------------------------------
const lymphHealing = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastAdapterUsed: null,
  lastError: null,
  lastResponse: null,
  cycleCount: 0,
  lastCycleIndex: null,

  lastHandshakeSignature: null,
  lastJobSignature: null,
  lastMarketplaceSignature: null,

  // v11+ Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
};

// Deterministic cycle counter
let lymphCycle = 0;


// ---------------------------------------------------------------------------
// Deterministic Hash Helper — v11-Evo
// ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// Signature Builders — v11-Evo
// ---------------------------------------------------------------------------
function buildJobSignature(job) {
  if (!job) return "JOB::NONE";
  return computeHash(`JOB::${job.id}::${job.marketplaceId || "NO_MKT"}`);
}

function buildMarketplaceSignature(marketplaceId) {
  return computeHash(`MKT::${marketplaceId || "NO_MKT"}`);
}

function buildHandshakeSignature(job, cycleIndex) {
  return computeHash(
    `HS::${job?.id || "NO_JOB"}::${job?.marketplaceId || "NO_MKT"}::${cycleIndex}`
  );
}


// ---------------------------------------------------------------------------
// Marketplace Receptor Registry — Antigen Directory
// ---------------------------------------------------------------------------
const receptorRegistry = {
  A: PulseEarnReceptor,
  CUSTOM: PulseEarnCustomReceptor
};


// ---------------------------------------------------------------------------
// INTERNAL: Build dual-band + binary + wave metadata for a job/cycle
// ---------------------------------------------------------------------------
function buildLymphBandBinaryWave(job, cycleIndex) {
  const band = normalizeBand(job?.band || job?.meta?.band || "symbolic");
  lymphHealing.lastBand = band;
  lymphHealing.lastBandSignature = computeHash(`BAND::${band}`);

  const jobIdLength = (job?.id || "").length;
  const marketplaceLength = (job?.marketplaceId || "").length;
  const surface = jobIdLength + marketplaceLength + cycleIndex;

  const binaryField = {
    binaryLymphSignature: computeHash(`BLYMPH::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_LYMPH::${surface}`),
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
  lymphHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: jobIdLength,
    wavelength: cycleIndex,
    phase: (jobIdLength + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  lymphHealing.lastWaveField = waveField;

  return { band, binaryField, waveField };
}


// ---------------------------------------------------------------------------
// submitPulseEarnResult — Deterministic Lymphatic Handshake (v11-Evo + A-B-A)
// ---------------------------------------------------------------------------
export function submitPulseEarnResult(job, result) {
  lymphCycle++;
  lymphHealing.cycleCount++;
  lymphHealing.lastCycleIndex = lymphCycle;

  const { band, binaryField, waveField } = buildLymphBandBinaryWave(
    job,
    lymphCycle
  );

  try {
    // 1. Identity Verification — Immune Recognition
    if (!job || !job.marketplaceId) {
      lymphHealing.lastError = "missing_marketplaceId";
      lymphHealing.lastJobId = job?.id ?? null;
      lymphHealing.lastMarketplaceId = job?.marketplaceId ?? null;

      const failure = {
        success: false,
        error: "Job missing marketplaceId",
        jobId: job?.id ?? null,
        marketplaceId: job?.marketplaceId ?? null,
        band,
        binaryField,
        waveField,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastJobSignature = buildJobSignature(job);
      lymphHealing.lastMarketplaceSignature = buildMarketplaceSignature(
        job?.marketplaceId
      );
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    lymphHealing.lastJobId = job.id;
    lymphHealing.lastMarketplaceId = job.marketplaceId;

    lymphHealing.lastJobSignature = buildJobSignature(job);
    lymphHealing.lastMarketplaceSignature = buildMarketplaceSignature(
      job.marketplaceId
    );

    // 2. Locate Marketplace Receptor — Antigen Matching
    const adapter = receptorRegistry[job.marketplaceId];

    if (!adapter) {
      lymphHealing.lastError = "unknown_marketplace";

      const failure = {
        success: false,
        error: `Unknown marketplace: ${job.marketplaceId}`,
        jobId: job.id,
        marketplaceId: job.marketplaceId,
        band,
        binaryField,
        waveField,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    if (typeof adapter.submitResult !== "function") {
      lymphHealing.lastError = "adapter_missing_submitResult";

      const failure = {
        success: false,
        error: `Marketplace ${job.marketplaceId} does not support result submission`,
        jobId: job.id,
        marketplaceId: job.marketplaceId,
        band,
        binaryField,
        waveField,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    lymphHealing.lastAdapterUsed = job.marketplaceId;

    // 3. Perform the Handshake — Deterministic Dispatch
    const response = adapter.submitResult(job, result);

    lymphHealing.lastResponse = response;
    lymphHealing.lastError = null;
    lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

    return {
      ...response,
      band,
      binaryField,
      waveField,
      cycleIndex: lymphCycle
    };

  } catch (err) {
    lymphHealing.lastError = err.message;

    const failure = {
      success: false,
      error: err.message,
      jobId: job?.id ?? null,
      marketplaceId: job?.marketplaceId ?? null,
      band,
      binaryField,
      waveField,
      cycleIndex: lymphCycle
    };

    lymphHealing.lastResponse = failure;
    lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

    return failure;
  }
}


// ---------------------------------------------------------------------------
// sendResultToMarketplace — v11-Evo alias for Nervous System
// ---------------------------------------------------------------------------
export function sendResultToMarketplace(job, result) {
  return submitPulseEarnResult(job, result);
}


// ---------------------------------------------------------------------------
// Export Healing Metadata — Lymphatic Dispatch Report (v11-Evo)
// ---------------------------------------------------------------------------
export function getPulseEarnLymphHealingState() {
  return { ...lymphHealing };
}
