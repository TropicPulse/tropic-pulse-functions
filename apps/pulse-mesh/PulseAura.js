// ============================================================================
// [pulse:mesh] COMMUNITY_AURA_LAYER v7.4  // violet
// System-wide Field Layer • Stabilization Loops • Multi-Instance Resonance
// Metadata-only • Zero Compute • Zero Payload Mutation
// ============================================================================
//
// IDENTITY — THE AURA FIELD:
//  --------------------------
//  • The organism-wide field surrounding all pulses and instances.
//  • Provides stabilization loops (loop field).
//  • Provides multi-instance resonance (sync field).
//  • NEW: senses Flow pressure + recent throttles → adaptive stabilization.
//  • Metadata-only: tags, hints, and gentle shaping fields.
//  • Advantage-cascade aware: inherits any systemic speed/efficiency gain.
//
// ROLE IN THE MESH ORGANISM:
//  ---------------------------
//  • Reflex Arc → 1/0 survival decisions
//  • Aura Field → stabilization + resonance + tension sensing
//  • Cortex → strategic shaping
//  • Tendons → routing hints
//  • Immune → anomaly flags
//  • Mesh Spine → distributed conduction
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No payload mutation
//  • No async
//  • Fail-open: missing fields → safe defaults
//  • Deterministic: same impulse → same aura tags
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • Inherits ANY advantage from ANY organ automatically.
//  • No OR — all advantages are inherited automatically.
//  • Any future evolutionary advantage is included unless unsafe.
// ============================================================================

// -----------------------------------------------------------
// Aura State (global, metadata-only)
// -----------------------------------------------------------

const AuraState = {
  // loop field: controlled stabilization loops
  loopStrength: 0.0,      // 0–1: stabilization pull
  loopMaxDepth: 3,        // max loop-tag depth

  // sync field: multi-instance resonance
  instanceId: "instance-1",
  clusterId: "cluster-default",
  syncStrength: 0.0,      // 0–1: resonance strength

  // NEW: stabilization pressure from Flow/Halo
  flowPressure: 0.0,          // 0–1: how close Flow is to throttling
  recentThrottleRate: 0.0,    // 0–1: fraction of impulses throttled recently

  meta: {
    layer: "PulseAura",
    role: "AURA_FIELD",
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
  }
};

// -----------------------------------------------------------
// Aura Pack: loop + sync + stabilization behaviors
// -----------------------------------------------------------

export const PulseAura = {
  // [pulse:mesh] AURA_STABILIZATION_SENSE  // violet
  // - sense Flow pressure + throttle rate → adjust loop/sync strength
  senseStabilization(impulse) {
    const p = AuraState.flowPressure;
    const t = AuraState.recentThrottleRate;

    impulse.flags = impulse.flags || {};

    // Tag impulses when the organism is under tension
    if (p > 0.3 || t > 0.1) {
      impulse.flags["aura_system_under_tension"] = true;
    }

    // Tag impulses that need stabilization
    if (p > 0.5 || t > 0.2) {
      impulse.flags["aura_stabilization_needed"] = true;
    }

    return impulse;
  },

  // [pulse:mesh] AURA_LOOP_TAG  // violet
  tagLoop(impulse) {
    impulse.flags = impulse.flags || {};

    const drifted =
      impulse.flags?.cortex_anomaly ||
      impulse.flags?.immune_quarantined ||
      impulse.flags?.aura_stabilization_needed ||
      impulse.flags?.skin_boundary_load > 0.7;

    const currentDepth = impulse.flags?.aura_loop_depth || 0;

    if (
      drifted &&
      AuraState.loopStrength > 0 &&
      currentDepth < AuraState.loopMaxDepth
    ) {
      impulse.flags["aura_in_loop"] = true;
      impulse.flags["aura_loop_depth"] = currentDepth + 1;
    }

    return impulse;
  },

  // [pulse:mesh] AURA_LOOP_HINT  // violet
  loopHint(impulse) {
    if (!impulse.flags?.aura_in_loop) return impulse;
    impulse.flags["aura_prefers_stable_routes"] = true;
    return impulse;
  },

  // [pulse:mesh] AURA_SYNC_TAG  // violet
  tagSync(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_instance"] = AuraState.instanceId;
    impulse.flags["aura_cluster"] = AuraState.clusterId;
    return impulse;
  },

  // [pulse:mesh] AURA_SYNC_HINT  // violet
  syncHint(impulse) {
    if (AuraState.syncStrength <= 0) return impulse;
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_sync_candidate"] = true;
    return impulse;
  }
};

// -----------------------------------------------------------
// Aura Engine
// -----------------------------------------------------------

export function applyPulseAura(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.flags.aura_meta = AuraState.meta;

  // NEW: stabilization sensing
  PulseAura.senseStabilization(impulse);

  // loop + sync fields
  PulseAura.tagLoop(impulse);
  PulseAura.loopHint(impulse);
  PulseAura.tagSync(impulse);
  PulseAura.syncHint(impulse);

  impulse.flags["aura_applied"] = true;

  return impulse;
}
