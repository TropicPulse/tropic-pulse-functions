// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUConfig.js
// LAYER: THE COMMANDMENTS — GPU-SUBSYSTEM (CONFIG + POLICY CONSTANTS)
//
// PulseGPUConfig v9.1 — Deterministic, Drift‑Proof, PulseSend‑Ready, Self‑Repair‑Ready
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
//
// SAFETY CONTRACT (v9.1):
//  -----------------------
//  • No DOM APIs
//  • No WebGPU/WebGL APIs
//  • No Node.js APIs
//  • No filesystem or network access
//  • No randomness
//  • No timestamps
//  • Fail‑open: missing constants must never break the system
//  • Self‑repair‑ready: constants must be reconstructable by healers
//  • Deterministic: same constants → same behavior across all environments
// ============================================================================

// ============================================================================
// METADATA — v9.1 COMMANDMENTS IDENTITY
// ============================================================================
const PULSE_GPU_CONFIG_META = {
  layer: "PulseGPUConfig",
  version: 9.1,
  target: "full-gpu",
  selfRepairable: true,
  doctrine: "These constants form the immutable commandments of Pulse-GPU.",
  description: "Central configuration + policy constants for Pulse-GPU.",

  evo: {
    metabolicBoost: 1.0,
    neuralReflexBoost: 1.0,
    stabilityBoost: 1.0,

    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,

    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,

    // PulseSend / Earn contracts (conceptual only)
    routingContract: "PulseSend-v1",
    gpuOrganContract: "PulseGPU-v9.1",
    earnCompatibility: "PulseEarn-v9"
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

  meta: { ...PULSE_GPU_CONFIG_META, block: "TRACE_LIMITS" }
};

// ============================================================================
// COMMANDMENT V — ONLY MEANINGFUL CHANGE SHALL BE SEEN
// ============================================================================
const INSIGHT_THRESHOLDS = {
  MIN_STEP_DELTA_PERCENT: 5,
  MAX_STEP_DELTA_PERCENT: 200,

  meta: { ...PULSE_GPU_CONFIG_META, block: "INSIGHT_THRESHOLDS" }
};

// ============================================================================
// COMMANDMENT VI — REMEMBER ONLY WHAT IS NECESSARY
// ============================================================================
const MEMORY_RULES = {
  MAX_ENTRIES_PER_GAME: 50,
  MAX_ENTRIES_TOTAL: 2000,

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
