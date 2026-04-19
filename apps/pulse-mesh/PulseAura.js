// [pulse:mesh] COMMUNITY_AURA_LAYER  // violet
// - system-wide "field" around all pulses and instances
// - defines loop fields (stabilization loops) and sync fields (multi-instance resonance)
// - NEVER computes payloads, NEVER mutates data content
// - metadata-only: tags, fields, and gentle shaping hints

// -----------------------------------------------------------
// Aura State (global, metadata-only)
// -----------------------------------------------------------

const AuraState = {
  // loop field: controlled stabilization loops
  loopStrength: 0.0,      // 0–1: how strongly we try to pull drifting pulses into loops
  loopMaxDepth: 3,        // max times an impulse can be loop-tagged

  // sync field: multi-instance resonance
  instanceId: 'instance-1',
  clusterId: 'cluster-default',
  syncStrength: 0.0,      // 0–1: how strongly we care about cross-instance alignment
};

// -----------------------------------------------------------
// Aura Pack: loop + sync behaviors (metadata-only)
// -----------------------------------------------------------

export const PulseAura = {
  // [pulse:mesh] AURA_LOOP_TAG  // violet
  // - tag impulse as part of a stabilization loop if it looks drifted
  tagLoop(impulse) {
    impulse.flags = impulse.flags || {};

    const drifted =
      impulse.flags?.cortex_anomaly ||
      impulse.flags?.immune_quarantined ||
      impulse.flags?.skin_boundary_load > 0.7;

    const currentDepth = impulse.flags?.aura_loop_depth || 0;

    if (drifted && AuraState.loopStrength > 0 && currentDepth < AuraState.loopMaxDepth) {
      impulse.flags['aura_in_loop'] = true;
      impulse.flags['aura_loop_depth'] = currentDepth + 1;
    }

    return impulse;
  },

  // [pulse:mesh] AURA_LOOP_HINT  // violet
  // - provide a gentle hint that this impulse prefers stabilizing routes
  loopHint(impulse) {
    if (!impulse.flags?.aura_in_loop) return impulse;

    impulse.flags['aura_prefers_stable_routes'] = true;
    return impulse;
  },

  // [pulse:mesh] AURA_SYNC_TAG  // violet
  // - tag impulse with instance + cluster identity
  tagSync(impulse) {
    impulse.flags = impulse.flags || {};

    impulse.flags['aura_instance'] = AuraState.instanceId;
    impulse.flags['aura_cluster'] = AuraState.clusterId;

    return impulse;
  },

  // [pulse:mesh] AURA_SYNC_HINT  // violet
  // - gentle hint that this impulse should be considered for cross-instance comparison
  syncHint(impulse) {
    if (AuraState.syncStrength <= 0) return impulse;

    impulse.flags = impulse.flags || {};
    impulse.flags['aura_sync_candidate'] = true;

    return impulse;
  },
};

// -----------------------------------------------------------
// Aura Engine
// -----------------------------------------------------------

export function applyPulseAura(impulse) {
  // [pulse:mesh] AURA_ENGINE  // violet
  // - applies loop + sync fields to the impulse
  // - metadata only, no compute

  PulseAura.tagLoop(impulse);
  PulseAura.loopHint(impulse);
  PulseAura.tagSync(impulse);
  PulseAura.syncHint(impulse);

  impulse.flags = impulse.flags || {};
  impulse.flags['aura_applied'] = true;

  return impulse;
}
