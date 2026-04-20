// ============================================================================
// [pulse:mesh] COMMUNITY_IMMUNE_LAYER v7.4  // red
// System Safety Layer • Validation • Quarantine • Metadata-Only
// ============================================================================
//
// NEW IN v7.4:
//  • Immune layer now reads system pressure signals:
//      - flowPressure
//      - throttleRate
//      - driftPressure
//      - auraTension
//      - reflexDropRate
//      - meshStormPressure
//  • Immune layer can quarantine impulses based on system tension.
//  • Still metadata-only, deterministic, zero payload mutation.
// ============================================================================

import { PulseField } from "./PulseField.js";

export const PulseImmune = {
  // ---------------------------------------------------------
  // STRUCTURAL VALIDATION (unchanged)
  // ---------------------------------------------------------
  validateStructure(impulse) {
    if (!impulse.id) return fail("missing_id");
    if (!impulse.payloadRef) return fail("missing_payloadRef");
    if (typeof impulse.energy !== "number") return fail("invalid_energy");
    if (typeof impulse.score !== "number") return fail("invalid_score");
    return pass();
  },

  validateFlags(impulse) {
    const flags = impulse.flags || {};
    const keys = Object.keys(flags);
    if (keys.length > 96) return fail("too_many_flags"); // v7.4: slightly higher tolerance
    return pass();
  },

  // ---------------------------------------------------------
  // SYSTEM PRESSURE CHECKS (NEW v7.4)
  // ---------------------------------------------------------
  pressureCheck(impulse) {
    const field = PulseField.snapshot();

    const flow = field.flowPressure || 0;
    const drift = field.driftPressure || 0;
    const throttle = field.throttleRate || 0;
    const aura = field.auraTension || 0;
    const reflexDrops = field.reflexDropRate || 0;
    const storm = field.meshStormPressure || 0;

    // High flow pressure → immune quarantine
    if (flow > 0.7) return fail("flow_pressure_high");

    // High drift → immune quarantine
    if (drift > 0.5) return fail("drift_pressure_high");

    // Frequent throttles → immune quarantine
    if (throttle > 0.3) return fail("throttle_rate_high");

    // Aura tension → immune quarantine
    if (aura > 0.4) return fail("aura_tension_high");

    // Reflex drop storms → immune quarantine
    if (reflexDrops > 0.4) return fail("reflex_drop_storm");

    // Mesh routing storms → immune quarantine
    if (storm > 0.4) return fail("mesh_storm_pressure");

    return pass();
  },

  // ---------------------------------------------------------
  // ANOMALY QUARANTINE (unchanged)
  // ---------------------------------------------------------
  quarantine(impulse) {
    if (impulse.flags?.cortex_anomaly) {
      impulse.flags.immune_quarantined = true;
    }
    return pass();
  },

  // ---------------------------------------------------------
  // ROUTE SANITY (unchanged)
  // ---------------------------------------------------------
  routeSanity(impulse) {
    const hint = impulse.routeHint;
    if (!hint) return pass();

    if (typeof hint !== "string") return fail("invalid_routeHint");
    if (!hint.startsWith("earner-") && !hint.startsWith("service-")) {
      return fail("unknown_routeHint");
    }

    return pass();
  },

  // ---------------------------------------------------------
  // ENERGY FLOOR (unchanged)
  // ---------------------------------------------------------
  energyFloor(impulse) {
    if (isNaN(impulse.energy)) return fail("energy_nan");
    if (impulse.energy < 0) return fail("energy_negative");
    return pass();
  }
};

// -----------------------------------------------------------
// Immune Engine (v7.4)
// -----------------------------------------------------------

export function applyPulseImmune(impulse) {
  impulse.flags = impulse.flags || {};

  // attach immune meta
  impulse.flags.immune_meta = {
    layer: "PulseImmune",
    role: "IMMUNE_SAFETY_LAYER",
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

  const checks = [
    PulseImmune.validateStructure,
    PulseImmune.validateFlags,
    PulseImmune.pressureCheck,   // NEW v7.4
    PulseImmune.quarantine,
    PulseImmune.routeSanity,
    PulseImmune.energyFloor
  ];

  for (const check of checks) {
    const result = check(impulse);
    if (!result.ok) {
      impulse.flags[`immune_${result.reason}`] = true;
      impulse.flags.immune_failed = true;
      return impulse;
    }
  }

  impulse.flags.immune_passed = true;
  return impulse;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function pass() {
  return { ok: true };
}

function fail(reason) {
  return { ok: false, reason };
}
