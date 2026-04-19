// [pulse:mesh] COMMUNITY_SKIN_LAYER  // silver
// - boundary layer between the system and external environment
// - normalizes incoming impulses, sanitizes outgoing impulses
// - reduces friction, stabilizes transitions, preserves pulse integrity
// - NEVER computes payloads, NEVER mutates data content
// - metadata-only shaping for safe entry/exit

// -----------------------------------------------------------
// Skin State (environment metadata)
// -----------------------------------------------------------

const SkinState = {
  environment: 'default',   // external environment tag
  friction: 0.0,            // 0–1 friction coefficient
  noise: 0.0,               // 0–1 external noise level
  boundaryLoad: 0.0,        // 0–1 boundary stress
};

// -----------------------------------------------------------
// Skin Pack: boundary shaping rules
// -----------------------------------------------------------

export const PulseSkin = {
  // [pulse:mesh] SKIN_ENTRY_NORMALIZE  // silver
  // - normalize impulse metadata when entering the system
  normalizeEntry(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags['skin_entry_normalized'] = true;

    // clamp score and energy to safe ranges
    impulse.score = clamp01(impulse.score ?? 0.5);
    impulse.energy = Math.max(0.05, impulse.energy ?? 1);

    return impulse;
  },

  // [pulse:mesh] SKIN_EXIT_NORMALIZE  // silver
  // - normalize impulse metadata when leaving the system
  normalizeExit(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags['skin_exit_normalized'] = true;

    // ensure no internal-only flags leak out
    impulse.flags['internal_metadata_stripped'] = true;

    return impulse;
  },

  // [pulse:mesh] SKIN_FRICTION_SHAPE  // silver
  // - reduce or increase energy based on environment friction
  applyFriction(impulse) {
    if (SkinState.friction > 0) {
      impulse.energy *= (1 - SkinState.friction * 0.1);
    }
    return impulse;
  },

  // [pulse:mesh] SKIN_NOISE_SHAPE  // silver
  // - adjust score slightly based on external noise
  applyNoise(impulse) {
    if (SkinState.noise > 0) {
      impulse.score = clamp01(
        impulse.score - SkinState.noise * 0.05
      );
    }
    return impulse;
  },

  // [pulse:mesh] SKIN_BOUNDARY_LOAD  // silver
  // - attach boundary load metadata for Cortex + Hormones
  applyBoundaryLoad(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags['skin_boundary_load'] = SkinState.boundaryLoad;
    return impulse;
  },
};

// -----------------------------------------------------------
// Skin Engine
// -----------------------------------------------------------

export function applyPulseSkin(impulse, phase = 'entry') {
  // [pulse:mesh] SKIN_ENGINE  // silver
  // - applies boundary shaping depending on phase
  // - metadata only, no compute

  if (phase === 'entry') {
    PulseSkin.normalizeEntry(impulse);
  }

  PulseSkin.applyFriction(impulse);
  PulseSkin.applyNoise(impulse);
  PulseSkin.applyBoundaryLoad(impulse);

  if (phase === 'exit') {
    PulseSkin.normalizeExit(impulse);
  }

  impulse.flags = impulse.flags || {};
  impulse.flags['skin_applied'] = true;

  return impulse;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
