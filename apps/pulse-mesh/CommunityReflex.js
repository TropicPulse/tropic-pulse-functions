// [pulse:mesh] COMMUNITY_REFLEX_LAYER  // amber
// - defines instinctive 1/0 decisions for mesh nodes
// - used by PulseMesh to keep/drop/shape impulses
// - fast, local, cheap survival-pattern routing
// - NEVER touches payload data, only impulse metadata

// -----------------------------------------------------------
// Reflex Pack: instinct rules
// -----------------------------------------------------------

export const CommunityReflex = {
  // [pulse:mesh] REFLEX_OVERLOAD  // red
  // - drop if node is overloaded or unhealthy
  overload(impulse, node) {
    if (node.load && node.load > 0.85) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_ENERGY  // amber
  // - drop if impulse energy is too low
  energy(impulse) {
    if (impulse.energy <= 0.05) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_HOPS  // amber
  // - prevent runaway bouncing
  hops(impulse) {
    if ((impulse.hops || 0) > 32) return 0;
    return 1;
  },

  // [pulse:mesh] REFLEX_TRUST_PATH  // teal
  // - prefer trusted neighbors or trusted earners
  trust(impulse, node) {
    if (!node.trustLevel) return 1;
    if (node.trustLevel >= 0.5) return 1;
    return 0;
  },

  // [pulse:mesh] REFLEX_PRIORITY  // purple
  // - high-priority impulses always pass
  priority(impulse) {
    if (impulse.score >= 0.8) return 1;
    return 1; // default pass
  },

  // [pulse:mesh] REFLEX_EARNER_TARGETING  // purple
  // - if this node is an earner and matches routeHint, pass
  earnerTargeting(impulse, node) {
    if (node.kind !== 'earner') return 1;
    if (!impulse.routeHint) return 1;
    if (impulse.routeHint === node.id) return 1;
    if (impulse.routeHint === node.kind) return 1;
    return 0;
  },

  // [pulse:mesh] REFLEX_ANOMALY_FLAG  // magenta
  // - if cortex flagged anomaly, allow pass but mark it
  anomaly(impulse) {
    if (impulse.flags?.cortex_anomaly) return 1;
    return 1;
  },
};

// -----------------------------------------------------------
// Combined Reflex Engine
// -----------------------------------------------------------

export function createCommunityReflex() {
  // [pulse:mesh] REFLEX_ENGINE  // amber
  // - runs all reflex rules in sequence
  // - if ANY rule returns 0 → drop
  // - otherwise → pass (1)

  const reflexFns = [
    CommunityReflex.overload,
    CommunityReflex.energy,
    CommunityReflex.hops,
    CommunityReflex.trust,
    CommunityReflex.priority,
    CommunityReflex.earnerTargeting,
    CommunityReflex.anomaly,
  ];

  return function communityReflex(impulse, node) {
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
