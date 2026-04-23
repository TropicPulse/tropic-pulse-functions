// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnCirculatorySystem.js
// LAYER: THE CIRCULATORY SYSTEM (Deterministic Reflex + Routing + Weighting)
// PULSE EARN — v10.4 (UPGRADED)
// ============================================================================
//
// ROLE (v10.4):
//   THE CIRCULATORY SYSTEM — Pulse‑Earn’s autonomic routing center.
//   • Evaluates marketplaces deterministically (no real ping).
//   • Filters unhealthy ones using deterministic healthScore.
//   • Fetches jobs deterministically (no async, no network).
//   • Applies reputation weighting (synaptic strength).
//   • Selects the best job for the device (autonomic prioritization).
//
// WHY “CIRCULATORY SYSTEM”?:
//   • It maintains the flow of economic “blood” (jobs).
//   • It filters unsafe pathways and prioritizes healthy ones.
//   • It keeps the Earn organism’s circulation stable.
//   • It ensures throughput AND safety simultaneously.
//
// PURPOSE (v10.4):
//   • Provide deterministic, drift‑proof job routing.
//   • Guarantee safe multi‑marketplace discovery.
//   • Maintain healing metadata for the Immune System.
//   • Preserve autonomic routing + synaptic weighting.
//
// CONTRACT (v10.4):
//   • PURE ROUTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO randomness, NO async.
//   • Deterministic job selection only.
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Circulatory Reflex Log
// ---------------------------------------------------------------------------
const circulatoryHealing = {
  lastHealthError: null,
  lastFetchError: null,
  lastSelectionError: null,
  lastHealthyMarketplaces: [],
  lastJobsFetched: 0,
  lastBestJobId: null,
  cycleCount: 0
};

// ---------------------------------------------------------------------------
// Deterministic Marketplace Health Evaluation (NO NETWORK)
// ---------------------------------------------------------------------------
function evaluateMarketplaceHealth(marketplace) {
  // v10.4: healthScore must be deterministic, no ping()
  const h = typeof marketplace.healthScore === "number"
    ? marketplace.healthScore
    : 1.0;

  // same tier logic as Router v10.4
  if (h >= 0.95) return "healthy";
  if (h >= 0.85) return "soft";
  if (h >= 0.50) return "mid";
  if (h >= 0.15) return "hard";
  return "critical";
}

// ---------------------------------------------------------------------------
// 1. discoverHealthyMarketplaces — Deterministic Sensory Reflex
// ---------------------------------------------------------------------------
export function discoverHealthyMarketplaces(marketplaces) {
  circulatoryHealing.cycleCount++;

  try {
    const healthy = [];

    for (const m of marketplaces) {
      const tier = evaluateMarketplaceHealth(m);
      if (tier === "healthy" || tier === "soft") {
        healthy.push(m);
      }
    }

    circulatoryHealing.lastHealthyMarketplaces = healthy.map(m => m.id);
    return healthy;

  } catch (err) {
    circulatoryHealing.lastHealthError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 2. fetchJobsFromMarketplaces — Deterministic Intake
// ---------------------------------------------------------------------------
export function fetchJobsFromMarketplaces(marketplaces) {
  try {
    const allJobs = [];

    for (const m of marketplaces) {
      // v10.4: NO async, NO network — marketplace must expose deterministic jobs[]
      const jobs = Array.isArray(m.jobs) ? m.jobs : [];

      for (const j of jobs) {
        allJobs.push({
          ...j,
          marketplaceId: m.id
        });
      }
    }

    circulatoryHealing.lastJobsFetched = allJobs.length;
    return allJobs;

  } catch (err) {
    circulatoryHealing.lastFetchError = err.message;
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. selectBestJob — Deterministic Autonomic Prioritization
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

      // deterministic final score
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
// 4. getNextJob — Full Autonomic Routing Cycle (Deterministic)
// ---------------------------------------------------------------------------
export function getNextJob(allMarketplaces) {
  try {
    const healthy = discoverHealthyMarketplaces(allMarketplaces);
    if (healthy.length === 0) return null;

    const jobs = fetchJobsFromMarketplaces(healthy);
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
