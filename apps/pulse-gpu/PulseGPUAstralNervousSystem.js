// ============================================================================
// FILE: /apps/organs/gpu/PulseGPUAstralNervousSystem.js
// [pulse:gpu] PULSE_GPU_ASTRAL_NERVOUS_SYSTEM v9.1  // indigo-silver
// GPU Organ Export Layer • Pure Barrel • Zero Logic • Zero State • Zero Boot
// ============================================================================
//
// IDENTITY — THE GPU ASTRAL NERVOUS SYSTEM:
//  ----------------------------------------
//  • Defines the boundary between PulseBand (nervous system)
//    and the GPU subsystem (Brain, Runtime, Orchestrator, AutoOptimize, Healer).
//  • Pure re-export layer — exposes GPU organs without performing any work.
//  • No logic, no state, no routing, no mutation, no execution.
//  • Metadata-only identity for subsystem clarity.
//
// ROLE (v9.1):
//  • Nervous System (PulseBand) → CPU-side routing + organism logic
//  • Astral Nervous System → GPU organ boundary + subsystem identity
//  • GPU Organs → Brain, Runtime, Orchestrator, Guardian, Healer
//
// SAFETY CONTRACT:
//  • Zero compute.
//  • Zero side effects.
//  • Zero mutation.
//  • Zero async.
//  • Deterministic: same exports → same subsystem.
//  • Imports allowed ONLY because barrels must re-export.
//
// THEME:
//  • Color: Indigo-Silver (astral clarity + GPU intelligence boundary).
//  • Subtheme: Boundary, export, subsystem identity.
// ============================================================================

// --- GPU BRAIN --------------------------------------------------------------
//  ANALYST CORTEX — Precomputation, package building, deterministic logic
export * from "./PulseGPUBrain.js";

// --- GPU RUNTIME ------------------------------------------------------------
//  MOTOR CORTEX — Frame execution, state tracking, runtime metrics
export * from "./PulseGPURuntime.js";

// --- GPU AUTO-OPTIMIZE -----------------------------------------------------
//  GUARDIAN — Permission, safety, optimization, self-healing triggers
export * from "./PulseGPUGuardianCortex.js";

// --- GPU ORCHESTRATOR ------------------------------------------------------
//  BRAINSTEM — Routing, coordination, subsystem linking
export * from "./PulseGPUOrchestrator.js";

// --- GPU HEALER ------------------------------------------------------------
//  IMMUNE SYSTEM — Fault detection, recovery, stabilization
export * from "./PulseGPUHealer.js";
