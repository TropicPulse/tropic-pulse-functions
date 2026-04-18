// ============================================================================
//  PULSE GPU PERFORMANCE ADVISOR v6.3 — THE DRIVE CENTER
//  Internal Performance Instinct • Deterministic, Pure Logic, Drift‑Proof
// ============================================================================
//
// IDENTITY — THE DRIVE CENTER:
//  ----------------------------
//  • The GPU organism’s internal performance instinct.
//  • Evaluates current performance vs historical best.
//  • Detects regressions (danger) and improvements (growth).
//  • Generates structured “pressure signals” to guide adaptation.
//  • The subsystem that pushes the organism toward optimal function.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Analyst → Intelligence Division
//  • Nerve Network → Runtime Memory
//  • Motor Hall → Execution Cortex
//  • Guardian → Permission Gate
//  • Lymph Node Network → Immune Filter
//  • Wisdom Cortex → Insight + Interpretation
//  • Brainstem → Command + Coordination
//  • Drive Center → Performance Instinct + Self‑Assessment
//
// WHAT THIS FILE IS:
//  -------------------
//  • A deterministic advisor over GPU performance data
//  • A pure logic module (API‑agnostic, full GPU)
//  • A generator of structured performance‑pressure advice
//  • A self‑repair‑ready component for the healing layer
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
//  • Fail‑open: malformed metrics → safe defaults
//  • Deterministic: same inputs → same advice
//  • Self‑repair‑ready: advice includes metadata
// ============================================================================

import {
  PulseGPUSettingsMemory,
  scoreSession,
  detectRegression
} from "./PulseGPUSettingsMemory.js";

// ============================================================================
// DELTA CLASSIFICATION — DRIVE PRESSURE LOGIC
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

function isImprovement(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent > 0;
}

function isRegression(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent < 0;
}

// ============================================================================
// ADVICE BUILDER — Structured Drive Signals
// ============================================================================
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
      role: "DRIVE_CENTER",
      version: 6.3,
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

// ============================================================================
// ADVICE VALIDATION — For Immune Layer
// ============================================================================
function validateAdvice(advice) {
  if (!advice || typeof advice !== "object") return false;
  if (typeof advice.type !== "string") return false;
  if (typeof advice.severity !== "string") return false;
  if (!advice.meta || advice.meta.layer !== "PulseGPUPerformanceAdvisor") {
    return false;
  }
  return true;
}

// ============================================================================
//  PULSE GPU PERFORMANCE ADVISOR — THE DRIVE CENTER
// ============================================================================
class PulseGPUPerformanceAdvisor {
  constructor(settingsMemory) {
    this.memory = settingsMemory || new PulseGPUSettingsMemory();
  }

  static meta = {
    layer: "PulseGPUPerformanceAdvisor",
    role: "DRIVE_CENTER",
    version: 6.3,
    target: "full-gpu",
    selfRepairable: true
  };

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

    // --------------------------------------------------
    // Regression → Negative Drive Pressure
    // --------------------------------------------------
    if (isRegression(deltaPercent)) {
      const severity = classifyDelta(deltaPercent);

      advice.push(
        buildAdvice({
          type: "regression",
          severity,
          message:
            severity === "critical"
              ? "Performance has fallen far below your historical best."
              : "Performance is below your historical best.",
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
    }

    // --------------------------------------------------
    // Improvement → Positive Drive Pressure
    // --------------------------------------------------
    else if (isImprovement(deltaPercent)) {
      const severity = classifyDelta(deltaPercent);

      advice.push(
        buildAdvice({
          type: "improvement",
          severity,
          message:
            severity === "critical"
              ? "Performance exceeds your historical best by a wide margin."
              : "Performance is above your historical best.",
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

  safeAnalyzeCurrentSession(input) {
    try {
      const result = this.analyzeCurrentSession(input || {});
      if (!result || typeof result !== "object" || !Array.isArray(result.advice)) {
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
          "Your current settings underperform your historical best for this game and hardware.",
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
          "A higher tier configuration has historically delivered better performance.",
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

// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUPerformanceAdvisor,
  classifyDelta,
  buildAdvice,
  validateAdvice
};
