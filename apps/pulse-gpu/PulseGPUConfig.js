// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUConfig.js
// LAYER: THE COMMANDMENTS — GPU-SUBSYSTEM (CONFIG + POLICY CONSTANTS)
//
// PulseGPUConfig v6.3 — Deterministic, Drift‑Proof, Self‑Repair‑Ready
// PURE CONFIG. NO GPU. NO DOM. NO NODE. NO SIDE EFFECTS.
// ============================================================================
//
// IDENTITY — THE COMMANDMENTS:
//  ----------------------------
//  • The immutable doctrine of the GPU subsystem.
//  • The unbreakable rules that govern all GPU behavior.
//  • The law interpreted by Advisor, enforced by Guardian, restored by Healer.
//  • The foundation upon which the Shadow Engine operates.
//  • The single source of truth for all GPU constants.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The canonical rulebook for Pulse-GPU.
//  • A pure configuration module (API‑agnostic, full‑GPU ready).
//  • A dependency for advisor, restorer, insights, auto-opt, orchestrator.
//  • A stable, deterministic policy surface for the GPU subsystem.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer.
//  • NOT a GPU runtime.
//  • NOT a WebGPU/WebGL interface.
//  • NOT a persistence layer.
//  • NOT a UI or notification system.
//  • NOT a backend module.
//  • NOT a compute engine.
//
// SAFETY CONTRACT:
//  ----------------
//  • No DOM APIs.
//  • No WebGPU/WebGL APIs.
//  • No Node.js APIs.
//  • No filesystem or network access.
//  • No randomness.
//  • No timestamps.
//  • Fail‑open: missing constants must never break the system.
//  • Self‑repair‑ready: constants must be reconstructable by healers.
//  • Deterministic: same constants → same behavior across all environments.
// ============================================================================
// METADATA (v6-ready)
// ============================================================================

const PULSE_GPU_CONFIG_META = {
  layer: "PulseGPUConfig",
  version: 6.3,
  target: "full-gpu",
  selfRepairable: true,
  doctrine: "These constants form the immutable commandments of Pulse-GPU.",
  description: "Central configuration + policy constants for Pulse-GPU."
};

// ============================================================================
// SCORING CONSTANTS — COMMANDMENT I: PERFORMANCE TRUTH
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
// SEVERITY THRESHOLDS — COMMANDMENT II: KNOW THE DEGREE OF FAILURE
// ============================================================================
const SEVERITY_THRESHOLDS = {
  LOW: 5,
  MEDIUM: 20,
  HIGH: 40,
  CRITICAL: 40,

  meta: { ...PULSE_GPU_CONFIG_META, block: "SEVERITY_THRESHOLDS" }
};

// ============================================================================
// AUTO-OPTIMIZE DEFAULT USER PREFERENCES
// COMMANDMENT III: USER WILL ABOVE ALL
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
// TRACE LIMITS — COMMANDMENT IV: NO SESSION SHALL GROW WITHOUT BOUND
// ============================================================================
const TRACE_LIMITS = {
  MAX_STEPS_PER_SESSION: 500,
  MAX_DURATION_MS: 60 * 60 * 1000, // 1 hour
  MAX_WARNINGS: 100000,
  MAX_ERRORS: 100000,
  MAX_STUTTERS: 100000,
  MAX_VRAM_MB: 4_000_000,

  meta: { ...PULSE_GPU_CONFIG_META, block: "TRACE_LIMITS" }
};

// ============================================================================
// INSIGHT THRESHOLDS — COMMANDMENT V: ONLY MEANINGFUL CHANGE SHALL BE SEEN
// ============================================================================
const INSIGHT_THRESHOLDS = {
  MIN_STEP_DELTA_PERCENT: 5,
  MAX_STEP_DELTA_PERCENT: 200,

  meta: { ...PULSE_GPU_CONFIG_META, block: "INSIGHT_THRESHOLDS" }
};

// ============================================================================
// MEMORY RULES — COMMANDMENT VI: REMEMBER ONLY WHAT IS NECESSARY
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
