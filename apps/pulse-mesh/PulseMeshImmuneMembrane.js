// ============================================================================
//  PULSE OS v7.7 — IMMUNE MEMBRANE LAYER  // red
//  “System Safety Membrane / Validation / Quarantine / Metadata‑Only”
// ============================================================================
//
//  IDENTITY — THE IMMUNE MEMBRANE (v7.7):
//  --------------------------------------
//  • First immune filter — blocks malformed or unsafe impulses.
//  • Reads system pressure signals to decide quarantine.
//  • Pure metadata-only — zero payload mutation.
//  • Deterministic, drift-proof, AND-architecture aligned.
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//  • Immune Membrane → blocks unsafe impulses at the boundary.
//  • Pressure-Aware Firewall → quarantines under tension.
//  • Structural Validator → ensures impulse integrity.
//  • Route Sanity Checker → prevents invalid routing hints.
//
//  SAFETY CONTRACT:
//  ----------------
//  • No routing, no compute, no shaping.
//  • No payload mutation.
//  • No healing — only blocking/quarantine.
//  • Pure metadata-only, reversible, safe.
// ============================================================================

import { PulseField } from "./PulseMeshEnvironmentalField.js";

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
    if (keys.length > 96) return fail("too_many_flags"); // v7.7: safe upper bound
    return pass();
  },

  // ---------------------------------------------------------
  // SYSTEM PRESSURE CHECKS (v7.7)
  // ---------------------------------------------------------
  pressureCheck(impulse) {
    const field = PulseField.snapshot();

    const flow = field.flowPressure || 0;
    const drift = field.driftPressure || 0;
    const throttle = field.throttleRate || 0;
    const aura = field.auraTension || 0;
    const reflexDrops = field.reflexDropRate || 0;
    const storm = field.meshStormPressure || 0;

    if (flow > 0.7) return fail("flow_pressure_high");
    if (drift > 0.5) return fail("drift_pressure_high");
    if (throttle > 0.3) return fail("throttle_rate_high");
    if (aura > 0.4) return fail("aura_tension_high");
    if (reflexDrops > 0.4) return fail("reflex_drop_storm");
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

// ============================================================================
//  IMMUNE MEMBRANE ENGINE (v7.7)
// ============================================================================
export function applyPulseImmune(impulse) {
  impulse.flags = impulse.flags || {};

  impulse.flags.immune_meta = {
    layer: "PulseImmune",
    role: "IMMUNE_MEMBRANE",
    version: 7.7,
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
    PulseImmune.pressureCheck,
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

// ============================================================================
// HELPERS
// ============================================================================
function pass() {
  return { ok: true };
}

function fail(reason) {
  return { ok: false, reason };
}
