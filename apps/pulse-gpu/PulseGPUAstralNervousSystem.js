// ============================================================================
// FILE: /apps/organs/gpu/PulseGPUAstralNervousSystem.js
// [pulse:gpu] PULSE_GPU_ASTRAL_NERVOUS_SYSTEM v9.2  // indigo-silver
// GPU Organ Export Layer • Pure Barrel • Zero Logic • Zero State • Zero Boot
// ============================================================================
//
// IDENTITY — THE GPU ASTRAL NERVOUS SYSTEM (v9.2):
//  -----------------------------------------------
//  • Defines the boundary between PulseBand (nervous system)
//    and the GPU subsystem (Brain, Runtime, Orchestrator, Guardian, Healer).
//  • Pure re-export layer — exposes GPU organs without performing any work.
//  • No logic, no state, no routing, no mutation, no execution.
//  • Metadata-only identity for subsystem clarity.
//  • PulseSend‑2.0‑ready: single GPU export surface for the compute router.
//
// ROLE (v9.2):
//  • Nervous System (PulseBand) → CPU-side routing + organism logic
//  • Astral Nervous System → GPU organ boundary + subsystem identity
//  • GPU Organs → Brain, Runtime, Orchestrator, Guardian, Healer, Engine
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
//  Version: PulseGPUBrain v9.2 — PulseSend‑2.0‑ready, Earn-compatible
export * from "./PulseGPUBrain.js";

// --- GPU RUNTIME ------------------------------------------------------------
//  MOMENTUM NETWORK — Frame conduction, buffer setup, runtime surface
//  Version: PulseGPURuntime v9.2 — PulseSend‑2.0‑ready, Earn-compatible
export * from "./PulseGPUDrive.js";

// --- GPU ENGINE -------------------------------------------------------------
//  ASTRAL MUSCLE — WebGPU execution layer, frame conductor
//  Version: PulseGPUEngine v9.2 — PulseSend‑2.0‑ready, Earn-compatible
export * from "./PulseGPUEngine.js";

// --- GPU AUTO-OPTIMIZE -----------------------------------------------------
//  GUARDIAN CORTEX — Permission, safety, optimization, self-healing triggers
//  Version: PulseGPUGuardianCortex v9.2 (to be aligned)
export * from "./PulseGPUGuardianCortex.js";

// --- GPU ORCHESTRATOR ------------------------------------------------------
//  BRAINSTEM — Routing, coordination, subsystem linking
//  Version: PulseGPUOrchestrator v9.2 (to be aligned)
export * from "./PulseGPUSpine.js";

// --- GPU HEALER ------------------------------------------------------------
//  IMMUNE SYSTEM — Fault detection, recovery, stabilization
//  Version: PulseGPULymphNodes v9.2 (to be aligned)
export * from "./PulseGPULymphNodes.js";
