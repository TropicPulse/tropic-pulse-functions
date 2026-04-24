// ============================================================================
// FILE: /apps/organs/aura/PulseMeshAura.js
// [pulse:mesh] PULSE_MESH_AURA v11-Evo  // violet
// System-wide Field Layer • Stabilization Loops • Multi-Instance Resonance
// Metadata-only • Zero Compute • Zero Payload Mutation
// ============================================================================
//
// IDENTITY — THE AURA FIELD (v11-Evo):
//  -----------------------------------
//  • Organism-wide field surrounding all pulses and instances.
//  • Provides stabilization loops (loop field).
//  • Provides multi-instance resonance (sync field).
//  • Senses Flow pressure + recent throttles → adaptive stabilization.
//  • Senses mesh factoring pressure → factoring hints.
//  • Metadata-only: tags, hints, and gentle shaping fields.
//  • Advantage-cascade aware: inherits ANY systemic advantage automatically.
//  • Binary-aware: can tag pulses as binary-ready / binary-preferred.
//  • Fully deterministic: same impulse → same aura tags.
//  • Zero randomness, zero timestamps, zero async.
//
// SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No randomness
//  • No timestamps
//  • No payload mutation (flags-only metadata shaping)
//  • No async
//  • Fail-open: missing fields → safe defaults
//  • Deterministic: same impulse → same aura tags
//  • Zero imports — zero external dependencies
// ============================================================================


// -----------------------------------------------------------
// Aura State (global, metadata-only)
// -----------------------------------------------------------
const AuraState = {
  loopStrength: 0.0,
  loopMaxDepth: 3,

  instanceId: "instance-1",
  clusterId: "cluster-default",
  syncStrength: 0.0,

  flowPressure: 0.0,
  recentThrottleRate: 0.0,

  // Binary-awareness knobs (v11-Evo)
  binaryPreference: 0.0,   // 0..1: how strongly we prefer binary routes
  binaryMeshReady: true,   // whether mesh has binary counterpart
  binaryOSReady: true,     // whether OS has binary counterpart

  meta: {
    layer: "PulseMeshAura",
    role: "AURA_FIELD",
    version: "11.0-Evo",
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
      signalFactoringAware: true,
      deterministicField: true,
      zeroCompute: true,
      zeroMutation: true,

      // v11-Evo additions
      binaryAware: true,
      binaryMeshReady: true,
      binaryOSReady: true,
      pulseMesh11Ready: true
    }
  }
};


// -----------------------------------------------------------
// Aura Control (trusted writers only, metadata-only)
// -----------------------------------------------------------
export const PulseAuraControl = {
  setLoopStrength(v) {
    AuraState.loopStrength = clamp01(v);
  },
  setLoopMaxDepth(d) {
    AuraState.loopMaxDepth = Number.isFinite(d) ? Math.max(0, d) : AuraState.loopMaxDepth;
  },
  setSyncStrength(v) {
    AuraState.syncStrength = clamp01(v);
  },
  setInstanceId(id) {
    if (typeof id === "string" && id) AuraState.instanceId = id;
  },
  setClusterId(id) {
    if (typeof id === "string" && id) AuraState.clusterId = id;
  },
  setFlowPressure(v) {
    AuraState.flowPressure = clamp01(v);
  },
  setRecentThrottleRate(v) {
    AuraState.recentThrottleRate = clamp01(v);
  },
  setBinaryPreference(v) {
    AuraState.binaryPreference = clamp01(v);
  },
  snapshot() {
    return { ...AuraState };
  }
};


// -----------------------------------------------------------
// Aura Pack: loop + sync + stabilization + binary hints
// -----------------------------------------------------------
export const PulseAura = {

  senseStabilization(impulse) {
    const p = AuraState.flowPressure;
    const t = AuraState.recentThrottleRate;

    impulse.flags = impulse.flags || {};

    if (p > 0.3 || t > 0.1) {
      impulse.flags["aura_system_under_tension"] = true;
    }

    if (p > 0.5 || t > 0.2) {
      impulse.flags["aura_stabilization_needed"] = true;
    }

    return impulse;
  },

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

  loopHint(impulse) {
    if (!impulse.flags?.aura_in_loop) return impulse;
    impulse.flags["aura_prefers_stable_routes"] = true;
    return impulse;
  },

  tagSync(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_instance"] = AuraState.instanceId;
    impulse.flags["aura_cluster"] = AuraState.clusterId;
    return impulse;
  },

  syncHint(impulse) {
    if (AuraState.syncStrength <= 0) return impulse;
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_sync_candidate"] = true;
    return impulse;
  },

  factoringHint(impulse) {
    const p = AuraState.flowPressure;
    const t = AuraState.recentThrottleRate;

    if (p <= 0.3 && t <= 0.1) return impulse;

    impulse.flags = impulse.flags || {};
    impulse.flags["aura_prefers_factored_paths"] = true;
    impulse.flags["aura_factoring_bias"] = clamp01((p + t) / 2);

    return impulse;
  },

  // v11-Evo: binary-awareness hinting
  binaryHint(impulse) {
    impulse.flags = impulse.flags || {};

    if (AuraState.binaryPreference > 0 && AuraState.binaryMeshReady) {
      impulse.flags["aura_prefers_binary_mesh"] = true;
      impulse.flags["aura_binary_mesh_bias"] = AuraState.binaryPreference;
    }

    if (AuraState.binaryOSReady) {
      impulse.flags["aura_binary_os_available"] = true;
    }

    return impulse;
  }
};


// -----------------------------------------------------------
// Aura Engine (applied per impulse)
// -----------------------------------------------------------
export function applyPulseAura(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.flags.aura_meta = AuraState.meta;

  PulseAura.senseStabilization(impulse);
  PulseAura.tagLoop(impulse);
  PulseAura.loopHint(impulse);
  PulseAura.tagSync(impulse);
  PulseAura.syncHint(impulse);
  PulseAura.factoringHint(impulse);
  PulseAura.binaryHint(impulse);

  impulse.flags["aura_applied"] = true;

  return impulse;
}


// -----------------------------------------------------------
// Helper
// -----------------------------------------------------------
function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
