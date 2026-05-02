// ============================================================================
//  PULSE GPU PERFORMANCE ADVISOR v11-Evo — THE DRIVE CENTER
//  Internal Performance Instinct • Deterministic, Pure Logic, Drift‑Proof
//  Binary-aware • Symbolic-aware • Dispatch-aware • Memory-aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseGPUDriveCenter",
  version: "v14-IMMORTAL",
  layer: "gpu_engine",
  role: "gpu_execution_engine",
  lineage: "PulseGPU-v14",

  evo: {
    gpuEngine: true,
    gpuExecution: true,
    gpuFrameExecution: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    parallelSafe: true,
    gpuSafe: true
  },

  contract: {
    always: [
      "PulseGPUDrive",
      "PulseGPUAastarMuscleSystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyGPUEngine"
    ]
  }
}
*/

import { SCORE_CONSTANTS, SEVERITY_THRESHOLDS } from "./PulseGPUCommandments.js";
import { PulseGPUGeneticMemory } from "./PulseGPUGeneticMemory.js";
import { PulseGPUSurvivalInstincts } from "./PulseGPUSurvivalInstincts.js";
import { PulseGPUEngine } from "./PulseGPUAstralMuscleSystem.js";
// ============================================================================
// DELTA CLASSIFICATION — DRIVE PRESSURE LOGIC (v11-Evo)
// ============================================================================
function classifyDelta(deltaPercent, gpuContext = null) {
  if (typeof deltaPercent !== "number" || Number.isNaN(deltaPercent)) {
    return "low";
  }

  let absDelta = Math.abs(deltaPercent);

  // v11-Evo: binary regression extra sensitivity (conceptual, deterministic)
  const binarySensitive =
    gpuContext &&
    typeof gpuContext === "object" &&
    gpuContext.binaryModeObserved === true;

  if (binarySensitive && deltaPercent < 0) {
    const extra = SEVERITY_THRESHOLDS.BINARY_REGRESSION_EXTRA_SENSITIVITY || 0;
    absDelta += extra;
  }

  if (absDelta < SEVERITY_THRESHOLDS.LOW) return "low";
  if (absDelta < SEVERITY_THRESHOLDS.MEDIUM) return "medium";
  if (absDelta < SEVERITY_THRESHOLDS.HIGH) return "high";
  return "critical";
}

function isImprovement(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent > 0;
}

function isRegression(deltaPercent) {
  return typeof deltaPercent === "number" && deltaPercent < 0;
}

// ============================================================================
// ADVICE BUILDER — Structured Drive Signals (v11-Evo)
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
  extra,
  gpuContext
}) {
  const advice = {
    type,
    severity,
    message,
    meta: {
      layer: "PulseGPUPerformanceAdvisor",
      role: "DRIVE_CENTER",
      version: "11.0-Evo",
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,
        unifiedAdvantageField: true,
        pulseSend11Ready: true,

        // v11-Evo awareness
        binaryAware: true,
        symbolicAware: true,
        gpuDispatchAware: true,
        gpuMemoryAware: true,
        gpuAdvantageAware: true,

        routingContract: "PulseSend-v11",
        gpuOrganContract: "PulseGPU-v11-Evo",
        binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
        earnCompatibility: "Earn-v3"
      }
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

  // v11-Evo GPU context injection (symbolic + binary + pattern)
  if (gpuContext && typeof gpuContext === "object") {
    advice.gpuContext = { ...gpuContext };

    if (gpuContext.gpuPattern) {
      advice.gpuPattern = gpuContext.gpuPattern;
    }
    if (gpuContext.gpuShapeSignature) {
      advice.gpuShapeSignature = gpuContext.gpuShapeSignature;
    }
    if (typeof gpuContext.binaryModeObserved === "boolean") {
      advice.binaryModeObserved = gpuContext.binaryModeObserved;
    }
    if (typeof gpuContext.symbolicModeObserved === "boolean") {
      advice.symbolicModeObserved = gpuContext.symbolicModeObserved;
    }
    if (gpuContext.gpuDispatchHints) {
      advice.gpuDispatchHints = gpuContext.gpuDispatchHints;
    }
  }

  return advice;
}

// ============================================================================
// ADVICE VALIDATION — For Immune Layer (v11-Evo)
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
// SCORING + REGRESSION DETECTION HELPERS (v11-Evo)
// ============================================================================
function scoreSession(metrics = {}) {
  if (!metrics || typeof metrics !== "object") return 0;

  const avg = metrics.avgFps || 0;
  const min = metrics.minFps || 0;
  const stutters = metrics.stutters || 0;

  const score =
    avg * SCORE_CONSTANTS.AVG_FPS_WEIGHT +
    min * SCORE_CONSTANTS.MIN_FPS_WEIGHT -
    stutters * SCORE_CONSTANTS.STUTTER_WEIGHT;

  return Math.max(0, score);
}

function detectRegression(currentMetrics = {}, baselineMetrics = {}) {
  const currentScore = scoreSession(currentMetrics);
  const baselineScore = scoreSession(baselineMetrics);

  if (baselineScore === 0) return 0;

  return ((currentScore - baselineScore) / baselineScore) * 100;
}

// ============================================================================
//  PULSE GPU PERFORMANCE ADVISOR — THE DRIVE CENTER (v11-Evo)
// ============================================================================
class PulseGPUPerformanceAdvisor {
  constructor(settingsMemory) {
    this.memory = settingsMemory || new PulseGPUGeneticMemory();
  }

  static meta = {
    layer: "PulseGPUPerformanceAdvisor",
    role: "DRIVE_CENTER",
    version: "11.0-Evo",
    target: "full-gpu",
    selfRepairable: true,
    evo: {
      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,
      unifiedAdvantageField: true,
      pulseSend11Ready: true,

      // v11-Evo awareness
      binaryAware: true,
      symbolicAware: true,
      gpuDispatchAware: true,
      gpuMemoryAware: true,
      gpuAdvantageAware: true,

      routingContract: "PulseSend-v11",
      gpuOrganContract: "PulseGPU-v11-Evo",
      binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
      earnCompatibility: "Earn-v3"
    }
  };

  // ----------------------------------------------------
  // MAIN ANALYSIS — CURRENT SESSION (v11-Evo)
  // ----------------------------------------------------
  analyzeCurrentSession({
    gameProfile,
    hardwareProfile,
    tierProfile,
    settings,
    metrics,
    gpuContext // v11-Evo GPU context
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

    // NEGATIVE PRESSURE — REGRESSION
    if (isRegression(deltaPercent)) {
      const severity = classifyDelta(deltaPercent, gpuContext);

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
          },
          gpuContext
        })
      );
    }

    // POSITIVE PRESSURE — IMPROVEMENT
    else if (isImprovement(deltaPercent)) {
      const severity = classifyDelta(deltaPercent, gpuContext);

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
          },
          gpuContext
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
  // SAFE ANALYSIS — IMMUNE LAYER ENTRYPOINT (v11-Evo)
  // ----------------------------------------------------
  safeAnalyzeCurrentSession(input, gpuContext = null) {
    try {
      const result = this.analyzeCurrentSession(
        { ...(input || {}), gpuContext },
        gpuContext
      );

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

  // ----------------------------------------------------
  // SUBOPTIMAL SETTINGS ANALYSIS (v11-Evo)
  // ----------------------------------------------------
  analyzeSuboptimalSettings({
    gameProfile,
    hardwareProfile,
    tierProfile,
    currentSettings,
    currentMetrics,
    gpuContext
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

    const severity = classifyDelta(deltaPercent, gpuContext);

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
        },
        gpuContext
      })
    ];
  }

  // ----------------------------------------------------
  // TIER UPGRADE ANALYSIS (v11-Evo)
  // ----------------------------------------------------
  analyzeTierUpgrade({
    gameProfile,
    hardwareProfile,
    oldTierProfile,
    newTierProfile,
    currentSettings,
    currentMetrics,
    gpuContext
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

    const severity = classifyDelta(deltaPercent, gpuContext);

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
        },
        gpuContext
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
  validateAdvice,
  scoreSession,
  detectRegression
};
