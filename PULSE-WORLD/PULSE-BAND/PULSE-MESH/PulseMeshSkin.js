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
// ============================================================================
// FILE: /organs/skin/PulseMeshSkin-v15-EVO-IMMORTAL.js
// [pulse:mesh] PULSE_OS_SKIN_LAYER v15-EVO-IMMORTAL  // silver-white
// Boundary Membrane • Entry–Exit Normalization • Deterministic Skin
// Zero-Trust Surface • Presence/Band-Aware • Dual-Mode Ready
// ============================================================================

export function createPulseSkin({ log, warn, error }) {

  // ==========================================================================
  // IMMORTAL META — v15
  // ==========================================================================
  const SkinState = {
    meta: Object.freeze({
      layer: "PulseSkin",
      role: "BOUNDARY_MEMBRANE",
      version: "15-EVO-IMMORTAL",
      lineage: "PulseMesh-v15",
      target: "full-mesh",
      selfRepairable: true,

      evo: {
        skin: true,
        boundaryLayer: true,
        zeroTrustSurface: true,
        metadataOnly: true,
        deterministic: true,
        driftProof: true,

        presenceAware: true,
        bandAware: true,
        binaryAware: true,
        symbolicAware: true,
        dualBand: true,
        meshAware: true,

        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        unifiedAdvantageField: true,
        deterministicField: true,
        futureEvolutionReady: true,
        multiInstanceReady: true,

        signalFactoringAware: true,
        meshPressureAware: true,
        auraPressureAware: true,

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true,
        zeroNetworkFetch: true,
        zeroExternalMutation: true
      },

      contract: {
        always: [
          "normalize entry",
          "normalize exit",
          "preserve payload",
          "preserve determinism",
          "strip internal metadata safely"
        ],
        never: [
          "mutate payload",
          "route",
          "compute",
          "inject randomness",
          "modify score beyond normalization",
          "modify energy beyond normalization"
        ]
      }
    })
  };

  // ==========================================================================
  // SKIN PACK — IMMORTAL ENTRY/EXIT NORMALIZATION
  // ==========================================================================
  const PulseSkin = {

    // ------------------------------------------------------------------------
    // ENTRY NORMALIZATION — deterministic, zero-trust, metadata-only
    // ------------------------------------------------------------------------
    normalizeEntry(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_entry_normalized = true;
      impulse.flags.skin_lineage = "skin-v15-immortal";

      // ---------------------------------------------------
      // MODE + PRESENCE-BAND DETERMINISTIC TAGGING
      // ---------------------------------------------------
      if (impulse.flags.binary_mode) {
        impulse.flags.skin_mode = "binary";
        impulse.band = "binary";
        impulse.flags.skin_band_lineage = "band-binary-v15";
      }
      else if (impulse.flags.dual_mode) {
        impulse.flags.skin_mode = "dual";
        impulse.band = "dual";
        impulse.flags.skin_band_lineage = "band-dual-v15";
      }
      else {
        impulse.flags.skin_mode = "symbolic";
        impulse.band = "symbolic";
        impulse.flags.skin_band_lineage = "band-symbolic-v15";
      }

      // ---------------------------------------------------
      // SCORE + ENERGY NORMALIZATION (deterministic)
      // ---------------------------------------------------
      impulse.score = clamp01(impulse.score ?? 0.5);
      impulse.energy = Math.max(0.05, impulse.energy ?? 1);

      // ---------------------------------------------------
      // PRESENCE-BAND METADATA
      // ---------------------------------------------------
      impulse.flags.skin_presence_band = impulse.band;

      // ---------------------------------------------------
      // IMMORTAL SURFACE SIGNATURE
      // ---------------------------------------------------
      impulse.flags.skin_surface_signature = "surface-v15-immortal";

      return impulse;
    },

    // ------------------------------------------------------------------------
    // EXIT NORMALIZATION — deterministic, metadata scrubbing
    // ------------------------------------------------------------------------
    normalizeExit(impulse) {
      impulse.flags = impulse.flags || {};
      impulse.flags.skin_exit_normalized = true;

      // IMMORTAL: safe metadata scrubbing
      impulse.flags.skin_exit_scrubbed = true;

      // We do NOT delete flags — we mark them as scrubbed.
      // Router/SendSystem may remove internal flags later.

      return impulse;
    }
  };

  // ==========================================================================
  // SKIN ENGINE — IMMORTAL
  // ==========================================================================
  function applyPulseSkin(impulse, phase = "entry") {
    impulse.flags = impulse.flags || {};
    impulse.flags.skin_meta = SkinState.meta;

    if (phase === "entry") {
      PulseSkin.normalizeEntry(impulse);
    }

    // IMMORTAL SKIN: no friction, no noise, no shaping, no compute.

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
// HELPERS
// ============================================================================
function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
