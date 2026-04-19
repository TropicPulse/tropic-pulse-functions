// [pulse:mesh] COMMUNITY_HORMONE_LAYER  // pink
// - global modulation signals that influence impulse metadata
// - boosts, dampens, stabilizes, or cools routing behavior
// - NEVER computes payloads, NEVER mutates data content
// - metadata-only global context for Reflex, Cortex, Tendons, Organs

// -----------------------------------------------------------
// Hormone State (global, metadata-only)
// -----------------------------------------------------------

const HormoneState = {
  boost: 0.0,        // increases impulse score
  dampen: 0.0,       // decreases impulse score
  urgency: 0.0,      // increases energy shaping
  cooling: 0.0,      // reduces energy shaping
  stability: 0.0,    // reduces reflex drops
  loadSignal: 0.0,   // global load indicator
};

// -----------------------------------------------------------
// Hormone Pack: modulation rules
// -----------------------------------------------------------

export const PulseHormones = {
  // [pulse:mesh] HORMONE_BOOST  // pink
  // - increases impulse score globally
  applyBoost(impulse) {
    if (HormoneState.boost > 0) {
      impulse.score = clamp01(impulse.score + HormoneState.boost * 0.2);
    }
  },

  // [pulse:mesh] HORMONE_DAMPEN  // pink
  // - decreases impulse score globally
  applyDampen(impulse) {
    if (HormoneState.dampen > 0) {
      impulse.score = clamp01(impulse.score - HormoneState.dampen * 0.2);
    }
  },

  // [pulse:mesh] HORMONE_URGENCY  // pink
  // - increases energy shaping globally
  applyUrgency(impulse) {
    if (HormoneState.urgency > 0) {
      impulse.energy *= (1 + HormoneState.urgency * 0.1);
    }
  },

  // [pulse:mesh] HORMONE_COOLING  // pink
  // - reduces energy shaping globally
  applyCooling(impulse) {
    if (HormoneState.cooling > 0) {
      impulse.energy *= (1 - HormoneState.cooling * 0.1);
    }
  },

  // [pulse:mesh] HORMONE_STABILITY  // pink
  // - reduces reflex drops by softening reflex thresholds
  applyStability(impulse) {
    if (HormoneState.stability > 0) {
      impulse.flags = impulse.flags || {};
      impulse.flags['hormone_stabilized'] = true;
    }
  },

  // [pulse:mesh] HORMONE_LOAD_SIGNAL  // pink
  // - global load indicator for Cortex + Tendons
  applyLoadSignal(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags['hormone_load'] = HormoneState.loadSignal;
  },
};

// -----------------------------------------------------------
// Hormone Engine
// -----------------------------------------------------------

export function applyPulseHormones(impulse) {
  // [pulse:mesh] HORMONE_ENGINE  // pink
  // - applies all global modulation signals
  // - metadata only, no compute

  PulseHormones.applyBoost(impulse);
  PulseHormones.applyDampen(impulse);
  PulseHormones.applyUrgency(impulse);
  PulseHormones.applyCooling(impulse);
  PulseHormones.applyStability(impulse);
  PulseHormones.applyLoadSignal(impulse);

  impulse.flags = impulse.flags || {};
  impulse.flags['hormones_applied'] = true;

  return impulse;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
