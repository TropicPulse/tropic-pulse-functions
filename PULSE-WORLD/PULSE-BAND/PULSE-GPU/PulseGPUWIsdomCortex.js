// ============================================================================
//  PULSE GPU INSIGHTS ENGINE v12.3-Spine-binary — THE WISDOM CORTEX
//  Deterministic, Pure Logic, Drift‑Proof Analytics Over Session Traces
// ============================================================================
//
// IDENTITY — THE WISDOM CORTEX (v12.3-Spine-binary):
//  -------------------------------------------------
//  • Interpretive cortex of the GPU organism.
//  • Observes baseline traces (past) and current traces (present).
//  • Compares them with deterministic clarity, no guessing.
//  • Reveals meaning already encoded in the data.
//  • Binary-aware, symbolic-aware, dual-band-aware (metadata only).
//  • Spine-aware: aligned with Orchestrator v12.3+.
//  • Chunking-aware + prewarm-ready (metadata only).
//  • Advantage‑cascade aware: systemic gains improve insight flow.
//  • PulseSend‑v12.3‑ready: insights routable by compute router.
//  • Earn‑v4‑ready.
//
// SAFETY CONTRACT (v12.3-Spine-binary):
//  ------------------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail‑open: malformed traces → ignored, never crash
//  • Deterministic: same traces → same insights
//  • Self‑repair‑ready: insights include metadata
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseGPUWisdomCortex",
  version: "v14-IMMORTAL",
  layer: "gpu_brain",
  role: "gpu_wisdom_cortex",
  lineage: "PulseGPU-v14",

  evo: {
    gpuCognition: true,
    gpuHeuristics: true,
    gpuMetaReasoning: true,

    gpuCompute: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseGPUBrain",
      "PulseGPUCognitiveLayer",
      "PulseGPUGeneticMemory"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyWisdomCortex"
    ]
  }
}
*/

import { INSIGHT_THRESHOLDS } from "./PulseGPUCommandments.js";

// ============================================================================
// UTILITY: clamp — Wisdom requires boundaries
// ============================================================================
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// ============================================================================
// DELTA CLASSIFICATION — Wisdom about change
// ============================================================================
function classifyDelta(deltaPercent) {
  if (typeof deltaPercent !== "number" || Number.isNaN(deltaPercent)) {
    return "low";
  }

  const absDelta = Math.abs(deltaPercent);

  const low = INSIGHT_THRESHOLDS?.MIN_STEP_DELTA_PERCENT ?? 5;

  if (absDelta < low) return "low";
  if (absDelta < 20) return "medium";
  if (absDelta < 40) return "high";
  return "critical";
}

// ============================================================================
// INSIGHT BUILDER — Structured understanding
// ============================================================================
function buildInsight({
  type,
  severity,
  message,
  gameProfile,
  hardwareProfile,
  tierProfile,
  stepId,
  deltaPercent,
  baselineAvgDurationMs,
  currentAvgDurationMs,
  extra
}) {
  const insight = {
    type,
    severity,
    message,

    meta: {
      layer: "PulseGPUInsightsEngine",
      role: "WISDOM_CORTEX",
      version: "12.3-Spine-binary",
      target: "full-gpu+binary+spine",
      selfRepairable: true,

      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        unifiedAdvantageField: true,

        // v12.3 spine + dual-band + chunking
        gpuSpineReady: true,
        dualBandReady: true,
        chunkingReady: true,
        prewarmReady: true,

        // awareness flags (metadata only)
        binaryAware: true,
        symbolicAware: true,
        gpuDispatchAware: true,
        gpuMemoryAware: true,
        gpuAdvantageAware: true,

        // Contracts
        pulseSend12Ready: true,
        routingContract: "PulseSend-v12.3",
        gpuOrganContract: "PulseGPU-v12.3-Spine",
        binaryGpuOrganContract: "PulseBinaryGPU-v12.3-Spine",
        earnCompatibility: "Earn-v4",

        // Legacy compatibility
        legacyRoutingContract: "PulseSend-v10.4",
        legacyGPUOrganContract: "PulseGPU-v10.4",
        legacyEarnCompatibility: "Earn-v2"
      }
    }
  };

  if (gameProfile) insight.gameProfile = gameProfile;
  if (hardwareProfile) insight.hardwareProfile = hardwareProfile;
  if (tierProfile) insight.tierProfile = tierProfile;
  if (stepId) insight.stepId = stepId;
  if (typeof deltaPercent === "number") insight.deltaPercent = deltaPercent;
  if (typeof baselineAvgDurationMs === "number") {
    insight.baselineAvgDurationMs = baselineAvgDurationMs;
  }
  if (typeof currentAvgDurationMs === "number") {
    insight.currentAvgDurationMs = currentAvgDurationMs;
  }
  if (extra && typeof extra === "object") {
    insight.extra = extra;
  }

  return insight;
}

// ============================================================================
// GROUP STEPS — The Cortex organizes the story
// ============================================================================
function groupStepsById(traces = []) {
  const groups = new Map();

  traces.forEach((trace) => {
    if (!trace || !Array.isArray(trace.steps)) return;

    trace.steps.forEach((step) => {
      if (!step) return;

      const stepId = step.stepId || "unknown-step";
      let group = groups.get(stepId);
      if (!group) {
        group = {
          durations: [],
          metaSamples: []
        };
        groups.set(stepId, group);
      }

      const duration = clamp(step.durationMs || 0, 0, 60 * 60 * 1000);
      group.durations.push(duration);
      group.metaSamples.push({
        gameProfile: trace.gameProfile || {},
        hardwareProfile: trace.hardwareProfile || {},
        tierProfile: trace.tierProfile || {}
      });
    });
  });

  return groups;
}

// ============================================================================
// COMPUTE AVERAGES — The Cortex finds the pattern
// ============================================================================
function computeStepAverages(groups) {
  const result = new Map();

  for (const [stepId, group] of groups.entries()) {
    const durations = group.durations;
    if (!durations || durations.length === 0) continue;

    let sum = 0;
    durations.forEach((d) => (sum += d));

    const avg = sum / durations.length;

    result.set(stepId, {
      avgDurationMs: avg,
      sampleCount: durations.length,
      sampleMeta: group.metaSamples[0] || {
        gameProfile: {},
        hardwareProfile: {},
        tierProfile: {}
      }
    });
  }

  return result;
}

// ============================================================================
//  PULSE GPU INSIGHTS ENGINE — THE WISDOM CORTEX (v12.3-Spine-binary)
// ============================================================================
class PulseGPUInsightsEngine {
  constructor() {}

  analyzeStepDurations(baselineTraces = [], currentTraces = []) {
    const baselineGroups = groupStepsById(baselineTraces);
    const currentGroups = groupStepsById(currentTraces);

    const baselineAverages = computeStepAverages(baselineGroups);
    const currentAverages = computeStepAverages(currentGroups);

    const insights = [];

    for (const [stepId, baselineInfo] of baselineAverages.entries()) {
      const currentInfo = currentAverages.get(stepId);
      if (!currentInfo) continue;

      const baselineAvg = baselineInfo.avgDurationMs;
      const currentAvg = currentInfo.avgDurationMs;

      if (baselineAvg <= 0) continue;

      const delta = (baselineAvg - currentAvg) / baselineAvg;
      const deltaPercent = delta * 100;

      const minDelta =
        INSIGHT_THRESHOLDS?.MIN_STEP_DELTA_PERCENT ?? 5;
      if (Math.abs(deltaPercent) < minDelta) continue;

      const severity = classifyDelta(deltaPercent);

      const { gameProfile, hardwareProfile, tierProfile } =
        currentInfo.sampleMeta || {};

      const message =
        deltaPercent > 0
          ? `Step "${stepId}" is faster than baseline.`
          : `Step "${stepId}" is slower than baseline.`;

      insights.push(
        buildInsight({
          type: "step-duration-change",
          severity,
          message,
          gameProfile,
          hardwareProfile,
          tierProfile,
          stepId,
          deltaPercent,
          baselineAvgDurationMs: baselineAvg,
          currentAvgDurationMs: currentAvg,
          extra: {
            baselineSampleCount: baselineInfo.sampleCount,
            currentSampleCount: currentInfo.sampleCount
          }
        })
      );
    }

    return insights;
  }

  analyzeStepDurationsForGameAndHardware({
    baselineTraces = [],
    currentTraces = [],
    gameId,
    gpuModel
  }) {
    const filteredBaseline = baselineTraces.filter((trace) => {
      if (!trace) return false;
      const gp = trace.gameProfile || {};
      const hp = trace.hardwareProfile || {};
      if (gameId && gp.gameId !== gameId) return false;
      if (gpuModel && hp.gpuModel !== gpuModel) return false;
      return true;
    });

    const filteredCurrent = currentTraces.filter((trace) => {
      if (!trace) return false;
      const gp = trace.gameProfile || {};
      const hp = trace.hardwareProfile || {};
      if (gameId && gp.gameId !== gameId) return false;
      if (gpuModel && hp.gpuModel !== gpuModel) return false;
      return true;
    });

    return this.analyzeStepDurations(filteredBaseline, filteredCurrent);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUInsightsEngine,
  buildInsight,
  classifyDelta,
  groupStepsById,
  computeStepAverages
};
