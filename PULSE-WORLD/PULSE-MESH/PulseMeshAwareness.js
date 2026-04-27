// ============================================================================
// [pulse:halo] PULSE_OS_AWARENESS_RING v11-Evo  // white
// Read-Only Awareness Ring • System Dashboard • Metadata-Only Reflection
// ============================================================================
//
// IDENTITY — THE AWARENESS RING (v11-Evo):
//  ---------------------------------------
//  • Read-only awareness ring around the organism.
//  • Aggregates metadata from all subsystems (symbolic + binary).
//  • Exposes safe system status to backendAI + Awareness Page.
//  • NEVER computes payloads.
//  • NEVER mutates impulses.
//  • NEVER influences routing or decisions.
//  • Pure reflection layer (dashboard organ).
//
// SAFETY CONTRACT (v11-Evo):
//  • Metadata-only
//  • Read-only external surface
//  • No loops, no sync, no hormones, no memory writes (by itself)
//  • No autonomy, no sentience, no self-model
//  • Backend-safe, frontend-safe, global-safe
//
// ADVANTAGE CASCADE (v11-Evo):
//  • Inherits ANY advantage from ANY organ automatically
//  • Unified-advantage-field: ALL advantages active unless unsafe
//  • Future-evolution-ready
//  • Signal factoring awareness (metadata-only)
//  • Binary-aware: can reflect binary vs symbolic activity (metadata-only)
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

    // v11-Evo: dual-mode awareness (symbolic vs binary)
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

    meta: {
      layer: "PulseHalo",
      role: "AWARENESS_RING",
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

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true,

        // v11-Evo additions
        binaryAware: true,
        binaryMeshReady: true,
        binaryOSReady: true
      }
    }
  };


  // -----------------------------------------------------------
  // COUNTER HOOKS (called by other organs)
//  (metadata-only, no payload access)
// -----------------------------------------------------------
  const PulseHaloCounters = {
    impulseStarted({ mode } = {}) {
      HaloState.impulses_total++;
      classifyMode(mode);
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
    factoredPathUsed() { HaloState.factored_path_uses++; }
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
  // SNAPSHOT (read-only)
// -----------------------------------------------------------
  function snapshot() {
    return { ...HaloState };
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
