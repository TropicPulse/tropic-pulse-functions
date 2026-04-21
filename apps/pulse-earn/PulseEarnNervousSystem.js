// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnNervousSystem.js
// LAYER: THE NERVOUS SYSTEM + EXCHANGE OFFICE
// (Job Intake + Result Forwarding + Reputation Updating + Signal Routing)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE NERVOUS SYSTEM — Pulse‑Earn’s sensory + motor signal router.
//   • Fetches next job from all marketplaces (via MarketplaceOrchestrator).
//   • Converts marketplace jobs into PulseJobSchema-like structures.
//   • Submits completed results back to the correct marketplace.
//   • Updates marketplace reputation based on job outcomes.
//   • Logs neural/economic activity for healing (PulseEarnImmuneSystem).
//
// WHY “NERVOUS SYSTEM + EXCHANGE OFFICE”?:
//   • Biological: Routes sensory input (jobs) AND motor output (results).
//   • Biological: Adjusts reputation (synaptic weighting).
//   • Economic: Handles job intake (incoming currency) AND result submission.
//   • Economic: Updates marketplace trust (exchange rate).
//
// PURPOSE (v9.2):
//   • Provide a deterministic, drift‑proof interface between Earn AND external markets.
//   • Normalize jobs AND forward results safely.
//   • Maintain healing metadata for the Immune System.
//   • Make economic AND biological routing explicit and human‑readable.
//
// CONTRACT (unchanged):
//   • PURE INTERFACE — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata + reputation updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic job intake + result forwarding only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v9.2 MarketplaceConnector.
// ============================================================================

import {
  updateMarketplaceReputation,
  computeReputationSignals
} from "./PulseEarnEndocrineSystem.js";

import { getNextJob } from "./PulseEarnCirculatorySystem.js";
import { PulseJobSchema } from "./PulseEarnGenome.js";
import { getDeviceProfile } from "./PulseEarnSkeletalSystem.js";
import { marketplaces } from "./RegisteredMarketplaces.js";
import { sendResultToMarketplace } from "./PulseEarnLymphNodes.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Neural Activity Log
// ---------------------------------------------------------------------------
const nervousHealing = {
  lastFetchError: null,       // sensory / intake failure
  lastSubmitError: null,      // motor / output failure
  lastJobId: null,            // last neural signal ID
  lastMarketplaceId: null,    // last external sensory source
  cycleCount: 0,              // total neural firings (intake cycles)
};

// ---------------------------------------------------------------------------
// fetchJobFromMarketplace — Sensory Intake
// ---------------------------------------------------------------------------
export async function fetchJobFromMarketplace() {
  nervousHealing.cycleCount++;

  try {
    const device = getDeviceProfile();

    const capacity = {
      cpuAvailable: device.cpuCores ?? 4,
      memoryAvailable: device.memoryMB ?? 8192
    };

    const job = await getNextJob(marketplaces, capacity);

    if (job) {
      nervousHealing.lastJobId = job.id;
      nervousHealing.lastMarketplaceId = job.marketplaceId;
    }

    return job || null;

  } catch (err) {
    nervousHealing.lastFetchError = err.message;
    error("fetchJobFromMarketplace() error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// getNextMarketplaceJob — Neural Encoding Layer
// ---------------------------------------------------------------------------
export async function getNextMarketplaceJob(deviceId) {
  const job = await fetchJobFromMarketplace();
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
    timestamp: Date.now()
  };
}

// ---------------------------------------------------------------------------
// submitMarketplaceResult — Motor Output + Synaptic Update
// ---------------------------------------------------------------------------
export async function submitMarketplaceResult(job, result) {
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

    const submission = await sendResultToMarketplace(job, result);
    return submission;

  } catch (err) {
    nervousHealing.lastSubmitError = err.message;
    error("submitMarketplaceResult() error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Nervous System Health Report
// ---------------------------------------------------------------------------
export function getPulseEarnNervousSystemHealingState() {
  return { ...nervousHealing };
}
