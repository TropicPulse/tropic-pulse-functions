// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-GPU/PulseGPUConfig.js
// LAYER: THE COMMANDMENTS — GPU-SUBSYSTEM (CONFIG + POLICY CONSTANTS)
//
// PulseGPUConfig v12-Evo-Presence-Max — Deterministic, Drift‑Proof, PulseSend‑Ready, Self‑Repair‑Ready
// PURE CONFIG. NO GPU. NO DOM. NO NODE. NO SIDE EFFECTS.
// ============================================================================
//
// IDENTITY — THE COMMANDMENTS:
//  ----------------------------
//  • The immutable doctrine of the GPU subsystem.
//  • The unbreakable rules that govern all GPU behavior.
//  • The law interpreted by Advisor, enforced by Guardian, restored by Healer.
//  • The foundation upon which the entire GPU organism operates.
//  • The single source of truth for all GPU constants.
//  • PulseSend/Earn‑aligned: contracts are explicit, but conceptual only.
//  • Binary-aware, symbolic-aware, dispatch-aware, memory-aware, presence-aware.
// ============================================================================

// ============================================================================
// METADATA — v12-Evo-Presence-Max COMMANDMENTS IDENTITY
// ============================================================================
const PULSE_GPU_CONFIG_META = {
  layer: "PulseGPUConfig",
  version: "12.0-Evo-Presence-Max",
  target: "full-gpu",
  selfRepairable: true,
  doctrine: "These constants form the immutable commandments of Pulse-GPU.",
  description: "Central configuration + policy constants for Pulse-GPU.",

  evo: {
    metabolicBoost: 1.2,
    neuralReflexBoost: 1.2,
    stabilityBoost: 1.3,

    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,

    dualModeEvolution: true,
    organismClusterBoost: 1.1,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,

    // v12 Presence Evolution
    presenceAware: true,
    dnaAware: true,
    versionAware: true,
    instanceAware: true,

    // GPU awareness
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,

    // PulseSend / Earn contracts (conceptual only)
    routingContract: "PulseSend-v12",
    gpuOrganContract: "PulseGPU-v12-Evo-Presence-Max",
    binaryGpuOrganContract: "PulseBinaryGPU-v12-Evo-Presence-Max",
    earnCompatibility: "Earn-v4-Presence"
  }
};

// ============================================================================
// COMMANDMENT I — PERFORMANCE TRUTH
// ============================================================================
const SCORE_CONSTANTS = {
  MAX_FPS: 240,
  MAX_STUTTERS: 1000,
  CRASH_PENALTY: 0.4,

  AVG_FPS_WEIGHT: 0.6,
  MIN_FPS_WEIGHT: 0.3,
  STUTTER_WEIGHT: 0.3,

  // v12-Evo: binary/symbolic scoring hints (conceptual only)
  BINARY_MODE_BONUS: 0.06,
  STABILITY_FIELD_WEIGHT: 0.12,

  meta: { ...PULSE_GPU_CONFIG_META, block: "SCORE_CONSTANTS" }
};

// ============================================================================
// COMMANDMENT II — KNOW THE DEGREE OF FAILURE
// ============================================================================
const SEVERITY_THRESHOLDS = {
  LOW: 5,
  MEDIUM: 20,
  HIGH: 40,
  CRITICAL: 40,

  // v12-Evo: optional GPU-aware modifiers (conceptual only)
  BINARY_REGRESSION_EXTRA_SENSITIVITY: 5,

  meta: { ...PULSE_GPU_CONFIG_META, block: "SEVERITY_THRESHOLDS" }
};

// ============================================================================
// COMMANDMENT III — USER WILL ABOVE ALL
// ============================================================================
const DEFAULT_USER_PREFERENCES = {
  allowAutoFixLowRegressions: false,
  allowAutoFixMediumRegressions: false,
  allowAutoFixHighRegressions: false,
  allowAutoFixCriticalRegressions: false,

  allowAutoApplyOptimalSettings: false,
  allowAutoTierChanges: false,

  // v12-Evo: binary/symbolic preference flags (conceptual only)
  preferBinaryStablePaths: true,
  allowSymbolicFallbackOnInstability: true,

  // v12-Evo: presence / identity preferences (conceptual only)
  allowPerDevicePresenceTuning: true,
  allowPerInstanceProfiles: true,

  meta: { ...PULSE_GPU_CONFIG_META, block: "DEFAULT_USER_PREFERENCES" }
};

// ============================================================================
// COMMANDMENT IV — NO SESSION SHALL GROW WITHOUT BOUND
// ============================================================================
const TRACE_LIMITS = {
  MAX_STEPS_PER_SESSION: 500,
  MAX_DURATION_MS: 60 * 60 * 1000,
  MAX_WARNINGS: 100000,
  MAX_ERRORS: 100000,
  MAX_STUTTERS: 100000,
  MAX_VRAM_MB: 4_000_000,

  // v12-Evo: dispatch/memory trace hints (conceptual only)
  MAX_DISPATCH_HISTORY: 2000,
  MAX_BINARY_PATTERN_HISTORY: 512,

  meta: { ...PULSE_GPU_CONFIG_META, block: "TRACE_LIMITS" }
};

// ============================================================================
// COMMANDMENT V — ONLY MEANINGFUL CHANGE SHALL BE SEEN
// ============================================================================
const INSIGHT_THRESHOLDS = {
  MIN_STEP_DELTA_PERCENT: 5,
  MAX_STEP_DELTA_PERCENT: 200,

  // v12-Evo: GPU pattern/dispatch insight thresholds (conceptual only)
  MIN_DISPATCH_PATTERN_DELTA_PERCENT: 3,

  meta: { ...PULSE_GPU_CONFIG_META, block: "INSIGHT_THRESHOLDS" }
};

// ============================================================================
// COMMANDMENT VI — REMEMBER ONLY WHAT IS NECESSARY
// ============================================================================
const MEMORY_RULES = {
  MAX_ENTRIES_PER_GAME: 50,
  MAX_ENTRIES_TOTAL: 2000,

  // v12-Evo: GPU memory / dispatch memory rules (conceptual only)
  MAX_GPU_MEMORY_SNAPSHOTS: 256,
  MAX_GPU_DISPATCH_HINT_SETS: 256,

  meta: { ...PULSE_GPU_CONFIG_META, block: "MEMORY_RULES" }
};

// ============================================================================
// EXPORTS — THE COMMANDMENTS MADE PUBLIC
// ============================================================================
export {
  PULSE_GPU_CONFIG_META,
  SCORE_CONSTANTS,
  SEVERITY_THRESHOLDS,
  DEFAULT_USER_PREFERENCES,
  TRACE_LIMITS,
  INSIGHT_THRESHOLDS,
  MEMORY_RULES
};
