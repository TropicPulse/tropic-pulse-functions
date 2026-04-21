// ============================================================================
//  PULSE OS v9.2 — IMMUNE MEMBRANE LAYER  // red
//  “System Safety Membrane / Validation / Quarantine / Metadata‑Only”
// ============================================================================
//
//  IDENTITY — IMMUNE MEMBRANE (v9.2):
//  ----------------------------------
//  • First immune filter — blocks malformed or unsafe impulses.
//  • Pure metadata-only — zero payload mutation.
//  • Zero imports — CNS injects pressure snapshot.
//  • Factoring-aware, aura-aware, drift-aware, flow-aware, mesh-aware.
//  • Deterministic-field, drift-proof, AND-architecture aligned.
//
//  SAFETY CONTRACT (v9.2):
//  -----------------------
//  • No routing, no compute, no shaping.
//  • No payload mutation.
//  • No healing — only blocking/quarantine.
//  • Pure metadata-only, reversible, safe.
// ============================================================================

export function createPulseImmune({ getPressureSnapshot }) {

  const meta = {
    layer: "PulseImmune",
    role: "IMMUNE_MEMBRANE",
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
  };

  // ---------------------------------------------------------
  // STRUCTURAL VALIDATION
  // ---------------------------------------------------------
  function validateStructure(impulse) {
    if (!impulse.id) return fail("missing_id");
    if (!impulse.payloadRef) return fail("missing_payloadRef");
    if (typeof impulse.energy !== "number") return fail("invalid_energy");
    if (typeof impulse.score !== "number") return fail("invalid_score");
    return pass();
  }

  function validateFlags(impulse) {
    const flags = impulse.flags || {};
    if (Object.keys(flags).length > 96) return fail("too_many_flags");
    return pass();
  }

  // ---------------------------------------------------------
  // v9.2 PRESSURE CHECKS (CNS-injected)
  // ---------------------------------------------------------
  function pressureCheck(impulse) {
    const p = getPressureSnapshot() || {};

    const flow = p.flowPressure || 0;
    const drift = p.driftPressure || 0;
    const throttle = p.throttleRate || 0;
    const aura = p.auraTension || 0;
    const factoring = p.factoringPressure || 0;
    const storm = p.meshStormPressure || 0;

    // v9.2 thresholds (aligned with Hormones + Field + Flow)
    if (flow > 0.7) return fail("flow_pressure_high");
    if (drift > 0.5) return fail("drift_pressure_high");
    if (throttle > 0.3) return fail("throttle_rate_high");
    if (aura > 0.4) return fail("aura_tension_high");
    if (factoring > 0.6) return fail("factoring_pressure_high");
    if (storm > 0.4) return fail("mesh_storm_pressure");

    return pass();
  }

  // ---------------------------------------------------------
  // ANOMALY QUARANTINE
  // ---------------------------------------------------------
  function quarantine(impulse) {
    if (impulse.flags?.cortex_anomaly) {
      impulse.flags.immune_quarantined = true;
    }
    if (impulse.flags?.cortex_factoring_anomaly) {
      impulse.flags.immune_quarantined = true;
    }
    return pass();
  }

  // ---------------------------------------------------------
  // ROUTE SANITY
  // ---------------------------------------------------------
  function routeSanity(impulse) {
    const hint = impulse.routeHint;
    if (!hint) return pass();

    if (typeof hint !== "string") return fail("invalid_routeHint");
    if (!hint.startsWith("earner-") && !hint.startsWith("service-")) {
      return fail("unknown_routeHint");
    }

    return pass();
  }

  // ---------------------------------------------------------
  // ENERGY FLOOR
  // ---------------------------------------------------------
  function energyFloor(impulse) {
    if (isNaN(impulse.energy)) return fail("energy_nan");
    if (impulse.energy < 0) return fail("energy_negative");
    return pass();
  }

  // ---------------------------------------------------------
  // IMMUNE ENGINE (v9.2)
  // ---------------------------------------------------------
  function applyPulseImmune(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.immune_meta = meta;

    const checks = [
      validateStructure,
      validateFlags,
      pressureCheck,
      quarantine,
      routeSanity,
      energyFloor
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

  return applyPulseImmune;
}

// -----------------------------------------------------------
// HELPERS
// -----------------------------------------------------------
function pass() { return { ok: true }; }
function fail(reason) { return { ok: false, reason }; }
