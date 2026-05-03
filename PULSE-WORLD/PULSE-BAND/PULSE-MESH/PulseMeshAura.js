// ============================================================================
// FILE: /organs/aura/PulseMeshAura-v15-EVO-IMMORTAL.js
// [pulse:mesh] PULSE_MESH_AURA v15-EVO-IMMORTAL  // violet
// System-wide Field Layer • Stabilization Loops • Multi-Instance Resonance
// Metadata-only • Zero Compute • Zero Payload Mutation (flags-only)
// Presence-aware • Binary-aware • Advantage-cascade-aware
// ============================================================================
//
// IDENTITY — THE AURA FIELD (v15-EVO-IMMORTAL):
//  --------------------------------------------
//  • Organism-wide field surrounding all pulses and instances.
//  • Provides stabilization loops (loop field).
//  • Provides multi-instance resonance (sync field).
//  • Senses Flow pressure + recent throttles → adaptive stabilization hints.
//  • Senses mesh factoring pressure → factoring hints for mesh/organs.
//  • Metadata-only: tags, hints, and gentle shaping fields (flags-only).
//  • Advantage-cascade aware: inherits ANY systemic advantage automatically.
//  • Binary-aware + Presence-aware: tags pulses with band + presence origin.
//  • Fully deterministic: same impulse + same AuraState → same aura tags.
//  • Zero randomness, zero timestamps, zero async, zero network, zero FS.
//
// SAFETY CONTRACT (v15):
//  ----------------------
//  • No randomness
//  • No timestamps
//  • No payload mutation (flags-only metadata shaping)
//  • No async
//  • No network, no filesystem, no env access
//  • Fail-open: missing fields → safe defaults
//  • Deterministic: same impulse + same AuraState → same aura tags
//  • Zero imports for logic — external deps only via callers
//  • Presence-aware but presence stays in metadata only
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshAura",
  version: "v14.9-MESH-AURA-IMMORTAL",
  layer: "mesh",
  role: "mesh_aura_engine",
  lineage: "PulseMesh-v14",

  evo: {
    meshAura: true,                 // This IS the mesh aura organ
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Reads mesh topology
    binaryAware: true,              // Binary artery + binary mesh
    advantageAware: true,           // Advantage cascade fields
    chunkPrewarmReady: true,        // Chunk/prewarm integration
    deterministic: true,            // No randomness
    driftProof: true,               // No drift in aura fields
    zeroRandomness: true,           // Aura must be stable
    zeroAsync: true,                // Aura must be synchronous
    zeroMutationOfInput: true,      // Never mutate presence/mesh objects
    zeroNetworkFetch: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseMeshPresenceRelay",
      "PulsePresence",
      "PresenceAwareness",
      "PresenceAIView"
    ],
    never: [
      "legacyMeshAura",
      "legacyPresenceAura",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// -----------------------------------------------------------
// Aura State (global, metadata-only)
// -----------------------------------------------------------
const AuraState = {
  loopStrength: 0.0,          // 0..1: how aggressively we loop drifted impulses
  loopMaxDepth: 3,            // max loop passes before we stop tagging loops

  instanceId: "instance-1",   // logical instance identifier
  clusterId: "cluster-default",
  syncStrength: 0.0,          // 0..1: how strongly we prefer sync across instances

  flowPressure: 0.0,          // 0..1: perceived mesh/flow pressure
  recentThrottleRate: 0.0,    // 0..1: recent throttling intensity

  // Binary-awareness knobs
  binaryPreference: 0.0,      // 0..1: how strongly we prefer binary routes
  binaryMeshReady: true,      // whether mesh has binary counterpart
  binaryOSReady: true,        // whether OS has binary counterpart

  // Presence-awareness knobs
  presenceBand: "symbolic",           // "symbolic" | "binary" | "dual"
  presenceTag: "PulseMeshAura-v15",   // origin tag for aura application

  meta: {
    layer: "PulseMeshAura",
    role: "AURA_FIELD",
    version: "15-EVO-IMMORTAL",
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

      // Binary + Presence additions
      binaryAware: true,
      binaryMeshReady: true,
      binaryOSReady: true,
      pulseMesh11Ready: true,
      presenceAware: true,
      bandAware: true
    }
  }
};


// -----------------------------------------------------------
// Aura Control (trusted writers only, metadata-only)
//   • All setters are clamp/validate-only, no side effects.
//   • Used by higher layers (Flow, Presence, Mesh) to tune aura.
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
  setPresenceBand(band) {
    if (band === "symbolic" || band === "binary" || band === "dual") {
      AuraState.presenceBand = band;
    }
  },
  setPresenceTag(tag) {
    if (typeof tag === "string" && tag) {
      AuraState.presenceTag = tag;
    }
  },
  snapshot() {
    // Shallow clone; metadata-only, safe for AI surfaces.
    return {
      ...AuraState,
      meta: {
        ...AuraState.meta,
        evo: { ...AuraState.meta.evo }
      }
    };
  }
};


// -----------------------------------------------------------
// Aura Pack: loop + sync + stabilization + binary + presence hints
//   • Each function is pure metadata shaping (flags-only).
//   • No payload mutation, no compute beyond simple thresholds.
// -----------------------------------------------------------
export const PulseAura = {

  // Stabilization sensing: mark tension + stabilization need.
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

  // Loop tagging: mark impulses that should re-enter stabilizing loops.
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

  // Loop hint: prefer stable routes when in loop.
  loopHint(impulse) {
    if (!impulse.flags?.aura_in_loop) return impulse;
    impulse.flags["aura_prefers_stable_routes"] = true;
    return impulse;
  },

  // Sync tagging: attach instance + cluster identity.
  tagSync(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_instance"] = AuraState.instanceId;
    impulse.flags["aura_cluster"] = AuraState.clusterId;
    return impulse;
  },

  // Sync hint: mark impulses as sync candidates when syncStrength > 0.
  syncHint(impulse) {
    if (AuraState.syncStrength <= 0) return impulse;
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_sync_candidate"] = true;
    return impulse;
  },

  // Factoring hint: suggest factored paths under pressure/throttle.
  factoringHint(impulse) {
    const p = AuraState.flowPressure;
    const t = AuraState.recentThrottleRate;

    if (p <= 0.3 && t <= 0.1) return impulse;

    impulse.flags = impulse.flags || {};
    impulse.flags["aura_prefers_factored_paths"] = true;
    impulse.flags["aura_factoring_bias"] = clamp01((p + t) / 2);

    return impulse;
  },

  // Binary-awareness hinting: bias toward binary mesh/OS when ready.
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
  },

  // Presence-awareness hinting (band + origin tag).
  presenceHint(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags["aura_presence_band"] = AuraState.presenceBand;
    impulse.flags["aura_presence_tag"] = AuraState.presenceTag;
    return impulse;
  }
};


// -----------------------------------------------------------
// Aura Engine (applied per impulse)
//   • Single entrypoint for the organism.
//   • Attaches aura_meta + all aura hints in a deterministic order.
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
  PulseAura.presenceHint(impulse);

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
