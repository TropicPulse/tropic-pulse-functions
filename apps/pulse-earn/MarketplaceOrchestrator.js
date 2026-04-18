// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/MarketplaceOrchestrator.js
// LAYER: THE TRAFFIC OFFICER
// (Marketplace Traffic Control + Job Routing + Reputation Weighting)
// ============================================================================
//
// ROLE:
//   THE TRAFFIC OFFICER — Pulse‑Earn’s job traffic controller.
//   • Pings all marketplaces (traffic awareness)
//   • Filters unhealthy ones (unsafe vehicles)
//   • Fetches jobs from healthy markets (incoming lanes)
//   • Applies reputation weighting (driver trust)
//   • Selects the best job for the device (directs traffic)
//
// WHY “TRAFFIC OFFICER”?:
//   • Stands in the middle of all marketplaces
//   • Directs which marketplace gets to move next
//   • Stops unhealthy or slow marketplaces
//   • Routes jobs based on capability + reputation
//   • Keeps the Earn economy flowing smoothly
//
// PURPOSE:
//   • Provide deterministic, drift‑proof job routing
//   • Guarantee safe multi‑marketplace discovery
//   • Maintain healing metadata for the Physician (EarnHealer)
//
// CONTRACT:
//   • PURE ROUTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic job selection only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 Orchestrator
// ============================================================================

import { scoreJobForDevice } from "./PulseJobScoring.js";
import { getDeviceProfile } from "./PulseDeviceProfile.js";
import { getMarketplaceReputation } from "./MarketplaceReputation.js";

// ---------------------------------------------------------------------------
// Healing Metadata — Traffic Officer Log
// ---------------------------------------------------------------------------
const healingState = {
  lastPingError: null,
  lastFetchError: null,
  lastSelectionError: null,
  lastHealthyMarketplaces: [],
  lastJobsFetched: 0,
  lastBestJobId: null,
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// 1. discoverHealthyMarketplaces — Traffic Awareness Scan
// ---------------------------------------------------------------------------
export async function discoverHealthyMarketplaces(marketplaces, maxLatencyMs = 1500) {
  healingState.cycleCount++;

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

    healingState.lastHealthyMarketplaces = healthy.map(m => m.id);

    return healthy;

  } catch (err) {
    healingState.lastPingError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. fetchJobsFromMarketplaces — Incoming Lanes
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
    healingState.lastJobsFetched = flat.length;

    return flat;

  } catch (err) {
    healingState.lastFetchError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. selectBestJob — Traffic Direction Decision
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

      const finalScore = capabilityScore * (0.5 + rep);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestJob = job;
      }
    }

    if (bestJob) {
      healingState.lastBestJobId = bestJob.id;
    }

    return bestJob;

  } catch (err) {
    healingState.lastSelectionError = err.message;
    return null;
  }
}

// ---------------------------------------------------------------------------
// 4. getNextJob — Full Traffic Control Cycle
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
    healingState.lastSelectionError = err.message;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Traffic Officer Report
// ---------------------------------------------------------------------------
export function getMarketplaceOrchestratorHealingState() {
  return { ...healingState };
}
