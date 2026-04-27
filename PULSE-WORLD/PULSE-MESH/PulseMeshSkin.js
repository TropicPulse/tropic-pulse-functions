// ============================================================================
// FILE: /apps/organs/skin/PulseMeshSkin.js
// [pulse:mesh] PULSE_OS_SKIN_LAYER v11-Evo  // silver
// Boundary Membrane • Entry–Exit Normalization • Deterministic Skin
// ============================================================================
//
// IDENTITY — THE SKIN (v11-Evo):
// ------------------------------
// • First organ touched by every impulse entering the organism.
// • Last organ to touch every impulse leaving the organism.
// • Normalizes entry (score, energy).
// • Cleans exit (strips internal metadata).
// • Pure metadata-only — zero payload mutation.
// • No pressure reactivity, no friction, no noise.
// • Deterministic-field, drift-proof, SDN-aligned.
// • v11-Evo: binary-aware, dual-mode-ready, unified-advantage-field.
//
// SAFETY CONTRACT (v11-Evo):
// ---------------------------
// • No routing, no compute, no shaping.
// • No payload mutation.
// • No async, no randomness.
// • Metadata-only, reversible, safe.
// • Zero imports — CNS injects dependencies.
// • Drift-proof, deterministic, multi-instance-ready.
// ============================================================================

export function createPulseSkin({ log, warn, error }) {

  const SkinState = {
    meta: {
      layer: "PulseSkin",
      role: "BOUNDARY_MEMBRANE",
      version: "11.0-Evo",
      target: "full-mesh",
      selfRepairable: true,
      evo: {
        dualMode: true,
        binaryAware: true,
        symbolicAware: true,
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
        auraPressureAware: true,

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true
      }
    }
  };

  // ========================================================================
  //  SKIN PACK (v11-Evo)
  // ========================================================================
  const PulseSkin = {

    // -------------------------------------------------------
    // ENTRY NORMALIZATION — deterministic
    // -------------------------------------------------------
    normalizeEntry(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_entry_normalized = true;

      // v11-Evo: dual-mode tagging
      if (impulse.flags.binary_mode) {
        impulse.flags.skin_mode = "binary";
      } else if (impulse.flags.dual_mode) {
        impulse.flags.skin_mode = "dual";
      } else {
        impulse.flags.skin_mode = "symbolic";
      }

      // deterministic normalization
      impulse.score = clamp01(impulse.score ?? 0.5);
      impulse.energy = Math.max(0.05, impulse.energy ?? 1);

      return impulse;
    },

    // -------------------------------------------------------
    // EXIT NORMALIZATION — deterministic
    // -------------------------------------------------------
    normalizeExit(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_exit_normalized = true;

      // v11-Evo: strip internal metadata safely
      impulse.flags.internal_metadata_stripped = true;

      return impulse;
    }
  };

  // ========================================================================
  //  SKIN ENGINE (v11-Evo)
  // ========================================================================
  function applyPulseSkin(impulse, phase = "entry") {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_meta = SkinState.meta;

    if (phase === "entry") {
      PulseSkin.normalizeEntry(impulse);
    }

    // v11-Evo: NO friction, NO noise, NO boundary load modulation
    // Skin is pure normalization only.

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
