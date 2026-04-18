// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseJobScoring.js
// LAYER: THE UNION
// (Worker Protection + Fair Workload Enforcement + Profitability Defense)
// ============================================================================
//
// ROLE:
//   THE UNION — Pulse‑Earn’s worker‑protection scoring engine.
//   • Rejects unsafe jobs (CPU, memory, GPU incompatibility)
//   • Rejects unfair jobs (low payout, high cost)
//   • Rejects exploitative jobs (bandwidth drain, long runtimes)
//   • Approves only safe, profitable, fair workloads
//
// WHY “UNION”?:
//   • It stands between the worker (device) and the job market
//   • It protects the little guy from being overloaded or underpaid
//   • It enforces fair conditions before any job is accepted
//   • It negotiates on behalf of the worker using capability + profit logic
//
// PURPOSE:
//   • Provide deterministic, drift‑proof job scoring
//   • Ensure the device is never exploited by bad jobs
//   • Guarantee that only profitable, safe workloads enter the Earn pipeline
//
// CONTRACT:
//   • PURE SCORING ENGINE — no AI layers, no translation, no memory model
//   • NO imports, NO eval(), NO dynamic behavior
//   • NEVER mutate job objects
//   • Deterministic compatibility + profitability scoring only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 scoring engine
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Union Activity Log
// ---------------------------------------------------------------------------
const healingState = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastScore: null,
  lastCompatibility: null,
  lastRuntimeSeconds: null,
  lastPayoutEstimate: null,
  lastBandwidthPenalty: null,
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// scoreJobForDevice — Union Approval Process
// ---------------------------------------------------------------------------
export function scoreJobForDevice(rawJob, deviceProfile) {
  healingState.cycleCount++;
  healingState.lastJobId = rawJob?.id ?? null;
  healingState.lastMarketplaceId = rawJob?.marketplaceId ?? null;

  // 1. Worker Safety Check — Union Protection
  const compatible = isJobCompatible(rawJob, deviceProfile);
  healingState.lastCompatibility = compatible;

  if (!compatible) {
    healingState.lastScore = -Infinity; // Union veto
    return -Infinity;
  }

  // 2. Workload Evaluation — How hard is this job?
  const estimatedRuntimeSeconds = estimateRuntimeSeconds(rawJob, deviceProfile);
  healingState.lastRuntimeSeconds = estimatedRuntimeSeconds;

  // 3. Compensation Check — Is the pay fair?
  const estimatedPayout = estimatePayout(rawJob, estimatedRuntimeSeconds);
  healingState.lastPayoutEstimate = estimatedPayout;

  // 4. Hidden Cost Detection — Bandwidth penalties
  const bandwidthPenalty = estimateBandwidthPenalty(rawJob, deviceProfile);
  healingState.lastBandwidthPenalty = bandwidthPenalty;

  const stabilityBonus = deviceProfile.stabilityScore || 0.5;

  // 5. Final Union Score — Fairness + Profitability
  const profitPerSecond =
    estimatedPayout / Math.max(estimatedRuntimeSeconds, 1);

  const finalScore = profitPerSecond * stabilityBonus - bandwidthPenalty;
  healingState.lastScore = finalScore;

  return finalScore;
}

// ---------------------------------------------------------------------------
// COMPATIBILITY CHECKS — Worker Safety Rules
// ---------------------------------------------------------------------------
function isJobCompatible(rawJob, deviceProfile) {
  if (!rawJob || !deviceProfile) return false;

  // CPU safety
  if (
    rawJob.cpuRequired &&
    rawJob.cpuRequired > (deviceProfile.cpuCores || 4)
  ) {
    return false;
  }

  // Memory safety
  if (
    rawJob.memoryRequired &&
    rawJob.memoryRequired > (deviceProfile.memoryMB || 4096)
  ) {
    return false;
  }

  // GPU safety (soft rule)
  if (
    rawJob.minGpuScore &&
    deviceProfile.gpuScore &&
    rawJob.minGpuScore > deviceProfile.gpuScore * 1.5
  ) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// RUNTIME ESTIMATION — Workload Difficulty
// ---------------------------------------------------------------------------
function estimateRuntimeSeconds(rawJob, deviceProfile) {
  const base = rawJob.estimatedSeconds || 600;

  const jobGpuBaseline = rawJob.minGpuScore || 100;
  const ourGpu = deviceProfile.gpuScore || 100;

  const speedFactor = ourGpu / jobGpuBaseline;

  return base / Math.max(speedFactor, 0.25);
}

// ---------------------------------------------------------------------------
// PAYOUT ESTIMATION — Fair Compensation
// ---------------------------------------------------------------------------
function estimatePayout(rawJob) {
  if (rawJob.payout) return rawJob.payout;
  return 0.01; // Minimum guaranteed pay
}

// ---------------------------------------------------------------------------
// BANDWIDTH PENALTY — Hidden Cost Detection
// ---------------------------------------------------------------------------
function estimateBandwidthPenalty(rawJob, deviceProfile) {
  if (!rawJob.bandwidthNeededMbps) return 0;

  const ratio =
    rawJob.bandwidthNeededMbps / Math.max(deviceProfile.bandwidthMbps || 1, 1);

  if (ratio > 1) return ratio * 0.01; // Heavy penalty
  return ratio * 0.001; // Light penalty
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Union Report
// ---------------------------------------------------------------------------
export function getPulseJobScoringHealingState() {
  return { ...healingState };
}
