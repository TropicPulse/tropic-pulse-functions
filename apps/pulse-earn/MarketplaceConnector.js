// FILE: tropic-pulse-functions/apps/pulse-earn/MarketplaceConnector.js
//
// MarketplaceConnector v5 — Deterministic, Drift‑Proof, Self‑Healing Interface
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   MarketplaceConnector — PUBLIC API between Pulse Earn and Pulse Proxy.
//
// RESPONSIBILITIES:
//   • Fetch next job from ALL marketplaces (via MarketplaceOrchestrator)
//   • Normalize marketplace jobs into PulseJobSchema-like structure
//   • Submit completed results to the correct marketplace
//   • Update marketplace reputation based on job outcomes
//   • Maintain deterministic healing metadata
//
// THIS FILE IS:
//   • A clean interface for PulseProxy
//   • A wrapper around MarketplaceOrchestrator
//   • A job normalizer
//   • A reputation updater
//   • A result forwarder
//
// THIS FILE IS NOT:
//   • A marketplace adapter
//   • A scheduler
//   • A compute engine
//   • A job selector
//   • A scoring engine
//   • A ledger/wallet/token handler
//
// SAFETY RULES:
//   • Never throw unhandled errors
//   • Always validate job objects before wrapping
//   • Never mutate job objects
//   • Always remain deterministic
//
// IMPORT RULES:
//   Allowed:
//     • MarketplaceOrchestrator.js
//     • MarketplaceReputation.js
//     • PulseJobSchema.js
//     • PulseDeviceProfile.js
//     • RegisteredMarketplaces.js
//     • ResultSubmission.js
//
//   Forbidden:
//     • Direct marketplace API calls
//     • Node.js APIs
//     • Backend modules
//     • DOM manipulation
//
// ------------------------------------------------------
// MarketplaceConnector — Public API for PulseProxy (v5 Healing Edition)
// ------------------------------------------------------

import {
  updateMarketplaceReputation,
  computeReputationSignals
} from "./MarketplaceReputation.js";

import { getNextJob } from "./MarketplaceOrchestrator.js";
import { PulseJobSchema } from "./PulseJobSchema.js";
import { getDeviceProfile } from "./PulseDeviceProfile.js";
import { marketplaces } from "./RegisteredMarketplaces.js";
import { sendResultToMarketplace } from "./ResultSubmission.js";

// Healing metadata
const healingState = {
  lastFetchError: null,
  lastSubmitError: null,
  lastJobId: null,
  lastMarketplaceId: null,
  cycleCount: 0,
};

// ------------------------------------------------------
// fetchJobFromMarketplace()
// ------------------------------------------------------
export async function fetchJobFromMarketplace() {
  healingState.cycleCount++;

  try {
    const device = getDeviceProfile();

    // Deterministic capacity struct
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

// ------------------------------------------------------
// getNextMarketplaceJob(deviceId)
// ------------------------------------------------------
export async function getNextMarketplaceJob(deviceId) {
  const job = await fetchJobFromMarketplace();
  if (!job) return null;

  // Validate job object
  if (!job.id || !job.marketplaceId) {
    healingState.lastFetchError = "invalid_job_structure";
    return null;
  }

  // Normalize into PulseJobSchema-like structure
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
        shader: "" // placeholder until GPU jobs are supported
      }
    },

    marketplace: job.marketplaceId,
    assignedTo: deviceId,
    timestamp: Date.now()
  };
}

// ------------------------------------------------------
// submitMarketplaceResult(job, result)
// ------------------------------------------------------
export async function submitMarketplaceResult(job, result) {
  try {
    // Validate job + result
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

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------
export function getMarketplaceConnectorHealingState() {
  return { ...healingState };
}
