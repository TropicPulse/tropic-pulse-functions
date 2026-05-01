// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMktConsulate-v12.3-PRESENCE-EVO+.js
// LAYER: THE CONSULATE (v12.3 Presence + Advantage‑C + Prewarm)
// ============================================================================

export const PulseEarnMktConsulateMeta = Object.freeze({
  layer: "PulseEarnMktConsulate",
  role: "EARN_CONSULATE_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMktConsulate-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureIntelligenceLayer: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    driftProof: true,
    explainableHeuristics: true
  })
});

import { PulseEarnMktEmbassyLedger } from "./PulseEarnMktEmbassyLedger.js";

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

// ============================================================================
// Presence / Advantage / Chunk‑Prewarm Builders (v12.3)
// ============================================================================
function buildPresenceField(consulateState) {
  const jobsIn = consulateState.stats.lastCycleJobsIn || 0;
  const jobsOut = consulateState.stats.lastCycleJobsOut || 0;
  const unique = consulateState.stats.totalUniqueJobs || 0;

  const composite =
    jobsIn * 0.0005 +
    jobsOut * 0.0007 +
    unique * 0.0001;

  const presenceTier =
    composite >= 0.05 ? "presence_high" :
    composite >= 0.01 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    jobsIn,
    jobsOut,
    unique,
    cycleIndex: consulateState.cycleIndex,
    presenceSignature: computeHash(
      `CONSULATE_PRESENCE::${presenceTier}::${jobsIn}::${jobsOut}::${unique}`
    )
  };
}

function buildAdvantageField(consulateState, presenceField) {
  const fpCount = consulateState.fingerprintIndex.size;
  const factorCount = consulateState.factorIndex.size;
  const cacheSize = consulateState.resultCache.size;

  const advantageScore =
    fpCount * 0.00005 +
    factorCount * 0.00003 +
    cacheSize * 0.00002 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0);

  return {
    advantageVersion: "C",
    fpCount,
    factorCount,
    cacheSize,
    presenceTier: presenceField.presenceTier,
    advantageScore
  };
}

function buildChunkPrewarmPlan(consulateState, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const advantageBoost = advantageField.advantageScore > 0.02 ? 1 : 0;
  const priority = basePriority + advantageBoost;

  return {
    planVersion: "v12.3-Consulate-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      consulateEnvelope: true,
      fingerprintIndex: true,
      factorIndex: true,
      resultCache: true
    },
    cache: {
      consulateDiagnostics: true,
      marketplaceStats: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      foragerLayer: true,
      courierLayer: true,
      brokerLayer: true,
      ambassadorLayer: true,
      auctioneerLayer: true
    }
  };
}

// ============================================================================
// Consulate State (v12.3 Presence)
// ============================================================================
const consulateState = {
  resultCache: new Map(),
  fingerprintIndex: new Map(),
  factorIndex: new Map(),
  marketplaceStats: new Map(),

  stats: {
    totalJobsSeen: 0,
    totalUniqueJobs: 0,
    totalEliminatedJobs: 0,
    totalReusedResults: 0,
    totalFactoredJobs: 0,
    lastCycleJobsIn: 0,
    lastCycleJobsOut: 0
  },

  cycleIndex: 0,

  lastCycleSignature: null,
  lastFingerprintSignature: null,
  lastFactorSignature: null,
  lastPrioritySignature: null,
  lastMarketplaceStatsSignature: null,
  lastResultCacheSignature: null,

  // NEW 12.3 Presence Surfaces
  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null
};

// ============================================================================
// Stable JSON Stringify
// ============================================================================
function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k => `"${k}":${stableStringify(obj[k])}`).join(",")}}`;
}

// ============================================================================
// Fingerprinting
// ============================================================================
function fingerprintJob(job) {
  const core = {
    marketplaceId: job.marketplaceId || job._sourceMarketplaceId || null,
    cpuRequired: job.cpuRequired ?? null,
    memoryRequired: job.memoryRequired ?? null,
    estimatedSeconds: job.estimatedSeconds ?? null,
    minGpuScore: job.minGpuScore ?? null,
    bandwidthNeededMbps: job.bandwidthNeededMbps ?? null
  };

  const fp = stableStringify(core);
  consulateState.lastFingerprintSignature = computeHash(`FP::${fp}`);
  return fp;
}

// ============================================================================
// Factoring
// ============================================================================
function extractFactors(job) {
  const f = [];

  const cpu = job.cpuRequired != null ? `cpu:${job.cpuRequired}` : null;
  const mem = job.memoryRequired != null ? `mem:${job.memoryRequired}` : null;
  const sec = job.estimatedSeconds != null ? `sec:${job.estimatedSeconds}` : null;
  const gpu = job.minGpuScore != null ? `gpu:${job.minGpuScore}` : null;
  const bw = job.bandwidthNeededMbps != null ? `bw:${job.bandwidthNeededMbps}` : null;
  const mkt = job.marketplaceId ? `mkt:${job.marketplaceId}` : null;

  [cpu, mem, sec, gpu, bw, mkt].forEach(x => x && f.push(x));

  if (f.length) {
    consulateState.lastFactorSignature = computeHash(`FACTORS::${f.sort().join("|")}`);
  }

  return f;
}

function indexFactors(fp, factors) {
  for (const f of factors) {
    if (!consulateState.factorIndex.has(f)) {
      consulateState.factorIndex.set(f, new Set());
    }
    consulateState.factorIndex.get(f).add(fp);
  }
}

// ============================================================================
// Money Slope
// ============================================================================
function computeMoneySlope(job) {
  const payout = Number(job.payout ?? 0);
  const sec = Number(job.estimatedSeconds ?? 0);
  if (payout <= 0 || sec <= 0) return 0;
  return payout / sec;
}

// ============================================================================
// Marketplace Profile
// ============================================================================
function getMarketplaceProfile(id) {
  switch (id) {
    case "runpod": return { base: 1.1, gpu: 1.2, short: 1.1, bw: 1.0 };
    case "spheron": return { base: 1.0, gpu: 0.9, short: 1.3, bw: 1.0 };
    case "salad": return { base: 1.05, gpu: 1.1, short: 1.0, bw: 1.0 };
    case "akash": return { base: 0.95, gpu: 1.0, short: 1.0, bw: 1.0 };
    case "vast": return { base: 1.15, gpu: 1.2, short: 1.1, bw: 1.0 };
    default: return { base: 1.0, gpu: 1.0, short: 1.0, bw: 1.0 };
  }
}

// ============================================================================
// A‑B‑A Influence
// ============================================================================
function computeAbaModifiers(job) {
  const band = job._abaBand || null;
  const density = Number(job._abaBinaryDensity ?? 0);
  const amp = Number(job._abaWaveAmplitude ?? 0);

  const bandFactor = band === "binary" ? 1.02 : 1.0;
  const binaryFactor = 1.0 + Math.min(density / 1000, 0.03);
  const waveFactor = 1.0 + Math.min(amp / 1000, 0.02);

  return { bandFactor, binaryFactor, waveFactor };
}

// ============================================================================
// Composite Priority Score
// ============================================================================
function computePriorityScore(job) {
  const slope = computeMoneySlope(job);
  if (slope <= 0) return 0;

  const profile = getMarketplaceProfile(job.marketplaceId);
  const { bandFactor, binaryFactor, waveFactor } = computeAbaModifiers(job);

  const score =
    slope *
    profile.base *
    bandFactor *
    binaryFactor *
    waveFactor;

  consulateState.lastPrioritySignature =
    computeHash(`PRIORITY::${job.id}::${score}`);

  return score;
}

// ============================================================================
// Marketplace Stats
// ============================================================================
function updateMarketplaceStats(jobs) {
  const grouped = new Map();

  for (const job of jobs) {
    const id = job.marketplaceId || "unknown";
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(job);
  }

  const snapshot = {};

  for (const [id, list] of grouped.entries()) {
    const slopes = list.map(computeMoneySlope).filter(x => x > 0);
    const avg = slopes.length ? slopes.reduce((a, b) => a + b, 0) / slopes.length : 0;

    const prev = consulateState.marketplaceStats.get(id) || {
      jobsSeen: 0,
      avgSlope: 0,
      lastCycleJobs: 0
    };

    const jobsSeen = prev.jobsSeen + list.length;
    const blended =
      jobsSeen > 0
        ? (prev.avgSlope * prev.jobsSeen + avg * list.length) / jobsSeen
        : avg;

    const entry = {
      jobsSeen,
      avgSlope: blended,
      lastCycleJobs: list.length
    };

    consulateState.marketplaceStats.set(id, entry);
    snapshot[id] = entry;
  }

  consulateState.lastMarketplaceStatsSignature =
    computeHash(`MKT_STATS::${JSON.stringify(snapshot)}`);
}

// ============================================================================
// Fetch Jobs From All Marketplaces
// ============================================================================
function fetchJobsFromAllMarketplaces(deviceId) {
  const { marketplaces } = PulseEarnMktEmbassyLedger;
  const all = [];

  for (const adapter of marketplaces) {
    try {
      const raw = adapter.fetchJobs(deviceId);

      let jobs;
      if (Array.isArray(raw)) jobs = raw;
      else if (raw && Array.isArray(raw.jobs)) jobs = raw.jobs;
      else jobs = [];

      for (const j of jobs) {
        all.push({
          ...j,
          _sourceMarketplaceId: adapter.id
        });
      }
    } catch (_) {}
  }

  return all;
}

// ============================================================================
// Intelligence Pass
// ============================================================================
function processJobsIntelligently(jobs) {
  const unique = [];
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
        unique.push({
          ...job,
          _router: {
            fingerprint: fp,
            hasCachedResult: true,
            cachedResultMeta: {
              cycleIndex: cached.cycleIndex,
              marketplaceId: cached.marketplaceId
            }
          }
        });
      }
      continue;
    }

    fingerprintIndex.set(fp, {
      fingerprint: fp,
      firstSeenCycle: consulateState.cycleIndex
    });
    stats.totalUniqueJobs++;

    const factors = extractFactors(job);
    if (factors.length) {
      indexFactors(fp, factors);
      stats.totalFactoredJobs++;
    }

    unique.push({
      ...job,
      _router: {
        fingerprint: fp,
        hasCachedResult: false
      }
    });
  }

  stats.lastCycleJobsOut = unique.length;
  updateMarketplaceStats(unique);

  return unique;
}

// ============================================================================
// Priority Sorting
// ============================================================================
function sortJobsByPriority(jobs) {
  const scored = jobs.map(j => ({ job: j, score: computePriorityScore(j) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.job);
}

// ============================================================================
// Public: getRoutedJobs
// ============================================================================
function getRoutedJobs(deviceId) {
  consulateState.cycleIndex++;

  const raw = fetchJobsFromAllMarketplaces(deviceId);
  const unique = processJobsIntelligently(raw);
  const sorted = sortJobsByPriority(unique);

  consulateState.lastCycleSignature =
    computeHash(`CYCLE::${consulateState.cycleIndex}`);
  consulateState.lastResultCacheSignature =
    computeHash(`RESULT_CACHE::${consulateState.resultCache.size}`);

  // NEW: Presence + Advantage + Chunk/Prewarm
  const presenceField = buildPresenceField(consulateState);
  const advantageField = buildAdvantageField(consulateState, presenceField);
  const chunkPlan = buildChunkPrewarmPlan(consulateState, presenceField, advantageField);

  consulateState.lastPresenceField = presenceField;
  consulateState.lastAdvantageField = advantageField;
  consulateState.lastChunkPrewarmPlan = chunkPlan;

  return sorted;
}

// ============================================================================
// Public: recordJobResult
// ============================================================================
function recordJobResult(job, result) {
  if (!job) return;

  const fp = job._router?.fingerprint || fingerprintJob(job);
  if (!fp) return;

  consulateState.resultCache.set(fp, {
    result,
    cycleIndex: consulateState.cycleIndex,
    marketplaceId: job.marketplaceId || job._sourceMarketplaceId
  });

  consulateState.lastResultCacheSignature =
    computeHash(`RESULT_CACHE::${consulateState.resultCache.size}`);
}

// ============================================================================
// Public: getHealingState
// ============================================================================
function getPulseEarnMktConsulateHealingState() {
  const marketplaceStats = {};
  for (const [id, v] of consulateState.marketplaceStats.entries()) {
    marketplaceStats[id] = { ...v };
  }

  return {
    stats: { ...consulateState.stats },
    resultCacheSize: consulateState.resultCache.size,
    fingerprintCount: consulateState.fingerprintIndex.size,
    factorKeyCount: consulateState.factorIndex.size,
    marketplaceStats,
    cycleIndex: consulateState.cycleIndex,

    lastCycleSignature: consulateState.lastCycleSignature,
    lastFingerprintSignature: consulateState.lastFingerprintSignature,
    lastFactorSignature: consulateState.lastFactorSignature,
    lastPrioritySignature: consulateState.lastPrioritySignature,
    lastMarketplaceStatsSignature: consulateState.lastMarketplaceStatsSignature,
    lastResultCacheSignature: consulateState.lastResultCacheSignature,

    // NEW 12.3 Presence Surfaces
    lastPresenceField: consulateState.lastPresenceField,
    lastAdvantageField: consulateState.lastAdvantageField,
    lastChunkPrewarmPlan: consulateState.lastChunkPrewarmPlan
  };
}

// ============================================================================
// Exported API — unchanged external shape
// ============================================================================
export const PulseEarnMktConsulate = {
  getRoutedJobs,
  recordJobResult,
  getHealingState: getPulseEarnMktConsulateHealingState
};
