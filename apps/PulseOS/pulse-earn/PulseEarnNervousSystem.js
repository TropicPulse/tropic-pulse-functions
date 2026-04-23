// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnNervousSystem.js
// LAYER: THE NERVOUS SYSTEM + EXCHANGE OFFICE (v10.4)
// (Deterministic Job Intake + Result Forwarding + Reputation Updating)
// ============================================================================
//
// ROLE (v10.4):
//   THE NERVOUS SYSTEM — deterministic sensory + motor signal router.
//   • Fetches next job from deterministic marketplaces.
//   • Converts marketplace jobs into PulseJobSchema-like structures.
//   • Submits completed results back to deterministic receptors.
//   • Updates marketplace reputation deterministically.
//   • Maintains healing metadata for Earn healers.
//
// PURPOSE (v10.4):
//   • Provide deterministic, drift‑proof interface between Earn and markets.
//   • Normalize jobs + forward results safely.
//   • Maintain healing metadata for the Immune System.
//   • Make economic + biological routing explicit.
//
// CONTRACT (v10.4):
//   • PURE INTERFACE — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata + deterministic reputation updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO async, NO timestamps, NO network.
//   • Deterministic job intake + result forwarding only.
// ============================================================================

import {updateMarketplaceReputation, computeReputationSignals} from "./PulseEarnEndocrineSystem.js";

import { getNextJob } from "./PulseEarnCirculatorySystem.js";
import { getPulseEarnDeviceProfile } from "./PulseEarnSkeletalSystem.js";
import { marketplaces } from "./RegisteredMarketplaces.js";
import { sendResultToMarketplace } from "./PulseEarnLymphNodes.js";


// ---------------------------------------------------------------------------
// Healing Metadata — Neural Activity Log
// ---------------------------------------------------------------------------
const nervousHealing = {
  lastFetchError: null,
  lastSubmitError: null,
  lastJobId: null,
  lastMarketplaceId: null,
  cycleCount: 0,

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  }
};


// ---------------------------------------------------------------------------
// fetchJobFromMarketplace — Sensory Intake (deterministic)
// ---------------------------------------------------------------------------
export function fetchJobFromMarketplace() {
  nervousHealing.cycleCount++;

  try {
    const device = getPulseEarnDeviceProfile();

    const capacity = {
      cpuAvailable: device.cpuCores,
      memoryAvailable: device.memoryMB
    };

    const job = getNextJob(marketplaces, capacity);

    if (job) {
      nervousHealing.lastJobId = job.id;
      nervousHealing.lastMarketplaceId = job.marketplaceId;
    }

    return job || null;

  } catch (err) {
    nervousHealing.lastFetchError = err.message;
    return null;
  }
}


// ---------------------------------------------------------------------------
// getNextMarketplaceJob — Neural Encoding Layer (deterministic)
// ---------------------------------------------------------------------------
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

    // v10.4: NO timestamps → deterministic cycle index
    cycleIndex: nervousHealing.cycleCount
  };
}


// ---------------------------------------------------------------------------
// submitMarketplaceResult — Motor Output + Synaptic Update (deterministic)
// ---------------------------------------------------------------------------
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
    return submission;

  } catch (err) {
    nervousHealing.lastSubmitError = err.message;
    return null;
  }
}


// ---------------------------------------------------------------------------
// Export Healing Metadata — Nervous System Health Report
// ---------------------------------------------------------------------------
export function getPulseEarnNervousSystemHealingState() {
  return { ...nervousHealing };
}
