// ============================================================================
// [pulse:halo] PULSE_OS_AWARENESS_RING v9.1  // white
// Read-Only Awareness Ring • System Dashboard • Metadata-Only Reflection
// ============================================================================
//
// IDENTITY — THE AWARENESS RING:
//  ------------------------------
//  • Read-only awareness ring around the organism.
//  • Aggregates metadata from all subsystems.
//  • Exposes safe system status to backendAI + Awareness Page.
//  • NEVER computes payloads.
//  • NEVER mutates impulses.
//  • NEVER influences routing or decisions.
//  • Pure reflection layer (dashboard organ).
//
// THEME:
//  • Color: White (awareness, reflection, non-interference).
//  • Subtheme: Clarity, transparency, system-wide visibility.
//
// SAFETY CONTRACT:
//  • Metadata-only.
//  • Read-only external surface.
//  • No loops, no sync, no hormones, no memory writes.
//  • No autonomy, no sentience, no self-model.
//  • Backend-safe, frontend-safe, global-safe.
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • Inherits ANY advantage from ANY organ automatically.
//  • Dual-mode: mental clarity + system efficiency.
//  • Local-aware: node-level awareness signals.
//  • Internet-aware: cluster/mesh/global awareness signals.
//  • Unified-advantage-field: ALL advantages active unless unsafe.
//  • Future-evolution-ready: new safe advantages auto-inherited.
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

    reflex_drops: 0,
    immune_quarantines: 0,

    aura_loops: 0,
    aura_syncs: 0,

    hormone_boosts: 0,
    hormone_damps: 0,

    memory_writes: 0,

    mesh_hops: 0,

    // New: flow-level throttling awareness
    flow_throttles: 0,

    meta: {
      layer: "PulseHalo",
      role: "AWARENESS_RING",
      version: 9.1,
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
  // COUNTER HOOKS (called by other organs)
  // -----------------------------------------------------------
  const PulseHaloCounters = {
    impulseStarted() { HaloState.impulses_total++; },
    impulseCompleted() { HaloState.impulses_completed++; },

    reflexDropped() { HaloState.reflex_drops++; },

    immuneQuarantined() { HaloState.immune_quarantines++; },

    auraLooped() { HaloState.aura_loops++; },
    auraSyncTagged() { HaloState.aura_syncs++; },

    hormoneBoost() { HaloState.hormone_boosts++; },
    hormoneDamp() { HaloState.hormone_damps++; },

    memoryWrite() { HaloState.memory_writes++; },

    meshHops(count = 1) { HaloState.mesh_hops += count; },

    // Flow throttling hook
    impulseThrottled() { HaloState.flow_throttles++; },
  };


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
      },

      safety: {
        reflex_drops: s.reflex_drops,
        immune_quarantines: s.immune_quarantines,
        anomaly_rate: ratio(
          s.reflex_drops + s.immune_quarantines,
          s.impulses_total
        ),
      },

      aura: {
        loops: s.aura_loops,
        syncs: s.aura_syncs,
      },

      hormones: {
        boosts: s.hormone_boosts,
        damps: s.hormone_damps,
        modulation_events: s.hormone_boosts + s.hormone_damps,
      },

      memory: {
        writes: s.memory_writes,
      },

      mesh: {
        hops: s.mesh_hops,
        avg_hops: ratio(
          s.mesh_hops,
          s.impulses_completed || s.impulses_total
        ),
      },

      flow: {
        throttles: s.flow_throttles,
        throttle_rate: ratio(
          s.flow_throttles,
          s.impulses_total
        ),
      },

      health: {
        stability: stability(s),
        drift_risk: drift(s),
      },
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
    return Math.max(0, 1 - Math.min(1, r)); // 0–1
  }

  function drift(s) {
    const loops = s.aura_loops || 0;
    const syncs = s.aura_syncs || 0;
    const base = loops / ((s.impulses_total || 1));
    const sync_protect = Math.min(0.5, syncs / ((s.impulses_total || 1)));
    return Math.max(0, Math.min(1, base - sync_protect)); // 0–1
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
