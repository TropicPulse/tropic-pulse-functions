// FILE: tropic-pulse-functions/apps/pulse-earn/PulseJobScoring.js
//
// PulseJobScoring v5 — Deterministic, Drift‑Proof, Self‑Healing Scoring Engine
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseJobScoring — capability-based scoring engine for marketplace jobs.
//
// RESPONSIBILITIES:
//   • Check device compatibility
//   • Estimate runtime on THIS device
//   • Estimate payout
//   • Apply bandwidth penalties
//   • Apply stability bonuses
//   • Produce final numeric score
//   • Maintain scoring healing metadata
//
// THIS FILE IS:
//   • A deterministic scoring engine
//   • A capability evaluator
//   • A runtime estimator
//   • A profitability estimator
//   • A penalty/bonus calculator
//
// THIS FILE IS NOT:
//   • A scheduler
//   • A compute engine
//   • A job selector
//   • A marketplace adapter
//   • A reputation engine
//   • A blockchain client
//   • A wallet or token handler
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO network calls
//   • NO filesystem access
//   • NO crypto operations
//   • NEVER mutate job objects
//   • NEVER import anything
//
// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

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

// ------------------------------------------------------
// scoreJobForDevice(rawJob, deviceProfile)
// ------------------------------------------------------

/**
 * deviceProfile = {
 *   id: string,
 *   gpuModel: string,
 *   gpuScore: number,
 *   vramMB: number,
 *   bandwidthMbps: number,
 *   stabilityScore: number,
 *   cpuCores: number,
 *   memoryMB: number
 * }
 *
 * rawJob = {
 *   id,
 *   marketplaceId,
 *   payout,
 *   cpuRequired,
 *   memoryRequired,
 *   estimatedSeconds,
 *   minGpuScore,
 *   bandwidthNeededMbps
 * }
 */

export function scoreJobForDevice(rawJob, deviceProfile) {
  healingState.cycleCount++;
  healingState.lastJobId = rawJob?.id ?? null;
  healingState.lastMarketplaceId = rawJob?.marketplaceId ?? null;

  // 1. Hard compatibility checks
  const compatible = isJobCompatible(rawJob, deviceProfile);
  healingState.lastCompatibility = compatible;

  if (!compatible) {
    healingState.lastScore = -Infinity;
    return -Infinity;
  }

  // 2. Estimate runtime on THIS device
  const estimatedRuntimeSeconds = estimateRuntimeSeconds(rawJob, deviceProfile);
  healingState.lastRuntimeSeconds = estimatedRuntimeSeconds;

  // 3. Estimate payout
  const estimatedPayout = estimatePayout(rawJob, estimatedRuntimeSeconds);
  healingState.lastPayoutEstimate = estimatedPayout;

  // 4. Penalties / bonuses
  const bandwidthPenalty = estimateBandwidthPenalty(rawJob, deviceProfile);
  healingState.lastBandwidthPenalty = bandwidthPenalty;

  const stabilityBonus = deviceProfile.stabilityScore || 0.5;

  // 5. Final score
  const profitPerSecond =
    estimatedPayout / Math.max(estimatedRuntimeSeconds, 1);

  const finalScore = profitPerSecond * stabilityBonus - bandwidthPenalty;
  healingState.lastScore = finalScore;

  return finalScore;
}

// ------------------------------------------------------
// COMPATIBILITY CHECKS
// ------------------------------------------------------

function isJobCompatible(rawJob, deviceProfile) {
  if (!rawJob || !deviceProfile) return false;

  // CPU sanity check
  if (
    rawJob.cpuRequired &&
    rawJob.cpuRequired > (deviceProfile.cpuCores || 4)
  ) {
    return false;
  }

  // Memory sanity check
  if (
    rawJob.memoryRequired &&
    rawJob.memoryRequired > (deviceProfile.memoryMB || 4096)
  ) {
    return false;
  }

  // GPU sanity check (soft)
  if (
    rawJob.minGpuScore &&
    deviceProfile.gpuScore &&
    rawJob.minGpuScore > deviceProfile.gpuScore * 1.5
  ) {
    return false;
  }

  return true;
}

// ------------------------------------------------------
// RUNTIME ESTIMATION
// ------------------------------------------------------

function estimateRuntimeSeconds(rawJob, deviceProfile) {
  const base = rawJob.estimatedSeconds || 600;

  const jobGpuBaseline = rawJob.minGpuScore || 100;
  const ourGpu = deviceProfile.gpuScore || 100;

  const speedFactor = ourGpu / jobGpuBaseline;

  return base / Math.max(speedFactor, 0.25);
}

// ------------------------------------------------------
// PAYOUT ESTIMATION
// ------------------------------------------------------

function estimatePayout(rawJob, estimatedRuntimeSeconds) {
  if (rawJob.payout) return rawJob.payout;
  return 0.01;
}

// ------------------------------------------------------
// BANDWIDTH PENALTY
// ------------------------------------------------------

function estimateBandwidthPenalty(rawJob, deviceProfile) {
  if (!rawJob.bandwidthNeededMbps) return 0;

  const ratio =
    rawJob.bandwidthNeededMbps / Math.max(deviceProfile.bandwidthMbps || 1, 1);

  if (ratio > 1) return ratio * 0.01;

  return ratio * 0.001;
}

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------

export function getPulseJobScoringHealingState() {
  return { ...healingState };
}
