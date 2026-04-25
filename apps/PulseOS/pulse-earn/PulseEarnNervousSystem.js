// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnNervousSystem-v11-Evo.js
// LAYER: THE NERVOUS SYSTEM + EXCHANGE OFFICE (v11-Evo + Dual-Band + Binary + Wave)
// (Deterministic Job Intake + Result Forwarding + Reputation Updating)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE NERVOUS SYSTEM — deterministic sensory + motor signal router.
//   • Fetches next job from deterministic marketplaces.
//   • Converts marketplace jobs into PulseJobSchema-like structures.
//   • Submits completed results back to deterministic receptors.
//   • Updates marketplace reputation deterministically.
//   • Emits v11-Evo signatures + diagnostics.
//   • NOW dual-band, binary-aware, wave-aware (metadata only).
//
// PURPOSE (v11-Evo):
//   • Provide deterministic, drift‑proof interface between Earn and markets.
//   • Normalize jobs + forward results safely.
//   • Maintain healing metadata for the Immune System.
//   • Make economic + biological routing explicit.
//
// CONTRACT (v11-Evo):
//   • PURE INTERFACE — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata + deterministic reputation updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO async, NO timestamps, NO network.
//   • Deterministic job intake + result forwarding only.
//   • Dual-band + binary + wave metadata are structural-only.
// ============================================================================

import { updateMarketplaceReputation, computeReputationSignals } from "./PulseEarnEndocrineSystem-v11-Evo.js";
import { getNextJob } from "./PulseEarnCirculatorySystem-v11-Evo.js";
import { getPulseEarnDeviceProfile } from "./PulseEarnSkeletalSystem-v11-Evo.js";
import { marketplaces } from "./RegisteredMarketplaces-v11-Evo.js";
import { sendResultToMarketplace } from "./PulseEarnLymphNodes-v11-Evo.js";


// ============================================================================
// Healing Metadata — Neural Activity Log (v11-Evo)
// ============================================================================
const nervousHealing = {
  lastFetchError: null,
  lastSubmitError: null,
  lastJobId: null,
  lastMarketplaceId: null,

  lastNervousSignature: null,
  lastJobIntakeSignature: null,
  lastResultForwardSignature: null,

  lastDevicePattern: null,
  lastJobPattern: null,

  cycleCount: 0,

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  // v11+ Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
};


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
// Pattern Builders — v11-Evo
// ============================================================================
function buildDevicePattern(device) {
  return (
    `DEVICE::cpu:${device.cpuCores}` +
    `::mem:${device.memoryMB}` +
    `::gpu:${device.gpuScore}` +
    `::bw:${device.bandwidthMbps}` +
    `::stab:${device.stabilityScore}`
  );
}

function buildJobPattern(job) {
  if (!job) return "JOB::NONE";
  return (
    `JOB::${job.id}` +
    `::market:${job.marketplaceId}` +
    `::cpu:${job.cpuRequired ?? 0}` +
    `::mem:${job.memoryRequired ?? 0}` +
    `::sec:${job.estimatedSeconds ?? 0}`
  );
}


// ============================================================================
// Dual-Band + Binary + Wave Builder — v11+ A-B-A
// ============================================================================
function buildNervousBandBinaryWave(job, result, cycleIndex) {
  const band = normalizeBand(
    result?.band ||
    job?.band ||
    job?.meta?.band ||
    "symbolic"
  );
  nervousHealing.lastBand = band;
  nervousHealing.lastBandSignature = computeHash(`BAND::NERVOUS::${band}`);

  const jobIdLength = (job?.id || "").length;
  const marketplaceLength = (job?.marketplaceId || "").length;
  const surface = jobIdLength + marketplaceLength + cycleIndex;

  const binaryField = {
    binaryNervousSignature: computeHash(`BNERV::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_NERV::${surface}`),
    binarySurface: {
      jobIdLength,
      marketplaceLength,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: marketplaceLength,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  nervousHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: marketplaceLength,
    wavelength: cycleIndex,
    phase: (marketplaceLength + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  nervousHealing.lastWaveField = waveField;

  return { band, binaryField, waveField };
}


// ============================================================================
// fetchJobFromMarketplace — Sensory Intake (v11-Evo)
// ============================================================================
export function fetchJobFromMarketplace() {
  nervousHealing.cycleCount++;

  try {
    const device = getPulseEarnDeviceProfile();
    const devicePattern = buildDevicePattern(device);
    nervousHealing.lastDevicePattern = devicePattern;

    const capacity = {
      cpuAvailable: device.cpuCores,
      memoryAvailable: device.memoryMB
    };

    const job = getNextJob(marketplaces, capacity);

    if (job) {
      nervousHealing.lastJobId = job.id;
      nervousHealing.lastMarketplaceId = job.marketplaceId;
      nervousHealing.lastJobPattern = buildJobPattern(job);

      nervousHealing.lastJobIntakeSignature = computeHash(
        `${job.id}::${job.marketplaceId}::${nervousHealing.cycleCount}`
      );

      // A-B-A: intake band/PULSE-TOOLS/wave from job surface
      buildNervousBandBinaryWave(job, null, nervousHealing.cycleCount);
    }

    return job || null;

  } catch (err) {
    nervousHealing.lastFetchError = err.message;
    return null;
  }
}


// ============================================================================
// getNextMarketplaceJob — Neural Encoding Layer (v11-Evo)
// ============================================================================
export function getNextMarketplaceJob(deviceId) {
  const job = fetchJobFromMarketplace();
  if (!job) return null;

  if (!job.id || !job.marketplaceId) {
    nervousHealing.lastFetchError = "invalid_job_structure";
    return null;
  }

  return {
    id: job.id,

    payload: {
      type: "marketplace-job",
      data: {
        marketplaceId: job.marketplaceId,
        cpuRequired: job.cpuRequired ?? 0,
        memoryRequired: job.memoryRequired ?? 0,
        estimatedSeconds: job.estimatedSeconds ?? 0
      },
      gpu: {
        workgroupSize: 1,
        iterations: 1,
        shader: ""
      }
    },

    marketplace: job.marketplaceId,
    assignedTo: deviceId,

    cycleIndex: nervousHealing.cycleCount
  };
}


// ============================================================================
// submitMarketplaceResult — Motor Output + Synaptic Update (v11-Evo)
// ============================================================================
export function submitMarketplaceResult(job, result) {
  try {
    if (!job || !job.marketplaceId) {
      nervousHealing.lastSubmitError = "invalid_job_for_submission";
      return null;
    }

    const signals = computeReputationSignals({
      latencyMs: result.latencyMs ?? 0,
      apiErrors: result.apiErrors ?? 0,
      jobsReturned: result.jobsReturned ?? 0,
      profitableJobs: result.profitableJobs ?? 0,
      jobSuccessRate: result.jobSuccessRate ?? 0,
      avgProfitPerJob: result.avgProfitPerJob ?? 0
    });

    updateMarketplaceReputation(job.marketplaceId, signals);

    const submission = sendResultToMarketplace(job, result);

    nervousHealing.lastResultForwardSignature = computeHash(
      `${job.id}::${job.marketplaceId}::${result.jobSuccessRate ?? 0}`
    );

    // A-B-A: forward band/PULSE-TOOLS/wave using job + result
    buildNervousBandBinaryWave(job, result, nervousHealing.cycleCount);

    return submission;

  } catch (err) {
    nervousHealing.lastSubmitError = err.message;
    return null;
  }
}


// ============================================================================
// Nervous System Signature — v11-Evo
// ============================================================================
function buildNervousSignature() {
  return computeHash(
    `${nervousHealing.lastJobId}::${nervousHealing.lastMarketplaceId}::${nervousHealing.cycleCount}`
  );
}


// ============================================================================
// Export Healing Metadata — Nervous System Health Report (v11-Evo)
// ============================================================================
export function getPulseEarnNervousSystemHealingState() {
  nervousHealing.lastNervousSignature = buildNervousSignature();
  return { ...nervousHealing };
}
