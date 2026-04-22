// ============================================================================
//  PULSE OS v9.2 — SURVIVAL INSTINCTS LAYER  // amber
//  “Skin-Level Reflex Arc / Local-First Safety Gate”
//  Distributed Survival Arc • Fast Local Instinct Engine • Pure 1/0 Decisions
// ============================================================================
//
//  IDENTITY (v9.2):
//  ----------------
//  • Lowest-level survival organ (skin + spinal reflex).
//  • Pure 1/0 instinct engine — no compute, no routing, no shaping.
//  • Drops or keeps impulses instantly based on local pressure + route mode.
//  • Zero payload mutation — metadata-only.
//  • Deterministic, drift-proof, AND-architecture aligned.
//  • Aware of mesh signal factoring pressure (metadata-only).
//  • Local-first: prefers local/cluster paths over internet paths.
//  • Internet-limited: can hard-drop or strongly gate internet impulses.
//
//  ROLE IN THE DIGITAL BODY (v9.2):
//  --------------------------------
//  • Skin Reflex → instant survival decisions.
//  • Local Instinct → no cortex, no hormones, no global awareness.
//  • Pressure Guard → drops impulses under tension.
//  • Mesh Safety → prevents overload, drift, runaway impulses.
//  • Factoring Awareness → can drop impulses when factoring pressure is high.
//  • Route Mode Guard → can drop or gate internet-mode nodes under stress.
//
//  NEW IN v9.2:
//  ------------
//  • Instincts aware of:
//      - Flow pressure (0–1)
//      - Recent throttle rate (0–1)
//      - Aura tension tags
//      - Stabilization-needed tags
//      - Drift pressure
//      - Mesh factoring bias (metadata-only)
//      - Node route mode: local / cluster / internet (metadata-only)
//  • Reflex can instantly drop impulses under factoring tension.
//  • Reflex can drop or gate internet-mode nodes when system is stressed.
//  • Still deterministic, metadata-only, zero payload mutation.
// ============================================================================


// -----------------------------------------------------------
//  Instinct Pack (v9.2)
// -----------------------------------------------------------

export const SurvivalInstincts = {

  // [pulse:mesh] INSTINCT_OVERLOAD  // red
  // Drop when node is heavily loaded.
  overload(impulse, node) {
    if (node.load && node.load > 0.85) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_ENERGY  // amber
  // Drop when impulse is out of energy.
  energy(impulse) {
    if (impulse.energy <= 0.05) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_HOPS  // amber
  // Drop when hop count is too high (runaway prevention).
  hops(impulse) {
    if ((impulse.hops || 0) > 32) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_TRUST_PATH  // teal
  // Drop when node trust is too low.
  trust(impulse, node) {
    if (!node.trustLevel) return 1;
    if (node.trustLevel >= 0.5) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_PRIORITY  // purple
  // Currently neutral — keeps all; reserved for future priority shaping.
  priority(impulse) {
    if (impulse.score >= 0.8) return 1;
    return 1;
  },

  // [pulse:mesh] INSTINCT_EARNER_TARGETING  // purple
  // Drop when earner targeting is clearly wrong.
  earnerTargeting(impulse, node) {
    if (node.kind !== "earner") return 1;
    if (!impulse.routeHint) return 1;
    if (impulse.routeHint === node.id) return 1;
    if (impulse.routeHint === node.kind) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_ANOMALY_FLAG  // magenta
  // Drop when cortex has already flagged anomaly.
  anomaly(impulse) {
    if (impulse.flags?.cortex_anomaly) return 0;
    return 1;
  },

  // ---------------------------------------------------------
  //  v9.2 SYSTEM PRESSURE INSTINCTS
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
  },

  // ---------------------------------------------------------
  //  v9.2 FACTORING PRESSURE INSTINCT (metadata-only)
  // ---------------------------------------------------------

  // [pulse:mesh] INSTINCT_FACTORING_PRESSURE  // gold
  factoringPressure(impulse) {
    const bias = impulse.flags?.aura_factoring_bias || 0;
    if (bias > 0.6) return 0;   // high factoring pressure → drop
    return 1;
  },

  // ---------------------------------------------------------
  //  v9.2 ROUTE MODE INSTINCTS (local-first, internet-limited)
  // ---------------------------------------------------------

  // [pulse:mesh] INSTINCT_INTERNET_MODE_GUARD  // blue-gold
  // If node.mode === "internet" and system is under pressure, drop.
  internetModeGuard(impulse, node) {
    const mode = node.mode || "local"; // metadata-only
    if (mode !== "internet") return 1;

    const flow = impulse.flags?.flow_pressure || 0;
    const drift = impulse.flags?.drift_pressure || 0;
    const throttle = impulse.flags?.recent_throttle_rate || 0;
    const auraTension = impulse.flags?.aura_system_under_tension ? 1 : 0;

    const pressureScore =
      flow * 0.35 +
      drift * 0.25 +
      throttle * 0.2 +
      auraTension * 0.2;

    // Under moderate or higher pressure, block internet-mode hops.
    if (pressureScore > 0.35) return 0;

    return 1;
  },

  // [pulse:mesh] INSTINCT_LOCAL_PREFERENCE_TAG  // green
  // Does not drop — only tags impulses that are clearly local-preferred.
  localPreferenceTag(impulse, node) {
    const mode = node.mode || "local";
    if (mode === "local" || mode === "cluster") {
      impulse.flags = impulse.flags || {};
      impulse.flags.instinct_local_preferred = true;
    }
    return 1;
  }
};


// -----------------------------------------------------------
//  Combined Survival Instinct Engine (v9.2)
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

    // v9.2 pressure instincts
    SurvivalInstincts.flowPressure,
    SurvivalInstincts.throttleHistory,
    SurvivalInstincts.auraTension,
    SurvivalInstincts.stabilization,
    SurvivalInstincts.driftPressure,

    // factoring pressure instinct
    SurvivalInstincts.factoringPressure,

    // route mode instincts (local-first, internet-limited)
    SurvivalInstincts.internetModeGuard,
    SurvivalInstincts.localPreferenceTag
  ];

  const meta = {
    layer: "SurvivalInstincts",
    role: "MESH_SPINAL_REFLEX",
    version: "9.2",
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
      futureEvolutionReady: true,
      signalFactoringAware: true
    }
  };

  return function survivalInstinctEngine(impulse, node) {
    impulse.meta = impulse.meta || {};
    impulse.meta.reflex = meta;
    impulse.flags = impulse.flags || {};

    for (const fn of instinctFns) {
      const decision = fn(impulse, node);
      if (decision === 0) {
        impulse.flags[`instinct_${fn.name}_drop`] = true;
        return 0;
      }
    }

    return 1;
  };
}
