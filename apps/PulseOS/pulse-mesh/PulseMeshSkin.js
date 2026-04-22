// ============================================================================
// FILE: /apps/organs/skin/PulseMeshSkin.js
// [pulse:mesh] PULSE_OS_SKIN_LAYER v9.2  // silver
// Boundary Membrane • Entry–Exit Normalization • Pressure‑Reactive Skin
// ============================================================================
//
// IDENTITY — THE SKIN (v9.2):
// ---------------------------
// • First organ touched by every impulse entering the organism.
// • Last organ to touch every impulse leaving the organism.
// • Normalizes entry (score, energy).
// • Cleans exit (strips internal metadata).
// • Reacts to system pressure (friction, noise, boundary load).
// • Pure metadata-only — zero payload mutation.
// • v9.2: mesh-storm-aware, factoring-aware, deterministic-field.
//
// ROLE IN THE DIGITAL BODY (v9.2):
// --------------------------------
// • Boundary Layer → protects the organism from overload.
// • Pressure Membrane → increases friction/noise under tension.
// • Stabilization Layer → reduces boundary load when stabilizing.
// • Skin → outermost layer of the mesh body.
// • Deterministic-field → same pressure snapshot → same skin behavior.
//
// SAFETY CONTRACT (v9.2):
// ------------------------
// • No routing, no compute, no shaping.
// • No payload mutation.
// • No async, no randomness.
// • Metadata-only, reversible, safe.
// • Zero imports — CNS injects pressure snapshot.
// • Drift-proof, deterministic, multi-instance-ready.
// ============================================================================


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// (Skin MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseSkin({ getPressureSnapshot, log, warn, error }) {

  const SkinState = {
    environment: "default",
    friction: 0.0,
    noise: 0.0,
    boundaryLoad: 0.0,

    meta: {
      layer: "PulseSkin",
      role: "BOUNDARY_MEMBRANE",
      version: 9.2,
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
        deterministicField: true,
        futureEvolutionReady: true,

        signalFactoringAware: true,
        meshPressureAware: true,
        auraPressureAware: true
      }
    }
  };

  // ========================================================================
  //  SKIN PACK (v9.2)
  // ========================================================================
  const PulseSkin = {

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
    // DYNAMIC FRICTION — reacts to pressure (v9.2)
    // -------------------------------------------------------
    applyDynamicFriction(impulse, field) {
      const tension =
        (field.flowPressure || 0) * 0.35 +
        (field.driftPressure || 0) * 0.25 +
        (field.auraTension || 0) * 0.25 +
        (field.factoringPressure || 0) * 0.15;

      const friction = clamp01(SkinState.friction + tension * 0.5);

      impulse.energy *= (1 - friction * 0.1);
      impulse.flags.skin_dynamic_friction = friction;

      return impulse;
    },

    // -------------------------------------------------------
    // DYNAMIC NOISE — reacts to storms + reflex drops (v9.2)
    // -------------------------------------------------------
    applyDynamicNoise(impulse, field) {
      const turbulence =
        (field.meshStormPressure || 0) * 0.5 +
        (field.reflexDropRate || 0) * 0.3 +
        (field.throttleRate || 0) * 0.2;

      const noise = clamp01(SkinState.noise + turbulence * 0.4);

      impulse.score = clamp01(impulse.score - noise * 0.05);
      impulse.flags.skin_dynamic_noise = noise;

      return impulse;
    },

    // -------------------------------------------------------
    // DYNAMIC BOUNDARY LOAD — reacts to pressure (v9.2)
    // -------------------------------------------------------
    applyDynamicBoundaryLoad(impulse, field) {
      const load =
        (field.flowPressure || 0) * 0.3 +
        (field.driftPressure || 0) * 0.25 +
        (field.auraTension || 0) * 0.3 +
        (field.meshStormPressure || 0) * 0.15;

      const boundaryLoad = clamp01(SkinState.boundaryLoad + load * 0.5);

      impulse.flags.skin_boundary_load = boundaryLoad;
      return impulse;
    }
  };


  // ========================================================================
  //  SKIN ENGINE (v9.2)
  // ========================================================================
  function applyPulseSkin(impulse, phase = "entry") {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_meta = SkinState.meta;

    const field = getPressureSnapshot() || {};

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

  return {
    meta: SkinState.meta,
    apply: applyPulseSkin,
    state: SkinState
  };
}


// ============================================================================
//  HELPERS
// ============================================================================
function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
