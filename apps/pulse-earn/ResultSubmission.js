// FILE: tropic-pulse-functions/apps/pulse-earn/ResultSubmission.js
//
// ResultSubmission v5 — Deterministic, Drift‑Proof, Self‑Healing Result Dispatcher
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   ResultSubmission — final step of the job lifecycle.
//
// RESPONSIBILITIES:
//   • Validate job + marketplaceId
//   • Look up correct marketplace adapter
//   • Ensure adapter implements submitResult()
//   • Forward results deterministically
//   • Maintain healing metadata
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO network calls here (adapters handle that)
//   • NO filesystem access
//   • NO crypto operations
//   • NEVER mutate job objects
//
// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

const healingState = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastAdapterUsed: null,
  lastError: null,
  lastResponse: null,
  cycleCount: 0,
  lastTimestamp: null,
};

// ------------------------------------------------------
// submitJobResult(job, result)
// ------------------------------------------------------
export async function submitJobResult(job, result) {
  const timestamp = Date.now();
  healingState.cycleCount++;
  healingState.lastTimestamp = timestamp;

  try {
    // -------------------------------
    // 1. Validate job + marketplaceId
    // -------------------------------
    if (!job || !job.marketplaceId) {
      healingState.lastError = "missing_marketplaceId";
      healingState.lastJobId = job?.id ?? null;
      healingState.lastMarketplaceId = job?.marketplaceId ?? null;

      throw new Error("Job missing marketplaceId");
    }

    healingState.lastJobId = job.id;
    healingState.lastMarketplaceId = job.marketplaceId;

    // -------------------------------
    // 2. Look up adapter
    // -------------------------------
    const adapter = marketplaceRegistry[job.marketplaceId];

    if (!adapter) {
      healingState.lastError = "unknown_marketplace";
      throw new Error(`Unknown marketplace: ${job.marketplaceId}`);
    }

    if (typeof adapter.submitResult !== "function") {
      healingState.lastError = "adapter_missing_submitResult";
      throw new Error(
        `Marketplace ${job.marketplaceId} does not support result submission`
      );
    }

    healingState.lastAdapterUsed = job.marketplaceId;

    // -------------------------------
    // 3. Forward result to adapter
    // -------------------------------
    const response = await adapter.submitResult(job, result);
    healingState.lastResponse = response;
    healingState.lastError = null;

    // -------------------------------
    // 4. Success
    // -------------------------------
    return response;

  } catch (err) {
    healingState.lastError = err.message;

    const failure = {
      success: false,
      error: err.message,
      jobId: job?.id ?? null,
      marketplaceId: job?.marketplaceId ?? null,
      timestamp,
    };

    healingState.lastResponse = failure;
    return failure;
  }
}

// ------------------------------------------------------
// Marketplace registry (plug‑in system)
// ------------------------------------------------------

import { marketplaceA } from "./marketplaceA.js";
import { marketplaceCustom } from "./marketplaceCustom.js";

const marketplaceRegistry = {
  A: marketplaceA,
  CUSTOM: marketplaceCustom,
};

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------
export function getResultSubmissionHealingState() {
  return { ...healingState };
}
