// ======================================================
//  PULSE OS v6.3 — THE LIMBIC SHADOW
//  Unified Projection Layer • Subsystem Silhouette • Meta‑Facade
//  PURE FACADE. NO LOGIC. NO STATE. NO SIDE‑EFFECTS.
// ======================================================
//
// IDENTITY — THE LIMBIC SHADOW (UNIFIED PROJECTION):
//  --------------------------------------------------
//  • The illusion of a single Pulse layer.
//  • A merged silhouette of PulseNet, PulseClient, and PulseUpdate.
//  • Provides a unified import surface for the entire frontend.
//  • Hides subsystem boundaries behind a single conceptual doorway.
//  • Acts as the OS’s “shadow projection” — a functional meta‑layer.
//  • Simplifies the mental model of the Pulse ecosystem.
//  • The soul‑intent illusion of one layer.
//
// ROLE IN THE DIGITAL BODY:
//  --------------------------
//  • Projection Layer → Presents multiple organs as one
//  • Facade Surface → Clean import boundary for the shell
//  • Shadow Merge → Unifies subsystem silhouettes
//  • Cognitive Simplifier → Reduces architectural complexity
//  • **Limbic Shadow → Unified Meta‑Layer + Subsystem Projection**
//
// WHAT THIS FILE IS:
//  -------------------
//  • A pure barrel file.
//  • A unified facade for three subsystems.
//  • A shadow projection of deeper Pulse layers.
//  • A conceptual illusion of a single Pulse organ.
//  • A stable import surface for the frontend.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a router.
//  • NOT a coordinator.
//  • NOT a logic layer.
//  • NOT a wrapper.
//  • NOT a state machine.
//  • NOT a healing engine.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT (v6.3):
//  ------------------------
//  • No logic allowed.
//  • No state.
//  • No orchestration.
//  • No side effects.
//  • Only pure re‑exports.
//  • Deterministic, drift‑proof facade behavior.
//
// ======================================================
//  LAYER CONSTANTS + DIAGNOSTICS
// ======================================================
const LAYER_ID = "LIMBIC-SHADOW";
const LAYER_NAME = "THE LIMBIC SHADOW";
const LAYER_ROLE = "UNIFIED PROJECTION LAYER";

const SHADOW_DIAGNOSTICS_ENABLED =
  (typeof window !== "undefined" && window.PULSE_SHADOW_DIAGNOSTICS === true) ||
  (typeof window !== "undefined" && window.PULSE_DIAGNOSTICS === true);

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

// ======================================================
//  PURE RE‑EXPORTS — THE SHADOW PROJECTION
// ======================================================
export { PulseNet } from "./PulseNet.js";
export { PulseClient } from "./PulseClient.js";
export { PulseUpdate } from "./PulseUpdate.js";
