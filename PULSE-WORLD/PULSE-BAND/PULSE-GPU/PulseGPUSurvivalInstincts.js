// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-GPU/PulseGPUSurvivalInstincts.js
// PULSE GPU SURVIVAL INSTINCTS v12.3-Evo-binary-Prime — THE EVOLUTION CORE
// Adaptive Identity Layer • Genetic Memory • Best‑Self Preservation Engine
// ============================================================================
//
// SAFETY CONTRACT (v12.3-Evo-binary-Prime):
//  ----------------------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: malformed metrics/settings → safe defaults
//  • Self-repair-ready: entries include OS metadata
//  • Deterministic: same inputs → same evolutionary memory
//  • Legacy-safe: v10.4/v11 callers still behave identically
// ============================================================================

import { SCORE_CONSTANTS } from "./PulseGPUCommandments.js";

// ------------------------------------------------------------
// ⭐ OS‑v12.3-Evo-binary-Prime CONTEXT METADATA — Survival Instincts Identity
// ------------------------------------------------------------
const SURVIVAL_CONTEXT = {
  layer: "PulseGPUSurvivalInstincts",
  role: "EVOLUTION_CORE",
  purpose:
    "Adaptive identity + genetic memory for GPU configs + scoring + dual-mode pressure-aware evolution",
  context:
    "Stores best-known configs, metrics, traces, mode/pressure stats, and supports regression detection",
  target: "full-gpu+binary",
  version: "12.3-Evo-binary-Prime",
  selfRepairable: true,

  evo: {
    // Advantage cascade
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,

    // Dual-band + organism awareness
    dualBandAware: true,
    binaryAware: true,
    symbolicAware: true,
    dualModeEvolution: true,
    gpuSpineAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,
    geneticMemoryAware: true,
    sessionTracerAware: true,
    pressureAware: true,

    // Prewarm / best-self hooks
    prewarmReady: true,
    bestSelfSelectionReady: true,
    configScoringReady: true,

    // PulseSend / Earn contracts (current + legacy, conceptual only)
    pulseSend12Ready: true,
    routingContract: "PulseSend-v12",
    gpuOrganContract: "PulseGPU-v12-Evo",
    binaryGpuOrganContract: "PulseBinaryGPU-v12-Evo",
    earnCompatibility: "Earn-v4",

    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};

// ------------------------------------------------------------
// Utility: stable JSON stringify for hashing
// ------------------------------------------------------------
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }

  const keys = Object.keys(value).sort();
  const parts = keys.map(
    (k) => JSON.stringify(k) + ":" + stableStringify(value[k])
  );
  return "{" + parts.join(",") + "}";
}

// ------------------------------------------------------------
// Utility: simple deterministic hash
// ------------------------------------------------------------
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}

// ------------------------------------------------------------
// Settings hash — Genetic Fingerprint
// ------------------------------------------------------------
function computeSettingsHash(settings) {
  const serialized = stableStringify(settings || {});
  return simpleHash(serialized);
}

// ------------------------------------------------------------
// Session scoring — Evolutionary Fitness Score (v12.3 dual-band + pressure)
// ------------------------------------------------------------
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Base v10.4/v11-compatible score (FPS + stutters + crash)
function baseScoreSession(metrics = {}) {
  if (!metrics || typeof metrics !== "object") return 0;

  // v10.4 compatibility: accept both camelCase and legacy keys
  const {
    avgFPS,
    minFPS,
    stutterCount,
    crashFlag = false
  } = metrics;

  const avg = typeof metrics.avgFps === "number" ? metrics.avgFps : avgFPS || 0;
  const min = typeof metrics.minFps === "number" ? metrics.minFps : minFPS || 0;
  const stutters =
    typeof metrics.stutters === "number" ? metrics.stutters : stutterCount || 0;

  const safeAvg = clamp(avg, 0, SCORE_CONSTANTS.MAX_FPS);
  const safeMin = clamp(min, 0, SCORE_CONSTANTS.MAX_FPS);
  const safeStutters = clamp(stutters, 0, SCORE_CONSTANTS.MAX_STUTTERS);

  const avgScore = safeAvg / SCORE_CONSTANTS.MAX_FPS;
  const minScore = safeMin / SCORE_CONSTANTS.MAX_FPS;
  const stutterPenalty = safeStutters / SCORE_CONSTANTS.MAX_STUTTERS;

  let score =
    SCORE_CONSTANTS.AVG_FPS_WEIGHT * avgScore +
    SCORE_CONSTANTS.MIN_FPS_WEIGHT * minScore -
    SCORE_CONSTANTS.STUTTER_WEIGHT * stutterPenalty;

  if (crashFlag) score -= SCORE_CONSTANTS.CRASH_PENALTY;

  return clamp(score, 0, 1);
}

// Extract mode + pressure stats from trace / traceSummary / pressureSnapshot
function extractModeAndPressureStats({
  trace,
  traceSummary,
  pressureSnapshot,
  binaryMode
} = {}) {
  let binaryStepCount = 0;
  let symbolicStepCount = 0;

  // Prefer explicit traceSummary (from SessionTracer)
  if (traceSummary && typeof traceSummary === "object") {
    if (typeof traceSummary.binaryStepCount === "number") {
      binaryStepCount = clamp(traceSummary.binaryStepCount, 0, 1_000_000);
    }
    if (typeof traceSummary.symbolicStepCount === "number") {
      symbolicStepCount = clamp(traceSummary.symbolicStepCount, 0, 1_000_000);
    }
  } else if (Array.isArray(trace)) {
    // Fallback: infer from steps (SessionTracer steps)
    trace.forEach((step) => {
      if (!step || typeof step !== "object") return;
      if (step.binaryModeObserved) binaryStepCount += 1;
      if (step.symbolicModeObserved) symbolicStepCount += 1;
    });
  }

  const totalSteps = binaryStepCount + symbolicStepCount;
  const binaryRatio = totalSteps > 0 ? binaryStepCount / totalSteps : 0;
  const symbolicRatio = totalSteps > 0 ? symbolicStepCount / totalSteps : 0;

  // Pressure snapshot: prefer explicit, else from traceSummary
  const p =
    pressureSnapshot ||
    (traceSummary && traceSummary.pressureSnapshot) ||
    null;

  let gpuLoadPressure = 0;
  let thermalPressure = 0;
  let memoryPressure = 0;
  let meshStormPressure = 0;
  let auraTension = 0;

  if (p && typeof p === "object") {
    gpuLoadPressure = clamp(p.gpuLoadPressure ?? 0, 0, 1);
    thermalPressure = clamp(p.thermalPressure ?? gpuLoadPressure, 0, 1);
    memoryPressure = clamp(p.memoryPressure ?? 0, 0, 1);
    meshStormPressure = clamp(p.meshStormPressure ?? 0, 0, 1);
    auraTension = clamp(p.auraTension ?? 0, 0, 1);
  }

  const pressureScore =
    (gpuLoadPressure +
      thermalPressure +
      memoryPressure +
      meshStormPressure +
      auraTension) / 5;

  return {
    binaryStepCount,
    symbolicStepCount,
    binaryRatio,
    symbolicRatio,
    pressureScore,
    binaryMode: binaryMode || "auto"
  };
}

// v12.3 score: base FPS score + dual-band + pressure shaping
function scoreSession(metrics = {}, options = {}) {
  const baseScore = baseScoreSession(metrics);

  const {
    trace,
    traceSummary,
    pressureSnapshot,
    binaryMode
  } = options || {};

  const modeStats = extractModeAndPressureStats({
    trace,
    traceSummary,
    pressureSnapshot,
    binaryMode
  });

  const { binaryRatio, symbolicRatio, pressureScore } = modeStats;

  // Dual-band shaping:
  //  • Reward balanced dual-mode slightly.
  //  • Reward stable binary usage if requested.
  //  • Penalize high pressure.
  const dualBalance = 1 - Math.abs(binaryRatio - symbolicRatio); // 1 when balanced
  const dualBonus = 0.05 * dualBalance; // up to +0.05

  const binaryBiasBonus =
    binaryMode === "binary" ? 0.05 * binaryRatio : 0; // up to +0.05 when strongly binary

  const pressurePenalty = 0.15 * pressureScore; // up to -0.15 at max pressure

  let score = baseScore + dualBonus + binaryBiasBonus - pressurePenalty;

  return clamp(score, 0, 1);
}

// ------------------------------------------------------------
// Regression detection — Evolutionary Delta (mode/pressure-aware wrapper)
// ------------------------------------------------------------
function detectRegression(currentMetrics, baselineMetrics, options = {}) {
  const currentScore = scoreSession(currentMetrics, options.current || {});
  const baselineScore = scoreSession(baselineMetrics, options.baseline || {});

  if (baselineScore === 0) return 0;

  const delta = (currentScore - baselineScore) / baselineScore;
  return delta * 100;
}

// ------------------------------------------------------------
// Key building helpers — Genetic Indexing (v12.3 execution-aware)
// ------------------------------------------------------------
function buildGameKey(gameProfile = {}) {
  const { gameId = "unknown", buildVersion = "", contentHash = "" } =
    gameProfile;
  return stableStringify({ gameId, buildVersion, contentHash });
}

function buildHardwareKey(hardwareProfile = {}) {
  const {
    gpuModel = "unknown",
    driverVersion = "",
    vramMB = 0,
    cpuModel = "",
    ramMB = 0
  } = hardwareProfile;

  return stableStringify({
    gpuModel,
    driverVersion,
    vramMB,
    cpuModel,
    ramMB
  });
}

function buildTierKey(tierProfile = {}) {
  const { tierId = "default" } = tierProfile;
  return stableStringify({ tierId });
}

// Execution context fingerprint (aligned with GeneticMemory / SessionTracer)
function buildExecutionContextKey(executionContext = null) {
  if (!executionContext || typeof executionContext !== "object") {
    return stableStringify(null);
  }

  const {
    binaryMode = "auto", // "auto" | "binary" | "non-binary" | "dual"
    pipelineId = "",
    sceneType = "",
    workloadClass = "",
    resolution = "",
    refreshRate = 0,
    dispatchSignature = "",
    shapeSignature = ""
  } = executionContext;

  return stableStringify({
    binaryMode,
    pipelineId,
    sceneType,
    workloadClass,
    resolution,
    refreshRate,
    dispatchSignature,
    shapeSignature
  });
}

// v12.3 composite key: game + hardware + tier + settings + mode + execution
function buildCompositeKey(
  gameProfile,
  hardwareProfile,
  tierProfile,
  settingsHash,
  binaryMode,
  executionContext // optional, may be undefined for legacy callers
) {
  const gameKey = buildGameKey(gameProfile);
  const hwKey = buildHardwareKey(hardwareProfile);
  const tierKey = buildTierKey(tierProfile || {});
  const execKey = buildExecutionContextKey(executionContext || null);

  const base = stableStringify({
    gameKey,
    hwKey,
    tierKey,
    settingsHash,
    binaryMode: binaryMode || "auto",
    executionContext: execKey
  });

  return simpleHash(base);
}

// ------------------------------------------------------------
// Memory entry model — Evolutionary Record (v12.3 dual-band + pressure-aware)
// ------------------------------------------------------------
class PulseGPUSurvivalInstinctsStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...SURVIVAL_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  // v12.3: accepts optional traceSummary, pressureSnapshot, executionContext
  recordSession({
    gameProfile,
    hardwareProfile,
    tierProfile,
    settings,
    metrics,
    trace,
    traceSummary,
    pressureSnapshot,
    binaryMode = "auto", // "auto" | "binary" | "non-binary" | "dual"
    executionContext = null // optional, observational
  }) {
    const settingsHash = computeSettingsHash(settings);

    const key = buildCompositeKey(
      gameProfile,
      hardwareProfile,
      tierProfile,
      settingsHash,
      binaryMode,
      executionContext
    );

    const modeStats = extractModeAndPressureStats({
      trace,
      traceSummary,
      pressureSnapshot,
      binaryMode
    });

    const score = scoreSession(metrics, {
      trace,
      traceSummary,
      pressureSnapshot,
      binaryMode
    });

    const existing = this.entries.get(key);

    if (!existing || score > existing.bestScore) {
      const entry = {
        key,
        gameProfile: gameProfile || {},
        hardwareProfile: hardwareProfile || {},
        tierProfile: tierProfile || {},
        settingsHash,
        settings: settings || {},
        bestMetrics: metrics || {},
        bestScore: score,
        bestTrace: Array.isArray(trace) ? trace.slice() : null,
        traceSummary: traceSummary || null,
        binaryMode,
        executionContext: executionContext || null,
        modeStats,
        pressureScore: modeStats.pressureScore,
        meta: { ...SURVIVAL_CONTEXT }
      };
      this.entries.set(key, entry);
    }

    return this.entries.get(key);
  }

  // v12.3: best-self selection, with optional binaryMode + executionContext hints
  getBestSettingsFor(
    gameProfile,
    hardwareProfile,
    tierProfile,
    opts = {}
  ) {
    const gameKey = buildGameKey(gameProfile);
    const hwKey = buildHardwareKey(hardwareProfile);
    const tierKey = tierProfile ? buildTierKey(tierProfile) : null;
    const preferredBinaryMode = opts.binaryMode || null;

    let bestEntry = null;

    for (const entry of this.entries.values()) {
      if (buildGameKey(entry.gameProfile) !== gameKey) continue;
      if (buildHardwareKey(entry.hardwareProfile) !== hwKey) continue;
      if (tierKey && buildTierKey(entry.tierProfile) !== tierKey) continue;

      if (
        preferredBinaryMode &&
        entry.binaryMode &&
        entry.binaryMode !== preferredBinaryMode
      ) {
        continue;
      }

      if (!bestEntry || entry.bestScore > bestEntry.bestScore) {
        bestEntry = entry;
      }
    }

    return bestEntry;
  }

  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }

  deserialize(jsonString) {
    this.entries.clear();
    if (!jsonString) return;

    let arr;
    try {
      arr = JSON.parse(jsonString);
    } catch {
      return;
    }

    if (!Array.isArray(arr)) return;

    arr.forEach((entry) => {
      if (!entry || typeof entry !== "object" || !entry.key) return;

      const modeStats = entry.modeStats || {};
      const pressureScore =
        typeof entry.pressureScore === "number"
          ? clamp(entry.pressureScore, 0, 1)
          : 0;

      const safeEntry = {
        key: entry.key,
        gameProfile: entry.gameProfile || {},
        hardwareProfile: entry.hardwareProfile || {},
        tierProfile: entry.tierProfile || {},
        settingsHash: entry.settingsHash || "",
        settings: entry.settings || {},
        bestMetrics: entry.bestMetrics || {},
        bestScore:
          typeof entry.bestScore === "number" ? entry.bestScore : 0,
        bestTrace: Array.isArray(entry.bestTrace) ? entry.bestTrace : null,
        traceSummary: entry.traceSummary || null,
        binaryMode: entry.binaryMode || "auto",
        executionContext: entry.executionContext || null,
        modeStats: {
          binaryStepCount: modeStats.binaryStepCount || 0,
          symbolicStepCount: modeStats.symbolicStepCount || 0,
          binaryRatio: modeStats.binaryRatio || 0,
          symbolicRatio: modeStats.symbolicRatio || 0,
          pressureScore
        },
        pressureScore,
        meta: { ...SURVIVAL_CONTEXT }
      };

      this.entries.set(safeEntry.key, safeEntry);
    });
  }
}

// ------------------------------------------------------------
// Public API wrapper — Evolution Core Surface (v12.3)
// ------------------------------------------------------------
class PulseGPUSurvivalInstincts {
  constructor() {
    this.store = new PulseGPUSurvivalInstinctsStore();
    this.meta = { ...SURVIVAL_CONTEXT };
  }

  recordSession(session) {
    return this.store.recordSession(session || {});
  }

  getBestSettingsFor(gameProfile, hardwareProfile, tierProfile, opts) {
    return this.store.getBestSettingsFor(
      gameProfile,
      hardwareProfile,
      tierProfile,
      opts || {}
    );
  }

  // v12.3: regression detection can accept mode/pressure-aware options
  detectRegression(currentMetrics, baselineMetrics, options) {
    return detectRegression(currentMetrics, baselineMetrics, options || {});
  }

  // v12.3: expose full dual-band + pressure-aware score
  scoreSession(metrics, options) {
    return scoreSession(metrics || {}, options || {});
  }

  serialize() {
    return this.store.serialize();
  }

  deserialize(jsonString) {
    this.store.deserialize(jsonString);
  }

  clear() {
    this.store.clear();
  }
}

// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseGPUSurvivalInstincts,
  computeSettingsHash,
  scoreSession,
  detectRegression
};
