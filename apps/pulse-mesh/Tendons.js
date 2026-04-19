// [pulse:mesh] COMMUNITY_TENDON_LAYER  // green
// - translates mesh-level routing signals into earner-ready intent
// - attaches action hints, earner class, and execution context
// - NEVER computes payloads, NEVER mutates data
// - pure connective tissue between spine (PulseMesh) and earners (EarnEngine)

// -----------------------------------------------------------
// Tendon Pack: shaping impulse intent
// -----------------------------------------------------------

export const Tendons = {
  // [pulse:mesh] TENDON_CLASSIFY  // green
  // - classify impulse into an earner class (light, medium, heavy)
  classify(impulse) {
    const score = impulse.score || 0;

    if (score >= 0.85) return 'heavy';
    if (score >= 0.45) return 'medium';
    return 'light';
  },

  // [pulse:mesh] TENDON_ROUTE_HINT  // teal
  // - attach a routeHint based on earner class
  routeHint(impulse) {
    const cls = Tendons.classify(impulse);

    switch (cls) {
      case 'heavy':
        impulse.routeHint = 'earner-heavy';
        break;
      case 'medium':
        impulse.routeHint = 'earner-medium';
        break;
      default:
        impulse.routeHint = 'earner-light';
    }

    return impulse;
  },

  // [pulse:mesh] TENDON_ENERGY_SHAPE  // amber
  // - adjust energy to reflect urgency
  shapeEnergy(impulse) {
    const cls = Tendons.classify(impulse);

    if (cls === 'heavy') impulse.energy *= 1.1;
    if (cls === 'light') impulse.energy *= 0.9;

    return impulse;
  },

  // [pulse:mesh] TENDON_FLAGS  // purple
  // - tag impulse with tendon metadata
  tag(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags[`tendon_class_${Tendons.classify(impulse)}`] = true;
    return impulse;
  },
};

// -----------------------------------------------------------
// Tendon Engine
// -----------------------------------------------------------

export function applyTendons(impulse) {
  // [pulse:mesh] TENDON_ENGINE  // green
  // - runs tendon shaping pipeline
  // - prepares impulse for earner targeting
  // - does NOT compute payloads

  Tendons.routeHint(impulse);
  Tendons.shapeEnergy(impulse);
  Tendons.tag(impulse);

  return impulse;
}
