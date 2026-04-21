// ============================================================================
// [pulse:mesh] COMMUNITY_HORMONE_LAYER v9.2  // pink
// Global Modulation Layer • Metadata-Only • System-Wide Influence
// ============================================================================
//
// IDENTITY — HORMONES (v9.2):
// ---------------------------
// • Global modulation field (metadata-only).
// • NEVER mutates payloads.
// • NEVER mutates score or energy.
// • NEVER computes.
// • Provides tags that other organs MAY interpret.
// • Pure influence field, not a compute surface.
//
// SAFETY CONTRACT (v9.2):
// • No payload access.
// • No score/energy mutation.
// • No routing override.
// • No autonomy.
// • Deterministic-field, drift-proof.
// • Unified-advantage-field, multi-instance-ready.
// • Factoring-aware, mesh-pressure-aware, aura-pressure-aware.
// ============================================================================

export function createPulseMeshHormones({ log, warn, error }) {

  // -----------------------------------------------------------
  // Hormone State (metadata-only)
  // -----------------------------------------------------------
  const HormoneState = {
    // modulation fields (metadata only)
    boostTag: false,
    dampTag: false,
    urgencyTag: false,
    coolingTag: false,
    stabilityTag: false,

    // v9.2 pressure inputs (injected by CNS Brain)
    flowPressure: 0.0,
    throttleRate: 0.0,
    driftPressure: 0.0,
    auraTension: 0.0,
    reflexDropRate: 0.0,
    meshStormPressure: 0.0,
    factoringPressure: 0.0,   // NEW v9.2

    meta: {
      layer: "PulseHormones",
      role: "GLOBAL_MODULATION",
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


  // -----------------------------------------------------------
  // Hormone Pack — metadata-only tagging (v9.2)
  // -----------------------------------------------------------
  const PulseHormones = {

    synthesizeFromPressure() {
      const p = HormoneState.flowPressure;
      const t = HormoneState.throttleRate;
      const d = HormoneState.driftPressure;
      const a = HormoneState.auraTension;
      const m = HormoneState.meshStormPressure;
      const f = HormoneState.factoringPressure;

      // reset tags
      HormoneState.boostTag = false;
      HormoneState.dampTag = false;
      HormoneState.urgencyTag = false;
      HormoneState.coolingTag = false;
      HormoneState.stabilityTag = false;

      // Calm → boost + stability
      if (p < 0.2 && d < 0.2 && a < 0.2 && f < 0.2) {
        HormoneState.boostTag = true;
        HormoneState.stabilityTag = true;
      }

      // Moderate pressure → cooling + stability
      if (p >= 0.2 || d >= 0.2 || a >= 0.2 || f >= 0.2) {
        HormoneState.coolingTag = true;
        HormoneState.stabilityTag = true;
      }

      // High pressure → damp + cooling + stability
      if (p > 0.5 || t > 0.2 || d > 0.4 || m > 0.4 || f > 0.4) {
        HormoneState.dampTag = true;
        HormoneState.coolingTag = true;
        HormoneState.stabilityTag = true;
      }

      // Emergency → hard damp + hard cooling
      if (p > 0.7 || t > 0.3 || f > 0.6) {
        HormoneState.dampTag = true;
        HormoneState.coolingTag = true;
        HormoneState.stabilityTag = true;
        HormoneState.urgencyTag = true;
      }
    },

    tagBoost(impulse) {
      if (HormoneState.boostTag) {
        impulse.flags.hormone_event = "boost";
        impulse.flags.hormone_boost = true;
      }
    },

    tagDamp(impulse) {
      if (HormoneState.dampTag) {
        impulse.flags.hormone_event = "damp";
        impulse.flags.hormone_damp = true;
      }
    },

    tagUrgency(impulse) {
      if (HormoneState.urgencyTag) {
        impulse.flags.hormone_urgency = true;
      }
    },

    tagCooling(impulse) {
      if (HormoneState.coolingTag) {
        impulse.flags.hormone_cooling = true;
      }
    },

    tagStability(impulse) {
      if (HormoneState.stabilityTag) {
        impulse.flags.hormone_stabilized = true;
      }
    }
  };


  // -----------------------------------------------------------
  // Hormone Engine (v9.2, metadata-only)
  // -----------------------------------------------------------
  function applyPulseHormones(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.hormone_meta = HormoneState.meta;

    // synthesize tags from system pressure
    PulseHormones.synthesizeFromPressure();

    // apply tags (metadata only)
    PulseHormones.tagBoost(impulse);
    PulseHormones.tagDamp(impulse);
    PulseHormones.tagUrgency(impulse);
    PulseHormones.tagCooling(impulse);
    PulseHormones.tagStability(impulse);

    impulse.flags.hormones_applied = true;

    return impulse;
  }


  // -----------------------------------------------------------
  // PUBLIC INTERFACE
  // -----------------------------------------------------------
  return {
    state: HormoneState,
    apply: applyPulseHormones,
    synthesize: PulseHormones.synthesizeFromPressure
  };
}
