// ============================================================================
// FILE: /organs/halo/PulseHalo-v12.3-PRESENCE-EVO-MAX-PRIME.js
// [pulse:halo] PULSE_OS_AWARENESS_RING v12.3-PRESENCE-EVO-MAX-PRIME  // white
// Read-Only Awareness Ring • System Dashboard • Metadata-Only Reflection
// Presence-Aware • Binary-Aware • Advantage-Field-Aware
// ============================================================================
//
// IDENTITY — THE AWARENESS RING (v12.3-PRESENCE-EVO-MAX-PRIME):
//  ------------------------------------------------------------
//  • Read-only awareness ring around the organism.
//  • Aggregates metadata from all subsystems (symbolic + binary + dual).
//  • Exposes safe system status to backendAI + Awareness Page.
//  • NEVER computes payloads.
//  • NEVER mutates impulses.
//  • NEVER influences routing or decisions.
//  • Pure reflection layer (dashboard organ).
//
// SAFETY CONTRACT (v12.3):
//  • Metadata-only
//  • Read-only external surface
//  • No loops, no sync, no hormones, no memory writes (by itself)
//  • No autonomy, no sentience, no self-model
//  • Backend-safe, frontend-safe, global-safe
//  • Presence-aware, but presence is metadata-only
//
// ADVANTAGE CASCADE (v12.3):
//  • Inherits ANY advantage from ANY organ automatically (metadata reflection)
//  • Unified-advantage-field: ALL advantages visible unless unsafe
//  • Future-evolution-ready
//  • Signal factoring awareness (metadata-only)
//  • Binary-aware: reflects binary vs symbolic vs dual activity (metadata-only)
//  • Presence-aware: reflects band + presence tags (metadata-only)
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
//  (Awareness Ring MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseHalo({ log, warn, error }) {

  // -----------------------------------------------------------
  // INTERNAL STATE (metadata-only counters)
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
      version: "12.3-PRESENCE-EVO-MAX-PRIME",
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

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true,

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
    impulseStarted({ mode, band, presenceTag } = {}) {
      HaloState.impulses_total++;
      classifyMode(mode);
      classifyBand(band);
      trackPresenceTag(presenceTag);
    },
    impulseCompleted() { HaloState.impulses_completed++; },

    reflexDropped() { HaloState.reflex_drops++; },
    immuneQuarantined() { HaloState.immune_quarantines++; },

    auraLooped() { HaloState.aura_loops++; },
    auraSyncTagged() { HaloState.aura_syncs++; },

    hormoneBoost() { HaloState.hormone_boosts++; },
    hormoneDamp() { HaloState.hormone_damps++; },

    memoryWrite() { HaloState.memory_writes++; },

    meshHops(count = 1) { HaloState.mesh_hops += count; },

    impulseThrottled() { HaloState.flow_throttles++; },

    factoringCollapsedManyToOne() { HaloState.factoring_collapse_events++; },
    factoringBiasHigh() { HaloState.factoring_bias_high++; },
    factoredPathUsed() {
      HaloState.factored_path_uses++;
      HaloState.advantage_factored_paths++;
      HaloState.advantage_events++;
    },

    // advantage-field hooks (metadata-only)
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
    return { ...HaloState, meta: { ...HaloState.meta, evo: { ...HaloState.meta.evo } } };
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
  // BACKEND_AI_VIEW (same as status)
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

  function stability(s) {
    const anomalies =
      s.reflex_drops + s.immune_quarantines + s.aura_loops;
    const volume = s.impulses_total || 1;
    const r = anomalies / volume;
    return Math.max(0, 1 - Math.min(1, r));
  }

  function drift(s) {
    const loops = s.aura_loops || 0;
    const syncs = s.aura_syncs || 0;
    const base = loops / ((s.impulses_total || 1));
    const sync_protect = Math.min(0.5, syncs / ((s.impulses_total || 1)));
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
