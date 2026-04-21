// ============================================================================
//  PULSE OS v7.7 — SURVIVAL INSTINCTS LAYER  // amber
//  “Skin-Level Reflex Arc”
//  Distributed Survival Arc • Fast Local Instinct Engine • Pure 1/0 Decisions
// ============================================================================
//
//  IDENTITY (v7.7):
//  ----------------
//  • Lowest-level survival organ (skin + spinal reflex).
//  • Pure 1/0 instinct engine — no compute, no routing, no shaping.
//  • Drops or keeps impulses instantly based on local pressure.
//  • Zero payload mutation — metadata-only.
//  • Deterministic, drift-proof, AND-architecture aligned.
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//  • Skin Reflex → instant survival decisions.
//  • Local Instinct → no cortex, no hormones, no global awareness.
//  • Pressure Guard → drops impulses under tension.
//  • Mesh Safety → prevents overload, drift, runaway impulses.
//
//  NEW IN v7.7+:
//  -------------
//  • Instincts aware of:
//      - Flow pressure (0–1)
//      - Recent throttle rate (0–1)
//      - Aura tension tags
//      - Stabilization-needed tags
//      - Drift pressure
//  • Reflex can instantly drop impulses when the organism is under tension.
//  • Still deterministic, metadata-only, zero payload mutation.
// ============================================================================


// -----------------------------------------------------------
//  Instinct Pack (v7.7)
// -----------------------------------------------------------

export const SurvivalInstincts = {

  // [pulse:mesh] INSTINCT_OVERLOAD  // red
  overload(impulse, node) {
    if (node.load && node.load > 0.85) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_ENERGY  // amber
  energy(impulse) {
    if (impulse.energy <= 0.05) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_HOPS  // amber
  hops(impulse) {
    if ((impulse.hops || 0) > 32) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_TRUST_PATH  // teal
  trust(impulse, node) {
    if (!node.trustLevel) return 1;
    if (node.trustLevel >= 0.5) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_PRIORITY  // purple
  priority(impulse) {
    if (impulse.score >= 0.8) return 1;
    return 1;
  },

  // [pulse:mesh] INSTINCT_EARNER_TARGETING  // purple
  earnerTargeting(impulse, node) {
    if (node.kind !== "earner") return 1;
    if (!impulse.routeHint) return 1;
    if (impulse.routeHint === node.id) return 1;
    if (impulse.routeHint === node.kind) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_ANOMALY_FLAG  // magenta
  anomaly(impulse) {
    if (impulse.flags?.cortex_anomaly) return 1;
    return 1;
  },

  // ---------------------------------------------------------
  //  v7.7+ SYSTEM PRESSURE INSTINCTS
  // ---------------------------------------------------------

  // [pulse:mesh] INSTINCT_FLOW_PRESSURE  // amber
  flowPressure(impulse) {
    const p = impulse.flags?.flow_pressure || 0;
    if (p > 0.7) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_THROTTLE_HISTORY  // amber
  throttleHistory(impulse) {
    const t = impulse.flags?.recent_throttle_rate || 0;
    if (t > 0.3) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_AURA_TENSION  // violet
  auraTension(impulse) {
    if (impulse.flags?.aura_system_under_tension) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_STABILIZATION_NEEDED  // violet
  stabilization(impulse) {
    if (impulse.flags?.aura_stabilization_needed) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_DRIFT_PRESSURE  // magenta
  driftPressure(impulse) {
    const drift = impulse.flags?.drift_pressure || 0;
    if (drift > 0.5) return 0;
    return 1;
  }
};


// -----------------------------------------------------------
//  Combined Survival Instinct Engine (v7.7)
// -----------------------------------------------------------

export function createSurvivalInstincts() {

  const instinctFns = [
    SurvivalInstincts.overload,
    SurvivalInstincts.energy,
    SurvivalInstincts.hops,
    SurvivalInstincts.trust,
    SurvivalInstincts.priority,
    SurvivalInstincts.earnerTargeting,
    SurvivalInstincts.anomaly,

    // v7.7+ pressure instincts
    SurvivalInstincts.flowPressure,
    SurvivalInstincts.throttleHistory,
    SurvivalInstincts.auraTension,
    SurvivalInstincts.stabilization,
    SurvivalInstincts.driftPressure
  ];

  const meta = {
    layer: "SurvivalInstincts",
    role: "MESH_SPINAL_REFLEX",
    version: "7.7",
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

  return function survivalInstinctEngine(impulse, node) {
    impulse.meta = impulse.meta || {};
    impulse.meta.reflex = meta;

    for (const fn of instinctFns) {
      const decision = fn(impulse, node);
      if (decision === 0) {
        impulse.flags = impulse.flags || {};
        impulse.flags[`instinct_${fn.name}_drop`] = true;
        return 0;
      }
    }

    return 1;
  };
}
