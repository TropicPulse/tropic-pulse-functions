// [pulse:mesh] COMMUNITY_IMMUNE_LAYER  // red
// - protects the system from malformed or unsafe impulses
// - validates metadata, quarantines anomalies, stabilizes routing
// - NEVER computes payloads, NEVER mutates data content
// - metadata-only safety layer between Organs and Earners

// -----------------------------------------------------------
// Immune Pack: protection rules
// -----------------------------------------------------------

export const PulseImmune = {
  // [pulse:mesh] IMMUNE_VALIDATE_STRUCTURE  // red
  // - ensure impulse has required metadata fields
  validateStructure(impulse) {
    if (!impulse.id) return fail('missing_id');
    if (!impulse.payloadRef) return fail('missing_payloadRef');
    if (typeof impulse.energy !== 'number') return fail('invalid_energy');
    if (typeof impulse.score !== 'number') return fail('invalid_score');
    return pass();
  },

  // [pulse:mesh] IMMUNE_VALIDATE_FLAGS  // red
  // - ensure flags object is safe and not oversized
  validateFlags(impulse) {
    const flags = impulse.flags || {};
    const keys = Object.keys(flags);

    if (keys.length > 64) return fail('too_many_flags');
    return pass();
  },

  // [pulse:mesh] IMMUNE_ANOMALY_QUARANTINE  // magenta
  // - if cortex flagged anomaly, mark impulse as quarantined
  quarantine(impulse) {
    if (impulse.flags?.cortex_anomaly) {
      impulse.flags['immune_quarantined'] = true;
    }
    return pass();
  },

  // [pulse:mesh] IMMUNE_ROUTE_SANITY  // amber
  // - ensure routeHint is valid and not malformed
  routeSanity(impulse) {
    const hint = impulse.routeHint;
    if (!hint) return pass();

    if (typeof hint !== 'string') return fail('invalid_routeHint');
    if (!hint.startsWith('earner-') && !hint.startsWith('service-')) {
      return fail('unknown_routeHint');
    }

    return pass();
  },

  // [pulse:mesh] IMMUNE_ENERGY_FLOOR  // red
  // - ensure energy never drops below zero or becomes NaN
  energyFloor(impulse) {
    if (isNaN(impulse.energy)) return fail('energy_nan');
    if (impulse.energy < 0) return fail('energy_negative');
    return pass();
  },
};

// -----------------------------------------------------------
// Immune Engine
// -----------------------------------------------------------

export function applyPulseImmune(impulse) {
  // [pulse:mesh] IMMUNE_ENGINE  // red
  // - runs all immune checks
  // - if ANY fail → impulse is marked unsafe
  // - metadata only, no compute

  impulse.flags = impulse.flags || {};

  const checks = [
    PulseImmune.validateStructure,
    PulseImmune.validateFlags,
    PulseImmune.quarantine,
    PulseImmune.routeSanity,
    PulseImmune.energyFloor,
  ];

  for (const check of checks) {
    const result = check(impulse);
    if (!result.ok) {
      impulse.flags[`immune_${result.reason}`] = true;
      impulse.flags['immune_failed'] = true;
      return impulse;
    }
  }

  impulse.flags['immune_passed'] = true;
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
