// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/MarketplaceConnector.js
// LAYER: THE EXCHANGE OFFICE
// (Job Intake + Result Forwarding + Reputation Updating)
// ============================================================================
//
// ROLE:
//   THE EXCHANGE OFFICE — Pulse‑Earn’s public-facing counter.
//   • Fetches next job from all marketplaces (via MarketplaceOrchestrator)
//   • Converts marketplace jobs into PulseJobSchema-like structures
//   • Submits completed results back to the correct marketplace
//   • Updates marketplace reputation based on job outcomes
//
// WHY “EXCHANGE OFFICE”?:
//   • It is the bridge between internal performance and external profit
//   • It handles job intake (incoming currency)
//   • It handles result submission (outgoing currency)
//   • It updates marketplace trust (exchange rate)
//   • It is the public counter for PulseProxy
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof interface between Earn and Proxy
//   • Normalize jobs and forward results safely
//   • Maintain healing metadata for the Physician (EarnHealer)
//
// CONTRACT:
//   • PURE INTERFACE — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata + reputation updates
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic job intake + result forwarding only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 MarketplaceConnector
// ============================================================================

import {
  updateMarketplaceReputation,
  computeReputationSignals
} from "./MarketplaceReputation.js";

import { getNextJob } from "./MarketplaceOrchestrator.js";
import { PulseJobSchema } from "./PulseJobSchema.js";
import { getDeviceProfile } from "./PulseDeviceProfile.js";
import { marketplaces } from "./RegisteredMarketplaces.js";
import { sendResultToMarketplace } from "./ResultSubmission.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Exchange Office Activity Log
// ---------------------------------------------------------------------------
const healingState = {
  lastFetchError: null,
  lastSubmitError: null,
  lastJobId: null,
  lastMarketplaceId: null,
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// fetchJobFromMarketplace — Intake Window
// ---------------------------------------------------------------------------
export async function fetchJobFromMarketplace() {
  healingState.cycleCount++;

  try {
    const device = getDeviceProfile();

    const capacity = {
      cpuAvailable: device.cpuCores ?? 4,
      memoryAvailable: device.memoryMB ?? 8192
    };

    const job = await getNextJob(marketplaces, capacity);

    if (job) {
      healingState.lastJobId = job.id;
      healingState.lastMarketplaceId = job.marketplaceId;
    }

    return job || null;

  } catch (err) {
    healingState.lastFetchError = err.message;
    console.error("fetchJobFromMarketplace() error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// getNextMarketplaceJob — Job Conversion Counter
// ---------------------------------------------------------------------------
export async function getNextMarketplaceJob(deviceId) {
  const job = await fetchJobFromMarketplace();
  if (!job) return null;

  if (!job.id || !job.marketplaceId) {
    healingState.lastFetchError = "invalid_job_structure";
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
    timestamp: Date.now()
  };
}

// ---------------------------------------------------------------------------
// submitMarketplaceResult — Result Forwarding Window
// ---------------------------------------------------------------------------
export async function submitMarketplaceResult(job, result) {
  try {
    if (!job || !job.marketplaceId) {
      healingState.lastSubmitError = "invalid_job_for_submission";
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

    const submission = await sendResultToMarketplace(job, result);
    return submission;

  } catch (err) {
    healingState.lastSubmitError = err.message;
    console.error("submitMarketplaceResult() error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Exchange Office Report
// ---------------------------------------------------------------------------
export function getMarketplaceConnectorHealingState() {
  return { ...healingState };
}
