// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnLymphNodes.js
// LAYER: THE LYMPHATIC HANDSHAKE NODES
// (Finalizer of Jobs + Immune-Safe Dispatch + Certified Marketplace Exchange)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE LYMPHATIC HANDSHAKE NODES — Pulse‑Earn’s immune‑safe finalizers.
//   • Validate job + marketplace identity (immune recognition).
//   • Locate the correct marketplace receptor (antigen matching).
//   • Ensure submitResult() exists (immune compatibility).
//   • Perform the final handshake between Earn and the marketplace
//     (lymphatic dispatch).
//   • Record the certified submission outcome (immune memory).
//
// PURPOSE (v9.2):
//   • Provide deterministic, drift‑proof result submission.
//   • Guarantee safe forwarding to marketplace receptors.
//   • Maintain a certified audit trail for the Immune System.
//   • Preserve immune lineage + dispatch safety.
//
// CONTRACT (unchanged):
//   • PURE RESULT DISPATCHER — no AI layers, no translation, no memory model.
//   • NO network calls except through receptors.
//   • NO eval(), NO dynamic imports, NO arbitrary code execution.
//   • NEVER mutate job objects.
//   • Deterministic identity verification + dispatch only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
// ============================================================================


// ---------------------------------------------------------------------------
// Healing Metadata — Lymphatic Dispatch Log
// ---------------------------------------------------------------------------
const lymphHealing = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastAdapterUsed: null,
  lastError: null,
  lastResponse: null,
  cycleCount: 0,
  lastTimestamp: null,
};


// ---------------------------------------------------------------------------
// submitPulseEarnResult — Lymphatic Handshake + Certified Dispatch
// ---------------------------------------------------------------------------
export async function submitPulseEarnResult(job, result) {
  const timestamp = Date.now();
  lymphHealing.cycleCount++;
  lymphHealing.lastTimestamp = timestamp;

  try {
    // 1. Identity Verification — Immune Recognition
    if (!job || !job.marketplaceId) {
      lymphHealing.lastError = "missing_marketplaceId";
      lymphHealing.lastJobId = job?.id ?? null;
      lymphHealing.lastMarketplaceId = job?.marketplaceId ?? null;
      throw new Error("Job missing marketplaceId");
    }

    lymphHealing.lastJobId = job.id;
    lymphHealing.lastMarketplaceId = job.marketplaceId;

    // 2. Locate Marketplace Receptor — Antigen Matching
    const adapter = receptorRegistry[job.marketplaceId];

    if (!adapter) {
      lymphHealing.lastError = "unknown_marketplace";
      throw new Error(`Unknown marketplace: ${job.marketplaceId}`);
    }

    if (typeof adapter.submitResult !== "function") {
      lymphHealing.lastError = "adapter_missing_submitResult";
      throw new Error(
        `Marketplace ${job.marketplaceId} does not support result submission`
      );
    }

    lymphHealing.lastAdapterUsed = job.marketplaceId;

    // 3. Perform the Handshake — Lymphatic Dispatch
    const response = await adapter.submitResult(job, result);
    lymphHealing.lastResponse = response;
    lymphHealing.lastError = null;

    return response;

  } catch (err) {
    lymphHealing.lastError = err.message;

    const failure = {
      success: false,
      error: err.message,
      jobId: job?.id ?? null,
      marketplaceId: job?.marketplaceId ?? null,
      timestamp,
    };

    lymphHealing.lastResponse = failure;
    return failure;
  }
}


// ---------------------------------------------------------------------------
// Marketplace Receptor Registry — Antigen Directory
// ---------------------------------------------------------------------------
import { marketplaceA as PulseEarnReceptor } from "./PulseEarnReceptor.js";
import { PulseEarnCustomReceptor } from "./PulseEarnCustomReceptor.js";

const receptorRegistry = {
  A: PulseEarnReceptor,
  CUSTOM: PulseEarnCustomReceptor,
};


// ---------------------------------------------------------------------------
// Export Healing Metadata — Lymphatic Dispatch Report
// ---------------------------------------------------------------------------
export function getPulseEarnLymphHealingState() {
  return { ...lymphHealing };
}
