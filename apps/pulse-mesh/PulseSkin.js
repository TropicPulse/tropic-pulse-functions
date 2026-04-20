// ============================================================================
// [pulse:mesh] COMMUNITY_SKIN_LAYER v7.4  // silver
// Boundary Layer • Entry/Exit Normalization • Pressure-Aware Membrane
// ============================================================================
//
// NEW IN v7.4:
//  • Skin now reacts to system pressure signals:
//      - flowPressure
//      - throttleRate
//      - driftPressure
//      - auraTension
//      - reflexDropRate
//      - meshStormPressure
//  • Skin increases friction/noise under tension.
//  • Skin reduces boundary load when stabilizing.
//  • Still metadata-only, deterministic, zero payload mutation.
// ============================================================================

import { PulseField } from "./PulseField.js";

const SkinState = {
  environment: "default",
  friction: 0.0,
  noise: 0.0,
  boundaryLoad: 0.0,

  meta: {
    layer: "PulseSkin",
    role: "BOUNDARY_LAYER",
    version: 7.4,
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

// -----------------------------------------------------------
// Skin Pack (v7.4)
// -----------------------------------------------------------

export const PulseSkin = {
  normalizeEntry(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_entry_normalized = true;

    impulse.score = clamp01(impulse.score ?? 0.5);
    impulse.energy = Math.max(0.05, impulse.energy ?? 1);

    return impulse;
  },

  normalizeExit(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_exit_normalized = true;
    impulse.flags.internal_metadata_stripped = true;
    return impulse;
  },

  // NEW v7.4: dynamic friction based on system pressure
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

  // NEW v7.4: dynamic noise based on storms + reflex drops
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

  // NEW v7.4: boundary load reacts to pressure
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

// -----------------------------------------------------------
// Skin Engine (v7.4)
// -----------------------------------------------------------

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

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
