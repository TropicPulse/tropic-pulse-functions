// ============================================================================
//  PULSE GPU INSIGHTS ENGINE v7.3 — THE WISDOM CORTEX
//  Deterministic, Pure Logic, Drift‑Proof Analytics Over Session Traces
// ============================================================================
//
// IDENTITY — THE WISDOM CORTEX:
//  -----------------------------
//  • The interpretive cortex of the GPU organism.
//  • Observes the past (baseline traces).
//  • Studies the present (current traces).
//  • Compares them with calm, deterministic clarity.
//  • Reveals meaning — the “wisdom” already hidden in the data.
//  • No guessing. No prediction. No speculation.
//  • Pure interpretation. Pure understanding.
//  • Advantage‑cascade aware: any systemic speed/efficiency gain benefits insight flow.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Analyst        → Intelligence (precompute brain)
//  • Nerve Network  → Runtime (memory + context)
//  • Motor Hall     → Execution (motion)
//  • Guardian       → Permissions (auto-opt policy)
//  • Lymph Network  → Immune System (validation + repair)
//  • Wisdom Cortex  → Insight + Interpretation (meaning)
//
// WHAT THIS FILE IS:
//  -------------------
//  • A pure logic analytics layer (API‑agnostic, full GPU)
//  • A deterministic transformer of SessionTrace → Insight objects
//  • A generator of structured, metadata‑rich insights
//  • A safe, replayable, self‑repair‑ready wisdom engine
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer
//  • NOT a GPU runtime
//  • NOT a WebGPU/WebGL interface
//  • NOT a persistence layer
//  • NOT a backend module
//  • NOT a UI system
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail‑open: malformed traces → ignored, never crash
//  • Deterministic: same traces → same insights
//  • Self‑repair‑ready: insights include metadata
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • If pulses get faster, insight extraction conceptually accelerates.
//  • If system collapses 1000 pulses into 1, insight flow conceptually inherits that gain.
//  • No OR: any organism‑level advantage is assumed available to the cortex.
// ============================================================================

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

  if (absDelta < 5) return "low";
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
      version: 7.3,
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true
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
//  PULSE GPU INSIGHTS ENGINE — THE WISDOM CORTEX
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

      if (Math.abs(deltaPercent) < 5) continue;

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
