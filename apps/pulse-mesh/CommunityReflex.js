// ============================================================================
// [pulse:mesh] COMMUNITY_REFLEX_LAYER v7.4  // amber
// Distributed Survival Arc • Fast Local Instinct Engine • Pure 1/0 Decisions
// ============================================================================
//
// NEW IN v7.4:
//  • Reflex is now aware of:
//      - Flow pressure (0–1)
//      - Recent throttle rate (0–1)
//      - Aura tension tags
//      - Stabilization-needed tags
//      - Drift pressure
//  • Reflex can instantly drop impulses when the organism is under tension.
//  • Still deterministic, metadata-only, zero payload mutation.
// ============================================================================

// -----------------------------------------------------------
// Reflex Pack: instinct rules (v7.4)
// -----------------------------------------------------------

export const CommunityReflex = {
  // [pulse:mesh] REFLEX_OVERLOAD  // red
  overload(impulse, node) {
    if (node.load && node.load > 0.85) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_ENERGY  // amber
  energy(impulse) {
    if (impulse.energy <= 0.05) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_HOPS  // amber
  hops(impulse) {
    if ((impulse.hops || 0) > 32) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_TRUST_PATH  // teal
  trust(impulse, node) {
    if (!node.trustLevel) return 1;
    if (node.trustLevel >= 0.5) return 1;
    return 0;
  },

  // [pulse:mesh] REFLEX_PRIORITY  // purple
  priority(impulse) {
    if (impulse.score >= 0.8) return 1;
    return 1;
  },

  // [pulse:mesh] REFLEX_EARNER_TARGETING  // purple
  earnerTargeting(impulse, node) {
    if (node.kind !== "earner") return 1;
    if (!impulse.routeHint) return 1;
    if (impulse.routeHint === node.id) return 1;
    if (impulse.routeHint === node.kind) return 1;
    return 0;
  },

  // [pulse:mesh] REFLEX_ANOMALY_FLAG  // magenta
  anomaly(impulse) {
    if (impulse.flags?.cortex_anomaly) return 1;
    return 1;
  },

  // ---------------------------------------------------------
  // NEW v7.4 REFLEX: SYSTEM PRESSURE AWARENESS
  // ---------------------------------------------------------

  // [pulse:mesh] REFLEX_FLOW_PRESSURE  // amber
  flowPressure(impulse) {
    const p = impulse.flags?.flow_pressure || 0;
    if (p > 0.7) return 0;     // organism under heavy tension → drop
    return 1;
  },

  // [pulse:mesh] REFLEX_THROTTLE_HISTORY  // amber
  throttleHistory(impulse) {
    const t = impulse.flags?.recent_throttle_rate || 0;
    if (t > 0.3) return 0;     // too many recent brakes → drop early
    return 1;
  },

  // [pulse:mesh] REFLEX_AURA_TENSION  // violet
  auraTension(impulse) {
    if (impulse.flags?.aura_system_under_tension) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_STABILIZATION_NEEDED  // violet
  stabilization(impulse) {
    if (impulse.flags?.aura_stabilization_needed) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_DRIFT_PRESSURE  // magenta
  driftPressure(impulse) {
    const drift = impulse.flags?.drift_pressure || 0;
    if (drift > 0.5) return 0;
    return 1;
  }
};

// -----------------------------------------------------------
// Combined Reflex Engine (v7.4)
// -----------------------------------------------------------

export function createCommunityReflex() {
  const reflexFns = [
    CommunityReflex.overload,
    CommunityReflex.energy,
    CommunityReflex.hops,
    CommunityReflex.trust,
    CommunityReflex.priority,
    CommunityReflex.earnerTargeting,
    CommunityReflex.anomaly,

    // NEW v7.4 survival-pressure instincts
    CommunityReflex.flowPressure,
    CommunityReflex.throttleHistory,
    CommunityReflex.auraTension,
    CommunityReflex.stabilization,
    CommunityReflex.driftPressure
  ];

  const meta = {
    layer: "CommunityReflex",
    role: "MESH_REFLEX_ARC",
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

  return function communityReflex(impulse, node) {
    impulse.meta = impulse.meta || {};
    impulse.meta.reflex = meta;

    for (const fn of reflexFns) {
      const decision = fn(impulse, node);
      if (decision === 0) {
        impulse.flags = impulse.flags || {};
        impulse.flags[`reflex_${fn.name}_drop`] = true;
        return 0;
      }
    }
    return 1;
  };
}
