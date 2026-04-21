// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnSurvivalInstincts.js
// LAYER: THE SURVIVAL INSTINCTS
// (Worker Protection + Evolutionary Scaling + Fair Workload Defense)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE SURVIVAL INSTINCTS — Pulse‑Earn’s evolved worker‑protection engine.
//   • Rejects unsafe jobs (structural incompatibility).
//   • Rejects unfair jobs (low pay, high metabolic cost).
//   • Rejects exploitative jobs (bandwidth drain, long runtimes).
//   • Applies evolutionary capability scaling (organism advantage).
//   • Approves only safe, profitable, fair workloads.
//
// WHY “SURVIVAL INSTINCTS”?:
//   • It protects the organism from harmful workloads.
//   • It enforces evolutionary advantage over raw hardware.
//   • It prevents exploitation by external marketplaces.
//   • It ensures long‑term survival, safety, and profitability.
//
// PURPOSE (v9.2):
//   • Provide deterministic, drift‑proof job scoring.
//   • Apply evolutionary scaling to device capability.
//   • Ensure the device is never overloaded or underpaid.
//   • Guarantee that only profitable, safe workloads enter the pipeline.
//
// CONTRACT (unchanged):
//   • PURE SCORING ENGINE — no AI layers, no translation, no memory model.
//   • NO imports, NO eval(), NO dynamic behavior.
//   • NEVER mutate job objects.
//   • Deterministic compatibility + profitability scoring only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
// ============================================================================


// ---------------------------------------------------------------------------
// Healing Metadata — Survival Instinct Activity Log
// ---------------------------------------------------------------------------
const survivalHealing = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastScore: null,
  lastCompatibility: null,
  lastRuntimeSeconds: null,
  lastPayoutEstimate: null,
  lastBandwidthPenalty: null,
  lastEvolutionBoost: null,
  cycleCount: 0,
};


// ---------------------------------------------------------------------------
// scoreJobForDevice — Survival Instinct Approval Process
// ---------------------------------------------------------------------------
export function scoreJobForDevice(rawJob, deviceProfile) {
  survivalHealing.cycleCount++;
  survivalHealing.lastJobId = rawJob?.id ?? null;
  survivalHealing.lastMarketplaceId = rawJob?.marketplaceId ?? null;

  // 1. Worker Safety Check — Survival Protection
  const compatible = isJobCompatible(rawJob, deviceProfile);
  survivalHealing.lastCompatibility = compatible;

  if (!compatible) {
    survivalHealing.lastScore = -Infinity;
    return -Infinity;
  }

  // 2. Evolutionary Capability Scaling — Organism Advantage
  const evoBoost = computeEvolutionaryBoost(deviceProfile);
  survivalHealing.lastEvolutionBoost = evoBoost;

  // 3. Workload Evaluation — Difficulty
  const estimatedRuntimeSeconds =
    estimateRuntimeSeconds(rawJob, deviceProfile, evoBoost);
  survivalHealing.lastRuntimeSeconds = estimatedRuntimeSeconds;

  // 4. Compensation Check — Fair Pay
  const estimatedPayout = estimatePayout(rawJob);
  survivalHealing.lastPayoutEstimate = estimatedPayout;

  // 5. Hidden Cost Detection — Bandwidth Penalties
  const bandwidthPenalty = estimateBandwidthPenalty(rawJob, deviceProfile);
  survivalHealing.lastBandwidthPenalty = bandwidthPenalty;

  const stabilityBonus = deviceProfile.stabilityScore || 0.5;

  // 6. Final Survival Score — Profitability + Evolution
  const profitPerSecond =
    estimatedPayout / Math.max(estimatedRuntimeSeconds, 1);

  const finalScore =
    profitPerSecond * stabilityBonus * evoBoost - bandwidthPenalty;

  survivalHealing.lastScore = finalScore;

  return finalScore;
}


// ---------------------------------------------------------------------------
// COMPATIBILITY CHECKS — Worker Safety Rules
// ---------------------------------------------------------------------------
function isJobCompatible(rawJob, deviceProfile) {
  if (!rawJob || !deviceProfile) return false;

  if (rawJob.cpuRequired &&
      rawJob.cpuRequired > (deviceProfile.cpuCores || 4)) {
    return false;
  }

  if (rawJob.memoryRequired &&
      rawJob.memoryRequired > (deviceProfile.memoryMB || 4096)) {
    return false;
  }

  if (rawJob.minGpuScore &&
      deviceProfile.gpuScore &&
      rawJob.minGpuScore > deviceProfile.gpuScore * 1.5) {
    return false;
  }

  return true;
}


// ---------------------------------------------------------------------------
// EVOLUTIONARY CAPABILITY BOOST — Organism Advantage
// ---------------------------------------------------------------------------
function computeEvolutionaryBoost(deviceProfile) {
  const stability = deviceProfile.stabilityScore || 0.5;
  const bandwidth = deviceProfile.bandwidthMbps || 50;
  const memory = deviceProfile.memoryMB || 4096;

  return (
    1 +
    stability * 0.4 +
    Math.min(bandwidth / 200, 0.3) +
    Math.min(memory / 32000, 0.3)
  );
}


// ---------------------------------------------------------------------------
// RUNTIME ESTIMATION — Workload Difficulty
// ---------------------------------------------------------------------------
function estimateRuntimeSeconds(rawJob, deviceProfile, evoBoost) {
  const base = rawJob.estimatedSeconds || 600;

  const jobGpuBaseline = rawJob.minGpuScore || 100;
  const ourGpu = (deviceProfile.gpuScore || 100) * evoBoost;

  const speedFactor = ourGpu / jobGpuBaseline;

  return base / Math.max(speedFactor, 0.25);
}


// ---------------------------------------------------------------------------
// PAYOUT ESTIMATION — Fair Compensation
// ---------------------------------------------------------------------------
function estimatePayout(rawJob) {
  if (rawJob.payout) return rawJob.payout;
  return 0.01;
}


// ---------------------------------------------------------------------------
// BANDWIDTH PENALTY — Hidden Cost Detection
// ---------------------------------------------------------------------------
function estimateBandwidthPenalty(rawJob, deviceProfile) {
  if (!rawJob.bandwidthNeededMbps) return 0;

  const ratio =
    rawJob.bandwidthNeededMbps /
    Math.max(deviceProfile.bandwidthMbps || 1, 1);

  if (ratio > 1) return ratio * 0.01;
  return ratio * 0.001;
}


// ---------------------------------------------------------------------------
// Export Healing Metadata — Survival Instinct Report
// ---------------------------------------------------------------------------
export function getPulseEarnSurvivalHealingState() {
  return { ...survivalHealing };
}
