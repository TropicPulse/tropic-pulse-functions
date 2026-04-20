// ============================================================================
// [pulse:mesh] COMMUNITY_TENDON_LAYER v7.4  // green
// Connective Tissue • Intent Shaping • Pressure-Aware Earner Targeting
// ============================================================================
//
// NEW IN v7.4:
//  • Tendons now read system pressure signals:
//      - flowPressure
//      - driftPressure
//      - throttleRate
//      - auraTension
//      - reflexDropRate
//      - meshStormPressure
//  • Tendons adjust class + routeHint under tension.
//  • Tendons stabilize energy shaping when system is stressed.
//  • Tendons pre-shape EarnEngine context (metadata-only).
//  • Still metadata-only, deterministic, zero payload mutation.
// ============================================================================

import { PulseField } from "./PulseField.js";

export const Tendons = {
  classify(impulse, field) {
    let score = impulse.score || 0;

    // drift + tension reduce class weight
    const tension =
      (field.driftPressure || 0) * 0.4 +
      (field.auraTension || 0) * 0.3 +
      (field.flowPressure || 0) * 0.3;

    score = score - tension * 0.2;

    if (score >= 0.85) return "heavy";
    if (score >= 0.45) return "medium";
    return "light";
  },

  routeHint(impulse, cls, field) {
    // avoid heavy earners under pressure
    if (cls === "heavy" && (field.flowPressure || 0) > 0.5) {
      impulse.routeHint = "earner-medium";
      impulse.flags.tendon_pressure_downgrade = true;
      return impulse;
    }

    switch (cls) {
      case "heavy":
        impulse.routeHint = "earner-heavy";
        break;
      case "medium":
        impulse.routeHint = "earner-medium";
        break;
      default:
        impulse.routeHint = "earner-light";
    }

    return impulse;
  },

  shapeEnergy(impulse, cls, field) {
    // stabilize energy under drift/tension
    const tension =
      (field.driftPressure || 0) * 0.5 +
      (field.meshStormPressure || 0) * 0.3 +
      (field.throttleRate || 0) * 0.2;

    if (tension > 0.4) {
      impulse.flags.tendon_energy_stabilized = true;
      return impulse;
    }

    if (cls === "heavy") impulse.energy *= 1.1;
    if (cls === "light") impulse.energy *= 0.9;

    return impulse;
  },

  // downgrade heavy class under high drift
  stabilizeEarnClass(impulse, cls, field) {
    if (cls === "heavy" && (field.driftPressure || 0) > 0.45) {
      impulse.flags.tendon_heavy_stabilized = true;
      return "medium";
    }
    return cls;
  },

  // normalize energy under high volatility
  normalizeEarnEnergy(impulse, field) {
    const tension =
      (field.driftPressure || 0) * 0.4 +
      (field.meshStormPressure || 0) * 0.4 +
      (field.throttleRate || 0) * 0.2;

    if (tension > 0.5) {
      impulse.flags.tendon_energy_normalized = true;
      const e = impulse.energy ?? 1;
      impulse.energy = Math.max(0.1, Math.min(e, 1));
    }

    return impulse;
  },

  // attach volatility signal for EarnEngine
  attachVolatility(impulse, field) {
    impulse.flags = impulse.flags || {};

    const volatility =
      (field.noise || 0) * 0.4 +
      (field.friction || 0) * 0.3 +
      (field.meshStormPressure || 0) * 0.3;

    impulse.flags.earner_volatility = volatility;

    return impulse;
  },

  // attach earn-ready context snapshot
  attachEarnContext(impulse, cls, field) {
    impulse.flags = impulse.flags || {};

    impulse.flags.earner_context = {
      class: cls,
      expected_load: field.flowPressure ?? 0,
      expected_drift: field.driftPressure ?? 0,
      expected_noise: field.noise ?? 0,
      expected_friction: field.friction ?? 0,
      urgency: impulse.energy ?? 1,
      stability_hint: field.stability ?? 1,
      aura_tension: field.auraTension ?? 0,
      mesh_storm: field.meshStormPressure ?? 0
    };

    return impulse;
  },

  tag(impulse, cls) {
    impulse.flags = impulse.flags || {};
    impulse.flags[`tendon_class_${cls}`] = true;
    return impulse;
  }
};

// -----------------------------------------------------------
// Tendon Engine (v7.4)
// -----------------------------------------------------------

export function applyTendons(impulse) {
  impulse.flags = impulse.flags || {};

  const field = PulseField.snapshot();

  impulse.flags.tendon_meta = {
    layer: "PulseTendons",
    role: "INTENT_TRANSLATION",
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
  };

  // classify
  let cls = Tendons.classify(impulse, field);

  // stabilize class under drift
  cls = Tendons.stabilizeEarnClass(impulse, cls, field);

  // route hint
  Tendons.routeHint(impulse, cls, field);

  // energy shaping
  Tendons.shapeEnergy(impulse, cls, field);

  // energy normalization
  Tendons.normalizeEarnEnergy(impulse, field);

  // volatility signal
  Tendons.attachVolatility(impulse, field);

  // earn context
  Tendons.attachEarnContext(impulse, cls, field);

  // tag
  Tendons.tag(impulse, cls);

  impulse.flags.tendon_applied = true;

  return impulse;
}
