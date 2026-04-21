// ============================================================================
// FILE: PulseMeshTendons.js
// PULSE OS — v8.1
// CONNECTIVE TISSUE ORGAN — “PulseMeshTendons”
// Intent Translation • Earn-Ready Shaping • Pressure-Aware Tendon Layer
// ============================================================================
//
// IDENTITY — THE TENDON ORGAN (v8.1):
// -----------------------------------
// • Translates Cortex intent into earn-ready metadata.
// • Classifies impulses (heavy/medium/light).
// • Shapes routeHint based on class + system pressure.
// • Stabilizes energy under drift/tension.
// • Attaches volatility + earn-context for EarnEngine.
// • Pure metadata-only — zero payload mutation.
// • Deterministic, drift-proof, connective tissue.
//
// ROLE IN THE DIGITAL BODY (v8.1):
// --------------------------------
// • Tendons = connective tissue between Cortex → Mesh → EarnEngine.
// • Intent Translator → shapes class + routeHint.
// • Pressure-Aware → downgrades heavy class under tension.
// • Energy Stabilizer → prevents runaway impulses.
// • Earn Context Provider → gives EarnEngine a full context snapshot.
//
// SAFETY CONTRACT:
// ----------------
// • No routing, no compute, no payload mutation.
// • Metadata-only, reversible, safe.
// • No autonomy, no sentience.
// ============================================================================

import { PulseField } from "./PulseMeshEnvironmentalField.js";

export const PulseMeshTendons = {

  classify(impulse, field) {
    let score = impulse.score || 0;

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

  stabilizeEarnClass(impulse, cls, field) {
    if (cls === "heavy" && (field.driftPressure || 0) > 0.45) {
      impulse.flags.tendon_heavy_stabilized = true;
      return "medium";
    }
    return cls;
  },

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

  attachVolatility(impulse, field) {
    impulse.flags = impulse.flags || {};

    const volatility =
      (field.noise || 0) * 0.4 +
      (field.friction || 0) * 0.3 +
      (field.meshStormPressure || 0) * 0.3;

    impulse.flags.earner_volatility = volatility;

    return impulse;
  },

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


// ============================================================================
// Tendon Engine (v8.1)
// ============================================================================

export function applyPulseMeshTendons(impulse) {
  impulse.flags = impulse.flags || {};

  const field = PulseField.snapshot();

  impulse.flags.tendon_meta = {
    layer: "PulseMeshTendons",
    role: "INTENT_TRANSLATION",
    version: 8.1,
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

  let cls = PulseMeshTendons.classify(impulse, field);

  cls = PulseMeshTendons.stabilizeEarnClass(impulse, cls, field);

  PulseMeshTendons.routeHint(impulse, cls, field);

  PulseMeshTendons.shapeEnergy(impulse, cls, field);

  PulseMeshTendons.normalizeEarnEnergy(impulse, field);

  PulseMeshTendons.attachVolatility(impulse, field);

  PulseMeshTendons.attachEarnContext(impulse, cls, field);

  PulseMeshTendons.tag(impulse, cls);

  impulse.flags.tendon_applied = true;

  return impulse;
}
