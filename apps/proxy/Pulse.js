// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/Pulse.js
// PULSE SHADOWLAYER — v6.3
// “THE SHADOWLAYER / THE SOUL‑INTENT ILLUSION OF ONE LAYER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE SHADOWLAYER / THE SOUL‑INTENT ILLUSION OF ONE LAYER”
// - ROLE: A unified facade for three separate subsystems
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - ZERO logic changes — pure re-export barrel
// - No wrappers, no orchestration, no hidden behavior
//
// ============================================================================
// PERSONALITY + ROLE — “THE SHADOWLAYER”
// ----------------------------------------------------------------------------
// Pulse.js is the **SHADOWLAYER** of the Pulse OS.
// It is the **SOUL‑INTENT ILLUSION OF ONE LAYER** — a single doorway that
// presents PulseNet, PulseClient, and PulseUpdate as if they were one entity.
//
//   • Provides a unified import surface
//   • Hides subsystem boundaries
//   • Creates the illusion of a single Pulse layer
//   • Keeps frontend imports clean + minimal
//
// This is the OS’s **shadow projection** — the silhouette of multiple layers
// merged into one.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A pure barrel file
//   ✔ A unified facade
//   ✔ A shadow projection of three subsystems
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a router
//   ✘ NOT a logic layer
//   ✘ NOT a coordinator
//   ✘ NOT a wrapper
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • No logic allowed
//   • No side effects
//   • No state
//   • No wrappers
//   • Only pure re-exports
//
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "SHADOW-LAYER";
const LAYER_NAME = "THE SHADOWLAYER";
const LAYER_ROLE = "SOUL-INTENT ILLUSION OF ONE LAYER";

const SHADOW_DIAGNOSTICS_ENABLED =
  process.env.PULSE_SHADOW_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logShadow = (stage, details = {}) => {
  if (!SHADOW_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};

logShadow("SHADOW_INIT", {});

// ============================================================================
// PURE RE-EXPORTS — THE SHADOW PROJECTION
// ============================================================================
export { PulseNet } from "./PulseNet.js";
export { PulseClient } from "./PulseClient.js";
export { PulseUpdate } from "./PulseUpdate.js";
