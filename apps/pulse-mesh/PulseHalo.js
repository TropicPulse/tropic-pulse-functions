// ============================================================================
// [pulse:halo] PULSE_OS_AWARENESS_RING v7.4  // white
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
    version: 7.4,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,                 // mental + system
      localAware: true,               // node-level awareness
      internetAware: true,            // cluster/mesh/global awareness

      advantageCascadeAware: true,    // inherits ANY advantage
      pulseEfficiencyAware: true,     // 1-pulse collapse, batching
      driftProof: true,
      multiInstanceReady: true,

      unifiedAdvantageField: true,    // no OR; all advantages ON
      futureEvolutionReady: true      // new safe advantages auto-inherited
    }
  }
};

// -----------------------------------------------------------
// COUNTER HOOKS (called by other organs)
// -----------------------------------------------------------

export const PulseHaloCounters = {
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

  // New: Flow throttling hook (called by PulseFlow)
  impulseThrottled() { HaloState.flow_throttles++; },
};

// -----------------------------------------------------------
// [pulse:halo] SNAPSHOT  // white
// -----------------------------------------------------------

export const PulseHalo = {
  snapshot() {
    return { ...HaloState };
  },

  // ---------------------------------------------------------
  // [pulse:halo] STATUS  // white
  // ---------------------------------------------------------

  status() {
    const s = this.snapshot();

    return {
      meta: s.meta,

      impulses: {
        total: s.impulses_total,
        completed: s.impulses_completed,
        completion_rate: this.#ratio(s.impulses_completed, s.impulses_total),
      },

      safety: {
        reflex_drops: s.reflex_drops,
        immune_quarantines: s.immune_quarantines,
        anomaly_rate: this.#ratio(
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
        avg_hops: this.#ratio(
          s.mesh_hops,
          s.impulses_completed || s.impulses_total
        ),
      },

      // New: Flow-level awareness
      flow: {
        throttles: s.flow_throttles,
        throttle_rate: this.#ratio(
          s.flow_throttles,
          s.impulses_total
        ),
      },

      health: {
        stability: this.#stability(s),
        drift_risk: this.#drift(s),
      },
    };
  },

  // ---------------------------------------------------------
  // [pulse:halo] BACKEND_AI_VIEW  // white
  // ---------------------------------------------------------

  statusForBackendAI() {
    return this.status();
  },

  // ---------------------------------------------------------
  // INTERNAL HELPERS (metadata-only heuristics)
  // ---------------------------------------------------------

  #ratio(n, d) {
    return d ? n / d : 0;
  },

  #stability(s) {
    const anomalies =
      s.reflex_drops + s.immune_quarantines + s.aura_loops;
    const volume = s.impulses_total || 1;
    const ratio = anomalies / volume;
    return Math.max(0, 1 - Math.min(1, ratio)); // 0–1
  },

  #drift(s) {
    const loops = s.aura_loops || 0;
    const syncs = s.aura_syncs || 0;
    const base = loops / ((s.impulses_total || 1));
    const sync_protect = Math.min(0.5, syncs / ((s.impulses_total || 1)));
    return Math.max(0, Math.min(1, base - sync_protect)); // 0–1
  },
};
