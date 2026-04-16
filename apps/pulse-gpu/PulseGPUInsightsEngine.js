// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUInsightsEngine.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUInsightsEngine — consumes SessionTrace objects (from PulseGPUSessionTracer)
//   and produces higher-order "insight objects" about performance over time.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A deterministic analytics layer over traces
//     • A generator of structured insights for UI / reports / advisors
//     • v5-ready: insights include metadata for self-healing + replay
//
//   This file IS NOT:
//     • A renderer
//     • A GPU runtime
//     • A WebGPU/WebGL interface
//     • A persistence layer
//     • A UI or notification system
//     • A backend module
//
// DEPLOYMENT:
//   Lives in /apps/pulse-gpu as part of the GPU subsystem.
//   Must remain ESM-only and side-effect-free.
//   Must be safe to run in both browser and server environments.
//
// SAFETY RULES:
//   • NO WebGPU/WebGL APIs
//   • NO DOM APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • NO mutation of external state
//   • FAIL-OPEN: malformed traces or metrics must not break the system
//   • SELF-REPAIR READY: insights must contain enough metadata for healing/rebuild
//
// INTERNAL LOGIC SUMMARY (v4/v5-ready):
//   • Data model:
//       - SessionTrace (from PulseGPUSessionTracer)
//       - Insight:
//           {
//             type: string,
//             severity: "low" | "medium" | "high" | "critical",
//             message: string,
//             gameProfile?: object,
//             hardwareProfile?: object,
//             tierProfile?: object,
//             stepId?: string,
//             deltaPercent?: number,
//             baselineAvgDurationMs?: number,
//             currentAvgDurationMs?: number,
//             extra?: object,
//             meta: { layer, version, target }
//           }
//
//   • Core operations:
//       - analyzeStepDurations(baselineTraces, currentTraces)
//       - groupStepsById(traces)
//       - computeStepAverages(group)
//       - classifyDelta(deltaPercent)
//       - buildInsight(...)
//
// ------------------------------------------------------
// IMPORTS (types / structure only; no runtime coupling required)
// ------------------------------------------------------

import { SessionTrace } from "./PulseGPUSessionTracer.js";

// ------------------------------------------------------
// Utility: clamp
// ------------------------------------------------------

function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// ------------------------------------------------------
// Delta classification helpers (fail-open)
// ------------------------------------------------------

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

// ------------------------------------------------------
// Insight builder (v5-ready)
// ------------------------------------------------------

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
      version: 4,
      target: "full-gpu"
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

// ------------------------------------------------------
// Group steps by stepId across traces (fail-open)
// ------------------------------------------------------

function groupStepsById(traces = []) {
  const groups = new Map(); // stepId -> { durations: number[], metaSamples: object[] }

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

// ------------------------------------------------------
// Compute average duration per step group
// ------------------------------------------------------

function computeStepAverages(groups) {
  const result = new Map(); // stepId -> { avgDurationMs, sampleCount, sampleMeta }

  for (const [stepId, group] of groups.entries()) {
    const durations = group.durations;
    if (!durations || durations.length === 0) continue;

    let sum = 0;
    durations.forEach((d) => {
      sum += d;
    });

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

// ------------------------------------------------------
// PulseGPUInsightsEngine (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUInsightsEngine {
  constructor() {}

  // ----------------------------------------------------
  // Analyze step duration changes between two sets of traces
  // ----------------------------------------------------
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

      if (Math.abs(deltaPercent) < 5) {
        continue;
      }

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

  // ----------------------------------------------------
  // Convenience: analyze a single game/hardware filter
  // ----------------------------------------------------
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

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUInsightsEngine,
  buildInsight,
  classifyDelta,
  groupStepsById,
  computeStepAverages
};
