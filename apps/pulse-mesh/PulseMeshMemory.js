// ============================================================================
// [pulse:mesh] COMMUNITY_MEMORY_LAYER v8.0  // yellow
// Long-Term Pattern Retention • Metadata-Only • Evolution Support
// ============================================================================
//
// IDENTITY — THE MEMORY LAYER:
//  ----------------------------
//  • Long-term retention of routing patterns and impulse outcomes.
//  • Stores metadata-only "memories" of what worked and what failed.
//  • Used by Cortex, Tendons, Organs, Mesh, and Immune for evolution.
//  • NEVER computes payloads, NEVER mutates data content.
//  • Pure pattern retention for system-wide improvement.
//
// THEME:
//  • Color: Yellow (memory, retention, long-term shaping).
//  • Subtheme: Patterns, outcomes, evolution.
//
// SAFETY CONTRACT:
//  • Metadata-only.
//  • No payload access.
//  • No routing override.
//  • No autonomy, no sentience.
//  • Deterministic, drift-proof retention.
//
// ADVANTAGE CASCADE:
//  • Inherits ANY advantage from ANY organ automatically.
//  • Dual-mode: mental clarity + system efficiency.
//  • Local-aware: node-level memory context.
//  • Internet-aware: cluster/mesh/global memory context.
//  • Unified-advantage-field: ALL advantages active unless unsafe.
//  • Future-evolution-ready: new safe advantages auto-inherited.
// ============================================================================


// -----------------------------------------------------------
// Memory Store (in-memory, metadata-only)
// -----------------------------------------------------------

export const MemoryStore = {
  routes: new Map(),      // routeKey -> { success, fail, lastScore }
  earners: new Map(),     // earnerId -> { success, fail, avgScore }
  organs: new Map(),      // organId -> { count, anomalyCount }
  reflexes: new Map(),    // reflexName -> { triggered, drops }

  // v8.0 — mesh-aware metadata (for dashboards / immunity)
  mesh: {
    hops: [],
    stalls: [],
    drops: [],
    missingNodes: []
  },

  meta: {
    layer: "PulseMemory",
    role: "LONG_TERM_MEMORY",
    version: 8.0,
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
// Memory Helpers
// -----------------------------------------------------------

function getOrInit(map, key, init) {
  if (!map.has(key)) map.set(key, { ...init });
  return map.get(key);
}


// -----------------------------------------------------------
// Memory Pack: what we record
// -----------------------------------------------------------

export const PulseMemory = {
  recordRoute(impulse) {
    const entry = impulse.entryNodeId ?? "unknown";
    const delivered = impulse.flags?.delivered_to ?? "none";
    const key = `${entry}->${delivered}`;

    const mem = getOrInit(MemoryStore.routes, key, {
      success: 0,
      fail: 0,
      lastScore: 0
    });

    if (impulse.flags?.delivered_to) mem.success++;
    else mem.fail++;

    mem.lastScore = impulse.score || 0;
  },

  recordEarner(impulse) {
    const earnerId = impulse.flags?.delivered_to;
    if (!earnerId) return;

    const mem = getOrInit(MemoryStore.earners, earnerId, {
      success: 0,
      fail: 0,
      avgScore: 0
    });

    mem.success++;
    mem.avgScore = (mem.avgScore + (impulse.score || 0)) / 2;
  },

  recordOrgans(impulse) {
    const organs = impulse.organs || [];
    for (const organId of organs) {
      const mem = getOrInit(MemoryStore.organs, organId, {
        count: 0,
        anomalyCount: 0
      });

      mem.count++;
      if (impulse.flags?.cortex_anomaly) mem.anomalyCount++;
    }
  },

  recordReflexes(impulse) {
    const flags = impulse.flags || {};
    for (const key of Object.keys(flags)) {
      if (!key.startsWith("reflex_")) continue;

      const mem = getOrInit(MemoryStore.reflexes, key, {
        triggered: 0,
        drops: 0
      });

      mem.triggered++;
      if (key.endsWith("_drop")) mem.drops++;
    }
  },

  // v8.0 — mesh-aware memory hooks (metadata-only)
  recordMeshMeta(impulse) {
    const flags = impulse.flags || {};

    if (typeof impulse.hops === "number") {
      MemoryStore.mesh.hops.push({
        ts: Date.now(),
        hops: impulse.hops
      });
    }

    Object.keys(flags).forEach((k) => {
      if (k.startsWith("stalled_at_")) {
        MemoryStore.mesh.stalls.push({
          ts: Date.now(),
          node: k.replace("stalled_at_", "")
        });
      }
      if (k.startsWith("reflex_drop_at_")) {
        MemoryStore.mesh.drops.push({
          ts: Date.now(),
          node: k.replace("reflex_drop_at_", "")
        });
      }
      if (k.startsWith("missing_node_")) {
        MemoryStore.mesh.missingNodes.push({
          ts: Date.now(),
          node: k.replace("missing_node_", "")
        });
      }
    });
  }
};


// -----------------------------------------------------------
// Memory Engine
// -----------------------------------------------------------

export function applyPulseMemory(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.flags.memory_meta = MemoryStore.meta;

  PulseMemory.recordRoute(impulse);
  PulseMemory.recordEarner(impulse);
  PulseMemory.recordOrgans(impulse);
  PulseMemory.recordReflexes(impulse);
  PulseMemory.recordMeshMeta(impulse);

  impulse.flags.memory_recorded = true;

  return impulse;
}


// -----------------------------------------------------------
// Snapshot — read-only view for dashboards / immunity
// -----------------------------------------------------------

export function getMemorySnapshot() {
  return {
    meta: MemoryStore.meta,
    routes: MemoryStore.routes.size,
    earners: MemoryStore.earners.size,
    organs: MemoryStore.organs.size,
    reflexes: MemoryStore.reflexes.size,
    mesh: {
      hopsCount: MemoryStore.mesh.hops.length,
      stallsCount: MemoryStore.mesh.stalls.length,
      dropsCount: MemoryStore.mesh.drops.length,
      missingNodesCount: MemoryStore.mesh.missingNodes.length
    }
  };
}
