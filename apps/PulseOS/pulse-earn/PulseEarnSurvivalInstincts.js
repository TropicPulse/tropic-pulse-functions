//js
// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnSurvivalInstincts-v11-Evo.js
// LAYER: THE SURVIVAL INSTINCTS (v11-Evo)
// (Worker Protection + Evolutionary Scaling + Fair Workload Defense + Diagnostics)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE SURVIVAL INSTINCTS — Pulse‑Earn’s evolved worker‑protection engine.
//   • Rejects unsafe jobs (structural incompatibility).
//   • Rejects unfair jobs (low pay, high metabolic cost).
//   • Rejects exploitative jobs (bandwidth drain, long runtimes).
//   • Applies deterministic evolutionary capability scaling.
//   • Approves only safe, profitable, fair workloads.
//   • Emits deterministic, pattern‑aware diagnostics for governance.
//
// PURPOSE (v11-Evo):
//   • Provide deterministic, drift‑proof job scoring.
//   • Apply evolutionary scaling to device capability.
//   • Ensure the device is never overloaded or underpaid.
//   • Guarantee that only profitable, safe workloads enter the pipeline.
//   • Surface a stable, inspectable survival signature per job.
//
// CONTRACT (v11-Evo):
//   • PURE SCORING ENGINE — no AI layers, no translation, no memory model.
//   • NO imports, NO eval(), NO dynamic behavior.
//   • NEVER mutate job objects.
//   • Deterministic compatibility + profitability scoring only.
//   • NO timestamps, NO randomness.
//   • Internal healing state is allowed to mutate; external objects are not.
// ============================================================================


// ---------------------------------------------------------------------------
// Healing Metadata — Survival Instinct Activity Log (v11-Evo)
// ---------------------------------------------------------------------------
const survivalHealing = {
  lastJobId: null,
  lastMarketplaceId: null,

  lastScore: null,
  lastRawScore: null,
  lastCompatibility: null,
  lastRuntimeSeconds: null,
  lastPayoutEstimate: null,
  lastBandwidthPenalty: null,
  lastEvolutionBoost: null,
  lastTier: null,
  lastProfitPerSecond: null,
  lastStabilityBonus: null,
  lastHealthScore: null,

  lastDecision: null,           // "approved" | "rejected_incompatible" | "rejected_unprofitable"
  lastRejectionReason: null,    // string | null
  lastApprovalReason: null,     // string | null

  // v11-Evo: pattern / signature surface
  lastJobPattern: null,
  lastDevicePattern: null,
  lastSurvivalSignature: null,

  cycleCount: 0,

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  }
};


// ---------------------------------------------------------------------------
// Deterministic Hash Helper — v11-Evo (no randomness, no timestamps)
// ---------------------------------------------------------------------------
function computeDeterministicHash(str) {
  let acc = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    acc = (acc + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${acc}`;
}


// ---------------------------------------------------------------------------
// INTERNAL: Numeric safety helpers (deterministic)
// ---------------------------------------------------------------------------
function toNumber(value, fallback) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  const v = toNumber(value, min);
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function nonNegative(value, fallback) {
  const v = toNumber(value, fallback);
  return v < 0 ? 0 : v;
}


// ---------------------------------------------------------------------------
// Degradation Tier — aligned with Router v10.4 / v11
// ---------------------------------------------------------------------------
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;

  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ---------------------------------------------------------------------------
// INTERNAL: Build Survival Signature (v11-Evo)
// ---------------------------------------------------------------------------
function buildSurvivalSignature({
  jobId,
  marketplaceId,
  compatibility,
  profitPerSecond,
  bandwidthPenalty,
  tier,
  healthScore,
  stabilityBonus
}) {
  const raw = [
    jobId || "NO_JOB",
    marketplaceId || "NO_MARKET",
    compatibility ? "COMPATIBLE" : "INCOMPATIBLE",
    `pps:${toNumber(profitPerSecond, 0)}`,
    `bw:${toNumber(bandwidthPenalty, 0)}`,
    `tier:${tier || "NO_TIER"}`,
    `h:${toNumber(healthScore, 1)}`,
    `stab:${toNumber(stabilityBonus, 0.5)}`
  ].join("::");

  return computeDeterministicHash(raw);
}


// ---------------------------------------------------------------------------
// scoreJobForDevice — Survival Instinct Approval Process (v11-Evo)
// ---------------------------------------------------------------------------
export function scoreJobForDevice(rawJob, deviceProfile) {
  const job = rawJob || {};
  const device = deviceProfile || {};

  survivalHealing.cycleCount++;
  survivalHealing.lastJobId = job.id ?? null;
  survivalHealing.lastMarketplaceId = job.marketplaceId ?? null;

  survivalHealing.lastDecision = null;
  survivalHealing.lastRejectionReason = null;
  survivalHealing.lastApprovalReason = null;

  // 1. Worker Safety Check — Survival Protection
  const compatible = isJobCompatible(job, device);
  survivalHealing.lastCompatibility = compatible;

  const healthScore = toNumber(device.healthScore, 1.0);
  const stabilityBonus = clamp(device.stabilityScore, 0, 1.5) || 0.5;
  const tier = classifyDegradationTier(healthScore);

  survivalHealing.lastTier = tier;
  survivalHealing.lastHealthScore = healthScore;
  survivalHealing.lastStabilityBonus = stabilityBonus;

  if (!compatible) {
    survivalHealing.lastScore = -Infinity;
    survivalHealing.lastRawScore = -Infinity;
    survivalHealing.lastRuntimeSeconds = null;
    survivalHealing.lastPayoutEstimate = null;
    survivalHealing.lastBandwidthPenalty = null;
    survivalHealing.lastEvolutionBoost = null;
    survivalHealing.lastProfitPerSecond = null;

    survivalHealing.lastJobPattern = buildJobPattern(job);
    survivalHealing.lastDevicePattern = buildDevicePattern(device);

    survivalHealing.lastDecision = "rejected_incompatible";
    survivalHealing.lastRejectionReason = "incompatible_with_device";

    survivalHealing.lastSurvivalSignature = buildSurvivalSignature({
      jobId: survivalHealing.lastJobId,
      marketplaceId: survivalHealing.lastMarketplaceId,
      compatibility: false,
      profitPerSecond: 0,
      bandwidthPenalty: 0,
      tier,
      healthScore,
      stabilityBonus
    });

    return -Infinity;
  }

  // 2. Evolutionary Capability Scaling — Organism Advantage
  const evoBoost = computeEvolutionaryBoost(device);
  survivalHealing.lastEvolutionBoost = evoBoost;

  // 3. Workload Evaluation — Difficulty
  const estimatedRuntimeSeconds = nonNegative(
    estimateRuntimeSeconds(job, device, evoBoost),
    1
  ) || 1;
  survivalHealing.lastRuntimeSeconds = estimatedRuntimeSeconds;

  // 4. Compensation Check — Fair Pay
  const estimatedPayout = nonNegative(estimatePayout(job), 0);
  survivalHealing.lastPayoutEstimate = estimatedPayout;

  // 5. Hidden Cost Detection — Bandwidth Penalties
  const bandwidthPenalty = nonNegative(
    estimateBandwidthPenalty(job, device),
    0
  );
  survivalHealing.lastBandwidthPenalty = bandwidthPenalty;

  // 6. Final Survival Score — Profitability + Evolution
  const profitPerSecond =
    estimatedPayout / Math.max(estimatedRuntimeSeconds, 1);
  survivalHealing.lastProfitPerSecond = profitPerSecond;

  const rawScore =
    profitPerSecond * stabilityBonus * evoBoost - bandwidthPenalty;
  survivalHealing.lastRawScore = rawScore;

  const finalScore = Number.isFinite(rawScore) ? rawScore : -Infinity;
  survivalHealing.lastScore = finalScore;

  // 7. v11-Evo: Pattern + Signature Surface
  const jobPattern = buildJobPattern(job);
  const devicePattern = buildDevicePattern(device);
  survivalHealing.lastJobPattern = jobPattern;
  survivalHealing.lastDevicePattern = devicePattern;

  survivalHealing.lastSurvivalSignature = buildSurvivalSignature({
    jobId: survivalHealing.lastJobId,
    marketplaceId: survivalHealing.lastMarketplaceId,
    compatibility: true,
    profitPerSecond,
    bandwidthPenalty,
    tier,
    healthScore,
    stabilityBonus
  });

  survivalHealing.lastDecision =
    finalScore > 0 ? "approved" : "rejected_unprofitable";
  survivalHealing.lastApprovalReason =
    finalScore > 0 ? "profitable_and_compatible" : null;
  if (finalScore <= 0 && !survivalHealing.lastRejectionReason) {
    survivalHealing.lastRejectionReason = "non_profitable_or_neutral";
  }

  return finalScore;
}
// ---------------------------------------------------------------------------
// COMPATIBILITY CHECKS — Worker Safety Rules (v11-Evo A-B-A Upgraded)
// ---------------------------------------------------------------------------
function isJobCompatible(rawJob, deviceProfile) {
  if (!rawJob || !deviceProfile) return false;

  const cpuReq = rawJob.cpuRequired || 0;
  const memReq = rawJob.memoryRequired || 0;
  const gpuReq = rawJob.minGpuScore || 0;

  const cpuAvail = deviceProfile.cpuCores || 4;
  const memAvail = deviceProfile.memoryMB || 4096;
  const gpuAvail = deviceProfile.gpuScore || 100;

  // CPU safety
  if (cpuReq > cpuAvail) return false;

  // Memory safety
  if (memReq > memAvail) return false;

  // GPU safety (v11-Evo: allow 1.5x tolerance)
  if (gpuReq > gpuAvail * 1.5) return false;

  return true;
}


// ---------------------------------------------------------------------------
// EVOLUTIONARY CAPABILITY BOOST — Organism Advantage (v11-Evo A-B-A)
// ---------------------------------------------------------------------------
function computeEvolutionaryBoost(deviceProfile) {
  const stability = deviceProfile.stabilityScore || 0.5;
  const bandwidth = deviceProfile.bandwidthMbps || 50;
  const memory = deviceProfile.memoryMB || 4096;

  // A-B-A surfaces
  const band = (deviceProfile.band || "symbolic").toLowerCase();
  const binaryField = deviceProfile.binaryField || null;
  const waveField = deviceProfile.waveField || null;

  const density = binaryField?.density || 0;
  const amplitude = waveField?.amplitude || 0;

  // Base deterministic boost
  let boost =
    1 +
    stability * 0.4 +
    Math.min(bandwidth / 200, 0.3) +
    Math.min(memory / 32000, 0.3);

  // A-B-A binary advantage
  if (band === "binary") {
    boost += 0.05;
  }

  // A-B-A density advantage
  boost += Math.min(density / 20000, 0.1);

  // A-B-A wave amplitude advantage
  boost += Math.min(amplitude / 5000, 0.1);

  // Clamp for determinism
  if (boost < 0.5) return 0.5;
  if (boost > 2.5) return 2.5;

  return boost;
}


// ---------------------------------------------------------------------------
// RUNTIME ESTIMATION — Workload Difficulty (v11-Evo A-B-A)
// ---------------------------------------------------------------------------
function estimateRuntimeSeconds(rawJob, deviceProfile, evoBoost) {
  const base = rawJob.estimatedSeconds || 600;

  const jobGpuBaseline = rawJob.minGpuScore || 100;
  const ourGpu = (deviceProfile.gpuScore || 100) * evoBoost;

  const speedFactor = ourGpu / jobGpuBaseline;

  // Deterministic clamp
  const sf = Math.max(speedFactor, 0.25);

  return base / sf;
}


// ---------------------------------------------------------------------------
// PAYOUT ESTIMATION — Fair Compensation (v11-Evo)
// ---------------------------------------------------------------------------
function estimatePayout(rawJob) {
  if (rawJob.payout) return rawJob.payout;
  return 0.01; // deterministic fallback
}


// ---------------------------------------------------------------------------
// BANDWIDTH PENALTY — Hidden Cost Detection (v11-Evo A-B-A)
// ---------------------------------------------------------------------------
function estimateBandwidthPenalty(rawJob, deviceProfile) {
  const needed = rawJob.bandwidthNeededMbps || 0;
  const available = deviceProfile.bandwidthMbps || 1;

  if (needed <= 0) return 0;

  const ratio = needed / Math.max(available, 1);

  // A-B-A band-aware penalty
  const band = (deviceProfile.band || "symbolic").toLowerCase();
  const bandMultiplier = band === "binary" ? 0.8 : 1.0;

  if (ratio > 1) return ratio * 0.01 * bandMultiplier;
  return ratio * 0.001 * bandMultiplier;
}


// ---------------------------------------------------------------------------
// PATTERN BUILDERS — Job / Device Pattern Surfaces (v11-Evo A-B-A)
// ---------------------------------------------------------------------------
function buildJobPattern(rawJob) {
  if (!rawJob) return "JOB::NONE";

  const id = rawJob.id || "NO_ID";
  const market = rawJob.marketplaceId || "NO_MARKET";
  const cpu = rawJob.cpuRequired || 0;
  const mem = rawJob.memoryRequired || 0;
  const gpu = rawJob.minGpuScore || 0;
  const bw = rawJob.bandwidthNeededMbps || 0;

  return (
    `JOB::${id}` +
    `::${market}` +
    `::cpu:${cpu}` +
    `::mem:${mem}` +
    `::gpu:${gpu}` +
    `::bw:${bw}`
  );
}

function buildDevicePattern(deviceProfile) {
  if (!deviceProfile) return "DEVICE::NONE";

  const cpu = deviceProfile.cpuCores || 0;
  const mem = deviceProfile.memoryMB || 0;
  const gpu = deviceProfile.gpuScore || 0;
  const bw = deviceProfile.bandwidthMbps || 0;
  const stab = deviceProfile.stabilityScore || 0.5;
  const health = deviceProfile.healthScore ?? 1.0;
  const band = (deviceProfile.band || "symbolic").toLowerCase();

  return (
    `DEVICE::cpu:${cpu}` +
    `::mem:${mem}` +
    `::gpu:${gpu}` +
    `::bw:${bw}` +
    `::stab:${stab}` +
    `::h:${health}` +
    `::band:${band}`
  );
}


// ---------------------------------------------------------------------------
// Export Healing Metadata — Survival Instinct Report (v11-Evo)
// ---------------------------------------------------------------------------
export function getPulseEarnSurvivalHealingState() {
  return { ...survivalHealing };
}
