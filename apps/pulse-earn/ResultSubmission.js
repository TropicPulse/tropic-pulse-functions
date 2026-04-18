// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/ResultSubmission.js
// LAYER: THE NOTARY
// (Finalizer of Jobs + Certifier of Results + Official Handshake)
// ============================================================================
//
// ROLE:
//   THE NOTARY — Pulse‑Earn’s official closer.
//   • Validates job + marketplace identity
//   • Locates the correct marketplace adapter
//   • Ensures submitResult() exists
//   • Performs the final handshake between Earn and the marketplace
//   • Records the certified submission outcome
//
// WHY “NOTARY”?:
//   • It finalizes the job lifecycle
//   • It certifies the result as official
//   • It ensures the correct parties are involved
//   • It produces a deterministic, notarized record
//
// PURPOSE:
//   • Provide deterministic, drift‑proof result submission
//   • Guarantee safe forwarding to marketplace adapters
//   • Maintain a certified audit trail for EarnHealer
//
// CONTRACT:
//   • PURE RESULT DISPATCHER — no AI layers, no translation, no memory model
//   • NO network calls except through adapters
//   • NO eval(), NO dynamic imports, NO arbitrary code execution
//   • NEVER mutate job objects
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 ResultSubmission
// ============================================================================

const healingState = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastAdapterUsed: null,
  lastError: null,
  lastResponse: null,
  cycleCount: 0,
  lastTimestamp: null,
};

export async function submitJobResult(job, result) {
  const timestamp = Date.now();
  healingState.cycleCount++;
  healingState.lastTimestamp = timestamp;

  try {
    // 1. Identity Verification — Notary Check
    if (!job || !job.marketplaceId) {
      healingState.lastError = "missing_marketplaceId";
      healingState.lastJobId = job?.id ?? null;
      healingState.lastMarketplaceId = job?.marketplaceId ?? null;
      throw new Error("Job missing marketplaceId");
    }

    healingState.lastJobId = job.id;
    healingState.lastMarketplaceId = job.marketplaceId;

    // 2. Locate Marketplace Adapter — Notary Party Lookup
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

    // 3. Perform the Handshake — Official Submission
    const response = await adapter.submitResult(job, result);
    healingState.lastResponse = response;
    healingState.lastError = null;

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

import { marketplaceA } from "./marketplaceA.js";
import { marketplaceCustom } from "./marketplaceCustom.js";

const marketplaceRegistry = {
  A: marketplaceA,
  CUSTOM: marketplaceCustom,
};

export function getResultSubmissionHealingState() {
  return { ...healingState };
}
