// ============================================================================
// [pulse:mesh] COMMUNITY_HORMONE_LAYER v9.1  // pink
// Global Modulation Layer • Metadata-Only • System-Wide Influence
// ============================================================================
//
// NEW IN v9.1:
//  • Hormones receive system pressure via CNS Brain injection.
//  • Zero imports — pure metadata-only organ.
//  • Adaptive modulation based on:
//      - flowPressure
//      - throttleRate
//      - driftPressure
//      - auraTension
//      - reflexDropRate
//      - meshStormPressure
//  • Hormones generate adaptive modulation:
//      - boost when system is calm
//      - dampen when system is overheated
//      - urgency when system is under threat
//      - cooling when recursion/pressure rises
//      - stability when drift increases
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
//  (Hormones MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseMeshHormones({ log, warn, error }) {

  // -----------------------------------------------------------
  // Hormone State (global, metadata-only)
  // -----------------------------------------------------------
  const HormoneState = {
    boost: 0.0,
    dampen: 0.0,
    urgency: 0.0,
    cooling: 0.0,
    stability: 0.0,
    loadSignal: 0.0,

    // v9.1: system pressure inputs (injected)
    flowPressure: 0.0,
    throttleRate: 0.0,
    driftPressure: 0.0,
    auraTension: 0.0,
    reflexDropRate: 0.0,
    meshStormPressure: 0.0,

    meta: {
      layer: "PulseHormones",
      role: "GLOBAL_MODULATION",
      version: 9.1,
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
  // Hormone Pack: adaptive modulation rules (v9.1)
  // -----------------------------------------------------------
  const PulseHormones = {

    // NEW v9.1: adaptive hormone synthesis
    synthesizeFromPressure() {
      const p = HormoneState.flowPressure;
      const t = HormoneState.throttleRate;
      const d = HormoneState.driftPressure;
      const a = HormoneState.auraTension;
      const r = HormoneState.reflexDropRate;
      const m = HormoneState.meshStormPressure;

      // Calm system → boost clarity + energy
      if (p < 0.2 && d < 0.2 && a < 0.2) {
        HormoneState.boost = 0.3;
        HormoneState.dampen = 0.0;
        HormoneState.cooling = 0.0;
        HormoneState.urgency = 0.1;
        HormoneState.stability = 0.1;
      }

      // Moderate pressure → stabilize + cool
      if (p >= 0.2 || d >= 0.2 || a >= 0.2) {
        HormoneState.boost = 0.1;
        HormoneState.dampen = 0.1;
        HormoneState.cooling = 0.2;
        HormoneState.urgency = 0.0;
        HormoneState.stability = 0.3;
      }

      // High pressure → dampen + cool + stabilize hard
      if (p > 0.5 || t > 0.2 || d > 0.4 || m > 0.4) {
        HormoneState.boost = 0.0;
        HormoneState.dampen = 0.3;
        HormoneState.cooling = 0.4;
        HormoneState.urgency = 0.0;
        HormoneState.stability = 0.5;
      }

      // Emergency (organism braking hard)
      if (p > 0.7 || t > 0.3) {
        HormoneState.boost = 0.0;
        HormoneState.dampen = 0.5;
        HormoneState.cooling = 0.6;
        HormoneState.urgency = 0.0;
        HormoneState.stability = 0.7;
      }
    },

    applyBoost(impulse) {
      if (HormoneState.boost > 0) {
        impulse.score = clamp01(impulse.score + HormoneState.boost * 0.2);
        impulse.flags.hormone_event = "boost";
      }
    },

    applyDampen(impulse) {
      if (HormoneState.dampen > 0) {
        impulse.score = clamp01(impulse.score - HormoneState.dampen * 0.2);
        impulse.flags.hormone_event = "damp";
      }
    },

    applyUrgency(impulse) {
      if (HormoneState.urgency > 0) {
        impulse.energy *= (1 + HormoneState.urgency * 0.1);
      }
    },

    applyCooling(impulse) {
      if (HormoneState.cooling > 0) {
        impulse.energy *= (1 - HormoneState.cooling * 0.1);
      }
    },

    applyStability(impulse) {
      if (HormoneState.stability > 0) {
        impulse.flags.hormone_stabilized = true;
      }
    },

    applyLoadSignal(impulse) {
      impulse.flags.hormone_load = HormoneState.loadSignal;
    }
  };


  // -----------------------------------------------------------
  // Hormone Engine (v9.1)
  // -----------------------------------------------------------
  function applyPulseHormones(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.hormone_meta = HormoneState.meta;

    // NEW v9.1: synthesize hormones based on system pressure
    PulseHormones.synthesizeFromPressure();

    // Apply modulation
    PulseHormones.applyBoost(impulse);
    PulseHormones.applyDampen(impulse);
    PulseHormones.applyUrgency(impulse);
    PulseHormones.applyCooling(impulse);
    PulseHormones.applyStability(impulse);
    PulseHormones.applyLoadSignal(impulse);

    impulse.flags.hormones_applied = true;

    return impulse;
  }


  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
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
