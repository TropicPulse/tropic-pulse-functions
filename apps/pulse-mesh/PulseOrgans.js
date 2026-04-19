// [pulse:mesh] COMMUNITY_ORGAN_LAYER  // orange
// - defines functional "organs" of the system (service roles)
// - maps impulses to service capabilities (metadata only)
// - attaches capability signatures + organ identity
// - NEVER computes payloads, NEVER mutates data
// - sits between Cortex/Tendons and Earners (EarnEngine)

// -----------------------------------------------------------
// Organ Pack: capability signatures
// -----------------------------------------------------------

export const PulseOrgans = {
  // [pulse:mesh] ORGAN_STORAGE  // orange
  // - services that store, retrieve, or index data (metadata only)
  storage: {
    id: 'organ-storage',
    capabilities: ['store', 'retrieve', 'index'],
    match(impulse) {
      return impulse.flags?.cortex_intent === 'normal';
    }
  },

  // [pulse:mesh] ORGAN_ROUTING  // orange
  // - services that direct, transform, or classify metadata
  routing: {
    id: 'organ-routing',
    capabilities: ['route', 'shape', 'classify'],
    match(impulse) {
      return impulse.score >= 0.5;
    }
  },

  // [pulse:mesh] ORGAN_SECURITY  // orange
  // - services that validate, verify, or protect metadata
  security: {
    id: 'organ-security',
    capabilities: ['validate', 'verify', 'protect'],
    match(impulse) {
      return impulse.flags?.cortex_anomaly === true;
    }
  },

  // [pulse:mesh] ORGAN_EARN  // orange
  // - services that prepare impulses for earners (EarnEngine)
  earnPrep: {
    id: 'organ-earnprep',
    capabilities: ['prepare', 'shape_intent', 'assign_earner'],
    match(impulse) {
      return impulse.routeHint?.startsWith('earner-');
    }
  },
};

// -----------------------------------------------------------
// Organ Engine
// -----------------------------------------------------------

export function applyPulseOrgans(impulse) {
  // [pulse:mesh] ORGAN_ENGINE  // orange
  // - determines which organ(s) the impulse belongs to
  // - attaches organ identity + capability signature
  // - metadata only, no compute

  impulse.flags = impulse.flags || {};
  impulse.organs = [];

  for (const key of Object.keys(PulseOrgans)) {
    const organ = PulseOrgans[key];
    if (organ.match(impulse)) {
      impulse.organs.push(organ.id);
      impulse.flags[`organ_${organ.id}`] = true;
    }
  }

  return impulse;
}
