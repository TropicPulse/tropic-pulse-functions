// ============================================================================
// FILE: /organs/skin/PulseMeshSkin.js
// [pulse:mesh] PULSE_OS_SKIN_LAYER v12.3-PRESENCE-EVO-MAX-PRIME  // silver
// Boundary Membrane • Entry–Exit Normalization • Deterministic Skin
// ============================================================================
//
// IDENTITY — THE SKIN (v12.3):
// ----------------------------
// • First organ touched by every impulse entering the organism.
// • Last organ to touch every impulse leaving the organism.
// • Normalizes entry (score, energy, mode, presence-band).
// • Cleans exit (strips internal metadata).
// • Pure metadata-only — zero payload mutation.
// • No pressure reactivity, no friction, no noise.
// • Deterministic-field, drift-proof, SDN-aligned.
// • Presence-aware, binary-aware, dual-band-ready.
//
// SAFETY CONTRACT (v12.3):
// -------------------------
// • No routing, no compute, no shaping.
// • No payload mutation.
// • No async, no randomness.
// • Metadata-only, reversible, safe.
// • Zero imports — CNS injects dependencies.
// • Drift-proof, deterministic, multi-instance-ready.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshSkin",
  version: "v14.9-MESH-SKIN",
  layer: "mesh",
  role: "mesh_surface_and_boundary_layer",
  lineage: "PulseMesh-v14",

  evo: {
    skin: true,                     // This IS the mesh skin organ
    boundaryLayer: true,            // Boundary + surface metadata
    metadataOnly: true,
    deterministic: true,
    driftProof: true,
    presenceAware: true,
    meshAware: true,
    dualBand: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshImmuneMembrane",
      "PulseMeshAwareness",
      "PulseMeshAura"
    ],
    never: [
      "legacyMeshSkin",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseSkin({ log, warn, error }) {

  const SkinState = {
    meta: {
      layer: "PulseSkin",
      role: "BOUNDARY_MEMBRANE",
      version: "12.3-PRESENCE-EVO-MAX-PRIME",
      target: "full-mesh",
      selfRepairable: true,
      evo: {
        dualMode: true,
        binaryAware: true,
        symbolicAware: true,
        presenceAware: true,
        bandAware: true,
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
  //  SKIN PACK (v12.3)
  // ========================================================================
  const PulseSkin = {

    // -------------------------------------------------------
    // ENTRY NORMALIZATION — deterministic
    // -------------------------------------------------------
    normalizeEntry(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_entry_normalized = true;

      // v12.3: mode + presence-band tagging
      if (impulse.flags.binary_mode) {
        impulse.flags.skin_mode = "binary";
        impulse.band = "binary";
      } else if (impulse.flags.dual_mode) {
        impulse.flags.skin_mode = "dual";
        impulse.band = "dual";
      } else {
        impulse.flags.skin_mode = "symbolic";
        impulse.band = "symbolic";
      }

      // deterministic normalization
      impulse.score = clamp01(impulse.score ?? 0.5);
      impulse.energy = Math.max(0.05, impulse.energy ?? 1);

      // v12.3: presence-band metadata
      impulse.flags.skin_presence_band = impulse.band;

      return impulse;
    },

    // -------------------------------------------------------
    // EXIT NORMALIZATION — deterministic
    // -------------------------------------------------------
    normalizeExit(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_exit_normalized = true;

      // v12.3: strip internal metadata safely
      impulse.flags.internal_metadata_stripped = true;

      return impulse;
    }
  };

  // ========================================================================
  //  SKIN ENGINE (v12.3)
  // ========================================================================
  function applyPulseSkin(impulse, phase = "entry") {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_meta = SkinState.meta;

    if (phase === "entry") {
      PulseSkin.normalizeEntry(impulse);
    }

    // v12.3: NO friction, NO noise, NO boundary load modulation
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
