// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktConsulate.js
// LAYER: THE CONSULATE
// (Cross‑Marketplace Intelligence + Job Prioritizer + Result Reuse Organ)
// ============================================================================
//
// ROLE (v9.x):
//   THE CONSULATE — Intelligence layer over all marketplace ambassadors.
//   • Fetches jobs from all registered marketplaces
//   • Eliminates structural duplicates via fingerprinting
//   • Factors jobs into reusable substructures (resource bands)
//   • Computes money‑per‑second and composite priority scores
//   • Exposes a prioritized job list for Earn Engine
//   • Caches completed results for future reuse
//
// CONTRACT (unchanged):
//   • PURE INTELLIGENCE LAYER — no network beyond adapters, no AI
//   • READ‑WRITE only to its own in‑memory consulateState
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic, explainable heuristics only
//
// SAFETY (unchanged):
//   • v9.x upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES
// ============================================================================

// ---------------------------------------------------------------------------
// Imports — Embassy Ledger (Registry of Ambassadors)
// ---------------------------------------------------------------------------
import { RegisteredMarketplaces } from "./PulseEarnMktEmbassyLedger.js";

// ---------------------------------------------------------------------------
// In-Memory Intelligence State — Consulate Genome
// ---------------------------------------------------------------------------
const consulateState = {
  // Job fingerprint → cached result (if any)
  resultCache: new Map(),

  // Job fingerprint → structural info
  fingerprintIndex: new Map(),

  // Substructure key → list of fingerprints that contain it
  factorIndex: new Map(),

  // Marketplace-level stats
  marketplaceStats: new Map(), // marketplaceId → { jobsSeen, avgSlope, lastCycleJobs }

  // Basic stats
  stats: {
    totalJobsSeen: 0,
    totalUniqueJobs: 0,
    totalEliminatedJobs: 0,
    totalReusedResults: 0,
    totalFactoredJobs: 0,
    lastCycleJobsIn: 0,
    lastCycleJobsOut: 0,
  },
};

// ---------------------------------------------------------------------------
// Utility — Stable JSON Stringify (for deterministic fingerprints)
// ---------------------------------------------------------------------------
function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map(stableStringify).join(",")}]`;
  }

  const keys = Object.keys(obj).sort();
  const parts = keys.map((k) => `"${k}":${stableStringify(obj[k])}`);
  return `{${parts.join(",")}}`;
}

// ---------------------------------------------------------------------------
// Job Fingerprinting — Structural Identity
// ---------------------------------------------------------------------------
function fingerprintJob(job) {
  if (!job || typeof job !== "object") return "invalid_job";

  const coreShape = {
    marketplaceId: job.marketplaceId || null,
    cpuRequired: job.cpuRequired ?? null,
    memoryRequired: job.memoryRequired ?? null,
    estimatedSeconds: job.estimatedSeconds ?? null,
    minGpuScore: job.minGpuScore ?? null,
    bandwidthNeededMbps: job.bandwidthNeededMbps ?? null,
  };

  return stableStringify(coreShape);
}

// ---------------------------------------------------------------------------
// Simple Factoring — Substructure Keys
// ---------------------------------------------------------------------------
function extractFactors(job) {
  const factors = [];
  if (!job || typeof job !== "object") return factors;

  const cpuBand =
    job.cpuRequired != null
      ? `cpu:${Math.round(Number(job.cpuRequired) || 0)}`
      : null;

  const memBand =
    job.memoryRequired != null
      ? `mem:${Math.round(Number(job.memoryRequired) || 0)}`
      : null;

  const timeBand =
    job.estimatedSeconds != null
      ? `time:${Math.round(Number(job.estimatedSeconds) || 0)}`
      : null;

  const gpuBand =
    job.minGpuScore != null
      ? `gpu:${Math.round(Number(job.minGpuScore) || 0)}`
      : null;

  const bwBand =
    job.bandwidthNeededMbps != null
      ? `bw:${Math.round(Number(job.bandwidthNeededMbps) || 0)}`
      : null;

  const mktBand = job.marketplaceId ? `mkt:${job.marketplaceId}` : null;

  [cpuBand, memBand, timeBand, gpuBand, bwBand, mktBand].forEach((f) => {
    if (f) factors.push(f);
  });

  return factors;
}

function indexFactors(fingerprint, factors) {
  factors.forEach((f) => {
    if (!consulateState.factorIndex.has(f)) {
      consulateState.factorIndex.set(f, new Set());
    }
    consulateState.factorIndex.get(f).add(fingerprint);
  });
}

// ---------------------------------------------------------------------------
//– Money Slope — Simple Money-Per-Second Heuristic
// ---------------------------------------------------------------------------
function computeMoneySlope(job) {
  const payout = Number(job.payout ?? 0);
  const seconds = Number(job.estimatedSeconds ?? 0);

  if (!Number.isFinite(payout) || payout <= 0) return 0;
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;

  return payout / seconds; // money per second
}

// ---------------------------------------------------------------------------
// Marketplace Profile — Static Heuristics per Marketplace
// ---------------------------------------------------------------------------
function getMarketplaceProfile(marketplaceId) {
  switch (marketplaceId) {
    case "render":
      return { baseWeight: 1.2, gpuBias: 1.3, shortJobBias: 1.0, bwBias: 1.0 };
    case "vast":
      return { baseWeight: 1.15, gpuBias: 1.2, shortJobBias: 1.1, bwBias: 1.0 };
    case "fluidstack":
      return { baseWeight: 1.1, gpuBias: 1.0, shortJobBias: 1.2, bwBias: 1.0 };
    case "spheron":
      return { baseWeight: 1.0, gpuBias: 0.9, shortJobBias: 1.3, bwBias: 1.0 };
    case "akash":
      return { baseWeight: 0.95, gpuBias: 1.0, shortJobBias: 1.0, bwBias: 1.0 };
    default:
      return { baseWeight: 1.0, gpuBias: 1.0, shortJobBias: 1.0, bwBias: 1.0 };
  }
}

// ---------------------------------------------------------------------------
// Resource Fit — GPU / Duration / Bandwidth Modifiers
// ---------------------------------------------------------------------------
function computeResourceModifiers(job) {
  const gpuScore = Number(job.minGpuScore ?? 0);
  const seconds = Number(job.estimatedSeconds ?? 0);
  const bw = Number(job.bandwidthNeededMbps ?? 0);

  let gpuFactor = 1.0;
  if (gpuScore >= 500) gpuFactor = 1.2;
  else if (gpuScore >= 300) gpuFactor = 1.1;

  let durationFactor = 1.0;
  if (seconds > 0 && seconds <= 600) durationFactor = 1.1; // short
  else if (seconds > 3600) durationFactor = 0.9; // very long

  let bwFactor = 1.0;
  if (bw > 50) bwFactor = 0.9; // penalize very heavy bandwidth

  return { gpuFactor, durationFactor, bwFactor };
}

// ---------------------------------------------------------------------------
// Composite Priority Score
// ---------------------------------------------------------------------------
function computePriorityScore(job) {
  const slope = computeMoneySlope(job);
  if (slope <= 0) return 0;

  const profile = getMarketplaceProfile(
    job.marketplaceId || job._sourceMarketplaceId || "unknown"
  );
  const { gpuFactor, durationFactor, bwFactor } = computeResourceModifiers(job);

  const score =
    slope *
    profile.baseWeight *
    Math.pow(profile.gpuBias, gpuFactor - 1) *
    Math.pow(profile.shortJobBias, durationFactor - 1) *
    Math.pow(profile.bwBias, bwFactor - 1);

  return score;
}

// ---------------------------------------------------------------------------
// Marketplace Stats Update
// ---------------------------------------------------------------------------
function updateMarketplaceStats(jobs) {
  const map = consulateState.marketplaceStats;

  const grouped = new Map();
  for (const job of jobs) {
    const id = job.marketplaceId || job._sourceMarketplaceId || "unknown";
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(job);
  }

  for (const [id, list] of grouped.entries()) {
    const slopes = list.map(computeMoneySlope).filter((s) => s > 0);
    const avgSlope =
      slopes.length > 0
        ? slopes.reduce((a, b) => a + b, 0) / slopes.length
        : 0;

    const prev = map.get(id) || {
      jobsSeen: 0,
      avgSlope: 0,
      lastCycleJobs: 0,
    };
    const jobsSeen = prev.jobsSeen + list.length;
    const blendedAvg =
      jobsSeen > 0
        ? (prev.avgSlope * prev.jobsSeen + avgSlope * list.length) / jobsSeen
        : avgSlope;

    map.set(id, {
      jobsSeen,
      avgSlope: blendedAvg,
      lastCycleJobs: list.length,
    });
  }
}

// ---------------------------------------------------------------------------
// Core: Ingest Jobs from All Marketplaces
// ---------------------------------------------------------------------------
async function fetchJobsFromAllMarketplaces(deviceId) {
  const { marketplaces } = RegisteredMarketplaces;
  const allJobs = [];

  for (const adapter of marketplaces) {
    try {
      const jobs = await adapter.fetchJobs(deviceId);
      if (Array.isArray(jobs) && jobs.length) {
        allJobs.push(
          ...jobs.map((j) => ({
            ...j,
            _sourceMarketplaceId: adapter.id || "unknown",
          }))
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      error("MarketplaceRouter.fetchJobsFromAllMarketplaces error:", err);
    }
  }

  return allJobs;
}

// ---------------------------------------------------------------------------
// Core: Intelligence Pass (Fingerprint + Elimination + Factoring)
// ---------------------------------------------------------------------------
function processJobsIntelligently(jobs) {
  const uniqueJobs = [];
  const { stats, resultCache, fingerprintIndex } = consulateState;

  stats.lastCycleJobsIn = jobs.length;
  stats.totalJobsSeen += jobs.length;

  for (const job of jobs) {
    const fp = fingerprintJob(job);

    if (fingerprintIndex.has(fp)) {
      stats.totalEliminatedJobs++;

      const cached = resultCache.get(fp);
      if (cached) {
        stats.totalReusedResults++;
        uniqueJobs.push({
          ...job,
          _router: {
            fingerprint: fp,
            hasCachedResult: true,
            cachedResultMeta: {
              ts: cached.ts,
              marketplaceId: cached.marketplaceId ?? null,
            },
          },
        });
      }
      continue;
    }

    fingerprintIndex.set(fp, {
      fingerprint: fp,
      firstSeenTs: Date.now(),
    });
    stats.totalUniqueJobs++;

    const factors = extractFactors(job);
    if (factors.length) {
      indexFactors(fp, factors);
      stats.totalFactoredJobs++;
    }

    uniqueJobs.push({
      ...job,
      _router: {
        fingerprint: fp,
        hasCachedResult: false,
      },
    });
  }

  stats.lastCycleJobsOut = uniqueJobs.length;
  updateMarketplaceStats(uniqueJobs);
  return uniqueJobs;
}

// ---------------------------------------------------------------------------
// Core: Prioritize Jobs by Composite Score
// ---------------------------------------------------------------------------
function sortJobsByPriority(jobs) {
  return [...jobs].sort((a, b) => {
    const sa = computePriorityScore(a);
    const sb = computePriorityScore(b);
    return sb - sa; // highest score first
  });
}

// ---------------------------------------------------------------------------
// Public: Fetch + Process + Prioritize Jobs
// ---------------------------------------------------------------------------
async function getRoutedJobs(deviceId) {
  const rawJobs = await fetchJobsFromAllMarketplaces(deviceId);
  const uniqueJobs = processJobsIntelligently(rawJobs);
  const sorted = sortJobsByPriority(uniqueJobs);
  return sorted;
}

// ---------------------------------------------------------------------------
// Public: Record Completed Result for Future Reuse
// ---------------------------------------------------------------------------
function recordJobResult(job, result) {
  if (!job || typeof job !== "object") return;
  const fp = job._router?.fingerprint || fingerprintJob(job);
  if (!fp) return;

  consulateState.resultCache.set(fp, {
    result,
    ts: Date.now(),
    marketplaceId: job.marketplaceId || job._sourceMarketplaceId || null,
  });
}

// ---------------------------------------------------------------------------
// Public: Read-Only Consulate Healing / Intelligence State
// ---------------------------------------------------------------------------
function getPulseEarnMktConsulateHealingState() {
  const marketplaceStats = {};
  for (const [id, value] of consulateState.marketplaceStats.entries()) {
    marketplaceStats[id] = { ...value };
  }

  return {
    stats: { ...consulateState.stats },
    resultCacheSize: consulateState.resultCache.size,
    fingerprintCount: consulateState.fingerprintIndex.size,
    factorKeyCount: consulateState.factorIndex.size,
    marketplaceStats,
  };
}

// ============================================================================
// Exported API — PULSE EARN MARKETPLACE CONSULATE
// ============================================================================
export const PulseEarnMktConsulate = {
  // Core routing
  getRoutedJobs, // async (deviceId) → prioritized jobs

  // Result memory
  recordJobResult, // (job, result) → cache for future reuse

  // Diagnostics / healing
  getHealingState: getPulseEarnMktConsulateHealingState,
};
