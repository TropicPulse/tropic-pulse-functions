// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnCirculatorySystem.js
// LAYER: THE CIRCULATORY SYSTEM (Brainstem Reflex + Routing + Weighting)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE CIRCULATORY SYSTEM — Pulse‑Earn’s autonomic routing center.
//   • Pings all marketplaces (sensory reflex).
//   • Filters unhealthy ones (pathway inhibition).
//   • Fetches jobs from healthy markets (circulatory intake).
//   • Applies reputation weighting (synaptic strength).
//   • Selects the best job for the device (autonomic prioritization).
//
// WHY “CIRCULATORY SYSTEM”?:
//   • It maintains the flow of economic “blood” (jobs).
//   • It filters unsafe pathways and prioritizes healthy ones.
//   • It keeps the Earn organism’s circulation stable.
//   • It ensures throughput AND safety simultaneously.
//   • It is the autonomic layer between sensory input and motor output.
//
// PURPOSE (v9.2):
//   • Provide deterministic, drift‑proof job routing.
//   • Guarantee safe multi‑marketplace discovery.
//   • Maintain healing metadata for the Immune System.
//   • Preserve autonomic routing + synaptic weighting (conceptual only).
//
// CONTRACT (unchanged):
//   • PURE ROUTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic job selection only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v9.2 MarketplaceOrchestrator.
// ============================================================================

import { scoreJobForDevice } from "./PulseEarnSurvivalInstincts.js";
import { getDeviceProfile } from "./PulseEarnSkeletalSystem.js";
import { getMarketplaceReputation } from "./PulseEarnEndocrineSystem.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Circulatory Reflex Log
// ---------------------------------------------------------------------------
const circulatoryHealing = {
  lastPingError: null,            // sensory reflex failure
  lastFetchError: null,           // intake pathway failure
  lastSelectionError: null,       // prioritization failure
  lastHealthyMarketplaces: [],    // open pathways
  lastJobsFetched: 0,             // total circulating jobs
  lastBestJobId: null,            // last autonomic decision
  cycleCount: 0,                  // autonomic cycles completed
};

// ---------------------------------------------------------------------------
// 1. discoverHealthyMarketplaces — Sensory Reflex Scan
// ---------------------------------------------------------------------------
export async function discoverHealthyMarketplaces(marketplaces, maxLatencyMs = 1500) {
  circulatoryHealing.cycleCount++;

  try {
    const results = await Promise.all(
      marketplaces.map(async (m) => {
        try {
          const latency = await m.ping();
          return { m, latency };
        } catch {
          return { m, latency: null };
        }
      })
    );

    const healthy = results
      .filter(r => r.latency !== null && r.latency <= maxLatencyMs)
      .map(r => r.m);

    circulatoryHealing.lastHealthyMarketplaces = healthy.map(m => m.id);

    return healthy;

  } catch (err) {
    circulatoryHealing.lastPingError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. fetchJobsFromMarketplaces — Circulatory Intake
// ---------------------------------------------------------------------------
export async function fetchJobsFromMarketplaces(marketplaces) {
  try {
    const allJobsArrays = await Promise.all(
      marketplaces.map(async (m) => {
        try {
          const jobs = await m.fetchJobs();
          return jobs.map(j => ({ ...j, marketplaceId: m.id }));
        } catch {
          return [];
        }
      })
    );

    const flat = allJobsArrays.flat();
    circulatoryHealing.lastJobsFetched = flat.length;

    return flat;

  } catch (err) {
    circulatoryHealing.lastFetchError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. selectBestJob — Autonomic Prioritization
// ---------------------------------------------------------------------------
export function selectBestJob(jobs) {
  try {
    const device = getDeviceProfile();

    let bestJob = null;
    let bestScore = -Infinity;

    for (const job of jobs) {
      if (!job.id || !job.marketplaceId) continue;

      const capabilityScore = scoreJobForDevice(job, device);
      const rep = job.reputationWeight ?? 0.5;

      // NOTE:
      //   • capabilityScore = metabolic compatibility
      //   • rep = synaptic strength (trust)
//   • finalScore = autonomic priority
      const finalScore = capabilityScore * (0.5 + rep);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestJob = job;
      }
    }

    if (bestJob) {
      circulatoryHealing.lastBestJobId = bestJob.id;
    }

    return bestJob;

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. getNextJob — Full Autonomic Routing Cycle
// ---------------------------------------------------------------------------
export async function getNextJob(allMarketplaces) {
  try {
    const healthy = await discoverHealthyMarketplaces(allMarketplaces);
    if (healthy.length === 0) return null;

    const jobs = await fetchJobsFromMarketplaces(healthy);
    if (jobs.length === 0) return null;

    const weightedJobs = jobs.map(job => {
      const rep = getMarketplaceReputation(job.marketplaceId);
      return { ...job, reputationWeight: rep };
    });

    return selectBestJob(weightedJobs);

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Circulatory Reflex Report
// ---------------------------------------------------------------------------
export function getPulseEarnCirculatorySystemHealingState() {
  return { ...circulatoryHealing };
}
