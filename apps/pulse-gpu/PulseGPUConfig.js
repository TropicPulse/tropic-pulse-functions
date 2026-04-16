// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUConfig.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUConfig — central configuration + policy constants for Pulse-GPU.
//   All thresholds, severity cutoffs, scoring constants, auto-opt rules,
//   and insight thresholds live here.
//
//   This file IS:
//     • A pure config module (full GPU, API-agnostic)
//     • A single source of truth for Pulse-GPU constants
//     • A dependency for advisor, restorer, insights, auto-opt, orchestrator
//     • v5-ready: includes metadata for self-repair + drift detection
//
//   This file IS NOT:
//     • A renderer
//     • A GPU runtime
//     • A WebGPU/WebGL interface
//     • A persistence layer
//     • A UI or notification system
//     • A backend module
//
// SAFETY RULES:
//   • NO DOM APIs
//   • NO WebGPU/WebGL APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • FAIL-OPEN: missing constants must not break the system
//   • SELF-REPAIR READY: constants must be reconstructable by the healing layer
//
// ------------------------------------------------------
// METADATA (v5-ready)
// ------------------------------------------------------

const PULSE_GPU_CONFIG_META = {
  layer: "PulseGPUConfig",
  version: 4,
  target: "full-gpu",
  selfRepairable: true
};

// ------------------------------------------------------
// SCORING CONSTANTS
// ------------------------------------------------------

const SCORE_CONSTANTS = {
  MAX_FPS: 240,
  MAX_STUTTERS: 1000,
  CRASH_PENALTY: 0.4,
  AVG_FPS_WEIGHT: 0.6,
  MIN_FPS_WEIGHT: 0.3,
  STUTTER_WEIGHT: 0.3,
  meta: { ...PULSE_GPU_CONFIG_META, block: "SCORE_CONSTANTS" }
};

// ------------------------------------------------------
// SEVERITY THRESHOLDS (percent deltas)
// ------------------------------------------------------

const SEVERITY_THRESHOLDS = {
  LOW: 5,
  MEDIUM: 20,
  HIGH: 40,
  CRITICAL: 40,
  meta: { ...PULSE_GPU_CONFIG_META, block: "SEVERITY_THRESHOLDS" }
};

// ------------------------------------------------------
// AUTO-OPTIMIZE DEFAULT USER PREFERENCES
// ------------------------------------------------------

const DEFAULT_USER_PREFERENCES = {
  allowAutoFixLowRegressions: false,
  allowAutoFixMediumRegressions: false,
  allowAutoFixHighRegressions: false,
  allowAutoFixCriticalRegressions: false,

  allowAutoApplyOptimalSettings: false,
  allowAutoTierChanges: false,

  meta: { ...PULSE_GPU_CONFIG_META, block: "DEFAULT_USER_PREFERENCES" }
};

// ------------------------------------------------------
// TRACE LIMITS
// ------------------------------------------------------

const TRACE_LIMITS = {
  MAX_STEPS_PER_SESSION: 500,
  MAX_DURATION_MS: 60 * 60 * 1000,
  MAX_WARNINGS: 100000,
  MAX_ERRORS: 100000,
  MAX_STUTTERS: 100000,
  MAX_VRAM_MB: 4_000_000,
  meta: { ...PULSE_GPU_CONFIG_META, block: "TRACE_LIMITS" }
};

// ------------------------------------------------------
// INSIGHT THRESHOLDS
// ------------------------------------------------------

const INSIGHT_THRESHOLDS = {
  MIN_STEP_DELTA_PERCENT: 5,
  MAX_STEP_DELTA_PERCENT: 200,
  meta: { ...PULSE_GPU_CONFIG_META, block: "INSIGHT_THRESHOLDS" }
};

// ------------------------------------------------------
// MEMORY RETENTION RULES
// ------------------------------------------------------

const MEMORY_RULES = {
  MAX_ENTRIES_PER_GAME: 50,
  MAX_ENTRIES_TOTAL: 2000,
  meta: { ...PULSE_GPU_CONFIG_META, block: "MEMORY_RULES" }
};

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PULSE_GPU_CONFIG_META,
  SCORE_CONSTANTS,
  SEVERITY_THRESHOLDS,
  DEFAULT_USER_PREFERENCES,
  TRACE_LIMITS,
  INSIGHT_THRESHOLDS,
  MEMORY_RULES
};
