// ============================================================================
// FILE: PulseHalo-v15-EVO-IMMORTAL.js
// PULSE HALO — AWARENESS RING
// System-wide Awareness Ring • Mesh + Presence + Advantage Telemetry
// Metadata-only • Zero Compute (no heavy logic) • Zero Payload Access
// Presence-aware • Binary-aware • Advantage-cascade-aware
// ============================================================================
//
// IDENTITY — THE HALO FIELD (v15-EVO-IMMORTAL):
//  --------------------------------------------
//  • Organism-wide awareness ring around all impulses and mesh activity.
//  • Counts, classifies, and summarizes behavior — never touches payloads.
//  • Dual-mode aware: symbolic / binary / dual-mode impulses.
//  • Presence-band aware: symbolic / binary / dual presence bands.
//  • Advantage-field aware: factored paths, binary preference, advantage events.
//  • Feeds dashboards, AI views, and health indicators (stability, drift).
//  • Fully deterministic: same sequence of counter calls → same HaloState.
//  • Zero randomness, zero timestamps, zero async, zero network, zero FS.
//
// SAFETY CONTRACT (v15):
//  ----------------------
//  • No randomness
//  • No timestamps
//  • No payload access (metadata-only counters)
//  • No async
//  • No network, no filesystem, no env access
//  • Fail-open: missing fields → safe defaults
//  • Deterministic: same counter calls → same HaloState
//  • Zero imports — CNS injects everything
//  • Presence-aware and band-aware only via metadata
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshAwareness",
  version: "v14.9-MESH-AWARENESS",
  layer: "mesh",
  role: "mesh_sensory_awareness",
  lineage: "PulseMesh-v14",

  evo: {
    meshAware: true,                // Reads mesh topology + hops
    presenceAware: true,            // Reads presence field
    binaryAware: true,              // Binary mesh signals
    dualBand: true,                 // Symbolic + binary sensing
    deterministic: true,            // No randomness in awareness
    driftProof: true,               // Awareness must be stable
    zeroMutationOfInput: true,      // Never mutate mesh/presence objects
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshPresenceRelay",
      "PulsePresence",
      "PulseMeshAura"
    ],
    never: [
      "legacyMeshAwareness",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
//  (Awareness Ring MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseHalo({ log, warn, error } = {}) {

  // -----------------------------------------------------------
  // INTERNAL STATE (metadata-only counters)
  //   • No payloads, no identities, only aggregate counts.
// -----------------------------------------------------------
  const HaloState = {
    impulses_total: 0,
    impulses_completed: 0,

    // dual-mode awareness (symbolic vs binary vs dual)
    impulses_symbolic: 0,
    impulses_binary: 0,
    impulses_dual_mode: 0,

    reflex_drops: 0,
    immune_quarantines: 0,

    aura_loops: 0,
    aura_syncs: 0,

    hormone_boosts: 0,
    hormone_damps: 0,

    memory_writes: 0,

    mesh_hops: 0,

    flow_throttles: 0,

    // factoring awareness
    factoring_collapse_events: 0,
    factoring_bias_high: 0,
    factored_path_uses: 0,

    // presence / band awareness (metadata-only)
    presence_symbolic: 0,
    presence_binary: 0,
    presence_dual: 0,

    // advantage-field awareness (metadata-only)
    advantage_events: 0,
    advantage_binary_pref: 0,
    advantage_factored_paths: 0,

    meta: {
      layer: "PulseHalo",
      role: "AWARENESS_RING",
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

        zeroCompute: true,           // no heavy compute, only ratios/heuristics
        zeroMutation: true,          // never mutates external objects
        zeroRoutingInfluence: true,  // awareness-only, no routing decisions

        // binary + presence awareness
        binaryAware: true,
        binaryMeshReady: true,
        binaryOSReady: true,
        presenceAware: true,
        bandAware: true
      }
    }
  };


  // -----------------------------------------------------------
  // COUNTER HOOKS (called by other organs)
  //  (metadata-only, no payload access)
// -----------------------------------------------------------
  const PulseHaloCounters = {
    // Called when an impulse starts its journey.
    impulseStarted({ mode, band, presenceTag } = {}) {
      HaloState.impulses_total++;
      classifyMode(mode);
      classifyBand(band);
      trackPresenceTag(presenceTag);
    },

    // Called when an impulse completes successfully.
    impulseCompleted() {
      HaloState.impulses_completed++;
    },

    // Safety-related events.
    reflexDropped() {
      HaloState.reflex_drops++;
    },
    immuneQuarantined() {
      HaloState.immune_quarantines++;
    },

    // Aura-related events.
    auraLooped() {
      HaloState.aura_loops++;
    },
    auraSyncTagged() {
      HaloState.aura_syncs++;
    },

    // Hormone modulation events.
    hormoneBoost() {
      HaloState.hormone_boosts++;
    },
    hormoneDamp() {
      HaloState.hormone_damps++;
    },

    // Memory events.
    memoryWrite() {
      HaloState.memory_writes++;
    },

    // Mesh traversal events.
    meshHops(count = 1) {
      HaloState.mesh_hops += count;
    },

    // Flow throttling events.
    impulseThrottled() {
      HaloState.flow_throttles++;
    },

    // Factoring events.
    factoringCollapsedManyToOne() {
      HaloState.factoring_collapse_events++;
    },
    factoringBiasHigh() {
      HaloState.factoring_bias_high++;
    },
    factoredPathUsed() {
      HaloState.factored_path_uses++;
      HaloState.advantage_factored_paths++;
      HaloState.advantage_events++;
    },

    // Advantage-field hooks (metadata-only).
    advantageBinaryPreferred() {
      HaloState.advantage_binary_pref++;
      HaloState.advantage_events++;
    }
  };


  // -----------------------------------------------------------
  // MODE CLASSIFICATION (symbolic vs binary vs dual)
// -----------------------------------------------------------
  function classifyMode(mode) {
    if (!mode) return;
    if (mode === "binary") {
      HaloState.impulses_binary++;
    } else if (mode === "symbolic") {
      HaloState.impulses_symbolic++;
    } else if (mode === "dual") {
      HaloState.impulses_dual_mode++;
    }
  }

  // -----------------------------------------------------------
  // BAND / PRESENCE CLASSIFICATION (metadata-only)
// -----------------------------------------------------------
  function classifyBand(band) {
    if (!band) return;
    if (band === "binary") {
      HaloState.presence_binary++;
    } else if (band === "symbolic") {
      HaloState.presence_symbolic++;
    } else if (band === "dual") {
      HaloState.presence_dual++;
    }
  }

  function trackPresenceTag(_presenceTag) {
    // Intentionally no storage of tag values — only counts via band.
    // Keeps Halo strictly metadata-aggregate, no identity registry.
  }


  // -----------------------------------------------------------
  // SNAPSHOT (read-only)
// -----------------------------------------------------------
  function snapshot() {
    // Shallow clone; safe for dashboards + AI views.
    return {
      ...HaloState,
      meta: {
        ...HaloState.meta,
        evo: { ...HaloState.meta.evo }
      }
    };
  }


  // -----------------------------------------------------------
  // STATUS (dashboard view)
// -----------------------------------------------------------
  function status() {
    const s = snapshot();

    return {
      meta: s.meta,

      impulses: {
        total: s.impulses_total,
        completed: s.impulses_completed,
        completion_rate: ratio(s.impulses_completed, s.impulses_total),

        symbolic: s.impulses_symbolic,
        binary: s.impulses_binary,
        dual_mode: s.impulses_dual_mode,

        symbolic_ratio: ratio(s.impulses_symbolic, s.impulses_total),
        binary_ratio: ratio(s.impulses_binary, s.impulses_total),
        dual_mode_ratio: ratio(s.impulses_dual_mode, s.impulses_total)
      },

      safety: {
        reflex_drops: s.reflex_drops,
        immune_quarantines: s.immune_quarantines,
        anomaly_rate: ratio(
          s.reflex_drops + s.immune_quarantines,
          s.impulses_total
        )
      },

      aura: {
        loops: s.aura_loops,
        syncs: s.aura_syncs
      },

      hormones: {
        boosts: s.hormone_boosts,
        damps: s.hormone_damps,
        modulation_events: s.hormone_boosts + s.hormone_damps
      },

      memory: {
        writes: s.memory_writes
      },

      mesh: {
        hops: s.mesh_hops,
        avg_hops: ratio(
          s.mesh_hops,
          s.impulses_completed || s.impulses_total
        )
      },

      flow: {
        throttles: s.flow_throttles,
        throttle_rate: ratio(
          s.flow_throttles,
          s.impulses_total
        )
      },

      factoring: {
        collapse_events: s.factoring_collapse_events,
        bias_high_events: s.factoring_bias_high,
        factored_path_uses: s.factored_path_uses,
        collapse_rate: ratio(
          s.factoring_collapse_events,
          s.impulses_total
        )
      },

      presence: {
        symbolic: s.presence_symbolic,
        binary: s.presence_binary,
        dual: s.presence_dual,
        symbolic_ratio: ratio(s.presence_symbolic, s.impulses_total),
        binary_ratio: ratio(s.presence_binary, s.impulses_total),
        dual_ratio: ratio(s.presence_dual, s.impulses_total)
      },

      advantage: {
        events: s.advantage_events,
        binary_preference_events: s.advantage_binary_pref,
        factored_path_advantage_events: s.advantage_factored_paths
      },

      health: {
        stability: stability(s),
        drift_risk: drift(s)
      }
    };
  }


  // -----------------------------------------------------------
  // BACKEND_AI_VIEW (same as status, AI-facing)
// -----------------------------------------------------------
  function statusForBackendAI() {
    return status();
  }


  // -----------------------------------------------------------
  // INTERNAL HELPERS (metadata-only heuristics)
// -----------------------------------------------------------
  function ratio(n, d) {
    return d ? n / d : 0;
  }

  // Stability: 1 - anomaly density (clamped to [0,1]).
  function stability(s) {
    const anomalies =
      s.reflex_drops + s.immune_quarantines + s.aura_loops;
    const volume = s.impulses_total || 1;
    const r = anomalies / volume;
    return Math.max(0, 1 - Math.min(1, r));
  }

  // Drift: loop density minus sync protection (clamped to [0,1]).
  function drift(s) {
    const loops = s.aura_loops || 0;
    const syncs = s.aura_syncs || 0;
    const volume = s.impulses_total || 1;

    const base = loops / volume;
    const sync_protect = Math.min(0.5, syncs / volume);

    return Math.max(0, Math.min(1, base - sync_protect));
  }


  // -----------------------------------------------------------
  // PUBLIC INTERFACE
  // -----------------------------------------------------------
  return {
    counters: PulseHaloCounters,
    snapshot,
    status,
    statusForBackendAI,
    meta: HaloState.meta
  };
}
