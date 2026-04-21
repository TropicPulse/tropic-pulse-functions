// ============================================================================
//  PULSE OS v7.7 — SKIN LAYER  // silver
//  “Boundary Membrane / Entry–Exit Normalization / Pressure‑Reactive Skin”
// ============================================================================
//
//  IDENTITY — THE SKIN (v7.7):
//  ---------------------------
//  • First organ touched by every impulse entering the organism.
//  • Last organ to touch every impulse leaving the organism.
//  • Normalizes entry (score, energy).
//  • Cleans exit (strips internal metadata).
//  • Reacts to system pressure (friction, noise, boundary load).
//  • Pure metadata-only — zero payload mutation.
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//  • Boundary Layer → protects the organism from overload.
//  • Pressure Membrane → increases friction/noise under tension.
//  • Stabilization Layer → reduces boundary load when stabilizing.
//  • Skin → outermost layer of the mesh body.
//
//  SAFETY CONTRACT:
//  ----------------
//  • No routing, no compute, no shaping.
//  • No payload mutation.
//  • Deterministic, drift-proof.
//  • Metadata-only, reversible, safe.
// ============================================================================

import { PulseField } from "./PulseMeshEnvironmentalField.js";

const SkinState = {
  environment: "default",
  friction: 0.0,
  noise: 0.0,
  boundaryLoad: 0.0,

  meta: {
    layer: "PulseSkin",
    role: "BOUNDARY_MEMBRANE",
    version: 7.7,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      localAware: true,
      internetAware: true,
      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,
      unifiedAdvantageField: true,
      futureEvolutionReady: true
    }
  }
};

// ============================================================================
//  SKIN PACK (v7.7)
// ============================================================================

export const PulseSkin = {

  // -------------------------------------------------------
  // ENTRY NORMALIZATION — “clean the impulse before it enters”
  // -------------------------------------------------------
  normalizeEntry(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_entry_normalized = true;

    impulse.score = clamp01(impulse.score ?? 0.5);
    impulse.energy = Math.max(0.05, impulse.energy ?? 1);

    return impulse;
  },

  // -------------------------------------------------------
  // EXIT NORMALIZATION — “clean the impulse before it leaves”
  // -------------------------------------------------------
  normalizeExit(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_exit_normalized = true;
    impulse.flags.internal_metadata_stripped = true;
    return impulse;
  },

  // -------------------------------------------------------
  // DYNAMIC FRICTION — reacts to pressure
  // -------------------------------------------------------
  applyDynamicFriction(impulse, field) {
    const tension =
      field.flowPressure * 0.4 +
      field.driftPressure * 0.3 +
      field.auraTension * 0.3;

    const friction = clamp01(SkinState.friction + tension * 0.5);

    impulse.energy *= (1 - friction * 0.1);
    impulse.flags.skin_dynamic_friction = friction;

    return impulse;
  },

  // -------------------------------------------------------
  // DYNAMIC NOISE — reacts to storms + reflex drops
  // -------------------------------------------------------
  applyDynamicNoise(impulse, field) {
    const turbulence =
      field.meshStormPressure * 0.5 +
      field.reflexDropRate * 0.3 +
      field.throttleRate * 0.2;

    const noise = clamp01(SkinState.noise + turbulence * 0.4);

    impulse.score = clamp01(impulse.score - noise * 0.05);
    impulse.flags.skin_dynamic_noise = noise;

    return impulse;
  },

  // -------------------------------------------------------
  // DYNAMIC BOUNDARY LOAD — reacts to pressure
  // -------------------------------------------------------
  applyDynamicBoundaryLoad(impulse, field) {
    const load =
      field.flowPressure * 0.3 +
      field.driftPressure * 0.3 +
      field.auraTension * 0.4;

    const boundaryLoad = clamp01(SkinState.boundaryLoad + load * 0.5);

    impulse.flags.skin_boundary_load = boundaryLoad;
    return impulse;
  }
};

// ============================================================================
//  SKIN ENGINE (v7.7)
// ============================================================================

export function applyPulseSkin(impulse, phase = "entry") {
  impulse.flags = impulse.flags || {};
  impulse.flags.skin_meta = SkinState.meta;

  const field = PulseField.snapshot();

  if (phase === "entry") {
    PulseSkin.normalizeEntry(impulse);
  }

  PulseSkin.applyDynamicFriction(impulse, field);
  PulseSkin.applyDynamicNoise(impulse, field);
  PulseSkin.applyDynamicBoundaryLoad(impulse, field);

  if (phase === "exit") {
    PulseSkin.normalizeExit(impulse);
  }

  impulse.flags.skin_applied = true;
  return impulse;
}

// ============================================================================
//  HELPERS
// ============================================================================
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
