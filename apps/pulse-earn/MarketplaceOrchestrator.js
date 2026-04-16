// FILE: tropic-pulse-functions/apps/pulse-earn/MarketplaceOrchestrator.js
//
// MarketplaceOrchestrator v5 — Deterministic, Drift‑Proof, Self‑Healing Job Router
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   MarketplaceOrchestrator — multi‑marketplace job discovery + selection.
//
// RESPONSIBILITIES:
//   • Ping all marketplaces
//   • Filter unhealthy ones
//   • Fetch jobs from healthy marketplaces
//   • Apply marketplace reputation weighting
//   • Select best job using capability scoring
//   • Maintain deterministic healing metadata
//
// THIS FILE IS:
//   • A job discovery engine
//   • A marketplace health checker
//   • A job aggregator
//   • A capability‑based job selector
//   • A reputation‑weighted scoring engine
//
// THIS FILE IS NOT:
//   • A scheduler
//   • A compute engine
//   • A marketplace adapter
//   • A job wrapper
//   • A result submitter
//   • A ledger/wallet/token handler
//
// SAFETY RULES:
//   • Never throw unhandled errors
//   • Always validate job objects
//   • Never mutate job objects
//   • Always remain deterministic
//
// IMPORT RULES:
//   Allowed:
//     • PulseJobScoring.js
//     • PulseDeviceProfile.js
//     • MarketplaceReputation.js
//
//   Forbidden:
//     • Direct marketplace API calls
//     • Node.js APIs
//     • Backend modules
//     • DOM manipulation
//
// ------------------------------------------------------
// MarketplaceOrchestrator — Multi‑marketplace job discovery + selection (v5)
// ------------------------------------------------------

import { scoreJobForDevice } from "./PulseJobScoring.js";
import { getDeviceProfile } from "./PulseDeviceProfile.js";
import { getMarketplaceReputation } from "./MarketplaceReputation.js";

// Healing metadata
const healingState = {
  lastPingError: null,
  lastFetchError: null,
  lastSelectionError: null,
  lastHealthyMarketplaces: [],
  lastJobsFetched: 0,
  lastBestJobId: null,
  cycleCount: 0,
};

// ------------------------------------------------------
// 1. discoverHealthyMarketplaces()
// ------------------------------------------------------
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

// ------------------------------------------------------
// 2. fetchJobsFromMarketplaces()
// ------------------------------------------------------
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

// ------------------------------------------------------
// 3. selectBestJob()
// ------------------------------------------------------
export function selectBestJob(jobs) {
  try {
    const device = getDeviceProfile();

    let bestJob = null;
    let bestScore = -Infinity;

    for (const job of jobs) {
      // Validate job structure
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

// ------------------------------------------------------
// 4. getNextJob()
// ------------------------------------------------------
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

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------
export function getMarketplaceOrchestratorHealingState() {
  return { ...healingState };
}
