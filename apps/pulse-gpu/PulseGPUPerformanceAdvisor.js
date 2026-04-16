// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUPerformanceAdvisor.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUPerformanceAdvisor — deterministic, pure-logic advisor that reads GPU session
//   memory (PulseGPUSettingsMemory), compares current sessions to known-good baselines,
//   detects regressions/improvements, and produces structured “advice objects”.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A deterministic advisor over GPU performance data
//     • A generator of structured suggestions (no side effects)
//     • v5-ready: advice objects are compatible with the self-healing layer
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
//   • NO randomness or timestamps in logic
//   • NO mutation of external state
//   • FAIL-OPEN: invalid metrics, missing baselines, or malformed data must not break logic
//   • SELF-REPAIR READY: advice objects must contain enough structure for the healing layer
//
// INTERNAL LOGIC SUMMARY (v4/v5-ready):
//   • Consumes PulseGPUSettingsMemory
//   • Produces advice objects with:
//       - type
//       - severity
//       - message
//       - deltaPercent
//       - currentScore
//       - baselineScore
//       - settings + baselineSettings
//       - extra (v5 healing metadata)
//   • Core operations:
//       - analyzeCurrentSession()
//       - analyzeSuboptimalSettings()
//       - analyzeTierUpgrade()
//       - classifyDelta()
//       - buildAdvice()
//       - validateAdvice()
//       - safeAnalyzeCurrentSession()
//
// ------------------------------------------------------
// IMPORTS
// ------------------------------------------------------

import {
  PulseGPUSettingsMemory,
  scoreSession,
  detectRegression
} from "./PulseGPUSettingsMemory.js";

// ------------------------------------------------------
// Delta classification helpers (deterministic, fail-open)
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

function isImprovement(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent > 0;
}

function isRegression(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent < 0;
}

// ------------------------------------------------------
// Advice object builder (v5-ready)
// ------------------------------------------------------

function buildAdvice({
  type,
  severity,
  message,
  deltaPercent,
  currentScore,
  baselineScore,
  gameProfile,
  hardwareProfile,
  tierProfile,
  settings,
  baselineSettings,
  extra
}) {
  const advice = {
    type,
    severity,
    message,
    meta: {
      layer: "PulseGPUPerformanceAdvisor",
      version: 4,
      target: "full-gpu",
      selfRepairable: true
    }
  };

  if (typeof deltaPercent === "number") advice.deltaPercent = deltaPercent;
  if (typeof currentScore === "number") advice.currentScore = currentScore;
  if (typeof baselineScore === "number") advice.baselineScore = baselineScore;
  if (gameProfile) advice.gameProfile = gameProfile;
  if (hardwareProfile) advice.hardwareProfile = hardwareProfile;
  if (tierProfile) advice.tierProfile = tierProfile;
  if (settings) advice.settings = settings;
  if (baselineSettings) advice.baselineSettings = baselineSettings;
  if (extra && typeof extra === "object") advice.extra = extra;

  return advice;
}

// ------------------------------------------------------
// Advice validation (for healing layer)
// ------------------------------------------------------

function validateAdvice(advice) {
  if (!advice || typeof advice !== "object") return false;
  if (typeof advice.type !== "string") return false;
  if (typeof advice.severity !== "string") return false;
  if (!advice.meta || advice.meta.layer !== "PulseGPUPerformanceAdvisor") {
    return false;
  }
  return true;
}

// ------------------------------------------------------
// PulseGPUPerformanceAdvisor (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUPerformanceAdvisor {
  constructor(settingsMemory) {
    this.memory = settingsMemory || new PulseGPUSettingsMemory();
  }

  // Static metadata for self-healing layer
  static meta = {
    layer: "PulseGPUPerformanceAdvisor",
    version: 4,
    target: "full-gpu",
    selfRepairable: true
  };

  // ----------------------------------------------------
  // Analyze a single current session vs best-known baseline
  // ----------------------------------------------------
  analyzeCurrentSession({
    gameProfile,
    hardwareProfile,
    tierProfile,
    settings,
    metrics
  }) {
    const currentScore = scoreSession(metrics);

    const baselineEntry = this.memory.getBestSettingsFor(
      gameProfile,
      hardwareProfile,
      tierProfile
    );

    if (!baselineEntry) {
      return {
        currentScore,
        baselineScore: null,
        deltaPercent: null,
        advice: []
      };
    }

    const baselineScore = baselineEntry.bestScore;
    const deltaPercent = detectRegression(metrics, baselineEntry.bestMetrics);

    const advice = [];

    if (isRegression(deltaPercent)) {
      const severity = classifyDelta(deltaPercent);

      advice.push(
        buildAdvice({
          type: "regression",
          severity,
          message:
            severity === "critical"
              ? "Performance is significantly worse than your best-known configuration."
              : "Performance is worse than your best-known configuration.",
          deltaPercent,
          currentScore,
          baselineScore,
          gameProfile,
          hardwareProfile,
          tierProfile,
          settings,
          baselineSettings: baselineEntry.settings,
          extra: {
            baselineMetrics: baselineEntry.bestMetrics,
            repairHint: "restore-baseline-settings"
          }
        })
      );
    } else if (isImprovement(deltaPercent)) {
      const severity = classifyDelta(deltaPercent);

      advice.push(
        buildAdvice({
          type: "improvement",
          severity,
          message:
            severity === "critical"
              ? "Performance is significantly better than your previous best-known configuration."
              : "Performance is better than your previous best-known configuration.",
          deltaPercent,
          currentScore,
          baselineScore,
          gameProfile,
          hardwareProfile,
          tierProfile,
          settings,
          baselineSettings: baselineEntry.settings,
          extra: {
            baselineMetrics: baselineEntry.bestMetrics,
            repairHint: "promote-current-to-baseline"
          }
        })
      );
    }

    return {
      currentScore,
      baselineScore,
      deltaPercent,
      advice
    };
  }

  // ----------------------------------------------------
  // Safe wrapper: never throws, always returns valid shape
  // ----------------------------------------------------
  safeAnalyzeCurrentSession(input) {
    try {
      const result = this.analyzeCurrentSession(input || {});
      if (
        !result ||
        typeof result !== "object" ||
        !Array.isArray(result.advice)
      ) {
        return {
          currentScore: 0,
          baselineScore: null,
          deltaPercent: null,
          advice: []
        };
      }

      const safeAdvice = result.advice.filter((a) => validateAdvice(a));
      return {
        currentScore:
          typeof result.currentScore === "number" ? result.currentScore : 0,
        baselineScore:
          typeof result.baselineScore === "number"
            ? result.baselineScore
            : null,
        deltaPercent:
          typeof result.deltaPercent === "number"
            ? result.deltaPercent
            : null,
        advice: safeAdvice
      };
    } catch {
      return {
        currentScore: 0,
        baselineScore: null,
        deltaPercent: null,
        advice: []
      };
    }
  }

  // ----------------------------------------------------
  // Suboptimal settings detection
  // ----------------------------------------------------
  analyzeSuboptimalSettings({
    gameProfile,
    hardwareProfile,
    tierProfile,
    currentSettings,
    currentMetrics
  }) {
    const baselineEntry = this.memory.getBestSettingsFor(
      gameProfile,
      hardwareProfile,
      tierProfile
    );

    if (!baselineEntry) return [];

    const currentScore = scoreSession(currentMetrics);
    const baselineScore = baselineEntry.bestScore;

    if (baselineScore <= currentScore) return [];

    const deltaPercent =
      baselineScore === 0
        ? 0
        : ((baselineScore - currentScore) / baselineScore) * 100;

    const severity = classifyDelta(deltaPercent);

    return [
      buildAdvice({
        type: "suboptimal",
        severity,
        message:
          "Your current settings are below your best-known configuration for this game and hardware.",
        deltaPercent,
        currentScore,
        baselineScore,
        gameProfile,
        hardwareProfile,
        tierProfile,
        settings: currentSettings,
        baselineSettings: baselineEntry.settings,
        extra: {
          baselineMetrics: baselineEntry.bestMetrics,
          repairHint: "suggest-baseline-settings"
        }
      })
    ];
  }

  // ----------------------------------------------------
  // Tier upgrade opportunity
  // ----------------------------------------------------
  analyzeTierUpgrade({
    gameProfile,
    hardwareProfile,
    oldTierProfile,
    newTierProfile,
    currentSettings,
    currentMetrics
  }) {
    const currentScore = scoreSession(currentMetrics);

    const newTierBaseline = this.memory.getBestSettingsFor(
      gameProfile,
      hardwareProfile,
      newTierProfile
    );

    if (!newTierBaseline) return [];

    const newTierScore = newTierBaseline.bestScore;

    if (newTierScore <= currentScore) return [];

    const deltaPercent =
      currentScore === 0
        ? 0
        : ((newTierScore - currentScore) / currentScore) * 100;

    const severity = classifyDelta(deltaPercent);

    return [
      buildAdvice({
        type: "tier-upgrade-opportunity",
        severity,
        message:
          "A higher tier configuration has historically delivered better performance for this game and hardware.",
        deltaPercent,
        currentScore,
        baselineScore: newTierScore,
        gameProfile,
        hardwareProfile,
        tierProfile: newTierProfile,
        settings: currentSettings,
        baselineSettings: newTierBaseline.settings,
        extra: {
          oldTierProfile,
          newTierProfile,
          newTierMetrics: newTierBaseline.bestMetrics,
          repairHint: "upgrade-tier"
        }
      })
    ];
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUPerformanceAdvisor,
  classifyDelta,
  buildAdvice,
  validateAdvice
};
